// CPL — Advanced Navigation (4 lessons) and Advanced Aerodynamics (4 lessons).
// Each lesson opens with a short prerequisite review, as stated in the track note.
import { lesson, mcq, num, tf } from './q';

export const oneInSixtyPractice = lesson('Navigation', {
  id: 'cpl-the-1-in-60-rule-in-practice', title: 'The 1-in-60 Rule in Practice', minutes: 13, level: 3, prereqs: ['math-navigation-calculations-and-the-1-in-60-rule', 'cpl-wind'],
  objectives: ['Regain track using the double track error method.', 'Use the standard closing angle.', 'Apply the 1-in-60 rule to VOR radials.', 'Choose an appropriate correction method for the situation.'],
  intro: 'Prerequisite review: at 60 NM, one degree of error is one nautical mile, so angle ≈ 60 × distance off ÷ distance along. A commercial pilot uses this constantly, not only to reach the destination but to get back onto a required track, quickly and without a calculator.',
  simple: 'There are three quick ways to fix a track error. Aim straight for the destination. Double the error to get back on track in the same distance again. Or turn by a fixed angle for your speed and hold it one minute for every mile you are off.',
  sections: [
    { h: 'Three methods', body: [
      '**Track error plus closing angle** takes you directly to the destination or next turning point.',
      '**Double track error** brings you back onto the planned track: turn towards track by twice the track error and hold it for the same distance (or time) you have already flown. Then remove half the correction to stay on track.',
      '2 NM off after 20 NM is a track error of 6°. Turn 12° towards track; after a further 20 NM you are back on track; then turn back 6°.',
    ] },
    { h: 'Standard closing angle', body: [
      'The **standard closing angle** (SCA) is the angle that closes with track at 1 NM per minute: `SCA = 3,600 ÷ TAS` degrees. At 120 kt it is 30°; at 90 kt, 40°.',
      'Turn towards track by the SCA and hold it for **one minute per nautical mile off track**, then resume the planned heading with a drift correction.',
      'It needs no measurement of distance flown, only an estimate of distance off.',
    ], formula: 'sca', lab: 'formula:sca' },
    { h: 'Radials', body: [
      'The same geometry applies to a VOR: `distance off the radial ≈ degrees off × distance from the station ÷ 60`. At 30 NM, 4° off is 2 NM.',
      'Close to the station a large angular error is a small distance; far away, a small angle is a large distance.',
    ] },
    { h: 'Choosing', body: [
      'Use the direct method when the track itself does not matter. Use double track error or SCA when it does: inside a corridor, near controlled airspace, or over high ground where your planned safe altitude applies only near the track.',
    ], note: 'All three are small-angle approximations, good to about 20°. The SCA at low speeds is large, and the approximation becomes rough; cross-check with a fix.' },
  ],
  examples: [
    { title: 'Double track error', steps: ['3 NM right of track after 30 NM.', 'Track error = 60 × 3 ÷ 30 = 6°. Turn 12° left.', 'After another 30 NM you are on track: turn 6° right to hold it.'] },
    { title: 'Standard closing angle', steps: ['TAS 120 kt, 4 NM left of track.', 'SCA = 3,600 ÷ 120 = 30°. Turn 30° right.', 'Hold for 4 minutes, then resume heading with a correction for the drift.'] },
  ],
  practice: [
    num('TAS 120 kt. Standard closing angle?', 30, 0.2, '°', '3,600 ÷ 120 = 30°.'),
    num('You are 4 NM off track and turn by the standard closing angle. For how many minutes do you hold it?', 4, 0.05, 'min', 'One minute per nautical mile off track.'),
    num('3 NM off track after 30 NM. By how many degrees do you turn using the double track error method?', 12, 0.2, '°', 'Track error 6°, doubled = 12°.'),
    mcq('After regaining track with the double track error method, you should:', ['Remove half of the correction', 'Keep the full correction', 'Remove all of the correction', 'Double the correction again'], 'The remaining half holds the track against the cause of the drift.'),
    tf('The standard closing angle depends on how far you have flown along the leg.', false, 'It depends only on true airspeed.'),
  ],
  assessment: [
    num('TAS 90 kt. Standard closing angle?', 40, 0.2, '°', '3,600 ÷ 90 = 40°.'),
    num('TAS 180 kt. Standard closing angle?', 20, 0.2, '°', '3,600 ÷ 180 = 20°.'),
    num('You are 3 NM off track and turn by the standard closing angle. For how many minutes do you hold it?', 3, 0.05, 'min', 'One minute per nautical mile off track.'),
    num('2 NM off track after 20 NM. By how many degrees do you turn using the double track error method?', 12, 0.2, '°', 'Track error 6°, doubled = 12°.'),
    num('At 30 NM from a VOR you are 4° off the required radial. Distance off the radial?', 2, 0.05, 'NM', '4 × 30 ÷ 60 = 2 NM.'),
    mcq('The double track error method returns the aircraft to track after:', ['The same distance again as already flown', 'Half the distance already flown', 'One minute', 'Twice the distance already flown'], 'Equal triangles on either side of the turning point.'),
    mcq('The standard closing angle closes with track at about:', ['1 NM per minute', '1 NM per hour', '10 NM per minute', '60 NM per minute'], 'Which is why the time in minutes equals the distance off in nautical miles.'),
  ],
  missionId: 'm-cpl-1in60', sources: ['phak'],
});

