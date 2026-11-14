// ATPL — General Navigation 061 (3 lessons) and Radio Navigation 062 (4 lessons).
// Written from memory of standard references; not verified against current documents.
import { lesson, mcq, num, tf } from './q';

export const earthTime = lesson('General navigation', {
  id: 'atpl-the-earth-and-time', title: 'The Earth and Time', minutes: 13, level: 3, prereqs: ['cpl-great-circles-and-rhumb-lines'],
  objectives: ['Describe the shape and graticule of the Earth.', 'Convert between distance and angular measure.', 'Convert between UTC and local mean time.', 'Describe civil twilight and the effect of latitude on day length.'],
  intro: 'Prerequisite review: great circles are the shortest paths and one minute of latitude is one nautical mile. A long-haul crew also lives by the clock: every time in a flight plan is in UTC, and every sunrise, curfew and duty limit depends on converting it.',
  simple: 'The Earth is very nearly a sphere, slightly flattened at the poles. Position is given by latitude and longitude. The Earth turns 15 degrees every hour, so every 15 degrees of longitude is one hour of time difference.',
  sections: [
    { h: 'Shape and position', body: [
      'The Earth is an **oblate spheroid**: its polar diameter is about 0.3% smaller than its equatorial one. For navigation it is treated as a sphere, with the nautical mile defined as 1,852 m, about one minute of latitude.',
      '**Latitude** is measured north or south of the equator (0° to 90°); **longitude** is measured east or west of the Greenwich meridian (0° to 180°). Meridians are great circles; parallels, except the equator, are small circles.',
    ] },
    { h: 'Arc and time', body: [
      'The Earth rotates 360° in 24 hours: **15° of longitude per hour**, or 1° in 4 minutes.',
      '`local mean time = UTC + longitude ÷ 15` (hours), with east longitude positive. At 75° W, local mean time is UTC − 5 hours; at 45° E it is UTC + 3.',
      'Standard time zones use whole hours (some use half hours) so that clocks in a region agree.',
    ], formula: 'lmt', lab: 'formula:lmt' },
    { h: 'Day and twilight', body: [
      'Sunrise and sunset times depend on date and latitude: near the equator the day is about 12 hours all year; near the poles it varies from continuous daylight to continuous darkness.',
      '**Civil twilight** ends when the centre of the Sun is 6° below the horizon. Rules for night flying and aircraft lighting are tied to it.',
    ] },
    { h: 'International date line', body: [
      'The date changes at about the 180° meridian. Crossing it eastwards, the calendar date goes back one day; westwards, it goes forward one day. Flight plans avoid the confusion by using UTC throughout.',
    ], note: 'Time zones and daylight-saving rules are set by governments and change. Use current data for planning.' },
  ],
  examples: [
    { title: 'Local mean time', steps: ['UTC is 1200 and longitude is 105° E.', '105 ÷ 15 = 7 hours.', 'Local mean time is 1900.'] },
    { title: 'Arc to time', steps: ['Two places differ by 30° of longitude.', '30 × 4 minutes.', 'Their local mean times differ by 2 hours.'] },
  ],
  practice: [
    num('UTC is 1200 and longitude is 105° E. Local mean time in hours (UTC + longitude ÷ 15)?', 19, 0.02, 'h', '12 + 7 = 19, which is 1900.'),
    num('How many degrees of longitude correspond to 1 hour of time?', 15, 0.1, '°', '360° ÷ 24 h = 15° per hour.'),
    mcq('The shape of the Earth is best described as:', ['An oblate spheroid', 'A perfect sphere', 'A cube', 'A long cylinder'], 'Slightly flattened at the poles.'),
    mcq('Civil twilight ends when the centre of the Sun is:', ['6° below the horizon', 'At the horizon', '18° below the horizon', '12° above the horizon'], 'Night rules are tied to it.'),
    tf('Crossing the date line eastwards, the date goes forward one day.', false, 'Eastwards, the date goes back one day.'),
  ],
  assessment: [
    num('UTC is 0600 and longitude is 75° W. Local mean time in hours (UTC + longitude ÷ 15, west negative)?', 1, 0.02, 'h', '6 − 5 = 1, which is 0100.'),
    num('Two places differ by 45° of longitude. Difference in local mean time in hours?', 3, 0.02, 'h', '45 ÷ 15 = 3 hours.'),
    num('One degree of longitude corresponds to how many minutes of time?', 4, 0.05, 'min', '60 minutes ÷ 15 = 4 minutes.'),
    mcq('The nautical mile is defined as exactly:', ['1,852 m', '1,609 m', '1,000 m', '1,760 yards'], 'About one minute of latitude.'),
    mcq('Near the equator, the length of day through the year is:', ['About 12 hours', 'Zero in winter', '24 hours in summer', 'Variable by several hours'], 'It varies little with the seasons.'),
    mcq('Flight plan times are expressed in:', ['UTC', 'Local mean time', 'Zone time of the departure airport', 'Solar time'], 'So that a time means the same everywhere.'),
    tf('Parallels of latitude, other than the equator, are great circles.', false, 'They are small circles.'),
  ],
  missionId: 'm-atpl-time', sources: ['icao-a1'],
});

