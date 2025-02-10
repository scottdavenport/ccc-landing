import { NextResponse } from 'next/server';
import { cloudinaryApi } from '@/lib/cloudinary/config';

export async function GET() {
  try {
    const result = await cloudinaryApi('/ping', {
      method: 'GET'
    });

    if (!result) {
      throw new Error('No response from Cloudinary');
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
