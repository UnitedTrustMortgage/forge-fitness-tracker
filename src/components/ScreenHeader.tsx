import type { ReactNode } from 'react';
import { Icon } from './Icon';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

/** Large screen title (30px/800) with a muted subtitle and optional right slot. */
export function ScreenHeader({ title, subtitle, right }: ScreenHeaderProps) {
  return (
    <div
      style={{
        padding: '10px 18px 8px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}
    >
      <div>
        {subtitle && (
          <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>{subtitle}</div>
        )}
        <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
          {title}
        </div>
      </div>
      {right}
    </div>
  );
}

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search exercises' }: SearchBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        padding: '0 14px',
        height: 46,
      }}
    >
      <span style={{ color: 'var(--dim)', display: 'flex' }}>
        <Icon name="search" size={19} />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          background: 'none',
          border: 'none',
          outline: 'none',
          color: 'var(--text)',
          fontSize: 15,
          fontFamily: 'inherit',
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{ background: 'none', border: 'none', color: 'var(--dim)', cursor: 'pointer', display: 'flex' }}
        >
          <Icon name="x" size={18} />
        </button>
      )}
    </div>
  );
}
