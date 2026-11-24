// Pre-Flight Academy physics, seventh batch: gyroscopes, light, oscillations, elasticity, relative velocity, terminal
// velocity, batteries and motion graphs. Every question is original practice material.
import { lesson, mcq, num, tf } from './q';

export const gyroscopes = lesson('Gyroscopes', {
  id: 'phys-gyroscopes', title: 'Gyroscopes and Precession', minutes: 12, level: 2, prereqs: ['phys-rotational-motion'],
  objectives: ['Explain rigidity in space and what increases it.', 'Describe precession and where it acts.', 'Name the flight instruments that use each property.'],
  intro: 'Three of the classic flight instruments contain a spinning rotor. Two properties of a spinning wheel, rigidity in space and precession, are what make them work, and precession also explains a swing that pilots of tailwheel aircraft feel on the take-off run.',
  simple: 'A fast spinning wheel resists being tilted, so its axis stays pointing the same way. Push on its rim and it reacts as if you had pushed a quarter of a turn further round.',
  sections: [
    { h: 'Rigidity in space', body: [
      'A spinning rotor keeps its axis pointing in the same direction in space. This is **rigidity in space**.',
      'Rigidity grows with the rotor\'s **angular momentum** `L = I × ω`: more mass far from the axis (larger **I**) and a faster spin (larger **ω**) both make it more rigid.',
    ], formula: 'angular-momentum', lab: 'formula:angular-momentum' },
    { h: 'Precession', body: [
      'Apply a force to the rim of a spinning rotor and the effect appears **90° later in the direction of rotation**. This is **precession**.',
      'In a tailwheel aircraft, raising the tail on the take-off run tilts the spinning propeller disc, and precession makes the aircraft yaw. The pilot is ready to correct with rudder.',
    ] },
    { h: 'Gyroscopic instruments', body: [
      'The **attitude indicator** and the **heading indicator** use rigidity in space: the case moves round a rotor that stays put.',
      'The **turn coordinator** (or turn indicator) uses precession: turning the aircraft tilts its rotor, and that tilt drives the needle or the small aircraft symbol.',
      'A heading indicator slowly drifts, so it is realigned with the magnetic compass from time to time in straight and level flight.',
    ], note: 'How often to realign the heading indicator, and how each instrument fails, is covered for the actual aircraft in its manual and in instrument training.' },
  ],
  examples: [
    { title: 'Angular momentum', steps: ['A rotor has I = 0.002 kg·m² and spins at 2,000 rad/s.', 'L = I × ω = 0.002 × 2,000.', 'L = 4 kg·m²/s.'] },
    { title: 'Revolutions to radians', steps: ['A rotor spins at 24,000 rpm.', 'One revolution is 2π rad; one minute is 60 s.', '24,000 × 2π ÷ 60 ≈ 2,513 rad/s.'] },
  ],
  practice: [
    num('A rotor has I = 0.002 kg·m² and spins at 2,000 rad/s. What is its angular momentum (kg·m²/s)?', 4, 0.01, 'kg·m²/s', 'L = 0.002 × 2,000 = 4.'),
    mcq('A force applied to the rim of a spinning rotor takes effect:', ['90° later in the direction of rotation', 'At the point where it is applied', '180° away', '90° against the direction of rotation'], 'That is gyroscopic precession.'),
    tf('A heading indicator drifts and is realigned with the magnetic compass from time to time.', true, 'Friction and the Earth\'s rotation make it drift.'),
    mcq('Which instrument works by precession?', ['Turn coordinator', 'Attitude indicator', 'Altimeter', 'Airspeed indicator'], 'Turning tilts its rotor through precession.'),
    num('If the spin speed doubles, by what factor does the angular momentum change?', 2, 0.01, '', 'L = I × ω, so doubling ω doubles L.'),
  ],
  assessment: [
    num('A rotor has I = 0.005 kg·m² and spins at 1,500 rad/s. What is its angular momentum?', 7.5, 0.01, 'kg·m²/s', 'L = 0.005 × 1,500 = 7.5.'),
    mcq('Rigidity in space increases with:', ['A faster spin and more mass towards the rim', 'A slower spin', 'A smaller, lighter rotor', 'Less friction only'], 'Both raise the angular momentum.'),
    mcq('Gyroscopic precession makes a force on the rim act:', ['90° later in the direction of rotation', 'Immediately at that point', 'Opposite to the force', 'Along the spin axis'], 'The response is displaced by a quarter turn in the direction of spin.'),
    tf('The attitude indicator relies on rigidity in space.', true, 'Its rotor holds a fixed attitude while the aircraft moves round it.'),
    mcq('Raising the tail of a tailwheel aircraft on the take-off run can cause a yaw because of:', ['Gyroscopic precession of the propeller', 'Wing loading', 'Ground effect', 'Static pressure'], 'Tilting the spinning propeller disc produces a precession force at 90°.'),
    num('Convert 24,000 rpm to radians per second.', 2513, 2, 'rad/s', '24,000 × 2π ÷ 60 ≈ 2,513 rad/s.'),
  ],
  missionId: 'm-phys-gyro', sources: ['phak'],
});

