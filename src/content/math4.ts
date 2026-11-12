// Pre-Flight Academy mathematics, fourth batch: coordinates, functions and change, aviation mathematics.
import { lesson, mcq, num, tf } from './q';

export const coordinates = lesson('Coordinate systems', {
  id: 'math-basic-coordinate-systems', title: 'Basic Coordinate Systems', minutes: 9, level: 1, prereqs: ['math-negatives', 'math-pythagoras'],
  objectives: ['Read and plot points as (x, y).', 'Name the four quadrants.', 'Find the distance between two points.', 'Describe latitude and longitude as a coordinate system.'],
  intro: 'Every position on a chart is a pair of numbers. Latitude and longitude, grid references and the moving-map display all rest on the same idea: two measurements fix one point.',
  simple: 'A point is written (x, y): x is how far across, y is how far up. Negative numbers mean left or down. On the Earth, latitude says how far north or south and longitude how far east or west.',
  sections: [
    { h: 'The x–y plane', body: [
      'Two number lines cross at right angles at the **origin** (0, 0). The horizontal one is the **x-axis**, the vertical one the **y-axis**.',
      'The point (3, 4) is 3 units right and 4 units up. The point (−3, 5) is 3 left and 5 up.',
      'The axes divide the plane into four **quadrants**: upper right (both positive), upper left (x negative), lower left (both negative) and lower right (y negative).',
    ] },
    { h: 'Distance between two points', body: [
      'The differences in x and y form the two short sides of a right-angled triangle, so Pythagoras gives the distance: `d = √(Δx² + Δy²)`.',
      'From (1, 2) to (4, 6): Δx = 3 and Δy = 4, so d = 5.',
      'The **midpoint** is the average of the coordinates: halfway between x = 2 and x = 8 is x = 5.',
    ], formula: 'distance-2d', lab: 'formula:distance-2d' },
    { h: 'Latitude and longitude', body: [
      '**Latitude** measures north or south of the equator, from 0° to 90°. **Longitude** measures east or west of the Greenwich meridian, from 0° to 180°.',
      'Each degree is divided into 60 **minutes**. One minute of latitude is one nautical mile, so one degree of latitude is 60 NM.',
    ], note: 'This is true for latitude only. Lines of longitude converge towards the poles, so a degree of longitude is 60 NM at the equator and less everywhere else.' },
  ],
  examples: [
    { title: 'Distance', steps: ['Find the distance from (0, 0) to (6, 8).', 'Δx = 6 and Δy = 8.', '6² + 8² = 36 + 64 = 100.', 'd = √100 = 10.'] },
    { title: 'Latitude to distance', steps: ['Two points on the same meridian are 1.5° of latitude apart.', '1.5 × 60 = 90.', 'They are 90 NM apart.'] },
  ],
  practice: [
    num('What is the distance from (0, 0) to (3, 4)?', 5, 0.01, '', '√(9 + 16) = 5.'),
    mcq('The origin has the coordinates:', ['(0, 0)', '(1, 1)', '(0, 1)', '(1, 0)'], 'Both axes cross at zero.'),
    num('How many nautical miles is 1° of latitude?', 60, 0.01, 'NM', '60 minutes, each 1 NM.'),
    mcq('The point (4, −2) lies:', ['To the right of and below the origin', 'To the left of and above the origin', 'To the right of and above the origin', 'To the left of and below the origin'], 'x is positive (right), y is negative (down).'),
    num('What x-value is halfway between x = 2 and x = 8?', 5, 0.01, '', '(2 + 8) ÷ 2 = 5.'),
  ],
  assessment: [
    num('What is the distance from (1, 2) to (7, 10)?', 10, 0.01, '', 'Δx = 6, Δy = 8, and √(36 + 64) = 10.'),
    mcq('The point (−3, 5) lies in which quadrant?', ['Upper left', 'Upper right', 'Lower left', 'Lower right'], 'x is negative (left) and y is positive (up).'),
    num('Two points on the same meridian are 2.5° of latitude apart. Distance?', 150, 0.1, 'NM', '2.5 × 60 = 150 NM.'),
    num('How many nautical miles is 30 minutes of latitude?', 30, 0.01, 'NM', 'One minute of latitude is one nautical mile.'),
    tf('Longitude measures position east or west of the Greenwich meridian.', true, 'Latitude is north–south; longitude is east–west.'),
    mcq('In the point (x, y), the first number tells you:', ['How far across (horizontal position)', 'How far up (vertical position)', 'The distance from the origin', 'The quadrant number'], 'x comes first: across, then up.'),
    tf('One degree of longitude is 60 NM everywhere on Earth.', false, 'Meridians converge towards the poles; this is true only at the equator.'),
  ],
  missionId: 'm-math-coords', sources: ['phak'],
});

