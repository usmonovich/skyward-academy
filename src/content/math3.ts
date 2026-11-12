// Pre-Flight Academy mathematics, third batch: decimals, scientific notation, algebra, equations, geometry, triangles.
import { lesson, mcq, num, tf } from './q';

export const decimals = lesson('Decimals', {
  id: 'math-decimals', title: 'Decimals', minutes: 9, level: 1, prereqs: ['math-fractions'],
  objectives: ['Read decimal place values.', 'Add, subtract, multiply and divide decimals.', 'Convert between fractions and decimals.', 'Convert between decimal hours and minutes.'],
  intro: 'Flight times are logged as decimal hours, fuel is measured to a tenth of a litre and radio frequencies have three decimal places. Decimals are the everyday number format of the cockpit.',
  simple: 'A decimal is another way to write a fraction of ten, a hundred or a thousand. Line up the decimal points to add or subtract. To turn decimal hours into minutes, multiply the decimal part by 60.',
  sections: [
    { h: 'Place value', body: [
      'Each place to the right of the decimal point is ten times smaller: **tenths**, **hundredths**, **thousandths**. In 4.372 there are 3 tenths, 7 hundredths and 2 thousandths.',
      'Zeros at the end do not change the value: 0.50 = 0.5.',
    ] },
    { h: 'Calculating with decimals', body: [
      'To **add or subtract**, line up the decimal points: 2.75 + 1.5 = 4.25.',
      'To **multiply**, ignore the points, multiply, then count the decimal places: 3.2 × 0.5 = 1.6.',
      'To **divide** by a decimal, multiply both numbers by ten until the divisor is whole: 6.4 ÷ 0.8 = 64 ÷ 8 = 8.',
      'To change a fraction to a decimal, divide the top by the bottom: 3 ÷ 8 = 0.375.',
    ] },
    { h: 'Decimal hours', body: [
      'An hour has 60 minutes, not 100. To turn decimal hours into minutes, multiply by 60: 1.5 h = 90 min, and 0.75 h = 45 min.',
      'To go the other way, divide minutes by 60: 20 min = 0.33 h.',
      '1.5 hours is one hour thirty minutes, not one hour fifty.',
    ], formula: 'dec-hours', lab: 'formula:dec-hours', note: 'Pilot logbooks in many countries record time in hours and minutes, and others in decimal hours. Check which format a form expects before writing a time.' },
  ],
  examples: [
    { title: 'Leg time in minutes', steps: ['A calculation gives a leg time of 2.25 h.', '2.25 × 60 = 135.', 'The leg takes 135 minutes, or 2 h 15 min.'] },
    { title: 'Dividing by a decimal', steps: ['Work out 6.4 ÷ 0.8.', 'Multiply both by 10: 64 ÷ 8.', 'The answer is 8.'] },
  ],
  practice: [
    num('0.5 + 0.25 = ?', 0.75, 0.001, '', 'Line up the points: 0.50 + 0.25 = 0.75.'),
    num('3.2 × 0.5 = ?', 1.6, 0.001, '', '32 × 5 = 160, with two decimal places: 1.60.'),
    num('How many minutes is 1.5 hours?', 90, 0.01, 'min', '1.5 × 60 = 90 min.'),
    num('Write 45 minutes as decimal hours.', 0.75, 0.001, 'h', '45 ÷ 60 = 0.75 h.'),
    mcq('In 4.372, which digit is in the hundredths place?', ['7', '3', '2', '4'], 'Tenths 3, hundredths 7, thousandths 2.'),
  ],
  assessment: [
    num('2.75 + 1.5 = ?', 4.25, 0.001, '', '2.75 + 1.50 = 4.25.'),
    num('6.4 ÷ 0.8 = ?', 8, 0.001, '', '64 ÷ 8 = 8.'),
    num('How many minutes is 2.25 hours?', 135, 0.01, 'min', '2.25 × 60 = 135 min.'),
    num('Write 20 minutes as decimal hours, to two decimal places.', 0.33, 0.01, 'h', '20 ÷ 60 = 0.33 h.'),
    num('Write 3/8 as a decimal.', 0.375, 0.001, '', '3 ÷ 8 = 0.375.'),
    mcq('Which number is the largest?', ['0.7', '0.65', '0.07', '0.607'], '0.7 is 0.700, which is more than 0.650, 0.607 and 0.070.'),
    tf('0.50 and 0.5 have the same value.', true, 'A zero at the end of a decimal does not change it.'),
  ],
  missionId: 'm-math-decimals', sources: ['phak'],
});

