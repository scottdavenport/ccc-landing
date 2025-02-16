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
    
    // Get all resources
    const resources = await cloudinary.api.resources({
      transformation: {
        width: 300,
        height: 300,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto'
      },
      type: 'upload',
      max_results: 500,
      prefix: 'sponsors', // This will look in the sponsors folder
      metadata: true, // Include metadata
      tags: true // Include tags in the response
    });

    console.log('Resources fetched:', {
      resourceCount: resources.resources?.length || 0,
      rate_limit_allowed: resources.rate_limit_allowed,
      rate_limit_remaining: resources.rate_limit_remaining,
      rate_limit_reset_at: resources.rate_limit_reset_at,
    });

    // Get all folders
    console.log('Fetching Cloudinary folders...');
    const folders = await cloudinary.api.root_folders();

    console.log('Folders fetched:', {
      folderCount: folders.folders?.length || 0
    });

    return NextResponse.json({
      resources: resources.resources,
      folders: folders.folders,
      message: 'Successfully retrieved Cloudinary resources'
    });
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
