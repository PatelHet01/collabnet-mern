/** Amounts stored as paise (1 INR = 100 paise), same as cents */
export function formatINR(paise) {
  if (paise == null || paise === '') return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export function formatINRCompact(paise) {
  if (paise == null) return '—';
  const rupees = paise / 100;
  if (rupees >= 10000000) return `₹${(rupees / 10000000).toFixed(1)}Cr`;
  if (rupees >= 100000) return `₹${(rupees / 100000).toFixed(1)}L`;
  if (rupees >= 1000) return `₹${(rupees / 1000).toFixed(1)}K`;
  return formatINR(paise);
}

export function rupeesToPaise(rupees) {
  return Math.round(parseFloat(rupees || '0') * 100);
}

export function statusLabel(status) {
  if (!status) return '';
  return status.replace(/_/g, ' ');
}

// alias used across app
export const formatMoney = formatINR;
