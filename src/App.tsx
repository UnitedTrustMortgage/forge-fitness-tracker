import { useEffect, useRef, useState, type ReactNode } from 'react';
import { IOSDevice, IOSStatusBar } from './components/IOSFrame';
import { NavBar } from './components/NavBar';
import { Toast } from './components/Toast';
import { Dashboard } from './screens/Dashboard';
import { Library } from './screens/Library';
import { Progress } from './screens/Progress';
import { Templates } from './screens/Templates';
import { Profile } from './screens/Profile';
import { ActiveWorkout } from './screens/ActiveWorkout';
import { WorkoutSummary } from './screens/WorkoutSummary';
import { StartSheet } from './sheets/StartSheet';
import { BodyweightSheet } from './sheets/BodyweightSheet';
import { Sheets } from './sheets/Sheets';
import { useStore } from './store/useStore';

/** Device shell — iPhone frame on desktop, full-bleed (with status bar) on phones. */
function Shell({ children }: { children: ReactNode }) {
  const [device, setDevice] = useState(() => window.innerWidth > 460);
  useEffect(() => {
    const onResize = () => setDevice(window.innerWidth > 460);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!device) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40 }}>
          <IOSStatusBar dark />
        </div>
        <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
      </div>
    );
  }
  return (
    <div style={{ position: 'relative' }}>
      <IOSDevice>{children}</IOSDevice>
    </div>
  );
}

export default function App() {
  const screen = useStore((s) => s.screen);
  const scrollKey = useStore((s) => s.scrollKey);
  const session = useStore((s) => s.session);
  const summary = useStore((s) => s.summary);
  const scrollRef = useRef<HTMLDivElement>(null);

  // reset scroll to top on navigation
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [scrollKey]);

  // post-workout summary takes over the whole screen
  if (summary) {
    return (
      <Shell>
        <WorkoutSummary />
        <Toast />
      </Shell>
    );
  }

  // an active session takes over the whole screen (replaces tab UI)
  if (session) {
    return (
      <Shell>
        <ActiveWorkout />
        <Sheets />
        <Toast />
      </Shell>
    );
  }

  const screenEl = (() => {
    switch (screen) {
      case 'library':
        return <Library />;
      case 'progress':
        return <Progress />;
      case 'templates':
        return <Templates />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  })();

  return (
    <Shell>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        <div style={{ height: 44, flexShrink: 0, background: 'var(--bg)' }} />
        <div
          ref={scrollRef}
          className="appscroll"
          style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}
        >
          {screenEl}
          {/* clearance for the FAB nav bar */}
          <div style={{ height: 74 }} />
        </div>
        <NavBar />
      </div>

      <StartSheet />
      <BodyweightSheet />
      <Sheets />
      <Toast />
    </Shell>
  );
}
