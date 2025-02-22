import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

/**
 * Initialize the Supabase admin client with service role key.
 * This client should only be used in server-side code for admin operations.
 * Uses the new @supabase/ssr package for better Edge compatibility.
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

  // Verify the JWT role
  try {
    const jwt = supabaseServiceRoleKey.split('.')[1];
    const payload = JSON.parse(Buffer.from(jwt, 'base64').toString());
    console.log('Service key role verification:', {
      role: payload.role,
      iss: payload.iss,
      exp: new Date(payload.exp * 1000).toISOString()
    });
    
    if (payload.role !== 'service_role') {
      console.error('WARNING: Service key does not have service_role!');
    }
  } catch (e) {
    console.error('Error verifying service role key:', e);
  }

  // Create client with strict Edge Function configuration
  const client = createClient<Database>(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        flowType: 'pkce',  // More secure flow type
        storage: {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {}
        }
      },
      global: {
        headers: {
          // For service role access, we need to set both headers
          'apikey': supabaseServiceRoleKey,
          'Authorization': `Bearer ${supabaseServiceRoleKey}`,
          // Explicitly request service role access
          'x-supabase-auth-role': 'service_role',
          // Additional headers for debugging
          'x-client-info': `@supabase/supabase-js-admin`,
          'x-client-request': 'true',
          // Ensure content type is set
          'Content-Type': 'application/json',
          // Explicitly bypass RLS
          'x-supabase-bypass-rls': 'true'
        },
        fetch: async (url, options: RequestInit = {}) => {
          console.log('Supabase request:', {
            url: url.toString(),
            method: options.method,
            headers: options.headers,
          });
          const response = await globalThis.fetch(url, options);
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
        }
      },
      db: {
        schema: 'public'
      }
    }
  );

  console.log('Supabase admin client initialized successfully');
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
