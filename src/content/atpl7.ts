// ATPL — Air Law 010 (3), Operational Procedures 070 (3), Communications 090 (2).
// The Chicago Convention facts (signature, entry into force, Articles 1, 3 bis and 5, the 19 Annexes and
// their subjects) were checked on 14 Nov 2026 against a published summary. Everything else is written from
// memory of ICAO and operator documents and is not verified.
import { lesson, mcq, num, tf } from './q';

export const conventions = lesson('Air law', {
  id: 'atpl-international-conventions-and-icao', title: 'International Conventions and ICAO', minutes: 13, level: 3, prereqs: ['atpl-mach', 'cpl-air-law-for-commercial-pilots'],
  objectives: ['State the origin and main articles of the Chicago Convention.', 'Describe the role of ICAO and its Annexes.', 'Distinguish standards from recommended practices.', 'Describe the freedoms of the air and the nationality of aircraft.'],
  intro: 'Prerequisite review: ICAO publishes standards in Annexes, and each state turns them into law and issues licences. This lesson goes back to where that structure comes from, because the rule that explains most of international aviation law is in its first article.',
  simple: 'In 1944, nations agreed on a common treaty for civil flying. It says every country owns the airspace above it, and it created ICAO to set common technical standards. The standards are written up in nineteen Annexes, and each country must follow them or tell the world where it differs.',
  sections: [
    { h: 'The Chicago Convention', body: [
      'The **Convention on International Civil Aviation** was signed at Chicago on **7 December 1944** and entered into force on **4 April 1947**. It established **ICAO**, a United Nations specialised agency.',
      '**Article 1**: every state has complete and exclusive **sovereignty** over the airspace above its territory. **Article 3 bis**: states must refrain from using weapons against civil aircraft in flight. **Article 5**: aircraft not engaged in scheduled international air services may fly into or over other states and make non-traffic stops without prior permission, subject to the Convention.',
      'The Convention applies to **civil** aircraft; state aircraft (military, customs, police) are not covered.',
    ] },
    { h: 'The Annexes', body: [
      'The Convention is supplemented by **19 Annexes** containing standards and recommended practices (SARPs). For example: Annex 1 personnel licensing; **2** rules of the air; **3** meteorology; 4 aeronautical charts; 5 units of measurement; **6** operation of aircraft; 7 aircraft nationality and registration marks; **8** airworthiness; 9 facilitation; **10** aeronautical telecommunications; **11** air traffic services; **12** search and rescue; **13** accident investigation; **14** aerodromes; 15 aeronautical information; 16 environmental protection; 17 security; 18 dangerous goods; **19** safety management.',
    ], lab: 'explore:icao-annexes' },
    { h: 'Standards and recommended practices', body: [
      'A **Standard** is a specification whose uniform application is necessary for safety or regularity; states must comply or file a **difference** with ICAO under Article 38. A **Recommended Practice** is desirable but not obligatory.',
      'ICAO also publishes **PANS** (procedures for air navigation services) and guidance material (Documents); these are not binding in the way Standards are.',
    ] },
    { h: 'Nationality and freedoms', body: [
      'Aircraft have the nationality of the state in which they are **registered**, and carry nationality and registration marks. An aircraft may not be validly registered in more than one state.',
      'The **freedoms of the air** are bilateral rights between states. The first two, to overfly and to land for non-traffic purposes, are the "technical" freedoms; the third to fifth cover carrying traffic between states.',
    ], note: 'Article summaries and Annex subjects were checked against a published summary on 14 Nov 2026. The freedoms and Article 38 are from memory.' },
  ],
  examples: [
    { title: 'Whose rules?', steps: ['An aircraft registered in one state flies over another.', 'The state overflown has sovereignty over its airspace.', 'Its rules of the air apply, subject to the ICAO Standards it has adopted.'] },
    { title: 'A difference', steps: ['A state cannot comply with a Standard in Annex 14 for a particular aerodrome.', 'It must notify ICAO of the difference.', 'The difference is published so that operators can allow for it.'] },
  ],
  practice: [
    num('In what year was the Chicago Convention signed?', 1944, 0, '', 'It was signed on 7 December 1944.'),
    mcq('Article 1 of the Chicago Convention establishes that each state has:', ['Complete and exclusive sovereignty over its airspace', 'Shared ownership of airspace', 'Rights only over its territorial waters', 'No rights above 10,000 ft'], 'The foundation of international air law.'),
    mcq('Annex 2 deals with:', ['Rules of the air', 'Personnel licensing', 'Aerodromes', 'Dangerous goods'], 'Annex 1 is licensing; Annex 14 is aerodromes.'),
    mcq('A state that cannot comply with a Standard must:', ['Notify ICAO of the difference', 'Ignore it silently', 'Withdraw from ICAO', 'Ask the pilot'], 'Under Article 38.'),
    tf('The Chicago Convention applies to state aircraft such as military aircraft.', false, 'It applies to civil aircraft only.'),
  ],
  assessment: [
    num('How many Annexes does the Chicago Convention have?', 19, 0, '', 'Annex 19, safety management, is the most recent.'),
    mcq('The Chicago Convention entered into force in:', ['1947', '1944', '1919', '1963'], 'On 4 April 1947.'),
    mcq('Annex 6 deals with:', ['Operation of aircraft', 'Meteorology', 'Search and rescue', 'Aeronautical charts'], 'Annex 3 is meteorology.'),
    mcq('Annex 12 deals with:', ['Search and rescue', 'Airworthiness', 'Security', 'Units of measurement'], 'Annex 13 is accident investigation.'),
    mcq('Annex 13 deals with:', ['Aircraft accident and incident investigation', 'Aerodromes', 'Environmental protection', 'Facilitation'], 'Annex 14 is aerodromes.'),
    mcq('A Recommended Practice is:', ['Desirable, but not obligatory', 'Obligatory for all states', 'Legally enforceable on pilots directly', 'Cancelled yearly'], 'Standards are obligatory unless a difference is filed.'),
    mcq('Article 3 bis requires states to:', ['Refrain from using weapons against civil aircraft in flight', 'Share radar data', 'Waive landing fees', 'Allow cabotage'], 'It was added after interception incidents.'),
  ],
  missionId: 'm-atpl-icao', sources: ['chicago', 'icao-a1'],
});

