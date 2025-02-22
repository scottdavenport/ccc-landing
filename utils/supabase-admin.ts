import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from '../types/supabase';
import type { CookieOptions } from '@supabase/ssr';

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

  // Create client with service role configuration
  const client = createClient<Database>(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      },
      global: {
        headers: {
          Authorization: `Bearer ${supabaseServiceRoleKey}`,
          apikey: supabaseServiceRoleKey
        }
      }
    }
  );

  // Log all requests and responses
  const supabaseUrlObj = new URL(supabaseUrl);
  const originalFetch = global.fetch;
  global.fetch = async (url: URL | RequestInfo, init?: RequestInit) => {
    if (url.toString().startsWith(supabaseUrlObj.origin)) {
      console.log('Supabase request:', {
        url: url.toString(),
        method: init?.method,
        headers: init?.headers,
      });

      // Ensure service role headers are present
      const headers = new Headers(init?.headers);
      headers.set('Authorization', `Bearer ${supabaseServiceRoleKey}`);
      headers.set('apikey', supabaseServiceRoleKey);
      init = { ...init, headers };
    }

    const response = await originalFetch(url, init);
    
    if (url.toString().startsWith(supabaseUrlObj.origin) && !response.ok) {
      console.error('Supabase request failed:', {
        url: url.toString(),
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });
      try {
        const errorBody = await response.clone().json();
        console.error('Error response body:', errorBody);
      } catch (e) {
        console.error('Could not parse error response body');
      }
    }
    
    return response;
  };

  console.log('Supabase admin client initialized successfully');
  return client;
};

/**
 * Get a Supabase client for the current request.
 * This client will use the admin client for now until we implement proper auth.
 */
export const getSupabaseClient = () => getSupabaseAdmin();

/**
 * Create a new sponsor in the database.
 */
export async function createSponsor(sponsor: Omit<Database['public']['Tables']['sponsors']['Row'], 'id' | 'created_at' | 'updated_at'>) {
  try {
    console.log('Creating sponsor with data:', sponsor);
    
    const { data, error } = await getSupabaseClient()
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
