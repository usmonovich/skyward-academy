import type { MissionDef } from '../types';

// Weather challenge missions. Each opens when its weather lesson is passed and teaches recognition and avoidance: the
// right answer is always to keep clear, divert or not continue, never to fly into severe weather. Weather effects are
// simplified game effects; real decisions use official forecasts, reports, the aircraft manual and the authority's rules.

type W = Partial<MissionDef> & Pick<MissionDef, 'id' | 'title' | 'objective' | 'briefing' | 'outcome' | 'concept' | 'requires'>;
const base = (m: W): MissionDef => ({
  tier: 'Advanced', style: 'Educational simulation', aircraftId: 'gemini', env: 'overcast', seed: 400, length: 10000, parTime: 48,
  checkpoints: 6, obstacles: { density: 0.2, types: ['birds'] }, xp: 90, ...m,
});

const SIMPLE = 'Educational approximation: the weather here is a simplified game effect, not a forecast or a procedure.';
const SIDE = 'The game is a side view, so your sideways position and the danger area are shown on the track panel.';

export const WEATHER_CHALLENGES: MissionDef[] = [
  base({ id: 'w-thunderstorm-avoidance', title: 'Thunderstorm Avoidance', requires: ['ppl-storms'], seed: 401, length: 11000, parTime: 50,
    weather: { rain: 'heavy', storm: true, lightning: true }, obstacles: { density: 0.45, types: ['storm', 'storm', 'birds'] },
    concept: 'Thunderstorms are avoided, not penetrated: choose the route that keeps a wide margin, and decide early.',
    objective: 'Fly through the rings while keeping well clear of every storm cell.',
    briefing: `Heavy rain and lightning mark an active thunderstorm along your route. Storm cells hide severe turbulence, hail and lightning, and the air around them is hazardous too. ${SIMPLE}`,
    outcome: 'Recognise convective weather and keep a wide margin from every cell.',
    messages: [{ at: 0.05, text: 'Thunderstorm ahead. Look further ahead than usual and give every cell a wide berth.' }, { at: 0.6, text: 'Lightning is a sign of an active cell. Keep your distance.' }] }),

  base({ id: 'w-tornado-warning', title: 'Tornado Warning', requires: ['ppl-storms'], aircraftId: 'kestrel', seed: 402, length: 11000, parTime: 50,
    lateral: { wind: 4, gust: 2, tol: 26, waypoints: [{ lat: 0, name: 'ALFA' }, { lat: -25, name: 'BRAVO' }, { lat: -55, name: 'CHARLIE' }, { lat: -55, name: 'DELTA' }, { lat: -25, name: 'ECHO' }, { lat: 0, name: 'FOXTROT' }] },
    weather: { storm: true, rain: 'moderate', lightning: true, tornado: { at: 0.55, lat: 45, radius: 30 } }, obstacles: { density: 0.12, types: ['birds'] },
    concept: 'Severe weather recognition: a tornado warning means divert early and stay far away; there is nothing to gain by getting close.',
    objective: 'Follow the diversion route through six waypoints and stay clear of the red danger area around the tornado.',
    briefing: `A tornado has been reported ahead and to the right of your route. The diversion route bends left, away from it. Near the funnel the inflow pulls you towards it, so hold your correction. ${SIDE} ${SIMPLE} Tornadoes are extremely dangerous: this arcade funnel exists only to practise recognising and avoiding the hazard.`,
    outcome: 'Recognise a severe-weather warning and divert early, keeping well clear of the hazard.',
    messages: [{ at: 0.05, text: 'Severe weather is reported ahead. Expect a diversion to the left.' }, { at: 0.75, text: 'You are past the tornado. Keep following the route back to the original track.' }] }),

  base({ id: 'w-heavy-rain-approach', title: 'Heavy Rain Approach', tier: 'Intermediate', requires: ['ppl-take-off-and-landing-performance'], aircraftId: 'sparrow', seed: 403, length: 9500, parTime: 46, checkpoints: 5, landing: true,
    weather: { rain: 'heavy', fog: 0.35 }, obstacles: { density: 0.15, types: ['birds'] },
    concept: 'Reduced visibility in heavy rain: fly a stable approach early, and go around if it is not stable.',
    objective: 'Fly the route in heavy rain, then a stable approach and landing. Hazards appear late, so look ahead.',
    briefing: `Heavy rain reduces what you can see ahead: hazards show up late and the runway appears late. Settle on the glide path early and keep the speed down. If the approach is not stable, go around. ${SIMPLE}`,
    outcome: 'Fly a stable approach in reduced visibility and know when to go around.',
    messages: [{ at: 0.05, text: 'Heavy rain: visibility is reduced. Hazards appear late, so keep a margin.' }, { at: 0.78, text: 'Approach in rain: follow the slope lights. Not stable? Go around.' }] }),

  base({ id: 'w-fog-decision', title: 'Fog Decision', requires: ['ppl-fog'], seed: 404, length: 11000, parTime: 52, checkpoints: 6, landing: true,
    weather: { fog: 0.55 }, obstacles: { density: 0.15, types: ['birds', 'balloon'] },
    concept: 'Fog and minimum visibility: below the minimum for the approach you do not continue; you hold or divert.',
    objective: 'Fly to the alternate airport and land in the haze.',
    briefing: `Fog is forming at your destination. Every approach has a minimum visibility, and below it you do not continue. In thick haze distant hazards are not marked, so fly with care. ${SIMPLE}`,
    outcome: 'Assess reported visibility against the minimum and divert when it is below.',
    messages: [{ at: 0.05, text: 'Haze reduces the view ahead. Fly with care.' }, { at: 0.74, text: 'The alternate reports better visibility. The runway ahead is the alternate.' }] }),

  base({ id: 'w-turbulence', title: 'Turbulence', tier: 'Intermediate', requires: ['ppl-wind-and-turbulence'], aircraftId: 'sparrow', env: 'mountains', seed: 405, length: 10000, parTime: 48,
    weather: { turbulence: 0.8 }, obstacles: { density: 0.25, types: ['birds', 'balloon'] },
    concept: 'Turbulence: keep the wings level, make small corrections and slow to the turbulence speed in the aircraft manual.',
    objective: 'Fly through the rings in turbulence without large, sudden control inputs.',
    briefing: `Mountain air is rough today. The bumps push you up and down: smooth them out with small corrections instead of chasing each one. ${SIMPLE}`,
    outcome: 'Keep control in turbulence with small, smooth corrections.' }),

  base({ id: 'w-icing-awareness', title: 'Icing Awareness', requires: ['cpl-icing-in-depth'], env: 'arctic', seed: 406, length: 11000, parTime: 50,
    weather: { snow: true, fog: 0.3 }, obstacles: { density: 0.2, types: ['birds', 'balloon'] },
    concept: 'Icing: visible moisture at temperatures near or below freezing can ice the airframe; leave those conditions early.',
    objective: 'Fly through the snow and cloud and complete the route.',
    briefing: `Snow and cloud at below-freezing temperatures. Ice on the airframe adds weight and drag and reduces lift. The safe response is to leave the icing conditions early. ${SIMPLE} Follow the aircraft manual for ice protection; many light aircraft are not approved for flight in known icing.`,
    outcome: 'Recognise icing conditions and act early to leave them.',
    messages: [{ at: 0.05, text: 'Snow and low cloud. Watch for signs of ice.' }] }),
];
