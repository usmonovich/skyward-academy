// ATPL — Mass and Balance 031 (2), Performance 032 (3), Flight Planning and Monitoring 033 (3).
// Written from memory of standard references; not verified against current regulations.
import { lesson, mcq, num, tf } from './q';

export const loadingCg = lesson('Mass and balance', {
  id: 'atpl-loading-and-cg-for-transport-aircraft', title: 'Loading and CG for Transport Aircraft', minutes: 13, level: 3, prereqs: ['cpl-mass-and-balance-for-larger-aircraft'],
  objectives: ['Express the centre of gravity as a percentage of the mean aerodynamic chord.', 'Calculate the mass to move between holds to correct the centre of gravity.', 'Describe the effect of centre-of-gravity position on performance.', 'Describe how fuel burn moves the centre of gravity.'],
  intro: 'Prerequisite review: the mass chain runs from dry operating mass through zero fuel mass and take-off mass to landing mass, and the centre of gravity is given as a percentage of the mean aerodynamic chord. On a transport aircraft the position within the limits is also a matter of fuel economy.',
  simple: 'A big aircraft must be balanced as well as within its weight limits. If it is nose-heavy or tail-heavy, cargo is moved between the front and rear holds. A balance point further back saves fuel, but only up to the aft limit.',
  sections: [
    { h: 'CG position', body: [
      '`CG % MAC = (CG − leading edge of MAC) ÷ MAC × 100`. With the CG at 18.9 m, the leading edge of the MAC at 18.0 m and a MAC of 3.6 m, the CG is at 25% MAC.',
      'The centre of gravity must stay within its forward and aft limits at take-off, throughout the flight and at landing.',
    ] },
    { h: 'Correcting the CG', body: [
      'Moving a mass m through a distance d moves the centre of gravity by m × d ÷ M. Rearranged: `mass to move = M × ΔCG ÷ d`.',
      'To move the CG of a 60,000 kg aircraft by 0.1 m using holds 20 m apart, 300 kg must be moved.',
    ], formula: 'cargo-shift', lab: 'formula:cargo-shift' },
    { h: 'CG and performance', body: [
      'With a **forward** CG the tailplane must produce more down-force. The wing then has to lift more, so **drag and fuel burn increase** and the **stall speed is higher**.',
      'With an **aft** CG there is less trim drag and fuel burn is lower, but stability and control forces are reduced. Operators aim for a CG towards the aft part of the allowed range.',
    ] },
    { h: 'Fuel and CG in flight', body: [
      'As fuel is burned, the CG moves, in a direction that depends on where the tanks are relative to it. On swept-wing aircraft the outer wing tanks lie aft, so tank usage order affects balance. The load sheet shows the CG for zero fuel, take-off and landing.',
    ], note: 'Limits and loading procedures are in the aircraft\'s weight and balance manual and the operator\'s procedures.' },
  ],
  examples: [
    { title: 'Mass to move', steps: ['Aircraft mass 50,000 kg; the CG must move 0.05 m aft; holds are 10 m apart.', '50,000 × 0.05 ÷ 10.', 'Move 250 kg from the forward hold to the aft hold.'] },
    { title: 'CG as % MAC', steps: ['CG at 21.0 m, leading edge of MAC at 20.0 m, MAC 4.0 m.', '(21.0 − 20.0) ÷ 4.0 = 0.25.', 'CG is at 25% MAC.'] },
  ],
  practice: [
    num('Aircraft mass 50,000 kg; CG must move 0.05 m; holds are 10 m apart. Mass to move?', 250, 1, 'kg', '50,000 × 0.05 ÷ 10 = 250 kg.'),
    num('CG at 21.0 m, leading edge of MAC at 20.0 m, MAC 4.0 m. CG in % MAC?', 25, 0.1, '%', '1.0 ÷ 4.0 = 25%.'),
    mcq('A forward centre of gravity results in:', ['Higher fuel burn', 'Lower fuel burn', 'Lower stall speed', 'Less tail down-force'], 'More tail down-force means the wing must lift more.'),
    mcq('To move the CG aft, cargo is moved:', ['From the forward hold to the aft hold', 'From the aft hold to the forward hold', 'Out of the aircraft only', 'Into the cabin'], 'Mass moved aft moves the CG aft.'),
    tf('The centre of gravity needs to be within limits only at take-off.', false, 'It must be within limits throughout the flight and at landing.'),
  ],
  assessment: [
    num('Aircraft mass 60,000 kg; CG must move 0.1 m; holds are 20 m apart. Mass to move?', 300, 1, 'kg', '60,000 × 0.1 ÷ 20 = 300 kg.'),
    num('Aircraft mass 40,000 kg; CG must move 0.06 m; holds are 12 m apart. Mass to move?', 200, 1, 'kg', '40,000 × 0.06 ÷ 12 = 200 kg.'),
    num('CG at 18.9 m, leading edge of MAC at 18.0 m, MAC 3.6 m. CG in % MAC?', 25, 0.1, '%', '0.9 ÷ 3.6 = 25%.'),
    mcq('An aft centre of gravity, within limits, gives:', ['Lower trim drag and lower fuel burn', 'Higher trim drag', 'A higher stall speed', 'Greater longitudinal stability'], 'Less tail down-force is needed.'),
    mcq('A forward centre of gravity makes the stall speed:', ['Higher', 'Lower', 'Unchanged', 'Zero'], 'The wing must carry the extra tail down-force.'),
    mcq('The load sheet shows the centre of gravity for:', ['Zero fuel, take-off and landing', 'Take-off only', 'Landing only', 'The empty aircraft only'], 'All must be within limits.'),
    tf('Burning fuel can move the centre of gravity during flight.', true, 'It depends on tank position relative to the CG.'),
  ],
  missionId: 'm-atpl-loading', sources: ['faa-wb'],
});

