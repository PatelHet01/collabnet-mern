'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function BrandCalendar({ events }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const byDate = {};
  for (const e of events) {
    const d = e.event_date;
    if (!byDate[d]) byDate[d] = [];
    byDate[d].push(e);
  }

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthLabel = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <Card className="border-border/60 bg-card/90">
      <CardHeader>
        <CardTitle className="font-display text-lg">{monthLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
          {WEEKDAYS.map((w) => (
            <div key={w}>{w}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} className="min-h-[72px]" />;
            const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = byDate[key] || [];
            const isToday = day === now.getDate();
            return (
              <div
                key={key}
                className={`min-h-[72px] rounded-lg border p-1 text-xs ${isToday ? 'border-[hsl(var(--accent))] bg-accent-soft' : 'border-border/50'}`}
              >
                <span className={`font-medium ${isToday ? 'text-[hsl(var(--accent))]' : ''}`}>{day}</span>
                <div className="mt-1 space-y-0.5">
                  {dayEvents.slice(0, 2).map((ev) => (
                    <p key={ev.id} className="truncate rounded bg-muted px-1 py-0.5" title={ev.title}>
                      {ev.title}
                    </p>
                  ))}
                  {dayEvents.length > 2 && <span className="text-muted-foreground">+{dayEvents.length - 2}</span>}
                </div>
              </div>
            );
          })}
        </div>
        {events.length > 0 && (
          <div className="mt-6 space-y-2 border-t pt-4">
            <p className="text-sm font-medium">Upcoming</p>
            {events.slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-center justify-between text-sm">
                <span>{e.title}</span>
                <Badge variant="outline">{new Date(e.event_date).toLocaleDateString('en-IN')}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
