# Ollama Web UI แนวทางปฏิบัติที่ดีที่สุด

เอกสารนี้รวบรวมแนวทางปฏิบัติที่ดีที่สุดสำหรับการพัฒนา Ollama Web UI เพื่อให้มั่นใจในคุณภาพของโค้ด, ความสอดคล้องกัน, และความสามารถในการบำรุงรักษา

## 1. โครงสร้างโปรเจกต์

จัดระเบียบไฟล์และโฟลเดอร์ให้ชัดเจนและสอดคล้องกัน:

- `src/`: โค้ดต้นฉบับทั้งหมด
  - `src/lib/`: ไลบรารีและโมดูลที่ใช้ซ้ำได้
    - `src/lib/components/`: คอมโพเนนต์ Svelte
      - `src/lib/components/chat/`: คอมโพเนนต์ที่เกี่ยวข้องกับหน้าต่างแชท
      - `src/lib/components/common/`: คอมโพเนนต์ทั่วไปที่ใช้ซ้ำได้
      - `src/lib/components/layout/`: คอมโพเนนต์โครงสร้างหน้า
    - `src/lib/stores/`: Svelte stores สำหรับการจัดการสถานะ
    - `src/lib/utils/`: ฟังก์ชันยูทิลิตี้
  - `src/routes/`: หน้าเว็บและเลย์เอาต์ (SvelteKit)
- `static/`: ไฟล์คงที่ (รูปภาพ, CSS, JS ภายนอก)

## 2. การเขียนโค้ด (Coding Style)

### 2.1 JavaScript/TypeScript

- ใช้ TypeScript สำหรับโค้ดฝั่งไคลเอ็นต์ทั้งหมด เพื่อประโยชน์ด้าน Type Safety และการบำรุงรักษา
- ปฏิบัติตามมาตรฐาน ESLint และ Prettier ที่กำหนดไว้ในโปรเจกต์อย่างเคร่งครัด
- ใช้ `const` สำหรับตัวแปรที่ไม่เปลี่ยนแปลง และ `let` สำหรับตัวแปรที่เปลี่ยนแปลง
- หลีกเลี่ยง `var`
- ใช้ Arrow Functions (`=>`) แทน `function` ทั่วไปเมื่อเหมาะสม
- เขียนโค้ดที่อ่านง่าย, มีความหมาย, และมีการจัดรูปแบบที่ดี

### 2.2 Svelte

- **Single File Component (SFC):** จัดโครงสร้างคอมโพเนนต์ Svelte ในไฟล์ `.svelte` เดียว โดยมี `<script>`, `<style>`, และ `<template>` อยู่ในไฟล์เดียวกัน
- **Props:** ส่งข้อมูลไปยังคอมโพเนนต์ลูกผ่าน `export let`
- **Reactivity:** ใช้ `$:` สำหรับการประกาศ reactive statement อย่างมีประสิทธิภาพ
- **Actions:** ใช้ custom actions สำหรับการจัดการ DOM โดยตรง
- **Context API:** ใช้ `getContext` และ `setContext` สำหรับการส่งข้อมูลข้ามคอมโพเนนต์ลึกๆ แทนการ props drilling
- **Lifecycle Functions:** ใช้ `onMount`, `beforeUpdate`, `afterUpdate`, `onDestroy` อย่างเหมาะสม
- **Accessibility:** คำนึงถึงการเข้าถึง (a11y) เสมอ โดยใช้ semantic HTML และ ARIA attributes เมื่อจำเป็น

### 2.3 CSS/Tailwind CSS

- ใช้ Tailwind CSS สำหรับการจัดรูปแบบส่วนใหญ่ เพื่อความรวดเร็วและความสอดคล้อง
- หลีกเลี่ยงการเขียน CSS แบบ custom มากเกินไป หาก Tailwind CSS สามารถทำได้
- หากจำเป็นต้องเขียน Custom CSS ให้ใช้ไฟล์ `src/app.css` หรือสร้างไฟล์ `.svelte` ที่มี `<style>` scoped
- จัดระเบียบ Tailwind classes ตามลำดับความสำคัญหรือประเภท (เช่น layout, positioning, typography, spacing, sizing, etc.)

