// Central product configuration. The application name is configurable via VITE_APP_NAME.
const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};

export const APP = {
  name: env.VITE_APP_NAME || 'Skyward Academy',
  tagline: 'Learn. Fly. Advance.',
  /** Default pass mark for lesson assessments (0..1). */
  passMark: 0.8,
  /** Optional URL of the AI tutor proxy (see server/tutor-proxy.mjs). Empty = built-in curriculum tutor only. */
  tutorEndpoint: env.VITE_TUTOR_ENDPOINT || '',
  disclaimer:
    'Skyward Academy is a training aid. It does not issue pilot licences, ratings or ICAO language endorsements. ' +
    'Real licensing requires approved training, official examinations, flight experience and medical certification from your aviation authority.',
};