export const light = lesson('Light', {
  id: 'phys-light-optics', title: 'Light: Reflection and Refraction', minutes: 10, level: 1, prereqs: ['phys-waves'],
  objectives: ['State the speed of light and use it in simple timing.', 'Apply the law of reflection.', 'Use the refractive index and explain why light bends.'],
  intro: 'Everything a pilot sees outside arrives as light: reflected from the ground, bent through the windscreen, scattered by haze. A few rules of optics explain glare, distortion and some of the visual illusions met on an approach.',
  simple: 'Light bounces off a mirror at the same angle it arrives. When it passes into glass or water it slows down and bends.',
  sections: [
    { h: 'The speed of light', body: [
      'Light travels at about **3.0 × 10⁸ m/s** in a vacuum and almost as fast in air: 300 km in one thousandth of a second.',
      'Radio waves travel at the same speed, which is why radar and radio timing work so well.',
    ] },
    { h: 'Reflection', body: [
      'Angles are measured from the **normal**, a line at right angles to the surface. The **angle of reflection equals the angle of incidence**.',
      'Smooth water, a wet runway and the windscreen can all reflect bright light into the eyes as **glare**.',
    ] },
    { h: 'Refraction', body: [
      'Light slows down in denser materials. The **refractive index** `n = c ÷ v` says by how much: about 1.33 for water and about 1.5 for glass.',
      'Entering a slower material at an angle, light **bends towards the normal**; leaving it, light bends away.',
      'Rain on the windscreen refracts the light passing through it and can distort the view of the runway, one cause of visual illusions on the approach.',
    ], formula: 'refraction-speed', lab: 'formula:refraction-speed', note: 'Approach illusions and how to guard against them are taught in human-factors and flight training. Rely on the instruments and the approach aids when the view could mislead you.' },
  ],
  examples: [
    { title: 'Light in water', steps: ['n = 1.33 for water.', 'v = c ÷ n = 3.0 × 10⁸ ÷ 1.33.', 'v ≈ 2.26 × 10⁸ m/s.'] },
    { title: 'Timing', steps: ['How long does light take to travel 300 km?', 't = 300,000 m ÷ 3.0 × 10⁸ m/s.', 't = 0.001 s = 1 ms.'] },
  ],
  practice: [
    num('How many milliseconds does light take to travel 300 km?', 1, 0.01, 'ms', '300,000 ÷ 3.0 × 10⁸ = 0.001 s.'),
    num('A ray meets a mirror at 35° to the normal. At what angle to the normal is it reflected?', 35, 0.1, '°', 'The angle of reflection equals the angle of incidence.'),
    num('What is the speed of light in water (n = 1.33), in units of 10⁸ m/s?', 2.26, 0.01, '× 10⁸ m/s', '3.0 ÷ 1.33 ≈ 2.26.'),
    tf('Light entering a denser material at an angle bends towards the normal.', true, 'It slows down, so it bends towards the normal.'),
    mcq('The refractive index of a material is:', ['The speed of light in a vacuum divided by its speed in the material', 'The angle of reflection', 'The brightness of the light', 'The wavelength of the light'], 'n = c ÷ v.'),
  ],
  assessment: [
    num('What is the speed of light in glass (n = 1.5), in units of 10⁸ m/s?', 2, 0.01, '× 10⁸ m/s', '3.0 ÷ 1.5 = 2.0.'),
    num('Light travels at 2.25 × 10⁸ m/s in a material. What is its refractive index?', 1.33, 0.01, '', '3.0 ÷ 2.25 ≈ 1.33.'),
    num('A ray meets a surface at 60° to the normal. At what angle is it reflected?', 60, 0.1, '°', 'Angle in equals angle out.'),
    mcq('Rain on the windscreen during an approach:', ['Refracts the light and can distort how the runway looks', 'Has no effect on what the pilot sees', 'Makes the runway look sharper', 'Only reflects light away'], 'Distortion through rain is one cause of visual illusions.'),
    tf('Light travels faster in glass than in air.', false, 'It is slower in glass; that is why it bends.'),
    num('How far does light travel in one microsecond?', 300, 1, 'm', '3.0 × 10⁸ × 10⁻⁶ = 300 m.'),
  ],
  missionId: 'm-phys-light', sources: ['phak'],
});

