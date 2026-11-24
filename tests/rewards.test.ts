import { beforeEach, describe, expect, it } from 'vitest';
import type { MissionResult } from '../src/types';
import { MISSIONS } from '../src/content';
import { XP, scoreMission } from '../src/engine/gamification';
import { DAILY_XP_CAP, __resetStore, actions, getProgress } from '../src/store/progress';
import { headless } from './helpers/autopilot';

const byId = (id: string) => MISSIONS.find((m) => m.id === id)!;

describe('three stars need excellent flying', () => {
  const clean = { success: true, time: 30, checkpoints: 20, total: 20, hits: 0, decisionsCorrect: 0, decisionsTotal: 0, assisted: false };
  it('a perfect flight earns three stars', () => expect(scoreMission(40, clean).stars).toBe(3));
  it('collecting fewer than 90 percent of the rings caps the flight at two stars, even with a high score', () => {
    const r = scoreMission(40, { ...clean, checkpoints: 17 });
    expect(r.score).toBeGreaterThanOrEqual(850);
    expect(r.stars).toBe(2);
  });
  it('more than one contact caps it at two stars', () => {
    expect(scoreMission(40, { ...clean, hits: 1 }).stars).toBe(3);
    expect(scoreMission(40, { ...clean, hits: 2 }).stars).toBeLessThanOrEqual(2);
  });
  it('a failed flight earns nothing', () => expect(scoreMission(40, { ...clean, success: false })).toEqual({ score: 0, stars: 0 }));
});

describe('boosters do not guarantee success', () => {
  it('holding every kind of booster and flying with no input still fails every mission sampled', () => {
    for (const m of MISSIONS.filter((_, i) => i % 5 === 0)) {
      const { g, result } = headless(m, { startBoosters: ['shield', 'assist', 'slow'] });
      for (let i = 0; i < 700 * 60 && !result(); i++) {
        const s = g.snapshot();
        if (s.state === 'ended') break;
        if (i % 600 === 5) { g.activateBooster(0); g.activateBooster(1); g.activateBooster(2); }
        g.step(1 / 60);
      }
      g.destroy();
      expect(result()?.success, m.id).not.toBe(true);
    }
  });
});

describe('repeated play cannot farm XP', () => {
  beforeEach(() => __resetStore());
  const win = (stars: number, score: number): MissionResult => ({ success: true, time: 130, checkpoints: 20, total: 20, hits: 0, decisionsCorrect: 0, decisionsTotal: 0, assisted: false, score, stars });
  const def = byId('m-math-units');
  // The one-off daily challenge bonus depends on the date (some days it is "review 10 cards"); it is paid once, not farmed.
  const dailyBonus = () => (getProgress().daily.claimed ? XP.daily : 0);

  it('replaying a mission at the same rating pays nothing, and a better rating pays only the difference', () => {
    const first = actions.mission(def, win(1, 500));
    expect(first).toBe(def.xp + 25);
    expect(actions.mission(def, win(1, 520))).toBe(0);
    expect(actions.mission(def, win(3, 950))).toBe(50);
    expect(actions.mission(def, win(3, 990))).toBe(0);
    expect(actions.mission(def, win(2, 700))).toBe(0);
  });

  it('a failed flight pays nothing', () => {
    expect(actions.mission(def, { ...win(0, 0), success: false })).toBe(0);
  });

  it('exam answers pay XP only up to a daily limit', () => {
    const before = getProgress().xp;
    for (let i = 0; i < 20; i++) actions.exam({ correct: 20, total: 20 } as never);
    expect(getProgress().xp - before - dailyBonus()).toBe(DAILY_XP_CAP.exam);
  });

  it('card reviews pay XP only up to a daily limit', () => {
    const before = getProgress().xp;
    for (let i = 0; i < 100; i++) actions.reviewCard('any-term', 5);
    expect(getProgress().xp - before - dailyBonus()).toBe(DAILY_XP_CAP.card);
  });

  it('lesson XP is paid once, and the perfect bonus once', () => {
    const a = actions.assessment('math-units', 1, true);
    expect(a).toBeGreaterThan(0);
    expect(actions.assessment('math-units', 1, true)).toBe(0);
  });
});
