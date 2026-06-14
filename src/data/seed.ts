// Seed generator — builds ~10 weeks of realistic history + a bodyweight log,
// deterministically (seeded RNG) but relative to the live TODAY. In a shipping
// app this is the data that would live in the DB; here it's the demo baseline
// that user actions (logged workouts / weights) layer on top of.

import { TODAY, fromToday, iso } from './format';
import { TEMPLATES, byId } from './catalog';
import type {
  BodyweightEntry,
  HistoryExercise,
  HistorySession,
  HistorySet,
  TodayPlan,
} from '../types';

// Deterministic LCG so the demo looks identical every run.
const rnd = (seed: number) => {
  let s = seed;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
};

interface Prog {
  start: number;
  inc: number;
  reps: number;
}

// Progression baselines (start weight) + weekly increment for the top set.
const PROG: Record<string, Prog> = {
  'Barbell Bench Press': { start: 165, inc: 2.5, reps: 5 },
  'Back Squat': { start: 205, inc: 5, reps: 5 },
  Deadlift: { start: 245, inc: 5, reps: 5 },
  'Overhead Press': { start: 95, inc: 1.5, reps: 8 },
  'Barbell Row': { start: 135, inc: 2.5, reps: 8 },
  'Pull-Up': { start: 0, inc: 0, reps: 8 },
};

// A rotating split: Push / Pull / Legs, ~4 sessions per week.
const SPLIT = ['Push Day', 'Pull Day', 'Leg Day'];

function mondayOffset(): number {
  return TODAY.getDay() === 0 ? 6 : TODAY.getDay() - 1;
}

function buildHistory(R: () => number): HistorySession[] {
  const sessions: HistorySession[] = [];
  let splitIdx = 0;
  for (let w = 10; w >= 0; w--) {
    const weekStart = -(w * 7) - mondayOffset(); // Monday of that week
    const dayOffsets = [0, 1, 3, 5]; // Mon, Tue, Thu, Sat
    for (const off of dayOffsets) {
      const dayIdx = weekStart + off;
      if (dayIdx >= 0) continue; // only sessions strictly before today
      const t = TEMPLATES.find((x) => x.name === SPLIT[splitIdx % 3])!;
      splitIdx++;
      const date = fromToday(dayIdx);
      const exercises: HistoryExercise[] = t.items.map((it) => {
        const exer = byId[it.exId];
        const p = PROG[exer.name];
        const sets: HistorySet[] = [];
        for (let s = 0; s < it.sets; s++) {
          if (exer.type === 'cardio') {
            sets.push({ done: true, time: 600 + Math.round(R() * 300), dist: null });
            continue;
          }
          let weight: number;
          let reps: number;
          if (p) {
            const base = p.start + (10 - w) * p.inc;
            weight =
              exer.name === 'Pull-Up'
                ? 0
                : Math.max(45, Math.round((base - s * (base * 0.04)) / 2.5) * 2.5);
            reps =
              exer.name === 'Pull-Up'
                ? Math.max(5, p.reps - s)
                : p.reps + (s > 0 ? Math.round(R() * 2) : 0);
          } else {
            weight = exer.equip === 'Bodyweight' ? 0 : Math.round((40 + R() * 80) / 5) * 5;
            reps = 8 + Math.round(R() * 6);
          }
          sets.push({ done: true, weight, reps });
        }
        return { exId: it.exId, sets };
      });
      let vol = 0;
      exercises.forEach((e) =>
        e.sets.forEach((s) => {
          if (s.weight) vol += s.weight * (s.reps || 0);
        }),
      );
      sessions.push({
        id: 's' + date.getTime(),
        date,
        dateIso: iso(date),
        name: t.name,
        accent: t.accent,
        durationMin: 48 + Math.round(R() * 28),
        exercises,
        volume: vol,
      });
    }
  }
  return sessions.sort((a, b) => b.date.getTime() - a.date.getTime());
}

function buildBodyweight(R: () => number): BodyweightEntry[] {
  const out: BodyweightEntry[] = [];
  let w = 184.5;
  for (let d = 78; d >= 0; d -= 2) {
    w -= 0.18 + (R() - 0.5) * 0.7;
    const date = fromToday(-d);
    out.push({ date, dateIso: iso(date), lbs: Math.round(w * 10) / 10 });
  }
  return out;
}

function buildTodayPlan(history: HistorySession[]): TodayPlan {
  const t = TEMPLATES.find((x) => x.name === 'Push Day')!;
  return {
    name: t.name,
    accent: t.accent,
    exercises: t.items.map((it) => {
      const last = history.find((s) => s.exercises.some((e) => e.exId === it.exId));
      const lastEx = last && last.exercises.find((e) => e.exId === it.exId);
      const target = lastEx ? lastEx.sets[0] : { weight: 100, reps: 8 };
      const reps = parseInt(it.reps) || 8;
      return {
        exId: it.exId,
        targetSets: it.sets,
        targetReps: it.reps,
        lastWeight: target.weight || 0,
        lastReps: target.reps || 8,
        sets: Array.from({ length: it.sets }, () => ({
          weight: target.weight || 0,
          reps,
          done: false,
        })),
      };
    }),
  };
}

export interface Seed {
  history: HistorySession[];
  bodyweight: BodyweightEntry[];
  todayPlan: TodayPlan;
}

/** Generate the full demo baseline. Shares one RNG so output is reproducible. */
export function generateSeed(): Seed {
  const R = rnd(7);
  const history = buildHistory(R);
  const bodyweight = buildBodyweight(R);
  const todayPlan = buildTodayPlan(history);
  return { history, bodyweight, todayPlan };
}
