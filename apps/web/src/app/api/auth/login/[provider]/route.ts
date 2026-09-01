import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  OAuthProvider,
  getBaseUrl,
  getRedirectUri,
  getProviderConfig,
  generateOAuthState,
  buildAuthorizationUrl,
} from '@/lib/oauth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const validProviders: OAuthProvider[] = ['google', 'github', 'microsoft'];

  if (!validProviders.includes(provider as OAuthProvider)) {
    return NextResponse.json(
      { error: `Invalid provider '${provider}'. Supported: ${validProviders.join(', ')}` },
      { status: 400 }
    );
  }

  const oauthProvider = provider as OAuthProvider;
  const config = getProviderConfig(oauthProvider);

  if (!config.clientId) {
    const errorMsg = encodeURIComponent(
      `${provider.toUpperCase()}_CLIENT_ID is not configured in Vercel Environment Variables. Please add it to your Vercel Project Settings.`
    );
    return NextResponse.redirect(new URL(`/login?error=${errorMsg}`, request.url));
  }

  const searchParams = request.nextUrl.searchParams;
  const returnTo = searchParams.get('return_to') || '/dashboard';

  // 1. Generate CSRF state
  const state = generateOAuthState(returnTo);

  // 2. Set temporary HttpOnly CSRF state cookie (10 minutes TTL)
  const cookieStore = await cookies();
  cookieStore.set(`oauth_state_${oauthProvider}`, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 10 * 60, // 10 minutes
  });

  // 3. Construct OAuth authorization URL
  const baseUrl = getBaseUrl(request);
  const redirectUri = getRedirectUri(oauthProvider, baseUrl);
  const authUrl = buildAuthorizationUrl(oauthProvider, state, redirectUri);

  // 4. Redirect to provider authorization screen
  return NextResponse.redirect(authUrl);
}
