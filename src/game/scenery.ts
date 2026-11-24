// Scenery for the flight scene: forests, snow caps, sea glints, cloud depth, airports and the aircraft's shadow.
// Purely visual and deterministic (positions come from world coordinates, never from Math.random), cheap enough to
// run every frame, and every function has a light path for low quality.
import type { EnvId } from '../types';

/** A hill edge: screen y of the hill line at screen x, given the camera. Shared with the engine's hill drawing. */
export type Edge = (x: number) => number;

const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const TREE: Partial<Record<EnvId, { color: string; pine: boolean; snow?: boolean }>> = {
  countryside: { color: '#3e7d3a', pine: false }, airfield: { color: '#4a8a44', pine: false }, mountains: { color: '#2f5d3a', pine: true },
  arctic: { color: '#2e4f45', pine: true, snow: true }, golden: { color: '#5a6b2c', pine: false }, overcast: { color: '#3d5a44', pine: true },
  rain: { color: '#36523f', pine: true }, sunset: { color: '#3b2b4f', pine: false }, night: { color: '#0f1d2e', pine: true },
};

/** A belt of trees along a hill line. par is the hill's parallax; spacing grows with distance so far rows stay light. */
export function drawForest(ctx: CanvasRenderingContext2D, env: EnvId, edge: Edge, w: number, cam: number, par: number, lite: boolean): void {
  const spec = TREE[env]; if (!spec) return;
  const step = lite ? 34 : 22; const shift = (cam * par) % step;
  ctx.save();
  for (let x = -step - shift; x < w + step; x += step) {
    const idx = Math.round((x + cam * par) / step);
    const r = hash(idx);
    if (r < 0.38) continue;
    const h = 14 + r * 18; const y = edge(x) + 3;
    ctx.fillStyle = spec.color;
    if (spec.pine) {
      ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x - h * 0.34, y); ctx.lineTo(x + h * 0.34, y); ctx.closePath(); ctx.fill();
      if (spec.snow) { ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x - h * 0.12, y - h * 0.62); ctx.lineTo(x + h * 0.12, y - h * 0.62); ctx.closePath(); ctx.fill(); }
    } else {
      ctx.beginPath(); ctx.ellipse(x, y - h * 0.62, h * 0.38, h * 0.48, 0, 0, 6.3); ctx.fill();
      ctx.fillRect(x - 1.2, y - h * 0.2, 2.4, h * 0.25);
    }
  }
  ctx.restore();
}

/** Snow above a height line on the far mountains: the far hill shape is redrawn in white, clipped to its tops. */
export function drawSnowCaps(ctx: CanvasRenderingContext2D, edge: Edge, w: number, capY: number, bottom: number): void {
  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, w, capY); ctx.clip();
  ctx.fillStyle = 'rgba(248,251,255,0.92)'; ctx.beginPath(); ctx.moveTo(0, bottom);
  for (let x = 0; x <= w; x += 16) ctx.lineTo(x, edge(x));
  ctx.lineTo(w, edge(w)); ctx.lineTo(w, bottom); ctx.closePath(); ctx.fill();
  ctx.restore();
}

/** Glints on the sea along the coast: short light dashes that drift slowly. */
export function drawSeaGlints(ctx: CanvasRenderingContext2D, w: number, y0: number, y1: number, cam: number, t: number, still: boolean): void {
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1.5; ctx.beginPath();
  for (let i = 0; i < 26; i++) {
    const x = ((i * 89 - cam * 0.35 - (still ? 0 : t * 12)) % (w + 40) + w + 40) % (w + 40) - 20;
    const y = y0 + ((i * 37) % Math.max(4, y1 - y0));
    const len = 6 + (i % 4) * 4;
    ctx.moveTo(x, y); ctx.lineTo(x + len, y);
  }
  ctx.stroke(); ctx.restore();
}

/** One cloud: three overlapping ellipses. */
function cloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath(); ctx.ellipse(x, y, 46 * s, 15 * s, 0, 0, 6.3); ctx.ellipse(x + 26 * s, y - 9 * s, 30 * s, 15 * s, 0, 0, 6.3); ctx.ellipse(x - 28 * s, y - 4 * s, 26 * s, 12 * s, 0, 0, 6.3); ctx.fill();
}

/** A distant cloud layer (slow, small, faint) or a near layer (faster, larger, translucent), for depth. */
export function drawCloudLayer(ctx: CanvasRenderingContext2D, w: number, cam: number, color: string, near: boolean, seed: number): void {
  const par = near ? 0.55 : 0.1; const n = near ? 4 : 7; const span = near ? 2400 : 1600;
  ctx.save(); ctx.fillStyle = color; ctx.globalAlpha = near ? 0.32 : 0.55;
  for (let i = 0; i < n; i++) {
    const x = (((i * (span / n) + seed * 53) - cam * par) % span + span) % span - 200;
    const y = near ? 150 + ((i * 83 + seed) % 160) : 40 + ((i * 61 + seed) % 90);
    cloud(ctx, x, y, near ? 1.9 + (i % 2) * 0.4 : 0.45 + (i % 3) * 0.12);
  }
  ctx.restore();
}