## 3. การจัดการสถานะ (State Management)

- ใช้ Svelte stores (`writable`, `readable`, `derived`) สำหรับการจัดการสถานะทั่วแอปพลิเคชัน
- สำหรับสถานะที่ซับซ้อนหรือไม่จำเป็นต้อง reactive ทั่วทั้งแอปพลิเคชัน ให้พิจารณาใช้ Context API หรือสถานะภายในคอมโพเนนต์
- หลีกเลี่ยงการใช้ global variables

## 4. การจัดการ API และข้อมูล

- แยกโค้ดการเรียก API ออกจากคอมโพเนนต์ UI
- ใช้ `fetch` API หรือไลบรารีที่เหมาะสมสำหรับการเรียก API
- จัดการกับข้อผิดพลาด (error handling) จากการเรียก API อย่างเหมาะสม
- ใช้ TypeScript interfaces สำหรับโครงสร้างข้อมูลที่ได้รับจาก API

## 5. การทดสอบ (Testing)

- เขียน Unit Tests สำหรับฟังก์ชันยูทิลิตี้และ logic ที่สำคัญ
- เขียน Component Tests สำหรับคอมโพเนนต์ Svelte โดยใช้ไลบรารีเช่น `@testing-library/svelte`
- พิจารณาการเขียน End-to-End Tests สำหรับฟังก์ชันการทำงานที่สำคัญของแอปพลิเคชัน

## 6. ประสิทธิภาพ (Performance)

- Optimize การโหลดทรัพยากร (รูปภาพ, ฟอนต์)
- ใช้ Lazy Loading สำหรับคอมโพเนนต์หรือโมดูลที่ไม่จำเป็นต้องโหลดตั้งแต่เริ่มต้น
- ระมัดระวังเรื่องการ re-render ของคอมโพเนนต์ Svelte ที่ไม่จำเป็น
- ใช้ Debounce หรือ Throttle สำหรับ event handler ที่อาจถูกเรียกใช้บ่อยครั้ง

## 7. การปรับใช้ (Deployment)

- ตรวจสอบให้แน่ใจว่าโค้ดพร้อมสำหรับการ production (minified, optimized)
- กำหนดค่า environment variables อย่างเหมาะสมสำหรับแต่ละสภาพแวดล้อม (development, production)

## 8. ความปลอดภัย (Security)

- ระมัดระวังเรื่อง XSS (Cross-Site Scripting) และ CSRF (Cross-Site Request Forgery)
- ไม่เก็บข้อมูลที่ละเอียดอ่อนในโค้ดฝั่งไคลเอ็นต์
- ตรวจสอบและ sanitize input จากผู้ใช้เสมอ

## 9. การจัดการเวอร์ชัน (Version Control)

- ใช้ Git สำหรับการจัดการเวอร์ชัน
- ใช้ branch ที่เหมาะสม (เช่น `main`, `develop`, `feature`, `bugfix`)
- เขียน commit message ที่ชัดเจนและมีความหมาย
- ทำ Code Review ก่อนรวมโค้ดเข้าสู่ branch หลัก

## 10. การจัดทำเอกสาร (Documentation)

- เขียน README.md ที่ชัดเจนและครบถ้วนสำหรับโปรเจกต์
- เพิ่ม comment ในโค้ดเมื่อจำเป็น โดยเฉพาะสำหรับ logic ที่ซับซ้อน
- จัดทำเอกสารสำหรับฟังก์ชันหรือคอมโพเนนต์ที่สำคัญ

การปฏิบัติตามแนวทางเหล่านี้จะช่วยให้โปรเจกต์ Ollama Web UI มีคุณภาพสูง, บำรุงรักษาง่าย, และสามารถขยายขนาดได้ในอนาคต.