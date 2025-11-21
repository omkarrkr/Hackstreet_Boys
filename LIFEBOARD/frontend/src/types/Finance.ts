export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  notes?: string;
  recurring: boolean;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  created_at: string;
  updated_at: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpenses: number;
  net: number;
  categoryBreakdown: {
    category: string;
    amount: number;
  }[];
}
