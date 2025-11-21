import { api } from './api';
import { Goal, GoalStep } from '../types/Goal';

export const goalsService = {
  getAll: async (): Promise<Goal[]> => {
    const response = await api.get('/goals');
    return response.data.data;
  },

  create: async (data: Partial<Goal>): Promise<Goal> => {
    const response = await api.post('/goals', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Goal>): Promise<Goal> => {
    const response = await api.put(`/goals/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/goals/${id}`);
  },

  getSteps: async (goalId: string): Promise<GoalStep[]> => {
    const response = await api.get(`/goals/${goalId}/steps`);
    return response.data.data;
  },

  createStep: async (goalId: string, data: Partial<GoalStep>): Promise<GoalStep> => {
    const response = await api.post(`/goals/${goalId}/steps`, data);
    return response.data.data;
  },

  generateRoadmap: async (data: { goalTitle: string; description?: string; timeframe?: string }) => {
    const response = await api.post('/goals/ai-roadmap', data);
    return response.data.data;
  },
};