export const longRangeCharts = lesson('General navigation', {
  id: 'atpl-charts-for-long-range-navigation', title: 'Charts for Long-Range Navigation', minutes: 13, level: 3, prereqs: ['atpl-the-earth-and-time', 'ppl-charts-and-projections'],
  objectives: ['Compare Mercator, Lambert and polar stereographic projections.', 'Define grid, convergence and scale factor.', 'Explain why a straight line on a Lambert chart is nearly a great circle.', 'Describe polar navigation difficulties.'],
  intro: 'Prerequisite review: a chart distorts something, and conformal charts keep angles correct. For long-haul flying the question is which projection keeps the distortion smallest on the route, and what happens to direction near the poles.',
  simple: 'No flat chart is right everywhere. Mercator suits low latitudes and constant headings; Lambert suits mid-latitude routes where a straight line is nearly the shortest path; polar stereographic suits the polar regions, where meridians converge on one point.',
  sections: [
    { h: 'Three projections', body: [
      '**Mercator**: a cylinder touching the equator; meridians are parallel, so scale grows with latitude. Rhumb lines are straight; a great circle appears as a curve bowed towards the equator.',
      '**Lambert conformal conic**: a cone cutting the sphere at two **standard parallels**; scale is nearly constant between them, and a straight line is very close to a great circle. Meridians are straight lines converging at the pole.',
      '**Polar stereographic**: a plane touching the pole; meridians are straight lines radiating from the pole, and great circles are close to straight lines.',
    ], lab: 'explore:projections' },
    { h: 'Grid navigation', body: [
      'Near the poles meridians converge so rapidly that direction relative to true north changes very fast. A **grid** is overlaid, with **grid north** along one chosen meridian (commonly Greenwich). **Grid heading** is measured from grid north.',
      '**Grid convergence** is the angle between true north and grid north at a point: it is zero on the reference meridian and equals the change of longitude from it multiplied by sin(latitude) on a polar chart. Close to the pole it can be large.',
    ] },
    { h: 'Scale', body: [
      'Chart **scale factor** is the ratio of chart scale to nominal scale; it is 1 at the standard parallels and varies slightly elsewhere. Distances on a Lambert chart are measured with the scale rule for the area, accurate within about 1%.',
    ] },
    { h: 'Polar problems', body: [
      'Magnetic compasses are unreliable near the magnetic poles, where the field is nearly vertical. True or grid references from inertial and satellite systems are used instead. Lines of longitude, and hence time zones, converge at the poles.',
    ], note: 'Chart series and conventions differ. Check the legend and the projection of the chart in use.' },
  ],
  examples: [
    { title: 'Choosing a chart', steps: ['A route lies between 40° N and 60° N, running east to west across an ocean.', 'The route is in mid-latitudes with moderate convergence.', 'A Lambert conformal chart suits it: a straight line is nearly the great circle.'] },
    { title: 'Near the pole', steps: ['A compass is useless within a few hundred miles of the north magnetic pole.', 'The aircraft flies by grid heading from the inertial system.', 'Grid north is a fixed reference, unlike true north.'] },
  ],
  practice: [
    mcq('On a Mercator chart, a rhumb line appears as:', ['A straight line', 'A curve bowed towards the pole', 'A circle', 'A spiral'], 'A great circle appears as a curve bowed towards the equator.'),
    mcq('A Lambert conformal chart has its scale nearly constant between:', ['The two standard parallels', 'The equator and the pole', 'Two meridians', 'The poles only'], 'The cone cuts the sphere there.'),
    mcq('Grid north is:', ['A fixed direction on the chart, along a chosen meridian', 'The direction to the magnetic pole', 'Always the same as true north', 'The direction of the wind'], 'Used where true north changes rapidly.'),
    mcq('Near the magnetic poles, the magnetic compass is:', ['Unreliable', 'Most accurate', 'Unaffected', 'Replaced by the sun'], 'The horizontal component of the field is very weak.'),
    tf('On a polar stereographic chart, meridians are straight lines radiating from the pole.', true, 'The chart is a plane touching the pole.'),
  ],
  assessment: [
    mcq('On a Lambert chart, a straight line between two points is nearly:', ['A great circle', 'A rhumb line', 'A parallel of latitude', 'A small circle'], 'One reason it is used for mid-latitude routes.'),
    mcq('Grid convergence is:', ['The angle between true north and grid north', 'The angle between magnetic and true north', 'The angle between heading and track', 'The convergence of two parallels'], 'It varies with position.'),
    mcq('A Mercator chart is mainly suited to:', ['Low latitudes and constant-heading navigation', 'Polar navigation', 'Great circle plotting at high latitude', 'Measuring area'], 'Scale grows with latitude.'),
    mcq('The polar stereographic projection is a:', ['Plane touching the pole', 'Cylinder touching the equator', 'Cone cutting two parallels', 'Cube'], 'Used for polar regions.'),
    mcq('Grid headings are used near the poles because:', ['True north changes direction rapidly there', 'The Sun is always visible', 'Winds are stronger', 'Radio aids work better'], 'Meridians converge.'),
    mcq('Standard parallels on a Lambert chart are where:', ['The scale factor is 1', 'The chart is torn', 'The wind is zero', 'Time zones begin'], 'The cone intersects the Earth.'),
    tf('Time zones converge at the poles because lines of longitude converge.', true, 'The meridians meet at the pole.'),
  ],
  missionId: 'm-atpl-charts', sources: ['phak'],
});