export const functions = lesson('Graphs and functions', {
  id: 'math-graphs-and-functions', title: 'Graphs and Functions', minutes: 10, level: 2, prereqs: ['math-algebra', 'math-basic-coordinate-systems'],
  objectives: ['Explain what a function is.', 'Evaluate a function for a given input.', 'Read values from a graph.', 'Calculate the gradient of a straight line.'],
  intro: 'Performance charts, climb profiles and weather trends are all graphs. A pilot who can read a graph quickly can read an aircraft manual.',
  simple: 'A function is a rule that turns each input into one output. A graph is a picture of that rule. The gradient of a line tells you how fast the output changes.',
  sections: [
    { h: 'Functions', body: [
      'A **function** gives exactly one output for each input. We write `f(x) = 2x + 3` and say "f of x".',
      'To evaluate it, substitute: f(4) = 2 × 4 + 3 = 11.',
    ] },
    { h: 'Reading a graph', body: [
      'The input is on the horizontal axis and the output on the vertical axis. To read a value, go up from the input to the line, then across to the output axis.',
      'Always read the axis labels and units first. A chart of take-off distance against temperature is useless if you read the wrong scale.',
    ] },
    { h: 'Gradient', body: [
      'The **gradient** (slope) of a straight line is rise divided by run: `m = (y₂ − y₁) ÷ (x₂ − x₁)`.',
      'Through (0, 1) and (4, 9): m = 8 ÷ 4 = 2. A line that falls from left to right has a negative gradient; a horizontal line has a gradient of 0.',
      'In `y = m × x + c`, m is the gradient and c is the **y-intercept**, the value of y when x = 0.',
    ], formula: 'slope', lab: 'formula:slope', note: 'On a graph of altitude against time, the gradient is the rate of climb. A steeper line means a faster climb.' },
  ],
  examples: [
    { title: 'Evaluating', steps: ['f(x) = 3x − 2. Find f(5).', '3 × 5 = 15.', '15 − 2 = 13.'] },
    { title: 'Gradient', steps: ['A line passes through (1, 3) and (5, 11).', 'Rise = 11 − 3 = 8; run = 5 − 1 = 4.', 'Gradient = 8 ÷ 4 = 2.'] },
  ],
  practice: [
    num('f(x) = 3x − 2. What is f(5)?', 13, 0.01, '', '3 × 5 − 2 = 13.'),
    num('A line passes through (1, 3) and (5, 11). Gradient?', 2, 0.01, '', '8 ÷ 4 = 2.'),
    mcq('On a graph, the input is normally plotted on:', ['The horizontal axis', 'The vertical axis', 'Either axis at random', 'A separate scale'], 'Input across, output up.'),
    mcq('A line that falls from left to right has:', ['A negative gradient', 'A positive gradient', 'A gradient of zero', 'No gradient'], 'The output decreases as the input increases.'),
    num('What is the y-intercept of y = 4x + 7?', 7, 0.01, '', 'When x = 0, y = 7.'),
  ],
  assessment: [
    num('f(x) = 2x + 3. What is f(4)?', 11, 0.01, '', '2 × 4 + 3 = 11.'),
    num('A line passes through (0, 1) and (4, 9). Gradient?', 2, 0.01, '', '(9 − 1) ÷ (4 − 0) = 2.'),
    num('What is the y-intercept of y = 3x − 5?', -5, 0.01, '', 'When x = 0, y = −5.'),
    num('A line passes through (2, 10) and (6, 2). Gradient?', -2, 0.01, '', '(2 − 10) ÷ (6 − 2) = −2.'),
    mcq('A horizontal line has a gradient of:', ['0', '1', '−1', 'It cannot be calculated'], 'There is no rise, so rise ÷ run = 0.'),
    tf('A function gives exactly one output for each input.', true, 'That is the definition of a function.'),
    mcq('On a graph of altitude against time, a steeper rising line means:', ['A higher rate of climb', 'A lower rate of climb', 'A higher airspeed', 'Level flight'], 'The gradient is altitude gained per unit of time.'),
  ],
  missionId: 'm-math-functions', sources: ['phak'],
});

