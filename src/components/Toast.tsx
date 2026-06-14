import { Icon } from './Icon';
import { useStore } from '../store/useStore';

/** Floating confirmation pill above the nav bar (~1.9s). */
export function Toast() {
  const msg = useStore((s) => s.toast);
  if (!msg) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 'calc(110px + env(safe-area-inset-bottom))',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 300,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: 'var(--text)',
          color: 'var(--bg)',
          padding: '10px 18px',
          borderRadius: 999,
          fontSize: 13.5,
          fontWeight: 700,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Icon name="check" size={16} stroke={3} /> {msg}
      </div>
    </div>
  );
}
