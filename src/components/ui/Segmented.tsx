interface Option {
  value: string;
  label: string;
}

interface SegmentedProps<T extends string> {
  options: (T | Option)[];
  value: T;
  onChange: (value: T) => void;
  small?: boolean;
}

/** iOS-style segmented control. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  small = false,
}: SegmentedProps<T>) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 3,
        background: 'var(--surface-2)',
        borderRadius: 12,
        padding: 3,
        border: '1px solid var(--line)',
      }}
    >
      {options.map((o) => {
        const v = (typeof o === 'string' ? o : o.value) as T;
        const label = typeof o === 'string' ? o : o.label;
        const active = v === value;
        return (
          <button
            key={v}
            onClick={() => onChange(v)}
            style={{
              flex: 1,
              padding: small ? '6px 6px' : '8px 8px',
              borderRadius: 9,
              border: 'none',
              cursor: 'pointer',
              background: active ? 'var(--surface-3)' : 'transparent',
              color: active ? 'var(--text)' : 'var(--muted)',
              fontSize: small ? 12 : 13,
              fontWeight: active ? 700 : 600,
              fontFamily: 'inherit',
              transition: 'background .15s, color .15s',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
