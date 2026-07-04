import { apiClient } from './client';
import type { User, LoginCredentials, RegisterData } from '@/types/auth';

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    return apiClient<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  register: async (data: RegisterData) => {
    return apiClient<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  me: async () => {
    return apiClient<User>('/auth/me');
  },
};
