import { createClient } from '@supabase/supabase-js';

// Enhanced environment validation and logging
const validateAndLogEnv = () => {
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  // Log a masked version of the key for verification (first 8 chars)
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  console.log('Anon Key (first 8 chars):', anonKey.substring(0, 8));
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
};

validateAndLogEnv();

/**
 * Initialize the Supabase client with environment variables.
 * This client can be used for public operations (those using the anon key).
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  {
    auth: {
      persistSession: true,
    },
  }
);

// Helper function to refresh schema cache
export async function refreshSchemaCache() {
  // Force a new query to refresh the schema cache
  try {
    await supabase
      .from('sponsors')
      .select('id')
      .limit(1);
    return true;
  } catch (error) {
    console.error('Error refreshing schema cache:', error);
    return false;
  }
}
