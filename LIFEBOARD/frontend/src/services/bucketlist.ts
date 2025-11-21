import { api } from './api';
import { BucketItem } from '../types/BucketList';

interface BucketListSummary {
  items: BucketItem[];
  stats: {
    total: number;
    completed: number;
    in_progress: number;
    planning: number;
    not_started: number;
    completion_percentage: number;
    by_category: Record<string, number>;
  };
}

export const bucketlistService = {
  getAll: async (): Promise<BucketItem[]> => {
    const response = await api.get('/bucketlist');
    return response.data.data;
  },

  getSummary: async (category?: string, status?: string): Promise<BucketListSummary> => {
    const params: any = {};
    if (category) params.category = category;
    if (status) params.status = status;
    const response = await api.get('/bucketlist/summary', { params });
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

  updateStatus: async (id: string, status: string): Promise<BucketItem> => {
    const response = await api.patch(`/bucketlist/${id}/status`, { status });
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/bucketlist/${id}`);
  },
};
