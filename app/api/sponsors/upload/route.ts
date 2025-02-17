import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getSupabaseAdmin } from '@/utils/supabase-admin';

interface SponsorUploadMetadata {
  name: string;
  level: string;
  year: number;
  website?: string;
}

const configureCloudinary = () => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Missing Cloudinary configuration');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
};

// Use a single function to handle the request
async function handleSponsorUpload(request: NextRequest) {
  let file: File | null = null;
  let metadataStr: string | null = null;
  let uploadResult: any = null;

  try {
    // Initialize services for this request
    configureCloudinary();
    const supabase = getSupabaseAdmin();

    // Get form data
    const formData = await request.formData();
    file = formData.get('file') as File;
    metadataStr = formData.get('metadata') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Parse and validate metadata
    let metadata: SponsorUploadMetadata;
    try {
      metadata = JSON.parse(metadataStr);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid metadata format' },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'sponsors',
          public_id: `${metadata.name.toLowerCase().replace(/\\s+/g, '-')}-${metadata.year}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    if (!uploadResult || typeof uploadResult !== 'object' || !('secure_url' in uploadResult)) {
      throw new Error('Failed to upload to Cloudinary');
    }

    // Create sponsor in database
    const { data, error } = await supabase
      .from('sponsors')
      .insert({
        name: metadata.name,
        level: metadata.level,
        year: metadata.year,
        cloudinary_public_id: uploadResult.public_id,
        image_url: uploadResult.secure_url,
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Upload error details:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
      metadata: metadataStr,
      file: file?.name,
      cloudinaryConfig: {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      },
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      uploadResult: uploadResult ? 'Present' : 'Missing',
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Export the route handler
export async function POST(request: NextRequest) {
  return handleSponsorUpload(request);
}
