// Pre-Flight Academy mathematics, fifth batch (expansion): proportion, circles, area and volume, general triangles,
// exponentials, the wind triangle, moments, time, accuracy and probability. Every question is original practice material.
import { lesson, mcq, num, tf } from './q';

export const proportion = lesson('Proportion', {
  id: 'math-proportion', title: 'Direct and Inverse Proportion', minutes: 10, level: 1, prereqs: ['math-ratios', 'math-dst'],
  objectives: ['Recognise direct and inverse proportion.', 'Solve problems with a constant of proportionality.', 'Apply proportion to fuel, time and speed.'],
  intro: 'Many flight calculations are proportions in disguise: fuel used against time, time against speed, distance against time. Recognising which kind of proportion applies turns a tricky problem into one line of arithmetic.',
  simple: 'Direct proportion: double one quantity and the other doubles. Inverse proportion: double one and the other halves. For the same distance, a faster speed means a shorter time.',
  sections: [
    { h: 'Direct proportion', body: [
      'Two quantities are **directly proportional** if their ratio never changes: `y = k × x`, where **k** is the **constant of proportionality**.',
      'At a steady burn of 24 L/h, fuel used is directly proportional to time. 2.5 h uses 24 × 2.5 = 60 L, and 5 h uses double: 120 L.',
      'On a graph a direct proportion is a straight line through the origin.',
    ], formula: 'direct-prop', lab: 'formula:direct-prop' },
    { h: 'Inverse proportion', body: [
      'Two quantities are **inversely proportional** if their product never changes: `x × y = constant`. When one rises, the other falls in the same ratio.',
      'For a fixed distance, `speed × time = distance`. Raising the groundspeed from 120 kt to 180 kt (×1.5) cuts a 90-minute leg to 90 ÷ 1.5 = 60 minutes.',
    ], lab: 'formula:inverse-prop' },
    { h: 'Choosing the right type', body: [
      'Ask: "if I double this, what happens to that?" Doubles → direct. Halves → inverse. Something else → it is neither, and a simple proportion does not apply.',
      'The unitary method works for both: find the value for one unit, then scale.',
    ], note: 'Proportion assumes a steady rate. Fuel burn in a climb is not the same as in the cruise, so a cruise rate cannot be applied to the whole flight.' },
  ],
  examples: [
    { title: 'Direct: fuel', steps: ['12 L burned in 30 min at a steady rate.', 'Rate = 12 ÷ 0.5 h = 24 L/h.', 'In 2 h: 24 × 2 = 48 L.'] },
    { title: 'Inverse: time', steps: ['A leg takes 90 min at 120 kt.', 'Distance = 120 × 1.5 h = 180 NM.', 'At 180 kt: 180 ÷ 180 = 1 h = 60 min.'] },
  ],
  practice: [
    num('12 L are burned in 30 minutes at a steady rate. How many litres in 2 hours?', 48, 0.1, 'L', '12 L per half hour is 24 L/h, so 2 h uses 48 L.'),
    num('A leg takes 90 minutes at 120 kt. How many minutes at 180 kt over the same distance?', 60, 0.5, 'min', '90 × 120 ÷ 180 = 60 min.'),
    mcq('Which pair is inversely proportional (for a fixed distance)?', ['Groundspeed and time', 'Fuel used and time at a steady rate', 'Distance and time at a steady speed', 'Mass and weight'], 'For a fixed distance, speed × time is constant, so a higher speed means a shorter time.'),
    num('A trip takes 3 hours at 100 kt. How many hours at 150 kt?', 2, 0.01, 'h', '3 × 100 ÷ 150 = 2 h.'),
    tf('If y is directly proportional to x, doubling x doubles y.', true, 'The ratio y ÷ x stays the same, so y doubles with x.'),
  ],
  assessment: [
    num('45 NM are flown in 30 minutes at a steady speed. How far in 80 minutes?', 120, 0.5, 'NM', '45 NM in 30 min is 90 kt. 90 × (80 ÷ 60) = 120 NM.'),
    num('A pump fills 60 L in 5 minutes. How many minutes for 150 L?', 12.5, 0.05, 'min', '60 L in 5 min is 12 L/min. 150 ÷ 12 = 12.5 min.'),
    num('A leg takes 4 hours at 90 kt. How many hours at 120 kt?', 3, 0.01, 'h', '4 × 90 ÷ 120 = 3 h.'),
    num('y = kx, and y = 36 when x = 9. What is k?', 4, 0.01, '', 'k = 36 ÷ 9 = 4.'),
    mcq('Fuel burned at a constant rate and time flown are:', ['Directly proportional', 'Inversely proportional', 'Not related', 'Equal'], 'Twice the time burns twice the fuel at a steady rate.'),
    tf('In inverse proportion, the product of the two quantities stays constant.', true, 'x × y = constant, so raising x lowers y in the same ratio.'),
  ],
  missionId: 'm-math-proportion', sources: ['phak'],
});

