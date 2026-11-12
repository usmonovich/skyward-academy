// ATPL — Principles of Flight 081 (4 lessons) and Airframe, Systems and Powerplant 021 (5 lessons).
// Written from memory of standard references; not verified against current documents.
import { lesson, mcq, num, tf } from './q';

export const shockWaves = lesson('Principles of flight', {
  id: 'atpl-shock-waves-and-wave-drag', title: 'Shock Waves and Wave Drag', minutes: 14, level: 3, prereqs: ['atpl-mach'],
  objectives: ['Explain how a shock wave forms on a wing below Mach 1.', 'Describe the changes across a normal shock wave.', 'Calculate the Mach angle.', 'Explain wave drag and drag divergence.'],
  intro: 'Prerequisite review: Mach number is true airspeed divided by the local speed of sound, and the critical Mach number is the flight Mach number at which airflow somewhere on the wing first reaches Mach 1. Airliners cruise just above that point, so what happens next shapes their wings, their speeds and their fuel bills.',
  simple: 'Air speeds up over the top of a wing. At high subsonic speed that air can become supersonic while the aircraft itself is not. It then slows back down through a sudden jump called a shock wave, which wastes energy and can make the air break away from the wing.',
  sections: [
    { h: 'Transonic flow', body: [
      'Above the **critical Mach number**, a region of supersonic flow forms on the upper surface. It ends in a **normal shock wave**, at right angles to the flow, through which the air returns to subsonic speed.',
      'As flight Mach number rises, the shock grows stronger and moves rearward.',
    ] },
    { h: 'Across a shock wave', body: [
      'Through a normal shock: velocity **decreases** (to subsonic), static pressure, density and temperature **increase**, and **total pressure decreases**. The loss of total pressure is energy turned into heat: this is the source of **wave drag**.',
      'The sudden pressure rise can also separate the boundary layer behind the shock, adding drag and causing buffet: the **shock stall**.',
    ] },
    { h: 'Drag divergence', body: [
      'A little above the critical Mach number, drag starts to rise very steeply. That speed is the **drag divergence Mach number**. Economical cruise is flown at or just below it.',
      'Supercritical aerofoils, with a flattened upper surface, weaken the shock and move drag divergence to a higher Mach number.',
    ] },
    { h: 'Supersonic waves', body: [
      'In supersonic flow, disturbances are confined within a **Mach cone**. Its half-angle, the **Mach angle**, is given by `sin μ = 1 ÷ M`. At Mach 2 it is 30°.',
      'A supersonic flow turned into itself forms an **oblique shock**; turned away from itself it forms an **expansion fan**, through which the flow accelerates.',
    ], formula: 'mach-angle', lab: 'formula:mach-angle', note: 'These are the idealised textbook relations. Real transonic flow over an aircraft is three-dimensional and far more complex.' },
  ],
  examples: [
    { title: 'Mach angle', steps: ['An aircraft flies at Mach 1.5.', 'sin μ = 1 ÷ 1.5 = 0.667.', 'μ ≈ 41.8°.'] },
    { title: 'Reading the flow', steps: ['At Mach 0.82 a wing has supersonic flow over its upper surface.', 'That flow must return to subsonic before the trailing edge.', 'It does so through a normal shock, with a jump in pressure.'] },
  ],
  practice: [
    num('What is the Mach angle at Mach 1.5 (sin μ = 1 ÷ M)?', 41.8, 0.2, '°', 'asin(0.667) ≈ 41.8°.'),
    mcq('Behind a normal shock wave, the flow is:', ['Subsonic', 'Supersonic', 'Stationary', 'Hypersonic'], 'A normal shock always returns the flow to subsonic speed.'),
    mcq('Wave drag is caused by:', ['Energy lost through shock waves', 'Wingtip vortices', 'Skin friction alone', 'The landing gear'], 'Total pressure is lost across the shock.'),
    mcq('A supercritical aerofoil is designed to:', ['Weaken the shock and delay drag divergence', 'Increase skin friction', 'Lower the stall speed only', 'Create a stronger shock'], 'Its upper surface is flatter.'),
    tf('A shock wave can form on a wing only when the aircraft itself is flying faster than Mach 1.', false, 'Local flow becomes supersonic above the critical Mach number, below Mach 1.'),
  ],
  assessment: [
    num('What is the Mach angle at Mach 2 (sin μ = 1 ÷ M)?', 30, 0.2, '°', 'asin(0.5) = 30°.'),
    num('What is the Mach angle at Mach 1.414 (sin μ = 1 ÷ M)?', 45, 0.3, '°', 'asin(0.707) ≈ 45°.'),
    mcq('Across a normal shock wave, static pressure:', ['Increases', 'Decreases', 'Is unchanged', 'Falls to zero'], 'Pressure, density and temperature all rise.'),
    mcq('Across a normal shock wave, total pressure:', ['Decreases', 'Increases', 'Is unchanged', 'Doubles'], 'The loss is the origin of wave drag.'),
    mcq('The critical Mach number is the flight Mach number at which:', ['Local airflow somewhere on the aircraft first reaches Mach 1', 'The aircraft reaches Mach 1', 'The engines flame out', 'The wing stalls at low speed'], 'It is below Mach 1.'),
    mcq('The drag divergence Mach number is the speed at which:', ['Drag begins to rise very steeply', 'Drag is at its minimum', 'Lift becomes zero', 'The shock disappears'], 'Economical cruise is at or just below it.'),
    mcq('Flow separation behind a shock wave is known as:', ['Shock stall', 'Deep stall', 'Compressor stall', 'Tip stall'], 'It causes high-speed buffet.'),
  ],
  missionId: 'm-atpl-shock', sources: ['phak'],
});

