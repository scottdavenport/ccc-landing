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

    const result = await cloudinaryApi('/resources/search', {
      method: 'POST',
      body: searchParams
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in search route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
