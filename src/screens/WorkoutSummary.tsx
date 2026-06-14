import { Icon } from '../components/Icon';
import { mmss, kLbs } from '../data/format';
import { useStore } from '../store/useStore';

/** Shown after Finish — replaces the screen. Done returns Home with a toast. */
export function WorkoutSummary() {
  const result = useStore((s) => s.summary)!;
  const clearSummary = useStore((s) => s.clearSummary);
  const go = useStore((s) => s.go);
  const showToast = useStore((s) => s.showToast);

  const onDone = () => {
    clearSummary();
    go('dashboard');
    showToast('Workout saved');
  };

  const stats: [string, string | number, string][] = [
    ['Duration', mmss(result.elapsed), ''],
    ['Total volume', kLbs(result.volume), 'lbs'],
    ['Sets logged', result.doneSets, ''],
    ['Exercises', result.exercises.length, ''],
  ];

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
        padding: 'calc(env(safe-area-inset-top) + 40px) 22px 30px',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 24,
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0a0a0b',
            marginBottom: 24,
          }}
        >
          <Icon name="trophy" size={40} />
        </div>
        <div
          style={{
            fontSize: 13,
            fontFamily: 'var(--mono)',
            color: 'var(--accent)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Workout complete
        </div>
        <div style={{ fontSize: 34, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginTop: 4, marginBottom: 28 }}>
          {result.name} done.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {stats.map(([l, v, u], i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 18, padding: 18 }}>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: 'var(--mono)',
                  color: 'var(--dim)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 6,
                }}
              >
                {l}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="tnum" style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
                  {v}
                </span>
                {u && <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{u}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={onDone}
        style={{
          width: '100%',
          height: 54,
          borderRadius: 16,
          border: 'none',
          background: 'var(--accent)',
          color: '#0a0a0b',
          fontSize: 16,
          fontWeight: 800,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        Done
      </button>
    </div>
  );
}
