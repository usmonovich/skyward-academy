import type { Track } from '../types';
import { lesson, match, mcq, num, order, planned, scenario, tf } from './q';
import { mathTrack } from './math';
import { physicsTrack } from './physics';
import { airspace, clouds, fog, metar, rules, storms } from './ppl2';
import { cockpit, components, identification, introAviation, safetyCulture, terminology } from './ppl3';
import { basicAero, basicMet, basicNav, commsIntro, instrumentsIntro, planningIntro, stability } from './ppl4';
import { atmosphereDepth, decisionMaking, fitness, fronts, hypoxia, vision, windTurbulence } from './ppl5';
import { airframe, fuelElectrical, gyroInstruments, pistonEngines, pitotStatic, polar, propellers, stalling } from './ppl6';
import { aerodromeMarkings, distressUrgency, licensing, phraseology, rtBasics } from './ppl7';
import { emergencies, fire, fuelPlanning, preflight, takeoffLanding, vfrPlanning, wake } from './ppl8';
import { charts, compass, deadReckoning, gnss, radioNav } from './ppl9';
import { asymmetric, greatCircles, highLift, oneInSixtyPractice, pbn, polars, stabilityControl, vorDmeIls } from './cpl2';
import { climbCruise, landingPerf, perfLimits, takeoffPerf } from './cpl3';
import { commercialFuel, icingDepth, jetStreams, massBalanceLarge, planningMonitoring, sigwx, wxDecisions } from './cpl4';
import { efis, electricalSystems, hydraulics, powerplants, pressurisation } from './cpl5';
import { commercialHp, commercialLaw, commercialOps, crewComms, emergencyDecisions, opsProcedures, riskManagement } from './cpl6';
import { buffetMargins, electricsFuel, flightControls, gasTurbines, hydGear, machTuck, pneumatics, shockWaves, sweptWings } from './atpl2';
import { airData, autoflight, fms, inertial } from './atpl3';
import { classA, enrouteLanding, ifrPlans, jetFuel, loadSheets, loadingCg, petPsr, vSpeeds } from './atpl4';
import { altitudePhysiology, catLesson, circulation, highAltHazards, humanError, sleep, tropical } from './atpl5';

const pick = (track: Track, id: string) => track.modules.flatMap((m) => m.lessons).find((l) => l.id === id)!;

/* ------------------------------------------------------------------ PPL */

const forces = lesson('Principles of flight', {
  id: 'ppl-forces', title: 'The Four Forces and Load Factor', minutes: 14, level: 2, prereqs: ['phys-lift', 'phys-newton'],
  objectives: ['Describe lift, weight, thrust and drag and how they balance in steady flight.', 'Explain why an aircraft climbs.', 'Calculate load factor in a level turn and its effect on stall speed.'],
  intro: 'Every manoeuvre is a change in the balance of four forces. Understanding that balance explains why steep turns feel heavy and why the stall speed is not a fixed number.',
  simple: 'Four forces act on an aeroplane: lift up, weight down, thrust forward, drag back. In steady flight they balance. In a turn the wings must produce extra lift, so you feel heavier and the aircraft stalls at a higher speed.',
  sections: [
    { h: 'Four forces', body: [
      '**Lift** acts at right angles to the relative airflow. **Weight** acts toward the centre of the Earth. **Thrust** acts forward along the propeller or engine axis. **Drag** acts backward, parallel to the relative airflow.',
      'In straight and level flight at constant speed: `lift = weight` and `thrust = drag`.',
    ] },
    { h: 'Why an aircraft climbs', body: [
      'A steady climb is not caused by lift being greater than weight. In a steady climb the forces are still balanced; lift is actually slightly **less** than weight.',
      'The aircraft climbs because **thrust exceeds drag**. The excess thrust supports part of the weight along the inclined flight path. More excess thrust means a steeper climb angle.',
    ], note: 'Excess thrust determines climb angle. Excess power determines climb rate. These give different best-climb speeds (Vx and Vy).' },
    { h: 'Turning and load factor', body: [
      'To turn, the aircraft banks. The lift force tilts, and its horizontal part pulls the aircraft around the turn.',
      'Only the vertical part of lift now opposes weight, so total lift must increase to hold altitude. The ratio of lift to weight is the **load factor**: `n = L / W`.',
      'In a level, coordinated turn: `n = 1 / cos(bank angle)`. At 60° of bank n = 2: the wings carry twice the aircraft\'s weight and you feel "2 g".',
    ], formula: 'load-factor', lab: 'formula:load-factor' },
    { h: 'Stall speed in a turn', body: [
      'More lift is needed, but the critical angle of attack has not changed. The stall therefore occurs at a higher airspeed: `Vs(turn) = Vs × √n`.',
      'At 60° of bank the stall speed is √2 ≈ 1.41 times the wings-level stall speed.',
    ] },
  ],
  examples: [
    { title: 'Load factor at 45° bank', steps: ['n = 1 ÷ cos 45° = 1 ÷ 0.707.', 'n ≈ 1.41.', 'Stall speed factor = √1.41 ≈ 1.19: a 50 kt stall speed becomes about 59 kt.'] },
    { title: 'Stall speed at 60° bank', steps: ['Wings-level stall speed 50 kt. n = 2.', 'Vs(turn) = 50 × √2 = 50 × 1.414.', 'Vs(turn) ≈ 71 kt.'] },
  ],
  practice: [
    num('Load factor in a level 60° banked turn?', 2, 0.02, 'g', 'n = 1 ÷ cos 60° = 1 ÷ 0.5 = 2.'),
    num('Wings-level stall speed 50 kt. Stall speed at n = 2?', 70.7, 1, 'kt', '50 × √2 ≈ 70.7 kt.'),
    mcq('An aircraft is in a steady climb at constant speed. The climb is sustained because:', ['Thrust exceeds drag', 'Lift exceeds weight', 'Weight is reduced', 'Drag exceeds thrust'], 'Excess thrust supports the component of weight along the flight path.'),
    tf('In straight and level unaccelerated flight, thrust equals drag.', true, 'No acceleration means balanced forces.'),
    mcq('In a level turn, which part of the lift force turns the aircraft?', ['The horizontal component', 'The vertical component', 'The whole lift force', 'None; the rudder turns the aircraft'], 'The horizontal component of the tilted lift provides the turning (centripetal) force.'),
  ],
  assessment: [
    num('Load factor in a level 45° banked turn? (cos 45° ≈ 0.707)', 1.41, 0.02, 'g', '1 ÷ 0.707 ≈ 1.41.'),
    num('Wings-level stall speed 60 kt. Stall speed in a level 60° banked turn?', 84.9, 1.2, 'kt', '60 × √2 ≈ 84.9 kt.'),
    mcq('Drag acts:', ['Parallel to the relative airflow, opposing motion', 'Vertically downward', 'At right angles to the relative airflow', 'Along the wing span'], 'Drag is the force component parallel to the relative airflow.'),
    mcq('As bank angle increases in a level turn, the stall speed:', ['Increases', 'Decreases', 'Stays the same', 'Becomes zero'], 'Load factor rises, and stall speed rises with √n.'),
    tf('In a steady climb, lift is greater than weight.', false, 'Forces are balanced in a steady climb; lift is slightly less than weight and excess thrust does the work.'),
    scenario(mcq('You are turning from base to final at low speed and add more bank and back pressure to tighten the turn. What is the main risk?', ['Load factor rises, the stall speed increases toward your airspeed', 'The engine may overheat', 'Lift will exceed structural limits immediately', 'Groundspeed becomes too low'], 'Tightening a low-speed turn raises the stall speed while airspeed is low — a classic loss-of-control scenario.')),
  ],
  missionId: 'm-ppl-forces', sources: ['phak', 'afh', 'easa-fcl'],
});

