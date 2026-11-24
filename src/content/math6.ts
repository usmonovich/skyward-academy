// Pre-Flight Academy mathematics, sixth batch: chart scales, simultaneous equations, inequalities and limits, logarithms,
// weighted averages, angles of elevation and depression, sequences, and reading performance charts.
// Every question is original practice material.
import { lesson, mcq, num, tf } from './q';

export const chartScales = lesson('Scales', {
  id: 'math-chart-scales', title: 'Map Scales and Chart Distances', minutes: 10, level: 1, prereqs: ['math-ratios', 'math-units'],
  objectives: ['Read a chart scale written as a ratio.', 'Convert chart distances to ground distances and back.', 'Use the latitude scale to measure nautical miles.'],
  intro: 'Every route starts as a line on a chart. Turning centimetres on paper into kilometres or nautical miles on the ground is a scale calculation, and getting it wrong by a factor of ten is easier than it sounds.',
  simple: 'A scale of 1:500,000 means one centimetre on the chart is 500,000 centimetres on the ground, which is 5 kilometres.',
  sections: [
    { h: 'What a scale means', body: [
      'A scale such as **1:500,000** is a ratio: one unit on the chart stands for 500,000 of the **same** unit on the ground.',
      'So 1 cm on the chart is 500,000 cm = 5,000 m = **5 km**. On a 1:250,000 chart, 1 cm is 2.5 km.',
      'A **larger scale** (smaller second number, such as 1:250,000) shows a smaller area in more detail. A smaller scale (1:1,000,000) covers more ground with less detail.',
    ], formula: 'chart-scale', lab: 'formula:chart-scale' },
    { h: 'Chart to ground and back', body: [
      'Chart to ground: multiply by the scale, then convert units. 8 cm on a 1:500,000 chart is 8 × 5 km = **40 km**.',
      'Ground to chart: divide. 20 km on the same chart is 20 ÷ 5 = **4 cm**.',
      'To change kilometres to nautical miles divide by 1.852: 40 km ≈ 21.6 NM.',
    ] },
    { h: 'The latitude scale', body: [
      'Along a meridian, one **minute of latitude** is about **one nautical mile**. Pilots often measure distance against the latitude scale at the side of the chart for that reason.',
      'From 51°10′N to 51°40′N is 30 minutes of latitude: about 30 NM.',
    ], note: 'Minutes of longitude are not nautical miles: they get shorter towards the poles. Measure against the latitude scale, never the longitude scale.' },
  ],
  examples: [
    { title: 'Chart to ground', steps: ['A leg measures 12 cm on a 1:500,000 chart.', '1 cm is 5 km, so 12 cm is 60 km.', '60 ÷ 1.852 ≈ 32.4 NM.'] },
    { title: 'Ground to chart', steps: ['A turning point is 30 km away. How far is that on a 1:250,000 chart?', '1 cm is 2.5 km on this chart.', '30 ÷ 2.5 = 12 cm.'] },
  ],
  practice: [
    num('On a 1:500,000 chart a leg measures 8 cm. How many kilometres is that?', 40, 0.1, 'km', '1 cm is 5 km, so 8 cm is 40 km.'),
    num('On a 1:250,000 chart a leg measures 12 cm. How many kilometres is that?', 30, 0.1, 'km', '1 cm is 2.5 km, so 12 cm is 30 km.'),
    mcq('Which chart shows the most detail?', ['1:250,000', '1:500,000', '1:1,000,000', 'They all show the same detail'], 'The smaller the second number, the larger the scale and the more detail.'),
    num('How many centimetres represent 20 km on a 1:500,000 chart?', 4, 0.01, 'cm', '20 km ÷ 5 km per cm = 4 cm.'),
    tf('One minute of latitude is about one nautical mile.', true, 'That is why the latitude scale is used to measure distance in nautical miles.'),
  ],
  assessment: [
    num('A leg measures 15 cm on a 1:500,000 chart. How many kilometres is it?', 75, 0.1, 'km', '15 × 5 km = 75 km.'),
    num('Convert 75 km to nautical miles (1 NM = 1.852 km).', 40.5, 0.2, 'NM', '75 ÷ 1.852 ≈ 40.5 NM.'),
    num('On a 1:1,000,000 chart a line is 3.5 cm long. How many kilometres is that?', 35, 0.1, 'km', '1 cm is 10 km on this chart, so 3.5 cm is 35 km.'),
    num('How many centimetres represent 30 km on a 1:250,000 chart?', 12, 0.01, 'cm', '30 ÷ 2.5 = 12 cm.'),
    mcq('A scale of 1:500,000 means:', ['One unit on the chart is 500,000 of the same units on the ground', 'One centimetre is 500,000 km', 'One centimetre is 500 m', 'The chart is 500 km wide'], 'A ratio scale compares the same units: 1 cm on the chart is 500,000 cm on the ground.'),
    num('How many nautical miles is it along a meridian from 51°10′N to 51°40′N?', 30, 0.5, 'NM', '30 minutes of latitude is about 30 NM.'),
  ],
  missionId: 'm-math-scales', sources: ['phak'],
});