export const circles = lesson('Circles', {
  id: 'math-circles', title: 'Circles, Arcs and Turns', minutes: 10, level: 2, prereqs: ['math-geometry', 'math-angles'],
  objectives: ['Calculate circumference and area of a circle.', 'Find the length of an arc.', 'Relate turn rate and time to the angle turned.'],
  intro: 'A turn is an arc of a circle. Orbits in the holding pattern, procedure turns and the circuit all rest on a few circle formulas and one simple rule about angles.',
  simple: 'The distance round a circle is 2 × π × radius. An arc is just a fraction of that distance, found from its angle out of 360.',
  sections: [
    { h: 'Circumference and area', body: [
      'The **circumference** is the distance round: `C = 2πr`. The **area** inside is `A = πr²`. Use π ≈ 3.14.',
      'A circle of radius 5 m has C = 2 × 3.14 × 5 = 31.4 m and A = 3.14 × 25 = 78.5 m². The **diameter** is twice the radius.',
    ] },
    { h: 'Arcs', body: [
      'An **arc** is part of the circumference. It is the same fraction of the whole as the angle is of 360°: `s = θ ÷ 360 × 2πr`.',
      'A quarter turn (90°) round a circle of radius 10 m is a quarter of 62.8 m, which is 15.7 m.',
    ], formula: 'circumference', lab: 'formula:circumference' },
    { h: 'Turn rate and time', body: [
      'At the **standard rate** of 3° per second a full circle takes 360 ÷ 3 = 120 s (two minutes). A 180° turn takes 60 s and a 90° turn 30 s.',
      'The time for a turn is `angle ÷ turn rate`. This is why a heading change of 45° takes 15 seconds at rate one.',
    ], note: 'The radius of the turn depends on speed: at the same rate, a faster aircraft flies a wider circle.' },
  ],
  examples: [
    { title: 'Arc length', steps: ['Radius 12 m, angle 60°.', 'Fraction = 60 ÷ 360 = 1/6.', 'Circumference = 2 × 3.1416 × 12 = 75.4 m.', 'Arc = 75.4 ÷ 6 = 12.6 m.'] },
    { title: 'Turn time', steps: ['Turn through 135° at 3° per second.', 't = 135 ÷ 3 = 45 s.'] },
  ],
  practice: [
    num('Circumference of a circle with radius 10 m (use π = 3.1416)?', 62.83, 0.05, 'm', '2 × 3.1416 × 10 = 62.83 m.'),
    num('A circle has a diameter of 8 m. What is its radius?', 4, 0.01, 'm', 'Radius is half the diameter.'),
    num('Arc length for a 90° arc of a circle with radius 10 m?', 15.71, 0.05, 'm', 'A quarter of 62.83 m is 15.71 m.'),
    num('How many seconds to turn through 45° at 3° per second?', 15, 0.1, 's', '45 ÷ 3 = 15 s.'),
    tf('A full circle contains 360 degrees.', true, 'A full turn is 360°.'),
  ],
  assessment: [
    num('Circumference of a circle with radius 7 m (π = 3.1416)?', 43.98, 0.05, 'm', '2 × 3.1416 × 7 = 43.98 m.'),
    num('Area of a circle with radius 4 m (π = 3.1416)?', 50.27, 0.05, 'm²', 'π × 16 = 50.27 m².'),
    num('Arc length of a 60° arc with radius 12 m?', 12.57, 0.05, 'm', 'One sixth of 2π × 12 = 75.4 m is 12.57 m.'),
    num('A circle has a circumference of 31.416 m. Radius?', 5, 0.02, 'm', 'r = C ÷ 2π = 31.416 ÷ 6.2832 = 5 m.'),
    num('How long does a 180° turn take at 3° per second?', 60, 0.1, 's', '180 ÷ 3 = 60 s.'),
    tf('Doubling the radius doubles the circumference.', true, 'C = 2πr is directly proportional to r.'),
    tf('Doubling the radius doubles the area.', false, 'Area depends on r², so doubling the radius makes the area four times larger.'),
  ],
  missionId: 'm-math-circles', sources: ['phak'],
});

