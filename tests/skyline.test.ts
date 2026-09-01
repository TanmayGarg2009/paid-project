import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { 
  formatPaiseToINR, 
  formatRupeesToPaise, 
  formatPaiseToRupees, 
  generateTrackingCode 
} from '../packages/shared/src/index';
import { 
  calculateMilestones, 
  calculateRemainingProjectBalance, 
  calculateCreatorRevenueSplit,
  verifyPaymentSignature 
} from '../packages/payments/src/index';
import { hashPassword, verifyPassword, isStaff } from '../packages/auth/src/index';
import { createProjectRequestSchema, createQuoteSchema, createChangeRequestSchema } from '../packages/validation/src/index';
import { UserRole } from '../packages/types/src/index';

describe('1. Currency & Paise Integer Arithmetic', () => {
  test('converts rupees to paise and vice versa accurately', () => {
    const rupees = 50000;
    const paise = formatRupeesToPaise(rupees);
    assert.equal(paise, 5000000); // 50,000 * 100
    assert.equal(formatPaiseToRupees(paise), 50000);
  });

  test('formats paise to Indian Rupee standard notation', () => {
    assert.equal(formatPaiseToINR(1000000), '₹10,000');
    assert.equal(formatPaiseToINR(5000000), '₹50,000');
    assert.equal(formatPaiseToINR(25000000), '₹2,50,000');
  });

  test('generates tracking code in standard format NSTK-YYYY-XXXX', () => {
    const code = generateTrackingCode();
    assert.match(code, /^NSTK-\d{4}-\d{4}$/);
  });
});

describe('2. 50/50 Milestone & Balance Calculations', () => {
  test('calculates exact 50% upfront and 50% remaining balance in paise', () => {
    const totalPricePaise = 5000000; // ₹50,000
    const result = calculateMilestones({ totalPricePaise, upfrontPercentage: 50 });

    assert.equal(result.upfrontAmountPaise, 2500000); // ₹25,000
    assert.equal(result.remainingAmountPaise, 2500000); // ₹25,000
    assert.equal(result.upfrontAmountPaise + result.remainingAmountPaise, totalPricePaise);
  });

  test('calculates dynamic remaining balance with approved paid change requests', () => {
    const baseQuotePricePaise = 5000000; // ₹50,000
    const upfrontPaidPaise = 2500000; // ₹25,000 paid
    const changeRequestPaise = 1000000; // ₹10,000 CR approved and paid
    const totalPaidSoFar = upfrontPaidPaise + changeRequestPaise; // ₹35,000 paid

    const balanceResult = calculateRemainingProjectBalance({
      baseQuotePricePaise,
      approvedPaidChangeRequestsPaise: changeRequestPaise,
      totalPaidSoFarPaise: totalPaidSoFar,
    });

    // Total Project Value = ₹50,000 + ₹10,000 = ₹60,000 (6,000,000 paise)
    // Paid So Far = ₹35,000 (3,500,000 paise)
    // Remaining Balance = ₹25,000 (2,500,000 paise)
    assert.equal(balanceResult.totalUpdatedProjectPricePaise, 6000000);
    assert.equal(balanceResult.remainingBalancePaise, 2500000);
    assert.equal(balanceResult.isFullyPaid, false);
  });

  test('calculates creator tier splits for future marketplace architecture', () => {
    const amountPaise = 1000000; // ₹10,000
    const starterSplit = calculateCreatorRevenueSplit(amountPaise, 'STARTER'); // 70/30
    assert.equal(starterSplit.creatorSharePaise, 700000); // ₹7,000
    assert.equal(starterSplit.skylineSharePaise, 300000); // ₹3,000

    const proSplit = calculateCreatorRevenueSplit(amountPaise, 'PROFESSIONAL'); // 90/10
    assert.equal(proSplit.creatorSharePaise, 900000); // ₹9,000
    assert.equal(proSplit.skylineSharePaise, 100000); // ₹1,000
  });

  test('verifies mock test payment signature safely in non-production mode', () => {
    const validTest = verifyPaymentSignature({
      razorpayOrderId: 'order_test_123',
      razorpayPaymentId: 'pay_test_456',
      razorpaySignature: 'sig_test_valid',
    });
    assert.equal(validTest, true);
  });
});

