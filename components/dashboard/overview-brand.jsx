import Link from 'next/link';
import { KpiGrid } from '@/components/dashboard/kpi';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatINR, statusLabel } from '@/lib/format';
import { Megaphone, Users, IndianRupee } from 'lucide-react';

export function BrandOverview({ stats }) {
  return (
    <>
      <PageHeader
        title="Campaign HQ"
        subtitle="Stone & amber workspace — budgets in ₹"
        action={
          <Button asChild className="rounded-full">
            <Link href="/dashboard/campaigns/new">
              <Megaphone className="h-4 w-4" />
              New campaign
            </Link>
          </Button>
        }
      />
      <KpiGrid
        items={[
          { label: 'Active campaigns', value: stats.active, hint: 'Live', delta: 'Open or in progress' },
          { label: 'Total budget listed', value: formatINR(stats.spend), hint: 'INR' },
          { label: 'Pending applications', value: stats.pendingApps, hint: 'Review' },
          { label: 'Shortlisted creators', value: stats.shortlist, hint: 'Saved' },
        ]}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 bg-card/90 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Live campaigns</CardTitle>
            <Link href="/dashboard/campaigns" className="text-xs underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {!stats.rows.length ? (
              <p className="text-sm text-muted-foreground">No campaigns yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Campaign</th>
                    <th className="pb-2 font-medium">Budget</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.rows.map((c) => (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="py-3">
                        <Link href={`/dashboard/campaigns/${c.id}`} className="font-medium hover:underline">
                          {c.title}
                        </Link>
                      </td>
                      <td className="py-3">{formatINR(c.budget_cents)}</td>
                      <td className="py-3">
                        <Badge variant={c.status === 'open' ? 'solid' : 'default'}>{statusLabel(c.status)}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
        <Card className="border-stone-200 bg-stone-900 text-stone-50">
          <CardContent className="pt-6">
            <IndianRupee className="h-8 w-8 opacity-80" />
            <p className="mt-4 font-display text-lg font-semibold">Match creators</p>
            <p className="mt-2 text-sm text-stone-300">Use AI scoring to shortlist talent for your next brief.</p>
            <Button asChild className="mt-4 w-full rounded-full bg-white text-stone-900 hover:bg-stone-100">
              <Link href="/dashboard/match">Open matcher</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
