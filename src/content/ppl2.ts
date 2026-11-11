// PPL theory, second batch: meteorology and air law.
// Air-law figures were checked on 2026-11-11 against the text of Regulation (EU) No 923/2012 (SERA), which
// implements ICAO Annexes 2 and 11, and against 14 CFR Part 91. The ICAO Annexes themselves were not read.
import { lesson, match, mcq, num, scenario, tf } from './q';

export const clouds = lesson('Meteorology', {
  id: 'ppl-clouds', title: 'Clouds and Precipitation', minutes: 13, level: 2, prereqs: ['phys-atmos'],
  objectives: ['Explain how clouds form.', 'Identify the main cloud types and the weather they bring.', 'Distinguish stratiform from cumuliform cloud.', 'Read cloud amount in oktas and define the ceiling.', 'Estimate a cumulus cloud base from temperature and dew point.'],
  intro: 'Clouds are the visible part of the weather. A pilot who can read them knows where the air is rising, how stable it is, and what kind of flying conditions lie ahead.',
  simple: 'Clouds form when moist air rises and cools until its water vapour condenses. Flat layers mean smooth, stable air and steady rain or drizzle. Heaped clouds mean rising, bumpy air and showers. The biggest heaped cloud is the thunderstorm cloud.',
  sections: [
    { h: 'How clouds form', body: [
      'Air can hold only a limited amount of water vapour, and cold air holds less than warm air. The **dew point** is the temperature to which air must be cooled to become saturated.',
      'Rising air expands and cools. When it cools to its dew point, water vapour condenses into droplets and a cloud forms.',
      'Air is lifted in four main ways: **convection** over heated ground, **orographic** lifting over hills, **frontal** lifting where air masses meet, and **convergence** where winds flow together.',
    ] },
    { h: 'Cloud types', body: [
      'Clouds are named by height and form. **Cirro-** means high, **alto-** means medium, **strato-** means layered, **cumulo-** means heaped and **nimbus** means rain-bearing.',
      'Select each cloud to see its level and the weather it brings.',
    ], lab: 'explore:clouds' },
    { h: 'Layered or heaped', body: [
      '**Stratiform** cloud forms in stable air. Expect smooth flight, steady rain or drizzle, and often poor visibility.',
      '**Cumuliform** cloud forms in unstable air. Expect turbulence and showers, with good visibility between them.',
    ] },
    { h: 'Cloud amount and ceiling', body: [
      'Amount is reported in **oktas**, eighths of the sky: **FEW** 1–2, **SCT** (scattered) 3–4, **BKN** (broken) 5–7, **OVC** (overcast) 8.',
      'The **ceiling** is the height of the base of the lowest layer that covers more than half the sky — the lowest BKN or OVC layer.',
    ] },
    { h: 'Estimating the cloud base', body: [
      'For cumulus formed by convection, the base is roughly 400 ft above the ground for every degree Celsius between the surface temperature and the dew point.',
    ], formula: 'cloud-base', lab: 'formula:cloud-base', note: 'This is a rule of thumb for convective cloud on a well-mixed day. It does not apply to layer cloud or fog, and reported cloud bases always take priority.' },
  ],
  examples: [
    { title: 'Cloud base', steps: ['Surface temperature 20 °C, dew point 12 °C.', 'Spread = 20 − 12 = 8 °C.', 'Base ≈ 8 × 400 = 3,200 ft above the ground.'] },
    { title: 'Finding the ceiling', steps: ['Reported: FEW015 SCT030 BKN045.', 'FEW and SCT cover half the sky or less, so they are not a ceiling.', 'The ceiling is the BKN layer: 4,500 ft.'] },
  ],
  practice: [
    mcq('Which cloud is the thunderstorm cloud?', ['Cumulonimbus', 'Cirrus', 'Stratus', 'Altostratus'], 'Cumulonimbus (Cb) produces thunderstorms.'),
    num('Temperature 20 °C, dew point 12 °C. Estimated cumulus base above ground?', 3200, 50, 'ft', '(20 − 12) × 400 = 3,200 ft.', 'Multiply the spread by 400.'),
    mcq('Stratiform cloud indicates:', ['Stable air', 'Unstable air', 'Strong convection', 'Clear skies'], 'Layer cloud forms where air is stable.'),
    mcq('BKN means:', ['5 to 7 oktas', '1 to 2 oktas', '3 to 4 oktas', '8 oktas'], 'Broken cloud covers more than half the sky but not all of it.'),
    tf('Cirrus clouds are made of ice crystals.', true, 'They form at high levels where the temperature is far below freezing.'),
  ],
  assessment: [
    num('Temperature 15 °C, dew point 10 °C. Estimated cumulus base above ground?', 2000, 50, 'ft', '(15 − 10) × 400 = 2,000 ft.'),
    mcq('Which cloud gives long periods of continuous rain?', ['Nimbostratus', 'Cirrus', 'Altocumulus', 'Fair-weather cumulus'], 'Nimbostratus is a thick rain-bearing layer.'),
    mcq('Flying beneath cumuliform cloud you should expect:', ['Turbulence and showers', 'Smooth air and drizzle', 'Fog', 'Calm, stable conditions'], 'Heaped cloud forms in unstable, rising air.'),
    mcq('The ceiling is:', ['The base of the lowest BKN or OVC layer', 'The top of the highest cloud', 'The base of any cloud', 'The freezing level'], 'It is the lowest layer covering more than half the sky.'),
    match('Match each code to the cloud amount.', [['FEW', '1–2 oktas'], ['SCT', '3–4 oktas'], ['OVC', '8 oktas']], 'FEW, SCT, BKN and OVC cover 1–2, 3–4, 5–7 and 8 oktas.'),
    tf('Cumulus clouds are a sign of stable air.', false, 'They are formed by rising air and indicate instability.'),
    scenario(mcq('At 9 a.m. you see cumulus already growing tall with sharp, bubbling tops. For an afternoon flight you should expect:', ['Showers and possibly thunderstorms', 'Fog', 'Smooth, stable conditions', 'Clear skies'], 'Rapid vertical growth early in the day shows unstable air that is likely to produce cumulonimbus later.')),
  ],
  missionId: 'm-ppl-clouds', sources: ['faa-wx', 'phak'],
});

