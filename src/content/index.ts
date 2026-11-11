// Content registry. Merges the built-in curriculum with administrator edits stored in the CMS layer,
// so the UI never imports lesson data directly.
import { useSyncExternalStore } from 'react';
import type { ContentStatus, Lesson, LessonEntry, MissionDef, Module, Progress, Question, Term, Track, TrackId } from '../types';
import { mathTrack } from './math';
import { physicsTrack } from './physics';
import { atplTrack, cplTrack, pplTrack } from './pathways';
import { MISSIONS } from './missions';
import { GLOSSARY } from './reference';
import { ATPL_BANK, CPL_BANK, PPL_BANK } from './bank';
import { ENGLISH_BANK, LISTENING } from './english';

/** Listening questions are looked up by id for the mistake queue even though they are not in an exam pool. */
const LISTENING_QUESTIONS = LISTENING.flatMap((p) => p.questions);
import { tagQuestions } from './q';

export interface CmsState {
  status: Record<string, ContentStatus>;
  lessons: Record<string, Lesson>;
  added: { trackId: TrackId; moduleId: string; lessonId: string }[];
  terms: Term[];
  missions: Record<string, MissionDef>;
  history: { at: number; action: string; target: string; note?: string }[];
}

const CMS_KEY = 'skyward.cms.v1';
const emptyCms = (): CmsState => ({ status: {}, lessons: {}, added: [], terms: [], missions: {}, history: [] });
const storage = (): Storage | null => (typeof localStorage === 'undefined' ? null : localStorage);

function loadCms(): CmsState {
  try {
    const raw = storage()?.getItem(CMS_KEY);
    if (raw) return { ...emptyCms(), ...JSON.parse(raw) };
  } catch { /* corrupted CMS data falls back to built-in content */ }
  return emptyCms();
}

let cms = loadCms();
let cache: Track[] | null = null;
const listeners = new Set<() => void>();

export function updateCms(fn: (c: CmsState) => void, action: string, target: string, note?: string) {
  const next: CmsState = JSON.parse(JSON.stringify(cms));
  fn(next);
  next.history = [{ at: Date.now(), action, target, note }, ...next.history].slice(0, 200);
  cms = next;
  cache = null;
  try { storage()?.setItem(CMS_KEY, JSON.stringify(cms)); } catch { /* storage full or unavailable */ }
  listeners.forEach((l) => l());
}
export function resetCms() { cms = emptyCms(); cache = null; storage()?.removeItem(CMS_KEY); listeners.forEach((l) => l()); }
export const getCms = () => cms;
export const useCms = () => useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, getCms);

const BASE: Track[] = [mathTrack, physicsTrack, pplTrack, cplTrack, atplTrack];

function prepLesson(l: Lesson, topic: string): Lesson {
  return { ...l, practice: tagQuestions(l.practice, `${l.id}-p`, topic, l.id), assessment: tagQuestions(l.assessment, `${l.id}-a`, topic, l.id) };
}

/** All tracks, including unpublished lessons (the admin view). */
export function getTracks(): Track[] {
  if (cache) return cache;
  cache = BASE.map((t) => ({
    ...t,
    modules: t.modules.map((m): Module => {
      // An admin lesson replaces the built-in lesson, or the "In development" placeholder, that has the same id.
      const lessons: LessonEntry[] = m.lessons.map((l) => (cms.lessons[l.id] ? prepLesson(cms.lessons[l.id], m.title) : l));
      for (const a of cms.added) if (a.trackId === t.id && a.moduleId === m.id && cms.lessons[a.lessonId] && !lessons.some((l) => l.id === a.lessonId)) lessons.push(prepLesson(cms.lessons[a.lessonId], m.title));
      return { ...m, lessons };
    }),
  }));
  return cache;
}

/** Built-in lessons are published by default; lessons added in the admin panel start as drafts. */
export function lessonStatus(id: string): ContentStatus {
  return cms.status[id] ?? (cms.lessons[id] ? 'draft' : 'published');
}
export const isLive = (l: LessonEntry): l is Lesson => !l.planned && lessonStatus(l.id) === 'published';
export const getTrack = (id: string) => getTracks().find((t) => t.id === id);