export const simultaneous = lesson('Simultaneous equations', {
  id: 'math-simultaneous', title: 'Simultaneous Equations', minutes: 12, level: 2, prereqs: ['math-equations'],
  objectives: ['Explain why two unknowns need two equations.', 'Solve a pair of linear equations by elimination and by substitution.', 'Find a wind component and a true airspeed from an out-and-back flight.'],
  intro: 'Some problems hide two unknowns at once: the true airspeed and the wind, or the mass of a bag and of a case. One equation cannot pin both down, but two equations together can.',
  simple: 'Write one equation for each fact you know. Then add or subtract the equations so that one unknown disappears, solve for the other, and put it back.',
  sections: [
    { h: 'Two unknowns, two equations', body: [
      'An equation such as `x + y = 10` has many solutions (1 and 9, 4 and 6 …). A second fact, such as `x − y = 4`, picks out the one pair that fits both.',
      'Equations that must all be true together are called **simultaneous equations**.',
    ] },
    { h: 'Elimination', body: [
      'Add or subtract the equations to remove one unknown. Adding `x + y = 10` and `x − y = 4` gives `2x = 14`, so **x = 7**; then `7 + y = 10` gives **y = 3**.',
      'If no unknown cancels straight away, multiply one equation first so that the numbers in front of one unknown match.',
    ] },
    { h: 'Substitution', body: [
      'Rearrange one equation for one unknown and put it into the other. From `y = 2x` and `x + y = 9`: `x + 2x = 9`, so **x = 3** and **y = 6**.',
    ] },
    { h: 'The wind from an out-and-back flight', body: [
      'Flying out into a headwind and back with a tailwind gives two groundspeeds: `TAS − w` and `TAS + w`, where **w** is the wind component along the track.',
      'With 100 kt out and 140 kt back: adding gives `2 × TAS = 240`, so **TAS = 120 kt**; subtracting gives `2w = 40`, so **w = 20 kt**.',
    ], formula: 'out-back-wind', lab: 'formula:out-back-wind', note: 'This works only if the wind and the airspeed stay the same on both legs and the wind is along the track.' },
  ],
  examples: [
    { title: 'Elimination', steps: ['Solve 2x + y = 11 and x + y = 7.', 'Subtract the second from the first: x = 4.', 'Put x = 4 into x + y = 7: y = 3.', 'Check: 2 × 4 + 3 = 11.'] },
    { title: 'Bags and cases', steps: ['3 bags and 2 cases weigh 70 kg; 1 bag and 2 cases weigh 50 kg.', 'Subtract: 2 bags weigh 20 kg, so one bag is 10 kg.', 'Then 10 + 2 cases = 50, so one case is 20 kg.'] },
  ],
  practice: [
    num('Solve x + y = 10 and x − y = 4. What is x?', 7, 0.01, '', 'Adding the equations gives 2x = 14.'),
    num('For the same pair (x + y = 10, x − y = 4), what is y?', 3, 0.01, '', '7 + y = 10.'),
    num('Groundspeed is 100 kt into the wind and 140 kt back with it. What is the true airspeed?', 120, 0.5, 'kt', '(100 + 140) ÷ 2 = 120 kt.'),
    num('In the same flight, what is the wind component along the track?', 20, 0.5, 'kt', '(140 − 100) ÷ 2 = 20 kt.'),
    mcq('Adding or subtracting two equations to remove one unknown is called:', ['Elimination', 'Substitution', 'Interpolation', 'Estimation'], 'Elimination removes one unknown so the other can be found.'),
  ],
  assessment: [
    num('Solve 2x + y = 11 and x + y = 7. What is x?', 4, 0.01, '', 'Subtracting the second equation from the first gives x = 4.'),
    num('For the same pair, what is y?', 3, 0.01, '', '4 + y = 7.'),
    num('Groundspeed is 150 kt out and 190 kt back on the same track. What is the wind component?', 20, 0.5, 'kt', '(190 − 150) ÷ 2 = 20 kt.'),
    num('In the same flight, what is the true airspeed?', 170, 0.5, 'kt', '(150 + 190) ÷ 2 = 170 kt.'),
    num('3 passengers and 2 bags weigh 270 kg; the same 3 passengers and 4 bags weigh 310 kg. All bags weigh the same. What is the mass of one bag?', 20, 0.1, 'kg', 'The difference, 40 kg, is two bags.'),
    tf('Two linear equations in two unknowns can have one solution, no solution or infinitely many solutions.', true, 'Parallel lines never meet (no solution); the same line meets itself everywhere (infinitely many).'),
  ],
  missionId: 'm-math-simultaneous', sources: ['phak'],
});