export const loadSheets = lesson('Mass and balance', {
  id: 'atpl-load-and-trim-sheets', title: 'Load and Trim Sheets', minutes: 13, level: 3, prereqs: ['atpl-loading-and-cg-for-transport-aircraft'],
  objectives: ['Find the allowed take-off mass from the three structural limits.', 'Calculate the underload.', 'Describe the index system and the trim sheet.', 'Describe last-minute changes and the commander\'s acceptance.'],
  intro: 'Prerequisite review: each of the take-off, landing and zero-fuel masses has a maximum, and the centre of gravity can be shifted by moving load. The load and trim sheet brings all of it onto a single page that must be right before the doors close.',
  simple: 'Three weight limits apply at once, and the tightest one decides how heavy the aircraft may be at take-off. The spare capacity left is the underload. A chart then shows whether the balance point is inside the permitted area.',
  sections: [
    { h: 'Three limits at once', body: [
      'The take-off mass must not exceed: **maximum zero fuel mass + take-off fuel**; the **maximum take-off mass** (regulated for the day); and **maximum landing mass + trip fuel**.',
      '`allowed take-off mass = the lowest of the three`.',
      'With MZFM 55,000 kg, take-off fuel 12,000 kg, MTOM 70,000 kg, MLM 60,000 kg and trip fuel 9,000 kg: the three values are 67,000, 70,000 and 69,000, so the allowed take-off mass is 67,000 kg.',
    ], formula: 'allowed-tom', lab: 'formula:allowed-tom' },
    { h: 'Underload', body: [
      'The **underload** is the allowed take-off mass minus the actual take-off mass: the extra traffic load that could still be accepted. If the actual take-off mass is 65,500 kg, the underload is 1,500 kg.',
    ] },
    { h: 'Index and trim sheet', body: [
      'Moments on a large aircraft are huge numbers, so they are divided by a constant to give an **index**. Each load adds or subtracts index units.',
      'On the **trim sheet**, the final index is plotted against mass. The point must lie inside the envelope for zero fuel, take-off and landing. The sheet also gives the **stabiliser trim setting** for take-off.',
    ] },
    { h: 'Last-minute changes and acceptance', body: [
      'Small **last-minute changes** in passengers or bags may be entered on the load sheet within limits set by the operator; larger changes need a new load sheet.',
      'The load sheet is signed by the person who prepared it, and the commander accepts it.',
    ], note: 'Forms and limits differ between operators. Many now use electronic load sheets; the logic is the same.' },
  ],
  examples: [
    { title: 'Allowed take-off mass', steps: ['MZFM 50,000 + take-off fuel 15,000 = 65,000 kg.', 'MTOM = 64,000 kg. MLM 56,000 + trip fuel 10,000 = 66,000 kg.', 'The lowest is 64,000 kg: MTOM is limiting.'] },
    { title: 'Underload', steps: ['Allowed take-off mass 64,000 kg; actual 62,800 kg.', '64,000 − 62,800.', 'Underload = 1,200 kg.'] },
  ],
  practice: [
    num('MZFM 50,000 kg, take-off fuel 15,000 kg, MTOM 64,000 kg, MLM 56,000 kg, trip fuel 10,000 kg. Allowed take-off mass?', 64000, 1, 'kg', 'The lowest of 65,000, 64,000 and 66,000.'),
    num('Allowed take-off mass 64,000 kg; actual take-off mass 62,800 kg. Underload?', 1200, 1, 'kg', '64,000 − 62,800 = 1,200 kg.'),
    mcq('An index is used on load sheets in order to:', ['Work with small numbers instead of very large moments', 'Hide the mass from the passengers', 'Replace the centre of gravity', 'Calculate fuel price'], 'Moment divided by a constant.'),
    mcq('The trim sheet also provides:', ['The stabiliser trim setting for take-off', 'The weather forecast', 'The cruising level', 'The fuel price'], 'It depends on the centre of gravity.'),
    tf('Any change in load after the load sheet is completed requires a new load sheet, however small.', false, 'Small last-minute changes may be entered within the operator\'s limits.'),
  ],
  assessment: [
    num('MZFM 55,000 kg, take-off fuel 12,000 kg, MTOM 70,000 kg, MLM 60,000 kg, trip fuel 9,000 kg. Allowed take-off mass?', 67000, 1, 'kg', 'The lowest of 67,000, 70,000 and 69,000.'),
    num('MZFM 48,000 kg, take-off fuel 14,000 kg, MTOM 65,000 kg, MLM 52,000 kg, trip fuel 8,000 kg. Allowed take-off mass?', 60000, 1, 'kg', 'The lowest of 62,000, 65,000 and 60,000.'),
    num('Allowed take-off mass 67,000 kg; actual take-off mass 65,500 kg. Underload?', 1500, 1, 'kg', '67,000 − 65,500 = 1,500 kg.'),
    mcq('The underload is:', ['The extra traffic load that could still be accepted', 'The fuel remaining at landing', 'The mass of the crew', 'The excess over the limit'], 'Allowed minus actual take-off mass.'),
    mcq('On the trim sheet, the plotted point must lie inside the envelope for:', ['Zero fuel, take-off and landing conditions', 'Take-off only', 'The empty aircraft', 'Cruise only'], 'The CG must be within limits throughout.'),
    mcq('The landing-mass limit on take-off mass is found as:', ['Maximum landing mass plus trip fuel', 'Maximum landing mass minus trip fuel', 'Maximum landing mass plus reserve fuel', 'Maximum landing mass alone'], 'The trip fuel will be burned before landing.'),
    tf('The commander accepts the load sheet before departure.', true, 'The commander is responsible for the loading being within limits.'),
  ],
  missionId: 'm-atpl-loadsheet', sources: ['faa-wb'],
});

