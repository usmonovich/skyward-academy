// Aviation tutor. Two modes:
//  1. Curriculum tutor (always available, offline): answers only from verified lesson, formula and glossary data.
//  2. AI tutor (optional): if VITE_TUTOR_ENDPOINT is configured, free-text questions are sent to the
//     server-side proxy in server/tutor-proxy.mjs together with the lesson context. No API key lives in the browser.
import type { Lesson, Progress, Question } from '../types';
import { APP } from '../config';
import { FORMULAS, findLesson, getTerms, liveLessons } from '../content';
import { correctAnswerText } from './assessment';
import { studyPlan, weakTopics } from './personalize';

export interface TutorCtx { lesson?: Lesson; question?: Question; lastWrong?: { q: Question; given: string } }
export type TutorAction = 'simple' | 'example' | 'steps' | 'hint' | 'another' | 'why' | 'plan' | 'prereq';
export interface TutorReply { text: string; question?: Question; source: 'Curriculum tutor' | 'AI tutor' }

const NO_LESSON = 'Open a lesson and I can explain it, show examples and give hints. You can also ask me about any aviation term or formula.';

export function tutorAction(action: TutorAction, ctx: TutorCtx, p: Progress, n = 0): TutorReply {
  const src = 'Curriculum tutor' as const;
  const l = ctx.lesson;
  switch (action) {
    case 'simple': return { source: src, text: l ? `In simple words: ${l.simple}` : NO_LESSON };
    case 'example': {
      if (!l) return { source: src, text: NO_LESSON };
      const ex = l.examples[n % l.examples.length];
      return { source: src, text: `Example — ${ex.title}\n${ex.steps[0]}\n\nTry to predict the next step before you ask for "Explain Step by Step".` };
    }
    case 'steps': {
      if (!l) return { source: src, text: NO_LESSON };
      const ex = l.examples[n % l.examples.length];
      return { source: src, text: `${ex.title}\n${ex.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}` };
    }
    case 'hint': {
      const q = ctx.question;
      if (!q) return { source: src, text: 'Open a practice question and I will give you a hint for it.' };
      const f = l?.sections.map((s) => s.formula).filter(Boolean).map((id) => FORMULAS.find((x) => x.id === id)).find(Boolean);
      return { source: src, text: q.hint ? `Hint: ${q.hint}` : f ? `Hint: think about which quantity you are asked for, then use ${f.name}: ${f.expr}. Write down what you know first.` : 'Hint: read the question again and underline what is given and what is asked. Then look for the matching idea in the lesson.' };
    }
    case 'another': {
      const pool = (l ? [...l.practice] : liveLessons().flatMap((x) => x.practice)).filter((q) => q.id !== ctx.question?.id);
      const q = pool[Math.floor(Math.random() * pool.length)];
      return q ? { source: src, text: 'Here is another question. Answer it below.', question: q } : { source: src, text: 'No more questions are available for this lesson yet.' };
    }
    case 'why': {
      const w = ctx.lastWrong;
      if (!w) return { source: src, text: 'When you answer a question incorrectly, ask me this and I will explain the reasoning.' };
      return { source: src, text: `You answered: ${w.given || '(no answer)'}.\nThe correct answer is: ${correctAnswerText(w.q)}.\nWhy: ${w.q.explain}` };
    }
    case 'prereq': {
      if (!l?.prereqs?.length) return { source: src, text: l ? 'This lesson has no prerequisites. If it feels hard, try "Explain Simply".' : NO_LESSON };
      const list = l.prereqs.map((id) => { const f = findLesson(id); return f ? `• ${f.lesson.title}${p.lessons[id]?.passed ? ' (passed)' : ' — recommended first'}` : null; }).filter(Boolean);
      return { source: src, text: `This lesson builds on:\n${list.join('\n')}` };
    }
    case 'plan': {
      const plan = studyPlan(p);
      const weak = weakTopics(p).slice(0, 3).map((t) => `${t.topic} (${Math.round(t.pct * 100)}%)`);
      return { source: src, text: `Your revision plan for today (${p.settings.dailyMinutes} min):\n${plan.map((i) => `• ${i.minutes} min — ${i.text}`).join('\n')}${weak.length ? `\n\nWeakest topics so far: ${weak.join(', ')}.` : ''}` };
    }
  }
}

/** Keyword search over verified curriculum data. Never invents content. */
export function tutorSearch(text: string, ctx: TutorCtx): TutorReply {
  const words = text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(' ').filter((w) => w.length > 2 && !['what', 'does', 'the', 'how', 'why', 'mean', 'explain', 'about', 'tell', 'are', 'and', 'for', 'is'].includes(w));
  if (!words.length) return { source: 'Curriculum tutor', text: 'Ask me about a term, a formula or a topic — for example "angle of attack", "QNH" or "lift equation".' };
  const score = (hay: string) => words.reduce((n, w) => n + (hay.toLowerCase().includes(w) ? 1 : 0), 0);
  const out: string[] = [];
  const terms = getTerms().map((t) => ({ t, s: score(t.term) * 3 + score(t.def) })).filter((x) => x.s >= 3).sort((a, b) => b.s - a.s).slice(0, 2);
  for (const { t } of terms) out.push(`${t.term}: ${t.def} ${t.tech}`);
  const formulas = FORMULAS.map((f) => ({ f, s: score(f.name) * 3 + score(f.topic) })).filter((x) => x.s >= 3).sort((a, b) => b.s - a.s).slice(0, 1);
  for (const { f } of formulas) out.push(`${f.name}: ${f.expr}. ${f.plain} Valid when: ${f.valid}`);
  const lessons = (ctx.lesson ? [ctx.lesson, ...liveLessons()] : liveLessons());
  for (const l of lessons) {
    const sec = l.sections.map((s) => ({ s, n: score(s.h) * 2 + score(s.body.join(' ')) })).sort((a, b) => b.n - a.n)[0];
    if (sec && sec.n >= 2 && out.length < 3) { out.push(`From the lesson "${l.title}" — ${sec.s.h}: ${sec.s.body[0].replace(/[*`]/g, '')}`); break; }
  }
  if (!out.length) return { source: 'Curriculum tutor', text: 'I could not find that in the verified curriculum, and I will not guess. Try a different term, or check the Aviation Dictionary. For regulations and aircraft limitations always use the official documents of your authority and aircraft.' };
  return { source: 'Curriculum tutor', text: out.join('\n\n') };
}

/** Free-text question: AI tutor when configured, otherwise curriculum search. */
export async function tutorAsk(text: string, ctx: TutorCtx): Promise<TutorReply> {
  if (!APP.tutorEndpoint) return tutorSearch(text, ctx);
  try {
    const res = await fetch(APP.tutorEndpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text.slice(0, 2000),
        lesson: ctx.lesson ? { title: ctx.lesson.title, objectives: ctx.lesson.objectives, summary: ctx.lesson.simple, sections: ctx.lesson.sections.map((s) => ({ heading: s.h, text: s.body.join(' '), limitation: s.note })) } : null,
        question: ctx.question ? { prompt: ctx.question.prompt } : null,
      }),
    });
    if (!res.ok) throw new Error(`Tutor service returned ${res.status}`);
    const data = (await res.json()) as { reply?: string };
    if (!data.reply) throw new Error('Empty reply');
    return { source: 'AI tutor', text: data.reply };
  } catch {
    const local = tutorSearch(text, ctx);
    return { ...local, text: `The AI tutor service could not be reached, so this answer comes from the built-in curriculum.\n\n${local.text}` };
  }
}
