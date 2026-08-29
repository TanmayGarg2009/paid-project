import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentCustomer } from '@/actions/auth';
import { Layers, LayoutDashboard, FolderGit2, FileText, CreditCard, LogOut } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Dashboard Sidebar */}
          <aside className="w-full md:w-64 rounded-2xl border border-border bg-card p-4 space-y-6 shrink-0 shadow-sm">
            <div className="space-y-1 px-3 py-2 border-b border-border pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Client Portal</span>
              <h2 className="text-sm font-bold text-foreground truncate">{customer.name || customer.email}</h2>
              <p className="text-[11px] text-muted-foreground truncate">{customer.email}</p>
            </div>

            <nav className="space-y-1 text-xs font-semibold">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-foreground hover:bg-secondary transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 text-accent" />
                <span>Dashboard Overview</span>
              </Link>
              <Link
                href="/dashboard/projects"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <FolderGit2 className="h-4 w-4 text-accent" />
                <span>My Projects</span>
              </Link>
              <Link
                href="/dashboard/quotes"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <FileText className="h-4 w-4 text-accent" />
                <span>Milestone Quotes</span>
              </Link>
              <Link
                href="/dashboard/payments"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <CreditCard className="h-4 w-4 text-accent" />
                <span>Receipts & Payments</span>
              </Link>
            </nav>

            <div className="pt-4 border-t border-border">
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 w-full transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </button>
              </form>
            </div>
          </aside>

          {/* Main Dashboard Content */}
          <main className="flex-1 w-full">{children}</main>
        </div>
      </div>
    </div>
  );
}
