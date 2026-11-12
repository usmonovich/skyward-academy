// Pre-Flight Academy physics, fifth batch: electricity, magnetism, circuits, rotational motion, equilibrium, centre of gravity.
import { lesson, mcq, num, tf } from './q';

export const electricity = lesson('Electricity', {
  id: 'phys-electricity', title: 'Electricity', minutes: 9, level: 1, prereqs: ['phys-si-units'],
  objectives: ['Describe current, voltage and resistance.', 'Use Ohm\'s law.', 'Distinguish conductors from insulators and DC from AC.', 'Explain the hazard of static electricity during refuelling.'],
  intro: 'Radios, lights, instruments, flaps and the starter all depend on the electrical system. A pilot does not need to be an electrician, but must be able to read an ammeter and know what a failing alternator means.',
  simple: 'Electric current is a flow of charge, like water in a pipe. Voltage is the push that drives it. Resistance is how hard the path makes it to flow. More push gives more current; more resistance gives less.',
  sections: [
    { h: 'Three quantities', body: [
      '**Current** (I) is the rate of flow of electric charge, measured in amperes (A). **Voltage** (V) is the electrical "pressure" that drives the current, in volts. **Resistance** (R) opposes the current, in ohms (Ω).',
    ] },
    { h: 'Ohm\'s law', body: [
      '`V = I × R`, so `I = V ÷ R` and `R = V ÷ I`.',
      'A 28 V supply across 14 Ω drives a current of 2 A.',
    ], formula: 'ohm', lab: 'formula:ohm' },
    { h: 'Materials and types of current', body: [
      '**Conductors**, such as copper and aluminium, let charge flow easily. **Insulators**, such as rubber and plastic, do not.',
      '**Direct current** (DC) flows in one direction, as from a battery. **Alternating current** (AC) reverses direction many times per second. Light aircraft generally use 14 V or 28 V DC systems, supplied by an alternator with a battery as a reserve.',
    ] },
    { h: 'Static electricity', body: [
      'Friction can build up static charge on an aircraft or a fuel hose. A spark near fuel vapour could start a fire, so the aircraft and the refuelling equipment are **bonded** together with a cable to equalise their charge before the tank is opened.',
    ], note: 'Electrical-system limits and procedures for any failure are in the aircraft flight manual. This lesson explains the physics only.' },
  ],
  examples: [
    { title: 'Finding current', steps: ['A 12 V battery is connected across 6 Ω.', 'I = 12 ÷ 6.', 'I = 2 A.'] },
    { title: 'Finding resistance', steps: ['A lamp draws 0.5 A from 12 V.', 'R = 12 ÷ 0.5.', 'R = 24 Ω.'] },
  ],
  practice: [
    num('A 12 V battery is connected across 6 Ω. Current?', 2, 0.01, 'A', '12 ÷ 6 = 2 A.'),
    num('A current of 2 A flows through 5 Ω. Voltage across it?', 10, 0.01, 'V', '2 × 5 = 10 V.'),
    mcq('Voltage is measured in:', ['Volts', 'Amperes', 'Ohms', 'Watts'], 'The volt is the unit of electrical potential difference.'),
    mcq('Which of these is a good conductor?', ['Copper', 'Rubber', 'Glass', 'Dry wood'], 'Metals conduct well.'),
    tf('Alternating current flows in one direction only.', false, 'It reverses direction repeatedly; direct current flows one way.'),
  ],
  assessment: [
    num('A 28 V supply is connected across 14 Ω. Current?', 2, 0.01, 'A', '28 ÷ 14 = 2 A.'),
    num('A current of 3 A flows through 4 Ω. Voltage across it?', 12, 0.01, 'V', '3 × 4 = 12 V.'),
    num('A lamp draws 0.5 A from a 12 V supply. Its resistance?', 24, 0.05, 'Ω', '12 ÷ 0.5 = 24 Ω.'),
    mcq('Electric current is measured in:', ['Amperes', 'Volts', 'Ohms', 'Joules'], 'The ampere is the unit of current.'),
    mcq('Which of these is an insulator?', ['Rubber', 'Copper', 'Aluminium', 'Steel'], 'Rubber does not let charge flow easily.'),
    tf('Direct current flows in one direction.', true, 'A battery supplies direct current.'),
    mcq('An aircraft is bonded to the refuelling equipment in order to:', ['Prevent a static spark near fuel vapour', 'Charge the aircraft battery', 'Measure the fuel quantity', 'Cool the fuel'], 'Bonding equalises the electrical charge.'),
  ],
  missionId: 'm-phys-electricity', sources: ['phak'],
});

