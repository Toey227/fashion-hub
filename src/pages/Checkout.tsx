import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  
  // State เก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethods: {
      qr: true,
      cod: false
    }
  });

  // State สำหรับเก็บข้อความแจ้งเตือน Error
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    address: '',
    payment: ''
  });

  const handleCheckboxChange = (method: 'qr' | 'cod') => {
    setFormData({
      ...formData,
      paymentMethods: {
        qr: method === 'qr' ? !formData.paymentMethods.qr : false,
        cod: method === 'cod' ? !formData.paymentMethods.cod : false,
      }
    });
    // ล้าง Error เมื่อผู้ใช้เลือกวิธีชำระเงิน
    setErrors(prev => ({ ...prev, payment: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let newErrors = { name: '', phone: '', address: '', payment: '' };
    let isValid = true;

    // 1. เช็คชื่อ-นามสกุล
    if (!formData.name.trim()) {
      newErrors.name = 'กรุณากรอกชื่อ-นามสกุลผู้รับ';
      isValid = false;
    }

    // 2. เช็คเบอร์โทรศัพท์ (ต้องเป็นตัวเลข 10 หลัก)
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
      isValid = false;
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข 10 หลัก)';
      isValid = false;
    }

    // 3. เช็คที่อยู่
    if (!formData.address.trim()) {
      newErrors.address = 'กรุณากรอกที่อยู่จัดส่งสินค้าให้ครบถ้วน';
      isValid = false;
    }

    // 4. เช็คว่าเลือกช่องทางชำระเงินอย่างน้อย 1 ช่องทางไหม
    if (!formData.paymentMethods.qr && !formData.paymentMethods.cod) {
      newErrors.payment = 'กรุณาเลือกวิธีการชำระเงินอย่างน้อย 1 ช่องทาง';
      isValid = false;
    }

    setErrors(newErrors);

    // ถ้าผ่านเงื่อนไขทั้งหมด
    if (isValid) {
      alert('สั่งซื้อสินค้าสำเร็จแล้ว! ขอบคุณที่ใช้บริการ Fashion Hub ครับ 🎉');
      navigate('/');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-[85vh]">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout & Shipping</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8" noValidate>
        
        {/* ฟอร์มที่อยู่จัดส่ง */}
        <div className="bg-base-100 p-6 rounded-3xl shadow-sm border border-base-200 space-y-4">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>📍</span> ที่อยู่จัดส่งสินค้า
          </h2>
          
          {/* ชื่อ-นามสกุล */}
          <div>
            <label className="label font-medium">ชื่อ-นามสกุล</label>
            <input 
              type="text" 
              placeholder="กรอกชื่อ-นามสกุลของคุณหนู" 
              className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
              value={formData.name}
              onChange={(e) => {
                setFormData({...formData, name: e.target.value});
                if(errors.name) setErrors({...errors, name: ''});
              }}
            />
            {errors.name && <span className="text-error text-xs mt-1 block">{errors.name}</span>}
          </div>

          {/* เบอร์โทรศัพท์ */}
          <div>
            <label className="label font-medium">เบอร์โทรศัพท์</label>
            <input 
              type="tel" 
              maxLength={10}
              placeholder="0812345678" 
              className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`}
              value={formData.phone}
              onChange={(e) => {
                setFormData({...formData, phone: e.target.value});
                if(errors.phone) setErrors({...errors, phone: ''});
              }}
            />
            {errors.phone && <span className="text-error text-xs mt-1 block">{errors.phone}</span>}
          </div>

          {/* ที่อยู่จัดส่ง */}
          <div>
            <label className="label font-medium">ที่อยู่จัดส่ง</label>
            <textarea 
              placeholder="บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์" 
              className={`textarea textarea-bordered w-full h-28 ${errors.address ? 'textarea-error' : ''}`}
              value={formData.address}
              onChange={(e) => {
                setFormData({...formData, address: e.target.value});
                if(errors.address) setErrors({...errors, address: ''});
              }}
            ></textarea>
            {errors.address && <span className="text-error text-xs mt-1 block">{errors.address}</span>}
          </div>
        </div>

        {/* วิธีการชำระเงินและปุ่มยืนยัน */}
        <div className="bg-base-100 p-6 rounded-3xl shadow-sm border border-base-200 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>💳</span> วิธีการชำระเงิน
            </h2>
            
            <div className="space-y-3">
              {/* พร้อมเพย์ QR Code */}
              <label className="flex items-center gap-3 p-4 border rounded-2xl cursor-pointer hover:bg-base-200/50 transition-all">
                <input 
                  type="checkbox" 
                  checked={formData.paymentMethods.qr}
                  onChange={() => handleCheckboxChange('qr')}
                  className="checkbox checkbox-primary rounded-md" 
                />
                <div>
                  <span className="font-bold block">พร้อมเพย์ QR Code</span>
                  <span className="text-xs text-gray-500">สแกนจ่ายผ่านแอปพลิเคชันธนาคาร</span>
                </div>
              </label>

              {/* เก็บเงินปลายทาง */}
              <label className="flex items-center gap-3 p-4 border rounded-2xl cursor-pointer hover:bg-base-200/50 transition-all">
                <input 
                  type="checkbox" 
                  checked={formData.paymentMethods.cod}
                  onChange={() => handleCheckboxChange('cod')}
                  className="checkbox checkbox-primary rounded-md" 
                />
                <div>
                  <span className="font-bold block">เก็บเงินปลายทาง (COD)</span>
                  <span className="text-xs text-gray-500">ชำระเงินเมื่อได้รับสินค้า</span>
                </div>
              </label>
            </div>
            {errors.payment && <span className="text-error text-xs mt-2 block">{errors.payment}</span>}
          </div>

          <div className="mt-8">
            <button type="submit" className="btn btn-primary w-full text-lg shadow-lg">
              Confirm Order (ยืนยันคำสั่งซื้อ)
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}