export const areaVolume = lesson('Area and volume', {
  id: 'math-area-volume', title: 'Area, Volume and Capacity', minutes: 11, level: 2, prereqs: ['math-geometry', 'math-units'],
  objectives: ['Find the area of rectangles, triangles, trapezoids and circles.', 'Find the volume of boxes and cylinders.', 'Convert between cubic metres and litres.'],
  intro: 'Wing area, tank capacity and cargo volume are all area and volume problems. The formulas are short; most mistakes come from mixing units.',
  simple: 'Area counts squares and volume counts cubes. Multiply the lengths together, keep the units the same, and remember that 1 cubic metre is 1,000 litres.',
  sections: [
    { h: 'Area', body: [
      '**Rectangle:** `A = length × width`. A wing of span 10 m and chord 1.5 m has about 15 m².',
      '**Triangle:** `A = ½ × base × height`. **Trapezoid:** `A = ½ × (a + b) × height`, where a and b are the parallel sides. **Circle:** `A = πr²`.',
      'Doubling every length multiplies the area by four, not two.',
    ] },
    { h: 'Volume and capacity', body: [
      '**Box:** `V = length × width × height`. **Cylinder:** `V = πr²h`.',
      'A tank 0.5 m × 0.4 m × 0.3 m has V = 0.06 m³. Since **1 m³ = 1,000 litres**, it holds 60 L.',
    ], formula: 'volume-cyl', lab: 'formula:volume-cyl' },
    { h: 'Keep the units straight', body: [
      'Convert all lengths to the same unit before you multiply. A length in centimetres and one in metres give nonsense.',
      'Areas are in square units and volumes in cubic units. Converting 1 m² to cm² multiplies by 100 × 100 = 10,000.',
    ], note: 'Real fuel capacity comes from the aircraft manual, which lists usable fuel. Geometry gives only an estimate.' },
  ],
  examples: [
    { title: 'Tank capacity', steps: ['Tank 0.5 m × 0.4 m × 0.3 m.', 'V = 0.06 m³.', '0.06 × 1,000 = 60 L.'] },
    { title: 'Trapezoid wing panel', steps: ['Parallel sides 2 m and 4 m, height 3 m.', 'A = ½ × (2 + 4) × 3 = 9 m².'] },
  ],
  practice: [
    num('A wing is 10 m long (span) with an average chord of 1.5 m. Area?', 15, 0.05, 'm²', '10 × 1.5 = 15 m².'),
    num('A tank measures 0.5 m × 0.4 m × 0.3 m. How many litres does it hold?', 60, 0.5, 'L', '0.06 m³ × 1,000 = 60 L.'),
    num('Area of a triangle with base 6 m and height 4 m?', 12, 0.05, 'm²', '½ × 6 × 4 = 12 m².'),
    num('Volume of a cylinder with radius 0.2 m and length 1 m (π = 3.1416), in litres?', 125.7, 0.5, 'L', 'π × 0.04 × 1 = 0.1257 m³ = 125.7 L.'),
    mcq('How many litres are in 1 cubic metre?', ['1,000', '100', '10', '10,000'], '1 m³ is 100 cm × 100 cm × 100 cm = 1,000,000 cm³ = 1,000 L.'),
  ],
  assessment: [
    num('Trapezoid with parallel sides 2 m and 4 m and height 3 m. Area?', 9, 0.05, 'm²', '½ × (2 + 4) × 3 = 9 m².'),
    num('A cylinder has radius 0.1 m and length 0.5 m (π = 3.1416). Capacity in litres?', 15.71, 0.1, 'L', 'π × 0.01 × 0.5 = 0.01571 m³ = 15.71 L.'),
    num('A wing has a span of 11 m and a chord of 1.6 m. Area?', 17.6, 0.05, 'm²', '11 × 1.6 = 17.6 m².'),
    num('A tank measures 2 m × 1 m × 0.5 m. How many litres?', 1000, 1, 'L', '1 m³ = 1,000 L.'),
    mcq('If every length of a rectangle is doubled, its area becomes:', ['Four times larger', 'Two times larger', 'Unchanged', 'Eight times larger'], 'Area depends on two lengths, so 2 × 2 = 4.'),
    tf('Volumes are measured in square units.', false, 'Volumes use cubic units; areas use square units.'),
  ],
  missionId: 'm-math-area', sources: ['phak'],
});

export const sineCosine = lesson('General triangles', {
  id: 'math-sine-cosine', title: 'Sine and Cosine Rules', minutes: 13, level: 3, prereqs: ['math-trig', 'math-triangles'],
  objectives: ['Use the sine rule to find a side.', 'Use the cosine rule for the third side.', 'Choose the right rule for the information given.'],
  intro: 'Right-angled triangles are only part of the story. A wind triangle rarely has a right angle in it. The sine and cosine rules extend trigonometry to any triangle.',
  simple: 'Sine rule: each side divided by the sine of its opposite angle gives the same number. Cosine rule: Pythagoras with a correction for the angle between two sides.',
  sections: [
    { h: 'Labelling', body: [
      'Name the sides **a**, **b**, **c** and the angle opposite each as **A**, **B**, **C**. The three angles always add up to 180°.',
      'If you know two angles, the third is 180° minus their sum.',
    ] },
    { h: 'The sine rule', body: [
      '`a ÷ sin A = b ÷ sin B = c ÷ sin C`. Use it when you know a side and the angle opposite it, plus one more angle or side.',
      'To find b: `b = a × sin B ÷ sin A`. With a = 8, A = 40° and B = 60°: b = 8 × 0.8660 ÷ 0.6428 = 10.78.',
    ], formula: 'sine-rule', lab: 'formula:sine-rule' },
    { h: 'The cosine rule', body: [
      '`c² = a² + b² − 2ab cos C`. Use it when you know two sides and the angle **between** them, or all three sides.',
      'When C = 90°, cos C = 0 and the rule becomes Pythagoras: `c² = a² + b²`.',
      'With a = 7, b = 8, C = 60°: c² = 49 + 64 − 2 × 56 × 0.5 = 57, so c = 7.55.',
    ], lab: 'formula:cosine-rule', note: 'Check that the calculator is working in degrees, not radians. It is the most common cause of a wrong answer.' },
  ],
  examples: [
    { title: 'Sine rule', steps: ['a = 12, A = 30°, B = 45°.', 'b = 12 × sin 45° ÷ sin 30° = 12 × 0.7071 ÷ 0.5.', 'b = 16.97.'] },
    { title: 'Cosine rule', steps: ['a = 6, b = 6, C = 120°.', 'c² = 36 + 36 − 72 × cos 120° = 72 + 36 = 108.', 'c = 10.39.'] },
  ],
  practice: [
    num('Triangle with a = 10, A = 30° and B = 90°. Side b?', 20, 0.05, '', 'b = 10 × sin 90° ÷ sin 30° = 10 ÷ 0.5 = 20.'),
    num('Two sides 3 and 4 with 90° between them. Third side (cosine rule)?', 5, 0.01, '', 'cos 90° = 0, so c² = 9 + 16 = 25.'),
    num('Two sides 5 and 5 with 60° between them. Third side?', 5, 0.01, '', 'c² = 25 + 25 − 50 × 0.5 = 25, so c = 5.'),
    num('Two angles of a triangle are 50° and 70°. The third angle?', 60, 0.1, '°', '180 − 50 − 70 = 60°.'),
    mcq('You know two angles and one side. Which rule do you use first?', ['Sine rule', 'Cosine rule', 'Pythagoras', 'Area rule'], 'With a side and its opposite angle known, the sine rule links the other sides.'),
  ],
  assessment: [
    num('a = 7, b = 8 and the angle between them is 60°. Side c?', 7.55, 0.02, '', 'c² = 49 + 64 − 2 × 56 × 0.5 = 57, so c = 7.55.'),
    num('a = 12, A = 30°, B = 45°. Side b?', 16.97, 0.05, '', 'b = 12 × 0.7071 ÷ 0.5 = 16.97.'),
    num('a = 6, b = 6 and the angle between them is 120°. Side c?', 10.39, 0.02, '', 'c² = 36 + 36 + 36 = 108, so c = 10.39.'),
    num('Two angles are 35° and 95°. The third angle?', 50, 0.1, '°', '180 − 35 − 95 = 50°.'),
    tf('The cosine rule becomes Pythagoras when the included angle is 90°.', true, 'cos 90° = 0, so the correction term disappears.'),
    mcq('You know two sides and the angle between them. Which rule finds the third side?', ['Cosine rule', 'Sine rule', 'Gradient rule', 'None: it is impossible'], 'Two sides and the included angle is the standard cosine-rule case.'),
  ],
  missionId: 'm-math-sinecos', sources: ['phak'],
});

