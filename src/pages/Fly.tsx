import { useMemo, useState } from 'react';
import { actions, useProgress } from '../store/progress';
import { GAME_AIRCRAFT, LIVERIES, allMissions, findLesson, getMission } from '../content';
import { FlightGame } from '../game/FlightGame';
import { STATUSES, TRACKS, filterMissions, isOpen, nextMission, summarise, type Status, type Track } from '../game/browse';
import { AircraftArt, Btn, Chip, Icon, PageHead, Stars } from '../components/ui';

const TIERS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;
const TIER_NOTE: Record<string, string> = {
  Beginner: 'Simple aircraft movement and obstacle avoidance.',
  Intermediate: 'Altitude, speed, wind, terrain and landings.',
  Advanced: 'Longer legs with weather, fuel and operational decisions.',
  Expert: 'Multi-stage airline-style scenarios with crew decisions.',
};
/** How many missions of a tier are shown before "Show all". */
const PAGE = 12;

export function Fly({ missionId, from }: { missionId?: string; from?: string }) {
  const p = useProgress();
  const livery = LIVERIES.find((l) => l.id === p.livery)?.color ?? LIVERIES[0].color;
  const [query, setQuery] = useState('');
  const [track, setTrack] = useState<Track>('all');
  const [status, setStatus] = useState<Status>('all');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const missions = allMissions();
  const summary = useMemo(() => summarise(missions, p), [missions, p]);
  const filtered = useMemo(() => filterMissions(missions, p, { query, track, status }), [missions, p, query, track, status]);
  const upNext = useMemo(() => nextMission(missions, p), [missions, p]);

  if (missionId) {
    const def = getMission(missionId);
    if (!def) return <div className="card"><h2>Mission not found</h2><Btn href="fly">Back to missions</Btn></div>;
    const lesson = def.lessonId ? findLesson(def.lessonId)?.lesson : undefined;
    if (def.lessonId && !p.lessons[def.lessonId]?.passed) {
      return <div className="card"><h2><Icon name="lock" /> {def.title} is locked</h2><p>Pass the assessment for “{lesson?.title ?? 'its lesson'}” to unlock this mission.</p><div className="row gap">{lesson && <Btn kind="accent" href={`lesson/${lesson.id}`}>Open the lesson</Btn>}<Btn kind="ghost" href="fly">Back to missions</Btn></div></div>;
    }
    return <FlightGame key={missionId} def={def} exitHref={from ? `lesson/${from}` : 'fly'} nextHref={from ? `lesson/${from}/complete` : 'fly'} nextLabel={from ? 'Collect rewards' : 'Back to missions'} />;
  }

  const stars = Object.values(p.missions).reduce((n, m) => n + m.stars, 0);
  const filtering = query.trim() !== '' || track !== 'all' || status !== 'all';
  const upNextLesson = upNext?.lessonId ? findLesson(upNext.lessonId)?.lesson : undefined;
  const clear = () => { setQuery(''); setTrack('all'); setStatus('all'); };

  return (
    <div className="stack">
      <PageHead title="Fly" sub="Every passed lesson unlocks a flight mission. Missions are simplified games and educational scenarios — not flight training."
        right={<div className="track-meter"><strong>{stars}</strong><span className="small muted">stars · {summary.flown} missions flown</span></div>} />

      {upNext && (
        <section className="card up-next" aria-label="Up next">
          <div>
            <Chip tone="accent">Up next</Chip>
            <h2>{upNext.title}</h2>
            <p className="small">{upNext.objective}</p>
            <p className="small muted">{upNextLesson ? `Lesson: ${upNextLesson.title}` : 'Free flight'} · {upNext.tier}</p>
          </div>
          <Btn kind="accent" icon="play" href={`fly/${upNext.id}`}>Fly this mission</Btn>
        </section>
      )}

      <section className="card">
        <div className="card-head"><h2>Find a mission</h2>
          <div className="fly-summary" aria-label="Mission summary">
            <Chip>{summary.total} missions</Chip><Chip tone="ok">{summary.open} unlocked</Chip><Chip>{summary.locked} locked</Chip><Chip tone="accent">{summary.threeStars} with 3 stars</Chip>
          </div>
        </div>
        <div className="fly-filters">
          <label className="search"><Icon name="search" size={18} /><span className="sr-only">Search missions</span>
            <input type="search" value={query} placeholder="Search by title or objective" onChange={(e) => setQuery(e.target.value)} /></label>
          <label className="field"><span>Track</span>
            <select value={track} onChange={(e) => setTrack(e.target.value as Track)}>{TRACKS.map(([k, label]) => <option key={k} value={k}>{label}</option>)}</select></label>
          <label className="field"><span>Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>{STATUSES.map(([k, label]) => <option key={k} value={k}>{label}</option>)}</select></label>
        </div>
        <div className="row gap wrap" role="status" aria-live="polite">
          <span className="small muted">{filtering ? `${filtered.length} of ${summary.total} missions match` : `Showing all ${summary.total} missions`}</span>
          {filtering && <Btn small kind="ghost" onClick={clear}>Clear filters</Btn>}
        </div>
      </section>

      <section className="card">
        <div className="card-head"><h2>Virtual hangar</h2><span className="small muted">Your selected aircraft is used in Free Flight missions. Lesson missions provide their own aircraft.</span></div>
        <div className="hangar-grid">
          {GAME_AIRCRAFT.map((a) => {
            const locked = p.xp < a.unlockXp;
            const selected = p.selectedAircraft === a.id;
            return (
              <div key={a.id} className={`hangar-card${selected ? ' on' : ''}${locked ? ' locked' : ''}`}>
                <AircraftArt ac={a} color={livery} width={170} locked={locked} />
                <strong>{a.name}</strong>
                <span className="small muted">{a.cls}</span>
                <p className="small">{a.blurb}</p>
                <p className="small muted">Speed {a.minKt}–{a.maxKt} kt · Agility {Math.round(a.agility * 100)}%</p>
                {locked ? <Chip><Icon name="lock" size={13} /> Unlocks at {a.unlockXp} XP</Chip> : selected ? <Chip tone="ok">Selected</Chip> : <Btn small kind="soft" onClick={() => actions.selectAircraft(a.id)}>Select</Btn>}
              </div>
            );
          })}
        </div>
        <div className="row gap wrap livery-row" role="group" aria-label="Livery colour">
          <span className="small muted">Livery:</span>
          {LIVERIES.map((l) => {
            const locked = p.xp < l.xp;
            return <button key={l.id} type="button" className={`swatch${p.livery === l.id ? ' on' : ''}`} style={{ background: l.color }} disabled={locked} aria-pressed={p.livery === l.id} aria-label={locked ? `${l.name}, unlocks at ${l.xp} XP` : l.name} title={locked ? `${l.name} — unlocks at ${l.xp} XP` : l.name} onClick={() => actions.livery(l.id)}>{locked && <Icon name="lock" size={12} />}</button>;
          })}
        </div>
      </section>

      {filtering && filtered.length === 0 && <div className="card"><p>No missions match those filters.</p><Btn kind="soft" onClick={clear}>Clear filters</Btn></div>}

      {TIERS.map((tier) => {
        const list = filtered.filter((m) => m.tier === tier);
        if (!list.length) return null;
        const all = expanded[tier] || filtering;
        const shown = all ? list : list.slice(0, PAGE);
        return (
          <section key={tier} className="stack-sm">
            <div><h2>{tier} missions <span className="small muted">({list.length})</span></h2><p className="muted">{TIER_NOTE[tier]}</p></div>
            <div className="mission-grid">
              {shown.map((m) => {
                const lesson = m.lessonId ? findLesson(m.lessonId)?.lesson : undefined;
                const open = isOpen(m, p);
                const st = p.missions[m.id];
                const ac = GAME_AIRCRAFT.find((a) => a.id === m.aircraftId) ?? GAME_AIRCRAFT[0];
                return (
                  <div key={m.id} className={`mission-card env-${m.env}${open ? '' : ' locked'}`}>
                    <div className="mission-art"><AircraftArt ac={ac} color={livery} width={120} locked={!open} /></div>
                    <div className="mission-body">
                      <div className="row between"><strong>{m.title}</strong>{st && <Stars n={st.stars} />}</div>
                      <p className="small">{m.objective}</p>
                      <p className="small muted">{lesson ? `Lesson: ${lesson.title}` : 'Free flight — always available'} · {m.style}{st ? ` · Best ${st.best}` : ''}</p>
                      {open ? <Btn small kind={st ? 'soft' : 'accent'} icon="play" href={`fly/${m.id}`}>{st ? 'Fly again' : 'Fly'}</Btn> : <Btn small kind="ghost" icon="lock" href={lesson ? `lesson/${lesson.id}` : 'academy'}>Pass the lesson to unlock</Btn>}
                    </div>
                  </div>
                );
              })}
            </div>
            {!all && list.length > PAGE && <div><Btn kind="soft" onClick={() => setExpanded({ ...expanded, [tier]: true })}>Show all {list.length} {tier.toLowerCase()} missions</Btn></div>}
          </section>
        );
      })}
    </div>
  );
}
