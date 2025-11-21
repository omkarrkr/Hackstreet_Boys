import { supabase } from '../config/supabase';
import { User } from '../types';

export const createUser = async (
  email: string,
  passwordHash: string,
  fullName?: string
): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      email,
      password_hash: passwordHash,
      full_name: fullName,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const findUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};
