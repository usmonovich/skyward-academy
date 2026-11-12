// PPL Phase B — Human Performance and Limitations (4 lessons) and Meteorology (3 lessons).
// US rules quoted here were checked against 14 CFR §91.211 and §91.17 on 12 Nov 2026.
import { lesson, mcq, num, tf } from './q';

export const hypoxia = lesson('Human performance', {
  id: 'ppl-hypoxia-and-the-atmosphere', title: 'Hypoxia and the Atmosphere', minutes: 11, level: 2, prereqs: ['ppl-basic-meteorology'],
  objectives: ['Explain why less oxygen is available at altitude.', 'Name the four types of hypoxia.', 'Recognise the symptoms of hypoxia and of hyperventilation.', 'Describe the danger of carbon monoxide.'],
  intro: 'The most dangerous thing about a shortage of oxygen is that it feels fine. Judgement goes first, and with it the ability to notice that anything is wrong.',
  simple: 'The air always contains the same share of oxygen, but higher up the air is thinner, so each breath delivers less. The brain is affected first. You may feel cheerful and confident while your thinking gets worse.',
  sections: [
    { h: 'Oxygen and altitude', body: [
      'Air is about 21% oxygen at every altitude. What falls with height is the pressure, and so the amount of oxygen forced into the blood with each breath. At 18,000 ft the pressure is about half its sea-level value.',
    ] },
    { h: 'Types of hypoxia', body: [
      '**Hypoxia** is a lack of sufficient oxygen in the body tissues. Four types are described: **hypoxic** (too little oxygen available, as at altitude), **hypemic** (the blood cannot carry enough, as with carbon monoxide), **stagnant** (the blood is not circulating well) and **histotoxic** (the cells cannot use the oxygen, as with alcohol and some drugs).',
    ], lab: 'explore:hypoxia' },
    { h: 'Symptoms and time', body: [
      'Symptoms include impaired judgement, euphoria, headache, drowsiness, tingling, blue fingernails and lips, and narrowing vision. They differ from person to person and come on gradually.',
      'The **time of useful consciousness** shortens rapidly with altitude: FAA guidance gives about 20 to 30 minutes at 18,000 ft but only 3 to 5 minutes at 25,000 ft.',
      'Night vision is affected first, from altitudes as low as 5,000 ft.',
    ] },
    { h: 'Hyperventilation and carbon monoxide', body: [
      '**Hyperventilation**, breathing too fast, often from anxiety, lowers carbon dioxide in the blood and causes dizziness and tingling similar to hypoxia. The remedy is to slow the breathing deliberately.',
      '**Carbon monoxide** from a leaking exhaust heater is odourless and binds to the blood far more readily than oxygen. If you suspect it: heater off, fresh air vents open, land as soon as practicable.',
    ], note: 'Oxygen rules differ between states. As an example, United States rules (14 CFR §91.211) require the flight crew to use oxygen above 12,500 ft cabin altitude for any part of the flight longer than 30 minutes, and at all times above 14,000 ft. Check the rules that apply to you.' },
  ],
  examples: [
    { title: 'Recognising it', steps: ['At 13,000 ft a pilot feels unusually cheerful and makes an arithmetic slip.', 'Euphoria and impaired thinking are typical of hypoxia.', 'Use oxygen if available and descend.'] },
    { title: 'Hypoxia or hyperventilation?', steps: ['At 3,000 ft an anxious passenger feels dizzy with tingling fingers and is breathing fast.', 'Altitude is too low for hypoxic hypoxia.', 'Hyperventilation is likely: help them slow their breathing.'] },
  ],
  practice: [
    mcq('The percentage of oxygen in the air at 18,000 ft is:', ['About 21%, the same as at sea level', 'About 10%', 'About 5%', 'Zero'], 'The share is constant; the pressure is lower.'),
    mcq('Hypoxia caused by altitude is called:', ['Hypoxic hypoxia', 'Hypemic hypoxia', 'Stagnant hypoxia', 'Histotoxic hypoxia'], 'Too little oxygen is available to the lungs.'),
    mcq('Breathing too fast because of anxiety is called:', ['Hyperventilation', 'Hypoxia', 'Hypothermia', 'Hypertension'], 'It lowers carbon dioxide in the blood.'),
    mcq('Carbon monoxide in a light aircraft most often comes from:', ['A leaking exhaust heater system', 'The fuel tanks', 'The battery', 'The tyres'], 'Cabin heat is usually taken from around the exhaust.'),
    tf('A pilot suffering from hypoxia always realises it immediately.', false, 'Impaired judgement hides the problem.'),
  ],
  assessment: [
    mcq('Less oxygen reaches the blood at altitude because:', ['The air pressure is lower', 'The percentage of oxygen is lower', 'The air is colder', 'The air is drier'], 'Lower pressure means less oxygen per breath.'),
    mcq('Hypoxia caused by carbon monoxide is:', ['Hypemic hypoxia', 'Hypoxic hypoxia', 'Stagnant hypoxia', 'Hyperventilation'], 'The blood cannot carry enough oxygen.'),
    mcq('An early symptom of hypoxia is:', ['Impaired judgement, often with a feeling of well-being', 'Severe pain', 'Loud ringing only', 'Sudden hunger'], 'This is what makes it so dangerous.'),
    num('Under US rules (14 CFR §91.211), above what cabin pressure altitude in feet must the required flight crew use oxygen for the entire time?', 14000, 1, 'ft', 'Above 14,000 ft at all times; between 12,500 and 14,000 ft for periods over 30 minutes.'),
    mcq('The remedy for hyperventilation is to:', ['Slow the rate of breathing', 'Breathe faster', 'Climb', 'Hold the breath for several minutes'], 'This restores carbon dioxide levels.'),
    mcq('If you suspect carbon monoxide in the cabin, you should:', ['Turn off the heater, open fresh air vents and land as soon as practicable', 'Turn the heater up', 'Close all vents', 'Continue to the destination'], 'Remove the source and get fresh air.'),
    tf('The time of useful consciousness becomes shorter as altitude increases.', true, 'From many minutes at 18,000 ft to a few minutes at 25,000 ft.'),
  ],
  missionId: 'm-ppl-hypoxia', sources: ['phak', 'cfr-91'],
});

