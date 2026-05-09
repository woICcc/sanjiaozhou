import { Client } from 'ssh2';
import { readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';

const HOST = '1.15.24.89';
const USER = 'root';
const PASSWORD = 'chenairen123.';

async function runSSH() {
  const conn = new Client();

  return new Promise((resolve, reject) => {
    conn.on('ready', () => {
      console.log('✅ SSH 连接成功');

      // 先复制公钥
      const pubKey = readFileSync(`${homedir()}/.ssh/id_rsa.pub`, 'utf8').trim();
      const cmd = `mkdir -p ~/.ssh && echo '${pubKey}' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys`;

      conn.exec(cmd, (err, stream) => {
        if (err) { reject(err); return; }
        let output = '';
        stream.on('close', (code) => {
          console.log('✅ SSH 公钥已配置');
          conn.end();
          resolve(output);
        });
        stream.on('data', (d) => output += d.toString());
        stream.stderr.on('data', (d) => console.error(d.toString()));
      });
    });

    conn.on('error', (err) => {
      console.error('❌ 连接失败:', err.message);
      reject(err);
    });

    conn.connect({
      host: HOST,
      username: USER,
      password: PASSWORD,
      readyTimeout: 10000,
    });
  });
}

async function execCommand(conn, cmd) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) { reject(err); return; }
      let out = '';
      stream.on('close', (code) => resolve(out));
      stream.on('data', (d) => out += d.toString());
      stream.stderr.on('data', (d) => { /* ignore warnings */ });
    });
  });
}

async function deploy() {
  // 1. 配置 SSH 公钥
  await runSSH();
  console.log('✅ SSH 公钥部署完成，后续命令将使用密钥登录');

  // 2. 检查服务器环境
  const { execSync } = await import('child_process');
  const checkCmd = `ssh -o StrictHostKeyChecking=no root@${HOST} "
    echo '=== 系统信息 ===' && cat /etc/os-release 2>/dev/null | head -3 &&
    echo '=== Node ===' && node --version 2>/dev/null || echo 'Node 未安装' &&
    echo '=== NPM ===' && npm --version 2>/dev/null || echo 'NPM 未安装' &&
    echo '=== PM2 ===' && pm2 --version 2>/dev/null || echo 'PM2 未安装' &&
    echo '=== Nginx ===' && nginx -v 2>&1 || echo 'Nginx 未安装' &&
    echo '=== Git ===' && git --version
  "`;

  const result = execSync(checkCmd, { encoding: 'utf8', timeout: 15000 });
  console.log(result);
}

deploy().catch(console.error);
