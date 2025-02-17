import { supabase } from './supabase';
import type { SponsorLevel, Sponsor } from '../types/database';

/**
 * Public database operations that only require read access.
 * These functions use the anon key client since they only need public access.
 */

export async function getPublicSponsorLevels() {
  const { data, error } = await supabase
    .from('sponsor_levels')
    .select('*')
    .order('amount', { ascending: false });
  
  if (error) throw error;
  return data as SponsorLevel[];
}

export async function getPublicSponsors() {
  const { data, error } = await supabase
    .from('sponsors')
    .select(`
      *,
      sponsor_level:sponsor_levels(*)
    `)
    .order('sponsor_level(amount)', { ascending: false });
  
  if (error) throw error;
  return data as (Sponsor & { sponsor_level: SponsorLevel })[];
}
