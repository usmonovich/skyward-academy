// ATPL — Human Performance and Limitations 040 (3) and Meteorology 050 (4).
// Written from memory of standard references; not verified against current documents.
import { lesson, mcq, num, tf } from './q';

export const altitudePhysiology = lesson('Human performance', {
  id: 'atpl-high-altitude-physiology', title: 'High-Altitude Physiology', minutes: 13, level: 3, prereqs: ['ppl-hypoxia-and-the-atmosphere', 'cpl-pressurisation-basics'],
  objectives: ['Calculate the partial pressure of oxygen.', 'State times of useful consciousness at jet cruising levels.', 'Describe decompression sickness and trapped gas effects.', 'Describe other hazards of the high-altitude environment.'],
  intro: 'Prerequisite review: the air is always about 21% oxygen, hypoxia impairs judgement first, and after a decompression the masks go on before anything else. At jet cruising levels the numbers behind those rules become stark.',
  simple: 'How much oxygen reaches your blood depends on the pressure of the oxygen in the air you breathe. High up that pressure is a fraction of what it is on the ground. Without a mask, a pilot at airliner cruising height has well under a minute of clear thinking.',
  sections: [
    { h: 'Partial pressure', body: [
      'By **Dalton\'s law**, each gas in a mixture contributes its share of the total pressure. `partial pressure of oxygen = 0.21 × total pressure`.',
      'At sea level (1,013 hPa) it is about 213 hPa. At 18,000 ft (about 500 hPa) it is about 105 hPa: half.',
      'Breathing 100% oxygen restores sea-level conditions up to roughly 34,000 ft. Above about 40,000 ft even pure oxygen must be delivered under pressure.',
    ], formula: 'po2', lab: 'formula:po2' },
    { h: 'Time of useful consciousness', body: [
      'Typical figures from FAA guidance: **FL250, 3 to 5 minutes; FL300, 1 to 2 minutes; FL350, 30 to 60 seconds; FL400, 15 to 20 seconds**. After a rapid decompression these times can be about halved.',
    ] },
    { h: 'Gas in the body', body: [
      '**Decompression sickness**: nitrogen dissolved in the tissues forms bubbles when ambient pressure falls. It is a risk at cabin altitudes above about 18,000 ft and after recent diving. Symptoms include joint pain ("the bends"), and effects on the skin, lungs and nervous system.',
      '**Trapped gas** in the middle ear, sinuses, gut and teeth expands as pressure falls and contracts as it rises. Ear and sinus pain is commonest in the descent, especially with a cold.',
    ] },
    { h: 'The environment', body: [
      'At altitude the air is extremely **dry**, causing dehydration over a long flight. **Cosmic radiation** dose increases with altitude and latitude and is monitored for crews. **Ozone** at high levels irritates the lungs and is removed by converters.',
    ], note: 'Times of useful consciousness vary widely between individuals and with activity. Treat any decompression as leaving no time to spare.' },
  ],
  examples: [
    { title: 'Oxygen pressure', steps: ['At a cabin altitude where pressure is 750 hPa.', '0.21 × 750.', 'Partial pressure of oxygen ≈ 157.5 hPa.'] },
    { title: 'Why masks first', steps: ['A rapid decompression occurs at FL390.', 'Useful consciousness may be 10 seconds or less.', 'There is time for one action: put the mask on.'] },
  ],
  practice: [
    num('Total pressure is 750 hPa. Partial pressure of oxygen (0.21 × pressure)?', 157.5, 0.5, 'hPa', '0.21 × 750 = 157.5 hPa.'),
    mcq('Dalton\'s law states that each gas in a mixture:', ['Contributes its share of the total pressure', 'Has no pressure of its own', 'Has the same pressure as the total', 'Becomes liquid at altitude'], 'Partial pressures add up to the total.'),
    mcq('Ear pain from trapped gas is most common:', ['In the descent', 'In the climb only', 'In level cruise', 'On the ground'], 'Air must re-enter the middle ear as pressure rises.'),
    mcq('Decompression sickness is caused by:', ['Nitrogen bubbles forming as pressure falls', 'Too much oxygen', 'Carbon monoxide', 'Low humidity'], 'More likely after recent diving.'),
    tf('Cosmic radiation dose decreases as altitude increases.', false, 'It increases with altitude and with latitude.'),
  ],
  assessment: [
    num('Total pressure is 1,013 hPa. Partial pressure of oxygen (0.21 × pressure)?', 212.7, 0.5, 'hPa', '0.21 × 1,013 ≈ 212.7 hPa.'),
    num('Total pressure is 500 hPa. Partial pressure of oxygen (0.21 × pressure)?', 105, 0.5, 'hPa', '0.21 × 500 = 105 hPa.'),
    mcq('The time of useful consciousness at FL350 is typically:', ['30 to 60 seconds', '5 to 10 minutes', '20 to 30 minutes', 'Several hours'], 'Less after a rapid decompression.'),
    mcq('After a rapid decompression, the time of useful consciousness is:', ['Considerably shorter than the quoted figures', 'Longer than the quoted figures', 'Unchanged', 'Unlimited'], 'It can be about halved.'),
    mcq('Above about 40,000 ft, adequate oxygenation requires:', ['100% oxygen delivered under pressure', 'Ordinary cabin air', 'A mixture with less oxygen', 'No oxygen at all'], 'The ambient pressure is too low even for pure oxygen.'),
    mcq('The percentage of oxygen in the air at FL350 is:', ['About 21%', 'About 5%', 'About 50%', 'Zero'], 'The proportion is constant; the pressure is lower.'),
    tf('Flying soon after scuba diving increases the risk of decompression sickness.', true, 'Extra nitrogen is still dissolved in the tissues.'),
  ],
  missionId: 'm-atpl-physiology', sources: ['phak'],
});

