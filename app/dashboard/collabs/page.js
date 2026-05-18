import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatMoney, statusLabel } from '@/lib/format';

export default async function CollabsPage() {
  const profile = await requireRole('creator');
  const supabase = await createClient();

  const { data: creator } = await supabase.from('creators').select('id').eq('profile_id', profile.id).single();

  const { data: apps } = await supabase
    .from('campaign_applications')
    .select('id, status, pitch, proposed_rate_cents, campaigns(title, status, brands(company_name))')
    .eq('creator_id', creator?.id)
    .order('created_at', { ascending: false });

  return (
    <>
      <PageHeader
        title="My collabs"
        subtitle="Applications you've sent"
        action={
          <Link href="/dashboard/discover" className="text-sm font-medium underline">
            Find campaigns
          </Link>
        }
      />
      <Card>
        <CardContent className="p-0">
          {!apps?.length ? (
            <p className="p-6 text-sm text-muted-foreground">You haven&apos;t applied anywhere yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="p-4 font-medium">Brand</th>
                  <th className="p-4 font-medium">Campaign</th>
                  <th className="p-4 font-medium">Rate</th>
                  <th className="p-4 font-medium">App status</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr key={a.id} className="border-b last:border-0">
                    <td className="p-4">{a.campaigns?.brands?.company_name}</td>
                    <td className="p-4">{a.campaigns?.title}</td>
                    <td className="p-4">{formatMoney(a.proposed_rate_cents)}</td>
                    <td className="p-4">
                      <Badge variant={a.status === 'accepted' ? 'solid' : 'default'}>{statusLabel(a.status)}</Badge>
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
