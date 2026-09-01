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
