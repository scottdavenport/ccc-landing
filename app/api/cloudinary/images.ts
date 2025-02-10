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

export async function GET(request: NextRequest) {
  try {
    // Verify credentials
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      const missing = [
        !cloudName && 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
        !apiKey && 'CLOUDINARY_API_KEY',
        !apiSecret && 'CLOUDINARY_API_SECRET'
      ].filter(Boolean);
      throw new Error(`Missing Cloudinary credentials: ${missing.join(', ')}`);
    }

    // Generate signature
    const timestamp = Math.round(Date.now() / 1000).toString();
    const signaturePayload = `prefix=sponsors&type=upload&timestamp=${timestamp}${apiSecret}`;
    const signature = await sha1(signaturePayload);

    // Make API request
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?prefix=sponsors&type=upload&timestamp=${timestamp}&signature=${signature}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${apiKey}:${signature}`)}`
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch images from Cloudinary');
    }

    const result = await response.json();
    return NextResponse.json({ images: result.resources.map((resource: any) => resource.public_id) });
  } catch (error) {
    console.error('Error fetching Cloudinary images:', error);
    return NextResponse.json({ message: 'Error fetching images' }, { status: 500 });
  }
}
