// Data for the "explorer" interactive: the learner selects an item and reads its key facts.
// Used for classification topics (clouds, airspace classes, right-of-way cases) where there is nothing to calculate.

export interface ExplorerItem { name: string; facts: [string, string][]; text: string }
export interface Explorer { id: string; title: string; note: string; items: ExplorerItem[] }

export const EXPLORERS: Explorer[] = [
  {
    id: 'clouds', title: 'Cloud types',
    note: 'Height bands are typical for temperate latitudes and vary with latitude and season. Real clouds often show mixed forms.',
    items: [
      { name: 'Cirrus (Ci)', facts: [['Level', 'High, above about 20,000 ft'], ['Made of', 'Ice crystals'], ['Weather', 'None reaches the ground']], text: 'Thin, white, wispy streaks. Thickening cirrus can be an early sign of an approaching warm front.' },
      { name: 'Altostratus (As)', facts: [['Level', 'Medium, about 6,500 to 20,000 ft'], ['Form', 'Layer (stratiform)'], ['Weather', 'Light, steady rain or snow possible']], text: 'A grey sheet through which the sun appears as if behind frosted glass. Can contain icing.' },
      { name: 'Altocumulus (Ac)', facts: [['Level', 'Medium, about 6,500 to 20,000 ft'], ['Form', 'Patches or rolls'], ['Weather', 'Usually none']], text: 'White or grey patches in rows or waves. Some turbulence may be present.' },
      { name: 'Stratus (St)', facts: [['Level', 'Low, below about 6,500 ft'], ['Form', 'Layer (stratiform)'], ['Weather', 'Drizzle; poor visibility']], text: 'A uniform grey layer with a low base, like fog lifted off the ground. A sign of stable air.' },
      { name: 'Stratocumulus (Sc)', facts: [['Level', 'Low, below about 6,500 ft'], ['Form', 'Lumpy layer'], ['Weather', 'Occasional light rain or drizzle']], text: 'Grey and white rolls or patches. Flight beneath is often bumpy.' },
      { name: 'Nimbostratus (Ns)', facts: [['Level', 'Thick layer from low to medium levels'], ['Form', 'Layer (stratiform)'], ['Weather', 'Continuous rain or snow']], text: 'A dark, thick layer that hides the sun and gives long periods of steady precipitation and low cloud bases.' },
      { name: 'Cumulus (Cu)', facts: [['Level', 'Low base, vertical growth'], ['Form', 'Heaped (cumuliform)'], ['Weather', 'Fair; showers when large']], text: 'Separate heaps with flat bases and cauliflower tops, formed by rising air. A sign of unstable air and turbulence below and inside the cloud.' },
      { name: 'Cumulonimbus (Cb)', facts: [['Level', 'Low base, top may reach the tropopause'], ['Form', 'Towering, often with an anvil'], ['Weather', 'Thunderstorms, heavy showers, hail']], text: 'The thunderstorm cloud. Severe turbulence, icing, hail, lightning and windshear. Avoid by a wide margin.' },
    ],
  },
  {
    id: 'fog', title: 'Types of fog',
    note: 'Fog types often occur together, and local terrain and wind strongly affect when fog forms and clears.',
    items: [
      { name: 'Radiation fog', facts: [['Forms when', 'Clear night, light wind, moist air over land'], ['Cause', 'The ground cools by radiation and chills the air above it'], ['Clears', 'After sunrise with heating, or when the wind increases']], text: 'Common in valleys and low-lying ground on autumn and winter mornings. Usually shallow.' },
      { name: 'Advection fog', facts: [['Forms when', 'Warm, moist air moves over a colder surface'], ['Cause', 'The air is cooled from below as it moves'], ['Clears', 'Only with a change of air mass or wind direction']], text: 'Sea fog is the typical example. It can form by day or night, in moderate winds, and may last for days.' },
      { name: 'Upslope fog', facts: [['Forms when', 'Moist air is pushed up rising ground'], ['Cause', 'The air expands and cools as it rises'], ['Clears', 'When the wind stops blowing up the slope']], text: 'Often covers high ground while lower areas remain clear, hiding the terrain.' },
      { name: 'Frontal (precipitation) fog', facts: [['Forms when', 'Rain falls into cooler air near the surface'], ['Cause', 'Evaporating rain saturates the cool air'], ['Clears', 'After the front has passed']], text: 'Associated mainly with warm fronts. It can cover a wide area along the front.' },
      { name: 'Steam fog', facts: [['Forms when', 'Very cold air moves over warmer water'], ['Cause', 'Water evaporates into the cold air and condenses'], ['Clears', 'When the air warms']], text: 'Looks like rising smoke over lakes and rivers. Usually shallow and patchy.' },
    ],
  },
  {
    id: 'icing', title: 'Types of airframe icing',
    note: 'Temperature ranges follow the table in FAA Advisory Circular 91-51A (clear 0 to −10 °C, mixed −10 to −15 °C, rime −15 to −20 °C). They are typical values and overlap in practice. Follow the limitations of the aircraft: many light aircraft are not approved for flight in icing conditions.',
    items: [
      { name: 'Clear (glaze) ice', facts: [['Droplets', 'Large supercooled drops'], ['Typical temperature', 'About 0 °C to −10 °C'], ['Found in', 'Cumuliform cloud and freezing rain']], text: 'Drops spread back before freezing, forming a smooth, heavy, transparent layer that is hard to see and hard to remove. The most dangerous form.' },
      { name: 'Rime ice', facts: [['Droplets', 'Small supercooled droplets'], ['Typical temperature', 'About −15 °C to −20 °C'], ['Found in', 'Stratiform cloud']], text: 'Droplets freeze instantly on impact, trapping air. The result is rough, white and brittle, building forward from leading edges.' },
      { name: 'Mixed ice', facts: [['Droplets', 'A range of sizes'], ['Typical temperature', 'About −10 °C to −15 °C'], ['Found in', 'Most icing clouds']], text: 'A combination of clear and rime ice, rough and irregular in shape.' },
      { name: 'Hoar frost', facts: [['Forms on', 'A cold aircraft surface in moist air'], ['Typical case', 'Parked overnight, or descending from cold air into warm moist air'], ['Appearance', 'Thin white crystalline coating']], text: 'Even a thin, rough layer disturbs the airflow and reduces lift. All frost must be removed before take-off.' },
      { name: 'Freezing rain', facts: [['Forms when', 'Rain falls from warmer air aloft into air below 0 °C'], ['Result', 'Rapid build-up of clear ice'], ['Typical location', 'Ahead of a warm front in winter']], text: 'Ice can build very quickly over the whole airframe. Leave the area immediately, normally by turning back or changing level toward warmer air.' },
    ],
  },
  {
    id: 'metar', title: 'Reading a METAR, group by group',
    note: 'Sample report with a fictional location indicator. This is the ICAO format; the United States reports visibility in statute miles and pressure in inches of mercury (for example A2992).',
    items: [
      { name: 'METAR EGZZ', facts: [['Meaning', 'Routine report for aerodrome EGZZ']], text: 'The report type, then the four-letter ICAO location indicator. SPECI marks a special report issued when conditions change significantly.' },
      { name: '121350Z', facts: [['Meaning', '12th day of the month, 13:50 UTC']], text: 'Two digits for the day, four for the time. Z means UTC ("Zulu" time).' },
      { name: '24012G22KT', facts: [['Meaning', 'Wind from 240° true at 12 kt, gusting 22 kt']], text: 'Three digits of direction (the direction the wind blows FROM, in degrees true), two of speed, then G and the gust speed if present. VRB means variable; 00000KT is calm.' },
      { name: '8000', facts: [['Meaning', 'Visibility 8,000 metres']], text: 'Four digits in metres. 9999 means 10 km or more; 0500 means 500 m.' },
      { name: '-SHRA', facts: [['Meaning', 'Light rain showers']], text: 'A minus sign is light, a plus sign is heavy, no sign is moderate. SH = showers, TS = thunderstorm, FZ = freezing. RA = rain, DZ = drizzle, SN = snow, FG = fog, BR = mist, HZ = haze.' },
      { name: 'FEW015 BKN030CB', facts: [['Meaning', '1–2 oktas at 1,500 ft; 5–7 oktas at 3,000 ft, cumulonimbus']], text: 'Amount, then base in hundreds of feet above the aerodrome. FEW = 1–2 oktas, SCT = 3–4, BKN = 5–7, OVC = 8. CB or TCU is added for cumulonimbus or towering cumulus.' },
      { name: '18/11', facts: [['Meaning', 'Temperature 18 °C, dew point 11 °C']], text: 'An M in front means minus: M02/M05 is −2 °C and −5 °C. A small difference between the two warns of fog or low cloud.' },
      { name: 'Q1009', facts: [['Meaning', 'QNH 1009 hPa']], text: 'The altimeter setting. Set it on the altimeter subscale to read altitude above mean sea level.' },
      { name: 'TEMPO 3000 TSRA', facts: [['Meaning', 'Temporarily 3,000 m in thunderstorm with rain']], text: 'A trend for the next two hours. NOSIG = no significant change, BECMG = becoming, TEMPO = temporary changes.' },
    ],
  },
  {
    id: 'rightofway', title: 'Right-of-way cases',
    note: 'Wording checked against the European rules of the air (SERA.3210), which implement ICAO Annex 2; the United States rule (14 CFR §91.113) is the same on these points. Other States can differ in detail. Having right of way never removes the duty to avoid a collision.',
    items: [
      { name: 'Approaching head-on', facts: [['Rule', 'Both aircraft alter heading to the right']], text: 'When two aircraft approach head-on, or nearly so, each turns right so that they pass with the other on their left.' },
      { name: 'Converging', facts: [['Rule', 'The aircraft that has the other on its right gives way']], text: 'Two aircraft of the same category at about the same level: if the other aircraft is on your right, you give way. The other maintains heading and speed.' },
      { name: 'Overtaking', facts: [['Rule', 'The overtaking aircraft keeps clear, altering heading to the right']], text: 'The aircraft being overtaken has right of way. The overtaking aircraft stays clear until it is entirely past.' },
      { name: 'Landing', facts: [['Rule', 'Aircraft landing or on final approach have right of way']], text: 'Of two aircraft approaching to land, the lower one has right of way, but it must not cut in front of another on final approach or overtake it. An aircraft in an emergency has priority.' },
      { name: 'Different categories', facts: [['Rule', 'The more manoeuvrable aircraft gives way']], text: 'Power-driven aeroplanes give way to airships, gliders and balloons. Airships give way to gliders and balloons. Gliders give way to balloons. Power-driven aircraft give way to aircraft towing others.' },
    ],
  },
  {
    id: 'airspace', title: 'ICAO airspace classes',
    note: 'This is the ICAO classification (Annex 11), checked against its European implementation (SERA.6001). Each State decides which classes it uses and may add its own requirements, such as radio or transponder mandatory zones; the United States, for example, does not use Class F. Always check the national rules and charts.',
    items: [
      { name: 'Class A', facts: [['Flights allowed', 'IFR only'], ['Separation', 'All aircraft separated by ATC'], ['Clearance', 'Required']], text: 'Controlled airspace closed to VFR flight.' },
      { name: 'Class B', facts: [['Flights allowed', 'IFR and VFR'], ['Separation', 'All aircraft separated by ATC'], ['VFR needs', 'Clearance and two-way radio']], text: 'Controlled airspace where ATC separates every aircraft from every other.' },
      { name: 'Class C', facts: [['Flights allowed', 'IFR and VFR'], ['Separation', 'IFR from IFR and from VFR; VFR from IFR'], ['VFR needs', 'Clearance and two-way radio']], text: 'VFR flights are separated from IFR flights and receive traffic information about other VFR flights.' },
      { name: 'Class D', facts: [['Flights allowed', 'IFR and VFR'], ['Separation', 'IFR from IFR only'], ['VFR needs', 'Clearance and two-way radio']], text: 'VFR flights receive traffic information about all other flights but are not separated by ATC. Typical around smaller controlled aerodromes.' },
      { name: 'Class E', facts: [['Flights allowed', 'IFR and VFR'], ['Separation', 'IFR from IFR only'], ['VFR needs', 'No clearance; radio not required']], text: 'Controlled airspace for IFR flights. VFR flights may enter without a clearance and get traffic information as far as practical.' },
      { name: 'Class F', facts: [['Flights allowed', 'IFR and VFR'], ['Service', 'Advisory service for IFR; flight information on request'], ['VFR needs', 'No clearance']], text: 'Advisory airspace. It is uncontrolled and used by few States.' },
      { name: 'Class G', facts: [['Flights allowed', 'IFR and VFR'], ['Service', 'Flight information service on request'], ['VFR needs', 'No clearance']], text: 'Uncontrolled airspace. Pilots are responsible for their own separation: see and avoid.' },
    ],
  },
  {
    id: 'licences', title: 'Pilot licences',
    note: 'Ages and hours are the ICAO Annex 1 minimums for aeroplanes. Each state sets its own requirements at or above these, and approved integrated courses may have different totals.',
    items: [
      { name: 'Student pilot', facts: [['May', 'Fly solo under an instructor\'s authorisation'], ['May not', 'Carry passengers'], ['Needs', 'A medical certificate before solo']], text: 'The starting point. Solo flights are authorised one by one by the instructor.' },
      { name: 'Private Pilot Licence (PPL)', facts: [['ICAO minimum age', '17'], ['ICAO minimum experience', '40 hours'], ['Privilege', 'Pilot in command, not for payment']], text: 'Allows you to fly yourself and passengers without being paid. Some states require more hours, for example 45 for the European PPL(A).' },
      { name: 'Commercial Pilot Licence (CPL)', facts: [['ICAO minimum age', '18'], ['ICAO minimum experience', '200 hours (150 on an approved course)'], ['Privilege', 'May be paid to fly']], text: 'The first professional licence. Additional ratings, such as the instrument rating, are usually added.' },
      { name: 'Airline Transport Pilot Licence (ATPL)', facts: [['ICAO minimum age', '21'], ['ICAO minimum experience', '1,500 hours'], ['Privilege', 'Command of multi-crew airliners']], text: 'The highest licence. Pilots often pass the ATPL theory early and fly as first officers until they have the required hours.' },
    ],
  },
  {
    id: 'aircraft-types', title: 'Describing an aeroplane',
    note: 'These are general categories. Many aircraft combine features, and individual types differ.',
    items: [
      { name: 'High-wing', facts: [['Wing', 'Above the cabin'], ['View', 'Good downward, restricted upward in turns'], ['Typical of', 'Many training aircraft']], text: 'The fuselage hangs beneath the wing. Easy to get in and out of, and the wing gives shade and shelter.' },
      { name: 'Low-wing', facts: [['Wing', 'Below the cabin'], ['View', 'Good upward, restricted downward'], ['Typical of', 'Many touring aircraft and airliners']], text: 'The wing is close to the ground, which gives a short, sturdy landing gear.' },
      { name: 'Piston engine', facts: [['Drives', 'A propeller'], ['Fuel', 'Usually aviation gasoline'], ['Used on', 'Most light aircraft']], text: 'Works like a car engine: pistons moving in cylinders turn a crankshaft.' },
      { name: 'Turboprop', facts: [['Drives', 'A propeller, through a gas turbine'], ['Fuel', 'Jet fuel'], ['Used on', 'Regional and utility aircraft']], text: 'Efficient at medium speeds and altitudes, and able to use shorter runways than most jets.' },
      { name: 'Jet (turbofan)', facts: [['Thrust from', 'A fan and a jet of exhaust gas'], ['Fuel', 'Jet fuel'], ['Used on', 'Airliners and business jets']], text: 'Most efficient at high altitude and high speed.' },
      { name: 'Tricycle gear', facts: [['Third wheel', 'Under the nose'], ['On the ground', 'Sits level, good forward view'], ['Handling', 'Stable when taxiing and landing']], text: 'The usual arrangement on modern training aircraft.' },
      { name: 'Tailwheel gear', facts: [['Third wheel', 'Under the tail'], ['On the ground', 'Sits nose-high'], ['Handling', 'Needs more skill on take-off and landing']], text: 'Common on older and bush aircraft. Suited to rough strips.' },
    ],
  },
  {
    id: 'components', title: 'Parts of an aeroplane',
    note: 'A general layout for a conventional light aeroplane. Details vary by type.',
    items: [
      { name: 'Fuselage', facts: [['Job', 'Carries crew, passengers and load'], ['Joins', 'Wings, tail, gear and engine']], text: 'The main body of the aircraft.' },
      { name: 'Wings', facts: [['Job', 'Produce lift'], ['Carry', 'Ailerons, flaps and usually the fuel tanks']], text: 'Their shape and area largely decide how the aircraft performs.' },
      { name: 'Ailerons', facts: [['Where', 'Outer trailing edge of each wing'], ['Control', 'Roll'], ['Worked by', 'Control column, left and right']], text: 'One goes up as the other goes down.' },
      { name: 'Flaps', facts: [['Where', 'Inner trailing edge of each wing'], ['Effect', 'More lift and more drag'], ['Used for', 'Take-off and landing']], text: 'Both move down together.' },
      { name: 'Horizontal stabiliser and elevator', facts: [['Where', 'Tail'], ['Control', 'Pitch'], ['Worked by', 'Control column, forward and back']], text: 'The fixed stabiliser gives pitch stability; the hinged elevator changes pitch.' },
      { name: 'Fin and rudder', facts: [['Where', 'Tail'], ['Control', 'Yaw'], ['Worked by', 'Rudder pedals']], text: 'The fixed fin gives directional stability; the hinged rudder yaws the nose.' },
      { name: 'Landing gear', facts: [['Job', 'Supports the aircraft on the ground'], ['Includes', 'Wheels, brakes and shock absorbers']], text: 'Fixed on most trainers; retractable on faster aircraft to reduce drag.' },
      { name: 'Powerplant', facts: [['Consists of', 'Engine and propeller'], ['Produces', 'Thrust']], text: 'On most light aircraft the engine also drives the alternator and other accessories.' },
    ],
  },
  {
    id: 'six-pack', title: 'The six basic flight instruments',
    note: 'The standard arrangement in two rows of three. Electronic displays present the same information in a similar layout.',
    items: [
      { name: 'Airspeed indicator', facts: [['Position', 'Top left'], ['Shows', 'Indicated airspeed'], ['Source', 'Pitot and static pressure']], text: 'Coloured arcs mark the safe speed ranges.' },
      { name: 'Attitude indicator', facts: [['Position', 'Top centre'], ['Shows', 'Pitch and bank'], ['Source', 'Gyroscope']], text: 'An artificial horizon: the central reference when the real horizon cannot be seen.' },
      { name: 'Altimeter', facts: [['Position', 'Top right'], ['Shows', 'Altitude'], ['Source', 'Static pressure']], text: 'Must be set to the correct pressure to read correctly.' },
      { name: 'Turn coordinator', facts: [['Position', 'Bottom left'], ['Shows', 'Rate of turn and balance'], ['Source', 'Gyroscope, with a balance ball']], text: 'The ball shows whether the turn is balanced.' },
      { name: 'Heading indicator', facts: [['Position', 'Bottom centre'], ['Shows', 'Heading'], ['Source', 'Gyroscope']], text: 'Steadier than the compass, but must be aligned with it regularly.' },
      { name: 'Vertical speed indicator', facts: [['Position', 'Bottom right'], ['Shows', 'Rate of climb or descent'], ['Source', 'Static pressure']], text: 'Reads in feet per minute, with a short lag.' },
    ],
  },
  {
    id: 'imsafe', title: 'The IMSAFE check',
    note: 'A personal fitness check from FAA guidance. Legal limits on alcohol, medication and rest are set separately by regulation.',
    items: [
      { name: 'I — Illness', facts: [['Ask', 'Do I have any symptoms?'], ['Risk', 'Reduced attention; blocked ears and sinuses']], text: 'Even a cold can be painful and distracting with changes of pressure.' },
      { name: 'M — Medication', facts: [['Ask', 'Have I taken any medicine?'], ['Risk', 'Drowsiness and impaired judgement']], text: 'Includes medicines bought without a prescription. Ask an aviation medical examiner if unsure.' },
      { name: 'S — Stress', facts: [['Ask', 'Am I under pressure from work, money or family?'], ['Risk', 'Distraction and poor decisions']], text: 'Stress narrows attention at the moment it is most needed.' },
      { name: 'A — Alcohol', facts: [['Ask', 'Have I been drinking recently?'], ['Risk', 'Impaired coordination and judgement']], text: 'Effects last longer than many people expect. Regulations set minimum times and limits.' },
      { name: 'F — Fatigue', facts: [['Ask', 'Am I properly rested?'], ['Risk', 'Slow reactions and missed items']], text: 'Fatigue is hard to notice in yourself.' },
      { name: 'E — Emotion', facts: [['Ask', 'Am I upset or angry?'], ['Risk', 'Attention is elsewhere']], text: 'A strong emotional event is a reason to stay on the ground.' },
    ],
  },
  {
    id: 'stability', title: 'Kinds of stability',
    note: 'Simplified descriptions of the initial tendency after a disturbance.',
    items: [
      { name: 'Positive static stability', facts: [['After a disturbance', 'Tends to return'], ['Like', 'A ball in a bowl']], text: 'The design aim for training aircraft.' },
      { name: 'Neutral static stability', facts: [['After a disturbance', 'Stays where it is put'], ['Like', 'A ball on a flat table']], text: 'The aircraft neither returns nor diverges.' },
      { name: 'Negative static stability', facts: [['After a disturbance', 'Moves further away'], ['Like', 'A ball on a dome']], text: 'Needs constant correction and can become uncontrollable.' },
      { name: 'Longitudinal (pitch)', facts: [['Provided by', 'The tailplane'], ['Reduced by', 'An aft centre of gravity']], text: 'The most important for safe loading.' },
      { name: 'Lateral (roll)', facts: [['Provided by', 'Wing dihedral'], ['Also helped by', 'A high wing position']], text: 'Tends to bring the wings back to level.' },
      { name: 'Directional (yaw)', facts: [['Provided by', 'The vertical fin'], ['Works like', 'A weathervane']], text: 'Keeps the nose pointing into the airflow.' },
    ],
  },
  {
    id: 'asi-arcs', title: 'Airspeed indicator markings',
    note: 'The speeds themselves are specific to each aircraft type and are given in its flight manual.',
    items: [
      { name: 'White arc', facts: [['Meaning', 'Flap operating range'], ['Lower end', 'Stall speed in landing configuration'], ['Upper end', 'Maximum speed with flaps extended']], text: 'Approaches and landings are flown in this range.' },
      { name: 'Green arc', facts: [['Meaning', 'Normal operating range'], ['Lower end', 'Stall speed with flaps up'], ['Upper end', 'Maximum structural cruising speed']], text: 'Most flying is done here.' },
      { name: 'Yellow arc', facts: [['Meaning', 'Caution range'], ['Use', 'Smooth air only']], text: 'Turbulence at these speeds could overstress the aircraft.' },
      { name: 'Red line', facts: [['Meaning', 'Never-exceed speed'], ['Use', 'Must not be exceeded']], text: 'Beyond it, structural damage or failure may occur.' },
    ],
  },
  {
    id: 'radio-words', title: 'Standard radio words',
    note: 'Common core phraseology based on ICAO radiotelephony guidance. States publish their own variations.',
    items: [
      { name: 'Affirm', facts: [['Means', 'Yes']], text: 'Used instead of "yes", which can be lost in noise.' },
      { name: 'Negative', facts: [['Means', 'No, or permission not granted']], text: 'Clear and hard to mishear.' },
      { name: 'Roger', facts: [['Means', 'I have received all of your last transmission'], ['Does not mean', 'Yes, or I will comply']], text: 'Never use it in place of a readback.' },
      { name: 'Wilco', facts: [['Means', 'I understand your message and will comply']], text: 'Short for "will comply".' },
      { name: 'Say again', facts: [['Means', 'Repeat all, or part, of your last transmission']], text: 'Use it whenever you are in doubt.' },
      { name: 'Standby', facts: [['Means', 'Wait and I will call you']], text: 'No reply is expected until you are called.' },
      { name: 'Unable', facts: [['Means', 'I cannot comply with your request or instruction']], text: 'Normally followed by a reason.' },
      { name: 'Mayday / Pan-Pan', facts: [['Mayday', 'Distress: grave and imminent danger'], ['Pan-Pan', 'Urgency: a serious situation, not yet distress']], text: 'Spoken three times at the start of the call.' },
    ],
  },
];

export const explorerById = (id: string) => EXPLORERS.find((e) => e.id === id);
