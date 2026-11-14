import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { GameAircraft } from '../types';
import { buildAircraft, disposeAircraft, type BuiltAircraft } from './build';
import { partsFor, type PartId } from './parts';
import { Btn, Chip, Icon } from '../components/ui';

interface Controls { zoom(factor: number): void; reset(): void; auto(on: boolean): void; highlight(id: PartId | null): void }
interface Props { aircraft: GameAircraft; color: string; reducedMotion: boolean; unlockXp?: number; onClose(): void }

const MIN_POLAR = 0.25;
const MAX_POLAR = 1.5;

/**
 * Optional 3D viewer. Loaded on demand (React.lazy) so the three.js code is only downloaded when a user opens it.
 * Drag to rotate, pinch or scroll to zoom, tap a component to read what it does. Arrow keys and +/- work when the view
 * is focused, and every component is also reachable from the list below it.
 */
export default function Hangar3D({ aircraft, color, reducedMotion, unlockXp, onClose }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const ctl = useRef<Controls | null>(null);
  const [selected, setSelected] = useState<PartId | null>(null);
  const [failed, setFailed] = useState(false);
  const [auto, setAuto] = useState(!reducedMotion);
  const parts = useMemo(() => partsFor(aircraft.kind, aircraft.highWing), [aircraft.kind, aircraft.highWing]);
  const info = parts.find((p) => p.id === selected);
  const pick = useRef(setSelected);
  pick.current = setSelected;
  const autoStart = useRef(!reducedMotion);

  useEffect(() => {
    const box = stage.current;
    if (!box) return;
    // A fresh canvas for every mount: a context that was released on unmount cannot be reused.
    const cv = document.createElement('canvas');
    cv.tabIndex = 0;
    cv.setAttribute('aria-label', `Interactive 3D model of ${aircraft.name}. Drag to rotate, pinch or scroll to zoom, tap a component to learn about it. Arrow keys rotate and plus and minus zoom.`);
    box.prepend(cv);
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'low-power' }); } catch { cv.remove(); setFailed(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 500);
    let built: BuiltAircraft = buildAircraft(aircraft, color);
    scene.add(built.group);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x9fb4cc, 1.15));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6); sun.position.set(-6, 10, 8); scene.add(sun);
    const rim = new THREE.DirectionalLight(0x9fc3ea, 0.7); rim.position.set(8, 3, -8); scene.add(rim);
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(1, 40), new THREE.MeshBasicMaterial({ color: 0x0b2545, transparent: true, opacity: 0.16, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.scale.set(built.radius * 1.05, built.radius * 0.75, 1); shadow.position.y = built.groundY - 0.02;
    scene.add(shadow);

    const home = { az: -0.7, pol: 1.12, dist: built.radius * 2.7 };
    const view = { ...home };
    const minD = built.radius * 1.25; const maxD = built.radius * 6.5;
    let dirty = true; let autoOn = autoStart.current; let lastTouch = -1e9; let visible = true; let raf = 0; let last = performance.now(); let alive = true;

    const place = () => {
      camera.position.set(Math.cos(view.az) * Math.sin(view.pol) * view.dist, Math.cos(view.pol) * view.dist, Math.sin(view.az) * Math.sin(view.pol) * view.dist);
      camera.lookAt(0, 0, 0);
    };
    /** Brings the camera and scene matrices up to date, so picking is exact even if no frame has been drawn since the last move. */
    const sync = () => { place(); scene.updateMatrixWorld(true); camera.updateMatrixWorld(true); };
    const resize = () => {
      const w = box.clientWidth; const h = box.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      // Frame the whole aircraft: on a tall, narrow screen the camera has to be further away.
      const fit = built.radius * 2.8 / Math.min(1, (w / h) * 1.1);
      if (Math.abs(view.dist - home.dist) < 1e-6) view.dist = fit;
      home.dist = fit; dirty = true;
    };
    const ro = new ResizeObserver(resize); ro.observe(box); resize();
    const io = new IntersectionObserver((e) => { visible = e[0]?.isIntersecting ?? true; }, { threshold: 0.05 }); io.observe(box);

    const highlight = (id: PartId | null) => {
      for (const [pid, meshes] of built.parts) for (const m of meshes) {
        const mat = m.material as THREE.MeshStandardMaterial;
        mat.emissive.setHex(pid === id ? 0x1f7be0 : 0x000000); mat.emissiveIntensity = pid === id ? 0.75 : 0;
      }
      dirty = true;
    };
    ctl.current = {
      zoom: (f) => { view.dist = Math.min(maxD, Math.max(minD, view.dist * f)); dirty = true; },
      reset: () => { Object.assign(view, home); dirty = true; },
      auto: (on) => { autoOn = on; dirty = true; },
      highlight,
    };

    const ray = new THREE.Raycaster(); const ndc = new THREE.Vector2();
    const select = (clientX: number, clientY: number) => {
      sync();
      const r = cv.getBoundingClientRect();
      ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObject(built.group, true)[0];
      pick.current((hit?.object.userData.part as PartId | undefined) ?? null);
    };

    const pointers = new Map<number, { x: number; y: number }>();
    let travelled = 0; let downAt = 0; let pinch = 0;
    const onDown = (e: PointerEvent) => {
      try { cv.setPointerCapture(e.pointerId); } catch { /* the pointer already ended */ } pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) { travelled = 0; downAt = performance.now(); }
      if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); }
      lastTouch = performance.now();
    };
    const onMove = (e: PointerEvent) => {
      const p = pointers.get(e.pointerId); if (!p) return;
      const dx = e.clientX - p.x; const dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
      lastTouch = performance.now();
      if (pointers.size === 1) {
        travelled += Math.abs(dx) + Math.abs(dy);
        view.az -= dx * 0.008; view.pol = Math.min(MAX_POLAR, Math.max(MIN_POLAR, view.pol - dy * 0.006)); dirty = true;
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch > 0 && d > 0) { view.dist = Math.min(maxD, Math.max(minD, view.dist * (pinch / d))); dirty = true; }
        pinch = d; travelled += 10;
      }
    };
    const onUp = (e: PointerEvent) => {
      const wasOne = pointers.size === 1; pointers.delete(e.pointerId);
      if (wasOne && travelled < 6 && performance.now() - downAt < 400) select(e.clientX, e.clientY);
      pinch = 0;
    };
    const onWheel = (e: WheelEvent) => { e.preventDefault(); view.dist = Math.min(maxD, Math.max(minD, view.dist * Math.exp(e.deltaY * 0.0012))); lastTouch = performance.now(); dirty = true; };
    const onKey = (e: KeyboardEvent) => {
      const k = e.key; let used = true;
      if (k === 'ArrowLeft') view.az += 0.12; else if (k === 'ArrowRight') view.az -= 0.12;
      else if (k === 'ArrowUp') view.pol = Math.max(MIN_POLAR, view.pol - 0.08); else if (k === 'ArrowDown') view.pol = Math.min(MAX_POLAR, view.pol + 0.08);
      else if (k === '+' || k === '=') view.dist = Math.max(minD, view.dist / 1.15); else if (k === '-') view.dist = Math.min(maxD, view.dist * 1.15);
      else used = false;
      if (used) { e.preventDefault(); lastTouch = performance.now(); dirty = true; }
    };
    cv.addEventListener('pointerdown', onDown); cv.addEventListener('pointermove', onMove); cv.addEventListener('pointerup', onUp); cv.addEventListener('pointercancel', onUp);
    cv.addEventListener('wheel', onWheel, { passive: false }); cv.addEventListener('keydown', onKey);

    const frame = (now: number) => {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (document.hidden || !visible) return;
      let moving = false;
      if (!reducedMotion) {
        if (autoOn && now - lastTouch > 2500 && pointers.size === 0) { view.az += dt * 0.3; moving = true; }
        for (const s of built.spinners) { s.rotation.x += dt * 38; moving = true; }
      }
      if (moving || dirty) { place(); renderer.render(scene, camera); dirty = false; }
    };
    // Development-only handle so automated browser tests can read the camera and project parts to the screen.
    if (import.meta.env.DEV) (window as unknown as { __h3d?: unknown }).__h3d = { view, home, camera, built, project: (id: PartId) => { sync(); const m = built.parts.get(id)?.[0]; if (!m) return null; const v = new THREE.Vector3(); new THREE.Box3().setFromObject(m).getCenter(v); v.project(camera); const r = cv.getBoundingClientRect(); return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height }; } };
    place(); raf = requestAnimationFrame(frame);

    return () => {
      alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      cv.removeEventListener('pointerdown', onDown); cv.removeEventListener('pointermove', onMove); cv.removeEventListener('pointerup', onUp); cv.removeEventListener('pointercancel', onUp);
      cv.removeEventListener('wheel', onWheel); cv.removeEventListener('keydown', onKey);
      disposeAircraft(built); shadow.geometry.dispose(); (shadow.material as THREE.Material).dispose();
      renderer.dispose(); renderer.forceContextLoss(); cv.remove();
      ctl.current = null;
      built = null as unknown as BuiltAircraft;
    };
    // The scene is rebuilt only when the aircraft or livery changes; the other props are read through refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aircraft.id, color]);

  useEffect(() => { ctl.current?.highlight(selected); }, [selected, aircraft.id, color]);
  useEffect(() => { setSelected(null); }, [aircraft.id]);
  useEffect(() => { autoStart.current = auto; ctl.current?.auto(auto); }, [auto]);

  return (
    <section className="card h3d" aria-label={`3D view of ${aircraft.name}`}>
      <div className="card-head">
        <div><h2>{aircraft.name}</h2><p className="small muted">{aircraft.cls} · game speed range {aircraft.minKt}–{aircraft.maxKt} kt</p></div>
        <div className="row gap wrap">{unlockXp ? <Chip><Icon name="lock" size={12} /> Preview · unlocks at {unlockXp} XP</Chip> : null}<Btn small kind="ghost" icon="close" onClick={onClose}>Close 3D view</Btn></div>
      </div>
      <p className="small">{aircraft.blurb}</p>

      <div className="h3d-stage" ref={stage}>
        {failed && <div className="h3d-fallback" role="status"><Icon name="fly" size={28} /><p>The 3D view is not available on this device or browser. You can still read about every component below.</p></div>}
        {!failed && (
          <div className="h3d-tools" role="group" aria-label="3D view controls">
            <button type="button" className="icon-btn" aria-label="Zoom in" onClick={() => ctl.current?.zoom(1 / 1.25)}>+</button>
            <button type="button" className="icon-btn" aria-label="Zoom out" onClick={() => ctl.current?.zoom(1.25)}>−</button>
            <button type="button" className="icon-btn" aria-label="Reset view" onClick={() => ctl.current?.reset()}><Icon name="refresh" size={18} /></button>
            {!reducedMotion && <button type="button" className={`icon-btn${auto ? ' on' : ''}`} aria-pressed={auto} aria-label="Slowly turn the aircraft" onClick={() => setAuto(!auto)}><Icon name="play" size={18} /></button>}
          </div>
        )}
        {!failed && <p className="h3d-hint small">Drag to rotate · pinch or scroll to zoom · tap a component</p>}
      </div>

      <div className="h3d-parts" role="group" aria-label="Aircraft components">
        {parts.map((p) => <button key={p.id} type="button" className={`pill${selected === p.id ? ' on' : ''}`} aria-pressed={selected === p.id} onClick={() => setSelected(selected === p.id ? null : p.id)}>{p.name}</button>)}
      </div>
      <div className="h3d-info" role="status" aria-live="polite">
        {info ? <><h3>{info.name}</h3><p><strong>What it is:</strong> {info.what}</p><p><strong>What it does:</strong> {info.why}</p></> : <p className="muted">Select a component, in the picture or from the list, to see what it is and what it does in flight.</p>}
      </div>
      <p className="small muted">This is a simplified game model, not a specific real aircraft. Shapes, sizes and the speed range are for learning and play, not for flight planning.</p>
    </section>
  );
}
