# 🪐 Axionax Protocol — เอกสารสรุปโครงการฉบับสมบูรณ์ (Master Summary)

| | |
|---|---|
| **สถานะ** | Series Seed Preparation |
| **เวอร์ชัน** | 2.1 |
| **อัปเดต** | กุมภาพันธ์ 2026 |
| **ที่มา** | รวบรวมจาก source code และเอกสารภายในโครงการ |

---

## 1. บทนำและวิสัยทัศน์ (Introduction & Vision)

**Axionax Protocol** คือเครือข่ายโครงสร้างพื้นฐานทางกายภาพแบบกระจายศูนย์ (DePIN) ที่มุ่งสร้าง **"ระบบปฏิบัติการสำหรับอารยธรรมใหม่"** (Civilization OS).

### ปัญหา (The Problem)

| ปัญหา | รายละเอียด |
|--------|-------------|
| **AI Compute Crisis** | การขาดแคลนชิปประมวลผลและการผูกขาดทรัพยากรโดย Big Tech (Centralized AI) |
| **Data Privacy** | ความเสี่ยงในการส่งข้อมูลส่วนตัวไปประมวลผลบน Cloud ต่างประเทศ |
| **Energy Inefficiency** | Data Center แบบเดิมกินพลังงานมหาศาล |

### ทางออก (The Solution)

- สร้างเครือข่าย **Universal Grid** ที่เปลี่ยนอุปกรณ์ Edge Computing (Raspberry Pi, PC, Mac) ให้เป็น Node ประมวลผล AI  
- ใช้สถาปัตยกรรม **Geo-Hierarchy** เพื่อรองรับการขยายตัวสู่ **11 ล้านโหนด**  
- ยืนยันความถูกต้องด้วย **PoPC** (Proof of Probabilistic Checking)

---

## 2. สถาปัตยกรรมทางเทคนิค (Technical Architecture)

### 2.1 The Core Protocol (Layer 1)

