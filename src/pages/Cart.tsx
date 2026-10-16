import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Cart() {
  const navigate = useNavigate();
  // สมมติว่าใน useStore ของคุณหนูมี cart และฟังก์ชันจัดการตะกร้า (ถ้าชื่อฟังก์ชันต่างกันสามารถปรับแก้ได้เลยครับ)
  const cart = useStore((state) => (state as any).cart || (state as any).collection || []);
  const removeFromCart = useStore((state) => (state as any).removeFromCart || (state as any).toggleCollection);

  const totalAmount = cart.reduce((sum: number, item: any) => sum + (item.price || 0), 0);

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[85vh]">
      <h1 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-3xl border border-base-200 shadow-sm">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-2">ตะกร้าสินค้าว่างเปล่า</h2>
          <p className="text-gray-500 mb-6">ยังไม่มีสินค้าในตะกร้าของคุณ ไปเลือกช้อปกันเลย!</p>
          <Link to="/" className="btn btn-primary">Go to Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* รายการสินค้าในตะกร้า (ฝั่งซ้าย) */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between bg-base-100 p-4 rounded-2xl shadow-sm border border-base-200">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-xl" />
                  <div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-primary font-bold">฿{item.price}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item)}
                  className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                >
                  ✕ ลบ
                </button>
              </div>
            ))}
          </div>

          {/* สรุปยอดคำสั่งซื้อ (ฝั่งขวา) */}
          <div className="lg:col-span-4">
            <div className="bg-base-100 p-6 rounded-3xl shadow-md border border-base-200 sticky top-8">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>ยอดรวมสินค้า</span>
                <span>฿{totalAmount}</span>
              </div>
              <div className="flex justify-between mb-4 text-gray-600">
                <span>ค่าจัดส่ง</span>
                <span className="text-success font-semibold">ฟรี</span>
              </div>
              <div className="divider my-2"></div>
              <div className="flex justify-between mb-6 text-xl font-bold">
                <span>ยอดสุทธิ</span>
                <span className="text-primary">฿{totalAmount}</span>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="btn btn-primary w-full text-lg shadow-md"
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}