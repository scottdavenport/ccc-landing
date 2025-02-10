import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert File to buffer
    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

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
      folder: 'sponsors',
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

    // Upload to Cloudinary using fetch
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, ...uploadOptions },
      cloudinaryConfig.api_secret
    );

    const formDataToSend = new FormData();
    formDataToSend.append('file', dataURI);
    formDataToSend.append('timestamp', timestamp.toString());
    formDataToSend.append('signature', signature);
    formDataToSend.append('api_key', cloudinaryConfig.api_key);
    
    Object.entries(uploadOptions).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formDataToSend.append(key, value.toString());
      }
    });

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/image/upload`,
      {
        method: 'POST',
        body: formDataToSend
      }
    );

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload to Cloudinary');
    }

    const result = await uploadResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
