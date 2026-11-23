import { describe, expect, it } from 'vitest';
import { GAME_AIRCRAFT, LIVERIES } from '../src/content/reference';
import { unlockedBetween } from '../src/components/MissionComplete';
import { audio } from '../src/engine/audio';
import { drawAircraft } from '../src/game/art';

/** A canvas context that counts drawing calls by name. */
function recorder() {
  const calls: Record<string, number> = {};
  const grad = { addColorStop() { /* gradient stop */ } };
  const ctx = new Proxy({} as Record<string, unknown>, {
    get: (_t, k: string) => (k === 'createLinearGradient' || k === 'createRadialGradient' ? () => grad : (..._a: unknown[]) => { calls[k] = (calls[k] ?? 0) + 1; }),
    set: () => true,
  }) as unknown as CanvasRenderingContext2D;
  return { ctx, total: () => Object.values(calls).reduce((a, b) => a + b, 0) };
}

describe('aircraft experience (batch: gameplay quality)', () => {
  it('draws every aircraft with its own details, and the bigger aircraft have more of them', () => {
    const cost: Record<string, number> = {};
    for (const ac of GAME_AIRCRAFT) { const r = recorder(); drawAircraft(r.ctx, ac, '#f58220', 1, false, false); cost[ac.id] = r.total(); expect(cost[ac.id], ac.id).toBeGreaterThan(20); }
    expect(new Set(Object.values(cost)).size).toBeGreaterThan(3);
    expect(cost.skyliner).toBeGreaterThan(cost.sparrow);
  });

  it('adds navigation lights only when asked, and draws a bounded number of primitives', () => {
    for (const ac of GAME_AIRCRAFT) {
      const dark = recorder(); drawAircraft(dark.ctx, ac, '#f58220', 1, false, true);
      const day = recorder(); drawAircraft(day.ctx, ac, '#f58220', 1, false, false);
      expect(dark.total(), ac.id).toBeGreaterThan(day.total());
      expect(dark.total(), ac.id).toBeLessThan(140);
    }
  });

  it('works out which aircraft and liveries a flight unlocked, from the XP before and after', () => {
    const k = GAME_AIRCRAFT.find((a) => a.unlockXp > 0)!;
    expect(unlockedBetween(k.unlockXp - 10, k.unlockXp + 5).aircraft.map((a) => a.id)).toEqual([k.id]);
    expect(unlockedBetween(k.unlockXp, k.unlockXp + 5).aircraft).toHaveLength(0);       // already unlocked before
    expect(unlockedBetween(0, 0)).toEqual({ aircraft: [], liveries: [] });
    const l = LIVERIES.find((x) => x.xp > 0)!;
    expect(unlockedBetween(l.xp - 1, l.xp).liveries.map((x) => x.id)).toEqual([l.id]);
    // A big jump unlocks several at once, in order.
    expect(unlockedBetween(0, 100000).aircraft).toHaveLength(GAME_AIRCRAFT.filter((a) => a.unlockXp > 0).length);
  });

  it('the engine sound is safe where there is no audio hardware: every aircraft kind starts and stops quietly', () => {
    for (const ac of GAME_AIRCRAFT) { expect(() => { audio.engineStart(ac.kind); audio.engineSet(0.7); audio.engineStop(); }).not.toThrow(); }
  });
});
