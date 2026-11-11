import type { Track } from '../types';
import { lesson, mcq, num, order, planned, tf, match } from './q';
import { angles, arithmetic, estimation, fractions, negatives, percentages, powers, ratios } from './math2';

const SRC = ['si-brochure', 'phak'];

const units = lesson('Units and conversions', {
  id: 'math-units', title: 'Units and Conversions', minutes: 10, level: 1,
  objectives: [
    'Name the units pilots use for distance, height, speed, mass and pressure.',
    'Convert between aviation units and SI units using conversion factors.',
    'Check an answer by estimating whether it is reasonable.',
  ],
  intro: 'A number without a unit means nothing in aviation. "Climb to 3,000" is safe only because everyone agrees it means feet. In this lesson you learn the units pilots use and how to convert between them without mistakes.',
  simple: 'A unit tells you what a number measures. To change units, multiply by a conversion factor — a fraction that equals one, such as 1.852 km per nautical mile. Always write the unit next to the number and check that your answer is sensible.',
  sections: [
    { h: 'Why aviation mixes unit systems', body: [
      'Science uses the **SI system**: metres, kilograms, seconds. Aviation keeps several older units because charts, instruments and procedures were built around them.',
      'In most of the world, **altitude is in feet**, **horizontal distance is in nautical miles (NM)**, **speed is in knots (kt)** and **pressure is in hectopascals (hPa)**. Some countries use metres for altitude or inches of mercury for pressure, so a pilot must always know which unit is in use.',
    ] },
    { h: 'The key conversion factors', body: [
      '`1 NM = 1,852 m = 1.852 km` — the nautical mile is defined as exactly 1,852 metres.',
      '`1 kt = 1 NM per hour = 1.852 km/h ≈ 0.514 m/s`.',
      '`1 ft = 0.3048 m`, so `1 m ≈ 3.281 ft`.',
      '`1 hPa = 100 Pa`, `1 kg ≈ 2.205 lb`.',
    ], formula: 'kt-kmh', lab: 'formula:kt-kmh' },
    { h: 'The conversion method', body: [
      'Multiply by a fraction whose top and bottom are equal amounts in different units. Arrange it so the old unit cancels.',
      'Example: `120 kt × 1.852 (km/h per kt) = 222.24 km/h`. Going the other way, you divide: `222.24 km/h ÷ 1.852 = 120 kt`.',
      'Then **estimate**: a knot is almost 2 km/h, so 120 kt should be a little under 240 km/h. 222 is reasonable; 64.8 would not be.',
    ], note: 'A wrong unit can be more dangerous than a wrong number. Fuel loaded in pounds instead of kilograms has caused real fuel-exhaustion incidents.' },
  ],
  examples: [
    { title: 'Height in metres', steps: ['An aircraft flies at 5,000 ft. How many metres is that?', 'Use 1 ft = 0.3048 m.', '5,000 × 0.3048 = 1,524 m.', 'Estimate check: a metre is about 3.3 ft, and 5,000 ÷ 3.3 ≈ 1,500. The answer is reasonable.'] },
    { title: 'Speed in metres per second', steps: ['Convert 90 km/h to m/s.', '1 km = 1,000 m and 1 h = 3,600 s.', '90 × 1,000 ÷ 3,600 = 25 m/s.', 'Shortcut: divide km/h by 3.6.'] },
  ],
  practice: [
    num('Convert 120 kt to km/h.', 222.24, 1, 'km/h', '120 × 1.852 = 222.24 km/h.', 'Multiply knots by 1.852.'),
    num('Convert 10 NM to kilometres.', 18.52, 0.1, 'km', '10 × 1.852 = 18.52 km.', 'One nautical mile is 1.852 km.'),
    num('Convert 2,000 ft to metres.', 609.6, 2, 'm', '2,000 × 0.3048 = 609.6 m.', 'One foot is 0.3048 m.'),
    mcq('Which unit is normally used for altitude in international aviation?', ['Feet', 'Nautical miles', 'Knots', 'Hectopascals'], 'Altitude and height are given in feet in most of the world. Nautical miles measure horizontal distance.'),
    tf('One knot is one nautical mile per hour.', true, 'This is the definition of the knot.'),
    num('Convert 72 km/h to m/s.', 20, 0.2, 'm/s', '72 ÷ 3.6 = 20 m/s.', 'Divide km/h by 3.6.'),
  ],
  assessment: [
    num('Convert 100 kt to km/h.', 185.2, 1, 'km/h', '100 × 1.852 = 185.2 km/h.'),
    num('Convert 3,000 ft to metres.', 914.4, 2, 'm', '3,000 × 0.3048 = 914.4 m.'),
    num('Convert 1,013 hPa to pascals.', 101300, 10, 'Pa', '1 hPa = 100 Pa, so 1,013 × 100 = 101,300 Pa.'),
    num('Convert 50 kg to pounds (1 kg ≈ 2.205 lb).', 110.25, 0.5, 'lb', '50 × 2.205 = 110.25 lb.'),
    mcq('A nautical mile is exactly:', ['1,852 m', '1,609 m', '1,000 m', '1,760 m'], 'The international nautical mile is defined as 1,852 m. 1,609 m is a statute mile.'),
    mcq('You convert 150 kt and get 81 km/h. What should you conclude?', ['The answer is unreasonable — km/h must be a larger number than knots', 'The answer is correct', 'The answer is slightly too high', 'Knots cannot be converted to km/h'], 'A knot is larger than a km/h, so the number in km/h must be bigger (277.8 km/h). You divided instead of multiplying.'),
  ],
  missionId: 'm-math-units', sources: SRC,
});