export const linearRel = lesson('Linear relationships', {
  id: 'math-linear-relationships', title: 'Linear Relationships and Interpolation', minutes: 10, level: 2, prereqs: ['math-graphs-and-functions', 'math-ratios'],
  objectives: ['Recognise direct proportion.', 'Find the constant of proportionality.', 'Interpolate between two values in a table.', 'Know when a linear model is not appropriate.'],
  intro: 'Performance tables give values for a few temperatures and weights, never exactly yours. Interpolation, finding the value in between, is one of the most used skills in flight planning.',
  simple: 'In direct proportion, doubling one quantity doubles the other. To interpolate, work out how far you are between two table entries and go the same fraction of the way between their values.',
  sections: [
    { h: 'Direct proportion', body: [
      'Two quantities are in **direct proportion** when `y = k × x`. The graph is a straight line through the origin, and k is the constant of proportionality.',
      'If 4 hours of flight use 120 L, then k = 30 L per hour, and 2.5 hours use 75 L.',
    ] },
    { h: 'Linear but not proportional', body: [
      'A relationship `y = m × x + c` with c not zero is linear but not proportional: doubling x does not double y. Celsius to Fahrenheit is an example: °F = 1.8 × °C + 32.',
    ] },
    { h: 'Linear interpolation', body: [
      'To find a value between two table entries, assume a straight line between them.',
      '`y = y₁ + (x − x₁) × (y₂ − y₁) ÷ (x₂ − x₁)`.',
      'A table gives 400 m at 0 °C and 500 m at 20 °C. At 10 °C you are halfway, so the value is 450 m. At 15 °C you are three quarters of the way: 475 m.',
    ], formula: 'interpolate', lab: 'formula:interpolate', note: 'The table values here are invented for practice. Always use the tables in the flight manual for the actual aircraft, and never extrapolate beyond the ends of a table.' },
  ],
  examples: [
    { title: 'Proportion', steps: ['y is proportional to x, and y = 12 when x = 4.', 'k = 12 ÷ 4 = 3.', 'When x = 10, y = 3 × 10 = 30.'] },
    { title: 'Interpolation', steps: ['A table gives 100 at x = 0 and 160 at x = 10. Find the value at x = 4.', 'Fraction of the way: 4 ÷ 10 = 0.4.', 'Change: 0.4 × 60 = 24.', 'Value = 100 + 24 = 124.'] },
  ],
  practice: [
    num('y = k × x, and y = 20 when x = 5. What is k?', 4, 0.01, '', '20 ÷ 5 = 4.'),
    num('A table gives 400 m at 0 °C and 500 m at 20 °C. Interpolate for 10 °C.', 450, 0.5, 'm', 'Halfway between 400 and 500.'),
    mcq('The graph of a direct proportion is:', ['A straight line through the origin', 'A straight line that misses the origin', 'A curve', 'A horizontal line'], 'When x = 0, y = 0.'),
    num('4 hours of flight use 120 L. How much do 2.5 hours use at the same rate?', 75, 0.1, 'L', '30 L/h × 2.5 h = 75 L.'),
    tf('In y = 2x + 5, doubling x doubles y.', false, 'The added 5 means it is linear but not proportional.'),
  ],
  assessment: [
    num('y is proportional to x, and y = 12 when x = 4. What is y when x = 10?', 30, 0.01, '', 'k = 3, so y = 30.'),
    num('A table gives 400 m at 0 °C and 500 m at 20 °C. Interpolate for 15 °C.', 475, 0.5, 'm', 'Three quarters of the way: 400 + 75 = 475 m.'),
    num('A table gives 100 at x = 0 and 160 at x = 10. Interpolate for x = 4.', 124, 0.1, '', '100 + 0.4 × 60 = 124.'),
    num('A flight of 50 NM uses 20 L. At the same rate, how much does 125 NM use?', 50, 0.1, 'L', '0.4 L per NM × 125 NM = 50 L.'),
    tf('In direct proportion, doubling x doubles y.', true, 'y = k × x, so y scales with x.'),
    mcq('Interpolation assumes that between two table values the relationship is:', ['A straight line', 'A circle', 'Constant', 'Unknown'], 'Linear interpolation joins the two points with a straight line.'),
    mcq('A table covers 0 °C to 30 °C and today is 38 °C. You should:', ['Not extrapolate; the table does not cover the conditions', 'Extend the last two values in a straight line', 'Use the 30 °C value', 'Use the 0 °C value'], 'Outside the published range the data is not valid.'),
  ],
  missionId: 'm-math-linear', sources: ['phak'],
});

export const quadratics = lesson('Quadratic relationships', {
  id: 'math-quadratic-relationships', title: 'Quadratic Relationships', minutes: 9, level: 2, prereqs: ['math-powers', 'math-graphs-and-functions'],
  objectives: ['Recognise a quadratic relationship.', 'Evaluate simple quadratic expressions.', 'Predict the effect of changing a squared quantity.', 'Name aviation quantities that depend on speed squared.'],
  intro: 'Lift, drag and kinetic energy all depend on the square of speed. That single fact explains why a little extra speed on landing needs a lot more runway.',
  simple: 'In a quadratic relationship the output depends on the input squared. Double the input and the output becomes four times as large; triple it and the output becomes nine times as large.',
  sections: [
    { h: 'The shape of x²', body: [
      'A **quadratic** contains the input squared, for example `y = x²` or `y = 2x² + 1`. Its graph is a curve called a **parabola**, not a straight line.',
      'The curve gets steeper as x grows: from x = 1 to 2, y rises by 3; from x = 9 to 10, y rises by 19.',
    ] },
    { h: 'Scaling', body: [
      'If y depends on x², multiplying x by a factor multiplies y by that factor **squared**.',
      '`factor = (new ÷ old)²`. Speed × 2 gives × 4. Speed × 3 gives × 9. Speed up by 20% (× 1.2) gives × 1.44.',
    ], formula: 'square-ratio', lab: 'formula:square-ratio' },
    { h: 'Where it appears in flight', body: [
      '**Dynamic pressure** is ½ρV², so lift and drag at a fixed angle of attack grow with V². **Kinetic energy** is ½mV², so the energy the brakes must remove grows with V².',
      'To undo a square, take the square root: if x² = 144, then x = 12 (taking the positive value).',
    ], note: 'Touching down 10% fast means about 21% more kinetic energy to dissipate.' },
  ],
  examples: [
    { title: 'Evaluating', steps: ['y = 2x² + 1. Find y when x = 3.', '3² = 9, and 2 × 9 = 18.', '18 + 1 = 19.'] },
    { title: 'Scaling', steps: ['Speed increases from 100 kt to 120 kt.', 'Ratio = 120 ÷ 100 = 1.2.', '1.2² = 1.44, so dynamic pressure rises by 44%.'] },
  ],
  practice: [
    num('If y = x², what is y when x = 6?', 36, 0.01, '', '6 × 6 = 36.'),
    mcq('Speed doubles at a fixed angle of attack and air density. Dynamic pressure becomes:', ['Four times as large', 'Twice as large', 'Half as large', 'Eight times as large'], '2² = 4.'),
    num('Solve x² = 81 (positive value).', 9, 0.01, '', '√81 = 9.'),
    mcq('The graph of y = x² is called:', ['A parabola', 'A straight line', 'A circle', 'A hyperbola'], 'Quadratics produce parabolas.'),
    num('y = x² + 4. What is y when x = 5?', 29, 0.01, '', '25 + 4 = 29.'),
  ],
  assessment: [
    num('If y = x², what is y when x = 9?', 81, 0.01, '', '9 × 9 = 81.'),
    num('Speed triples. By what factor does kinetic energy increase?', 9, 0.01, '', '3² = 9.'),
    num('Speed increases from 100 kt to 120 kt. By what factor does dynamic pressure increase?', 1.44, 0.01, '', '(120 ÷ 100)² = 1.44.'),
    num('y = 2x² + 1. What is y when x = 3?', 19, 0.01, '', '2 × 9 + 1 = 19.'),
    num('Solve x² = 144 (positive value).', 12, 0.01, '', '√144 = 12.'),
    tf('The graph of y = x² is a straight line.', false, 'It is a parabola that grows steeper as x increases.'),
    mcq('Which of these depends on the square of speed?', ['Kinetic energy', 'Weight', 'Time to fly a fixed distance', 'Air temperature'], 'Kinetic energy = ½ × m × V².'),
  ],
  missionId: 'm-math-quadratic', sources: ['phak'],
});

