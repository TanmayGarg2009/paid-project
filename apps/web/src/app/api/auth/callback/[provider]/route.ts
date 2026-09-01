import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  OAuthProvider,
  getBaseUrl,
  getRedirectUri,
  parseOAuthState,
  exchangeOAuthCode,
  fetchOAuthProfile,
} from '@/lib/oauth';
import { syncOAuthUser } from '@/lib/auth-sync';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const validProviders: OAuthProvider[] = ['google', 'github', 'microsoft'];

  if (!validProviders.includes(provider as OAuthProvider)) {
    return NextResponse.redirect(new URL('/login?error=invalid_provider', request.url));
  }

  const oauthProvider = provider as OAuthProvider;
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const providerError = searchParams.get('error') || searchParams.get('error_description');

  if (providerError) {
    console.error(`OAuth provider ${oauthProvider} error:`, providerError);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(providerError)}`, request.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/login?error=missing_code_or_state', request.url)
    );
  }

  const cookieStore = await cookies();
  const stateCookieName = `oauth_state_${oauthProvider}`;
  const storedState = cookieStore.get(stateCookieName)?.value;

  // 1. Verify CSRF state token
  if (!storedState || storedState !== state) {
    console.error(`CSRF state mismatch for ${oauthProvider}. Stored: ${storedState}, Received: ${state}`);
    return NextResponse.redirect(
      new URL('/login?error=csrf_state_mismatch', request.url)
    );
  }

  const parsedState = parseOAuthState(state);
  const returnTo = parsedState?.returnTo || '/dashboard';

  try {
    const baseUrl = getBaseUrl(request);
    const redirectUri = getRedirectUri(oauthProvider, baseUrl);

    // 2. Exchange authorization code for access token
    const tokenResult = await exchangeOAuthCode(oauthProvider, code, redirectUri);

    // 3. Fetch normalized user profile from OpenID Connect / userinfo endpoint
    const profile = await fetchOAuthProfile(oauthProvider, tokenResult.accessToken);

    // 4. Sync user into database and set secure HTTP-only session cookie
    await syncOAuthUser(profile);

    // 5. Clean up temporary CSRF state cookie
    cookieStore.delete(stateCookieName);

    // 6. Redirect to dashboard or requested return URL
    const destination = new URL(returnTo, baseUrl);
    return NextResponse.redirect(destination);
  } catch (error: any) {
    console.error(`OAuth callback error for ${oauthProvider}:`, error);
    // Delete state cookie on error
    cookieStore.delete(stateCookieName);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error?.message || 'oauth_authentication_failed')}`, request.url)
    );
  }
}
