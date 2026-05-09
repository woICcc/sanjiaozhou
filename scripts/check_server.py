import paramiko
import os
import sys

sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf8', buffering=1)

HOST = '1.15.24.89'
USER = 'root'
PASS = 'chenairen123.'
KEY_PATH = os.path.expanduser('~/.ssh/id_rsa.pub')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    ssh.connect(HOST, username=USER, password=PASS)
    print('== SSH 连接成功 ==')

    with open(KEY_PATH) as f:
        pub_key = f.read().strip()

    cmd = f'mkdir -p ~/.ssh && echo "{pub_key}" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys'
    _, stdout, _ = ssh.exec_command(cmd)
    stdout.channel.recv_exit_status()
    print('== SSH 公钥已配置 ==')

    cmds = [
        'echo "=== 系统 ===" && cat /etc/os-release 2>/dev/null | head -3',
        'echo "=== Node ===" && node --version 2>/dev/null || echo "Node 未安装"',
        'echo "=== NPM ===" && npm --version 2>/dev/null || echo "NPM 未安装"',
        'echo "=== PM2 ===" && pm2 --version 2>/dev/null || echo "PM2 未安装"',
        'echo "=== Nginx ===" && nginx -v 2>&1 || echo "Nginx 未安装"',
        'echo "=== Git ===" && git --version 2>/dev/null || echo "Git 未安装"',
    ]
    for c in cmds:
        _, stdout, _ = ssh.exec_command(c)
        print(stdout.read().decode().strip())

except Exception as e:
    print(f'错误: {e}')
finally:
    ssh.close()
