import type { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  pad?: number;
}

/** Surface card — radius 20, hairline border. */
export function Card({ children, style, onClick, pad = 18 }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 20,
        padding: pad,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface SectionLabelProps {
  children: ReactNode;
  action?: string;
  onAction?: () => void;
}

/** Mono uppercase section header with an optional accent action on the right. */
export function SectionLabel({ children, action, onAction }: SectionLabelProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        margin: '0 0 12px',
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--dim)',
          fontFamily: 'var(--mono)',
        }}
      >
        {children}
      </div>
      {action && (
        <button
          onClick={onAction}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}
