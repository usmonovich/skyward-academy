import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Decision, GameAircraft, MissionDef, MissionResult } from '../types';
import { GAME_AIRCRAFT, LIVERIES } from '../content/reference';
import { allMissions } from '../content';
import { actions, useProgress } from '../store/progress';
import { audio } from '../engine/audio';
import { Btn, Chip, Icon, AircraftArt } from '../components/ui';
import { MissionComplete } from '../components/MissionComplete';
import { createGame, debrief, type GameHandle, type Safe } from './engine';
import { nextMission } from './browse';

type Phase = 'briefing' | 'flying' | 'paused' | 'decision' | 'debrief';
type Orientation = { lock?: (o: string) => Promise<void>; unlock?: () => void };

/** Phones and tablets in either orientation, and any narrow or short window, play in a dedicated full-viewport container; wide desktop windows keep the card. */
const wantsFullScreenGame = () => typeof window !== 'undefined' && !!window.matchMedia?.('(max-width: 900px), (max-height: 520px), (pointer: coarse)').matches;

function useMedia(query: string): boolean {
  const [m, setM] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const on = () => setM(mq.matches);
    on(); mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, [query]);
  return m;
}

let probe: HTMLDivElement | null = null;
/** Reads the notch and home-indicator insets in CSS pixels (all zero when the page does not extend under them). */
function measureSafe(): Safe {
  if (!probe) {
    probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';
    document.body.appendChild(probe);
  }
  const cs = getComputedStyle(probe);
  return { top: parseFloat(cs.paddingTop) || 0, right: parseFloat(cs.paddingRight) || 0, bottom: parseFloat(cs.paddingBottom) || 0, left: parseFloat(cs.paddingLeft) || 0 };
}

