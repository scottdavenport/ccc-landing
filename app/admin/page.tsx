import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

async function getSession() {
  const supabase = createClient();
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const isAdmin = session.user.user_metadata?.role === 'admin';
  if (!isAdmin) {
    redirect('/');
  }

  const userData = {
    id: session.user.id,
    email: session.user.email,
    role: session.user.user_metadata?.role,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard user={userData} />
    </div>
  );
}