export const inertialGrid = lesson('General navigation', {
  id: 'atpl-inertial-and-grid-navigation', title: 'Inertial and Grid Navigation', minutes: 12, level: 3, prereqs: ['atpl-charts-for-long-range-navigation', 'atpl-inertial-reference-systems'],
  objectives: ['Explain grid navigation with an inertial system.', 'Describe how to use grid track and grid heading.', 'Describe waypoint insertion and cross-checking.', 'State how errors are detected on ocean crossings.'],
  intro: 'Prerequisite review: an inertial system gives position and groundspeed without external signals, and drifts slowly with time, while grid north gives a direction that does not change near the poles. On remote oceanic and polar routes, those two ideas are the aircraft\'s navigation.',
  simple: 'The inertial system flies a route from waypoint to waypoint. Over oceans and near the poles it uses grid directions so that headings stay meaningful. Crews do not trust one system alone: they check against each other, against the plan and against any outside fix.',
  sections: [
    { h: 'Navigating on inertial position', body: [
      'The flight management system flies great circle legs between waypoints using inertial (and satellite) position. The crew enters waypoints as **latitude and longitude**, commonly in whole degrees on the oceanic track system so that they are easy to check.',
    ], lab: 'explore:grid-nav' },
    { h: 'Grid heading and track', body: [
      'In **grid mode** the system displays grid heading and grid track. `grid heading = true heading − grid convergence` (with the sign conventions of the chart). Flying a constant grid heading approximates a straight line on a polar chart.',
      'A transition to true references is made when leaving the polar region.',
    ] },
    { h: 'Checking', body: [
      'Every waypoint is checked three ways: coordinates against the flight plan; **distance and track** between waypoints against the plan; and the route displayed on the map against the chart. Gross errors are most often a wrong digit or hemisphere.',
      'At each waypoint the crew records the time and fuel and checks the cross-track error.',
    ] },
    { h: 'Ocean crossings', body: [
      'Out of range of ground aids, errors are caught by comparing **independent sources** (two or three inertial/satellite systems, and the radio position when possible) and by comparing a computed wind with forecast winds. Any disagreement above the stated tolerance is investigated at once, because an uncorrected error grows with distance.',
    ], note: 'Oceanic procedures and tolerances are published by the states responsible and differ between regions. The figures here are from memory.' },
  ],
  examples: [
    { title: 'Gross error check', steps: ['A waypoint is entered as 50° N 030° W; the plan says 50° N 030° E.', 'The hemisphere is wrong.', 'The distance leg is thousands of miles too long: the check catches it.'] },
    { title: 'Independent sources', steps: ['Two inertial systems disagree by 12 NM after 4 hours.', 'The third system is compared and agrees with one of them.', 'The deviating system is identified and its data disregarded.'] },
  ],
  practice: [
    mcq('On the oceanic track system, waypoints are commonly entered as:', ['Whole degrees of latitude and longitude', 'Radio beacon names', 'Chart grid squares', 'Magnetic bearings'], 'They are easy to check.'),
    mcq('A common gross error when entering coordinates is:', ['A wrong digit or hemisphere', 'Using too many waypoints', 'Setting the clock', 'Selecting the wrong fuel'], 'Checks of distance and track expose it.'),
    mcq('Grid mode is used mainly:', ['Near the poles', 'Near the equator', 'In terminal areas', 'On the ground'], 'True north changes too rapidly there.'),
    mcq('Independent navigation sources are compared in order to:', ['Detect errors early', 'Use less fuel', 'Reduce the crew', 'Avoid radio calls'], 'Errors grow with distance.'),
    tf('A single inertial system is sufficient for an ocean crossing without any cross-checks.', false, 'Several systems and cross-checks are used.'),
  ],
  assessment: [
    mcq('A waypoint is entered as 50° N 030° W but the plan shows 50° N 030° E. This is an error of:', ['Hemisphere', 'Level', 'Speed', 'Time'], 'The leg lengths and tracks will be wildly wrong.'),
    mcq('Grid heading is derived from true heading by applying:', ['Grid convergence', 'Magnetic variation', 'Deviation', 'Drift'], 'The angle between true and grid north.'),
    mcq('At each waypoint over the ocean the crew records:', ['Time, fuel and cross-track error', 'Only the time', 'The passenger count', 'The cabin temperature'], 'And checks them against the plan.'),
    mcq('A computed wind that differs greatly from the forecast may indicate:', ['A navigation system error', 'A calm atmosphere', 'A closed airspace', 'An engine failure'], 'It is a cross-check on position.'),
    mcq('When leaving the polar region, the crew:', ['Transitions back to true references', 'Switches off the inertial system', 'Stays in grid mode always', 'Lands'], 'Grid is used only where needed.'),
    mcq('The inertial systems in the aircraft are used:', ['Together, and compared with each other', 'One at a time, never compared', 'Only on the ground', 'Instead of the flight plan'], 'Disagreement is investigated at once.'),
    tf('Uncorrected navigation errors grow with distance flown.', true, 'Early detection matters.'),
  ],
  missionId: 'm-atpl-gridnav', sources: ['phak'],
});

