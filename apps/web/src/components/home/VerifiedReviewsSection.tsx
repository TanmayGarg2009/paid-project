'use client';

import React from 'react';
import Image from 'next/image';
import { Star, CheckCircle2, MessageSquare, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { DEFAULT_REVIEWS } from '@skyline/config';

interface VerifiedReviewsSectionProps {
  reviews?: any[];
}

export function VerifiedReviewsSection({ reviews: initialReviews }: VerifiedReviewsSectionProps) {
  // Use all rich reviews as default baseline
  const reviewsList = DEFAULT_REVIEWS;

  return (
    <section id="reviews" className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent font-mono">
          <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> VERIFIED CLIENT FEEDBACK
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          What clients say about NorthStack Digitals
        </h2>
        <p className="text-sm text-muted-foreground">
          Genuine feedback tied directly to completed, verified NorthStack milestone deliverables.
        </p>
      </div>

      {/* Flagship Discord Chat Proof & Reviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Featured Card: Verified Discord Client Screenshot Proof */}
        <div className="lg:col-span-6 rounded-3xl border border-accent/40 bg-gradient-to-b from-card to-card/90 p-6 sm:p-8 shadow-lg flex flex-col justify-between space-y-6 hover:border-accent hover:shadow-xl transition-all duration-300 group">
          
          <div className="space-y-4">
            
            {/* Top Badge & Verified Tag */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-black uppercase tracking-wider text-accent">
                  DISCORD VERIFIED PROOF
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="h-3.5 w-3.5" /> 100% Client Satisfaction
              </span>
            </div>

            {/* Stars & Headline */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500" />
                ))}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-foreground pt-1">
                "Like the bot according to ur liking? Yes, thanks!"
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct client delivery confirmation for the custom multi-guild Discord bot infrastructure with automated ticket systems, moderation, and Minecraft tier verification.
              </p>
            </div>

            {/* EMBEDDED DISCORD CHAT SCREENSHOT IMAGE */}
            <div className="rounded-2xl border border-border/90 bg-[#1e1f22] p-2 sm:p-3 overflow-hidden shadow-inner space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1 border-b border-slate-700/60 pb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <MessageSquare className="h-3.5 w-3.5 text-[#5865F2]" /> Direct Client Chat Log
                </span>
                <span className="text-[10px] text-slate-400">Verified Timestamp</span>
              </div>
              
              <div className="relative rounded-xl overflow-hidden border border-slate-700/50 bg-[#111214]">
                <img
                  src="/proofs/discord-bot-review-proof.png"
                  alt="Verified Discord Client Review Proof Screenshot (@nox: like the bot according to ur liking?? Yes)"
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                />
              </div>
            </div>

          </div>

          {/* Client Info & Partner Servers */}
          <div className="pt-4 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-foreground block">Nox (@nox)</span>
              <span className="text-[11px] text-muted-foreground font-mono">
                Project: Discord Bot & Server Infrastructure
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <a
                href="https://discord.gg/hzhvkzVVwM"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-[#5865F2] font-bold text-[11px] border border-[#5865F2]/20 transition-all"
              >
                Join Server 1 <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://discord.gg/dhvY2fbBSa"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-[#5865F2] font-bold text-[11px] border border-[#5865F2]/20 transition-all"
              >
                Join Server 2 <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Right 3 Stacked Reviews */}
        <div className="lg:col-span-6 grid grid-cols-1 gap-4">
          
          {reviewsList.slice(1).map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm hover:border-accent/40 hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3" /> Milestone Approved
                  </span>
                </div>
                
                <h4 className="text-sm sm:text-base font-bold text-foreground">
                  "{rev.headline}"
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="font-bold text-foreground text-xs">{rev.user.name}</span>
                <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px]">
                  {rev.project.title}
                </span>
              </div>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}
