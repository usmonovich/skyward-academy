// PPL Phase B — Air Law (2 lessons) and Communications (3 lessons).
// Checked on 12 Nov 2026 against: 14 CFR §§61.23, 61.57, 61.109, 91.125 (Cornell LII copy);
// Regulation (EU) No 1178/2011 original text (FCL.210.A, FCL.205.A, FCL.060, MED.A.045);
// Regulation (EU) No 923/2012 original text (Appendix 1 light signals and signal area).
import { lesson, mcq, num, tf } from './q';

export const licensing = lesson('Air law', {
  id: 'ppl-licensing-and-medical-requirements', title: 'Licensing and Medical Requirements', minutes: 11, level: 2, prereqs: ['ppl-introduction-to-aviation'],
  objectives: ['State the experience required for a private pilot licence under European and United States rules.', 'State the privileges and limits of a private pilot licence.', 'Describe medical certificate validity.', 'State the recent-experience rule for carrying passengers.'],
  intro: 'A licence is three things at once: proof of training, a set of privileges, and a set of conditions that must stay true for the licence to be used. Most infringements by private pilots involve the conditions, not the flying.',
  simple: 'To get a private licence you need a minimum number of training hours, exams, a flight test and a medical. To keep using it you need a valid medical, and to carry passengers you must have flown recently.',
  sections: [
    { h: 'Experience', body: [
      'Under **European rules** (Part-FCL, FCL.210.A) an applicant for a PPL(A) needs at least **45 hours** of flight instruction, including at least 25 hours dual and 10 hours supervised solo. The solo time must include 5 hours of solo cross-country with one flight of at least 270 km (150 NM) landing at two other aerodromes.',
      'Under **United States rules** (14 CFR §61.109) the private pilot certificate for single-engine aeroplanes needs at least **40 hours**, including at least 20 hours with an instructor and 10 hours solo.',
      'Both systems also require theoretical knowledge examinations and a practical test.',
    ], lab: 'explore:ppl-requirements' },
    { h: 'Privileges', body: [
      'A PPL allows the holder to act as pilot in command **without remuneration** in **non-commercial** operations. Being paid to fly needs a commercial licence.',
      'Additional ratings and endorsements extend the licence, for example to fly at night, in cloud, or other classes of aircraft.',
    ] },
    { h: 'Medical', body: [
      'A valid medical certificate is required to exercise the licence. A European **Class 2** medical is valid for 60 months until the holder is 40, 24 months between 40 and 50, and 12 months after 50. A United States **third-class** medical is valid for 60 months if issued under age 40, and 24 months otherwise.',
      'A pilot must not fly when aware of any illness, injury or medication that makes them unfit, even with a valid certificate.',
    ] },
    { h: 'Recent experience', body: [
      'To carry passengers, a pilot must have made at least **three take-offs and three landings in the preceding 90 days** in the same type or class. Both European (FCL.060) and United States (§61.57) rules say this.',
    ], note: 'Figures are from the original text of Regulation (EU) No 1178/2011 and from 14 CFR as read on 12 Nov 2026. Rules are amended from time to time and other states differ. Your own authority\'s current regulations are the only authority for your licence.' },
  ],
  examples: [
    { title: 'Passengers after a break', steps: ['A pilot last flew four months ago.', 'No take-offs or landings in the preceding 90 days.', 'Three solo take-offs and landings are needed before carrying a passenger.'] },
    { title: 'Medical validity', steps: ['A European Class 2 medical is issued to a pilot aged 45.', 'Between 40 and 50 the validity is 24 months.', 'It is valid for 24 months.'] },
  ],
  practice: [
    num('Under European rules, how many hours of flight instruction does a PPL(A) require at minimum?', 45, 0.1, 'h', 'FCL.210.A: at least 45 hours.'),
    mcq('A private pilot licence allows the holder to fly:', ['Without remuneration, in non-commercial operations', 'For hire and reward', 'As captain of an airliner', 'Only with an instructor on board'], 'Payment for flying needs a commercial licence.'),
    num('For how many months is a European Class 2 medical valid for a holder aged 45?', 24, 0.1, 'months', '24 months between the ages of 40 and 50.'),
    mcq('To carry passengers, the three take-offs and landings must have been made within the preceding:', ['90 days', '30 days', '12 months', '24 months'], 'In the same type or class of aircraft.'),
    tf('A pilot with a valid medical certificate may fly while knowingly unfit.', false, 'Fitness on the day is the pilot\'s responsibility.'),
  ],
  assessment: [
    num('Under United States rules (14 CFR §61.109), how many hours of flight time does a private pilot certificate for single-engine aeroplanes require at minimum?', 40, 0.1, 'h', 'At least 40 hours, including 20 with an instructor and 10 solo.'),
    num('Under European rules, how many hours of dual flight instruction does a PPL(A) require at minimum?', 25, 0.1, 'h', '25 hours dual within the 45-hour total.'),
    num('How many take-offs and landings in the preceding 90 days are required to carry passengers?', 3, 0.01, '', 'Three of each.'),
    num('For how many months is a European Class 2 medical valid for a holder under 40?', 60, 0.1, 'months', '60 months until the age of 40.'),
    mcq('The European PPL(A) solo cross-country requirement includes one flight of at least:', ['270 km (150 NM)', '50 km', '1,000 km', '27 km'], 'With full-stop landings at two other aerodromes.'),
    mcq('Being paid to act as a pilot requires:', ['A commercial pilot licence', 'A private pilot licence', 'A student pilot certificate', 'Only a medical certificate'], 'The PPL is limited to non-commercial flying.'),
    tf('A medical certificate must be valid in order to exercise the privileges of a pilot licence.', true, 'Without it the licence cannot be used.'),
  ],
  missionId: 'm-ppl-licensing', sources: ['easa-fcl', 'cfr-61', 'icao-a1'],
});

