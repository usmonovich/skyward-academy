// Pre-Flight Academy physics, second batch: motion, forces, fluid flow, gases, rotation and drag.
import { lesson, match, mcq, num, scenario, tf } from './q';

export const acceleration = lesson('Acceleration', {
  id: 'phys-accel', title: 'Acceleration', minutes: 11, level: 1, prereqs: ['phys-speed'],
  objectives: ['Define acceleration and state its unit.', 'Calculate acceleration from a change in velocity.', 'Use v = u + a × t.', 'Estimate the distance needed to reach a speed from rest.'],
  intro: 'A take-off run is a problem in acceleration: how quickly can the aircraft gain speed, and how much runway does that take? Acceleration is also what you feel in a turn, even when the speed does not change.',
  simple: 'Acceleration is how quickly velocity changes. Divide the change in speed by the time it took. Slowing down is acceleration too — it just has a minus sign. Changing direction also counts.',
  sections: [
    { h: 'What acceleration means', body: [
      '**Acceleration** is the rate of change of velocity: `a = (v − u) / t`, where **u** is the starting velocity, **v** is the final velocity and **t** is the time taken.',
      'The unit is metres per second per second, written **m/s²**. An acceleration of 3 m/s² means the speed rises by 3 m/s every second.',
      'If the result is negative the object is slowing down. This is often called **deceleration**.',
    ], formula: 'acceleration', lab: 'formula:acceleration' },
    { h: 'Velocity after a time', body: [
      'Rearranging gives `v = u + a × t`. Start at 5 m/s, accelerate at 2 m/s² for 6 s, and you reach 5 + 12 = 17 m/s.',
    ] },
    { h: 'Distance for a take-off run', body: [
      'Starting from rest with constant acceleration, the distance needed to reach a speed v is `s = v² / (2a)`.',
      'Because the speed is squared, a take-off speed that is 10% higher needs about 21% more runway at the same acceleration.',
    ], note: 'Real take-off acceleration is not constant: thrust, drag and rolling friction all change with speed. Aircraft performance charts account for this, so always use the charts for real planning.' },
    { h: 'Changing direction is acceleration', body: [
      'Velocity includes direction. An aircraft in a level turn at a constant 100 kt is accelerating toward the centre of the turn, because its direction is changing all the time.',
      'That inward acceleration needs an inward force, which is supplied by the tilted lift of the banked wing.',
    ] },
  ],
  examples: [
    { title: 'Acceleration on the runway', steps: ['An aircraft goes from rest to 30 m/s in 10 s.', 'a = (30 − 0) ÷ 10.', 'a = 3 m/s².'] },
    { title: 'Runway needed', steps: ['Same aircraft: lift-off speed 30 m/s, acceleration 3 m/s².', 's = v² ÷ (2a) = 900 ÷ 6.', 's = 150 m.'] },
    { title: 'Braking after landing', steps: ['Speed falls from 60 m/s to 20 m/s in 8 s.', 'a = (20 − 60) ÷ 8 = −40 ÷ 8.', 'a = −5 m/s². The minus sign shows the aircraft is slowing down.'] },
  ],
  practice: [
    num('A car goes from rest to 20 m/s in 8 s. Acceleration?', 2.5, 0.02, 'm/s²', '(20 − 0) ÷ 8 = 2.5 m/s².'),
    num('Starting at 5 m/s, an object accelerates at 2 m/s² for 6 s. Final speed?', 17, 0.05, 'm/s', 'v = 5 + 2 × 6 = 17 m/s.', 'Use v = u + a × t.'),
    num('Speed falls from 60 m/s to 20 m/s in 8 s. Acceleration (include the sign)?', -5, 0.05, 'm/s²', '(20 − 60) ÷ 8 = −5 m/s².', 'Final minus initial, divided by time.'),
    mcq('An aircraft flies a level turn at a constant 90 kt. Is it accelerating?', ['Yes, because its direction is changing', 'No, because its speed is constant', 'Only if it climbs', 'Only if the engine power changes'], 'Velocity includes direction, so a change of direction is an acceleration.'),
    num('From rest at 3 m/s², what distance is needed to reach 30 m/s?', 150, 1, 'm', 's = 30² ÷ (2 × 3) = 150 m.', 'Use s = v² ÷ (2a).'),
  ],
  assessment: [
    num('An aircraft goes from rest to 40 m/s in 16 s. Acceleration?', 2.5, 0.02, 'm/s²', '40 ÷ 16 = 2.5 m/s².'),
    num('Starting at 10 m/s, an object accelerates at 3 m/s² for 5 s. Final speed?', 25, 0.05, 'm/s', 'v = 10 + 3 × 5 = 25 m/s.'),
    num('An aircraft slows from 50 m/s to rest in 10 s. Acceleration (include the sign)?', -5, 0.05, 'm/s²', '(0 − 50) ÷ 10 = −5 m/s².'),
    num('From rest at 2 m/s², what distance is needed to reach 40 m/s?', 400, 2, 'm', 's = 40² ÷ (2 × 2) = 400 m.'),
    mcq('The unit of acceleration is:', ['m/s²', 'm/s', 'N', 'kg·m/s'], 'Acceleration is a change in velocity (m/s) per second.'),
    tf('An object can accelerate while its speed stays the same.', true, 'A change of direction at constant speed is an acceleration, as in a turn.'),
  ],
  missionId: 'm-phys-accel', sources: ['phak'],
});

