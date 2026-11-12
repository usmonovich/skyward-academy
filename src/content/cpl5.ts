// CPL — Aircraft Systems and Powerplants (5 lessons).
// Each lesson opens with a short prerequisite review, as stated in the track note.
import { lesson, mcq, num, tf } from './q';

export const powerplants = lesson('Aircraft systems', {
  id: 'cpl-powerplants', title: 'Powerplants', minutes: 14, level: 3, prereqs: ['ppl-piston-engines', 'phys-thermodynamics'],
  objectives: ['Explain turbocharging and critical altitude.', 'Describe the sections of a gas turbine engine.', 'Describe how a turboprop delivers power.', 'Calculate shaft power from torque and rpm.'],
  intro: 'Prerequisite review: a piston engine works through intake, compression, power and exhaust, and loses power as the air gets thinner. Commercial aircraft answer that loss in two ways: by forcing more air into the piston engine, or by replacing it with a gas turbine.',
  simple: 'A turbocharger uses the exhaust to pump extra air into a piston engine, so it keeps its power higher up. A gas turbine does the same four jobs as a piston engine, but continuously and in separate sections, and can spin a propeller through a gearbox.',
  sections: [
    { h: 'Turbocharging', body: [
      'A **turbocharger** uses exhaust gas to drive a turbine connected to a compressor, which raises the pressure of the air entering the engine. A **wastegate** controls how much exhaust passes through the turbine.',
      'The engine can maintain sea-level manifold pressure up to its **critical altitude**, where the wastegate is fully closed. Above that, power falls as in a normally aspirated engine.',
    ] },
    { h: 'The gas turbine', body: [
      'Air passes through an **intake**, is squeezed by a **compressor**, burned with fuel in a **combustion chamber**, and expands through a **turbine** that drives the compressor, before leaving by the **exhaust**. Combustion is continuous.',
      'The hottest point is at the turbine inlet. Turbine temperature is a primary engine limit and is watched closely, especially during starting.',
    ] },
    { h: 'The turboprop', body: [
      'In a **turboprop**, most of the energy is taken out by a turbine that drives the propeller through a **reduction gearbox**. In a **free-turbine** engine, this power turbine is not mechanically connected to the compressor.',
      'Power is indicated by **torque** together with propeller rpm: `shaft power (kW) = torque (N·m) × rpm × 2π ÷ 60,000`. A torque of 1,000 N·m at 2,000 rpm is about 209 kW.',
    ], formula: 'shaft-power', lab: 'formula:shaft-power' },
    { h: 'Handling', body: [
      'Turbine engines respond more slowly to power changes than piston engines, particularly from low power. Limits on torque, temperature and rpm must all be respected; many engines have electronic control units that do this automatically.',
    ], note: 'Engine limits and handling procedures are specific to each type and are given in its flight manual.' },
  ],
  examples: [
    { title: 'Shaft power', steps: ['Torque 500 N·m at 2,400 rpm.', '500 × 2,400 × 2π ÷ 60,000.', 'Shaft power ≈ 125.7 kW.'] },
    { title: 'Critical altitude', steps: ['A turbocharged engine holds rated manifold pressure to 16,000 ft.', 'Above that the wastegate is fully closed.', 'Manifold pressure and power then fall with altitude.'] },
  ],
  practice: [
    num('Torque 500 N·m at 2,400 rpm. Shaft power in kW (torque × rpm × 2π ÷ 60,000)?', 125.7, 0.5, 'kW', '500 × 2,400 × 6.283 ÷ 60,000 ≈ 125.7 kW.'),
    mcq('A turbocharger is driven by:', ['Exhaust gas', 'The battery', 'A belt from the propeller', 'Fuel pressure'], 'An exhaust turbine drives the compressor.'),
    mcq('In a gas turbine, combustion is:', ['Continuous', 'Once per four strokes', 'Triggered by magnetos each cycle', 'Absent'], 'Fuel burns steadily in the combustion chamber.'),
    mcq('A turboprop drives its propeller through:', ['A reduction gearbox', 'A direct shaft at turbine speed', 'A chain', 'Hydraulic pressure only'], 'Turbines turn far faster than a propeller can.'),
    tf('A turbine engine responds to throttle movement as quickly as a piston engine.', false, 'It is slower, especially from low power.'),
  ],
  assessment: [
    num('Torque 1,000 N·m at 2,000 rpm. Shaft power in kW (torque × rpm × 2π ÷ 60,000)?', 209.4, 0.5, 'kW', '1,000 × 2,000 × 6.283 ÷ 60,000 ≈ 209.4 kW.'),
    mcq('The correct order of sections in a gas turbine is:', ['Intake, compressor, combustion chamber, turbine, exhaust', 'Intake, turbine, compressor, combustion chamber, exhaust', 'Compressor, intake, exhaust, turbine, combustion chamber', 'Combustion chamber, intake, compressor, exhaust, turbine'], 'Air is compressed, heated, then expanded.'),
    mcq('The critical altitude of a turbocharged engine is the altitude:', ['Up to which rated manifold pressure can be maintained', 'At which the engine stops', 'Of the aerodrome', 'Above which no oxygen is needed'], 'Above it, power falls with altitude.'),
    mcq('The wastegate of a turbocharger controls:', ['How much exhaust gas passes through the turbine', 'The fuel flow', 'The propeller pitch', 'The oil temperature'], 'And therefore the boost.'),
    mcq('In a free-turbine turboprop, the power turbine is:', ['Not mechanically connected to the compressor', 'Bolted to the compressor shaft', 'Driven by the battery', 'Part of the propeller'], 'Gas from the gas generator drives it.'),
    mcq('The turbine in a gas turbine engine:', ['Extracts energy from the hot gas to drive the compressor', 'Compresses the incoming air', 'Mixes fuel and air', 'Cools the exhaust'], 'In a turboprop it also drives the propeller.'),
    tf('Turbine temperature is a primary limit on a gas turbine engine.', true, 'Exceeding it damages the turbine blades.'),
  ],
  missionId: 'm-cpl-powerplant', sources: ['phak'],
});

