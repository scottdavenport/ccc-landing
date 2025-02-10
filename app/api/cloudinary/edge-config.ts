import { NextResponse } from 'next/server';

const CLOUDINARY_API_BASE = 'https://api.cloudinary.com/v1_1';

export async function generateAuthSignature(timestamp: number): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  if (!cloudName || !apiSecret) {
    throw new Error('Missing Cloudinary credentials');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(`timestamp=${timestamp}${apiSecret}`);
  const hash = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function cloudinaryEdgeApi(path: string, options: RequestInit = {}) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  
  if (!cloudName || !apiKey) {
    throw new Error('Missing Cloudinary credentials');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = await generateAuthSignature(timestamp);

  const url = new URL(`${CLOUDINARY_API_BASE}/${cloudName}${path}`);
  url.searchParams.append('timestamp', timestamp.toString());
  url.searchParams.append('api_key', apiKey);
  url.searchParams.append('signature', signature);

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Cloudinary API error: ${response.statusText}`);
  }

  return response.json();
}

export async function searchCloudinaryResources(options: { 
  expression?: string;
  max_results?: number;
  next_cursor?: string;
}) {
  try {
    const result = await cloudinaryEdgeApi('/resources/search', {
      method: 'POST',
      body: JSON.stringify(options),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error searching Cloudinary resources:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
