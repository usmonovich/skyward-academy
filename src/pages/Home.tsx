import { useProgress } from '../store/progress';
import { ACHIEVEMENTS, dailyFor, dayKey, rankFor, stageFor, streak } from '../engine/gamification';
import { studyPlan, topicStats, weeklyPlan } from '../engine/personalize';
import { EN_EXERCISES, FACTS, GAME_AIRCRAFT, LIVERIES, SOURCES, getTrack, liveLessons, recommendedLesson, trackProgress } from '../content';
import { AircraftArt, Bar, Btn, Chip, Icon } from '../components/ui';

export function Home() {
  const p = useProgress();
  const rank = rankFor(p.xp);
  const live = liveLessons();
  const passed = live.filter((l) => p.lessons[l.id]?.passed).length;
  const overall = live.length ? passed / live.length : 0;
  const next = recommendedLesson(p);
  const today = dayKey();
  const daily = dailyFor(today);
  const dailyCount = Math.min(daily.target, p.daily.date === today ? p.daily.counts[daily.key] ?? 0 : 0);
  const dailyDone = p.daily.date === today && p.daily.claimed;
  const fact = FACTS[Math.floor(Date.now() / 86_400_000) % FACTS.length];
  const factSrc = SOURCES.find((s) => s.id === fact.source);
  const ac = GAME_AIRCRAFT.find((a) => a.id === p.selectedAircraft) ?? GAME_AIRCRAFT[0];
  const livery = LIVERIES.find((l) => l.id === p.livery)?.color ?? LIVERIES[0].color;
  const badges = Object.keys(p.achievements).length;
  const math = trackProgress(getTrack('math')!, p); const phys = trackProgress(getTrack('physics')!, p);
  const pre = { done: math.done + phys.done, total: math.total + phys.total };
  const stages = [
    { id: 'academy', name: 'Pre-Flight Academy', sub: 'Mathematics and Physics', pct: pre.total ? pre.done / pre.total : 0, color: '#3a8dde', x: 70, y: 150 },
    { id: 'track/ppl', name: 'PPL', sub: 'Private Pilot', pct: trackProgress(getTrack('ppl')!, p).pct, color: '#f58220', x: 290, y: 95 },
    { id: 'track/cpl', name: 'CPL', sub: 'Commercial Pilot', pct: trackProgress(getTrack('cpl')!, p).pct, color: '#7a5af5', x: 510, y: 135 },
    { id: 'track/atpl', name: 'ATPL', sub: 'Airline Transport', pct: trackProgress(getTrack('atpl')!, p).pct, color: '#0b2545', x: 730, y: 65 },
  ];
  const enDone = EN_EXERCISES.filter((e) => p.english[e.id]?.done).length;
  const plan = studyPlan(p);
  const topics = topicStats(p).filter((t) => t.total >= 2);

  return (
    <div className="stack">
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">{stageFor(p)} · {rank.name}</p>
          <h1>Welcome Back, {p.name}!</h1>
          <p className="hero-sub">{next ? `Next up: ${next.title}. About ${next.minutes} minutes.` : 'You have passed every published lesson. Keep sharp with exams and flashcards.'}</p>
          <div className="row gap wrap">
            <Btn kind="accent" href={next ? `lesson/${next.id}` : 'exams'} icon="play">Continue Learning</Btn>
            <Btn kind="soft" href="fly" icon="fly">Fly a mission</Btn>
          </div>
          <div className="hero-rank">
            <div className="row between small"><span>{rank.next ? `${rank.toNext} XP to ${rank.next}` : 'Highest rank reached'}</span><span>{p.xp} XP</span></div>
            <Bar value={rank.pct} color="#f58220" label="Progress to next rank" />
          </div>
        </div>
        <a className="hero-aircraft" href="#/fly" aria-label={`Current aircraft: ${ac.name}. Open the hangar.`}>
          <AircraftArt ac={ac} color={livery} width={230} />
          <span>{ac.name}</span><span className="small">{ac.cls}</span>
        </a>
      </section>

      <section className="stats" aria-label="Your statistics">
        <div className="stat"><Icon name="academy" /><div><strong>{Math.round(overall * 100)}%</strong><span>Overall progress</span></div></div>
        <div className="stat"><Icon name="flame" /><div><strong>{streak(p)} day{streak(p) === 1 ? '' : 's'}</strong><span>Learning streak</span></div></div>
        <div className="stat"><Icon name="bolt" /><div><strong>{p.xp}</strong><span>Experience points</span></div></div>
        <div className="stat"><Icon name="trophy" /><div><strong>{badges} / {ACHIEVEMENTS.length}</strong><span>Badges earned</span></div></div>
      </section>

      <section className="card">
        <div className="card-head"><h2>Your career map</h2><span className="small muted">Select a destination to open it</span></div>
        <div className="map-wrap">
          <svg viewBox="0 0 800 220" className="career-map" role="group" aria-label="Career progression map">
            <defs><linearGradient id="mapsky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#dff0ff" /><stop offset="1" stopColor="#f6fbff" /></linearGradient></defs>
            <rect width="800" height="220" rx="18" fill="url(#mapsky)" />
            {[[120, 40], [420, 30], [640, 180], [250, 190]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="46" ry="12" fill="#fff" opacity="0.9" />)}
            <path d="M70 150 C 160 60, 220 80, 290 95 S 440 170, 510 135 S 660 40, 730 65" fill="none" stroke="#9fc3ea" strokeWidth="5" strokeDasharray="2 12" strokeLinecap="round" />
            {stages.map((s, i) => (
              <a key={s.id} href={`#/${s.id}`} aria-label={`${s.name}: ${Math.round(s.pct * 100)} percent complete`}>
                <circle cx={s.x} cy={s.y} r="30" fill="#fff" stroke="#dfe6ee" strokeWidth="6" />
                <circle cx={s.x} cy={s.y} r="30" fill="none" stroke={s.color} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${s.pct * 188.5} 188.5`} transform={`rotate(-90 ${s.x} ${s.y})`} />
                <text x={s.x} y={s.y + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill={s.color}>{Math.round(s.pct * 100)}%</text>
                <text x={s.x} y={s.y + 52} textAnchor="middle" fontSize="14" fontWeight="800" fill="#0b2545">{s.name}</text>
                <text x={s.x} y={s.y + 68} textAnchor="middle" fontSize="11" fill="#5b6b7f">{s.sub}</text>
                <text x={s.x} y={s.y - 40} textAnchor="middle" fontSize="10" fontWeight="700" fill="#5b6b7f">STAGE {i + 1}</text>
              </a>
            ))}
          </svg>
        </div>
        <a className="english-track" href="#/english">
          <Icon name="english" /><div className="grow"><div className="row between"><strong>ICAO Aviation English — parallel track</strong><span className="small">{enDone} of {EN_EXERCISES.length} exercises</span></div><Bar value={enDone / EN_EXERCISES.length} color="#12a594" label="Aviation English progress" /></div>
        </a>
      </section>

      <div className="grid-2">
        <section className="card">
          <div className="card-head"><h2>Daily challenge</h2>{dailyDone ? <Chip tone="ok">Completed</Chip> : <Chip tone="accent">+40 XP</Chip>}</div>
          <p>{daily.text}</p>
          <Bar value={dailyDone ? 1 : dailyCount / daily.target} color="#12a594" label="Daily challenge progress" />
          <div className="row between"><span className="small muted">{dailyDone ? 'Come back tomorrow for a new one.' : `${dailyCount} of ${daily.target} — optional, no penalty for skipping`}</span>{!dailyDone && <Btn small kind="soft" href={daily.link}>Start</Btn>}</div>
        </section>
        <section className="card">
          <div className="card-head"><h2>Daily aviation fact</h2><Icon name="book" /></div>
          <p>{fact.text}</p>
          <p className="small muted">Source: {factSrc ? `${factSrc.title} (${factSrc.org}, ${factSrc.ref})` : fact.source}</p>
        </section>
      </div>

      <div className="grid-2">
        <section className="card">
          <div className="card-head"><h2>Today's study plan</h2><span className="small muted">{p.settings.dailyMinutes} min goal</span></div>
          <ul className="plan">
            {plan.map((i) => <li key={i.text}><a href={`#/${i.link}`}><span className="plan-min">{i.minutes} min</span><span>{i.text}</span><Icon name="arrow" size={16} /></a></li>)}
          </ul>
          <p className="small muted">{weeklyPlan(p)}</p>
        </section>
        <section className="card">
          <div className="card-head"><h2>Learning heatmap</h2><span className="small muted">Accuracy by topic</span></div>
          {topics.length === 0 ? <p className="muted">Answer a few practice questions and your strongest and weakest topics will appear here.</p> : (
            <div className="heat">
              {topics.map((t) => <div key={t.topic} className="heat-cell" style={{ background: `hsl(${Math.round(t.pct * 150)}, 62%, ${88 - t.pct * 10}%)` }} title={`${t.correct} of ${t.total} correct`}><strong>{Math.round(t.pct * 100)}%</strong><span>{t.topic}</span></div>)}
            </div>
          )}
        </section>
      </div>

      <section className="card">
        <div className="card-head"><h2>Virtual hangar</h2><Btn small kind="ghost" href="fly">Open hangar</Btn></div>
        <div className="hangar-strip">
          {GAME_AIRCRAFT.map((a) => {
            const locked = p.xp < a.unlockXp;
            return <div key={a.id} className={`hangar-item${a.id === p.selectedAircraft ? ' on' : ''}`}><AircraftArt ac={a} color={livery} width={130} locked={locked} /><strong>{a.name}</strong><span className="small muted">{locked ? `Unlocks at ${a.unlockXp} XP` : a.cls}</span></div>;
          })}
        </div>
      </section>
    </div>
  );
}
