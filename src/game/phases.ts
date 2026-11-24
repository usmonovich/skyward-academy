// Flight phases: one reusable description of where a mission is, from briefing to the end of the flight.
// Missions do not list phases by hand: the plan comes from the mission data (take-off, landing), so every existing
// and future mission with a runway gets the same structure. Geometry here is shared by the engine, the HUD and the tests.
import type { MissionDef } from '../types';

export type PhaseId = 'preflight' | 'takeoff' | 'climb' | 'cruise' | 'approach' | 'landing' | 'complete';

export const PHASES: Record<PhaseId, { name: string; cue: string }> = {
  preflight: { name: 'Preflight', cue: 'Read the briefing: aircraft, route, weather and objective.' },
  takeoff: { name: 'Take-off', cue: 'Take-off: full power, build speed, rotate at the orange mark.' },
  climb: { name: 'Climb', cue: 'Climb: a steady climb away from the runway, then level off for the route.' },
  cruise: { name: 'Cruise', cue: 'Cruise: the main route. Plan each ring early.' },
  approach: { name: 'Approach', cue: 'Approach: follow the slope lights (two white, two red is on the path) and keep the speed down.' },
  landing: { name: 'Landing', cue: 'Landing: reduce the descent rate over the threshold and touch down gently in the first third.' },
  complete: { name: 'Flight complete', cue: 'Flight complete.' },
};

/** Arcade glide path: rise over run in world pixels. About 12 degrees on screen, steep on purpose so it fits the short final. */
export const GLIDE = 0.22;
/** Distance past the threshold the glide path aims at, in world pixels. */
export const AIM = 120;
/** Climb phase length after the take-off runway, in world pixels. */
export const CLIMB_LEN = 1100;
/** The take-off runway ends here (kept in step with the engine). */
export const TAKEOFF_END = 1300;

/** Runway geometry of a landing mission (the same numbers buildLevel uses). */
export const runwayOf = (def: MissionDef) => ({ start: def.length - 1150, end: def.length - 150 });

/** The ordered phases a mission flies through. */
export function phasePlan(def: MissionDef): PhaseId[] {
  return ['preflight', ...(def.takeoff ? ['takeoff', 'climb'] as PhaseId[] : []), 'cruise', ...(def.landing ? ['approach', 'landing'] as PhaseId[] : []), 'complete'];
}

/** Height of the glide path at world position x (screen y, so smaller is higher). groundTop is the wheels-on-ground y. */
export const glideY = (def: MissionDef, x: number, groundTop: number) => groundTop - GLIDE * Math.max(0, runwayOf(def).start + AIM - x);

export interface PhaseState { wx: number; onGround: boolean; airborneAt: number | null; rollout: boolean; ended: boolean; approachFrom: number }

/** Which phase the aircraft is in right now. approachFrom is where the approach starts (the first glide-path ring). */
export function phaseAt(def: MissionDef, s: PhaseState): PhaseId {
  if (s.ended) return 'complete';
  if (def.takeoff && (s.onGround || s.airborneAt === null)) return 'takeoff';
  if (def.landing) {
    const rw = runwayOf(def);
    if (s.rollout || s.wx >= rw.start - 260) return 'landing';
    if (s.wx >= s.approachFrom) return 'approach';
  }
  if (def.takeoff && s.airborneAt !== null && s.wx < Math.max(TAKEOFF_END, s.airborneAt) + CLIMB_LEN) return 'climb';
  return 'cruise';
}

/** Length of the approach, measured back from the aim point. Rings inside it sit on the glide path. */
export const APPROACH_REACH = 1400;
/** Where the approach phase starts: APPROACH_REACH before the aim point (1280 px before the threshold, about six seconds of flight). */
export const approachStart = (def: MissionDef): number => runwayOf(def).start + AIM - APPROACH_REACH;

/** Simplified approach-slope lights: how many of four show white. 2 is on the path; more is high, fewer is low. */
export function slopeLights(deviation: number): number {
  // deviation: glide-path y minus aircraft y (positive means the aircraft is above the path).
  if (deviation > 45) return 4;
  if (deviation > 15) return 3;
  if (deviation >= -15) return 2;
  if (deviation >= -45) return 1;
  return 0;
}

/** Touchdown position: the first third of the runway is the touchdown zone. */
export const touchdownZone = (def: MissionDef, x: number): 'in' | 'long' => (x - runwayOf(def).start <= (runwayOf(def).end - runwayOf(def).start) / 3 ? 'in' : 'long');
