// src/store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  userId: number | null;
  login: (id: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: 1, // จำลองว่า Login ด้วย User ID 1 อยู่
  login: (id) => set({ userId: id }),
  logout: () => set({ userId: null }),
}));