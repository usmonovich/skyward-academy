import { useEffect, useState, type ReactNode } from 'react';
import type { MissionDef, MissionResult } from '../types';
import { scoreParts } from '../engine/gamification';
import { audio } from '../engine/audio';
import { AircraftArt, Chip, Icon } from './ui';
import { FlightReport } from './FlightReport';
import { GAME_AIRCRAFT, LIVERIES } from '../content/reference';
import { BOOSTERS, RING_STYLE } from '../game/engine';
import { useProgress } from '../store/progress';

/** Aircraft and liveries whose XP threshold was crossed when XP went from `before` to `after`. */
export function unlockedBetween(before: number, after: number) {
  return {
    aircraft: GAME_AIRCRAFT.filter((a) => a.unlockXp > before && a.unlockXp <= after),
    liveries: LIVERIES.filter((l) => l.xp > before && l.xp <= after),
  };
}

/** What the flight earned, in plain numbers. Everything here is measured by the flight; nothing is estimated. */
const PHASE_NAME: Record<string, string> = { takeoff: 'Take-off', climb: 'Climb', cruise: 'Cruise', approach: 'Approach', landing: 'Landing' };

export function flightSummary(result: MissionResult): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  rows.push({ label: 'Rings collected', value: `${result.checkpoints} of ${result.total}` });
  const kinds = Object.entries(result.ringTypes ?? {}).filter(([, v]) => v && v.total > 0).map(([k, v]) => `${RING_STYLE[k as keyof typeof RING_STYLE]?.name ?? k} ${v!.hit}/${v!.total}`);
  if (kinds.length > 1) rows.push({ label: 'By kind', value: kinds.join(' · ') });
  if (result.bonus) rows.push({ label: 'Bonus points', value: `${result.bonus} (not part of the stars)` });
  rows.push({ label: 'Flight time', value: `${Math.floor(result.time / 60)} min ${Math.round(result.time % 60)} s` });
  if (result.phases && result.phases.length > 1) rows.push({ label: 'Flight phases', value: result.phases.map((p) => PHASE_NAME[p] ?? p).join(' › ') });
  if (result.approach) rows.push({ label: 'Approach', value: `${Math.round(result.approach.stability * 100)}% stable${result.approach.goArounds ? ` · ${result.approach.goArounds} go-around${result.approach.goArounds > 1 ? 's' : ''}` : ''}` });
  if (result.landing) rows.push({ label: 'Touchdown', value: `${result.landing[0].toUpperCase()}${result.landing.slice(1)}${result.touchdownZone ? (result.touchdownZone === 'in' ? ', in the touchdown zone' : ', long') : ''}` });
  const used = Object.entries(result.boosters?.used ?? {}).filter(([, n]) => (n ?? 0) > 0).map(([k, n]) => `${BOOSTERS[k as keyof typeof BOOSTERS]?.name ?? k} ×${n}`);
  rows.push({ label: 'Boosters used', value: used.length ? used.join(', ') : 'None' });
  if (result.decisionsTotal > 0) rows.push({ label: 'Questions answered correctly', value: `${result.decisionsCorrect} of ${result.decisionsTotal}` });
  if (result.english && result.english.asked > 0) {
    const e = result.english; const part = (k: 'comprehension' | 'phraseology') => (e.bySkill[k].asked ? `${k} ${e.bySkill[k].correct}/${e.bySkill[k].asked}` : '');
    rows.push({ label: 'Radio calls', value: [part('comprehension'), part('phraseology')].filter(Boolean).join(' · ') });
  }
  return rows;
}

const PARTS: [keyof ReturnType<typeof scoreParts>, string][] = [['gates', 'Gates'], ['safety', 'Safety'], ['time', 'Time'], ['objective', 'Objective']];
const HEADLINE = ['Mission complete', 'Good flight', 'Well flown', 'Flawless flight'];
const STAR_MS = 520; // time between stars
const STAR_START = 650;
const CONFETTI = Array.from({ length: 18 }, (_, i) => ({ left: 6 + ((i * 53) % 88), delay: (i % 6) * 0.09, dur: 1.9 + (i % 5) * 0.25, hue: i % 3, drift: ((i * 37) % 60) - 30 }));

