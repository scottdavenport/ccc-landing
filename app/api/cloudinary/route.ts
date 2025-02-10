import { NextResponse } from 'next/server';

// Set runtime config
export const runtime = 'edge';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Helper function to generate SHA-1 signature
async function sha1(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
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
      const signaturePayload = `timestamp=${timestamp}${apiSecret}`;
      const signature = await sha1(signaturePayload);

      // Make API request
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
      // Return success response
      return NextResponse.json({ status: 'connected', message: `Connected to Cloudinary (Cloud: ${cloudName})` }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Cloudinary error:', {
      error: error,
      message: error.message
    });

    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}
      stack: error.stack,
      cause: error.cause
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
