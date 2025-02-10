'use client';

import { useState, useEffect } from 'react';
import { AdvancedImage } from '@cloudinary/react';
import PhotoUploadModal from '@/components/admin/PhotoUploadModal';
import { useAuth } from '@/lib/auth/AuthContext';
import CloudinaryStatus from '@/components/CloudinaryStatus';
import { fetchCloudinaryImages, CldImage, type CloudinaryResource, getCloudinaryImage } from '@/lib/cloudinary';
import { motion } from 'framer-motion';

export default function PhotoUpload() {
  const { isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState<CloudinaryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const cloudinaryImages = await fetchCloudinaryImages();
        setImages(cloudinaryImages);
      } catch (error) {
        console.error('Failed to fetch images:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (!isAdmin) {
    return null;
  }

  const handleImageUploadComplete = (newImages: CloudinaryResource[]) => {
    setImages((prev) => [...newImages, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ccc-teal-light via-white to-ccc-teal-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900">Photo Gallery</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 text-sm font-medium text-white bg-ccc-teal rounded-md hover:bg-ccc-teal-dark transform hover:scale-105 transition-all duration-200 shadow-md"
            >
              Upload Photos
            </button>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <CloudinaryStatus />
          </div>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ccc-teal"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image) => (
                <motion.div
                  key={image.public_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                  onClick={() => setSelectedImage(image.public_id)}
                >
                  <div className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <CldImage
                      src={image.public_id}
                      width={400}
                      height={400}
                      alt={`Image ${image.public_id}`}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}


          <PhotoUploadModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onUploadComplete={handleImageUploadComplete}
          />

          {selectedImage && (
            <div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              onClick={() => setSelectedImage(null)}
            >
              <div className="max-w-4xl max-h-[90vh] p-4">
                {selectedImage && (
                  <AdvancedImage
                    cldImg={getCloudinaryImage(selectedImage)!
                      .format('auto')
                      .quality('auto')}
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