export const aerodromeMarkings = lesson('Air law', {
  id: 'ppl-aerodrome-markings-and-signals', title: 'Aerodrome Markings and Signals', minutes: 12, level: 2, prereqs: ['ppl-rules'],
  objectives: ['Identify the main runway and taxiway markings.', 'Explain the runway holding position marking.', 'Interpret light signals from a control tower.', 'Read approach slope indicator lights.'],
  intro: 'An aerodrome speaks in paint and light. Misreading it leads to the most serious kind of ground error: entering a runway that someone else is using.',
  simple: 'Runway markings are white; taxiway markings are yellow. A set of four yellow lines across a taxiway marks where you must stop before a runway. If the radio fails, the tower can signal with a coloured lamp.',
  sections: [
    { h: 'Runway and taxiway markings', body: [
      '**Runway** markings are **white**: the designation number, the centreline, the threshold stripes and the aiming point. A **displaced threshold** is shown by arrows leading to a bar: the part before it may be used for taxiing and take-off but not for touchdown.',
      '**Taxiway** markings are **yellow**: a continuous centreline and edge lines.',
      'A large cross on a runway or taxiway means it is **closed**.',
    ] },
    { h: 'Runway holding position', body: [
      'The **runway holding position marking** is four yellow lines across the taxiway: two solid and two dashed. The solid lines are on the side where you must hold. Never cross from the solid side towards the dashed side without a clearance at a controlled aerodrome.',
    ] },
    { h: 'Lights', body: [
      'Runway edge lights are white, threshold lights green and runway end lights red. Taxiway edge lights are blue and taxiway centreline lights green.',
      'A **PAPI** shows four lights beside the runway: two white and two red means on the correct approach slope; more white means too high; more red means too low.',
    ] },
    { h: 'Light signals from the tower', body: [
      'To an aircraft **in flight**: steady green, cleared to land; steady red, give way to other aircraft and continue circling; green flashes, return for landing; red flashes, aerodrome unsafe, do not land.',
      'To an aircraft **on the ground**: steady green, cleared for take-off; steady red, stop; green flashes, cleared to taxi; red flashes, taxi clear of the landing area in use; white flashes, return to the starting point on the aerodrome.',
      'At uncontrolled aerodromes a **signal area** may display ground signals: a **landing T** shows the direction for landing and take-off, parallel to the shaft and towards the cross arm; a red square with yellow diagonals means landings are prohibited.',
    ], lab: 'explore:light-signals', note: 'Light signals are as given in the European rules of the air (Regulation (EU) No 923/2012, Appendix 1) and in 14 CFR §91.125, which agree on these meanings. The two differ on some others: in Europe white flashes to an aircraft in flight mean "land at this aerodrome and proceed to apron", and a red pyrotechnic means "do not land for the time being"; United States rules add alternating red and green for "exercise extreme caution".' },
  ],
  examples: [
    { title: 'At the holding point', steps: ['You taxi up to four yellow lines; the two solid lines are nearest you.', 'You are on the holding side.', 'Stop before the lines and wait for clearance.'] },
    { title: 'Radio failure in the circuit', steps: ['Your radio has failed and the tower shows a steady red light.', 'In flight this means give way and continue circling.', 'Keep circling and watch for a steady green.'] },
  ],
  practice: [
    mcq('Runway markings are coloured:', ['White', 'Yellow', 'Blue', 'Red'], 'Taxiway markings are yellow.'),
    mcq('Taxiway edge lights are:', ['Blue', 'White', 'Red', 'Green'], 'Taxiway centreline lights are green.'),
    mcq('A PAPI showing two white and two red lights means you are:', ['On the correct approach slope', 'Too high', 'Too low', 'Off the centreline'], 'More white is high; more red is low.'),
    mcq('A steady green light directed at an aircraft in flight means:', ['Cleared to land', 'Give way and continue circling', 'Aerodrome unsafe', 'Return for landing'], 'On the ground it means cleared for take-off.'),
    tf('A large cross on a runway means it is available for use.', false, 'It means the runway is closed.'),
  ],
  assessment: [
    mcq('Taxiway markings are coloured:', ['Yellow', 'White', 'Red', 'Green'], 'Runway markings are white.'),
    mcq('The runway holding position marking consists of:', ['Two solid and two dashed yellow lines across the taxiway', 'A single white line', 'Red and white squares', 'Blue chevrons'], 'Hold on the side of the solid lines.'),
    mcq('A PAPI showing four red lights means you are:', ['Too low', 'Too high', 'On the correct slope', 'Too fast'], 'All red: well below the approach slope.'),
    mcq('A steady red light directed at an aircraft in flight means:', ['Give way to other aircraft and continue circling', 'Cleared to land', 'Land immediately', 'Return to the apron'], 'On the ground it means stop.'),
    mcq('A series of red flashes directed at an aircraft in flight means:', ['Aerodrome unsafe, do not land', 'Cleared to land', 'Return for landing', 'Cleared to taxi'], 'On the ground it means taxi clear of the landing area in use.'),
    mcq('A series of green flashes directed at an aircraft on the ground means:', ['Cleared to taxi', 'Cleared for take-off', 'Stop', 'Return to the starting point'], 'In flight it means return for landing.'),
    tf('The part of a runway before a displaced threshold may be used for touchdown.', false, 'It may be used for taxiing and take-off, not for landing.'),
  ],
  missionId: 'm-ppl-markings', sources: ['sera', 'cfr-91', 'faa-aim'],
});

