# Skyward Academy

**Learn. Fly. Advance.** An aviation learning game: short lessons, interactive experiments, assessments, and a 2D flight mission unlocked by every passed lesson.

Skyward Academy is a training aid. It does not issue pilot licences, ratings or ICAO language endorsements.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 219 unit tests
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

**Unit tests (219, all passing):** grading of every question type, number parsing, SM-2 scheduling, ranks, mission scoring, the ATC evaluator, XP rules, profile migration, export/import, structural validity and cross-links of every lesson, formula values taught in lessons, the standard atmosphere model, level generation for every mission.

**In a real browser (Chromium), through the user interface:**

- Guest start and profile creation; dashboard; every page at desktop and phone width with no horizontal overflow.
- Pressure lesson end to end: experiment, tutor, practice, a failed assessment (mission stays locked), a passed one, mission, rewards, next lesson unlocked, progress saved.
- All 91 lesson assessments answered to 100% through the real controls (all five question types).
- All 93 missions flown to completion by a scripted autopilot using real keyboard events; collision failure; decisions answered right and wrong; assisted mode with landing help; touch drag steering and thrust buttons.
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

**Working:** dashboard with career map, six destinations, guest and local profiles with guest migration, 91 complete lessons with interactive demonstrations, assessments with an 80% pass mark, 93 flight missions, hangar with six aircraft and liveries, XP, ranks, 17 achievements, daily challenge, study plan, heatmap, glossary (54 terms), flashcards (SM-2), formula library (77 formulas with calculators), aircraft encyclopedia, cockpit explorer, revision centre, Exam Center, Aviation English with seven exercises and seven ATC scenarios, curriculum tutor, content admin, settings and accessibility options, export, import and delete.

**Partial:**

- **Curriculum.** 91 lessons are complete: 30 mathematics and 36 physics (both Pre-Flight Academy tracks are complete), 23 PPL (all of Phase A), 1 CPL, 1 ATPL. The other 111 syllabus lessons are titles marked "In development". English stages 2, 3, 6, 7 and 8 have topics but no exercises.
- **Content review.** Every lesson was drafted with AI assistance and is labelled as pending expert review. No qualified instructor has checked it.
- **Sources.** Four entries in the source register were read and are marked verified (see Content verification). The rest were written from memory and are marked "Not yet verified".
- **Accounts.** Email accounts and cross-device sync are implemented with Supabase but untested end to end (see Cloud accounts and sync). Without configuration, profiles live in the browser.
- **Admin.** No access control. Lessons, glossary terms and missions can be edited; new subjects, modules, formulas and uploaded illustrations cannot.
- **ATC controller.** A rule-based dialogue engine, not a generative model. Radio-failure procedures are not covered.
- **Speaking feedback.** Based on the transcript only. Pronunciation is not assessed.
- **Ranks.** The top rank is reachable well before finishing the current 91 lessons; thresholds need rescaling as lessons are added.

**Not built:** background music and ambient airport audio, recorded human voices, image identification and diagram-labelling question types, short written answers, drag-and-drop (matching and ordering use buttons and menus), server database, analytics service.
