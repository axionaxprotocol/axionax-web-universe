# แผนปรับปรุงออกแบบเว็บ Axionax ให้เป็นเว็บไซต์เทคโนโลยี

เป้าหมาย: ให้เว็บดูเป็น **Technology / Developer / Blockchain** มากขึ้น ไม่ใช่แค่ “เว็บทั่วไปโทนดำทอง”

---

## 1. สรุปสถานะปัจจุบัน

| ด้าน | ปัจจุบัน | ปัญหา |
|------|----------|--------|
| **ฟอนต์** | DM Sans (body), Playfair (หัวข้อ) | โทน editorial มากกว่า tech |
| **สี** | โทนทอง/ส้ม (gold, amber) บนพื้นดำ | ดูคล้าย luxury brand มากกว่า tech |
| **พื้นหลัง** | Gradient ดำ + จุดดาว | ดู cosmic แต่อาจไม่ sharp |
| **การ์ด/ตาราง** | มุมโค้ง สีทองโปร่ง | ยังไม่รู้สึก “dashboard / dev tool” |
| **ข้อมูลตัวเลข** | แสดงธรรมดา | ยังไม่มี hierarchy ชัดแบบ tech dashboard |

---

## 2. แนวทางปรับปรุง (เรียงตามความสำคัญ)

### Phase 1: Typography (ฟอนต์) — สูง

**เป้าหมาย:** ฟอนต์อ่านง่าย ชัด รู้สึก “tech / product”

- **Body & UI**
  - ใช้ **sans-serif แบบ geometric/neutral** เช่น **Inter**, **Geist**, หรือ **DM Sans** (คงไว้ได้) แต่ตั้งน้ำหนักให้ชัด: ข้อความปกติ 400, หัวข้อย่อย 500, หัวข้อ 600–700
  - กำหนด **scale ชัด**: เช่น 12 / 14 / 16 / 20 / 24 / 32 px และใช้สม่ำเสมอทั้งไซต์

- **หัวข้อใหญ่ (Hero, หน้าแรก)**
  - ตัวเลือก: **Space Grotesk**, **Syne**, **Orbitron** (ถ้าต้องการ futurist) หรือคง **Playfair** แค่หน้า landing แล้วที่เหลือใช้ sans
  - หลีกเลี่ยงตัวเขียน/ตัวหนาเกินไปในหน้าที่เป็นข้อมูล (Dashboard, Validators, Marketplace)

- **ข้อมูลเทคนิค (ที่อยู่, hash, ตัวเลข)**
  - ใช้ **monospace** (JetBrains Mono, Fira Code) สำหรับ:
    - ที่อยู่ wallet
    - Block height, tx hash, chain ID
    - ราคา/จำนวนในตาราง (ถ้าต้องการให้รู้สึกเป็น data)

- **การดำเนินการ**
  - เพิ่ม `font-feature-settings` (tabular numbers) สำหรับคอลัมน์ตัวเลข
  - กำหนด `letter-spacing` เล็กน้อยสำหรับหัวข้อใหญ่และ label ตัวพิมพ์ใหญ่

---

### Phase 2: สีและ Contrast — สูง

**เป้าหมาย:** โทนสีรู้สึก “technology” และอ่านง่าย

