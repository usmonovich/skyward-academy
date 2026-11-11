// Rule-based virtual air traffic controller. It evaluates what the learner actually transmitted and
// chooses its next transmission accordingly (accept, correct, repeat, or ask to say again).
// It is a deterministic dialogue engine, not a generative AI model, and it is not an official assessment.
import { CALLSIGN, type AtcStep } from '../content/english';

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const digits = (s: string) => s.split('').map((d) => WORDS[Number(d)] ?? '').join(' ');

function numberToWords(tok: string): string {
  if (tok.includes('.')) { const [a, b] = tok.split('.'); return `${digits(a)} decimal ${digits(b)}`; }
  const n = Number(tok);
  if (tok.length >= 4 && n % 100 === 0 && n < 100000) {
    const th = Math.floor(n / 1000); const h = (n % 1000) / 100;
    return [th ? `${digits(String(th))} thousand` : '', h ? `${WORDS[h]} hundred` : ''].filter(Boolean).join(' ');
  }
  return digits(tok);
}

/** Converts a transmission to a canonical spoken form so "118.7", "one one eight decimal seven" and "118 point 7" all match. */
export function normalize(text: string): string {
  return text.toLowerCase()
    .replace(/(\d),(\d{3})/g, '$1$2')
    .replace(/take-?off/g, 'take off').replace(/line-?up/g, 'line up').replace(/go-around/g, 'go around')
    .replace(/(\d+)\s+point\s+(\d+)/g, '$1.$2')
    .replace(/\d+(\.\d+)?/g, (m) => ` ${numberToWords(m)} `)
    .replace(/\bniner\b/g, 'nine').replace(/\btree\b/g, 'three').replace(/\bfife\b/g, 'five')
    .replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ').trim()
    // "point" means "decimal" only between spoken digits ("one one eight point seven"), never in "holding point".
    .replace(new RegExp(`\\b(${WORDS.join('|')}) point (?=${WORDS.join('|')})`, 'g'), '$1 decimal ');
}

export interface AtcEval { norm: string; found: string[]; missing: string[]; empty: boolean; sayAgain: boolean; complete: boolean; onlyCallsignMissing: boolean }

export function evaluate(step: AtcStep, text: string): AtcEval {
  const norm = normalize(text);
  const found: string[] = []; const missing: string[] = [];
  for (const item of step.required) (item.any.some((a) => norm.includes(a)) ? found : missing).push(item.label);
  const sayAgain = /\bsay again\b|\brepeat\b|not understand|unreadable/.test(norm) && found.length <= 1;
  return { norm, found, missing, empty: norm.length < 2, sayAgain, complete: missing.length === 0, onlyCallsignMissing: missing.length === 1 && missing[0] === 'Call sign' };
}

export interface ControllerTurn { atc: string; advance: boolean; coach?: string }

/** Decides the controller's next transmission from the learner's last message. */
export function controllerTurn(step: AtcStep, ev: AtcEval, attempt: number): ControllerTurn {
  const instruction = step.atc ? step.atc.replace(new RegExp(`^${CALLSIGN},\\s*`), '') : '';
  if (ev.empty) return { atc: 'Station calling Northfield, say again.', advance: false, coach: 'Nothing was received. Speak or type your transmission, then transmit.' };
  if (ev.sayAgain) {
    return step.kind === 'readback'
      ? { atc: `${CALLSIGN}, I say again: ${instruction}`, advance: false, coach: 'Good: "say again" is the correct way to ask for a repeat.' }
      : { atc: `${CALLSIGN}, pass your message.`, advance: false };
  }
  if (ev.complete) return { atc: step.kind === 'request' ? (step.reply ?? `${CALLSIGN}, roger.`) : `${CALLSIGN}, readback correct.`, advance: true };
  if (ev.onlyCallsignMissing) return { atc: step.kind === 'request' ? `Station calling Northfield, say again your call sign.` : `Readback correct. Confirm call sign?`, advance: attempt >= 1, coach: `End every readback with your call sign: "${CALLSIGN}".` };
  if (attempt >= 2) return { atc: `${CALLSIGN}, roger.`, advance: true, coach: `We will move on. A complete transmission would be: "${step.model}"` };
  if (step.kind === 'readback') return { atc: `${CALLSIGN}, negative. I say again: ${instruction} Read back.`, advance: false, coach: `Missing from your readback: ${ev.missing.join(', ')}.` };
  return { atc: `${CALLSIGN}, say again your request.`, advance: false, coach: `Your message should include: ${ev.missing.join(', ')}.` };
}