export const friction = lesson('Friction', {
  id: 'phys-friction', title: 'Friction', minutes: 10, level: 1, prereqs: ['phys-newton', 'phys-weight'],
  objectives: ['Describe friction and the direction in which it acts.', 'Calculate friction with F = μ × N.', 'Explain why a wet runway lengthens the landing roll.', 'Explain why wheel braking is weak immediately after touchdown.'],
  intro: 'Friction lets tyres grip the runway and brakes stop the aircraft. When friction is low — on a wet, icy or contaminated runway — stopping distances grow quickly.',
  simple: 'Friction is the force that resists sliding between two surfaces. It depends on how grippy the surfaces are and how hard they are pressed together. Less grip or less weight on the wheels means less braking.',
  sections: [
    { h: 'What friction is', body: [
      '**Friction** is a force that acts along the surface where two objects touch. It always opposes sliding, or the tendency to slide, between them.',
      '**Static friction** holds surfaces that are not sliding. **Kinetic friction** acts once they slide. The maximum static friction is usually larger, which is why a locked, skidding wheel brakes less effectively than a rolling one at the limit of grip.',
    ] },
    { h: 'The friction formula', body: [
      '`F = μ × N`. **N** is the **normal force** pressing the surfaces together, at right angles to the surface. **μ** (mu) is the **coefficient of friction**, a number without units that depends on the two materials and their condition.',
      'On level ground with no lift, N equals the weight. Double the normal force and the maximum friction doubles.',
    ], formula: 'friction', lab: 'formula:friction' },
    { h: 'Runway condition', body: [
      'Water, slush, snow, ice and rubber deposits all reduce μ between tyre and runway. With less friction available, the same aircraft needs a longer distance to stop.',
      'On standing water a tyre can ride up on a film of water and lose contact with the surface. This is **aquaplaning** (hydroplaning), and braking and steering become very poor.',
    ], note: 'This lesson uses illustrative values of μ. Real braking performance comes from the aircraft flight manual and reported runway condition, never from a single coefficient.' },
    { h: 'Why braking is weak just after touchdown', body: [
      'Right after touchdown the wings are still producing lift, so the normal force on the wheels is much less than the aircraft\'s weight. Since `F = μ × N`, the brakes can do little.',
      'As the aircraft slows, lift falls, more weight transfers to the wheels and braking becomes effective. This is one reason pilots lower the nose, and why large aircraft use spoilers to "dump" lift.',
    ] },
  ],
  examples: [
    { title: 'Maximum braking force', steps: ['Normal force on the wheels 10,000 N, μ = 0.6 (dry, illustrative).', 'F = 0.6 × 10,000.', 'F = 6,000 N.'] },
    { title: 'The same aircraft on a wet runway', steps: ['μ falls to 0.3 (illustrative).', 'F = 0.3 × 10,000 = 3,000 N.', 'Half the braking force means roughly twice the braking distance.'] },
  ],
  practice: [
    num('μ = 0.5 and N = 2,000 N. Friction force?', 1000, 1, 'N', '0.5 × 2,000 = 1,000 N.'),
    num('N = 10,000 N and μ = 0.3. Friction force?', 3000, 1, 'N', '0.3 × 10,000 = 3,000 N.'),
    mcq('Compared with a dry runway, a wet runway gives:', ['A lower coefficient of friction and a longer stopping distance', 'A higher coefficient of friction', 'The same stopping distance', 'More friction but less lift'], 'Water reduces the grip between tyre and surface.'),
    tf('Friction acts in the direction that opposes sliding between the surfaces.', true, 'Friction always resists relative sliding or the tendency to slide.'),
    mcq('Why are the wheel brakes less effective immediately after touchdown?', ['The wings still produce lift, so there is less weight on the wheels', 'The tyres are too cold', 'The engine is still at idle', 'Friction does not act at high speed'], 'Less normal force on the wheels means less friction available.'),
  ],
  assessment: [
    num('μ = 0.4 and N = 5,000 N. Friction force?', 2000, 1, 'N', '0.4 × 5,000 = 2,000 N.'),
    num('A friction force of 1,200 N acts with a normal force of 4,000 N. Coefficient of friction?', 0.3, 0.005, '', 'μ = F ÷ N = 1,200 ÷ 4,000 = 0.3.'),
    mcq('The friction force between two surfaces depends mainly on:', ['The coefficient of friction and the normal force', 'The colour of the surfaces', 'The speed of sound', 'The air temperature only'], 'F = μ × N.'),
    tf('If the normal force doubles, the maximum friction force doubles.', true, 'Friction is proportional to the normal force.'),
    mcq('A tyre riding on a film of standing water with almost no grip is:', ['Aquaplaning', 'Stalling', 'Cavitating', 'Rotating'], 'Aquaplaning (hydroplaning) separates the tyre from the runway surface.'),
    scenario(mcq('You plan to land on a runway reported as wet. Compared with your dry-runway figure, the landing distance required will be:', ['Longer, so check it against the runway available', 'Shorter', 'The same', 'Impossible to estimate, so ignore it'], 'Less friction means a longer stopping distance. Use the flight manual\'s wet-runway data.')),
  ],
  missionId: 'm-phys-friction', sources: ['phak', 'afh'],
});