/**
 * An airport beside a runway (world x from a to b), drawn in screen space: hangar and terminal behind the runway, a
 * control tower with a beacon, a windsock at the threshold, threshold markings and edge lights. `windDir` is -1 or 1.
 */
export function drawAirport(ctx: CanvasRenderingContext2D, a: number, b: number, cam: number, ground: number, w: number, t: number, windDir: number, night: boolean, still: boolean): void {
  const sx = a - cam; const ex = b - cam;
  if (ex < -200 || sx > w + 200) return;
  ctx.save();
  // Buildings behind the runway, near the start
  const bx = sx + 120;
  ctx.fillStyle = night ? '#1d2a3c' : '#8f9cad'; ctx.fillRect(bx, ground - 38, 120, 35);            // hangar
  ctx.fillStyle = night ? '#16212f' : '#76869a'; ctx.beginPath(); ctx.moveTo(bx - 6, ground - 38); ctx.quadraticCurveTo(bx + 60, ground - 62, bx + 126, ground - 38); ctx.fill();
  ctx.fillStyle = night ? '#ffd98a' : '#4f6077'; ctx.fillRect(bx + 18, ground - 22, 84, 19);          // hangar door
  ctx.fillStyle = night ? '#223249' : '#c9d3df'; ctx.fillRect(bx + 150, ground - 26, 130, 23);       // terminal
  ctx.fillStyle = night ? 'rgba(255,224,150,0.9)' : 'rgba(80,120,170,0.75)';
  for (let i = 0; i < 9; i++) ctx.fillRect(bx + 158 + i * 13.5, ground - 20, 8, 6);
  // Control tower with a rotating beacon
  const tx = bx + 300;
  ctx.fillStyle = night ? '#223249' : '#b8c4d2'; ctx.fillRect(tx, ground - 72, 14, 69);
  ctx.fillStyle = night ? '#2d4466' : '#55708f'; ctx.fillRect(tx - 9, ground - 86, 32, 16);
  ctx.fillStyle = night ? 'rgba(255,236,170,0.95)' : 'rgba(190,225,255,0.95)'; ctx.fillRect(tx - 6, ground - 83, 26, 9);
  const on = still || Math.floor(t * 1.5) % 2 === 0;
  ctx.fillStyle = on ? '#3ee07a' : '#ffffff'; ctx.beginPath(); ctx.arc(tx + 7, ground - 90, 3, 0, 6.3); ctx.fill();
  // Windsock at the threshold: the cone streams downwind
  const wx = sx + 30;
  ctx.strokeStyle = '#5b6573'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(wx, ground - 3); ctx.lineTo(wx, ground - 44); ctx.stroke();
  const flap = still ? 0 : Math.sin(t * 6) * 2;
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i % 2 ? '#ffffff' : '#f05a28';
    const x0 = wx + windDir * i * 7; const x1 = wx + windDir * (i + 1) * 7;
    ctx.beginPath(); ctx.moveTo(x0, ground - 44 + i * 0.8 + flap * i * 0.2); ctx.lineTo(x1, ground - 44 + (i + 1) * 0.8 + flap * (i + 1) * 0.2); ctx.lineTo(x1, ground - 37 - (i + 1) * 0.8 + flap * (i + 1) * 0.2); ctx.lineTo(x0, ground - 37 - i * 0.8 + flap * i * 0.2); ctx.closePath(); ctx.fill();
  }
  // Threshold markings ("piano keys") at both ends
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  for (let i = 0; i < 4; i++) { ctx.fillRect(sx + 16 + i * 7, ground - 1, 4, 10); ctx.fillRect(ex - 44 + i * 7, ground - 1, 4, 10); }
  // Edge lights (daytime: small fittings; the low-light glow is drawn by the weather module)
  if (!night) { ctx.fillStyle = 'rgba(255,255,255,0.8)'; for (let x = sx + 6; x < ex - 4; x += 46) ctx.fillRect(x - 1, ground - 4, 2, 2); }
  ctx.restore();
}

/** The aircraft's shadow on the ground: darker and tighter the lower it flies. */
export function drawShadow(ctx: CanvasRenderingContext2D, x: number, groundY: number, height: number, span: number, night: boolean): void {
  if (height > 420) return;
  const a = Math.max(0.04, 0.3 - height / 1400) * (night ? 0.4 : 1);
  const k = 1 + height / 380;
  ctx.save(); ctx.fillStyle = `rgba(10,20,30,${a})`;
  ctx.beginPath(); ctx.ellipse(x, groundY + 4, span * 0.5 * k, 3.5 * Math.min(k, 2), 0, 0, 6.3); ctx.fill();
  ctx.restore();
}
