import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CEIL, GROUND, H, PLANE_X, W, computeView } from '../src/game/engine';
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
    // The whole vertical play band (ceiling to ground and the HUD rows) is always on screen.
    expect(v.VH).toBeGreaterThanOrEqual(H - 1e-6);
    expect(v.oy).toBeGreaterThanOrEqual(0);
    expect(v.oy + H).toBeLessThanOrEqual(v.VH + 1e-6);
    expect(CEIL + v.oy).toBeGreaterThan(0); expect(GROUND + v.oy).toBeLessThan(v.VH);
    // The aircraft sits on screen with a useful stretch of the route ahead of it.
    expect(v.VW - PLANE_X).toBeGreaterThanOrEqual(380);
    // Both HUD blocks fit side by side or stack, in at least 560 world pixels.
    expect(v.VW).toBeGreaterThanOrEqual(560);
  });

  it('shows more of the route ahead in landscape than in portrait on the same phone', () => {
    expect(computeView(844, 390).VW).toBeGreaterThan(computeView(390, 844).VW * 1.5);
  });

  it('uses the whole screen: the band is as large as the screen allows', () => {
    // Landscape phones: the band fills the screen height.
    for (const [cw, ch] of [[844, 390], [932, 430], [667, 375]] as const) {
      const v = computeView(cw, ch);
      expect(v.VH).toBeCloseTo(H, 6); expect(v.oy).toBe(0);
    }
    // Portrait phones: the band fills the width at the minimum 640 world pixels across and the sky and ground fill the rest.
    const p = computeView(390, 844);
    expect(p.VW).toBeCloseTo(640, 6); expect(p.VH).toBeGreaterThan(H);
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
