// Additional original practice questions for the Examination Center.
// None of these are official examination questions; all are labelled "Original practice question".
import type { Question } from '../types';
import { mcq, num, tagQuestions, tf } from './q';

export const PPL_BANK: Question[] = tagQuestions([
  mcq('Which cloud type is associated with thunderstorms?', ['Cumulonimbus', 'Cirrus', 'Stratus', 'Altocumulus'], 'Cumulonimbus clouds produce thunderstorms, with turbulence, hail, icing and lightning.'),
  mcq('Two aircraft are approaching head-on. Under the ICAO Rules of the Air, each should:', ['Alter heading to the right', 'Alter heading to the left', 'Climb', 'Maintain heading and speed'], 'When approaching head-on, both aircraft turn right.'),
  mcq('Two aircraft at about the same level are converging. Which one gives way?', ['The one that has the other on its right', 'The one that has the other on its left', 'The faster one', 'The higher one'], 'The aircraft that has the other on its right gives way.'),
  mcq('In a METAR, the cloud amount BKN means:', ['Broken: 5 to 7 oktas', 'Few: 1 to 2 oktas', 'Scattered: 3 to 4 oktas', 'Overcast: 8 oktas'], 'BKN = broken, 5–7 eighths of the sky covered.'),
  mcq('The dew point is the temperature at which:', ['Air becomes saturated if cooled at constant pressure', 'Water boils', 'Ice melts', 'Fog always clears'], 'Cooling air to its dew point brings it to saturation.'),
  mcq('Which transponder code indicates a general emergency?', ['7700', '7600', '7500', '7000'], '7700 = emergency, 7600 = radio failure, 7500 = unlawful interference.'),
  mcq('Magnetic variation is the angle between:', ['True north and magnetic north', 'Magnetic north and compass north', 'Heading and track', 'True north and the aircraft heading'], 'Variation separates true and magnetic north; deviation is the compass error.'),
  mcq('An early effect of hypoxia is:', ['Impaired judgement that the pilot may not notice', 'Severe pain in the joints', 'Improved night vision', 'A blocked ear'], 'Hypoxia is dangerous because it degrades judgement and self-awareness first.'),
  tf('Carburettor icing can occur at outside air temperatures well above freezing when humidity is high.', true, 'Fuel evaporation and the pressure drop in the carburettor cool the air strongly.'),
  mcq('Which transponder code indicates radio communication failure?', ['7600', '7700', '7500', '2000'], '7600 = loss of communications.'),
], 'bank-ppl-', 'PPL general');

export const CPL_BANK: Question[] = tagQuestions([
  mcq('Vx is the speed for:', ['Best angle of climb', 'Best rate of climb', 'Maximum cruise', 'Minimum control'], 'Vx gives the most height per distance; Vy gives the most height per time.'),
  mcq('Induced drag is greatest at:', ['Low airspeed and high angle of attack', 'High airspeed and low angle of attack', 'Maximum cruise speed', 'Zero lift'], 'Induced drag is a by-product of lift and rises as speed falls.'),
  mcq('For a constant indicated airspeed, as density altitude increases the true airspeed:', ['Increases', 'Decreases', 'Stays the same', 'Becomes equal to groundspeed'], 'Thinner air requires a higher true speed to produce the same dynamic pressure.'),
  mcq('A constant-speed propeller keeps RPM constant by:', ['Changing the blade angle', 'Changing the fuel mixture', 'Changing the number of blades', 'Braking the engine'], 'A governor adjusts blade pitch to hold the selected RPM.'),
  num('Using the 1-in-60 rule, you are 2 NM off track after flying 60 NM. Track error in degrees?', 2, 0.1, '°', 'Track error ≈ distance off × 60 ÷ distance flown = 2°.'),
  tf('Protecting final reserve fuel is a planning requirement, not an optional target.', true, 'A flight must be planned and conducted so that final reserve fuel remains on landing.'),
], 'bank-cpl-', 'CPL general');

export const ATPL_BANK: Question[] = tagQuestions([
  mcq('In the ISA, the tropopause is at approximately:', ['36,000 ft', '18,000 ft', '50,000 ft', '10,000 ft'], 'ISA tropopause: 11 km, about 36,089 ft.'),
  mcq('"Mach tuck" is:', ['A nose-down pitching tendency at high Mach number as the centre of pressure moves aft', 'A nose-up tendency at low speed', 'A rolling motion caused by sweepback', 'A type of engine surge'], 'Shock-wave formation moves the centre of pressure rearward and changes downwash on the tail.'),
  mcq('The main high-speed benefit of a swept wing is that it:', ['Raises the critical Mach number', 'Lowers the stall speed', 'Increases lift at low speed', 'Reduces induced drag at low speed'], 'Only the airflow component normal to the leading edge affects compressibility effects.'),
  mcq('In Threat and Error Management, a threat is:', ['An event beyond the crew\'s influence that increases operational complexity', 'A mistake made by the crew', 'An aircraft state outside limits', 'A checklist item'], 'Threats come from outside the crew; errors are crew actions or inactions.'),
  mcq('A jet stream is:', ['A narrow band of very strong wind, usually near the tropopause', 'The exhaust of a jet engine', 'A type of low-level windshear', 'A surface wind'], 'Jet streams are found near breaks in the tropopause.'),
  mcq('V1 is best described as:', ['The speed by which the decision to reject the take-off must have been made', 'The rotation speed', 'The take-off safety speed', 'The stall speed'], 'Below V1 the take-off can be rejected within the available distance; above it the take-off is continued.'),
  tf('At high altitude, the margin between low-speed buffet and high-speed buffet becomes narrower.', true, 'Stall speed in terms of Mach rises while the high-speed limit stays near the critical Mach number.'),
], 'bank-atpl-', 'ATPL general');
