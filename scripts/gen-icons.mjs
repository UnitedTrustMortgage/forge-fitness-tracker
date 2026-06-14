// Generates the PWA / iOS app icons from an inline SVG (FORGE "F" monogram on a
// dark tile, brand accent #ff5a3c). Run: node scripts/gen-icons.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const pub = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

// 512×512 source. Dark surface tile + bold orange "F" built from rounded rects
// (no font dependency). The glyph sits inside the maskable safe zone.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1b1b1e"/>
      <stop offset="1" stop-color="#0a0a0b"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <g fill="#ff5a3c">
    <rect x="180" y="150" width="58" height="216" rx="10"/>
    <rect x="180" y="150" width="196" height="58" rx="10"/>
    <rect x="180" y="244" width="158" height="54" rx="10"/>
  </g>
</svg>`;

writeFileSync(join(pub, 'favicon.svg'), svg);

const sizes = [
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'pwa-192.png', size: 192 },
  { file: 'pwa-512.png', size: 512 },
  { file: 'maskable-512.png', size: 512 },
];

for (const { file, size } of sizes) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(join(pub, file));
  console.log('wrote', file, size);
}
