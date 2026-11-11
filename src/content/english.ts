import type { Question } from '../types';
import { match, mcq, num, order, tagQuestions, tf } from './q';

export const CALLSIGN = 'Skyward 123';

export interface AtcItem { label: string; any: string[] }
export interface AtcStep {
  kind: 'readback' | 'request';
  /** Shown to the learner before a request step. */
  situation?: string;
  /** ATC transmission the learner must read back (readback steps). */
  atc?: string;
  required: AtcItem[];
  model: string;
  /** ATC acknowledgement after a successful request. */
  reply?: string;
  style: 'Standard phraseology' | 'Plain language' | 'Phraseology with plain language';
}
export interface AtcScenario { id: string; title: string; level: string; intro: string; steps: AtcStep[] }

const CS: AtcItem = { label: 'Call sign', any: ['skyward one two three'] };
const RWY: AtcItem = { label: 'Runway 27', any: ['runway two seven'] };

export const ATC_SCENARIOS: AtcScenario[] = [
  { id: 'taxi', title: 'Taxi Clearance', level: 'Stage 5 · Operational', intro: 'You are parked on the apron at Northfield with ATIS information Bravo. Request taxi and read back the clearance.', steps: [
    { kind: 'request', style: 'Standard phraseology', situation: 'Call Northfield Ground and request taxi. Say who you are, where you are, that you have information Bravo, and what you want.', required: [CS, { label: 'Request taxi', any: ['request taxi', 'requesting taxi', 'ready to taxi', 'ready for taxi'] }], model: 'Northfield Ground, Skyward 123, at the apron, information Bravo, request taxi.' },
    { kind: 'readback', style: 'Standard phraseology', atc: 'Skyward 123, taxi to holding point runway 27 via taxiway Alpha, QNH 1013.', required: [{ label: 'Holding point', any: ['holding point'] }, RWY, { label: 'Via Alpha', any: ['alpha', 'alfa'] }, { label: 'QNH 1013', any: ['qnh one zero one three', 'one zero one three'] }, CS], model: 'Taxi to holding point runway 27 via Alpha, QNH 1013, Skyward 123.' },
    { kind: 'readback', style: 'Standard phraseology', atc: 'Skyward 123, contact Tower 118.7.', required: [{ label: 'Frequency 118.7', any: ['one one eight decimal seven'] }, CS], model: 'Contact Tower 118.7, Skyward 123.' },
  ] },
  { id: 'takeoff', title: 'Line-Up and Take-Off', level: 'Stage 5 · Operational', intro: 'You are at the holding point of runway 27, ready for departure.', steps: [
    { kind: 'request', style: 'Standard phraseology', situation: 'Tell Northfield Tower you are at the holding point of runway 27 and ready for departure.', required: [CS, { label: 'Ready for departure', any: ['ready for departure', 'ready'] }], model: 'Northfield Tower, Skyward 123, holding point runway 27, ready for departure.' },
    { kind: 'readback', style: 'Standard phraseology', atc: 'Skyward 123, line up and wait runway 27.', required: [{ label: 'Line up and wait', any: ['line up and wait', 'lining up and waiting', 'line up'] }, RWY, CS], model: 'Line up and wait runway 27, Skyward 123.' },
    { kind: 'readback', style: 'Standard phraseology', atc: 'Skyward 123, wind 250 degrees 8 knots, runway 27, cleared for take-off.', required: [RWY, { label: 'Cleared for take-off', any: ['cleared for take off', 'cleared take off'] }, CS], model: 'Runway 27, cleared for take-off, Skyward 123.' },
  ] },
  { id: 'departure', title: 'Departure Instructions', level: 'Stage 5 · Operational', intro: 'You are airborne from runway 27 and have been transferred to Northfield Departure.', steps: [
    { kind: 'readback', style: 'Standard phraseology', atc: 'Skyward 123, identified, climb to flight level 80, turn left heading 240.', required: [{ label: 'Climb FL 80', any: ['flight level eight zero'] }, { label: 'Left', any: ['left'] }, { label: 'Heading 240', any: ['heading two four zero'] }, CS], model: 'Climb flight level 80, left heading 240, Skyward 123.' },
    { kind: 'readback', style: 'Standard phraseology', atc: 'Skyward 123, squawk 4521.', required: [{ label: 'Squawk 4521', any: ['four five two one'] }, CS], model: 'Squawk 4521, Skyward 123.' },
  ] },
  { id: 'approach', title: 'Approach and Landing', level: 'Stage 5 · Operational', intro: 'You are inbound to Northfield for an ILS approach to runway 27.', steps: [
    { kind: 'readback', style: 'Standard phraseology', atc: 'Skyward 123, descend to altitude 3,000 feet, QNH 1009.', required: [{ label: 'Descend', any: ['descend', 'descending'] }, { label: '3,000 feet', any: ['three thousand'] }, { label: 'QNH 1009', any: ['one zero zero nine'] }, CS], model: 'Descend to altitude 3,000 feet, QNH 1009, Skyward 123.' },
    { kind: 'readback', style: 'Standard phraseology', atc: 'Skyward 123, cleared ILS approach runway 27, report established.', required: [{ label: 'Cleared ILS approach', any: ['cleared ils approach', 'cleared i l s approach', 'cleared ils', 'cleared for the ils'] }, RWY, CS], model: 'Cleared ILS approach runway 27, wilco, Skyward 123.' },
    { kind: 'readback', style: 'Standard phraseology', atc: 'Skyward 123, wind 260 degrees 10 knots, runway 27, cleared to land.', required: [RWY, { label: 'Cleared to land', any: ['cleared to land'] }, CS], model: 'Runway 27, cleared to land, Skyward 123.' },
  ] },
  { id: 'goaround', title: 'Go-Around', level: 'Stage 5 · Non-routine', intro: 'You are on short final for runway 27 when the Tower calls.', steps: [
    { kind: 'readback', style: 'Standard phraseology', atc: 'Skyward 123, go around, I say again, go around, runway occupied.', required: [{ label: 'Going around', any: ['going around', 'go around'] }, CS], model: 'Going around, Skyward 123.' },
    { kind: 'readback', style: 'Standard phraseology', atc: 'Skyward 123, climb straight ahead to altitude 2,000 feet, contact Approach 119.1.', required: [{ label: 'Straight ahead', any: ['straight ahead'] }, { label: '2,000 feet', any: ['two thousand'] }, { label: 'Frequency 119.1', any: ['one one nine decimal one'] }, CS], model: 'Straight ahead, altitude 2,000 feet, contact Approach 119.1, Skyward 123.' },
  ] },
  { id: 'weather', title: 'Weather Deviation', level: 'Stage 6 · Level 4 preparation', intro: 'You are cruising at flight level 120. A large thunderstorm is 20 NM ahead on your track.', steps: [
    { kind: 'request', style: 'Phraseology with plain language', situation: 'Ask Northfield Control for a deviation to the right of track to avoid the weather. Give the reason.', required: [CS, { label: 'Request', any: ['request', 'requesting'] }, { label: 'Deviation to the right', any: ['right'] }, { label: 'Reason: weather', any: ['weather', 'thunderstorm', 'storm', 'cumulonimbus', 'build up', 'buildup', 'cb'] }], model: 'Northfield Control, Skyward 123, request deviation 20 degrees right of track due weather.', reply: 'Skyward 123, deviation right of track approved, report clear of weather.' },
    { kind: 'readback', style: 'Standard phraseology', atc: 'Skyward 123, deviation right of track approved, report clear of weather.', required: [{ label: 'Deviation approved', any: ['approved', 'deviation right', 'right of track'] }, { label: 'Will report (wilco)', any: ['wilco', 'will report', 'report clear'] }, CS], model: 'Deviation right of track approved, wilco, Skyward 123.' },
  ] },
  { id: 'urgency', title: 'Urgency: Medical Diversion', level: 'Stage 7 · Level 5 preparation', intro: 'A passenger has become seriously ill. You are 25 NM south of Northfield at 5,000 ft with four persons on board.', steps: [
    { kind: 'request', style: 'Phraseology with plain language', situation: 'Make an urgency call to Northfield Approach. State the problem, your position and level, and what you need.', required: [{ label: 'PAN PAN', any: ['pan pan'] }, CS, { label: 'Nature of the problem', any: ['passenger', 'medical', 'ill', 'sick', 'unwell'] }, { label: 'Intention or request', any: ['request', 'require', 'need', 'divert', 'diverting'] }], model: 'PAN PAN, PAN PAN, PAN PAN, Northfield Approach, Skyward 123, passenger seriously ill, 25 miles south of Northfield, 5,000 feet, request priority landing.' },
    { kind: 'readback', style: 'Phraseology with plain language', atc: 'Skyward 123, roger PAN, proceed direct Northfield, descend to altitude 3,000 feet, QNH 1011. Report persons on board.', required: [{ label: 'Direct Northfield', any: ['direct'] }, { label: '3,000 feet', any: ['three thousand'] }, { label: 'QNH 1011', any: ['one zero one one'] }, { label: 'Persons on board: four', any: ['four'] }, CS], model: 'Direct Northfield, descend to altitude 3,000 feet, QNH 1011, four persons on board, Skyward 123.' },
  ] },
];

