// Pre-Flight Academy physics, sixth batch (expansion): free fall, projectiles, circular motion, buoyancy, hydraulics,
// humidity, lapse rates, the Doppler effect, induction, wing loading and the lift curve. Original practice material.
import { lesson, mcq, num, tf } from './q';

export const freeFall = lesson('Free fall', {
  id: 'phys-free-fall', title: 'Free Fall and Gravity', minutes: 10, level: 1, prereqs: ['phys-accel', 'phys-gravity'],
  objectives: ['State that gravity gives every object the same acceleration.', 'Calculate speed and distance for a fall from rest.', 'Explain terminal speed.'],
  intro: 'Drop a stone and it speeds up. Understanding how quickly it speeds up explains weightlessness, the load factor in a push-over and why parachutes work.',
  simple: 'Near the Earth\'s surface gravity adds 9.81 m/s to the speed of a falling object every second, whatever its mass. Air resistance eventually stops the speeding up: that is the terminal speed.',
  sections: [
    { h: 'Acceleration due to gravity', body: [
      'Gravity gives every object the same acceleration, **g = 9.81 m/s²** near sea level. Without air, a hammer and a feather fall together.',
      'After t seconds from rest: `v = g × t`. After 3 s the speed is 29.4 m/s, about 106 km/h.',
    ] },
    { h: 'Distance fallen', body: [
      'The distance grows with the square of the time: `d = ½ g t²`. After 2 s the object has fallen 19.6 m. After 4 s it has fallen four times as far: 78.5 m.',
      'The time to fall a distance d is `t = √(2d ÷ g)`. For 78.48 m that is 4 s.',
    ], formula: 'free-fall', lab: 'formula:free-fall' },
    { h: 'Air resistance and terminal speed', body: [
      'Real objects meet drag. Drag grows with speed until it equals the weight. Then the net force is zero and the speed stops rising: the **terminal speed**.',
      'A skydiver in a spread position reaches roughly 55 m/s (about 200 km/h); a feather reaches terminal speed almost at once.',
    ], note: 'The formulas above ignore air resistance. They are good for short falls of dense objects, not for long falls or light objects.' },
  ],
  examples: [
    { title: 'Speed', steps: ['Fall from rest for 3 s.', 'v = 9.81 × 3 = 29.43 m/s.'] },
    { title: 'Time to fall', steps: ['A bolt falls 78.48 m.', 't = √(2 × 78.48 ÷ 9.81) = √16.', 't = 4 s.'] },
  ],
  practice: [
    num('Speed after falling from rest for 3 s (g = 9.81 m/s²)?', 29.43, 0.1, 'm/s', 'v = 9.81 × 3 = 29.43 m/s.'),
    num('Distance fallen from rest in 2 s?', 19.62, 0.1, 'm', 'd = ½ × 9.81 × 4 = 19.62 m.'),
    num('How long does an object take to fall 19.62 m from rest?', 2, 0.02, 's', 't = √(2 × 19.62 ÷ 9.81) = √4 = 2 s.'),
    mcq('Without air resistance, a heavy and a light object dropped together:', ['Hit the ground together', 'The heavy one lands first', 'The light one lands first', 'Neither falls'], 'Gravity gives every object the same acceleration.'),
    tf('A heavier object always has a higher terminal speed than a lighter one of the same shape.', true, 'More weight needs more drag to balance it, which happens at a higher speed. In free fall without drag all objects fall alike.'),
  ],
  assessment: [
    num('Distance fallen from rest in 5 s?', 122.6, 0.3, 'm', 'd = ½ × 9.81 × 25 = 122.6 m.'),
    num('Speed after 0.5 s of free fall?', 4.905, 0.05, 'm/s', '9.81 × 0.5 = 4.905 m/s.'),
    num('How long to fall 78.48 m from rest?', 4, 0.02, 's', '√(2 × 78.48 ÷ 9.81) = 4 s.'),
    num('Distance fallen in 4 s compared with 2 s: how many times larger?', 4, 0.05, '×', 'The distance depends on t², so doubling the time makes it four times larger.'),
    mcq('What stops a falling skydiver from speeding up for ever?', ['Air resistance balances weight', 'Gravity switches off', 'Mass increases', 'The Earth pushes back'], 'Drag rises with speed until it equals the weight: the terminal speed.'),
    tf('A free-fall formula that ignores air resistance is accurate for a long fall of a light object.', false, 'Light objects and long falls are strongly affected by drag.'),
  ],
  missionId: 'm-phys-freefall', sources: ['phak', 'nasa-lift'],
});

