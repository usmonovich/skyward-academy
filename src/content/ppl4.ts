// PPL Phase A — How Aircraft Fly: seven introductory lessons completing the pre-flight-school phase.
import { lesson, mcq, num, tf } from './q';

export const basicAero = lesson('Basic aerodynamics', {
  id: 'ppl-basic-aerodynamics', title: 'Basic Aerodynamics', minutes: 11, level: 2, prereqs: ['ppl-forces'],
  objectives: ['Name the parts of an aerofoil.', 'Define angle of attack and distinguish it from pitch attitude.', 'Describe how lift changes with angle of attack.', 'Explain why a wing stalls at a critical angle, not a fixed speed.'],
  intro: 'A pilot controls lift with two things: airspeed and angle of attack. Angle of attack is the less visible of the two and the more important, because it alone decides when the wing stops flying.',
  simple: 'The angle of attack is the angle at which the wing meets the oncoming air. More angle gives more lift, up to a limit. Go past that limit and the airflow breaks away from the wing: that is a stall.',
  sections: [
    { h: 'The aerofoil', body: [
      'A wing\'s cross-section is an **aerofoil**. Its front is the **leading edge** and its rear the **trailing edge**. The straight line joining them is the **chord line**. **Camber** is the curvature of the aerofoil.',
      'The **relative airflow** is the air meeting the wing. It is equal and opposite to the aircraft\'s flight path.',
    ] },
    { h: 'Angle of attack', body: [
      'The **angle of attack** is the angle between the chord line and the relative airflow.',
      'It is not the same as pitch attitude, which is measured against the horizon. Roughly, `angle of attack = pitch attitude − flight path angle`. An aircraft pitched 10° up while climbing along a 6° path has an angle of attack of about 4°.',
    ], formula: 'aoa', lab: 'formula:aoa' },
    { h: 'Lift and the critical angle', body: [
      'Lift increases as angle of attack increases, until the **critical angle of attack**, typically around 15° to 18° for a light-aircraft wing. Beyond it the airflow separates from the upper surface, lift falls and drag rises sharply: the wing has **stalled**.',
      'A wing stalls whenever the critical angle is exceeded, at any airspeed and in any attitude. To recover, the angle of attack must be reduced.',
      'To fly slowly, a wing needs a larger angle of attack to make the same lift. That is why the stall is usually met at low airspeed.',
    ], note: 'The pitch-minus-path relation ignores the small fixed angle at which the wing is mounted on the fuselage. It is a way to understand the idea, not a figure to fly by.' },
  ],
  examples: [
    { title: 'Angle of attack in a climb', steps: ['Pitch attitude is 12° up; the climb path is 7° up.', '12 − 7 = 5.', 'Angle of attack is about 5°.'] },
    { title: 'Nose-low but stalled', steps: ['An aircraft is descending steeply along a 20° downward path with the nose 3° below the horizon.', 'Angle of attack = −3 − (−20) = 17°.', 'It can be at the critical angle even with the nose below the horizon.'] },
  ],
  practice: [
    num('Pitch attitude is 12° up and the flight path is 7° up. Approximate angle of attack?', 5, 0.1, '°', '12 − 7 = 5°.'),
    mcq('The chord line joins:', ['The leading edge and the trailing edge', 'The wing tip and the wing root', 'The nose and the tail', 'The two wing tips'], 'It is the reference line of the aerofoil.'),
    mcq('The relative airflow is:', ['Opposite to the flight path', 'Always horizontal', 'Always from the north', 'Parallel to the chord line'], 'It depends on where the aircraft is going, not where it points.'),
    mcq('As angle of attack increases towards the critical angle, lift:', ['Increases', 'Decreases', 'Stays the same', 'Becomes zero'], 'It rises until the critical angle.'),
    tf('Angle of attack and pitch attitude are always equal.', false, 'They are equal only in level flight, ignoring the wing\'s mounting angle.'),
  ],
  assessment: [
    mcq('The angle of attack is the angle between:', ['The chord line and the relative airflow', 'The chord line and the horizon', 'The fuselage and the ground', 'The wing and the tailplane'], 'It is measured against the airflow, not the horizon.'),
    num('Pitch attitude is 10° up and the flight path is 6° up. Approximate angle of attack?', 4, 0.1, '°', '10 − 6 = 4°.'),
    num('In level flight the pitch attitude is 5° up. Approximate angle of attack?', 5, 0.1, '°', 'The flight path angle is zero, so 5 − 0 = 5°.'),
    mcq('A wing stalls when:', ['The critical angle of attack is exceeded', 'A certain airspeed is reached, whatever the angle', 'The engine stops', 'The aircraft is too high'], 'The stall is an angle-of-attack event.'),
    mcq('To recover from a stall, the pilot must first:', ['Reduce the angle of attack', 'Pull back harder', 'Raise the flaps fully', 'Turn steeply'], 'The airflow must reattach to the wing.'),
    tf('A wing can stall at any airspeed and in any attitude.', true, 'Only the angle of attack matters.'),
    mcq('Camber is:', ['The curvature of the aerofoil', 'The length of the wing', 'The thickness of the paint', 'The angle of the propeller'], 'More camber generally gives more lift at a given angle of attack.'),
  ],
  missionId: 'm-ppl-aero', sources: ['phak', 'afh'],
});

