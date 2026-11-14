import { describe, expect, it } from 'vitest';
import type { MissionStats } from '../src/types';
import { allMissions } from '../src/content';
import { filterMissions, isOpen, nextMission, summarise, trackOf } from '../src/game/browse';
import { RANKS, rankFor, scoreMission, scoreParts } from '../src/engine/gamification';
import { freshProgress } from '../src/store/progress';

const missions = allMissions();
const fresh = () => freshProgress('t', 'T', true);

describe('mission browser', () => {
  it('assigns every mission to a track', () => {
    for (const m of missions) expect(['free', 'math', 'phys', 'ppl', 'cpl', 'atpl'], m.id).toContain(trackOf(m));
    expect(trackOf(missions.find((m) => m.id === 'm-atpl-mach')!)).toBe('atpl');
    expect(trackOf(missions.find((m) => !m.lessonId)!)).toBe('free');
  });

  it('filters by track, status, tier and text', () => {
    const p = fresh();
    const atpl = filterMissions(missions, p, { track: 'atpl' });
    expect(atpl.length).toBeGreaterThan(20);
    expect(atpl.every((m) => trackOf(m) === 'atpl')).toBe(true);
    expect(filterMissions(missions, p, { status: 'locked' }).every((m) => !isOpen(m, p))).toBe(true);
    expect(filterMissions(missions, p, { status: 'done' })).toHaveLength(0);
    expect(filterMissions(missions, p, { tier: 'Expert' }).every((m) => m.tier === 'Expert')).toBe(true);
    const hits = filterMissions(missions, p, { query: '  TCAS ' });
    expect(hits.length).toBeGreaterThan(0);
    expect(filterMissions(missions, p, { query: 'zzzz-no-such-mission' })).toHaveLength(0);
  });

  it('opens a lesson mission only once its lesson is passed, and tracks what has been flown', () => {
    const p = fresh();
    const m = missions.find((x) => x.lessonId === 'math-arithmetic')!;
    expect(isOpen(m, p)).toBe(false);
    p.lessons['math-arithmetic'] = { passed: true, best: 1, attempts: 1, at: 0 } as never;
    expect(isOpen(m, p)).toBe(true);
    expect(filterMissions(missions, p, { status: 'ready' })).toContain(m);
    p.missions[m.id] = { stars: 3, best: 950, at: 0 };
    expect(filterMissions(missions, p, { status: 'done' })).toEqual([m]);
    expect(filterMissions(missions, p, { status: 'ready' })).not.toContain(m);
    const s = summarise(missions, p);
    expect(s.flown).toBe(1);
    expect(s.threeStars).toBe(1);
    expect(s.total).toBe(missions.length);
    expect(s.open + s.locked).toBe(s.total);
  });

  it('suggests an unflown open mission, preferring lesson missions, and never the one just flown', () => {
    const p = fresh();
    const first = nextMission(missions, p);
    expect(first && isOpen(first, p)).toBeTruthy();
    p.lessons['math-arithmetic'] = { passed: true, best: 1, attempts: 1, at: 0 } as never;
    const next = nextMission(missions, p)!;
    expect(next.lessonId).toBe('math-arithmetic');
    p.missions[next.id] = { stars: 1, best: 500, at: 0 };
    expect(nextMission(missions, p, next.id)?.id).not.toBe(next.id);
  });
});

describe('score breakdown and ranks', () => {
  const base: MissionStats = { success: true, time: 30, checkpoints: 6, total: 6, hits: 0, decisionsCorrect: 0, decisionsTotal: 0, assisted: false };
  it('exposes the four parts that make up the score', () => {
    expect(scoreParts(40, base)).toEqual({ gates: 1, safety: 1, time: 1, objective: 1 });
    const s = { ...base, checkpoints: 3, hits: 1, time: 80, decisionsCorrect: 1, decisionsTotal: 2 };
    const parts = scoreParts(40, s);
    expect(parts.gates).toBeCloseTo(0.5);
    expect(parts.safety).toBeCloseTo(2 / 3);
    expect(parts.time).toBeCloseTo(0.5);
    expect(parts.objective).toBeCloseTo(0.5);
    expect(scoreMission(40, s).score).toBe(Math.round(1000 * (0.4 * parts.gates + 0.25 * parts.safety + 0.15 * parts.time + 0.2 * parts.objective)));
  });

  it('scales the ranks to the whole curriculum', () => {
    for (let i = 1; i < RANKS.length; i++) expect(RANKS[i].xp).toBeGreaterThan(RANKS[i - 1].xp);
    expect(rankFor(5500).name).not.toBe('Skyward Academy Master');
    expect(rankFor(28000).name).toBe('PPL Knowledge Graduate');
    expect(rankFor(50000).name).toBe('Skyward Academy Master');
  });
});
