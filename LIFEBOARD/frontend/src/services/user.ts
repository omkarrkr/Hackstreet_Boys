import { api } from './api';

export const userService = {
  updateProfile: async (data: { full_name?: string; email?: string }) => {
    const response = await api.put('/user/profile', data);
    return response.data.data;
  },

  changePassword: async (data: { current_password: string; new_password: string }) => {
    const response = await api.put('/user/password', data);
    return response.data;
  },
};
