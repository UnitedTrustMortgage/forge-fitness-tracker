import { useState } from 'react';
import { ScreenHeader, SearchBar } from '../components/ScreenHeader';
import { ExerciseList } from '../components/ExerciseList';
import { Chip } from '../components/ui';
import { EXERCISES, GROUPS, GROUP_COLOR } from '../data/catalog';
import { useStore } from '../store/useStore';

export function Library() {
  const [q, setQ] = useState('');
  const [group, setGroup] = useState<string>('All');
  const openExercise = useStore((s) => s.openExercise);

  return (
    <div>
      <ScreenHeader title="Exercises" subtitle={`${EXERCISES.length} in your library`} />
      <div
        style={{
          padding: '8px 18px 0',
          position: 'sticky',
          top: 0,
          zIndex: 5,
          background: 'linear-gradient(var(--bg) 70%, transparent)',
        }}
      >
        <SearchBar value={q} onChange={setQ} />
        <div
          className="noscroll"
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            padding: '12px 18px 4px',
            margin: '0 -18px',
          }}
        >
          {['All', ...GROUPS].map((g) => (
            <Chip
              key={g}
              active={group === g}
              color={g !== 'All' ? GROUP_COLOR[g as keyof typeof GROUP_COLOR] : 'var(--accent)'}
              onClick={() => setGroup(g)}
            >
              {g}
            </Chip>
          ))}
        </div>
      </div>
      <div style={{ padding: '6px 18px 24px' }}>
        <ExerciseList query={q} group={group} onPick={(id) => openExercise(id)} />
      </div>
    </div>
  );
}
