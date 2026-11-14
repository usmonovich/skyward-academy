// Reusable 2D mission engine. A mission is plain data (MissionDef); this module turns it into a
// playable side-scrolling flight with gates, obstacles, wind, terrain, fuel, take-off, landing and decisions.
// The physics are deliberately simplified arcade physics — this is not a flight training device.
import type { Decision, EnvId, GameAircraft, MissionDef, MissionResult, MissionStats, ObstacleType } from '../types';
import { mulberry32 } from '../engine/assessment';
import { scoreMission } from '../engine/gamification';
import { isaPressure } from '../content/formulas';
import { audio } from '../engine/audio';
import { drawAircraft } from './art';

export const W = 960;
export const H = 540;
export const GROUND = 470;
export const CEIL = 46;
export const PLANE_X = 220;
const TAKEOFF_RUNWAY = 1300;

export interface Gate { x: number; y: number; r: number; state: 'open' | 'hit' | 'missed' }
export interface Obstacle { x: number; y: number; r: number; type: ObstacleType; phase: number; h: number }
export interface Level { gates: Gate[]; obstacles: Obstacle[]; runwayStart: number; runwayEnd: number }

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
    gates.push({ x, y, r: 48, state: 'open' });
  }
  const obstacles: Obstacle[] = [];
  const want = Math.round((def.obstacles.density * (x1 - x0)) / 400);
  for (let tries = 0; obstacles.length < want && tries < want * 8; tries++) {
    const type = def.obstacles.types[Math.floor(rnd() * def.obstacles.types.length)];
    const x = x0 + rnd() * (x1 - x0);
    const floor = GROUND - terrainHeight(def, x);
    const r = type === 'storm' ? 46 : type === 'balloon' ? 26 : type === 'birds' ? 20 : 16;
    const h = type === 'tower' ? 90 + rnd() * 70 : 0;
    const oy = type === 'tower' ? floor - h : clamp(80 + rnd() * 320, 80, floor - 80);
    if (gates.some((g) => Math.abs(g.x - x) < 190 && Math.abs(g.y - oy) < 125)) continue;
    if (obstacles.some((o) => Math.abs(o.x - x) < 230)) continue;
    obstacles.push({ x, y: oy, r, type, phase: rnd() * 6.28, h });
  }
  return { gates, obstacles, runwayStart: def.length - 1150, runwayEnd: def.length - 150 };
}