export const projectile = lesson('Projectile motion', {
  id: 'phys-projectile', title: 'Projectile Motion', minutes: 12, level: 2, prereqs: ['phys-free-fall', 'math-trig'],
  objectives: ['Treat horizontal and vertical motion separately.', 'Calculate the range of a launched object.', 'Explain why an object released from an aircraft keeps its forward speed.'],
  intro: 'A thrown ball and a dropped package follow the same rule: the horizontal motion and the vertical motion are independent. Seeing them apart makes the path easy to predict.',
  simple: 'Gravity only pulls things down. Sideways speed stays the same (ignoring air resistance) while the downward speed grows. Together they draw a curve called a parabola.',
  sections: [
    { h: 'Two independent motions', body: [
      '**Horizontal:** no force, so the speed stays constant. **Vertical:** gravity accelerates the object downward at 9.81 m/s².',
      'A package released from level flight keeps the aircraft\'s forward speed and falls with the same rule as any dropped object: `t = √(2h ÷ g)`.',
    ] },
    { h: 'Range', body: [
      'For a launch at speed v and angle θ above the horizontal, back to launch height: `R = v² sin 2θ ÷ g`.',
      'With v = 20 m/s and θ = 45°: R = 400 × 1 ÷ 9.81 = 40.8 m. Without air resistance the greatest range is at 45°, and angles that add up to 90° (30° and 60°) give the same range.',
    ], formula: 'proj-range', lab: 'formula:proj-range' },
    { h: 'A dropped object', body: [
      'An object released from 500 m falls for t = √(1000 ÷ 9.81) = 10.1 s. At a steady 50 m/s forward speed it travels 50 × 10.1 = 505 m horizontally before it lands.',
      'This is why a package must be released **before** the target, not above it.',
    ], note: 'Air resistance changes the real path, and rules and safety requirements govern what may be dropped from an aircraft. This lesson is about the physics only.' },
  ],
  examples: [
    { title: 'Range', steps: ['v = 10 m/s, θ = 30°.', 'sin 60° = 0.866.', 'R = 100 × 0.866 ÷ 9.81 = 8.83 m.'] },
    { title: 'Dropped package', steps: ['Height 80 m.', 't = √(160 ÷ 9.81) = 4.04 s.', 'At 50 m/s: 202 m ahead of the release point.'] },
  ],
  practice: [
    num('Range for v = 20 m/s at 45° (g = 9.81)?', 40.77, 0.1, 'm', '400 × sin 90° ÷ 9.81 = 40.77 m.'),
    num('Range for v = 10 m/s at 30°?', 8.83, 0.05, 'm', '100 × sin 60° ÷ 9.81 = 8.83 m.'),
    num('Time for an object released from 500 m to fall to the ground?', 10.1, 0.05, 's', 't = √(2 × 500 ÷ 9.81) = 10.1 s.'),
    mcq('Ignoring air resistance, which launch angle gives the greatest range?', ['45°', '30°', '60°', '90°'], 'sin 2θ is greatest at θ = 45°.'),
    tf('Ignoring air resistance, the horizontal speed of a projectile stays constant.', true, 'No horizontal force acts on it.'),
  ],
  assessment: [
    num('Range for v = 30 m/s at 45°?', 91.74, 0.15, 'm', '900 ÷ 9.81 = 91.74 m.'),
    num('Range for v = 15 m/s at 60°?', 19.86, 0.1, 'm', '225 × sin 120° ÷ 9.81 = 19.86 m.'),
    num('Time to fall 80 m from rest?', 4.04, 0.03, 's', '√(160 ÷ 9.81) = 4.04 s.'),
    num('An object falls for 4.04 s while moving at 50 m/s forward. Horizontal distance?', 202, 1, 'm', '50 × 4.04 = 202 m.'),
    tf('Launch angles of 30° and 60° give the same range with no air resistance.', true, 'sin 60° = sin 120°, so the two ranges are equal.'),
    mcq('A package is released from an aircraft in level flight. Where does it land relative to the release point?', ['Ahead of it', 'Directly below', 'Behind it', 'It cannot fall'], 'It keeps the aircraft\'s forward speed while falling, so it lands ahead.'),
  ],
  missionId: 'm-phys-projectile', sources: ['phak'],
});

export const circularMotion = lesson('Circular motion', {
  id: 'phys-circular-motion', title: 'Circular Motion and Turns', minutes: 12, level: 2, prereqs: ['phys-newton', 'phys-accel'],
  objectives: ['Explain why turning needs a force towards the centre.', 'Calculate centripetal acceleration and force.', 'Link turns of an aircraft to lift and bank.'],
  intro: 'Anything moving on a curve is accelerating, even at constant speed, because its direction keeps changing. A force pointing to the centre of the curve causes that acceleration.',
  simple: 'To go round a circle you need a push towards the middle. The faster you go or the tighter the circle, the bigger the push. In an aircraft the push comes from the sideways part of lift.',
  sections: [
    { h: 'Centripetal acceleration', body: [
      'An object moving at speed v round a circle of radius r accelerates towards the centre at `a = v² ÷ r`.',
      'At 20 m/s round r = 100 m: a = 400 ÷ 100 = 4 m/s², about 0.4 g.',
    ] },
    { h: 'Centripetal force', body: [
      'By Newton\'s second law the inward force is `F = m v² ÷ r`. A 1,000 kg aircraft at 30 m/s in a turn of radius 300 m needs F = 1,000 × 900 ÷ 300 = 3,000 N.',
      'Doubling the speed at the same radius needs four times the force. Halving the radius doubles it.',
    ], formula: 'centripetal', lab: 'formula:centripetal' },
    { h: 'Turning an aircraft', body: [
      'In a level turn the aircraft banks. The horizontal part of lift is the centripetal force; the vertical part still supports the weight, so the total lift must increase.',
      'That is why a steeper bank or a faster turn at the same speed increases the load factor, and why a tighter turn needs more lift.',
    ], note: '"Centripetal force" is a name for the net inward force, not a new kind of force. In an aircraft it is provided by lift; in a car by tyre friction.' },
  ],
  examples: [
    { title: 'Acceleration', steps: ['v = 50 m/s, r = 250 m.', 'a = 2,500 ÷ 250 = 10 m/s².', 'That is about 1 g, sideways.'] },
    { title: 'Force', steps: ['m = 1,200 kg, v = 40 m/s, r = 400 m.', 'F = 1,200 × 1,600 ÷ 400 = 4,800 N.'] },
  ],
  practice: [
    num('Centripetal acceleration at 20 m/s round a circle of radius 100 m?', 4, 0.02, 'm/s²', 'a = 400 ÷ 100 = 4 m/s².'),
    num('Inward force for m = 1,000 kg, v = 30 m/s, r = 300 m?', 3000, 5, 'N', 'F = 1,000 × 900 ÷ 300 = 3,000 N.'),
    mcq('In circular motion the acceleration points:', ['Towards the centre', 'Away from the centre', 'Along the direction of motion', 'Upwards'], 'The direction changes inward, so the acceleration is towards the centre.'),
    tf('At the same radius, doubling the speed quadruples the force needed.', true, 'F depends on v².'),
    num('Doubling the radius at the same speed. What is the ratio of the new force to the old force?', 0.5, 0.01, '', 'F = mv² ÷ r, so doubling r halves F.'),
  ],
  assessment: [
    num('Centripetal acceleration at 50 m/s round r = 250 m?', 10, 0.05, 'm/s²', '2,500 ÷ 250 = 10 m/s².'),
    num('Inward force for m = 1,200 kg, v = 40 m/s, r = 400 m?', 4800, 5, 'N', '1,200 × 1,600 ÷ 400 = 4,800 N.'),
    num('Speed for a = 9.81 m/s² at r = 100 m (v = √(a × r))?', 31.32, 0.1, 'm/s', '√981 = 31.32 m/s.'),
    mcq('In a level banked turn, which provides the inward force on an aircraft?', ['The horizontal part of lift', 'Thrust', 'Weight', 'Drag'], 'Lift tilts into the turn and its horizontal part pulls the aircraft round.'),
    tf('Centripetal force is a separate force in addition to lift and weight.', false, 'It is the name for the net inward force, which lift provides.'),
    tf('A tighter turn at the same speed needs a larger inward force.', true, 'A smaller r gives a larger F = mv² ÷ r.'),
  ],
  missionId: 'm-phys-circular', sources: ['phak', 'afh'],
});

