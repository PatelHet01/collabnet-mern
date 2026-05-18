'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addSocialMetric } from '@/app/actions/brand-tools';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function SocialMetricForm({ campaigns }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await addSocialMetric(new FormData(e.target));
    setLoading(false);
    if (res?.error) toast.error(res.error);
    else {
      toast.success('Metrics saved');
      e.target.reset();
      router.refresh();
    }
  }

  return (
    <Card className="border-border/60 bg-card/90">
      <CardHeader>
        <CardTitle className="text-base">Record social performance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2 sm:col-span-2">
            <Label>Campaign</Label>
            <select name="campaign_id" className="flex h-10 w-full rounded-lg border px-3 text-sm" required>
              <option value="">Select…</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>{c.title || c.id}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Platform</Label>
            <select name="platform" className="flex h-10 w-full rounded-lg border px-3 text-sm">
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Views</Label>
            <Input name="views" type="number" min="0" required />
          </div>
          <div className="space-y-2">
            <Label>Clicks</Label>
            <Input name="clicks" type="number" min="0" />
          </div>
          <div className="space-y-2">
            <Label>Conversions</Label>
            <Input name="conversions" type="number" min="0" />
          </div>
          <div className="space-y-2">
            <Label>Spend (₹)</Label>
            <Input name="spend" type="number" min="0" step="1" required />
          </div>
          <div className="flex items-end sm:col-span-2 lg:col-span-3">
            <Button type="submit" disabled={loading} className="rounded-full">
              {loading ? 'Saving…' : 'Add data point'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