export interface GameCallbacks {
  onMessage: (text: string) => void;
  onDecision: (d: Decision) => void;
  onEnd: (r: MissionResult) => void;
}
export interface GameOptions { assisted: boolean; livery: string; reducedMotion: boolean }
/** Screen insets (CSS pixels) such as a phone notch or home indicator, kept clear of the HUD. */
export interface Safe { top: number; right: number; bottom: number; left: number }
export interface GameHandle {
  pause(): void; resume(): void; destroy(): void;
  /** x: thrust, y: pitch, h: heading correction (crosswind and navigation missions). */
  setInput(i: { x?: number; y?: number; h?: number }): void;
  answerDecision(correct: boolean): void;
  /** Test hook: advances the simulation by one fixed time step and redraws (used when animation frames are throttled). */
  step(dt: number): void;
  /** Debug/test hook: read-only snapshot of the simulation. */
  /** Fits the camera to the canvas's CSS size and the screen insets. Called on every size or orientation change. */
  resize(cssWidth: number, cssHeight: number, safe?: Safe): void;
  snapshot(): { worldX: number; y: number; kt: number; state: string; hits: number; gates: number; onGround: boolean; lat: number; hdg: number; ga: string };
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
  function layout(cw: number, ch: number, safe: Safe = { top: 0, right: 0, bottom: 0, left: 0 }) {
    if (cw > 0 && ch > 0) {
      const v = computeView(cw, ch, safe, def.lateral ? TRACK_PANEL : 0); const k = v.s;
      view.s = k; view.VW = v.VW; view.VH = v.VH; view.oy = v.oy; view.camShift = v.camShift; view.portrait = v.portrait;
      view.safeT = safe.top / k; view.safeR = safe.right / k; view.safeB = safe.bottom / k; view.safeL = safe.left / k;
      dpr = Math.min(dprBase, Math.sqrt(3.4e6 / (cw * ch)));
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

  let state: 'run' | 'paused' | 'decision' | 'rollout' | 'ended' = 'run';
  let worldX = 0;
  let onGround = !!def.takeoff;
  let y = onGround ? GROUND - 14 : 260;
  let vy = 0;
  let thr = onGround ? 0 : def.energy ? 0.35 : 0.5;
  let kt = onGround ? 0 : ac.minKt + range * (def.speedBand ? clamp(((def.speedBand.min + def.speedBand.max) / 2 - ac.minKt) / range, 0, 1) : 0.5);
  if (!onGround && def.speedBand) thr = clamp((kt - ac.minKt) / range, 0, 1);
  let t = 0;
  let hits = 0;
  let invuln = 0;
  let fuel = 1;
  let bandIn = 0; let bandAll = 0;
  let landing: MissionStats['landing'];
  let decisionsCorrect = 0;
  let nextDecision = 0;
  let nextMessage = 0;
  let stallWarned = 0;
  let raf = 0;
  let last = 0;
  let flash = 0;
  // Sideways track (lateral missions) and go-around state. Both are optional mission features.
  let lat = 0; let hdg = 0; let latIn = 0; let latAll = 0; let errSum = 0; let maxOff = 0; let touchOff: number | undefined;
  let gaState: 'idle' | 'active' = 'idle'; let gaAt = 0; let gaY = 0; let gaClimbed = false; let gaClimbT = 0; let gaLanded = false;
  const trace: number[][] = []; let traceT = 0; const decisionLog: boolean[] = [];
  const keys = new Set<string>();
  const input = { x: 0, y: 0, h: 0 };
  let touchY: number | null = null;
  const messages = [...(def.messages ?? [])].sort((a, b) => a.at - b.at);
  const decisions = [...(def.decisions ?? [])].sort((a, b) => a.at - b.at);
  const clouds = Array.from({ length: 9 }, (_, i) => ({ x: (i * 173 + def.seed * 37) % 1500, y: 50 + ((i * 97 + def.seed * 13) % 190), s: 0.6 + ((i * 31) % 10) / 12 }));

  const pxSpeed = () => (kt < ac.minKt ? 140 * (kt / ac.minKt) : 140 + clamp((kt - ac.minKt) / range, 0, 1.1) * 200);
  const groundY = (wx: number) => GROUND - terrainHeight(def, wx);
  const say = (text: string) => cb.onMessage(text);
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
    audio.engineStop();
    const stats: MissionStats = {
      success, reason, time: t, checkpoints: level.gates.filter((g) => g.state === 'hit').length, total: level.gates.length, hits,
      bandFraction: def.speedBand ? (bandAll > 0 ? bandIn / bandAll : 0) : def.lateral ? (latAll > 0 ? latIn / latAll : 0) : undefined, landing,
      // A go-around counts as one decision: right when the climb started within seven seconds of the call.
      decisionsCorrect: decisionsCorrect + (def.goAround && gaClimbed && gaClimbT <= 7 ? 1 : 0), decisionsTotal: decisions.length + (def.goAround ? 1 : 0),
      fuelLeft: def.fuel ? Math.max(0, fuel) : undefined, assisted: opts.assisted,
      trackError: def.lateral && latAll > 0 ? errSum / latAll : undefined, maxOffset: def.lateral ? maxOff : undefined, touchdownOffset: touchOff,
      goAround: def.goAround ? (gaLanded ? 'landed' : gaClimbed ? (gaClimbT <= 7 ? 'done' : 'late') : 'missed') : undefined,
      trace, gateStates: level.gates.map((g) => g.state), decisionResults: [...decisionLog],
    };
    audio.sfx(success ? 'win' : 'fail');
    cb.onEnd({ ...stats, ...scoreMission(def.parTime, stats) });
  }

  function hit(text: string) {
    if (invuln > 0) return;
    hits++; invuln = 1.6; flash = 0.35;
    audio.sfx('hit');
    say(text);
    if (!opts.assisted && hits >= 3) end(false, 'The aircraft took too much damage. Give obstacles more room and try again.');
  }

  function update(dt: number) {
    t += dt;
    invuln = Math.max(0, invuln - dt);
    flash = Math.max(0, flash - dt);
    const up = keys.has('ArrowUp') || keys.has('w') || keys.has('W');
    const down = keys.has('ArrowDown') || keys.has('s') || keys.has('S');
    const left = keys.has('ArrowLeft') || keys.has('a') || keys.has('A');
    const right = keys.has('ArrowRight') || keys.has('d') || keys.has('D');
    let inY = (down ? 1 : 0) - (up ? 1 : 0) + input.y;
    const inX = clamp((right ? 1 : 0) - (left ? 1 : 0) + input.x, -1, 1);
    if (touchY !== null) inY = clamp((touchY - y) / 60, -1, 1);
    inY = clamp(inY, -1, 1);
    const wx = worldX + PLANE_X;

    while (nextMessage < messages.length && messages[nextMessage].at * def.length <= worldX) say(messages[nextMessage++].text);
    if (nextDecision < decisions.length && decisions[nextDecision].at * def.length <= worldX) {
      state = 'decision';
      cb.onDecision(decisions[nextDecision]);
      return;
    }

    if (state === 'rollout') {
      kt = Math.max(0, kt - 45 * dt);
      worldX += pxSpeed() * dt;
      y = groundY(wx) - 14;
      if (kt <= 8) end(true);
      return;
    }

    if (!def.energy) thr = clamp(thr + inX * 0.7 * dt, 0, 1);

    if (onGround) {
      kt += (thr * (ac.minKt + range * 0.8) - kt) * accel * dt;
      y = GROUND - 14;
      worldX += pxSpeed() * dt;
      if (kt >= vr && (inY < -0.2 || opts.assisted)) { onGround = false; vy = -130; say('Airborne. Climb away gently.'); }
      else if (kt >= vr && stallWarned === 0) { stallWarned = 1; say('Rotate speed reached — pull up now.'); }
      if (wx > TAKEOFF_RUNWAY + 150) end(false, 'You ran out of runway. Add full thrust early and rotate at the rotate speed.');
      audio.engineSet(thr);
      return;
    }

    // Airborne
    const wind = def.wind ? def.wind.vy + Math.sin(t * 1.3) * def.wind.gust : 0;
    const autoland = opts.assisted && def.landing && wx > level.runwayStart - 700;
    vy += (inY * ac.agility * 520 - vy * 2.6) * dt;
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
    }
    if (def.goAround) {
      const wxa = worldX + PLANE_X;
      if (gaState === 'idle' && wxa >= level.runwayStart - def.goAround.at) { gaState = 'active'; gaAt = t; gaY = y; say('Runway occupied. GO AROUND: add power and climb away now.'); audio.sfx('bad'); }
      else if (gaState === 'active') {
        if (!gaClimbed && y <= Math.min(GROUND - 110, gaY - 60)) { gaClimbed = true; gaClimbT = t - gaAt; say(gaClimbT <= 7 ? 'Positive climb. Go-around flown correctly.' : 'You are climbing, but a go-around has to start sooner.'); }
        if (wxa >= level.runwayStart && wxa <= level.runwayEnd && y > GROUND - 70) hit('Too low over an occupied runway.');
      }
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
        if (Math.abs(y - g.y) <= g.r && sideOk) { g.state = 'hit'; audio.sfx('gate'); }
        else { g.state = 'missed'; if (wp && !sideOk) say(`Waypoint ${wp.name} missed: you were off the planned track. Turn earlier and hold the heading.`); }
      }
    }
    for (const o of level.obstacles) {
      const oy = obstacleY(o);
      const dx = Math.abs(o.x - wx);
      if (o.type === 'tower') { if (dx < 26 && y > oy - 8) hit('Obstacle strike. Keep well above towers.'); }
      else if (dx < o.r + 18 && Math.abs(oy - y) < o.r + 10) hit(o.type === 'storm' ? 'You entered a storm cell. Avoid them by a wide margin.' : o.type === 'birds' ? 'Bird strike. Look ahead and plan around flocks.' : 'Obstacle contact. Give it more room.');
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
  function hills(par: number, base: number, amp: number, wave: number, color: string) {
    const bot = view.VH - view.oy;
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, bot);
    const edge = (x: number) => base - amp * (0.6 * Math.sin((x + (worldX + view.camShift) * par) / wave) + 0.4 * Math.sin((x + (worldX + view.camShift) * par) / (wave * 0.37) + 2));
    for (let x = 0; x <= view.VW; x += 16) ctx.lineTo(x, edge(x));
    ctx.lineTo(view.VW, edge(view.VW)); // the last step may stop short of the edge on screens whose width is not a multiple of the step
    ctx.lineTo(view.VW, bot); ctx.closePath(); ctx.fill();
  }
  function panel(x: number, yy: number, w: number, h: number) {
    ctx.fillStyle = 'rgba(11,37,69,0.78)'; ctx.beginPath(); ctx.roundRect(x, yy, w, h, 10); ctx.fill();
  }
  function label(text: string, x: number, yy: number, size = 13, color = '#ffffff', align: CanvasTextAlign = 'left', weight = 600) {
    ctx.font = `${weight} ${size}px "Segoe UI", system-ui, sans-serif`; ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(text, x, yy);
  }

