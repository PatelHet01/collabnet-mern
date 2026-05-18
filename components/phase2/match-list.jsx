'use client';

import { useRouter } from 'next/navigation';
import { toggleShortlist } from '@/app/actions/phase2';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function MatchList({ creators, shortlisted }) {
  const router = useRouter();

  async function save(creatorId) {
    const res = await toggleShortlist(creatorId);
    if (res?.error) toast.error(res.error);
    else {
      toast.success('Shortlist updated');
      router.refresh();
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {creators.map((c) => (
        <Card key={c.id} className="border-border/60 bg-card/90">
          <CardContent className="pt-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{c.profiles?.name}</p>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{c.bio || 'No bio'}</p>
              </div>
              <Badge variant="solid">{c.score}% match</Badge>
            </div>
            {c.niche?.length > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">Niche: {c.niche.join(', ')}</p>
            )}
            <Button
              size="sm"
              className="mt-4 rounded-full"
              variant={shortlisted.has(c.id) ? 'outline' : 'default'}
              onClick={() => save(c.id)}
            >
              {shortlisted.has(c.id) ? 'Remove from shortlist' : 'Add to shortlist'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}