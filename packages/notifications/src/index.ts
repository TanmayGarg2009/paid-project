import { BRAND_CONFIG } from '@skyline/config';
import { formatPaiseToINR } from '@skyline/shared';

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordNotificationPayload {
  title: string;
  description: string;
  color?: number; // Decimal color code (e.g. 0x3b82f6 for blue, 0x10b981 for green)
  fields?: DiscordEmbedField[];
  url?: string;
  footerText?: string;
}

// 1. Send Discord Webhook Notification to Team Channel
export async function sendDiscordNotification(payload: DiscordNotificationPayload): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_OPS_WEBHOOK_URL;
  if (!webhookUrl || webhookUrl.includes('dummy')) {
    console.log('[Discord Ops Bot Notification Simulated]', payload.title, payload.description);
    return true;
  }

  const embed = {
    title: payload.title,
    description: payload.description,
    color: payload.color || 0x0f172a, // Skyline Navy
    fields: payload.fields || [],
    url: payload.url,
    footer: {
      text: payload.footerText || 'Skyline Operations Bot • 2026',
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Skyline Ops Bot',
        avatar_url: 'https://skyline.dev/logo.png',
        embeds: [embed],
      }),
    });

    return res.ok;
  } catch (error) {
    console.error('Failed to dispatch Discord webhook:', error);
    return false;
  }
}

// 2. High-Level Domain Notification Triggers
export async function notifyNewProjectRequest({
  trackingCode,
  customerName,
  projectType,
  budgetRange,
  timelinePriority,
  requestId,
}: {
  trackingCode: string;
  customerName: string;
  projectType: string;
  budgetRange: string;
  timelinePriority: string;
  requestId: string;
}) {
  return await sendDiscordNotification({
    title: `🔔 New Project Request: ${trackingCode}`,
    description: `A new client project request has been received on Skyline.`,
    color: 0x3b82f6, // Blue
    url: `${BRAND_CONFIG.adminUrl}/requests/${requestId}`,
    fields: [
      { name: 'Customer', value: customerName, inline: true },
      { name: 'Project Type', value: projectType, inline: true },
      { name: 'Budget Range', value: budgetRange, inline: true },
      { name: 'Timeline Priority', value: timelinePriority, inline: true },
    ],
  });
}

export async function notifyUpfrontPaymentReceived({
  projectCode,
  customerName,
  amountPaise,
  projectId,
}: {
  projectCode: string;
  customerName: string;
  amountPaise: number;
  projectId: string;
}) {
  return await sendDiscordNotification({
    title: `💰 Upfront 50% Deposit Received: ${projectCode}`,
    description: `Customer has accepted quote and paid 50% upfront. Project is now ACTIVE in development.`,
    color: 0x10b981, // Emerald Green
    url: `${BRAND_CONFIG.adminUrl}/projects/${projectId}`,
    fields: [
      { name: 'Customer', value: customerName, inline: true },
      { name: 'Deposit Paid', value: formatPaiseToINR(amountPaise), inline: true },
      { name: 'Status', value: 'IN_PROGRESS', inline: true },
    ],
  });
}

export async function notifyFinalPaymentReceived({
  projectCode,
  customerName,
  amountPaise,
  projectId,
}: {
  projectCode: string;
  customerName: string;
  amountPaise: number;
  projectId: string;
}) {
  return await sendDiscordNotification({
    title: `🎉 100% Paid in Full: ${projectCode}`,
    description: `Final payment verified. Deliverables are ready for customer download.`,
    color: 0x8b5cf6, // Purple
    url: `${BRAND_CONFIG.adminUrl}/projects/${projectId}`,
    fields: [
      { name: 'Customer', value: customerName, inline: true },
      { name: 'Final Payment', value: formatPaiseToINR(amountPaise), inline: true },
      { name: 'Status', value: 'FINAL_PAYMENT_RECEIVED', inline: true },
    ],
  });
}

export async function notifyNewCustomerMessage({
  projectCode,
  senderName,
  messagePreview,
  projectId,
}: {
  projectCode: string;
  senderName: string;
  messagePreview: string;
  projectId: string;
}) {
  return await sendDiscordNotification({
    title: `💬 New Message on ${projectCode}`,
    description: `**${senderName}**: ${messagePreview.slice(0, 200)}...`,
    color: 0x6366f1, // Indigo
    url: `${BRAND_CONFIG.adminUrl}/projects/${projectId}`,
  });
}

export async function notifyRevisionRequested({
  projectCode,
  revisionNumber,
  summary,
  projectId,
}: {
  projectCode: string;
  revisionNumber: number;
  summary: string;
  projectId: string;
}) {
  return await sendDiscordNotification({
    title: `🔄 Revision #${revisionNumber} Requested on ${projectCode}`,
    description: summary,
    color: 0xf59e0b, // Amber
    url: `${BRAND_CONFIG.adminUrl}/projects/${projectId}`,
  });
}

export async function notifyChangeRequestApproved({
  projectCode,
  crNumber,
  additionalPricePaise,
  projectId,
}: {
  projectCode: string;
  crNumber: string;
  additionalPricePaise: number;
  projectId: string;
}) {
  return await sendDiscordNotification({
    title: `📝 Change Request Approved & Paid: ${crNumber}`,
    description: `Customer approved scope change on ${projectCode} (+${formatPaiseToINR(additionalPricePaise)}).`,
    color: 0x06b6d4, // Cyan
    url: `${BRAND_CONFIG.adminUrl}/projects/${projectId}`,
  });
}

export async function notifyNewReviewSubmitted({
  projectCode,
  rating,
  headline,
}: {
  projectCode: string;
  rating: number;
  headline: string;
}) {
  return await sendDiscordNotification({
    title: `⭐ New ${rating}-Star Review on ${projectCode}`,
    description: `"${headline}"`,
    color: 0xeab308, // Gold
    url: `${BRAND_CONFIG.adminUrl}/reviews`,
  });
}