const controls = lesson('Aircraft general knowledge', {
  id: 'ppl-controls', title: 'Flight Controls', minutes: 12, level: 1,
  objectives: ['Name the three aircraft axes and the motion about each.', 'State which control surface produces roll, pitch and yaw.', 'Explain the purpose of flaps and trim.'],
  intro: 'A pilot has three primary controls and a few secondary ones. Each moves a surface that changes the airflow and rotates the aircraft about one of its three axes.',
  simple: 'Ailerons roll the aircraft, the elevator pitches the nose up or down, and the rudder yaws the nose left or right. Flaps help the aircraft fly slower for landing. Trim holds a control position so the pilot does not have to push or pull all the time.',
  sections: [
    { h: 'Three axes', body: [
      'All three axes pass through the centre of gravity.',
      '**Longitudinal axis** (nose to tail): rotation about it is **roll**.',
      '**Lateral axis** (wingtip to wingtip): rotation about it is **pitch**.',
      '**Vertical (normal) axis**: rotation about it is **yaw**.',
    ] },
    { h: 'Primary controls', body: [
      '**Ailerons** on the outer wings move in opposite directions and produce roll. Moving the control wheel or stick left raises the left aileron and lowers the right one; the aircraft rolls left.',
      'The **elevator** on the horizontal tail produces pitch. Pulling back raises the elevator, the tail goes down and the nose goes up.',
      'The **rudder** on the vertical fin produces yaw. Pressing the left pedal moves the rudder left and the nose yaws left.',
      'Select each surface on the diagram to see what it does.',
    ], lab: 'controls' },
    { h: 'Adverse yaw', body: [
      'The down-going aileron creates more lift and also more drag. That extra drag pulls the nose away from the direction of the turn. This is **adverse yaw**.',
      'The pilot corrects it with rudder in the direction of the turn, keeping the flight coordinated.',
    ] },
    { h: 'Secondary controls', body: [
      '**Flaps** on the inner trailing edge increase lift and drag. They lower the stall speed and allow a steeper approach at a lower speed.',
      '**Trim** relieves steady control forces. The pilot first sets the attitude with the primary control, then trims the force away.',
    ], note: 'Trim is not used to fly the aircraft. Set the attitude first, then trim.' },
  ],
  examples: [
    { title: 'Entering a left turn', steps: ['Move the control left: the left aileron goes up, the right goes down.', 'The aircraft rolls left; adverse yaw tries to swing the nose right.', 'Apply left rudder to stay coordinated, and a little back pressure to hold altitude.'] },
  ],
  practice: [
    match('Match each control surface to the motion it produces.', [['Ailerons', 'Roll'], ['Elevator', 'Pitch'], ['Rudder', 'Yaw']], 'Ailerons roll, elevator pitches, rudder yaws.'),
    mcq('Roll takes place about which axis?', ['Longitudinal axis', 'Lateral axis', 'Vertical axis', 'Horizontal axis'], 'The longitudinal axis runs from nose to tail.'),
    mcq('The main purpose of trim is to:', ['Relieve steady control forces', 'Increase engine power', 'Turn the aircraft', 'Raise the stall speed'], 'Trim removes the need for a constant push or pull.'),
    tf('Lowering flaps reduces the stall speed.', true, 'Flaps increase the maximum lift coefficient, so the wing can support the aircraft at a lower speed.'),
    mcq('Adverse yaw is corrected with:', ['Rudder', 'Elevator', 'Flaps', 'Trim only'], 'Rudder in the direction of the turn keeps the aircraft coordinated.'),
  ],
  assessment: [
    match('Match each axis to the motion about it.', [['Longitudinal axis', 'Roll'], ['Lateral axis', 'Pitch'], ['Vertical axis', 'Yaw']], 'Roll, pitch and yaw occur about the longitudinal, lateral and vertical axes.'),
    mcq('Pulling the control column back causes:', ['The elevator to rise and the nose to pitch up', 'The elevator to lower and the nose to pitch up', 'The ailerons to rise', 'The rudder to move left'], 'Up elevator pushes the tail down, so the nose rises.'),
    mcq('When the control is moved to the right, the right aileron:', ['Moves up', 'Moves down', 'Does not move', 'Moves with the flaps'], 'The aileron on the inside of the roll goes up, reducing lift on that wing.'),
    mcq('Flaps are normally located:', ['On the inner trailing edge of the wing', 'On the outer trailing edge of the wing', 'On the vertical fin', 'On the horizontal tail'], 'Ailerons are outboard; flaps are inboard.'),
    tf('All three aircraft axes pass through the centre of gravity.', true, 'The aircraft rotates about its centre of gravity.'),
    order('Put the steps for trimming in the correct order.', ['Set the desired attitude with the primary control', 'Hold the attitude and let the speed settle', 'Adjust trim until the control force disappears'], 'Attitude first, then trim.'),
  ],
  missionId: 'm-ppl-controls', sources: ['phak', 'afh'],
});

