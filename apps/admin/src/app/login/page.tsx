'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/actions/auth';
import { Layers, ArrowRight, AlertCircle, ShieldAlert } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const res = await loginAdmin({ email, password });
      if (res.success) {
        router.push('/');
        router.refresh();
      } else {
        setErrorMessage(res.error || 'Access denied. Administrator privileges required.');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Layers className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">NorthStack Operations Command</h1>
          <p className="text-xs text-muted-foreground">Restricted to authorized NorthStack Digitals administrative personnel.</p>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-xs text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@skyline.dev"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Security Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow transition-all hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? 'Verifying Credentials...' : (
              <>
                Enter Operations Center <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-border text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
          <span>All administrative access and operations are cryptographically audited.</span>
        </div>
      </div>
    </div>
  );
}
