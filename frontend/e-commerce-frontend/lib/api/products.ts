import { apiClient } from './client';
import type { Product, Category } from '@/types/product';

export const productsApi = {
  getAll: async (params: string = '') => {
    return apiClient<Product[]>(`/products?${params}`);
  },
  getBySlug: async (slug: string) => {
    return apiClient<Product>(`/products/${slug}`);
  },
  getCategories: async () => {
    return apiClient<Category[]>('/categories');
  },
};
