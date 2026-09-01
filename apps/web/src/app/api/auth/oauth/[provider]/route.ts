import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const searchParams = request.nextUrl.searchParams;
  const targetUrl = new URL(`/api/auth/login/${provider}?${searchParams.toString()}`, request.url);
  return NextResponse.redirect(targetUrl);
}
