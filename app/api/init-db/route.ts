import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

/**
 * Initialize database schema by forcing a query to each table
 * This ensures the schema cache is properly populated
 */
async function validateTable(tableName: string, retries = 3): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      const { error } = await supabase
        .from(tableName)
        .select('id')
        .limit(1);

      if (!error) {
        console.log(`Successfully validated table: ${tableName}`);
        return true;
      }

      console.warn(`Attempt ${i + 1}/${retries} failed for ${tableName}:`, error);
      
      // Wait a bit before retrying
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    } catch (error) {
      console.error(`Error validating ${tableName}:`, error);
      if (i === retries - 1) throw error;
    }
  }
  return false;
}

export async function GET() {
  try {
    // Validate each table with retries
    const results = await Promise.all([
      validateTable('sponsors'),
      validateTable('sponsor_levels')
    ]);

    // Check if all tables were validated
    if (results.every(result => result)) {
      return NextResponse.json({ status: 'ok' });
    }

    throw new Error('Failed to validate all tables');

  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database schema. Please try again.' },
      { status: 503 } // Use 503 to indicate service temporarily unavailable
    );
  }
}
