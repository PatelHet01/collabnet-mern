import Link from 'next/link';

export function AuthLayout({ title, subtitle, children, roleAccent = 'brand' }) {
  const accents = {
    brand: 'from-stone-100 to-amber-50',
    creator: 'from-violet-100 to-fuchsia-50',
    agency: 'from-slate-100 to-sky-50',
    admin: 'from-zinc-200 to-neutral-100',
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${accents[roleAccent] || accents.brand}`}>
      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-2">
        <div className="hidden flex-col justify-between p-12 lg:flex">
          <Link href="/" className="font-display text-2xl font-bold">
            CollabNet
          </Link>
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight">{title}</h1>
            <p className="mt-4 text-muted-foreground">{subtitle}</p>
          </div>
          <p className="text-xs text-muted-foreground">All amounts shown in Indian Rupees (INR)</p>
        </div>
        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
