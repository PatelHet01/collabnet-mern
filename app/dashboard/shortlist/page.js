import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { ShortlistActions } from '@/components/phase2/shortlist-actions';

export default async function ShortlistPage() {
  const profile = await requireRole('brand');
  const supabase = await createClient();
  const { data: brand } = await supabase.from('brands').select('id').eq('profile_id', profile.id).single();

  const { data: items } = await supabase
    .from('brand_shortlists')
    .select('id, creator_id, creators(bio, niche, profiles(name))')
    .eq('brand_id', brand?.id);

  return (
    <>
      <PageHeader title="Shortlist" subtitle="Creators you saved for upcoming campaigns" />
      <div className="grid gap-4 md:grid-cols-2">
        {!items?.length && (
          <Card className="col-span-full border-border/60">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              Empty shortlist. Use Match or Discover to save creators.
            </CardContent>
          </Card>
        )}
        {items?.map((item) => (
          <Card key={item.id} className="border-border/60 bg-card/90">
            <CardContent className="flex items-start justify-between gap-4 pt-5">
              <div>
                <p className="font-semibold">{item.creators?.profiles?.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.creators?.bio || '—'}</p>
                {item.creators?.niche?.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">{item.creators.niche.join(' · ')}</p>
                )}
              </div>
              <ShortlistActions creatorId={item.creator_id} />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
