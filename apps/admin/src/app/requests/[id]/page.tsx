'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createAndSendQuote } from '@/actions/admin-ops';
import { formatPaiseToINR, formatDate, formatRupeesToPaise } from '@skyline/shared';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Plus, 
  X, 
  FileText, 
  Send, 
  AlertCircle, 
  Clock, 
  ShieldCheck,
  Lock
} from 'lucide-react';

export default function AdminRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quote Builder State
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [scope, setScope] = useState('');
  const [deliverableInput, setDeliverableInput] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>([
    'Production Next.js Web Application & API',
    'PostgreSQL Database Schema & Prisma Migrations',
    'Responsive Tailwind UI with Dark Mode',
    'GitHub Repository Codebase Handover',
  ]);
  const [exclusionInput, setExclusionInput] = useState('');
  const [exclusions, setExclusions] = useState<string[]>([
    'Third-party cloud infrastructure subscription costs (Vercel/AWS)',
    'Custom graphic asset illustration design',
  ]);
  const [includedRevisions, setIncludedRevisions] = useState(2);
  const [totalPriceRupees, setTotalPriceRupees] = useState(50000);
  const [upfrontPercentage, setUpfrontPercentage] = useState(50);
  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState(7);
  const [quoteExpiresInDays, setQuoteExpiresInDays] = useState(14);
  const [termsAndConditions, setTermsAndConditions] = useState(
    '50% upfront payment initiates project architecture. 50% balance is due upon internal QA and approved preview. Final source code and production credentials are transferred upon balance verification. Includes 2 revision cycles.'
  );

  const fetchRequest = async () => {
    try {
      const res = await fetch(`/api/admin/requests/${requestId}`);
      const data = await res.json();
      if (data.success && data.request) {
        setRequest(data.request);
        setProjectName(`${data.request.projectType} — ${data.request.name}`);
        setDescription(data.request.description);
        setScope(`Complete implementation of ${data.request.projectType} addressing client goals: ${data.request.goals}`);
      }
    } catch {
      setErrorMessage('Failed to load request brief.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (requestId) fetchRequest();
  }, [requestId]);

  const addDeliverable = () => {
    if (deliverableInput.trim() && !deliverables.includes(deliverableInput.trim())) {
      setDeliverables([...deliverables, deliverableInput.trim()]);
      setDeliverableInput('');
    }
  };

  const removeDeliverable = (idx: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== idx));
  };

  const addExclusion = () => {
    if (exclusionInput.trim() && !exclusions.includes(exclusionInput.trim())) {
      setExclusions([...exclusions, exclusionInput.trim()]);
      setExclusionInput('');
    }
  };

  const removeExclusion = (idx: number) => {
    setExclusions(exclusions.filter((_, i) => i !== idx));
  };

  const handleBuildQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const totalPricePaise = formatRupeesToPaise(totalPriceRupees);
      const res = await createAndSendQuote({
        projectRequestId: requestId,
        projectName,
        description,
        scope,
        deliverables,
        exclusions,
        includedRevisions,
        totalPricePaise,
        upfrontPercentage,
        estimatedDeliveryDays,
        quoteExpiresInDays,
        termsAndConditions,
      });

      if (res.success) {
        setSuccessMessage(`Quote ${res.quoteNumber} created, frozen, and sent to client successfully!`);
        fetchRequest();
      } else {
        setErrorMessage(res.error || 'Failed to generate quote.');
      }
    });
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-muted-foreground">Loading brief...</div>;
  }

  if (!request) {
    return <div className="p-12 text-center text-xs text-destructive">Request brief not found.</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <Link href="/requests" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Requests
      </Link>

      {/* Client Brief Summary */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-accent">{request.trackingCode}</span>
            <h1 className="text-2xl font-extrabold text-foreground mt-1">Client Brief: {request.name}</h1>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full border bg-secondary">
            Status: {request.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Email Address</span>
            <p className="font-bold text-foreground">{request.email}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Budget Indication</span>
            <p className="font-bold text-foreground">{request.budgetRange}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Timeline SLA</span>
            <p className="font-bold text-foreground">{request.timelinePriority}</p>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-border text-xs">
          <span className="font-bold text-foreground">Project Description:</span>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{request.description}</p>
        </div>

        <div className="space-y-2 text-xs">
          <span className="font-bold text-foreground">Primary Goals:</span>
          <p className="text-muted-foreground">{request.goals}</p>
        </div>

        {Array.isArray(request.desiredFeatures) && (
          <div className="space-y-2 text-xs">
            <span className="font-bold text-foreground">Requested Features:</span>
            <div className="flex flex-wrap gap-2 pt-1">
              {(request.desiredFeatures as string[]).map((feat, idx) => (
                <span key={idx} className="rounded-lg bg-secondary px-2.5 py-1 text-xs border border-border">
                  {feat}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Previous Quotes History */}
      {request.quotes?.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Existing Quote Versions</h2>
          <div className="space-y-3">
            {request.quotes.map((q: any) => (
              <div key={q.id} className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-accent">{q.quoteNumber} (v{q.version})</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-card uppercase">
                      {q.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1">{q.projectName}</p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-foreground">{formatPaiseToINR(q.totalPricePaise)}</span>
                  <p className="text-[10px] text-muted-foreground">Expires: {formatDate(q.quoteExpiresAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quote Builder Form */}
      <form onSubmit={handleBuildQuote} className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-border pb-4">
          <h2 className="text-lg font-extrabold text-foreground">Itemized Quote Generator (Freezes on Send)</h2>
          <p className="text-xs text-muted-foreground">Define explicit scope, deliverables, pricing, and timeline. Once sent, this version is frozen.</p>
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-foreground">Project Title</label>
            <input
              type="text"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-foreground">Executive Description</label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-foreground">Detailed Scope of Work</label>
            <textarea
              required
              rows={3}
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Pricing & SLAs */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Total Price (INR ₹)</label>
            <input
              type="number"
              required
              min={1000}
              step={500}
              value={totalPriceRupees}
              onChange={(e) => setTotalPriceRupees(Number(e.target.value))}
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:ring-2 focus:ring-accent"
            />
            <span className="text-[10px] text-muted-foreground">
              50% Upfront: ₹{(totalPriceRupees * 0.5).toLocaleString('en-IN')} | 50% Final: ₹{(totalPriceRupees * 0.5).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Target Delivery Timeline (Days)</label>
            <input
              type="number"
              required
              min={1}
              value={estimatedDeliveryDays}
              onChange={(e) => setEstimatedDeliveryDays(Number(e.target.value))}
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Included Free Revisions</label>
            <input
              type="number"
              required
              min={0}
              value={includedRevisions}
              onChange={(e) => setIncludedRevisions(Number(e.target.value))}
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Quote Expiration (Days)</label>
            <input
              type="number"
              required
              min={1}
              value={quoteExpiresInDays}
              onChange={(e) => setQuoteExpiresInDays(Number(e.target.value))}
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {/* Deliverables Builder */}
        <div className="space-y-2 pt-2 border-t border-border">
          <label className="text-xs font-bold text-foreground">Included Deliverables List</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={deliverableInput}
              onChange={(e) => setDeliverableInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDeliverable(); } }}
              placeholder="Add itemized deliverable..."
              className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:ring-2 focus:ring-accent"
            />
            <button type="button" onClick={addDeliverable} className="rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-bold flex items-center gap-1">
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
          <div className="space-y-1.5 pt-2">
            {deliverables.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-1.5 text-xs border border-border">
                <span>{item}</span>
                <button type="button" onClick={() => removeDeliverable(idx)} className="text-muted-foreground hover:text-destructive">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Exclusions Builder */}
        <div className="space-y-2 pt-2 border-t border-border">
          <label className="text-xs font-bold text-foreground">Exclusions (Out of Scope)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={exclusionInput}
              onChange={(e) => setExclusionInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addExclusion(); } }}
              placeholder="Add exclusion..."
              className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:ring-2 focus:ring-accent"
            />
            <button type="button" onClick={addExclusion} className="rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-bold flex items-center gap-1">
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
          <div className="space-y-1.5 pt-2">
            {exclusions.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-1.5 text-xs border border-border">
                <span>{item}</span>
                <button type="button" onClick={() => removeExclusion(idx)} className="text-muted-foreground hover:text-destructive">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Terms */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <label className="text-xs font-bold text-foreground">Terms & IP Clause</label>
          <textarea
            rows={2}
            value={termsAndConditions}
            onChange={(e) => setTermsAndConditions(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:ring-2 focus:ring-accent"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Send className="h-3.5 w-3.5" /> Freeze & Send Quote to Client
        </button>
      </form>
    </div>
  );
}