export const magnetism = lesson('Magnetism', {
  id: 'phys-magnetism', title: 'Magnetism', minutes: 10, level: 1, prereqs: ['phys-electricity', 'math-angles'],
  objectives: ['Describe magnetic poles and fields.', 'Describe the Earth\'s magnetic field.', 'Define variation and deviation.', 'Convert a true direction to a magnetic direction.'],
  intro: 'The magnetic compass is the one direction instrument that needs no power at all. To trust it, a pilot must understand what it points at, and the two errors that stand between it and true north.',
  simple: 'A magnet has two poles; like poles push apart and unlike poles pull together. The Earth is a huge magnet, and a compass needle lines up with it. But magnetic north is not quite true north, and the aircraft itself disturbs the needle a little.',
  sections: [
    { h: 'Magnets and fields', body: [
      'Every magnet has a north and a south **pole**. Like poles repel; unlike poles attract. The region where a magnet has an effect is its **magnetic field**.',
      'An electric current also produces a magnetic field. This is the principle of the electromagnet, the electric motor and the alternator.',
    ] },
    { h: 'The Earth\'s field', body: [
      'The Earth has a magnetic field with poles near, but not at, the geographic poles. A compass needle aligns with the local field and so points to **magnetic north**.',
      'The field also slopes down into the Earth away from the equator (**dip**), which causes compass errors in turns and during acceleration.',
    ] },
    { h: 'Variation and deviation', body: [
      '**Variation** is the angle between true north and magnetic north at a place. It is printed on charts and changes slowly over the years.',
      '**Deviation** is the error caused by the aircraft\'s own magnetic fields from metal and electrical equipment. It is listed on a card next to the compass.',
      '`magnetic = true − easterly variation` (add westerly variation). Remembered as "east is least, west is best".',
      'A true track of 090° with 10° E variation is 080° magnetic. A true track of 200° with 5° W variation is 205° magnetic.',
    ], formula: 'true-to-mag', lab: 'formula:true-to-mag', note: 'Use the variation printed on a current chart for the area. The values in this lesson are invented for practice.' },
  ],
  examples: [
    { title: 'Easterly variation', steps: ['True track 150°, variation 8° E.', 'East is least: subtract.', 'Magnetic track = 142°.'] },
    { title: 'Westerly variation through north', steps: ['True track 355°, variation 10° W.', 'West is best: add. 355 + 10 = 365.', 'Subtract 360: magnetic track = 005°.'] },
  ],
  practice: [
    num('True track 150°, variation 8° E. Magnetic track?', 142, 0.5, '°', '150 − 8 = 142°.'),
    num('True track 100°, variation 6° W. Magnetic track?', 106, 0.5, '°', '100 + 6 = 106°.'),
    mcq('A compass needle points towards:', ['Magnetic north', 'True north', 'The nearest airport', 'The Sun'], 'It aligns with the Earth\'s magnetic field.'),
    mcq('Unlike magnetic poles:', ['Attract each other', 'Repel each other', 'Have no effect on each other', 'Cancel permanently'], 'North attracts south.'),
    tf('Variation is the same everywhere on Earth.', false, 'It depends on location and changes slowly with time.'),
  ],
  assessment: [
    num('True track 090°, variation 10° E. Magnetic track?', 80, 0.5, '°', '090 − 10 = 080°.'),
    num('True track 200°, variation 5° W. Magnetic track?', 205, 0.5, '°', '200 + 5 = 205°.'),
    num('True track 355°, variation 10° W. Magnetic track?', 5, 0.5, '°', '355 + 10 = 365, minus 360 = 005°.'),
    mcq('Variation is the angle between:', ['True north and magnetic north', 'Magnetic north and compass north', 'Heading and track', 'The wing and the airflow'], 'It depends on where you are on the Earth.'),
    mcq('Deviation is caused by:', ['The aircraft\'s own magnetic fields', 'The Earth\'s rotation', 'Wind', 'Altitude'], 'Metal and electrical equipment disturb the compass.'),
    tf('Like magnetic poles attract each other.', false, 'Like poles repel.'),
    mcq('An electric current flowing in a wire produces:', ['A magnetic field around the wire', 'No magnetic effect', 'Only light', 'A vacuum'], 'This is the basis of electromagnets and motors.'),
  ],
  missionId: 'm-phys-magnetism', sources: ['phak'],
});

