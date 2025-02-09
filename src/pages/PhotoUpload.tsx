import { useState, useEffect } from 'react';
import PhotoUploadModal from '@/components/admin/PhotoUploadModal';
import { useAuth } from '@/lib/auth/AuthContext';
import CloudinaryStatus from '@/components/CloudinaryStatus';
import { AdvancedImage, lazyload } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { getCloudinaryImage, fetchCloudinaryImages } from '@/lib/cloudinary';
import { motion } from 'framer-motion';

export default function PhotoUpload() {
  const { isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const cloudinaryImages = await fetchCloudinaryImages();
        setImages(cloudinaryImages);
      } catch (error) {
        console.error('Failed to fetch images:', error);
      }
    };

    fetchImages();
  }, []);

  if (!isAdmin) {
    return null;
  }

  const handleImageUploadComplete = (newImages: string[]) => {
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((publicId, index) => (
              <motion.div
                key={publicId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                  <AdvancedImage
                    cldImg={getCloudinaryImage(publicId).resize(fill().width(400).height(400))}
                    plugins={[lazyload()]}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    onClick={() => setSelectedImage(publicId)}
                  />
                </div>
              </motion.div>
            ))}
          </div>

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
                <AdvancedImage
                  cldImg={getCloudinaryImage(selectedImage)}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
