// Pre-Flight Academy physics, third batch: quantities, units, vectors, displacement, gravity, power, temperature.
import { lesson, mcq, num, tf } from './q';

export const quantities = lesson('Physical quantities', {
  id: 'phys-physical-quantities', title: 'Physical Quantities', minutes: 8, level: 1,
  objectives: ['Explain what a physical quantity is.', 'Name the SI base quantities used in mechanics.', 'Distinguish base from derived quantities.', 'Build derived units from base units.'],
  intro: 'Every instrument in a cockpit measures a physical quantity: speed, pressure, temperature, mass of fuel. Physics begins with being exact about what is measured and in which unit.',
  simple: 'A physical quantity is something you can measure. It is always a number together with a unit. A few basic quantities, such as length, mass and time, are combined to make all the others.',
  sections: [
    { h: 'Number and unit', body: [
      'A **physical quantity** is a numerical value multiplied by a unit: 1,200 m, 75 kg, 15 °C. A number without a unit is not a measurement.',
    ] },
    { h: 'Base quantities', body: [
      'The International System (SI) is built on seven **base quantities**: length (metre, m), mass (kilogram, kg), time (second, s), electric current (ampere, A), temperature (kelvin, K), amount of substance (mole, mol) and luminous intensity (candela, cd).',
      'Mechanics, and most of flight physics, needs only the first three plus temperature.',
    ] },
    { h: 'Derived quantities', body: [
      'All other quantities are **derived** by multiplying and dividing base quantities.',
      'Speed is length ÷ time (m/s). Force is mass × acceleration: the **newton**, N = kg·m/s². Pressure is force ÷ area: the **pascal**, Pa = N/m². Energy is force × distance: the **joule**, J = N·m. Power is energy ÷ time: the **watt**, W = J/s.',
      'A knot is a derived unit too: one nautical mile per hour, about 0.514 m/s.',
    ], formula: 'kt-ms', lab: 'formula:kt-ms', note: 'Checking units is a fast way to catch mistakes: if you are calculating a speed and the units come out as metres times seconds, the formula is wrong.' },
  ],
  examples: [
    { title: 'Building a unit', steps: ['Pressure is force divided by area.', 'Force is in newtons, area in square metres.', 'The unit of pressure is N/m², named the pascal.'] },
    { title: 'Knots to metres per second', steps: ['Convert 100 kt.', '100 × 0.5144 = 51.44.', '100 kt is about 51.4 m/s.'] },
  ],
  practice: [
    mcq('Which of these is an SI base quantity?', ['Time', 'Speed', 'Pressure', 'Energy'], 'Time (the second) is a base quantity; the others are derived.'),
    mcq('The SI unit of force is the:', ['Newton', 'Joule', 'Pascal', 'Watt'], 'N = kg·m/s².'),
    mcq('Speed is a derived quantity formed from:', ['Length divided by time', 'Mass times length', 'Time divided by length', 'Mass divided by time'], 'For example metres per second.'),
    num('Convert 100 kt to metres per second (1 kt = 0.5144 m/s).', 51.44, 0.1, 'm/s', '100 × 0.5144 = 51.44 m/s.'),
    tf('"The runway is 1,800 long" is a complete measurement.', false, 'Without a unit (metres or feet) the number is meaningless.'),
  ],
  assessment: [
    mcq('Which of the following is a base quantity in the SI?', ['Mass', 'Force', 'Speed', 'Power'], 'Mass (the kilogram) is a base quantity.'),
    num('How many base quantities does the SI have?', 7, 0.01, '', 'Length, mass, time, electric current, temperature, amount of substance and luminous intensity.'),
    mcq('One pascal is equal to:', ['One newton per square metre', 'One newton metre', 'One joule per second', 'One kilogram per cubic metre'], 'Pressure is force divided by area.'),
    mcq('One joule is equal to:', ['One newton metre', 'One newton per metre', 'One watt per second', 'One pascal per metre'], 'Energy is force multiplied by distance.'),
    mcq('Which of these is a derived quantity?', ['Pressure', 'Length', 'Time', 'Temperature'], 'Pressure is built from force and area.'),
    num('Convert 60 kt to metres per second (1 kt = 0.5144 m/s).', 30.86, 0.1, 'm/s', '60 × 0.5144 = 30.86 m/s.'),
    tf('A physical quantity always consists of a number and a unit.', true, 'The unit tells you what the number counts.'),
  ],
  missionId: 'm-phys-quantities', sources: ['si-brochure'],
});

