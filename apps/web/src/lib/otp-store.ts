import crypto from 'node:crypto';

export interface OtpRecord {
  email: string;
  otp: string;
  expiresAt: number;
  attempts: number;
  lastRequestedAt: number;
}

// Global cache map preserved across HMR in Next.js development
const globalForOtp = globalThis as unknown as {
  _northstack_otp_cache?: Map<string, OtpRecord>;
};

const otpCache = globalForOtp._northstack_otp_cache || new Map<string, OtpRecord>();
if (process.env.NODE_ENV !== 'production') {
  globalForOtp._northstack_otp_cache = otpCache;
}

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_ATTEMPTS = 5;

/**
 * Generate a cryptographically secure 6-digit numeric OTP
 */
export function generate6DigitOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Generate and store OTP for email with rate limiting and TTL
 */
export function createAndStoreOtp(rawEmail: string): {
  success: boolean;
  otp?: string;
  expiresInMinutes: number;
  error?: string;
  cooldownRemainingSeconds?: number;
} {
  const email = rawEmail.toLowerCase().trim();
  const now = Date.now();
  const existing = otpCache.get(email);

  // Enforce 60-second resend cooldown
  if (existing && now - existing.lastRequestedAt < OTP_RESEND_COOLDOWN_MS) {
    const cooldownRemainingSeconds = Math.ceil(
      (OTP_RESEND_COOLDOWN_MS - (now - existing.lastRequestedAt)) / 1000
    );
    return {
      success: false,
      expiresInMinutes: 5,
      cooldownRemainingSeconds,
      error: `Please wait ${cooldownRemainingSeconds}s before requesting a new verification code.`,
    };
  }

  const otp = generate6DigitOtp();

  otpCache.set(email, {
    email,
    otp,
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
    lastRequestedAt: now,
  });

  return {
    success: true,
    otp,
    expiresInMinutes: 5,
  };
}

/**
 * Verify user submitted OTP code
 */
export function verifyOtpCode(
  rawEmail: string,
  rawEnteredOtp: string
): { valid: boolean; error?: string } {
  const email = rawEmail.toLowerCase().trim();
  const enteredOtp = (rawEnteredOtp || '').trim();
  const now = Date.now();

  const record = otpCache.get(email);

  if (!record) {
    return {
      valid: false,
      error: 'No active verification code found for this email. Please request a new one.',
    };
  }

  // Check expiration
  if (now > record.expiresAt) {
    otpCache.delete(email);
    return {
      valid: false,
      error: 'Your verification code has expired. Please request a new one.',
    };
  }

  // Increment and enforce max attempts
  record.attempts += 1;
  if (record.attempts > MAX_ATTEMPTS) {
    otpCache.delete(email);
    return {
      valid: false,
      error: 'Too many incorrect attempts. For your security, please request a new verification code.',
    };
  }

  // Constant-time comparison
  const recordOtpBuf = Buffer.from(record.otp);
  const enteredOtpBuf = Buffer.from(enteredOtp);

  let isMatch = false;
  if (recordOtpBuf.length === enteredOtpBuf.length) {
    isMatch = crypto.timingSafeEqual(recordOtpBuf, enteredOtpBuf);
  }

  if (!isMatch) {
    const attemptsLeft = MAX_ATTEMPTS - record.attempts;
    return {
      valid: false,
      error: `Invalid verification code. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining.`,
    };
  }

  // Success - consume OTP
  otpCache.delete(email);
  return { valid: true };
}

/**
 * Cleanup expired OTP entries periodically
 */
export function cleanupExpiredOtps(): void {
  const now = Date.now();
  for (const [email, record] of otpCache.entries()) {
    if (now > record.expiresAt) {
      otpCache.delete(email);
    }
  }
}
