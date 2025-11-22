import { api } from './api';
import { HealthMetric, Workout } from '../types/Health';

export const healthService = {
  getMetrics: async (): Promise<HealthMetric[]> => {
    const response = await api.get('/health/metrics');
    return response.data.data;
  },

  createMetric: async (data: Partial<HealthMetric>): Promise<HealthMetric> => {
    const response = await api.post('/health/metrics', data);
    return response.data.data;
  },

  updateMetric: async (id: string, data: Partial<HealthMetric>): Promise<HealthMetric> => {
    const response = await api.put(`/health/metrics/${id}`, data);
    return response.data.data;
  },

  deleteMetric: async (id: string): Promise<void> => {
    await api.delete(`/health/metrics/${id}`);
  },

  getWorkouts: async (): Promise<Workout[]> => {
    const response = await api.get('/health/workouts');
    return response.data.data;
  },

  createWorkout: async (data: Partial<Workout>): Promise<Workout> => {
    const response = await api.post('/health/workouts', data);
    return response.data.data;
  },

  updateWorkout: async (id: string, data: Partial<Workout>): Promise<Workout> => {
    const response = await api.put(`/health/workouts/${id}`, data);
    return response.data.data;
  },

  deleteWorkout: async (id: string): Promise<void> => {
    await api.delete(`/health/workouts/${id}`);
  },
};
