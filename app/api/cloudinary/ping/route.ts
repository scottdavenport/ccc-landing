import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Set runtime config
export const runtime = 'edge';

// Configure Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
};

cloudinary.config(cloudinaryConfig);

export async function GET() {
  try {
    // Verify required environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      const missingVars = [
        !cloudName && 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
        !apiKey && 'CLOUDINARY_API_KEY',
        !apiSecret && 'CLOUDINARY_API_SECRET'
      ].filter(Boolean);

      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Test Cloudinary connection by trying to get account info
    const result = await cloudinary.api.ping();
    
    return NextResponse.json({ status: 'connected', message: `Connected to Cloudinary (Cloud: ${cloudName})` });
  } catch (error) {
    console.error('Cloudinary ping error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to connect to Cloudinary'
      },
      { status: 500 }
    );
  }
}