  /** Small markers at the right edge for gates and hazards that are still off screen, so the shorter portrait view never hides what is coming. */
  function lookAhead(cam: number) {
    const reach = 650;
    const mark = (wx: number, my: number, kind: 'gate' | 'hazard') => {
      const d = wx - cam - view.VW;
      if (d < 0 || d > reach) return;
      const a = 0.35 + 0.65 * (1 - d / reach);
      const yy = clamp(my, CEIL + 8, GROUND - 8);
      ctx.globalAlpha = a;
      if (kind === 'gate') { ctx.strokeStyle = '#f58220'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(view.VW - 12, yy, 6, 11, 0, 0, 6.3); ctx.stroke(); }
      else { ctx.fillStyle = '#d6453d'; ctx.beginPath(); ctx.moveTo(view.VW - 4, yy); ctx.lineTo(view.VW - 20, yy - 9); ctx.lineTo(view.VW - 20, yy + 9); ctx.closePath(); ctx.fill(); }
      ctx.globalAlpha = 1;
    };
    for (const g of level.gates) if (g.state === 'open') mark(g.x, g.y, 'gate');
    for (const o of level.obstacles) mark(o.x, o.type === 'tower' ? o.y + o.h / 2 : o.y, 'hazard');
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
    cell(3, 'GATES', `${gatesHit}/${level.gates.length}`);
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
    for (let i = 0; i < 3; i++) { ctx.fillStyle = opts.assisted ? '#5ee6c8' : i < 3 - hits ? '#f58220' : 'rgba(255,255,255,0.3)'; ctx.beginPath(); ctx.arc(x0 + w - 42 + i * 18, y2 + 3, 6, 0, 6.3); ctx.fill(); }
    // Mission chips.
    const cwid = (w - 12) / 3; let ci = 0;
    const chipTop = y2 + 14 + (def.lateral ? TRACK_PANEL : 0);
    if (def.lateral) trackPanel(x0, y2 + 14, w, TRACK_PANEL - 6);
    const chip = (draw: (cx: number, cy: number) => void) => { const cx = x0 + (ci % 3) * (cwid + 6); const cy = chipTop + Math.floor(ci / 3) * 30; panel(cx, cy, cwid, 26); draw(cx, cy); ci++; };
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
    if (L.waypoints) { ctx.fillStyle = '#f58220'; ctx.beginPath(); ctx.moveTo(cx + tgt * sc, by - 10); ctx.lineTo(cx + tgt * sc + 5, by - 15); ctx.lineTo(cx + tgt * sc, by - 20); ctx.lineTo(cx + tgt * sc - 5, by - 15); ctx.closePath(); ctx.fill(); }
    const ax = cx + clamp(lat, -108, 108) * sc;
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(ax, by - 9); ctx.lineTo(ax - 6, by + 5); ctx.lineTo(ax + 6, by + 5); ctx.closePath(); ctx.fill();
  }

