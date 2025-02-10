import { CldImage } from 'next-cloudinary';

// Verify Cloudinary configuration
if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
  throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is required');
}

export interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  created_at: string;
}

export const fetchCloudinaryImages = async (): Promise<CloudinaryResource[]> => {
  try {
    const response = await fetch('/api/cloudinary/search', {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        expression: 'folder=sponsors',
        max_results: 100
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch images from Cloudinary');
    }

    const data = await response.json();
    if (!data.resources || !Array.isArray(data.resources)) {
      console.error('Invalid Cloudinary response:', data);
      return [];
    }

    return data.resources;
  } catch (error) {
    console.error('Error fetching Cloudinary images:', error);
    return [];
  }
};

import { Cloudinary } from '@cloudinary/url-gen';

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  }
});

export const getCloudinaryImage = (publicId: string | null) => {
  if (!publicId) return null;
  return cloudinary.image(publicId);
};

export { CldImage };
