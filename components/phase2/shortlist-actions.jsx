'use client';

import { useRouter } from 'next/navigation';
import { toggleShortlist } from '@/app/actions/phase2';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ShortlistActions({ creatorId }) {
  const router = useRouter();

  async function remove() {
    const res = await toggleShortlist(creatorId);
    if (res?.error) toast.error(res.error);
    else router.refresh();
  }

  return (
    <Button size="sm" variant="outline" className="rounded-full shrink-0" onClick={remove}>
      Remove
    </Button>
  );
}
