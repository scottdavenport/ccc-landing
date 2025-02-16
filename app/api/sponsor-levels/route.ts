import { NextResponse } from 'next/server';
import { getSponsorLevels } from '@/utils/database';

export async function GET() {
  try {
    const levels = await getSponsorLevels();
    return NextResponse.json(levels);
  } catch (error) {
    console.error('Error fetching sponsor levels:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
