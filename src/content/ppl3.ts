// PPL Phase A — Introduction to Aviation: six lessons for learners who have not yet started flight school.
import { lesson, mcq, num, tf } from './q';

export const introAviation = lesson('Introduction to aviation', {
  id: 'ppl-introduction-to-aviation', title: 'Introduction to Aviation', minutes: 9, level: 1,
  objectives: ['Describe the main branches of aviation.', 'Name the bodies that regulate aviation.', 'Outline the pilot licence ladder.', 'State what a private pilot licence does and does not allow.'],
  intro: 'Before the first lesson in an aircraft, it helps to see the whole map: who flies, who makes the rules, and what each licence on the way to an airline cockpit actually means.',
  simple: 'Aviation is divided into airlines, private and training flying, and the military. An international organisation sets common standards, and each country\'s authority issues licences. A private pilot licence lets you fly for yourself, not for payment.',
  sections: [
    { h: 'Branches of aviation', body: [
      '**Commercial air transport** carries passengers and cargo for payment. **General aviation** covers private flying, training, gliding and aerial work. **Military aviation** is operated by states.',
    ] },
    { h: 'Who makes the rules', body: [
      'The **International Civil Aviation Organization (ICAO)**, a United Nations agency created by the 1944 Chicago Convention, publishes international standards in documents called Annexes. Annex 1 covers personnel licensing.',
      'Each state has a **national aviation authority** that turns those standards into law and issues licences. Examples are the FAA in the United States and the national authorities working under EASA rules in Europe.',
      'Rules differ between states. Your own authority\'s regulations always take priority over a general description such as this one.',
    ] },
    { h: 'The licence ladder', body: [
      'A **Private Pilot Licence (PPL)** allows you to fly as pilot in command without being paid. A **Commercial Pilot Licence (CPL)** allows you to be paid to fly. An **Airline Transport Pilot Licence (ATPL)** is required to command a large multi-crew airliner.',
      'ICAO Annex 1 sets minimum ages of 17, 18 and 21 and minimum flight experience of 40, 200 and 1,500 hours for the aeroplane PPL, CPL and ATPL. States may require more: for example, the European PPL(A) requires at least 45 hours.',
      'Every licence also needs a valid **medical certificate**, theoretical knowledge examinations and a practical skill test.',
    ], lab: 'explore:licences', note: 'Skyward Academy is a study aid. It does not issue licences or count towards flight experience. Licence training must be done with an approved training organisation or authorised instructor.' },
  ],
  examples: [
    { title: 'Which licence?', steps: ['A friend offers to pay you to fly sightseeing passengers.', 'Being paid to fly is commercial flying.', 'A PPL is not enough: a CPL and an approved operation are required.'] },
    { title: 'Whose rules?', steps: ['You train in one country and read a handbook from another.', 'The handbook explains principles; your state\'s regulations set the rules.', 'Always check the regulations of the authority that will issue your licence.'] },
  ],
  practice: [
    mcq('Flight training and private flying belong to:', ['General aviation', 'Commercial air transport', 'Military aviation', 'Air traffic control'], 'General aviation covers non-airline civil flying.'),
    mcq('ICAO is:', ['A United Nations agency that sets international aviation standards', 'An airline alliance', 'A manufacturer of aircraft', 'A private flying club'], 'It was created by the Chicago Convention of 1944.'),
    mcq('Which licence is required to be paid as a pilot?', ['At least a CPL', 'A PPL', 'A student pilot certificate', 'No licence'], 'A PPL holder may not fly for remuneration.'),
    num('What is the ICAO minimum flight experience, in hours, for an aeroplane PPL?', 40, 0.1, 'h', 'Annex 1 sets 40 hours; some states require more.'),
    tf('A pilot licence is valid without a medical certificate.', false, 'A valid medical certificate is required to use the licence.'),
  ],
  assessment: [
    mcq('Airline passenger flights are part of:', ['Commercial air transport', 'General aviation', 'Military aviation', 'Aerial work'], 'They carry passengers for payment.'),
    mcq('International standards for pilot licensing are published by ICAO in:', ['Annex 1', 'The Chicago Tribune', 'A NOTAM', 'The aircraft flight manual'], 'Annex 1 is Personnel Licensing.'),
    mcq('A private pilot licence allows the holder to:', ['Act as pilot in command without being paid', 'Fly passengers for payment', 'Command an airliner', 'Work as an air traffic controller'], 'It is a non-commercial licence.'),
    num('What is the ICAO minimum age, in years, for a private pilot licence?', 17, 0.1, '', 'Annex 1 sets 17 for the PPL.'),
    num('What is the ICAO minimum total flight time, in hours, for an aeroplane ATPL?', 1500, 0.5, 'h', 'Annex 1 sets 1,500 hours.'),
    mcq('Licences are issued by:', ['The national aviation authority of a state', 'ICAO directly', 'The aircraft manufacturer', 'The airport operator'], 'ICAO sets standards; states issue licences.'),
    tf('Every state applies exactly the same licensing rules.', false, 'States must meet ICAO minimums but may add their own requirements.'),
  ],
  missionId: 'm-ppl-intro', sources: ['icao-a1', 'easa-fcl'],
});

