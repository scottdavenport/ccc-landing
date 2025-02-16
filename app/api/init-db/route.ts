import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

/**
 * Initialize database schema by forcing a query to each table
 * This ensures the schema cache is properly populated
 */
async function ensureColumns(tableName: string, columns: string[]): Promise<boolean> {
  try {
    // Query information schema to check column existence
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', tableName);

    if (error) {
      console.error('Error checking columns:', error);
      return false;
    }

    const existingColumns = data?.map(col => col.column_name) || [];
    const missingColumns = columns.filter(col => !existingColumns.includes(col));

    if (missingColumns.length > 0) {
      console.warn(`Missing columns in ${tableName}:`, missingColumns);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in ensureColumns:', error);
    return false;
  }
}

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

async function warmupConnection(maxRetries = 5): Promise<boolean> {
  const isPreview = process.env.VERCEL_ENV === 'preview';
  const baseDelay = isPreview ? 2000 : 1000; // Longer delays in preview

  for (let i = 0; i < maxRetries; i++) {
    try {
      // Simple health check query using sponsors table instead of _prisma_migrations
      const { data, error } = await supabase.from('sponsors').select('id').limit(1);
      if (!error) {
        console.log('Connection warmup successful');
        return true;
      }
      
      const delay = baseDelay * Math.pow(2, i); // Exponential backoff
      console.warn(`Warmup attempt ${i + 1}/${maxRetries} failed:`, {
        error,
        nextRetryDelay: delay,
        environment: process.env.VERCEL_ENV || 'development'
      });
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (e) {
      console.error(`Warmup error on attempt ${i + 1}/${maxRetries}:`, e);
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  return false;
}

export async function GET() {
  // Log environment state
  const envState = {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')?.[0] || 'not-set',
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || 'development',
  };

  console.log('Init-DB Environment State:', envState);
  
  try {
    // First warm up the connection with more retries in preview
    const maxRetries = process.env.VERCEL_ENV === 'preview' ? 5 : 3;
    const isWarm = await warmupConnection(maxRetries);
    
    if (!isWarm) {
      console.error('Failed to warm up database connection', {
        environment: process.env.VERCEL_ENV || 'development',
        maxRetries
      });
      return NextResponse.json(
        { error: 'Database connection not ready' },
        { status: 503 }
      );
    }

    // First check required columns
    const sponsorColumns = await ensureColumns('sponsors', ['image_url', 'cloudinary_public_id']);
    const levelColumns = await ensureColumns('sponsor_levels', ['name', 'amount']);

    if (!sponsorColumns || !levelColumns) {
      console.log('Running schema refresh...');
      
      // Force a refresh of the schema cache by doing a select
      const { error: refreshError } = await supabase
        .from('sponsors')
        .select('*')
        .limit(1);

      if (refreshError) {
        console.error('Schema refresh failed:', refreshError);
        throw refreshError;
      }

      // Wait a moment for cache to update
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify columns again
      const sponsorColumnsRetry = await ensureColumns('sponsors', ['image_url', 'cloudinary_public_id']);
      const levelColumnsRetry = await ensureColumns('sponsor_levels', ['name', 'amount']);

      if (!sponsorColumnsRetry || !levelColumnsRetry) {
        throw new Error('Schema validation failed after refresh');
      }

      console.log('Schema refresh completed successfully');
    }

    // Now validate each table with retries
    const results = await Promise.all([
      validateTable('sponsors'),
      validateTable('sponsor_levels')
    ]);

    // Check if all tables were validated
    if (results.every(result => result)) {
      return NextResponse.json({ 
        status: 'ok',
        message: 'Database initialized successfully',
        timestamp: new Date().toISOString()
      });
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
