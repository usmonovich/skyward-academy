// PPL Phase B — Operational Procedures (4 lessons) and Flight Performance and Planning (3 lessons).
// Checked on 12 Nov 2026: 14 CFR §91.151 (VFR fuel reserves) and SERA Appendix 3 (VFR cruising levels).
import { lesson, mcq, num, tf } from './q';

export const wake = lesson('Operational procedures', {
  id: 'ppl-wake-turbulence', title: 'Wake Turbulence', minutes: 10, level: 2, prereqs: ['ppl-drag-and-the-polar-curve'],
  objectives: ['Explain how wake vortices form.', 'State when they are strongest.', 'Describe how vortices move after they are generated.', 'Apply avoidance techniques for take-off and landing.'],
  intro: 'Behind every aircraft is a pair of invisible horizontal whirlwinds. Behind a large one they can roll a light aircraft onto its back, close to the ground, with no warning.',
  simple: 'A wing making lift leaves a spinning trail of air from each wingtip. The heavier and slower the aircraft, the stronger the trail. It sinks and drifts with the wind. Stay above the path of a bigger aircraft and touch down beyond where it did.',
  sections: [
    { h: 'How it forms', body: [
      'Higher pressure under the wing spills around the tip towards the lower pressure above, forming a **wingtip vortex** on each side. Vortices are a by-product of lift: they begin when the nose wheel leaves the ground and end when it touches down.',
      'They are strongest when the generating aircraft is **heavy, clean and slow**.',
    ] },
    { h: 'How it moves', body: [
      'Vortices sink below the flight path of the generating aircraft and then level off. Near the ground they spread outward. They drift with the wind.',
      'A **light crosswind** can hold one vortex over the runway, and a **light tailwind** can carry vortices into the touchdown zone. Calm or light winds are the most dangerous conditions.',
    ], lab: 'explore:wake' },
    { h: 'Avoidance', body: [
      '**Landing behind a larger aircraft that has landed**: stay at or above its approach path and touch down **beyond** its touchdown point.',
      '**Taking off behind a larger aircraft that has taken off**: lift off **before** its rotation point and climb above its path, or turn away upwind.',
      '**Landing behind a larger aircraft that has taken off**: touch down **before** its rotation point.',
      'When in doubt, wait. Vortices weaken with time.',
    ] },
    { h: 'Categories and spacing', body: [
      'ICAO groups aircraft by maximum take-off mass: **light** up to 7,000 kg, **medium** above 7,000 kg and below 136,000 kg, **heavy** 136,000 kg or more. Air traffic control applies extra spacing behind heavier categories.',
      'A helicopter in a hover or slow flight also produces strong downwash and vortices: keep well clear.',
    ], note: 'Avoidance techniques follow FAA guidance. Spacing applied by air traffic control is a minimum; a pilot may always ask for more.' },
  ],
  examples: [
    { title: 'Landing behind an airliner', steps: ['An airliner has just landed on your runway.', 'Its vortices stopped where its nose wheel touched down.', 'Fly above its approach path and land beyond its touchdown point.'] },
    { title: 'Departing behind an airliner', steps: ['An airliner has just taken off in calm wind.', 'Vortices begin at its rotation point and may linger.', 'Wait, then lift off before its rotation point and stay above its path.'] },
  ],
  practice: [
    mcq('Wake vortices are produced:', ['Whenever a wing is producing lift', 'Only by jet engines', 'Only on the ground', 'Only in cloud'], 'They are a by-product of lift.'),
    mcq('Wake vortices tend to:', ['Sink below the flight path of the generating aircraft', 'Rise above it', 'Stay exactly on it', 'Vanish instantly'], 'So stay above the path of the aircraft ahead.'),
    mcq('When landing behind a larger aircraft that has just landed, touch down:', ['Beyond its touchdown point', 'Before its touchdown point', 'At exactly the same point', 'On the grass'], 'Its vortices ended where it touched down.'),
    mcq('Which wind is most likely to keep a vortex on the runway?', ['A light crosswind', 'A strong headwind', 'A gale', 'A strong crosswind'], 'It can cancel the outward drift of one vortex.'),
    tf('Wake vortices are strongest behind a light, fast aircraft.', false, 'They are strongest behind a heavy, clean, slow aircraft.'),
  ],
  assessment: [
    mcq('Wake vortices are strongest when the generating aircraft is:', ['Heavy, clean and slow', 'Light, fast and with flaps down', 'On the ground with engines idle', 'Descending at high speed'], 'High lift coefficient and high weight.'),
    mcq('A departing aircraft begins to produce wake vortices:', ['At rotation, as the wing starts to lift the aircraft', 'When the engines start', 'At the top of climb', 'Only above 1,000 ft'], 'Lift is what creates them.'),
    mcq('When taking off behind a larger aircraft that has just departed, you should:', ['Lift off before its rotation point and stay above its path', 'Lift off beyond its rotation point', 'Follow directly in its path', 'Take off immediately behind it'], 'Or wait for the vortices to decay.'),
    mcq('When landing behind a larger aircraft that has just taken off, touch down:', ['Before its rotation point', 'Beyond its rotation point', 'At the far end of the runway', 'Anywhere'], 'Its vortices began at rotation.'),
    num('In the ICAO wake turbulence categories, up to what maximum take-off mass in kilograms is an aircraft "light"?', 7000, 1, 'kg', '7,000 kg or less.'),
    mcq('The most hazardous wind for lingering wake turbulence is:', ['Calm or light wind', 'A strong, gusty wind', 'A gale along the runway', 'A strong crosswind'], 'Stronger wind breaks up and carries away the vortices.'),
    tf('A hovering helicopter can produce hazardous downwash and vortices.', true, 'Keep well clear.'),
  ],
  missionId: 'm-ppl-wake', sources: ['faa-aim', 'icao-4444', 'phak'],
});

