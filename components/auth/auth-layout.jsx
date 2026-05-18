import Link from 'next/link';

const accents = {
  brand: 'from-stone-100 via-amber-50/80 to-orange-50',
  creator: 'from-violet-100 via-fuchsia-50/80 to-violet-50',
  agency: 'from-slate-100 via-sky-50/80 to-blue-50',
  admin: 'from-zinc-200 via-neutral-100 to-zinc-50',
};

const glows = {
  brand: 'bg-amber-300/30',
  creator: 'bg-violet-400/25',
  agency: 'bg-sky-400/25',
  admin: 'bg-zinc-400/20',
};

export function AuthLayout({ title, subtitle, children, roleAccent = 'brand' }) {
  return (
    <div className={`relative min-h-screen overflow-hidden bg-gradient-to-br ${accents[roleAccent] || accents.brand}`}>
      <div className={`animate-float absolute -right-20 top-20 h-64 w-64 rounded-full blur-3xl ${glows[roleAccent]}`} />
      <div className={`animate-float-slow absolute -left-16 bottom-20 h-48 w-48 rounded-full blur-3xl ${glows[roleAccent]}`} />

      <div className="relative mx-auto grid min-h-screen max-w-6xl lg:grid-cols-2">
        <div className="hidden flex-col justify-between p-8 lg:flex lg:p-12">
          <Link href="/" className="font-display text-2xl font-bold">
            CollabNet
          </Link>
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight">{title}</h1>
            <p className="mt-4 text-muted-foreground">{subtitle}</p>
          </div>
          <p className="text-xs text-muted-foreground">All amounts in Indian Rupees (INR)</p>
        </div>

        <div className="flex flex-col justify-center p-4 sm:p-6">
          <Link href="/" className="mb-6 font-display text-xl font-bold lg:hidden">
            CollabNet
          </Link>
          <div className="mx-auto w-full max-w-md animate-fade-up">{children}</div>
        </div>
      </div>
    </div>
  );
}