export const classA = lesson('Performance', {
  id: 'atpl-performance-class-a-take-off', title: 'Performance Class A Take-off', minutes: 14, level: 3, prereqs: ['cpl-take-off-performance'],
  objectives: ['State what Performance Class A covers.', 'Describe the take-off flight path segments.', 'Convert a gross gradient to a net gradient.', 'Explain reduced-thrust take-off.'],
  intro: 'Prerequisite review: V1 is the decision speed, V2 the take-off safety speed, and the take-off must be safe whether it is rejected or continued. Performance Class A, which covers jet airliners, extends that guarantee along the whole departure path with an engine failed.',
  simple: 'An airliner must be able to lose an engine at the worst moment and still either stop on the runway or climb away clear of every obstacle. The climb-out is divided into stages, each with a minimum steepness, and a safety margin is subtracted from what the aircraft can actually do.',
  sections: [
    { h: 'Class A', body: [
      '**Performance Class A** covers multi-engine turbojet aeroplanes and larger turboprops. Its rules assume an engine failure at the most critical point of every take-off.',
    ] },
    { h: 'The take-off flight path', body: [
      'After the screen height of **35 ft**, the path is divided into segments, each flown with one engine inoperative:',
      '**First segment**: from 35 ft until the landing gear is retracted. **Second segment**: gear up, take-off flap, at V2, to at least 400 ft; this has the steepest required gradient, **2.4% gross** for a twin. **Third segment**: level acceleration and flap retraction. **Final segment**: climb in the clean configuration at maximum continuous thrust, **1.2% gross** for a twin.',
    ] },
    { h: 'Gross and net', body: [
      'The **gross** gradient is what the aircraft is expected to achieve. The **net** gradient is the gross gradient reduced by a safety margin: **0.8%** for twin-engine aircraft. `net = gross − 0.8`.',
      'The net flight path must clear all obstacles in the departure area by at least **35 ft**.',
    ], formula: 'net-gradient', lab: 'formula:net-gradient' },
    { h: 'Reduced thrust', body: [
      'When the aircraft is lighter than the limiting mass for the runway, take-off may be made with **reduced thrust**, commonly by telling the engine control an assumed (flexible) temperature higher than the actual one. It reduces engine wear and cost. It is not permitted in some conditions, such as on contaminated runways.',
    ], note: 'Gradients and margins are quoted from memory of the European certification and operating rules for twin-engine aircraft. Aircraft with three or four engines have different figures. Use the current regulations and the aircraft flight manual.' },
  ],
  examples: [
    { title: 'Net gradient', steps: ['The gross second-segment gradient is 3.0% for a twin.', '3.0 − 0.8.', 'Net gradient = 2.2%.'] },
    { title: 'Which segment?', steps: ['Gear is up, flaps at take-off setting, speed V2, one engine inoperative.', 'The aircraft is climbing to at least 400 ft.', 'This is the second segment.'] },
  ],
  practice: [
    num('Gross gradient 3.0% for a twin. Net gradient (gross − 0.8)?', 2.2, 0.02, '%', '3.0 − 0.8 = 2.2%.'),
    mcq('Performance Class A applies to:', ['Multi-engine turbojets and larger turboprops', 'Single-engine piston aircraft', 'Gliders', 'Balloons'], 'It assumes an engine failure on every take-off.'),
    mcq('The first segment of the take-off flight path ends when:', ['The landing gear is retracted', 'The flaps are retracted', 'The aircraft reaches cruise', 'V1 is reached'], 'It starts at 35 ft.'),
    mcq('Reduced-thrust take-off is used mainly to:', ['Reduce engine wear', 'Shorten the take-off run', 'Increase noise', 'Burn more fuel'], 'When the full thrust is not needed for the mass and runway.'),
    tf('The net flight path is better than the gross flight path.', false, 'It is the gross path reduced by a safety margin.'),
  ],
  assessment: [
    num('Gross gradient 3.2% for a twin. Net gradient (gross − 0.8)?', 2.4, 0.02, '%', '3.2 − 0.8 = 2.4%.'),
    num('What is the minimum gross second-segment climb gradient, in percent, for a twin-engine Class A aeroplane?', 2.4, 0.02, '%', '2.4% gross for a twin.'),
    num('By how many feet must the net take-off flight path clear obstacles?', 35, 0.5, 'ft', 'At least 35 ft.'),
    mcq('The second segment is flown with:', ['Gear up, take-off flap, at V2, one engine inoperative', 'Gear down, flaps up', 'All engines at idle', 'Gear up, flaps up, at cruise speed'], 'It has the most demanding gradient.'),
    mcq('During the third segment the aircraft:', ['Accelerates level and retracts the flaps', 'Climbs at V2 with the gear down', 'Descends', 'Holds over the airfield'], 'To reach the clean configuration.'),
    mcq('A reduced-thrust take-off is commonly achieved by:', ['Entering an assumed temperature higher than the actual temperature', 'Shutting down one engine', 'Lowering the tyre pressure', 'Using a shorter runway'], 'The engine control then gives less thrust.'),
    tf('Class A rules assume that an engine may fail at the most critical point of the take-off.', true, 'Every take-off is planned on that basis.'),
  ],
  missionId: 'm-atpl-classa', sources: ['phak'],
});