export const rulesAts = lesson('Air law', {
  id: 'atpl-rules-of-the-air-and-ats', title: 'Rules of the Air and ATS', minutes: 13, level: 3, prereqs: ['atpl-international-conventions-and-icao', 'ppl-airspace'],
  objectives: ['Describe the responsibility for compliance with the rules of the air.', 'Describe the right-of-way rules.', 'Describe the air traffic services.', 'Describe separation and the use of clearances.'],
  intro: 'Prerequisite review: Annex 2 contains the rules of the air and Annex 11 the air traffic services, and airspace is divided into classes A to G with different requirements. At airline level the question is how those rules are applied when a flight crosses several states.',
  simple: 'The rules of the air apply to all aircraft over the high seas and, in practice, in most states. The commander is responsible for following them. Air traffic services help in three ways: they keep aircraft apart, they give information, and they raise the alarm if an aircraft is in trouble.',
  sections: [
    { h: 'Application', body: [
      'Annex 2 applies over the high seas without exception. Over states\' territory it applies where there is no conflict with local rules. The **pilot in command** is responsible for compliance with the rules of the air, but may depart from them in an emergency to the extent necessary for safety.',
      'Aircraft may not be operated in a negligent or reckless manner so as to endanger life or property, and may not drop objects that could cause harm.',
    ] },
    { h: 'Right of way', body: [
      'Aircraft **in distress** have priority. An aircraft that is **overtaking** keeps clear, altering course to the right; **converging** aircraft at the same level: the one that has the other on its right gives way, except that power-driven aircraft give way to airships, gliders and balloons, and to aircraft towing. **Head-on**: each alters course to the right. A landing aircraft has right of way over aircraft on the ground or in flight, and the lower aircraft on final has priority.',
    ] },
    { h: 'Services', body: [
      '**Air traffic control service** prevents collisions between aircraft and between aircraft and obstructions on the manoeuvring area, and expedites and maintains an orderly flow. **Flight information service** gives advice and information useful for the safe conduct of flights. **Alerting service** notifies rescue authorities of aircraft in need.',
      'Airspace classes: **A** IFR only, all flights separated; **B** IFR and VFR, all separated; **C** IFR separated from all, VFR separated from IFR; **D** IFR separated from IFR, VFR information only; **E** IFR separated from IFR, as far as practical; **F** advisory; **G** information only.',
    ], lab: 'explore:airspace' },
    { h: 'Clearances and separation', body: [
      'An ATC clearance authorises an aircraft to proceed under specified conditions, and is read back. Separation is by **vertical**, **lateral**, **longitudinal** and **time** means. Controllers apply minima published by the state.',
      'In flight, the pilot reports position, altitude changes and any difficulty complying with a clearance, and requests an amended clearance early.',
    ], note: 'Right-of-way rules and airspace class descriptions were summarised from memory of Annex 2 and Annex 11 and were not checked against the current text. The SERA rules checked earlier in this course are the European implementation.' },
  ],
  examples: [
    { title: 'Converging', steps: ['Two aircraft converge at the same level; one has the other on its right.', 'It must give way.', 'It should avoid passing in front of the other.'] },
    { title: 'Emergency departure', steps: ['The pilot must depart from a rule to avoid a collision.', 'Annex 2 permits departure to the extent necessary for safety.', 'The pilot informs ATC and files a report if required.'] },
  ],
  practice: [
    mcq('In a head-on situation, each aircraft alters course to the:', ['Right', 'Left', 'Up', 'Down'], 'And passes clear.'),
    mcq('Responsibility for compliance with the rules of the air rests with the:', ['Pilot in command', 'Air traffic controller', 'Aircraft owner', 'Airport operator'], 'Who may depart from them in an emergency.'),
    mcq('The alerting service:', ['Notifies rescue authorities of aircraft in need', 'Separates all aircraft', 'Provides weather forecasts only', 'Gives landing clearances'], 'One of the three air traffic services.'),
    mcq('In Class A airspace:', ['Only IFR flights are permitted, and all are separated', 'VFR flights are permitted without clearance', 'No service is provided', 'Only military aircraft may fly'], 'It is the most strictly controlled class.'),
    tf('Aircraft in distress have no priority over other traffic.', false, 'They have priority.'),
  ],
  assessment: [
    mcq('Air traffic control service aims to:', ['Prevent collisions and expedite an orderly flow of traffic', 'Provide weather forecasts', 'Provide aircraft maintenance', 'Collect landing fees'], 'It is an advisory-free control service.'),
    mcq('In Class G airspace:', ['Only flight information service is available, on request', 'ATC separates all aircraft', 'IFR is prohibited', 'VFR is prohibited'], 'It is uncontrolled.'),
    mcq('An overtaking aircraft must alter course to the:', ['Right', 'Left', 'Neither', 'Either'], 'To keep clear of the aircraft ahead.'),
    mcq('A flight information service provides:', ['Advice and information useful for the safe conduct of flights', 'Separation from all other traffic', 'Rescue', 'Refuelling'], 'It is not a control service.'),
    mcq('An ATC clearance must be:', ['Read back by the pilot', 'Ignored if inconvenient', 'Written in the logbook only', 'Passed to the passengers'], 'So that errors are caught.'),
    mcq('Separation minima are applied by:', ['The controller', 'The passengers', 'The airline', 'The fuel supplier'], 'As published by the state.'),
    tf('The pilot in command may depart from a rule of the air in an emergency to the extent necessary for safety.', true, 'And should inform ATC.'),
  ],
  missionId: 'm-atpl-rules', sources: ['icao-a2', 'icao-a11', 'sera'],
});

