import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';

interface CartItemFromDB {
  id: number;
  userId: number;
  productId: number;
  selectedSize?: string;
  selectedStyle?: string;
  selectedImage?: string;
  quantity?: number; 
}

export default function Cart() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // ดึง userId จาก AuthStore (ถ้ายังไม่ล็อกอินจะเป็น null)
  const userId = useAuthStore(state => state.userId); 

  // 1. ดึงข้อมูลตะกร้าจาก Backend Database (ดึงเฉพาะตอนที่ Login แล้ว)
  const { data: dbCartItems = [], isLoading: isCartLoading } = useQuery<CartItemFromDB[]>({
    queryKey: ['cart', userId],
    queryFn: async () => {
      if (!userId) return []; // ป้องกันการดึงข้อมูลถ้ายังไม่ล็อกอิน
      const res = await fetch(`http://localhost:3000/api/cart/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch cart');
      return res.json();
    },
    enabled: !!userId // Query จะทำงานก็ต่อเมื่อ userId มีค่าเท่านั้น
  });

  // 2. ดึงข้อมูลสินค้าทั้งหมดจาก db.json
  const { data: allProducts = [], isLoading: isProductLoading } = useQuery<any[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/api/products');
      const data = await res.json();
      return data; // คืนค่า data ตรงๆ ได้เลยครับ
    }
  });

  // ผสานข้อมูล
  const cartItems = dbCartItems.map(cartItem => {
    const productInfo = allProducts.find((p: any) => p.id === cartItem.productId) || {};
    return {
      ...cartItem,
      ...productInfo,
      id: cartItem.id, 
      quantity: 1 
    };
  });

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (cartItems.length > 0 && selectedIds.length === 0) {
      setSelectedIds(cartItems.map(item => item.id));
    }
  }, [cartItems]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  // 3. Mutation สำหรับลบสินค้าออกจาก Database
  const deleteMutation = useMutation({
    mutationFn: async (cartId: number) => {
      const res = await fetch(`http://localhost:3000/api/cart/${cartId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete item');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
    },
  });

  const totalPrice = cartItems
    .filter(item => selectedIds.includes(item.id))
    .reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);

  // 🌟 เช็กว่าถ้ายังไม่ Login ให้แสดงหน้าแจ้งเตือน
  if (!userId) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-base-100 transition-colors duration-300">
        <span className="text-6xl mb-4">🔒</span>
        <h2 className="text-3xl font-bold text-base-content mb-2">กรุณาเข้าสู่ระบบ</h2>
        <p className="text-base-content/60 mb-6">คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถดูตะกร้าสินค้าได้</p>
        <Link to="/login" className="btn btn-primary px-8">ไปหน้า Login</Link>
      </div>
    );
  }

  if (isCartLoading || isProductLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-base-100 transition-colors duration-300">
        <span className="text-6xl mb-4">🛒</span>
        <h2 className="text-3xl font-bold text-base-content mb-2">ตะกร้าสินค้าว่างเปล่า</h2>
        <p className="text-base-content/60 mb-6">ยังไม่มีสินค้าในตะกร้าของคุณ ไปเลือกช้อปกันเลย!</p>
        <Link to="/" className="btn btn-primary px-8">Go to Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 transition-colors duration-300">
      <h1 className="text-4xl font-serif font-bold text-base-content mb-10 border-b-2 border-base-200 pb-4 tracking-tight">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-6 p-4 bg-base-100 rounded-xl border border-base-200 shadow-sm hover:shadow-md transition-shadow">
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-primary" 
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                />
              </div>

              <img src={item.selectedImage || item.image} alt={item.title} className="w-28 h-36 object-cover rounded-lg shadow-sm" />
              
              <div className="flex-1 flex flex-col justify-between py-2">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-base-content line-clamp-1">{item.title || 'สินค้าไม่ระบุชื่อ'}</h3>
                    <button 
                      onClick={() => deleteMutation.mutate(item.id)} 
                      className="text-base-content/40 hover:text-red-500 transition-colors"
                      title="ลบสินค้า"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <span className="badge badge-secondary badge-sm">{item.category || 'Fashion'}</span>
                    <span className="text-sm text-base-content/70">
                      Size: <strong className="text-base-content text-base ml-1">{item.selectedSize || 'M'}</strong>
                    </span>
                    
                    {item.selectedStyle && (
                      <span className="text-sm text-base-content/70 border-l border-base-300 pl-3">
                        Style: <strong className="text-base-content text-base ml-1">{item.selectedStyle}</strong>
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-end mt-4">
                  <p className="text-2xl font-bold text-primary font-sans">฿{item.price || 0}</p>
                  
                  <div className="flex items-center text-sm font-bold text-base-content/70">
                    จำนวน: {item.quantity} ชิ้น
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-96">
          <div className="bg-base-100 p-8 rounded-xl border border-base-200 shadow-sm sticky top-10">
            <h2 className="text-2xl font-bold mb-6 text-base-content">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-base-content/80">
              <div className="flex justify-between">
                <span className="font-sans">Subtotal ({selectedIds.length} items)</span>
                <span className="font-medium font-sans">฿{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-medium text-success">Free</span>
              </div>
            </div>
            
            <div className="border-t border-base-300 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-base-content">Total</span>
                <span className="text-3xl font-bold text-primary font-sans">฿{totalPrice}</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/checkout', { state: { selectedIds } })} 
              disabled={selectedIds.length === 0}
              className="btn btn-primary w-full text-lg shadow-md hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Checkout {selectedIds.length > 0 ? <span className="font-sans">({selectedIds.length})</span> : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}