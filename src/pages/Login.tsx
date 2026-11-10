import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const loginMutation = useMutation({
    mutationFn: async (userData: any) => {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
      return data;
    },
    onSuccess: (data) => {
      login(data.userId); // บันทึก User ID ลง Zustand
      navigate('/'); // ล็อกอินเสร็จให้กลับไปหน้าแรก (Home)
    },
    onError: (error: any) => {
      setErrorMsg(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน');
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-base-100">
      <div className="card w-96 bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold justify-center mb-6 font-serif tracking-tight text-base-content">เข้าสู่ระบบ</h2>
          
          {errorMsg && (
            <div className="alert alert-error text-sm p-3 rounded-lg text-white mb-4">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-bold">อีเมล</span></label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered w-full focus:input-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="form-control w-full mt-4">
              <label className="label"><span className="label-text font-bold">รหัสผ่าน</span></label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full focus:input-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-control mt-8">
              <button
                type="submit"
                className="btn btn-primary w-full text-lg shadow-md hover:scale-[1.02] transition-transform"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'กำลังตรวจสอบ...' : 'Login'}
              </button>
            </div>
            
            <p className="text-center text-sm text-base-content/50 mt-6">
              * สำหรับการทดสอบ: หากกรอกอีเมลที่ยังไม่มีในระบบ ระบบจะสร้างบัญชีให้ใหม่และเข้าสู่ระบบทันที
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}