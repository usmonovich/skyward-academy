// CPL — Human Performance and Crew Communication (4 lessons) and Air Law and Commercial Operations (3 lessons).
// Checked on 12 Nov 2026 against: 14 CFR §§61.23, 61.123, 61.129, 61.133 (Cornell LII copy) and the
// original text of Regulation (EU) No 1178/2011 (FCL.300, FCL.305, MED.A.045).
import { lesson, mcq, num, tf } from './q';

export const commercialHp = lesson('Human performance', {
  id: 'cpl-human-performance-in-commercial-operations', title: 'Human Performance in Commercial Operations', minutes: 12, level: 3, prereqs: ['ppl-fatigue-stress-and-fitness-to-fly'],
  objectives: ['Describe the circadian rhythm and its low point.', 'Explain jet lag and sleep inertia.', 'Describe automation complacency and the startle effect.', 'Explain the purpose of flight time limitations.'],
  intro: 'Prerequisite review: fatigue slows reactions and hides its own effects, and a moderate level of stress gives the best performance. Commercial flying adds night duties, time zones, long quiet cruises and highly automated aircraft, each with its own effect on the human at the controls.',
  simple: 'The body runs on a daily clock and is at its worst in the small hours. Crossing time zones leaves that clock in the wrong place. Long, quiet, automated flights make people less alert, and a sudden surprise can freeze thinking for a few seconds.',
  sections: [
    { h: 'The body clock', body: [
      'The **circadian rhythm** is the body\'s roughly 24-hour cycle of alertness, temperature and hormones. Alertness is lowest in the **window of circadian low**, about 02:00 to 06:00 body-clock time.',
      '**Jet lag** occurs when the body clock is out of step with local time after crossing time zones. It adjusts by only about an hour or so per day.',
      '**Sleep inertia** is the grogginess for some minutes after waking, which matters after a nap in flight or an early call-out.',
    ], lab: 'explore:commercial-hf' },
    { h: 'Managing fatigue', body: [
      '**Flight and duty time limitations** set maximum duty periods and minimum rest. They are a legal floor: a crew member who is too tired to operate safely must say so, even within the limits.',
      'Countermeasures include planned sleep before duty, strategic use of caffeine, bright light, and, where the operator permits, controlled rest on the flight deck.',
    ] },
    { h: 'Automation', body: [
      'People are poor at monitoring systems that rarely fail. **Automation complacency** is the tendency to stop checking; **mode confusion** is not knowing what the automation is doing.',
      'Manual flying skills fade without practice, so operators require them to be kept current.',
    ] },
    { h: 'Startle', body: [
      'A sudden, unexpected event can produce **startle**: a few seconds of disrupted thinking and sometimes an instinctive, wrong control input. The defence is a trained first response: pause, fly the aircraft, then diagnose.',
    ], note: 'Flight time limitations differ between states and types of operation. The figures that apply to you are in your operator\'s manual.' },
  ],
  examples: [
    { title: 'Night approach', steps: ['An approach is planned for 04:00 body-clock time after a long duty.', 'This is inside the window of circadian low.', 'Brief it as a threat: slow the pace, cross-check each other, use the automation and standard calls.'] },
    { title: 'After a nap', steps: ['A pilot wakes from controlled rest twenty minutes before descent.', 'Sleep inertia may last several minutes.', 'Allow time to recover fully before taking over any task.'] },
  ],
  practice: [
    mcq('The circadian rhythm is:', ['The body\'s roughly 24-hour cycle', 'A type of turbulence', 'An engine vibration', 'A radio frequency'], 'It governs alertness, temperature and hormones.'),
    mcq('Jet lag is caused by:', ['The body clock being out of step with local time', 'Engine noise', 'Low cabin humidity only', 'High altitude alone'], 'After crossing several time zones.'),
    mcq('Sleep inertia is:', ['Grogginess for some minutes after waking', 'Difficulty falling asleep', 'A type of hypoxia', 'A sleep disorder caused by alcohol'], 'Allow time before performing tasks.'),
    mcq('Automation complacency is the tendency to:', ['Stop monitoring a reliable automatic system', 'Over-use manual flying', 'Distrust all automation', 'Read checklists too often'], 'Humans are poor monitors of rare failures.'),
    tf('A crew member within the legal duty limits is always fit to operate.', false, 'Limits are a legal floor; fitness on the day is still the individual\'s responsibility.'),
  ],
  assessment: [
    mcq('The window of circadian low is approximately:', ['02:00 to 06:00 body-clock time', '10:00 to 14:00', '18:00 to 20:00', '06:00 to 08:00'], 'Alertness and performance are at their lowest.'),
    mcq('After crossing time zones, the body clock adjusts at about:', ['An hour or so per day', 'Ten hours per day', 'Instantly', 'One hour per month'], 'Full adjustment after a long-haul trip can take many days.'),
    mcq('Flight and duty time limitations exist to:', ['Limit fatigue by setting maximum duty and minimum rest', 'Increase aircraft utilisation', 'Reduce fuel burn', 'Shorten flights'], 'They are a legal minimum protection.'),
    mcq('Mode confusion means:', ['Not knowing what the automation is doing', 'Selecting the wrong radio frequency', 'Misreading the fuel gauge', 'Confusing left and right'], 'The flight mode annunciator is the defence.'),
    mcq('The startle effect is:', ['A brief disruption of thinking after a sudden, unexpected event', 'Tiredness after a long flight', 'A reaction to turbulence only', 'A visual illusion'], 'It can trigger a wrong instinctive input.'),
    mcq('The trained first response to a startling event is to:', ['Pause, fly the aircraft, then diagnose', 'Act instantly on the first idea', 'Disconnect everything', 'Hand over control without a word'], 'Control first; analysis second.'),
    tf('Manual flying skills fade if they are not practised.', true, 'Operators require them to be kept current.'),
  ],
  missionId: 'm-cpl-hp', sources: ['phak'],
});