export const exponentialDecay = lesson('Exponentials', {
  id: 'math-exponential-decay', title: 'Halving and Exponential Change', minutes: 11, level: 3, prereqs: ['math-powers', 'math-graphs-and-functions'],
  objectives: ['Recognise exponential change.', 'Use a halving period to predict a quantity.', 'Explain why air pressure falls quickly at first and more slowly with height.'],
  intro: 'Not every change is a straight line. Cooling drinks, radio-active decay and the pressure of the atmosphere change by a fixed fraction each step. That pattern is called exponential.',
  simple: 'In exponential decay a quantity loses the same fraction each time. If it halves every period, after three periods only one eighth is left.',
  sections: [
    { h: 'Linear and exponential', body: [
      'A **linear** change adds or subtracts the same amount each step. An **exponential** change multiplies by the same factor each step.',
      'A quantity that halves each period goes 80 → 40 → 20 → 10 → 5. It never reaches zero exactly.',
    ] },
    { h: 'The halving model', body: [
      '`N = N₀ × 0.5^(t ÷ T)`, where N₀ is the starting amount and T the halving period.',
      '80 units with a halving period of 5 hours: after 15 hours (three periods) N = 80 × 0.5³ = 10.',
    ], formula: 'half-life', lab: 'formula:half-life' },
    { h: 'Pressure and height', body: [
      'Air pressure falls roughly by half for every 18,000 ft you climb. From 1013 hPa at sea level it is about 507 hPa at 18,000 ft.',
      'This is why the first thousand feet of a climb changes the altimeter setting a little, but the thin air above 30,000 ft needs pressurisation.',
    ], note: 'This is a simplified model. Real pressure also depends on temperature, so use the ISA tables or the altimeter for real decisions. At 36,000 ft the model gives about 253 hPa, while ISA gives about 226 hPa.' },
  ],
  examples: [
    { title: 'Halving', steps: ['200 units, halving every 10 min, after 40 min.', '40 ÷ 10 = 4 periods.', '200 × 0.5⁴ = 200 ÷ 16 = 12.5.'] },
    { title: 'Pressure estimate', steps: ['Sea-level pressure 1013 hPa.', 'At 18,000 ft: one halving, so about 506 hPa.', 'At 36,000 ft: two halvings, about 253 hPa by this simple model.'] },
  ],
  practice: [
    num('A quantity of 80 halves three times. What is left?', 10, 0.05, '', '80 ÷ 2 ÷ 2 ÷ 2 = 10.'),
    num('A quantity of 80 halves twice. What is left?', 20, 0.05, '', '80 ÷ 4 = 20.'),
    num('Sea-level pressure is 1013 hPa. About how many hPa at 18,000 ft by the halving model?', 506, 5, 'hPa', 'One halving: 1013 ÷ 2 ≈ 506.'),
    mcq('Exponential decay means the quantity:', ['Loses the same fraction each period', 'Loses the same amount each period', 'Stays constant', 'Grows each period'], 'Each period multiplies by the same factor below one.'),
    tf('A quantity that halves each period reaches zero after a fixed number of periods.', false, 'It gets smaller and smaller but never reaches exactly zero.'),
  ],
  assessment: [
    num('200 units halve four times. What is left?', 12.5, 0.05, '', '200 ÷ 16 = 12.5.'),
    num('A quantity halves every 10 minutes. After how many minutes does 100 become 12.5?', 30, 0.5, 'min', '100 → 50 → 25 → 12.5 is three halvings = 30 min.'),
    num('N₀ = 64, halving period 5 h. After 15 h?', 8, 0.05, '', '15 ÷ 5 = 3 halvings; 64 ÷ 8 = 8.'),
    num('By the halving model, pressure at 36,000 ft starting from 1013 hPa (two halvings)?', 253, 3, 'hPa', '1013 ÷ 4 ≈ 253 hPa. Real ISA pressure is lower, about 226 hPa.'),
    tf('Real atmospheric pressure follows the simple halving model exactly.', false, 'It is only an approximation: temperature also changes with height.'),
    mcq('Why can the simple model not replace the altimeter?', ['It ignores temperature and weather effects', 'Pressure does not change with height', 'Altimeters measure temperature', 'The model is exact'], 'Real pressure depends on temperature and weather, so the model is only an estimate.'),
  ],
  missionId: 'm-math-halving', sources: ['phak'],
});