export const stability = lesson('Stability', {
  id: 'ppl-stability', title: 'Stability', minutes: 10, level: 2, prereqs: ['ppl-basic-aerodynamics', 'ppl-controls'],
  objectives: ['Define positive, neutral and negative static stability.', 'Name the three axes and the stability about each.', 'Describe how the tailplane, fin and dihedral provide stability.', 'Explain the trade-off between stability and manoeuvrability.'],
  intro: 'Let go of the controls in a well-trimmed training aircraft and it keeps flying. That is no accident: stability is designed in, and loading the aircraft wrongly can take it away.',
  simple: 'A stable aircraft returns by itself to steady flight after a bump. The tail surfaces work like the feathers on an arrow, and the upward tilt of the wings helps level them.',
  sections: [
    { h: 'Static stability', body: [
      '**Static stability** describes the first reaction after a disturbance. **Positive**: the aircraft tends to return. **Neutral**: it stays in the new condition. **Negative**: it moves further away.',
      '**Dynamic stability** describes what happens over time: whether the resulting oscillations die out.',
    ], lab: 'explore:stability' },
    { h: 'Three axes', body: [
      '**Longitudinal stability** is stability in pitch, provided mainly by the tailplane and strongly affected by the position of the centre of gravity.',
      '**Lateral stability** is stability in roll, provided mainly by **dihedral**, the upward angle of the wings from root to tip.',
      '**Directional stability** is stability in yaw, provided mainly by the vertical fin, which acts like a weathervane.',
    ] },
    { h: 'Stability and control', body: [
      'A very stable aircraft resists every change, including those the pilot wants: it is less manoeuvrable. Training aircraft are designed to be clearly stable; aerobatic aircraft less so.',
      'Moving the centre of gravity aft reduces longitudinal stability. Beyond the aft limit the aircraft may become unstable in pitch.',
    ], note: 'Stability is a tendency, not a guarantee. A stable aircraft in turbulence or out of trim still needs to be flown.' },
  ],
  examples: [
    { title: 'A gust in pitch', steps: ['A gust lifts the nose.', 'The tailplane meets the air at a greater angle and produces an upward force at the tail.', 'The nose is pushed back down: positive longitudinal stability.'] },
    { title: 'A gust in yaw', steps: ['A gust swings the nose to the left.', 'The airflow now strikes the fin from the side.', 'The fin pushes the tail back into line, like a weathervane.'] },
  ],
  practice: [
    mcq('An aircraft that returns towards its original condition after a disturbance has:', ['Positive static stability', 'Negative static stability', 'Neutral static stability', 'No stability'], 'It tends to return.'),
    mcq('Directional stability is provided mainly by:', ['The vertical fin', 'The ailerons', 'The flaps', 'The propeller'], 'It acts like a weathervane.'),
    mcq('Dihedral is:', ['The upward angle of the wings from root to tip', 'The sweep of the wings', 'The width of the tailplane', 'The angle of the propeller blades'], 'It helps the wings return to level.'),
    mcq('Longitudinal stability is stability in:', ['Pitch', 'Roll', 'Yaw', 'Speed only'], 'About the lateral axis.'),
    tf('The more stable an aircraft is, the more manoeuvrable it is.', false, 'Stability resists change, so manoeuvrability is reduced.'),
  ],
  assessment: [
    mcq('An aircraft that moves further away from its original condition after a disturbance has:', ['Negative static stability', 'Positive static stability', 'Neutral static stability', 'Dynamic stability'], 'It is statically unstable.'),
    mcq('Longitudinal stability is provided mainly by:', ['The tailplane', 'The ailerons', 'The landing gear', 'The flaps'], 'It produces a restoring force in pitch.'),
    mcq('Lateral stability is provided mainly by:', ['Wing dihedral', 'The elevator', 'The fin alone', 'The trim tab'], 'Dihedral tends to level the wings.'),
    mcq('Lateral stability is stability in:', ['Roll', 'Pitch', 'Yaw', 'Altitude'], 'About the longitudinal axis.'),
    mcq('Moving the centre of gravity aft makes the aircraft:', ['Less stable in pitch', 'More stable in pitch', 'More stable in roll', 'Unaffected'], 'Beyond the aft limit it may become unstable.'),
    tf('The vertical fin gives an aircraft directional stability.', true, 'It turns the nose back into the airflow.'),
    mcq('Compared with an aerobatic aircraft, a training aircraft is designed to be:', ['More stable', 'Less stable', 'Unstable', 'Neutrally stable in all axes'], 'Forgiving handling suits training.'),
  ],
  missionId: 'm-ppl-stability', sources: ['phak'],
});

