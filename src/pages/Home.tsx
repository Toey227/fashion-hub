import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../store/useStore';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating: number;
}

export default function Home() {
  const collection = useStore((state) => state.collection);
  const toggleCollection = useStore((state) => state.toggleCollection);

  const { data, isLoading, error } = useQuery<any>({
    queryKey: ['products'],
    queryFn: () => fetch('http://localhost:3000/products').then(res => res.json())
  });

  if (isLoading) return <div className="p-20 text-center flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
  if (error || !data) return <div className="p-20 text-center text-red-500 text-xl">ไม่สามารถโหลดข้อมูลสินค้าได้</div>;

  // 🌟 ป้องกัน Error โดยเช็คว่า data เป็น Array ตรงๆ หรือมี .products ห่ออยู่
  const products: Product[] = Array.isArray(data) ? data : (data.products || []);

  const tops = products.filter(p => p.category === 'Tops').slice(0, 3);
  const bottoms = products.filter(p => p.category === 'Bottoms').slice(0, 3);
  const accessories = products.filter(p => p.category === 'Accessories').slice(0, 3);

  const renderProductCard = (item: Product) => {
    const isSaved = collection.some(p => p.id === item.id);
    return (
      <div key={item.id} className="card bg-base-100 shadow-xl border border-base-200 relative pt-4 px-4 hover:shadow-2xl transition-all duration-300">
        <button 
          className="btn btn-circle btn-sm bg-white/80 hover:bg-white text-gray-700 border-none absolute top-6 right-6 z-20 shadow-md"
          onClick={() => toggleCollection(item)}
          title="Save to Collection"
        >
          {isSaved ? <span className="text-red-500">❤️</span> : <span>🤍</span>}
        </button>

        <figure>
          <img src={item.image} alt={item.title} className="rounded-xl h-72 object-cover w-full" />
        </figure>
        
        <div className="card-body items-center text-center p-6">
          <div className="badge badge-secondary mb-2">{item.category}</div>
          <h2 className="card-title text-lg">{item.title}</h2>
          <p className="text-2xl font-bold text-primary my-2">฿{item.price}</p>
          <div className="card-actions w-full mt-2 flex flex-col gap-2">
            <button className="btn btn-primary w-full btn-sm">Add to Cart</button>
            <Link to={`/product/${item.id}`} className="btn btn-outline w-full btn-sm">View Details</Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-200/50 pb-16">
      {/* Hero Banner */}
      <div className="hero bg-base-200 py-16 px-8 mb-12">
        <div className="hero-content flex-col lg:flex-row-reverse gap-12 max-w-6xl mx-auto">
          <img 
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" 
            className="max-w-sm rounded-2xl shadow-2xl object-cover h-80 w-72" 
            alt="Hero Banner"
          />
          <div>
            <span className="badge badge-primary mb-4">NEW COLLECTION</span>
            <h1 className="text-5xl font-bold mb-4">Welcome to Fashion Hub</h1>
            <p className="py-2 text-gray-600 text-lg max-w-xl">
              ค้นหาสไตล์ที่เป็นคุณ อัปเดตเทรนด์แฟชั่นล่าสุด มิกซ์แอนด์แมตช์เสื้อผ้าได้ดั่งใจ พร้อมให้คุณเป็นเจ้าของแล้ววันนี้
            </p>
            <Link to="/mix-match" className="btn btn-primary mt-4">ลอง Mix & Match เลย →</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Tops */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-3xl font-bold">Top Wear</h2>
              <p className="text-gray-500">เสื้อผ้าสไตล์มินิมอล ใส่ได้ทุกวัน</p>
            </div>
            <Link to="/category/Tops" className="btn btn-ghost btn-sm font-semibold text-primary"> Viwe All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tops.map(renderProductCard)}
          </div>
        </section>

        {/* Bottoms */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-3xl font-bold">Bottoms & Skirts</h2>
              <p className="text-gray-500">กางเกงและกระโปรงทรงสวย แมตช์ง่าย</p>
            </div>
            <Link to="/category/Bottoms" className="btn btn-ghost btn-sm font-semibold text-primary"> Viwe All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bottoms.map(renderProductCard)}
          </div>
        </section>

        {/* Accessories */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-3xl font-bold">Accessories & Shoes</h2>
              <p className="text-gray-500">เติมเต็มลุคให้สมบูรณ์แบบด้วยแอคเซสเซอรี</p>
            </div>
            <Link to="/category/Accessories" className="btn btn-ghost btn-sm font-semibold text-primary"> Viwe All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {accessories.map(renderProductCard)}
          </div>
        </section>

      </div>
    </div>
  );
}