// Reusable 2D mission engine. A mission is plain data (MissionDef); this module turns it into a
// playable side-scrolling flight with gates, obstacles, wind, terrain, fuel, take-off and landing. The flight is never
// interrupted by questions: decisions and radio calls belong to the lessons, not to the flying.
// The physics are deliberately simplified arcade physics — this is not a flight training device.
import type { EnvId, GameAircraft, MissionDef, MissionResult, MissionStats, ObstacleType } from '../types';
import { mulberry32 } from '../engine/assessment';
import { scoreMission } from '../engine/gamification';
import { isaPressure } from '../content/formulas';
import { audio } from '../engine/audio';
import { drawAircraft } from './art';
import { cloudColor, drawFog, drawLightning, drawPrecip, drawRain, drawRunwayLights, drawSkyExtras, drawStormSky, drawTornado, drawTrail, isLowLight, isNight, lightningAt } from './weather';
import { drawAirport, drawCloudLayer, drawForest, drawSeaGlints, drawShadow, drawSnowCaps, type Edge } from './scenery';
import { AIM, PHASES, approachStart, glideY, phaseAt, phasePlan, slopeLights, touchdownZone, type PhaseId } from './phases';

export const W = 960;
export const H = 540;
export const GROUND = 470;
export const CEIL = 46;
export const PLANE_X = 220;
const TAKEOFF_RUNWAY = 1300;

/**
 * Ring kinds. Each has its own colour, outline pattern and a glyph, so no kind is told apart by colour alone.
 * The drawn opening of every ring is exactly its scoring radius r.
 */
export type RingKind = 'cloud' | 'gold' | 'precision' | 'nav' | 'special';
export interface RingStyle { name: string; color: string; dash: number[]; glyph: 'none' | 'star' | 'ticks' | 'chevron' | 'diamond'; blurb: string }
export const RING_STYLE: Record<RingKind, RingStyle> = {
  cloud: { name: 'Cloud ring', color: '#3a8dde', dash: [], glyph: 'none', blurb: 'A normal checkpoint. Fly through the opening.' },
  gold: { name: 'Golden ring', color: '#f2b705', dash: [], glyph: 'star', blurb: 'A bonus ring: extra points when you fly through it.' },
  precision: { name: 'Precision ring', color: '#f58220', dash: [], glyph: 'ticks', blurb: 'A smaller ring for accurate flying: a bigger bonus.' },
  nav: { name: 'Navigation ring', color: '#12a594', dash: [8, 5], glyph: 'chevron', blurb: 'A waypoint on your route: cross it on the planned track.' },
  special: { name: 'Special ring', color: '#e0457b', dash: [10, 4, 2, 4], glyph: 'diamond', blurb: 'A feature ring for advanced missions: a large bonus.' },
};
export interface Gate { x: number; y: number; r: number; state: 'open' | 'hit' | 'missed'; kind: RingKind; /** Bonus points for flying through it. */ value: number }
export interface Obstacle { x: number; y: number; r: number; type: ObstacleType; phase: number; h: number }
/**
 * Arcade boosters. These are game mechanics, not aviation capabilities: no real aircraft has a shield or can slow
 * time. Durations are in seconds of real time (paused time never counts); a cooldown stops the same booster being
 * activated again straight away. At most two boosters are active at once and the inventory holds three.
 */
