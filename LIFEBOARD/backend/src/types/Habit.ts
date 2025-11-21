export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  type: 'good' | 'bad';
  frequency: 'daily' | 'weekly' | 'custom';
  target_count?: number;
  current_streak: number;
  longest_streak: number;
  created_at: string;
  updated_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string;
  completed: boolean;
  notes?: string;
  created_at: string;
}
