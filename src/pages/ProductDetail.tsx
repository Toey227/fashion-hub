import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  variants?: string[]; 
  selectedSize?: string;
  selectedStyle?: string;
  selectedImage?: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');

  const [mainImage, setMainImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('Default');

  const increaseQty = () => setQuantity(prev => prev + 1);
  const decreaseQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const addToCart = useStore(state => state.addToCart);

  const collection = useStore(state => state.collection);
  const toggleCollection = useStore(state => state.toggleCollection);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => fetch(`https://my-json-server.typicode.com/Toey227/Fashion-Hub/products/${id}`).then(res => res.json())
  });

  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => fetch('https://my-json-server.typicode.com/Toey227/Fashion-Hub/products').then(res => res.json())
  });

  const relatedProducts = allProducts
    ?.filter(p => p.id !== Number(id))
    .sort(() => 0.5 - Math.random())
    .slice(0, 3) || [];

  useEffect(() => {
    if (product) {
      setMainImage(product.image);
      setSelectedVariant('Default');
      setSelectedSize('M');
      setQuantity(1);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, selectedSize, selectedVariant, mainImage);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const isSaved = product ? collection.some(p => p.id === product.id) : false;

  if (isLoading) return <div className="p-10 text-center flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
  if (error || !product) return <div className="p-10 text-center text-red-500 text-xl">ไม่พบสินค้าที่คุณค้นหา!</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      <button onClick={() => navigate(-1)} className="btn btn-ghost mb-6">
        ← ย้อนกลับ
      </button>

      <div className="flex flex-col xl:flex-row gap-8">

        <div className="flex-1 flex flex-col md:flex-row gap-12 bg-base-100 p-8 rounded-3xl shadow-sm border border-base-200">

          <div className="md:w-1/2">
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-[500px] object-cover rounded-2xl shadow-md transition-opacity duration-300 bg-gray-50"
            />
          </div>

          <div className="md:w-1/2 flex flex-col justify-center">
            <div className="mb-2">
              <span className="badge badge-secondary">{product.category}</span>
            </div>
            <h1 className="text-4xl font-black text-base-content mb-4 tracking-tight">{product.title}</h1>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-yellow-400 text-xl">★</span>
              <span className="font-bold text-base-content font-sans">{product.rating}</span>
              <span className="font-bold text-base-content">{product.rating}</span>
              <span className="text-base-content/50 text-sm">(คะแนนรีวิว)</span>
            </div>

            <p className="text-4xl font-bold text-primary mb-6 font-sans">฿{product.price}</p>

            <p className="text-base-content/70 mb-8 leading-relaxed text-lg">
              {product.description}
            </p>

            {product?.variants && product.variants.length > 0 && (
              <div className="mb-6 mt-2">
                <h3 className="text-sm font-bold text-base-content/70 mb-4 uppercase tracking-wider">
                  Color: <span className="text-primary">{selectedVariant !== 'Default' ? selectedVariant : 'Style 1'}</span>
                </h3>
                <div className="flex gap-4">
                  {product.variants.map((variantUrl, index) => {
                    const styleName = `Style ${index + 1}`;
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setMainImage(variantUrl);
                          setSelectedVariant(styleName);
                        }}
                        className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300 ${mainImage === variantUrl ? 'border-primary scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                          }`}
                        title={styleName}
                      >
                        <img src={variantUrl} alt={styleName} className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-6 mt-4">
              <h3 className="text-sm font-bold text-base-content/70 mb-4 uppercase tracking-wider">Size</h3>
              <div className="flex gap-4">
                {['S', 'M', 'L', 'XL'].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full font-bold transition-all ${selectedSize === size
                        ? 'bg-primary text-white shadow-md scale-110'
                        : 'bg-base-200 text-base-content hover:bg-base-300'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <div className="flex items-center border-2 border-base-300 rounded-lg overflow-hidden h-12">
                <button
                  onClick={decreaseQty}
                  className="w-12 h-full bg-base-200 hover:bg-base-300 text-xl font-bold transition-colors flex items-center justify-center text-base-content"
                >
                  -
                </button>
                <div className="w-16 h-full flex items-center justify-center font-bold text-lg border-x-2 border-base-300 bg-base-100 text-base-content font-sans">
                  {quantity}
                </div>
                <button
                  onClick={increaseQty}
                  className="w-12 h-full bg-base-200 hover:bg-base-300 text-xl font-bold transition-colors flex items-center justify-center text-base-content"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn btn-primary flex-1 h-12 text-lg hover:scale-[1.02] transition-transform shadow-sm"
              >
                🛍️ Add to Cart
              </button>

              <button
                onClick={() => product && toggleCollection(product)}
                className={`btn btn-circle h-12 w-12 transition-colors ${isSaved
                    ? 'bg-red-50 border-red-100 text-red-500 hover:bg-red-100 hover:border-red-200'
                    : 'btn-outline border-base-300 hover:bg-red-50 hover:border-red-100 hover:text-red-500'
                  }`}
                title={isSaved ? "Remove from Collection" : "Save to Collection"}
              >
                {isSaved ? '❤️' : '🤍'}
              </button>
            </div>

          </div>
        </div>

        <div className="w-full xl:w-80 bg-base-50 p-6 rounded-3xl border border-base-200 shrink-0 h-fit">
          <h2 className="text-xl font-serif font-bold text-base-content mb-6 border-b-2 border-base-200 pb-2">
            You May Also Like
          </h2>

          <div className="flex flex-col gap-4">
            {relatedProducts.map((relatedItem) => (
              <Link
                key={relatedItem.id}
                to={`/product/${relatedItem.id}`}
                onClick={() => window.scrollTo(0, 0)}
                className="flex items-center gap-4 p-3 bg-base-100 rounded-xl hover:shadow-md transition-all border border-transparent hover:border-primary/20 group"
              >
                <img
                  src={relatedItem.image}
                  alt={relatedItem.title}
                  className="w-20 h-24 object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform"
                />
                <div>
                  <h3 className="text-sm font-bold text-base-content line-clamp-2 leading-snug mb-1 group-hover:text-primary transition-colors">
                    {relatedItem.title}
                  </h3>
                  <p className="text-primary font-bold font-sans">฿{relatedItem.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {showToast && (
        <div className="toast toast-top toast-center z-[100] animate-bounce mt-4">
          <div className="alert alert-success shadow-lg text-white font-medium flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว! ({quantity} ชิ้น)</span>
            <Link to="/cart" className="btn btn-sm btn-ghost underline hover:bg-transparent text-white border-white">ดูตะกร้า</Link>
          </div>
        </div>
      )}

    </div>
  );
}