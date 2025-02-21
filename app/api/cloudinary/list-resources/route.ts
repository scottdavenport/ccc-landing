import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Log configuration (without secrets)
    console.log('Cloudinary Config:', {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      nodeEnv: process.env.NODE_ENV,
    });

    // Verify Cloudinary configuration
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      console.error('Missing Cloudinary configuration');
      return NextResponse.json(
        { error: 'Cloudinary configuration is incomplete' },
        { status: 500 }
      );
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log('Fetching Cloudinary resources...');
    
    // Check if we're being rate limited
    const rateLimit = await cloudinary.api.usage();
    if (rateLimit.rate_limit_remaining === 0) {
      console.warn('Rate limit reached, waiting until reset');
      return NextResponse.json(
        { error: 'Rate limit reached, please try again later' },
        { status: 429 }
      );
    }

    // Get only sponsor resources (optimized query)
    const resources = await cloudinary.api.resources({
      transformation: {
        width: 300,
        height: 300,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto'
      },
      type: 'upload',
      max_results: 100, // Reduced from 500 to improve performance
      prefix: 'sponsors',
      metadata: true,
      tags: true
    });

    console.log('Resources fetched:', {
      resourceCount: resources.resources?.length || 0,
      rate_limit_remaining: resources.rate_limit_remaining,
    });

    // Skip folder fetch to reduce API calls
    const folders = { folders: [] };

    const response = NextResponse.json({
      resources: resources.resources,
      folders: folders.folders,
      message: 'Successfully retrieved Cloudinary resources'
    });
    
    // Add cache control headers to prevent stale data
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    // Log detailed error information
    console.error('Cloudinary list resources error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      config: {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
        nodeEnv: process.env.NODE_ENV,
      }
    });

    // Return a more detailed error response
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to list resources',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
