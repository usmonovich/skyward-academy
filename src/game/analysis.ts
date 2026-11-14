// Post-flight analysis: turns what actually happened (the statistics and the recorded flight path) into strengths,
// mistakes and improvement tips. Pure and deterministic; every sentence is derived from a measured value.
import type { MissionDef, MissionResult } from '../types';
import { buildLevel } from './engine';

export interface GateMiss { index: number; kind: 'high' | 'low' | 'side'; amount: number; unit: 'ft' | 'units' }
export interface Analysis {
  strengths: string[];
  mistakes: string[];
  tips: string[];
  gateMisses: GateMiss[];
  /** Largest and average distance from the planned track, for lateral missions. */
  track?: { mean: number; max: number };
}

const near = (trace: number[][], x: number): number[] | undefined => {
  let best: number[] | undefined; let d = Infinity;
  for (const s of trace) { const k = Math.abs(s[1] - x); if (k < d) { d = k; best = s; } }
  return best;
};
const pct = (v: number) => `${Math.round(v * 100)}%`;
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

/** Where each missed gate was missed, from the recorded path: too high, too low, or off the planned track. */
export function gateMisses(def: MissionDef, r: MissionResult): GateMiss[] {
  const level = buildLevel(def);
  const trace = r.trace ?? [];
  const out: GateMiss[] = [];
  (r.gateStates ?? []).forEach((st, i) => {
    if (st !== 'missed') return;
    const g = level.gates[i]; const s = near(trace, g.x);
    if (!s) return;
    const dy = s[2] - g.y; // positive: below the gate
    const wp = def.lateral?.waypoints?.[i];
    const heightOk = Math.abs(dy) <= g.r;
    if (!heightOk) out.push({ index: i, kind: dy < 0 ? 'high' : 'low', amount: Math.round((Math.abs(dy) - g.r) * (def.altScale ?? 10) / 10) * 10, unit: 'ft' });
    else if (wp) out.push({ index: i, kind: 'side', amount: Math.round(Math.abs(s[3] - wp.lat)), unit: 'units' });
  });
  return out;
}

