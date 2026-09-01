'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerCustomer } from '@/actions/auth';
import { NorthStackLogo } from '@/components/ui/NorthStackLogo';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { OtpLoginForm } from '@/components/auth/OtpLoginForm';
import { ArrowRight, AlertCircle, Mail, KeyRound } from 'lucide-react';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');
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
    <div className="container mx-auto max-w-md px-4 py-16 sm:py-20">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center pb-1">
            <NorthStackLogo size="md" showText={false} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Create Client Account</h1>
          <p className="text-xs text-muted-foreground">Register to track your NorthStack projects, milestones, and preview links.</p>
        </div>

        {/* OAuth Social Register Buttons (Google, GitHub, Microsoft) */}
        <OAuthButtons mode="register" />

        {/* Auth Method Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-secondary/80 border border-border/80 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('otp');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              authMethod === 'otp'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mail className="h-3.5 w-3.5 text-accent" /> One-Time Code
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('password');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              authMethod === 'password'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <KeyRound className="h-3.5 w-3.5" /> Password
          </button>
        </div>

        {authMethod === 'otp' ? (
          <OtpLoginForm mode="register" />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-xs text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

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
                  Register with Password <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-border text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-accent hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
