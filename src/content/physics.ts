import type { Track } from '../types';
import { lesson, match, mcq, num, planned, tf } from './q';
import { acceleration, bernoulli, continuity, drag, friction, gasLaws, momentum, torque } from './physics2';

const speed = lesson('Speed and velocity', {
  id: 'phys-speed', title: 'Speed and Velocity', minutes: 9, level: 1,
  objectives: ['Define speed and calculate average speed.', 'Explain the difference between speed and velocity.', 'Recognise that aircraft speed can be measured relative to the air or the ground.'],
  intro: 'Speed tells you how fast. Velocity tells you how fast and in which direction. For a pilot the difference matters, because an aircraft has a speed through the air and a different speed over the ground.',
  simple: 'Speed is distance divided by time. Velocity is speed plus a direction. An aeroplane can fly at 100 knots through the air and, with wind, move at a different speed across the ground.',
  sections: [
    { h: 'Speed', body: [
      '**Speed** is the distance travelled per unit of time: `v = d / t`. The SI unit is the metre per second (m/s).',
      '**Average speed** uses the total distance and the total time. An aircraft that flies 300 km in 2 hours has an average speed of 150 km/h, even if it was faster or slower at different moments.',
    ], formula: 'dst', lab: 'formula:dst' },
    { h: 'Velocity', body: [
      '**Velocity** is speed in a stated direction. It is a vector.',
      'Two aircraft flying at 120 kt in opposite directions have the same speed but different velocities. An aircraft in a steady turn has a constant speed but a changing velocity, because its direction changes.',
    ] },
    { h: 'Speed relative to what?', body: [
      'An aircraft\'s wings care about its speed through the air — its **airspeed**. Navigation cares about its speed over the ground — its **groundspeed**.',
      'With no wind the two are equal. A headwind reduces groundspeed; a tailwind increases it. The airspeed, and therefore the lift, is unchanged.',
    ], note: 'The airspeed shown on the cockpit instrument (indicated airspeed) is not exactly the true speed through the air. You will learn why in the Pressure and Altimetry lessons.' },
  ],
  examples: [
    { title: 'Average speed', steps: ['A training flight covers 180 NM in 1 h 30 min.', '1 h 30 min = 1.5 h.', 'Average speed = 180 ÷ 1.5 = 120 kt.'] },
    { title: 'Same speed, different velocity', steps: ['Aircraft A flies north at 100 kt. Aircraft B flies east at 100 kt.', 'Their speeds are equal: 100 kt.', 'Their velocities are different because the directions differ.'] },
  ],
  practice: [
    num('A car travels 150 km in 2 hours. Average speed?', 75, 0.5, 'km/h', '150 ÷ 2 = 75 km/h.'),
    num('A runner covers 400 m in 80 s. Average speed?', 5, 0.05, 'm/s', '400 ÷ 80 = 5 m/s.'),
    mcq('What does velocity include that speed does not?', ['Direction', 'Distance', 'Time', 'Mass'], 'Velocity is speed in a stated direction.'),
    tf('An aircraft turning at a constant 90 kt has a constant velocity.', false, 'Its speed is constant, but its direction — and therefore its velocity — is changing.'),
    mcq('An aircraft flies at an airspeed of 100 kt into a 20 kt headwind. Its groundspeed is:', ['80 kt', '120 kt', '100 kt', '20 kt'], 'A headwind reduces groundspeed: 100 − 20 = 80 kt.'),
  ],
  assessment: [
    num('An aircraft covers 240 NM in 2 hours. Average groundspeed?', 120, 0.5, 'kt', '240 ÷ 2 = 120 kt.'),
    num('A cyclist covers 900 m in 3 minutes. Average speed in m/s?', 5, 0.05, 'm/s', '3 min = 180 s. 900 ÷ 180 = 5 m/s.'),
    mcq('Which statement describes a velocity?', ['250 kt toward the west', '250 kt', '3 hours', '500 NM'], 'Only this option gives both a size and a direction.'),
    mcq('An aircraft has an airspeed of 110 kt and a 15 kt tailwind. Its groundspeed is:', ['125 kt', '95 kt', '110 kt', '15 kt'], 'A tailwind adds: 110 + 15 = 125 kt.'),
    tf('A headwind reduces the airspeed felt by the wings in steady flight.', false, 'In steady flight wind changes groundspeed, not airspeed. The wings still meet the air at the same airspeed.'),
  ],
  missionId: 'm-phys-speed', sources: ['phak'],
});

