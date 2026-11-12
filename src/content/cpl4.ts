// CPL — Flight and Fuel Planning (3 lessons) and Advanced Meteorology (4 lessons).
// Each lesson opens with a short prerequisite review, as stated in the track note.
import { lesson, mcq, num, tf } from './q';

export const commercialFuel = lesson('Flight planning', {
  id: 'cpl-commercial-fuel-planning', title: 'Commercial Fuel Planning', minutes: 13, level: 3, prereqs: ['ppl-fuel-planning'],
  objectives: ['List the components of a commercial fuel plan.', 'Calculate a block fuel figure.', 'Explain the purpose of contingency fuel.', 'State when minimum fuel and a fuel emergency are declared.'],
  intro: 'Prerequisite review: a fuel plan adds taxi, trip, contingency, alternate and final reserve fuel, and the final reserve must still be in the tanks on landing. Commercial operations formalise each part in the operator\'s fuel policy and add a strict language for when fuel becomes a problem.',
  simple: 'A commercial flight carries fuel for each stage plus set allowances. The total loaded before start is the block fuel. If it looks as though you will land with less than the final reserve, you must say so in specific words.',
  sections: [
    { h: 'Components', body: [
      '**Taxi fuel**; **trip fuel**; **contingency fuel**, commonly 5% of trip fuel, for deviations from the plan; **alternate fuel**, for a missed approach and flight to the alternate; **final reserve fuel**, a fixed time of holding; **additional fuel**, if the type of operation needs it; and **extra or discretionary fuel** at the commander\'s decision.',
      '`block fuel = taxi + trip + contingency + alternate + final reserve` (plus any additional and extra fuel).',
      'With 100 kg taxi, 2,000 kg trip, 5% contingency, 400 kg alternate and 300 kg final reserve, block fuel is 2,900 kg.',
    ], formula: 'block-fuel', lab: 'formula:block-fuel' },
    { h: 'Typical policy figures', body: [
      'European commercial air transport rules have traditionally used contingency of 5% of trip fuel (or 5 minutes of holding if greater) and a final reserve of 30 minutes of holding at 1,500 ft for turbine aeroplanes, or 45 minutes for piston aeroplanes. Operators may now use approved fuel schemes with different values.',
    ] },
    { h: 'In flight', body: [
      'Fuel is checked at regular intervals against the plan, and the expected fuel on landing is recalculated.',
      '**"MINIMUM FUEL"** is declared when the crew is committed to land at a specific aerodrome and any change to the existing clearance may result in landing with less than the final reserve. It is information, not an emergency.',
      '**"MAYDAY, MAYDAY, MAYDAY, FUEL"** is declared when the fuel predicted on landing at the nearest suitable aerodrome is less than the final reserve.',
    ], note: 'The policy figures are quoted from memory of European rules as they stood before the 2022 fuel-scheme changes and were not checked against the current regulation. The fuel policy in your operator\'s manual is the one that applies.' },
  ],
  examples: [
    { title: 'Block fuel', steps: ['Taxi 50 kg, trip 800 kg, alternate 200 kg, final reserve 150 kg.', 'Contingency = 5% of 800 = 40 kg.', 'Block fuel = 50 + 800 + 40 + 200 + 150 = 1,240 kg.'] },
    { title: 'Which call?', steps: ['Holding is extended and you now expect to land with exactly the final reserve, provided nothing else changes.', 'Any further delay would take you below it.', 'Declare "MINIMUM FUEL".'] },
  ],
  practice: [
    num('Taxi 50 kg, trip 800 kg, 5% contingency, alternate 200 kg, final reserve 150 kg. Block fuel?', 1240, 1, 'kg', '50 + 800 + 40 + 200 + 150 = 1,240 kg.'),
    num('Trip fuel is 1,200 kg. Contingency fuel at 5%?', 60, 0.5, 'kg', '5% of 1,200 = 60 kg.'),
    mcq('Contingency fuel is carried to cover:', ['Deviations from the planned flight', 'The taxi to the runway', 'The flight to the alternate', 'Ballast'], 'Such as stronger winds or a different routing.'),
    mcq('Alternate fuel covers:', ['A missed approach and the flight to the alternate', 'Holding at the destination only', 'The return flight', 'Engine start'], 'It assumes the destination cannot be used.'),
    tf('"MINIMUM FUEL" is an emergency call.', false, 'It informs air traffic control; an emergency is "MAYDAY FUEL".'),
  ],
  assessment: [
    num('Taxi 100 kg, trip 2,000 kg, 5% contingency, alternate 400 kg, final reserve 300 kg. Block fuel?', 2900, 1, 'kg', '100 + 2,000 + 100 + 400 + 300 = 2,900 kg.'),
    num('Trip fuel is 3,000 kg. Contingency fuel at 5%?', 150, 0.5, 'kg', '5% of 3,000 = 150 kg.'),
    mcq('Block fuel is:', ['The total fuel on board before engine start', 'The fuel used in the trip', 'The final reserve', 'The fuel remaining at landing'], 'It includes taxi fuel.'),
    mcq('"MAYDAY, MAYDAY, MAYDAY, FUEL" is declared when:', ['The fuel predicted on landing is less than the final reserve', 'Contingency fuel has been used', 'The flight is five minutes late', 'Extra fuel was not loaded'], 'It is a distress situation.'),
    mcq('Extra (discretionary) fuel is loaded:', ['At the commander\'s decision', 'By law on every flight', 'Only for training flights', 'Never'], 'For example for expected holding or weather.'),
    mcq('Final reserve fuel is planned to be:', ['Still in the tanks on landing', 'Used during the cruise', 'Used during taxi', 'Burned in the climb'], 'It is the last protection.'),
    tf('Fuel remaining should be compared with the plan at regular intervals during the flight.', true, 'So that a shortfall is found while options remain.'),
  ],
  missionId: 'm-cpl-fuel', sources: ['phak'],
});

