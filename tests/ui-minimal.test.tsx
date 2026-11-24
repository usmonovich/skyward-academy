import { beforeEach, describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Academy, TrackPage } from '../src/pages/Academy';
import { getTracks } from '../src/content';
import { __resetStore } from '../src/store/progress';

const html = (el: ReturnType<typeof createElement>) => renderToStaticMarkup(el);
const text = (h: string) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

describe('minimal pathway pages (premium UI batch 1)', () => {
  beforeEach(() => __resetStore());

  it('every pathway header is compact: label, title, "Progress n / m lessons", one bar, then the lessons', () => {
    for (const t of getTracks()) {
      const h = html(createElement(TrackPage, { id: t.id }));
      const before = text(h.slice(0, h.indexOf('class="module-block"')));
      expect(before, t.id).toMatch(/Progress \d+ \/ \d+ lessons/);
      // Curriculum management text and regulatory paragraphs are not shown above the lessons any more.
      expect(before, t.id).not.toMatch(/complete and published|further lessons are listed/);
      expect(h.indexOf('<details class="more curriculum"'), t.id).toBeGreaterThan(-1);
      expect(before.length, t.id).toBeLessThan(900);
    }
  });

  it('keeps the regulatory context, one tap away under Curriculum & Sources', () => {
    const h = html(createElement(TrackPage, { id: 'atpl' }));
    const more = h.slice(h.indexOf('<details class="more curriculum"'), h.indexOf('</details>'));
    expect(text(more)).toMatch(/Curriculum &amp; Sources|Curriculum & Sources/);
    expect(text(more)).toMatch(/ICAO/);
    expect(text(more)).toMatch(/does not grant a licence/);
  });

  it('does not repeat "Pass the previous lesson to unlock" under every locked lesson; locked rows say why on tap and to screen readers', () => {
    const h = html(createElement(TrackPage, { id: 'math' }));
    expect(h).not.toMatch(/Pass the previous lesson to unlock/);
    expect((h.match(/Lessons open in order/g) ?? []).length).toBe(1);
    const locked = h.match(/class="lesson-row locked"[^>]*aria-label="[^"]+Locked: complete the previous lesson\."/g) ?? [];
    expect(locked.length).toBeGreaterThan(30);
    // For a new learner the first lesson of each module is open, and each row shows minutes and difficulty, not paragraphs.
    expect((h.match(/lesson-state open/g) ?? []).length).toBe((h.match(/class="module-block"/g) ?? []).length);
    expect(h).toMatch(/\d+ min · Foundation/);
  });

  it('the Academy overview lists the five pathways without development-status paragraphs', () => {
    const t = text(html(createElement(Academy)));
    for (const name of ['Mathematics', 'Physics']) expect(t).toContain(name);
    expect(t).not.toMatch(/more in development/);
  });
});