const newton = lesson("Newton's laws", {
  id: 'phys-newton', title: "Force and Newton's Laws", minutes: 13, level: 1,
  objectives: ['Describe a force and state its unit.', "State Newton's three laws of motion.", 'Use F = m × a.', 'Explain why forces are balanced in steady flight.'],
  intro: 'Nothing speeds up, slows down or turns without a force. Newton\'s three laws explain every motion of an aircraft, from the take-off run to a steady cruise.',
  simple: 'A force is a push or a pull. If forces are balanced, an object keeps doing what it was doing. If they are not balanced, it accelerates. Every force has an equal force pushing back the other way.',
  sections: [
    { h: 'What is a force?', body: [
      'A **force** is a push or a pull. It is a vector, measured in **newtons (N)**. One newton accelerates a 1 kg mass at 1 m/s².',
      'Four main forces act on an aircraft in flight: lift, weight, thrust and drag.',
    ] },
    { h: 'First law: inertia', body: [
      'An object stays at rest, or keeps moving in a straight line at constant speed, unless a net force acts on it.',
      'This means an aircraft cruising straight and level at constant speed has **balanced forces**: lift equals weight and thrust equals drag. The net force is zero.',
    ], note: 'A common mistake is to think that constant motion needs a constant net force. It does not. A net force causes a change in motion.' },
    { h: 'Second law: F = m × a', body: [
      'A net force produces an acceleration in its own direction: `F = m × a`.',
      'More force gives more acceleration. More mass gives less. A heavily loaded aircraft accelerates more slowly on the runway and needs a longer take-off run.',
    ], formula: 'newton2', lab: 'formula:newton2' },
    { h: 'Third law: action and reaction', body: [
      'When object A pushes on object B, B pushes back on A with an equal force in the opposite direction.',
      'A propeller or jet engine pushes air backward; the air pushes the aircraft forward. A wing pushes air downward; the air pushes the wing upward.',
    ] },
  ],
  examples: [
    { title: 'Acceleration on the runway', steps: ['Net forward force 3,000 N, aircraft mass 1,500 kg.', 'a = F ÷ m = 3,000 ÷ 1,500.', 'a = 2 m/s². Each second the aircraft gains 2 m/s of speed.'] },
    { title: 'Forces in the cruise', steps: ['An aircraft cruises level at a constant 110 kt. Drag is 900 N.', 'Speed is constant, so the net force is zero (first law).', 'Therefore thrust equals drag: 900 N.'] },
  ],
  practice: [
    num('A net force accelerates a 1,000 kg aircraft at 2 m/s². What is the force?', 2000, 1, 'N', 'F = 1,000 × 2 = 2,000 N.'),
    num('A net force of 3,000 N acts on 1,500 kg. Acceleration?', 2, 0.01, 'm/s²', 'a = 3,000 ÷ 1,500 = 2 m/s².'),
    tf('An object moving at constant velocity must have a net force acting on it.', false, 'Constant velocity means the net force is zero (first law).'),
    mcq('A propeller pushes air backward and the aircraft moves forward. Which law describes this?', ['Third law', 'First law', 'Second law', 'Law of gravitation'], 'Action and reaction: the air pushes forward on the propeller.'),
    mcq('The same engine force acts on a heavier aircraft. Its acceleration will be:', ['Smaller', 'Larger', 'The same', 'Zero'], 'a = F ÷ m. A larger mass gives a smaller acceleration.'),
  ],
  assessment: [
    num('Mass 1,200 kg, acceleration 3 m/s². Net force?', 3600, 1, 'N', 'F = 1,200 × 3 = 3,600 N.'),
    num('Net force 5,000 N, mass 2,000 kg. Acceleration?', 2.5, 0.01, 'm/s²', 'a = 5,000 ÷ 2,000 = 2.5 m/s².'),
    mcq('In straight and level flight at constant speed:', ['Lift equals weight and thrust equals drag', 'Lift is greater than weight', 'Thrust is greater than drag', 'There are no forces on the aircraft'], 'No acceleration means the forces are balanced.'),
    mcq('The unit of force is the:', ['Newton', 'Pascal', 'Joule', 'Watt'], 'One newton accelerates 1 kg at 1 m/s².'),
    tf('A wing produces lift partly by pushing air downward; the air pushes the wing upward in reaction.', true, 'This is Newton\'s third law applied to a wing.'),
    mcq('Which law explains why passengers feel pushed back in their seats during the take-off run?', ['First law (inertia)', 'Third law', 'Law of gravitation', 'None of them'], 'Their bodies tend to stay at rest while the seat accelerates forward.'),
  ],
  missionId: 'm-phys-newton', sources: ['phak'],
});