export const momentum = lesson('Momentum', {
  id: 'phys-momentum', title: 'Momentum', minutes: 11, level: 2, prereqs: ['phys-newton'],
  objectives: ['Define momentum and calculate it.', 'Relate force and time to a change in momentum.', 'Explain thrust as a change in the momentum of air.'],
  intro: 'A heavy aircraft at approach speed is hard to stop, and a jet engine pushes forward by throwing air backward. Both ideas are about momentum.',
  simple: 'Momentum is mass times velocity: how much "moving" an object has. To change it you need a force acting for a time. An engine makes thrust by giving air backward momentum.',
  sections: [
    { h: 'Momentum', body: [
      '**Momentum** is mass multiplied by velocity: `p = m × v`. Its unit is kg·m/s. It is a vector, pointing the same way as the velocity.',
      'A heavier aircraft at the same speed has more momentum. So does the same aircraft flying faster.',
    ], formula: 'momentum', lab: 'formula:momentum' },
    { h: 'Force, time and impulse', body: [
      'A force acting for a time changes momentum: `F × t = change in momentum`. The product F × t is called **impulse**.',
      'To stop an aircraft you must remove all of its momentum. With a limited braking force, more momentum means more time, and more runway.',
      'This is Newton\'s second law in its original form: force equals the rate of change of momentum.',
    ] },
    { h: 'Thrust from momentum', body: [
      'A propeller or jet engine takes in air and accelerates it rearward. The force needed to do this is `thrust = mass flow × change in air velocity`.',
      'A propeller moves a large mass of air with a small speed change. A jet moves a smaller mass with a large speed change. Both produce thrust in the same way.',
    ], note: 'This simple thrust relation ignores pressure differences at the engine exhaust and the mass of fuel added. It is a good first model, not an engine performance calculation.' },
  ],
  examples: [
    { title: 'Momentum on approach', steps: ['Mass 1,000 kg, speed 50 m/s.', 'p = 1,000 × 50.', 'p = 50,000 kg·m/s.'] },
    { title: 'Thrust of a propeller', steps: ['The propeller moves 20 kg of air each second and speeds it up by 50 m/s.', 'Thrust = 20 × 50.', 'Thrust = 1,000 N.'] },
  ],
  practice: [
    num('Mass 1,000 kg, speed 50 m/s. Momentum?', 50000, 10, 'kg·m/s', '1,000 × 50 = 50,000 kg·m/s.'),
    num('A force of 2,000 N acts for 5 s. Change in momentum?', 10000, 10, 'kg·m/s', '2,000 × 5 = 10,000 kg·m/s.'),
    num('That impulse of 10,000 kg·m/s acts on a 1,000 kg aircraft. Change in speed?', 10, 0.05, 'm/s', 'Δv = 10,000 ÷ 1,000 = 10 m/s.', 'Divide the change in momentum by the mass.'),
    mcq('Two aircraft land at the same speed. The heavier one:', ['Has more momentum and is harder to stop', 'Has less momentum', 'Has the same momentum', 'Has no momentum'], 'Momentum is proportional to mass.'),
    num('An engine accelerates 20 kg of air per second by 50 m/s. Thrust?', 1000, 2, 'N', '20 × 50 = 1,000 N.'),
  ],
  assessment: [
    num('Mass 1,200 kg, speed 40 m/s. Momentum?', 48000, 10, 'kg·m/s', '1,200 × 40 = 48,000 kg·m/s.'),
    num('A force of 500 N acts for 8 s. Change in momentum?', 4000, 5, 'kg·m/s', '500 × 8 = 4,000 kg·m/s.'),
    num('An engine accelerates 30 kg of air per second by 40 m/s. Thrust?', 1200, 2, 'N', '30 × 40 = 1,200 N.'),
    tf('Momentum is a scalar quantity.', false, 'Momentum has a direction: it is a vector.'),
    mcq('The unit of momentum is:', ['kg·m/s', 'N/m', 'kg/m³', 'm/s²'], 'Mass (kg) times velocity (m/s).'),
    mcq('If an aircraft doubles its speed, its momentum:', ['Doubles', 'Quadruples', 'Halves', 'Stays the same'], 'Momentum is proportional to speed. (Kinetic energy, by contrast, quadruples.)'),
  ],
  missionId: 'm-phys-momentum', sources: ['phak'],
});

