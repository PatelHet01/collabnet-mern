'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { sendThreadMessage } from '@/app/actions/brand-tools';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function RealtimeChat({ threadId, currentUserId, partnerName }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!threadId) return;
    const supabase = createClient();

    async function load() {
      const { data } = await supabase
        .from('messages')
        .select('id, body, sender_id, created_at, profiles(name)')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });
      setMessages(data || []);
    }
    load();

    const channel = supabase
      .channel(`thread-${threadId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `thread_id=eq.${threadId}` },
        () => load()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [threadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(e) {
    e.preventDefault();
    if (!text.trim() || !threadId) return;
    setSending(true);
    const res = await sendThreadMessage(threadId, text.trim());
    setSending(false);
    if (res?.error) toast.error(res.error);
    else setText('');
  }

  if (!threadId) {
    return <p className="text-sm text-muted-foreground">Select a conversation to start chatting.</p>;
  }

  return (
    <div className="flex h-[480px] flex-col rounded-2xl border bg-card/90">
      <div className="border-b px-4 py-3">
        <p className="text-sm font-medium">Chat with {partnerName}</p>
        <p className="text-xs text-muted-foreground">Realtime · brand ↔ creator</p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m) => {
          const mine = m.sender_id === currentUserId;
          return (
            <div key={m.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2 text-sm',
                  mine ? 'bg-[hsl(var(--accent))] text-white' : 'bg-muted'
                )}
              >
                {!mine && <p className="mb-0.5 text-xs opacity-70">{m.profiles?.name}</p>}
                {m.body}
                <p className="mt-1 text-[10px] opacity-60">
                  {new Date(m.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="flex gap-2 border-t p-3">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" className="rounded-full" />
        <Button type="submit" disabled={sending} className="shrink-0 rounded-full">Send</Button>
      </form>
    </div>
  );
}
