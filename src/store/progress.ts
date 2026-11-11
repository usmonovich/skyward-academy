// User progress store. Persists to localStorage on this device; supports a guest profile,
// named local profiles, guest-to-profile migration, export/import and full deletion.
import { useSyncExternalStore } from 'react';
import type { ExamRecord, MissionDef, MissionResult, Progress, Question, Settings } from '../types';
import { GAME_AIRCRAFT } from '../content/reference';
import { dailyFor, dayKey, newAchievements, rankFor, XP } from '../engine/gamification';
import { newCard, review } from '../engine/srs';

const KEY = 'skyward.v1';
interface Root { active: string; profiles: Record<string, Progress> }

export const DEFAULT_SETTINGS: Settings = {
  sfx: true, engine: true, voice: true, volume: 0.6, reducedMotion: false, textScale: 1,
  assisted: false, jurisdiction: 'ICAO', dailyMinutes: 20, speechRate: 1,
};

export function freshProgress(id: string, name: string, guest: boolean): Progress {
  return {
    id, name, guest, created: Date.now(), xp: 0, lessons: {}, missions: {}, cards: {}, cardReviews: 0,
    favTerms: [], favFormulas: [], savedQuestions: [], savedLessons: [], mistakes: [], topics: {}, exams: [], english: {},
    achievements: {}, activity: {}, daily: { date: dayKey(), counts: {}, claimed: false },
    selectedAircraft: 'sparrow', livery: 'orange', labsUsed: [], recent: [], seenTutorial: false,
    settings: { ...DEFAULT_SETTINGS },
  };
}

const storage = (): Storage | null => (typeof localStorage === 'undefined' ? null : localStorage);

function load(): Root {
  try {
    const raw = storage()?.getItem(KEY);
    if (raw) {
      const r = JSON.parse(raw) as Root;
      for (const id of Object.keys(r.profiles)) {
        const base = freshProgress(id, r.profiles[id].name, r.profiles[id].guest);
        r.profiles[id] = { ...base, ...r.profiles[id], settings: { ...DEFAULT_SETTINGS, ...r.profiles[id].settings } };
      }
      if (r.profiles[r.active]) return r;
    }
  } catch { /* unreadable save: start clean rather than crash */ }
  return { active: 'guest', profiles: { guest: freshProgress('guest', 'Cadet', true) } };
}