const weight = lesson('Mass and weight', {
  id: 'phys-weight', title: 'Mass and Weight', minutes: 9, level: 1, prereqs: ['phys-newton'],
  objectives: ['Distinguish mass from weight.', 'Calculate weight with W = m × g.', 'Explain why weight is a force.'],
  intro: 'In everyday speech "mass" and "weight" mean the same thing. In physics and aviation they do not, and mixing them up leads to wrong answers.',
  simple: 'Mass is how much matter an object contains, in kilograms. Weight is the force of gravity pulling on that mass, in newtons. Multiply mass by 9.81 to get weight on Earth.',
  sections: [
    { h: 'Mass', body: ['**Mass** is the amount of matter in an object. Its unit is the kilogram (kg). Mass is the same everywhere — on Earth, on the Moon, or in orbit.', 'Mass also measures inertia: how strongly an object resists acceleration.'] },
    { h: 'Weight', body: [
      '**Weight** is the force of gravity on a mass: `W = m × g`. Its unit is the newton.',
      'Near the Earth\'s surface g ≈ 9.81 m/s². A 1 kg mass weighs about 9.81 N.',
      'Weight always acts vertically downward, toward the centre of the Earth, through the aircraft\'s centre of gravity.',
    ], formula: 'weight', lab: 'formula:weight' },
    { h: 'In aviation', body: [
      'Aircraft documents often state "weights" in kilograms or pounds. Strictly these are masses; EASA documents use the term **mass and balance** for this reason, while FAA documents say **weight and balance**.',
      'For a wing to hold an aircraft in level flight, lift must equal the weight in newtons.',
    ], note: 'Do not write a weight in kilograms inside a physics formula. Convert mass to newtons first.' },
  ],
  examples: [
    { title: 'Weight of a person', steps: ['Mass 80 kg.', 'W = m × g = 80 × 9.81.', 'W = 784.8 N.'] },
    { title: 'The same person on the Moon', steps: ['On the Moon g ≈ 1.62 m/s².', 'W = 80 × 1.62 = 129.6 N.', 'The mass is still 80 kg; only the weight changed.'] },
  ],
  practice: [
    num('Mass 80 kg. Weight on Earth (g = 9.81 m/s²)?', 784.8, 1, 'N', '80 × 9.81 = 784.8 N.'),
    num('A light aircraft has a mass of 1,100 kg. Its weight?', 10791, 10, 'N', '1,100 × 9.81 = 10,791 N.'),
    tf('An object\'s mass is smaller on the Moon than on Earth.', false, 'Mass does not change. Weight is smaller because gravity is weaker.'),
    mcq('The unit of weight is the:', ['Newton', 'Kilogram', 'Pascal', 'Metre'], 'Weight is a force, so it is measured in newtons.'),
    mcq('In which direction does weight act?', ['Toward the centre of the Earth', 'Along the flight path', 'Perpendicular to the wings', 'Opposite to thrust'], 'Weight always acts vertically downward, whatever the aircraft\'s attitude.'),
  ],
  assessment: [
    num('Mass 50 kg. Weight on Earth (g = 9.81 m/s²)?', 490.5, 1, 'N', '50 × 9.81 = 490.5 N.'),
    num('An object weighs 981 N on Earth. Its mass?', 100, 0.2, 'kg', 'm = W ÷ g = 981 ÷ 9.81 = 100 kg.'),
    mcq('Which statement is correct?', ['Mass is measured in kilograms; weight is a force in newtons', 'Mass and weight are both forces', 'Weight is measured in kilograms; mass in newtons', 'Mass depends on gravity'], 'Mass is an amount of matter. Weight is the gravitational force on it.'),
    num('In level flight an aircraft of mass 1,000 kg needs how much lift?', 9810, 10, 'N', 'Lift must equal weight: 1,000 × 9.81 = 9,810 N.'),
    tf('Weight acts through the aircraft\'s centre of gravity.', true, 'The centre of gravity is the point through which the total weight acts.'),
  ],
  missionId: 'm-phys-weight', sources: ['phak'],
});

