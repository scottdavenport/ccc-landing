import { useState } from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { getCloudinaryImage } from '@/lib/cloudinary';
import { toast } from 'sonner';

export default function SponsorUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', 'sponsors'); // Unsigned upload preset
      formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (data.public_id) {
        setUploadedImageId(data.public_id);
        // Here you would typically save the sponsor info to your database
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image. Please try again.');
      setUploadedImageId(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button className="w-full px-4 py-2 bg-ccc-teal text-white rounded hover:bg-ccc-teal-dark transition-colors">
        Add New Sponsor
      </button>

      <div className="mt-4 space-y-4">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-ccc-teal file:text-white
              hover:file:bg-ccc-teal-dark
              file:cursor-pointer"
          />
        </div>

        {selectedFile && (
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="px-4 py-2 bg-ccc-teal text-white rounded hover:bg-ccc-teal-dark transition-colors disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Upload Sponsor Image'}
          </button>
        )}

        {uploadedImageId && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <div className="relative">
              {uploadedImageId && (
                <AdvancedImage
                  cldImg={getCloudinaryImage(uploadedImageId)}
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
