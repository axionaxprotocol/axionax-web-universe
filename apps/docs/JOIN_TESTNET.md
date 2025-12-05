# วิธีเข้าร่วม axionax Testnet 🚀

**เวอร์ชัน**: v1.8.0-testnet  
**อัพเดทล่าสุด**: 5 ธันวาคม 2025  
**ภาษา**: ไทย 🇹🇭

---

## 📋 สารบัญ

1. [ข้อมูลเครือข่าย](#ข้อมูลเครือข่าย)
2. [เพิ่มเครือข่ายใน MetaMask](#เพิ่มเครือข่ายใน-metamask)
3. [ขอเหรียญทดสอบจาก Faucet](#ขอเหรียญทดสอบจาก-faucet)
4. [ใช้งาน Block Explorer](#ใช้งาน-block-explorer)
5. [Deploy Smart Contract](#deploy-smart-contract)
6. [แก้ปัญหา](#แก้ปัญหา)

---

## 🌐 ข้อมูลเครือข่าย

### Network Details
- **ชื่อเครือข่าย**: axionax Testnet
- **Chain ID**: 86137 (0x15079)
- **สัญลักษณ์**: AXX
- **Block Time**: ~3 วินาที
- **Consensus**: Proof of Probabilistic Checking (PoPC)

### Endpoints
- **RPC URL**: `https://rpc.axionax.org`
- **WebSocket**: `wss://rpc.axionax.org`
- **Explorer**: https://explorer.axionax.org
- **Faucet**: https://faucet.axionax.org
- **Website**: https://axionax.org

### Validator Nodes (สำรอง)
- **EU Node**: http://217.76.61.116:8545
- **AU Node**: http://46.250.244.4:8545

---

## 🦊 เพิ่มเครือข่ายใน MetaMask

### วิธีที่ 1: เพิ่มแบบอัตโนมัติ (แนะนำ)

1. เข้าไปที่ https://axionax.org
2. คลิกปุ่ม **"Connect Wallet"**
3. เลือก MetaMask
4. คลิก **"Add axionax Network"**
5. อนุมัติการเพิ่มเครือข่ายใน MetaMask

### วิธีที่ 2: เพิ่มด้วยตนเอง

#### ขั้นตอนที่ 1: เปิด MetaMask
- คลิกที่ชื่อเครือข่ายด้านบน
- เลือก **"Add Network"** หรือ **"เพิ่มเครือข่าย"**
- คลิก **"Add a network manually"**

#### ขั้นตอนที่ 2: กรอกข้อมูล

```
Network Name (ชื่อเครือข่าย):
axionax Testnet

New RPC URL:
https://rpc.axionax.org

Chain ID:
86137

Currency Symbol:
AXX

Block Explorer URL (optional):
https://explorer.axionax.org
```

#### ขั้นตอนที่ 3: บันทึก
- คลิก **"Save"** หรือ **"บันทึก"**
- เครือข่าย axionax Testnet จะปรากฏในรายการ

---

## 💰 ขอเหรียญทดสอบจาก Faucet

### ก่อนเริ่ม
- ต้องมี MetaMask ที่เชื่อมต่อกับ axionax Testnet แล้ว
- ต้องมี Twitter/Discord account (สำหรับ anti-spam)

### ขั้นตอน

#### วิธีที่ 1: ผ่านเว็บไซต์

1. **เข้าไปที่ Faucet**
   - URL: https://faucet.axionax.org
   - หรือไปที่ https://axionax.org → คลิก "Faucet"

2. **เชื่อมต่อ Wallet**
   - คลิกปุ่ม "Connect Wallet"
   - เลือก MetaMask
   - อนุมัติการเชื่อมต่อ

3. **ขอเหรียญ**
   - คลิกปุ่ม "Request Tokens"
   - รอ 5-10 วินาที
   - ได้รับ **10 AXX** (ฟรี!)

4. **ตรวจสอบยอด**
   - เปิด MetaMask
   - ดูยอดเงิน AXX ที่เพิ่มขึ้น

#### วิธีที่ 2: ผ่าน API (สำหรับนักพัฒนา)

```bash
# ขอเหรียญผ่าน API
curl -X POST https://faucet.axionax.org/api/request \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0xYourAddressHere",
    "captcha": "optional-captcha-token"
  }'
```

### ข้อจำกัด
- **จำนวนต่อครั้ง**: 10 AXX
- **ความถี่**: 1 ครั้งต่อ 24 ชั่วโมง ต่อ address
- **Maximum**: 100 AXX ต่อวัน (ทั้งระบบ)

### ถ้าต้องการเหรียญมากขึ้น
- เข้า Discord: https://discord.gg/axionax
- ติดต่อทีม Community Manager
- อธิบายว่าจะใช้ทำอะไร (development, testing, etc.)

---

## 🔍 ใช้งาน Block Explorer

### เข้าใช้งาน
- URL: https://explorer.axionax.org
- ไม่ต้อง login หรือเชื่อมต่อ wallet

### ฟีเจอร์หลัก

#### 1. ดูข้อมูล Blocks
- ไปที่ **Blocks** tab
- ดู block number, timestamp, transactions
- คลิกที่ block number เพื่อดูรายละเอียด

#### 2. ค้นหา Transactions
```
ค้นหาได้ด้วย:
- Transaction Hash (0x...)
- Block Number (#123456)
- Address (0x...)
```

#### 3. ตรวจสอบ Address
- ใส่ address ของคุณในช่องค้นหา
- ดูยอดเงิน (Balance)
- ดูประวัติ transactions
- ดู token holdings

#### 4. ดูข้อมูล Smart Contracts
- ไปที่ **Contracts** tab
- ดู verified contracts
- อ่าน source code
- ทดสอบเรียก functions

### ตัวอย่างการใช้งาน

**ตรวจสอบ transaction ของคุณ:**
1. Copy transaction hash จาก MetaMask
2. ไปที่ https://explorer.axionax.org
3. Paste hash ในช่องค้นหา
4. กด Enter
5. ดูรายละเอียด: status, gas used, block number

---

## 📦 Deploy Smart Contract

### เตรียมตัว
```bash
# ติดตั้ง Hardhat
npm install --save-dev hardhat

# หรือใช้ Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### สร้าง Project

#### ด้วย Hardhat
```bash
npx hardhat init
```

#### ด้วย Foundry
```bash
forge init my-project
cd my-project
```

### ตั้งค่า Network

**hardhat.config.js:**
```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    axionax: {
      url: "https://rpc.axionax.org",
      chainId: 86137,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

**foundry.toml:**
```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]

[rpc_endpoints]
axionax = "https://rpc.axionax.org"
```

### Deploy Contract

#### ด้วย Hardhat
```bash
# เขียน deploy script ใน scripts/deploy.js
npx hardhat run scripts/deploy.js --network axionax
```

#### ด้วย Foundry
```bash
forge create --rpc-url axionax \
  --private-key $PRIVATE_KEY \
  src/MyContract.sol:MyContract
```

### Verify Contract
```bash
# Hardhat
npx hardhat verify --network axionax \
  DEPLOYED_CONTRACT_ADDRESS \
  "Constructor Arg 1" "Constructor Arg 2"

# Foundry
forge verify-contract \
  --chain-id 86137 \
  --compiler-version v0.8.20 \
  DEPLOYED_CONTRACT_ADDRESS \
  src/MyContract.sol:MyContract
```

---

## 🔧 แก้ปัญหา

### ปัญหาที่พบบ่อย

#### 1. MetaMask ไม่สามารถเชื่อมต่อได้

**อาการ**: "Could not connect to the network"

**แก้ไข**:
```bash
# ทดสอบ RPC connection
curl -X POST https://rpc.axionax.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# ถ้าไม่ได้ลอง node สำรอง
# EU: http://217.76.61.116:8545
# AU: http://46.250.244.4:8545
```

**วิธีแก้**:
- ตรวจสอบ internet connection
- ลบและเพิ่มเครือข่ายใหม่
- ลอง RPC URL สำรอง
- Clear cache ของ browser
- Restart MetaMask

#### 2. Faucet ไม่ส่งเหรียญ

**อาการ**: "Request failed" หรือไม่มียอดเพิ่ม

**เช็คเคส**:
- รอแล้ว 24 ชั่วโมงหรือยัง?
- Address ถูกต้องหรือไม่?
- Network เลือกถูกหรือไม่?

**วิธีแก้**:
1. ตรวจสอบ address ว่าถูกต้อง
2. เช็ค error message ใน console
3. ลองใหม่หลัง 5 นาที
4. ติดต่อ support ใน Discord

#### 3. Transaction ค้าง (Pending)

**อาการ**: Transaction pending นานเกิน 5 นาที

**วิธีแก้**:
```javascript
// เช็ค transaction status
curl -X POST https://rpc.axionax.org \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"eth_getTransactionReceipt",
    "params":["0xYourTxHash"],
    "id":1
  }'
```

**ถ้า null**:
- Transaction ยังไม่ถูก mine
- ลองเพิ่ม gas price
- Speed up transaction ใน MetaMask

**ถ้ามี receipt**:
- Transaction เสร็จแล้ว
- Refresh MetaMask

#### 4. Contract Deploy ล้มเหลว

**สาเหตุที่พบบ่อย**:
- Gas ไม่พอ → เพิ่ม gas limit
- Bytecode ใหญ่เกินไป → optimize contract
- Constructor arguments ผิด → ตรวจสอบ args
- Nonce ผิด → reset MetaMask account

**วิธีแก้**:
```bash
# ทดสอบ estimate gas ก่อน
cast estimate \
  --rpc-url https://rpc.axionax.org \
  --from YOUR_ADDRESS \
  CONTRACT_BYTECODE
```

#### 5. เงินหายหลัง Deploy

**สาเหตุ**: ส่ง native AXX ไปในขณะ deploy

**ป้องกัน**:
- ตรวจสอบว่า `value: 0` ใน transaction
- ไม่ต้องส่งเงินตอน deploy contract ธรรมดา
- ส่งเงินได้ถ้า constructor เป็น `payable`

---

## 📞 ช่องทางติดต่อ

### หาความช่วยเหลือ
- **Discord**: https://discord.gg/axionax (ช่อง #testnet-support)
- **GitHub Issues**: https://github.com/axionaxprotocol/axionax-web-universe/issues
- **Twitter**: https://twitter.com/axionax (@axionax)
- **Email**: support@axionax.org

### รายงานปัญหา
ก่อนรายงานปัญหา กรุณาเตรียมข้อมูลเหล่านี้:
- Transaction hash (ถ้ามี)
- Address ของคุณ
- รายละเอียดปัญหา
- Screenshot (ถ้าเป็นไปได้)
- Browser และ OS version

---

## 🎯 Next Steps

เมื่อเข้าร่วม Testnet แล้ว คุณสามารถ:

1. **ลอง Deploy Contract**
   - ERC-20 Token
   - ERC-721 NFT
   - Simple DeFi protocols

2. **สำรวจ Ecosystem**
   - Marketplace: https://marketplace.axionax.org
   - Documentation: https://docs.axionax.org
   - GitHub: https://github.com/axionaxprotocol

3. **ร่วมพัฒนา**
   - อ่าน [Contributing Guide](./CONTRIBUTING.md)
   - ดู [Good First Issues](https://github.com/axionaxprotocol/axionax-web-universe/labels/good%20first%20issue)
   - เข้า Developer Channel บน Discord

---

## 📚 เอกสารเพิ่มเติม

- [Architecture Overview](./ARCHITECTURE.md)
- [API Reference](./API_REFERENCE.md)
- [Smart Contract Guide](./SMART_CONTRACT_EXAMPLES.md)
- [Validator Setup](./VALIDATOR_SETUP_GUIDE.md)
- [Testnet Status](./TESTNET_STATUS.md)

---

**สนุกกับการพัฒนาบน axionax Testnet! 🚀**

*Last Updated: December 5, 2025 | v1.8.0-testnet*
