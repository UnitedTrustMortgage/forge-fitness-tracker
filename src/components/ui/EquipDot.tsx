import { GROUP_COLOR } from '../../data/catalog';
import type { MuscleGroup } from '../../types';

interface EquipDotProps {
  group: MuscleGroup;
  size?: number;
}

/** Muscle-group color tile with an inner square — used in lists and headers. */
export function EquipDot({ group, size = 38 }: EquipDotProps) {
  const c = GROUP_COLOR[group] || 'var(--muted)';
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 11,
        background: c + '22',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <div style={{ width: 9, height: 9, borderRadius: 3, background: c }} />
    </div>
  );
}
