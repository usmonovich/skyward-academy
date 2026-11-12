// PPL Phase B — Principles of Flight (3 lessons) and Aircraft General Knowledge (5 lessons).
import { lesson, mcq, num, tf } from './q';

export const polar = lesson('Principles of flight', {
  id: 'ppl-drag-and-the-polar-curve', title: 'Drag and the Polar Curve', minutes: 11, level: 2, prereqs: ['phys-drag', 'ppl-basic-aerodynamics'],
  objectives: ['Define the lift-to-drag ratio.', 'Explain the significance of the best lift-to-drag speed.', 'Calculate still-air glide distance.', 'Describe the effect of weight, wind and configuration on the glide.'],
  intro: 'If the engine stops, how far can you go? The answer is one number, the lift-to-drag ratio, and one speed, the one that gives the best value of it.',
  simple: 'Every aircraft has a speed at which it makes the most lift for the least drag. Glide at that speed and you go furthest. Fly faster or slower and you come down sooner.',
  sections: [
    { h: 'Lift-to-drag ratio', body: [
      'The **lift-to-drag ratio** (L/D) compares the lift a wing makes with the drag that comes with it. If lift is 9,000 N and drag is 1,000 N, L/D is 9.',
      'Plotting lift coefficient against drag coefficient for every angle of attack gives the **polar curve**. The point on it with the highest L/D corresponds to one particular angle of attack and, for a given weight, one airspeed.',
    ] },
    { h: 'Best glide', body: [
      'The speed for maximum L/D is also the speed of **minimum total drag** and the **best glide speed**. In still air, `glide distance = height × L/D`.',
      'From 3,000 ft above the ground with L/D of 9, the aircraft can glide 27,000 ft, about 4.4 NM.',
      'Flying slower than this speed increases induced drag; flying faster increases parasite drag. Either way the glide is steeper.',
    ], formula: 'glide', lab: 'formula:glide' },
    { h: 'What changes the glide', body: [
      '**Weight** does not change the best glide ratio or the still-air distance, but a heavier aircraft achieves it at a higher speed and reaches the ground sooner.',
      '**Wind** changes the distance over the ground: a headwind shortens it, a tailwind lengthens it.',
      'Extending **flaps** or **landing gear**, or leaving a propeller windmilling, adds drag and reduces L/D.',
    ], note: 'The best glide speed for each aircraft is given in its flight manual, usually for maximum weight. Use that figure, not an estimate.' },
  ],
  examples: [
    { title: 'Glide distance', steps: ['Height is 2,000 ft above the ground and L/D is 10.', '2,000 × 10 = 20,000 ft.', 'About 3.3 NM in still air.'] },
    { title: 'Choosing a field', steps: ['The engine fails with a headwind on the nose.', 'Ground distance will be less than the still-air figure.', 'Prefer a field closer in, or one downwind.'] },
  ],
  practice: [
    num('Height is 2,000 ft and the lift-to-drag ratio is 10. Still-air glide distance in feet?', 20000, 50, 'ft', '2,000 × 10 = 20,000 ft.'),
    num('Lift is 8,000 N and drag is 800 N. Lift-to-drag ratio?', 10, 0.05, '', '8,000 ÷ 800 = 10.'),
    mcq('The best glide speed is the speed for:', ['Maximum lift-to-drag ratio', 'Maximum lift', 'Minimum lift', 'Maximum drag'], 'It is also the minimum-drag speed.'),
    mcq('A tailwind makes the glide distance over the ground:', ['Longer', 'Shorter', 'Unchanged', 'Zero'], 'The air mass carries the aircraft along.'),
    tf('Gliding faster than the best glide speed increases the distance covered in still air.', false, 'Parasite drag rises and the glide becomes steeper.'),
  ],
  assessment: [
    num('Lift is 9,000 N and drag is 1,000 N. Lift-to-drag ratio?', 9, 0.05, '', '9,000 ÷ 1,000 = 9.'),
    num('Height is 3,000 ft and the lift-to-drag ratio is 9. Still-air glide distance in feet?', 27000, 50, 'ft', '3,000 × 9 = 27,000 ft.'),
    mcq('The speed for maximum lift-to-drag ratio is also the speed for:', ['Minimum total drag', 'Maximum total drag', 'The stall', 'Maximum level speed'], 'Lift equals weight, so the best ratio means the least drag.'),
    mcq('A heavier aircraft, compared with a lighter one of the same type, glides in still air:', ['The same distance, at a higher speed', 'A shorter distance, at the same speed', 'A longer distance, at a lower speed', 'Half the distance'], 'The best ratio is unchanged; the speed to achieve it rises.'),
    mcq('A headwind makes the glide distance over the ground:', ['Shorter', 'Longer', 'Unchanged', 'Double'], 'The aircraft spends the same time descending but covers less ground.'),
    tf('Extending flaps increases the lift-to-drag ratio.', false, 'Flaps add more drag than lift, reducing the ratio.'),
    mcq('Gliding slower than the best glide speed makes the glide steeper because:', ['Induced drag increases', 'Parasite drag increases', 'Weight increases', 'Lift disappears'], 'A higher angle of attack is needed at low speed.'),
  ],
  missionId: 'm-ppl-polar', sources: ['phak', 'afh'],
});

