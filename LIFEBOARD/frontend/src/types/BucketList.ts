export interface BucketItem {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  target_date?: string;
  status: 'not_started' | 'planning' | 'in_progress' | 'completed';
  image_url?: string;
  created_at: string;
  updated_at: string;
}