export const fog = lesson('Meteorology', {
  id: 'ppl-fog', title: 'Visibility and Fog', minutes: 12, level: 2, prereqs: ['ppl-clouds'],
  objectives: ['Define fog, mist and haze.', 'Explain how the temperature–dew point spread warns of fog.', 'Describe the main types of fog and when each clears.', 'Recognise the danger of continuing visual flight into poor visibility.'],
  intro: 'Reduced visibility is behind many of the most serious accidents in light aviation. Fog is predictable if you know the signs, and the decision to turn back is always available — until you leave it too late.',
  simple: 'Fog is cloud touching the ground. It forms when air near the surface is cooled to its dew point. Fog that forms on a still, clear night usually burns off in the morning; fog that drifts in from the sea can stay all day.',
  sections: [
    { h: 'Visibility words', body: [
      '**Fog** is visibility below 1,000 m caused by water droplets. **Mist** is visibility from 1,000 m up to 5,000 m, also from water droplets. **Haze** is reduced visibility caused by dry particles such as dust or smoke.',
    ], note: 'These are the international aviation reporting limits. United States reports use statute miles, with fog below 5/8 mile, so the mist band is defined differently there.' },
    { h: 'The warning sign', body: [
      'The closer the temperature is to the dew point, the closer the air is to saturation. A small spread that is still shrinking — typically in the evening — is the classic warning of fog.',
    ] },
    { h: 'Types of fog', body: [
      'Fog types are named after the way the air is cooled or moistened. Select each type to see when it forms and what clears it.',
    ], lab: 'explore:fog' },
    { h: 'Visual flight and poor visibility', body: [
      'A pilot flying by visual reference who enters fog or cloud loses the horizon. Without instrument training, loss of control can follow within minutes.',
      'The safe actions are taken early: check the forecast, set a personal minimum, and turn back or divert **before** the visibility ahead falls below it.',
    ], note: 'Visibility and cloud minima for visual flight are set by each authority and depend on the airspace class. They are covered in the Airspace Classification lesson.' },
  ],
  examples: [
    { title: 'An evening forecast', steps: ['18:00: temperature 8 °C, dew point 6 °C, clear sky, wind 3 kt.', 'The spread is only 2 °C and the ground will cool quickly under a clear sky.', 'Radiation fog is likely overnight and may still be present at dawn.'] },
  ],
  practice: [
    mcq('Fog is reported when visibility is below:', ['1,000 m', '5,000 m', '10 km', '100 m'], 'Below 1,000 m with water droplets is fog; from 1,000 m to 5,000 m is mist.'),
    mcq('Radiation fog is most likely with:', ['A clear night, light wind and moist air', 'A strong wind and overcast sky', 'A hot afternoon', 'Heavy showers'], 'The ground must cool freely and the air must not be mixed too strongly.'),
    mcq('Sea fog drifting over a coast is an example of:', ['Advection fog', 'Radiation fog', 'Steam fog', 'Frontal fog'], 'Warm, moist air moves over a colder surface.'),
    tf('Radiation fog usually clears after sunrise as the ground warms.', true, 'Heating from below evaporates the fog or lifts it into low cloud.'),
    mcq('A small and decreasing temperature–dew point spread suggests:', ['Fog or low cloud is likely', 'Strong winds are likely', 'Thunderstorms are certain', 'Visibility will improve'], 'The air is approaching saturation.'),
  ],
  assessment: [
    mcq('Mist is visibility of:', ['1,000 m to 5,000 m', 'Less than 1,000 m', 'More than 10 km', 'Less than 100 m'], 'Mist is less dense than fog.'),
    mcq('Which fog can persist by day and night in a moderate wind?', ['Advection fog', 'Radiation fog', 'Steam fog', 'None'], 'It depends on the air mass, not on night-time cooling.'),
    mcq('Which set of conditions favours radiation fog?', ['Clear sky, light wind, moist air', 'Overcast sky, strong wind', 'Dry air, strong wind', 'Midday sun'], 'All three are needed.'),
    tf('A strong wind makes radiation fog more likely.', false, 'Strong wind mixes the air and tends to lift fog into low stratus instead.'),
    mcq('At dusk: temperature 6 °C, dew point 5 °C, clear sky, light wind. Overnight you should expect:', ['Fog', 'Improving visibility', 'Thunderstorms', 'Strong turbulence'], 'A 1 °C spread with further cooling will bring the air to saturation.'),
    mcq('Haze is caused by:', ['Dry particles such as dust or smoke', 'Water droplets', 'Ice crystals only', 'Rain'], 'Fog and mist are water droplets; haze is dry.'),
    scenario(mcq('You are flying by visual reference and the visibility ahead is clearly getting worse. The best action is to:', ['Turn back or divert while you still have good visibility', 'Continue and descend to stay below the cloud', 'Climb into the cloud to get above it', 'Speed up to get through quickly'], 'Decide early. Continuing visual flight into deteriorating visibility is a leading cause of fatal accidents.')),
  ],
  missionId: 'm-ppl-fog', sources: ['faa-wx', 'phak'],
});

