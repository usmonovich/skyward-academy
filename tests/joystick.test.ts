import { describe, expect, it } from 'vitest';
import { DEFAULT_STICK, createStick, leverValue, stickVector, type StickOutput } from '../src/game/joystick';
import { DEFAULT_SETTINGS } from '../src/store/progress';
import { MISSIONS } from '../src/content';
import { headless } from './helpers/autopilot';

const cfg = { ...DEFAULT_STICK, radius: 50, deadZone: 0.1, curve: 1 };

describe('analog stick maths', () => {
  it('is zero inside the dead zone and rises smoothly from its edge, with no jump', () => {
    expect(stickVector(0, 4, cfg).y).toBe(0);
    expect(stickVector(0, 5, cfg).y).toBe(0);
    const justOut = stickVector(0, 5.5, cfg).y;
    expect(justOut).toBeGreaterThan(0); expect(justOut).toBeLessThan(0.02);
  });
  it('is analog: more deflection gives more output, up is negative (climb), full travel is 1', () => {
    const a = stickVector(0, -15, cfg).y; const b = stickVector(0, -30, cfg).y; const c = stickVector(0, -50, cfg).y;
    expect(a).toBeLessThan(0); expect(b).toBeLessThan(a); expect(c).toBeCloseTo(-1, 6);
  });
  it('limits the knob to its travel when the finger goes far outside, and never exceeds 1', () => {
    const o = stickVector(400, -300, cfg);
    expect(Math.hypot(o.kx, o.ky)).toBeCloseTo(50, 6);
    expect(Math.hypot(o.x, o.y)).toBeLessThanOrEqual(1 + 1e-9);
  });
  it('sensitivity scales partial deflection but output stays within -1..1; a response curve softens the centre', () => {
    expect(Math.abs(stickVector(0, 30, { ...cfg, sensitivity: 1.5 }).y)).toBeGreaterThan(Math.abs(stickVector(0, 30, cfg).y));
    expect(stickVector(0, 60, { ...cfg, sensitivity: 1.6 }).y).toBe(1);
    expect(Math.abs(stickVector(0, 20, { ...cfg, curve: 1.6 }).y)).toBeLessThan(Math.abs(stickVector(0, 20, cfg).y));
  });
});

describe('stick pointer rules', () => {
  const make = (mode: 'fixed' | 'floating') => {
    const log: StickOutput[] = [];
    const s = createStick({ mode, centre: { x: 100, y: 100 }, grab: 80, cfg, onChange: (o) => log.push(o) });
    return { s, log, last: () => log[log.length - 1] };
  };

  it('fixed mode only takes touches that start on the stick', () => {
    const { s } = make('fixed');
    expect(s.down(1, 400, 400)).toBe(false);
    expect(s.down(1, 120, 110)).toBe(true);
  });

  it('floating mode re-centres on the touch, so a touch never starts with a jump', () => {
    const { s, last } = make('floating');
    expect(s.down(1, 300, 260)).toBe(true);
    expect(last().y).toBe(0);
    s.move(1, 300, 230);
    expect(last().y).toBeLessThan(0);
    s.up(1);
    expect(s.centre()).toEqual({ x: 100, y: 100 });
  });

  it('multi-touch: a second finger cannot take or move the stick, and its lift does not release the first', () => {
    const { s, last } = make('floating');
    s.down(1, 100, 100); s.move(1, 100, 70);
    const held = last().y;
    expect(s.down(2, 150, 150)).toBe(false);
    s.move(2, 100, 200); s.up(2);
    expect(last().y).toBe(held);
    expect(s.pointer).toBe(1);
  });

  it('returns to neutral on lift, on browser cancellation and on reset (app switch, pause, rotation)', () => {
    for (const end of ['up', 'cancel', 'reset'] as const) {
      const { s, last } = make('floating');
      s.down(7, 100, 100); s.move(7, 100, 150);
      expect(last().y).toBeGreaterThan(0);
      if (end === 'reset') s.reset(); else s.up(7);
      expect(last()).toMatchObject({ x: 0, y: 0, active: false });
      expect(s.pointer).toBeNull();
      // And it can be grabbed again straight away.
      expect(s.down(8, 100, 100)).toBe(true);
    }
  });

  it('the throttle lever maps its track to 0..1 and clamps outside it', () => {
    expect(leverValue(100, 100, 150)).toBe(1);
    expect(leverValue(250, 100, 150)).toBe(0);
    expect(leverValue(175, 100, 150)).toBeCloseTo(0.5, 6);
    expect(leverValue(-50, 100, 150)).toBe(1);
    expect(leverValue(900, 100, 150)).toBe(0);
  });
});

describe('engine side of the touch controls', () => {
  const def = MISSIONS.find((m) => m.id === 'm-math-units')!;

  it('defaults to the floating joystick with a 12 percent dead zone, right-handed', () => {
    expect(DEFAULT_SETTINGS).toMatchObject({ controls: 'floating', leftHanded: false, deadZone: 0.12 });
  });

  it('the throttle lever moves the throttle smoothly to its position and keeps it there', () => {
    const { g } = headless(def);
    const t0 = g.snapshot().thr;
    g.setThrottle(1);
    g.step(1 / 60);
    expect(g.snapshot().thr - t0).toBeLessThan(0.02);       // smooth, not a jump
    for (let i = 0; i < 90; i++) g.step(1 / 60);
    expect(g.snapshot().thr).toBeCloseTo(1, 6);
    g.setThrottle(0.3);
    for (let i = 0; i < 120; i++) g.step(1 / 60);
    expect(g.snapshot().thr).toBeCloseTo(0.3, 6);
    g.destroy();
  });

  it('keyboard or thrust buttons take over from the lever', () => {
    const { g } = headless(def);
    g.setThrottle(0.2);
    for (let i = 0; i < 60; i++) g.step(1 / 60);
    g.setInput({ x: 1 });
    for (let i = 0; i < 30; i++) g.step(1 / 60);
    g.setInput({ x: 0 });
    const t = g.snapshot().thr;
    for (let i = 0; i < 60; i++) g.step(1 / 60);
    expect(g.snapshot().thr).toBeCloseTo(t, 6);              // the lever target was dropped, so it does not pull back to 0.2
    g.destroy();
  });

  it('analog stick input climbs in proportion to deflection', () => {
    const climb = (y: number) => {
      const { g } = headless({ ...def, obstacles: { density: 0, types: ['balloon'] } });
      for (let i = 0; i < 20; i++) g.step(1 / 60);
      const y0 = g.snapshot().y; g.setInput({ y });
      for (let i = 0; i < 30; i++) g.step(1 / 60);
      const d = y0 - g.snapshot().y; g.destroy(); return d;
    };
    const small = climb(-0.3); const full = climb(-1);
    expect(small).toBeGreaterThan(0); expect(full).toBeGreaterThan(small * 2);
  });
});