export const vision = lesson('Human performance', {
  id: 'ppl-vision-and-illusions', title: 'Vision and Illusions', minutes: 11, level: 2, prereqs: ['ppl-hypoxia-and-the-atmosphere'],
  objectives: ['Describe day and night vision.', 'Use an effective scan for other aircraft.', 'Recognise a collision course.', 'Describe common visual and balance illusions and the defence against them.'],
  intro: 'Pilots fly by what they see, and eyes and balance organs evolved for walking, not flying. In certain conditions they give confident, wrong information.',
  simple: 'Your eyes need time to adapt to the dark and have blind spots. An aircraft that stays in the same place in your windscreen and grows bigger is coming straight at you. When your body and the instruments disagree, the instruments are right.',
  sections: [
    { h: 'How the eye works', body: [
      '**Cones**, concentrated at the centre of the retina, give sharp colour vision in daylight. **Rods**, around the edges, work in dim light but see no colour or fine detail.',
      'Full adaptation to darkness takes about 30 minutes and is lost in seconds by bright light. At night, look slightly to one side of an object to place it on the rods.',
    ] },
    { h: 'Looking out', body: [
      'The eye sees detail only while it is still. Scan the sky in short steps of about 10°, pausing for at least a second at each.',
      'An aircraft on a **collision course** shows no relative movement: it stays at the same point in the windscreen and simply grows. If it is not moving across the window, act.',
      'With nothing to focus on, such as in haze, the eyes relax to a focus only a few metres away (**empty-field myopia**) and distant traffic is missed.',
    ] },
    { h: 'Illusions', body: [
      'A runway that is **narrower** than you are used to, or that slopes **upward**, makes you feel too high, tempting a dangerously low approach. A wider or down-sloping runway does the opposite.',
      'Approaching over dark, featureless ground at night (the **black-hole** effect) also makes you feel too high.',
      'Without outside references, the balance organs mislead: a gradual bank goes unnoticed (**the leans**), and acceleration feels like pitching up.',
    ], lab: 'explore:illusions', note: 'The defence against disorientation is the same every time: believe the instruments, and avoid flying into conditions where outside references are lost unless you are trained and equipped for it.' },
  ],
  examples: [
    { title: 'Collision course', steps: ['An aircraft has stayed at the same spot in your windscreen for ten seconds and looks larger.', 'No relative movement means converging paths.', 'Alter course now, following the right-of-way rules.'] },
    { title: 'Narrow runway', steps: ['You approach a runway half as wide as your home runway.', 'It looks further away and you feel high.', 'Check the approach against the aiming point and airspeed; do not descend early.'] },
  ],
  practice: [
    mcq('Which cells of the eye work in dim light?', ['Rods', 'Cones', 'The lens', 'The cornea'], 'They detect light and movement but not colour.'),
    mcq('At night, a faint object is best seen by looking:', ['Slightly to one side of it', 'Directly at it', 'Through closed eyelids', 'Through the bottom of the windscreen'], 'The centre of the eye has few rods.'),
    mcq('An effective lookout uses:', ['Short eye movements with a pause at each position', 'One long continuous sweep', 'A fixed stare ahead', 'Looking only at the instruments'], 'The eye must be still to see detail.'),
    mcq('An up-sloping runway makes a pilot feel:', ['Too high', 'Too low', 'Too fast', 'Too slow'], 'The tendency is then to fly a low approach.'),
    tf('When body sensations and instruments disagree in cloud, the body is usually right.', false, 'The balance organs are unreliable without visual references.'),
  ],
  assessment: [
    mcq('Sharp colour vision in daylight is provided by:', ['Cones', 'Rods', 'The optic nerve', 'The iris'], 'They are concentrated at the centre of the retina.'),
    num('About how many minutes does full adaptation to darkness take?', 30, 3, 'min', 'About 30 minutes, and it is lost quickly in bright light.'),
    mcq('An aircraft on a collision course with you appears:', ['Stationary in the windscreen and growing larger', 'To move quickly across the windscreen', 'To shrink', 'To flash'], 'No relative movement is the warning sign.'),
    mcq('A runway narrower than usual gives the illusion of being:', ['Too high, leading to a low approach', 'Too low, leading to a high approach', 'Too close', 'Level when it is not'], 'It looks further away than it is.'),
    mcq('The black-hole effect occurs when approaching:', ['Over dark, featureless ground at night', 'In bright sunshine', 'Over a city by day', 'In formation'], 'With no surrounding cues the pilot tends to fly too low.'),
    mcq('The correct response to spatial disorientation is to:', ['Trust the flight instruments', 'Trust body sensations', 'Close your eyes', 'Make large control inputs'], 'Instruments are not fooled by acceleration.'),
    tf('In hazy conditions with nothing to focus on, the eyes tend to focus only a short distance ahead.', true, 'This is empty-field myopia.'),
  ],
  missionId: 'm-ppl-vision', sources: ['phak', 'faa-aim'],
});

