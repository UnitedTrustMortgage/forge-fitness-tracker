import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Icon } from '../components/Icon';
import { Stepper, Ring, EquipDot } from '../components/ui';
import { byId } from '../data/catalog';
import { mmss, kLbs } from '../data/format';
import { CONFIG } from '../config';
import { useStore } from '../store/useStore';
import type { Session, SessionExercise, SessionSet } from '../types';

const logBtn: CSSProperties = {
  width: '100%',
  height: 50,
  borderRadius: 14,
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
};

// ── Steppers set editor (the locked `steppers` log style) ─────
function SetEditor({
  set,
  onChange,
  onLog,
}: {
  set: SessionSet;
  onChange: (s: SessionSet) => void;
  onLog: () => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontFamily: 'var(--mono)',
              color: 'var(--dim)',
              letterSpacing: '0.08em',
              marginBottom: 6,
              textAlign: 'center',
            }}
          >
            WEIGHT · LBS
          </div>
          <Stepper value={set.weight} step={5} onChange={(v) => onChange({ ...set, weight: v })} />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontFamily: 'var(--mono)',
              color: 'var(--dim)',
              letterSpacing: '0.08em',
              marginBottom: 6,
              textAlign: 'center',
            }}
          >
            REPS
          </div>
          <Stepper value={set.reps} step={1} min={1} onChange={(v) => onChange({ ...set, reps: v })} />
        </div>
      </div>
      <button onClick={onLog} style={logBtn}>
        <Icon name="check" size={20} stroke={3} /> Log set
      </button>
    </div>
  );
}

