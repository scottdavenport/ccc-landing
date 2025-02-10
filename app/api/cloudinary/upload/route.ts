import { NextRequest, NextResponse } from 'next/server';

// Set runtime config
export const runtime = 'edge';

// Helper function to generate SHA-1 signature
async function sha1(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

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

    // Generate signature
    const timestamp = Math.round(Date.now() / 1000).toString();
    const paramsToSign = { ...params, timestamp };
    const signaturePayload = Object.entries(paramsToSign)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&') + apiSecret;

    const signature = await sha1(signaturePayload);

    // Prepare form data
    const formDataToSend = new FormData();
    formDataToSend.append('file', dataURI);
    formDataToSend.append('api_key', apiKey);
    formDataToSend.append('timestamp', timestamp);
    formDataToSend.append('signature', signature);

    // Add all params to form data
    Object.entries(params).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    // Upload to Cloudinary
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formDataToSend
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      throw new Error(error.message || 'Failed to upload to Cloudinary');
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
