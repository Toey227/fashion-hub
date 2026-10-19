import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../store/useStore';
import { useMemo } from 'react';

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
    queryFn: () => fetch('/db.json').then(res => res.json()).then(data => data.products)
  });


  const products: Product[] = Array.isArray(data) ? data : (data?.products || []);

  const { seasonalProducts, popularProducts } = useMemo(() => {

    if (products.length === 0) return { seasonalProducts: [], popularProducts: [] };

    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return {
      seasonalProducts: shuffled.slice(0, 3),
      popularProducts: shuffled.slice(3, 6)
    };
  }, [products]);

  if (isLoading) return <div className="p-20 text-center flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
  if (error || !data) return <div className="p-20 text-center text-red-500 text-xl">ไม่สามารถโหลดข้อมูลสินค้าได้</div>;



  const renderProductCard = (item: Product) => {
    const isSaved = collection.some(p => p.id === item.id);
    return (
      <div key={item.id} className="card bg-base-100 shadow-xl border border-base-200 relative pt-4 px-4 hover:shadow-2xl transition-all duration-300 group overflow-hidden">


        <Link to={`/product/${item.id}`} className="absolute inset-0 z-10"></Link>

        {/* ปุ่มหัวใจ */}
        <button
          className="btn btn-circle btn-sm bg-white/80 hover:bg-white text-gray-700 border-none absolute top-6 right-6 z-20 shadow-md"
          onClick={() => toggleCollection(item)}
          title="Save to Collection"
        >
          {isSaved ? <span className="text-red-500">❤️</span> : <span>🤍</span>}
        </button>

        <figure className="overflow-hidden rounded-xl">
          <img src={item.image} alt={item.title} className="rounded-xl h-[400px] object-cover w-full group-hover:scale-105 transition-transform duration-500" />
        </figure>

        <div className="card-body items-center text-center p-6">
          <div className="badge badge-secondary mb-2">{item.category}</div>
          <h2 className="card-title text-lg text-base-content group-hover:text-[#C88A76] transition-colors">{item.title}</h2>
          <p className="text-sm text-base-content/60 line-clamp-2 mt-2 px-2">
            {item.description}
          </p>

          <p className="text-2xl font-bold text-primary my-2 font-sans">฿{item.price}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-100 pb-16 transition-colors duration-300">

      {/* 🌟 Hero Section */}
      <div className="flex flex-col md:flex-row w-full h-[500px] bg-base-100 mb-12 transition-colors duration-300">
        <div className="bg-[#2A2A2A] text-white p-12 md:w-2/5 flex flex-col justify-center">
          <p className="text-[#C88A76] text-xs font-serif font-bold tracking-[0.2em] mb-4 uppercase">
            New Collection
          </p>
          <h1 className="text-4xl md:text-5xl font-serif mb-4 leading-tight">
            Welcome To<br />Fashion Hub
          </h1>
          <p className="text font-serif -gray-400 text-sm mb-8 leading-relaxed max-w-sm">
            Discover your perfect style with our curated collection of premium fashion pieces.
          </p>
          <Link to="/mix-match" className="bg-[#C88A76] text-white font-serif px-8 py-3 text-sm font-medium w-fit hover:bg-[#b57a66] transition-colors inline-block text-center">
            Shop Now
          </Link>
        </div>

        <div className="md:w-3/5 h-full">
          <img
            src="https://images.unsplash.com/photo-1764264829660-e9de50fc127d?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
            alt="Fashion Model"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-6 space-y-20 pt-8 pb-16">
        <section>
          <div className="flex justify-between items-end mb-8 border-b-2 border-[#E5E7EB] pb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl text-amber-500 animate-pulse">⚡</span>
              <div>
                <h2 className="text-4xl font-black italic tracking-tight bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent uppercase drop-shadow-sm">
                  Seasonal Collection
                </h2>
                <p className="text-base-content/70 mt-1 font-medium">✨ อัปเดตลุคใหม่ประจำฤดูกาล ห้ามพลาด!</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {seasonalProducts.map(renderProductCard)}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-8 border-b-2 border-[#E5E7EB] pb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl text-red-500 animate-bounce">🔥</span>
              <div>
                <h2 className="text-4xl font-black italic tracking-tight bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent uppercase drop-shadow-sm">
                  Popular Trending
                </h2>
                <p className="text-base-content/70 mt-1 font-medium">💥 ฮอตฮิตติดเทรนด์ ไอเทมยอดนิยมที่ใครๆ ก็ต้องมี!</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularProducts.map(renderProductCard)}
          </div>
        </section>

        <section className="mt-16 pt-8">
          <div className="flex justify-between items-end mb-8 border-b-2 border-base-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🛍️</span>
              <div>
                <h2 className="text-4xl font-serif font-black uppercase tracking-tight text-base-content">
                  All Products
                </h2>
                <p className="text-base-content/70 mt-1 font-medium">
                  ค้นหาสไตล์ที่ใช่จากสินค้าทั้งหมดของเรา
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map(renderProductCard)}
          </div>
        </section>

      </div>
    </div>
  );
}