export const inequalities = lesson('Inequalities', {
  id: 'math-inequalities', title: 'Inequalities and Operating Limits', minutes: 10, level: 1, prereqs: ['math-equations'],
  objectives: ['Read and write the inequality signs.', 'Solve a linear inequality, including the sign change.', 'Express mass and speed limits as inequalities.'],
  intro: 'Aviation is full of limits: a mass that must not be exceeded, a speed range to stay inside, a fuel minimum. Inequalities are the mathematics of "no more than" and "at least".',
  simple: 'An inequality says one side is bigger or smaller, not equal. Solve it like an equation, but if you multiply or divide by a negative number, turn the sign round.',
  sections: [
    { h: 'The four signs', body: [
      '**<** less than, **≤** less than or equal to, **>** greater than, **≥** greater than or equal to.',
      '"The mass must not exceed 1,100 kg" is `m ≤ 1,100 kg`. "At least 45 minutes of fuel" is `t ≥ 45 min`.',
      'A range is two inequalities at once: `65 ≤ v ≤ 110` means from 65 to 110 inclusive.',
    ] },
    { h: 'Solving an inequality', body: [
      'Use the same steps as an equation: `3x + 2 ≤ 17` → `3x ≤ 15` → `x ≤ 5`.',
      'One exception: **multiplying or dividing by a negative number reverses the sign**. `−2x > 6` → `x < −3`.',
    ] },
    { h: 'Limits in loading', body: [
      'If the maximum take-off mass is 1,100 kg, the empty mass is 700 kg and the fuel is 150 kg, then `700 + 150 + payload ≤ 1,100`, so `payload ≤ 250 kg`.',
    ], formula: 'max-payload', lab: 'formula:max-payload', note: 'The real limits for an aircraft are in its flight manual and its weight and balance data. These numbers are for practice only.' },
  ],
  examples: [
    { title: 'Payload limit', steps: ['Maximum take-off mass 1,150 kg, empty mass 720 kg, fuel 160 kg.', '720 + 160 + payload ≤ 1,150.', 'Payload ≤ 1,150 − 880 = 270 kg.'] },
    { title: 'A negative coefficient', steps: ['Solve −3x ≤ 12.', 'Divide both sides by −3 and reverse the sign.', 'x ≥ −4.'] },
  ],
  practice: [
    num('Solve 3x + 2 ≤ 17. What is the largest possible value of x?', 5, 0.01, '', '3x ≤ 15, so x ≤ 5.'),
    mcq('Solve −2x > 6.', ['x < −3', 'x > −3', 'x < 3', 'x > 3'], 'Dividing by −2 reverses the sign.'),
    num('Maximum take-off mass 1,150 kg, empty mass 720 kg, fuel 160 kg. What is the largest payload?', 270, 0.5, 'kg', '1,150 − 720 − 160 = 270 kg.'),
    tf('"x ≥ 4" includes the value 4.', true, 'The line under the sign means "or equal to".'),
    mcq('Which speed lies inside the range 65 ≤ v ≤ 110 kt?', ['90 kt', '60 kt', '115 kt', '120 kt'], 'Only 90 kt is at least 65 and no more than 110.'),
  ],
  assessment: [
    num('Solve 5x − 4 < 21. x must be less than which number?', 5, 0.01, '', '5x < 25, so x < 5.'),
    mcq('Solve −3x ≤ 12.', ['x ≥ −4', 'x ≤ −4', 'x ≥ 4', 'x ≤ 4'], 'Dividing by −3 reverses the sign: x ≥ −4.'),
    num('Maximum take-off mass 2,300 kg, empty mass 1,450 kg, fuel 380 kg. What is the largest payload?', 470, 0.5, 'kg', '2,300 − 1,450 − 380 = 470 kg.'),
    num('The payload limit is 250 kg and two passengers weigh 85 kg each. What is the most baggage allowed?', 80, 0.5, 'kg', '250 − 170 = 80 kg.'),
    tf('Multiplying both sides of an inequality by a negative number reverses the sign.', true, 'For example 2 < 3, but −2 > −3.'),
    mcq('"The mass must not exceed 1,100 kg" is written:', ['m ≤ 1,100 kg', 'm < 1,100 kg', 'm ≥ 1,100 kg', 'm > 1,100 kg'], '"Not exceed" allows exactly 1,100 kg, so the sign is ≤.'),
  ],
  missionId: 'm-math-inequalities', sources: ['faa-wb', 'phak'],
});

