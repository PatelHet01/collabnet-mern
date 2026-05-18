'use client';

import { useState } from 'react';
import { RealtimeChat } from './realtime-chat';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';

export function ChatInbox({ threads, currentUserId, role }) {
  const [active, setActive] = useState(threads[0]?.id || null);
  const partner = threads.find((t) => t.id === active);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="border-border/60 bg-card/90">
        <CardContent className="p-2">
          {!threads.length && (
            <p className="p-4 text-sm text-muted-foreground">
              No threads yet. {role === 'brand' ? 'Accept a creator application to start chatting.' : 'Apply to campaigns to unlock chat.'}
            </p>
          )}
          {threads.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={cn(
                'flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors',
                active === t.id ? 'bg-accent-soft' : 'hover:bg-muted'
              )}
            >
              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">{t.partnerName}</p>
                <p className="text-xs text-muted-foreground">{t.subtitle}</p>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
      <div className="lg:col-span-2">
        <RealtimeChat
          threadId={active}
          currentUserId={currentUserId}
          partnerName={partner?.partnerName || 'Partner'}
        />
      </div>
    </div>
  );
}
