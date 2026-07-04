import { apiClient } from './client';
import type { Order, CheckoutPayload } from '@/types/order';

export const checkoutApi = {
  submitOrder: async (payload: CheckoutPayload) => {
    return apiClient<{ order: Order; client_secret?: string }>('/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
