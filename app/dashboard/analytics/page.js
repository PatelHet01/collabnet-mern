import { requireProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/dashboard/page-header';
import { bucketByMonth, countByField } from '@/lib/analytics';
import { BrandAnalytics } from '@/components/analytics/brand-analytics';
import { CreatorAnalytics } from '@/components/analytics/creator-analytics';
import { AgencyAnalytics } from '@/components/analytics/agency-analytics';
import { AdminAnalytics } from '@/components/analytics/admin-analytics';
import { SocialRoiChart } from '@/components/analytics/social-roi';
import { SocialMetricForm } from '@/components/brand/social-metric-form';

export default async function AnalyticsPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  if (profile.role === 'brand') {
    const { data: brand } = await supabase.from('brands').select('id').eq('profile_id', profile.id).single();
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id, title, budget_cents, created_at, status')
      .eq('brand_id', brand?.id);

    const campaignIds = (campaigns || []).map((c) => c.id).filter(Boolean);
    let apps = [];
    if (campaignIds.length) {
      const { data } = await supabase
        .from('campaign_applications')
        .select('status, created_at, campaign_id')
        .in('campaign_id', campaignIds);
      apps = data || [];
    }

    const { data: social } = await supabase
      .from('social_metrics')
      .select('*')
      .in('campaign_id', campaignIds.length ? campaignIds : ['00000000-0000-0000-0000-000000000000']);

    return (
      <>
        <PageHeader title="Brand analytics" subtitle="Spend, applications, social ROI (views, CR) in INR" />
        <BrandAnalytics
          spendByMonth={bucketByMonth(campaigns, 'created_at', 'budget_cents')}
          appsByStatus={countByField(apps, 'status')}
          campaigns={bucketByMonth(campaigns, 'created_at', 'budget_cents').map((m) => ({
            month: m.month,
            count: m.count,
          }))}
        />
        <div className="mt-8">
          <h2 className="mb-4 font-display text-lg font-semibold">Social performance</h2>
          <SocialRoiChart rows={social || []} />
        </div>
        <div className="mt-8">
          <SocialMetricForm campaigns={campaigns || []} />
        </div>
      </>
    );
  }

  if (profile.role === 'creator') {
    const { data: creator } = await supabase.from('creators').select('id').eq('profile_id', profile.id).single();
    const { data: apps } = await supabase
      .from('campaign_applications')
      .select('status, proposed_rate_cents, created_at')
      .eq('creator_id', creator?.id);
    const { data: payouts } = await supabase
      .from('payouts')
      .select('amount_paise, status, created_at')
      .eq('creator_id', creator?.id);

    return (
      <>
        <PageHeader title="Creator analytics" subtitle="Earnings pipeline and application funnel" />
        <CreatorAnalytics
          earningsByMonth={bucketByMonth(
            (apps || []).filter((a) => a.status === 'accepted'),
            'created_at',
            'proposed_rate_cents'
          )}
          appsByStatus={countByField(apps, 'status')}
          payouts={payouts || []}
        />
      </>
    );
  }

  if (profile.role === 'agency') {
    const { data: agency } = await supabase.from('agencies').select('id').eq('profile_id', profile.id).single();
    const { data: roster } = await supabase
      .from('agency_creators')
      .select('created_at, status')
      .eq('agency_id', agency?.id);

    const { count: creatorCount } = await supabase
      .from('creators')
      .select('*', { count: 'exact', head: true });

    return (
      <>
        <PageHeader title="Agency analytics" subtitle="Roster growth and platform reach" />
        <AgencyAnalytics roster={roster || []} platformCreators={creatorCount || 0} />
      </>
    );
  }

  const { data: profiles } = await supabase.from('profiles').select('role, created_at');
  const { data: campaigns } = await supabase.from('campaigns').select('created_at, budget_cents');

  return (
    <>
      <PageHeader title="Platform analytics" subtitle="Admin view across CollabNet" />
      <AdminAnalytics
        usersByRole={countByField(profiles, 'role')}
        growth={bucketByMonth(profiles, 'created_at', 'budget_cents').map((m) => ({ month: m.month, count: m.count }))}
        gmv={bucketByMonth(campaigns, 'created_at', 'budget_cents')}
      />
    </>
  );
}
