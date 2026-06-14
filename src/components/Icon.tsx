import type { CSSProperties, ReactNode } from 'react';

export type IconName =
  | 'home' | 'dumbbell' | 'book' | 'chart' | 'user' | 'plus' | 'minus'
  | 'check' | 'chevR' | 'chevL' | 'chevD' | 'search' | 'x' | 'clock'
  | 'flame' | 'trophy' | 'scale' | 'camera' | 'edit' | 'play' | 'pause'
  | 'skip' | 'note' | 'copy' | 'calendar' | 'timer' | 'arrowUp'
  | 'arrowDown' | 'settings' | 'trash' | 'grip' | 'bolt';

interface IconProps {
  name: IconName;
  size?: number;
  stroke?: number;
  style?: CSSProperties;
}

/** Stroke line icons; inherit currentColor. Rounded 2px-stroke style. */
export function Icon({ name, size = 24, stroke = 2, style }: IconProps) {
  const p = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const paths: Record<IconName, ReactNode> = {
    home: (<><path {...p} d="M3 11l9-7 9 7" /><path {...p} d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" /></>),
    dumbbell: (<><path {...p} d="M6.5 6.5l11 11" /><path {...p} d="M3 8l3-3 2 2-3 3zM16 21l3-3-2-2-3 3z" /><path {...p} d="M2.5 11.5l2 2M11.5 2.5l2 2" /></>),
    book: (<><path {...p} d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2z" /><path {...p} d="M4 19a2 2 0 0 1 2-2h13" /></>),
    chart: (<><path {...p} d="M3 3v18h18" /><path {...p} d="M7 14l3-4 3 2 4-7" /></>),
    user: (<><circle {...p} cx="12" cy="8" r="4" /><path {...p} d="M4 21c0-4 3.5-6 8-6s8 2 8 6" /></>),
    plus: (<><path {...p} d="M12 5v14M5 12h14" /></>),
    minus: (<><path {...p} d="M5 12h14" /></>),
    check: (<><path {...p} d="M4 12l5 5L20 6" /></>),
    chevR: (<><path {...p} d="M9 6l6 6-6 6" /></>),
    chevL: (<><path {...p} d="M15 6l-6 6 6 6" /></>),
    chevD: (<><path {...p} d="M6 9l6 6 6-6" /></>),
    search: (<><circle {...p} cx="11" cy="11" r="7" /><path {...p} d="M21 21l-4-4" /></>),
    x: (<><path {...p} d="M6 6l12 12M18 6L6 18" /></>),
    clock: (<><circle {...p} cx="12" cy="12" r="9" /><path {...p} d="M12 7v5l3 2" /></>),
    flame: (<><path {...p} d="M12 3c2 3 5 5 5 9a5 5 0 0 1-10 0c0-1.5.6-2.7 1.5-3.5C9 10 9.5 11 10 11c0-2 .5-4 2-8z" /></>),
    trophy: (<><path {...p} d="M7 4h10v4a5 5 0 0 1-10 0z" /><path {...p} d="M7 5H4v1a3 3 0 0 0 3 3M17 5h3v1a3 3 0 0 1-3 3" /><path {...p} d="M12 13v4M9 21h6M10 17h4" /></>),
    scale: (<><path {...p} d="M5 7h14l1.5 12a1 1 0 0 1-1 1.2H4.5a1 1 0 0 1-1-1.2z" /><path {...p} d="M9 7a3 3 0 0 1 6 0" /><path {...p} d="M12 11v4M10 13h4" /></>),
    camera: (<><path {...p} d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L18 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" /><circle {...p} cx="12" cy="12.5" r="3.2" /></>),
    edit: (<><path {...p} d="M4 20h4L18 10l-4-4L4 16z" /><path {...p} d="M13.5 6.5l4 4" /></>),
    play: (<><path {...p} d="M7 5l11 7-11 7z" fill="currentColor" /></>),
    pause: (<><path {...p} d="M8 5v14M16 5v14" /></>),
    skip: (<><path {...p} d="M6 5l9 7-9 7zM18 5v14" /></>),
    note: (<><path {...p} d="M5 4h14v16l-3-2-3 2-3-2-2 1.5z" /><path {...p} d="M9 9h6M9 13h4" /></>),
    copy: (<><rect {...p} x="8" y="8" width="12" height="12" rx="2" /><path {...p} d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>),
    calendar: (<><rect {...p} x="3" y="5" width="18" height="16" rx="2" /><path {...p} d="M3 9h18M8 3v4M16 3v4" /></>),
    timer: (<><circle {...p} cx="12" cy="13" r="8" /><path {...p} d="M12 13V9M9 2h6" /></>),
    arrowUp: (<><path {...p} d="M12 19V5M6 11l6-6 6 6" /></>),
    arrowDown: (<><path {...p} d="M12 5v14M6 13l6 6 6-6" /></>),
    settings: (<><circle {...p} cx="12" cy="12" r="3" /><path {...p} d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></>),
    trash: (<><path {...p} d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13" /></>),
    grip: (<><circle cx="9" cy="7" r="1.4" fill="currentColor" /><circle cx="15" cy="7" r="1.4" fill="currentColor" /><circle cx="9" cy="12" r="1.4" fill="currentColor" /><circle cx="15" cy="12" r="1.4" fill="currentColor" /><circle cx="9" cy="17" r="1.4" fill="currentColor" /><circle cx="15" cy="17" r="1.4" fill="currentColor" /></>),
    bolt: (<><path {...p} d="M13 2L4 14h7l-1 8 9-12h-7z" fill="currentColor" /></>),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