export const sleep = lesson('Human performance', {
  id: 'atpl-sleep-and-circadian-rhythms', title: 'Sleep and Circadian Rhythms', minutes: 12, level: 3, prereqs: ['cpl-human-performance-in-commercial-operations'],
  objectives: ['Describe the stages and cycle of sleep.', 'Apply the sleep credit model.', 'Describe the free-running body clock and its synchronisers.', 'Explain why westward travel is easier to adapt to.'],
  intro: 'Prerequisite review: alertness is lowest in the window of circadian low, and the body clock adjusts by only about an hour a day after crossing time zones. Long-haul crews live permanently across time zones, and manage sleep as deliberately as they manage fuel.',
  simple: 'Sleep comes in repeating cycles of about an hour and a half, with different stages doing different jobs. Roughly, each hour asleep buys two hours awake. Left to itself the body\'s day is a little longer than 24 hours, which is why flying west feels easier than flying east.',
  sections: [
    { h: 'The structure of sleep', body: [
      'Sleep alternates between **non-REM** sleep, which includes deep **slow-wave** sleep and is associated with physical restoration, and **REM** (rapid eye movement) sleep, associated with dreaming, memory and mental restoration.',
      'One full **cycle** lasts about **90 minutes**, and a normal night contains four or five.',
    ] },
    { h: 'Sleep credit', body: [
      'A simple model: **one hour of sleep gives two hours of wakefulness**, up to a maximum credit of about 16 hours. `hours awake available = hours of sleep × 2`.',
      'Six hours of sleep gives about 12 hours of credit. Shortfalls accumulate as a **sleep debt**.',
    ], formula: 'sleep-credit', lab: 'formula:sleep-credit' },
    { h: 'The body clock', body: [
      'Without time cues the circadian rhythm **free-runs** at about 25 hours. It is held to 24 hours by **zeitgebers** ("time-givers"), the strongest being **light**; meals and activity also contribute.',
      'Body temperature and alertness are lowest in the early morning hours.',
    ] },
    { h: 'East and west', body: [
      'Flying **west** lengthens the day, which suits a body clock that naturally runs long: adaptation is faster. Flying **east** shortens the day and is harder.',
      'On a short layover it is often better to stay on home time. Naps help, but allow for sleep inertia on waking.',
    ], note: 'The sleep credit model and the 25-hour figure are simplifications used in pilot training. Individuals differ, and fatigue management follows the operator\'s rules.' },
  ],
  examples: [
    { title: 'Sleep credit', steps: ['A pilot sleeps 5 hours before an early duty.', '5 × 2.', 'About 10 hours of wakefulness credit.'] },
    { title: 'Which direction?', steps: ['A crew flies eight time zones west.', 'The local day is longer than the body expects.', 'Adaptation is easier than after the same flight east.'] },
  ],
  practice: [
    num('A pilot sleeps 5 hours. Wakefulness credit by the sleep credit model?', 10, 0.1, 'h', '5 × 2 = 10 hours.'),
    mcq('REM sleep is associated with:', ['Dreaming and mental restoration', 'Physical restoration only', 'Being awake', 'Hypoxia'], 'Rapid eye movement sleep.'),
    mcq('The strongest zeitgeber is:', ['Light', 'Noise', 'Altitude', 'Fuel'], 'It synchronises the body clock.'),
    mcq('Deep slow-wave sleep is part of:', ['Non-REM sleep', 'REM sleep', 'Wakefulness', 'Sleep inertia'], 'It is associated with physical restoration.'),
    tf('Adaptation is generally faster after flying east than after flying west.', false, 'Westward travel is easier, because it lengthens the day.'),
  ],
  assessment: [
    num('A pilot sleeps 6 hours. Wakefulness credit by the sleep credit model?', 12, 0.1, 'h', '6 × 2 = 12 hours.'),
    num('About how many minutes does one full sleep cycle last?', 90, 3, 'min', 'About 90 minutes.'),
    num('What is the maximum wakefulness credit, in hours, in the sleep credit model?', 16, 0.1, 'h', 'About 16 hours, from 8 hours of sleep.'),
    mcq('Without time cues, the human circadian rhythm free-runs at about:', ['25 hours', '12 hours', '20 hours', '48 hours'], 'Slightly longer than a day.'),
    mcq('Zeitgebers are:', ['External cues that synchronise the body clock', 'Sleep stages', 'Sleeping tablets', 'Types of fatigue'], 'Light is the strongest.'),
    mcq('Flying west is easier to adapt to because it:', ['Lengthens the day, which suits a body clock that runs long', 'Shortens the day', 'Has less turbulence', 'Uses less fuel'], 'The natural rhythm is about 25 hours.'),
    tf('A shortage of sleep accumulates over successive days as a sleep debt.', true, 'It is repaid only by extra sleep.'),
  ],
  missionId: 'm-atpl-sleep', sources: ['phak'],
});

