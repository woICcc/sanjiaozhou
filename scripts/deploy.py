import paramiko
import sys
import os

sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf8', buffering=1)

HOST = '1.15.24.89'
USER = 'root'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

def run(cmd, show=True):
    _, stdout, stderr = ssh.exec_command(cmd)
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode(errors='replace').strip()
    err = stderr.read().decode(errors='replace').strip()
    if show:
        if out: print(out)
        if err: print(err)
    return out, err, exit_code

try:
    ssh.connect(HOST, username=USER)
    print('== 已连接服务器 ==')

    # 1. 安装依赖
    print('\n== 1/6 安装系统依赖 ==')
    run('dnf install -y git nginx 2>&1', show=False)
    run('dnf module reset nodejs -y 2>&1', show=False)
    run('dnf module enable nodejs:20 -y 2>&1', show=False)
    run('dnf install -y nodejs 2>&1', show=False)
    out, _, _ = run('node --version && npm --version && git --version && nginx -v')
    print(out)

    # 2. 克隆项目
    print('\n== 2/6 克隆项目 ==')
    run('cd /root && rm -rf sanjiaozhou')
    run('git clone https://github.com/woICcc/sanjiaozhou.git', show=False)
    out, _, _ = run('ls /root/sanjiaozhou/')
    print(f'文件: {out}')

    # 3. 安装依赖 & 构建
    print('\n== 3/6 安装项目依赖 ==')
    run('cd /root/sanjiaozhou/server && npm install 2>&1', show=False)
    out, _, _ = run('cd /root/sanjiaozhou/server && npm install 2>&1 | tail -3')
    print(out)

    run('cd /root/sanjiaozhou/client && npm install 2>&1', show=False)
    out, _, _ = run('cd /root/sanjiaozhou/client && npm install 2>&1 | tail -3')
    print(out)

    print('\n== 4/6 初始化数据库 ==')
    run('cd /root/sanjiaozhou/server && npx prisma db push 2>&1', show=False)
    out, _, _ = run('cd /root/sanjiaozhou/server && npx prisma db push 2>&1 | tail -3')
    print(out)

    # 种子数据
    run('cd /root/sanjiaozhou/server && node seed.js', show=False)
    out, _, _ = run('cd /root/sanjiaozhou/server && node seed.js')
    print(out)

    # 4. 构建前端
    print('\n== 5/6 构建前端 ==')
    out, _, _ = run('cd /root/sanjiaozhou/client && npx vite build 2>&1 | tail -5')
    print(out)

    # 5. 安装 PM2 并启动
    print('\n== 6/6 配置 PM2 和 Nginx ==')
    run('npm install -g pm2 2>&1', show=False)

    # 创建 PM2 启动配置
    pm2_config = '''
module.exports = {
  apps: [{
    name: "sanjiaozhou-api",
    cwd: "/root/sanjiaozhou/server",
    script: "node index.js",
    env: { NODE_ENV: "production", PORT: 3001 }
  }]
}
'''
    run(f'cat > /root/sanjiaozhou/ecosystem.config.js << "EOFSCRIPT"\n{pm2_config}\nEOFSCRIPT')

    # 先停旧的
    run('pm2 delete sanjiaozhou-api 2>/dev/null')
    run('cd /root/sanjiaozhou && pm2 start ecosystem.config.js 2>&1', show=False)
    run('pm2 save 2>&1', show=False)
    run('pm2 startup systemd -u root --hp /root 2>&1', show=False)

    out, _, _ = run('pm2 list')
    print(out)

    # 配置 Nginx
    nginx_conf = '''server {
    listen 80;
    server_name _;

    root /root/sanjiaozhou/client/dist;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
'''
    run(f'cat > /etc/nginx/conf.d/sanjiaozhou.conf << "EOFNGINX"\n{nginx_conf}\nEOFNGINX')
    run('nginx -t 2>&1', show=False)
    out, err, _ = run('nginx -t 2>&1')
    print(err or out)

    run('systemctl restart nginx 2>&1', show=False)
    run('systemctl enable nginx 2>&1', show=False)
    out, _, _ = run('systemctl status nginx --no-pager 2>&1 | head -5')
    print(out)

    # 防火墙放行
    run('firewall-cmd --permanent --add-service=http 2>/dev/null', show=False)
    run('firewall-cmd --reload 2>/dev/null', show=False)

    print('\n========================================')
    print('== 部署完成！访问 http://{HOST} ==')
    print('========================================')

except Exception as e:
    print(f'错误: {e}')
finally:
    ssh.close()
