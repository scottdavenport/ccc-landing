'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/providers/supabase-provider'

type UserRole = 'admin' | 'user'

type Profile = {
  id: string
  role: UserRole
  created_at: string
  updated_at: string
}

type AuthContextType = {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check admin status from user metadata
  const checkAdminStatus = (user: User | null) => {
    if (!user) {
      setIsAdmin(false)
      return
    }

    const role = user.user_metadata?.role
    const adminStatus = role === 'admin'
    setIsAdmin(adminStatus)
    
    // Redirect non-admin users
    if (!adminStatus && window.location.pathname.startsWith('/admin')) {
      supabase.auth.signOut().then(() => {
        router.push('/login')
        router.refresh()
      })
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      checkAdminStatus(session?.user)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      checkAdminStatus(session?.user)
      setProfile(null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  const value = {
    session,
    user,
    profile,
    loading,
    isAdmin,
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
