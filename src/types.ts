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

export type EnvId = 'sky' | 'countryside' | 'mountains' | 'coast' | 'desert' | 'sunset' | 'airfield' | 'highalt';
export type ObstacleType = 'storm' | 'balloon' | 'birds' | 'tower';
export interface Decision { at: number; prompt: string; options: { text: string; correct?: boolean; feedback: string }[] }

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
  /** Missions that have no lesson of their own open when all of these lessons are passed. */
  requires?: string[];
  /** One line saying which aviation concept the mission practises. */
  concept?: string;
  /** Go-around: the runway becomes occupied this many world pixels before the threshold. */
  goAround?: { at: number };
  /** Storm cells drift up and down, so the safe gap moves. */
  stormDrift?: boolean;
  speedBand?: { min: number; max: number };
  energy?: boolean;
  fuel?: boolean;
  takeoff?: boolean;
  landing?: boolean;
  showPressure?: boolean;
  messages?: { at: number; text: string }[];
  decisions?: Decision[];
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
  /** How each gate ended: hit, missed, or still open when the flight ended. */
  gateStates?: ('hit' | 'missed' | 'open')[];
  /** Whether each operational decision was answered correctly, in the order asked. */
  decisionResults?: boolean[];
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
  textScale: number; assisted: boolean; jurisdiction: 'ICAO' | 'EASA' | 'FAA'; dailyMinutes: number; speechRate: number;
}

export interface Progress {
  id: string;
  name: string;
  guest: boolean;
  created: number;
  xp: number;
  lessons: Record<string, { passed: boolean; best: number; attempts: number; at?: number }>;
  missions: Record<string, { stars: number; best: number; at: number }>;
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
