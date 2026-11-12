// Aviation English, second batch: exercises for stages 2, 3, 6, 7 and 8.
// Quizzes, listening passages and ATC scenarios. All content is original practice material.
// The app does not assess or certify an ICAO language level.
import type { Question } from '../types';
import { match, mcq, num, order, tagQuestions, tf } from './q';
import type { AtcItem, AtcScenario, ListeningPassage } from './english';

/* ------------------------------------------------------------------ Quizzes */

export const verbs: Question[] = tagQuestions([
  mcq('Complete: "The engineer ___ the engine every morning."', ['checks', 'check', 'checking', 'checked'], 'Present simple with he, she or it adds -s: checks.'),
  mcq('Complete: "Right now the aircraft ___ to the runway."', ['is taxiing', 'taxis', 'taxied', 'taxi'], '"Right now" needs the present continuous: is taxiing.'),
  mcq('Complete: "Last night we ___ in heavy rain."', ['landed', 'land', 'landing', 'lands'], '"Last night" needs the past simple: landed.'),
  mcq('Complete: "They ___ not see the other aircraft yesterday."', ['did', 'do', 'does', 'are'], 'Past simple negative: did not + verb.'),
  mcq('Complete: "The flight is ___ to leave at noon."', ['going', 'go', 'goes', 'gone'], '"Is going to" + verb describes a plan.'),
  mcq('Which sentence is in the present continuous?', ['The pilot is checking the weather.', 'The pilot checks the weather.', 'The pilot checked the weather.', 'The pilot will check the weather.'], 'Present continuous: am, is or are + verb-ing.'),
  match('Match each verb to its past form.', [['fly', 'flew'], ['take off', 'took off'], ['begin', 'began'], ['see', 'saw']], 'These verbs are irregular: they do not add -ed.'),
  mcq('Complete: "I have ___ this airport before."', ['visited', 'visit', 'visiting', 'visits'], 'Present perfect: have + past participle.'),
  order('Put the words in order to make a negative sentence.', ['The captain', 'did not', 'accept', 'the clearance.'], 'Subject + did not + verb + object.'),
], 'en-verbs-', 'English structure');

export const questionsQuiz: Question[] = tagQuestions([
  mcq('Choose the correct question.', ['What time does the flight leave?', 'What time the flight leaves?', 'What time leaves the flight?', 'What time do the flight leave?'], 'Question word + does + subject + verb.'),
  mcq('Complete: "___ you speak English?" "Yes, I do."', ['Do', 'Are', 'Is', 'Does'], 'Use "do" with you, we and they.'),
  mcq('Complete: "___ is the weather like today?"', ['What', 'How', 'Who', 'Which'], 'The fixed question is "What is ... like?"'),
  mcq('Someone says, "Could you repeat that, please?" They want you to:', ['Say it again', 'Speak more quietly', 'Stop talking', 'Write it down'], '"Repeat" means say again.'),
  mcq('Choose the most polite request.', ['Could you help me with this bag, please?', 'Help me with this bag.', 'You help me.', 'Bag. Help.'], '"Could you ..., please?" is a polite request.'),
  mcq('Complete: "How ___ fuel do we have?"', ['much', 'many', 'long', 'far'], 'Use "much" with things you cannot count, such as fuel.'),
  match('Match each question word to what it asks about.', [['Where', 'A place'], ['When', 'A time'], ['Why', 'A reason'], ['Who', 'A person']], 'Each question word asks for one kind of information.'),
  order('Put the words in order to make a question.', ['Where', 'did you', 'park', 'the aircraft?'], 'Question word + did + subject + verb + object.'),
], 'en-questions-', 'English structure');

