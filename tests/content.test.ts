import { describe, expect, it } from 'vitest';
import {
  ATC_SCENARIOS, ENCYCLOPEDIA, EN_EXERCISES, EXAM_POOLS, FORMULAS, GAME_AIRCRAFT, GLOSSARY, MISSIONS, SOURCES,
  examPool, findLesson, formulaById, getMission, getTracks, isUnlocked, isaPressure, liveLessons, nextLesson, recommendedLesson,
} from '../src/content';
import { validateLesson, validateMission } from '../src/content/validate';
import { explorerById } from '../src/content/explorers';
import { evaluate } from '../src/engine/atc';
import { correctAnswerText, isCorrect } from '../src/engine/assessment';
import { freshProgress } from '../src/store/progress';
import { liftModel, mbSolve, windSolve } from '../src/components/Labs';

const lessons = liveLessons();

describe('curriculum integrity', () => {
  it('has complete lessons in every pathway', () => {
    expect(lessons.length).toBeGreaterThanOrEqual(20);
    for (const t of getTracks()) expect(liveLessons(t).length, t.title).toBeGreaterThan(0);
  });
  it.each(lessons.map((l) => [l.id, l] as const))('%s is structurally valid and fully linked', (_, l) => {
    expect(validateLesson(l)).toEqual([]);
    expect(l.practice.length).toBeGreaterThanOrEqual(5);
    expect(l.assessment.length).toBeGreaterThanOrEqual(5);
    expect(l.minutes).toBeGreaterThanOrEqual(5);
    expect(l.minutes).toBeLessThanOrEqual(15);
    const mission = getMission(l.missionId);
    expect(mission, `mission ${l.missionId}`).toBeDefined();
    expect(mission!.lessonId).toBe(l.id);
    for (const s of l.sources) expect(SOURCES.some((x) => x.id === s), `source ${s}`).toBe(true);
    for (const p of l.prereqs ?? []) expect(findLesson(p), `prerequisite ${p}`).toBeDefined();
    for (const s of l.sections) {
      if (s.formula) expect(formulaById(s.formula), `formula ${s.formula}`).toBeDefined();
      if (s.lab?.startsWith('formula:')) expect(formulaById(s.lab.slice(8)), `lab ${s.lab}`).toBeDefined();
      if (s.lab?.startsWith('explore:')) {
        const e = explorerById(s.lab.slice(8));
        expect(e, `lab ${s.lab}`).toBeDefined();
        expect(e!.items.length).toBeGreaterThanOrEqual(4);
        expect(new Set(e!.items.map((i) => i.name)).size).toBe(e!.items.length);
      }
    }
    expect(l.sections.some((s) => s.lab), 'has an interactive demonstration').toBe(true);
  });
  it('has unique question ids and no duplicated prompts inside a lesson', () => {
    const ids = lessons.flatMap((l) => [...l.practice, ...l.assessment].map((q) => q.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const l of lessons) {
      const prompts = [...l.practice, ...l.assessment].map((q) => q.prompt);
      expect(new Set(prompts).size, l.id).toBe(prompts.length);
    }
  });
  it('labels every question and never claims an official origin', () => {
    for (const pool of EXAM_POOLS) for (const q of examPool(pool)) {
      expect(q.label).toMatch(/^(Original practice question|Scenario-based training question)$/);
      expect(q.explain.length).toBeGreaterThan(5);
      expect(isCorrect(q, q.type === 'mcq' ? q.options[0] : q.type === 'tf' ? q.answer : q.type === 'num' ? String(q.answer) : q.type === 'order' ? q.items : Object.fromEntries(q.pairs)), `${q.id}: ${correctAnswerText(q)}`).toBe(true);
    }
  });
  it('gives every exam pool enough questions', () => {
    for (const pool of EXAM_POOLS) expect(examPool(pool).length, pool).toBeGreaterThanOrEqual(10);
  });
});

describe('numerical accuracy of taught values', () => {
  const f = (id: string, v: Record<string, number>) => formulaById(id)!.compute(v);
  it('matches the worked examples in the lessons', () => {
    expect(f('pressure', { F: 500, A: 0.25 })).toBe(2000);
    expect(f('dynamic-pressure', { 'ρ': 1.225, V: 50 })).toBeCloseTo(1531.25);
    expect(f('lift', { 'ρ': 1.225, V: 50, S: 16, CL: 0.5 })).toBeCloseTo(12250);
    expect(f('kinetic', { m: 1000, v: 30 })).toBe(450000);
    expect(f('potential', { m: 1000, h: 300 })).toBeCloseTo(2943000);
    expect(f('weight', { m: 80, g: 9.81 })).toBeCloseTo(784.8);
    expect(f('load-factor', { 'φ': 60 })).toBeCloseTo(2);
    expect(f('crosswind', { W: 20, 'θ': 30 })).toBeCloseTo(10);
    expect(f('wca', { XW: 30, TAS: 120 })).toBeCloseTo(14.48, 1);
    expect(f('lss', { T: 216.65 })).toBeCloseTo(573.2, 0);
    expect(f('lss', { T: 288.15 })).toBeCloseTo(661, 0);
    expect(f('cg', { M: 2258, m: 920 })).toBeCloseTo(2.454, 3);
    expect(f('kt-kmh', { kt: 120 })).toBeCloseTo(222.24);
  });
  it('matches the worked examples in the second physics batch', () => {
    expect(f('acceleration', { u: 0, v: 30, t: 10 })).toBe(3);
    expect(f('acceleration', { u: 60, v: 20, t: 8 })).toBe(-5);
    expect(f('friction', { 'μ': 0.6, N: 10000 })).toBe(6000);
    expect(f('momentum', { m: 1000, v: 50 })).toBe(50000);
    expect(f('continuity', { A1: 2, v1: 10, A2: 1 })).toBe(20);
    expect(f('bernoulli', { p1: 101325, v1: 10, v2: 30, 'ρ': 1.225 })).toBeCloseTo(100835);
    expect(f('bernoulli', { p1: 100000, v1: 20, v2: 40, 'ρ': 1.2 })).toBeCloseTo(99280);
    expect(f('gas-density', { p: 101325, T: 288.15 })).toBeCloseTo(1.225, 3);
    expect(f('gas-density', { p: 101325, T: 308.15 })).toBeCloseTo(1.146, 3);
    expect(f('gas-density', { p: 70000, T: 273.15 })).toBeCloseTo(0.893, 3);
    expect(f('torque', { F: 50, d: 0.4 })).toBeCloseTo(20);
    expect(f('drag', { 'ρ': 1.225, V: 50, S: 16, CD: 0.03 })).toBeCloseTo(735);
    expect(f('drag', { 'ρ': 1.2, V: 40, S: 15, CD: 0.04 })).toBeCloseTo(576);
  });
  it('models the standard atmosphere', () => {
    expect(isaPressure(0)).toBeCloseTo(1013.25);
    expect(isaPressure(18000)).toBeGreaterThan(500);
    expect(isaPressure(18000)).toBeLessThan(512);
    expect(1013.25 - isaPressure(27)).toBeCloseTo(1, 1);
    expect(f('isa-temp', { h: 10000 })).toBeCloseTo(-4.8);
  });
  it('solves the wind triangle from the CPL lesson', () => {
    const r = windSolve(90, 120, 360, 30);
    expect(r.wca).toBeCloseTo(-14.48, 1);
    expect(r.heading).toBeCloseTo(75.5, 0);
    expect(r.gs).toBeCloseTo(116.2, 0);
    expect(windSolve(270, 100, 270, 20).gs).toBeCloseTo(80);
    expect(windSolve(270, 100, 90, 20).gs).toBeCloseTo(120);
  });
  it('stalls the wing above the critical angle and balances the loading example', () => {
    expect(liftModel(50, 10, 0).stalled).toBe(false);
    expect(liftModel(50, 16, 0).stalled).toBe(true);
    expect(liftModel(50, 16, 0).cl).toBeLessThan(liftModel(50, 15, 0).cl);
    expect(liftModel(50, 5, 8000).lift).toBeLessThan(liftModel(50, 5, 0).lift);
    const ok = mbSolve(160, 0, 10, 100);
    expect(ok.overweight || ok.fwdOut || ok.aftOut).toBe(false);
    expect(mbSolve(160, 180, 60, 150).overweight).toBe(true);
  });
});

describe('progression rules', () => {
  it('opens the first lesson of a module and unlocks the next after a pass', () => {
    const p = freshProgress('t', 'T', true);
    expect(isUnlocked('phys-pressure', p)).toBe(true);
    expect(isUnlocked('phys-density', p)).toBe(false);
    expect(recommendedLesson(p)?.id).toBe('math-arithmetic');
    p.lessons['phys-pressure'] = { passed: true, best: 1, attempts: 1 };
    expect(isUnlocked('phys-density', p)).toBe(true);
    expect(nextLesson('phys-pressure', p)?.id).toBe('phys-density');
  });
});

describe('reference data', () => {
  it('links glossary, formulas, aircraft and missions to existing items', () => {
    const termIds = new Set(GLOSSARY.map((t) => t.id));
    expect(termIds.size).toBe(GLOSSARY.length);
    for (const t of GLOSSARY) for (const r of t.related) expect(termIds.has(r), `${t.id} → ${r}`).toBe(true);
    for (const f of FORMULAS) {
      for (const r of f.related) expect(formulaById(r), `${f.id} → ${r}`).toBeDefined();
      if (f.lessonId) expect(findLesson(f.lessonId), f.id).toBeDefined();
      expect(Number.isFinite(f.compute(Object.fromEntries(f.vars.map((v) => [v.sym, v.def])))), f.id).toBe(true);
    }
    for (const e of ENCYCLOPEDIA) { for (const l of e.lessons) expect(findLesson(l), `${e.id} → ${l}`).toBeDefined(); expect(GAME_AIRCRAFT.some((a) => a.id === e.art)).toBe(true); }
    for (const m of MISSIONS) {
      expect(validateMission(m), m.id).toEqual([]);
      expect(GAME_AIRCRAFT.some((a) => a.id === m.aircraftId), m.id).toBe(true);
      if (m.lessonId) expect(findLesson(m.lessonId), m.id).toBeDefined();
      if (m.speedBand) { const ac = GAME_AIRCRAFT.find((a) => a.id === m.aircraftId)!; expect(m.speedBand.min).toBeGreaterThanOrEqual(ac.minKt); expect(m.speedBand.max).toBeLessThanOrEqual(ac.maxKt); }
    }
  });
  it('accepts its own model answer for every ATC exchange', () => {
    for (const s of ATC_SCENARIOS) for (const step of s.steps) expect(evaluate(step, step.model).missing, `${s.id}: ${step.model}`).toEqual([]);
  });
  it('gives every English quiz exercise questions', () => {
    for (const e of EN_EXERCISES.filter((x) => x.kind === 'quiz')) expect(e.questions!.length).toBeGreaterThanOrEqual(5);
  });
});