const pressure = lesson('Pressure', {
  id: 'phys-pressure', title: 'Pressure', minutes: 14, level: 1,
  objectives: ['Explain pressure as force spread over an area.', 'Calculate pressure with P = F / A and use the pascal.', 'Distinguish static, dynamic and total pressure.', 'Describe how the pitot-static system uses pressure.'],
  intro: 'Why does a sharp knife cut better than a blunt one? Why do aircraft tyres need high pressure? And how can an instrument measure speed and height using only air? The answer to all three is pressure.',
  simple: 'Pressure is how concentrated a force is. The same push on a small area gives a high pressure; on a large area, a low pressure. Divide the force by the area. Aircraft instruments measure air pressure to find height and speed.',
  sections: [
    { h: 'Pressure in everyday life', body: [
      'Press your thumb against a table: nothing happens. Press a drawing pin with the same force: the point goes in. The force is equal, but the pin concentrates it on a tiny area.',
      'Snowshoes do the opposite. They spread a person\'s weight over a large area so the pressure on the snow is low.',
      '**Pressure** is the force acting at right angles to a surface, divided by the area over which it acts.',
    ] },
    { h: 'The formula', body: [
      '`P = F / A`, where **P** is pressure, **F** is the force perpendicular to the surface, and **A** is the area.',
      'The SI unit is the **pascal (Pa)**. One pascal is one newton per square metre. It is a very small pressure, so aviation uses the **hectopascal (hPa)**: `1 hPa = 100 Pa`.',
      'Try the experiment below. Keep the force fixed and shrink the area, then keep the area fixed and change the force.',
    ], formula: 'pressure', lab: 'pressure' },
    { h: 'Pressure in a fluid', body: [
      'Air and water are fluids. A fluid at rest pushes equally in all directions on any surface it touches.',
      'The air around us is pressed down by the weight of all the air above. At sea level this **atmospheric pressure** is about 1,013 hPa — roughly the weight of 10 tonnes on every square metre.',
    ] },
    { h: 'Static, dynamic and total pressure', body: [
      '**Static pressure** is the pressure of the air itself, whether or not it is moving relative to you. It is what a barometer measures.',
      '**Dynamic pressure** is the extra pressure that arises when moving air is brought to rest: `q = ½ ρ V²`, where ρ is air density and V is the speed of the airflow.',
      '**Total pressure** is the sum: `total = static + dynamic`. This simple sum is accurate for low-speed flow, where air is not noticeably compressed.',
    ], formula: 'dynamic-pressure', note: 'At high speeds air compresses and the simple relation total = static + ½ρV² is no longer exact. Corrections for compressibility are taught at CPL and ATPL level.' },
    { h: 'How aircraft use pressure', body: [
      'The **pitot tube** faces the airflow and senses total pressure. The **static ports** on the side of the fuselage sense static pressure.',
      'The **airspeed indicator** compares the two. The difference is dynamic pressure, which depends on speed.',
      'The **altimeter** uses static pressure alone: pressure falls as you climb, so lower pressure means greater height.',
      '**Tyres** are another example. A small contact area must carry the whole aircraft, so the tyre pressure has to be high.',
    ] },
  ],
  examples: [
    { title: 'A crate on the floor', steps: ['A crate pushes down with 500 N on a base of 0.25 m².', 'P = F ÷ A = 500 ÷ 0.25.', 'P = 2,000 Pa, which is 20 hPa.'] },
    { title: 'Same force, smaller area', steps: ['Turn the crate onto a side of only 0.05 m².', 'P = 500 ÷ 0.05 = 10,000 Pa.', 'The area is 5 times smaller, so the pressure is 5 times larger.'] },
    { title: 'Dynamic pressure', steps: ['Air density 1.225 kg/m³, airspeed 50 m/s.', 'q = ½ × 1.225 × 50² = 0.5 × 1.225 × 2,500.', 'q ≈ 1,531 Pa, about 15 hPa.'] },
  ],
  practice: [
    num('A force of 500 N acts on an area of 0.25 m². Pressure?', 2000, 1, 'Pa', 'P = 500 ÷ 0.25 = 2,000 Pa.', 'Divide the force by the area.'),
    num('A force of 1,000 N acts on 0.01 m². Pressure in hPa?', 1000, 1, 'hPa', '1,000 ÷ 0.01 = 100,000 Pa = 1,000 hPa.', 'Find pascals first, then divide by 100.'),
    mcq('The same force is applied to a smaller area. The pressure:', ['Increases', 'Decreases', 'Stays the same', 'Becomes zero'], 'P = F ÷ A. A smaller A gives a larger P.'),
    match('Match each part to the pressure it uses.', [['Pitot tube', 'Total pressure'], ['Static port', 'Static pressure'], ['Airspeed indicator', 'Total minus static (dynamic)']], 'The airspeed indicator shows the difference between pitot (total) and static pressure.'),
    num('Air density 1.225 kg/m³, speed 40 m/s. Dynamic pressure?', 980, 3, 'Pa', 'q = ½ × 1.225 × 40² = 980 Pa.', 'q = ½ ρ V². Square the speed first.'),
    tf('A fluid at rest pushes only downward.', false, 'A fluid at rest exerts pressure equally in all directions.'),
  ],
  assessment: [
    num('A force of 1,200 N acts on an area of 0.3 m². Pressure?', 4000, 1, 'Pa', 'P = 1,200 ÷ 0.3 = 4,000 Pa.'),
    num('A pressure of 150,000 Pa must support a force of 6,000 N. What area is needed?', 0.04, 0.0005, 'm²', 'A = F ÷ P = 6,000 ÷ 150,000 = 0.04 m².'),
    num('Convert 1,013.25 hPa to pascals.', 101325, 5, 'Pa', '1,013.25 × 100 = 101,325 Pa.'),
    tf('Halving the area while keeping the force the same doubles the pressure.', true, 'P = F ÷ A. Dividing by half as much gives twice the result.'),
    mcq('Total pressure in low-speed airflow is:', ['Static pressure plus dynamic pressure', 'Static pressure minus dynamic pressure', 'Dynamic pressure only', 'Always equal to 1,013 hPa'], 'Total = static + dynamic.'),
    mcq('Which pressure does the altimeter use?', ['Static pressure', 'Dynamic pressure', 'Total pressure', 'Tyre pressure'], 'The altimeter is a barometer. It senses static pressure, which falls with height.'),
    mcq('Why do aircraft tyres need a high pressure?', ['A small contact area must support a large weight', 'To make the aircraft lighter', 'To increase drag on landing', 'Because air is thinner at altitude'], 'P = F ÷ A: a large force on a small area requires a high pressure.'),
  ],
  missionId: 'm-phys-pressure', sources: ['phak', 'si-brochure'],
});

