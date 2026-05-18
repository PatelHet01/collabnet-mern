'use client';

import { useRouter } from 'next/navigation';
import { updateCampaignStatus } from '@/app/actions/campaigns';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function CampaignActions({ campaign }) {
  const router = useRouter();

  async function setStatus(status) {
    const res = await updateCampaignStatus(campaign.id, status);
    if (res?.error) {
      toast.error(res.error);
      return;
    }
    toast.success('Updated');
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      {campaign.status === 'draft' && (
        <Button size="sm" onClick={() => setStatus('open')}>
          Publish
        </Button>
      )}
      {campaign.status === 'open' && (
        <Button size="sm" variant="outline" onClick={() => setStatus('draft')}>
          Unpublish
        </Button>
      )}
      {['open', 'in_progress'].includes(campaign.status) && (
        <Button size="sm" variant="outline" onClick={() => setStatus('completed')}>
          Mark complete
        </Button>
      )}
    </div>
  );
}