export const buoyancy = lesson('Buoyancy', {
  id: 'phys-buoyancy', title: 'Buoyancy and Archimedes\' Principle', minutes: 10, level: 2, prereqs: ['phys-density', 'phys-weight'],
  objectives: ['State Archimedes\' principle.', 'Calculate buoyant force.', 'Explain why balloons and boats float and why aeroplane buoyancy is tiny.'],
  intro: 'Anything immersed in a fluid, whether water or air, is pushed upwards. That push keeps ships afloat, lifts balloons and explains how floatplanes and ditched aircraft behave.',
  simple: 'The upward push on an object equals the weight of the fluid it pushes out of the way. If that is more than the object\'s weight, it floats or rises.',
  sections: [
    { h: 'Archimedes\' principle', body: [
      'The **buoyant force** equals the weight of the fluid displaced: `F = ρ × g × V`, where ρ is the density of the **fluid** and V the volume displaced.',
      'Fully under water, 0.5 m³ displaces 500 kg of water. F = 1,000 × 9.81 × 0.5 = 4,905 N.',
    ], formula: 'buoyancy', lab: 'formula:buoyancy' },
    { h: 'Floating and sinking', body: [
      'An object floats if its average density is less than the fluid\'s. A steel ship floats because its hollow hull makes its average density lower than water\'s.',
      'A hot-air balloon rises because the hot air inside is less dense than the cooler air outside, so the net upward force is positive.',
    ] },
    { h: 'Air is a fluid too', body: [
      'Sea-level air has a density of 1.225 kg/m³. A 1,000 m³ balloon envelope displaces air of weight 1.225 × 9.81 × 1,000 = 12,017 N.',
      'For an aeroplane of a few cubic metres the buoyancy of the air is about 30 N, a tiny fraction of its weight. Wings, not buoyancy, support aeroplanes.',
    ], note: 'Ditching and floatation equipment are covered by the aircraft\'s approved procedures. This lesson explains only the physics.' },
  ],
  examples: [
    { title: 'In water', steps: ['Volume 2 m³ fully submerged.', 'F = 1,000 × 9.81 × 2 = 19,620 N.'] },
    { title: 'Balloon lift', steps: ['Envelope 2,000 m³, outside air 1.225 kg/m³, hot air 0.95 kg/m³.', 'Net lift = (1.225 − 0.95) × 9.81 × 2,000.', '≈ 5,395 N (about 550 kg of lift).'] },
  ],
  practice: [
    num('Buoyant force on 0.5 m³ fully in water (ρ = 1,000, g = 9.81)?', 4905, 5, 'N', '1,000 × 9.81 × 0.5 = 4,905 N.'),
    num('Weight of air displaced by a 1,000 m³ balloon (ρ = 1.225)?', 12017, 20, 'N', '1.225 × 9.81 × 1,000 = 12,017 N.'),
    mcq('An object floats when its average density is:', ['Less than the fluid\'s', 'Greater than the fluid\'s', 'Equal to zero', 'Equal to its weight'], 'Then the buoyant force can equal its weight before it is fully submerged.'),
    tf('Archimedes\' principle: the buoyant force equals the weight of the fluid displaced.', true, 'This is the statement of the principle.'),
    mcq('Why does a hot-air balloon rise?', ['The hot air inside is less dense than the air outside', 'Hot air is heavier', 'The envelope is a wing', 'Gravity is weaker'], 'Less dense air inside gives a net upward force.'),
  ],
  assessment: [
    num('Buoyant force on 2 m³ fully in water?', 19620, 20, 'N', '1,000 × 9.81 × 2 = 19,620 N.'),
    num('Weight of the air displaced by a 3 m³ object (ρ = 1.225)?', 36.05, 0.2, 'N', '1.225 × 9.81 × 3 = 36.05 N.'),
    num('Net lift of a 2,000 m³ balloon with outside air 1.225 and inside air 0.95 kg/m³?', 5395, 15, 'N', '(1.225 − 0.95) × 9.81 × 2,000 = 5,395 N.'),
    mcq('Which density goes in F = ρgV?', ['The fluid\'s density', 'The object\'s density', 'The average of both', 'Neither'], 'The buoyant force depends on the weight of the displaced fluid.'),
    tf('Buoyancy supports a light aeroplane in flight.', false, 'The buoyancy of air on an aeroplane is tiny. Lift from the wings supports it.'),
    tf('A steel ship floats because its average density is less than the water\'s.', true, 'The hollow hull holds a lot of air, lowering the average density.'),
  ],
  missionId: 'm-phys-buoyancy', sources: ['phak'],
});

