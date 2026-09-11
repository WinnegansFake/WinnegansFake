import { NextRequest, NextResponse } from 'next/server';
import {
  readPageAnnotations,
  writePageAnnotations,
  PageAnnotationsData,
} from '@/lib/annotations';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pageParam = searchParams.get('page') || '1';
  const page = parseInt(pageParam, 10);

  if (isNaN(page) || page < 1 || page > 628) {
    return NextResponse.json(
      { error: 'Page must be an integer between 1 and 628.' },
      { status: 400 }
    );
  }

  const data = await readPageAnnotations(page);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PageAnnotationsData;

    if (!body || typeof body.page_number !== 'number') {
      return NextResponse.json(
        { error: 'Invalid payload: page_number is required.' },
        { status: 400 }
      );
    }

    const res = await writePageAnnotations(body);
    if (!res.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: res.errors },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Annotations saved for page ${body.page_number}`,
      data: body,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Server error saving annotations', details: [err.message] },
      { status: 500 }
    );
  }
}
