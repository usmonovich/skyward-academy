# Skyward Academy

**Learn. Fly. Advance.** An aviation learning game: short lessons, interactive experiments, assessments, and a 2D flight mission unlocked by every passed lesson.

Skyward Academy is a training aid. It does not issue pilot licences, ratings or ICAO language endorsements.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 1043 unit tests
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
```

Requires Node 18 or newer. No database or backend is needed.

### Configuration

| Variable | Purpose |
|---|---|
| `VITE_APP_NAME` | Changes the application name everywhere |
| `VITE_TUTOR_ENDPOINT` | URL of the AI tutor proxy. Leave unset to use the built-in curriculum tutor |

### Optional AI tutor

Without configuration the tutor answers only from lesson, formula and glossary data and works offline. To add a generative tutor:

```bash
ANTHROPIC_API_KEY=your-key npm run tutor-proxy      # http://localhost:8787/tutor
VITE_TUTOR_ENDPOINT=http://localhost:8787/tutor npm run dev
```

The key stays on the server (`server/tutor-proxy.mjs`); it is never sent to the browser or written to source. The proxy is a paid service (Anthropic API usage). It accepts `TUTOR_PORT`, `TUTOR_ALLOWED_ORIGIN` and `TUTOR_MODEL`. For a public deployment, put it behind your own authentication.

## Deployment

`npm run build` produces a fully static site in `dist/` (about 170 kB of JavaScript gzipped). Upload it to any static host. Paths are relative and routing uses the URL hash, so no server rewrite rules are needed. A service worker (`public/sw.js`) caches the app for offline use in production builds.

For Android and iOS the same build can be wrapped with Capacitor or a similar web-view shell; touch controls are already implemented.

## Publish on GitHub Pages (free)

The app is a static site with hash-based routing and relative asset paths, so it runs on GitHub Pages without changes.

1. Create a repository on GitHub and push this folder to its `main` branch.
2. On a free GitHub plan the repository must be **public** for Pages to work.
3. In the repository: Settings > Pages > Build and deployment > Source: **GitHub Actions**.
4. Every push to `main` then runs `.github/workflows/deploy.yml`: type-check, unit tests, build, deploy. A failing check stops the deployment.
5. The site appears at `https://<your-user>.github.io/<repository>/`.

## Install as an app (PWA)

The site has a web app manifest, icons and a service worker. Instructions for iPhone, Android and desktop are shown in the app under Profile > Install on your device. An installed web app is not a store app: there is no App Store or Google Play listing.

Offline: after the first online visit the app shell and every file already loaded are cached, so lessons, flashcards, the Exam Center and missions open without a connection. Sign-in, cloud sync and browser speech recognition need a connection.

## Cloud accounts and sync (Supabase free tier)

Optional. Without it, progress stays on the device and can be moved with export and import.

1. Create a free project at supabase.com.
2. SQL Editor > New query: paste `supabase/schema.sql` and run it. It creates one table with row-level security so each user can reach only their own row.
3. Authentication > URL Configuration: set Site URL to your GitHub Pages address and add it to Redirect URLs.
4. Project Settings > API: copy the Project URL and the **anon public** key. Never use the service_role key in this app.
5. GitHub repository > Settings > Secrets and variables > Actions > Variables: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then re-run the deploy workflow. For local development put the same two values in `.env.local`.

What syncs: lessons, XP, achievements, missions and aircraft unlocks, flashcards, exam results, Aviation English progress, favourites and settings. Guest progress on a device is merged into the account at first sign-in. Earned values never decrease when two devices are merged.

Status: the merge logic is unit-tested. Registration, sign-in, password recovery and two-device sync have **not** been tested, because no Supabase project was available during development.

## Architecture

```
src/
  types.ts            shared domain types
  config.ts           app name, pass mark, tutor endpoint
  content/            curriculum as data: lessons, questions, formulas, glossary,
                      aircraft, missions, sources; validate.ts; index.ts = registry + local CMS layer
  engine/             assessment, srs (SM-2), gamification, personalize, tutor,
                      atc (dialogue evaluator), speech, audio
  store/progress.ts   profiles, progress, export/import (localStorage)
  game/               engine.ts (data-driven mission engine), art.ts, FlightGame.tsx
  components/         ui, Quiz, Labs (interactive experiments), Tutor
  pages/              Home, Academy, Lesson, Fly, English, Knowledge, Exams, Profile, Admin
server/tutor-proxy.mjs  optional AI tutor proxy
tests/                  Vitest unit tests
```

Design rules: pages never import lesson data directly (they go through `content/index.ts`, which merges admin edits); all scoring and progress logic lives in pure functions that are unit-tested; a flight mission is one data object, so missions are added without touching the engine.

### Adding content

- **Lesson:** add an object in `src/content/` (see `math.ts`), or use *Content Admin → Lessons → Create from template*. Using the id of an "In development" lesson fills in that placeholder.
- **Mission:** add an object to `src/content/missions.ts`, or edit one in *Content Admin → Missions*.
- **Glossary term:** `src/content/reference.ts` or *Content Admin → Glossary*.