export const describing: Question[] = tagQuestions([
  mcq('Complete: "The flight was delayed ___ the fog."', ['because of', 'because', 'so', 'although'], 'Use "because of" before a noun.'),
  mcq('Complete: "It was raining heavily, ___ we decided to wait."', ['so', 'because', 'despite', 'unless'], '"So" introduces a result.'),
  mcq('Complete: "___ the wind was strong, the landing was smooth."', ['Although', 'Because', 'So', 'Therefore'], '"Although" introduces a contrast.'),
  mcq('Complete: "If the weather improves, we ___ depart at ten."', ['will', 'would have', 'did', 'were'], 'First conditional: if + present, will + verb.'),
  mcq('Which sentence is in the passive voice?', ['The runway was closed by the airport authority.', 'The airport authority closed the runway.', 'The airport authority is closing the runway.', 'The airport authority will close the runway.'], 'Passive: be + past participle. The runway receives the action.'),
  mcq('Complete: "While we ___, the cabin crew noticed smoke."', ['were climbing', 'climb', 'are climb', 'climbs'], 'Past continuous for an action in progress when something else happened.'),
  mcq('The controller said, "The runway is closed." Reported speech: "The controller said that the runway ___ closed."', ['was', 'will', 'has', 'be'], 'In reported speech the present usually moves to the past.'),
  match('Match each linking word to its job.', [['because', 'Gives a reason'], ['however', 'Shows a contrast'], ['therefore', 'Shows a result'], ['then', 'Shows the next step']], 'Linking words show how ideas are connected.'),
  order('Put these events in a logical order.', ['First we checked the fuel,', 'then we started the engine,', 'and finally we called the tower.'], 'First, then, finally mark the sequence.'),
], 'en-describe-', 'English structure');

export const clarify: Question[] = tagQuestions([
  mcq('ATC gives an instruction, but you heard only the first part, up to the heading. The best response is:', ['"Say again all after heading."', '"Roger."', '"OK, thanks."', 'To stay silent'], 'Ask for exactly the part you missed.'),
  mcq('You think the controller said flight level 80, but you are not sure. You say:', ['"Confirm flight level eight zero?"', '"Roger, flight level eight zero."', '"Wilco."', '"Affirm."'], '"Confirm" asks the controller to verify what you understood.'),
  mcq('There is no standard phrase for your problem. You should:', ['Explain it in clear, simple plain language', 'Stay silent', 'Invent a new code word', 'Repeat your call sign until asked'], 'Plain language is used when phraseology does not cover the situation.'),
  mcq('Which sentence explains a technical problem most clearly?', ['"We have a hydraulic leak and may not be able to lower the flaps."', '"Something is a bit funny with the aeroplane."', '"Problem. Big."', '"We are kind of having a thing here."'], 'Name the system, and say what it means for the flight.'),
  mcq('The controller asks, "What are your intentions?" A suitable answer is:', ['"We intend to hold for ten minutes to complete checklists, then return to land."', '"Yes."', '"Skyward 123."', '"Say again."'], 'State what you plan to do, and in what order.'),
  mcq('You do not know the English word for a part that has failed. A good strategy is to:', ['Describe what it does or where it is', 'Say nothing about it', 'Use a word from your own language', 'Guess a technical-sounding word'], 'Paraphrasing keeps communication going.'),
  mcq('At ICAO Operational Level 4, a speaker is expected to:', ['Communicate effectively on work-related topics, with errors that rarely interfere with meaning', 'Speak with no trace of an accent', 'Never make a grammar mistake', 'Use only standard phraseology'], 'Level 4 is about effective communication, not perfection.'),
  tf('"Unable" tells the controller that you cannot comply with an instruction.', true, 'It is normally followed by the reason.'),
  order('Put this transmission in a clear order.', ['Skyward 123,', 'unable to climb', 'due to icing,', 'request lower level.'], 'Call sign, the problem, the reason, then the request.'),
], 'en-clarify-', 'Operational English');