/** Observations about wording. These are training hints based on the transcript text only. */
export function languageNotes(text: string, step: AtcStep): string[] {
  const n = ` ${normalize(text)} `;
  const notes: string[] = [];
  if (/ (yes|yeah|yep) /.test(n)) notes.push('Use "affirm" instead of "yes".');
  if (/ (no|nope) /.test(n)) notes.push('Use "negative" instead of "no".');
  if (/ repeat /.test(n)) notes.push('Use "say again" instead of "repeat".');
  if (/ (ok|okay) /.test(n)) notes.push('Avoid "okay". Read back the instruction or say "wilco".');
  if (/ over and out /.test(n)) notes.push('"Over and out" is not used. End with your call sign.');
  if (step.kind === 'readback' && / roger /.test(n) && step.required.length > 2) notes.push('"Roger" is not a readback. Safety-critical items must be repeated.');
  if (/ (um|uh|er|erm) /.test(n)) notes.push('Hesitation sounds were transcribed. Pause silently, then transmit the whole message.');
  const words = n.trim().split(' ').filter(Boolean).length;
  const model = normalize(step.model).split(' ').length;
  if (step.style === 'Standard phraseology' && words > model * 1.8 + 4) notes.push('Your transmission is much longer than necessary. Standard phraseology is short and exact.');
  return notes;
}

export interface TurnLog { step: number; attempt: number; text: string; spoken: boolean; confidence?: number; seconds?: number; ev: AtcEval; notes: string[] }

/** Provisional, per-dimension training feedback. Not an ICAO language proficiency rating. */
export function dimensionFeedback(log: TurnLog[], steps: number): { dim: string; note: string }[] {
  const spoken = log.filter((l) => l.spoken);
  const first = log.filter((l) => l.attempt === 0);
  const firstOk = first.filter((l) => l.ev.complete || l.ev.onlyCallsignMissing).length;
  const items = log.reduce((a, l) => ({ f: a.f + l.ev.found.length, t: a.t + l.ev.found.length + l.ev.missing.length }), { f: 0, t: 0 });
  const notes = log.flatMap((l) => l.notes).length;
  const conf = spoken.filter((l) => l.confidence && l.confidence > 0);
  const avgConf = conf.length ? Math.round((conf.reduce((a, l) => a + (l.confidence ?? 0), 0) / conf.length) * 100) : null;
  const timed = spoken.filter((l) => l.seconds && l.seconds > 0.5);
  const wpm = timed.length ? Math.round((timed.reduce((a, l) => a + l.ev.norm.split(' ').length, 0) / timed.reduce((a, l) => a + (l.seconds ?? 0), 0)) * 60) : null;
  return [
    { dim: 'Pronunciation', note: spoken.length
      ? `Not scored. A text transcript cannot measure pronunciation.${avgConf !== null ? ` The speech recogniser's average confidence was ${avgConf}% — low values can also come from noise or the recogniser itself.` : ''} Compare the transcript with what you meant to say, and ask a qualified instructor for pronunciation feedback.`
      : 'Not assessed: you typed your transmissions. Use the microphone to practise speaking.' },
    { dim: 'Structure', note: notes === 0 ? 'No structural problems were detected in the transcript.' : `${notes} wording issue${notes === 1 ? '' : 's'} noted. See the suggestions under each transmission.` },
    { dim: 'Vocabulary', note: `You used ${items.f} of ${items.t} expected phraseology items across all attempts (${items.t ? Math.round((items.f / items.t) * 100) : 0}%).` },
    { dim: 'Fluency', note: wpm !== null ? `Estimated speaking rate about ${wpm} words per minute, including pauses. Around 100 words per minute is recommended for radiotelephony. This is a rough estimate.` : 'Not assessed in typed mode.' },
    { dim: 'Comprehension', note: `${firstOk} of ${Math.max(first.length, 1)} transmissions were complete on the first attempt, which suggests ${firstOk >= first.length * 0.8 ? 'you understood the instructions well' : 'some instructions were not fully understood'}.` },
    { dim: 'Interactions', note: log.some((l) => l.ev.sayAgain) ? 'You asked for a repeat with "say again" — an appropriate way to resolve uncertainty.' : `You completed ${steps} exchange${steps === 1 ? '' : 's'} with ${log.length - first.length} corrected attempt${log.length - first.length === 1 ? '' : 's'}. Remember you can always ask the controller to "say again".` },
  ];
}
