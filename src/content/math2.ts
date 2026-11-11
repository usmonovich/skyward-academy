// Pre-Flight Academy mathematics, second batch: the number skills every later lesson relies on.
import { lesson, mcq, num, order, tf } from './q';

export const arithmetic = lesson('Arithmetic', {
  id: 'math-arithmetic', title: 'Basic Arithmetic and Order of Operations', minutes: 9, level: 1,
  objectives: ['Add, subtract, multiply and divide with confidence.', 'Apply the correct order of operations.', 'Check an answer with the inverse operation.', 'Add flight times given in hours and minutes.'],
  intro: 'Every flight starts with small sums: fuel on board, time for each leg, the load in the cabin. They are simple, but one slip in the order of working gives a completely wrong answer.',
  simple: 'There are four basic operations. When a sum mixes them, do brackets first, then multiply and divide, then add and subtract. Check by working backwards.',
  sections: [
    { h: 'Four operations', body: [
      '**Addition** and **subtraction** are opposites: 45 + 38 = 83, and 83 − 38 = 45.',
      '**Multiplication** and **division** are opposites too: 6 × 7 = 42, and 42 ÷ 7 = 6.',
      'Opposite operations are called **inverse operations**. Use them to check your work.',
    ] },
    { h: 'Order of operations', body: [
      'When a calculation mixes operations, the agreed order is: **brackets**, then **powers**, then **multiplication and division**, then **addition and subtraction**.',
      '`6 + 4 × 3` means 6 + 12 = 18, not 30. If you want the addition first, write brackets: `(6 + 4) × 3 = 30`.',
      'Operations of the same rank are worked from left to right: 10 − 4 + 2 = 8.',
    ], formula: 'order-ops', lab: 'formula:order-ops' },
    { h: 'Hours and minutes', body: [
      'Time does not use tens: there are 60 minutes in an hour. To add 2 h 45 min and 1 h 30 min, add the minutes first: 45 + 30 = 75 min = 1 h 15 min. Then add the hours: 2 + 1 + 1 = 4 h. The total is 4 h 15 min.',
      'Converting everything to minutes also works: 165 + 90 = 255 minutes.',
    ], note: 'A calculator follows the order of operations only if it is a scientific type. Simple calculators work strictly left to right, so enter brackets or work in steps.' },
  ],
  examples: [
    { title: 'Mixed operations', steps: ['Work out 20 − 12 ÷ 4.', 'Division first: 12 ÷ 4 = 3.', 'Then subtraction: 20 − 3 = 17.'] },
    { title: 'Fuel on board', steps: ['The left tank holds 45 L and the right tank 38 L. The taxi uses 12 L.', '45 + 38 = 83 L.', '83 − 12 = 71 L remain.', 'Check with the inverse: 71 + 12 = 83.'] },
  ],
  practice: [
    num('6 + 4 × 3 = ?', 18, 0.001, '', 'Multiply first: 4 × 3 = 12, then 6 + 12 = 18.', 'Which operation comes first?'),
    num('(6 + 4) × 3 = ?', 30, 0.001, '', 'Brackets first: 10 × 3 = 30.'),
    num('20 − 12 ÷ 4 = ?', 17, 0.001, '', '12 ÷ 4 = 3, then 20 − 3 = 17.'),
    mcq('In 8 + 2 × 5, which operation is done first?', ['The multiplication', 'The addition', 'It does not matter', 'Whichever is on the left'], 'Multiplication ranks above addition.'),
    num('Tanks hold 45 L and 38 L; 12 L is used. Fuel remaining?', 71, 0.001, 'L', '45 + 38 − 12 = 71 L.'),
    num('Add 2 h 45 min and 1 h 30 min. Give the total in minutes.', 255, 0.001, 'min', '165 + 90 = 255 min (4 h 15 min).', 'Change each time to minutes first.'),
  ],
  assessment: [
    num('5 + 3 × 4 = ?', 17, 0.001, '', '3 × 4 = 12, then 5 + 12 = 17.'),
    num('(5 + 3) × 4 = ?', 32, 0.001, '', '8 × 4 = 32.'),
    num('30 − 18 ÷ 6 = ?', 27, 0.001, '', '18 ÷ 6 = 3, then 30 − 3 = 27.'),
    num('24 ÷ (2 + 4) = ?', 4, 0.001, '', 'Brackets first: 24 ÷ 6 = 4.'),
    num('Add 1 h 20 min and 55 min. Give the total in minutes.', 135, 0.001, 'min', '80 + 55 = 135 min (2 h 15 min).'),
    tf('In 10 − 4 + 2 you work from left to right, giving 8.', true, 'Addition and subtraction have equal rank, so work left to right: 6 + 2 = 8.'),
    mcq('The inverse of multiplication is:', ['Division', 'Addition', 'Subtraction', 'Squaring'], 'Division undoes multiplication.'),
  ],
  missionId: 'm-math-arithmetic', sources: ['phak'],
});