export const stalling = lesson('Principles of flight', {
  id: 'ppl-stalling-and-spinning', title: 'Stalling and Spinning', minutes: 12, level: 2, prereqs: ['ppl-drag-and-the-polar-curve'],
  objectives: ['Recognise the signs of an approaching stall.', 'List the factors that change stall speed.', 'Calculate stall speed in a turn.', 'Describe the conditions for a spin and the principles of recovery.'],
  intro: 'Loss of control in flight, most often a stall or spin at low height, remains a leading cause of fatal accidents in light aircraft. Every such accident began with the wing asking for more angle of attack than it could give.',
  simple: 'A stall is the wing giving up because it is tilted too steeply against the air. It can happen at higher speeds when turning or pulling up. A spin is a stall with a twist: one wing more stalled than the other. The cure for both starts with reducing the angle of attack.',
  sections: [
    { h: 'Approaching the stall', body: [
      'Warning signs: low and decreasing airspeed, a high nose attitude, sloppy controls, airframe buffet and the stall warning device.',
      'At the stall, lift falls, the nose usually drops and the aircraft sinks. Recovery always begins by **reducing the angle of attack**.',
    ] },
    { h: 'What changes stall speed', body: [
      'The stall always happens at the critical angle, but the speed at which that angle is reached varies. Stall speed **increases** with weight, load factor, ice or frost on the wing and a forward centre of gravity. It **decreases** with flaps extended and with engine power.',
      'In a level turn the wing must lift more than the weight: `stall speed in turn = stall speed × √(1 ÷ cos bank)`. At 60° of bank the load factor is 2 and stall speed rises by 41%.',
    ], formula: 'stall-bank', lab: 'formula:stall-bank' },
    { h: 'The spin', body: [
      'A **spin** needs two things: a stall, and yaw. One wing becomes more deeply stalled than the other, and the aircraft rotates downward in a steep spiral path at a low, roughly constant airspeed.',
      'A typical recovery, in the absence of a manufacturer\'s procedure, is remembered as **PARE**: **P**ower to idle, **A**ilerons neutral, full **R**udder opposite to the rotation, **E**levator forward to break the stall. When rotation stops, centralise the rudder and ease out of the dive.',
    ] },
    { h: 'Where it matters', body: [
      'The classic trap is a tightening, slow turn onto final approach with too much rudder: low speed, raised load factor, yaw, and no height to recover.',
    ], note: 'Spin recovery procedures differ between aircraft, and many are not approved for spinning. The procedure in the aircraft flight manual always takes priority. Stall and spin training is done only with a qualified instructor.' },
  ],
  examples: [
    { title: 'Stall speed in a turn', steps: ['Straight-and-level stall speed is 50 kt. Bank is 60°.', 'cos 60° = 0.5, so load factor = 2, and √2 = 1.414.', 'Stall speed = 50 × 1.414 ≈ 70.7 kt.'] },
    { title: 'Base-to-final turn', steps: ['A pilot overshoots the runway centreline and tightens the turn with rudder at low speed.', 'Load factor and stall speed rise while yaw is applied.', 'The conditions for a spin are present: go around instead.'] },
  ],
  practice: [
    num('Stall speed is 50 kt wings level. Stall speed in a level turn at 60° of bank?', 70.7, 0.5, 'kt', '50 × √2 ≈ 70.7 kt.'),
    mcq('Which of these is a sign of an approaching stall?', ['Airframe buffet and sloppy controls', 'Rising airspeed', 'A low nose attitude with high speed', 'Increasing engine noise'], 'Together with low airspeed and the stall warning.'),
    mcq('Extending flaps makes the stall speed:', ['Lower', 'Higher', 'Unchanged', 'Zero'], 'The wing produces more lift at a given speed.'),
    mcq('A spin requires:', ['A stall and yaw', 'High speed and low angle of attack', 'Full power only', 'Flaps fully down only'], 'One wing is more stalled than the other.'),
    tf('An aircraft can only stall at low airspeed.', false, 'With enough load factor it can stall at any speed.'),
  ],
  assessment: [
    num('Stall speed is 60 kt wings level. Stall speed at a load factor of 2?', 84.9, 0.5, 'kt', '60 × √2 ≈ 84.9 kt.'),
    num('Stall speed is 40 kt wings level. Stall speed in a level turn at 60° of bank?', 56.6, 0.5, 'kt', '40 × √2 ≈ 56.6 kt.'),
    mcq('The first action in recovering from a stall is to:', ['Reduce the angle of attack', 'Raise the nose', 'Apply full aileron', 'Extend full flap'], 'The wing must be unstalled before anything else works.'),
    mcq('Ice or frost on the wing makes the stall speed:', ['Higher', 'Lower', 'Unchanged', 'Irrelevant'], 'It spoils the airflow and adds weight.'),
    mcq('In the PARE spin recovery, R stands for:', ['Full rudder opposite to the direction of rotation', 'Reduce flap', 'Raise the nose', 'Radio call'], 'Opposite rudder stops the yaw.'),
    mcq('An increase in aircraft weight makes the stall speed:', ['Higher', 'Lower', 'Unchanged', 'Zero'], 'More lift is needed, so the critical angle is reached at a higher speed.'),
    tf('The spin recovery procedure in the aircraft flight manual takes priority over any general method.', true, 'Recovery characteristics differ between aircraft.'),
  ],
  missionId: 'm-ppl-stall', sources: ['afh', 'phak'],
});

