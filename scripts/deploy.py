import paramiko
from scp import SCPClient
import os
import sys

# Configuration
HOST = "217.216.109.5"
USER = "root"
PASSWORD = "95V1ct0r2"
REMOTE_DIR = "/var/www/axionax-marketplace"

def create_ssh_client(server, port, user, password):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(server, port, user, password)
    return client

def main():
    print(f"🚀 Connecting to {HOST}...")
    try:
        ssh = create_ssh_client(HOST, 22, USER, PASSWORD)
        scp = SCPClient(ssh.get_transport())
        
        print("📂 Creating remote directory...")
        ssh.exec_command(f"mkdir -p {REMOTE_DIR}")
        
        print("📦 Uploading files...")
        # Upload individual files/folders
        files_to_upload = [
            'package.json', 
            'pnpm-lock.yaml', 
            'pnpm-workspace.yaml', 
            'docker-compose.yml',
            'apps',
            'packages'
        ]
        
        for item in files_to_upload:
            if os.path.exists(item):
                print(f"  - Uploading {item}...")
                scp.put(item, recursive=True, remote_path=REMOTE_DIR)
            else:
                print(f"  ⚠️ Warning: {item} not found")

        print("🐳 Building and starting containers...")
        stdin, stdout, stderr = ssh.exec_command(f"cd {REMOTE_DIR} && docker-compose up -d --build")
        
        # Stream output
        for line in stdout:
            print(line.strip())
        for line in stderr:
            print(f"ERR: {line.strip()}")

        print(f"✅ Deployment complete! Visit http://{HOST}")
        
        scp.close()
        ssh.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