export const greatCircles = lesson('Navigation', {
  id: 'cpl-great-circles-and-rhumb-lines', title: 'Great Circles and Rhumb Lines', minutes: 13, level: 3, prereqs: ['ppl-charts-and-projections', 'math-trig'],
  objectives: ['Define great circle, rhumb line and convergency.', 'Calculate convergency and conversion angle.', 'Calculate departure along a parallel.', 'State where the great circle lies relative to the rhumb line.'],
  intro: 'Prerequisite review: a great circle is the shortest path on the Earth and a rhumb line holds a constant direction; on a Lambert chart a straight line is nearly a great circle. On long commercial legs the difference between them becomes a matter of fuel and of the track you must actually steer.',
  simple: 'The shortest route between two places curves towards the nearer pole, and its compass direction keeps changing. A route of constant direction is easier to fly but longer. The amount by which the direction changes can be calculated from the longitude crossed and the latitude.',
  sections: [
    { h: 'Definitions', body: [
      'A **great circle** is a circle on the Earth\'s surface whose plane passes through the centre of the Earth. The equator and all meridians are great circles. The shorter arc between two points is the shortest distance between them.',
      'A **rhumb line** cuts every meridian at the same angle. Parallels of latitude are rhumb lines; except for the equator they are **small circles**.',
    ] },
    { h: 'Convergency', body: [
      'Meridians are parallel at the equator and meet at the poles. **Convergency** is the angle between two meridians at a given latitude: `convergency = change of longitude × sin(mean latitude)`.',
      'It is also the change in direction of a great circle track between those meridians. For 20° of longitude at 30° N, convergency is 10°.',
      'The **conversion angle**, the difference between the great circle and rhumb line directions at either end, is half the convergency.',
    ], formula: 'convergency', lab: 'formula:convergency' },
    { h: 'Departure', body: [
      '**Departure** is the east–west distance along a parallel: `departure (NM) = change of longitude (minutes) × cos(latitude)`. Ten degrees of longitude is 600 NM at the equator but 300 NM at 60° latitude.',
    ] },
    { h: 'Which side', body: [
      'The great circle between two points always lies on the **polar side** of the rhumb line: north of it in the northern hemisphere, south of it in the southern.',
      'Its highest latitude is the **vertex**, where the track is exactly east or west.',
    ], note: 'These formulas treat the Earth as a sphere. They are standard for examination purposes and accurate enough for understanding; flight management systems use more exact models.' },
  ],
  examples: [
    { title: 'Convergency', steps: ['Two meridians 30° apart at a mean latitude of 30°.', 'sin 30° = 0.5.', 'Convergency = 30 × 0.5 = 15°; conversion angle = 7.5°.'] },
    { title: 'Departure', steps: ['Change of longitude 5° (300 minutes) at latitude 60°.', 'cos 60° = 0.5.', 'Departure = 300 × 0.5 = 150 NM.'] },
  ],
  practice: [
    num('Change of longitude 30° at a mean latitude of 30°. Convergency?', 15, 0.1, '°', '30 × sin 30° = 15°.'),
    num('Convergency is 15°. Conversion angle?', 7.5, 0.05, '°', 'Half the convergency.'),
    num('Change of longitude 5° at latitude 60°. Departure in nautical miles?', 150, 0.5, 'NM', '300 minutes × cos 60° = 150 NM.'),
    mcq('Which of these is a great circle?', ['The equator', 'The parallel of 50° N', 'The Arctic Circle', 'The Tropic of Cancer'], 'Its plane passes through the centre of the Earth.'),
    tf('A rhumb line is the shortest distance between two points on the Earth.', false, 'The great circle is the shortest.'),
  ],
  assessment: [
    num('Change of longitude 20° at a mean latitude of 30°. Convergency?', 10, 0.1, '°', '20 × sin 30° = 10°.'),
    num('Change of longitude 10° at a mean latitude of 60°. Convergency?', 8.66, 0.05, '°', '10 × sin 60° = 8.66°.'),
    num('Convergency is 10°. Conversion angle?', 5, 0.05, '°', 'Half the convergency.'),
    num('Change of longitude 10° at latitude 60°. Departure in nautical miles?', 300, 0.5, 'NM', '600 minutes × cos 60° = 300 NM.'),
    mcq('In the northern hemisphere, the great circle between two points lies:', ['North of the rhumb line', 'South of the rhumb line', 'On the rhumb line', 'Alternately north and south of it'], 'Always on the polar side.'),
    tf('All meridians are great circles.', true, 'Their planes pass through the centre of the Earth.'),
    mcq('At the vertex of a great circle, the track direction is:', ['Exactly east or west', 'Exactly north or south', 'Towards the pole', 'Undefined'], 'It is the point of highest latitude.'),
  ],
  missionId: 'm-cpl-gc', sources: ['phak'],
});