export const rateOfChange = lesson('Rate of change', {
  id: 'math-rate-of-change', title: 'Rate of Change', minutes: 9, level: 2, prereqs: ['math-graphs-and-functions'],
  objectives: ['Calculate an average rate of change.', 'Give a rate the correct units.', 'Interpret positive and negative rates.', 'Use a rate to predict a future value.'],
  intro: 'A vertical speed indicator shows feet per minute. A fuel flow gauge shows litres per hour. Both are rates of change, and reading them is how a pilot looks into the future.',
  simple: 'A rate of change is how much something changes divided by how long it takes. A positive rate means it is increasing, a negative rate that it is decreasing.',
  sections: [
    { h: 'Average rate', body: [
      '`rate = (new value − old value) ÷ time taken`.',
      'Climbing from 2,000 ft to 5,000 ft in 6 minutes: (5,000 − 2,000) ÷ 6 = 500 ft/min.',
      'The units are always "something per something": ft/min, L/h, kt per second, °C per 1,000 ft.',
    ], formula: 'rate-change', lab: 'formula:rate-change' },
    { h: 'Sign', body: [
      'A **positive** rate means the quantity is increasing; a **negative** rate means it is decreasing. Fuel on board going from 120 L to 90 L in 1.5 h is a rate of −20 L/h, usually spoken as "burning 20 litres per hour".',
    ] },
    { h: 'Predicting', body: [
      'If the rate stays constant: `change = rate × time`, and `time = change ÷ rate`.',
      'At 800 ft/min, a 4,000 ft climb takes 4,000 ÷ 800 = 5 minutes.',
      'On a graph, the rate of change is the gradient of the line.',
    ], note: 'Real rates are rarely constant: climb rate falls as altitude increases. A calculation with a constant rate is an estimate.' },
  ],
  examples: [
    { title: 'Descent rate', steps: ['Descend from 9,000 ft to 3,000 ft in 12 minutes.', 'Change = 6,000 ft.', '6,000 ÷ 12 = 500 ft/min of descent.'] },
    { title: 'Temperature with height', steps: ['Temperature falls from 15 °C to 3 °C over 6,000 ft.', 'Change = 12 °C over 6 thousand feet.', '12 ÷ 6 = 2 °C per 1,000 ft.'] },
  ],
  practice: [
    num('Altitude rises from 1,000 ft to 4,000 ft in 5 minutes. Average rate of climb?', 600, 1, 'ft/min', '3,000 ÷ 5 = 600 ft/min.'),
    num('At 500 ft/min, how many minutes does a 3,000 ft climb take?', 6, 0.01, 'min', '3,000 ÷ 500 = 6 min.'),
    mcq('A rate of change always has units of:', ['One quantity per unit of another', 'Length only', 'Time only', 'No units'], 'For example feet per minute.'),
    mcq('Fuel on board is decreasing. Its rate of change is:', ['Negative', 'Positive', 'Zero', 'Undefined'], 'A decreasing quantity has a negative rate.'),
    num('Speed rises from 60 kt to 90 kt in 10 seconds. Average rate in kt per second?', 3, 0.01, 'kt/s', '30 ÷ 10 = 3 kt/s.'),
  ],
  assessment: [
    num('Climb from 2,000 ft to 5,000 ft in 6 minutes. Average rate of climb?', 500, 1, 'ft/min', '3,000 ÷ 6 = 500 ft/min.'),
    num('Fuel on board falls from 120 L to 90 L in 1.5 hours. Burn rate in litres per hour?', 20, 0.1, 'L/h', '30 ÷ 1.5 = 20 L/h.'),
    num('At 800 ft/min, how many minutes does a 4,000 ft climb take?', 5, 0.01, 'min', '4,000 ÷ 800 = 5 min.'),
    num('Descend from 9,000 ft to 3,000 ft in 12 minutes. Average rate of descent?', 500, 1, 'ft/min', '6,000 ÷ 12 = 500 ft/min.'),
    num('Temperature falls from 15 °C to 3 °C over 6,000 ft. Rate in °C per 1,000 ft?', 2, 0.01, '°C', '12 ÷ 6 = 2 °C per 1,000 ft.'),
    tf('A negative rate of change means the quantity is decreasing.', true, 'The new value is smaller than the old one.'),
    mcq('On a graph, the rate of change is shown by:', ['The gradient of the line', 'The length of the line', 'The colour of the line', 'The y-intercept'], 'Steeper means a faster change.'),
  ],
  missionId: 'm-math-rate', sources: ['phak'],
});

