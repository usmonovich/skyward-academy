// Interactive demonstrations. Every model states its assumptions; outputs update immediately.
import { useState } from 'react';
import type { Formula, LabKey } from '../types';
import { formulaById } from '../content/formulas';
import { explorerById, type Explorer } from '../content/explorers';
import { actions } from '../store/progress';
import { fmt, Slider } from './ui';

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const used = (id: string) => actions.labUsed(id);

function LabFrame({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section className="lab" aria-label={title}>
      <div className="lab-head"><span className="lab-tag">Interactive</span><h4>{title}</h4></div>
      {children}
      <p className="lab-note"><strong>Model limits:</strong> {note}</p>
    </section>
  );
}
const Out = ({ label, value, tone }: { label: string; value: string; tone?: 'ok' | 'bad' }) => (
  <div className={`out${tone ? ' out-' + tone : ''}`}><span>{label}</span><strong>{value}</strong></div>
);

/* ------------------------------------------------------------- Pressure */
export function PressureLab() {
  const [F, setF] = useState(500);
  const [A, setA] = useState(0.25);
  const P = F / A;
  const side = 40 + Math.sqrt(A) * 190;
  const arrows = Math.max(1, Math.round(F / 250));
  const dent = Math.min(26, 3 + Math.log10(Math.max(P, 10)) * 3.6);
  const set = (fn: (v: number) => void) => (v: number) => { fn(v); used('pressure'); };
  return (
    <LabFrame title="Force, area and pressure" note="An evenly spread force acting at right angles to a flat surface. Real contact pressures are rarely perfectly even.">
      <div className="lab-grid">
        <svg viewBox="0 0 320 210" className="lab-svg" role="img" aria-label={`A block pressing with ${F} newtons on ${A} square metres produces ${Math.round(P)} pascals`}>
          <rect x="0" y="0" width="320" height="210" fill="#eef6fd" rx="12" />
          {Array.from({ length: Math.min(arrows, 9) }, (_, i) => {
            const x = 160 - side / 2 + ((i + 0.5) * side) / Math.min(arrows, 9);
            return <g key={i} stroke="#f58220" strokeWidth="3" fill="#f58220"><line x1={x} y1={18} x2={x} y2={58} /><path d={`M${x - 6} 54 L${x} 66 L${x + 6} 54 Z`} /></g>;
          })}
          <rect x={160 - side / 2} y={68} width={side} height={62} rx="6" fill="#13315c" />
          <text x="160" y="104" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">{fmt(F)} N</text>
          <path d={`M10 132 H${160 - side / 2} q${side / 2} ${dent * 2} ${side} 0 H310 V200 H10 Z`} fill="#9fc3ea" />
          <text x="160" y="190" textAnchor="middle" fill="#0b2545" fontSize="12">Area {fmt(A, 3)} m² ({fmt(A * 10000)} cm²)</text>
        </svg>
        <div className="lab-controls">
          <Slider label="Force F" value={F} min={10} max={2000} step={10} unit="N" onChange={set(setF)} />
          <Slider label="Area A" value={A} min={0.005} max={1} step={0.005} unit="m²" onChange={set(setA)} />
          <div className="outs">
            <Out label="Pressure P = F / A" value={`${fmt(P)} Pa`} />
            <Out label="In hectopascals" value={`${fmt(P / 100, 1)} hPa`} />
            <Out label="Compared with sea-level air pressure" value={`${fmt((P / 101325) * 100, 1)} %`} />
          </div>
        </div>
      </div>
      <p className="small muted">Try it: halve the area and watch the pressure double. Then find two different combinations that give exactly 2,000 Pa.</p>
    </LabFrame>
  );
}

