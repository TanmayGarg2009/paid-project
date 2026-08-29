'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { notFound, useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { formatPaiseToINR, formatDate } from '@skyline/shared';
import { acceptQuote, verifyAndProcessMilestonePayment } from '@/actions/projects';
import { 
  FileText, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  XCircle,
  Lock
} from 'lucide-react';

export default function QuoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const quoteId = params.id as string;

  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const res = await fetch(`/api/quotes/${quoteId}`);
        const data = await res.json();
        if (data.success && data.quote) {
          setQuote(data.quote);
        } else {
          setErrorMessage('Quote not found or unavailable.');
        }
      } catch (err) {
        setErrorMessage('Failed to load quote details.');
      } finally {
        setLoading(false);
      }
    }
    if (quoteId) fetchQuote();
  }, [quoteId]);

  const handleAcceptAndPay = () => {
    setErrorMessage(null);
    startTransition(async () => {
      // Step 1: Accept Quote
      const acceptRes = await acceptQuote(quoteId);
      if (!acceptRes.success || !acceptRes.projectId) {
        setErrorMessage(acceptRes.error || 'Failed to accept quote.');
        return;
      }

      const projectId = acceptRes.projectId;

      // Step 2: Fetch created upfront milestone
      const milRes = await fetch(`/api/projects/${projectId}/milestones`);
      const milData = await milRes.json();
      const upfrontMilestone = milData?.milestones?.find((m: any) => m.type === 'UPFRONT_50');

      if (!upfrontMilestone) {
        setErrorMessage('Milestone setup error. Please contact support.');
        return;
      }

      // Step 3: Simulate / Execute Razorpay Payment Verification
      const paymentRes = await verifyAndProcessMilestonePayment({
        projectId,
        milestoneId: upfrontMilestone.id,
        razorpayOrderId: `order_sky_${Date.now()}`,
        razorpayPaymentId: `pay_sky_${Date.now()}`,
        razorpaySignature: `sig_test_verified_${Date.now()}`,
      });

      if (paymentRes.success) {
        setSuccessMessage('Quote accepted and 50% upfront deposit verified! Redirecting to your active project portal...');
        setTimeout(() => {
          router.push(`/dashboard/projects/${projectId}`);
        }, 1500);
      } else {
        setErrorMessage(paymentRes.error || 'Payment verification failed.');
      }
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl p-12 text-center text-xs text-muted-foreground">
        Loading official quote documents...
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="container mx-auto max-w-md p-12 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
        <h2 className="text-base font-bold text-foreground">Quote Not Found</h2>
        <p className="text-xs text-muted-foreground">This quote may have expired or been superseded.</p>
        <Link href="/dashboard" className="text-xs text-accent font-bold hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
      </Link>

      {/* Header Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-accent">{quote.quoteNumber}</span>
              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold uppercase">
                {quote.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{quote.projectName}</h1>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Quote Expiration</span>
            <p className="text-xs font-bold text-foreground">{formatDate(quote.quoteExpiresAt)}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">{quote.description}</p>
      </div>

      {/* Financial Breakdown Card */}
      <div className="rounded-3xl border border-accent/40 bg-accent/5 p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Milestone Financial Breakdown</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-card p-4 rounded-xl border border-border">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Project Scope Value</span>
            <p className="text-2xl font-extrabold text-foreground mt-1">{formatPaiseToINR(quote.totalPricePaise)}</p>
          </div>

          <div className="bg-card p-4 rounded-xl border border-emerald-300 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-emerald-700">Due Now (50% Upfront)</span>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">{formatPaiseToINR(quote.upfrontAmountPaise)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Initiates active development</p>
          </div>

          <div className="bg-card p-4 rounded-xl border border-border">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Final Payment (50%)</span>
            <p className="text-2xl font-extrabold text-foreground mt-1">{formatPaiseToINR(quote.remainingAmountPaise)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Due only upon approved preview</p>
          </div>
        </div>
      </div>

      {/* Scope, Deliverables & Exclusions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scope & Deliverables */}
        <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Included Deliverables</h3>
          {Array.isArray(quote.deliverables) && (
            <ul className="space-y-2">
              {(quote.deliverables as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="pt-4 border-t border-border space-y-1 text-xs">
            <span className="font-bold text-foreground">Included Revisions:</span>
            <span className="text-muted-foreground ml-1.5">{quote.includedRevisions} revisions within agreed scope</span>
          </div>
        </div>

        {/* Exclusions & Terms */}
        <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Exclusions & Out of Scope</h3>
          {Array.isArray(quote.exclusions) && quote.exclusions.length > 0 ? (
            <ul className="space-y-2">
              {(quote.exclusions as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <XCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">No specific exclusions noted.</p>
          )}

          <div className="pt-4 border-t border-border space-y-1 text-xs">
            <span className="font-bold text-foreground">Target Delivery Timeline:</span>
            <span className="text-muted-foreground ml-1.5">~{quote.estimatedDeliveryDays} business days</span>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Box */}
      <div className="rounded-2xl bg-secondary/40 border border-border p-6 space-y-2 text-xs text-muted-foreground">
        <h4 className="font-bold text-foreground">Terms of Engagement & Intellectual Property</h4>
        <p className="leading-relaxed">{quote.termsAndConditions}</p>
      </div>

      {/* Action Footer */}
      {errorMessage && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-xs text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {quote.status === 'SENT' || quote.status === 'VIEWED' ? (
        <div className="rounded-3xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-muted-foreground">Upfront deposit due today:</span>
            <p className="text-xl font-extrabold text-foreground">{formatPaiseToINR(quote.upfrontAmountPaise)}</p>
          </div>

          <button
            onClick={handleAcceptAndPay}
            disabled={isPending}
            className="w-full sm:w-auto rounded-xl bg-primary px-8 py-3.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? 'Processing Acceptance & Payment...' : (
              <>
                <Lock className="h-3.5 w-3.5" /> Accept Quote & Pay 50% Deposit <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-secondary/30 p-4 text-center text-xs text-muted-foreground">
          This quote is currently <strong className="text-foreground">{quote.status}</strong> and cannot be accepted again.
        </div>
      )}
    </div>
  );
}
