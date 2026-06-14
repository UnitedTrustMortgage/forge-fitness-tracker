// Domain types for FORGE — mirrors the data model in the design handoff.

export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Legs'
  | 'Shoulders'
  | 'Arms'
  | 'Core'
  | 'Cardio';

export type ExerciseType = 'weight' | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  group: MuscleGroup;
  equip: string;
  type: ExerciseType;
  primary: MuscleGroup;
  note: string;
}

export interface TemplateItem {
  exId: string;
  sets: number;
  reps: string;
}

export interface Template {
  name: string;
  accent: string;
  items: TemplateItem[];
}

/** A logged set inside historical / completed sessions. */
export interface HistorySet {
  done: boolean;
  weight?: number;
  reps?: number;
  time?: number; // cardio seconds
  dist?: number | null;
}

export interface HistoryExercise {
  exId: string;
  sets: HistorySet[];
}

export interface HistorySession {
  id: string;
  date: Date;
  dateIso: string;
  name: string;
  accent: string;
  durationMin: number;
  exercises: HistoryExercise[];
  volume: number;
}

export interface BodyweightEntry {
  date: Date;
  dateIso: string;
  lbs: number;
}

/** Today's planned workout (from the Push Day template, prefilled from history). */
export interface PlanExercise {
  exId: string;
  targetSets: number;
  targetReps: string;
  lastWeight: number;
  lastReps: number;
  sets: SessionSet[];
}

export interface TodayPlan {
  name: string;
  accent: string;
  exercises: PlanExercise[];
}

// ── Live session ──────────────────────────────────────────────
export interface SessionSet {
  weight: number;
  reps: number;
  done: boolean;
}

export interface SessionExercise {
  exId: string;
  lastWeight: number;
  lastReps: number;
  sets: SessionSet[];
}

export interface Session {
  name: string;
  accent: string;
  exercises: SessionExercise[];
}

export interface WorkoutSummary {
  name: string;
  elapsed: number;
  volume: number;
  doneSets: number;
  exercises: SessionExercise[];
}

// ── Derived selector outputs ──────────────────────────────────
export interface SeriesPoint {
  date: Date;
  dateIso: string;
  e1rm: number;
  top: number;
  volume: number;
}

export interface WeekDay {
  label: string;
  date: Date;
  worked: boolean;
  planned: boolean;
  isToday: boolean;
  future: boolean;
}

export interface WeeklyVol {
  label: string;
  volume: number;
  sessions: number;
}

export interface PersonalRecord {
  exId: string;
  name: string;
  e1rm: number;
  top: number;
  date: Date;
  isRecent: boolean;
}

export interface RecentLift {
  exId: string;
  name: string;
  date: Date;
  weight: number;
  reps: number;
  sets: number;
  e1rm: number;
}

// ── Chart helpers ─────────────────────────────────────────────
export interface XYPoint {
  x: string;
  y: number;
}

export interface BarDatum {
  label: string;
  value: number;
}