export const crewComms = lesson('Human performance', {
  id: 'cpl-crew-communication', title: 'Crew Communication', minutes: 12, level: 3, prereqs: ['cpl-human-performance-in-commercial-operations'],
  objectives: ['Define crew resource management.', 'Describe the roles of pilot flying and pilot monitoring.', 'Use closed-loop communication and standard calls.', 'Apply a graded way of raising a concern.'],
  intro: 'Prerequisite review: situational awareness is lost through distraction and fixation, and hazardous attitudes distort judgement. With two pilots, the aircraft has two chances to catch every error, but only if they talk to each other in a way that works.',
  simple: 'A crew is safer than one pilot only if both speak up and both listen. One flies while the other watches and checks. Instructions are repeated back. If something looks wrong, the junior pilot says so, more firmly each time, until it is dealt with.',
  sections: [
    { h: 'Crew resource management', body: [
      '**Crew resource management** (CRM) is the effective use of all available resources, people, equipment and information, to achieve safe and efficient flight. It covers communication, leadership, workload management, situational awareness and decision-making.',
    ] },
    { h: 'Roles', body: [
      'The **pilot flying** (PF) controls the flight path. The **pilot monitoring** (PM) monitors the flight path and the PF, runs the checklists and handles the radio. Monitoring is an active duty, not a rest.',
      'These roles are separate from rank: a captain may be PM and a first officer PF.',
    ] },
    { h: 'How crews talk', body: [
      '**Closed-loop communication**: the sender states, the receiver repeats back, the sender confirms. **Standard calls** at set points remove ambiguity. **Briefings** before departure and approach build a shared plan, including what will be done if things go wrong.',
      'A **sterile cockpit** means no conversation unrelated to the operation during critical phases, commonly below 10,000 ft.',
    ], lab: 'explore:crm' },
    { h: 'Speaking up', body: [
      'A steep **authority gradient** stops junior crew from speaking; a flat one blurs who decides. The aim is a commander who invites challenge and a first officer who gives it.',
      'One graded method is **PACE**: **P**robe (ask a question), **A**lert (state the concern), **C**hallenge (state the consequence and what you want), **E**mergency action (take over if safety demands).',
    ], note: 'CRM methods and standard calls are defined by each operator. The 10,000 ft sterile cockpit boundary is common practice and a United States rule for airline operations; it was not checked against the regulation text.' },
  ],
  examples: [
    { title: 'Closed loop', steps: ['PF: "Set heading two four zero."', 'PM: "Heading two four zero set."', 'PF checks the selector and says: "Checked."'] },
    { title: 'Using PACE', steps: ['The captain is descending below the cleared altitude.', 'Probe: "Confirm we are cleared to four thousand?" Alert: "We are passing three thousand eight hundred."', 'Challenge: "We must climb back to four thousand now." If nothing happens, take action.'] },
  ],
  practice: [
    mcq('Crew resource management is:', ['The effective use of all available resources for safe flight', 'A type of autopilot', 'A fuel policy', 'A maintenance schedule'], 'People, equipment and information.'),
    mcq('The pilot monitoring is responsible for:', ['Monitoring the flight path and the pilot flying', 'Resting during the cruise', 'Serving the passengers', 'Nothing until asked'], 'Monitoring is an active task.'),
    mcq('A sterile cockpit means:', ['No non-essential conversation during critical phases of flight', 'A cleaned flight deck', 'No talking at any time', 'No checklists'], 'Attention stays on the operation.'),
    mcq('In PACE, the letter A stands for:', ['Alert', 'Abort', 'Ask', 'Autopilot'], 'State the concern clearly.'),
    tf('A first officer should stay silent if the captain makes an error.', false, 'Speaking up is a duty.'),
  ],
  assessment: [
    mcq('The pilot flying is responsible for:', ['Controlling the flight path', 'Running the checklists and the radio', 'The cabin service', 'Refuelling'], 'The pilot monitoring supports and checks.'),
    mcq('Closed-loop communication consists of:', ['Statement, readback and confirmation', 'A statement only', 'Hand signals', 'Written notes only'], 'The sender confirms the readback is correct.'),
    mcq('A very steep authority gradient tends to:', ['Stop junior crew members from speaking up', 'Improve teamwork', 'Reduce the captain\'s workload', 'Have no effect'], 'Errors then go unchallenged.'),
    mcq('The order of the PACE steps is:', ['Probe, alert, challenge, emergency action', 'Panic, act, call, escape', 'Plan, ask, check, end', 'Push, alert, climb, exit'], 'Each step is firmer than the last.'),
    mcq('A briefing before an approach is intended to:', ['Build a shared plan, including what to do if things go wrong', 'Fill time', 'Replace the checklist', 'Entertain the passengers'], 'Both pilots then expect the same sequence.'),
    mcq('The roles of pilot flying and pilot monitoring are:', ['Separate from rank', 'Always captain and first officer respectively', 'Fixed for a whole career', 'Decided by air traffic control'], 'Either pilot may fill either role.'),
    tf('Standard calls reduce ambiguity between crew members.', true, 'Both know exactly what a call means.'),
  ],
  missionId: 'm-cpl-crm', sources: ['phak'],
});