export const negatives = lesson('Negative numbers', {
  id: 'math-negatives', title: 'Positive and Negative Numbers', minutes: 9, level: 1, prereqs: ['math-arithmetic'],
  objectives: ['Place positive and negative numbers on a number line.', 'Add and subtract negative numbers.', 'Multiply and divide with signs.', 'Calculate a temperature deviation from the standard atmosphere.'],
  intro: 'At cruising altitude the outside air is far below freezing. Pilots work with negative temperatures every day, so signs must be second nature.',
  simple: 'Negative numbers are numbers below zero. Adding a negative moves you down the number line; subtracting a negative moves you up. Two negatives multiplied make a positive.',
  sections: [
    { h: 'The number line', body: [
      'Picture a thermometer. Numbers above zero are **positive**; numbers below zero are **negative**. Further down means smaller: −20 is less than −5.',
    ] },
    { h: 'Adding and subtracting', body: [
      'Adding a negative number is the same as subtracting: `4 + (−9) = 4 − 9 = −5`.',
      'Subtracting a negative number is the same as adding: `−3 − (−7) = −3 + 7 = 4`.',
      'A change is always **new value − old value**. From +3 °C to −11 °C the change is −11 − 3 = −14 °C.',
    ] },
    { h: 'Multiplying and dividing', body: [
      'Same signs give a positive answer; different signs give a negative answer.',
      '`(−4) × (−6) = 24`, `(−5) × 7 = −35`, `−12 ÷ (−3) = 4`.',
    ] },
    { h: 'ISA deviation', body: [
      'The standard atmosphere (ISA) is +15 °C at sea level and falls about 2 °C per 1,000 ft. Pilots compare the actual temperature with it: `deviation = actual temperature − ISA temperature`.',
      'At 10,000 ft the ISA temperature is 15 − 20 = −5 °C. If the actual temperature is −10 °C, the deviation is −10 − (−5) = −5 °C, spoken as "ISA minus five".',
    ], formula: 'isa-dev', lab: 'formula:isa-dev', note: 'The 2 °C per 1,000 ft figure is a rounded value (the exact ISA lapse rate is 1.98 °C) and applies only up to about 36,000 ft.' },
  ],
  examples: [
    { title: 'Subtracting a negative', steps: ['Work out 6 − (−4).', 'Subtracting a negative is adding: 6 + 4.', 'The answer is 10.'] },
    { title: 'ISA deviation', steps: ['At 8,000 ft the actual temperature is +4 °C.', 'ISA temperature = 15 − (2 × 8) = −1 °C.', 'Deviation = 4 − (−1) = +5 °C: "ISA plus five".'] },
  ],
  practice: [
    num('−5 + 8 = ?', 3, 0.001, '', 'Start at −5 and move up 8: the answer is 3.'),
    num('4 − 9 = ?', -5, 0.001, '', 'Moving down 9 from 4 passes zero and reaches −5.'),
    num('−3 − (−7) = ?', 4, 0.001, '', 'Subtracting a negative is adding: −3 + 7 = 4.', 'Two minus signs together become a plus.'),
    num('(−4) × (−6) = ?', 24, 0.001, '', 'Same signs give a positive result.'),
    num('The temperature falls from +3 °C to −11 °C. What is the change?', -14, 0.001, '°C', '−11 − 3 = −14 °C.', 'New value minus old value.'),
    num('At 10,000 ft the actual temperature is −10 °C. ISA deviation (use 2 °C per 1,000 ft)?', -5, 0.001, '°C', 'ISA is −5 °C. −10 − (−5) = −5 °C.'),
  ],
  assessment: [
    num('−8 + 3 = ?', -5, 0.001, '', 'Start at −8 and move up 3.'),
    num('6 − (−4) = ?', 10, 0.001, '', '6 + 4 = 10.'),
    num('(−5) × 7 = ?', -35, 0.001, '', 'Different signs give a negative result.'),
    num('−12 ÷ (−3) = ?', 4, 0.001, '', 'Same signs give a positive result.'),
    num('ISA temperature at 8,000 ft (use 2 °C per 1,000 ft)?', -1, 0.001, '°C', '15 − 16 = −1 °C.'),
    tf('A negative number multiplied by a negative number gives a negative number.', false, 'Two negatives multiplied give a positive.'),
    mcq('Which temperature is the coldest?', ['−20 °C', '−5 °C', '0 °C', '+3 °C'], '−20 is the furthest below zero.'),
  ],
  missionId: 'm-math-negatives', sources: ['phak', 'icao-7488'],
});

