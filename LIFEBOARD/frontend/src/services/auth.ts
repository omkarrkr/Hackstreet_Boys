import { api } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/Auth';

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data.data;
  },

  me: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};
