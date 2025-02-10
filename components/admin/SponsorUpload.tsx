'use client';

import { useState } from 'react';
import { CldUploadWidget, CldImage } from 'next-cloudinary';
import { toast } from 'sonner';

export default function SponsorUpload() {
  const [uploadedImage, setUploadedImage] = useState<{ public_id: string; secure_url: string } | null>(null);

  const handleUpload = (result: any) => {
    if (result.event === 'success') {
      setUploadedImage({
        public_id: result.info.public_id,
        secure_url: result.info.secure_url
      });
      toast.success('Image uploaded successfully!');
    }
  };

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
