import React from 'react';
import Link from 'next/link';
import { db } from '@skyline/database';
import { formatDate } from '@skyline/shared';
import { Inbox, ArrowRight, Clock, CheckCircle2, FileText } from 'lucide-react';

export const revalidate = 0;

export default async function AdminRequestsListPage() {
  const requests = await db.projectRequest.findMany({
    include: {
      service: true,
      quotes: { orderBy: { createdAt: 'desc' } },
    },
    orderBy: { createdAt: 'desc' },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Project Requests Triage</h1>
        <p className="text-xs text-muted-foreground">Review incoming client briefs, specify scopes, and build official milestone quotes.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requests.map((req) => (
          <div key={req.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 transition-all hover:border-accent/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-accent">{req.trackingCode}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    req.status === 'REQUESTED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    req.status === 'QUOTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    'bg-secondary text-foreground'
                  }`}>
                    {req.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground mt-1">{req.projectType} — for {req.name}</h3>
              </div>

              <div className="text-right text-xs text-muted-foreground">
                <span>Received: {formatDate(req.createdAt)}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2">{req.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Client Email</span>
                <p className="font-bold text-foreground">{req.email}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Budget Range</span>
                <p className="font-bold text-foreground">{req.budgetRange}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Timeline Priority</span>
                <p className="font-bold text-foreground">{req.timelinePriority}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Generated Quotes</span>
                <p className="font-bold text-foreground">{req.quotes.length} versions</p>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                Discord: {req.discordUsername || 'N/A'} • WhatsApp: {req.phoneWhatsApp || 'N/A'}
              </span>
              <Link
                href={`/requests/${req.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
              >
                <FileText className="h-3.5 w-3.5" /> Inspect Brief & Build Quote <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