export const continuity = lesson('Fluid flow', {
  id: 'phys-continuity', title: 'Continuity and Fluid Flow', minutes: 10, level: 2, prereqs: ['phys-density'],
  objectives: ['Describe steady flow and streamlines.', 'Use the continuity equation A₁v₁ = A₂v₂.', 'Calculate mass flow rate.', 'Explain why flow speeds up in a narrower passage.'],
  intro: 'Put your thumb over the end of a garden hose and the water shoots out faster. Nothing was added; the water simply had to pass through a smaller opening. Air around a wing obeys the same rule.',
  simple: 'What flows in must flow out. If a stream of fluid is squeezed into a smaller area, it has to speed up so that the same amount passes each second.',
  sections: [
    { h: 'Steady flow and streamlines', body: [
      'In **steady flow** the speed and direction at each point do not change with time. A **streamline** is the path a small parcel of fluid follows.',
      'Where streamlines are drawn closer together, the fluid is passing through a smaller area — and moving faster.',
    ] },
    { h: 'The continuity equation', body: [
      'Fluid does not appear or disappear inside a pipe, so the mass passing every cross-section each second is the same. This **mass flow rate** is `ρ × A × v`.',
      'If the density stays constant, this simplifies to `A₁ × v₁ = A₂ × v₂`. Halve the area and the speed doubles.',
      'Use the calculator to squeeze the flow and watch the speed change.',
    ], formula: 'continuity', lab: 'formula:continuity' },
    { h: 'In aviation', body: [
      'A **venturi** is a tube with a narrow throat. Air speeds up in the throat. Carburettors and some older vacuum systems use this effect.',
      'Air passing over the curved upper surface of a wing is also squeezed into a narrower stream tube and accelerates.',
    ], note: 'A₁v₁ = A₂v₂ assumes constant density. That is a good approximation for air below about Mach 0.3. At higher speeds air compresses and the full form ρ₁A₁v₁ = ρ₂A₂v₂ must be used.' },
  ],
  examples: [
    { title: 'A narrowing duct', steps: ['Area 2 m² with air at 10 m/s narrows to 1 m².', 'v₂ = A₁ × v₁ ÷ A₂ = 2 × 10 ÷ 1.', 'v₂ = 20 m/s.'] },
    { title: 'Mass flow rate', steps: ['Density 1.2 kg/m³, area 2 m², speed 10 m/s.', 'Mass flow = 1.2 × 2 × 10.', 'Mass flow = 24 kg/s.'] },
  ],
  practice: [
    num('Area 2 m² at 10 m/s narrows to 1 m². New speed?', 20, 0.1, 'm/s', '2 × 10 ÷ 1 = 20 m/s.'),
    num('Area 0.5 m² at 40 m/s widens to 1 m². New speed?', 20, 0.1, 'm/s', '0.5 × 40 ÷ 1 = 20 m/s.'),
    mcq('In steady, constant-density flow, if the area halves the speed:', ['Doubles', 'Halves', 'Stays the same', 'Quadruples'], 'A × v stays constant.'),
    num('Density 1.2 kg/m³, area 2 m², speed 10 m/s. Mass flow rate?', 24, 0.1, 'kg/s', '1.2 × 2 × 10 = 24 kg/s.'),
    tf('For air at low speed, treating density as constant is a reasonable approximation.', true, 'Compressibility effects are small below about Mach 0.3.'),
  ],
  assessment: [
    num('Area 3 m² at 20 m/s narrows to 2 m². New speed?', 30, 0.1, 'm/s', '3 × 20 ÷ 2 = 30 m/s.'),
    num('Area 1 m² at 30 m/s widens to 3 m². New speed?', 10, 0.1, 'm/s', '1 × 30 ÷ 3 = 10 m/s.'),
    num('Density 1.225 kg/m³, area 0.5 m², speed 40 m/s. Mass flow rate?', 24.5, 0.1, 'kg/s', '1.225 × 0.5 × 40 = 24.5 kg/s.'),
    mcq('Where streamlines move closer together, the flow speed:', ['Increases', 'Decreases', 'Becomes zero', 'Is unchanged'], 'A smaller flow area requires a higher speed.'),
    mcq('The continuity equation is a statement of the conservation of:', ['Mass', 'Energy', 'Momentum', 'Temperature'], 'The same mass passes every cross-section each second.'),
    tf('In the throat of a venturi the air moves faster than in the wider sections.', true, 'The throat has the smallest area, so the speed is highest there.'),
  ],
  missionId: 'm-phys-continuity', sources: ['phak', 'nasa-lift'],
});

