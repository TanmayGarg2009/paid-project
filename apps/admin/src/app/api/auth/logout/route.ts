import { NextResponse } from 'next/server';
import { logoutAdmin } from '@/actions/auth';

export async function POST() {
  await logoutAdmin();
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001'), {
    status: 303,
  });
}