export const riskManagement = lesson('Human performance', {
  id: 'cpl-risk-management', title: 'Risk Management', minutes: 12, level: 3, prereqs: ['ppl-aviation-safety-culture', 'cpl-crew-communication'],
  objectives: ['Distinguish a hazard from a risk.', 'Score a risk from likelihood and severity.', 'Describe how risks are mitigated.', 'Name the components of a safety management system.'],
  intro: 'Prerequisite review: accidents come from chains of events, and PAVE sorts the risks of a flight into pilot, aircraft, environment and external pressures. Commercial operators manage those risks formally and continuously, and every pilot is part of that system.',
  simple: 'A hazard is something that could cause harm. Risk is how likely that harm is, and how bad it would be. Score both, deal with the worst first, and accept only what has been made as low as reasonably possible.',
  sections: [
    { h: 'Hazard and risk', body: [
      'A **hazard** is a condition with the potential to cause harm: a wet runway, a tired crew, a new procedure. **Risk** is the assessment of a hazard\'s consequences in terms of **likelihood** and **severity**.',
    ] },
    { h: 'Scoring', body: [
      'A simple **risk matrix** rates likelihood and severity from 1 to 5 and multiplies them: `risk score = likelihood × severity`. A hazard with likelihood 3 and severity 4 scores 12.',
      'High scores are unacceptable until reduced; medium scores need mitigation and a decision at the right level; low scores are accepted and monitored.',
    ], formula: 'risk-score', lab: 'formula:risk-score' },
    { h: 'Mitigation', body: [
      'Risk is reduced by lowering the **likelihood** (avoid the hazard, add a barrier, train) or the **severity** (carry more fuel, choose a longer runway, add protection). The aim is risk that is **as low as reasonably practicable**.',
      'Risk cannot be reduced to zero. What matters is that it is known, reduced and deliberately accepted.',
    ] },
    { h: 'Safety management systems', body: [
      'A **safety management system** (SMS) has four components: **safety policy and objectives**, **safety risk management**, **safety assurance**, and **safety promotion**.',
      'Pilots contribute by reporting hazards and occurrences, and by using tools such as a flight risk assessment before departure.',
    ], note: 'Scales and thresholds differ between operators. The four-component structure is from ICAO safety management guidance, quoted from memory.' },
  ],
  examples: [
    { title: 'Scoring', steps: ['A hazard is judged likelihood 2, severity 5.', '2 × 5.', 'Risk score = 10: mitigation is needed.'] },
    { title: 'Mitigating', steps: ['A short, wet runway with a tailwind scores high.', 'Options: wait for the wind to change, reduce mass, or use another runway.', 'Each reduces likelihood or severity until the risk is acceptable.'] },
  ],
  practice: [
    num('Likelihood 2, severity 5. Risk score?', 10, 0.01, '', '2 × 5 = 10.'),
    mcq('A hazard is:', ['A condition with the potential to cause harm', 'The chance of harm occurring', 'An accident', 'A type of insurance'], 'Risk is the assessment of it.'),
    mcq('Carrying extra fuel when holding is expected mainly reduces:', ['The severity of the consequences', 'The likelihood of holding', 'The weight of the aircraft', 'The need for a flight plan'], 'The delay still happens, but it matters less.'),
    mcq('ALARP stands for:', ['As low as reasonably practicable', 'All landings are really perfect', 'Always land at a regional airport', 'Aircraft load and range planning'], 'The target for residual risk.'),
    tf('With enough effort, risk in aviation can be reduced to zero.', false, 'It can be reduced and managed, not eliminated.'),
  ],
  assessment: [
    num('Likelihood 3, severity 4. Risk score?', 12, 0.01, '', '3 × 4 = 12.'),
    num('Likelihood 5, severity 2. Risk score?', 10, 0.01, '', '5 × 2 = 10.'),
    num('How many components does a safety management system have?', 4, 0.01, '', 'Policy and objectives, risk management, assurance, promotion.'),
    mcq('Risk is assessed in terms of:', ['Likelihood and severity', 'Speed and altitude', 'Cost and time', 'Weight and balance'], 'How probable, and how bad.'),
    mcq('Mitigation works by reducing:', ['The likelihood or the severity of the consequence', 'The number of reports', 'The size of the crew', 'The length of the briefing'], 'Either lowers the risk score.'),
    mcq('Reporting hazards and occurrences is part of:', ['A safety management system', 'The fuel policy', 'The noise abatement procedure', 'The passenger briefing'], 'It feeds safety risk management.'),
    mcq('A high risk score means the risk is:', ['Unacceptable until reduced', 'Acceptable without action', 'Irrelevant', 'Always fatal'], 'Mitigate before proceeding.'),
  ],
  missionId: 'm-cpl-risk', sources: ['phak'],
});

