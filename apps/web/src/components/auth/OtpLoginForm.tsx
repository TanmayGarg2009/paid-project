'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, KeyRound, ArrowRight, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';

interface OtpLoginFormProps {
  mode?: 'login' | 'register';
}

export function OtpLoginForm({ mode = 'login' }: OtpLoginFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to send verification code.');
        if (data.cooldownRemainingSeconds) {
          setCooldown(data.cooldownRemainingSeconds);
        }
      } else {
        setSuccessMsg(data.message || `Code sent to ${email}`);
        setStep('otp');
        setCooldown(60); // 60 seconds resend cooldown
      }
    } catch (err: any) {
      setError(err?.message || 'Network error while sending verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
          name: name.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid verification code.');
      } else {
        setSuccessMsg('Verification successful! Redirecting to portal...');
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 800);
      }
    } catch (err: any) {
      setError(err?.message || 'Network error during verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-xs text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {step === 'email' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Your Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow transition-all hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              'Dispatching Code via Gmail...'
            ) : cooldown > 0 ? (
              `Resend available in ${cooldown}s`
            ) : (
              <>
                <Mail className="h-4 w-4" /> Send One-Time Verification Code
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-1.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <span>Code sent to</span>
              <strong className="text-foreground">{email}</strong>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground block text-center">
              Enter 6-Digit Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              autoFocus
              className="w-full text-center font-mono text-xl tracking-[0.5em] font-black rounded-xl border-2 border-accent/40 bg-background px-3.5 py-2.5 text-foreground focus:outline-none focus:border-accent"
            />
            <p className="text-[11px] text-muted-foreground text-center pt-1">
              Valid for 5 minutes
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow transition-all hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              'Verifying Code...'
            ) : (
              <>
                Verify & Enter Portal <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-between pt-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setOtp('');
                setError(null);
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Change Email
            </button>

            <button
              type="button"
              disabled={cooldown > 0 || loading}
              onClick={handleSendOtp}
              className="text-accent font-bold hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              {cooldown > 0 ? `Resend (${cooldown}s)` : 'Resend Code'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