const altimetry = lesson('Aircraft general knowledge', {
  id: 'ppl-altimetry', title: 'Altimetry: QNH, QFE and Standard', minutes: 14, level: 2, prereqs: ['phys-atmos'],
  objectives: ['Explain what the altimeter subscale setting does.', 'Distinguish QNH, QFE and the standard setting.', 'Predict the altimeter error when flying toward lower pressure.'],
  intro: 'An altimeter does not know where the ground is. It measures pressure and compares it with a reference pressure that you set. Choose the wrong reference and the instrument will confidently show the wrong height.',
  simple: 'The altimeter shows height above whatever pressure level you dial in. Set the local sea-level pressure (QNH) and it shows altitude above sea level. If the real pressure is lower than what you set, you are lower than the altimeter says.',
  sections: [
    { h: 'The subscale', body: [
      'The altimeter has a small window where the pilot sets a reference pressure. The instrument shows the height above the level where that pressure exists.',
    ] },
    { h: 'Three common settings', body: [
      '**QNH** — the local pressure reduced to mean sea level. With QNH set, the altimeter shows **altitude** above mean sea level. On the ground it shows the airfield elevation.',
      '**QFE** — the pressure at the aerodrome reference level. With QFE set, the altimeter shows **height** above the aerodrome and reads zero on the runway.',
      '**Standard (1,013.25 hPa)** — used above the transition altitude. The altimeter then shows a **flight level**: FL 85 means 8,500 ft on the standard setting.',
    ], note: 'Jurisdiction note: transition altitudes vary by State. In the United States the altimeter setting is given in inches of mercury (standard 29.92 inHg) and the transition altitude is 18,000 ft. QFE is not used operationally in many countries.' },
    { h: 'The pressure error', body: [
      'If you fly into an area of lower pressure without updating the setting, the pressure level you dialled in is now lower in the sky — and so are you.',
      'The altimeter **over-reads**: the aircraft is lower than indicated. The error is about 27 ft for each hPa near sea level (30 ft per hPa is often used for mental estimates).',
      'The memory aid: **"High to low, look out below."** The same applies when flying from warm air into much colder air.',
      'Use the altimeter simulator: keep the subscale fixed and lower the actual pressure.',
    ], lab: 'altimeter' },
  ],
  examples: [
    { title: 'A forgotten setting', steps: ['Subscale set to 1,013 hPa. Actual QNH is 1,003 hPa.', 'Difference = 10 hPa. Error ≈ 10 × 27 = 270 ft.', 'Pressure is lower than set, so the aircraft is about 270 ft LOWER than indicated.'] },
    { title: 'Reading a flight level', steps: ['Standard setting 1,013.25 hPa, altimeter shows 6,500 ft.', 'Flight level = altitude ÷ 100.', 'The aircraft is at FL 65.'] },
  ],
  practice: [
    mcq('With QNH set, the altimeter on the ground shows:', ['Airfield elevation', 'Zero', 'Flight level', 'Pressure altitude only'], 'QNH references mean sea level, so the instrument shows elevation.'),
    mcq('With QFE set, the altimeter on the runway shows approximately:', ['Zero', 'Airfield elevation', 'The flight level', '1,013 ft'], 'QFE references the aerodrome level.'),
    num('Subscale 1,013 hPa, actual QNH 1,003 hPa. By about how many feet does the altimeter over-read (27 ft per hPa)?', 270, 35, 'ft', '10 hPa × 27 ft ≈ 270 ft (300 ft with the 30 ft rule).'),
    tf('Flying from high pressure to low pressure without resetting the altimeter, the aircraft is lower than indicated.', true, '"High to low, look out below."'),
    num('On the standard setting the altimeter shows 8,500 ft. Which flight level is this?', 85, 0.1, 'FL', 'FL = 8,500 ÷ 100 = FL 85.'),
  ],
  assessment: [
    mcq('Which setting makes the altimeter show altitude above mean sea level?', ['QNH', 'QFE', '1,013.25 hPa', 'QDM'], 'QNH is the pressure reduced to mean sea level.'),
    mcq('Flight levels are based on which setting?', ['1,013.25 hPa', 'QNH', 'QFE', 'The local temperature'], 'Flight levels use the standard pressure setting so all aircraft share the same reference.'),
    num('Subscale 1,020 hPa, actual QNH 1,010 hPa. Approximate altimeter error in feet (27 ft per hPa)?', 270, 35, 'ft', '10 hPa × 27 ft ≈ 270 ft.'),
    mcq('In the situation above, the aircraft is:', ['Lower than indicated', 'Higher than indicated', 'Exactly as indicated', 'At a flight level'], 'Actual pressure is lower than the setting, so the altimeter over-reads.'),
    tf('An altimeter measures the distance to the ground directly.', false, 'A pressure altimeter senses static pressure only. It knows nothing about terrain.'),
    scenario(mcq('You depart with QNH 1,015 set and fly 100 NM to an airfield reporting QNH 1,005. You forget to reset. On final approach your altimeter reads 1,000 ft. Your true altitude is approximately:', ['730 ft', '1,270 ft', '1,000 ft', '1,500 ft'], '10 hPa × 27 ft = 270 ft. Lower pressure than set means you are lower: about 730 ft.')),
  ],
  missionId: 'm-ppl-altimetry', sources: ['phak', 'icao-8168', 'easa-fcl'],
});