export const propagation = lesson('Radio navigation', {
  id: 'atpl-radio-wave-propagation', title: 'Radio Wave Propagation', minutes: 12, level: 3, prereqs: ['phys-waves', 'cpl-radio-navigation-vor-dme-and-ils'],
  objectives: ['Name the frequency bands used in aviation.', 'Describe ground wave, sky wave and space wave.', 'Explain why HF range varies with time of day.', 'Calculate wavelength from frequency.'],
  intro: 'Prerequisite review: radio waves are electromagnetic, travel at 300,000,000 m/s, and VHF is limited to line of sight. Each band behaves differently, and a pilot who knows why can predict when an aid will be unreliable.',
  simple: 'Low frequencies follow the ground. High frequencies go in straight lines. In between, some waves bounce off a layer high in the atmosphere and come back to Earth far away, but only at certain times of day. Different jobs use different bands for this reason.',
  sections: [
    { h: 'Bands', body: [
      '**LF/MF** (30 to 3,000 kHz): NDB. **HF** (3 to 30 MHz): long-range voice. **VHF** (30 to 300 MHz): VOR (108 to 117.95 MHz), ILS localiser (108 to 111.95 MHz), VHF voice (118 to 137 MHz). **UHF** (300 to 3,000 MHz): glide path, DME, TACAN, radar, GNSS, TCAS.',
      'Wavelength: `λ (m) = 300 ÷ f (MHz)`. At 120 MHz, 2.5 m; at 1,000 MHz, 0.3 m.',
    ], formula: 'wavelength', lab: 'formula:wavelength' },
    { h: 'Three paths', body: [
      '**Ground wave** follows the curvature of the Earth, and is used by LF/MF and low HF; range is limited by absorption in the ground.',
      '**Sky wave** is refracted back from the **ionosphere**, allowing HF voice to cross oceans. The layers change: **D layer** absorbs HF by day and disappears at night; **F layer** is higher and refracts HF back. HF range is therefore better at night on lower frequencies and by day on higher ones.',
      '**Space (direct) wave** travels in a straight line and is used by VHF and above; range is set by the horizon and by obstructions.',
    ] },
    { h: 'Errors', body: [
      '**Night effect** on NDB bearings: sky-wave contamination, worst around dawn and dusk. **Coastal refraction**: bearings bend where a ground wave crosses a coastline at a shallow angle. **Mountain effect** and **thunderstorm interference** distort bearings. VHF signals suffer **multipath** from reflections off terrain.',
    ] },
    { h: 'Interference', body: [
      'Solar activity can disturb HF and satellite signals. Aircraft transmitters share channels, so co-channel and adjacent-channel interference limit usable range near other stations.',
    ], note: 'Band limits are quoted from memory of ICAO allocations and national rules differ in detail.' },
  ],
  examples: [
    { title: 'Wavelength', steps: ['A DME interrogation is on 1,100 MHz.', '300 ÷ 1,100.', 'Wavelength ≈ 0.27 m.'] },
    { title: 'HF choice', steps: ['By night over the North Atlantic, the D layer has disappeared.', 'Lower HF frequencies are refracted back from the F layer over long distances.', 'Use the lower frequency of the allocated pair.'] },
  ],
  practice: [
    num('Wavelength at 1,100 MHz (300 ÷ f in MHz)?', 0.273, 0.005, 'm', '300 ÷ 1,100 ≈ 0.273 m.'),
    mcq('Long-range voice communication across oceans typically uses:', ['HF', 'VHF', 'UHF', 'Microwave'], 'It is refracted by the ionosphere.'),
    mcq('The NDB operates in the:', ['LF/MF band', 'VHF band', 'UHF band', 'SHF band'], 'And uses ground waves.'),
    mcq('Night effect is an error of:', ['NDB/ADF bearings', 'ILS glide path', 'DME distance', 'Radio altimeter'], 'Sky waves contaminate the ground wave.'),
    tf('VHF signals are normally refracted back from the ionosphere over long distances.', false, 'They travel in straight lines and pass through.'),
  ],
  assessment: [
    num('Wavelength at 120 MHz (300 ÷ f in MHz)?', 2.5, 0.02, 'm', '300 ÷ 120 = 2.5 m.'),
    num('Wavelength at 1,000 MHz (300 ÷ f in MHz)?', 0.3, 0.005, 'm', '300 ÷ 1,000 = 0.3 m.'),
    mcq('The ILS glide path operates in the:', ['UHF band', 'LF band', 'HF band', 'VLF band'], 'The localiser is VHF.'),
    mcq('The VOR operates in the:', ['VHF band', 'LF band', 'HF band', 'UHF band'], '108 to 117.95 MHz.'),
    mcq('The ionospheric layer that absorbs HF by day and vanishes at night is the:', ['D layer', 'F layer', 'E layer only', 'Troposphere'], 'So HF range changes with time of day.'),
    mcq('Coastal refraction affects:', ['NDB bearings crossing a coast at a shallow angle', 'GNSS satellites', 'The radio altimeter', 'Weather radar'], 'The ground wave bends.'),
    tf('DME and GNSS operate in the UHF band.', true, 'Together with radar and TCAS.'),
  ],
  missionId: 'm-atpl-propagation', sources: ['icao-a10'],
});

