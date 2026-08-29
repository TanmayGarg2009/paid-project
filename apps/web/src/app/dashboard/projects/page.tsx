import React from 'react';
import Link from 'next/link';
import { db } from '@skyline/database';
import { getCurrentCustomer } from '@/actions/auth';
import { formatPaiseToINR, formatDate, getDaysRemaining, PROJECT_STATUS_MAP } from '@skyline/shared';
import { FolderGit2, ArrowRight, Clock, Plus } from 'lucide-react';

export default async function CustomerProjectsListPage() {
  const customer = await getCurrentCustomer();
  if (!customer) return null;

  const projects = await db.project.findMany({
    where: { customerId: customer.id },
    include: { service: true },
    orderBy: { updatedAt: 'desc' },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">My Projects</h1>
          <p className="text-xs text-muted-foreground">View and collaborate on all your active and delivered projects.</p>
        </div>
        <Link
          href="/start-project"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Start New
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => {
          const statusInfo = PROJECT_STATUS_MAP[project.status];
          const daysLeft = getDaysRemaining(project.targetDeliveryDate);

          return (
            <div key={project.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-accent">{project.projectCode}</span>
                  <span className="text-xs font-bold text-foreground">{project.title}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-secondary">
                  {statusInfo?.label || project.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                <span>Value: <strong>{formatPaiseToINR(project.totalPricePaise)}</strong></span>
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="font-bold text-accent hover:underline flex items-center gap-1"
                >
                  Open Portal <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
