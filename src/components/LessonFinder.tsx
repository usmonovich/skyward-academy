import { useMemo, useState } from 'react';
import { useProgress } from '../store/progress';
import { getTracks, isLive, isUnlocked } from '../content';
import { searchLessons, type LessonEntryRef } from '../engine/lessonSearch';
import { Chip, Icon } from './ui';

/** Search box that jumps straight to any lesson: type a word from the title or topic and open it. */
export function LessonFinder() {
  const p = useProgress();
  const [q, setQ] = useState('');
  const entries = useMemo<LessonEntryRef[]>(() => getTracks().flatMap((track) => track.modules.flatMap((module) => module.lessons.filter(isLive).map((lesson) => ({ lesson, track, module })))), []);
  const hits = useMemo(() => searchLessons(entries, q), [entries, q]);
  const typed = q.trim().length > 0;
  return (
    <section className="card lesson-finder" aria-label="Find a lesson">
      <label className="search"><Icon name="search" size={18} /><span className="sr-only">Find a lesson</span>
        <input type="search" value={q} placeholder="Find a lesson: try “Mach”, “METAR” or “lift”" onChange={(e) => setQ(e.target.value)} autoComplete="off" /></label>
      {typed && (
        <div role="status" aria-live="polite">
          {hits.length === 0 ? <p className="small muted">No lesson matches “{q.trim()}”.</p> : (
            <ul className="finder-list">
              {hits.map(({ lesson, track, module }) => {
                const done = !!p.lessons[lesson.id]?.passed;
                const open = done || isUnlocked(lesson.id, p);
                return (
                  <li key={lesson.id}><a href={`#/lesson/${lesson.id}`}>
                    <span className="grow"><strong>{lesson.title}</strong><span className="small muted"> {track.title} · {module.title} · {lesson.minutes} min</span></span>
                    {done ? <Chip tone="ok">Passed</Chip> : open ? <Chip tone="accent">Open</Chip> : <Chip><Icon name="lock" size={12} /> Locked</Chip>}
                  </a></li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