const rearrange = lesson('Rearranging formulas', {
  id: 'math-rearrange', title: 'Rearranging Formulas', minutes: 12, level: 1,
  objectives: ['Explain why both sides of an equation must be treated equally.', 'Make any variable the subject of a simple formula.', 'Rearrange formulas that contain squares.'],
  intro: 'Almost every aviation calculation uses a formula. Often the formula is not written for the quantity you need. Rearranging lets you turn one formula into three.',
  simple: 'An equation is like a balance. Whatever you do to one side, do to the other. To move something across the equals sign, do the opposite operation: undo multiplying by dividing, undo adding by subtracting, undo a square with a square root.',
  sections: [
    { h: 'The balance idea', body: [
      'An equation says two things are equal. If you add, subtract, multiply or divide **both sides by the same amount**, they stay equal.',
      'To isolate a variable, undo what is being done to it, one step at a time, in reverse order.',
    ] },
    { h: 'One formula, three uses', body: [
      'Start with `speed = distance ÷ time`, or `v = d / t`.',
      'Multiply both sides by t: `d = v × t`.',
      'Then divide both sides by v: `t = d / v`.',
      'The same pattern works for pressure: `P = F / A` gives `F = P × A` and `A = F / P`.',
    ], formula: 'dst', lab: 'formula:dst' },
    { h: 'Squares and roots', body: [
      'Some formulas contain a squared variable, such as kinetic energy `E = ½ m v²`.',
      'To find v: multiply by 2, divide by m, then take the square root: `v = √(2E / m)`.',
      'The lift equation is rearranged the same way to find the speed needed to produce a given lift.',
    ], note: 'Do not take the square root of only part of a side. The root applies to the entire other side of the equation.' },
  ],
  examples: [
    { title: 'Solve 3x + 5 = 20', steps: ['Undo the + 5: subtract 5 from both sides → 3x = 15.', 'Undo the × 3: divide both sides by 3 → x = 5.', 'Check: 3 × 5 + 5 = 20. Correct.'] },
    { title: 'Force on a surface', steps: ['Pressure is 200,000 Pa on an area of 0.02 m². Find the force.', 'Start from P = F / A.', 'Multiply both sides by A: F = P × A.', 'F = 200,000 × 0.02 = 4,000 N.'] },
  ],
  practice: [
    mcq('Rearrange v = d / t to make t the subject.', ['t = d / v', 't = v / d', 't = d × v', 't = v − d'], 'Multiply both sides by t, then divide both sides by v.', 'First get t out of the denominator.'),
    num('Using d = v × t, find d when v = 110 kt and t = 1.5 h.', 165, 0.5, 'NM', '110 × 1.5 = 165 NM.'),
    num('Using t = d / v, find t when d = 240 NM and v = 120 kt.', 2, 0.01, 'h', '240 ÷ 120 = 2 h.'),
    order('Put the steps for solving 4x − 8 = 12 in the correct order.', ['Add 8 to both sides', 'Simplify to 4x = 20', 'Divide both sides by 4', 'Result: x = 5'], 'Undo the subtraction first, then the multiplication.'),
    mcq('Rearrange E = ½ m v² to make v the subject.', ['v = √(2E / m)', 'v = 2E / m', 'v = √(E / 2m)', 'v = (2E / m)²'], 'Multiply by 2, divide by m, then take the square root of the whole side.'),
  ],
  assessment: [
    mcq('Rearrange P = F / A to make A the subject.', ['A = F / P', 'A = P / F', 'A = F × P', 'A = P − F'], 'Multiply both sides by A, then divide both sides by P.'),
    num('Solve 5x + 10 = 45 for x.', 7, 0.001, '', 'Subtract 10 → 5x = 35. Divide by 5 → x = 7.'),
    num('Using F = P × A, find F when P = 150,000 Pa and A = 0.04 m².', 6000, 1, 'N', '150,000 × 0.04 = 6,000 N.'),
    num('Using v = d / t, find v when d = 90 NM and t = 0.75 h.', 120, 0.5, 'kt', '90 ÷ 0.75 = 120 kt.'),
    tf('If you divide the left side of an equation by 3, you must divide the right side by 3 as well.', true, 'An equation stays true only if both sides are treated equally.'),
    mcq('W = m × g. Which expression gives m?', ['m = W / g', 'm = W × g', 'm = g / W', 'm = W − g'], 'Divide both sides by g.'),
  ],
  missionId: 'm-math-rearrange', sources: ['phak'],
});

