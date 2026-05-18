import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function KpiGrid({ items, className }) {
  return (
    <div className={cn('mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {items.map((item) => (
        <Card key={item.label} className="border-border/60 bg-card/90 shadow-sm backdrop-blur">
          <CardContent className="pt-5">
            {item.hint && <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.hint}</p>}
            <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-1 font-display text-3xl font-bold tracking-tight">{item.value}</p>
            {item.delta && <p className="mt-2 text-xs text-muted-foreground">{item.delta}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
