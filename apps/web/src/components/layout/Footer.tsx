import React from 'react';
import Link from 'next/link';
import { BRAND_CONFIG } from '@skyline/config';
import { NorthStackLogo } from '@/components/ui/NorthStackLogo';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <NorthStackLogo size="sm" showText={true} />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Digital products, built around your needs.
            </p>
            <p className="text-[11px] text-muted-foreground">
              Websites, apps, bots, AI systems, Minecraft mods, and custom software.
            </p>
          </div>

          {/* Service Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Services</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/services/custom-saas-web-application" className="hover:text-foreground">Websites & Web Apps</Link></li>
              <li><Link href="/services/custom-discord-bot" className="hover:text-foreground">Bots & Automation</Link></li>
              <li><Link href="/services/enterprise-rag-ai-agent" className="hover:text-foreground">AI Systems & Assistants</Link></li>
              <li><Link href="/services/minecraft-paper-plugin" className="hover:text-foreground">Minecraft Mods & Plugins</Link></li>
              <li><Link href="/services/backend-database-api" className="hover:text-foreground">Backend & Data Systems</Link></li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Platform</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/start-project" className="hover:text-foreground">Start a Project</Link></li>
              <li><Link href="/portfolio" className="hover:text-foreground">Case Studies</Link></li>
              <li><Link href="/#estimator" className="hover:text-foreground">Project Estimator</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-foreground">How It Works (50/50 Model)</Link></li>
              <li><Link href="/#reviews" className="hover:text-foreground">Verified Reviews</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground">Client Portal</Link></li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Connect</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>Email: <a href={`mailto:${BRAND_CONFIG.supportEmail}`} className="text-foreground hover:underline font-semibold">{BRAND_CONFIG.supportEmail}</a></li>
              <li>Discord: <a href={BRAND_CONFIG.social.discord} target="_blank" rel="noreferrer" className="text-foreground hover:underline">NorthStack Community</a></li>
              <li>Working Hours: Mon – Sat (Global Sync)</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} NorthStack Digitals. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/llms.txt" className="hover:text-foreground font-mono font-medium">llms.txt</Link>
            <Link href="/llms-full.txt" className="hover:text-foreground font-mono font-medium">llms-full.txt</Link>
            <span>Target timelines apply per project agreement.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
