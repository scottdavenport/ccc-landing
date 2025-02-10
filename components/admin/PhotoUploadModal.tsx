'use client';

import { useCallback } from 'react';
import { CldUploadWidget } from 'next-cloudinary';

export default function PhotoUploadModal({ onUploadComplete }: { onUploadComplete?: (uploadedImages: { public_id: string; secure_url: string }[]) => void }) {
  const onUploadSuccess = useCallback((result: any) => {
    if (result.event === 'success') {
      const uploadedImage = {
        public_id: result.info.public_id,
        secure_url: result.info.secure_url
      };
      onUploadComplete?.([uploadedImage]);
    }
  }, [onUploadComplete]);

  return (
    <CldUploadWidget
      uploadPreset="sponsors"
      onSuccess={onUploadSuccess}
    >
      {({ open }) => (
        <button
          onClick={() => open()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ccc-teal hover:bg-ccc-teal/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ccc-teal"
        >
          Upload Photos
        </button>
      )}
    </CldUploadWidget>
  );
}
