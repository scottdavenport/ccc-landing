'use client';

import PhotoUploadModal from '@/components/admin/PhotoUploadModal';
import SponsorUpload from '@/components/admin/SponsorUpload';

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid gap-8">
        <section className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Photo Management</h2>
          <PhotoUploadModal 
            onUploadComplete={(images) => {
              console.log('Uploaded images:', images);
            }}
          />
        </section>

        <section className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Sponsor Management</h2>
          <SponsorUpload />
        </section>
      </div>
    </div>
  );
}