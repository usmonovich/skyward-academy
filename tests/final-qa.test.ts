import { beforeEach, describe, expect, it } from 'vitest';
import { MISSIONS } from '../src/content';
import { WEATHER_CHALLENGES } from '../src/content/weatherMissions';
import { DEFAULT_SETTINGS, __resetStore, actions, getProgress } from '../src/store/progress';
import { headless } from './helpers/autopilot';

describe('existing progress survives the premium update (batch 6)', () => {
  beforeEach(() => __resetStore());

  it('an exported progress file from before the update imports with its lessons, missions and XP, and gains the new settings', () => {
    // A profile saved before the joystick, phases and weather existed: no controls, leftHanded, deadZone or reduceFlashing.
    const old = {
      name: 'Pilot', xp: 4321, lessons: { 'math-arithmetic': { passed: true, best: 0.9, attempts: 1 } },
      missions: { 'm-math-units': { best: 900, stars: 3, plays: 2 } },
      settings: { sfx: false, engine: true, voice: true, volume: 0.4, reducedMotion: true, textScale: 1.1, steering: 1.2, quality: 'low', showFps: false, assisted: false, jurisdiction: 'EASA', dailyMinutes: 30, speechRate: 1 },
    };
    expect(actions.importData(JSON.stringify(old))).toBeNull();
    const p = getProgress();
    expect(p.xp).toBe(4321);
    expect(p.lessons['math-arithmetic'].passed).toBe(true);
    expect(p.missions['m-math-units'].stars).toBe(3);
    // Their own choices are kept, and the new settings arrive with their defaults.
    expect(p.settings).toMatchObject({ sfx: false, volume: 0.4, reducedMotion: true, steering: 1.2, quality: 'low', jurisdiction: 'EASA' });
    expect(p.settings).toMatchObject({ controls: DEFAULT_SETTINGS.controls, leftHanded: false, deadZone: 0.12, reduceFlashing: false });
  });
});

describe('every new flight draws in every mode (batch 6)', () => {
  const sample = [
    ...WEATHER_CHALLENGES.map((w) => MISSIONS.find((m) => m.id === w.id)!),
    MISSIONS.find((m) => m.takeoff && m.landing && !m.goAround && !m.lateral)!,
    MISSIONS.find((m) => m.env === 'coast')!, MISSIONS.find((m) => m.env === 'mountains')!, MISSIONS.find((m) => m.env === 'arctic')!,
  ];
  it('rain, storm, tornado, fog, snow, phases and scenery draw at every quality, with and without reduced motion and flashes', () => {
    for (const m of sample) for (const quality of ['high', 'low'] as const) for (const reducedMotion of [false, true]) {
      const { g } = headless(m, { noRender: false, quality, reducedMotion, reduceFlashing: reducedMotion });
      expect(() => { for (let i = 0; i < 90; i++) { g.step(1 / 60); } }, `${m.id} ${quality} ${reducedMotion}`).not.toThrow();
      g.destroy();
    }
  });
});
