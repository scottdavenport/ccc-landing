import { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthError, AuthResponse } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: AuthError | null
  signIn: (email: string, password: string) => Promise<AuthResponse>
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResponse>
  signInWithOAuth: (provider: 'google' | 'github') => Promise<AuthResponse>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<AuthResponse>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  useEffect(() => {
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (err) {
        setError(err as AuthError)
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setError(null)

      // If this is a new sign up, create the user profile
      if (event === 'SIGNED_IN' && session?.user.user_metadata.full_name) {
        const { error: profileError } = await supabase
          .from('users')
          .upsert([
            {
              id: session.user.id,
              full_name: session.user.user_metadata.full_name,
              email: session.user.email,
              role: 'player',
              updated_at: new Date().toISOString(),
            },
          ], { onConflict: 'id' })

        if (profileError) setError(profileError)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (response.error) setError(response.error)
    return response
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    if (response.error) setError(response.error)
    return response
  }

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    const response = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (response.error) setError(response.error)
    return response
  }

  const resetPassword = async (email: string) => {
    const response = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (response.error) setError(response.error)
    return response
  }

  const signOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) setError(signOutError)
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error,
        signIn, 
        signUp, 
        signInWithOAuth,
        signOut,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