Admin edits are stored in the browser and follow Draft → Technical Review → Approved → Published. Only Published lessons are visible to learners.

## What was tested

**Unit tests (874, all passing):** boosters (collection, activation, effects, expiry, cooldown, pause), ring kinds and ring-to-scoring correspondence, a scripted-autopilot flight of every mission (duration and winnability), flight analysis, challenge missions and their unlock rule, portrait layout zones, full-screen camera for every phone size and the empty-href link fix, 3D component text and model geometry, automatic backups, recovery from an unreadable save, restore and lesson search, mission browser filters and the score breakdown, grading of every question type, number parsing, SM-2 scheduling, ranks, mission scoring, the ATC evaluator, XP rules, profile migration, export/import, structural validity and cross-links of every lesson, formula values taught in lessons, the standard atmosphere model, level generation for every mission.

**In a real browser (Chromium), through the user interface:**

- Guest start and profile creation; dashboard; every page at desktop and phone width with no horizontal overflow.
- Pressure lesson end to end: experiment, tutor, practice, a failed assessment (mission stays locked), a passed one, mission, rewards, next lesson unlocked, progress saved.
- All 202 lesson assessments answered to 100% through the real controls (all five question types).
- All 204 missions flown to completion by a scripted autopilot using real keyboard events; collision failure; decisions answered right and wrong; assisted mode with landing help; touch drag steering and thrust buttons.
- Aviation English: all quiz exercises, phonetic alphabet, numbers (text alternative), listening (transcript alternative), and the ATC simulator with typed transmissions (wrong, "say again", and correct readbacks).
- Dictionary, flashcards with all four grades, formula calculator, aircraft pages, cockpit explorer, mistake queue and revision.
- Exam Center in examination and practice mode, bookmarking, unanswered-question warning, results by topic, history.
- Profile settings (text size, reduced motion, framework), second profile, switching, deleting data.
- Content Admin: unpublish and publish, validation errors, create a lesson and publish it, add a glossary term, reconfigure a mission, revision history, restore.
- Production build: every page renders.

Bugs found and fixed during this testing: "holding point" misread by the ATC normaliser; page wider than the window; the ATPL mission could not be finished on its fuel load; a second English quiz showed the previous result; a certificate was issued after a single lesson; placeholder lessons could not be filled in from the admin; mission briefing unreadable on a portrait phone.

**Not verified:**

- Flight at real-time frame rate. The test pane throttles animation, so missions were advanced frame by frame. Feel, difficulty and smoothness at 60 fps need a human play-test.
- Microphone input and spoken ATC, read-aloud narration, and all sound effects (no audio device in the test environment).
- Offline mode and installation: the manifest and icons load and the service worker passes a syntax check, but service workers cannot register in the test browser, so offline use and home-screen installation are untested.
- The AI tutor proxy against the live API. It starts and its input validation works; no real question was sent.
- Safari and Firefox. Speech recognition is available only in Chrome and Edge; the app falls back to typing elsewhere.
- Screen-reader behaviour beyond labels and roles in the markup.

## Content verification

On 12 Nov 2026 the US rules quoted in the PPL human-performance lessons were read against the Cornell LII copy of 14 CFR: §91.211 (supplemental oxygen: above 12,500 ft for more than 30 minutes, above 14,000 ft at all times, above 15,000 ft for every occupant) and §91.17 (8 hours, 0.04 alcohol concentration). The other figures in the PPL Phase A and Phase B lessons (ICAO Annex 1 ages and hours, transponder codes, FAA handbook load factors, time of useful consciousness, diving intervals) were written from memory and are not yet verified.

Also on 12 Nov 2026, for the final PPL batch: 14 CFR §§61.23, 61.57, 61.109, 91.125 and 91.151 (Cornell LII copy) for United States experience, medical validity, recent experience, light signals and VFR fuel reserves; the original text of Regulation (EU) No 1178/2011 for FCL.210.A (45 hours, 25 dual, 10 solo, 270 km cross-country), FCL.205.A (privileges), FCL.060 (three take-offs and landings in 90 days) and MED.A.045 (Class 2 validity); and the original text of Regulation (EU) No 923/2012 for Appendix 1 light signals and signal-area markings and Appendix 3 VFR cruising levels. Later amendments to the two EU regulations were not compared. Not verified in that batch: ICAO wake turbulence categories, UK CAA runway performance factors, radiotelephony phraseology and readback items, VOR and DME details, and RAIM satellite counts.

The first CPL batch (advanced navigation, aerodynamics and performance) was written from memory of standard references and is not verified. Figures to check there include ILS sensitivities and the Category I decision height, PBN specification definitions, the 0.76 and 1.32 speed factors, the V_MC conditions, screen heights, the 60% and 70% landing distance fractions, and the hydroplaning estimate.

