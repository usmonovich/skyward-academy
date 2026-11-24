// Shared domain types. Content, engines, UI and the game all depend on these.

export type QLabel =
  | 'Original practice question'
  | 'Scenario-based training question'
  | 'Official publicly released question';

interface QBase {
  id: string;
  prompt: string;
  explain: string;
  hint?: string;
  topic?: string;
  lessonId?: string;
  label?: QLabel;
}
/** options[0] is always the correct option; the UI shuffles options on every attempt. */
export interface McqQ extends QBase { type: 'mcq'; options: string[] }
export interface TfQ extends QBase { type: 'tf'; answer: boolean }
export interface NumQ extends QBase { type: 'num'; answer: number; tol: number; unit: string }
/** items are stored in the correct order. */
export interface OrderQ extends QBase { type: 'order'; items: string[] }
export interface MatchQ extends QBase { type: 'match'; pairs: [string, string][] }
export type Question = McqQ | TfQ | NumQ | OrderQ | MatchQ;
export type Answer = string | boolean | number | string[] | Record<string, string> | undefined;

export type LabKey = 'pressure' | 'trig' | 'wind' | 'lift' | 'altimeter' | 'massbalance' | 'controls' | `formula:${string}` | `explore:${string}`;

export interface Section { h: string; body: string[]; formula?: string; lab?: LabKey; note?: string }
export interface Example { title: string; steps: string[] }

export type ContentStatus = 'draft' | 'review' | 'approved' | 'published';

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  level: 1 | 2 | 3;
  prereqs?: string[];
  objectives: string[];
  intro: string;
  /** Plain-English summary used by the tutor's "Explain Simply". */
  simple: string;
  sections: Section[];
  examples: Example[];
  practice: Question[];
  assessment: Question[];
  missionId: string;
  sources: string[];
  planned?: false;
}
export interface PlannedLesson { id: string; title: string; planned: true }
export type LessonEntry = Lesson | PlannedLesson;

export interface Module { id: string; title: string; phase?: string; supplementary?: boolean; code?: string; lessons: LessonEntry[] }
export type TrackId = 'math' | 'physics' | 'ppl' | 'cpl' | 'atpl';
export interface Track { id: TrackId; title: string; short: string; color: string; blurb: string; note?: string; modules: Module[] }

export interface FormulaVar { sym: string; name: string; unit: string; def: number; min: number; max: number; step?: number }
export interface Formula {
  id: string;
  name: string;
  expr: string;
  subject: 'Mathematics' | 'Physics' | 'Aviation';
  topic: string;
  level: 1 | 2 | 3;
  plain: string;
  vars: FormulaVar[];
  out: { sym: string; name: string; unit: string };
  compute: (v: Record<string, number>) => number;
  altUnits?: string;
  valid: string;
  example: string;
  real: string;
  aviation: string;
  mistakes: string[];
  related: string[];
  lessonId?: string;
}

export interface Term { id: string; term: string; def: string; tech: string; example: string; context: string; related: string[]; cat: string }

export type AircraftKind = 'single' | 'twin' | 'turboprop' | 'jet' | 'airliner';
export interface GameAircraft {
  id: string; name: string; cls: string; kind: AircraftKind; blurb: string;
  unlockXp: number; minKt: number; maxKt: number; agility: number; size: number; highWing?: boolean;
}
export interface EncyclopediaEntry {
  id: string; name: string; category: string; summary: string; components: string[];
  specs: [string, string][]; systems: string[]; lessons: string[]; art: string; note: string;
}

export type EnvId = 'sky' | 'countryside' | 'mountains' | 'coast' | 'desert' | 'sunset' | 'airfield' | 'highalt' | 'overcast' | 'rain' | 'night' | 'golden' | 'arctic';
export type ObstacleType = 'storm' | 'balloon' | 'birds' | 'tower';