export const planningMonitoring = lesson('Flight planning', {
  id: 'cpl-flight-planning-and-monitoring', title: 'Flight Planning and Monitoring', minutes: 14, level: 3, prereqs: ['ppl-vfr-flight-planning', 'cpl-commercial-fuel-planning'],
  objectives: ['Describe the operational flight plan.', 'Calculate the point of equal time.', 'Calculate the point of safe return.', 'Explain how wind moves these points.'],
  intro: 'Prerequisite review: a navigation log lists heading, groundspeed, time and fuel for each leg, and progress is checked against it. On longer commercial legs two further questions are planned in advance: from where is it quicker to go on than to go back, and how far can we go and still get home?',
  simple: 'Somewhere along a route, it takes the same time to continue as to turn back. With no wind it is the midpoint; wind pushes it towards the headwind end. A second point marks the furthest you can go and still return with reserves.',
  sections: [
    { h: 'The operational flight plan', body: [
      'The **operational flight plan** lists, for every leg, the track, distance, wind, groundspeed, time and fuel, with minimum fuel at each waypoint. In flight the actual time and fuel are written beside the planned values.',
    ] },
    { h: 'Point of equal time', body: [
      'The **point of equal time** (PET), or critical point, is where the time to continue to the destination equals the time to return. `distance to PET = D × H ÷ (O + H)`, where D is the total distance, O the groundspeed out (onward) and H the groundspeed home.',
      'For 600 NM with 180 kt out and 220 kt home: 600 × 220 ÷ 400 = 330 NM.',
      'In still air the PET is the midpoint. With wind it moves **into the wind**: towards the destination when there is a headwind outbound.',
    ], formula: 'pet', lab: 'formula:pet' },
    { h: 'Point of safe return', body: [
      'The **point of safe return** (PSR), or point of no return, is the furthest point from which the aircraft can return to the departure aerodrome with reserves intact. `time to PSR = E × H ÷ (O + H)`, where E is the safe endurance; the distance is that time multiplied by O.',
      'With 5 hours of safe endurance, 180 kt out and 120 kt home: time = 5 × 120 ÷ 300 = 2 hours; distance = 360 NM.',
      'Any wind, from any direction, reduces the distance to the PSR compared with still air.',
    ] },
    { h: 'Using them', body: [
      'After an engine failure, a medical emergency or a pressurisation failure, the PET tells the crew at once whether to continue or turn back. The PSR matters when the destination has no alternate.',
    ], note: 'These formulas assume constant groundspeeds out and home. After an engine failure the speeds change, and operators calculate separate one-engine-inoperative points.' },
  ],
  examples: [
    { title: 'PET', steps: ['Distance 800 NM, groundspeed out 200 kt, home 300 kt.', '800 × 300 ÷ 500.', 'PET is 480 NM from departure.'] },
    { title: 'PSR', steps: ['Safe endurance 4 h, groundspeed out 150 kt, home 250 kt.', 'Time = 4 × 250 ÷ 400 = 2.5 h.', 'Distance = 2.5 × 150 = 375 NM.'] },
  ],
  practice: [
    num('Distance 800 NM, groundspeed out 200 kt, home 300 kt. Distance to the point of equal time?', 480, 1, 'NM', '800 × 300 ÷ 500 = 480 NM.'),
    num('Safe endurance 4 h, groundspeed out 150 kt, home 250 kt. Time to the point of safe return in hours?', 2.5, 0.02, 'h', '4 × 250 ÷ 400 = 2.5 h.'),
    mcq('In still air, the point of equal time is:', ['At the midpoint of the route', 'At the departure aerodrome', 'At the destination', 'One third of the way'], 'Groundspeeds out and home are equal.'),
    mcq('With a headwind outbound, the point of equal time moves:', ['Towards the destination', 'Towards the departure aerodrome', 'Nowhere', 'Off the route'], 'It moves into the wind.'),
    tf('A tailwind outbound increases the distance to the point of safe return compared with still air.', false, 'Any wind reduces it.'),
  ],
  assessment: [
    num('Distance 600 NM, groundspeed out 180 kt, home 220 kt. Distance to the point of equal time?', 330, 1, 'NM', '600 × 220 ÷ 400 = 330 NM.'),
    num('Distance 400 NM, groundspeed out 150 kt, home 250 kt. Distance to the point of equal time?', 250, 1, 'NM', '400 × 250 ÷ 400 = 250 NM.'),
    num('Safe endurance 5 h, groundspeed out 180 kt, home 120 kt. Time to the point of safe return in hours?', 2, 0.02, 'h', '5 × 120 ÷ 300 = 2 h.'),
    num('Time to the point of safe return is 2 h at a groundspeed out of 180 kt. Distance to it?', 360, 1, 'NM', '2 × 180 = 360 NM.'),
    mcq('The point of equal time is where:', ['Time to continue equals time to return', 'Half the fuel has been used', 'The aircraft reaches top of climb', 'Radio contact is lost'], 'Also called the critical point.'),
    mcq('The point of safe return is most important when:', ['The destination has no alternate', 'The flight is very short', 'There is no wind', 'The aircraft is empty'], 'Beyond it, a return with reserves is not possible.'),
    mcq('On the operational flight plan, the crew records in flight:', ['Actual time and fuel at each waypoint', 'The passengers\' meal choices', 'Engine serial numbers', 'Only the departure time'], 'They are compared with the planned values.'),
  ],
  missionId: 'm-cpl-pet', sources: ['phak'],
});

