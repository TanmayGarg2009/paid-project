import React from 'react';
import { db } from '@skyline/database';
import { formatDate } from '@skyline/shared';
import { DEFAULT_PORTFOLIO } from '@skyline/config';
import { ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Portfolio & Case Studies',
  description: 'Explore verified client deliverables, plugins, bots, web platforms, and custom software engineered by Skyline.',
};

export default async function PortfolioPage() {
  const dbProjects = await db.portfolioProject.findMany({
    where: { isPublished: true },
    include: { service: true },
    orderBy: { completedAt: 'desc' },
  }).catch(() => []);
  const projects = dbProjects.length > 0 ? dbProjects : DEFAULT_PORTFOLIO;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">Portfolio</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Engineering Case Studies
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          A showcase of custom digital systems delivered across SaaS platforms, high-throughput Minecraft networks, and automation bots.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((proj) => (
          <article
            key={proj.id}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-accent/40"
          >
            <div>
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <img
                  src={proj.coverImage}
                  alt={proj.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-bold">
                  <span className="uppercase tracking-wider">Client: {proj.clientName}</span>
                  <span>{formatDate(proj.completedAt)}</span>
                </div>

                <h2 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                  {proj.title}
                </h2>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {proj.summary}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 border-t border-border flex items-center justify-between">
              <span className="text-[10px] font-semibold text-muted-foreground">
                Category: {(proj as any).service?.title || 'Custom Engineering'}
              </span>
              {proj.liveUrl && (
                <a
                  href={proj.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                >
                  Visit <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
