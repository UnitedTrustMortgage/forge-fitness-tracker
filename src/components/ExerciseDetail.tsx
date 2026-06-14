import { Icon } from './Icon';
import { LineChart } from './ui';
import { primaryBtn } from './styles';
import { byId, GROUP_COLOR } from '../data/catalog';
import { shortDate } from '../data/format';
import { exerciseSeries } from '../data/selectors';
import { useData } from '../store/useData';

interface ExerciseDetailProps {
  exId: string;
  inWorkout?: boolean;
  onStartProgress: (exId: string) => void;
  onAddToWorkout: (exId: string) => void;
}

/** Exercise detail content (rendered inside a full bottom sheet). */
export function ExerciseDetail({ exId, inWorkout, onStartProgress, onAddToWorkout }: ExerciseDetailProps) {
  const { history } = useData();
  const e = byId[exId];
  const series = exerciseSeries(history, exId);
  const hasData = series.length >= 2;
  const best = hasData ? series.reduce((a, b) => (b.e1rm > a.e1rm ? b : a)) : null;
  const lineSeries = series.map((s) => ({ x: shortDate(s.date), y: s.e1rm }));
  const color = GROUP_COLOR[e.group];

  return (
    <div style={{ paddingBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: color + '22',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 16, height: 16, borderRadius: 5, background: color }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontFamily: 'var(--mono)', color, fontWeight: 700 }}>
            {e.group} · {e.equip}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            {e.name}
          </div>
        </div>
      </div>

      {e.note && (
        <div
          style={{
            background: 'var(--surface-2)',
            borderRadius: 14,
            padding: 14,
            fontSize: 14,
            color: 'var(--muted)',
            lineHeight: 1.5,
            marginBottom: 18,
            display: 'flex',
            gap: 10,
          }}
        >
          <span style={{ color: 'var(--accent)', flexShrink: 0 }}>
            <Icon name="note" size={18} />
          </span>
          {e.note}
        </div>
      )}

      {hasData && best ? (
        <>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {([
              ['Best e1RM', best.e1rm, 'lbs'],
              ['Top set', best.top, 'lbs'],
              ['Sessions', series.length, ''],
            ] as [string, number, string][]).map(([l, v, u], i) => (
              <div key={i} style={{ flex: 1, background: 'var(--surface-2)', borderRadius: 14, padding: '12px 10px', textAlign: 'center' }}>
                <div className="tnum" style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>
                  {v}
                </div>
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--dim)', textTransform: 'uppercase' }}>
                  {l}
                  {u ? ` ${u}` : ''}
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--surface-2)', borderRadius: 16, padding: '14px 12px 8px', marginBottom: 18 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, margin: '0 4px 6px' }}>
              Estimated 1RM over time
            </div>
            <LineChart series={lineSeries} unit="lbs" h={170} color={color} />
          </div>
        </>
      ) : (
        <div
          style={{
            background: 'var(--surface-2)',
            borderRadius: 16,
            padding: 24,
            textAlign: 'center',
            color: 'var(--dim)',
            fontSize: 14,
            marginBottom: 18,
          }}
        >
          No history yet — log this exercise to start tracking progress.
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        {inWorkout ? (
          <button onClick={() => onAddToWorkout(exId)} style={primaryBtn}>
            <Icon name="plus" size={20} /> Add to workout
          </button>
        ) : (
          <>
            {hasData && (
              <button
                onClick={() => onStartProgress(exId)}
                style={{ ...primaryBtn, background: 'var(--surface-3)', color: 'var(--text)' }}
              >
                <Icon name="chart" size={18} /> Full progress
              </button>
            )}
            <button onClick={() => onAddToWorkout(exId)} style={primaryBtn}>
              <Icon name="plus" size={20} /> Add to workout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
