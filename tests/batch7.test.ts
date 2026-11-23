import { describe, expect, it } from 'vitest';
import type { MissionResult } from '../src/types';
import { MISSIONS } from '../src/content';
import { flightSummary } from '../src/components/MissionComplete';
import { MECHANICS, learningLine, mechanicsOf } from '../src/game/objectives';
import { DEFAULT_SETTINGS } from '../src/store/progress';
import { fly, headless } from './helpers/autopilot';

const byId = (id: string) => MISSIONS.find((m) => m.id === id)!;

describe('steering sensitivity and quality (batch 7)', () => {
  const climb = (steer?: number) => {
    const { g } = headless({ ...byId('m-math-units'), obstacles: { density: 0, types: ['balloon'] } }, { steer });
    for (let i = 0; i < 20; i++) g.step(1 / 60);
    const y0 = g.snapshot().y;
    g.setInput({ y: -0.5 });
    for (let i = 0; i < 40; i++) g.step(1 / 60);
    return y0 - g.snapshot().y;
  };

  it('defaults to the original feel, and a higher setting climbs faster than a lower one for the same input', () => {
    expect(DEFAULT_SETTINGS.steering).toBe(1);
    expect(DEFAULT_SETTINGS.quality).toBe('auto');
    expect(climb(undefined)).toBeCloseTo(climb(1), 6);
    expect(climb(1.5)).toBeGreaterThan(climb(1));
    expect(climb(0.6)).toBeLessThan(climb(1));
    expect(climb(0.6)).toBeGreaterThan(0);
  });

  it('never changes a flight that leaves the setting alone: the scripted results stay the same', () => {
    const a = fly(byId('m-math-units')).result!; const b = fly(byId('m-math-units')).result!;
    expect(a.score).toBe(b.score); expect(a.success).toBe(true);
  });

  it('draws on every quality level without error', () => {
    for (const quality of ['auto', 'high', 'low'] as const) {
      const { g } = headless({ ...byId('m-math-windtri'), env: 'rain' }, { noRender: false, quality });
      for (let i = 0; i < 60; i++) g.step(1 / 60);
      g.destroy();
    }
  });
});

describe('reward summary', () => {
  const base: MissionResult = { success: true, time: 134, checkpoints: 17, total: 20, hits: 1, decisionsCorrect: 2, decisionsTotal: 3, assisted: false, score: 800, stars: 2, bonus: 140, ringTypes: { cloud: { hit: 10, total: 12 }, gold: { hit: 4, total: 5 }, special: { hit: 3, total: 3 } }, boosters: { collected: 3, used: { shield: 1, magnet: 2 }, xpTokens: 1, absorbed: 1 } };

  it('reports rings, kinds, bonus, time, boosters and questions from what was measured', () => {
    const rows = Object.fromEntries(flightSummary(base).map((r) => [r.label, r.value]));
    expect(rows['Rings collected']).toBe('17 of 20');
    expect(rows['By kind']).toMatch(/Cloud ring 10\/12/);
    expect(rows['Bonus points']).toMatch(/^140 /);
    expect(rows['Flight time']).toBe('2 min 14 s');
    expect(rows['Boosters used']).toBe('Shield ×1, Ring magnet ×2');
    expect(rows['Questions answered correctly']).toBe('2 of 3');
  });

  it('says "None" when no booster was used and omits the question and radio lines when there were none', () => {
    const rows = flightSummary({ ...base, boosters: undefined, decisionsTotal: 0, decisionsCorrect: 0 });
    expect(rows.find((r) => r.label === 'Boosters used')!.value).toBe('None');
    expect(rows.some((r) => r.label.startsWith('Questions'))).toBe(false);
    expect(rows.some((r) => r.label === 'Radio calls')).toBe(false);
  });

  it('lists comprehension and phraseology separately for radio flights', () => {
    const e = { asked: 6, correct: 4, bySkill: { comprehension: { asked: 2, correct: 2 }, phraseology: { asked: 4, correct: 2 } }, byTopic: {}, wrong: [] };
    expect(flightSummary({ ...base, english: e }).find((r) => r.label === 'Radio calls')!.value).toBe('comprehension 2/2 · phraseology 2/4');
  });
});

describe('objective to mechanic mapping (priority 9)', () => {
  it('gives every mission at least one mechanic, each with a learning objective, and a briefing line', () => {
    for (const m of MISSIONS) {
      const used = mechanicsOf(m);
      expect(used.length, m.id).toBeGreaterThan(0);
      for (const x of used) expect(x.practises.length, `${m.id} ${x.id}`).toBeGreaterThan(20);
      expect(learningLine(m), m.id).toMatch(/^In the cockpit: /);
    }
    expect(new Set(MECHANICS.map((x) => x.id)).size).toBe(MECHANICS.length);
  });

  it('switches mechanics on from the mission data, so new missions need no extra wiring', () => {
    const ids = (id: string) => mechanicsOf(byId(id)).map((x) => x.id);
    expect(ids('m-math-windtri')).toContain('wind');
    expect(ids('m-phys-wingload')).toContain('landing');
    expect(ids('e-atc')).toContain('radio');
    expect(ids('m-math-proportion')).toContain('speed');
    expect(ids('m-math-sinecos')).toContain('terrain');
    expect(MISSIONS.some((m) => mechanicsOf(m).some((x) => x.id === 'decisions'))).toBe(true);
  });
});