export const electricalSystems = lesson('Aircraft systems', {
  id: 'cpl-electrical-systems', title: 'Electrical Systems', minutes: 13, level: 3, prereqs: ['ppl-fuel-and-electrical-systems', 'phys-basic-circuits'],
  objectives: ['Distinguish DC and AC aircraft systems.', 'Explain the roles of inverters and transformer rectifier units.', 'Describe bus-bar arrangement and load shedding.', 'Calculate generator output frequency.'],
  intro: 'Prerequisite review: an alternator supplies the loads and charges the battery through a bus bar, with fuses and circuit breakers protecting the wiring. Larger aircraft need far more power, in more than one form, and arrange it so that no single failure leaves the crew in the dark.',
  simple: 'Bigger aircraft use both direct and alternating current and convert between them. Power is delivered through several separate bus bars, ranked by importance. When generators fail, the least important loads are switched off first so the essential ones keep working.',
  sections: [
    { h: 'DC and AC', body: [
      'Light and medium aircraft typically use **28 V DC**. Larger aircraft generate **115 V AC at 400 Hz**, which allows lighter generators and wiring.',
      'A **transformer rectifier unit** (TRU) converts AC to DC. An **inverter** converts DC to AC, for example to keep essential AC instruments running from the battery.',
    ] },
    { h: 'Generator frequency', body: [
      'The frequency of an AC generator depends on its speed and number of poles: `frequency = poles × rpm ÷ 120`. An 8-pole generator at 6,000 rpm gives 400 Hz.',
      'A constant-speed drive, or electronic conversion, holds the frequency steady as engine speed changes.',
    ], formula: 'ac-freq', lab: 'formula:ac-freq' },
    { h: 'Bus bars and load shedding', body: [
      'Loads are grouped on **bus bars**: main buses for normal loads, an **essential** (or emergency) bus for loads needed for safe flight, and a **battery** bus that remains powered from the battery alone.',
      'If generating capacity is lost, **load shedding** disconnects non-essential loads, automatically or by the crew, to protect the remaining sources.',
    ] },
    { h: 'Batteries and protection', body: [
      'The battery provides starting power and a limited emergency supply. **Nickel-cadmium** batteries can suffer **thermal runaway**, an uncontrolled rise in temperature and current, and are monitored for it.',
      'A tripped circuit breaker has done its job. It should be reset only as the flight manual allows, typically no more than once and after a cooling period.',
    ], note: 'System architecture differs greatly between types. The flight manual describes the buses, sources and failure drills for each aircraft.' },
  ],
  examples: [
    { title: 'Frequency', steps: ['A 4-pole generator turns at 12,000 rpm.', '4 × 12,000 ÷ 120.', 'Frequency = 400 Hz.'] },
    { title: 'Loss of a generator', steps: ['One of two generators fails in flight.', 'The remaining generator may not carry all loads.', 'Non-essential loads are shed; the essential bus stays powered.'] },
  ],
  practice: [
    num('A 4-pole generator turns at 12,000 rpm. Output frequency (poles × rpm ÷ 120)?', 400, 1, 'Hz', '4 × 12,000 ÷ 120 = 400 Hz.'),
    mcq('An inverter converts:', ['DC to AC', 'AC to DC', 'AC to hydraulic pressure', 'DC to a higher DC voltage only'], 'It supplies AC loads from a DC source.'),
    mcq('The essential bus supplies:', ['Loads needed for safe flight', 'Galley and entertainment loads', 'Only the cabin lights', 'Nothing in flight'], 'It is protected when other loads are shed.'),
    mcq('Load shedding is:', ['Disconnecting non-essential loads to protect the remaining power sources', 'Dropping cargo', 'Reducing fuel', 'Switching off the engines'], 'Automatic or manual.'),
    tf('A tripped circuit breaker should be reset repeatedly until it stays in.', false, 'Reset only as the flight manual permits.'),
  ],
  assessment: [
    num('An 8-pole generator turns at 6,000 rpm. Output frequency (poles × rpm ÷ 120)?', 400, 1, 'Hz', '8 × 6,000 ÷ 120 = 400 Hz.'),
    num('A 6-pole generator turns at 8,000 rpm. Output frequency (poles × rpm ÷ 120)?', 400, 1, 'Hz', '6 × 8,000 ÷ 120 = 400 Hz.'),
    mcq('A transformer rectifier unit converts:', ['AC to DC', 'DC to AC', 'Low DC to high DC', 'Fuel to electricity'], 'It supplies the DC buses on an AC aircraft.'),
    mcq('Larger aircraft commonly generate AC at:', ['115 V, 400 Hz', '12 V, 50 Hz', '240 V, 60 Hz', '28 V, 0 Hz'], 'Higher frequency allows lighter equipment.'),
    mcq('Thermal runaway is a hazard associated with:', ['Nickel-cadmium batteries', 'Circuit breakers', 'Bus bars', 'Inverters'], 'Temperature and current rise uncontrollably.'),
    mcq('The battery bus is powered:', ['From the battery alone, even with generators off line', 'Only when all generators are running', 'Only on the ground', 'Never'], 'It keeps the most vital items available.'),
    tf('An AC generator\'s output frequency depends on its rotational speed.', true, 'Frequency = poles × rpm ÷ 120.'),
  ],
  missionId: 'm-cpl-electrical', sources: ['phak'],
});