export const siUnits = lesson('SI and aviation units', {
  id: 'phys-si-units', title: 'SI Units and Aviation Units', minutes: 9, level: 1, prereqs: ['phys-physical-quantities'],
  objectives: ['Name the SI units of the common quantities.', 'Recognise the non-SI units used in aviation.', 'Convert feet, nautical miles and knots to SI units.', 'Explain why a unit must always be stated.'],
  intro: 'Science uses metres and kilograms. Aviation flies in feet, nautical miles and knots. A pilot lives in both worlds and must cross between them without error.',
  simple: 'SI units are the international standard: metre, kilogram, second, kelvin. Aviation keeps a few older units by international agreement: feet for altitude, nautical miles for distance and knots for speed.',
  sections: [
    { h: 'SI units', body: [
      'Length in metres (m), mass in kilograms (kg), time in seconds (s), temperature in kelvin (K), force in newtons (N), pressure in pascals (Pa), energy in joules (J), power in watts (W).',
    ] },
    { h: 'Aviation units', body: [
      'Most of the world measures altitude in **feet**, distance in **nautical miles** and speed in **knots**. Pressure is set in **hectopascals** (hPa), or inches of mercury in some countries.',
      'These are fixed by exact definitions: `1 ft = 0.3048 m`, `1 NM = 1,852 m`, and 1 kt = 1 NM per hour = 1.852 km/h. `1 hPa = 100 Pa`.',
    ], formula: 'ft-m', lab: 'formula:ft-m' },
    { h: 'Why it matters', body: [
      'A unit error is a factor error: mistaking metres for feet is wrong by more than three times; mistaking kilograms for pounds is wrong by more than two.',
      'Always state the unit, read the unit on the document in front of you, and convert before calculating, not after.',
    ], note: 'Some states use metres for altitude or kilometres per hour for wind speed. The units in use are published for each state, and a pilot must check them before flying there.' },
  ],
  examples: [
    { title: 'Feet to metres', steps: ['Convert 5,000 ft.', '5,000 × 0.3048 = 1,524.', '5,000 ft is 1,524 m.'] },
    { title: 'Knots to km/h', steps: ['Convert 120 kt.', '120 × 1.852 = 222.24.', '120 kt is about 222 km/h.'] },
  ],
  practice: [
    num('Convert 5,000 ft to metres (1 ft = 0.3048 m).', 1524, 1, 'm', '5,000 × 0.3048 = 1,524 m.'),
    num('Convert 2 NM to metres (1 NM = 1,852 m).', 3704, 1, 'm', '2 × 1,852 = 3,704 m.'),
    mcq('The SI unit of pressure is the:', ['Pascal', 'Newton', 'Bar', 'Inch of mercury'], 'Pa = N/m².'),
    num('How many pascals are 5 hPa?', 500, 0.5, 'Pa', '5 × 100 = 500 Pa.'),
    mcq('In most of the world, altitude is measured in:', ['Feet', 'Nautical miles', 'Knots', 'Hectopascals'], 'Feet remain the usual unit of altitude in aviation.'),
  ],
  assessment: [
    num('Convert 10,000 ft to metres (1 ft = 0.3048 m).', 3048, 1, 'm', '10,000 × 0.3048 = 3,048 m.'),
    num('Convert 5 NM to metres (1 NM = 1,852 m).', 9260, 1, 'm', '5 × 1,852 = 9,260 m.'),
    num('Convert 100 kt to km/h (1 kt = 1.852 km/h).', 185.2, 0.2, 'km/h', '100 × 1.852 = 185.2 km/h.'),
    num('How many pascals are 1,013 hPa?', 101300, 5, 'Pa', '1,013 × 100 = 101,300 Pa.'),
    mcq('The SI unit of temperature is the:', ['Kelvin', 'Degree Celsius', 'Degree Fahrenheit', 'Joule'], 'The kelvin is the SI base unit of temperature.'),
    mcq('The SI unit of mass is the:', ['Kilogram', 'Newton', 'Pound', 'Gram'], 'The kilogram is the base unit; the newton is a unit of force.'),
    tf('The nautical mile is an SI unit.', false, 'It is a non-SI unit kept in use in aviation and at sea, defined as exactly 1,852 m.'),
  ],
  missionId: 'm-phys-si', sources: ['si-brochure'],
});

