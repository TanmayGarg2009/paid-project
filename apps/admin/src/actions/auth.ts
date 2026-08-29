'use server';

import { cookies } from 'next/headers';
import { db } from '@skyline/database';
import { verifyPassword, createSession, revokeSession, validateSession, isStaff, ADMIN_SESSION_COOKIE_NAME } from '@skyline/auth';
import { loginSchema, LoginInput } from '@skyline/validation';

export async function loginAdmin(input: LoginInput) {
  try {
    const validated = loginSchema.parse(input);
    const user = await db.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (!user || !user.passwordHash || !isStaff(user.role)) {
      return { success: false, error: 'Invalid administrator credentials' };
    }

    const isValid = verifyPassword(validated.password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid administrator credentials' };
    }

    const session = await createSession(user.id);
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
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

export async function logoutAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (token) {
    await revokeSession(token);
  }
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);
  return { success: true };
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await validateSession(token);
  if (!session || !isStaff(session.user.role)) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  };
}
