import type { MissionDef } from '../types';

/**
 * Longer rounds without artificial waiting. A route's duration is its length divided by the cruise speed, so a standard
 * round is made longer by lengthening the route and filling it with more rings, more hazards and clear stages. Nothing
 * is slowed down, frozen or repeated.
 */

/** Target length of a clean round at the default cruise speed, in seconds, by tier. A player who flies at full thrust all the way can finish sooner. */
export const TARGET_SECONDS: Record<MissionDef['tier'], number> = { Beginner: 140, Intermediate: 150, Advanced: 165, Expert: 185 };

/** World pixels per second at the default cruise setting: the aircraft starts mid-range, or in the middle of the target speed band. */
export function cruiseSpeed(m: MissionDef, minKt: number, maxKt: number): number {
  const range = maxKt - minKt;
  const kt = m.speedBand ? (m.speedBand.min + m.speedBand.max) / 2 : minKt + range * 0.5;
  const v = 140 + Math.max(0, Math.min(1.1, (kt - minKt) / range)) * 200;
  // After a take-off the throttle stays where the take-off left it, so these rounds are flown fast.
  return m.takeoff ? Math.max(v, 330) : v;
}

const NATO = ['ALFA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO', 'FOXTROT', 'GOLF', 'HOTEL', 'INDIA', 'JULIETT', 'KILO', 'LIMA', 'MIKE', 'NOVEMBER', 'OSCAR', 'PAPA', 'QUEBEC', 'ROMEO', 'SIERRA', 'TANGO'];

/** Repeats a route pattern to n waypoints, ending on the first waypoint's track, with phonetic names. */
export function extendWaypoints(wps: { lat: number; name: string }[], n: number): { lat: number; name: string }[] {
  const out = Array.from({ length: n }, (_, i) => ({ lat: wps[i % wps.length].lat, name: NATO[i] ?? `WPT${i + 1}` }));
  out[n - 1] = { lat: 0, name: NATO[n - 1] ?? `WPT${n}` };
  return out;
}

/** The four stages every standard round passes through. Existing messages are kept; stage notes are added between them. */
export function stageMessages(m: MissionDef): { at: number; text: string }[] {
  const finish = m.landing ? 'Final approach: line up, slow down and bring it down onto the runway.' : 'Final stretch: collect the last rings and cross the finish line.';
  const stages = [
    { at: 0.03, text: 'Stage 1, introduction: settle into the flight and collect the first rings.' },
    { at: 0.2, text: 'Stage 2, main flight: keep a steady rhythm from ring to ring.' },
    { at: 0.55, text: 'Stage 3, challenge: conditions and hazards pick up. Look further ahead.' },
    { at: 0.86, text: finish },
  ];
  const kept = m.messages ?? [];
  // Drop a stage note when a mission message already sits right next to it, so two messages never collide.
  return [...kept, ...stages.filter((s) => !kept.some((k) => Math.abs(k.at - s.at) < 0.04))].sort((a, b) => a.at - b.at);
}

/**
 * Lengthens a mission to its tier's target duration. Gate spacing is kept, so there are proportionally more rings
 * (capped at 20), hazards scale with the route, the par time scales with the length and fuel scales with the route.
 */
export function extendMission(m: MissionDef, minKt: number, maxKt: number): MissionDef {
  const speed = cruiseSpeed(m, minKt, maxKt);
  const length = Math.max(m.length, Math.ceil((TARGET_SECONDS[m.tier] * speed) / 100) * 100);
  if (length <= m.length) return { ...m, messages: stageMessages(m) };
  const k = length / m.length;
  let checkpoints = Math.min(20, Math.max(m.checkpoints, Math.round(m.checkpoints * k)));
  let lateral = m.lateral;
  if (lateral?.waypoints) { checkpoints = Math.min(20, Math.max(checkpoints, 10)); lateral = { ...lateral, waypoints: extendWaypoints(lateral.waypoints, checkpoints) }; }
  const out: MissionDef = { ...m, length, checkpoints, lateral, parTime: Math.round(m.parTime * k) };
  return { ...out, messages: stageMessages(out) };
}