export const scalarsVectors = lesson('Scalars and vectors', {
  id: 'phys-scalars-and-vectors', title: 'Scalars and Vectors', minutes: 9, level: 1, prereqs: ['phys-si-units'],
  objectives: ['Distinguish scalar from vector quantities.', 'Give aviation examples of each.', 'Add vectors along a line and at right angles.', 'Find the horizontal component of a vector.'],
  intro: 'Wind of 20 knots tells you little. Wind of 20 knots from the north-west tells you what it will do to your aircraft. Direction turns a number into a vector.',
  simple: 'A scalar has only a size, like temperature or mass. A vector has a size and a direction, like force or velocity. Vectors in the same direction add; opposite ones subtract; at right angles you use Pythagoras.',
  sections: [
    { h: 'Two kinds of quantity', body: [
      '**Scalars** have magnitude only: mass, time, temperature, energy, speed, distance.',
      '**Vectors** have magnitude and direction: displacement, velocity, acceleration, force, weight, momentum.',
      'Speed is a scalar; velocity is speed in a stated direction.',
    ] },
    { h: 'Adding vectors', body: [
      'Along the same line, vectors add or subtract: 500 N forward and 200 N backward leave 300 N forward.',
      'At right angles, the **resultant** comes from Pythagoras: forces of 30 N and 40 N at 90° give √(30² + 40²) = 50 N.',
    ] },
    { h: 'Components', body: [
      'Any vector can be split into two perpendicular **components**. For a vector of size F at angle θ above the horizontal: `horizontal = F × cos θ` and `vertical = F × sin θ`.',
      'A 100 N force at 60° has a horizontal component of 100 × 0.5 = 50 N.',
      'This is how lift in a turn is split into a part that holds the aircraft up and a part that turns it.',
    ], formula: 'vector-x', lab: 'formula:vector-x', note: 'The four forces on an aircraft are all vectors. Their sizes alone never tell you what the aircraft will do; their directions matter just as much.' },
  ],
  examples: [
    { title: 'Opposing forces', steps: ['Thrust is 1,800 N forward and drag is 1,500 N backward.', '1,800 − 1,500 = 300.', 'The net force is 300 N forward.'] },
    { title: 'Component', steps: ['A 200 N force acts at 30° above the horizontal.', 'cos 30° = 0.866.', 'Horizontal component = 200 × 0.866 = 173.2 N.'] },
  ],
  practice: [
    mcq('Which of these is a vector quantity?', ['Force', 'Mass', 'Temperature', 'Energy'], 'Force has a direction.'),
    mcq('Which of these is a scalar quantity?', ['Time', 'Velocity', 'Weight', 'Displacement'], 'Time has no direction.'),
    num('Thrust is 1,800 N forward and drag is 1,500 N backward. Net force in newtons?', 300, 0.5, 'N', '1,800 − 1,500 = 300 N forward.'),
    num('Two forces of 6 N and 8 N act at right angles. Resultant in newtons?', 10, 0.05, 'N', '√(36 + 64) = 10 N.'),
    num('A 200 N force acts at 30° above the horizontal. Horizontal component in newtons?', 173.2, 0.5, 'N', '200 × cos 30° = 173.2 N.'),
  ],
  assessment: [
    mcq('Which of the following has both magnitude and direction?', ['Velocity', 'Speed', 'Energy', 'Mass'], 'Velocity is speed with a direction.'),
    mcq('Which of the following has magnitude only?', ['Temperature', 'Force', 'Acceleration', 'Momentum'], 'Temperature is a scalar.'),
    num('Two forces of 30 N and 40 N act at right angles. Resultant in newtons?', 50, 0.1, 'N', '√(900 + 1,600) = 50 N.'),
    num('A 100 N force acts at 60° above the horizontal. Horizontal component in newtons?', 50, 0.2, 'N', '100 × cos 60° = 50 N.'),
    num('A force of 500 N acts forward and 200 N acts backward. Net force in newtons?', 300, 0.5, 'N', '500 − 200 = 300 N forward.'),
    tf('Weight is a vector quantity.', true, 'It is a force, directed towards the centre of the Earth.'),
    tf('Speed is a vector quantity.', false, 'Speed has no direction; velocity does.'),
  ],
  missionId: 'm-phys-vectors', sources: ['phak'],
});