export const rtBasics = lesson('Communications', {
  id: 'ppl-vfr-radiotelephony-basics', title: 'VFR Radiotelephony Basics', minutes: 11, level: 2, prereqs: ['ppl-communication-fundamentals'],
  objectives: ['Transmit numbers, levels and frequencies in the standard way.', 'Use full and abbreviated call signs correctly.', 'List the items that must be read back.', 'Use the readability scale.'],
  intro: 'Radiotelephony is a skill like any other: it is learned by knowing the rules and then practising until the words come without thought. This lesson sets out the rules.',
  simple: 'Say numbers one digit at a time, except whole hundreds and thousands. Use your full call sign first, and shorten it only after the controller does. Repeat back the instructions that matter most.',
  sections: [
    { h: 'Numbers', body: [
      'Numbers are normally spoken digit by digit: heading 080 is "zero eight zero"; a QNH of 1012 is "one zero one two".',
      'Altitudes and other values in whole hundreds or thousands use those words: 2,500 ft is "two thousand five hundred feet". Flight levels are spoken by digit: "flight level one zero zero".',
      'In a frequency the decimal point is spoken as "decimal": 118.1 is "one one eight decimal one".',
    ] },
    { h: 'Call signs', body: [
      'On first contact use the **full call sign**, for example "Golf Alfa Bravo Charlie Delta". It may be **abbreviated** to the first character and the last two, "Golf Charlie Delta", but only after the ground station has used the abbreviation first.',
    ] },
    { h: 'Readback', body: [
      'Always read back: **ATC route clearances**; clearances to **enter, land on, take off from, hold short of, cross or backtrack** a runway; the **runway in use**; **altimeter settings**; **transponder codes**; **level, heading and speed** instructions; and **frequency changes**.',
      'End the readback with your call sign.',
    ], lab: 'explore:readback' },
    { h: 'Radio checks', body: [
      'A radio check is answered with a **readability** number from 1 to 5: 1 unreadable, 2 readable now and then, 3 readable with difficulty, 4 readable, 5 perfectly readable.',
    ], note: 'This is the common ICAO core. Some states differ in detail, for example using "point" instead of "decimal". Learn the phraseology published by your own authority.' },
  ],
  examples: [
    { title: 'Saying an altitude', steps: ['You are at 3,500 ft.', 'Use the words thousand and hundred.', '"Three thousand five hundred feet."'] },
    { title: 'A readback', steps: ['"Golf Charlie Delta, squawk four six two one, QNH one zero zero eight."', 'Both items must be read back.', '"Squawk four six two one, QNH one zero zero eight, Golf Charlie Delta."'] },
  ],
  practice: [
    mcq('The altitude 2,500 ft is spoken as:', ['Two thousand five hundred feet', 'Two five zero zero feet', 'Twenty-five hundred feet', 'Two point five thousand feet'], 'Whole hundreds and thousands use those words.'),
    mcq('The frequency 118.1 is spoken as:', ['One one eight decimal one', 'One hundred and eighteen point one', 'One eighteen one', 'Eleven eighty-one'], 'The decimal point is spoken as "decimal".'),
    mcq('On first contact with a station you should use:', ['Your full call sign', 'Your abbreviated call sign', 'Only your first name', 'No call sign'], 'Abbreviate only after the ground station does.'),
    mcq('Readability 5 means:', ['Perfectly readable', 'Unreadable', 'Readable with difficulty', 'Readable now and then'], 'The scale runs from 1 to 5.'),
    tf('A transponder code given by ATC does not need to be read back.', false, 'Transponder codes are read back.'),
  ],
  assessment: [
    mcq('The heading 080 is spoken as:', ['Zero eight zero', 'Eighty', 'Eight zero', 'Zero eighty'], 'Three digits, spoken one at a time.'),
    mcq('Flight level 100 is spoken as:', ['Flight level one zero zero', 'Flight level one hundred feet', 'Flight level ten', 'Level ten thousand'], 'Flight levels are spoken by digit.'),
    mcq('The call sign G-ABCD is abbreviated to:', ['Golf Charlie Delta', 'Golf Alfa Bravo', 'Charlie Delta', 'Golf Delta'], 'First character and last two.'),
    mcq('A pilot may use the abbreviated call sign:', ['Only after the ground station has used it', 'At any time', 'Never', 'Only at night'], 'The ground station decides.'),
    mcq('Which of these must always be read back?', ['A clearance to enter a runway', 'The surface wind', 'Traffic information', 'The time'], 'Runway clearances are safety-critical.'),
    mcq('Readability 1 means:', ['Unreadable', 'Perfectly readable', 'Readable', 'Readable with difficulty'], 'The lowest value on the scale.'),
    tf('An altimeter setting passed by ATC must be read back.', true, 'A wrong setting gives a wrong altitude.'),
  ],
  missionId: 'm-ppl-rt', sources: ['icao-9432', 'icao-4444'],
});

