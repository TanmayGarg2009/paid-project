import { cookies } from 'next/headers';
import { db } from '@skyline/database';
import { createSession, SESSION_COOKIE_NAME } from '@skyline/auth';
import { UserRole } from '@skyline/types';
import { NormalizedOAuthProfile } from './oauth';

export async function syncOAuthUser(profile: NormalizedOAuthProfile) {
  const email = profile.email.toLowerCase().trim();

  // 1. Check for existing user by provider ID or email
  let user = await db.user.findFirst({
    where: {
      OR: [
        { email },
        profile.provider === 'google' ? { googleId: profile.providerId } : {},
        profile.provider === 'github' ? { githubId: profile.providerId } : {},
        profile.provider === 'microsoft' ? { microsoftId: profile.providerId } : {},
      ].filter((condition) => Object.keys(condition).length > 0),
    },
  });

  if (user) {
    // 2. Link provider IDs and update avatar/name if missing
    const updateData: Record<string, any> = {
      oauthProvider: profile.provider,
    };

    if (profile.provider === 'google' && !user.googleId) {
      updateData.googleId = profile.providerId;
    } else if (profile.provider === 'github' && !user.githubId) {
      updateData.githubId = profile.providerId;
    } else if (profile.provider === 'microsoft' && !user.microsoftId) {
      updateData.microsoftId = profile.providerId;
    }

    if (!user.name && profile.name) {
      updateData.name = profile.name;
    }

    if (!user.avatarUrl && profile.avatarUrl) {
      updateData.avatarUrl = profile.avatarUrl;
    }

    user = await db.user.update({
      where: { id: user.id },
      data: updateData,
    });
  } else {
    // 3. Create new customer user
    user = await db.user.create({
      data: {
        email,
        name: profile.name,
        avatarUrl: profile.avatarUrl || null,
        googleId: profile.provider === 'google' ? profile.providerId : null,
        githubId: profile.provider === 'github' ? profile.providerId : null,
        microsoftId: profile.provider === 'microsoft' ? profile.providerId : null,
        oauthProvider: profile.provider,
        role: UserRole.CUSTOMER,
      },
    });
  }

  // 4. Issue authenticated session token
  const session = await createSession(user.id);

  // 5. Store session in secure, signed HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return { user, session };
}
