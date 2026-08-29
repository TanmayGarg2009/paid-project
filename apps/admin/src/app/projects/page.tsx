import React from 'react';
import Link from 'next/link';
import { db } from '@skyline/database';
import { formatPaiseToINR, formatDate, getDaysRemaining, PROJECT_STATUS_MAP } from '@skyline/shared';
import { FolderGit2, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export default async function AdminProjectsListPage() {
  const projects = await db.project.findMany({
    include: { customer: true, service: true },
    orderBy: { updatedAt: 'desc' },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Active Projects Operations</h1>
        <p className="text-xs text-muted-foreground">Manage ongoing development sprints, delivery milestones, and customer deliverables.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((proj) => {
          const statusInfo = PROJECT_STATUS_MAP[proj.status];
          const daysLeft = getDaysRemaining(proj.targetDeliveryDate);

          return (
            <div key={proj.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 transition-all hover:border-accent/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-accent">{proj.projectCode}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      proj.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      proj.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-secondary text-foreground'
                    }`}>
                      {statusInfo?.label || proj.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground mt-1">{proj.title}</h3>
                </div>

                <div className="text-right text-xs">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Target Delivery</span>
                  <p className="font-bold text-foreground">{formatDate(proj.targetDeliveryDate)} ({daysLeft > 0 ? `${daysLeft}d left` : 'Due'})</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Client</span>
                  <p className="font-bold text-foreground">{proj.customer?.name || proj.customer?.email}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Project Value</span>
                  <p className="font-bold text-foreground">{formatPaiseToINR(proj.totalPricePaise)}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Paid Deposit</span>
                  <p className="font-bold text-emerald-600">{formatPaiseToINR(proj.upfrontPaidPaise)} (50%)</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Revisions</span>
                  <p className="font-bold text-foreground">{proj.revisionsUsed} / {proj.revisionsIncluded} used</p>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Service: {proj.service?.title || 'Custom Engineering'}
                </span>
                <Link
                  href={`/projects/${proj.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
                >
                  Manage Project Control <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