export const bernoulli = lesson("Bernoulli's principle", {
  id: 'phys-bernoulli', title: "Bernoulli's Principle and Its Limitations", minutes: 13, level: 2, prereqs: ['phys-continuity', 'phys-pressure'],
  objectives: ["State Bernoulli's principle for level, low-speed flow.", 'Calculate a pressure change from a speed change.', 'List the conditions under which the principle is valid.', 'Explain what the principle does not tell you about lift.'],
  intro: "Bernoulli's principle is correct, useful and frequently misused. This lesson shows what it really says, how to calculate with it, and where it stops being valid.",
  simple: 'Along a smooth, steady stream of fluid, where the flow is faster the pressure is lower, and where it is slower the pressure is higher. It is an energy rule. It tells you how pressure and speed are linked, not why the air speeds up.',
  sections: [
    { h: 'The principle', body: [
      'For steady flow along a streamline at constant height, `p + ½ ρ v² = constant`.',
      '**p** is static pressure and **½ρv²** is dynamic pressure. Their sum is the **total pressure**. If the speed rises, dynamic pressure rises and static pressure must fall by the same amount.',
      'It is a statement of energy conservation for the fluid: pressure energy is exchanged for kinetic energy.',
    ], formula: 'bernoulli', lab: 'formula:bernoulli' },
    { h: 'Using it', body: [
      'Between two points on the same streamline: `p₂ = p₁ + ½ ρ (v₁² − v₂²)`.',
      'In a venturi the throat has the highest speed (continuity), and therefore the lowest static pressure (Bernoulli).',
      'The pitot tube is the opposite case: it brings the air to rest, so all the dynamic pressure is recovered as extra pressure.',
    ] },
    { h: 'When it is valid', body: [
      'The simple form requires flow that is **steady**, **incompressible** (roughly below Mach 0.3), with **negligible friction**, compared **along one streamline**, and with **no energy added or removed** between the two points.',
      'You cannot apply it across a propeller disc, where the engine adds energy, or inside a boundary layer or separated flow, where friction dominates.',
    ], note: 'For faster flow the compressible form of the energy equation is needed. Airspeed indicators in high-speed aircraft are calibrated with it for this reason.' },
    { h: 'What it does not explain', body: [
      'Bernoulli links speed and pressure. It does not say why the air over a wing speeds up. The reason is not that it "must catch up" with the air below — that equal-transit-time idea is false.',
      'The air speeds up because the wing, set at an angle of attack, turns the whole flow. The pressure field and the turning of the flow are two descriptions of the same physics, as you saw in the Lift lesson.',
    ] },
  ],
  examples: [
    { title: 'Pressure in a faster stream', steps: ['p₁ = 101,325 Pa, v₁ = 10 m/s, v₂ = 30 m/s, ρ = 1.225 kg/m³.', 'p₂ = 101,325 + ½ × 1.225 × (10² − 30²) = 101,325 + 0.6125 × (−800).', 'p₂ = 101,325 − 490 = 100,835 Pa.', 'The pressure fell by 490 Pa, about 4.9 hPa.'] },
    { title: 'Dynamic pressure at 60 m/s', steps: ['q = ½ × 1.225 × 60².', 'q = 0.6125 × 3,600.', 'q = 2,205 Pa.'] },
  ],
  practice: [
    num('p₁ = 101,325 Pa, v₁ = 10 m/s, v₂ = 30 m/s, ρ = 1.225 kg/m³. Find p₂.', 100835, 5, 'Pa', '101,325 + 0.6125 × (100 − 900) = 100,835 Pa.', 'Use p₂ = p₁ + ½ρ(v₁² − v₂²).'),
    mcq('Along a streamline in steady low-speed flow, where the speed increases the static pressure:', ['Decreases', 'Increases', 'Is unchanged', 'Becomes zero'], 'Static plus dynamic pressure is constant.'),
    mcq('Which quantity stays constant along the streamline?', ['Total pressure', 'Static pressure', 'Dynamic pressure', 'Speed'], 'Total pressure = static + dynamic.'),
    num('ρ = 1.225 kg/m³, v = 60 m/s. Dynamic pressure?', 2205, 5, 'Pa', '½ × 1.225 × 3,600 = 2,205 Pa.'),
    tf('The simple Bernoulli equation can be applied between a point ahead of a propeller and a point behind it.', false, 'The propeller adds energy to the flow, which breaks the assumption of constant total pressure.'),
  ],
  assessment: [
    num('p₁ = 100,000 Pa, v₁ = 20 m/s, v₂ = 40 m/s, ρ = 1.2 kg/m³. Find p₂.', 99280, 5, 'Pa', '100,000 + 0.6 × (400 − 1,600) = 99,280 Pa.'),
    num('ρ = 1.2 kg/m³, v = 50 m/s. Dynamic pressure?', 1500, 3, 'Pa', '½ × 1.2 × 2,500 = 1,500 Pa.'),
    mcq('Which is NOT an assumption of the simple Bernoulli equation?', ['The flow is supersonic', 'The flow is steady', 'Friction is negligible', 'Density is constant'], 'The simple form applies only to low-speed, incompressible flow.'),
    mcq('In the throat of a venturi, compared with the wide section:', ['Speed is higher and static pressure is lower', 'Speed is lower and static pressure is higher', 'Both are higher', 'Both are lower'], 'Continuity raises the speed; Bernoulli lowers the static pressure.'),
    tf("Bernoulli's principle explains why air must speed up over the top of a wing.", false, 'It relates speed and pressure but does not give the cause of the speed-up.'),
    mcq("Bernoulli's principle expresses the conservation of:", ['Energy', 'Mass', 'Charge', 'Momentum only'], 'Pressure energy and kinetic energy are exchanged; their sum is conserved.'),
  ],
  missionId: 'm-phys-bernoulli', sources: ['phak', 'nasa-lift'],
});

