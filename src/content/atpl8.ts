// ATPL — Supplementary Airline Topics (5 lessons). These are useful airline-training topics, not licensing
// syllabus material. Written from memory of standard references; not verified.
import { lesson, mcq, num, tf } from './q';

export const tem = lesson('Airline topics', {
  id: 'atpl-threat-and-error-management', title: 'Threat and Error Management', minutes: 12, level: 3, prereqs: ['cpl-weather-related-decisions', 'atpl-human-error-and-reliability'],
  objectives: ['Define threats, errors and undesired aircraft states.', 'Distinguish expected from unexpected threats.', 'Describe countermeasures.', 'Explain how a flight is managed with the TEM model.'],
  intro: 'Prerequisite review: errors are inevitable and defences are layered, and weather is a threat in the sense of something the crew does not control. Threat and error management turns those ideas into a working method that crews use on every flight.',
  simple: 'Every flight meets threats: things that make it harder. Crews make errors: things done wrongly. If either is not caught, the aircraft can end up in a state it should not be in. The method is to expect threats, trap errors, and recover from the unexpected state.',
  sections: [
    { h: 'The model', body: [
      'A **threat** is an event or error that occurs outside the influence of the flight crew, increases operational complexity and must be managed to maintain safety. Examples: weather, terrain, a short runway, traffic, a system malfunction, and pressure.',
      'An **error** is an action or inaction by the crew that leads to deviation from intentions or expectations. An **undesired aircraft state** is a position or condition of the aircraft that reduces safety margins, such as an unstable approach. An unmanaged state can end in an incident or accident.',
    ], lab: 'explore:tem' },
    { h: 'Types of threat', body: [
      '**Expected** threats can be anticipated and briefed: forecast thunderstorms, a notified runway closure, night. **Unexpected** threats arise without warning: a bird strike, a system failure, an unplanned diversion. **Latent** threats are conditions that exist but are not yet apparent, such as a poor procedure or an inadequate chart.',
    ] },
    { h: 'Countermeasures', body: [
      '**Planning**: briefings that name the threats and the plan for each. **Execution**: standard operating procedures, checklists, monitoring and cross-checking. **Review and modify**: continuous assessment, with the plan changed when conditions change. The aim is to trap an error before it affects the flight, or to mitigate its consequences.',
    ] },
    { h: 'In practice', body: [
      'A good briefing states: what the threats are, how they will be managed and who does what. A good monitor looks for threats **and** for the early signs of errors, such as a departure from a standard call. Errors that are noticed and corrected are normal; errors that are hidden or ignored are the problem.',
    ], note: 'The definitions follow common industry use of the TEM model; operators adopt their own wording.' },
  ],
  examples: [
    { title: 'Expected threat', steps: ['The forecast shows crosswind gusts at the destination.', 'The crew briefs the crosswind limit and a go-around plan.', 'The threat is managed before it arises.'] },
    { title: 'Trapping an error', steps: ['The pilot flying sets the wrong altitude.', 'The pilot monitoring notices the mismatch against the clearance.', 'It is corrected before the aircraft moves: an error trapped.'] },
  ],
  practice: [
    mcq('A threat is something that:', ['Occurs outside the crew\'s influence and increases complexity', 'The crew caused', 'Never affects safety', 'Only applies on the ground'], 'It must be managed to keep safe.'),
    mcq('An unstable approach is an example of:', ['An undesired aircraft state', 'A threat', 'A countermeasure', 'A latent condition'], 'It reduces safety margins.'),
    mcq('A forecast thunderstorm on the route is an:', ['Expected threat', 'Unexpected threat', 'Error', 'Violation'], 'It can be briefed in advance.'),
    mcq('A bird strike on take-off is an:', ['Unexpected threat', 'Expected threat', 'Latent error', 'Countermeasure'], 'It arises without warning.'),
    tf('Errors that are noticed and corrected are a normal part of operations.', true, 'Hidden errors are the problem.'),
  ],
  assessment: [
    mcq('In the TEM model, an error is:', ['An action or inaction by the crew that causes deviation from intentions', 'An external hazard', 'A failed aircraft system', 'A weather forecast'], 'It may or may not matter.'),
    mcq('A latent threat is one that:', ['Exists but is not yet apparent', 'Is always obvious', 'Cannot cause harm', 'Is a crew action'], 'For example a poor procedure.'),
    mcq('Which of these is a countermeasure?', ['A briefing that names the threats', 'Ignoring the weather', 'Skipping the checklist', 'Hurrying'], 'Planning is one of three groups.'),
    mcq('Trapping an error means:', ['Detecting and correcting it before it affects the flight', 'Ignoring it', 'Hiding it', 'Blaming someone'], 'A key skill.'),
    mcq('An undesired aircraft state, if unmanaged, can lead to:', ['An incident or accident', 'Nothing', 'Better fuel economy', 'A longer holiday'], 'It is a reduced safety margin.'),
    mcq('"Review and modify" in TEM means:', ['Reassess continuously and change the plan when conditions change', 'Write a report after the flight only', 'Review the manual yearly', 'Modify the aircraft'], 'Plans must adapt.'),
    tf('Only inexperienced crews make errors.', false, 'Everyone makes errors; the defence is the system.'),
  ],
  missionId: 'm-atpl-tem', sources: ['phak'],
});