export const vSpeeds = lesson('Performance', {
  id: 'atpl-v-speeds-and-balanced-field-length', title: 'V-Speeds and Balanced Field Length', minutes: 14, level: 3, prereqs: ['atpl-performance-class-a-take-off', 'cpl-asymmetric-thrust'],
  objectives: ['Define the take-off reference speeds.', 'State the relationships between them.', 'Calculate the minimum V2.', 'Explain how V1 affects the stop and go distances.'],
  intro: 'Prerequisite review: minimum control speed is the lowest speed at which an aircraft with a failed engine can be kept straight, and V1 divides stopping from going. On a Class A aircraft a whole family of speeds brackets the take-off, and each one limits the others.',
  simple: 'Several speeds are worked out before every take-off. Each has a reason: enough rudder to stay straight, enough brake to stop, enough margin above the stall to climb. The decision speed is chosen so that stopping and going both fit on the runway.',
  sections: [
    { h: 'The speeds', body: [
      '**V_MCG**: minimum control speed on the ground, using rudder alone. **V_MCA**: minimum control speed in the air. **V1**: decision speed. **V_R**: rotation speed. **V_MU**: minimum unstick speed. **V_LOF**: lift-off speed. **V2**: take-off safety speed. **V_MBE**: maximum brake energy speed.',
    ] },
    { h: 'Relationships', body: [
      'V1 must be **at least V_MCG** (so the aircraft can be kept straight if it continues) and **no more than V_R** and **V_MBE** (so that it can still stop).',
      'V_R must be at least 1.05 × V_MCA. V2 must be at least **1.13 × V_SR** (the reference stall speed) and at least **1.10 × V_MCA**: `V2 min = the higher of the two`.',
    ], formula: 'v2min', lab: 'formula:v2min' },
    { h: 'V1 and field length', body: [
      'A **higher V1** means more runway is used before the decision: the **accelerate-stop distance increases**, and the **one-engine-inoperative take-off distance decreases**.',
      'The V1 at which the two distances are equal gives the **balanced field length**, the shortest runway usable at that mass.',
      'On a **wet** runway stopping is poorer, so V1 is reduced.',
    ] },
    { h: 'Calling the speeds', body: [
      'The speeds are computed for the actual mass, flap setting, runway and conditions, set on the airspeed indicator and called by the pilot monitoring. "V1" is called so that it is complete as the speed is reached: at that moment the hands come off the thrust levers.',
    ], note: 'Factors are quoted from memory of the European large-aeroplane certification rules. Use the aircraft flight manual figures.' },
  ],
  examples: [
    { title: 'Minimum V2', steps: ['V_SR is 120 kt and V_MCA is 110 kt.', '1.13 × 120 = 135.6 kt; 1.10 × 110 = 121 kt.', 'Minimum V2 is 135.6 kt.'] },
    { title: 'Raising V1', steps: ['V1 is increased by 5 kt at the same mass.', 'The stop begins later; the continued take-off begins with more speed.', 'Stop distance increases; go distance decreases.'] },
  ],
  practice: [
    num('V_SR is 110 kt and V_MCA is 100 kt. Minimum V2 (higher of 1.13 × V_SR and 1.10 × V_MCA)?', 124.3, 0.3, 'kt', '124.3 kt against 110 kt.'),
    mcq('V_MCG is the minimum control speed:', ['On the ground', 'In the air', 'In the cruise', 'With flaps up only'], 'Using rudder alone.'),
    mcq('V1 must not be less than:', ['V_MCG', 'V2', 'V_R', 'V_LOF'], 'Or directional control could not be kept after an engine failure.'),
    mcq('V_MBE is the:', ['Maximum brake energy speed', 'Minimum bank entry speed', 'Maximum bird encounter speed', 'Minimum buffet entry speed'], 'Above it the brakes could not absorb the energy of a stop.'),
    tf('On a wet runway, V1 is normally increased.', false, 'It is reduced, because stopping performance is poorer.'),
  ],
  assessment: [
    num('V_SR is 120 kt and V_MCA is 110 kt. Minimum V2 (higher of 1.13 × V_SR and 1.10 × V_MCA)?', 135.6, 0.3, 'kt', '135.6 kt against 121 kt.'),
    num('V_SR is 100 kt and V_MCA is 105 kt. Minimum V2 (higher of 1.13 × V_SR and 1.10 × V_MCA)?', 115.5, 0.3, 'kt', '113 kt against 115.5 kt.'),
    num('V_MCA is 110 kt. Minimum V_R at 1.05 × V_MCA?', 115.5, 0.3, 'kt', '1.05 × 110 = 115.5 kt.'),
    mcq('Increasing V1 at the same mass makes the accelerate-stop distance:', ['Longer', 'Shorter', 'Unchanged', 'Zero'], 'The stop starts from a higher speed, further down the runway.'),
    mcq('Increasing V1 at the same mass makes the one-engine-inoperative take-off distance:', ['Shorter', 'Longer', 'Unchanged', 'Infinite'], 'Less of the acceleration is done on one engine.'),
    mcq('The balanced field length is obtained when:', ['The accelerate-stop distance equals the take-off distance', 'V1 equals V2', 'The runway is level', 'Both engines fail'], 'For an engine failure recognised at V1.'),
    mcq('V1 must not exceed:', ['V_R and V_MBE', 'V_MCG', 'V_MU', 'The stall speed'], 'So that a stop is still possible.'),
  ],
  missionId: 'm-atpl-vspeeds', sources: ['phak'],
});

