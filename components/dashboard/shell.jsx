'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
    { href: '/dashboard/calendar', label: 'Calendar', icon: LayoutDashboard },
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

export function DashboardShell({ profile, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = getTheme(profile.role);
  const items = navByRole[profile.role] || navByRole.brand;

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <div className={cn('min-h-screen', theme.shell)}>
      <aside className="fixed inset-y-0 left-0 z-20 flex w-[272px] flex-col border-r border-border/60 bg-card/80 p-5 backdrop-blur-xl">
        <Link href="/dashboard" className="mb-1 font-display text-xl font-bold tracking-tight">
          CollabNet
        </Link>
        <p className="mb-6 text-xs text-muted-foreground">
          {theme.accent} {theme.tagline}
        </p>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
          {items.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  active
                    ? 'bg-[hsl(var(--accent))] text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-accent-soft hover:text-foreground'
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
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent-soft"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </Link>
          <div className="rounded-xl bg-accent-soft px-3 py-3">
            <p className="text-sm font-medium">{profile.name}</p>
            <p className="text-xs capitalize text-muted-foreground">{profile.role}</p>
          </div>
          <Button variant="outline" size="sm" onClick={signOut} className="w-full rounded-xl">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <main className={cn('ml-[272px] min-h-screen bg-gradient-to-br', theme.gradient)}>
        <div className="p-8 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
