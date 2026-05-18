'use client';

import { markNotificationRead } from '@/app/actions/phase2';
import { cn } from '@/lib/utils';

export function NotificationItem({ item }) {
  const unread = !item.read_at;

  async function markRead() {
    if (!unread) return;
    await markNotificationRead(item.id);
  }

  return (
    <button
      type="button"
      onClick={markRead}
      className={cn(
        'w-full p-4 text-left transition-colors hover:bg-muted/50',
        unread && 'bg-accent-soft/50'
      )}
    >
      <p className="text-sm font-medium">{item.title}</p>
      {item.body && <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>}
      <p className="mt-2 text-xs text-muted-foreground">
        {new Date(item.created_at).toLocaleString('en-IN')}
        {unread && ' · New'}
      </p>
    </button>
  );
}
