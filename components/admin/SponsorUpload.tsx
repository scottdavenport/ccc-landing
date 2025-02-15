'use client';

import { useState } from 'react';
import { CldUploadWidget, CldImage } from 'next-cloudinary';
import { toast } from 'sonner';

/**
 * Represents an uploaded sponsor image from Cloudinary
 */
interface SponsorImage {
  /** Unique identifier for the image in Cloudinary */
  public_id: string;
  /** Full URL to access the image */
  secure_url: string;
}

/**
 * A component that handles sponsor logo uploads and displays a preview
 * 
 * @remarks
 * This component provides a complete upload experience for sponsor logos:
 * - Handles image upload through Cloudinary's widget
 * - Shows a preview of the uploaded image
 * - Provides user feedback through toast notifications
 * - Maintains aspect ratio and consistent sizing
 * 
 * @example
 * ```tsx
 * function SponsorManagement() {
 *   return (
 *     <div>
 *       <h2>Add New Sponsor</h2>
 *       <SponsorUpload />
 *     </div>
 *   );
 * }
 * ```
 */
export default function SponsorUpload() {
  /**
   * State to track the currently uploaded image
   * Null when no image is uploaded
   */
  const [uploadedImage, setUploadedImage] = useState<SponsorImage | null>(null);

  /**
   * Handles successful image uploads from Cloudinary
   * 
   * @param result - The upload result from Cloudinary
   * @internal
   */
  const handleUpload = (result: any) => {
    if (result.event === 'success') {
      const newImage: SponsorImage = {
        public_id: result.info.public_id,
        secure_url: result.info.secure_url
      };
      setUploadedImage(newImage);
      toast.success('Image uploaded successfully!');
    }
  };

  // Only render preview if an image has been uploaded
  return uploadedImage ? (
    <div className="mt-4">
      <p className="text-sm text-gray-600 mb-2">Preview:</p>
      <div className="relative">
        <CldImage
          src={uploadedImage.public_id}
          width={400}
          height={400}
          alt="Uploaded sponsor image"
          className="max-w-full h-auto rounded-lg shadow-md"
        />
      </div>
    </div>
  ) : null;
}
