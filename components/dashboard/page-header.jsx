import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function PageHeader({ title, subtitle, action, analyticsHref = '/dashboard/analytics' }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" asChild className="rounded-full">
          <Link href={analyticsHref}>View analytics</Link>
        </Button>
        {action}
      </div>
    </div>
  );
}
