// Assessment engine: answer checking, grading and randomisation. Pure functions, unit-tested.
import type { Answer, Question } from '../types';

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: readonly T[], rnd: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Parses learner numeric input: accepts thousands separators, a decimal comma and the Unicode minus sign. */
export function parseNum(input: unknown): number {
  if (typeof input === 'number') return input;
  if (typeof input !== 'string') return NaN;
  let s = input.trim().replace(/\s/g, '').replace(/−/g, '-');
  if (s === '') return NaN;
  if (/^-?\d+,\d{1,2}$/.test(s)) s = s.replace(',', '.');
  else s = s.replace(/,/g, '');
  return /^-?(\d+\.?\d*|\.\d+)$/.test(s) ? Number(s) : NaN;
}

export function isAnswered(q: Question, a: Answer): boolean {
  if (a === undefined || a === '') return false;
  if (q.type === 'match') return typeof a === 'object' && !Array.isArray(a) && q.pairs.every(([l]) => (a as Record<string, string>)[l]);
  return true;
}

export function isCorrect(q: Question, a: Answer): boolean {
  switch (q.type) {
    case 'mcq': return a === q.options[0];
    case 'tf': return a === q.answer;
    case 'num': { const n = parseNum(a); return Number.isFinite(n) && Math.abs(n - q.answer) <= q.tol + 1e-9; }
    case 'order': return Array.isArray(a) && a.length === q.items.length && a.every((x, i) => x === q.items[i]);
    case 'match': return !!a && typeof a === 'object' && !Array.isArray(a) && q.pairs.every(([l, r]) => (a as Record<string, string>)[l] === r);
  }
}

export function correctAnswerText(q: Question): string {
  switch (q.type) {
    case 'mcq': return q.options[0];
    case 'tf': return q.answer ? 'True' : 'False';
    case 'num': return `${q.answer.toLocaleString('en-US', { maximumFractionDigits: 4 })}${q.unit ? ' ' + q.unit : ''}`;
    case 'order': return q.items.join(' → ');
    case 'match': return q.pairs.map(([l, r]) => `${l} — ${r}`).join('; ');
  }
}

export interface GradeResult { correct: number; total: number; score: number; passed: boolean; results: Record<string, boolean> }

export function grade(questions: Question[], answers: Record<string, Answer>, passMark: number): GradeResult {
  const results: Record<string, boolean> = {};
  let correct = 0;
  for (const q of questions) {
    const ok = isCorrect(q, answers[q.id]);
    results[q.id] = ok;
    if (ok) correct++;
  }
  const score = questions.length ? correct / questions.length : 0;
  return { correct, total: questions.length, score, passed: score + 1e-9 >= passMark, results };
}

/** Random question set without duplicates. */
export function pickQuestions(pool: Question[], n: number, rnd: () => number = Math.random): Question[] {
  const unique = [...new Map(pool.map((q) => [q.id, q])).values()];
  return shuffle(unique, rnd).slice(0, Math.min(n, unique.length));
}

export function byTopic(questions: Question[], results: Record<string, boolean>) {
  const out: Record<string, { correct: number; total: number }> = {};
  for (const q of questions) {
    const k = q.topic ?? 'General';
    out[k] ??= { correct: 0, total: 0 };
    out[k].total++;
    if (results[q.id]) out[k].correct++;
  }
  return out;
}