/**
 * Simplified sideways-wind model for track-keeping missions. The game is a side view, so the sideways position ("track
 * units", 0 is the centreline or planned track) is shown on a small track panel. Wind pushes the aircraft sideways and the
 * pilot holds a heading correction; the faster the aircraft flies, the smaller the correction needed. This is an
 * educational approximation, not a flight model.
 */
export interface LateralModel {
  /** Steady sideways wind in knots (positive pushes right). */
  wind: number;
  /** Gust amplitude in knots. */
  gust: number;
  /** Half-width of the corridor that counts as on track, in track units. */
  tol: number;
  /** Route legs: one waypoint per checkpoint, with the sideways position the aircraft must cross it at. */
  waypoints?: { lat: number; name: string }[];
  /** Landing: half-width of the runway, in track units. */
  runwayHalf?: number;
}


/** A flight mission is pure data; the engine in src/game interprets it. */
/** Weather for a mission. Every value is a simplified game effect, not a meteorological model. */
export interface WeatherDef {
  rain?: 'light' | 'moderate' | 'heavy';
  snow?: boolean;
  /** Reduced visibility, 0 (clear) to 0.8 (thick fog): the scene fades with distance and distant hazards are not marked. */
  fog?: number;
  /** Dark storm cloud base and dimmer light. */
  storm?: boolean;
  lightning?: boolean;
  /** Turbulence strength 0..1: random vertical bumps the pilot has to smooth out. */
  turbulence?: number;
  /** Arcade tornado beside the route (needs the sideways track model). at: fraction of the route; lat: track position; radius: danger area. */
  tornado?: { at: number; lat: number; radius: number };
}

export interface MissionDef {
  id: string;
  title: string;
  lessonId?: string;
  tier: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  style: 'Arcade' | 'Educational simulation';
  aircraftId: string;
  env: EnvId;
  seed: number;
  length: number;
  objective: string;
  briefing: string;
  outcome: string;
  parTime: number;
  checkpoints: number;
  obstacles: { density: number; types: ObstacleType[] };
  terrain?: number;
  altScale?: number;
  wind?: { vy: number; gust: number };
  /** Sideways-wind and route model (crosswind, wind correction, navigation missions). */
  lateral?: LateralModel;
  /** Missions opened by passing Aviation English exercises (ids from the English page). */
  requiresEnglish?: string[];
  /** Missions that have no lesson of their own open when all of these lessons are passed. */
  requires?: string[];
  /** One line saying which aviation concept the mission practises. */
  concept?: string;
  /** Go-around: the runway becomes occupied this many world pixels before the threshold. */
  goAround?: { at: number };
  /** Storm cells drift up and down, so the safe gap moves. */
  stormDrift?: boolean;
  /** Weather layered on the scene. Rain, snow, cloud and lightning are visual; fog hides hazards until they are close; turbulence and the tornado change the flight. */
  weather?: WeatherDef;
  speedBand?: { min: number; max: number };
  energy?: boolean;
  fuel?: boolean;
  takeoff?: boolean;
  landing?: boolean;
  showPressure?: boolean;
  messages?: { at: number; text: string }[];
  xp: number;
}