export const aerodromesSar = lesson('Air law', {
  id: 'atpl-aerodromes-and-search-and-rescue', title: 'Aerodromes and Search and Rescue', minutes: 13, level: 3, prereqs: ['atpl-rules-of-the-air-and-ats', 'ppl-aerodrome-markings-and-signals'],
  objectives: ['Describe the emergency phases.', 'Describe the role of the rescue coordination centre.', 'Describe ELT types and frequencies.', 'Describe aerodrome rescue and firefighting categories and obstacle limitation.'],
  intro: 'Prerequisite review: the alerting service passes information to rescue authorities, and 121.5 MHz is the international emergency frequency. Search and rescue is organised around phases, and the phase an aircraft is in decides what is launched.',
  simple: 'When an aircraft is overdue or in trouble, the rescue system moves through three stages of increasing seriousness. A coordination centre runs the search. Emergency beacons on board help the rescuers find the aircraft. At the aerodrome, fire and rescue cover must match the size of the aircraft.',
  sections: [
    { h: 'Emergency phases', body: [
      '**Uncertainty phase** (INCERFA): doubt about the safety of an aircraft and its occupants. **Alert phase** (ALERFA): apprehension about their safety. **Distress phase** (DETRESFA): reasonable certainty that the aircraft and its occupants are threatened by grave and imminent danger or already require immediate assistance.',
      'A typical trigger for the uncertainty phase is no communication received within 30 minutes of the time it should have been received, or an aircraft failing to arrive within 30 minutes of its estimated time of arrival.',
    ], lab: 'explore:sar' },
    { h: 'Organisation', body: [
      'Each search and rescue region has a **rescue coordination centre** (RCC) that organises and coordinates the response; **rescue sub-centres** assist. ATS units alert the RCC. Aircraft and ships are asked to assist where they can, and may be asked to relay.',
    ] },
    { h: 'Emergency locator transmitters', body: [
      'An **ELT** transmits a distress signal on activation, automatically on impact or manually. Modern ELTs transmit on **406 MHz**, which is detected by satellites with a coded identity and position; the older **121.5 MHz** signal is no longer monitored by satellites but is used for final homing.',
    ] },
    { h: 'Aerodrome provision', body: [
      'Aerodrome **rescue and firefighting** cover is set by category, according to the length and fuselage width of the largest aircraft normally using the aerodrome: category 1 for the smallest to category 10 for the largest.',
      '**Obstacle limitation surfaces** around a runway, such as the approach surface and transitional surface, define volumes that must be kept free of obstacles; objects that penetrate them are removed, lit or marked.',
    ], note: 'Phase definitions and the 30-minute trigger are quoted from memory of ICAO Annex 12. Categories and surface geometry are in Annex 14.' },
  ],
  examples: [
    { title: 'Phases', steps: ['An aircraft has not made a position report for 40 minutes.', 'Doubt exists about its safety.', 'The uncertainty phase (INCERFA) is declared.'] },
    { title: 'ELT', steps: ['An aircraft makes a forced landing.', 'The 406 MHz ELT activates automatically.', 'Satellites detect it and pass the position to the rescue centre.'] },
  ],
  practice: [
    mcq('INCERFA stands for the:', ['Uncertainty phase', 'Alert phase', 'Distress phase', 'Landing phase'], 'The first of three phases.'),
    mcq('The distress phase is:', ['DETRESFA', 'INCERFA', 'ALERFA', 'SARFA'], 'Grave and imminent danger.'),
    mcq('The modern ELT frequency monitored by satellites is:', ['406 MHz', '121.5 MHz', '243 MHz', '1,090 MHz'], 'It carries a coded identity.'),
    mcq('Search and rescue is coordinated by the:', ['Rescue coordination centre', 'Airline', 'Passenger', 'Airport café'], 'For each search and rescue region.'),
    tf('Aerodrome firefighting category depends on the size of the largest aircraft normally using it.', true, 'Length and fuselage width.'),
  ],
  assessment: [
    num('The uncertainty phase may be declared when no communication has been received within how many minutes of the time it should have been?', 30, 0.5, 'min', 'Thirty minutes.'),
    mcq('ALERFA stands for the:', ['Alert phase', 'Uncertainty phase', 'Distress phase', 'Descent phase'], 'Apprehension about the safety of the aircraft.'),
    mcq('Obstacle limitation surfaces are designed to:', ['Keep volumes around the runway free of obstacles', 'Limit the size of aircraft', 'Mark taxiways', 'Control noise'], 'Annex 14.'),
    mcq('A 406 MHz ELT, compared with 121.5 MHz, gives:', ['A coded identity detected by satellites', 'A shorter range', 'No position', 'A louder tone'], 'Searchers can start sooner.'),
    mcq('The alerting service is provided by:', ['Air traffic services units', 'Airlines only', 'Fire services only', 'Meteorological offices'], 'They alert the RCC.'),
    mcq('Rescue and firefighting category 10 is for:', ['The largest aircraft', 'The smallest aircraft', 'Helicopters only', 'Gliders'], 'Category 1 is the smallest.'),
    tf('The distress phase is declared only after an aircraft has crashed.', false, 'It applies when grave and imminent danger is reasonably certain.'),
  ],
  missionId: 'm-atpl-sar', sources: ['icao-a12', 'chicago'],
});