export const logarithms = lesson('Logarithms', {
  id: 'math-logarithms', title: 'Logarithms and Decibels', minutes: 12, level: 3, prereqs: ['math-powers', 'math-scinot'],
  objectives: ['Explain a logarithm as "which power".', 'Use the product and power rules of logarithms.', 'Convert power ratios to decibels and back.'],
  intro: 'Sound levels in the cockpit, the strength of a radio signal and the loudness of an engine are measured in decibels, and decibels are logarithms. A logarithm turns huge ratios into small, easy numbers.',
  simple: 'The logarithm of 1,000 is 3, because 10 × 10 × 10 = 1,000. Decibels count those powers of ten: every 10 dB is ten times the power.',
  sections: [
    { h: 'What a logarithm is', body: [
      '`log₁₀(x)` answers: **"10 to which power gives x?"** So `log₁₀(1,000) = 3`, `log₁₀(10) = 1`, `log₁₀(1) = 0` and `log₁₀(0.01) = −2`.',
      'Logarithms grow slowly: a million is only 6.',
    ] },
    { h: 'Two useful rules', body: [
      'Product rule: `log(a × b) = log a + log b`. Power rule: `log(aⁿ) = n × log a`.',
      'With `log 2 ≈ 0.301`: `log 8 = log 2³ = 3 × 0.301 = 0.903`.',
    ] },
    { h: 'Decibels', body: [
      'A **decibel** compares two powers: `dB = 10 × log₁₀(P₂ ÷ P₁)`.',
      '×10 power is **+10 dB**, ×100 is **+20 dB**, ×2 is about **+3 dB**. Equal powers give 0 dB.',
      'A headset that lowers the noise from 90 dB to 70 dB cuts the sound power by a factor of 100.',
    ], formula: 'decibels', lab: 'formula:decibels', note: 'Long exposure to cockpit noise can damage hearing. A good headset or hearing protection is part of flying safely.' },
  ],
  examples: [
    { title: 'Power ratio to decibels', steps: ['A signal is 1,000 times stronger than another.', 'log₁₀(1,000) = 3.', '10 × 3 = 30 dB.'] },
    { title: 'Decibels to power ratio', steps: ['Noise drops by 20 dB.', '20 ÷ 10 = 2, so the ratio is 10² = 100.', 'The power is cut to one hundredth.'] },
  ],
  practice: [
    num('What is log₁₀(1,000)?', 3, 0.001, '', '10³ = 1,000.'),
    num('What is log₁₀(0.01)?', -2, 0.001, '', '10⁻² = 0.01.'),
    num('A level rises by 20 dB. By what factor did the power increase?', 100, 0.5, '', '20 dB is 10² = 100 times the power.'),
    mcq('An increase of about 3 dB means the power has:', ['Roughly doubled', 'Tripled', 'Increased tenfold', 'Stayed the same'], '10 × log₁₀(2) ≈ 3 dB.'),
    tf('log(a × b) = log a + log b.', true, 'This is the product rule of logarithms.'),
  ],
  assessment: [
    num('What is log₁₀(100,000)?', 5, 0.001, '', '10⁵ = 100,000.'),
    num('Express a power ratio of 1,000 in decibels.', 30, 0.1, 'dB', '10 × log₁₀(1,000) = 30 dB.'),
    num('A headset lowers the noise from 90 dB to 70 dB. By what factor is the sound power reduced?', 100, 0.5, '', '20 dB is a factor of 100.'),
    num('Given log₁₀(2) ≈ 0.301, what is log₁₀(8)?', 0.903, 0.005, '', 'log 8 = 3 × log 2.'),
    mcq('Two signals have exactly the same power. The difference is:', ['0 dB', '1 dB', '10 dB', '−10 dB'], 'log₁₀(1) = 0, so the difference is 0 dB.'),
    tf('An increase of 10 dB means ten times the sound power.', true, '10 × log₁₀(10) = 10 dB.'),
  ],
  missionId: 'm-math-logarithms', sources: ['si-brochure'],
});

