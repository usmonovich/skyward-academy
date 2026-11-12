// PPL Phase B — Navigation (5 lessons).
import { lesson, mcq, num, tf } from './q';

export const charts = lesson('Navigation', {
  id: 'ppl-charts-and-projections', title: 'Charts and Projections', minutes: 11, level: 2, prereqs: ['math-basic-coordinate-systems', 'ppl-basic-navigation'],
  objectives: ['Use chart scale to measure distance.', 'Describe the properties of the Lambert conformal conic projection.', 'Distinguish a great circle from a rhumb line.', 'Read terrain and obstacle information on a chart.'],
  intro: 'A chart is a flat picture of a curved Earth, and no flat picture can be right about everything. Knowing what your chart keeps true, and what it bends, is the start of measuring on it correctly.',
  simple: 'The scale tells you how much smaller the chart is than the ground. Most flying charts are drawn so that angles are right and a straight line is very nearly the shortest route. Colours and numbers show how high the ground is.',
  sections: [
    { h: 'Scale', body: [
      'A scale of **1:500,000** means one unit on the chart is 500,000 units on the ground: 1 cm represents 5 km. At **1:250,000**, 1 cm represents 2.5 km.',
      '`ground distance in km = chart distance in cm × scale ÷ 100,000`.',
      'Distances can also be measured against the latitude scale: one minute of latitude is one nautical mile.',
    ], formula: 'chart-dist', lab: 'formula:chart-dist' },
    { h: 'Projections', body: [
      'Most visual flying charts use the **Lambert conformal conic** projection. It is **conformal**: angles and shapes are shown correctly. Scale is nearly constant across the sheet, and a **straight line is very close to a great circle**.',
      'The **Mercator** projection shows lines of constant direction (**rhumb lines**) as straight lines, but its scale grows towards the poles.',
    ] },
    { h: 'Great circles and rhumb lines', body: [
      'A **great circle** is the shortest path between two points on the Earth; its direction changes along the way. A **rhumb line** crosses every meridian at the same angle; it is easier to fly but slightly longer.',
      'Over the short distances of a light-aircraft flight the difference is negligible.',
    ] },
    { h: 'Terrain and obstacles', body: [
      'Height is shown by **contours**, colour **tints**, and **spot heights**. Obstacles are marked with their elevation above sea level and, in brackets, their height above ground.',
      'Many charts print a **maximum elevation figure** for each block of the grid: the highest terrain or obstacle within it.',
    ], note: 'Symbols and conventions differ between chart series. Read the legend of the chart you use, and check that the chart is the current edition.' },
  ],
  examples: [
    { title: 'Distance from scale', steps: ['Two towns are 12 cm apart on a 1:500,000 chart.', '12 × 500,000 ÷ 100,000 = 60.', 'They are 60 km apart.'] },
    { title: 'Using the latitude scale', steps: ['A leg spans 40 minutes of latitude on the side scale.', 'One minute of latitude is one nautical mile.', 'The leg is 40 NM.'] },
  ],
  practice: [
    num('Two towns are 12 cm apart on a 1:500,000 chart. Ground distance in kilometres?', 60, 0.1, 'km', '12 × 5 = 60 km.'),
    mcq('On a 1:250,000 chart, 1 cm represents:', ['2.5 km', '25 km', '250 m', '5 km'], '250,000 cm = 2.5 km.'),
    mcq('A conformal chart shows correctly:', ['Angles and shapes', 'Areas only', 'Nothing', 'Only the equator'], 'This is what makes bearings measurable.'),
    mcq('A great circle is:', ['The shortest path between two points on the Earth', 'A line of constant direction', 'A line of latitude', 'A circle around an aerodrome'], 'Its direction changes along the route.'),
    tf('A spot height on a chart shows the height of the ground at that point.', true, 'Usually above mean sea level.'),
  ],
  assessment: [
    num('Two points are 8 cm apart on a 1:500,000 chart. Ground distance in kilometres?', 40, 0.1, 'km', '8 × 5 = 40 km.'),
    num('Two points are 10 cm apart on a 1:250,000 chart. Ground distance in kilometres?', 25, 0.1, 'km', '10 × 2.5 = 25 km.'),
    mcq('On a Lambert conformal conic chart, a straight line is approximately:', ['A great circle', 'A rhumb line', 'A line of latitude', 'A spiral'], 'One reason the projection suits navigation.'),
    mcq('A rhumb line is a line that:', ['Crosses every meridian at the same angle', 'Is the shortest distance between two points', 'Follows a river', 'Joins points of equal height'], 'It is a line of constant direction.'),
    mcq('On a Mercator chart, scale:', ['Increases towards the poles', 'Is constant everywhere', 'Decreases towards the poles', 'Is not defined'], 'High latitudes appear enlarged.'),
    mcq('A maximum elevation figure shows:', ['The highest terrain or obstacle within a block of the chart', 'The highest cloud base', 'The highest permitted altitude', 'The elevation of the nearest aerodrome'], 'Used for a quick check of safe altitude.'),
    tf('One minute of latitude on the side scale of a chart equals one nautical mile.', true, 'So the latitude scale measures distance.'),
  ],
  missionId: 'm-ppl-charts', sources: ['phak'],
});

