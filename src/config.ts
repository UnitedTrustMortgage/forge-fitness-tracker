// Locked configuration — the variants the user selected in the handoff's
// "⭐ Locked configuration" table. The prototype's Tweaks panel is discarded;
// these are the only behaviors we build.

export const CONFIG = {
  /** Single brand accent: primary buttons, active states, highlights. */
  accent: '#ff5a3c',
  /** Home order: hero TodayCard → week strip → stat tiles → volume → recent. */
  dashLayout: 'hero',
  /** Active set logged with two large –/+ steppers (Weight·lbs, Reps). */
  logStyle: 'steppers',
  /** All progress charts render as bar charts. */
  chartStyle: 'bar',
  /** 5-tab bottom bar with a floating + FAB above its right side. */
  navStyle: 'fab',
  /** Auto rest timer on, 90s, with +15s and Skip. */
  restTimer: true,
  defaultRestSeconds: 90,
} as const;

export const SUCCESS = '#22c55e';
export const BODYWEIGHT_BLUE = '#3b82f6';
