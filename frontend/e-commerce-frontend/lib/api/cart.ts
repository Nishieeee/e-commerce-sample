import { apiClient } from './client';
import type { Cart } from '@/types/cart';

const MOCK_CART: Cart = {
  id: 'cart-demo-01',
  items: [],
  subtotal: 0.00,
  tax: 0.00,
  shipping: 0.00,
  total: 0.00,
};

export const cartApi = {
  get: async (): Promise<Cart> => {
    try {
      return await apiClient<Cart>('/cart');
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 150));
      return MOCK_CART;
    }
  },
  addItem: async (productId: string, quantity: number): Promise<Cart> => {
    try {
      return await apiClient<Cart>('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity }),
      });
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return MOCK_CART;
    }
  },
};