export const weightedAverage = lesson('Averages', {
  id: 'math-weighted-average', title: 'Averages and Weighted Averages', minutes: 10, level: 1, prereqs: ['math-basic-statistics'],
  objectives: ['Calculate a mean and a weighted mean.', 'Find an average speed from total distance and total time.', 'Recognise the centre of gravity as a weighted average.'],
  intro: 'Averages look simple, but the wrong average gives the wrong answer. The average speed of a flight is not the average of the speeds, and the centre of gravity is an average weighted by mass.',
  simple: 'A weighted average counts heavier or longer items more. For an average speed, always divide the total distance by the total time.',
  sections: [
    { h: 'Mean and weighted mean', body: [
      'The **mean** adds the values and divides by how many there are: the mean of 4, 8 and 9 is 21 ÷ 3 = **7**.',
      'A **weighted mean** multiplies each value by its weight first: `(w₁x₁ + w₂x₂ + …) ÷ (w₁ + w₂ + …)`.',
      'Three items of 10 kg and one of 30 kg average (3 × 10 + 30) ÷ 4 = **15 kg**.',
    ], formula: 'weighted-mean', lab: 'formula:weighted-mean' },
    { h: 'Average speed', body: [
      'Average speed is **total distance ÷ total time**. Fly 60 NM at 120 kt (30 min), then 60 NM at 60 kt (60 min): 120 NM in 1.5 h is **80 kt**, not the 90 kt you get by averaging the two speeds.',
      'The slow leg lasts longer, so it carries more weight in the average.',
    ] },
    { h: 'The centre of gravity', body: [
      'The **centre of gravity** is the weighted average of the positions (arms) of every mass in the aircraft, weighted by mass.',
      '800 kg at 2.0 m and 200 kg at 3.0 m: (1,600 + 600) ÷ 1,000 = **2.2 m**.',
    ] },
  ],
  examples: [
    { title: 'Average groundspeed', steps: ['2 h at 100 kt, then 1 h at 160 kt.', 'Distance: 200 + 160 = 360 NM in 3 h.', 'Average: 360 ÷ 3 = 120 kt.'] },
    { title: 'Weighted score', steps: ['A test counts once and an exam three times. Scores: 70 and 90.', '(70 × 1 + 90 × 3) ÷ 4 = 340 ÷ 4.', 'Weighted average = 85.'] },
  ],
  practice: [
    num('What is the mean of 4, 8 and 9?', 7, 0.01, '', '21 ÷ 3 = 7.'),
    num('60 NM at 120 kt, then 60 NM at 60 kt. What is the average groundspeed?', 80, 0.1, 'kt', '120 NM in 1.5 h = 80 kt.'),
    num('Three items weigh 10 kg each and one weighs 30 kg. What is the average mass?', 15, 0.01, 'kg', '60 kg ÷ 4 = 15 kg.'),
    tf('The average speed over two equal distances equals the mean of the two speeds.', false, 'The slower leg takes longer, so the true average is lower than the simple mean.'),
    mcq('The centre of gravity is:', ['A weighted average of the arms, weighted by mass', 'The midpoint of the fuselage', 'The simple mean of the arms', 'Where the heaviest item sits'], 'Each mass pulls the average towards its own position in proportion to its mass.'),
  ],
  assessment: [
    num('2 h at 100 kt, then 1 h at 160 kt. What is the average groundspeed?', 120, 0.1, 'kt', '360 NM ÷ 3 h = 120 kt.'),
    num('90 NM at 90 kt, then 90 NM at 180 kt. What is the average groundspeed?', 120, 0.1, 'kt', 'Times are 1 h and 0.5 h: 180 NM ÷ 1.5 h = 120 kt.'),
    num('800 kg sits at 2.0 m and 200 kg at 3.0 m from the datum. Where is the centre of gravity?', 2.2, 0.005, 'm', '(1,600 + 600) ÷ 1,000 = 2.2 m.'),
    num('A test counts once and an exam three times. Scores: 70 and 90. What is the weighted average?', 85, 0.1, '', '(70 + 270) ÷ 4 = 85.'),
    mcq('What is the mean of 10, 20, 30 and 40?', ['25', '20', '30', '100'], '100 ÷ 4 = 25.'),
    tf('A weighted average always lies between the smallest and the largest value.', true, 'It is a blend of the values, so it cannot go outside them.'),
  ],
  missionId: 'm-math-average', sources: ['faa-wb', 'phak'],
});

