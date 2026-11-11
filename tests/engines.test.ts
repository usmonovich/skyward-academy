import { beforeEach, describe, expect, it } from 'vitest';
import type { MissionStats, Question } from '../src/types';
import { grade, isCorrect, parseNum, pickQuestions } from '../src/engine/assessment';
import { DAY, newCard, review } from '../src/engine/srs';
import { rankFor, scoreMission, streak, dayKey } from '../src/engine/gamification';
import { controllerTurn, evaluate, normalize } from '../src/engine/atc';
import { ATC_SCENARIOS, getMission } from '../src/content';
import { __resetStore, actions, freshProgress, getProgress } from '../src/store/progress';
import { mergeProgress, sameProgress } from '../src/cloud/merge';

const mcq: Question = { id: 'q1', type: 'mcq', prompt: 'p', options: ['right', 'wrong', 'other'], explain: 'e' };
const num: Question = { id: 'q2', type: 'num', prompt: 'p', answer: 2000, tol: 1, unit: 'Pa', explain: 'e' };
const tf: Question = { id: 'q3', type: 'tf', prompt: 'p', answer: false, explain: 'e' };
const order: Question = { id: 'q4', type: 'order', prompt: 'p', items: ['a', 'b', 'c'], explain: 'e' };
const match: Question = { id: 'q5', type: 'match', prompt: 'p', pairs: [['A', '1'], ['B', '2']], explain: 'e' };

describe('assessment engine', () => {
  it('parses learner number formats', () => {
    expect(parseNum('1,250,000')).toBe(1250000);
    expect(parseNum('2,5')).toBe(2.5);
    expect(parseNum(' −5 ')).toBe(-5);
    expect(parseNum('.75')).toBe(0.75);
    expect(parseNum('abc')).toBeNaN();
    expect(parseNum('')).toBeNaN();
  });
  it('checks every question type', () => {
    expect(isCorrect(mcq, 'right')).toBe(true);
    expect(isCorrect(mcq, 'wrong')).toBe(false);
    expect(isCorrect(num, '2,000')).toBe(true);
    expect(isCorrect(num, '2000.9')).toBe(true);
    expect(isCorrect(num, '2002')).toBe(false);
    expect(isCorrect(num, undefined)).toBe(false);
    expect(isCorrect(tf, false)).toBe(true);
    expect(isCorrect(tf, undefined)).toBe(false);
    expect(isCorrect(order, ['a', 'b', 'c'])).toBe(true);
    expect(isCorrect(order, ['b', 'a', 'c'])).toBe(false);
    expect(isCorrect(match, { A: '1', B: '2' })).toBe(true);
    expect(isCorrect(match, { A: '2', B: '1' })).toBe(false);
  });
  it('grades against the pass mark, including the exact boundary', () => {
    const qs = [mcq, num, tf, order, match];
    const pass = grade(qs, { q1: 'right', q2: '2000', q3: false, q4: ['a', 'b', 'c'], q5: { A: '2', B: '1' } }, 0.8);
    expect(pass.correct).toBe(4);
    expect(pass.passed).toBe(true);
    const fail = grade(qs, { q1: 'right', q2: '2000', q3: false }, 0.8);
    expect(fail.score).toBeCloseTo(0.6);
    expect(fail.passed).toBe(false);
  });
  it('picks random sets without duplicates', () => {
    const set = pickQuestions([mcq, mcq, num, tf, order, match], 10);
    expect(set).toHaveLength(5);
    expect(new Set(set.map((q) => q.id)).size).toBe(5);
  });
});

describe('SM-2 spaced repetition', () => {
  it('grows intervals 1 day, 6 days, then by the ease factor', () => {
    const t = 1_000_000;
    let c = review(newCard(t), 4, t);
    expect(c.interval).toBe(1);
    expect(c.due).toBe(t + DAY);
    c = review(c, 4, t);
    expect(c.interval).toBe(6);
    c = review(c, 4, t);
    expect(c.interval).toBe(Math.round(6 * c.ef));
    expect(c.ef).toBeCloseTo(2.5);
  });
  it('resets on a lapse and never drops ease below 1.3', () => {
    let c = newCard(0);
    for (let i = 0; i < 12; i++) c = review(c, 1, 0);
    expect(c.reps).toBe(0);
    expect(c.ef).toBe(1.3);
    expect(c.lapses).toBe(12);
    expect(c.due).toBe(600_000);
  });
});

