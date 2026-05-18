'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { ChartCard } from './chart-card';
import { formatINR } from '@/lib/format';

export function AdminAnalytics({ usersByRole, growth, gmv }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Users by role" subtitle="Current split">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={usersByRole}>
            <XAxis dataKey="status" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#171717" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Signups" subtitle="Last 6 months">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={growth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#171717" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="GMV (listed budgets)" subtitle="INR">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={gmv}>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `₹${v / 100000}`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => formatINR(v)} />
            <Bar dataKey="spend" fill="#525252" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