export type BoosterKind = 'shield' | 'slow' | 'multiplier' | 'magnet' | 'speed' | 'assist' | 'xp' | 'recovery';
export interface BoosterInfo { name: string; short: string; color: string; duration: number; cooldown: number; blurb: string }
export const BOOSTERS: Record<BoosterKind, BoosterInfo> = {
  shield: { name: 'Shield', short: 'S', color: '#2bb3d9', duration: 15, cooldown: 8, blurb: 'Absorbs the next minor contact with a balloon, birds or a tower. Not storms, and not the ground.' },
  slow: { name: 'Time slow', short: '\u23F1', color: '#5b7cfa', duration: 8, cooldown: 10, blurb: 'Slows the game to 60 percent so you have more time to react.' },
  multiplier: { name: 'Score x2', short: 'x2', color: '#f2b705', duration: 12, cooldown: 8, blurb: 'Doubles the bonus points from rings while it lasts. It does not change your stars.' },
  magnet: { name: 'Ring magnet', short: 'M', color: '#e0457b', duration: 12, cooldown: 8, blurb: 'Widens golden rings and booster pickups. It never helps with compulsory rings.' },
  speed: { name: 'Speed boost', short: '\u00BB', color: '#f58220', duration: 6, cooldown: 12, blurb: 'A burst of speed. The trade-off: steering is harder while it lasts.' },
  assist: { name: 'Precision assist', short: '\u25CE', color: '#12a594', duration: 10, cooldown: 10, blurb: 'A guide line to the next ring and gentle steering help. You still fly the aircraft.' },
  xp: { name: 'Bonus XP token', short: 'XP', color: '#7a5af5', duration: 0, cooldown: 0, blurb: 'Collected instantly: a small bonus of XP when you complete the mission.' },
  recovery: { name: 'Recovery', short: '+', color: '#3aa655', duration: 0, cooldown: 20, blurb: 'Brings back one contact light after a minor mistake.' },
};
export interface Pickup { x: number; y: number; kind: BoosterKind; taken: boolean }
export interface Level { gates: Gate[]; obstacles: Obstacle[]; pickups: Pickup[]; runwayStart: number; runwayEnd: number }
export const MAX_ACTIVE = 2;
export const MAX_HELD = 3;
/** What the booster bar shows. */
export interface BoosterView {
  held: BoosterKind[];
  active: { kind: BoosterKind; left: number; total: number }[];
  cooldown: Partial<Record<BoosterKind, number>>;
  xpTokens: number;
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** Terrain height in pixels above the base ground line at world position x. */
export function terrainHeight(def: MissionDef, x: number): number {
  const k = def.terrain ?? 0;
  if (!k) return 0;
  const rampIn = clamp((x - 900) / 500, 0, 1);
  const rampOut = clamp((def.length - 1500 - x) / 500, 0, 1);
  const shape = 0.75 * (0.5 + 0.5 * Math.sin(x / 420 + def.seed)) + 0.25 * (0.5 + 0.5 * Math.sin(x / 150 + def.seed * 2));
  return k * 230 * shape * rampIn * rampOut;
}

/** Deterministic level generation from the mission seed. */
/**
 * Gives the rings their kinds from a separate random stream, so adding kinds never moves a ring or a hazard.
 * Navigation rings for route missions; every fourth ring is golden; Intermediate and harder missions add smaller
 * precision rings; the last ring of an Advanced or Expert flight is a larger special ring.
 */
function assignRings(def: MissionDef, gates: Gate[]) {
  const rnd = mulberry32(def.seed * 104729 + 7);
  const n = gates.length;
  gates.forEach((g, i) => {
    rnd();
    if (def.lateral?.waypoints) { g.kind = 'nav'; g.value = 20; return; }
    const last = i === n - 1;
    if (last && !def.landing && (def.tier === 'Advanced' || def.tier === 'Expert')) { g.kind = 'special'; g.r = 56; g.value = 100; }
    else if ((i + 1) % 4 === 0 && !last) { g.kind = 'gold'; g.value = 50; }
    else if (def.tier !== 'Beginner' && i % 5 === 2 && !last) { g.kind = 'precision'; g.r = 36; g.value = 30; }
    g.y = Math.max(g.y, CEIL + g.r + 6);
  });
}

/** Rings needed to complete a flight: 65 percent, or 50 percent in assisted mode. */
export const needRings = (total: number, assisted: boolean): number => Math.ceil(total * (assisted ? 0.5 : 0.65));

/**
 * Keeps the ring heights from forming a straight line. Whatever single height an aircraft holds, it must not be able to collect more
 * than 45 percent of the rings: while some height does, one ring in the biggest cluster is moved clear of it by a varied amount.
 * Deterministic, and it never touches the random stream, so obstacles and boosters keep their places.
 */
function spreadGates(def: MissionDef, gates: Gate[]): void {
  // Drifting-storm routes keep their designed ring heights: the deviation geometry is the point of those missions.
  if (def.lateral || def.stormDrift || gates.length < 4) return;
  const key = `${def.id}:${def.seed}:${gates.length}:${def.length}`;
  const cached = SPREAD_CACHE.get(key);
  if (cached) { gates.forEach((g, i) => { g.y = cached[i]; }); return; }
  const limit = Math.floor(gates.length * 0.45);
  const movable = (i: number) => !(def.landing && i >= gates.length - 5);
  // counts[k] is how many rings a flight held at height 95 + 5k would collect (a ring is collected within 56 px).
  const SLOTS = 62; const W = 12;
  const counts = new Array<number>(SLOTS).fill(0);
  const touch = (y: number, d: number) => { const c = Math.round((y - 95) / 5); for (let k = Math.max(0, c - W); k <= Math.min(SLOTS - 1, c + W); k++) counts[k] += d; };
  gates.forEach((g) => touch(g.y, 1));
  // The potential (sum of squared counts) falls as the rings spread out, which avoids plateaus where the biggest cluster cannot be lowered by one move.
  const delta = (from: number, to: number) => {
    const cf = Math.round((from - 95) / 5); const ct = Math.round((to - 95) / 5); let d = 0;
    for (let k = Math.max(0, Math.min(cf, ct) - W); k <= Math.min(SLOTS - 1, Math.max(cf, ct) + W); k++) {
      const inF = Math.abs(k - cf) <= W ? 1 : 0; const inT = Math.abs(k - ct) <= W ? 1 : 0;
      const n = counts[k] - inF + inT; d += n * n - counts[k] * counts[k];
    }
    return d;
  };
  for (let guard = 0; guard < 60; guard++) {
    if (Math.max(...counts) <= limit) break;
    let pick: { i: number; y: number; score: number } | null = null;
    gates.forEach((g, i) => {
      if (!movable(i)) return;
      const maxY = Math.min(400, GROUND - terrainHeight(def, g.x) - 95);
      for (let y = 95; y <= maxY; y += 6) {
        if (Math.abs(y - g.y) < 20) continue;
        // Keep the route flyable: no ring more than 150 px above or below its neighbours.
        if ((i > 0 && Math.abs(y - gates[i - 1].y) > 150) || (i < gates.length - 1 && Math.abs(y - gates[i + 1].y) > 150)) continue;
        const score = delta(g.y, y) + Math.abs(y - g.y) / 12;
        if (!pick || score < pick.score) pick = { i, y, score };
      }
    });
    const chosen = pick as { i: number; y: number; score: number } | null;
    if (!chosen || chosen.score >= 0) break;
    touch(gates[chosen.i].y, -1); gates[chosen.i].y = chosen.y; touch(chosen.y, 1);
  }
  SPREAD_CACHE.set(key, gates.map((g) => g.y));
}
const SPREAD_CACHE = new Map<string, number[]>();

export function buildLevel(def: MissionDef): Level {
  const rnd = mulberry32(def.seed * 7919);
  const x0 = def.takeoff ? 1700 : 900;
  const x1 = def.length - (def.landing ? 1500 : 500);
  const gates: Gate[] = [];
  let y = 250;
  for (let i = 0; i < def.checkpoints; i++) {
    const x = x0 + ((i + 0.5) * (x1 - x0)) / def.checkpoints;
    const maxY = Math.min(400, GROUND - terrainHeight(def, x) - 95);
    y = clamp(y + (rnd() - 0.5) * 240, 95, maxY);
    gates.push({ x, y, r: 48, state: 'open', kind: 'cloud', value: 10 });
  }
  spreadGates(def, gates);
  // Approach: the last two rings sit on the glide path, so the final rings teach the descent to the runway.
  // Missions with a blocked runway (go-around) and crosswind routes keep their designed rings.
  if (def.landing && !def.goAround && !def.lateral && gates.length >= 4) {
    const before = gates.map((g) => g.y);
    for (const g of gates) if (g.x >= approachStart(def)) g.y = clamp(glideY(def, g.x, GROUND - 14), 95, Math.min(400, GROUND - terrainHeight(def, g.x) - 95));
    // Never at the price of a flat route: if one height would now hold 60 percent of the rings, keep the designed heights.
    let most = 0; for (let h = 95; h <= 400; h += 5) most = Math.max(most, gates.filter((g) => Math.abs(g.y - h) <= 56).length);
    if (most / gates.length >= 0.6) gates.forEach((g, i) => { g.y = before[i]; });
  }
  assignRings(def, gates);
  const obstacles: Obstacle[] = [];
  const want = Math.round((def.obstacles.density * (x1 - x0)) / 400);
  for (let tries = 0; obstacles.length < want && tries < want * 8; tries++) {
    const type = def.obstacles.types[Math.floor(rnd() * def.obstacles.types.length)];
    // The first part of the route is the easy introduction: no hazards before 12 percent of the way.
    const x = x0 + (0.12 + rnd() * 0.88) * (x1 - x0);
    const floor = GROUND - terrainHeight(def, x);
    const r = type === 'storm' ? 46 : type === 'balloon' ? 26 : type === 'birds' ? 20 : 16;
    const h = type === 'tower' ? 90 + rnd() * 70 : 0;
    const oy = type === 'tower' ? floor - h : clamp(80 + rnd() * 320, 80, floor - 80);
    if (gates.some((g) => Math.abs(g.x - x) < 260 && Math.abs(g.y - oy) < 150)) continue;
    if (obstacles.some((o) => Math.abs(o.x - x) < 230)) continue;
    // No clusters: at most two hazards within 700 px of each other, so every stretch of the route leaves a clear way through.
    if (obstacles.filter((o) => Math.abs(o.x - x) < 700).length >= 2) continue;
    obstacles.push({ x, y: oy, r, type, phase: rnd() * 6.28, h });
  }
  return { gates, obstacles, pickups: placePickups(def, gates, obstacles, x0, x1), runwayStart: def.length - 1150, runwayEnd: def.length - 150 };
}

/** Booster pickups, spread along the route from their own random stream so they never move a ring or a hazard. */
function placePickups(def: MissionDef, gates: Gate[], obstacles: Obstacle[], x0: number, x1: number): Pickup[] {
  const rnd = mulberry32(def.seed * 15485863 + 11);
  const n = clamp(Math.round((x1 - x0) / 7500), 2, 8);
  const bag: BoosterKind[] = ['shield', 'shield', 'shield', 'xp', 'xp', 'xp', 'slow', 'slow', 'multiplier', 'multiplier', 'magnet', 'magnet', 'speed', 'assist', 'assist', 'recovery'];
  const out: Pickup[] = [];
  for (let i = 0; i < n; i++) {
    let x = x0 + ((i + 0.5) / n) * (x1 - x0) + (rnd() - 0.5) * 500;
    for (let k = 0; k < 6 && (gates.some((g) => Math.abs(g.x - x) < 260) || obstacles.some((o) => Math.abs(o.x - x) < 230)); k++) x += 140;
    const floor = GROUND - terrainHeight(def, x);
    out.push({ x, y: clamp(120 + rnd() * 260, 110, floor - 110), kind: bag[Math.floor(rnd() * bag.length)], taken: false });
  }
  return out;
}

export interface GameCallbacks {
  onMessage: (text: string) => void;
  /** Called when the booster bar changes, and about four times a second while a booster runs. */
  onBoosters?: (v: BoosterView) => void;
  onEnd: (r: MissionResult) => void;
  /** Called when the flight moves into a new phase (take-off, climb, cruise, approach, landing, complete). */
  onPhase?: (p: PhaseId) => void;
}
export interface GameOptions { assisted: boolean; livery: string; reducedMotion: boolean; /** Scripted tests: skip drawing. */ noRender?: boolean; /** Boosters held at the start (tests and practice). */ startBoosters?: BoosterKind[]; /** Steering sensitivity multiplier (default 1). */ steer?: number; /** Effects level: auto drops to low when the frame rate stays poor. */ quality?: 'auto' | 'high' | 'low'; /** Drag on the canvas to steer (default true). Off while the touch joystick is shown, so two inputs never fight. */ canvasDrag?: boolean; /** Lightning without full-screen flashes. */ reduceFlashing?: boolean }
/** Screen insets (CSS pixels) such as a phone notch or home indicator, kept clear of the HUD. */
export interface Safe { top: number; right: number; bottom: number; left: number }
export interface GameHandle {
  pause(): void; resume(): void; destroy(): void;
  /** x: thrust, y: pitch, h: heading correction (crosswind and navigation missions). */
  setInput(i: { x?: number; y?: number; h?: number }): void;
  /** Throttle lever position 0..1 that the engine moves towards smoothly; null hands control back to thrust input. */
  setThrottle(v: number | null): void;
  /** The pilot's own go-around during the approach: climb away and fly the approach again (at most twice). */
  goAround(): boolean;
  /** Activates the held booster in slot i. Returns whether it was activated. */
  activateBooster(i: number): boolean;
  boosters(): BoosterView;
  /** Test hook: advances the simulation by one fixed time step and redraws (used when animation frames are throttled). */
  step(dt: number): void;
  /** Debug/test hook: read-only snapshot of the simulation. */
  /** Fits the camera to the canvas's CSS size and the screen insets. Called on every size or orientation change. */
  resize(cssWidth: number, cssHeight: number, safe?: Safe): void;
  snapshot(): { worldX: number; y: number; kt: number; state: string; hits: number; gates: number; onGround: boolean; lat: number; hdg: number; ga: string; strikes: number; bonus: number; thr: number; phase: PhaseId };
}

const PALETTE: Record<EnvId, { top: string; bottom: string; far: string; mid: string; ground: string; sun: string }> = {
  sky: { top: '#2f8fe3', bottom: '#cfeaff', far: '#a9d2ee', mid: '#7fbf86', ground: '#5a9c4f', sun: '#fff3c4' },
  countryside: { top: '#4aa3e8', bottom: '#dbf0ff', far: '#a6d0ae', mid: '#74b56d', ground: '#5c9e4c', sun: '#fff3c4' },
  airfield: { top: '#3f97e2', bottom: '#d7eeff', far: '#a9cbb6', mid: '#78b477', ground: '#63a153', sun: '#fff3c4' },
  mountains: { top: '#3f86d6', bottom: '#d3e8fb', far: '#a3b4ca', mid: '#74869f', ground: '#587a4a', sun: '#ffffff' },
  coast: { top: '#33a0e6', bottom: '#dcf5ff', far: '#8fd0e0', mid: '#2f8dbd', ground: '#e3d09c', sun: '#fff3c4' },
  desert: { top: '#f0a052', bottom: '#fde6b6', far: '#e3aa6e', mid: '#cb8a45', ground: '#d7a25c', sun: '#fff8dc' },
  sunset: { top: '#3b2d6b', bottom: '#ff9d5c', far: '#8a5486', mid: '#553868', ground: '#3d2c52', sun: '#ffd27a' },
  highalt: { top: '#0d2a5c', bottom: '#79b8ee', far: '#cfe2f5', mid: '#e8f2fb', ground: '#f7fbff', sun: '#ffffff' },
  overcast: { top: '#7f8fa3', bottom: '#d3dae3', far: '#9fb0a6', mid: '#7c9a82', ground: '#5f8650', sun: '#eef2f7' },
  rain: { top: '#4b5a6e', bottom: '#aab6c4', far: '#7f9186', mid: '#5f7a67', ground: '#4a6b44', sun: '#cfd8e3' },
  night: { top: '#050b1f', bottom: '#233a6b', far: '#1b2a4a', mid: '#16233d', ground: '#0f1a2e', sun: '#e9eefc' },
  golden: { top: '#e08a3c', bottom: '#ffe0a0', far: '#c98a5a', mid: '#8f8a52', ground: '#6f8a43', sun: '#fff0b8' },
  arctic: { top: '#6fa8d8', bottom: '#eaf4fb', far: '#cddbe8', mid: '#e1ecf5', ground: '#f3f8fc', sun: '#ffffff' },
};

/**
 * Portrait layout, from the top of the screen: the portrait HUD (PORTRAIT_HUD), the play window, and the thumb
 * controls (PORTRAIT_CTL). The play window shows the world rows Y0..Y1 (the whole flyable height plus a little sky and
 * ground) at one uniform scale, PORTRAIT_VW world pixels wide, with the aircraft near the left edge so most of the
 * width looks ahead. Heights are CSS pixels and must match the DOM controls in styles.css.
 */
export const PORTRAIT_VW = 400;
export const PORTRAIT_PLANE_X = 96;
export const PORTRAIT_HUD = 138;
export const PORTRAIT_CTL = 196;
/** Extra portrait HUD height for the track panel of sideways-wind missions. */
export const TRACK_PANEL = 52;
export const Y0 = 24;
export const Y1 = 506;

export interface View { s: number; VW: number; VH: number; oy: number; camShift: number; portrait: boolean }

/**
 * Camera for a screen of cw x ch CSS pixels. The scale is uniform (nothing is stretched) and the whole flyable height
 * is always visible. Landscape and wide screens see more world ahead (VW); portrait screens use the dedicated layout
 * above. Pure, so it can be tested for any size. `safe` are the notch and home-indicator insets in CSS pixels.
 */
export function computeView(cw: number, ch: number, safe: Safe = { top: 0, right: 0, bottom: 0, left: 0 }, extraHud = 0): View {
  if (cw < ch) {
    const hud = PORTRAIT_HUD + extraHud + safe.top; const ctl = PORTRAIT_CTL + safe.bottom;
    const k = Math.min(cw / PORTRAIT_VW, Math.max(0.3, (ch - hud - ctl) / (Y1 - Y0)));
    const pad = Math.max(0, (ch - hud - ctl - (Y1 - Y0) * k) / 2);
    return { s: k, VW: cw / k, VH: ch / k, oy: (hud + pad) / k - Y0, camShift: PLANE_X - PORTRAIT_PLANE_X, portrait: true };
  }
  const k = Math.min(ch / H, cw / W);
  const VW = cw / k; const VH = ch / k;
  return { s: k, VW, VH, oy: Math.max(0, VH - H) * 0.42, camShift: 0, portrait: false };
}

export function createGame(canvas: HTMLCanvasElement, def: MissionDef, ac: GameAircraft, opts: GameOptions, cb: GameCallbacks): GameHandle {
  const ctx = canvas.getContext('2d')!;
  const dprBase = Math.min(window.devicePixelRatio || 1, 2);
  let dpr = dprBase;
  // Camera. The 960x540 world band is never stretched: wider screens show more of the world ahead, taller screens
  // extend the sky above and the ground below. Only drawing reads these values; the simulation, collisions and
  // scoring work in world units and never see them.
  const view = { s: 1, VW: W, VH: H, oy: 0, camShift: 0, portrait: false, safeL: 0, safeR: 0, safeT: 0, safeB: 0 };
  // Picture quality also sets the canvas resolution: the 'low' level (or auto after slow frames) draws about a third of the pixels.
  let lite = opts.quality === 'low';
  let lastLayout: [number, number, Safe | undefined] = [0, 0, undefined];
  function layout(cw: number, ch: number, safe: Safe = { top: 0, right: 0, bottom: 0, left: 0 }) {
    lastLayout = [cw, ch, safe];
    if (cw > 0 && ch > 0) {
      const v = computeView(cw, ch, safe, def.lateral ? TRACK_PANEL : 0); const k = v.s;
      view.s = k; view.VW = v.VW; view.VH = v.VH; view.oy = v.oy; view.camShift = v.camShift; view.portrait = v.portrait;
      view.safeT = safe.top / k; view.safeR = safe.right / k; view.safeB = safe.bottom / k; view.safeL = safe.left / k;
      dpr = Math.min(lite ? Math.min(dprBase, 1.25) : dprBase, Math.sqrt((lite ? 1.1e6 : 3.4e6) / (cw * ch)));
      canvas.width = Math.max(1, Math.round(cw * dpr)); canvas.height = Math.max(1, Math.round(ch * dpr));
    } else {
      Object.assign(view, { s: 1, VW: W, VH: H, oy: 0, camShift: 0, portrait: false, safeL: 0, safeR: 0, safeT: 0, safeB: 0 });
      dpr = dprBase; canvas.width = W * dpr; canvas.height = H * dpr;
    }
  }
  layout(canvas.clientWidth, canvas.clientHeight);
  const pal = PALETTE[def.env];
  const level = buildLevel(def);
  const range = ac.maxKt - ac.minKt;
  const vr = ac.minKt + range * 0.25;
  const landMax = ac.minKt + range * 0.5;
  const altScale = def.altScale ?? 10;
  const accel = def.env === 'desert' ? 0.3 : 0.5;

  let state: 'run' | 'paused' | 'rollout' | 'ended' = 'run';
  let worldX = 0;
  let onGround = !!def.takeoff;
  let y = onGround ? GROUND - 14 : 260;
  let vy = 0;
  let thr = onGround ? 0 : def.energy ? 0.35 : 0.5;
  let kt = onGround ? 0 : ac.minKt + range * (def.speedBand ? clamp(((def.speedBand.min + def.speedBand.max) / 2 - ac.minKt) / range, 0, 1) : 0.5);
  if (!onGround && def.speedBand) thr = clamp((kt - ac.minKt) / range, 0, 1);
  let t = 0;
  let hits = 0;
  // Contacts counted for the score (hits) and contact lights (strikes). A light comes back after 30 s of clean flying, so a long flight is not ended by early mistakes alone.
  let strikes = 0; let cleanFor = 0;
  let invuln = 0;
  let fuel = 1;
  let bandIn = 0; let bandAll = 0;
  let landing: MissionStats['landing'];
  let nextMessage = 0;
  let stallWarned = 0;
  let raf = 0;
  let last = 0;
  let flash = 0;
  // Sideways track (lateral missions) and go-around state. Both are optional mission features.
  let lat = 0; let hdg = 0; let latIn = 0; let latAll = 0; let errSum = 0; let maxOff = 0; let touchOff: number | undefined;
  let gaState: 'idle' | 'active' = 'idle'; let gaAt = 0; let gaY = 0; let gaClimbed = false; let gaClimbT = 0; let gaLanded = false;
  const trace: number[][] = []; let traceT = 0;
  // Ring bonus and the pass-through effects. Bonus points are shown and rewarded, but never change the star formula.
  let bonus = 0; let ringsHit = 0;
  // Boosters: the held inventory, the active ones with their time left, per-kind cooldowns and the tallies for the debrief.
  const held: BoosterKind[] = [...(opts.startBoosters ?? [])].slice(0, MAX_HELD);
  const active: { kind: BoosterKind; left: number; total: number }[] = [];
  const cooldown: Partial<Record<BoosterKind, number>> = {};
  const used: Partial<Record<BoosterKind, number>> = {};
  let collected = 0; let xpTokens = 0; let absorbed = 0; let emitAcc = 0;
  const ringTally: Partial<Record<RingKind, { hit: number; total: number }>> = {};
  const bursts: { gi: number; x: number; y: number; t0: number; kind: RingKind; text: string }[] = [];
  const trail: { x: number; y: number; age: number }[] = []; let trailT = -1; let visPitch = 0;
  for (const g of level.gates) { const k = (ringTally[g.kind] ??= { hit: 0, total: 0 }); k.total++; }
  const keys = new Set<string>();
  const input = { x: 0, y: 0, h: 0 };
  let touchY: number | null = null;
  let thrTarget: number | null = null;
  // Flight phases: where the approach starts, when the wheels left the ground, approach stability and the pilot's go-arounds.
  const apStart = approachStart(def);
  let airborneAt: number | null = def.takeoff ? null : 0;
  let phase: PhaseId = 'cruise'; const phasesFlown: PhaseId[] = [];
  let apAll = 0; let apStable = 0; let goArounds = 0; let tdZone: 'in' | 'long' | undefined; let fade = 0;
  const smoke: { x: number; t0: number; k: number }[] = [];
  // Weather: the tornado sits beside the route (sideways track model only), lightning and thunder follow a fixed schedule.
  const WX = def.weather;
  const TOR = WX?.tornado && def.lateral ? { ...WX.tornado, x: WX.tornado.at * def.length } : null;
  let torWarned = false; let torMin = Infinity; let tooCloseT = -99; let stormHits = 0; let lastStrike = -1; let thunderAt = -1; let turbSaid = false;
  const fogAmount = WX?.fog ?? (WX?.rain === 'heavy' ? 0.22 : 0);
  const phaseNow = (): PhaseId => phaseAt(def, { wx: worldX + PLANE_X, onGround, airborneAt, rollout: state === 'rollout', ended: state === 'ended', approachFrom: apStart });
  function trackPhase() {
    const p = phaseNow();
    if (p === phase && phasesFlown.length) return;
    phase = p;
    if (phasesFlown[phasesFlown.length - 1] !== p) phasesFlown.push(p);
    cb.onPhase?.(p);
    if (p !== 'cruise' && p !== 'complete' && p !== 'takeoff') say(PHASES[p].cue);
  }
  const messages = [...(def.messages ?? [])].sort((a, b) => a.at - b.at);
  const clouds = Array.from({ length: 9 }, (_, i) => ({ x: (i * 173 + def.seed * 37) % 1500, y: 50 + ((i * 97 + def.seed * 13) % 190), s: 0.6 + ((i * 31) % 10) / 12 }));

  const pxSpeed = () => (kt < ac.minKt ? 140 * (kt / ac.minKt) : 140 + clamp((kt - ac.minKt) / range, 0, 1.1) * 200) * (isActive('speed') ? 1.35 : 1);
  const groundY = (wx: number) => GROUND - terrainHeight(def, wx);
  const say = (text: string) => cb.onMessage(text);
  const isActive = (k: BoosterKind) => active.some((a) => a.kind === k);
  const boosterView = (): BoosterView => ({ held: [...held], active: active.map((a) => ({ ...a })), cooldown: { ...cooldown }, xpTokens });
  const emitBoosters = () => { emitAcc = 0; cb.onBoosters?.(boosterView()); };
  /** Ticks booster timers with real (unslowed) time. Paused time never reaches here because update() does not run. */
  function tickBoosters(dt: number) {
    let changed = false;
    for (let i = active.length - 1; i >= 0; i--) {
      active[i].left -= dt;
      if (active[i].left <= 0) { const k = active[i].kind; active.splice(i, 1); cooldown[k] = BOOSTERS[k].cooldown; changed = true; say(BOOSTERS[k].name + ' has run out.'); }
    }
    for (const k of Object.keys(cooldown) as BoosterKind[]) { cooldown[k]! -= dt; if (cooldown[k]! <= 0) { delete cooldown[k]; changed = true; } }
    emitAcc += dt;
    if (changed || (emitAcc >= 0.25 && (active.length || Object.keys(cooldown).length))) emitBoosters();
  }
  function activate(i: number): boolean {
    if (state !== 'run' && state !== 'rollout') return false;
    const kind = held[i];
    if (!kind) return false;
    if (active.length >= MAX_ACTIVE) { say('Two boosters at a time is the limit. Wait for one to run out.'); return false; }
    if (isActive(kind) || cooldown[kind]) { say(BOOSTERS[kind].name + ' is not ready yet.'); return false; }
    if (kind === 'recovery' && strikes === 0) { say('There is no contact light to bring back.'); return false; }
    held.splice(i, 1);
    used[kind] = (used[kind] ?? 0) + 1;
    audio.sfx('unlock');
    if (kind === 'recovery') { strikes--; cleanFor = 0; flash = 0.25; cooldown.recovery = BOOSTERS.recovery.cooldown; say('Recovery: a contact light is back. (Arcade booster.)'); }
    else { active.push({ kind, left: BOOSTERS[kind].duration, total: BOOSTERS[kind].duration }); say(BOOSTERS[kind].name + ' is on. (Arcade booster, not a real aircraft system.)'); }
    emitBoosters();
    return true;
  }
  /** Radius that counts for a ring right now: the ring magnet widens golden rings only, and the drawing uses the same value. */
  const ringR = (g: Gate) => (g.kind === 'gold' && isActive('magnet') ? g.r * 1.4 : g.r);
  function ringHit(g: Gate, gi: number) {
    const pts = g.value * (isActive('multiplier') ? 2 : 1);
    g.state = 'hit'; bonus += pts; ringsHit++;
    const tally = ringTally[g.kind]; if (tally) tally.hit++;
    audio.sfx(g.kind === 'gold' || g.kind === 'special' ? 'unlock' : 'gate');
    bursts.push({ gi, x: g.x, y: g.y, t0: t, kind: g.kind, text: g.kind === 'cloud' || g.kind === 'nav' ? `${ringsHit}/${level.gates.length}` : `+${pts}` });
    if (bursts.length > 6) bursts.shift();
  }
  /** Height of an obstacle right now: birds flap, and storm cells drift when the mission says so. Used by collisions and drawing alike. */
  const obstacleY = (o: { type: string; y: number; phase: number }) => (o.type === 'birds' ? o.y + Math.sin(t * 2 + o.phase) * 40 : o.type === 'storm' && def.stormDrift ? o.y + Math.sin(t * 0.8 + o.phase) * 60 : o.y);
  /** The sideways position the route asks for at the aircraft's distance: straight on, or a line through the waypoints. */
  const planned = (wx: number): number => {
    const wps = def.lateral?.waypoints;
    if (!wps || !wps.length) return 0;
    let px = 0; let pl = 0;
    for (let i = 0; i < level.gates.length && i < wps.length; i++) {
      const gx = level.gates[i].x;
      if (wx <= gx) return pl + (wps[i].lat - pl) * clamp((wx - px) / Math.max(1, gx - px), 0, 1);
      px = gx; pl = wps[i].lat;
    }
    return pl;
  };

  function end(success: boolean, reason?: string) {
    if (state === 'ended') return;
    state = 'ended';
    // Reaching the finish is not enough: the route has to be flown. At least 65 percent of the rings must be collected
    // (50 percent in assisted mode). Flying straight and level through a route that bends cannot reach that.
    const hitRings = level.gates.filter((g) => g.state === 'hit').length;
    const need = needRings(level.gates.length, opts.assisted);
    if (success && hitRings < need) { success = false; reason = `Only ${hitRings} of ${level.gates.length} rings collected. You need at least ${need} to complete this flight. Plan each climb and descent a little earlier.`; }
    audio.engineStop();
    const stats: MissionStats = {
      success, reason, time: t, checkpoints: level.gates.filter((g) => g.state === 'hit').length, total: level.gates.length, hits,
      bandFraction: def.speedBand ? (bandAll > 0 ? bandIn / bandAll : 0) : def.lateral ? (latAll > 0 ? latIn / latAll : 0) : undefined, landing,
      // The only in-flight judgement scored is the go-around: right when the climb started within seven seconds of the call.
      decisionsCorrect: def.goAround && gaClimbed && gaClimbT <= 7 ? 1 : 0, decisionsTotal: def.goAround ? 1 : 0,
      fuelLeft: def.fuel ? Math.max(0, fuel) : undefined, assisted: opts.assisted,
      trackError: def.lateral && latAll > 0 ? errSum / latAll : undefined, maxOffset: def.lateral ? maxOff : undefined, touchdownOffset: touchOff,
      goAround: def.goAround ? (gaLanded ? 'landed' : gaClimbed ? (gaClimbT <= 7 ? 'done' : 'late') : 'missed') : undefined,
      phases: [...phasesFlown], touchdownZone: tdZone,
      weather: WX ? { tornadoMin: TOR && Number.isFinite(torMin) ? Math.round(torMin) : undefined, stormHits } : undefined,
      approach: def.landing && !def.goAround && (apAll > 0 || goArounds > 0) ? { stability: apAll > 0 ? apStable / apAll : 0, goArounds } : undefined,
      trace, gateStates: level.gates.map((g) => g.state), bonus, ringTypes: ringTally,
      boosters: { collected, used: { ...used }, xpTokens, absorbed },
    };
    audio.sfx(success ? 'win' : 'fail');
    phase = 'complete'; cb.onPhase?.('complete');
    cb.onEnd({ ...stats, ...scoreMission(def.parTime, stats) });
  }

  /**
   * The pilot's go-around: available on the approach and over the runway before touchdown, at most twice. The aircraft climbs
   * away and is positioned behind the approach to fly it again; rings missed on that stretch can be flown again, rings
   * already collected stay collected. Choosing it is good airmanship when the approach is not stable.
   */
  function goAroundNow(): boolean {
    if (!def.landing || def.goAround || state !== 'run' || onGround || goArounds >= 2) return false;
    if (phase !== 'approach' && phase !== 'landing') return false;
    const wasStable = apAll > 0 ? apStable / apAll : 0;
    goArounds++;
    const back = apStart - 700;
    worldX = back - PLANE_X;
    y = clamp(glideY(def, apStart, GROUND - 14) - 40, CEIL + 40, GROUND - 140); vy = 0;
    kt = clamp(kt, ac.minKt + range * 0.25, landMax);
    for (const g of level.gates) if (g.x > back && g.state === 'missed') g.state = 'open';
    apAll = 0; apStable = 0; fade = 1; invuln = Math.max(invuln, 1);
    audio.sfx('unlock');
    say(`Going around${wasStable < 0.6 ? ' — a good call from an unstable approach' : ''}. You are positioned for another approach: follow the slope lights and keep the speed down.`);
    trackPhase();
    return true;
  }

  function hit(text: string, minor = false) {
    if (invuln > 0) return;
    // The shield soaks up one minor contact (balloons, birds, towers). Storms, the ground and the runway are never minor.
    if (minor && isActive('shield')) {
      active.splice(active.findIndex((a) => a.kind === 'shield'), 1); cooldown.shield = BOOSTERS.shield.cooldown; absorbed++;
      invuln = 1; flash = 0.2; audio.sfx('ok'); say('Shield absorbed the contact. (Arcade booster.)'); emitBoosters();
      return;
    }
    hits++; strikes++; cleanFor = 0; invuln = 1.6; flash = 0.35;
    audio.sfx('hit');
    say(text);
    if (!opts.assisted && strikes >= 3) end(false, 'The aircraft took too much damage. Give obstacles more room and try again.');
  }

  function update(rawDt: number) {
    const dt = rawDt * (isActive('slow') ? 0.6 : 1);
    tickBoosters(rawDt);
    t += dt;
    invuln = Math.max(0, invuln - dt);
    if (strikes > 0 && (cleanFor += dt) >= 30) { strikes--; cleanFor = 0; say('Contact light restored after 30 seconds of clean flying.'); }
    flash = Math.max(0, flash - dt); fade = Math.max(0, fade - dt * 1.6);
    const up = keys.has('ArrowUp') || keys.has('w') || keys.has('W');
    const down = keys.has('ArrowDown') || keys.has('s') || keys.has('S');
    const left = keys.has('ArrowLeft') || keys.has('a') || keys.has('A');
    const right = keys.has('ArrowRight') || keys.has('d') || keys.has('D');
    let inY = (down ? 1 : 0) - (up ? 1 : 0) + input.y;
    const inX = clamp((right ? 1 : 0) - (left ? 1 : 0) + input.x, -1, 1);
    if (touchY !== null) inY = clamp((touchY - y) / 60, -1, 1);
    inY *= clamp(opts.steer ?? 1, 0.4, 2);
    if (isActive('assist') && !onGround) {
      // Gentle help towards the next ring: it nudges the input, it never flies for you.
      const next = level.gates.find((q) => q.x > worldX + PLANE_X + 20 && q.state === 'open');
      if (next) inY += clamp((next.y - y) / 200, -0.3, 0.3);
    }
    inY = clamp(inY, -1, 1);
    const wx = worldX + PLANE_X;

    while (nextMessage < messages.length && messages[nextMessage].at * def.length <= worldX) say(messages[nextMessage++].text);

    if (state === 'rollout') {
      kt = Math.max(0, kt - 45 * dt);
      worldX += pxSpeed() * dt;
      y = groundY(wx) - 14;
      if (kt <= 8) end(true);
      return;
    }

    if (!def.energy) {
      // Keyboard or thrust buttons take over from the lever; the lever moves the throttle at a steady, engine-like rate.
      if (inX !== 0) thrTarget = null;
      if (thrTarget !== null) thr = clamp(thr + clamp(thrTarget - thr, -0.9 * dt, 0.9 * dt), 0, 1);
      else thr = clamp(thr + inX * 0.7 * dt, 0, 1);
    }

    if (onGround) {
      kt += (thr * (ac.minKt + range * 0.8) - kt) * accel * dt;
      y = GROUND - 14;
      worldX += pxSpeed() * dt;
      if (kt >= vr && (inY < -0.2 || opts.assisted)) { onGround = false; vy = -130; airborneAt = wx; trackPhase(); say('Airborne. Climb away gently.'); }
      else if (kt >= vr && stallWarned === 0) { stallWarned = 1; say('Rotate speed reached — pull up now.'); }
      if (wx > TAKEOFF_RUNWAY + 150) end(false, 'You ran out of runway. Add full thrust early and rotate at the rotate speed.');
      audio.engineSet(thr);
      return;
    }

    // Airborne
    const wind = def.wind ? def.wind.vy + Math.sin(t * 1.3) * def.wind.gust : 0;
    const autoland = opts.assisted && def.landing && wx > level.runwayStart - 700;
    vy += (inY * ac.agility * (isActive('speed') ? 0.75 : 1) * 520 - vy * 2.6) * dt;
    if (WX?.turbulence) {
      // Turbulence: smooth, irregular vertical bumps (two mixed waves). Half as strong in assisted mode.
      const bump = Math.sin(t * 2.3 + def.seed) * 0.6 + Math.sin(t * 5.7 + def.seed * 2) * 0.4;
      vy += WX.turbulence * bump * 380 * (opts.assisted ? 0.5 : 1) * dt;
      if (!turbSaid && t > 2) { turbSaid = true; say('Turbulence. Keep the wings level and make small, smooth corrections. Do not chase every bump.'); }
    }
    if (keys.has(' ')) vy -= vy * 6 * dt;
    if (autoland) vy += (65 - vy) * 3 * dt;
    if (def.energy) {
      kt += ((ac.minKt + range * 0.35 - kt) * 0.15 + vy * 0.085) * dt;
      if (kt < ac.minKt + range * 0.06) { vy += 300 * dt; if (t - stallWarned > 4) { stallWarned = t; say('Airspeed low — lower the nose to regain speed.'); audio.sfx('bad'); } }
    } else {
      kt += ((ac.minKt + range * thr - kt) * 0.9 + vy * 0.03) * dt;
    }
    kt = clamp(kt, ac.minKt * 0.6, ac.maxKt * 1.05);
    y = Math.max(CEIL, y + (vy + wind) * dt);
    if (y === CEIL && vy < 0) vy = 0;
    worldX += pxSpeed() * dt;

    // Sideways wind: it pushes the aircraft off the track; a held heading correction pushes back. The faster the
    // aircraft flies, the less correction is needed (here 0.45 track units per second per knot at full correction).
    if (def.lateral) {
      const L = def.lateral;
      const inH = clamp((keys.has('e') || keys.has('E') ? 1 : 0) - (keys.has('q') || keys.has('Q') ? 1 : 0) + input.h, -1, 1);
      hdg = clamp(hdg + inH * 1.1 * dt, -1, 1);
      const w = (L.wind + L.gust * Math.sin(t * 1.7 + 0.8)) * (opts.assisted ? 0.5 : 1) * clamp(t / 6, 0, 1);
      lat = clamp(lat + (w * 2.2 + hdg * kt * 0.45) * dt, -140, 140);
      const err = Math.abs(lat - planned(worldX + PLANE_X));
      latAll += dt; if (err <= L.tol) latIn += dt;
      errSum += err * dt; maxOff = Math.max(maxOff, err);
      if (Math.abs(lat) > 105) hit('You left the route corridor. Hold a heading correction against the wind and re-centre earlier.');
      if (TOR) {
        const dx = TOR.x - wx; const d = Math.abs(lat - TOR.lat);
        if (!torWarned && dx < 2600) { torWarned = true; say(`TORNADO WARNING: a funnel ahead, ${TOR.lat > 0 ? 'right' : 'left'} of track (red on the track panel). Follow the diversion route and stay well clear.`); audio.sfx('bad'); }
        // Inflow: near the funnel the air is drawn towards it (arcade effect), so the correction has to be held.
        if (Math.abs(dx) < 900) lat += Math.sign(TOR.lat - lat) * 10 * (1 - Math.abs(dx) / 900) * (opts.assisted ? 0.5 : 1) * dt;
        if (Math.abs(dx) < 260) torMin = Math.min(torMin, d);
        if (Math.abs(dx) < 700 && d < TOR.radius * 1.8 && t - tooCloseT > 4) { tooCloseT = t; say('Too close to the tornado. Turn away now.'); audio.sfx('bad'); }
        if (Math.abs(dx) < 120 && d < TOR.radius) {
          if (opts.assisted) { hit('Inside the tornado danger area. Assisted mode pushed you clear: divert earlier.'); lat += Math.sign(lat - TOR.lat || 1) * 30; }
          else return end(false, 'You flew into the tornado danger area. In real flying, recognise the warning early and divert far away from severe storms and tornadoes.');
        }
      }
    }
    if (def.goAround) {
      const wxa = worldX + PLANE_X;
      if (gaState === 'idle' && wxa >= level.runwayStart - def.goAround.at) { gaState = 'active'; gaAt = t; gaY = y; say('Runway occupied. GO AROUND: add power and climb away now.'); audio.sfx('bad'); }
      else if (gaState === 'active') {
        if (!gaClimbed && y <= Math.min(GROUND - 110, gaY - 60)) { gaClimbed = true; gaClimbT = t - gaAt; say(gaClimbT <= 7 ? 'Positive climb. Go-around flown correctly.' : 'You are climbing, but a go-around has to start sooner.'); }
        if (wxa >= level.runwayStart && wxa <= level.runwayEnd && y > GROUND - 70) hit('Too low over an occupied runway.');
      }
    }
    if (WX?.lightning) {
      const L = lightningAt(t, def.seed);
      if (t >= L.struck && L.struck !== lastStrike) { lastStrike = L.struck; thunderAt = t + 0.9 + (def.seed % 4) * 0.4; }
      if (thunderAt > 0 && t >= thunderAt) { thunderAt = -1; audio.sfx('thunder'); }
    }
    trackPhase();
    if (phase === 'approach') {
      apAll += dt;
      const onPath = Math.abs(glideY(def, wx, GROUND - 14) - y) <= 40;
      const onSpeed = kt <= landMax && kt >= ac.minKt + range * 0.08;
      if (onPath && onSpeed) apStable += dt;
    }
    traceT += dt;
    if (traceT >= 0.25) { traceT = 0; trace.push([Math.round(t * 100) / 100, Math.round(worldX + PLANE_X), Math.round(y), Math.round(lat * 10) / 10, Math.round(kt)]); }
    audio.engineSet(def.energy ? 0.2 : thr);

    if (def.fuel) {
      fuel -= (dt * (0.2 + 1.3 * thr * thr)) / ((0.8 * def.length) / 250);
      if (fuel <= 0) return end(false, 'Fuel exhausted. Cruise at a moderate power setting to keep a reserve.');
      if (fuel < 0.2 && t - stallWarned > 6) { stallWarned = t; say('Low fuel. Reduce power.'); }
    }
    if (def.speedBand && wx > level.gates[0]?.x - 400 && wx < level.runwayStart - 200) {
      bandAll += dt;
      if (kt >= def.speedBand.min && kt <= def.speedBand.max) bandIn += dt;
    }

    for (const g of level.gates) {
      if (g.state === 'open' && wx >= g.x) {
        const wp = def.lateral?.waypoints?.[level.gates.indexOf(g)];
        const sideOk = !wp || Math.abs(lat - wp.lat) <= def.lateral!.tol;
        if (Math.abs(y - g.y) <= ringR(g) && sideOk) ringHit(g, level.gates.indexOf(g));
        else { g.state = 'missed'; if (wp && !sideOk) say(`Waypoint ${wp.name} missed: you were off the planned track. Turn earlier and hold the heading.`); }
      }
    }
    for (const pk of level.pickups) {
      if (pk.taken) continue;
      const grab = isActive('magnet') ? 1.6 : 1;
      if (Math.abs(pk.x - wx) < 30 * grab && Math.abs(pk.y - y) < 36 * grab) {
        if (pk.kind === 'xp') { pk.taken = true; xpTokens++; collected++; audio.sfx('ok'); say('Bonus XP token collected.'); emitBoosters(); }
        else if (held.length < MAX_HELD) { pk.taken = true; held.push(pk.kind); collected++; audio.sfx('ok'); say(BOOSTERS[pk.kind].name + ' collected. Tap it to use it.'); emitBoosters(); }
        else if (wx - pk.x < 4) say('Booster slots are full. Use one first.');
      }
    }
    for (const o of level.obstacles) {
      const oy = obstacleY(o);
      const dx = Math.abs(o.x - wx);
      if (o.type === 'tower') { if (dx < 26 && y > oy - 8) hit('Obstacle strike. Keep well above towers.', true); }
      else if (dx < o.r + 18 && Math.abs(oy - y) < o.r + 10) {
        if (o.type === 'storm' && invuln <= 0) stormHits++;
        hit(o.type === 'storm' ? 'You entered a storm cell. Avoid them by a wide margin.' : o.type === 'birds' ? 'Bird strike. Look ahead and plan around flocks.' : 'Obstacle contact. Give it more room.', o.type !== 'storm');
      }
    }

    const gy = groundY(wx);
    if (y >= gy - 14) {
      const onRunway = def.landing && wx >= level.runwayStart && wx <= level.runwayEnd;
      if (onRunway) {
        if (gaState === 'active') { gaLanded = true; return end(false, 'You landed on an occupied runway. When the runway is blocked, add power and climb away: that is a go-around.'); }
        const sink = vy + wind;
        landing = sink < 75 ? 'smooth' : sink < 135 ? 'firm' : 'hard';
        if (kt > landMax && landing === 'smooth') landing = 'firm';
        let lateralNote = '';
        if (def.lateral?.runwayHalf !== undefined) {
          touchOff = Math.abs(lat); const half = def.lateral.runwayHalf;
          if (touchOff > half) { landing = 'hard'; lateralNote = ' You touched down off the runway centreline: keep the heading correction until the flare and line up earlier.'; }
          else if (touchOff > half * 0.6) { if (landing === 'smooth') landing = 'firm'; lateralNote = ' You were drifting off the centreline at touchdown.'; }
          else lateralNote = ' Centreline touchdown.';
        }
        if (landing === 'hard') { hits++; audio.sfx('hit'); }
        tdZone = touchdownZone(def, wx);
        if (tdZone === 'long') lateralNote += ' You touched down long: aim for the first third of the runway.';
        smoke.push({ x: wx, t0: t, k: landing === 'smooth' ? 0.6 : landing === 'firm' ? 1 : 1.4 });
        say((landing === 'smooth' ? 'Smooth touchdown. Well done.' : landing === 'firm' ? 'Firm touchdown. Reduce your descent rate and speed a little earlier.' : 'Hard landing. Flare earlier and descend more gently.') + lateralNote);
        y = gy - 14; vy = 0; state = 'rollout';
      } else if (opts.assisted) { y = gy - 16; vy = -170; hit('Too low — assisted mode lifted you clear of the ground.'); }
      else return end(false, def.terrain ? 'Ground contact. Keep a safe margin above terrain.' : 'Ground contact. Hold your altitude until the runway.');
    }

    if (def.landing) {
      if (wx > level.runwayEnd + 40) {
        if (def.goAround) { if (gaState === 'active' && gaClimbed) end(true); else end(false, 'You flew over the runway without climbing away. In a go-around, add power and climb straight away.'); }
        else end(false, 'You flew past the runway. In real flying this is a go-around — set up a gentler descent and try again.');
      }
    }
    else if (wx >= def.length) end(true);
  }

  /* -------------------------------------------------------------- render */
  function hills(par: number, base: number, amp: number, wave: number, color: string): Edge {
    const bot = view.VH - view.oy;
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, bot);
    const edge = (x: number) => base - amp * (0.6 * Math.sin((x + (worldX + view.camShift) * par) / wave) + 0.4 * Math.sin((x + (worldX + view.camShift) * par) / (wave * 0.37) + 2));
    for (let x = 0; x <= view.VW; x += 16) ctx.lineTo(x, edge(x));
    ctx.lineTo(view.VW, edge(view.VW)); // the last step may stop short of the edge on screens whose width is not a multiple of the step
    ctx.lineTo(view.VW, bot); ctx.closePath(); ctx.fill();
    return edge;
  }
  function panel(x: number, yy: number, w: number, h: number) {
    ctx.fillStyle = 'rgba(11,37,69,0.78)'; ctx.beginPath(); ctx.roundRect(x, yy, w, h, 10); ctx.fill();
  }
  function label(text: string, x: number, yy: number, size = 13, color = '#ffffff', align: CanvasTextAlign = 'left', weight = 600) {
    ctx.font = `${weight} ${size}px "Segoe UI", system-ui, sans-serif`; ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(text, x, yy);
  }