export const enrouteLanding = lesson('Performance', {
  id: 'atpl-en-route-and-landing-performance', title: 'En-route and Landing Performance', minutes: 13, level: 3, prereqs: ['atpl-v-speeds-and-balanced-field-length', 'cpl-landing-performance'],
  objectives: ['Explain drift-down.', 'State the en-route obstacle clearance margins.', 'Calculate the landing distance available required from the demonstrated distance.', 'Describe the approach and landing climb requirements.'],
  intro: 'Prerequisite review: ceilings fall as weight rises, and commercial landings must fit within a fraction of the runway. If an engine fails in the cruise, a jet is suddenly far above the altitude it can hold on the remaining thrust, and the descent that follows has to be planned over the highest ground on the route.',
  simple: 'With one engine out, a jet cannot stay at cruising height and sinks slowly to a lower level it can hold. The route must be planned so that this descent stays clear of mountains. At the other end, the aircraft must be able to land in well under the full length of the runway.',
  sections: [
    { h: 'Drift-down', body: [
      'After an engine failure in cruise, the crew sets maximum continuous thrust on the remaining engine and lets the speed fall to the **drift-down speed**. The aircraft descends gradually to its one-engine-inoperative ceiling.',
      'The **net** en-route flight path must clear all terrain by at least **1,000 ft** when level or climbing, and by **2,000 ft** during the drift-down.',
      'Over high terrain, escape routes are planned in advance. Fuel jettison, where fitted, raises the ceiling.',
    ] },
    { h: 'Landing distance', body: [
      'For dispatch, a turbojet must be able to land within **60%** of the landing distance available (70% for a turboprop). On a **wet** runway the required distance is increased by **15%**.',
      '`LDA required = landing distance ÷ 0.6`, and × 1.15 if wet. A demonstrated landing distance of 1,200 m needs 2,000 m of runway dry, and 2,300 m wet.',
    ], formula: 'lda-required', lab: 'formula:lda-required' },
    { h: 'Climb limits', body: [
      'Landing mass may also be limited by the ability to go around. The **approach climb** requirement is with one engine inoperative in the approach configuration (2.1% for a twin). The **landing climb** requirement is with all engines in the landing configuration (3.2%).',
    ] },
    { h: 'In flight', body: [
      'Before the approach, crews make an in-flight landing distance assessment using the actual runway condition, wind, mass and aircraft state, with a margin.',
    ], note: 'Margins and gradients are quoted from memory of European operating and certification rules for twin-engine aircraft and were not checked against the current text.' },
  ],
  examples: [
    { title: 'Runway required', steps: ['Demonstrated landing distance 900 m, dry runway, turbojet.', '900 ÷ 0.6.', 'LDA required = 1,500 m.'] },
    { title: 'Wet runway', steps: ['The same aircraft on a wet runway.', '1,500 × 1.15.', 'LDA required = 1,725 m.'] },
  ],
  practice: [
    num('Demonstrated landing distance 900 m, dry runway, turbojet. LDA required (distance ÷ 0.6)?', 1500, 2, 'm', '900 ÷ 0.6 = 1,500 m.'),
    num('Dry LDA required is 1,500 m. LDA required on a wet runway (× 1.15)?', 1725, 2, 'm', '1,500 × 1.15 = 1,725 m.'),
    mcq('Drift-down is:', ['A gradual descent to the one-engine-inoperative ceiling', 'A rapid emergency descent', 'A descent for landing', 'A climb to a higher level'], 'It follows an engine failure in cruise.'),
    mcq('The approach climb requirement is demonstrated with:', ['One engine inoperative', 'All engines operating', 'No engines operating', 'Reverse thrust'], 'In the approach configuration.'),
    tf('A wet runway reduces the landing distance required.', false, 'It increases it, by 15% for dispatch purposes.'),
  ],
  assessment: [
    num('Demonstrated landing distance 1,200 m, dry runway, turbojet. LDA required (distance ÷ 0.6)?', 2000, 2, 'm', '1,200 ÷ 0.6 = 2,000 m.'),
    num('Demonstrated landing distance 1,200 m, wet runway, turbojet. LDA required (distance ÷ 0.6 × 1.15)?', 2300, 2, 'm', '2,000 × 1.15 = 2,300 m.'),
    num('By how many feet must the net flight path clear terrain during drift-down?', 2000, 5, 'ft', '2,000 ft in the drift-down; 1,000 ft when level.'),
    mcq('During drift-down the remaining engine is set to:', ['Maximum continuous thrust', 'Idle', 'Reverse', 'Take-off thrust for the rest of the flight'], 'And the speed is allowed to fall to the drift-down speed.'),
    mcq('For dispatch, a turbojet must be able to land within what fraction of the landing distance available?', ['60%', '100%', '90%', '30%'], '70% for a turboprop.'),
    mcq('The landing climb requirement is demonstrated with:', ['All engines operating, in the landing configuration', 'One engine inoperative, gear up', 'Flaps retracted', 'Engines at idle'], 'It covers a go-around from the landing configuration.'),
    tf('Over high terrain, escape routes for an engine failure are planned before the flight.', true, 'There is no time to work them out afterwards.'),
  ],
  missionId: 'm-atpl-driftdown', sources: ['phak'],
});

