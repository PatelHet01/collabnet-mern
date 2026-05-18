import { formatINR } from './format';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function last6Months() {
  const out = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({ key: `${d.getFullYear()}-${d.getMonth()}`, month: MONTHS[d.getMonth()] });
  }
  return out;
}

export function bucketByMonth(rows, dateKey, valueKey) {
  const buckets = Object.fromEntries(last6Months().map((m) => [m.key, { ...m, spend: 0, count: 0 }]));
  for (const row of rows || []) {
    const d = new Date(row[dateKey]);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (buckets[key]) {
      buckets[key].spend += row[valueKey] || 0;
      buckets[key].count += 1;
    }
  }
  return Object.values(buckets);
}

export function countByField(rows, field) {
  const map = {};
  for (const r of rows || []) {
    const k = r[field] || 'unknown';
    map[k] = (map[k] || 0) + 1;
  }
  return Object.entries(map).map(([status, count]) => ({
    status: status.replace(/_/g, ' '),
    count,
  }));
}

export { formatINR };
