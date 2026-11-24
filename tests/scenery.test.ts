import { describe, expect, it } from 'vitest';
import { drawAirport, drawCloudLayer, drawForest, drawShadow } from '../src/game/scenery';

/** Counts drawing calls by name. */
function recorder() {
  const calls: Record<string, number> = {};
  const grad = { addColorStop() { /* stop */ } };
  const ctx = new Proxy({} as Record<string, unknown>, {
    get: (_t, k: string) => (k === 'createLinearGradient' || k === 'createRadialGradient' ? () => grad : (..._a: unknown[]) => { calls[k] = (calls[k] ?? 0) + 1; }),
    set: () => true,
  }) as unknown as CanvasRenderingContext2D;
  return { ctx, calls, total: () => Object.values(calls).reduce((a, b) => a + b, 0) };
}

describe('scenery (batch 5): deterministic and light', () => {
  const edge = () => 400;
  it('forests are drawn from world position, so the same camera gives the same trees, and low quality draws fewer', () => {
    const a = recorder(); drawForest(a.ctx, 'countryside', edge, 960, 1234, 0.35, false);
    const b = recorder(); drawForest(b.ctx, 'countryside', edge, 960, 1234, 0.35, false);
    const c = recorder(); drawForest(c.ctx, 'countryside', edge, 960, 1234, 0.35, true);
    expect(a.calls).toEqual(b.calls);
    expect(c.total()).toBeLessThan(a.total());
    expect(a.total()).toBeLessThan(400);
    const none = recorder(); drawForest(none.ctx, 'desert', edge, 960, 0, 0.35, false);
    expect(none.total()).toBe(0); // no trees in the desert
  });
  it('an airport is drawn only when its runway is near the screen', () => {
    const near = recorder(); drawAirport(near.ctx, 100, 1300, 0, 470, 960, 1, 1, false, false);
    const far = recorder(); drawAirport(far.ctx, 9000, 10000, 0, 470, 960, 1, 1, false, false);
    expect(near.total()).toBeGreaterThan(30);
    expect(far.total()).toBe(0);
  });
  it('the shadow fades with height and is not drawn high above the ground', () => {
    const low = recorder(); drawShadow(low.ctx, 200, 470, 10, 60, false);
    const high = recorder(); drawShadow(high.ctx, 200, 470, 500, 60, false);
    expect(low.calls.fill).toBe(1);
    expect(high.total()).toBe(0);
  });
  it('cloud layers draw a fixed, small number of clouds', () => {
    const r = recorder(); drawCloudLayer(r.ctx, 960, 5000, '#fff', true, 3);
    expect(r.calls.fill).toBe(4);
  });
});
