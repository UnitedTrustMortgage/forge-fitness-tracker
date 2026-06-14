import { useState } from 'react';
import { Sheet, Chip } from '../components/ui';
import { SearchBar } from '../components/ScreenHeader';
import { ExerciseList } from '../components/ExerciseList';
import { ExerciseDetail } from '../components/ExerciseDetail';
import { byId, GROUPS, GROUP_COLOR } from '../data/catalog';
import { useStore } from '../store/useStore';

/** Renders the exercise-detail or exercise-picker sheet (whichever is open). */
export function Sheets() {
  const sheet = useStore((s) => s.sheet);
  const setSheet = useStore((s) => s.setSheet);
  const session = useStore((s) => s.session);
  const addExercise = useStore((s) => s.addExercise);
  const openProgress = useStore((s) => s.openProgress);
  const showToast = useStore((s) => s.showToast);

  const [q, setQ] = useState('');
  const [group, setGroup] = useState<string>('All');

  const close = () => {
    setSheet(null);
    setQ('');
    setGroup('All');
  };

  const addToWorkout = (exId: string) => {
    const had = !!session;
    addExercise(exId); // appends (or starts a quick workout) and closes the sheet
    if (had) showToast(byId[exId].name + ' added');
    setQ('');
    setGroup('All');
  };

  if (sheet?.type === 'detail') {
    return (
      <Sheet open onClose={close} full>
        <ExerciseDetail
          exId={sheet.exId}
          inWorkout={!!session}
          onStartProgress={(id) => openProgress(id)}
          onAddToWorkout={addToWorkout}
        />
      </Sheet>
    );
  }

  if (sheet?.type === 'picker') {
    return (
      <Sheet open onClose={close} title="Add exercise" full>
        <div style={{ position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 2, paddingBottom: 10 }}>
          <SearchBar value={q} onChange={setQ} />
          <div className="noscroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 0 2px' }}>
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
        <ExerciseList query={q} group={group} compact onPick={addToWorkout} />
      </Sheet>
    );
  }

  return null;
}
