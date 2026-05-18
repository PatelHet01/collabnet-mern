import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function PageHeader({ title, subtitle, action, analyticsHref = '/dashboard/analytics' }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <Button variant="outline" size="sm" asChild className="rounded-full">
          <Link href={analyticsHref}>View analytics</Link>
        </Button>
        {action}
      </div>
    </div>
  );
}
