import { describe, expect, it } from 'vitest';
import { MISSIONS } from '../src/content';
import { CEIL, GROUND, buildLevel, debrief, terrainHeight } from '../src/game/engine';

describe('mission level generation', () => {
  it.each(MISSIONS.map((m) => [m.id, m] as const))('%s builds a fair, deterministic level', (_, def) => {
    const a = buildLevel(def);
    const b = buildLevel(def);
    expect(a).toEqual(b);
    expect(a.gates).toHaveLength(def.checkpoints);
    for (const g of a.gates) {
      expect(g.y - g.r).toBeGreaterThanOrEqual(CEIL);
      expect(g.y + 40, 'gate centre clears the terrain').toBeLessThan(GROUND - terrainHeight(def, g.x));
      expect(g.x).toBeLessThan(def.length - 400);
    }
    for (let i = 1; i < a.gates.length; i++) expect(a.gates[i].x).toBeGreaterThan(a.gates[i - 1].x);
    for (const o of a.obstacles) {
      expect(a.gates.some((g) => Math.abs(g.x - o.x) < 190 && Math.abs(g.y - o.y) < 125), 'no obstacle blocks a gate').toBe(false);
      if (def.landing) expect(o.x).toBeLessThan(a.runwayStart);
    }
    if (def.obstacles.density > 0) expect(a.obstacles.length).toBeGreaterThan(0);
  });
  it('keeps runways and the start area flat', () => {
    const def = MISSIONS.find((m) => m.terrain)!;
    expect(terrainHeight(def, 0)).toBe(0);
    expect(terrainHeight(def, 600)).toBe(0);
    expect(terrainHeight(def, def.length - 1000)).toBe(0);
    expect(Math.max(...Array.from({ length: 200 }, (_, i) => terrainHeight(def, 1000 + i * 40)))).toBeGreaterThan(40);
    expect(terrainHeight(MISSIONS[0], 3000)).toBe(0);
  });
  it('writes a debrief for success and failure', () => {
    const def = MISSIONS.find((m) => m.id === 'm-phys-pressure')!;
    const ok = debrief(def, { success: true, time: 40, checkpoints: 7, total: 7, hits: 0, decisionsCorrect: 0, decisionsTotal: 0, assisted: false, score: 990, stars: 3 });
    expect(ok.join(' ')).toMatch(/All 7 gates/);
    expect(ok[ok.length - 1]).toMatch(/Learning outcome/);
    const fail = debrief(def, { success: false, reason: 'Ground contact.', time: 5, checkpoints: 0, total: 7, hits: 0, decisionsCorrect: 0, decisionsTotal: 0, assisted: false, score: 0, stars: 0 });
    expect(fail[0]).toBe('Ground contact.');
  });
});

describe('altitude display scale', () => {
  const scaled = MISSIONS.filter((m) => m.altScale !== undefined);
  it('is only used by high-altitude missions and is never a near-1 value', () => {
    expect(scaled.length).toBeGreaterThan(20);
    for (const m of scaled) expect(m.altScale, m.id).toBeGreaterThanOrEqual(10);
  });
  it.each(scaled.map((m) => [m.id, m] as const))('%s shows a believable cruise altitude and pressure at every gate', (_, def) => {
    const ceilingFt = (GROUND - CEIL - 14) * (def.altScale ?? 10);
    expect(ceilingFt).toBeGreaterThan(25000);
    expect(ceilingFt).toBeLessThan(40000);
    for (const g of buildLevel(def).gates) {
      const ft = (GROUND - g.y - 14) * (def.altScale ?? 10);
      expect(ft).toBeGreaterThan(0);
      expect(ft).toBeLessThanOrEqual(ceilingFt);
    }
  });
});
