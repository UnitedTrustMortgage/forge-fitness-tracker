import { Fragment, type ReactNode } from 'react';
import { ScreenHeader } from '../components/ScreenHeader';
import { Icon, type IconName } from '../components/Icon';
import { relDay } from '../data/format';
import { useStore } from '../store/useStore';
import { useData } from '../store/useData';

const REST_CYCLE = [60, 75, 90, 105, 120, 150, 180];

export function Profile() {
  const { prs } = useData();
  const openProgress = useStore((s) => s.openProgress);
  const restSeconds = useStore((s) => s.restSeconds);
  const setRestSeconds = useStore((s) => s.setRestSeconds);
  const resetData = useStore((s) => s.resetData);
  const showToast = useStore((s) => s.showToast);

  const cycleRest = () => {
    const idx = REST_CYCLE.indexOf(restSeconds);
    setRestSeconds(REST_CYCLE[(idx + 1) % REST_CYCLE.length] ?? 90);
  };

  const onReset = () => {
    if (window.confirm('Reset all logged workouts, weights, and photos to the demo baseline?')) {
      resetData();
      showToast('Demo data reset');
    }
  };

  const row = (
    icon: IconName,
    label: string,
    detail?: string,
    onClick?: () => void,
    color?: string,
  ) => (
    <div
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 14px', cursor: onClick ? 'pointer' : 'default' }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: (color || 'var(--accent)') + '22',
          color: color || 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={18} />
      </div>
      <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{label}</div>
      {detail && <span style={{ fontSize: 14, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{detail}</span>}
      {onClick && (
        <span style={{ color: 'var(--surface-3)', display: 'flex' }}>
          <Icon name="chevR" size={18} />
        </span>
      )}
    </div>
  );

  const card = (children: ReactNode) => (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 18, overflow: 'hidden', marginBottom: 16 }}>
      {children}
    </div>
  );
  const sep = <div style={{ height: 1, background: 'var(--line)', marginLeft: 59 }} />;

  return (
    <div>
      <ScreenHeader title="You" subtitle="Account & records" />
      <div style={{ padding: '16px 18px 24px' }}>
        {/* private badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 18,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: 'var(--accent)',
              color: '#0a0a0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            F
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>Your training log</div>
            <div style={{ fontSize: 12.5, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>Private · single-user access</div>
          </div>
          <span style={{ color: '#22c55e', display: 'flex' }}>
            <Icon name="check" size={20} stroke={2.6} />
          </span>
        </div>

        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--dim)',
            fontFamily: 'var(--mono)',
            margin: '0 0 12px',
          }}
        >
          Personal records
        </div>
        {card(
          prs.map((pr, i) => (
            <Fragment key={i}>
              <div
                onClick={() => openProgress(pr.exId)}
                style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 14px', cursor: 'pointer' }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    background: 'rgba(255,90,60,0.14)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon name="trophy" size={17} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: 'var(--text)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {pr.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>
                    {relDay(pr.date)}
                    {pr.isRecent ? ' · new PR' : ''}
                  </div>
                </div>
                <div className="tnum" style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)' }}>
                  {pr.e1rm}
                  <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', fontWeight: 600 }}> lbs</span>
                </div>
              </div>
              {i < prs.length - 1 && sep}
            </Fragment>
          )),
        )}

        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--dim)',
            fontFamily: 'var(--mono)',
            margin: '0 0 12px',
          }}
        >
          Preferences
        </div>
        {card(
          <>
            {row('scale', 'Units', 'lbs')}
            {sep}
            {row('timer', 'Default rest', `${restSeconds}s`, cycleRest)}
            {sep}
            {row('trash', 'Reset demo data', undefined, onReset, 'var(--muted)')}
          </>,
        )}

        <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--surface-3)', fontFamily: 'var(--mono)', marginTop: 8 }}>
          FORGE · v1.0
        </div>
      </div>
    </div>
  );
}
