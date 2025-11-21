import { api } from './api';
import { Habit, HabitLog } from '../types/Habit';

export const habitsService = {
  getAll: async (): Promise<Habit[]> => {
    const response = await api.get('/habits');
    return response.data.data;
  },

  create: async (data: Partial<Habit>): Promise<Habit> => {
    const response = await api.post('/habits', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Habit>): Promise<Habit> => {
    const response = await api.put(`/habits/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/habits/${id}`);
  },

  logHabit: async (id: string, data: Partial<HabitLog>): Promise<HabitLog> => {
    const response = await api.post(`/habits/${id}/log`, data);
    return response.data.data;
  },

  getLogs: async (id: string): Promise<HabitLog[]> => {
    const response = await api.get(`/habits/${id}/logs`);
    return response.data.data;
  },
};