export const propellers = lesson('Principles of flight', {
  id: 'ppl-propellers', title: 'Propellers', minutes: 11, level: 2, prereqs: ['phys-thrust', 'ppl-basic-aerodynamics'],
  objectives: ['Explain why a propeller blade is twisted.', 'Compare fixed-pitch and constant-speed propellers.', 'Calculate blade tip speed.', 'Describe the turning tendencies caused by a propeller.'],
  intro: 'A propeller is a rotating wing. It obeys the same aerodynamics as the wing that carries the aircraft, and it adds some forces of its own that the pilot must hold with rudder.',
  simple: 'Each propeller blade is a small wing that pulls forward instead of lifting up. The blade is twisted because its tip travels much faster than its root. A spinning propeller also tries to turn the aircraft, especially at high power and low speed.',
  sections: [
    { h: 'A twisted wing', body: [
      'Each blade is an aerofoil. As it turns, the tip travels a much larger circle than the root in the same time, so it moves faster. The blade is **twisted**, with a larger blade angle at the root and a smaller one at the tip, to keep a suitable angle of attack along its length.',
      '`tip speed = π × diameter × rpm ÷ 60`. A 2 m propeller at 2,400 rpm has a tip speed of about 251 m/s.',
    ], formula: 'prop-tip', lab: 'formula:prop-tip' },
    { h: 'Fixed pitch and constant speed', body: [
      'A **fixed-pitch** propeller has one blade angle, a compromise: efficient at only one combination of airspeed and rpm.',
      'A **constant-speed** propeller has a governor that changes the blade angle automatically to hold the rpm the pilot selects: fine pitch for take-off and climb, coarser pitch for cruise.',
    ] },
    { h: 'Turning tendencies', body: [
      'For a propeller turning clockwise as seen from the cockpit, four effects yaw or roll the aircraft to the **left**: **torque reaction**, the **spiralling slipstream** striking the fin, **asymmetric blade effect** (P-factor) at high angles of attack, and **gyroscopic precession** when the attitude changes.',
      'They are strongest at high power and low airspeed, as in take-off and climb, and are countered mainly with right rudder.',
    ], note: 'A propeller turning the other way produces the opposite tendencies. A propeller is dangerous on the ground: always treat it as live.' },
  ],
  examples: [
    { title: 'Tip speed', steps: ['Diameter 1.9 m at 2,400 rpm (40 revolutions per second).', 'π × 1.9 × 40.', 'Tip speed ≈ 238.8 m/s.'] },
    { title: 'Take-off roll', steps: ['Full power is applied with a clockwise-turning propeller.', 'The aircraft tends to swing left.', 'Apply right rudder to keep straight.'] },
  ],
  practice: [
    num('Propeller diameter 1.9 m at 2,400 rpm. Tip speed (π × D × rpm ÷ 60)?', 238.8, 1, 'm/s', 'π × 1.9 × 40 ≈ 238.8 m/s.'),
    mcq('A propeller blade is an example of:', ['An aerofoil', 'A spoiler', 'A flap', 'A trim tab'], 'It produces thrust the way a wing produces lift.'),
    mcq('A fixed-pitch propeller is most efficient:', ['At one combination of airspeed and rpm', 'At all speeds', 'Only when stationary', 'Only in a dive'], 'Its single blade angle is a compromise.'),
    mcq('Propeller turning tendencies are strongest at:', ['High power and low airspeed', 'Low power and high airspeed', 'Idle power in a glide', 'Engine shut down'], 'As in take-off and climb.'),
    tf('The tip of a propeller blade moves more slowly than the root.', false, 'It travels a larger circle in the same time, so it moves faster.'),
  ],
  assessment: [
    num('Propeller diameter 2 m at 2,400 rpm. Tip speed (π × D × rpm ÷ 60)?', 251.3, 1, 'm/s', 'π × 2 × 40 ≈ 251.3 m/s.'),
    num('Propeller diameter 1.8 m at 2,700 rpm. Tip speed (π × D × rpm ÷ 60)?', 254.5, 1, 'm/s', 'π × 1.8 × 45 ≈ 254.5 m/s.'),
    mcq('A propeller blade is twisted because:', ['The tip moves faster than the root', 'It is easier to manufacture', 'It reduces weight', 'It looks better'], 'The twist keeps a suitable angle of attack along the blade.'),
    mcq('A constant-speed propeller:', ['Changes blade angle automatically to hold the selected rpm', 'Has a single fixed blade angle', 'Always turns at the same speed as the wheels', 'Has no governor'], 'The governor adjusts the pitch.'),
    mcq('With a propeller turning clockwise as seen from the cockpit, on take-off the aircraft tends to yaw:', ['Left', 'Right', 'Neither way', 'Up'], 'Countered with right rudder.'),
    mcq('Asymmetric blade effect (P-factor) is greatest at:', ['High angle of attack and high power', 'Low angle of attack and low power', 'Zero airspeed with the engine off', 'High speed in a dive'], 'The down-going blade meets the air at a greater angle.'),
    tf('A fixed-pitch propeller is equally efficient at all airspeeds.', false, 'It is a compromise between climb and cruise.'),
  ],
  missionId: 'm-ppl-prop', sources: ['phak'],
});