export const emergencies = lesson('Operational procedures', {
  id: 'ppl-emergency-procedures', title: 'Emergency Procedures', minutes: 12, level: 2, prereqs: ['ppl-distress-and-urgency-calls', 'ppl-drag-and-the-polar-curve'],
  objectives: ['State the order of priorities in any emergency.', 'Describe the actions after an engine failure just after take-off.', 'Describe how to plan a forced landing.', 'Distinguish a forced landing from a precautionary landing.'],
  intro: 'Emergencies are rare, and a prepared pilot has already decided what to do before one happens. The first seconds are for flying the aircraft, not for finding the cause.',
  simple: 'First keep the aircraft flying. Then decide where to go. Then tell someone. If the engine fails low down after take-off, land ahead. If it fails higher up, set the best glide speed and choose a field.',
  sections: [
    { h: 'Priorities', body: [
      '**Aviate, navigate, communicate.** Control of the aircraft comes first, always. Then work the problem with the checklist.',
    ] },
    { h: 'Engine failure after take-off', body: [
      'Immediately **lower the nose** to keep flying speed. Land **ahead**, choosing the best area within a small arc either side of the nose.',
      'Turning back to the runway at low height needs a steep turn at low speed, with a high stall speed and little height to lose. It has killed many pilots.',
      'Brief yourself before every take-off on what you will do if the engine fails.',
    ] },
    { h: 'Forced landing without power', body: [
      'Set the **best glide speed** and trim. Choose a landing area, considering **wind, size, surface, slope and surroundings**. Plan a pattern to arrive at it.',
      'If height allows, try to find the cause: fuel selector, mixture, carburettor heat, magnetos. Make a **MAYDAY** call and set **7700**.',
      'Before touchdown, secure the aircraft as the checklist directs, typically fuel off, ignition off and harnesses tight, and unlatch the doors. Touch down as slowly as possible, under control.',
    ], lab: 'explore:emergencies' },
    { h: 'Precautionary landing', body: [
      'A **precautionary landing** is a landing with power, made by choice because continuing is unwise: worsening weather, fading light, low fuel, being lost. Because the engine is running, the field can be inspected first.',
      'Landing early with power is far safer than a forced landing later without it.',
    ], note: 'The emergency checklists in the aircraft flight manual are the authority for the type you fly. Emergency drills are practised only with an instructor.' },
  ],
  examples: [
    { title: 'Failure at 300 ft', steps: ['The engine fails at 300 ft after take-off.', 'Lower the nose at once and keep flying speed.', 'Land ahead in the best available area. Do not turn back.'] },
    { title: 'Weather closing in', steps: ['Cloud is lowering and you cannot return to an aerodrome.', 'The engine is running and a large field is below.', 'Make a precautionary landing while you still have power and visibility.'] },
  ],
  practice: [
    mcq('The first priority in any emergency is to:', ['Keep control of the aircraft', 'Make a radio call', 'Find the cause', 'Read the whole checklist'], 'Aviate first.'),
    mcq('After an engine failure in cruise, the first speed to set is:', ['The best glide speed', 'The maximum speed', 'The stall speed', 'The flap limit speed'], 'It gives the most distance to choose a field.'),
    mcq('Which is considered when choosing a field for a forced landing?', ['Wind, size, surface, slope and surroundings', 'The colour of the crops only', 'The nearest café', 'The owner\'s name'], 'Land into wind if possible, on a long, firm, level field.'),
    mcq('A precautionary landing is made:', ['With power, by choice', 'Without power, by necessity', 'Only on runways', 'Only at night'], 'For example because of worsening weather.'),
    tf('Turning back to the runway is the safest action after an engine failure at low height.', false, 'Land ahead: the turn needs height and speed that are not available.'),
  ],
  assessment: [
    mcq('The order of priorities in an emergency is:', ['Aviate, navigate, communicate', 'Communicate, navigate, aviate', 'Navigate, communicate, aviate', 'Communicate, aviate, navigate'], 'Fly the aircraft first.'),
    mcq('If the engine fails just after take-off, the immediate action is to:', ['Lower the nose to keep flying speed', 'Pull the nose up to gain height', 'Turn back to the runway', 'Make a long radio call'], 'Then land ahead.'),
    mcq('After an engine failure just after take-off at low height, you should land:', ['Ahead, within a small arc either side of the nose', 'Back on the departure runway', 'Downwind on a parallel runway', 'After a full circuit'], 'There is not enough height to turn back.'),
    mcq('During a forced landing, if time permits, the radio call is prefixed:', ['MAYDAY, MAYDAY, MAYDAY', 'PAN PAN', 'No prefix', 'ROGER'], 'It is a distress situation.'),
    mcq('The advantage of a precautionary landing over continuing is that:', ['The field can be inspected and the landing made with power', 'It is faster', 'No decision is needed', 'It needs no skill'], 'Options remain open while the engine runs.'),
    mcq('Touchdown in a forced landing should be made:', ['As slowly as possible, under control', 'As fast as possible', 'In a steep dive', 'With the aircraft stalled at height'], 'Impact energy depends on speed squared.'),
    tf('A pilot should brief the engine-failure actions before every take-off.', true, 'The decision is then already made.'),
  ],
  missionId: 'm-ppl-emergency', sources: ['afh', 'phak'],
});

