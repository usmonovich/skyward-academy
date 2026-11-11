// Merges two copies of a learner's progress (this device and the cloud) without losing anything earned on either.
// Earned values (XP, passes, best scores, stars, achievements) only ever grow, so they take the higher value.
// Preferences and queues, which can legitimately shrink, come from whichever copy changed most recently.
import type { Progress } from '../types';

const union = (a: string[], b: string[]) => [...new Set([...a, ...b])];

export function mergeProgress(local: Progress, remote: Progress, newer: 'local' | 'remote'): Progress {
  const pick = newer === 'local' ? local : remote;
  const out: Progress = { ...pick, id: local.id, guest: local.guest };

  out.xp = Math.max(local.xp, remote.xp);
  out.cardReviews = Math.max(local.cardReviews, remote.cardReviews);

  out.lessons = { ...remote.lessons };
  for (const [id, l] of Object.entries(local.lessons)) {
    const r = remote.lessons[id];
    out.lessons[id] = r ? { passed: l.passed || r.passed, best: Math.max(l.best, r.best), attempts: Math.max(l.attempts, r.attempts), at: Math.max(l.at ?? 0, r.at ?? 0) || undefined } : l;
  }
  out.missions = { ...remote.missions };
  for (const [id, m] of Object.entries(local.missions)) {
    const r = remote.missions[id];
    out.missions[id] = r ? { stars: Math.max(m.stars, r.stars), best: Math.max(m.best, r.best), at: Math.max(m.at, r.at) } : m;
  }
  out.english = { ...remote.english };
  for (const [id, e] of Object.entries(local.english)) {
    const r = remote.english[id];
    out.english[id] = r ? { best: Math.max(e.best, r.best), done: e.done || r.done, at: Math.max(e.at, r.at) } : e;
  }
  // Flashcards: keep the copy that has been reviewed more; on a tie, the one scheduled later.
  out.cards = { ...remote.cards };
  for (const [id, c] of Object.entries(local.cards)) {
    const r = remote.cards[id];
    out.cards[id] = !r || c.reps > r.reps || (c.reps === r.reps && c.due >= r.due) ? c : r;
  }
  out.achievements = { ...remote.achievements };
  for (const [id, at] of Object.entries(local.achievements)) out.achievements[id] = Math.min(at, remote.achievements[id] ?? at);
  out.activity = { ...remote.activity };
  for (const [day, xp] of Object.entries(local.activity)) out.activity[day] = Math.max(xp, remote.activity[day] ?? 0);
  out.topics = { ...remote.topics };
  for (const [t, s] of Object.entries(local.topics)) {
    const r = remote.topics[t];
    out.topics[t] = !r || s.total >= r.total ? s : r;
  }
  out.exams = [...new Map([...remote.exams, ...local.exams].map((e) => [e.id, e])).values()].sort((a, b) => b.date - a.date).slice(0, 50);
  out.favTerms = union(local.favTerms, remote.favTerms);
  out.favFormulas = union(local.favFormulas, remote.favFormulas);
  out.savedQuestions = union(local.savedQuestions, remote.savedQuestions);
  out.savedLessons = union(local.savedLessons, remote.savedLessons);
  out.labsUsed = union(local.labsUsed, remote.labsUsed);
  out.seenTutorial = local.seenTutorial || remote.seenTutorial;
  out.created = Math.min(local.created, remote.created);
  return out;
}

/** True if the cloud copy would gain nothing from an upload of `merged`. */
export const sameProgress = (a: Progress, b: Progress) => JSON.stringify({ ...a, id: '', guest: false }) === JSON.stringify({ ...b, id: '', guest: false });