export const fitness = lesson('Human performance', {
  id: 'ppl-fatigue-stress-and-fitness-to-fly', title: 'Fatigue, Stress and Fitness to Fly', minutes: 10, level: 2, prereqs: ['ppl-aviation-safety-culture'],
  objectives: ['Distinguish acute from chronic fatigue.', 'Describe the effect of stress on performance.', 'Explain the effects of alcohol, medication and dehydration.', 'Explain why flying soon after scuba diving is dangerous.'],
  intro: 'An aircraft is inspected before every flight and grounded for defects. The pilot is the one component that must inspect and ground itself.',
  simple: 'Tired, stressed, unwell or dehydrated pilots make more mistakes and notice fewer of them. Alcohol and many medicines affect flying long after you feel normal. After diving, wait before you fly.',
  sections: [
    { h: 'Fatigue', body: [
      '**Acute fatigue** is short-term tiredness after effort or a poor night, cured by rest. **Chronic fatigue** builds up over time when recovery is never complete, and needs a longer break.',
      'Fatigue slows reactions, narrows attention and makes errors go unnoticed. A fatigued person is a poor judge of their own state.',
    ], lab: 'explore:fitness' },
    { h: 'Stress', body: [
      'A moderate level of stress sharpens performance. Too little brings boredom and inattention; too much overloads attention and performance collapses.',
      'Stress adds up: pressures from home and work come into the cockpit with the pilot.',
    ] },
    { h: 'Alcohol, medicines and water', body: [
      'Alcohol impairs judgement and coordination, and altitude increases its effect. Regulations set limits: United States rules (14 CFR §91.17), for example, forbid acting as crew within 8 hours of drinking or with an alcohol concentration of 0.04 or more. Being legal is not the same as being fit; a hangover is also impairment.',
      'Many common medicines cause drowsiness. Check with an aviation medical examiner before flying on any medication.',
      '**Dehydration** causes headache, fatigue and poor concentration. Drink water before and during flight.',
    ] },
    { h: 'After diving', body: [
      'Breathing compressed air under water dissolves extra nitrogen in the body. Climbing to altitude too soon lets it form bubbles: **decompression sickness**.',
      'FAA guidance recommends waiting at least 12 hours after a dive that needed no decompression stop before flying up to 8,000 ft, and at least 24 hours after a dive with decompression stops or before flying higher.',
    ], note: 'Limits and waiting times differ between states and are minimums, not targets. When in doubt, do not fly.' },
  ],
  examples: [
    { title: 'Kind of fatigue', steps: ['After weeks of long days a pilot still feels exhausted after a full night\'s sleep.', 'One night of rest has not helped.', 'This is chronic fatigue: a longer break is needed before flying.'] },
    { title: 'Diving holiday', steps: ['A pilot makes a dive with decompression stops at 10:00.', 'FAA guidance: wait at least 24 hours.', 'Do not fly before 10:00 the next day.'] },
  ],
  practice: [
    mcq('Tiredness after one short night, cured by a good sleep, is:', ['Acute fatigue', 'Chronic fatigue', 'Hypoxia', 'Stress'], 'It is short-term.'),
    mcq('Performance is generally best at:', ['A moderate level of stress', 'No stress at all', 'The highest possible stress', 'Any level of stress'], 'Too little or too much both reduce performance.'),
    mcq('Altitude makes the effects of alcohol:', ['Greater', 'Smaller', 'Disappear', 'No different'], 'Less oxygen compounds the impairment.'),
    mcq('Headache, tiredness and poor concentration on a hot day may indicate:', ['Dehydration', 'Too much oxygen', 'Good fitness', 'Low altitude'], 'Drink water regularly.'),
    tf('A pilot who is under the legal alcohol limit is always fit to fly.', false, 'Residual effects and hangover also impair performance.'),
  ],
  assessment: [
    mcq('Fatigue that builds up over weeks and is not cured by one night\'s sleep is:', ['Chronic fatigue', 'Acute fatigue', 'Hyperventilation', 'Motion sickness'], 'Recovery needs a longer period of rest.'),
    mcq('Excessive stress causes performance to:', ['Fall sharply', 'Improve steadily', 'Stay the same', 'Become perfect'], 'Attention becomes overloaded.'),
    num('Under US rules (14 CFR §91.17), a person may not act as a crewmember within how many hours after drinking alcohol?', 8, 0.1, 'h', 'The rule also sets a 0.04 alcohol concentration limit.'),
    num('FAA guidance recommends waiting at least how many hours before flying after a dive that required decompression stops?', 24, 0.1, 'h', '12 hours after a no-decompression dive for flight up to 8,000 ft; 24 hours otherwise.'),
    mcq('Flying too soon after scuba diving risks:', ['Decompression sickness', 'Carbon monoxide poisoning', 'Empty-field myopia', 'Carburettor icing'], 'Dissolved nitrogen forms bubbles as pressure falls.'),
    mcq('Before flying while taking a medicine, a pilot should:', ['Check with an aviation medical examiner', 'Double the dose', 'Assume all medicines are safe', 'Ask a passenger'], 'Many medicines cause drowsiness or affect judgement.'),
    tf('A fatigued pilot can reliably judge how impaired they are.', false, 'Fatigue reduces self-awareness.'),
  ],
  missionId: 'm-ppl-fitness', sources: ['phak', 'cfr-91', 'faa-aim'],
});

