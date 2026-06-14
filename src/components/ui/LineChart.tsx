import { useEffect, useId, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { XYPoint } from '../../types';

interface LineChartProps {
  series: XYPoint[];
  color?: string;
  h?: number;
  unit?: string;
  yPad?: number;
}

/** Full line chart with axis grid, gradient fill, and drag-to-inspect dot. */
export function LineChart({
  series,
  color = 'var(--accent)',
  h = 200,
  unit = '',
  yPad = 0.12,
}: LineChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const gid = useId();
  const [w, setW] = useState(320);
  const [sel, setSel] = useState<number | null>(null);

  useEffect(() => {
    const update = () => wrapRef.current && setW(wrapRef.current.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  if (!series || series.length < 2) {
    return (
      <div
        ref={wrapRef}
        style={{
          height: h,
          color: 'var(--dim)',
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Not enough data yet
      </div>
    );
  }

  const vals = series.map((s) => s.y);
  let min = Math.min(...vals);
  let max = Math.max(...vals);
  const pad = (max - min || 1) * yPad;
  min -= pad;
  max += pad;
  const rng = max - min || 1;
  const padL = 8;
  const padR = 8;
  const padT = 14;
  const padB = 26;
  const iw = w - padL - padR;
  const ih = h - padT - padB;
  const X = (i: number) => padL + (i / (series.length - 1)) * iw;
  const Y = (v: number) => padT + ih - ((v - min) / rng) * ih;
  const pts = series.map((s, i): [number, number] => [X(i), Y(s.y)]);
  const line = pts
    .map((pt, i) => (i ? 'L' : 'M') + pt[0].toFixed(1) + ' ' + pt[1].toFixed(1))
    .join(' ');
  const area = line + ` L${X(series.length - 1)} ${padT + ih} L${X(0)} ${padT + ih} Z`;
  const gridY = [0, 0.5, 1].map((f) => padT + ih - f * ih);

  const onMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const i = Math.round(((x - padL) / iw) * (series.length - 1));
    setSel(Math.max(0, Math.min(series.length - 1, i)));
  };

  return (
    <div ref={wrapRef} style={{ width: '100%', position: 'relative' }}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        onPointerDown={onMove}
        onPointerMove={(e) => e.buttons && onMove(e)}
        onPointerLeave={() => setSel(null)}
        style={{ display: 'block', touchAction: 'pan-y' }}
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.22" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridY.map((y, i) => (
          <line key={i} x1={padL} x2={w - padR} y1={y} y2={y} stroke="var(--line)" strokeWidth="1" />
        ))}
        <path d={area} fill={`url(#${gid})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((pt, i) => (
          <circle key={i} cx={pt[0]} cy={pt[1]} r={sel === i ? 4.5 : 0} fill={color} stroke="var(--bg)" strokeWidth="2" />
        ))}
        {sel != null && (
          <line
            x1={pts[sel][0]}
            x2={pts[sel][0]}
            y1={padT}
            y2={padT + ih}
            stroke={color}
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.5"
          />
        )}
        {[0, Math.floor(series.length / 2), series.length - 1].map((i) => (
          <text
            key={i}
            x={X(i)}
            y={h - 8}
            fill="var(--dim)"
            fontSize="10.5"
            fontFamily="var(--mono)"
            textAnchor={i === 0 ? 'start' : i === series.length - 1 ? 'end' : 'middle'}
          >
            {series[i].x}
          </text>
        ))}
      </svg>
      {sel != null && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: Math.min(Math.max(pts[sel][0] - 44, 0), w - 88),
            width: 88,
            background: 'var(--surface-3)',
            border: '1px solid var(--line)',
            borderRadius: 10,
            padding: '5px 8px',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div className="tnum" style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)' }}>
            {series[sel].y}
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}> {unit}</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{series[sel].x}</div>
        </div>
      )}
    </div>
  );
}