export const identification = lesson('Aircraft identification', {
  id: 'ppl-aircraft-identification', title: 'Aircraft Identification', minutes: 9, level: 1, prereqs: ['ppl-introduction-to-aviation'],
  objectives: ['Name the main categories of aircraft.', 'Describe an aeroplane by wing position, engines and landing gear.', 'Distinguish piston, turboprop and jet engines.', 'Recognise a registration mark.'],
  intro: '"Traffic, a low-wing single, two o\'clock." To use information like that, you need the vocabulary pilots and controllers use to describe an aircraft at a glance.',
  simple: 'Aircraft are sorted by how they fly and how they are built. For aeroplanes, look at where the wing is, how many engines there are and of what kind, and how the wheels are arranged. Each aircraft also carries its own registration letters.',
  sections: [
    { h: 'Categories', body: [
      'An **aeroplane** gets lift from fixed wings and is driven by an engine. A **helicopter** gets lift from powered rotors. A **glider** (sailplane) has fixed wings and no engine in normal flight. **Balloons** and **airships** are lighter than air.',
    ] },
    { h: 'Describing an aeroplane', body: [
      '**Wing position**: high-wing (wing above the cabin), low-wing (below) or mid-wing.',
      '**Engines**: single-engine or multi-engine; **piston** (propeller driven by a piston engine), **turboprop** (propeller driven by a gas turbine) or **jet** (turbofan or turbojet).',
      '**Landing gear**: **tricycle** (nose wheel) or **tailwheel**; fixed or retractable.',
    ], lab: 'explore:aircraft-types' },
    { h: 'Registration marks', body: [
      'Every civil aircraft carries a registration: a nationality prefix followed by its own letters or numbers. Examples of prefixes are G for the United Kingdom, N for the United States, D for Germany, F for France and C for Canada.',
      'The registration is commonly used as the radio call sign of light aircraft.',
    ], note: 'A high wing gives a good view downward but hides the sky in a turn; a low wing does the opposite. Knowing your own blind spots is part of keeping a good lookout.' },
  ],
  examples: [
    { title: 'Describing a trainer', steps: ['The wing is above the cabin, there is one propeller, and a nose wheel.', 'High-wing, single-engine piston, tricycle gear.', 'That is a full description for a traffic report.'] },
    { title: 'Reading a registration', steps: ['An aircraft is marked G-ABCD.', 'G is the nationality prefix of the United Kingdom.', 'ABCD identifies the individual aircraft.'] },
  ],
  practice: [
    mcq('An aircraft with fixed wings and no engine in normal flight is a:', ['Glider', 'Helicopter', 'Airship', 'Turboprop'], 'It gains height in rising air.'),
    mcq('A turboprop is driven by:', ['A propeller turned by a gas turbine', 'A propeller turned by a piston engine', 'Jet exhaust alone', 'A rotor'], 'It combines a turbine engine with a propeller.'),
    mcq('A "tricycle" landing gear has:', ['A nose wheel and two main wheels', 'A tail wheel and two main wheels', 'Three wheels in a line', 'Skids'], 'The third wheel is under the nose.'),
    mcq('The registration prefix N belongs to:', ['The United States', 'Norway', 'The Netherlands', 'New Zealand'], 'N-numbers are United States registrations.'),
    tf('A helicopter gets its lift from fixed wings.', false, 'It gets lift from powered rotor blades.'),
  ],
  assessment: [
    mcq('Which aircraft gets its lift from powered rotors?', ['Helicopter', 'Aeroplane', 'Glider', 'Balloon'], 'The rotor blades are rotating wings.'),
    mcq('A high-wing aeroplane has its wing:', ['Above the cabin', 'Below the cabin', 'Through the middle of the cabin', 'On the tail'], 'The fuselage hangs beneath the wing.'),
    mcq('A piston-engine aeroplane is driven by:', ['A propeller turned by a piston engine', 'A propeller turned by a gas turbine', 'A turbofan', 'A rocket'], 'Most light training aircraft are of this type.'),
    mcq('A tailwheel aeroplane has its third wheel:', ['Under the tail', 'Under the nose', 'Under one wing', 'Retracted at all times'], 'It sits nose-high on the ground.'),
    mcq('In the registration G-ABCD, the letter G is:', ['The nationality prefix', 'The aircraft type', 'The owner\'s initial', 'The engine type'], 'G is the United Kingdom.'),
    mcq('The registration prefix D belongs to:', ['Germany', 'Denmark', 'The Dominican Republic', 'The Netherlands'], 'D comes from Deutschland.'),
    tf('Balloons and airships are lighter-than-air aircraft.', true, 'They float because they displace heavier air.'),
  ],
  missionId: 'm-ppl-ident', sources: ['phak', 'icao-a1'],
});

