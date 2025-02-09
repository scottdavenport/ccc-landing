import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SupabaseProvider from '@/components/providers/supabase-provider'
import { AuthProvider } from '@/lib/auth/AuthContext'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CCC Landing',
  description: 'Cleveland Coding Challenge',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SupabaseProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              {children}
            </ThemeProvider>
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