export const phraseology = lesson('Communications', {
  id: 'ppl-standard-phraseology', title: 'Standard Phraseology', minutes: 11, level: 2, prereqs: ['ppl-vfr-radiotelephony-basics'],
  objectives: ['Use the standard phrases for taxi, departure, circuit and landing.', 'Explain the special use of the words "take-off" and "cleared".', 'Respond to a conditional instruction.', 'Recognise and resolve a possible misunderstanding.'],
  intro: 'Standard phrases exist because non-standard ones have caused accidents. A few words are reserved for one meaning only, and using them loosely on the radio is how runways come to hold two aircraft.',
  simple: 'Each stage of a flight has its own short phrases. Some words are kept for one purpose only: "take-off" is said only when you are actually being cleared to take off. If anything is unclear, ask.',
  sections: [
    { h: 'On the ground', body: [
      '**"Hold position"**: do not move. **"Taxi to holding point runway two seven"**: taxi there and stop; it is not a clearance to enter the runway. **"Hold short of runway two seven"**: stop before the runway. **"Line up and wait"**: enter the runway and wait; do not take off.',
    ] },
    { h: 'The word "take-off"', body: [
      'The word **"take-off"** is used only when an aircraft is cleared for take-off or when that clearance is cancelled. At all other times the word **"departure"** is used: "ready for departure", not "ready for take-off".',
      '**"Cleared for take-off"** and **"cleared to land"** are the only phrases that permit those actions at a controlled aerodrome.',
    ] },
    { h: 'In the air', body: [
      '**"Report downwind"**, **"report final"**: call when you reach that position. **"Go around"**: abandon the approach and climb away. **"Orbit left"**: make a full left turn to lose time. **"Continue approach"**: carry on, but you are not yet cleared to land.',
      'A **conditional instruction** names a condition: "behind the landing aircraft, line up and wait behind". Read it back in full, including the condition, and be certain you have identified the right aircraft.',
    ], lab: 'explore:phraseology' },
    { h: 'When in doubt', body: [
      'If an instruction is unclear, incomplete or unexpected, ask: "say again" or "confirm cleared to land". Never act on a clearance you think was meant for you.',
    ], note: 'Phrases follow ICAO radiotelephony guidance. National phraseology differs in places: for example, the United States uses "line up and wait" but other instructions differ in wording. Use the phraseology of the state you fly in.' },
  ],
  examples: [
    { title: 'Ready at the holding point', steps: ['Checks are complete and you want to depart.', 'Do not use the word take-off.', '"Golf Charlie Delta, ready for departure."'] },
    { title: 'Conditional line-up', steps: ['"Golf Charlie Delta, behind the landing Cessna, line up and wait behind."', 'Identify the Cessna on final.', '"Behind the landing Cessna, line up and wait behind, Golf Charlie Delta."'] },
  ],
  practice: [
    mcq('"Line up and wait" means:', ['Enter the runway and wait; do not take off', 'Take off immediately', 'Hold short of the runway', 'Return to the apron'], 'A separate take-off clearance will follow.'),
    mcq('When ready to depart, a pilot reports:', ['"Ready for departure"', '"Ready for take-off"', '"Taking off"', '"Rolling"'], 'The word take-off is reserved for the clearance.'),
    mcq('"Go around" means:', ['Abandon the approach and climb away', 'Make a full turn and continue', 'Land long', 'Taxi round the apron'], 'Apply power and follow the go-around procedure.'),
    mcq('"Hold short of runway two seven" means:', ['Stop before the runway', 'Enter the runway and stop', 'Cross the runway', 'Take off from runway two seven'], 'Do not pass the holding position marking.'),
    tf('"Taxi to holding point runway two seven" is a clearance to enter the runway.', false, 'It only clears you to the holding point.'),
  ],
  assessment: [
    mcq('The word "take-off" is used on the radio:', ['Only when cleared for take-off or when that clearance is cancelled', 'Whenever a pilot is ready to go', 'During taxi', 'When reporting position'], 'Otherwise "departure" is used.'),
    mcq('"Continue approach" means:', ['Carry on with the approach; you are not yet cleared to land', 'You are cleared to land', 'Go around', 'Orbit'], 'Expect the landing clearance later.'),
    mcq('"Hold position" means:', ['Do not move', 'Hold your altitude', 'Enter the hold', 'Continue taxiing slowly'], 'Stay where you are until told otherwise.'),
    mcq('"Report final" means:', ['Call when established on final approach', 'Make your last transmission', 'Report after landing', 'Report your fuel'], 'A position report request.'),
    mcq('A conditional instruction must be:', ['Read back in full, including the condition', 'Acknowledged with "roger"', 'Ignored until the condition is met', 'Read back without the condition'], 'And the right aircraft must be identified.'),
    mcq('If you are unsure whether a landing clearance was for you, you should:', ['Ask for confirmation', 'Land anyway', 'Assume it was', 'Stay silent'], 'For example: "Confirm cleared to land."'),
    tf('At a controlled aerodrome, "cleared to land" is the phrase that permits a landing.', true, 'Without it, do not land.'),
  ],
  missionId: 'm-ppl-phraseology', sources: ['icao-9432', 'icao-4444'],
});