export const terminology = lesson('Aviation terminology', {
  id: 'ppl-aviation-terminology', title: 'Aviation Terminology', minutes: 10, level: 1, prereqs: ['ppl-aircraft-identification'],
  objectives: ['Use the ICAO spelling alphabet.', 'Say numbers in the standard way.', 'Use UTC and the 24-hour clock.', 'Explain how runways are numbered.'],
  intro: 'Aviation has its own compact language, designed so that a pilot and a controller who share no mother tongue can still understand each other on a noisy radio.',
  simple: 'Letters are spelled with special words such as Alfa and Bravo. Some numbers are said differently so they cannot be confused. Time is given in one worldwide time zone. Runways are named after the compass direction they point.',
  sections: [
    { h: 'Spelling alphabet and numbers', body: [
      'Letters are spoken as words: **Alfa, Bravo, Charlie, Delta, Echo, Foxtrot, Golf, Hotel, India, Juliett, Kilo, Lima, Mike, November, Oscar, Papa, Quebec, Romeo, Sierra, Tango, Uniform, Victor, Whiskey, X-ray, Yankee, Zulu**.',
      'Some digits have special pronunciations: 3 is "tree", 5 is "fife", 9 is "niner". Numbers are normally spoken digit by digit: heading 270 is "two seven zero".',
    ] },
    { h: 'Time', body: [
      'Aviation uses **Coordinated Universal Time (UTC)**, also called Zulu time, and the 24-hour clock, so that a time means the same thing everywhere. 3:30 pm is written 1530.',
      'Local time is UTC plus or minus the local offset. If local time is UTC + 2, then 1400 UTC is 1600 local.',
    ] },
    { h: 'Runway numbers', body: [
      'A runway is numbered by its magnetic direction, rounded to the nearest 10° with the last digit dropped. A runway pointing 268° is runway 27; the same strip used in the opposite direction is runway 09.',
      'A direction near 360° is runway 36, never runway 00.',
    ], formula: 'runway-number', lab: 'formula:runway-number' },
    { h: 'Common abbreviations', body: [
      '**ATC**: air traffic control. **VFR**: visual flight rules. **IFR**: instrument flight rules. **QNH**: the altimeter setting that makes the altimeter show altitude above sea level. **ATIS**: recorded aerodrome information. **NOTAM**: notice to pilots about changes and hazards. **ETA**: estimated time of arrival.',
    ], note: 'Standard words exist to remove doubt. If you are unsure what was said, ask: "Say again."' },
  ],
  examples: [
    { title: 'Spelling a call sign', steps: ['The aircraft is G-BKTD.', 'Spell each letter with its word.', '"Golf Bravo Kilo Tango Delta."'] },
    { title: 'Runway number', steps: ['A runway points 134° magnetic.', 'Round to the nearest ten: 130.', 'Drop the last digit: runway 13.'] },
  ],
  practice: [
    mcq('In the spelling alphabet, the letter B is:', ['Bravo', 'Beta', 'Baker', 'Boston'], 'Alfa, Bravo, Charlie.'),
    mcq('The digit 9 is spoken as:', ['Niner', 'Nine-er-oh', 'Novem', 'Nein'], 'It avoids confusion with other words.'),
    num('A runway points 134° magnetic. What is its runway number?', 13, 0.01, '', '134 rounds to 130: runway 13.'),
    mcq('3:30 pm on the 24-hour clock is:', ['1530', '0330', '1330', '3300'], '12 + 3 = 15 hours.'),
    mcq('VFR stands for:', ['Visual flight rules', 'Very fast route', 'Variable frequency radio', 'Vertical flight reference'], 'Flight by outside visual reference.'),
  ],
  assessment: [
    mcq('In the spelling alphabet, the letter Q is:', ['Quebec', 'Queen', 'Quick', 'Quartz'], 'Papa, Quebec, Romeo.'),
    mcq('The heading 270 is spoken as:', ['Two seven zero', 'Two hundred and seventy', 'Twenty-seven zero', 'Two seventy'], 'Numbers are spoken digit by digit.'),
    num('A runway points 268° magnetic. What is its runway number?', 27, 0.01, '', '268 rounds to 270: runway 27.'),
    num('What is the number of the opposite direction of runway 27?', 9, 0.01, '', '270 − 180 = 090: runway 09.'),
    num('Local time is UTC + 2. What is the local time, on the 24-hour clock, at 1400 UTC?', 1600, 0.5, '', '1400 + 2 hours = 1600.'),
    mcq('QNH is:', ['The altimeter setting that shows altitude above sea level', 'A radio frequency', 'A type of cloud', 'A runway light'], 'It is passed by ATC and in weather reports.'),
    tf('A runway pointing 360° magnetic is called runway 00.', false, 'It is runway 36.'),
  ],
  missionId: 'm-ppl-terms', sources: ['icao-9432', 'phak'],
});