export const crmAdvanced = lesson('Airline topics', {
  id: 'atpl-crew-resource-management', title: 'Crew Resource Management', minutes: 12, level: 3, prereqs: ['atpl-threat-and-error-management', 'cpl-crew-communication'],
  objectives: ['Describe the main CRM topics.', 'Describe leadership and followership.', 'Describe the authority gradient and how it affects safety.', 'Describe workload and situational awareness management.'],
  intro: 'Prerequisite review: crew resource management is the effective use of all resources, communication is closed-loop, and a steep authority gradient silences junior crew. Airline CRM broadens that into a set of non-technical skills that are trained and assessed every year.',
  simple: 'Technical skill flies the aircraft; non-technical skills decide whether a crew uses it well. They cover communication, leadership, teamwork, workload, awareness and decisions. Most accidents with a good crew in a good aircraft have a failure in one of these.',
  sections: [
    { h: 'The skills', body: [
      'CRM covers: **communication**, **situational awareness**, **workload management**, **leadership and teamwork**, **problem-solving and decision-making**, and **stress and fatigue management**.',
      'Training uses accident case studies, simulator exercises (LOFT: line-oriented flight training), and assessment against observable behaviours.',
    ] },
    { h: 'Leadership and followership', body: [
      'A good commander sets the tone: invites input, states intentions, and decides when it is needed. A good first officer **supports** but also **challenges** when something is wrong. Both roles carry responsibility.',
    ], lab: 'explore:crm-adv' },
    { h: 'Authority gradient', body: [
      'The **authority gradient** is the perceived difference in status between crew members. If too **steep**, junior crew do not speak up, as in several accidents where the first officer saw the problem. If too **flat**, nobody decides, and roles blur.',
      'The remedy is a briefing that invites challenge, and an agreed way of challenging.',
    ] },
    { h: 'Workload and awareness', body: [
      'Workload peaks in take-off, approach and abnormal situations. **Task shedding** (dropping the low-priority tasks) and **delegation** keep the essential ones done. A **mission analysis**, a short pause to restate the situation and the plan, restores shared awareness after an interruption.',
      'Common warning signs of lost awareness include confusion, an unresolved discrepancy, fixation on one task, and communication breakdown.',
    ], note: 'This lesson summarises widely taught CRM concepts from memory. Operators set their own standards and assessment systems.' },
  ],
  examples: [
    { title: 'Flat versus steep', steps: ['The captain is highly critical and never asks for views.', 'The first officer hesitates to mention a wrong altitude.', 'The gradient is too steep: the error may go uncorrected.'] },
    { title: 'Mission analysis', steps: ['After a go-around, tasks pile up.', 'The captain says, "Let\'s take 30 seconds: where are we, what is the plan, who does what."', 'Shared awareness is restored.'] },
  ],
  practice: [
    mcq('LOFT stands for:', ['Line-oriented flight training', 'Long-range operational flight test', 'Low-level orbit flight test', 'Loading of freight table'], 'A simulator exercise in realistic operations.'),
    mcq('An authority gradient that is too steep results in:', ['Junior crew not speaking up', 'Better teamwork', 'Less workload', 'Faster decisions always'], 'Errors may go unchallenged.'),
    mcq('Task shedding means:', ['Dropping low-priority tasks to keep the essential ones done', 'Dropping all tasks', 'Giving every task to one person', 'Ignoring the checklist'], 'A workload management technique.'),
    mcq('A mission analysis is:', ['A pause to restate the situation and the plan', 'A weather chart', 'A fuel check only', 'A passenger briefing'], 'It restores shared awareness.'),
    tf('A good first officer both supports and, when necessary, challenges the commander.', true, 'Followership includes challenge.'),
  ],
  assessment: [
    mcq('Which of these is a CRM topic?', ['Situational awareness', 'Engine overhaul', 'Ticket pricing', 'Fuel density'], 'Along with communication and workload.'),
    mcq('An authority gradient that is too flat can lead to:', ['Nobody decisively making decisions', 'Better compliance', 'Fewer errors', 'Shorter flights'], 'Roles blur.'),
    mcq('The remedy for a steep authority gradient is:', ['A briefing that invites challenge', 'A louder captain', 'Silence', 'More automation'], 'And an agreed way to challenge.'),
    mcq('Workload usually peaks in:', ['Take-off, approach and abnormal situations', 'Cruise only', 'Parking', 'Dispatch only'], 'Planning and delegation matter.'),
    mcq('A sign of lost situational awareness is:', ['An unresolved discrepancy', 'A completed checklist', 'A smooth landing', 'A standard call'], 'Also confusion and fixation.'),
    mcq('CRM assessments look at:', ['Observable behaviours', 'Only technical flying', 'Only paperwork', 'Only seniority'], 'Marked against a framework.'),
    tf('CRM training is only needed after an accident.', false, 'It is recurrent, for all crews.'),
  ],
  missionId: 'm-atpl-crm', sources: ['phak'],
});

