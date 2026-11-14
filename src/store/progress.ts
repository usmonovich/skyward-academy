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

/* ------------------------------------------------ automatic backups and recovery */
const BACKUP_KEY = 'skyward.backups.v1';
const CORRUPT_KEY = 'skyward.corrupt.v1';
const EXPORT_KEY = 'skyward.lastExport';
const MAX_BACKUPS = 3;
const BACKUP_EVERY_MS = 30 * 60 * 1000;
export interface BackupInfo { at: number; reason: string; name: string; xp: number; lessons: number }
interface BackupRec extends BackupInfo { data: string }

function normalise(r: Root): Root | null {
  if (!r || typeof r.active !== 'string' || !r.profiles || typeof r.profiles !== 'object') return null;
  for (const id of Object.keys(r.profiles)) {
    const pr = r.profiles[id];
    if (!pr || typeof pr.xp !== 'number' || typeof pr.lessons !== 'object') return null;
    const base = freshProgress(id, pr.name, pr.guest);
    r.profiles[id] = { ...base, ...pr, settings: { ...DEFAULT_SETTINGS, ...pr.settings } };
  }
  return r.profiles[r.active] ? r : null;
}

function readBackups(): BackupRec[] {
  try {
    const a = JSON.parse(storage()?.getItem(BACKUP_KEY) ?? '[]') as BackupRec[];
    return Array.isArray(a) ? a.filter((b) => b && typeof b.at === 'number' && typeof b.data === 'string') : [];
  } catch { return []; }
}

/** Keeps the newest few snapshots of the whole save. Failures (storage full or blocked) never affect the app. */
function writeBackup(reason: string, r: Root = root) {
  try {
    const data = JSON.stringify(r);
    const list = readBackups();
    if (list[0]?.data === data) return;
    const pr = r.profiles[r.active];
    const rec: BackupRec = { at: Date.now(), reason, name: pr.name, xp: pr.xp, lessons: Object.values(pr.lessons).filter((l) => l.passed).length, data };
    storage()?.setItem(BACKUP_KEY, JSON.stringify([rec, ...list].slice(0, MAX_BACKUPS)));
  } catch { /* backup is best effort */ }
}

let loadNotice: string | null = null;
/** Message about a recovery performed at start-up, shown once by the app. */
export const takeLoadNotice = (): string | null => { const n = loadNotice; loadNotice = null; return n; };

function load(): Root {
  const raw = storage()?.getItem(KEY);
  if (raw) {
    try {
      const ok = normalise(JSON.parse(raw) as Root);
      if (ok) return ok;
    } catch { /* fall through to recovery */ }
    // Unreadable save: keep a copy of it, then restore the newest readable backup instead of starting clean.
    try { storage()?.setItem(CORRUPT_KEY, raw); } catch { /* ignore */ }
    for (const b of readBackups()) {
      try {
        const ok = normalise(JSON.parse(b.data) as Root);
        if (ok) { try { storage()?.setItem(KEY, JSON.stringify(ok)); } catch { /* ignore */ } loadNotice = `Your saved progress could not be read, so the automatic backup from ${new Date(b.at).toLocaleString('en-GB')} was restored (${b.xp} XP, ${b.lessons} lessons passed).`; return ok; }
      } catch { /* try the next one */ }
    }
    loadNotice = 'Your saved progress could not be read and no backup was found. A copy of the unreadable data was kept in this browser.';
  }
  return { active: 'guest', profiles: { guest: freshProgress('guest', 'Cadet', true) } };
}

let root = load();
const listeners = new Set<() => void>();
const save = () => {
  try { storage()?.setItem(KEY, JSON.stringify(root)); } catch { /* storage unavailable */ }
  const last = readBackups()[0];
  if (!last || Date.now() - last.at > BACKUP_EVERY_MS) writeBackup('Automatic');
  listeners.forEach((l) => l());
};
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
    // Deleting data also removes the automatic backups, otherwise the deleted data would stay on the device.
    try { storage()?.removeItem(BACKUP_KEY); storage()?.removeItem(CORRUPT_KEY); } catch { /* ignore */ }
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
  exportData: () => { try { storage()?.setItem(EXPORT_KEY, String(Date.now())); } catch { /* ignore */ } return JSON.stringify(getProgress(), null, 2); },
  /** Saves a snapshot now (used before risky actions). */
  backupNow(reason = 'Manual') { writeBackup(reason); listeners.forEach((l) => l()); },
  /** Lists the automatic backups, newest first. */
  listBackups(): BackupInfo[] { return readBackups().map(({ data: _data, ...info }) => info); },
  /** Restores a backup by its timestamp. The current state is backed up first so a restore can itself be undone. */
  restoreBackup(at: number): string | null {
    const rec = readBackups().find((b) => b.at === at);
    if (!rec) return 'That backup no longer exists.';
    try {
      const ok = normalise(JSON.parse(rec.data) as Root);
      if (!ok) return 'That backup could not be read.';
      writeBackup('Before restore');
      root = ok;
      save();
      return null;
    } catch { return 'That backup could not be read.'; }
  },
  /** When the user last exported a progress file (milliseconds), or 0. */
  lastExport(): number { try { return Number(storage()?.getItem(EXPORT_KEY)) || 0; } catch { return 0; } },
  importData(json: string): string | null {
    try {
      writeBackup('Before import');
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