- **ตัวเลือก A: เพิ่มโทนเย็น (Tech accent)**
  - คงพื้นหลังดำ/เทาเข้ม
  - เพิ่ม **accent สี cyan/teal** (#22d3ee, #06b6d4) สำหรับ:
    - ลิงก์, ปุ่มหลัก, สถานะ “online”, ข้อมูลที่เน้น
  - ใช้ **ทอง/ส้ม** แค่จุดสำคัญ (logo, CTA หลัก, ราคา) เพื่อไม่ให้ทับกับ cyan

- **ตัวเลือก B: คงโทนทองแต่ทำให้ “tech”**
  - ลด saturation ทองลงเล็กน้อย (โทน amber ที่ไม่ฉูดฉาด)
  - ใช้ **ขาว/เทาอ่อน** เป็นหลักสำหรับข้อความ (#f4f4f5, #e4e4e7)
  - ใช้ **เทา medium** สำหรับข้อความรอง (#71717a) แทนสีทองอ่อนทั้งหน้า

- **ความคมชัด (Accessibility)**
  - ตรวจสอบ contrast ข้อความกับพื้นหลัง (อย่างน้อย 4.5:1 สำหรับ body)
  - สถานะ (เช่น Online/Offline) ใช้สีที่แยกจากข้อความปกติชัดเจน

---

### Phase 3: Layout และ Component — กลาง

**เป้าหมาย:** โครงหน้าและ component ดูเป็น “product / dashboard”

- **Grid & Spacing**
  - ใช้ grid สม่ำเสมอ (เช่น 12 column) และระยะห่างชุดเดียว (4/8/16/24/32/48)
  - เพิ่มพื้นที่หายใจระหว่าง section (โดยเฉพาะหน้า Marketplace, Validators, Dashboard)

- **การ์ดและ Panel**
  - ลองสไตล์ **glass / panel**: พื้นหลังโปร่ง + border บาง + shadow นุ่ม
  - มุม: ลด border-radius ลง (เช่น 8px–12px) เพื่อให้ดูเป็น “UI” มากกว่า “การ์ดโฆษณา”
  - แยกหัวการ์ด (header) กับเนื้อชัด: พื้นหลังต่างระดับหรือเส้นคั่น

- **ตาราง (Marketplace, Validators)**
  - หัวตาราง: ตัวอักษรเล็ก ตัวหนา สี muted + border ล่าง
  - แถว: แบ่งแถวชัด (border หรือพื้นหลังสลับ) และ hover state ชัด
  - ตัวเลข: จัดขวา ใช้ tabular figures

- **ข้อมูลตัวเลข (Block height, ราคา, จำนวน)**
  - ใช้ขนาดและน้ำหนักให้ hierarchy ชัด: ตัวเลขหลักใหญ่และหนา หน่วยหรือคำอธิบายเล็กและสี muted
  - ถ้ามีหน่วย (AXX/hr, ms) ใช้สีรองและขนาดเล็กกว่าตัวเลข

---

### Phase 4: Visual Detail และ Motion — ต่ำ (ทำทีหลัง)

- **Icon**
  - ใช้ชุด icon เดียว (เช่น Heroicons, Lucide) และขนาดสม่ำเสมอ (16/20/24)
  - สถานะ (Online/Offline): icon + สี + ข้อความ ให้สอดคล้องทั้งไซต์

- **Motion**
  - โฟกัสที่การเปลี่ยนสถานะ (loading, success, error) และ hover/focus
  - หลีกเลี่ยง animation ใหญ่ที่รบกวนการอ่านข้อมูล

- **Background**
  - ถ้าต้องการ “tech” มากขึ้น: ลดจุดดาวหรือเปลี่ยนเป็น grid/subtle pattern แทน
  - เก็บ gradient ได้แต่ลดความเด่น (opacity ต่ำ) เพื่อไม่ให้แย่งความสนใจจากเนื้อหา

---

## 3. ลำดับการทำที่แนะนำ

1. **Phase 1 (ฟอนต์)** – เปลี่ยน/เพิ่ม font, ตั้ง scale และใช้ mono ที่ข้อมูลเทคนิค  
2. **Phase 2 (สี)** – เลือกแนว A หรือ B แล้วอัปเดต CSS variables + Tailwind  
3. **Phase 3 (Layout/Component)** – ปรับการ์ด ตาราง และ spacing หน้าหลัก (Marketplace, Validators, Dashboard)  
4. **Phase 4 (Detail)** – icon, motion, background ทำทีหลังเมื่อโทนและ layout พอใจแล้ว  

---

## 4. ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | ใช้ปรับ |
|------|--------|
| `src/app/layout.tsx` | ฟอนต์ (next/font) |
| `tailwind.config.ts` | fontFamily, colors, spacing |
| `src/app/globals.css` | CSS variables, base typography |
| `src/app/marketplace/page.tsx` | ตาราง workers, การ์ด |
| `src/app/validators/page.tsx` | การ์ด validator, ตัวเลข |
| `src/components/layout/Navbar.tsx` | เมนู, ปุ่ม |
| `src/components/home/*` | หน้าแรก hero, การ์ด |

---

## 5. ตัวอย่างแนวทางสี (Tech accent)

```css
/* ตัวอย่างเพิ่มใน :root – ทางเลือก A */
--tech-cyan: #06b6d4;
--tech-cyan-muted: rgba(6, 182, 212, 0.15);
--tech-success: #22c55e;
--tech-warning: #eab308;
--tech-error: #ef4444;
```

ใช้ `--tech-cyan` เป็น accent หลักสำหรับลิงก์ ปุ่ม และสถานะ แล้วเก็บทองไว้เฉพาะ logo และ CTA หลัก จะช่วยให้โทนโดยรวม “technology” ขึ้นโดยไม่ทิ้งอัตลักษณ์เดิมทั้งหมด

---

ถ้าพร้อมเริ่มทำ แนะนำเริ่มจาก **Phase 1 (ฟอนต์)** แล้วค่อย **Phase 2 (สี)** จะเห็นผลการเปลี่ยนแปลงชัดที่สุดต่อความรู้สึก “เว็บเทคโนโลยี”
