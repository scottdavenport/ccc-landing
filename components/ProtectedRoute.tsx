'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, profile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!isAdmin) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You do not have admin privileges. Please contact an administrator.",
          duration: 5000
        });
        router.push('/');
      }
    }
  }, [loading, user, profile, isAdmin, toast, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-ccc-teal" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};
