'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useAuth } from '@/lib/auth/AuthContext'

export const SupabaseStatus = () => {
  const { user, isAdmin } = useAuth()
  const { supabase } = useSupabase()
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [details, setDetails] = useState<string | null>(null)
  const [lastError, setLastError] = useState<Error | null>(null)

  useEffect(() => {
    async function checkConnection() {
      try {
        // Test if we can reach Supabase
        const { data: { session }, error: authError } = await supabase.auth.getSession()
        
        if (authError) {
          console.error('Supabase auth error:', authError)
          throw authError
        }

        setStatus('connected')
        setErrorMessage(null)
        if (!session) {
          setDetails('Connected to Supabase (not authenticated)')
          return
        }

          setDetails(`Connected as ${session.user.email}${isAdmin ? ' (admin)' : ''}`)
        } catch (err) {
        console.error('Supabase connection error:', err)
        setStatus('error')
        
        // Handle specific error types
        if (err instanceof Error) {
          if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
            setErrorMessage('Network Error');
            setDetails('Could not reach Supabase - check your internet connection');
          } else if (err.message.includes('Invalid URL')) {
            setErrorMessage('Configuration Error');
            setDetails('Invalid Supabase URL - check your environment variables')
          } else {
            setErrorMessage(err.message)
            setDetails(err.stack?.split('\n')[0] || 'No additional details available')
          }
          setLastError(err)
        } else {
          setErrorMessage('Unknown Error')
          setDetails('An unexpected error occurred')
          setLastError(new Error('Unknown error occurred while connecting to Supabase'))
        }
      }
    }

    const check = async () => {
      await checkConnection()
    }
    check()
  }, [supabase.auth])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/50 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg overflow-hidden"
    >
      <button
        type="button"
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
                  navigator.clipboard.writeText(errorText)
                  toast.success('Error details copied to clipboard')
                },
              },
            });
            console.error('Supabase Connection Error:', lastError)
          } else if (status === 'connected') {
            toast.success('Supabase Connection Details', {
              description: (
                <div className="mt-2 space-y-2 text-sm">
                  <div>
                    <span className="font-semibold">Status: </span>
                    <span className="text-green-600">Connected</span>
                  </div>
                  <div>
                    <span className="font-semibold">Auth: </span>
                    <span className={user ? 'text-green-600' : 'text-yellow-600'}>{user ? `Authenticated${isAdmin ? ' (admin)' : ''}` : 'Not authenticated'}</span>
                  </div>
                  {details && (
                    <div>
                      <span className="font-semibold">Details: </span>
                      <span className="text-muted-foreground">{details}</span>
                    </div>
                  )}
                </div>
              ),
              duration: 5000
            });
          } else if (status === 'checking') {
            toast.info('Checking Supabase connection...', {
              description: 'Verifying connection to project...',
              duration: 2000,
            });
          }
        }}
        className="w-full p-4 text-left hover:bg-black/5 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {status === 'checking' && (
                <div className="h-3 w-3 rounded-full bg-yellow-400 animate-pulse" />
              )}
              {status === 'connected' && (
                <div className="h-3 w-3 rounded-full bg-green-400" />
              )}
              {status === 'error' && (
                <div className="h-3 w-3 rounded-full bg-red-400" />
              )}
            </div>
            <div>
              <h3 className="font-medium">Supabase Status</h3>
              <p className={`text-sm ${status === 'error' ? 'text-red-500' : 'text-gray-500'}`}>
                {status === 'checking' && 'Checking connection...'}
                {status === 'connected' && 'Connected'}
                {status === 'error' && errorMessage}
              </p>
              {details && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {details}
                </p>
              )}
            </div>
          </div>
          <div className="text-gray-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>
      </button>
    </motion.div>
  );
};