export const windTriangle = lesson('Wind triangle', {
  id: 'math-wind-triangle', title: 'The Wind Triangle', minutes: 14, level: 3, prereqs: ['math-sine-cosine', 'math-vectors'],
  objectives: ['Split the wind into headwind and crosswind components.', 'Calculate the wind correction angle.', 'Find the groundspeed on a leg.'],
  intro: 'Heading, wind and track form a triangle. The wind pushes the aircraft sideways, so the heading must point a little into the wind to hold the intended track. The geometry gives the correction and the groundspeed.',
  simple: 'Wind has two parts: one along the track (headwind or tailwind) and one across it (crosswind). The crosswind decides how many degrees you must angle into the wind; the headwind changes your groundspeed.',
  sections: [
    { h: 'Components', body: [
      'Let **a** be the angle between the intended track and the wind direction (the direction the wind comes **from**).',
      '`headwind = W × cos a` and `crosswind = W × sin a`. A 30 kt wind at 90° to the track is all crosswind. A 20 kt wind at 30° gives a headwind of 17.3 kt and a crosswind of 10 kt.',
    ] },
    { h: 'Wind correction angle', body: [
      'To hold the track you point the nose into the wind by the **wind correction angle (WCA)**: `sin(WCA) = crosswind ÷ TAS`.',
      'Crosswind 20 kt and TAS 100 kt: sin WCA = 0.2, so WCA = 11.5°. A wind from the left needs a heading to the left of track.',
    ] },
    { h: 'Groundspeed', body: [
      'Groundspeed is the airspeed along the track minus the headwind: `GS = TAS × cos(WCA) − W × cos a`.',
      'With TAS 100 kt and a 20 kt wind at 30°, GS ≈ 82.2 kt.',
      'Then time = distance ÷ groundspeed. A 60 NM leg at 90 kt GS takes 40 minutes.',
    ], formula: 'ground-speed', lab: 'formula:ground-speed', note: 'This is the mathematics behind the calculation. In real flight use an approved flight planner or navigation computer, and check against the chart and fuel plan.' },
  ],
  examples: [
    { title: 'Components', steps: ['Wind 40 kt, 60° from the track.', 'Crosswind = 40 × sin 60° = 34.6 kt.', 'Headwind = 40 × cos 60° = 20 kt.'] },
    { title: 'Correction angle', steps: ['TAS 120 kt, crosswind 34.6 kt.', 'sin WCA = 34.6 ÷ 120 = 0.2887.', 'WCA = 16.8°.'] },
  ],
  practice: [
    num('TAS 100 kt with a 20 kt wind directly on the nose. Groundspeed?', 80, 0.1, 'kt', 'A pure headwind subtracts: 100 − 20 = 80 kt.'),
    num('A 30 kt wind at 90° to the track. Crosswind component?', 30, 0.1, 'kt', 'sin 90° = 1, so all of the wind is crosswind.'),
    num('A 20 kt wind at 30° to the track. Headwind component?', 17.32, 0.05, 'kt', '20 × cos 30° = 17.32 kt.'),
    num('TAS 100 kt, crosswind 20 kt. Wind correction angle?', 11.54, 0.05, '°', 'sin WCA = 0.2, WCA = 11.54°.'),
    mcq('The wind is from the left. You must point the nose:', ['To the left of track, into the wind', 'To the right of track', 'Along the track', 'Downwards'], 'Pointing into the wind cancels the drift.'),
  ],
  assessment: [
    num('TAS 120 kt with a 25 kt tailwind. Groundspeed?', 145, 0.1, 'kt', 'A tailwind adds: 120 + 25 = 145 kt.'),
    num('Wind 40 kt at 60° to the track. Crosswind?', 34.64, 0.05, 'kt', '40 × sin 60° = 34.64 kt.'),
    num('TAS 120 kt and crosswind 34.64 kt. Wind correction angle?', 16.78, 0.1, '°', 'sin WCA = 0.2887, WCA = 16.78°.'),
    num('Groundspeed 90 kt. Time for a 60 NM leg?', 40, 0.5, 'min', '60 ÷ 90 = 0.667 h = 40 min.'),
    num('TAS 90 kt and a pure 30 kt crosswind. Groundspeed along the track (√(TAS² − 30²))?', 84.85, 0.1, 'kt', '√(8100 − 900) = √7200 = 84.85 kt.'),
    tf('A wind from the right requires a heading to the right of track.', true, 'You point into the wind: from the right means the nose is angled to the right.'),
  ],
  missionId: 'm-math-windtri', sources: ['phak', 'afh'],
});

