import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="p-8 max-w-5xl mx-auto min-h-[80vh]">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">About the Project</h1>
        <p className="text-xl text-gray-500">MinimalThreads - E-commerce Web Application</p>
      </div>

      <div className="bg-base-100 rounded-3xl p-8 md:p-12 shadow-sm border border-base-200 mb-12">
        <h2 className="text-3xl font-bold mb-8 border-b pb-4 text-center">Tech Stack & Architecture</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <span className="badge badge-lg badge-primary">React 19</span>
          <span className="badge badge-lg badge-secondary">TypeScript</span>
          <span className="badge badge-lg badge-accent">Vite</span>
          <span className="badge badge-lg badge-neutral">Tailwind CSS</span>
          <span className="badge badge-lg badge-ghost border-gray-300">DaisyUI</span>
          <span className="badge badge-lg badge-info">Zustand</span>
          <span className="badge badge-lg badge-success">TanStack Query</span>
          <span className="badge badge-lg badge-warning">React Router v7</span>
        </div>
        <p className="text-center text-gray-600 max-w-3xl mx-auto">
          โปรเจกต์นี้ใช้สถาปัตยกรรม SPA (Single Page Application) ดึงข้อมูลจำลอง 40 รายการจาก <code className="bg-gray-100 px-2 py-1 rounded">json-server</code> 
          และใช้ <strong>Zustand Persist</strong> ในการจัดการ State ของคอลเลกชันส่วนตัวเพื่อไม่ให้ข้อมูลสูญหายเมื่อรีเฟรชหน้าเว็บ
        </p>
      </div>

      <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* กล่องคนที่ 1: UX/UI Designer */}
        <div className="card bg-base-100 shadow-xl border-t-4 border-t-primary">
          <div className="card-body items-center text-center">
            <div className="avatar mb-4">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src="https://placehold.co/200x200/cc7a5c/ffffff?text=Designer" alt="UX/UI" />
              </div>
            </div>
            <h3 className="card-title text-2xl">[ชื่อ-นามสกุล เพื่อน]</h3>
            <p className="text-primary font-semibold mb-4">UX/UI Designer</p>
            <ul className="text-left text-sm text-gray-600 space-y-2 w-full px-4">
              <li>🎨 ออกแบบหน้าจอเว็บแอปพลิเคชันทั้ง 5 หน้าผ่านโปรแกรม <strong>Figma</strong></li>
              <li>📐 กำหนดโทนสี เลย์เอาต์ (Design System) และ User Flow</li>
              <li>🖼️ จัดเตรียมไฟล์ภาพและชิ้นส่วน UI เพื่อส่งต่อให้ผู้พัฒนา</li>
            </ul>
          </div>
        </div>

        {/* กล่องคนที่ 2: Frontend Developer */}
        <div className="card bg-base-100 shadow-xl border-t-4 border-t-secondary">
          <div className="card-body items-center text-center">
            <div className="avatar mb-4">
              <div className="w-24 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                <img src="https://placehold.co/200x200/7a5ccc/ffffff?text=Frontend" alt="Developer" />
              </div>
            </div>
            <h3 className="card-title text-2xl">[ชื่อ-นามสกุล คุณหนู]</h3>
            <p className="text-secondary font-semibold mb-4">Frontend Developer</p>
            <ul className="text-left text-sm text-gray-600 space-y-2 w-full px-4">
              <li>💻 เขียนโค้ดพัฒนาหน้าเว็บด้วย <strong>React 19, TypeScript</strong> และ <strong>Tailwind CSS</strong></li>
              <li>⚙️ จัดการระบบคอลเลกชันด้วย <strong>Zustand</strong> และจัดการ API ด้วย <strong>TanStack Query</strong></li>
              <li>🚀 วางระบบ Routing และเชื่อมต่อการทำงานทั้งหมดให้เป็นแอปที่สมบูรณ์</li>
            </ul>
          </div>
        </div>

      </div>

      <div className="text-center mt-12">
        <Link to="/" className="btn btn-outline btn-wide">กลับสู่หน้าหลัก</Link>
      </div>
    </div>
  );
}