export const ilsMlsGls = lesson('Radio navigation', {
  id: 'atpl-ils-mls-and-gls', title: 'ILS, MLS and GLS', minutes: 13, level: 3, prereqs: ['atpl-radio-wave-propagation'],
  objectives: ['Describe the components of an ILS.', 'Calculate glide path height from distance.', 'Describe ILS categories.', 'Describe MLS and GLS and their advantages.'],
  intro: 'Prerequisite review: the localiser gives lateral guidance, the glide path vertical guidance, and a Category I decision height is not lower than 200 ft. This lesson looks at how the beams are formed, how the categories differ, and the systems that are replacing them.',
  simple: 'An ILS sends two beams: a vertical one that defines the descent path and a horizontal one that lines you up with the runway. Lower and lower minima need more reliable beams and more capable aircraft. Newer systems use satellite or microwave signals to do the same job more flexibly.',
  sections: [
    { h: 'Components', body: [
      'The **localiser** transmits on 108 to 111.95 MHz from the far end of the runway; the **glide path** on 329 to 335 MHz, from beside the touchdown zone, nominally **3°**. **Marker beacons** or DME give distance.',
      'The beams are formed from two overlapping lobes modulated at 90 Hz and 150 Hz. The pilot sees which lobe is stronger; equal strength means on the centreline or glide path.',
    ] },
    { h: 'Glide path height', body: [
      'On a 3° glide path, `height = distance × tan(3°)`; in feet per nautical mile, 6,076 × 0.0524 ≈ **318 ft per NM**. At 5 NM from the threshold, the path is about 1,590 ft above the threshold elevation.',
    ], formula: 'gp-height', lab: 'formula:gp-height' },
    { h: 'Categories', body: [
      '**Category I**: decision height not lower than 200 ft, runway visual range not less than 550 m. **Category II**: decision height below 200 ft but not below 100 ft. **Category III**: decision height below 100 ft or none, with progressively lower visual range requirements.',
      'The lower the category, the more demands on the ground equipment, the aircraft systems, the crew qualification and the operator approval.',
    ] },
    { h: 'Errors and protection', body: [
      'Beams can be distorted by vehicles and aircraft on the runway. **Critical** and **sensitive areas** are protected, and low-visibility procedures are in force when Category II or III operations are being conducted.',
    ] },
    { h: 'MLS and GLS', body: [
      'The **microwave landing system** (MLS), in the SHF band, offers many selectable approach paths and curved approaches; it was never widely adopted. The **GBAS landing system** (GLS) uses satellite navigation with a local ground augmentation station to give ILS-like guidance, and supports multiple runways from one installation.',
    ], note: 'Category definitions and minima are quoted from memory of ICAO Annex 10 and Doc 9365 and were not checked against the current text.' },
  ],
  examples: [
    { title: 'Path height', steps: ['5 NM from the threshold on a 3° path.', '5 × 318.', 'About 1,590 ft above threshold elevation.'] },
    { title: 'Which category?', steps: ['Decision height is 150 ft.', 'It is below 200 ft but not below 100 ft.', 'This is a Category II approach.'] },
  ],
  practice: [
    num('Height on a 3° glide path at 5 NM from the threshold (318 ft per NM)?', 1590, 5, 'ft', '5 × 318 = 1,590 ft.'),
    mcq('The nominal glide path angle is:', ['3°', '1°', '6°', '10°'], 'Typically 3°.'),
    mcq('A Category II approach has a decision height:', ['Below 200 ft but not below 100 ft', 'Of 200 ft or above', 'Below 100 ft', 'Of zero'], 'Category III is lower still.'),
    mcq('GLS is based on:', ['Satellite navigation with a ground augmentation station', 'Microwave scanning beams', 'Radar', 'NDB signals'], 'The ground station gives corrections and integrity.'),
    tf('Vehicles on the runway cannot affect the ILS beams.', false, 'Critical and sensitive areas are protected for that reason.'),
  ],
  assessment: [
    num('Height on a 3° glide path at 10 NM from the threshold (318 ft per NM)?', 3180, 10, 'ft', '10 × 318 = 3,180 ft.'),
    num('Height on a 3° glide path at 3 NM from the threshold (318 ft per NM)?', 954, 5, 'ft', '3 × 318 = 954 ft.'),
    mcq('The localiser transmits in the:', ['VHF band', 'UHF band', 'HF band', 'LF band'], '108 to 111.95 MHz.'),
    mcq('The ILS beams are formed from lobes modulated at:', ['90 Hz and 150 Hz', '30 Hz and 60 Hz', '1,000 Hz and 2,000 Hz', '400 Hz only'], 'Equal strength means on the beam.'),
    mcq('A Category III approach has a decision height:', ['Below 100 ft, or none', 'Of 200 ft', 'Of 500 ft', 'Of 1,000 ft'], 'With very low visibility.'),
    mcq('An advantage of GLS over ILS is that:', ['One ground installation can serve several runways', 'It uses no satellites', 'It needs no aircraft equipment', 'It is cheaper to fly'], 'And it supports curved approaches.'),
    tf('The MLS was widely adopted worldwide as the replacement for the ILS.', false, 'It was never widely adopted; GBAS is the emerging successor.'),
  ],
  missionId: 'm-atpl-ils', sources: ['icao-a10'],
});

