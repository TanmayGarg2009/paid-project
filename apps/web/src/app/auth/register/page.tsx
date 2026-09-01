'use client';

import React, { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sendRegistrationOtp, verifyRegistrationOtp } from '@/actions/auth';
import { NorthStackLogo } from '@/components/ui/NorthStackLogo';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { ArrowRight, AlertCircle, CheckCircle2, Mail, ShieldCheck, RefreshCw, KeyRound } from 'lucide-react';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Registration Form State
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  
  // OTP Verification State
  const [otpCode, setOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Submit Details & Send Email OTP
  const handleInitiateRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const res = await sendRegistrationOtp({
        name,
        email,
        password,
        discordUsername: discordUsername || undefined,
      });

      if (res.success) {
        setStep('verify');
        setResendCooldown(60);
      } else {
        setErrorMessage(res.error || 'Failed to send verification code');
        if (res.cooldownRemainingSeconds) {
          setResendCooldown(res.cooldownRemainingSeconds);
        }
      }
    });
  };

  // Step 2: Verify OTP & Finalize Account Creation
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (otpCode.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    startTransition(async () => {
      const res = await verifyRegistrationOtp(email, otpCode);

      if (res.success) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setErrorMessage(res.error || 'Invalid or expired code. Please try again.');
      }
    });
  };

  // Resend OTP handler
  const handleResendCode = () => {
    if (resendCooldown > 0 || isPending) return;
    setErrorMessage(null);

    startTransition(async () => {
      const res = await sendRegistrationOtp({
        name,
        email,
        password,
        discordUsername: discordUsername || undefined,
      });

      if (res.success) {
        setResendCooldown(60);
      } else {
        setErrorMessage(res.error || 'Failed to resend code');
      }
    });
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-16 sm:py-20">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center pb-1">
            <NorthStackLogo size="md" showText={false} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            {step === 'form' ? 'Create Client Account' : 'Verify Your Email'}
          </h1>
          <p className="text-xs text-muted-foreground">
            {step === 'form'
              ? 'Register to track your NorthStack projects, milestones, and preview links.'
              : `Enter the 6-digit code sent to ${email} to activate your account.`}
          </p>
        </div>

        {/* Step 1: Input Form */}
        {step === 'form' ? (
          <>
            {/* Social Registration */}
            <OAuthButtons mode="register" />

            <div className="relative flex items-center justify-center">
              <div className="border-t border-border w-full" />
              <span className="bg-card px-3 text-[11px] font-mono text-muted-foreground uppercase">
                Or Register with Email OTP
              </span>
              <div className="border-t border-border w-full" />
            </div>

            <form onSubmit={handleInitiateRegister} className="space-y-4">
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
                <span className="text-[10px] text-muted-foreground">
                  You can log in anytime using this password OR instant email OTP.
                </span>
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
                className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow transition-all hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                {isPending ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Sending Verification Code...
                  </>
                ) : (
                  <>
                    Send Verification Code <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            {errorMessage && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-xs text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-3.5 text-center space-y-1">
              <span className="text-xs font-bold text-foreground flex items-center justify-center gap-1.5">
                <Mail className="h-4 w-4 text-accent" /> Check Your Inbox
              </span>
              <p className="text-[11px] text-muted-foreground">
                We sent a 6-digit code to <strong className="text-foreground">{email}</strong>
              </p>
            </div>

            <div className="space-y-2 text-center">
              <label className="text-xs font-bold text-foreground block">
                Enter 6-Digit OTP Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                autoFocus
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full text-center tracking-[0.6em] font-mono text-2xl font-black rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <span className="text-[10px] text-muted-foreground font-mono">
                Code valid for 5 minutes
              </span>
            </div>

            <button
              type="submit"
              disabled={isPending || otpCode.length !== 6}
              className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow transition-all hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              {isPending ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Creating Account & Logging In...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  Verify & Complete Registration
                </>
              )}
            </button>

            {/* Resend Code & Back */}
            <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
              <button
                type="button"
                onClick={() => {
                  setStep('form');
                  setOtpCode('');
                  setErrorMessage(null);
                }}
                className="text-muted-foreground hover:text-foreground hover:underline"
              >
                ← Change Email
              </button>

              <button
                type="button"
                disabled={resendCooldown > 0 || isPending}
                onClick={handleResendCode}
                className={`font-bold transition-colors ${
                  resendCooldown > 0
                    ? 'text-muted-foreground cursor-not-allowed'
                    : 'text-accent hover:underline'
                }`}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>
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
