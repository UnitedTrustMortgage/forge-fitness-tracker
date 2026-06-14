import type { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  /** Tint used when active (defaults to accent). */
  color?: string;
}

/** Pill filter/selection chip. Active = filled with `color`, dark text. */
export function Chip({ children, active, onClick, color }: ChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 13px',
        borderRadius: 999,
        border: '1px solid ' + (active ? 'transparent' : 'var(--line)'),
        background: active ? color || 'var(--accent)' : 'var(--surface-2)',
        color: active ? '#0a0a0b' : 'var(--muted)',
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        fontFamily: 'inherit',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}
