'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getTheme } from '@/lib/themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  LineChart,
  Megaphone,
  Search,
  Briefcase,
  Wallet,
  Users,
  Building2,
  MessageSquare,
  Bell,
  Sparkles,
  LogOut,
  Heart,
  Menu,
  X,
  Calendar,
} from 'lucide-react';

const navByRole = {
  admin: [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/analytics', label: 'Analytics', icon: LineChart },
    { href: '/dashboard/users', label: 'Users', icon: Users },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  ],
  brand: [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/analytics', label: 'Analytics', icon: LineChart },
    { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
    { href: '/dashboard/schedule', label: 'Scheduler', icon: Megaphone },
    { href: '/dashboard/campaigns', label: 'Campaigns', icon: Megaphone },
    { href: '/dashboard/match', label: 'Match', icon: Sparkles },
    { href: '/dashboard/messages', label: 'Chat', icon: MessageSquare },
    { href: '/dashboard/shortlist', label: 'Shortlist', icon: Heart },
  ],
  creator: [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/analytics', label: 'Analytics', icon: LineChart },
    { href: '/dashboard/match', label: 'Match', icon: Sparkles },
    { href: '/dashboard/pricing', label: 'Rate card', icon: Wallet },
    { href: '/dashboard/collabs', label: 'Collabs', icon: Briefcase },
    { href: '/dashboard/discover', label: 'Discover', icon: Search },
    { href: '/dashboard/payouts', label: 'Payouts', icon: Wallet },
    { href: '/dashboard/messages', label: 'Chat', icon: MessageSquare },
  ],
  agency: [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/analytics', label: 'Analytics', icon: LineChart },
    { href: '/dashboard/roster', label: 'Roster', icon: Users },
    { href: '/dashboard/clients', label: 'Clients', icon: Building2 },
    { href: '/dashboard/payouts', label: 'Payouts', icon: Wallet },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  ],
};

function SidebarContent({ profile, items, pathname, onNavigate, theme }) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <>
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="mb-1 font-display text-xl font-bold tracking-tight"
      >
        CollabNet
      </Link>
      <p className="mb-4 text-xs text-muted-foreground lg:mb-6">
        <span className="inline-flex items-center rounded-full bg-[hsl(var(--accent))] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          {theme.accent}
        </span>
        <span className="ml-2">{theme.tagline}</span>
      </p>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-[hsl(var(--accent))] text-white shadow-md scale-[1.02]'
                  : 'text-muted-foreground hover:bg-accent-soft hover:text-foreground hover:translate-x-0.5'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-2 border-t border-border/60 pt-4">
        <Link
          href="/dashboard/notifications"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent-soft"
        >
          <Bell className="h-4 w-4" />
          Notifications
        </Link>
        <div className="rounded-xl bg-accent-soft px-3 py-3">
          <p className="text-sm font-medium truncate">{profile.name}</p>
          <p className="text-xs capitalize text-muted-foreground">{profile.role}</p>
        </div>
        <Button variant="outline" size="sm" onClick={signOut} className="w-full rounded-xl">
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </>
  );
}

export function DashboardShell({ profile, children }) {
  const pathname = usePathname();
  const theme = getTheme(profile.role);
  const items = navByRole[profile.role] || navByRole.brand;
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className={cn('min-h-screen', theme.shell)}>
      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/60 bg-card/90 px-4 backdrop-blur-lg lg:hidden">
        <Link href="/dashboard" className="font-display text-lg font-bold">
          CollabNet
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full px-3"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-up"
          style={{ animationDuration: '0.2s', opacity: 1 }}
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[min(100vw-3rem,280px)] flex-col border-r border-border/60 bg-card/95 p-5 backdrop-blur-xl transition-transform duration-300 ease-out lg:w-[272px] lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <span className="text-xs font-medium text-muted-foreground">Menu</span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={closeMobile}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <SidebarContent
          profile={profile}
          items={items}
          pathname={pathname}
          onNavigate={closeMobile}
          theme={theme}
        />
      </aside>

      <main
        className={cn(
          'min-h-[calc(100vh-3.5rem)] bg-gradient-to-br lg:min-h-screen lg:ml-[272px]',
          theme.gradient
        )}
      >
        <div className="animate-fade-up p-4 sm:p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
