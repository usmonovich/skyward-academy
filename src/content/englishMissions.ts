import type { EnglishRing, MissionDef, Question } from '../types';
import { mulberry32 } from '../engine/assessment';
import { ATC_SCENARIOS, CALLSIGN, EN_EXERCISES, LISTENING, PHONETIC, type AtcStep, type EnglishExercise } from './english';

/**
 * One flight per Aviation English exercise. The radio calls are built from content that already exists in the app
 * (quiz questions, listening passages, ATC scenario steps, the phonetic alphabet), so every phrase was reviewed there.
 * They are practice items written for Skyward Academy, not official examination questions, and the game gives no
 * ICAO language proficiency rating.
 */

const shuffled = <T,>(arr: T[], seed: number): T[] => { const r = mulberry32(seed); const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const spread = <T,>(arr: T[], n: number): T[] => (arr.length <= n ? arr : Array.from({ length: n }, (_, i) => arr[Math.floor((i * arr.length) / n)]));
const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

type Opt = { text: string; correct?: boolean; feedback: string };
const withOptions = (correct: Opt, wrong: Opt[], seed: number): Opt[] => shuffled([correct, ...wrong], seed);

/** A multiple-choice or true/false question from the existing bank, as a radio-call ring. */
function fromQuestion(q: Question, extra: Pick<EnglishRing, 'skill' | 'topic' | 'transmission' | 'safetyCritical'>, seed: number): EnglishRing | null {
  if (q.type === 'mcq') {
    return { ...extra, prompt: q.prompt, options: shuffled(q.options.map((text, i) => ({ text, correct: i === 0, feedback: i === 0 ? `Correct. ${q.explain}` : `Not quite. ${q.explain}` })), seed) };
  }
  if (q.type === 'tf') {
    return { ...extra, prompt: q.prompt, options: [{ text: 'True', correct: q.answer, feedback: `${q.answer ? 'Correct' : 'Not quite'}. ${q.explain}` }, { text: 'False', correct: !q.answer, feedback: `${q.answer ? 'Not quite' : 'Correct'}. ${q.explain}` }] };
  }
  if (q.type === 'match') {
    // One pair becomes one call: pick the meaning of a word, with the other pairs' meanings as the wrong answers.
    const k = seed % q.pairs.length; const [word, meaning] = q.pairs[k];
    const opts: Opt[] = q.pairs.map(([, m], i) => ({ text: m, correct: i === k, feedback: i === k ? `Correct. ${q.explain}` : `Not quite. That describes a different word. ${q.explain}` }));
    return { ...extra, prompt: `${q.prompt} Which meaning fits “${word}”?`, options: shuffled(opts, seed), } as EnglishRing;
  }
  return null;
}

// ---- Phonetic alphabet ------------------------------------------------------------------------------------------------
const NAME = new Map(PHONETIC);
const CONFUSABLE: Record<string, string> = { B: 'D', D: 'B', M: 'N', N: 'M', P: 'T', T: 'P', F: 'S', S: 'F', C: 'Z', Z: 'C', V: 'B', K: 'Q', Q: 'K', G: 'J', J: 'G' };
const SIGNS = ['DKR', 'HNM', 'QTW', 'BZX', 'LUV', 'EPY', 'FGJ', 'OSA'];
function alphabetRing(sign: string, seed: number): EnglishRing {
  const spoken = [...sign].map((c) => NAME.get(c)).join(' ');
  const [a, b, c] = [...sign];
  const alt = (ch: string) => CONFUSABLE[ch] ?? String.fromCharCode(((ch.charCodeAt(0) - 64) % 26) + 65);
  const cands = [alt(a) + b + c, a + c + b, a + b + alt(c), b + a + c, a + alt(b) + c].filter((x, i, arr) => x !== sign && arr.indexOf(x) === i).slice(0, 3);
  const letters = (s: string) => [...s].join('-');
  return {
    skill: 'comprehension', topic: 'alphabet', transmission: `Aircraft registration: ${spoken}.`, prompt: 'Which registration did the controller spell?',
    options: withOptions({ text: letters(sign), correct: true, feedback: `Correct. ${spoken} spells ${letters(sign)}.` }, cands.map((x) => ({ text: letters(x), feedback: `Not quite. The call was ${spoken}, which spells ${letters(sign)}.` })), seed),
  };
}

// ---- Numbers by ear -----------------------------------------------------------------------------------------------------
const DIGIT = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'niner'];
const sayDigits = (s: string) => [...s].map((c) => (c === '.' ? 'decimal' : DIGIT[Number(c)])).join(' ');
const NUMBERS: { lead: string; digits: string; show: (d: string) => string }[] = [
  { lead: 'Heading', digits: '340', show: (d) => d },
  { lead: 'Flight level', digits: '120', show: (d) => `FL${d}` },
  { lead: 'Contact tower on frequency', digits: '118.7', show: (d) => d },
  { lead: 'Squawk', digits: '4521', show: (d) => d },
  { lead: 'QNH', digits: '1013', show: (d) => d },
  { lead: 'Runway', digits: '27', show: (d) => d },
  { lead: 'Wind', digits: '240', show: (d) => `${d} degrees` },
  { lead: 'Heading', digits: '095', show: (d) => d },
];
function numberRing(n: (typeof NUMBERS)[number], seed: number): EnglishRing {
  const d = n.digits; const plain = d.replace('.', '');
  const swap = (s: string, i: number) => s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2);
  const back = (s: string) => (d.includes('.') ? s.slice(0, 3) + '.' + s.slice(3) : s);
  const cands = [back(swap(plain, 0)), back(swap(plain, plain.length - 2)), back([...plain].reverse().join('')), back(plain.slice(0, -1) + String((Number(plain.slice(-1)) + 1) % 10))].filter((x, i, a) => x !== d && a.indexOf(x) === i).slice(0, 3);
  return {
    skill: 'comprehension', topic: 'numbers', safetyCritical: true, transmission: `${n.lead} ${sayDigits(d)}.`, prompt: 'Which value did you hear?',
    options: withOptions({ text: n.show(d), correct: true, feedback: `Correct. "${sayDigits(d)}" is ${d}. Numbers in clearances are safety-critical: listen to every digit.` }, cands.map((x) => ({ text: n.show(x), feedback: `Not quite. The digits were "${sayDigits(d)}", which is ${d}. A swapped digit can mean a different heading, level or frequency.` })), seed),
  };
}