export const humanError = lesson('Human performance', {
  id: 'atpl-human-error-and-reliability', title: 'Human Error and Reliability', minutes: 13, level: 3, prereqs: ['cpl-risk-management'],
  objectives: ['Classify errors as slips, lapses, mistakes and violations.', 'Describe skill-based, rule-based and knowledge-based behaviour.', 'Describe the SHELL model.', 'Calculate the reliability of redundant systems.'],
  intro: 'Prerequisite review: accidents come from chains of events and gaps in several layers of defence, and risk is managed, not eliminated. Human error cannot be removed from aviation either. The system is designed on the assumption that people will err, so that one error is caught before it matters.',
  simple: 'People make different kinds of error: doing the right thing wrongly, forgetting, choosing the wrong thing, or knowingly breaking a rule. Each needs a different cure. Safety comes from having more than one check, because two independent checks rarely fail together.',
  sections: [
    { h: 'Kinds of error', body: [
      'A **slip** is an action not carried out as intended, such as selecting the wrong switch. A **lapse** is a failure of memory, such as missing a checklist item. A **mistake** is a wrong plan or decision, carried out as intended. A **violation** is a deliberate departure from a rule or procedure.',
    ] },
    { h: 'Levels of behaviour', body: [
      '**Skill-based** behaviour is automatic and practised; its errors are slips and lapses. **Rule-based** behaviour applies learned procedures; its errors come from using the wrong rule. **Knowledge-based** behaviour is reasoning in an unfamiliar situation; it is slow and error-prone.',
    ] },
    { h: 'SHELL', body: [
      'The **SHELL** model places the human (**Liveware**) at the centre, interacting with **Software** (procedures, manuals), **Hardware** (the machine), **Environment**, and other **Liveware** (people). Errors arise where these interfaces fit badly.',
      '**Active failures** are errors by front-line people with immediate effect. **Latent failures** are conditions built in earlier by design, management or maintenance, lying dormant until combined with an active failure.',
    ] },
    { h: 'Redundancy', body: [
      'If each of n independent, parallel checks has reliability r, the chance that all fail is (1 − r)ⁿ. `combined reliability = 1 − (1 − r)ⁿ`. Two checks of 0.9 give 0.99; three give 0.999.',
      'Components in **series**, where every one must work, multiply: two of 0.9 give 0.81. This is why cross-checks by a second person are so valuable, and why they must be genuinely independent.',
    ], formula: 'parallel-rel', lab: 'formula:parallel-rel', note: 'Real checks are rarely fully independent: two pilots can share the same wrong assumption. The arithmetic shows the ideal.' },
  ],
  examples: [
    { title: 'Classifying', steps: ['A pilot intends to raise the flaps but moves the gear lever.', 'The plan was right; the action was wrong.', 'This is a slip.'] },
    { title: 'Redundancy', steps: ['Two independent checks, each 0.8 reliable.', 'Chance both fail = 0.2 × 0.2 = 0.04.', 'Combined reliability = 0.96.'] },
  ],
  practice: [
    num('Two independent parallel checks, each 0.8 reliable. Combined reliability?', 0.96, 0.002, '', '1 − 0.2² = 0.96.'),
    mcq('Forgetting a checklist item after an interruption is a:', ['Lapse', 'Slip', 'Violation', 'Mistake'], 'A failure of memory.'),
    mcq('A deliberate departure from a procedure is a:', ['Violation', 'Slip', 'Lapse', 'Latent failure'], 'It is intentional.'),
    mcq('In the SHELL model, the element at the centre is:', ['Liveware (the human)', 'Software', 'Hardware', 'Environment'], 'All the other elements interface with it.'),
    tf('Knowledge-based behaviour is fast and rarely leads to error.', false, 'It is slow and error-prone.'),
  ],
  assessment: [
    num('Two independent parallel checks, each 0.9 reliable. Combined reliability?', 0.99, 0.002, '', '1 − 0.1² = 0.99.'),
    num('Three independent parallel checks, each 0.9 reliable. Combined reliability?', 0.999, 0.0005, '', '1 − 0.1³ = 0.999.'),
    num('Two components in series, each 0.9 reliable. Combined reliability?', 0.81, 0.002, '', '0.9 × 0.9 = 0.81.'),
    mcq('Selecting the wrong switch while intending the right action is a:', ['Slip', 'Mistake', 'Violation', 'Lapse'], 'The action was not carried out as intended.'),
    mcq('A wrong decision carried out exactly as planned is a:', ['Mistake', 'Slip', 'Lapse', 'Reflex'], 'The plan itself was wrong.'),
    mcq('A latent failure is:', ['A dormant condition created earlier by design, management or maintenance', 'An error by the pilot flying', 'A sudden engine failure', 'A weather hazard'], 'It combines later with an active failure.'),
    mcq('Errors typical of skill-based behaviour are:', ['Slips and lapses', 'Knowledge gaps', 'Violations', 'Wrong rules'], 'Automatic actions go astray.'),
  ],
  missionId: 'm-atpl-error', sources: ['phak'],
});

