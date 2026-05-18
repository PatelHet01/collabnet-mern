import { requireProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { formatINR, formatINRCompact } from '@/lib/format';
import { BrandOverview } from '@/components/dashboard/overview-brand';
import { CreatorOverview } from '@/components/dashboard/overview-creator';
import { AdminOverview } from '@/components/dashboard/overview-admin';
import { AgencyOverview } from '@/components/dashboard/overview-agency';

export default async function DashboardPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  if (profile.role === 'brand') {
    const { data: brand } = await supabase.from('brands').select('id').eq('profile_id', profile.id).single();
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id, title, budget_cents, status')
      .eq('brand_id', brand?.id)
      .order('created_at', { ascending: false })
      .limit(5);

    const list = campaigns || [];
    const ids = list.map((c) => c.id);
    let pendingApps = 0;
    if (ids.length) {
      const { count } = await supabase
        .from('campaign_applications')
        .select('*', { count: 'exact', head: true })
        .in('campaign_id', ids)
        .eq('status', 'pending');
      pendingApps = count || 0;
    }

    const { count: shortlist } = await supabase
      .from('brand_shortlists')
      .select('*', { count: 'exact', head: true })
      .eq('brand_id', brand?.id);

    return (
      <BrandOverview
        stats={{
          active: list.filter((c) => ['open', 'in_progress'].includes(c.status)).length,
          spend: list.reduce((s, c) => s + (c.budget_cents || 0), 0),
          pendingApps,
          shortlist: shortlist || 0,
          rows: list,
        }}
      />
    );
  }

  if (profile.role === 'creator') {
    const { data: creator } = await supabase.from('creators').select('id').eq('profile_id', profile.id).single();
    const { data: apps } = await supabase
      .from('campaign_applications')
      .select('id, status, proposed_rate_cents, campaigns(title, brands(company_name))')
      .eq('creator_id', creator?.id)
      .order('created_at', { ascending: false })
      .limit(5);

    const list = apps || [];
    const { data: payouts } = await supabase
      .from('payouts')
      .select('amount_paise')
      .eq('creator_id', creator?.id)
      .eq('status', 'paid');

    return (
      <CreatorOverview
        stats={{
          active: list.filter((a) => a.status === 'accepted').length,
          earnings: list.filter((a) => a.status === 'accepted').reduce((s, a) => s + (a.proposed_rate_cents || 0), 0),
          totalApps: list.length,
          paidOut: (payouts || []).reduce((s, p) => s + p.amount_paise, 0),
          rows: list.map((a) => ({
            brand: a.campaigns?.brands?.company_name || '—',
            campaign: a.campaigns?.title || '—',
            status: a.status,
          })),
        }}
      />
    );
  }

  if (profile.role === 'admin') {
    const [{ count: users }, { count: campaigns }, { count: open }] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('campaigns').select('*', { count: 'exact', head: true }),
      supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    ]);
    const { data: allC } = await supabase.from('campaigns').select('budget_cents');
    const gmv = (allC || []).reduce((s, c) => s + (c.budget_cents || 0), 0);
    const { data: recent } = await supabase
      .from('profiles')
      .select('name, role, is_active')
      .order('created_at', { ascending: false })
      .limit(5);

    return (
      <AdminOverview
        stats={{
          users: users || 0,
          campaigns: campaigns || 0,
          open: open || 0,
          gmv: formatINRCompact(gmv),
          rows: recent || [],
        }}
      />
    );
  }

  const { data: agency } = await supabase.from('agencies').select('id').eq('profile_id', profile.id).single();
  const { count: roster } = await supabase
    .from('agency_creators')
    .select('*', { count: 'exact', head: true })
    .eq('agency_id', agency?.id);
  const { count: platform } = await supabase.from('creators').select('*', { count: 'exact', head: true });

  return (
    <AgencyOverview
      stats={{
        roster: roster || 0,
        collabs: 0,
        pipeline: formatINR(0),
        platform: platform || 0,
      }}
    />
  );
}
