'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  formatPaiseToINR, 
  formatDate, 
  formatDateTime,
  getDaysRemaining, 
  PROJECT_STATUS_MAP,
  CHANGE_REQUEST_STATUS_MAP
} from '@skyline/shared';
import { 
  sendCustomerMessage, 
  requestProjectRevision, 
  approveChangeRequest, 
  verifyAndProcessMilestonePayment,
  submitProjectReview
} from '@/actions/projects';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  FileCode, 
  AlertCircle, 
  Download, 
  Send, 
  Plus, 
  Star, 
  Lock, 
  ShieldCheck, 
  ExternalLink,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export default function CustomerProjectPortalPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'deliverables' | 'revisions' | 'payments' | 'review'>('overview');
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [messageContent, setMessageContent] = useState('');
  const [revisionDesc, setRevisionDesc] = useState('');
  const [revisionDetails, setRevisionDetails] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHeadline, setReviewHeadline] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/customer/projects/${projectId}`);
      const data = await res.json();
      if (data.success && data.project) {
        setProject(data.project);
      } else {
        setErrorMessage('Project not found or unauthorized.');
      }
    } catch {
      setErrorMessage('Failed to load project details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchProject();
  }, [projectId]);

  // Actions
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) return;

    startTransition(async () => {
      const res = await sendCustomerMessage({ projectId, content: messageContent });
      if (res.success) {
        setMessageContent('');
        fetchProject();
      }
    });
  };

  const handleRequestRevision = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    startTransition(async () => {
      const res = await requestProjectRevision({
        projectId,
        description: revisionDesc,
        feedbackDetails: revisionDetails,
      });
      if (res.success) {
        setSuccessMessage('Revision request submitted to Skyline engineers.');
        setRevisionDesc('');
        setRevisionDetails('');
        fetchProject();
      } else {
        setErrorMessage(res.error || 'Failed to submit revision.');
      }
    });
  };

  const handleApproveCR = (crId: string) => {
    setErrorMessage(null);
    startTransition(async () => {
      const res = await approveChangeRequest(crId);
      if (res.success) {
        setSuccessMessage(res.message || 'Change Request approved.');
        fetchProject();
      } else {
        setErrorMessage(res.error || 'Failed to approve Change Request.');
      }
    });
  };

  const handlePayFinal50 = () => {
    setErrorMessage(null);
    const finalMilestone = project.milestones?.find((m: any) => m.type === 'FINAL_BALANCE');
    if (!finalMilestone) {
      setErrorMessage('Final milestone not found.');
      return;
    }

    startTransition(async () => {
      const res = await verifyAndProcessMilestonePayment({
        projectId,
        milestoneId: finalMilestone.id,
        razorpayOrderId: `order_final_${Date.now()}`,
        razorpayPaymentId: `pay_final_${Date.now()}`,
        razorpaySignature: `sig_test_verified_${Date.now()}`,
      });

      if (res.success) {
        setSuccessMessage('Final 50% payment verified! Deliverables are now unlocked.');
        fetchProject();
      } else {
        setErrorMessage(res.error || 'Payment failed.');
      }
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    startTransition(async () => {
      const res = await submitProjectReview({
        projectId,
        rating: reviewRating,
        headline: reviewHeadline,
        comment: reviewComment,
      });
      if (res.success) {
        setSuccessMessage('Thank you! Your verified review has been published.');
        fetchProject();
      } else {
        setErrorMessage(res.error || 'Failed to submit review.');
      }
    });
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-muted-foreground">Loading project portal...</div>;
  }

  if (!project) {
    return (
      <div className="p-12 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
        <h2 className="text-base font-bold text-foreground">Project Not Found</h2>
        <Link href="/dashboard" className="text-xs text-accent font-bold hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const daysLeft = getDaysRemaining(project.targetDeliveryDate);
  const statusInfo = PROJECT_STATUS_MAP[project.status as keyof typeof PROJECT_STATUS_MAP];

  return (
    <div className="space-y-6 max-w-5xl">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
      </Link>

      {/* Project Header Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-accent">{project.projectCode}</span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                project.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                project.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {statusInfo?.label || project.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{project.title}</h1>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="bg-secondary px-3.5 py-2 rounded-xl text-right">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Target Delivery</span>
              <p className="font-bold text-foreground">{formatDate(project.targetDeliveryDate)}</p>
            </div>
          </div>
        </div>

        {/* Milestone Financial Progress */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-secondary/40 p-4 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Project Value</span>
            <p className="text-base font-extrabold text-foreground mt-0.5">{formatPaiseToINR(project.totalPricePaise)}</p>
          </div>
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-800">Paid So Far</span>
            <p className="text-base font-extrabold text-emerald-700 mt-0.5">
              {formatPaiseToINR(project.upfrontPaidPaise + project.finalPaidPaise)}
            </p>
          </div>
          <div className="bg-secondary/40 p-4 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Remaining Balance</span>
            <p className="text-base font-extrabold text-foreground mt-0.5">
              {formatPaiseToINR(Math.max(0, project.totalPricePaise - (project.upfrontPaidPaise + project.finalPaidPaise)))}
            </p>
          </div>
        </div>
      </div>

      {/* Notifications / Alerts */}
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

      {/* Navigation Tabs */}
      <div className="flex border-b border-border gap-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview & Scope', icon: FileCheck },
          { id: 'messages', label: `Messages (${project.messages?.length || 0})`, icon: MessageSquare },
          { id: 'deliverables', label: `Deliverables (${project.deliverables?.length || 0})`, icon: FileCode },
          { id: 'revisions', label: `Revisions & Changes (${project.revisions?.length || 0})`, icon: Clock },
          { id: 'payments', label: `Receipts (${project.payments?.length || 0})`, icon: ShieldCheck },
          { id: 'review', label: 'Review & Feedback', icon: Star },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-accent text-accent font-extrabold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Project Scope & Deliverables</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{project.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground">Included Revisions</h4>
              <p className="text-xs text-muted-foreground">
                {project.revisionsUsed} of {project.revisionsIncluded} revisions used.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground">Target Delivery Date</h4>
              <p className="text-xs text-muted-foreground">
                {formatDate(project.targetDeliveryDate)} ({daysLeft > 0 ? `${daysLeft} days remaining` : 'Target date reached'})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Messages */}
      {activeTab === 'messages' && (
        <div className="rounded-3xl border border-border bg-card p-6 space-y-6 shadow-sm">
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {project.messages?.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">No messages yet. Send a note to the Skyline lead engineer below.</p>
            ) : (
              project.messages?.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isFromAdmin ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-md rounded-2xl p-4 text-xs space-y-1 shadow-sm ${
                      msg.isFromAdmin
                        ? 'bg-secondary text-foreground rounded-tl-sm'
                        : 'bg-primary text-primary-foreground rounded-tr-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 font-bold text-[10px] opacity-75">
                      <span>{msg.isFromAdmin ? 'Skyline Engineer' : 'You'}</span>
                      <span>{formatDateTime(msg.createdAt)}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t border-border">
            <input
              type="text"
              required
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type your message or project question..."
              className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1"
            >
              <Send className="h-3.5 w-3.5" /> Send
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: Deliverables Vault */}
      {activeTab === 'deliverables' && (
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Secure Deliverables Vault</h3>
            <p className="text-xs text-muted-foreground">Access preview staging links and unlock final verified source files.</p>
          </div>

          {project.deliverables?.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
              Deliverables are currently being engineered and QA'd. Preview links will appear here once ready.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {project.deliverables?.map((deliv: any) => {
                const isLocked = deliv.accessLevel.includes('LOCKED');
                return (
                  <div
                    key={deliv.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/30 p-5 shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{deliv.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isLocked ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {isLocked ? 'LOCKED — Awaiting Final Payment' : 'READY TO DOWNLOAD'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{deliv.description}</p>
                    </div>

                    {isLocked ? (
                      <button
                        onClick={handlePayFinal50}
                        className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 flex items-center gap-1.5 shrink-0"
                      >
                        <Lock className="h-3.5 w-3.5" /> Pay Final 50% to Unlock
                      </button>
                    ) : (
                      <a
                        href={deliv.externalUrl || `/api/storage/download?key=${encodeURIComponent(deliv.fileKey || '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl bg-accent px-4 py-2 text-xs font-bold text-accent-foreground shadow hover:bg-accent/90 flex items-center gap-1.5 shrink-0"
                      >
                        <Download className="h-3.5 w-3.5" /> Download Deliverable
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Revisions & Change Requests */}
      {activeTab === 'revisions' && (
        <div className="space-y-6">
          {/* Change Requests Section */}
          {project.changeRequests?.length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Formal Scope Change Requests</h3>
              <div className="space-y-4">
                {project.changeRequests?.map((cr: any) => (
                  <div key={cr.id} className="rounded-2xl border border-border bg-secondary/30 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-accent">{cr.crNumber}</span>
                        <span className="text-sm font-bold text-foreground">{cr.title}</span>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full uppercase">
                        {cr.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{cr.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                      <span>Additional Fee: <strong>{formatPaiseToINR(cr.additionalPricePaise)}</strong> (+{cr.additionalDays} days)</span>
                      {cr.status === 'CR_CREATED' && (
                        <button
                          onClick={() => handleApproveCR(cr.id)}
                          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
                        >
                          Approve Scope Change
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* In-Scope Revision Request Form */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Request In-Scope Revision</h3>
                <p className="text-xs text-muted-foreground">Adjustments to copy, colors, alignment, or layout within agreed scope.</p>
              </div>
              <span className="text-xs font-bold bg-secondary px-3 py-1.5 rounded-xl border border-border">
                {project.revisionsUsed} / {project.revisionsIncluded} Revisions Used
              </span>
            </div>

            <form onSubmit={handleRequestRevision} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Revision Summary</label>
                <input
                  type="text"
                  required
                  value={revisionDesc}
                  onChange={(e) => setRevisionDesc(e.target.value)}
                  placeholder="e.g. Change hero button color to navy and fix navbar padding"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Detailed Feedback & Adjustments</label>
                <textarea
                  required
                  rows={3}
                  value={revisionDetails}
                  onChange={(e) => setRevisionDetails(e.target.value)}
                  placeholder="Provide precise bullet points of the adjustments requested..."
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <button
                type="submit"
                disabled={isPending || project.revisionsUsed >= project.revisionsIncluded}
                className="rounded-xl bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
              >
                {project.revisionsUsed >= project.revisionsIncluded ? 'Revision Limit Reached' : 'Submit Revision Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Payments */}
      {activeTab === 'payments' && (
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Verified Payment Receipts</h3>
          {project.payments?.length === 0 ? (
            <p className="text-xs text-muted-foreground">No payments recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {project.payments?.map((pay: any) => (
                <div key={pay.id} className="flex items-center justify-between rounded-2xl border border-border bg-secondary/30 p-4 text-xs">
                  <div>
                    <span className="font-mono font-bold text-foreground">{pay.receiptNumber}</span>
                    <p className="text-muted-foreground text-[11px] mt-0.5">Razorpay ID: {pay.razorpayPaymentId}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-foreground text-sm">{formatPaiseToINR(pay.amountPaise)}</span>
                    <p className="text-emerald-700 font-bold text-[10px] uppercase">PAID & VERIFIED</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Review & Feedback */}
      {activeTab === 'review' && (
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Client Review & Testimonial</h3>
            <p className="text-xs text-muted-foreground">Share your verified experience working with Skyline.</p>
          </div>

          {project.review ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: project.review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500" />
                ))}
              </div>
              <h4 className="text-sm font-bold text-foreground">"{project.review.headline}"</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{project.review.comment}</p>
              <span className="text-[10px] text-emerald-700 font-bold">✓ Published Verified Review</span>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star className={`h-6 w-6 ${reviewRating >= star ? 'fill-amber-500' : 'text-muted-foreground'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Review Headline</label>
                <input
                  type="text"
                  required
                  value={reviewHeadline}
                  onChange={(e) => setReviewHeadline(e.target.value)}
                  placeholder="e.g. Exceptional engineering and clear milestone delivery"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Detailed Feedback</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe your experience with the development quality, communication, and target delivery..."
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="rounded-xl bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
              >
                Submit Verified Review
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
