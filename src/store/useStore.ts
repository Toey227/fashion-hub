import { create } from 'zustand';
import { persist } from 'zustand/middleware';
 
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
 
export interface CartItem extends Product {
  cartItemId: string;
  quantity: number;
  size: string;
  color?: string;
  selectedImage?: string;
}
 
interface StoreState {
  collection: Product[];
  toggleCollection: (item: Product) => void;
 
  cart: CartItem[];
  addToCart: (item: Product, qty: number, size: string, color: string, selectedImage: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, qty: number) => void;
  removeCheckoutItems: (cartItemIds: string[]) => void;
 
  mixMatch: { top: Product | null; bottom: Product | null; accessory: Product | null };
  setMixMatch: (category: 'top' | 'bottom' | 'accessory', item: Product | null) => void;
}
 
export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      collection: [],
      toggleCollection: (item) => set((state) => {
        const isSaved = state.collection.some((p) => p.id === item.id);
        if (isSaved) {
          return { collection: state.collection.filter((p) => p.id !== item.id) };
        }
        return { collection: [...state.collection, item] };
      }),
 
      cart: [],
      addToCart: (item, qty, size, color, selectedImage) => set((state) => {
        const cartItemId = `${item.id}-${size}-${color}`;
        const existing = state.cart.find((p) => p.cartItemId === cartItemId);
       
        if (existing) {
          return {
            cart: state.cart.map((p) =>
              p.cartItemId === cartItemId ? { ...p, quantity: p.quantity + qty } : p
            )
          };
        }
        return { cart: [...state.cart, { ...item, cartItemId, quantity: qty, size, color, selectedImage }] };
      }),
      removeFromCart: (cartItemId) => set((state) => ({
        cart: state.cart.filter((p) => p.cartItemId !== cartItemId)
      })),
      updateQuantity: (cartItemId, qty) => set((state) => ({
        cart: state.cart.map((p) => (p.cartItemId === cartItemId ? { ...p, quantity: Math.max(1, qty) } : p))
      })),
      removeCheckoutItems: (cartItemIds) => set((state) => ({
        cart: state.cart.filter((p) => !cartItemIds.includes(p.cartItemId))
      })),
 
      mixMatch: { top: null, bottom: null, accessory: null },
      setMixMatch: (category, item) => set((state) => ({
        mixMatch: { ...state.mixMatch, [category]: item }
      })),
    }),
    {
      name: 'fashion-hub-storage',
    }
  )
);