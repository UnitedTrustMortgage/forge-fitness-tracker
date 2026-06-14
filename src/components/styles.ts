import type { CSSProperties } from 'react';

/** Full-width accent action button (exercise detail, log-weight, etc.). */
export const primaryBtn: CSSProperties = {
  flex: 1,
  height: 50,
  borderRadius: 14,
  border: 'none',
  background: 'var(--accent)',
  color: '#0a0a0b',
  fontSize: 15,
  fontWeight: 800,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 7,
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
};