export const instrumentsIntro = lesson('Aircraft instruments', {
  id: 'ppl-introduction-to-aircraft-instruments', title: 'Introduction to Aircraft Instruments', minutes: 10, level: 2, prereqs: ['ppl-cockpit-familiarisation', 'phys-pressure'],
  objectives: ['Group the flight instruments by how they work.', 'Name the pitot-static instruments and their pressure sources.', 'Name the gyroscopic instruments.', 'Read the colour markings on an airspeed indicator.'],
  intro: 'Instruments fail in groups, because they share sources. A pilot who knows which instruments depend on which source can recognise a failure quickly and know what can still be trusted.',
  simple: 'Three instruments work from air pressure, three work from spinning gyroscopes, and the compass works from the Earth\'s magnetism. The airspeed indicator has coloured arcs that mark the safe speed ranges.',
  sections: [
    { h: 'Pitot-static instruments', body: [
      'The **pitot tube** faces the airflow and senses total pressure. **Static ports** sense the undisturbed pressure of the outside air.',
      'The **airspeed indicator** uses both: the difference is dynamic pressure. The **altimeter** and the **vertical speed indicator** use static pressure only.',
      'A blocked pitot tube affects only the airspeed indicator. A blocked static port affects all three.',
    ] },
    { h: 'Gyroscopic instruments', body: [
      'A spinning gyroscope keeps its orientation in space. The **attitude indicator**, **heading indicator** and **turn coordinator** use this property.',
      'The heading indicator drifts slowly and must be reset against the magnetic compass at regular intervals in steady flight.',
    ] },
    { h: 'Airspeed indicator markings', body: [
      'The **white arc** is the flap operating range. The **green arc** is the normal operating range. The **yellow arc** is the caution range, for smooth air only. The **red line** is the never-exceed speed.',
      'The lower end of the white arc is the stall speed in the landing configuration; the lower end of the green arc is the stall speed with flaps up.',
    ], lab: 'explore:asi-arcs', note: 'The speeds for each marking are specific to the aircraft type and are listed in its flight manual. The stall speeds shown are for maximum weight in straight, unaccelerated flight.' },
  ],
  examples: [
    { title: 'Blocked pitot', steps: ['Ice blocks the pitot tube.', 'Only the airspeed indicator uses pitot pressure.', 'The airspeed reading is unreliable; altimeter and vertical speed still work.'] },
    { title: 'Reading the arcs', steps: ['The needle is in the yellow arc.', 'That is the caution range.', 'Acceptable only in smooth air; slow down if turbulence is expected.'] },
  ],
  practice: [
    mcq('Which instrument uses both pitot and static pressure?', ['The airspeed indicator', 'The altimeter', 'The vertical speed indicator', 'The heading indicator'], 'It measures the difference: dynamic pressure.'),
    mcq('The attitude indicator works by means of:', ['A gyroscope', 'Static pressure', 'The Earth\'s magnetic field', 'Engine oil pressure'], 'The gyro stays fixed in space while the aircraft moves around it.'),
    mcq('The green arc on an airspeed indicator shows:', ['The normal operating range', 'The flap operating range', 'The caution range', 'The never-exceed speed'], 'Normal flight in all conditions.'),
    mcq('The magnetic compass works from:', ['The Earth\'s magnetic field', 'Static pressure', 'A gyroscope', 'The pitot tube'], 'It needs no power source.'),
    tf('A blocked pitot tube affects the altimeter.', false, 'The altimeter uses static pressure only.'),
  ],
  assessment: [
    mcq('Which of these is a pitot-static instrument?', ['The altimeter', 'The attitude indicator', 'The heading indicator', 'The turn coordinator'], 'It measures static pressure.'),
    mcq('Which of these is a gyroscopic instrument?', ['The heading indicator', 'The airspeed indicator', 'The altimeter', 'The vertical speed indicator'], 'It uses a gyroscope to hold direction.'),
    mcq('A blocked static port affects:', ['The airspeed indicator, altimeter and vertical speed indicator', 'The airspeed indicator only', 'The attitude indicator only', 'The compass'], 'All three use static pressure.'),
    mcq('The white arc on an airspeed indicator shows:', ['The flap operating range', 'The normal operating range', 'The caution range', 'The best glide speed'], 'Flaps may be extended within it.'),
    mcq('The red line on an airspeed indicator marks:', ['The never-exceed speed', 'The stall speed', 'The best rate of climb speed', 'The flap limit'], 'It must not be exceeded in any conditions.'),
    mcq('The yellow arc on an airspeed indicator may be used:', ['In smooth air only', 'At any time', 'Only with flaps down', 'Only on the ground'], 'It is the caution range.'),
    tf('The heading indicator must be reset against the magnetic compass from time to time.', true, 'Gyroscopic drift makes it wander slowly.'),
  ],
  missionId: 'm-ppl-instruments', sources: ['phak'],
});