export const oscillations = lesson('Oscillations', {
  id: 'phys-oscillations', title: 'Oscillations, Resonance and Damping', minutes: 12, level: 2, prereqs: ['phys-waves'],
  objectives: ['Relate period and frequency, including rpm.', 'Calculate the period of a simple pendulum.', 'Explain resonance and damping with aviation examples.'],
  intro: 'Things that swing back and forth are everywhere in an aircraft: a propeller turning, an engine shaking, a wing flexing, and even the whole aircraft rising and falling in a slow pitch oscillation. Two ideas, resonance and damping, decide whether such motion fades or grows.',
  simple: 'A swing has a natural rhythm. Push it in time with that rhythm and it swings higher (resonance). Friction slowly takes the energy away (damping).',
  sections: [
    { h: 'Period and frequency', body: [
      'The **period T** is the time for one full cycle; the **frequency f** is cycles per second (hertz): `f = 1 ÷ T`.',
      'An engine at 2,400 rpm turns 2,400 ÷ 60 = **40 times a second**, a frequency of 40 Hz.',
    ] },
    { h: 'The pendulum', body: [
      'For small swings, a simple pendulum has `T = 2π√(L ÷ g)`. The period depends on the **length**, not on the mass or the size of the swing.',
      'A 1 m pendulum: T = 2π√(1 ÷ 9.81) ≈ **2.0 s**. Four times the length doubles the period.',
    ], formula: 'pendulum', lab: 'formula:pendulum' },
    { h: 'Resonance and damping', body: [
      '**Resonance**: driving a system at its natural frequency builds up large oscillations. Some engine and propeller combinations have an rpm range to avoid for this reason; the aircraft manual says so.',
      '**Damping** removes energy so oscillations die away. A good shock absorber, or a stable aircraft, damps disturbances.',
      'An aircraft disturbed in pitch can enter a slow **phugoid**: it trades speed for height and back, over many seconds.',
    ], note: 'Any rpm limits for a real engine are in its flight manual. Follow those, not general numbers.' },
  ],
  examples: [
    { title: 'Pendulum period', steps: ['L = 2.5 m, g = 9.81 m/s².', 'T = 2π × √(2.5 ÷ 9.81) = 2π × 0.505.', 'T ≈ 3.17 s.'] },
    { title: 'Rpm to hertz', steps: ['3,000 rpm.', '3,000 ÷ 60 = 50 revolutions per second.', 'f = 50 Hz, T = 0.02 s.'] },
  ],
  practice: [
    num('An oscillation has a period of 0.5 s. What is its frequency?', 2, 0.01, 'Hz', 'f = 1 ÷ 0.5 = 2 Hz.'),
    num('An engine turns at 2,400 rpm. What is that in hertz?', 40, 0.01, 'Hz', '2,400 ÷ 60 = 40.'),
    num('What is the period of a 1 m pendulum (g = 9.81 m/s²)?', 2.01, 0.02, 's', '2π√(1 ÷ 9.81) ≈ 2.01 s.'),
    tf('A heavier pendulum bob gives a longer period.', false, 'The period depends on length and g, not on mass.'),
    mcq('Resonance is:', ['Large oscillations from driving a system at its natural frequency', 'The loss of energy in an oscillation', 'An oscillation that stops at once', 'The period of a pendulum'], 'Pushing in time with the natural rhythm builds up the motion.'),
  ],
  assessment: [
    num('What is the period of a 2.5 m pendulum (g = 9.81 m/s²)?', 3.17, 0.02, 's', '2π√(2.5 ÷ 9.81) ≈ 3.17 s.'),
    num('A vibration has a frequency of 50 Hz. What is its period?', 0.02, 0.0005, 's', 'T = 1 ÷ 50.'),
    num('An engine turns at 3,000 rpm. What is that in hertz?', 50, 0.01, 'Hz', '3,000 ÷ 60 = 50.'),
    mcq('Damping:', ['Removes energy so that oscillations die away', 'Adds energy to an oscillation', 'Doubles the frequency', 'Only happens at resonance'], 'Friction or a damper turns the motion\'s energy into heat.'),
    tf('Making a pendulum four times longer doubles its period.', true, 'T is proportional to √L, and √4 = 2.'),
    mcq('A phugoid is:', ['A slow pitch oscillation in which the aircraft trades speed for height', 'A fast vibration of the propeller', 'A type of turbulence', 'An engine failure'], 'It is a long-period oscillation in pitch and speed.'),
  ],
  missionId: 'm-phys-oscillation', sources: ['phak'],
});

