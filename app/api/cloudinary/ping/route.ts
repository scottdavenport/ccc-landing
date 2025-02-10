import { NextResponse } from 'next/server';

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

    // Test Cloudinary connection by making a simple API call
    const timestamp = Math.round(Date.now() / 1000).toString();
    const signature = await sha1(timestamp + apiSecret);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/ping`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${apiKey}:${signature}`)}`,
          'X-Timestamp': timestamp
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to connect to Cloudinary');
    }
    
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