export const basicMet = lesson('Basic meteorology', {
  id: 'ppl-basic-meteorology', title: 'Basic Meteorology', minutes: 10, level: 1, prereqs: ['phys-atmos'],
  objectives: ['Describe the composition and lowest layer of the atmosphere.', 'Describe how pressure and temperature change with height.', 'Explain what makes the wind blow.', 'Explain dew point and the difference between stable and unstable air.'],
  intro: 'Weather is the largest single factor in whether a light-aircraft flight is safe. The detailed lessons come later; this one gives the handful of ideas they all build on.',
  simple: 'Air gets thinner and colder as you go up. Air moves from high pressure towards low pressure, and that movement is wind. When air is cooled enough, the water in it becomes cloud or fog.',
  sections: [
    { h: 'The atmosphere', body: [
      'Dry air is about 78% nitrogen and 21% oxygen. Nearly all weather happens in the lowest layer, the **troposphere**, whose top (the **tropopause**) lies at about 36,000 ft in the standard atmosphere.',
    ] },
    { h: 'Pressure and temperature with height', body: [
      'Pressure falls with height: near sea level by about 1 hPa for every 27 ft.',
      'In the standard atmosphere, temperature falls by about 2 °C per 1,000 ft from 15 °C at sea level.',
    ], formula: 'hpa-ft', lab: 'formula:hpa-ft' },
    { h: 'Wind', body: [
      'Differences in pressure set the air moving from **high** towards **low** pressure. The rotation of the Earth deflects it, so the wind ends up blowing roughly along the isobars rather than straight across them.',
      'Closely spaced isobars on a chart mean a steep pressure change and a strong wind.',
    ] },
    { h: 'Moisture and stability', body: [
      'The **dew point** is the temperature to which air must be cooled to become saturated. When temperature and dew point are close together, cloud, mist or fog is likely.',
      '**Stable** air resists vertical movement: expect layer cloud, steady precipitation, smooth air and often poor visibility. **Unstable** air rises readily: expect heaped cloud, showers, turbulence and good visibility between showers.',
    ], note: 'A basic understanding is not a weather briefing. Before every flight, obtain the official forecasts and reports for your route.' },
  ],
  examples: [
    { title: 'Height from pressure', steps: ['Two levels differ in pressure by 20 hPa near sea level.', '20 × 27 = 540.', 'They are about 540 ft apart.'] },
    { title: 'Fog risk', steps: ['Evening temperature is 9 °C and the dew point is 8 °C, under a clear sky with light wind.', 'Only 1 °C of cooling is needed for saturation.', 'Fog is likely overnight.'] },
  ],
  practice: [
    num('Near sea level, two levels differ in pressure by 20 hPa. Height difference at 27 ft per hPa?', 540, 5, 'ft', '20 × 27 = 540 ft.'),
    mcq('The lowest layer of the atmosphere, where weather occurs, is the:', ['Troposphere', 'Stratosphere', 'Mesosphere', 'Ionosphere'], 'It extends up to the tropopause.'),
    mcq('Wind is caused by:', ['Differences in air pressure', 'The Moon', 'Aircraft engines', 'Differences in altitude only'], 'Air moves from high towards low pressure.'),
    mcq('Stable air is associated with:', ['Layer cloud and smooth air', 'Thunderstorms', 'Heaped cloud and showers', 'Severe turbulence'], 'It resists vertical movement.'),
    tf('Air pressure increases as height increases.', false, 'It decreases: there is less air above.'),
  ],
  assessment: [
    mcq('Dry air contains approximately:', ['78% nitrogen and 21% oxygen', '78% oxygen and 21% nitrogen', '50% nitrogen and 50% oxygen', '21% nitrogen and 78% carbon dioxide'], 'The remaining 1% is mostly argon.'),
    num('Near sea level, two levels differ in pressure by 30 hPa. Height difference at 27 ft per hPa?', 810, 8, 'ft', '30 × 27 = 810 ft.'),
    mcq('Closely spaced isobars on a weather chart indicate:', ['Strong wind', 'Calm conditions', 'High temperature', 'Fog'], 'Pressure changes quickly over a short distance.'),
    mcq('The dew point is the temperature at which:', ['Air becomes saturated when cooled', 'Water boils', 'Ice melts', 'The wind stops'], 'Further cooling causes condensation.'),
    mcq('When temperature and dew point are close together, expect:', ['Cloud, mist or fog', 'Clear skies and excellent visibility', 'Strong wind', 'Low humidity'], 'The air is near saturation.'),
    mcq('Unstable air is associated with:', ['Heaped cloud, showers and turbulence', 'Layer cloud and drizzle', 'Smooth air and fog', 'No cloud at all'], 'Air rises readily.'),
    tf('Air tends to move from high pressure towards low pressure.', true, 'That movement is the wind.'),
  ],
  missionId: 'm-ppl-met', sources: ['phak', 'faa-wx'],
});