export interface ListeningPassage { id: string; title: string; lines: { who: string; text: string }[]; questions: Question[] }

export const LISTENING: ListeningPassage[] = [
  { id: 'atis', title: 'ATIS broadcast', lines: [{ who: 'ATIS', text: 'Northfield information Charlie, time zero eight five zero. Runway in use two seven. Wind two four zero degrees, one two knots. Visibility one zero kilometres. Few clouds at three thousand feet. Temperature one eight, dew point one one. QNH one zero one six. Advise on first contact you have information Charlie.' }],
    questions: tagQuestions([
      mcq('Which runway is in use?', ['27', '24', '09', '16'], 'The broadcast says "runway in use two seven".'),
      num('What is the QNH?', 1016, 0, 'hPa', '"QNH one zero one six".'),
      mcq('What is the wind?', ['240 degrees, 12 knots', '270 degrees, 12 knots', '240 degrees, 20 knots', '120 degrees, 24 knots'], '"Wind two four zero degrees, one two knots".'),
      mcq('Which information letter must you report on first contact?', ['Charlie', 'Bravo', 'Delta', 'Alpha'], '"Advise on first contact you have information Charlie".'),
    ], 'en-listen-atis-', 'Listening') },
  { id: 'birdstrike', title: 'Non-routine conversation', lines: [
      { who: 'Pilot', text: 'Northfield Tower, Skyward 123, we have had a bird strike on departure. Engine indications are normal, but we would like to return for a precautionary landing.' },
      { who: 'Tower', text: 'Skyward 123, roger. Turn left, join downwind runway two seven. You are number one. Do you require any assistance?' },
      { who: 'Pilot', text: 'Left downwind runway two seven, negative assistance, Skyward 123. We will need about five minutes to complete our checklist.' },
      { who: 'Tower', text: 'Skyward 123, roger, report ready for approach.' }],
    questions: tagQuestions([
      mcq('What happened to the aircraft?', ['It hit a bird after take-off', 'It had an engine fire', 'It lost radio contact', 'It ran low on fuel'], 'The pilot reports "a bird strike on departure".'),
      mcq('What does the pilot want to do?', ['Return and land as a precaution', 'Continue to the destination', 'Divert to another airport', 'Hold for one hour'], '"We would like to return for a precautionary landing".'),
      mcq('Does the pilot need assistance?', ['No', 'Yes, fire services', 'Yes, medical help', 'The pilot does not answer'], '"Negative assistance".'),
      num('How many minutes does the crew need for the checklist?', 5, 0, 'min', '"About five minutes".'),
    ], 'en-listen-bird-', 'Listening') },
];

