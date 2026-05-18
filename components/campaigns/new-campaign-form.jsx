'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCampaign } from '@/app/actions/campaigns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function NewCampaignForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.target);
    const res = await createCampaign(fd);
    setLoading(false);

    if (res?.error) {
      toast.error(res.error);
      return;
    }
    toast.success('Campaign saved');
    router.push('/dashboard/campaigns');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required placeholder="Winter collection launch" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="brief">Brief</Label>
        <Textarea id="brief" name="brief" rows={5} placeholder="What you need from creators…" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="budget">Budget (INR ₹)</Label>
        <Input id="budget" name="budget" type="number" min="0" step="1" required placeholder="150000" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="publish" className="rounded border" />
        Publish immediately (open for applications)
      </label>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Save campaign'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}