export const preflight = lesson('Operational procedures', {
  id: 'ppl-practical-pre-flight-procedures', title: 'Practical Pre-flight Procedures', minutes: 10, level: 2, prereqs: ['ppl-introduction-to-flight-planning', 'ppl-airframe-and-landing-gear'],
  objectives: ['List the documents to check before flight.', 'Describe the purpose and method of the walk-round inspection.', 'Give a passenger safety briefing.', 'Explain the correct use of checklists.'],
  intro: 'The pre-flight is where a pilot finds on the ground what would otherwise be discovered in the air. It is done the same way every time, because the day it is skipped is the day it matters.',
  simple: 'Check the paperwork, then walk round the aircraft looking and touching in a set order. Check the fuel and oil yourself. Tell your passengers what to do and what not to touch. Use the checklist every time.',
  sections: [
    { h: 'Documents', body: [
      'The pilot carries a licence, medical certificate and identification. The aircraft must have its required documents. In the United States these are remembered as **ARROW**: **A**irworthiness certificate, **R**egistration, **R**adio licence (for international flights), **O**perating limitations, **W**eight and balance data.',
      'Check the technical log or maintenance records for open defects and that inspections are in date.',
    ], lab: 'explore:preflight' },
    { h: 'The walk-round', body: [
      'Follow the flight manual checklist around the aircraft in a fixed order. Look for damage, leaks, loose or missing fasteners, and anything left attached: covers, control locks, tie-downs, tow bar.',
      'Check **fuel** quantity visually and take samples; check **oil** quantity; check that the controls move fully and freely in the correct sense.',
      'Remove all frost, ice and snow from the aircraft before flight.',
    ] },
    { h: 'Passenger briefing', body: [
      'Before starting, brief passengers on: seat belts and harnesses; doors and emergency exits; no smoking; keeping clear of the controls; when to keep quiet; and what to do in an emergency.',
    ] },
    { h: 'Checklists', body: [
      'A checklist may be used as **read and do** on the ground, or as a **flow** from memory followed by a check against the list. Either way the list is read, every time.',
      'If a checklist is interrupted, start it again from the beginning.',
    ], note: 'Required documents and inspections differ between states and aircraft. The flight manual and your authority\'s rules list what applies to you.' },
  ],
  examples: [
    { title: 'Interrupted check', steps: ['A phone call interrupts your walk-round at the left wing.', 'You cannot be sure where you stopped.', 'Start the walk-round again from the beginning.'] },
    { title: 'Frost on the wing', steps: ['A thin layer of frost covers the wings on a cold morning.', 'Even thin frost reduces lift and raises the stall speed.', 'Remove it completely before flight.'] },
  ],
  practice: [
    mcq('In the ARROW check, the letter A stands for:', ['Airworthiness certificate', 'Altimeter', 'Alternator', 'Aileron'], 'The first required aircraft document.'),
    mcq('Fuel quantity before flight should be checked:', ['Visually, as well as on the gauges', 'On the gauges only', 'By asking the previous pilot', 'After take-off'], 'Gauges in light aircraft can mislead.'),
    mcq('A passenger briefing should include:', ['Seat belts, exits and keeping clear of the controls', 'The price of the aircraft', 'The pilot\'s logbook totals', 'Engine maintenance history'], 'Passengers must know what to do in an emergency.'),
    mcq('If a checklist is interrupted, you should:', ['Start it again from the beginning', 'Continue from where you think you stopped', 'Skip it', 'Do it after take-off'], 'An item missed is an item unchecked.'),
    tf('Thin frost on the wings may be left in place for a short flight.', false, 'All frost, ice and snow must be removed.'),
  ],
  assessment: [
    mcq('In the ARROW check, the letter W stands for:', ['Weight and balance data', 'Weather report', 'Wind limits', 'Wheel pressures'], 'It shows how the aircraft may be loaded.'),
    mcq('The walk-round inspection is carried out:', ['In a fixed order, following the flight manual checklist', 'In any order from memory', 'Only once a week', 'Only by an engineer'], 'A fixed order means nothing is missed.'),
    mcq('Before flight, the flight controls are checked for:', ['Full and free movement in the correct sense', 'Colour', 'Temperature', 'Weight'], 'A control lock left in, or crossed controls, must be found on the ground.'),
    mcq('Which of these must be removed before flight?', ['Control locks, covers and tie-downs', 'The propeller', 'The fuel caps', 'The static wicks'], 'Anything left attached can be fatal.'),
    mcq('A fuel sample is taken before flight to check for:', ['Water, dirt and the correct grade', 'Fuel pressure', 'Engine temperature', 'Tyre wear'], 'From each drain point.'),
    mcq('The technical log is checked for:', ['Open defects and inspections in date', 'The weather forecast', 'The pilot\'s medical', 'Radio frequencies'], 'The aircraft must be airworthy.'),
    tf('A checklist should be read every time, even by an experienced pilot.', true, 'Memory fails under distraction and pressure.'),
  ],
  missionId: 'm-ppl-preflight', sources: ['phak', 'afh'],
});

