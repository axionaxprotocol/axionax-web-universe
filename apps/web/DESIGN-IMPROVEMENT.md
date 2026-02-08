# แผนปรับปรุงออกแบบเว็บ Axionax ให้เป็น “เว็บเทคโนโลยี”

เป้าหมาย: ให้ความรู้สึกเป็น **เว็บเทคโนโลยี / Developer-first / Blockchain** ชัดเจน ลดความรู้สึก “luxury / premium gold” ที่มีอยู่

---

## 1. สถานะปัจจุบัน vs เป้าหมาย

| มิติ | ปัจจุบัน | เป้าหมาย (Tech) |
|------|----------|------------------|
| **โทนสี** | โทนทอง/ส้ม (gold, amber) หนัก | โทนกลางเป็น neutral (ขาว/เทา) + accent หนึ่งสี (cyan/blue หรือ gold เบา) |
| **ฟอนต์** | Playfair (serif) + DM Sans | Sans-serif ชัดเจนหนึ่งชุด + Mono สำหรับตัวเลข/โค้ด |
| **พื้นหลัง** | ดำ + radial gradient โทนทอง | ดำ/เทาเข้มเรียบ หรือ grid/grain เบาๆ |
| **การ์ด/ตาราง** | ขอบทอง, เงาโทนอุ่น | ขอบเทา/ขาวโปร่งใส, เงาเรียบหรือเกือบไม่มี |
| **ความรู้สึก** | Premium / Luxury | Technical / Developer / Data-driven |

---

## 2. Typography (ฟอนต์)

### 2.1 แนะนำ

- **Body & UI:** ใช้ **Inter** หรือ **Geist** (หรือ DM Sans ต่อได้ถ้าชอบ) — sans-serif อ่านง่าย ใช้กันใน product/tech หลายที่  
- **Headings:** ใช้ **font-sans** ตัวเดียวกับ body แต่ **weight 600–700** แทน serif (Playfair) เพื่อให้ดูเป็นระบบเดียวกันและรู้สึก tech มากขึ้น  
- **ตัวเลข / รหัส / address:** ใช้ **font-mono** (JetBrains Mono หรือ Fira Code) สำหรับ block height, address, price ในตาราง  

### 2.2 การใช้สีฟอนต์

- **ข้อความหลัก:** `#f4f4f5` หรือ `#e4e4e7` (zinc-100/200) แทน cornsilk  
- **ข้อความรอง:** `rgba(255,255,255,0.6)` หรือ zinc-400  
- **Accent (ลิงก์, ตัวเลขสำคัญ, CTA):** สี accent หลักของระบบ (ดูหัวข้อสี)  
- **ลด:** การใช้โทนทองเป็นสีหลักของข้อความทั้งหน้า  

---

## 3. สี (Color)

### 3.1 ตัวเลือก A: Tech Cyan/Blue (แนะนำ)

- **Accent หลัก:** `#22d3ee` (cyan-400) หรือ `#38bdf8` (sky-400)  
- **Background:**  
  - หลัก: `#09090b` (zinc-950)  
  - การ์ด: `#18181b` (zinc-900) หรือ `rgba(255,255,255,0.03)`  
- **Border:** `rgba(255,255,255,0.08)` หรือ zinc-800  
- **คงโทนทองไว้เฉพาะ:** logo, badge “Live”, หรือจุดที่ต้องการเน้นพิเศษ (ไม่ใช้ทั้งหน้า)  

### 3.2 ตัวเลือก B: เก็บ Gold แต่ลดบทบาท

- **Accent หลัก:** ใช้ทองเป็น **secondary accent** เฉพาะ CTA และสถานะสำคัญ  
- **Primary accent:** เปลี่ยนเป็น cyan/sky ตามตัวเลือก A  
- **ข้อความ:** ใช้ขาว/เทาเป็นหลัก แทนโทน warm  

### 3.3 สถานะ (Status)

- **Success/Online:** `#22c55e` (green-500)  
- **Warning:** `#eab308` (yellow-500)  
- **Error:** `#ef4444` (red-500)  
- **Info:** ใช้สี accent หลัก  

---

## 4. Layout & Components

### 4.1 พื้นหลัง

- ลดหรือตัด radial gradient โทนทอง  
- ใช้สีเดียว `#09090b` หรือ gradient แนวตั้งเบา (ดำ → zinc-900)  
- ถ้าต้องการ texture: เพิ่ม **noise/grain** โปร่งใสหรือ **grid** เบาๆ แทน glow  

### 4.2 การ์ด (Card)

