import { beforeEach, describe, expect, it } from 'vitest';
import type { MissionDef, MissionResult } from '../src/types';
import { EN_EXERCISES, MISSIONS } from '../src/content';
import { PHONETIC } from '../src/content/english';
import { scoreMission } from '../src/engine/gamification';
import { analyse } from '../src/game/analysis';
import { buildLevel } from '../src/game/engine';
import { firstUnmetEnglish, isOpen, trackOf } from '../src/game/browse';
import { __resetStore, actions, freshProgress, getProgress } from '../src/store/progress';
import { fly } from './helpers/autopilot';

const english = MISSIONS.filter((m) => m.requiresEnglish);
const byId = (id: string) => MISSIONS.find((m) => m.id === id)!;

describe('Aviation English flights: content', () => {
  it('has one flight per exercise, unlocked by that exercise', () => {
    expect(english).toHaveLength(EN_EXERCISES.length);
    for (const ex of EN_EXERCISES) {
      const m = english.find((x) => x.requiresEnglish!.includes(ex.id));
      expect(m, ex.id).toBeDefined();
      expect(m!.id).toBe(`e-${ex.id.replace(/^en-/, '')}`);
      expect(trackOf(m!)).toBe('english');
    }
  });

  it.each(english.map((m) => [m.id, m] as const))('%s: every radio call is well formed, with exactly one correct answer that explains itself', (_, m) => {
    const rings = m.english!.rings;
    expect(rings.length).toBeGreaterThanOrEqual(4);
    expect(rings.length).toBeLessThanOrEqual(6);
    for (const r of rings) {
      expect(r.prompt.length).toBeGreaterThan(8);
      expect(r.options.length).toBeGreaterThanOrEqual(2);
      expect(r.options.filter((o) => o.correct)).toHaveLength(1);
      expect(new Set(r.options.map((o) => o.text)).size, r.prompt).toBe(r.options.length);
      for (const o of r.options) expect(o.feedback.length, `${r.prompt}: ${o.text}`).toBeGreaterThan(15);
    }
    expect(m.briefing).toMatch(/not official examination questions/);
    expect(m.briefing).toMatch(/no ICAO language proficiency rating/);
  });

  it('builds the alphabet and numbers questions from the transmission, so the right answer really is right', () => {
    const names = new Map(PHONETIC.map(([l, w]) => [w.toLowerCase(), l]));
    for (const r of byId('e-alphabet').english!.rings) {
      const words = r.transmission.replace(/^Aircraft registration: /, '').replace(/\.$/, '').split(' ');
      const letters = words.map((w) => names.get(w.toLowerCase())).join('-');
      expect(r.options.find((o) => o.correct)!.text).toBe(letters);
    }
    const digit: Record<string, string> = { zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', niner: '9', decimal: '.' };
    for (const r of byId('e-numbers').english!.rings) {
      const value = r.transmission.split(' ').map((w) => digit[w.toLowerCase().replace(/[.,]/g, '')] ?? '').join('');
      const right = r.options.find((o) => o.correct)!.text.replace(/\D|(?<=\d)\.(?=\D)/g, (c) => (c === '.' ? '.' : ''));
      expect(right.replace(/FL|\s*degrees/g, '').replace(/\D/g, ''), r.transmission).toBe(value.replace(/\D/g, ''));
      expect(r.safetyCritical).toBe(true);
    }
  });

  it('builds readback questions whose correct answer is the model readback with the call sign, and offers the spoken check items', () => {
    const rings = byId('e-atc').english!.rings;
    for (const r of rings) {
      expect(r.topic).toBe('readback'); expect(r.skill).toBe('phraseology'); expect(r.safetyCritical).toBe(true);
      expect(r.options.find((o) => o.correct)!.text).toMatch(/Skyward 123/);
      expect(r.voice!.length).toBeGreaterThan(0);
      expect(r.options.some((o) => /^Roger/.test(o.text))).toBe(true); // "Roger" is offered as the tempting wrong answer
    }
  });

  it('keeps language-knowledge quizzes non-critical and phraseology and non-routine listening critical', () => {
    expect(byId('e-grammar').english!.rings.every((r) => !r.safetyCritical)).toBe(true);
    expect(byId('e-phrase').english!.rings.every((r) => r.safetyCritical)).toBe(true);
    expect(byId('e-listen-l4').english!.rings.every((r) => r.safetyCritical && r.topic === 'emergency')).toBe(true);
  });
});

describe('Aviation English flights: unlocking', () => {
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
});

describe('Aviation English flights: in the air', () => {
  it('puts a purple ring on each radio call, never first or last, and asks every call exactly once', () => {
    for (const m of english) {
      const gates = buildLevel(m).gates;
      const eng = gates.filter((g) => g.kind === 'english');
      expect(eng.length, m.id).toBe(m.english!.rings.length);
      expect(new Set(eng.map((g) => g.q)).size).toBe(eng.length);
      expect(gates[0].kind).not.toBe('english'); expect(gates[gates.length - 1].kind).not.toBe('english');
    }
    const f = fly(byId('e-numbers'));
    expect(f.decisions).toBe(byId('e-numbers').english!.rings.length);
    expect(f.result!.english!.asked).toBe(f.decisions);
  });

  it('answering correctly gives full credit; the flight pauses for each call so active time excludes it', () => {
    const f = fly(byId('e-atc'));
    const e = f.result!.english!;
    expect(f.result!.success).toBe(true);
    expect(e.correct).toBe(e.asked);
    expect(e.bySkill.phraseology.asked).toBe(e.asked);
    expect(f.result!.safetyWrong).toBe(0);
    expect(f.seconds).toBeGreaterThanOrEqual(120);
  });

  it('a wrong safety-critical call can never earn three stars, but never blocks finishing the flight', () => {
    for (const id of ['e-atc', 'e-phrase', 'e-numbers']) {
      const f = fly(byId(id), { wrongDecisions: true });
      expect(f.result!.success, id).toBe(true);
      expect(f.result!.safetyWrong, id).toBeGreaterThan(0);
      expect(f.result!.stars, id).toBeLessThanOrEqual(2);
      expect(f.result!.english!.wrong.some((w) => w.safetyCritical)).toBe(true);
    }
  });

  it('a wrong answer to a language-only call lowers the educational score but does not trigger the safety cap', () => {
    const f = fly(byId('e-grammar'), { wrongDecisions: true });
    expect(f.result!.success).toBe(true);
    expect(f.result!.safetyWrong).toBe(0);
    expect(f.result!.english!.correct).toBe(0);
  });

  it('also caps every aviation mission with operational decisions when one is answered wrongly', () => {
    for (const m of MISSIONS.filter((x) => (x.decisions?.length ?? 0) > 0 && !x.english).slice(0, 25)) {
      const f = fly(m, { wrongDecisions: true });
      if (f.result?.success) expect(f.result.stars, m.id).toBeLessThanOrEqual(2);
    }
  });

  it('the score formula is unchanged: only the star cap is new', () => {
    const s = { success: true, time: 30, checkpoints: 6, total: 6, hits: 0, decisionsCorrect: 0, decisionsTotal: 0, assisted: false };
    expect(scoreMission(40, s)).toEqual({ score: 1000, stars: 3 });
    expect(scoreMission(40, { ...s, safetyWrong: 1 })).toEqual({ score: 1000, stars: 2 });
    expect(scoreMission(40, { ...s, safetyWrong: 0 }).stars).toBe(3);
  });
});

describe('Aviation English flights: rewards and analysis', () => {
  beforeEach(() => __resetStore());
  const def: MissionDef = byId('e-atc');
  const result = (correct: number, asked = 6): MissionResult => ({ success: true, time: 130, checkpoints: 12, total: 12, hits: 0, decisionsCorrect: correct, decisionsTotal: asked, assisted: false, score: 900, stars: 3, english: { asked, correct, bySkill: { comprehension: { asked: 0, correct: 0 }, phraseology: { asked, correct } }, byTopic: { readback: { asked, correct } }, wrong: [] } });

  it('pays capped XP for correct radio calls once, and only the improvement on a replay', () => {
    const a = actions.mission(def, result(4));
    const first = a - (def.xp + 3 * 25);
    expect(first).toBe(20); // 4 correct calls, 5 XP each
    const b = actions.mission(def, result(4));
    expect(b).toBe(0);
    const c = actions.mission(def, result(6));
    expect(c).toBe(20); // two more correct calls (10) plus 10 for lifting the weak readback topic
    expect(getProgress().missions['e-atc'].bonusXp).toBe(40);
  });

  it('keeps radio-call accuracy by topic and rewards improving a weak topic', () => {
    actions.mission(def, { ...result(1, 6), success: false });
    expect(getProgress().engTopics!.readback).toEqual({ asked: 6, correct: 1 });
    const gained = actions.mission(def, result(6));
    expect(gained).toBeGreaterThanOrEqual(def.xp + 3 * 25 + 30 + 10);
  });

  it('unlocks the English achievements', () => {
    actions.mission(def, result(6));
    expect(Object.keys(getProgress().achievements)).toEqual(expect.arrayContaining(['radio-ready', 'clear-readback']));
  });

  it('reports comprehension, phraseology and aircraft control separately, and never claims an ICAO result', () => {
    const r: MissionResult = { ...result(4), english: { asked: 6, correct: 4, bySkill: { comprehension: { asked: 2, correct: 2 }, phraseology: { asked: 4, correct: 2 } }, byTopic: { readback: { asked: 4, correct: 2 }, numbers: { asked: 2, correct: 2 } }, wrong: [{ transmission: 'Skyward 123, runway 27, cleared to land.', topic: 'readback', safetyCritical: true, skill: 'phraseology' }] } };
    const a = analyse(def, r);
    expect(a.strengths.join(' ')).toMatch(/4 of 6 radio calls correct \(comprehension 2 of 2, phraseology 2 of 4\)/);
    expect(a.mistakes.join(' ')).toMatch(/Radio call missed \(safety-critical\), readback/);
    expect(a.tips.join(' ')).toMatch(/Roger/);
    expect(a.tips.join(' ')).toMatch(/not an ICAO language proficiency result/);
    expect(a.strengths.join(' ')).toMatch(/gates/); // aircraft control is reported on its own lines
  });
});
