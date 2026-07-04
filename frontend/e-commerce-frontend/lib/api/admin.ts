import { apiClient } from './client';
import type { KPIMetrics, StockAdjustment } from '@/types/admin';
import type { Product } from '@/types/product';
import type { Order } from '@/types/order';

export const adminApi = {
  getMetrics: async () => {
    return apiClient<KPIMetrics>('/admin/metrics');
  },
  getProducts: async () => {
    return apiClient<Product[]>('/admin/products');
  },
  adjustInventory: async (productId: string, adjustment: StockAdjustment) => {
    return apiClient(`/admin/inventory/${productId}/adjust`, {
      method: 'POST',
      body: JSON.stringify(adjustment),
    });
  },
  getOrders: async () => {
    return apiClient<Order[]>('/admin/orders');
  },
};
