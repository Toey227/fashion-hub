import { Link, useParams, useNavigate } from 'react-router-dom';
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

export default function CategoryProducts() {
  const { categoryName } = useParams(); 
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.userId);

  // 1. ดึงข้อมูลสินค้าทั้งหมดจาก db.json
  const { data, isLoading, error } = useQuery<any>({
  queryKey: ['products'],
  queryFn: () => fetch('http://localhost:3000/api/products').then(res => res.json())
});

  // 2. ดึงข้อมูล Wishlist จาก Database
  const { data: wishlistData = [] } = useQuery<any[]>({
    queryKey: ['wishlist', userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await fetch(`http://localhost:3000/api/wishlist/${userId}`);
      return res.json();
    },
    enabled: !!userId,
  });

  // 3. Mutation สำหรับกดหัวใจ (Toggle Wishlist)
  const toggleWishlistMutation = useMutation({
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
    },
  });

  const handleToggleCollection = (productId: number) => {
    if (!userId) {
      alert('กรุณาเข้าสู่ระบบก่อนบันทึกรายการโปรด');
      navigate('/login');
      return;
    }
    toggleWishlistMutation.mutate(productId);
  };

  if (isLoading) return <div className="p-20 text-center flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
  if (error || !data) return <div className="p-20 text-center text-red-500 text-xl">ไม่สามารถโหลดข้อมูลสินค้าได้</div>;

  const products: Product[] = Array.isArray(data) ? data : (data.products || []);

  const filteredProducts = products.filter(
    p => p.category.toLowerCase() === categoryName?.toLowerCase()
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[80vh]">
      <button onClick={() => navigate(-1)} className="btn btn-ghost mb-6">
        ← ย้อนกลับ
      </button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2 capitalize text-base-content">Category: {categoryName}</h1>
        <p className="text-base-content/60">พบสินค้าทั้งหมด {filteredProducts.length} รายการในหมวดหมู่นี้</p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-3xl border border-base-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-2 text-base-content">ไม่พบสินค้าในหมวดหมู่นี้</h2>
          <Link to="/" className="btn btn-primary mt-4">กลับสู่หน้าแรก</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((item) => {
            // เช็กว่าสินค้านี้อยู่ใน Database Wishlist หรือไม่
            const isSaved = wishlistData.some((w: any) => w.productId === item.id);
            
            return (
              <div key={item.id} className="card bg-base-100 shadow-xl border border-base-200 relative pt-4 px-4 hover:shadow-2xl transition-all duration-300 group">
                
                {/* ลิงก์ครอบรูปภาพ กดแล้วไปหน้า Detail */}
                <Link to={`/product/${item.id}`} className="absolute inset-0 z-10"></Link>

                <button 
                  className="btn btn-circle btn-sm bg-white/80 hover:bg-white text-gray-700 border-none absolute top-6 right-6 z-20 shadow-md"
                  onClick={() => handleToggleCollection(item.id)}
                  disabled={toggleWishlistMutation.isPending}
                  title="Save to Collection"
                >
                  {isSaved ? <span className="text-red-500">❤️</span> : <span>🤍</span>}
                </button>

                <figure className="overflow-hidden rounded-xl">
                  <img src={item.image} alt={item.title} className="rounded-xl h-72 object-cover w-full group-hover:scale-105 transition-transform duration-500" />
                </figure>
                
                <div className="card-body items-center text-center p-6 z-20">
                  <div className="badge badge-secondary mb-2">{item.category}</div>
                  <h2 className="card-title text-lg text-base-content group-hover:text-primary transition-colors">{item.title}</h2>
                  <p className="text-2xl font-bold text-primary my-2 font-sans">฿{item.price}</p>
                  <div className="card-actions w-full mt-2 flex flex-col gap-2">
                    <Link to={`/product/${item.id}`} className="btn btn-primary w-full btn-sm shadow-sm hover:scale-[1.02] transition-transform">
                      View Details & Add to Cart
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}