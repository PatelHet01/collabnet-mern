'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addCalendarEvent } from '@/app/actions/brand-tools';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function CalendarForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await addCalendarEvent(new FormData(e.target));
    setLoading(false);
    if (res?.error) toast.error(res.error);
    else {
      toast.success('Event added');
      e.target.reset();
      router.refresh();
    }
  }

  return (
    <Card className="border-border/60 bg-card/90 h-fit">
      <CardHeader>
        <CardTitle className="text-base">Add calendar event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input name="title" required placeholder="Creator review call" />
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input name="event_date" type="date" required />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <select name="event_type" className="flex h-10 w-full rounded-lg border px-3 text-sm">
              <option value="launch">Launch</option>
              <option value="review">Review</option>
              <option value="deadline">Deadline</option>
              <option value="general">General</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea name="description" rows={2} />
          </div>
          <Button type="submit" className="w-full rounded-full" disabled={loading}>
            {loading ? 'Saving…' : 'Add to calendar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