export const moments = lesson('Moments and balance', {
  id: 'math-moments-balance', title: 'Moments and the Centre of Gravity', minutes: 12, level: 2, prereqs: ['math-algebra', 'math-ratios'],
  objectives: ['Calculate a moment as weight × arm.', 'Find a centre of gravity from several loads.', 'Predict which way a load shift moves the CG.'],
  intro: 'An aircraft must balance as well as lift. Weight and balance is a table of moments: add up the weights, add up the moments, and divide.',
  simple: 'A moment is how hard a weight tries to turn something about a point: the weight times its distance (the arm). The centre of gravity is the total moment divided by the total weight.',
  sections: [
    { h: 'The moment', body: [
      '`moment = weight × arm`. A 200 kg load 2 m from the datum has a moment of 400 kg·m.',
      'A seesaw balances when the moments on each side are equal: a 60 kg child 2 m from the pivot balances a 40 kg child 3 m away (120 = 120).',
    ], lab: 'formula:moment-balance' },
    { h: 'Centre of gravity', body: [
      '`CG = total moment ÷ total weight`. List every item: empty aircraft, pilot, passengers, fuel and baggage.',
      'Loads 100 kg at 1 m and 300 kg at 3 m: total moment = 100 + 900 = 1,000. Total weight = 400. CG = 1,000 ÷ 400 = 2.5 m.',
    ], formula: 'cg', lab: 'formula:cg' },
    { h: 'Moving a load', body: [
      'Moving a load changes the CG by `shift = weight moved × distance moved ÷ total weight`. Moving it aft moves the CG aft.',
      'Moving 20 kg forward by 1.5 m in a 1,000 kg aircraft moves the CG forward by 20 × 1.5 ÷ 1,000 = 0.03 m.',
    ], lab: 'formula:cg-shift', note: 'The real limits and arms come from the aircraft\'s approved weight-and-balance data. This lesson teaches the arithmetic only.' },
  ],
  examples: [
    { title: 'Two loads', steps: ['100 kg at 1 m: 100. 300 kg at 3 m: 900.', 'Total 1,000 kg·m over 400 kg.', 'CG = 2.5 m.'] },
    { title: 'Moving a bag', steps: ['Bag mass 20 kg moved 1.5 m forward.', 'Aircraft mass 1,000 kg.', 'Shift = 20 × 1.5 ÷ 1,000 = 0.03 m forward.'] },
  ],
  practice: [
    num('A 200 kg load is 2 m from the datum. Its moment?', 400, 0.5, 'kg·m', '200 × 2 = 400.'),
    num('Loads 100 kg at 1 m and 300 kg at 3 m. Where is the CG?', 2.5, 0.01, 'm', '(100 + 900) ÷ 400 = 2.5 m.'),
    num('A 60 kg child sits 2 m from the pivot. What mass at 3 m balances it?', 40, 0.1, 'kg', '60 × 2 = 120, so m × 3 = 120 and m = 40.'),
    mcq('The centre of gravity is calculated as:', ['Total moment ÷ total weight', 'Total weight ÷ total moment', 'Weight × arm', 'Arm ÷ weight'], 'Divide the sum of the moments by the sum of the weights.'),
    tf('Adding weight behind the CG moves the CG aft.', true, 'The extra moment pulls the average position backwards.'),
  ],
  assessment: [
    num('Empty aircraft 800 kg at 1.0 m, pilot 80 kg at 0.9 m, fuel 100 kg at 1.2 m. CG?', 1.012, 0.003, 'm', 'Moments: 800 + 72 + 120 = 992. Weight 980. 992 ÷ 980 = 1.012 m.'),
    num('A 20 kg bag moves 1.5 m forward in a 1,000 kg aircraft. How far does the CG move?', 0.03, 0.002, 'm', '20 × 1.5 ÷ 1,000 = 0.03 m.'),
    num('A 15 kg item sits 2.4 m behind the datum. Moment?', 36, 0.1, 'kg·m', '15 × 2.4 = 36.'),
    num('A 50 kg load sits 4 m from the pivot. What mass balances it at 2 m on the other side?', 100, 0.5, 'kg', '50 × 4 = 200; m × 2 = 200, so m = 100.'),
    mcq('Moving baggage from the front hold to the rear hold moves the CG:', ['Aft', 'Forward', 'Not at all', 'Up'], 'The load moves aft, so the CG moves aft.'),
    tf('A moment has the units of weight multiplied by distance.', true, 'For example kg·m or lb·in.'),
  ],
  missionId: 'm-math-moments', sources: ['faa-wb', 'phak'],
});

