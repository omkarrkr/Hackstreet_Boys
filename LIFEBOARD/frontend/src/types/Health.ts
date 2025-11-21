export interface HealthMetric {
  id: string;
  user_id: string;
  date: string;
  weight?: number;
  sleep_hours?: number;
  water_intake?: number;
  mood?: string;
  notes?: string;
  created_at: string;
}

export interface Workout {
  id: string;
  user_id: string;
  date: string;
  type: string;
  duration_minutes: number;
  intensity: 'low' | 'medium' | 'high';
  calories_burned?: number;
  notes?: string;
  created_at: string;
}
