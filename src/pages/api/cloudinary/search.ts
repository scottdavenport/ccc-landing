import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Log environment variables for debugging (excluding secrets)
    console.log('Environment check:', {
      hasCloudName: !!process.env.VITE_CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.VITE_CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.VITE_CLOUDINARY_API_SECRET,
      nodeEnv: process.env.NODE_ENV
    });

    // Use VITE_ prefixed variables in development
    const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.VITE_CLOUDINARY_API_KEY;
    const apiSecret = process.env.VITE_CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary credentials. Available env vars:', Object.keys(process.env));
      throw new Error('Missing Cloudinary credentials');
    }

    console.log('Making Cloudinary API request...');
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`
        },
        body: JSON.stringify({
          expression: 'folder=sponsors',
          max_results: 100
        })
      }
    );
    
    console.log('Cloudinary API response status:', response.status);

    if (!response.ok) {
      throw new Error(`Cloudinary API error: ${response.statusText}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in Cloudinary API route:', error);
    return res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
