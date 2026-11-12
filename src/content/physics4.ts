// Pre-Flight Academy physics, fourth batch: viscosity, heat, thermodynamics, waves, sound, thrust, performance.
import { lesson, mcq, num, tf } from './q';

export const viscosity = lesson('Viscosity and boundary layers', {
  id: 'phys-viscosity-and-boundary-layers', title: 'Viscosity and Boundary Layers', minutes: 11, level: 2, prereqs: ['phys-bernoulli'],
  objectives: ['Explain viscosity and the no-slip condition.', 'Describe the boundary layer.', 'Compare laminar and turbulent boundary layers.', 'Explain boundary-layer separation and its link to the stall.'],
  intro: 'Air looks thin and slippery, yet a thin layer of it clings to every surface of an aircraft. What happens inside that layer, only millimetres thick, decides skin-friction drag and when a wing stalls.',
  simple: 'Air is slightly sticky. Right at the surface of a wing the air does not move relative to the wing at all. A little further out it moves at full speed. The thin zone in between is the boundary layer.',
  sections: [
    { h: 'Viscosity', body: [
      '**Viscosity** is a fluid\'s resistance to flowing: its internal friction. Honey has a high viscosity, water a low one, air a very low one, but not zero.',
      'Because of viscosity, the air touching a surface is at rest relative to it. This is the **no-slip condition**.',
    ] },
    { h: 'The boundary layer', body: [
      'Between the surface, where the relative speed is zero, and the free stream, where it is full, lies the **boundary layer**. The friction inside it produces **skin-friction drag**.',
      'A **laminar** boundary layer flows in smooth layers and has low skin friction. Further back it usually becomes **turbulent**: thicker, mixed, with more skin friction but more energy near the surface.',
    ] },
    { h: 'Reynolds number', body: [
      'Whether the flow is laminar or turbulent depends on the **Reynolds number**: `Re = V × L ÷ ν`, where V is speed, L a length such as the wing chord, and ν the kinematic viscosity of air (about 1.5 × 10⁻⁵ m²/s near sea level).',
      'At 30 m/s over a 1 m chord, Re is about 2,000,000. Higher Reynolds numbers favour turbulent flow.',
    ], formula: 'reynolds', lab: 'formula:reynolds' },
    { h: 'Separation', body: [
      'Over the rear of a wing the air must flow into rising pressure. If the boundary layer runs out of energy it lifts off the surface: **separation**. Lift falls and drag rises sharply. At a high angle of attack this is the stall.',
      'A turbulent boundary layer resists separation better than a laminar one. **Vortex generators** deliberately stir the boundary layer to keep the flow attached.',
    ], note: 'Frost, ice or even squashed insects roughen the surface, disturb the boundary layer and can cause earlier separation. This is one reason a wing must be clean before take-off.' },
  ],
  examples: [
    { title: 'Reynolds number', steps: ['V = 30 m/s, L = 1 m, ν = 1.5 × 10⁻⁵ m²/s.', 'Re = 30 × 1 ÷ 0.000015.', 'Re = 2,000,000.'] },
    { title: 'Reading the flow', steps: ['Tufts on the front of a wing lie flat and steady.', 'Tufts near the trailing edge flap and reverse.', 'The flow has separated near the trailing edge.'] },
  ],
  practice: [
    mcq('Viscosity is:', ['A fluid\'s resistance to flow', 'A fluid\'s mass per unit volume', 'The pressure of a moving fluid', 'The temperature of a fluid'], 'It is the internal friction of the fluid.'),
    num('V = 30 m/s, L = 1 m, ν = 0.000015 m²/s. Reynolds number?', 2000000, 2000, '', '30 × 1 ÷ 0.000015 = 2,000,000.'),
    mcq('The boundary layer is:', ['The thin layer of slowed air next to a surface', 'The layer of the atmosphere nearest space', 'The air ahead of the propeller', 'The wake behind the aircraft'], 'Inside it, speed rises from zero at the surface to the free-stream value.'),
    mcq('Skin-friction drag is produced by:', ['Friction within the boundary layer', 'The weight of the aircraft', 'Wingtip vortices', 'Engine exhaust'], 'It is a viscous effect.'),
    tf('Air has zero viscosity.', false, 'It is small, but it is what creates the boundary layer.'),
  ],
  assessment: [
    mcq('At the surface of a wing, the speed of the air relative to the wing is:', ['Zero', 'Equal to the free-stream speed', 'Twice the free-stream speed', 'Supersonic'], 'This is the no-slip condition.'),
    mcq('Compared with a laminar boundary layer, a turbulent one has:', ['More skin friction but better resistance to separation', 'Less skin friction and less resistance to separation', 'No skin friction', 'No effect on drag'], 'It carries more energy near the surface.'),
    mcq('Boundary-layer separation over a wing causes:', ['A loss of lift and a large rise in drag', 'More lift and less drag', 'No change in lift', 'An increase in thrust'], 'Separated flow no longer follows the wing surface.'),
    num('V = 60 m/s, L = 1.5 m, ν = 0.000015 m²/s. Reynolds number?', 6000000, 6000, '', '60 × 1.5 ÷ 0.000015 = 6,000,000.'),
    mcq('Vortex generators are fitted to:', ['Energise the boundary layer and delay separation', 'Increase the weight on the tail', 'Reduce engine noise', 'Measure airspeed'], 'They mix faster air down towards the surface.'),
    tf('A laminar boundary layer produces more skin friction than a turbulent one.', false, 'Laminar flow has the lower skin friction.'),
    tf('Ice or frost on a wing can cause the airflow to separate earlier.', true, 'Roughness disturbs the boundary layer.'),
  ],
  missionId: 'm-phys-viscosity', sources: ['phak'],
});