export const mcc = lesson('Airline topics', {
  id: 'atpl-multi-crew-cooperation-concepts', title: 'Multi-Crew Cooperation Concepts', minutes: 12, level: 3, prereqs: ['atpl-crew-resource-management', 'atpl-autoflight-and-flight-directors'],
  objectives: ['Describe the roles and responsibilities of the crew.', 'Describe standard calls and checklists.', 'Describe briefings and cross-checks.', 'Describe procedures for pilot incapacitation.'],
  intro: 'Prerequisite review: pilot flying and pilot monitoring are separate roles, the flight mode annunciator is the statement of what the automation is doing, and crews rely on standard calls. Multi-crew cooperation is how two pilots become one reliable team in a procedure-driven cockpit.',
  simple: 'Two pilots share the work by following the same written procedures. One flies, the other monitors, and each says what they are doing in agreed words. If either can no longer function, the other knows what to do.',
  sections: [
    { h: 'Roles', body: [
      'The **commander** has overall responsibility and the final decision; the **first officer** assists, monitors and takes over when told. The pilot flying and pilot monitoring roles are shared between them, and swap as agreed. Task sharing follows the **standard operating procedures**.',
    ], lab: 'explore:mcc' },
    { h: 'Calls and checklists', body: [
      '**Standard calls** are fixed phrases at fixed points: "Positive rate", "Gear up", "Flaps 5", "One hundred above", "Minimums". **Checklists** are challenge-and-response, or read-and-do, and are completed before the action they protect. Normal checklists, abnormal checklists and emergency checklists have different rules; memory items are done first.',
    ] },
    { h: 'Briefings and cross-checks', body: [
      'The **departure briefing** and **approach briefing** cover the route, threats, limitations and what to do if something goes wrong. **Cross-checks** compare selections with clearances and plans: the altitude window with the clearance, the route with the flight plan, the speed bugs with the weights.',
      'Every deviation from a standard is **announced** and agreed.',
    ] },
    { h: 'Incapacitation', body: [
      'A pilot may become unable to function: faint, ill, or injured. Signs include failure to respond to two calls, a fixed stare or rigid posture, and unusual actions. The procedure is to **take control**, make sure the aircraft is safe, inform ATC and the cabin, declare an emergency, and consider the nearest suitable airport. Many airlines train for subtle incapacitation as well as total.',
    ], note: 'Calls and procedures vary by operator and type. These are examples from memory.' },
  ],
  examples: [
    { title: 'Challenge and response', steps: ['PM: "Landing gear." PF: "Down, three green."', 'Each item is confirmed by the person who acts on it.', 'The checklist is complete before the next phase.'] },
    { title: 'Incapacitation', steps: ['The first officer does not respond to two calls and stares ahead.', 'The captain takes control, engages the autopilot if appropriate and calls the cabin crew for help.', 'The captain informs ATC and diverts to the nearest suitable airport.'] },
  ],
  practice: [
    mcq('Standard calls are used to:', ['Remove ambiguity between crew members', 'Entertain passengers', 'Replace checklists', 'Contact ATC'], 'Fixed phrases at fixed points.'),
    mcq('The first action when a pilot is suspected to be incapacitated is to:', ['Take control and make the aircraft safe', 'Ignore it', 'Continue the checklist', 'Land immediately without ATC'], 'Then inform ATC and cabin crew.'),
    mcq('A sign of incapacitation can be:', ['Failure to respond to two calls', 'A normal reply', 'A completed call', 'A routine movement'], 'Also a fixed stare or unusual actions.'),
    mcq('Memory items are performed:', ['Before reading the checklist', 'After landing', 'Never', 'Only in cruise'], 'For time-critical emergencies.'),
    tf('The roles of pilot flying and pilot monitoring are fixed for the whole career.', false, 'They are shared and change as agreed.'),
  ],
  assessment: [
    mcq('A challenge-and-response checklist means:', ['One reads the item and the other confirms the status', 'Both read silently', 'Nobody reads', 'Only the commander reads'], 'It is completed before the protected action.'),
    mcq('Cross-checks compare selections with:', ['Clearances and plans', 'The weather forecast only', 'Cabin crew', 'The menu'], 'For example the altitude window and clearance.'),
    mcq('Every deviation from a standard should be:', ['Announced and agreed', 'Kept silent', 'Ignored', 'Made after landing'], 'So both pilots share the same picture.'),
    mcq('The approach briefing covers:', ['The route, threats and what to do if something goes wrong', 'The passenger meal', 'The ticket price', 'The crew\'s plans for the evening'], 'A shared plan.'),
    mcq('The final decision on board rests with the:', ['Commander', 'First officer', 'Cabin crew', 'Passengers'], 'The first officer assists and challenges.'),
    mcq('Subtle incapacitation is dangerous because:', ['The affected pilot may seem to be functioning', 'It is always obvious', 'It never happens', 'It affects only passengers'], 'Crews train for it.'),
    tf('Task sharing follows the standard operating procedures.', true, 'So each pilot knows what the other is doing.'),
  ],
  missionId: 'm-atpl-mcc', sources: ['phak'],
});

