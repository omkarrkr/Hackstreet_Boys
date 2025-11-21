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
  const { data, error} = await supabase
    .from('habit_logs')
    .select('*')
    .eq('habit_id', habitId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

interface HabitSummary extends Habit {
  completed_today: boolean;
  current_streak: number;
  longest_streak: number;
}

export const getHabitsSummaryForDate = async (
  userId: string,
  date: string
): Promise<HabitSummary[]> => {
  // Get all habits for user
  const habits = await getHabitsByUserId(userId);
  
  // Get all logs for these habits
  const habitIds = habits.map(h => h.id);
  const { data: allLogs, error: logsError } = await supabase
    .from('habit_logs')
    .select('*')
    .in('habit_id', habitIds)
    .order('date', { ascending: false });

  if (logsError) throw logsError;

  // Calculate streaks and completion status for each habit
  const summaries: HabitSummary[] = habits.map(habit => {
    const habitLogs = (allLogs || []).filter(log => log.habit_id === habit.id);
    
    // Check if completed today
    const completedToday = habitLogs.some(log => log.date === date && log.completed);
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date(date);
    let checkDate = new Date(today);
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const logForDate = habitLogs.find(log => log.date === dateStr && log.completed);
      
      if (logForDate) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    const sortedLogs = habitLogs
      .filter(log => log.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (let i = 0; i < sortedLogs.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(sortedLogs[i - 1].date);
        const currDate = new Date(sortedLogs[i].date);
        const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return {
      ...habit,
      completed_today: completedToday,
      current_streak: currentStreak,
      longest_streak: longestStreak,
    };
  });

  return summaries;
};