const density = lesson('Density', {
  id: 'phys-density', title: 'Density', minutes: 9, level: 1, prereqs: ['phys-pressure'],
  objectives: ['Define density and calculate it with ρ = m / V.', 'State the standard sea-level density of air.', 'Explain how altitude, temperature and humidity change air density and aircraft performance.'],
  intro: 'A wing, a propeller and an engine all work by handling air. How much air they get depends on its density. Thin air means less lift, less thrust and less power.',
  simple: 'Density is how much mass is packed into a volume. Air gets thinner — less dense — when you climb, when it is hot, and when it is humid. Thin air makes aircraft perform worse.',
  sections: [
    { h: 'What density means', body: [
      '**Density** is mass per unit volume: `ρ = m / V`. The symbol ρ is the Greek letter rho. The SI unit is kg/m³.',
      'Water has a density of about 1,000 kg/m³. Air at sea level in standard conditions has a density of **1.225 kg/m³** — about 800 times less.',
    ], formula: 'density', lab: 'formula:density' },
    { h: 'What changes air density', body: [
      '**Altitude:** pressure falls as you climb, so the air expands and density falls.',
      '**Temperature:** warm air expands. At the same pressure, hot air is less dense than cold air.',
      '**Humidity:** water vapour molecules are lighter than the nitrogen and oxygen they replace, so humid air is slightly less dense than dry air.',
    ] },
    { h: 'Why pilots care', body: [
      'Lower density means less lift at a given true airspeed, less propeller thrust and less engine power.',
      'On a hot day at a high-elevation airport, an aircraft needs a longer take-off run and climbs more slowly. Pilots summarise this as **"high, hot and humid"**.',
      'The term **density altitude** expresses the air density as an equivalent altitude in the standard atmosphere.',
    ], note: 'Fuel is measured by volume at the pump but burned by mass. Fuel density changes with temperature, which is why large aircraft calculate fuel in kilograms or pounds.' },
  ],
  examples: [
    { title: 'Density of air in a box', steps: ['A 2 m³ box contains 2.45 kg of air.', 'ρ = m ÷ V = 2.45 ÷ 2.', 'ρ = 1.225 kg/m³ — standard sea-level air.'] },
    { title: 'Mass of fuel', steps: ['Aviation gasoline has a density of about 0.72 kg/L.', 'Mass of 100 L = 100 × 0.72.', 'Mass = 72 kg.'] },
  ],
  practice: [
    num('2.45 kg of air fills 2 m³. Density?', 1.225, 0.005, 'kg/m³', '2.45 ÷ 2 = 1.225 kg/m³.'),
    num('Fuel density 0.72 kg/L. Mass of 100 L?', 72, 0.5, 'kg', 'm = ρ × V = 0.72 × 100 = 72 kg.', 'Rearrange ρ = m ÷ V.'),
    mcq('On a hot day, compared with a cold day at the same pressure, the air is:', ['Less dense', 'More dense', 'The same density', 'Heavier'], 'Warm air expands, so the same mass occupies more volume.'),
    tf('Humid air is denser than dry air at the same temperature and pressure.', false, 'Water vapour is lighter than dry air, so humid air is slightly less dense.'),
    mcq('Which combination gives the poorest take-off performance?', ['High elevation, hot, humid', 'Sea level, cold, dry', 'Sea level, hot, dry', 'High elevation, cold, dry'], 'All three factors reduce air density.'),
  ],
  assessment: [
    num('6 kg of gas fills 4 m³. Density?', 1.5, 0.01, 'kg/m³', '6 ÷ 4 = 1.5 kg/m³.'),
    num('Fuel density 0.8 kg/L. Mass of 250 L?', 200, 1, 'kg', '0.8 × 250 = 200 kg.'),
    mcq('The standard sea-level air density is approximately:', ['1.225 kg/m³', '1,000 kg/m³', '9.81 kg/m³', '0.1225 kg/m³'], 'ISA sea-level density is 1.225 kg/m³.'),
    mcq('As an aircraft climbs, air density normally:', ['Decreases', 'Increases', 'Stays constant', 'Increases, then decreases'], 'Pressure falls with altitude, and density falls with it.'),
    tf('Lower air density increases the take-off distance required.', true, 'Less dense air gives less lift and thrust, so the aircraft needs more runway.'),
  ],
  missionId: 'm-phys-density', sources: ['phak'],
});

