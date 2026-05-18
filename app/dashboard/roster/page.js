import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { RosterAdd } from '@/components/phase2/roster-add';

export default async function RosterPage() {
  const profile = await requireRole('agency');
  const supabase = await createClient();
  const { data: agency } = await supabase.from('agencies').select('id').eq('profile_id', profile.id).single();

  const { data: roster } = await supabase
    .from('agency_creators')
    .select('id, status, creators(bio, niche, profiles(name))')
    .eq('agency_id', agency?.id);

  const { data: allCreators } = await supabase
    .from('creators')
    .select('id, profiles(name)')
    .limit(30);

  const onRoster = new Set((roster || []).map((r) => r.creators?.id));

  return (
    <>
      <PageHeader title="Roster" subtitle="Creators your agency represents" />
      <RosterAdd creators={allCreators || []} onRoster={onRoster} />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {!roster?.length && (
          <Card className="col-span-full border-border/60">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No creators on roster yet. Add from the list above.
            </CardContent>
          </Card>
        )}
        {roster?.map((r) => (
          <Card key={r.id} className="border-border/60 bg-card/90">
            <CardContent className="pt-5">
              <p className="font-semibold">{r.creators?.profiles?.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{r.creators?.bio || '—'}</p>
              <p className="mt-2 text-xs capitalize text-muted-foreground">Status: {r.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