export const components = lesson('Aircraft components', {
  id: 'ppl-basic-aircraft-components', title: 'Basic Aircraft Components', minutes: 9, level: 1, prereqs: ['ppl-aircraft-identification'],
  objectives: ['Name the five main parts of an aeroplane.', 'Identify the primary control surfaces and what they do.', 'Explain the purpose of flaps and trim.', 'Name the parts of the tail.'],
  intro: 'The walk-round inspection before every flight is a tour of the aircraft\'s structure. To inspect a part you first have to know its name and its job.',
  simple: 'An aeroplane has a body, wings, a tail, wheels and an engine. Moving surfaces on the wings and tail let the pilot roll, pitch and yaw the aircraft.',
  sections: [
    { h: 'Five main parts', body: [
      'The **fuselage** is the body: it holds the crew, passengers and load and joins everything together. The **wings** produce lift. The **empennage** is the tail assembly. The **landing gear** supports the aircraft on the ground. The **powerplant** is the engine and propeller.',
    ], lab: 'explore:components' },
    { h: 'Control surfaces', body: [
      '**Ailerons**, near the wing tips, move in opposite directions to roll the aircraft. The **elevator**, hinged to the horizontal stabiliser, pitches the nose up or down. The **rudder**, hinged to the vertical fin, yaws the nose left or right.',
      'Ailerons and elevator are worked by the control column or stick; the rudder by the pedals.',
    ] },
    { h: 'Flaps and trim', body: [
      '**Flaps**, on the inner trailing edge of the wing, increase lift and drag so the aircraft can fly more slowly and descend more steeply for landing.',
      'A **trim tab** relieves the steady force the pilot would otherwise have to hold on the controls.',
    ], note: 'Names and layouts vary: some aircraft have an all-moving tailplane (stabilator) instead of a separate elevator, and some have a V-tail. Always learn the aircraft you will fly from its own manual.' },
  ],
  examples: [
    { title: 'Which surface?', steps: ['You want to raise the nose.', 'Pitch is controlled by the elevator.', 'Pull back on the control column.'] },
    { title: 'On the walk-round', steps: ['You reach the tail.', 'Check the horizontal stabiliser and elevator, then the fin and rudder.', 'All hinges should be secure and the surfaces free to move.'] },
  ],
  practice: [
    mcq('The body of an aeroplane is called the:', ['Fuselage', 'Empennage', 'Nacelle', 'Spar'], 'It carries the occupants and joins the other parts.'),
    mcq('The ailerons control:', ['Roll', 'Pitch', 'Yaw', 'Engine power'], 'They move in opposite directions on each wing.'),
    mcq('The rudder is hinged to the:', ['Vertical fin', 'Wing tip', 'Horizontal stabiliser', 'Propeller'], 'It yaws the aircraft.'),
    mcq('The rudder is operated by:', ['The pedals', 'The throttle', 'The control column', 'The trim wheel'], 'Left pedal, nose left.'),
    tf('Flaps are used mainly to increase cruising speed.', false, 'They add lift and drag for slow flight and landing.'),
  ],
  assessment: [
    mcq('The tail assembly of an aeroplane is called the:', ['Empennage', 'Fuselage', 'Cowling', 'Undercarriage'], 'It includes the stabiliser, elevator, fin and rudder.'),
    mcq('The elevator controls:', ['Pitch', 'Roll', 'Yaw', 'Fuel flow'], 'It raises or lowers the nose.'),
    mcq('The ailerons are located:', ['Near the wing tips, on the trailing edge', 'On the fin', 'On the nose', 'Under the fuselage'], 'Their distance from the centre gives them leverage in roll.'),
    mcq('The rudder controls:', ['Yaw', 'Pitch', 'Roll', 'Lift'], 'It swings the nose left or right.'),
    mcq('Flaps are fitted to:', ['Increase lift and drag for slow flight and landing', 'Steer on the ground', 'Cool the engine', 'Reduce noise'], 'They allow a slower, steeper approach.'),
    mcq('The purpose of a trim tab is to:', ['Relieve steady control forces', 'Increase engine power', 'Lower the landing gear', 'Measure airspeed'], 'The pilot does not have to hold a constant pressure.'),
    tf('The powerplant of a light aeroplane consists of the engine and propeller.', true, 'Together they produce thrust.'),
  ],
  missionId: 'm-ppl-components', sources: ['phak'],
});

