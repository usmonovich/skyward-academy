import { describe, expect, it, vi } from 'vitest';
import { MISSIONS, findLesson } from '../src/content';
import { WEATHER_CHALLENGES } from '../src/content/weatherMissions';
import { drawLightning, drawPrecip, lightningAt, weatherEffects } from '../src/game/weather';
import { audio } from '../src/engine/audio';
import { DEFAULT_SETTINGS } from '../src/store/progress';
import { fly, headless } from './helpers/autopilot';

/** A canvas context that counts drawing calls by name. */
function recorder() {
  const calls: Record<string, number> = {};
  const grad = { addColorStop() { /* gradient stop */ } };
  const ctx = new Proxy({} as Record<string, unknown>, {
    get: (_t, k: string) => (k === 'createLinearGradient' || k === 'createRadialGradient' ? () => grad : (..._a: unknown[]) => { calls[k] = (calls[k] ?? 0) + 1; }),
    set: () => true,
  }) as unknown as CanvasRenderingContext2D;
  return { ctx, calls };
}
const byId = (id: string) => MISSIONS.find((m) => m.id === id)!;

describe('weather missions: content', () => {
  it('six weather challenges, each opened by a real lesson, each stating its concept and that it is a simplification', () => {
    expect(WEATHER_CHALLENGES).toHaveLength(6);
    for (const m of WEATHER_CHALLENGES) {
      expect(m.requires!.length, m.id).toBeGreaterThan(0);
      for (const l of m.requires!) expect(findLesson(l), `${m.id} requires ${l}`).toBeTruthy();
      expect(m.concept!.length, m.id).toBeGreaterThan(40);
      expect(m.briefing, m.id).toMatch(/approximation|simplified/i);
      expect(m.weather, m.id).toBeDefined();
      for (const d of m.decisions ?? []) {
        expect(d.options.filter((o) => o.correct), m.id).toHaveLength(1);
        for (const o of d.options) expect(o.feedback.length, `${m.id}: ${o.text}`).toBeGreaterThan(30);
      }
    }
  });
  it('the right answers keep clear, divert or do not continue: none of them flies into severe weather', () => {
    for (const m of WEATHER_CHALLENGES) for (const d of m.decisions ?? []) {
      const right = d.options.find((o) => o.correct)!.text;
      expect(right, m.id).toMatch(/clear|around|divert|do not continue|leave|slow|margin/i);
      expect(right, m.id).not.toMatch(/through|underneath|closer/i);
    }
  });
  it('the tornado sits off the route and the diversion route bends away from it', () => {
    const m = WEATHER_CHALLENGES.find((x) => x.weather?.tornado)!;
    const T = m.weather!.tornado!;
    expect(m.lateral?.waypoints).toHaveLength(m.checkpoints);
    for (const w of m.lateral!.waypoints!) expect(Math.abs(w.lat - T.lat), w.name).toBeGreaterThan(T.radius);
    expect(Math.max(...m.lateral!.waypoints!.map((w) => Math.abs(w.lat - T.lat)))).toBeGreaterThan(T.radius * 3);
  });
  it('the briefing separates weather that changes the flight from weather that is only visual', () => {
    expect(weatherEffects({ rain: 'heavy', lightning: true })).toEqual({ handling: [], visual: ['heavy rain', 'lightning'] });
    expect(weatherEffects({ turbulence: 0.5, fog: 0.6 }).handling).toEqual(['turbulence', 'low visibility: hazards show late']);
    expect(weatherEffects({ tornado: { at: 0.5, lat: 40, radius: 30 } }).handling).toContain('tornado avoidance');
  });
});