export const circulation = lesson('Meteorology', {
  id: 'atpl-global-circulation', title: 'Global Circulation', minutes: 12, level: 3, prereqs: ['cpl-upper-winds-and-jet-streams'],
  objectives: ['Describe the three circulation cells.', 'Locate the main pressure belts.', 'Name the prevailing surface winds.', 'Explain the seasonal movement of the pattern.'],
  intro: 'Prerequisite review: wind blows around pressure systems, and jet streams lie where warm and cold air meet. Step back far enough and those features line up in belts around the planet, which is why a long-haul pilot can predict the character of the weather from the latitude alone.',
  simple: 'The Sun heats the equator most. Hot air rises there, moves towards the poles high up, sinks at about 30 degrees and returns along the surface. Two more loops lie further towards the poles. The Earth\'s spin bends these flows into the steady winds sailors named long ago.',
  sections: [
    { h: 'Three cells', body: [
      'In each hemisphere: the **Hadley cell** between the equator and about 30°; the **Ferrel cell** between about 30° and 60°; and the **polar cell** from about 60° to the pole.',
    ], lab: 'explore:circulation' },
    { h: 'Pressure belts', body: [
      'Air rises at the equator, giving the low-pressure **intertropical convergence zone** (ITCZ), with deep convective cloud. It sinks near 30°, giving the **subtropical highs** and the world\'s great deserts. Near 60° lies the **polar front** and a belt of travelling **lows**. Over the poles pressure is high.',
    ] },
    { h: 'Surface winds', body: [
      'Between the subtropical highs and the equator blow the **trade winds**: from the **north-east** in the northern hemisphere and the **south-east** in the southern. In mid-latitudes the prevailing winds are **westerly**. Near the poles they are **easterly**.',
      'The deflection is the **Coriolis effect**: to the right in the northern hemisphere, to the left in the southern, and zero at the equator.',
    ] },
    { h: 'Seasons', body: [
      'The whole pattern moves north and south with the Sun. Over large continents the summer heating reverses the surface flow, giving **monsoons**: onshore, wet winds in summer and offshore, dry winds in winter.',
    ], note: 'This is the idealised model. Land, sea and mountains distort it everywhere.' },
  ],
  examples: [
    { title: 'Reading a latitude', steps: ['An airfield lies at about 30° N on the western edge of a continent.', 'This is under the subtropical high.', 'Expect settled, dry weather and often poor visibility in haze.'] },
    { title: 'Trade winds', steps: ['A flight operates at low level at 15° N.', 'It is between the subtropical high and the ITCZ.', 'Expect steady north-easterly surface winds.'] },
  ],
  practice: [
    mcq('The circulation cell between the equator and about 30° is the:', ['Hadley cell', 'Ferrel cell', 'Polar cell', 'Monsoon cell'], 'Air rises at the equator and sinks near 30°.'),
    mcq('The subtropical highs lie at about:', ['30° latitude', 'The equator', '60° latitude', 'The poles'], 'Where the Hadley cell air sinks.'),
    mcq('The prevailing surface winds in mid-latitudes are:', ['Westerly', 'Easterly', 'Northerly', 'Calm'], 'Between about 30° and 60°.'),
    mcq('The Coriolis effect in the northern hemisphere deflects moving air:', ['To the right', 'To the left', 'Upward', 'Not at all'], 'To the left in the southern hemisphere.'),
    tf('The ITCZ stays at the same latitude all year.', false, 'It moves north and south with the Sun.'),
  ],
  assessment: [
    mcq('The intertropical convergence zone is a region of:', ['Low pressure and deep convective cloud near the equator', 'High pressure and clear skies', 'Polar easterlies', 'Permanent fog'], 'The trade winds converge and the air rises.'),
    mcq('The trade winds in the northern hemisphere blow from the:', ['North-east', 'South-west', 'North-west', 'South-east'], 'South-east in the southern hemisphere.'),
    mcq('The circulation cell between about 30° and 60° is the:', ['Ferrel cell', 'Hadley cell', 'Polar cell', 'Walker cell'], 'The mid-latitude cell.'),
    mcq('The polar front is found at about:', ['60° latitude', '10° latitude', '30° latitude', '90° latitude'], 'Where polar and mid-latitude air meet.'),
    mcq('The Coriolis effect at the equator is:', ['Zero', 'At its maximum', 'To the right', 'To the left'], 'It increases with latitude.'),
    mcq('A summer monsoon brings:', ['Onshore, wet winds', 'Offshore, dry winds', 'Calm, clear weather', 'Polar air'], 'The heated continent draws moist air in from the sea.'),
    tf('The world\'s great deserts lie mainly under the subtropical highs.', true, 'Sinking air is dry.'),
  ],
  missionId: 'm-atpl-circulation', sources: ['faa-wx'],
});

