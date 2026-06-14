import { useEffect, useRef } from 'react';
import { Icon, type IconName } from '../Icon';

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
  big?: boolean;
}

/** Round –/+ buttons flanking a big tabular value. Press-and-hold accelerates. */
export function Stepper({
  value,
  onChange,
  step = 5,
  min = 0,
  max = 9999,
  unit,
  big = false,
}: StepperProps) {
  const hold = useRef<ReturnType<typeof setInterval> | null>(null);
  // keep the latest value available to the hold loop without re-creating it
  const valueRef = useRef(value);
  valueRef.current = value;

  const bump = (dir: number, factor = 1) =>
    onChange(Math.max(min, Math.min(max, valueRef.current + dir * step * factor)));

  const startHold = (dir: number) => {
    bump(dir);
    let t = 0;
    hold.current = setInterval(() => {
      t++;
      bump(dir, t > 6 ? 2 : 1);
    }, 120);
  };
  const stopHold = () => {
    if (hold.current) clearInterval(hold.current);
    hold.current = null;
  };

  useEffect(() => stopHold, []);

  const btn = (icon: IconName, dir: number) => (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        startHold(dir);
      }}
      onPointerUp={stopHold}
      onPointerLeave={stopHold}
      onPointerCancel={stopHold}
      style={{
        width: big ? 52 : 44,
        height: big ? 52 : 44,
        flexShrink: 0,
        borderRadius: 14,
        border: '1px solid var(--line)',
        background: 'var(--surface-3)',
        color: 'var(--text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        touchAction: 'none',
      }}
    >
      <Icon name={icon} size={big ? 24 : 20} stroke={2.4} />
    </button>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {btn('minus', -1)}
      <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
        <span
          className="tnum"
          style={{
            fontSize: big ? 34 : 26,
            fontWeight: 800,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{ fontSize: 13, color: 'var(--muted)', marginLeft: 4, fontFamily: 'var(--mono)' }}
          >
            {unit}
          </span>
        )}
      </div>
      {btn('plus', 1)}
    </div>
  );
}