export const cockpit = lesson('Cockpit familiarisation', {
  id: 'ppl-cockpit-familiarisation', title: 'Cockpit Familiarisation', minutes: 10, level: 1, prereqs: ['ppl-basic-aircraft-components'],
  objectives: ['Name the six basic flight instruments.', 'Describe the standard instrument layout.', 'Identify the main cockpit controls.', 'Explain why checklists are used.'],
  intro: 'A cockpit can look overwhelming on the first day. In fact a handful of instruments and controls do nearly all the work, and they are arranged in the same pattern in almost every training aircraft.',
  simple: 'Six instruments tell you how fast, how high, which way and at what attitude you are flying. A few controls change those things. Everything is done in a set order, read from a checklist.',
  sections: [
    { h: 'The six basic instruments', body: [
      'The **airspeed indicator** shows speed through the air. The **attitude indicator** shows pitch and bank against an artificial horizon. The **altimeter** shows altitude. The **turn coordinator** shows rate of turn and balance. The **heading indicator** shows direction. The **vertical speed indicator** shows rate of climb or descent.',
      'They are arranged in two rows of three. The airspeed indicator, attitude indicator and altimeter across the top, with the heading indicator below the attitude indicator, form the **basic T**.',
    ], lab: 'explore:six-pack' },
    { h: 'Main controls', body: [
      'The **control column** or stick moves the ailerons and elevator; the **rudder pedals** move the rudder and, on the ground, steer and brake. The **throttle** sets engine power. The **mixture** control sets the ratio of fuel to air. The **flap** selector and the **trim** wheel complete the main set.',
      'Engine instruments such as the tachometer (rpm), oil pressure and oil temperature show the health of the engine.',
    ] },
    { h: 'Checklists and flows', body: [
      'Every phase of flight has a **checklist**. It ensures that vital actions are not missed, however experienced the pilot is or however rushed the moment.',
    ], note: 'Many modern trainers show the same information on electronic screens (a "glass cockpit"). The information and its arrangement follow the same logic.' },
  ],
  examples: [
    { title: 'Finding height', steps: ['You need your altitude.', 'Look at the top right of the basic T.', 'Read the altimeter.'] },
    { title: 'Changing power', steps: ['You want to climb.', 'Move the throttle forward to increase power.', 'Confirm the rise in rpm on the tachometer.'] },
  ],
  practice: [
    mcq('Which instrument shows altitude?', ['The altimeter', 'The airspeed indicator', 'The heading indicator', 'The tachometer'], 'It measures height using air pressure.'),
    mcq('The throttle controls:', ['Engine power', 'The rudder', 'The flaps', 'The radio volume'], 'Forward for more power.'),
    mcq('Which instrument shows rate of climb or descent?', ['The vertical speed indicator', 'The altimeter', 'The turn coordinator', 'The attitude indicator'], 'In feet per minute.'),
    num('How many instruments make up the basic flight instrument group?', 6, 0.01, '', 'Often called the six-pack.'),
    tf('Experienced pilots do not need checklists.', false, 'Checklists protect against omissions at every level of experience.'),
  ],
  assessment: [
    mcq('Which instrument shows pitch and bank?', ['The attitude indicator', 'The altimeter', 'The heading indicator', 'The vertical speed indicator'], 'It displays an artificial horizon.'),
    mcq('Which instrument shows speed through the air?', ['The airspeed indicator', 'The tachometer', 'The altimeter', 'The turn coordinator'], 'It reads indicated airspeed.'),
    mcq('In the basic T, the attitude indicator is:', ['At the top centre', 'At the bottom left', 'At the top right', 'At the bottom right'], 'Airspeed is to its left, altimeter to its right, heading below.'),
    mcq('The heading indicator shows:', ['The direction the aircraft is pointing', 'Height above the ground', 'Engine speed', 'Fuel quantity'], 'It is read in degrees.'),
    mcq('The rudder pedals also provide, on the ground:', ['Steering and braking', 'Engine starting', 'Flap selection', 'Radio tuning'], 'Toe brakes are usually on top of the pedals.'),
    mcq('The mixture control adjusts:', ['The ratio of fuel to air', 'The propeller pitch only', 'The cabin temperature', 'The altimeter setting'], 'It is leaned as air density falls.'),
    tf('A tachometer shows engine rpm.', true, 'Revolutions per minute.'),
  ],
  missionId: 'm-ppl-cockpit', sources: ['phak', 'afh'],
});