describe('weather rendering stays light', () => {
  const streaks = (rain: 'light' | 'moderate' | 'heavy', lite = false) => { const r = recorder(); drawPrecip(r.ctx, { rain }, 960, 470, 3.2, false, lite); return r.calls.moveTo ?? 0; };
  it('rain has three intensities with a bounded number of streaks, halved in low quality', () => {
    expect(streaks('light')).toBeLessThan(streaks('moderate'));
    expect(streaks('moderate')).toBeLessThan(streaks('heavy'));
    expect(streaks('heavy')).toBeLessThanOrEqual(200);
    expect(streaks('heavy', true)).toBeLessThan(streaks('heavy') * 0.5);
  });
  it('lightning is brief and occasional: about one strike every 7.5 s, each under a third of a second', () => {
    let lit = 0; let strikes = 0; let was = false;
    for (let t = 0; t < 75; t += 1 / 60) { const f = lightningAt(t, 7).flash > 0; if (f) lit++; if (f && !was) strikes++; was = f; }
    expect(strikes).toBeGreaterThanOrEqual(9); expect(strikes).toBeLessThanOrEqual(22);
    expect(lit / 60 / 75).toBeLessThan(0.08);
    expect(lightningAt(12.3, 5)).toEqual(lightningAt(12.3, 5));
  });
  it('reduced flashing draws the bolt without brightening the whole screen', () => {
    const a = recorder(); drawLightning(a.ctx, 1, 3, 960, 470, false);
    const b = recorder(); drawLightning(b.ctx, 1, 3, 960, 470, true);
    expect(a.calls.fillRect).toBe(1);
    expect(b.calls.fillRect ?? 0).toBe(0);
    expect(b.calls.stroke).toBe(1);
    expect(DEFAULT_SETTINGS.reduceFlashing).toBe(false);
  });
});

describe('weather in flight (scripted autopilot, not human playtesting)', () => {
  it('every weather mission can be won, and the tornado flight passes well clear of the danger area', () => {
    for (const w of WEATHER_CHALLENGES) {
      const r = fly(byId(w.id)).result!;
      expect(r.success, `${w.id}: ${r.reason ?? ''}`).toBe(true);
      expect(r.weather, w.id).toBeDefined();
      if (w.weather?.tornado) expect(r.weather!.tornadoMin!, w.id).toBeGreaterThan(w.weather.tornado.radius);
    }
  });

  it('flying into the tornado is never rewarded: it ends the flight with an explanation', () => {
    const m = byId('w-tornado-warning');
    const { g, result } = headless(m);
    for (let i = 0; i < 900 * 60 && !result(); i++) {
      const s = g.snapshot();
      g.setInput({ y: (250 - s.y) / 40, h: s.lat < 45 ? 1 : -1 });
      g.step(1 / 60);
    }
    g.destroy();
    expect(result()!.success).toBe(false);
    expect(result()!.reason).toMatch(/tornado danger area/);
  });

  it('a tornado warning is given before the funnel is reached', () => {
    const m = byId('w-tornado-warning');
    const { g, messages } = headless(m);
    let warnedAt = -1;
    for (let i = 0; i < 600 * 60 && warnedAt < 0; i++) {
      const s = g.snapshot();
      if (s.state === 'ended') break;
      g.setInput({ y: (250 - s.y) / 40, h: Math.max(-1, Math.min(1, (-40 - s.lat) / 20 - s.hdg)) });
      g.step(1 / 60);
      if (messages.some((x) => /TORNADO WARNING/.test(x))) warnedAt = s.worldX;
    }
    g.destroy();
    expect(warnedAt).toBeGreaterThan(0);
    expect(warnedAt).toBeLessThan(m.weather!.tornado!.at * m.length - 1500);
  });

  it('turbulence moves the aircraft with no input; the same mission in calm air does not', () => {
    const drift = (turb: boolean) => {
      const def = { ...byId('w-turbulence'), obstacles: { density: 0, types: ['balloon' as const] }, decisions: [], weather: turb ? { turbulence: 0.8 } : undefined };
      const { g } = headless(def);
      let lo = Infinity; let hi = -Infinity;
      for (let i = 0; i < 60 * 8; i++) { g.step(1 / 60); const y = g.snapshot().y; lo = Math.min(lo, y); hi = Math.max(hi, y); }
      g.destroy(); return hi - lo;
    };
    expect(drift(true)).toBeGreaterThan(20);
    expect(drift(false)).toBeLessThan(2);
  });

  it('thunder follows lightning in storm flights', () => {
    const spy = vi.spyOn(audio, 'sfx');
    const { g } = headless(byId('w-thunderstorm-avoidance'));
    for (let i = 0; i < 60 * 20; i++) { g.step(1 / 60); }
    g.destroy();
    expect(spy.mock.calls.filter((c) => c[0] === 'thunder').length).toBeGreaterThan(0);
    spy.mockRestore();
  });
});
