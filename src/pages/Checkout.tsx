import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Checkout() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  const selectedIds = location.state?.selectedIds || [];
  const removeCheckoutItems = useStore(state => state.removeCheckoutItems);

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedIds.length > 0) {
      removeCheckoutItems(selectedIds);
    }

    setShowSuccessModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">Checkout & Shipping</h1>

      <form onSubmit={handleConfirmOrder} className="flex flex-col lg:flex-row gap-8">


        <div className="flex-1 bg-base-100 p-8 rounded-3xl border border-base-200 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-primary text-2xl">📍</span> ที่อยู่จัดส่งสินค้า
          </h2>
          <div className="space-y-4">
            <div>
              <label className="label"><span className="label-text font-bold">ชื่อ-นามสกุล</span></label>
              <input type="text" placeholder="กรอกชื่อ-นามสกุล" className="input input-bordered w-full bg-base-50" required />
            </div>
            <div>
              <label className="label"><span className="label-text font-bold">เบอร์โทรศัพท์</span></label>
              <input type="tel" placeholder="0812345678" className="input input-bordered w-full bg-base-50 font-sans"
                required />
            </div>
            <div>
              <label className="label"><span className="label-text font-bold">ที่อยู่จัดส่ง</span></label>
              <textarea placeholder="บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์" className="textarea textarea-bordered w-full bg-base-50 h-24" required></textarea>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-base-100 p-8 rounded-3xl border border-base-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-primary text-2xl">💳</span> วิธีการชำระเงิน
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-4 p-4 border border-base-300 rounded-xl cursor-pointer hover:bg-base-50 transition-colors">
                <input type="radio" name="payment" className="radio radio-primary" defaultChecked />
                <div>
                  <p className="font-bold">พร้อมเพย์ QR Code</p>
                  <p className="text-sm text-base-content/60">สแกนจ่ายผ่านแอปพลิเคชันธนาคาร</p>
                </div>
              </label>
              <label className="flex items-center gap-4 p-4 border border-base-300 rounded-xl cursor-pointer hover:bg-base-50 transition-colors">
                <input type="radio" name="payment" className="radio radio-primary" />
                <div>
                  <p className="font-bold">เก็บเงินปลายทาง (COD)</p>
                  <p className="text-sm text-base-content/60">ชำระเงินเมื่อได้รับสินค้า</p>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-8 text-lg rounded-xl h-14 shadow-md hover:scale-[1.02] transition-transform">
            Confirm Order (ยืนยันคำสั่งซื้อ)
          </button>
        </div>
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-base-100 text-center p-10 shadow-2xl rounded-3xl max-w-md w-full">
            <div className="text-7xl mb-4 animate-bounce">🎉</div>
            <h3 className="font-black text-4xl text-success mb-3 tracking-tight">สั่งซื้อสำเร็จ!</h3>
            <p className="text-base-content/70 text-lg mb-8 leading-relaxed">
              ระบบได้รับคำสั่งซื้อของคุณเรียบร้อยแล้ว<br />
              เตรียมรอรับสินค้าชิ้นใหม่ที่บ้านได้เลยครับ!
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/');
              }}
              className="btn btn-primary w-full text-xl h-14 rounded-2xl shadow-lg hover:scale-105 transition-all"
            >
              กลับสู่หน้าหลัก
            </button>
          </div>
        </div>
      )}
    </div>
  );
}