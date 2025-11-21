import { api } from './api';
import { Task } from '../types/Task';

export const tasksService = {
  getAll: async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data.data;
  },

  create: async (data: Partial<Task>): Promise<Task> => {
    const response = await api.post('/tasks', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Task>): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
