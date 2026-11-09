// src/types.ts
export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating: number;
  variants?: string[];
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  selectedSize?: string;
  selectedStyle?: string;
  selectedImage?: string;
  product: Product; // ดึงข้อมูลสินค้าที่ผูกไว้ (Relation) มาแสดงผลได้เลย
}