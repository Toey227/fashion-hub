import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating: number;
}

export default function Collection() {
  const queryClient = useQueryClient();
  const userId = useAuthStore(state => state.userId);
  const [itemToRemove, setItemToRemove] = useState<Product | null>(null);

  // 1. ดึงข้อมูลรายการโปรดจาก Backend (เฉพาะตอน Login)
  const { data: dbWishlist = [], isLoading: isWishlistLoading } = useQuery<any[]>({
    queryKey: ['wishlist', userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await fetch(`http://localhost:3000/api/wishlist/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch wishlist');
      return res.json();
    },
    enabled: !!userId
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

  // ผสานข้อมูล Wishlist จาก DB กับข้อมูล Product จาก db.json
  const collection = dbWishlist.map(wishlistItem => {
    const productInfo = allProducts.find((p: any) => p.id === wishlistItem.productId) || {};
    return {
      ...productInfo,
      wishlistId: wishlistItem.id // เก็บ ID ของ DB ไว้ใช้ตอนกดลบ
    };
  });

  // 3. Mutation สำหรับลบออกจาก Wishlist (Toggle)
  const removeMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await fetch('http://localhost:3000/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
      setItemToRemove(null); // ปิดหน้าต่างยืนยัน
    }
  });

  const confirmRemove = () => {
    if (itemToRemove) {
      removeMutation.mutate(itemToRemove.id);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-base-100 transition-colors duration-300">
        <span className="text-6xl mb-4">🔒</span>
        <h2 className="text-3xl font-bold text-base-content mb-2">กรุณาเข้าสู่ระบบ</h2>
        <p className="text-base-content/60 mb-6">คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถดูรายการโปรดได้</p>
        <Link to="/login" className="btn btn-primary px-8">ไปหน้า Login</Link>
      </div>
    );
  }

  if (isWishlistLoading || isProductLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (collection.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-base-100 transition-colors duration-300">
        <span className="text-6xl mb-4">🤍</span>
        <h2 className="text-3xl font-bold text-base-content mb-2">My Collection ว่างเปล่า</h2>
        <p className="text-base-content/60 mb-6">คุณยังไม่ได้เซฟสินค้าชิ้นไหนไว้เลย ลองไปค้นหาสไตล์ที่ใช่กันเถอะ!</p>
        <Link to="/" className="btn btn-primary px-8">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 transition-colors duration-300 relative">

      <div className="flex justify-between items-end mb-10 border-b-2 border-base-200 pb-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-base-content uppercase tracking-tight">My Collection</h1>
          <p className="text-base-content/70 mt-2 font-medium">ไอเทมโปรดที่คุณบันทึกไว้ ({collection.length} ชิ้น)</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {collection.map((item: any) => (
          <div key={item.wishlistId} className="card bg-base-100 shadow-sm hover:shadow-xl border border-base-200 relative pt-3 px-3 transition-all duration-300 group overflow-hidden">

            <Link to={`/product/${item.id}`} className="absolute inset-0 z-10"></Link>

            <button
              className="btn btn-circle btn-xs bg-white/80 hover:bg-red-50 hover:text-red-500 text-gray-700 border-none absolute top-4 right-4 z-20 shadow-sm transition-colors"
              onClick={() => setItemToRemove(item)}
              title="Remove from Collection"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <figure className="overflow-hidden rounded-lg">
              <img src={item.image} alt={item.title} className="rounded-lg h-52 object-cover w-full group-hover:scale-105 transition-transform duration-500" />
            </figure>

            <div className="card-body items-center text-center p-4">
              <div className="badge badge-secondary badge-sm mb-1">{item.category}</div>
              <h2 className="card-title text-base text-base-content group-hover:text-[#C88A76] transition-colors line-clamp-1">{item.title}</h2>
              <p className="text-xl font-bold text-primary mt-2 font-sans">
                ฿{item.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {itemToRemove && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300">
          <div className="bg-base-100 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl scale-100 animate-fade-in-up">
            <h3 className="text-2xl font-bold text-base-content mb-2 text-center">ยืนยันการลบ?</h3>
            <p className="text-base-content/70 text-center mb-6">
              คุณต้องการลบ <strong>"{itemToRemove.title}"</strong> ออกจากคอลเลกชันใช่หรือไม่?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setItemToRemove(null)}
                className="btn btn-outline border-gray-300 text-gray-600 hover:bg-gray-100 flex-1"
                disabled={removeMutation.isPending}
              >
                ยกเลิก
              </button>
              
              <button
                onClick={confirmRemove}
                className="btn bg-red-500 hover:bg-red-600 border-none text-white flex-1 shadow-md hover:scale-[1.02] transition-transform"
                disabled={removeMutation.isPending}
              >
                {removeMutation.isPending ? '⏳ กำลังลบ...' : 'ลบสินค้า'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}