export const sciNotation = lesson('Scientific notation', {
  id: 'math-scinot', title: 'Scientific Notation and Prefixes', minutes: 9, level: 1, prereqs: ['math-powers'],
  objectives: ['Write large and small numbers in scientific notation.', 'Convert scientific notation back to ordinary numbers.', 'Multiply and divide numbers in scientific notation.', 'Use the common SI prefixes.'],
  intro: 'Sea-level pressure is 101,325 pascals. A radio frequency may be 118,700,000 hertz. Scientific notation and unit prefixes keep such numbers short and hard to misread.',
  simple: 'Write the number as something between 1 and 10, multiplied by a power of ten. The power tells you how many places the decimal point moved. Prefixes such as kilo and mega are names for those powers.',
  sections: [
    { h: 'The format', body: [
      'A number in **scientific notation** is `a × 10ⁿ`, where a is at least 1 and less than 10.',
      '`3 × 10⁴ = 30,000`: the point moves four places right. `5 × 10⁻³ = 0.005`: a negative power moves it three places left.',
      '101,325 becomes 1.01325 × 10⁵. 0.00045 becomes 4.5 × 10⁻⁴.',
    ], formula: 'sci-notation', lab: 'formula:sci-notation' },
    { h: 'Multiplying and dividing', body: [
      'Multiply the front numbers and **add** the powers: (2 × 10³) × (4 × 10²) = 8 × 10⁵.',
      'Divide the front numbers and **subtract** the powers: (6 × 10⁶) ÷ (2 × 10²) = 3 × 10⁴.',
    ] },
    { h: 'SI prefixes', body: [
      '**kilo (k)** = 10³, **mega (M)** = 10⁶, **hecto (h)** = 10², **centi (c)** = 10⁻², **milli (m)** = 10⁻³.',
      'So 1 hPa = 100 Pa, 1 km = 1,000 m, and 118.7 MHz = 118,700,000 Hz.',
    ], note: 'Letter case matters: M is mega (a million) and m is milli (a thousandth).' },
  ],
  examples: [
    { title: 'Writing a large number', steps: ['Write 7,200 in scientific notation.', 'Move the point three places left: 7.2.', '7,200 = 7.2 × 10³.'] },
    { title: 'Multiplying', steps: ['(3 × 10²) × (2 × 10³).', '3 × 2 = 6, and 2 + 3 = 5.', '6 × 10⁵ = 600,000.'] },
  ],
  practice: [
    num('Write 3 × 10⁴ as an ordinary number.', 30000, 0.001, '', 'Move the point four places right.'),
    mcq('Which is 101,325 in scientific notation?', ['1.01325 × 10⁵', '10.1325 × 10⁴', '1.01325 × 10⁶', '101.325 × 10³'], 'The front number must be between 1 and 10, and the point moved five places.'),
    num('(2 × 10³) × (4 × 10²) = ? Give an ordinary number.', 800000, 0.001, '', '8 × 10⁵ = 800,000.'),
    num('Write 5 × 10⁻³ as a decimal.', 0.005, 0.00001, '', 'Move the point three places left.'),
    mcq('The prefix hecto means:', ['10² (one hundred)', '10³ (one thousand)', '10⁻² (one hundredth)', '10⁶ (one million)'], '1 hPa = 100 Pa.'),
  ],
  assessment: [
    num('Write 7.2 × 10³ as an ordinary number.', 7200, 0.001, '', 'Move the point three places right.'),
    mcq('Which is 0.00045 in scientific notation?', ['4.5 × 10⁻⁴', '4.5 × 10⁴', '45 × 10⁻⁵', '0.45 × 10⁻³'], 'The point moves four places to make 4.5.'),
    num('(3 × 10²) × (2 × 10³) = ? Give an ordinary number.', 600000, 0.001, '', '6 × 10⁵ = 600,000.'),
    num('(6 × 10⁶) ÷ (2 × 10²) = ? Give an ordinary number.', 30000, 0.001, '', '3 × 10⁴ = 30,000.'),
    num('How many hertz is 1 MHz?', 1000000, 0.001, 'Hz', 'Mega means 10⁶.'),
    mcq('The prefix kilo means:', ['10³', '10²', '10⁶', '10⁻³'], '1 km = 1,000 m.'),
    tf('12 × 10³ is correctly written scientific notation.', false, 'The front number must be less than 10: write 1.2 × 10⁴.'),
  ],
  missionId: 'm-math-scinot', sources: ['si-brochure'],
});

