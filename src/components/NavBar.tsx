import { Icon, type IconName } from './Icon';
import { useStore, type Screen } from '../store/useStore';

interface Tab {
  id: Screen;
  icon: IconName;
  label: string;
}

const TABS: Tab[] = [
  { id: 'dashboard', icon: 'home', label: 'Home' },
  { id: 'library', icon: 'dumbbell', label: 'Exercises' },
  { id: 'progress', icon: 'chart', label: 'Progress' },
  { id: 'templates', icon: 'copy', label: 'Routines' },
  { id: 'profile', icon: 'user', label: 'You' },
];

/** 5-tab bottom bar with a floating + FAB above its right side (locked `fab` nav). */
export function NavBar() {
  const screen = useStore((s) => s.screen);
  const go = useStore((s) => s.go);
  const onStart = useStore((s) => s.openStart);

  return (
    <div style={{ position: 'relative', flexShrink: 0, zIndex: 100 }}>
      <button
        onClick={onStart}
        aria-label="Start a workout"
        style={{
          position: 'absolute',
          right: 18,
          top: -64,
          width: 58,
          height: 58,
          borderRadius: 20,
          border: 'none',
          background: 'var(--accent)',
          color: '#0a0a0b',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 28px rgba(255,90,60,0.45)',
          zIndex: 110,
        }}
      >
        <Icon name="plus" size={28} stroke={2.6} />
      </button>
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          padding: '8px 8px calc(20px + env(safe-area-inset-bottom))',
          background: 'rgba(14,14,16,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--line)',
        }}
      >
        {TABS.map((t) => {
          const active = screen === t.id;
          return (
            <button
              key={t.id}
              onClick={() => go(t.id)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                color: active ? 'var(--accent)' : 'var(--dim)',
              }}
            >
              <Icon name={t.icon} size={23} stroke={active ? 2.4 : 2} />
              <span style={{ fontSize: 10, fontWeight: active ? 800 : 600, letterSpacing: '0.01em' }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