const massBalance = lesson('Flight performance and planning', {
  id: 'ppl-mb', title: 'Mass and Balance Basics', minutes: 14, level: 2, prereqs: ['phys-weight'],
  objectives: ['Define arm, moment and centre of gravity.', 'Calculate a centre-of-gravity position from a loading table.', 'Explain the effects of a forward or aft centre of gravity.'],
  intro: 'An aircraft can be within its maximum mass and still be unsafe to fly, because where the load sits matters as much as how heavy it is.',
  simple: 'Every item in the aircraft has a mass and a distance from a reference point, called the arm. Mass times arm is the moment. Add all the moments, divide by the total mass, and you get the centre of gravity. It must lie between the forward and aft limits.',
  sections: [
    { h: 'Three definitions', body: [
      'The **datum** is a reference line chosen by the manufacturer. The **arm** is the horizontal distance of an item from the datum.',
      '**Moment = mass × arm.** It measures the turning effect of the item about the datum.',
      'The **centre of gravity (CG)** is the point through which the total weight acts: `CG = total moment ÷ total mass`.',
    ], formula: 'cg' },
    { h: 'Limits', body: [
      'The flight manual gives a **maximum take-off mass** and **forward and aft CG limits**. Together they form the loading envelope. The loaded aircraft must stay inside the envelope for the whole flight, including after fuel is burned.',
      'Try loading the training aircraft below. It uses fictional data for teaching only.',
    ], lab: 'massbalance', note: 'Always use the mass and balance data of the actual aircraft from its approved flight manual. Numbers in this lesson are fictional.' },
    { h: 'Why CG position matters', body: [
      '**CG too far forward:** the tail must push down harder. The aircraft is very stable but heavy to rotate and flare, stall speed is slightly higher and drag increases.',
      '**CG too far aft:** stability decreases, control forces become light, and recovery from a stall or spin may be difficult or impossible.',
      '**Overweight:** longer take-off run, poorer climb, higher stall speed and possible structural damage.',
    ] },
  ],
  examples: [
    { title: 'Finding the CG', steps: ['Empty aircraft 700 kg at 2.40 m → moment 1,680 kg·m.', 'Pilot and passenger 160 kg at 2.30 m → 368 kg·m. Baggage 60 kg at 3.50 m → 210 kg·m.', 'Total mass = 920 kg. Total moment = 2,258 kg·m.', 'CG = 2,258 ÷ 920 = 2.454 m aft of the datum.'] },
  ],
  practice: [
    num('An 80 kg passenger sits at an arm of 2.5 m. Moment?', 200, 0.5, 'kg·m', '80 × 2.5 = 200 kg·m.'),
    num('Total moment 2,258 kg·m, total mass 920 kg. CG position?', 2.454, 0.01, 'm', '2,258 ÷ 920 = 2.454 m.'),
    mcq('Loading heavy baggage in the rear compartment moves the CG:', ['Aft', 'Forward', 'Upward only', 'Nowhere'], 'Mass added behind the current CG moves it aft.'),
    mcq('The most dangerous effect of a CG behind the aft limit is:', ['Reduced stability and difficult stall or spin recovery', 'Heavier control forces', 'Higher fuel consumption', 'A longer landing roll'], 'An aft CG reduces longitudinal stability.'),
    tf('An aircraft below its maximum take-off mass is always safely loaded.', false, 'The CG must also be within its limits.'),
  ],
  assessment: [
    num('Fuel of 100 kg is at an arm of 2.4 m. Moment?', 240, 0.5, 'kg·m', '100 × 2.4 = 240 kg·m.'),
    num('Masses: 600 kg at 2.0 m and 200 kg at 3.0 m. CG position?', 2.25, 0.01, 'm', 'Moments 1,200 + 600 = 1,800. Mass 800. CG = 2.25 m.'),
    mcq('CG is calculated as:', ['Total moment ÷ total mass', 'Total mass ÷ total moment', 'Total mass × total arm', 'Arm ÷ mass'], 'CG = Σ moments ÷ Σ masses.'),
    mcq('A CG at the forward limit generally causes:', ['Higher stall speed and heavier elevator forces', 'Lower stall speed and lighter forces', 'Reduced stability', 'No change'], 'The tail must produce more downforce, which the wing must also carry.'),
    tf('As fuel burns, the CG may move, so it must be checked for both take-off and landing.', true, 'Unless the fuel tanks are exactly at the CG, burning fuel shifts it.'),
    scenario(mcq('Your calculation shows the CG slightly behind the aft limit with four people and full baggage. The correct action is to:', ['Reduce or move the load until the CG is within limits', 'Depart and trim nose-down', 'Depart with extra speed', 'Add more fuel to increase mass'], 'The aircraft must be inside its approved envelope before flight. No piloting technique compensates for an out-of-limits CG.')),
  ],
  missionId: 'm-ppl-mb', sources: ['phak', 'faa-wb'],
});

