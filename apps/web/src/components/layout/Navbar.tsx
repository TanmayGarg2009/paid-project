'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, Menu, X, ArrowRight, User } from 'lucide-react';
import { BRAND_CONFIG } from '@skyline/config';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Layers className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-wider leading-none">SKYLINE DIGITAL</span>
            <span className="text-[10px] font-medium text-muted-foreground tracking-wider leading-none mt-1">Digital Product Studio</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/services" className="transition-colors hover:text-foreground">
            Services
          </Link>
          <Link href="/#how-it-works" className="transition-colors hover:text-foreground">
            How It Works
          </Link>
          <Link href="/portfolio" className="transition-colors hover:text-foreground">
            Portfolio
          </Link>
          <Link href="/#reviews" className="transition-colors hover:text-foreground">
            Reviews
          </Link>
          <Link href="/#why-skyline" className="transition-colors hover:text-foreground">
            Why Skyline
          </Link>
        </nav>

        {/* Right Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            Client Portal
          </Link>
          <Link
            href="/start-project"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow"
          >
            Start a Project
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="border-b border-border bg-background px-4 py-6 md:hidden">
          <nav className="flex flex-col gap-4 text-base font-medium">
            <Link href="/services" onClick={() => setMobileOpen(false)} className="hover:text-primary">
              Services
            </Link>
            <Link href="/#how-it-works" onClick={() => setMobileOpen(false)} className="hover:text-primary">
              How It Works
            </Link>
            <Link href="/portfolio" onClick={() => setMobileOpen(false)} className="hover:text-primary">
              Portfolio
            </Link>
            <Link href="/#reviews" onClick={() => setMobileOpen(false)} className="hover:text-primary">
              Reviews
            </Link>
            <Link href="/#why-skyline" onClick={() => setMobileOpen(false)} className="hover:text-primary">
              Why Skyline
            </Link>
            <div className="flex flex-col gap-2.5 pt-4 border-t border-border mt-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-semibold"
              >
                <User className="h-4 w-4" /> Client Portal
              </Link>
              <Link
                href="/start-project"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Start a Project <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