export const calculus = lesson('Calculus concepts', {
  id: 'math-introductory-calculus-concepts', title: 'Introductory Calculus Concepts', minutes: 10, level: 3, prereqs: ['math-rate-of-change', 'math-quadratic-relationships'],
  objectives: ['Distinguish average from instantaneous rate of change.', 'Describe a derivative as the slope at a point.', 'Describe an integral as an accumulated total.', 'Connect both ideas to flight instruments.'],
  intro: 'You do not need to perform calculus to fly, but its two ideas are on the instrument panel: the vertical speed indicator shows a derivative, and a fuel totaliser shows an integral.',
  simple: 'A derivative is the rate of change at one instant: the steepness of a curve at a point. An integral adds up a rate over time to give a total: the area under a graph.',
  sections: [
    { h: 'From average to instantaneous', body: [
      'The average rate between two points is the gradient of the straight line joining them. Bring the two points closer and closer, and that gradient settles on one value: the **instantaneous rate**, or **derivative**.',
      'For `f(x) = x²`, the average rate from x to x + h is `2x + h`. As h shrinks towards zero this becomes `2x`, the slope of the curve at x.',
      'So at x = 3 the curve y = x² has a slope of 6, and at x = 6 a slope of 12: it gets steeper.',
    ], formula: 'diff-quotient', lab: 'formula:diff-quotient' },
    { h: 'Derivatives in the cockpit', body: [
      'Speed is the rate of change of distance. Acceleration is the rate of change of speed. Vertical speed is the rate of change of altitude.',
      'When altitude reaches its maximum at the top of a climb, its rate of change is zero.',
    ] },
    { h: 'Accumulation', body: [
      'Going the other way, adding up a rate over time gives a total. At a constant rate this is `rate × time`, the area of a rectangle under the graph.',
      'A climb at 400 ft/min for 5 minutes gains 2,000 ft. A fuel flow of 30 L/h for 2 hours uses 60 L. When the rate varies, the total is still the area under the rate graph; that area is the **integral**.',
    ], note: 'This lesson gives the ideas only. Formal differentiation and integration are not needed for pilot licence examinations.' },
  ],
  examples: [
    { title: 'Average rate of x²', steps: ['Find the average rate of change of y = x² from x = 3 to x = 5.', 'y changes from 9 to 25: a change of 16.', 'x changes by 2.', '16 ÷ 2 = 8.'] },
    { title: 'Area under a rate graph', steps: ['Groundspeed is a constant 120 kt for 0.5 h.', 'Distance = 120 × 0.5.', 'Distance = 60 NM, the area of the rectangle under the speed line.'] },
  ],
  practice: [
    num('The slope of y = x² at any point is 2x. What is the slope at x = 3?', 6, 0.01, '', '2 × 3 = 6.'),
    mcq('The vertical speed indicator shows:', ['The rate of change of altitude', 'The total altitude gained', 'The rate of change of speed', 'The area under the altitude graph'], 'Feet per minute is a rate.'),
    num('A climb at 500 ft/min is held for 4 minutes. Height gained?', 2000, 1, 'ft', '500 × 4 = 2,000 ft.'),
    mcq('The area under a speed–time graph represents:', ['Distance travelled', 'Acceleration', 'Fuel flow', 'Altitude'], 'Speed × time = distance.'),
    tf('At the highest point of a flight path, the rate of change of altitude is zero.', true, 'The aircraft is neither climbing nor descending at that instant.'),
  ],
  assessment: [
    mcq('A derivative describes:', ['The instantaneous rate of change', 'The total accumulated amount', 'The average of several values', 'The largest value of a function'], 'It is the slope of the curve at a single point.'),
    num('What is the average rate of change of y = x² from x = 3 to x = 5?', 8, 0.01, '', '(25 − 9) ÷ 2 = 8.'),
    num('The slope of y = x² at any point is 2x. What is the slope at x = 6?', 12, 0.01, '', '2 × 6 = 12.'),
    num('A climb at 400 ft/min is held for 5 minutes. Height gained?', 2000, 1, 'ft', '400 × 5 = 2,000 ft.'),
    num('Groundspeed is a constant 120 kt for 0.5 h. Distance flown?', 60, 0.1, 'NM', '120 × 0.5 = 60 NM.'),
    tf('Speed is the rate of change of distance with time.', true, 'Distance per unit of time.'),
    mcq('Adding up fuel flow over the whole flight gives:', ['The total fuel used', 'The average fuel flow', 'The rate of change of fuel flow', 'The endurance'], 'Accumulating a rate over time gives a total, the idea behind an integral.'),
  ],
  missionId: 'm-math-calculus', sources: ['phak'],
});