export const jetFuel = lesson('Flight planning', {
  id: 'atpl-jet-fuel-planning', title: 'Jet Fuel Planning', minutes: 13, level: 3, prereqs: ['cpl-commercial-fuel-planning', 'atpl-flight-management-systems'],
  objectives: ['Convert ground distance to air distance.', 'Describe long-range cruise and step climbs.', 'Calculate trip fuel from fuel flow and time.', 'Explain fuel tankering.'],
  intro: 'Prerequisite review: block fuel is taxi, trip, contingency, alternate and final reserve, and specific range is distance per kilogram. For a jet the trip fuel itself depends heavily on wind, altitude and weight, and the weight depends on the fuel.',
  simple: 'A jet burns less fuel per mile when it is high and light. Wind changes how many miles of air it must fly through to cover the ground distance. Carrying extra fuel costs fuel, because the extra weight has to be lifted.',
  sections: [
    { h: 'Air and ground distance', body: [
      'Fuel is burned over the distance flown through the air. `air distance = ground distance × TAS ÷ groundspeed`. For 2,000 NM on the ground at a TAS of 460 kt and a groundspeed of 400 kt, the air distance is 2,300 NM.',
      'A headwind increases the air distance; a tailwind reduces it.',
    ], formula: 'air-distance', lab: 'formula:air-distance' },
    { h: 'Cruise', body: [
      'Fuel flow depends on mass, level, temperature and speed. **Long-range cruise** is a speed slightly faster than the maximum range speed, giving 99% of the maximum range for a useful gain in speed.',
      'As fuel burns off, the optimum altitude rises. A **step climb** to a higher level keeps the aircraft near its optimum.',
      '`trip fuel ≈ average fuel flow × time`. At 2,500 kg/h for 4 hours, 10,000 kg.',
    ] },
    { h: 'The cost of carrying fuel', body: [
      'Extra fuel is extra weight, and part of it is burned simply to carry the rest. On long flights this may be several percent per hour of flight.',
      '**Tankering** is deliberately carrying extra fuel from a place where it is cheap or available, when the saving outweighs the cost of carrying it.',
    ] },
    { h: 'Checking the plan', body: [
      'A computer flight plan is checked for the correct route, levels, winds, masses and alternates before it is accepted, and fuel is cross-checked against it at each waypoint in flight.',
    ], note: 'Figures here are illustrative. Fuel flows come from the aircraft\'s performance data and the operator\'s flight planning system.' },
  ],
  examples: [
    { title: 'Air distance', steps: ['Ground distance 1,800 NM, TAS 450 kt, groundspeed 500 kt.', '1,800 × 450 ÷ 500.', 'Air distance = 1,620 NM.'] },
    { title: 'Trip fuel', steps: ['Average fuel flow 2,400 kg/h, flight time 5 h.', '2,400 × 5.', 'Trip fuel ≈ 12,000 kg.'] },
  ],
  practice: [
    num('Ground distance 1,800 NM, TAS 450 kt, groundspeed 500 kt. Air distance?', 1620, 2, 'NM', '1,800 × 450 ÷ 500 = 1,620 NM.'),
    num('Average fuel flow 2,400 kg/h for 5 hours. Trip fuel?', 12000, 10, 'kg', '2,400 × 5 = 12,000 kg.'),
    mcq('A step climb is made because:', ['The optimum altitude rises as fuel is burned', 'The passengers request it', 'The engines need cooling', 'The cabin altitude is too low'], 'A lighter aircraft is more efficient higher up.'),
    mcq('Tankering is:', ['Deliberately carrying extra fuel when it is economically worthwhile', 'Dumping fuel before landing', 'Refuelling in flight', 'Using the centre tank first'], 'For example where fuel at the destination is expensive.'),
    tf('A tailwind increases the air distance to be flown.', false, 'It reduces it.'),
  ],
  assessment: [
    num('Ground distance 2,000 NM, TAS 460 kt, groundspeed 400 kt. Air distance?', 2300, 2, 'NM', '2,000 × 460 ÷ 400 = 2,300 NM.'),
    num('Ground distance 1,500 NM, TAS 480 kt, groundspeed 600 kt. Air distance?', 1200, 2, 'NM', '1,500 × 480 ÷ 600 = 1,200 NM.'),
    num('Average fuel flow 2,500 kg/h for 4 hours. Trip fuel?', 10000, 10, 'kg', '2,500 × 4 = 10,000 kg.'),
    mcq('Long-range cruise is a speed that gives:', ['99% of maximum range at a higher speed', 'Maximum endurance', 'Minimum time', 'Maximum fuel flow'], 'A small range penalty for a useful speed gain.'),
    mcq('Carrying extra fuel on a long flight:', ['Increases the trip fuel burned', 'Reduces the trip fuel burned', 'Has no effect on fuel burn', 'Reduces the take-off mass'], 'Some of the extra is burned carrying the rest.'),
    mcq('A headwind makes the air distance:', ['Greater than the ground distance', 'Less than the ground distance', 'Equal to the ground distance', 'Zero'], 'More air must be flown through to cover the same ground.'),
    tf('A computer flight plan should be checked by the crew before it is accepted.', true, 'Route, levels, winds, masses and alternates.'),
  ],
  missionId: 'm-atpl-jetfuel', sources: ['phak'],
});