export const compass = lesson('Navigation', {
  id: 'ppl-magnetism-and-the-compass', title: 'Magnetism and the Compass', minutes: 12, level: 2, prereqs: ['phys-magnetism', 'ppl-charts-and-projections'],
  objectives: ['Convert between true, magnetic and compass directions.', 'Explain isogonic lines.', 'Describe the turning and acceleration errors of a direct-reading compass.', 'State when the compass can be read accurately.'],
  intro: 'The magnetic compass never fails for lack of power, which is exactly why it must be understood. It is also wrong in predictable ways whenever the aircraft is turning or changing speed.',
  simple: 'A chart is drawn to true north, but the compass points to magnetic north and is also disturbed a little by the aircraft itself. Two small corrections take you from one to the other. Read the compass only when flying straight, level and at steady speed.',
  sections: [
    { h: 'True, magnetic, compass', body: [
      '**True** direction is measured from the geographic pole. Apply **variation** to get **magnetic** direction; apply **deviation** to get **compass** direction.',
      'Easterly variation is subtracted and westerly variation added when going from true to magnetic: "east is least, west is best". Deviation is read from the compass card in the aircraft and applied as it states.',
      'True 100°, variation 5° W, deviation −2°: magnetic 105°, compass 103°.',
    ], formula: 'true-to-mag', lab: 'formula:true-to-mag' },
    { h: 'Isogonic lines', body: [
      'Charts show **isogonic lines** joining places of equal variation. The line of zero variation is the **agonic line**. Variation changes slowly with the years, so charts print the year and the annual change.',
    ] },
    { h: 'Compass errors', body: [
      'The Earth\'s field dips downward away from the equator, and the compass magnet is weighted to stay level. That weighting makes the compass misread when the aircraft accelerates or turns.',
      '**Acceleration error**, on easterly or westerly headings in the northern hemisphere: **A**ccelerate shows a turn towards **N**orth, **D**ecelerate towards **S**outh ("ANDS").',
      '**Turning error**, in the northern hemisphere: turning through north the compass lags, so roll out early (**U**ndershoot **N**orth); turning through south it leads, so roll out late (**O**vershoot **S**outh): "UNOS".',
      'In the southern hemisphere both errors are reversed.',
    ], lab: 'explore:compass-errors' },
    { h: 'Using it', body: [
      'Read the compass only in **straight, level, unaccelerated flight**. Use it to set the heading indicator, and fly by the heading indicator.',
    ], note: 'Variation values in this lesson are invented for practice. Use the variation on a current chart and the deviation card in your own aircraft.' },
  ],
  examples: [
    { title: 'True to compass', steps: ['True track 240°, variation 8° E, deviation +3°.', 'Magnetic = 240 − 8 = 232°.', 'Compass = 232 + 3 = 235°.'] },
    { title: 'Turning onto north', steps: ['In the northern hemisphere you turn left from 090° towards 360°.', 'The compass lags when turning through north.', 'Roll out before the compass reaches north.'] },
  ],
  practice: [
    num('True track 240°, variation 8° E. Magnetic track?', 232, 0.5, '°', '240 − 8 = 232°.'),
    num('Magnetic heading 232°, deviation +3°. Compass heading?', 235, 0.5, '°', '232 + 3 = 235°.'),
    mcq('Isogonic lines join places of equal:', ['Variation', 'Elevation', 'Pressure', 'Temperature'], 'They are printed on navigation charts.'),
    mcq('Deviation is found from:', ['The compass card in the aircraft', 'The chart', 'The weather report', 'The altimeter'], 'It is specific to each aircraft.'),
    tf('The magnetic compass can be read accurately during a turn.', false, 'Read it only in straight, level, unaccelerated flight.'),
  ],
  assessment: [
    num('True track 100°, variation 5° W. Magnetic track?', 105, 0.5, '°', '100 + 5 = 105°.'),
    num('True track 075°, variation 10° E, deviation +2°. Compass heading in still air?', 67, 0.5, '°', 'Magnetic 065°, compass 067°.'),
    mcq('The agonic line joins places where variation is:', ['Zero', 'Greatest', '10° E', '90°'], 'True and magnetic north are in the same direction there.'),
    mcq('In the northern hemisphere, accelerating on an easterly heading makes the compass show:', ['A turn towards north', 'A turn towards south', 'No change', 'A reversal'], 'ANDS: accelerate north, decelerate south.'),
    mcq('In the northern hemisphere, when turning onto a northerly heading by compass you should:', ['Roll out early, before the compass shows north', 'Roll out late, after the compass shows north', 'Roll out exactly on north', 'Not turn at all'], 'UNOS: undershoot north, overshoot south.'),
    mcq('Compass turning and acceleration errors are caused by:', ['Magnetic dip', 'Altitude', 'Temperature', 'Engine vibration only'], 'The magnet is weighted to counter the dip.'),
    tf('In the southern hemisphere the compass turning and acceleration errors are reversed.', true, 'The dip is towards the other pole.'),
  ],
  missionId: 'm-ppl-compass', sources: ['phak'],
});