describe('3. Cryptographic Password Hashing & RBAC', () => {
  test('hashes password with salt and successfully verifies', () => {
    const password = 'StrongPassword123!';
    const hash = hashPassword(password);
    assert.ok(hash.includes(':'));

    assert.equal(verifyPassword(password, hash), true);
    assert.equal(verifyPassword('WrongPassword', hash), false);
  });

  test('enforces RBAC role checking', () => {
    assert.equal(isStaff(UserRole.OWNER), true);
    assert.equal(isStaff(UserRole.ADMIN), true);
    assert.equal(isStaff(UserRole.SUPPORT), true);
    assert.equal(isStaff(UserRole.CUSTOMER), false);
  });
});

describe('4. Zod Input Validation & Schema Guardrails', () => {
  test('validates valid project intake payload', () => {
    const validPayload = {
      name: 'Tanmay Garg',
      email: 'tanmay@example.com',
      projectType: 'Web App',
      description: 'Building an enterprise SaaS analytics platform with realtime charts.',
      goals: 'Launch MVP for 50 pilot customers within 2 weeks.',
      desiredFeatures: ['Auth', 'Stripe Billing', 'PostgreSQL Database'],
      budgetRange: '₹50,000 – ₹1,00,000',
      timelinePriority: 'STANDARD' as const,
    };

    const parsed = createProjectRequestSchema.safeParse(validPayload);
    assert.equal(parsed.success, true);
  });

  test('rejects project request with short description or missing features', () => {
    const invalidPayload = {
      name: 'A',
      email: 'not-an-email',
      projectType: '',
      description: 'short',
      goals: '',
      desiredFeatures: [],
      budgetRange: '',
      timelinePriority: 'STANDARD' as const,
    };

    const parsed = createProjectRequestSchema.safeParse(invalidPayload);
    assert.equal(parsed.success, false);
  });

  test('validates quote creation with paise integer price', () => {
    const validQuote = {
      projectRequestId: 'req_123',
      projectName: 'Custom Discord Bot',
      description: 'Full-featured Discord ticket and moderation bot.',
      scope: 'Implement Discord.js v14 bot with ticket system, slash commands, and MongoDB.',
      deliverables: ['Bot Source Code', 'Docker Setup', 'Hosting Guide'],
      exclusions: ['Custom 24/7 dedicated hosting hardware'],
      includedRevisions: 2,
      totalPricePaise: 2500000,
      upfrontPercentage: 50,
      estimatedDeliveryDays: 5,
      quoteExpiresInDays: 14,
      termsAndConditions: 'Standard 50/50 payment milestone terms apply.',
    };

    const parsed = createQuoteSchema.safeParse(validQuote);
    assert.equal(parsed.success, true);
  });

  test('validates Change Request with additional price and days', () => {
    const validCR = {
      projectId: 'prj_123',
      title: 'Add Google OAuth Integration',
      description: 'Implement Google SSO login alongside existing email/password auth.',
      reason: 'Client requested one-click social signup.',
      additionalPricePaise: 500000, // ₹5,000
      additionalDays: 2,
    };

    const parsed = createChangeRequestSchema.safeParse(validCR);
    assert.equal(parsed.success, true);
  });
});

