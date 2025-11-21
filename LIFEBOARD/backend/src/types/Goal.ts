export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  target_date?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface GoalStep {
  id: string;
  goal_id: string;
  title: string;
  description?: string;
  deadline?: string;
  completed: boolean;
  order_index: number;
  created_at: string;
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
  category?: string;
  targetDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface AIRoadmapRequest {
  goalTitle: string;
  description?: string;
  timeframe?: string;
}