export const decisionMaking = lesson('Human performance', {
  id: 'ppl-decision-making-and-situational-awareness', title: 'Decision-Making and Situational Awareness', minutes: 11, level: 2, prereqs: ['ppl-fatigue-stress-and-fitness-to-fly'],
  objectives: ['Define situational awareness.', 'Apply a structured decision model.', 'Name the five hazardous attitudes and their antidotes.', 'Recognise plan continuation bias.'],
  intro: 'Most accidents in light aircraft are not caused by a lack of flying skill. They follow a decision: to depart, to continue, to descend, to try once more.',
  simple: 'Know what is happening around you and what is likely to happen next. When something changes, work through the decision step by step. Watch for the attitudes that push pilots into bad choices, above all the urge to press on.',
  sections: [
    { h: 'Situational awareness', body: [
      '**Situational awareness** has three levels: **perceiving** what is around you (aircraft, weather, fuel, terrain), **understanding** what it means, and **projecting** what will happen next.',
      'It is lost through distraction, overload, fixation on one problem and complacency.',
    ] },
    { h: 'A decision model', body: [
      'The **DECIDE** model gives a structure: **D**etect that something has changed, **E**stimate the need to react, **C**hoose a desirable outcome, **I**dentify actions that achieve it, **D**o the best action, **E**valuate the result.',
      'The last step matters: a decision is checked and, if necessary, changed.',
    ] },
    { h: 'Hazardous attitudes', body: [
      'Five attitudes are known to lead to poor decisions: **anti-authority** ("Don\'t tell me"), **impulsivity** ("Do something, quickly"), **invulnerability** ("It won\'t happen to me"), **macho** ("I can do it") and **resignation** ("What\'s the use?"). Each has an antidote to say to yourself.',
    ], lab: 'explore:hazardous-attitudes' },
    { h: 'Pressing on', body: [
      '**Plan continuation bias**, often called "get-there-itis", is the tendency to stick with the original plan as evidence against it grows. It strengthens the closer you are to the destination.',
      'Decide in advance the conditions under which you will turn back or divert, and treat them as fixed.',
    ], note: 'These models come from FAA aeronautical decision-making guidance. Other authorities teach similar ideas under different names.' },
  ],
  examples: [
    { title: 'Using DECIDE', steps: ['Detect: the cloud base ahead is lower than forecast.', 'Estimate and choose: continuing risks losing visual reference; the aim is to stay in good conditions.', 'Identify, do, evaluate: turn back towards the clear air behind, then reassess.'] },
    { title: 'Naming the attitude', steps: ['A pilot thinks: "Accidents happen to other people."', 'This is invulnerability.', 'Antidote: "It could happen to me."'] },
  ],
  practice: [
    mcq('Situational awareness means:', ['Knowing what is happening and what is likely to happen next', 'Knowing only your airspeed', 'Following the aircraft ahead', 'Listening to music in flight'], 'Perceive, understand, project.'),
    mcq('In the DECIDE model, the first step is to:', ['Detect that a change has occurred', 'Do the action', 'Evaluate the result', 'Declare an emergency'], 'You cannot decide about what you have not noticed.'),
    mcq('"I can do it, watch this" is the attitude called:', ['Macho', 'Resignation', 'Anti-authority', 'Impulsivity'], 'Antidote: "Taking chances is foolish."'),
    mcq('The antidote to impulsivity is:', ['"Not so fast. Think first."', '"It could happen to me."', '"Follow the rules."', '"I am not helpless."'], 'Slow down and consider the options.'),
    tf('The urge to continue to the destination grows weaker as you get closer to it.', false, 'It grows stronger: that is plan continuation bias.'),
  ],
  assessment: [
    mcq('The three levels of situational awareness are:', ['Perceive, understand, project', 'Aviate, navigate, communicate', 'Detect, do, evaluate', 'Pitch, power, trim'], 'See it, grasp it, look ahead.'),
    mcq('In the DECIDE model, the final step is to:', ['Evaluate the effect of the action', 'Detect a change', 'Choose an outcome', 'Identify actions'], 'A decision is monitored and corrected if needed.'),
    mcq('"It won\'t happen to me" is the attitude called:', ['Invulnerability', 'Macho', 'Impulsivity', 'Resignation'], 'Antidote: "It could happen to me."'),
    mcq('"What\'s the use? Nothing I do will matter" is the attitude called:', ['Resignation', 'Anti-authority', 'Invulnerability', 'Macho'], 'Antidote: "I am not helpless. I can make a difference."'),
    mcq('The antidote to the anti-authority attitude is:', ['"Follow the rules. They are usually right."', '"Not so fast."', '"Taking chances is foolish."', '"It could happen to me."'], 'Rules capture hard-won experience.'),
    mcq('Plan continuation bias is the tendency to:', ['Stick with the original plan despite growing evidence against it', 'Change plans too often', 'Forget the plan', 'Plan too carefully'], 'Also known as get-there-itis.'),
    tf('Fixating on a single problem can cause a loss of situational awareness.', true, 'Attention to everything else is lost.'),
  ],
  missionId: 'm-ppl-adm', sources: ['phak'],
});