export const catLesson = lesson('Meteorology', {
  id: 'atpl-jet-streams-and-clear-air-turbulence', title: 'Jet Streams and Clear-Air Turbulence', minutes: 13, level: 3, prereqs: ['atpl-global-circulation', 'atpl-buffet-margins'],
  objectives: ['Describe the structure of a jet stream.', 'Calculate vertical wind shear.', 'State where clear-air turbulence is most likely.', 'Describe turbulence reporting and the crew response.'],
  intro: 'Prerequisite review: a jet stream is a band of wind of at least 60 kt near the tropopause, and at cruise altitude the buffet margin is narrow. The two meet in clear-air turbulence, the commonest cause of injuries on airliners.',
  simple: 'A jet stream is a long, flat ribbon of fast wind. The danger is not the speed itself but how quickly the speed changes just outside it. That change stirs the air into invisible turbulence, most often on the colder side.',
  sections: [
    { h: 'Structure', body: [
      'A jet stream is typically thousands of kilometres long, hundreds wide and only a few kilometres deep. The **core** lies in the warm air just below the tropopause, close to where the tropopause height changes abruptly.',
      'Wind speed falls away quickly on the cold (polar) side and more slowly on the warm side.',
    ] },
    { h: 'Wind shear', body: [
      'Clear-air turbulence comes from **wind shear**: a change of wind with height or distance. `vertical shear = change in wind speed ÷ height difference`, usually given per 1,000 ft.',
      'A change of 30 kt over 5,000 ft is 6 kt per 1,000 ft. The stronger the shear, the more likely and the more severe the turbulence.',
    ], formula: 'wind-shear', lab: 'formula:wind-shear' },
    { h: 'Where to expect it', body: [
      'CAT is most likely on the **cold side** of the jet, **below the core**, and near sharp bends in the jet, troughs and where two jets meet. It also occurs in **mountain waves** reaching cruise levels.',
      'Turbulence is reported as **light, moderate, severe or extreme**.',
    ] },
    { h: 'Response', body: [
      'Switch on the seat-belt signs early, fly the turbulence penetration speed, keep the wings level and accept altitude changes. A change of level or track away from the cold side usually helps. Report it, so that others can avoid it.',
    ], note: 'Forecast areas of clear-air turbulence appear on significant weather charts, but actual encounters are patchy. Pilot reports are the best information.' },
  ],
  examples: [
    { title: 'Shear', steps: ['Wind is 80 kt at FL300 and 120 kt at FL340.', 'Change = 40 kt over 4,000 ft.', 'Vertical shear = 10 kt per 1,000 ft.'] },
    { title: 'Which way out?', steps: ['Moderate turbulence on the polar side of a westerly jet in the northern hemisphere.', 'CAT is concentrated on the cold side.', 'A track change towards the warm side, or a level change, is likely to help.'] },
  ],
  practice: [
    num('Wind is 80 kt at FL300 and 120 kt at FL340. Vertical shear in kt per 1,000 ft?', 10, 0.1, 'kt', '40 kt ÷ 4 = 10 kt per 1,000 ft.'),
    mcq('The core of a jet stream lies:', ['In the warm air just below the tropopause', 'At the surface', 'In the cold air far above the tropopause', 'In the middle of a thunderstorm'], 'Near a break in the tropopause.'),
    mcq('Clear-air turbulence is caused by:', ['Wind shear', 'Heavy rain', 'Low cloud', 'Engine exhaust'], 'A rapid change of wind with height or distance.'),
    mcq('In turbulence the crew should fly:', ['The turbulence penetration speed', 'The maximum operating speed', 'The minimum control speed', 'Any speed'], 'To protect both the structure and the buffet margin.'),
    tf('A jet stream is much deeper than it is wide.', false, 'It is hundreds of kilometres wide and only a few kilometres deep.'),
  ],
  assessment: [
    num('Wind changes by 30 kt over 5,000 ft. Vertical shear in kt per 1,000 ft?', 6, 0.1, 'kt', '30 ÷ 5 = 6 kt per 1,000 ft.'),
    num('Wind changes by 45 kt over 3,000 ft. Vertical shear in kt per 1,000 ft?', 15, 0.1, 'kt', '45 ÷ 3 = 15 kt per 1,000 ft.'),
    mcq('Clear-air turbulence near a jet stream is most likely:', ['On the cold side, below the core', 'On the warm side, far above the core', 'Only at the surface', 'Only inside cloud'], 'Where the shear is strongest.'),
    mcq('On the cold side of a jet stream, wind speed falls away:', ['Quickly', 'Slowly', 'Not at all', 'Only at night'], 'Hence the strong shear there.'),
    mcq('The scale of turbulence intensity is:', ['Light, moderate, severe, extreme', 'Low, medium, high', 'One to ten', 'Green, amber, red'], 'Used in pilot reports and forecasts.'),
    mcq('Clear-air turbulence can also be caused by:', ['Mountain waves reaching cruise levels', 'Sea breezes', 'Radiation fog', 'Runway lights'], 'Standing waves downwind of mountain ranges.'),
    tf('Pilot reports are an important source of information about clear-air turbulence.', true, 'Encounters are patchy and hard to forecast exactly.'),
  ],
  missionId: 'm-atpl-cat', sources: ['faa-wx'],
});