// ── Exercise block ────────────────────────────────────────────
function ExerciseBlock({
  ex,
  idx,
  session,
  setSession,
  onLogSet,
  onOpenExercise,
}: {
  ex: SessionExercise;
  idx: number;
  session: Session;
  setSession: (s: Session) => void;
  onLogSet: (exIdx: number, setIdx: number) => void;
  onOpenExercise: (exId: string) => void;
}) {
  const meta = byId[ex.exId];
  const update = (fn: (e: SessionExercise) => SessionExercise) => {
    setSession({ ...session, exercises: session.exercises.map((e, i) => (i === idx ? fn(e) : e)) });
  };
  const activeIdx = ex.sets.findIndex((s) => !s.done);
  const completed = ex.sets.filter((s) => s.done).length;

  const setRow = (s: SessionSet, si: number) => {
    const isActive = si === activeIdx;
    const setVal = (val: SessionSet) =>
      update((e) => ({ ...e, sets: e.sets.map((x, i) => (i === si ? val : x)) }));

    if (s.done) {
      return (
        <div
          key={si}
          onClick={() => setVal({ ...s, done: false })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 12px',
            borderRadius: 12,
            background: 'rgba(34,197,94,0.07)',
            border: '1px solid rgba(34,197,94,0.18)',
            cursor: 'pointer',
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0a0a0b',
              flexShrink: 0,
            }}
          >
            <Icon name="check" size={16} stroke={3} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>SET {si + 1}</div>
          <div style={{ flex: 1 }} />
          <div className="tnum" style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>
            {s.weight}{' '}
            <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono)', fontWeight: 600 }}>lbs</span> ×{' '}
            {s.reps}
          </div>
        </div>
      );
    }
    if (isActive) {
      return (
        <div
          key={si}
          style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 16, padding: 14, marginBottom: 8 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                className="tnum"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  background: 'var(--accent)',
                  color: '#0a0a0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                {si + 1}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Current set</div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>
              {completed}/{ex.sets.length} done
            </div>
          </div>
          <SetEditor set={s} onChange={setVal} onLog={() => onLogSet(idx, si)} />
        </div>
      );
    }
    return (
      <div
        key={si}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 12px',
          borderRadius: 12,
          border: '1px solid var(--line)',
          marginBottom: 8,
          opacity: 0.6,
        }}
      >
        <div
          className="tnum"
          style={{
            width: 26,
            height: 26,
            borderRadius: 8,
            background: 'var(--surface-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--muted)',
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {si + 1}
        </div>
        <div style={{ fontSize: 12, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>UPCOMING</div>
        <div style={{ flex: 1 }} />
        <div className="tnum" style={{ fontSize: 14, fontWeight: 700, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
          {s.weight} × {s.reps}
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 20, padding: 16, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <EquipDot group={meta.group} />
        <div style={{ flex: 1, minWidth: 0 }} onClick={() => onOpenExercise(ex.exId)}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: 'var(--text)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {meta.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>
            {meta.equip} · {ex.lastWeight ? `last ${ex.lastWeight}×${ex.lastReps}` : 'new'}
          </div>
        </div>
        <div className="tnum" style={{ fontSize: 13, fontWeight: 700, color: completed === ex.sets.length ? '#22c55e' : 'var(--muted)', fontFamily: 'var(--mono)' }}>
          {completed}/{ex.sets.length}
        </div>
      </div>
      {ex.sets.map(setRow)}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button
          onClick={() =>
            update((e) => ({
              ...e,
              sets: [
                ...e.sets,
                {
                  weight: e.sets[e.sets.length - 1]?.weight ?? e.lastWeight ?? 0,
                  reps: e.sets[e.sets.length - 1]?.reps ?? e.lastReps ?? 8,
                  done: false,
                },
              ],
            }))
          }
          style={{
            flex: 1,
            height: 40,
            borderRadius: 12,
            border: '1px dashed var(--line)',
            background: 'transparent',
            color: 'var(--muted)',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontFamily: 'inherit',
          }}
        >
          <Icon name="plus" size={16} /> Add set
        </button>
        {ex.sets.length > 1 && (
          <button
            onClick={() => update((e) => ({ ...e, sets: e.sets.slice(0, -1) }))}
            style={{
              width: 44,
              height: 40,
              borderRadius: 12,
              border: '1px solid var(--line)',
              background: 'transparent',
              color: 'var(--dim)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="minus" size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Rest timer ────────────────────────────────────────────────
function RestTimer({
  remaining,
  total,
  onSkip,
  onAdd,
}: {
  remaining: number;
  total: number;
  onSkip: () => void;
  onAdd: () => void;
}) {
  return (
    <div style={{ position: 'absolute', left: 16, right: 16, bottom: 'calc(16px + env(safe-area-inset-bottom))', zIndex: 150 }}>
      <div
        style={{
          background: 'var(--surface-3)',
          border: '1px solid var(--line)',
          borderRadius: 18,
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        }}
      >
        <Ring value={total - remaining} max={total} size={46} stroke={5} color="var(--accent)">
          <span style={{ color: 'var(--accent)', display: 'flex' }}>
            <Icon name="timer" size={18} />
          </span>
        </Ring>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              fontFamily: 'var(--mono)',
              color: 'var(--dim)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Rest
          </div>
          <div className="tnum" style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {mmss(remaining)}
          </div>
        </div>
        <button
          onClick={onAdd}
          style={{
            height: 38,
            padding: '0 12px',
            borderRadius: 11,
            border: '1px solid var(--line)',
            background: 'var(--surface-2)',
            color: 'var(--text)',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'var(--mono)',
          }}
        >
          +15s
        </button>
        <button
          onClick={onSkip}
          style={{
            height: 38,
            padding: '0 14px',
            borderRadius: 11,
            border: 'none',
            background: 'var(--accent)',
            color: '#0a0a0b',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

interface RestState {
  remaining: number;
  total: number;
  key: number;
}

// ── Active workout screen ─────────────────────────────────────
export function ActiveWorkout() {
  const session = useStore((s) => s.session)!;
  const setSession = useStore((s) => s.setSession);
  const finishWorkout = useStore((s) => s.finishWorkout);
  const cancelWorkout = useStore((s) => s.cancelWorkout);
  const setSheet = useStore((s) => s.setSheet);
  const restSeconds = useStore((s) => s.restSeconds);

  const [elapsed, setElapsed] = useState(0);
  const [rest, setRest] = useState<RestState | null>(null);
  const restRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!rest) return;
    restRef.current = setInterval(() => {
      setRest((r) => {
        if (!r) return null;
        if (r.remaining <= 1) {
          if (restRef.current) clearInterval(restRef.current);
          return null;
        }
        return { ...r, remaining: r.remaining - 1 };
      });
    }, 1000);
    return () => {
      if (restRef.current) clearInterval(restRef.current);
    };
    // restart the interval whenever a new rest begins (key changes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest?.key]);

  const onLogSet = (exIdx: number, setIdx: number) => {
    setSession({
      ...session,
      exercises: session.exercises.map((e, i) =>
        i === exIdx ? { ...e, sets: e.sets.map((s, j) => (j === setIdx ? { ...s, done: true } : s)) } : e,
      ),
    });
    if (CONFIG.restTimer) setRest({ remaining: restSeconds, total: restSeconds, key: Date.now() });
  };

  const onCancel = () => {
    if (session.exercises.some((e) => e.sets.some((s) => s.done))) {
      if (!window.confirm('Discard this workout?')) return;
    }
    cancelWorkout();
  };

  const totalSets = session.exercises.reduce((a, e) => a + e.sets.length, 0);
  const doneSets = session.exercises.reduce((a, e) => a + e.sets.filter((s) => s.done).length, 0);
  const volume = session.exercises.reduce(
    (a, e) => a + e.sets.reduce((b, s) => b + (s.done ? s.weight * s.reps : 0), 0),
    0,
  );
  const pct = totalSets ? doneSets / totalSets : 0;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* sticky header */}
      <div
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 44px)',
          flexShrink: 0,
          background: 'var(--bg)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div style={{ padding: '8px 16px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <button
              onClick={onCancel}
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                border: '1px solid var(--line)',
                background: 'var(--surface)',
                color: 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Icon name="chevD" size={20} />
            </button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>{session.name}</div>
              <div className="tnum" style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                {mmss(elapsed)}
              </div>
            </div>
            <button
              onClick={() => finishWorkout({ ...session, elapsed, volume, doneSets })}
              style={{
                height: 38,
                padding: '0 16px',
                borderRadius: 12,
                border: 'none',
                background: 'var(--accent)',
                color: '#0a0a0b',
                fontSize: 14,
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Finish
            </button>
          </div>
          {/* progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--surface-2)', overflow: 'hidden' }}>
              <div style={{ width: `${pct * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: 3, transition: 'width .4s' }} />
            </div>
            <div className="tnum" style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
              {doneSets}/{totalSets} sets
            </div>
            <div className="tnum" style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
              {kLbs(volume)} lbs
            </div>
          </div>
        </div>
      </div>

      {/* exercises */}
      <div className="appscroll" style={{ flex: 1, overflow: 'auto', padding: '16px 16px 140px' }}>
        {session.exercises.map((ex, i) => (
          <ExerciseBlock
            key={ex.exId + '-' + i}
            ex={ex}
            idx={i}
            session={session}
            setSession={setSession}
            onLogSet={onLogSet}
            onOpenExercise={(exId) => setSheet({ type: 'detail', exId })}
          />
        ))}
        <button
          onClick={() => setSheet({ type: 'picker' })}
          style={{
            width: '100%',
            height: 50,
            borderRadius: 16,
            border: '1px dashed var(--line)',
            background: 'var(--surface)',
            color: 'var(--accent)',
            fontSize: 15,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: 'inherit',
          }}
        >
          <Icon name="plus" size={20} /> Add exercise
        </button>
      </div>

      {rest && (
        <RestTimer
          remaining={rest.remaining}
          total={rest.total}
          onSkip={() => setRest(null)}
          onAdd={() => setRest((r) => (r ? { ...r, remaining: r.remaining + 15, total: r.total + 15 } : r))}
        />
      )}
    </div>
  );
}