export const airframe = lesson('Aircraft general knowledge', {
  id: 'ppl-airframe-and-landing-gear', title: 'Airframe and Landing Gear', minutes: 10, level: 2, prereqs: ['ppl-basic-aircraft-components'],
  objectives: ['Describe truss, monocoque and semi-monocoque construction.', 'Name the main structural members of a wing.', 'Explain limit load factor.', 'Describe the main parts of the landing gear.'],
  intro: 'The pre-flight inspection is a structural inspection. Knowing how the airframe carries its loads tells you which dents, cracks and loose rivets matter.',
  simple: 'Modern light aircraft are thin metal or composite shells stiffened by frames inside, like an egg carton. Wings are built around strong beams called spars. The structure is certified for a set maximum load, and the landing gear absorbs the shock of touching down.',
  sections: [
    { h: 'Fuselage construction', body: [
      'A **truss** fuselage is a framework of tubes carrying all the loads, covered with fabric or light skin. A **monocoque** carries the loads in the skin alone. A **semi-monocoque**, the usual modern form, shares the loads between the skin and an internal structure of frames (formers), bulkheads and lengthwise stringers.',
    ], lab: 'explore:airframe' },
    { h: 'The wing', body: [
      '**Spars** run from root to tip and carry most of the bending load. **Ribs** run from leading edge to trailing edge, give the aerofoil its shape and pass loads from the skin to the spars.',
      'Some wings are braced by external **struts**; a **cantilever** wing carries all loads internally.',
    ] },
    { h: 'Load limits', body: [
      'The **limit load factor** is the greatest load factor the structure is certified to carry without permanent damage. The FAA handbook quotes typical positive limits of 3.8 for the normal category, 4.4 for utility and 6.0 for aerobatic aircraft.',
      'Flying faster than the design manoeuvring speed, or in turbulence at high speed, risks exceeding the limit.',
    ] },
    { h: 'Landing gear', body: [
      'Shock is absorbed by spring-steel legs, rubber, or **oleo struts** that use oil and compressed air. Wheel **brakes** are usually hydraulic discs worked by the toe pedals. A **shimmy damper** stops rapid oscillation of the nose wheel.',
      'On inspection check tyre condition and inflation, brake discs and lines for leaks, and that the oleo strut is correctly extended.',
    ], note: 'The actual limits for each aircraft are in its flight manual and on its placards. They must never be exceeded deliberately.' },
  ],
  examples: [
    { title: 'Naming the structure', steps: ['A metal fuselage has a load-bearing skin riveted to frames and stringers.', 'Skin and internal structure share the loads.', 'This is semi-monocoque construction.'] },
    { title: 'On the walk-round', steps: ['The nose oleo strut is almost fully compressed.', 'It cannot absorb landing loads properly.', 'Do not fly: have it serviced.'] },
  ],
  practice: [
    mcq('The main lengthwise structural member of a wing is the:', ['Spar', 'Rib', 'Stringer', 'Former'], 'It carries the bending load.'),
    mcq('Wing ribs:', ['Give the wing its aerofoil shape', 'Hold the fuel only', 'Steer the nose wheel', 'Move the ailerons'], 'They also pass loads to the spars.'),
    mcq('An oleo strut absorbs shock using:', ['Oil and compressed air', 'A steel spring only', 'Rubber bands', 'Water'], 'It works like a car\'s shock absorber.'),
    mcq('A fuselage that carries its loads in the skin alone is a:', ['Monocoque', 'Truss', 'Biplane', 'Cantilever'], 'Like an eggshell.'),
    tf('A cantilever wing needs external bracing struts.', false, 'It carries all loads internally.'),
  ],
  assessment: [
    mcq('In semi-monocoque construction the loads are carried by:', ['The skin together with frames and stringers', 'The skin alone', 'A tube framework alone', 'The landing gear'], 'It is the usual modern form.'),
    mcq('A truss fuselage carries its loads in:', ['A framework of tubes', 'The skin alone', 'The windows', 'The wing ribs'], 'The covering adds shape, not strength.'),
    mcq('Spars run:', ['From wing root to wing tip', 'From leading edge to trailing edge', 'Around the fuselage', 'Along the propeller'], 'They are the main beams of the wing.'),
    num('What positive limit load factor does the FAA handbook quote as typical for normal-category aircraft?', 3.8, 0.01, '', '3.8 for normal, 4.4 for utility, 6.0 for aerobatic.'),
    mcq('The limit load factor is:', ['The greatest load factor the structure is certified to carry without permanent damage', 'The weight of the aircraft', 'The stall speed', 'The number of seats'], 'Exceeding it risks structural damage.'),
    mcq('A shimmy damper is fitted to:', ['Stop rapid oscillation of the nose wheel', 'Cool the brakes', 'Retract the gear', 'Measure tyre pressure'], 'Shimmy is felt as a violent vibration.'),
    tf('Wheel brakes on light aircraft are usually hydraulic disc brakes.', true, 'They are operated by pressing the top of the rudder pedals.'),
  ],
  missionId: 'm-ppl-airframe', sources: ['phak'],
});