export const algebra = lesson('Basic algebra', {
  id: 'math-algebra', title: 'Basic Algebra', minutes: 10, level: 1, prereqs: ['math-arithmetic', 'math-negatives'],
  objectives: ['Explain what a variable and an expression are.', 'Substitute values into an expression.', 'Collect like terms and expand brackets.', 'Read a simple linear rule.'],
  intro: 'Every aviation formula is a sentence written in algebra. Before you can use formulas confidently, the letters have to stop looking mysterious: each one is simply a number you have not filled in yet.',
  simple: 'A letter stands for a number. To use an expression, replace each letter with its value and calculate. Terms with the same letter can be added together.',
  sections: [
    { h: 'Variables and expressions', body: [
      'A **variable** is a letter that stands for a number. An **expression** combines numbers and variables: `3x + 2`.',
      'In `3x`, the 3 is the **coefficient**. It means 3 multiplied by x.',
    ] },
    { h: 'Substitution', body: [
      'To **evaluate** an expression, replace each variable with its value and follow the order of operations.',
      'If x = 4, then 3x + 2 = 3 × 4 + 2 = 14. If x = −2, then x² + 1 = 4 + 1 = 5.',
    ] },
    { h: 'Simplifying', body: [
      '**Like terms** have the same variable and can be added: 2a + 3a = 5a. Unlike terms cannot: 2x + 3y stays as it is.',
      'To **expand** brackets, multiply everything inside: 2(x + 3) = 2x + 6.',
    ] },
    { h: 'A linear rule', body: [
      'Many real quantities follow `y = m × x + c`: a starting amount c plus a steady rate m.',
      'Fuel needed = 10 L for taxi and take-off + 30 L for every hour of flight: `fuel = 30t + 10`. For a 2-hour flight that is 70 L.',
    ], formula: 'linear', lab: 'formula:linear', note: 'The fuel figures here are invented for the example. Real fuel planning uses the aircraft flight manual and the fuel rules of your authority.' },
  ],
  examples: [
    { title: 'Substituting', steps: ['Evaluate 4x − 3 when x = 5.', '4 × 5 = 20.', '20 − 3 = 17.'] },
    { title: 'Expanding brackets', steps: ['Expand 3(2x + 1).', '3 × 2x = 6x and 3 × 1 = 3.', 'The result is 6x + 3.'] },
  ],
  practice: [
    num('If x = 4, what is 3x + 2?', 14, 0.001, '', '3 × 4 + 2 = 14.'),
    mcq('Simplify 2a + 3a.', ['5a', '6a', '5a²', '23a'], 'Add the coefficients of like terms.'),
    num('fuel = 30t + 10. How much fuel for t = 2 hours?', 70, 0.001, 'L', '30 × 2 + 10 = 70 L.'),
    mcq('A variable is:', ['A letter that stands for a number', 'A number that never changes', 'A unit of measurement', 'A type of bracket'], 'Its value can vary from one problem to the next.'),
    mcq('Expand 2(x + 3).', ['2x + 6', '2x + 3', 'x + 6', '2x + 5'], 'Multiply both terms inside the bracket by 2.'),
  ],
  assessment: [
    num('If x = 5, what is 4x − 3?', 17, 0.001, '', '4 × 5 − 3 = 17.'),
    mcq('Simplify 5b − 2b.', ['3b', '7b', '3', '10b'], 'Subtract the coefficients.'),
    num('total = 25t + 15. What is the total when t = 3?', 90, 0.001, '', '25 × 3 + 15 = 90.'),
    mcq('Expand 3(2x + 1).', ['6x + 3', '6x + 1', '5x + 3', '2x + 3'], 'Multiply both terms by 3.'),
    mcq('In the term 7x, the coefficient is:', ['7', 'x', '7x', '1'], 'The coefficient is the number multiplying the variable.'),
    tf('2x + 3y can be simplified to 5xy.', false, 'x and y are different variables, so the terms cannot be combined.'),
    num('If x = −2, what is x² + 1?', 5, 0.001, '', '(−2)² = 4, and 4 + 1 = 5.'),
  ],
  missionId: 'm-math-algebra', sources: ['phak'],
});

