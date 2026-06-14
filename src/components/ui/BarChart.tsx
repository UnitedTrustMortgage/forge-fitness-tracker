import { useEffect, useState } from 'react';
import type { BarDatum } from '../../types';

interface BarChartProps {
  data: BarDatum[];
  color?: string;
  h?: number;
  unit?: string;
  highlightLast?: boolean;
}

/** Bar chart — tap a bar to select it (shows its value on top); the last bar
 *  is highlighted by default. Bars grow in on mount. */
export function BarChart({
  data,
  color = 'var(--accent)',
  h = 160,
  highlightLast = true,
}: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const [sel, setSel] = useState<number | null>(null);
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7, height: h, padding: '4px 0' }}>
        {data.map((d, i) => {
          const active = sel === i || (sel == null && highlightLast && i === data.length - 1);
          const target = (d.value / max) * (h - 28);
          return (
            <div
              key={i}
              onPointerDown={() => setSel(i)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
                cursor: 'pointer',
                minWidth: 0,
              }}
            >
              {active && (
                <div
                  className="tnum"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: 4,
                    fontFamily: 'var(--mono)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {d.value >= 1000 ? (d.value / 1000).toFixed(1) + 'k' : d.value}
                </div>
              )}
              <div
                style={{
                  width: '100%',
                  height: `${grown ? target : 0}px`,
                  minHeight: grown ? 3 : 0,
                  borderRadius: 6,
                  background: active ? color : 'var(--surface-3)',
                  transition: 'background .15s, height .4s cubic-bezier(.2,.8,.2,1)',
                }}
              />
              <div
                style={{
                  fontSize: 10,
                  color: active ? 'var(--text)' : 'var(--dim)',
                  marginTop: 6,
                  fontFamily: 'var(--mono)',
                  whiteSpace: 'nowrap',
                }}
              >
                {d.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