export const operatorRequirements = lesson('Operational procedures', {
  id: 'atpl-operator-requirements', title: 'Operator Requirements', minutes: 13, level: 3, prereqs: ['cpl-operational-procedures', 'atpl-aerodromes-and-search-and-rescue'],
  objectives: ['Describe the air operator certificate and the operations manual.', 'Describe the safety management system and flight data monitoring.', 'Describe minimum flight crew and licence validity requirements.', 'Describe operating minima and aerodrome selection.'],
  intro: 'Prerequisite review: an air operator certificate shows that an operator can operate safely, and the operations manual holds its procedures. This lesson looks at what the operator must have in place beneath the aircraft: systems that find problems before they become accidents.',
  simple: 'An airline must prove it can run safely, and keep proving it. It must have a safety management system, monitor its own flights for trends, train and check its crews regularly, and decide in advance how low it will go in bad weather and where it will divert.',
  sections: [
    { h: 'Certificate and manuals', body: [
      'The **air operator certificate** (AOC) specifies the aircraft types, operations and areas approved. The **operations manual** has four parts: general, aircraft operating information, route and aerodrome information, and training. Crews must carry the parts they need, and the operator keeps them current.',
    ] },
    { h: 'Safety management', body: [
      'The operator\'s **safety management system** (Annex 19) identifies hazards, assesses and mitigates risk, monitors performance and promotes safety. **Flight data monitoring** analyses routine flight data for exceedances and trends, de-identified, to find hazards before they cause accidents. A **just culture** encourages reporting while distinguishing honest error from deliberate violation.',
    ] },
    { h: 'Crew requirements', body: [
      'Crews must hold valid licences, ratings and medicals, and complete recurrent **type-rating checks**, usually every 6 or 12 months, and **line checks**. Flight and duty time limitations protect against fatigue. A multi-crew operation has a minimum flight crew of two pilots for most airliners.',
    ] },
    { h: 'Operating minima', lab: 'explore:operator-reqs', body: [
      '**Aerodrome operating minima** are set by the operator and may not be lower than the state of the aerodrome allows. For take-off they are visibility or runway visual range; for approach, a decision altitude or minimum descent altitude with visibility, depending on the approach type.',
      'A **take-off alternate** is selected if the weather at the departure aerodrome is below landing minima, so that a return is possible after an engine failure. A **destination alternate** is required unless the weather is good enough for the planned arrival.',
    ], note: 'This is a general description. The requirements that apply to an operator are those of its state of operator, and the structure and intervals in this lesson were written from memory.' },
  ],
  examples: [
    { title: 'Take-off alternate', steps: ['Weather at the departure airfield is below the landing minima for an engine-out return.', 'A take-off alternate must be named.', 'It must be within reach on one engine within a stated time.'] },
    { title: 'Flight data monitoring', steps: ['Analysis shows a rise in unstable approaches at one airport.', 'The operator reviews procedures and briefs crews.', 'The hazard is addressed before an accident occurs.'] },
  ],
  practice: [
    mcq('The air operator certificate specifies:', ['The aircraft types, operations and areas approved', 'The pilots\' names only', 'The fuel price', 'The airport slots'], 'It is issued by the state of the operator.'),
    mcq('Flight data monitoring is used to:', ['Find hazards and trends in routine flights', 'Punish individual pilots', 'Replace the black box', 'Set ticket prices'], 'Data are de-identified.'),
    mcq('A take-off alternate is required if:', ['Weather at departure is below landing minima for a return', 'The flight is longer than 1 hour', 'The aircraft is new', 'The runway is dry'], 'For an engine failure after take-off.'),
    mcq('Annex 19 deals with:', ['Safety management', 'Rules of the air', 'Aerodromes', 'Security'], 'The safety management system.'),
    tf('Operating minima may be set below those allowed by the state of the aerodrome.', false, 'They may not be lower.'),
  ],
  assessment: [
    num('How many parts does the operations manual have (general, aircraft, routes and aerodromes, training)?', 4, 0, '', 'Four parts.'),
    mcq('A just culture:', ['Encourages reporting while distinguishing honest error from violation', 'Punishes every error', 'Forbids reporting', 'Applies only to managers'], 'It underpins safety management.'),
    mcq('Recurrent type-rating checks are normally held:', ['Every 6 or 12 months', 'Every 10 years', 'Only once', 'Daily'], 'And line checks supplement them.'),
    mcq('Operating minima for approach consist of:', ['A decision or minimum descent altitude with visibility', 'Only the aircraft colour', 'Only the fuel on board', 'Only the cabin crew number'], 'Depending on the approach type.'),
    mcq('A destination alternate is not required when:', ['The weather is good enough for the planned arrival', 'The flight is delayed', 'The crew is tired', 'The aircraft is heavy'], 'The operator\'s manual sets the criteria.'),
    mcq('The state that issues the air operator certificate is the:', ['State of the operator', 'State of the passengers', 'State of the manufacturer only', 'State of the alternate'], 'It oversees the operator.'),
    tf('An operator must monitor and mitigate risk through its safety management system.', true, 'It is a requirement of Annex 19.'),
  ],
  missionId: 'm-atpl-operator', sources: ['icao-a6', 'chicago'],
});

