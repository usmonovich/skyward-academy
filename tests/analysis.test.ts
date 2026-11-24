import { describe, expect, it } from 'vitest';
import type { MissionDef, MissionResult } from '../src/types';
import { MISSIONS } from '../src/content';
import { buildLevel } from '../src/game/engine';
import { analyse, gateMisses } from '../src/game/analysis';

const mission = (id: string): MissionDef => MISSIONS.find((m) => m.id === id)!;
const result = (over: Partial<MissionResult>): MissionResult => ({ success: true, time: 40, checkpoints: 4, total: 4, hits: 0, decisionsCorrect: 0, decisionsTotal: 0, assisted: false, score: 900, stars: 3, ...over });

describe('flight analysis', () => {
  it('praises a clean flight and finds nothing to fix', () => {
    const def = mission('c-hold-track');
    const a = analyse(def, result({ total: 6, checkpoints: 6, time: def.parTime - 2, bandFraction: 0.93, trackError: 6, maxOffset: 18 }));
    expect(a.strengths.join(' ')).toMatch(/All 6 gates/);
    expect(a.strengths.join(' ')).toMatch(/93%/);
    expect(a.strengths.join(' ')).toMatch(/No obstacle/);
    expect(a.mistakes).toEqual([]);
  });

  it('names each missed gate and whether it was too high or too low, using the recorded path', () => {
    const def = mission('m-math-units');
    const level = buildLevel(def);
    const g0 = level.gates[0]; const g1 = level.gates[1];
    const trace = [[0, 0, 260, 0, 80], [1, g0.x, g0.y - 120, 0, 80], [2, g1.x, g1.y + 150, 0, 80], [3, g1.x + 600, 300, 0, 80]];
    const r = result({ total: def.checkpoints, checkpoints: def.checkpoints - 2, gateStates: level.gates.map((_, i) => (i < 2 ? 'missed' : 'hit')), trace });
    const misses = gateMisses(def, r);
    expect(misses.map((m) => [m.index, m.kind])).toEqual([[0, 'high'], [1, 'low']]);
    expect(misses[0].amount).toBeGreaterThan(0);
    const a = analyse(def, r);
    expect(a.mistakes.join(' ')).toMatch(/2 gates missed/);
    expect(a.mistakes.join(' ')).toMatch(/gate 1: \d+ ft too high/);
    expect(a.mistakes.join(' ')).toMatch(/gate 2: \d+ ft too low/);
    expect(a.tips.length).toBeGreaterThan(0);
  });


  it('judges a crosswind landing by the centreline and the track', () => {
    const def = mission('c-crosswind-landing');
    const bad = analyse(def, result({ landing: 'hard', touchdownOffset: 30, bandFraction: 0.4, trackError: 25, maxOffset: 60 }));
    expect(bad.mistakes.join(' ')).toMatch(/outside the runway edge/);
    expect(bad.mistakes.join(' ')).toMatch(/only 40%/);
    expect(bad.tips.join(' ')).toMatch(/shrinks as airspeed rises/);
    const good = analyse(def, result({ landing: 'smooth', touchdownOffset: 3, bandFraction: 0.95, trackError: 5, maxOffset: 12 }));
    expect(good.strengths.join(' ')).toMatch(/3 units from the centreline/);
  });

  it('reports how the go-around went', () => {
    const def = mission('c-go-around');
    expect(analyse(def, result({ goAround: 'done' })).strengths.join(' ')).toMatch(/Go-around flown promptly/);
    expect(analyse(def, result({ goAround: 'late' })).mistakes.join(' ')).toMatch(/started late/);
    expect(analyse(def, result({ success: false, goAround: 'landed', reason: 'You landed on an occupied runway.' })).mistakes[0]).toBe('You landed on an occupied runway.');
  });

  it('puts the failure reason first and suggests practising in assisted mode', () => {
    const a = analyse(mission('m-math-units'), result({ success: false, reason: 'Ground contact.', checkpoints: 1, hits: 1 }));
    expect(a.mistakes[0]).toBe('Ground contact.');
    expect(a.tips.join(' ')).toMatch(/Assisted mode/);
  });

  it('never returns more than four tips and no duplicates', () => {
    const a = analyse(mission('c-fuel-reserve'), result({ success: false, checkpoints: 0, hits: 3, time: 200, fuelLeft: 0.02 }));
    expect(a.tips.length).toBeLessThanOrEqual(4);
    expect(new Set(a.tips).size).toBe(a.tips.length);
  });
});