export const elasticity = lesson('Elasticity', {
  id: 'phys-elasticity', title: 'Stress, Strain and Elasticity', minutes: 12, level: 2, prereqs: ['phys-newton', 'phys-pressure'],
  objectives: ['Use Hooke\'s law within the elastic limit.', 'Calculate stress, strain and Young\'s modulus.', 'Explain limit load, ultimate load and fatigue.'],
  intro: 'An aircraft structure is designed to bend a little and spring back, thousands of times, without breaking. Stress, strain and elasticity are the physics behind wing flex, load limits and the inspections that look for fatigue cracks.',
  simple: 'Pull on a spring and it stretches in proportion to the pull, then springs back, until you pull too hard. Metal behaves the same way on a smaller scale.',
  sections: [
    { h: 'Hooke\'s law', body: [
      'Up to its **elastic limit**, a spring or a metal part stretches in proportion to the force: `F = k × x`, where **k** is the stiffness.',
      'Beyond the elastic limit the deformation is **plastic**: the part stays bent when the load is removed.',
    ], formula: 'hooke', lab: 'formula:hooke' },
    { h: 'Stress and strain', body: [
      '**Stress** is force per area: `σ = F ÷ A`, in pascals. **Strain** is the fractional change in length: `ε = ΔL ÷ L` (no units).',
      '**Young\'s modulus** `E = σ ÷ ε` measures stiffness of the material itself. Aluminium alloys used in aircraft have E of roughly 70 GPa.',
      '10,000 N on 0.0002 m² is a stress of 5 × 10⁷ Pa = **50 MPa**.',
    ] },
    { h: 'Limits and fatigue', body: [
      'The **limit load** is the largest load expected in service. Certification rules add a safety margin, commonly a factor of 1.5, to give the **ultimate load** the structure must withstand without failing.',
      'Repeated loading well below the limit can still grow tiny cracks: **fatigue**. That is why aircraft have inspection schedules and why exceeding a load limit must be reported.',
    ], note: 'The load limits for a real aircraft are in its flight manual. Exceeding them can damage the structure even if nothing is visible.' },
  ],
  examples: [
    { title: 'Spring force', steps: ['k = 2,000 N/m, extension 0.05 m.', 'F = 2,000 × 0.05.', 'F = 100 N.'] },
    { title: 'Young\'s modulus', steps: ['Stress 70 MPa gives a strain of 0.001.', 'E = 70 × 10⁶ ÷ 0.001.', 'E = 70 × 10⁹ Pa = 70 GPa.'] },
  ],
  practice: [
    num('A spring with k = 2,000 N/m is stretched 0.05 m. What force is needed?', 100, 0.1, 'N', 'F = 2,000 × 0.05.'),
    num('A force of 10,000 N acts on 0.0002 m². What is the stress in MPa?', 50, 0.1, 'MPa', '10,000 ÷ 0.0002 = 5 × 10⁷ Pa.'),
    num('A 2 m bar stretches by 2 mm. What is the strain?', 0.001, 0.00001, '', '0.002 ÷ 2 = 0.001.'),
    tf('A part loaded beyond its elastic limit does not fully return to its original shape.', true, 'That is plastic deformation.'),
    mcq('Fatigue is:', ['Crack growth from many repeated loads, even below the limit', 'Bending from a single overload', 'Corrosion from water', 'Loss of stiffness when hot'], 'Repeated cycles can grow cracks slowly.'),
  ],
  assessment: [
    num('A force of 150 N stretches a spring with k = 3,000 N/m. What is the extension?', 0.05, 0.0005, 'm', 'x = 150 ÷ 3,000.'),
    num('A force of 20,000 N acts on 0.0004 m². What is the stress in MPa?', 50, 0.1, 'MPa', '20,000 ÷ 0.0004 = 5 × 10⁷ Pa.'),
    num('A stress of 70 MPa gives a strain of 0.001. What is Young\'s modulus in GPa?', 70, 0.1, 'GPa', '70 × 10⁶ ÷ 0.001 = 70 × 10⁹ Pa.'),
    num('A structure has a limit load factor of 3.8. With a safety factor of 1.5, what is the ultimate load factor?', 5.7, 0.01, '', '3.8 × 1.5 = 5.7.'),
    mcq('Plastic deformation means:', ['The part stays deformed after the load is removed', 'The part springs back fully', 'The part is made of plastic', 'The part gets stiffer'], 'Beyond the elastic limit the change is permanent.'),
    tf('Strain has no units.', true, 'It is a length divided by a length.'),
  ],
  missionId: 'm-phys-elastic', sources: ['phak'],
});

