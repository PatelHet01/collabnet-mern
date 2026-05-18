'use client';

import { useRouter } from 'next/navigation';
import { reviewApplication } from '@/app/actions/campaigns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatMoney, statusLabel } from '@/lib/format';
import { toast } from 'sonner';

export function ApplicationReview({ app }) {
  const router = useRouter();
  const name = app.creators?.profiles?.name || 'Creator';

  async function decide(status) {
    const res = await reviewApplication(app.id, status);
    if (res?.error) {
      toast.error(res.error);
      return;
    }
    toast.success(status === 'accepted' ? 'Creator accepted' : 'Application declined');
    router.refresh();
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="font-medium">{name}</p>
        <Badge variant={app.status === 'accepted' ? 'solid' : 'default'}>{statusLabel(app.status)}</Badge>
      </div>
      <p className="mb-2 text-sm text-muted-foreground">Ask: {formatMoney(app.proposed_rate_cents)}</p>
      {app.pitch && <p className="mb-3 text-sm">{app.pitch}</p>}
      {app.status === 'pending' && (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => decide('accepted')}>
            Accept
          </Button>
          <Button size="sm" variant="outline" onClick={() => decide('rejected')}>
            Decline
          </Button>
        </div>
      )}
    </div>
  );
}