/* --------------------------------------------------- Wind components */
export function TrigLab() {
  const [w, setW] = useState(20);
  const [a, setA] = useState(30);
  const xw = w * Math.sin(rad(a)); const hw = w * Math.cos(rad(a));
  const set = (fn: (v: number) => void) => (v: number) => { fn(v); used('trig'); };
  const L = 40 + w * 2;
  const tipX = 160 + Math.sin(rad(a)) * L; const tipY = 150 - Math.cos(rad(a)) * L;
  return (
    <LabFrame title="Headwind and crosswind components" note="Steady wind with no gusts. The angle is measured between the wind direction and the runway direction.">
      <div className="lab-grid">
        <svg viewBox="0 0 320 210" className="lab-svg" role="img" aria-label={`Wind ${w} knots at ${a} degrees: crosswind ${xw.toFixed(1)}, headwind ${hw.toFixed(1)} knots`}>
          <rect width="320" height="210" fill="#eef6fd" rx="12" />
          <rect x="146" y="20" width="28" height="170" fill="#4a5563" rx="3" />
          {[40, 75, 110, 145].map((y) => <rect key={y} x="158.500" y={y} width="3" height="18" fill="#fff" />)}
          <line x1={tipX} y1={tipY} x2="160" y2="150" stroke="#0b2545" strokeWidth="4" markerEnd="url(#ah)" />
          <line x1={tipX} y1={tipY} x2="160" y2={tipY} stroke="#f58220" strokeWidth="3" strokeDasharray="5 4" />
          <line x1="160" y1={tipY} x2="160" y2="150" stroke="#12a594" strokeWidth="3" strokeDasharray="5 4" />
          <defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#0b2545" /></marker></defs>
          <text x="12" y="24" fontSize="12" fill="#0b2545" fontWeight="700">Wind {w} kt</text>
          <text x="12" y="42" fontSize="12" fill="#c2630f">Crosswind {xw.toFixed(1)} kt</text>
          <text x="12" y="60" fontSize="12" fill="#0d7f72">Headwind {hw.toFixed(1)} kt</text>
        </svg>
        <div className="lab-controls">
          <Slider label="Wind speed" value={w} min={0} max={50} unit="kt" onChange={set(setW)} />
          <Slider label="Angle between wind and runway" value={a} min={0} max={90} step={5} unit="°" onChange={set(setA)} />
          <div className="outs">
            <Out label="Crosswind = W × sin θ" value={`${xw.toFixed(1)} kt`} />
            <Out label="Headwind = W × cos θ" value={`${hw.toFixed(1)} kt`} />
          </div>
        </div>
      </div>
    </LabFrame>
  );
}

/* ------------------------------------------------------- Wind triangle */
export function windSolve(track: number, tas: number, windDir: number, windSpeed: number) {
  const ang = rad(windDir - track);
  const xw = windSpeed * Math.sin(ang);
  const hw = windSpeed * Math.cos(ang);
  const wca = deg(Math.asin(Math.max(-1, Math.min(1, xw / tas))));
  const gs = tas * Math.cos(rad(wca)) - hw;
  return { xw, hw, wca, heading: (track + wca + 360) % 360, gs };
}

export function WindLab() {
  const [track, setTrack] = useState(90);
  const [tas, setTas] = useState(120);
  const [wd, setWd] = useState(360);
  const [ws, setWs] = useState(30);
  const r = windSolve(track, tas, wd, ws);
  const set = (fn: (v: number) => void) => (v: number) => { fn(v); used('wind'); };
  const pt = (bearing: number, len: number) => [160 + Math.sin(rad(bearing)) * len, 108 - Math.cos(rad(bearing)) * len];
  const [tx, ty] = pt(track, 78); const [hx, hy] = pt(r.heading, 78); const [wx, wy] = pt(wd, 88);
  const [wx2, wy2] = pt(wd, 88 - Math.min(60, ws * 1.3 + 8));
  return (
    <LabFrame title="Wind triangle: heading to hold a track" note="Steady wind, constant true airspeed, flat Earth. Variation and deviation are ignored, so all directions are true.">
      <div className="lab-grid">
        <svg viewBox="0 0 320 216" className="lab-svg" role="img" aria-label={`Track ${track}, heading ${Math.round(r.heading)}, groundspeed ${Math.round(r.gs)} knots`}>
          <rect width="320" height="216" fill="#eef6fd" rx="12" />
          <circle cx="160" cy="108" r="92" fill="#fff" stroke="#c9dcee" strokeWidth="2" />
          {['N', 'E', 'S', 'W'].map((c, i) => { const [x, y] = pt(i * 90, 80); return <text key={c} x={x} y={y + 4} textAnchor="middle" fontSize="11" fill="#5b6b7f">{c}</text>; })}
          <line x1="160" y1="108" x2={tx} y2={ty} stroke="#12a594" strokeWidth="4" />
          <line x1="160" y1="108" x2={hx} y2={hy} stroke="#0b2545" strokeWidth="3" strokeDasharray="6 4" />
          <line x1={wx} y1={wy} x2={wx2} y2={wy2} stroke="#f58220" strokeWidth="4" markerEnd="url(#wh)" />
          <defs><marker id="wh" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#f58220" /></marker></defs>
          <text x="10" y="18" fontSize="11" fill="#0d7f72" fontWeight="700">— Track</text>
          <text x="10" y="33" fontSize="11" fill="#0b2545" fontWeight="700">- - Heading</text>
          <text x="10" y="48" fontSize="11" fill="#c2630f" fontWeight="700">→ Wind</text>
        </svg>
        <div className="lab-controls">
          <Slider label="Desired track" value={track} min={0} max={359} unit="°" onChange={set(setTrack)} />
          <Slider label="True airspeed" value={tas} min={80} max={250} step={5} unit="kt" onChange={set(setTas)} />
          <Slider label="Wind from" value={wd} min={1} max={360} step={5} unit="°" onChange={set(setWd)} />
          <Slider label="Wind speed" value={ws} min={0} max={60} unit="kt" onChange={set(setWs)} />
          <div className="outs">
            <Out label="Wind correction angle" value={`${Math.abs(r.wca).toFixed(1)}° ${r.wca > 0.05 ? 'right' : r.wca < -0.05 ? 'left' : ''}`} />
            <Out label="Heading to steer" value={`${String(Math.round(r.heading) % 360).padStart(3, '0')}°`} />
            <Out label="Groundspeed" value={`${Math.round(r.gs)} kt`} />
          </div>
        </div>
      </div>
    </LabFrame>
  );
}