export const sweptWings = lesson('Principles of flight', {
  id: 'atpl-swept-wings', title: 'Swept Wings', minutes: 13, level: 3, prereqs: ['atpl-shock-waves-and-wave-drag'],
  objectives: ['Explain how sweep raises the critical Mach number.', 'Calculate the effect of sweep on critical Mach number.', 'Describe the low-speed disadvantages of sweep.', 'Explain tip stall and the devices that counter it.'],
  intro: 'Prerequisite review: drag rises steeply once shock waves form above the critical Mach number. Sweeping the wing back delays that point, which is why every jet airliner has swept wings, and why each of them needs so much help to fly slowly.',
  simple: 'A wing that is angled backward meets the air at a slant, so the air behaves as if the aircraft were flying slower. That lets the aircraft cruise faster before shock waves form. The price is a wing that makes less lift at low speed and tends to stall at the tips first.',
  sections: [
    { h: 'Why sweep works', body: [
      'Only the component of the airflow at right angles to the leading edge determines the pressure distribution: `effective Mach = M × cos(sweep)`.',
      'In the ideal case, the critical Mach number is raised to `M_crit(swept) = M_crit(straight) ÷ cos(sweep)`. A section with a critical Mach number of 0.70 swept by 30° gives about 0.81. In practice the gain is about half of this.',
    ], formula: 'sweep-mcrit', lab: 'formula:sweep-mcrit' },
    { h: 'The cost at low speed', body: [
      'For the same reason, a swept wing produces **less lift** at a given speed and angle of attack, and has a lower maximum lift coefficient. Take-off and landing speeds are higher, and powerful high-lift devices are needed.',
      'The lift curve is flatter: the stall is reached at a higher angle of attack and is less sharply defined.',
    ] },
    { h: 'Tip stall and pitch-up', body: [
      'On a swept wing the boundary layer drifts outward (**spanwise flow**) and thickens towards the tips, which are also more heavily loaded. The **tips stall first**.',
      'Because the tips are behind the centre of gravity, losing their lift moves the centre of pressure forward: the aircraft **pitches up**, deepening the stall. Ailerons, at the tips, also lose effectiveness.',
      'Counter-measures include **wing fences**, **vortex generators**, **washout** (less incidence at the tip) and leading-edge devices on the outer wing. Many types also have a stick pusher.',
    ] },
    { h: 'Stability', body: [
      'Sweep increases lateral stability, acting like dihedral. With modest directional stability this encourages **Dutch roll**, which is why swept-wing aircraft have yaw dampers.',
    ], note: 'The simple cosine relations are the ideal case used in examination questions. Actual values depend on the complete wing design.' },
  ],
  examples: [
    { title: 'Critical Mach number', steps: ['A straight wing section has M_crit = 0.75; the wing is swept 35°.', 'cos 35° = 0.819.', 'Ideal M_crit = 0.75 ÷ 0.819 ≈ 0.916.'] },
    { title: 'Effective Mach', steps: ['Flight Mach number 0.85, sweep 30°.', 'cos 30° = 0.866.', 'Effective Mach normal to the leading edge ≈ 0.736.'] },
  ],
  practice: [
    num('A section has M_crit of 0.75; the wing is swept 35°. Ideal swept M_crit (M_crit ÷ cos sweep)?', 0.916, 0.004, '', '0.75 ÷ 0.819 ≈ 0.916.'),
    mcq('Sweeping a wing back raises the critical Mach number because:', ['Only the flow component normal to the leading edge determines the pressures', 'The wing becomes heavier', 'The air becomes warmer', 'The engines produce more thrust'], 'The wing "sees" a lower Mach number.'),
    mcq('Compared with a straight wing, a swept wing at low speed has:', ['A lower maximum lift coefficient', 'A higher maximum lift coefficient', 'No stall', 'Less need for flaps'], 'Hence higher approach speeds and elaborate high-lift devices.'),
    mcq('A wing fence is fitted to:', ['Reduce spanwise flow of the boundary layer', 'Increase wave drag', 'Hold fuel', 'Support the engine'], 'It delays tip stall.'),
    tf('A swept wing tends to stall at the root first.', false, 'It tends to stall at the tips first.'),
  ],
  assessment: [
    num('A section has M_crit of 0.70; the wing is swept 30°. Ideal swept M_crit (M_crit ÷ cos sweep)?', 0.808, 0.004, '', '0.70 ÷ 0.866 ≈ 0.808.'),
    num('Flight Mach number 0.80, sweep 30°. Effective Mach number normal to the leading edge (M × cos sweep)?', 0.693, 0.004, '', '0.80 × 0.866 ≈ 0.693.'),
    mcq('Tip stall on a swept wing causes the aircraft to:', ['Pitch up', 'Pitch down', 'Yaw only', 'Accelerate'], 'Lift is lost behind the centre of gravity.'),
    mcq('Spanwise flow on a swept wing makes the boundary layer:', ['Thicker towards the tips', 'Thinner towards the tips', 'Disappear', 'Supersonic'], 'A thick boundary layer separates more easily.'),
    mcq('Washout means that the wing tip has:', ['Less incidence than the root', 'More incidence than the root', 'No aileron', 'A larger chord'], 'So the root reaches its stalling angle first.'),
    mcq('Wing sweep makes lateral stability:', ['Greater', 'Smaller', 'Unchanged', 'Negative'], 'It acts like dihedral, encouraging Dutch roll.'),
    tf('Swept-wing aircraft generally need higher approach speeds than straight-wing aircraft of similar size.', true, 'The swept wing produces less lift at low speed.'),
  ],
  missionId: 'm-atpl-sweep', sources: ['phak'],
});