export const emergencyDecisions = lesson('Human performance', {
  id: 'cpl-emergency-decision-making', title: 'Emergency Decision-Making', minutes: 12, level: 3, prereqs: ['cpl-risk-management', 'ppl-emergency-procedures'],
  objectives: ['Distinguish time-critical from non-time-critical situations.', 'Apply the FORDEC model.', 'Explain memory items and checklist discipline.', 'Distinguish "land as soon as possible" from "as soon as practicable".'],
  intro: 'Prerequisite review: in any emergency the order is aviate, navigate, communicate, and a structured model such as DECIDE guards against snap judgements. A crew has more capacity than a single pilot, and a method for using it well when the pressure is highest.',
  simple: 'A few emergencies need instant action from memory. Most give you time, and the best thing to do with it is to stop, gather the facts, list the options and choose together. Then act, and check that the choice is still right.',
  sections: [
    { h: 'How much time is there?', body: [
      'A **time-critical** situation, such as an engine fire, a rejected take-off or a decompression, is handled first with **memory items**: a small number of actions done at once without reference to a checklist.',
      'Everything else is **non-time-critical**: there is time to use the checklist and to think. Rushing those situations creates new problems.',
    ] },
    { h: 'FORDEC', body: [
      '**F**acts: what is actually happening? **O**ptions: what could we do? **R**isks and benefits of each option. **D**ecision: choose. **E**xecution: who does what, and when. **C**heck: is it working, and has anything changed?',
      'The check loops back to the facts. A decision is kept under review until the aircraft is on the ground.',
    ], lab: 'explore:fordec' },
    { h: 'Discipline', body: [
      'One pilot flies and communicates; the other works the checklist, reading each item aloud and confirming it. Irreversible actions, such as shutting down an engine, are **confirmed by both pilots** before they are taken.',
    ] },
    { h: 'How soon to land', body: [
      '**"Land as soon as possible"** means at the nearest aerodrome where a safe landing can be made. **"Land as soon as practicable"** means the landing place and the duration of flight are at the commander\'s discretion, but extended flight is not recommended.',
      'Informing air traffic control early, and the cabin crew and passengers when time allows, is part of managing the emergency.',
    ], note: 'FORDEC is one of several decision models used by operators. The definitions of the two landing phrases follow common flight manual usage; check the wording in the manual for your aircraft.' },
  ],
  examples: [
    { title: 'Time to think', steps: ['A generator fails in cruise; the other is carrying the load.', 'There is no immediate threat.', 'Complete the checklist, then use FORDEC to decide whether to continue or divert.'] },
    { title: 'Confirming an irreversible action', steps: ['The checklist calls for shutting down the left engine.', 'PM: "Left fuel lever, confirm?" PF looks and says: "Left confirmed."', 'Only then is it moved.'] },
  ],
  practice: [
    mcq('Memory items are:', ['Immediate actions performed without reference to a checklist', 'Items the crew may forget', 'Optional actions', 'Notes in the logbook'], 'Used when there is no time to read.'),
    mcq('In FORDEC, the letter O stands for:', ['Options', 'Oxygen', 'Operations', 'Outcome'], 'What could be done.'),
    mcq('In FORDEC, the final step is to:', ['Check that the decision is working', 'Find the facts', 'Choose an option', 'Assign tasks'], 'And loop back if the situation has changed.'),
    mcq('"Land as soon as possible" means:', ['At the nearest aerodrome where a safe landing can be made', 'At the planned destination', 'After burning off fuel', 'When convenient'], 'Do not overfly a suitable aerodrome.'),
    tf('In a non-time-critical failure, acting as fast as possible is the safest approach.', false, 'Rushing creates new errors; use the time available.'),
  ],
  assessment: [
    mcq('A time-critical emergency is first handled with:', ['Memory items', 'A long discussion', 'A written report', 'A passenger announcement'], 'Then the checklist confirms and continues.'),
    mcq('The first step of FORDEC is:', ['Facts', 'Options', 'Decision', 'Execution'], 'Establish what is actually happening.'),
    mcq('In FORDEC, the letter R stands for:', ['Risks and benefits', 'Radio', 'Runway', 'Report'], 'Weigh each option.'),
    mcq('Before an irreversible action such as shutting down an engine:', ['Both pilots confirm the correct control', 'The pilot monitoring acts alone', 'No confirmation is needed', 'Air traffic control must approve'], 'Shutting down the wrong engine has caused accidents.'),
    mcq('"Land as soon as practicable" means:', ['The landing place is at the commander\'s discretion, but extended flight is not recommended', 'Land at the nearest aerodrome immediately', 'Continue to the destination without change', 'Hold until fuel is low'], 'Less urgent than "as soon as possible".'),
    mcq('During an emergency checklist, the usual division of tasks is:', ['One pilot flies and communicates; the other works the checklist', 'Both pilots read the checklist', 'Both pilots fly', 'Nobody flies'], 'Someone must always be flying the aircraft.'),
    tf('A decision made in an emergency should be reviewed as the situation develops.', true, 'The check step loops back to the facts.'),
  ],
  missionId: 'm-cpl-fordec', sources: ['phak'],
});

