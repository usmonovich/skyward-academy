// Educational descriptions of the aircraft components shown in the 3D hangar. Pure data: no three.js here, so the
// text can be tested and shown without loading the 3D code. The aircraft are simplified game models, not real types.
import type { GameAircraft } from '../types';

export type PartId = 'fuselage' | 'cockpit' | 'wing' | 'aileron' | 'flap' | 'stabiliser' | 'elevator' | 'fin' | 'rudder' | 'engine' | 'gear';
export interface PartInfo { id: PartId; name: string; /** What it is. */ what: string; /** What it does in flight. */ why: string }
type Kind = GameAircraft['kind'];

const ENGINE: Record<Kind, { name: string; what: string; why: string }> = {
  single: { name: 'Engine and propeller', what: 'A piston engine turns a propeller at the nose.', why: 'The propeller is a rotating aerofoil: it accelerates air backwards and the reaction is thrust, which overcomes drag.' },
  twin: { name: 'Engines and propellers', what: 'Two piston engines, one on each wing, each turning a propeller.', why: 'Two engines give extra thrust and redundancy. If one fails, the thrust becomes asymmetric and the aircraft yaws towards the failed engine, so pilots train for engine-out flight.' },
  turboprop: { name: 'Turboprop engines', what: 'Gas-turbine engines that drive propellers through a gearbox.', why: 'The turbine produces power efficiently at the speeds and altitudes of regional flying, and the propeller turns that power into thrust.' },
  jet: { name: 'Jet engines', what: 'Gas-turbine engines mounted on the rear fuselage.', why: 'Air is compressed, mixed with fuel and burned. The hot gas leaves the engine at high speed and the reaction pushes the aircraft forward (Newton\'s third law).' },
  airliner: { name: 'Turbofan engines', what: 'Large turbofan engines slung under the wings.', why: 'A big fan at the front pushes most of the air around the engine core, which gives most of the thrust efficiently at airliner speeds.' },
};

export function partsFor(kind: Kind, highWing = false): PartInfo[] {
  const swept = kind === 'jet' || kind === 'airliner';
  const e = ENGINE[kind];
  return [
    { id: 'fuselage', name: 'Fuselage', what: 'The main body of the aircraft.', why: kind === 'airliner' ? 'It carries crew, passengers and cargo and ties the wings and tail together. Airliners fly high, so the cabin is pressurised.' : 'It carries the crew and load and ties the wings and tail together.' },
    { id: 'cockpit', name: 'Cockpit', what: 'The flight deck with the pilots\' seats, controls and instruments.', why: 'From here the pilots read the flight instruments (airspeed, altitude, attitude) and move the controls that command the control surfaces and the engines.' },
    { id: 'wing', name: 'Wing', what: swept ? 'A swept-back aerofoil.' : highWing ? 'A high wing: the fuselage hangs below it.' : 'A low wing: it sits at the bottom of the fuselage.', why: 'The wing deflects air downwards and has lower pressure above than below, which produces lift. Lift grows with airspeed and angle of attack until the wing stalls.' + (swept ? ' Sweep delays the sharp drag rise that comes with flying close to the speed of sound.' : '') },
    { id: 'aileron', name: 'Aileron', what: 'A hinged surface on the outer trailing edge of each wing.', why: 'Ailerons move in opposite directions. One wing gains lift and the other loses it, so the aircraft rolls into a bank.' },
    { id: 'flap', name: 'Flap', what: 'A hinged surface on the inner trailing edge of each wing.', why: 'Extended for take-off and landing, flaps increase lift and drag so the aircraft can fly safely at a lower speed.' },
    { id: 'stabiliser', name: 'Horizontal stabiliser', what: 'The fixed horizontal surface of the tail.', why: 'It gives pitch stability: if the nose pitches up or down, the stabiliser pushes it back towards its original attitude.' },
    { id: 'elevator', name: 'Elevator', what: 'The hinged rear part of the horizontal tail.', why: 'Pulling the control back raises the nose and pushing forward lowers it. The elevator controls pitch.' },
    { id: 'fin', name: 'Vertical fin', what: 'The fixed vertical surface of the tail.', why: 'It keeps the nose pointing into the airflow, like the feathers of an arrow. This is directional stability.' },
    { id: 'rudder', name: 'Rudder', what: 'The hinged rear part of the fin.', why: 'The rudder pedals move it to yaw the nose left or right. Pilots also use it to keep turns coordinated and to counter asymmetric thrust.' },
    { id: 'engine', name: e.name, what: e.what, why: e.why },
    { id: 'gear', name: 'Landing gear', what: 'Tricycle landing gear: two main wheels and a nosewheel.', why: 'It carries the aircraft on the ground, absorbs the landing and lets it taxi. The nosewheel helps steering. Many faster aircraft retract the gear after take-off to cut drag; some simple trainers keep it fixed.' },
  ];
}

export const PART_IDS: PartId[] = ['fuselage', 'cockpit', 'wing', 'aileron', 'flap', 'stabiliser', 'elevator', 'fin', 'rudder', 'engine', 'gear'];
