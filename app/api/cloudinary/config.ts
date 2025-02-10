// Helper function to generate SHA-1 signature for Edge Runtime
async function sha1(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate Cloudinary API signature for Edge Runtime
async function generateSignature(params: Record<string, string>): Promise<string> {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) throw new Error('Missing Cloudinary API secret');

  const sortedKeys = Object.keys(params).sort();
  const signatureString = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join('&') + apiSecret;

  return sha1(signatureString);
}

// Direct API call for Edge Runtime
export async function cloudinaryEdgeApi(path: string, options: {
  method?: string;
  body?: any;
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
  const params: Record<string, string> = {
    timestamp,
    ...((typeof options.body === 'object' && options.body !== null) ? options.body : {})
  };

  const signature = await generateSignature(params);
  const queryString = new URLSearchParams({
    ...params,
    api_key: apiKey,
    signature
  }).toString();

  const url = `https://api.cloudinary.com/v1_1/${cloudName}${path}${path.includes('?') ? '&' : '?'}${queryString}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    ...(options.body && { body: JSON.stringify(options.body) })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
    throw new Error(error.message || `Failed to make Cloudinary API request: ${response.status}`);
  }

  return response.json();
}

// Helper function to validate Cloudinary credentials
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
