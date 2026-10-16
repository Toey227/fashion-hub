import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Collection() {
    const collection = useStore((state) => state.collection);
    const toggleCollection = useStore((state) => state.toggleCollection);

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-[80vh]">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-2">My Saved Collection</h1>
                <p className="text-gray-500">สินค้าที่คุณถูกใจทั้งหมดอยู่ที่นี่</p>
            </div>

            {collection.length === 0 ? (
                <div className="text-center py-20 bg-base-100 rounded-3xl border border-base-200 shadow-sm">
                    <div className="text-6xl mb-4">💔</div>
                    <h2 className="text-2xl font-bold mb-4">ยังไม่มีสินค้าในคอลเลกชัน</h2>
                    <p className="text-gray-500 mb-8">ลองไปเลือกดูสินค้าที่หน้า Home แล้วกดเซฟดูสิ!</p>
                    <Link to="/" className="btn btn-primary">ไปช้อปปิ้งกันเลย</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {collection.map((item) => (
                        <div key={item.id} className="card bg-base-100 shadow-xl border border-base-200 pt-4 px-4">

                            {/* 🌟 สร้างกล่อง relative ครอบรูปภาพและปุ่มไว้ด้วยกัน */}
                            <div className="relative w-full">
                                <img src={item.image} alt={item.title} className="rounded-xl h-72 object-cover w-full" />

                                {/* 🌟 ใช้ style บังคับมุมขวาบน (top: 8px, right: 8px) ตรงนี้เลยครับ */}
                                <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 30 }}>
                                    <button
                                        className="btn btn-circle btn-sm bg-red-500 hover:bg-red-600 text-white border-none shadow-md"
                                        onClick={() => toggleCollection(item)}
                                        title="Remove from Collection"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            <div className="card-body items-center text-center p-6">
                                <div className="badge badge-secondary mb-2">{item.category}</div>
                                <h2 className="card-title text-lg">{item.title}</h2>
                                <p className="text-2xl font-bold text-primary my-2">฿{item.price}</p>
                                <div className="card-actions w-full mt-2">
                                    <button className="btn btn-outline btn-primary w-full btn-sm">Add to Cart</button>
                                    <Link to={`/product/${item.id}`} className="btn btn-ghost w-full btn-sm">View Details</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}