export const atmosphereDepth = lesson('Meteorology', {
  id: 'ppl-the-atmosphere-in-depth', title: 'The Atmosphere in Depth', minutes: 11, level: 2, prereqs: ['ppl-basic-meteorology'],
  objectives: ['Describe the troposphere, tropopause and stratosphere.', 'State the values of the International Standard Atmosphere.', 'Calculate ISA temperature and ISA deviation.', 'Explain a temperature inversion.'],
  intro: 'Aircraft performance figures, altimeters and flight levels are all built on one agreed model of the air: the International Standard Atmosphere. The real air is never exactly standard, and the difference matters.',
  simple: 'Weather lives in the lowest layer of the air, where it normally gets colder as you climb. A standard set of numbers describes an average atmosphere. Comparing the real temperature with the standard one tells you whether the day is "warm" or "cold" for flying.',
  sections: [
    { h: 'Layers', body: [
      'In the **troposphere** temperature normally falls with height. Its top, the **tropopause**, is higher over the equator than over the poles. Above it, in the lower **stratosphere**, temperature stops falling.',
    ] },
    { h: 'The standard atmosphere', body: [
      'The **International Standard Atmosphere (ISA)** assumes at mean sea level a pressure of 1013.25 hPa and a temperature of 15 °C, with temperature falling by 1.98 °C per 1,000 ft (2 °C is used in practice) up to 36,090 ft, then constant at −56.5 °C.',
      'So `ISA temperature = 15 − 2 × (altitude ÷ 1,000)`. At 8,000 ft it is −1 °C.',
      'Standard pressure levels are useful landmarks: 850 hPa is near 5,000 ft, 700 hPa near 10,000 ft and 500 hPa near 18,000 ft.',
    ], formula: 'isa-temp', lab: 'formula:isa-temp' },
    { h: 'ISA deviation', body: [
      '**ISA deviation** is actual temperature minus ISA temperature at that level. At 6,000 ft ISA is 3 °C; an outside temperature of 10 °C is ISA + 7.',
      'A positive deviation means warmer, less dense air than standard, and so reduced performance.',
    ] },
    { h: 'Inversions', body: [
      'In a **temperature inversion** temperature rises with height through a layer. The layer is very stable: it traps smoke, haze and fog beneath it and can mark a sharp change in wind.',
    ], note: 'ISA is a reference, not a forecast. Actual temperatures and pressures come from weather reports for the day.' },
  ],
  examples: [
    { title: 'ISA temperature', steps: ['Find the ISA temperature at 10,000 ft.', '2 × 10 = 20.', '15 − 20 = −5 °C.'] },
    { title: 'ISA deviation', steps: ['At 4,000 ft the outside air temperature is 12 °C.', 'ISA there is 15 − 8 = 7 °C.', '12 − 7 = +5: the day is ISA + 5.'] },
  ],
  practice: [
    num('Using 2 °C per 1,000 ft, the standard-atmosphere temperature at 10,000 ft is?', -5, 0.2, '°C', '15 − 20 = −5 °C.'),
    num('At 4,000 ft the outside air temperature is 12 °C. ISA deviation in °C?', 5, 0.2, '°C', 'ISA is 7 °C, so 12 − 7 = +5.'),
    mcq('In the troposphere, temperature normally:', ['Falls with increasing height', 'Rises with increasing height', 'Stays constant', 'Doubles every 1,000 ft'], 'About 2 °C per 1,000 ft in ISA.'),
    mcq('ISA sea-level pressure is:', ['1013.25 hPa', '1000 hPa', '1025 hPa', '980 hPa'], 'Equal to 29.92 inches of mercury.'),
    tf('A positive ISA deviation means the air is colder than standard.', false, 'It means warmer than standard.'),
  ],
  assessment: [
    num('Using 2 °C per 1,000 ft, the standard-atmosphere temperature at 8,000 ft is?', -1, 0.2, '°C', '15 − 16 = −1 °C.'),
    num('At 6,000 ft the outside air temperature is 10 °C. ISA deviation in °C?', 7, 0.2, '°C', 'ISA is 3 °C, so 10 − 3 = +7.'),
    mcq('The 500 hPa pressure level is found at about:', ['18,000 ft', '5,000 ft', '10,000 ft', '30,000 ft'], 'About half of sea-level pressure.'),
    mcq('The tropopause is:', ['Higher over the equator than over the poles', 'Higher over the poles than over the equator', 'At the same height everywhere', 'At sea level'], 'Warm air at the equator makes a deeper troposphere.'),
    mcq('In a temperature inversion, temperature:', ['Increases with height', 'Decreases with height faster than normal', 'Stays exactly constant', 'Falls to absolute zero'], 'The layer is very stable.'),
    mcq('Beneath an inversion you can expect:', ['Trapped haze, smoke or fog and poor visibility', 'Towering thunderstorms', 'Severe icing only', 'Perfect visibility'], 'The stable layer acts as a lid.'),
    tf('In ISA, temperature is constant at −56.5 °C above about 36,000 ft.', true, 'That is the standard tropopause.'),
  ],
  missionId: 'm-ppl-atmosphere', sources: ['phak', 'icao-7488'],
});