export const gasLaws = lesson('Gas laws', {
  id: 'phys-gas', title: 'Gas Laws', minutes: 12, level: 2, prereqs: ['phys-density', 'phys-pressure'],
  objectives: ['Convert between degrees Celsius and kelvin.', "Apply Boyle's law and Charles's law.", 'Calculate air density from pressure and temperature.', 'Explain why hot air is less dense.'],
  intro: 'Pressure, temperature and density are tied together. Change one and at least one of the others must change. This link is the reason hot days hurt aircraft performance.',
  simple: 'Squeeze a gas and its pressure rises. Heat it and it expands. For air, density equals pressure divided by temperature and a constant — so hotter air at the same pressure is thinner.',
  sections: [
    { h: 'Absolute temperature', body: [
      'Gas laws only work with **absolute temperature**, measured in **kelvin (K)**: `K = °C + 273.15`.',
      '15 °C is 288.15 K. The coldest ISA temperature, −56.5 °C, is 216.65 K.',
    ] },
    { h: 'Two classic laws', body: [
      "**Boyle's law:** at constant temperature, `p × V = constant`. Double the pressure and the volume halves.",
      "**Charles's law:** at constant pressure, `V / T = constant`. Heat a gas from 300 K to 400 K and its volume grows by one third.",
    ] },
    { h: 'The ideal gas law for air', body: [
      'Combining them gives `p = ρ × R × T`, or `ρ = p / (R × T)`, where R = 287 J/(kg·K) for dry air.',
      'At ISA sea level: ρ = 101,325 ÷ (287.05 × 288.15) = 1.225 kg/m³.',
      'Raise the temperature in the calculator and watch the density fall while the pressure stays the same.',
    ], formula: 'gas-density', lab: 'formula:gas-density' },
    { h: 'Why pilots care', body: [
      'On a hot day the air at an airfield is less dense even though the pressure is unchanged. Wings, propellers and engines all handle fewer kilograms of air, so take-off runs are longer and climbs are shallower.',
      'This is the physics behind **density altitude**.',
    ], note: 'Air behaves very nearly as an ideal gas in normal flight conditions. Water vapour lowers the density a little further, which this dry-air formula ignores.' },
  ],
  examples: [
    { title: 'Density on a hot day', steps: ['Pressure 101,325 Pa, temperature 35 °C.', 'T = 35 + 273.15 = 308.15 K.', 'ρ = 101,325 ÷ (287.05 × 308.15).', 'ρ ≈ 1.146 kg/m³ — about 6.5% less than on a 15 °C day.'] },
    { title: "Boyle's law", steps: ['2 m³ of gas at 100 kPa is compressed to 200 kPa at constant temperature.', 'p₁V₁ = p₂V₂ → V₂ = 100 × 2 ÷ 200.', 'V₂ = 1 m³.'] },
  ],
  practice: [
    num('Convert 15 °C to kelvin.', 288.15, 0.2, 'K', '15 + 273.15 = 288.15 K.'),
    num('p = 101,325 Pa and T = 288.15 K. Air density (R = 287.05)?', 1.225, 0.005, 'kg/m³', '101,325 ÷ (287.05 × 288.15) = 1.225 kg/m³.'),
    num('2 m³ of gas at 100 kPa is compressed to 200 kPa at constant temperature. New volume?', 1, 0.01, 'm³', 'V₂ = 100 × 2 ÷ 200 = 1 m³.', 'p × V stays constant.'),
    mcq('At constant pressure, if air temperature rises its density:', ['Decreases', 'Increases', 'Is unchanged', 'Doubles'], 'ρ = p ÷ (R × T). A larger T gives a smaller ρ.'),
    tf('Gas-law calculations can use temperatures in degrees Celsius directly.', false, 'They require absolute temperature in kelvin.'),
  ],
  assessment: [
    num('Convert −56.5 °C to kelvin.', 216.65, 0.2, 'K', '−56.5 + 273.15 = 216.65 K.'),
    num('p = 70,000 Pa and T = 273.15 K. Air density (R = 287.05)?', 0.893, 0.005, 'kg/m³', '70,000 ÷ (287.05 × 273.15) ≈ 0.893 kg/m³.'),
    num('3 m³ of gas at 300 K is heated to 400 K at constant pressure. New volume?', 4, 0.02, 'm³', 'V₂ = 3 × 400 ÷ 300 = 4 m³.'),
    mcq("Boyle's law states that at constant temperature:", ['Pressure × volume is constant', 'Volume ÷ temperature is constant', 'Pressure ÷ volume is constant', 'Density is constant'], 'p × V = constant.'),
    mcq('Two airfields have the same pressure. One is at 10 °C and the other at 35 °C. At the hotter airfield:', ['Air density is lower and the take-off run is longer', 'Air density is higher', 'Performance is the same', 'The take-off run is shorter'], 'Hotter air at the same pressure is less dense.'),
    tf('For dry air, density is proportional to pressure and inversely proportional to absolute temperature.', true, 'ρ = p ÷ (R × T).'),
  ],
  missionId: 'm-phys-gas', sources: ['phak', 'icao-7488'],
});

