// Pure helpers for browsing the mission catalogue: filtering, searching, summaries and the "up next" suggestion.
// Used by the Fly page and the post-flight debrief. No storage, no side effects.
import type { MissionDef, Progress } from '../types';

export type Track = 'all' | 'free' | 'math' | 'phys' | 'ppl' | 'cpl' | 'atpl';
export type Status = 'all' | 'ready' | 'done' | 'locked';

export const TRACKS: [Track, string][] = [['all', 'All tracks'], ['free', 'Free flight'], ['math', 'Mathematics'], ['phys', 'Physics'], ['ppl', 'PPL'], ['cpl', 'CPL'], ['atpl', 'ATPL']];
export const STATUSES: [Status, string][] = [['all', 'Any status'], ['ready', 'Ready to fly'], ['done', 'Already flown'], ['locked', 'Locked']];

/** Which curriculum track a mission belongs to, taken from its lesson id (free-flight missions have none). */
export function trackOf(m: MissionDef): Exclude<Track, 'all'> {
  const prefix = m.lessonId?.split('-')[0];
  return prefix === 'math' || prefix === 'phys' || prefix === 'ppl' || prefix === 'cpl' || prefix === 'atpl' ? prefix : 'free';
}

export const isOpen = (m: MissionDef, p: Progress): boolean => !m.lessonId || !!p.lessons[m.lessonId]?.passed;
export const isFlown = (m: MissionDef, p: Progress): boolean => !!p.missions[m.id];

export interface MissionFilter { query?: string; track?: Track; status?: Status; tier?: string }

export function filterMissions(missions: MissionDef[], p: Progress, f: MissionFilter): MissionDef[] {
  const q = (f.query ?? '').trim().toLowerCase();
  return missions.filter((m) => {
    if (f.tier && m.tier !== f.tier) return false;
    if (f.track && f.track !== 'all' && trackOf(m) !== f.track) return false;
    if (f.status === 'ready' && !(isOpen(m, p) && !isFlown(m, p))) return false;
    if (f.status === 'done' && !isFlown(m, p)) return false;
    if (f.status === 'locked' && isOpen(m, p)) return false;
    if (q && !`${m.title} ${m.objective} ${m.outcome ?? ''}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

export interface MissionSummary { total: number; open: number; flown: number; locked: number; threeStars: number }

export function summarise(missions: MissionDef[], p: Progress): MissionSummary {
  const open = missions.filter((m) => isOpen(m, p)).length;
  return {
    total: missions.length, open, locked: missions.length - open,
    flown: missions.filter((m) => isFlown(m, p)).length,
    threeStars: missions.filter((m) => (p.missions[m.id]?.stars ?? 0) >= 3).length,
  };
}

/**
 * The next mission worth flying: an open, not-yet-flown mission, preferring lesson missions over free flights and
 * the ones after `afterId` in catalogue order. Returns undefined when everything open has been flown.
 */
export function nextMission(missions: MissionDef[], p: Progress, afterId?: string): MissionDef | undefined {
  const candidates = missions.filter((m) => m.id !== afterId && isOpen(m, p) && !isFlown(m, p));
  if (!candidates.length) return undefined;
  const lessonOnes = candidates.filter((m) => m.lessonId);
  const pool = lessonOnes.length ? lessonOnes : candidates;
  const at = afterId ? missions.findIndex((m) => m.id === afterId) : -1;
  return pool.find((m) => missions.indexOf(m) > at) ?? pool[0];
}
