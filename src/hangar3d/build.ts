// Builds a simple procedural 3D model of each game aircraft from primitive shapes. No model files or textures are
// downloaded, so the only cost is the three.js code itself (loaded on demand). Nose points along +x, up is +y and the
// wing span runs along z. Every mesh carries userData.part so a tap can be mapped to an educational component.
import * as THREE from 'three';
import type { GameAircraft } from '../types';
import type { PartId } from './parts';

export interface BuiltAircraft {
  group: THREE.Group;
  parts: Map<PartId, THREE.Mesh[]>;
  /** Propellers: spun by the viewer unless the user prefers reduced motion. */
  spinners: THREE.Object3D[];
  /** Radius of a sphere that holds the whole aircraft, used to frame the camera. */
  radius: number;
  /** y coordinate of the ground under the wheels. */
  groundY: number;
}

interface Wing { half: number; root: number; tip: number; sweep: number; thick: number }
interface Spec { L: number; R: number; wing: Wing; wx: number; wy: number; hs: Wing & { y: number }; fin: { h: number; root: number; tip: number; sweep: number }; gearLen: number; tTail: boolean }

const SPEC: Record<GameAircraft['kind'], (highWing: boolean) => Spec> = {
  single: (hw) => ({ L: 8.2, R: 0.62, wing: { half: 5.6, root: 1.7, tip: 1.15, sweep: 0.15, thick: 0.16 }, wx: 0.5, wy: hw ? 0.5 : -0.34, hs: { half: 1.9, root: 1.15, tip: 0.7, sweep: 0.3, thick: 0.1, y: 0.2 }, fin: { h: 1.5, root: 1.5, tip: 0.8, sweep: 0.7 }, gearLen: 0.85, tTail: false }),
  twin: () => ({ L: 9.6, R: 0.72, wing: { half: 6.8, root: 2.1, tip: 1.3, sweep: 0.2, thick: 0.18 }, wx: 0.3, wy: -0.36, hs: { half: 2.3, root: 1.3, tip: 0.85, sweep: 0.35, thick: 0.1, y: 0.25 }, fin: { h: 1.8, root: 1.7, tip: 0.9, sweep: 0.8 }, gearLen: 0.95, tTail: false }),
  turboprop: () => ({ L: 21, R: 1.35, wing: { half: 13, root: 3.4, tip: 1.9, sweep: 0.5, thick: 0.3 }, wx: 1.0, wy: 1.15, hs: { half: 5, root: 2.4, tip: 1.4, sweep: 0.9, thick: 0.18, y: 0.6 }, fin: { h: 4.4, root: 4, tip: 2.2, sweep: 2.2 }, gearLen: 1.8, tTail: false }),
  jet: () => ({ L: 13.5, R: 0.9, wing: { half: 6.4, root: 3.0, tip: 1.1, sweep: 1.7, thick: 0.2 }, wx: 0.3, wy: -0.5, hs: { half: 2.6, root: 1.9, tip: 0.9, sweep: 1.2, thick: 0.12, y: 0.4 + 2.5 }, fin: { h: 2.6, root: 2.6, tip: 1.3, sweep: 1.5 }, gearLen: 1.3, tTail: true }),
  airliner: () => ({ L: 38, R: 2.0, wing: { half: 17.5, root: 7.2, tip: 2.1, sweep: 6.5, thick: 0.5 }, wx: 1.5, wy: -1.1, hs: { half: 6.8, root: 4.2, tip: 1.5, sweep: 3.2, thick: 0.25, y: 0.9 }, fin: { h: 6.5, root: 7, tip: 2.8, sweep: 4 }, gearLen: 3.2, tTail: false }),
};

const BODY = '#f3f6fa';
const GLASS = '#16324f';
const METAL = '#8a97a8';
const DARK = '#1c222b';

/** Local leading and trailing edge x positions of a tapered wing at spanwise fraction t (0 root, 1 tip). */
function edges(w: Wing, t: number) {
  const le0 = w.root / 2; const te0 = -w.root / 2;
  const leT = le0 - w.sweep; const teT = leT - w.tip;
  return { le: le0 + (leT - le0) * t, te: te0 + (teT - te0) * t };
}

