import { useState } from 'react';
import PhotoUploadModal from '@/components/admin/PhotoUploadModal';
import { useAuth } from '@/lib/auth/AuthContext';
import CloudinaryStatus from '@/components/CloudinaryStatus';

export default function PhotoUpload() {
  const { isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Photo Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-ccc-teal rounded-md hover:bg-ccc-teal-dark"
          >
            Upload Photos
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <CloudinaryStatus />
        </div>

        <PhotoUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}