export const fire = lesson('Operational procedures', {
  id: 'ppl-fire-and-smoke', title: 'Fire and Smoke', minutes: 10, level: 2, prereqs: ['ppl-emergency-procedures', 'ppl-fuel-and-electrical-systems'],
  objectives: ['Name the three things a fire needs.', 'Describe the principles of dealing with an engine fire.', 'Describe the principles of dealing with an electrical fire.', 'Explain the priority after any fire in flight.'],
  intro: 'Fire in the air leaves very little time. The actions are few and must be known by heart, because there may be no chance to read them.',
  simple: 'A fire needs fuel, oxygen and heat. Take one away and it goes out. For an engine fire, cut off the fuel. For an electrical fire, cut off the electricity. Then get on the ground quickly.',
  sections: [
    { h: 'The fire triangle', body: [
      'A fire needs **fuel**, **oxygen** and **heat**. Every fire drill works by removing one of them.',
    ] },
    { h: 'Engine fire', body: [
      '**In flight**: shut off the fuel to the engine (mixture to idle cut-off, fuel selector off), turn off cabin heat and ventilation that draw air from the engine bay, and make an immediate forced landing. Do not try to restart.',
      '**During start**: a fire in the intake is usually dealt with by continuing to crank the engine so the flames are drawn inside; if it does not go out, shut off the fuel, leave the aircraft and use an extinguisher.',
    ], lab: 'explore:fire' },
    { h: 'Electrical fire and smoke', body: [
      'A smell of burning insulation or visible smoke suggests an electrical fire. Turn the **master switch off** to remove the source, close vents if they feed the fire, and use the extinguisher if needed. Once it is out, **ventilate** the cabin.',
      'Land as soon as possible. Restore only essential electrical items, one at a time, if the flight manual allows.',
    ] },
    { h: 'After any fire', body: [
      'Land **as soon as possible**: damage may be worse than it appears and the fire may return. Smoke and fumes are themselves incapacitating.',
      'Know where the extinguisher is and how to use it before you ever need it.',
    ], note: 'These are general principles. The exact fire drills for each aircraft are in its flight manual and must be learned for the type.' },
  ],
  examples: [
    { title: 'Smoke from under the panel', steps: ['You smell burning plastic and see smoke from behind the instrument panel.', 'An electrical fire is likely.', 'Master switch off, extinguisher if needed, ventilate once out, land as soon as possible.'] },
    { title: 'Flames from the cowling', steps: ['Flames appear from the engine cowling in flight.', 'Remove the fuel: mixture to cut-off, fuel selector off.', 'Cabin heat off and make an immediate forced landing.'] },
  ],
  practice: [
    mcq('The three things a fire needs are:', ['Fuel, oxygen and heat', 'Fuel, water and air', 'Heat, light and smoke', 'Oxygen, nitrogen and fuel'], 'The fire triangle.'),
    mcq('The first step in dealing with an engine fire in flight is to:', ['Shut off the fuel to the engine', 'Increase power', 'Open the cabin heat', 'Restart the engine'], 'Remove the fuel from the fire.'),
    mcq('A smell of burning insulation suggests:', ['An electrical fire', 'Carburettor ice', 'Low oil pressure', 'A blocked pitot tube'], 'Turn off the master switch.'),
    mcq('After a cabin fire has been put out, the cabin should be:', ['Ventilated', 'Sealed', 'Heated', 'Pressurised'], 'To clear smoke and fumes.'),
    tf('After putting out a fire in flight, it is safe to continue to the destination.', false, 'Land as soon as possible.'),
  ],
  assessment: [
    mcq('A fire can be put out by removing:', ['Any one of fuel, oxygen or heat', 'Only all three together', 'Only the smoke', 'The pilot'], 'Each drill removes one side of the triangle.'),
    mcq('With an engine fire in flight, the cabin heater should be:', ['Turned off', 'Turned fully on', 'Left as it is', 'Cycled on and off'], 'It can draw smoke and flames into the cabin.'),
    mcq('After an engine fire in flight has been dealt with, the pilot should:', ['Make an immediate forced landing without restarting', 'Restart the engine and continue', 'Climb to a higher altitude', 'Hold over the airfield'], 'A restart may reignite the fire.'),
    mcq('The first action for a suspected electrical fire is to:', ['Turn the master switch off', 'Turn on all the lights', 'Open the throttle', 'Lower the flaps'], 'Remove the electrical source.'),
    mcq('An intake fire during engine start is usually dealt with first by:', ['Continuing to crank the engine', 'Opening the cowling', 'Adding more fuel', 'Releasing the brakes'], 'The flames are drawn into the engine.'),
    mcq('After any fire in flight, the aircraft should be landed:', ['As soon as possible', 'At the planned destination', 'After burning off fuel', 'Only at an international airport'], 'Hidden damage and re-ignition are real risks.'),
    tf('A pilot should know where the fire extinguisher is before the flight begins.', true, 'There will be no time to search for it.'),
  ],
  missionId: 'm-ppl-fire', sources: ['afh', 'phak'],
});

