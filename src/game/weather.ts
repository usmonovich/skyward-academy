// Weather and light for the flight scene. Purely visual: nothing here changes the simulation, so a mission flies the same
// in rain, at night or in clear air. Every effect is cheap (a few dozen primitives), deterministic, and respects reduced motion.
import type { EnvId, WeatherDef } from '../types';

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

/** Short weather line for the preflight briefing. */
export const WEATHER_NAME: Record<EnvId, string> = {
  sky: 'Clear skies', countryside: 'Clear, light wind', mountains: 'Mountain air', coast: 'Sea breeze', desert: 'Hot, rising air',
  sunset: 'Clear, low sun', airfield: 'Clear, light wind', highalt: 'High altitude, cold', overcast: 'Overcast', rain: 'Rain',
  night: 'Night, clear', golden: 'Golden hour', arctic: 'Cold, snow cover',
};

/* ================================================================== weather layers (Batch 4) */
// These draw the WeatherDef effects. Particle counts are fixed per intensity (no allocation per frame), halved in lite
// quality, and frozen to a few still marks with reduced motion.

const RAIN_COUNT = { light: 50, moderate: 110, heavy: 200 } as const;

/** Rain in three depth layers (far, mid, near): longer, brighter and faster streaks in front. Snow drifts in three depths. */
export function drawPrecip(ctx: CanvasRenderingContext2D, w: WeatherDef | undefined, wd: number, groundY: number, t: number, still: boolean, lite: boolean): void {
  if (!w?.rain && !w?.snow) return;
  ctx.save();
  if (w.rain) {
    const total = still ? 18 : Math.round(RAIN_COUNT[w.rain] * (lite ? 0.45 : 1));
    const layers = [{ k: 0.45, len: 9, a: 0.28, lw: 1 }, { k: 0.75, len: 14, a: 0.42, lw: 1.2 }, { k: 1, len: w.rain === 'heavy' ? 24 : 18, a: 0.6, lw: 1.5 }];
    layers.forEach((L, li) => {
      ctx.strokeStyle = `rgba(214,226,242,${L.a})`; ctx.lineWidth = L.lw; ctx.beginPath();
      const n = Math.floor(total / 3);
      for (let i = 0; i < n; i++) {
        const sp = (560 + (i % 5) * 70) * L.k; const slant = (w.rain === 'heavy' ? 9 : 5) * L.k;
        const x = ((i * 131 + li * 47 - t * 140 * L.k * (still ? 0 : 1)) % (wd + 60) + wd + 60) % (wd + 60) - 30;
        const y = ((i * 71 + li * 29 + t * sp * (still ? 0 : 1)) % (groundY + 40));
        ctx.moveTo(x, y); ctx.lineTo(x - slant, y + L.len);
      }
      ctx.stroke();
    });
  }
  if (w.snow) {
    const n = still ? 20 : lite ? 45 : 100;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (let i = 0; i < n; i++) {
      const depth = 0.5 + (i % 3) * 0.25;
      const x = ((i * 97 - t * 50 * depth * (still ? 0 : 1) + Math.sin(t * 1.3 + i) * 12 * (still ? 0 : 1)) % (wd + 20) + wd + 20) % (wd + 20) - 10;
      const y = ((i * 53 + t * 60 * depth * (still ? 0 : 1)) % (groundY + 20));
      ctx.beginPath(); ctx.arc(x, y, 1.2 + depth * 1.4, 0, 6.3); ctx.fill();
    }
  }
  ctx.restore();
}

/** Storm light: a dark cloud base along the top and dimmer, cooler light over the whole scene. */
export function drawStormSky(ctx: CanvasRenderingContext2D, wd: number, groundY: number, t: number, still: boolean, cam: number): void {
  ctx.save();
  ctx.fillStyle = 'rgba(28,38,56,0.32)'; ctx.fillRect(0, 0, wd, groundY + 80);
  const base = ['rgba(52,62,80,0.95)', 'rgba(70,80,98,0.9)', 'rgba(40,48,64,0.95)'];
  for (let layer = 0; layer < 3; layer++) {
    ctx.fillStyle = base[layer];
    const par = 0.08 + layer * 0.06; const y0 = 8 + layer * 18;
    const shift = (cam * par + (still ? 0 : t * 4)) % 170;
    for (let i = -1; i < Math.ceil(wd / 170) + 2; i++) {
      const x = i * 170 + layer * 60 - shift;
      ctx.beginPath(); ctx.ellipse(x, y0 + (Math.abs(i) % 2) * 10, 120 - layer * 10, 34 + (Math.abs(i) % 3) * 6, 0, 0, 6.3); ctx.fill();
    }
  }
  ctx.restore();
}