export const displacement = lesson('Distance and displacement', {
  id: 'phys-distance-and-displacement', title: 'Distance and Displacement', minutes: 8, level: 1, prereqs: ['phys-speed'],
  objectives: ['Distinguish distance from displacement.', 'Calculate displacement for a two-leg route.', 'Distinguish average speed from average velocity.', 'Explain why a circuit has zero displacement.'],
  intro: 'Fly a training circuit and you travel several miles, yet you finish exactly where you began. Distance and displacement answer two different questions: how far did you travel, and how far are you from where you started?',
  simple: 'Distance is the length of the path you actually travelled. Displacement is the straight line from start to finish, with its direction. They are equal only when you travel in a straight line without turning back.',
  sections: [
    { h: 'Two measures', body: [
      '**Distance** is a scalar: the total length of the path. **Displacement** is a vector: the straight-line change of position from start to end.',
      'Fly 30 NM north, then 40 NM east. Distance is 70 NM. Displacement is √(30² + 40²) = 50 NM, towards the north-east.',
      'Distance can never be smaller than the size of the displacement.',
    ] },
    { h: 'Returning to the start', body: [
      'If you finish where you began, your displacement is zero, however far you travelled. A complete circuit around an aerodrome has zero displacement.',
    ] },
    { h: 'Speed and velocity', body: [
      '`average speed = distance ÷ time` and `average velocity = displacement ÷ time`.',
      'On the two-leg route above flown in 0.5 h, average speed is 140 kt but the average velocity is only 100 kt towards the north-east.',
    ], formula: 'avg-velocity', lab: 'formula:avg-velocity', note: 'Fuel is burned along the distance flown, not along the displacement. A route with many turns costs more than the straight line between its ends.' },
  ],
  examples: [
    { title: 'Two legs', steps: ['Fly 6 NM east, then 8 NM north.', 'Distance = 6 + 8 = 14 NM.', 'Displacement = √(36 + 64) = 10 NM.'] },
    { title: 'Out and back', steps: ['Walk 3 km east, then 3 km west.', 'Distance = 6 km.', 'Displacement = 0 km: you are back at the start.'] },
  ],
  practice: [
    num('Fly 6 NM east, then 8 NM north. Total distance flown?', 14, 0.05, 'NM', '6 + 8 = 14 NM.'),
    num('Fly 6 NM east, then 8 NM north. Size of the displacement?', 10, 0.05, 'NM', '√(36 + 64) = 10 NM.'),
    mcq('Displacement is:', ['A vector: the straight-line change of position', 'A scalar: the length of the path', 'Always equal to distance', 'Measured in seconds'], 'It has a size and a direction.'),
    num('Walk 3 km east, then 3 km west. Size of the displacement?', 0, 0.01, 'km', 'You finish where you started.'),
    num('A displacement of 60 NM takes 0.5 h. Average velocity?', 120, 0.5, 'kt', '60 ÷ 0.5 = 120 kt.'),
  ],
  assessment: [
    num('Fly 30 NM north, then 40 NM east. Total distance flown?', 70, 0.1, 'NM', '30 + 40 = 70 NM.'),
    num('Fly 30 NM north, then 40 NM east. Size of the displacement?', 50, 0.1, 'NM', '√(900 + 1,600) = 50 NM.'),
    num('An aircraft flies a complete circuit and lands on the runway it left. Size of its displacement?', 0, 0.01, 'NM', 'It finished where it started.'),
    num('A displacement of 50 NM takes 0.5 h. Average velocity?', 100, 0.5, 'kt', '50 ÷ 0.5 = 100 kt.'),
    mcq('Distance is:', ['A scalar: the total length of the path', 'A vector with direction', 'Always zero for a circuit', 'The same as velocity'], 'It has no direction.'),
    tf('Distance travelled can never be less than the size of the displacement.', true, 'The straight line is the shortest path between two points.'),
    mcq('Average velocity is:', ['Displacement divided by time', 'Distance divided by time', 'Time divided by distance', 'Speed multiplied by time'], 'Velocity uses displacement; speed uses distance.'),
  ],
  missionId: 'm-phys-displacement', sources: ['phak'],
});