export interface MissionStats {
  success: boolean;
  reason?: string;
  time: number;
  checkpoints: number;
  total: number;
  hits: number;
  bandFraction?: number;
  landing?: 'smooth' | 'firm' | 'hard';
  decisionsCorrect: number;
  decisionsTotal: number;
  fuelLeft?: number;
  assisted: boolean;
  /** Mean distance from the planned track, in track units (lateral missions). */
  trackError?: number;
  /** Largest distance from the planned track, in track units. */
  maxOffset?: number;
  /** Distance from the centreline at touchdown, in track units. */
  touchdownOffset?: number;
  /** How the go-around went. */
  goAround?: 'done' | 'late' | 'landed' | 'missed';
  /** Flight phases flown, in order (take-off, climb, cruise, approach, landing). */
  phases?: string[];
  /** Approach phase: share of the time on the glide path at a safe approach speed (0..1), and go-arounds the pilot chose. */
  approach?: { stability: number; goArounds: number };
  /** Where the wheels touched: the first third of the runway is the touchdown zone. */
  touchdownZone?: 'in' | 'long';
  /** Weather results: closest distance to the tornado (track units) and storm-cell contacts. */
  weather?: { tornadoMin?: number; stormHits: number };
  /** Boosters collected and used during the flight, and the contacts a shield absorbed. */
  boosters?: { collected: number; used: Partial<Record<'shield' | 'slow' | 'multiplier' | 'magnet' | 'speed' | 'assist' | 'xp' | 'recovery', number>>; xpTokens: number; absorbed: number };
  /** Bonus points collected from rings (shown and rewarded, never part of the star formula). */
  bonus?: number;
  /** Rings hit and available, by kind. */
  ringTypes?: Partial<Record<'cloud' | 'gold' | 'precision' | 'nav' | 'english' | 'special', { hit: number; total: number }>>;
  /** How each gate ended: hit, missed, or still open when the flight ended. */
  gateStates?: ('hit' | 'missed' | 'open')[];
  /** Flight path samples every quarter second: [time s, distance, height, sideways track, speed kt]. Not saved, used by the debrief. */
  trace?: number[][];
}
export interface MissionResult extends MissionStats { score: number; stars: number }

export interface CardState { ef: number; interval: number; reps: number; due: number; lapses: number }

export interface ExamRecord {
  id: string; date: number; pool: string; mode: 'practice' | 'exam'; total: number; correct: number;
  seconds: number; byTopic: Record<string, { correct: number; total: number }>;
}

export interface Settings {
  sfx: boolean; engine: boolean; voice: boolean; volume: number; reducedMotion: boolean;
  textScale: number; /** Steering sensitivity for climb and descent input, 0.6 to 1.6 (1 is the original feel). */ steering: number; /** Shows a small frame-rate readout during flights, for checking performance on a real device. */ showFps: boolean; /** Picture quality: auto lowers effects if the frame rate drops. */ quality: 'auto' | 'high' | 'low'; /** Touch flight controls: a fixed or floating analog joystick, or the classic hold buttons. */ controls: 'fixed' | 'floating' | 'buttons'; /** Puts the joystick on the right and the throttle on the left. */ leftHanded: boolean; /** Joystick dead zone, 0.05 to 0.3 of its travel. */ deadZone: number; /** Softer lightning: no full-screen flashes in storm weather. */ reduceFlashing: boolean; assisted: boolean; jurisdiction: 'ICAO' | 'EASA' | 'FAA'; dailyMinutes: number; speechRate: number;
}

export interface Progress {
  id: string;
  name: string;
  guest: boolean;
  created: number;
  xp: number;
  lessons: Record<string, { passed: boolean; best: number; attempts: number; at?: number }>;
  /** XP already earned today from repeatable activities, so repeating a quiz or a card review cannot farm unlimited XP. */
  xpToday?: { date: string; exam: number; card: number };
  missions: Record<string, { stars: number; best: number; at: number; /** Best bonus XP already paid for this mission (radio calls and XP tokens), so replays never pay it twice. */ bonusXp?: number }>;
  /** Aviation English: radio-call accuracy by topic, from flights. */
  engTopics?: Record<string, { asked: number; correct: number }>;
  cards: Record<string, CardState>;
  cardReviews: number;
  favTerms: string[];
  favFormulas: string[];
  savedQuestions: string[];
  savedLessons: string[];
  mistakes: { qid: string; at: number }[];
  topics: Record<string, { correct: number; total: number }>;
  exams: ExamRecord[];
  english: Record<string, { best: number; done: boolean; at: number }>;
  achievements: Record<string, number>;
  activity: Record<string, number>;
  daily: { date: string; counts: Record<string, number>; claimed: boolean };
  selectedAircraft: string;
  livery: string;
  labsUsed: string[];
  recent: string[];
  seenTutorial: boolean;
  settings: Settings;
}