export const basicNav = lesson('Basic navigation', {
  id: 'ppl-basic-navigation', title: 'Basic Navigation', minutes: 10, level: 1, prereqs: ['math-dst', 'math-angles'],
  objectives: ['Distinguish heading, track and bearing.', 'Explain drift.', 'Describe pilotage and dead reckoning.', 'Calculate the time for a leg.'],
  intro: 'Navigation answers three questions over and over: where am I, where am I going, and when will I get there? The methods a student pilot uses first need nothing more than a chart, a compass and a clock.',
  simple: 'Heading is where the nose points. Track is the path over the ground. The wind makes them differ. You find your way by matching the ground to the chart and by working out, from speed and time, where you should be.',
  sections: [
    { h: 'Direction words', body: [
      '**Heading** is the direction the aircraft\'s nose points. **Track** is the direction of its path over the ground. **Bearing** is the direction from one place to another.',
      'All are measured in degrees clockwise from north, from 000 to 360.',
    ] },
    { h: 'Drift', body: [
      'A wind from the side carries the aircraft sideways, so track differs from heading. The angle between them is **drift**. To keep a desired track, the pilot points the nose slightly into the wind.',
    ] },
    { h: 'Two basic methods', body: [
      '**Pilotage** is navigating by comparing features on the ground, such as towns, rivers, roads and railways, with the chart.',
      '**Dead reckoning** is calculating position from heading, speed and elapsed time. In practice the two are used together: calculate where you should be, then confirm it by looking.',
    ] },
    { h: 'Time on a leg', body: [
      '`time in minutes = distance ÷ groundspeed × 60`. A leg of 45 NM at 90 kt takes 30 minutes.',
      'One minute of latitude is one nautical mile, so the latitude scale at the side of a chart can be used to measure distance.',
    ], formula: 'leg-time', lab: 'formula:leg-time', note: 'Electronic navigation is excellent, but it can fail. Visual navigation with chart, compass and clock is the foundation that remains.' },
  ],
  examples: [
    { title: 'Leg time', steps: ['A leg is 60 NM and groundspeed is 120 kt.', '60 ÷ 120 × 60 = 30.', 'The leg takes 30 minutes.'] },
    { title: 'Drift', steps: ['You hold heading 090 but your path over the ground is 095.', 'Track differs from heading by 5°.', 'You are drifting 5° to the right: the wind is from the left.'] },
  ],
  practice: [
    num('A leg is 60 NM and groundspeed is 120 kt. Leg time in minutes?', 30, 0.2, 'min', '60 ÷ 120 × 60 = 30 min.'),
    mcq('Heading is:', ['The direction the nose points', 'The path over the ground', 'The direction of the wind', 'The distance to the destination'], 'Track is the path over the ground.'),
    mcq('Navigating by comparing ground features with the chart is called:', ['Pilotage', 'Dead reckoning', 'Radio navigation', 'Celestial navigation'], 'It relies on visual reference.'),
    num('You hold heading 090 and your track is 095. Drift in degrees?', 5, 0.1, '°', '095 − 090 = 5° right.'),
    tf('In a crosswind, heading and track are the same.', false, 'The wind makes them differ by the drift angle.'),
  ],
  assessment: [
    mcq('Track is:', ['The direction of the path over the ground', 'The direction the nose points', 'The direction to magnetic north', 'The speed over the ground'], 'It is what matters for reaching the destination.'),
    num('A leg is 45 NM and groundspeed is 90 kt. Leg time in minutes?', 30, 0.2, 'min', '45 ÷ 90 × 60 = 30 min.'),
    num('A leg is 40 NM and groundspeed is 100 kt. Leg time in minutes?', 24, 0.2, 'min', '40 ÷ 100 × 60 = 24 min.'),
    mcq('Calculating position from heading, speed and elapsed time is called:', ['Dead reckoning', 'Pilotage', 'Triangulation by radar', 'Map reading'], 'It is confirmed by visual fixes.'),
    mcq('The angle between heading and track is:', ['Drift', 'Variation', 'Deviation', 'Dip'], 'It is caused by the wind.'),
    mcq('To hold a track in a wind from the left, the pilot points the nose:', ['Slightly to the left, into the wind', 'Slightly to the right, away from the wind', 'Exactly along the track', 'Straight up'], 'The correction cancels the drift.'),
    tf('One minute of latitude on a chart represents one nautical mile.', true, 'The latitude scale can be used to measure distance.'),
  ],
  missionId: 'm-ppl-nav', sources: ['phak'],
});

