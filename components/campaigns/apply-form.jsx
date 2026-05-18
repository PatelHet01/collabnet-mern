'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { applyToCampaign } from '@/app/actions/campaigns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function ApplyForm({ campaignId }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        Apply
      </Button>
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.target);
    const res = await applyToCampaign(campaignId, fd.get('pitch'), fd.get('rate'));
    setLoading(false);

    if (res?.error) {
      toast.error(res.error);
      return;
    }
    toast.success('Application sent');
    setOpen(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 border-t pt-4">
      <Textarea name="pitch" rows={3} placeholder="Your pitch…" required />
      <Input name="rate" type="number" min="0" step="1" placeholder="Your rate in ₹" required />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? 'Sending…' : 'Submit'}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