export const fronts = lesson('Meteorology', {
  id: 'ppl-fronts-and-air-masses', title: 'Fronts and Air Masses', minutes: 11, level: 2, prereqs: ['ppl-the-atmosphere-in-depth', 'ppl-clouds'],
  objectives: ['Describe how air masses are classified.', 'Describe the weather of a warm front and of a cold front.', 'Describe occluded and stationary fronts.', 'Use Buys Ballot\'s law to locate low pressure.'],
  intro: 'A front on a weather chart is a promise of change: of cloud, wind, visibility and temperature. Reading which kind is coming tells a pilot what the sky will do over the next few hours.',
  simple: 'Large bodies of air take on the character of where they came from: warm or cold, moist or dry. Where two of them meet is a front. A warm front brings slow, widespread cloud and rain; a cold front brings a narrow band of sharp weather.',
  sections: [
    { h: 'Air masses', body: [
      'An **air mass** is a large body of air with similar temperature and humidity throughout. It is named by its source: **polar** or **tropical**, **maritime** (moist) or **continental** (dry).',
    ] },
    { h: 'Warm front', body: [
      'Warm air slides up over colder air on a shallow slope. Cloud arrives in sequence, hours ahead: cirrus, cirrostratus, altostratus, then nimbostratus with steady rain, low cloud and poor visibility.',
      'After it passes: warmer air, a change of wind direction, and often low stratus or drizzle.',
    ], lab: 'explore:fronts' },
    { h: 'Cold front', body: [
      'Cold air undercuts warm air on a steep slope, forcing it up sharply. Expect a narrow band of cumulus and cumulonimbus, heavy showers, possibly thunderstorms and gusty winds.',
      'After it passes: a sudden drop in temperature, a sharp change of wind direction, rising pressure and good visibility with showers.',
    ] },
    { h: 'Other fronts and finding the low', body: [
      'An **occluded front** forms when a cold front catches up with a warm front, lifting the warm air off the surface; weather of both types is possible. A **stationary front** is hardly moving.',
      '**Buys Ballot\'s law**: in the northern hemisphere, stand with your back to the wind and the low pressure is on your left. In the southern hemisphere it is on your right.',
    ], note: 'These are textbook patterns from mid-latitudes. Real fronts vary greatly: always use the actual forecasts and reports.' },
  ],
  examples: [
    { title: 'Reading the sky', steps: ['High cirrus thickens through the morning into a grey sheet of altostratus.', 'This is the classic sequence ahead of a warm front.', 'Expect lowering cloud and steady rain within hours.'] },
    { title: 'Finding the low', steps: ['In the northern hemisphere the wind is blowing on your back.', 'Apply Buys Ballot\'s law.', 'Low pressure is to your left.'] },
  ],
  practice: [
    mcq('An air mass from over a cold ocean is described as:', ['Polar maritime', 'Tropical continental', 'Polar continental', 'Tropical maritime'], 'Cold source, moist surface.'),
    mcq('Steady rain from nimbostratus with poor visibility is typical of:', ['A warm front', 'A cold front', 'A ridge of high pressure', 'A sea breeze'], 'Widespread layer cloud.'),
    mcq('A narrow band of heavy showers and possible thunderstorms is typical of:', ['A cold front', 'A warm front', 'Radiation fog', 'An inversion'], 'Warm air is forced up steeply.'),
    mcq('After a cold front passes, the temperature usually:', ['Falls', 'Rises', 'Stays the same', 'Doubles'], 'Colder air has arrived.'),
    tf('In the northern hemisphere, with your back to the wind, low pressure is on your right.', false, 'It is on your left.'),
  ],
  assessment: [
    mcq('An air mass is:', ['A large body of air with similar temperature and humidity throughout', 'A single cloud', 'A gust of wind', 'The air inside an aircraft cabin'], 'It takes its character from its source region.'),
    mcq('The first cloud to appear ahead of a warm front is usually:', ['Cirrus', 'Cumulonimbus', 'Stratus', 'Nimbostratus'], 'High cloud arrives many hours ahead.'),
    mcq('Compared with a warm front, the slope of a cold front is:', ['Steeper', 'Shallower', 'The same', 'Horizontal'], 'That is why its weather is narrow and intense.'),
    mcq('After a cold front passes, visibility is usually:', ['Good, with showers', 'Very poor in fog', 'Poor in drizzle', 'Zero'], 'Cold, unstable air is clear between showers.'),
    mcq('An occluded front forms when:', ['A cold front catches up with a warm front', 'Two warm fronts meet', 'A front stops moving', 'A sea breeze meets a land breeze'], 'The warm air is lifted off the surface.'),
    mcq('In the northern hemisphere, with your back to the wind, low pressure is:', ['On your left', 'On your right', 'Directly ahead', 'Directly behind'], 'Buys Ballot\'s law.'),
    tf('A continental air mass is generally drier than a maritime one.', true, 'It formed over land.'),
  ],
  missionId: 'm-ppl-fronts', sources: ['phak', 'faa-wx'],
});

