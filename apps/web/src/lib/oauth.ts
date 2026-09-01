import crypto from 'node:crypto';
import { NextRequest } from 'next/server';

export type OAuthProvider = 'google' | 'github' | 'microsoft';

export interface NormalizedOAuthProfile {
  provider: OAuthProvider;
  providerId: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
}

export interface OAuthProviderConfig {
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scope: string;
  tenantId?: string;
}

export function getBaseUrl(request?: Request | NextRequest): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '');
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  if (request) {
    try {
      const url = new URL(request.url);
      return `${url.protocol}//${url.host}`;
    } catch {
      // Fallback
    }
  }
  return 'https://northstackdigitals.vercel.app';
}

export function getRedirectUri(provider: OAuthProvider, baseUrl: string): string {
  return `${baseUrl}/api/auth/callback/${provider}`;
}

export function getProviderConfig(provider: OAuthProvider): OAuthProviderConfig {
  switch (provider) {
    case 'google':
      return {
        clientId: process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userInfoUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
        scope: 'openid email profile',
      };
    case 'github':
      return {
        clientId: process.env.GITHUB_CLIENT_ID || process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        authorizationUrl: 'https://github.com/login/oauth/authorize',
        tokenUrl: 'https://github.com/login/oauth/access_token',
        userInfoUrl: 'https://api.github.com/user',
        scope: 'read:user user:email',
      };
    case 'microsoft':
      const tenant = process.env.MICROSOFT_TENANT_ID || 'common';
      return {
        clientId: process.env.MICROSOFT_CLIENT_ID || process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || process.env.AZURE_CLIENT_ID || '',
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET || process.env.AZURE_CLIENT_SECRET || '',
        authorizationUrl: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`,
        tokenUrl: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
        userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
        scope: 'openid email profile User.Read',
        tenantId: tenant,
      };
    default:
      throw new Error(`Unsupported OAuth provider: ${provider}`);
  }
}

/**
 * Generate a secure cryptographically random CSRF state string
 */
export function generateOAuthState(returnTo: string = '/dashboard'): string {
  const randomBytes = crypto.randomBytes(24).toString('hex');
  const payload = {
    nonce: randomBytes,
    returnTo: returnTo.startsWith('/') ? returnTo : '/dashboard',
    timestamp: Date.now(),
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

/**
 * Parse & validate the returned CSRF state
 */
export function parseOAuthState(stateString: string): { nonce: string; returnTo: string; timestamp: number } | null {
  try {
    const json = Buffer.from(stateString, 'base64url').toString('utf-8');
    const parsed = JSON.parse(json);
    if (parsed.nonce && parsed.timestamp) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Build the Provider OAuth 2.0 Authorization URL
 */
export function buildAuthorizationUrl(provider: OAuthProvider, state: string, redirectUri: string): string {
  const config = getProviderConfig(provider);
  const params = new URLSearchParams();

  params.set('client_id', config.clientId);
  params.set('redirect_uri', redirectUri);
  params.set('response_type', 'code');
  params.set('scope', config.scope);
  params.set('state', state);

  if (provider === 'google') {
    params.set('access_type', 'offline');
    params.set('prompt', 'select_account');
  } else if (provider === 'microsoft') {
    params.set('response_mode', 'query');
    params.set('prompt', 'select_account');
  }

  return `${config.authorizationUrl}?${params.toString()}`;
}

/**
 * Server-to-server authorization code exchange for access token
 */
export async function exchangeOAuthCode(
  provider: OAuthProvider,
  code: string,
  redirectUri: string
): Promise<{ accessToken: string; idToken?: string }> {
  const config = getProviderConfig(provider);

  if (provider === 'github') {
    const res = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`GitHub token exchange failed (${res.status}): ${errText}`);
    }

    const data = await res.json();
    if (data.error) {
      throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`);
    }

    return { accessToken: data.access_token };
  }

  // Google and Microsoft standard x-www-form-urlencoded POST
  const bodyParams = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });

  const res = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: bodyParams.toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`${provider} token exchange failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(`${provider} OAuth error: ${data.error_description || data.error}`);
  }

  return {
    accessToken: data.access_token,
    idToken: data.id_token,
  };
}

/**
 * Fetch and normalize user profile from provider userinfo / graph endpoints
 */
export async function fetchOAuthProfile(
  provider: OAuthProvider,
  accessToken: string
): Promise<NormalizedOAuthProfile> {
  const config = getProviderConfig(provider);

  if (provider === 'google') {
    const res = await fetch(config.userInfoUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch Google user profile: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      provider: 'google',
      providerId: data.sub || data.id,
      email: data.email,
      name: data.name || data.given_name || 'Google User',
      avatarUrl: data.picture || null,
    };
  }

  if (provider === 'github') {
    const [userRes, emailsRes] = await Promise.all([
      fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'NorthStack-Auth-Engine',
          Accept: 'application/json',
        },
      }),
      fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'NorthStack-Auth-Engine',
          Accept: 'application/json',
        },
      }).catch(() => null),
    ]);

    if (!userRes.ok) {
      throw new Error(`Failed to fetch GitHub user profile: ${userRes.statusText}`);
    }

    const userData = await userRes.json();
    let email = userData.email;

    if (!email && emailsRes && emailsRes.ok) {
      const emails: Array<{ email: string; primary: boolean; verified: boolean }> = await emailsRes.json();
      const primary = emails.find((e) => e.primary && e.verified) || emails.find((e) => e.verified) || emails[0];
      if (primary) {
        email = primary.email;
      }
    }

    if (!email) {
      email = `${userData.id}+${userData.login}@users.noreply.github.com`;
    }

    return {
      provider: 'github',
      providerId: String(userData.id),
      email: email.toLowerCase(),
      name: userData.name || userData.login || 'GitHub User',
      avatarUrl: userData.avatar_url || null,
    };
  }

  if (provider === 'microsoft') {
    const res = await fetch(config.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch Microsoft profile: ${res.statusText}`);
    }

    const data = await res.json();
    const email = data.mail || data.userPrincipalName;

    return {
      provider: 'microsoft',
      providerId: data.id,
      email: email ? email.toLowerCase() : `${data.id}@account.microsoft.com`,
      name: data.displayName || `${data.givenName || ''} ${data.surname || ''}`.trim() || 'Microsoft User',
      avatarUrl: null,
    };
  }

  throw new Error(`Unsupported provider: ${provider}`);
}