For the final CPL batch, on 12 Nov 2026: 14 CFR §§61.123 (age 18), 61.129 (250 hours), 61.133 (privileges) and 61.23 (second-class medical, 12 months), and the original text of Regulation (EU) No 1178/2011 for FCL.300 (age 18), FCL.305 (CPL privileges) and MED.A.045 (Class 1 validity of 12 months, reduced to 6). Everything else in that batch is from memory and not verified, including the commercial fuel policy figures (which predate the 2022 European fuel-scheme rules), minimum fuel and MAYDAY FUEL wording, jet stream levels, icing temperature ranges, the 8,000 ft cabin altitude, the sterile cockpit boundary, and the statements about air operator certificates and minimum equipment lists.


The second ATPL batch (mass and balance, performance, flight planning, human performance and meteorology) was written from memory and is not verified. Figures to check there include the Class A take-off segment gradients and the 0.8% twin-engine margin, the V2 and V_R factors, the 60%, 70% and 15% landing distance factors, the 1,000 ft and 2,000 ft en-route clearances, the ICAO flight plan codes and timing rules, the times of useful consciousness, the sleep credit model, and the thresholds for tropical revolving storms.

For the final ATPL batch, on 14 Nov 2026, the Chicago Convention facts were checked against a published summary: signature on 7 December 1944, entry into force on 4 April 1947, Articles 1, 3 bis and 5, and the 19 Annexes with their subjects (including Annex 19, safety management, since 14 November 2013). Everything else in that batch is from memory and not verified: the Annex 2 right-of-way and communication failure procedures (including the 20-minute and 30-minute figures), the Annex 12 emergency phases and 30-minute trigger, the ETOPS and operator requirements, ILS categories and glide path details, GNSS and radar figures, TCAS alerting times, and the supplementary airline topics (TEM, CRM, multi-crew cooperation, airline operations and decision-making models).
The first ATPL batch (principles of flight, airframe and systems, instrumentation) was written from memory of standard references and is not verified. Figures to check there include the idealised sweep and Mach relations, the 1.3 g buffet margin, the 0.80 kg/L jet fuel density and the −47 °C and −40 °C freezing points, the total-to-static temperature formula, the 84.4-minute Schuler period, the 2 NM per hour inertial drift limit, the 28-day AIRAC cycle, and the definitions of fail-passive and fail-operational autoland.

On 11 November 2026 the figures in the six PPL meteorology and air-law lessons were checked against public official texts.

**Confirmed against the source text**

| Claim | Source read |
|---|---|
| Right-of-way rules (head-on, converging, category order, overtaking, landing) | Regulation (EU) No 923/2012, SERA.3210; 14 CFR §91.113 |
| Minimum heights: 1,000 ft above the highest obstacle within 600 m; 500 ft elsewhere | SERA.5005(f) |
| US minimum safe altitudes | 14 CFR §91.119 |
| VFR cruising levels by magnetic track, above 3,000 ft above the surface | SERA.5005(g) and Appendix 3; 14 CFR §91.159 |
| VMC minima: 8 km and 5 km; 1,500 m and 1,000 ft from cloud; low-level Class F and G case | SERA.5001 Table S5-1 |
| Airspace classes A to G: who may fly, who is separated, clearance and radio | SERA.6001 |
| Pilot-in-command responsibility; duty to avert collision | SERA.2010, SERA.3201 |
| Avoid severe thunderstorms by at least 20 miles; do not fly under a storm or its anvil; do not take off or land with a storm approaching | FAA Aeronautical Information Manual 7-1 |
| METAR groups, oktas, 9999, CAVOK, trend codes, true wind direction | UK Met Office METAR decode guide |
| Fog is visibility below 1,000 m | UK Met Office |

**Corrected as a result:** icing temperature bands (rime is about −15 to −20 °C, mixed −10 to −15 °C); the European minimum-height rule also requires 500 ft above the highest obstacle within 150 m; the wording of the US minimum-height rule; the thunderstorm distance is 20 miles, not 20 NM.

**Supported only by secondary sources:** icing temperature table (FAA AC 91-51A, seen as a search excerpt, not the document); mist upper limit of 5,000 m; cloud-base rule of 400 ft per °C; TEMPO lasting less than an hour; towering cumulus excluding CAVOK.

**Not checked:** the ICAO Annexes themselves (not freely available; the EU regulation that implements them was read instead, in its original 2012 text without later amendments); cloud height bands; thunderstorm life-cycle stages; fog types; every lesson outside this batch.

## Feature status

**Working:** dashboard with career map, six destinations, guest and local profiles with guest migration, 202 complete lessons with interactive demonstrations, assessments with an 80% pass mark, 204 flight missions, hangar with six aircraft and liveries, XP, ranks, 17 achievements, daily challenge, study plan, heatmap, glossary (54 terms), flashcards (SM-2), formula library (130 formulas with calculators), aircraft encyclopedia, cockpit explorer, revision centre, Exam Center, Aviation English with 17 exercises across all eight stages (nine quizzes, five listening exercises, alphabet and numbers trainers) and 12 ATC scenarios, curriculum tutor, content admin, settings and accessibility options, export, import and delete.

