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

  getWorkouts: async (): Promise<Workout[]> => {
    const response = await api.get('/health/workouts');
    return response.data.data;
  },

  createWorkout: async (data: Partial<Workout>): Promise<Workout> => {
    const response = await api.post('/health/workouts', data);
    return response.data.data;
  },
};
