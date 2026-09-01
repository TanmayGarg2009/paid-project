import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@skyline/database';
import { SESSION_COOKIE_NAME } from '@skyline/auth';
import { getBaseUrl } from '@/lib/oauth';

async function handleLogout(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    try {
      await db.session.deleteMany({
        where: { token },
      });
    } catch {
      // Ignored
    }
    cookieStore.delete(SESSION_COOKIE_NAME);
  }

  const baseUrl = getBaseUrl(request);
  return NextResponse.redirect(new URL('/login', baseUrl), {
    status: 303,
  });
}

export async function GET(request: NextRequest) {
  return handleLogout(request);
}

export async function POST(request: NextRequest) {
  return handleLogout(request);
}