const pythagoras = lesson('Pythagorean theorem', {
  id: 'math-pythagoras', title: 'The Pythagorean Theorem', minutes: 10, level: 1,
  objectives: ['Identify the hypotenuse of a right-angled triangle.', 'Calculate a missing side with a² + b² = c².', 'Apply the theorem to slant range and wind components.'],
  intro: 'Whenever two directions are at right angles — across and along, horizontal and vertical — the Pythagorean theorem connects them. Pilots meet it in slant range, wind components and glide calculations.',
  simple: 'In a triangle with a 90° corner, square the two short sides and add them. The result is the square of the long side. Take the square root to get the long side.',
  sections: [
    { h: 'Right-angled triangles', body: [
      'A right-angled triangle has one 90° angle. The side opposite that angle is the **hypotenuse**. It is always the longest side.',
      'The theorem: `a² + b² = c²`, where c is the hypotenuse and a and b are the other two sides.',
    ], formula: 'pythagoras', lab: 'formula:pythagoras' },
    { h: 'Finding a shorter side', body: [
      'If you know the hypotenuse and one side, rearrange: `a = √(c² − b²)`.',
      'Remember that you subtract when looking for a short side and add when looking for the hypotenuse.',
    ] },
    { h: 'Aviation use: slant range', body: [
      'Distance-measuring equipment (DME) measures the straight-line distance from the aircraft to a ground station — the **slant range** — not the distance over the ground.',
      'An aircraft 6 NM high (about 36,000 ft) and 8 NM from the station over the ground is `√(6² + 8²) = 10 NM` away in slant range. Directly overhead, the DME reads the aircraft\'s height, not zero.',
    ], note: 'The theorem works only for right-angled triangles. For other triangles you need trigonometry.' },
  ],
  examples: [
    { title: 'The 3-4-5 triangle', steps: ['Sides a = 3 and b = 4.', 'c² = 3² + 4² = 9 + 16 = 25.', 'c = √25 = 5.'] },
    { title: 'Total wind from its components', steps: ['A wind gives a 12 kt headwind and a 9 kt crosswind on the runway.', 'Total² = 12² + 9² = 144 + 81 = 225.', 'Total wind = √225 = 15 kt.'] },
  ],
  practice: [
    num('a = 5, b = 12. Find the hypotenuse c.', 13, 0.01, '', '25 + 144 = 169, and √169 = 13.'),
    num('The hypotenuse is 10 and one side is 6. Find the other side.', 8, 0.01, '', '100 − 36 = 64, and √64 = 8.', 'Subtract the squares when finding a short side.'),
    mcq('Which side is the hypotenuse?', ['The side opposite the right angle', 'The shortest side', 'The side next to the right angle', 'Any side you choose'], 'The hypotenuse is opposite the 90° angle and is always the longest side.'),
    num('An aircraft is 3 NM above a DME station\'s level and 4 NM away over the ground. What slant range does the DME show?', 5, 0.05, 'NM', '√(3² + 4²) = 5 NM.'),
    tf('The Pythagorean theorem can be used on any triangle.', false, 'It applies only to right-angled triangles.'),
  ],
  assessment: [
    num('a = 8, b = 15. Find c.', 17, 0.01, '', '64 + 225 = 289, and √289 = 17.'),
    num('The hypotenuse is 13 and one side is 5. Find the other side.', 12, 0.01, '', '169 − 25 = 144, and √144 = 12.'),
    num('A wind has a 16 kt headwind component and a 12 kt crosswind component. What is the wind speed?', 20, 0.1, 'kt', '√(256 + 144) = √400 = 20 kt.'),
    mcq('An aircraft passes directly over a DME station at 6,076 ft (1 NM) above it. The DME reads approximately:', ['1 NM', '0 NM', '6 NM', '10 NM'], 'DME shows slant range. Directly overhead, the slant range equals the height above the station: 1 NM.'),
    tf('In a right-angled triangle the hypotenuse is always the longest side.', true, 'Because c² equals the sum of two positive squares, c is larger than either a or b.'),
  ],
  missionId: 'm-math-pythagoras', sources: ['phak'],
});

