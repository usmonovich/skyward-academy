// Ranks, achievements, daily challenges and XP rules. Pure functions over the Progress record.
import type { MissionStats, Progress } from '../types';

/** In-game educational ranks only. They are not pilot licences or qualifications. */
// Thresholds are scaled to the full curriculum: a lesson with its mission is worth roughly 225 XP, so the PPL
// rank lies near the end of the PPL track and the top rank near the end of the ATPL track.
export const RANKS = [
  { name: 'Aviation Explorer', xp: 0 }, { name: 'Junior Cadet', xp: 150 }, { name: 'Flight Academy Cadet', xp: 1000 },
  { name: 'Student Pilot', xp: 6000 }, { name: 'PPL Knowledge Graduate', xp: 28000 }, { name: 'Commercial Aviation Cadet', xp: 31000 },
  { name: 'CPL Knowledge Graduate', xp: 36000 }, { name: 'Advanced Airline Cadet', xp: 40000 }, { name: 'ATPL Knowledge Graduate', xp: 46000 },
  { name: 'Skyward Academy Master', xp: 50000 },
];

export function rankFor(xp: number) {
  let i = 0;
  while (i + 1 < RANKS.length && xp >= RANKS[i + 1].xp) i++;
  const next = RANKS[i + 1];
  return { index: i, name: RANKS[i].name, next: next?.name, toNext: next ? next.xp - xp : 0, pct: next ? (xp - RANKS[i].xp) / (next.xp - RANKS[i].xp) : 1 };
}

export const XP = { lessonPass: 100, perfectBonus: 25, card: 2, daily: 40, examPer: 3, englishExercise: 40, atcScenario: 30 };

const passed = (p: Progress, prefix = '') => Object.entries(p.lessons).filter(([id, l]) => l.passed && id.startsWith(prefix)).length;
const stars = (p: Progress) => Object.values(p.missions).reduce((n, m) => n + m.stars, 0);

export interface Achievement { id: string; name: string; desc: string; test: (p: Progress) => boolean }

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', name: 'Cleared for Learning', desc: 'Pass your first lesson assessment.', test: (p) => passed(p) >= 1 },
  { id: 'first-flight', name: 'First Flight', desc: 'Complete your first flight mission.', test: (p) => Object.keys(p.missions).length >= 1 },
  { id: 'formula-master', name: 'Formula Master', desc: 'Experiment with 5 different interactive formulas.', test: (p) => p.labsUsed.length >= 5 },
  { id: 'physics-explorer', name: 'Physics Explorer', desc: 'Pass 3 physics lessons.', test: (p) => passed(p, 'phys-') >= 3 },
  { id: 'number-cruncher', name: 'Number Cruncher', desc: 'Pass 3 mathematics lessons.', test: (p) => passed(p, 'math-') >= 3 },
  { id: 'navigation-beginner', name: 'Navigation Beginner', desc: 'Pass Vectors and Distance, Speed and Time.', test: (p) => !!p.lessons['math-vectors']?.passed && !!p.lessons['math-dst']?.passed },
  { id: 'perfect-score', name: 'Perfect Score', desc: 'Score 100% on a lesson assessment.', test: (p) => Object.values(p.lessons).some((l) => l.best >= 1) },
  { id: 'perfect-landing', name: 'Perfect Landing', desc: 'Earn 3 stars on a mission that ends with a landing.', test: (p) => ['m-math-trig', 'm-phys-lift', 'm-ppl-controls', 'm-ppl-altimetry', 'm-ppl-mb', 'm-cpl-wind', 'm-free-sunset'].some((id) => p.missions[id]?.stars === 3) },
  { id: 'star-collector', name: 'Star Collector', desc: 'Earn 15 mission stars.', test: (p) => stars(p) >= 15 },
  { id: 'ppl-starter', name: 'PPL Ground School', desc: 'Pass 2 PPL lessons.', test: (p) => passed(p, 'ppl-') >= 2 },
  { id: 'captain-thinking', name: 'Thinking Like a Captain', desc: 'Complete an Advanced or Expert mission.', test: (p) => !!p.missions['m-cpl-wind'] || !!p.missions['m-atpl-mach'] },
  { id: 'communication-champion', name: 'Communication Champion', desc: 'Complete an AI Air Traffic Controller scenario.', test: (p) => Object.keys(p.english).some((k) => k.startsWith('atc:')) },
  { id: 'english-explorer', name: 'Aviation English Explorer', desc: 'Complete 4 Aviation English exercises.', test: (p) => Object.entries(p.english).filter(([k, v]) => !k.startsWith('atc:') && v.done).length >= 4 },
  { id: 'card-shark', name: 'Sharp Memory', desc: 'Review 30 flashcards.', test: (p) => p.cardReviews >= 30 },
  { id: 'exam-ready', name: 'Exam Ready', desc: 'Score 80% or more in a practice exam of at least 10 questions.', test: (p) => p.exams.some((e) => e.total >= 10 && e.correct / e.total >= 0.8) },
  { id: 'week-streak', name: 'Seven-Day Habit', desc: 'Study on 7 different days.', test: (p) => Object.keys(p.activity).length >= 7 },
  { id: 'ten-lessons', name: 'Ten Lessons Completed', desc: 'Pass 10 lessons.', test: (p) => passed(p) >= 10 },
];