export const relativeVelocity = lesson('Relative velocity', {
  id: 'phys-relative-velocity', title: 'Relative Velocity', minutes: 10, level: 1, prereqs: ['phys-speed', 'phys-scalars-and-vectors'],
  objectives: ['Explain that a velocity is always measured relative to something.', 'Relate airspeed, wind and groundspeed along a track.', 'Calculate closing speeds and the time to meet.'],
  intro: 'An aircraft flying at 120 kt through the air may cover the ground at 95 kt or 145 kt, and another aircraft heading towards it closes at the sum of both speeds. All of these are the same idea: velocity relative to something.',
  simple: 'Speed is always measured against something. Airspeed is against the air, groundspeed against the ground. Two aircraft flying towards each other close at both speeds added together.',
  sections: [
    { h: 'Frames of reference', body: [
      'A velocity is measured **relative to a frame of reference**. A passenger walking forward at 1 m/s in an aircraft moving at 100 m/s moves at 101 m/s relative to the ground.',
    ] },
    { h: 'Airspeed and groundspeed', body: [
      '**True airspeed** is relative to the air mass; **groundspeed** is relative to the ground. With the wind along the track: `GS = TAS − headwind` or `GS = TAS + tailwind`.',
      'TAS 120 kt into a 25 kt headwind gives a groundspeed of **95 kt**.',
    ] },
    { h: 'Closing speeds', body: [
      'Head-on, the **closing speed** is the sum of the two speeds: 150 kt and 120 kt close at **270 kt**. In the same direction it is the difference.',
      'Time to meet = distance ÷ closing speed. At 270 kt, 10 NM closes in 10 ÷ 270 h ≈ **2.2 minutes**. Lookout and early avoiding action matter.',
    ], formula: 'closing-time', lab: 'formula:closing-time' },
  ],
  examples: [
    { title: 'Groundspeed', steps: ['TAS 140 kt with a 20 kt tailwind.', 'GS = 140 + 20.', 'GS = 160 kt.'] },
    { title: 'Time to meet', steps: ['Two aircraft 6 NM apart close head-on at 180 kt each.', 'Closing speed 360 kt = 6 NM per minute.', 'They meet in 1 minute.'] },
  ],
  practice: [
    num('TAS 120 kt into a 25 kt headwind. What is the groundspeed?', 95, 0.1, 'kt', '120 − 25 = 95 kt.'),
    num('Two aircraft fly head-on at 150 kt and 120 kt. What is the closing speed?', 270, 0.1, 'kt', '150 + 120.'),
    num('At a closing speed of 270 kt, how many minutes to close 10 NM?', 2.22, 0.02, 'min', '10 ÷ 270 × 60 ≈ 2.22 min.'),
    num('An aircraft at 160 kt overtakes one at 120 kt on the same track. What is the closing speed?', 40, 0.1, 'kt', 'Same direction: the difference.'),
    tf('A passenger walking forward at 1 m/s in an aircraft at 100 m/s moves at 101 m/s relative to the ground.', true, 'The velocities add in the same direction.'),
  ],
  assessment: [
    num('TAS 140 kt with a 20 kt tailwind. What is the groundspeed?', 160, 0.1, 'kt', '140 + 20.'),
    num('Two aircraft fly head-on at 200 kt and 250 kt. What is the closing speed?', 450, 0.1, 'kt', '200 + 250.'),
    num('Two aircraft 6 NM apart close at 360 kt. How many minutes until they meet?', 1, 0.01, 'min', '360 kt is 6 NM per minute.'),
    num('What TAS gives a groundspeed of 100 kt into a 30 kt headwind?', 130, 0.1, 'kt', 'TAS = GS + headwind.'),
    mcq('True airspeed is measured relative to:', ['The air mass', 'The ground', 'The runway', 'The other aircraft'], 'Airspeed is speed through the air.'),
    tf('Two aircraft at the same speed on the same track and direction have zero velocity relative to each other.', true, 'The gap between them stays the same.'),
  ],
  missionId: 'm-phys-relative', sources: ['phak'],
});