export const fractions = lesson('Fractions', {
  id: 'math-fractions', title: 'Fractions', minutes: 10, level: 1, prereqs: ['math-arithmetic'],
  objectives: ['Read a fraction and name its parts.', 'Simplify fractions and find equivalent fractions.', 'Add fractions and multiply fractions.', 'Find a fraction of a quantity.'],
  intro: 'A fuel gauge reads in quarters. Cloud cover is reported in eighths of the sky. Fractions are part of the everyday language of flying.',
  simple: 'A fraction is a part of a whole. The bottom number says how many equal parts the whole is cut into; the top number says how many you have. To find a fraction of something, divide by the bottom and multiply by the top.',
  sections: [
    { h: 'Parts of a fraction', body: [
      'In `3/4` the **denominator** 4 is the number of equal parts and the **numerator** 3 is how many of them are counted.',
      'Dividing the numerator by the denominator gives the decimal: 3 ÷ 4 = 0.75.',
    ] },
    { h: 'Equivalent fractions and simplifying', body: [
      'Multiplying or dividing the top and bottom by the same number does not change the value: `6/8 = 3/4`, `2/3 = 4/6`.',
      'A fraction is in its **simplest form** when no number except 1 divides both top and bottom.',
    ] },
    { h: 'Adding and multiplying', body: [
      'To **add**, first give the fractions the same denominator: `1/2 + 1/4 = 2/4 + 1/4 = 3/4`.',
      'To **multiply**, multiply the tops and multiply the bottoms: `2/3 × 3/4 = 6/12 = 1/2`.',
    ] },
    { h: 'A fraction of a quantity', body: [
      'Divide by the denominator, then multiply by the numerator. Three quarters of a 120 L tank is 120 ÷ 4 × 3 = 90 L.',
      'Cloud amount is given in **oktas**, eighths of the sky. Five oktas means 5/8 of the sky is covered.',
    ], formula: 'fraction-of', lab: 'formula:fraction-of', note: 'Aircraft fuel gauges are approximate. A gauge reading is never a substitute for checking the fuel quantity before flight.' },
  ],
  examples: [
    { title: 'Fuel in a tank', steps: ['A 160 L tank shows 3/8 full.', '160 ÷ 8 = 20 L for each eighth.', '20 × 3 = 60 L.'] },
    { title: 'Adding fractions', steps: ['Work out 1/4 + 1/8.', 'Change 1/4 to 2/8.', '2/8 + 1/8 = 3/8, which is 0.375.'] },
  ],
  practice: [
    num('What is 3/4 of 120 L?', 90, 0.01, 'L', '120 ÷ 4 × 3 = 90 L.', 'Divide by the bottom, multiply by the top.'),
    num('1/2 + 1/4 = ? Give the answer as a decimal.', 0.75, 0.001, '', '2/4 + 1/4 = 3/4 = 0.75.'),
    mcq('Which is 6/8 in its simplest form?', ['3/4', '2/3', '6/8', '1/2'], 'Divide top and bottom by 2.'),
    num('2/3 × 3/4 = ? Give the answer as a decimal.', 0.5, 0.001, '', '6/12 = 1/2 = 0.5.'),
    num('Cloud covers 5 oktas (5/8) of the sky. What decimal fraction is that?', 0.625, 0.001, '', '5 ÷ 8 = 0.625.'),
  ],
  assessment: [
    num('What is 2/5 of 150 L?', 60, 0.01, 'L', '150 ÷ 5 × 2 = 60 L.'),
    num('1/4 + 1/8 = ? Give the answer as a decimal.', 0.375, 0.001, '', '2/8 + 1/8 = 3/8 = 0.375.'),
    num('A 160 L tank is 3/8 full. How many litres?', 60, 0.01, 'L', '160 ÷ 8 × 3 = 60 L.'),
    mcq('Which fraction is equivalent to 4/6?', ['2/3', '3/4', '4/5', '1/2'], 'Divide top and bottom by 2.'),
    mcq('1/2 × 1/3 = ?', ['1/6', '2/5', '1/5', '2/3'], 'Multiply tops (1) and bottoms (6).'),
    tf('3/5 is greater than 1/2.', true, '3/5 = 0.6, which is more than 0.5.'),
    mcq('In the fraction 7/8, the number 8 is the:', ['Denominator', 'Numerator', 'Quotient', 'Remainder'], 'The denominator is the number of equal parts.'),
  ],
  missionId: 'm-math-fractions', sources: ['phak'],
});