export const distressUrgency = lesson('Communications', {
  id: 'ppl-distress-and-urgency-calls', title: 'Distress and Urgency Calls', minutes: 10, level: 2, prereqs: ['ppl-standard-phraseology'],
  objectives: ['Distinguish distress from urgency.', 'State the content and order of an emergency call.', 'State the emergency frequency and transponder code.', 'Explain the priority of emergency messages.'],
  intro: 'Pilots in trouble often delay calling for help, out of embarrassment or the hope that the problem will pass. The emergency services would always prefer an early call that turns out not to be needed.',
  simple: 'If you are in serious and immediate danger, say MAYDAY three times. If the situation is urgent but not yet that grave, say PAN PAN three times. Then say who you are, what is wrong, what you intend to do and where you are.',
  sections: [
    { h: 'Two levels', body: [
      '**Distress**: a condition of being threatened by serious and imminent danger and requiring immediate assistance. The call begins **"MAYDAY, MAYDAY, MAYDAY"**.',
      '**Urgency**: a condition concerning the safety of an aircraft or of a person on board or in sight, which does not require immediate assistance. The call begins **"PAN PAN, PAN PAN, PAN PAN"**.',
    ] },
    { h: 'The message', body: [
      'After the prefix, as far as time allows: the **name of the station** addressed; the aircraft **call sign**; the **nature** of the emergency; the pilot\'s **intentions**; and **position, level and heading**.',
      'Add anything useful, such as the number of people on board and endurance.',
    ], lab: 'explore:distress' },
    { h: 'Where and how', body: [
      'Make the call on the **frequency in use**. If there is no reply or no frequency in use, call on **121.5 MHz**. Set the transponder to **7700**.',
      'A distress call has priority over all other transmissions; urgency has priority over everything except distress. Other stations must keep silent on the frequency until the emergency is over.',
      'When the emergency ends, cancel the call.',
    ], note: 'Fly the aircraft first: aviate, navigate, communicate. A call is made when it does not take attention away from keeping control.' },
  ],
  examples: [
    { title: 'Engine failure', steps: ['"MAYDAY, MAYDAY, MAYDAY, Westfield Tower, Golf Alfa Bravo Charlie Delta,"', '"engine failure, forced landing in a field,"', '"three miles north of Westfield, one thousand five hundred feet, heading south, two on board."'] },
    { title: 'Sick passenger', steps: ['A passenger is seriously ill but the aircraft is under control.', 'This is urgency, not distress.', 'Begin with "PAN PAN, PAN PAN, PAN PAN" and request a priority landing.'] },
  ],
  practice: [
    mcq('A distress call begins with:', ['MAYDAY, MAYDAY, MAYDAY', 'PAN PAN, PAN PAN, PAN PAN', 'EMERGENCY, EMERGENCY', 'HELP, HELP, HELP'], 'Spoken three times.'),
    mcq('Being uncertain of position with plenty of fuel and good weather is best treated as:', ['Urgency', 'Distress', 'No problem', 'A routine position report'], 'Use PAN PAN and ask for help early.'),
    num('Which transponder code is set in an emergency?', 7700, 0.1, '', 'The emergency code is 7700.'),
    mcq('An emergency call should first be made on:', ['The frequency in use', 'Any music station', 'The ground frequency only', 'A telephone'], 'Change to 121.5 MHz if there is no reply.'),
    tf('A pilot should wait until certain a forced landing is unavoidable before calling for help.', false, 'Call early; a call can always be cancelled.'),
  ],
  assessment: [
    mcq('An urgency call begins with:', ['PAN PAN, PAN PAN, PAN PAN', 'MAYDAY, MAYDAY, MAYDAY', 'SECURITE', 'ROGER, ROGER'], 'Spoken three times.'),
    mcq('Distress is defined as a condition of:', ['Serious and imminent danger requiring immediate assistance', 'Mild concern', 'Routine delay', 'Radio interference'], 'For example an engine failure or fire.'),
    mcq('After the prefix and the station addressed, the next item in an emergency message is:', ['The aircraft call sign', 'The weather', 'The fuel price', 'The destination'], 'Then nature of the emergency, intentions and position.'),
    num('What is the international emergency frequency in MHz, used if there is no reply on the frequency in use?', 121.5, 0.01, 'MHz', '121.5 MHz.'),
    mcq('A distress call has priority over:', ['All other transmissions', 'Urgency calls only', 'Nothing', 'Weather broadcasts only'], 'Other stations must not interfere.'),
    mcq('A seriously ill passenger, with the aircraft under control, is a case of:', ['Urgency', 'Distress', 'Normal operations', 'Unlawful interference'], 'It concerns the safety of a person on board.'),
    tf('In an emergency, keeping control of the aircraft comes before making the radio call.', true, 'Aviate, navigate, communicate.'),
  ],
  missionId: 'm-ppl-distress', sources: ['icao-9432', 'icao-4444'],
});
