import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CEIL, GROUND, H, PLANE_X, PORTRAIT_CTL, PORTRAIT_HUD, PORTRAIT_PLANE_X, PORTRAIT_VW, W, Y0, Y1, computeView } from '../src/game/engine';
import { Btn } from '../src/components/ui';

const SIZES: [string, number, number][] = [
  ['iPhone SE portrait', 375, 667], ['iPhone 375x812', 375, 812], ['iPhone 390x844', 390, 844], ['iPhone Pro Max 430x932', 430, 932],
  ['landscape 844x390', 844, 390], ['landscape 932x430', 932, 430], ['landscape 667x375', 667, 375], ['Android 360x800', 360, 800], ['Android landscape 800x360', 800, 360],
  ['tablet portrait', 768, 1024], ['tablet landscape', 1024, 768], ['desktop 1280x720', 1280, 720], ['desktop card 959x540', 959, 540], ['ultrawide 2560x1080', 2560, 1080],
];

describe('mobile full-screen camera', () => {
  it('leaves the desktop card exactly as it was: a 16:9 canvas shows the 960x540 world one to one', () => {
    const v = computeView(960, 540);
    expect(v.s).toBeCloseTo(1, 6); expect(v.VW).toBeCloseTo(W, 6); expect(v.VH).toBeCloseTo(H, 6); expect(v.oy).toBe(0);
    const big = computeView(1920, 1080);
    expect(big.VW).toBeCloseTo(W, 6); expect(big.VH).toBeCloseTo(H, 6);
  });

  it.each(SIZES)('%s: uniform scale, nothing stretched, nothing important cut off', (_, cw, ch) => {
    const v = computeView(cw, ch);
    // One scale for both axes: the aircraft, gates and obstacles keep their proportions.
    expect(v.VW * v.s).toBeCloseTo(cw, 6);
    expect(v.VH * v.s).toBeCloseTo(ch, 6);
    // The whole flyable height (ceiling to ground) is always on screen.
    const topPx = (CEIL + v.oy) * v.s; const botPx = (GROUND + v.oy) * v.s;
    expect(topPx).toBeGreaterThan(0); expect(botPx).toBeLessThan(ch);
    // The aircraft is on screen with a useful stretch of the route ahead of it.
    const planeScreen = (PLANE_X - v.camShift) ;
    expect(planeScreen).toBeGreaterThan(40); expect(planeScreen).toBeLessThan(v.VW * 0.5);
    expect(v.VW - planeScreen).toBeGreaterThanOrEqual(290);
  });

  it('landscape fills the height with the 960x540 band and shows more of the route ahead than portrait', () => {
    for (const [cw, ch] of [[844, 390], [932, 430], [667, 375]] as const) {
      const v = computeView(cw, ch);
      expect(v.portrait).toBe(false); expect(v.camShift).toBe(0);
      expect(v.VH).toBeCloseTo(H, 6); expect(v.oy).toBe(0);
    }
    expect(computeView(844, 390).VW - PLANE_X).toBeGreaterThan(computeView(390, 844).VW - PORTRAIT_PLANE_X);
  });
});

describe('portrait gameplay layout', () => {
  const PHONES: [number, number][] = [[375, 812], [390, 844], [430, 932], [360, 800], [375, 667]];
  it.each(PHONES)('%dx%d: HUD on top, play window in the middle, thumb controls at the bottom, nothing overlapping', (cw, ch) => {
    const v = computeView(cw, ch);
    expect(v.portrait).toBe(true);
    const winTop = (Y0 + v.oy) * v.s; const winBot = (Y1 + v.oy) * v.s;
    expect(winTop).toBeGreaterThanOrEqual(PORTRAIT_HUD - 0.5);
    expect(winBot).toBeLessThanOrEqual(ch - PORTRAIT_CTL + 0.5);
    // Every flyable row sits inside the play window.
    expect((CEIL + v.oy) * v.s).toBeGreaterThanOrEqual(winTop); expect((GROUND + v.oy) * v.s).toBeLessThanOrEqual(winBot);
  });

  it.each([[375, 812], [390, 844], [430, 932]] as [number, number][])('%dx%d: flyable height is larger than the previous layout and over 45%% of the screen', (cw, ch) => {
    const v = computeView(cw, ch);
    const flyable = (GROUND - CEIL) * v.s;
    const previous = (GROUND - CEIL) * (cw / 640); // the earlier portrait camera: 640 world pixels across
    expect(flyable).toBeGreaterThan(previous * 1.35);
    expect(flyable / ch).toBeGreaterThan(0.45);
  });

  it('uses the full width: the camera is 400 world pixels across on a phone', () => {
    expect(computeView(375, 812).VW).toBeCloseTo(PORTRAIT_VW, 6);
  });

  it('on a short phone the scale shrinks to keep the whole flyable height on screen', () => {
    const v = computeView(375, 667);
    expect(v.s).toBeLessThan(375 / PORTRAIT_VW);
    expect((GROUND + v.oy) * v.s).toBeLessThanOrEqual(667 - PORTRAIT_CTL + 0.5);
  });

  it('a tall tablet gets a wider view, not stretched graphics', () => {
    const v = computeView(768, 1024);
    expect(v.VW).toBeGreaterThan(PORTRAIT_VW); expect(v.VW * v.s).toBeCloseTo(768, 6);
  });
});

describe('Btn links', () => {
  it('renders an empty href as a real link to the home route, not a dead button', () => {
    const html = renderToStaticMarkup(createElement(Btn, { href: '' }, 'Back to Dashboard'));
    expect(html).toMatch(/^<a /); expect(html).toContain('href="#/"');
  });
  it('still renders a link for a path and a button when there is no href', () => {
    expect(renderToStaticMarkup(createElement(Btn, { href: 'fly' }, 'Fly'))).toContain('href="#/fly"');
    expect(renderToStaticMarkup(createElement(Btn, {}, 'Click'))).toMatch(/^<button /);
  });
});
