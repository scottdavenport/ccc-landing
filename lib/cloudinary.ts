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
    const response = await fetch('/api/cloudinary', {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch images from Cloudinary');
    }

    const data = await response.json();
    if (!data.resources || !Array.isArray(data.resources)) {
      throw new Error('Invalid response format from Cloudinary');
    }

    return data.resources;
  } catch (error) {
    console.error('Error fetching Cloudinary images:', error);
    throw error;
  }
};

export { CldImage };
