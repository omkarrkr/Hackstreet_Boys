import { supabase } from '../config/supabase';
import { Task } from '../types';

export const getTasksByUserId = async (userId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('due_date', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(taskData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTask = async (
  id: string,
  userId: string,
  updates: Partial<Task>
): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTask = async (id: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
};
