import { useEffect, useState } from 'react';
import { Sheet, Stepper } from '../components/ui';
import { dow, shortDate, TODAY } from '../data/format';
import { useStore } from '../store/useStore';
import { useData } from '../store/useData';

/** Log today's bodyweight via a big editable value + 0.2 lb stepper. */
export function BodyweightSheet() {
  const { bodyweight } = useData();
  const open = useStore((s) => s.bwOpen);
  const close = useStore((s) => s.closeBodyweight);
  const logWeight = useStore((s) => s.logWeight);

  const latest = bodyweight[bodyweight.length - 1]?.lbs ?? 180;
  const [w, setW] = useState(latest);

  useEffect(() => {
    if (open) setW(latest);
  }, [open, latest]);

  return (
    <Sheet open={open} onClose={close} title="Log bodyweight">
      <div style={{ textAlign: 'center', padding: '8px 0 18px' }}>
        <div
          style={{
            fontSize: 12,
            fontFamily: 'var(--mono)',
            color: 'var(--dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {dow(TODAY)}, {shortDate(TODAY)}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6, margin: '6px 0 18px' }}>
          <span className="tnum" style={{ fontSize: 56, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
            {w.toFixed(1)}
          </span>
          <span style={{ fontSize: 18, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>lbs</span>
        </div>
        <div style={{ maxWidth: 240, margin: '0 auto' }}>
          <Stepper value={Math.round(w * 10)} step={2} onChange={(v) => setW(v / 10)} big />
          <div style={{ fontSize: 11, color: 'var(--dim)', fontFamily: 'var(--mono)', marginTop: 8 }}>
            tap to adjust · 0.2 lb steps
          </div>
        </div>
      </div>
      <button
        onClick={() => logWeight(Math.round(w * 10) / 10)}
        style={{
          width: '100%',
          height: 52,
          borderRadius: 15,
          border: 'none',
          background: 'var(--accent)',
          color: '#0a0a0b',
          fontSize: 16,
          fontWeight: 800,
          cursor: 'pointer',
          marginBottom: 8,
        }}
      >
        Save entry
      </button>
    </Sheet>
  );
}
