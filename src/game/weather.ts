// Weather and light for the flight scene. Purely visual: nothing here changes the simulation, so a mission flies the same
// in rain, at night or in clear air. Every effect is cheap (a few dozen primitives), deterministic, and respects reduced motion.
import type { EnvId } from '../types';

/** Environments that are dim enough that runway lights and aircraft lights are drawn. */
export const isLowLight = (env: EnvId): boolean => env === 'night' || env === 'rain' || env === 'overcast' || env === 'sunset';
export const isNight = (env: EnvId): boolean => env === 'night';

export const cloudColor = (env: EnvId): string => {
  switch (env) {
    case 'sunset': return 'rgba(255,214,190,0.55)';
    case 'golden': return 'rgba(255,226,170,0.7)';
    case 'night': return 'rgba(120,134,190,0.35)';
    case 'overcast': case 'rain': return 'rgba(214,222,232,0.92)';
    default: return 'rgba(255,255,255,0.8)';
  }
};

/** What each new environment is for, shown in the briefing. */
export const ENV_NOTES: Partial<Record<EnvId, string>> = {
  overcast: 'Low grey cloud and flat light. The rings and gates keep their colours and outlines.',
  rain: 'Rain on a grey sky. A visual effect only: the aircraft handles the same as in clear air.',
  night: 'Night flying with stars, runway lights and aircraft lights. Rings glow so they stay easy to see.',
  golden: 'Low golden sun. Warm light and long shadows, with the same handling as any clear day.',
  arctic: 'Cold, bright snow and ice with a pale sky. Visual only.',
};

/** Stars and moon glow, drawn on top of the sky gradient and below the clouds. */
export function drawSkyExtras(ctx: CanvasRenderingContext2D, env: EnvId, w: number, groundY: number, t: number, still: boolean, lite = false): void {
  if (env === 'night') {
    ctx.save();
    for (let i = 0; i < (lite ? 25 : 60); i++) {
      const x = (i * 157) % w; const y = (i * 89) % (groundY - 120) + 6;
      const tw = still ? 0.8 : 0.55 + 0.45 * Math.sin(t * 1.5 + i);
      ctx.globalAlpha = tw; ctx.fillStyle = '#ffffff'; ctx.fillRect(x, y, i % 7 === 0 ? 2.4 : 1.6, i % 7 === 0 ? 2.4 : 1.6);
    }
    ctx.restore();
  } else if (env === 'golden') {
    const g = ctx.createRadialGradient(Math.min(780, w - 110), 120, 10, Math.min(780, w - 110), 120, 360);
    g.addColorStop(0, 'rgba(255,214,120,0.55)'); g.addColorStop(1, 'rgba(255,214,120,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, groundY);
  } else if (env === 'overcast' || env === 'rain') {
    ctx.fillStyle = env === 'rain' ? 'rgba(70,84,104,0.30)' : 'rgba(90,104,122,0.16)'; ctx.fillRect(0, 0, w, groundY);
    ctx.fillStyle = 'rgba(190,200,214,0.55)';
    for (let i = 0; i < 9; i++) { const x = (i * 150 - ((t * 8) % 150) * (still ? 0 : 1)) - 40; ctx.beginPath(); ctx.ellipse(x, 40 + (i % 3) * 22, 110, 26, 0, 0, 6.3); ctx.fill(); }
  }
}

/** Rain streaks in front of the scenery and behind the aircraft. 70 short lines; a few still marks with reduced motion. */
export function drawRain(ctx: CanvasRenderingContext2D, env: EnvId, w: number, groundY: number, t: number, still: boolean, lite = false): void {
  if (env !== 'rain') return;
  ctx.save();
  ctx.strokeStyle = 'rgba(210,224,240,0.55)'; ctx.lineWidth = 1.3;
  const n = still ? 14 : lite ? 30 : 70;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const sp = 520 + (i % 5) * 60;
    const x = ((i * 131 - t * 120 * (still ? 0 : 1)) % (w + 60) + w + 60) % (w + 60) - 30;
    const y = ((i * 71 + t * sp * (still ? 0 : 1)) % (groundY + 40));
    ctx.moveTo(x, y); ctx.lineTo(x - 5, y + 16);
  }
  ctx.stroke();
  ctx.restore();
}

/** Lights along a runway segment in low light. */
export function drawRunwayLights(ctx: CanvasRenderingContext2D, sx: number, ex: number, groundTop: number, t: number, still: boolean): void {
  ctx.save();
  for (let x = sx + 6; x < ex - 4; x += 46) {
    const on = still || Math.floor(t * 2 + x / 46) % 4 !== 0 ? 1 : 0.55;
    ctx.globalAlpha = 0.28 * on; ctx.fillStyle = '#ffe9a8'; ctx.beginPath(); ctx.arc(x, groundTop + 4, 7, 0, 6.3); ctx.fill();
    ctx.globalAlpha = 0.95; ctx.fillStyle = '#fff6d0'; ctx.fillRect(x - 1.5, groundTop + 2, 3, 3);
  }
  ctx.restore();
}

/** A fading trail behind the aircraft (contrail at speed, exhaust glow at night). `pts` holds world x and y. */
export function drawTrail(ctx: CanvasRenderingContext2D, pts: { x: number; y: number; age: number }[], cam: number, night: boolean): void {
  ctx.save();
  for (const p of pts) {
    const a = Math.max(0, 1 - p.age / 1.4);
    ctx.globalAlpha = a * (night ? 0.5 : 0.4); ctx.fillStyle = night ? '#ffc680' : '#ffffff';
    ctx.beginPath(); ctx.arc(p.x - cam, p.y, 2.5 + p.age * 3, 0, 6.3); ctx.fill();
  }
  ctx.restore();
}