export const newAchievements = (p: Progress) => ACHIEVEMENTS.filter((a) => !p.achievements[a.id] && a.test(p));

export const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Current run of consecutive study days ending today or yesterday. Missing a day never removes XP or progress. */
export function streak(p: Progress, today = new Date()): number {
  let n = 0;
  const d = new Date(today);
  if (!p.activity[dayKey(d)]) d.setDate(d.getDate() - 1);
  while (p.activity[dayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export interface DailyChallenge { id: string; text: string; key: string; target: number; link: string }
export const DAILIES: DailyChallenge[] = [
  { id: 'd-correct', text: 'Answer 5 practice questions correctly', key: 'correct', target: 5, link: 'exams' },
  { id: 'd-cards', text: 'Review 10 flashcards', key: 'cards', target: 10, link: 'knowledge/flashcards' },
  { id: 'd-mission', text: 'Complete 1 flight mission', key: 'missions', target: 1, link: 'fly' },
  { id: 'd-atc', text: 'Make 5 ATC transmissions', key: 'atc', target: 5, link: 'english/en-atc' },
  { id: 'd-physics', text: 'Solve 3 physics or maths problems', key: 'science', target: 3, link: 'academy' },
];
export function dailyFor(key: string): DailyChallenge {
  let h = 0;
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return DAILIES[h % DAILIES.length];
}

/** Mission scoring: 40% gates, 25% safety, 15% time, 20% mission objective. */
export interface ScoreParts { gates: number; safety: number; time: number; objective: number }

/** The four components of a mission score, each from 0 to 1, in the order they are weighted (40/25/15/20). */
export function scoreParts(parTime: number, s: MissionStats): ScoreParts {
  const gates = s.total ? s.checkpoints / s.total : 1;
  const safety = Math.max(0, 1 - s.hits / 3);
  const time = Math.min(1, parTime / Math.max(s.time, 1));
  const parts: number[] = [];
  if (s.bandFraction !== undefined) parts.push(s.bandFraction);
  if (s.landing) parts.push(s.landing === 'smooth' ? 1 : s.landing === 'firm' ? 0.6 : 0.2);
  if (s.decisionsTotal) parts.push(s.decisionsCorrect / s.decisionsTotal);
  const objective = parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : 1;
  return { gates, safety, time, objective };
}

export function scoreMission(parTime: number, s: MissionStats): { score: number; stars: number } {
  if (!s.success) return { score: 0, stars: 0 };
  const { gates, safety, time, objective } = scoreParts(parTime, s);
  const score = Math.round(1000 * (0.4 * gates + 0.25 * safety + 0.15 * time + 0.2 * objective));
  return { score, stars: score >= 850 ? 3 : score >= 600 ? 2 : 1 };
}

/** Human-readable training stage for the dashboard. */
export function stageFor(p: Progress): string {
  if (passed(p, 'atpl-') > 0) return 'ATPL Student';
  if (passed(p, 'cpl-') > 0) return 'CPL Student';
  if (passed(p, 'ppl-') > 0) return 'PPL Student';
  if (passed(p) > 0) return 'Pre-Flight Academy';
  return 'Beginner';
}
