import { Icon } from '../components/Icon';
import { Sheet } from '../components/ui';
import { TEMPLATES } from '../data/catalog';
import { useStore } from '../store/useStore';
import { useData } from '../store/useData';

/** Opened by the FAB — start today's plan, an empty workout, or a routine. */
export function StartSheet() {
  const { todayPlan } = useData();
  const open = useStore((s) => s.startOpen);
  const close = useStore((s) => s.closeStart);
  const startSession = useStore((s) => s.startSession);
  const startEmpty = useStore((s) => s.startEmpty);
  const startTemplate = useStore((s) => s.startTemplate);

  return (
    <Sheet open={open} onClose={close} title="Start a workout">
      <button
        onClick={() => startSession(todayPlan)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: 16,
          background: 'var(--surface-2)',
          border: '1px solid var(--line)',
          borderRadius: 16,
          cursor: 'pointer',
          marginBottom: 10,
          textAlign: 'left',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 13,
            background: 'var(--accent)',
            color: '#0a0a0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="bolt" size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>Today's plan</div>
          <div style={{ fontSize: 12.5, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>
            {todayPlan.name} · {todayPlan.exercises.length} exercises
          </div>
        </div>
        <span style={{ color: 'var(--dim)', display: 'flex' }}>
          <Icon name="chevR" size={20} />
        </span>
      </button>

      <button
        onClick={startEmpty}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: 16,
          background: 'var(--surface-2)',
          border: '1px solid var(--line)',
          borderRadius: 16,
          cursor: 'pointer',
          marginBottom: 18,
          textAlign: 'left',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 13,
            background: 'var(--surface-3)',
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="plus" size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>Empty workout</div>
          <div style={{ fontSize: 12.5, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>Build as you go</div>
        </div>
        <span style={{ color: 'var(--dim)', display: 'flex' }}>
          <Icon name="chevR" size={20} />
        </span>
      </button>

      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--dim)',
          fontFamily: 'var(--mono)',
          marginBottom: 10,
        }}
      >
        From a routine
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {TEMPLATES.map((t, i) => (
          <button
            key={i}
            onClick={() => startTemplate(t)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 13,
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
              borderRadius: 14,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ width: 8, height: 32, borderRadius: 4, background: t.accent }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{t.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>
                {t.items.length} exercises
              </div>
            </div>
            <span style={{ color: 'var(--accent)', display: 'flex' }}>
              <Icon name="play" size={16} />
            </span>
          </button>
        ))}
      </div>
    </Sheet>
  );
}
