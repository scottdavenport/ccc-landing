// Hey! 👋 This tells Next.js that we want to use client-side features like clicking buttons
'use client';

import { useEffect } from 'react';
import PhotoGallery from '@/components/admin/PhotoGallery';
import { SponsorDialog } from '@/components/admin/SponsorDialog';

export default function AdminPage() {
  useEffect(() => {
    // Initialize database schema on page load
    fetch('/api/init-db')
      .catch(error => {
        console.error('Failed to initialize database:', error);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Admin Dashboard</h1>
      
      <div className="grid gap-8">
        <section className="p-6 bg-white rounded-lg shadow">
          <div className="space-y-4">
            <PhotoGallery />
          </div>
        </section>
      </div>
    </div>
  );
}