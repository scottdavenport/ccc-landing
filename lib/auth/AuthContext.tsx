'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

type UserRole = 'admin' | 'user';

type Profile = {
  id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check admin status from user metadata
  const checkAdminStatus = (user: User | null | undefined) => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    const role = user.user_metadata?.role;
    console.log('User metadata:', { email: user.email, role });
    
    const adminStatus = role === 'admin';
    console.log('Setting admin status:', { email: user.email, role, isAdmin: adminStatus });
    
    setIsAdmin(adminStatus);
    
    // Sign out non-admin users, but only if we're in the browser
    if (typeof window !== 'undefined' && !adminStatus && window.location.pathname.startsWith('/admin')) {
      console.log('Non-admin user detected, signing out');
      supabase.auth.signOut().then(() => {
        window.location.href = '/';
      });
    }
  };

  useEffect(() => {
    // Get initial session and user
    const initializeAuth = async () => {
      try {
        const [{ data: { session } }, { data: { user } }] = await Promise.all([
          supabase.auth.getSession(),
          supabase.auth.getUser()
        ]);

        if (user) {
          console.log('Initial auth state:', { email: user.email });
          setSession(session);
          setUser(user);
          checkAdminStatus(user);
        } else {
          // Clear state if no authenticated user
          setSession(null);
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error getting initial auth state:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', { event: _event, email: session?.user?.email });
      
      try {
        // Always verify user with server
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (user) {
          setSession(session);
          setUser(user);
          checkAdminStatus(user);
        } else {
          // Clear state if no authenticated user
          setSession(null);
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error during auth state change:', error);
        // Clear state on error
        setSession(null);
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  console.log('AuthContext State:', {
    session: session?.user?.email,
    user: user?.email,
    profile: profile?.role,
    loading,
    isAdmin
  });

  const value = {
    session,
    user,
    profile,
    loading,
    isAdmin,
    signOut: async () => {
      await supabase.auth.signOut();
      window.location.href = '/';
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
