// Touch flight controls: an analog joystick (fixed or floating) and a throttle lever that stays where it is set.
// Each control captures its own pointer, so two thumbs work at the same time; every way a touch can end
// (lift, cancel, lost capture, app switch, rotation, pause, unmount) returns the stick to neutral.
import { useEffect, useRef, useState } from 'react';
import { createStick, leverValue, type StickController } from './joystick';

const BASE = 132; // stick base diameter, CSS px

export function TouchStick({ mode, side, deadZone, sensitivity, heading, reducedMotion, onStick }: {
  mode: 'fixed' | 'floating'; side: 'left' | 'right'; deadZone: number; sensitivity: number;
  /** Also use the horizontal axis (heading correction on crosswind and navigation missions). */
  heading: boolean; reducedMotion: boolean; onStick: (x: number, y: number) => void;
}) {
  const zone = useRef<HTMLDivElement>(null);
  const ctl = useRef<StickController | null>(null);
  const out = useRef(onStick); out.current = onStick;
  const [v, setV] = useState({ kx: 0, ky: 0, active: false, cx: 0, cy: 0 });

  useEffect(() => {
    const el = zone.current; if (!el) return;
    const home = () => { const r = el.getBoundingClientRect(); return mode === 'fixed' ? { x: r.width / 2, y: r.height / 2 } : { x: side === 'left' ? BASE / 2 + 18 : r.width - BASE / 2 - 18, y: r.height - BASE / 2 - 18 }; };
    const h = home();
    const c = createStick({
      mode, centre: h, grab: BASE * 0.75, cfg: { radius: BASE * 0.4, deadZone, sensitivity },
      onChange: (o) => { const cc = c.centre(); setV({ kx: o.kx, ky: o.ky, active: o.active, cx: cc.x, cy: cc.y }); out.current(heading ? o.x : 0, o.y); },
    });
    ctl.current = c;
    setV({ kx: 0, ky: 0, active: false, cx: h.x, cy: h.y });
    const local = (e: PointerEvent) => { const r = el.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] as const; };
    const down = (e: PointerEvent) => {
      const [x, y] = local(e);
      if (c.down(e.pointerId, x, y)) { e.preventDefault(); try { el.setPointerCapture(e.pointerId); } catch { /* optional */ } }
    };
    const move = (e: PointerEvent) => { if (e.pointerId === c.pointer) { e.preventDefault(); const [x, y] = local(e); c.move(e.pointerId, x, y); } };
    const up = (e: PointerEvent) => c.up(e.pointerId);
    const reset = () => c.reset();
    const onVis = () => { if (document.hidden) reset(); };
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('lostpointercapture', up);
    window.addEventListener('blur', reset); window.addEventListener('orientationchange', reset); window.addEventListener('resize', reset);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); el.removeEventListener('lostpointercapture', up);
      window.removeEventListener('blur', reset); window.removeEventListener('orientationchange', reset); window.removeEventListener('resize', reset);
      document.removeEventListener('visibilitychange', onVis);
      c.reset(); out.current(0, 0); ctl.current = null;
    };
  }, [mode, side, deadZone, sensitivity, heading]);

  return (
    <div ref={zone} className={`stick-zone ${mode} ${side}`} data-testid="stick-zone" role="group"
      aria-label={`Flight joystick. Drag up to climb, down to descend${heading ? ', sideways for heading correction' : ''}. Keyboard: arrow keys.`}>
      <div className={`stick-base${v.active ? ' active' : ''}${mode === 'floating' && !v.active ? ' idle' : ''}`} style={{ left: v.cx - BASE / 2, top: v.cy - BASE / 2, width: BASE, height: BASE }} aria-hidden="true">
        <span className="stick-ring" />
        {heading ? <span className="stick-cross" /> : <span className="stick-axis" />}
        <span className={`stick-knob${v.active || reducedMotion ? '' : ' spring'}`} style={{ transform: `translate(${v.kx}px, ${v.ky}px)` }} />
      </div>
    </div>
  );
}

export function ThrottleLever({ side, read, onSet }: { side: 'left' | 'right'; read: () => number; onSet: (v: number) => void }) {
  const track = useRef<HTMLDivElement>(null);
  const held = useRef<number | null>(null);
  const [val, setVal] = useState(() => read());

  // Follows the real throttle (keyboard, take-off idle, restart) whenever the lever is not being held.
  useEffect(() => {
    const id = window.setInterval(() => { if (held.current === null) setVal(read()); }, 150);
    return () => window.clearInterval(id);
  }, [read]);

  const set = (clientY: number) => {
    const r = track.current?.getBoundingClientRect(); if (!r) return;
    const v = leverValue(clientY, r.top, r.height);
    setVal(v); onSet(v);
  };
  const pct = Math.round(val * 100);
  return (
    <div className={`throttle ${side}`}>
      <div ref={track} className="throttle-track" role="slider" tabIndex={0} aria-label="Throttle" aria-orientation="vertical" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-valuetext={`${pct} percent`}
        onPointerDown={(e) => { if (held.current !== null) return; e.preventDefault(); held.current = e.pointerId; try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* optional */ } set(e.clientY); }}
        onPointerMove={(e) => { if (e.pointerId === held.current) set(e.clientY); }}
        onPointerUp={(e) => { if (e.pointerId === held.current) held.current = null; }}
        onPointerCancel={(e) => { if (e.pointerId === held.current) held.current = null; }}
        onLostPointerCapture={(e) => { if (e.pointerId === held.current) held.current = null; }}
        onKeyDown={(e) => { const d = e.key === 'ArrowUp' || e.key === 'PageUp' ? 0.1 : e.key === 'ArrowDown' || e.key === 'PageDown' ? -0.1 : 0; if (d) { e.preventDefault(); const v = Math.max(0, Math.min(1, val + d)); setVal(v); onSet(v); } }}>
        <span className="throttle-fill" style={{ height: `calc((100% - 12px) * ${val.toFixed(3)})` }} />
        <span className="throttle-grip" style={{ bottom: `calc(4px + (100% - 36px) * ${val.toFixed(3)})` }} />
      </div>
      <span className="throttle-label" aria-hidden="true">THR {pct}%</span>
    </div>
  );
}
