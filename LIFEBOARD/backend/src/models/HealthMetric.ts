import { supabase } from '../config/supabase';
import { HealthMetric, Workout } from '../types';

export const getHealthMetricsByUserId = async (
  userId: string
): Promise<HealthMetric[]> => {
  const { data, error } = await supabase
    .from('health_metrics')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createHealthMetric = async (
  metricData: Partial<HealthMetric>
): Promise<HealthMetric> => {
  const { data, error } = await supabase
    .from('health_metrics')
    .insert(metricData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getWorkoutsByUserId = async (userId: string): Promise<Workout[]> => {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createWorkout = async (
  workoutData: Partial<Workout>
): Promise<Workout> => {
  const { data, error } = await supabase
    .from('workouts')
    .insert(workoutData)
    .select()
    .single();

  if (error) throw error;
  return data;
};
