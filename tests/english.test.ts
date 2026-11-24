import { beforeEach, describe, expect, it } from 'vitest';
import type { MissionDef, MissionResult } from '../src/types';
import { EN_EXERCISES, MISSIONS } from '../src/content';
import { firstUnmetEnglish, isOpen, trackOf } from '../src/game/browse';
import { __resetStore, actions, freshProgress, getProgress } from '../src/store/progress';
import { fly } from './helpers/autopilot';

const english = MISSIONS.filter((m) => m.requiresEnglish);
const byId = (id: string) => MISSIONS.find((m) => m.id === id)!;

describe('Aviation English reward flights', () => {
  it('has one flight per exercise, unlocked by that exercise', () => {
    expect(english).toHaveLength(EN_EXERCISES.length);
    for (const ex of EN_EXERCISES) {
      const m = english.find((x) => x.requiresEnglish!.includes(ex.id));
      expect(m, ex.id).toBeDefined();
      expect(m!.id).toBe(`e-${ex.id.replace(/^en-/, '')}`);
      expect(trackOf(m!)).toBe('english');
      expect(m!.briefing).toMatch(/no questions in the air/);
    }
  });

  it('opens only when the exercise is passed (60 percent or more)', () => {
    const m = byId('e-alphabet');
    const p = freshProgress('t', 'T', true);
    expect(isOpen(m, p)).toBe(false);
    expect(firstUnmetEnglish(m, p)).toBe('en-alphabet');
    p.english['en-alphabet'] = { best: 0.5, done: false, at: 0 };
    expect(isOpen(m, p)).toBe(false);
    p.english['en-alphabet'] = { best: 0.8, done: true, at: 0 };
    expect(isOpen(m, p)).toBe(true);
    expect(firstUnmetEnglish(m, p)).toBeUndefined();
  });

  describe('achievements', () => {
    beforeEach(() => __resetStore());
    const def: MissionDef = byId('e-atc');
    const win: MissionResult = { success: true, time: 130, checkpoints: 12, total: 12, hits: 0, decisionsCorrect: 0, decisionsTotal: 0, assisted: false, score: 900, stars: 3 };
    it('a completed reward flight unlocks the English flight achievements', () => {
      actions.mission(def, win);
      expect(Object.keys(getProgress().achievements)).toEqual(expect.arrayContaining(['radio-ready', 'clear-readback']));
    });
  });
});

describe('no questions during the flight', () => {
  it('missions that carry decision scenarios fly straight through: nothing is asked and nothing is scored as a question', () => {
    const withScenarios = MISSIONS.filter((m) => (m.decisions?.length ?? 0) > 0 && !m.goAround);
    expect(withScenarios.length).toBeGreaterThan(50);
    for (const m of withScenarios.filter((_, i) => i % 8 === 0)) {
      const r = fly(m).result!;
      expect(r.success, m.id).toBe(true);
      expect(r.decisionsTotal, m.id).toBe(0);
    }
  });
  it('English reward flights fly straight through too', () => {
    for (const m of english.slice(0, 4)) {
      const f = fly(m);
      expect(f.result!.success, m.id).toBe(true);
      expect(f.result!.decisionsTotal, m.id).toBe(0);
    }
  });
});
