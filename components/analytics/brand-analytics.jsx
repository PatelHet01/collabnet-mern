'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { ChartCard } from './chart-card';
import { formatINR } from '@/lib/format';

export function BrandAnalytics({ spendByMonth, appsByStatus, campaigns }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Spend by month" subtitle="INR">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={spendByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v / 100000}`} />
            <Tooltip formatter={(v) => formatINR(v)} />
            <Bar dataKey="spend" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Applications" subtitle="By status">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={appsByStatus} layout="vertical">
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="status" width={80} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#78716c" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Campaign pipeline" subtitle="Last 6 months">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={campaigns}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