export const equations = lesson('Equations', {
  id: 'math-equations', title: 'Solving Equations', minutes: 10, level: 1, prereqs: ['math-algebra'],
  objectives: ['Solve one-step and two-step equations.', 'Solve equations with the unknown on both sides.', 'Check a solution by substitution.', 'Turn a simple word problem into an equation.'],
  intro: 'An equation is a question: which number makes this statement true? Finding flight time from distance and speed, or the fuel flow that fits an endurance, is solving an equation.',
  simple: 'Keep the two sides balanced. Undo each operation with its opposite, one step at a time, until the letter is alone. Then put the answer back in to check it.',
  sections: [
    { h: 'One step', body: [
      'Undo the operation with its inverse, on both sides. `x + 7 = 12` → subtract 7 → x = 5. `3x = 27` → divide by 3 → x = 9. `x / 4 = 3` → multiply by 4 → x = 12.',
    ] },
    { h: 'Two steps', body: [
      'Undo addition or subtraction first, then multiplication or division.',
      '`2x + 5 = 17` → subtract 5 → 2x = 12 → divide by 2 → x = 6.',
      'In general, `a × x + b = c` gives `x = (c − b) ÷ a`.',
    ], formula: 'solve-linear', lab: 'formula:solve-linear' },
    { h: 'Unknown on both sides', body: [
      'Collect the unknowns on one side and the numbers on the other.',
      '`5x − 4 = 3x + 6` → subtract 3x → 2x − 4 = 6 → add 4 → 2x = 10 → x = 5.',
    ] },
    { h: 'Check, and use it', body: [
      'Always substitute the answer back: 5 × 5 − 4 = 21 and 3 × 5 + 6 = 21. Both sides agree.',
      'A word problem becomes an equation once you name the unknown. "At 30 L per hour, how long does 75 L last?" is 30t = 75, so t = 2.5 hours.',
    ], note: 'If the check fails, the mistake is nearly always a sign error or an operation applied to one side only.' },
  ],
  examples: [
    { title: 'Two-step equation', steps: ['Solve 4x − 7 = 21.', 'Add 7 to both sides: 4x = 28.', 'Divide both sides by 4: x = 7.', 'Check: 4 × 7 − 7 = 21.'] },
    { title: 'Unknown on both sides', steps: ['Solve 7x + 3 = 4x + 18.', 'Subtract 4x: 3x + 3 = 18.', 'Subtract 3: 3x = 15.', 'Divide by 3: x = 5.'] },
  ],
  practice: [
    num('Solve x + 7 = 12.', 5, 0.001, '', 'Subtract 7 from both sides.'),
    num('Solve 3x = 27.', 9, 0.001, '', 'Divide both sides by 3.'),
    num('Solve 2x + 5 = 17.', 6, 0.001, '', '2x = 12, so x = 6.', 'Undo the + 5 first.'),
    num('Solve x / 4 = 3.', 12, 0.001, '', 'Multiply both sides by 4.'),
    num('Solve 5x − 4 = 3x + 6.', 5, 0.001, '', '2x = 10, so x = 5.', 'Subtract 3x from both sides first.'),
  ],
  assessment: [
    num('Solve x − 9 = 4.', 13, 0.001, '', 'Add 9 to both sides.'),
    num('Solve 6x = 42.', 7, 0.001, '', 'Divide both sides by 6.'),
    num('Solve 4x − 7 = 21.', 7, 0.001, '', '4x = 28, so x = 7.'),
    num('Solve x / 5 + 2 = 6.', 20, 0.001, '', 'x / 5 = 4, so x = 20.'),
    num('Solve 7x + 3 = 4x + 18.', 5, 0.001, '', '3x = 15, so x = 5.'),
    num('An engine burns 30 L per hour. For how many hours does 75 L last? (Solve 30t = 75.)', 2.5, 0.001, 'h', 't = 75 ÷ 30 = 2.5 h.'),
    tf('Substituting the answer back into the original equation is a valid way to check it.', true, 'If both sides are equal, the solution is correct.'),
  ],
  missionId: 'm-math-equations', sources: ['phak'],
});