export function FlightGame({ def, exitHref, nextHref, nextLabel }: { def: MissionDef; exitHref: string; nextHref?: string; nextLabel?: string }) {
  const p = useProgress();
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useRef<GameHandle | null>(null);
  const [full] = useState(wantsFullScreenGame); // decided once per mission so the canvas is never re-parented mid-flight
  const portrait = useMedia('(orientation: portrait)');
  const [phase, setPhase] = useState<Phase>('briefing');
  const [message, setMessage] = useState('');
  const [decision, setDecision] = useState<Decision | null>(null);
  const [decisionFeedback, setDecisionFeedback] = useState<{ text: string; correct: boolean } | null>(null);
  const [result, setResult] = useState<MissionResult | null>(null);
  const [gained, setGained] = useState(0);
  const [prevBest, setPrevBest] = useState<number | null>(null);
  const [run, setRun] = useState(0);
  const [showHelp, setShowHelp] = useState(!p.seenTutorial);
  const [isFs, setIsFs] = useState(false);
  const wantFs = useRef(true);
  const fsOk = typeof document !== 'undefined' && !!document.documentElement.requestFullscreen;

  const free = !def.lessonId && !def.requires;
  const ac: GameAircraft = (free ? GAME_AIRCRAFT.find((a) => a.id === p.selectedAircraft) : GAME_AIRCRAFT.find((a) => a.id === def.aircraftId)) ?? GAME_AIRCRAFT[0];
  const livery = LIVERIES.find((l) => l.id === p.livery)?.color ?? LIVERIES[0].color;
  const assisted = p.settings.assisted;
  const reducedMotion = p.settings.reducedMotion;

  /** Browser full screen, then landscape where the browser allows it. Both need a user gesture and may be refused (iPhone Safari). */
  const enterFs = useCallback(() => {
    const el = rootRef.current;
    if (!el || !fsOk || document.fullscreenElement) return;
    void el.requestFullscreen({ navigationUI: 'hide' })
      .then(() => (screen.orientation as unknown as Orientation | undefined)?.lock?.('landscape'))
      .catch(() => { /* refused: the fixed full-viewport layout is the fallback */ });
  }, [fsOk]);
  const leaveFs = useCallback(() => {
    try { (screen.orientation as unknown as Orientation | undefined)?.unlock?.(); } catch { /* not supported */ }
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
  }, []);

  const start = useCallback(() => {
    setResult(null); setMessage(''); setDecision(null); setDecisionFeedback(null);
    setPhase('flying'); setRun((r) => r + 1);
    if (!p.seenTutorial) actions.seenTutorial();
    setShowHelp(false);
    if (full && wantFs.current) enterFs();
  }, [p.seenTutorial, full, enterFs]);

  /** Fits the camera to the container and the notch insets. */
  const sync = useCallback(() => {
    const st = stageRef.current; const g = game.current;
    if (!st || !g) return;
    const r = st.getBoundingClientRect();
    g.resize(r.width, r.height, full ? measureSafe() : undefined);
  }, [full]);

  useEffect(() => {
    if (run === 0 || !canvasRef.current) return;
    const g = createGame(canvasRef.current, def, ac, { assisted, livery, reducedMotion }, {
      onMessage: setMessage,
      onDecision: (d) => { setDecision(d); setDecisionFeedback(null); setPhase('decision'); },
      onEnd: (r) => { setPrevBest(p.missions[def.id]?.best ?? null); setResult(r); setGained(actions.mission(def, r)); setPhase('debrief'); },
    });
    game.current = g;
    sync();
    // Development-only handle so automated browser tests can read the simulation state.
    if (import.meta.env.DEV) (window as unknown as { __skywardGame?: unknown }).__skywardGame = g;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') setPhase((ph) => { if (ph === 'flying') { g.pause(); return 'paused'; } if (ph === 'paused') { g.resume(); return 'flying'; } return ph; });
    };
    const onBlur = () => setPhase((ph) => { if (ph === 'flying') { g.pause(); return 'paused'; } return ph; });
    const onVis = () => { if (document.hidden) onBlur(); };
    window.addEventListener('keydown', onKey); window.addEventListener('blur', onBlur); document.addEventListener('visibilitychange', onVis);
    return () => { g.destroy(); game.current = null; window.removeEventListener('keydown', onKey); window.removeEventListener('blur', onBlur); document.removeEventListener('visibilitychange', onVis); };
    // The game instance is rebuilt only when a new run starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  // Resize and orientation changes re-fit the camera without touching the simulation.
  useEffect(() => {
    const st = stageRef.current;
    if (!st) return;
    const ro = new ResizeObserver(sync); ro.observe(st);
    window.addEventListener('orientationchange', sync);
    return () => { ro.disconnect(); window.removeEventListener('orientationchange', sync); };
  }, [sync]);

  // Full-screen mode: the app behind the game is hidden and inert, the page cannot scroll, full screen state is tracked.
  useEffect(() => {
    if (!full) return;
    const root = rootRef.current;
    const shell = document.querySelector('.shell');
    document.documentElement.classList.add('game-active'); document.body.classList.add('game-active');
    shell?.setAttribute('inert', ''); shell?.setAttribute('aria-hidden', 'true');
    // Keep the page from scrolling or rubber-banding under the game; the briefing, pause and result panels may scroll.
    const noScroll = (e: TouchEvent) => { if (!(e.target as Element | null)?.closest?.('.overlay, .mc-scroll')) e.preventDefault(); };
    root?.addEventListener('touchmove', noScroll, { passive: false });
    const onFs = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => {
      root?.removeEventListener('touchmove', noScroll); document.removeEventListener('fullscreenchange', onFs);
      document.documentElement.classList.remove('game-active'); document.body.classList.remove('game-active');
      shell?.removeAttribute('inert'); shell?.removeAttribute('aria-hidden');
      leaveFs();
    };
  }, [full, leaveFs]);

  const pause = () => { game.current?.pause(); setPhase('paused'); };
  const resume = () => { game.current?.resume(); setPhase('flying'); };
  const toggleFs = () => { if (document.fullscreenElement) { wantFs.current = false; leaveFs(); } else { wantFs.current = true; enterFs(); } };
  const hold = (i: { x?: number; y?: number; h?: number }) => {
    const release = () => game.current?.setInput({ x: i.x !== undefined ? 0 : undefined, y: i.y !== undefined ? 0 : undefined, h: i.h !== undefined ? 0 : undefined });
    return {
      onPointerDown: (e: React.PointerEvent) => { e.preventDefault(); game.current?.setInput(i); },
      onPointerUp: release, onPointerLeave: release, onPointerCancel: release,
      onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    };
  };

  const content = (
    <div className={`game${full ? ' full' : ''}`} ref={rootRef} style={{ ['--hud-extra' as string]: def.lateral ? '52px' : '0px' }}>
      {!full && (
        <div className="game-bar">
          <div><strong>{def.title}</strong> <Chip tone="navy">{def.tier}</Chip> <Chip>{def.style}</Chip>{assisted && <Chip tone="ok">Assisted</Chip>}</div>
          <div className="row gap">
            {phase === 'flying' && <Btn small kind="soft" icon="pause" onClick={pause}>Pause</Btn>}
            {(phase === 'flying' || phase === 'paused') && <Btn small kind="soft" icon="refresh" onClick={start}>Restart</Btn>}
            <Btn small kind="ghost" href={exitHref} icon="close">Exit</Btn>
          </div>
        </div>
      )}

      <div className="game-stage" ref={stageRef}>
        <canvas ref={canvasRef} className="game-canvas" tabIndex={0} aria-label={`Flight mission: ${def.title}. Use the arrow keys or W A S D to fly.`} />
        {message && phase === 'flying' && <div className="game-msg" role="status" aria-live="polite"><span className="instructor-dot" />{message}</div>}

        {phase === 'briefing' && (
          <div className="overlay">
            <div className="overlay-card">
              <Chip tone="accent">Mission briefing</Chip>
              <h2>{def.title}</h2>
              <div className="brief-grid">
                <AircraftArt ac={ac} color={livery} width={200} />
                <div>
                  <p>{def.briefing}</p>
                  <p><strong>Objective:</strong> {def.objective}</p>
                  <p className="small muted">Aircraft: {ac.name} ({ac.cls}) · Target time {def.parTime} s · Reward up to {def.xp + 75} XP</p>
                </div>
              </div>
              {showHelp && (
                <div className="controls-help">
                  <strong>How to fly</strong>
                  <ul>
                    <li><kbd>↑</kbd>/<kbd>W</kbd> climb · <kbd>↓</kbd>/<kbd>S</kbd> descend · <kbd>→</kbd>/<kbd>D</kbd> more thrust · <kbd>←</kbd>/<kbd>A</kbd> less thrust</li>
                    <li><kbd>Space</kbd> hold level · <kbd>P</kbd> or <kbd>Esc</kbd> pause</li>
                    {def.lateral && <li><kbd>Q</kbd>/<kbd>E</kbd> or the heading buttons: hold a heading correction to counter the sideways wind. The track panel shows where you are across the planned track.</li>}
                    <li>Touch: drag on the screen to steer, or use the large buttons at the screen edges.</li>
                    <li>Fly through the orange gates, avoid obstacles, reach the finish. Three contacts end the mission.</li>
                  </ul>
                </div>
              )}
              {full && portrait && <p className="small rotate-tip">Tip: turn your phone sideways for a wider view of the route ahead. The game works in both orientations.</p>}
              {full && !fsOk && <p className="small muted">This browser keeps its own toolbar. The game fills the visible screen instead.</p>}
              <div className="row gap wrap">
                <Btn kind="accent" icon="play" onClick={start}>Start mission</Btn>
                {!showHelp && <Btn kind="ghost" onClick={() => setShowHelp(true)}>Show controls</Btn>}
                {full && <Btn kind="ghost" icon="close" href={exitHref}>Back</Btn>}
                <label className="check"><input type="checkbox" checked={assisted} onChange={(e) => actions.settings({ assisted: e.target.checked })} /> Assisted mode (no mission failure from contacts, landing help)</label>
              </div>
              <p className="small muted">{def.style === 'Arcade' ? 'This is a simplified arcade game.' : 'This is a simplified educational simulation.'} It is not flight training and does not represent real aircraft handling or procedures.</p>
            </div>
          </div>
        )}

        {phase === 'paused' && (
          <div className="overlay">
            <div className="overlay-card narrow">
              <h2>Paused</h2>
              <div className="row gap wrap"><Btn kind="accent" icon="play" onClick={resume}>Resume</Btn><Btn kind="soft" icon="refresh" onClick={start}>Restart</Btn><Btn kind="ghost" href={exitHref}>Exit mission</Btn></div>
            </div>
          </div>
        )}

        {phase === 'decision' && decision && (
          <div className="overlay">
            <div className="overlay-card">
              <Chip tone="accent">Operational decision</Chip>
              <p className="q-prompt">{decision.prompt}</p>
              {!decisionFeedback ? (
                <div className="options">
                  {decision.options.map((o) => <button key={o.text} type="button" className="option" onClick={() => { setDecisionFeedback({ text: o.feedback, correct: !!o.correct }); audio.sfx(o.correct ? 'ok' : 'bad'); }}><span className="option-dot" />{o.text}</button>)}
                </div>
              ) : (
                <>
                  <div className={`feedback ${decisionFeedback.correct ? 'ok' : 'bad'}`}><strong>{decisionFeedback.correct ? 'Good decision.' : 'Not the best choice.'}</strong> {decisionFeedback.text}</div>
                  <Btn kind="accent" icon="play" onClick={() => { game.current?.answerDecision(decisionFeedback.correct); setDecision(null); setPhase('flying'); }}>Continue flight</Btn>
                </>
              )}
            </div>
          </div>
        )}

        {phase === 'debrief' && result && !result.success && (
          <div className="overlay">
            <div className="overlay-card">
              <Chip tone="warn">Mission not completed</Chip>
              <h2>Let's try that again</h2>
              <ul className="debrief-list">{debrief(def, result).map((line) => <li key={line}>{line}</li>)}</ul>
              <div className="row gap wrap">
                <Btn kind="accent" icon="refresh" onClick={start}>Retry mission</Btn>
                <Btn kind="ghost" href={exitHref}>Exit</Btn>
              </div>
            </div>
          </div>
        )}
      </div>

      {full && phase === 'flying' && (
        <>
          <div className="tc tc-left" role="group" aria-label="Pitch controls">
            <button type="button" className="tc-btn" aria-label="Climb" {...hold({ y: -1 })}><Icon name="up" size={36} /></button>
            <button type="button" className="tc-btn" aria-label="Descend" {...hold({ y: 1 })}><Icon name="down" size={36} /></button>
          </div>
          <div className="tc tc-right" role="group" aria-label="Thrust controls">
            <button type="button" className="tc-btn" aria-label="More thrust" {...hold({ x: 1 })}><Icon name="plus" size={32} /><span>Thrust</span></button>
            <button type="button" className="tc-btn" aria-label="Less thrust" {...hold({ x: -1 })}><b aria-hidden="true">−</b><span>Thrust</span></button>
          </div>
          {def.lateral && (
            <div className="tc-center" role="group" aria-label="Heading controls">
              <button type="button" className="tc-hdg" aria-label="Heading left" {...hold({ h: -1 })}>◀ HDG</button>
              <button type="button" className="tc-hdg" aria-label="Heading right" {...hold({ h: 1 })}>HDG ▶</button>
            </div>
          )}
          <div className="game-actions" role="group" aria-label="Game controls">
            <button type="button" className="ga-btn" aria-label="Pause" onClick={pause}><Icon name="pause" size={22} /></button>
            <button type="button" className="ga-btn" aria-label="Restart mission" onClick={start}><Icon name="refresh" size={22} /></button>
            {fsOk && <button type="button" className="ga-btn" aria-label={isFs ? 'Leave full screen' : 'Enter full screen'} aria-pressed={isFs} onClick={toggleFs}><span aria-hidden="true">{isFs ? '⤡' : '⤢'}</span></button>}
            <a className="ga-btn" aria-label="Exit mission" href={`#/${exitHref}`} onClick={() => audio.sfx('click')}><Icon name="close" size={22} /></a>
          </div>
        </>
      )}

      {!full && phase === 'flying' && (
        <div className="touch-controls" aria-label="Touch flight controls">
          <button type="button" className="touch-btn" aria-label="Less thrust" {...hold({ x: -1 })}>− Thrust</button>
          <button type="button" className="touch-btn" aria-label="Climb" {...hold({ y: -1 })}><Icon name="up" /> Climb</button>
          <button type="button" className="touch-btn" aria-label="Descend" {...hold({ y: 1 })}><Icon name="down" /> Descend</button>
          <button type="button" className="touch-btn" aria-label="More thrust" {...hold({ x: 1 })}>+ Thrust</button>
          {def.lateral && <button type="button" className="touch-btn" aria-label="Heading left" {...hold({ h: -1 })}>◀ Heading</button>}
          {def.lateral && <button type="button" className="touch-btn" aria-label="Heading right" {...hold({ h: 1 })}>Heading ▶</button>}
        </div>
      )}
      {!full && <p className="rotate-hint small muted">Tip: rotate your device to landscape for a larger flight view.</p>}

      {phase === 'debrief' && result?.success && (
        <MissionComplete def={def} result={result} gained={gained} prevBest={prevBest} reducedMotion={reducedMotion} lines={debrief(def, result)}
          actions={<>
            {nextHref && <Btn kind="accent" href={nextHref} icon="arrow">{nextLabel ?? 'Continue'}</Btn>}
            {(() => { const nx = nextMission(allMissions(), p, def.id); return nx ? <Btn kind="soft" href={`fly/${nx.id}`} icon="fly">Next: {nx.title}</Btn> : null; })()}
            <Btn kind="soft" icon="refresh" onClick={start}>Fly again</Btn>
            <Btn kind="ghost" href="">Back to Dashboard</Btn>
          </>} />
      )}
    </div>
  );

  // A portal puts the game directly under <body>: no ancestor transform, overflow or stacking context can shrink it.
  return full ? createPortal(content, document.body) : content;
}