export const pplTrack: Track = {
  id: 'ppl', title: 'Private Pilot Licence', short: 'PPL', color: '#f58220',
  blurb: 'From your first look at an aircraft to full PPL theory and exam practice.',
  note: 'Subject list follows the nine EASA PPL(A) theoretical knowledge subjects (Part-FCL, AMC1 FCL.210/215). The FAA Private Pilot knowledge areas (14 CFR §61.105) cover similar material in a single knowledge test. ICAO Annex 1 sets the international minimum standard; each State publishes its own syllabus.',
  modules: [
    { id: 'ppl-a-intro', phase: 'Phase A — Before Flight School', title: 'Introduction to Aviation', lessons: [introAviation, identification, terminology, components, cockpit, safetyCulture] },
    { id: 'ppl-a-science', phase: 'Phase A — Before Flight School', title: 'Science for Pilots (from the Pre-Flight Academy)', lessons: [pick(mathTrack, 'math-units'), pick(mathTrack, 'math-dst'), pick(physicsTrack, 'phys-pressure'), pick(physicsTrack, 'phys-lift')] },
    { id: 'ppl-a-pof', phase: 'Phase A — Before Flight School', title: 'How Aircraft Fly', lessons: [controls, forces, basicAero, stability, instrumentsIntro, basicMet, basicNav, commsIntro, planningIntro] },
    { id: 'ppl-b-law', phase: 'Phase B — PPL Theory and Exam Preparation', code: '010', title: 'Air Law', lessons: [rules, airspace, licensing, aerodromeMarkings] },
    { id: 'ppl-b-hp', phase: 'Phase B — PPL Theory and Exam Preparation', code: '040', title: 'Human Performance and Limitations', lessons: [hypoxia, vision, fitness, decisionMaking] },
    { id: 'ppl-b-met', phase: 'Phase B — PPL Theory and Exam Preparation', code: '050', title: 'Meteorology', lessons: [clouds, fog, storms, metar, atmosphereDepth, fronts, windTurbulence] },
    { id: 'ppl-b-com', phase: 'Phase B — PPL Theory and Exam Preparation', code: '090', title: 'Communications', lessons: [rtBasics, phraseology, distressUrgency] },
    { id: 'ppl-b-pof', phase: 'Phase B — PPL Theory and Exam Preparation', code: '080', title: 'Principles of Flight', lessons: [polar, stalling, propellers] },
    { id: 'ppl-b-ops', phase: 'Phase B — PPL Theory and Exam Preparation', code: '070', title: 'Operational Procedures', lessons: [wake, emergencies, preflight, fire] },
    { id: 'ppl-b-fpp', phase: 'Phase B — PPL Theory and Exam Preparation', code: '030', title: 'Flight Performance and Planning', lessons: [massBalance, takeoffLanding, fuelPlanning, vfrPlanning] },
    { id: 'ppl-b-agk', phase: 'Phase B — PPL Theory and Exam Preparation', code: '020', title: 'Aircraft General Knowledge', lessons: [altimetry, airframe, pistonEngines, fuelElectrical, pitotStatic, gyroInstruments] },
    { id: 'ppl-b-nav', phase: 'Phase B — PPL Theory and Exam Preparation', code: '060', title: 'Navigation', lessons: [charts, compass, deadReckoning, radioNav, gnss] },
  ],
};

