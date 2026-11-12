// ATPL — Instrumentation 022 (4 lessons).
// Written from memory of standard references; not verified against current documents.
import { lesson, mcq, num, tf } from './q';

export const airData = lesson('Instrumentation', {
  id: 'atpl-air-data-computers', title: 'Air Data Computers', minutes: 13, level: 3, prereqs: ['cpl-flight-instruments-and-efis', 'atpl-mach'],
  objectives: ['List the inputs and outputs of an air data computer.', 'Distinguish total from static air temperature.', 'Calculate static air temperature from total air temperature and Mach number.', 'Describe the effect of blocked probes on a modern aircraft.'],
  intro: 'Prerequisite review: an air data computer turns pitot pressure, static pressure and temperature into airspeed, altitude, Mach number and true airspeed. At jet speeds one of those inputs, temperature, cannot even be measured directly, and the correction is part of every performance calculation.',
  simple: 'A thermometer on a fast aircraft reads too warm, because the air is squeezed and heated as it is brought to rest on the probe. The air data computer works back from that reading to the real outside temperature, using the Mach number.',
  sections: [
    { h: 'Inputs and outputs', body: [
      'Inputs: **total pressure** from the pitot probes, **static pressure** from the static ports, **total air temperature** from a probe, and **angle of attack** from vanes.',
      'Outputs: indicated and calibrated airspeed, **Mach number**, **true airspeed**, pressure altitude, vertical speed and **static air temperature**. Corrections for position error are applied automatically.',
    ] },
    { h: 'Total and static temperature', body: [
      '**Static air temperature** (SAT) is the temperature of the undisturbed air. **Total air temperature** (TAT) is what the probe senses: SAT plus the **ram rise** from bringing the air to rest.',
      '`SAT = TAT ÷ (1 + 0.2 × M²)`, with temperatures in kelvin. At Mach 0.80 the factor is 1.128: a TAT of −25 °C (248.15 K) corresponds to a SAT of about −53 °C.',
      'The difference is large at cruise Mach numbers, about 30 °C, and zero when stationary.',
    ], formula: 'sat-tat', lab: 'formula:sat-tat' },
    { h: 'Redundancy', body: [
      'Transport aircraft have at least two, usually three, independent air data sources, each with its own probes. The displays can be switched to an alternative source, and standby instruments have their own.',
    ] },
    { h: 'Unreliable airspeed', body: [
      'If probes are blocked, by ice or otherwise, the computed speeds and altitudes may be wrong and may disagree with each other, sometimes with misleading stall or overspeed warnings.',
      'The response is the same as in a light aircraft, with more at stake: fly a known **pitch attitude and thrust setting**, and then work out which source is reliable.',
    ], note: 'The formula assumes a probe recovery factor of 1. Real probes recover slightly less, and the aircraft\'s own data is used in practice.' },
  ],
  examples: [
    { title: 'SAT from TAT', steps: ['TAT is −10 °C (263.15 K) at Mach 0.70.', '1 + 0.2 × 0.49 = 1.098.', 'SAT = 263.15 ÷ 1.098 ≈ 239.7 K, which is about −33.5 °C.'] },
    { title: 'Disagreeing speeds', steps: ['In icing, the two airspeed displays suddenly differ by 40 kt.', 'One or both sources are unreliable.', 'Set the memory pitch and thrust, then cross-check with the standby and the checklist.'] },
  ],
  practice: [
    num('TAT is 263.15 K at Mach 0.70. SAT in kelvin (TAT ÷ (1 + 0.2 × M²))?', 239.7, 0.5, 'K', '263.15 ÷ 1.098 ≈ 239.7 K.'),
    mcq('Total air temperature is higher than static air temperature because of:', ['The ram rise as air is brought to rest on the probe', 'Engine heat', 'Cabin heating', 'Solar radiation only'], 'Kinetic energy becomes heat.'),
    mcq('Which of these is an output of an air data computer?', ['Mach number', 'Fuel quantity', 'Cabin temperature', 'Engine oil pressure'], 'Also airspeed, altitude and true airspeed.'),
    mcq('The angle of attack input comes from:', ['Vanes on the fuselage', 'The pitot tube', 'The static port', 'The fuel probes'], 'They align with the local airflow.'),
    tf('When the aircraft is stationary, total and static air temperature are the same.', true, 'There is no ram rise at zero speed.'),
  ],
  assessment: [
    num('TAT is 248.15 K at Mach 0.80. SAT in kelvin (TAT ÷ (1 + 0.2 × M²))?', 220, 0.5, 'K', '248.15 ÷ 1.128 ≈ 220.0 K.'),
    num('What is the value of the factor (1 + 0.2 × M²) at Mach 0.80?', 1.128, 0.002, '', '1 + 0.2 × 0.64 = 1.128.'),
    mcq('Static air temperature is:', ['The temperature of the undisturbed outside air', 'The temperature measured directly by the probe', 'The cabin temperature', 'The exhaust temperature'], 'It is computed from TAT and Mach number.'),
    mcq('The pressure sensed by a pitot probe is:', ['Total pressure', 'Static pressure only', 'Cabin pressure', 'Hydraulic pressure'], 'Static plus dynamic pressure.'),
    mcq('Transport aircraft carry several independent air data sources so that:', ['A single probe or computer failure does not remove all air data', 'The aircraft is heavier', 'Fuel flow is reduced', 'The cabin is quieter'], 'Sources can be compared and switched.'),
    mcq('With unreliable airspeed indications, the crew should first:', ['Fly a known pitch attitude and thrust setting', 'Trust the highest reading', 'Descend at maximum rate', 'Switch off all displays'], 'Then identify the reliable source.'),
    tf('At cruise Mach numbers the difference between TAT and SAT is only one or two degrees.', false, 'It is about 30 °C.'),
  ],
  missionId: 'm-atpl-adc', sources: ['phak'],
});

