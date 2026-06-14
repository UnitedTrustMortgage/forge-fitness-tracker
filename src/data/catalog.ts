// Exercise catalog, muscle groups + their colors, and saved templates.
// Ported from the prototype's app-data.jsx (static reference data).

import type { Exercise, ExerciseType, MuscleGroup, Template } from '../types';

export const GROUPS: MuscleGroup[] = [
  'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio',
];

export const GROUP_COLOR: Record<MuscleGroup, string> = {
  Chest: '#ff5a3c',
  Back: '#3b82f6',
  Legs: '#22c55e',
  Shoulders: '#a78bfa',
  Arms: '#f59e0b',
  Core: '#ec4899',
  Cardio: '#14b8a6',
};

let _id = 0;
const ex = (
  name: string,
  group: MuscleGroup,
  equip: string,
  opts: { type?: ExerciseType; primary?: MuscleGroup; note?: string } = {},
): Exercise => ({
  id: 'e' + ++_id,
  name,
  group,
  equip,
  type: opts.type || 'weight',
  primary: opts.primary || group,
  note: opts.note || '',
});

export const EXERCISES: Exercise[] = [
  // Chest
  ex('Barbell Bench Press', 'Chest', 'Barbell', { note: 'Flat bench, retract scapula' }),
  ex('Incline Dumbbell Press', 'Chest', 'Dumbbell'),
  ex('Cable Fly', 'Chest', 'Cable'),
  ex('Machine Chest Press', 'Chest', 'Machine'),
  ex('Push-Up', 'Chest', 'Bodyweight'),
  // Back
  ex('Deadlift', 'Back', 'Barbell', { note: 'Hinge, brace, drive through floor' }),
  ex('Pull-Up', 'Back', 'Bodyweight'),
  ex('Barbell Row', 'Back', 'Barbell'),
  ex('Lat Pulldown', 'Back', 'Cable'),
  ex('Seated Cable Row', 'Back', 'Cable'),
  ex('Face Pull', 'Back', 'Cable'),
  // Legs
  ex('Back Squat', 'Legs', 'Barbell', { note: 'Below parallel, knees track toes' }),
  ex('Romanian Deadlift', 'Legs', 'Barbell'),
  ex('Leg Press', 'Legs', 'Machine'),
  ex('Walking Lunge', 'Legs', 'Dumbbell'),
  ex('Leg Curl', 'Legs', 'Machine'),
  ex('Leg Extension', 'Legs', 'Machine'),
  ex('Calf Raise', 'Legs', 'Machine'),
  // Shoulders
  ex('Overhead Press', 'Shoulders', 'Barbell', { note: 'Strict press, squeeze glutes' }),
  ex('Dumbbell Shoulder Press', 'Shoulders', 'Dumbbell'),
  ex('Lateral Raise', 'Shoulders', 'Dumbbell'),
  ex('Rear Delt Fly', 'Shoulders', 'Dumbbell'),
  // Arms
  ex('Barbell Curl', 'Arms', 'Barbell'),
  ex('Dumbbell Curl', 'Arms', 'Dumbbell'),
  ex('Tricep Pushdown', 'Arms', 'Cable'),
  ex('Overhead Tricep Ext', 'Arms', 'Dumbbell'),
  ex('Hammer Curl', 'Arms', 'Dumbbell'),
  // Core
  ex('Hanging Leg Raise', 'Core', 'Bodyweight'),
  ex('Cable Crunch', 'Core', 'Cable'),
  ex('Plank', 'Core', 'Bodyweight', { type: 'cardio' }),
  // Cardio
  ex('Treadmill', 'Cardio', 'Machine', { type: 'cardio' }),
  ex('Rowing Machine', 'Cardio', 'Machine', { type: 'cardio' }),
  ex('Stationary Bike', 'Cardio', 'Machine', { type: 'cardio' }),
];

export const byId: Record<string, Exercise> = Object.fromEntries(
  EXERCISES.map((e) => [e.id, e]),
);

export const findByName = (name: string): Exercise => {
  const e = EXERCISES.find((x) => x.name === name);
  if (!e) throw new Error(`Unknown exercise: ${name}`);
  return e;
};

// ── Templates (saved routines) ────────────────────────────────
const tpl = (
  name: string,
  accent: string,
  items: [string, number, string][],
): Template => ({
  name,
  accent,
  items: items.map(([n, sets, reps]) => ({ exId: findByName(n).id, sets, reps })),
});

export const TEMPLATES: Template[] = [
  tpl('Push Day', '#ff5a3c', [
    ['Barbell Bench Press', 4, '5'],
    ['Overhead Press', 3, '8'],
    ['Incline Dumbbell Press', 3, '10'],
    ['Lateral Raise', 3, '15'],
    ['Tricep Pushdown', 3, '12'],
  ]),
  tpl('Pull Day', '#3b82f6', [
    ['Deadlift', 3, '5'],
    ['Pull-Up', 4, '8'],
    ['Barbell Row', 3, '8'],
    ['Seated Cable Row', 3, '12'],
    ['Barbell Curl', 3, '10'],
  ]),
  tpl('Leg Day', '#22c55e', [
    ['Back Squat', 4, '5'],
    ['Romanian Deadlift', 3, '8'],
    ['Leg Press', 3, '12'],
    ['Leg Curl', 3, '12'],
    ['Calf Raise', 4, '15'],
  ]),
  tpl('Upper Body', '#a78bfa', [
    ['Barbell Bench Press', 3, '6'],
    ['Barbell Row', 3, '8'],
    ['Dumbbell Shoulder Press', 3, '10'],
    ['Lat Pulldown', 3, '12'],
    ['Hammer Curl', 3, '12'],
  ]),
];
