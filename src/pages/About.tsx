export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">

      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-base-content mb-4 tracking-tight">About the Developers</h1>
        <p className="text-xl text-base-content/70">
          ข้อมูลเกี่ยวกับทีมนักศึกษาผู้พัฒนาโปรเจกต์
        </p>
      </div>

      {/* Members Section */}
      <div className="grid md:grid-cols-2 gap-12 mb-24">

        {/* ============================================== */}
        {/* สมาชิกคนที่ 1 */}
        {/* ============================================== */}
        <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden hover:shadow-2xl transition-shadow group">
          <figure className="px-8 pt-10 pb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent -z-10 h-1/2"></div>

            <div className="w-48 h-48 rounded-full bg-base-300 border-4 border-white overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
              <img
                src="https://instagram.fbkk12-3.fna.fbcdn.net/v/t51.82787-19/836882654_18564723625079749_7153098783358130269_n.jpg?_nc_cat=110&_nc_map=urlgen_bucketless&ig_cache_key=GN7Q4THFswaNhPRBAF0YV9lx6URjbmNDAQAB0j-ccb7-5&ccb=7-5&_nc_sid=669407&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=GBetJtCoKgQQ7kNvwGwPkD1&_nc_oc=AdrtyieE2qyKpjHyqexSNhGH70MMWkJ6OZ8mAIfQOf62Q5J5_az3SPT3xm6DAEpoF0O3-AB-LvWYZXLx3ECl_r5R&_nc_zt=24&_nc_ht=instagram.fbkk12-3.fna&_nc_gid=mirpjhw9SHanTSgtA-vadg&_nc_ss=7b6a8&oh=00_AQS9S8Fy2EWNkNrzsOjkHt0_Xxw6_eHDTb41Eq3WmiFYKg&oe=6AF8F5F8"
                alt="Bintou Kourouma"
                className="w-full h-full object-cover"
              />
            </div>
          </figure>

          <div className="card-body items-center text-center pt-2">
            <h2 className="card-title text-3xl font-bold mb-2">Bintou Kourouma</h2>

            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <span className="badge badge-primary badge-outline badge-lg font-medium">ชื่อเล่น: BINTOU</span>
              <span className="badge badge-secondary badge-outline badge-lg font-medium font-sans">รหัสนักศึกษา: 1650707050</span>
            </div>

            <div className="w-full divider my-2 text-base-content/40 text-sm uppercase tracking-widest">Responsibilities</div>

            <ul className="text-left w-full space-y-3 mt-2 text-base-content/80">
              <li className="flex gap-3">
                <span className="text-xl">🎨</span>
                <span>ออกแบบ UI (User Interface) ให้สวยงามและใช้งานง่าย</span>
              </li>
              <li className="flex gap-3">
                <span className="text-xl">🗄️</span>
                <span>ออกแบบโครงสร้างข้อมูล (Schema) และตารางใน Database</span>
              </li>
              <li className="flex gap-3">
                <span className="text-xl">✨</span>
                <span>เขียนโค้ดและพัฒนาหน้าฟีเจอร์พิเศษ (Special Feature Page)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ============================================== */}
        {/* สมาชิกคนที่ 2 */}
        {/* ============================================== */}
        <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden hover:shadow-2xl transition-shadow group">
          <figure className="px-8 pt-10 pb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 to-transparent -z-10 h-1/2"></div>

            <div className="w-48 h-48 rounded-full bg-base-300 border-4 border-white overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
              <img
                src="https://scontent.fbkk8-2.fna.fbcdn.net/v/t39.30808-6/540840805_2166655090491674_1671115267515422549_n.jpg?stp=dst-jpg_tt6&cstp=mx960x960&ctp=s960x960&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=qSf8abrXSEAQ7kNvwFfbdkZ&_nc_oc=AdrlR5R9R74qj83zW3OpayxRBMpEEUMb7ODZkIBUfL-OIWymuhzGssHaQBsHXin_oE3G04lZqz_BbXuTKb5KA0WS&_nc_zt=23&_nc_ht=scontent.fbkk8-2.fna&_nc_gid=CMDBczF0cxgWLz6ZD0D7OQ&_nc_ss=7b2a8&oh=00_AQRegCdsaMkY6nlhUqrZpS46jzv8wyTldMI8iytqMRzkrw&oe=6AF8F7EA"
                alt="Thiyada Khianatragool"
                className="w-full h-full object-cover"
              />
            </div>
          </figure>

          <div className="card-body items-center text-center pt-2">
            <h2 className="card-title text-3xl font-bold mb-2">Thiyada Khianatragool</h2>

            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <span className="badge badge-primary badge-outline badge-lg font-medium">ชื่อเล่น: TOEY</span>
              <span className="badge badge-secondary badge-outline badge-lg font-medium font-sans">รหัสนักศึกษา: 1650702168</span>
            </div>

            <div className="w-full divider my-2 text-base-content/40 text-sm uppercase tracking-widest">Responsibilities</div>

            <ul className="text-left w-full space-y-3 mt-2 text-base-content/80">
              <li className="flex gap-3">
                <span className="text-xl">💻</span>
                <span>พัฒนาระบบ Full-Stack (React Frontend + Express Backend)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-xl">⚙️</span>
                <span>สร้าง RESTful API และเชื่อมต่อ Database (Supabase + Prisma)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-xl">🛒</span>
                <span>พัฒนาระบบ Authentication, Cart และ Wishlist ด้วย React Query</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* แหล่งที่มาของเทคโนโลยีและข้อมูล */}
      <div className="bg-base-100 p-10 rounded-3xl border border-base-200 shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

        <h3 className="text-3xl font-black mb-8 flex items-center gap-4 border-b-2 border-base-200 pb-4">
          <span className="text-4xl">🚀</span> เทคโนโลยีและข้อมูล (Tech Stack & Attribution)
        </h3>

        <div className="space-y-6 relative z-10">

          {/* 1. Supabase & Prisma */}
          <div className="flex flex-col md:flex-row gap-6 p-6 bg-base-50 rounded-2xl border border-base-200 hover:border-primary/30 transition-colors">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-2">Supabase & Prisma ORM</h4>
              <p className="text-base-content/70 mb-4 leading-relaxed">
                ระบบจัดการฐานข้อมูล PostgreSQL บน Cloud (Supabase) ทำงานร่วมกับ Prisma ORM ในฝั่ง Backend (Node.js/Express) เพื่อจัดการข้อมูลผู้ใช้, ตะกร้าสินค้า และรายการโปรดแบบ Real-time
              </p>
              <div className="flex gap-2">
                <a href="https://supabase.com/docs" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline btn-primary">
                  🔗 Supabase Docs
                </a>
                <a href="https://www.prisma.io/docs" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline">
                  🔗 Prisma Docs
                </a>
              </div>
            </div>
          </div>

          {/* 2. TanStack Query */}
          <div className="flex flex-col md:flex-row gap-6 p-6 bg-base-50 rounded-2xl border border-base-200 hover:border-secondary/30 transition-colors">
            <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-2">TanStack Query (React Query)</h4>
              <p className="text-base-content/70 mb-4 leading-relaxed">
                เครื่องมือจัดการ Server State อันทรงพลัง ใช้สำหรับ Fetch, Cache, และอัปเดตข้อมูลจาก API ทำให้หน้าเว็บแสดงผลได้อย่างลื่นไหลและมีประสิทธิภาพ
              </p>
              <a href="https://tanstack.com/query/latest" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline btn-secondary">
                🔗 TanStack Query
              </a>
            </div>
          </div>

          {/* 3. Unsplash API */}
          <div className="flex flex-col md:flex-row gap-6 p-6 bg-base-50 rounded-2xl border border-base-200 hover:border-accent/30 transition-colors">
            <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-2">Unsplash Images & db.json</h4>
              <p className="text-base-content/70 mb-4 leading-relaxed">
                ข้อมูลแคตตาล็อกสินค้าดึงมาจากไฟล์ <code>db.json</code> (เพื่อความรวดเร็วในการอ่านข้อมูล) โดยภาพประกอบทั้งหมดนำมาจาก Unsplash คลังภาพฟรีสำหรับนักพัฒนา
              </p>
              <a href="https://unsplash.com/developers" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline">
                🔗 Unsplash API
              </a>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}