const atmos = lesson('Atmospheric pressure', {
  id: 'phys-atmos', title: 'Atmospheric Pressure', minutes: 12, level: 2, prereqs: ['phys-pressure', 'phys-density'],
  objectives: ['Explain the cause of atmospheric pressure.', 'State the sea-level values of the International Standard Atmosphere.', 'Estimate pressure and temperature changes with height.', 'Explain why an altimeter is a pressure instrument.'],
  intro: 'We live at the bottom of an ocean of air. The weight of that air creates atmospheric pressure, and the way it decreases with height is what makes an altimeter possible.',
  simple: 'Air has weight. The air above you presses down, and that is atmospheric pressure. The higher you go, the less air is above you, so the pressure drops. An altimeter measures the pressure and shows it as a height.',
  sections: [
    { h: 'The weight of the air', body: [
      'Atmospheric pressure at any point is caused by the weight of the column of air above it.',
      'As you climb, less air remains above you, so the pressure falls. It falls quickly near the ground, where the air is dense, and more slowly higher up.',
    ] },
    { h: 'The International Standard Atmosphere (ISA)', body: [
      'Real weather changes every day, so aviation uses an agreed reference model, the **ISA**. At mean sea level it assumes:',
      'Pressure **1,013.25 hPa**, temperature **+15 °C**, density **1.225 kg/m³**.',
      'Temperature decreases by about **2 °C per 1,000 ft** (1.98 °C) up to about 36,000 ft, then stays constant at −56.5 °C in the lower stratosphere.',
    ], formula: 'isa-temp' },
    { h: 'How fast pressure falls', body: [
      'Near sea level, pressure falls by about **1 hPa for every 27 ft** of height. Many pilots use 30 ft per hPa for quick mental arithmetic.',
      'At about 18,000 ft the pressure is roughly half its sea-level value: about 500 hPa.',
      'Explore the model below. It uses the ISA formula for the troposphere.',
    ], formula: 'isa-pressure', lab: 'formula:isa-pressure', note: 'ISA is a reference model, not a forecast. The real atmosphere is rarely exactly standard, which is why altimeters have an adjustable pressure setting.' },
    { h: 'The altimeter', body: [
      'An altimeter is an aneroid barometer with a scale marked in feet. It senses static pressure and converts it into height using the ISA relationship.',
      'Because actual sea-level pressure varies, the pilot sets a reference pressure on the instrument. You will study these settings in the PPL Altimetry lesson.',
    ] },
  ],
  examples: [
    { title: 'ISA temperature at altitude', steps: ['Find the ISA temperature at 5,000 ft.', 'Temperature drop = 2 °C × 5 = 10 °C.', 'ISA temperature = 15 − 10 = +5 °C.'] },
    { title: 'Height from a pressure difference', steps: ['Two points near sea level differ in pressure by 10 hPa.', 'Use 27 ft per hPa.', 'Height difference ≈ 10 × 27 = 270 ft.'] },
  ],
  practice: [
    num('ISA temperature at 5,000 ft (use 2 °C per 1,000 ft)?', 5, 0.3, '°C', '15 − (2 × 5) = +5 °C.'),
    num('Near sea level, a pressure difference of 10 hPa equals about how many feet (use 27 ft per hPa)?', 270, 5, 'ft', '10 × 27 = 270 ft.'),
    mcq('At about what altitude is the pressure half its sea-level value?', ['18,000 ft', '5,000 ft', '36,000 ft', '50,000 ft'], 'At about 18,000 ft the pressure is roughly 500 hPa.'),
    tf('Atmospheric pressure increases as altitude increases.', false, 'Less air is above you at altitude, so pressure decreases.'),
    mcq('What does an altimeter actually measure?', ['Static air pressure', 'Distance to the ground by radar', 'Air temperature', 'Dynamic pressure'], 'A pressure altimeter converts static pressure into an indicated height.'),
  ],
  assessment: [
    num('ISA temperature at 10,000 ft (use 2 °C per 1,000 ft)?', -5, 0.3, '°C', '15 − (2 × 10) = −5 °C.'),
    num('ISA sea-level pressure in hPa?', 1013.25, 0.3, 'hPa', 'The ISA sea-level pressure is 1,013.25 hPa.'),
    num('Near sea level, a pressure difference of 5 hPa equals about how many feet (use 27 ft per hPa)?', 135, 3, 'ft', '5 × 27 = 135 ft.'),
    mcq('What causes atmospheric pressure?', ['The weight of the air above', 'The speed of the wind', 'The rotation of the Earth', 'The heat of the Sun alone'], 'Pressure at a point is due to the weight of the air column above it.'),
    mcq('The ISA sea-level temperature is:', ['+15 °C', '0 °C', '+20 °C', '−56.5 °C'], 'ISA assumes +15 °C at mean sea level.'),
    tf('Pressure falls more quickly with height near the ground than at high altitude.', true, 'The lower air is denser, so each foot of climb removes more weight of air.'),
  ],
  missionId: 'm-phys-atmos', sources: ['icao-7488', 'phak'],
});