// ---- Readbacks from the ATC scenarios -----------------------------------------------------------------------------------
const SWAPS: [RegExp, string][] = [[/cleared to land/i, 'cleared for take-off'], [/line up and wait/i, 'cleared for take-off'], [/cleared for take.?off/i, 'line up and wait'], [/\bclimb\b/i, 'descend'], [/\bdescend\b/i, 'climb'], [/\bleft\b/i, 'right'], [/\bright\b/i, 'left']];
function readbackRing(step: AtcStep, seed: number): EnglishRing | null {
  if (step.kind !== 'readback' || !step.atc) return null;
  const model = step.model;
  const noCall = clean(model.replace(new RegExp(`,?\\s*${CALLSIGN}[.,]?`), '').replace(/,\s*$/, '')) + '.';
  const roger = `Roger, ${CALLSIGN}.`;
  const swapRule = SWAPS.find(([re]) => re.test(model));
  const swapped = swapRule ? model.replace(swapRule[0], swapRule[1]) : null;
  const numberChanged = model.replace(/\b(\d{2,4})\b/, (m) => m.slice(1) + m[0]);
  const wrong: Opt[] = [];
  wrong.push({ text: roger, feedback: '"Roger" only means received. Clearances, headings, levels and runways must be read back, not just acknowledged.' });
  if (numberChanged !== model) wrong.push({ text: numberChanged, feedback: 'The numbers do not match what the controller said. Numbers are the most safety-critical part of a readback.' });
  if (swapped && swapped !== model) wrong.push({ text: swapped, feedback: 'The key instruction is wrong: you would be accepting the opposite of what the controller said.' });
  if (noCall && noCall !== model && noCall !== `${model}.`) wrong.push({ text: noCall, feedback: 'The content is right but the call sign is missing, so ATC cannot be sure who accepted the instruction.' });
  const options = withOptions({ text: model, correct: true, feedback: `Correct. That is a complete readback with the call sign.` }, wrong.slice(0, 3), seed);
  return { skill: 'phraseology', topic: 'readback', safetyCritical: true, transmission: step.atc, prompt: 'Choose the correct readback.', options, voice: step.required };
}