export const takeoffLanding = lesson('Flight performance and planning', {
  id: 'ppl-take-off-and-landing-performance', title: 'Take-off and Landing Performance', minutes: 12, level: 2, prereqs: ['phys-aircraft-performance-fundamentals', 'ppl-mb'],
  objectives: ['Define take-off run, take-off distance and landing distance.', 'List the factors that increase them.', 'Apply correction and safety factors to a manual figure.', 'Compare the distance required with the distance available.'],
  intro: 'Runway overruns are among the most common accidents in light aircraft, and nearly all could have been predicted with a few minutes of arithmetic before the flight.',
  simple: 'The manual tells you how much runway the aircraft needs in ideal conditions. Heat, height, weight, grass, slope and tailwind all add to it. Work out the real figure, add a margin, and compare it with the runway you actually have.',
  sections: [
    { h: 'Definitions', body: [
      '**Take-off run** is the ground roll to lift-off. **Take-off distance** is the distance to reach a height of 50 ft. **Landing distance** is measured from 50 ft above the threshold to a full stop.',
      'The runway\'s declared distances, such as take-off run available and landing distance available, are published for each aerodrome.',
    ] },
    { h: 'What makes it longer', body: [
      'Higher **weight**, higher **density altitude** (elevation and temperature), a **tailwind**, an **uphill slope** (for take-off), and **grass, soft or wet surfaces** all increase the distance.',
      'For planning, it is common practice to take credit for no more than half of a reported headwind, and to allow for one and a half times a reported tailwind.',
    ] },
    { h: 'Applying factors', body: [
      'Manual figures are for a new aircraft, a hard dry runway and a test pilot. Corrections are applied by multiplying: `required = manual distance × condition factors × safety factor`.',
      'United Kingdom CAA guidance suggests, for take-off, about 1.2 for dry grass and 1.3 for wet grass, and an overall safety factor of 1.33; for landing, a safety factor of 1.43.',
      'A manual take-off distance of 400 m on dry grass becomes 400 × 1.2 × 1.33 ≈ 638 m.',
    ], formula: 'perf-factor', lab: 'formula:perf-factor' },
    { h: 'The decision', body: [
      'Compare the factored distance with the distance available. If it does not fit, reduce weight, wait for cooler air or more headwind, or do not go.',
    ], note: 'The factors quoted are from UK CAA safety guidance as recalled, and have not been checked against the current leaflet. Use the performance data in your aircraft flight manual and the factors your own authority recommends or requires.' },
  ],
  examples: [
    { title: 'Grass take-off', steps: ['Manual take-off distance is 500 m. The runway is dry grass.', '500 × 1.2 = 600 m; with the 1.33 safety factor, 600 × 1.33 = 798 m.', 'You need about 800 m available.'] },
    { title: 'Go or no-go', steps: ['Factored take-off distance is 720 m. Take-off distance available is 650 m.', '720 is more than 650.', 'Do not depart in these conditions.'] },
  ],
  practice: [
    num('Manual take-off distance 500 m, dry grass factor 1.2, safety factor 1.33. Distance required?', 798, 2, 'm', '500 × 1.2 × 1.33 = 798 m.'),
    mcq('Take-off distance is measured to a height of:', ['50 ft', '500 ft', '5 ft', '1,000 ft'], 'It includes the ground run and the initial climb.'),
    mcq('Which of these increases the take-off distance?', ['A tailwind', 'A headwind', 'A lower weight', 'Cold air'], 'A higher groundspeed is needed to reach flying speed.'),
    mcq('Long wet grass, compared with a hard dry runway, makes the take-off distance:', ['Longer', 'Shorter', 'The same', 'Zero'], 'It adds rolling resistance.'),
    tf('Flight manual performance figures already include a generous safety margin for an average pilot and aircraft.', false, 'They are for a new aircraft flown by a test pilot in ideal conditions.'),
  ],
  assessment: [
    num('Manual take-off distance 400 m, dry grass factor 1.2, safety factor 1.33. Distance required?', 638.4, 2, 'm', '400 × 1.2 × 1.33 = 638.4 m.'),
    num('Manual landing distance 450 m on a hard dry runway, safety factor 1.43. Distance required?', 643.5, 2, 'm', '450 × 1.43 = 643.5 m.'),
    mcq('Landing distance is measured from:', ['50 ft above the threshold to a full stop', 'Touchdown to a full stop', 'The start of the approach', 'The far end of the runway'], 'It includes the airborne part.'),
    mcq('A high density altitude makes the take-off distance:', ['Longer', 'Shorter', 'Unchanged', 'Irrelevant'], 'Less power, less thrust and a higher true airspeed at lift-off.'),
    mcq('For planning, it is common practice to take credit for:', ['No more than half of a reported headwind', 'The whole of a reported headwind', 'Twice the reported headwind', 'No wind at all'], 'And to allow for one and a half times a tailwind.'),
    mcq('If the factored distance required exceeds the distance available, the pilot should:', ['Not depart, or change the conditions', 'Depart and use maximum power', 'Depart and lift off early', 'Ignore the calculation'], 'Reduce weight or wait for better conditions.'),
    tf('An uphill slope increases the take-off distance.', true, 'Part of the thrust is used against gravity.'),
  ],
  missionId: 'm-ppl-perf', sources: ['phak'],
});

