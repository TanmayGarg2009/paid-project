'use client';

import React, { useState, useTransition, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { submitProjectRequest } from '@/actions/requests';
import { PROJECT_TYPES, BUDGET_RANGES, TIMELINE_SLAS } from '@skyline/config';
import { 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Clock, 
  Plus, 
  X, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

function StartProjectForm() {
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams.get('service') || '';

  const [isPending, startTransition] = useTransition();
  const [submittedResult, setSubmittedResult] = useState<{ trackingCode: string; requestId: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('');
  const [projectType, setProjectType] = useState<string>(PROJECT_TYPES[0]);
  const [description, setDescription] = useState('');
  const [goals, setGoals] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [features, setFeatures] = useState<string[]>(['Responsive design', 'Database integration']);
  const [referencesText, setReferencesText] = useState('');
  const [existingUrl, setExistingUrl] = useState('');
  const [budgetRange, setBudgetRange] = useState<string>(BUDGET_RANGES[1].label);
  const [timelinePriority, setTimelinePriority] = useState<'STANDARD' | 'EXPRESS' | 'NEXT_DAY' | 'FLEXIBLE'>('STANDARD');

  const addFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (features.length === 0) {
      setErrorMessage('Please add at least one desired feature.');
      return;
    }

    startTransition(async () => {
      const res = await submitProjectRequest({
        name,
        email,
        discordUsername,
        phoneWhatsApp,
        projectType,
        serviceId: preselectedServiceId || undefined,
        description,
        goals,
        desiredFeatures: features,
        referencesText,
        existingUrl,
        budgetRange,
        timelinePriority,
      });

      if (res.success && res.trackingCode) {
        setSubmittedResult({
          trackingCode: res.trackingCode,
          requestId: res.requestId!,
        });
      } else {
        setErrorMessage(res.error || 'Failed to submit request. Please verify all fields.');
      }
    });
  };

  if (submittedResult) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20 text-center space-y-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Request Received Successfully</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            We are reviewing your project
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Your tracking code has been generated. Skyline lead engineers will evaluate your scope and generate an itemized quote within 24 hours.
          </p>
        </div>

        {/* Tracking Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 max-w-md mx-auto">
          <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Your Project Tracking Code</span>
          <p className="text-2xl font-mono font-extrabold text-accent">{submittedResult.trackingCode}</p>
          <div className="pt-4 border-t border-border text-xs text-muted-foreground space-y-1 text-left">
            <p>• Initial Status: <span className="font-bold text-foreground">REQUESTED</span></p>
            <p>• 50% deposit will be requested once quote is generated.</p>
            <p>• Updates sent to: <span className="font-bold text-foreground">{email}</span></p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-xs font-bold text-primary-foreground shadow"
          >
            Go to Client Portal <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 py-3.5 text-xs font-semibold text-foreground"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">Project Intake</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
          Start a Project with Skyline
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Tell us about your requirements, timeline, and goals. We will review the technical architecture and provide an itemized quote.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-8">
        {errorMessage && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-xs font-medium text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Contact Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-2">
            1. Contact Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Your Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
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
                placeholder="alex@company.com"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Discord Username (Optional)</label>
              <input
                type="text"
                value={discordUsername}
                onChange={(e) => setDiscordUsername(e.target.value)}
                placeholder="e.g. alex_r#1234 or @alex_r"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Phone / WhatsApp (Optional)</label>
              <input
                type="text"
                value={phoneWhatsApp}
                onChange={(e) => setPhoneWhatsApp(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>

        {/* 2. Project Specifications */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-2">
            2. Project Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-foreground">Project Category / Type *</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-foreground">Project Description *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you want to build in detail..."
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-foreground">Primary Business Goals *</label>
              <input
                type="text"
                required
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g. Automate client reports, launch MVP for early adopters"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Desired Features Tag Builder */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-foreground">Key Desired Features *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                placeholder="Type a feature (e.g. Google Login, Razorpay Checkout) and press add"
                className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="button"
                onClick={addFeature}
                className="rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {features.map((feat, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1 text-xs font-medium text-foreground border border-border"
                >
                  {feat}
                  <button type="button" onClick={() => removeFeature(index)} className="text-muted-foreground hover:text-destructive">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Budget & Timeline */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-2">
            3. Budget & Timeline Priority
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Estimated Budget Range *</label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {BUDGET_RANGES.map((b) => (
                  <option key={b.value} value={b.label}>{b.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Target Timeline Priority *</label>
              <select
                value={timelinePriority}
                onChange={(e) => setTimelinePriority(e.target.value as any)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="STANDARD">Standard (~7 Days Target)</option>
                <option value="EXPRESS">Express Sprint (2–3 Days Priority)</option>
                <option value="NEXT_DAY">Next Day Sprint (~24 Hours)</option>
                <option value="FLEXIBLE">Flexible / Complex Scope</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-foreground">Reference Websites / Apps / Inspiration (Optional)</label>
              <input
                type="text"
                value={referencesText}
                onChange={(e) => setReferencesText(e.target.value)}
                placeholder="e.g. Similar to linear.app or stripe.com dashboard"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>

        {/* Value Callout */}
        <div className="rounded-2xl bg-secondary/40 border border-border p-4 text-xs text-muted-foreground flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-accent shrink-0" />
          <span>Submitting this request does not charge your card. You will receive an itemized quote to review first. 50% deposit is only due upon quote acceptance.</span>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <span>Submitting Request...</span>
          ) : (
            <>
              Submit Project Request <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function StartProjectPage() {
  return (
    <React.Suspense fallback={<div className="container mx-auto max-w-4xl px-4 py-20 text-center text-xs text-muted-foreground">Loading intake form...</div>}>
      <StartProjectForm />
    </React.Suspense>
  );
}
