import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Cart() {
  const cart = useStore(state => state.cart);
  const removeFromCart = useStore(state => state.removeFromCart);
  const updateQuantity = useStore(state => state.updateQuantity);
  const navigate = useNavigate();


  const [selectedIds, setSelectedIds] = useState<string[]>(cart.map(item => item.cartItemId));

  
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const totalPrice = cart
    .filter(item => selectedIds.includes(item.cartItemId))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
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
          {cart.map((item) => (
            <div key={item.cartItemId} className="flex gap-6 p-4 bg-base-100 rounded-xl border border-base-200 shadow-sm hover:shadow-md transition-shadow">
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-primary" 
                  checked={selectedIds.includes(item.cartItemId)}
                  onChange={() => toggleSelect(item.cartItemId)}
                />
              </div>

              <img src={item.selectedImage || item.image} alt={item.title} className="w-28 h-36 object-cover rounded-lg shadow-sm" />
              
              <div className="flex-1 flex flex-col justify-between py-2">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-base-content line-clamp-1">{item.title}</h3>
                    <button onClick={() => removeFromCart(item.cartItemId)} className="text-base-content/40 hover:text-red-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <span className="badge badge-secondary badge-sm">{item.category}</span>
                    <span className="text-sm text-base-content/70">
                      Size: <strong className="text-base-content text-base ml-1">{item.size}</strong>
                    </span>
                    
                    {item.color && (
                      <span className="text-sm text-base-content/70 border-l border-base-300 pl-3">
                        Color: <strong className="text-base-content text-base ml-1">{item.color}</strong>
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-end mt-4">
                  <p className="text-2xl font-bold text-primary font-sans">฿{item.price}</p>
                  
                  <div className="flex items-center border border-base-300 rounded-lg overflow-hidden h-10 bg-base-100">
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="w-10 h-full hover:bg-base-200 flex items-center justify-center font-bold text-base-content transition-colors">-</button>
                    <div className="w-12 h-full flex items-center justify-center font-bold border-x border-base-300 text-base-content font-sans">{item.quantity}</div>
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="w-10 h-full hover:bg-base-200 flex items-center justify-center font-bold text-base-content transition-colors">+</button>
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