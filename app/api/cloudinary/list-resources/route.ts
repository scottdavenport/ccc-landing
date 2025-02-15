import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    // Get all resources
    const resources = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500,
      prefix: 'sponsors' // This will look in the sponsors folder
    });

    // Get all folders
    const folders = await cloudinary.api.root_folders();

    return NextResponse.json({
      resources: resources.resources,
      folders: folders.folders,
      message: 'Successfully retrieved Cloudinary resources'
    });
  } catch (error) {
    console.error('Cloudinary list resources error:', error);
    return NextResponse.json(
      { error: 'Failed to list resources' },
      { status: 500 }
    );
  }
}
