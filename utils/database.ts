import { supabase } from './supabase';
import { supabaseAdmin } from './supabase-admin';
import type { SponsorLevel, Sponsor } from '../types/database';

// Sponsor level operations
export async function getSponsorLevels() {
  const { data, error } = await supabaseAdmin
    .from('sponsor_levels')
    .select('*')
    .order('amount', { ascending: false });
  
  if (error) throw error;
  return data as SponsorLevel[];
}

export async function createSponsorLevel(level: Omit<SponsorLevel, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabaseAdmin
    .from('sponsor_levels')
    .insert(level)
    .select()
    .single();
  
  if (error) throw error;
  return data as SponsorLevel;
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
  return data as (Sponsor & { sponsor_level: SponsorLevel })[];
}


