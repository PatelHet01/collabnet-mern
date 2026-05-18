import { Megaphone, LineChart, MessageSquare, Wallet, Sparkles, Shield } from 'lucide-react';

const items = [
  { icon: Megaphone, title: 'Campaign workspace', desc: 'Briefs, budgets in ₹, and publish to open applications.' },
  { icon: Sparkles, title: 'Creator matching', desc: 'Score creators by niche, rate, and past collabs.' },
  { icon: MessageSquare, title: 'Campaign chat', desc: 'Keep brand and creator threads on the record.' },
  { icon: Wallet, title: 'INR payouts', desc: 'Track pending and paid amounts — Razorpay-ready.' },
  { icon: LineChart, title: 'Role analytics', desc: 'Separate dashboards for brands, creators, agencies, admins.' },
  { icon: Shield, title: 'Access control', desc: 'Row-level security so each role sees only their data.' },
];

export function Features() {
  return (
    <section id="features" className="border-t bg-muted/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Everything in one place
        </h2>
        <p className="mt-3 max-w-lg text-muted-foreground">
          Phase 2 features ship in-app: messaging, shortlists, agency roster, and payout tracking.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-foreground text-background">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