export const statistics = lesson('Statistics', {
  id: 'math-basic-statistics', title: 'Basic Statistics', minutes: 9, level: 1, prereqs: ['math-arithmetic', 'math-decimals'],
  objectives: ['Calculate the mean, median and mode.', 'Calculate the range.', 'Explain how an extreme value affects the mean.', 'Choose a sensible average for a set of data.'],
  intro: 'Reported wind is an average over several minutes. Fuel planning uses average consumption. Safety data is summarised with statistics. Knowing what an average hides is as important as knowing how to find it.',
  simple: 'The mean is the total divided by how many values there are. The median is the middle value when they are in order. The mode is the most common value. The range is the largest minus the smallest.',
  sections: [
    { h: 'Mean', body: [
      'Add the values and divide by how many there are. For 4, 8, 6, 10, 12: total 40, five values, mean 8.',
    ], formula: 'mean4', lab: 'formula:mean4' },
    { h: 'Median and mode', body: [
      'The **median** is the middle value after sorting. For 3, 9, 4, 7, 5 the sorted list is 3, 4, 5, 7, 9 and the median is 5. With an even number of values, take the mean of the middle two: for 2, 4, 6, 8 the median is 5.',
      'The **mode** is the value that occurs most often. In 2, 3, 3, 5, 7, 3 the mode is 3.',
    ] },
    { h: 'Spread and outliers', body: [
      'The **range** is largest minus smallest: for 12, 7, 15, 9 it is 15 − 7 = 8.',
      'One extreme value (an **outlier**) pulls the mean strongly but barely moves the median. Fuel flows of 30, 30, 31 and 60 L/h have a mean of 37.75 but a median of 30.5.',
    ], note: 'An average wind of 10 kt can hide gusts of 25 kt. That is why weather reports give gusts separately from the mean wind.' },
  ],
  examples: [
    { title: 'Mean', steps: ['Fuel flows of 28, 30, 32 and 30 L/h were recorded.', 'Total = 120.', '120 ÷ 4 = 30 L/h.'] },
    { title: 'Median', steps: ['Find the median of 3, 9, 4, 7, 5.', 'Sort: 3, 4, 5, 7, 9.', 'The middle value is 5.'] },
  ],
  practice: [
    num('What is the mean of 2, 4 and 9?', 5, 0.01, '', '15 ÷ 3 = 5.'),
    num('What is the median of 1, 8, 3?', 3, 0.01, '', 'Sorted: 1, 3, 8.'),
    num('What is the mode of 4, 6, 4, 9, 4, 6?', 4, 0.01, '', '4 occurs three times.'),
    num('What is the range of 5, 11, 8?', 6, 0.01, '', '11 − 5 = 6.'),
    mcq('Which average is least affected by one extreme value?', ['The median', 'The mean', 'The range', 'The total'], 'The middle value hardly moves.'),
  ],
  assessment: [
    num('What is the mean of 4, 8, 6, 10 and 12?', 8, 0.01, '', '40 ÷ 5 = 8.'),
    num('What is the median of 3, 9, 4, 7 and 5?', 5, 0.01, '', 'Sorted: 3, 4, 5, 7, 9.'),
    num('What is the mode of 2, 3, 3, 5, 7, 3?', 3, 0.01, '', '3 occurs most often.'),
    num('What is the range of 12, 7, 15 and 9?', 8, 0.01, '', '15 − 7 = 8.'),
    num('Fuel flows of 28, 30, 32 and 30 L/h were recorded. Mean fuel flow?', 30, 0.01, 'L/h', '120 ÷ 4 = 30 L/h.'),
    num('What is the median of 2, 4, 6 and 8?', 5, 0.01, '', 'The mean of the middle two: (4 + 6) ÷ 2 = 5.'),
    tf('A single extreme value can change the mean considerably.', true, 'Every value contributes to the total, so an outlier pulls the mean.'),
  ],
  missionId: 'm-math-stats', sources: ['phak'],
});

export const oneInSixty = lesson('1-in-60 rule', {
  id: 'math-navigation-calculations-and-the-1-in-60-rule', title: 'Navigation Calculations and the 1-in-60 Rule', minutes: 11, level: 2, prereqs: ['math-trig', 'math-ratios'],
  objectives: ['State the 1-in-60 rule.', 'Calculate track error from distance off track.', 'Calculate the closing angle to a destination.', 'Find the total heading correction.'],
  intro: 'You look down and the town that should be beneath you is 2 miles to the left. How many degrees are you off, and what heading change puts it right? The 1-in-60 rule answers both without a calculator.',
  simple: 'At 60 miles, one degree of error puts you one mile off track. So the angle in degrees is about 60 times the distance off track, divided by the distance flown.',
  sections: [
    { h: 'Where the rule comes from', body: [
      'The tangent of 1° is about 1/60 (0.0175 against 0.0167). So over 60 NM, a 1° error produces about 1 NM of displacement.',
      'For small angles the relationship is close to proportional, which gives the rule: `angle ≈ 60 × distance off ÷ distance along`.',
    ], formula: 'one-in-60', lab: 'formula:one-in-60' },
    { h: 'Track error', body: [
      'The **track error** is the angle between the planned track and the track actually flown.',
      '2 NM off after 30 NM: 60 × 2 ÷ 30 = 4°. Turning by the track error makes you fly parallel to the planned track, but does not bring you back to it.',
    ] },
    { h: 'Closing angle and total correction', body: [
      'The **closing angle** is the extra angle needed to reach the destination: `60 × distance off ÷ distance to go`.',
      'The total heading change towards the track is **track error + closing angle**.',
      '4 NM off after 60 NM with 40 NM to go: track error 4°, closing angle 6°, total correction 10°.',
    ], note: 'The rule is an approximation that is good for angles up to about 20°. It is a mental cross-check, not a substitute for a position fix.' },
  ],
  examples: [
    { title: 'Track error', steps: ['You are 3 NM right of track after 20 NM.', '60 × 3 ÷ 20 = 9.', 'Track error is 9° right.'] },
    { title: 'Full correction', steps: ['You are 2 NM left of track after 40 NM, with 60 NM to go.', 'Track error = 60 × 2 ÷ 40 = 3°.', 'Closing angle = 60 × 2 ÷ 60 = 2°.', 'Turn 5° right to arrive at the destination.'] },
  ],
  practice: [
    num('You are 1 NM off track after 60 NM. Track error?', 1, 0.01, '°', 'This is the rule itself: 1 in 60 is 1°.'),
    num('You are 3 NM off track after 20 NM. Track error?', 9, 0.1, '°', '60 × 3 ÷ 20 = 9°.'),
    num('You are 2 NM off track with 60 NM to go. Closing angle?', 2, 0.1, '°', '60 × 2 ÷ 60 = 2°.'),
    mcq('Turning by the track error alone will:', ['Make you fly parallel to the planned track', 'Return you to the planned track', 'Take you directly to the destination', 'Double the error'], 'It stops the error growing but does not remove it.'),
    num('Track error is 3° and closing angle is 2°. Total correction?', 5, 0.01, '°', '3 + 2 = 5°.'),
  ],
  assessment: [
    num('You are 2 NM off track after 30 NM. Track error?', 4, 0.1, '°', '60 × 2 ÷ 30 = 4°.'),
    num('You are 1 NM off track after 15 NM. Track error?', 4, 0.1, '°', '60 × 1 ÷ 15 = 4°.'),
    num('You are 4 NM off track with 40 NM to go. Closing angle?', 6, 0.1, '°', '60 × 4 ÷ 40 = 6°.'),
    num('You are 4 NM off track after 60 NM with 40 NM to go. Total heading correction?', 10, 0.1, '°', 'Track error 4° + closing angle 6° = 10°.'),
    num('After 60 NM with a 5° track error, how far off track are you?', 5, 0.1, 'NM', 'At 60 NM, each degree is about 1 NM.'),
    mcq('The 1-in-60 rule works because:', ['At 60 NM, 1° of error gives about 1 NM of displacement', 'There are 60 minutes in an hour', 'A nautical mile is 60 feet', 'The Earth turns 60° per hour'], 'tan 1° is approximately 1/60.'),
    tf('The 1-in-60 rule is accurate for any angle, however large.', false, 'It is a small-angle approximation, good to about 20°.'),
  ],
  missionId: 'm-math-1in60', sources: ['phak'],
});

