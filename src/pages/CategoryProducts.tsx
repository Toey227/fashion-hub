import { Link, useParams, useNavigate } from 'react-router-dom';
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

export default function CategoryProducts() {
  const { categoryName } = useParams(); 
  const navigate = useNavigate();
  const collection = useStore((state) => state.collection);
  const toggleCollection = useStore((state) => state.toggleCollection);

  const { data, isLoading, error } = useQuery<any>({
    queryKey: ['products'],
    queryFn: () => fetch('http://localhost:3000/products').then(res => res.json())
  });

  if (isLoading) return <div className="p-20 text-center flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
  if (error || !data) return <div className="p-20 text-center text-red-500 text-xl">ไม่สามารถโหลดข้อมูลสินค้าได้</div>;

  const products: Product[] = Array.isArray(data) ? data : (data.products || []);

  const filteredProducts = products.filter(
    p => p.category.toLowerCase() === categoryName?.toLowerCase()
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[80vh]">
      <button onClick={() => navigate(-1)} className="btn btn-ghost mb-6">
        ← ย้อนกลับหน้าแรก
      </button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2 capitalize">Category: {categoryName}</h1>
        <p className="text-gray-500">พบสินค้าทั้งหมด {filteredProducts.length} รายการในหมวดหมู่นี้</p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-3xl border border-base-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-2">ไม่พบสินค้าในหมวดหมู่นี้</h2>
          <Link to="/" className="btn btn-primary mt-4">กลับสู่หน้าแรก</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((item) => {
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
          })}
        </div>
      )}
    </div>
  );
}