export const PHONETIC: [string, string][] = [['A', 'Alfa'], ['B', 'Bravo'], ['C', 'Charlie'], ['D', 'Delta'], ['E', 'Echo'], ['F', 'Foxtrot'], ['G', 'Golf'], ['H', 'Hotel'], ['I', 'India'], ['J', 'Juliett'], ['K', 'Kilo'], ['L', 'Lima'], ['M', 'Mike'], ['N', 'November'], ['O', 'Oscar'], ['P', 'Papa'], ['Q', 'Quebec'], ['R', 'Romeo'], ['S', 'Sierra'], ['T', 'Tango'], ['U', 'Uniform'], ['V', 'Victor'], ['W', 'Whiskey'], ['X', 'X-ray'], ['Y', 'Yankee'], ['Z', 'Zulu']];

const grammar = tagQuestions([
  mcq('Choose the correct sentence.', ['The aircraft is on the runway.', 'The aircraft are on the runway.', 'The aircraft on the runway is.', 'The aircraft be on the runway.'], '"Aircraft" here is singular, so use "is".'),
  mcq('Complete: "She ___ a pilot."', ['is', 'are', 'am', 'be'], 'Use "is" with he, she and it.'),
  mcq('Complete: "We ___ to the airport every day."', ['go', 'goes', 'going', 'gone'], 'Present simple with "we": go.'),
  mcq('Complete: "Yesterday the flight ___ at six o\'clock."', ['departed', 'departs', 'depart', 'is departing'], '"Yesterday" needs the past tense: departed.'),
  mcq('Complete: "Tomorrow we ___ fly to the coast."', ['will', 'did', 'was', 'are'], '"Will" + verb describes the future.'),
  mcq('Which question is correct?', ['Where is the control tower?', 'Where the control tower is?', 'Where is tower the control?', 'Is where the control tower?'], 'Question word + verb + subject.'),
  order('Put the words in order to make a sentence.', ['The', 'weather', 'is', 'good', 'today.'], 'Subject + verb + description + time.'),
  mcq('How do you say the time 14:30 in plain English?', ['Half past two in the afternoon', 'Two past half', 'Fourteen and thirty', 'Half to two'], '14:30 is half past two in the afternoon.'),
], 'en-grammar-', 'English structure');

