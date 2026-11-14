// Pure lesson search used by the lesson finder. Matches every word of the query against the lesson title,
// its module and track names and its objectives, ranking title matches first.
import type { Lesson, Module, Track } from '../types';

export interface LessonEntryRef { lesson: Lesson; track: Track; module: Module }
export interface LessonHit extends LessonEntryRef { score: number }

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');

export function searchLessons(entries: LessonEntryRef[], query: string, limit = 8): LessonHit[] {
  const words = norm(query).split(/[^a-z0-9]+/).filter(Boolean);
  if (!words.length) return [];
  const hits: LessonHit[] = [];
  for (const e of entries) {
    const title = norm(e.lesson.title);
    const context = norm(`${e.module.title} ${e.track.title} ${e.lesson.objectives.join(' ')}`);
    let score = 0;
    let all = true;
    for (const w of words) {
      if (title.startsWith(w) || title.includes(` ${w}`)) score += 4;
      else if (title.includes(w)) score += 3;
      else if (context.includes(w)) score += 1;
      else { all = false; break; }
    }
    if (all) hits.push({ ...e, score });
  }
  return hits.sort((a, b) => b.score - a.score || a.lesson.title.localeCompare(b.lesson.title)).slice(0, limit);
}