export const terminalVelocity = lesson('Terminal velocity', {
  id: 'phys-terminal-velocity', title: 'Air Resistance and Terminal Velocity', minutes: 12, level: 2, prereqs: ['phys-drag', 'phys-free-fall'],
  objectives: ['Use the speed-squared rule for drag.', 'Explain and calculate terminal velocity.', 'Predict how area, mass and air density change it.'],
  intro: 'A falling object does not speed up for ever: air resistance grows until it balances the weight. The same speed-squared drag that sets a skydiver\'s terminal velocity governs an aircraft\'s drag at every speed.',
  simple: 'Air pushes back harder the faster you go, four times harder at twice the speed. When that push equals your weight you stop speeding up: that is terminal velocity.',
  sections: [
    { h: 'Drag grows with speed squared', body: [
      'Drag is `D = ½ × ρ × v² × Cd × A`. Because of the **v²**, doubling the speed makes **four times** the drag; tripling makes nine times.',
    ] },
    { h: 'Terminal velocity', body: [
      'A falling object speeds up until drag equals weight. Then the net force is zero and the speed stays constant: the **terminal velocity**.',
      'Setting `½ρv²CdA = mg` gives `v = √(2mg ÷ (ρ × Cd × A))`. An 80 kg skydiver with Cd × A = 0.5 m² in sea-level air: about **51 m/s**.',
    ], formula: 'terminal-velocity', lab: 'formula:terminal-velocity' },
    { h: 'What changes it', body: [
      'A **parachute** multiplies Cd × A many times, so the terminal velocity falls to a few metres per second.',
      '**Thinner air** (lower ρ at altitude) gives a **higher** terminal velocity. **Four times the mass** doubles it (√4 = 2).',
    ] },
  ],
  examples: [
    { title: 'Drag at a higher speed', steps: ['Drag is 100 N at 20 m/s.', 'At 40 m/s the speed has doubled.', 'Drag = 100 × 2² = 400 N.'] },
    { title: 'Terminal velocity', steps: ['m = 90 kg, Cd × A = 0.6 m², ρ = 1.225 kg/m³.', 'v = √(2 × 90 × 9.81 ÷ (1.225 × 0.6)) = √(1,765.8 ÷ 0.735).', 'v ≈ 49 m/s.'] },
  ],
  practice: [
    num('By what factor does drag increase if the speed doubles?', 4, 0.01, '', 'Drag depends on v², and 2² = 4.'),
    num('By what factor does drag increase if the speed triples?', 9, 0.01, '', '3² = 9.'),
    tf('At terminal velocity the net force on the falling object is zero.', true, 'Drag balances weight, so the speed is constant.'),
    num('Terminal velocity for m = 80 kg, Cd × A = 0.5 m², ρ = 1.225 kg/m³ (g = 9.81)?', 50.6, 0.5, 'm/s', '√(1,569.6 ÷ 0.6125) ≈ 50.6 m/s.'),
    mcq('Opening a parachute:', ['Greatly increases Cd × A, so the terminal velocity falls', 'Reduces the weight', 'Increases the air density', 'Makes drag independent of speed'], 'More area and drag coefficient means balance at a much lower speed.'),
  ],
  assessment: [
    num('Terminal velocity for m = 90 kg, Cd × A = 0.6 m², ρ = 1.225 kg/m³ (g = 9.81)?', 49, 0.5, 'm/s', '√(1,765.8 ÷ 0.735) ≈ 49 m/s.'),
    num('Drag is 100 N at 20 m/s. What is it at 40 m/s?', 400, 0.5, 'N', 'Twice the speed, four times the drag.'),
    mcq('In thinner air at high altitude, the terminal velocity is:', ['Higher', 'Lower', 'The same', 'Zero'], 'Lower density means less drag at the same speed.'),
    num('If the mass is four times larger (same shape), by what factor does the terminal velocity change?', 2, 0.01, '', 'v ∝ √m, and √4 = 2.'),
    tf('At terminal velocity the object is still accelerating downwards.', false, 'Drag equals weight, so there is no acceleration.'),
    mcq('Drag on a body moving through air is proportional to:', ['The square of the speed', 'The speed', 'The cube of the speed', 'The mass'], 'D = ½ρv²CdA.'),
  ],
  missionId: 'm-phys-terminal', sources: ['phak'],
});

