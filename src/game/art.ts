// Original procedural aircraft artwork (no third-party assets). Used by the game and the hangar.
import type { GameAircraft } from '../types';

function ellipse(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, fill: string) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
}

/** Draws an aircraft centred on the origin, nose to the right. `t` animates the propeller. */
export function drawAircraft(ctx: CanvasRenderingContext2D, ac: GameAircraft, color: string, t = 0, gearDown = true) {
  const s = ac.size;
  const long = ac.kind === 'airliner' ? 1.5 : ac.kind === 'turboprop' ? 1.3 : ac.kind === 'jet' ? 1.15 : 1;
  const L = 30 * s * long;
  const h = (ac.kind === 'airliner' ? 7.5 : 8.5) * s;
  const dark = '#22364f';

  // Fin and tailplane
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(-L + 2, -2); ctx.lineTo(-L - 5, -h - 13 * s); ctx.lineTo(-L + 9, -h - 13 * s); ctx.lineTo(-L + 20, -h + 2); ctx.closePath(); ctx.fill();
  ellipse(ctx, -L + 5, ac.kind === 'turboprop' ? -h - 12 * s : -2, 12 * s, 2.6, dark);

  // Landing gear (fixed on the trainers)
  if (gearDown && (ac.kind === 'single' || ac.kind === 'twin')) {
    ctx.strokeStyle = dark; ctx.lineWidth = 2;
    for (const gx of [L - 14, -6]) { ctx.beginPath(); ctx.moveTo(gx, h - 2); ctx.lineTo(gx, h + 7); ctx.stroke(); ellipse(ctx, gx, h + 8, 4, 4, dark); }
  }

  // Fuselage
  ctx.beginPath();
  ctx.moveTo(-L, -3);
  ctx.quadraticCurveTo(-L + 6, -h, -L + 22, -h);
  ctx.lineTo(L - 16, -h);
  ctx.quadraticCurveTo(L + 5, -h + 2, L + 7, 2);
  ctx.quadraticCurveTo(L + 2, h, L - 14, h);
  ctx.lineTo(-L + 16, h);
  ctx.quadraticCurveTo(-L + 2, h - 2, -L, -3);
  ctx.closePath();
  ctx.fillStyle = '#fbfdff'; ctx.fill();
  ctx.strokeStyle = '#8fa5bd'; ctx.lineWidth = 1.2; ctx.stroke();

  // Livery stripe
  ctx.fillStyle = color; ctx.fillRect(-L + 8, 1, 2 * L - 20, 3 * s);

  // Cockpit glazing
  ctx.fillStyle = '#2b6cb0';
  ctx.beginPath(); ctx.moveTo(L - 20, -h + 1.5); ctx.lineTo(L - 7, -h + 3.5); ctx.lineTo(L - 1, -1.5); ctx.lineTo(L - 22, -1.5); ctx.closePath(); ctx.fill();

  // Cabin windows
  if (ac.kind === 'airliner' || ac.kind === 'turboprop' || ac.kind === 'jet') {
    ctx.fillStyle = '#5b7ea8';
    for (let x = -L + 22; x < L - 28; x += 7) ctx.fillRect(x, -h + 3.5, 3.4, 3);
  }

  // Wing
  if (ac.highWing) {
    ellipse(ctx, 2, -h - 1.5, 17 * s, 3.2, dark);
    ctx.strokeStyle = dark; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(6, -h); ctx.lineTo(0, h - 3); ctx.stroke();
  } else if (ac.kind === 'turboprop') {
    ellipse(ctx, 0, -h - 1, 20 * s, 3.4, dark);
  } else {
    ellipse(ctx, -3, h - 3, (ac.kind === 'airliner' ? 24 : 18) * s, 4, dark);
  }

  // Powerplant
  const spin = 0.35 + 0.25 * Math.sin(t * 40);
  const prop = (x: number, y: number, r: number) => { ctx.globalAlpha = spin; ellipse(ctx, x, y, 2.4, r, '#1b2b3f'); ctx.globalAlpha = 1; ellipse(ctx, x, y, 2.6, 2.6, '#c9d4e0'); };
  if (ac.kind === 'single') prop(L + 8, 1, 14 * s);
  if (ac.kind === 'twin') { ellipse(ctx, 4, h - 3, 11 * s, 4.2, '#dbe4ee'); prop(4 + 12 * s, h - 3, 11 * s); }
  if (ac.kind === 'turboprop') { ellipse(ctx, 6, -h + 2, 13 * s, 4.6, '#dbe4ee'); prop(6 + 14 * s, -h + 2, 13 * s); }
  if (ac.kind === 'jet') { ctx.fillStyle = '#dbe4ee'; ctx.fillRect(-L + 16, -h - 5, 18 * s, 6.5); ctx.fillStyle = dark; ctx.fillRect(-L + 16 + 18 * s - 3, -h - 5, 3, 6.5); }
  if (ac.kind === 'airliner') { ctx.fillStyle = '#dbe4ee'; ctx.fillRect(-4, h, 19 * s, 7.5); ctx.fillStyle = dark; ctx.fillRect(-4 + 19 * s - 3, h, 3, 7.5); }
}
