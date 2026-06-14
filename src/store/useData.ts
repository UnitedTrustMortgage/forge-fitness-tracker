import { useMemo } from 'react';
import { useStore } from './useStore';
import { SEED, mergeHistory, mergeBodyweight } from '../data/merge';
import {
  computePRs,
  computeStreak,
  recentLifts,
  thisWeek,
  weeklyVolume,
} from '../data/selectors';

/** Merged, Date-rich working data + the headline derived selectors, memoized
 *  against the user's persisted additions. */
export function useData() {
  const finishedSessions = useStore((s) => s.finishedSessions);
  const loggedWeights = useStore((s) => s.loggedWeights);

  return useMemo(() => {
    const history = mergeHistory(finishedSessions);
    const bodyweight = mergeBodyweight(loggedWeights);
    return {
      history,
      bodyweight,
      todayPlan: SEED.todayPlan,
      week: thisWeek(history),
      streak: computeStreak(history),
      weeklyVol: weeklyVolume(history),
      prs: computePRs(history),
      recent: recentLifts(history),
    };
  }, [finishedSessions, loggedWeights]);
}