/** Reduced visibility: haze that thickens with distance ahead of the aircraft. */
export function drawFog(ctx: CanvasRenderingContext2D, amount: number, wd: number, top: number, h: number, planeX: number): void {
  if (amount <= 0) return;
  const g = ctx.createLinearGradient(planeX + 40, 0, wd, 0);
  g.addColorStop(0, `rgba(206,214,224,${0.12 * amount})`);
  g.addColorStop(0.45, `rgba(206,214,224,${0.75 * amount})`);
  g.addColorStop(1, `rgba(214,220,230,${Math.min(0.96, 1.15 * amount)})`);
  ctx.fillStyle = g; ctx.fillRect(0, top, wd, h);
}

/** Deterministic lightning: about one strike every 7.5 s. Returns the flash strength now (0..1), a seed for the bolt shape and the strike time. */
export function lightningAt(t: number, seed: number): { flash: number; bolt: number; struck: number } {
  const period = 7.5;
  const k = Math.floor(t / period);
  const r = (n: number) => { const x = Math.sin((k + 1) * 12.9898 + seed * 78.233 + n * 37.719) * 43758.5453; return x - Math.floor(x); };
  const at = k * period + 1.5 + r(1) * 4.5;
  const d = t - at;
  // A double pulse, 0.25 s in all.
  const flash = d < 0 || d > 0.25 ? 0 : d < 0.06 ? 1 : d < 0.11 ? 0.25 : d < 0.17 ? 0.8 : 1 - (d - 0.17) / 0.08;
  return { flash: Math.max(0, flash), bolt: k * 7 + seed, struck: at };
}

/** The lightning bolt in the clouds and, unless flashes are reduced, a brief brightening of the scene. */
export function drawLightning(ctx: CanvasRenderingContext2D, flash: number, bolt: number, wd: number, groundY: number, reduceFlash: boolean): void {
  if (flash <= 0) return;
  ctx.save();
  if (!reduceFlash) { ctx.fillStyle = `rgba(235,240,255,${0.32 * flash})`; ctx.fillRect(0, 0, wd, groundY + 80); }
  const r = (n: number) => { const x = Math.sin(bolt * 3.1 + n * 7.7) * 9871.13; return x - Math.floor(x); };
  let x = 120 + r(0) * (wd - 240); let y = 40;
  ctx.strokeStyle = `rgba(255,250,210,${reduceFlash ? 0.55 : 0.95 * flash})`; ctx.lineWidth = reduceFlash ? 2 : 3; ctx.shadowColor = '#fff7c0'; ctx.shadowBlur = reduceFlash ? 0 : 12;
  ctx.beginPath(); ctx.moveTo(x, y);
  while (y < groundY - 10) { x += (r(y) - 0.5) * 46; y += 24 + r(y + 1) * 26; ctx.lineTo(x, Math.min(y, groundY - 10)); }
  ctx.stroke();
  ctx.restore();
}

/**
 * Arcade tornado: a rotating funnel from the cloud base to the ground with debris at its base, drawn at screen x.
 * `near` (0..1) is how close it is beside the track: farther away it is smaller and hazier. A clearly marked danger area
 * surrounds the base. This is a game approximation of a hazard to stay away from, not a model of a real tornado.
 */