export const percentages = lesson('Percentages', {
  id: 'math-percentages', title: 'Percentages', minutes: 10, level: 1, prereqs: ['math-fractions'],
  objectives: ['Explain what a percentage is.', 'Find a percentage of a quantity.', 'Express one number as a percentage of another.', 'Calculate a percentage change and a gradient.'],
  intro: 'Engine power, runway slope, climb gradient and performance margins are all quoted in per cent. A percentage is simply a fraction with 100 on the bottom.',
  simple: 'Per cent means "out of one hundred". To find a percentage of something, divide the percentage by 100 and multiply. To see what percentage one number is of another, divide and multiply by 100.',
  sections: [
    { h: 'Out of one hundred', body: [
      '`25% = 25/100 = 0.25`. To change a percentage to a decimal, divide by 100; to change a decimal to a percentage, multiply by 100.',
    ] },
    { h: 'A percentage of a quantity', body: [
      '`p% of x = (p ÷ 100) × x`. So 15% of 200 is 0.15 × 200 = 30.',
      'To find what percentage one number is of another: `part ÷ whole × 100`. 60 out of 240 is 60 ÷ 240 × 100 = 25%.',
    ], formula: 'percent-of', lab: 'formula:percent-of' },
    { h: 'Percentage change', body: [
      '`change % = (new − old) ÷ old × 100`. From 50 to 60 is 10 ÷ 50 × 100 = 20%.',
      'To increase a number by a percentage, multiply by (1 + p ÷ 100): 80 increased by 25% is 80 × 1.25 = 100.',
      'Increasing by 10% and then decreasing by 10% does not return to the start, because the second 10% is taken from a larger number: 100 → 110 → 99.',
    ] },
    { h: 'Gradient as a percentage', body: [
      'A **gradient** is height gained divided by horizontal distance, times 100. Climbing 300 ft while covering 6,000 ft over the ground is 300 ÷ 6,000 × 100 = 5%.',
    ], note: 'Both distances must be in the same unit before dividing. Mixing feet with nautical miles is a common mistake (1 NM ≈ 6,076 ft).' },
  ],
  examples: [
    { title: 'Percentage of a fuel load', steps: ['Find 5% of 90 L.', '5 ÷ 100 = 0.05.', '0.05 × 90 = 4.5 L.'] },
    { title: 'Percentage decrease', steps: ['Decrease 200 by 15%.', '15% of 200 = 30.', '200 − 30 = 170. (Or 200 × 0.85 = 170.)'] },
  ],
  practice: [
    num('What is 15% of 200?', 30, 0.01, '', '0.15 × 200 = 30.'),
    num('60 is what percentage of 240?', 25, 0.01, '%', '60 ÷ 240 × 100 = 25%.', 'Part divided by whole, times 100.'),
    num('Increase 80 by 25%.', 100, 0.01, '', '80 × 1.25 = 100.'),
    num('An aircraft climbs 300 ft while covering 6,000 ft over the ground. Gradient?', 5, 0.01, '%', '300 ÷ 6,000 × 100 = 5%.'),
    num('What is 5% of 90 L?', 4.5, 0.01, 'L', '0.05 × 90 = 4.5 L.'),
  ],
  assessment: [
    num('What is 20% of 150?', 30, 0.01, '', '0.20 × 150 = 30.'),
    num('45 is what percentage of 180?', 25, 0.01, '%', '45 ÷ 180 × 100 = 25%.'),
    num('Decrease 200 by 15%.', 170, 0.01, '', '200 × 0.85 = 170.'),
    num('A value rises from 50 to 60. Percentage change?', 20, 0.01, '%', '(60 − 50) ÷ 50 × 100 = 20%.'),
    num('An aircraft climbs 240 ft while covering 8,000 ft over the ground. Gradient?', 3, 0.01, '%', '240 ÷ 8,000 × 100 = 3%.'),
    tf('Increasing a number by 10% and then decreasing the result by 10% gives the original number.', false, '100 → 110 → 99. The second percentage is taken from a larger number.'),
    mcq('35% written as a decimal is:', ['0.35', '3.5', '0.035', '35.0'], 'Divide by 100.'),
  ],
  missionId: 'm-math-percentages', sources: ['phak'],
});