export const paraphrase: Question[] = tagQuestions([
  mcq('Which sentence means the same as "We were unable to land because the runway was blocked"?', ['The blocked runway prevented us from landing.', 'We blocked the runway, so we landed.', 'We landed although the runway was blocked.', 'The runway was unable to land.'], 'The cause (blocked runway) and the result (no landing) are kept.'),
  mcq('Complete: "If we had left earlier, we ___ the storm."', ['would have avoided', 'will avoid', 'avoid', 'had avoided'], 'Third conditional: if + past perfect, would have + past participle.'),
  mcq('Complete: "Had the crew not noticed the leak, the fuel ___ out."', ['would have run', 'will run', 'runs', 'has run'], '"Had the crew not ..." is a formal way to say "If the crew had not ...".'),
  mcq('Complete: "The aircraft, ___ had just been refuelled, was ready to depart."', ['which', 'who', 'what', 'where'], '"Which" adds information about a thing.'),
  mcq('A controller says, "Expect a delay of indeterminate length." This means:', ['Nobody knows how long the delay will be', 'The delay will be short', 'There is no delay', 'The delay is exactly one hour'], '"Indeterminate" means not fixed or not known.'),
  mcq('Which is the most precise report?', ['"We felt a single heavy vibration from the left engine at about 4,000 feet, followed by a rise in exhaust temperature."', '"The engine went bang or something."', '"It was bad."', '"There was a noise, you know, quite a noise."'], 'It says what, where, when and what followed.'),
  mcq('You have not been understood. The best strategy is to:', ['Say it again in different, simpler words', 'Repeat exactly the same words more loudly', 'Give up', 'Speak faster'], 'Paraphrasing is a key skill at higher levels.'),
  match('Match each formal word to its plain equivalent.', [['commence', 'begin'], ['terminate', 'end'], ['in the vicinity of', 'near'], ['prior to', 'before']], 'Knowing both lets you choose the clearer word.'),
  mcq('Complete: "Not only ___ the visibility poor, but the wind was also gusting."', ['was', 'were', 'did', 'has'], 'After "not only" at the start of a sentence, the verb comes before the subject.'),
], 'en-paraphrase-', 'Extended English');

export const nuance: Question[] = tagQuestions([
  mcq('A controller says, "I\'d suggest you make your decision sooner rather than later." This implies:', ['Conditions or traffic are likely to get worse, so decide quickly', 'There is no hurry', 'The controller is ordering a diversion', 'The controller is going off duty'], 'The polite wording carries a warning.'),
  mcq('A pilot says, "We\'re a little tight on fuel." A careful listener understands that:', ['Fuel may become a problem, and the pilot should be asked to state it clearly', 'The aircraft has plenty of fuel', 'The fuel caps are tightly closed', 'Nothing needs to be done'], 'Understatement hides urgency. Ask for the fuel state in plain terms.'),
  mcq('Why should idioms such as "we\'re in a bit of a pickle" be avoided on the radio?', ['Listeners whose first language is not English may not understand them', 'They take too long to say', 'They are impolite', 'They are forbidden only at night'], 'Idioms cannot be worked out from the words.'),
  mcq('Which reply best fits a professional register when declining an instruction?', ['"Unable due to weather ahead. Request heading two one zero."', '"No way, we\'re not doing that."', '"I\'m terribly sorry, but I\'m afraid I really couldn\'t possibly."', '"Negative, ghost rider."'], 'Short, neutral, with a reason and an alternative.'),
  mcq('An expert speaker talking to a less proficient speaker should:', ['Slow down, use standard phraseology and simple structures, and check understanding', 'Speak faster to save time', 'Use more idioms', 'Switch to another language'], 'Expert speakers carry the responsibility for being understood.'),
  mcq('The phrase "go ahead" can be misunderstood on the radio because it may be taken to mean:', ['Either "pass your message" or "proceed"', 'Only "stop"', 'Only "climb"', 'Nothing at all'], 'That is why "pass your message" is preferred.'),
  mcq('A first officer says, "Captain, that cloud ahead looks rather unfriendly." The intended meaning is most likely:', ['A hint that the captain should consider avoiding it', 'A comment on the scenery', 'A joke with no purpose', 'A request for a weather report'], 'Hints are a weak way to raise a safety concern. A direct statement is safer.'),
  mcq('ICAO Expert Level 6 differs from Level 5 mainly in that the speaker:', ['Communicates naturally and accurately in all contexts, with sensitivity to register and nuance', 'Knows more phraseology by heart', 'Speaks faster', 'Has no accent at all'], 'Level 6 is about range, accuracy and subtlety, not speed or accent.'),
  tf('A native speaker of English communicates safely on the radio without needing to adapt their speech.', false, 'Native speakers must also use standard phraseology and adapt to their listeners.'),
], 'en-nuance-', 'Expert English');

/* ---------------------------------------------------------------- Listening */

