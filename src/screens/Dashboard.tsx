import { Icon } from '../components/Icon';
import { Card, SectionLabel, Sparkline, BarChart, EquipDot } from '../components/ui';
import { byId } from '../data/catalog';
import { dow, shortDate, relDay, kLbs, TODAY } from '../data/format';
import { useStore } from '../store/useStore';
import { useData } from '../store/useData';
import type { TodayPlan, WeekDay } from '../types';

// ── Weekly consistency strip ──────────────────────────────────
function WeekStrip({ week, streak }: { week: WeekDay[]; streak: number }) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>This week</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
            <span className="tnum" style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)' }}>
              {week.filter((d) => d.worked).length}
            </span>
            <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 600 }}>/ 4 sessions</span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255,90,60,0.12)',
            padding: '6px 11px',
            borderRadius: 999,
          }}
        >
          <span style={{ color: 'var(--accent)', display: 'flex' }}>
            <Icon name="flame" size={16} />
          </span>
          <span className="tnum" style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)' }}>
            {streak}
          </span>
          <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>wk streak</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {week.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: 11,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: d.worked ? 'var(--accent)' : d.planned ? 'transparent' : 'var(--surface-2)',
                border: d.planned
                  ? '1.5px dashed var(--accent)'
                  : '1px solid ' + (d.worked ? 'transparent' : 'var(--line)'),
                color: d.worked ? '#0a0a0b' : d.planned ? 'var(--accent)' : 'var(--dim)',
              }}
            >
              {d.worked ? <Icon name="check" size={16} stroke={3} /> : d.planned ? <Icon name="bolt" size={14} /> : null}
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: d.isToday ? 'var(--text)' : 'var(--dim)',
                fontFamily: 'var(--mono)',
              }}
            >
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Today's-workout hero card ─────────────────────────────────
function TodayCard({ plan, onStart, onEmpty }: { plan: TodayPlan; onStart: () => void; onEmpty: () => void }) {
  const estMin = plan.exercises.length * 9;
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 22, overflow: 'hidden' }}>
      <div style={{ padding: '18px 18px 16px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: plan.accent }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
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
              Today's workout
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginTop: 3 }}>
              {plan.name}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, color: 'var(--muted)' }}>
            <div style={{ textAlign: 'right' }}>
              <div className="tnum" style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>
                {plan.exercises.length}
              </div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--dim)' }}>EXERCISES</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="tnum" style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>
                ~{estMin}
              </div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--dim)' }}>MINUTES</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {plan.exercises.map((pe, i) => (
            <div
              key={i}
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: 'var(--muted)',
                background: 'var(--surface-2)',
                padding: '5px 10px',
                borderRadius: 8,
              }}
            >
              {byId[pe.exId].name}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onStart}
            style={{
              flex: 1,
              height: 52,
              borderRadius: 15,
              border: 'none',
              background: 'var(--accent)',
              color: '#0a0a0b',
              fontSize: 16,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="play" size={18} /> Start workout
          </button>
          <button
            onClick={onEmpty}
            style={{
              width: 52,
              height: 52,
              borderRadius: 15,
              border: '1px solid var(--line)',
              background: 'var(--surface-2)',
              color: 'var(--text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Icon name="plus" size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Stat tile ─────────────────────────────────────────────────
function StatTile({
  label,
  value,
  unit,
  delta,
  deltaGood,
  spark,
  color,
  onClick,
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  deltaGood?: boolean;
  spark?: number[];
  color?: string;
  onClick?: () => void;
}) {
  return (
    <Card onClick={onClick} pad={15} style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--dim)',
          fontFamily: 'var(--mono)',
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span className="tnum" style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          {value}
        </span>
        {unit && <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{unit}</span>}
      </div>
      {spark && (
        <div style={{ marginTop: 8 }}>
          <Sparkline data={spark} w={120} h={30} color={color || 'var(--accent)'} />
        </div>
      )}
      {delta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 8 }}>
          <span style={{ color: deltaGood ? '#22c55e' : 'var(--muted)', display: 'flex' }}>
            <Icon name={delta.startsWith('-') ? 'arrowDown' : 'arrowUp'} size={13} stroke={2.5} />
          </span>
          <span className="tnum" style={{ fontSize: 12.5, fontWeight: 700, color: deltaGood ? '#22c55e' : 'var(--muted)' }}>
            {delta.replace('-', '')}
          </span>
        </div>
      )}
    </Card>
  );
}

// ── Dashboard (hero layout) ───────────────────────────────────
export function Dashboard() {
  const data = useData();
  const go = useStore((s) => s.go);
  const startSession = useStore((s) => s.startSession);
  const startEmpty = useStore((s) => s.startEmpty);
  const openProgress = useStore((s) => s.openProgress);

  const bw = data.bodyweight;
  const bwNow = bw[bw.length - 1].lbs;
  const bwDeltaNum = bwNow - bw[0].lbs;
  const bwDelta = bwDeltaNum.toFixed(1);
  const bwSpark = bw.slice(-20).map((d) => d.lbs);
  const volWeeks = data.weeklyVol;
  const volNow = volWeeks[volWeeks.length - 1].volume;
  const volBars = volWeeks.map((w) => ({ label: w.label, value: w.volume }));
  const recent = data.recent;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ padding: '12px 18px 24px' }}>
      {/* header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>{greeting}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
            {dow(TODAY)}, {shortDate(TODAY)}
          </div>
        </div>
      </div>

      {/* hero TodayCard */}
      <div style={{ marginBottom: 18 }}>
        <TodayCard plan={data.todayPlan} onStart={() => startSession(data.todayPlan)} onEmpty={startEmpty} />
      </div>

      {/* week strip */}
      <div style={{ marginBottom: 18 }}>
        <WeekStrip week={data.week} streak={data.streak} />
      </div>

      {/* stat tiles */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
        <StatTile
          label="Bodyweight"
          value={bwNow}
          unit="lbs"
          delta={bwDelta}
          deltaGood={bwDeltaNum < 0}
          spark={bwSpark}
          color="#3b82f6"
          onClick={() => go('progress', { tab: 'body' })}
        />
        <StatTile
          label="Weekly volume"
          value={kLbs(volNow)}
          unit="lbs"
          spark={volWeeks.map((w) => w.volume)}
          color="var(--accent)"
          onClick={() => go('progress', { tab: 'volume' })}
        />
      </div>

      {/* volume / week */}
      <div style={{ marginBottom: 22 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>Volume / week</div>
            <div className="tnum" style={{ fontSize: 13, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>
              lbs lifted
            </div>
          </div>
          <BarChart data={volBars} h={130} unit="lbs" />
        </Card>
      </div>

      {/* recent lifts */}
      <div>
        <SectionLabel action="Progress →" onAction={() => go('progress')}>
          Recent lifts
        </SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recent.map((r, i) => (
            <div
              key={i}
              onClick={() => openProgress(r.exId)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 14,
                cursor: 'pointer',
              }}
            >
              <EquipDot group={byId[r.exId].group} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14.5,
                    fontWeight: 700,
                    color: 'var(--text)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {r.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>
                  {relDay(r.date)} · {r.sets} sets
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="tnum" style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>
                  {r.weight}
                  <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>×{r.reps}</span>
                </div>
                <div className="tnum" style={{ fontSize: 11, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>
                  {r.e1rm} e1RM
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