export const hydraulics = lesson('Hydraulics', {
  id: 'phys-hydraulics', title: 'Pascal\'s Principle and Hydraulics', minutes: 11, level: 2, prereqs: ['phys-pressure'],
  objectives: ['State Pascal\'s principle.', 'Calculate forces and pressures in a hydraulic system.', 'Explain the trade-off between force and distance.'],
  intro: 'Brakes, landing gear, flaps and flight-control actuators are moved by liquid under pressure. A small force on a small piston can balance a large force on a large piston.',
  simple: 'Pressure pushes equally in all directions in a liquid in a closed space. A small piston with a small push makes pressure that, acting on a big piston, makes a big force. But the big piston moves less far.',
  sections: [
    { h: 'Pascal\'s principle', body: [
      'A pressure applied to an enclosed liquid is transmitted equally throughout it. Pressure is force per area: `p = F ÷ A`.',
      'A 20 N force on a piston of area 5 cm² (0.0005 m²) makes a pressure of 20 ÷ 0.0005 = 40,000 Pa.',
    ] },
    { h: 'Force multiplication', body: [
      'The same pressure acts on a larger piston, so the force is larger by the ratio of the areas: `F₂ = F₁ × A₂ ÷ A₁`.',
      '50 N on 2 cm² with an output piston of 40 cm²: F₂ = 50 × 40 ÷ 2 = 1,000 N, twenty times the input.',
    ], formula: 'pascal-force', lab: 'formula:pascal-force' },
    { h: 'No free energy', body: [
      'The work in equals the work out. The output piston moves less far by the same ratio as the force rose: to raise the output piston by 1 cm in the example the input piston moves 20 cm.',
      'Liquids are almost incompressible, so the system responds immediately. Air bubbles in the fluid are compressible and make brakes feel soft.',
    ], note: 'Aircraft hydraulic systems use specified fluids, pressures and maintenance procedures. This lesson covers the physical principle only.' },
  ],
  examples: [
    { title: 'Force on the big piston', steps: ['20 N on 5 cm², output piston 100 cm².', 'Ratio of areas = 20.', 'F₂ = 20 × 20 = 400 N.'] },
    { title: 'Distance trade-off', steps: ['Area ratio 20.', 'To move the output piston 1 cm the input moves 20 cm.'] },
  ],
  practice: [
    num('50 N on a 2 cm² piston, output piston 40 cm². Output force?', 1000, 1, 'N', '50 × 40 ÷ 2 = 1,000 N.'),
    num('Pressure (in pascals) when 20 N acts on 0.0005 m²?', 40000, 10, 'Pa', '20 ÷ 0.0005 = 40,000 Pa.'),
    num('The area ratio is 20. How far must the input piston move to move the output piston 1 cm?', 20, 0.1, 'cm', 'The distance rises by the same ratio the force falls: 20 cm.'),
    mcq('Why do air bubbles make hydraulic brakes feel soft?', ['Air compresses, liquid does not', 'Air is heavier than liquid', 'Bubbles increase pressure', 'Liquids expand'], 'Compressing the bubbles absorbs movement before pressure builds.'),
    tf('A hydraulic system can output more work than is put in.', false, 'Work in equals work out; force rises while distance falls.'),
  ],
  assessment: [
    num('20 N on 5 cm², output piston 100 cm². Output force?', 400, 0.5, 'N', '20 × 100 ÷ 5 = 400 N.'),
    num('Pressure when 20 N acts on 5 cm² (give it in N/cm²)?', 4, 0.02, 'N/cm²', '20 ÷ 5 = 4 N/cm².'),
    num('You need 1,500 N from an output piston of 50 cm². What pressure in N/cm² must the fluid supply?', 30, 0.1, 'N/cm²', '1,500 ÷ 50 = 30 N/cm².'),
    num('An input force of 30 N on a 1 cm² piston must produce 1,500 N. What output area is needed?', 50, 0.2, 'cm²', 'A₂ = 1,500 × 1 ÷ 30 = 50 cm².'),
    mcq('Pascal\'s principle states that pressure in an enclosed liquid is:', ['Transmitted equally in all directions', 'Largest at the surface', 'Zero at the centre', 'Constant in time only'], 'This is the statement of the principle.'),
    tf('Hydraulic actuators are used in aircraft to move landing gear and flaps.', true, 'High-pressure fluid moves pistons that drive many aircraft systems.'),
  ],
  missionId: 'm-phys-hydraulics', sources: ['phak'],
});

export const humidity = lesson('Humidity', {
  id: 'phys-humidity-dew-point', title: 'Humidity and Dew Point', minutes: 10, level: 2, prereqs: ['phys-temperature', 'phys-atmos'],
  objectives: ['Define relative humidity and dew point.', 'Estimate the dew point from temperature and humidity.', 'Use the temperature–dew point spread to judge fog and cloud base.'],
  intro: 'Water vapour in the air decides whether you get clear skies, fog or cloud. Two numbers in every weather report, the temperature and the dew point, tell you how close the air is to saturation.',
  simple: 'Warm air can hold more water vapour than cold air. The dew point is the temperature at which the air would be full. When the air temperature drops to the dew point, water vapour condenses into cloud or fog.',
  sections: [
    { h: 'Relative humidity', body: [
      '**Relative humidity** (RH) is how much water vapour the air holds compared with the most it could hold at that temperature, in percent. 100 % means saturated.',
      'Cooling air raises its relative humidity without adding any water, because cold air can hold less.',
    ] },
    { h: 'Dew point', body: [
      'The **dew point** is the temperature to which air must be cooled to become saturated. A useful rule of thumb for RH above about 50 %: `Td ≈ T − (100 − RH) ÷ 5`.',
      'At 20 °C and 60 % RH the dew point is about 20 − 8 = 12 °C. A cold glass at 12 °C would mist up.',
    ], formula: 'dew-point-approx', lab: 'formula:dew-point-approx' },
    { h: 'The spread and flight weather', body: [
      'The gap between temperature and dew point is the **spread**. A small spread (2 °C or less) with falling temperature warns of mist, fog or low cloud, for example on a clear night.',
      'For convective cloud the base is about 400 ft per °C of spread: 12 °C of spread gives a base near 4,800 ft above the ground.',
    ], note: 'These are rules of thumb. For flight use the METAR, TAF and forecasts. A spread of 3 °C or less is treated seriously for fog and carburettor icing in the weather lessons.' },
  ],
  examples: [
    { title: 'Dew point', steps: ['T = 20 °C, RH = 60 %.', 'Td ≈ 20 − (100 − 60) ÷ 5 = 20 − 8.', 'Td ≈ 12 °C.'] },
    { title: 'Cloud base', steps: ['T = 25 °C, Td = 13 °C. Spread 12 °C.', 'Base ≈ 12 × 400 = 4,800 ft above the ground.'] },
  ],
  practice: [
    num('Estimate the dew point at 20 °C and 60 % relative humidity.', 12, 0.2, '°C', '20 − (100 − 60) ÷ 5 = 12 °C.'),
    num('Temperature 25 °C and dew point 13 °C. The spread?', 12, 0.1, '°C', '25 − 13 = 12 °C.'),
    num('Estimate the convective cloud base for a spread of 12 °C (400 ft per °C).', 4800, 20, 'ft', '12 × 400 = 4,800 ft.'),
    mcq('Cooling air with no water added makes the relative humidity:', ['Rise', 'Fall', 'Stay the same', 'Become zero'], 'Cold air can hold less vapour, so the same vapour is a larger fraction.'),
    tf('The dew point can never be higher than the air temperature.', true, 'Air cannot hold more vapour than saturation; the dew point is at most the temperature.'),
  ],
  assessment: [
    num('Estimate the dew point at 30 °C and 50 % relative humidity.', 20, 0.2, '°C', '30 − (100 − 50) ÷ 5 = 20 °C.'),
    num('Estimate the dew point at 15 °C and 80 % relative humidity.', 11, 0.2, '°C', '15 − 4 = 11 °C.'),
    num('Spread of 2 °C. Estimated convective cloud base?', 800, 10, 'ft', '2 × 400 = 800 ft.'),
    mcq('A clear calm night, with the temperature falling towards the dew point, suggests:', ['Mist or fog may form', 'Strong thermals', 'Clear air for ever', 'A rising pressure'], 'Cooling to the dew point makes vapour condense near the ground.'),
    tf('A small temperature–dew point spread means the air is close to saturation.', true, 'The air is nearly full of water vapour, so cloud or fog can form with little cooling.'),
    tf('The dew point rule of thumb is reliable at 20 % relative humidity.', false, 'It is intended for relative humidities above about 50 %.'),
  ],
  missionId: 'm-phys-humidity', sources: ['faa-wx'],
});

