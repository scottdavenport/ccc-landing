import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'sponsors', // This matches your upload_preset
      max_results: 100,
    });

    return res.status(200).json({ images: result.resources.map(resource => resource.public_id) });
  } catch (error) {
    console.error('Error fetching Cloudinary images:', error);
    return res.status(500).json({ message: 'Error fetching images' });
  }
}