export const fuelPlanning = lesson('Flight performance and planning', {
  id: 'ppl-fuel-planning', title: 'Fuel Planning', minutes: 11, level: 2, prereqs: ['math-fuel-and-endurance-calculations', 'ppl-introduction-to-flight-planning'],
  objectives: ['List the parts of a fuel plan.', 'State typical regulatory final reserves for VFR flight.', 'Calculate reserve fuel from fuel flow.', 'Convert between litres, US gallons and kilograms.'],
  intro: 'A fuel plan is a promise to yourself about when you will land. The reserve at the end of it is not there to be planned into the flight: it is for the day the plan goes wrong.',
  simple: 'Add up the fuel for taxi, the trip, a margin for the unexpected, a diversion and a final reserve. Check in flight that what is left matches the plan. Land with the final reserve still in the tanks.',
  sections: [
    { h: 'Parts of a fuel plan', body: [
      '**Taxi fuel**: start-up and taxi. **Trip fuel**: take-off, climb, cruise, descent and landing at the destination. **Contingency fuel**: an allowance for the unforeseen, such as stronger winds. **Alternate fuel**: to fly to an alternate if needed. **Final reserve fuel**: the minimum to have left on landing. **Extra fuel**: at the pilot\'s discretion.',
    ] },
    { h: 'Final reserve', body: [
      'Regulations set a minimum. **United States** rules (14 CFR §91.151) require, for aeroplanes under VFR, enough fuel to reach the first point of intended landing and then fly at normal cruising speed for at least **30 minutes by day** or **45 minutes at night**.',
      'European rules for non-commercial flights use comparable figures. Many pilots choose a larger personal minimum.',
      '`reserve fuel = fuel flow × reserve time ÷ 60`. At 32 L/h, 30 minutes is 16 L and 45 minutes is 24 L.',
    ], formula: 'reserve-fuel', lab: 'formula:reserve-fuel' },
    { h: 'Units', body: [
      '`1 US gallon = 3.785 litres`. Aviation gasoline has a density of about **0.72 kg per litre**, so 100 L weighs about 72 kg. Fuel is planned by volume but loaded into the mass and balance calculation by mass.',
    ] },
    { h: 'In flight', body: [
      'Check fuel remaining against the plan at regular intervals. If you will land with less than the final reserve, you have a problem that must be declared and acted upon: divert while you still can.',
    ], note: 'The United States figures were read from the regulation text on 12 Nov 2026. Check the fuel rules that apply to your own flight; consumption figures come from the aircraft flight manual.' },
  ],
  examples: [
    { title: 'Reserve fuel', steps: ['Fuel flow is 36 L/h. A 45-minute reserve is required.', '36 × 45 ÷ 60.', 'Reserve fuel = 27 L.'] },
    { title: 'Fuel mass', steps: ['The tanks hold 120 L of aviation gasoline.', '120 × 0.72.', 'The fuel weighs about 86.4 kg.'] },
  ],
  practice: [
    num('Fuel flow is 36 L/h. How much fuel is a 45-minute reserve?', 27, 0.1, 'L', '36 × 45 ÷ 60 = 27 L.'),
    num('How many kilograms do 120 L of aviation gasoline weigh, at 0.72 kg per litre?', 86.4, 0.2, 'kg', '120 × 0.72 = 86.4 kg.'),
    mcq('Contingency fuel is carried for:', ['Unforeseen factors such as stronger winds', 'The taxi to the runway', 'The planned trip', 'Cleaning the windscreen'], 'It is a margin on the trip.'),
    mcq('Final reserve fuel is:', ['The minimum fuel to have remaining on landing', 'Fuel for the climb', 'Fuel for taxi', 'Fuel you plan to use in cruise'], 'It is not part of the planned flight.'),
    tf('The final reserve may be planned as part of the trip fuel.', false, 'It must still be in the tanks when you land.'),
  ],
  assessment: [
    num('Fuel flow is 32 L/h. How much fuel is a 30-minute reserve?', 16, 0.1, 'L', '32 × 30 ÷ 60 = 16 L.'),
    num('Fuel flow is 32 L/h. How much fuel is a 45-minute reserve?', 24, 0.1, 'L', '32 × 45 ÷ 60 = 24 L.'),
    num('Under United States rules (14 CFR §91.151), how many minutes of reserve are required for an aeroplane under VFR by day?', 30, 0.1, 'min', '30 minutes by day, 45 at night.'),
    num('How many litres are 20 US gallons (1 US gallon = 3.785 L)?', 75.7, 0.2, 'L', '20 × 3.785 = 75.7 L.'),
    num('How many kilograms do 100 L of aviation gasoline weigh, at 0.72 kg per litre?', 72, 0.2, 'kg', '100 × 0.72 = 72 kg.'),
    mcq('Trip fuel covers:', ['Take-off, climb, cruise, descent and landing at the destination', 'Start-up and taxi only', 'The diversion only', 'The final reserve'], 'The planned flight itself.'),
    tf('Fuel remaining should be checked against the plan during the flight.', true, 'A shortfall found early can be dealt with by diverting.'),
  ],
  missionId: 'm-ppl-fuelplan', sources: ['cfr-91', 'phak'],
});