const trig = lesson('Trigonometry', {
  id: 'math-trig', title: 'Sine, Cosine and Tangent', minutes: 14, level: 2, prereqs: ['math-pythagoras'],
  objectives: ['Define sine, cosine and tangent as ratios of triangle sides.', 'Split a wind into headwind and crosswind components.', 'Use tangent to relate a descent angle to height and distance.'],
  intro: 'Trigonometry connects angles to lengths. It answers practical questions: how much of this wind blows across the runway? How high should I be 5 NM from touchdown?',
  simple: 'Sine, cosine and tangent are just ratios of two sides of a right-angled triangle. Sine tells you the "across" part, cosine tells you the "along" part. A wind 30° off the runway has half its speed as crosswind because sin 30° = 0.5.',
  sections: [
    { h: 'Three ratios', body: [
      'For an angle θ in a right-angled triangle, name the sides: **opposite** (across from θ), **adjacent** (next to θ) and **hypotenuse**.',
      '`sin θ = opposite / hypotenuse`, `cos θ = adjacent / hypotenuse`, `tan θ = opposite / adjacent`.',
      'Many students remember this as **SOH-CAH-TOA**.',
    ] },
    { h: 'Values worth knowing', body: [
      '`sin 0° = 0`, `sin 30° = 0.5`, `sin 45° ≈ 0.71`, `sin 60° ≈ 0.87`, `sin 90° = 1`.',
      'Cosine runs the opposite way: `cos 0° = 1`, `cos 60° = 0.5`, `cos 90° = 0`.',
    ] },
    { h: 'Wind components', body: [
      'A wind that meets the runway at an angle can be split into two parts at right angles.',
      '`crosswind = wind speed × sin(angle)` and `headwind = wind speed × cos(angle)`, where the angle is between the wind direction and the runway direction.',
      'Move the sliders and watch how the two components change. At 90° the whole wind is crosswind.',
    ], formula: 'crosswind', lab: 'trig' },
    { h: 'Tangent and the 3° approach', body: [
      'A standard approach path descends at about 3°. `tan 3° ≈ 0.0524`, and 1 NM = 6,076 ft, so the path is about `6,076 × 0.0524 ≈ 318 ft` above the runway for every nautical mile from touchdown.',
      'Pilots round this to the rule of thumb **"300 ft per NM"**.',
    ], note: 'Make sure your calculator is in degrees, not radians. sin 30 in radian mode gives −0.988, not 0.5.' },
  ],
  examples: [
    { title: 'Crosswind check', steps: ['Runway 27 (direction 270°). Wind from 300° at 20 kt.', 'Angle between wind and runway = 30°.', 'Crosswind = 20 × sin 30° = 20 × 0.5 = 10 kt.', 'Headwind = 20 × cos 30° = 20 × 0.866 ≈ 17 kt.'] },
    { title: 'Height on a 3° path', steps: ['How high is a 3° path at 4 NM from touchdown?', 'Height = distance × tan 3°.', '4 NM × 6,076 ft × 0.0524 ≈ 1,274 ft.', 'The rule of thumb gives 4 × 300 = 1,200 ft — close enough for a mental check.'] },
  ],
  practice: [
    num('Wind 20 kt at 30° to the runway. What is the crosswind component?', 10, 0.3, 'kt', '20 × sin 30° = 10 kt.', 'Crosswind uses sine.'),
    num('Wind 20 kt at 60° to the runway. What is the headwind component?', 10, 0.3, 'kt', '20 × cos 60° = 10 kt.', 'Headwind uses cosine.'),
    tf('A wind blowing at 90° to the runway is entirely crosswind.', true, 'sin 90° = 1 and cos 90° = 0.'),
    match('Match each ratio to its definition.', [['sin θ', 'opposite ÷ hypotenuse'], ['cos θ', 'adjacent ÷ hypotenuse'], ['tan θ', 'opposite ÷ adjacent']], 'SOH-CAH-TOA.'),
    num('Using the 300 ft per NM rule, how high should you be 5 NM from touchdown on a 3° path?', 1500, 100, 'ft', '5 × 300 = 1,500 ft (the exact value is about 1,590 ft).'),
  ],
  assessment: [
    num('Wind 30 kt at 30° to the runway. Crosswind component?', 15, 0.4, 'kt', '30 × sin 30° = 15 kt.'),
    num('Wind 24 kt at 60° to the runway. Headwind component?', 12, 0.4, 'kt', '24 × cos 60° = 12 kt.'),
    mcq('Which ratio is cos θ?', ['adjacent ÷ hypotenuse', 'opposite ÷ hypotenuse', 'opposite ÷ adjacent', 'hypotenuse ÷ adjacent'], 'CAH: cosine = adjacent over hypotenuse.'),
    mcq('The wind is exactly aligned with the runway. The crosswind component is:', ['Zero', 'Equal to the wind speed', 'Half the wind speed', 'Impossible to calculate'], 'The angle is 0° and sin 0° = 0.'),
    num('Wind 20 kt at 45° to the runway. Crosswind component? (sin 45° ≈ 0.707)', 14.1, 0.5, 'kt', '20 × 0.707 ≈ 14.1 kt.'),
    tf('tan θ is the opposite side divided by the adjacent side.', true, 'TOA: tangent = opposite over adjacent.'),
  ],
  missionId: 'm-math-trig', sources: ['phak'],
});

