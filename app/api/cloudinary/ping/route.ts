import { NextResponse } from 'next/server';
import { configureCloudinary, cloudinaryEdgeApi, isEdgeRuntime } from '../config';

export const runtime = 'edge';

export async function GET() {
  try {
    let result;

    if (isEdgeRuntime) {
      // Use direct API calls in Edge Runtime
      result = await cloudinaryEdgeApi('/ping', {
        method: 'GET'
      });
    } else {
      // Use SDK in development
      const cloudinary = configureCloudinary();
      if (!cloudinary) {
        throw new Error('Failed to configure Cloudinary');
      }
      result = await cloudinary.api.ping();
    }

    return NextResponse.json({
      status: 'connected',
      message: `Connected to Cloudinary (Cloud: ${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME})`
    });
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
