// Adaptive recommendations. These only suggest what to study next; they never hide curriculum.
import type { Progress } from '../types';
import { findLesson, isUnlocked, liveLessons, questionById, recommendedLesson } from '../content';
import { isDue } from './srs';

export interface TopicStat { topic: string; correct: number; total: number; pct: number }

export function topicStats(p: Progress): TopicStat[] {
  return Object.entries(p.topics).map(([topic, s]) => ({ topic, ...s, pct: s.total ? s.correct / s.total : 0 })).sort((a, b) => a.pct - b.pct);
}
export const weakTopics = (p: Progress) => topicStats(p).filter((t) => t.total >= 3 && t.pct < 0.7);
export const strongTopics = (p: Progress) => topicStats(p).filter((t) => t.total >= 5 && t.pct >= 0.9);
export const dueCards = (p: Progress) => Object.entries(p.cards).filter(([, c]) => isDue(c)).map(([id]) => id);

/** Lessons whose questions the learner keeps missing, with their prerequisites first. */
export function revisionLessons(p: Progress): string[] {
  const counts = new Map<string, number>();
  for (const m of p.mistakes) { const id = questionById(m.qid)?.lessonId; if (id) counts.set(id, (counts.get(id) ?? 0) + 1); }
  const out: string[] = [];
  for (const [id, n] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
    if (n < 2) continue;
    for (const pre of findLesson(id)?.lesson.prereqs ?? []) if (!p.lessons[pre]?.passed && !out.includes(pre)) out.push(pre);
    if (!out.includes(id)) out.push(id);
  }
  return out.slice(0, 4);
}

export interface PlanItem { minutes: number; text: string; link: string }

/** A realistic study session sized to the learner's daily time budget. */
export function studyPlan(p: Progress): PlanItem[] {
  const budget = p.settings.dailyMinutes;
  const items: PlanItem[] = [];
  let used = 0;
  const add = (minutes: number, text: string, link: string) => { if (used + minutes <= budget + 2 || items.length === 0) { items.push({ minutes, text, link }); used += minutes; } };
  const due = dueCards(p).length;
  if (due) add(Math.min(5, Math.ceil(due / 4)), `Review ${due} due flashcard${due === 1 ? '' : 's'}`, 'knowledge/flashcards');
  if (p.mistakes.length) add(5, `Retry ${Math.min(p.mistakes.length, 5)} questions from your mistake queue`, 'knowledge/revision');
  const rev = revisionLessons(p)[0];
  if (rev) { const l = findLesson(rev)?.lesson; if (l) add(l.minutes, `Revise "${l.title}"`, `lesson/${l.id}`); }
  const next = recommendedLesson(p);
  if (next) add(next.minutes, `New lesson: "${next.title}"`, `lesson/${next.id}`);
  const strong = strongTopics(p).length >= 3;
  if (strong) add(8, 'Optional challenge: 10-question timed practice exam', 'exams');
  if (used + 5 <= budget) add(5, 'Aviation English: one short exercise', 'english');
  return items;
}

export function weeklyPlan(p: Progress): string {
  const remaining = liveLessons().filter((l) => !p.lessons[l.id]?.passed).length;
  const perWeek = Math.max(1, Math.floor((p.settings.dailyMinutes * 5) / 25));
  if (!remaining) return 'You have passed every published lesson. Keep your knowledge fresh with flashcards and practice exams while new lessons are developed.';
  return `At ${p.settings.dailyMinutes} minutes a day, five days a week, plan about ${perWeek} new lesson${perWeek === 1 ? '' : 's'} per week plus daily flashcards. ${remaining} published lesson${remaining === 1 ? '' : 's'} remain — roughly ${Math.ceil(remaining / perWeek)} week${Math.ceil(remaining / perWeek) === 1 ? '' : 's'}.`;
}

export const unlockedCount = (p: Progress) => liveLessons().filter((l) => isUnlocked(l.id, p)).length;