/* ----------------------------------------------------------------- Lift */
export function liftModel(v: number, aoa: number, altFt: number, S = 16) {
  const rho = 1.225 * Math.pow(1 - 6.87535e-6 * altFt, 4.2561);
  const stalled = aoa > 15;
  const cl = stalled ? Math.max(0.5, 1.65 - 0.14 * (aoa - 15)) : 0.3 + 0.09 * aoa;
  return { rho, cl, stalled, lift: 0.5 * rho * v * v * S * cl };
}

export function LiftLab() {
  const [v, setV] = useState(50);
  const [aoa, setAoa] = useState(1.5);
  const [alt, setAlt] = useState(0);
  const m = liftModel(v, aoa, alt);
  const weight = 1100 * 9.81;
  const ratio = m.lift / weight;
  const set = (fn: (x: number) => void) => (x: number) => { fn(x); used('lift'); };
  return (
    <LabFrame title="Lift: speed, angle of attack and air density" note="Lift coefficient rises linearly to a critical angle of 15°, then drops. Real wings have curved lift curves, and their stall angle depends on shape, flaps and Reynolds number. Compressibility is ignored. Wing area 16 m², aircraft mass 1,100 kg.">
      <div className="lab-grid">
        <svg viewBox="0 0 320 210" className="lab-svg" role="img" aria-label={`Lift ${Math.round(m.lift)} newtons, ${m.stalled ? 'wing stalled' : 'airflow attached'}`}>
          <rect width="320" height="210" fill="#eef6fd" rx="12" />
          {[60, 85, 110, 135].map((y, i) => <path key={y} d={`M10 ${y} C 90 ${y}, 120 ${y - (m.stalled ? 2 : aoa * (i < 2 ? 1.6 : 0.6))}, 170 ${y - (i < 2 ? 12 : -4)} S 260 ${y + (m.stalled ? (i < 2 ? -18 + i * 30 : 6) : aoa * 2.2)}, 310 ${y + (m.stalled ? 4 : aoa * 2.6)}`} fill="none" stroke={m.stalled && i < 2 ? '#d6453d' : '#3a8dde'} strokeWidth="2" strokeDasharray={m.stalled && i < 2 ? '4 5' : undefined} opacity="0.75" />)}
          <g transform={`rotate(${-aoa} 165 100)`}>
            <path d="M95 100 C 110 78, 190 76, 240 98 C 190 106, 120 108, 95 100 Z" fill="#13315c" />
          </g>
          <line x1="165" y1="92" x2="165" y2={92 - Math.min(72, ratio * 46)} stroke="#12a594" strokeWidth="5" />
          <text x="172" y="32" fontSize="12" fill="#0d7f72" fontWeight="700">Lift</text>
          <line x1="165" y1="108" x2="165" y2="154" stroke="#f58220" strokeWidth="5" />
          <text x="172" y="160" fontSize="12" fill="#c2630f" fontWeight="700">Weight</text>
          {m.stalled && <text x="160" y="198" textAnchor="middle" fontSize="15" fill="#d6453d" fontWeight="800">STALL — airflow separated</text>}
        </svg>
        <div className="lab-controls">
          <Slider label="True airspeed" value={v} min={20} max={80} unit="m/s" onChange={set(setV)} />
          <Slider label="Angle of attack" value={aoa} min={-2} max={20} step={0.5} unit="°" onChange={set(setAoa)} />
          <Slider label="Altitude (ISA)" value={alt} min={0} max={12000} step={500} unit="ft" onChange={set(setAlt)} />
          <div className="outs">
            <Out label="Air density ρ" value={`${m.rho.toFixed(3)} kg/m³`} />
            <Out label="Lift coefficient C_L" value={m.cl.toFixed(2)} tone={m.stalled ? 'bad' : undefined} />
            <Out label="Lift" value={`${fmt(m.lift)} N`} />
            <Out label="Lift ÷ weight" value={`${ratio.toFixed(2)}${Math.abs(ratio - 1) < 0.04 ? ' — level flight' : ratio > 1 ? ' — accelerating upward' : ' — sinking'}`} tone={Math.abs(ratio - 1) < 0.04 ? 'ok' : undefined} />
          </div>
        </div>
      </div>
      <p className="small muted">Try it: balance lift and weight at 50 m/s, then slow to 35 m/s and find the new angle of attack. Keep slowing down until the wing stalls.</p>
    </LabFrame>
  );
}

