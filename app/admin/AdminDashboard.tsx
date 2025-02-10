'use client';

import { motion } from 'framer-motion';
import { Suspense } from 'react';
import Link from 'next/link';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

import SupabaseStatus from '@/components/SupabaseStatus';
import CloudinaryStatus from '@/components/CloudinaryStatus';


interface User {
  id: string;
  email: string | undefined;
  role: string | undefined;
}

interface AdminDashboardProps {
  user: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <img 
                  src="/ccc-logo.svg" 
                  alt="CCC Logo" 
                  className="h-8 w-auto"
                />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.email}
              </span>

              <Link href="/logout">
                <Button
                  variant="outline"
                >
                  Sign Out
                </Button>
              </Link>
              <Link 
                href="/"
                className="text-ccc-teal hover:text-ccc-teal-dark transition-colors"
              >
                Return to Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="col-span-full lg:col-span-1 bg-white p-6 rounded-lg shadow"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/admin/photos" className="block w-full">
                <button className="w-full px-4 py-2 bg-ccc-teal text-white rounded hover:bg-ccc-teal-dark transition-colors">
                  Photo Upload
                </button>
              </Link>

              <Link href="/admin/users" className="block w-full">
                <button className="w-full px-4 py-2 bg-ccc-teal text-white rounded hover:bg-ccc-teal-dark transition-colors">
                  Manage Users
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="col-span-full bg-white p-6 rounded-lg shadow"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="text-sm text-gray-500">
              No recent activity to display
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer with status */}
      <footer className="container mx-auto px-4 py-4 border-t border-gray-200">
        <ErrorBoundary>
          <Suspense fallback={<div className="text-sm text-gray-500">Loading status...</div>}>
            <div className="space-y-2">
              <SupabaseStatus />
              <CloudinaryStatus />
            </div>
          </Suspense>
        </ErrorBoundary>
      </footer>
    </div>
  );
}
