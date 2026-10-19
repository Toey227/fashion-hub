import { useState, useRef } from 'react';
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
  variants?: string[]; 
  selectedSize?: string;
  selectedStyle?: string;
  selectedImage?: string;
}
 
export default function MixMatch() {
  const navigate = useNavigate();
  const toggleCollection = useStore((state) => state.toggleCollection);
  const addToCart = useStore((state) => state.addToCart);
 
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ['products'],
    queryFn: () => fetch('/db.json').then(res => res.json()).then(data => data.products)
  });
 
  const selectedTop = useStore((state) => state.mixMatch.top) as Product | null;
  const selectedBottom = useStore((state) => state.mixMatch.bottom) as Product | null;
  const selectedAccessory = useStore((state) => state.mixMatch.accessory) as Product | null;
  const setMixMatch = useStore((state) => state.setMixMatch);
 
  const setSelectedTop = (item: Product | null) => setMixMatch('top', item);
  const setSelectedBottom = (item: Product | null) => setMixMatch('bottom', item);
  const setSelectedAccessory = (item: Product | null) => setMixMatch('accessory', item);
 
  
  const modalRef = useRef<HTMLDialogElement>(null);
  const [tempProduct, setTempProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number>(0); // 0 = Style 1, 1 = Style 2, 2 = Style 3
  const [currentImage, setCurrentImage] = useState<string>('');
 
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
 
  const showToast = (message: string, type: 'success' | 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 2500);
  };
 
  const handleSelectProduct = (item: Product) => {
    setTempProduct(item);
    setSelectedSize(item.category === 'Accessories' ? 'Free Size' : 'M');
    setSelectedStyleIndex(0); 
   
    
    const initialImg = (item.variants && item.variants.length > 0) ? item.variants[0] : item.image;
    setCurrentImage(initialImg);
 
    modalRef.current?.showModal();
  };
 
  const handleStyleChange = (index: number) => {
    setSelectedStyleIndex(index);
    if (tempProduct?.variants && tempProduct.variants[index]) {
      setCurrentImage(tempProduct.variants[index]);
    } else if (tempProduct) {
      setCurrentImage(tempProduct.image);
    }
  };
 
 
  const handleConfirmSelection = () => {
    if (!tempProduct) return;
 
    const styleName = `Style ${selectedStyleIndex + 1}`;
    const productWithDetails: Product = {
      ...tempProduct,
      image: currentImage,      
      selectedImage: currentImage,
      selectedSize,
      selectedStyle: styleName
    };
 
    if (tempProduct.category === 'Tops') {
      setSelectedTop(productWithDetails);
    } else if (tempProduct.category === 'Bottoms') {
      setSelectedBottom(productWithDetails);
    } else if (tempProduct.category === 'Accessories') {
      setSelectedAccessory(productWithDetails);
    }
 
    modalRef.current?.close();
    setTempProduct(null);
  };
 
  if (isLoading) return <div className="p-20 text-center flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
  if (error || !data) return <div className="p-20 text-center text-red-500 text-xl">ไม่สามารถโหลดข้อมูลสินค้าได้</div>;
 
  const products: Product[] = Array.isArray(data) ? data : (data.products || []);
  const tops = products.filter(p => p.category === 'Tops');
  const bottoms = products.filter(p => p.category === 'Bottoms');
  const accessories = products.filter(p => p.category === 'Accessories');
 
  const totalPrice = (selectedTop?.price || 0) + (selectedBottom?.price || 0) + (selectedAccessory?.price || 0);
  const totalCount = (selectedTop ? 1 : 0) + (selectedBottom ? 1 : 0) + (selectedAccessory ? 1 : 0);
 
  const handleAddAllToCart = () => {
    if (selectedTop) {
      addToCart(selectedTop, 1, selectedTop.selectedSize || 'M', selectedTop.selectedStyle || 'Style 1', selectedTop.selectedImage || selectedTop.image);
    }
    if (selectedBottom) {
      addToCart(selectedBottom, 1, selectedBottom.selectedSize || 'M', selectedBottom.selectedStyle || 'Style 1', selectedBottom.selectedImage || selectedBottom.image);
    }
    if (selectedAccessory) {
      addToCart(selectedAccessory, 1, selectedAccessory.selectedSize || 'Free Size', selectedAccessory.selectedStyle || 'Style 1', selectedAccessory.selectedImage || selectedAccessory.image);
    }
   
    showToast(`🛍️ เพิ่มลุคนี้ลงตะกร้าเรียบร้อย! (รวม ${totalCount} ชิ้น)`, 'success');
  };
 
  const handleSaveOutfit = () => {
    if (selectedTop) toggleCollection(selectedTop);
    if (selectedBottom) toggleCollection(selectedBottom);
    if (selectedAccessory) toggleCollection(selectedAccessory);
 
    showToast('💖 บันทึกลุคสไตล์คุณลง My Collection แล้ว!', 'info');
 
    setTimeout(() => {
      navigate('/collection');
    }, 1500);
  };
 
  const availableSizes = tempProduct?.category === 'Accessories'
    ? ['Free Size']
    : ['S', 'M', 'L', 'XL'];
 
  const styleOptions = ['Style 1', 'Style 2', 'Style 3'];
 
  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[85vh] relative">
     
      {toast.show && (
        <div className="toast toast-top toast-center z-50 animate-fade-in-down">
          <div className={`alert ${toast.type === 'success' ? 'alert-success text-white' : 'alert-info text-white'} shadow-lg font-bold`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
 
      <dialog ref={modalRef} className="modal backdrop-blur-sm">
        <div className="modal-box max-w-lg p-7 rounded-3xl shadow-2xl border border-base-200">
         
          <div className="flex justify-between items-center border-b pb-3 mb-5">
            <h3 className="font-extrabold text-xl text-base-content flex items-center gap-2">
              ✨ ปรับแต่งตัวเลือกสินค้า
            </h3>
            <button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={() => modalRef.current?.close()}
            >
              ✕
            </button>
          </div>
 
          {tempProduct && (
            <div className="space-y-6">
             
           
              <div className="flex items-center gap-4 bg-base-200/50 p-4 rounded-2xl border border-base-200">
                <img
                  src={currentImage}
                  alt={tempProduct.title}
                  className="w-24 h-24 object-cover rounded-xl shadow-md bg-white transition-all duration-300"
                />
                <div className="space-y-1 text-left">
                  <span className="badge badge-primary badge-outline text-[10px] uppercase font-bold tracking-wider">
                    {tempProduct.category}
                  </span>
                  <h4 className="font-bold text-base leading-snug line-clamp-2">{tempProduct.title}</h4>
                  <p className="text-xl font-black text-primary font-sans">฿{tempProduct.price}</p>
                </div>
              </div>
 
           
              <div className="text-left">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  🎨 เลือกสไตล์ (STYLE OPTION):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {styleOptions.map((styleLabel, idx) => (
                    <button
                      key={styleLabel}
                      type="button"
                      onClick={() => handleStyleChange(idx)}
                      className={`btn btn-md font-semibold transition-all ${
                        selectedStyleIndex === idx
                          ? 'btn-primary shadow-md scale-[1.02]'
                          : 'btn-outline border-base-300 hover:border-primary/50'
                      }`}
                    >
                      {styleLabel}
                    </button>
                  ))}
                </div>
              </div>
 
    
              <div className="text-left">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  📏 เลือกขนาด (SIZE):
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`btn btn-md flex-1 font-semibold transition-all ${
                        selectedSize === size
                          ? 'btn-secondary shadow-md scale-[1.02]'
                          : 'btn-outline border-base-300 hover:border-secondary/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
 
            </div>
          )}
 
          <div className="modal-action mt-8 pt-4 border-t flex justify-end gap-3">
            <button
              className="btn btn-ghost rounded-xl px-6"
              onClick={() => modalRef.current?.close()}
            >
              ยกเลิก
            </button>
            <button
              className="btn btn-primary rounded-xl px-8 shadow-lg shadow-primary/30"
              onClick={handleConfirmSelection}
            >
              บันทึกลง Preview ➔
            </button>
          </div>
 
        </div>
      </dialog>
 
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Mix & Match Lookbook</h1>
        <p className="text-gray-500">เลือกไอเท็มโปรดเพื่อจัดเซ็ตลุคสไตล์คุณ</p>
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
       
  
        <div className="lg:col-span-7 space-y-6">
         
   
          <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">👕 เลือกเสื้อ (Tops)</h2>
              {selectedTop && <button onClick={() => setSelectedTop(null)} className="text-xs text-error link">รีเซ็ต</button>}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-48 overflow-y-auto p-1">
              {tops.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSelectProduct(item)}
                  className={`cursor-pointer rounded-xl p-2 border-2 transition-all ${selectedTop?.id === item.id ? 'border-primary bg-primary/10 shadow-md' : 'border-base-200 hover:border-primary/50'}`}
                >
                  <img src={item.image} alt={item.title} className="w-full h-20 object-cover rounded-lg mb-1" />
                  <p className="text-xs font-semibold truncate text-center">{item.title}</p>
                  <p className="text-primary font-bold text-sm font-sans text-center">฿{item.price}</p>
                </div>
              ))}
            </div>
          </div>
 

          <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">👖 เลือกกางเกง/กระโปรง (Bottoms)</h2>
              {selectedBottom && <button onClick={() => setSelectedBottom(null)} className="text-xs text-error link">รีเซ็ต</button>}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-48 overflow-y-auto p-1">
              {bottoms.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSelectProduct(item)}
                  className={`cursor-pointer rounded-xl p-2 border-2 transition-all ${selectedBottom?.id === item.id ? 'border-primary bg-primary/10 shadow-md' : 'border-base-200 hover:border-primary/50'}`}
                >
                  <img src={item.image} alt={item.title} className="w-full h-20 object-cover rounded-lg mb-1" />
                  <p className="text-xs font-semibold truncate text-center">{item.title}</p>
                  <p className="text-primary font-bold text-sm font-sans text-center">฿{item.price}</p>
                </div>
              ))}
            </div>
          </div>
 

          <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">👜 เลือกแอคเซสเซอรี (Accessories)</h2>
              {selectedAccessory && <button onClick={() => setSelectedAccessory(null)} className="text-xs text-error link">รีเซ็ต</button>}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-48 overflow-y-auto p-1">
              {accessories.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSelectProduct(item)}
                  className={`cursor-pointer rounded-xl p-2 border-2 transition-all ${selectedAccessory?.id === item.id ? 'border-primary bg-primary/10 shadow-md' : 'border-base-200 hover:border-primary/50'}`}
                >
                  <img src={item.image} alt={item.title} className="w-full h-20 object-cover rounded-lg mb-1" />
                  <p className="text-xs font-semibold truncate text-center">{item.title}</p>
                  <p className="text-primary font-bold text-sm font-sans text-center">฿{item.price}</p>
                </div>
              ))}
            </div>
          </div>
 
        </div>
 
        <div className="lg:col-span-5">
          <div className="bg-base-100 p-8 rounded-3xl shadow-xl border border-base-200 sticky top-8 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Curated Lookbook</h2>
           
            <div className="grid grid-cols-3 gap-4 mb-6">
             
         
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
                    <div className="flex flex-col gap-1 my-1">
                      <span className="badge badge-xs badge-primary font-sans">{selectedTop.selectedStyle}</span>
                      <span className="badge badge-xs badge-neutral font-sans">Size: {selectedTop.selectedSize}</span>
                    </div>
                    <span className="text-xs text-primary font-bold font-sans">฿{selectedTop.price}</span>
                  </>
                ) : (
                  <div className="w-full h-32 flex flex-col items-center justify-center text-gray-400 text-xs">
                    <span>👕</span>
                    <span className="mt-1">ยังไม่เลือกเสื้อ</span>
                  </div>
                )}
              </div>
 
          
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
                    <div className="flex flex-col gap-1 my-1">
                      <span className="badge badge-xs badge-primary font-sans">{selectedBottom.selectedStyle}</span>
                      <span className="badge badge-xs badge-neutral font-sans">Size: {selectedBottom.selectedSize}</span>
                    </div>
                    <span className="text-xs text-primary font-bold font-sans">฿{selectedBottom.price}</span>
                  </>
                ) : (
                  <div className="w-full h-32 flex flex-col items-center justify-center text-gray-400 text-xs">
                    <span>👖</span>
                    <span className="mt-1">ยังไม่เลือกกางเกง</span>
                  </div>
                )}
              </div>
 
      
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
                    <div className="flex flex-col gap-1 my-1">
                      <span className="badge badge-xs badge-primary font-sans">{selectedAccessory.selectedStyle}</span>
                      <span className="badge badge-xs badge-neutral font-sans">Size: {selectedAccessory.selectedSize}</span>
                    </div>
                    <span className="text-xs text-primary font-bold font-sans">฿{selectedAccessory.price}</span>
                  </>
                ) : (
                  <div className="w-full h-32 flex flex-col items-center justify-center text-gray-400 text-xs">
                    <span>👜</span>
                    <span className="mt-1">ยังไม่เลือกกระเป๋า</span>
                  </div>
                )}
              </div>
 
            </div>
 
            <div className="divider my-2"></div>
            <div className="flex justify-between items-center mb-6 px-2">
              <span className="text-base-content/70 font-sans">Items Selected: {totalCount} / 3</span>
              <span className="text-2xl font-bold text-primary font-sans">Total: ฿{totalPrice}</span>
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