export const heat = lesson('Heat', {
  id: 'phys-heat', title: 'Heat', minutes: 9, level: 1, prereqs: ['phys-temperature'],
  objectives: ['Distinguish heat from temperature.', 'Calculate heat from mass, specific heat capacity and temperature change.', 'Describe conduction, convection and radiation.', 'Explain latent heat and its role in weather.'],
  intro: 'The Sun warms the ground, the ground warms the air, the air rises and a cloud forms. Almost all weather is heat on the move.',
  simple: 'Heat is energy that moves from something hotter to something colder. It moves by contact, by moving fluid, or by rays. Changing water between ice, liquid and vapour takes in or gives out heat without changing its temperature.',
  sections: [
    { h: 'Heat and temperature', body: [
      '**Heat** is energy transferred because of a temperature difference, measured in joules. It always flows naturally from hotter to colder.',
      'The heat needed to warm something is `Q = m × c × ΔT`, where c is the **specific heat capacity**: about 4,186 J/(kg·K) for water and about 1,005 J/(kg·K) for air.',
      'Water needs about four times as much heat as the same mass of air for the same temperature rise, which is why the sea warms and cools slowly.',
    ], formula: 'heat-q', lab: 'formula:heat-q' },
    { h: 'Three ways to transfer heat', body: [
      '**Conduction**: through direct contact, as when the warm ground heats the air touching it.',
      '**Convection**: carried by a moving fluid, as when warmed air rises in a thermal.',
      '**Radiation**: carried by electromagnetic waves, as from the Sun to the Earth. It needs no medium.',
    ] },
    { h: 'Latent heat', body: [
      'Changing state takes energy without changing temperature. **Evaporation** absorbs **latent heat** and cools the surroundings; **condensation** releases it.',
      'The latent heat released when water vapour condenses in a growing cloud warms the air and keeps it rising. It is the energy source of thunderstorms.',
    ], note: 'Evaporating fuel absorbs heat inside a carburettor and can cool it below freezing, which is why carburettor ice can form on a warm, humid day.' },
  ],
  examples: [
    { title: 'Heating water', steps: ['Warm 2 kg of water by 10 K.', 'Q = 2 × 4,186 × 10.', 'Q = 83,720 J.'] },
    { title: 'Naming the process', steps: ['A glider circles upward in a column of rising warm air.', 'The heat is being carried by moving air.', 'This is convection.'] },
  ],
  practice: [
    num('How much heat warms 1 kg of water by 5 K (c = 4,186 J/(kg·K))?', 20930, 20, 'J', '1 × 4,186 × 5 = 20,930 J.'),
    mcq('Heat always flows naturally from:', ['Hotter to colder', 'Colder to hotter', 'Heavier to lighter', 'Lower to higher'], 'A temperature difference drives it.'),
    mcq('A metal spoon in hot tea becomes hot by:', ['Conduction', 'Convection', 'Radiation', 'Evaporation'], 'Heat passes through direct contact.'),
    mcq('Evaporation:', ['Absorbs heat from the surroundings', 'Releases heat to the surroundings', 'Involves no heat', 'Occurs only at 100 °C'], 'That is why sweating cools you.'),
    tf('Heat and temperature are the same thing.', false, 'Temperature is how hot something is; heat is energy in transfer.'),
  ],
  assessment: [
    num('How much heat warms 2 kg of water by 10 K (c = 4,186 J/(kg·K))?', 83720, 50, 'J', '2 × 4,186 × 10 = 83,720 J.'),
    num('How much heat warms 1 kg of air by 20 K (c = 1,005 J/(kg·K))?', 20100, 20, 'J', '1 × 1,005 × 20 = 20,100 J.'),
    mcq('A thermal of rising warm air is an example of:', ['Convection', 'Conduction', 'Radiation', 'Condensation'], 'The heat is carried by the moving air.'),
    mcq('Heat reaches the Earth from the Sun by:', ['Radiation', 'Conduction', 'Convection', 'Evaporation'], 'Space is nearly empty, so only radiation can cross it.'),
    mcq('When water vapour condenses into cloud droplets, latent heat is:', ['Released, warming the surrounding air', 'Absorbed, cooling the surrounding air', 'Destroyed', 'Unchanged'], 'This release powers convective cloud.'),
    tf('Heat flows spontaneously from a colder object to a hotter one.', false, 'It flows from hotter to colder.'),
    mcq('Compared with air, water has a specific heat capacity that is:', ['About four times greater', 'About four times smaller', 'The same', 'Zero'], '4,186 against about 1,005 J/(kg·K).'),
  ],
  missionId: 'm-phys-heat', sources: ['phak', 'faa-wx'],
});