export const circuits = lesson('Basic circuits', {
  id: 'phys-basic-circuits', title: 'Basic Circuits', minutes: 10, level: 2, prereqs: ['phys-electricity'],
  objectives: ['Describe series and parallel circuits.', 'Calculate electrical power.', 'Explain the purpose of fuses and circuit breakers.', 'Estimate how long a battery can supply a load.'],
  intro: 'If the alternator fails in flight, the battery is all that remains. How long it lasts depends on what is switched on. That is a circuits problem, solved in the cockpit.',
  simple: 'In a series circuit there is one path, so the same current flows through everything. In a parallel circuit each item has its own path and gets the full voltage. Power is voltage times current.',
  sections: [
    { h: 'Series and parallel', body: [
      'In **series**, components share one path: the current is the same through each, and the resistances add. 4 Ω and 6 Ω in series make 10 Ω.',
      'In **parallel**, each component is connected across the supply: each gets the full voltage, and the currents add. Aircraft equipment is connected in parallel so each item can be switched independently.',
    ] },
    { h: 'Electrical power', body: [
      '`P = V × I`, in watts. A device drawing 5 A from 28 V uses 140 W. A 56 W light on 28 V draws 2 A.',
    ], formula: 'elec-power', lab: 'formula:elec-power' },
    { h: 'Protection', body: [
      'Too much current overheats wiring. A **fuse** melts and a **circuit breaker** trips to open the circuit before the wire is damaged. They protect the wiring, not the equipment.',
    ] },
    { h: 'Battery endurance', body: [
      'Battery capacity is given in ampere-hours (Ah). Ideally, `time = capacity ÷ load current`: a 30 Ah battery supplying 15 A lasts about 2 hours. Halving the load doubles the time.',
      'This is why the first step after an alternator failure is to reduce electrical load.',
    ], note: 'A real battery delivers less than its rated capacity, especially when cold, old or heavily loaded. Follow the flight manual procedure and land as soon as practicable.' },
  ],
  examples: [
    { title: 'Power', steps: ['A pump draws 4 A from 14 V.', 'P = 14 × 4.', 'P = 56 W.'] },
    { title: 'Battery time', steps: ['A 25 Ah battery supplies a load of 10 A.', '25 ÷ 10 = 2.5.', 'Ideally it lasts 2.5 hours; plan for less.'] },
  ],
  practice: [
    num('A pump draws 4 A from 14 V. Power?', 56, 0.1, 'W', '14 × 4 = 56 W.'),
    num('Resistors of 3 Ω and 9 Ω are connected in series. Total resistance?', 12, 0.01, 'Ω', '3 + 9 = 12 Ω.'),
    num('A 25 Ah battery supplies 10 A. Ideal duration in hours?', 2.5, 0.01, 'h', '25 ÷ 10 = 2.5 h.'),
    mcq('A fuse protects a circuit by:', ['Melting and opening the circuit when current is too high', 'Increasing the voltage', 'Storing charge', 'Reducing resistance'], 'It is a deliberate weak link.'),
    mcq('Aircraft electrical equipment is normally connected:', ['In parallel', 'In series', 'With no return path', 'Directly to the alternator only'], 'Each item gets full voltage and can be switched on its own.'),
  ],
  assessment: [
    num('Resistors of 4 Ω and 6 Ω are connected in series. Total resistance?', 10, 0.01, 'Ω', '4 + 6 = 10 Ω.'),
    num('A device draws 5 A from a 28 V supply. Power?', 140, 0.2, 'W', '28 × 5 = 140 W.'),
    num('A 56 W landing light operates on 28 V. Current drawn?', 2, 0.01, 'A', '56 ÷ 28 = 2 A.'),
    num('A 30 Ah battery supplies 15 A. Ideal duration in hours?', 2, 0.01, 'h', '30 ÷ 15 = 2 h.'),
    mcq('The purpose of a circuit breaker is to:', ['Protect the wiring from excessive current', 'Increase battery capacity', 'Make the radio louder', 'Store electrical energy'], 'It opens the circuit before the wire overheats.'),
    tf('In a parallel circuit, each branch has the same voltage across it.', true, 'Each branch is connected directly across the supply.'),
    mcq('In a series circuit, the current is:', ['The same through every component', 'Different in every component', 'Zero', 'Greatest in the last component'], 'There is only one path.'),
  ],
  missionId: 'm-phys-circuits', sources: ['phak'],
});