export const torque = lesson('Torque', {
  id: 'phys-torque', title: 'Torque and Moments', minutes: 10, level: 1, prereqs: ['phys-newton'],
  objectives: ['Define torque (moment) and its unit.', 'Calculate a moment with τ = F × d.', 'Apply the principle of moments to a balanced object.', 'Explain why the tail is placed far behind the wing.'],
  intro: 'A force can do more than push: applied away from a pivot, it turns things. Every pitch, roll and yaw of an aircraft is caused by a turning effect about its centre of gravity.',
  simple: 'Torque is the turning effect of a force. It equals the force times its distance from the pivot. A small force far from the pivot can balance a large force close to it.',
  sections: [
    { h: 'Turning effect', body: [
      'The **moment** or **torque** of a force about a pivot is `τ = F × d`, where **d** is the perpendicular distance from the pivot to the line of the force. This distance is the **moment arm**.',
      'The unit is the newton-metre (N·m). Push a door near its hinge and it barely moves; push at the handle and it swings easily — same force, longer arm.',
    ], formula: 'torque', lab: 'formula:torque' },
    { h: 'Balance: the principle of moments', body: [
      'An object does not start to rotate when the clockwise moments equal the anticlockwise moments.',
      'A 400 N load 1.5 m from a pivot is balanced by a 300 N load 2 m away on the other side: 400 × 1.5 = 600 and 300 × 2 = 600.',
      'For full **equilibrium** two things must be true: the net force is zero and the net moment is zero.',
    ] },
    { h: 'Moments on an aircraft', body: [
      'An aircraft rotates about its centre of gravity. The horizontal tail sits far behind it, so a small tail force has a long arm and produces a large pitching moment.',
      'The same idea underlies mass and balance: each item\'s moment is its weight times its arm from the datum.',
    ], note: 'A newton-metre of torque is not called a joule, even though the units look the same. Torque is a turning effect; energy is something different.' },
  ],
  examples: [
    { title: 'Spanner on a bolt', steps: ['A 50 N force is applied 0.4 m from the bolt.', 'τ = 50 × 0.4.', 'τ = 20 N·m.'] },
    { title: 'Tail force needed', steps: ['A pitching moment of 600 N·m must be balanced by the tail, 4 m behind the centre of gravity.', 'F = τ ÷ d = 600 ÷ 4.', 'F = 150 N.'] },
  ],
  practice: [
    num('A 50 N force acts 0.4 m from a pivot. Moment?', 20, 0.05, 'N·m', '50 × 0.4 = 20 N·m.'),
    num('A 400 N load is 1.5 m from a pivot. How far on the other side must a 300 N load be to balance it?', 2, 0.01, 'm', '400 × 1.5 = 600; 600 ÷ 300 = 2 m.', 'Make the two moments equal.'),
    mcq('The same force is applied with a longer moment arm. The torque:', ['Increases', 'Decreases', 'Is unchanged', 'Becomes zero'], 'τ = F × d.'),
    num('A moment of 600 N·m must be produced with an arm of 4 m. Force needed?', 150, 0.5, 'N', '600 ÷ 4 = 150 N.'),
    tf('The unit of torque is called the joule.', false, 'Torque is measured in newton-metres; the joule is reserved for energy.'),
  ],
  assessment: [
    num('A 200 N force acts 0.25 m from a pivot. Moment?', 50, 0.1, 'N·m', '200 × 0.25 = 50 N·m.'),
    num('A 500 N load is 2 m from a pivot. What force 4 m away on the other side balances it?', 250, 0.5, 'N', '500 × 2 = 1,000; 1,000 ÷ 4 = 250 N.'),
    num('A moment of 1,200 N·m is needed with an arm of 3 m. Force?', 400, 1, 'N', '1,200 ÷ 3 = 400 N.'),
    mcq('The moment arm is:', ['The perpendicular distance from the pivot to the line of the force', 'The length of the object', 'The distance travelled by the force', 'The weight of the object'], 'Only the perpendicular distance counts.'),
    tf('For equilibrium, both the net force and the net moment must be zero.', true, 'Otherwise the object would accelerate or begin to rotate.'),
    mcq('Why is the horizontal tail placed far behind the wing?', ['A long arm lets a small surface produce a large moment', 'To reduce the aircraft\'s weight', 'To increase thrust', 'To move the centre of gravity forward'], 'Moment = force × arm.'),
  ],
  missionId: 'm-phys-torque', sources: ['phak'],
});