export const adiabatic = lesson('Lapse rates', {
  id: 'phys-adiabatic-lapse', title: 'Lapse Rates and Rising Air', minutes: 11, level: 2, prereqs: ['phys-atmos', 'phys-gas'],
  objectives: ['Explain why rising air cools.', 'Use the dry adiabatic and ISA lapse rates.', 'Explain stability in terms of lapse rates.'],
  intro: 'Air that rises meets lower pressure, expands and cools. How much it cools compared with the surrounding air decides whether it keeps rising, which is the difference between smooth air and thermals or showers.',
  simple: 'Rising air expands and cools about 3 °C for every 1,000 feet if it is not saturated. The surrounding air usually cools more slowly, so a rising bubble soon becomes cooler than its surroundings and sinks back: that is stable air.',
  sections: [
    { h: 'Why rising air cools', body: [
      'As a parcel of air rises, the pressure around it falls. The parcel expands and does work on its surroundings, so it cools. No heat flows in or out: this is called **adiabatic** cooling.',
      'Unsaturated air cools at the **dry adiabatic lapse rate**, about 3 °C per 1,000 ft (9.8 °C per km).',
    ], formula: 'lapse-temp', lab: 'formula:lapse-temp' },
    { h: 'The environment: ISA', body: [
      'The ISA model assumes the surrounding air cools at about 1.98 °C per 1,000 ft up to 36,000 ft: from 15 °C at sea level to about 5.1 °C at 5,000 ft and −4.8 °C at 10,000 ft.',
      'The real environmental lapse rate varies from day to day and place to place.',
    ] },
    { h: 'Stable and unstable', body: [
      'If a rising parcel cools faster than its surroundings it becomes colder and denser, and sinks back: the air is **stable**. If the surroundings cool faster than the parcel, the parcel stays warmer and keeps rising: the air is **unstable**.',
      'Once the rising air is saturated, condensation releases heat, so it cools more slowly (the saturated rate, about 1.5 °C per 1,000 ft in warm air). This is why showers can grow tall.',
    ], note: 'This lesson covers the underlying physics. Weather forecasts and charts give the actual stability for flight planning.' },
  ],
  examples: [
    { title: 'Rising air', steps: ['Surface temperature 24 °C.', 'Dry lapse rate 3 °C per 1,000 ft.', 'At 3,000 ft: 24 − 9 = 15 °C.'] },
    { title: 'ISA temperature', steps: ['Sea level 15 °C, 1.98 °C per 1,000 ft.', 'At 10,000 ft: 15 − 19.8 = −4.8 °C.'] },
  ],
  practice: [
    num('Unsaturated air at 20 °C rises 2,000 ft at 3 °C per 1,000 ft. New temperature?', 14, 0.1, '°C', '20 − 6 = 14 °C.'),
    num('ISA temperature at 5,000 ft (1.98 °C per 1,000 ft from 15 °C)?', 5.1, 0.1, '°C', '15 − 9.9 = 5.1 °C.'),
    num('How much does unsaturated air cool in rising 4,000 ft?', 12, 0.1, '°C', '4 × 3 = 12 °C.'),
    mcq('Why does rising air cool?', ['It expands as the pressure falls', 'It loses heat to the ground', 'Gravity cools it', 'The Sun turns off'], 'Expansion does work on the surroundings, which lowers the temperature.'),
    tf('The ISA lapse rate equals the dry adiabatic lapse rate.', false, 'ISA is about 1.98 °C per 1,000 ft; the dry rate is about 3 °C per 1,000 ft.'),
  ],
  assessment: [
    num('Surface 30 °C. Unsaturated air rises to 6,000 ft. Temperature?', 12, 0.1, '°C', '30 − 18 = 12 °C.'),
    num('ISA temperature at 10,000 ft?', -4.8, 0.2, '°C', '15 − 19.8 = −4.8 °C.'),
    num('A parcel at 24 °C rises 3,000 ft (dry rate). New temperature?', 15, 0.1, '°C', '24 − 9 = 15 °C.'),
    mcq('A rising parcel is cooler than its surroundings. The air is:', ['Stable at that level', 'Unstable', 'Saturated', 'Moving down at a constant speed'], 'A cooler, denser parcel sinks back, which means stability.'),
    tf('Saturated rising air cools more slowly than dry rising air.', true, 'Condensation releases heat that offsets some of the cooling.'),
    tf('The environmental lapse rate is always exactly the ISA value.', false, 'ISA is a standard model. Real values change with the weather.'),
  ],
  missionId: 'm-phys-lapse', sources: ['faa-wx', 'phak'],
});

