// Generates the PWA icons (original artwork: navy tile, orange paper-plane) with no dependencies.
// Run from the project root: node scripts/make-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

const inPoly = (x, y, pts) => { let inside = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside; } return inside; };

function icon(size, { rounded, scale }) {
  const navy = [11, 37, 69], orange = [245, 130, 32];
  // Plane polygon in a 32-unit box, scaled about the centre.
  const plane = [[5, 18], [27, 10], [21, 24], [17, 18]].map(([x, y]) => [16 + (x - 16) * scale, 16 + (y - 16.5) * scale]);
  const r = rounded ? 7 : 0;
  const raw = Buffer.alloc((size * 4 + 1) * size);
  const SS = 3; // supersampling for smooth edges
  for (let py = 0; py < size; py++) {
    const row = py * (size * 4 + 1); raw[row] = 0;
    for (let px = 0; px < size; px++) {
      let bg = 0, fg = 0;
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
        const x = ((px + (sx + 0.5) / SS) / size) * 32, y = ((py + (sy + 0.5) / SS) / size) * 32;
        const cx = Math.min(Math.max(x, r), 32 - r), cy = Math.min(Math.max(y, r), 32 - r);
        if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) { bg++; if (inPoly(x, y, plane)) fg++; }
      }
      const n = SS * SS, a = bg / n, f = bg ? fg / bg : 0, o = row + 1 + px * 4;
      for (let c = 0; c < 3; c++) raw[o + c] = Math.round(navy[c] * (1 - f) + orange[c] * f);
      raw[o + 3] = Math.round(a * 255);
    }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

writeFileSync('public/icon-192.png', icon(192, { rounded: true, scale: 1 }));
writeFileSync('public/icon-512.png', icon(512, { rounded: true, scale: 1 }));
writeFileSync('public/icon-maskable-512.png', icon(512, { rounded: false, scale: 0.7 }));
writeFileSync('public/apple-touch-icon.png', icon(180, { rounded: false, scale: 0.85 }));
console.log('Icons written to public/');