export const etops = lesson('Operational procedures', {
  id: 'atpl-long-range-and-etops-concepts', title: 'Long-Range and ETOPS Concepts', minutes: 13, level: 3, prereqs: ['atpl-operator-requirements', 'atpl-point-of-equal-time-and-point-of-safe-return'],
  objectives: ['Explain what extended-range twin-engine operations are.', 'Calculate the maximum diversion distance.', 'Describe the critical fuel scenario.', 'Describe en-route alternates and their weather requirements.'],
  intro: 'Prerequisite review: points of equal time are marked on long sectors, and a depressurised or one-engine aircraft flies lower and slower. Extended operations by twin-engine airliners formalise that thinking: they are allowed far from an airport only if the operator can show that the aircraft, the crew and the planning can handle the worst day.',
  simple: 'Modern twin-jet airliners cross oceans. They may fly routes that stay a long way from any airport, but only up to a limit of time on one engine, and only with an alternate always available. The longer the allowed time, the stricter the approvals.',
  sections: [
    { h: 'The concept', body: [
      'Operations of **twin-engine** aeroplanes beyond a threshold distance from a suitable aerodrome are called **extended diversion time operations** (EDTO) by ICAO, or ETOPS in common usage. The threshold is commonly **60 minutes** at the one-engine-inoperative cruise speed.',
      'Approval depends on the reliability of the type\'s engines and systems, maintenance programmes, crew training, and the operator\'s dispatch procedures.',
    ] },
    { h: 'Diversion distance', body: [
      '`maximum diversion distance = one-engine-inoperative speed × approved diversion time`. At 420 kt and 120 minutes (2 h), the maximum distance from an adequate aerodrome is 840 NM in still air.',
      'The route is planned so that every point lies within that distance of an **en-route alternate**. Distances are corrected for the forecast wind.',
    ], formula: 'etops-radius', lab: 'formula:etops-radius' },
    { h: 'Critical fuel scenario', body: [
      'The fuel plan must cover the worst case: an engine failure **or** a depressurisation at the most critical point (the equal-time point), with an **emergency descent** to a lower level, flight to the alternate with allowance for icing and for engine and anti-ice bleed, and a hold of 15 minutes or so at the alternate, then a missed approach and landing.',
      'The operator calculates fuel for the more demanding of the engine-out and depressurised cases.',
    ] },
    { h: 'En-route alternates', body: [
      'Each en-route alternate must be **adequate** (suitable runway, services) and have forecast weather at or above planning minima during a window around the earliest and latest time of use. Extra precautions apply to equipment such as **fire suppression**, **auxiliary power unit** availability and long-range communications.',
    ], note: 'Thresholds and fuel assumptions are quoted from memory of ICAO Annex 6 and European rules for EDTO. Approvals and exact figures depend on the operator and state.' },
  ],
  examples: [
    { title: 'Diversion radius', steps: ['One-engine-inoperative speed 400 kt; approved diversion time 180 minutes (3 h).', '400 × 3.', 'Maximum diversion distance 1,200 NM.'] },
    { title: 'Window of weather', steps: ['An en-route alternate is forecast fog at the time the aircraft could first need it.', 'It is not suitable for planning.', 'Another alternate must be chosen or the route changed.'] },
  ],
  practice: [
    num('One-engine-inoperative speed 420 kt; approved diversion time 2 hours. Maximum diversion distance?', 840, 2, 'NM', '420 × 2 = 840 NM.'),
    mcq('A common threshold for extended twin-engine operations is:', ['60 minutes from a suitable aerodrome', '5 minutes', '10 hours', 'Any distance'], 'At one-engine-inoperative cruise speed.'),
    mcq('The critical fuel scenario considers:', ['The more demanding of engine failure or depressurisation at the critical point', 'Only normal cruise', 'Only landing', 'Only the cabin'], 'Including a hold at the alternate.'),
    mcq('An en-route alternate must be:', ['Adequate, with forecast weather at or above minima', 'Chosen at random', 'The departure airport only', 'Any military base'], 'In a window around the time of use.'),
    tf('Approval for extended operations depends on the reliability of the aircraft type and the operator\'s procedures.', true, 'Both are assessed.'),
  ],
  assessment: [
    num('One-engine-inoperative speed 400 kt; approved diversion time 3 hours. Maximum diversion distance?', 1200, 2, 'NM', '400 × 3 = 1,200 NM.'),
    num('One-engine-inoperative speed 380 kt; approved diversion time 90 minutes. Maximum diversion distance?', 570, 2, 'NM', '380 × 1.5 = 570 NM.'),
    mcq('ICAO calls these operations:', ['Extended diversion time operations', 'Shortest routing operations', 'Oceanic landing procedures', 'Emergency operations'], 'ETOPS in common usage.'),
    mcq('After a depressurisation on a long ocean sector, the aircraft will typically fly at:', ['A lower level, with higher fuel flow', 'A higher level', 'The same level', 'The surface'], 'Where oxygen is not needed.'),
    mcq('Corrections to the diversion distance are made for:', ['Forecast wind', 'Passenger numbers', 'Ticket price', 'Cabin temperature'], 'Because still air is not realistic.'),
    mcq('Which additional equipment concern applies to extended operations?', ['Fire suppression, APU availability and long-range communications', 'Cabin lighting only', 'Seat covers', 'Galley ovens'], 'They affect safety far from help.'),
    tf('Extended operations are permitted for any operator without special approval.', false, 'They require approval.'),
  ],
  missionId: 'm-atpl-etops', sources: ['icao-a6'],
});

