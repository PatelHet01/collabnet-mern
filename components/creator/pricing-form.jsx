'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { savePricing } from '@/app/actions/creator-tools';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function PricingForm({ defaults = {} }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await savePricing(new FormData(e.target));
    setLoading(false);
    if (res?.error) toast.error(res.error);
    else {
      toast.success('Rate card saved');
      router.refresh();
    }
  }

  return (
    <Card className="border-violet-200/60 bg-card/90">
      <CardHeader>
        <CardTitle className="text-base">Edit rates (₹)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {[
            ['reel', 'Instagram Reel', defaults.instagram_reel],
            ['story', 'Instagram Story', defaults.instagram_story],
            ['youtube', 'YouTube Video', defaults.youtube_video],
            ['ugc', 'UGC Bundle', defaults.ugc_bundle],
          ].map(([name, label, val]) => (
            <div key={name} className="space-y-2">
              <Label>{label}</Label>
              <Input name={name} type="number" min="0" step="100" placeholder="25000" defaultValue={val || ''} />
            </div>
          ))}
          <div className="space-y-2">
            <Label>Notes for brands</Label>
            <Textarea name="notes" rows={2} placeholder="Revision policy, usage rights…" />
          </div>
          <Button type="submit" className="w-full rounded-full" disabled={loading}>
            {loading ? 'Saving…' : 'Save rate card'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
