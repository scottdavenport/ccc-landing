import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '',
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || ''
});

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  console.log('Starting Cloudinary API request...');
  try {
    // Log config for debugging
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

    console.log('Cloudinary config:', {
      cloud_name: cloudName,
      api_key: apiKey?.slice(0, 5),
      api_secret: apiSecret?.slice(0, 5),
      has_cloud_name: !!cloudName,
      has_api_key: !!apiKey,
      has_api_secret: !!apiSecret
    });

    // Verify credentials
    if (!cloudName || !apiKey || !apiSecret) {
      const missing = [
        !cloudName && 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
        !apiKey && 'NEXT_PUBLIC_CLOUDINARY_API_KEY',
        !apiSecret && 'NEXT_PUBLIC_CLOUDINARY_API_SECRET'
      ].filter(Boolean);
      throw new Error(`Missing Cloudinary credentials: ${missing.join(', ')}`);
    }

    try {
      console.log('Starting Cloudinary search...');
      // Test Cloudinary connection first
      try {
        const testResult = await cloudinary.api.ping();
        console.log('Cloudinary connection test:', testResult);
      } catch (pingError) {
        console.error('Cloudinary connection test failed:', {
          error: pingError,
          message: pingError.message,
          details: pingError.error?.message
        });
        throw new Error(`Cloudinary connection failed: ${pingError.message}`);
      }

      // Use Admin API search
      const result = await cloudinary.search
        .expression('resource_type:image')
        .with_field('tags')
        .with_field('context')
        .max_results(100)
        .execute();

      console.log('Cloudinary search result:', {
        total: result.total_count,
        time: result.time,
        status: 'success',
        resources: result.resources?.length || 0
      });

      return NextResponse.json(result, { headers: corsHeaders });
    } catch (searchError: any) {
      console.error('Cloudinary search error:', {
        error: searchError,
        message: searchError.message,
        details: searchError.error?.message,
        type: typeof searchError,
        keys: Object.keys(searchError)
      });
      throw searchError;
    }
  } catch (error) {
    console.error('Error in Cloudinary API route:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
