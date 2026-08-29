import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '@skyline/database';
import { getCurrentAdmin } from '@/actions/auth';
import { formatPaiseToINR, formatDate, getDaysRemaining, PROJECT_STATUS_MAP } from '@skyline/shared';
import { 
  CreditCard, 
  FolderGit2, 
  Inbox, 
  FileText, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export const revalidate = 0; // Dynamic real-time dashboard

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/login');
  }

  // 1. Fetch Aggregated Metrics
  const totalRevenueAgg = await db.payment.aggregate({
    where: { status: 'PAID' },
    _sum: { amountPaise: true },
    _count: true,
  });
  const totalRevenuePaise = totalRevenueAgg._sum.amountPaise || 0;
  const totalPaymentsCount = totalRevenueAgg._count;

  const totalRequestsCount = await db.projectRequest.count();
  const pendingRequestsCount = await db.projectRequest.count({ where: { status: 'REQUESTED' } });
  
  const activeProjects = await db.project.findMany({
    where: { status: { in: ['IN_PROGRESS', 'INTERNAL_QA', 'CUSTOMER_REVIEW', 'REVISION'] } },
    include: { customer: true },
    orderBy: { targetDeliveryDate: 'asc' },
  });

  const sentQuotesCount = await db.quote.count({ where: { status: { in: ['SENT', 'VIEWED'] } } });

  // 2. Urgent Upcoming Deadlines (within 3 days)
  const urgentProjects = activeProjects.filter((p) => {
    const days = getDaysRemaining(p.targetDeliveryDate);
    return days <= 3;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Operations Dashboard</h1>
          <p className="text-xs text-muted-foreground">Real-time performance metrics and agency project dispatch.</p>
        </div>

        <Link
          href="/requests"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
        >
          <Inbox className="h-4 w-4" /> Triage Requests ({pendingRequestsCount})
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Revenue Paid</span>
            <CreditCard className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-foreground">{formatPaiseToINR(totalRevenuePaise)}</p>
          <p className="text-[11px] text-muted-foreground">{totalPaymentsCount} verified milestone payments</p>
        </div>

        {/* Active Projects */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active In Dev</span>
            <FolderGit2 className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-foreground">{activeProjects.length}</p>
          <p className="text-[11px] text-muted-foreground">Projects currently being built</p>
        </div>

        {/* Pending Requests */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pending Requests</span>
            <Inbox className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-foreground">{pendingRequestsCount}</p>
          <p className="text-[11px] text-muted-foreground">Awaiting quotation review</p>
        </div>

        {/* Sent Quotes */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pending Quotes</span>
            <FileText className="h-4 w-4 text-accent" />
          </div>
          <p className="text-2xl font-extrabold text-foreground">{sentQuotesCount}</p>
          <p className="text-[11px] text-muted-foreground">Quotes awaiting client 50% deposit</p>
        </div>
      </div>

      {/* Urgent Target Deadlines Banner */}
      {urgentProjects.length > 0 && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>Target Deadlines Approaching (≤ 3 Days)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {urgentProjects.map((p) => {
              const days = getDaysRemaining(p.targetDeliveryDate);
              return (
                <div key={p.id} className="bg-card rounded-xl border border-amber-200 p-3.5 space-y-1 shadow-sm">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-foreground">{p.projectCode}</span>
                    <span className="text-amber-700 font-extrabold">{days <= 0 ? 'Due Today' : `${days}d left`}</span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground truncate">{p.title}</h4>
                  <Link href={`/projects/${p.id}`} className="text-[11px] text-accent font-bold hover:underline block pt-1">
                    Open Project Control →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Projects Table */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Live Project Queue</h2>
          <Link href="/projects" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
            All Projects <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {activeProjects.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">No active projects in progress right now.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border text-muted-foreground uppercase font-bold text-[10px]">
                <tr>
                  <th className="pb-3">Code & Project</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Total Value</th>
                  <th className="pb-3">Target Delivery</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeProjects.map((proj) => {
                  const statusInfo = PROJECT_STATUS_MAP[proj.status];
                  return (
                    <tr key={proj.id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-3 font-semibold text-foreground">
                        <span className="font-mono text-accent block text-[11px]">{proj.projectCode}</span>
                        {proj.title}
                      </td>
                      <td className="py-3 text-muted-foreground">{proj.customer?.name || proj.customer?.email}</td>
                      <td className="py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-secondary">
                          {statusInfo?.label || proj.status}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-foreground">{formatPaiseToINR(proj.totalPricePaise)}</td>
                      <td className="py-3 text-muted-foreground">{formatDate(proj.targetDeliveryDate)}</td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/projects/${proj.id}`}
                          className="inline-flex items-center gap-1 font-bold text-accent hover:underline"
                        >
                          Manage <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
