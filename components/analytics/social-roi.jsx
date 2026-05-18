'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ChartCard } from './chart-card';
import { formatINR } from '@/lib/format';

export function SocialRoiChart({ rows }) {
  const data = rows.map((r) => ({
    name: r.platform,
    views: r.views,
    spend: r.spend_paise / 100,
    cr: r.views > 0 ? ((r.conversions / r.views) * 100).toFixed(2) : 0,
    conversions: r.conversions,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Spend vs views" subtitle="INR spend (₹) vs impressions">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="views" name="Views" tick={{ fontSize: 11 }} />
            <YAxis type="number" dataKey="spend" name="Spend ₹" tick={{ fontSize: 11 }} />
            <ZAxis range={[80, 400]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v, n) => (n === 'spend' ? formatINR(v * 100) : v)} />
            <Scatter data={data} fill="hsl(var(--accent))" />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Conversion rate" subtitle="CR % by platform">
        <div className="flex h-full flex-col justify-center gap-4 px-4">
          {data.length === 0 && (
            <p className="text-sm text-muted-foreground">Add metrics below to see spend vs views and CR.</p>
          )}
          {data.map((d) => (
            <div key={d.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium capitalize">{d.name}</span>
                <span>{d.cr}% CR</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-[hsl(var(--accent))]" style={{ width: `${Math.min(Number(d.cr) * 10, 100)}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">
                {d.views.toLocaleString('en-IN')} views · {formatINR(d.spend * 100)} spend · {d.conversions} conv.
              </p>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