export const elevation = lesson('Angles of elevation', {
  id: 'math-elevation-depression', title: 'Angles of Elevation and Depression', minutes: 12, level: 2, prereqs: ['math-trig'],
  objectives: ['Use tangent to relate height, distance and angle.', 'Explain why an angle of depression equals the matching angle of elevation.', 'Find heights on a 3° approach path.'],
  intro: 'An approach path, a climb past an obstacle and the view of a runway from the air are all right-angled triangles. One trigonometric ratio, the tangent, links the height, the distance and the angle.',
  simple: 'Height = distance × tan(angle). On a 3° approach that works out at roughly 300 ft for every nautical mile from the touchdown point.',
  sections: [
    { h: 'Elevation and depression', body: [
      'Looking **up** from the horizontal gives an **angle of elevation**. Looking **down** gives an **angle of depression**.',
      'The depression angle from the aircraft to a point on the ground equals the elevation angle from that point to the aircraft: they are alternate angles between parallel horizontal lines.',
    ] },
    { h: 'Height from distance and angle', body: [
      'In the right-angled triangle, `tan(angle) = height ÷ horizontal distance`, so `height = distance × tan(angle)`.',
      'One nautical mile is about 6,076 ft. On a 3° path: 6,076 × tan 3° ≈ **318 ft per NM**, the source of the "300 ft per mile" rule of thumb.',
      'At 4 NM the path is about 4 × 318 ≈ **1,270 ft** above the touchdown point.',
    ], formula: 'glide-height', lab: 'formula:glide-height' },
    { h: 'Finding the angle', body: [
      'Rearranged: `angle = tan⁻¹(height ÷ distance)`. A tower 500 m high seen from 2 km away is at tan⁻¹(0.25) ≈ **14.0°**.',
    ], note: 'The approach path angle and heights for a real approach are published on the approach chart. Use those, not a rule of thumb.' },
  ],
  examples: [
    { title: 'Height on the approach', steps: ['3° path, 5 NM from the touchdown point.', '5 × 6,076 × tan 3° = 5 × 318.4.', 'About 1,592 ft above the touchdown point.'] },
    { title: 'Distance from a depression angle', steps: ['From 1,000 ft, a point is seen 10° below the horizontal.', 'Distance = 1,000 ÷ tan 10° = 1,000 ÷ 0.1763.', 'About 5,671 ft away horizontally.'] },
  ],
  practice: [
    num('How many feet of height is a 3° path for each nautical mile? (1 NM = 6,076 ft)', 318, 2, 'ft', '6,076 × tan 3° ≈ 318 ft.'),
    num('About how high is a 3° path 4 NM from the touchdown point?', 1273, 15, 'ft', '4 × 318.4 ≈ 1,273 ft.'),
    num('A 500 m tower is 2 km away. What is the angle of elevation to its top?', 14.0, 0.2, '°', 'tan⁻¹(500 ÷ 2,000) = tan⁻¹(0.25) ≈ 14.0°.'),
    tf('The angle of depression from an aircraft to a point equals the angle of elevation from that point to the aircraft.', true, 'They are alternate angles between parallel horizontal lines.'),
    mcq('The rule of thumb for a 3° approach path is about:', ['300 ft per NM', '30 ft per NM', '3,000 ft per NM', '100 ft per NM'], '6,076 × tan 3° ≈ 318 ft per NM.'),
  ],
  assessment: [
    num('About how high is a 3° path 5 NM from the touchdown point?', 1592, 20, 'ft', '5 × 318.4 ≈ 1,592 ft.'),
    num('From 1,000 ft, a point on the ground is seen at an angle of depression of 10°. What is the horizontal distance?', 5671, 20, 'ft', '1,000 ÷ tan 10° ≈ 5,671 ft.'),
    num('What angle does a slope of 1 in 10 make with the horizontal?', 5.71, 0.05, '°', 'tan⁻¹(0.1) ≈ 5.71°.'),
    num('An aircraft is 2,000 ft above the runway and 6 NM from the touchdown point. What is the angle to that point?', 3.14, 0.05, '°', 'tan⁻¹(2,000 ÷ 36,456) ≈ 3.14°.'),
    mcq('At a given distance the aircraft is higher than the 3° path. The angle to the touchdown point is:', ['Steeper than 3°', 'Shallower than 3°', 'Exactly 3°', 'Zero'], 'More height over the same distance means a larger angle.'),
    tf('On a constant angle, doubling the distance doubles the height.', true, 'Height = distance × tan(angle), and tan(angle) does not change.'),
  ],
  missionId: 'm-math-elevation', sources: ['phak', 'afh'],
});

