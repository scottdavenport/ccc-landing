import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from '../types/supabase';
import type { CookieOptions } from '@supabase/ssr';

/**
 * Initialize the Supabase admin client with service role key.
 * This client should only be used in server-side code for admin operations.
 * Uses the new @supabase/ssr package for better Edge compatibility.
 */
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

  // Add request logging
  const { fetch: originalFetch } = client;
  client.fetch = async (url: URL | string, options: RequestInit = {}) => {
    console.log('Supabase request:', {
      url: url.toString(),
      method: options.method,
      headers: options.headers,
    });
    
    // Add service role headers
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${supabaseServiceRoleKey}`);
    headers.set('apikey', supabaseServiceRoleKey);
    options.headers = headers;
    
    const response = await originalFetch(url, options);
    if (!response.ok) {
      console.error('Supabase request failed:', {
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
 * This client will use the user's session if available.
 */
export const getSupabaseClient = () => {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle error
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({ name, ...options });
          } catch (error) {
            // Handle error
          }
        },
      },
    }
  );
};


  return client;
};

// Always create a fresh client for each request to avoid session sharing
export const getSupabaseClient = () => getSupabaseAdmin();

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
