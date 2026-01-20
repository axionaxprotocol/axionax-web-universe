import paramiko

HOST = "217.216.109.5"
USER = "root"
PASSWORD = "95V1ct0r2"

def main():
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(HOST, 22, USER, PASSWORD)
        
        print("🔥 Configuring firewall...")
        # Check if ufw is active
        stdin, stdout, stderr = client.exec_command("ufw status")
        status = stdout.read().decode()
        print(f"UFW Status: {status}")
        
        if "inactive" not in status:
            print("Allowing port 8080...")
            stdin, stdout, stderr = client.exec_command("ufw allow 8080/tcp")
            print(stdout.read().decode())
            print(stderr.read().decode())
            
            print("Reloading ufw...")
            stdin, stdout, stderr = client.exec_command("ufw reload")
            print(stdout.read().decode())
        else:
            print("UFW is inactive. Checking iptables...")
            # Fallback to iptables if ufw is not used (common in some VPS)
            stdin, stdout, stderr = client.exec_command("iptables -I INPUT -p tcp --dport 8080 -j ACCEPT")
            print(stdout.read().decode())
            
        client.close()
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