export const commercialLaw = lesson('Air law', {
  id: 'cpl-air-law-for-commercial-pilots', title: 'Air Law for Commercial Pilots', minutes: 12, level: 3, prereqs: ['ppl-licensing-and-medical-requirements'],
  objectives: ['State the age and experience requirements for a commercial licence.', 'State the privileges of a commercial licence.', 'State commercial medical certificate validity.', 'Explain the role of the air operator certificate and the commander\'s authority.'],
  intro: 'Prerequisite review: a private licence allows flight without remuneration, needs a valid medical, and three take-offs and landings in 90 days to carry passengers. A commercial licence allows a pilot to be paid, but being paid to carry the public needs more than the licence alone.',
  simple: 'You must be 18 and have more flying experience to hold a commercial licence, and you need a stricter medical that is renewed more often. The licence lets you be paid to fly. Carrying paying passengers also needs an approved operator behind you.',
  sections: [
    { h: 'Requirements', body: [
      'The minimum age for a commercial pilot licence is **18** under both European (FCL.300) and United States (14 CFR §61.123) rules.',
      'United States rules (§61.129) require at least **250 hours** of flight time for the single-engine aeroplane commercial certificate, including 100 hours as pilot in command. European requirements depend on the course followed; ICAO Annex 1 sets 200 hours, or 150 on an approved course.',
    ], lab: 'explore:cpl-requirements' },
    { h: 'Privileges', body: [
      'A European CPL holder may exercise all the privileges of a PPL; act as pilot in command or co-pilot in operations other than commercial air transport; act as pilot in command of **single-pilot** aircraft in commercial air transport; and act as co-pilot in commercial air transport (FCL.305).',
      'A United States commercial pilot may act as pilot in command of an aircraft carrying persons or property for compensation or hire, provided the pilot is qualified for the operation (§61.133).',
    ] },
    { h: 'Medical', body: [
      'A European CPL requires a **Class 1** medical, valid for **12 months**, reduced to **6 months** for pilots aged 40 or over in single-pilot commercial air transport carrying passengers, and for pilots aged 60 or over.',
      'A United States commercial certificate requires a **second-class** medical, valid for 12 calendar months.',
    ] },
    { h: 'Operators and commanders', body: [
      'Commercial air transport may be conducted only by an operator holding an **air operator certificate** (AOC), which shows the operator has the organisation, procedures and aircraft to operate safely. A licence alone does not allow a pilot to sell flights to the public.',
      'The **commander** has final authority and responsibility for the safety of the aircraft and everyone on board, and may depart from rules and procedures in an emergency to the extent necessary for safety.',
    ], note: 'Ages, the 250-hour figure, privileges and medical validity were read from 14 CFR and from the original text of Regulation (EU) No 1178/2011 on 12 Nov 2026. The ICAO hours and the statements about air operator certificates are from memory. Current regulations of your own authority take priority.' },
  ],
  examples: [
    { title: 'Can I sell this flight?', steps: ['A new CPL holder is asked to fly paying passengers in their own aircraft.', 'Carrying the public for payment is commercial air transport.', 'It requires an air operator certificate, not just the licence.'] },
    { title: 'Medical validity', steps: ['A 45-year-old pilot flies single-pilot commercial air transport with passengers in Europe.', 'Aged 40 or over in that role.', 'The Class 1 medical is valid for 6 months.'] },
  ],
  practice: [
    num('What is the minimum age, in years, for a commercial pilot licence?', 18, 0.01, '', '18 under both European and United States rules.'),
    mcq('A European CPL requires a medical certificate of:', ['Class 1', 'Class 2', 'Class 3', 'No class'], 'The professional standard.'),
    mcq('Commercial air transport may be conducted only by an operator holding:', ['An air operator certificate', 'A private pilot licence', 'A radio licence only', 'A noise certificate only'], 'It shows the operator can operate safely.'),
    mcq('Final authority for the safety of the aircraft rests with:', ['The commander', 'The passengers', 'The airport manager', 'The fuel supplier'], 'Together with the responsibility.'),
    tf('A commercial licence alone allows a pilot to sell seats to the public.', false, 'An air operator certificate is also required.'),
  ],
  assessment: [
    num('Under United States rules (14 CFR §61.129), how many hours of flight time does the single-engine aeroplane commercial certificate require at minimum?', 250, 0.5, 'h', 'At least 250 hours.'),
    num('For how many months is a European Class 1 medical normally valid?', 12, 0.1, 'months', '12 months, reduced to 6 in certain cases.'),
    num('For how many months is a European Class 1 medical valid for a pilot aged 60 or over?', 6, 0.1, 'months', 'Reduced to 6 months.'),
    mcq('A United States commercial pilot certificate requires a medical certificate of at least:', ['Second class', 'Third class', 'No medical', 'A driver\'s licence'], 'Valid for 12 calendar months.'),
    mcq('Under European rules, a CPL holder in commercial air transport may act as pilot in command of:', ['Single-pilot aircraft', 'Any airliner', 'No aircraft', 'Only gliders'], 'Command of multi-pilot aircraft in commercial air transport needs an ATPL.'),
    mcq('An air operator certificate shows that the operator:', ['Has the organisation, procedures and aircraft to operate safely', 'Owns an airport', 'Has paid its fuel bills', 'Employs only captains'], 'It is issued by the authority.'),
    tf('In an emergency the commander may depart from rules to the extent necessary for safety.', true, 'The commander has final authority and responsibility.'),
  ],
  missionId: 'm-cpl-law', sources: ['easa-fcl', 'cfr-61', 'icao-a1'],
});

