import { useCallback, useEffect, useRef, useState } from 'react';
import { APP } from '../config';

const SEEN_KEY = 'skyward.splash.seen';
/** Full intro on the first launch, a shorter one afterwards, a still frame when motion is reduced. */
const TIMING = { full: 3600, short: 1500, still: 900 } as const;
const LEAVE_MS = 520;

const readSeen = () => { try { return localStorage.getItem(SEEN_KEY) === '1'; } catch { return true; } };
const markSeen = () => { try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* storage unavailable */ } };

/**
 * Opening animation. A CSS-only timeline (transform and opacity, so it stays on the compositor): the app icon
 * flies in from a distance with perspective and blur, settles, a light sweep crosses it, then the name appears and
 * the screen fades into the app. Tap, Enter, Escape or the Skip button ends it early.
 */
export function Splash({ reducedMotion, onDone }: { reducedMotion: boolean; onDone: () => void }) {
  const [first] = useState(() => !readSeen());
  const mode: keyof typeof TIMING = reducedMotion ? 'still' : first ? 'full' : 'short';
  const [leaving, setLeaving] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const done = useRef(false);

  const leave = useCallback(() => {
    if (done.current) return;
    done.current = true;
    markSeen();
    setLeaving(true);
    window.setTimeout(onDone, reducedMotion ? 0 : LEAVE_MS);
  }, [onDone, reducedMotion]);

  useEffect(() => {
    const end = window.setTimeout(leave, TIMING[mode]);
    const skip = window.setTimeout(() => setCanSkip(true), 700);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') leave(); };
    window.addEventListener('keydown', onKey);
    return () => { window.clearTimeout(end); window.clearTimeout(skip); window.removeEventListener('keydown', onKey); };
  }, [leave, mode]);

  const icon = `${import.meta.env.BASE_URL}icon-512.png`;
  return (
    <div className={`splash splash-${mode}${leaving ? ' leaving' : ''}`} role="status" aria-label={`${APP.name} is starting`} onPointerDown={() => canSkip && leave()}>
      <div className="splash-sky" aria-hidden="true"><i className="splash-cloud c1" /><i className="splash-cloud c2" /><i className="splash-cloud c3" /><i className="splash-glow" /></div>
      <div className="splash-stage">
        <div className="splash-scene" aria-hidden="true">
          <span className="splash-ground" />
          <span className="splash-icon"><img src={icon} alt="" width={512} height={512} draggable={false} /><b className="splash-shine" /></span>
        </div>
        <div className="splash-text">
          {first && <span className="splash-eyebrow">Welcome to</span>}
          <h1>{APP.name}</h1>
          <p>{APP.tagline}</p>
        </div>
      </div>
      {canSkip && !leaving && <button type="button" className="splash-skip" onClick={(e) => { e.stopPropagation(); leave(); }}>Skip</button>}
    </div>
  );
}