export const thermo = lesson('Thermodynamics', {
  id: 'phys-thermodynamics', title: 'Thermodynamics', minutes: 10, level: 2, prereqs: ['phys-heat', 'phys-gas'],
  objectives: ['State the first and second laws of thermodynamics.', 'Calculate the efficiency of a heat engine.', 'Explain adiabatic heating and cooling.', 'Relate these ideas to engines and to rising air.'],
  intro: 'An aircraft engine turns the heat of burning fuel into work. Thermodynamics sets the rules for that trade, and the same rules explain why air cools as it rises and forms cloud.',
  simple: 'Energy cannot be created or destroyed, only moved or changed in form. Heat flows from hot to cold, and no engine can turn all of its heat into work. Squeezing a gas heats it; letting it expand cools it.',
  sections: [
    { h: 'The first law', body: [
      'Energy is conserved. For a gas: `change in internal energy = heat added − work done by the gas`.',
      'If a gas absorbs 500 J of heat and does 200 J of work, its internal energy rises by 300 J.',
    ] },
    { h: 'The second law and efficiency', body: [
      'Heat flows naturally from hot to cold, and a heat engine must always reject some heat. `efficiency = work out ÷ heat in`.',
      'An engine that produces 30,000 J of work from 100,000 J of fuel heat is 30% efficient. The other 70,000 J leaves as heat in the exhaust and cooling air.',
    ], formula: 'efficiency', lab: 'formula:efficiency' },
    { h: 'Adiabatic change', body: [
      'An **adiabatic** process exchanges no heat with the surroundings. Compressing a gas quickly raises its temperature; letting it expand lowers it.',
      'In a piston engine the compression stroke heats the mixture before ignition. In the atmosphere, rising air expands as pressure falls and cools: unsaturated air cools by about 3 °C per 1,000 ft.',
    ], note: 'The four strokes of a piston engine are intake, compression, power and exhaust. Only the power stroke delivers work; the engine\'s flywheel and other cylinders carry it through the rest.' },
  ],
  examples: [
    { title: 'Efficiency', steps: ['An engine receives 80,000 J of heat and does 20,000 J of work.', '20,000 ÷ 80,000 = 0.25.', 'Efficiency is 25%.'] },
    { title: 'Rising air', steps: ['Unsaturated air at 20 °C is lifted 2,000 ft.', 'Cooling = 2 × 3 = 6 °C.', 'Its temperature becomes 14 °C.'] },
  ],
  practice: [
    num('An engine receives 80,000 J of heat and does 20,000 J of work. Efficiency in percent?', 25, 0.1, '%', '20,000 ÷ 80,000 = 25%.'),
    num('Unsaturated air at 20 °C is lifted 2,000 ft, cooling at 3 °C per 1,000 ft. New temperature?', 14, 0.1, '°C', '20 − 6 = 14 °C.'),
    mcq('The first law of thermodynamics is a statement that:', ['Energy is conserved', 'Heat cannot flow', 'All engines are 100% efficient', 'Pressure is constant'], 'Energy changes form but is not created or destroyed.'),
    mcq('When a gas expands without exchanging heat, its temperature:', ['Falls', 'Rises', 'Stays the same', 'Doubles'], 'It does work at the expense of its internal energy.'),
    mcq('Which stroke of a four-stroke piston engine delivers work?', ['The power stroke', 'The intake stroke', 'The compression stroke', 'The exhaust stroke'], 'The burning mixture pushes the piston down.'),
  ],
  assessment: [
    num('An engine produces 30,000 J of work from 100,000 J of heat. Efficiency in percent?', 30, 0.1, '%', '30,000 ÷ 100,000 = 30%.'),
    num('An engine receives 100,000 J of heat and does 30,000 J of work. How much heat is rejected?', 70000, 50, 'J', '100,000 − 30,000 = 70,000 J.'),
    num('A gas absorbs 500 J of heat and does 200 J of work. Change in its internal energy?', 300, 0.5, 'J', '500 − 200 = 300 J.'),
    mcq('Compressing a gas rapidly makes its temperature:', ['Rise', 'Fall', 'Stay the same', 'Reach absolute zero'], 'Work done on the gas raises its internal energy.'),
    mcq('Rising unsaturated air cools at about:', ['3 °C per 1,000 ft', '1 °C per 1,000 ft', '10 °C per 1,000 ft', '0.3 °C per 1,000 ft'], 'It expands as the surrounding pressure falls.'),
    tf('A heat engine can convert all of the heat it receives into work.', false, 'Some heat must always be rejected.'),
    mcq('An adiabatic process is one in which:', ['No heat is exchanged with the surroundings', 'Temperature is constant', 'Pressure is constant', 'No work is done'], 'Temperature changes come from compression or expansion alone.'),
  ],
  missionId: 'm-phys-thermo', sources: ['phak', 'faa-wx'],
});

