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
