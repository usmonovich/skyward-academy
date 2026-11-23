import { describe, expect, it } from 'vitest';
import { FORMULAS, MISSIONS, formulaById, liveLessons } from '../src/content';
import { FORMULAS_EXPANSION } from '../src/content/formulas2';
import { mathExpansion } from '../src/content/math5';
import { physicsExpansion } from '../src/content/physics6';

const f = (id: string, v: Record<string, number>) => formulaById(id)!.compute({ ...Object.fromEntries(formulaById(id)!.vars.map((x) => [x.sym, x.def])), ...v });

describe('expansion lessons (mathematics and physics, batch 1)', () => {
  const lessons = [...Object.values(mathExpansion), ...Object.values(physicsExpansion)];

  it('adds 21 complete lessons, all live, each with a flight mission, a lab, objectives and worked examples', () => {
    expect(lessons).toHaveLength(21);
    const live = new Set(liveLessons().map((l) => l.id));
    for (const l of lessons) {
      expect(live.has(l.id), l.id).toBe(true);
      expect(l.objectives.length).toBeGreaterThanOrEqual(3);
      expect(l.examples.length).toBeGreaterThanOrEqual(2);
      expect(l.practice.length).toBeGreaterThanOrEqual(5);
      expect(l.assessment.length).toBeGreaterThanOrEqual(5);
      expect(l.sections.some((s) => s.lab), l.id).toBe(true);
      expect(l.sections.some((s) => s.note), `${l.id} states a limit or caution`).toBe(true);
      expect(MISSIONS.find((m) => m.id === l.missionId)?.lessonId).toBe(l.id);
      expect(l.prereqs?.length, l.id).toBeGreaterThan(0);
    }
  });

  it('every new formula states its limits and has a lesson, aviation use and common mistakes', () => {
    expect(FORMULAS_EXPANSION.length).toBeGreaterThanOrEqual(20);
    for (const x of FORMULAS_EXPANSION) {
      expect(x.valid.length, x.id).toBeGreaterThan(20);
      expect(x.aviation.length, x.id).toBeGreaterThan(20);
      expect(x.mistakes.length, x.id).toBeGreaterThanOrEqual(2);
      expect(lessons.some((l) => l.id === x.lessonId), `${x.id} → lesson`).toBe(true);
      expect(Number.isFinite(x.compute(Object.fromEntries(x.vars.map((v) => [v.sym, v.def])))), x.id).toBe(true);
    }
    expect(new Set(FORMULAS.map((x) => x.id)).size).toBe(FORMULAS.length);
  });

  it('the formula labs reproduce the worked examples printed in the lessons', () => {
    expect(f('direct-prop', {})).toBeCloseTo(60);
    expect(f('inverse-prop', {})).toBeCloseTo(60);
    expect(f('circumference', {})).toBeCloseTo(15.708, 2);
    expect(f('volume-cyl', {})).toBeCloseTo(0.1257, 3);
    expect(f('sine-rule', {})).toBeCloseTo(10.78, 2);
    expect(f('cosine-rule', {})).toBeCloseTo(7.55, 2);
    expect(f('half-life', {})).toBeCloseTo(506.5, 1);
    expect(f('ground-speed', {})).toBeCloseTo(82.2, 1);
    expect(f('utc-local', {})).toBeCloseTo(16.5);
    expect(f('utc-local', { UTC: 23, off: 3 })).toBeCloseTo(2);
    expect(f('percent-error', {})).toBeCloseTo(2);
    expect(f('at-least-once', {})).toBeCloseTo(0.1426, 3);
    expect(f('free-fall', {})).toBeCloseTo(19.62, 2);
    expect(f('proj-range', {})).toBeCloseTo(40.77, 2);
    expect(f('centripetal', {})).toBeCloseTo(3000);
    expect(f('buoyancy', {})).toBeCloseTo(4905);
    expect(f('pascal-force', {})).toBeCloseTo(1000);
    expect(f('dew-point-approx', {})).toBeCloseTo(12);
    expect(f('lapse-temp', {})).toBeCloseTo(14);
    expect(f('doppler', {})).toBeCloseTo(555.56, 1);
    expect(f('induced-emf', {})).toBeCloseTo(1);
    expect(f('wing-loading', {})).toBeCloseTo(68.75);
    expect(f('cl-linear', {})).toBeCloseTo(0.66);
  });

  it('practice answers in the lessons agree with the same formulas', () => {
    expect(f('proj-range', { v: 30 })).toBeCloseTo(91.74, 1);
    expect(f('centripetal', { m: 1200, v: 40, r: 400 })).toBeCloseTo(4800);
    expect(f('ground-speed', { TAS: 120, W: 25, a: 180 })).toBeCloseTo(145, 0);
    expect(f('doppler', { f: 1000, vₛ: 68 })).toBeCloseTo(1250);
  });
});
