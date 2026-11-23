import { describe, expect, it } from 'vitest';
import type { EnvId } from '../src/types';
import { GAME_AIRCRAFT, MISSIONS } from '../src/content';
import { ENV_NOTES, cloudColor, drawRain, drawRunwayLights, drawSkyExtras, drawTrail, isLowLight, isNight } from '../src/game/weather';
import { fly, headless } from './helpers/autopilot';

const NEW: EnvId[] = ['overcast', 'rain', 'night', 'golden', 'arctic'];

/** A canvas context that records which drawing calls were made. */
function recorder() {
  const calls: Record<string, number> = {};
  const grad = { addColorStop() { /* gradient stop */ } };
  const ctx = new Proxy({} as Record<string, unknown>, {
    get: (_t, k: string) => (k === 'createLinearGradient' || k === 'createRadialGradient' ? () => grad : (...a: unknown[]) => { calls[k] = (calls[k] ?? 0) + 1; return a; }),
    set: () => true,
  }) as unknown as CanvasRenderingContext2D;
  return { ctx, calls };
}

describe('new environments (batch 6)', () => {
  it('are used by real missions, so each one is reachable in the game', () => {
    for (const env of NEW) expect(MISSIONS.some((m) => m.env === env), env).toBe(true);
  });

  it('describe themselves, and only the dim ones switch lights on', () => {
    for (const env of NEW) expect(ENV_NOTES[env]!.length, env).toBeGreaterThan(30);
    expect(isNight('night')).toBe(true); expect(isNight('golden')).toBe(false);
    expect(isLowLight('night') && isLowLight('rain') && isLowLight('overcast')).toBe(true);
    expect(isLowLight('golden') || isLowLight('arctic') || isLowLight('sky')).toBe(false);
    expect(new Set(NEW.map(cloudColor)).size).toBeGreaterThan(2);
  });

  it('draw their effects with a bounded number of primitives, and fewer with reduced motion', () => {
    const rain = recorder(); drawRain(rain.ctx, 'rain', 960, 460, 3, false);
    const calm = recorder(); drawRain(calm.ctx, 'rain', 960, 460, 3, true);
    expect(rain.calls.moveTo).toBe(70); expect(calm.calls.moveTo).toBe(14);
    const none = recorder(); drawRain(none.ctx, 'sky', 960, 460, 3, false);
    expect(Object.keys(none.calls)).toHaveLength(0);
    const stars = recorder(); drawSkyExtras(stars.ctx, 'night', 960, 460, 1, false);
    expect(stars.calls.fillRect).toBe(60);
    const lights = recorder(); drawRunwayLights(lights.ctx, 0, 460, 400, 1, false);
    expect(lights.calls.fillRect).toBeLessThan(15);
    const trail = recorder(); drawTrail(trail.ctx, Array.from({ length: 24 }, (_, i) => ({ x: 100 + i, y: 200, age: i * 0.06 })), 0, true);
    expect(trail.calls.arc).toBe(24);
  });

  it('render every aircraft in every environment without error', () => {
    const all: EnvId[] = ['sky', 'countryside', 'mountains', 'coast', 'desert', 'sunset', 'airfield', 'highalt', ...NEW];
    for (const env of all) {
      const base = MISSIONS.find((m) => m.id === 'm-free-coast')!;
      for (const ac of GAME_AIRCRAFT) {
        const { g } = headless({ ...base, env, aircraftId: ac.id, landing: false, takeoff: false }, { noRender: false });
        for (let i = 0; i < 90; i++) g.step(1 / 60);
        g.destroy();
      }
    }
  });

  it('are visual only: a mission flies to the same result in rain, at night and in clear air', () => {
    const base = MISSIONS.find((m) => m.id === 'm-math-units')!;
    const clear = fly({ ...base, env: 'sky' }).result!;
    for (const env of NEW) {
      const r = fly({ ...base, env }).result!;
      expect(r.success, env).toBe(clear.success);
      expect(r.checkpoints, env).toBe(clear.checkpoints);
      expect(r.score, env).toBe(clear.score);
      expect(r.time, env).toBeCloseTo(clear.time, 5);
    }
  });
});