export const machTuck = lesson('Principles of flight', {
  id: 'atpl-high-speed-stability-and-mach-tuck', title: 'High-Speed Stability and Mach Tuck', minutes: 13, level: 3, prereqs: ['atpl-swept-wings'],
  objectives: ['Explain Mach tuck.', 'Describe the Mach trimmer.', 'Define VMO and MMO and the crossover altitude.', 'Calculate true airspeed from Mach number and temperature.'],
  intro: 'Prerequisite review: above the critical Mach number a shock forms on the wing and moves rearward as speed increases, and swept wings load their tips heavily. Together these change the way an aircraft balances at high Mach number, in a direction that makes an overspeed worse.',
  simple: 'As a jet gets faster in the transonic range, the lift on its wing shifts backward and the tail gets less downward push. The nose wants to drop, which makes the aircraft go faster still. A small automatic system trims against this.',
  sections: [
    { h: 'Mach tuck', body: [
      'As Mach number rises above the critical value, the shock wave and the **centre of pressure move aft**. On a swept wing the shock tends to form first at the root, reducing lift ahead of the centre of gravity and reducing **downwash on the tailplane**.',
      'Both effects produce a **nose-down** pitching moment that grows with Mach number: **Mach tuck**, or tuck-under. Left alone, the nose drops, speed rises, and the tuck increases.',
    ] },
    { h: 'Mach trim', body: [
      'A **Mach trimmer** automatically adjusts the stabiliser or elevator as a function of Mach number, so that the aircraft keeps a normal stick-force gradient. If it is inoperative, the maximum operating Mach number is usually reduced.',
    ] },
    { h: 'Speed limits', body: [
      '**V_MO** is the maximum operating speed as an indicated airspeed; **M_MO** is the maximum operating Mach number. At low altitude V_MO is limiting; at high altitude M_MO is.',
      'In a climb at constant indicated airspeed the Mach number rises. The altitude at which the climb speed changes from a fixed airspeed to a fixed Mach number is the **crossover altitude**.',
      'Exceeding the limits risks high-speed buffet, loss of control effectiveness and structural damage.',
    ] },
    { h: 'Mach and true airspeed', body: [
      'The local speed of sound in knots is `38.94 × √T`, with T in kelvin. So `TAS = M × 38.94 × √T`. At Mach 0.80 and −56.5 °C (216.65 K), the true airspeed is about 459 kt.',
    ], formula: 'mach-tas', lab: 'formula:mach-tas', note: 'Limiting speeds and Mach trim details are type-specific and are given in the aircraft flight manual.' },
  ],
  examples: [
    { title: 'True airspeed', steps: ['Mach 0.82 at −50 °C, which is 223.15 K.', '√223.15 = 14.94; speed of sound = 38.94 × 14.94 ≈ 581.7 kt.', 'TAS = 0.82 × 581.7 ≈ 477 kt.'] },
    { title: 'Overspeed', steps: ['In a descent the Mach number creeps above M_MO and the nose begins to feel heavy.', 'Mach tuck is adding a nose-down moment.', 'Reduce thrust, use speedbrake as permitted and ease the nose up smoothly.'] },
  ],
  practice: [
    num('Mach 0.82 at 223.15 K. True airspeed (M × 38.94 × √T)?', 477, 1.5, 'kt', '0.82 × 581.7 ≈ 477 kt.'),
    mcq('Mach tuck is a tendency for the aircraft to:', ['Pitch nose-down as Mach number increases', 'Pitch nose-up as Mach number increases', 'Roll to the left', 'Yaw to the right'], 'The centre of pressure moves aft and tail downwash is reduced.'),
    mcq('A Mach trimmer:', ['Automatically trims against Mach tuck', 'Limits engine thrust', 'Controls the cabin pressure', 'Extends the flaps'], 'It restores a normal stick-force gradient.'),
    mcq('M_MO is the:', ['Maximum operating Mach number', 'Minimum operating Mach number', 'Mach number for best range', 'Critical Mach number'], 'The high-altitude speed limit.'),
    tf('At high altitude the limiting speed is normally V_MO, not M_MO.', false, 'At high altitude M_MO is reached first.'),
  ],
  assessment: [
    num('Mach 0.80 at 216.65 K. True airspeed (M × 38.94 × √T)?', 458.5, 1.5, 'kt', '0.80 × 573.2 ≈ 458.5 kt.'),
    num('Mach 0.78 at 233.15 K. True airspeed (M × 38.94 × √T)?', 463.8, 1.5, 'kt', '0.78 × 594.6 ≈ 463.8 kt.'),
    mcq('Mach tuck is caused mainly by:', ['Rearward movement of the centre of pressure and reduced downwash on the tailplane', 'An increase in engine thrust', 'Fuel moving aft', 'Flap extension'], 'Both give a nose-down moment.'),
    mcq('If the Mach trimmer is inoperative, the usual consequence is:', ['A reduced maximum operating Mach number', 'A higher maximum operating Mach number', 'No change', 'A ban on flight below 10,000 ft'], 'To stay clear of the Mach tuck region.'),
    mcq('In a climb at constant indicated airspeed, the Mach number:', ['Increases', 'Decreases', 'Stays constant', 'Becomes zero'], 'True airspeed rises while the speed of sound falls.'),
    mcq('The crossover altitude is where:', ['The climb speed changes from a fixed airspeed to a fixed Mach number', 'The aircraft crosses the tropopause', 'Two airways cross', 'Cabin altitude equals aircraft altitude'], 'Above it the Mach limit governs.'),
    tf('Left uncorrected, Mach tuck tends to increase speed further.', true, 'The nose drops and the aircraft accelerates.'),
  ],
  missionId: 'm-atpl-tuck', sources: ['phak'],
});

