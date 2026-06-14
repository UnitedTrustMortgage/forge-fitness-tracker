// Derived selectors over workout history + bodyweight. Pure functions so the
// store can feed them the seed merged with the user's own logged data.

import { TODAY, DAY, iso, fromToday, dow, epley } from './format';
import { byId, findByName } from './catalog';
import type {
  BodyweightEntry,
  HistorySession,
  MuscleGroup,
  PersonalRecord,
  RecentLift,
  SeriesPoint,
  WeekDay,
  WeeklyVol,
} from '../types';

const mondayOffset = () => (TODAY.getDay() === 0 ? 6 : TODAY.getDay() - 1);
const daysFromToday = (d: Date) => Math.round((d.getTime() - TODAY.getTime()) / DAY);

/** Per-session top set / e1RM / volume for one exercise, oldest → newest. */
export function exerciseSeries(history: HistorySession[], exId: string): SeriesPoint[] {
  const pts: SeriesPoint[] = [];
  history
    .slice()
    .reverse() // history is newest-first; series wants oldest-first
    .forEach((s) => {
      const e = s.exercises.find((x) => x.exId === exId);
      if (!e) return;
      let top = 0;
      let best1rm = 0;
      let vol = 0;
      e.sets.forEach((set) => {
        if (set.weight == null) return;
        const reps = set.reps || 0;
        vol += set.weight * reps;
        const orm = epley(set.weight, reps);
        if (orm > best1rm) best1rm = orm;
        if (set.weight > top) top = set.weight;
      });
      pts.push({ date: s.date, dateIso: s.dateIso, e1rm: best1rm, top, volume: vol });
    });
  return pts;
}

/** Weekly tonnage for the last 8 weeks (oldest → "This wk"). */
export function weeklyVolume(history: HistorySession[]): WeeklyVol[] {
  const weeks: WeeklyVol[] = [];
  for (let w = 7; w >= 0; w--) {
    const start = -(w * 7) - mondayOffset();
    const end = start + 7;
    let vol = 0;
    let count = 0;
    history.forEach((s) => {
      const d = daysFromToday(s.date);
      if (d >= start && d < end) {
        vol += s.volume;
        count++;
      }
    });
    weeks.push({ label: w === 0 ? 'This wk' : `${w}w`, volume: vol, sessions: count });
  }
  return weeks;
}

/** Mon–Sun consistency cells for the current week. */
export function thisWeek(history: HistorySession[]): WeekDay[] {
  const startMon = -mondayOffset();
  const days: WeekDay[] = [];
  for (let i = 0; i < 7; i++) {
    const d = fromToday(startMon + i);
    const worked = history.some((s) => s.dateIso === iso(d));
    const isToday = iso(d) === iso(TODAY);
    days.push({
      label: dow(d)[0],
      date: d,
      worked,
      planned: isToday,
      isToday,
      future: d > TODAY,
    });
  }
  return days;
}

/** Consecutive weeks with ≥3 sessions. The in-progress current week never
 *  breaks the streak (it just isn't over yet). */
export function computeStreak(history: HistorySession[]): number {
  let streak = 0;
  for (let w = 0; w < 10; w++) {
    const start = -(w * 7) - mondayOffset();
    const end = start + 7;
    const count = history.filter((s) => {
      const d = daysFromToday(s.date);
      return d >= start && d < end;
    }).length;
    if (count >= 3) streak++;
    else if (w === 0) continue;
    else break;
  }
  return streak;
}

/** Best e1RM per main lift, with a "new PR" flag if the best is the latest. */
export function computePRs(history: HistorySession[]): PersonalRecord[] {
  const prs: PersonalRecord[] = [];
  ['Barbell Bench Press', 'Back Squat', 'Deadlift', 'Overhead Press'].forEach((n) => {
    const e = findByName(n);
    const series = exerciseSeries(history, e.id);
    if (!series.length) return;
    const best = series.reduce((a, b) => (b.e1rm > a.e1rm ? b : a));
    const recent = series[series.length - 1];
    prs.push({
      exId: e.id,
      name: n,
      e1rm: best.e1rm,
      top: best.top,
      date: best.date,
      isRecent: best.dateIso === recent.dateIso,
    });
  });
  return prs;
}

/** Flattened top sets from the most recent few sessions (max 6). */
export function recentLifts(history: HistorySession[]): RecentLift[] {
  const out: RecentLift[] = [];
  history.slice(0, 4).forEach((s) => {
    s.exercises.forEach((e) => {
      const exer = byId[e.exId];
      if (exer.type === 'cardio') return;
      const top = e.sets.reduce(
        (a, b) => ((b.weight || 0) > (a.weight || 0) ? b : a),
        e.sets[0],
      );
      out.push({
        exId: e.exId,
        name: exer.name,
        date: s.date,
        weight: top.weight || 0,
        reps: top.reps || 0,
        sets: e.sets.length,
        e1rm: epley(top.weight || 0, top.reps || 0),
      });
    });
  });
  return out.slice(0, 6);
}

/** Tonnage per muscle group for the current week. */
export function muscleBreakdown(history: HistorySession[]): Record<string, number> {
  const breakdown: Record<string, number> = {};
  const startMon = -mondayOffset();
  history.forEach((s) => {
    const d = daysFromToday(s.date);
    if (d < startMon || d >= startMon + 7) return;
    s.exercises.forEach((e) => {
      const g: MuscleGroup = byId[e.exId].group;
      const v = e.sets.reduce((a, st) => a + (st.weight ? st.weight * (st.reps || 0) : 0), 0);
      breakdown[g] = (breakdown[g] || 0) + v;
    });
  });
  return breakdown;
}

/** Latest bodyweight figure. */
export function latestBodyweight(bw: BodyweightEntry[]): number {
  return bw.length ? bw[bw.length - 1].lbs : 0;
}