  /**
   * A ring: soft cloud puffs around a coloured boundary. Drawn in two halves, the far half behind the aircraft and the
   * near half in front, so the aircraft visibly flies through the opening. The boundary sits exactly at the scoring
   * radius (vertical radius g.r, centred on the ring), the puffs lie outside it, and a dark outline keeps the ring
   * readable on bright sky, white clouds, sunset and dark weather.
   */
  function drawRing(g: Gate, sx: number, gi: number, half: 'back' | 'front') {
    let scale = 1; let alpha = 1;
    if (g.state === 'hit') {
      const b = bursts.find((x) => x.gi === gi); const age = b ? t - b.t0 : 9;
      if (age > 0.5) return;
      scale = 1 + age * 0.8; alpha = 1 - age / 0.5; // the ring swells and fades away
    }
    const missed = g.state === 'missed';
    const st = RING_STYLE[g.kind];
    const rr = ringR(g);
    const rx = Math.max(19, rr * 0.5) * scale; const ry = rr * scale;
    ctx.save();
    ctx.globalAlpha = missed ? 0.5 : alpha;
    ctx.beginPath(); ctx.rect(half === 'back' ? sx : sx - 4000, -4000, 4000, 8000); ctx.clip();
    const bob = opts.reducedMotion ? 0 : 1;
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * 6.2832;
      const pr = (7.5 + ((gi * 13 + k * 7) % 5) * 1.2) * (g.r / 48) * (0.9 + 0.1 * scale);
      const px = sx + Math.cos(a) * (rx + 3) + bob * Math.sin(t * 1.4 + k + gi) * 1.2; const py = g.y + Math.sin(a) * (ry + 4) + bob * Math.cos(t * 1.1 + k) * 1.4;
      ctx.fillStyle = missed ? 'rgba(200,208,218,0.9)' : 'rgba(255,255,255,0.96)'; ctx.strokeStyle = 'rgba(11,37,69,0.4)'; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.arc(px, py, pr, 0, 6.2832); ctx.fill(); ctx.stroke();
    }
    const edge = () => { ctx.beginPath(); ctx.ellipse(sx, g.y, rx, ry, 0, 0, 6.2832); ctx.stroke(); };
    // Soft glow in the ring colour, then a dark outline for contrast, then the coloured boundary itself.
    ctx.setLineDash([]); ctx.lineWidth = 14; ctx.globalAlpha *= 0.22; ctx.strokeStyle = missed ? '#8a96a5' : st.color; edge(); ctx.globalAlpha = missed ? 0.5 : alpha;
    ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(11,37,69,0.35)'; edge();
    ctx.setLineDash(missed ? [4, 4] : st.dash); ctx.lineWidth = 4; ctx.strokeStyle = missed ? '#8a96a5' : st.color; edge();
    ctx.setLineDash([]); ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.ellipse(sx, g.y, Math.max(2, rx - 3), Math.max(2, ry - 3), 0, 0, 6.2832); ctx.stroke();
    if (!missed && g.state === 'open') {
      ctx.fillStyle = st.color; ctx.strokeStyle = 'rgba(11,37,69,0.7)'; ctx.lineWidth = 1.2;
      const top = g.y - ry - 18;
      if (st.glyph === 'star') { ctx.beginPath(); for (let k = 0; k < 10; k++) { const rr = k % 2 ? 4.5 : 10; const a = -1.5708 + (k * 3.1416) / 5; ctx.lineTo(sx + Math.cos(a) * rr, top + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); ctx.stroke(); }
      else if (st.glyph === 'diamond') { ctx.beginPath(); ctx.moveTo(sx, top - 9); ctx.lineTo(sx + 8, top); ctx.lineTo(sx, top + 9); ctx.lineTo(sx - 8, top); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      else if (st.glyph === 'chevron') { ctx.lineWidth = 3; ctx.strokeStyle = st.color; ctx.beginPath(); ctx.moveTo(sx - 5, top - 7); ctx.lineTo(sx + 4, top); ctx.lineTo(sx - 5, top + 7); ctx.stroke(); }
      else if (st.glyph === 'ticks') { ctx.lineWidth = 2.5; ctx.strokeStyle = st.color; ctx.beginPath(); ctx.ellipse(sx, g.y, Math.max(2, rx * 0.5), ry * 0.5, 0, 0, 6.2832); ctx.stroke(); ctx.beginPath(); ctx.moveTo(sx, g.y - ry - 12); ctx.lineTo(sx, g.y - ry - 3); ctx.moveTo(sx, g.y + ry + 3); ctx.lineTo(sx, g.y + ry + 12); ctx.stroke(); }
    }
    ctx.restore();
  }

  /** A booster pickup: a pulsing disc with the booster's own letter, colour and a dark outline so it reads on any background. */
  function drawPickups(cam: number) {
    for (const pk of level.pickups) {
      if (pk.taken) continue;
      const sx = pk.x - cam; if (sx < -40 || sx > view.VW + 40) continue;
      const b = BOOSTERS[pk.kind]; const pulse = opts.reducedMotion ? 0 : Math.sin(t * 4 + pk.x) * 2;
      ctx.save();
      ctx.fillStyle = 'rgba(11,37,69,0.55)'; ctx.beginPath(); ctx.arc(sx, pk.y, 24 + pulse, 0, 6.2832); ctx.fill();
      ctx.fillStyle = b.color; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(sx, pk.y, 19 + pulse * 0.5, 0, 6.2832); ctx.fill(); ctx.stroke();
      label(b.short, sx, pk.y + 6, pk.kind === 'xp' ? 13 : 16, '#ffffff', 'center', 800);
      ctx.restore();
    }
  }

  /** What an active booster looks like on the aircraft and in the sky. */
  function drawBoosterEffects(cam: number, px: number) {
    if (isActive('shield')) { ctx.save(); ctx.strokeStyle = 'rgba(43,179,217,0.9)'; ctx.fillStyle = 'rgba(43,179,217,0.18)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(px, y, 46, 30, 0, 0, 6.2832); ctx.fill(); ctx.stroke(); ctx.restore(); }
    if (isActive('magnet')) { ctx.save(); ctx.setLineDash([5, 6]); ctx.strokeStyle = 'rgba(224,69,123,0.85)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(px, y, 54 + (opts.reducedMotion ? 0 : Math.sin(t * 5) * 3), 0, 6.2832); ctx.stroke(); ctx.restore(); }
    if (isActive('speed') && !opts.reducedMotion) { ctx.save(); ctx.strokeStyle = 'rgba(245,130,32,0.8)'; ctx.lineWidth = 3; for (let k = 0; k < 6; k++) { const yy = y - 20 + k * 8; const len = 30 + ((k * 17 + t * 300) % 40); ctx.beginPath(); ctx.moveTo(px - 36, yy); ctx.lineTo(px - 36 - len, yy); ctx.stroke(); } ctx.restore(); }
    if (isActive('multiplier')) label('x2', px + 4, y - 36, 16, '#f2b705', 'center', 800);
    if (isActive('assist')) {
      const next = level.gates.find((q) => q.x > worldX + PLANE_X + 20 && q.state === 'open');
      if (next) { ctx.save(); ctx.setLineDash([4, 7]); ctx.strokeStyle = 'rgba(18,165,148,0.95)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px + 30, y); ctx.lineTo(next.x - cam, next.y); ctx.stroke(); ctx.restore(); }
    }
    if (isActive('slow')) { ctx.save(); ctx.fillStyle = 'rgba(91,124,250,0.10)'; ctx.fillRect(0, -view.oy, view.VW, view.VH); ctx.restore(); }
  }

  /** The reward: an expanding ring, a spray of particles (fewer with reduced motion) and a label that floats up. */
  function drawBursts(cam: number) {
    for (const b of bursts) {
      const age = t - b.t0;
      if (age < 0 || age > 1) continue;
      const sx = b.x - cam; const st = RING_STYLE[b.kind];
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - age / 0.45);
      ctx.strokeStyle = st.color; ctx.lineWidth = 5 * (1 - age / 0.45) + 1;
      ctx.beginPath(); ctx.ellipse(sx, b.y, 18 + age * 90, 40 + age * 110, 0, 0, 6.2832); ctx.stroke();
      ctx.restore();
      if (!opts.reducedMotion) {
        const n = b.kind === 'gold' || b.kind === 'special' ? 18 : 10;
        ctx.fillStyle = st.color; ctx.strokeStyle = 'rgba(11,37,69,0.5)'; ctx.lineWidth = 1;
        for (let k = 0; k < n; k++) {
          const a = (k / n) * 6.2832 + b.x; const sp = 70 + ((k * 37) % 60);
          ctx.globalAlpha = Math.max(0, 1 - age / 0.9);
          ctx.beginPath(); ctx.arc(sx + Math.cos(a) * sp * age, b.y + Math.sin(a) * sp * age + 60 * age * age, 3.2 - age * 2, 0, 6.2832); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      ctx.save(); ctx.globalAlpha = Math.max(0, 1 - Math.max(0, age - 0.4) / 0.6);
      label(b.text, sx, b.y - 34 - age * 38, 18, '#ffffff', 'center', 800);
      ctx.restore();
    }
  }

  /** Small markers at the right edge for gates and hazards that are still off screen, so the shorter portrait view never hides what is coming. */
  function lookAhead(cam: number, ringsOnly = false) {
    const reach = 650;
    let ringColor = '#f58220';
    const mark = (wx: number, my: number, kind: 'gate' | 'hazard') => {
      const d = wx - cam - view.VW;
      if (d < 0 || d > reach) return;
      const a = 0.35 + 0.65 * (1 - d / reach);
      const yy = clamp(my, CEIL + 8, GROUND - 8);
      ctx.globalAlpha = a;
      if (kind === 'gate') { ctx.strokeStyle = 'rgba(11,37,69,0.6)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(view.VW - 12, yy, 6, 11, 0, 0, 6.3); ctx.stroke(); ctx.strokeStyle = ringColor; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(view.VW - 12, yy, 6, 11, 0, 0, 6.3); ctx.stroke(); }
      else { ctx.fillStyle = '#d6453d'; ctx.beginPath(); ctx.moveTo(view.VW - 4, yy); ctx.lineTo(view.VW - 20, yy - 9); ctx.lineTo(view.VW - 20, yy + 9); ctx.closePath(); ctx.fill(); }
      ctx.globalAlpha = 1;
    };
    for (const g of level.gates) if (g.state === 'open') { ringColor = RING_STYLE[g.kind].color; mark(g.x, g.y, 'gate'); }
    if (!ringsOnly) for (const o of level.obstacles) mark(o.x, o.type === 'tower' ? o.y + o.h / 2 : o.y, 'hazard');
  }

  /** The approach-slope lights as a HUD instrument (the runway lights are often off screen during the approach). */
  function slopeHud(x: number, yy: number) {
    const n = (phase === 'approach' || phase === 'landing') && !onGround && state === 'run' && def.landing && !def.goAround ? slopeLights(glideY(def, worldX + PLANE_X, GROUND - 14) - y) : -1;
    if (n < 0) return false;
    for (let i = 0; i < 4; i++) { ctx.fillStyle = i < n ? '#ffffff' : '#ef4444'; ctx.beginPath(); ctx.arc(x + i * 12, yy, 4.5, 0, 6.3); ctx.fill(); }
    return true;
  }
  /** Landscape HUD row: the current flight phase, the next one, and the slope lights on the approach. */
  function phaseRow(x: number, yy: number, w: number) {
    const plan: PhaseId[] = phasePlan(def).filter((p) => p !== 'preflight' && p !== 'complete');
    if (plan.length < 2) return;
    panel(x, yy, w, 22);
    const i = plan.indexOf(phase);
    label(`${i >= 0 ? `${i + 1}/${plan.length}  ` : ''}${PHASES[phase].name.toUpperCase()}`, x + 10, yy + 15, 10, '#ffcf9f', 'left', 800);
    if (!slopeHud(x + w - 54, yy + 11) && i >= 0 && i < plan.length - 1) label(`NEXT: ${PHASES[plan[i + 1]].name.toUpperCase()}`, x + w - 10, yy + 15, 9, '#9fc3ea', 'right');
  }
  function phaseChip(cx: number, cy: number, cwid: number) {
    label(PHASES[phase].name.toUpperCase(), cx + 8, cy + 17, 10, '#ffcf9f', 'left', 800);
    slopeHud(cx + cwid - 46, cy + 13);
  }

  /** Portrait HUD in screen pixels: one instrument panel, the speed tape, the route bar, then a row of mission chips. */
  function portraitHud() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cw = view.VW * view.s;
    const x0 = 8 + view.safeL * view.s; const w = cw - x0 - 8 - view.safeR * view.s;
    const y0 = 8 + view.safeT * view.s;
    const alt = Math.max(0, Math.round(((groundY(worldX + PLANE_X) - 14 - y) + terrainHeight(def, worldX + PLANE_X)) * altScale / 10) * 10);
    const inBand = !def.speedBand || (kt >= def.speedBand.min && kt <= def.speedBand.max);
    const gatesHit = level.gates.filter((g) => g.state === 'hit').length;
    panel(x0, y0, w, 56);
    const col = w / 4;
    const cell = (i: number, name: string, value: string, color = '#ffffff') => { label(name, x0 + col * i + 10, y0 + 19, 9, '#9fc3ea'); label(value, x0 + col * i + 10, y0 + 42, 16, color); };
    cell(0, 'ALTITUDE', `${alt.toLocaleString('en-US')} ft`);
    cell(1, 'SPEED', `${Math.round(kt)} kt`, def.speedBand ? (inBand ? '#5ee6c8' : '#ffb26b') : '#ffffff');
    cell(2, 'TIME', `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`);
    cell(3, 'RINGS', `${gatesHit}/${level.gates.length}`);
    // Speed tape with the target band, the rotate mark and the speed marker.
    const y1 = y0 + 60;
    panel(x0, y1, w, 20);
    const tx = (v: number) => x0 + 10 + clamp((v - ac.minKt * 0.6) / (ac.maxKt * 1.05 - ac.minKt * 0.6), 0, 1) * (w - 20);
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(x0 + 10, y1 + 8, w - 20, 4);
    if (def.speedBand) { ctx.fillStyle = '#12a594'; ctx.fillRect(tx(def.speedBand.min), y1 + 6, tx(def.speedBand.max) - tx(def.speedBand.min), 8); }
    if (def.takeoff && onGround) { ctx.fillStyle = '#f58220'; ctx.fillRect(tx(vr) - 1, y1 + 3, 3, 14); label('ROTATE', tx(vr) + 6, y1 + 14, 9, '#ffcf9f'); }
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(tx(kt), y1 + 4); ctx.lineTo(tx(kt) - 5, y1 + 16); ctx.lineTo(tx(kt) + 5, y1 + 16); ctx.closePath(); ctx.fill();
    // Route progress and the three contact lights.
    const y2 = y1 + 28;
    ctx.fillStyle = 'rgba(11,37,69,0.55)'; ctx.fillRect(x0, y2, w - 64, 6);
    ctx.fillStyle = '#f58220'; ctx.fillRect(x0, y2, (w - 64) * clamp((worldX + PLANE_X) / def.length, 0, 1), 6);
    for (let i = 0; i < 3; i++) { ctx.fillStyle = opts.assisted ? '#5ee6c8' : i < 3 - strikes ? '#f58220' : 'rgba(255,255,255,0.3)'; ctx.beginPath(); ctx.arc(x0 + w - 42 + i * 18, y2 + 3, 6, 0, 6.3); ctx.fill(); }
    // Mission chips.
    const cwid = (w - 12) / 3; let ci = 0;
    const chipTop = y2 + 14 + (def.lateral ? TRACK_PANEL : 0);
    if (def.lateral) trackPanel(x0, y2 + 14, w, TRACK_PANEL - 6);
    const chip = (draw: (cx: number, cy: number) => void) => { const cx = x0 + (ci % 3) * (cwid + 6); const cy = chipTop + Math.floor(ci / 3) * 30; panel(cx, cy, cwid, 26); draw(cx, cy); ci++; };
    chip((cx, cy) => { phaseChip(cx, cy, cwid); });
    if (def.fuel) chip((cx, cy) => { label('FUEL', cx + 8, cy + 17, 10, '#9fc3ea'); ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fillRect(cx + 42, cy + 10, cwid - 52, 7); ctx.fillStyle = fuel < 0.2 ? '#ff6b5e' : '#5ee6c8'; ctx.fillRect(cx + 42, cy + 10, (cwid - 52) * clamp(fuel, 0, 1), 7); });
    if (def.showPressure) chip((cx, cy) => { label(`${Math.round(isaPressure(alt))} hPa`, cx + cwid / 2, cy + 17, 12, '#ffffff', 'center'); });
    if (def.wind) chip((cx, cy) => { const wd = def.wind!.vy + Math.sin(t * 1.3) * def.wind!.gust; label(`WIND ${wd > 0 ? '▼' : '▲'} ${Math.abs(Math.round(wd / 4))} kt`, cx + cwid / 2, cy + 17, 11, '#ffffff', 'center'); });
    if (def.energy) chip((cx, cy) => { label('IDLE: PITCH FOR SPEED', cx + cwid / 2, cy + 17, 8, '#ffcf9f', 'center'); });
    // The educational approximation notice stays on screen, at the foot of the play window.
    ctx.setTransform(dpr * view.s, 0, 0, dpr * view.s, 0, dpr * view.s * view.oy);
    label(def.style === 'Arcade' ? 'Simplified arcade flight model' : 'Simplified educational simulation', view.VW - 10, Y1 - 6, 9, 'rgba(11,37,69,0.75)', 'right');
  }

  /** The track panel: where the aircraft is across the planned track, the corridor that counts as on track, the wind and the heading correction. */
  function trackPanel(x: number, yy: number, w: number, h: number) {
    const L = def.lateral!;
    panel(x, yy, w, h);
    const cx = x + w / 2; const sc = (w - 24) / 220; const by = yy + h - 14;
    label(L.waypoints ? 'ROUTE' : def.landing ? 'CENTRELINE' : 'TRACK', x + 8, yy + 13, 9, '#9fc3ea');
    const wnd = (L.wind + L.gust * Math.sin(t * 1.7 + 0.8)) * (opts.assisted ? 0.5 : 1) * clamp(t / 6, 0, 1);
    label(`${Math.abs(wnd) < 0.5 ? 'NO SIDE WIND' : `WIND ${wnd > 0 ? '→' : '←'} ${Math.abs(Math.round(wnd))} kt`}  HDG ${Math.abs(hdg) < 0.05 ? '·' : hdg < 0 ? '◀' : '▶'} ${Math.round(Math.abs(hdg) * 12)}°`, x + w - 8, yy + 13, 9, '#ffffff', 'right');
    ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.fillRect(x + 12, by - 3, w - 24, 6);
    const tgt = planned(worldX + PLANE_X);
    ctx.fillStyle = 'rgba(18,165,148,0.6)'; ctx.fillRect(cx + (tgt - L.tol) * sc, by - 6, 2 * L.tol * sc, 12);
    if (L.runwayHalf !== undefined) { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ctx.strokeRect(cx - L.runwayHalf * sc, by - 8, 2 * L.runwayHalf * sc, 16); }
    if (TOR && TOR.x - (worldX + PLANE_X) < 3500 && TOR.x - (worldX + PLANE_X) > -400) { ctx.fillStyle = 'rgba(239,68,68,0.55)'; ctx.fillRect(cx + (TOR.lat - TOR.radius) * sc, by - 9, 2 * TOR.radius * sc, 18); }
    if (L.waypoints) { ctx.fillStyle = '#f58220'; ctx.beginPath(); ctx.moveTo(cx + tgt * sc, by - 10); ctx.lineTo(cx + tgt * sc + 5, by - 15); ctx.lineTo(cx + tgt * sc, by - 20); ctx.lineTo(cx + tgt * sc - 5, by - 15); ctx.closePath(); ctx.fill(); }
    const ax = cx + clamp(lat, -108, 108) * sc;
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(ax, by - 9); ctx.lineTo(ax - 6, by + 5); ctx.lineTo(ax + 6, by + 5); ctx.closePath(); ctx.fill();
  }

  // Picture quality. 'low' trims the decorative effects; 'auto' switches to it when about three quarters of a second of frames are slow.
  let slowRun = 0; let lastFrame = 0;
  function render() {
    if (opts.quality !== 'high' && opts.quality !== 'low') {
      const nowMs = performance.now(); const gap = lastFrame ? nowMs - lastFrame : 0; lastFrame = nowMs;
      if (gap > 34 && gap < 200) slowRun++; else if (gap <= 34) slowRun = 0;
      if (slowRun >= 45 && !lite) { lite = true; layout(lastLayout[0], lastLayout[1], lastLayout[2]); }
    }
    const { VW, VH, oy } = view;
    // Drawing camera: in portrait the aircraft is drawn nearer the left edge, so the world is drawn shifted. The simulation never reads this.
    const cam = worldX + view.camShift; const px = PLANE_X - view.camShift;
    const top = -oy; const bot = VH - oy;
    ctx.setTransform(dpr * view.s, 0, 0, dpr * view.s, 0, dpr * view.s * oy);
    ctx.fillStyle = pal.top; ctx.fillRect(0, top - 1, VW, -top + 2);
    const sky = ctx.createLinearGradient(0, 0, 0, GROUND);
    sky.addColorStop(0, pal.top); sky.addColorStop(1, pal.bottom);
    ctx.fillStyle = sky; ctx.fillRect(0, 0, VW, H);
    ctx.fillStyle = pal.sun; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(Math.min(780, VW - 110), def.env === 'sunset' || def.env === 'golden' ? 330 : 90, def.env === 'sunset' || def.env === 'golden' ? 54 : def.env === 'night' ? 26 : 36, 0, 6.3); ctx.fill(); ctx.globalAlpha = 1;
    drawSkyExtras(ctx, def.env, VW, GROUND, t, opts.reducedMotion, lite);
    if (!lite) drawCloudLayer(ctx, VW, cam, cloudColor(def.env), false, def.seed);
    for (const c of clouds) {
      const cx = ((c.x - cam * 0.25) % 1500 + 1500) % 1500 - 200;
      ctx.fillStyle = cloudColor(def.env);
      ctx.beginPath(); ctx.ellipse(cx, c.y, 46 * c.s, 15 * c.s, 0, 0, 6.3); ctx.ellipse(cx + 26 * c.s, c.y - 9 * c.s, 30 * c.s, 15 * c.s, 0, 0, 6.3); ctx.ellipse(cx - 28 * c.s, c.y - 4 * c.s, 26 * c.s, 12 * c.s, 0, 0, 6.3); ctx.fill();
    }
    const farEdge = hills(0.12, GROUND - (def.env === 'mountains' ? 150 : 95), def.env === 'mountains' ? 85 : 38, 210, pal.far);
    if (def.env === 'mountains' || def.env === 'arctic') drawSnowCaps(ctx, farEdge, VW, def.env === 'mountains' ? GROUND - 190 : GROUND - 105, bot);
    if (WX?.storm) drawStormSky(ctx, VW, GROUND, t, opts.reducedMotion, cam);
    if (WX?.lightning) { const L = lightningAt(t, def.seed); drawLightning(ctx, opts.reducedMotion ? 0 : L.flash, L.bolt, VW, GROUND, !!opts.reduceFlashing); }
    const midEdge = hills(0.35, GROUND - 40, def.env === 'coast' || def.env === 'highalt' ? 6 : 26, 130, pal.mid);
    if (def.env === 'coast') drawSeaGlints(ctx, VW, GROUND - 44, GROUND - 6, cam, t, opts.reducedMotion);
    else drawForest(ctx, def.env, midEdge, VW, cam, 0.35, lite);
    if (TOR) {
      const sx = TOR.x - cam;
      if (sx > -320 && sx < VW + 320) {
        const near = clamp(1 - Math.abs(lat - TOR.lat) / 140, 0, 1);
        drawTornado(ctx, sx, GROUND, CEIL - 10, t, near, opts.reducedMotion);
        panel(sx - 74, GROUND - 58, 148, 22); label('TORNADO · STAY CLEAR', sx, GROUND - 42, 11, '#ffb4ad', 'center', 800);
      }
    }

    // Ground and terrain
    ctx.fillStyle = pal.ground; ctx.beginPath(); ctx.moveTo(0, bot);
    for (let x = 0; x <= VW; x += 12) ctx.lineTo(x, groundY(cam + x));
    ctx.lineTo(VW, groundY(cam + VW));
    ctx.lineTo(VW, bot); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.07)';
    for (let x = -((cam) % 120); x < VW; x += 120) ctx.fillRect(x, GROUND + 22, 60, 6);

    // Runways
    const runway = (a: number, b: number) => {
      const sx = a - cam; const ex = b - cam;
      if (ex < 0 || sx > VW) return;
      ctx.fillStyle = '#4a5563'; ctx.fillRect(sx, GROUND - 3, ex - sx, 14);
      ctx.fillStyle = '#ffffff';
      for (let x = sx + 20; x < ex - 30; x += 70) ctx.fillRect(x, GROUND + 3, 34, 3);
      ctx.fillRect(sx + 4, GROUND - 1, 8, 10); ctx.fillRect(ex - 12, GROUND - 1, 8, 10);
      if (isLowLight(def.env)) drawRunwayLights(ctx, Math.max(sx, -20), Math.min(ex, VW + 20), GROUND - 3, t, opts.reducedMotion);
    };
    const windDir = def.lateral && def.lateral.wind < 0 ? -1 : 1;
    if (def.takeoff) { runway(60, TAKEOFF_RUNWAY); drawAirport(ctx, 60, TAKEOFF_RUNWAY, cam, GROUND, VW, t, windDir, isLowLight(def.env), opts.reducedMotion); }
    if (def.landing) {
      runway(level.runwayStart, level.runwayEnd);
      drawAirport(ctx, level.runwayStart, level.runwayEnd, cam, GROUND, VW, t, windDir, isLowLight(def.env), opts.reducedMotion);
      if (def.goAround && gaState === 'active') {
        const ox = (level.runwayStart + level.runwayEnd) / 2 - cam;
        ctx.fillStyle = '#d6453d'; ctx.fillRect(ox - 24, GROUND - 14, 48, 14); ctx.fillStyle = '#ffffff'; ctx.fillRect(ox - 14, GROUND - 22, 24, 8);
        label('RUNWAY OCCUPIED', ox, GROUND - 32, 12, '#ffffff', 'center', 800);
      }
      if (!def.goAround) {
        const guiding = (phase === 'approach' || phase === 'landing') && !onGround && state === 'run';
        // The glide path to the aim point, faint and dashed: descent guidance for the approach.
        if (guiding) {
          ctx.save(); ctx.setLineDash([10, 12]); ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(apStart - cam, glideY(def, apStart, GROUND - 14)); ctx.lineTo(level.runwayStart + AIM - cam, GROUND - 14); ctx.stroke(); ctx.restore();
        }
        // Approach-slope lights beside the threshold (a simplified version of the real lights): white over red is on the path.
        const lx = level.runwayStart - 46 - cam;
        if (lx > -60 && lx < VW + 20) {
          const n = guiding ? slopeLights(glideY(def, worldX + PLANE_X, GROUND - 14) - y) : -1;
          ctx.fillStyle = '#1f2937'; ctx.fillRect(lx - 4, GROUND - 16, 46, 12);
          for (let i = 0; i < 4; i++) { ctx.fillStyle = n < 0 ? '#6b7280' : i < n ? '#ffffff' : '#ef4444'; ctx.beginPath(); ctx.arc(lx + 4 + i * 11, GROUND - 10, 4, 0, 6.3); ctx.fill(); }
        }
      }
    }
    else {
      const fx = def.length - cam;
      if (fx < VW + 40) {
        ctx.fillStyle = '#22364f'; ctx.fillRect(fx - 3, CEIL, 6, GROUND - CEIL);
        for (let i = 0; i < 12; i++) { ctx.fillStyle = i % 2 ? '#ffffff' : '#0b2545'; ctx.fillRect(fx + 3, CEIL + i * 14, 34, 14); ctx.fillStyle = i % 2 ? '#0b2545' : '#ffffff'; ctx.fillRect(fx + 20, CEIL + i * 14, 17, 14); }
        label('FINISH', fx + 20, CEIL - 8, 13, '#0b2545', 'center', 800);
      }
    }

    if (!lite) drawCloudLayer(ctx, VW, cam, cloudColor(def.env), true, def.seed + 3);
    // Gates
    for (const [gi, g] of level.gates.entries()) {
      const sx = g.x - cam;
      if (sx < -60 || sx > VW + 60) continue;
      drawRing(g, sx, gi, 'back');
      const wpn = def.lateral?.waypoints?.[gi]; if (wpn) label(wpn.name, sx, g.y - g.r - 10, 12, '#ffffff', 'center', 800);
      if (def.showPressure) { const hpa = Math.round(isaPressure((GROUND - g.y - 14) * altScale)); panel(sx - 34, g.y - g.r - 30, 68, 22); label(`${hpa} hPa`, sx, g.y - g.r - 14, 12, '#fff', 'center'); }
    }

    // Obstacles
    for (const o of level.obstacles) {
      const sx = o.x - cam;
      if (sx < -80 || sx > VW + 80) continue;
      const oy = obstacleY(o);
      if (o.type === 'balloon') {
        ctx.fillStyle = '#d6453d'; ctx.beginPath(); ctx.ellipse(sx, oy - 4, o.r - 2, o.r + 2, 0, 0, 6.3); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.ellipse(sx, oy - 4, (o.r - 2) * 0.4, o.r + 2, 0, 0, 6.3); ctx.fill();
        ctx.strokeStyle = '#5b4636'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(sx - 8, oy + o.r - 4); ctx.lineTo(sx - 5, oy + o.r + 8); ctx.moveTo(sx + 8, oy + o.r - 4); ctx.lineTo(sx + 5, oy + o.r + 8); ctx.stroke();
        ctx.fillStyle = '#8a5a2b'; ctx.fillRect(sx - 6, oy + o.r + 8, 12, 9);
      } else if (o.type === 'birds') {
        ctx.strokeStyle = '#1f2d3d'; ctx.lineWidth = 2.5;
        for (const [bx, by] of [[0, 0], [-16, 10], [14, 12]] as const) { const f = Math.sin(t * 9 + bx) * 5; ctx.beginPath(); ctx.moveTo(sx + bx - 9, oy + by - f); ctx.quadraticCurveTo(sx + bx - 4, oy + by - 6, sx + bx, oy + by); ctx.quadraticCurveTo(sx + bx + 4, oy + by - 6, sx + bx + 9, oy + by - f); ctx.stroke(); }
      } else if (o.type === 'storm') {
        ctx.fillStyle = '#4b5563';
        ctx.beginPath(); ctx.ellipse(sx, oy, o.r + 8, o.r * 0.6, 0, 0, 6.3); ctx.ellipse(sx - 24, oy - 16, 30, 24, 0, 0, 6.3); ctx.ellipse(sx + 22, oy - 20, 34, 28, 0, 0, 6.3); ctx.fill();
        if (Math.sin(t * 5 + o.phase) > 0.75) { ctx.strokeStyle = '#ffe066'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx, oy + 12); ctx.lineTo(sx - 9, oy + 34); ctx.lineTo(sx + 3, oy + 34); ctx.lineTo(sx - 5, oy + 56); ctx.stroke(); }
      } else {
        ctx.fillStyle = '#7b8794'; ctx.fillRect(sx - 6, oy, 12, o.h);
        ctx.fillStyle = '#d6453d'; for (let i = 0; i < o.h; i += 28) ctx.fillRect(sx - 6, oy + i, 12, 12);
        ctx.fillStyle = Math.sin(t * 6) > 0 ? '#ff4d4d' : '#7a1f1f'; ctx.beginPath(); ctx.arc(sx, oy - 4, 4, 0, 6.3); ctx.fill();
      }
    }

    drawPickups(cam);

    // Wind streaks
    if (def.wind) {
      const wind = def.wind.vy + Math.sin(t * 1.3) * def.wind.gust;
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) { const sx = (i * 97 + t * -260) % VW; const sy = (i * 71 + t * wind * 0.8) % (GROUND - 40) + 20; const px = (sx + VW) % VW; const py = ((sy % GROUND) + GROUND) % GROUND; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 26, py - wind * 0.12); ctx.stroke(); }
    }

    // Rain, then the aircraft's trail (contrail at speed, glow at night). Drawn from a short history of positions; visual only.
    if (!WX?.rain) drawRain(ctx, def.env, VW, GROUND, t, opts.reducedMotion, lite);
    drawPrecip(ctx, WX, VW, GROUND, t, opts.reducedMotion, lite);
    if (!opts.reducedMotion && !lite && ac.kind !== 'single' && ac.kind !== 'twin' && !onGround && state !== 'rollout') {
      if (!trail.length || t - trailT >= 0.06) { trailT = t; trail.push({ x: worldX + PLANE_X - 28 * ac.size, y, age: 0 }); if (trail.length > 24) trail.shift(); }
      trail.forEach((p, i) => { p.age = (trail.length - 1 - i) * 0.06; });
      drawTrail(ctx, trail, worldX, isNight(def.env));
    } else trail.length = 0;
    // Aircraft: its shadow on the ground, a gentle bob in flight, and the landing gear only when it is needed.
    const gy0 = groundY(worldX + PLANE_X);
    drawShadow(ctx, px, gy0, Math.max(0, gy0 - 14 - y), 60 * ac.size, isNight(def.env));
    const flying = !onGround && state !== 'rollout';
    const gear = !flying || phase === 'takeoff' || phase === 'approach' || phase === 'landing' || (phase === 'climb' && airborneAt !== null && worldX + PLANE_X < airborneAt + 500);
    ctx.save();
    ctx.translate(px, y + (opts.reducedMotion || !flying ? 0 : Math.sin(t * 1.7) * 1.2));
    // The visible pitch eases towards the target, so the nose follows the climb smoothly (drawing only; the simulation never reads it).
    const wantPitch = onGround || state === 'rollout' ? 0 : clamp(vy / 520, -0.45, 0.45);
    visPitch = opts.reducedMotion ? wantPitch : visPitch + (wantPitch - visPitch) * 0.2;
    ctx.rotate(visPitch);
    if (invuln > 0 && Math.floor(t * 12) % 2 === 0) ctx.globalAlpha = 0.45;
    drawAircraft(ctx, ac, opts.livery, opts.reducedMotion ? 0 : t, gear, isLowLight(def.env));
    ctx.restore(); ctx.globalAlpha = 1;
    for (const [gi, g] of level.gates.entries()) { const sx = g.x - cam; if (sx > -60 && sx < VW + 60) drawRing(g, sx, gi, 'front'); }
    drawBoosterEffects(cam, px);
    drawBursts(cam);
    drawFog(ctx, fogAmount, VW, top, VH, px);
    if (!opts.reducedMotion) {
      for (const sm of smoke) {
        const age = t - sm.t0; if (age > 1.5) continue;
        const a = (1 - age / 1.5) * 0.55;
        for (let i = 0; i < 5; i++) {
          const r = (5 + age * 20 * sm.k) * (1 - i * 0.12);
          ctx.fillStyle = `rgba(235,235,235,${a * (1 - i * 0.15)})`;
          ctx.beginPath(); ctx.arc(sm.x - cam - i * 10 * sm.k - age * 12, GROUND - 6 - age * 10 * (i % 2 ? 1 : 0.6), r, 0, 6.3); ctx.fill();
        }
      }
    }
    if (flash > 0) { ctx.fillStyle = `rgba(214,69,61,${flash})`; ctx.fillRect(0, top, VW, VH); }
    if (fade > 0) { ctx.fillStyle = `rgba(255,255,255,${Math.min(0.6, fade * 0.6)})`; ctx.fillRect(0, top, VW, VH); }

    lookAhead(cam, !view.portrait || fogAmount >= 0.3);
    if (view.portrait) { portraitHud(); return; }

    // HUD. Drawn at screen-readable size: on a phone the world is scaled down, so the HUD is scaled up to a
    // minimum of 0.85 and stacked in two blocks when the screen is too narrow to hold both side by side.
    const hk = Math.max(view.s, 0.85) / view.s;
    const stack = (318 + 214 + 28) * hk > VW - view.safeL - view.safeR;
    const alt = Math.max(0, Math.round(((groundY(worldX + PLANE_X) - 14 - y) + terrainHeight(def, worldX + PLANE_X)) * altScale / 10) * 10);
    ctx.save(); ctx.translate(view.safeL, top + view.safeT); ctx.scale(hk, hk);
    panel(14, 12, 318, 62);
    label('ALTITUDE', 28, 32, 10, '#9fc3ea'); label(`${alt.toLocaleString('en-US')} ft`, 28, 56, 19);
    label('SPEED', 136, 32, 10, '#9fc3ea');
    const inBand = !def.speedBand || (kt >= def.speedBand.min && kt <= def.speedBand.max);
    label(`${Math.round(kt)} kt`, 136, 56, 19, def.speedBand ? (inBand ? '#5ee6c8' : '#ffb26b') : '#fff');
    label('TIME', 236, 32, 10, '#9fc3ea'); label(`${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`, 236, 56, 19);
    // Speed tape
    panel(14, 80, 318, 22);
    const tx = (v: number) => 24 + clamp((v - ac.minKt * 0.6) / (ac.maxKt * 1.05 - ac.minKt * 0.6), 0, 1) * 298;
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(24, 89, 298, 4);
    if (def.speedBand) { ctx.fillStyle = '#12a594'; ctx.fillRect(tx(def.speedBand.min), 87, tx(def.speedBand.max) - tx(def.speedBand.min), 8); }
    if (def.takeoff && onGround) { ctx.fillStyle = '#f58220'; ctx.fillRect(tx(vr) - 1, 84, 3, 14); label('ROTATE', tx(vr) + 6, 96, 9, '#ffcf9f'); }
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(tx(kt), 86); ctx.lineTo(tx(kt) - 5, 99); ctx.lineTo(tx(kt) + 5, 99); ctx.closePath(); ctx.fill();
    phaseRow(14, 108, 318);
    ctx.restore();

    ctx.save(); ctx.translate(0, top + view.safeT); ctx.scale(hk, hk);
    const RX = (VW - view.safeR) / hk;
    let ry = stack ? 138 : 12;
    panel(RX - 214, ry, 200, 34);
    label(`RINGS ${level.gates.filter((g) => g.state === 'hit').length}/${level.gates.length}`, RX - 200, ry + 22, 13);
    for (let i = 0; i < 3; i++) { ctx.fillStyle = opts.assisted ? '#5ee6c8' : i < 3 - strikes ? '#f58220' : 'rgba(255,255,255,0.22)'; ctx.beginPath(); ctx.arc(RX - 74 + i * 20, ry + 17, 7, 0, 6.3); ctx.fill(); }
    ry += 40;
    if (def.lateral) { trackPanel(RX - 214, ry, 200, 50); ry += 56; }
    if (def.fuel) { panel(RX - 214, ry, 200, 28); label('FUEL', RX - 200, ry + 19, 11, '#9fc3ea'); ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fillRect(RX - 160, ry + 10, 134, 8); ctx.fillStyle = fuel < 0.2 ? '#ff6b5e' : '#5ee6c8'; ctx.fillRect(RX - 160, ry + 10, 134 * clamp(fuel, 0, 1), 8); ry += 34; }
    if (def.showPressure) { panel(RX - 214, ry, 200, 28); label('STATIC PRESSURE', RX - 200, ry + 19, 10, '#9fc3ea'); label(`${Math.round(isaPressure(alt))} hPa`, RX - 26, ry + 19, 14, '#fff', 'right'); ry += 34; }
    if (def.wind) { const wind = def.wind.vy + Math.sin(t * 1.3) * def.wind.gust; panel(RX - 214, ry, 200, 28); label('WIND', RX - 200, ry + 19, 11, '#9fc3ea'); label(`${wind > 0 ? '▼' : '▲'} ${Math.abs(Math.round(wind / 4))} kt`, RX - 26, ry + 19, 14, '#fff', 'right'); ry += 34; }
    if (def.energy) { panel(RX - 214, ry, 200, 28); label('ENGINE IDLE — PITCH FOR SPEED', RX - 200, ry + 19, 10, '#ffcf9f'); }
    ctx.restore();

    // Route progress along the bottom of the play band (above the home indicator when the band fills the screen).
    const lift = oy > 0 ? 0 : view.safeB;
    const barW = VW - 28 - view.safeL - view.safeR;
    ctx.fillStyle = 'rgba(11,37,69,0.5)'; ctx.fillRect(14 + view.safeL, H - 16 - lift, barW, 6);
    ctx.fillStyle = '#f58220'; ctx.fillRect(14 + view.safeL, H - 16 - lift, barW * clamp((worldX + PLANE_X) / def.length, 0, 1), 6);
    label(def.style === 'Arcade' ? 'Simplified arcade flight model' : 'Simplified educational simulation', VW - 16 - view.safeR, H - 24 - lift, 10, 'rgba(11,37,69,0.75)', 'right');
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    if (state === 'run' || state === 'rollout') update(dt);
    render();
  }

  const onKey = (e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
    if (e.type === 'keydown' && /^[1-3]$/.test(e.key)) { activate(Number(e.key) - 1); return; }
    if (e.type === 'keydown' && (e.key === 'g' || e.key === 'G')) { goAroundNow(); return; }
    if (e.type === 'keydown') keys.add(e.key); else keys.delete(e.key);
  };
  const toCanvasY = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); return ((e.clientY - r.top) / r.height) * view.VH - view.oy; };
  const onDown = (e: PointerEvent) => { touchY = toCanvasY(e); try { canvas.setPointerCapture?.(e.pointerId); } catch { /* capture is optional */ } };
  const onMove = (e: PointerEvent) => { if (touchY !== null) touchY = toCanvasY(e); };
  const onUp = () => { touchY = null; };
  window.addEventListener('keydown', onKey); window.addEventListener('keyup', onKey);
  trackPhase();
  const drag = opts.canvasDrag !== false;
  if (drag) {
    canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp);
  }
  audio.engineStart(ac.kind);
  emitBoosters();
  raf = requestAnimationFrame((n) => { last = n; frame(n); });

  return {
    pause() { if (state === 'run' || state === 'rollout') { state = 'paused'; audio.engineStop(); } },
    resume() { if (state === 'paused') { state = landing ? 'rollout' : 'run'; last = performance.now(); audio.engineStart(ac.kind); } },
    destroy() {
      cancelAnimationFrame(raf); audio.engineStop();
      window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKey);
      canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp);
    },
    resize(cw, ch, safe) { layout(cw, ch, safe); render(); },
    activateBooster: (i) => activate(i),
    boosters: boosterView,
    setInput(i) { if (i.x !== undefined) input.x = i.x; if (i.y !== undefined) input.y = i.y; if (i.h !== undefined) input.h = i.h; },
    setThrottle(v) { thrTarget = v === null ? null : clamp(v, 0, 1); },
    goAround: () => goAroundNow(),
    step(dt) { if (state === 'run' || state === 'rollout') update(Math.min(0.05, dt)); if (!opts.noRender) render(); },
    snapshot: () => ({ worldX, y, kt, state, hits, gates: level.gates.filter((g) => g.state === 'hit').length, onGround, lat, hdg, ga: gaState, strikes, bonus, thr, phase }),
  };
}

