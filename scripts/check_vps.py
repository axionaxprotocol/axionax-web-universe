import paramiko

HOST = "217.216.109.5"
USER = "root"
PASSWORD = "95V1ct0r2"

def main():
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(HOST, 22, USER, PASSWORD)
        
        print("🐳 Checking Docker containers...")
        stdin, stdout, stderr = client.exec_command("docker ps")
        print(stdout.read().decode())
        
        print("📂 Checking files in container...")
        stdin, stdout, stderr = client.exec_command("docker exec axionax-marketplace-marketplace-1 ls -R /usr/share/nginx/html")
        print(stdout.read().decode())

        print("📜 Checking Nginx logs...")
        stdin, stdout, stderr = client.exec_command("docker logs axionax-marketplace-marketplace-1")
        print(stdout.read().decode())
        print(stderr.read().decode())
        
        client.close()
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