export const gnssPbn = lesson('Radio navigation', {
  id: 'atpl-gnss-and-pbn', title: 'GNSS and PBN', minutes: 13, level: 3, prereqs: ['atpl-ils-mls-and-gls', 'cpl-area-navigation-and-pbn'],
  objectives: ['Name the segments of a GNSS.', 'Describe ABAS, SBAS and GBAS.', 'Describe the sources of GNSS error.', 'Relate PBN specifications to required performance.'],
  intro: 'Prerequisite review: GNSS finds position from at least four satellites, RAIM checks integrity, and PBN specifies routes by required accuracy. A pilot should know what could go wrong with the signals, and what augmentation does about it.',
  simple: 'A satellite system has three parts: the satellites, the ground stations that control them, and the receivers in the aircraft. Several kinds of augmentation make the signal more accurate and trustworthy. Its errors come from the atmosphere, the satellites\' geometry and reflections.',
  sections: [
    { h: 'Segments', body: [
      'The **space segment** is the constellation, typically 24 or more satellites in medium Earth orbit at about 20,000 km, completing an orbit in about 12 hours. The **control segment** monitors and corrects them. The **user segment** is the receivers.',
      'Each satellite broadcasts its position and the time from an atomic clock. A receiver needs at least four to solve for position and its own clock error.',
    ] },
    { h: 'Augmentation', body: [
      '**ABAS** (aircraft-based): RAIM, or comparison with inertial data. **SBAS** (satellite-based): geostationary satellites broadcast corrections and integrity data over a region (EGNOS, WAAS). **GBAS** (ground-based): a local station near an aerodrome broadcasts corrections for precision approach.',
    ], lab: 'explore:gnss-aug' },
    { h: 'Errors', body: [
      'Main error sources: **ionospheric delay** (the largest, removed partly with two frequencies or SBAS), **tropospheric delay**, **satellite clock and orbit errors**, **multipath** from reflections, and **geometry**: satellites bunched together give a poor fix, expressed as a **dilution of precision** (DOP). Lower is better.',
      'Signals can also be lost through **interference and jamming**. Aircraft keep inertial or radio navigation as back-up.',
    ] },
    { h: 'PBN and performance', body: [
      'PBN specifications define accuracy, integrity, continuity and functionality. **RNP** specifications add on-board monitoring and alerting. Approaches may be flown to **LNAV**, **LNAV/VNAV** or **LPV** minima depending on equipment and augmentation.',
      'On the ground, the crew checks that the database is in date and that enough satellites with acceptable integrity are available for the route.',
    ], note: 'Orbit figures and approach types are quoted from memory. Capabilities depend on aircraft equipment and approval.' },
  ],
  examples: [
    { title: 'Orbit time', steps: ['GNSS satellites orbit at about 20,000 km.', 'Their orbital period is about 12 hours.', 'Each satellite passes over the same region about twice a day.'] },
    { title: 'Poor geometry', steps: ['All visible satellites are bunched in one part of the sky.', 'Dilution of precision is high.', 'The position is less accurate even though signals are strong.'] },
  ],
  practice: [
    mcq('Which are the three segments of a GNSS?', ['Space, control and user', 'Air, ground and sea', 'Navigation, radar and communication', 'Satellite, antenna and clock'], 'Constellation, control and receivers.'),
    mcq('SBAS broadcasts corrections from:', ['Geostationary satellites', 'Ground vehicles', 'Hand-held devices', 'Weather balloons'], 'EGNOS and WAAS are examples.'),
    mcq('The largest source of GNSS error is usually:', ['Ionospheric delay', 'Receiver colour', 'The aircraft speed', 'Cloud'], 'It is partly removed by dual-frequency receivers and SBAS.'),
    mcq('A high dilution of precision means:', ['Poor satellite geometry and a less accurate fix', 'A very accurate fix', 'No satellites', 'A failed receiver'], 'Lower is better.'),
    tf('GBAS uses a ground station near an aerodrome to broadcast corrections.', true, 'It supports precision approach.'),
  ],
  assessment: [
    mcq('RAIM is an example of:', ['Aircraft-based augmentation', 'Satellite-based augmentation', 'Ground-based augmentation', 'Radar'], 'It is aircraft-based augmentation, abbreviated ABAS.'),
    mcq('Approaches flown with satellite-augmented guidance similar to an ILS are flown to:', ['LPV minima', 'NDB minima', 'Circling minima only', 'No minima'], 'They need SBAS.'),
    mcq('The orbital period of a GNSS satellite is about:', ['12 hours', '90 minutes', '24 hours exactly', '1 week'], 'At about 20,000 km altitude.'),
    mcq('Multipath error is caused by:', ['Signals reflected from surfaces', 'Satellite clock errors only', 'A low battery', 'Weather radar'], 'The receiver sees a delayed copy.'),
    mcq('The control segment of a GNSS:', ['Monitors and corrects the satellites', 'Is carried in the aircraft', 'Provides cabin Wi-Fi', 'Is the receiver antenna'], 'Ground stations upload data.'),
    mcq('Before relying on GNSS for a route, the crew checks that:', ['The database is in date and satellite integrity is adequate', 'The cabin is pressurised', 'The wind is calm', 'The flaps are retracted'], 'Both are prerequisites.'),
    tf('RNP specifications require on-board monitoring and alerting.', true, 'RNAV specifications do not.'),
  ],
  missionId: 'm-atpl-gnsspbn', sources: ['faa-aim'],
});

