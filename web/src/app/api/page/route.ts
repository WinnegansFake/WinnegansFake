import { NextRequest, NextResponse } from 'next/server';
import { getLocalPageText } from '@/lib/reader';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pageParam = searchParams.get('page') || '3';
  const page = parseInt(pageParam, 10);

  if (isNaN(page) || page < 3 || page > 628) {
    return NextResponse.json(
      { error: 'Page must be an integer between 3 and 628.' },
      { status: 400 }
    );
  }

  const result = await getLocalPageText(page);
  return NextResponse.json(result);
}
