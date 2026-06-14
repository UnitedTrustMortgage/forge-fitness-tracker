import { useEffect, useState } from 'react';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionLabel, Segmented, Chip } from '../components/ui';
import { MetricChart } from '../components/MetricChart';
import { ImageSlot } from '../components/ImageSlot';
import { Icon } from '../components/Icon';
import { primaryBtn } from '../components/styles';
import { byId, findByName, GROUP_COLOR } from '../data/catalog';
import { shortDate, relDay, kLbs, TODAY, DAY } from '../data/format';
import { exerciseSeries, muscleBreakdown } from '../data/selectors';
import { useStore, type ProgressTab } from '../store/useStore';
import { useData } from '../store/useData';
import type { MuscleGroup } from '../types';

type Range = '4w' | '8w' | '12w';

export function Progress() {
  const { history, bodyweight, weeklyVol } = useData();
  const params = useStore((s) => s.params);
  const openBodyweight = useStore((s) => s.openBodyweight);
  const addPhoto = useStore((s) => s.showToast);

  const mainLifts = ['Barbell Bench Press', 'Back Squat', 'Deadlift', 'Overhead Press'].map((n) =>
    findByName(n),
  );

  const [tab, setTab] = useState<ProgressTab>(params.tab || 'strength');
  const [exId, setExId] = useState<string>(params.exId || mainLifts[0].id);
  const [range, setRange] = useState<Range>('8w');

  useEffect(() => {
    if (params.exId) {
      setExId(params.exId);
      setTab('strength');
    }
    if (params.tab) setTab(params.tab);
  }, [params.exId, params.tab]);

  const ex = byId[exId];
  const series = exerciseSeries(history, exId);
  const e1rmSeries = series.map((s) => ({ x: shortDate(s.date), y: s.e1rm }));
  const best = series.length ? series.reduce((a, b) => (b.e1rm > a.e1rm ? b : a)) : null;
  const first = series[0];
  const last = series[series.length - 1];
  const gain = last && first ? last.e1rm - first.e1rm : 0;

  // bodyweight
  const rangeDays = { '4w': 28, '8w': 56, '12w': 84 }[range];
  const bwSlice = bodyweight.filter((d) => (TODAY.getTime() - d.date.getTime()) / DAY <= rangeDays);
  const bwSeries = bwSlice.filter((_, i) => i % 2 === 0).map((d) => ({ x: shortDate(d.date), y: d.lbs }));
  const bwNow = bodyweight[bodyweight.length - 1].lbs;
  const bwStart = bwSlice.length ? bwSlice[0].lbs : bwNow;
  const bwChangeNum = bwNow - bwStart;
  const bwChange = bwChangeNum.toFixed(1);

  // weekly volume
  const volSeries = weeklyVol.map((w) => ({ x: w.label, y: w.volume }));

  // muscle breakdown this week
  const breakdown = muscleBreakdown(history);
  const bdMax = Math.max(...Object.values(breakdown), 1);

  return (
    <div>
      <ScreenHeader title="Progress" subtitle="Trends & records" />
      <div
        style={{
          padding: '12px 18px 0',
          position: 'sticky',
          top: 0,
          zIndex: 5,
          background: 'linear-gradient(var(--bg) 80%, transparent)',
        }}
      >
        <Segmented<ProgressTab>
          options={[
            { value: 'strength', label: 'Strength' },
            { value: 'volume', label: 'Volume' },
            { value: 'body', label: 'Bodyweight' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      <div style={{ padding: '16px 18px 24px' }}>
        {tab === 'strength' && (
          <>
            <div
              className="noscroll"
              style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -18px 16px', padding: '0 18px' }}
            >
              {mainLifts.map((l) => (
                <Chip key={l.id} active={exId === l.id} onClick={() => setExId(l.id)}>
                  {l.name.replace('Barbell ', '')}
                </Chip>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 15 }}>
                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--dim)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Best e1RM
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span className="tnum" style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
                    {best ? best.e1rm : '—'}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>lbs</span>
                </div>
              </div>
              <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 15 }}>
                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--dim)', textTransform: 'uppercase', marginBottom: 6 }}>
                  10-wk gain
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ color: '#22c55e', display: 'flex', alignSelf: 'center' }}>
                    <Icon name="arrowUp" size={18} stroke={2.6} />
                  </span>
                  <span className="tnum" style={{ fontSize: 30, fontWeight: 800, color: '#22c55e', letterSpacing: '-0.02em' }}>
                    {gain}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>lbs</span>
                </div>
              </div>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 18, padding: '15px 12px 8px', marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, margin: '0 6px 4px' }}>
                Estimated 1RM · {ex.name}
              </div>
              <MetricChart series={e1rmSeries} color="var(--accent)" unit="lbs" h={190} />
            </div>
            <SectionLabel>Recent top sets</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {series
                .slice(-5)
                .reverse()
                .map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '11px 14px',
                      background: 'var(--surface)',
                      border: '1px solid var(--line)',
                      borderRadius: 13,
                    }}
                  >
                    <div style={{ fontSize: 12, color: 'var(--dim)', fontFamily: 'var(--mono)', width: 52 }}>
                      {shortDate(s.date)}
                    </div>
                    <div style={{ flex: 1 }} />
                    <div className="tnum" style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>
                      {s.top}{' '}
                      <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', fontWeight: 600 }}>lbs</span>
                    </div>
                    <div
                      className="tnum"
                      style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--mono)', fontWeight: 700, width: 60, textAlign: 'right' }}
                    >
                      {s.e1rm} e1RM
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

        {tab === 'volume' && (
          <>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 18, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--dim)', textTransform: 'uppercase' }}>
                    This week
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span className="tnum" style={{ fontSize: 34, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
                      {kLbs(weeklyVol[weeklyVol.length - 1].volume)}
                    </span>
                    <span style={{ fontSize: 14, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>lbs lifted</span>
                  </div>
                </div>
                <div className="tnum" style={{ fontSize: 13, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>
                  {weeklyVol[weeklyVol.length - 1].sessions} sessions
                </div>
              </div>
              <MetricChart series={volSeries} color="var(--accent)" unit="lbs" h={150} />
            </div>
            <SectionLabel>This week by muscle group</SectionLabel>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 18,
                padding: 18,
              }}
            >
              {Object.entries(breakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([g, v]) => (
                  <div key={g}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>{g}</span>
                      <span className="tnum" style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
                        {kLbs(v)} lbs
                      </span>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: 'var(--surface-2)', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${(v / bdMax) * 100}%`,
                          height: '100%',
                          borderRadius: 4,
                          background: GROUP_COLOR[g as MuscleGroup],
                          transition: 'width .5s',
                        }}
                      />
                    </div>
                  </div>
                ))}
              {!Object.keys(breakdown).length && (
                <div style={{ textAlign: 'center', color: 'var(--dim)', fontSize: 13, padding: 8 }}>
                  No sets logged yet this week
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'body' && (
          <>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 18, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--dim)', textTransform: 'uppercase' }}>
                    Current
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                    <span className="tnum" style={{ fontSize: 38, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
                      {bwNow}
                    </span>
                    <span style={{ fontSize: 15, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>lbs</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <span style={{ color: bwChangeNum < 0 ? '#22c55e' : 'var(--muted)', display: 'flex' }}>
                      <Icon name={bwChangeNum < 0 ? 'arrowDown' : 'arrowUp'} size={14} stroke={2.6} />
                    </span>
                    <span className="tnum" style={{ fontSize: 13, fontWeight: 700, color: bwChangeNum < 0 ? '#22c55e' : 'var(--muted)' }}>
                      {Math.abs(Number(bwChange))} lbs · {range}
                    </span>
                  </div>
                </div>
                <div style={{ width: 120 }}>
                  <Segmented<Range> small options={['4w', '8w', '12w']} value={range} onChange={setRange} />
                </div>
              </div>
              <MetricChart series={bwSeries} color="#3b82f6" unit="lbs" h={170} />
            </div>
            <button onClick={openBodyweight} style={{ ...primaryBtn, marginBottom: 18 }}>
              <Icon name="plus" size={20} /> Log today's weight
            </button>

            <SectionLabel action="Add" onAction={() => addPhoto('Drop a photo into a slot')}>
              Progress photos
            </SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 18 }}>
              {(['front', 'side', 'back'] as const).map((label, i) => (
                <ImageSlot
                  key={i}
                  id={`bwphoto${i}`}
                  radius={14}
                  placeholder={label}
                  style={{ width: '100%', aspectRatio: '3/4' }}
                />
              ))}
            </div>

            <SectionLabel>Recent entries</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {bodyweight
                .slice(-6)
                .reverse()
                .map((d, i) => {
                  const prev = bodyweight[bodyweight.length - 1 - (i + 1)];
                  const delta = prev ? d.lbs - prev.lbs : null;
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '11px 14px',
                        background: 'var(--surface)',
                        border: '1px solid var(--line)',
                        borderRadius: 13,
                      }}
                    >
                      <div style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{relDay(d.date)}</div>
                      <div style={{ flex: 1 }} />
                      {delta != null && (
                        <div
                          className="tnum"
                          style={{ fontSize: 12, color: delta < 0 ? '#22c55e' : 'var(--dim)', fontFamily: 'var(--mono)', fontWeight: 600 }}
                        >
                          {delta > 0 ? '+' : ''}
                          {delta.toFixed(1)}
                        </div>
                      )}
                      <div className="tnum" style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>
                        {d.lbs}{' '}
                        <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', fontWeight: 600 }}>lbs</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