export const rotational = lesson('Rotational motion', {
  id: 'phys-rotational-motion', title: 'Rotational Motion', minutes: 10, level: 2, prereqs: ['phys-accel', 'math-trig'],
  objectives: ['Describe rotation using revolutions per minute and degrees per second.', 'Calculate centripetal acceleration.', 'Explain what provides the turning force in a banked turn.', 'Calculate turn radius from speed and bank angle.'],
  intro: 'An aircraft does not turn by steering like a car. It banks, and part of its lift pulls it round the circle. Circular motion explains why faster aircraft need so much more sky to turn.',
  simple: 'Anything moving in a circle is constantly being pulled toward the centre. In an aircraft that pull is the sideways part of the lift when the wings are banked. Go faster, and the circle gets much bigger.',
  sections: [
    { h: 'Describing rotation', body: [
      'Rotation is measured in revolutions per minute (rpm) or in degrees per second. An engine at 2,400 rpm turns 40 times every second.',
      'A **rate-one turn** is 3° per second: a full 360° takes 120 seconds.',
    ] },
    { h: 'Centripetal acceleration', body: [
      'An object moving in a circle is always changing direction, so it is accelerating toward the centre: `a = v² ÷ r`. The force that causes it is the **centripetal force**.',
      'At 20 m/s round a circle of radius 100 m, a = 400 ÷ 100 = 4 m/s².',
    ] },
    { h: 'The banked turn', body: [
      'When an aircraft banks, its lift tilts. The vertical part still supports the weight; the horizontal part is the centripetal force.',
      '`radius = v² ÷ (g × tan φ)`, with v in m/s and φ the bank angle. At 50 m/s and 45° of bank, the radius is 2,500 ÷ 9.81 ≈ 255 m.',
      'At the same bank angle, doubling the speed makes the radius four times larger.',
    ], formula: 'turn-radius', lab: 'formula:turn-radius', note: 'Because part of the lift is used for turning, total lift must increase to hold altitude. The load factor rises and so does the stall speed.' },
  ],
  examples: [
    { title: 'Centripetal acceleration', steps: ['v = 30 m/s, r = 300 m.', 'a = 900 ÷ 300.', 'a = 3 m/s².'] },
    { title: 'Time for a turn', steps: ['A rate-one turn is 3° per second.', 'A 180° turn takes 180 ÷ 3.', 'It takes 60 seconds.'] },
  ],
  practice: [
    num('v = 30 m/s on a circle of radius 300 m. Centripetal acceleration?', 3, 0.01, 'm/s²', '900 ÷ 300 = 3 m/s².'),
    num('How long does a 180° turn take at 3° per second?', 60, 0.1, 's', '180 ÷ 3 = 60 s.'),
    mcq('The centripetal force on an object moving in a circle points:', ['Toward the centre of the circle', 'Away from the centre', 'Along the direction of motion', 'Straight down'], 'It continually changes the direction of motion.'),
    num('An engine runs at 1,800 rpm. Revolutions per second?', 30, 0.01, '', '1,800 ÷ 60 = 30.'),
    mcq('To turn, an aircraft uses:', ['The horizontal component of lift', 'The rudder alone', 'Extra weight', 'Engine torque'], 'Banking tilts the lift toward the centre of the turn.'),
  ],
  assessment: [
    num('v = 20 m/s on a circle of radius 100 m. Centripetal acceleration?', 4, 0.01, 'm/s²', '400 ÷ 100 = 4 m/s².'),
    num('Turn radius at 50 m/s with 45° of bank (tan 45° = 1, g = 9.81 m/s²)?', 254.8, 1, 'm', '2,500 ÷ 9.81 ≈ 254.8 m.'),
    num('How long does a full 360° turn take at 3° per second?', 120, 0.1, 's', '360 ÷ 3 = 120 s.'),
    num('An engine runs at 2,400 rpm. Revolutions per second?', 40, 0.01, '', '2,400 ÷ 60 = 40.'),
    mcq('At the same bank angle, doubling the speed makes the turn radius:', ['Four times larger', 'Twice as large', 'Half as large', 'Unchanged'], 'Radius depends on speed squared.'),
    tf('In a banked turn, the centripetal force is supplied by the horizontal component of lift.', true, 'The vertical component supports the weight.'),
    mcq('An object moving at constant speed in a circle is:', ['Accelerating toward the centre', 'Not accelerating', 'Accelerating outward', 'Slowing down'], 'Its direction, and so its velocity, is changing.'),
  ],
  missionId: 'm-phys-rotation', sources: ['phak', 'afh'],
});