export const storms = lesson('Meteorology', {
  id: 'ppl-storms', title: 'Thunderstorms and Icing', minutes: 14, level: 2, prereqs: ['ppl-clouds'],
  objectives: ['State the three conditions needed for a thunderstorm.', 'Describe the three stages of a thunderstorm cell.', 'List thunderstorm hazards and how to avoid them.', 'State the conditions for airframe icing and identify its types.', 'Describe the effects of ice on an aircraft.'],
  intro: 'Thunderstorms and ice are the two weather hazards that can overwhelm any light aircraft. Neither can be out-flown. Both are handled the same way: recognise them early and stay out.',
  simple: 'A thunderstorm needs moisture, unstable air and something to start the air rising. It contains almost every weather hazard at once, so keep well away. Ice forms when an aircraft flies through visible moisture at or below freezing; it destroys lift and adds drag and weight.',
  sections: [
    { h: 'What a thunderstorm needs', body: [
      'Three things: **moisture**, **unstable air**, and a **lifting trigger** such as heating, a front or high ground.',
    ] },
    { h: 'Life of a storm cell', body: [
      '**Cumulus stage:** strong updraughts throughout the growing cloud.',
      '**Mature stage:** rain or hail begins to fall. Updraughts and downdraughts exist side by side. This is the most violent stage.',
      '**Dissipating stage:** downdraughts dominate, the rain eases and the top spreads into an anvil.',
    ] },
    { h: 'Hazards and avoidance', body: [
      'A thunderstorm can contain severe turbulence, hail, lightning, heavy rain, icing, and strong windshear including microbursts. Hail and turbulence can occur in clear air well outside the cloud, including under the anvil.',
      'Avoid thunderstorms by a wide margin. FAA guidance is to avoid by **at least 20 miles** any thunderstorm identified as severe, especially under the anvil of a large cumulonimbus. Never try to fly under a storm or its anvil, and do not take off or land with a storm approaching the aerodrome.',
    ], note: 'The 20-mile figure is from the FAA Aeronautical Information Manual (thunderstorm flying). Avoidance distances in operator manuals and other national guidance vary; use the figures that apply to your operation.' },
    { h: 'When ice forms', body: [
      'Airframe icing needs two things: **visible moisture** (cloud, rain or drizzle) and a temperature **at or below 0 °C**. The droplets are **supercooled**: still liquid below freezing, and they freeze when the aircraft strikes them.',
      'Select each type of ice to compare them.',
    ], lab: 'explore:icing' },
    { h: 'What ice does', body: [
      'Ice changes the shape of the wing. **Lift decreases, drag increases, weight increases and the stall speed rises.** It can also block the pitot tube and static ports and jam controls.',
      'If ice starts to form on an aircraft not approved for icing, leave the conditions at once: turn back, or change level toward warmer air if terrain allows.',
    ] },
  ],
  examples: [
    { title: 'A line of storms', steps: ['Cumulonimbus cells lie across your route with small gaps between them.', 'Gaps can close, and turbulence and hail extend outside the visible cloud.', 'The safe plan is to go around the whole line by a wide margin, or to land and wait.'] },
  ],
  practice: [
    mcq('Which three conditions are needed for a thunderstorm?', ['Moisture, unstable air and a lifting trigger', 'Stable air, fog and light wind', 'High pressure, dry air and a clear sky', 'Cold ground, calm wind and haze'], 'All three must be present.'),
    mcq('In the mature stage of a thunderstorm:', ['Updraughts and downdraughts exist together and precipitation falls', 'There are only updraughts', 'There are only weak downdraughts', 'The cloud has disappeared'], 'This is the most intense stage.'),
    mcq('FAA guidance is to avoid a thunderstorm identified as severe by at least:', ['20 miles', '1 mile', '5 miles', '2 miles'], 'Hazards extend well outside the visible cloud, especially under the anvil.'),
    tf('Airframe icing requires visible moisture and a temperature at or below freezing.', true, 'Both conditions are needed.'),
    mcq('Clear ice forms from:', ['Large supercooled drops that spread before freezing', 'Small droplets that freeze instantly', 'Dry snow', 'Dust particles'], 'It is smooth, heavy and difficult to see.'),
  ],
  assessment: [
    mcq('The dissipating stage of a thunderstorm is dominated by:', ['Downdraughts', 'Updraughts', 'Calm air', 'Rising temperature'], 'The updraughts have been cut off.'),
    mcq('Which is NOT a thunderstorm hazard?', ['Steady light winds', 'Hail', 'Windshear', 'Lightning'], 'Thunderstorms bring strong, rapidly changing winds.'),
    mcq('Ice on the wings causes:', ['Less lift, more drag, more weight and a higher stall speed', 'More lift and less drag', 'A lower stall speed', 'No change in performance'], 'All four effects reduce performance and safety margins.'),
    mcq('You find frost on the wings before the first flight of the day. You should:', ['Remove all of it before take-off', 'Take off; it will melt', 'Remove it only from the windscreen', 'Add ten knots to the take-off speed'], 'Even thin frost disturbs the airflow and reduces lift.'),
    mcq('Rime ice is:', ['Rough, white and opaque', 'Smooth and transparent', 'A liquid film', 'Found only on the ground'], 'Small droplets freeze instantly and trap air.'),
    tf('It is safe to fly beneath the anvil of a thunderstorm as long as you stay out of the rain.', false, 'Hail and severe turbulence can occur in clear air under the anvil.'),
    scenario(mcq('In an aircraft not approved for icing you enter cloud at −3 °C and see ice forming on the wing. The correct action is to:', ['Leave the icing conditions immediately, by turning back or changing level toward warmer air', 'Continue and watch how fast it builds', 'Slow down to reduce the build-up', 'Climb higher into colder cloud'], 'Ice builds quickly and the aircraft has no protection. Get out of visible moisture or above-freezing air without delay.')),
  ],
  missionId: 'm-ppl-storms', sources: ['faa-aim', 'faa-ac-91-51', 'faa-wx', 'phak'],
});

