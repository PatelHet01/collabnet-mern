import Link from 'next/link';
import { KpiGrid } from '@/components/dashboard/kpi';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatINR, statusLabel } from '@/lib/format';

export function CreatorOverview({ stats }) {
  return (
    <>
      <PageHeader
        title="Creator Studio"
        subtitle="Violet workspace — track collabs and ₹ earnings"
        action={
          <Link href="/dashboard/discover" className="text-sm font-medium underline">
            Browse campaigns
          </Link>
        }
      />
      <KpiGrid
        items={[
          { label: 'Active collabs', value: stats.active, hint: 'Accepted' },
          { label: 'Pipeline (INR)', value: formatINR(stats.earnings), hint: 'Quoted' },
          { label: 'Applications sent', value: stats.totalApps, hint: 'All time' },
          { label: 'Paid out', value: formatINR(stats.paidOut), hint: 'Received' },
        ]}
      />
      <Card className="border-violet-200/60 bg-card/90">
        <CardHeader>
          <CardTitle className="text-base">Recent applications</CardTitle>
        </CardHeader>
        <CardContent>
          {!stats.rows.length ? (
            <p className="text-sm text-muted-foreground">
              No applications yet.{' '}
              <Link href="/dashboard/discover" className="underline">
                Find campaigns
              </Link>
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Brand</th>
                  <th className="pb-2 font-medium">Campaign</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.rows.map((r, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3">{r.brand}</td>
                    <td className="py-3">{r.campaign}</td>
                    <td className="py-3">
                      <Badge variant={r.status === 'accepted' ? 'solid' : 'default'}>{statusLabel(r.status)}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
