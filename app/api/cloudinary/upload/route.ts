import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Set runtime config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert File to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get transformation options from form data
    const angle = formData.get('angle');
    const crop = formData.get('crop');
    const x = formData.get('x');
    const y = formData.get('y');
    const width = formData.get('width');
    const height = formData.get('height');

    // Build upload options
    const uploadOptions: any = {
      resource_type: 'auto',
      folder: 'sponsors', // Store all sponsor images in a dedicated folder
      unique_filename: true,
      overwrite: true
    };

    // Add transformation options if present
    if (angle) {
      uploadOptions.angle = angle;
    }

    if (crop && x && y && width && height) {
      uploadOptions.crop = 'crop';
      uploadOptions.x = x;
      uploadOptions.y = y;
      uploadOptions.width = width;
      uploadOptions.height = height;
    }

    // Verify Cloudinary configuration
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

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error(error.message || 'Failed to upload to Cloudinary'));
            return;
          }
          resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
