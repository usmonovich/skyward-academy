import { useCallback, useEffect, useRef, useState } from 'react';
import type { Decision, GameAircraft, MissionDef, MissionResult } from '../types';
import { GAME_AIRCRAFT, LIVERIES } from '../content/reference';
import { allMissions } from '../content';
import { actions, useProgress } from '../store/progress';
import { audio } from '../engine/audio';
import { scoreParts } from '../engine/gamification';
import { Btn, Chip, Icon, Stars, AircraftArt } from '../components/ui';
import { createGame, debrief, type GameHandle } from './engine';
import { nextMission } from './browse';

const PART_LABELS: [keyof ReturnType<typeof scoreParts>, string, number][] = [['gates', 'Gates', 40], ['safety', 'Safety', 25], ['time', 'Time', 15], ['objective', 'Objective', 20]];

type Phase = 'briefing' | 'flying' | 'paused' | 'decision' | 'debrief';

export function FlightGame({ def, exitHref, nextHref, nextLabel }: { def: MissionDef; exitHref: string; nextHref?: string; nextLabel?: string }) {
  const p = useProgress();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useRef<GameHandle | null>(null);
  const [phase, setPhase] = useState<Phase>('briefing');
  const [message, setMessage] = useState('');
  const [decision, setDecision] = useState<Decision | null>(null);
  const [decisionFeedback, setDecisionFeedback] = useState<{ text: string; correct: boolean } | null>(null);
  const [result, setResult] = useState<MissionResult | null>(null);
  const [gained, setGained] = useState(0);
  const [prevBest, setPrevBest] = useState<number | null>(null);
  const [run, setRun] = useState(0);
  const [showHelp, setShowHelp] = useState(!p.seenTutorial);

  const free = !def.lessonId;
  const ac: GameAircraft = (free ? GAME_AIRCRAFT.find((a) => a.id === p.selectedAircraft) : GAME_AIRCRAFT.find((a) => a.id === def.aircraftId)) ?? GAME_AIRCRAFT[0];
  const livery = LIVERIES.find((l) => l.id === p.livery)?.color ?? LIVERIES[0].color;
  const assisted = p.settings.assisted;
  const reducedMotion = p.settings.reducedMotion;

  const start = useCallback(() => {
    setResult(null); setMessage(''); setDecision(null); setDecisionFeedback(null);
    setPhase('flying'); setRun((r) => r + 1);
    if (!p.seenTutorial) actions.seenTutorial();
    setShowHelp(false);
  }, [p.seenTutorial]);

  useEffect(() => {
    if (run === 0 || !canvasRef.current) return;
    const g = createGame(canvasRef.current, def, ac, { assisted, livery, reducedMotion }, {
      onMessage: setMessage,
      onDecision: (d) => { setDecision(d); setDecisionFeedback(null); setPhase('decision'); },
      onEnd: (r) => { setPrevBest(p.missions[def.id]?.best ?? null); setResult(r); setGained(actions.mission(def, r)); setPhase('debrief'); },
    });
    game.current = g;
    // Development-only handle so automated browser tests can read the simulation state.
    if (import.meta.env.DEV) (window as unknown as { __skywardGame?: unknown }).__skywardGame = g;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') setPhase((ph) => { if (ph === 'flying') { g.pause(); return 'paused'; } if (ph === 'paused') { g.resume(); return 'flying'; } return ph; });
    };
    const onBlur = () => setPhase((ph) => { if (ph === 'flying') { g.pause(); return 'paused'; } return ph; });
    window.addEventListener('keydown', onKey); window.addEventListener('blur', onBlur);
    return () => { g.destroy(); game.current = null; window.removeEventListener('keydown', onKey); window.removeEventListener('blur', onBlur); };
    // The game instance is rebuilt only when a new run starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  const pause = () => { game.current?.pause(); setPhase('paused'); };
  const resume = () => { game.current?.resume(); setPhase('flying'); };
  const hold = (i: { x?: number; y?: number }) => ({
    onPointerDown: (e: React.PointerEvent) => { e.preventDefault(); game.current?.setInput(i); },
    onPointerUp: () => game.current?.setInput({ x: i.x !== undefined ? 0 : undefined, y: i.y !== undefined ? 0 : undefined }),
    onPointerLeave: () => game.current?.setInput({ x: i.x !== undefined ? 0 : undefined, y: i.y !== undefined ? 0 : undefined }),
  });

  return (
    <div className="game">
      <div className="game-bar">
        <div><strong>{def.title}</strong> <Chip tone="navy">{def.tier}</Chip> <Chip>{def.style}</Chip>{assisted && <Chip tone="ok">Assisted</Chip>}</div>
        <div className="row gap">
          {phase === 'flying' && <Btn small kind="soft" icon="pause" onClick={pause}>Pause</Btn>}
          {(phase === 'flying' || phase === 'paused') && <Btn small kind="soft" icon="refresh" onClick={start}>Restart</Btn>}
          <Btn small kind="ghost" href={exitHref} icon="close">Exit</Btn>
        </div>
      </div>

      <div className="game-stage">
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
                    <li>Touch: drag on the screen to steer, use the on-screen thrust buttons.</li>
                    <li>Fly through the orange gates, avoid obstacles, reach the finish. Three contacts end the mission.</li>
                  </ul>
                </div>
              )}
              <div className="row gap wrap">
                <Btn kind="accent" icon="play" onClick={start}>Start mission</Btn>
                {!showHelp && <Btn kind="ghost" onClick={() => setShowHelp(true)}>Show controls</Btn>}
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

        {phase === 'debrief' && result && (
          <div className="overlay">
            <div className={`overlay-card${result.success && !reducedMotion ? ' celebrate' : ''}`}>
              <Chip tone={result.success ? 'ok' : 'warn'}>{result.success ? 'Mission complete' : 'Mission not completed'}</Chip>
              <h2>{result.success ? 'Post-flight debrief' : 'Let\'s try that again'}</h2>
              {result.success && <div className="debrief-score"><Stars n={result.stars} size={30} /><div><strong>{result.score}</strong> / 1000 points</div>{gained > 0 ? <Chip tone="accent">+{gained} XP</Chip> : <Chip>No new XP</Chip>}{prevBest === null ? <Chip tone="ok">First flight</Chip> : result.score > prevBest ? <Chip tone="ok">New best (was {prevBest})</Chip> : <Chip>Best {prevBest}</Chip>}</div>}
              {result.success && (
                <div className="score-parts" role="group" aria-label="Score breakdown">
                  {PART_LABELS.map(([k, label, weight]) => { const v = scoreParts(def.parTime, result)[k]; return (
                    <div key={k} className="score-part"><span className="small">{label} <span className="muted">({weight}%)</span></span><div className="score-bar" aria-hidden="true"><span style={{ width: `${Math.round(v * 100)}%` }} /></div><span className="small"><strong>{Math.round(v * 100)}%</strong></span></div>
                  ); })}
                </div>
              )}
              <ul className="debrief-list">{debrief(def, result).map((line) => <li key={line}>{line}</li>)}</ul>
              <div className="row gap wrap">
                {result.success && nextHref && <Btn kind="accent" href={nextHref} icon="arrow">{nextLabel ?? 'Continue'}</Btn>}
                {result.success && (() => { const nx = nextMission(allMissions(), p, def.id); return nx ? <Btn kind="soft" href={`fly/${nx.id}`} icon="fly">Next: {nx.title}</Btn> : null; })()}
                <Btn kind={result.success ? 'soft' : 'accent'} icon="refresh" onClick={start}>{result.success ? 'Fly again' : 'Retry mission'}</Btn>
                <Btn kind="ghost" href={exitHref}>Exit</Btn>
              </div>
            </div>
          </div>
        )}
      </div>

      {(phase === 'flying') && (
        <div className="touch-controls" aria-label="Touch flight controls">
          <button type="button" className="touch-btn" aria-label="Less thrust" {...hold({ x: -1 })}>− Thrust</button>
          <button type="button" className="touch-btn" aria-label="Climb" {...hold({ y: -1 })}><Icon name="up" /> Climb</button>
          <button type="button" className="touch-btn" aria-label="Descend" {...hold({ y: 1 })}><Icon name="down" /> Descend</button>
          <button type="button" className="touch-btn" aria-label="More thrust" {...hold({ x: 1 })}>+ Thrust</button>
        </div>
      )}
      <p className="rotate-hint small muted">Tip: rotate your device to landscape for a larger flight view.</p>
    </div>
  );
}
