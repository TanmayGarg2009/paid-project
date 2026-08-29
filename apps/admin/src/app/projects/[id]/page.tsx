'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  updateProjectStatus, 
  extendProjectDeadline, 
  createChangeRequest, 
  addProjectDeliverable 
} from '@/actions/admin-ops';
import { 
  formatPaiseToINR, 
  formatDate, 
  formatDateTime, 
  formatRupeesToPaise,
  PROJECT_STATUS_MAP,
  ProjectStatus,
  DeliverableAccessLevel,
  DeliverableType
} from '@skyline/shared';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  FileCode, 
  Plus, 
  Send, 
  AlertCircle, 
  Upload, 
  Lock, 
  History,
  FileCheck,
  ShieldCheck
} from 'lucide-react';

export default function AdminProjectControlPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'control' | 'messages' | 'deliverables' | 'cr' | 'history'>('control');
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Status Machine
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>(ProjectStatus.IN_PROGRESS);
  const [statusReason, setStatusReason] = useState('');

  // Deadline Extension
  const [newDeadline, setNewDeadline] = useState('');
  const [deadlineReason, setDeadlineReason] = useState('');

  // Deliverable Upload
  const [delivTitle, setDelivTitle] = useState('');
  const [delivDesc, setDelivDesc] = useState('');
  const [delivType, setDelivType] = useState<DeliverableType>(DeliverableType.PREVIEW_LINK);
  const [delivAccess, setDelivAccess] = useState<DeliverableAccessLevel>(DeliverableAccessLevel.PREVIEW_AVAILABLE);
  const [delivUrl, setDelivUrl] = useState('');

  // Change Request Form
  const [crTitle, setCrTitle] = useState('');
  const [crDesc, setCrDesc] = useState('');
  const [crReason, setCrReason] = useState('');
  const [crPriceRupees, setCrPriceRupees] = useState(10000);
  const [crDays, setCrDays] = useState(3);

  // Chat reply
  const [adminMsg, setAdminMsg] = useState('');

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`);
      const data = await res.json();
      if (data.success && data.project) {
        setProject(data.project);
        setSelectedStatus(data.project.status);
      }
    } catch {
      setErrorMessage('Failed to load project.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchProject();
  }, [projectId]);

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    startTransition(async () => {
      const res = await updateProjectStatus({
        projectId,
        newStatus: selectedStatus,
        reason: statusReason,
      });
      if (res.success) {
        setSuccessMessage(`Project transitioned to ${selectedStatus}`);
        setStatusReason('');
        fetchProject();
      } else {
        setErrorMessage(res.error || 'Failed to update status.');
      }
    });
  };

  const handleExtendDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    startTransition(async () => {
      const res = await extendProjectDeadline({
        projectId,
        newTargetDate: newDeadline,
        reason: deadlineReason,
      });
      if (res.success) {
        setSuccessMessage('Target deadline updated and logged to audit trail.');
        setDeadlineReason('');
        fetchProject();
      } else {
        setErrorMessage(res.error || 'Failed to update deadline.');
      }
    });
  };

  const handleAddDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    startTransition(async () => {
      const res = await addProjectDeliverable({
        projectId,
        title: delivTitle,
        description: delivDesc,
        type: delivType,
        accessLevel: delivAccess,
        externalUrl: delivUrl || undefined,
      });
      if (res.success) {
        setSuccessMessage('Deliverable added to secure project vault.');
        setDelivTitle('');
        setDelivDesc('');
        setDelivUrl('');
        fetchProject();
      } else {
        setErrorMessage(res.error || 'Failed to add deliverable.');
      }
    });
  };

  const handleCreateCR = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    startTransition(async () => {
      const additionalPricePaise = formatRupeesToPaise(crPriceRupees);
      const res = await createChangeRequest({
        projectId,
        title: crTitle,
        description: crDesc,
        reason: crReason,
        additionalPricePaise,
        additionalDays: crDays,
      });
      if (res.success) {
        setSuccessMessage(`Change Request ${res.crNumber} created and sent to customer for review.`);
        setCrTitle('');
        setCrDesc('');
        setCrReason('');
        fetchProject();
      } else {
        setErrorMessage(res.error || 'Failed to create Change Request.');
      }
    });
  };

  const handleSendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminMsg.trim()) return;

    try {
      await fetch(`/api/admin/projects/${projectId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: adminMsg }),
      });
      setAdminMsg('');
      fetchProject();
    } catch {
      setErrorMessage('Failed to send reply.');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-muted-foreground">Loading project control console...</div>;
  }

  if (!project) {
    return <div className="p-12 text-center text-xs text-destructive">Project not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <Link href="/projects" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
      </Link>

      {/* Header Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-accent">{project.projectCode}</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-secondary">
                {project.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">{project.title}</h1>
            <p className="text-xs text-muted-foreground mt-1">Client: {project.customer?.name} ({project.customer?.email})</p>
          </div>

          <div className="text-right text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Target Delivery Date</span>
            <p className="font-extrabold text-foreground">{formatDate(project.targetDeliveryDate)}</p>
          </div>
        </div>

        {/* Milestone Financial Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-secondary/40 p-4 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Base Scope Value</span>
            <p className="text-base font-extrabold text-foreground mt-0.5">{formatPaiseToINR(project.totalPricePaise)}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-800">50% Upfront Paid</span>
            <p className="text-base font-extrabold text-emerald-700 mt-0.5">{formatPaiseToINR(project.upfrontPaidPaise)}</p>
          </div>
          <div className="bg-secondary/40 p-4 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Final Balance Due</span>
            <p className="text-base font-extrabold text-foreground mt-0.5">
              {formatPaiseToINR(Math.max(0, project.totalPricePaise - project.upfrontPaidPaise - project.finalPaidPaise))}
            </p>
          </div>
          <div className="bg-secondary/40 p-4 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Revisions Used</span>
            <p className="text-base font-extrabold text-foreground mt-0.5">{project.revisionsUsed} / {project.revisionsIncluded}</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-xs text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border gap-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'control', label: 'Status & Deadlines', icon: ShieldCheck },
          { id: 'messages', label: `Direct Messages (${project.messages?.length || 0})`, icon: MessageSquare },
          { id: 'deliverables', label: `Deliverables (${project.deliverables?.length || 0})`, icon: FileCode },
          { id: 'cr', label: `Change Requests (${project.changeRequests?.length || 0})`, icon: Plus },
          { id: 'history', label: 'Deadline Audit History', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-accent text-accent font-extrabold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: Status & Deadlines */}
      {activeTab === 'control' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Transition Machine */}
          <form onSubmit={handleUpdateStatus} className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Project Lifecycle Transition</h3>
            <p className="text-xs text-muted-foreground">Transition state and record formal operational reason.</p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Select New Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ProjectStatus)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:ring-2 focus:ring-accent"
              >
                <option value={ProjectStatus.IN_PROGRESS}>IN_PROGRESS (Active Build)</option>
                <option value={ProjectStatus.INTERNAL_QA}>INTERNAL_QA (Owner Testing)</option>
                <option value={ProjectStatus.CUSTOMER_REVIEW}>CUSTOMER_REVIEW (Preview Available)</option>
                <option value={ProjectStatus.REVISION}>REVISION (Customer Adjustments)</option>
                <option value={ProjectStatus.AWAITING_FINAL_PAYMENT}>AWAITING_FINAL_PAYMENT (Preview Approved)</option>
                <option value={ProjectStatus.READY_FOR_DELIVERY}>READY_FOR_DELIVERY (Pre-Deployment)</option>
                <option value={ProjectStatus.DELIVERED}>DELIVERED (Handover Complete)</option>
                <option value={ProjectStatus.COMPLETED}>COMPLETED (Signed off)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Transition Reason</label>
              <input
                type="text"
                required
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="e.g. Completed initial architecture sprint; deployed live staging"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:ring-2 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
            >
              Update Project Status
            </button>
          </form>

          {/* Deadline Extension */}
          <form onSubmit={handleExtendDeadline} className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Adjust Target Delivery Date</h3>
            <p className="text-xs text-muted-foreground">Extends delivery date with transparent audit logging.</p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">New Target Date</label>
              <input
                type="date"
                required
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Reason for Adjustment</label>
              <input
                type="text"
                required
                value={deadlineReason}
                onChange={(e) => setDeadlineReason(e.target.value)}
                placeholder="e.g. Complex API rate limits discovered during QA; extra 2 days required"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:ring-2 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-secondary py-2.5 text-xs font-bold text-foreground border border-border hover:bg-muted disabled:opacity-50"
            >
              Log & Apply Deadline Extension
            </button>
          </form>
        </div>
      )}

      {/* TAB: Deliverables */}
      {activeTab === 'deliverables' && (
        <div className="space-y-6">
          {/* Add Deliverable Form */}
          <form onSubmit={handleAddDeliverable} className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Upload Deliverable / Add Link</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Deliverable Title</label>
                <input
                  type="text"
                  required
                  value={delivTitle}
                  onChange={(e) => setDelivTitle(e.target.value)}
                  placeholder="e.g. Staging Preview URL or Source Zip"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Access Gating Level</label>
                <select
                  value={delivAccess}
                  onChange={(e) => setDelivAccess(e.target.value as DeliverableAccessLevel)}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:ring-2 focus:ring-accent"
                >
                  <option value={DeliverableAccessLevel.PREVIEW_AVAILABLE}>PREVIEW_AVAILABLE (Unlocked for review)</option>
                  <option value={DeliverableAccessLevel.FINAL_LOCKED}>FINAL_LOCKED (Locked until 100% paid)</option>
                  <option value={DeliverableAccessLevel.SOURCE_LOCKED}>SOURCE_LOCKED (Locked until 100% paid)</option>
                  <option value={DeliverableAccessLevel.FINAL_AVAILABLE}>FINAL_AVAILABLE (Unlocked)</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-foreground">External URL / Staging Link</label>
                <input
                  type="url"
                  value={delivUrl}
                  onChange={(e) => setDelivUrl(e.target.value)}
                  placeholder="https://staging.clientproject.com"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
            >
              Add Deliverable to Project Vault
            </button>
          </form>

          {/* Existing Deliverables */}
          <div className="rounded-3xl border border-border bg-card p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Existing Project Deliverables</h3>
            {project.deliverables?.map((d: any) => (
              <div key={d.id} className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-secondary/30 text-xs">
                <div>
                  <span className="font-bold text-foreground">{d.title}</span>
                  <p className="text-muted-foreground text-[11px]">{d.externalUrl || d.fileKey}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-card">
                  {d.accessLevel}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Change Requests */}
      {activeTab === 'cr' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateCR} className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Create Scope Change Request</h3>
            <p className="text-xs text-muted-foreground">Issue formal out-of-scope expansion with explicit price and timeline adjustment.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-foreground">CR Title</label>
                <input
                  type="text"
                  required
                  value={crTitle}
                  onChange={(e) => setCrTitle(e.target.value)}
                  placeholder="e.g. Add Multi-Currency Razorpay Checkout"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-foreground">Scope Description</label>
                <textarea
                  required
                  rows={2}
                  value={crDesc}
                  onChange={(e) => setCrDesc(e.target.value)}
                  placeholder="Describe added features..."
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-foreground">Reason for Change</label>
                <input
                  type="text"
                  required
                  value={crReason}
                  onChange={(e) => setCrReason(e.target.value)}
                  placeholder="e.g. Client requested international customer billing"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Additional Fee (₹ INR)</label>
                <input
                  type="number"
                  required
                  min={0}
                  step={500}
                  value={crPriceRupees}
                  onChange={(e) => setCrPriceRupees(Number(e.target.value))}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Additional Timeline (Days)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={crDays}
                  onChange={(e) => setCrDays(Number(e.target.value))}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
            >
              Issue Change Request to Client
            </button>
          </form>
        </div>
      )}

      {/* TAB: Messages */}
      {activeTab === 'messages' && (
        <div className="rounded-3xl border border-border bg-card p-6 space-y-6 shadow-sm">
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {project.messages?.map((msg: any) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isFromAdmin ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-md rounded-2xl p-4 text-xs space-y-1 shadow-sm ${
                    msg.isFromAdmin
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-secondary text-foreground rounded-tl-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 font-bold text-[10px] opacity-75">
                    <span>{msg.isFromAdmin ? 'You (Skyline Admin)' : project.customer?.name}</span>
                    <span>{formatDateTime(msg.createdAt)}</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendAdminMessage} className="flex gap-2 pt-4 border-t border-border">
            <input
              type="text"
              required
              value={adminMsg}
              onChange={(e) => setAdminMsg(e.target.value)}
              placeholder="Reply to client..."
              className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-xs text-foreground focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 flex items-center gap-1"
            >
              <Send className="h-3.5 w-3.5" /> Reply
            </button>
          </form>
        </div>
      )}

      {/* TAB: Deadline History */}
      {activeTab === 'history' && (
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Target Deadline Audit History</h3>
          {(!project.deadlineHistory || project.deadlineHistory.length === 0) ? (
            <p className="text-xs text-muted-foreground">No deadline extensions have been recorded for this project.</p>
          ) : (
            <div className="space-y-3">
              {project.deadlineHistory.map((hist: any) => (
                <div key={hist.id} className="p-4 rounded-xl border border-border bg-secondary/30 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">
                      Adjusted: {formatDate(hist.oldDeadline)} → {formatDate(hist.newDeadline)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{formatDateTime(hist.createdAt)}</span>
                  </div>
                  <p className="text-muted-foreground">Reason: "{hist.reason}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
