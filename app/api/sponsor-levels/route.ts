import { NextResponse } from 'next/server';
import { getPublicSponsorLevels } from '@/utils/database-public';

export async function GET() {
  try {
    const levels = await getPublicSponsorLevels();
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
