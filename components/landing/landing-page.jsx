'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LandingNav } from './nav';
import { LandingFooter } from './footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, IndianRupee, Megaphone, Sparkles, LineChart, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const stats = [
  { end: 12000, suffix: '+', label: 'Creator profiles', prefix: '' },
  { end: 8, suffix: 'Cr+', label: 'Campaign volume', prefix: '₹' },
  { end: 49, suffix: '', label: 'Avg brand rating', prefix: '', decimals: 1, div: 10 },
];

function useCountUp(end, active, decimals = 0, div = 1) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const steps = 40;
    const inc = end / steps;
    const t = setInterval(() => {
      start += inc;
      if (start >= end) {
        setVal(end);
        clearInterval(t);
      } else setVal(start);
    }, 30);
    return () => clearInterval(t);
  }, [active, end]);
  const display = decimals ? (val / div).toFixed(decimals) : Math.floor(val).toLocaleString('en-IN');
  return display;
}

function StatCard({ stat, active }) {
  const n = useCountUp(stat.end, active, stat.decimals, stat.div);
  return (
    <div className="glass hover-lift rounded-2xl p-5 transition-all">
      <p className="font-display text-2xl font-bold md:text-3xl">
        {stat.prefix}
        {n}
        {stat.suffix}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
    </div>
  );
}

const features = [
  { icon: Megaphone, title: 'Campaign workspace', desc: 'Briefs, budgets in ₹, publish and review applications.', color: 'from-amber-400 to-orange-500' },
  { icon: Sparkles, title: 'Creator matching', desc: 'Score talent by niche, rates, and campaign fit.', color: 'from-violet-500 to-fuchsia-500' },
  { icon: MessageSquare, title: 'Realtime chat', desc: 'Brand ↔ creator threads on every collab.', color: 'from-sky-400 to-blue-600' },
  { icon: LineChart, title: 'Social ROI', desc: 'Spend vs views, conversion rate, INR payouts.', color: 'from-emerald-400 to-teal-600' },
];

export function LandingPage() {
  const [statsVisible, setStatsVisible] = useState(false);
  const [activeRole, setActiveRole] = useState(0);

  const roles = [
    { id: 'brand', title: 'Brands', desc: 'Calendar, scheduler, match, analytics in ₹.', className: 'border-amber-200 from-amber-50 to-orange-50', href: '/register?role=brand' },
    { id: 'creator', title: 'Creators', desc: 'Rate card, campaign match, payouts, chat.', className: 'border-violet-200 from-violet-50 to-fuchsia-50', href: '/register?role=creator' },
    { id: 'agency', title: 'Agencies', desc: 'Roster, clients, team analytics.', className: 'border-sky-200 from-slate-50 to-sky-50', href: '/register?role=agency' },
  ];

  useEffect(() => {
    const t = setTimeout(() => setStatsVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setActiveRole((r) => (r + 1) % roles.length), 4000);
    return () => clearInterval(i);
  }, [roles.length]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <LandingNav />

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <div className="animate-float absolute -top-20 right-[10%] h-72 w-72 rounded-full bg-violet-400/30 blur-3xl" />
        <div className="animate-float-slow absolute bottom-10 left-[5%] h-64 w-64 rounded-full bg-amber-300/40 blur-3xl" />
        <div className="animate-pulse-glow absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border bg-white/90 px-4 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
            <IndianRupee className="h-3.5 w-3.5 text-amber-600" />
            Built for India — INR budgets, payouts & analytics
          </div>

          <h1 className="animate-fade-up animate-fade-up-delay-1 font-display mt-6 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-balance sm:text-5xl md:text-6xl">
            Where brands and{' '}
            <span className="gradient-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500">
              creators
            </span>{' '}
            close deals
          </h1>
          <p className="animate-fade-up animate-fade-up-delay-2 mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Campaigns, calendar, content scheduling, realtime chat, and social ROI — one workspace.
          </p>

          <div className="animate-fade-up animate-fade-up-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button size="lg" asChild className="h-12 rounded-full px-8 shadow-lg shadow-violet-500/20">
              <Link href="/register">
                Start free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 rounded-full bg-white/80 px-8 backdrop-blur">
              <Link href="/login">Log in</Link>
            </Button>
          </div>

          <div className="animate-fade-up animate-fade-up-delay-4 mt-12 grid gap-3 sm:grid-cols-3 sm:gap-4">
            {stats.map((s) => (
              <StatCard key={s.label} stat={s} active={statsVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-gradient-to-b from-muted/30 to-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Everything in one place</h2>
          <p className="mt-3 max-w-lg text-muted-foreground">Tap a card — built for brands, creators, and agencies.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group hover-lift cursor-default rounded-2xl border bg-card p-6 shadow-sm"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div
                  className={cn(
                    'mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform group-hover:scale-110',
                    f.color
                  )}
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold">How it works</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { n: '01', t: 'Brand posts a campaign', d: 'Set budget in ₹, schedule content, open applications.' },
              { n: '02', t: 'Creators apply & chat', d: 'Pitch with your rate card. Talk in realtime.' },
              { n: '03', t: 'Deliver & track ROI', d: 'Approve work, payouts in INR, views vs spend analytics.' },
            ].map((s, i) => (
              <div
                key={s.n}
                className="relative rounded-2xl border bg-card/80 p-6 transition-all hover:border-violet-200 hover:shadow-lg"
              >
                <span className="font-display text-5xl font-bold text-violet-200">{s.n}</span>
                <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
                {i < 2 && (
                  <ArrowRight className="absolute -right-4 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-muted-foreground/40 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive roles */}
      <section id="roles" className="border-t bg-muted/20 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold">Pick your portal</h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {roles.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveRole(i)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
                  activeRole === i
                    ? 'bg-foreground text-background shadow-lg scale-105'
                    : 'bg-white border text-muted-foreground hover:border-foreground/20'
                )}
              >
                {r.title}
              </button>
            ))}
          </div>
          <div
            className={cn(
              'mt-6 rounded-3xl border-2 bg-gradient-to-br p-8 transition-all duration-500 md:p-12',
              roles[activeRole].className
            )}
          >
            <h3 className="font-display text-2xl font-bold md:text-3xl">{roles[activeRole].title}</h3>
            <p className="mt-3 max-w-md text-muted-foreground">{roles[activeRole].desc}</p>
            <Button asChild className="mt-6 rounded-full">
              <Link href={roles[activeRole].href}>Join as {roles[activeRole].title.slice(0, -1)}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 opacity-90" />
        <div className="animate-shimmer absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-3xl px-4 text-center text-white sm:px-6">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Ready to run your next collab?</h2>
          <p className="mt-4 text-white/85">Free to start. Demo accounts available on login.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild variant="secondary" className="rounded-full bg-white text-foreground hover:bg-white/90">
              <Link href="/register">Create account</Link>
            </Button>
            <Button size="lg" asChild variant="outline" className="rounded-full border-white text-white hover:bg-white/10">
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}