import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

/**
 * Initialize database schema by forcing a query to each table
 * This ensures the schema cache is properly populated
 */
export async function GET() {
  try {
    // Force queries to populate schema cache
    await Promise.all([
      // Query sponsors table
      supabase
        .from('sponsors')
        .select('id')
        .limit(1),
      
      // Query sponsor_levels table
      supabase
        .from('sponsor_levels')
        .select('id')
        .limit(1),
    ]);

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}
