'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { ChartCard } from './chart-card';
import { formatINR } from '@/lib/format';

const COLORS = ['#7c3aed', '#a78bfa', '#c4b5fd', '#ddd6fe'];

export function CreatorAnalytics({ earningsByMonth, appsByStatus, payouts }) {
  const payoutData = [
    { name: 'Paid', value: payouts.filter((p) => p.status === 'paid').length },
    { name: 'Pending', value: payouts.filter((p) => p.status === 'pending').length },
    { name: 'Processing', value: payouts.filter((p) => p.status === 'processing').length },
  ].filter((d) => d.value > 0);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Earnings pipeline" subtitle="Accepted collabs (INR)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={earningsByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => formatINR(v)} />
            <Bar dataKey="spend" fill="#7c3aed" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Applications" subtitle="Funnel">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={appsByStatus}>
            <XAxis dataKey="status" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#a78bfa" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      {payoutData.length > 0 && (
        <ChartCard title="Payouts" subtitle="Status mix">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={payoutData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {payoutData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}
