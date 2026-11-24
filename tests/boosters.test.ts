import { describe, expect, it } from 'vitest';
import type { MissionDef } from '../src/types';
import { MISSIONS } from '../src/content';
import { BOOSTERS, GROUND, MAX_ACTIVE, MAX_HELD, PLANE_X, buildLevel, terrainHeight, type BoosterKind } from '../src/game/engine';
import { fly, headless } from './helpers/autopilot';

const base = MISSIONS.find((m) => m.id === 'm-math-units')!;
/** A plain mission: no hazards, wind or take-off, so each booster can be tested on its own. */
const calm = (over: Partial<MissionDef> = {}): MissionDef => ({ ...base, obstacles: { density: 0, types: ['balloon'] }, wind: undefined, lateral: undefined, takeoff: false, landing: false, fuel: false, ...over });
const run = (g: { step(dt: number): void }, seconds: number) => { for (let i = 0; i < seconds * 60; i++) g.step(1 / 60); };

describe('booster pickups in the level', () => {
  const kinds = new Set<BoosterKind>();
  it('puts a handful of pickups on every route, clear of rings and hazards, at reachable heights', () => {
    for (const m of MISSIONS) {
      const l = buildLevel(m);
      expect(l.pickups.length, m.id).toBeGreaterThanOrEqual(2);
      expect(l.pickups.length, m.id).toBeLessThanOrEqual(8);
      for (const p of l.pickups) {
        kinds.add(p.kind);
        expect(BOOSTERS[p.kind]).toBeDefined();
        expect(p.y, m.id).toBeGreaterThanOrEqual(110);
        expect(p.y, m.id).toBeLessThanOrEqual(GROUND - terrainHeight(m, p.x) - 100);
        expect(p.taken).toBe(false);
        if (m.landing) expect(p.x, m.id).toBeLessThan(l.runwayStart);
      }
      for (let i = 1; i < l.pickups.length; i++) expect(l.pickups[i].x, m.id).toBeGreaterThan(l.pickups[i - 1].x);
    }
  });
  it('uses every booster kind somewhere, and is deterministic', () => {
    for (const k of Object.keys(BOOSTERS) as BoosterKind[]) expect(kinds.has(k), k).toBe(true);
    expect(buildLevel(base).pickups).toEqual(buildLevel(base).pickups);
  });
  it('explains every booster and labels it as an arcade mechanic in the messages it shows', () => {
    for (const [k, b] of Object.entries(BOOSTERS)) { expect(b.blurb.length, k).toBeGreaterThan(30); expect(b.name.length).toBeGreaterThan(2); }
    const { g, messages } = headless(calm(), { startBoosters: ['shield'] });
    g.activateBooster(0);
    expect(messages.join(' ')).toMatch(/Arcade booster/);
  });
  it('has pickups that are visually distinct: each kind has its own colour and letter', () => {
    const list = Object.values(BOOSTERS);
    expect(new Set(list.map((b) => b.color)).size).toBe(list.length);
    expect(new Set(list.map((b) => b.short)).size).toBe(list.length);
  });
});

describe('inventory and activation rules', () => {
  it('holds at most three, activates at most two at once, and refuses a booster that is already running', () => {
    const { g } = headless(calm(), { startBoosters: ['shield', 'slow', 'multiplier', 'magnet'] });
    expect(g.boosters().held).toHaveLength(MAX_HELD);
    expect(g.activateBooster(0)).toBe(true);
    expect(g.activateBooster(0)).toBe(true);
    expect(g.boosters().active).toHaveLength(MAX_ACTIVE);
    expect(g.activateBooster(0)).toBe(false);
    expect(g.boosters().held).toHaveLength(1);
  });
  it('ignores an empty slot', () => { const { g } = headless(calm()); expect(g.activateBooster(0)).toBe(false); });
  it('counts down in real time, expires, and then enforces the cooldown', () => {
    const { g } = headless(calm(), { startBoosters: ['multiplier', 'multiplier'] });
    g.activateBooster(0);
    const total = BOOSTERS.multiplier.duration;
    run(g, 5);
    expect(g.boosters().active[0].left).toBeCloseTo(total - 5, 0);
    run(g, total - 5 + 0.5);
    expect(g.boosters().active).toHaveLength(0);
    expect(g.boosters().cooldown.multiplier).toBeGreaterThan(0);
    expect(g.activateBooster(0)).toBe(false); // cooling down
    run(g, BOOSTERS.multiplier.cooldown + 0.5);
    expect(g.boosters().cooldown.multiplier).toBeUndefined();
    expect(g.activateBooster(0)).toBe(true);
  });
  it('does not count paused time, so pause and resume are safe', () => {
    const { g } = headless(calm(), { startBoosters: ['assist'] });
    g.activateBooster(0); run(g, 2);
    const left = g.boosters().active[0].left;
    g.pause(); run(g, 30);
    expect(g.boosters().active[0].left).toBe(left);
    g.resume(); run(g, 1);
    expect(g.boosters().active[0].left).toBeLessThan(left);
  });
  it('rejects activation while paused', () => {
    const { g } = headless(calm(), { startBoosters: ['shield'] });
    g.pause();
    expect(g.activateBooster(0)).toBe(false);
  });
});