const vocab = tagQuestions([
  match('Match the aircraft part to its description.', [['Wing', 'Produces most of the lift'], ['Fuselage', 'The main body of the aircraft'], ['Landing gear', 'Supports the aircraft on the ground'], ['Propeller', 'Turns engine power into thrust']], 'These are the main parts of an aeroplane.'),
  match('Match the airport word to its meaning.', [['Runway', 'Where aircraft take off and land'], ['Taxiway', 'A path between the runway and parking'], ['Apron', 'The area where aircraft park'], ['Control tower', 'Where controllers watch the aerodrome']], 'Airport areas each have a specific name.'),
  match('Match the phase of flight to what happens.', [['Take-off', 'The aircraft leaves the ground'], ['Cruise', 'Level flight at the planned altitude'], ['Approach', 'Descending toward the runway'], ['Taxi', 'Moving on the ground under its own power']], 'Flight phases.'),
  match('Match the weather word to its meaning.', [['Fog', 'Cloud at ground level that reduces visibility'], ['Gust', 'A sudden short increase in wind speed'], ['Turbulence', 'Irregular motion of the air'], ['Thunderstorm', 'A storm with lightning and thunder']], 'Weather vocabulary.'),
  mcq('What does "visibility" mean?', ['How far you can see', 'How high the clouds are', 'How strong the wind is', 'How cold the air is'], 'Visibility is the distance at which objects can be seen.'),
], 'en-vocab-', 'Aviation vocabulary');

const phraseology = tagQuestions([
  order('Put this readback in the correct order.', ['Taxi to holding point', 'runway 27', 'via Alpha,', 'Skyward 123'], 'Read back the instruction, then end with your call sign.'),
  order('Put this first call in the correct order.', ['Northfield Tower,', 'Skyward 123,', 'holding point runway 27,', 'ready for departure'], 'Station called, your call sign, your position, your message.'),
  mcq('What does "WILCO" mean?', ['I understand your message and will comply with it', 'I have received your message', 'Say that again', 'No'], '"Wilco" is short for "will comply".'),
  mcq('What does "ROGER" mean?', ['I have received all of your last transmission', 'Yes', 'I will comply', 'Permission granted'], '"Roger" only confirms receipt. It does not mean yes and is not a readback.'),
  mcq('Which word means "yes" in standard phraseology?', ['Affirm', 'Roger', 'Okay', 'Wilco'], '"Affirm" means yes; "negative" means no.'),
  mcq('You did not understand the controller. What do you say?', ['Say again', 'Repeat', 'What?', 'Pardon me'], 'The standard phrase is "say again".'),
  tf('The phrase "take-off" is used only when a take-off clearance is given or cancelled; otherwise say "departure".', true, 'This convention reduces the risk of a mistaken take-off.'),
  mcq('How is the number 9 pronounced in radiotelephony?', ['NIN-er', 'NINE', 'NOY-n', 'NEE-na'], 'ICAO pronunciation: "niner".'),
  mcq('Which message is plain language rather than standard phraseology?', ['"We have a passenger who is feeling very unwell and needs a doctor."', '"Cleared to land runway 27."', '"Climb flight level 80."', '"Squawk 4521."'], 'Standard phraseology covers routine situations. Unusual situations need clear plain language.'),
  mcq('How is flight level 120 spoken?', ['Flight level one two zero', 'Flight level one hundred and twenty', 'Flight level twelve zero', 'Level one twenty'], 'Each digit is spoken separately.'),
], 'en-phrase-', 'Radiotelephony');

