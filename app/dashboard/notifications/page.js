import { requireProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { NotificationItem } from '@/components/phase2/notification-item';

export default async function NotificationsPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: items } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <>
      <PageHeader title="Notifications" subtitle="Updates on campaigns, payouts, and applications" />
      <Card className="border-border/60 bg-card/90">
        <CardContent className="divide-y p-0">
          {!items?.length && (
            <p className="p-6 text-sm text-muted-foreground">You&apos;re all caught up.</p>
          )}
          {items?.map((n) => (
            <NotificationItem key={n.id} item={n} />
          ))}
        </CardContent>
      </Card>
    </>
  );
}