describe('5. OAuth 2.0 & OIDC Flow Security', () => {
  const { generateOAuthState, parseOAuthState, buildAuthorizationUrl, getProviderConfig } = require('../apps/web/src/lib/oauth');

  test('generates secure random state with payload & nonce', () => {
    const state = generateOAuthState('/dashboard/projects');
    assert.ok(state);
    assert.equal(typeof state, 'string');

    const parsed = parseOAuthState(state);
    assert.ok(parsed);
    assert.equal(parsed?.returnTo, '/dashboard/projects');
    assert.ok(parsed?.nonce);
    assert.ok(parsed?.timestamp > 0);
  });

  test('rejects tampered or invalid base64 state strings', () => {
    assert.equal(parseOAuthState('invalid_random_string'), null);
    assert.equal(parseOAuthState(''), null);
    assert.equal(parseOAuthState(Buffer.from('{}').toString('base64url')), null);
  });

  test('constructs valid OAuth 2.0 authorization URLs for Google, GitHub, and Microsoft', () => {
    process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
    process.env.GITHUB_CLIENT_ID = 'test-github-client-id';
    process.env.MICROSOFT_CLIENT_ID = 'test-microsoft-client-id';

    const redirectUri = 'https://northstackdigitals.vercel.app/api/auth/callback/google';
    const state = generateOAuthState();

    // Google
    const googleUrl = buildAuthorizationUrl('google', state, redirectUri);
    assert.ok(googleUrl.startsWith('https://accounts.google.com/o/oauth2/v2/auth'));
    assert.ok(googleUrl.includes('client_id=test-google-client-id'));
    assert.ok(googleUrl.includes('response_type=code'));
    assert.ok(googleUrl.includes('scope=openid+email+profile'));

    // GitHub
    const ghUrl = buildAuthorizationUrl('github', state, 'https://northstackdigitals.vercel.app/api/auth/callback/github');
    assert.ok(ghUrl.startsWith('https://github.com/login/oauth/authorize'));
    assert.ok(ghUrl.includes('client_id=test-github-client-id'));
    assert.ok(ghUrl.includes('scope=read%3Auser+user%3Aemail'));

    // Microsoft
    const msUrl = buildAuthorizationUrl('microsoft', state, 'https://northstackdigitals.vercel.app/api/auth/callback/microsoft');
    assert.ok(msUrl.includes('login.microsoftonline.com'));
    assert.ok(msUrl.includes('client_id=test-microsoft-client-id'));
    assert.ok(msUrl.includes('response_type=code'));
  });
});

describe('6. Email OTP Verification Engine & Security', () => {
  const { generate6DigitOtp, createAndStoreOtp, verifyOtpCode } = require('../apps/web/src/lib/otp-store');

  test('generates valid 6-digit numeric OTP codes', () => {
    const code = generate6DigitOtp();
    assert.equal(code.length, 6);
    assert.match(code, /^\d{6}$/);
  });

  test('creates, stores, and validates OTP code successfully', () => {
    const testEmail = 'client.test@northstackdigitals.com';
    const createRes = createAndStoreOtp(testEmail);
    assert.equal(createRes.success, true);
    assert.ok(createRes.otp);
    assert.equal(createRes.expiresInMinutes, 5);

    // Verify correct OTP
    const verifyRes = verifyOtpCode(testEmail, createRes.otp);
    assert.equal(verifyRes.valid, true);

    // Verifying again should fail as OTP was already consumed
    const reVerifyRes = verifyOtpCode(testEmail, createRes.otp);
    assert.equal(reVerifyRes.valid, false);
  });

  test('enforces rate limiting cooldown on duplicate OTP requests', () => {
    const rateLimitEmail = 'ratelimit@northstackdigitals.com';
    const firstRes = createAndStoreOtp(rateLimitEmail);
    assert.equal(firstRes.success, true);

    // Immediate second request within 60s must fail
    const secondRes = createAndStoreOtp(rateLimitEmail);
    assert.equal(secondRes.success, false);
    assert.ok(secondRes.cooldownRemainingSeconds! > 0);
  });

  test('rejects incorrect OTP and counts attempts', () => {
    const incorrectEmail = 'wrong-otp@northstackdigitals.com';
    createAndStoreOtp(incorrectEmail);

    const fail1 = verifyOtpCode(incorrectEmail, '000000');
    assert.equal(fail1.valid, false);
    assert.match(fail1.error!, /attempt.*remaining/i);
  });

  test('stores and returns pending registration data with password upon OTP verification', () => {
    const regEmail = 'new-user-register@northstackdigitals.com';
    const pendingData = {
      name: 'Jordan Smith',
      email: regEmail,
      passwordHash: 'sample_hashed_password_123',
      discordUsername: 'jordan_s#9999',
    };

    const createRes = createAndStoreOtp(regEmail, pendingData);
    assert.equal(createRes.success, true);
    assert.ok(createRes.otp);

    const verifyRes = verifyOtpCode(regEmail, createRes.otp);
    assert.equal(verifyRes.valid, true);
    assert.deepEqual(verifyRes.pendingRegistration, pendingData);
  });
});


