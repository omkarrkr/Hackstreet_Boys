import { api } from './api';
import { BucketItem } from '../types/BucketList';

export const bucketlistService = {
  getAll: async (): Promise<BucketItem[]> => {
    const response = await api.get('/bucketlist');
    return response.data.data;
  },

  create: async (data: Partial<BucketItem>): Promise<BucketItem> => {
    const response = await api.post('/bucketlist', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<BucketItem>): Promise<BucketItem> => {
    const response = await api.put(`/bucketlist/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/bucketlist/${id}`);
  },
};
