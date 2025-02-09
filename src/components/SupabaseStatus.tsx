import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth/AuthContext';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const SupabaseStatus = () => {
  const { user, isAdmin } = useAuth();
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [details, setDetails] = useState<string | null>(null);
  const [lastError, setLastError] = useState<Error | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        // First check if we have valid config
        if (!supabaseUrl) {
          throw new Error('Missing Supabase URL environment variable');
        }

        // Validate URL format
        try {
          new URL(supabaseUrl);
        } catch {
          throw new Error('Invalid Supabase URL format - must be a valid URL');
        }

        // Validate URL is a Supabase URL
        if (!supabaseUrl.includes('.supabase.co')) {
          throw new Error('Invalid Supabase URL - must be a .supabase.co domain');
        }

        // Test if we can reach Supabase
        try {
          const { data: { session }, error: authError } = await supabase.auth.getSession();
          
          if (authError) {
            console.error('Supabase auth error:', authError);
            throw authError;
          }

          setStatus('connected');
          setErrorMessage(null);
          if (!session) {
            setDetails('Connected to Supabase (not authenticated)');
            return;
          }

          setDetails(`Connected as ${session.user.email}${isAdmin ? ' (admin)' : ''}`);
        } catch (authError) {
          console.error('Error checking auth:', authError);
          throw authError;
        }
      } catch (err) {
        console.error('Supabase connection error:', err);
        setStatus('error');
        
        // Handle specific error types
        if (err instanceof Error) {
          if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
            setErrorMessage('Network Error');
            setDetails('Could not reach Supabase - check your internet connection');
          } else if (err.message.includes('Invalid URL')) {
            setErrorMessage('Configuration Error');
            setDetails('Invalid Supabase URL - check your environment variables');
          } else if (err.message.includes('42501')) {
            setErrorMessage('Permission Error');
            setDetails('Insufficient permissions to access profiles table');
          } else {
            setErrorMessage(err.message);
            setDetails(err.stack?.split('\n')[0] || 'No additional details available');
          }
          setLastError(err);
        } else {
          const error = new Error(typeof err === 'string' ? err : 'Unknown error occurred while connecting to Supabase');
          console.error('Non-Error object thrown:', err);
          setErrorMessage(error.message);
          setDetails('An unexpected error occurred');
          setLastError(error);
        }
      }
    }

    checkConnection();
  }, []);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => {
        if (status === 'error' && lastError) {
          toast.error('Supabase Connection Error', {
            description: (
              <div className="mt-2 space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Message: </span>
                  {lastError.message}
                </div>
                {lastError.stack && (
                  <div className="font-mono text-xs whitespace-pre-wrap overflow-auto max-h-40">
                    {lastError.stack}
                  </div>
                )}
              </div>
            ),
            duration: 10000,
            action: {
              label: 'Copy',
              onClick: () => {
                const errorText = `Error: ${lastError.message}\n\nStack Trace:\n${lastError.stack}`;
                navigator.clipboard.writeText(errorText);
                toast.success('Error details copied to clipboard');
              },
            },
          });
          console.error('Supabase Connection Error:', lastError);
        } else if (status === 'connected') {
          toast.success('Supabase Connection Details', {
            description: (
              <div className="mt-2 space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Project URL: </span>
                  <span className="font-mono text-xs">{supabaseUrl}</span>
                </div>
                <div>
                  <span className="font-semibold">Status: </span>
                  <span className="text-green-600">Connected</span>
                </div>
                <div>
                  <span className="font-semibold">Auth: </span>
                  <span className={user ? 'text-green-600' : 'text-yellow-600'}>{user ? `Authenticated${isAdmin ? ' (admin)' : ''}` : 'Not authenticated'}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Click to copy project URL
                </div>
              </div>
            ),
            duration: 5000,
            action: {
              label: 'Copy URL',
              onClick: () => {
                navigator.clipboard.writeText(supabaseUrl);
                toast.success('Project URL copied to clipboard');
              },
            },
          });
        } else if (status === 'checking') {
          toast.info('Checking Supabase connection...', {
            description: 'Verifying connection to project...',
            duration: 2000,
          });
        }
      }}
      className="group flex items-center space-x-2 text-sm rounded px-3 py-2 transition-colors hover:bg-gray-50 active:bg-gray-100"
    >
      <div className="flex items-center space-x-2">
        <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Supabase:</span>
        {status === 'checking' && (
          <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
        )}
        {status === 'connected' && (
          <div className="h-2 w-2 rounded-full bg-green-400" />
        )}
        {status === 'error' && (
          <div className="h-2 w-2 rounded-full bg-red-400" />
        )}
      </div>
      <div className="flex flex-col items-start">
        <span 
          className={`${status === 'error' ? 'text-red-500 group-hover:text-red-600' : 'text-gray-500 group-hover:text-gray-900'} transition-colors`}
        >
          {status === 'checking' && 'Checking connection...'}
          {status === 'connected' && 'Connected'}
          {status === 'error' && errorMessage}
        </span>
        {details && (
          <span className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors mt-0.5">
            {details}
          </span>
        )}
      </div>
    </motion.button>
  );
};

export default SupabaseStatus;