export const doppler = lesson('Doppler effect', {
  id: 'phys-doppler', title: 'The Doppler Effect', minutes: 9, level: 2, prereqs: ['phys-waves', 'phys-sound'],
  objectives: ['Explain why the pitch of a moving source changes.', 'Calculate the shifted frequency.', 'Connect the effect to Doppler weather radar.'],
  intro: 'A passing siren drops in pitch. The same effect, applied to radio waves, lets radar measure how fast raindrops move and tells a navigation system how fast the aircraft is moving over the ground.',
  simple: 'A source moving towards you squeezes the waves together, so you receive them more often: higher frequency. A source moving away stretches them: lower frequency.',
  sections: [
    { h: 'Why the pitch changes', body: [
      'A source emits a wave crest every 1/f seconds. If it moves towards you between crests, each crest has less distance to travel and arrives sooner. The crests arrive closer together, so the frequency you receive is higher.',
      'If the source moves away, the crests arrive later and further apart: the frequency drops.',
    ] },
    { h: 'The shifted frequency', body: [
      'For a source moving at speed vₛ towards a still observer: `f′ = f × c ÷ (c − vₛ)`. Moving away: `f′ = f × c ÷ (c + vₛ)`. Here c is the speed of the wave (sound: about 340 m/s).',
      'A 500 Hz source approaching at 34 m/s is heard at 500 × 340 ÷ 306 = 555.6 Hz. Receding at the same speed: 500 × 340 ÷ 374 = 454.5 Hz.',
    ], formula: 'doppler', lab: 'formula:doppler' },
    { h: 'Doppler in aviation', body: [
      '**Doppler weather radar** measures the frequency shift of radio waves reflected from raindrops to find how fast they move towards or away from the radar, which reveals wind shear and rotation inside storms.',
      'Doppler also underlies some ground-speed measurements and the radio-wave handling in navigation systems.',
    ], note: 'The simple formula holds below the speed of sound. For radio waves at aircraft speeds the shift is tiny compared with the transmitted frequency, but radar electronics can measure it.' },
  ],
  examples: [
    { title: 'Approaching', steps: ['f = 1,000 Hz, vₛ = 68 m/s, c = 340 m/s.', 'f′ = 1,000 × 340 ÷ 272.', 'f′ = 1,250 Hz.'] },
    { title: 'Receding', steps: ['f = 1,000 Hz, vₛ = 68 m/s.', 'f′ = 1,000 × 340 ÷ 408.', 'f′ = 833 Hz.'] },
  ],
  practice: [
    num('500 Hz source approaching at 34 m/s (c = 340 m/s). Frequency heard?', 555.6, 0.5, 'Hz', '500 × 340 ÷ 306 = 555.6 Hz.'),
    num('500 Hz source receding at 34 m/s. Frequency heard?', 454.5, 0.5, 'Hz', '500 × 340 ÷ 374 = 454.5 Hz.'),
    mcq('A source moving towards you is heard at:', ['A higher pitch', 'A lower pitch', 'The same pitch', 'No sound'], 'The waves are compressed, so the frequency rises.'),
    tf('The Doppler effect happens only with sound.', false, 'It happens with all waves, including light and radio waves.'),
    mcq('Doppler weather radar measures:', ['The speed of rain towards or away from the radar', 'Only the temperature', 'The cloud colour', 'The pressure at the ground'], 'The frequency shift reveals the radial velocity of the targets.'),
  ],
  assessment: [
    num('1,000 Hz source approaching at 68 m/s (c = 340). Frequency heard?', 1250, 1, 'Hz', '1,000 × 340 ÷ 272 = 1,250 Hz.'),
    num('1,000 Hz source receding at 68 m/s (c = 340). Frequency heard?', 833.3, 1, 'Hz', '1,000 × 340 ÷ 408 = 833.3 Hz.'),
    num('For an approaching source the denominator is c − vₛ. With c = 340 and vₛ = 85, its value?', 255, 0.5, 'm/s', '340 − 85 = 255.'),
    mcq('If source and observer move together at the same velocity, the shift is:', ['Zero', 'Large', 'Negative', 'Infinite'], 'There is no relative motion, so the frequency heard equals the frequency emitted.'),
    tf('A receding source is heard at a lower frequency.', true, 'The crests are stretched, so the frequency falls.'),
    tf('The simple Doppler formula for sound works for a source faster than sound.', false, 'The formula breaks down at and above the speed of sound.'),
  ],
  missionId: 'm-phys-doppler', sources: ['phak'],
});