export const geometry = lesson('Geometry', {
  id: 'math-geometry', title: 'Geometry: Perimeter, Area and Volume', minutes: 10, level: 1, prereqs: ['math-powers'],
  objectives: ['Calculate the perimeter and area of a rectangle.', 'Calculate the circumference and area of a circle.', 'Calculate the volume of a box.', 'Use the correct units for length, area and volume.'],
  intro: 'Wing area appears in the lift equation, runway dimensions decide what can land, and a fuel tank is a volume. Geometry turns shapes into numbers a pilot can use.',
  simple: 'Perimeter is the distance around a shape. Area is the surface inside it, measured in square units. Volume is the space inside a solid, measured in cubic units.',
  sections: [
    { h: 'Rectangles', body: [
      '**Perimeter** = 2 × (length + width). **Area** = length × width.',
      'A runway 1,800 m long and 45 m wide has an area of 1,800 × 45 = 81,000 m².',
    ] },
    { h: 'Circles', body: [
      'The **radius** r runs from the centre to the edge; the **diameter** is twice the radius.',
      '**Circumference** = 2 × π × r, and **area** = π × r², with π ≈ 3.1416.',
      'A propeller of radius 1 m sweeps a disc of area π × 1² ≈ 3.14 m².',
    ], formula: 'circle-area', lab: 'formula:circle-area' },
    { h: 'Volume', body: [
      'The volume of a box is length × width × height. A tank 1 m × 0.5 m × 0.4 m holds 0.2 m³, which is 200 litres (1 m³ = 1,000 L).',
    ] },
    { h: 'Units', body: [
      'Length is in metres (m), area in square metres (m²) and volume in cubic metres (m³). Doubling every length of a shape multiplies its area by 4 and its volume by 8.',
    ], note: 'Never add or compare quantities with different units. An area cannot be added to a length.' },
  ],
  examples: [
    { title: 'Circle', steps: ['Find the circumference and area of a circle of radius 5 m.', 'Circumference = 2 × 3.1416 × 5 = 31.42 m.', 'Area = 3.1416 × 5² = 78.54 m².'] },
    { title: 'Tank volume', steps: ['A tank measures 2 m × 3 m × 4 m.', 'Volume = 2 × 3 × 4.', 'Volume = 24 m³.'] },
  ],
  practice: [
    num('A rectangle is 30 m by 20 m. Area?', 600, 0.01, 'm²', '30 × 20 = 600 m².'),
    num('The same 30 m by 20 m rectangle: perimeter?', 100, 0.01, 'm', '2 × (30 + 20) = 100 m.'),
    num('Circle of radius 5 m. Circumference?', 31.42, 0.1, 'm', '2 × π × 5 ≈ 31.42 m.'),
    num('Circle of radius 10 m. Area?', 314.16, 1, 'm²', 'π × 10² ≈ 314.16 m².'),
    num('A box is 2 m × 3 m × 4 m. Volume?', 24, 0.01, 'm³', '2 × 3 × 4 = 24 m³.'),
  ],
  assessment: [
    num('A runway is 1,800 m long and 45 m wide. Area?', 81000, 1, 'm²', '1,800 × 45 = 81,000 m².'),
    num('A rectangle is 40 m by 25 m. Perimeter?', 130, 0.01, 'm', '2 × (40 + 25) = 130 m.'),
    num('Circle of radius 7 m. Circumference?', 43.98, 0.1, 'm', '2 × π × 7 ≈ 43.98 m.'),
    num('Circle of radius 3 m. Area?', 28.27, 0.1, 'm²', 'π × 3² ≈ 28.27 m².'),
    num('A tank is 1 m × 0.5 m × 0.4 m. Volume?', 0.2, 0.001, 'm³', '1 × 0.5 × 0.4 = 0.2 m³ (200 L).'),
    mcq('Area is measured in:', ['Square metres (m²)', 'Metres (m)', 'Cubic metres (m³)', 'Metres per second (m/s)'], 'Area is a surface: length times length.'),
    tf('The diameter of a circle is twice its radius.', true, 'The diameter crosses the whole circle through the centre.'),
  ],
  missionId: 'm-math-geometry', sources: ['phak'],
});