const vectors = lesson('Vectors', {
  id: 'math-vectors', title: 'Vectors', minutes: 12, level: 2, prereqs: ['math-trig'],
  objectives: ['Distinguish scalar and vector quantities.', 'Add vectors that are parallel or at right angles.', 'Explain how wind changes an aircraft\'s track and groundspeed.'],
  intro: 'An aircraft moves through air, and the air itself moves over the ground. To know where you will actually go, you must add two motions together. That is vector addition.',
  simple: 'A vector is a quantity with a size and a direction, drawn as an arrow. To add two vectors, put the tail of the second arrow on the tip of the first. An aircraft\'s path over the ground is its motion through the air plus the motion of the air.',
  sections: [
    { h: 'Scalars and vectors', body: [
      'A **scalar** has only a size: mass, temperature, time, speed.',
      'A **vector** has a size and a direction: velocity, force, acceleration, wind.',
      '"120 kt" is a speed. "120 kt heading north" is a velocity.',
    ] },
    { h: 'Adding vectors', body: [
      'Draw the first arrow. Start the second arrow at the tip of the first. The **resultant** runs from the start of the first to the tip of the second.',
      'Parallel vectors simply add or subtract. A 100 kt airspeed with a 20 kt tailwind gives 120 kt over the ground; with a 20 kt headwind, 80 kt.',
      'Vectors at right angles combine with the Pythagorean theorem.',
    ] },
    { h: 'The wind triangle', body: [
      'Three vectors form the **wind triangle**: the air vector (heading and true airspeed), the wind vector (direction and speed), and the ground vector (track and groundspeed).',
      'To fly a chosen track with a crosswind, the pilot points the nose slightly into the wind. This offset is the **wind correction angle**.',
      'Use the simulator below: set a wind and see the heading needed to hold the track.',
    ], lab: 'wind', note: 'Wind direction is always given as the direction the wind blows FROM. A "270° wind" moves the air toward the east.' },
  ],
  examples: [
    { title: 'Groundspeed with a headwind', steps: ['True airspeed 110 kt. Headwind 25 kt.', 'The vectors are opposite, so subtract.', 'Groundspeed = 110 − 25 = 85 kt.'] },
    { title: 'Two forces at right angles', steps: ['A 30 N force acts east and a 40 N force acts north.', 'Resultant = √(30² + 40²) = √2,500 = 50 N.', 'It points north-east, closer to north because the northward force is larger.'] },
  ],
  practice: [
    mcq('Which of these is a vector?', ['Velocity', 'Temperature', 'Mass', 'Time'], 'Velocity has a size and a direction. The others have size only.'),
    num('True airspeed 100 kt with a 20 kt tailwind. Groundspeed?', 120, 0.5, 'kt', 'Tailwind adds: 100 + 20 = 120 kt.'),
    num('True airspeed 100 kt with a 20 kt headwind. Groundspeed?', 80, 0.5, 'kt', 'Headwind subtracts: 100 − 20 = 80 kt.'),
    num('Forces of 30 N and 40 N act at right angles. What is the resultant?', 50, 0.2, 'N', '√(900 + 1,600) = 50 N.'),
    tf('A wind reported as 090° blows toward the east.', false, 'Wind direction is where the wind comes FROM. A 090° wind blows from the east toward the west.'),
  ],
  assessment: [
    mcq('Which of these is a scalar?', ['Speed', 'Velocity', 'Force', 'Acceleration'], 'Speed has no direction. Velocity is speed with a direction.'),
    num('True airspeed 140 kt with a 30 kt headwind. Groundspeed?', 110, 0.5, 'kt', '140 − 30 = 110 kt.'),
    num('Vectors of 6 and 8 units act at right angles. Size of the resultant?', 10, 0.05, '', '√(36 + 64) = 10.'),
    mcq('With a crosswind from the left, to hold a straight track the pilot must:', ['Point the nose slightly left, into the wind', 'Point the nose slightly right, away from the wind', 'Fly faster', 'Do nothing'], 'The nose is turned into the wind by the wind correction angle so the resultant follows the desired track.'),
    mcq('The three vectors of the wind triangle are:', ['Air vector, wind vector, ground vector', 'Lift, weight, drag', 'Speed, time, distance', 'Heading, altitude, pressure'], 'Heading/TAS + wind = track/groundspeed.'),
  ],
  missionId: 'm-math-vectors', sources: ['phak'],
});