export const massBalanceLarge = lesson('Flight planning', {
  id: 'cpl-mass-and-balance-for-larger-aircraft', title: 'Mass and Balance for Larger Aircraft', minutes: 13, level: 3, prereqs: ['ppl-mb', 'cpl-performance-limitations'],
  objectives: ['Follow the chain from operating mass to landing mass.', 'Express the centre of gravity as a percentage of the mean aerodynamic chord.', 'Calculate floor loading.', 'Describe the load sheet and last-minute changes.'],
  intro: 'Prerequisite review: the centre of gravity is total moment divided by total mass, and it must lie between forward and aft limits; mass must not exceed the take-off, landing or zero-fuel limits. Larger aircraft carry the same calculation on a formal load sheet, in a slightly different language.',
  simple: 'Start with the aircraft ready to fly, add the passengers and cargo, then the fuel, and check each total against its limit. On larger aircraft the balance point is given as a percentage along the wing chord. The cabin floor can only carry so much weight on each square metre.',
  sections: [
    { h: 'The mass chain', body: [
      '**Dry operating mass** (DOM): the aircraft with crew, catering and equipment, but no traffic load or usable fuel.',
      'DOM + **traffic load** = **zero fuel mass**. Zero fuel mass + **take-off fuel** = **take-off mass**. Take-off mass − **trip fuel** = **landing mass**.',
      'Each total is checked against its maximum.',
    ] },
    { h: 'CG as % MAC', body: [
      'On larger aircraft the centre of gravity is expressed as a percentage of the **mean aerodynamic chord** (MAC): `CG % MAC = (CG position − leading edge of MAC) ÷ MAC length × 100`.',
      'With the CG at 12.6 m, the leading edge of the MAC at 12.0 m and a MAC of 3.0 m, the CG is at 20% MAC.',
    ], formula: 'cg-mac', lab: 'formula:cg-mac' },
    { h: 'Floor and compartment limits', body: [
      'Each cargo compartment has a maximum load, and the floor has a maximum **floor loading** in kg per square metre: `floor loading = mass ÷ contact area`. A 600 kg load on 1.5 m² exerts 400 kg/m².',
      'Heavy items are spread with boards to reduce the loading, and all cargo is restrained.',
    ] },
    { h: 'The load sheet', body: [
      'The **load sheet** records the masses and the centre of gravity for take-off and landing and is signed by the person responsible for loading and accepted by the commander.',
      'Passengers may be accounted for with **standard masses**. Small **last-minute changes** are permitted within limits stated in the operations manual; beyond them a new load sheet is required.',
    ], note: 'Terms and procedures are those commonly used in European operations. Operators define their own forms and limits in the operations manual.' },
  ],
  examples: [
    { title: 'Mass chain', steps: ['DOM 4,200 kg, traffic load 1,200 kg, take-off fuel 900 kg, trip fuel 600 kg.', 'Zero fuel mass = 5,400 kg; take-off mass = 6,300 kg.', 'Landing mass = 6,300 − 600 = 5,700 kg.'] },
    { title: 'CG as % MAC', steps: ['CG at 15.75 m, leading edge of MAC at 15.0 m, MAC 2.5 m.', '(15.75 − 15.0) ÷ 2.5 = 0.3.', 'CG is at 30% MAC.'] },
  ],
  practice: [
    num('Zero fuel mass 5,400 kg, take-off fuel 900 kg. Take-off mass?', 6300, 1, 'kg', '5,400 + 900 = 6,300 kg.'),
    num('CG at 15.75 m, leading edge of MAC at 15.0 m, MAC 2.5 m. CG in % MAC?', 30, 0.1, '%', '0.75 ÷ 2.5 = 30%.'),
    num('A 600 kg load rests on 1.5 m² of floor. Floor loading in kg/m²?', 400, 1, 'kg/m²', '600 ÷ 1.5 = 400 kg/m².'),
    mcq('Dry operating mass includes:', ['Crew, catering and equipment', 'Passengers and baggage', 'Usable fuel', 'Cargo'], 'It excludes traffic load and usable fuel.'),
    tf('Zero fuel mass includes the take-off fuel.', false, 'It is the mass without usable fuel.'),
  ],
  assessment: [
    num('CG at 12.6 m, leading edge of MAC at 12.0 m, MAC 3.0 m. CG in % MAC?', 20, 0.1, '%', '0.6 ÷ 3.0 = 20%.'),
    num('Take-off mass 6,300 kg, trip fuel 600 kg. Landing mass?', 5700, 1, 'kg', '6,300 − 600 = 5,700 kg.'),
    num('Dry operating mass 4,200 kg, traffic load 1,200 kg. Zero fuel mass?', 5400, 1, 'kg', '4,200 + 1,200 = 5,400 kg.'),
    num('A 900 kg load rests on 2 m² of floor. Floor loading in kg/m²?', 450, 1, 'kg/m²', '900 ÷ 2 = 450 kg/m².'),
    mcq('Traffic load consists of:', ['Passengers, baggage and cargo', 'Crew and catering', 'Usable fuel', 'The empty aircraft'], 'What the flight is carrying for payment.'),
    mcq('To reduce floor loading under a heavy item, the load is:', ['Spread over a larger area', 'Placed on a smaller area', 'Moved aft', 'Left unrestrained'], 'Loading is mass divided by contact area.'),
    mcq('The load sheet is accepted by:', ['The commander', 'The passengers', 'Air traffic control', 'The fuel supplier'], 'The commander is responsible for the loading being within limits.'),
  ],
  missionId: 'm-cpl-mb', sources: ['faa-wb', 'phak'],
});