export const equilibrium = lesson('Equilibrium', {
  id: 'phys-equilibrium', title: 'Equilibrium', minutes: 9, level: 2, prereqs: ['phys-torque', 'phys-newton'],
  objectives: ['State the two conditions for equilibrium.', 'Apply balance of forces to steady flight.', 'Apply balance of moments.', 'Distinguish stable, unstable and neutral equilibrium.'],
  intro: 'In a steady cruise, enormous forces act on an aircraft, yet nothing changes. That quiet balance is equilibrium, and every deliberate manoeuvre begins by disturbing it.',
  simple: 'An object is in equilibrium when all the pushes and pulls on it cancel out and all the turning effects cancel out too. It then stays at rest or keeps moving steadily in a straight line.',
  sections: [
    { h: 'Two conditions', body: [
      'An object is in **equilibrium** when the **net force** on it is zero and the **net moment** on it is zero.',
      'Equilibrium does not mean "not moving". It means "not accelerating": constant speed in a straight line counts.',
    ] },
    { h: 'Steady flight', body: [
      'In straight and level flight at constant speed, lift equals weight and thrust equals drag. If thrust exceeds drag, the aircraft accelerates until drag has grown to match.',
      'A steady climb at constant speed is also equilibrium: the forces still balance, just in different directions.',
    ] },
    { h: 'Balance of moments', body: [
      'For no rotation, clockwise moments must equal anticlockwise moments: `F₁ × d₁ = F₂ × d₂`.',
      'A 200 N force 3 m from a pivot is balanced by 300 N at 2 m on the other side. On an aircraft the tailplane provides the small balancing force with a long arm.',
    ], formula: 'moment-balance', lab: 'formula:moment-balance' },
    { h: 'Stability', body: [
      'In **stable** equilibrium an object returns after a small disturbance, like a ball in a bowl. In **unstable** equilibrium it moves further away, like a ball on a dome. In **neutral** equilibrium it stays where it is put, like a ball on a flat table.',
    ], note: 'Aircraft are designed to be stable: after a gust they tend to return to their trimmed condition without the pilot doing anything.' },
  ],
  examples: [
    { title: 'Balancing moments', steps: ['A 400 N force acts 1 m from a pivot.', 'It must be balanced by a force 4 m away on the other side.', 'F = 400 × 1 ÷ 4 = 100 N.'] },
    { title: 'Net force', steps: ['Thrust is 2,500 N and drag is 2,100 N in level flight.', 'Net force = 400 N forward.', 'The aircraft is accelerating, so it is not in equilibrium.'] },
  ],
  practice: [
    num('A 400 N force 1 m from a pivot is balanced by a force 4 m from it. Size of that force?', 100, 0.5, 'N', '400 × 1 ÷ 4 = 100 N.'),
    num('Thrust is 2,500 N and drag is 2,100 N. Net forward force?', 400, 0.5, 'N', '2,500 − 2,100 = 400 N.'),
    mcq('An object in equilibrium has:', ['Zero net force and zero net moment', 'Zero weight', 'Zero speed always', 'Maximum acceleration'], 'Both conditions must hold.'),
    mcq('A ball balanced on top of a dome is in:', ['Unstable equilibrium', 'Stable equilibrium', 'Neutral equilibrium', 'No equilibrium'], 'A small push makes it roll further away.'),
    tf('An object moving at constant speed in a straight line can be in equilibrium.', true, 'It is not accelerating.'),
  ],
  assessment: [
    num('A 200 N force 3 m from a pivot is balanced by a force 2 m from it. Size of that force?', 300, 0.5, 'N', '200 × 3 ÷ 2 = 300 N.'),
    num('A 600 N force 1.5 m from a pivot is balanced by a force 4.5 m from it. Size of that force?', 200, 0.5, 'N', '600 × 1.5 ÷ 4.5 = 200 N.'),
    num('Thrust is 2,000 N and drag is 2,000 N. Net horizontal force?', 0, 0.01, 'N', 'They cancel: the aircraft is in horizontal equilibrium.'),
    mcq('In straight and level flight at constant speed:', ['Lift equals weight and thrust equals drag', 'Lift exceeds weight', 'Thrust exceeds drag', 'Drag exceeds thrust'], 'All forces balance.'),
    tf('An aircraft in a steady climb at constant speed is in equilibrium.', true, 'It is not accelerating, so the forces balance.'),
    mcq('A ball resting at the bottom of a bowl is in:', ['Stable equilibrium', 'Unstable equilibrium', 'Neutral equilibrium', 'Free fall'], 'It returns after a small disturbance.'),
    mcq('If thrust becomes greater than drag in level flight, the aircraft:', ['Accelerates', 'Slows down', 'Stays at the same speed', 'Stalls'], 'There is a net forward force.'),
  ],
  missionId: 'm-phys-equilibrium', sources: ['phak'],
});

