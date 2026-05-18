'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCard } from './chart-card';
import { bucketByMonth } from '@/lib/analytics';

export function AgencyAnalytics({ roster, platformCreators }) {
  const rosterGrowth = bucketByMonth(roster, 'created_at', 'budget_cents').map((m) => ({
    month: m.month,
    count: m.count,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Roster growth" subtitle="Creators added">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rosterGrowth}>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Platform reach" subtitle="Total creators on CollabNet">
        <div className="flex h-full items-center justify-center">
          <p className="font-display text-5xl font-bold">{platformCreators}</p>
        </div>
      </ChartCard>
    </div>
  );
}
