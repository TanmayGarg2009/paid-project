'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerCustomer } from '@/actions/auth';
import { Layers, ArrowRight, AlertCircle } from 'lucide-react';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const res = await registerCustomer({
        name,
        email,
        password,
        discordUsername: discordUsername || undefined,
      });

      if (res.success) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setErrorMessage(res.error || 'Registration failed');
      }
    });
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-20">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Layers className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Create Client Account</h1>
          <p className="text-xs text-muted-foreground">Register to track your Skyline projects and milestone quotes.</p>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-xs text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivera"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Password (min 8 chars) *</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Discord Username (Optional)</label>
            <input
              type="text"
              value={discordUsername}
              onChange={(e) => setDiscordUsername(e.target.value)}
              placeholder="alex_r#1234"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow transition-all hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? 'Creating Account...' : (
              <>
                Register & Enter Portal <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-border text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-bold text-accent hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
