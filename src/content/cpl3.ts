// CPL — Aircraft Performance and Limitations (4 lessons).
// Each lesson opens with a short prerequisite review, as stated in the track note.
import { lesson, mcq, num, tf } from './q';

export const takeoffPerf = lesson('Performance', {
  id: 'cpl-take-off-performance', title: 'Take-off Performance', minutes: 14, level: 3, prereqs: ['ppl-take-off-and-landing-performance'],
  objectives: ['Define the declared distances of a runway.', 'Define V1, VR and V2.', 'Explain the balanced field concept.', 'List the factors that limit take-off mass.'],
  intro: 'Prerequisite review: take-off distance grows with weight, density altitude, tailwind, slope and a soft surface, and is measured to a screen height. Commercial operations add a harder question: what if an engine fails during the take-off run, at the worst possible moment?',
  simple: 'A runway has several published lengths, depending on whether you are stopping or going. On a multi-engine aircraft there is a decision speed: below it you stop if an engine fails; above it you continue. The take-off is planned so that either choice works.',
  sections: [
    { h: 'Declared distances', body: [
      '**TORA**, take-off run available: the runway length suitable for the ground run.',
      '**TODA**, take-off distance available: TORA plus any **clearway**, an obstacle-free area beyond the runway over which the aircraft may climb.',
      '**ASDA**, accelerate-stop distance available: TORA plus any **stopway**, an area beyond the runway where the aircraft can be stopped.',
      '**LDA**, landing distance available.',
    ], formula: 'declared-toda', lab: 'formula:declared-toda' },
    { h: 'Take-off speeds', body: [
      '**V1** is the **decision speed**: if an engine failure is recognised before V1 the take-off is rejected; after V1 it is continued.',
      '**VR** is the **rotation speed**, at which the pilot begins to raise the nose.',
      '**V2** is the **take-off safety speed**, reached by the screen height with one engine inoperative, giving a safe margin above the stall and minimum control speeds.',
    ] },
    { h: 'Balanced field', body: [
      'For each mass there is a V1 at which the distance to continue with an engine failed equals the distance to stop. The take-off is then **balanced**, and the field length required is the least for that mass.',
      'The screen height at the end of the take-off distance is **35 ft** for large transport aeroplanes and **50 ft** for small ones.',
    ] },
    { h: 'What limits the mass', body: [
      'The take-off mass may be limited by the **field length**, by the required **climb gradient** with an engine inoperative, by **obstacle clearance** on the departure path, by tyre speed or brake energy, or by the **structural** maximum. The lowest of these applies.',
      'A wet or contaminated runway lengthens the stop and reduces the permitted mass.',
    ], note: 'Certification rules and operating regulations set the precise definitions and margins, and they differ between aircraft classes. This lesson gives the concepts; the aircraft flight manual gives the figures.' },
  ],
  examples: [
    { title: 'Declared distances', steps: ['TORA is 2,000 m, with a 300 m clearway and a 100 m stopway.', 'TODA = 2,000 + 300 = 2,300 m.', 'ASDA = 2,000 + 100 = 2,100 m.'] },
    { title: 'Stop or go', steps: ['V1 is 120 kt. An engine fails at 110 kt.', 'The failure is recognised below V1.', 'Reject the take-off.'] },
  ],
  practice: [
    num('TORA is 2,000 m and the clearway is 300 m. TODA?', 2300, 1, 'm', '2,000 + 300 = 2,300 m.'),
    num('TORA is 2,000 m and the stopway is 100 m. ASDA?', 2100, 1, 'm', '2,000 + 100 = 2,100 m.'),
    mcq('V1 is the:', ['Decision speed', 'Rotation speed', 'Take-off safety speed', 'Stall speed'], 'Below it, stop; above it, go.'),
    mcq('A clearway is:', ['An obstacle-free area beyond the runway over which the aircraft may climb', 'An area for stopping', 'A taxiway', 'A parking area'], 'It adds to TODA, not to TORA.'),
    tf('A stopway may be counted as part of the take-off run available.', false, 'It counts only towards the accelerate-stop distance available.'),
  ],
  assessment: [
    num('TORA is 1,800 m and the clearway is 200 m. TODA?', 2000, 1, 'm', '1,800 + 200 = 2,000 m.'),
    num('TORA is 1,800 m and the stopway is 150 m. ASDA?', 1950, 1, 'm', '1,800 + 150 = 1,950 m.'),
    mcq('If an engine failure is recognised after V1, the pilot should:', ['Continue the take-off', 'Reject the take-off', 'Reduce power on the live engine', 'Turn back'], 'There may not be enough runway left to stop.'),
    mcq('V2 is the:', ['Take-off safety speed', 'Decision speed', 'Rotation speed', 'Maximum tyre speed'], 'Flown after lift-off with one engine inoperative.'),
    mcq('In a balanced field take-off:', ['The distance to continue equals the distance to stop', 'TORA equals LDA', 'V1 equals V2', 'The runway is level'], 'For an engine failure recognised at V1.'),
    num('What is the screen height, in feet, at the end of the take-off distance for large transport aeroplanes?', 35, 0.5, 'ft', '35 ft; 50 ft for small aeroplanes.'),
    mcq('The permitted take-off mass is:', ['The lowest of the field, climb, obstacle and structural limits', 'Always the structural maximum', 'The highest of all the limits', 'Chosen by the passengers'], 'Every limit must be met at once.'),
  ],
  missionId: 'm-cpl-takeoff', sources: ['phak'],
});