export const pistonEngines = lesson('Aircraft general knowledge', {
  id: 'ppl-piston-engines', title: 'Piston Engines', minutes: 12, level: 2, prereqs: ['phys-thermodynamics'],
  objectives: ['Describe the four-stroke cycle.', 'Explain the dual magneto ignition system.', 'Explain carburettor icing and the use of carburettor heat.', 'Explain mixture control and the functions of engine oil.'],
  intro: 'A light-aircraft engine is simple, tough and designed to keep running. Most engine failures trace back not to the machine but to how it was managed: fuel, mixture, carburettor ice.',
  simple: 'The engine draws in fuel and air, squeezes it, burns it and pushes out the exhaust, over and over. Two independent ignition systems keep it firing. Ice can form in the carburettor even on a warm day, and the pilot adjusts the fuel mixture as the air gets thinner.',
  sections: [
    { h: 'Four strokes', body: [
      '**Intake**: the piston moves down and draws in the fuel-air mixture. **Compression**: it moves up and compresses it. **Power**: the spark plugs ignite the mixture and the expanding gas drives the piston down. **Exhaust**: the piston moves up and expels the burnt gas.',
    ], lab: 'explore:engine-strokes' },
    { h: 'Ignition', body: [
      'Two **magnetos**, driven by the engine, each fire one of the two spark plugs in every cylinder. They generate their own current and are independent of the aircraft\'s electrical system: the engine keeps running if the battery and alternator fail.',
      'The two systems give safety and more even combustion. In the pre-take-off check each is tested in turn; a small drop in rpm is normal.',
    ] },
    { h: 'Carburettor icing', body: [
      'Air speeding up through the carburettor venturi and fuel evaporating both cool the air, by as much as 20 °C or more. Moisture can freeze in the throat and restrict the airflow, even at outside temperatures well above freezing, especially in humid air and at low power.',
      'Signs: a fall in rpm (fixed-pitch propeller) and rough running. **Carburettor heat** sends warm air to melt the ice; the rpm first drops further, then recovers as the ice clears.',
    ] },
    { h: 'Mixture and oil', body: [
      'The **mixture** control sets the fuel-to-air ratio. As altitude increases the air becomes less dense, so the mixture is **leaned** to avoid running too rich.',
      'Engine **oil** lubricates, cools, seals and cleans. Low oil pressure with rising oil temperature is a serious warning.',
    ], note: 'Engine handling, including when and how to lean and to use carburettor heat, must follow the flight manual for the specific aircraft and engine.' },
  ],
  examples: [
    { title: 'Carburettor ice', steps: ['Cruising in humid air, rpm slowly falls and the engine runs roughly.', 'Suspect carburettor ice.', 'Apply full carburettor heat: rpm drops further, then rises as the ice melts.'] },
    { title: 'Electrical failure', steps: ['The alternator and battery fail in flight.', 'The magnetos generate their own ignition current.', 'The engine keeps running.'] },
  ],
  practice: [
    mcq('In which stroke is the fuel-air mixture drawn into the cylinder?', ['Intake', 'Compression', 'Power', 'Exhaust'], 'The piston moves down with the inlet valve open.'),
    mcq('Each cylinder of a typical aircraft piston engine has:', ['Two spark plugs, one fired by each magneto', 'One spark plug', 'No spark plugs', 'Four spark plugs fired by the battery'], 'Dual ignition for safety and better combustion.'),
    mcq('Carburettor heat works by:', ['Sending warm air into the carburettor to melt ice', 'Heating the fuel tank', 'Warming the cabin', 'Cooling the cylinders'], 'The warm air is less dense, so power drops slightly.'),
    mcq('As altitude increases, the mixture should generally be:', ['Leaned', 'Enriched', 'Left fully rich always', 'Turned off'], 'Less dense air needs less fuel.'),
    tf('The magnetos need the aircraft battery in order to work.', false, 'They generate their own current.'),
  ],
  assessment: [
    mcq('The correct order of the four strokes is:', ['Intake, compression, power, exhaust', 'Compression, intake, exhaust, power', 'Power, intake, exhaust, compression', 'Exhaust, power, compression, intake'], 'Draw in, squeeze, burn, expel.'),
    mcq('If the aircraft electrical system fails completely in flight, a magneto-ignition engine will:', ['Keep running', 'Stop immediately', 'Run at half power', 'Run backwards'], 'The magnetos are independent of the electrical system.'),
    mcq('Carburettor icing can occur:', ['At outside temperatures well above freezing, especially in humid air', 'Only below −20 °C', 'Only in rain', 'Only at full power'], 'The carburettor cools the air substantially.'),
    mcq('With a fixed-pitch propeller, the first sign of carburettor icing is usually:', ['A fall in rpm', 'A rise in rpm', 'A rise in oil pressure', 'A fuel smell'], 'Followed by rough running.'),
    mcq('When carburettor heat is applied with ice present, the rpm:', ['Drops further at first, then recovers as the ice melts', 'Rises immediately and stays high', 'Does not change', 'Falls to zero'], 'Warm air is less dense, and melting ice passes through the engine.'),
    mcq('Which of these is a function of engine oil?', ['Lubricating and cooling', 'Igniting the mixture', 'Producing the spark', 'Measuring airspeed'], 'It also seals and cleans.'),
    tf('In the power stroke, expanding gas drives the piston down.', true, 'This is the only stroke that delivers work.'),
  ],
  missionId: 'm-ppl-engine', sources: ['phak'],
});