export const ratios = lesson('Ratios and proportions', {
  id: 'math-ratios', title: 'Ratios and Proportions', minutes: 10, level: 1, prereqs: ['math-fractions'],
  objectives: ['Write and simplify a ratio.', 'Solve a proportion.', 'Use a chart scale.', 'Use a glide ratio to find gliding distance.'],
  intro: 'A chart scale, a glide ratio and a fuel burn rate are all ratios. Once you can scale one quantity from another, a whole family of flying problems becomes the same problem.',
  simple: 'A ratio compares two amounts. If two ratios are equal, you can find a missing number by scaling: multiply or divide both parts by the same amount.',
  sections: [
    { h: 'Ratios', body: [
      'A **ratio** compares two quantities: `12 : 8`. Divide both parts by the same number to simplify: `12 : 8 = 3 : 2`.',
    ] },
    { h: 'Proportion', body: [
      'A **proportion** says two ratios are equal: `x / 20 = 3 / 4`. Multiply both sides by 20: x = 20 × 3 ÷ 4 = 15.',
      'Rates work the same way. If an engine burns 30 L in 60 minutes, in 45 minutes it burns 30 × 45 ÷ 60 = 22.5 L.',
    ] },
    { h: 'Chart scale', body: [
      'A scale of **1 : 500,000** means 1 unit on the chart is 500,000 of the same unit on the ground. 1 cm on the chart is 500,000 cm = 5 km.',
      '4 cm on that chart is therefore 20 km.',
    ] },
    { h: 'Glide ratio', body: [
      'A **glide ratio** of 9 : 1 means the aircraft travels 9 units forward for every 1 unit of height lost in still air.',
      '`glide distance = glide ratio × height`. From 3,000 ft above the ground, a 9 : 1 aircraft can glide about 27,000 ft, roughly 4.4 NM.',
    ], formula: 'glide', lab: 'formula:glide', note: 'A published glide ratio applies in still air at the best-glide speed and in a clean configuration. Wind, turns and a windmilling propeller all reduce the distance actually achieved.' },
  ],
  examples: [
    { title: 'Solving a proportion', steps: ['x / 12 = 5 / 6.', 'Multiply both sides by 12: x = 12 × 5 ÷ 6.', 'x = 10.'] },
    { title: 'Chart distance', steps: ['Scale 1 : 250,000. Two points are 6 cm apart.', '1 cm = 250,000 cm = 2.5 km.', '6 × 2.5 = 15 km.'] },
  ],
  practice: [
    mcq('Simplify the ratio 12 : 8.', ['3 : 2', '2 : 3', '6 : 2', '4 : 3'], 'Divide both parts by 4.'),
    num('Solve x / 20 = 3 / 4.', 15, 0.001, '', 'x = 20 × 3 ÷ 4 = 15.', 'Multiply both sides by 20.'),
    num('On a 1 : 500,000 chart, how many kilometres does 4 cm represent?', 20, 0.01, 'km', '1 cm = 5 km, so 4 cm = 20 km.'),
    num('Glide ratio 9 : 1, height 3,000 ft. Gliding distance in feet?', 27000, 1, 'ft', '9 × 3,000 = 27,000 ft.'),
    num('An engine burns 2 L every 5 minutes. Fuel used in 12 minutes?', 4.8, 0.01, 'L', '2 × 12 ÷ 5 = 4.8 L.'),
  ],
  assessment: [
    mcq('Simplify the ratio 15 : 25.', ['3 : 5', '5 : 3', '1 : 2', '3 : 4'], 'Divide both parts by 5.'),
    num('Solve x / 12 = 5 / 6.', 10, 0.001, '', 'x = 12 × 5 ÷ 6 = 10.'),
    num('On a 1 : 250,000 chart, how many kilometres does 6 cm represent?', 15, 0.01, 'km', '1 cm = 2.5 km, so 6 cm = 15 km.'),
    num('Glide ratio 10 : 1, height 2,000 ft. Gliding distance in feet?', 20000, 1, 'ft', '10 × 2,000 = 20,000 ft.'),
    num('An engine burns 30 L in 60 minutes. Fuel used in 45 minutes?', 22.5, 0.01, 'L', '30 × 45 ÷ 60 = 22.5 L.'),
    tf('On a 1 : 500,000 chart, 1 cm represents 5 km.', true, '500,000 cm = 5,000 m = 5 km.'),
    mcq('A published glide ratio assumes:', ['Still air at the best-glide speed', 'A strong tailwind', 'Full flap and gear down', 'Any airspeed'], 'Wind and configuration change the distance actually achieved.'),
  ],
  missionId: 'm-math-ratios', sources: ['phak', 'afh'],
});