export const deadReckoning = lesson('Navigation', {
  id: 'ppl-dead-reckoning', title: 'Dead Reckoning', minutes: 12, level: 2, prereqs: ['ppl-magnetism-and-the-compass', 'math-navigation-calculations-and-the-1-in-60-rule'],
  objectives: ['Describe the triangle of velocities.', 'Estimate drift with the maximum-drift rule.', 'Calculate heading, groundspeed and time for a leg.', 'Revise an estimate of arrival time from a fix.'],
  intro: 'Dead reckoning is navigation by arithmetic: if I hold this heading at this speed for this long, I will be there. It is how every flight is planned and how every other navigation method is checked.',
  simple: 'The wind pushes the aircraft sideways and speeds it up or slows it down. Work out how much to point into the wind and what your speed over the ground will be, then use time to know where you are.',
  sections: [
    { h: 'The triangle of velocities', body: [
      'Three vectors form a triangle: **heading and true airspeed** (the aircraft through the air), **wind direction and speed** (the air over the ground), and **track and groundspeed** (the aircraft over the ground).',
      'Knowing any two gives the third.',
    ] },
    { h: 'Estimating drift', body: [
      '**Maximum drift**, with the wind at right angles to the track, is about `wind speed × 60 ÷ true airspeed` degrees. With a 20 kt wind at 100 kt, about 12°.',
      'For a wind at an angle to the track, take a fraction of the maximum: about half at 30°, about 0.7 at 45°, about 0.9 at 60°.',
      'Point the nose **into** the wind by the drift angle: wind from the left, heading is less than track.',
    ], formula: 'max-drift', lab: 'formula:max-drift' },
    { h: 'Groundspeed and time', body: [
      'Groundspeed is true airspeed minus the headwind component, or plus the tailwind component. `time in minutes = distance ÷ groundspeed × 60`.',
      '60 NM at a groundspeed of 90 kt takes 40 minutes.',
    ] },
    { h: 'Revising in flight', body: [
      'At a known point, note the time. Compare with the plan to find the actual groundspeed, then revise the estimate for the next point.',
      'If 20 NM took 15 minutes, the groundspeed is 80 kt, and the next 40 NM will take 30 minutes.',
    ], note: 'Mental methods give estimates. Plan with a flight computer or approved software, and use mental arithmetic to cross-check and to adjust in the air.' },
  ],
  examples: [
    { title: 'Heading for a leg', steps: ['Track 090°, TAS 100 kt, wind from the north at 20 kt.', 'The wind is at 90° to the track: drift ≈ 20 × 60 ÷ 100 = 12°. It comes from the left.', 'Heading = 090 − 12 = 078°.'] },
    { title: 'Revised estimate', steps: ['The first 20 NM took 15 minutes.', 'Groundspeed = 20 ÷ 15 × 60 = 80 kt.', 'The remaining 40 NM will take 40 ÷ 80 × 60 = 30 minutes.'] },
  ],
  practice: [
    num('Wind speed 20 kt at right angles to track, TAS 100 kt. Maximum drift?', 12, 0.2, '°', '20 × 60 ÷ 100 = 12°.'),
    num('Track 090°, drift correction 12° into a wind from the left. Heading?', 78, 0.5, '°', '090 − 12 = 078°.'),
    num('A leg of 60 NM at a groundspeed of 90 kt. Time in minutes?', 40, 0.2, 'min', '60 ÷ 90 × 60 = 40 min.'),
    mcq('The triangle of velocities is formed by:', ['Heading and airspeed, wind, track and groundspeed', 'Lift, weight and drag', 'Latitude, longitude and altitude', 'Pitch, roll and yaw'], 'Any two give the third.'),
    tf('With a wind from the right, the heading must be less than the track.', false, 'Point into the wind: the heading is greater than the track.'),
  ],
  assessment: [
    num('Wind speed 30 kt at right angles to track, TAS 120 kt. Maximum drift?', 15, 0.2, '°', '30 × 60 ÷ 120 = 15°.'),
    num('Track 270°, drift correction 10° into a wind from the right. Heading?', 280, 0.5, '°', '270 + 10 = 280°.'),
    num('TAS 110 kt with a 20 kt headwind component. Groundspeed?', 90, 0.2, 'kt', '110 − 20 = 90 kt.'),
    num('A leg of 45 NM at a groundspeed of 90 kt. Time in minutes?', 30, 0.2, 'min', '45 ÷ 90 × 60 = 30 min.'),
    num('The first 20 NM of a leg took 15 minutes. Actual groundspeed?', 80, 0.2, 'kt', '20 ÷ 15 × 60 = 80 kt.'),
    mcq('To hold a track with the wind from the left, the pilot steers a heading that is:', ['Less than the track', 'Greater than the track', 'Equal to the track', 'The reciprocal of the track'], 'The nose points left, into the wind.'),
    tf('A tailwind component increases groundspeed above true airspeed.', true, 'The air mass carries the aircraft along.'),
  ],
  missionId: 'm-ppl-dr', sources: ['phak'],
});