export const climbCruise = lesson('Performance', {
  id: 'cpl-climb-and-cruise-performance', title: 'Climb and Cruise Performance', minutes: 13, level: 3, prereqs: ['phys-power-in-depth', 'cpl-lift-and-drag-polars'],
  objectives: ['Calculate climb gradient from thrust, drag and weight.', 'Relate climb gradient and groundspeed to rate of climb.', 'Define absolute and service ceiling.', 'Calculate specific range.'],
  intro: 'Prerequisite review: rate of climb comes from excess power, and best range and endurance speeds are set by the drag curve. Commercial flight planning turns these into numbers: a gradient to clear an obstacle, a ceiling for the day\'s weight, and nautical miles for each kilogram of fuel.',
  simple: 'How steeply an aircraft climbs depends on how much thrust is left over after drag, compared with its weight. How fast it climbs depends on spare power. As it gets higher both run out, and that height is its ceiling. In cruise, what matters is distance covered per unit of fuel.',
  sections: [
    { h: 'Angle and gradient', body: [
      'The climb **gradient** depends on excess thrust: `gradient % = (thrust − drag) ÷ weight × 100`. With 6,000 N of thrust, 4,000 N of drag and a weight of 40,000 N, it is 5%.',
      'The best **angle** of climb speed, V_X, is where excess thrust is greatest. The best **rate** of climb speed, V_Y, is where excess power is greatest.',
    ], formula: 'climb-gradient', lab: 'formula:climb-gradient' },
    { h: 'Gradient and rate', body: [
      'A useful approximation: `rate of climb (ft/min) ≈ gradient % × groundspeed (kt)`. A 5% gradient at 120 kt is about 600 ft/min.',
      'A headwind steepens the climb angle over the ground; it does not change the rate of climb.',
    ] },
    { h: 'Ceilings', body: [
      'Excess thrust and power fall with altitude. At the **absolute ceiling** the rate of climb is zero. The **service ceiling** is the altitude at which the maximum rate of climb has fallen to **100 ft/min**.',
      'Ceilings are lower at higher weights and temperatures.',
    ] },
    { h: 'Cruise', body: [
      '**Specific range** is distance per unit of fuel: `specific range = true airspeed ÷ fuel flow`. At 150 kt and 50 kg/h it is 3 NM/kg.',
      'Range is improved by flying at the correct speed and altitude; in a headwind the best-range speed is a little higher, in a tailwind a little lower.',
    ], note: 'The gradient-times-groundspeed rule slightly underestimates (the exact factor is about 1.01). Performance figures for planning come from the aircraft flight manual.' },
  ],
  examples: [
    { title: 'Climb gradient', steps: ['Thrust 9,000 N, drag 6,000 N, weight 50,000 N.', '(9,000 − 6,000) ÷ 50,000 = 0.06.', 'Gradient = 6%.'] },
    { title: 'Specific range', steps: ['TAS 180 kt, fuel flow 90 kg/h.', '180 ÷ 90.', 'Specific range = 2 NM/kg.'] },
  ],
  practice: [
    num('Thrust 9,000 N, drag 6,000 N, weight 50,000 N. Climb gradient in percent?', 6, 0.05, '%', '3,000 ÷ 50,000 × 100 = 6%.'),
    num('TAS 180 kt, fuel flow 90 kg/h. Specific range in NM per kg?', 2, 0.01, 'NM/kg', '180 ÷ 90 = 2 NM/kg.'),
    mcq('The best angle of climb speed is where:', ['Excess thrust is greatest', 'Excess power is greatest', 'Drag is greatest', 'Fuel flow is greatest'], 'This speed is called V_X.'),
    mcq('At the absolute ceiling, the rate of climb is:', ['Zero', '100 ft/min', '500 ft/min', '1,000 ft/min'], 'No excess power remains.'),
    tf('A headwind increases the rate of climb.', false, 'It steepens the angle over the ground but does not change the rate.'),
  ],
  assessment: [
    num('Thrust 6,000 N, drag 4,000 N, weight 40,000 N. Climb gradient in percent?', 5, 0.05, '%', '2,000 ÷ 40,000 × 100 = 5%.'),
    num('Thrust 20,000 N, drag 14,000 N, weight 60,000 N. Climb gradient in percent?', 10, 0.05, '%', '6,000 ÷ 60,000 × 100 = 10%.'),
    num('Climb gradient 5% at a groundspeed of 120 kt. Approximate rate of climb (gradient × groundspeed)?', 600, 10, 'ft/min', '5 × 120 = 600 ft/min.'),
    num('At the service ceiling, what is the maximum rate of climb in ft/min?', 100, 1, 'ft/min', 'The service ceiling is defined at 100 ft/min.'),
    num('TAS 150 kt, fuel flow 50 kg/h. Specific range in NM per kg?', 3, 0.01, 'NM/kg', '150 ÷ 50 = 3 NM/kg.'),
    mcq('The best rate of climb speed is where:', ['Excess power is greatest', 'Excess thrust is greatest', 'Lift is greatest', 'Weight is least'], 'This speed is called V_Y.'),
    mcq('An increase in aircraft weight makes the service ceiling:', ['Lower', 'Higher', 'Unchanged', 'Unlimited'], 'More power is required, leaving less excess.'),
  ],
  missionId: 'm-cpl-climb', sources: ['phak'],
});