export const metar = lesson('Meteorology', {
  id: 'ppl-metar', title: 'METAR and TAF Decoding', minutes: 14, level: 2, prereqs: ['ppl-clouds', 'ppl-fog'],
  objectives: ['State the difference between a METAR and a TAF.', 'Decode each group of a METAR.', 'Explain CAVOK.', 'Interpret the common change groups in a TAF.', 'Use the reported wind to find the crosswind on a runway.'],
  intro: 'Aerodrome weather is sent around the world in a compact code. Once you can read it, a single line tells you whether you can depart, whether you can land, and which runway to expect.',
  simple: 'A METAR says what the weather is now. A TAF says what it is expected to be. Both use the same short codes in the same order: wind, visibility, weather, cloud, temperature and pressure.',
  sections: [
    { h: 'Observation and forecast', body: [
      'A **METAR** is a routine **observation** of the weather at an aerodrome, issued at regular intervals. A **TAF** is a **forecast** for the aerodrome over a stated period.',
    ] },
    { h: 'Reading a METAR', body: [
      'The groups always come in the same order. Select each group of the sample report to decode it.',
    ], lab: 'explore:metar' },
    { h: 'CAVOK', body: [
      '**CAVOK** replaces the visibility, weather and cloud groups when all of these are true: visibility 10 km or more; no cloud below 5,000 ft or below the highest minimum sector altitude, whichever is greater; no cumulonimbus or towering cumulus; and no significant weather.',
      'CAVOK does not mean a cloudless sky.',
    ] },
    { h: 'Reading a TAF', body: [
      'A TAF begins with its validity period, for example `1212/1318`: from 12:00 UTC on the 12th to 18:00 UTC on the 13th.',
      '**BECMG** means a lasting change during the stated period. **TEMPO** means temporary changes, each lasting less than an hour. **FM** means a rapid change from that time. **PROB30** or **PROB40** gives the probability of the conditions that follow.',
    ] },
    { h: 'From the report to the runway', body: [
      'The wind in a METAR is given in degrees **true**. The crosswind on a runway depends on the angle between the wind and the runway direction.',
    ], lab: 'trig', note: 'Runway directions are magnetic, while METAR and TAF winds are true; the wind passed by a control tower is magnetic. Where magnetic variation is large, allow for the difference.' },
  ],
  examples: [
    { title: 'Decoding a report', steps: ['METAR EGZZ 121350Z 24012KT 9999 FEW030 18/11 Q1016 NOSIG.', 'Wind from 240° at 12 kt; visibility 10 km or more; 1–2 oktas at 3,000 ft.', 'Temperature 18 °C, dew point 11 °C; QNH 1016 hPa; no significant change expected.'] },
    { title: 'A winter morning', steps: ['METAR EGZZ 050620Z 00000KT 0400 FG VV002 M01/M01 Q1028.', 'Calm; visibility 400 m in fog; sky obscured with a vertical visibility of 200 ft.', 'Temperature and dew point both −1 °C: the air is saturated.'] },
  ],
  practice: [
    mcq('24012G22KT means:', ['Wind from 240° at 12 kt, gusting 22 kt', 'Wind toward 240° at 22 kt', 'Wind from 120° at 24 kt', 'Wind from 240° at 22 kt, gusting 12 kt'], 'Direction, speed, then G and the gust speed.'),
    mcq('A visibility group of 9999 means:', ['10 km or more', '9,999 ft', 'Less than 1 km', 'Not measured'], '9999 is the code for 10 km or more.'),
    mcq('BKN030 means:', ['5–7 oktas with base 3,000 ft', '5–7 oktas with base 300 ft', '3–4 oktas with base 3,000 ft', 'Overcast at 30,000 ft'], 'Cloud base is given in hundreds of feet.'),
    num('In a METAR the temperature is shown as M02. What is the temperature?', -2, 0.001, '°C', 'M means minus.'),
    mcq('TEMPO in a forecast means:', ['Temporary changes lasting less than an hour each', 'A permanent change', 'No change', 'The forecast has ended'], 'Conditions fluctuate and return to the main forecast.'),
  ],
  assessment: [
    mcq('18008KT means:', ['Wind from 180° at 8 kt', 'Wind from 080° at 18 kt', 'Wind toward 180° at 8 kt', 'Visibility 1,800 m'], 'Three digits of direction, two of speed.'),
    mcq('0400 FG means:', ['Visibility 400 m in fog', 'Fog at 04:00', 'Visibility 4,000 m in mist', 'Cloud base 400 ft'], 'Four digits of visibility in metres, then the weather code.'),
    mcq('OVC008 means:', ['Overcast with base 800 ft', 'Overcast with base 8,000 ft', 'Scattered cloud at 800 ft', '8 oktas at 80 ft'], '008 is eight hundred feet.'),
    num('The group Q0998 gives a QNH of how many hectopascals?', 998, 0.001, 'hPa', 'Q is followed by the pressure in hPa.'),
    mcq('The difference between a METAR and a TAF is that:', ['A METAR is an observation and a TAF is a forecast', 'A METAR is a forecast and a TAF is an observation', 'Both are forecasts', 'A TAF covers only the next 10 minutes'], 'One reports the present, the other predicts.'),
    mcq('BECMG means:', ['A lasting change during the stated period', 'A temporary change', 'No change', 'A probability'], '"Becoming".'),
    tf('The wind direction in a METAR is given in degrees true.', true, 'Reports and forecasts use true north; a tower passes magnetic wind.'),
    mcq('CAVOK means, among other things:', ['Visibility 10 km or more and no cloud below 5,000 ft', 'No cloud at any level', 'Calm wind', 'Temperature above 15 °C'], 'It also requires no cumulonimbus or towering cumulus and no significant weather.'),
  ],
  missionId: 'm-ppl-metar', sources: ['metoffice-metar', 'icao-a3', 'faa-wx'],
});