export const hydraulics = lesson('Aircraft systems', {
  id: 'cpl-hydraulic-systems', title: 'Hydraulic Systems', minutes: 12, level: 3, prereqs: ['phys-pressure'],
  objectives: ['State Pascal\'s law.', 'Calculate the force from a hydraulic actuator.', 'Name the main components of a hydraulic system.', 'Explain redundancy and the effects of a hydraulic failure.'],
  intro: 'Prerequisite review: pressure is force divided by area, so a pressure acting on an area produces a force. Hydraulics turns that simple relation into the muscle that moves landing gear, flaps, brakes and, on larger aircraft, the flight controls.',
  simple: 'Push on a liquid in a closed pipe and the push is felt equally everywhere in it. A small pump can therefore produce a very large force on a wide piston. Aircraft use this to move heavy parts, and carry more than one system in case one leaks.',
  sections: [
    { h: 'Pascal\'s law', body: [
      'Pressure applied to an enclosed fluid is transmitted equally in all directions. The force on a piston is `force = pressure × area`.',
      'With pressure in megapascals and area in square centimetres: `force (N) = pressure (MPa) × area (cm²) × 100`. At 20 MPa, a 10 cm² piston produces 20,000 N.',
      'Aircraft systems commonly work at about 3,000 psi, which is about 20.7 MPa.',
    ], formula: 'hyd-force', lab: 'formula:hyd-force' },
    { h: 'Components', body: [
      'A **reservoir** stores fluid. A **pump**, engine-driven or electric, provides flow under pressure. A **pressure relief valve** limits the maximum pressure. **Selector valves** direct fluid to **actuators**, which convert pressure into movement. **Filters** keep the fluid clean.',
      'An **accumulator** stores fluid under gas pressure: it smooths pressure fluctuations and provides a limited reserve, for example for emergency braking.',
    ] },
    { h: 'Fluids', body: [
      'Hydraulic fluids are of different chemical types, identified by colour, and each system\'s seals suit only its own fluid. Types must **never be mixed**.',
    ] },
    { h: 'Redundancy and failure', body: [
      'Larger aircraft have two or three independent hydraulic systems, so that the loss of one leaves essential services working. Back-ups include electric pumps, hand pumps, and emergency gear extension by gravity or stored gas.',
      'A hydraulic failure may mean no flaps, alternate gear extension, reduced braking and a longer landing distance: all must be planned before the approach.',
    ], note: 'Which services each system powers, and the failure procedures, are specific to the aircraft type.' },
  ],
  examples: [
    { title: 'Actuator force', steps: ['Pressure 21 MPa on a piston of 5 cm².', '21 × 5 × 100.', 'Force = 10,500 N.'] },
    { title: 'Planning after a failure', steps: ['The main hydraulic system has failed; flaps are unavailable.', 'Approach speed and landing distance will be higher.', 'Choose a long runway and brief the alternate gear extension.'] },
  ],
  practice: [
    num('Pressure 21 MPa on a piston of 5 cm². Force (pressure × area × 100)?', 10500, 20, 'N', '21 × 5 × 100 = 10,500 N.'),
    mcq('Pascal\'s law states that pressure applied to an enclosed fluid is:', ['Transmitted equally in all directions', 'Lost as heat', 'Greatest at the top', 'Zero at the walls'], 'The basis of hydraulics.'),
    mcq('A hydraulic actuator:', ['Converts fluid pressure into movement', 'Stores fluid', 'Filters the fluid', 'Limits the pressure'], 'For example a landing gear jack.'),
    mcq('The reservoir of a hydraulic system:', ['Stores the fluid', 'Pumps the fluid', 'Moves the flaps', 'Measures airspeed'], 'It also allows for expansion and for air to separate.'),
    tf('Different types of hydraulic fluid can safely be mixed.', false, 'Seals and fluids are matched; mixing can cause failure.'),
  ],
  assessment: [
    num('Pressure 20 MPa on a piston of 10 cm². Force (pressure × area × 100)?', 20000, 20, 'N', '20 × 10 × 100 = 20,000 N.'),
    num('Pressure 15 MPa on a piston of 8 cm². Force (pressure × area × 100)?', 12000, 20, 'N', '15 × 8 × 100 = 12,000 N.'),
    mcq('An accumulator:', ['Stores fluid under gas pressure and smooths pressure fluctuations', 'Cools the fluid', 'Removes water from the fluid', 'Drives the pump'], 'It also gives a limited reserve.'),
    mcq('A pressure relief valve:', ['Limits the maximum system pressure', 'Increases the pressure', 'Selects the landing gear', 'Stores fluid'], 'It protects the system from over-pressure.'),
    mcq('Aircraft hydraulic systems commonly operate at about:', ['3,000 psi', '30 psi', '300,000 psi', '3 psi'], 'About 20.7 MPa.'),
    mcq('Larger aircraft have more than one hydraulic system in order to:', ['Keep essential services working if one system fails', 'Use more fluid', 'Increase weight', 'Simplify maintenance'], 'Redundancy.'),
    tf('A hydraulic failure can increase the landing distance required.', true, 'Flaps, brakes or spoilers may be degraded.'),
  ],
  missionId: 'm-cpl-hydraulic', sources: ['phak'],
});

