import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase-server';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

async function getSession() {
  const cookieStore = cookies();
  const supabase = createClient();
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export default async function LoginPage() {
  const session = await getSession();

  // If user is already logged in and is admin, redirect to admin panel
  if (session?.user?.user_metadata?.role === 'admin') {
    redirect('/admin');
  }

  // If user is logged in but not admin, redirect to home
  if (session && session.user?.user_metadata?.role !== 'admin') {
    redirect('/');
  }

  return <LoginForm />;
}
