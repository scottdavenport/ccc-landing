'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CloudinaryResource } from '@/lib/cloudinary';

export default function PhotoGallery() {
  const [images, setImages] = useState<CloudinaryResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/cloudinary/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            expression: 'folder=sponsors',
            max_results: 100
          })
        });
        
        if (!response.ok) throw new Error('Failed to fetch images');
        
        const data = await response.json();
        setImages(data.resources || []);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.public_id} className="relative aspect-square">
          <Image
            src={image.secure_url}
            alt="Uploaded photo"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  );
}