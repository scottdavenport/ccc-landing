import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

/**
 * Initialize the Supabase admin client with service role key.
 * This client should only be used in server-side code for admin operations.
 */
export const getSupabaseAdmin = () => {
  console.log('Initializing Supabase admin client...');
  console.log('Environment:', process.env.NODE_ENV);
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Log configuration status
  console.log('Supabase Configuration:', {
    hasUrl: !!supabaseUrl,
    urlFirstChars: supabaseUrl?.substring(0, 15),
    hasServiceKey: !!supabaseServiceRoleKey,
    serviceKeyLength: supabaseServiceRoleKey?.length,
    serviceKeyFirstChars: supabaseServiceRoleKey?.substring(0, 8)
  });

  if (!supabaseUrl) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
  }

  // Create client with enhanced logging
  const client = createClient<Database>(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: 'public'
      }
    }
  );

  console.log('Supabase admin client initialized successfully');
  return client;
};

// Create a new client for each request
export const supabaseAdmin = getSupabaseAdmin();

export async function createSponsor(sponsor: Omit<Database['public']['Tables']['sponsors']['Row'], 'id' | 'created_at' | 'updated_at'>) {
  try {
    console.log('Creating sponsor with data:', sponsor);
    
    const { data, error } = await supabaseAdmin
      .from('sponsors')
      .insert(sponsor)
      .select()
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
    return data as Database['public']['Tables']['sponsors']['Row'];
  } catch (error) {
    console.error('Error in createSponsor:', {
      error,
      sponsor,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}
