import { supabase } from '../config/supabase';
import { BucketItem } from '../types';

export const getBucketItemsByUserId = async (
  userId: string
): Promise<BucketItem[]> => {
  const { data, error } = await supabase
    .from('bucket_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createBucketItem = async (
  itemData: Partial<BucketItem>
): Promise<BucketItem> => {
  const { data, error } = await supabase
    .from('bucket_items')
    .insert(itemData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateBucketItem = async (
  id: string,
  userId: string,
  updates: Partial<BucketItem>
): Promise<BucketItem> => {
  const { data, error } = await supabase
    .from('bucket_items')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteBucketItem = async (
  id: string,
  userId: string
): Promise<void> => {
  const { error } = await supabase
    .from('bucket_items')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
};

interface BucketListSummary {
  items: BucketItem[];
  stats: {
    total: number;
    completed: number;
    in_progress: number;
    planning: number;
    not_started: number;
    completion_percentage: number;
    by_category: Record<string, number>;
  };
}

export const getBucketListSummary = async (
  userId: string,
  category: string,
  status: string
): Promise<BucketListSummary> => {
  let query = supabase
    .from('bucket_items')
    .select('*')
    .eq('user_id', userId);

  if (category !== 'all') {
    query = query.eq('category', category);
  }

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;

  const items = data || [];
  
  // Calculate statistics
  const stats = {
    total: items.length,
    completed: items.filter(i => i.status === 'completed').length,
    in_progress: items.filter(i => i.status === 'in_progress').length,
    planning: items.filter(i => i.status === 'planning').length,
    not_started: items.filter(i => i.status === 'not_started').length,
    completion_percentage: items.length > 0 
      ? Math.round((items.filter(i => i.status === 'completed').length / items.length) * 100)
      : 0,
    by_category: items.reduce((acc, item) => {
      const cat = item.category || 'uncategorized';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return { items, stats };
};