export const drag = lesson('Drag', {
  id: 'phys-drag', title: 'Drag', minutes: 13, level: 2, prereqs: ['phys-lift'],
  objectives: ['Use the drag equation.', 'Distinguish parasite drag from induced drag.', 'Describe how each changes with airspeed.', 'Explain the significance of the minimum-drag speed.'],
  intro: 'Drag is the price of moving through air and of making lift. It decides how much thrust you need, how far you can glide, and how much fuel a flight will burn.',
  simple: 'Drag is the air\'s resistance to the aircraft. One kind grows quickly as you fly faster. The other kind comes from making lift and is worst when you fly slowly. In between is a speed where total drag is smallest.',
  sections: [
    { h: 'The drag equation', body: [
      '`D = ½ ρ V² S C_D`. It has the same form as the lift equation, with the **drag coefficient C_D** in place of C_L.',
      'At a fixed C_D, doubling the airspeed gives four times the drag.',
    ], formula: 'drag', lab: 'formula:drag' },
    { h: 'Parasite drag', body: [
      '**Parasite drag** is drag not connected with making lift. It includes **form drag** from the shape, **skin friction** from air rubbing along the surface, and **interference drag** where parts join.',
      'It rises with the square of airspeed. Extending the landing gear or flaps, or leaving a door ajar, adds parasite drag.',
    ] },
    { h: 'Induced drag', body: [
      '**Induced drag** is a by-product of lift. A wing that produces lift leaves swirling wingtip vortices and deflects the air downward, tilting the lift force slightly backward.',
      'It is greatest at **low speed and high angle of attack**, and it falls as speed increases — in the simple model, in proportion to 1 ÷ V².',
    ] },
    { h: 'Total drag and the minimum-drag speed', body: [
      'Add the two and you get a U-shaped total drag curve. At the bottom is the **minimum-drag speed**, where the lift-to-drag ratio is highest. This is the speed for the best glide distance in still air.',
      'In steady level flight thrust equals drag. Fly slower than the minimum-drag speed and the drag — and the thrust required — goes up again, not down.',
    ], note: 'The statement that parasite and induced drag are equal at the minimum-drag speed comes from the simple parabolic drag model. Real aircraft follow it closely at low speed but depart from it near the stall and at high Mach numbers.' },
  ],
  examples: [
    { title: 'Drag of a light aircraft', steps: ['ρ = 1.225 kg/m³, V = 50 m/s, S = 16 m², C_D = 0.03.', 'D = ½ × 1.225 × 50² × 16 × 0.03.', 'D = 735 N.', 'In level flight at that speed the propeller must supply 735 N of thrust.'] },
    { title: 'Parasite drag at double the speed', steps: ['Parasite drag is 300 N at 40 m/s.', 'At 80 m/s the speed has doubled, so V² is four times larger.', 'Parasite drag ≈ 1,200 N.'] },
  ],
  practice: [
    num('ρ = 1.225, V = 50 m/s, S = 16 m², C_D = 0.03. Drag?', 735, 3, 'N', '½ × 1.225 × 2,500 × 16 × 0.03 = 735 N.'),
    mcq('If airspeed doubles, parasite drag becomes:', ['Four times larger', 'Twice as large', 'Half as large', 'Unchanged'], 'Parasite drag is proportional to V².'),
    mcq('Induced drag is greatest:', ['At low airspeed and high angle of attack', 'At high airspeed', 'With the engine at idle', 'At the minimum-drag speed'], 'Induced drag falls as speed rises.'),
    mcq('The best glide distance in still air is obtained at:', ['The minimum-drag speed (best lift-to-drag ratio)', 'The stall speed', 'The maximum speed', 'Any speed'], 'Least drag for the lift produced gives the flattest glide.'),
    tf('Extending the landing gear increases parasite drag.', true, 'The gear adds form and interference drag.'),
  ],
  assessment: [
    num('ρ = 1.2, V = 40 m/s, S = 15 m², C_D = 0.04. Drag?', 576, 3, 'N', '½ × 1.2 × 1,600 × 15 × 0.04 = 576 N.'),
    mcq('If airspeed triples, parasite drag becomes:', ['Nine times larger', 'Three times larger', 'Six times larger', 'One third'], '3² = 9.'),
    mcq('Induced drag is caused by:', ['The production of lift', 'Skin friction', 'The landing gear', 'Engine cooling'], 'It comes from the downwash and wingtip vortices of a lifting wing.'),
    mcq('In steady level flight:', ['Thrust equals drag', 'Thrust is greater than drag', 'Drag is zero', 'Lift equals drag'], 'No acceleration means the forces along the flight path balance.'),
    tf('In the simple drag model, parasite drag and induced drag are equal at the minimum-drag speed.', true, 'That is where the two curves cross and their sum is smallest.'),
    mcq('An aircraft flies level at a speed below its minimum-drag speed and slows down further. Total drag:', ['Increases', 'Decreases', 'Is unchanged', 'Falls to zero'], 'Induced drag grows faster than parasite drag falls, so more thrust is needed.'),
    match('Match each type of drag to its cause.', [['Form drag', 'The shape of the aircraft'], ['Skin friction', 'Air rubbing along the surface'], ['Induced drag', 'Producing lift']], 'Form drag and skin friction are parasite drag; induced drag is linked to lift.'),
  ],
  missionId: 'm-phys-drag', sources: ['phak', 'afh'],
});