export const radioNav = lesson('Navigation', {
  id: 'ppl-radio-navigation-fundamentals', title: 'Radio Navigation Fundamentals', minutes: 12, level: 2, prereqs: ['ppl-dead-reckoning', 'phys-waves'],
  objectives: ['Explain how a VOR gives a radial.', 'Explain what a DME reading represents.', 'Calculate a magnetic bearing to an NDB.', 'State the main limitations of each aid.'],
  intro: 'Ground radio beacons were the backbone of navigation for half a century and are still on every chart. They also teach the idea behind all instrument navigation: a line of position from a known point.',
  simple: 'A VOR tells you which line from the station you are on. A DME tells you how far away the station is. An ADF needle simply points at an NDB. Each has its own limits, and every station must be identified before it is trusted.',
  sections: [
    { h: 'VOR', body: [
      'A **VOR** (VHF omnidirectional range) transmits in the VHF band between 108 and about 118 MHz. It defines 360 **radials**: magnetic bearings **from** the station.',
      'The pilot selects a course; the **deviation indicator** shows whether that course line is to the left or right, and a **TO/FROM** flag shows whether flying the selected course leads to or away from the station. Full-scale deflection is about 10°.',
      'VHF is line-of-sight: range increases with height and is blocked by terrain.',
    ] },
    { h: 'DME', body: [
      '**DME** (distance measuring equipment) measures the time for a signal to travel to the ground station and back, and shows distance in nautical miles.',
      'It shows **slant range**, not distance along the ground. Directly overhead a station at 6,000 ft it reads about 1 NM.',
    ] },
    { h: 'NDB and ADF', body: [
      'An **NDB** (non-directional beacon) transmits in the low and medium frequency bands. The aircraft\'s **ADF** needle points to the station, giving a **relative bearing** measured clockwise from the nose.',
      '`magnetic bearing to the station = magnetic heading + relative bearing` (subtract 360 if over 360).',
      'NDB signals bend and fade: errors arise at night, near coastlines, over mountains and near thunderstorms.',
    ], formula: 'adf-mb', lab: 'formula:adf-mb' },
    { h: 'Using any aid', body: [
      'Tune the frequency, **identify** the station by its Morse code, and only then use the indication. Cross-check with another source and with the chart.',
    ], note: 'Many NDBs and some VORs are being withdrawn as satellite navigation takes over. Check current aeronautical information for the aids on your route.' },
  ],
  examples: [
    { title: 'Bearing to an NDB', steps: ['Magnetic heading is 300° and the ADF shows a relative bearing of 090°.', '300 + 090 = 390; subtract 360.', 'The magnetic bearing to the station is 030°.'] },
    { title: 'Where am I from the VOR?', steps: ['With 090 selected and a FROM flag, the needle is centred.', 'You are on the 090 radial.', 'You are east of the station.'] },
  ],
  practice: [
    num('Magnetic heading 040°, relative bearing 030°. Magnetic bearing to the NDB?', 70, 0.5, '°', '040 + 030 = 070°.'),
    mcq('A VOR radial is a magnetic bearing:', ['From the station', 'To the station', 'From the aircraft\'s nose', 'From true north to the aircraft'], 'Radials radiate outward from the VOR.'),
    mcq('DME shows:', ['Slant range to the station', 'Distance along the ground only', 'Height above the station', 'Bearing to the station'], 'It includes the effect of height.'),
    mcq('Before using any radio navigation aid, the pilot must:', ['Identify it by its Morse code', 'Switch off the radio', 'Descend', 'Change the transponder code'], 'A wrong or faulty station must not be followed.'),
    tf('VOR signals follow the curve of the Earth and are received at any height.', false, 'VHF is line-of-sight.'),
  ],
  assessment: [
    num('Magnetic heading 300°, relative bearing 090°. Magnetic bearing to the NDB?', 30, 0.5, '°', '300 + 090 = 390, minus 360 = 030°.'),
    num('Magnetic heading 120°, relative bearing 045°. Magnetic bearing to the NDB?', 165, 0.5, '°', '120 + 045 = 165°.'),
    mcq('An aircraft on the 090 radial of a VOR is:', ['East of the station', 'West of the station', 'North of the station', 'South of the station'], 'Radials are bearings from the station.'),
    mcq('Directly overhead a DME station at 6,000 ft, the DME reads about:', ['1 NM', '0 NM', '6 NM', '60 NM'], '6,000 ft is about 1 NM of slant range.'),
    mcq('An ADF needle points:', ['To the NDB', 'To magnetic north', 'To the nearest runway', 'Along the track'], 'It gives a relative bearing.'),
    mcq('NDB bearings are least reliable:', ['At night and near thunderstorms', 'In clear daytime conditions', 'Directly overhead', 'At high noon in summer only'], 'The signals are reflected and bent.'),
    tf('The TO/FROM flag on a VOR indicator shows whether flying the selected course leads to or away from the station.', true, 'It does not show the aircraft heading.'),
  ],
  missionId: 'm-ppl-radionav', sources: ['phak', 'faa-aim'],
});