/** Counts up to `target` over `ms`; jumps straight there when motion is reduced. */
function useCount(target: number, ms: number, delay: number, still: boolean) {
  const [v, setV] = useState(still ? target : 0);
  useEffect(() => {
    if (still) { setV(target); return; }
    let raf = 0; let t0 = 0;
    const tick = (t: number) => { if (!t0) t0 = t; const k = Math.min(1, Math.max(0, (t - t0 - delay) / ms)); setV(Math.round(target * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, delay, still]);
  return v;
}

/**
 * Full-screen celebration shown after a successful mission: stars pop in one by one (using the existing 1/2/3 star
 * rating from the scoring system), the score and XP count up, and the actions sit in a sticky footer so they stay
 * reachable on small phones.
 */
export function MissionComplete({ def, result, gained, prevBest, reducedMotion, lines, actions }: { def: MissionDef; result: MissionResult; gained: number; prevBest: number | null; reducedMotion: boolean; lines: string[]; actions: ReactNode }) {
  const still = reducedMotion;
  const earned = Math.max(1, Math.min(3, result.stars));
  const [shown, setShown] = useState(still ? 3 : 0);
  const score = useCount(result.score, 1300, STAR_START, still);
  const xp = useCount(gained, 1000, STAR_START + 300, still);
  const parts = scoreParts(def.parTime, result);
  const p = useProgress();
  const rows = flightSummary(result);
  // Newly unlocked: aircraft and liveries whose XP threshold was crossed by this flight.
  const before = p.xp - gained;
  const unlocked = unlockedBetween(before, p.xp);
  const newAircraft = unlocked.aircraft;
  useEffect(() => { if (newAircraft.length && !still) audio.sfx('unlock'); }, [newAircraft.length, still]);
  const fresh = unlocked.liveries.map((l) => `Livery: ${l.name}`);

  useEffect(() => {
    if (still) return;
    const timers: number[] = [];
    for (let i = 0; i < 3; i++) {
      timers.push(window.setTimeout(() => {
        setShown(i + 1);
        if (i < earned) audio.sfx(i === 2 ? 'win' : 'gate');
      }, STAR_START + i * STAR_MS));
    }
    return () => timers.forEach(window.clearTimeout);
  }, [still, earned]);

  const best = prevBest === null ? <Chip tone="ok">First flight</Chip> : result.score > prevBest ? <Chip tone="ok">New best · was {prevBest}</Chip> : <Chip>Best {prevBest}</Chip>;

  return (
    <div className={`mc${earned === 3 ? ' mc-perfect' : ''}${still ? ' mc-still' : ''}`} role="dialog" aria-modal="true" aria-label={`${def.title} complete, ${earned} of 3 stars`}>
      {earned === 3 && !still && <div className="mc-confetti" aria-hidden="true">{CONFETTI.map((c, i) => <i key={i} className={`k${c.hue}`} style={{ left: `${c.left}%`, animationDelay: `${STAR_START + 2 * STAR_MS + c.delay * 1000}ms`, animationDuration: `${c.dur}s`, ['--drift' as string]: `${c.drift}px` }} />)}</div>}
      <div className="mc-card">
        <div className="mc-scroll">
          <span className="mc-eyebrow">{HEADLINE[earned]}</span>
          <h2>{def.title}</h2>
          <div className="mc-stars" role="img" aria-label={`${earned} of 3 stars`}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={`mc-star s${i}${i < earned ? ' earned' : ' empty'}${i < shown ? ' in' : ''}`}>
                <Icon name="star" size={i === 1 ? 84 : 64} fill />
                {i < earned && <b className="mc-glint" />}
              </span>
            ))}
          </div>
          <div className="mc-score"><strong>{score}</strong><span> / 1000</span></div>
          <div className="mc-chips">{gained > 0 ? <Chip tone="accent">+{xp} XP</Chip> : <Chip>No new XP</Chip>}{best}</div>
          <div className="mc-parts" role="group" aria-label="Score breakdown">
            {PARTS.map(([k, label], i) => (
              <div key={k} className="mc-part"><span>{label}</span><div className="mc-bar" aria-hidden="true"><i style={{ width: `${Math.round(parts[k] * 100)}%`, animationDelay: `${STAR_START + 300 + i * 120}ms` }} /></div><strong>{Math.round(parts[k] * 100)}%</strong></div>
            ))}
          </div>
          <div className="mc-summary" role="group" aria-label="Flight summary">
            {rows.map((x) => <div key={x.label}><span>{x.label}</span><strong>{x.value}</strong></div>)}
            {(result.safetyWrong ?? 0) > 0 && <p className="small">A wrong safety-critical decision or radio call keeps this flight at two stars or fewer.</p>}
            {(result.boosters?.collected ?? 0) > 0 && <p className="small muted">Boosters are arcade help. They change bonus points and comfort, never the questions or the educational result.</p>}
            {result.assisted && <p className="small muted">Assisted mode was on: contacts did not end the flight.</p>}
          </div>
          {newAircraft.map((a) => (
            <div key={a.id} className={`mc-aircraft${still ? '' : ' pop'}`} role="status">
              <strong>New aircraft unlocked</strong>
              <AircraftArt ac={a} color={LIVERIES.find((l) => l.id === p.livery)?.color ?? '#f58220'} width={190} />
              <span>{a.name} · {a.cls}</span>
              <span className="small muted">Speed {a.minKt}–{a.maxKt} kt · Agility {Math.round(a.agility * 100)}%. {a.blurb}</span>
            </div>
          ))}
          {fresh.length > 0 && <div className="mc-unlocks"><strong>Unlocked</strong><ul>{fresh.map((u) => <li key={u}>{u}</li>)}</ul></div>}
          <FlightReport def={def} result={result} />
          <details className="mc-notes"><summary>Flight notes</summary><ul className="debrief-list">{lines.map((l) => <li key={l}>{l}</li>)}</ul></details>
        </div>
        <div className="mc-actions">{actions}</div>
      </div>
    </div>
  );
}