export const landingPerf = lesson('Performance', {
  id: 'cpl-landing-performance', title: 'Landing Performance', minutes: 13, level: 3, prereqs: ['ppl-take-off-and-landing-performance'],
  objectives: ['Calculate a reference landing speed.', 'List the factors that increase landing distance.', 'Estimate dynamic hydroplaning speed.', 'Apply a landing distance factor to the distance available.'],
  intro: 'Prerequisite review: landing distance is measured from 50 ft over the threshold to a stop, and grows with weight, speed, tailwind, downslope and a wet surface. Commercial rules require a large margin on top, and wet runways introduce a hazard of their own.',
  simple: 'Cross the threshold at the right speed and height, because every extra knot and every extra foot adds runway. On a wet runway the tyres can ride up on the water and lose their grip. Commercial flights are planned to stop well within the runway available.',
  sections: [
    { h: 'Reference speed', body: [
      'The approach is flown to cross the threshold at about 50 ft at the **reference landing speed**. For light aeroplanes this is commonly `V_REF = 1.3 × V_S0`, the stall speed in the landing configuration.',
      'With a stall speed of 50 kt, V_REF is 65 kt. Excess speed over the threshold lengthens the landing considerably.',
    ] },
    { h: 'What makes it longer', body: [
      'Higher **mass**, higher **density altitude**, a **tailwind**, a **downhill slope**, a **wet or contaminated** surface, excess **speed or height** at the threshold, and a long flare all increase landing distance.',
    ] },
    { h: 'Hydroplaning', body: [
      'On standing water a tyre can lift onto a film of water and lose braking and steering: **dynamic hydroplaning**. A widely used estimate of the speed at which it begins is `9 × √(tyre pressure in psi)` knots.',
      'For a tyre at 36 psi, about 54 kt. Once started, hydroplaning can continue to a lower speed.',
      'Touch down firmly at the correct speed, lower the nose wheel promptly and brake smoothly.',
    ], formula: 'hydroplane', lab: 'formula:hydroplane' },
    { h: 'Margins', body: [
      'Commercial air transport rules require that the landing can be completed within a fraction of the landing distance available: commonly **60%** for turbojets and **70%** for turboprops, with a further allowance, typically 15%, on a wet runway.',
      'On a 2,000 m runway, a jet must be able to stop within 1,200 m of the threshold.',
    ], note: 'The landing distance fractions and the hydroplaning estimate are quoted from memory of standard references and were not checked against the current regulations. Use the factors required by your operator and authority.' },
  ],
  examples: [
    { title: 'Reference speed', steps: ['Stall speed in the landing configuration is 60 kt.', '1.3 × 60.', 'V_REF = 78 kt.'] },
    { title: 'Hydroplaning speed', steps: ['Tyre pressure is 64 psi.', '√64 = 8; 9 × 8.', 'Hydroplaning may begin at about 72 kt.'] },
  ],
  practice: [
    num('Stall speed in the landing configuration is 60 kt. V_REF at 1.3 × V_S0?', 78, 0.2, 'kt', '1.3 × 60 = 78 kt.'),
    num('Tyre pressure is 64 psi. Estimated dynamic hydroplaning speed (9 × √pressure)?', 72, 0.5, 'kt', '9 × 8 = 72 kt.'),
    mcq('Which of these increases landing distance?', ['A tailwind', 'A headwind', 'A lower mass', 'An uphill slope'], 'Groundspeed at touchdown is higher.'),
    mcq('Dynamic hydroplaning occurs when:', ['The tyre rides on a film of standing water', 'The brakes overheat', 'The runway is dry', 'The tyre pressure is too high for the aircraft'], 'Braking and steering are lost.'),
    tf('Crossing the threshold faster than the reference speed shortens the landing distance.', false, 'It lengthens it considerably.'),
  ],
  assessment: [
    num('Stall speed in the landing configuration is 50 kt. V_REF at 1.3 × V_S0?', 65, 0.2, 'kt', '1.3 × 50 = 65 kt.'),
    num('Stall speed in the landing configuration is 100 kt. V_REF at 1.3 × V_S0?', 130, 0.2, 'kt', '1.3 × 100 = 130 kt.'),
    num('Tyre pressure is 36 psi. Estimated dynamic hydroplaning speed (9 × √pressure)?', 54, 0.5, 'kt', '9 × 6 = 54 kt.'),
    num('Tyre pressure is 100 psi. Estimated dynamic hydroplaning speed (9 × √pressure)?', 90, 0.5, 'kt', '9 × 10 = 90 kt.'),
    num('Landing distance available is 2,000 m. A jet must be able to land within 60% of it. Distance?', 1200, 1, 'm', '2,000 × 0.6 = 1,200 m.'),
    mcq('A downhill runway slope makes the landing distance:', ['Longer', 'Shorter', 'Unchanged', 'Zero'], 'Gravity opposes the braking.'),
    mcq('On a wet runway, the recommended technique is to:', ['Touch down firmly at the correct speed and brake smoothly', 'Hold the aircraft off as long as possible', 'Approach faster than normal', 'Avoid using the brakes at all'], 'A firm touchdown breaks through the water film.'),
  ],
  missionId: 'm-cpl-landing', sources: ['phak', 'afh'],
});