export const fuelElectrical = lesson('Aircraft general knowledge', {
  id: 'ppl-fuel-and-electrical-systems', title: 'Fuel and Electrical Systems', minutes: 11, level: 2, prereqs: ['ppl-piston-engines', 'phys-basic-circuits'],
  objectives: ['Compare gravity-feed and pump-feed fuel systems.', 'Identify fuel grades and check for contamination.', 'Describe the main components of the electrical system.', 'Describe the response to an alternator failure.'],
  intro: 'Fuel starvation, with fuel still on board, and fuel contamination both appear again and again in accident reports. So does continued flight on a dying battery. Each is a systems problem the pilot can prevent.',
  simple: 'Fuel must be the right kind, clean, and able to reach the engine. Electricity comes from an alternator while the engine runs, with a battery as back-up. If the alternator fails, switch off what you do not need and land soon.',
  sections: [
    { h: 'Getting fuel to the engine', body: [
      'In a **gravity-feed** system, typical of high-wing aircraft, fuel flows down from wing tanks to the engine. In a **pump-feed** system, typical of low-wing aircraft, an engine-driven pump moves the fuel, with an electric pump as back-up for starting, take-off and landing.',
      'The **fuel selector** chooses the tank. Tank **vents** let air replace the fuel used; a blocked vent can stop the flow.',
    ], lab: 'explore:fuel-system' },
    { h: 'Grade and contamination', body: [
      'Fuels are dyed for identification: the common aviation gasoline **100LL is blue**. Jet fuel is clear or straw-coloured and must never be put into a piston engine that requires gasoline.',
      'Water is heavier than fuel and collects at the lowest points. Before the first flight of the day and after refuelling, take a sample from each **drain** and check its colour, smell and for water or dirt.',
      'Check fuel quantity visually: gauges in light aircraft can be inaccurate.',
    ] },
    { h: 'The electrical system', body: [
      'The engine-driven **alternator** supplies the electrical loads and recharges the **battery**. Power is distributed through a **bus bar** to circuits protected by fuses or circuit breakers. The **master switch** connects the battery and alternator to the system.',
      'An **ammeter** or **loadmeter** shows whether the alternator is charging.',
    ] },
    { h: 'Alternator failure', body: [
      'Signs are a discharge on the ammeter or a low-voltage warning. The battery now supplies everything and will not last long. Reduce the electrical load to essentials and land as soon as practicable.',
      'The engine keeps running because the magnetos are independent, but radios, lights, electric flaps and some instruments will be lost when the battery is exhausted.',
    ], note: 'System layouts and emergency procedures differ between aircraft. The flight manual for the type is the authority.' },
  ],
  examples: [
    { title: 'Fuel sample', steps: ['The sample from a wing drain shows a clear layer beneath the blue fuel.', 'The clear layer is water.', 'Keep draining until samples are clean; if in doubt, do not fly.'] },
    { title: 'Ammeter shows a discharge', steps: ['In cruise the ammeter shows a steady discharge.', 'The alternator has probably failed and the battery is draining.', 'Shed non-essential loads and land as soon as practicable.'] },
  ],
  practice: [
    mcq('A gravity-feed fuel system is typical of:', ['High-wing aircraft', 'Low-wing aircraft', 'Jet airliners', 'Gliders'], 'The tanks are above the engine.'),
    mcq('Water in a fuel tank collects:', ['At the lowest point', 'At the top', 'Evenly mixed', 'In the vent'], 'Water is denser than fuel.'),
    mcq('The alternator:', ['Supplies electrical power and recharges the battery', 'Ignites the fuel', 'Pumps the fuel', 'Cools the engine'], 'It is driven by the engine.'),
    mcq('A blocked fuel tank vent can cause:', ['Fuel flow to stop', 'Too much fuel flow', 'An electrical failure', 'A flat tyre'], 'Air cannot enter to replace the fuel used.'),
    tf('Fuel gauges in light aircraft are accurate enough to replace a visual check.', false, 'Always check the quantity visually before flight.'),
  ],
  assessment: [
    mcq('In a low-wing aircraft, fuel is normally delivered to the engine by:', ['An engine-driven pump, with an electric pump as back-up', 'Gravity alone', 'Air pressure from the pitot tube', 'The alternator'], 'The tanks are below the engine.'),
    mcq('The aviation gasoline 100LL is coloured:', ['Blue', 'Red', 'Green', 'Clear'], 'Dye identifies the grade.'),
    mcq('A fuel sample is taken from the drains to check for:', ['Water and dirt, and the correct fuel grade', 'Fuel temperature only', 'Oil pressure', 'Battery charge'], 'Do it before the first flight of the day and after refuelling.'),
    mcq('A steady discharge on the ammeter in flight suggests:', ['Alternator failure', 'A full battery', 'Carburettor ice', 'A blocked pitot tube'], 'The battery is supplying all the loads.'),
    mcq('After an alternator failure the pilot should:', ['Reduce electrical load and land as soon as practicable', 'Switch on all equipment', 'Climb as high as possible', 'Shut down the engine'], 'The battery has limited capacity.'),
    mcq('The master switch:', ['Connects the battery and alternator to the electrical system', 'Starts the propeller directly', 'Selects the fuel tank', 'Sets the altimeter'], 'It is the main electrical on-off control.'),
    tf('Jet fuel may safely be used in a piston engine designed for aviation gasoline.', false, 'It can cause engine failure. Check the fuel grade at every refuelling.'),
  ],
  missionId: 'm-ppl-fuelsys', sources: ['phak'],
});