export const induction = lesson('Induction', {
  id: 'phys-induction-generators', title: 'Electromagnetic Induction and Generators', minutes: 11, level: 2, prereqs: ['phys-magnetism', 'phys-electricity'],
  objectives: ['State that changing magnetic flux induces a voltage.', 'Calculate the voltage induced in a moving conductor.', 'Explain how an alternator makes electricity.'],
  intro: 'A magnet near a wire does nothing until something moves. Move a conductor across a magnetic field, and a voltage appears. This is how every aircraft generator and alternator makes the electricity the aircraft needs.',
  simple: 'Move a wire through a magnetic field and a voltage is made across it. The faster the motion, the stronger the field, or the longer the wire, the bigger the voltage. An alternator spins magnets past coils to do this continuously.',
  sections: [
    { h: 'Induction', body: [
      'When the **magnetic flux** through a circuit changes, a voltage is **induced** in it. This is **Faraday\'s law**.',
      'A static magnet next to a static wire induces nothing. A moving magnet, a moving wire or a changing field does.',
    ] },
    { h: 'A moving conductor', body: [
      'A conductor of length l moving at speed v at right angles to a field B has an induced voltage `ε = B × l × v`.',
      'B = 0.5 T, l = 0.2 m, v = 10 m/s: ε = 0.5 × 0.2 × 10 = 1.0 V. Doubling the speed doubles the voltage.',
    ], formula: 'induced-emf', lab: 'formula:induced-emf' },
    { h: 'Alternators and generators', body: [
      'An aircraft **alternator** is driven by the engine. A rotating magnet passes coils of wire, so the flux through each coil keeps changing and an alternating voltage is induced. A rectifier changes it to the direct current the battery and many systems need.',
      '**Lenz\'s law** says the induced current opposes the change that made it, which is why a generator is harder to turn when it supplies more power.',
    ], note: 'Aircraft electrical systems have approved operating procedures, limits and failure checklists. This lesson covers the physical principle only.' },
  ],
  examples: [
    { title: 'Moving conductor', steps: ['B = 0.8 T, l = 0.25 m, v = 5 m/s.', 'ε = 0.8 × 0.25 × 5.', 'ε = 1.0 V.'] },
    { title: 'Speed for a target voltage', steps: ['Need 2 V with B = 0.5 T, l = 0.4 m.', 'v = ε ÷ (B × l) = 2 ÷ 0.2.', 'v = 10 m/s.'] },
  ],
  practice: [
    num('B = 0.5 T, l = 0.2 m, v = 10 m/s. Induced voltage?', 1, 0.01, 'V', '0.5 × 0.2 × 10 = 1.0 V.'),
    num('B = 1 T, l = 0.5 m, v = 4 m/s. Induced voltage?', 2, 0.01, 'V', '1 × 0.5 × 4 = 2 V.'),
    mcq('A voltage is induced in a wire when:', ['The magnetic flux through it changes', 'It sits near a still magnet', 'It is cold', 'It carries no current'], 'Faraday\'s law: a changing flux induces a voltage.'),
    tf('A stationary magnet and a stationary wire produce a steady induced voltage.', false, 'Nothing changes, so no voltage is induced.'),
    mcq('Where does the electrical energy in an aircraft alternator come from?', ['The engine turning the rotor', 'The magnet itself, which never runs down', 'The wires heating up', 'The air in the cabin'], 'Mechanical energy from the engine is converted to electrical energy.'),
  ],
  assessment: [
    num('B = 0.8 T, l = 0.25 m, v = 5 m/s. Induced voltage?', 1, 0.01, 'V', '0.8 × 0.25 × 5 = 1.0 V.'),
    num('Speed needed for 2 V with B = 0.5 T and l = 0.4 m?', 10, 0.1, 'm/s', 'v = 2 ÷ (0.5 × 0.4) = 10 m/s.'),
    num('Doubling both the speed and the field strength multiplies the induced voltage by what factor?', 4, 0.01, '×', 'ε is proportional to B × v, so 2 × 2 = 4.'),
    mcq('A transformer works because:', ['A changing current in one coil induces a voltage in another', 'Magnets repel coils', 'Wires store charge', 'Heat moves current'], 'A changing field links the coils through induction.'),
    tf('A faster-moving conductor induces a larger voltage in the same field.', true, 'ε = B × l × v grows with v.'),
    tf('A generator becomes easier to turn when it supplies more electrical power.', false, 'By Lenz\'s law a loaded generator is harder to turn.'),
  ],
  missionId: 'm-phys-induction', sources: ['phak'],
});

export const wingLoading = lesson('Wing loading', {
  id: 'phys-wing-loading', title: 'Wing Loading and Stall Speed', minutes: 10, level: 2, prereqs: ['phys-lift', 'phys-weight'],
  objectives: ['Calculate wing loading.', 'Explain how wing loading affects stall speed and gust response.', 'Scale a stall speed with mass.'],
  intro: 'Two aircraft with the same wing area do not behave alike if one carries much more weight. Wing loading is the simple number that explains a lot about speed, handling and ride.',
  simple: 'Wing loading is how much weight each square metre of wing supports. Higher loading means the aircraft must fly faster to stay up and feels gusts less.',
  sections: [
    { h: 'Definition', body: [
      '`wing loading = mass ÷ wing area`, often in kg/m². A 1,100 kg aircraft with 16 m² of wing has 68.75 kg/m².',
      'Fuel burn lowers the mass, so the wing loading falls during a flight.',
    ], formula: 'wing-loading', lab: 'formula:wing-loading' },
    { h: 'Stall speed', body: [
      'To support the weight at the stalling angle, the lift equation shows the stall speed rises with the square root of the weight (and falls with the square root of the wing area).',
      'If the mass rises by 21 %, the stall speed rises by √1.21 = 1.1 or 10 %: a 50 kt stall speed becomes 55 kt. A mass 44 % higher gives √1.44 = 1.2: 60 kt becomes 72 kt.',
    ], lab: 'formula:stall-weight' },
    { h: 'Handling and ride', body: [
      'A **high wing loading** gives higher take-off, approach and landing speeds and longer runways, but the aircraft is less disturbed by gusts: a smoother ride in turbulence.',
      'A **low wing loading** (many light aircraft, gliders) gives short take-offs and slow approaches but a bumpier ride in gusty air.',
    ], note: 'Real stall speeds come from the aircraft flight manual for the actual weight, flap setting and bank angle. Use them, not the simple scaling here, in flight.' },
  ],
  examples: [
    { title: 'Wing loading', steps: ['Mass 780 kg, wing area 9.8 m².', '780 ÷ 9.8 = 79.6 kg/m².'] },
    { title: 'Stall speed with extra mass', steps: ['Vs = 60 kt at 1,000 kg.', 'Mass becomes 1,440 kg: ratio 1.44.', 'Vs = 60 × √1.44 = 60 × 1.2 = 72 kt.'] },
  ],
  practice: [
    num('Mass 1,100 kg and wing area 16 m². Wing loading?', 68.75, 0.1, 'kg/m²', '1,100 ÷ 16 = 68.75 kg/m².'),
    num('Wing area 20 m² and wing loading 50 kg/m². Mass?', 1000, 1, 'kg', '50 × 20 = 1,000 kg.'),
    num('Stall speed is 50 kt. The mass rises by 21 % (factor 1.21). New stall speed?', 55, 0.3, 'kt', '50 × √1.21 = 55 kt.'),
    mcq('A higher wing loading gives:', ['A higher stall speed', 'A lower stall speed', 'No change in stall speed', 'A shorter take-off'], 'More weight per area needs more speed to make the same lift.'),
    tf('As fuel is burned, the wing loading falls.', true, 'The mass falls while the wing area stays the same.'),
  ],
  assessment: [
    num('Mass 780 kg and wing area 9.8 m². Wing loading?', 79.6, 0.1, 'kg/m²', '780 ÷ 9.8 = 79.6 kg/m².'),
    num('Stall speed 60 kt at 1,000 kg. At 1,440 kg?', 72, 0.3, 'kt', '60 × √1.44 = 72 kt.'),
    num('Stall speed 48 kt at 900 kg. The mass falls to 576 kg (ratio 0.64). New stall speed?', 38.4, 0.3, 'kt', '48 × √0.64 = 48 × 0.8 = 38.4 kt.'),
    mcq('Which usually gives a smoother ride in gusty air?', ['A higher wing loading', 'A lower wing loading', 'A shorter wingspan', 'A lighter paint'], 'A heavier load per area is less disturbed by gusts.'),
    tf('Stall speed is proportional to the square root of the weight.', true, 'Doubling the weight raises the stall speed by about 41 %, not 100 %.'),
    tf('Aircraft flight manual stall speeds can be replaced by the simple scaling in this lesson.', false, 'Use the manual: it accounts for weight, flap setting and conditions.'),
  ],
  missionId: 'm-phys-wingload', sources: ['phak', 'nasa-lift'],
});

