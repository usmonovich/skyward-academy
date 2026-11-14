import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { GAME_AIRCRAFT } from '../src/content/reference';
import { PART_IDS, partsFor } from '../src/hangar3d/parts';
import { buildAircraft, disposeAircraft } from '../src/hangar3d/build';

describe('3D hangar: component descriptions', () => {
  it.each(GAME_AIRCRAFT.map((a) => [a.id, a] as const))('%s describes every component with text that explains it', (_, ac) => {
    const parts = partsFor(ac.kind, ac.highWing);
    expect(parts.map((p) => p.id)).toEqual(PART_IDS);
    for (const p of parts) {
      expect(p.name.length, p.id).toBeGreaterThan(2);
      expect(p.what.length, `${p.id} what`).toBeGreaterThan(15);
      expect(p.why.length, `${p.id} why`).toBeGreaterThan(40);
    }
  });

  it('describes the engine, wing and gear that each aircraft kind really has', () => {
    const by = (k: Parameters<typeof partsFor>[0], id: string) => partsFor(k).find((p) => p.id === id)!;
    expect(by('single', 'engine').name).toMatch(/propeller/i);
    expect(by('twin', 'engine').why).toMatch(/asymmetric/i);
    expect(by('turboprop', 'engine').what).toMatch(/gearbox/i);
    expect(by('jet', 'engine').why).toMatch(/third law/i);
    expect(by('airliner', 'engine').name).toMatch(/turbofan/i);
    expect(by('airliner', 'wing').why).toMatch(/sweep/i);
    expect(by('single', 'wing').why).not.toMatch(/sweep/i);
    expect(partsFor('single', true).find((p) => p.id === 'wing')!.what).toMatch(/high wing/i);
    expect(partsFor('single', false).find((p) => p.id === 'wing')!.what).toMatch(/low wing/i);
  });
});

describe('3D hangar: procedural models', () => {
  it.each(GAME_AIRCRAFT.map((a) => [a.id, a] as const))('%s builds a complete, finite model with every selectable part', (_, ac) => {
    const built = buildAircraft(ac, '#f58220');
    for (const id of PART_IDS) expect(built.parts.get(id)?.length ?? 0, `${ac.id} has part ${id}`).toBeGreaterThan(0);
    const box = new THREE.Box3().setFromObject(built.group);
    for (const v of [box.min.x, box.min.y, box.min.z, box.max.x, box.max.y, box.max.z]) expect(Number.isFinite(v)).toBe(true);
    expect(built.radius).toBeGreaterThan(3);
    // The aircraft fits inside the sphere the camera is framed on, and the wheels touch the ground plane.
    expect(box.max.x - box.min.x).toBeLessThanOrEqual(built.radius * 2.6);
    expect(box.min.y).toBeCloseTo(built.groundY, 1);
    // Every mesh can be mapped back to a component.
    built.group.traverse((o) => { if ((o as THREE.Mesh).isMesh) expect(PART_IDS).toContain((o as THREE.Mesh).userData.part); });
    disposeAircraft(built);
  });

  it('gives propeller aircraft spinning propellers and jets none', () => {
    const spin = (id: string) => buildAircraft(GAME_AIRCRAFT.find((a) => a.id === id)!, '#f58220').spinners.length;
    expect(spin('sparrow')).toBe(1);
    expect(spin('gemini')).toBe(2);
    expect(spin('albatross')).toBe(2);
    expect(spin('falcon')).toBe(0);
    expect(spin('skyliner')).toBe(0);
  });

  it('draws the larger aircraft larger', () => {
    const span = (id: string) => { const b = buildAircraft(GAME_AIRCRAFT.find((a) => a.id === id)!, '#fff'); const box = new THREE.Box3().setFromObject(b.group); return box.max.z - box.min.z; };
    expect(span('skyliner')).toBeGreaterThan(span('albatross'));
    expect(span('albatross')).toBeGreaterThan(span('gemini'));
    expect(span('gemini')).toBeGreaterThan(span('sparrow'));
  });

  it('is symmetric left to right', () => {
    const b = buildAircraft(GAME_AIRCRAFT.find((a) => a.id === 'skyliner')!, '#fff');
    const box = new THREE.Box3().setFromObject(b.group);
    expect(box.max.z + box.min.z).toBeCloseTo(0, 3);
  });
});