export const vorDmeIls = lesson('Navigation', {
  id: 'cpl-radio-navigation-vor-dme-and-ils', title: 'Radio Navigation: VOR, DME and ILS', minutes: 14, level: 3, prereqs: ['ppl-radio-navigation-fundamentals'],
  objectives: ['Estimate VHF line-of-sight range.', 'Calculate DME slant range.', 'Describe the components and indications of an ILS.', 'State the Category I decision height limit.'],
  intro: 'Prerequisite review: a VOR gives a magnetic radial from the station, DME gives slant range, and both need line of sight. Instrument flying adds the ILS, which guides an aircraft down a narrow path to a runway it cannot yet see.',
  simple: 'VHF signals travel in straight lines, so the higher you are, the further away you can receive them. DME measures the sloping distance to the station. An ILS has one beam for left and right and another for up and down, and you fly to keep both needles centred.',
  sections: [
    { h: 'VHF range', body: [
      'VOR, DME, ILS and VHF communication are limited by the horizon. A common approximation is `range (NM) = 1.23 × (√h₁ + √h₂)`, with the heights of the aircraft and the station in feet.',
      'At 10,000 ft with the station at sea level, range is about 123 NM.',
      'Directly above a VOR is the **cone of confusion**, where indications are unreliable.',
    ], formula: 'vhf-range', lab: 'formula:vhf-range' },
    { h: 'Slant range', body: [
      'DME reads the direct distance to the station: `slant range = √(ground distance² + height²)`, all in nautical miles. With 4 NM along the ground and 3 NM of height, DME reads 5 NM.',
      'The error matters only close to the station at high level.',
    ] },
    { h: 'ILS', body: [
      'The **localiser** (VHF) gives lateral guidance along the extended runway centreline. The **glide path** (UHF) gives vertical guidance, typically at 3°. Distance is given by DME or marker beacons.',
      'The deviation needles show where the beam is: if the localiser needle is to the left, the centreline is to the left; fly left. The ILS localiser is about four times as sensitive as a VOR indication.',
      'On a 3° path the height is about 300 ft per NM from touchdown, and the rate of descent about five times the groundspeed.',
    ] },
    { h: 'Minima', body: [
      'An ILS approach is flown down to a **decision height**. If the required visual reference is not seen there, a missed approach is flown. For a **Category I** approach the decision height is not lower than **200 ft**.',
    ], note: 'Frequencies, sensitivities and minima are quoted from memory of standard references and were not checked against current documents. Actual minima are published on the approach chart and depend on the operator\'s approval.' },
  ],
  examples: [
    { title: 'Range', steps: ['Aircraft at 6,400 ft, station at 100 ft.', '√6,400 = 80 and √100 = 10; 80 + 10 = 90.', 'Range ≈ 1.23 × 90 = 110.7 NM.'] },
    { title: 'Slant range', steps: ['Ground distance 12 NM, height 5 NM.', '12² + 5² = 144 + 25 = 169.', 'DME reads √169 = 13 NM.'] },
  ],
  practice: [
    num('Aircraft at 6,400 ft, station at 100 ft. VHF range using 1.23 × (√h₁ + √h₂)?', 110.7, 0.5, 'NM', '1.23 × (80 + 10) = 110.7 NM.'),
    num('Ground distance 12 NM, height 5 NM. DME slant range?', 13, 0.05, 'NM', '√(144 + 25) = 13 NM.'),
    mcq('The ILS localiser provides:', ['Lateral guidance to the runway centreline', 'Vertical guidance', 'Distance to touchdown', 'Wind information'], 'The glide path gives vertical guidance.'),
    mcq('The region directly above a VOR where indications are unreliable is the:', ['Cone of confusion', 'Zone of silence', 'Dead reckoning area', 'Glide path'], 'Expect needle fluctuations when passing overhead.'),
    tf('DME shows the distance along the ground to the station.', false, 'It shows slant range.'),
  ],
  assessment: [
    num('Aircraft at 10,000 ft, station at sea level. VHF range using 1.23 × (√h₁ + √h₂)?', 123, 0.5, 'NM', '1.23 × 100 = 123 NM.'),
    num('Aircraft at 2,500 ft, station at sea level. VHF range using 1.23 × (√h₁ + √h₂)?', 61.5, 0.5, 'NM', '1.23 × 50 = 61.5 NM.'),
    num('Ground distance 4 NM, height 3 NM. DME slant range?', 5, 0.05, 'NM', '√(16 + 9) = 5 NM.'),
    num('What is the lowest decision height, in feet, for a Category I ILS approach?', 200, 1, 'ft', 'Not lower than 200 ft.'),
    mcq('The ILS glide path provides:', ['Vertical guidance', 'Lateral guidance', 'Heading information', 'Groundspeed'], 'Typically a 3° descent path.'),
    mcq('On an ILS, the localiser needle is deflected to the left. The pilot should:', ['Fly left, towards the needle', 'Fly right, away from the needle', 'Climb', 'Hold heading'], 'The needle shows where the beam is.'),
    tf('VHF navigation aids are limited to line-of-sight range.', true, 'Range increases with aircraft height.'),
  ],
  missionId: 'm-cpl-ils', sources: ['faa-aim', 'phak'],
});

