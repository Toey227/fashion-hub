import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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

export default function MixMatch() {
  const navigate = useNavigate();
  const toggleCollection = useStore((state) => state.toggleCollection);

  const { data, isLoading, error } = useQuery<any>({
    queryKey: ['products'],
    queryFn: () => fetch('http://localhost:3000/products').then(res => res.json())
  });

  const [selectedTop, setSelectedTop] = useState<Product | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<Product | null>(null);
  const [selectedAccessory, setSelectedAccessory] = useState<Product | null>(null);

  if (isLoading) return <div className="p-20 text-center flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
  if (error || !data) return <div className="p-20 text-center text-red-500 text-xl">ไม่สามารถโหลดข้อมูลสินค้าได้</div>;

  const products: Product[] = Array.isArray(data) ? data : (data.products || []);

  const tops = products.filter(p => p.category === 'Tops');
  const bottoms = products.filter(p => p.category === 'Bottoms');
  const accessories = products.filter(p => p.category === 'Accessories');

  const totalPrice = (selectedTop?.price || 0) + (selectedBottom?.price || 0) + (selectedAccessory?.price || 0);
  const totalCount = (selectedTop ? 1 : 0) + (selectedBottom ? 1 : 0) + (selectedAccessory ? 1 : 0);

  const handleAddAllToCart = () => {
    alert(`เพิ่มเซ็ตลุคนี้ลงตะกร้าเรียบร้อยแล้ว! (รวม ${totalCount} ชิ้น ยอดรวม ฿${totalPrice})`);
  };

  // 🌟 ฟังก์ชันบันทึกและพุ่งไปหน้า Collection
  const handleSaveOutfit = () => {
    if (selectedTop) toggleCollection(selectedTop);
    if (selectedBottom) toggleCollection(selectedBottom);
    if (selectedAccessory) toggleCollection(selectedAccessory);

    navigate('/collection');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[85vh]">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Mix & Match Lookbook</h1>
        <p className="text-gray-500">เลือกไอเท็มโปรดเพื่อจัดเซ็ตลุคสไตล์คุณ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* ฝั่งซ้าย: เลือกไอเท็ม */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tops */}
          <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">👕 เลือกเสื้อ (Tops)</h2>
              {selectedTop && <button onClick={() => setSelectedTop(null)} className="text-xs text-error link">รีเซ็ต</button>}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-48 overflow-y-auto p-1">
              {tops.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedTop(item)}
                  className={`cursor-pointer rounded-xl p-2 border-2 transition-all ${selectedTop?.id === item.id ? 'border-primary bg-primary/10 shadow-md' : 'border-base-200 hover:border-primary/50'}`}
                >
                  <img src={item.image} alt={item.title} className="w-full h-20 object-cover rounded-lg mb-1" />
                  <p className="text-xs font-semibold truncate text-center">{item.title}</p>
                  <p className="text-[10px] text-primary font-bold text-center">฿{item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottoms */}
          <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">👖 เลือกกางเกง/กระโปรง (Bottoms)</h2>
              {selectedBottom && <button onClick={() => setSelectedBottom(null)} className="text-xs text-error link">รีเซ็ต</button>}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-48 overflow-y-auto p-1">
              {bottoms.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedBottom(item)}
                  className={`cursor-pointer rounded-xl p-2 border-2 transition-all ${selectedBottom?.id === item.id ? 'border-primary bg-primary/10 shadow-md' : 'border-base-200 hover:border-primary/50'}`}
                >
                  <img src={item.image} alt={item.title} className="w-full h-20 object-cover rounded-lg mb-1" />
                  <p className="text-xs font-semibold truncate text-center">{item.title}</p>
                  <p className="text-[10px] text-primary font-bold text-center">฿{item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">👜 เลือกแอคเซสเซอรี (Accessories)</h2>
              {selectedAccessory && <button onClick={() => setSelectedAccessory(null)} className="text-xs text-error link">รีเซ็ต</button>}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-48 overflow-y-auto p-1">
              {accessories.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedAccessory(item)}
                  className={`cursor-pointer rounded-xl p-2 border-2 transition-all ${selectedAccessory?.id === item.id ? 'border-primary bg-primary/10 shadow-md' : 'border-base-200 hover:border-primary/50'}`}
                >
                  <img src={item.image} alt={item.title} className="w-full h-20 object-cover rounded-lg mb-1" />
                  <p className="text-xs font-semibold truncate text-center">{item.title}</p>
                  <p className="text-[10px] text-primary font-bold text-center">฿{item.price}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ฝั่งขวา: Lookbook Preview Card */}
        <div className="lg:col-span-5">
          <div className="bg-base-100 p-8 rounded-3xl shadow-xl border border-base-200 sticky top-8 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Curated Lookbook</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              
              {/* เสื้อ */}
              <div className="flex flex-col items-center bg-base-200/50 p-3 rounded-2xl border border-base-200 relative">
                {selectedTop ? (
                  <>
                    <button 
                      onClick={() => setSelectedTop(null)}
                      className="btn btn-circle btn-xs bg-red-500 hover:bg-red-600 text-white border-none absolute top-2 right-2 z-10 shadow"
                    >
                      ✕
                    </button>
                    <img src={selectedTop.image} alt="Top" className="w-full h-28 object-cover rounded-xl shadow-sm mb-2" />
                    <span className="text-[11px] font-semibold truncate w-full text-center">{selectedTop.title}</span>
                    <span className="text-xs text-primary font-bold">฿{selectedTop.price}</span>
                  </>
                ) : (
                  <div className="w-full h-32 flex flex-col items-center justify-center text-gray-400 text-xs">
                    <span>👕</span>
                    <span className="mt-1">ยังไม่เลือกเสื้อ</span>
                  </div>
                )}
              </div>

              {/* กางเกง */}
              <div className="flex flex-col items-center bg-base-200/50 p-3 rounded-2xl border border-base-200 relative">
                {selectedBottom ? (
                  <>
                    <button 
                      onClick={() => setSelectedBottom(null)}
                      className="btn btn-circle btn-xs bg-red-500 hover:bg-red-600 text-white border-none absolute top-2 right-2 z-10 shadow"
                    >
                      ✕
                    </button>
                    <img src={selectedBottom.image} alt="Bottom" className="w-full h-28 object-cover rounded-xl shadow-sm mb-2" />
                    <span className="text-[11px] font-semibold truncate w-full text-center">{selectedBottom.title}</span>
                    <span className="text-xs text-primary font-bold">฿{selectedBottom.price}</span>
                  </>
                ) : (
                  <div className="w-full h-32 flex flex-col items-center justify-center text-gray-400 text-xs">
                    <span>👖</span>
                    <span className="mt-1">ยังไม่เลือกกางเกง</span>
                  </div>
                )}
              </div>

              {/* แอคเซสเซอรี */}
              <div className="flex flex-col items-center bg-base-200/50 p-3 rounded-2xl border border-base-200 relative">
                {selectedAccessory ? (
                  <>
                    <button 
                      onClick={() => setSelectedAccessory(null)}
                      className="btn btn-circle btn-xs bg-red-500 hover:bg-red-600 text-white border-none absolute top-2 right-2 z-10 shadow"
                    >
                      ✕
                    </button>
                    <img src={selectedAccessory.image} alt="Accessory" className="w-full h-28 object-cover rounded-xl shadow-sm mb-2" />
                    <span className="text-[11px] font-semibold truncate w-full text-center">{selectedAccessory.title}</span>
                    <span className="text-xs text-primary font-bold">฿{selectedAccessory.price}</span>
                  </>
                ) : (
                  <div className="w-full h-32 flex flex-col items-center justify-center text-gray-400 text-xs">
                    <span>👜</span>
                    <span className="mt-1">ยังไม่เลือกกระเป๋า/รองเท้า</span>
                  </div>
                )}
              </div>

            </div>

            <div className="divider my-2"></div>
            <div className="flex justify-between items-center mb-6 px-2">
              <span className="text-gray-600 font-medium">Items Selected: {totalCount} / 3</span>
              <span className="text-2xl font-extrabold text-primary">Total: ฿{totalPrice}</span>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleAddAllToCart}
                disabled={totalCount === 0}
                className="btn btn-primary w-full text-lg shadow-md"
              >
                🛍️ Add All to Cart
              </button>
              <button 
                onClick={handleSaveOutfit}
                disabled={totalCount === 0}
                className="btn btn-outline btn-secondary w-full"
              >
                💾 Save Lookbook
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}