const energy = lesson('Energy', {
  id: 'phys-energy', title: 'Work, Energy and Power', minutes: 12, level: 2, prereqs: ['phys-newton', 'phys-weight'],
  objectives: ['Define work, energy and power.', 'Calculate kinetic and potential energy.', 'Explain how an aircraft exchanges altitude for speed.'],
  intro: 'An aircraft in flight stores energy in two ways: as speed and as height. A good pilot manages both. Too little energy near the ground is dangerous; too much makes a landing impossible.',
  simple: 'Moving things have kinetic energy. High things have potential energy. An aircraft can swap one for the other: dive to gain speed, climb to lose it. The engine adds energy and drag removes it.',
  sections: [
    { h: 'Work and power', body: [
      '**Work** is done when a force moves an object: `W = F × d`. The unit is the joule (J).',
      '**Power** is the rate of doing work: `P = W / t`. The unit is the watt (W). Engine power is often given in kilowatts or horsepower (1 hp ≈ 746 W).',
    ] },
    { h: 'Kinetic energy', body: [
      'Energy of motion: `KE = ½ m v²`.',
      'Speed is squared. Doubling the speed gives **four times** the kinetic energy. This is why a slightly fast landing needs much more runway to stop.',
    ], formula: 'kinetic', lab: 'formula:kinetic' },
    { h: 'Potential energy', body: [
      'Energy of height: `PE = m × g × h`.',
      'A 1,000 kg aircraft 300 m above the ground stores about 2.9 million joules of potential energy.',
    ], formula: 'potential' },
    { h: 'Energy management', body: [
      'Total mechanical energy = kinetic + potential. Without thrust or drag it would stay constant, so losing height would gain speed and gaining height would lose speed.',
      'In reality **thrust adds energy and drag removes it**. With the engine at idle, a pilot controls speed with pitch: nose down to gain speed, nose up to lose it.',
      'The mission after this lesson lets you feel this trade in a simplified glide.',
    ], note: 'Energy is conserved overall, but drag continuously converts mechanical energy into heat. A glider always descends through the air around it.' },
  ],
  examples: [
    { title: 'Kinetic energy on approach', steps: ['Mass 1,000 kg, speed 30 m/s.', 'KE = ½ × 1,000 × 30² = 500 × 900.', 'KE = 450,000 J.'] },
    { title: 'Ten per cent faster', steps: ['The same aircraft at 33 m/s.', 'KE = 500 × 33² = 500 × 1,089 = 544,500 J.', 'A 10% increase in speed gives 21% more energy to remove on the runway.'] },
  ],
  practice: [
    num('Mass 1,000 kg, speed 50 m/s. Kinetic energy?', 1250000, 1000, 'J', '½ × 1,000 × 2,500 = 1,250,000 J.'),
    num('Mass 1,000 kg at 300 m height (g = 9.81). Potential energy?', 2943000, 3000, 'J', '1,000 × 9.81 × 300 = 2,943,000 J.'),
    mcq('If speed doubles, kinetic energy becomes:', ['Four times larger', 'Twice as large', 'Half as large', 'Eight times larger'], 'KE depends on v². 2² = 4.'),
    tf('With the engine at idle, lowering the nose converts potential energy into kinetic energy.', true, 'Height is exchanged for speed.'),
    num('A force of 200 N moves a box 5 m. Work done?', 1000, 1, 'J', 'W = F × d = 200 × 5 = 1,000 J.'),
  ],
  assessment: [
    num('Mass 800 kg, speed 40 m/s. Kinetic energy?', 640000, 500, 'J', '½ × 800 × 1,600 = 640,000 J.'),
    num('Mass 500 kg at 100 m height (g = 9.81). Potential energy?', 490500, 500, 'J', '500 × 9.81 × 100 = 490,500 J.'),
    mcq('If speed triples, kinetic energy becomes:', ['Nine times larger', 'Three times larger', 'Six times larger', 'One third'], '3² = 9.'),
    mcq('The unit of power is the:', ['Watt', 'Joule', 'Newton', 'Pascal'], 'Power is energy per second: 1 W = 1 J/s.'),
    mcq('In a glide with no thrust, what continuously removes mechanical energy from the aircraft?', ['Drag', 'Lift', 'Weight', 'Nothing — energy stays constant'], 'Drag converts mechanical energy to heat, so the aircraft must descend to maintain speed.'),
    num('A machine does 6,000 J of work in 30 s. Power?', 200, 1, 'W', 'P = 6,000 ÷ 30 = 200 W.'),
  ],
  missionId: 'm-phys-energy', sources: ['phak', 'afh'],
});

