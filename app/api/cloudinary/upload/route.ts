import { NextRequest, NextResponse } from 'next/server';
import { cloudinaryApi } from '@/lib/cloudinary/config';

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
    const uploadParams: Record<string, any> = {
      file: dataURI,
      folder: 'sponsors',
      unique_filename: true,
      overwrite: true
    };

    // Add transformation options if present
    if (angle) uploadParams.angle = parseInt(angle.toString(), 10);
    if (crop && x && y && width && height) {
      uploadParams.crop = 'crop';
      uploadParams.x = parseInt(x.toString(), 10);
      uploadParams.y = parseInt(y.toString(), 10);
      uploadParams.width = parseInt(width.toString(), 10);
      uploadParams.height = parseInt(height.toString(), 10);
    }

    // Upload to Cloudinary
    try {
      const result = await cloudinaryApi('/image/upload', {
        method: 'POST',
        body: uploadParams
      });

      return NextResponse.json(result);
    } catch (error) {
      console.error('Upload error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to upload file' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 400 }
    );
  }
}