**Partial:**

- **Curriculum.** 202 lessons are complete: 30 mathematics, 36 physics, 55 PPL, 32 CPL and 49 ATPL (every published track is complete). No syllabus lessons remain marked "In development". Aviation English now has exercises at every stage, including Level 4, 5 and 6 preparation; the app gives training feedback only and does not assess an ICAO level.
- **Content review.** Every lesson was drafted with AI assistance and is labelled as pending expert review. No qualified instructor has checked it.
- **Sources.** Four entries in the source register were read and are marked verified (see Content verification). The rest were written from memory and are marked "Not yet verified".
- **Accounts.** Email accounts and cross-device sync are implemented with Supabase but untested end to end (see Cloud accounts and sync). Without configuration, profiles live in the browser.
- **Admin.** No access control. Lessons, glossary terms and missions can be edited; new subjects, modules, formulas and uploaded illustrations cannot.
- **ATC controller.** A rule-based dialogue engine, not a generative model. Radio-failure procedures are not covered.
- **Speaking feedback.** Based on the transcript only. Pronunciation is not assessed.
- **Ranks.** Rank thresholds were rescaled to the 202-lesson curriculum (top rank at 50,000 XP). XP values and saved progress are unchanged, so existing users may see a lower rank name for the same XP.

**Not built:** background music and ambient airport audio, recorded human voices, image identification and diagram-labelling question types, short written answers, drag-and-drop (matching and ordering use buttons and menus), server database, analytics service.

## Visual experience
- **Opening splash** (`src/components/Splash.tsx`): the app icon flies in from a distance with perspective and blur, settles with a soft shadow, a light sweep crosses it, then the name appears and the screen fades into the app (about 3.6 s on the first launch, 1.5 s afterwards, a still 0.9 s frame with reduced motion). Tap, Enter, Escape or Skip ends it early. Only transform and opacity are animated. The first-launch flag is `skyward.splash.seen` in localStorage; progress is never touched.
- **Screen transitions:** pages fade and rise in; starting a mission zooms in; the lesson-complete screen pops its badge and cards. "Reduce motion" in Profile and the system preference switch decorative animation off.
- **Mission complete** (`src/components/MissionComplete.tsx`): stars pop in one at a time with a ring and glow, the score and XP count up, confetti for three stars, score-breakdown bars, and a sticky action footer. Star rating is unchanged: at least 850 of 1000 is 3 stars, at least 600 is 2, any other completion is 1, and a failed mission shows the retry screen with no stars.

## Mobile UX and reliability (batch 1)
- **Compact dashboard header on phones:** 538 px to 298 px on a 375x812 screen (measured), so the stats and the lesson finder are visible without scrolling. Before and after: `docs/screenshots/home-mobile-before.jpg` and `home-mobile-after.jpg` (the before image is a fresh profile on the previous live version, the after image is a profile with progress).
- **Lesson finder:** a search box on the dashboard and the Academy page opens any of the published lessons from a word in its title, module or objectives, and shows whether each one is passed, open or locked.
- **Backups and recovery:** the app keeps the 3 newest automatic snapshots of the save in this browser (at most one every 30 minutes, plus one before an import or a restore). If the saved data cannot be read it keeps a copy of the damaged data, restores the newest backup, writes it back and shows a notice. Profile has a Backups and recovery panel with Back up now, Restore (which first backs up the current state) and the date of the last exported file. Deleting a profile's data also deletes the backups. Backups live in the same browser, so they do not replace exporting a file.

## 3D hangar (batch 2)
- **What it is:** on the Fly page each hangar aircraft has a "View in 3D" button. It opens an optional viewer with a procedural model of the aircraft (built from simple shapes, no model files or textures), touch and mouse rotation, pinch and wheel zoom, keyboard control (arrow keys, plus and minus when the view is focused), reset and slow-turn buttons, and a list of 11 components. Tap a part in the picture, or choose it from the list, to highlight it and read what it is and what it does in flight (wing, aileron, flap, stabiliser, elevator, fin, rudder, engine, landing gear, cockpit, fuselage).
- **Performance:** three.js is a separate chunk (about 517 kB, 134 kB gzipped) that is downloaded only when the viewer is opened (`React.lazy`). The main bundle does not contain it. The render loop pauses when the tab is hidden or the viewer is off screen, the pixel ratio is capped at 2, GPU resources are released when the viewer closes, and with "Reduce motion" there is no auto-rotation or propeller spin and frames are drawn only when the view changes. Where WebGL is unavailable the viewer says so and the component list still works.
- **Honesty about the models:** they are simplified game aircraft, not specific real types, and the viewer says so. Component descriptions are standard textbook explanations. Locked aircraft can be previewed. Offline: the viewer works offline only after it has been opened once online, because its chunk is cached on first use.
- Screenshots: `docs/screenshots/hangar-2d-before.jpg`, `hangar-3d-sparrow-after.jpg`, `hangar-3d-airliner-after.jpg`.