export const sequences = lesson('Sequences', {
  id: 'math-sequences', title: 'Sequences and Patterns', minutes: 10, level: 1, prereqs: ['math-arithmetic', 'math-powers'],
  objectives: ['Continue arithmetic and geometric sequences.', 'Find any term of an arithmetic sequence.', 'Add up an arithmetic sequence.'],
  intro: 'Fuel left after each hour, a value that halves at every step, a climb in equal steps: these are sequences. Spotting the pattern lets you jump straight to any step instead of counting one by one.',
  simple: 'An arithmetic sequence adds the same amount each time. A geometric sequence multiplies by the same amount each time.',
  sections: [
    { h: 'Arithmetic sequences', body: [
      'Each term is the previous one plus a fixed **difference d**: 7, 11, 15, 19 … (d = 4).',
      'The n-th term is `aₙ = a₁ + (n − 1) × d`. With a₁ = 5 and d = 3, the 20th term is 5 + 19 × 3 = **62**.',
      'Fuel at a steady burn is arithmetic: 150 L burning 24 L/h leaves 126, 102, 78, 54 L after 1 to 4 hours.',
    ], formula: 'arith-seq', lab: 'formula:arith-seq' },
    { h: 'Geometric sequences', body: [
      'Each term is the previous one times a fixed **ratio r**: 3, 6, 12, 24 … (r = 2), or 1,000, 500, 250, 125 … (r = 0.5).',
      'The n-th term is `aₙ = a₁ × rⁿ⁻¹`.',
    ] },
    { h: 'Adding an arithmetic sequence', body: [
      'Sum = number of terms × (first + last) ÷ 2. So 1 + 2 + … + 10 = 10 × 11 ÷ 2 = **55**.',
    ], note: 'A real fuel burn is not perfectly steady (the climb burns more). A sequence is a planning model, not a guarantee.' },
  ],
  examples: [
    { title: 'Fuel by the hour', steps: ['150 L on board, burning 24 L/h.', 'After n hours: 150 − 24n.', 'After 4 h: 150 − 96 = 54 L.'] },
    { title: 'Halving', steps: ['Start at 1,000 and halve at every step.', 'Step 1: 500, step 2: 250, step 3: 125.', 'Geometric with r = 0.5.'] },
  ],
  practice: [
    num('What comes next: 7, 11, 15, …?', 19, 0.01, '', 'The difference is 4.'),
    num('150 L of fuel at a steady 24 L/h. How many litres are left after 4 hours?', 54, 0.1, 'L', '150 − 4 × 24 = 54 L.'),
    num('What comes next: 3, 6, 12, …?', 24, 0.01, '', 'Each term doubles.'),
    num('What is 1 + 2 + 3 + … + 10?', 55, 0.01, '', '10 × (1 + 10) ÷ 2 = 55.'),
    mcq('100, 50, 25, … is:', ['Geometric, ratio 0.5', 'Arithmetic, difference −50', 'Neither', 'Arithmetic, difference 0.5'], 'Each term is half the previous one.'),
  ],
  assessment: [
    num('An arithmetic sequence starts at 5 with difference 3. What is the 20th term?', 62, 0.01, '', '5 + 19 × 3 = 62.'),
    num('150 L of fuel at a steady 24 L/h. After how many hours are 30 L left?', 5, 0.01, 'h', '(150 − 30) ÷ 24 = 5 h.'),
    num('In the sequence 2, 4, 8, …, what is the 8th term?', 256, 0.01, '', '2 × 2⁷ = 256.'),
    num('What is the sum 2 + 4 + 6 + … + 20?', 110, 0.01, '', '10 terms × (2 + 20) ÷ 2 = 110.'),
    tf('In an arithmetic sequence the difference between consecutive terms is constant.', true, 'That fixed difference defines the sequence.'),
    mcq('1,000 is halved three times. The result is:', ['125', '250', '333', '500'], '1,000 → 500 → 250 → 125.'),
  ],
  missionId: 'm-math-sequences', sources: ['phak'],
});