export const powers = lesson('Powers and roots', {
  id: 'math-powers', title: 'Powers and Roots', minutes: 10, level: 1, prereqs: ['math-arithmetic'],
  objectives: ['Calculate squares, cubes and other powers.', 'Find square roots.', 'Use the rule for multiplying powers.', 'Explain why squared quantities grow quickly.'],
  intro: 'Lift, drag and kinetic energy all depend on speed squared. To understand why a little extra speed matters so much, you need powers — and to undo them, roots.',
  simple: 'A power is repeated multiplication: 5 squared is 5 × 5. A square root goes the other way: the square root of 25 is 5. Anything that depends on a square grows much faster than the number itself.',
  sections: [
    { h: 'Powers', body: [
      '`7² = 7 × 7 = 49` is "seven squared". `10³ = 10 × 10 × 10 = 1,000` is "ten cubed". In `2⁵`, 2 is the **base** and 5 is the **exponent**: 2 × 2 × 2 × 2 × 2 = 32.',
      'When you multiply powers of the same base, add the exponents: `x² × x³ = x⁵`.',
    ] },
    { h: 'Square roots', body: [
      'The **square root** undoes squaring: `√144 = 12` because 12 × 12 = 144.',
      'A root applies to the whole number under it. `√(9 + 16) = √25 = 5`, which is not √9 + √16 = 7.',
    ] },
    { h: 'Why squares matter', body: [
      'If a quantity depends on speed squared, doubling the speed multiplies it by 4 and tripling the speed multiplies it by 9.',
      'Roots appear when you work backwards. Stall speed depends on the square root of weight: `Vs₂ = Vs₁ × √(W₂ ÷ W₁)`. A 21% increase in weight raises the stall speed by √1.21 = 1.1, or 10%.',
    ], formula: 'stall-weight', lab: 'formula:stall-weight', note: 'The stall-speed relation holds for the same configuration and load factor. Published stall speeds for a real aircraft come from its flight manual.' },
  ],
  examples: [
    { title: 'A power', steps: ['Work out 2⁶.', '2 × 2 × 2 × 2 × 2 × 2.', '= 64.'] },
    { title: 'Stall speed at a higher weight', steps: ['Stall speed is 50 kt at 1,000 kg. Find it at 1,210 kg.', 'W₂ ÷ W₁ = 1.21, and √1.21 = 1.1.', 'Vs₂ = 50 × 1.1 = 55 kt.'] },
  ],
  practice: [
    num('7² = ?', 49, 0.001, '', '7 × 7 = 49.'),
    num('2⁵ = ?', 32, 0.001, '', '2 × 2 × 2 × 2 × 2 = 32.'),
    num('√144 = ?', 12, 0.001, '', '12 × 12 = 144.'),
    num('10³ = ?', 1000, 0.001, '', '10 × 10 × 10 = 1,000.'),
    mcq('A quantity depends on speed squared. If speed triples, the quantity becomes:', ['Nine times larger', 'Three times larger', 'Six times larger', 'Twenty-seven times larger'], '3² = 9.'),
    num('√1.21 = ?', 1.1, 0.001, '', '1.1 × 1.1 = 1.21.'),
  ],
  assessment: [
    num('9² = ?', 81, 0.001, '', '9 × 9 = 81.'),
    num('2⁶ = ?', 64, 0.001, '', 'Six twos multiplied together give 64.'),
    num('√225 = ?', 15, 0.001, '', '15 × 15 = 225.'),
    num('5³ = ?', 125, 0.001, '', '5 × 5 × 5 = 125.'),
    mcq('x² × x³ = ?', ['x⁵', 'x⁶', 'x¹', '2x⁵'], 'Add the exponents: 2 + 3 = 5.'),
    num('Stall speed is 50 kt. Weight increases by 21% (factor 1.21). New stall speed?', 55, 0.1, 'kt', '50 × √1.21 = 50 × 1.1 = 55 kt.'),
    tf('√(a + b) is always equal to √a + √b.', false, '√(9 + 16) = 5, but √9 + √16 = 7.'),
  ],
  missionId: 'm-math-powers', sources: ['phak'],
});

