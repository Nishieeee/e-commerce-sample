import { apiClient } from './client';
import type { KPIMetrics, StockAdjustment } from '@/types/admin';
import type { Product } from '@/types/product';
import type { Order } from '@/types/order';
import { SAMPLE_KPI_METRICS, SAMPLE_ORDERS } from './mockData';
import { SAMPLE_CATALOG_PRODUCTS } from './products';

export const adminApi = {
  getMetrics: async (): Promise<KPIMetrics> => {
    try {
      return await apiClient<KPIMetrics>('/admin/metrics');
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return SAMPLE_KPI_METRICS;
    }
  },
  getProducts: async (): Promise<Product[]> => {
    try {
      return await apiClient<Product[]>('/admin/products');
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 250));
      return SAMPLE_CATALOG_PRODUCTS;
    }
  },
  adjustInventory: async (productId: string, adjustment: StockAdjustment): Promise<{ success: boolean; new_quantity: number }> => {
    try {
      return await apiClient(`/admin/inventory/${productId}/adjust`, {
        method: 'POST',
        body: JSON.stringify(adjustment),
      });
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const found = SAMPLE_CATALOG_PRODUCTS.find(p => p.id === productId || p.slug === productId);
      const currentStock = found?.stock ?? 10;
      return {
        success: true,
        new_quantity: Math.max(0, currentStock + adjustment.change_quantity),
      };
    }
  },
  getOrders: async (): Promise<Order[]> => {
    try {
      return await apiClient<Order[]>('/admin/orders');
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 250));
      return SAMPLE_ORDERS;
    }
  },
};