/* ------------------------------------------------------------------ CPL */

const windCorrection = lesson('Navigation', {
  id: 'cpl-wind', title: 'Wind Correction Angle and Groundspeed', minutes: 15, level: 3, prereqs: ['math-vectors', 'math-trig'],
  objectives: ['Resolve a wind into head/tail and crosswind components relative to track.', 'Calculate wind correction angle and groundspeed.', 'Estimate drift quickly with the maximum-drift rule.'],
  intro: 'Prerequisite review: a vector has size and direction, and sin/cos split a vector into two perpendicular parts. Now we apply both to the navigation problem every commercial pilot solves on every leg.',
  simple: 'Split the wind into the part blowing across your track and the part blowing along it. The across part decides how far you must point the nose into the wind. The along part changes your speed over the ground.',
  sections: [
    { h: 'Resolve the wind', body: [
      'Let the **wind angle** be the angle between the direction the wind comes from and your desired track.',
      '`crosswind = wind speed × sin(wind angle)` and `headwind = wind speed × cos(wind angle)`. A negative headwind is a tailwind.',
    ], formula: 'crosswind' },
    { h: 'Wind correction angle (WCA)', body: [
      'To stay on track, the crosswind must be cancelled by pointing the nose into the wind: `sin(WCA) = crosswind ÷ TAS`.',
      'Heading = track ± WCA (toward the wind).',
    ], formula: 'wca', lab: 'wind' },
    { h: 'Groundspeed', body: [
      '`GS = TAS × cos(WCA) − headwind component`.',
      'For small correction angles cos(WCA) is close to 1, so GS ≈ TAS − headwind.',
    ] },
    { h: 'A mental shortcut', body: [
      '**Maximum drift** ≈ `wind speed × 60 ÷ TAS` degrees. This is the correction needed if the wind were fully across the track.',
      'Then scale it by the sine of the wind angle: roughly 0.5 at 30°, 0.7 at 45°, 0.9 at 60°, 1 at 90°.',
    ], note: 'The shortcut uses the 1-in-60 approximation and is accurate to about a degree for correction angles below roughly 20°.' },
  ],
  examples: [
    { title: 'Full solution', steps: ['Track 090°, TAS 120 kt, wind 360°/30 kt (from the north).', 'Wind angle = 90°. Crosswind = 30 kt, headwind = 0.', 'sin(WCA) = 30 ÷ 120 = 0.25 → WCA ≈ 14.5°. Wind from the left, so heading = 090 − 14.5 ≈ 075°.', 'GS = 120 × cos 14.5° ≈ 116 kt.'] },
    { title: 'Mental estimate', steps: ['TAS 120 kt, wind 20 kt at 30° to the track.', 'Maximum drift = 20 × 60 ÷ 120 = 10°.', 'Scale by sin 30° = 0.5 → WCA ≈ 5°.'] },
  ],
  practice: [
    num('TAS 120 kt, crosswind component 30 kt. WCA in degrees?', 14.5, 0.6, '°', 'asin(30 ÷ 120) = asin(0.25) ≈ 14.5°.'),
    num('Wind 20 kt at 60° to the track. Headwind component?', 10, 0.4, 'kt', '20 × cos 60° = 10 kt.'),
    num('TAS 100 kt, wind 20 kt. Maximum drift by the rule of thumb?', 12, 0.5, '°', '20 × 60 ÷ 100 = 12°.'),
    mcq('The wind is from the right of your track. Your heading compared with the track must be:', ['Greater (nose turned right, into the wind)', 'Smaller (nose turned left)', 'The same', 'Reversed'], 'Turn the nose into the wind. Turning right increases the heading value.'),
    num('TAS 120 kt, WCA 14.5°, no headwind component. Groundspeed?', 116.2, 1, 'kt', '120 × cos 14.5° ≈ 116.2 kt.'),
  ],
  assessment: [
    num('TAS 150 kt, crosswind component 26 kt. WCA in degrees?', 10, 0.5, '°', 'asin(26 ÷ 150) = asin(0.173) ≈ 10°.'),
    num('Wind 40 kt at 30° to the track. Crosswind component?', 20, 0.5, 'kt', '40 × sin 30° = 20 kt.'),
    num('TAS 140 kt, headwind component 25 kt, small WCA. Approximate groundspeed?', 115, 2, 'kt', 'GS ≈ 140 − 25 = 115 kt.'),
    num('TAS 180 kt, wind 30 kt. Maximum drift by the rule of thumb?', 10, 0.5, '°', '30 × 60 ÷ 180 = 10°.'),
    mcq('Track 270°, wind from 360°. To hold the track the heading must be:', ['Greater than 270°', 'Less than 270°', 'Exactly 270°', '090°'], 'Flying west, a wind from the north is from the right. Turn right, into the wind: heading greater than 270°.'),
    tf('A pure headwind requires a wind correction angle.', false, 'With no crosswind component there is no drift. Only groundspeed changes.'),
  ],
  missionId: 'm-cpl-wind', sources: ['phak', 'easa-fcl'],
});

