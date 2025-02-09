import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

type UserRole = {
  role: string;
  email: string;
};

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
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check admin status from user metadata
  const checkAdminStatus = (user: User | null) => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    const role = user.user_metadata?.role;
    console.log('User metadata:', { email: user.email, role });
    
    const adminStatus = role === 'admin';
    console.log('Setting admin status:', { email: user.email, role, isAdmin: adminStatus });
    
    setIsAdmin(adminStatus);
    
    // Sign out non-admin users
    if (!adminStatus && window.location.pathname.startsWith('/admin')) {
      console.log('Non-admin user detected, signing out');
      supabase.auth.signOut().then(() => {
        navigate('/');
      });
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      checkAdminStatus(session?.user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', { email: session?.user?.email, event: _event });
      setSession(session);
      setUser(session?.user ?? null);
      checkAdminStatus(session?.user);
      setProfile(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
    signOut: () => supabase.auth.signOut(),
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
