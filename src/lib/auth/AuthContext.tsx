import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

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
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user profile and update admin status
  const fetchProfile = async (userId: string) => {
    console.log('Fetching profile for user:', userId);
    
    // First try to get the profile directly
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.log('Trying alternate profile query...');
      // If that fails, try joining with auth.users to ensure we get the right data
      const { data: joinData, error: joinError } = await supabase
        .from('profiles')
        .select(`
          profiles.id,
          profiles.role,
          profiles.created_at,
          profiles.updated_at,
          auth.users!inner (email)
        `)
        .eq('profiles.id', userId)
        .single();

      if (joinError) {
        console.error('Error fetching profile with join:', joinError);
        return null;
      }

      return joinData;
    }

    console.log('Profile data received:', data);
    const profile = data as Profile;
    const adminStatus = profile?.role === 'admin';
    console.log('Setting admin status:', { userId, role: profile?.role, isAdmin: adminStatus });
    setIsAdmin(adminStatus);
    return profile;
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', { email: session?.user?.email, event: _event });
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setProfile(profile);
      } else {
        console.log('No user session, clearing profile and admin status');
        setProfile(null);
        setIsAdmin(false);
      }
      
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