| รายการ | รายละเอียด |
|--------|-------------|
| **Repository** | [axionax-core-universe](https://github.com/axionaxprotocol/axionax-core-universe) |
| **ภาษา** | Rust (80% — Core Logic) + Python (20% — DeAI Layer) |
| **Consensus** | PoPC (Proof of Probabilistic Checking) |
| **การตรวจสอบ** | สุ่มตรวจทางสถิติ (Probabilistic Checking) แทนการรันซ้ำทั้งหมด — \(O(s)\) vs \(O(n)\) |
| **Finality** | Sub-second (~0.5 วินาที) |
| **Validator Committee** | ใช้ VRF (Verifiable Random Function) ในการเลือก |
| **Interoperability** | Rust ↔ Python ผ่าน **PyO3 Bridge** — Smart Contract เรียกใช้ AI Model โดยตรง |

### 2.2 โครงสร้างเครือข่าย: The Hive (Geo-Hierarchy)

เครือข่ายจัดเป็นลำดับชั้นทางภูมิศาสตร์ 5 ระดับ เพื่อลดความหนาแน่นของข้อมูล:

| Tier | ชื่อ | บทบาท |
|------|------|--------|
| **Tier 5** | Edge Workers | 10M+ โหนด (Monolith Scout/Vanguard) — รับงาน AI Inference |
| **Tier 4** | Metro Aggregators | รวบรวม Proof จาก Tier 5, Batching ระดับจังหวัด |
| **Tier 3** | National Gateways | บริหาร Traffic และ Data Sovereignty ระดับประเทศ |
| **Tier 2** | Regional Titans | Super Nodes สำหรับเทรนโมเดลใหญ่ (LLM Training) |
| **Tier 1** | Global Root | โหนดอวกาศ/Foundation — รักษา State Root ของทั้งโลก |

---

## 3. ระบบฮาร์ดแวร์ (Hardware Ecosystem)

### 3.1 Monolith MK-I "Vanguard" (Pro Edition)

- **Concept:** "The Bicameral Mind" (Split-Brain Architecture)  
- **Base:** Raspberry Pi 5 (8GB)  
- **AI Engine:** Dual Hailo-10H (ผ่าน PCIe Switch HAT)  
- **Left Brain (Sentinel):** รันงาน Security/Validator 24 ชม.  
- **Right Brain (Worker):** รับงานขุด (Mining) และงานหนักจาก Marketplace  
- **Target:** Power User / Tier 4 Candidate  

### 3.2 Monolith MK-I "Scout+" (Starter GenAI Edition)

- **Concept:** "Personal AI Companion"  
- **Base:** Raspberry Pi 5  
- **AI Engine:** Raspberry Pi AI HAT+ 2 (Hailo-10H + 8GB On-board RAM)  
- **Capabilities:** รัน LLM (Llama-3-8B), VLM, Chatbot ได้ในตัวโดยไม่กิน RAM เครื่องหลัก  
- **Target:** Mass Adoption / Tier 5  

### 3.3 The Universal Grid (BYOD)

รองรับฮาร์ดแวร์ภายนอก:

| ชื่อ | ฮาร์ดแวร์ | บทบาท |
|------|------------|--------|
| **The Chimera** | Orange Pi 5 Plus (3 AI Chips) | Tier 4 Aggregator |
| **The Silicon Archon** | Mac Mini/Studio | Elite Worker |
| **The Leviathan** | Enterprise Server | Tier 2/3 |

---

## 4. ระบบปัญญาประดิษฐ์ (DeAI & Sentinels)

### 4.1 The 7 Sentinels (ระบบภูมิคุ้มกันเครือข่าย)

AI Model พิเศษที่รันบน Sentinel Node เพื่อตรวจสอบความปลอดภัย:

| Sentinel | หน้าที่หลัก |
|----------|-------------|
| **AION-VX** | ตรวจสอบเวลา (Temporal Integrity) |
| **SERAPH-VX** | ป้องกันการโจมตี (Network Defense) |
| **ORION-VX** | ตรวจจับผลลัพธ์เท็จ (Fraud Detection) |
| **DIAOCHAN-VX** | ให้คะแนนความน่าเชื่อถือ (Reputation) |
| **VULCAN-VX** | ตรวจสอบฮาร์ดแวร์ (Hardware Verification) |
| **THEMIS-VX** | ตัดสินข้อพิพาท (Dispute Resolution) |
| **NOESIS-VX** | (GenAI Core) วิเคราะห์ภาพรวมและ Governance |

### 4.2 Project HYDRA (Resource Manager)

- **Software:** `hydra_manager.py`  
- **Function:** จัดการจัดสรรทรัพยากรบนฮาร์ดแวร์ (เช่น สั่งให้ Hailo ตัวซ้ายทำ Sentinel ตัวขวาทำ Worker) และจัดการความร้อน  

---

## 5. Web & Application Universe

| รายการ | รายละเอียด |
|--------|-------------|
| **Repository** | [axionax-web-universe](https://github.com/axionaxprotocol/axionax-web-universe) (Monorepo) |
| **Stack** | Next.js, Tailwind CSS, TypeScript, pnpm |

### Key Components

- **Web Portal:** Dashboard, Explorer, Faucet  
- **Marketplace:** ตลาดซื้อขาย Compute Power (รองรับ Escrow)  
- **Sales Page:** หน้าเว็บขายเครื่อง Monolith (Infrastructure Page)  
- **API Service:** Indexer และ Backend สำหรับ Mobile App  

---

## 6. เศรษฐศาสตร์และแผนธุรกิจ (Tokenomics & Roadmap)

### 6.1 Revenue Model

- **Hardware Sales:** กำไรจากการขายเครื่อง Monolith  
- **Network Fees:** ส่วนแบ่งค่า Gas จากธุรกรรม  
- **Compute Commission:** ค่าธรรมเนียม Marketplace (5–10%)  

### 6.2 Roadmap (Project Ascension)

| Phase | ชื่อ | ช่วงเวลา | เป้าหมายหลัก |
|-------|------|----------|----------------|
| **Phase 1** | The Incarnation | Q1 2026 | Public Testnet, ขาย Monolith Scout/Vanguard, เปิด Geo-Hierarchy |
| **Phase 2** | Genesis | Q3 2026 | Mainnet Launch, เหรียญ AXX เข้ากระดานเทรด, Marketplace ใช้งานจริง |
| **Phase 3** | Evolution | 2027 | ชิป Photonic (แสง), Enterprise API |
| **Phase 4** | Ascension | 2028+ | Space Nodes, Global Neural Grid |

---

## 7. ข้อมูลสำหรับการระดมทุน (Fundraising Data)

| รายการ | ค่า |
|--------|-----|
| **Seed Round Target** | $2,000,000 (สำหรับ 10% Equity/Tokens) |
| **Use of Funds** | 40% R&D, 30% Manufacturing, 30% Ecosystem |

### Competitive Advantage

- ถูกกว่าคู่แข่ง (Solana/Render) **10–30 เท่า**  
- **Hardware-Native Security** (Split-Brain)  
- รองรับงาน Inference ที่ **Privacy-focus** (Local Execution)  

---

*เอกสารนี้รวบรวมจาก source code และเอกสารภายในโครงการ Axionax Protocol.*