const lift = lesson('Lift', {
  id: 'phys-lift', title: 'Lift', minutes: 15, level: 2, prereqs: ['phys-pressure', 'phys-density', 'phys-newton'],
  objectives: ['Explain how a wing produces lift without relying on the "equal transit time" myth.', 'Use the lift equation.', 'Define angle of attack and describe the stall.'],
  intro: 'Lift is the force that holds an aircraft in the air. It is also one of the most often mis-explained ideas in science. This lesson gives you an explanation that is simple and correct.',
  simple: 'A wing is tilted slightly and shaped so that it turns the passing air downward. Pushing air down pushes the wing up. Lift grows with air density, with wing area, with the square of speed, and with the angle of the wing to the airflow — until the angle becomes too large and the wing stalls.',
  sections: [
    { h: 'How a wing makes lift', body: [
      'A wing meets the air at a small angle and has a curved shape. Together these **turn the airflow downward** behind the wing.',
      'To turn the air downward the wing must push down on it. By Newton\'s third law the air pushes up on the wing. That upward force is lift.',
      'Seen another way, the turning flow produces **lower pressure above the wing and higher pressure below**. The pressure difference, added up over the wing surface, is the same lift force. The Newton description and the pressure (Bernoulli) description are two views of one physical process.',
    ] },
    { h: 'A myth to avoid', body: [
      'You may read that air going over the top "must travel farther and catch up with the air below, so it speeds up". This **equal transit time** idea is false. Air over the top does speed up, but it does not rejoin its partner — it actually arrives at the trailing edge earlier.',
      'Bernoulli\'s principle itself is valid: where a steady flow speeds up, its static pressure falls. What is wrong is the "catching up" reason given for the speed-up.',
    ], note: 'Bernoulli\'s principle applies along a streamline in steady flow with negligible friction and, in its simple form, negligible compression. It does not by itself explain why the air speeds up over a wing.' },
    { h: 'Angle of attack', body: [
      'The **angle of attack (AoA)** is the angle between the wing\'s chord line and the oncoming air (the relative airflow). It is not the same as the aircraft\'s pitch attitude.',
      'Increasing AoA increases lift — up to a limit.',
    ] },
    { h: 'The lift equation', body: [
      '`L = ½ ρ V² S C_L`',
      '**ρ** is air density, **V** is true airspeed, **S** is wing area and **C_L** is the lift coefficient, which depends mainly on angle of attack and wing shape.',
      'Notice V²: doubling speed gives four times the lift at the same angle of attack. To fly slower, the pilot must raise the angle of attack to keep lift equal to weight.',
    ], formula: 'lift', lab: 'lift' },
    { h: 'The stall', body: [
      'Beyond the **critical angle of attack** (typically around 15–18° for a light-aircraft wing) the airflow can no longer follow the upper surface. It separates, lift drops sharply and drag rises. This is a **stall**.',
      'A wing stalls at its critical angle of attack, **whatever the airspeed or attitude**. Recovery always starts by reducing the angle of attack.',
    ] },
  ],
  examples: [
    { title: 'Lift of a light aircraft wing', steps: ['ρ = 1.225 kg/m³, V = 50 m/s, S = 16 m², C_L = 0.5.', 'L = ½ × 1.225 × 50² × 16 × 0.5.', 'L = 0.5 × 1.225 × 2,500 × 8 = 12,250 N.', 'That supports a mass of about 1,250 kg in level flight.'] },
    { title: 'Flying slower', steps: ['The aircraft slows from 50 to 40 m/s but must keep the same lift.', 'V² falls from 2,500 to 1,600, a factor of 0.64.', 'C_L must rise by 1 ÷ 0.64 ≈ 1.56, from 0.5 to about 0.78.', 'The pilot achieves this by increasing the angle of attack.'] },
  ],
  practice: [
    num('ρ = 1.225, V = 50 m/s, S = 16 m², C_L = 0.5. Lift?', 12250, 30, 'N', '½ × 1.225 × 2,500 × 16 × 0.5 = 12,250 N.'),
    mcq('At the same angle of attack, doubling the airspeed makes lift:', ['Four times larger', 'Twice as large', 'Unchanged', 'Half as large'], 'Lift depends on V².'),
    tf('A wing can stall at any airspeed if the critical angle of attack is exceeded.', true, 'The stall depends on angle of attack, not directly on speed.'),
    mcq('Why is the "equal transit time" explanation of lift wrong?', ['Air above and below the wing does not have to meet again at the trailing edge', 'Air does not speed up over the wing', 'Bernoulli\'s principle is false', 'Wings do not deflect air'], 'The air over the top is faster, but there is no physical rule forcing it to rejoin the air from below.'),
    mcq('Angle of attack is the angle between the chord line and the:', ['Relative airflow', 'Horizon', 'Runway', 'Longitudinal axis'], 'AoA is measured against the oncoming air, not the horizon.'),
  ],
  assessment: [
    num('ρ = 1.2, V = 40 m/s, S = 15 m², C_L = 0.6. Lift?', 8640, 20, 'N', '½ × 1.2 × 1,600 × 15 × 0.6 = 8,640 N.'),
    mcq('The first action to recover from a stall is to:', ['Reduce the angle of attack', 'Pull the nose up', 'Extend full flap', 'Reduce power'], 'Reducing the angle of attack lets the airflow re-attach to the wing.'),
    mcq('Which change reduces lift, if everything else stays the same?', ['Lower air density', 'Higher airspeed', 'Larger wing area', 'A slightly higher angle of attack below the stall'], 'Lift is proportional to air density.'),
    tf('Lift can be described both as a reaction to turning air downward and as a pressure difference across the wing.', true, 'These are two consistent descriptions of the same physics.'),
    mcq('To fly level at a lower airspeed, the pilot must:', ['Increase the angle of attack', 'Decrease the angle of attack', 'Keep the angle of attack constant', 'Reduce the wing area'], 'Less V² must be balanced by a higher lift coefficient.'),
    mcq('In the lift equation, S stands for:', ['Wing area', 'Speed', 'Stall angle', 'Static pressure'], 'S is the wing reference area in m².'),
  ],
  missionId: 'm-phys-lift', sources: ['phak', 'nasa-lift'],
});

export const physicsTrack: Track = {
  id: 'physics', title: 'Physics', short: 'Physics', color: '#12a594',
  blurb: 'Forces, pressure, energy and the real physics of flight — explained from zero.',
  modules: [
    { id: 'phys-basics', title: 'Quantities and Units', lessons: planned('phys', ['Physical Quantities', 'SI Units', 'Scalars and Vectors']) },
    { id: 'phys-motion', title: 'Motion', lessons: [speed, acceleration, ...planned('phys', ['Distance and Displacement'])] },
    { id: 'phys-forces', title: 'Forces', lessons: [newton, weight, friction, momentum, ...planned('phys', ['Gravity'])] },
    { id: 'phys-fluids', title: 'Pressure and Fluids', lessons: [pressure, density, atmos, continuity, bernoulli, ...planned('phys', ['Viscosity and Boundary Layers'])] },
    { id: 'phys-energy-m', title: 'Work and Energy', lessons: [energy, ...planned('phys', ['Power in Depth'])] },
    { id: 'phys-thermo', title: 'Heat and Gases', lessons: [gasLaws, ...planned('phys', ['Temperature', 'Heat', 'Thermodynamics'])] },
    { id: 'phys-waves', title: 'Waves and Sound', lessons: planned('phys', ['Waves', 'Sound']) },
    { id: 'phys-electric', title: 'Electricity and Magnetism', lessons: planned('phys', ['Electricity', 'Magnetism', 'Basic Circuits']) },
    { id: 'phys-rotation', title: 'Rotation and Balance', lessons: [torque, ...planned('phys', ['Rotational Motion', 'Equilibrium', 'Centre of Gravity'])] },
    { id: 'phys-flight', title: 'Principles of Flight', lessons: [lift, drag, ...planned('phys', ['Thrust', 'Aircraft Performance Fundamentals'])] },
  ],
};
