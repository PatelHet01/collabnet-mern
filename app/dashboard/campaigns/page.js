import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatMoney, statusLabel } from '@/lib/format';

export default async function CampaignsPage() {
  const profile = await requireRole('brand');
  const supabase = await createClient();

  const { data: brand } = await supabase.from('brands').select('id').eq('profile_id', profile.id).single();

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .eq('brand_id', brand?.id)
    .order('created_at', { ascending: false });

  return (
    <>
      <PageHeader
        title="Campaigns"
        subtitle="All campaigns for your brand"
        action={
          <Button asChild>
            <Link href="/dashboard/campaigns/new">New campaign</Link>
          </Button>
        }
      />
      <Card>
        <CardContent className="p-0">
          {!campaigns?.length ? (
            <p className="p-6 text-sm text-muted-foreground">No campaigns yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="p-4 font-medium">Title</th>
                  <th className="p-4 font-medium">Budget</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="p-4">
                      <Link href={`/dashboard/campaigns/${c.id}`} className="font-medium hover:underline">
                        {c.title}
                      </Link>
                    </td>
                    <td className="p-4">{formatMoney(c.budget_cents)}</td>
                    <td className="p-4">
                      <Badge variant={c.status === 'open' ? 'solid' : 'default'}>{statusLabel(c.status)}</Badge>
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