/* ------------------------------------------------------------ Altimeter */
export function AltimeterLab() {
  const [setP, setSetP] = useState(1013);
  const [actual, setActual] = useState(1013);
  const [trueAlt, setTrueAlt] = useState(3000);
  const indicated = trueAlt + (setP - actual) * 27;
  const err = indicated - trueAlt;
  const set = (fn: (x: number) => void) => (x: number) => { fn(x); used('altimeter'); };
  const hand = (frac: number, len: number, wdt: number, color: string) => {
    const a = frac * 2 * Math.PI;
    return <line x1="110" y1="110" x2={110 + Math.sin(a) * len} y2={110 - Math.cos(a) * len} stroke={color} strokeWidth={wdt} strokeLinecap="round" />;
  };
  return (
    <LabFrame title="Altimeter setting and pressure error" note="Uses 27 ft per hPa, valid near sea level, and ignores temperature error. Real altimeters also have instrument and position errors.">
      <div className="lab-grid">
        <svg viewBox="0 0 220 220" className="lab-svg" role="img" aria-label={`Altimeter indicating ${Math.round(indicated)} feet`}>
          <circle cx="110" cy="110" r="104" fill="#0b2545" />
          <circle cx="110" cy="110" r="94" fill="#13315c" />
          {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * 2 * Math.PI; return <text key={i} x={110 + Math.sin(a) * 76} y={115 - Math.cos(a) * 76} textAnchor="middle" fill="#fff" fontSize="15" fontWeight="700">{i}</text>; })}
          <rect x="132" y="100" width="54" height="20" rx="4" fill="#fff" /><text x="159" y="115" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0b2545">{setP}</text>
          {hand((((indicated % 10000) + 10000) % 10000) / 10000, 46, 6, '#f58220')}
          {hand((((indicated % 1000) + 1000) % 1000) / 1000, 70, 3.5, '#fff')}
          <circle cx="110" cy="110" r="6" fill="#fff" />
          <text x="110" y="160" textAnchor="middle" fill="#9fc3ea" fontSize="11">ALT · feet × 100 / × 1000</text>
        </svg>
        <div className="lab-controls">
          <Slider label="Subscale setting (what you dialled)" value={setP} min={980} max={1040} unit="hPa" onChange={set(setSetP)} />
          <Slider label="Actual QNH" value={actual} min={980} max={1040} unit="hPa" onChange={set(setActual)} />
          <Slider label="True altitude of the aircraft" value={trueAlt} min={0} max={9000} step={100} unit="ft" onChange={set(setTrueAlt)} />
          <div className="outs">
            <Out label="Indicated altitude" value={`${fmt(indicated)} ft`} />
            <Out label="Error" value={err === 0 ? 'None — setting is correct' : `${fmt(Math.abs(err))} ft ${err > 0 ? 'over-reading: you are LOWER than indicated' : 'under-reading: you are higher than indicated'}`} tone={err > 0 ? 'bad' : err === 0 ? 'ok' : undefined} />
          </div>
        </div>
      </div>
    </LabFrame>
  );
}

