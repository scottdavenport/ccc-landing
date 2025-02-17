import { NextResponse } from 'next/server';
import { getPublicSponsors } from '@/utils/database-public';

export async function GET() {
  try {
    const sponsors = await getPublicSponsors();
    return NextResponse.json(sponsors);
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sponsors' },
      { status: 500 }
    );
  }
}
