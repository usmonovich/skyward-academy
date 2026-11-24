// A reusable link between what a lesson teaches and what the player does in the cockpit. Every mission is data; this table
// reads that data and names the learning objective each mechanic practises, so the briefing, the debrief and the tests all use
// one source. Adding a mechanic to the engine means adding one row here.
import type { MissionDef } from '../types';

export interface Mechanic {
  id: string;
  /** What the player does. */
  action: string;
  /** The learning objective it stands for. */
  practises: string;
  /** True when the mission data switches this mechanic on. */
  on: (m: MissionDef) => boolean;
}

export const MECHANICS: Mechanic[] = [
  { id: 'rings', action: 'Fly through the rings', practises: 'Plan a path and reach a target value ahead of time.', on: () => true },
  { id: 'speed', action: 'Hold the speed band', practises: 'Make small, steady power changes and wait for the result.', on: (m) => !!m.speedBand },
  { id: 'wind', action: 'Hold a correction against the wind', practises: 'Apply a constant correction to cancel a steady push, as in the wind triangle.', on: (m) => !!m.wind || !!m.lateral },
  { id: 'track', action: 'Follow the waypoints', practises: 'Keep to a planned track, turning before the waypoint.', on: (m) => !!m.lateral?.waypoints },
  { id: 'terrain', action: 'Clear the terrain', practises: 'Keep terrain clearance and scan ahead for rising ground.', on: (m) => !!m.terrain },
  { id: 'obstacles', action: 'Avoid obstacles', practises: 'Look ahead and choose a wide, early path.', on: (m) => m.obstacles.density > 0 },
  { id: 'fuel', action: 'Manage the fuel', practises: 'Ration a limited resource over the whole route.', on: (m) => !!m.fuel },
  { id: 'energy', action: 'Manage energy', practises: 'Trade speed and height deliberately.', on: (m) => !!m.energy },
  { id: 'takeoff', action: 'Take off', practises: 'Build speed, rotate and climb away.', on: (m) => !!m.takeoff },
  { id: 'landing', action: 'Land on the runway', practises: 'Plan the descent and flare, and arrive at a safe speed.', on: (m) => !!m.landing },
  { id: 'goaround', action: 'Go around when told', practises: 'Decide at once when the runway is not available.', on: (m) => !!m.goAround },
];

/** The mechanics a mission uses, in the table's order. The ring mechanic is always present. */
export const mechanicsOf = (m: MissionDef): Mechanic[] => MECHANICS.filter((x) => x.on(m));

/** One line for the briefing: what the lesson idea turns into in the cockpit. */
export function learningLine(m: MissionDef): string {
  const used = mechanicsOf(m).filter((x) => x.id !== 'rings' && x.id !== 'obstacles');
  const list = used.length ? used : mechanicsOf(m).slice(0, 1);
  return `In the cockpit: ${list.map((x) => `${x.action}: ${x.practises}`).join(' ')}`;
}