export function liveLessons(track?: Track): Lesson[] {
  const seen = new Set<string>();
  const out: Lesson[] = [];
  for (const t of track ? [track] : getTracks()) for (const m of t.modules) for (const l of m.lessons) {
    if (isLive(l) && !seen.has(l.id)) { seen.add(l.id); out.push(l); }
  }
  return out;
}

export function findLesson(id: string): { lesson: Lesson; track: Track; module: Module } | undefined {
  for (const track of getTracks()) for (const module of track.modules) {
    const lesson = module.lessons.find((l) => l.id === id);
    if (lesson && !lesson.planned) return { lesson, track, module };
  }
  return undefined;
}

/** A lesson opens when it is first in a module or the previous live lesson in that module is passed. */
export function isUnlocked(id: string, p: Progress): boolean {
  if (p.lessons[id]?.passed) return true;
  for (const t of getTracks()) for (const m of t.modules) {
    const live = m.lessons.filter(isLive);
    const i = live.findIndex((l) => l.id === id);
    if (i === 0) return true;
    if (i > 0 && p.lessons[live[i - 1].id]?.passed) return true;
  }
  return false;
}

/** Next live lesson after `id`: same module first, then the first unpassed lesson later in the track. */
export function nextLesson(id: string, p: Progress): Lesson | undefined {
  const found = findLesson(id);
  if (!found) return undefined;
  const live = liveLessons(found.track);
  const i = live.findIndex((l) => l.id === id);
  return live.slice(i + 1).find((l) => !p.lessons[l.id]?.passed) ?? live.find((l) => !p.lessons[l.id]?.passed && l.id !== id);
}

/** The lesson recommended on the dashboard: first unlocked, unpassed lesson in curriculum order. */
export function recommendedLesson(p: Progress): Lesson | undefined {
  return liveLessons().find((l) => !p.lessons[l.id]?.passed && isUnlocked(l.id, p));
}

export function trackProgress(track: Track, p: Progress) {
  const live = liveLessons(track);
  const done = live.filter((l) => p.lessons[l.id]?.passed).length;
  const planned = track.modules.reduce((n, m) => n + m.lessons.filter((l) => l.planned).length, 0);
  return { done, total: live.length, planned, pct: live.length ? done / live.length : 0 };
}

export const allMissions = (): MissionDef[] => MISSIONS.map((m) => cms.missions[m.id] ?? m);
export const getMission = (id: string) => allMissions().find((m) => m.id === id);
export const getTerms = (): Term[] => [...GLOSSARY, ...cms.terms].sort((a, b) => a.term.localeCompare(b.term));

export const EXAM_POOLS = ['Mathematics', 'Physics', 'PPL theory', 'CPL theory', 'ATPL theory', 'Aviation English'] as const;
export type ExamPool = (typeof EXAM_POOLS)[number];

export function examPool(pool: ExamPool): Question[] {
  const fromTrack = (id: TrackId) => liveLessons(getTrack(id)).flatMap((l) => [...l.practice, ...l.assessment]);
  switch (pool) {
    case 'Mathematics': return fromTrack('math');
    case 'Physics': return fromTrack('physics');
    case 'PPL theory': return [...fromTrack('ppl').filter((q) => q.lessonId?.startsWith('ppl')), ...PPL_BANK];
    case 'CPL theory': return [...fromTrack('cpl'), ...CPL_BANK];
    case 'ATPL theory': return [...fromTrack('atpl'), ...ATPL_BANK];
    case 'Aviation English': return ENGLISH_BANK;
  }
}

export function questionById(id: string): Question | undefined {
  for (const pool of EXAM_POOLS) { const q = examPool(pool).find((x) => x.id === id); if (q) return q; }
  return LISTENING_QUESTIONS.find((x) => x.id === id);
}

/** Curriculum completeness report for the admin dashboard. */
export function completeness() {
  return getTracks().map((t) => {
    const entries = t.modules.flatMap((m) => m.lessons);
    return {
      track: t.title,
      complete: entries.filter((l) => !l.planned).length,
      published: entries.filter(isLive).length,
      planned: entries.filter((l) => l.planned).length,
    };
  });
}

export * from './reference';
export * from './formulas';
export * from './english';
export { MISSIONS };