export const jetStreams = lesson('Meteorology', {
  id: 'cpl-upper-winds-and-jet-streams', title: 'Upper Winds and Jet Streams', minutes: 12, level: 3, prereqs: ['ppl-wind-and-turbulence', 'ppl-fronts-and-air-masses'],
  objectives: ['Explain why wind generally increases with height.', 'Define a jet stream and locate the main ones.', 'State where clear-air turbulence is most likely.', 'Relate drift to changing true altitude.'],
  intro: 'Prerequisite review: wind blows along the isobars with low pressure on the left in the northern hemisphere, and fronts separate warm and cold air masses. Higher up, the temperature contrast across a front produces narrow rivers of very fast air that decide flight times and the smoothness of the ride.',
  simple: 'Where warm and cold air lie side by side, the wind gets stronger with height. Near the top of the weather layer it can form a narrow band of very fast wind called a jet stream. The air just beside it, especially on the cold side, is often rough even with no cloud.',
  sections: [
    { h: 'Wind with height', body: [
      'Away from surface friction the wind blows parallel to the contours of the pressure pattern. A horizontal temperature difference makes the pressure pattern change with height, so the wind changes too: this change is the **thermal wind**. In mid-latitudes, with cold air towards the pole, westerly winds strengthen with height up to the tropopause.',
    ] },
    { h: 'Jet streams', body: [
      'A **jet stream** is a narrow band of strong wind near the tropopause, with a speed of at least **60 kt**. Cores commonly exceed 100 kt.',
      'The **polar front jet** lies above the polar front, typically around FL300, and moves north and south with the fronts. The **subtropical jet** lies near 30° latitude, typically around FL400.',
    ], lab: 'explore:jetstreams' },
    { h: 'Clear-air turbulence', body: [
      '**Clear-air turbulence** (CAT) comes from strong wind shear. Near a jet it is most likely on the **cold (polar) side** of the core and above and below it, where the wind speed changes most rapidly.',
      'If CAT is met, slow to the turbulence penetration speed and change level or track away from the core.',
    ] },
    { h: 'Drift and pressure', body: [
      'In the northern hemisphere, drifting to the **right** means the wind is from the left, so low pressure lies ahead: the aircraft is flying towards lower pressure, and at a constant indicated altitude its **true altitude is decreasing**.',
    ], note: 'Typical heights and speeds vary with season and location. The significant weather and upper wind charts for the flight show the actual positions.' },
  ],
  examples: [
    { title: 'Finding smoother air', steps: ['Cruising near a westerly jet core in the northern hemisphere, with moderate CAT.', 'CAT is strongest on the cold, poleward side.', 'A track or level change away from that side is likely to help.'] },
    { title: 'Drift and altitude', steps: ['In the northern hemisphere you have 10° of right drift.', 'The wind is from the left: low pressure is ahead.', 'True altitude is decreasing at constant indicated altitude.'] },
  ],
  practice: [
    num('What is the minimum wind speed, in knots, for a band of wind to be called a jet stream?', 60, 0.5, 'kt', 'At least 60 kt.'),
    mcq('Jet streams are found:', ['Near the tropopause', 'At the surface', 'Only over the equator', 'In the stratosphere above 60,000 ft'], 'Where the temperature contrast below is concentrated.'),
    mcq('Clear-air turbulence is caused mainly by:', ['Wind shear', 'Rain', 'Low cloud', 'Fog'], 'Rapid change of wind speed or direction.'),
    mcq('The polar front jet stream is typically found around:', ['FL300', 'FL50', 'FL100', 'FL600'], 'Above the polar front.'),
    tf('Clear-air turbulence can always be seen as cloud.', false, 'It occurs in clear air, with no visual warning.'),
  ],
  assessment: [
    mcq('A jet stream is:', ['A narrow band of strong wind near the tropopause', 'A surface wind in a thunderstorm', 'The exhaust of a jet engine', 'A sea breeze'], 'With a speed of at least 60 kt.'),
    mcq('Near a jet stream, clear-air turbulence is most likely:', ['On the cold (polar) side of the core', 'Far on the warm side', 'At the surface', 'Exactly in the centre of the core only'], 'Where the wind shear is strongest.'),
    mcq('The subtropical jet stream is typically found around:', ['FL400', 'FL100', 'FL200', 'The surface'], 'Near 30° latitude.'),
    mcq('The change of wind with height caused by a horizontal temperature difference is the:', ['Thermal wind', 'Sea breeze', 'Katabatic wind', 'Gust front'], 'It explains strengthening westerlies with height.'),
    mcq('In the northern hemisphere, with right drift at a constant indicated altitude, true altitude is:', ['Decreasing', 'Increasing', 'Unchanged', 'Unknowable'], 'The aircraft is flying towards lower pressure.'),
    mcq('On encountering clear-air turbulence, the crew should first:', ['Slow to the turbulence penetration speed', 'Accelerate to maximum speed', 'Extend the flaps', 'Switch off the seat-belt sign'], 'Then consider a level or track change.'),
    tf('The polar front jet stream moves north and south with the fronts.', true, 'Its position varies daily and seasonally.'),
  ],
  missionId: 'm-cpl-jet', sources: ['faa-wx', 'phak'],
});

