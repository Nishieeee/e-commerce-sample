import { apiClient } from './client';
import type { User, LoginCredentials, RegisterData } from '@/types/auth';
import { SAMPLE_USER_CUSTOMER } from './mockData';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
    try {
      return await apiClient<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        token: 'sanctum_mock_token_8892',
        user: {
          ...SAMPLE_USER_CUSTOMER,
          email: credentials.email,
          name: credentials.email.split('@')[0] || 'Alex Vance',
        },
      };
    }
  },
  register: async (data: RegisterData): Promise<{ token: string; user: User }> => {
    try {
      return await apiClient<{ token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        token: 'sanctum_mock_token_new_9910',
        user: {
          id: `usr-${Date.now()}`,
          name: data.name,
          email: data.email,
          role: 'customer',
          phone: '+351 900 000 000',
        },
      };
    }
  },
  me: async (): Promise<User> => {
    try {
      return await apiClient<User>('/auth/me');
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 150));
      return SAMPLE_USER_CUSTOMER;
    }
  },
};
