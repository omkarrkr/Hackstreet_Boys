import { supabase } from '../config/supabase';
import { Habit, HabitLog } from '../types';

export const getHabitsByUserId = async (userId: string): Promise<Habit[]> => {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createHabit = async (habitData: Partial<Habit>): Promise<Habit> => {
  const { data, error } = await supabase
    .from('habits')
    .insert(habitData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateHabit = async (
  id: string,
  userId: string,
  updates: Partial<Habit>
): Promise<Habit> => {
  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteHabit = async (id: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
};

export const createHabitLog = async (
  logData: Partial<HabitLog>
): Promise<HabitLog> => {
  const { data, error } = await supabase
    .from('habit_logs')
    .insert(logData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getHabitLogs = async (habitId: string): Promise<HabitLog[]> => {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('habit_id', habitId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};
