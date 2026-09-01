export * from '@skyline/types';
import { ProjectStatus, PaymentStatus, ChangeRequestStatus, QuoteStatus } from '@skyline/types';

// 1. Currency Formatting
export function formatPaiseToINR(paise: number): string {
  const rupees = Math.round(paise / 100);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

export function formatRupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function formatPaiseToRupees(paise: number): number {
  return Math.round(paise / 100);
}

// 2. Date Formatting
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function getDaysRemaining(targetDate: Date | string): number {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// 3. Status Labels & Badges
export const PROJECT_STATUS_MAP: Record<ProjectStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' }> = {
  [ProjectStatus.REQUESTED]: { label: 'Requested', variant: 'secondary' },
  [ProjectStatus.REVIEWING]: { label: 'Under Review', variant: 'warning' },
  [ProjectStatus.QUOTED]: { label: 'Quoted', variant: 'warning' },
  [ProjectStatus.AWAITING_UPFRONT_PAYMENT]: { label: 'Awaiting 50% Deposit', variant: 'warning' },
  [ProjectStatus.UPFRONT_PAID]: { label: '50% Deposit Paid', variant: 'success' },
  [ProjectStatus.IN_PROGRESS]: { label: 'In Active Development', variant: 'default' },
  [ProjectStatus.INTERNAL_QA]: { label: 'Internal QA Testing', variant: 'default' },
  [ProjectStatus.CUSTOMER_REVIEW]: { label: 'Customer Review & Preview', variant: 'warning' },
  [ProjectStatus.REVISION]: { label: 'Revision in Progress', variant: 'secondary' },
  [ProjectStatus.AWAITING_FINAL_PAYMENT]: { label: 'Awaiting Final 50% Payment', variant: 'warning' },
  [ProjectStatus.FINAL_PAYMENT_RECEIVED]: { label: '100% Paid in Full', variant: 'success' },
  [ProjectStatus.READY_FOR_DELIVERY]: { label: 'Ready for Delivery', variant: 'success' },
  [ProjectStatus.DELIVERED]: { label: 'Delivered', variant: 'success' },
  [ProjectStatus.COMPLETED]: { label: 'Completed', variant: 'success' },
  [ProjectStatus.ON_HOLD]: { label: 'On Hold', variant: 'secondary' },
  [ProjectStatus.CANCELLED]: { label: 'Cancelled', variant: 'destructive' },
  [ProjectStatus.DISPUTED]: { label: 'Disputed', variant: 'destructive' },
  [ProjectStatus.REJECTED]: { label: 'Rejected', variant: 'destructive' },
  [ProjectStatus.EXPIRED]: { label: 'Expired', variant: 'destructive' },
};

export const QUOTE_STATUS_MAP: Record<QuoteStatus, { label: string; variant: 'default' | 'secondary' | 'success' | 'destructive' | 'warning' }> = {
  [QuoteStatus.DRAFT]: { label: 'Draft', variant: 'secondary' },
  [QuoteStatus.SENT]: { label: 'Sent to Customer', variant: 'warning' },
  [QuoteStatus.VIEWED]: { label: 'Viewed by Customer', variant: 'warning' },
  [QuoteStatus.ACCEPTED]: { label: 'Accepted & Bound', variant: 'success' },
  [QuoteStatus.REJECTED]: { label: 'Declined', variant: 'destructive' },
  [QuoteStatus.SUPERSEDED]: { label: 'Superseded by New Version', variant: 'secondary' },
  [QuoteStatus.EXPIRED]: { label: 'Expired', variant: 'destructive' },
};

export const CHANGE_REQUEST_STATUS_MAP: Record<ChangeRequestStatus, { label: string; variant: 'default' | 'secondary' | 'success' | 'destructive' | 'warning' }> = {
  [ChangeRequestStatus.CR_CREATED]: { label: 'Awaiting Customer Review', variant: 'warning' },
  [ChangeRequestStatus.CUSTOMER_APPROVED]: { label: 'Approved by Customer', variant: 'warning' },
  [ChangeRequestStatus.PAYMENT_REQUIRED]: { label: 'Payment Required', variant: 'warning' },
  [ChangeRequestStatus.PAYMENT_VERIFIED]: { label: 'Payment Verified', variant: 'success' },
  [ChangeRequestStatus.APPLIED]: { label: 'Scope & Target Applied', variant: 'success' },
  [ChangeRequestStatus.REJECTED]: { label: 'Declined', variant: 'destructive' },
  [ChangeRequestStatus.CANCELLED]: { label: 'Cancelled', variant: 'secondary' },
};

// 4. Tracking Code Generator
export function generateTrackingCode(): string {
  const year = new Date().getFullYear();
  const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
  return `NSTK-${year}-${randomHex}`;
}