export const readingCharts = lesson('Charts and tables', {
  id: 'math-reading-charts', title: 'Reading Performance Charts and Tables', minutes: 12, level: 2, prereqs: ['math-graphs-and-functions', 'math-linear-relationships'],
  objectives: ['Read a value from a table or a graph, checking the units.', 'Interpolate between printed values.', 'Apply conservative rounding and avoid extrapolation.'],
  intro: 'Take-off distance, climb rate and fuel flow come from charts and tables in the flight manual. Reading them correctly, and sensibly between the printed lines, is a core pilot skill.',
  simple: 'Check the units, find the two printed values either side of yours, and take the value in between. Never extend a chart beyond its edges.',
  sections: [
    { h: 'Read carefully', body: [
      'Before reading a value, check what each **axis or column** means and its **units** (metres or feet, °C or °F, kg or lb).',
      'Many charts are read in steps: across from one value, down to a reference line, then across again. Follow the guide lines exactly.',
    ] },
    { h: 'Interpolation', body: [
      'If your value lies between two printed ones, assume a straight line between them: this is **interpolation**.',
      'A table gives 300 m at 2,000 ft and 360 m at 4,000 ft. At 3,000 ft (halfway) the distance is halfway: **330 m**. At 2,500 ft (a quarter of the way) it is 300 + 0.25 × 60 = **315 m**.',
    ], formula: 'interpolate', lab: 'formula:interpolate' },
    { h: 'Be conservative', body: [
      'When unsure, use the **less favourable** value (the higher distance, the lower climb rate).',
      'Do **not extrapolate** beyond the chart: the data may not hold there, and the aircraft may not be allowed to operate there.',
    ], note: 'Use the charts in the flight manual for the actual aircraft. The tables in this lesson are invented for practice.' },
  ],
  examples: [
    { title: 'Interpolating a table', steps: ['1,000 kg → 520 m; 1,200 kg → 600 m.', '1,100 kg is halfway between.', 'Distance = (520 + 600) ÷ 2 = 560 m.'] },
    { title: 'Applying a correction', steps: ['The chart gives 400 m on a paved runway.', 'A note says add 10 percent on dry grass.', '400 × 1.1 = 440 m.'] },
  ],
  practice: [
    num('A table gives 300 m at 2,000 ft and 360 m at 4,000 ft. What is the distance at 3,000 ft?', 330, 0.5, 'm', 'Halfway between 300 and 360.'),
    num('Using the same table, what is the distance at 2,500 ft?', 315, 0.5, 'm', 'A quarter of the way: 300 + 15.'),
    mcq('Your conditions are outside the range of the chart. You should:', ['Not extrapolate: use other data from the manufacturer or choose a safer option', 'Extend the line', 'Use the nearest printed value', 'Halve the value'], 'Data outside the chart may not hold, and the operation may not be permitted.'),
    tf('Always check the units on each axis before reading a value.', true, 'Mixing feet and metres, or °C and °F, gives badly wrong answers.'),
    num('A table gives 420 m at 10 °C and 480 m at 30 °C. What is the distance at 20 °C?', 450, 0.5, 'm', 'Halfway between 420 and 480.'),
  ],
  assessment: [
    num('A table gives 250 m at 1,000 ft and 290 m at 3,000 ft. What is the distance at 1,500 ft?', 260, 0.5, 'm', 'A quarter of the way: 250 + 10.'),
    num('A table gives 400 m at 0 °C and 440 m at 20 °C. What is the distance at 15 °C?', 430, 0.5, 'm', 'Three quarters of the way: 400 + 30.'),
    num('The chart gives 400 m on a paved runway and says add 10 percent on dry grass. What is the grass distance?', 440, 0.5, 'm', '400 × 1.1 = 440 m.'),
    num('A table gives 520 m at 1,000 kg and 600 m at 1,200 kg. What is the distance at 1,100 kg?', 560, 0.5, 'm', 'Halfway between 520 and 600.'),
    mcq('Reading a value between two printed lines is called:', ['Interpolation', 'Extrapolation', 'Estimation', 'Elimination'], 'Interpolation works between known values; extrapolation goes beyond them.'),
    tf('When in doubt between two chart values, a conservative pilot uses the less favourable one.', true, 'A safety margin is better than an optimistic guess.'),
  ],
  missionId: 'm-math-charts', sources: ['phak', 'afh'],
});
