import paramiko

HOST = "217.216.109.5"
USER = "root"
PASSWORD = "95V1ct0r2"
REMOTE_DIR = "/var/www/axionax-marketplace"

def main():
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(HOST, 22, USER, PASSWORD)
        
        print("🔍 Checking build status...")
        stdin, stdout, stderr = client.exec_command(f"cd {REMOTE_DIR} && docker-compose ps")
        print(stdout.read().decode())
        err = stderr.read().decode()
        if err:
            print(f"Error: {err}")
        
        print("\n📋 Checking docker-compose logs...")
        stdin, stdout, stderr = client.exec_command(f"cd {REMOTE_DIR} && docker-compose logs --tail=50")
        print(stdout.read().decode())
        
        print("\n🔨 Attempting rebuild...")
        stdin, stdout, stderr = client.exec_command(f"cd {REMOTE_DIR} && docker-compose down && docker-compose up -d --build --force-recreate")
        
        # Stream output in real-time
        while not stdout.channel.exit_status_ready():
            if stdout.channel.recv_ready():
                print(stdout.channel.recv(1024).decode(), end='')
                
        print(stdout.read().decode())
        print(stderr.read().decode())
        
        client.close()
        print("\n✅ Build process completed!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