export const pbn = lesson('Navigation', {
  id: 'cpl-area-navigation-and-pbn', title: 'Area Navigation and PBN', minutes: 12, level: 3, prereqs: ['ppl-gnss-basics', 'cpl-radio-navigation-vor-dme-and-ils'],
  objectives: ['Explain area navigation.', 'Distinguish RNAV from RNP specifications.', 'Interpret the number in a navigation specification.', 'Distinguish fly-by from fly-over waypoints.'],
  intro: 'Prerequisite review: GNSS gives position anywhere, and RAIM checks its integrity. Area navigation uses that position to fly any desired path between waypoints instead of zig-zagging from beacon to beacon, and performance-based navigation sets out how accurately it must be done.',
  simple: 'Area navigation lets an aircraft fly straight between any two points. Performance-based navigation states how accurate the aircraft must be on a route, as a number of nautical miles. Some standards also require the aircraft to warn the crew when it can no longer meet that accuracy.',
  sections: [
    { h: 'Area navigation', body: [
      '**Area navigation** (RNAV) is a method that permits flight on any desired path within the coverage of navigation aids or the capability of self-contained systems. Position comes from GNSS, DME/DME or inertial systems, and routes are defined by **waypoints**.',
    ] },
    { h: 'Performance-based navigation', body: [
      '**PBN** defines requirements for routes and procedures as **navigation specifications**. There are two families: **RNAV** specifications and **RNP** specifications. The difference is that RNP requires **on-board performance monitoring and alerting**: the aircraft must tell the crew if it cannot achieve the required accuracy.',
      'The number is the lateral accuracy in nautical miles that must be achieved for at least 95% of the flight time. **RNAV 5** means within 5 NM; **RNP 1** means within 1 NM, with monitoring and alerting.',
    ], lab: 'explore:pbn' },
    { h: 'Waypoints', body: [
      'At a **fly-by** waypoint the aircraft begins its turn before the waypoint and cuts the corner smoothly. At a **fly-over** waypoint it must pass overhead before turning.',
      'The displayed **cross-track error** is the distance left or right of the desired track.',
    ] },
    { h: 'Approaches', body: [
      '**RNP approach** procedures can be flown to different minima depending on equipment: lateral guidance only (LNAV), with added vertical guidance (LNAV/VNAV), or with satellite-augmented guidance similar to an ILS (LPV).',
    ], note: 'Which specifications a pilot and aircraft may fly depends on equipment, approval and training. This lesson describes the concepts only.' },
  ],
  examples: [
    { title: 'Reading a specification', steps: ['A route is designated RNAV 5.', 'RNAV: no on-board monitoring and alerting requirement. 5: accuracy in NM.', 'The aircraft must stay within 5 NM of track for 95% of the flight time.'] },
    { title: 'Waypoint type', steps: ['A procedure shows a waypoint that must be overflown before the turn.', 'Turning early would leave protected airspace.', 'It is a fly-over waypoint.'] },
  ],
  practice: [
    mcq('Area navigation permits flight:', ['On any desired path between waypoints', 'Only directly between ground beacons', 'Only along meridians', 'Only in visual conditions'], 'Position is computed, so the route need not pass over beacons.'),
    num('What lateral accuracy, in nautical miles, does RNAV 5 require for 95% of the flight time?', 5, 0.01, 'NM', 'The number is the accuracy in nautical miles.'),
    mcq('At a fly-by waypoint, the aircraft:', ['Starts the turn before the waypoint', 'Must pass overhead before turning', 'Holds', 'Descends'], 'It cuts the corner smoothly.'),
    mcq('Cross-track error is:', ['The distance left or right of the desired track', 'The distance to the next waypoint', 'The altitude error', 'The time error'], 'Displayed in nautical miles.'),
    tf('RNAV and RNP specifications have identical requirements.', false, 'RNP adds on-board performance monitoring and alerting.'),
  ],
  assessment: [
    mcq('The difference between an RNP and an RNAV specification is that RNP requires:', ['On-board performance monitoring and alerting', 'A ground beacon at every waypoint', 'A second pilot', 'A radar service'], 'The aircraft must alert the crew if accuracy is lost.'),
    num('What lateral accuracy, in nautical miles, does RNP 1 require for 95% of the flight time?', 1, 0.01, 'NM', 'Within 1 NM.'),
    mcq('The number in a navigation specification is the required accuracy for at least:', ['95% of the flight time', '50% of the flight time', '100% of the flight time', '5% of the flight time'], 'A statistical containment.'),
    mcq('At a fly-over waypoint, the aircraft:', ['Must pass overhead before turning', 'Turns before reaching it', 'May ignore it', 'Must hold for one minute'], 'Used where early turns are not protected.'),
    mcq('PBN stands for:', ['Performance-based navigation', 'Precision beacon network', 'Pilot-based navigation', 'Primary bearing number'], 'Requirements are stated as performance, not as particular equipment.'),
    mcq('An RNP approach flown with satellite-augmented vertical guidance similar to an ILS is flown to:', ['LPV minima', 'LNAV minima', 'Circling minima', 'No minima'], 'LPV uses SBAS.'),
    tf('Area navigation routes are defined by waypoints.', true, 'Each is a set of coordinates.'),
  ],
  missionId: 'm-cpl-pbn', sources: ['faa-aim'],
});

