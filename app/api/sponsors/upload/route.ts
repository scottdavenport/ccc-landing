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
    
    // Log client configuration and test table access
    console.log('Testing Supabase service role access...');
    
    // First verify we can access sponsor_levels
    const { data: levelData, error: levelError } = await supabase
      .from('sponsor_levels')
      .select('id, name')
      .limit(1);
    
    if (levelError) {
      console.error('Error accessing sponsor_levels:', levelError);
      throw new Error(`Service role access denied to sponsor_levels: ${levelError.message}`);
    }
    console.log('Successfully accessed sponsor_levels table');
    
    // Then verify we can access sponsors table
    const { data: testData, error: testError } = await supabase
      .from('sponsors')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('Error accessing sponsors table:', testError);
      throw new Error(`Service role access denied to sponsors: ${testError.message}`);
    }
    console.log('Successfully accessed sponsors table');
    
    console.log('Supabase service role access verified successfully');
    console.log('Supabase client configuration:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length,
      auth: {
        hasAdmin: !!supabase.auth.admin,
        hasSession: !!session,
        sessionError,
      },
      tableAccess: {
        hasAccess: !!testData,
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

    // Log Supabase client state and verify connection
    console.log('Supabase client check before insert:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      serviceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10),
      auth: supabase.auth.admin !== undefined ? 'Has admin API' : 'No admin API',
      headers: supabase['headers'] || 'No headers available'
    });

    // Verify database connection and permissions
    try {
      // First verify we can read (public access)
      const { data: levelCheck, error: healthError } = await supabase
        .from('sponsor_levels')
        .select('id')
        .limit(1)
        .single();

      if (healthError) {
        console.error('Database read check failed:', healthError);
        throw new Error(`Database read check failed: ${healthError.message}`);
      }
      console.log('Database read access verified');

      // Then verify we can write (service role access)
      const testData = { name: '_test_', level: '_test_', year: 2025, image_url: '_test_' };
      const { error: writeError } = await supabase
        .from('sponsors')
        .insert([testData])
        .select()
        .single();

      if (writeError) {
        console.error('Database write check failed:', writeError);
        throw new Error(`Database write check failed: ${writeError.message}`);
      }
      console.log('Database write access verified');

      // Clean up test data
      await supabase
        .from('sponsors')
        .delete()
        .match(testData);

    } catch (e) {
      console.error('Error during database permission check:', e);
      throw e;
    }

    // Create sponsor in database
    console.log('Attempting to insert sponsor:', {
      name: metadata.name,
      level: metadata.level,
      year: metadata.year,
      hasCloudinaryId: !!uploadResult.public_id,
      hasImageUrl: !!uploadResult.secure_url
    });

    // Log current auth state
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Current auth state:', {
      hasSession: !!session,
      sessionError,
      headers: supabase['supabaseUrl'], // Log the base URL to verify config
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) + '...',
    });

    // Create headers for service role
    const serviceRoleHeaders = {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'x-supabase-auth-role': 'service_role'
    };

    // Try a dry-run select with explicit service role header
    try {
      const { data: levelCheck, error: levelError } = await supabase
        .from('sponsor_levels')
        .select('id')
        .eq('id', metadata.level)
        .single()
        .headers(serviceRoleHeaders);
      
      console.log('Level check result:', { 
        hasLevel: !!levelCheck,
        error: levelError,
        headers: serviceRoleHeaders
      });
      
      if (levelError) {
        throw new Error(`Failed to verify sponsor level: ${levelError.message}`);
      }
    } catch (e) {
      console.error('Error checking sponsor level:', e);
      throw e;
    }

    // Insert sponsor with UUID and explicit service role headers
    console.log('Attempting sponsor insert with headers:', serviceRoleHeaders);
    
    const { data, error } = await supabase
      .from('sponsors')
      .insert({
        id: crypto.randomUUID(), // Generate UUID for the id field
        name: metadata.name,
        level: metadata.level,
        year: metadata.year,
        cloudinary_public_id: uploadResult.public_id,
        image_url: uploadResult.secure_url,
      }, { headers: serviceRoleHeaders })
      .select('*')
      .single()
      .headers(serviceRoleHeaders);

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