export const inertial = lesson('Instrumentation', {
  id: 'atpl-inertial-reference-systems', title: 'Inertial Reference Systems', minutes: 13, level: 3, prereqs: ['atpl-air-data-computers', 'ppl-gyroscopic-instruments'],
  objectives: ['Explain how an inertial system finds position.', 'Describe alignment.', 'Calculate position error from drift rate and time.', 'Describe how inertial and satellite data are combined.'],
  intro: 'Prerequisite review: attitude and heading on a glass cockpit come from solid-state sensors, not spinning gyros, and satellite navigation can be lost to interference. An inertial system needs no signal from outside the aircraft at all, which is why long-range aircraft still carry three of them.',
  simple: 'An inertial system feels every acceleration and every rotation of the aircraft. Starting from a known point, it adds up all those movements to work out where the aircraft is now. Small errors add up too, so its position slowly drifts.',
  sections: [
    { h: 'Principle', body: [
      '**Accelerometers** measure acceleration along three axes; **gyros**, usually ring laser gyros, measure rotation about them. Integrating acceleration once gives **velocity**; integrating again gives **position**.',
      'The system is entirely self-contained: it needs no external signal and cannot be jammed.',
      'It provides attitude, true heading, groundspeed, track and position. With true airspeed from the air data computer, it also gives the **wind**.',
    ] },
    { h: 'Alignment', body: [
      'Before flight the system must be **aligned**: it finds the vertical from gravity and true north from the Earth\'s rotation. The aircraft must be **stationary**, and the crew enters the present position. Alignment typically takes several minutes and longer at high latitudes.',
    ] },
    { h: 'Errors', body: [
      'Small sensor errors accumulate with time: the position **drifts**. `position error ≈ drift rate × time`. At 2 NM per hour, the error after 3 hours is about 6 NM.',
      'Errors also oscillate with the **Schuler period** of about **84.4 minutes**.',
    ], formula: 'irs-drift', lab: 'formula:irs-drift' },
    { h: 'Hybrid navigation', body: [
      'In practice inertial data is blended with **GNSS** (and DME/DME) in the flight management system. GNSS corrects the long-term drift; the inertial system gives smooth, continuous data and carries on if GNSS is lost.',
    ], note: 'Alignment times and drift limits are type-specific. The 2 NM per hour figure is a commonly quoted limit, from memory.' },
  ],
  examples: [
    { title: 'Drift', steps: ['An inertial system drifts at 1.5 NM per hour.', 'After 6 hours without updating: 1.5 × 6.', 'Position error is about 9 NM.'] },
    { title: 'GNSS lost', steps: ['Over an area of interference, GNSS position is lost.', 'The flight management system continues on inertial data.', 'Position slowly drifts until another update source is available.'] },
  ],
  practice: [
    num('An inertial system drifts at 1.5 NM per hour. Position error after 6 hours?', 9, 0.05, 'NM', '1.5 × 6 = 9 NM.'),
    mcq('An inertial reference system measures:', ['Accelerations and rotations of the aircraft', 'Radio signals from satellites', 'Air pressure', 'Fuel flow'], 'With accelerometers and gyros.'),
    mcq('Integrating acceleration once gives:', ['Velocity', 'Position', 'Altitude only', 'Temperature'], 'Integrating again gives position.'),
    mcq('During alignment, the aircraft must be:', ['Stationary', 'Taxiing', 'Airborne', 'Being towed at speed'], 'The system needs to sense only gravity and the Earth\'s rotation.'),
    tf('An inertial system needs signals from ground stations to work.', false, 'It is entirely self-contained.'),
  ],
  assessment: [
    num('An inertial system drifts at 2 NM per hour. Position error after 3 hours?', 6, 0.05, 'NM', '2 × 3 = 6 NM.'),
    num('What is the Schuler period, in minutes?', 84.4, 0.5, 'min', 'About 84.4 minutes.'),
    mcq('Integrating acceleration twice gives:', ['Position', 'Velocity', 'Heading', 'Wind'], 'From a known starting point.'),
    mcq('An inertial system finds true north during alignment by sensing:', ['The Earth\'s rotation', 'The magnetic field', 'A radio beacon', 'The Sun'], 'It does not use a magnetic compass.'),
    mcq('Wind is computed by combining inertial groundspeed and track with:', ['True airspeed and heading', 'Fuel flow', 'Cabin altitude', 'Outside temperature only'], 'The difference between the air vector and the ground vector is the wind.'),
    mcq('In a hybrid system, GNSS is used to:', ['Correct the long-term drift of the inertial position', 'Replace the accelerometers', 'Power the gyros', 'Measure the wind directly'], 'The inertial system provides continuity.'),
    tf('The position error of an unaided inertial system tends to grow with time.', true, 'Sensor errors accumulate.'),
  ],
  missionId: 'm-atpl-irs', sources: ['phak'],
});

