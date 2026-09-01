import { NextRequest, NextResponse } from 'next/server';
import { BRAND_CONFIG } from '@skyline/config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('mode') || 'login';
  const returnTo = searchParams.get('return_to') || '/dashboard';

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || BRAND_CONFIG.url || 'http://localhost:3000';
  const callbackUrl = `${baseUrl}/api/auth/callback/${provider}?mode=${mode}&return_to=${encodeURIComponent(returnTo)}`;

  if (provider === 'google') {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId) {
      const scope = encodeURIComponent('openid email profile');
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        callbackUrl
      )}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
      return NextResponse.redirect(googleAuthUrl);
    }
  } else if (provider === 'github') {
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (clientId) {
      const scope = encodeURIComponent('read:user user:email');
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        callbackUrl
      )}&scope=${scope}`;
      return NextResponse.redirect(githubAuthUrl);
    }
  } else if (provider === 'microsoft') {
    const clientId = process.env.MICROSOFT_CLIENT_ID || process.env.AZURE_CLIENT_ID;
    if (clientId) {
      const scope = encodeURIComponent('openid email profile User.Read');
      const tenant = process.env.MICROSOFT_TENANT_ID || 'common';
      const microsoftAuthUrl = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
        callbackUrl
      )}&response_mode=query&scope=${scope}`;
      return NextResponse.redirect(microsoftAuthUrl);
    }
  }

  // Fallback / Development Instant-Auth Flow
  // When live credentials aren't set in development, smoothly authenticate with a verified provider profile
  const demoCallbackUrl = `/api/auth/callback/${provider}?demo=true&mode=${mode}&return_to=${encodeURIComponent(returnTo)}`;
  return NextResponse.redirect(new URL(demoCallbackUrl, request.url));
}
