import { supabase } from './supabase';
import type { SponsorLevel, Sponsor } from '../types/database';

/**
 * Public database operations that only require read access.
 * These functions use the anon key client since they only need public access.
 */

export async function getPublicSponsorLevels() {
  console.log('Fetching sponsor levels...');
  try {
    const { data, error } = await supabase
      .from('sponsor_levels')
      .select('*')
      .order('amount', { ascending: false });
    
    if (error) {
      console.error('Error fetching sponsor levels:', {
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log(`Successfully fetched ${data?.length || 0} sponsor levels`);
    return data as SponsorLevel[];
  } catch (e) {
    console.error('Unexpected error in getPublicSponsorLevels:', e);
    throw e;
  }
}

export async function getPublicSponsors() {
  console.log('Fetching sponsors with levels...');
  try {
    const { data, error } = await supabase
      .from('sponsors')
      .select(`
        *,
        sponsor_level:sponsor_levels(*)
      `)
      .order('sponsor_level(amount)', { ascending: false });
    
    if (error) {
      console.error('Error fetching sponsors:', {
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log(`Successfully fetched ${data?.length || 0} sponsors`);
    if (data?.length) {
      console.log('Sample sponsor data structure:', {
        id: data[0].id,
        hasLevel: !!data[0].sponsor_level,
        levelId: data[0].sponsor_level?.id
      });
    }
    
    return data as (Sponsor & { sponsor_level: SponsorLevel })[];
  } catch (e) {
    console.error('Unexpected error in getPublicSponsors:', e);
    throw e;
  }
}