export const polars = lesson('Principles of flight', {
  id: 'cpl-lift-and-drag-polars', title: 'Lift and Drag Polars', minutes: 14, level: 3, prereqs: ['ppl-drag-and-the-polar-curve', 'phys-drag'],
  objectives: ['Write the drag polar equation.', 'Calculate the induced drag coefficient.', 'Relate minimum drag speed to the speeds for range and endurance.', 'Explain the effect of aspect ratio.'],
  intro: 'Prerequisite review: total drag is parasite drag, rising with speed squared, plus induced drag, falling with speed squared; where they are equal, drag is least and the lift-to-drag ratio is greatest. Commercial performance planning hangs every important speed on that one point.',
  simple: 'Drag has a part that exists whenever the aircraft moves and a part that is the price of lift. A long, slender wing pays a lower price for lift. The speed of least drag is the reference from which the best speeds for range and endurance are found.',
  sections: [
    { h: 'The drag polar', body: [
      'The total drag coefficient is `C_D = C_D0 + C_L² ÷ (π × AR × e)`: a constant **parasite** part plus an **induced** part that grows with the square of the lift coefficient. **AR** is aspect ratio (span² ÷ wing area) and **e** an efficiency factor.',
      'With C_L = 0.6, AR = 8 and e = 0.8, the induced drag coefficient is 0.36 ÷ 20.1 ≈ 0.0179. Doubling C_L quadruples it.',
      'A higher aspect ratio reduces induced drag, which is why gliders and long-range airliners have long, narrow wings.',
    ], formula: 'induced-cd', lab: 'formula:induced-cd' },
    { h: 'Minimum drag speed', body: [
      'In level flight, induced drag is proportional to 1/V² and parasite drag to V². Total drag is least at **V_MD**, where the two are equal and L/D is at its maximum.',
    ] },
    { h: 'Speeds for range and endurance', body: [
      '**Propeller aircraft**: fuel flow follows power. Best **endurance** is at the minimum power speed, **V_MP ≈ 0.76 × V_MD**; best **range** is at **V_MD**.',
      '**Jet aircraft**: fuel flow follows thrust. Best **endurance** is at **V_MD**; best **range** is at about **1.32 × V_MD**.',
    ] },
    { h: 'What moves the curve', body: [
      'More **weight** needs more lift: induced drag rises and V_MD increases. Extending **flaps or gear** adds parasite drag: V_MD decreases and maximum L/D falls.',
    ], note: 'The factors 0.76 and 1.32 come from the idealised parabolic drag polar. Real aircraft differ somewhat; the flight manual gives the actual speeds.' },
  ],
  examples: [
    { title: 'Induced drag coefficient', steps: ['C_L = 1.0, AR = 10, e = 0.8.', 'π × 10 × 0.8 = 25.13.', 'C_Di = 1 ÷ 25.13 ≈ 0.0398.'] },
    { title: 'Speeds from V_MD', steps: ['A jet has V_MD of 200 kt.', 'Endurance speed = V_MD = 200 kt.', 'Range speed ≈ 1.32 × 200 = 264 kt.'] },
  ],
  practice: [
    num('C_L = 1.0, AR = 10, e = 0.8. Induced drag coefficient, C_L² ÷ (π × AR × e)?', 0.0398, 0.0005, '', '1 ÷ 25.13 ≈ 0.0398.'),
    num('A jet has V_MD of 200 kt. Approximate speed for best range (1.32 × V_MD)?', 264, 1, 'kt', '1.32 × 200 = 264 kt.'),
    mcq('At the minimum drag speed:', ['Induced drag equals parasite drag', 'Induced drag is zero', 'Parasite drag is zero', 'Lift is zero'], 'The two curves cross where the total is least.'),
    mcq('Increasing aspect ratio:', ['Reduces induced drag', 'Increases induced drag', 'Has no effect on drag', 'Increases weight only'], 'Induced drag is inversely proportional to aspect ratio.'),
    tf('In level flight, induced drag increases as speed increases.', false, 'It decreases with the square of speed.'),
  ],
  assessment: [
    num('C_L = 0.6, AR = 8, e = 0.8. Induced drag coefficient, C_L² ÷ (π × AR × e)?', 0.0179, 0.0003, '', '0.36 ÷ 20.106 ≈ 0.0179.'),
    num('A propeller aircraft has V_MD of 100 kt. Approximate minimum power speed (0.76 × V_MD)?', 76, 0.5, 'kt', '0.76 × 100 = 76 kt.'),
    num('A jet has V_MD of 100 kt. Approximate speed for best range (1.32 × V_MD)?', 132, 0.5, 'kt', '1.32 × 100 = 132 kt.'),
    mcq('If the lift coefficient doubles, the induced drag coefficient:', ['Becomes four times as large', 'Doubles', 'Halves', 'Is unchanged'], 'It depends on C_L squared.'),
    mcq('A propeller aircraft achieves best endurance at:', ['The minimum power speed', 'The minimum drag speed', 'The maximum speed', '1.32 × the minimum drag speed'], 'Its fuel flow follows power.'),
    mcq('A jet aircraft achieves best endurance at:', ['The minimum drag speed', 'The minimum power speed', '1.32 × the minimum drag speed', 'The stall speed'], 'Its fuel flow follows thrust, and thrust equals drag.'),
    mcq('An increase in aircraft weight makes the minimum drag speed:', ['Higher', 'Lower', 'Unchanged', 'Zero'], 'More lift means more induced drag at every speed.'),
  ],
  missionId: 'm-cpl-polars', sources: ['phak'],
});

