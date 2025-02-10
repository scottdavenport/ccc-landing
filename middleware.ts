import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const [sessionResponse, userResponse] = await Promise.all([
    supabase.auth.getSession(),
    supabase.auth.getUser()
  ]);

  const session = sessionResponse.data.session;
  const user = userResponse.data.user;

  // If user is not authenticated and trying to access admin pages
  if (!session || !user) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
      const redirectUrl = new URL('/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // Verify admin status from authenticated user data
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const isAdmin = user.user_metadata?.role === 'admin';
    if (!isAdmin) {
      const redirectUrl = new URL('/', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all admin routes including subpages
     */
    '/admin/:path*',
  ],
};
