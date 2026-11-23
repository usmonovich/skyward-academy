import { describe, expect, it } from 'vitest';
import { MISSIONS, getTracks, liveLessons } from '../src/content';
import { validateLesson } from '../src/content/validate';

describe('curriculum and mission counts (the numbers quoted in the README)', () => {
  const tracks = getTracks();
  const entries = tracks.flatMap((t) => t.modules.flatMap((m) => m.lessons));

  it('has no placeholder lessons, and every published lesson is valid', () => {
    expect(entries.filter((l) => l.planned)).toHaveLength(0);
    for (const l of liveLessons()) expect(validateLesson(l), l.id).toEqual([]);
  });

  it('counts each pathway, and explains why the pathway total is larger than the number of unique lessons', () => {
    const per = Object.fromEntries(tracks.map((t) => [t.id, t.modules.flatMap((m) => m.lessons).length]));
    expect(per).toEqual({ math: 40, physics: 47, ppl: 59, cpl: 32, atpl: 49 });
    const sum = Object.values(per).reduce((a, b) => a + b, 0);
    const unique = liveLessons().length;
    expect(sum).toBe(227);
    expect(unique).toBe(223);
    // PPL Phase A re-uses four Pre-Flight Academy lessons, so they appear in two pathways but are one lesson.
    const owners = new Map<string, string[]>();
    for (const t of tracks) for (const l of t.modules.flatMap((m) => m.lessons)) owners.set(l.id, [...(owners.get(l.id) ?? []), t.id]);
    const shared = [...owners.entries()].filter(([, v]) => v.length > 1).map(([k]) => k).sort();
    expect(shared).toEqual(['math-dst', 'math-units', 'phys-lift', 'phys-pressure']);
    expect(sum - shared.length).toBe(unique);
  });

  it('breaks the missions down: lesson missions, challenges, English flights and free flights', () => {
    const kinds = { lesson: 0, challenge: 0, english: 0, free: 0 };
    for (const m of MISSIONS) { if (m.requiresEnglish) kinds.english++; else if (m.lessonId) kinds.lesson++; else if (m.requires) kinds.challenge++; else kinds.free++; }
    expect(kinds).toEqual({ lesson: 223, challenge: 12, english: 17, free: 2 });
    expect(MISSIONS).toHaveLength(254);
    // The earlier autopilot analysis covered 216 missions: it ran before the 21 maths and physics lessons (and their missions) and the 17 English flights were added.
    expect(MISSIONS.length - 21 - 17).toBe(216);
    expect(new Set(MISSIONS.map((m) => m.id)).size).toBe(MISSIONS.length);
  });
});