export const efis = lesson('Aircraft systems', {
  id: 'cpl-flight-instruments-and-efis', title: 'Flight Instruments and EFIS', minutes: 12, level: 3, prereqs: ['ppl-the-pitot-static-instruments', 'ppl-gyroscopic-instruments'],
  objectives: ['Describe the primary flight display and navigation display.', 'Name the sensors that feed an electronic flight instrument system.', 'Read flight mode annunciations.', 'Describe the response to a display or sensor failure.'],
  intro: 'Prerequisite review: three instruments read air pressure and three use gyroscopes, and each group fails together. An electronic flight instrument system shows the same information on screens, fed by computers, with new strengths and new ways to mislead.',
  simple: 'Glass cockpits put the six basic instruments onto one screen and the map onto another. Computers work out the numbers from air and motion sensors. The crew must always know what the automation is doing, and which standby instrument to trust if a screen goes wrong.',
  sections: [
    { h: 'The displays', body: [
      'The **primary flight display** (PFD) shows attitude in the centre, with an airspeed tape on the left, an altitude tape and vertical speed on the right, and heading below: the basic T on one screen.',
      'The **navigation display** (ND) shows the route, waypoints, navigation aids, weather radar and traffic.',
      'Engine and system information is shown on a separate display with crew alerts.',
    ], lab: 'explore:efis' },
    { h: 'The sensors', body: [
      'An **air data computer** (ADC) converts pitot and static pressure and temperature into airspeed, altitude, vertical speed, Mach number and true airspeed.',
      'An **attitude and heading reference system** (AHRS) or an **inertial reference system** (IRS) provides attitude and heading from solid-state sensors in place of spinning gyros.',
    ] },
    { h: 'Flight mode annunciations', body: [
      'The top of the PFD shows the **flight mode annunciator**: which autothrust, lateral and vertical modes are engaged or armed. It is the only reliable statement of what the automation is doing.',
      'Every mode change is read and called out. A selected button is an intention; the annunciator shows the result.',
    ] },
    { h: 'Failures', body: [
      'A failed sensor is shown by a flag or a red cross in place of the data. A **comparator** warns when the two pilots\' displays disagree. **Standby instruments**, independently powered, decide which side is correct.',
      'If automation behaves unexpectedly, reduce the level of automation and fly the aircraft.',
    ], note: 'Symbols, colours and failure indications differ between manufacturers. Type training covers the system fitted.' },
  ],
  examples: [
    { title: 'Reading the modes', steps: ['You press the approach button; the annunciator shows the localiser mode armed, in a different colour from the active modes.', 'Armed is not engaged.', 'Call it, and watch for the change to engaged when the beam is captured.'] },
    { title: 'Disagreeing displays', steps: ['A comparator warning shows the two attitude displays differ.', 'Cross-check both against the standby attitude indicator.', 'Use the side that agrees with the standby.'] },
  ],
  practice: [
    mcq('The primary flight display shows:', ['Attitude, airspeed, altitude, vertical speed and heading', 'Only the route map', 'Only engine data', 'Cabin temperature'], 'The basic T on one screen.'),
    mcq('The air data computer provides:', ['Airspeed, altitude and vertical speed', 'Attitude and heading', 'Engine torque', 'Fuel quantity'], 'From pitot, static and temperature inputs.'),
    mcq('On a PFD, the airspeed tape is normally:', ['On the left', 'On the right', 'At the bottom', 'On a separate screen'], 'Altitude is on the right, as in the basic T.'),
    mcq('Standby instruments are:', ['Independently powered back-ups', 'Decorative', 'Used only on the ground', 'Fed by the main displays'], 'They resolve disagreements and survive failures.'),
    tf('Pressing an autopilot mode button guarantees that the mode is engaged.', false, 'Only the flight mode annunciator shows what is engaged.'),
  ],
  assessment: [
    mcq('The navigation display shows:', ['The route, waypoints, navigation aids and weather radar', 'Only airspeed', 'Only cabin pressure', 'Engine oil temperature'], 'A map of the situation ahead.'),
    mcq('Attitude and heading in a glass cockpit are provided by:', ['An AHRS or IRS', 'The air data computer', 'The fuel computer', 'The transponder'], 'Solid-state sensors replace spinning gyros.'),
    mcq('The flight mode annunciator shows:', ['Which automation modes are engaged or armed', 'The fuel remaining', 'The outside temperature', 'The cabin altitude'], 'It is the reliable statement of what the automation is doing.'),
    mcq('A comparator warning indicates that:', ['The two pilots\' displays disagree', 'The fuel is low', 'The cabin door is open', 'The flaps are extended'], 'Cross-check against the standby instruments.'),
    mcq('A failed data source on an electronic display is typically shown by:', ['A flag or red cross in place of the data', 'Brighter numbers', 'A larger font', 'No change at all'], 'The missing information is clearly marked.'),
    mcq('If the automation behaves unexpectedly, the crew should:', ['Reduce the level of automation and fly the aircraft', 'Add more automation', 'Wait and watch', 'Switch off the displays'], 'Control first, analysis afterwards.'),
    tf('On a PFD, the altitude tape is normally on the right.', true, 'The layout follows the basic T.'),
  ],
  missionId: 'm-cpl-efis', sources: ['phak'],
});