export const waves = lesson('Waves', {
  id: 'phys-waves', title: 'Waves', minutes: 9, level: 1, prereqs: ['phys-speed'],
  objectives: ['Describe wavelength, frequency, period and amplitude.', 'Use the wave equation.', 'Distinguish transverse from longitudinal waves.', 'Relate radio frequency to wavelength.'],
  intro: 'Every radio call, every navigation signal and every radar echo is a wave. So is the sound of the engine. Understanding waves is understanding how an aircraft talks and listens.',
  simple: 'A wave carries energy from place to place without carrying matter along with it. Its frequency is how many waves pass each second, its wavelength is the length of one wave, and multiplying them gives its speed.',
  sections: [
    { h: 'Describing a wave', body: [
      '**Wavelength** (λ) is the distance from one crest to the next. **Frequency** (f) is the number of waves per second, in hertz (Hz). **Period** is the time for one wave: `T = 1 ÷ f`. **Amplitude** is the maximum displacement from the rest position.',
    ] },
    { h: 'The wave equation', body: [
      '`speed = frequency × wavelength`. A wave of 5 Hz with a wavelength of 2 m travels at 10 m/s.',
      'At a fixed speed, a higher frequency means a shorter wavelength.',
    ] },
    { h: 'Two kinds of wave', body: [
      'In a **transverse** wave the vibration is at right angles to the direction of travel: light, radio, waves on a string. In a **longitudinal** wave it is along the direction of travel: sound.',
    ] },
    { h: 'Radio waves', body: [
      'Radio waves are **electromagnetic** waves. They need no medium and travel at about 300,000,000 m/s. So `wavelength in metres = 300 ÷ frequency in MHz`.',
      'Aircraft voice radio uses VHF frequencies of roughly 118 to 137 MHz. At 120 MHz the wavelength is 2.5 m.',
    ], formula: 'wavelength', lab: 'formula:wavelength', note: 'VHF radio travels essentially in straight lines, so range depends on height: the higher the aircraft, the further it can talk.' },
  ],
  examples: [
    { title: 'Wave speed', steps: ['A wave has f = 4 Hz and λ = 3 m.', 'Speed = 4 × 3.', 'Speed = 12 m/s.'] },
    { title: 'Radio wavelength', steps: ['A station transmits on 100 MHz.', '300 ÷ 100 = 3.', 'The wavelength is 3 m.'] },
  ],
  practice: [
    num('A wave has a frequency of 4 Hz and a wavelength of 3 m. Speed?', 12, 0.05, 'm/s', '4 × 3 = 12 m/s.'),
    num('What is the wavelength of a 100 MHz radio wave (λ = 300 ÷ f in MHz)?', 3, 0.01, 'm', '300 ÷ 100 = 3 m.'),
    mcq('Frequency is measured in:', ['Hertz', 'Metres', 'Seconds', 'Watts'], 'One hertz is one wave per second.'),
    mcq('Wavelength is:', ['The distance from one crest to the next', 'The height of a crest', 'The number of waves per second', 'The time for one wave'], 'It is a length.'),
    num('What is the period of a 10 Hz wave?', 0.1, 0.001, 's', '1 ÷ 10 = 0.1 s.'),
  ],
  assessment: [
    num('What is the wavelength of a 120 MHz radio wave (λ = 300 ÷ f in MHz)?', 2.5, 0.01, 'm', '300 ÷ 120 = 2.5 m.'),
    num('A wave has a frequency of 5 Hz and a wavelength of 2 m. Speed?', 10, 0.05, 'm/s', '5 × 2 = 10 m/s.'),
    num('What is the period of a 50 Hz wave?', 0.02, 0.0005, 's', '1 ÷ 50 = 0.02 s.'),
    mcq('Sound is which kind of wave?', ['Longitudinal', 'Transverse', 'Electromagnetic', 'Stationary only'], 'The air vibrates along the direction of travel.'),
    mcq('Radio waves:', ['Are electromagnetic and need no medium', 'Are sound waves of high pitch', 'Need air to travel', 'Travel at the speed of sound'], 'They travel through empty space at the speed of light.'),
    tf('At the same speed, a higher frequency means a shorter wavelength.', true, 'Speed = frequency × wavelength.'),
    mcq('The amplitude of a wave is:', ['The maximum displacement from the rest position', 'The distance between crests', 'The number of waves per second', 'The speed of the wave'], 'It relates to the energy the wave carries.'),
  ],
  missionId: 'm-phys-waves', sources: ['phak'],
});

