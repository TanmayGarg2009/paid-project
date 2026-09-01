import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { db } from '@skyline/database';
import { createSession, SESSION_COOKIE_NAME } from '@skyline/auth';
import { UserRole } from '@skyline/types';
import { verifyOtpCode } from '@/lib/otp-store';

const verifyOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().min(6, 'Verification code must be 6 digits').max(6, 'Verification code must be 6 digits'),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const parseResult = verifyOtpSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.errors[0]?.message || 'Invalid parameters' },
        { status: 400 }
      );
    }

    const { email, otp, name } = parseResult.data;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Verify OTP code & expiration
    const validation = verifyOtpCode(normalizedEmail, otp);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error || 'Invalid verification code' },
        { status: 400 }
      );
    }

    // 2. Lookup or create customer account
    let user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: normalizedEmail,
          name: name || normalizedEmail.split('@')[0],
          role: UserRole.CUSTOMER,
        },
      });
    }

    // 3. Issue database session
    const session = await createSession(user.id);

    // 4. Set HttpOnly session cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('API /api/auth/otp/verify error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while verifying code.' },
      { status: 500 }
    );
  }
}
