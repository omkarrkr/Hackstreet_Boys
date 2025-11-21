import { api } from './api';
import { Transaction, Budget, FinanceSummary } from '../types/Finance';

export const financesService = {
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get('/finances/transactions');
    return response.data.data;
  },

  createTransaction: async (data: Partial<Transaction>): Promise<Transaction> => {
    const response = await api.post('/finances/transactions', data);
    return response.data.data;
  },

  updateTransaction: async (id: string, data: Partial<Transaction>): Promise<Transaction> => {
    const response = await api.put(`/finances/transactions/${id}`, data);
    return response.data.data;
  },

  deleteTransaction: async (id: string): Promise<void> => {
    await api.delete(`/finances/transactions/${id}`);
  },

  getSummary: async (period?: string): Promise<FinanceSummary> => {
    const response = await api.get('/finances/summary', { params: { period } });
    return response.data.data;
  },

  getBudgets: async (): Promise<Budget[]> => {
    const response = await api.get('/finances/budget');
    return response.data.data;
  },

  createBudget: async (data: Partial<Budget>): Promise<Budget> => {
    const response = await api.post('/finances/budget', data);
    return response.data.data;
  },
};