export const sound = lesson('Sound', {
  id: 'phys-sound', title: 'Sound', minutes: 9, level: 1, prereqs: ['phys-waves', 'phys-temperature'],
  objectives: ['Describe sound as a pressure wave.', 'Calculate the speed of sound from temperature.', 'Explain why the speed of sound falls with altitude.', 'Describe the Doppler effect.'],
  intro: 'The speed of sound is the most important speed limit in aviation. It is not a fixed number: it changes with the temperature of the air, and so with altitude.',
  simple: 'Sound is a vibration passed along through air as tiny changes of pressure. It needs something to travel through. In warm air it travels faster, in cold air slower.',
  sections: [
    { h: 'A pressure wave', body: [
      'Sound is a longitudinal wave of compressions and expansions. It needs a medium: there is no sound in a vacuum.',
      'Loudness relates to amplitude and is measured in decibels; pitch relates to frequency.',
    ] },
    { h: 'Speed of sound', body: [
      'In air the speed of sound depends on temperature: `a = 20.05 × √T`, with T in kelvin and a in m/s.',
      'At 15 °C (288.15 K) it is about 340 m/s. At −56.5 °C (216.65 K), the temperature of the standard atmosphere at 36,000 ft and above, it is about 295 m/s.',
      'Because the air is colder at altitude, the speed of sound is lower there. An aircraft\'s **Mach number** is its true airspeed divided by the local speed of sound.',
    ], formula: 'sound-ms', lab: 'formula:sound-ms' },
    { h: 'Doppler effect', body: [
      'When a source of sound approaches, the waves ahead of it are squeezed together and the pitch you hear is higher. As it moves away the pitch drops. This is the **Doppler effect**.',
      'An aircraft flying faster than sound outruns its own pressure waves, which merge into a shock wave heard on the ground as a sonic boom.',
    ], note: 'Cockpit and ramp noise can permanently damage hearing. Headsets and ear protection are part of normal operations.' },
  ],
  examples: [
    { title: 'Speed of sound', steps: ['Temperature is 0 °C, which is 273.15 K.', '√273.15 = 16.53.', 'a = 20.05 × 16.53 ≈ 331.4 m/s.'] },
    { title: 'Distance of a storm', steps: ['Thunder arrives 3 s after the lightning.', 'Distance = 340 × 3.', 'The strike was about 1,020 m away.'] },
  ],
  practice: [
    num('Speed of sound at 273.15 K, using a = 20.05 × √T?', 331.4, 0.5, 'm/s', '20.05 × 16.53 ≈ 331.4 m/s.'),
    num('Thunder is heard 3 s after lightning. Distance, taking sound at 340 m/s?', 1020, 2, 'm', '340 × 3 = 1,020 m.'),
    mcq('Sound cannot travel through:', ['A vacuum', 'Air', 'Water', 'Steel'], 'It needs a medium.'),
    mcq('The pitch of a sound depends on its:', ['Frequency', 'Amplitude', 'Speed', 'Direction'], 'Higher frequency, higher pitch.'),
    mcq('As temperature falls, the speed of sound in air:', ['Decreases', 'Increases', 'Stays the same', 'Becomes zero'], 'It is proportional to the square root of absolute temperature.'),
  ],
  assessment: [
    num('Speed of sound at 288.15 K, using a = 20.05 × √T?', 340.3, 0.5, 'm/s', '20.05 × 16.975 ≈ 340.3 m/s.'),
    num('Speed of sound at 216.65 K, using a = 20.05 × √T?', 295.1, 0.5, 'm/s', '20.05 × 14.719 ≈ 295.1 m/s.'),
    num('An aircraft flies at 170 m/s where the speed of sound is 340 m/s. Mach number?', 0.5, 0.005, '', '170 ÷ 340 = 0.5.'),
    num('Thunder is heard 6 s after lightning. Distance, taking sound at 340 m/s?', 2040, 5, 'm', '340 × 6 = 2,040 m.'),
    mcq('The speed of sound in air depends mainly on:', ['Temperature', 'Loudness', 'Frequency', 'The size of the source'], 'Warmer air carries sound faster.'),
    tf('Sound can travel through a vacuum.', false, 'There is nothing to carry the pressure changes.'),
    mcq('As a sound source approaches you, the pitch you hear is:', ['Higher than when it is stationary', 'Lower than when it is stationary', 'Unchanged', 'Silent'], 'The waves ahead of the source are compressed: the Doppler effect.'),
  ],
  missionId: 'm-phys-sound', sources: ['phak'],
});

