import { NextRequest, NextResponse } from 'next/server';
import { configureCloudinary, cloudinaryEdgeApi, isEdgeRuntime } from '../config';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const uint8Array = new Uint8Array(bytes);
    const base64 = btoa(
      Array.from(uint8Array)
        .map(byte => String.fromCharCode(byte))
        .join('')
    );
    const dataURI = `data:${file.type};base64,${base64}`;

    // Get transformation options from form data
    const angle = formData.get('angle');
    const crop = formData.get('crop');
    const x = formData.get('x');
    const y = formData.get('y');
    const width = formData.get('width');
    const height = formData.get('height');

    // Build upload params
    const params: Record<string, string> = {
      folder: 'sponsors',
      unique_filename: 'true',
      overwrite: 'true'
    };

    // Add transformation options if present
    if (angle) params.angle = angle.toString();
    if (crop && x && y && width && height) {
      params.crop = 'crop';
      params.x = x.toString();
      params.y = y.toString();
      params.width = width.toString();
      params.height = height.toString();
    }

    // Prepare form data
    const formDataToSend = new FormData();
    formDataToSend.append('file', dataURI);
    Object.entries(params).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    let result;

    if (isEdgeRuntime) {
      // Use direct API calls in Edge Runtime
      result = await cloudinaryEdgeApi('/image/upload', {
        method: 'POST',
        body: formDataToSend
      });
    } else {
      // Use SDK in development
      const cloudinary = configureCloudinary();
      if (!cloudinary) {
        throw new Error('Failed to configure Cloudinary');
      }
      
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { ...params },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        // Convert base64 to buffer and pipe to upload stream
        const buffer = Buffer.from(base64, 'base64');
        uploadStream.end(buffer);
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image' },
      { status: 500 }
    );
  }
}
