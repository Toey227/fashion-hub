import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Collection from "./pages/Collection";
import About from "./pages/About";
import MixMatch from "./pages/MixMatch";
import CategoryProducts from './pages/CategoryProducts';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { useEffect, useState } from 'react';

function AppContent() {
  const { pathname } = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const isActive = (path: string) => pathname === path;

  const navLinkClass = (path: string) => `
    transition-colors relative pb-1
    ${isActive(path) 
      ? `font-bold ${theme === 'dark' ? 'text-white border-b-2 border-white' : 'text-gray-900 border-b-2 border-[#C88A76]'}` 
      : 'hover:text-[#C88A76]'
    }
  `;

  return (
    <>
      <div className={`w-full px-8 py-5 flex justify-between items-center shadow-sm transition-colors duration-300 ${theme === 'dark' ? 'bg-[#1D232A] text-white' : 'bg-[#F9F6F0] text-gray-900'}`}>
        
        <div className="flex-1">
          <Link to="/" className="text-2xl font-serif font-bold tracking-widest cursor-pointer uppercase">
            Fashion Hub
          </Link>
        </div>

        <div className="flex-none">
          <ul className={`flex items-center space-x-6 text-sm font-medium font-serif ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <li><Link to="/" className={navLinkClass("/")}>Home</Link></li>
            <li><Link to="/collection" className={navLinkClass("/collection")}>My Collection</Link></li>
            <li><Link to="/mix-match" className={navLinkClass("/mix-match")}>Mix & Match</Link></li>
            <li><Link to="/about" className={navLinkClass("/about")}>About Us</Link></li>

            <div className={`h-4 w-px mx-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>

            <li>
              <Link to="/cart" className={`flex items-center gap-2 pr-2 ${navLinkClass("/cart")}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                Cart
              </Link>
            </li>

            <li>
              <button 
                onClick={toggleTheme} 
                className="text-xl hover:opacity-70 transition-opacity pl-4" 
                title="Toggle Dark Mode"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <main className="min-h-screen bg-base-100 transition-colors duration-300">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/mix-match" element={<MixMatch />} />
          <Route path="/category/:categoryName" element={<CategoryProducts />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
    </>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
  <div className="font-serif min-h-screen bg-base-100 text-base-content transition-colors duration-300">
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
    </div>
  );
}