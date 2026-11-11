import { actions, useProgress } from '../store/progress';
import { GAME_AIRCRAFT, LIVERIES, allMissions, findLesson, getMission } from '../content';
import { FlightGame } from '../game/FlightGame';
import { AircraftArt, Btn, Chip, Icon, PageHead, Stars } from '../components/ui';

const TIERS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;
const TIER_NOTE: Record<string, string> = {
  Beginner: 'Simple aircraft movement and obstacle avoidance.',
  Intermediate: 'Altitude, speed, wind, terrain and landings.',
  Advanced: 'Longer legs with weather, fuel and operational decisions.',
  Expert: 'Multi-stage airline-style scenarios with crew decisions.',
};

export function Fly({ missionId, from }: { missionId?: string; from?: string }) {
  const p = useProgress();
  const livery = LIVERIES.find((l) => l.id === p.livery)?.color ?? LIVERIES[0].color;

  if (missionId) {
    const def = getMission(missionId);
    if (!def) return <div className="card"><h2>Mission not found</h2><Btn href="fly">Back to missions</Btn></div>;
    const lesson = def.lessonId ? findLesson(def.lessonId)?.lesson : undefined;
    if (def.lessonId && !p.lessons[def.lessonId]?.passed) {
      return <div className="card"><h2><Icon name="lock" /> {def.title} is locked</h2><p>Pass the assessment for “{lesson?.title ?? 'its lesson'}” to unlock this mission.</p><div className="row gap">{lesson && <Btn kind="accent" href={`lesson/${lesson.id}`}>Open the lesson</Btn>}<Btn kind="ghost" href="fly">Back to missions</Btn></div></div>;
    }
    return <FlightGame key={missionId} def={def} exitHref={from ? `lesson/${from}` : 'fly'} nextHref={from ? `lesson/${from}/complete` : 'fly'} nextLabel={from ? 'Collect rewards' : 'Back to missions'} />;
  }

  const missions = allMissions();
  const flown = Object.keys(p.missions).length;
  const stars = Object.values(p.missions).reduce((n, m) => n + m.stars, 0);

  return (
    <div className="stack">
      <PageHead title="Fly" sub="Every passed lesson unlocks a flight mission. Missions are simplified games and educational scenarios — not flight training."
        right={<div className="track-meter"><strong>{stars}</strong><span className="small muted">stars · {flown} missions flown</span></div>} />

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

      {TIERS.map((tier) => {
        const list = missions.filter((m) => m.tier === tier);
        if (!list.length) return null;
        return (
          <section key={tier} className="stack-sm">
            <div><h2>{tier} missions</h2><p className="muted">{TIER_NOTE[tier]}</p></div>
            <div className="mission-grid">
              {list.map((m) => {
                const lesson = m.lessonId ? findLesson(m.lessonId)?.lesson : undefined;
                const open = !m.lessonId || !!p.lessons[m.lessonId]?.passed;
                const st = p.missions[m.id];
                const ac = GAME_AIRCRAFT.find((a) => a.id === m.aircraftId) ?? GAME_AIRCRAFT[0];
                return (
                  <div key={m.id} className={`mission-card env-${m.env}${open ? '' : ' locked'}`}>
                    <div className="mission-art"><AircraftArt ac={ac} color={livery} width={120} locked={!open} /></div>
                    <div className="mission-body">
                      <div className="row between"><strong>{m.title}</strong>{st && <Stars n={st.stars} />}</div>
                      <p className="small">{m.objective}</p>
                      <p className="small muted">{lesson ? `Lesson: ${lesson.title}` : 'Free flight — always available'} · {m.style}</p>
                      {open ? <Btn small kind={st ? 'soft' : 'accent'} icon="play" href={`fly/${m.id}`}>{st ? 'Fly again' : 'Fly'}</Btn> : <Btn small kind="ghost" icon="lock" href={lesson ? `lesson/${lesson.id}` : 'academy'}>Pass the lesson to unlock</Btn>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
