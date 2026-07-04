import { apiClient } from './client';
import type { Cart } from '@/types/cart';

export const cartApi = {
  get: async () => {
    return apiClient<Cart>('/cart');
  },
  addItem: async (productId: string, quantity: number) => {
    return apiClient<Cart>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  },
};