export function drawTornado(ctx: CanvasRenderingContext2D, sx: number, groundY: number, top: number, t: number, near: number, still: boolean): void {
  const s = 0.55 + near * 0.6; const alpha = 0.55 + near * 0.4; const spin = still ? 0 : t;
  const top0 = top + 26; const N = 24;
  const edge = (f: number) => ({ y: top0 + f * (groundY - top0), half: (80 - 68 * Math.pow(f, 0.6)) * s, sway: Math.sin(f * 3 + spin * 0.8) * 18 * s * f });
  ctx.save();
  ctx.globalAlpha = alpha;
  // Dust cloud at the base, behind the funnel
  const dust = ctx.createRadialGradient(sx, groundY - 8, 4, sx, groundY - 8, 150 * s);
  dust.addColorStop(0, 'rgba(126,104,82,0.6)'); dust.addColorStop(1, 'rgba(126,104,82,0)');
  ctx.fillStyle = dust; ctx.beginPath(); ctx.ellipse(sx, groundY - 8, 150 * s, 46 * s, 0, 0, 6.3); ctx.fill();
  // The funnel as one smooth shape, shaded like a rotating column
  ctx.beginPath();
  for (let i = 0; i <= N; i++) { const e = edge(i / N); if (i === 0) ctx.moveTo(sx + e.sway - e.half, e.y); else ctx.lineTo(sx + e.sway - e.half, e.y); }
  for (let i = N; i >= 0; i--) { const e = edge(i / N); ctx.lineTo(sx + e.sway + e.half, e.y); }
  ctx.closePath();
  const shade = ctx.createLinearGradient(sx - 85 * s, 0, sx + 85 * s, 0);
  shade.addColorStop(0, 'rgba(58,64,78,0.95)'); shade.addColorStop(0.45, 'rgba(150,156,170,0.9)'); shade.addColorStop(1, 'rgba(52,58,72,0.95)');
  ctx.fillStyle = shade; ctx.fill();
  // Rotating bands that travel down the funnel
  ctx.strokeStyle = 'rgba(232,236,242,0.38)'; ctx.lineWidth = 2;
  for (let k = 0; k < 10; k++) {
    const f = ((k / 10) + spin * 0.12) % 1; const e = edge(f);
    ctx.beginPath(); ctx.moveTo(sx + e.sway - e.half, e.y); ctx.quadraticCurveTo(sx + e.sway, e.y + 7 * s, sx + e.sway + e.half, e.y - 5 * s); ctx.stroke();
  }
  // Wall cloud
  ctx.fillStyle = 'rgba(40,46,60,0.97)';
  ctx.beginPath(); ctx.ellipse(sx, top + 14, 170 * s, 30 * s, 0, 0, 6.3); ctx.ellipse(sx - 90 * s, top + 4, 90 * s, 26 * s, 0, 0, 6.3); ctx.ellipse(sx + 100 * s, top + 6, 100 * s, 24 * s, 0, 0, 6.3); ctx.fill();
  // Debris orbiting the base
  ctx.fillStyle = 'rgba(70,56,42,0.9)';
  for (let i = 0; i < 16; i++) {
    const a = spin * 5 + i * 0.4; const rr = (16 + (i % 4) * 11) * s;
    ctx.fillRect(sx + Math.cos(a) * rr * 1.9, groundY - 10 - (i % 5) * 10 * s + Math.sin(a) * 7, 3 + (i % 3), 2 + (i % 2));
  }
  ctx.globalAlpha = 1;
  // Danger area
  ctx.setLineDash([8, 8]); ctx.strokeStyle = 'rgba(239,68,68,0.95)'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.ellipse(sx, groundY - 6, 125 * s, 17 * s, 0, 0, 6.3); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
}

/** Plain-language notes on each kind of weather, for the briefing. */
export const WEATHER_NOTES = {
  storm: 'Thunderstorms: pilots keep well clear of them, by many miles, and never fly under or through one. Real avoidance uses weather radar, reports and ATC.',
  tornado: 'Tornadoes come from severe thunderstorms and are extremely dangerous. The safe action is to recognise the warning early and divert well away. This funnel is an arcade approximation.',
  fog: 'Fog and low visibility: if the visibility is below what your approach needs, you do not continue. You hold or divert.',
  turbulence: 'Turbulence: keep the wings level, make small, smooth corrections and do not chase every bump.',
  rain: 'Heavy rain reduces visibility through the windscreen and can hide other weather.',
  snow: "Snow and visible moisture below freezing can mean icing. Leave icing conditions early and use the aircraft's ice protection as its manual says.",
} as const;

/** What the weather does in this mission, split into what changes the flight and what is only visual. */
export function weatherEffects(w: WeatherDef | undefined): { handling: string[]; visual: string[] } {
  const handling: string[] = []; const visual: string[] = [];
  if (!w) return { handling, visual };
  if (w.turbulence) handling.push('turbulence');
  if (w.tornado) handling.push('tornado avoidance');
  if (w.fog) handling.push(w.fog >= 0.5 ? 'low visibility: hazards show late' : 'haze: hazards show late');
  if (w.rain) visual.push(`${w.rain} rain`);
  if (w.snow) visual.push('snow');
  if (w.storm) visual.push('storm cloud');
  if (w.lightning) visual.push('lightning');
  return { handling, visual };
}