export const buffetMargins = lesson('Principles of flight', {
  id: 'atpl-buffet-margins', title: 'Buffet Margins', minutes: 12, level: 3, prereqs: ['atpl-high-speed-stability-and-mach-tuck', 'ppl-stalling-and-spinning'],
  objectives: ['Distinguish low-speed from high-speed buffet.', 'Explain the aerodynamic ceiling ("coffin corner").', 'Relate bank angle to load factor and buffet margin.', 'State how weight and altitude affect the margin.'],
  intro: 'Prerequisite review: stall speed rises with load factor, and at high Mach number shock-induced separation causes buffet. At cruise altitude these two limits approach each other, and the gap between them is one of the most important numbers an airline crew watches.',
  simple: 'High up, a jet can only fly in a narrow band of speeds. Too slow and the wing stalls; too fast and shock waves shake it. The higher and heavier the aircraft, the narrower the band. Turning or turbulence narrows it further.',
  sections: [
    { h: 'Two kinds of buffet', body: [
      '**Low-speed buffet** is the approach to the conventional stall: the angle of attack is too high. **High-speed buffet** is caused by shock-induced separation as Mach number rises too far.',
    ] },
    { h: 'The aerodynamic ceiling', body: [
      'As altitude increases, the indicated stall speed corresponds to a higher and higher Mach number, while the Mach limit corresponds to a lower and lower indicated airspeed. The two boundaries converge.',
      'The altitude at which they meet is the **aerodynamic ceiling**, known as **coffin corner**: any change of speed, up or down, produces buffet.',
    ] },
    { h: 'Margins', body: [
      'Operators require a **buffet margin** so that manoeuvring and turbulence do not take the aircraft to either boundary. A common requirement is a margin to **1.3 g**, which corresponds to about **40° of bank** in a level turn, since `load factor = 1 ÷ cos(bank)`.',
      'A **higher weight** or a **higher altitude** reduces the margin. That is why the maximum cruise altitude is lower at the start of a flight and rises as fuel is burned.',
    ], formula: 'load-factor', lab: 'formula:load-factor' },
    { h: 'In turbulence', body: [
      'Gusts change both speed and load factor. In turbulence at altitude, fly the turbulence penetration speed, avoid steep turns, and consider a lower level to widen the margin.',
    ], note: 'The actual buffet boundaries for each weight, altitude and Mach number are given in the aircraft\'s performance data. The 1.3 g figure is a commonly used margin, quoted from memory.' },
  ],
  examples: [
    { title: 'Load factor in a turn', steps: ['A level turn at 30° of bank.', 'cos 30° = 0.866.', 'Load factor = 1 ÷ 0.866 ≈ 1.15 g.'] },
    { title: 'Choosing a level', steps: ['Early in the flight, the planned level leaves only a 1.2 g buffet margin.', 'That is below the operator\'s 1.3 g requirement.', 'Cruise lower until fuel burn has reduced the weight.'] },
  ],
  practice: [
    num('Load factor in a level turn at 30° of bank (1 ÷ cos bank)?', 1.155, 0.01, 'g', '1 ÷ 0.866 ≈ 1.155.'),
    mcq('High-speed buffet is caused by:', ['Shock-induced flow separation', 'Too high an angle of attack at low speed', 'Engine vibration', 'Landing gear extension'], 'It occurs as Mach number rises too far.'),
    mcq('"Coffin corner" is the altitude at which:', ['Low-speed and high-speed buffet boundaries meet', 'The cabin altitude warning sounds', 'Contrails form', 'The engines reach idle'], 'The aerodynamic ceiling.'),
    mcq('As fuel is burned and weight falls, the maximum cruise altitude with adequate buffet margin:', ['Increases', 'Decreases', 'Is unchanged', 'Becomes zero'], 'A lighter aircraft has a wider margin.'),
    tf('A steep turn at high cruise altitude widens the buffet margin.', false, 'The added load factor narrows it.'),
  ],
  assessment: [
    num('Load factor in a level turn at 40° of bank (1 ÷ cos bank)?', 1.305, 0.01, 'g', '1 ÷ 0.766 ≈ 1.305.'),
    num('Load factor in a level turn at 60° of bank (1 ÷ cos bank)?', 2, 0.01, 'g', '1 ÷ 0.5 = 2.'),
    mcq('Low-speed buffet is the approach to:', ['The conventional stall', 'The shock stall', 'Mach tuck', 'Engine surge'], 'The angle of attack is too high.'),
    mcq('As altitude increases, the gap between the low-speed and high-speed buffet boundaries:', ['Narrows', 'Widens', 'Is unchanged', 'Reverses'], 'They meet at the aerodynamic ceiling.'),
    mcq('A buffet margin of 1.3 g corresponds to a level turn of about:', ['40° of bank', '15° of bank', '60° of bank', '75° of bank'], '1 ÷ cos 40° ≈ 1.3.'),
    mcq('A heavier aircraft at the same altitude has a buffet margin that is:', ['Smaller', 'Larger', 'The same', 'Unlimited'], 'More lift is needed, closer to both boundaries.'),
    mcq('In turbulence at high altitude, a sensible way to increase the buffet margin is to:', ['Descend to a lower level', 'Climb to a higher level', 'Increase bank angle', 'Accelerate to the Mach limit'], 'The boundaries are further apart lower down.'),
  ],
  missionId: 'm-atpl-buffet', sources: ['phak'],
});

