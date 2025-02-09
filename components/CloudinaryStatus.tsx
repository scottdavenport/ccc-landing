'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth/AuthContext'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

const CloudinaryStatus = () => {
  const { isAdmin } = useAuth()
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [details, setDetails] = useState<string | null>(null)
  const [lastError, setLastError] = useState<Error | null>(null)

  useEffect(() => {
    async function checkConnection() {
      try {
        // Check if we have valid config
        if (!cloudinaryName) {
          throw new Error('Missing Cloudinary cloud name')
        }

        // Test if we can reach Cloudinary API
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryName}/upload`,
          {
            method: 'OPTIONS',
            cache: 'no-store'
          }
        )

        if (!response.ok) {
          throw new Error(`Cloudinary API error: ${response.statusText}`)
        }

        setStatus('connected')
        setErrorMessage(null)
        setDetails(`Connected to Cloudinary (Cloud: ${cloudinaryName})`)
        
      } catch (error) {
        console.error('Cloudinary connection error:', error)
        setStatus('error')
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
        setLastError(error instanceof Error ? error : new Error('Unknown error'))
        setDetails(null)
        
        if (isAdmin) {
          toast.error('Cloudinary connection error', {
            description: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }
    }

    checkConnection()
  }, [isAdmin])

  if (!isAdmin) {
    return null
  }

  return (
    <Card className="p-4 bg-background/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3 text-sm"
      >
        <span className="text-muted-foreground font-medium">Cloudinary Status:</span>
        {status === 'checking' && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Checking connection...</span>
          </div>
        )}
        {status === 'connected' && (
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="h-2 w-2 rounded-full bg-green-500"
            />
            <span className="text-green-500 font-medium">Connected</span>
            {details && (
              <span className="text-muted-foreground">({details})</span>
            )}
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="h-2 w-2 rounded-full bg-destructive"
            />
            <span className="text-destructive font-medium">
              Error: {errorMessage}
            </span>
          </div>
        )}
      </motion.div>
    </Card>
  )
}

export default CloudinaryStatus