describe('gamification', () => {
  it('maps XP to ranks', () => {
    expect(rankFor(0).name).toBe('Aviation Explorer');
    expect(rankFor(150).name).toBe('Junior Cadet');
    expect(rankFor(99999).name).toBe('Skyward Academy Master');
    expect(rankFor(100).toNext).toBe(50);
  });
  const base: MissionStats = { success: true, time: 30, checkpoints: 6, total: 6, hits: 0, decisionsCorrect: 0, decisionsTotal: 0, assisted: false };
  it('scores missions', () => {
    expect(scoreMission(40, base)).toEqual({ score: 1000, stars: 3 });
    expect(scoreMission(40, { ...base, success: false })).toEqual({ score: 0, stars: 0 });
    const poor = scoreMission(40, { ...base, checkpoints: 2, hits: 2, time: 80, landing: 'hard' });
    expect(poor.stars).toBe(1);
    expect(scoreMission(40, { ...base, checkpoints: 5, hits: 1, bandFraction: 0.8 }).stars).toBe(2);
  });
  it('counts a streak of consecutive days', () => {
    __resetStore();
    const p = getProgress();
    const d = new Date(2026, 4, 10);
    const y = new Date(2026, 4, 9);
    expect(streak({ ...p, activity: { [dayKey(d)]: 5, [dayKey(y)]: 5 } }, d)).toBe(2);
    expect(streak({ ...p, activity: { [dayKey(y)]: 5 } }, d)).toBe(1);
    expect(streak({ ...p, activity: {} }, d)).toBe(0);
  });
});

describe('virtual air traffic controller', () => {
  const taxi = ATC_SCENARIOS.find((s) => s.id === 'taxi')!;
  const readback = taxi.steps[1];
  it('normalises numbers the way they are spoken', () => {
    expect(normalize('Contact Tower 118.7')).toBe('contact tower one one eight decimal seven');
    expect(normalize('descend 3,000 feet QNH 1009')).toBe('descend three thousand feet qnh one zero zero nine');
    expect(normalize('Runway 27, cleared for take-off')).toBe('runway two seven cleared for take off');
    expect(normalize('heading two niner zero')).toBe('heading two nine zero');
  });
  it('accepts a complete readback in digits or words', () => {
    expect(evaluate(readback, 'Taxi to holding point runway 27 via Alpha, QNH 1013, Skyward 123').complete).toBe(true);
    expect(evaluate(readback, 'taxi holding point runway two seven via alfa q n h one zero one three skyward one two three').complete).toBe(true);
  });
  it('reacts differently to wrong, missing and repeated transmissions', () => {
    const wrong = evaluate(readback, 'Taxi to holding point runway 09 via Alpha, Skyward 123');
    expect(wrong.missing).toContain('Runway 27');
    const t1 = controllerTurn(readback, wrong, 0);
    expect(t1.advance).toBe(false);
    expect(t1.atc).toMatch(/negative/i);
    const again = controllerTurn(readback, evaluate(readback, 'Say again'), 0);
    expect(again.atc).toMatch(/I say again/);
    expect(controllerTurn(readback, evaluate(readback, ''), 0).atc).toMatch(/say again/i);
    expect(controllerTurn(readback, evaluate(readback, 'Taxi to holding point runway 27 via Alpha, QNH 1013, Skyward 123'), 0).advance).toBe(true);
    expect(controllerTurn(readback, wrong, 2).advance).toBe(true);
  });
});