export const hydGear = lesson('Aircraft systems', {
  id: 'atpl-hydraulics-and-landing-gear', title: 'Hydraulics and Landing Gear', minutes: 13, level: 3, prereqs: ['cpl-hydraulic-systems'],
  objectives: ['Describe the hydraulic architecture of a transport aircraft.', 'Describe landing gear operation and alternate extension.', 'Explain anti-skid and autobrake.', 'Explain brake energy and fusible plugs.'],
  intro: 'Prerequisite review: hydraulic force is pressure times area, and aircraft carry more than one system for redundancy. On an airliner those systems move everything heavy, and the brakes must turn the energy of a landing aircraft into heat within a few hundred metres.',
  simple: 'An airliner has several separate hydraulic systems so that one leak does not stop the flight controls or the wheels from working. The wheels can be lowered without power if needed. The brakes are controlled automatically to stop the tyres from locking.',
  sections: [
    { h: 'Hydraulic architecture', body: [
      'Transport aircraft typically have **three independent hydraulic systems**, pressurised by engine-driven and electric pumps. Critical services are fed by more than one system.',
      'Back-up power sources include a **power transfer unit**, which lets one system drive another without exchanging fluid, and a **ram air turbine**, which deploys into the airflow if normal power is lost.',
      '**Hydraulic fuses** close a line if they detect excessive flow, so a burst pipe does not drain the system.',
    ] },
    { h: 'Landing gear', body: [
      'The gear is retracted and extended hydraulically and held by mechanical **uplocks** and **downlocks**. Position is shown by lights: typically green for down and locked, red or amber for in transit or disagreement.',
      'If normal extension fails, **alternate extension** releases the uplocks so the gear falls by gravity and airflow.',
      '**Weight-on-wheels** sensors tell many systems whether the aircraft is on the ground.',
    ], lab: 'explore:gear-brakes' },
    { h: 'Brakes', body: [
      'Multi-disc brakes, often carbon, convert kinetic energy into heat. **Anti-skid** releases brake pressure on any wheel that is about to lock, giving maximum braking without skidding. **Autobrake** applies a selected deceleration automatically after touchdown or in a rejected take-off.',
      'After a heavy stop the brakes may be extremely hot. **Fusible plugs** in the wheels melt to release tyre pressure before a tyre can burst.',
    ] },
    { h: 'Brake energy', body: [
      'The energy to be absorbed is the aircraft\'s kinetic energy, `½ × m × V²`: it grows with the square of speed. A rejected take-off at high mass and high speed is the most demanding case, and sets a brake energy limit on take-off mass.',
    ], note: 'System layouts differ between aircraft types. The flight crew operating manual for the type is the authority.' },
  ],
  examples: [
    { title: 'Gear will not extend', steps: ['Normal extension fails and one gear shows no green light.', 'Use the alternate extension procedure.', 'The uplocks release and the gear falls by gravity.'] },
    { title: 'After a rejected take-off', steps: ['A high-speed rejected take-off has just been made.', 'Brake temperatures are very high.', 'Follow the cooling procedure; fusible plugs may deflate the tyres.'] },
  ],
  practice: [
    mcq('Transport aircraft typically have how many independent hydraulic systems?', ['Three', 'One', 'Ten', 'None'], 'For redundancy.'),
    mcq('A ram air turbine provides:', ['Emergency power from the airflow', 'Extra thrust', 'Cabin air', 'Fuel transfer'], 'It deploys if normal power is lost.'),
    mcq('Anti-skid works by:', ['Releasing brake pressure on a wheel that is about to lock', 'Locking all the wheels', 'Deflating the tyres', 'Reversing the engines'], 'It keeps the tyres at the point of maximum grip.'),
    mcq('Alternate landing gear extension relies on:', ['Gravity and airflow', 'Engine thrust', 'The autopilot', 'Cabin pressure'], 'The uplocks are released.'),
    tf('Brake energy in a stop is proportional to speed, not to speed squared.', false, 'Kinetic energy depends on the square of speed.'),
  ],
  assessment: [
    mcq('A power transfer unit:', ['Lets one hydraulic system drive another without exchanging fluid', 'Mixes the fluids of two systems', 'Generates electricity for the cabin', 'Transfers fuel between tanks'], 'A hydraulic motor in one system drives a pump in the other.'),
    mcq('A hydraulic fuse:', ['Closes a line when flow is excessive, limiting fluid loss', 'Melts when the fluid is hot', 'Protects electrical wiring', 'Increases system pressure'], 'It isolates a burst pipe.'),
    mcq('The landing gear is held in the retracted position by:', ['Mechanical uplocks', 'Hydraulic pressure alone at all times', 'The tyres', 'Cabin pressure'], 'Downlocks hold it extended.'),
    mcq('Autobrake:', ['Applies a selected deceleration automatically', 'Prevents the gear from retracting', 'Steers the nose wheel', 'Cools the brakes'], 'On landing or in a rejected take-off.'),
    mcq('Fusible plugs in the wheels:', ['Melt to release tyre pressure when the wheel is very hot', 'Hold the brake pads', 'Measure tyre wear', 'Lock the wheel'], 'They prevent a tyre burst.'),
    mcq('The most demanding case for brake energy is:', ['A rejected take-off at high mass and high speed', 'A normal landing at low mass', 'Taxiing', 'Parking'], 'Energy is ½ × m × V².'),
    tf('Weight-on-wheels sensors tell aircraft systems whether the aircraft is on the ground.', true, 'Many systems change behaviour between air and ground.'),
  ],
  missionId: 'm-atpl-gear', sources: ['phak'],
});

export const flightControls = lesson('Aircraft systems', {
  id: 'atpl-flight-control-systems', title: 'Flight Control Systems', minutes: 13, level: 3, prereqs: ['atpl-hydraulics-and-landing-gear', 'cpl-stability-and-control'],
  objectives: ['Distinguish reversible from powered flight controls.', 'Explain artificial feel.', 'Describe fly-by-wire and envelope protection.', 'Describe spoilers and the trimmable stabiliser.'],
  intro: 'Prerequisite review: control forces come from the air acting on the control surfaces, and stability shows up as stick force. On a large, fast aircraft those forces are far beyond human strength, so the pilot\'s hands no longer move the surfaces directly, and feel has to be manufactured.',
  simple: 'On small aircraft, cables connect the controls to the surfaces. On airliners, hydraulic jacks do the moving and the pilot only sends the command. Springs or computers give the controls a realistic weight. On the newest aircraft, computers also stop the pilot from exceeding safe limits.',
  sections: [
    { h: 'Powered controls', body: [
      'In a **reversible** (manual) system, air loads on the surface are felt directly in the controls. In a **powered, irreversible** system, hydraulic actuators move the surfaces and no air load comes back to the pilot.',
      '**Artificial feel** is therefore added, commonly increasing with dynamic pressure (**q-feel**), so that controls feel heavier at high speed and the pilot is not tempted to overstress the aircraft.',
    ] },
    { h: 'Fly-by-wire', body: [
      'In **fly-by-wire**, the pilot\'s inputs are electrical signals to flight control computers, which command the actuators. **Control laws** decide how the aircraft responds.',
      '**Envelope protection** can prevent excessive angle of attack, load factor, bank, pitch or speed. Several computers and power sources provide redundancy; with failures, the system degrades to simpler laws with fewer protections.',
    ], lab: 'explore:flight-controls' },
    { h: 'Secondary controls', body: [
      '**Spoilers** on the upper wing surface reduce lift and add drag. They assist the ailerons in roll, act as **speedbrakes** in flight, and as **ground spoilers** dump lift after landing so that the weight goes onto the wheels and the brakes work.',
      'Pitch trim is provided by a **trimmable horizontal stabiliser**, which moves the whole tailplane and keeps the elevator free for control.',
      'A **rudder limiter** reduces available rudder travel as speed increases, to protect the fin from overload.',
    ] },
    { h: 'Why it matters', body: [
      'A mis-set stabiliser can make rotation at take-off impossible or uncontrollable, which is why the trim setting is checked against the load sheet before every departure.',
    ], note: 'Control laws and protections differ between manufacturers and types. Type training covers the system fitted.' },
  ],
  examples: [
    { title: 'After touchdown', steps: ['The main wheels touch down.', 'Ground spoilers deploy and lift is dumped.', 'Weight transfers to the wheels and braking becomes effective.'] },
    { title: 'Trim before take-off', steps: ['The load sheet gives a centre of gravity and a stabiliser trim setting.', 'The crew sets and cross-checks the trim.', 'A wrong setting could prevent a normal rotation.'] },
  ],
  practice: [
    mcq('In a powered, irreversible control system, the pilot feels air loads:', ['Not at all, so artificial feel is added', 'Directly through the cables', 'Only at low speed', 'Only on the rudder'], 'The actuators isolate the pilot from the surface loads.'),
    mcq('Ground spoilers are deployed after landing to:', ['Dump lift and put weight on the wheels', 'Increase lift', 'Cool the brakes', 'Steer the aircraft'], 'Braking depends on weight on the wheels.'),
    mcq('In fly-by-wire, the pilot\'s inputs are sent as:', ['Electrical signals to flight control computers', 'Cable tension', 'Hydraulic pressure from the control column', 'Radio signals'], 'The computers command the actuators.'),
    mcq('A trimmable horizontal stabiliser provides:', ['Pitch trim by moving the whole tailplane', 'Roll trim', 'Yaw damping', 'Engine control'], 'The elevator stays available for control.'),
    tf('A rudder limiter increases available rudder travel as speed increases.', false, 'It reduces travel to protect the fin.'),
  ],
  assessment: [
    mcq('Artificial feel is needed in powered control systems because:', ['No aerodynamic load is fed back to the pilot', 'The controls are too heavy', 'The cables stretch', 'The hydraulics are noisy'], 'Without it the pilot could overstress the aircraft.'),
    mcq('Q-feel makes the controls feel:', ['Heavier as dynamic pressure increases', 'Lighter as speed increases', 'The same at all speeds', 'Heavier only on the ground'], 'It mimics natural control forces.'),
    mcq('Envelope protection in a fly-by-wire aircraft can prevent:', ['Excessive angle of attack, load factor or bank', 'Fuel exhaustion', 'Bird strikes', 'Tyre wear'], 'Within the normal control law.'),
    mcq('Used in flight on both wings together, spoilers act as:', ['Speedbrakes', 'Flaps', 'Slats', 'Trim tabs'], 'They reduce lift and add drag.'),
    mcq('Spoilers assist roll control by:', ['Rising on the down-going wing', 'Rising on both wings equally', 'Lowering the flaps', 'Moving the rudder'], 'Lift is reduced on that side.'),
    mcq('After multiple failures, a fly-by-wire system typically:', ['Degrades to simpler control laws with fewer protections', 'Stops responding entirely', 'Adds more protections', 'Hands control to the passengers'], 'Redundancy allows continued control.'),
    tf('The stabiliser trim setting for take-off is derived from the load sheet.', true, 'It depends on the centre of gravity.'),
  ],
  missionId: 'm-atpl-fbw', sources: ['phak'],
});

