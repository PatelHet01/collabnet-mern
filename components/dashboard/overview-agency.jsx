import Link from 'next/link';
import { KpiGrid } from '@/components/dashboard/kpi';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AgencyOverview({ stats }) {
  return (
    <>
      <PageHeader
        title="Agency Hub"
        subtitle="Sky workspace — roster & client pipeline"
        action={
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/dashboard/roster">Manage roster</Link>
          </Button>
        }
      />
      <KpiGrid
        items={[
          { label: 'Roster size', value: stats.roster, hint: 'Creators' },
          { label: 'Active collabs', value: stats.collabs, hint: 'Team' },
          { label: 'Pipeline (INR)', value: stats.pipeline, hint: 'Quoted' },
          { label: 'Platform creators', value: stats.platform, hint: 'Discover' },
        ]}
      />
      <Card className="border-sky-200/60 bg-card/90">
        <CardHeader>
          <CardTitle className="text-base">Quick links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/dashboard/clients">Clients</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/dashboard/payouts">Payouts</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/dashboard/analytics">Analytics</Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
