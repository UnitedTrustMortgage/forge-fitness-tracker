// Date + number formatting helpers (the prototype's `F` object), plus the
// app's notion of "today". The prototype hard-coded a demo date; a real app is
// live, so TODAY is the actual current day (local midnight) and all mock
// history is generated relative to it.

export const DAY = 86400000;

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Local midnight of the current day. */
function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export const TODAY = startOfToday();

export const addDays = (d: Date, n: number) => new Date(d.getTime() + n * DAY);
export const fromToday = (n: number) => addDays(TODAY, n);

/** Local YYYY-MM-DD (avoids the UTC off-by-one of toISOString). */
export function iso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const shortDate = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getDate()}`;
export const dow = (d: Date) => DOW[d.getDay()];

export function relDay(d: Date): string {
  const diff = Math.round((d.getTime() - TODAY.getTime()) / DAY);
  if (diff === 0) return 'Today';
  if (diff === -1) return 'Yesterday';
  if (diff === 1) return 'Tomorrow';
  if (diff < 0 && diff > -7) return `${-diff} days ago`;
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/** Epley estimated 1RM. */
export const epley = (w: number, r: number) => Math.round(w * (1 + r / 30));

export const comma = (n: number) => n.toLocaleString('en-US');

export const mmss = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** Compact tonnage: 23800 -> "23.8k". */
export const kLbs = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(Math.round(n));

export const F = {
  TODAY,
  shortDate,
  dow,
  relDay,
  epley,
  comma,
  mmss,
  iso,
  kLbs,
};