export const gradients = lesson('Climb and descent gradients', {
  id: 'math-climb-and-descent-gradients', title: 'Climb and Descent Gradients', minutes: 10, level: 2, prereqs: ['math-percentages', 'math-rate-of-change'],
  objectives: ['Express a gradient as a percentage.', 'Convert a gradient in feet per nautical mile to a rate in feet per minute.', 'Estimate the rate of descent for a 3° path.', 'Explain the effect of groundspeed on the required rate.'],
  intro: 'A departure procedure may demand a minimum climb gradient. An approach follows a 3° slope. The aircraft only shows feet per minute, so the pilot must convert between the two.',
  simple: 'A gradient is height gained or lost for each unit of distance. A rate is height gained or lost for each minute. Groundspeed connects them: the faster you cover the ground, the higher the rate you need for the same gradient.',
  sections: [
    { h: 'Gradient as a percentage', body: [
      '`gradient % = height change ÷ horizontal distance × 100`, with both in the same unit.',
      'Climbing 500 ft over 10,000 ft of ground is a 5% gradient.',
      'A 3° path is a gradient of about 5.2%, or about 318 ft per nautical mile. Pilots commonly use 300 ft per NM as a working figure.',
    ] },
    { h: 'From gradient to rate', body: [
      'Groundspeed in knots divided by 60 is nautical miles per minute. So `rate (ft/min) = gradient (ft/NM) × groundspeed ÷ 60`.',
      'At 120 kt you cover 2 NM per minute. A gradient of 300 ft/NM then needs 600 ft/min.',
    ] },
    { h: 'The 3° rule of thumb', body: [
      'For a 3° path: `rate of descent ≈ groundspeed × 5`.',
      'At 90 kt: about 450 ft/min. At 140 kt: about 700 ft/min.',
      'A tailwind raises groundspeed, so it raises the rate of descent needed to stay on the path. A headwind lowers it.',
    ], formula: 'rod-3deg', lab: 'formula:rod-3deg', note: 'This is an approximation (the exact factor is about 5.3). Published procedures and the aircraft flight manual take priority over any rule of thumb.' },
  ],
  examples: [
    { title: 'Percentage gradient', steps: ['An aircraft climbs 300 ft over 6,000 ft of ground.', '300 ÷ 6,000 = 0.05.', 'The gradient is 5%.'] },
    { title: 'Rate for a 3° path', steps: ['Groundspeed on approach is 100 kt.', '100 × 5 = 500.', 'Aim for about 500 ft/min.'] },
  ],
  practice: [
    num('An aircraft climbs 300 ft over 6,000 ft of ground. Gradient in percent?', 5, 0.05, '%', '300 ÷ 6,000 × 100 = 5%.'),
    num('Estimate the rate of descent for a 3° path at 100 kt groundspeed.', 500, 5, 'ft/min', '100 × 5 = 500 ft/min.'),
    num('At 60 kt groundspeed, how many nautical miles do you cover per minute?', 1, 0.01, 'NM', '60 ÷ 60 = 1 NM per minute.'),
    mcq('A headwind on final approach means the rate of descent needed for a 3° path is:', ['Lower', 'Higher', 'Unchanged', 'Zero'], 'Groundspeed is lower, so less height is lost per minute.'),
    num('Using 300 ft per NM, how high is a 3° path at 3 NM from touchdown?', 900, 5, 'ft', '3 × 300 = 900 ft.'),
  ],
  assessment: [
    num('An aircraft climbs 500 ft over 10,000 ft of ground. Gradient in percent?', 5, 0.05, '%', '500 ÷ 10,000 × 100 = 5%.'),
    num('Estimate the rate of descent for a 3° path at 90 kt groundspeed.', 450, 5, 'ft/min', '90 × 5 = 450 ft/min.'),
    num('Estimate the rate of descent for a 3° path at 140 kt groundspeed.', 700, 5, 'ft/min', '140 × 5 = 700 ft/min.'),
    num('A gradient of 300 ft per NM is required at 120 kt groundspeed. Rate in ft/min?', 600, 5, 'ft/min', '120 kt is 2 NM per minute: 2 × 300 = 600 ft/min.'),
    num('Using 300 ft per NM, how high is a 3° path at 5 NM from touchdown?', 1500, 5, 'ft', '5 × 300 = 1,500 ft.'),
    tf('On the same descent path, a higher groundspeed requires a higher rate of descent.', true, 'More ground is covered each minute, so more height must be lost each minute.'),
    mcq('A tailwind on final approach means the rate of descent needed for a 3° path is:', ['Higher', 'Lower', 'Unchanged', 'Half as much'], 'Groundspeed is higher.'),
  ],
  missionId: 'm-math-gradients', sources: ['phak'],
});