export const cplTrack: Track = {
  id: 'cpl', title: 'Commercial Pilot Licence', short: 'CPL', color: '#7a5af5',
  blurb: 'Advanced theory for commercial operations, built on your PPL knowledge.',
  note: 'CPL theoretical knowledge requirements differ by authority. EASA CPL(A) follows the learning objectives published with Part-FCL (AMC1 FCL.310); the FAA Commercial Pilot knowledge areas are in 14 CFR §61.125. Each lesson begins with a short prerequisite review.',
  modules: [
    { id: 'cpl-nav', title: 'Advanced Navigation', lessons: [windCorrection, oneInSixtyPractice, greatCircles, vorDmeIls, pbn] },
    { id: 'cpl-aero', title: 'Advanced Aerodynamics', lessons: [polars, stabilityControl, highLift, asymmetric] },
    { id: 'cpl-perf', title: 'Aircraft Performance and Limitations', lessons: [takeoffPerf, climbCruise, landingPerf, perfLimits] },
    { id: 'cpl-plan', title: 'Flight and Fuel Planning', lessons: [commercialFuel, planningMonitoring, massBalanceLarge] },
    { id: 'cpl-met', title: 'Advanced Meteorology', lessons: [jetStreams, icingDepth, sigwx, wxDecisions] },
    { id: 'cpl-systems', title: 'Aircraft Systems and Powerplants', lessons: [powerplants, electricalSystems, hydraulics, efis, pressurisation] },
    { id: 'cpl-human', title: 'Human Performance and Crew Communication', lessons: [commercialHp, crewComms, riskManagement, emergencyDecisions] },
    { id: 'cpl-ops', title: 'Air Law and Commercial Operations', lessons: [commercialLaw, opsProcedures, commercialOps] },
  ],
};

/* ----------------------------------------------------------------- ATPL */

const mach = lesson('Principles of flight', {
  id: 'atpl-mach', title: 'Speed of Sound and Mach Number', minutes: 15, level: 3, prereqs: ['phys-atmos'],
  objectives: ['State what determines the local speed of sound.', 'Calculate Mach number from true airspeed.', 'Explain how TAS changes in a constant-Mach climb.', 'Define critical Mach number.'],
  intro: 'Prerequisite review: in the ISA, temperature falls about 2 °C per 1,000 ft to −56.5 °C near 36,000 ft. Jet aircraft cruise where this cold air sets an invisible speed limit — the speed of sound.',
  simple: 'Sound travels more slowly in cold air. Mach number is your true airspeed divided by the local speed of sound. High up, where it is cold, the same Mach number means a lower true airspeed. Airliners cruise a little below the speed at which airflow over the wing first becomes supersonic.',
  sections: [
    { h: 'The local speed of sound', body: [
      'For air treated as an ideal gas, the speed of sound depends **only on absolute temperature**: `a = √(γ R T)`.',
      'In practical units: `a (kt) ≈ 38.94 × √T(K)`, where T(K) = °C + 273.15.',
      'At ISA sea level (288.15 K) a ≈ 661 kt. At the tropopause (216.65 K) a ≈ 573 kt.',
    ], formula: 'lss', lab: 'formula:lss' },
    { h: 'Mach number', body: [
      '`M = TAS ÷ a`. Mach 0.78 means the aircraft is flying at 78% of the local speed of sound.',
      'Pressure and density do not appear in the formula. Only temperature changes the speed of sound.',
    ], formula: 'mach' },
    { h: 'Climbing at constant Mach', body: [
      'In a climb through the troposphere the air gets colder, so the local speed of sound falls. At a constant Mach number, **TAS therefore decreases** as the aircraft climbs, until the tropopause, above which ISA temperature is constant.',
      'Airliners typically climb at a constant indicated airspeed and then, at the **crossover altitude**, continue at a constant Mach number.',
    ] },
    { h: 'Critical Mach number', body: [
      'Air accelerates over the upper surface of a wing. The **critical Mach number (Mcrit)** is the free-stream Mach number at which the local flow somewhere on the aircraft first reaches Mach 1.',
      'Above Mcrit, shock waves form, drag rises steeply and the centre of pressure moves. Swept wings and supercritical aerofoils delay these effects.',
    ], note: 'At high altitude the margin between low-speed buffet (stall) and high-speed buffet narrows. This simplified lesson introduces the idea; aircraft-specific buffet margins come from the approved flight manual.' },
  ],
  examples: [
    { title: 'Speed of sound at the tropopause', steps: ['T = −56.5 °C = 216.65 K.', '√216.65 ≈ 14.72.', 'a ≈ 38.94 × 14.72 ≈ 573 kt.'] },
    { title: 'Mach number in cruise', steps: ['TAS 450 kt at a level where a = 573 kt.', 'M = 450 ÷ 573.', 'M ≈ 0.785.'] },
  ],
  practice: [
    num('Temperature 216.65 K. Local speed of sound in knots (a = 38.94 √T)?', 573, 3, 'kt', '38.94 × √216.65 ≈ 573 kt.'),
    num('TAS 450 kt, local speed of sound 573 kt. Mach number?', 0.785, 0.01, 'M', '450 ÷ 573 ≈ 0.785.'),
    num('Mach 0.80 where the local speed of sound is 580 kt. TAS?', 464, 2, 'kt', '0.80 × 580 = 464 kt.'),
    tf('For a given temperature, the speed of sound is the same at any pressure altitude.', true, 'In an ideal gas the speed of sound depends only on temperature.'),
    mcq('During a constant-Mach climb in the troposphere, TAS:', ['Decreases', 'Increases', 'Stays constant', 'Becomes equal to IAS'], 'Temperature falls, the speed of sound falls, so TAS at a fixed Mach number falls.'),
  ],
  assessment: [
    num('Temperature 288.15 K. Local speed of sound in knots?', 661, 3, 'kt', '38.94 × √288.15 ≈ 661 kt.'),
    num('TAS 480 kt, local speed of sound 600 kt. Mach number?', 0.8, 0.008, 'M', '480 ÷ 600 = 0.80.'),
    num('Mach 0.75 where the local speed of sound is 588 kt. TAS?', 441, 2, 'kt', '0.75 × 588 = 441 kt.'),
    mcq('The local speed of sound depends on:', ['Air temperature only', 'Air pressure only', 'Air density only', 'Altitude regardless of temperature'], 'a = √(γRT).'),
    mcq('Critical Mach number is the free-stream Mach number at which:', ['Local airflow somewhere on the aircraft first reaches Mach 1', 'The whole aircraft is supersonic', 'The engines reach maximum thrust', 'The aircraft stalls'], 'Local flow over curved surfaces is faster than the free stream.'),
    tf('Above the tropopause in the ISA, the speed of sound continues to decrease with altitude.', false, 'ISA temperature is constant in the lower stratosphere, so the speed of sound is constant too.'),
  ],
  missionId: 'm-atpl-mach', sources: ['icao-7488', 'easa-fcl'],
});

