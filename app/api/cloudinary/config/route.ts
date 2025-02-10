import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
  // Check authentication
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // List upload presets
    const presets = await cloudinary.api.upload_presets();
    
    return NextResponse.json(presets);
  } catch (error) {
    console.error('Error fetching Cloudinary config:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch Cloudinary config' },
      { status: 500 }
    );
  }
}
