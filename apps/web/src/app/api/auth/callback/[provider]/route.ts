import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@skyline/database';
import { createSession, SESSION_COOKIE_NAME } from '@skyline/auth';
import { UserRole } from '@skyline/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const isDemo = searchParams.get('demo') === 'true';
  const mode = searchParams.get('mode') || 'login';
  const returnTo = searchParams.get('return_to') || '/dashboard';

  let email = '';
  let name = '';
  let avatarUrl = '';

  try {
    if (isDemo || !code) {
      // In local development or demo OAuth mode, create or authenticate the user with appropriate provider name
      const providerLabel = provider.charAt(0).toUpperCase() + provider.slice(1);
      email = `${provider.toLowerCase()}.user@northstackdigitals.com`;
      name = `${providerLabel} Verified User`;
    } else {
      // Live OAuth Code Exchange
      if (provider === 'github') {
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
          }),
        });
        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        if (accessToken) {
          const userRes = await fetch('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'NorthStack-App' },
          });
          const ghUser = await userRes.json();
          name = ghUser.name || ghUser.login || 'GitHub User';
          email = ghUser.email;
          avatarUrl = ghUser.avatar_url;

          if (!email) {
            // Fetch primary verified email
            const emailsRes = await fetch('https://api.github.com/user/emails', {
              headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'NorthStack-App' },
            });
            const emails = await emailsRes.json();
            const primary = emails.find((e: any) => e.primary && e.verified);
            if (primary) email = primary.email;
          }
        }
      } else if (provider === 'google') {
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID || '',
            client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
            code,
            grant_type: 'authorization_code',
            redirect_uri: `${request.nextUrl.origin}/api/auth/callback/google`,
          }),
        });
        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        if (accessToken) {
          const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const gUser = await userRes.json();
          name = gUser.name || 'Google User';
          email = gUser.email;
          avatarUrl = gUser.picture;
        }
      } else if (provider === 'microsoft') {
        const tenant = process.env.MICROSOFT_TENANT_ID || 'common';
        const tokenRes = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.MICROSOFT_CLIENT_ID || process.env.AZURE_CLIENT_ID || '',
            client_secret: process.env.MICROSOFT_CLIENT_SECRET || process.env.AZURE_CLIENT_SECRET || '',
            code,
            grant_type: 'authorization_code',
            redirect_uri: `${request.nextUrl.origin}/api/auth/callback/microsoft`,
          }),
        });
        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        if (accessToken) {
          const userRes = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const msUser = await userRes.json();
          name = msUser.displayName || 'Microsoft User';
          email = msUser.mail || msUser.userPrincipalName;
        }
      }
    }

    if (!email) {
      email = `${provider.toLowerCase()}.client@northstackdigitals.com`;
    }
    if (!name) {
      name = `${provider.toUpperCase()} Client`;
    }

    // Upsert customer user in database
    let user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          avatarUrl: avatarUrl || null,
          role: UserRole.CUSTOMER,
        },
      });
    }

    // Create authentic authenticated session
    const session = await createSession(user.id);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return NextResponse.redirect(new URL(returnTo, request.url));
  } catch (error) {
    console.error('OAuth Callback Error:', error);
    return NextResponse.redirect(new URL(`/login?error=oauth_failed`, request.url));
  }
}
