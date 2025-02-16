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
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Log environment state
  console.log('Sponsor Upload Environment:', {
    vercelEnv: process.env.VERCEL_ENV || 'development',
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasCloudinaryConfig: !!(process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
    supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')?.[0] || 'not-set',
  });
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

    if (!metadata) throw new Error('Metadata not available');

    // Validate Supabase connection and schema first
    try {
      // Try to initialize database schema with retries
      let initSuccess = false;
      const maxRetries = process.env.VERCEL_ENV === 'preview' ? 5 : 3;
      const baseDelay = process.env.VERCEL_ENV === 'preview' ? 2000 : 1000;

      for (let i = 0; i < maxRetries; i++) {
        try {
          // Try direct schema refresh first
          const refreshSuccess = await refreshSchemaCache();
          if (refreshSuccess) {
            console.log('Schema cache refreshed successfully');
            initSuccess = true;
            break;
          }

          // Fallback to init-db endpoint
          const initResponse = await fetch(new URL('/api/init-db', request.url));
          if (initResponse.ok) {
            console.log('Schema initialized via init-db endpoint');
            initSuccess = true;
            break;
          }

          const responseText = await initResponse.text();
          console.warn(`Schema init attempt ${i + 1}/${maxRetries} failed:`, {
            status: initResponse.status,
            response: responseText,
            attempt: i + 1,
            maxRetries,
            environment: process.env.VERCEL_ENV || 'development'
          });

          // Wait with exponential backoff
          if (i < maxRetries - 1) {
            const delay = baseDelay * Math.pow(2, i);
            console.log(`Waiting ${delay}ms before next attempt...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        } catch (e) {
          console.error(`Schema init attempt ${i + 1}/${maxRetries} error:`, {
            error: e,
            attempt: i + 1,
            maxRetries,
            environment: process.env.VERCEL_ENV || 'development'
          });
          if (i === maxRetries - 1) throw e;
        }
      }

      if (!initSuccess) {
        throw new Error('Failed to initialize database schema after retries');
      }

      // Test sponsor creation with retries
      let testSuccess = false;
      for (let i = 0; i < 3; i++) {
        try {
          await createSponsor({
            name: metadata.name,
            level: metadata.level,
            year: metadata.year,
            website_url: metadata.website || undefined,
            cloudinary_public_id: 'test-id',
            image_url: 'https://test-url.com',
          }).catch((error) => {
            // Only throw if it's not a duplicate error
            if (!error.message?.includes('duplicate')) throw error;
          });
          testSuccess = true;
          break;
        } catch (e) {
          console.warn(`Sponsor test attempt ${i + 1}/3 failed:`, e);
          if (i < 2) await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          else throw e;
        }
      }

      if (!testSuccess) {
        throw new Error('Failed to validate sponsor creation after retries');
      }
    } catch (error) {
      console.error('Database validation failed:', error);
      return NextResponse.json(
        { error: 'Database not ready. Please try again.' },
        { status: 503 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary with metadata
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
      name: validMetadata.name,
      level: validMetadata.level,
      year: validMetadata.year,
      website_url: validMetadata.website || undefined,
      cloudinary_public_id: result.public_id,
      image_url: result.secure_url, // Always use secure URL
    }).catch(async (error) => {
      // If database insert fails, delete the uploaded image
      try {
        await cloudinary.uploader.destroy(result.public_id);
        console.log('Cleaned up orphaned Cloudinary image:', result.public_id);
      } catch (cleanupError) {
        console.error('Failed to cleanup Cloudinary image:', cleanupError);
      }
      throw error; // Re-throw the original error
    });

    return NextResponse.json(sponsor);
  } catch (error) {
    // If we uploaded to Cloudinary but failed elsewhere, cleanup
    if (uploadResult?.public_id) {
      try {
        await cloudinary.uploader.destroy(uploadResult.public_id);
        console.log('Cleaned up orphaned Cloudinary image:', uploadResult.public_id);
      } catch (cleanupError) {
        console.error('Failed to cleanup Cloudinary image:', cleanupError);
      }
    }

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

    // Return appropriate error message
    return NextResponse.json(
      { 
        error: errorMessage.includes('schema cache') 
          ? 'Database not ready. Please try again.' 
          : 'Failed to upload sponsor'
      },
      { status: 503 }
    );
  }
}
