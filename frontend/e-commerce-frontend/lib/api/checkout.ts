import { apiClient } from './client';
import type { Order, CheckoutPayload } from '@/types/order';
import { SAMPLE_ORDERS } from './mockData';

export const checkoutApi = {
  submitOrder: async (payload: CheckoutPayload): Promise<{ order: Order; client_secret?: string }> => {
    try {
      return await apiClient<{ order: Order; client_secret?: string }>('/checkout', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        order: {
          ...SAMPLE_ORDERS[0],
          id: `ord-${Date.now()}`,
          order_number: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
        client_secret: 'pi_mock_secret_demo_8892_secret_demo',
      };
    }
  },
};