export const stabilityControl = lesson('Principles of flight', {
  id: 'cpl-stability-and-control', title: 'Stability and Control', minutes: 13, level: 3, prereqs: ['ppl-stability', 'phys-centre-of-gravity'],
  objectives: ['Define neutral point and static margin.', 'Calculate static margin.', 'Describe the longitudinal and lateral-directional dynamic modes.', 'Explain the effects of centre-of-gravity position on handling.'],
  intro: 'Prerequisite review: a stable aircraft tends to return after a disturbance; the tailplane, fin and dihedral provide stability in pitch, yaw and roll; an aft centre of gravity reduces pitch stability. Larger and faster aircraft make each of these ideas measurable, and add oscillations that a pilot must recognise.',
  simple: 'There is a point along the aircraft where, if the centre of gravity sat exactly there, the aircraft would not care about being disturbed in pitch. The further the centre of gravity is ahead of that point, the more stable, and the heavier on the controls, the aircraft is.',
  sections: [
    { h: 'Neutral point and static margin', body: [
      'The **neutral point** is the centre-of-gravity position at which the aircraft would be neutrally stable in pitch. For positive stability the centre of gravity must be **ahead** of it.',
      'The **static margin** is the distance between them as a fraction of the mean aerodynamic chord: `static margin = (neutral point − CG) ÷ MAC`. With the neutral point at 2.9 m, the CG at 2.6 m and a chord of 1.5 m, it is 20%.',
    ], formula: 'static-margin', lab: 'formula:static-margin' },
    { h: 'Effect of CG position', body: [
      'A **forward** CG increases stability, increases the stick force needed to manoeuvre, needs more tail down-force (so more trim drag and a higher stall speed) and may limit the ability to flare.',
      'An **aft** CG reduces stability and stick forces; the aircraft becomes sensitive and, at the limit, unstable.',
    ] },
    { h: 'Longitudinal modes', body: [
      'The **short-period** oscillation is a rapid pitching about the centre of gravity at nearly constant speed. It is normally heavily damped.',
      'The **phugoid** is a slow exchange of speed and height at nearly constant angle of attack, lasting tens of seconds. It is lightly damped but easily controlled.',
    ] },
    { h: 'Lateral-directional modes', body: [
      '**Dutch roll** is a coupled oscillation in yaw and roll, typical of swept-wing aircraft, where lateral stability is strong relative to directional stability. A **yaw damper** suppresses it.',
      '**Spiral instability** is a slow, steepening descending turn, found where directional stability is strong relative to lateral stability.',
    ], note: 'Stability characteristics are established by the manufacturer and protected by the centre-of-gravity limits. Loading outside those limits invalidates them.' },
  ],
  examples: [
    { title: 'Static margin', steps: ['Neutral point 3.2 m, CG 2.9 m, MAC 2.0 m.', '(3.2 − 2.9) ÷ 2.0 = 0.15.', 'Static margin is 15%.'] },
    { title: 'Naming the mode', steps: ['After a gust the aircraft slowly climbs and slows, then descends and speeds up, repeating over about a minute.', 'Speed and height are being exchanged at nearly constant angle of attack.', 'This is the phugoid.'] },
  ],
  practice: [
    num('Neutral point 3.2 m, CG 2.9 m, MAC 2.0 m. Static margin in percent?', 15, 0.1, '%', '0.3 ÷ 2.0 = 15%.'),
    mcq('For positive longitudinal static stability, the centre of gravity must be:', ['Ahead of the neutral point', 'Behind the neutral point', 'At the tail', 'On the wing tip'], 'A positive static margin.'),
    mcq('The phugoid is:', ['A slow exchange of speed and height', 'A rapid pitching motion', 'A roll oscillation only', 'A yaw oscillation only'], 'Long period, lightly damped.'),
    mcq('Dutch roll is a coupled oscillation in:', ['Yaw and roll', 'Pitch and speed', 'Pitch only', 'Altitude only'], 'Typical of swept-wing aircraft.'),
    tf('Moving the centre of gravity aft increases stick forces.', false, 'It reduces stability and stick forces.'),
  ],
  assessment: [
    num('Neutral point 2.9 m, CG 2.6 m, MAC 1.5 m. Static margin in percent?', 20, 0.1, '%', '0.3 ÷ 1.5 = 20%.'),
    num('Neutral point 3.0 m, CG 2.85 m, MAC 1.5 m. Static margin in percent?', 10, 0.1, '%', '0.15 ÷ 1.5 = 10%.'),
    mcq('The neutral point is the centre-of-gravity position at which the aircraft is:', ['Neutrally stable in pitch', 'Most stable in pitch', 'At maximum weight', 'At minimum drag'], 'Behind it the aircraft is unstable.'),
    mcq('The short-period oscillation is:', ['A rapid, normally well-damped pitching motion', 'A slow exchange of speed and height', 'A spiral dive', 'A yaw-roll oscillation'], 'It occurs at nearly constant speed.'),
    mcq('A yaw damper is fitted to suppress:', ['Dutch roll', 'The phugoid', 'The stall', 'Wake turbulence'], 'It applies rudder automatically against the yaw.'),
    mcq('A forward centre of gravity, compared with an aft one, gives:', ['More stability and a higher stall speed', 'Less stability and a lower stall speed', 'Lighter stick forces', 'Less trim drag'], 'More tail down-force is required.'),
    mcq('Spiral instability occurs when:', ['Directional stability is strong relative to lateral stability', 'Lateral stability is strong relative to directional stability', 'The centre of gravity is too far forward', 'The flaps are extended'], 'The aircraft slowly rolls into a steepening turn.'),
  ],
  missionId: 'm-cpl-stability', sources: ['phak'],
});