export const airlineOps = lesson('Airline topics', {
  id: 'atpl-airline-operational-concepts', title: 'Airline Operational Concepts', minutes: 12, level: 3, prereqs: ['cpl-commercial-flight-operations', 'atpl-jet-fuel-planning'],
  objectives: ['Describe the main airline network structures.', 'Describe how an airline measures capacity and load.', 'Calculate the break-even load factor.', 'Describe turn-round, delay and dispatch.'],
  intro: 'Prerequisite review: a commercial flight is a business run under strict safety rules, and load factor is the share of seats filled. This lesson steps back to the system around the flight: where airlines fly, how they measure it, and why a pilot\'s choices about time and fuel are also choices about money.',
  simple: 'Airlines connect cities either directly or through a hub. They count how many seats they fly and how many they fill, and a flight pays only when enough seats are sold. Every minute of delay and every kilogram of fuel has a price, which is why airlines are so careful about both, and why safety must never be traded for them.',
  sections: [
    { h: 'Networks', body: [
      'In a **point-to-point** network, aircraft fly direct between city pairs. In a **hub-and-spoke** network, flights connect through a hub airport, allowing many city pairs to be served with fewer flights, at the cost of connection complexity and peak congestion. **Code-share** and **alliances** extend networks by sharing flights.',
    ] },
    { h: 'Measures', body: [
      '**Available seat kilometres** (ASK) measure capacity: seats × distance. **Revenue passenger kilometres** (RPK) measure traffic: paying passengers × distance. The **passenger load factor** is `RPK ÷ ASK × 100`.',
      '**Yield** is revenue per passenger-kilometre; **cost per available seat kilometre** (CASK) is the cost per unit of capacity.',
    ] },
    { h: 'Break-even', body: [
      'The **break-even load factor** is the load factor at which revenue equals cost: `break-even load factor = cost ÷ (revenue per passenger × seats)`. With a flight cost of $12,000, an average fare of $100 and 180 seats, it is 12,000 ÷ 18,000 = 66.7%.',
      'The higher the fuel price or the lower the fare, the higher the load factor needed.',
    ], formula: 'breakeven', lab: 'formula:breakeven' },
    { h: 'Turn-round and delay', body: [
      'The **turn-round** is the time on the ground between flights: disembarking, cleaning, refuelling, catering, boarding. Long turn-rounds reduce aircraft utilisation; short ones raise the risk of delay. A delay may cascade through the day\'s rotations. **Dispatch** supports the crew by preparing the plan, monitoring the flight and advising on diversions.',
      'None of this changes the rules: a commander does not accept an aircraft, load or weather outside limits to save a delay.',
    ], note: 'This is a simplified overview from memory. Real airline economics involve many more factors.' },
  ],
  examples: [
    { title: 'Load factor', steps: ['A flight has 180 seats and 135 passengers over the same distance.', '135 ÷ 180 × 100.', 'Load factor = 75%.'] },
    { title: 'Break-even', steps: ['Cost $9,000; average fare $90; 150 seats.', '9,000 ÷ (90 × 150) = 9,000 ÷ 13,500.', 'Break-even load factor = 66.7%.'] },
  ],
  practice: [
    num('Cost $12,000, average fare $100, 180 seats. Break-even load factor in percent?', 66.7, 0.2, '%', '12,000 ÷ 18,000 = 66.7%.'),
    num('180 seats and 135 passengers over the same distance. Load factor in percent?', 75, 0.2, '%', '135 ÷ 180 = 75%.'),
    mcq('ASK stands for:', ['Available seat kilometres', 'Aircraft speed in knots', 'Annual safety key', 'Average seat kerosene'], 'Seats multiplied by distance.'),
    mcq('A hub-and-spoke network connects flights through:', ['A central hub airport', 'No airports', 'Only military bases', 'The sea'], 'Allows many city pairs with fewer flights.'),
    tf('A commander may accept an aircraft outside limits to avoid a delay.', false, 'Safety limits are never traded for schedule.'),
  ],
  assessment: [
    num('Cost $9,000, average fare $90, 150 seats. Break-even load factor in percent?', 66.7, 0.2, '%', '9,000 ÷ 13,500 = 66.7%.'),
    num('Cost $15,000, average fare $125, 200 seats. Break-even load factor in percent?', 60, 0.2, '%', '15,000 ÷ 25,000 = 60%.'),
    mcq('RPK stands for:', ['Revenue passenger kilometres', 'Runway pavement kilometres', 'Radio position keys', 'Rate per kilogram'], 'Paying passengers multiplied by distance.'),
    mcq('The passenger load factor equals:', ['RPK divided by ASK', 'ASK divided by RPK', 'Cost divided by fare', 'Speed divided by fuel'], 'Times 100 for a percentage.'),
    mcq('A very short turn-round increases the risk of:', ['Delay cascading through the day', 'Lower fuel burn', 'Better maintenance', 'Longer flights'], 'Utilisation is higher, margin lower.'),
    mcq('Yield is:', ['Revenue per passenger-kilometre', 'Cost per seat', 'Fuel per hour', 'Speed per kilometre'], 'CASK is cost per unit of capacity.'),
    tf('A higher fuel price raises the break-even load factor.', true, 'Cost rises while revenue is unchanged.'),
  ],
  missionId: 'm-atpl-airline', sources: ['phak'],
});

