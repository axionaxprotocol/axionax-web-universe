# วิธีเพิ่ม AXX Token บน MetaMask 🦊

## ปัญหาที่พบบ่อย

หากคุณไม่สามารถเพิ่ม AXX Token บน MetaMask ได้ อาจเกิดจากสาเหตุต่อไปนี้:

### 1. ⚠️ ยังไม่ได้เชื่อมต่อกับ Axionax Network

**วิธีแก้:**
1. เปิด MetaMask
2. คลิกที่ dropdown เลือก network ด้านบน
3. คลิก "Add Network" หรือ "Custom RPC"
4. กรอกข้อมูลดังนี้:

```
Network Name: Axionax Testnet
RPC URL: https://testnet-rpc.axionax.org
Chain ID: 86137
Currency Symbol: AXX
Block Explorer: https://explorer.axionax.org
```

### 2. ⚠️ ใช้ Token Address ไม่ถูกต้อง

**Token Address ที่ถูกต้อง:**

```
Mainnet: 0x0000000000000000000000000000000000001000
Testnet: (ตรวจสอบจาก config.json หรือ faucet)
```

### 3. ⚠️ MetaMask ไม่รองรับ ERC-20 Token บน Network นี้

**วิธีแก้:**
- ตรวจสอบว่าคุณเชื่อมต่อกับ Axionax Network แล้ว
- Token จะแสดงเฉพาะเมื่อคุณอยู่ใน network ที่ถูกต้อง

---

## วิธีเพิ่ม Token ด้วยตนเอง (Manual)

### ขั้นตอนที่ 1: เปิด MetaMask
1. คลิกที่ไอคอน MetaMask extension
2. ตรวจสอบว่าคุณเชื่อมต่อกับ **Axionax Testnet** แล้ว

### ขั้นตอนที่ 2: เพิ่ม Token
1. เลื่อนลงไปที่รายการ Assets
2. คลิก **"Import tokens"** หรือ **"Add Token"**
3. เลือกแท็บ **"Custom Token"**

### ขั้นตอนที่ 3: กรอกข้อมูล Token
```
Token Contract Address: 0x0000000000000000000000000000000000001000
Token Symbol: AXX
Token Decimal: 18
```

4. คลิก **"Add Custom Token"**
5. คลิก **"Import Tokens"** เพื่อยืนยัน

### ✅ เสร็จสิ้น!
ตอนนี้คุณจะเห็น AXX Token ในรายการ Assets ของ MetaMask แล้ว

---

## วิธีเพิ่ม Token แบบอัตโนมัติ (Recommended)

### จาก Web Interface

1. เชื่อมต่อ wallet ที่ https://axionax.org
2. คลิกที่ปุ่ม **Connect Wallet**
3. เมื่อเชื่อมต่อสำเร็จ คลิกที่ dropdown wallet menu
4. คลิกปุ่ม **"Add AXX Token"** 
5. MetaMask จะเปิดหน้าต่างยืนยัน ให้คลิก **"Add Token"**

### จาก Local Testnet UI

หากคุณใช้ Local Testnet (Testnet in a Box):

1. เปิดไฟล์ `index.html` ใน browser
2. คลิกปุ่ม **"Connect Wallet"**
3. คลิกปุ่ม **"Add AXX Token"**
4. MetaMask จะเปิดหน้าต่างยืนยัน ให้คลิก **"Add Token"**

---

## Code Integration

### สำหรับ Developers

ใช้ฟังก์ชัน `wallet_watchAsset` เพื่อเพิ่ม token โดยอัตโนมัติ:

```javascript
async function addAXXToken() {
  const tokenAddress = '0x0000000000000000000000000000000000001000';
  const tokenSymbol = 'AXX';
  const tokenDecimals = 18;
  
  try {
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
        },
      },
    });

    if (wasAdded) {
      console.log('✅ Token added successfully!');
    } else {
      console.log('❌ User declined to add token');
    }
  } catch (error) {
    console.error('Error adding token:', error);
  }
}
```

### React/TypeScript Integration

```typescript
import { addTokenToMetaMask } from '@/lib/web3';

// ใช้งานใน component
const handleAddToken = async () => {
  try {
    const wasAdded = await addTokenToMetaMask({
      address: '0x0000000000000000000000000000000000001000',
      symbol: 'AXX',
      decimals: 18,
    });
    
    if (wasAdded) {
      alert('เพิ่ม Token สำเร็จ! ✅');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## การแก้ปัญหาเพิ่มเติม

### ❌ "Invalid address" Error

**สาเหตุ:**
- Token address ไม่ถูกต้อง
- ใช้ address จาก network อื่น

**วิธีแก้:**
- ตรวจสอบ address อีกครั้ง
- ใช้ address ที่ถูกต้องสำหรับ network นั้นๆ

### ❌ Token ไม่แสดงหลังจากเพิ่ม

**สาเหตุ:**
- คุณไม่ได้อยู่ใน Axionax Network
- Balance เป็น 0

**วิธีแก้:**
1. Switch ไปยัง Axionax Network
2. ขอ test tokens จาก faucet: https://faucet.axionax.org
3. Refresh MetaMask (Lock -> Unlock)

### ❌ "User rejected the request"

**สาเหตุ:**
- ผู้ใช้คลิก "Cancel" ใน MetaMask popup

**วิธีแก้:**
- ลองอีกครั้งและคลิก "Add Token" เพื่อยืนยัน

---

## เอกสารอ้างอิง

- [MetaMask Documentation](https://docs.metamask.io/)
- [EIP-747: wallet_watchAsset](https://eips.ethereum.org/EIPS/eip-747)
- [Axionax Network Configuration](./CHAIN_ID_CONFIGURATION.md)
- [Web3 Integration Guide](./DEVELOPER_GUIDE.md)

---

## ติดต่อสอบถาม

หากยังมีปัญหา กรุณาติดต่อ:

- **Discord**: [Axionax Community](https://discord.gg/axionax)
- **GitHub Issues**: [axionax-web-universe](https://github.com/axionaxprotocol/axionax-web-universe/issues)
- **Email**: support@axionax.org

---

**อัปเดตล่าสุด:** ธันวาคม 2025  
**Version:** 1.0.0
