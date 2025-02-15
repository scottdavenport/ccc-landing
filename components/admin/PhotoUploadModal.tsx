'use client';

import { useCallback } from 'react';
import { CldUploadWidget } from 'next-cloudinary';

/**
 * Represents an uploaded image from Cloudinary
 */
interface UploadedImage {
  /** Unique identifier for the image in Cloudinary */
  public_id: string;
  /** Full URL to access the image */
  secure_url: string;
}

/**
 * Props for the PhotoUploadModal component
 */
interface PhotoUploadModalProps {
  /**
   * Callback function triggered when images are successfully uploaded
   * @param uploadedImages - Array of successfully uploaded images
   */
  onUploadComplete?: (uploadedImages: UploadedImage[]) => void;
}

/**
 * A modal component that handles photo uploads to Cloudinary
 * 
 * @remarks
 * This component uses the Cloudinary Upload Widget to handle file selection,
 * upload progress, and success/failure states. It's preconfigured with the
 * "sponsors" upload preset.
 * 
 * @example
 * ```tsx
 * function AdminPage() {
 *   const handleUpload = (images: UploadedImage[]) => {
 *     console.log('Uploaded images:', images);
 *   };
 * 
 *   return (
 *     <PhotoUploadModal onUploadComplete={handleUpload} />
 *   );
 * }
 * ```
 */
export default function PhotoUploadModal({ onUploadComplete }: PhotoUploadModalProps) {
  /**
   * Handles successful image uploads from Cloudinary
   * 
   * @param result - The upload result from Cloudinary
   * @internal
   */
  const onUploadSuccess = useCallback((result: any) => {
    if (result.event === 'success') {
      const uploadedImage: UploadedImage = {
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
