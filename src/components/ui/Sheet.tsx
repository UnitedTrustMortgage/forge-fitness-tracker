import { useEffect, useState, type ReactNode } from 'react';
import { Icon } from '../Icon';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  /** `full` sheets go up to 92% height (e.g. exercise picker / detail). */
  full?: boolean;
}

/** Bottom sheet: slides up over a fading backdrop. Drag-handle pill on top. */
export function Sheet({ open, onClose, children, title, full = false }: SheetProps) {
  const [mounted, setMounted] = useState(open);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setShow(true)),
      );
      return () => cancelAnimationFrame(id);
    }
    setShow(false);
    const t = setTimeout(() => setMounted(false), 280);
    return () => clearTimeout(t);
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          opacity: show ? 1 : 0,
          transition: 'opacity .28s',
        }}
      />
      <div
        style={{
          position: 'relative',
          background: 'var(--surface)',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          borderTop: '1px solid var(--line)',
          maxHeight: full ? '92%' : '82%',
          display: 'flex',
          flexDirection: 'column',
          transform: show ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform .32s cubic-bezier(.2,.85,.25,1)',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ padding: '12px 0 4px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 38, height: 4, borderRadius: 4, background: 'var(--surface-3)' }} />
        </div>
        {title && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 20px 12px',
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em' }}>
              {title}
            </div>
            <button
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                border: 'none',
                background: 'var(--surface-3)',
                color: 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Icon name="x" size={18} />
            </button>
          </div>
        )}
        <div
          style={{
            overflow: 'auto',
            padding: '0 20px calc(20px + env(safe-area-inset-bottom))',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