export const autoflight = lesson('Instrumentation', {
  id: 'atpl-autoflight-and-flight-directors', title: 'Autoflight and Flight Directors', minutes: 13, level: 3, prereqs: ['cpl-flight-instruments-and-efis'],
  objectives: ['Distinguish the flight director, autopilot and autothrust.', 'Name the main lateral and vertical modes.', 'Distinguish armed from engaged modes.', 'Distinguish fail-passive from fail-operational autoland.'],
  intro: 'Prerequisite review: the flight mode annunciator is the only reliable statement of what the automation is doing, and a selected button is only an intention. Airline flying is largely the management of automation, and almost every automation accident began with a crew that believed one mode was engaged when another was.',
  simple: 'The flight director shows where to point the aircraft. The autopilot moves the controls to follow it. The autothrust moves the thrust. Each works in named modes, and the crew must always know which modes are active and which are only waiting.',
  sections: [
    { h: 'Three systems', body: [
      'The **flight director** computes the pitch and roll needed and displays them as command bars; the pilot may fly them by hand. The **autopilot** flies those commands through servos. The **autothrust** (autothrottle) controls engine thrust.',
    ], lab: 'explore:autoflight' },
    { h: 'Modes', body: [
      '**Lateral** modes include heading select, lateral navigation along the flight plan, and localiser capture. **Vertical** modes include altitude hold, vertical speed, level change (climb or descend at a speed), vertical navigation and glide slope. **Thrust** modes hold either a speed or a thrust setting.',
      'One of pitch or thrust controls speed, and the other controls the flight path. Knowing which is doing which at any moment is the key to understanding a mode.',
    ] },
    { h: 'Armed and engaged', body: [
      'An **engaged** (active) mode is controlling the aircraft now. An **armed** mode is waiting for a condition, such as intercepting the localiser, and is shown differently on the annunciator.',
      'A **mode reversion** is an automatic change of mode, for example when a protection activates. Every change is read aloud and confirmed.',
    ] },
    { h: 'Autoland', body: [
      'For automatic landing in low visibility, the system must tolerate failures. A **fail-passive** system, after a failure, leaves the aircraft in trim with no significant deviation, but the automatic landing cannot be completed. A **fail-operational** system can complete the landing automatically after a single failure.',
    ], note: 'Mode names and logic differ between manufacturers. Type training covers the system fitted, and low-visibility operations require specific approval.' },
  ],
  examples: [
    { title: 'Who controls speed?', steps: ['In a level-change climb, thrust is fixed at climb power.', 'Speed must therefore be controlled by pitch.', 'If the aircraft is levelled manually without changing mode, speed will increase.'] },
    { title: 'Armed, not engaged', steps: ['Approach is selected; localiser and glide slope show as armed.', 'The aircraft is still in heading and altitude hold.', 'Watch for each to change to engaged as the beams are captured, and call it.'] },
  ],
  practice: [
    mcq('The flight director:', ['Displays the pitch and roll commands to be flown', 'Moves the control surfaces', 'Controls engine thrust', 'Lowers the landing gear'], 'It can be followed by hand or by the autopilot.'),
    mcq('The autothrust controls:', ['Engine thrust', 'The ailerons', 'The cabin pressure', 'The navigation database'], 'It holds a speed or a thrust setting.'),
    mcq('Heading select is a:', ['Lateral mode', 'Vertical mode', 'Thrust mode', 'Braking mode'], 'It controls the roll axis.'),
    mcq('An armed mode is one that:', ['Is waiting for a condition before it engages', 'Is controlling the aircraft now', 'Has failed', 'Cannot be cancelled'], 'It is shown differently from engaged modes.'),
    tf('Pressing a mode button is sufficient confirmation that the mode is engaged.', false, 'Only the flight mode annunciator shows what is engaged.'),
  ],
  assessment: [
    mcq('The autopilot:', ['Flies the flight director commands through servos', 'Only displays commands', 'Controls only thrust', 'Replaces the flight management system'], 'It moves the control surfaces.'),
    mcq('Altitude hold is a:', ['Vertical mode', 'Lateral mode', 'Thrust mode', 'Navigation database'], 'It controls the pitch axis.'),
    mcq('An engaged mode is one that:', ['Is controlling the aircraft now', 'Is waiting to capture', 'Has been deselected', 'Applies only on the ground'], 'Also called active.'),
    mcq('In a climb with thrust fixed at climb power, speed is controlled by:', ['Pitch', 'Thrust', 'Rudder', 'Flaps'], 'One of pitch or thrust controls speed; the other controls the path.'),
    mcq('A mode reversion is:', ['An automatic change of mode', 'A reversal of the engines', 'A return to the gate', 'A manual disconnect'], 'It must be noticed and called.'),
    mcq('A fail-operational autoland system, after a single failure, can:', ['Complete the landing automatically', 'Only disconnect', 'Not be used at all', 'Only fly level'], 'A fail-passive system cannot complete it automatically.'),
    tf('A fail-passive autoland system leaves the aircraft in trim after a failure.', true, 'But the automatic landing cannot be completed.'),
  ],
  missionId: 'm-atpl-autoflight', sources: ['phak'],
});

