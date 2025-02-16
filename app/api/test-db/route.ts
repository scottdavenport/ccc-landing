import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function GET() {
  try {
    // Test query to check if we can connect and query
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .limit(1);

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to Supabase',
      data 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to connect to database',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