describe('what each booster does', () => {
  it('shield: absorbs one minor contact, but never a storm', () => {
    const through = (types: ('balloon' | 'storm')[], boosters: BoosterKind[]) => {
      const def = calm({ obstacles: { density: 2, types } });
      // The nearest obstacle that a straight flight at height 260 would hit (the list is not sorted by distance).
      const ob = buildLevel(def).obstacles.filter((o) => Math.abs(o.y - 260) < o.r + 5).sort((p, q) => p.x - q.x)[0];
      expect(ob, 'an obstacle on the straight path').toBeDefined();
      const h = headless(def, { startBoosters: boosters });
      for (let i = 0; i < 60 * 120; i++) {
        const s = h.g.snapshot();
        if (boosters.length && h.g.boosters().held.length && s.worldX + PLANE_X > ob!.x - 900) h.g.activateBooster(0);
        if (s.worldX + PLANE_X > ob!.x + 120) break;
        h.g.step(1 / 60);
      }
      return h;
    };
    const plain = through(['balloon'], []);
    const shielded = through(['balloon'], ['shield']);
    expect(plain.g.snapshot().hits).toBeGreaterThan(0);
    expect(shielded.messages.join(' ')).toMatch(/Shield absorbed/);
    expect(shielded.g.boosters().active.some((a) => a.kind === 'shield')).toBe(false); // used up by the contact
    expect(shielded.g.snapshot().hits).toBe(0);
    const storm = through(['storm'], ['shield']);
    expect(storm.messages.join(' ')).not.toMatch(/Shield absorbed/);
    expect(storm.g.snapshot().hits).toBeGreaterThan(0);
  });

  it('time slow: the world moves at 60 percent for 8 seconds, then returns to normal', () => {
    const a = headless(calm()); run(a.g, 6);
    const b = headless(calm(), { startBoosters: ['slow'] }); b.g.activateBooster(0); run(b.g, 6);
    expect(b.g.snapshot().worldX / a.g.snapshot().worldX).toBeCloseTo(0.6, 1);
    run(b.g, 4); // 8 s of slow have passed in total
    const before = b.g.snapshot().worldX; run(b.g, 2);
    const normal = headless(calm()); run(normal.g, 10); const n0 = normal.g.snapshot().worldX; run(normal.g, 2);
    expect((b.g.snapshot().worldX - before) / (normal.g.snapshot().worldX - n0)).toBeGreaterThan(0.95);
  });

  it('speed boost: faster over the ground, with a steering trade-off', () => {
    const a = headless(calm()); run(a.g, 4);
    const b = headless(calm(), { startBoosters: ['speed'] }); b.g.activateBooster(0); run(b.g, 4);
    expect(b.g.snapshot().worldX / a.g.snapshot().worldX).toBeCloseTo(1.35, 1);
    // Same pull-up for half a second: the boosted aircraft climbs less.
    const climb = (boost: boolean) => { const h = headless(calm(), { startBoosters: boost ? ['speed'] : [] }); if (boost) h.g.activateBooster(0); const y0 = h.g.snapshot().y; h.g.setInput({ y: -1 }); run(h.g, 0.5); return y0 - h.g.snapshot().y; };
    expect(climb(true)).toBeLessThan(climb(false));
  });

  it('score multiplier: doubles ring bonus while it runs, and only the bonus', () => {
    const def = calm({ checkpoints: 8 });
    const first = buildLevel(def).gates[0];
    const flyTo = (boost: boolean) => {
      const h = headless(def, { startBoosters: boost ? ['multiplier'] : [] });
      let activated = !boost;
      for (let i = 0; i < 60 * 80 && h.g.snapshot().gates < 1; i++) {
        const s = h.g.snapshot();
        if (!activated && s.worldX + PLANE_X > first.x - 1500) { h.g.activateBooster(0); activated = true; }
        h.g.setInput({ y: Math.max(-1, Math.min(1, (first.y - s.y) / 30)) }); h.g.step(1 / 60);
      }
      return h.g.snapshot();
    };
    const plain = flyTo(false); const boosted = flyTo(true);
    expect(plain.gates).toBe(1); expect(boosted.gates).toBe(1);
    expect(plain.bonus).toBe(first.value);
    expect(boosted.bonus).toBe(first.value * 2);
  });

  it('ring magnet: widens golden rings only, so an otherwise missed gold ring counts but a compulsory ring does not', () => {
    const def = calm({ checkpoints: 8 });
    const gates = buildLevel(def).gates;
    const gold = gates.find((g) => g.kind === 'gold')!;
    const cloud = gates.find((g) => g.kind === 'cloud')!;
    // Hold a height 1.25 radii above the ring centre: outside a normal ring (r), inside a magnet-widened golden ring (1.4 r).
    const bonusAfter = (target: typeof gold, magnet: boolean) => {
      const h = headless(def, { startBoosters: magnet ? ['magnet'] : [] });
      let on = !magnet;
      for (let i = 0; i < 60 * 200; i++) {
        const s = h.g.snapshot(); const wx = s.worldX + PLANE_X;
        if (!on && wx > target.x - 1200) { h.g.activateBooster(0); on = true; }
        if (wx > target.x + 80) break;
        h.g.setInput({ y: Math.max(-1, Math.min(1, ((target.y - 1.25 * target.r) - s.y) / 25)) });
        h.g.step(1 / 60);
      }
      return h.g.snapshot().bonus;
    };
    expect(bonusAfter(gold, true) - bonusAfter(gold, false)).toBe(gold.value);
    expect(bonusAfter(cloud, true)).toBe(bonusAfter(cloud, false)); // a compulsory ring gets no help
    expect(BOOSTERS.magnet.blurb).toMatch(/never helps/i);
  });

  it('precision assist: nudges towards the next ring but cannot win a mission on its own', () => {
    const def = calm({ checkpoints: 8 });
    const first = buildLevel(def).gates[0];
    const drift = (assist: boolean) => { const h = headless(def, { startBoosters: assist ? ['assist'] : [] }); if (assist) h.g.activateBooster(0); run(h.g, 3); return Math.abs(h.g.snapshot().y - first.y); };
    expect(drift(true)).toBeLessThan(drift(false));
    const idle = fly(def, { mode: 'idle' }); // sanity: without boosters an idle flight misses rings
    expect(idle.result!.checkpoints).toBeLessThan(idle.result!.total);
    const h = headless(def, { startBoosters: ['assist'] }); h.g.activateBooster(0);
    for (let i = 0; i < 60 * 400 && !h.result(); i++) h.g.step(1 / 60);
    expect(h.result()!.checkpoints).toBeLessThan(h.result()!.total); // only 10 s of gentle help, then the aircraft flies straight on
  });

  it('recovery: brings back a contact light after a minor mistake, and is refused when there is nothing to recover', () => {
    const rough = calm({ obstacles: { density: 2, types: ['balloon'] } });
    const h = headless(rough, { startBoosters: ['recovery'] });
    expect(h.g.activateBooster(0)).toBe(false);
    expect(h.g.boosters().held).toEqual(['recovery']); // not consumed
    for (let i = 0; i < 60 * 40 && h.g.snapshot().strikes === 0; i++) h.g.step(1 / 60);
    expect(h.g.snapshot().strikes).toBe(1);
    expect(h.g.activateBooster(0)).toBe(true);
    expect(h.g.snapshot().strikes).toBe(0);
    expect(h.g.snapshot().hits).toBe(1); // the contact is still counted for the score
  });

  it('bonus XP token: reported at the end of the flight', () => {
    const def = calm();
    const h = headless(def);
    const pk = buildLevel(def).pickups.find((p) => p.kind === 'xp');
    if (!pk) return; // this mission has none: covered by the level test
    for (let i = 0; i < 60 * 200; i++) { const s = h.g.snapshot(); if (s.worldX + PLANE_X > pk.x + 60) break; h.g.setInput({ y: Math.max(-1, Math.min(1, (pk.y - s.y) / 25)) }); h.g.step(1 / 60); }
    expect(h.g.boosters().xpTokens).toBe(1);
  });
});

describe('balance and educational integrity', () => {
  it('does not make failure impossible: ground contact still ends a flight with every booster active', () => {
    const h = headless(calm(), { startBoosters: ['shield', 'slow', 'assist'] });
    h.g.activateBooster(0); h.g.activateBooster(0);
    h.g.setInput({ y: 1 });
    for (let i = 0; i < 60 * 30 && !h.result(); i++) h.g.step(1 / 60);
    expect(h.result()?.success).toBe(false);
    expect(h.result()?.reason).toMatch(/Ground contact/);
  });
  it('reports what was collected and used', () => {
    const h = headless(calm(), { startBoosters: ['multiplier'] });
    h.g.activateBooster(0);
    h.g.setInput({ y: 1 });
    for (let i = 0; i < 60 * 30 && !h.result(); i++) h.g.step(1 / 60);
    expect(h.result()!.boosters!.used.multiplier).toBe(1);
  });
});
