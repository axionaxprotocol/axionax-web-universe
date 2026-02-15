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
        
        print("🔍 Checking container status...")
        stdin, stdout, stderr = client.exec_command("docker ps | grep marketplace")
        print(stdout.read().decode())
        
        print("\n📂 Listing files in nginx html directory...")
        stdin, stdout, stderr = client.exec_command("docker exec axionax-marketplace-marketplace-1 ls -la /usr/share/nginx/html/")
        print(stdout.read().decode())
        
        print("\n📜 Getting last 100 lines of build logs...")
        stdin, stdout, stderr = client.exec_command(f"cd {REMOTE_DIR} && docker-compose logs --tail=100 marketplace")
        print(stdout.read().decode())
        
        print("\n🚨 Checking for build errors...")
        stdin, stdout, stderr = client.exec_command(f"cd {REMOTE_DIR} && docker-compose logs marketplace 2>&1 | grep -i error | tail -20")
        print(stdout.read().decode())
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