## Full-screen mobile game
- **Dedicated container:** on phones and tablets (any narrow, short or touch-first window) a mission opens in a full-viewport container rendered through a React portal directly under `<body>`, so no ancestor transform, overflow or stacking context can shrink it. It uses `position: fixed` with `100dvh`, and `viewport-fit=cover` plus `env(safe-area-inset-*)` keep the HUD, controls and result screen clear of notches and home indicators. While it is open the app behind it (header, navigation, tutor button) is hidden, `inert` and `aria-hidden`, the page cannot scroll, and leaving the mission restores everything. Wide desktop windows keep the original card layout.
- **Camera, not stretching:** the simulation still runs in its 960x540 world. The drawing uses a uniform scale (`computeView` in `src/game/engine.ts`): landscape phones fill the height and show more of the route ahead, portrait phones show 640 world pixels across and extend sky and ground above and below. Collisions, checkpoints and scoring read world coordinates only and were not changed. The HUD is drawn at a readable size and stacks in two blocks on narrow screens.
- **Controls:** large semi-transparent buttons at the screen edges (climb and descend on the left, thrust on the right), a game bar with pause, restart, full screen and exit, and drag-to-steer on the canvas. Buttons are at least 44 px, work with several fingers at once and release on cancel. A short fade-and-zoom transition leads into the game.
- **Orientation and full screen:** starting a mission (a user gesture) requests browser full screen and then landscape where the browser allows it (Android Chrome). Where it does not (iPhone Safari), the fixed full-viewport layout is the fallback and the briefing says the browser toolbar stays. Nothing is forced: portrait is fully playable and the briefing only suggests turning the phone. Leaving the mission unlocks the orientation.
- **Fixed on the way:** `Btn` treated `href=""` as "no link", so "Back to Dashboard" on the mission-complete screen (and the error and not-found cards) rendered as a button that did nothing. An empty href now means the home route.

## Portrait gameplay (Mobile Gameplay 2.0, batch 1)
- The portrait screen is now three purposeful zones instead of a small band in a sea of sky: a portrait HUD on top (one instrument panel with altitude, speed, time and gates, the speed tape, route progress and contact lights, then chips for fuel, wind, pressure), the play window in the middle, and the thumb controls at the bottom. Constants: `PORTRAIT_HUD` 138 px, `PORTRAIT_CTL` 196 px, `PORTRAIT_VW` 400 world pixels across.
- The play window shows the whole flyable height (ceiling to ground) at one uniform scale, so nothing is stretched. On a 375x812 phone the flyable height is about 1.6 times larger than before and about 49 percent of the screen height (it was about 31 percent); the camera shows 400 world pixels across instead of 640. The aircraft is drawn near the left edge so most of the width looks ahead.
- That shortens the look-ahead, so gates and hazards that are still off screen show as small markers on the right edge (orange ring for a gate, red triangle for a hazard, brighter when closer).
- The simulation is untouched: the world is only drawn shifted. The same scripted flight gives the same state (position, altitude, speed) in portrait and landscape.
- Honest limit: portrait shows about 300 world pixels ahead of the aircraft against roughly 740 or more in landscape, so portrait gives less warning. Landscape remains the best way to play.

## New mission types (Mobile Gameplay 2.0, batch 2)
Twelve challenge missions in `src/content/challenges.ts`. They have no lesson of their own: each opens when the lessons it requires are passed (`requires`), appears under the track of its first required lesson, and states the concept it practises on its card. Every scenario is a simplified teaching scenario, labelled as such in its briefing.

| Type | Missions | Concept practised |
|---|---|---|
| Crosswind landing | Crosswind Landing, Gusty Crosswind | Hold a correction into the wind and arrive on the centreline |
| Wind compensation | Hold the Track, Wind Correction Angle | The heading correction (wind correction angle) depends on wind and airspeed |
| Navigation checkpoints | Waypoint Route, Dogleg in the Wind | Cross named waypoints on track and at height |
| Fuel management | Fuel Reserve | Power burns fuel quickly; decide early about a shortfall and tell ATC |
| Weather avoidance | Storm Deviation | Avoid storm cells by a wide margin; the gap can move |
| Go-around | Go-Around, Go-Around in a Crosswind | Blocked runway: add power and climb away |
| Decision making | Alternate or Continue, Engine Trouble After Take-off | Decide early; aviate, navigate, communicate |

- **Simplified sideways-wind model (`lateral`):** the game is a side view, so the sideways position is shown on a track panel (corridor, runway width, route target, wind, heading correction). Wind pushes the aircraft sideways; a held heading correction (Q/E keys or the HDG buttons) pushes back; the faster the aircraft flies, the smaller the correction needed. The wind ramps in over the first six seconds. This is an educational approximation, not a flight model.
- **Scoring is unchanged.** New missions feed the existing formula only through existing fields: time on track becomes the objective fraction, a go-around counts as one decision, centreline touchdown adjusts the landing quality (smooth, firm, hard).
- **Tested by flying them:** all twelve were flown to completion with a scripted autopilot (correction held, waypoints followed, flare and landing, decisions answered). A no-input flight leaves the corridor and fails, so the challenge is real. The autopilot found that two missions needed seeds with a fairer final approach.

