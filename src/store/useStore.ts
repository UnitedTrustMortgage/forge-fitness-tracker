import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CONFIG } from '../config';
import { iso } from '../data/format';
import {
  SEED,
  mergeHistory,
  cloneSession,
  sessionFromTemplate,
  buildExercise,
  type FinishedSession,
  type LoggedWeight,
} from '../data/merge';
import type { Session, Template, TodayPlan, WorkoutSummary } from '../types';

export type Screen = 'dashboard' | 'library' | 'progress' | 'templates' | 'profile';
export type ProgressTab = 'strength' | 'volume' | 'body';

export interface RouteParams {
  exId?: string;
  tab?: ProgressTab;
}

export type Sheet =
  | { type: 'detail'; exId: string }
  | { type: 'picker' }
  | null;

interface StoreState {
  // ── ephemeral UI / navigation ──
  screen: Screen;
  params: RouteParams;
  scrollKey: number; // bumped on navigation so the scroll region resets
  session: Session | null;
  summary: WorkoutSummary | null;
  sheet: Sheet;
  startOpen: boolean;
  bwOpen: boolean;
  toast: string | null;

  // ── persisted user data ──
  finishedSessions: FinishedSession[];
  loggedWeights: LoggedWeight[];
  photos: Record<string, string>;
  restSeconds: number;

  // ── actions ──
  go: (screen: Screen, params?: RouteParams) => void;
  setSheet: (sheet: Sheet) => void;
  openExercise: (exId: string) => void;
  openProgress: (exId: string) => void;
  setSession: (session: Session | null) => void;
  startSession: (plan: TodayPlan) => void;
  startTemplate: (tpl: Template) => void;
  startEmpty: () => void;
  addExercise: (exId: string) => void;
  finishWorkout: (result: WorkoutSummary & { accent?: string }) => void;
  cancelWorkout: () => void;
  clearSummary: () => void;
  openStart: () => void;
  closeStart: () => void;
  openBodyweight: () => void;
  closeBodyweight: () => void;
  logWeight: (lbs: number) => void;
  setPhoto: (id: string, dataUrl: string) => void;
  setRestSeconds: (n: number) => void;
  resetData: () => void;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      screen: 'dashboard',
      params: {},
      scrollKey: 0,
      session: null,
      summary: null,
      sheet: null,
      startOpen: false,
      bwOpen: false,
      toast: null,

      finishedSessions: [],
      loggedWeights: [],
      photos: {},
      restSeconds: CONFIG.defaultRestSeconds,

      go: (screen, params = {}) =>
        set((s) => ({ screen, params, sheet: null, scrollKey: s.scrollKey + 1 })),

      setSheet: (sheet) => set({ sheet }),
      openExercise: (exId) => set({ sheet: { type: 'detail', exId } }),
      openProgress: (exId) =>
        set((s) => ({
          sheet: null,
          screen: 'progress',
          params: { exId },
          scrollKey: s.scrollKey + 1,
        })),

      setSession: (session) => set({ session }),

      startSession: (plan) => set({ session: cloneSession(plan), startOpen: false }),
      startTemplate: (tpl) =>
        set({
          session: sessionFromTemplate(mergeHistory(get().finishedSessions), tpl),
          startOpen: false,
        }),
      startEmpty: () =>
        set({
          session: { name: 'Quick Workout', accent: CONFIG.accent, exercises: [] },
          startOpen: false,
          sheet: { type: 'picker' },
        }),

      addExercise: (exId) => {
        const history = mergeHistory(get().finishedSessions);
        const ex = buildExercise(history, exId, 3, 8);
        const current = get().session;
        if (current) {
          set({
            session: { ...current, exercises: [...current.exercises, ex] },
            sheet: null,
          });
        } else {
          set({
            session: { name: 'Quick Workout', accent: CONFIG.accent, exercises: [ex] },
            sheet: null,
          });
        }
      },

      finishWorkout: (result) => {
        const exercises = result.exercises
          .map((e) => ({
            exId: e.exId,
            sets: e.sets
              .filter((s) => s.done)
              .map((s) => ({ done: true, weight: s.weight, reps: s.reps })),
          }))
          .filter((e) => e.sets.length > 0);
        const finished: FinishedSession = {
          id: 's' + Date.now(),
          dateIso: iso(new Date()),
          name: result.name,
          accent: result.accent ?? CONFIG.accent,
          durationMin: Math.max(1, Math.round(result.elapsed / 60)),
          exercises,
          volume: result.volume,
        };
        set((s) => ({
          finishedSessions: exercises.length
            ? [finished, ...s.finishedSessions]
            : s.finishedSessions,
          session: null,
          summary: {
            name: result.name,
            elapsed: result.elapsed,
            volume: result.volume,
            doneSets: result.doneSets,
            exercises: result.exercises,
          },
        }));
      },

      cancelWorkout: () => set({ session: null }),
      clearSummary: () => set({ summary: null }),

      openStart: () => set({ startOpen: true }),
      closeStart: () => set({ startOpen: false }),
      openBodyweight: () => set({ bwOpen: true }),
      closeBodyweight: () => set({ bwOpen: false }),

      logWeight: (lbs) => {
        const dateIso = iso(new Date());
        set((s) => {
          const others = s.loggedWeights.filter((w) => w.dateIso !== dateIso);
          return { loggedWeights: [...others, { dateIso, lbs }], bwOpen: false };
        });
        get().showToast('Bodyweight logged');
      },

      setPhoto: (id, dataUrl) =>
        set((s) => ({ photos: { ...s.photos, [id]: dataUrl } })),

      setRestSeconds: (n) => set({ restSeconds: n }),

      resetData: () =>
        set({
          finishedSessions: [],
          loggedWeights: [],
          photos: {},
          restSeconds: CONFIG.defaultRestSeconds,
        }),

      showToast: (msg) => {
        if (toastTimer) clearTimeout(toastTimer);
        set({ toast: msg });
        toastTimer = setTimeout(() => set({ toast: null }), 1900);
      },
      clearToast: () => set({ toast: null }),
    }),
    {
      name: 'forge-store',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        finishedSessions: s.finishedSessions,
        loggedWeights: s.loggedWeights,
        photos: s.photos,
        restSeconds: s.restSeconds,
      }),
    },
  ),
);

/** Latest bodyweight from the seed (used for the bodyweight sheet's initial value). */
export const seedLatestBodyweight = () =>
  SEED.bodyweight[SEED.bodyweight.length - 1]?.lbs ?? 180;