const dst = lesson('Distance, speed and time', {
  id: 'math-dst', title: 'Distance, Speed and Time', minutes: 10, level: 1, prereqs: ['math-rearrange'],
  objectives: ['Use d = v × t in all three forms.', 'Convert between minutes and decimal hours.', 'Calculate flight time and fuel required for a leg.'],
  intro: 'How long will the flight take? How far can I go in 20 minutes? How much fuel do I need? All three questions use one relationship.',
  simple: 'Distance equals speed multiplied by time. With knots and hours you get nautical miles. Always turn minutes into hours first by dividing by 60.',
  sections: [
    { h: 'One relationship', body: [
      '`distance = speed × time`. With speed in knots and time in hours, distance is in nautical miles.',
      'Rearranged: `time = distance ÷ speed` and `speed = distance ÷ time`.',
    ], formula: 'dst', lab: 'formula:dst' },
    { h: 'Minutes and hours', body: [
      'Speeds are per hour, but flight legs are usually measured in minutes. Convert first: `hours = minutes ÷ 60`.',
      '20 min = 0.333 h, 30 min = 0.5 h, 45 min = 0.75 h.',
      'A quick mental method: at 120 kt you cover 2 NM per minute; at 90 kt, 1.5 NM per minute; at 60 kt, 1 NM per minute.',
    ] },
    { h: 'Fuel is the same idea', body: [
      '`fuel used = fuel flow × time`. An engine burning 30 L/h for 2.5 h uses 75 L.',
      'Real flight planning adds taxi fuel, reserves and contingency. You will meet those rules in the PPL flight-planning subject.',
    ], note: 'Use groundspeed, not airspeed, for time calculations. Wind changes how fast you cross the ground.' },
  ],
  examples: [
    { title: 'Time for a leg', steps: ['Distance 150 NM, groundspeed 100 kt.', 't = d ÷ v = 150 ÷ 100 = 1.5 h.', '1.5 h = 1 h 30 min.'] },
    { title: 'Distance in 20 minutes', steps: ['Groundspeed 120 kt, time 20 min.', '20 min = 20 ÷ 60 = 0.333 h.', 'd = 120 × 0.333 = 40 NM.', 'Mental check: 2 NM per minute × 20 min = 40 NM.'] },
  ],
  practice: [
    num('Distance 150 NM at a groundspeed of 100 kt. Flight time in minutes?', 90, 1, 'min', '150 ÷ 100 = 1.5 h = 90 min.'),
    num('Groundspeed 120 kt for 20 minutes. Distance?', 40, 0.5, 'NM', '120 × (20 ÷ 60) = 40 NM.', 'Convert minutes to hours first.'),
    num('You cover 45 NM in 30 minutes. Groundspeed?', 90, 0.5, 'kt', '45 ÷ 0.5 h = 90 kt.'),
    num('Fuel flow 30 L/h for 2.5 hours. Fuel used?', 75, 0.5, 'L', '30 × 2.5 = 75 L.'),
    mcq('Which speed should you use to calculate time between two points on the ground?', ['Groundspeed', 'Indicated airspeed', 'Vertical speed', 'Wind speed'], 'Groundspeed is the speed over the ground, which already includes the effect of wind.'),
  ],
  assessment: [
    num('Distance 210 NM at 140 kt. Flight time in minutes?', 90, 1, 'min', '210 ÷ 140 = 1.5 h = 90 min.'),
    num('Groundspeed 90 kt for 40 minutes. Distance?', 60, 0.5, 'NM', '90 × (40 ÷ 60) = 60 NM.'),
    num('You cover 25 NM in 15 minutes. Groundspeed?', 100, 0.5, 'kt', '25 ÷ 0.25 h = 100 kt.'),
    num('Fuel flow 36 L/h for 1 h 30 min. Fuel used?', 54, 0.5, 'L', '36 × 1.5 = 54 L.'),
    num('How many hours is 45 minutes, as a decimal?', 0.75, 0.005, 'h', '45 ÷ 60 = 0.75 h.'),
    tf('At a groundspeed of 60 kt you travel 1 NM every minute.', true, '60 NM per hour ÷ 60 minutes = 1 NM per minute.'),
  ],
  missionId: 'm-math-dst', sources: ['phak'],
});