  function render() {
    const { VW, VH, oy } = view;
    // Drawing camera: in portrait the aircraft is drawn nearer the left edge, so the world is drawn shifted. The simulation never reads this.
    const cam = worldX + view.camShift; const px = PLANE_X - view.camShift;
    const top = -oy; const bot = VH - oy;
    ctx.setTransform(dpr * view.s, 0, 0, dpr * view.s, 0, dpr * view.s * oy);
    ctx.fillStyle = pal.top; ctx.fillRect(0, top - 1, VW, -top + 2);
    const sky = ctx.createLinearGradient(0, 0, 0, GROUND);
    sky.addColorStop(0, pal.top); sky.addColorStop(1, pal.bottom);
    ctx.fillStyle = sky; ctx.fillRect(0, 0, VW, H);
    ctx.fillStyle = pal.sun; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(Math.min(780, VW - 110), def.env === 'sunset' ? 330 : 90, def.env === 'sunset' ? 54 : 36, 0, 6.3); ctx.fill(); ctx.globalAlpha = 1;
    for (const c of clouds) {
      const cx = ((c.x - cam * 0.25) % 1500 + 1500) % 1500 - 200;
      ctx.fillStyle = def.env === 'sunset' ? 'rgba(255,214,190,0.55)' : 'rgba(255,255,255,0.8)';
      ctx.beginPath(); ctx.ellipse(cx, c.y, 46 * c.s, 15 * c.s, 0, 0, 6.3); ctx.ellipse(cx + 26 * c.s, c.y - 9 * c.s, 30 * c.s, 15 * c.s, 0, 0, 6.3); ctx.ellipse(cx - 28 * c.s, c.y - 4 * c.s, 26 * c.s, 12 * c.s, 0, 0, 6.3); ctx.fill();
    }
    hills(0.12, GROUND - (def.env === 'mountains' ? 150 : 95), def.env === 'mountains' ? 85 : 38, 210, pal.far);
    hills(0.35, GROUND - 40, def.env === 'coast' || def.env === 'highalt' ? 6 : 26, 130, pal.mid);

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
    };
    if (def.takeoff) runway(60, TAKEOFF_RUNWAY);
    if (def.landing) {
      runway(level.runwayStart, level.runwayEnd);
      if (def.goAround && gaState === 'active') {
        const ox = (level.runwayStart + level.runwayEnd) / 2 - cam;
        ctx.fillStyle = '#d6453d'; ctx.fillRect(ox - 24, GROUND - 14, 48, 14); ctx.fillStyle = '#ffffff'; ctx.fillRect(ox - 14, GROUND - 22, 24, 8);
        label('RUNWAY OCCUPIED', ox, GROUND - 32, 12, '#ffffff', 'center', 800);
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

    // Gates
    for (const [gi, g] of level.gates.entries()) {
      const sx = g.x - cam;
      if (sx < -60 || sx > VW + 60) continue;
      ctx.lineWidth = 6;
      ctx.strokeStyle = g.state === 'hit' ? '#12a594' : g.state === 'missed' ? 'rgba(120,130,145,0.6)' : '#f58220';
      ctx.beginPath(); ctx.ellipse(sx, g.y, 15, g.r, 0, 0, 6.3); ctx.stroke();
      ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.ellipse(sx, g.y, 15, g.r, 0, 0, 6.3); ctx.stroke();
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

    // Wind streaks
    if (def.wind) {
      const wind = def.wind.vy + Math.sin(t * 1.3) * def.wind.gust;
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) { const sx = (i * 97 + t * -260) % VW; const sy = (i * 71 + t * wind * 0.8) % (GROUND - 40) + 20; const px = (sx + VW) % VW; const py = ((sy % GROUND) + GROUND) % GROUND; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 26, py - wind * 0.12); ctx.stroke(); }
    }

    // Aircraft
    ctx.save();
    ctx.translate(px, y);
    ctx.rotate(onGround || state === 'rollout' ? 0 : clamp(vy / 520, -0.45, 0.45));
    if (invuln > 0 && Math.floor(t * 12) % 2 === 0) ctx.globalAlpha = 0.45;
    drawAircraft(ctx, ac, opts.livery, opts.reducedMotion ? 0 : t, onGround || state === 'rollout' || !!def.landing);
    ctx.restore(); ctx.globalAlpha = 1;
    if (flash > 0) { ctx.fillStyle = `rgba(214,69,61,${flash})`; ctx.fillRect(0, top, VW, VH); }

    if (view.portrait) { lookAhead(cam); portraitHud(); return; }

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
    ctx.restore();

    ctx.save(); ctx.translate(0, top + view.safeT); ctx.scale(hk, hk);
    const RX = (VW - view.safeR) / hk;
    let ry = stack ? 112 : 12;
    panel(RX - 214, ry, 200, 34);
    label(`GATES ${level.gates.filter((g) => g.state === 'hit').length}/${level.gates.length}`, RX - 200, ry + 22, 13);
    for (let i = 0; i < 3; i++) { ctx.fillStyle = opts.assisted ? '#5ee6c8' : i < 3 - hits ? '#f58220' : 'rgba(255,255,255,0.22)'; ctx.beginPath(); ctx.arc(RX - 74 + i * 20, ry + 17, 7, 0, 6.3); ctx.fill(); }
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
    if (e.type === 'keydown') keys.add(e.key); else keys.delete(e.key);
  };
  const toCanvasY = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); return ((e.clientY - r.top) / r.height) * view.VH - view.oy; };
  const onDown = (e: PointerEvent) => { touchY = toCanvasY(e); try { canvas.setPointerCapture?.(e.pointerId); } catch { /* capture is optional */ } };
  const onMove = (e: PointerEvent) => { if (touchY !== null) touchY = toCanvasY(e); };
  const onUp = () => { touchY = null; };
  window.addEventListener('keydown', onKey); window.addEventListener('keyup', onKey);
  canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp);
  audio.engineStart();
  raf = requestAnimationFrame((n) => { last = n; frame(n); });

  return {
    pause() { if (state === 'run' || state === 'rollout') { state = 'paused'; audio.engineStop(); } },
    resume() { if (state === 'paused') { state = landing ? 'rollout' : 'run'; last = performance.now(); audio.engineStart(); } },
    destroy() {
      cancelAnimationFrame(raf); audio.engineStop();
      window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKey);
      canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp);
    },
    resize(cw, ch, safe) { layout(cw, ch, safe); render(); },
    setInput(i) { if (i.x !== undefined) input.x = i.x; if (i.y !== undefined) input.y = i.y; if (i.h !== undefined) input.h = i.h; },
    answerDecision(correct) { if (state !== 'decision') return; decisionLog.push(correct); if (correct) decisionsCorrect++; nextDecision++; state = 'run'; last = performance.now(); keys.clear(); },
    step(dt) { if (state === 'run' || state === 'rollout') update(Math.min(0.05, dt)); render(); },
    snapshot: () => ({ worldX, y, kt, state, hits, gates: level.gates.filter((g) => g.state === 'hit').length, onGround, lat, hdg, ga: gaState }),
  };
}

