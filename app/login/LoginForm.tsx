'use client';

import Link from 'next/link';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        if (session?.user?.user_metadata?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
              <img 
                src="/ccc-logo.svg" 
                alt="CCC Logo" 
                className="h-12 w-auto mx-auto"
              />
            </Link>
            <h1 className="mt-6 text-2xl font-semibold text-gray-900">Admin Login</h1>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#2A9D8F',
                      brandAccent: '#264653',
                    },
                  },
                },
              }}
              providers={[]}
              redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/admin` : 'http://localhost:3000/admin'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