describe('cloud merge', () => {
  it('keeps everything earned on either device and takes preferences from the newer copy', () => {
    const a = freshProgress('a', 'Phone', false);
    const b = freshProgress('b', 'Laptop', false);
    a.xp = 300; b.xp = 450;
    a.lessons['math-units'] = { passed: true, best: 0.8, attempts: 2, at: 5 };
    b.lessons['math-units'] = { passed: false, best: 0.6, attempts: 3 };
    b.lessons['phys-pressure'] = { passed: true, best: 1, attempts: 1, at: 9 };
    a.missions['m-math-units'] = { stars: 2, best: 700, at: 1 };
    b.missions['m-math-units'] = { stars: 3, best: 650, at: 2 };
    a.achievements['first-lesson'] = 100; b.achievements['first-lesson'] = 50; b.achievements['first-flight'] = 70;
    a.favTerms = ['aoa']; b.favTerms = ['qnh', 'aoa'];
    a.cards.aoa = { ef: 2.5, interval: 6, reps: 2, due: 10, lapses: 0 }; b.cards.aoa = { ef: 2.5, interval: 1, reps: 1, due: 99, lapses: 0 };
    a.exams = [{ id: 'e1', date: 1, pool: 'Physics', mode: 'exam', total: 10, correct: 8, seconds: 60, byTopic: {} }];
    b.exams = [{ id: 'e2', date: 2, pool: 'Physics', mode: 'exam', total: 10, correct: 9, seconds: 60, byTopic: {} }, a.exams[0]];
    a.settings.textScale = 1.2; b.settings.textScale = 1; a.livery = 'teal'; b.livery = 'gold';
    const m = mergeProgress(a, b, 'remote');
    expect(m.xp).toBe(450);
    expect(m.lessons['math-units']).toMatchObject({ passed: true, best: 0.8, attempts: 3 });
    expect(m.lessons['phys-pressure'].passed).toBe(true);
    expect(m.missions['m-math-units']).toMatchObject({ stars: 3, best: 700 });
    expect(m.achievements).toEqual({ 'first-lesson': 50, 'first-flight': 70 });
    expect(m.favTerms.sort()).toEqual(['aoa', 'qnh']);
    expect(m.cards.aoa.reps).toBe(2);
    expect(m.exams.map((e) => e.id)).toEqual(['e2', 'e1']);
    expect(m.livery).toBe('gold');
    expect(m.id).toBe('a');
    const m2 = mergeProgress(a, b, 'local');
    expect(m2.livery).toBe('teal');
    expect(m2.settings.textScale).toBe(1.2);
    expect(sameProgress(mergeProgress(m, b, 'remote'), m)).toBe(true);
  });
  it('writes a merged copy into the store without changing the profile identity', () => {
    __resetStore();
    const incoming = freshProgress('other', 'Amelia', false);
    incoming.xp = 999;
    actions.replace(incoming);
    expect(getProgress()).toMatchObject({ id: 'guest', guest: true, xp: 999, name: 'Amelia' });
  });
});

describe('progress store', () => {
  beforeEach(() => __resetStore());
  it('awards lesson XP once and keeps the best score', () => {
    expect(actions.assessment('phys-pressure', 0.6, false)).toBe(0);
    expect(getProgress().lessons['phys-pressure'].passed).toBe(false);
    expect(actions.assessment('phys-pressure', 0.86, true)).toBe(100);
    expect(actions.assessment('phys-pressure', 1, true)).toBe(25);
    expect(actions.assessment('phys-pressure', 0.86, true)).toBe(0);
    const l = getProgress().lessons['phys-pressure'];
    expect(l).toMatchObject({ passed: true, best: 1, attempts: 4 });
    expect(getProgress().xp).toBe(125);
    expect(getProgress().achievements['first-lesson']).toBeTruthy();
  });
  it('awards mission XP for the first completion and only the improvement afterwards', () => {
    const def = getMission('m-phys-pressure')!;
    const r = { success: true, time: 40, checkpoints: 5, total: 7, hits: 1, decisionsCorrect: 0, decisionsTotal: 0, assisted: false };
    expect(actions.mission(def, { ...r, score: 700, stars: 2 })).toBe(def.xp + 50);
    expect(actions.mission(def, { ...r, score: 900, stars: 3 })).toBe(25);
    expect(actions.mission(def, { ...r, score: 500, stars: 1 })).toBe(0);
    expect(actions.mission(def, { ...r, success: false, score: 0, stars: 0 })).toBe(0);
    expect(getProgress().missions[def.id]).toMatchObject({ stars: 3, best: 900 });
  });
  it('keeps a mistake queue and clears an item when it is answered correctly', () => {
    actions.answer(mcq, false);
    actions.answer(mcq, false);
    expect(getProgress().mistakes).toHaveLength(1);
    actions.answer(mcq, true);
    expect(getProgress().mistakes).toHaveLength(0);
    expect(getProgress().topics.General).toEqual({ correct: 1, total: 3 });
  });
  it('moves guest progress into a new profile', () => {
    actions.assessment('math-units', 1, true);
    const xp = getProgress().xp;
    expect(actions.createProfile('Amelia')).toBe(true);
    const p = getProgress();
    expect(p).toMatchObject({ name: 'Amelia', guest: false, xp });
    expect(p.lessons['math-units'].passed).toBe(true);
    actions.switchProfile('guest');
    expect(getProgress().xp).toBe(0);
  });
  it('round-trips export and import, and rejects foreign files', () => {
    actions.assessment('math-units', 1, true);
    const json = actions.exportData();
    __resetStore();
    expect(actions.importData('{"hello":1}')).toMatch(/not a Skyward Academy/);
    expect(actions.importData('not json')).toMatch(/could not be read/);
    expect(actions.importData(json)).toBeNull();
    expect(getProgress().lessons['math-units'].passed).toBe(true);
  });
  it('schedules flashcards through the store', () => {
    actions.addCard('aoa');
    actions.reviewCard('aoa', 4);
    expect(getProgress().cards.aoa.interval).toBe(1);
    expect(getProgress().cardReviews).toBe(1);
  });
});