// ---- Assembling the missions ----------------------------------------------------------------------------------------------
const TOPIC_BY_EXERCISE: Record<string, EnglishRing['topic']> = { 'en-vocab': 'airport', 'en-phrase': 'readback', 'en-clarify': 'atc', 'en-listen-everyday': 'weather', 'en-listen': 'atc', 'en-listen-l4': 'emergency', 'en-listen-l5': 'emergency' };
const PHRASEOLOGY = new Set(['en-phrase', 'en-clarify']);
const CRITICAL = new Set(['en-phrase', 'en-clarify', 'en-listen-l4', 'en-listen-l5']);

function ringsFor(ex: EnglishExercise, seed: number): EnglishRing[] {
  const topic = TOPIC_BY_EXERCISE[ex.id] ?? 'plain';
  const rings: (EnglishRing | null)[] = [];
  if (ex.kind === 'alphabet') SIGNS.slice(0, 6).forEach((s, i) => rings.push(alphabetRing(s, seed + i)));
  else if (ex.kind === 'numbers') NUMBERS.slice(0, 6).forEach((n, i) => rings.push(numberRing(n, seed + i)));
  else if (ex.kind === 'atc') {
    const steps = ATC_SCENARIOS.flatMap((s) => s.steps).filter((s) => s.kind === 'readback');
    spread(steps, 6).forEach((s, i) => rings.push(readbackRing(s, seed + i)));
  } else if (ex.kind === 'listening') {
    for (const pid of ex.passages ?? []) {
      const p = LISTENING.find((x) => x.id === pid); if (!p) continue;
      const text = p.lines.map((l) => `${l.who}: ${l.text}`).join(' ');
      p.questions.forEach((q, i) => rings.push(fromQuestion(q, { skill: 'comprehension', topic, transmission: text, safetyCritical: CRITICAL.has(ex.id) }, seed + i)));
    }
  } else {
    (ex.questions ?? []).forEach((q, i) => rings.push(fromQuestion(q, { skill: PHRASEOLOGY.has(ex.id) ? 'phraseology' : 'comprehension', topic, transmission: '', safetyCritical: CRITICAL.has(ex.id) }, seed + i)));
  }
  return spread(rings.filter((r): r is EnglishRing => !!r), 6);
}

const TIER = (stage: number): MissionDef['tier'] => (stage <= 3 ? 'Beginner' : stage <= 5 ? 'Intermediate' : stage <= 7 ? 'Advanced' : 'Expert');
const AIRCRAFT = ['sparrow', 'sparrow', 'kestrel', 'kestrel', 'gemini', 'albatross', 'falcon', 'skyliner'];
const ENV: Record<string, MissionDef['env']> = { quiz: 'countryside', alphabet: 'airfield', numbers: 'golden', listening: 'overcast', atc: 'night' };

export function buildEnglishMissions(): MissionDef[] {
  return EN_EXERCISES.map((ex, i) => {
    const seed = 6000 + i * 31;
    const rings = ringsFor(ex, seed);
    const phrase = ex.kind === 'atc' || PHRASEOLOGY.has(ex.id);
    return {
      id: `e-${ex.id.replace(/^en-/, '')}`, title: `${ex.title}: Radio Flight`, requiresEnglish: [ex.id],
      tier: TIER(ex.stage), style: 'Educational simulation', aircraftId: AIRCRAFT[Math.min(ex.stage, 8) - 1], env: ENV[ex.kind] ?? 'countryside', seed: 501 + i, length: 12000, parTime: 52,
      checkpoints: 12, obstacles: { density: 0.22, types: ['balloon', 'birds'] }, xp: 80 + ex.stage * 5, english: { topic: ex.title, rings },
      concept: `${ex.title}: ${ex.blurb}`,
      objective: `Fly the route and answer ${rings.length} radio calls at the purple rings. Each question is scored on its own: language, ${phrase ? 'standard phraseology, ' : ''}and aircraft control are reported separately.`,
      briefing: `You have just passed "${ex.title}". Now use it in the air: at each purple ring a radio call comes in and the flight pauses until you answer. Answers are by tap; where your browser supports it you can also hear the call, and readbacks can be spoken. These are practice questions written for Skyward Academy, not official examination questions, and the game gives no ICAO language proficiency rating. A wrong safety-critical call means the mission cannot earn three stars.`,
      outcome: `Use ${ex.title.toLowerCase()} while flying.`,
    } satisfies MissionDef;
  });
}