/* ------------------------------------------------------ Mass and balance */
export const MB = { empty: { m: 700, arm: 2.4 }, front: 2.3, rear: 3.1, bag: 3.6, fuelArm: 2.45, fuelDensity: 0.72, mtom: 1150, fwd: 2.35, aft: 2.62 };
export function mbSolve(front: number, rear: number, bag: number, fuelL: number) {
  const fuel = fuelL * MB.fuelDensity;
  const mass = MB.empty.m + front + rear + bag + fuel;
  const moment = MB.empty.m * MB.empty.arm + front * MB.front + rear * MB.rear + bag * MB.bag + fuel * MB.fuelArm;
  const cg = moment / mass;
  return { mass, moment, cg, overweight: mass > MB.mtom, fwdOut: cg < MB.fwd, aftOut: cg > MB.aft };
}

export function MassBalanceLab() {
  const [front, setFront] = useState(160);
  const [rear, setRear] = useState(0);
  const [bag, setBag] = useState(10);
  const [fuel, setFuel] = useState(100);
  const r = mbSolve(front, rear, bag, fuel);
  const ok = !r.overweight && !r.fwdOut && !r.aftOut;
  const set = (fn: (x: number) => void) => (x: number) => { fn(x); used('massbalance'); };
  const X = (cg: number) => 40 + ((cg - 2.25) / 0.5) * 250;
  const Y = (m: number) => 180 - ((m - 650) / 600) * 160;
  return (
    <LabFrame title="Loading a four-seat trainer" note="Fictional aircraft data for teaching only, with a simplified rectangular envelope. Real envelopes are published in the approved flight manual and often narrow at high mass.">
      <div className="lab-grid">
        <svg viewBox="0 0 320 210" className="lab-svg" role="img" aria-label={`Mass ${Math.round(r.mass)} kilograms, centre of gravity ${r.cg.toFixed(3)} metres, ${ok ? 'within limits' : 'outside limits'}`}>
          <rect width="320" height="210" fill="#eef6fd" rx="12" />
          <rect x={X(MB.fwd)} y={Y(MB.mtom)} width={X(MB.aft) - X(MB.fwd)} height={Y(650) - Y(MB.mtom)} fill="#d7f3ee" stroke="#12a594" strokeWidth="2" />
          <text x={(X(MB.fwd) + X(MB.aft)) / 2} y={Y(900)} textAnchor="middle" fontSize="11" fill="#0d7f72">Approved envelope</text>
          <line x1="40" y1="180" x2="290" y2="180" stroke="#5b6b7f" /><line x1="40" y1="20" x2="40" y2="180" stroke="#5b6b7f" />
          <text x="165" y="200" textAnchor="middle" fontSize="11" fill="#5b6b7f">CG position (m aft of datum)</text>
          <text x="14" y="100" fontSize="11" fill="#5b6b7f" transform="rotate(-90 14 100)" textAnchor="middle">Mass (kg)</text>
          <text x={X(MB.fwd)} y="16" textAnchor="middle" fontSize="10" fill="#5b6b7f">{MB.fwd}</text><text x={X(MB.aft)} y="16" textAnchor="middle" fontSize="10" fill="#5b6b7f">{MB.aft}</text>
          <circle cx={Math.max(44, Math.min(286, X(r.cg)))} cy={Math.max(22, Math.min(178, Y(r.mass)))} r="7" fill={ok ? '#12a594' : '#d6453d'} stroke="#fff" strokeWidth="2" />
        </svg>
        <div className="lab-controls">
          <Slider label="Front seats (arm 2.30 m)" value={front} min={50} max={200} step={5} unit="kg" onChange={set(setFront)} />
          <Slider label="Rear seats (arm 3.10 m)" value={rear} min={0} max={180} step={5} unit="kg" onChange={set(setRear)} />
          <Slider label="Baggage (arm 3.60 m)" value={bag} min={0} max={60} step={5} unit="kg" onChange={set(setBag)} />
          <Slider label="Fuel (0.72 kg/L, arm 2.45 m)" value={fuel} min={10} max={150} step={5} unit="L" onChange={set(setFuel)} />
          <div className="outs">
            <Out label={`Total mass (limit ${fmt(MB.mtom)} kg)`} value={`${fmt(r.mass, 1)} kg`} tone={r.overweight ? 'bad' : undefined} />
            <Out label="Total moment" value={`${fmt(r.moment, 1)} kg·m`} />
            <Out label={`CG (limits ${MB.fwd}–${MB.aft} m)`} value={`${r.cg.toFixed(3)} m`} tone={r.fwdOut || r.aftOut ? 'bad' : undefined} />
            <Out label="Status" value={ok ? 'Within limits' : [r.overweight && 'Overweight', r.fwdOut && 'CG too far forward', r.aftOut && 'CG too far aft'].filter(Boolean).join(' · ')} tone={ok ? 'ok' : 'bad'} />
          </div>
        </div>
      </div>
    </LabFrame>
  );
}

