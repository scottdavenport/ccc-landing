import { Link, Navigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth/AuthContext';

export default function Login() {
  const { user, loading } = useAuth();

  // If user is already logged in, redirect to admin
  if (user && !loading) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
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
              redirectTo={`${window.location.origin}/admin`}
            />
          </div>

          <div className="mt-4 text-center">
            <Link 
              to="/"
              className="text-sm text-gray-600 hover:text-ccc-teal transition-colors"
            >
              Return to Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
