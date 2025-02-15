// Hi! 👋 This tells Next.js we want to use special features like uploading files
'use client';

// First, let's get our tools ready!
import { useCallback } from 'react';  // This helps us make our upload button work efficiently
import { CldUploadWidget } from 'next-cloudinary';  // This is our special photo upload tool from Cloudinary

// This is our magic photo upload button! 📷
// It's like a special mailbox where you can put photos, and they get sent to our photo storage
export default function PhotoUploadModal({ 
  // When we're done uploading, we'll tell someone about our new photos
  onUploadComplete }: { 
    onUploadComplete?: (uploadedImages: { 
      public_id: string;    // Each photo gets a special name (like a tracking number)
      secure_url: string;   // And a special web address where we can find it
    }[]) => void 
}) {
  // This is what happens when a photo uploads successfully
  // It's like getting a delivery confirmation for your mail
  const onUploadSuccess = useCallback((result: any) => {
    // If the upload worked...
    if (result.event === 'success') {
      // We'll make a note about our new photo
      const uploadedImage = {
        public_id: result.info.public_id,     // The photo's special name
        secure_url: result.info.secure_url    // Where to find the photo
      };
      // Tell everyone the good news - we have a new photo!
      onUploadComplete?.([uploadedImage]);
    }
  }, [onUploadComplete]);

  // Here's what our upload button looks like
  return (
    // This is Cloudinary's special upload tool
    <CldUploadWidget
      uploadPreset="sponsors"  // This tells Cloudinary where to put our photos
      onSuccess={onUploadSuccess}  // What to do when the upload works
    >
      {/* This is our pretty upload button */}
      {({ open }) => (
        <button
          onClick={() => open()}  // When clicked, open the upload window
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ccc-teal hover:bg-ccc-teal/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ccc-teal"
        >
          Upload Photos
        </button>
      )}
    </CldUploadWidget>
  );
}
