// Structural validation for content edited in the admin panel. Returns a list of human-readable problems.
import type { Lesson, MissionDef } from '../types';

const isStr = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const isArr = (v: unknown): v is unknown[] => Array.isArray(v);

function checkQuestion(q: unknown, where: string): string[] {
  const e: string[] = [];
  if (!q || typeof q !== 'object') return [`${where}: must be an object.`];
  const x = q as Record<string, unknown>;
  if (!isStr(x.prompt)) e.push(`${where}: "prompt" is required.`);
  if (!isStr(x.explain)) e.push(`${where}: "explain" (the answer explanation) is required.`);
  switch (x.type) {
    case 'mcq': if (!isArr(x.options) || x.options.length < 2 || !x.options.every(isStr)) e.push(`${where}: "options" needs at least two texts; the first is the correct answer.`); else if (new Set(x.options).size !== x.options.length) e.push(`${where}: options must be different from each other.`); break;
    case 'tf': if (typeof x.answer !== 'boolean') e.push(`${where}: "answer" must be true or false.`); break;
    case 'num': if (typeof x.answer !== 'number' || typeof x.tol !== 'number' || x.tol < 0) e.push(`${where}: "answer" and a non-negative "tol" (tolerance) must be numbers.`); if (typeof x.unit !== 'string') e.push(`${where}: "unit" must be text (it may be empty).`); break;
    case 'order': if (!isArr(x.items) || x.items.length < 2 || !x.items.every(isStr)) e.push(`${where}: "items" needs at least two texts in the correct order.`); break;
    case 'match': if (!isArr(x.pairs) || x.pairs.length < 2 || !x.pairs.every((p) => isArr(p) && p.length === 2 && p.every(isStr))) e.push(`${where}: "pairs" needs at least two [left, right] pairs.`); break;
    default: e.push(`${where}: "type" must be mcq, tf, num, order or match.`);
  }
  return e;
}

export function validateLesson(value: unknown): string[] {
  if (!value || typeof value !== 'object') return ['The lesson must be a JSON object.'];
  const l = value as Record<string, unknown>;
  const e: string[] = [];
  if (!isStr(l.id) || !/^[a-z0-9-]+$/.test(l.id as string)) e.push('"id" is required and may contain only lower-case letters, digits and hyphens.');
  for (const k of ['title', 'intro', 'simple', 'missionId']) if (!isStr(l[k])) e.push(`"${k}" is required.`);
  if (typeof l.minutes !== 'number' || l.minutes < 1 || l.minutes > 60) e.push('"minutes" must be a number from 1 to 60.');
  if (![1, 2, 3].includes(l.level as number)) e.push('"level" must be 1, 2 or 3.');
  if (!isArr(l.objectives) || !l.objectives.length || !l.objectives.every(isStr)) e.push('"objectives" needs at least one learning objective.');
  if (!isArr(l.sources) || !l.sources.every(isStr)) e.push('"sources" must list source ids (it may be empty while drafting).');
  if (!isArr(l.sections) || !l.sections.length) e.push('"sections" needs at least one section.');
  else l.sections.forEach((s, i) => { const x = s as Record<string, unknown>; if (!isStr(x?.h) || !isArr(x?.body) || !x.body.length || !x.body.every(isStr)) e.push(`Section ${i + 1}: needs a heading "h" and a non-empty "body" list of paragraphs.`); });
  if (!isArr(l.examples) || !l.examples.length) e.push('"examples" needs at least one worked example.');
  else l.examples.forEach((s, i) => { const x = s as Record<string, unknown>; if (!isStr(x?.title) || !isArr(x?.steps) || !x.steps.length) e.push(`Example ${i + 1}: needs a "title" and "steps".`); });
  for (const k of ['practice', 'assessment'] as const) {
    if (!isArr(l[k]) || (l[k] as unknown[]).length < 3) e.push(`"${k}" needs at least three questions.`);
    else (l[k] as unknown[]).forEach((q, i) => e.push(...checkQuestion(q, `${k} question ${i + 1}`)));
  }
  if (isArr(l.assessment)) {
    const prompts = (l.assessment as { prompt?: string }[]).map((q) => q?.prompt);
    if (new Set(prompts).size !== prompts.length) e.push('Assessment questions must not repeat the same prompt.');
  }
  return e;
}

export function validateMission(value: unknown): string[] {
  if (!value || typeof value !== 'object') return ['The mission must be a JSON object.'];
  const m = value as Partial<MissionDef> & Record<string, unknown>;
  const e: string[] = [];
  for (const k of ['id', 'title', 'objective', 'briefing', 'outcome', 'aircraftId', 'env']) if (!isStr(m[k])) e.push(`"${k}" is required.`);
  if (typeof m.length !== 'number' || m.length < 4000 || m.length > 30000) e.push('"length" must be a number from 4000 to 30000.');
  if (typeof m.parTime !== 'number' || m.parTime < 10) e.push('"parTime" must be at least 10 seconds.');
  if (typeof m.checkpoints !== 'number' || m.checkpoints < 0 || m.checkpoints > 20) e.push('"checkpoints" must be from 0 to 20.');
  if (!m.obstacles || typeof m.obstacles.density !== 'number' || !isArr(m.obstacles.types) || !m.obstacles.types.length) e.push('"obstacles" needs a "density" number and at least one obstacle type.');
  if (typeof m.xp !== 'number' || m.xp < 0) e.push('"xp" must be a non-negative number.');
  if (m.decisions) for (const [i, d] of (m.decisions as { options?: { correct?: boolean }[] }[]).entries()) if (!isArr(d.options) || d.options.filter((o) => o.correct).length !== 1) e.push(`Decision ${i + 1}: exactly one option must be marked correct.`);
  return e;
}

export const LESSON_TEMPLATE = (id: string): Lesson => ({
  id, title: 'New lesson title', minutes: 10, level: 1,
  objectives: ['State the first learning objective.'],
  intro: 'Introduce the topic in two or three sentences.',
  simple: 'A one-paragraph plain-English summary used by the tutor.',
  sections: [{ h: 'First idea', body: ['Explain the idea from the ground up. Use **bold** for key terms and `backticks` for formulas.'] }],
  examples: [{ title: 'Worked example', steps: ['State the problem.', 'Show the working.', 'State the result with its unit.'] }],
  practice: [
    { id: '', type: 'mcq', prompt: 'Practice question 1?', options: ['Correct answer', 'Wrong answer A', 'Wrong answer B'], explain: 'Explain why the answer is correct.' },
    { id: '', type: 'tf', prompt: 'Practice statement 2.', answer: true, explain: 'Explain.' },
    { id: '', type: 'num', prompt: 'Practice calculation 3?', answer: 10, tol: 0.1, unit: 'm', explain: 'Show the calculation.' },
  ],
  assessment: [
    { id: '', type: 'mcq', prompt: 'Assessment question 1?', options: ['Correct answer', 'Wrong answer A', 'Wrong answer B'], explain: 'Explain.' },
    { id: '', type: 'tf', prompt: 'Assessment statement 2.', answer: false, explain: 'Explain.' },
    { id: '', type: 'num', prompt: 'Assessment calculation 3?', answer: 5, tol: 0.1, unit: 's', explain: 'Show the calculation.' },
  ],
  missionId: 'm-free-coast', sources: [],
});