export const specialProcedures = lesson('Operational procedures', {
  id: 'atpl-special-procedures-and-hazards', title: 'Special Procedures and Hazards', minutes: 13, level: 3, prereqs: ['atpl-long-range-and-etops-concepts', 'atpl-radar-and-tcas'],
  objectives: ['Describe the ground proximity warning system.', 'Describe noise abatement departure procedures.', 'Describe procedures for contaminated runways and de-icing.', 'Describe the response to a TCAS resolution advisory and wake turbulence on departure.'],
  intro: 'Prerequisite review: windshear, wake turbulence, icing and TCAS each have a drill. This lesson gathers the remaining special procedures of airline operations, and the warning systems that interrupt a normal flight with an instruction that must be followed at once.',
  simple: 'Some warnings have no negotiation. A terrain warning means climb now. A collision warning means follow it now. On the ground, a clean aircraft and a runway that works are checked every time, and the procedures for noise and for wake turbulence are part of every departure.',
  sections: [
    { h: 'Terrain warning', body: [
      'The **enhanced ground proximity warning system** (EGPWS/TAWS) compares aircraft position and flight path with a terrain database and gives cautions and warnings. The warning "**Terrain, terrain, pull up**" requires an **immediate escape manoeuvre**: maximum thrust and pitch up as the procedure directs, wings level, until clear. It is flown regardless of the weather, even in good visibility.',
    ], lab: 'explore:special-hazards' },
    { h: 'Noise abatement', body: [
      '**Noise abatement departure procedures** (NADP) reduce noise on the ground near airports. NADP 1 reduces noise close to the airport by climbing to a set height at take-off thrust before reducing; NADP 2 reduces noise further away by accelerating earlier. Safety is never compromised: they are not flown if the conditions or the aircraft state do not allow.',
    ] },
    { h: 'Runways and de-icing', body: [
      'A runway is **contaminated** when more than a specified fraction is covered by standing water, slush, snow or ice. Performance on a contaminated runway is reduced and take-off and landing limits are lower.',
      'Ground de-icing and anti-icing follow the **clean aircraft concept**. Holdover time guides how long the treatment protects, and the commander is responsible for the final check.',
    ] },
    { h: 'Traffic and wake', body: [
      'After a TCAS **resolution advisory** the crew follows it, and returns to the clearance when "Clear of conflict". Departures behind heavy aircraft allow for wake turbulence: a minimum time interval, and a take-off point beyond the preceding rotation point.',
    ], note: 'Warning phraseology and escape manoeuvres are type-specific and are given in the flight crew operating manual. Descriptions here are general and from memory.' },
  ],
  examples: [
    { title: 'Terrain warning', steps: ['In cloud, "Terrain, terrain, pull up" sounds.', 'Do not wait to verify.', 'Execute the escape manoeuvre at once: thrust, pitch, wings level.'] },
    { title: 'Departure behind a heavy', steps: ['A heavy aircraft departed 90 seconds ago from the same runway.', 'Wake turbulence separation is 2 minutes.', 'Wait, or ask for a different departure point.'] },
  ],
  practice: [
    mcq('The warning "Terrain, terrain, pull up" requires:', ['An immediate escape manoeuvre', 'A radio call and a check', 'A descent', 'No action in good visibility'], 'Follow it regardless of the weather.'),
    mcq('EGPWS compares aircraft position with:', ['A terrain database', 'The weather forecast', 'The load sheet', 'The fuel plan'], 'And gives cautions and warnings.'),
    mcq('Noise abatement procedures are:', ['Never allowed to compromise safety', 'Always mandatory', 'Only for night', 'Only for cargo flights'], 'Safety takes priority.'),
    mcq('After "Clear of conflict" from TCAS, the crew:', ['Returns to the clearance', 'Continues the manoeuvre', 'Makes an emergency call', 'Lands'], 'And tells ATC.'),
    tf('A terrain warning in clear weather may be ignored if the terrain is visible.', false, 'It requires an immediate escape manoeuvre.'),
  ],
  assessment: [
    mcq('TAWS stands for:', ['Terrain awareness and warning system', 'Take-off and wing stall', 'Transponder altitude warning system', 'Traffic and weather system'], 'EGPWS is an enhanced version.'),
    mcq('NADP 1 aims to reduce noise:', ['Close to the airport', 'Far from the airport only', 'In the cabin', 'At night only'], 'NADP 2 aims to reduce it further away.'),
    mcq('A runway is contaminated when:', ['A specified fraction is covered by water, slush, snow or ice', 'It is dry', 'It is marked yellow', 'Its length is short'], 'Performance is then reduced.'),
    mcq('Holdover time guides:', ['How long de-icing or anti-icing fluid is expected to protect', 'The length of a hold in flight', 'The time to refuel', 'Duty time'], 'It depends on fluid, temperature and precipitation.'),
    mcq('Departing behind a heavy aircraft, the crew allows for:', ['Wake turbulence time separation', 'A shorter runway', 'More fuel', 'A lower speed'], 'And a take-off point beyond the preceding rotation point.'),
    mcq('The final responsibility for confirming that the aircraft is clean before take-off lies with:', ['The commander', 'The passengers', 'The ground handler only', 'The caterer'], 'The clean aircraft concept.'),
    tf('A TCAS resolution advisory takes precedence over an ATC instruction that conflicts with it.', true, 'The crew informs ATC.'),
  ],
  missionId: 'm-atpl-special', sources: ['faa-aim', 'phak'],
});

