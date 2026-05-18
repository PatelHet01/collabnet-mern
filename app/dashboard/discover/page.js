import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMoney } from '@/lib/format';
import { ApplyForm } from '@/components/campaigns/apply-form';

export default async function DiscoverPage() {
  const profile = await requireRole('brand', 'creator');
  const supabase = await createClient();

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('id, title, brief, budget_cents, brands(company_name)')
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  return (
    <>
      <PageHeader title="Discover" subtitle="Open campaigns looking for creators" />
      <div className="grid gap-4">
        {!campaigns?.length && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No open campaigns right now. Check back later.
            </CardContent>
          </Card>
        )}
        {campaigns?.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle className="text-lg">{c.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{c.brands?.company_name}</p>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm leading-relaxed">{c.brief || 'No brief provided.'}</p>
              <p className="mb-4 text-sm font-medium">Budget: {formatMoney(c.budget_cents)}</p>
              {profile.role === 'creator' && <ApplyForm campaignId={c.id} />}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
