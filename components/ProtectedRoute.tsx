import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Only show error toast if we have a non-admin user with a loaded profile
    if (!loading && user && profile && !isAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You do not have admin privileges. Please contact an administrator.",
        duration: 5000
      });
    }
  }, [loading, user, profile, isAdmin, toast]);

  if (loading || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