export const batteries = lesson('Batteries', {
  id: 'phys-batteries', title: 'Batteries and Electrical Endurance', minutes: 10, level: 1, prereqs: ['phys-electricity'],
  objectives: ['Explain battery capacity in ampere-hours and energy in watt-hours.', 'Estimate how long a battery can supply a load.', 'Explain why loads are reduced after an alternator failure.'],
  intro: 'If the alternator fails, the battery alone powers the radios, instruments and lights. How long it lasts depends on its capacity and on how much current the aircraft draws, which is why pilots switch off what they do not need.',
  simple: 'A 10 Ah battery can give 10 amps for one hour, or 5 amps for two hours. Use less current and it lasts longer.',
  sections: [
    { h: 'Capacity and energy', body: [
      'Battery **capacity** is given in **ampere-hours (Ah)**: current × time. It is an amount of electric charge, not energy.',
      'Stored **energy** in watt-hours is `voltage × capacity`: a 24 V, 10 Ah battery holds about **240 Wh**.',
    ] },
    { h: 'Endurance', body: [
      'Ideal endurance is `t = capacity ÷ current`. 10 Ah at 5 A lasts **2 hours**; at 10 A, 1 hour.',
      'Power, current and voltage are linked by `P = V × I`: 120 W at 24 V draws 5 A.',
    ], formula: 'battery-endurance', lab: 'formula:battery-endurance' },
    { h: 'In real life', body: [
      'A real battery delivers less than its rating when it is **cold**, **old** or not fully charged, and at high currents.',
      'After an **alternator failure**, switching off non-essential equipment lowers the current and makes the remaining charge last much longer.',
    ], note: 'The aircraft\'s checklist gives the actions for an electrical failure and which equipment is essential. Follow it and plan to land.' },
  ],
  examples: [
    { title: 'Endurance in minutes', steps: ['A 17 Ah battery supplies 12 A.', 't = 17 ÷ 12 ≈ 1.42 h.', 'About 85 minutes, in ideal conditions.'] },
    { title: 'Load shedding', steps: ['The load falls from 20 A to 8 A.', 'With 10 Ah left: 0.5 h before, 1.25 h after.', 'Shedding load gave 45 more minutes.'] },
  ],
  practice: [
    num('How many watt-hours does a 24 V, 10 Ah battery store?', 240, 0.5, 'Wh', '24 × 10 = 240 Wh.'),
    num('A 10 Ah battery supplies 5 A. How many minutes does it last (ideal)?', 120, 0.5, 'min', '10 ÷ 5 = 2 h.'),
    num('How many watt-hours does a 12 V, 35 Ah battery store?', 420, 0.5, 'Wh', '12 × 35 = 420 Wh.'),
    tf('Halving the electrical load roughly doubles the battery endurance.', true, 't = capacity ÷ current.'),
    mcq('After an alternator failure the pilot should:', ['Switch off non-essential electrical equipment and plan to land', 'Turn on every light to check the battery', 'Ignore it while the battery lasts', 'Restart the engine'], 'Reducing the load extends the battery\'s life; follow the checklist.'),
  ],
  assessment: [
    num('A 17 Ah battery supplies 12 A. How many minutes does it last (ideal)?', 85, 0.5, 'min', '17 ÷ 12 × 60 = 85 min.'),
    num('What power does a 24 V supply deliver at 5 A?', 120, 0.5, 'W', 'P = V × I = 120 W.'),
    num('A 240 Wh battery supplies a 120 W load. How many hours does it last (ideal)?', 2, 0.01, 'h', '240 ÷ 120 = 2 h.'),
    num('What current does a 60 W light draw at 12 V?', 5, 0.01, 'A', 'I = P ÷ V = 5 A.'),
    mcq('A real battery may deliver less than its rated capacity because it is:', ['Cold or old', 'Brand new and warm', 'Lightly loaded', 'Fully charged'], 'Low temperature and age both reduce usable capacity.'),
    tf('The ampere-hour is a unit of energy.', false, 'It is a unit of electric charge; energy is in watt-hours or joules.'),
  ],
  missionId: 'm-phys-battery', sources: ['phak'],
});