export function analyse(def: MissionDef, r: MissionResult): Analysis {
  const strengths: string[] = []; const mistakes: string[] = []; const tips: string[] = [];
  const misses = gateMisses(def, r);
  const L = def.lateral;

  // ---- Gates ---------------------------------------------------------------------------------------------------
  if (r.total > 0) {
    if (r.checkpoints === r.total) strengths.push(`All ${r.total} gates collected.`);
    else if (r.checkpoints / r.total >= 0.75) strengths.push(`Most gates collected: ${r.checkpoints} of ${r.total}.`);
    if (r.checkpoints < r.total) {
      const missedN = r.total - r.checkpoints;
      const detail = misses.map((m) => `gate ${m.index + 1}: ${m.kind === 'side' ? `${m.amount} units off the planned track` : `${m.amount} ft too ${m.kind}`}`);
      mistakes.push(`${plural(missedN, 'gate')} missed${r.success ? '' : ' or not reached'}${detail.length ? ` (${detail.slice(0, 3).join('; ')}${detail.length > 3 ? '; …' : ''})` : ''}.`);
      const highs = misses.filter((m) => m.kind === 'high').length; const lows = misses.filter((m) => m.kind === 'low').length;
      tips.push(highs > lows ? 'You tended to arrive above the gates. Begin the descent earlier and ease it in.' : lows > highs ? 'You tended to arrive below the gates. Begin the climb earlier and keep the nose up a little longer.' : 'Look at the next gate as soon as you pass one, and start each climb or descent one or two seconds earlier.');
    }
  }

  // ---- Contacts and time --------------------------------------------------------------------------------------------
  if (r.hits === 0) strengths.push('No obstacle or terrain contact: good lookout.');
  else { mistakes.push(`${plural(r.hits, 'contact')} with obstacles, terrain or the runway.`); tips.push('Scan well ahead for hazards and pick your path early. A wide margin is cheaper than a late correction.'); }
  if (r.success) {
    if (r.time <= def.parTime) strengths.push(`Finished in ${r.time.toFixed(0)} s, within the ${def.parTime} s target.`);
    else if (r.time > def.parTime * 1.2) { mistakes.push(`Finished in ${r.time.toFixed(0)} s, ${(r.time - def.parTime).toFixed(0)} s over the ${def.parTime} s target.`); tips.push('Keep a steady, moderate power setting instead of slowing down between gates.'); }
  }

  // ---- Speed band or track keeping -----------------------------------------------------------------------------------
  let track: Analysis['track'];
  if (L && r.trackError !== undefined) {
    track = { mean: r.trackError, max: r.maxOffset ?? 0 };
    const frac = r.bandFraction ?? 0;
    if (frac >= 0.8) strengths.push(`Stayed inside the track corridor ${pct(frac)} of the time.`);
    else { mistakes.push(`Inside the track corridor only ${pct(frac)} of the time (average ${r.trackError.toFixed(0)} units off, worst ${(r.maxOffset ?? 0).toFixed(0)}).`); tips.push(L.waypoints ? 'Start each turn before the waypoint, then take the heading off once the marker is on the new leg.' : 'Find the heading that holds the marker steady, hold it, and make only small changes. Big heading swings cause overshoot.'); }
    if (L.wind !== 0 || L.gust !== 0) tips.push('Remember: the correction you need grows with the wind and shrinks as airspeed rises.');
  } else if (def.speedBand && r.bandFraction !== undefined) {
    if (r.bandFraction >= 0.8) strengths.push(`Held the target speed ${pct(r.bandFraction)} of the time.`);
    else { mistakes.push(`Held the target speed only ${pct(r.bandFraction)} of the time.`); tips.push('Make smaller power changes and wait for the speed to settle before correcting again.'); }
  }

  // ---- Landing -------------------------------------------------------------------------------------------------------
  if (r.landing) {
    if (r.landing === 'smooth') strengths.push('Smooth touchdown.');
    else if (r.landing === 'firm') { mistakes.push('Firm touchdown.'); tips.push('Reduce speed and the rate of descent a little earlier, and flare gently before the wheels touch.'); }
    else { mistakes.push('Hard touchdown.'); tips.push('Start the descent further from the runway, reduce power earlier and flare before touchdown.'); }
    const half = L?.runwayHalf;
    if (half !== undefined && r.touchdownOffset !== undefined) {
      if (r.touchdownOffset <= half * 0.6) strengths.push(`Touched down ${r.touchdownOffset.toFixed(0)} units from the centreline.`);
      else { mistakes.push(`Touched down ${r.touchdownOffset.toFixed(0)} units from the centreline${r.touchdownOffset > half ? ', outside the runway edge' : ''}.`); tips.push('Keep the heading correction on all the way to the flare, and line up with the runway earlier on the approach.'); }
    }
  }

  // ---- Go-around ------------------------------------------------------------------------------------------------------
  if (r.goAround === 'done') strengths.push('Go-around flown promptly: you climbed away as soon as the runway was called occupied.');
  else if (r.goAround === 'late') { mistakes.push('The go-around started late.'); tips.push('When the runway is occupied, decide at once: add full power and climb. Do not wait to see if it clears.'); }
  else if (r.goAround === 'landed') { mistakes.push('You landed on an occupied runway.'); tips.push('A blocked runway means a go-around, every time. Power up, climb, and come back round.'); }
  else if (r.goAround === 'missed') { mistakes.push('You did not climb away when the runway was occupied.'); tips.push('Practise the call: runway occupied means power up and climb away.'); }

  // ---- Fuel -----------------------------------------------------------------------------------------------------------
  if (r.fuelLeft !== undefined) {
    if (r.fuelLeft >= 0.25) strengths.push(`Arrived with ${pct(r.fuelLeft)} of the fuel left.`);
    else if (r.fuelLeft < 0.12) { mistakes.push(`Only ${pct(r.fuelLeft)} of the fuel was left on arrival.`); tips.push('Fuel use rises steeply with power. Cruise at a moderate setting and act early if the fuel plan stops adding up.'); }
  }

  // ---- Decisions ------------------------------------------------------------------------------------------------------
  const results = r.decisionResults ?? [];
  const asked = [...(def.decisions ?? [])].sort((a, b) => a.at - b.at);
  if (asked.length) {
    const right = results.filter(Boolean).length;
    if (right === asked.length && results.length === asked.length) strengths.push(asked.length === 1 ? 'Made the right decision.' : `All ${asked.length} operational decisions were right.`);
    results.forEach((ok, i) => {
      if (ok || !asked[i]) return;
      const best = asked[i].options.find((o) => o.correct);
      mistakes.push(`Decision ${i + 1} was not the best choice. Better: ${best?.text.replace(/\.$/, '')}.`);
    });
    if (results.some((x) => !x) && def.concept) tips.push(`Revisit the concept: ${def.concept}`);
  }

  if (!r.success && r.reason) mistakes.unshift(r.reason);
  if (!r.success) tips.push('Use Assisted mode in the briefing to practise the technique with the wind halved and no failure from contacts.');

  return { strengths, mistakes, tips: [...new Set(tips)].slice(0, 4), gateMisses: misses, track };
}
