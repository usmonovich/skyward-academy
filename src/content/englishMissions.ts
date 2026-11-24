import type { MissionDef } from '../types';
import { EN_EXERCISES } from './english';

// Aviation English reward flights. Passing an English exercise opens one flight; the flight itself is plain flying with
// no questions (the language practice happens in the exercise, never during the flight).

const TIER = (stage: number): MissionDef['tier'] => (stage <= 3 ? 'Beginner' : stage <= 5 ? 'Intermediate' : stage <= 7 ? 'Advanced' : 'Expert');
const AIRCRAFT = ['sparrow', 'sparrow', 'kestrel', 'kestrel', 'gemini', 'albatross', 'falcon', 'skyliner'];
const ENV: Record<string, MissionDef['env']> = { quiz: 'countryside', alphabet: 'airfield', numbers: 'golden', listening: 'overcast', atc: 'night' };

export function buildEnglishMissions(): MissionDef[] {
  return EN_EXERCISES.map((ex, i) => ({
    id: `e-${ex.id.replace(/^en-/, '')}`, title: `${ex.title}: Reward Flight`, requiresEnglish: [ex.id],
    tier: TIER(ex.stage), style: 'Educational simulation', aircraftId: AIRCRAFT[Math.min(ex.stage, 8) - 1], env: ENV[ex.kind] ?? 'countryside', seed: 501 + i, length: 12000, parTime: 52,
    checkpoints: 12, obstacles: { density: 0.22, types: ['balloon', 'birds'] }, xp: 80 + ex.stage * 5,
    concept: `${ex.title}: ${ex.blurb}`,
    objective: 'Fly the route and collect the rings.',
    briefing: `A reward flight for passing "${ex.title}". Just fly: there are no questions in the air.`,
    outcome: 'Enjoy the flight you earned in Aviation English.',
  } satisfies MissionDef));
}