export const gravity = lesson('Gravity', {
  id: 'phys-gravity', title: 'Gravity', minutes: 9, level: 1, prereqs: ['phys-weight'],
  objectives: ['Describe gravity as attraction between masses.', 'Use g to find weight and free-fall speed.', 'Explain how gravity changes with distance from the Earth.', 'Explain why all objects fall at the same rate without air.'],
  intro: 'Gravity is the one force that never switches off. Every second of every flight, lift exists only to answer it.',
  simple: 'Every mass pulls on every other mass. The Earth is so massive that it pulls everything near it downward, giving falling objects an acceleration of about 9.81 metres per second, every second.',
  sections: [
    { h: 'Attraction between masses', body: [
      'Gravity is a force of attraction between any two masses. It grows with the masses and falls with the **square of the distance** between their centres: twice as far apart gives one quarter of the force.',
    ] },
    { h: 'g near the Earth', body: [
      'Near the surface, gravity gives every freely falling object the same acceleration, `g ≈ 9.81 m/s²`. Weight is `W = m × g`: an 80 kg person weighs 784.8 N.',
      'Without air resistance a heavy and a light object fall together: the heavier one is pulled harder, but it also has more mass to accelerate.',
      'Starting from rest, the speed after t seconds of free fall is `v = g × t`: after 3 s, 29.43 m/s.',
    ] },
    { h: 'Gravity at altitude', body: [
      'Distance is measured from the centre of the Earth, about 6,371 km below the surface. `g = g₀ × (R ÷ (R + h))²`.',
      'At an airliner cruising altitude of 11 km, g is only about 0.3% less than at sea level. Aircraft do not fly because gravity is weaker up there.',
      'Mass does not change with location. On the Moon, where g is about 1.62 m/s², the same 80 kg person weighs only 129.6 N.',
    ], formula: 'g-altitude', lab: 'formula:g-altitude', note: 'Astronauts in orbit float because they are in continuous free fall around the Earth, not because gravity is absent. At 400 km, g is still about 89% of its surface value.' },
  ],
  examples: [
    { title: 'Weight', steps: ['Find the weight of a 60 kg person on Earth.', 'W = 60 × 9.81.', 'W = 588.6 N.'] },
    { title: 'Free fall', steps: ['An object falls from rest for 2 s with no air resistance.', 'v = 9.81 × 2.', 'v = 19.62 m/s.'] },
  ],
  practice: [
    num('Find the weight of a 60 kg person standing on the Earth (g = 9.81 m/s²).', 588.6, 0.5, 'N', '60 × 9.81 = 588.6 N.'),
    num('An object falls from rest for 2 s without air resistance. Speed reached (g = 9.81 m/s²)?', 19.62, 0.05, 'm/s', '9.81 × 2 = 19.62 m/s.'),
    mcq('Gravity between two masses depends on:', ['Their masses and the distance between them', 'Their temperatures', 'Their colours', 'Their speeds only'], 'More mass, more force; more distance, less force.'),
    mcq('Compared with the Earth, a person on the Moon has:', ['The same mass but less weight', 'Less mass and less weight', 'The same mass and the same weight', 'More mass but less weight'], 'Mass is unchanged; g is smaller.'),
    tf('Astronauts in orbit float because there is no gravity at that height.', false, 'Gravity is still strong there; they are in continuous free fall.'),
  ],
  assessment: [
    num('Find the weight of an 80 kg person standing on the Earth (g = 9.81 m/s²).', 784.8, 0.5, 'N', '80 × 9.81 = 784.8 N.'),
    num('Find the weight of an 80 kg person standing on the Moon (g = 1.62 m/s²).', 129.6, 0.5, 'N', '80 × 1.62 = 129.6 N.'),
    num('An object falls from rest for 3 s without air resistance. Speed reached (g = 9.81 m/s²)?', 29.43, 0.05, 'm/s', '9.81 × 3 = 29.43 m/s.'),
    mcq('At an airliner cruising altitude of 11 km, g compared with sea level is:', ['About 0.3% less', 'About 30% less', 'Half as large', 'Zero'], 'The aircraft is only 11 km further from a centre 6,371 km away.'),
    mcq('If the distance between two masses doubles, the gravitational force between them becomes:', ['One quarter', 'One half', 'Twice as large', 'Four times as large'], 'It falls with the square of the distance.'),
    tf('Without air resistance, a heavy object falls faster than a light one.', false, 'Both have the same acceleration, g.'),
    tf('An object has the same mass on the Moon as on the Earth.', true, 'Mass is the amount of matter and does not depend on location.'),
  ],
  missionId: 'm-phys-gravity', sources: ['phak'],
});