export const triangles = lesson('Triangles', {
  id: 'math-triangles', title: 'Triangles', minutes: 9, level: 1, prereqs: ['math-angles', 'math-geometry'],
  objectives: ['Use the angle sum of a triangle.', 'Name the main types of triangle.', 'Calculate the area of a triangle.', 'Use similar triangles to find an unknown length.'],
  intro: 'The wind triangle, the glide path and the view of a runway on approach are all triangles. Their basic properties are the foundation of every navigation calculation that follows.',
  simple: 'The three angles of a triangle always add up to 180 degrees. Its area is half the base times the height. Triangles with the same angles have sides in the same proportion.',
  sections: [
    { h: 'Angles and types', body: [
      'The angles of any triangle add up to **180°**.',
      'An **equilateral** triangle has three equal sides and three 60° angles. An **isosceles** triangle has two equal sides and two equal angles. A **right-angled** triangle has one 90° angle.',
      'A triangle cannot have two right angles: they would already use all 180°.',
    ] },
    { h: 'Area', body: [
      '`Area = ½ × base × height`, where the height is measured at right angles to the base.',
      'In a right-angled triangle the two shorter sides are base and height: legs of 6 and 8 give an area of 24.',
    ], formula: 'triangle-area', lab: 'formula:triangle-area' },
    { h: 'Similar triangles', body: [
      'Two triangles are **similar** if their angles are equal. Their sides are then in the same ratio.',
      'If a triangle with sides 3 and 4 is enlarged so that the 3 becomes 9, every side is multiplied by 3 and the 4 becomes 12.',
      'A 3° glide path is a long thin triangle: every part of it has the same shape, which is why "about 300 ft per nautical mile" works at any distance.',
    ], note: 'Similar means the same shape, not the same size. Triangles of the same shape and size are called congruent.' },
  ],
  examples: [
    { title: 'A missing angle', steps: ['Two angles are 40° and 60°.', '40 + 60 = 100.', 'The third angle is 180 − 100 = 80°.'] },
    { title: 'Isosceles triangle', steps: ['The angle between the two equal sides is 40°.', 'The other two angles are equal and share 180 − 40 = 140°.', 'Each is 70°.'] },
  ],
  practice: [
    num('A triangle has angles of 90° and 35°. The third angle?', 55, 0.001, '°', '180 − 125 = 55°.'),
    num('Base 6 m, height 4 m. Area of the triangle?', 12, 0.01, 'm²', '½ × 6 × 4 = 12 m².'),
    mcq('Each angle of an equilateral triangle is:', ['60°', '90°', '45°', '120°'], '180 ÷ 3 = 60°.'),
    num('A triangle with sides 3 and 4 is enlarged so the side of 3 becomes 9. What does the side of 4 become?', 12, 0.001, '', 'Every side is multiplied by 3.'),
    mcq('A right-angled triangle has:', ['One angle of 90°', 'Three equal sides', 'Two angles of 90°', 'No equal angles ever'], 'Exactly one right angle.'),
  ],
  assessment: [
    num('A triangle has angles of 40° and 60°. The third angle?', 80, 0.001, '°', '180 − 100 = 80°.'),
    num('Base 10 m, height 7 m. Area of the triangle?', 35, 0.01, 'm²', '½ × 10 × 7 = 35 m².'),
    num('An isosceles triangle has 40° between its two equal sides. Size of each of the other angles?', 70, 0.001, '°', '(180 − 40) ÷ 2 = 70°.'),
    num('A triangle with sides 5 and 8 is enlarged so the side of 5 becomes 15. What does the side of 8 become?', 24, 0.001, '', 'The scale factor is 3: 8 × 3 = 24.'),
    num('A right-angled triangle has legs of 6 m and 8 m. Area?', 24, 0.01, 'm²', '½ × 6 × 8 = 24 m².'),
    mcq('The angles of a triangle add up to:', ['180°', '360°', '90°', '270°'], 'This is true for every triangle.'),
    tf('A triangle can have two right angles.', false, 'Two right angles already total 180°, leaving nothing for the third.'),
  ],
  missionId: 'm-math-triangles', sources: ['phak'],
});