/* --------------------------------------------------------------- Controls */
const CONTROLS = [
  { id: 'ailerons', name: 'Ailerons', axis: 'Roll — about the longitudinal axis', text: 'Hinged on the outer trailing edge of each wing. They move in opposite directions: one up, one down. The wing with the lowered aileron gains lift and rises, rolling the aircraft.', input: 'Control wheel or stick, left and right' },
  { id: 'elevator', name: 'Elevator', axis: 'Pitch — about the lateral axis', text: 'Hinged on the horizontal tail. Raising it pushes the tail down and the nose up, increasing the angle of attack.', input: 'Control column, forward and back' },
  { id: 'rudder', name: 'Rudder', axis: 'Yaw — about the vertical axis', text: 'Hinged on the vertical fin. It keeps the aircraft coordinated in turns and straight on the runway.', input: 'Rudder pedals' },
  { id: 'flaps', name: 'Flaps', axis: 'Lift and drag', text: 'On the inner trailing edge of the wing. They increase lift and drag, reduce stall speed and allow a steeper, slower approach.', input: 'Flap lever or switch' },
  { id: 'trim', name: 'Trim tab', axis: 'Control force', text: 'A small adjustable surface, usually on the elevator. It holds the elevator in position so the pilot does not need to push or pull continuously.', input: 'Trim wheel or switch' },
] as const;

export function ControlsLab() {
  const [sel, setSel] = useState<(typeof CONTROLS)[number]['id']>('ailerons');
  const c = CONTROLS.find((x) => x.id === sel)!;
  const pick = (id: typeof sel) => { setSel(id); used('controls'); };
  const part = (id: typeof sel, d: string) => <path d={d} className={`ctl-part${sel === id ? ' on' : ''}`} onClick={() => pick(id)} />;
  return (
    <LabFrame title="Aircraft control surfaces" note="A simplified top view of a conventional light aircraft. Real aircraft differ in layout; some combine or add surfaces.">
      <div className="lab-grid">
        <svg viewBox="0 0 320 240" className="lab-svg" role="img" aria-label={`Aircraft diagram with ${c.name} highlighted`}>
          <rect width="320" height="240" fill="#eef6fd" rx="12" />
          <path d="M160 14 C172 30 172 60 170 96 L168 196 C166 210 154 210 152 196 L150 96 C148 60 148 30 160 14 Z" fill="#fff" stroke="#8fa5bd" strokeWidth="2" />
          <path d="M20 96 L150 84 L170 84 L300 96 L300 112 L170 116 L150 116 L20 112 Z" fill="#fff" stroke="#8fa5bd" strokeWidth="2" />
          <path d="M108 190 L152 184 L168 184 L212 190 L212 204 L168 206 L152 206 L108 204 Z" fill="#fff" stroke="#8fa5bd" strokeWidth="2" />
          {part('ailerons', 'M22 106 L84 104 L84 113 L22 112 Z M236 104 L298 106 L298 112 L236 113 Z')}
          {part('flaps', 'M90 104 L146 102 L146 115 L90 113 Z M174 102 L230 104 L230 113 L174 115 Z')}
          {part('elevator', 'M110 198 L150 196 L150 205 L110 204 Z M170 196 L210 198 L210 204 L170 205 Z')}
          {part('rudder', 'M157 196 L163 196 L163 226 L157 226 Z')}
          {part('trim', 'M176 201 L196 201.500 L196 205 L176 205 Z')}
        </svg>
        <div className="lab-controls">
          <div className="pill-row" role="group" aria-label="Choose a control surface">
            {CONTROLS.map((x) => <button key={x.id} type="button" className={`pill${sel === x.id ? ' on' : ''}`} aria-pressed={sel === x.id} onClick={() => pick(x.id)}>{x.name}</button>)}
          </div>
          <div className="outs">
            <Out label="Effect" value={c.axis} />
            <Out label="Pilot input" value={c.input} />
          </div>
          <p>{c.text}</p>
        </div>
      </div>
    </LabFrame>
  );
}