export const LISTENING_MORE: ListeningPassage[] = [
  { id: 'briefing', title: 'Weather briefing', lines: [
      { who: 'Instructor', text: 'Good morning. Before we fly, let us look at the weather. At the moment the wind is from the west at ten knots, and the visibility is more than ten kilometres. However, a band of rain is expected to arrive at about two o\'clock this afternoon, so we need to be back on the ground by half past one. If the cloud gets lower than fifteen hundred feet, we will return early.' }],
    questions: tagQuestions([
      mcq('Where is the wind coming from?', ['The west', 'The east', 'The north', 'The south'], '"The wind is from the west at ten knots."'),
      mcq('When is the rain expected to arrive?', ['At about two o\'clock in the afternoon', 'At about ten o\'clock in the morning', 'At half past one', 'In the evening'], '"At about two o\'clock this afternoon."'),
      mcq('By what time must they be back on the ground?', ['Half past one', 'Two o\'clock', 'Ten o\'clock', 'Half past two'], '"Back on the ground by half past one."'),
      mcq('What will they do if the cloud gets too low?', ['Return early', 'Climb above it', 'Continue as planned', 'Land at another airfield'], '"We will return early."'),
    ], 'en-listen-brief-', 'Listening') },
  { id: 'delay', title: 'Announcement to passengers', lines: [
      { who: 'Captain', text: 'Ladies and gentlemen, this is your captain speaking. I am sorry to tell you that our departure will be delayed by about forty minutes. During the pre-flight inspection we found a small problem with one of the tyres, and the engineers are changing it now. This is a routine job and there is no cause for concern. We expect to make up some of the time in the air.' }],
    questions: tagQuestions([
      num('By about how many minutes is the departure delayed?', 40, 0, 'min', '"Delayed by about forty minutes."'),
      mcq('What is the reason for the delay?', ['A tyre is being changed', 'The weather is bad', 'A passenger is late', 'The aircraft needs fuel'], '"A small problem with one of the tyres."'),
      mcq('How does the captain describe the work?', ['As routine', 'As dangerous', 'As unusual', 'As impossible'], '"This is a routine job."'),
      mcq('"We expect to make up some of the time in the air" means:', ['The flight will arrive less late than the delay suggests', 'The flight will take longer', 'The flight is cancelled', 'The clocks will be changed'], 'To "make up time" is to recover part of a delay.'),
    ], 'en-listen-delay-', 'Listening') },
  { id: 'gear', title: 'Landing gear problem', lines: [
      { who: 'Pilot', text: 'Northfield Approach, Skyward 123, we have an unsafe landing gear indication. The left main gear light is not showing green. Request to hold while we work through the checklist.' },
      { who: 'Approach', text: 'Skyward 123, roger. Hold at the Northfield beacon at altitude four thousand feet. Report when ready, and advise if you would like a low pass so that the tower can inspect the gear.' },
      { who: 'Pilot', text: 'Hold at the beacon at four thousand feet, wilco, Skyward 123. A low pass would be helpful. We have fuel for about one hour of holding.' },
      { who: 'Approach', text: 'Skyward 123, understood, fuel for one hour.' }],
    questions: tagQuestions([
      mcq('What is the problem?', ['The left main gear light is not showing green', 'An engine has failed', 'The radio is not working', 'The flaps will not move'], '"The left main gear light is not showing green."'),
      num('At what altitude, in feet, is the aircraft told to hold?', 4000, 0, 'ft', '"Altitude four thousand feet."'),
      mcq('Why is a low pass suggested?', ['So that the tower can look at the landing gear', 'To burn fuel', 'To practise the approach', 'To avoid other traffic'], '"So that the tower can inspect the gear."'),
      num('For about how many minutes can the aircraft hold?', 60, 0, 'min', '"Fuel for about one hour of holding."'),
    ], 'en-listen-gear-', 'Listening') },
  { id: 'runwaychange', title: 'Late runway change', lines: [
      { who: 'Tower', text: 'Skyward 123, change of runway. Expect runway zero nine. Wind zero eight zero degrees, one five knots.' },
      { who: 'Pilot', text: 'Confirm runway zero nine? We were cleared for the approach to runway two seven.' },
      { who: 'Tower', text: 'Skyward 123, affirm, runway zero nine. The wind has changed. Break off the approach, turn left heading one eight zero, climb to altitude three thousand feet.' },
      { who: 'Pilot', text: 'Breaking off the approach, left heading one eight zero, climbing to three thousand feet, Skyward 123. We will need a few minutes to brief the new approach.' }],
    questions: tagQuestions([
      mcq('Which runway is now expected?', ['09', '27', '18', '08'], '"Expect runway zero nine."'),
      mcq('Why has the runway changed?', ['The wind has changed', 'The runway is blocked', 'The lights have failed', 'Another aircraft has an emergency'], '"The wind has changed."'),
      mcq('How does the pilot react to the unexpected instruction?', ['By asking for confirmation', 'By ignoring it', 'By landing on runway 27', 'By declaring an emergency'], '"Confirm runway zero nine?"'),
      num('What heading is the aircraft given?', 180, 0, '°', '"Turn left heading one eight zero."'),
    ], 'en-listen-rwy-', 'Listening') },
  { id: 'smoke', title: 'Smell of burning in the cabin', lines: [
      { who: 'Cabin crew', text: 'Captain, we have a smell of burning in the rear galley. There is no visible smoke yet, but it is getting stronger, and one of the ovens was hot although it was switched off.' },
      { who: 'Pilot', text: 'Understood. Switch off all galley power and have an extinguisher ready. I am going to divert.' },
      { who: 'Pilot', text: 'MAYDAY, MAYDAY, MAYDAY, Skyward 123, smell of burning in the cabin, suspected electrical fault, request immediate diversion to Northfield.' },
      { who: 'Control', text: 'Skyward 123, roger MAYDAY. Turn right heading zero six zero, descend to altitude five thousand feet. Northfield is three five miles. Say persons on board and dangerous goods.' },
      { who: 'Pilot', text: 'Right heading zero six zero, descending five thousand feet. Forty-two persons on board, no dangerous goods, Skyward 123.' }],
    questions: tagQuestions([
      mcq('Where is the smell of burning?', ['In the rear galley', 'In the cockpit', 'In the cargo hold', 'In the forward toilet'], '"In the rear galley."'),
      mcq('What was unusual about the oven?', ['It was hot although it was switched off', 'It would not switch on', 'It was missing', 'It was making a loud noise'], '"One of the ovens was hot although it was switched off."'),
      mcq('What does the captain decide to do?', ['Divert', 'Continue to the destination', 'Hold and wait', 'Ask the passengers'], '"I am going to divert."'),
      num('How many persons are on board?', 42, 0, '', '"Forty-two persons on board."'),
      mcq('What does the pilot report about dangerous goods?', ['There are none on board', 'There are lithium batteries', 'The crew do not know', 'There is fuel in the cabin'], '"No dangerous goods."'),
    ], 'en-listen-smoke-', 'Listening') },
  { id: 'laser', title: 'Laser illumination', lines: [
      { who: 'Pilot', text: 'Northfield Approach, Skyward 123, be advised we have just been illuminated by a green laser, coming from the ground about three miles north-east of the field. The first officer was looking outside and has some spots in his vision, so I have taken control.' },
      { who: 'Approach', text: 'Skyward 123, roger, laser report copied. Are you able to continue the approach?' },
      { who: 'Pilot', text: 'Affirm, able to continue. I was looking down at the instruments at the time and I am not affected. We would appreciate it if you could warn the aircraft behind us.' },
      { who: 'Approach', text: 'Skyward 123, wilco, and the police have been informed.' }],
    questions: tagQuestions([
      mcq('What colour was the laser?', ['Green', 'Red', 'Blue', 'White'], '"Illuminated by a green laser."'),
      mcq('Where did the laser come from?', ['The ground, about three miles north-east of the field', 'Another aircraft', 'The control tower', 'The runway lights'], '"From the ground about three miles north-east of the field."'),
      mcq('Who was affected?', ['The first officer', 'The captain', 'Both pilots', 'A passenger'], '"The first officer ... has some spots in his vision."'),
      mcq('Why was the captain not affected?', ['The captain was looking down at the instruments', 'The captain was wearing sunglasses', 'The captain was in the cabin', 'The laser was too weak'], '"I was looking down at the instruments at the time."'),
      mcq('What does the pilot ask Approach to do?', ['Warn the aircraft behind', 'Close the airport', 'Switch off the runway lights', 'Send a doctor'], '"We would appreciate it if you could warn the aircraft behind us."'),
    ], 'en-listen-laser-', 'Listening') },
  { id: 'hinting', title: 'Saying what you mean', lines: [
      { who: 'First officer', text: 'It looks like we have been holding for quite a while now. I make it about twenty-five minutes of fuel before we are into the reserve.' },
      { who: 'Captain', text: 'Mm. Approach said only another ten minutes.' },
      { who: 'First officer', text: 'They said that twenty minutes ago as well. I am not comfortable with this. I think we should tell them exactly where we stand.' },
      { who: 'Captain', text: 'You are right. Northfield Approach, Skyward 123, minimum fuel. We can accept no further delay.' },
      { who: 'Approach', text: 'Skyward 123, roger minimum fuel. Leave the hold now, heading zero nine zero, you are number one.' }],
    questions: tagQuestions([
      mcq('The first officer\'s opening remark is best described as:', ['A hint', 'An order', 'A joke', 'A standard call'], 'It suggests a concern without stating it.'),
      num('How many minutes of fuel remain before the reserve?', 25, 0, 'min', '"About twenty-five minutes of fuel before we are into the reserve."'),
      mcq('Why does the first officer doubt the controller\'s estimate?', ['The same estimate was given twenty minutes earlier', 'The controller sounded tired', 'The radio was unclear', 'The weather was improving'], '"They said that twenty minutes ago as well."'),
      mcq('What changed the outcome?', ['The captain stated the fuel situation plainly, in standard words', 'The first officer took control', 'The weather cleared', 'Another aircraft diverted'], '"Minimum fuel. We can accept no further delay."'),
      mcq('What was the result?', ['The aircraft left the hold as number one', 'The aircraft diverted', 'The hold was extended', 'The aircraft declared a MAYDAY'], '"Leave the hold now ... you are number one."'),
    ], 'en-listen-hint-', 'Listening') },
  { id: 'fast', title: 'A busy, informal transmission', lines: [
      { who: 'Tower', text: 'Skyward 123, you are following a heavy on a four-mile final, caution wake turbulence. He is a touch slow, so you might want to ease back, and I will need you off at the first exit if you can manage it. There is one right behind you.' },
      { who: 'Pilot', text: 'Reducing speed, we have the traffic in sight. We will do our best for the first exit, but the runway is wet, so I cannot promise it, Skyward 123.' },
      { who: 'Tower', text: 'Understood, no pressure, the second exit is fine. Cleared to land runway two seven.' }],
    questions: tagQuestions([
      mcq('What is ahead of Skyward 123?', ['A heavy aircraft on final approach', 'A flock of birds', 'A thunderstorm', 'A closed runway'], '"You are following a heavy on a four-mile final."'),
      mcq('"You might want to ease back" means:', ['Reduce your speed', 'Climb', 'Turn back', 'Increase your speed'], 'The pilot replies, "Reducing speed."'),
      mcq('Why can the pilot not promise the first exit?', ['The runway is wet', 'The aircraft is too heavy', 'The exit is closed', 'The brakes have failed'], '"The runway is wet, so I cannot promise it."'),
      mcq('"No pressure, the second exit is fine" means:', ['The pilot need not rush; the second exit is acceptable', 'The tyres have no pressure', 'The pilot must use the first exit', 'The landing clearance is cancelled'], 'The controller removes the request.'),
      mcq('"There is one right behind you" explains:', ['Why the tower wants the runway vacated quickly', 'Why the pilot should go around', 'Where the fire service is', 'Which exit is closed'], 'Another aircraft is following closely.'),
    ], 'en-listen-fast-', 'Listening') },
];

