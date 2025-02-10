'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth/AuthContext';

const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const CloudinaryStatus = () => {
  const { isAdmin } = useAuth();
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [details, setDetails] = useState<string | null>(null);
  const [lastError, setLastError] = useState<Error | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        // Check if we have valid config
        if (!cloudinaryName) {
          throw new Error('Missing Cloudinary cloud name');
        }

        // Test if we can reach Cloudinary API
        // For status check, we'll verify we can reach the ping endpoint
        const response = await fetch('/api/cloudinary/ping');

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to connect to Cloudinary');
        }

        setStatus('connected');
        setErrorMessage(null);
        setDetails(`Connected to Cloudinary (Cloud: ${cloudinaryName})`);
        
      } catch (error) {
        console.error('Cloudinary connection error:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
        setLastError(error instanceof Error ? error : new Error('Unknown error'));
        setDetails(null);
        
        if (isAdmin) {
          toast.error('Cloudinary connection error', {
            description: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    }

    checkConnection();
  }, [isAdmin]);

  if (!isAdmin) {
    return null;
  }

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => {
        if (status === 'error' && lastError) {
          toast.error('Cloudinary Connection Error', {
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
          console.error('Cloudinary Connection Error:', lastError);
        } else if (status === 'connected') {
          toast.success('Cloudinary Connection Details', {
            description: (
              <div className="mt-2 space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Cloud Name: </span>
                  <span className="font-mono text-xs">{cloudinaryName}</span>
                </div>
                <div>
                  <span className="font-semibold">Status: </span>
                  <span className="text-green-600">Connected</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Click to copy cloud name
                </div>
              </div>
            ),
            duration: 5000,
            action: {
              label: 'Copy Name',
              onClick: () => {
                if (cloudinaryName) {
                  navigator.clipboard.writeText(cloudinaryName);
                }
                toast.success('Cloud name copied to clipboard');
              },
            },
          });
        } else if (status === 'checking') {
          toast.info('Checking Cloudinary connection...', {
            description: 'Verifying connection to cloud...',
            duration: 2000,
          });
        }
      }}
      className="group flex items-center space-x-2 text-sm rounded px-3 py-2 transition-colors hover:bg-gray-50 active:bg-gray-100"
    >
      <div className="flex items-center space-x-2">
        <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Cloudinary:</span>
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

export default CloudinaryStatus;