## Flight debrief (Mobile Gameplay 2.0, batch 3)
After every mission, successful or not, the result screen shows a flight analysis (`src/game/analysis.ts`, `src/components/FlightReport.tsx`) on top of the unchanged star rating, XP and score breakdown:
- **Flight path charts:** a height profile with every gate (teal when collected, dashed red when missed), the runway and your path; for sideways-wind missions also the track seen from above with the on-track corridor, waypoints and your track.
- **What went well, what to fix, next time:** every sentence comes from a measured value, not a template guess: gates (and for each missed gate whether it was too high or too low, or off the planned track, in feet), contacts, time against target, speed or track keeping, touchdown quality and centreline offset, go-around timing, fuel, and each wrong decision with the better choice. Up to four non-repeating tips. A failed flight gets the failure reason first and a suggestion to practise in Assisted mode.
- The flight path is recorded every quarter second during the flight and is used only for this screen; it is not saved.
- Fixed on the way: the result screen text was inheriting white from the dark game container and was nearly invisible.

## Longer rounds (Expansion, batch 2)
- **Measured, not assumed.** `tests/helpers/autopilot.ts` runs the real engine headlessly in Node and flies every mission with a scripted autopilot (this is scripted testing, not human playtesting). Before: the median clean flight was 39 s, the longest 66 s and 185 of 216 missions were under a minute. After: every mission lasts at least 133 s, the median is 150 s and the longest 252 s (active gameplay only: the engine does not count time spent on decision screens). A player who deliberately holds full thrust all the way can finish sooner.
- **How.** `src/content/extend.ts` lengthens each route to its tier's target (Beginner 140 s, Intermediate 150 s, Advanced 165 s, Expert 185 s at the default cruise speed) instead of slowing or freezing anything. Gate spacing is kept, so there are more rings (up to 20), hazards scale with the route, par time scales with the length, fuel scales with the route, and route missions get one phonetic-named waypoint per ring. Every round is staged: introduction (no hazards in the first 12 percent), main flight, challenge and final approach, with a short instructor note at each stage.
- **Fairness.** A contact light now comes back after 30 s of clean flying, so a long flight is not ended by early mistakes alone. The number of contacts used by the score is unchanged.
- **Winnability.** The autopilot wins 215 of 216 missions. The exception, `m-free-sunset`, is two birds 240 px apart at very different heights, which this autopilot cannot weave through; it is recorded in the test as a known limit.
- **Findings recorded for the scoring batch:** 71 of 216 missions can be completed with no input at all (1 to 2 stars), and 31 of the 81 decision missions still give 3 stars when every decision is wrong.

## Cloud rings (Expansion, batch 3)
- **Six ring kinds**, each with its own colour, outline pattern and glyph, so no kind is told apart by colour alone: cloud (blue, plain), golden (gold, star, +50), precision (orange, double ring and tick marks, smaller, +30), navigation (teal, dashed, chevron, +20, used on route missions), English challenge (purple, dotted, speech bubble; used by the English missions batch) and special (magenta, dash-dot, diamond, larger, +100, the last ring of Advanced and Expert flights).
- **Look:** soft cloud puffs around a coloured boundary with a soft glow and a dark outline for contrast on bright sky, white clouds, sunset and dark weather; gentle puff movement (off with reduced motion); the ring is drawn in two halves so the aircraft flies through it. Passing through gives an expanding ring, particles (fewer with reduced motion), a floating label ("3/20" or "+50"), a sound, and the ring swells and fades away. Rings still off screen show as coloured markers at the right edge (portrait and landscape).
- **The drawn opening is the scoring area.** The boundary is drawn at exactly the scoring radius. `tests/rings.test.ts` flies 30 missions with no input (constant height) and checks that every ring, of every kind, is hit exactly when the aircraft is inside that ring's own radius.
- Kinds come from a separate random stream, so adding them did not move any ring or hazard. Bonus points are shown and rewarded but never change the star formula.

## Boosters (Expansion, batch 4)
Boosters are **arcade power-ups, not real aircraft systems** (the bar, the briefing guide and every activation message say so). They are earned in flight: 2 to 8 coloured pickups are placed along each route (from their own random stream, clear of rings and hazards, at reachable heights), collected into a 3-slot bar, and used by tapping the slot or pressing 1 to 3. At most two are active at once; each has a duration and a cooldown (`BOOSTERS` in `src/game/engine.ts`); all timers run on real time that stops while paused.

