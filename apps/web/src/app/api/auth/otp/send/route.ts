import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAndStoreOtp } from '@/lib/otp-store';
import { sendOtpEmail } from '@skyline/notifications';

const sendOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const parseResult = sendOtpSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.errors[0]?.message || 'Invalid email address' },
        { status: 400 }
      );
    }

    const { email } = parseResult.data;

    // 1. Generate & store OTP with 60s rate limit
    const otpResult = createAndStoreOtp(email);
    if (!otpResult.success || !otpResult.otp) {
      return NextResponse.json(
        {
          success: false,
          error: otpResult.error || 'Failed to generate code',
          cooldownRemainingSeconds: otpResult.cooldownRemainingSeconds,
        },
        { status: 429 }
      );
    }

    // 2. Dispatch email via Nodemailer Gmail SMTP
    const emailResult = await sendOtpEmail(email, otpResult.otp, otpResult.expiresInMinutes);

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: emailResult.error || 'Failed to dispatch email. Please check your address or try again.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${email}.`,
      expiresInMinutes: otpResult.expiresInMinutes,
    });
  } catch (error: any) {
    console.error('API /api/auth/otp/send error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while sending verification code.' },
      { status: 500 }
    );
  }
}