/* --------------------------------------------------------- Generic formula */
export function FormulaLab({ formula }: { formula: Formula }) {
  const [vals, setVals] = useState<Record<string, number>>(() => Object.fromEntries(formula.vars.map((v) => [v.sym, v.def])));
  const result = formula.compute(vals);
  const ref = formula.compute(Object.fromEntries(formula.vars.map((v) => [v.sym, v.def])));
  const ratio = ref !== 0 ? result / ref : 1;
  const digits = Math.abs(result) >= 1000 ? 0 : Math.abs(result) >= 10 ? 1 : 3;
  return (
    <LabFrame title={`${formula.name}: ${formula.expr}`} note={formula.valid}>
      <div className="lab-controls wide">
        {formula.vars.map((v) => (
          <Slider key={v.sym} label={`${v.name} (${v.sym})`} value={vals[v.sym]} min={v.min} max={v.max} step={v.step ?? 1} unit={v.unit}
            onChange={(x) => { setVals({ ...vals, [v.sym]: x }); used(`formula:${formula.id}`); }} />
        ))}
        <div className="outs">
          <Out label={`${formula.out.name} (${formula.out.sym})`} value={`${fmt(result, digits)} ${formula.out.unit}`} />
        </div>
        <div className="ratio" aria-hidden="true"><div className="ratio-fill" style={{ width: `${Math.max(2, Math.min(100, Math.abs(ratio) * 50))}%` }} /><div className="ratio-mark" /></div>
        <p className="small muted">The bar compares the result with the starting example ({fmt(ref, digits)} {formula.out.unit}, marked at the centre).</p>
      </div>
    </LabFrame>
  );
}

/* ---------------------------------------------------------------- Explorer */
/** Select-and-read interactive for classification topics (cloud types, airspace classes, right-of-way cases). */
export function ExplorerLab({ data }: { data: Explorer }) {
  const [i, setI] = useState(0);
  const item = data.items[i];
  return (
    <LabFrame title={data.title} note={data.note}>
      <div className="pill-row" role="group" aria-label={`Choose an item: ${data.title}`}>
        {data.items.map((x, n) => <button key={x.name} type="button" className={`pill${n === i ? ' on' : ''}`} aria-pressed={n === i} onClick={() => { setI(n); used(`explore:${data.id}`); }}>{x.name}</button>)}
      </div>
      <div className="explorer" aria-live="polite">
        <h4>{item.name}</h4>
        <div className="outs">{item.facts.map(([k, v]) => <Out key={k} label={k} value={v} />)}</div>
        <p>{item.text}</p>
      </div>
    </LabFrame>
  );
}

export function Lab({ id }: { id: LabKey }) {
  if (id.startsWith('explore:')) { const e = explorerById(id.slice('explore:'.length)); return e ? <ExplorerLab data={e} /> : null; }
  switch (id) {
    case 'pressure': return <PressureLab />;
    case 'trig': return <TrigLab />;
    case 'wind': return <WindLab />;
    case 'lift': return <LiftLab />;
    case 'altimeter': return <AltimeterLab />;
    case 'massbalance': return <MassBalanceLab />;
    case 'controls': return <ControlsLab />;
    default: { const f = formulaById(id.slice('formula:'.length)); return f ? <FormulaLab formula={f} /> : null; }
  }
}