export const pitotStatic = lesson('Aircraft general knowledge', {
  id: 'ppl-the-pitot-static-instruments', title: 'The Pitot-Static Instruments', minutes: 12, level: 2, prereqs: ['ppl-introduction-to-aircraft-instruments', 'ppl-altimetry'],
  objectives: ['Explain how the airspeed indicator, altimeter and vertical speed indicator work.', 'Distinguish indicated, calibrated and true airspeed.', 'Estimate true airspeed from indicated airspeed and altitude.', 'Predict the effect of pitot and static blockages.'],
  intro: 'Three instruments read the air itself. When ice, water or an insect blocks their tiny openings, they do not go blank: they show plausible, wrong numbers. Recognising the pattern is the pilot\'s job.',
  simple: 'The airspeed indicator compares the pressure of the oncoming air with the still-air pressure. The altimeter and vertical speed indicator read the still-air pressure only. Block one of the openings and the instruments that depend on it mislead in predictable ways.',
  sections: [
    { h: 'How they work', body: [
      'The **airspeed indicator** measures the difference between pitot (total) pressure and static pressure: the dynamic pressure. The **altimeter** is an aneroid barometer measuring static pressure. The **vertical speed indicator** measures how fast static pressure is changing, through a calibrated leak, which gives it a short lag.',
    ] },
    { h: 'Kinds of airspeed', body: [
      '**Indicated airspeed** (IAS) is what the instrument shows. **Calibrated airspeed** (CAS) is IAS corrected for instrument and position error. **True airspeed** (TAS) is the actual speed through the air.',
      'Because air density falls with altitude, TAS is higher than IAS at altitude. A rule of thumb: `TAS ≈ IAS + 2% per 1,000 ft`. At 5,000 ft, 100 kt indicated is about 110 kt true.',
      'The wing "feels" indicated airspeed, so stall and approach speeds are flown as indicated speeds at any altitude.',
    ], formula: 'tas-rule', lab: 'formula:tas-rule' },
    { h: 'Blockages', body: [
      '**Pitot tube blocked, drain hole open**: pitot pressure leaks away and the airspeed falls to zero.',
      '**Pitot tube and drain both blocked**: pressure is trapped, and the airspeed indicator behaves like an altimeter, reading higher as the aircraft climbs.',
      '**Static source blocked**: the altimeter freezes, the vertical speed indicator reads zero, and the airspeed indicator under-reads in a climb and over-reads in a descent.',
      'An **alternate static source**, where fitted, restores static pressure from inside the cabin with small errors. **Pitot heat** prevents ice blockage.',
    ], note: 'The 2% rule is an approximation that also assumes standard temperature. Flight computers and the aircraft manual give accurate values.' },
  ],
  examples: [
    { title: 'True airspeed', steps: ['Indicated airspeed is 110 kt at 8,000 ft.', '2% × 8 = 16%; 110 × 1.16.', 'TAS ≈ 127.6 kt.'] },
    { title: 'Diagnosing a blockage', steps: ['In a climb through cloud the indicated airspeed rises steadily although pitch and power are unchanged.', 'The airspeed indicator is acting like an altimeter.', 'The pitot tube and its drain are blocked, probably by ice: use pitot heat and fly attitude and power.'] },
  ],
  practice: [
    num('Indicated airspeed is 110 kt at 8,000 ft. True airspeed by the 2% per 1,000 ft rule?', 127.6, 0.5, 'kt', '110 × 1.16 = 127.6 kt.'),
    mcq('The altimeter measures:', ['Static pressure', 'Pitot pressure', 'Dynamic pressure', 'Engine pressure'], 'It is an aneroid barometer.'),
    mcq('Indicated airspeed corrected for instrument and position error is:', ['Calibrated airspeed', 'True airspeed', 'Groundspeed', 'Mach number'], 'This is calibrated airspeed, abbreviated CAS.'),
    mcq('Pitot heat is used to:', ['Prevent ice from blocking the pitot tube', 'Warm the cabin', 'Heat the fuel', 'Melt carburettor ice'], 'Switch it on before entering visible moisture near freezing.'),
    tf('At altitude, true airspeed is lower than indicated airspeed.', false, 'It is higher, because the air is less dense.'),
  ],
  assessment: [
    num('Indicated airspeed is 100 kt at 5,000 ft. True airspeed by the 2% per 1,000 ft rule?', 110, 0.5, 'kt', '100 × 1.10 = 110 kt.'),
    num('Indicated airspeed is 120 kt at 10,000 ft. True airspeed by the 2% per 1,000 ft rule?', 144, 0.5, 'kt', '120 × 1.20 = 144 kt.'),
    mcq('The airspeed indicator measures:', ['The difference between pitot and static pressure', 'Static pressure only', 'Pitot pressure only', 'Outside air temperature'], 'That difference is dynamic pressure.'),
    mcq('If the static source is blocked, the altimeter will:', ['Freeze at the altitude where the blockage occurred', 'Read zero', 'Read too high in a descent only', 'Work normally'], 'The pressure it senses no longer changes.'),
    mcq('If the pitot tube and its drain hole are both blocked, in a climb the airspeed indicator will:', ['Read higher and higher', 'Fall to zero', 'Stay exactly correct', 'Show the groundspeed'], 'Trapped pitot pressure is compared with falling static pressure.'),
    mcq('If only the pitot tube opening is blocked and the drain hole is open, the airspeed indicator will:', ['Fall to zero', 'Read higher in a climb', 'Freeze', 'Read the altitude'], 'Pitot pressure leaks away to static.'),
    tf('The vertical speed indicator shows changes with a short lag.', true, 'It relies on a calibrated leak.'),
  ],
  missionId: 'm-ppl-pitot', sources: ['phak'],
});

