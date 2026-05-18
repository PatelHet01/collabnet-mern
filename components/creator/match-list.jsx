import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/lib/format';

export function CreatorMatchList({ campaigns }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {!campaigns.length && (
        <Card className="col-span-full">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No open campaigns. Set your <Link href="/dashboard/pricing" className="underline">rate card</Link> first.
          </CardContent>
        </Card>
      )}
      {campaigns.map((c) => (
        <Card key={c.id} className="border-violet-200/50 bg-card/90">
          <CardContent className="pt-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{c.title}</p>
                <p className="text-sm text-muted-foreground">{c.brands?.company_name}</p>
              </div>
              <Badge variant="solid">{c.score}% fit</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{c.brief}</p>
            <p className="mt-3 text-sm font-medium">Budget: {formatINR(c.budget_cents)}</p>
            <Button asChild size="sm" className="mt-4 rounded-full">
              <Link href="/dashboard/discover">View & apply</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}