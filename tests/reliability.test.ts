import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getTracks, isLive } from '../src/content';
import { searchLessons } from '../src/engine/lessonSearch';

class FakeStorage {
  private m = new Map<string, string>();
  getItem(k: string) { return this.m.has(k) ? this.m.get(k)! : null; }
  setItem(k: string, v: string) { this.m.set(k, String(v)); }
  removeItem(k: string) { this.m.delete(k); }
  clear() { this.m.clear(); }
  key(i: number) { return [...this.m.keys()][i] ?? null; }
  get length() { return this.m.size; }
}

let ls: FakeStorage;
/** Loads a fresh copy of the progress store, as the browser does on page load. */
async function boot() {
  vi.resetModules();
  return import('../src/store/progress');
}

describe('progress backups and recovery', () => {
  beforeEach(() => { ls = new FakeStorage(); vi.stubGlobal('localStorage', ls); });

  it('creates an automatic backup on the first save and lists it', async () => {
    const s = await boot();
    s.actions.assessment('math-arithmetic', 1, true);
    const list = s.actions.listBackups();
    expect(list).toHaveLength(1);
    expect(list[0].reason).toBe('Automatic');
    expect(list[0].lessons).toBe(1);
    expect(list[0].xp).toBeGreaterThan(0);
    expect(JSON.stringify(list[0])).not.toContain('"data"');
  });

  it('keeps only the newest three backups', async () => {
    const s = await boot();
    s.actions.assessment('math-arithmetic', 1, true);
    for (const n of [1, 2, 3, 4]) { s.actions.rename(`Pilot ${n}`); s.actions.backupNow(`Manual ${n}`); }
    expect(s.actions.listBackups()).toHaveLength(3);
  });

  it('restores the latest backup automatically when the saved data is unreadable, and keeps a copy of the damaged data', async () => {
    const a = await boot();
    a.actions.assessment('math-arithmetic', 1, true);
    const xp = a.getProgress().xp;
    ls.setItem('skyward.v1', '{"active":"guest","profiles":{"guest":{"xp":');
    const b = await boot();
    expect(b.getProgress().xp).toBe(xp);
    expect(b.getProgress().lessons['math-arithmetic']?.passed).toBe(true);
    expect(b.takeLoadNotice()).toMatch(/automatic backup/);
    expect(b.takeLoadNotice()).toBeNull();
    expect(ls.getItem('skyward.corrupt.v1')).toContain('"xp":');
  });

  it('starts clean but tells the user when the save is unreadable and there is no backup', async () => {
    ls.setItem('skyward.v1', 'not json');
    const s = await boot();
    expect(s.getProgress().xp).toBe(0);
    expect(s.takeLoadNotice()).toMatch(/no backup/);
    expect(ls.getItem('skyward.corrupt.v1')).toBe('not json');
  });

  it('treats a structurally invalid save like an unreadable one', async () => {
    const a = await boot();
    a.actions.assessment('math-arithmetic', 1, true);
    ls.setItem('skyward.v1', JSON.stringify({ active: 'guest', profiles: { guest: { name: 'x' } } }));
    const b = await boot();
    expect(b.getProgress().lessons['math-arithmetic']?.passed).toBe(true);
  });

  it('restores a chosen backup and backs up the current state first', async () => {
    const s = await boot();
    s.actions.assessment('math-arithmetic', 1, true);
    s.actions.backupNow('Checkpoint');
    const checkpoint = s.actions.listBackups()[0];
    s.actions.assessment('math-vectors', 1, true);
    expect(Object.keys(s.getProgress().lessons)).toContain('math-vectors');
    expect(s.actions.restoreBackup(checkpoint.at)).toBeNull();
    expect(Object.keys(s.getProgress().lessons)).not.toContain('math-vectors');
    expect(s.actions.listBackups().some((b) => b.reason === 'Before restore')).toBe(true);
    expect(s.actions.restoreBackup(1)).toMatch(/no longer exists/);
  });

  it('backs up before an import replaces progress', async () => {
    const s = await boot();
    s.actions.assessment('math-arithmetic', 1, true);
    const before = s.getProgress().xp;
    expect(s.actions.importData(JSON.stringify({ xp: 5, lessons: {} }))).toBeNull();
    expect(s.getProgress().xp).toBe(5);
    expect(s.actions.listBackups().some((b) => b.xp === before)).toBe(true);
  });

  it('removes backups when the user deletes their data', async () => {
    const s = await boot();
    s.actions.assessment('math-arithmetic', 1, true);
    expect(s.actions.listBackups().length).toBeGreaterThan(0);
    s.actions.deleteProfile('guest');
    expect(ls.getItem('skyward.backups.v1') ?? '').not.toContain('math-arithmetic');
    expect(ls.getItem('skyward.corrupt.v1')).toBeNull();
    expect(s.actions.listBackups().every((b) => b.lessons === 0)).toBe(true);
  });

  it('remembers when progress was last exported', async () => {
    const s = await boot();
    expect(s.actions.lastExport()).toBe(0);
    s.actions.exportData();
    expect(s.actions.lastExport()).toBeGreaterThan(0);
  });
});

describe('lesson search', () => {
  const entries = getTracks().flatMap((track) => track.modules.flatMap((module) => module.lessons.filter(isLive).map((lesson) => ({ lesson, track, module }))));

  it('returns nothing for an empty query', () => { expect(searchLessons(entries, '   ')).toEqual([]); });
  it('finds a lesson by a word in its title, best match first', () => {
    const hits = searchLessons(entries, 'mach');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].lesson.title.toLowerCase()).toContain('mach');
  });
  it('requires every word to match and ignores case and accents', () => {
    expect(searchLessons(entries, 'MACH zzzzqqq')).toEqual([]);
    expect(searchLessons(entries, 'Mách').length).toBe(searchLessons(entries, 'mach').length);
  });
  it('limits the number of results and only returns published lessons', () => {
    const hits = searchLessons(entries, 'the', 5);
    expect(hits.length).toBeLessThanOrEqual(5);
    for (const h of hits) expect(isLive(h.lesson)).toBe(true);
  });
});

describe('recovery persistence', () => {
  it('writes the recovered save back so the next reload does not depend on the backup again', async () => {
    const ls2 = new FakeStorage();
    vi.stubGlobal('localStorage', ls2);
    const a = await boot();
    a.actions.assessment('math-arithmetic', 1, true);
    ls2.setItem('skyward.v1', '{broken');
    await boot();
    expect(() => JSON.parse(ls2.getItem('skyward.v1') ?? '')).not.toThrow();
  });
});