export const angles = lesson('Angles', {
  id: 'math-angles', title: 'Angles and Headings', minutes: 10, level: 1, prereqs: ['math-arithmetic'],
  objectives: ['Measure angles in degrees and name the main types.', 'Read and write compass headings.', 'Find a reciprocal heading.', 'Find the smallest angle between two headings.'],
  intro: 'Every direction in aviation is an angle: headings, tracks, wind directions, runway numbers. Working with a circle of 360 degrees is a skill you will use on every flight.',
  simple: 'A full turn is 360 degrees. Directions are measured clockwise from north, so east is 090, south is 180 and west is 270. The opposite direction is 180 degrees away.',
  sections: [
    { h: 'Degrees', body: [
      'A full circle is **360°**. A quarter turn is a **right angle**, 90°. An angle smaller than 90° is **acute**; between 90° and 180° it is **obtuse**.',
      'Angles on a straight line add up to 180°. The three angles of any triangle also add up to 180°.',
    ] },
    { h: 'Compass headings', body: [
      'Directions are measured **clockwise from north** and written with three digits: north is 360 (or 000), east 090, south 180, west 270.',
      'Runways are numbered by their direction divided by ten and rounded: a runway pointing about 090° is runway 09.',
    ] },
    { h: 'Reciprocals', body: [
      'The **reciprocal** is the opposite direction, 180° away. Add 180 if the heading is less than 180; subtract 180 if it is more.',
      'The reciprocal of 040 is 220. The reciprocal of 310 is 130. The other end of runway 09 is runway 27.',
    ], formula: 'reciprocal', lab: 'formula:reciprocal' },
    { h: 'The angle between two headings', body: [
      'Subtract the smaller from the larger. If the answer is more than 180°, subtract it from 360° to get the shorter way round.',
      'From 350 to 020: 350 − 20 = 330, and 360 − 330 = 30°. The short turn is 30° to the right.',
    ], note: 'Headings can be referenced to true north or magnetic north. They differ by the local magnetic variation, which you will study in Navigation.' },
  ],
  examples: [
    { title: 'Reciprocal heading', steps: ['Find the reciprocal of 250.', '250 is more than 180, so subtract: 250 − 180.', 'The reciprocal is 070.'] },
    { title: 'A missing angle', steps: ['Two angles of a triangle are 50° and 60°.', '50 + 60 = 110.', 'The third angle is 180 − 110 = 70°.'] },
  ],
  practice: [
    num('What is the reciprocal of heading 090?', 270, 0.001, '°', '90 + 180 = 270.'),
    num('What is the reciprocal of heading 250?', 70, 0.001, '°', '250 − 180 = 070.', 'Subtract 180 when the heading is more than 180.'),
    num('What number is the opposite end of runway 09?', 27, 0.001, '', '090 + 180 = 270, so runway 27.'),
    num('You are on heading 350 and turn to 020. How many degrees is the shorter turn?', 30, 0.001, '°', '10° to reach 360, then 20° more: 30° to the right.'),
    mcq('A right angle measures:', ['90°', '180°', '45°', '360°'], 'A quarter of a full turn.'),
    num('Two angles on a straight line: one is 65°. The other?', 115, 0.001, '°', '180 − 65 = 115°.'),
  ],
  assessment: [
    num('What is the reciprocal of heading 040?', 220, 0.001, '°', '40 + 180 = 220.'),
    num('What is the reciprocal of heading 310?', 130, 0.001, '°', '310 − 180 = 130.'),
    num('What number is the opposite end of runway 16?', 34, 0.001, '', '160 + 180 = 340, so runway 34.'),
    num('What is the smallest angle between headings 030 and 330?', 60, 0.001, '°', '330 − 30 = 300; 360 − 300 = 60°.'),
    num('Two angles of a triangle are 50° and 60°. The third?', 70, 0.001, '°', '180 − 110 = 70°.'),
    mcq('A heading of due east is written:', ['090', '180', '270', '360'], 'East is a quarter turn clockwise from north.'),
    tf('A full circle contains 360 degrees.', true, 'This is the definition of the degree.'),
  ],
  missionId: 'm-math-angles', sources: ['phak'],
});