export const icingDepth = lesson('Meteorology', {
  id: 'cpl-icing-in-depth', title: 'Icing in Depth', minutes: 13, level: 3, prereqs: ['ppl-clouds', 'ppl-the-atmosphere-in-depth'],
  objectives: ['State the conditions needed for airframe icing.', 'Describe freezing rain and its hazard.', 'Explain the aerodynamic effects of ice, including tailplane stall.', 'Distinguish de-icing from anti-icing, in flight and on the ground.'],
  intro: 'Prerequisite review: clear, rime and mixed ice form from supercooled water droplets at temperatures below freezing, and even thin frost spoils a wing. Commercial aircraft are often certified for flight in icing, which makes understanding its limits more important, not less.',
  simple: 'Ice forms when an aircraft flies through liquid water that is colder than freezing. It changes the shape of the wing, so the aircraft stalls sooner and at a higher speed. Some systems stop ice forming; others remove it. On the ground, the aircraft must be completely clean before take-off.',
  sections: [
    { h: 'Conditions', body: [
      'Airframe icing needs **visible moisture** (cloud or precipitation) and a surface temperature at or below **0 °C**. Supercooled liquid water can exist down to about **−40 °C**; the most severe icing is usually between about 0 °C and −15 °C, where droplets are large and plentiful.',
      '**Freezing rain** falls from warm air aloft into sub-zero air below, typically ahead of a warm front. The large drops freeze on impact and build clear ice rapidly, including behind the protected areas.',
    ], lab: 'explore:icing' },
    { h: 'Effects', body: [
      'Ice reduces the maximum lift coefficient and the stalling angle of attack, increases drag and adds weight. The stall occurs at a **higher speed** and possibly **before the stall warning**.',
      'Ice on the tailplane can cause a **tailplane stall**, typically when flaps are extended: the nose pitches down sharply. Recovery is the opposite of a wing stall: pull back and reduce flap.',
      'Ice also blocks pitot tubes and static ports, and can form in engine intakes.',
    ] },
    { h: 'Protection in flight', body: [
      '**Anti-icing** prevents ice from forming: heated leading edges, heated propellers and windscreens, fluid systems. It is switched on **before** entering icing conditions.',
      '**De-icing** removes ice after it has formed: for example inflatable rubber boots on the leading edges.',
      'Icing is reported as **trace, light, moderate or severe**. Severe icing is beyond the capability of the protection systems: leave it immediately.',
    ] },
    { h: 'On the ground', body: [
      'An aircraft must not take off with frost, ice or snow adhering to its critical surfaces: the **clean aircraft concept**. De-icing fluid removes contamination; anti-icing fluid protects for a limited **holdover time**, which depends on the fluid, temperature and precipitation.',
    ], note: 'Certification for flight in icing does not cover freezing rain or severe icing. The flight manual states the limits and procedures for each aircraft.' },
  ],
  examples: [
    { title: 'Freezing rain', steps: ['The surface temperature is −2 °C and rain is falling ahead of a warm front.', 'The rain has fallen from warm air into freezing air.', 'Expect rapid clear ice: avoid, or climb into the warm air above if that is possible.'] },
    { title: 'Tailplane stall', steps: ['After flying in icing, landing flap is selected and the nose pitches down with the control column snatching forward.', 'This suggests a tailplane stall.', 'Pull back, reduce the flap setting and do not add speed.'] },
  ],
  practice: [
    mcq('Airframe icing requires:', ['Visible moisture and a temperature at or below freezing', 'Clear dry air', 'Temperatures above +10 °C', 'High airspeed only'], 'Supercooled liquid water must be present.'),
    mcq('Freezing rain typically occurs:', ['Ahead of a warm front, beneath warm air aloft', 'In clear skies', 'Only in thunderstorms', 'Above the tropopause'], 'Rain falls into sub-zero air.'),
    mcq('Anti-icing systems are designed to:', ['Prevent ice from forming', 'Remove ice after it has formed', 'Measure ice thickness', 'Cool the wing'], 'They are switched on before entering icing.'),
    mcq('Ice on the wing makes the stall speed:', ['Higher', 'Lower', 'Unchanged', 'Zero'], 'The wing produces less lift at a given angle of attack.'),
    tf('A thin layer of frost on the wing is acceptable for take-off.', false, 'The clean aircraft concept requires all critical surfaces to be clean.'),
  ],
  assessment: [
    mcq('Supercooled liquid water can exist down to about:', ['−40 °C', '0 °C', '−5 °C', '−100 °C'], 'Below that, cloud is almost entirely ice crystals.'),
    mcq('The most severe airframe icing is usually found between about:', ['0 °C and −15 °C', '−40 °C and −60 °C', '+5 °C and +15 °C', '−30 °C and −40 °C'], 'Droplets are large and plentiful.'),
    mcq('De-icing boots:', ['Remove ice after it has formed', 'Prevent any ice forming', 'Heat the wing continuously', 'Spray fluid'], 'They inflate to crack the ice off.'),
    mcq('A tailplane stall caused by ice is most likely when:', ['Flaps are extended', 'Flaps are retracted in cruise', 'The aircraft is parked', 'The engines are at idle on the ground'], 'Flap extension increases the down-load demanded of the tailplane.'),
    mcq('Recovery from a tailplane stall includes:', ['Pulling back and reducing flap', 'Pushing forward and adding flap', 'Extending more flap', 'Increasing speed with full flap'], 'The opposite of a wing-stall recovery.'),
    mcq('Holdover time is:', ['The time for which anti-icing fluid is expected to protect on the ground', 'The time spent in a holding pattern', 'The time to de-ice in flight', 'The engine warm-up time'], 'It depends on fluid, temperature and precipitation.'),
    tf('Severe icing is within the capability of normal ice protection systems.', false, 'It requires an immediate exit from the conditions.'),
  ],
  missionId: 'm-cpl-icing', sources: ['faa-ac-91-51', 'faa-wx', 'phak'],
});

