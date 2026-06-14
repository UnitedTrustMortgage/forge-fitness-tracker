# FORGE — Fitness / Strength Tracker

A single-user mobile strength-training tracker, built from the design handoff in
the parent folder. Plan and run a workout, log every set (weight × reps), rest on
an auto timer, browse an exercise library, and review long-term progress
(estimated 1RM, training volume, bodyweight, PRs).

Built with **React + TypeScript + Vite**. The prototype's hand-rolled primitives
(Stepper, Sheet, charts, icons) were re-implemented as real typed components;
mock data was replaced with seeded demo data + `localStorage` persistence.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle to dist/
npm run preview  # serve the production build
```

On screens wider than 460px the app renders inside a 390×844 iPhone frame; at
≤460px it goes full-bleed with a custom status bar (honoring `env(safe-area-inset-*)`).

## Locked configuration

These are the final variants chosen in the handoff (`src/config.ts`); the
prototype's other "Tweaks" options were discarded:

| Setting | Value |
|---|---|
| Accent | `#ff5a3c` (orange-red) |
| Dashboard layout | `hero` |
| Set logging | `steppers` (two large –/+ steppers) |
| Auto rest timer | on, 90 s (+15s / Skip) |
| Chart style | `bar` |
| Navigation | 5-tab bottom bar + floating `+` FAB |

## Structure

```
src/
  config.ts            locked configuration
  types.ts             domain model
  data/
    format.ts          dates/numbers + the live TODAY
    catalog.ts         exercises, muscle-group colors, templates
    seed.ts            deterministic ~10-week history + bodyweight generator
    selectors.ts       e1RM series, weekly volume, streak, PRs, recent lifts, Epley
    merge.ts           seed + persisted user data; session builders
  store/
    useStore.ts        Zustand store (navigation, session, persisted user data)
    useData.ts         merged, memoized data + derived selectors
  components/          Icon, IOSFrame, NavBar, Toast, ImageSlot, charts, primitives (ui/)
  screens/             Dashboard, ActiveWorkout, WorkoutSummary, Library, Progress, Templates, Profile
  sheets/              StartSheet, BodyweightSheet, detail/picker (Sheets)
  App.tsx              shell + routing
```

## Persistence

The demo baseline (history, bodyweight) is regenerated relative to the real
"today" on each load, so the dashboard always looks current. User actions —
finished workouts, logged bodyweight, progress photos, and the default-rest
preference — persist to `localStorage` (`forge-store`) and layer on top of the
baseline. **You → Reset demo data** clears them.

Estimated 1RM uses the Epley formula: `round(weight × (1 + reps / 30))`.