export const motionGraphs = lesson('Motion graphs', {
  id: 'phys-motion-graphs', title: 'Motion Graphs', minutes: 10, level: 1, prereqs: ['phys-speed', 'phys-accel'],
  objectives: ['Read speed from the gradient of a distance-time graph.', 'Read acceleration from the gradient of a velocity-time graph.', 'Find distance from the area under a velocity-time graph.'],
  intro: 'A take-off roll, a climb and a landing roll can all be drawn as graphs. Two simple rules, gradient and area, let you read speed, acceleration and distance straight off them.',
  simple: 'On a distance-time graph, steeper means faster. On a speed-time graph, steeper means more acceleration, and the area underneath is the distance covered.',
  sections: [
    { h: 'Distance-time graphs', body: [
      'The **gradient** (rise ÷ run) of a distance-time graph is the **speed**. A straight sloping line is a constant speed; a horizontal line means the object is not moving.',
      '600 m in 30 s is a gradient of **20 m/s**.',
    ] },
    { h: 'Velocity-time graphs', body: [
      'The **gradient** of a velocity-time graph is the **acceleration**: from 0 to 30 m/s in 15 s is **2 m/s²**. A downward slope is a deceleration.',
      'The **area under** the line is the **distance travelled**. For that take-off roll the area is a triangle: ½ × 15 × 30 = **225 m**.',
    ], formula: 'acceleration', lab: 'formula:acceleration' },
  ],
  examples: [
    { title: 'Take-off roll', steps: ['From rest to 40 m/s in 20 s at constant acceleration.', 'Acceleration = 40 ÷ 20 = 2 m/s².', 'Distance = ½ × 20 × 40 = 400 m.'] },
    { title: 'Landing roll', steps: ['From 20 m/s to 10 m/s in 5 s.', 'Gradient = (10 − 20) ÷ 5 = −2 m/s².', 'A deceleration of 2 m/s².'] },
  ],
  practice: [
    num('A distance-time graph rises 600 m in 30 s. What is the speed?', 20, 0.01, 'm/s', '600 ÷ 30.'),
    num('Velocity rises from 0 to 30 m/s in 15 s. What is the acceleration?', 2, 0.01, 'm/s²', '30 ÷ 15.'),
    num('For that same run, what distance is covered (area under the line)?', 225, 0.5, 'm', '½ × 15 × 30.'),
    tf('A horizontal line on a distance-time graph means the object is not moving.', true, 'The distance does not change.'),
    mcq('The gradient of a velocity-time graph is the:', ['Acceleration', 'Distance', 'Speed', 'Mass'], 'Change in velocity per unit time is acceleration.'),
  ],
  assessment: [
    num('From rest to 40 m/s in 20 s at constant acceleration. What is the acceleration?', 2, 0.01, 'm/s²', '40 ÷ 20.'),
    num('For that same run, what distance is covered?', 400, 0.5, 'm', '½ × 20 × 40.'),
    num('Constant 50 m/s for 10 s. What distance is covered?', 500, 0.5, 'm', 'The area is a rectangle: 50 × 10.'),
    num('From 20 m/s to 10 m/s in 5 s. What is the acceleration (negative for slowing)?', -2, 0.01, 'm/s²', '(10 − 20) ÷ 5 = −2.'),
    mcq('The area under a velocity-time graph gives the:', ['Distance travelled', 'Acceleration', 'Final speed', 'Time taken'], 'Velocity × time is distance.'),
    tf('A straight sloping line on a distance-time graph means a constant speed.', true, 'A constant gradient is a constant speed.'),
  ],
  missionId: 'm-phys-graphs', sources: ['phak'],
});