export const atplTrack: Track = {
  id: 'atpl', title: 'Airline Transport Pilot Licence', short: 'ATPL', color: '#0b2545',
  blurb: 'The most advanced theory pathway: high-altitude flight, jet systems and airline operations.',
  note: 'Required syllabus modules follow the EASA ATPL(A) theoretical knowledge subjects (subject codes shown). FAA ATP knowledge requirements are set out in 14 CFR §61.155 and are structured differently. Modules marked Supplementary are useful airline-training topics, not licensing syllabus material.',
  modules: [
    { id: 'atpl-010', code: '010', title: 'Air Law', lessons: planned('atpl', ['International Conventions and ICAO', 'Rules of the Air and ATS', 'Aerodromes and Search and Rescue']) },
    { id: 'atpl-021', code: '021', title: 'Aircraft General Knowledge — Airframe, Systems, Powerplant', lessons: [hydGear, flightControls, pneumatics, gasTurbines, electricsFuel] },
    { id: 'atpl-022', code: '022', title: 'Aircraft General Knowledge — Instrumentation', lessons: [airData, inertial, autoflight, fms] },
    { id: 'atpl-031', code: '031', title: 'Mass and Balance', lessons: [loadingCg, loadSheets] },
    { id: 'atpl-032', code: '032', title: 'Performance', lessons: [classA, vSpeeds, enrouteLanding] },
    { id: 'atpl-033', code: '033', title: 'Flight Planning and Monitoring', lessons: [jetFuel, ifrPlans, petPsr] },
    { id: 'atpl-040', code: '040', title: 'Human Performance and Limitations', lessons: [altitudePhysiology, sleep, humanError] },
    { id: 'atpl-050', code: '050', title: 'Meteorology', lessons: [circulation, catLesson, tropical, highAltHazards] },
    { id: 'atpl-061', code: '061', title: 'General Navigation', lessons: planned('atpl', ['The Earth and Time', 'Charts for Long-Range Navigation', 'Inertial and Grid Navigation']) },
    { id: 'atpl-062', code: '062', title: 'Radio Navigation', lessons: planned('atpl', ['Radio Wave Propagation', 'ILS, MLS and GLS', 'GNSS and PBN', 'Radar and TCAS']) },
    { id: 'atpl-070', code: '070', title: 'Operational Procedures', lessons: planned('atpl', ['Operator Requirements', 'Long-Range and ETOPS Concepts', 'Special Procedures and Hazards']) },
    { id: 'atpl-081', code: '081', title: 'Principles of Flight', lessons: [mach, shockWaves, sweptWings, machTuck, buffetMargins] },
    { id: 'atpl-090', code: '090', title: 'Communications', lessons: planned('atpl', ['IFR Communications', 'Communication Failure Procedures']) },
    { id: 'atpl-sup', supplementary: true, title: 'Supplementary Airline Topics', lessons: planned('atpl', ['Threat and Error Management', 'Crew Resource Management', 'Multi-Crew Cooperation Concepts', 'Airline Operational Concepts', 'Advanced Decision-Making']) },
  ],
};
