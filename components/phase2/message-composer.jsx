'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendMessage } from '@/app/actions/phase2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function MessageComposer() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.target);
    const res = await sendMessage(fd.get('campaignId') || null, fd.get('body'));
    setLoading(false);
    if (res?.error) {
      toast.error(res.error);
      return;
    }
    toast.success('Sent');
    e.target.reset();
    router.refresh();
  }

  return (
    <Card className="border-border/60 bg-card/90">
      <CardHeader>
        <CardTitle className="text-base">New message</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-3">
          <Textarea name="body" rows={4} placeholder="Write to your collab partner…" required />
          <Button type="submit" className="w-full rounded-full" disabled={loading}>
            {loading ? 'Sending…' : 'Send'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
