import { requireProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/dashboard/page-header';
import { MatchList } from '@/components/phase2/match-list';
import { CreatorMatchList } from '@/components/creator/match-list';

export default async function MatchPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  if (profile.role === 'brand') {
    const { data: brand } = await supabase.from('brands').select('id, industry').eq('profile_id', profile.id).single();
    const { data: creators } = await supabase
      .from('creators')
      .select('id, bio, niche, profiles(name), creator_pricing(content_type, price_paise)')
      .limit(24);

    const { data: shortlist } = await supabase
      .from('brand_shortlists')
      .select('creator_id')
      .eq('brand_id', brand?.id);

    const shortlisted = new Set((shortlist || []).map((s) => s.creator_id));

    const scored = (creators || [])
      .map((c) => {
        let score = 50;
        if (c.niche?.length) score += 15;
        if (c.creator_pricing?.length) score += 15;
        if (brand?.industry && c.niche?.some((n) => n.toLowerCase().includes(brand.industry.toLowerCase()))) score += 20;
        return { ...c, score: Math.min(score, 99) };
      })
      .sort((a, b) => b.score - a.score);

    return (
      <>
        <PageHeader title="Creator match" subtitle="Score creators by niche, rates (INR), and fit" />
        <MatchList creators={scored} shortlisted={shortlisted} />
      </>
    );
  }

  if (profile.role === 'creator') {
    const { data: creator } = await supabase
      .from('creators')
      .select('id, niche, creator_pricing(content_type, price_paise)')
      .eq('profile_id', profile.id)
      .single();

    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id, title, brief, budget_cents, brands(company_name, industry)')
      .eq('status', 'open')
      .limit(20);

    const scored = (campaigns || []).map((c) => {
      let score = 55;
      const budget = c.budget_cents || 0;
      const minRate = Math.min(...(creator?.creator_pricing || []).map((p) => p.price_paise), Infinity);
      if (minRate !== Infinity && budget >= minRate) score += 25;
      if (creator?.niche?.length && c.brands?.industry) score += 15;
      return { ...c, score: Math.min(score, 99) };
    }).sort((a, b) => b.score - a.score);

    return (
      <>
        <PageHeader
          title="Campaign match"
          subtitle="Campaigns that fit your niche and rate card"
          action={
            <a href="/dashboard/pricing" className="text-sm font-medium underline">
              Edit pricing
            </a>
          }
        />
        <CreatorMatchList campaigns={scored} />
      </>
    );
  }

  return (
    <PageHeader title="Match" subtitle="Available for brands and creators" />
  );
}