export const liftCurve = lesson('Lift curve', {
  id: 'phys-lift-curve', title: 'Angle of Attack and the Lift Curve', minutes: 12, level: 2, prereqs: ['phys-lift', 'phys-weight'],
  objectives: ['Define the angle of attack.', 'Relate lift coefficient to angle of attack.', 'Explain why the stall depends on angle, not on speed alone.'],
  intro: 'The angle between the wing and the oncoming air is the pilot\'s most important aerodynamic quantity. It sets the lift the wing makes at any speed and decides where the stall happens.',
  simple: 'Raise the angle of attack and the wing makes more lift, up to a limit. Past the critical angle the smooth airflow breaks away and lift collapses: that is a stall, and it can happen at any speed.',
  sections: [
    { h: 'Angle of attack', body: [
      'The **angle of attack** is the angle between the wing\'s chord line and the **relative airflow**. It is not the same as the pitch attitude of the aircraft.',
      'In a steady climb the nose is up, but the angle of attack may be small because the flight path is also tilted up.',
    ] },
    { h: 'The lift curve', body: [
      'The **lift coefficient CL** measures how effectively the wing makes lift. For a cambered wing, below the stall, CL rises roughly in a straight line with angle of attack. A simple model for learning: `CL ≈ 0.11 × (α + 2)`, with α in degrees.',
      'α = 4° gives CL ≈ 0.66; α = 8° gives CL = 1.10; α = 10° gives 1.32.',
    ], formula: 'cl-linear', lab: 'formula:cl-linear' },
    { h: 'Lift and the stall', body: [
      '`L = ½ ρ V² S CL`. With ρ = 1.225 kg/m³, V = 50 m/s, S = 16 m² and CL = 1.0, L = 0.5 × 1.225 × 2,500 × 16 = 24,500 N.',
      'At a lower speed the wing needs a higher CL, so a higher angle of attack, to make the same lift. At the **critical angle** (about 15° for many light aircraft) the airflow separates from the top of the wing and the lift drops: the wing **stalls**, whatever the airspeed.',
    ], note: 'The CL formula is a simplified model for learning. Real wings differ in camber, shape and critical angle, and the flight manual gives the real data.' },
  ],
  examples: [
    { title: 'CL', steps: ['α = 8°.', 'CL = 0.11 × (8 + 2).', 'CL = 1.10.'] },
    { title: 'Lift', steps: ['ρ = 1.225, V = 50 m/s, S = 16 m², CL = 0.5.', 'L = 0.5 × 1.225 × 2,500 × 16 × 0.5.', 'L = 12,250 N.'] },
  ],
  practice: [
    num('Using CL ≈ 0.11 × (α + 2), find CL at α = 4°.', 0.66, 0.005, '', '0.11 × 6 = 0.66.'),
    num('Using the same model, find CL at α = 10°.', 1.32, 0.005, '', '0.11 × 12 = 1.32.'),
    num('Lift for ρ = 1.225, V = 50 m/s, S = 16 m², CL = 1.0?', 24500, 30, 'N', '0.5 × 1.225 × 2,500 × 16 = 24,500 N.'),
    mcq('A stall occurs when:', ['The critical angle of attack is exceeded', 'The speed is exactly the stall speed in every case', 'The engine stops', 'The nose is above the horizon'], 'The critical angle of attack can be exceeded at any speed or attitude.'),
    tf('Angle of attack and pitch attitude are the same thing.', false, 'Angle of attack is measured against the relative airflow, not the horizon.'),
  ],
  assessment: [
    num('CL at α = 8° with the model?', 1.1, 0.005, '', '0.11 × 10 = 1.10.'),
    num('CL at α = 0° with the model?', 0.22, 0.005, '', '0.11 × 2 = 0.22.'),
    num('Lift for ρ = 1.225, V = 50 m/s, S = 16 m², CL = 0.5?', 12250, 20, 'N', '0.5 × 1.225 × 2,500 × 16 × 0.5 = 12,250 N.'),
    mcq('To make the same lift at a lower airspeed, the wing needs:', ['A higher angle of attack', 'A lower angle of attack', 'A smaller area', 'Less weight'], 'L = ½ρV²S CL: a lower V needs a higher CL.'),
    tf('Past the critical angle of attack the lift continues to increase.', false, 'The airflow separates and the lift drops: the wing stalls.'),
    tf('A wing can stall at any airspeed if its critical angle of attack is exceeded.', true, 'The stall depends on the angle of attack, not on the airspeed alone.'),
  ],
  missionId: 'm-phys-liftcurve', sources: ['phak', 'nasa-lift'],
});

export const physicsExpansion = { freeFall, projectile, circularMotion, buoyancy, hydraulics, humidity, adiabatic, doppler, induction, wingLoading, liftCurve };
