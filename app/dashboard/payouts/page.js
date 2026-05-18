import { requireProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatINR, statusLabel } from '@/lib/format';

export default async function PayoutsPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  let payouts = [];
  if (profile.role === 'creator') {
    const { data: creator } = await supabase.from('creators').select('id').eq('profile_id', profile.id).single();
    const { data } = await supabase
      .from('payouts')
      .select('id, amount_paise, status, created_at, paid_at, campaigns(title)')
      .eq('creator_id', creator?.id)
      .order('created_at', { ascending: false });
    payouts = data || [];
  } else if (profile.role === 'agency') {
    const { data: agency } = await supabase.from('agencies').select('id').eq('profile_id', profile.id).single();
    const { data: roster } = await supabase.from('agency_creators').select('creator_id').eq('agency_id', agency?.id);
    const ids = (roster || []).map((r) => r.creator_id);
    if (ids.length) {
      const { data } = await supabase
        .from('payouts')
        .select('id, amount_paise, status, created_at, campaigns(title), creators(profiles(name))')
        .in('creator_id', ids);
      payouts = data || [];
    }
  } else {
    return (
      <>
        <PageHeader title="Payouts" subtitle="Available for creators and agencies" />
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Switch to a creator or agency account.</CardContent></Card>
      </>
    );
  }

  const totalPending = payouts.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount_paise, 0);
  const totalPaid = payouts.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount_paise, 0);

  return (
    <>
      <PageHeader
        title="Payouts"
        subtitle="INR ledger — connect Razorpay in production"
      />
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Card className="bg-card/90"><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Pending</p><p className="font-display text-2xl font-bold">{formatINR(totalPending)}</p></CardContent></Card>
        <Card className="bg-card/90"><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Paid</p><p className="font-display text-2xl font-bold">{formatINR(totalPaid)}</p></CardContent></Card>
      </div>
      <Card className="border-border/60 bg-card/90">
        <CardContent className="p-0">
          {!payouts.length ? (
            <p className="p-6 text-sm text-muted-foreground">No payouts yet. They appear when brands accept your application.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="p-4 font-medium">Campaign</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="p-4">{p.campaigns?.title || '—'}</td>
                    <td className="p-4 font-medium">{formatINR(p.amount_paise)}</td>
                    <td className="p-4"><Badge variant={p.status === 'paid' ? 'solid' : 'default'}>{statusLabel(p.status)}</Badge></td>
                    <td className="p-4 text-muted-foreground">{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
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