export const rules = lesson('Air law', {
  id: 'ppl-rules', title: 'Rules of the Air', minutes: 13, level: 2,
  objectives: ['State who is responsible for avoiding collisions.', 'Apply the right-of-way rules.', 'State the ICAO minimum heights for visual flight.', 'Choose a correct VFR cruising level for a track.'],
  intro: 'The rules of the air are the highway code of the sky. They are short, and a pilot must know them without thinking, because the moments when they matter leave no time to look anything up.',
  simple: 'Head-on: both turn right. Crossing: the one who sees the other on the right gives way. Overtaking: pass on the right. Landing aircraft go first. And whoever has right of way must still avoid a collision.',
  sections: [
    { h: 'Responsibility', body: [
      'The **pilot-in-command** is responsible for the operation of the aircraft in accordance with the rules of the air, and for avoiding collisions.',
      'An aircraft that has right of way maintains its heading and speed, but no rule relieves a pilot of the duty to take whatever action will best avert a collision.',
    ] },
    { h: 'Right of way', body: [
      'Select each case to see the rule.',
    ], lab: 'explore:rightofway' },
    { h: 'Minimum heights', body: [
      'Except for take-off and landing, the ICAO rules for visual flight, as implemented in the European rules of the air, are:',
      'Over **congested areas** of cities, towns or settlements, or over an open-air assembly of people: not below **1,000 ft above the highest obstacle within 600 m** of the aircraft.',
      '**Elsewhere:** not below **500 ft** above the ground or water.',
    ], note: 'Jurisdiction note: the European rule (SERA.5005(f)) adds that, away from congested areas, the aircraft must also be at least 500 ft above the highest obstacle within 150 m. The United States rule (14 CFR §91.119) is 1,000 ft above the highest obstacle within a horizontal radius of 2,000 ft over congested areas and 500 ft above the surface elsewhere, except over open water or sparsely populated areas, where the aircraft may not come closer than 500 ft to any person, vessel, vehicle or structure. Always use your own authority\'s rule.' },
    { h: 'VFR cruising levels', body: [
      'To reduce the risk of head-on conflicts in level cruise, levels are assigned by **magnetic track** — the semicircular rule.',
      'Track **000° to 179°**: odd thousands plus 500 ft (3,500, 5,500, 7,500 …). Track **180° to 359°**: even thousands plus 500 ft (4,500, 6,500, 8,500 …).',
      'The rule applies in level cruising flight above 3,000 ft above the ground, unless ATC instructs otherwise.',
    ] },
  ],
  examples: [
    { title: 'A crossing aircraft', steps: ['An aeroplane at your level is converging from your right.', 'It is on your right, so you give way.', 'Turn to pass behind it; do not cross in front.'] },
    { title: 'Choosing a level', steps: ['Your magnetic track is 250°.', '250° is between 180° and 359°: even thousands plus 500 ft.', 'Suitable VFR levels are 4,500 ft or 6,500 ft.'] },
  ],
  practice: [
    mcq('Two aircraft approach head-on. Each should:', ['Alter heading to the right', 'Alter heading to the left', 'Climb', 'Hold heading and speed'], 'Both turn right and pass left side to left side.'),
    mcq('Two aeroplanes converge at the same level. Which gives way?', ['The one that has the other on its right', 'The one that has the other on its left', 'The faster one', 'The larger one'], '"On the right, in the right."'),
    mcq('An overtaking aircraft passes the other:', ['On the right', 'On the left', 'Directly above', 'Directly below'], 'The overtaking aircraft alters heading to the right and keeps clear.'),
    mcq('A powered aeroplane and a glider are converging. Who gives way?', ['The powered aeroplane', 'The glider', 'Neither', 'Whichever is higher'], 'The more manoeuvrable aircraft gives way.'),
    num('Under ICAO rules, the minimum height over a congested area is how many feet above the highest obstacle within 600 m?', 1000, 0.001, 'ft', '1,000 ft above the highest obstacle within a 600 m radius.'),
  ],
  assessment: [
    mcq('Two aircraft are approaching to land. Which has right of way?', ['The lower aircraft, provided it does not cut in front of one on final', 'The higher aircraft', 'The faster aircraft', 'The one that called first'], 'The lower aircraft has priority but must not abuse the rule.'),
    mcq('A powered aeroplane and a balloon are converging. Who gives way?', ['The aeroplane', 'The balloon', 'Neither', 'The one on the left'], 'A balloon cannot manoeuvre to avoid traffic.'),
    num('Under ICAO rules, the minimum height over open country, away from congested areas, is how many feet above the ground?', 500, 0.001, 'ft', '500 ft above the ground or water.'),
    mcq('Your magnetic track is 090°. A correct VFR cruising level is:', ['5,500 ft', '4,500 ft', '6,000 ft', '6,500 ft'], 'Tracks 000°–179° use odd thousands plus 500 ft.'),
    mcq('Your magnetic track is 270°. A correct VFR cruising level is:', ['6,500 ft', '5,500 ft', '7,000 ft', '7,500 ft'], 'Tracks 180°–359° use even thousands plus 500 ft.'),
    tf('An aircraft that has right of way should normally maintain its heading and speed.', true, 'That makes its path predictable for the aircraft giving way.'),
    scenario(mcq('You have right of way, but the other aircraft is not turning and you are closing fast. You should:', ['Take avoiding action yourself at once', 'Hold heading and speed because you have right of way', 'Call the other aircraft and wait for a reply', 'Flash your landing light and continue'], 'Right of way never removes the duty to avoid a collision.')),
  ],
  missionId: 'm-ppl-rules', sources: ['sera', 'cfr-91', 'icao-a2'],
});

