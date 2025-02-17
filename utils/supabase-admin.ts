import { createClient } from '@supabase/supabase-js';
import type { Sponsor, SponsorLevel } from '../types/database';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
}

/**
 * Initialize the Supabase admin client with service role key.
 * This client should only be used in server-side code for admin operations.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

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