export const tropical = lesson('Meteorology', {
  id: 'atpl-tropical-weather', title: 'Tropical Weather', minutes: 13, level: 3, prereqs: ['atpl-global-circulation'],
  objectives: ['Describe the weather of the intertropical convergence zone.', 'State the conditions needed for a tropical revolving storm.', 'Describe the structure and names of tropical revolving storms.', 'Describe other tropical weather features.'],
  intro: 'Prerequisite review: the trade winds converge at the intertropical convergence zone, where air rises into deep convective cloud. Long-haul routes cross it daily, and beside it form the largest storms on Earth.',
  simple: 'Near the equator the weather is driven by heat and moisture, not by fronts. Storm clouds there grow far higher than an airliner can climb. Over very warm sea, away from the equator, clusters of storms can organise into a huge rotating system with a calm eye.',
  sections: [
    { h: 'The ITCZ', body: [
      'The ITCZ is a broken band of towering cumulonimbus, with tops that can exceed 50,000 ft. Its position and activity vary: it moves with the Sun, further over land than over sea.',
      'Crossing it means weather-radar avoidance, turbulence, icing at high levels and heavy rain.',
    ] },
    { h: 'Tropical revolving storms', body: [
      'A **tropical revolving storm** needs: a **sea surface temperature of about 26 to 27 °C** or more; a position at least about **5° of latitude** from the equator, so that the Coriolis effect can start the rotation; and **little change of wind with height**.',
      'It has a calm, clear **eye** surrounded by the **eye wall**, where the winds and rain are most violent, and spiral rain bands. It rotates anticlockwise in the northern hemisphere and clockwise in the southern.',
      'It is called a **hurricane** in the Atlantic and eastern Pacific, a **typhoon** in the north-west Pacific and a **cyclone** in the Indian Ocean and south Pacific.',
    ], lab: 'explore:tropical' },
    { h: 'Life cycle', body: [
      'These storms form in late summer and autumn, move westward and then curve towards the pole. They weaken quickly over land or cold water, where their supply of warm, moist air is cut off.',
    ] },
    { h: 'Other features', body: [
      '**Easterly waves** are troughs moving westward in the trade winds, with showers and thunderstorms behind them. The **trade wind inversion** caps cloud at low level in the settled trade-wind zones. Dust-laden winds such as the **harmattan** in West Africa reduce visibility severely.',
    ], note: 'Thresholds are typical values quoted from memory. Tropical storm warnings and advisories give the actual position and forecast track.' },
  ],
  examples: [
    { title: 'Could one form here?', steps: ['Warm sea at 28 °C, at latitude 2° N.', 'The sea is warm enough, but the Coriolis effect is too weak so close to the equator.', 'A tropical revolving storm will not develop there.'] },
    { title: 'Naming', steps: ['A tropical revolving storm approaches Japan from the south-east.', 'It is in the north-west Pacific.', 'It is called a typhoon.'] },
  ],
  practice: [
    mcq('Cumulonimbus tops in the ITCZ can reach:', ['Above 50,000 ft', '5,000 ft at most', '10,000 ft at most', '500 ft'], 'Far above airliner cruising levels.'),
    mcq('The calm centre of a tropical revolving storm is the:', ['Eye', 'Eye wall', 'Rain band', 'Trough'], 'Surrounded by the most violent weather.'),
    mcq('A tropical revolving storm in the north-west Pacific is called a:', ['Typhoon', 'Hurricane', 'Cyclone', 'Tornado'], 'Hurricane in the Atlantic; cyclone in the Indian Ocean.'),
    mcq('Tropical revolving storms weaken over land because:', ['Their supply of warm, moist air is cut off', 'The land is too hot', 'There is too much Coriolis effect', 'The air is too clean'], 'They are fuelled by latent heat from warm sea.'),
    tf('Tropical revolving storms form on the equator itself.', false, 'The Coriolis effect there is too weak to start rotation.'),
  ],
  assessment: [
    num('At least about how many degrees of latitude from the equator must a tropical revolving storm be to form?', 5, 0.5, '°', 'About 5°, so that the Coriolis effect is sufficient.'),
    mcq('A tropical revolving storm needs a sea surface temperature of at least about:', ['26 to 27 °C', '10 °C', '15 °C', '40 °C'], 'Warm sea supplies the latent heat.'),
    mcq('The most violent winds in a tropical revolving storm are found in the:', ['Eye wall', 'Eye', 'Outer cirrus', 'Sea below'], 'The ring around the eye.'),
    mcq('In the northern hemisphere a tropical revolving storm rotates:', ['Anticlockwise', 'Clockwise', 'Not at all', 'In both directions'], 'Clockwise in the southern hemisphere.'),
    mcq('A tropical revolving storm in the Atlantic is called a:', ['Hurricane', 'Typhoon', 'Monsoon', 'Harmattan'], 'Also in the eastern Pacific.'),
    mcq('An easterly wave is:', ['A trough moving westward in the trade winds', 'A wave on the sea', 'A jet stream', 'A type of fog'], 'Showers and thunderstorms follow it.'),
    tf('Strong change of wind with height favours the development of a tropical revolving storm.', false, 'Little wind shear is needed, so that the storm is not torn apart.'),
  ],
  missionId: 'm-atpl-tropical', sources: ['faa-wx'],
});

