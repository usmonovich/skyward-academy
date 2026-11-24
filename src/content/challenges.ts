import type { MissionDef } from '../types';

type Partial_ = Partial<MissionDef> & Pick<MissionDef, 'id' | 'title' | 'objective' | 'briefing' | 'outcome' | 'concept' | 'requires'>;
const base = (m: Partial_): MissionDef => ({
  tier: 'Intermediate', style: 'Educational simulation', aircraftId: 'sparrow', env: 'airfield', seed: 1, length: 9000, parTime: 44,
  checkpoints: 5, obstacles: { density: 0.25, types: ['balloon'] }, xp: 70, ...m,
});

/** Shared wording: every sideways-wind mission is an approximation and says so. */
const SIDE_NOTE = 'Educational approximation: the game is a side view, so the sideways position is shown on the track panel. One heading control stands in for the real techniques, and the numbers are not real distances or wind limits.';

/**
 * Challenge missions. They have no lesson of their own: each opens when the related lessons are passed, and each states
 * the aviation concept it practises. Scenarios are simplified teaching scenarios, not procedures; always follow the
 * aircraft manual and your authority's rules in real flying.
 */
export const CHALLENGES: MissionDef[] = [
  // ---- Crosswind landing ------------------------------------------------------------------------------------------
  base({ id: 'c-crosswind-landing', title: 'Crosswind Landing', requires: ['ppl-wind-and-turbulence'], seed: 301, length: 9000, parTime: 44, checkpoints: 4, landing: true,
    lateral: { wind: 10, gust: 3, tol: 22, runwayHalf: 16 },
    concept: 'Crosswind landing: hold a correction into the wind and arrive over the runway centreline.',
    objective: 'Hold the centreline against a crosswind from the left and touch down on the runway.',
    briefing: `A steady crosswind from the left pushes you towards the right-hand runway edge. Real pilots counter drift on the approach by crabbing (pointing the nose into the wind) or by lowering the upwind wing, then straighten out just before touchdown. ${SIDE_NOTE}`,
    outcome: 'Counter a crosswind with a held correction and land on the centreline.',
    messages: [{ at: 0.04, text: 'Wind from the left pushes you right. Hold a heading correction to the LEFT (◀ or Q).' }, { at: 0.45, text: 'Check the track panel: keep the marker inside the green corridor.' }, { at: 0.8, text: 'Runway ahead. Keep the correction on, descend gently and touch down on the centreline.' }] }),
  base({ id: 'c-crosswind-gusts', title: 'Gusty Crosswind', tier: 'Advanced', requires: ['ppl-wind-and-turbulence', 'ppl-take-off-and-landing-performance'], aircraftId: 'kestrel', seed: 314, length: 10000, parTime: 46, checkpoints: 5, landing: true,
    lateral: { wind: 14, gust: 6, tol: 20, runwayHalf: 15 }, wind: { vy: 12, gust: 22 },
    concept: 'Gusty crosswinds: the correction changes with the gusts, so keep adjusting and keep a speed margin.',
    objective: 'Fly the approach in gusting wind and land inside the runway edges.',
    briefing: `Gusts change both the sideways push and the sink rate. Make small, steady corrections instead of large swings, and keep a little extra speed on a gusty approach. ${SIDE_NOTE}`,
    outcome: 'Manage a gusting crosswind and vertical gusts together on the approach.',
    messages: [{ at: 0.05, text: 'Gusts come and go. Small, smooth heading changes work best.' }, { at: 0.82, text: 'Short final. Hold the correction until the flare.' }] }),

  // ---- Wind compensation ------------------------------------------------------------------------------------------
  base({ id: 'c-hold-track', title: 'Hold the Track', requires: ['ppl-basic-navigation'], env: 'coast', seed: 303, length: 8000, parTime: 38, checkpoints: 6,
    lateral: { wind: 12, gust: 2, tol: 26 },
    concept: 'Wind drift: the track over the ground differs from the heading; the heading correction is the wind correction angle.',
    objective: 'Keep the aircraft inside the green corridor for the whole route and fly through all 6 gates.',
    briefing: `Where the nose points is not where you go: the wind carries the aircraft sideways. Find the heading correction that keeps you on track, then hold it, instead of chasing the track with big turns. ${SIDE_NOTE}`,
    outcome: 'Find and hold a wind correction angle to stay on the planned track.',
    messages: [{ at: 0.05, text: 'The wind is from the left. Hold a correction to the left and watch the marker settle.' }, { at: 0.5, text: 'If you are still drifting right, add a little more correction. If you drift left, ease off.' }] }),
  base({ id: 'c-wind-correction', title: 'Wind Correction Angle', tier: 'Advanced', requires: ['ppl-basic-navigation', 'ppl-wind-and-turbulence'], aircraftId: 'kestrel', env: 'countryside', seed: 304, length: 10000, parTime: 44, checkpoints: 6,
    lateral: { wind: 17, gust: 3, tol: 20 },
    concept: 'The correction angle depends on wind strength and airspeed: the faster you fly, the smaller the correction needed.',
    objective: 'Hold the planned track in a strong crosswind, then see how speed changes the correction.',
    briefing: `A stronger wind needs a larger correction. At higher airspeed the same wind needs a smaller one. ${SIDE_NOTE}`,
    outcome: 'Relate wind strength and airspeed to the size of the wind correction angle.',
    messages: [{ at: 0.05, text: 'Strong wind from the left. Find the correction that holds the marker steady.' }, { at: 0.45, text: 'Try more power: with more airspeed the correction you hold becomes smaller. Watch the HDG number on the panel.' }] }),

  // ---- Navigation checkpoints --------------------------------------------------------------------------------------
  base({ id: 'c-waypoint-route', title: 'Waypoint Route', requires: ['ppl-basic-navigation'], env: 'countryside', seed: 305, length: 9500, parTime: 44, checkpoints: 6,
    lateral: { wind: 0, gust: 0, tol: 28, waypoints: [{ lat: 0, name: 'ALFA' }, { lat: 50, name: 'BRAVO' }, { lat: 50, name: 'CHARLIE' }, { lat: -40, name: 'DELTA' }, { lat: -40, name: 'ECHO' }, { lat: 0, name: 'FOXTROT' }] },
    concept: 'Navigation: follow a planned route by crossing each waypoint on track and at the planned height.',
    objective: 'Pass all six waypoints: each gate counts only if you cross it on the route line.',
    briefing: `The route has legs that turn left and right. The orange diamond on the track panel shows where the route is; steer so the aircraft marker follows it, then straighten the heading. ${SIDE_NOTE}`,
    outcome: 'Fly a route through named waypoints, turning early enough to be on track at each one.',
    messages: [{ at: 0.05, text: 'Waypoints are named in the phonetic alphabet. Cross each one on the route line.' }, { at: 0.4, text: 'Start the turn before the waypoint, then take the correction off.' }] }),
  base({ id: 'c-dogleg-wind', title: 'Dogleg in the Wind', tier: 'Advanced', requires: ['ppl-basic-navigation', 'ppl-wind-and-turbulence'], aircraftId: 'kestrel', env: 'coast', seed: 306, length: 11000, parTime: 48, checkpoints: 6,
    lateral: { wind: 8, gust: 3, tol: 24, waypoints: [{ lat: 0, name: 'ALFA' }, { lat: -45, name: 'BRAVO' }, { lat: -45, name: 'CHARLIE' }, { lat: 35, name: 'DELTA' }, { lat: 35, name: 'ECHO' }, { lat: 0, name: 'FOXTROT' }] },
    concept: 'Navigation in wind: the wind pushes you off each leg, so the heading you hold differs on every leg.',
    objective: 'Follow the route through six waypoints while the wind pushes you off each leg.',
    briefing: `The same kind of route, now with a crosswind. On each leg the correction you need is different, and it takes more to turn into the wind than away from it. ${SIDE_NOTE}`,
    outcome: 'Combine route following with wind correction.',
    messages: [{ at: 0.05, text: 'The wind is pushing you right. Legs to the right need less heading change than legs to the left.' }] }),

  // ---- Fuel management ----------------------------------------------------------------------------------------------
  base({ id: 'c-fuel-reserve', title: 'Fuel Reserve', requires: ['ppl-fuel-planning'], aircraftId: 'gemini', env: 'coast', seed: 310, length: 12000, parTime: 52, checkpoints: 6, fuel: true, landing: true, xp: 80,
    concept: 'Fuel management: power burns fuel quickly, and a fuel shortfall must be dealt with early.',
    objective: 'Reach the runway with fuel left. Use a moderate power setting and decide early when the forecast changes.',
    briefing: 'Fuel use rises steeply with power. Fly at a moderate setting, watch the fuel bar and take decisions early when the situation changes. Educational scenario, not a fuel-planning procedure: follow your authority\'s rules and the aircraft manual.',
    outcome: 'Manage power to protect fuel and decide early when fuel becomes a concern.',
    messages: [{ at: 0.05, text: 'Fuel use rises quickly at high power. Cruise at a moderate setting.' }] }),

  // ---- Weather avoidance ------------------------------------------------------------------------------------------
  base({ id: 'c-storm-deviation', title: 'Storm Deviation', requires: ['ppl-storms'], aircraftId: 'gemini', env: 'sunset', seed: 308, length: 11000, parTime: 50, checkpoints: 6, stormDrift: true, xp: 80,
    obstacles: { density: 0.5, types: ['storm', 'storm', 'balloon'] },
    concept: 'Thunderstorms are avoided by a wide margin; the safe gap between cells can move or close, so decide early.',
    objective: 'Fly through the gates while staying well clear of the drifting storm cells.',
    briefing: 'The storm cells drift up and down, so the gap you picked can close. Look further ahead than you would in clear weather and keep a wide margin. Educational scenario: real storm avoidance depends on radar, ATC and your aircraft\'s limits.',
    outcome: 'Plan a path around moving storm cells and keep a generous margin.',
    messages: [{ at: 0.05, text: 'Storm cells drift. Choose your gap early and keep a wide margin.' }] }),

  // ---- Go-around --------------------------------------------------------------------------------------------------
  base({ id: 'c-go-around', title: 'Go-Around', requires: ['ppl-take-off-and-landing-performance'], seed: 309, length: 8500, parTime: 40, checkpoints: 3, landing: true, goAround: { at: 800 },
    concept: 'Go-around: when the runway is not clear, add power and climb away instead of landing.',
    objective: 'Fly the approach. When the runway is called occupied, climb away and fly over it without landing.',
    briefing: 'You are on the approach when the runway becomes occupied. A go-around is a normal, safe decision: add power, climb away and try again. Nobody gets points for landing on a blocked runway. Educational scenario: real go-around technique depends on the aircraft type and the procedure in use.',
    outcome: 'Recognise a blocked runway and start a go-around promptly.',
    messages: [{ at: 0.06, text: 'On the approach. Be ready to go around if the runway is not clear.' }] }),
  base({ id: 'c-go-around-wind', title: 'Go-Around in a Crosswind', tier: 'Advanced', requires: ['ppl-take-off-and-landing-performance', 'ppl-wind-and-turbulence'], aircraftId: 'kestrel', seed: 310, length: 9500, parTime: 42, checkpoints: 4, landing: true, goAround: { at: 800 },
    lateral: { wind: 8, gust: 3, tol: 24 },
    concept: 'A go-around in wind: climb away first, and keep holding the correction so you do not drift towards obstacles.',
    objective: 'Keep on track in the crosswind, then climb away when the runway is called occupied.',
    briefing: `The wind does not stop when you go around. Hold the heading correction while you climb. ${SIDE_NOTE}`,
    outcome: 'Fly a go-around while still compensating for a crosswind.',
    messages: [{ at: 0.05, text: 'Crosswind from the left. Hold a left correction on the approach.' }] }),

  // ---- Educational decision making -----------------------------------------------------------------------------------
  base({ id: 'c-alternate-or-continue', title: 'Alternate or Continue', tier: 'Advanced', requires: ['cpl-weather-related-decisions'], aircraftId: 'albatross', env: 'mountains', seed: 311, length: 12500, parTime: 54, checkpoints: 6, fuel: true, landing: true, xp: 90,
    obstacles: { density: 0.3, types: ['storm', 'balloon'] },
    concept: 'Weather decisions: decide early between continuing and diverting, using the fuel and the forecast you have.',
    objective: 'Fly the route around the weather and land.',
    briefing: 'Weather at the destination is getting worse while your fuel is limited. Good pilots decide early, and they decide with a margin. Educational scenario, not an operational procedure.',
    outcome: 'Weigh weather, fuel and options to decide between continuing and diverting.',
    messages: [{ at: 0.78, text: 'A heavier aircraft is slow to slow down. Reduce power early so you are at approach speed at the runway.' }] }),
  base({ id: 'c-engine-after-takeoff', title: 'Engine Trouble After Take-off', tier: 'Advanced', requires: ['cpl-emergency-decision-making'], seed: 312, length: 8000, parTime: 38, checkpoints: 3, takeoff: true, xp: 90,
    concept: 'In an emergency, fly the aircraft first (aviate), then decide where to go (navigate) and then communicate.',
    objective: 'Take off, keep flying the aircraft and reach the finish line.',
    briefing: 'Shortly after take-off the engine loses power. Training teaches a clear order: aviate, navigate, communicate. Educational scenario: the right action depends on the aircraft, the height and the surroundings; follow your aircraft manual and training.',
    outcome: 'Prioritise flying the aircraft over troubleshooting in an emergency.' }),
];
