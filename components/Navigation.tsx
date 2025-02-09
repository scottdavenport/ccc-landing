'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

export const Navigation = () => {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (isAdmin) {
    return (
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-background border-b"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <Link 
                href="/admin"
                className="text-foreground font-medium hover:text-muted-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/users"
                className="text-foreground font-medium hover:text-muted-foreground transition-colors"
              >
                Users
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="text-foreground font-medium hover:text-muted-foreground transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.nav>
    )
  }

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-transparent"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-end">
          <Link
            href="#about"
            className="text-white text-lg font-medium hover:text-muted transition-colors duration-200"
          >
            About the CCC
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