/** Concise post-flight debrief from the virtual instructor. */
export function debrief(def: MissionDef, r: MissionResult): string[] {
  const out: string[] = [];
  if (!r.success) return [r.reason ?? 'The mission was not completed.', 'Review the briefing, then try again. You can enable Assisted mode in the mission settings.'];
  out.push(r.checkpoints === r.total ? `All ${r.total} gates collected — accurate flying.` : `You collected ${r.checkpoints} of ${r.total} gates. Look further ahead and start each correction earlier.`);
  out.push(r.hits === 0 ? 'No obstacle or terrain contact. Good lookout.' : `${r.hits} contact${r.hits === 1 ? '' : 's'}. Leave a wider margin around hazards.`);
  if (r.bandFraction !== undefined) out.push(`You held the target speed ${Math.round(r.bandFraction * 100)}% of the time.${r.bandFraction < 0.7 ? ' Make smaller power changes and wait for the speed to settle.' : ''}`);
  if (r.approach) {
    const st = Math.round(r.approach.stability * 100);
    out.push(`Approach: on the glide path at a safe speed ${st}% of the time.${st < 60 ? ' Settle the descent earlier: two white and two red slope lights, speed in the lower half.' : ''}${r.approach.goArounds ? ` You chose ${r.approach.goArounds === 1 ? 'a go-around' : 'two go-arounds'}: going around from an approach that is not stable is good airmanship.` : ''}`);
  }
  if (r.landing) out.push((r.landing === 'smooth' ? 'Touchdown: smooth.' : r.landing === 'firm' ? 'Touchdown: firm. Reduce the descent rate before the runway.' : 'Touchdown: hard. Begin the descent earlier and arrive slower.') + (r.touchdownZone === 'long' ? ' It was long: aim for the first third of the runway.' : r.touchdownZone === 'in' ? ' In the touchdown zone.' : ''));
  if (r.goAround) out.push(r.goAround === 'done' ? 'Go-around started promptly.' : r.goAround === 'late' ? 'Go-around started late: add power and climb as soon as the runway is blocked.' : 'No go-around flown over the blocked runway.');
  if (r.fuelLeft !== undefined) out.push(`Fuel remaining on arrival: ${Math.round(r.fuelLeft * 100)}%.`);
  out.push(r.time <= def.parTime ? `Time ${r.time.toFixed(1)} s — inside the target of ${def.parTime} s.` : `Time ${r.time.toFixed(1)} s — target ${def.parTime} s.`);
  if (r.assisted) out.push('Flown in Assisted mode.');
  out.push(`Learning outcome: ${def.outcome}`);
  return out;
}
