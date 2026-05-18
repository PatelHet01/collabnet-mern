import Link from 'next/link';
import { Button } from '@/components/ui/button';

const roles = [
  {
    id: 'brand',
    title: 'Brands',
    desc: 'Launch campaigns, review pitches, track spend in ₹.',
    className: 'border-stone-200 bg-gradient-to-br from-stone-50 to-amber-50/60',
  },
  {
    id: 'creator',
    title: 'Creators',
    desc: 'Discover collabs, apply with your rate, track earnings.',
    className: 'border-violet-200 bg-gradient-to-br from-violet-50/80 to-fuchsia-50/40',
  },
  {
    id: 'agency',
    title: 'Agencies',
    desc: 'Manage roster, client pipelines, and team analytics.',
    className: 'border-sky-200 bg-gradient-to-br from-slate-50 to-sky-50/60',
  },
];

export function Roles() {
  return (
    <section id="roles" className="border-t py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-3xl font-bold">Built for every seat at the table</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {roles.map((r) => (
            <div key={r.id} className={`rounded-2xl border p-8 ${r.className}`}>
              <h3 className="font-display text-xl font-semibold">{r.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{r.desc}</p>
              <Button className="mt-6" variant="outline" asChild>
                <Link href={`/register?role=${r.id}`}>Join as {r.title.slice(0, -1)}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