| Booster | Effect | Limit |
|---|---|---|
| Shield | Absorbs the next minor contact (balloon, birds, tower) | Not storms, not the ground, not the runway; 15 s |
| Time slow | The game runs at 60 percent | 8 s |
| Score x2 | Doubles ring bonus points | Bonus only, never stars; 12 s |
| Ring magnet | Widens golden rings and pickups (drawn wider too) | Never helps compulsory rings; 12 s |
| Speed boost | 1.35 times faster over the ground | Steering is 25 percent less responsive; 6 s |
| Precision assist | Guide line and gentle steering nudge to the next ring | Cannot win a mission alone; 10 s |
| Bonus XP token | Collected instantly, small XP bonus at the end | |
| Recovery | Brings back one contact light | Refused when there is nothing to recover; never undoes a wrong decision |

`tests/boosters.test.ts` drives the engine headlessly and checks each effect, expiry, cooldown, the limits (3 held, 2 active), pause safety, that a wrong decision stays wrong with boosters running, and that ground contact still ends a flight with boosters active.

## Aviation English flights (Expansion, batch 5)

Every Aviation English exercise now unlocks its own radio flight (`e-<exercise>`, 17 in all). Pass the exercise (60 percent or more), then fly it from **Fly → Aviation English**.

- **Purple rings** are radio calls. When the aircraft reaches one (hit or miss) the flight pauses and a call appears. Answers are by tap; **Hear the call** and **Answer by voice** are optional and the flight never depends on the speech API.
- Questions are generated from the existing exercises: quiz questions, listening passages, a phonetic-alphabet generator, numbers by ear and ATC readbacks with distractors (changed number, opposite instruction, missing call sign, "Roger"). No new phraseology was invented. They are practice questions, not official examination questions, and the game gives no ICAO language proficiency rating.
- **Three things are reported separately**: language comprehension, phraseology and aircraft control.
- **A wrong safety-critical call (or a wrong operational decision in any mission) caps the flight at two stars.** This also fixed an earlier gap: 31 missions with decisions could give three stars after a wrong answer. Flights are always completable.
- Capped bonus XP: 5 per correct call (up to 40), 10 for improving a weak topic. Only the part above what was already paid is added on a replay. Three new achievements.

## Mathematics and Physics expansion (Expansion, batch 1)

Audit: 30 mathematics and 36 physics lessons before this batch, 40 and 47 now (223 live lessons across all tracks). **21 new lessons were added** (10 mathematics, 11 physics), each with objectives, prerequisites, an explanation, formulas with variables, units and limits, worked examples, an interactive experiment, five practice and at least five assessment questions with explanations, a caution or model limit, a source, and its own flight mission.

- **Mathematics:** direct and inverse proportion, circles and arcs, area and volume, sine and cosine rules, exponential (halving) change, the wind triangle, moments and the centre of gravity, time and UTC, accuracy and rounding, probability and risk.
- **Physics:** free fall, projectile motion, circular motion, buoyancy, hydraulics, humidity and dew point, lapse rates, the Doppler effect, electromagnetic induction, wing loading, the lift curve.
- **Experiments:** 23 new interactive formula labs (for example projectile range, buoyancy, centripetal force, wind-triangle groundspeed, lift coefficient against angle of attack). The simplified ones (lift curve, halving model, dew point rule of thumb) say so in their "Model limits" line.
- **Honest limits:** these lessons teach the physics and arithmetic. They are not authoritative operating procedures, and each says to use the flight manual, METAR or approved planner for real flight. The content is original material, not copied from any publication, and still needs expert review before use in formal training. Earlier lessons, progress and unlocks are unchanged.

## Environments and aircraft polish (Expansion, batch 6)

- **Five new environments:** overcast, rain, night, golden hour and arctic, used by real missions (the Aviation English radio flights and several maths and physics missions). Night adds stars, a smaller moon, runway lights and aircraft lights (blinking tail strobe, red beacon, landing beam); rain adds 70 light streaks over a grey sky; overcast and golden hour change the sky, light and clouds.
- **Visual only.** Weather never changes handling, scoring or the rings (a test flies the same mission in every environment and compares the results). Rings keep their colours, outlines and glyphs, and I checked them in the night and rain scenes in the browser.
- **Performance and comfort:** each effect is a few dozen canvas primitives and is cut back with reduced motion (no twinkling, 14 still rain marks, no contrails). A briefing line states what the scene is.
- **Aircraft:** turboprops, jets and airliners leave a short fading contrail (a night-time exhaust glow in the dark) while airborne. In the hangar, locked aircraft show a progress bar and the XP still needed. The 3D hangar is unchanged.
- **Not done:** new aircraft models, aircraft unlock animations and per-aircraft sound. Frame rate was not measured on a phone.

## Rewards, settings and the objective-to-mechanic table (Expansion, batch 7)