export const mathTrack: Track = {
  id: 'math', title: 'Mathematics', short: 'Maths', color: '#3a8dde',
  blurb: 'From arithmetic to vectors — the calculation skills every pilot uses.',
  modules: [
    { id: 'math-numbers', title: 'Numbers and Arithmetic', lessons: [arithmetic, negatives, fractions, percentages, ratios, estimation, ...planned('math', ['Decimals'])] },
    { id: 'math-measure', title: 'Units and Measurement', lessons: [units, powers, ...planned('math', ['Scientific Notation'])] },
    { id: 'math-algebra', title: 'Algebra', lessons: [...planned('math', ['Basic Algebra', 'Equations']), rearrange] },
    { id: 'math-geometry', title: 'Geometry and Trigonometry', lessons: [angles, pythagoras, trig, ...planned('math', ['Geometry', 'Triangles'])] },
    { id: 'math-vectors-m', title: 'Vectors and Coordinates', lessons: [vectors, ...planned('math', ['Basic Coordinate Systems'])] },
    { id: 'math-functions', title: 'Functions and Change', lessons: planned('math', ['Graphs and Functions', 'Linear Relationships', 'Quadratic Relationships', 'Rate of Change', 'Introductory Calculus Concepts', 'Basic Statistics']) },
    { id: 'math-aviation', title: 'Aviation Mathematics', lessons: [dst, ...planned('math', ['Navigation Calculations and the 1-in-60 Rule', 'Climb and Descent Gradients', 'Fuel and Endurance Calculations'])] },
  ],
};