export const gyroInstruments = lesson('Aircraft general knowledge', {
  id: 'ppl-gyroscopic-instruments', title: 'Gyroscopic Instruments', minutes: 11, level: 2, prereqs: ['ppl-the-pitot-static-instruments', 'phys-rotational-motion'],
  objectives: ['State the two properties of a gyroscope.', 'Describe the attitude indicator, heading indicator and turn coordinator.', 'Explain why the heading indicator must be realigned.', 'Estimate the bank angle for a rate-one turn.'],
  intro: 'Take away the horizon and a pilot has three small spinning wheels between control and disorientation. Knowing how they work, what powers them and how they fail is basic instrument sense.',
  simple: 'A spinning wheel resists being tilted. Instruments use this to keep a steady reference while the aircraft moves around it. They are driven by suction or by electricity, and if that fails they wind down slowly and mislead.',
  sections: [
    { h: 'Two properties', body: [
      '**Rigidity in space**: a spinning gyroscope keeps its axis pointing in the same direction. **Precession**: a force applied to it produces a movement 90° further round in the direction of rotation.',
    ] },
    { h: 'The three instruments', body: [
      'The **attitude indicator** uses rigidity to show pitch and bank against an artificial horizon.',
      'The **heading indicator** uses rigidity to show heading. It has no sense of north, and it drifts through friction and the Earth\'s rotation, so it is realigned with the magnetic compass about every 15 minutes, in straight, level, unaccelerated flight.',
      'The **turn coordinator** uses precession to show rate of turn (and, initially, rate of roll). Its balance ball shows whether the turn is coordinated.',
    ] },
    { h: 'Rate-one turns', body: [
      'A **rate-one turn** is 3° per second: 360° in 2 minutes. The bank angle needed grows with speed. A rule of thumb in knots: `bank ≈ TAS ÷ 10 + 7`. At 100 kt, about 17°.',
    ], formula: 'rate1-bank', lab: 'formula:rate1-bank' },
    { h: 'Power and failure', body: [
      'In many light aircraft an engine-driven **vacuum pump** spins the attitude and heading indicators, with the turn coordinator electric, so that one failure does not take all three. A **suction gauge** shows the vacuum.',
      'After a vacuum failure the gyros run down gradually: the instruments drift slowly and give no flag unless one is fitted. Cross-check them against each other.',
    ], note: 'Power sources vary between aircraft, and electronic displays use different sensors. Know which instruments share a source in the aircraft you fly.' },
  ],
  examples: [
    { title: 'Rate-one bank', steps: ['True airspeed is 90 kt.', '90 ÷ 10 + 7.', 'About 16° of bank.'] },
    { title: 'Vacuum failure', steps: ['The suction gauge reads zero; the attitude indicator slowly tilts although the turn coordinator shows wings level.', 'The vacuum-driven gyros are running down.', 'Disregard the attitude and heading indicators; use the turn coordinator, compass and pitot-static instruments.'] },
  ],
  practice: [
    num('True airspeed is 90 kt. Approximate bank angle for a rate-one turn (TAS ÷ 10 + 7)?', 16, 0.2, '°', '9 + 7 = 16°.'),
    mcq('The property that keeps a gyroscope\'s axis pointing in a fixed direction is:', ['Rigidity in space', 'Precession', 'Friction', 'Dihedral'], 'It is the basis of the attitude and heading indicators.'),
    mcq('The balance ball in the turn coordinator shows:', ['Whether the turn is coordinated', 'The altitude', 'The engine rpm', 'The fuel quantity'], 'Step on the ball to centre it.'),
    mcq('The heading indicator is realigned with:', ['The magnetic compass', 'The altimeter', 'The airspeed indicator', 'The tachometer'], 'In straight, level, unaccelerated flight.'),
    tf('The heading indicator automatically finds magnetic north by itself.', false, 'It must be set from the compass.'),
  ],
  assessment: [
    num('True airspeed is 100 kt. Approximate bank angle for a rate-one turn (TAS ÷ 10 + 7)?', 17, 0.2, '°', '10 + 7 = 17°.'),
    num('True airspeed is 120 kt. Approximate bank angle for a rate-one turn (TAS ÷ 10 + 7)?', 19, 0.2, '°', '12 + 7 = 19°.'),
    mcq('The two properties of a gyroscope are:', ['Rigidity in space and precession', 'Lift and drag', 'Pitch and roll', 'Voltage and current'], 'Both are used by flight instruments.'),
    mcq('The turn coordinator shows:', ['Rate of turn and balance', 'Pitch attitude', 'Altitude', 'True airspeed'], 'A rate-one turn is 3° per second.'),
    num('About how often, in minutes, should the heading indicator be checked against the compass?', 15, 1, 'min', 'About every 15 minutes.'),
    mcq('After a vacuum pump failure, the vacuum-driven gyro instruments will:', ['Run down gradually and give misleading readings', 'Stop instantly and show a blank face', 'Become more accurate', 'Be unaffected'], 'The slow failure makes it hard to notice.'),
    tf('Driving the turn coordinator from a different power source than the other gyros gives a back-up if one source fails.', true, 'That is why it is commonly electric when the others are vacuum-driven.'),
  ],
  missionId: 'm-ppl-gyro', sources: ['phak'],
});