export const commsIntro = lesson('Communication fundamentals', {
  id: 'ppl-communication-fundamentals', title: 'Communication Fundamentals', minutes: 10, level: 1, prereqs: ['ppl-aviation-terminology'],
  objectives: ['Structure a basic radio call.', 'Use standard words correctly.', 'Explain the purpose of a readback.', 'State the emergency transponder codes and the emergency frequency.'],
  intro: 'On the radio, clarity matters more than speed and far more than sounding expert. A short, standard call is understood the first time.',
  simple: 'Listen first. Then say who you are calling, who you are, where you are and what you want. Use the standard words, and repeat important instructions back so the controller knows you heard them correctly.',
  sections: [
    { h: 'Before you speak', body: [
      'Listen before transmitting, so that you do not talk over someone else. Know what you are going to say. Press the transmit button, pause, speak at an even pace, then release.',
    ] },
    { h: 'Shape of a call', body: [
      'A first call normally gives: the station you are calling, your call sign, your position and altitude, and your request or intention.',
      'Important instructions, such as runway, altimeter setting, heading, level and clearances, are **read back** so that any error can be caught.',
    ] },
    { h: 'Standard words', body: [
      '**Affirm** means yes. **Negative** means no. **Roger** means "I have received your message"; it does not mean yes. **Wilco** means "I will comply". **Say again** asks for a repeat. **Standby** means wait. **Unable** means you cannot comply.',
    ], lab: 'explore:radio-words' },
    { h: 'When things go wrong', body: [
      'The international emergency frequency is **121.5 MHz**. Transponder code **7700** indicates an emergency, **7600** a radio failure and **7500** unlawful interference.',
      'If you do not understand an instruction or cannot follow it, say so. Guessing is the dangerous choice.',
    ], note: 'Phraseology differs in detail between states. Learn the phraseology published by your own authority; this lesson gives the common core.' },
  ],
  examples: [
    { title: 'A first call', steps: ['Who you are calling: "Westfield Tower,"', 'Who you are: "Golf Bravo Kilo Tango Delta,"', 'Where and what: "10 miles south, 2,000 feet, inbound for landing."'] },
    { title: 'A readback', steps: ['Controller: "Golf Tango Delta, runway two seven, QNH one zero one two."', 'You repeat the key items.', '"Runway two seven, QNH one zero one two, Golf Tango Delta."'] },
  ],
  practice: [
    mcq('"Affirm" means:', ['Yes', 'No', 'Wait', 'Repeat'], 'It replaces the word "yes".'),
    mcq('Before transmitting you should first:', ['Listen to make sure the frequency is clear', 'Press the button and wait', 'Change frequency', 'Turn the radio off and on'], 'Avoid transmitting over another station.'),
    mcq('"Say again" means:', ['Repeat your message', 'I agree', 'Goodbye', 'I will comply'], 'Use it whenever you are unsure.'),
    num('Which transponder code indicates a radio failure?', 7600, 0.1, '', '7600: radio failure.'),
    tf('"Roger" means "yes, I will do that".', false, 'It only means the message was received. "Wilco" means "I will comply".'),
  ],
  assessment: [
    mcq('"Wilco" means:', ['I understand and will comply', 'I have received your message only', 'No', 'Say again'], 'Short for "will comply".'),
    mcq('"Roger" means:', ['I have received your message', 'Yes', 'I will comply', 'Stand by'], 'It does not signal agreement.'),
    mcq('The purpose of a readback is to:', ['Let the controller confirm you heard the instruction correctly', 'Fill silence on the frequency', 'Practise your accent', 'Identify the aircraft type'], 'Errors are caught before they matter.'),
    num('Which transponder code indicates an emergency?', 7700, 0.1, '', '7700: emergency.'),
    num('What is the international emergency frequency in MHz?', 121.5, 0.01, 'MHz', '121.5 MHz is monitored for distress calls.'),
    mcq('If you cannot comply with an instruction, you should say:', ['Unable', 'Roger', 'Affirm', 'Wilco'], 'Then explain or ask for an alternative.'),
    mcq('A first call normally begins with:', ['The name of the station you are calling', 'Your request', 'The weather', 'Your telephone number'], 'Then your own call sign.'),
  ],
  missionId: 'm-ppl-comms', sources: ['icao-9432', 'icao-4444'],
});

