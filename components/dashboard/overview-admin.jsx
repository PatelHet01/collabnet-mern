import Link from 'next/link';
import { KpiGrid } from '@/components/dashboard/kpi';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AdminOverview({ stats }) {
  return (
    <>
      <PageHeader title="Command Center" subtitle="Monochrome admin — platform health" />
      <KpiGrid
        items={[
          { label: 'Total users', value: stats.users, hint: 'Accounts' },
          { label: 'Campaigns', value: stats.campaigns, hint: 'All brands' },
          { label: 'Open campaigns', value: stats.open, hint: 'Live' },
          { label: 'GMV listed', value: stats.gmv, hint: 'INR' },
        ]}
      />
      <Card className="border-border/60 bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent signups</CardTitle>
          <Link href="/dashboard/users" className="text-xs underline">
            All users
          </Link>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Role</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.rows.map((u) => (
                <tr key={u.name} className="border-b last:border-0">
                  <td className="py-3">{u.name}</td>
                  <td className="py-3 capitalize">{u.role}</td>
                  <td className="py-3">
                    <Badge variant={u.is_active ? 'solid' : 'default'}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
}
