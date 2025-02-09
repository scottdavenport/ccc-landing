import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import Image from 'next/image'
import { CloudinaryStatus } from '@/components/CloudinaryStatus'
import { SupabaseStatus } from '@/components/SupabaseStatus'

export default async function AdminPage() {
  const cookieStore = await cookies()
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

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gradient-to-b from-ccc-teal-dark via-ccc-teal to-ccc-teal-light p-6 md:p-8 w-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-white text-center space-y-4 mb-8">
          <div className="w-48 h-24 relative mb-4">
            <Image
              src="/ccc-logo.svg"
              alt="Craven Cancer Classic Logo"
              fill
              className="object-contain brightness-0 invert"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif">Admin Dashboard</h1>
          <p className="text-white/80 max-w-2xl">Manage your Craven Cancer Classic website content and monitor system status.</p>
        </div>

        {/* Status Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-full lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-serif text-gray-900">System Status</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <CloudinaryStatus />
                <SupabaseStatus />
              </div>
            </div>
          </div>

          {/* Session Info Card */}
          <div className="col-span-full lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-serif text-gray-900">Session Info</h2>
              <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-[400px] border border-gray-100">
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
