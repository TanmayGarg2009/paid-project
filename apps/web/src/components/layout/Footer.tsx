import React from 'react';
import Link from 'next/link';
import { Layers } from 'lucide-react';
import { BRAND_CONFIG } from '@skyline/config';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5 font-bold tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Layers className="h-4 w-4" />
              </div>
              <span className="text-lg font-extrabold tracking-wider">SKYLINE</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {BRAND_CONFIG.tagline}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Bespoke websites, apps, bots, AI systems, and custom software.
            </p>
          </div>

          {/* Service Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Services</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/services/custom-saas-web-application" className="hover:text-foreground">Websites & Web Apps</Link></li>
              <li><Link href="/services/custom-discord-bot" className="hover:text-foreground">Bots & Automation</Link></li>
              <li><Link href="/services/enterprise-rag-ai-agent" className="hover:text-foreground">AI Systems & Agents</Link></li>
              <li><Link href="/services/minecraft-paper-plugin" className="hover:text-foreground">Minecraft Development</Link></li>
              <li><Link href="/services/backend-database-api" className="hover:text-foreground">Backend & APIs</Link></li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Platform</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/start-project" className="hover:text-foreground">Start a Project</Link></li>
              <li><Link href="/portfolio" className="hover:text-foreground">Featured Portfolio</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-foreground">How It Works (50/50 Model)</Link></li>
              <li><Link href="/#reviews" className="hover:text-foreground">Client Reviews</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground">Client Portal</Link></li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Connect</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>Email: <a href={`mailto:${BRAND_CONFIG.supportEmail}`} className="text-foreground hover:underline">{BRAND_CONFIG.supportEmail}</a></li>
              <li>Discord: <a href={BRAND_CONFIG.social.discord} target="_blank" rel="noreferrer" className="text-foreground hover:underline">Skyline Community</a></li>
              <li>Hours: Mon – Sat (IST / Global Sync)</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Skyline Digital Services. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Estimated delivery timelines apply per agreed quote.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
