import { describe, expect, it } from 'vitest';
import { MISSIONS } from '../src/content';
import { GAME_AIRCRAFT } from '../src/content/reference';
import { TARGET_SECONDS, cruiseSpeed, extendMission, extendWaypoints, stageMessages } from '../src/content/extend';
import { validateMission } from '../src/content/validate';
import { fly } from './helpers/autopilot';

/** Missions the scripted autopilot cannot finish. They are reported, not hidden: a human can weave between the two birds that block it. */
const AUTOPILOT_LIMITS = ['m-free-sunset'];
const MIN_SECONDS = 120;

describe('round duration (scripted autopilot, not human playtesting)', () => {
  const flights = new Map(MISSIONS.map((m) => [m.id, fly(m, { maxSeconds: 700 })]));

  it.each(MISSIONS.map((m) => [m.id, m] as const))('%s: a clean flight lasts at least two minutes of active gameplay', (id, m) => {
    const f = flights.get(id)!;
    if (AUTOPILOT_LIMITS.includes(id)) return;
    expect(f.result?.success, `${id}: ${f.result?.reason}`).toBe(true);
    expect(f.seconds, `${id} (${m.tier})`).toBeGreaterThanOrEqual(MIN_SECONDS);
    expect(f.seconds, `${id} is not absurdly long`).toBeLessThanOrEqual(300);
  });

  it('wins at least 99 percent of missions and records the exceptions', () => {
    const won = MISSIONS.filter((m) => flights.get(m.id)!.result?.success).length;
    expect(won / MISSIONS.length).toBeGreaterThanOrEqual(0.99);
    for (const m of MISSIONS) if (!flights.get(m.id)!.result?.success) expect(AUTOPILOT_LIMITS).toContain(m.id);
  });

  it('active time excludes the pauses for decisions', () => {
    const m = MISSIONS.find((x) => (x.decisions?.length ?? 0) >= 2 && !AUTOPILOT_LIMITS.includes(x.id))!;
    const f = flights.get(m.id)!;
    expect(f.decisions).toBe(m.decisions!.length);
    expect(f.result!.time).toBeCloseTo(f.seconds, 5);
  });

  it('keeps every mission valid after lengthening', () => {
    for (const m of MISSIONS) expect(validateMission(m), m.id).toEqual([]);
  });
});

describe('lengthening a mission', () => {
  const sparrow = GAME_AIRCRAFT.find((a) => a.id === 'sparrow')!;
  const short = MISSIONS.find((m) => m.id === 'c-waypoint-route')!;

  it('keeps ids, aircraft and lessons, and only lengthens', () => {
    const base = { ...short, length: 6000, checkpoints: 5, parTime: 30 };
    const out = extendMission(base, sparrow.minKt, sparrow.maxKt);
    expect(out.id).toBe(base.id); expect(out.aircraftId).toBe(base.aircraftId); expect(out.lessonId).toBe(base.lessonId);
    expect(out.length).toBeGreaterThan(base.length);
    expect(out.parTime).toBeGreaterThan(base.parTime);
    expect(out.checkpoints).toBeLessThanOrEqual(20);
    // A mission that is already long enough keeps its length.
    const long = extendMission({ ...base, length: 90000 }, sparrow.minKt, sparrow.maxKt);
    expect(long.length).toBe(90000);
  });

  it('targets the tier duration at the default cruise speed', () => {
    for (const m of MISSIONS) {
      const ac = GAME_AIRCRAFT.find((a) => a.id === m.aircraftId)!;
      expect(m.length / cruiseSpeed(m, ac.minKt, ac.maxKt), m.id).toBeGreaterThanOrEqual(TARGET_SECONDS[m.tier] - 1);
    }
  });

  it('gives route missions one named waypoint per ring, ending on the planned track', () => {
    const wps = extendWaypoints([{ lat: 0, name: 'A' }, { lat: 50, name: 'B' }, { lat: -40, name: 'C' }], 7);
    expect(wps).toHaveLength(7);
    expect(wps.map((w) => w.name)).toEqual(['ALFA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO', 'FOXTROT', 'GOLF']);
    expect(wps[6].lat).toBe(0);
    for (const m of MISSIONS.filter((x) => x.lateral?.waypoints)) expect(m.lateral!.waypoints).toHaveLength(m.checkpoints);
  });

  it('adds the four stages without colliding with the existing messages', () => {
    for (const m of MISSIONS) {
      const msgs = m.messages ?? [];
      expect(msgs.length, m.id).toBeGreaterThanOrEqual(3);
      for (let i = 1; i < msgs.length; i++) expect(msgs[i].at - msgs[i - 1].at, `${m.id} messages ${i}`).toBeGreaterThanOrEqual(0);
    }
    const out = stageMessages({ ...short, messages: [{ at: 0.2, text: 'mine' }] });
    expect(out.filter((x) => Math.abs(x.at - 0.2) < 0.04)).toHaveLength(1);
    expect(out[out.length - 1].text).toMatch(/Final/);
  });
});
