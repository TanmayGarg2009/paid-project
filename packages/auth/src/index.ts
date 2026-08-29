import crypto from 'node:crypto';
import { db } from '@skyline/database';
import { UserRole, AuthUser } from '@skyline/types';

const SESSION_COOKIE_NAME = 'skyline_session';
const ADMIN_SESSION_COOKIE_NAME = 'skyline_admin_session';

// 1. Password Hashing (PBKDF2 SHA-512)
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;
  
  // Backwards compatibility for seed static hash
  if (!storedHash.includes(':')) {
    const salt = 'skyline_static_salt_2026';
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
  }

  const [salt, hash] = storedHash.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash));
}

// 2. Session Management
export async function createSession(userId: string, ipAddress?: string, userAgent?: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const session = await db.session.create({
    data: {
      userId,
      token,
      expiresAt,
      ipAddress,
      userAgent,
    },
    include: {
      user: true,
    },
  });

  return session;
}

export async function validateSession(token: string) {
  if (!token) return null;

  try {
    const session = await db.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await db.session.delete({ where: { id: session.id } }).catch(() => {});
      }
      return null;
    }

    return session;
  } catch (error) {
    return null;
  }
}

export async function revokeSession(token: string) {
  if (!token) return;
  try {
    await db.session.deleteMany({ where: { token } }).catch(() => {});
  } catch (error) {
    // Ignored in offline mode
  }
}

// 3. Role Checking Helpers
export function isStaff(role: UserRole | string): boolean {
  return role === UserRole.OWNER || role === UserRole.ADMIN || role === UserRole.SUPPORT || role === 'OWNER' || role === 'ADMIN' || role === 'SUPPORT';
}

export function isAdminOrOwner(role: UserRole | string): boolean {
  return role === UserRole.OWNER || role === UserRole.ADMIN || role === 'OWNER' || role === 'ADMIN';
}

export function isOwner(role: UserRole | string): boolean {
  return role === UserRole.OWNER || role === 'OWNER';
}

export { SESSION_COOKIE_NAME, ADMIN_SESSION_COOKIE_NAME };
