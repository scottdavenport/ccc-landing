import { v2 as cloudinary } from 'cloudinary';

// Helper function to generate SHA-1 signature for Edge Runtime
async function sha1(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Configure Cloudinary for local development
export function configureCloudinary() {
  if (process.env.NODE_ENV === 'development') {
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
      api_key: process.env.CLOUDINARY_API_KEY || '',
      api_secret: process.env.CLOUDINARY_API_SECRET || ''
    });
    return cloudinary;
  }
  return null;
}

// Direct API call for Edge Runtime (production/preview)
export async function cloudinaryEdgeApi(path: string, options: {
  method?: string;
  body?: FormData;
  headers?: Record<string, string>;
}) {
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

  const timestamp = Math.round(Date.now() / 1000).toString();
  let signaturePayload = `timestamp=${timestamp}`;

  if (options.body instanceof FormData) {
    const params: Record<string, string> = {};
    options.body.forEach((value, key) => {
      if (typeof value === 'string') {
        params[key] = value;
      }
    });
    signaturePayload = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&') + apiSecret;
  } else {
    signaturePayload += apiSecret;
  }

  const signature = await sha1(signaturePayload);
  const headers = {
    'Authorization': `Basic ${btoa(`${apiKey}:${signature}`)}`,
    'X-Timestamp': timestamp,
    ...options.headers
  };

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}${path}`,
    {
      method: options.method || 'GET',
      headers,
      body: options.body
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to make Cloudinary API request');
  }

  return response.json();
}

// Re-install cloudinary package for local development
export const isEdgeRuntime = process.env.NEXT_RUNTIME === 'edge';