export const advancedDm = lesson('Airline topics', {
  id: 'atpl-advanced-decision-making', title: 'Advanced Decision-Making', minutes: 13, level: 3, prereqs: ['atpl-multi-crew-cooperation-concepts', 'cpl-emergency-decision-making'],
  objectives: ['Describe naturalistic decision-making.', 'Describe the stages of a decision under stress.', 'Describe cognitive biases that affect pilots.', 'Apply a structured model to an ambiguous situation.'],
  intro: 'Prerequisite review: FORDEC gives a structure for non-time-critical decisions, plan continuation bias makes crews press on, and startle disrupts thinking. The decisions that matter most at airline level are the ambiguous ones, where information is incomplete and time is limited, and no checklist exists.',
  simple: 'Experienced people usually decide by recognising a situation and recalling what worked, not by comparing lists. That is fast and mostly right, but can fail when the situation only looks familiar. Knowing the common mental traps, and slowing down for the ones that count, is the skill.',
  sections: [
    { h: 'How experts decide', body: [
      '**Naturalistic decision-making** describes experts recognising a pattern and choosing a workable action quickly, then testing it mentally. It works well in familiar situations and under time pressure, but is vulnerable when a situation resembles a familiar one but is not.',
      'For unfamiliar problems, slow, **analytical** decision-making is needed: gathering facts, listing options, comparing risks, as in FORDEC.',
    ] },
    { h: 'Stages under stress', body: [
      'A useful sequence is **SHOR**: **S**timuli (what is actually happening), **H**ypotheses (what could explain it), **O**ptions (what could be done), **R**esponse (act, then check). The last step feeds back to the first.',
      'Stress narrows attention. A short pause, a deep breath and a statement of the situation to the other pilot restore breadth.',
    ], lab: 'explore:adm-adv' },
    { h: 'Biases', body: [
      '**Confirmation bias**: looking for information that supports the current belief. **Plan continuation bias**: sticking to the plan despite changing conditions. **Anchoring**: relying too heavily on the first piece of information. **Normalisation of deviance**: accepting small departures from standard until they become routine. **Overconfidence**: believing the situation is more under control than it is.',
    ] },
    { h: 'Practical habits', body: [
      'State assumptions aloud so that the other pilot can challenge them. Set decision points in advance ("if not stable by 1,000 ft, go around"). Ask "what if I am wrong?" and "what else could this be?". Decide early, while options remain, and revisit the decision as facts change.',
    ], note: 'These models and lists are drawn from widely taught human factors material and are from memory.' },
  ],
  examples: [
    { title: 'Confirmation bias', steps: ['An engine parameter is fluctuating and the crew believes it is a sensor fault.', 'They look only for evidence that supports a sensor fault.', 'A pause for "what else could this be?" brings in a possible genuine engine problem.'] },
    { title: 'Decision point', steps: ['Before the approach, the crew agrees: "if not stable by 1,000 ft, we go around".', 'At 1,000 ft the approach is not stable.', 'The decision is already made and the go-around is flown.'] },
  ],
  practice: [
    mcq('Naturalistic decision-making is:', ['Recognising a pattern and choosing a workable action quickly', 'Writing long lists of options', 'Flipping a coin', 'Avoiding decisions'], 'Used by experts under time pressure.'),
    mcq('In SHOR, the letter H stands for:', ['Hypotheses', 'Hurry', 'Hold', 'Heading'], 'What could explain the stimuli.'),
    mcq('Confirmation bias is:', ['Looking for information that supports the current belief', 'Confirming a reading', 'A type of checklist', 'A weather report'], 'It can hide the true problem.'),
    mcq('Normalisation of deviance is:', ['Accepting small departures from standard until they become routine', 'A new standard', 'A form of training', 'A weather pattern'], 'A slow erosion of margins.'),
    tf('Setting decision points in advance helps because the decision is already made at the critical moment.', true, 'Pressure then matters less.'),
  ],
  assessment: [
    mcq('Anchoring is:', ['Relying too heavily on the first piece of information', 'Using the aircraft\'s anchor', 'Moving to a new gate', 'A type of approach'], 'Later information is under-weighted.'),
    mcq('Analytical decision-making is needed when:', ['The situation is unfamiliar', 'The situation is routine', 'No decision is needed', 'The checklist is complete'], 'Time permitting.'),
    mcq('Stress tends to:', ['Narrow attention', 'Broaden attention', 'Improve memory always', 'Remove the need to decide'], 'A pause restores breadth.'),
    mcq('Stating assumptions aloud helps because:', ['The other pilot can challenge them', 'It saves time', 'It replaces the checklist', 'It impresses passengers'], 'A cross-check on thinking.'),
    mcq('A good question to ask when a diagnosis seems obvious is:', ['"What else could this be?"', '"Who is to blame?"', '"How long until lunch?"', '"Can we skip this?"'], 'It counters confirmation bias.'),
    mcq('Overconfidence is:', ['Believing a situation is more under control than it is', 'A fear of flying', 'A type of checklist', 'A noise warning'], 'It lowers vigilance.'),
    tf('Decisions should be made as late as possible so as to keep all options open.', false, 'Decide early, while options remain, and review as facts change.'),
  ],
  missionId: 'm-atpl-adm', sources: ['phak'],
});