export const ifrPlans = lesson('Flight planning', {
  id: 'atpl-ifr-flight-plans', title: 'IFR Flight Plans', minutes: 12, level: 3, prereqs: ['ppl-vfr-flight-planning'],
  objectives: ['Identify the main items of the ICAO flight plan form.', 'Decode flight rules and wake turbulence letters.', 'Decode speed and level entries.', 'State when a flight plan is filed and when a delay must be notified.'],
  intro: 'Prerequisite review: a filed flight plan tells air traffic services where you are going and when, and must be closed on arrival. For instrument flights it is also the request for a route and level through controlled airspace, written in a compact international code.',
  simple: 'The flight plan is a standard form used all over the world. Each box has a number and a set of codes: who you are, what you are flying, where from, how fast, how high, by which route, where to, and how much fuel you have.',
  sections: [
    { h: 'The form', body: [
      'The main items are: **7** aircraft identification; **8** flight rules and type of flight; **9** number and type of aircraft and wake turbulence category; **10** equipment; **13** departure aerodrome and time; **15** cruising speed, level and route; **16** destination, total elapsed time and alternates; **18** other information; **19** supplementary information, including endurance and persons on board.',
    ], lab: 'explore:flight-plan' },
    { h: 'Codes', body: [
      '**Flight rules**: **I** for IFR, **V** for VFR, **Y** for IFR first then VFR, **Z** for VFR first then IFR.',
      '**Wake turbulence category**: **L** light, **M** medium, **H** heavy, **J** super.',
      '**Speed**: N followed by four digits is knots (N0450 is 450 kt); M followed by three digits is Mach (M082 is Mach 0.82). **Level**: F is a flight level (F350); A is an altitude in hundreds of feet (A050 is 5,000 ft).',
    ] },
    { h: 'Timing', body: [
      'A flight plan for a flight to be given air traffic control service is submitted at least **60 minutes** before departure. If departure is delayed by more than **30 minutes** beyond the estimated off-block time, the plan must be amended or a new one filed.',
    ] },
    { h: 'After filing', body: [
      'The clearance received may differ from the route filed. The crew flies the clearance, and checks that the route loaded in the flight management system matches it.',
    ], note: 'Item numbers and codes follow the ICAO flight plan form as recalled from ICAO Doc 4444. Timing rules differ in some regions, especially where flow management applies.' },
  ],
  examples: [
    { title: 'Decoding item 15', steps: ['The entry begins N0460F370.', 'N0460: true airspeed 460 kt.', 'F370: flight level 370.'] },
    { title: 'Delayed departure', steps: ['Estimated off-block time was 1000; the aircraft will not leave before 1045.', 'The delay is more than 30 minutes.', 'The flight plan must be amended.'] },
  ],
  practice: [
    mcq('In the flight rules box, the letter I means:', ['IFR', 'International', 'Instructional', 'Intermediate'], 'V is VFR.'),
    mcq('The speed entry M082 means:', ['Mach 0.82', '82 knots', '820 km/h', '82 miles per hour'], 'M followed by three digits.'),
    mcq('The level entry F350 means:', ['Flight level 350', '350 feet', '3,500 metres', '35 minutes'], 'F is a flight level.'),
    mcq('The wake turbulence letter H means:', ['Heavy', 'High', 'Helicopter', 'Holding'], 'L light, M medium, H heavy, J super.'),
    tf('The clearance received from air traffic control is always identical to the route filed.', false, 'It may differ: fly the clearance.'),
  ],
  assessment: [
    num('At least how many minutes before departure should a flight plan for a controlled flight be submitted?', 60, 0.5, 'min', 'At least 60 minutes.'),
    num('A delay of more than how many minutes beyond the estimated off-block time requires the flight plan to be amended?', 30, 0.5, 'min', 'More than 30 minutes.'),
    mcq('In the flight rules box, the letter Y means:', ['IFR first, then VFR', 'VFR first, then IFR', 'IFR throughout', 'VFR throughout'], 'Z is VFR first, then IFR.'),
    mcq('The speed entry N0450 means:', ['450 knots', 'Mach 0.45', '45 knots', '4,500 km/h'], 'N followed by four digits is knots.'),
    mcq('The level entry A050 means:', ['An altitude of 5,000 ft', 'Flight level 50', '50 ft', '500 ft'], 'A is altitude in hundreds of feet.'),
    mcq('Endurance and persons on board are given in:', ['Item 19, supplementary information', 'Item 7', 'Item 9', 'Item 13'], 'Used if search and rescue is needed.'),
    mcq('Item 16 of the flight plan contains:', ['Destination, total elapsed time and alternates', 'Aircraft identification', 'Equipment', 'Departure time'], 'Item 13 has the departure aerodrome and time.'),
  ],
  missionId: 'm-atpl-fpl', sources: ['icao-4444'],
});

