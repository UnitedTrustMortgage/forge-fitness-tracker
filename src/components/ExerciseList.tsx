import { Icon } from './Icon';
import { EquipDot } from './ui';
import { EXERCISES, GROUPS, GROUP_COLOR } from '../data/catalog';
import { exerciseSeries } from '../data/selectors';
import { useData } from '../store/useData';
import type { MuscleGroup } from '../types';

interface ExerciseListProps {
  query?: string;
  group?: string;
  /** Compact = hide the right-hand best-lbs stat (used in the picker sheet). */
  compact?: boolean;
  onPick: (exId: string) => void;
}

/** Exercises grouped by muscle. Reused in the Library and the picker sheet. */
export function ExerciseList({ query, group, compact, onPick }: ExerciseListProps) {
  const { history } = useData();
  const list = EXERCISES.filter((e) => {
    const q = (query || '').toLowerCase();
    const mq = !q || e.name.toLowerCase().includes(q) || e.equip.toLowerCase().includes(q);
    const mg = !group || group === 'All' || e.group === group;
    return mq && mg;
  });

  const groups: Partial<Record<MuscleGroup, typeof EXERCISES>> = {};
  list.forEach((e) => {
    (groups[e.group] = groups[e.group] || []).push(e);
  });
  const order = GROUPS.filter((g) => groups[g]);

  return (
    <div>
      {order.map((g) => (
        <div key={g} style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--dim)',
              fontFamily: 'var(--mono)',
              margin: '0 4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: 2, background: GROUP_COLOR[g] }} />
            {g}
            <span style={{ color: 'var(--surface-3)' }}>·</span>
            <span style={{ color: 'var(--dim)' }}>{groups[g]!.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {groups[g]!.map((e) => {
              const series = exerciseSeries(history, e.id);
              const top = series.length ? series[series.length - 1].top : null;
              return (
                <div
                  key={e.id}
                  onClick={() => onPick(e.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '11px 13px',
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: 14,
                    cursor: 'pointer',
                  }}
                >
                  <EquipDot group={e.group} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14.5,
                        fontWeight: 700,
                        color: 'var(--text)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {e.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>
                      {e.equip}
                      {e.type === 'cardio' ? ' · cardio' : ''}
                    </div>
                  </div>
                  {top != null && top > 0 && !compact && (
                    <div style={{ textAlign: 'right' }}>
                      <div className="tnum" style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>
                        {top}
                      </div>
                      <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--dim)' }}>BEST LBS</div>
                    </div>
                  )}
                  <span style={{ color: 'var(--surface-3)', display: 'flex' }}>
                    <Icon name="chevR" size={18} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {!order.length && (
        <div style={{ textAlign: 'center', color: 'var(--dim)', padding: 40, fontSize: 14 }}>
          No exercises found
        </div>
      )}
    </div>
  );
}