export const pressurisation = lesson('Aircraft systems', {
  id: 'cpl-pressurisation-basics', title: 'Pressurisation Basics', minutes: 12, level: 3, prereqs: ['ppl-hypoxia-and-the-atmosphere', 'phys-pressure'],
  objectives: ['Explain why and how a cabin is pressurised.', 'Define cabin altitude and differential pressure.', 'Calculate differential pressure.', 'State the immediate actions after a rapid decompression.'],
  intro: 'Prerequisite review: at altitude there is too little pressure to push enough oxygen into the blood, and the time of useful consciousness is short. Pressurisation lets an aircraft cruise in thin, efficient air while its occupants breathe as if they were much lower.',
  simple: 'Air is pumped into a sealed cabin and let out through a valve at a controlled rate, keeping the inside pressure higher than the outside. The cabin "altitude" is therefore much lower than the aircraft\'s. If the cabin leaks suddenly, masks go on first and the aircraft descends.',
  sections: [
    { h: 'How it works', body: [
      'Conditioned air, from the engines or from compressors, flows continuously into the cabin. An **outflow valve** controls how much leaves, and so the cabin pressure. **Safety valves** prevent excessive positive or negative pressure.',
    ] },
    { h: 'Cabin altitude and differential', body: [
      '**Cabin altitude** is the altitude in the standard atmosphere that has the same pressure as the cabin. In cruise it is normally kept at or below about **8,000 ft**.',
      '**Differential pressure** is `cabin pressure − outside pressure`. With 750 hPa in the cabin and 240 hPa outside, it is 510 hPa. The structure sets a maximum differential, which limits the aircraft\'s altitude for a given cabin altitude.',
      'Cabin altitude is changed gradually, at a few hundred feet per minute, for passenger comfort.',
    ], formula: 'diff-pressure', lab: 'formula:diff-pressure' },
    { h: 'Decompression', body: [
      'A **rapid decompression** shows as a bang, mist in the cabin, a rush of air and a cabin altitude warning. A slow leak may show only on the gauges.',
      'The immediate actions are: **oxygen masks on**, establish crew communication, then an **emergency descent** to 10,000 ft or the minimum safe altitude if higher.',
      'Masks come first because the time of useful consciousness at high altitude may be only seconds.',
    ] },
    { h: 'On the ground', body: [
      'The cabin must be depressurised before the doors are opened: any remaining differential pressure makes them dangerous.',
    ], note: 'Cabin altitude limits and emergency descent procedures are defined by certification rules and the aircraft flight manual. The 8,000 ft figure is quoted from memory and was not checked.' },
  ],
  examples: [
    { title: 'Differential pressure', steps: ['Cabin pressure 800 hPa, outside pressure 300 hPa.', '800 − 300.', 'Differential = 500 hPa.'] },
    { title: 'Cabin altitude warning', steps: ['At FL300 the cabin altitude warning sounds and the cabin is climbing fast.', 'Useful consciousness is short.', 'Masks on, communicate, emergency descent.'] },
  ],
  practice: [
    num('Cabin pressure 800 hPa, outside pressure 300 hPa. Differential pressure?', 500, 1, 'hPa', '800 − 300 = 500 hPa.'),
    mcq('Cabin pressure is controlled mainly by:', ['The outflow valve', 'The throttle', 'The flaps', 'The fuel pump'], 'It regulates how much air leaves the cabin.'),
    mcq('Cabin altitude in cruise is normally:', ['Much lower than the aircraft\'s altitude', 'Equal to the aircraft\'s altitude', 'Higher than the aircraft\'s altitude', 'Zero'], 'Typically at or below about 8,000 ft.'),
    mcq('Mist forming suddenly in the cabin with a loud bang suggests:', ['A rapid decompression', 'An engine fire', 'A hydraulic leak', 'Normal operation'], 'The air cools as it expands.'),
    tf('Cabin doors may be opened with the cabin still pressurised.', false, 'The cabin must be fully depressurised first.'),
  ],
  assessment: [
    num('Cabin pressure 750 hPa, outside pressure 240 hPa. Differential pressure?', 510, 1, 'hPa', '750 − 240 = 510 hPa.'),
    num('About what cabin altitude, in feet, is normally not exceeded in cruise?', 8000, 50, 'ft', 'About 8,000 ft.'),
    mcq('Differential pressure is:', ['Cabin pressure minus outside pressure', 'Outside pressure minus cabin pressure', 'Cabin pressure times altitude', 'Always zero'], 'It loads the structure.'),
    mcq('The first action after a rapid decompression at high altitude is to:', ['Put on oxygen masks', 'Start the descent before anything else', 'Make a passenger announcement', 'Check the fuel'], 'Useful consciousness may last only seconds.'),
    mcq('After masks are on, the crew makes an emergency descent to:', ['10,000 ft, or the minimum safe altitude if higher', 'Sea level regardless of terrain', '25,000 ft', 'The nearest cloud'], 'Where oxygen is no longer needed, clear of terrain.'),
    mcq('Safety valves in a pressurisation system prevent:', ['Excessive positive or negative differential pressure', 'Fuel leaks', 'Engine overspeed', 'Radio interference'], 'They protect the structure.'),
    tf('The maximum differential pressure limits how high the aircraft can fly for a given cabin altitude.', true, 'The structure can carry only so much pressure difference.'),
  ],
  missionId: 'm-cpl-pressurisation', sources: ['phak'],
});
