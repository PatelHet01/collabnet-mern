import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatMoney, statusLabel } from '@/lib/format';
import { CampaignActions } from '@/components/campaigns/campaign-actions';
import { ApplicationReview } from '@/components/campaigns/application-review';

export default async function CampaignDetailPage({ params }) {
  const profile = await requireRole('brand');
  const { id } = await params;
  const supabase = await createClient();

  const { data: brand } = await supabase.from('brands').select('id').eq('profile_id', profile.id).single();

  const { data: campaign } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .eq('brand_id', brand?.id)
    .single();

  if (!campaign) notFound();

  const { data: applications } = await supabase
    .from('campaign_applications')
    .select('id, pitch, proposed_rate_cents, status, creators(profiles(name))')
    .eq('campaign_id', id)
    .order('created_at', { ascending: false });

  return (
    <>
      <PageHeader
        title={campaign.title}
        subtitle={statusLabel(campaign.status)}
        action={<CampaignActions campaign={campaign} />}
      />

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Brief</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {campaign.brief || 'No brief added.'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="text-2xl font-bold">{formatMoney(campaign.budget_cents)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={campaign.status === 'open' ? 'solid' : 'default'} className="mt-1">
                {statusLabel(campaign.status)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Applications ({applications?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!applications?.length && (
            <p className="text-sm text-muted-foreground">No applications yet. Open the campaign to receive pitches.</p>
          )}
          {applications?.map((app) => (
            <ApplicationReview key={app.id} app={app} />
          ))}
        </CardContent>
      </Card>
    </>
  );
}