export const planningIntro = lesson('Flight planning', {
  id: 'ppl-introduction-to-flight-planning', title: 'Introduction to Flight Planning', minutes: 11, level: 2, prereqs: ['ppl-basic-navigation', 'ppl-basic-meteorology'],
  objectives: ['List the main steps of planning a visual flight.', 'Explain the purpose of weather briefings and NOTAMs.', 'Calculate the fuel required for a simple flight.', 'Explain why an alternate is planned.'],
  intro: 'A good flight is mostly decided before the engine starts. Planning turns unknowns into numbers: how far, how long, how much fuel, and what to do if the day does not go to plan.',
  simple: 'Check the weather and the notices for your route. Draw the route and measure it. Work out the time and the fuel, with some to spare. Check the aircraft is not too heavy and is balanced. Have a second airfield in mind.',
  sections: [
    { h: 'The steps', body: [
      '1. **Weather**: forecasts and reports for departure, route and destination. 2. **NOTAMs**: notices of closed runways, airspace restrictions and other changes. 3. **Route**: track, distance, safe altitudes and airspace. 4. **Performance**: take-off and landing distances for the day. 5. **Mass and balance**. 6. **Fuel**. 7. **Alternates** and what to do if you cannot continue.',
      'The results are written on a **navigation log**: for each leg, the track, heading, distance, groundspeed and time.',
    ] },
    { h: 'Fuel', body: [
      '`fuel required = fuel flow × flight time + reserve`.',
      'A 1.5-hour flight at 30 L/h needs 45 L for the trip. With a 20 L reserve the minimum is 65 L. Fuel for start-up, taxi and any diversion is added on top.',
    ], formula: 'fuel-required', lab: 'formula:fuel-required' },
    { h: 'Alternates and decisions', body: [
      'An **alternate** aerodrome is planned in case the destination becomes unusable. Planning it on the ground means the decision in the air is quick and already fuelled for.',
      'Set personal limits before departure, such as minimum cloud base, visibility and maximum crosswind, and keep to them.',
    ], note: 'The fuel figures are invented for practice. The minimum fuel reserves, the weather minima and the documents you must carry are set by the regulations that apply to your flight.' },
  ],
  examples: [
    { title: 'Fuel required', steps: ['Flight time 2 h, fuel flow 28 L/h, reserve 20 L.', 'Trip fuel = 2 × 28 = 56 L.', 'Minimum fuel = 56 + 20 = 76 L.'] },
    { title: 'A NOTAM changes the plan', steps: ['A NOTAM says the destination runway is closed until 1500 UTC.', 'Your planned arrival is 1430 UTC.', 'Delay the departure or plan to another aerodrome.'] },
  ],
  practice: [
    num('Flight time 2 h, fuel flow 28 L/h, reserve 20 L. Minimum fuel required?', 76, 0.2, 'L', '2 × 28 + 20 = 76 L.'),
    mcq('A NOTAM is:', ['A notice about changes or hazards affecting flight', 'A type of weather forecast', 'A radio frequency', 'A pilot licence'], 'For example a closed runway or restricted airspace.'),
    mcq('A navigation log records, for each leg:', ['Track, heading, distance, groundspeed and time', 'The passengers\' names', 'The aircraft colour', 'The engine serial number'], 'It is the plan you fly and check against.'),
    mcq('Mass and balance is checked to ensure the aircraft is:', ['Within its weight and centre-of-gravity limits', 'Clean', 'Insured', 'Painted correctly'], 'Both affect performance and controllability.'),
    tf('Planning an alternate aerodrome is only necessary for airline flights.', false, 'Any flight may find its destination unusable.'),
  ],
  assessment: [
    num('Flight time 1.5 h, fuel flow 30 L/h, reserve 20 L. Minimum fuel required?', 65, 0.2, 'L', '1.5 × 30 + 20 = 65 L.'),
    num('Flight time 2.5 h, fuel flow 36 L/h, reserve 27 L. Minimum fuel required?', 117, 0.2, 'L', '2.5 × 36 + 27 = 117 L.'),
    mcq('NOTAMs are checked before flight to learn about:', ['Closed runways, airspace restrictions and other changes', 'The price of fuel', 'The pilot\'s medical', 'Engine oil grade'], 'They can make a planned route or aerodrome unusable.'),
    mcq('An alternate aerodrome is planned:', ['In case the destination becomes unusable', 'To log more hours', 'To avoid paying landing fees', 'Only at night'], 'It keeps a safe option available.'),
    mcq('Which of these is part of pre-flight planning?', ['Calculating take-off and landing performance for the day', 'Choosing the cabin music', 'Repainting the aircraft', 'Changing the registration'], 'Performance depends on weight, wind, temperature and runway.'),
    tf('Personal weather limits should be decided before departure, not in the air.', true, 'Decisions made in advance are less affected by pressure.'),
    mcq('The first thing to check when planning a visual flight is usually:', ['The weather', 'The catering', 'The paint scheme', 'The logbook cover'], 'It decides whether the flight is possible at all.'),
  ],
  missionId: 'm-ppl-planning', sources: ['phak'],
});
