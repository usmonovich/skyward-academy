// Spaced repetition using the SM-2 algorithm (P. A. Wozniak, SuperMemo 2, 1987).
// Quality q is 0..5. q < 3 is a lapse: repetitions reset and the card returns after 10 minutes.
// Otherwise the interval grows: 1 day, 6 days, then previous interval × ease factor.
// Ease factor: EF' = EF + (0.1 − (5 − q) × (0.08 + (5 − q) × 0.02)), never below 1.3.
import type { CardState } from '../types';

export const DAY = 86_400_000;
export const GRADES = [{ q: 1, label: 'Again' }, { q: 3, label: 'Hard' }, { q: 4, label: 'Good' }, { q: 5, label: 'Easy' }] as const;

export const newCard = (now = Date.now()): CardState => ({ ef: 2.5, interval: 0, reps: 0, due: now, lapses: 0 });

export function review(card: CardState, q: number, now = Date.now()): CardState {
  const ef = Math.max(1.3, card.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  if (q < 3) return { ef, interval: 0, reps: 0, due: now + 10 * 60_000, lapses: card.lapses + 1 };
  const interval = card.reps === 0 ? 1 : card.reps === 1 ? 6 : Math.round(card.interval * ef);
  return { ef, interval, reps: card.reps + 1, due: now + interval * DAY, lapses: card.lapses };
}

export const isDue = (card: CardState, now = Date.now()) => card.due <= now;
