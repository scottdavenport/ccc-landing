import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getSupabaseAdmin } from '@/utils/supabase-admin';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { Session } from '@supabase/supabase-js';

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
async function handleSponsorUpload(request: NextRequest): Promise<NextResponse> {
  let file: File | null = null;
  let metadataStr: string | null = null;
  let uploadResult: any = null;
  let session: Session | null = null;
  let sessionError: Error | null = null;

  try {
    // Initialize services for this request
    configureCloudinary();
    
    // Get admin client for database operations
    const adminClient = getSupabaseAdmin();
    
    // Log client configuration and test table access
    console.log('Testing Supabase admin access...');
    console.log('Admin client headers:', {
      hasAuthHeader: !!adminClient['headers']?.['Authorization'],
      hasApiKey: !!adminClient['headers']?.['apikey'],
      hasServiceRole: !!adminClient['headers']?.['x-supabase-auth-role']
    });
    
    // First verify we can access sponsor_levels
    const { data: levelData, error: levelError } = await adminClient
      .from('sponsor_levels')
      .select('id, name')
      .limit(1);
    
    if (levelError) {
      console.error('Error accessing sponsor_levels:', levelError);
      return NextResponse.json(
        { error: 'Database access error', details: levelError.message },
        { status: 403 }
      );
    }
    console.log('Successfully accessed sponsor_levels table, data:', levelData);
    
    // Then verify we can access sponsors table
    const { data: testSponsorData, error: testError } = await adminClient
      .from('sponsors')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('Error accessing sponsors table:', testError);
      return NextResponse.json(
        { error: 'Database access error', details: testError.message },
        { status: 403 }
      );
    }
    console.log('Successfully accessed sponsors table, data:', testSponsorData);
    
    console.log('Supabase admin access verified successfully');
    console.log('Supabase client configuration:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length,
      auth: {
        hasAdmin: !!adminClient.auth.admin,
        hasSession: !!session,
        sessionError,
      },
      tableAccess: {
        hasAccess: !!testSponsorData,
        error: testError
      }
    });

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

    // Log final client state before database operations
    console.log('Final client state before database operations:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      serviceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10),
      auth: {
        hasAdmin: !!adminClient.auth.admin,
        hasSession: !!session,
        sessionError,
      }
    });

    // Then verify we can write with admin client
    const testSponsor = { name: '_test_', level: '_test_', year: 2025, image_url: '_test_' };
    const { error: writeError } = await adminClient
      .from('sponsors')
      .insert([testSponsor])
      .select()
      .single();

    if (writeError) {
      console.error('Database write check failed:', writeError);
      throw new Error(`Database write check failed: ${writeError.message}`);
    }
    console.log('Database write access verified');

    // Clean up test data
    await adminClient
      .from('sponsors')
      .delete()
      .match(testSponsor);

    // Create sponsor in database
    console.log('Attempting to insert sponsor:', {
      name: metadata.name,
      level: metadata.level,
      year: metadata.year,
      hasCloudinaryId: !!uploadResult.public_id,
      hasImageUrl: !!uploadResult.secure_url
    });

    // Verify the sponsor level exists
    try {
      const { data: levelCheck, error: levelError } = await adminClient
        .from('sponsor_levels')
        .select('id')
        .eq('name', metadata.level)
        .single();
      
      console.log('Level check result:', { 
        hasLevel: !!levelCheck,
        error: levelError
      });
      
      if (levelError) {
        throw new Error(`Failed to verify sponsor level: ${levelError.message}`);
      }

      if (!levelCheck) {
        throw new Error(`Sponsor level not found: ${metadata.level}`);
      }
    } catch (e) {
      console.error('Error checking sponsor level:', e);
      throw e;
    }

    // Insert sponsor with admin client
    console.log('Attempting sponsor insert with admin client');
    
    const { data, error } = await adminClient
      .from('sponsors')
      .insert({
        name: metadata.name,
        level: metadata.level,
        year: metadata.year,
        cloudinary_id: uploadResult.public_id,
        image_url: uploadResult.secure_url,
        website: metadata.website
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from insert');
    }

    return NextResponse.json({ 
      message: 'Upload successful',
      sponsor: data
    });

  } catch (error) {
    // Log error details
    console.error('Upload error details:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
      metadata: metadataStr,
      file: file?.name,
      cloudinaryConfig: {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
      },
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      uploadResult: uploadResult ? 'Present' : 'Missing'
    });

    // Return error response
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Export the route handler
export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleSponsorUpload(request);
}