export const fuelMath = lesson('Fuel and endurance', {
  id: 'math-fuel-and-endurance-calculations', title: 'Fuel and Endurance Calculations', minutes: 10, level: 2, prereqs: ['math-dst', 'math-decimals'],
  objectives: ['Calculate endurance from fuel and fuel flow.', 'Calculate the fuel required for a flight time.', 'Include a reserve in a fuel calculation.', 'Distinguish endurance from range.'],
  intro: 'Running out of fuel is one of the most preventable causes of accidents. The arithmetic is simple; the discipline is doing it before every flight and checking it during the flight.',
  simple: 'Endurance is how long you can fly: fuel divided by fuel flow. Fuel required is fuel flow times time, plus a reserve. Range is how far you can go: endurance times groundspeed.',
  sections: [
    { h: 'Endurance', body: [
      '`endurance = usable fuel ÷ fuel flow`. With 120 L usable and a flow of 30 L/h, endurance is 4 hours.',
      'Only **usable** fuel counts. Some fuel in every tank cannot reach the engine.',
    ], formula: 'endurance', lab: 'formula:endurance' },
    { h: 'Fuel required', body: [
      '`fuel = fuel flow × time`. A 2.5-hour flight at 32 L/h needs 80 L.',
      'A flight plan adds a **reserve** on top of the trip fuel: 1.5 h at 40 L/h is 60 L, and with a 30 L reserve the total is 90 L.',
      'Keep the units consistent: litres with litres per hour, kilograms with kilograms per hour, and time in decimal hours.',
    ] },
    { h: 'Endurance and range', body: [
      '`range = endurance × groundspeed`. Four hours at 100 kt is 400 NM.',
      'Wind changes groundspeed, so it changes range. It does not change endurance: the engine burns fuel per hour whatever the wind is doing.',
    ], note: 'All figures in this lesson are invented for practice. Required reserves are set by the regulations that apply to your flight, and consumption figures come from the aircraft flight manual.' },
  ],
  examples: [
    { title: 'Endurance', steps: ['Usable fuel is 90 L and fuel flow is 36 L/h.', '90 ÷ 36 = 2.5.', 'Endurance is 2.5 h, or 2 h 30 min.'] },
    { title: 'Fuel with reserve', steps: ['Trip time is 2 h at 35 L/h, with a 25 L reserve.', 'Trip fuel = 2 × 35 = 70 L.', 'Total = 70 + 25 = 95 L.'] },
  ],
  practice: [
    num('Usable fuel is 90 L and fuel flow is 36 L/h. Endurance?', 2.5, 0.01, 'h', '90 ÷ 36 = 2.5 h.'),
    num('How much fuel does a 2-hour flight use at 35 L/h?', 70, 0.1, 'L', '2 × 35 = 70 L.'),
    num('Endurance is 3 h and groundspeed is 90 kt. Range?', 270, 0.5, 'NM', '3 × 90 = 270 NM.'),
    mcq('Endurance is measured in:', ['Hours', 'Nautical miles', 'Litres', 'Knots'], 'It is a time.'),
    num('Trip fuel is 70 L and the reserve is 25 L. Total fuel required?', 95, 0.1, 'L', '70 + 25 = 95 L.'),
  ],
  assessment: [
    num('Usable fuel is 120 L and fuel flow is 30 L/h. Endurance?', 4, 0.01, 'h', '120 ÷ 30 = 4 h.'),
    num('How much fuel does a 2.5-hour flight use at 32 L/h?', 80, 0.1, 'L', '2.5 × 32 = 80 L.'),
    num('A trip takes 1.5 h at 40 L/h and you must add a 30 L reserve. Total fuel required?', 90, 0.1, 'L', '60 L + 30 L = 90 L.'),
    num('Endurance is 4 h and groundspeed is 100 kt. Range?', 400, 0.5, 'NM', '4 × 100 = 400 NM.'),
    num('Usable fuel is 100 L, fuel flow is 20 L/h, and 20 L must stay in the tanks as reserve. Flight time available?', 4, 0.01, 'h', '(100 − 20) ÷ 20 = 4 h.'),
    mcq('Compared with still air, a headwind:', ['Reduces range but not endurance', 'Reduces endurance but not range', 'Reduces both', 'Changes neither'], 'Fuel is burned per hour; the wind changes only the distance covered.'),
    tf('Endurance depends on groundspeed.', false, 'Endurance is fuel divided by fuel flow. Range depends on groundspeed.'),
  ],
  missionId: 'm-math-fuel', sources: ['phak'],
});
