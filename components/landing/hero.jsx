import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, IndianRupee } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="grid-bg absolute inset-0 opacity-40" />
      <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-1.5 text-xs font-medium shadow-sm">
          <IndianRupee className="h-3.5 w-3.5" />
          Built for India — budgets, payouts, analytics in INR
        </div>

        <h1 className="font-display mt-8 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-balance md:text-6xl">
          Where brands and creators actually close deals
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          CollabNet is the workspace for influencer campaigns: briefs, applications, deliverables,
          and payouts — without the spreadsheet chaos.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button size="lg" asChild className="h-12 px-8">
            <Link href="/register">
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-12 px-8 bg-white">
            <Link href="/login">Log in</Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            { n: '12K+', l: 'Creator profiles' },
            { n: '₹8Cr+', l: 'Campaign volume' },
            { n: '4.9', l: 'Avg brand rating' },
          ].map((s) => (
            <div key={s.l} className="glass rounded-2xl p-5">
              <p className="font-display text-2xl font-bold">{s.n}</p>
              <p className="text-sm text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
