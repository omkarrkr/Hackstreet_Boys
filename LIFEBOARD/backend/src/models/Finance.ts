import { supabase } from '../config/supabase';
import { Transaction, Budget } from '../types';

export const getTransactionsByUserId = async (
  userId: string
): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createTransaction = async (
  transactionData: Partial<Transaction>
): Promise<Transaction> => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transactionData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTransaction = async (
  id: string,
  userId: string,
  updates: Partial<Transaction>
): Promise<Transaction> => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTransaction = async (
  id: string,
  userId: string
): Promise<void> => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
};

export const getBudgetsByUserId = async (userId: string): Promise<Budget[]> => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
};

export const createBudget = async (
  budgetData: Partial<Budget>
): Promise<Budget> => {
  const { data, error } = await supabase
    .from('budgets')
    .insert(budgetData)
    .select()
    .single();

  if (error) throw error;
  return data;
};
