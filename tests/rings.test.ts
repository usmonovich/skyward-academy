import { describe, expect, it } from 'vitest';
import type { MissionDef } from '../src/types';
import { MISSIONS } from '../src/content';
import { CEIL, RING_STYLE, buildLevel, type RingKind } from '../src/game/engine';
import { fly } from './helpers/autopilot';

describe('ring kinds', () => {
  const all = MISSIONS.flatMap((m) => buildLevel(m).gates.map((g) => ({ m, g })));

  it('gives every ring a kind and a bonus', () => {
    for (const { m, g } of all) { expect(RING_STYLE[g.kind], `${m.id}`).toBeDefined(); expect(g.value).toBeGreaterThan(0); }
  });

  it('uses every kind that the missions can produce, with the documented sizes and bonuses', () => {
    const by = (k: RingKind) => all.filter((x) => x.g.kind === k);
    expect(by('cloud').length).toBeGreaterThan(0);
    expect(by('gold').length).toBeGreaterThan(0);
    expect(by('precision').length).toBeGreaterThan(0);
    expect(by('nav').length).toBeGreaterThan(0);
    expect(by('special').length).toBeGreaterThan(0);
    for (const { g } of by('cloud')) { expect(g.r).toBe(48); expect(g.value).toBe(10); }
    for (const { g } of by('gold')) { expect(g.r).toBe(48); expect(g.value).toBe(50); }
    for (const { g } of by('precision')) { expect(g.r).toBeLessThan(48); expect(g.value).toBeGreaterThan(10); }
    for (const { g } of by('special')) { expect(g.r).toBeGreaterThan(48); expect(g.value).toBeGreaterThanOrEqual(100); }
  });

  it('follows the placement rules', () => {
    for (const m of MISSIONS) {
      const gates = buildLevel(m).gates;
      if (m.lateral?.waypoints) for (const g of gates) expect(g.kind, m.id).toBe('nav');
      else {
        gates.forEach((g, i) => { if ((i + 1) % 4 === 0 && i < gates.length - 1 && g.kind !== 'english') expect(g.kind, `${m.id} ring ${i + 1}`).toBe('gold'); });
        if (m.tier === 'Beginner') for (const g of gates) expect(g.kind, `${m.id} has no precision rings`).not.toBe('precision');
        const last = gates[gates.length - 1];
        if (last && !m.landing && (m.tier === 'Advanced' || m.tier === 'Expert')) expect(last.kind, `${m.id} ends on a special ring`).toBe('special');
        // Never a bonus or precision ring as the last ring of a landing mission.
        if (last && m.landing) expect(last.kind).toBe('cloud');
      }
    }
  });

  it('is deterministic and never moves a ring above the ceiling', () => {
    for (const m of MISSIONS.slice(0, 40)) {
      expect(buildLevel(m)).toEqual(buildLevel(m));
      for (const g of buildLevel(m).gates) expect(g.y - g.r, m.id).toBeGreaterThanOrEqual(CEIL);
    }
  });

  it('tells every kind apart by more than colour: each has its own outline pattern or glyph', () => {
    const kinds = Object.keys(RING_STYLE) as RingKind[];
    const signature = (k: RingKind) => `${RING_STYLE[k].dash.join(',')}|${RING_STYLE[k].glyph}`;
    expect(new Set(kinds.map(signature)).size).toBe(kinds.length);
    expect(new Set(kinds.map((k) => RING_STYLE[k].color)).size).toBe(kinds.length);
    for (const k of kinds) expect(RING_STYLE[k].blurb.length).toBeGreaterThan(20);
  });
});

describe('the visible opening is the scoring area', () => {
  // With no input the aircraft holds one height (260) for the whole flight, so every ring's result must be exactly
  // |260 - ring.y| <= ring.r, using that ring's own radius, whatever its kind. A ring drawn with an opening of radius r
  // therefore counts as hit exactly when the aircraft is inside that opening, and as missed when it is outside.
  const flat = (def: MissionDef): MissionDef => ({ ...def, obstacles: { density: 0, types: ['balloon'] }, wind: undefined, lateral: undefined, takeoff: false, landing: false, fuel: false, energy: false, decisions: undefined, goAround: undefined, speedBand: undefined, terrain: undefined });
  const sample = MISSIONS.filter((m, i) => i % 6 === 0).slice(0, 30);

  it.each(sample.map((m) => [m.id, m] as const))('%s: every ring counts exactly when the aircraft is inside its drawn opening', (_, m) => {
    const def = flat(m);
    const level = buildLevel(def);
    const f = fly(def, { mode: 'idle', maxSeconds: 700 });
    const states = f.result!.gateStates!;
    expect(states).toHaveLength(level.gates.length);
    level.gates.forEach((g, i) => { expect(states[i], `ring ${i + 1} (${g.kind}, y ${Math.round(g.y)}, r ${g.r})`).toBe(Math.abs(260 - g.y) <= g.r ? 'hit' : 'missed'); });
  });

  it('is not vacuous: across the sample there are rings of several kinds that were hit and rings that were missed', () => {
    const seen = new Set<string>();
    for (const m of sample) {
      const def = flat(m); const level = buildLevel(def);
      level.gates.forEach((g) => seen.add(`${g.kind}:${Math.abs(260 - g.y) <= g.r ? 'hit' : 'missed'}`));
    }
    expect(seen.has('cloud:hit') && seen.has('cloud:missed')).toBe(true);
    expect([...seen].some((x) => x.startsWith('precision') || x.startsWith('gold'))).toBe(true);
  });

  it('reports the bonus and the rings hit by kind', () => {
    const def = flat(MISSIONS.find((m) => m.id === 'm-cpl-wind')!);
    const r = fly({ ...def, tier: 'Advanced' }, { maxSeconds: 700 }).result!;
    expect(r.bonus).toBeGreaterThan(0);
    const total = Object.values(r.ringTypes!).reduce((n, v) => n + v!.total, 0);
    const hit = Object.values(r.ringTypes!).reduce((n, v) => n + v!.hit, 0);
    expect(total).toBe(r.total);
    expect(hit).toBe(r.checkpoints);
  });
});