export const power = lesson('Power', {
  id: 'phys-power-in-depth', title: 'Power in Depth', minutes: 10, level: 2, prereqs: ['phys-energy', 'phys-drag'],
  objectives: ['Calculate power from work and time.', 'Calculate power from force and speed.', 'Convert horsepower to kilowatts.', 'Relate excess power to rate of climb.'],
  intro: 'Two aircraft can lift the same load to the same height, but the one with more power gets there sooner. Power is what an engine really sells, and excess power is what makes an aircraft climb.',
  simple: 'Power is how fast work is done. A force pushing something along at a speed delivers power equal to force times speed. Whatever power is left after overcoming drag can be used to climb.',
  sections: [
    { h: 'Work per second', body: [
      '`P = W ÷ t`. One **watt** is one joule per second. Doing 6,000 J of work in 20 s is 300 W.',
      'Engines are also rated in horsepower: `1 hp ≈ 745.7 W`, so 100 hp is about 74.6 kW.',
    ] },
    { h: 'Force times speed', body: [
      'When a force moves something at a steady speed, `P = F × v`.',
      'A propeller giving 2,000 N of thrust at 50 m/s delivers 100,000 W, or 100 kW.',
      'In level flight thrust equals drag, so **power required = drag × true airspeed**.',
    ], formula: 'power-fv', lab: 'formula:power-fv' },
    { h: 'Excess power and climb', body: [
      '**Power available** minus **power required** is **excess power**. Excess power raises the aircraft against its weight: `rate of climb = excess power ÷ weight`.',
      'With 30,000 W of excess power and a weight of 10,000 N, the rate of climb is 3 m/s, about 590 ft/min.',
      'Anything that cuts power available (high altitude, high temperature) or raises power required (extra weight, extra drag) reduces the rate of climb.',
    ], note: 'This is a simplified model for understanding. Actual climb performance must come from the aircraft flight manual.' },
  ],
  examples: [
    { title: 'Power from force and speed', steps: ['Drag is 1,200 N at 40 m/s.', 'P = 1,200 × 40.', 'Power required is 48,000 W, or 48 kW.'] },
    { title: 'Rate of climb', steps: ['Excess power is 20,000 W and weight is 8,000 N.', '20,000 ÷ 8,000 = 2.5.', 'Rate of climb is 2.5 m/s.'] },
  ],
  practice: [
    num('Drag is 1,200 N at 40 m/s. Power required in watts?', 48000, 50, 'W', '1,200 × 40 = 48,000 W.'),
    num('Excess power is 20,000 W and weight is 8,000 N. Rate of climb in m/s?', 2.5, 0.01, 'm/s', '20,000 ÷ 8,000 = 2.5 m/s.'),
    mcq('One watt is equal to:', ['One joule per second', 'One newton per metre', 'One joule second', 'One newton per second'], 'Power is energy per unit of time.'),
    num('An engine does 9,000 J of work in 30 s. Power output in watts?', 300, 0.5, 'W', '9,000 ÷ 30 = 300 W.'),
    mcq('Adding weight to an aircraft, with the same engine power, will:', ['Reduce the rate of climb', 'Increase the rate of climb', 'Not affect the rate of climb', 'Increase power available'], 'Excess power falls and the weight to lift rises.'),
  ],
  assessment: [
    num('An engine does 6,000 J of work in 20 s. Power output in watts?', 300, 0.5, 'W', '6,000 ÷ 20 = 300 W.'),
    num('A propeller gives 2,000 N of thrust at 50 m/s. Power delivered in watts?', 100000, 100, 'W', '2,000 × 50 = 100,000 W.'),
    num('Convert 100 hp to kilowatts (1 hp = 745.7 W).', 74.57, 0.1, 'kW', '100 × 745.7 = 74,570 W = 74.57 kW.'),
    num('Excess power is 30,000 W and weight is 10,000 N. Rate of climb in m/s?', 3, 0.01, 'm/s', '30,000 ÷ 10,000 = 3 m/s.'),
    mcq('In steady level flight, power required equals:', ['Drag multiplied by true airspeed', 'Lift multiplied by true airspeed', 'Weight multiplied by altitude', 'Thrust divided by drag'], 'Thrust equals drag, and power is force times speed.'),
    mcq('An aircraft can climb steadily only if it has:', ['Excess power', 'Excess weight', 'More drag than thrust', 'Zero airspeed'], 'Rate of climb = excess power ÷ weight.'),
    tf('One kilowatt is 1,000 watts.', true, 'Kilo means one thousand.'),
  ],
  missionId: 'm-phys-power', sources: ['phak'],
});

