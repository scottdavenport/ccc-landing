import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getSupabaseClient } from '@/utils/supabase-admin';

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
    
    // Get Supabase client and verify service role
    const supabase = getSupabaseClient();
    
    // Log client configuration for debugging
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Supabase client configuration:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length,
      auth: {
        hasAdmin: !!supabase.auth.admin,
        hasSession: !!session,
        sessionError,
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

    // Log Supabase client state before insert
    console.log('Supabase client check before insert:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      serviceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10),
      auth: supabase.auth.admin !== undefined ? 'Has admin API' : 'No admin API'
    });

    // Verify database connection
    try {
      const { error: healthError } = await supabase.from('sponsor_levels').select('count').single();
      if (healthError) {
        console.error('Database health check failed:', healthError);
      } else {
        console.log('Database connection verified');
      }
    } catch (e) {
      console.error('Error checking database health:', e);
    }

    // Create sponsor in database
    console.log('Attempting to insert sponsor:', {
      name: metadata.name,
      level: metadata.level,
      year: metadata.year,
      hasCloudinaryId: !!uploadResult.public_id,
      hasImageUrl: !!uploadResult.secure_url
    });

    // Verify service role access with explicit RLS test
    try {
      const { data: rls_test, error: rls_error } = await supabase.rpc('check_service_role_access');
      console.log('Service role access check:', { result: rls_test, error: rls_error });
      
      if (rls_error) {
        throw new Error(`Service role access check failed: ${rls_error.message}`);
      }
    } catch (e) {
      console.error('Service role verification failed:', e);
      throw e;
    }
    
    // Try a dry-run select with explicit service role header
    try {
      const { data: levelCheck, error: levelError } = await supabase
        .from('sponsor_levels')
        .select('id')
        .eq('id', metadata.level)
        .single();
      
      console.log('Level check result:', { 
        hasLevel: !!levelCheck,
        error: levelError
      });
      
      if (levelError) {
        throw new Error(`Failed to verify sponsor level: ${levelError.message}`);
      }
    } catch (e) {
      console.error('Error checking sponsor level:', e);
      throw e;
    }

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
      console.error('Supabase insert error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
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
