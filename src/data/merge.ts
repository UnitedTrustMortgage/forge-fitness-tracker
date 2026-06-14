// Bridges the regenerated seed with the user's persisted additions, and builds
// live sessions from plans/templates. Persisted additions are JSON-friendly
// (dates as ISO strings) so nothing Date-shaped ever hits localStorage.

import { generateSeed } from './seed';
import type {
  BodyweightEntry,
  HistoryExercise,
  HistorySession,
  PlanExercise,
  Session,
  SessionExercise,
  Template,
  TodayPlan,
} from '../types';

/** Demo baseline, regenerated relative to today on every load. */
export const SEED = generateSeed();

/** Parse a local YYYY-MM-DD without the UTC shift `new Date(str)` introduces. */
export function parseIso(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// ── Persisted "addition" shapes (no Date objects) ─────────────
export interface LoggedWeight {
  dateIso: string;
  lbs: number;
}

export interface FinishedSession {
  id: string;
  dateIso: string;
  name: string;
  accent: string;
  durationMin: number;
  exercises: HistoryExercise[];
  volume: number;
}

/** Seed history + the user's finished sessions, newest first. */
export function mergeHistory(finished: FinishedSession[]): HistorySession[] {
  const revived: HistorySession[] = finished.map((f) => ({
    ...f,
    date: parseIso(f.dateIso),
  }));
  return [...revived, ...SEED.history].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );
}

/** Seed bodyweight with user entries layered on top (same day overrides), oldest first. */
export function mergeBodyweight(logged: LoggedWeight[]): BodyweightEntry[] {
  const map = new Map<string, BodyweightEntry>();
  SEED.bodyweight.forEach((e) => map.set(e.dateIso, e));
  logged.forEach((l) =>
    map.set(l.dateIso, { date: parseIso(l.dateIso), dateIso: l.dateIso, lbs: l.lbs }),
  );
  return [...map.values()].sort((a, b) => a.date.getTime() - b.date.getTime());
}

// ── Session builders ──────────────────────────────────────────
function lastNumbers(history: HistorySession[], exId: string) {
  const last = history.find((s) => s.exercises.some((e) => e.exId === exId));
  const lastEx = last && last.exercises.find((e) => e.exId === exId);
  return {
    lw: lastEx ? lastEx.sets[0].weight || 0 : 0,
    lr: lastEx ? lastEx.sets[0].reps || 8 : 8,
  };
}

export function buildExercise(
  history: HistorySession[],
  exId: string,
  nSets: number,
  reps: string | number,
): SessionExercise {
  const { lw, lr } = lastNumbers(history, exId);
  return {
    exId,
    lastWeight: lw,
    lastReps: lr,
    sets: Array.from({ length: nSets }, () => ({
      weight: lw,
      reps: parseInt(String(reps)) || 8,
      done: false,
    })),
  };
}

/** Clone today's plan into a fresh session (zero every set's done flag). */
export function cloneSession(plan: TodayPlan): Session {
  return {
    name: plan.name,
    accent: plan.accent,
    exercises: plan.exercises.map((pe: PlanExercise) => ({
      exId: pe.exId,
      lastWeight: pe.lastWeight,
      lastReps: pe.lastReps,
      sets: pe.sets.map((s) => ({ ...s, done: false })),
    })),
  };
}

export function sessionFromTemplate(history: HistorySession[], tpl: Template): Session {
  return {
    name: tpl.name,
    accent: tpl.accent,
    exercises: tpl.items.map((it) => buildExercise(history, it.exId, it.sets, it.reps)),
  };
}
