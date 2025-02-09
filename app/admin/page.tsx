import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { CloudinaryStatus } from '@/components/CloudinaryStatus'
import { SupabaseStatus } from '@/components/SupabaseStatus'

export default async function AdminPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CloudinaryStatus />
        <SupabaseStatus />
      </div>

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-2">Session Info</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  )
}
