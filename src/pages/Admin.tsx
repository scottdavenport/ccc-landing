import { motion } from 'framer-motion';
import { Suspense, lazy, useState } from 'react';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const SupabaseStatus = lazy(() => import('@/components/SupabaseStatus'));
const CloudinaryStatus = lazy(() => import('@/components/CloudinaryStatus'));
const SponsorUpload = lazy(() => import('@/components/admin/SponsorUpload'));

const Admin = () => {
  const { user, signOut, loading, profile, isAdmin } = useAuth();

  console.log('Admin Component State:', {
    loading,
    user,
    profile,
    isAdmin
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-ccc-teal" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="hover:opacity-80 transition-opacity">
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
              <Link to="/logout">
                <Button
                  variant="outline"
                >
                  Sign Out
                </Button>
              </Link>
              <Link 
                to="/"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="col-span-full lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Donations</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">$0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Registered Teams</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Active Sponsors</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="col-span-full lg:col-span-1 bg-white p-6 rounded-lg shadow"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <ErrorBoundary>
                <Suspense fallback={<div className="w-full px-4 py-2 bg-gray-300 text-white rounded">Loading...</div>}>
                  <SponsorUpload />
                </Suspense>
              </ErrorBoundary>
              <button className="w-full px-4 py-2 bg-ccc-teal text-white rounded hover:bg-ccc-teal-dark transition-colors">
                View Registrations
              </button>
              <Link to="/admin/users" className="block w-full">
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
};

export default Admin;
