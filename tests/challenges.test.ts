import { describe, expect, it } from 'vitest';
import { MISSIONS, findLesson } from '../src/content';
import { GAME_AIRCRAFT } from '../src/content/reference';
import { CHALLENGES } from '../src/content/challenges';
import { GROUND, buildLevel } from '../src/game/engine';
import { approachStart, glideY } from '../src/game/phases';
import { filterMissions, firstUnmet, gateLessons, isOpen, nextMission, trackOf } from '../src/game/browse';
import { freshProgress } from '../src/store/progress';

describe('challenge missions: content', () => {
  it('adds twelve challenges covering every requested mission type', () => {
    expect(CHALLENGES).toHaveLength(12);
    const has = (f: (m: (typeof CHALLENGES)[number]) => boolean) => CHALLENGES.some(f);
    expect(has((m) => !!m.lateral?.runwayHalf && !!m.landing), 'crosswind landing').toBe(true);
    expect(has((m) => !!m.lateral?.waypoints), 'navigation checkpoints').toBe(true);
    expect(has((m) => !!m.lateral && !m.landing && !m.lateral.waypoints), 'wind compensation').toBe(true);
    expect(has((m) => !!m.fuel), 'fuel management').toBe(true);
    expect(has((m) => !!m.stormDrift), 'weather avoidance').toBe(true);
    expect(has((m) => !!m.goAround), 'go-around').toBe(true);
  });

  it.each(CHALLENGES.map((m) => [m.id, m] as const))('%s names its concept, its prerequisite lessons and its simplifications', (_, m) => {
    expect(MISSIONS.some((x) => x.id === m.id)).toBe(true);
    expect(m.lessonId).toBeUndefined();
    expect(m.concept!.length).toBeGreaterThan(30);
    expect(m.requires!.length).toBeGreaterThan(0);
    for (const id of m.requires!) expect(findLesson(id), `${m.id} requires ${id}`).toBeDefined();
    expect(GAME_AIRCRAFT.some((a) => a.id === m.aircraftId)).toBe(true);
    expect(m.style).toBe('Educational simulation');
    // Anything with a sideways wind says it is an approximation, and decision scenarios say they are not procedures.
    if (m.lateral) expect(m.briefing).toMatch(/Educational approximation/);
    if (m.goAround || m.stormDrift) expect(m.briefing).toMatch(/Educational scenario|simplified|Educational/i);
  });

  it.each(CHALLENGES.map((m) => [m.id, m] as const))('%s is internally consistent', (_, m) => {
    const L = m.lateral;
    if (L) {
      expect(L.tol).toBeGreaterThan(10); expect(L.tol).toBeLessThan(40);
      if (L.waypoints) { expect(L.waypoints).toHaveLength(m.checkpoints); for (const w of L.waypoints) { expect(Math.abs(w.lat)).toBeLessThan(80); expect(w.name.length).toBeGreaterThan(2); } }
      if (L.runwayHalf !== undefined) { expect(m.landing).toBe(true); expect(L.runwayHalf).toBeLessThan(L.tol); }
    }
    if (m.goAround) { expect(m.landing).toBe(true); expect(m.goAround.at).toBeGreaterThan(300); }
    // Landing missions need a fair approach: the last gate must leave room to descend to the runway.
    // A last ring on the glide path (the approach fix) is a fair descent by construction.
    if (m.landing) { const l = buildLevel(m); const last = l.gates[l.gates.length - 1]; const onGlide = last.x >= approachStart(m) && Math.abs(last.y - glideY(m, last.x, GROUND - 14)) < 0.5; expect(onGlide || last.y > 260, 'last gate leaves a descent to the runway').toBe(true); }
  });

});

describe('challenge missions: unlocking', () => {
  const p = () => freshProgress('t', 'T', true);
  const passAll = (pr: ReturnType<typeof p>, ids: string[]) => { for (const id of ids) pr.lessons[id] = { passed: true, best: 1, attempts: 1 }; };

  it('opens only when every required lesson is passed, and says which one is missing', () => {
    const m = CHALLENGES.find((c) => c.id === 'c-wind-correction')!;
    expect(gateLessons(m)).toEqual(m.requires);
    const pr = p();
    expect(isOpen(m, pr)).toBe(false);
    expect(firstUnmet(m, pr)).toBe(m.requires![0]);
    passAll(pr, [m.requires![0]]);
    expect(isOpen(m, pr)).toBe(false);
    expect(firstUnmet(m, pr)).toBe(m.requires![1]);
    passAll(pr, m.requires!);
    expect(isOpen(m, pr)).toBe(true);
    expect(firstUnmet(m, pr)).toBeUndefined();
  });

  it('lesson missions still open with their own lesson', () => {
    const m = MISSIONS.find((x) => x.lessonId === 'math-arithmetic')!;
    const pr = p();
    expect(isOpen(m, pr)).toBe(false);
    passAll(pr, ['math-arithmetic']);
    expect(isOpen(m, pr)).toBe(true);
  });

  it('files a challenge under the track of its first required lesson', () => {
    expect(trackOf(CHALLENGES.find((c) => c.id === 'c-hold-track')!)).toBe('ppl');
    expect(trackOf(CHALLENGES.find((c) => c.id === 'c-alternate-or-continue')!)).toBe('cpl');
    const pr = p();
    expect(filterMissions(MISSIONS, pr, { track: 'cpl' }).some((m) => m.id === 'c-alternate-or-continue')).toBe(true);
  });

  it('suggests a challenge once it is open', () => {
    const pr = p();
    passAll(pr, ['ppl-wind-and-turbulence']);
    const ready = filterMissions(MISSIONS, pr, { status: 'ready' });
    expect(ready.some((m) => m.id === 'c-crosswind-landing')).toBe(true);
    expect(nextMission(MISSIONS, pr)).toBeDefined();
  });
});