- พื้นหลัง: `bg-zinc-900/80` หรือ `bg-white/5`  
- ขอบ: `border border-white/10`  
- เงา: `shadow-sm` หรือไม่มี  
- มุม: `rounded-xl` (เก็บได้)  

### 4.3 ตาราง (เช่น Available Workers)

- Header: พื้นหลัง `bg-white/5`, ข้อความ `text-zinc-300`, font-semibold  
- แถว: แบ่งด้วย `border-b border-white/5`  
- Hover: `hover:bg-white/5`  
- ตัวเลข/รหัส: `font-mono text-sm`  

### 4.4 ปุ่ม

- **Primary (CTA):** สี accent หลัก (cyan/sky) ไม่ใช้ gradient ทองทั้งปุ่ม  
- **Secondary:** ขอบขาว/เทา `border border-white/20` + hover `bg-white/5`  
- **Ghost:** ข้อความเทา + hover พื้นหลังโปร่งใส  

### 4.5 Navbar

- พื้นหลัง: `bg-black/80` หรือ `bg-zinc-950/90` + `backdrop-blur`  
- ขอบล่าง: `border-b border-white/10`  
- ลิงก์ active: ใช้สี accent หรือ `bg-white/10` แทนพื้นหลังทอง  

---

## 5. Motion & Polish

- **Transition:** ใช้ `transition-colors duration-200` กับปุ่มและลิงก์  
- **โฟกัส:** ring สี accent แทน amber  
- **Loading:** ใช้สี accent กับ spinner/skeleton  
- หลีกเลี่ยง animation ฟุ่มเฟือย ให้ความรู้สึก “เร็วและตรงไปตรงมา”  

---

## 6. ขั้นตอนนำไปใช้ (Phased)

### Phase 1 – Foundation (ไม่กระทบโครงมาก)

1. เพิ่ม CSS variables สำหรับ **tech palette** (zinc backgrounds, cyan accent) ใน `globals.css`  
2. เปลี่ยน **font display/headings** จาก Playfair เป็น sans (เช่น ใช้ `font-sans font-bold` สำหรับ h1–h6)  
3. ใช้ **font-mono** กับ block height, address, ราคาในตาราง  

### Phase 2 – Colors & Backgrounds

4. สลับ accent หลักเป็น **cyan/sky** ใน Tailwind + globals  
5. ปรับ **พื้นหลัง** เป็นโทน zinc/ดำเรียบ (ลด gold gradient)  
6. ปรับ **การ์ดและตาราง** ตามหัวข้อ 4.2, 4.3  

### Phase 3 – Components

7. ปรับ **Navbar, ปุ่ม, badge** ตามหัวข้อ 4.4, 4.5  
8. ปรับ **สีข้อความ** (content / muted / accent) ให้สอดคล้องโทนใหม่  
9. ตรวจ **accessibility** (contrast) กับโทนใหม่  

### Phase 4 – Optional

10. เพิ่ม noise/grid background (ถ้าต้องการ)  
11. ปรับหน้า Marketplace, Validators, Explorer ให้ใช้ design system ชุดเดียวกัน  

---

## 7. ไฟล์ที่เกี่ยวข้อง (อ้างอิง)

| ไฟล์ | การใช้ |
|------|--------|
| `src/app/globals.css` | CSS variables, base styles, โทนสี |
| `tailwind.config.ts` | colors, fontFamily, boxShadow |
| `src/app/layout.tsx` | โหลดฟอนต์ (Inter/Geist, Mono) |
| `src/components/layout/Navbar.tsx` | สีและ style navbar |
| `src/app/marketplace/page.tsx` | ตาราง workers, การ์ด, ปุ่ม |
| `src/components/marketplace/EscrowPanel.tsx` | การ์ด escrow, ปุ่ม, ตัวเลข |

---

## 8. สรุป

- **ฟอนต์:** Sans ชัดหนึ่งชุด + Mono สำหรับข้อมูลเชิงเทคนิค ลด serif  
- **สี:** โทน neutral (ดำ/เทา) + accent เดียว (cyan/sky) ลดการใช้ทองทั้งหน้า  
- **พื้นหลังและการ์ด:** เรียบ โปร่งใส เบา border  
- **ความรู้สึก:** Technical, data-driven, developer-friendly แทน luxury  

ถ้าต้องการให้ช่วยลงมือทำ Phase 1 (ฟอนต์ + variables ใหม่) หรือ Phase 2 (สีและพื้นหลัง) ในโค้ดจริง บอกได้ว่าจะเริ่มจาก phase ไหนและชอบตัวเลือกสี A หรือ B
