import { supabase } from './supabase';
import { supabaseAdmin } from './supabase-admin';
import type { Database } from '../types/supabase';

// Sponsor level operations
export async function getSponsorLevels() {
  const { data, error } = await supabaseAdmin
    .from('sponsor_levels')
    .select('*')
    .order('amount', { ascending: false });
  
  if (error) throw error;
  return data as Database['public']['Tables']['sponsor_levels']['Row'][];
}

export async function createSponsorLevel(level: Omit<Database['public']['Tables']['sponsor_levels']['Row'], 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabaseAdmin
    .from('sponsor_levels')
    .insert(level)
    .select()
    .single();
  
  if (error) throw error;
  return data as Database['public']['Tables']['sponsor_levels']['Row'];
}

// Sponsor operations
export async function getSponsors() {
  const { data, error } = await supabaseAdmin
    .from('sponsors')
    .select(`
      *,
      sponsor_level:sponsor_levels(*)
    `)
    .order('sponsor_level(amount)', { ascending: false });
  
  if (error) throw error;
  return data as (Database['public']['Tables']['sponsors']['Row'] & { sponsor_level: Database['public']['Tables']['sponsor_levels']['Row'] })[];
}