export const sigwx = lesson('Meteorology', {
  id: 'cpl-significant-weather-charts', title: 'Significant Weather Charts', minutes: 12, level: 3, prereqs: ['ppl-metar', 'cpl-upper-winds-and-jet-streams'],
  objectives: ['Describe what a significant weather chart shows.', 'Decode cloud amount and thunderstorm coverage terms.', 'Read wind speed from wind barbs.', 'Use the chart with other forecasts.'],
  intro: 'Prerequisite review: a METAR reports conditions at one aerodrome, and jet streams and fronts shape the weather along a route. A significant weather chart puts the hazards of a whole region on one page, in a code a pilot must read fluently.',
  simple: 'A significant weather chart is a forecast map for a fixed time. It marks where to expect thunderstorms, turbulence, icing and jet streams, and at what heights. A few standard abbreviations say how much cloud there is and how widespread the storms are.',
  sections: [
    { h: 'What the chart shows', body: [
      'A **significant weather (SIGWX) chart** is a forecast valid at a fixed time, for a band of flight levels. It shows areas of significant cloud, **turbulence**, **icing**, **cumulonimbus**, fronts with their movement, **jet streams** with level and speed, and **tropopause** heights. Heights are given as flight levels.',
    ] },
    { h: 'Amount and coverage', body: [
      'Cloud amount is in **oktas** (eighths of the sky): **FEW** 1 to 2, **SCT** (scattered) 3 to 4, **BKN** (broken) 5 to 7, **OVC** (overcast) 8.',
      'For cumulonimbus: **ISOL**, isolated; **OCNL**, occasional, well separated; **FRQ**, frequent, with little or no separation; **EMBD**, embedded in other cloud and so not visible.',
    ] },
    { h: 'Wind symbols', body: [
      'Wind is drawn with a shaft pointing in the direction the wind blows from, and feathers for speed: a **pennant** (filled triangle) is 50 kt, a **full barb** 10 kt and a **half barb** 5 kt.',
      'One pennant, two barbs and a half barb is 75 kt.',
    ], formula: 'wind-barb', lab: 'formula:wind-barb' },
    { h: 'Using it', body: [
      'Use the chart to find hazards on the route, then the upper wind and temperature charts for planning, and TAFs and METARs for the aerodromes. **SIGMETs** warn of hazards that arise after the chart was issued.',
    ], note: 'Chart symbols follow international standards, but presentation differs between providers. Study the legend of the product your operator uses.' },
  ],
  examples: [
    { title: 'Reading a barb', steps: ['A wind symbol has two pennants and one full barb.', '2 × 50 + 10.', 'The wind speed is 110 kt.'] },
    { title: 'Decoding an area', steps: ['A scalloped area is labelled "OCNL EMBD CB".', 'Occasional cumulonimbus, embedded in other cloud.', 'They cannot be seen and avoided visually: weather radar or a re-route is needed.'] },
  ],
  practice: [
    num('A wind symbol has two pennants and one full barb. Wind speed?', 110, 0.5, 'kt', '2 × 50 + 10 = 110 kt.'),
    mcq('SCT means a cloud amount of:', ['3 to 4 oktas', '1 to 2 oktas', '5 to 7 oktas', '8 oktas'], 'Scattered.'),
    mcq('EMBD CB means cumulonimbus that are:', ['Embedded in other cloud', 'Very small', 'Dissipating', 'Over the sea only'], 'They are hidden from view.'),
    mcq('Heights on a significant weather chart are given as:', ['Flight levels', 'Heights above ground in metres', 'Pressure in hPa only', 'Distances in NM'], 'For example FL250.'),
    tf('A significant weather chart shows the weather observed at the time it was drawn.', false, 'It is a forecast for a fixed valid time.'),
  ],
  assessment: [
    num('A wind symbol has one pennant, two full barbs and one half barb. Wind speed?', 75, 0.5, 'kt', '50 + 20 + 5 = 75 kt.'),
    num('A wind symbol has three full barbs and one half barb. Wind speed?', 35, 0.5, 'kt', '30 + 5 = 35 kt.'),
    mcq('BKN means a cloud amount of:', ['5 to 7 oktas', '1 to 2 oktas', '3 to 4 oktas', '8 oktas'], 'Broken.'),
    mcq('OCNL CB means cumulonimbus that are:', ['Occasional and well separated', 'Frequent with little separation', 'Absent', 'Forecast only at night'], 'Between isolated and frequent.'),
    mcq('FRQ CB means cumulonimbus with:', ['Little or no separation between them', 'Wide gaps between them', 'No turbulence', 'No lightning'], 'Avoidance may need a large deviation.'),
    mcq('A hazard that arises after the chart was issued is notified by:', ['A SIGMET', 'A flight plan', 'A NOTAM for runway works', 'The load sheet'], 'Significant meteorological information.'),
    tf('A pennant on a wind symbol represents 50 kt.', true, 'A full barb is 10 kt and a half barb 5 kt.'),
  ],
  missionId: 'm-cpl-sigwx', sources: ['faa-wx', 'icao-a3'],
});