export const vfrPlanning = lesson('Flight performance and planning', {
  id: 'ppl-vfr-flight-planning', title: 'VFR Flight Planning', minutes: 12, level: 2, prereqs: ['ppl-fuel-planning', 'ppl-basic-navigation'],
  objectives: ['Choose a route and a safe altitude.', 'Select a cruising level by direction of flight.', 'Complete the main columns of a navigation log.', 'Explain the purpose of filing and closing a flight plan.'],
  intro: 'A planned cross-country is a chain of small, checkable promises: at this time I will be over this town, at this height, with this much fuel. When reality stops matching the plan, you know at once.',
  simple: 'Draw the route, avoiding airspace and high ground you should not enter. Pick a height that clears everything with room to spare. Work out heading and time for each leg. Tell someone your plan, and tell them when you have arrived.',
  sections: [
    { h: 'Route and safe altitude', body: [
      'Choose a route with good visual features, clear of airspace you may not enter, and with suitable diversion aerodromes.',
      'For each leg find the highest terrain or obstacle near the track and add a margin. A common planning practice is at least **1,000 ft** above the highest obstacle near the route: `safe altitude = highest obstacle + 1,000 ft`, rounded up.',
    ], formula: 'safe-alt', lab: 'formula:safe-alt' },
    { h: 'Cruising level', body: [
      'Above 3,000 ft, VFR cruising levels are chosen by magnetic track so that opposite-direction traffic is separated. In both the European rules of the air and United States rules: on tracks from **000° to 179°**, **odd thousands plus 500 ft** (3,500, 5,500, 7,500); on tracks from **180° to 359°**, **even thousands plus 500 ft** (4,500, 6,500, 8,500).',
    ] },
    { h: 'The navigation log', body: [
      'For each leg record: true track and distance from the chart; wind; **heading** after correcting for wind, variation and deviation; **groundspeed**; **time**; and **fuel**. Add the minimum safe altitude and the planned level.',
      'Mark the chart with the track, with time or distance marks, so progress can be checked.',
    ] },
    { h: 'Flight plans', body: [
      'A filed **flight plan** tells air traffic services where you are going and when you should arrive, so that search and rescue can begin if you do not. It is required for some flights, such as crossing international borders, and recommended for others.',
      'A flight plan must be **closed** on arrival. An unclosed plan can start a search for an aircraft that is safely on the ground.',
    ], note: 'Minimum heights are set by the rules of the air and are a legal floor, not a planning altitude. The 1,000 ft margin is a common planning practice for visual flight, not a regulation. Cruising levels were checked against Regulation (EU) No 923/2012 Appendix 3 and 14 CFR §91.159.' },
  ],
  examples: [
    { title: 'Cruising level', steps: ['Magnetic track is 250°, and you want to cruise above 3,000 ft.', '250° is between 180° and 359°.', 'Choose an even thousand plus 500: 4,500 ft or 6,500 ft.'] },
    { title: 'Safe altitude', steps: ['The highest obstacle near the leg is a mast at 1,840 ft.', '1,840 + 1,000 = 2,840 ft.', 'Round up: plan not below 2,900 ft.'] },
  ],
  practice: [
    num('The highest obstacle near a leg is 1,840 ft. Safe altitude with a 1,000 ft margin, rounded up to the next 100 ft?', 2900, 1, 'ft', '1,840 + 1,000 = 2,840, rounded up to 2,900 ft.'),
    mcq('On a magnetic track of 250° above 3,000 ft, a suitable VFR cruising level is:', ['4,500 ft', '3,500 ft', '5,500 ft', '5,000 ft'], 'Even thousands plus 500 on tracks 180° to 359°.'),
    mcq('A navigation log records for each leg:', ['Heading, groundspeed, time and fuel', 'The colour of the aircraft', 'The passengers\' ages', 'The engine serial number'], 'These are checked against actual progress.'),
    mcq('A filed flight plan helps to ensure that:', ['Search and rescue starts if you do not arrive', 'You get a discount on fuel', 'The weather improves', 'You need no radio'], 'Someone knows your route and arrival time.'),
    tf('A flight plan closes itself automatically when you land.', false, 'The pilot must make sure it is closed.'),
  ],
  assessment: [
    num('The highest obstacle near a leg is 2,350 ft. Safe altitude with a 1,000 ft margin, rounded up to the next 100 ft?', 3400, 1, 'ft', '2,350 + 1,000 = 3,350, rounded up to 3,400 ft.'),
    mcq('On a magnetic track of 090° above 3,000 ft, a suitable VFR cruising level is:', ['5,500 ft', '4,500 ft', '6,500 ft', '6,000 ft'], 'Odd thousands plus 500 on tracks 000° to 179°.'),
    mcq('On a magnetic track of 310° above 3,000 ft, a suitable VFR cruising level is:', ['6,500 ft', '5,500 ft', '7,500 ft', '7,000 ft'], 'Even thousands plus 500 on tracks 180° to 359°.'),
    mcq('The purpose of VFR cruising levels chosen by direction is to:', ['Separate aircraft flying in opposite directions', 'Save fuel', 'Improve radio reception', 'Avoid cloud'], 'Opposite-direction traffic is at different levels.'),
    mcq('The heading for a leg is found by correcting the true track for:', ['Wind, variation and deviation', 'Temperature only', 'Fuel weight', 'Runway length'], 'Wind gives true heading; variation and deviation give compass heading.'),
    mcq('Failing to close a flight plan may result in:', ['An unnecessary search and rescue operation', 'A lower fuel bill', 'Nothing at all', 'A faster flight next time'], 'Always close it on arrival.'),
    tf('A good VFR route considers visual features, airspace and diversion aerodromes.', true, 'Not simply the straight line.'),
  ],
  missionId: 'm-ppl-vfrplan', sources: ['sera', 'cfr-91', 'phak'],
});
