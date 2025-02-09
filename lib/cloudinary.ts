import { Cloudinary } from '@cloudinary/url-gen';
import { Resize } from '@cloudinary/url-gen/actions/resize';

const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

if (!cloudinaryCloudName) {
  throw new Error('Missing Cloudinary cloud name');
}

// Create a Cloudinary instance and set your cloud name.
const cloudinary = new Cloudinary({
  cloud: {
    cloudName: cloudinaryCloudName
  },
  url: {
    secure: true, // Force HTTPS
    analytics: false, // Disable analytics
    privateCdn: false, // Use Cloudinary's shared domain
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
    // Always use the server endpoint to avoid CORS issues
    // Make request to the API endpoint
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
