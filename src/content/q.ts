// Small authoring helpers so curriculum data stays compact and typed.
import type { Lesson, PlannedLesson, Question, QLabel } from '../types';

export const mcq = (prompt: string, options: string[], explain: string, hint?: string): Question =>
  ({ id: '', type: 'mcq', prompt, options, explain, hint });
export const tf = (prompt: string, answer: boolean, explain: string, hint?: string): Question =>
  ({ id: '', type: 'tf', prompt, answer, explain, hint });
export const num = (prompt: string, answer: number, tol: number, unit: string, explain: string, hint?: string): Question =>
  ({ id: '', type: 'num', prompt, answer, tol, unit, explain, hint });
export const order = (prompt: string, items: string[], explain: string, hint?: string): Question =>
  ({ id: '', type: 'order', prompt, items, explain, hint });
export const match = (prompt: string, pairs: [string, string][], explain: string, hint?: string): Question =>
  ({ id: '', type: 'match', prompt, pairs, explain, hint });
export const scenario = (q: Question): Question => ({ ...q, label: 'Scenario-based training question' });

const DEFAULT_LABEL: QLabel = 'Original practice question';

/** Assigns stable question ids, topic and provenance label. */
export function tagQuestions(qs: Question[], prefix: string, topic: string, lessonId?: string): Question[] {
  return qs.map((q, i) => ({ ...q, id: q.id || `${prefix}${i + 1}`, topic: q.topic ?? topic, lessonId, label: q.label ?? DEFAULT_LABEL }));
}

export function lesson(topic: string, l: Lesson): Lesson {
  return {
    ...l,
    practice: tagQuestions(l.practice, `${l.id}-p`, topic, l.id),
    assessment: tagQuestions(l.assessment, `${l.id}-a`, topic, l.id),
  };
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const planned = (prefix: string, titles: string[]): PlannedLesson[] =>
  titles.map((title) => ({ id: `${prefix}-${slug(title)}`, title, planned: true }));
