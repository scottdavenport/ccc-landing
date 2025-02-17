import { supabase } from './supabase';
import { supabaseAdmin } from './supabase-admin';
import type { SponsorLevel, Sponsor } from '../types/database';

// Sponsor level operations
export async function getSponsorLevels() {
  const { data, error } = await supabase
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

export async function createSponsor(sponsor: Omit<Sponsor, 'id' | 'created_at' | 'updated_at'>) {
  try {
    console.log('Creating sponsor with data:', sponsor);
    
    const { data, error } = await supabaseAdmin
      .from('sponsors')
      .insert(sponsor)
      .select(`
        *,
        sponsor_level:sponsor_levels(*)
      `)
      .single();
    
    if (error) {
      console.error('Supabase error creating sponsor:', {
        error,
        errorMessage: error.message,
        errorDetails: error.details,
        errorHint: error.hint,
        sponsor,
      });
      throw new Error(`Failed to create sponsor: ${error.message}${error.hint ? ` (${error.hint})` : ''}`);
    }
    
    console.log('Successfully created sponsor:', data);
    return data as Sponsor & { sponsor_level: SponsorLevel };
  } catch (error) {
    console.error('Error in createSponsor:', {
      error,
      sponsor,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}