export const temperature = lesson('Temperature', {
  id: 'phys-temperature', title: 'Temperature', minutes: 8, level: 1, prereqs: ['phys-si-units'],
  objectives: ['Explain what temperature measures.', 'Convert between Celsius, kelvin and Fahrenheit.', 'Explain absolute zero.', 'State why temperature matters for aircraft performance.'],
  intro: 'A hot day lengthens the take-off run, lowers the climb rate and changes what the altimeter means. Temperature is one of the first numbers a pilot reads in any weather report.',
  simple: 'Temperature tells you how fast the molecules of a substance are moving on average. Aviation uses degrees Celsius; physics uses kelvin, which starts at the coldest possible temperature; some countries also use Fahrenheit.',
  sections: [
    { h: 'What temperature is', body: [
      'Temperature is a measure of the average kinetic energy of the molecules in a substance. Hotter air has faster molecules, which spread further apart, so warm air is less dense than cold air at the same pressure.',
    ] },
    { h: 'Three scales', body: [
      '**Celsius**: water freezes at 0 °C and boils at 100 °C at standard sea-level pressure. **Kelvin**: `K = °C + 273.15`. **Fahrenheit**: `°F = 1.8 × °C + 32`.',
      '20 °C is 293.15 K and 68 °F. A change of 1 K is the same size as a change of 1 °C.',
    ], formula: 'c-to-f', lab: 'formula:c-to-f' },
    { h: 'Absolute zero', body: [
      'At 0 K (−273.15 °C) molecular motion is at its minimum. Nothing can be colder, so the kelvin scale has no negative values. That is why gas-law calculations must use kelvin.',
    ] },
    { h: 'Temperature in aviation', body: [
      'Weather reports give temperature in whole degrees Celsius. The standard atmosphere assumes 15 °C at sea level.',
      'Warmer than standard means thinner air: less lift at a given true airspeed, less engine power and less propeller thrust.',
    ], note: 'In very cold air an altimeter reads higher than the aircraft really is. Cold-temperature corrections are covered in the altimetry lessons.' },
  ],
  examples: [
    { title: 'Celsius to Fahrenheit', steps: ['Convert 30 °C.', '1.8 × 30 = 54.', '54 + 32 = 86 °F.'] },
    { title: 'Kelvin to Celsius', steps: ['Convert 250 K.', '250 − 273.15 = −23.15.', '250 K is −23.15 °C.'] },
  ],
  practice: [
    num('Convert 30 °C to degrees Fahrenheit.', 86, 0.1, '°F', '1.8 × 30 + 32 = 86 °F.'),
    num('Convert 25 °C to kelvin.', 298.15, 0.2, 'K', '25 + 273.15 = 298.15 K.'),
    num('Convert 250 K to degrees Celsius.', -23.15, 0.2, '°C', '250 − 273.15 = −23.15 °C.'),
    mcq('Temperature is a measure of:', ['The average kinetic energy of molecules', 'The total mass of a substance', 'The pressure of a gas', 'The number of molecules'], 'Faster molecules mean a higher temperature.'),
    mcq('At the same pressure, warm air compared with cold air is:', ['Less dense', 'More dense', 'Equally dense', 'Heavier'], 'The molecules are further apart.'),
  ],
  assessment: [
    num('Convert 20 °C to degrees Fahrenheit.', 68, 0.1, '°F', '1.8 × 20 + 32 = 68 °F.'),
    num('Convert −40 °C to kelvin.', 233.15, 0.2, 'K', '−40 + 273.15 = 233.15 K.'),
    num('Convert 300 K to degrees Celsius.', 26.85, 0.2, '°C', '300 − 273.15 = 26.85 °C.'),
    mcq('Absolute zero is:', ['0 K, or −273.15 °C', '0 °C', '−100 °C', '0 °F'], 'The lowest possible temperature.'),
    tf('A temperature change of 1 K is the same size as a change of 1 °C.', true, 'The two scales differ only in their zero point.'),
    mcq('On a day much warmer than standard, at the same pressure, the air is:', ['Less dense, so performance is reduced', 'More dense, so performance improves', 'Unchanged in density', 'Heavier, so lift increases'], 'Thin air reduces lift, engine power and thrust.'),
    tf('The kelvin scale has negative values.', false, 'It begins at absolute zero.'),
  ],
  missionId: 'm-phys-temperature', sources: ['phak'],
});