export const thrust = lesson('Thrust', {
  id: 'phys-thrust', title: 'Thrust', minutes: 10, level: 2, prereqs: ['phys-newton', 'phys-momentum'],
  objectives: ['Explain thrust using Newton\'s laws.', 'Calculate thrust from mass flow and velocity change.', 'Compare how propellers and jets make thrust.', 'Describe how thrust varies with altitude.'],
  intro: 'An aircraft moves forward by throwing air backward. Whether a propeller or a jet does the throwing, the physics is the same.',
  simple: 'To push itself forward, an engine pushes air backward. The more air it moves each second and the more it speeds that air up, the greater the thrust.',
  sections: [
    { h: 'Action and reaction', body: [
      'A propeller or jet accelerates air rearward. By Newton\'s third law the air pushes the aircraft forward with an equal and opposite force: **thrust**.',
      'From the second law, thrust equals the rate of change of momentum of the air: `F = ṁ × (Vₑ − V₀)`, where ṁ is the mass of air per second, Vₑ its exit speed and V₀ its entry speed.',
      'With 50 kg/s of air accelerated from 100 m/s to 250 m/s, thrust is 50 × 150 = 7,500 N.',
    ], formula: 'thrust-mdot', lab: 'formula:thrust-mdot' },
    { h: 'Propeller and jet', body: [
      'A **propeller** gives a large mass of air a small increase in speed. A **jet** gives a smaller mass a large increase. Moving more air more gently is more efficient at low speed, which is why slower aircraft use propellers.',
      'Propeller thrust is greatest when the aircraft is stationary and falls as airspeed increases.',
    ] },
    { h: 'Thrust in flight', body: [
      'In steady level flight thrust equals drag. More thrust than drag accelerates the aircraft or allows it to climb.',
      'Thrust falls with altitude, because thinner air means less mass flow through the propeller or engine.',
      'The power delivered to the aircraft is thrust times true airspeed.',
    ], note: 'This is a simplified momentum model. Real engine thrust also depends on pressure differences, temperature and engine limits, and is given in the aircraft flight manual.' },
  ],
  examples: [
    { title: 'Thrust', steps: ['An engine passes 20 kg/s of air, raising its speed from 60 m/s to 110 m/s.', 'Velocity change = 50 m/s.', 'F = 20 × 50 = 1,000 N.'] },
    { title: 'Steady flight', steps: ['Drag in level cruise is 1,400 N.', 'Speed is constant, so forces balance.', 'Thrust must be 1,400 N.'] },
  ],
  practice: [
    num('An engine passes 20 kg/s of air, raising its speed from 60 m/s to 110 m/s. Thrust?', 1000, 2, 'N', '20 × 50 = 1,000 N.'),
    mcq('Thrust is produced by:', ['Accelerating air rearward', 'Heating the wings', 'Reducing the weight', 'Increasing the drag'], 'The reaction pushes the aircraft forward.'),
    num('Drag in steady level cruise is 1,400 N. Thrust required?', 1400, 2, 'N', 'Thrust equals drag at constant speed.'),
    mcq('Compared with a jet, a propeller moves:', ['More air with a smaller change of speed', 'Less air with a larger change of speed', 'No air', 'The same air at the same speed'], 'That is why it is efficient at low speed.'),
    tf('Propeller thrust increases as airspeed increases.', false, 'It is greatest at rest and falls with airspeed.'),
  ],
  assessment: [
    num('An engine accelerates 50 kg/s of air from 100 m/s to 250 m/s. Thrust?', 7500, 10, 'N', '50 × 150 = 7,500 N.'),
    num('An engine accelerates 100 kg/s of air from 200 m/s to 600 m/s. Thrust?', 40000, 40, 'N', '100 × 400 = 40,000 N.'),
    mcq('Thrust is best explained by:', ['Newton\'s third law: action and reaction', 'Archimedes\' principle', 'Ohm\'s law', 'The gas laws alone'], 'Air pushed back pushes the aircraft forward.'),
    mcq('A propeller produces thrust by giving:', ['A large mass of air a small increase in speed', 'A small mass of air a very large increase in speed', 'No air any increase in speed', 'Fuel a high pressure'], 'A jet does the opposite.'),
    tf('The thrust of an engine generally decreases as altitude increases.', true, 'Thinner air means less mass flow.'),
    mcq('In steady, level, unaccelerated flight, thrust is:', ['Equal to drag', 'Greater than drag', 'Equal to weight', 'Zero'], 'Balanced forces give constant speed.'),
    num('Thrust is 3,000 N at a true airspeed of 60 m/s. Power delivered in watts?', 180000, 200, 'W', '3,000 × 60 = 180,000 W.'),
  ],
  missionId: 'm-phys-thrust', sources: ['phak'],
});

