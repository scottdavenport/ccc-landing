// Hey! 👋 This tells Next.js that we want to use client-side features like clicking buttons
'use client';

import PhotoUploadModal from '@/components/admin/PhotoUploadModal';
import PhotoGallery from '@/components/admin/PhotoGallery';
import { SponsorDialog } from '@/components/admin/SponsorDialog';

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid gap-8">
        <section className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Photo Management</h2>
          <div className="space-y-4">
            <PhotoUploadModal 
              onUploadComplete={(images) => {
                console.log('Uploaded images:', images);
                window.location.reload();
              }}
            />
            <PhotoGallery />
          </div>
        </section>

        <section className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Sponsor Management</h2>
            <SponsorDialog />
          </div>
          {/* TODO: Add sponsor list/grid here */}
        </section>
      </div>
    </div>
  );
}