export const wxDecisions = lesson('Meteorology', {
  id: 'cpl-weather-related-decisions', title: 'Weather-Related Decisions', minutes: 12, level: 3, prereqs: ['cpl-significant-weather-charts', 'ppl-decision-making-and-situational-awareness'],
  objectives: ['Apply threat and error management to weather.', 'State thunderstorm avoidance principles.', 'Describe the response to windshear on approach.', 'Explain how commercial pressure affects weather decisions.'],
  intro: 'Prerequisite review: plan continuation bias grows as the destination nears, and structured decision models guard against it. A commercial pilot makes weather decisions with paying passengers, a schedule and an employer in the background, and must make them the same way regardless.',
  simple: 'Treat bad weather as a threat to be planned for, not a surprise. Go round thunderstorms by a wide margin. If the wind changes sharply close to the ground, go around at once. Decide on the facts, never on the timetable.',
  sections: [
    { h: 'Threat and error management', body: [
      'A **threat** is something outside the crew\'s control that increases risk: weather, terrain, a short runway, time pressure. **Threat and error management** means identifying threats in advance, briefing how each will be handled, and catching errors before they become an **undesired aircraft state**.',
    ], lab: 'explore:wx-decisions' },
    { h: 'Thunderstorms', body: [
      'FAA guidance is to avoid severe thunderstorms by at least **20 miles**, never to fly beneath one, and not to trust a gap between cells unless it is wide. Turbulence, hail and windshear extend well outside the visible cloud.',
      'Deviate upwind where possible, and early: the turn needed grows the closer you get.',
    ] },
    { h: 'Windshear', body: [
      'A **microburst** gives first an increasing headwind, then a downdraught, then a tailwind: airspeed rises, then falls sharply close to the ground.',
      'If windshear is met on approach: apply maximum thrust, pitch up to the recovery attitude and do not change configuration until clear. If windshear is reported or expected, delay the approach.',
    ] },
    { h: 'Pressure', body: [
      'Commercial pressure is real: delay costs money, and passengers expect to arrive. It never changes the weather or the aircraft\'s limits. Operators publish minima and procedures so that the decision is taken out of the moment; a commander who diverts within them is doing the job correctly.',
    ], note: 'Windshear recovery techniques are type-specific and are taught and practised in the simulator. Follow the procedures in your operations manual.' },
  ],
  examples: [
    { title: 'A line of storms', steps: ['Radar shows a line of cells across the route with a 15 NM gap.', 'Each cell should be avoided by 20 miles: the gap is not wide enough.', 'Re-route around the end of the line, or hold or divert.'] },
    { title: 'On final approach', steps: ['Airspeed jumps by 15 kt, then starts to fall rapidly with a high sink rate.', 'This is the signature of a microburst.', 'Go around at once: full thrust, recovery pitch, no configuration change.'] },
  ],
  practice: [
    mcq('In threat and error management, weather is classed as:', ['A threat', 'An error', 'An undesired aircraft state', 'A procedure'], 'It comes from outside the crew.'),
    num('By at least how many miles does FAA guidance say severe thunderstorms should be avoided?', 20, 0.5, '', 'At least 20 miles.'),
    mcq('The first effect of flying into a microburst is usually:', ['An increasing headwind and rising airspeed', 'A tailwind', 'Calm air', 'Clear ice'], 'Followed by a downdraught and then a tailwind.'),
    mcq('If windshear is reported on the approach path, the best decision is to:', ['Delay the approach', 'Fly a faster approach and continue', 'Descend early', 'Ignore it'], 'Microbursts are short-lived.'),
    tf('Commercial pressure is a valid reason to continue an approach below minima.', false, 'Minima are limits, not targets.'),
  ],
  assessment: [
    mcq('Threat and error management aims to:', ['Identify threats in advance and catch errors before they cause an undesired aircraft state', 'Eliminate all weather', 'Remove the need for checklists', 'Increase schedule pressure'], 'Anticipate, brief and monitor.'),
    mcq('A gap between two thunderstorm cells should be used only if:', ['It is wide enough to keep the avoidance distance from each cell', 'It looks clear visually', 'It saves time', 'Another aircraft went through'], 'Hazards extend well beyond the visible cloud.'),
    mcq('The sequence met when flying through a microburst is:', ['Headwind, downdraught, tailwind', 'Tailwind, updraught, headwind', 'Calm, headwind, calm', 'Crosswind only'], 'Airspeed rises, then falls sharply.'),
    mcq('The immediate response to windshear on approach is:', ['Maximum thrust and pitch to the recovery attitude, without changing configuration', 'Retract the flaps and landing gear at once', 'Reduce thrust and descend', 'Continue and land long'], 'Configuration changes can cost lift at the worst moment.'),
    mcq('Thunderstorm avoidance should begin:', ['Early, while a small deviation is enough', 'At the last moment', 'Only after entering cloud', 'After turbulence starts'], 'The deviation needed grows as the storm gets closer.'),
    mcq('A commander who diverts because the destination is below minima is:', ['Acting correctly', 'Failing in the job', 'Breaking the rules', 'Being over-cautious'], 'That is what minima and alternates are for.'),
    tf('Flying beneath a thunderstorm is safe if the ground is visible.', false, 'Severe turbulence, windshear and hail occur beneath the cloud.'),
  ],
  missionId: 'm-cpl-wxdecision', sources: ['faa-aim', 'faa-wx'],
});
