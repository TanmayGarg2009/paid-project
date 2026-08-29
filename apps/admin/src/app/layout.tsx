import type { Metadata } from 'next';
import './globals.css';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentAdmin } from '@/actions/auth';
import { 
  Layers, 
  LayoutDashboard, 
  Inbox, 
  FolderGit2, 
  FileText, 
  CreditCard, 
  Star, 
  Wrench, 
  LogOut,
  ShieldCheck
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Skyline Operations Admin Panel',
  description: 'Operations control and project lifecycle management for Skyline digital services.',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  // If path is /login, render without sidebar shell
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        {admin ? (
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card p-5 space-y-6 shrink-0 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold tracking-wider">SKYLINE OPS</span>
                    <span className="text-[10px] text-accent block uppercase font-bold leading-none mt-0.5">Agency Admin</span>
                  </div>
                </Link>

                {/* Nav links */}
                <nav className="space-y-1 text-xs font-semibold">
                  <Link
                    href="/"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-foreground hover:bg-secondary transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-accent" />
                    <span>Dashboard & KPIs</span>
                  </Link>
                  <Link
                    href="/requests"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <Inbox className="h-4 w-4 text-accent" />
                    <span>Project Requests</span>
                  </Link>
                  <Link
                    href="/projects"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <FolderGit2 className="h-4 w-4 text-accent" />
                    <span>Active Projects</span>
                  </Link>
                  <Link
                    href="/quotes"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <FileText className="h-4 w-4 text-accent" />
                    <span>Quotes & Freezes</span>
                  </Link>
                  <Link
                    href="/payments"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <CreditCard className="h-4 w-4 text-accent" />
                    <span>Revenue Ledger</span>
                  </Link>
                  <Link
                    href="/reviews"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <Star className="h-4 w-4 text-accent" />
                    <span>Review Moderation</span>
                  </Link>
                  <Link
                    href="/services"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <Wrench className="h-4 w-4 text-accent" />
                    <span>Services Catalog CMS</span>
                  </Link>
                </nav>
              </div>

              {/* User Footer */}
              <div className="pt-4 border-t border-border space-y-3">
                <div className="px-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Logged in as</span>
                  <p className="text-xs font-bold text-foreground truncate">{admin.name || admin.email}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold mt-0.5">
                    <ShieldCheck className="h-3 w-3" /> {admin.role}
                  </span>
                </div>

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

            {/* Main Admin Content Canvas */}
            <div className="flex-1 overflow-y-auto">
              <main className="p-8 max-w-7xl mx-auto">{children}</main>
            </div>
          </div>
        ) : (
          <main>{children}</main>
        )}
      </body>
    </html>
  );
}