export const highLift = lesson('Principles of flight', {
  id: 'cpl-high-lift-devices', title: 'High-Lift Devices', minutes: 12, level: 3, prereqs: ['ppl-stalling-and-spinning'],
  objectives: ['Describe the main types of trailing-edge flap.', 'Describe leading-edge slats and slots.', 'Calculate the change of stall speed with maximum lift coefficient.', 'Explain the effects of high-lift devices on stalling angle and drag.'],
  intro: 'Prerequisite review: stall speed falls when the wing can produce more lift, and flaps lower it at the cost of drag. A wing shaped for fast cruise is poor at flying slowly, so commercial aircraft change the shape of the wing for take-off and landing.',
  simple: 'Flaps at the back of the wing add curve and sometimes area, so the wing lifts more at low speed. Slats at the front let the wing reach a steeper angle before it stalls. Both lower the stall speed; both add drag.',
  sections: [
    { h: 'Trailing-edge flaps', body: [
      'A **plain** flap hinges the rear of the wing down. A **split** flap lowers only the under-surface, giving much drag. A **slotted** flap opens a gap that feeds high-energy air over the flap. A **Fowler** flap moves rearward as well as down, increasing both **camber and wing area**; it is the most effective.',
      'Trailing-edge flaps increase the maximum lift coefficient but **reduce the stalling angle of attack**, and produce a nose-down pitching moment.',
    ] },
    { h: 'Leading-edge devices', body: [
      'A **slot** is a fixed gap behind the leading edge. A **slat** is a movable section that opens such a gap. A **Krueger flap** hinges forward from the lower leading edge.',
      'They re-energise the boundary layer and delay separation, so the maximum lift coefficient increases and the **stalling angle of attack increases**.',
    ] },
    { h: 'Stall speed', body: [
      'Stall speed is inversely proportional to the square root of the maximum lift coefficient: `Vs(new) = Vs × √(C_Lmax old ÷ C_Lmax new)`.',
      'Raising C_Lmax from 1.5 to 2.4 lowers a 60 kt stall speed to about 47 kt.',
    ], formula: 'vs-clmax', lab: 'formula:vs-clmax' },
    { h: 'Use', body: [
      'A small flap setting gives a useful increase in lift for little drag: used for **take-off**. A large setting gives much lift and much drag: used for **landing**, to steepen the approach and shorten the landing run.',
      'Extending flaps reduces the lift-to-drag ratio. Asymmetric extension causes a strong roll.',
    ], note: 'Flap limiting speeds and take-off settings are specific to each aircraft and are given in its flight manual.' },
  ],
  examples: [
    { title: 'Stall speed with flaps', steps: ['Clean stall speed 80 kt, C_Lmax rises from 1.6 to 2.5.', '√(1.6 ÷ 2.5) = √0.64 = 0.8.', 'New stall speed = 80 × 0.8 = 64 kt.'] },
    { title: 'Which device?', steps: ['A device at the leading edge opens a gap at high angle of attack.', 'It delays separation to a higher angle.', 'It is a slat.'] },
  ],
  practice: [
    num('Clean stall speed 80 kt; C_Lmax rises from 1.6 to 2.5. New stall speed?', 64, 0.3, 'kt', '80 × √0.64 = 64 kt.'),
    mcq('A Fowler flap increases:', ['Both camber and wing area', 'Camber only', 'Wing area only', 'Neither'], 'It moves rearward as well as down.'),
    mcq('Leading-edge slats make the stalling angle of attack:', ['Larger', 'Smaller', 'Unchanged', 'Zero'], 'They delay boundary-layer separation.'),
    mcq('A large flap setting is used for landing because it gives:', ['High lift and high drag', 'Low lift and low drag', 'High lift and no drag', 'More speed'], 'A steeper approach and a shorter landing run.'),
    tf('Extending flaps improves the lift-to-drag ratio.', false, 'Drag rises proportionally more than lift.'),
  ],
  assessment: [
    num('Clean stall speed 60 kt; C_Lmax rises from 1.5 to 2.4. New stall speed?', 47.4, 0.3, 'kt', '60 × √0.625 ≈ 47.4 kt.'),
    num('Clean stall speed 100 kt; C_Lmax rises from 1.4 to 2.8. New stall speed?', 70.7, 0.3, 'kt', '100 × √0.5 ≈ 70.7 kt.'),
    mcq('Trailing-edge flaps make the stalling angle of attack:', ['Smaller', 'Larger', 'Unchanged', 'Infinite'], 'More lift is produced, but the stall occurs at a lower angle.'),
    mcq('The most effective trailing-edge flap is generally the:', ['Fowler flap', 'Plain flap', 'Split flap', 'Trim tab'], 'It increases both area and camber.'),
    mcq('A slotted flap works by:', ['Feeding high-energy air through a gap over the flap', 'Reducing wing area', 'Heating the airflow', 'Blocking the airflow'], 'This delays separation over the flap.'),
    mcq('Extending trailing-edge flaps generally produces:', ['A nose-down pitching moment', 'A nose-up pitching moment from the wing alone', 'No pitching moment', 'A yawing moment only'], 'The centre of pressure moves rearward.'),
    tf('A small flap setting is commonly used for take-off.', true, 'It adds lift with little extra drag.'),
  ],
  missionId: 'm-cpl-highlift', sources: ['phak', 'afh'],
});