export const safetyCulture = lesson('Aviation safety culture', {
  id: 'ppl-aviation-safety-culture', title: 'Aviation Safety Culture', minutes: 10, level: 1, prereqs: ['ppl-introduction-to-aviation'],
  objectives: ['Explain what a safety culture is.', 'Use the IMSAFE and PAVE checklists.', 'Describe how accidents result from a chain of events.', 'Explain the value of reporting and of a go/no-go decision.'],
  intro: 'Aviation is safe because of how its people think: they expect things to go wrong, they plan for it, and they talk openly about mistakes. That attitude starts on day one of training.',
  simple: 'Most accidents are not caused by one big failure but by several small ones lining up. Good pilots check themselves as carefully as they check the aircraft, and they are willing to say "not today".',
  sections: [
    { h: 'A chain, not a single cause', body: [
      'Accidents are usually the end of a chain of small events: a late start, a skipped check, worsening weather, pressure to arrive. Removing any one link can prevent the accident.',
      'Layers of defence, such as training, checklists, procedures and air traffic control, each have gaps. An accident happens when the gaps line up. This is often pictured as slices of Swiss cheese.',
    ] },
    { h: 'Checking yourself: IMSAFE', body: [
      'Before each flight a pilot checks their own fitness: **I**llness, **M**edication, **S**tress, **A**lcohol, **F**atigue, **E**motion.',
    ], lab: 'explore:imsafe' },
    { h: 'Checking the flight: PAVE', body: [
      'Risks come from four areas: the **P**ilot, the **A**ircraft, the en**V**ironment (weather, terrain, airspace) and **E**xternal pressures such as wanting to get home.',
      'External pressure is the one most likely to push a pilot into continuing when every other sign says stop.',
    ] },
    { h: 'Speaking up', body: [
      'In a healthy safety culture, people report errors and hazards so others can learn, and honest mistakes are treated as lessons rather than punished. Deliberate rule-breaking is different.',
      'The safest decision is often made on the ground. Cancelling or delaying a flight is a normal, professional outcome.',
    ], note: 'Limits on alcohol, medication and rest are set by regulation and differ between states. IMSAFE is a personal check on top of those rules, not a replacement for them.' },
  ],
  examples: [
    { title: 'Using IMSAFE', steps: ['You slept four hours and have a cold.', 'Illness and fatigue both fail the check.', 'Do not fly today.'] },
    { title: 'Spotting external pressure', steps: ['Passengers are waiting and the weather is marginal.', 'The wish not to disappoint them is an external pressure.', 'Decide on the weather alone, as if no one were waiting.'] },
  ],
  practice: [
    mcq('In IMSAFE, the letter F stands for:', ['Fatigue', 'Fuel', 'Flaps', 'Frequency'], 'Illness, Medication, Stress, Alcohol, Fatigue, Emotion.'),
    mcq('In PAVE, the letter A stands for:', ['Aircraft', 'Altitude', 'Airspace', 'Attitude'], 'Pilot, Aircraft, enVironment, External pressures.'),
    mcq('Most accidents result from:', ['A chain of several events', 'A single unavoidable cause', 'Bad luck only', 'Aircraft design alone'], 'Breaking one link can prevent the accident.'),
    mcq('Feeling you must get home tonight is an example of:', ['External pressure', 'An aircraft defect', 'A weather hazard', 'A medical condition'], 'It is the E in PAVE.'),
    tf('Cancelling a flight because of doubt is a sign of poor piloting.', false, 'It is a normal and professional decision.'),
  ],
  assessment: [
    mcq('In IMSAFE, the letter M stands for:', ['Medication', 'Mixture', 'Mass', 'Magneto'], 'Some medicines affect alertness and judgement.'),
    mcq('In IMSAFE, the letter S stands for:', ['Stress', 'Speed', 'Stall', 'Squawk'], 'Stress reduces attention and decision quality.'),
    mcq('In PAVE, the letter V stands for:', ['enVironment: weather, terrain and airspace', 'Velocity', 'Visibility only', 'Voltage'], 'Everything outside the aircraft.'),
    mcq('The "Swiss cheese" picture shows that an accident happens when:', ['Gaps in several layers of defence line up', 'One layer is perfect', 'There are no defences', 'The pilot is alone'], 'Each defence has weaknesses; safety comes from having several.'),
    mcq('In a healthy safety culture, an honest mistake is:', ['Reported so that others can learn from it', 'Hidden', 'Always punished', 'Ignored'], 'Open reporting reveals hazards before they cause harm.'),
    tf('A pilot should check their own fitness before every flight.', true, 'The pilot is part of the system and can fail too.'),
    mcq('The best time to decide not to fly is usually:', ['On the ground, before departure', 'After take-off', 'On final approach', 'After landing'], 'Every option is still open on the ground.'),
  ],
  missionId: 'm-ppl-safety', sources: ['phak'],
});