export const pneumatics = lesson('Aircraft systems', {
  id: 'atpl-pneumatics-and-pressurisation', title: 'Pneumatics and Pressurisation', minutes: 13, level: 3, prereqs: ['cpl-pressurisation-basics'],
  objectives: ['Name the sources and uses of bleed air.', 'Describe the air conditioning pack.', 'Calculate cabin differential pressure.', 'Describe passenger and crew oxygen systems.'],
  intro: 'Prerequisite review: a cabin is pressurised by a steady inflow of air and a controlled outflow, and after a decompression the masks go on first. On a jet, that air starts life inside the engines, and the same supply does several other jobs on the way.',
  simple: 'Hot, high-pressure air is tapped from the engines. It is cooled and fed into the cabin, and also used to stop ice forming and to start the engines. A valve at the back of the cabin lets air out to hold the pressure steady.',
  sections: [
    { h: 'Bleed air', body: [
      '**Bleed air** is taken from the engine compressors. It can also come from the **auxiliary power unit** (APU) or a ground cart.',
      'It is used for **air conditioning and pressurisation**, **wing and engine anti-icing**, **engine starting**, and to pressurise hydraulic reservoirs and water tanks.',
      'Taking bleed air reduces engine thrust, so performance figures depend on which bleeds are on.',
    ] },
    { h: 'Air conditioning packs', body: [
      'A **pack** cools the hot bleed air using heat exchangers and an **air cycle machine**, in which the air does work in a turbine and cools as it expands. Conditioned air is mixed with recirculated cabin air.',
    ] },
    { h: 'Pressurisation control', body: [
      'The **outflow valve** regulates the air leaving the cabin. An automatic controller schedules cabin altitude against aircraft altitude, keeping the **differential pressure** within the structural limit and the cabin altitude at or below about 8,000 ft.',
      '`differential = cabin pressure − outside pressure`. With 780 hPa in the cabin and 200 hPa outside, the differential is 580 hPa.',
    ], formula: 'diff-pressure', lab: 'formula:diff-pressure' },
    { h: 'Oxygen', body: [
      'Flight crew use quick-donning masks fed from **gaseous oxygen** bottles. Passenger masks drop automatically at a high cabin altitude and are usually fed by **chemical oxygen generators**, which run for a limited time, long enough for an emergency descent.',
      'A bleed air **duct leak** is detected by overheat sensors and isolated by closing valves.',
    ], note: 'Newer designs use electrically driven compressors instead of engine bleed air. Limits and durations are type-specific.' },
  ],
  examples: [
    { title: 'Differential pressure', steps: ['Cabin pressure 800 hPa, outside 250 hPa.', '800 − 250.', 'Differential = 550 hPa.'] },
    { title: 'Performance with anti-ice on', steps: ['Engine and wing anti-ice are selected on for take-off.', 'More bleed air is taken from the engines.', 'Thrust is lower: use the performance figures for anti-ice on.'] },
  ],
  practice: [
    num('Cabin pressure 800 hPa, outside pressure 250 hPa. Differential?', 550, 1, 'hPa', '800 − 250 = 550 hPa.'),
    mcq('Bleed air is taken from:', ['The engine compressors', 'The fuel tanks', 'The hydraulic reservoirs', 'The tyres'], 'Also from the APU or a ground cart.'),
    mcq('An air conditioning pack:', ['Cools bleed air for the cabin', 'Heats the fuel', 'Generates electricity', 'Raises the landing gear'], 'Using heat exchangers and an air cycle machine.'),
    mcq('Passenger oxygen masks are usually supplied by:', ['Chemical oxygen generators', 'The engines', 'The hydraulic system', 'Cabin air'], 'They run for a limited time.'),
    tf('Selecting engine anti-ice on has no effect on engine thrust.', false, 'Bleed air extraction reduces thrust.'),
  ],
  assessment: [
    num('Cabin pressure 780 hPa, outside pressure 200 hPa. Differential?', 580, 1, 'hPa', '780 − 200 = 580 hPa.'),
    mcq('Which of these is a use of bleed air?', ['Wing anti-icing', 'Navigation', 'Radio communication', 'Fuel measurement'], 'Also air conditioning, pressurisation and engine starting.'),
    mcq('In an air cycle machine, the air is cooled by:', ['Expanding through a turbine', 'Passing through the engine', 'Mixing with fuel', 'Being compressed further only'], 'It does work and loses temperature.'),
    mcq('Cabin pressure is regulated by:', ['The outflow valve', 'The fuel control unit', 'The autobrake', 'The yaw damper'], 'It controls how much air leaves the cabin.'),
    mcq('Flight crew oxygen is normally supplied from:', ['Gaseous oxygen bottles', 'Chemical generators in the seat backs', 'The air conditioning packs', 'The APU exhaust'], 'With quick-donning masks.'),
    mcq('A bleed air duct leak is detected by:', ['Overheat sensors along the duct', 'The fuel gauges', 'The radio altimeter', 'The passengers'], 'The leak is then isolated by closing valves.'),
    tf('The auxiliary power unit can supply bleed air.', true, 'For air conditioning on the ground and for engine starting.'),
  ],
  missionId: 'm-atpl-bleed', sources: ['phak'],
});