export const radarTcas = lesson('Radio navigation', {
  id: 'atpl-radar-and-tcas', title: 'Radar and TCAS', minutes: 13, level: 3, prereqs: ['atpl-radio-wave-propagation', 'ppl-communication-fundamentals'],
  objectives: ['Calculate radar range from echo time.', 'Distinguish primary and secondary radar.', 'Describe weather radar and its limits.', 'Describe TCAS advisories and the response.'],
  intro: 'Prerequisite review: transponder codes identify aircraft, and 7700, 7600 and 7500 have special meanings. Behind the codes lie two kinds of radar, and an airborne system, TCAS, that watches other transponders and warns the crew of a collision course.',
  simple: 'Radar sends a pulse and times the echo. A transponder answers a question from the ground and tells the controller who and how high. TCAS does the same between aircraft: it asks nearby transponders and tells the crew to climb or descend if they are on a collision course.',
  sections: [
    { h: 'Primary radar', body: [
      '**Primary radar** transmits a pulse and detects the echo from a target. Range is from the time of the echo: `range = c × t ÷ 2`. Each microsecond of echo time is about 150 m, or 0.081 NM of range: an echo after 100 µs means about 8.1 NM.',
      'It needs no equipment on the target, but the echo is weak and carries no identity.',
    ], formula: 'radar-range', lab: 'formula:radar-range' },
    { h: 'Secondary radar', body: [
      '**Secondary surveillance radar** interrogates a **transponder**, which replies with a coded signal. **Mode A** gives the four-digit identity code; **Mode C** adds pressure altitude; **Mode S** adds a unique aircraft address and data. Replies are stronger and carry information.',
    ] },
    { h: 'Weather radar', body: [
      'Airborne weather radar detects precipitation. It does **not** reliably detect dry hail cloud, clear-air turbulence, or volcanic ash. Heavy rain behind a strong cell can be hidden by attenuation. The antenna is tilted so that the beam looks at the right altitude; the wrong tilt can miss the tops or show ground clutter.',
    ] },
    { h: 'TCAS', body: [
      '**TCAS II** interrogates nearby transponders and tracks the replies. A **traffic advisory** (TA) warns of traffic that may become a threat: "Traffic, traffic". A **resolution advisory** (RA) gives a vertical manoeuvre: "Climb", "Descend", or "Monitor vertical speed".',
      'Typical alerting times are about **40 seconds** to a TA and **25 seconds** to an RA, depending on altitude. When an RA is issued, the crew **follows it immediately**, even if it conflicts with an air traffic control instruction, and informs ATC.',
      'It only sees aircraft with working transponders and cannot resolve horizontal conflicts.',
    ], lab: 'explore:tcas' },
  ],
  examples: [
    { title: 'Radar range', steps: ['An echo returns after 200 microseconds.', '200 × 0.081.', 'Range ≈ 16.2 NM.'] },
    { title: 'Conflicting instructions', steps: ['TCAS commands "Climb" while ATC instructs a descent.', 'Follow the RA at once.', 'Tell ATC "TCAS climb" and return to the clearance when clear.'] },
  ],
  practice: [
    num('Echo time is 200 microseconds. Radar range in NM (0.081 NM per µs)?', 16.2, 0.2, 'NM', '200 × 0.081 = 16.2 NM.'),
    mcq('A Mode C reply adds:', ['Pressure altitude', 'The aircraft type', 'Weather', 'Fuel state'], 'Mode A gives the code; Mode S adds an address.'),
    mcq('A TCAS resolution advisory gives:', ['A vertical manoeuvre instruction', 'A heading change only', 'Only a visual display', 'A weather warning'], 'Such as "Climb" or "Descend".'),
    mcq('If a TCAS RA conflicts with an ATC instruction, the crew should:', ['Follow the RA', 'Follow ATC', 'Ignore both', 'Hold position'], 'And inform ATC.'),
    tf('Weather radar reliably detects clear-air turbulence.', false, 'It detects precipitation, not clear-air turbulence.'),
  ],
  assessment: [
    num('Echo time is 100 microseconds. Radar range in NM (0.081 NM per µs)?', 8.1, 0.1, 'NM', '100 × 0.081 = 8.1 NM.'),
    num('Echo time is 500 microseconds. Radar range in NM (0.081 NM per µs)?', 40.5, 0.5, 'NM', '500 × 0.081 = 40.5 NM.'),
    mcq('Secondary surveillance radar works by:', ['Interrogating a transponder, which replies', 'Detecting passive echoes', 'Measuring wind', 'Receiving ADS-B only'], 'The reply is coded.'),
    mcq('A TCAS traffic advisory says:', ['"Traffic, traffic"', '"Climb"', '"Descend"', '"Clear of conflict"'], 'It warns of a potential threat.'),
    mcq('TCAS can see only aircraft that:', ['Have working transponders', 'Are on the same frequency', 'Are within 1 NM', 'Are airliners'], 'It interrogates transponders.'),
    mcq('Weather radar can fail to show the true intensity behind a heavy cell because of:', ['Attenuation', 'Gravity', 'The tilt of the Earth', 'Mode S'], 'The beam is absorbed by the nearer rain.'),
    tf('Mode S provides a unique aircraft address.', true, 'It also allows data exchange.'),
  ],
  missionId: 'm-atpl-tcas', sources: ['faa-aim', 'icao-a10'],
});
