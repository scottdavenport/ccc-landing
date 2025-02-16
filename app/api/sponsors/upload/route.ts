import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { createSponsor } from '@/utils/database';
import { refreshSchemaCache } from '@/utils/supabase';

interface SponsorUploadMetadata {
  name: string;
  level: string;
  year: number;
  website?: string;
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Handles sponsor image uploads with metadata
 * 
 * @param request - The incoming request containing the image file and metadata
 * @returns Response with the upload result
 */
export async function POST(request: NextRequest) {
  let file: File | null = null;
  let metadataStr: string | null = null;
  let metadata: SponsorUploadMetadata | null = null;
  let uploadResult: any = null;

  try {
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
    try {
      metadata = JSON.parse(metadataStr);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid metadata format' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary with metadata
    if (!metadata) throw new Error('Metadata not available');
    
    // TypeScript type assertion since we've checked metadata is not null
    const validMetadata = metadata as SponsorUploadMetadata;
    
    uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'sponsors',
          resource_type: 'image',
          // Use sponsor name for better identification
          public_id: `${validMetadata.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${validMetadata.year}`,
          display_name: `${validMetadata.name} (Sponsor ${validMetadata.year})`,
          // Store original and create thumbnails
          eager: [
            { width: 500, height: 375, crop: 'fill', fetch_format: 'auto', quality: 'auto:good' },
            { width: 300, height: 300, crop: 'fill', fetch_format: 'auto', quality: 'auto:good' }
          ],
          // Add metadata as Cloudinary context
          context: {
            level: validMetadata.level,
            name: validMetadata.name,
            year: validMetadata.year.toString(),
            website: validMetadata.website || '',
          },
          // Add tags for easier filtering
          tags: [validMetadata.level, `year_${validMetadata.year}`],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Write buffer to stream
      const bufferStream = require('stream').Readable.from(buffer);
      bufferStream.pipe(uploadStream);
    });

    // Create sponsor in database with essential data
    const result = uploadResult as any;
    const sponsor = await createSponsor({
      name: metadata.name,
      level: metadata.level,
      year: metadata.year,
      website_url: metadata.website || undefined,
      cloudinary_public_id: result.public_id,
      image_url: result.secure_url, // Always use secure URL
    });

    return NextResponse.json(sponsor);
  } catch (error) {
    console.error('Upload error details:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
      metadata: metadataStr || 'No metadata provided',
      file: file?.name || 'No file provided',
      cloudinaryConfig: {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      },
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    });

    // Log detailed error information
    const errorMessage = error instanceof Error ? error.message : '';
    console.error('Upload error details:', {
      error,
      errorMessage,
      errorStack: error instanceof Error ? error.stack : undefined,
      metadata: metadataStr || 'No metadata provided',
      file: file?.name || 'No file provided',
      cloudinaryConfig: {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      },
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      uploadResult: uploadResult ? 'Present' : 'Not present',
    });

    // If it's a schema cache issue, try to initialize the schema
    if (errorMessage.includes('schema cache')) {
      try {
        // Try to initialize the database schema
        const initResponse = await fetch(new URL('/api/init-db', request.url));
        if (!initResponse.ok) {
          throw new Error('Failed to initialize database schema');
        }

        // If we have all the necessary data, retry the sponsor creation
        if (metadata && uploadResult) {
          const sponsor = await createSponsor({
            name: metadata.name,
            level: metadata.level,
            year: metadata.year,
            website_url: metadata.website || undefined,
            cloudinary_public_id: uploadResult.public_id,
            image_url: uploadResult.secure_url,
          });
          return NextResponse.json(sponsor);
        }
      } catch (retryError) {
        console.error('Failed to retry after schema initialization:', retryError);
      }
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image' },
      { status: 500 }
    );
  }
}
