import crypto from 'node:crypto';
import Razorpay from 'razorpay';

// Initialize Razorpay client with fallback for test mode
export function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder';

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

// 1. Create Order in Razorpay
export async function createRazorpayOrder({
  amountPaise,
  receipt,
  notes,
}: {
  amountPaise: number;
  receipt: string;
  notes?: Record<string, string>;
}) {
  const client = getRazorpayClient();
  const options = {
    amount: amountPaise,
    currency: 'INR',
    receipt,
    notes: notes || {},
  };

  try {
    const order = await client.orders.create(options);
    return order;
  } catch (error: any) {
    // If in test mode with dummy key, generate mock order ID for development
    if (process.env.NODE_ENV !== 'production' && (!process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET.includes('placeholder'))) {
      return {
        id: `order_mock_${crypto.randomUUID().slice(0, 14)}`,
        entity: 'order',
        amount: amountPaise,
        amount_paid: 0,
        amount_due: amountPaise,
        currency: 'INR',
        receipt,
        status: 'created',
        attempts: 0,
        notes: notes || {},
        created_at: Math.floor(Date.now() / 1000),
      };
    }
    throw error;
  }
}

// 2. Verify Payment Signature (Timing-Safe HMAC SHA-256)
export function verifyPaymentSignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  // Allow test signature in local test mode if configured
  if (
    process.env.NODE_ENV !== 'production' &&
    razorpaySignature.startsWith('sig_test_')
  ) {
    return true;
  }

  const secret = process.env.RAZORPAY_KEY_SECRET || '';
  if (!secret) return false;

  const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf8'),
      Buffer.from(razorpaySignature, 'utf8')
    );
  } catch {
    return false;
  }
}

// 3. Verify Inbound Webhook Signature
export function verifyWebhookSignature({
  rawBody,
  signature,
  webhookSecret,
}: {
  rawBody: string;
  signature: string;
  webhookSecret?: string;
}): boolean {
  const secret = webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf8'),
      Buffer.from(signature, 'utf8')
    );
  } catch {
    return false;
  }
}

// 4. Milestone Calculation Helpers
export function calculateMilestones({
  totalPricePaise,
  upfrontPercentage = 50,
}: {
  totalPricePaise: number;
  upfrontPercentage?: number;
}) {
  const upfrontAmountPaise = Math.round((totalPricePaise * upfrontPercentage) / 100);
  const remainingAmountPaise = totalPricePaise - upfrontAmountPaise;

  return {
    totalPricePaise,
    upfrontPercentage,
    upfrontAmountPaise,
    remainingAmountPaise,
  };
}

// 5. Dynamic Project Balance Calculator (incorporating paid Change Requests)
export function calculateRemainingProjectBalance({
  baseQuotePricePaise,
  approvedPaidChangeRequestsPaise = 0,
  totalPaidSoFarPaise = 0,
}: {
  baseQuotePricePaise: number;
  approvedPaidChangeRequestsPaise?: number;
  totalPaidSoFarPaise?: number;
}) {
  const totalUpdatedProjectPricePaise = baseQuotePricePaise + approvedPaidChangeRequestsPaise;
  const remainingBalancePaise = Math.max(0, totalUpdatedProjectPricePaise - totalPaidSoFarPaise);

  return {
    totalUpdatedProjectPricePaise,
    totalPaidSoFarPaise,
    remainingBalancePaise,
    isFullyPaid: remainingBalancePaise === 0,
  };
}

// 6. FUTURE ARCHITECTURE: Creator Revenue Split (Not active in v1)
export function calculateCreatorRevenueSplit(
  amountPaise: number,
  tier: 'STARTER' | 'VERIFIED' | 'PROFESSIONAL'
) {
  const splits = {
    STARTER: { creatorPct: 0.70, platformPct: 0.30 },
    VERIFIED: { creatorPct: 0.80, platformPct: 0.20 },
    PROFESSIONAL: { creatorPct: 0.90, platformPct: 0.10 },
  };

  const { creatorPct, platformPct } = splits[tier];
  const creatorSharePaise = Math.round(amountPaise * creatorPct);
  const skylineSharePaise = amountPaise - creatorSharePaise;

  return {
    totalAmountPaise: amountPaise,
    creatorSharePaise,
    skylineSharePaise,
    creatorPct: creatorPct * 100,
    platformPct: platformPct * 100,
  };
}
