import { useRef, useState, type CSSProperties } from 'react';
import { Icon } from './Icon';
import { useStore } from '../store/useStore';

interface ImageSlotProps {
  id: string;
  placeholder?: string;
  radius?: number;
  style?: CSSProperties;
}

const MAX_DIM = 720;

/** Downscale + re-encode a picked image so it fits comfortably in localStorage. */
function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('no 2d context'));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** User-fillable progress photo. Click to browse or drag an image onto it;
 *  the result persists via the store. */
export function ImageSlot({ id, placeholder = 'Drop an image', radius = 14, style }: ImageSlotProps) {
  const src = useStore((s) => s.photos[id]);
  const setPhoto = useStore((s) => s.setPhoto);
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const handleFile = async (file?: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    try {
      setPhoto(id, await toDataUrl(file));
    } catch {
      /* ignore unreadable files */
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
      style={{
        borderRadius: radius,
        overflow: 'hidden',
        background: 'var(--surface-2)',
        border: over ? '1.5px dashed var(--accent)' : '1px solid var(--line)',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {src ? (
        <img src={src} alt={placeholder} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--dim)' }}>
          <Icon name="camera" size={22} />
          <span style={{ fontSize: 11, fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {placeholder}
          </span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
        style={{ display: 'none' }}
      />
    </div>
  );
}
