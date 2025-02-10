import { NextRequest, NextResponse } from 'next/server';
import { cloudinaryApi } from '@/lib/cloudinary/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const searchParams = {
      expression: body.expression || 'folder=sponsors',
      max_results: body.max_results || 100,
      next_cursor: body.next_cursor
    };

    try {
      const result = await cloudinaryApi('/resources/search', {
        method: 'POST',
        body: searchParams
      });

      return NextResponse.json({
        resources: result.resources || [],
        next_cursor: result.next_cursor,
        total_count: result.total_count || 0
      });
    } catch (apiError) {
      console.error('Cloudinary API error:', apiError);
      return NextResponse.json(
        { 
          error: apiError instanceof Error ? apiError.message : 'Failed to search images',
          resources: [] 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { 
        error: 'Invalid request format',
        resources: [] 
      },
      { status: 400 }
    );
  }
}
