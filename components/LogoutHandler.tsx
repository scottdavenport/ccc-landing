'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LogoutHandler() {
  useEffect(() => {
    async function performLogout() {
      try {
        // Sign out from Supabase
        await supabase.auth.signOut();
        
        // Clear any local storage or session storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear cookies by setting them to expire
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        // Force a hard redirect to homepage
        window.location.href = '/';
      } catch (error) {
        console.error('Error during logout:', error);
        // Even if there's an error, try to redirect
        window.location.href = '/';
      }
    }

    performLogout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-ccc-teal" />
    </div>
  );
}
