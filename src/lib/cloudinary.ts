import { Cloudinary } from '@cloudinary/url-gen';
import { Resize } from '@cloudinary/url-gen/actions/resize';

// Create a Cloudinary instance and set your cloud name.
const cloudinary = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }
});

export const getCloudinaryImage = (publicId: string) => {
  return cloudinary
    .image(publicId)
    .resize(Resize.scale().width(200).height(200))
    .format('auto')
    .quality('auto');
};

export const fetchCloudinaryImages = async () => {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
    const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Missing Cloudinary credentials');
    }

    const auth = btoa(`${apiKey}:${apiSecret}`);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          expression: 'folder=sponsors',
          max_results: 100
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch images from Cloudinary');
    }

    const data = await response.json();
    return data.resources.map((resource: { public_id: string }) => resource.public_id);
  } catch (error) {
    console.error('Error fetching Cloudinary images:', error);
    throw error;
  }
};

export default cloudinary;