export const timeUtc = lesson('Time', {
  id: 'math-time-utc', title: 'Time, UTC and Time Zones', minutes: 9, level: 1, prereqs: ['math-decimals', 'math-arithmetic'],
  objectives: ['Read the 24-hour clock.', 'Convert between UTC and local time.', 'Add flight time to a departure time.'],
  intro: 'Flight plans, weather reports and charts all use one clock so that crews and controllers in different countries agree. That clock is UTC.',
  simple: 'UTC is the world\'s reference time. Local time is UTC plus or minus a whole number of hours. Add flight time in hours and minutes, carrying 60 minutes into an hour.',
  sections: [
    { h: 'UTC and the 24-hour clock', body: [
      '**UTC** (Coordinated Universal Time) does not change with the seasons. Aviation writes it in four digits: 0915 is 09:15, 2210 is 22:10.',
      'The day runs from 0000 to 2359. One minute after 2359 is 0000 of the next day.',
    ] },
    { h: 'Zones and offsets', body: [
      'Local time = UTC + offset. At UTC+3, 09:15 UTC is 12:15 local. At UTC−5 (standard time in New York), 18:00 UTC is 13:00 local.',
      'To go from local to UTC, subtract the offset: 22:00 local at UTC+1 is 21:00 UTC.',
    ], formula: 'utc-local', lab: 'formula:utc-local', note: 'Daylight saving time moves the offset by one hour for part of the year. Always check the current offset for the place and date.' },
    { h: 'Adding flight time', body: [
      'Add hours to hours and minutes to minutes. If the minutes reach 60 or more, carry one hour.',
      '10:30 + 3 h 50 min: hours 13, minutes 80 → 14:20. 23:40 + 1 h 35 min: 24:75 → 25:15 → 01:15 on the next day.',
      'Decimal hours help with fuel and speed: 2 h 45 min = 2 + 45 ÷ 60 = 2.75 h.',
    ] },
  ],
  examples: [
    { title: 'Zone conversion', steps: ['Departure 22:00 local at UTC+1.', 'UTC = 22:00 − 1 h.', 'UTC = 21:00.'] },
    { title: 'Arrival time', steps: ['Depart 10:30 UTC, flight 3 h 50 min.', '10:30 + 3:50 = 13:80.', '80 min = 1 h 20 min, so arrival 14:20 UTC.'] },
  ],
  practice: [
    mcq('09:15 UTC at an offset of UTC+3 is what local time?', ['12:15', '06:15', '09:18', '13:15'], 'Add 3 hours: 09:15 + 3 h = 12:15.'),
    mcq('Local time 22:00 at UTC+1. What is the UTC time?', ['21:00', '23:00', '22:00', '20:00'], 'Subtract the offset: 22:00 − 1 h = 21:00.'),
    num('A flight of 2 h 45 min in decimal hours?', 2.75, 0.005, 'h', '45 ÷ 60 = 0.75, so 2.75 h.'),
    num('Depart 10:30 UTC and fly 3 h 50 min. Minutes past the hour at arrival?', 20, 0.1, 'min', '10:30 + 3:50 = 13:80 = 14:20, so 20 minutes past.'),
    tf('Aviation uses UTC so that crews and controllers in all countries read the same time.', true, 'One reference clock avoids confusion between time zones.'),
  ],
  assessment: [
    mcq('At UTC−5, what is the local time when it is 18:00 UTC?', ['13:00', '23:00', '18:05', '12:00'], 'Subtract 5 hours: 18:00 − 5 h = 13:00.'),
    num('Depart 23:40 UTC and fly 1 h 35 min. Minutes past the hour at arrival?', 15, 0.1, 'min', '23:40 + 1:35 = 24:75 = 01:15 the next day.'),
    num('45 minutes plus 50 minutes, in minutes?', 95, 0.1, 'min', '45 + 50 = 95 minutes = 1 h 35 min.'),
    num('Local time 14.5 h at UTC+2. UTC time in decimal hours?', 12.5, 0.01, 'h', '14.5 − 2 = 12.5 h (12:30 UTC).'),
    tf('At UTC+2, 23:00 UTC is 01:00 local on the next day.', true, '23:00 + 2 h = 25:00, which is 01:00 the next day.'),
    tf('Daylight saving time never changes the UTC offset.', false, 'It shifts the local offset by one hour in many places, so check it.'),
  ],
  missionId: 'm-math-time', sources: ['phak'],
});

export const accuracy = lesson('Accuracy', {
  id: 'math-accuracy-rounding', title: 'Accuracy, Rounding and Error', minutes: 9, level: 1, prereqs: ['math-decimals', 'math-percentages'],
  objectives: ['Round to decimal places and significant figures.', 'Calculate percentage error.', 'Round in the safe direction for flight planning.'],
  intro: 'No measurement is perfect and no answer needs endless digits. Pilots need to know how accurate a number is and in which direction to round it so that the error never reduces safety.',
  simple: 'Round to the precision you can trust. Measure how far an estimate is from the true value as a percentage. When in doubt, round fuel up and performance margins in the safe direction.',
  sections: [
    { h: 'Decimal places and significant figures', body: [
      '47.86 to one decimal place is 47.9. To **round**, look at the next digit: 5 or more rounds up.',
      '**Significant figures** count from the first non-zero digit. 0.004567 to three significant figures is 0.00457. 1,236 to the nearest hundred is 1,200.',
    ] },
    { h: 'Percentage error', body: [
      '`error = |measured − true| ÷ true × 100`. A reading of 98 when the true value is 100 has a 2 % error. A reading of 52 against 50 has a 4 % error.',
      'A small error on a small number can matter more than a large error on a large number, so always compare with the true value.',
    ], formula: 'percent-error', lab: 'formula:percent-error' },
    { h: 'Round safely', body: [
      '**Fuel required:** round up. 7.31 gallons needed becomes 8 gallons when you order.',
      '**Take-off distance required:** round up. **Runway available:** round down. The safe direction is the one that increases the margin.',
      'Estimating first catches big errors: 3.1 × 19.8 is about 3 × 20 = 60.',
    ], note: 'Never round intermediate steps heavily. Keep extra digits during the calculation and round only the final answer.' },
  ],
  examples: [
    { title: 'Percentage error', steps: ['Measured 52, true 50.', 'Difference = 2.', '2 ÷ 50 × 100 = 4 %.'] },
    { title: 'Safe rounding', steps: ['Fuel needed: 38.2 L.', 'Rounding to 38 L would be short.', 'Round up to 39 L or more.'] },
  ],
  practice: [
    num('Round 47.86 to one decimal place.', 47.9, 0.001, '', 'The next digit is 6, so round up: 47.9.'),
    num('Round 0.004567 to three significant figures.', 0.00457, 0.000001, '', 'The significant digits are 4, 5, 6, 7; to three figures 0.00457.'),
    num('Measured 98 when the true value is 100. Percentage error?', 2, 0.01, '%', '|98 − 100| ÷ 100 × 100 = 2 %.'),
    mcq('Which direction should you round a fuel requirement?', ['Up', 'Down', 'Whichever is nearest', 'It does not matter'], 'Round fuel up so that the margin never shrinks.'),
    num('Estimate 3.1 × 19.8 by rounding each number first.', 60, 1, '', '3 × 20 = 60.'),
  ],
  assessment: [
    num('Measured 52 when the true value is 50. Percentage error?', 4, 0.01, '%', '2 ÷ 50 × 100 = 4 %.'),
    num('Round 1,236 to the nearest hundred.', 1200, 0.5, '', 'The tens digit is 3, so round down to 1,200.'),
    num('Round 0.0728 to two significant figures.', 0.073, 0.0001, '', 'The significant digits are 7 and 2; the next digit 8 rounds 0.072 up to 0.073.'),
    num('A fuel need of 7.31 gallons. Round up to the next whole gallon.', 8, 0.01, 'gal', 'Always round the requirement up: 8 gallons.'),
    mcq('The take-off distance required is calculated as 412 m. For planning you should use:', ['A larger figure, rounded up', 'A smaller figure, rounded down', 'Exactly 412 m, ignoring margins', 'Half the figure'], 'Rounding the required distance up increases the safety margin.'),
    tf('A result with more decimal places is always more accurate.', false, 'Extra digits show precision, not accuracy. The result is only as accurate as the data behind it.'),
  ],
  missionId: 'm-math-accuracy', sources: ['phak'],
});