let root = load();
const listeners = new Set<() => void>();
const save = () => { try { storage()?.setItem(KEY, JSON.stringify(root)); } catch { /* storage unavailable */ } listeners.forEach((l) => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };

export const getProgress = (): Progress => root.profiles[root.active];
/** Lets non-React code (cloud sync) react to every saved change. */
export const subscribeProgress = subscribe;
export const useProgress = (): Progress => useSyncExternalStore(subscribe, getProgress);
export const useProfiles = () => useSyncExternalStore(subscribe, () => root);

/* ---------------------------------------------------------------- toasts */
export interface Toast { id: number; kind: 'xp' | 'badge' | 'unlock' | 'info'; title: string; text?: string }
let toasts: Toast[] = [];
let toastId = 1;
const toastListeners = new Set<() => void>();
export function toast(kind: Toast['kind'], title: string, text?: string) {
  const t = { id: toastId++, kind, title, text };
  toasts = [...toasts, t];
  toastListeners.forEach((l) => l());
  setTimeout(() => { toasts = toasts.filter((x) => x.id !== t.id); toastListeners.forEach((l) => l()); }, 4200);
}
export const useToasts = () => useSyncExternalStore((l) => { toastListeners.add(l); return () => toastListeners.delete(l); }, () => toasts);

/* --------------------------------------------------------------- mutation */
function commit(fn: (p: Progress) => void) {
  const before = getProgress();
  const p: Progress = JSON.parse(JSON.stringify(before));
  const today = dayKey();
  if (p.daily.date !== today) p.daily = { date: today, counts: {}, claimed: false };
  fn(p);
  // Daily challenge is claimed automatically; missing a day costs nothing.
  const daily = dailyFor(today);
  if (!p.daily.claimed && (p.daily.counts[daily.key] ?? 0) >= daily.target) {
    p.daily.claimed = true; p.xp += XP.daily;
    toast('xp', `Daily challenge complete  +${XP.daily} XP`, daily.text);
  }
  if (p.xp !== before.xp || !p.activity[today]) p.activity[today] = (p.activity[today] ?? 0) + Math.max(1, p.xp - before.xp);
  for (const a of newAchievements(p)) { p.achievements[a.id] = Date.now(); toast('badge', `Achievement: ${a.name}`, a.desc); }
  for (const ac of GAME_AIRCRAFT) if (before.xp < ac.unlockXp && p.xp >= ac.unlockXp) toast('unlock', `Aircraft unlocked: ${ac.name}`, ac.cls);
  const r0 = rankFor(before.xp); const r1 = rankFor(p.xp);
  if (r1.index > r0.index) toast('unlock', `New rank: ${r1.name}`, 'In-game educational rank');
  root = { ...root, profiles: { ...root.profiles, [root.active]: p } };
  save();
}
const bump = (p: Progress, key: string, n = 1) => { p.daily.counts[key] = (p.daily.counts[key] ?? 0) + n; };

export const actions = {
  /** Records one answered question for analytics, the mistake queue and daily challenges. */
  answer(q: Question, correct: boolean) {
    commit((p) => {
      const k = q.topic ?? 'General';
      p.topics[k] ??= { correct: 0, total: 0 };
      p.topics[k].total++;
      if (correct) {
        p.topics[k].correct++;
        bump(p, 'correct');
        if (q.lessonId?.startsWith('math-') || q.lessonId?.startsWith('phys-')) bump(p, 'science');
        p.mistakes = p.mistakes.filter((m) => m.qid !== q.id);
      } else if (!p.mistakes.some((m) => m.qid === q.id)) p.mistakes = [{ qid: q.id, at: Date.now() }, ...p.mistakes].slice(0, 200);
    });
  },
  assessment(lessonId: string, score: number, passed: boolean): number {
    let gained = 0;
    commit((p) => {
      const prev = p.lessons[lessonId] ?? { passed: false, best: 0, attempts: 0 };
      if (passed && !prev.passed) gained += XP.lessonPass;
      if (passed && score >= 1 && prev.best < 1) gained += XP.perfectBonus;
      p.lessons[lessonId] = { passed: prev.passed || passed, best: Math.max(prev.best, score), attempts: prev.attempts + 1, at: passed ? Date.now() : prev.at };
      p.xp += gained;
    });
    return gained;
  },
  mission(def: MissionDef, r: MissionResult): number {
    let gained = 0;
    commit((p) => {
      if (!r.success) return;
      const prev = p.missions[def.id];
      const value = (stars: number) => def.xp + stars * 25;
      gained = prev ? Math.max(0, value(r.stars) - value(prev.stars)) : value(r.stars);
      p.missions[def.id] = { stars: Math.max(prev?.stars ?? 0, r.stars), best: Math.max(prev?.best ?? 0, r.score), at: Date.now() };
      p.xp += gained;
      bump(p, 'missions');
    });
    return gained;
  },
  addCard(termId: string) { commit((p) => { if (!p.cards[termId]) p.cards[termId] = newCard(); }); },
  removeCard(termId: string) { commit((p) => { delete p.cards[termId]; }); },
  reviewCard(termId: string, q: number) {
    commit((p) => { p.cards[termId] = review(p.cards[termId] ?? newCard(), q); p.cardReviews++; p.xp += XP.card; bump(p, 'cards'); });
  },
  toggle(list: 'favTerms' | 'favFormulas' | 'savedQuestions' | 'savedLessons', id: string) {
    commit((p) => { p[list] = p[list].includes(id) ? p[list].filter((x) => x !== id) : [...p[list], id]; });
  },
  exam(rec: ExamRecord) { commit((p) => { p.exams = [rec, ...p.exams].slice(0, 50); p.xp += rec.correct * XP.examPer; }); },
  english(id: string, score: number, xp: number) {
    commit((p) => {
      const prev = p.english[id];
      if (!prev?.done && score >= 0.6) p.xp += xp;
      p.english[id] = { best: Math.max(prev?.best ?? 0, score), done: prev?.done || score >= 0.6, at: Date.now() };
    });
  },
  atcTransmission() { commit((p) => bump(p, 'atc')); },
  labUsed(id: string) { if (!getProgress().labsUsed.includes(id)) commit((p) => { p.labsUsed.push(id); }); },
  visit(lessonId: string) { commit((p) => { p.recent = [lessonId, ...p.recent.filter((x) => x !== lessonId)].slice(0, 8); }); },
  settings(s: Partial<Settings>) { commit((p) => { p.settings = { ...p.settings, ...s }; }); },
  selectAircraft(id: string) { commit((p) => { p.selectedAircraft = id; }); },
  livery(id: string) { commit((p) => { p.livery = id; }); },
  seenTutorial() { commit((p) => { p.seenTutorial = true; }); },
  rename(name: string) { commit((p) => { p.name = name.trim().slice(0, 30) || p.name; }); },

  /** Creates a named profile. If the guest has progress it is moved into the new profile. */
  createProfile(name: string) {
    const id = `u${Date.now().toString(36)}`;
    const guest = root.profiles.guest;
    const migrate = root.active === 'guest' && guest && (guest.xp > 0 || Object.keys(guest.lessons).length > 0);
    const profile: Progress = migrate ? { ...guest, id, name: name.trim().slice(0, 30) || 'Cadet', guest: false } : freshProgress(id, name.trim().slice(0, 30) || 'Cadet', false);
    root = { active: id, profiles: { ...root.profiles, [id]: profile, guest: migrate ? freshProgress('guest', 'Cadet', true) : (guest ?? freshProgress('guest', 'Cadet', true)) } };
    save();
    return migrate;
  },
  switchProfile(id: string) { if (root.profiles[id]) { root = { ...root, active: id }; save(); } },
  /** Permanently deletes a profile and all of its data from this device. */
  deleteProfile(id: string) {
    const profiles = { ...root.profiles };
    delete profiles[id];
    if (!profiles.guest) profiles.guest = freshProgress('guest', 'Cadet', true);
    if (id === 'guest') profiles.guest = freshProgress('guest', 'Cadet', true);
    root = { active: profiles[root.active] && root.active !== id ? root.active : 'guest', profiles };
    save();
  },
  /** Replaces the active profile's progress with a merged copy from cloud sync. */
  replace(p: Progress) {
    const current = root.profiles[root.active];
    root = { ...root, profiles: { ...root.profiles, [root.active]: { ...freshProgress(current.id, p.name ?? current.name, current.guest), ...p, id: current.id, guest: current.guest, settings: { ...DEFAULT_SETTINGS, ...p.settings } } } };
    save();
  },
  exportData: () => JSON.stringify(getProgress(), null, 2),
  importData(json: string): string | null {
    try {
      const data = JSON.parse(json) as Progress;
      if (typeof data.xp !== 'number' || typeof data.lessons !== 'object') return 'This file is not a Skyward Academy progress export.';
      const id = root.active;
      const merged = { ...freshProgress(id, data.name ?? 'Cadet', root.profiles[id].guest), ...data, id, guest: root.profiles[id].guest, settings: { ...DEFAULT_SETTINGS, ...data.settings } };
      root = { ...root, profiles: { ...root.profiles, [id]: merged } };
      save();
      return null;
    } catch { return 'The file could not be read. Choose a JSON file exported from Skyward Academy.'; }
  },
};

/** Test helper: resets the in-memory store. */
export function __resetStore() { root = { active: 'guest', profiles: { guest: freshProgress('guest', 'Cadet', true) } }; }
