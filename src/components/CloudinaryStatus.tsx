import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth/AuthContext';

const cloudinaryName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

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
        // For status check, we'll verify we can reach the upload endpoint
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryName}/upload`,
          {
            method: 'OPTIONS'
          }
        );

        if (!response.ok) {
          throw new Error(`Cloudinary API error: ${response.statusText}`);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center space-x-2 text-sm"
    >
      <span className="text-gray-500">Cloudinary:</span>
      {status === 'checking' && (
        <span className="text-gray-500">Checking connection...</span>
      )}
      {status === 'connected' && (
        <>
          <span className="text-green-500">Connected</span>
          {details && (
            <span className="text-gray-400">({details})</span>
          )}
        </>
      )}
      {status === 'error' && (
        <span className="text-red-500">
          Error: {errorMessage}
        </span>
      )}
    </motion.div>
  );
};

export default CloudinaryStatus;
