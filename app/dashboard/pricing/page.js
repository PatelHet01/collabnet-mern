import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/dashboard/page-header';
import { PricingForm } from '@/components/creator/pricing-form';
import { Card, CardContent } from '@/components/ui/card';
import { formatINR } from '@/lib/format';

const LABELS = {
  instagram_reel: 'Instagram Reel',
  instagram_story: 'Instagram Story',
  youtube_video: 'YouTube Video',
  ugc_bundle: 'UGC Bundle',
};

export default async function PricingPage() {
  const profile = await requireRole('creator');
  const supabase = await createClient();
  const { data: creator } = await supabase.from('creators').select('id').eq('profile_id', profile.id).single();

  const { data: prices } = await supabase
    .from('creator_pricing')
    .select('*')
    .eq('creator_id', creator?.id);

  const defaults = {};
  for (const p of prices || []) defaults[p.content_type] = p.price_paise / 100;

  return (
    <>
      <PageHeader
        title="Rate card"
        subtitle="Set your content creation prices in INR — brands see this when matching"
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <PricingForm defaults={defaults} />
        <Card className="border-violet-200/60 bg-card/90">
          <CardContent className="pt-6">
            <p className="text-sm font-medium">Your published rates</p>
            <ul className="mt-4 space-y-3">
              {Object.keys(LABELS).map((key) => {
                const row = prices?.find((p) => p.content_type === key);
                return (
                  <li key={key} className="flex justify-between text-sm border-b pb-2 last:border-0">
                    <span className="text-muted-foreground">{LABELS[key]}</span>
                    <span className="font-semibold">{row ? formatINR(row.price_paise) : '—'}</span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