export const centreOfGravity = lesson('Centre of gravity', {
  id: 'phys-centre-of-gravity', title: 'Centre of Gravity', minutes: 10, level: 2, prereqs: ['phys-equilibrium'],
  objectives: ['Define the centre of gravity.', 'Calculate the centre of gravity of two masses.', 'Calculate how the centre of gravity moves when a load is shifted.', 'Describe the effects of a forward and an aft centre of gravity.'],
  intro: 'Where the weight sits matters as much as how much there is. An aircraft loaded within its weight limit but with its centre of gravity too far aft can be impossible to control.',
  simple: 'The centre of gravity is the balance point: the single point where all the weight seems to act. Move a heavy bag backward and the balance point moves backward too.',
  sections: [
    { h: 'The balance point', body: [
      'The **centre of gravity** (CG) is the point through which the total weight of an object acts. An aircraft rotates about its CG in flight.',
      'Positions are measured as **arms** from a reference line called the **datum**. Mass times arm is a **moment**.',
    ] },
    { h: 'Finding the CG', body: [
      '`CG = total moment ÷ total mass`.',
      'For 100 kg at 2 m and 300 kg at 4 m: total moment = 200 + 1,200 = 1,400 kg·m, total mass = 400 kg, so the CG is at 3.5 m. It lies nearer the heavier mass.',
    ] },
    { h: 'Shifting a load', body: [
      'Moving a mass m through a distance d inside an aircraft of total mass M moves the CG by `m × d ÷ M`, in the same direction.',
      'Moving 50 kg of baggage 2 m aft in a 1,000 kg aircraft moves the CG 0.1 m aft. Burning fuel also moves the CG during flight if the tanks are not at the CG.',
    ], formula: 'cg-shift', lab: 'formula:cg-shift' },
    { h: 'Why the limits matter', body: [
      'A CG too far **forward** makes the aircraft nose-heavy: more tail down-force is needed, which raises the stall speed and can make it hard to raise the nose for landing.',
      'A CG too far **aft** reduces stability. The aircraft may pitch up on its own and recovery from a stall or spin may become impossible.',
    ], note: 'The CG limits and the loading method for each aircraft are in its flight manual. Mass and balance must be calculated before every flight.' },
  ],
  examples: [
    { title: 'CG of two masses', steps: ['200 kg at 1 m and 200 kg at 3 m.', 'Total moment = 200 + 600 = 800 kg·m; total mass = 400 kg.', 'CG = 800 ÷ 400 = 2 m.'] },
    { title: 'Load shift', steps: ['Move 20 kg forward by 1.5 m in an 800 kg aircraft.', '20 × 1.5 ÷ 800 = 0.0375.', 'The CG moves 0.0375 m forward.'] },
  ],
  practice: [
    num('Masses of 200 kg at 1 m and 200 kg at 3 m from the datum. Position of the CG?', 2, 0.01, 'm', '800 ÷ 400 = 2 m.'),
    num('A mass of 60 kg sits at an arm of 2 m. Its moment?', 120, 0.1, 'kg·m', '60 × 2 = 120 kg·m.'),
    mcq('The datum is:', ['The reference line from which arms are measured', 'The heaviest item on board', 'The centre of the wing', 'The maximum take-off mass'], 'All arms are distances from it.'),
    mcq('The CG of two unequal masses lies:', ['Nearer the heavier mass', 'Nearer the lighter mass', 'Exactly halfway', 'Outside both masses'], 'The heavier mass has more influence.'),
    tf('An aircraft within its maximum mass is always safe to fly, wherever the CG is.', false, 'The CG must also be within its limits.'),
  ],
  assessment: [
    num('Masses of 100 kg at 2 m and 300 kg at 4 m from the datum. Position of the CG?', 3.5, 0.01, 'm', '(200 + 1,200) ÷ 400 = 3.5 m.'),
    num('50 kg of baggage is moved 2 m aft in a 1,000 kg aircraft. How far does the CG move?', 0.1, 0.002, 'm', '50 × 2 ÷ 1,000 = 0.1 m aft.'),
    num('A mass of 80 kg sits at an arm of 2.5 m. Its moment?', 200, 0.2, 'kg·m', '80 × 2.5 = 200 kg·m.'),
    mcq('A CG behind the aft limit causes:', ['Reduced stability and possibly unrecoverable stalls or spins', 'Greater stability', 'A higher stall speed only', 'No change in handling'], 'An aft CG is the more dangerous case.'),
    mcq('A CG at the forward limit, compared with further aft, gives:', ['A higher stall speed', 'A lower stall speed', 'Less stability', 'Lighter elevator forces'], 'More tail down-force is needed, which the wing must also carry.'),
    tf('The CG of an aircraft can move during flight as fuel is burned.', true, 'It moves if the fuel is not located at the CG.'),
    mcq('The centre of gravity is the point:', ['Through which the total weight acts', 'Where lift is greatest', 'Where the engine is mounted', 'At the tip of the wing'], 'The aircraft balances and rotates about it.'),
  ],
  missionId: 'm-phys-cog', sources: ['phak', 'faa-wb'],
});
