import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../store/useStore';

// 🌟 1. เพิ่ม variants ในโครงสร้างข้อมูล ให้ React รู้จัก
interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating: number;
  variants?: string[]; // (มีหรือไม่มีก็ได้) เก็บ URL รูปสีต่างๆ
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const collection = useStore((state) => state.collection);
  const toggleCollection = useStore((state) => state.toggleCollection);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => fetch(`http://localhost:3000/products/${id}`).then(res => res.json())
  });

  const [mainImage, setMainImage] = useState<string>('');

  useEffect(() => {
    if (product) {
      setMainImage(product.image);
    }
  }, [product]);

  if (isLoading) return <div className="p-10 text-center flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
  if (error || !product) return <div className="p-10 text-center text-red-500 text-xl">ไม่พบสินค้าที่คุณค้นหา!</div>;

  // 🌟 2. ถ้าใน db.json สินค้าตัวไหนมี variants ก็ดึงมาใช้ ถ้าไม่มีให้ใช้รูปหลักรูปเดียว
  const colorVariants = product.variants && product.variants.length > 0 
    ? product.variants 
    : [product.image];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="btn btn-ghost mb-6">
        ← ย้อนกลับ
      </button>

      <div className="flex flex-col md:flex-row gap-12 bg-base-100 p-8 rounded-3xl shadow-sm border border-base-200">
        
        <div className="md:w-1/2">
          <img 
            src={mainImage} 
            alt={product.title} 
            className="w-full h-[500px] object-cover rounded-2xl shadow-md transition-opacity duration-300 bg-gray-50"
          />
        </div>

        <div className="md:w-1/2 flex flex-col justify-center">
          <div className="badge badge-secondary mb-4">{product.category}</div>
          <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
          
          <div className="flex items-center gap-2 mb-6">
            <span className="text-yellow-500">⭐ {product.rating}</span>
            <span className="text-gray-400 text-sm">(คะแนนรีวิว)</span>
          </div>
          
          <p className="text-4xl font-bold text-primary mb-6">฿{product.price}</p>
          <p className="text-gray-600 mb-8 text-lg">{product.description}</p>

          {/* ส่วนเลือกสี */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-500 uppercase tracking-wider">Color</h3>
            <div className="flex gap-4">
              {colorVariants.map((imgUrl, index) => (
                <button 
                  key={index}
                  onClick={() => setMainImage(imgUrl)}
                  className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                    mainImage === imgUrl 
                      ? 'border-primary scale-110 shadow-lg' 
                      : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img src={imgUrl} alt={`color-variant-${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold mb-3 text-gray-500 uppercase tracking-wider">Size</h3>
            <div className="flex gap-3">
              <button className="btn btn-sm btn-outline px-4">S</button>
              <button className="btn btn-sm btn-active px-4">M</button>
              <button className="btn btn-sm btn-outline px-4">L</button>
              <button className="btn btn-sm btn-outline px-4">XL</button>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="btn btn-primary flex-1 text-lg">
              🛍️ Add to Cart
            </button>
            <button 
              className="btn btn-ghost btn-circle text-3xl" 
              onClick={() => toggleCollection(product)}
              title="Save to Collection"
            >
              {collection.some(p => p.id === product.id) 
                ? <span className="text-red-500 drop-shadow-md">❤️</span>
                : <span className="text-gray-300 drop-shadow-sm hover:text-red-300 transition-colors">🤍</span>
              }
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}