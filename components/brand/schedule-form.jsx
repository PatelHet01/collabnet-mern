'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addContentSchedule } from '@/app/actions/brand-tools';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function ScheduleForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await addContentSchedule(new FormData(e.target));
    setLoading(false);
    if (res?.error) toast.error(res.error);
    else {
      toast.success('Scheduled');
      e.target.reset();
      router.refresh();
    }
  }

  return (
    <Card className="h-fit border-border/60 bg-card/90">
      <CardHeader>
        <CardTitle className="text-base">Schedule content</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input name="title" required placeholder="Reel #2 — product demo" />
          </div>
          <div className="space-y-2">
            <Label>Platform</Label>
            <select name="platform" className="flex h-10 w-full rounded-lg border px-3 text-sm">
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Publish at</Label>
            <Input name="scheduled_at" type="datetime-local" required />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea name="notes" rows={2} />
          </div>
          <Button type="submit" className="w-full rounded-full" disabled={loading}>
            {loading ? 'Saving…' : 'Schedule'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
