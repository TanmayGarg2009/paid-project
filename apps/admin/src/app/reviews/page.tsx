import React from 'react';
import { db } from '@skyline/database';
import { formatDate } from '@skyline/shared';
import { Star, CheckCircle2, XCircle } from 'lucide-react';
import { toggleReviewPublish } from '@/actions/admin-ops';

export const revalidate = 0;

export default async function AdminReviewsModerationPage() {
  const reviews = await db.review.findMany({
    include: {
      user: true,
      project: true,
    },
    orderBy: { createdAt: 'desc' },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Client Reviews Moderation</h1>
        <p className="text-xs text-muted-foreground">Moderate and publish verified client project reviews to the homepage and service pages.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
                <span className="text-sm font-bold text-foreground">"{rev.headline}"</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                rev.isPublished ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {rev.isPublished ? 'PUBLISHED' : 'HIDDEN'}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{rev.comment}</p>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
              <span>Client: {rev.user?.name} ({rev.user?.email}) • Project: {rev.project?.projectCode}</span>
              <span>Submitted: {formatDate(rev.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