- **Flight summary on the results screen:** rings collected (and by kind), bonus points (shown but never part of the stars), flight time, boosters used, questions answered correctly, radio calls split into comprehension and phraseology, and newly unlocked aircraft and liveries. Notes explain that boosters never change the educational result and that a wrong safety-critical choice keeps a flight at two stars or fewer. Every line comes from measured flight data.
- **Steering sensitivity** (Profile → Settings, 60 to 160 percent, default 100) scales climb and descent input. At the default the flight is unchanged.
- **Picture quality:** Auto, High or Low. Low trims rain, stars and contrails; Auto switches to Low if about three quarters of a second of frames stay slow. This is a visual effect level only. It does not change handling or scoring.
- **Objective-to-mechanic table** (`src/game/objectives.ts`): one row per mechanic (speed band, wind, terrain, landing, decisions, radio calls and others) says what the player does and which learning objective it practises. It reads the mission data, so a new mission needs no extra wiring, and the briefing shows an "In the cockpit" line from it.
- **Not done:** frame rate was not measured on a real phone, so the Auto threshold is untested on hardware; saving or syncing these two settings to an account is not built (they live in local progress with the other settings).

## Gameplay quality and final polish

**Corrected counts (verified by `tests/counts.test.ts`)**
- Pathway entries: Mathematics 40, Physics 47, PPL 59, CPL 32, ATPL 49, a sum of **227**. There are **223 unique published lessons**: PPL Phase A re-uses four Pre-Flight Academy lessons (`math-units`, `math-dst`, `phys-pressure`, `phys-lift`), so they appear in two pathways but are one lesson each. There are no placeholder lessons, and every published lesson passes the content validator.
- Missions: **254** = 223 lesson missions + 12 challenges + 17 Aviation English flights + 2 free flights. The earlier analysis covered 216 because it ran before the 21 maths and physics missions and 17 English flights were added (216 + 38 = 254).

**Passive completion fixed**
- Before: 77 of 254 missions finished with zero input. **Now 0.** Reaching the finish is not enough: at least **65 percent of the rings** must be collected (**50 percent in assisted mode**), and the result says why a flight did not count.
- Ring heights are spread so no single constant height can collect more than about 45 percent of the rings; hazards no longer form clusters (at most two within 700 px). Tests fly every mission with no input, with no input in assisted mode, and holding five different fixed heights: none succeeds.
- Landing and storm-drift missions keep their designed ring layout where it matters (last five rings of a landing, drifting storms), protected by the ring threshold and the landing itself.
- `m-free-sunset` (the only mission the autopilot could not finish) was a cluster of five balloons around a high ring; the no-cluster rule repaired it. **All 254 missions are now won by the scripted autopilot**, each lasting at least two minutes of active play. This is a scripted autopilot, not a human playtest.

**Rewards**
- Three stars now need a score of at least 850, at least 90 percent of the rings and at most one contact. A wrong safety-critical decision still caps a flight at two stars. Boosters held and used with no flying still fail every sampled mission.
- Anti-farming: flights pay only first-time and improved ratings; bonus XP is capped and paid once; exam answers are capped at 90 XP per day and flashcard reviews at 40 XP per day; lesson and English XP are first-time only.

**Mobile**
- Checked at 375×667, 360×640, 390×844, 412×915, 430×932, 844×390 and 915×412 in the in-app browser's device emulation: no game control smaller than 40 px (the thumb buttons are 78×78 px), no overflow, canvas fills the screen. Dispatching touch pointer events on the climb and descend buttons moves the aircraft up and down.
- **Not physical devices.** This browser pane throttles animation frames (3.6 fps on an idle page), so frame rates measured here are not meaningful. CPU cost of one simulated and drawn frame was about 0.13 ms on this desktop. A new **Show frame rate in flights** setting (Profile) prints live FPS and the worst frame time, so real phones can be measured. Low quality (and Auto after slow frames) now also cuts the canvas resolution to about a third of the pixels.

**Aircraft**
- Per-aircraft visual details (winglets, fan faces, striped fins, lamps), smoother pitch easing, a card with the aircraft and its specs when a flight unlocks one, and an original synthesised engine sound with a different character for single, twin, turboprop, jet and airliner (no audio files; it follows the existing engine-sound setting).
- The unlock card is covered by a unit test of the unlock logic; I did not see it on screen.

## Premium UI redesign and immersive flight update

### Batch 1 — interface minimalism
- Pathway pages (Mathematics, Physics, PPL, CPL, ATPL, Aviation English) open with a compact header: label, title, `Progress: n / m lessons` and one bar. The framework, syllabus notes and the licence disclaimer moved into one **Curriculum & Sources** disclosure; nothing was deleted.
- Lesson cards are single compact rows: status icon (green check, orange play, muted lock), title, minutes and difficulty, best score and earned stars. Locked lessons say why when tapped and in their screen-reader label; one short line at the top explains the order.
- Lesson pages show the key idea and objectives first. Prerequisites, source references, formula validity and common mistakes open on request. Accuracy and safety notes inside lessons stay visible.
- English, Knowledge Hub, Exam Center, Profile and Fly lost their long helper paragraphs; privacy, scheduling and assessment explanations open on request.
- `useProgress` gained a server snapshot so pages can be rendered in tests; `tests/ui-minimal.test.tsx` checks the compact headers, the disclosure and the locked-row labels.
- Before and after screenshots (emulated phone viewport): `docs/screens/`.