export const gnss = lesson('Navigation', {
  id: 'ppl-gnss-basics', title: 'GNSS Basics', minutes: 11, level: 2, prereqs: ['ppl-radio-navigation-fundamentals'],
  objectives: ['Explain how a satellite navigation receiver finds its position.', 'State how many satellites are needed.', 'Describe integrity monitoring and augmentation.', 'List the limitations and the correct use of GNSS in visual flight.'],
  intro: 'Satellite navigation is so accurate and so easy that it has become the main cause of a new kind of error: following a magenta line into airspace, terrain or weather without looking outside.',
  simple: 'Satellites broadcast the time and where they are. A receiver measures how long each signal took to arrive and works out its own position. It needs at least four satellites. It is very accurate, but it can fail, be jammed, or be loaded with old data.',
  sections: [
    { h: 'How it works', body: [
      '**GNSS** (global navigation satellite system) is the general name; **GPS** is the United States system, alongside Galileo, GLONASS and BeiDou.',
      'Each satellite transmits its position and a precise time signal. The receiver measures the travel time of each signal to find its distance from each satellite. Distances from **at least four satellites** give a three-dimensional position and correct the receiver\'s clock.',
    ] },
    { h: 'Integrity and augmentation', body: [
      '**RAIM** (receiver autonomous integrity monitoring) lets a receiver check that the satellites agree with each other. It needs at least **five** satellites to detect a fault.',
      '**SBAS** (satellite-based augmentation, such as EGNOS in Europe and WAAS in North America) sends corrections and integrity information, improving accuracy.',
    ], lab: 'explore:gnss' },
    { h: 'Limitations', body: [
      'Signals are weak and can be lost through **interference or jamming**, poor antenna position or satellite outages. The **database** of airspace and waypoints goes out of date. A wrong waypoint or a slip of the finger sends the aircraft confidently to the wrong place.',
      'GNSS **altitude** is a geometric height. It is not the same as barometric altitude and must not be used in place of the altimeter.',
    ] },
    { h: 'Using it well', body: [
      'In visual flight, GNSS **supports** navigation; it does not replace planning, the chart, or looking out. Plan the flight fully, load and check the route on the ground, and keep track of position on the chart so that a failure is an inconvenience, not an emergency.',
    ], note: 'Approval to use GNSS as a primary means of navigation depends on the equipment, its installation and the rules of the state. A portable device is an aid only.' },
  ],
  examples: [
    { title: 'Signal lost', steps: ['The GNSS position freezes and a "no position" message appears.', 'You have been marking the chart every ten minutes.', 'Continue by heading and time from the last known position, and confirm with ground features.'] },
    { title: 'Out-of-date data', steps: ['The device\'s airspace database is two years old.', 'New restricted areas are not shown.', 'Check current charts and notices; do not rely on the device for airspace.'] },
  ],
  practice: [
    mcq('GNSS is:', ['The general name for satellite navigation systems', 'A type of VOR', 'A weather report', 'A radar service'], 'GPS, Galileo, GLONASS and BeiDou are examples.'),
    num('What is the minimum number of satellites for a three-dimensional GNSS position?', 4, 0.01, '', 'Four: three dimensions plus the receiver clock error.'),
    mcq('SBAS provides:', ['Corrections and integrity information that improve accuracy', 'Voice communication', 'Fuel information', 'Engine monitoring'], 'EGNOS and WAAS are examples.'),
    mcq('GNSS altitude is:', ['A geometric height, not barometric altitude', 'The same as the altimeter reading', 'Always more accurate than the altimeter for separation', 'Pressure altitude'], 'Fly levels by the altimeter.'),
    tf('A GNSS database stays correct indefinitely.', false, 'Airspace and waypoints change; the data must be kept current.'),
  ],
  assessment: [
    mcq('A GNSS receiver finds its distance from a satellite by measuring:', ['The time the signal took to arrive', 'The colour of the signal', 'The satellite\'s size', 'The Doppler shift of the engine'], 'Distance is speed multiplied by time.'),
    num('What is the minimum number of satellites RAIM needs to detect a fault?', 5, 0.01, '', 'Five: one more than is needed for a position.'),
    mcq('RAIM is:', ['A check by the receiver that the satellite signals agree', 'A ground radar', 'A type of flight plan', 'A radio frequency'], 'Receiver autonomous integrity monitoring.'),
    mcq('Which of these can cause loss of GNSS position?', ['Interference or jamming', 'A full fuel tank', 'A tailwind', 'Low humidity'], 'The signals are very weak.'),
    mcq('In visual flight, GNSS should be used:', ['To support navigation alongside the chart and lookout', 'As the only means of navigation with no planning', 'Instead of looking outside', 'Instead of the altimeter'], 'So that a failure is not an emergency.'),
    mcq('EGNOS and WAAS are examples of:', ['Satellite-based augmentation systems', 'Ground-based beacons', 'Weather radars', 'Flight plan formats'], 'They improve accuracy and integrity.'),
    tf('GPS is one of several global navigation satellite systems.', true, 'Others include Galileo, GLONASS and BeiDou.'),
  ],
  missionId: 'm-ppl-gnss', sources: ['phak', 'faa-aim'],
});
