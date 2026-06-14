import { ScreenHeader } from '../components/ScreenHeader';
import { Icon } from '../components/Icon';
import { byId, GROUP_COLOR, TEMPLATES } from '../data/catalog';
import { useStore } from '../store/useStore';

/** Saved routines. The "+" is a stub (builder is out of scope for this build). */
export function Templates() {
  const startTemplate = useStore((s) => s.startTemplate);
  const showToast = useStore((s) => s.showToast);

  return (
    <div>
      <ScreenHeader
        title="Templates"
        subtitle="Saved routines"
        right={
          <button
            onClick={() => showToast('Routine builder — coming soon')}
            aria-label="New routine"
            style={{
              width: 40,
              height: 40,
              borderRadius: 13,
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Icon name="plus" size={22} />
          </button>
        }
      />
      <div style={{ padding: '16px 18px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {TEMPLATES.map((t, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ height: 3, background: t.accent }} />
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>
                    {t.items.length} exercises · {t.items.reduce((a, b) => a + b.sets, 0)} sets
                  </div>
                </div>
                <button
                  onClick={() => startTemplate(t)}
                  style={{
                    height: 42,
                    padding: '0 18px',
                    borderRadius: 13,
                    border: 'none',
                    background: 'var(--accent)',
                    color: '#0a0a0b',
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'inherit',
                  }}
                >
                  <Icon name="play" size={16} /> Start
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {t.items.map((it, j) => (
                  <div
                    key={j}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: 'var(--muted)',
                      background: 'var(--surface-2)',
                      padding: '5px 10px',
                      borderRadius: 8,
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: 2, background: GROUP_COLOR[byId[it.exId].group] }} />
                    {byId[it.exId].name}{' '}
                    <span style={{ color: 'var(--dim)', fontFamily: 'var(--mono)' }}>
                      {it.sets}×{it.reps}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
