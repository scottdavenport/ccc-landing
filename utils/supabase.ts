import { createClient } from '@supabase/supabase-js';

// Log environment state without exposing sensitive values
const envState = {
  hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')?.[0] || 'not-set',
  nodeEnv: process.env.NODE_ENV,
};

console.log('Supabase Environment State:', envState);

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('Supabase URL is missing. Environment state:', envState);
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Supabase Anon Key is missing. Environment state:', envState);
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

/**
 * Initialize the Supabase client with environment variables.
 * This client can be used for public operations (those using the anon key).
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
    },
    db: {
      schema: 'public',
    },
    // Add retries for preview environment
    ...(process.env.VERCEL_ENV === 'preview' && {
      realtime: {
        params: {
          eventsPerSecond: 2,
        },
      },
    }),
  }
);

// Log successful client creation
console.log('Supabase client initialized successfully with URL prefix:', envState.supabaseUrlPrefix);

// Helper function to refresh schema cache with exponential backoff
export async function refreshSchemaCache(maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Force queries to refresh schema cache for both tables
      const sponsorsPromise = supabase.from('sponsors').select('id').limit(1);
      const levelsPromise = supabase.from('sponsor_levels').select('id').limit(1);
      
      const [sponsors, levels] = await Promise.all([sponsorsPromise, levelsPromise]);

      if (!sponsors.error && !levels.error) {
        console.log('Schema cache refreshed successfully');
        return true;
      }

      console.warn(`Schema cache refresh attempt ${i + 1}/${maxRetries} failed:`, {
        sponsorsError: sponsors.error,
        levelsError: levels.error,
        supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')?.[0] || 'not-set',
        nodeEnv: process.env.NODE_ENV,
      });
      return false;
    }

    console.log('Schema cache refreshed successfully');
    return true;
  } catch (error) {
    console.error('Schema cache refresh failed:', {
      error,
      supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')?.[0] || 'not-set',
      nodeEnv: process.env.NODE_ENV,
    });
    return false;
  }
}