export const performance = lesson('Aircraft performance', {
  id: 'phys-aircraft-performance-fundamentals', title: 'Aircraft Performance Fundamentals', minutes: 11, level: 2, prereqs: ['phys-thrust', 'phys-power-in-depth', 'phys-atmos'],
  objectives: ['Explain density altitude.', 'Estimate density altitude from pressure altitude and temperature.', 'List the factors that lengthen a take-off run.', 'Distinguish best angle from best rate of climb.'],
  intro: 'The same aircraft that leaps off a cold sea-level runway may barely climb from a hot, high airfield. Performance is physics applied to the question every pilot must answer before take-off: will it fly, and with what margin?',
  simple: 'Aircraft perform by the density of the air, not by the height on the altimeter. Thin air, a heavy load, a tailwind or a soft or uphill runway all make take-off longer and the climb weaker.',
  sections: [
    { h: 'Density altitude', body: [
      '**Density altitude** is the altitude in the standard atmosphere that has the same air density as the air you are in. It is the altitude the aircraft "feels".',
      'A rule of thumb: `density altitude ≈ pressure altitude + 120 × (temperature − ISA temperature)`, where ISA temperature is 15 °C minus 2 °C per 1,000 ft.',
      'At 2,000 ft pressure altitude and 21 °C, ISA is 11 °C, the day is 10 °C warm, and density altitude is about 3,200 ft.',
    ], formula: 'density-alt', lab: 'formula:density-alt' },
    { h: 'Take-off and landing', body: [
      'A high density altitude reduces engine power, propeller thrust and lift at a given true airspeed. The take-off run is longer and the climb is shallower.',
      'Extra weight lengthens the run. A headwind shortens it; a tailwind lengthens it. An uphill slope, long grass or a soft or wet surface lengthens it too.',
    ] },
    { h: 'Climb speeds', body: [
      '**Vx**, best angle of climb, gains the most height over a given distance: used to clear obstacles. **Vy**, best rate of climb, gains the most height in a given time.',
      'Both come from the excess of thrust and power over what level flight requires, so both suffer when density altitude is high.',
    ], note: 'A rule of thumb is for understanding and cross-checking only. Take-off, climb and landing figures must be calculated from the performance section of the aircraft flight manual, with the margins your regulations require.' },
  ],
  examples: [
    { title: 'Density altitude', steps: ['Pressure altitude 3,000 ft, temperature 19 °C.', 'ISA at 3,000 ft = 15 − 6 = 9 °C, so the day is 10 °C warm.', 'Density altitude ≈ 3,000 + 120 × 10 = 4,200 ft.'] },
    { title: 'Choosing a climb speed', steps: ['Trees stand close to the end of the runway.', 'You need the most height in the shortest distance.', 'Climb at Vx until clear, then accelerate to Vy.'] },
  ],
  practice: [
    num('Pressure altitude 3,000 ft, temperature 19 °C (ISA there is 9 °C). Density altitude by the 120 ft per °C rule?', 4200, 20, 'ft', '3,000 + 120 × 10 = 4,200 ft.'),
    mcq('Density altitude is the altitude the aircraft:', ['Performs as if it were at', 'Is cleared to by air traffic control', 'Reads on the radio altimeter', 'Is above the ground'], 'Performance follows air density.'),
    mcq('A tailwind on take-off:', ['Lengthens the ground run', 'Shortens the ground run', 'Has no effect', 'Increases climb angle'], 'A higher groundspeed is needed to reach flying airspeed.'),
    mcq('Long wet grass on a runway will:', ['Lengthen the take-off run', 'Shorten the take-off run', 'Have no effect', 'Increase engine power'], 'It adds rolling resistance.'),
    tf('On a hot day the density altitude is higher than on a cold day at the same airfield.', true, 'Warm air is less dense.'),
  ],
  assessment: [
    num('Pressure altitude 2,000 ft, temperature 21 °C (ISA there is 11 °C). Density altitude by the 120 ft per °C rule?', 3200, 20, 'ft', '2,000 + 120 × 10 = 3,200 ft.'),
    num('Pressure altitude 5,000 ft, temperature 25 °C (ISA there is 5 °C). Density altitude by the 120 ft per °C rule?', 7400, 20, 'ft', '5,000 + 120 × 20 = 7,400 ft.'),
    mcq('A high density altitude results in:', ['A longer take-off run and a reduced rate of climb', 'A shorter take-off run and a better rate of climb', 'No change in performance', 'More engine power'], 'Thin air reduces power, thrust and lift.'),
    mcq('A headwind on take-off:', ['Shortens the ground run', 'Lengthens the ground run', 'Has no effect', 'Reduces lift'], 'Flying airspeed is reached at a lower groundspeed.'),
    mcq('Vy is the speed for:', ['Best rate of climb: most height in a given time', 'Best angle of climb: most height in a given distance', 'Best glide', 'Maximum level speed'], 'Rate is height per unit of time.'),
    mcq('Vx is the speed for:', ['Best angle of climb: most height in a given distance', 'Best rate of climb: most height in a given time', 'Minimum fuel flow', 'Normal cruise'], 'Used to clear obstacles.'),
    tf('A heavier aircraft needs a longer take-off run than a lighter one in the same conditions.', true, 'It accelerates more slowly and needs a higher lift-off speed.'),
  ],
  missionId: 'm-phys-performance', sources: ['phak'],
});