export const airspace = lesson('Air law', {
  id: 'ppl-airspace', title: 'Airspace Classification', minutes: 13, level: 2, prereqs: ['ppl-rules'],
  objectives: ['Distinguish controlled from uncontrolled airspace.', 'Describe the seven ICAO airspace classes.', 'State what a VFR flight needs to enter each class.', 'State the ICAO visual meteorological conditions minima.', 'Explain why "standby" is not a clearance.'],
  intro: 'The sky is divided into blocks with different rules. Before you cross a line on the chart you must know what is on the other side: who is allowed in, who separates whom, and whether you need permission.',
  simple: 'There are seven classes, A to G. A is the strictest: instrument flights only. G is the freest: no control at all. For a visual flight the key questions are: am I allowed in, do I need a clearance, and do I need a radio?',
  sections: [
    { h: 'Controlled and uncontrolled', body: [
      'In **controlled airspace** (classes A to E) an air traffic control service is provided. In **uncontrolled airspace** (classes F and G) pilots are responsible for their own separation and may receive information on request.',
    ] },
    { h: 'The seven classes', body: [
      'Select each class to see who may fly there, who is separated from whom, and what a VFR flight needs.',
    ], lab: 'explore:airspace' },
    { h: 'Visual meteorological conditions', body: [
      'A VFR flight must remain in **visual meteorological conditions (VMC)**. The ICAO minima are:',
      '**At and above 10,000 ft:** visibility 8 km; 1,500 m horizontally and 1,000 ft vertically from cloud.',
      '**Below 10,000 ft:** visibility 5 km, with the same distances from cloud.',
      '**In classes F and G at low level** (at or below 3,000 ft above sea level or 1,000 ft above terrain, whichever is higher): visibility 5 km, clear of cloud and with the surface in sight.',
    ], note: 'Jurisdiction note: these are the ICAO Annex 2 figures. States may apply different minima — the United States, for example, uses statute miles and its own cloud-clearance distances for each class. Use the published national rules.' },
    { h: 'Entering controlled airspace', body: [
      'Where a clearance is required, you must **receive it before entering**. Request it in good time and be ready to remain outside.',
      'A reply of **"standby"** means only that the controller will call you back. It is not a clearance. Until you hear a clearance for your aircraft, stay outside the boundary.',
    ] },
  ],
  examples: [
    { title: 'Approaching a control zone', steps: ['You are VFR, five minutes from a Class D zone.', 'Class D requires a clearance and two-way radio contact.', 'Call early with your position, level and request. If the reply is "standby", orbit outside the boundary until cleared.'] },
  ],
  practice: [
    mcq('In which class is VFR flight not permitted?', ['Class A', 'Class C', 'Class E', 'Class G'], 'Class A is for IFR flights only.'),
    mcq('Which class is uncontrolled airspace with only a flight information service?', ['Class G', 'Class B', 'Class C', 'Class D'], 'Class G is uncontrolled.'),
    mcq('To enter Class D airspace, a VFR flight needs:', ['An ATC clearance and two-way radio contact', 'Nothing', 'Only a flight plan', 'Only a transponder'], 'Class B, C and D all require a clearance for VFR flights.'),
    num('Under ICAO rules, the minimum flight visibility for VFR below 10,000 ft is how many kilometres?', 5, 0.001, 'km', '5 km below 10,000 ft; 8 km at and above.'),
    tf('If the controller replies "standby", you are cleared to enter controlled airspace.', false, '"Standby" means wait. Remain outside until you receive a clearance.'),
  ],
  assessment: [
    mcq('In which class are IFR and VFR flights both permitted and all aircraft separated from each other?', ['Class B', 'Class D', 'Class E', 'Class G'], 'Class A also separates all aircraft but does not admit VFR flights.'),
    mcq('In Class C, a VFR flight is separated by ATC from:', ['IFR flights', 'All other flights', 'No other flights', 'Military flights only'], 'It receives traffic information about other VFR flights.'),
    mcq('In Class E, a VFR flight:', ['Does not need a clearance', 'Needs a clearance', 'Is not permitted', 'Is separated from all traffic'], 'Class E is controlled airspace for IFR flights only.'),
    num('Under ICAO rules, the minimum flight visibility for VFR at and above 10,000 ft is how many kilometres?', 8, 0.001, 'km', '8 km at and above 10,000 ft.'),
    mcq('Under ICAO rules, the standard VMC distance from cloud is:', ['1,500 m horizontally and 1,000 ft vertically', '500 m horizontally and 500 ft vertically', '5 km horizontally', 'Clear of cloud in all classes'], 'These distances apply except in low-level Class F and G airspace.'),
    tf('In Class G airspace, ATC separates all aircraft.', false, 'Class G is uncontrolled. Pilots see and avoid.'),
    scenario(mcq('You call for entry to a Class D zone and hear no reply. You are one minute from the boundary. You should:', ['Remain outside the boundary and keep trying', 'Enter, since you made the call', 'Enter and call again inside', 'Descend and cross underneath at any height'], 'Without a clearance you may not enter. Stay clear, check the frequency and radio, and call again.')),
  ],
  missionId: 'm-ppl-airspace', sources: ['sera', 'cfr-91', 'icao-a11', 'icao-a2'],
});