export const perfLimits = lesson('Performance', {
  id: 'cpl-performance-limitations', title: 'Performance Limitations', minutes: 13, level: 3, prereqs: ['cpl-take-off-performance', 'ppl-airframe-and-landing-gear'],
  objectives: ['Define the structural mass limits.', 'Calculate traffic load and maximum fuel from mass limits.', 'Read the main features of a V-n diagram.', 'Calculate manoeuvring speed at reduced mass.'],
  intro: 'Prerequisite review: an airframe is certified to a limit load factor, and the permitted take-off mass is the lowest of several limits. A commercial pilot works inside an envelope of masses and speeds, and must know which edge of it is closest today.',
  simple: 'An aircraft has maximum weights for take-off, for landing, and with empty fuel tanks. It also has speeds beyond which rough handling or rough air could damage it. One of those speeds gets lower when the aircraft is lighter.',
  sections: [
    { h: 'Structural mass limits', body: [
      '**Maximum take-off mass** (MTOM): the greatest mass at the start of the take-off run.',
      '**Maximum landing mass** (MLM): the greatest mass at touchdown, limited by the landing gear and structure.',
      '**Maximum zero fuel mass** (MZFM): the greatest mass without usable fuel. Fuel in the wings relieves wing bending, so mass above this limit must be fuel.',
    ] },
    { h: 'Using them', body: [
      'The **operating mass** is the aircraft ready to fly but without traffic load or fuel. **Traffic load** is passengers, baggage and cargo: `maximum traffic load = MZFM − operating mass`.',
      'The fuel that may be carried at take-off is limited by `MTOM − actual zero fuel mass`. The landing mass must also be within MLM after the trip fuel is burned.',
      'The **regulated take-off mass** is the lowest of the structural limit and the performance limits for the day.',
    ] },
    { h: 'The V-n diagram', body: [
      'The **V-n diagram** plots load factor against speed. Its left edge is the stall line; its top and bottom are the positive and negative **limit load factors**; its right edge is the maximum speed.',
      '**V_A**, the design manoeuvring speed, is where the stall line meets the limit load factor. Below V_A the wing stalls before the limit is exceeded; above it, full control deflection can overstress the aircraft.',
      '**V_NO** is the maximum structural cruising speed; **V_NE** is never exceeded.',
    ] },
    { h: 'V_A and mass', body: [
      'A lighter aircraft reaches the limit load factor at a lower speed, so V_A **decreases** as mass decreases: `V_A(new) = V_A × √(new mass ÷ maximum mass)`.',
      'With V_A of 120 kt at 1,000 kg, at 810 kg it is 108 kt.',
    ], formula: 'va-mass', lab: 'formula:va-mass', note: 'V_A protects against a single full control input in one axis in smooth air. It does not guarantee protection against repeated or combined inputs or severe turbulence. Use the speeds published in the flight manual.' },
  ],
  examples: [
    { title: 'Traffic load', steps: ['MZFM is 1,800 kg and operating mass is 1,350 kg.', '1,800 − 1,350.', 'Maximum traffic load = 450 kg.'] },
    { title: 'V_A at reduced mass', steps: ['V_A is 110 kt at 1,100 kg. Actual mass is 891 kg.', '891 ÷ 1,100 = 0.81; √0.81 = 0.9.', 'V_A = 110 × 0.9 = 99 kt.'] },
  ],
  practice: [
    num('MZFM is 1,800 kg and operating mass is 1,350 kg. Maximum traffic load?', 450, 1, 'kg', '1,800 − 1,350 = 450 kg.'),
    num('V_A is 110 kt at 1,100 kg. V_A at 891 kg?', 99, 0.3, 'kt', '110 × √0.81 = 99 kt.'),
    mcq('Maximum zero fuel mass is the greatest mass:', ['Without usable fuel', 'At take-off', 'At landing', 'With full tanks'], 'Any mass above it must be fuel.'),
    mcq('V_NE is the speed that:', ['Must never be exceeded', 'Is best for climb', 'Is used for landing', 'Gives best range'], 'The right-hand edge of the envelope.'),
    tf('The design manoeuvring speed increases as the aircraft gets lighter.', false, 'It decreases with the square root of the mass ratio.'),
  ],
  assessment: [
    num('V_A is 120 kt at 1,000 kg. V_A at 810 kg?', 108, 0.3, 'kt', '120 × √0.81 = 108 kt.'),
    num('V_A is 100 kt at 1,200 kg. V_A at 972 kg?', 90, 0.3, 'kt', '100 × √0.81 = 90 kt.'),
    num('MTOM is 2,000 kg and the actual zero fuel mass is 1,600 kg. Maximum fuel at take-off?', 400, 1, 'kg', '2,000 − 1,600 = 400 kg.'),
    mcq('The maximum zero fuel mass limit exists mainly to protect against:', ['Excessive wing bending', 'Tyre wear', 'Engine overheating', 'Low fuel pressure'], 'Fuel in the wings relieves the bending load.'),
    mcq('Maximum landing mass is limited mainly by:', ['The landing gear and structure', 'The fuel tank capacity', 'The number of seats', 'The radio equipment'], 'Touchdown loads increase with mass.'),
    mcq('Below V_A, a full and abrupt control input will:', ['Stall the wing before the limit load factor is exceeded', 'Always break the aircraft', 'Have no effect', 'Increase V_NE'], 'The stall acts as a load limiter.'),
    mcq('The regulated take-off mass is:', ['The lowest of the structural and performance limits', 'Always the maximum take-off mass', 'The highest of the limits', 'The landing mass'], 'Every limit must be respected.'),
  ],
  missionId: 'm-cpl-limits', sources: ['phak'],
});