export const windTurbulence = lesson('Meteorology', {
  id: 'ppl-wind-and-turbulence', title: 'Wind and Turbulence', minutes: 11, level: 2, prereqs: ['ppl-fronts-and-air-masses', 'math-trig'],
  objectives: ['Describe how wind is reported.', 'Explain sea breezes and other local winds.', 'Describe mechanical turbulence, mountain waves and windshear.', 'Calculate a crosswind component.'],
  intro: 'Wind is felt most at the two moments that matter most: take-off and landing. It also shapes the ride, the route over high ground and the fuel in the tanks.',
  simple: 'Wind is named by where it comes from. Near the ground it is slowed and stirred by hills, trees and buildings. Only the part of the wind blowing across the runway is crosswind.',
  sections: [
    { h: 'Reporting wind', body: [
      'Wind is given as the direction it blows **from** and its speed in knots: 270/15 is from the west at 15 kt. A wind that changes direction clockwise is **veering**; anticlockwise is **backing**.',
      'A **gust** is a brief increase in speed. Friction slows the wind near the surface, so the wind a few thousand feet up is normally stronger.',
    ] },
    { h: 'Local winds', body: [
      'By day the land heats faster than the sea; air rises over the land and cooler air flows in from the sea: a **sea breeze**. At night the flow reverses as a weaker **land breeze**.',
      'At night, cold dense air drains down slopes as a **katabatic** wind.',
    ] },
    { h: 'Turbulence', body: [
      '**Mechanical turbulence** comes from wind flowing over obstacles and rough ground; it grows with wind speed.',
      'Strong wind across a mountain ridge can set up **mountain waves** downwind, with severe turbulence in the **rotor** zone beneath the wave crests and strong downdraughts on the lee side. Lens-shaped (lenticular) clouds are a visible sign.',
      '**Windshear** is a rapid change in wind speed or direction over a short distance. Near the ground it can cause a sudden loss of airspeed.',
    ] },
    { h: 'Crosswind', body: [
      '`crosswind = wind speed × sin(angle between wind and runway)`. With runway 27 and wind from 300° at 20 kt, the angle is 30° and the crosswind is 10 kt.',
      'Every aircraft has a maximum demonstrated crosswind in its flight manual.',
    ], formula: 'crosswind', lab: 'formula:crosswind', note: 'Your own crosswind limit as a new pilot will be well below the aircraft\'s demonstrated figure. Set it with your instructor.' },
  ],
  examples: [
    { title: 'Crosswind', steps: ['Runway 18, wind 240° at 16 kt.', 'Angle = 240 − 180 = 60°; sin 60° = 0.866.', 'Crosswind = 16 × 0.866 ≈ 13.9 kt.'] },
    { title: 'Sea breeze', steps: ['A coastal airfield is calm at 08:00 on a hot, clear day.', 'By early afternoon the land is much warmer than the sea.', 'Expect an onshore wind to develop: the runway in use may change.'] },
  ],
  practice: [
    num('Runway 18, wind from 240° at 16 kt. Crosswind component?', 13.9, 0.3, 'kt', '16 × sin 60° ≈ 13.9 kt.'),
    mcq('A wind reported as 270/15 is blowing:', ['From the west at 15 kt', 'Towards the west at 15 kt', 'From the east at 15 kt', 'From the south at 27 kt'], 'Direction is where it comes from.'),
    mcq('A sea breeze blows:', ['From sea to land during the day', 'From land to sea during the day', 'Only at night', 'Only in winter'], 'The land heats faster than the sea.'),
    mcq('Lens-shaped clouds near mountains indicate:', ['Mountain waves', 'Calm air', 'Radiation fog', 'A sea breeze'], 'Turbulence may be severe even in clear air nearby.'),
    tf('A wind changing from 180° to 220° is backing.', false, 'A clockwise change is veering.'),
  ],
  assessment: [
    num('Runway 27, wind from 300° at 20 kt. Crosswind component?', 10, 0.3, 'kt', '20 × sin 30° = 10 kt.'),
    num('Runway 09, wind from 180° at 15 kt. Crosswind component?', 15, 0.3, 'kt', 'The wind is at 90° to the runway: all of it is crosswind.'),
    mcq('A wind changing direction clockwise is said to be:', ['Veering', 'Backing', 'Gusting', 'Lulling'], 'For example from 180° to 220°.'),
    mcq('A land breeze blows:', ['From land to sea at night', 'From sea to land by day', 'Up a mountain slope by day', 'Only over deserts'], 'At night the land cools faster than the sea.'),
    mcq('The most severe turbulence in mountain waves is usually found:', ['In the rotor zone beneath the wave crests, downwind of the ridge', 'Upwind of the ridge at low level', 'Only above 40,000 ft', 'Over the sea'], 'Rotors can exceed the control power of a light aircraft.'),
    mcq('Windshear is:', ['A rapid change of wind speed or direction over a short distance', 'A steady wind', 'A type of cloud', 'The same as crosswind'], 'Near the ground it can cause a sudden loss of airspeed.'),
    tf('Mechanical turbulence increases as wind speed increases.', true, 'Stronger flow over obstacles produces larger eddies.'),
  ],
  missionId: 'm-ppl-wind', sources: ['phak', 'faa-wx'],
});