export const gasTurbines = lesson('Aircraft systems', {
  id: 'atpl-gas-turbine-engines', title: 'Gas Turbine Engines', minutes: 14, level: 3, prereqs: ['cpl-powerplants'],
  objectives: ['Describe the turbofan and its spools.', 'Calculate bypass ratio.', 'Explain compressor stall and surge.', 'Describe thrust rating, reversers and electronic engine control.'],
  intro: 'Prerequisite review: a gas turbine compresses air, burns fuel in it continuously and extracts energy in a turbine. The engines on an airliner take that idea and wrap a very large fan around it, because moving a lot of air gently is far more efficient than moving a little air violently.',
  simple: 'A turbofan has a big fan at the front. Most of the air it moves goes round the outside of the engine core and produces most of the thrust quietly and efficiently. The core burns the fuel and drives the fan.',
  sections: [
    { h: 'The turbofan', body: [
      'A **turbofan** has a large fan driven by a turbine. Part of the airflow passes through the **core** (compressors, combustion chamber, turbines); the rest **bypasses** it.',
      '`bypass ratio = bypass mass flow ÷ core mass flow`. With 500 kg/s bypassing and 100 kg/s through the core, the ratio is 5. High-bypass engines are more fuel-efficient and quieter.',
      'Most engines have two or three concentric **spools**. **N1** is the speed of the low-pressure spool, which includes the fan; **N2** is the high-pressure spool.',
    ], formula: 'bypass', lab: 'formula:bypass' },
    { h: 'Indications and limits', body: [
      'Thrust is set using **N1** or **engine pressure ratio** (EPR). **Exhaust gas temperature** (EGT) is the main temperature limit.',
      'Thrust falls with altitude and with rising air temperature. Many engines are **flat-rated**: they give constant rated thrust up to a certain outside temperature, above which thrust reduces.',
    ] },
    { h: 'Stall and surge', body: [
      'A **compressor stall** is a breakdown of airflow over the compressor blades, like a wing stall. A **surge** is a complete breakdown, with flow reversing: it shows as a loud bang, fluctuating parameters and rising EGT.',
      'Variable stator vanes and bleed valves keep the compressor away from the stall line.',
    ] },
    { h: 'Control and reverse', body: [
      '**FADEC** (full authority digital engine control) manages fuel flow and protects the engine limits. **Thrust reversers** redirect airflow forward after landing; on high-bypass engines it is usually the fan airflow that is reversed.',
    ], note: 'Engine limits, ratings and handling are type-specific and are given in the aircraft flight manual.' },
  ],
  examples: [
    { title: 'Bypass ratio', steps: ['Bypass flow 660 kg/s, core flow 60 kg/s.', '660 ÷ 60.', 'Bypass ratio = 11.'] },
    { title: 'Surge', steps: ['There is a loud bang, N1 fluctuates and EGT rises quickly.', 'These are the signs of a compressor surge.', 'Follow the checklist, which typically starts by reducing thrust on that engine.'] },
  ],
  practice: [
    num('Bypass flow 660 kg/s, core flow 60 kg/s. Bypass ratio?', 11, 0.05, '', '660 ÷ 60 = 11.'),
    mcq('N1 is the rotational speed of:', ['The low-pressure spool, which includes the fan', 'The high-pressure spool', 'The APU', 'The generator'], 'N2 is the high-pressure spool.'),
    mcq('EGT stands for:', ['Exhaust gas temperature', 'Engine ground test', 'Electrical generator trip', 'Estimated ground time'], 'The main temperature limit.'),
    mcq('FADEC is:', ['Full authority digital engine control', 'A fuel additive', 'A fire extinguisher', 'A flap setting'], 'It manages fuel flow and protects limits.'),
    tf('High-bypass turbofans are noisier than low-bypass engines.', false, 'They are quieter and more fuel-efficient.'),
  ],
  assessment: [
    num('Bypass flow 500 kg/s, core flow 100 kg/s. Bypass ratio?', 5, 0.05, '', '500 ÷ 100 = 5.'),
    num('Bypass flow 880 kg/s, core flow 80 kg/s. Bypass ratio?', 11, 0.05, '', '880 ÷ 80 = 11.'),
    mcq('In a high-bypass turbofan, most of the thrust comes from:', ['The bypass (fan) airflow', 'The core exhaust', 'The compressor bleed', 'The gearbox'], 'A large mass of air accelerated gently.'),
    mcq('A compressor surge is:', ['A complete breakdown of compressor airflow, with flow reversal', 'A normal acceleration', 'A fuel leak', 'An electrical fault'], 'It shows as a bang, fluctuating parameters and rising EGT.'),
    mcq('A flat-rated engine gives:', ['Constant rated thrust up to a certain outside temperature', 'More thrust as temperature rises', 'No thrust above sea level', 'Thrust proportional to fuel price'], 'Above that temperature, thrust reduces.'),
    mcq('Thrust reversers on a high-bypass engine usually:', ['Redirect the fan airflow forward', 'Reverse the rotation of the engine', 'Shut the engine down', 'Increase the bypass ratio'], 'They help the aircraft slow down after landing.'),
    tf('Engine thrust decreases as altitude increases.', true, 'Air density falls.'),
  ],
  missionId: 'm-atpl-turbofan', sources: ['phak'],
});

