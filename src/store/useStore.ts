import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// โครงสร้างข้อมูลสินค้า
export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating: number;
}

// กำหนดว่าใน Store เราจะเก็บข้อมูลอะไรบ้าง
interface AppState {
  collection: Product[]; // เก็บรายการสินค้าที่กดหัวใจ
  toggleCollection: (product: Product) => void; // ฟังก์ชันกดเพิ่ม/ลบ หัวใจ
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      collection: [], // เริ่มต้นคอลเลกชันเป็นค่าว่าง
      
      // ฟังก์ชันสลับสถานะ: ถ้ามีในคอลเลกชันแล้วให้ลบออก ถ้ายังไม่มีให้เพิ่มเข้าไป
      toggleCollection: (product) => 
        set((state) => {
          const isExist = state.collection.some((p) => p.id === product.id);
          if (isExist) {
            // ลบออก
            return { collection: state.collection.filter((p) => p.id !== product.id) };
          } else {
            // เพิ่มเข้า
            return { collection: [...state.collection, product] };
          }
        }),
    }),
    {
      name: 'fashion-hub-storage', // ชื่อไฟล์ใน LocalStorage
    }
  )
);