export const ifrComms = lesson('Communications', {
  id: 'atpl-ifr-communications', title: 'IFR Communications', minutes: 12, level: 3, prereqs: ['ppl-standard-phraseology', 'atpl-rules-of-the-air-and-ats'],
  objectives: ['Describe the content of clearances and readbacks in IFR operations.', 'Describe position reporting.', 'Describe frequency changes and controller–pilot data link.', 'Describe communication with oceanic and non-radar services.'],
  intro: 'Prerequisite review: phraseology is standard, readbacks catch errors and numbers are spoken digit by digit. IFR communication adds more content per call, more handovers, and, over oceans, other media than voice.',
  simple: 'In IFR flying, a clearance covers the route, the level, the speed and the transponder, and every item is read back. The flight passes from one controller to the next, calling in on each frequency. Over the ocean, text messages by data link often replace voice.',
  sections: [
    { h: 'Clearances', body: [
      'An **IFR clearance** typically gives the destination, the route (a standard instrument departure or direct route), the initial level and the transponder code. Items that must be read back include the route, level, heading, speed, runway, QNH and transponder code.',
      '"**Climb to flight level 240, turn right heading 090, squawk 4231**" is read back in full with the call sign. Level instructions with a restriction ("maintain flight level 240 until passing waypoint") are read back with the restriction.',
    ] },
    { h: 'Position reports', body: [
      'Where radar service is not available, pilots report **position** at compulsory reporting points: aircraft identification, position, time, level, next position and estimated time. Over oceans, an abbreviated format is used by voice or data link.',
    ], lab: 'explore:ifr-comms' },
    { h: 'Frequency changes', body: [
      'Each change of controller is a **handover**. On first contact the pilot gives call sign, level and, where required, the information held (such as "passing FL 120 for FL 240"). Aircraft do not leave a frequency without instruction unless a failure or emergency requires it.',
    ] },
    { h: 'Data link', body: [
      '**Controller–pilot data link communications** (CPDLC) send clearances and requests as text messages, reducing misunderstanding and frequency congestion. **ADS-C** reports position automatically at set intervals. For urgent or time-critical messages, voice remains the primary medium.',
    ], note: 'Report formats and procedures differ by region. The description is general and from memory of ICAO Doc 4444 and Doc 9432.' },
  ],
  examples: [
    { title: 'Readback', steps: ['ATC: "Skyward 123, climb flight level 240, turn right heading 090, squawk 4231."', 'Read back all four items.', '"Climb flight level 240, right heading 090, squawk 4231, Skyward 123."'] },
    { title: 'First call', steps: ['Transferred to a new controller while climbing.', 'State the call sign and the level you are passing and cleared to.', '"Skyward 123, passing flight level 120 for flight level 240."'] },
  ],
  practice: [
    mcq('An IFR clearance normally gives:', ['Route, level and transponder code', 'Only the destination', 'Only the weather', 'Only the call sign'], 'And it is read back.'),
    mcq('CPDLC stands for:', ['Controller–pilot data link communications', 'Cockpit panel display light control', 'Central pilot duty log card', 'Controlled public data line'], 'Text messages instead of voice.'),
    mcq('ADS-C reports:', ['Aircraft position automatically at set intervals', 'The cabin temperature', 'The fuel price', 'The crew\'s names'], 'Used over oceans.'),
    mcq('At a compulsory reporting point without radar, the pilot reports:', ['Position, time, level and next position', 'The weather only', 'The passenger count', 'Nothing'], 'And an estimate for the next point.'),
    tf('A pilot may leave a frequency without instruction for convenience.', false, 'Only for a failure or emergency.'),
  ],
  assessment: [
    mcq('Which of these must be read back?', ['A heading, level, speed and transponder code', 'The surface temperature', 'The time', 'The weather at the alternate'], 'Safety-critical items.'),
    mcq('A level restriction ("maintain until passing waypoint") should be:', ['Read back with the restriction', 'Read back without it', 'Ignored', 'Written down only'], 'The restriction is part of the instruction.'),
    mcq('Data link communications are preferred over oceans because:', ['They reduce misunderstanding and frequency congestion', 'Voice is not allowed', 'They are cheaper than fuel', 'They are required in the cabin'], 'Voice remains primary for urgent messages.'),
    mcq('On first contact with a new controller, a climbing aircraft states:', ['Call sign, level passing and cleared level', 'The destination', 'The name of the captain', 'The fuel on board'], 'So the controller can verify the readout.'),
    mcq('Each change of controller is a:', ['Handover', 'Readback', 'Squawk', 'Hold'], 'The pilot calls in on the new frequency.'),
    mcq('A SID read-back includes:', ['The departure route and initial level', 'Only the weather', 'The cabin altitude', 'The fuel'], 'Standard instrument departure.'),
    tf('Voice is the primary medium for urgent or time-critical messages.', true, 'Data link is used for routine traffic.'),
  ],
  missionId: 'm-atpl-ifrcomms', sources: ['icao-4444', 'icao-9432'],
});

