import { useMemo } from 'react';
import type { MissionDef, MissionResult } from '../types';
import { buildLevel, CEIL, GROUND } from '../game/engine';
import { analyse } from '../game/analysis';
import { Icon } from './ui';

const W = 320;
const PAD = 10;

/** Flight path charts: height profile with gates and runway, and for sideways-wind missions the track seen from above. */
function Paths({ def, result }: { def: MissionDef; result: MissionResult }) {
  const trace = result.trace ?? [];
  const level = useMemo(() => buildLevel(def), [def]);
  if (trace.length < 3) return null;
  const x = (wx: number) => PAD + (Math.min(wx, def.length) / def.length) * (W - 2 * PAD);
  const hy = (py: number) => 8 + ((py - CEIL) / (GROUND - CEIL)) * 84;
  const line = (pts: [number, number][]) => pts.map(([a, b], i) => `${i ? 'L' : 'M'}${a.toFixed(1)} ${b.toFixed(1)}`).join(' ');
  const height = line(trace.map((s) => [x(s[1]), hy(s[2])]));
  const L = def.lateral;
  const ly = (lat: number) => 45 - Math.max(-110, Math.min(110, lat)) * 0.36;
  const planned = (wx: number): number => {
    const wps = L?.waypoints; if (!wps) return 0;
    let px = 0; let pl = 0;
    for (let i = 0; i < level.gates.length && i < wps.length; i++) { const gx = level.gates[i].x; if (wx <= gx) return pl + (wps[i].lat - pl) * Math.max(0, Math.min(1, (wx - px) / Math.max(1, gx - px))); px = gx; pl = wps[i].lat; }
    return pl;
  };
  const plan = L ? Array.from({ length: 41 }, (_, i) => { const wx = (i / 40) * def.length; return [x(wx), ly(planned(wx))] as [number, number]; }) : [];
  const states = result.gateStates ?? [];
  const last = trace[trace.length - 1];
  return (
    <div className="fr-charts">
      <figure>
        <figcaption>Height profile</figcaption>
        <svg viewBox={`0 0 ${W} 104`} role="img" aria-label={`Height profile of the flight with ${result.checkpoints} of ${result.total} gates collected`}>
          <rect x="0" y="0" width={W} height="104" rx="10" className="fr-bg" />
          <line x1={PAD} x2={W - PAD} y1="96" y2="96" className="fr-ground" />
          {def.landing && <rect x={x(level.runwayStart)} y="94" width={x(level.runwayEnd) - x(level.runwayStart)} height="4" className="fr-runway" />}
          {level.gates.map((g, i) => <ellipse key={i} cx={x(g.x)} cy={hy(g.y)} rx="3.2" ry={Math.max(6, (g.r / (GROUND - CEIL)) * 84)} className={`fr-gate ${states[i] === 'hit' ? 'hit' : 'miss'}`} />)}
          <path d={height} className="fr-path" />
          <circle cx={x(last[1])} cy={hy(last[2])} r="3.6" className="fr-end" />
        </svg>
        <p className="fr-key"><i className="k-hit" /> gate collected <i className="k-miss" /> gate missed <i className="k-path" /> your path</p>
      </figure>
      {L && (
        <figure>
          <figcaption>{L.waypoints ? 'Route (seen from above)' : 'Track (seen from above)'}</figcaption>
          <svg viewBox={`0 0 ${W} 90`} role="img" aria-label={`Sideways track of the flight: average ${(result.trackError ?? 0).toFixed(0)} units from the planned track`}>
            <rect x="0" y="0" width={W} height="90" rx="10" className="fr-bg" />
            <path d={`${line(plan.map(([a, b]) => [a, b - L.tol * 0.36]))} ${plan.slice().reverse().map(([a, b]) => `L${a.toFixed(1)} ${(b + L.tol * 0.36).toFixed(1)}`).join(' ')} Z`} className="fr-corridor" />
            <path d={line(plan)} className="fr-plan" />
            {L.waypoints && level.gates.map((g, i) => L.waypoints![i] && <rect key={i} x={x(g.x) - 3} y={ly(L.waypoints![i].lat) - 3} width="6" height="6" transform={`rotate(45 ${x(g.x)} ${ly(L.waypoints![i].lat)})`} className={`fr-wp ${states[i] === 'hit' ? 'hit' : 'miss'}`} />)}
            <path d={line(trace.map((s) => [x(s[1]), ly(s[3])]))} className="fr-path" />
          </svg>
          <p className="fr-key"><i className="k-corr" /> on-track corridor <i className="k-path" /> your track</p>
        </figure>
      )}
    </div>
  );
}

/** Performance analysis shown after every mission: strengths, mistakes, tips and the flight path. */
export function FlightReport({ def, result, compact = false }: { def: MissionDef; result: MissionResult; compact?: boolean }) {
  const a = useMemo(() => analyse(def, result), [def, result]);
  return (
    <section className={`fr${compact ? ' compact' : ''}`} aria-label="Flight analysis">
      <h3>Flight analysis</h3>
      <Paths def={def} result={result} />
      {a.strengths.length > 0 && <div className="fr-block good"><h4><Icon name="check" size={16} /> What went well</h4><ul>{a.strengths.map((s) => <li key={s}>{s}</li>)}</ul></div>}
      {a.mistakes.length > 0 && <div className="fr-block bad"><h4><Icon name="close" size={16} /> What to fix</h4><ul>{a.mistakes.map((s) => <li key={s}>{s}</li>)}</ul></div>}
      {a.tips.length > 0 && <div className="fr-block tip"><h4><Icon name="arrow" size={16} /> Next time</h4><ul>{a.tips.map((s) => <li key={s}>{s}</li>)}</ul></div>}
      {def.concept && <p className="small muted">Concept practised: {def.concept}</p>}
    </section>
  );
}