/** Concise post-flight debrief from the virtual instructor. */
export function debrief(def: MissionDef, r: MissionResult): string[] {
  const out: string[] = [];
  if (!r.success) return [r.reason ?? 'The mission was not completed.', 'Review the briefing, then try again. You can enable Assisted mode in the mission settings.'];
  out.push(r.checkpoints === r.total ? `All ${r.total} gates collected — accurate flying.` : `You collected ${r.checkpoints} of ${r.total} gates. Look further ahead and start each correction earlier.`);
  out.push(r.hits === 0 ? 'No obstacle or terrain contact. Good lookout.' : `${r.hits} contact${r.hits === 1 ? '' : 's'}. Leave a wider margin around hazards.`);
  if (r.bandFraction !== undefined) out.push(`You held the target speed ${Math.round(r.bandFraction * 100)}% of the time.${r.bandFraction < 0.7 ? ' Make smaller power changes and wait for the speed to settle.' : ''}`);
  if (r.landing) out.push(r.landing === 'smooth' ? 'Touchdown: smooth.' : r.landing === 'firm' ? 'Touchdown: firm. Reduce the descent rate before the runway.' : 'Touchdown: hard. Begin the descent earlier and arrive slower.');
  if (r.decisionsTotal) out.push(`Operational decisions: ${r.decisionsCorrect} of ${r.decisionsTotal} correct.`);
  if (r.fuelLeft !== undefined) out.push(`Fuel remaining on arrival: ${Math.round(r.fuelLeft * 100)}%.`);
  out.push(r.time <= def.parTime ? `Time ${r.time.toFixed(1)} s — inside the target of ${def.parTime} s.` : `Time ${r.time.toFixed(1)} s — target ${def.parTime} s.`);
  if (r.assisted) out.push('Flown in Assisted mode.');
  out.push(`Learning outcome: ${def.outcome}`);
  return out;
}