export const commFailure = lesson('Communications', {
  id: 'atpl-communication-failure-procedures', title: 'Communication Failure Procedures', minutes: 12, level: 3, prereqs: ['atpl-ifr-communications'],
  objectives: ['Describe the first actions after radio failure.', 'Describe the squawk and general intentions.', 'Describe the IFR procedure in IMC.', 'Describe the procedure in VMC.'],
  intro: 'Prerequisite review: transponder code 7600 indicates a radio failure and the pilot should check controls, frequency and equipment first. ICAO sets out what happens next so that a controller, who cannot be told, can still predict what the aircraft will do.',
  simple: 'If you lose radio contact, first try to fix it and try other frequencies. Set the failure code on the transponder. Then fly the plan the controller expects, which depends on whether you can see the ground. The rules exist so that a silent aircraft still behaves predictably.',
  sections: [
    { h: 'First actions', body: [
      'Check the **audio panel, volume, frequency, headset and microphone**; try another radio and the other pilot\'s controls. Call on the **emergency frequency 121.5 MHz** and on the last frequency. **Transmit blind**, because the aircraft may be receiving but not transmitting.',
      'Set the transponder to **7600**. Listen out on navigation aid frequencies, which may carry voice.',
    ] },
    { h: 'In visual conditions', body: [
      'If in **VMC**, continue in VMC, land at the nearest suitable aerodrome, and report arrival to the appropriate ATS unit as soon as possible.',
    ], lab: 'explore:comm-failure' },
    { h: 'In instrument conditions', body: [
      'If in **IMC**, or unable to continue in VMC, the pilot follows ICAO Annex 2: **maintain the last assigned speed and level, or the minimum flight altitude if higher, for 20 minutes** after failing to report over a compulsory reporting point; thereafter **adjust level and speed in accordance with the filed flight plan**.',
      'Proceed according to the current flight plan route to the navigation aid serving the destination; hold there until the estimated time of arrival (or the expected approach time last received), then begin descent and **make an approach**, landing within 30 minutes of the estimated time of arrival.',
    ] },
    { h: 'After landing', body: [
      'Land if possible, and tell ATS that the aircraft has landed. Where a procedure is stated for a particular region or aerodrome, it takes precedence over the general rule; crews check route and airport briefings for any such requirements.',
    ], note: 'The 20-minute and 30-minute figures and the sequence are quoted from memory of ICAO Annex 2 and national publications, which differ in detail. They were not checked against the current text. Use the procedure in the operations manual and the aeronautical information publications for the state.' },
  ],
  examples: [
    { title: 'IMC on a route', steps: ['The radio fails at the last reporting point at FL 300; the plan says continue at FL 300 and then at FL 350.', 'Maintain FL 300 for 20 minutes.', 'Then adjust to the flight plan level and speed.'] },
    { title: 'Approach', steps: ['The radio failure occurs in IMC well before the destination.', 'Fly the route to the aid serving the destination.', 'Hold until the estimated time of arrival, then begin the approach.'] },
  ],
  practice: [
    num('Which transponder code indicates a radio failure?', 7600, 0, '', 'Code 7600.'),
    mcq('The first action after suspected radio failure is to:', ['Check audio, frequency, headset and microphone', 'Land at once', 'Descend', 'Turn off the transponder'], 'And try another frequency.'),
    mcq('In VMC after radio failure, the pilot should:', ['Continue in VMC and land at the nearest suitable aerodrome', 'Climb into cloud', 'Switch off the aircraft', 'Hold forever'], 'And report arrival.'),
    mcq('"Transmitting blind" means:', ['Transmitting information though unable to receive a reply', 'Flying without lights', 'Reading with eyes closed', 'Landing without clearance'], 'The aircraft may still be heard.'),
    tf('After radio failure in IMC, a pilot should immediately begin an approach regardless of the route.', false, 'The prescribed sequence is followed.'),
  ],
  assessment: [
    num('After failing to report over a compulsory reporting point in IMC, the last assigned level and speed are maintained for how many minutes?', 20, 0.5, 'min', 'Twenty minutes (as recalled from Annex 2).'),
    num('Landing is made within how many minutes of the estimated time of arrival after a radio failure in IMC?', 30, 0.5, 'min', 'Within 30 minutes (as recalled).'),
    mcq('The emergency frequency tried after radio failure is:', ['121.5 MHz', '118.0 MHz', '136.0 MHz', '243.0 MHz'], 'Monitored by ATC and other aircraft.'),
    mcq('In IMC, after the 20 minutes, the pilot:', ['Adjusts level and speed in accordance with the filed flight plan', 'Climbs to the highest level', 'Flies to another country', 'Turns back at once'], 'The controller expects that.'),
    mcq('When a state publishes its own communication failure procedure, the pilot:', ['Follows it in preference to the general rule', 'Ignores it', 'Follows only the general rule', 'Asks the passengers'], 'Crews check the route and aerodrome briefings.'),
    mcq('The reason for standard communication failure rules is:', ['So that ATC can predict what a silent aircraft will do', 'To reduce fuel use', 'To increase workload', 'To limit the cabin crew'], 'Predictability.'),
    tf('The transponder is set to 7600 after a radio failure.', true, 'It tells ATC of the failure.'),
  ],
  missionId: 'm-atpl-commfail', sources: ['icao-a2', 'icao-4444'],
});