export const probability = lesson('Probability', {
  id: 'math-probability-risk', title: 'Probability and Risk', minutes: 11, level: 2, prereqs: ['math-fractions', 'math-percentages'],
  objectives: ['Express a chance as a fraction, decimal or percentage.', 'Combine independent events.', 'Explain why small risks add up and redundancy helps.'],
  intro: 'Safety is about probabilities. A small risk repeated many times becomes a real one, and a second independent system makes a double failure far less likely.',
  simple: 'A probability runs from 0 (impossible) to 1 (certain). For independent events multiply the chances for "both", and use 1 minus the chance of none for "at least one".',
  sections: [
    { h: 'Measuring chance', body: [
      'A **probability** is a number between 0 and 1. A fair die shows a six with probability 1/6 ≈ 0.167. A fair coin shows heads with probability 0.5.',
      'Multiply by 100 for a percentage: 0.167 is about 16.7 %.',
    ] },
    { h: 'Combining independent events', body: [
      'Two events are **independent** if one does not affect the other. The chance that both happen is the product: two heads in a row is 0.5 × 0.5 = 0.25.',
      'The chance that something goes wrong **at least once** in n tries is `P = 1 − (1 − p)ⁿ`. With p = 0.05 and n = 3: 1 − 0.95³ = 0.143, about 14 %.',
    ], formula: 'at-least-once', lab: 'formula:at-least-once' },
    { h: 'Redundancy and risk', body: [
      'Two independent systems that each fail with probability 0.1 both fail with probability 0.1 × 0.1 = 0.01. That is why aircraft carry backup systems.',
      'But independence matters: two systems that share one power supply can fail together, and then the multiplication does not apply.',
    ], note: 'Real aviation safety relies on measured failure data and formal safety assessment. These simple models are for understanding the idea only.' },
  ],
  examples: [
    { title: 'At least once', steps: ['Chance of 0.05 on each of 3 flights.', 'Chance of no problem on all three = 0.95³ = 0.857.', 'At least once = 1 − 0.857 = 0.143.'] },
    { title: 'Backup system', steps: ['Each system fails with probability 0.1.', 'Both fail: 0.1 × 0.1 = 0.01.', 'A 1 % chance instead of 10 %.'] },
  ],
  practice: [
    num('Probability of rolling a six on a fair die (decimal)?', 0.1667, 0.001, '', '1 ÷ 6 = 0.1667.'),
    num('Probability of two heads in a row with a fair coin?', 0.25, 0.001, '', '0.5 × 0.5 = 0.25.'),
    num('Chance of 0.1 of a problem on each of 2 flights. Chance of at least one problem?', 0.19, 0.002, '', '1 − 0.9² = 1 − 0.81 = 0.19.'),
    mcq('A probability can never be:', ['Greater than 1', 'Exactly 0.5', 'Exactly 0', 'Less than 0.9'], '1 means certain, so nothing can exceed it.'),
    tf('A rare event cannot happen.', false, 'Rare events happen, and repeated exposure raises the chance that one will.'),
  ],
  assessment: [
    num('Chance 0.05 per flight. Chance of at least one problem in 3 flights?', 0.1426, 0.002, '', '1 − 0.95³ = 0.1426.'),
    num('Two independent systems each work with probability 0.99. Chance both work?', 0.9801, 0.0005, '', '0.99 × 0.99 = 0.9801.'),
    num('Two independent items each fail with probability 0.02. Chance at least one fails?', 0.0396, 0.0005, '', '1 − 0.98² = 0.0396.'),
    num('Two independent backups each fail with probability 0.1. Chance both fail?', 0.01, 0.0005, '', '0.1 × 0.1 = 0.01.'),
    mcq('Why can two backup systems that share one power supply fail together?', ['They are not independent', 'Probabilities add instead of multiply', 'The first system cannot fail', 'Backups never help'], 'The multiplication rule only holds for independent events.'),
    tf('Over many flights, a small chance per flight adds up to a larger overall chance.', true, 'The chance of at least one event rises with the number of tries.'),
  ],
  missionId: 'm-math-probability', sources: ['phak'],
});

export const mathExpansion = { proportion, circles, areaVolume, sineCosine, exponentialDecay, windTriangle, moments, timeUtc, accuracy, probability };