export const electricsFuel = lesson('Aircraft systems', {
  id: 'atpl-electrics-and-fuel-systems', title: 'Electrics and Fuel Systems', minutes: 13, level: 3, prereqs: ['cpl-electrical-systems'],
  objectives: ['Describe the AC generation system of a transport aircraft.', 'Describe emergency electrical sources.', 'Describe fuel tank arrangement and the order of use.', 'Convert fuel volume to mass.'],
  intro: 'Prerequisite review: larger aircraft generate 115 V AC at 400 Hz, convert some of it to DC, and shed loads when sources are lost. Fuel is the other great system: on a long flight it may be almost half the weight of the aircraft, and where it sits affects the structure and the balance.',
  simple: 'Each engine drives a generator, and a small extra engine in the tail can provide a spare. If all of those fail, a battery and sometimes a small windmill keep the essentials going. Fuel is carried mostly in the wings, and the order in which the tanks are used is chosen to protect the wing structure.',
  sections: [
    { h: 'Generation', body: [
      'Each engine drives an **integrated drive generator** (IDG): a constant-speed drive and a generator in one unit, producing three-phase 115 V AC at 400 Hz. The **APU generator** can replace a failed generator.',
      'AC buses are normally fed separately and joined through **bus tie** breakers if a source is lost. Transformer rectifier units supply the DC buses.',
    ] },
    { h: 'Emergency power', body: [
      'If all generators are lost, the **batteries** supply essential DC loads and, through a **static inverter**, essential AC loads, for a limited time. Many aircraft also have a **ram air turbine** driving an emergency generator.',
    ] },
    { h: 'Fuel system', body: [
      'Fuel is carried in **wing tanks** and often a **centre tank**. **Booster pumps** in the tanks feed the engines; **crossfeed** lets any tank feed any engine.',
      'Centre tank fuel is normally used **first**. Fuel in the wings opposes the upward bending caused by lift, so keeping wing fuel as long as possible relieves the wing structure.',
      'Fuel cooled at altitude can approach its freezing point: about **−47 °C** for Jet A-1 and −40 °C for Jet A. Fuel temperature is monitored on long flights.',
    ] },
    { h: 'Fuel quantity', body: [
      'Engines burn mass, so fuel is planned and measured in kilograms. `mass = volume × density`. Jet fuel density is about **0.80 kg per litre** (it varies with temperature). 10,000 litres is about 8,000 kg.',
    ], formula: 'fuel-mass', lab: 'formula:fuel-mass', note: 'Fuel density varies by batch and temperature; the actual value is taken from the fuel uplift documents. System details are type-specific.' },
  ],
  examples: [
    { title: 'Fuel mass', steps: ['An uplift of 15,000 litres at a density of 0.80 kg/L.', '15,000 × 0.80.', 'Mass = 12,000 kg.'] },
    { title: 'Generator failure', steps: ['One engine generator fails in cruise.', 'The bus tie closes, or the APU generator is started.', 'All buses remain powered; the failure is recorded and the checklist completed.'] },
  ],
  practice: [
    num('15,000 litres of jet fuel at 0.80 kg/L. Mass?', 12000, 10, 'kg', '15,000 × 0.80 = 12,000 kg.'),
    mcq('An integrated drive generator combines:', ['A constant-speed drive and a generator', 'A pump and a filter', 'A battery and an inverter', 'A fan and a turbine'], 'It holds 400 Hz as engine speed changes.'),
    mcq('Crossfeed allows:', ['Any tank to feed any engine', 'Fuel to be dumped', 'Air to enter the tanks', 'The engines to start'], 'Used to balance fuel or after an engine or pump failure.'),
    mcq('A static inverter:', ['Converts battery DC to AC for essential loads', 'Converts AC to DC', 'Charges the battery', 'Starts the APU'], 'It has no moving parts.'),
    tf('Fuel is planned in litres because engines burn volume, not mass.', false, 'Engines burn mass; fuel is planned in kilograms.'),
  ],
  assessment: [
    num('10,000 litres of jet fuel at 0.80 kg/L. Mass?', 8000, 10, 'kg', '10,000 × 0.80 = 8,000 kg.'),
    num('25,000 litres of jet fuel at 0.80 kg/L. Mass?', 20000, 10, 'kg', '25,000 × 0.80 = 20,000 kg.'),
    num('What is the approximate freezing point of Jet A-1, in °C?', -47, 0.5, '°C', 'About −47 °C; Jet A is about −40 °C.'),
    mcq('Centre tank fuel is normally used first because:', ['Keeping fuel in the wings relieves wing bending', 'Centre tank fuel is cheaper', 'The centre tank has no pump', 'It makes the aircraft heavier'], 'Wing fuel opposes the bending caused by lift.'),
    mcq('If all generators fail, essential loads are supplied by:', ['The batteries, and a ram air turbine where fitted', 'The fuel pumps', 'The air conditioning packs', 'The tyres'], 'For a limited time.'),
    mcq('The APU generator can:', ['Replace a failed engine-driven generator', 'Only be used on the ground on all types', 'Increase engine thrust', 'Cool the fuel'], 'It is a spare source.'),
    tf('Fuel temperature is monitored on long flights because fuel can approach its freezing point.', true, 'Cold soak at altitude lowers the fuel temperature.'),
  ],
  missionId: 'm-atpl-fuelsys', sources: ['phak'],
});