export const estimation = lesson('Estimation', {
  id: 'math-estimation', title: 'Estimation and Numerical Reasoning', minutes: 10, level: 1, prereqs: ['math-arithmetic'],
  objectives: ['Round numbers sensibly.', 'Estimate the result of a calculation before working it out.', 'Use common aviation rules of thumb.', 'Recognise an answer that cannot be right.'],
  intro: 'In the air there is rarely time for long calculations. A pilot who can estimate quickly will notice a wrong number — from a calculator, a computer or a colleague — before it causes a problem.',
  simple: 'Round the numbers to something easy, work out a rough answer in your head, and compare it with the exact one. If the two are far apart, something is wrong.',
  sections: [
    { h: 'Rounding', body: [
      'Look at the digit after the place you are rounding to. If it is 5 or more, round up; otherwise round down.',
      '1,847 to the nearest hundred is 1,800. 2,362 to the nearest hundred is 2,400. 3.14159 to two decimal places is 3.14.',
    ] },
    { h: 'Estimate first', body: [
      'Round each number, then calculate. 49 × 21 is about 50 × 20 = 1,000 (the exact answer is 1,029).',
      'An estimate tells you the size of the answer. If your calculator shows 10,290 or 102.9, you know you mis-keyed something.',
    ] },
    { h: 'Rules of thumb', body: [
      '**Miles per minute:** divide groundspeed in knots by 60. At 180 kt you cover 3 NM each minute.',
      '**Knots to km/h:** double the knots and subtract 10%. 120 kt → 240 − 24 = 216 km/h (exactly 222).',
      '**Descent planning:** on a 3° path you need about 3 NM for every 1,000 ft to lose. From 9,000 ft above the airfield, start down about 27 NM out.',
    ], formula: 'top-of-descent', lab: 'formula:top-of-descent', note: 'Rules of thumb are for cross-checking and quick planning. They do not replace performance data or published procedures, and the descent rule ignores wind and the distance needed to slow down.' },
    { h: 'Does the answer make sense?', body: [
      'Ask three questions: is the size plausible, is the unit right, and did it move the expected way? A flight of 150 NM at 100 kt cannot take 0.15 hours; it must take longer than an hour.',
    ] },
  ],
  examples: [
    { title: 'Estimate a product', steps: ['Estimate 198 × 5.', 'Round 198 to 200.', '200 × 5 = 1,000 (exact: 990).'] },
    { title: 'Top of descent', steps: ['You must lose 12,000 ft.', '12 thousand × 3 NM.', 'Start the descent about 36 NM from the airfield.'] },
  ],
  practice: [
    num('Round 1,847 to the nearest hundred.', 1800, 0.001, '', 'The tens digit is 4, so round down.'),
    mcq('Which is the best estimate of 49 × 21?', ['About 1,000', 'About 100', 'About 10,000', 'About 500'], '50 × 20 = 1,000.'),
    num('Using 3 NM per 1,000 ft, how far out should you start a descent of 9,000 ft?', 27, 0.01, 'NM', '9 × 3 = 27 NM.'),
    num('Estimate 120 kt in km/h using "double it and subtract 10%".', 216, 8, 'km/h', '240 − 24 = 216 km/h. The exact value is 222.'),
    mcq('A calculation gives 0.15 hours for 150 NM at 100 kt. You should conclude:', ['The answer is wrong; it must be more than one hour', 'The answer is right', 'The speed must be 1,000 kt', 'Hours and minutes are the same'], '150 NM at 100 kt takes 1.5 hours.'),
  ],
  assessment: [
    num('Round 2,362 to the nearest hundred.', 2400, 0.001, '', 'The tens digit is 6, so round up.'),
    num('Round 3.14159 to two decimal places.', 3.14, 0.0001, '', 'The third decimal is 1, so round down.'),
    num('Using 3 NM per 1,000 ft, how far out should you start a descent of 12,000 ft?', 36, 0.01, 'NM', '12 × 3 = 36 NM.'),
    num('At a groundspeed of 180 kt, how many nautical miles do you cover per minute?', 3, 0.001, 'NM', '180 ÷ 60 = 3 NM per minute.'),
    mcq('Which is the best estimate of 198 × 5?', ['About 1,000', 'About 100', 'About 2,000', 'About 10,000'], '200 × 5 = 1,000.'),
    tf('An estimate is useful for catching large errors even though it is not exact.', true, 'That is its purpose: a quick check on the size of the answer.'),
    order('Put the steps for checking a calculation in order.', ['Round the numbers', 'Work out a rough answer', 'Do the exact calculation', 'Compare the two results'], 'Estimate first, then compare with the exact result.'),
  ],
  missionId: 'm-math-estimation', sources: ['phak', 'afh'],
});
