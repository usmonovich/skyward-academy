// Headless scripted flights: runs the real engine in Node with a stubbed browser, so every mission can be flown by an
// autopilot in the test suite. This is scripted testing, not human playtesting: it measures duration, winnability
// and scoring, not how a mission feels.
import type { MissionDef, MissionResult } from '../../src/types';
import { GAME_AIRCRAFT } from '../../src/content/reference';
import { GROUND, PLANE_X, buildLevel, createGame, terrainHeight } from '../../src/game/engine';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

let stubbed = false;
function stubBrowser() {
  if (stubbed) return;
  stubbed = true;
  const g = globalThis as unknown as Record<string, unknown>;
  g.window = { devicePixelRatio: 1, addEventListener() {}, removeEventListener() {} };
  g.requestAnimationFrame = () => 0;
  g.cancelAnimationFrame = () => {};
}

/** A 2D context that accepts every call, so the engine's drawing code can run without a browser. */
function fakeCanvas(): HTMLCanvasElement {
  const ctx: unknown = new Proxy(function () {}, { get: () => ctx, set: () => true, apply: () => ctx });
  return { width: 0, height: 0, clientWidth: 0, clientHeight: 0, getContext: () => ctx, addEventListener() {}, removeEventListener() {}, getBoundingClientRect: () => ({ left: 0, top: 0, width: 960, height: 540 }), setPointerCapture() {} } as unknown as HTMLCanvasElement;
}

export interface FlightOptions {
  /** good: flies the mission; idle: gives no input at all. */
  mode?: 'good' | 'idle';
  assisted?: boolean;
  /** Answer every decision wrongly. */
  wrongDecisions?: boolean;
  /** Aim at this fraction of each ring's own radius above (negative) or below (positive) its centre, to test the edge of the scoring area. */
  ringOffset?: number;
  /** Give up after this many seconds of simulated time. */
  maxSeconds?: number;
}
export interface Flight { result?: MissionResult; seconds: number; decisions: number; timedOut: boolean }

export function fly(def: MissionDef, o: FlightOptions = {}): Flight {
  stubBrowser();
  const mode = o.mode ?? 'good';
  const ac = GAME_AIRCRAFT.find((a) => a.id === def.aircraftId)!;
  const level = buildLevel(def);
  const range = ac.maxKt - ac.minKt;
  const landMax = ac.minKt + range * 0.5;
  let result: MissionResult | undefined;
  const g = createGame(fakeCanvas(), def, ac, { assisted: !!o.assisted, livery: '#f58220', reducedMotion: true, noRender: true }, {
    onMessage() {}, onDecision() {}, onEnd: (r) => { result = r; },
  });
  const L = def.lateral;
  const planned = (wx: number): number => {
    const w = L?.waypoints; if (!w) return 0;
    let px = 0; let pl = 0;
    for (let i = 0; i < level.gates.length && i < w.length; i++) { const gx = level.gates[i].x; if (wx <= gx) return pl + (w[i].lat - pl) * clamp((wx - px) / Math.max(1, gx - px), 0, 1); px = gx; pl = w[i].lat; }
    return pl;
  };
  let decisions = 0; let steps = 0; const maxSteps = (o.maxSeconds ?? 600) * 60;
  while (!result && steps < maxSteps) {
    steps++;
    const s = g.snapshot();
    if (s.state === 'decision') { decisions++; g.answerDecision(!o.wrongDecisions); continue; }
    if (s.state === 'ended') break;
    if (mode === 'good') {
      const wx = s.worldX + PLANE_X;
      const gate = level.gates.find((q) => q.x > wx + 100);
      let ty = gate ? gate.y + (o.ringOffset ?? 0) * gate.r : 260;
      // Terrain: never plan below the highest ground in the next 450 pixels.
      let gmin = GROUND; if (def.terrain) { for (let d = 0; d <= 450; d += 40) gmin = Math.min(gmin, GROUND - terrainHeight(def, wx + d)); ty = Math.min(ty, gmin - 95); }
      // Vertical wind: hold against the mean push with feed-forward.
      const ff = -(def.wind?.vy ?? 0) / (ac.agility * 200);
      // Dodge hazards in the next 500 px, preferring the side that has room above the ground.
      const tNow = steps / 60;
      for (const ob of level.obstacles) {
        const dx = ob.x - wx;
        const oy = ob.type === 'birds' ? ob.y + Math.sin(tNow * 2 + ob.phase) * 40 : ob.type === 'storm' && def.stormDrift ? ob.y + Math.sin(tNow * 0.8 + ob.phase) * 60 : ob.y;
        const pad = ob.type === 'birds' ? 30 : ob.type === 'storm' && def.stormDrift ? 50 : 0;
        if (dx > 0 && dx < 500) {
          if (Math.abs(oy - s.y) < ob.r + 55 + pad) { const up = oy - ob.r - 65 - pad; const down = oy + ob.r + 65 + pad; const floor = gmin - 100; const okUp = up > 60; const okDown = down < floor; ty = okUp && okDown ? (Math.abs(up - s.y) < Math.abs(down - s.y) ? up : down) : okUp ? up : down; }
          if (ob.type === 'tower') ty = Math.min(ty, ob.y - 70);
        }
      }
      ty = Math.min(ty, gmin - 90);
      let inY: number; let inX = 0;
      if (def.landing && (!gate || wx > level.runwayStart - 1100) && !(def.goAround && s.ga === 'active')) {
        const dist = level.runwayStart - wx; const tgt = GROUND - 14 + 10 - clamp((dist - 200) / 5, 0, 70); const h = tgt - s.y;
        inY = clamp(h / Math.max(250, dist * 0.9) + ff, -0.4, 0.3); if (s.y < tgt - 120 && dist > 700) inY = clamp((tgt - 100 - s.y) / 250 + ff, -0.2, 0.25);
        inX = s.kt > landMax - 6 ? -1 : 0.2;
      } else if (def.goAround && s.ga === 'active') { inY = -1; inX = 1; }
      else { inY = clamp((ty - s.y) / 35 + ff, -1, 1); inX = def.takeoff && s.onGround ? 1 : (s.kt < ac.minKt + range * 0.45 ? 0.4 : 0); }
      if (def.landing && !(def.goAround && s.ga === 'active') && wx > level.runwayStart - (1200 + Math.max(0, s.kt - landMax) * 45) && s.kt > landMax - 6) inX = -1;
      if (def.fuel && !(def.landing && wx > level.runwayStart - 2500)) inX = s.kt > ac.minKt + range * 0.38 ? -0.5 : 0.3;
      if (def.speedBand && !def.takeoff) inX = clamp(((def.speedBand.min + def.speedBand.max) / 2 - s.kt) / 15, -1, 1);
      g.setInput({ x: inX, y: inY });
      if (L) { const vstar = -(s.lat - planned(wx)) * 1.4; const hstar = (vstar - (L.wind || 0) * 2.2) / (Math.max(30, s.kt) * 0.45); g.setInput({ h: clamp((hstar - s.hdg) * 4, -1, 1) }); }
    }
    g.step(1 / 60);
  }
  g.destroy();
  return { result, seconds: result?.time ?? steps / 60, decisions, timedOut: !result };
}