export const opsProcedures = lesson('Operations', {
  id: 'cpl-operational-procedures', title: 'Operational Procedures', minutes: 12, level: 3, prereqs: ['cpl-air-law-for-commercial-pilots'],
  objectives: ['Explain standard operating procedures.', 'Explain the minimum equipment list.', 'Describe the handling of dangerous goods.', 'Describe ground de-icing responsibilities.'],
  intro: 'Prerequisite review: commercial air transport is run by a certificated operator, and the commander has final responsibility. Between the two sits the operations manual: the written procedures that make every flight by every crew predictable.',
  simple: 'Commercial crews fly by the operator\'s written procedures, so any two pilots can work together. A list says which items may be broken and the flight still go. Some cargo is dangerous and needs special handling. In winter, the commander must be sure the aircraft is clean.',
  sections: [
    { h: 'Standard operating procedures', body: [
      '**Standard operating procedures** (SOPs) define who does what, when, and with which calls, for every phase of flight. They let crew members who have never met work together, and make any deviation obvious.',
      'They are contained in the **operations manual**, which the operator must provide and the crew must follow.',
    ], lab: 'explore:ops-docs' },
    { h: 'Minimum equipment list', body: [
      'The **minimum equipment list** (MEL) states which items of equipment may be inoperative at dispatch, under what conditions and for how long. It is written by the operator from the manufacturer\'s **master MEL** and may not be less restrictive than it.',
      'If an item is not listed as deferrable, it must work. The MEL applies before flight; after take-off, failures are handled with the abnormal checklists.',
    ] },
    { h: 'Dangerous goods', body: [
      '**Dangerous goods** are articles or substances that can pose a risk to health, safety or the aircraft: flammable liquids, compressed gases, corrosives, lithium batteries and others. An operator needs approval to carry them as cargo, and the commander must be told in writing what is on board and where.',
      'Passengers may carry only limited items, and undeclared dangerous goods are a recognised hazard.',
    ] },
    { h: 'Winter operations', body: [
      'The commander must not begin a take-off unless the critical surfaces are free of frost, ice and snow. After de-icing and anti-icing, the **holdover time** gives the expected protection; if it is exceeded, or in doubt, the aircraft is inspected or treated again.',
    ], note: 'Details differ between operators and states. This lesson describes the concepts; the operations manual of your operator gives the rules you fly by.' },
  ],
  examples: [
    { title: 'Using the MEL', steps: ['A cabin reading light is inoperative before departure.', 'The MEL lists it as deferrable with no restrictions.', 'The flight may depart; the defect is recorded for repair within the stated time.'] },
    { title: 'Holdover exceeded', steps: ['Take-off is delayed in snow beyond the holdover time.', 'Protection can no longer be assumed.', 'Return for inspection and, if needed, re-treatment.'] },
  ],
  practice: [
    mcq('Standard operating procedures:', ['Define who does what and when in every phase of flight', 'Are optional suggestions', 'Apply only to cabin crew', 'Are written by air traffic control'], 'They make crews predictable to each other.'),
    mcq('The minimum equipment list states:', ['Which equipment may be inoperative at dispatch, and under what conditions', 'The minimum fuel required', 'The minimum crew age', 'The minimum runway length'], 'It is used before flight.'),
    mcq('Lithium batteries are an example of:', ['Dangerous goods', 'Catering supplies', 'Standard baggage with no restrictions', 'Ballast'], 'They can catch fire.'),
    mcq('Holdover time relates to:', ['Protection given by anti-icing fluid on the ground', 'Time spent in a holding pattern', 'Passenger boarding', 'Engine cooling'], 'If exceeded, inspect or treat again.'),
    tf('An operator\'s minimum equipment list may be less restrictive than the manufacturer\'s master list.', false, 'It may be more restrictive, never less.'),
  ],
  assessment: [
    mcq('The document containing an operator\'s procedures is the:', ['Operations manual', 'Passenger ticket', 'Fuel receipt', 'Weather chart'], 'The crew must follow it.'),
    mcq('An operator\'s MEL is based on:', ['The manufacturer\'s master minimum equipment list', 'The passengers\' preferences', 'The airport\'s rules', 'The fuel price'], 'And may not be less restrictive.'),
    mcq('If an inoperative item is not listed in the MEL as deferrable, the aircraft:', ['Must not depart until it is fixed', 'May depart anyway', 'May depart with fewer passengers', 'May depart at night only'], 'Anything not listed must work.'),
    mcq('The MEL applies:', ['Before flight, at dispatch', 'Only after take-off', 'Only after landing', 'Never'], 'In flight, abnormal checklists apply.'),
    mcq('When dangerous goods are carried as cargo, the commander must be:', ['Informed in writing of what is on board and where', 'Kept unaware', 'Asked to sign for the fuel only', 'Given a discount'], 'So that an emergency can be handled correctly.'),
    mcq('Before take-off in winter conditions, the commander must ensure that:', ['Critical surfaces are free of frost, ice and snow', 'The cabin is warm', 'The fuel is cold', 'The windows are tinted'], 'The clean aircraft concept.'),
    tf('Standard operating procedures allow crew members who have never met to work together.', true, 'Each knows what the other will do.'),
  ],
  missionId: 'm-cpl-sop', sources: ['phak'],
});

