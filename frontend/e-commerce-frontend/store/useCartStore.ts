import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types/cart';

export interface OrderReceipt {
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'stripe' | 'paypal' | 'cod';
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  lastOrder: OrderReceipt | null;
  lastAddedTimestamp: number | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: (open?: boolean) => void;
  setLastOrder: (order: OrderReceipt | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      lastOrder: null,
      lastAddedTimestamp: null,
      addItem: (item) =>
        set((state) => {
          // Check if item with exact same productId already exists in bag
          const existingIndex = state.items.findIndex((i) => i.productId === item.productId);
          let updatedItems;
          if (existingIndex > -1) {
            updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + item.quantity,
            };
          } else {
            updatedItems = [...state.items, item];
          }
          return {
            items: updatedItems,
            isOpen: true,
            lastAddedTimestamp: Date.now(),
          };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id && i.productId !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id || i.productId === id
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      toggleDrawer: (open) =>
        set((state) => ({ isOpen: open !== undefined ? open : !state.isOpen })),
      setLastOrder: (order) => set({ lastOrder: order }),
    }),
    {
      name: 'nexus-cart-storage', // Key name in browser localStorage
      // Persist cart items AND lastOrder; keep UI drawer state (isOpen) transient
      partialize: (state) => ({ items: state.items, lastOrder: state.lastOrder }),
    }
  )
);
