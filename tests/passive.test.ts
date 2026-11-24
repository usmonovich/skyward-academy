import { describe, expect, it } from 'vitest';
import { MISSIONS } from '../src/content';
import { buildLevel, needRings } from '../src/game/engine';
import { headless } from './helpers/autopilot';
import type { MissionDef, MissionResult } from '../src/types';

/** Holds one height for the whole flight and nudges the power: the most a passive player can do. */
function hold(def: MissionDef, height: number | null, assisted: boolean): MissionResult | undefined {
  const { g, result } = headless(def, { assisted });
  for (let i = 0; i < 700 * 60 && !result(); i++) {
    const s = g.snapshot();
    if (s.state === 'ended') break;
    if (height !== null) g.setInput({ x: s.kt < 100 ? 0.4 : 0, y: Math.max(-1, Math.min(1, (height - s.y) / 35)) });
    g.step(1 / 60);
  }
  g.destroy();
  return result();
}

describe('passive completion (scripted checks, not human playtesting)', () => {
  it('needs 65 percent of the rings, or 50 percent in assisted mode', () => {
    expect(needRings(20, false)).toBe(13);
    expect(needRings(20, true)).toBe(10);
    expect(needRings(15, false)).toBe(10);
  });

  it('no mission can be completed with no input at all, with or without assisted mode', () => {
    const done: string[] = [];
    for (const m of MISSIONS) for (const assisted of [false, true]) if (hold(m, null, assisted)?.success) done.push(`${m.id}${assisted ? ' (assisted)' : ''}`);
    expect(done).toEqual([]);
  });

  it('no mission can be completed by holding one height, whichever height is held', () => {
    const done: string[] = [];
    for (const m of MISSIONS) for (const h of [120, 190, 260, 330, 390]) if (hold(m, h, false)?.success) done.push(`${m.id}@${h}`);
    expect(done).toEqual([]);
  });

  it('no single height holds enough rings to reach the 65 percent needed, on any mission that has a spread', () => {
    for (const m of MISSIONS.filter((x) => !x.lateral && !x.stormDrift)) {
      const gates = buildLevel(m).gates;
      if (gates.length < 4) continue;
      let best = 0;
      for (let h = 95; h <= 400; h += 5) best = Math.max(best, gates.filter((g) => Math.abs(g.y - h) <= 56).length);
      expect(best / gates.length, m.id).toBeLessThan(0.62);
    }
  });

  it('the result says why a flight that reached the finish did not count', () => {
    const m = MISSIONS.find((x) => x.id === 'm-math-units')!;
    const r = hold(m, null, true)!;
    expect(r.success).toBe(false);
    expect(r.reason).toMatch(/rings collected/);
  });
});
