import { v2 as cloudinaryNode } from 'cloudinary';

// Initialize Cloudinary configuration
export function initCloudinary() {
  cloudinaryNode.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinaryNode;
}

// Helper function to generate SHA-1 signature
async function sha1(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate Cloudinary API signature
async function generateSignature(params: Record<string, string>, apiSecret: string): Promise<string> {
  const sortedKeys = Object.keys(params).sort();
  const signatureString = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join('&') + apiSecret;

  return sha1(signatureString);
}

// Validate Cloudinary credentials
function validateCredentials() {
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

  return { cloudName, apiKey, apiSecret };
}

// Make Cloudinary API request (works in both Edge and Node.js environments)
export async function cloudinaryApi(path: string, options: {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}) {
  const { cloudName, apiKey, apiSecret } = validateCredentials();
  
  // Basic auth for admin API endpoints
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  
  const headers = {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json',
    ...options.headers
  };

  const url = `https://api.cloudinary.com/v1_1/${cloudName}${path}`;
  
  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      ...(options.body && { body: JSON.stringify(options.body) })
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Cloudinary response:', responseText);
      throw new Error(`Invalid JSON response from Cloudinary: ${responseText.slice(0, 100)}...`);
    }

    if (!response.ok) {
      throw new Error(data.error?.message || data.message || `Cloudinary API error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Cloudinary API error:', error);
    throw error;
  }
}
