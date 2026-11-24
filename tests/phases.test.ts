import { describe, expect, it } from 'vitest';
import { MISSIONS } from '../src/content';
import { GROUND, buildLevel } from '../src/game/engine';
import { approachStart, glideY, phaseAt, phasePlan, runwayOf, slopeLights, touchdownZone } from '../src/game/phases';
import { flightSummary } from '../src/components/MissionComplete';
import { fly } from './helpers/autopilot';

const full = MISSIONS.filter((m) => m.takeoff && m.landing && !m.goAround && !m.lateral);
const landers = MISSIONS.filter((m) => m.landing && !m.goAround && !m.lateral);

describe('flight phase plan (reusable, from mission data)', () => {
  it('a mission with a runway at each end has every phase, in order', () => {
    expect(full.length).toBeGreaterThan(5);
    expect(phasePlan(full[0])).toEqual(['preflight', 'takeoff', 'climb', 'cruise', 'approach', 'landing', 'complete']);
  });
  it('missions that start airborne or end at a finish line skip the phases they do not need', () => {
    const airborne = MISSIONS.find((m) => !m.takeoff && !m.landing)!;
    expect(phasePlan(airborne)).toEqual(['preflight', 'cruise', 'complete']);
    const arrive = MISSIONS.find((m) => !m.takeoff && m.landing)!;
    expect(phasePlan(arrive)).toEqual(['preflight', 'cruise', 'approach', 'landing', 'complete']);
  });
  it('phaseAt follows the aircraft along the route', () => {
    const m = full[0]; const rw = runwayOf(m); const ap = approachStart(m);
    const at = (wx: number, extra: Partial<Parameters<typeof phaseAt>[1]> = {}) => phaseAt(m, { wx, onGround: false, airborneAt: 900, rollout: false, ended: false, approachFrom: ap, ...extra });
    expect(at(400, { onGround: true, airborneAt: null })).toBe('takeoff');
    expect(at(1500)).toBe('climb');
    expect(at(4000)).toBe('cruise');
    expect(at(ap + 10)).toBe('approach');
    expect(at(rw.start - 100)).toBe('landing');
    expect(at(rw.start + 300, { rollout: true })).toBe('landing');
    expect(at(rw.start + 300, { ended: true })).toBe('complete');
  });
});

describe('approach guidance', () => {
  it('rings inside the approach sit on the glide path, unless that would flatten the route', () => {
    let aligned = 0;
    for (const m of landers) {
      const gates = buildLevel(m).gates.filter((g) => g.x >= approachStart(m));
      if (gates.length && gates.every((g) => Math.abs(g.y - Math.max(95, glideY(m, g.x, GROUND - 14))) < 0.5)) aligned++;
    }
    expect(aligned).toBeGreaterThan(landers.length * 0.5);
  });
  it('slope lights: two white is on the path, more white is high, more red is low', () => {
    expect(slopeLights(0)).toBe(2);
    expect(slopeLights(30)).toBe(3); expect(slopeLights(80)).toBe(4);
    expect(slopeLights(-30)).toBe(1); expect(slopeLights(-80)).toBe(0);
  });
  it('the first third of the runway is the touchdown zone', () => {
    const m = landers[0]; const rw = runwayOf(m);
    expect(touchdownZone(m, rw.start + 100)).toBe('in');
    expect(touchdownZone(m, rw.start + 700)).toBe('long');
  });
});

describe('flown phases (scripted autopilot, not human playtesting)', () => {
  it('a full flight records take-off, climb, cruise, approach and landing, a stable approach and the touchdown zone', () => {
    for (const m of full.slice(0, 4)) {
      const r = fly(m).result!;
      expect(r.success, m.id).toBe(true);
      expect(r.phases, m.id).toEqual(['takeoff', 'climb', 'cruise', 'approach', 'landing']);
      expect(r.approach!.stability, m.id).toBeGreaterThan(0.5);
      expect(r.touchdownZone, m.id).toBeDefined();
      const rows = Object.fromEntries(flightSummary(r).map((x) => [x.label, x.value]));
      expect(rows['Flight phases']).toBe('Take-off › Climb › Cruise › Approach › Landing');
      expect(rows.Approach).toMatch(/% stable/);
    }
  });

  it('the pilot can go around on the approach, fly it again and still land; it is counted and limited to two', () => {
    const m = landers.find((x) => x.tier !== 'Beginner') ?? landers[0];
    let calls = 0; let refusedInCruise: boolean | null = null; let backTo = 0;
    const r = fly(m, {
      onStep: (g, s) => {
        if (s.phase === 'cruise' && refusedInCruise === null && s.worldX > 1000) refusedInCruise = !g.goAround();
        if (s.phase === 'approach' && calls === 0) { const before = s.worldX; expect(g.goAround()).toBe(true); backTo = before - g.snapshot().worldX; calls++; }
      },
    }).result!;
    expect(refusedInCruise).toBe(true);
    expect(backTo).toBeGreaterThan(600);
    expect(r.success).toBe(true);
    expect(r.approach!.goArounds).toBe(1);
  });

  it('missions with an ordered go-around keep their own rule and do not offer the pilot go-around', () => {
    const m = MISSIONS.find((x) => x.goAround)!;
    let offered = false;
    fly(m, { onStep: (g, s) => { if (s.phase === 'approach' && !offered) offered = g.goAround(); } });
    expect(offered).toBe(false);
  });
});
