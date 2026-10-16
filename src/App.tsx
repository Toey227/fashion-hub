import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // เพิ่มบรรทัดนี้
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Collection from "./pages/Collection";
import About from "./pages/About";
import MixMatch from "./pages/MixMatch";
import CategoryProducts from './pages/CategoryProducts';


// สร้างตัวจัดการ API
const queryClient = new QueryClient();

export default function App() {
  return (
    // เอา QueryClientProvider มาคลุมแอปไว้
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="navbar bg-base-100 shadow-sm px-8 py-4 flex justify-between items-center max-w-7xl mx-auto">

          {/* ฝั่งซ้าย: โลโก้แบรนด์ */}
          <div className="flex-1">
            <Link to="/" className="text-xl font-bold tracking-wider">Fashion Hub</Link>
          </div>

          {/* ฝั่งขวา: เมนูนำทาง (จัดเรียงสวยงามและสมมาตร) */}
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1 gap-6 font-medium text-base">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/collection" className="hover:text-primary transition-colors">My Collection</Link></li>
              <li><Link to="/mix-match" className="hover:text-primary transition-colors">Mix & Match</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

        </div>

        <main className="min-h-screen bg-base-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/mix-match" element={<MixMatch />} />
            <Route path="/category/:categoryName" element={<CategoryProducts />} />
          </Routes>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  );
}