/** A flat panel in the x (chordwise) and y (spanwise) plane, extruded to a thickness, then turned so span runs along +z. */
function panel(points: [number, number][], thick: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  points.forEach(([x, y], i) => (i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)));
  shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, { depth: thick, bevelEnabled: false });
  g.translate(0, 0, -thick / 2);
  g.rotateX(Math.PI / 2); // y (span) -> +z, extrusion -> y
  return g;
}

const wingPoints = (w: Wing): [number, number][] => { const a = edges(w, 0); const b = edges(w, 1); return [[a.le, 0], [b.le, w.half], [b.te, w.half], [a.te, 0]]; };

/** The trailing part of a wing between spanwise fractions t0 and t1 and covering the last `k` of the local chord. */
function surfacePoints(w: Wing, t0: number, t1: number, k: number): [number, number][] {
  const a = edges(w, t0); const b = edges(w, t1);
  return [[a.te + (a.le - a.te) * k, w.half * t0], [b.te + (b.le - b.te) * k, w.half * t1], [b.te, w.half * t1], [a.te, w.half * t0]];
}

export function buildAircraft(ac: GameAircraft, accent: string): BuiltAircraft {
  const s = SPEC[ac.kind](!!ac.highWing);
  const { L, R } = s;
  const group = new THREE.Group();
  const parts = new Map<PartId, THREE.Mesh[]>();
  const spinners: THREE.Object3D[] = [];

  const add = (id: PartId, geo: THREE.BufferGeometry, color: string, parent: THREE.Object3D = group, rough = 0.55, metal = 0.1) => {
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal }));
    mesh.userData.part = id;
    parent.add(mesh);
    const list = parts.get(id) ?? [];
    list.push(mesh);
    parts.set(id, list);
    return mesh;
  };
  const pair = (id: PartId, geo: THREE.BufferGeometry, color: string, at: [number, number, number], rough?: number) => {
    const right = add(id, geo, color, group, rough); right.position.set(...at);
    const left = add(id, geo, color, group, rough); left.position.set(at[0], at[1], -at[2]); left.scale.z = -1;
  };

  // Fuselage: a lathe profile with a rounded nose and a tapering tail, turned to lie along x.
  const pts: THREE.Vector2[] = [];
  const N = 28;
  for (let i = 0; i <= N; i++) {
    const f = i / N;
    let r = 1;
    if (f > 0.86) r = Math.sqrt(Math.max(0, 1 - Math.pow((f - 0.86) / 0.14, 2)));
    if (f < 0.34) { const q = f / 0.34; r = 0.1 + 0.9 * Math.sin(q * Math.PI / 2); }
    pts.push(new THREE.Vector2(Math.max(0.001, R * r), -L / 2 + L * f));
  }
  const fus = new THREE.LatheGeometry(pts, 28);
  fus.rotateZ(-Math.PI / 2);
  add('fuselage', fus, BODY, group, 0.45, 0.05);
  // Cockpit glazing.
  const cockpit = new THREE.SphereGeometry(1, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2);
  const cp = add('cockpit', cockpit, GLASS, group, 0.15, 0.4);
  cp.scale.set(R * (ac.kind === 'airliner' ? 1.5 : 1.3), R * 0.62, R * 0.78);
  cp.position.set(L * (ac.kind === 'airliner' ? 0.36 : 0.26), R * 0.62, 0);

  // Wings with flaps and ailerons.
  const wingY = s.wy; const wingX = s.wx;
  const wing = panel(wingPoints(s.wing), s.wing.thick);
  pair('wing', wing, BODY, [wingX, wingY, R * 0.6]);
  const flapGeo = panel(surfacePoints(s.wing, 0.1, 0.46, 0.3), s.wing.thick * 1.35);
  pair('flap', flapGeo, accent, [wingX, wingY, R * 0.6]);
  const ailGeo = panel(surfacePoints(s.wing, 0.56, 0.94, 0.3), s.wing.thick * 1.35);
  pair('aileron', ailGeo, accent, [wingX, wingY, R * 0.6]);

  // Tail: stabiliser with elevator, fin with rudder.
  const tailX = -L / 2 + s.fin.root * 0.62;
  const hsY = s.tTail ? R * 0.4 + s.fin.h * 0.98 : s.hs.y;
  const hsX = s.tTail ? -L / 2 + s.fin.root * 0.35 : -L / 2 + s.hs.root * 0.55;
  pair('stabiliser', panel(wingPoints(s.hs), s.hs.thick), BODY, [hsX, hsY, 0]);
  pair('elevator', panel(surfacePoints(s.hs, 0.05, 0.97, 0.34), s.hs.thick * 1.4), accent, [hsX, hsY, 0]);

  const finShape = (pts2: [number, number][]) => { const sh = new THREE.Shape(); pts2.forEach(([x, y], i) => (i === 0 ? sh.moveTo(x, y) : sh.lineTo(x, y))); sh.closePath(); const g = new THREE.ExtrudeGeometry(sh, { depth: 0.12 + R * 0.06, bevelEnabled: false }); g.translate(0, 0, -(0.12 + R * 0.06) / 2); return g; };
  const f = s.fin;
  const finLE0 = f.root / 2; const finTE0 = -f.root / 2; const finLEt = finLE0 - f.sweep; const finTEt = finLEt - f.tip;
  const finG = finShape([[finLE0, 0], [finLEt, f.h], [finTEt, f.h], [finTE0, 0]]);
  const fin = add('fin', finG, BODY); fin.position.set(tailX, R * 0.45, 0);
  const rk = 0.34;
  const rLE = (le: number, te: number) => te + (le - te) * rk;
  const rudG = finShape([[rLE(finLE0, finTE0), 0.05], [rLE(finLEt, finTEt), f.h * 0.97], [finTEt, f.h * 0.97], [finTE0, 0.05]]);
  const rudder = add('rudder', rudG, accent); rudder.position.set(tailX, R * 0.45, 0); rudder.scale.z = 1.35;

  // Engines.
  const prop = (radius: number, blades: number): THREE.Group => {
    const g = new THREE.Group();
    const spinner = add('engine', new THREE.ConeGeometry(radius * 0.13, radius * 0.34, 16), accent, g, 0.4, 0.2);
    spinner.rotation.z = -Math.PI / 2; spinner.position.x = radius * 0.1;
    for (let i = 0; i < blades; i++) {
      const arm = new THREE.Group(); arm.rotation.x = (i / blades) * Math.PI * 2;
      const b = add('engine', new THREE.BoxGeometry(radius * 0.05, radius, radius * 0.12), DARK, arm, 0.6, 0.2);
      b.position.y = radius * 0.5;
      g.add(arm);
    }
    spinners.push(g);
    return g;
  };
  const nacelle = (len: number, rad: number, at: THREE.Vector3, propBlades: number, propR: number) => {
    const body = add('engine', new THREE.CylinderGeometry(rad, rad * 0.8, len, 20), METAL, group, 0.4, 0.5);
    body.rotation.z = Math.PI / 2; body.position.copy(at);
    const p = prop(propR, propBlades); p.position.set(at.x + len / 2 + 0.05, at.y, at.z); group.add(p);
  };
  if (ac.kind === 'single') {
    const cowl = add('engine', new THREE.CylinderGeometry(R * 0.92, R * 0.86, 0.55, 24), METAL, group, 0.4, 0.5);
    cowl.rotation.z = Math.PI / 2; cowl.position.set(L / 2 - 0.12, 0, 0);
    const p = prop(1.35, 2); p.position.set(L / 2 + 0.2, 0, 0); group.add(p);
  } else if (ac.kind === 'twin') {
    const z = s.wing.half * 0.34 + R * 0.6; const e = edges(s.wing, 0.34);
    for (const sign of [1, -1]) nacelle(2.4, 0.42, new THREE.Vector3(wingX + e.le - 0.3, wingY + 0.05, z * sign), 2, 1.25);
  } else if (ac.kind === 'turboprop') {
    const z = s.wing.half * 0.38 + R * 0.6; const e = edges(s.wing, 0.38);
    for (const sign of [1, -1]) nacelle(5, 0.75, new THREE.Vector3(wingX + e.le - 0.6, wingY - 0.15, z * sign), 4, 2.1);
  } else if (ac.kind === 'jet') {
    for (const sign of [1, -1]) {
      const pod = add('engine', new THREE.CylinderGeometry(0.5, 0.42, 2.8, 20), METAL, group, 0.35, 0.6);
      pod.rotation.z = Math.PI / 2; pod.position.set(-L * 0.3, R * 0.62, (R + 0.72) * sign);
      const inlet = add('engine', new THREE.CircleGeometry(0.4, 20), DARK, group);
      inlet.rotation.y = Math.PI / 2; inlet.position.set(-L * 0.3 + 1.41, R * 0.62, (R + 0.72) * sign);
      const nozzle = add('engine', new THREE.ConeGeometry(0.38, 0.7, 20, 1, true), DARK, group);
      nozzle.rotation.z = Math.PI / 2; nozzle.position.set(-L * 0.3 - 1.7, R * 0.62, (R + 0.72) * sign);
      const pylon = add('engine', new THREE.BoxGeometry(1.6, 0.18, 0.5), METAL, group);
      pylon.position.set(-L * 0.3, R * 0.62, (R + 0.38) * sign);
    }
  } else {
    const t = 0.34; const e = edges(s.wing, t); const z = s.wing.half * t + R * 0.6;
    for (const sign of [1, -1]) {
      const eng = add('engine', new THREE.CylinderGeometry(1.2, 1.05, 4.6, 28), METAL, group, 0.35, 0.6);
      eng.rotation.z = Math.PI / 2; eng.position.set(wingX + e.le + 1.2, wingY - 1.7, z * sign);
      const inlet = add('engine', new THREE.CircleGeometry(0.95, 28), DARK, group);
      inlet.rotation.y = Math.PI / 2; inlet.position.set(wingX + e.le + 1.2 + 2.31, wingY - 1.7, z * sign);
      const cone = add('engine', new THREE.ConeGeometry(0.85, 1.6, 24), METAL, group, 0.35, 0.6);
      cone.rotation.z = Math.PI / 2; cone.position.set(wingX + e.le + 1.2 - 3.1, wingY - 1.7, z * sign);
      const pylon = add('engine', new THREE.BoxGeometry(3, 1.3, 0.35), METAL, group);
      pylon.position.set(wingX + e.le + 0.9, wingY - 0.95, z * sign);
    }
  }

  // Tricycle landing gear.
  const groundY = -(R + s.gearLen);
  const wr = Math.max(0.2, R * 0.34);
  const leg = (x: number, y0: number, z: number) => {
    const h = y0 - groundY;
    const strut = add('gear', new THREE.CylinderGeometry(wr * 0.14, wr * 0.14, h, 10), DARK, group, 0.5, 0.4);
    strut.position.set(x, groundY + h / 2, z);
    const wheel = add('gear', new THREE.CylinderGeometry(wr, wr, wr * 0.7, 20), '#0f1318', group, 0.8, 0.1);
    wheel.rotation.x = Math.PI / 2; wheel.position.set(x, groundY + wr, z);
  };
  leg(L * 0.3, -R * 0.4, 0);
  const mainX = wingX - 0.2 + (ac.kind === 'airliner' ? 1 : 0);
  for (const sign of [1, -1]) leg(mainX, -R * 0.4, (R * 1.5 + (ac.kind === 'airliner' ? 1.6 : 0.4)) * sign);

  const radius = Math.max(L / 2, s.wing.half) * 1.08;
  group.position.y = -(groundY / 2);
  return { group, parts, spinners, radius, groundY: groundY + group.position.y };
}

/** Releases GPU resources held by a built aircraft. */
export function disposeAircraft(a: BuiltAircraft) {
  a.group.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose()); else mat?.dispose();
  });
}