export type ExerciseKind = 'quiz' | 'alphabet' | 'numbers' | 'listening' | 'atc';
export interface EnglishExercise { id: string; title: string; kind: ExerciseKind; stage: number; minutes: number; blurb: string; questions?: Question[] }

export const EN_EXERCISES: EnglishExercise[] = [
  { id: 'en-grammar', title: 'Sentence Basics', kind: 'quiz', stage: 1, minutes: 6, blurb: 'Build correct simple sentences in the present, past and future.', questions: grammar },
  { id: 'en-vocab', title: 'Vocabulary Match', kind: 'quiz', stage: 4, minutes: 6, blurb: 'Match aircraft, airport, flight-phase and weather words to their meanings.', questions: vocab },
  { id: 'en-alphabet', title: 'Phonetic Alphabet Trainer', kind: 'alphabet', stage: 4, minutes: 5, blurb: 'Alfa, Bravo, Charlie… spell call signs the aviation way.' },
  { id: 'en-numbers', title: 'Aviation Numbers by Ear', kind: 'numbers', stage: 4, minutes: 6, blurb: 'Listen to headings, levels and frequencies and type what you hear.' },
  { id: 'en-phrase', title: 'Phraseology Challenge', kind: 'quiz', stage: 5, minutes: 8, blurb: 'Order readbacks and choose the correct standard words.', questions: phraseology },
  { id: 'en-listen', title: 'Listening Missions', kind: 'listening', stage: 5, minutes: 8, blurb: 'Listen to an ATIS broadcast and a non-routine conversation, then answer.' },
  { id: 'en-atc', title: 'AI Air Traffic Controller', kind: 'atc', stage: 5, minutes: 12, blurb: 'Speak or type your transmissions. The controller reacts to what you say.' },
];

export const EN_STAGES: { n: number; title: string; focus: string; topics: string[] }[] = [
  { n: 1, title: 'Beginner English', focus: 'General English', topics: ['Alphabet', 'Pronunciation', 'Basic vocabulary', 'Numbers', 'Time', 'Dates', 'Basic grammar', 'Sentence construction', 'Everyday questions', 'Listening basics', 'Speaking basics'] },
  { n: 2, title: 'Elementary English', focus: 'General English', topics: ['Common verbs', 'Present tense', 'Past tense', 'Future constructions', 'Describing situations', 'Asking questions', 'Everyday conversations'] },
  { n: 3, title: 'Intermediate English', focus: 'General English', topics: ['More advanced grammar', 'Vocabulary development', 'Listening comprehension', 'Spoken fluency', 'Describing events', 'Explaining causes', 'Problem-solving conversations'] },
  { n: 4, title: 'Aviation English Foundations', focus: 'Aviation English', topics: ['Aviation vocabulary', 'Aircraft parts', 'Airport terminology', 'Flight phases', 'Weather vocabulary', 'Aviation numbers', 'Phonetic alphabet', 'Basic radiotelephony'] },
  { n: 5, title: 'Operational Aviation English', focus: 'Aviation English', topics: ['Pilot–controller communication', 'Standard phraseology', 'Readback and hearback', 'Departure, en-route, approach and landing', 'Non-routine situations', 'Clarification requests'] },
  { n: 6, title: 'ICAO Level 4 Preparation', focus: 'Operational level', topics: ['Intelligible pronunciation', 'Basic structures used creatively', 'Sufficient vocabulary for work topics', 'Appropriate tempo', 'Comprehension of work-related topics', 'Immediate and appropriate responses'] },
  { n: 7, title: 'ICAO Level 5 Preparation', focus: 'Extended level', topics: ['Complex structures', 'Paraphrasing', 'Speaking at length with ease', 'Comprehension of unexpected situations', 'Managing the speaker–listener relationship'] },
  { n: 8, title: 'ICAO Level 6 Preparation', focus: 'Expert level', topics: ['Natural, effortless flow', 'Idiomatic and nuanced vocabulary', 'Sensitivity to register', 'Consistent accuracy in all contexts', 'Recognising verbal and non-verbal cues'] },
];

export const ICAO_DIMENSIONS = ['Pronunciation', 'Structure', 'Vocabulary', 'Fluency', 'Comprehension', 'Interactions'] as const;

/** Text-only English questions for the Examination Center (listening items need audio, so they stay in their exercise). */
export const ENGLISH_BANK: Question[] = [...grammar, ...vocab, ...phraseology];
