'use server';

import { cookies } from 'next/headers';
import { db } from '@skyline/database';
import { hashPassword, verifyPassword, createSession, revokeSession, validateSession, SESSION_COOKIE_NAME } from '@skyline/auth';
import { loginSchema, registerSchema, LoginInput, RegisterInput } from '@skyline/validation';
import { UserRole } from '@skyline/types';

export async function loginCustomer(input: LoginInput) {
  try {
    const validated = loginSchema.parse(input);
    const user = await db.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      return { success: false, error: 'Invalid email or password' };
    }

    const isValid = verifyPassword(validated.password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Create session
    const session = await createSession(user.id);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Login failed' };
  }
}

import { sendOtpEmail } from '@skyline/notifications';
import { createAndStoreOtp, verifyOtpCode } from '@/lib/otp-store';

export async function sendRegistrationOtp(input: RegisterInput) {
  try {
    const validated = registerSchema.parse(input);
    const email = validated.email.toLowerCase().trim();

    // Check if user already exists
    const existing = await db.user.findUnique({
      where: { email },
    });

    if (existing) {
      return { 
        success: false, 
        error: 'An account with this email already exists. Please sign in.' 
      };
    }

    const passwordHash = hashPassword(validated.password);

    // Store pending registration data with the generated OTP
    const otpRes = createAndStoreOtp(email, {
      name: validated.name,
      email,
      passwordHash,
      phone: validated.phone || undefined,
      discordUsername: validated.discordUsername || undefined,
    });

    if (!otpRes.success || !otpRes.otp) {
      return {
        success: false,
        error: otpRes.error || 'Failed to generate verification code. Please try again.',
        cooldownRemainingSeconds: otpRes.cooldownRemainingSeconds,
      };
    }

    // Send styled verification email via Gmail SMTP
    const emailRes = await sendOtpEmail(email, otpRes.otp, otpRes.expiresInMinutes);

    if (!emailRes.success) {
      return {
        success: false,
        error: emailRes.error || 'Failed to deliver verification code to your email. Please try again.',
      };
    }

    return {
      success: true,
      email,
      expiresInMinutes: otpRes.expiresInMinutes,
    };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Registration failed' };
  }
}

export async function verifyRegistrationOtp(email: string, otpCode: string) {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const verification = verifyOtpCode(normalizedEmail, otpCode);

    if (!verification.valid) {
      return {
        success: false,
        error: verification.error || 'Invalid or expired verification code.',
      };
    }

    const pending = verification.pendingRegistration;

    // Check if user already created
    let user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: normalizedEmail,
          name: pending?.name || normalizedEmail.split('@')[0],
          passwordHash: pending?.passwordHash || null,
          phone: pending?.phone || null,
          discordUsername: pending?.discordUsername || null,
          role: UserRole.CUSTOMER,
        },
      });
    } else if (pending?.passwordHash && !user.passwordHash) {
      // If user existed without password (e.g. from prior OAuth/OTP), attach the password
      user = await db.user.update({
        where: { id: user.id },
        data: {
          passwordHash: pending.passwordHash,
          name: pending.name || user.name,
        },
      });
    }

    // Create active session
    const session = await createSession(user.id);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Verification failed' };
  }
}

export async function registerCustomer(input: RegisterInput) {
  return sendRegistrationOtp(input);
}

export async function logoutCustomer() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await revokeSession(token);
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
  return { success: true };
}

export async function getCurrentCustomer() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await validateSession(token);
  if (!session) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
    avatarUrl: session.user.avatarUrl,
    oauthProvider: (session.user as any).oauthProvider,
    discordUsername: session.user.discordUsername,
    phone: session.user.phone,
  };
}
