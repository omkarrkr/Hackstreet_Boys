import { supabase } from '../config/supabase';
import { Goal, GoalStep } from '../types';

export const getGoalsByUserId = async (userId: string): Promise<Goal[]> => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createGoal = async (goalData: Partial<Goal>): Promise<Goal> => {
  const { data, error } = await supabase
    .from('goals')
    .insert(goalData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateGoal = async (
  id: string,
  userId: string,
  updates: Partial<Goal>
): Promise<Goal> => {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteGoal = async (id: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
};

export const getGoalSteps = async (goalId: string): Promise<GoalStep[]> => {
  const { data, error } = await supabase
    .from('goal_steps')
    .select('*')
    .eq('goal_id', goalId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const createGoalStep = async (
  stepData: Partial<GoalStep>
): Promise<GoalStep> => {
  const { data, error } = await supabase
    .from('goal_steps')
    .insert(stepData)
    .select()
    .single();

  if (error) throw error;
  return data;
};
