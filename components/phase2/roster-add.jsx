'use client';

import { useRouter } from 'next/navigation';
import { addToRoster } from '@/app/actions/phase2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function RosterAdd({ creators, onRoster }) {
  const router = useRouter();

  async function add(creatorId) {
    const res = await addToRoster(creatorId);
    if (res?.error) toast.error(res.error);
    else {
      toast.success('Added to roster');
      router.refresh();
    }
  }

  return (
    <Card className="border-border/60 bg-card/90">
      <CardHeader>
        <CardTitle className="text-base">Add creator</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {creators.map((c) => (
          <Button
            key={c.id}
            size="sm"
            variant={onRoster.has(c.id) ? 'outline' : 'default'}
            className="rounded-full"
            disabled={onRoster.has(c.id)}
            onClick={() => add(c.id)}
          >
            {c.profiles?.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