export const fms = lesson('Instrumentation', {
  id: 'atpl-flight-management-systems', title: 'Flight Management Systems', minutes: 13, level: 3, prereqs: ['atpl-autoflight-and-flight-directors', 'cpl-area-navigation-and-pbn'],
  objectives: ['Describe the functions and databases of a flight management system.', 'Explain the cost index.', 'Estimate a top-of-descent point.', 'Describe the cross-checks that protect against data-entry errors.'],
  intro: 'Prerequisite review: area navigation flies any path between waypoints, and the autopilot follows lateral and vertical navigation modes. The flight management system is what draws that path, in three dimensions and in time, and it will fly a wrong route as faithfully as a right one.',
  simple: 'The flight management system is the aircraft\'s navigator and planner. The crew type in the route and the weights; it works out the speeds, the path, the time and the fuel, and guides the autopilot. Its answers are only as good as what was typed in.',
  sections: [
    { h: 'Functions', body: [
      'The **flight management system** (FMS) combines **navigation** (computing position from GNSS, inertial and radio sources), **flight planning** (the lateral and vertical route), **performance** (speeds, altitudes, fuel and time predictions) and **guidance** to the autopilot and autothrust.',
      'The crew interface is the **control display unit**.',
    ] },
    { h: 'Databases', body: [
      'The **navigation database** holds waypoints, airways, procedures and aerodromes. It is updated every **28 days** on the international AIRAC cycle, and its validity dates are checked before flight.',
      'The **performance database** holds the aircraft and engine model.',
    ] },
    { h: 'Cost index', body: [
      'The **cost index** is the ratio of the cost of time to the cost of fuel. A cost index of **zero** gives the minimum fuel burn (maximum range speed). A **high** cost index gives a faster flight that burns more fuel. The FMS computes its economy speeds from it.',
    ] },
    { h: 'Descent planning and cross-checks', body: [
      'The FMS computes a **top of descent**. A mental check is the 3-to-1 rule: `distance ≈ height to lose (thousands of feet) × 3`. From FL350 to 5,000 ft, about 90 NM.',
      'Data-entry errors are a known hazard. Both pilots check the route against the flight plan, check distances and tracks for gross errors, and compare the FMS fuel prediction with the plan.',
    ], formula: 'top-of-descent', lab: 'formula:top-of-descent', note: 'The 3-to-1 rule ignores wind and deceleration. Systems and procedures are type- and operator-specific.' },
  ],
  examples: [
    { title: 'Top of descent', steps: ['Cruising at FL390, to be at 3,000 ft.', 'Height to lose = 36,000 ft; 36 × 3.', 'Start down about 108 NM before, plus an allowance for slowing down.'] },
    { title: 'Gross error check', steps: ['After loading the route, the total distance shows 2,950 NM; the flight plan says 1,950 NM.', 'A waypoint has probably been entered wrongly.', 'Find and correct it before departure.'] },
  ],
  practice: [
    num('Cruising at FL390, to be at 3,000 ft. Descent distance by the 3-to-1 rule?', 108, 1, 'NM', '36 × 3 = 108 NM.'),
    mcq('The crew interface to the flight management system is the:', ['Control display unit', 'Standby compass', 'Fuel panel', 'Circuit breaker panel'], 'It has a keyboard and a screen.'),
    mcq('The performance database contains:', ['The aircraft and engine model', 'Waypoints and airways', 'Passenger lists', 'Weather forecasts'], 'It allows speed, fuel and time predictions.'),
    mcq('A high cost index results in:', ['A faster flight that burns more fuel', 'A slower flight that burns less fuel', 'No change', 'A lower cruise altitude only'], 'Time is weighted more heavily than fuel.'),
    tf('The flight management system will detect and reject any incorrectly typed waypoint.', false, 'It flies what is entered: the crew must cross-check.'),
  ],
  assessment: [
    num('Cruising at FL350, to be at 5,000 ft. Descent distance by the 3-to-1 rule?', 90, 1, 'NM', '30 × 3 = 90 NM.'),
    num('Every how many days is the navigation database updated on the AIRAC cycle?', 28, 0.1, 'days', 'Every 28 days.'),
    mcq('A cost index of zero gives:', ['Minimum fuel burn', 'Maximum speed', 'Minimum flight time', 'Maximum cost'], 'Maximum range speed.'),
    mcq('The cost index is the ratio of:', ['The cost of time to the cost of fuel', 'Passengers to seats', 'Thrust to weight', 'Fuel to cargo'], 'It sets the economy speeds.'),
    mcq('The navigation database contains:', ['Waypoints, airways, procedures and aerodromes', 'The engine model', 'Crew duty times', 'Cabin temperatures'], 'Its validity dates are checked before flight.'),
    mcq('The main protection against a route entry error is:', ['Cross-checking the entered route against the flight plan by both pilots', 'Trusting the first entry', 'The autopilot', 'The weather radar'], 'Including a gross error check of distances and tracks.'),
    tf('The flight management system provides guidance to both the autopilot and the autothrust.', true, 'In lateral and vertical navigation.'),
  ],
  missionId: 'm-atpl-fms', sources: ['phak'],
});