export const asymmetric = lesson('Principles of flight', {
  id: 'cpl-asymmetric-thrust', title: 'Asymmetric Thrust', minutes: 14, level: 3, prereqs: ['ppl-propellers', 'phys-torque'],
  objectives: ['Calculate the yawing moment from an inoperative engine.', 'Define the critical engine.', 'Define minimum control speed and the factors that change it.', 'Describe the performance loss with one engine inoperative.'],
  intro: 'Prerequisite review: a moment is a force times its arm, and a clockwise-turning propeller produces more thrust on its down-going blade at high angle of attack. Put engines on the wings and both facts matter at once the moment one of them stops.',
  simple: 'A twin with one engine stopped is pushed round by the engine that is still running. The rudder must hold it straight, and below a certain speed the rudder is no longer powerful enough. Losing one of two engines also takes away most of the climb performance, not half.',
  sections: [
    { h: 'Yawing moment', body: [
      'With one engine failed, the thrust of the live engine acts at a distance from the centreline: `yawing moment = thrust × arm`. A thrust of 2,000 N at 2.5 m gives 5,000 N·m.',
      'The windmilling propeller of the failed engine adds drag on the other side, increasing the moment. **Feathering** it removes most of that drag.',
      'The rudder provides the opposing moment: rudder force × its arm to the centre of gravity.',
    ], formula: 'yaw-moment', lab: 'formula:yaw-moment' },
    { h: 'Critical engine', body: [
      'The **critical engine** is the one whose failure most adversely affects control and performance. On a conventional twin with both propellers turning clockwise as seen from behind, the down-going blades are on the right of each engine, so the right engine\'s thrust line is further from the centreline. Failure of the **left** engine therefore leaves the larger yawing moment: the left engine is critical.',
      'Counter-rotating propellers remove the difference.',
    ] },
    { h: 'Minimum control speed', body: [
      '**V_MC** is the minimum speed at which directional control can be maintained with the critical engine suddenly inoperative, the other at take-off power, and not more than **5° of bank** towards the live engine.',
      'V_MC is **higher** with an aft centre of gravity (shorter rudder arm), with more engine power (low density altitude) and with the failed propeller windmilling.',
      'On the airspeed indicator of a light twin a **red radial line** marks V_MC and a **blue radial line** marks the best single-engine rate-of-climb speed, V_YSE.',
    ] },
    { h: 'Performance', body: [
      'Climb depends on **excess** power. Losing one of two engines removes half the power but most of the excess: climb performance commonly falls by 80% or more, and may become a descent.',
    ], note: 'Engine-failure procedures and speeds are specific to each aircraft type. They are learned from the flight manual and practised only with a qualified instructor.' },
  ],
  examples: [
    { title: 'Yawing moment', steps: ['The live engine gives 3,000 N of thrust, 2 m from the centreline.', '3,000 × 2.', 'Yawing moment = 6,000 N·m.'] },
    { title: 'Rudder force', steps: ['A yawing moment of 6,000 N·m must be balanced by the rudder, 6 m behind the centre of gravity.', '6,000 ÷ 6.', 'The rudder must produce a side force of 1,000 N.'] },
  ],
  practice: [
    num('The live engine gives 3,000 N of thrust, 2 m from the centreline. Yawing moment?', 6000, 10, 'N·m', '3,000 × 2 = 6,000 N·m.'),
    mcq('Feathering the propeller of a failed engine:', ['Reduces its drag', 'Increases its drag', 'Restarts the engine', 'Increases V_MC'], 'The blades are turned edge-on to the airflow.'),
    mcq('The critical engine is the one whose failure:', ['Most adversely affects control and performance', 'Has no effect', 'Improves performance', 'Is easiest to restart'], 'It leaves the largest yawing moment.'),
    mcq('The blue radial line on a light twin\'s airspeed indicator marks:', ['The best single-engine rate-of-climb speed', 'The stall speed', 'The never-exceed speed', 'The flap limit speed'], 'This speed is called V_YSE.'),
    tf('Losing one of two engines reduces climb performance by exactly half.', false, 'It removes most of the excess power: typically 80% or more of the climb.'),
  ],
  assessment: [
    num('The live engine gives 2,000 N of thrust, 2.5 m from the centreline. Yawing moment?', 5000, 10, 'N·m', '2,000 × 2.5 = 5,000 N·m.'),
    num('A yawing moment of 6,000 N·m is balanced by the rudder 6 m behind the centre of gravity. Rudder side force?', 1000, 5, 'N', '6,000 ÷ 6 = 1,000 N.'),
    mcq('On a conventional twin with both propellers turning clockwise as seen from behind, the critical engine is:', ['The left engine', 'The right engine', 'Neither', 'Both equally'], 'The right engine\'s thrust line is further from the centreline.'),
    num('V_MC is determined with not more than how many degrees of bank towards the live engine?', 5, 0.1, '°', 'Not more than 5°.'),
    mcq('An aft centre of gravity makes V_MC:', ['Higher', 'Lower', 'Unchanged', 'Zero'], 'The rudder has a shorter arm.'),
    mcq('The red radial line on a light twin\'s airspeed indicator marks:', ['V_MC', 'V_YSE', 'The best glide speed', 'The flap limit'], 'Minimum control speed with the critical engine inoperative.'),
    tf('A windmilling propeller on the failed engine increases the yawing moment.', true, 'It adds drag on the dead-engine side.'),
  ],
  missionId: 'm-cpl-asymmetric', sources: ['afh', 'phak'],
});
