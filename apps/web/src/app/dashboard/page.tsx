import React from 'react';
import Link from 'next/link';
import { db } from '@skyline/database';
import { getCurrentCustomer } from '@/actions/auth';
import { formatPaiseToINR, formatDate, getDaysRemaining, PROJECT_STATUS_MAP } from '@skyline/shared';
import { 
  FolderGit2, 
  FileText, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export default async function CustomerDashboardPage() {
  const customer = await getCurrentCustomer();
  if (!customer) return null;

  // 1. Fetch Customer's Projects
  const projects = await db.project.findMany({
    where: { customerId: customer.id },
    include: {
      milestones: true,
      service: true,
    },
    orderBy: { updatedAt: 'desc' },
  }).catch(() => []);

  // 2. Fetch Customer's Project Requests & Quotes
  const pendingRequests = await db.projectRequest.findMany({
    where: { email: customer.email.toLowerCase() },
    include: {
      quotes: {
        where: { status: { in: ['SENT', 'VIEWED'] } },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  }).catch(() => []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Welcome, {customer.name || 'Client'}</h1>
          <p className="text-xs text-muted-foreground">Manage your development milestones, quotes, and project deliverables.</p>
        </div>

        <Link
          href="/start-project"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow transition-all hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Start New Project
        </Link>
      </div>

      {/* 1. Pending Quotes Callout */}
      {pendingRequests.some((r) => r.quotes.length > 0) && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-accent" /> Quotes Ready for Your Review
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {pendingRequests.flatMap((r) => r.quotes).map((quote) => (
              <div
                key={quote.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-accent/40 bg-accent/5 p-5 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-accent">{quote.quoteNumber}</span>
                    <span className="text-[10px] bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-bold uppercase">
                      Action Required
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{quote.projectName}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{quote.description}</p>
                  <div className="flex items-center gap-4 text-xs pt-1 text-foreground">
                    <span>Total: <strong>{formatPaiseToINR(quote.totalPricePaise)}</strong></span>
                    <span>Due Now (50%): <strong>{formatPaiseToINR(quote.upfrontAmountPaise)}</strong></span>
                    <span>Target: <strong>~{quote.estimatedDeliveryDays} Days</strong></span>
                  </div>
                </div>

                <Link
                  href={`/dashboard/quotes/${quote.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 shrink-0"
                >
                  Review & Accept Quote <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Active Projects */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
          <FolderGit2 className="h-4 w-4 text-accent" /> Your Projects ({projects.length})
        </h2>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-4">
            <FolderGit2 className="h-10 w-10 text-muted-foreground mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">No active projects yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Submit a project request to receive an itemized quote from Skyline lead engineers.
              </p>
            </div>
            <Link
              href="/start-project"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
            >
              Start a Project <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => {
              const statusInfo = PROJECT_STATUS_MAP[project.status];
              const daysLeft = getDaysRemaining(project.targetDeliveryDate);

              return (
                <div
                  key={project.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 transition-all hover:border-accent/40"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-accent">{project.projectCode}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          project.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          project.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {statusInfo?.label || project.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mt-1">{project.title}</h3>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-accent" />
                        <span>Target: {formatDate(project.targetDeliveryDate)} ({daysLeft > 0 ? `${daysLeft}d left` : 'Due today'})</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Project Value</span>
                      <p className="text-sm font-bold text-foreground mt-0.5">{formatPaiseToINR(project.totalPricePaise)}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Deposit Paid</span>
                      <p className="text-sm font-bold text-emerald-600 mt-0.5">{formatPaiseToINR(project.upfrontPaidPaise)} (50%)</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Revisions</span>
                      <p className="text-sm font-bold text-foreground mt-0.5">{project.revisionsUsed} / {project.revisionsIncluded} used</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      Service: {project.service?.title || 'Custom Engineering'}
                    </span>
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
                    >
                      Open Project Portal <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