export const petPsr = lesson('Flight planning', {
  id: 'atpl-point-of-equal-time-and-point-of-safe-return', title: 'Point of Equal Time and Point of Safe Return', minutes: 13, level: 3, prereqs: ['cpl-flight-planning-and-monitoring'],
  objectives: ['Calculate the point of equal time on a long sector.', 'Calculate the point of safe return.', 'Explain why engine-out and depressurised cases have their own points.', 'State how wind moves each point.'],
  intro: 'Prerequisite review: the point of equal time is D × H ÷ (O + H) from departure, and the point of safe return is reached after E × H ÷ (O + H) hours. On oceanic and remote sectors these points are computed for several failure cases and marked on the flight plan.',
  simple: 'Far from any airport, the crew must know in advance which way to go if something fails. The answer depends on the wind, and on what has failed, because a damaged aircraft flies lower and slower.',
  sections: [
    { h: 'Point of equal time', body: [
      '`distance to PET = D × H ÷ (O + H)`, with O the groundspeed onward and H the groundspeed home. For 1,200 NM with 420 kt on and 480 kt back: 1,200 × 480 ÷ 900 = 640 NM.',
      'The point moves **into the wind**. A tailwind outbound moves it back towards the departure point; a headwind outbound moves it on towards the destination.',
    ], formula: 'pet', lab: 'formula:pet' },
    { h: 'Different cases', body: [
      'The speeds used depend on the failure. With **one engine inoperative** the aircraft flies lower and slower; after a **depressurisation** it flies at about 10,000 ft, where the wind may be quite different. Each case has its own point of equal time.',
      'The points may be calculated between two en-route alternates as well as between departure and destination.',
    ] },
    { h: 'Point of safe return', body: [
      '`time to PSR = E × H ÷ (O + H)`, where E is the safe endurance. With 8 hours of safe endurance, 500 kt out and 300 kt home: 8 × 300 ÷ 800 = 3 hours; distance = 3 × 500 = 1,500 NM.',
      'Any wind component, head or tail, brings the point of safe return closer than in still air.',
    ] },
    { h: 'Using them', body: [
      'The points are marked on the flight plan and the chart. Before reaching one, the crew confirms the weather at the airports behind and ahead, so that the decision is ready before it is needed.',
    ], note: 'These are the simple single-leg formulas. Flight planning systems compute the points along the actual route with forecast winds at each level.' },
  ],
  examples: [
    { title: 'PET', steps: ['Distance 2,000 NM, groundspeed on 400 kt, home 500 kt.', '2,000 × 500 ÷ 900.', 'PET ≈ 1,111 NM from departure.'] },
    { title: 'PSR', steps: ['Safe endurance 6 h, groundspeed out 450 kt, home 450 kt (still air).', 'Time = 6 × 450 ÷ 900 = 3 h.', 'Distance = 3 × 450 = 1,350 NM.'] },
  ],
  practice: [
    num('Distance 2,000 NM, groundspeed on 400 kt, home 500 kt. Distance to the PET?', 1111, 2, 'NM', '2,000 × 500 ÷ 900 ≈ 1,111 NM.'),
    num('Safe endurance 6 h, groundspeed out 450 kt, home 450 kt. Time to the PSR in hours?', 3, 0.02, 'h', '6 × 450 ÷ 900 = 3 h.'),
    mcq('With a tailwind outbound, the point of equal time lies:', ['Before the midpoint, nearer the departure point', 'Beyond the midpoint', 'Exactly at the midpoint', 'At the destination'], 'It moves into the wind.'),
    mcq('After a depressurisation, the point of equal time is calculated using:', ['Speeds and winds at about 10,000 ft', 'Cruise speeds and winds at cruise level', 'Take-off speeds', 'Still-air values only'], 'The aircraft must descend to where the air is breathable.'),
    tf('The point of equal time is the same for all failure cases.', false, 'Each case uses different speeds, levels and winds.'),
  ],
  assessment: [
    num('Distance 1,200 NM, groundspeed on 420 kt, home 480 kt. Distance to the PET?', 640, 2, 'NM', '1,200 × 480 ÷ 900 = 640 NM.'),
    num('Distance 1,800 NM, groundspeed on 450 kt, home 450 kt. Distance to the PET?', 900, 2, 'NM', 'In still air it is the midpoint: 900 NM.'),
    num('Safe endurance 8 h, groundspeed out 500 kt, home 300 kt. Time to the PSR in hours?', 3, 0.02, 'h', '8 × 300 ÷ 800 = 3 h.'),
    num('Time to the PSR is 3 h at a groundspeed out of 500 kt. Distance to the PSR?', 1500, 2, 'NM', '3 × 500 = 1,500 NM.'),
    mcq('With a headwind outbound, the point of equal time lies:', ['Beyond the midpoint, nearer the destination', 'Before the midpoint', 'Exactly at the midpoint', 'At the departure point'], 'It moves into the wind.'),
    mcq('Compared with still air, any wind makes the distance to the point of safe return:', ['Shorter', 'Longer', 'Unchanged', 'Infinite'], 'Time lost against the wind is never fully regained with it.'),
    mcq('Before reaching a point of equal time, the crew should:', ['Confirm the weather at the airports behind and ahead', 'Switch off the weather radar', 'Descend to 10,000 ft', 'Shut down one engine'], 'So the decision is ready if needed.'),
  ],
  missionId: 'm-atpl-pet', sources: ['phak'],
});
