// Hey! 👋 This tells Next.js that we want to use client-side features like clicking buttons
'use client';

// First, let's get all our special tools for managing photos and sponsors
// Think of these like different toy sets we'll use to build our admin playground
import PhotoUploadModal from '@/components/admin/PhotoUploadModal';  // This is like a magic box for adding new photos
import PhotoGallery from '@/components/admin/PhotoGallery';         // This shows all our photos like a photo album
import SponsorUpload from '@/components/admin/SponsorUpload';       // This helps us add new sponsors

// This is our special admin page where we can control everything!
export default function AdminPage() {
  return (
    // This is our main container - like a big toy box that keeps everything organized
    // mx-auto centers it, px-4 adds space on the sides, py-8 adds space top and bottom
    <div className="container mx-auto px-4 py-8">
      {/* This is our big title at the top */}
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* This grid helps us organize our sections neatly */}
      <div className="grid gap-8">
        {/* This is our Photo Management section - like a photo album maker! */}
        <section className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Photo Management</h2>
          <div className="space-y-4">
            {/* This is our magic upload button - when you click it, you can add new photos! */}
            <PhotoUploadModal 
              onUploadComplete={(images) => {
                // When we finish uploading, we'll see what we got
                console.log('Uploaded images:', images);
                // Then we refresh the page to see our new photos - like shaking an Etch A Sketch!
                window.location.reload();
              }}
            />
            {/* This shows all the photos we've uploaded - like a digital photo album */}
            <PhotoGallery />
          </div>
        </section>

        {/* This is our Sponsor Management section - where we can add new sponsors */}
        <section className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Sponsor Management</h2>
          {/* This is where we can add new sponsors to our website */}
          <SponsorUpload />
        </section>
      </div>
    </div>
  );
}