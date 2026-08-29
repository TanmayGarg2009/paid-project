import { NextResponse } from 'next/server';
import { logoutCustomer } from '@/actions/auth';

export async function POST() {
  await logoutCustomer();
  return NextResponse.redirect(new URL('/auth/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'), {
    status: 303,
  });
}