/* ------------------------------------------------------------ ATC scenarios */

const CS: AtcItem = { label: 'Call sign', any: ['skyward one two three'] };

export const ATC_MORE: AtcScenario[] = [
  { id: 'technical', title: 'Technical Problem: Return to Land', level: 'Stage 6 · Level 4 preparation', intro: 'You have just departed from Northfield. The flaps will not retract fully.', steps: [
    { kind: 'request', style: 'Phraseology with plain language', situation: 'Tell Northfield Departure that you have a flap problem and request to return to Northfield for landing.', required: [CS, { label: 'The problem', any: ['flap', 'flaps'] }, { label: 'Request to return', any: ['return', 'returning', 'back to'] }], model: 'Northfield Departure, Skyward 123, we have a flap problem, request return to Northfield for landing.', reply: 'Skyward 123, roger, say your intentions.' },
    { kind: 'request', style: 'Plain language', situation: 'The controller asks for your intentions. Say that you need time to complete checklists and ask to hold.', required: [CS, { label: 'Time for checklists', any: ['checklist', 'checklists', 'time'] }, { label: 'Request to hold', any: ['hold', 'holding'] }], model: 'Skyward 123, we need ten minutes to complete checklists, request holding.', reply: 'Skyward 123, hold at Northfield, altitude 4,000 feet, QNH 1012. Report ready for approach.' },
    { kind: 'readback', style: 'Standard phraseology', atc: 'Skyward 123, hold at Northfield, altitude 4,000 feet, QNH 1012. Report ready for approach.', required: [{ label: 'Hold', any: ['hold', 'holding'] }, { label: '4,000 feet', any: ['four thousand'] }, { label: 'QNH 1012', any: ['one zero one two'] }, CS], model: 'Hold at Northfield, altitude 4,000 feet, QNH 1012, wilco, Skyward 123.' },
  ] },
  { id: 'clarify', title: 'Clarifying an Instruction', level: 'Stage 6 · Level 4 preparation', intro: 'You are inbound to Northfield on a busy frequency. Part of a transmission is blocked by another aircraft.', steps: [
    { kind: 'request', style: 'Standard phraseology', situation: 'ATC said: "Skyward 123, descend to altitude ... feet, QNH 1008." You did not hear the altitude. Ask for it to be repeated.', required: [CS, { label: 'Ask for a repeat', any: ['say again', 'confirm'] }, { label: 'What you missed', any: ['altitude', 'level'] }], model: 'Skyward 123, say again altitude.', reply: 'Skyward 123, descend to altitude 3,000 feet, QNH 1008.' },
    { kind: 'readback', style: 'Standard phraseology', atc: 'Skyward 123, descend to altitude 3,000 feet, QNH 1008.', required: [{ label: 'Descend', any: ['descend', 'descending'] }, { label: '3,000 feet', any: ['three thousand'] }, { label: 'QNH 1008', any: ['one zero zero eight'] }, CS], model: 'Descend to altitude 3,000 feet, QNH 1008, Skyward 123.' },
    { kind: 'request', style: 'Phraseology with plain language', situation: 'You are now told to turn onto a heading that would take you into a thunderstorm you can see ahead. Say that you cannot accept it, give the reason and ask for a different heading.', required: [CS, { label: 'Unable', any: ['unable'] }, { label: 'Reason: weather', any: ['weather', 'thunderstorm', 'storm', 'cumulonimbus', 'cb'] }, { label: 'Request', any: ['request', 'requesting'] }], model: 'Skyward 123, unable that heading due weather, request a heading further south.', reply: 'Skyward 123, roger, turn right heading 120.' },
  ] },
  { id: 'mayday', title: 'Distress: Engine Failure', level: 'Stage 7 · Level 5 preparation', intro: 'You are in a single-engine aircraft at 4,000 ft, west of Northfield, with two persons on board. The engine has failed.', steps: [
    { kind: 'request', style: 'Phraseology with plain language', situation: 'Make a distress call to Northfield Approach. State the problem, your intentions, your position and level, and persons on board.', required: [{ label: 'MAYDAY', any: ['mayday'] }, CS, { label: 'Nature of the emergency', any: ['engine'] }, { label: 'Intentions', any: ['forced landing', 'landing', 'land', 'glide', 'gliding'] }], model: 'MAYDAY, MAYDAY, MAYDAY, Northfield Approach, Skyward 123, engine failure, forced landing, west of Northfield, 4,000 feet, two persons on board.', reply: 'Skyward 123, roger MAYDAY. Northfield is east of you. Runway 27 is available, QNH 1010.' },
    { kind: 'readback', style: 'Standard phraseology', atc: 'Skyward 123, roger MAYDAY. Northfield is east of you. Runway 27 is available, QNH 1010.', required: [{ label: 'Runway 27', any: ['runway two seven'] }, { label: 'QNH 1010', any: ['one zero one zero'] }, CS], model: 'Runway 27, QNH 1010, Skyward 123.' },
    { kind: 'request', style: 'Plain language', situation: 'You realise that you cannot glide as far as the runway. Tell the controller, and say where you will land.', required: [CS, { label: 'Cannot reach the runway', any: ['unable', 'cannot', 'can not', 'will not'] }, { label: 'Where you will land', any: ['field'] }], model: 'Skyward 123, unable to reach the runway, landing in a field west of the aerodrome.', reply: 'Skyward 123, roger, emergency services are on their way.' },
  ] },
  { id: 'blocked', title: 'Runway Blocked: Agree a Plan', level: 'Stage 7 · Level 5 preparation', intro: 'You are holding near Northfield. Your alternate is Eastham.', steps: [
    { kind: 'request', style: 'Plain language', situation: 'Tower says: "The runway is blocked by a disabled aircraft. Expect a long delay. Say intentions." You do not have the fuel to wait. Explain, and say that you will divert to Eastham.', required: [CS, { label: 'Reason: fuel', any: ['fuel'] }, { label: 'Divert', any: ['divert', 'diverting', 'diversion'] }, { label: 'To Eastham', any: ['eastham'] }], model: 'Skyward 123, we do not have the fuel to hold, so we are diverting to Eastham.', reply: 'Skyward 123, roger. Climb to altitude 5,000 feet, turn right heading 110, contact Eastham Approach 124.3.' },
    { kind: 'readback', style: 'Standard phraseology', atc: 'Skyward 123, roger. Climb to altitude 5,000 feet, turn right heading 110, contact Eastham Approach 124.3.', required: [{ label: '5,000 feet', any: ['five thousand'] }, { label: 'Right', any: ['right'] }, { label: 'Heading 110', any: ['heading one one zero'] }, { label: 'Frequency 124.3', any: ['one two four decimal three'] }, CS], model: 'Climb to altitude 5,000 feet, right heading 110, contact Eastham Approach 124.3, Skyward 123.' },
  ] },
  { id: 'complex', title: 'Complex Emergency: Smoke and Diversion', level: 'Stage 8 · Level 6 preparation', intro: 'You are cruising when smoke appears in the cabin. Two aerodromes are within reach.', steps: [
    { kind: 'request', style: 'Phraseology with plain language', situation: 'Make a distress call to Northfield Control. State the problem and ask for an immediate descent and vectors to the nearest suitable aerodrome.', required: [{ label: 'MAYDAY', any: ['mayday'] }, CS, { label: 'Nature of the emergency', any: ['smoke', 'fire', 'burning'] }, { label: 'Request', any: ['request', 'require', 'need'] }], model: 'MAYDAY, MAYDAY, MAYDAY, Northfield Control, Skyward 123, smoke in the cabin, request immediate descent and vectors to the nearest suitable aerodrome.', reply: 'Skyward 123, roger MAYDAY. Northfield is far but has a long runway and full emergency services. Westbury is close but has a short runway and no fire service. Say your preference.' },
    { kind: 'request', style: 'Plain language', situation: 'Control offers Northfield (far, long runway, full emergency services) or Westbury (close, short runway, no fire service). Choose one and give your reason in a sentence.', required: [CS, { label: 'Your choice', any: ['northfield', 'westbury'] }, { label: 'A reason', any: ['because', 'due', 'since', 'so that', 'closer', 'nearest', 'runway', 'services', 'time'] }], model: 'Skyward 123, we will take Westbury because it is closer and we need to land as soon as possible.', reply: 'Skyward 123, roger, turn left heading 330, descend to altitude 3,000 feet, QNH 1004. Say persons on board and any dangerous goods.' },
    { kind: 'readback', style: 'Phraseology with plain language', atc: 'Skyward 123, roger, turn left heading 330, descend to altitude 3,000 feet, QNH 1004. Say persons on board and any dangerous goods.', required: [{ label: 'Left', any: ['left'] }, { label: 'Heading 330', any: ['heading three three zero'] }, { label: '3,000 feet', any: ['three thousand'] }, { label: 'QNH 1004', any: ['one zero zero four'] }, { label: 'Persons on board', any: ['persons on board', 'on board', 'souls'] }, { label: 'Dangerous goods', any: ['dangerous goods'] }, CS], model: 'Left heading 330, descending to altitude 3,000 feet, QNH 1004. Twelve persons on board, no dangerous goods, Skyward 123.' },
    { kind: 'request', style: 'Plain language', situation: 'You are on final approach. Tell the Tower what will happen after landing: you will stop on the runway and evacuate.', required: [CS, { label: 'Stop on the runway', any: ['on the runway'] }, { label: 'Evacuate', any: ['evacuate', 'evacuating', 'evacuation'] }], model: 'Skyward 123, we will stop on the runway and evacuate. Request fire services standing by.', reply: 'Skyward 123, roger, emergency services are standing by. Cleared to land.' },
  ] },
];