export const commercialOps = lesson('Operations', {
  id: 'cpl-commercial-flight-operations', title: 'Commercial Flight Operations', minutes: 12, level: 3, prereqs: ['cpl-operational-procedures', 'cpl-commercial-fuel-planning'],
  objectives: ['Distinguish types of commercial operation.', 'Describe operational control.', 'List the commander\'s duties before departure.', 'Calculate a passenger load factor.'],
  intro: 'Prerequisite review: the operations manual, the minimum equipment list, the fuel policy and the load sheet each govern a part of a flight. This last lesson of the commercial course puts them together as one working day, seen from the left seat.',
  simple: 'A commercial flight is a small business venture run to strict rules. Before departure the commander checks the aircraft, the weather, the fuel, the load and the paperwork, and accepts the flight. Safety decides whether it goes; economics only decides whether it was worth it.',
  sections: [
    { h: 'Types of operation', body: [
      '**Commercial air transport**: carrying passengers, cargo or mail for remuneration. **Aerial work** or specialised operations: tasks such as survey, crop spraying, photography or towing. **Flight instruction** is also paid flying.',
      'The rules are strictest where the public buys a seat.',
    ] },
    { h: 'Operational control', body: [
      '**Operational control** is the exercise of authority over the initiation, continuation, diversion or termination of a flight in the interest of safety. The operator is responsible for it and delegates it in flight to the commander.',
    ] },
    { h: 'Before departure', body: [
      'The commander confirms that: the aircraft is airworthy and the **technical log** is checked and signed; required documents are on board; the weather, NOTAMs and performance allow the flight; the fuel meets the policy; the **load sheet** is correct and within limits; the crew is fit and within duty limits; and the passengers have been **briefed**.',
      'Accepting the aircraft is a deliberate act with a signature.',
    ] },
    { h: 'The economics', body: [
      'Operators measure how full their flights are with the **load factor**: `load factor % = passengers carried ÷ seats available × 100`. 126 passengers in 180 seats is 70%.',
      'A flight below its break-even load factor loses money. That is the operator\'s commercial problem and never a reason to carry less fuel or accept a defect.',
    ], formula: 'pax-load', lab: 'formula:pax-load', note: 'This is a general picture. Each operator\'s manual states exactly what the commander must check and sign.' },
  ],
  examples: [
    { title: 'Load factor', steps: ['45 passengers are carried on an aircraft with 50 seats.', '45 ÷ 50 × 100.', 'Load factor = 90%.'] },
    { title: 'Accepting the aircraft', steps: ['The technical log shows a deferred defect.', 'Check it against the MEL and any conditions.', 'Only then sign to accept the aircraft.'] },
  ],
  practice: [
    num('45 passengers on an aircraft with 50 seats. Load factor in percent?', 90, 0.1, '%', '45 ÷ 50 × 100 = 90%.'),
    mcq('Carrying passengers for remuneration is:', ['Commercial air transport', 'Aerial work', 'Private flying', 'Flight testing'], 'The most strictly regulated type.'),
    mcq('Crop spraying is an example of:', ['Aerial work', 'Commercial air transport', 'Private flying', 'Air traffic control'], 'A specialised task, not carriage of the public.'),
    mcq('The technical log records:', ['Defects, maintenance actions and the aircraft\'s serviceability', 'The passengers\' names', 'The weather forecast', 'The ticket prices'], 'The commander checks it before accepting the aircraft.'),
    tf('A low passenger load is an acceptable reason to carry less than the required fuel.', false, 'Safety requirements do not depend on revenue.'),
  ],
  assessment: [
    num('126 passengers on an aircraft with 180 seats. Load factor in percent?', 70, 0.1, '%', '126 ÷ 180 × 100 = 70%.'),
    num('72 passengers on an aircraft with 90 seats. Load factor in percent?', 80, 0.1, '%', '72 ÷ 90 × 100 = 80%.'),
    mcq('Operational control is authority over:', ['The initiation, continuation, diversion or termination of a flight', 'Ticket sales', 'Airport security', 'Aircraft design'], 'Exercised in the interest of safety.'),
    mcq('In flight, operational control is delegated to:', ['The commander', 'The passengers', 'The fuel supplier', 'The airport'], 'The operator remains responsible.'),
    mcq('Before departure the commander confirms that the load sheet is:', ['Correct and within limits', 'Printed in colour', 'Signed by a passenger', 'Unnecessary'], 'Mass and centre of gravity must be within limits.'),
    mcq('The rules are strictest for operations in which:', ['The public buys a seat', 'The pilot flies alone', 'No passengers are carried', 'The aircraft is new'], 'Passengers cannot assess the risk themselves.'),
    tf('Passengers on a commercial flight must be given a safety briefing.', true, 'It is a required part of every departure.'),
  ],
  missionId: 'm-cpl-ops', sources: ['phak'],
});
