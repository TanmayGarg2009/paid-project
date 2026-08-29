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

export async function registerCustomer(input: RegisterInput) {
  try {
    const validated = registerSchema.parse(input);
    const existing = await db.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (existing) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const passwordHash = hashPassword(validated.password);
    const user = await db.user.create({
      data: {
        email: validated.email.toLowerCase(),
        name: validated.name,
        passwordHash,
        phone: validated.phone || null,
        discordUsername: validated.discordUsername || null,
        role: UserRole.CUSTOMER,
      },
    });

    const session = await createSession(user.id);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
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
    return { success: false, error: error?.message || 'Registration failed' };
  }
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
    discordUsername: session.user.discordUsername,
    phone: session.user.phone,
  };
}