export const highAltHazards = lesson('Meteorology', {
  id: 'atpl-high-altitude-hazards', title: 'High-Altitude Hazards', minutes: 13, level: 3, prereqs: ['atpl-jet-streams-and-clear-air-turbulence', 'atpl-gas-turbine-engines'],
  objectives: ['Describe the hazard of volcanic ash and the response.', 'Describe ice crystal icing.', 'Describe hazards near the tops of thunderstorms.', 'Describe other high-altitude phenomena.'],
  intro: 'Prerequisite review: turbofan engines depend on smooth airflow and on turbine temperatures staying within limits, and thunderstorm tops can reach far above cruise levels. The upper atmosphere has hazards that cannot be seen on a weather radar and, at night, cannot be seen at all.',
  simple: 'Volcanic ash looks like thin cloud but melts inside jet engines and can stop them. Tiny ice crystals near big storms can do something similar. The answer to both is the same: do not go in, and if you find yourself in, get out the way you came.',
  sections: [
    { h: 'Volcanic ash', body: [
      'Volcanic ash is fine, hard, glassy rock. It **does not show on weather radar**. Inside an engine it melts and coats the turbine, causing surge and **flameout**; it also abrades windscreens and leading edges and blocks pitot probes.',
      'Signs: a smell of sulphur, haze or dust in the cabin, St Elmo\'s fire, a glow at the engine intakes, fluctuating engine parameters.',
      'Response: **reduce thrust to idle** (to lower turbine temperature), make a **180° turn** to leave the cloud by the shortest route, put on oxygen masks if needed, and follow the checklist.',
    ], lab: 'explore:high-alt-hazards' },
    { h: 'Ice crystal icing', body: [
      'Near large convective systems, high concentrations of tiny ice crystals exist at high altitude and very low temperatures. They do not stick to the cold airframe, but inside a warm engine they can melt, refreeze and build up, causing power loss, surge or flameout. Returns on the weather radar are weak.',
      'Clues are a rise in total air temperature and rain-like sounds or moisture on the windscreen at temperatures far too cold for rain.',
    ] },
    { h: 'Thunderstorm tops', body: [
      'Flying over a cumulonimbus is hazardous: severe turbulence and hail can extend well above the visible top, and the top may still be rising. Avoid laterally, upwind, by a wide margin.',
    ] },
    { h: 'Other phenomena', body: [
      '**St Elmo\'s fire** is a harmless electrical glow, but it signals a charged atmosphere. **Ozone** and **cosmic radiation** increase with altitude; solar events can raise radiation and disturb HF radio and satellite navigation.',
    ], note: 'Volcanic ash advisories are issued by designated centres, and ash procedures are in the aircraft\'s abnormal checklists. This lesson gives the principles from memory.' },
  ],
  examples: [
    { title: 'Ash at night', steps: ['There is a smell of sulphur, static on the windscreen and the engine parameters are fluctuating.', 'Suspect volcanic ash.', 'Thrust to idle, turn through 180°, descend if terrain allows, run the checklist.'] },
    { title: 'Too cold for rain', steps: ['At −40 °C near a large storm, the windscreen sounds as if it is being hit by rain and the total air temperature reading rises.', 'These are signs of ice crystals.', 'Leave the area and follow the engine icing procedure.'] },
  ],
  practice: [
    mcq('Volcanic ash on a weather radar is:', ['Not detected', 'Shown in red', 'Shown as a strong echo', 'Shown as lightning'], 'The particles are too small and dry.'),
    mcq('Volcanic ash harms a jet engine mainly by:', ['Melting and coating the turbine, causing surge and flameout', 'Cooling the fuel', 'Increasing the thrust', 'Cleaning the compressor'], 'It is glassy rock that melts at engine temperatures.'),
    mcq('Ice crystal icing is found:', ['At high altitude near large convective systems', 'Only in freezing rain at low level', 'Only on the ground', 'In clear, dry air far from cloud'], 'Where radar returns are weak.'),
    mcq('St Elmo\'s fire is:', ['An electrical glow on the aircraft', 'An engine fire', 'A type of lightning strike', 'A fuel leak'], 'Harmless itself, but a sign of a charged atmosphere.'),
    tf('It is safe to overfly a thunderstorm provided the aircraft is above the visible cloud top.', false, 'Severe turbulence and hail extend above the visible top.'),
  ],
  assessment: [
    mcq('On suspecting an encounter with volcanic ash, the thrust should be:', ['Reduced to idle', 'Increased to maximum', 'Left unchanged', 'Reversed'], 'Lower turbine temperature reduces melting of the ash.'),
    mcq('The recommended manoeuvre to leave a volcanic ash cloud is:', ['A 180° turn', 'A climb straight ahead', 'To continue on track', 'A steep dive straight ahead'], 'The shortest way out is the way you came in.'),
    mcq('Which of these is a sign of volcanic ash?', ['A smell of sulphur and a glow at the engine intakes', 'A strong weather radar echo', 'A sudden drop in outside temperature only', 'A green light on the wing'], 'Also haze in the cabin and fluctuating engine parameters.'),
    mcq('Ice crystals at high altitude cause problems mainly:', ['Inside the engines', 'On the wing leading edges', 'On the tyres', 'In the fuel tanks'], 'They melt and refreeze on warm engine surfaces.'),
    mcq('A clue to ice crystal icing is:', ['Rain-like sounds on the windscreen at temperatures far too cold for rain', 'Thick airframe ice on the wings', 'A strong red radar echo directly ahead', 'Freezing drizzle at the surface'], 'Often with a rise in indicated total air temperature.'),
    mcq('Thunderstorms at cruise level should be avoided:', ['Laterally, upwind, by a wide margin', 'By flying just above the top', 'By flying beneath the anvil', 'By flying through the centre quickly'], 'Hazards extend above and downwind of the visible cloud.'),
    tf('Volcanic ash can block pitot probes and damage windscreens.', true, 'It is abrasive as well as harmful to engines.'),
  ],
  missionId: 'm-atpl-ash', sources: ['faa-wx', 'faa-aim'],
});
