import type { Track } from '../types';
import { useProgress } from '../store/progress';
import { getTrack, isLive, isUnlocked, trackProgress } from '../content';
import { Bar, Btn, Chip, Icon, PageHead, Stars } from '../components/ui';
import { LessonFinder } from '../components/LessonFinder';

const JURISDICTION: Record<string, string> = {
  ICAO: 'Reference framework: ICAO (international). ICAO Annex 1 sets minimum licensing standards; your national authority publishes the actual syllabus and examinations.',
  EASA: 'Reference framework: EASA Part-FCL. Module codes shown are EASA theoretical knowledge subject numbers.',
  FAA: 'Reference framework: FAA (14 CFR Part 61). The FAA groups knowledge areas differently from the EASA subject list shown here, and uses inches of mercury and "weight and balance" terminology.',
};

function TrackCard({ track, icon }: { track: Track; icon: string }) {
  const p = useProgress();
  const pr = trackProgress(track, p);
  return (
    <a className="dest" href={`#/track/${track.id}`} style={{ ['--dest' as string]: track.color }}>
      <span className="dest-icon"><Icon name={icon} size={26} /></span>
      <div className="grow">
        <h3>{track.title}</h3>
        <p className="muted">{track.blurb}</p>
        <Bar value={pr.pct} color={track.color} label={`${track.title} progress`} />
        <p className="small muted">{pr.done} of {pr.total} lessons passed · {pr.planned} more in development</p>
      </div>
      <Icon name="arrow" />
    </a>
  );
}

export function Academy() {
  const p = useProgress();
  return (
    <div className="stack">
      <PageHead title="Academy" sub="Four stages from first principles to airline-level theory. Explore any pathway at any time." />
      <LessonFinder />
      <section className="card tinted">
        <div className="card-head"><div><p className="eyebrow">Stage 1</p><h2>Pre-Flight Academy</h2></div><Chip tone="navy">Start here</Chip></div>
        <p>Mathematics and physics from the very beginning. Every lesson has an interactive experiment, practice, an assessment and a flight mission.</p>
        <div className="grid-2">
          <TrackCard track={getTrack('math')!} icon="exam" />
          <TrackCard track={getTrack('physics')!} icon="bolt" />
        </div>
      </section>
      <section className="stack-sm">
        <p className="eyebrow">Stages 2 to 4 — pilot licence theory</p>
        <TrackCard track={getTrack('ppl')!} icon="fly" />
        <TrackCard track={getTrack('cpl')!} icon="fly" />
        <TrackCard track={getTrack('atpl')!} icon="fly" />
      </section>
      <section className="card">
        <div className="card-head"><h2>Licensing framework</h2><Btn small kind="ghost" href="profile">Change in settings</Btn></div>
        <p>{JURISDICTION[p.settings.jurisdiction]}</p>
        <p className="small muted">Completing a pathway here does not grant a licence. Real licensing requires approved training, official examinations, flight experience and a medical certificate.</p>
      </section>
    </div>
  );
}

export function TrackPage({ id }: { id: string }) {
  const p = useProgress();
  const track = getTrack(id);
  if (!track) return <div className="card"><h2>Pathway not found</h2><Btn href="academy">Back to the Academy</Btn></div>;
  const pr = trackProgress(track, p);
  let lastPhase = '';
  return (
    <div className="stack">
      <PageHead title={track.title} sub={track.blurb} back="academy" right={<div className="track-meter"><strong>{Math.round(pr.pct * 100)}%</strong><span className="small muted">{pr.done}/{pr.total} passed</span></div>} />
      <Bar value={pr.pct} color={track.color} label={`${track.title} progress`} />
      {track.note && <div className="note"><Icon name="book" size={18} /><div><p>{track.note}</p><p className="small">{JURISDICTION[p.settings.jurisdiction]}</p></div></div>}
      <p className="small muted">{pr.total} lessons are complete and published. {pr.planned} further lessons are listed so you can see the full syllabus; they are still in development and are marked clearly.</p>
      {track.modules.map((m) => {
        const phase = m.phase && m.phase !== lastPhase ? m.phase : null;
        if (m.phase) lastPhase = m.phase;
        const live = m.lessons.filter(isLive);
        return (
          <div key={m.id} className="stack-sm">
            {phase && <h2 className="phase">{phase}</h2>}
            <section className="card module">
              <div className="card-head">
                <h3>{m.code && <span className="code">{m.code}</span>}{m.title}</h3>
                {m.supplementary ? <Chip tone="accent">Supplementary — not licensing syllabus</Chip> : <span className="small muted">{live.filter((l) => p.lessons[l.id]?.passed).length}/{live.length} passed</span>}
              </div>
              <ul className="lessons">
                {m.lessons.map((l) => {
                  if (l.planned || !isLive(l)) return <li key={l.id} className="lesson-row planned"><span className="lesson-state"><Icon name="clock" size={18} /></span><span className="grow">{l.title}</span><Chip>In development</Chip></li>;
                  const st = p.lessons[l.id];
                  const open = isUnlocked(l.id, p);
                  const stars = p.missions[l.missionId]?.stars ?? 0;
                  const body = (
                    <>
                      <span className={`lesson-state${st?.passed ? ' done' : open ? ' open' : ''}`}><Icon name={st?.passed ? 'check' : open ? 'play' : 'lock'} size={18} /></span>
                      <span className="grow"><strong>{l.title}</strong><span className="small muted"> · {l.minutes} min · {['', 'Foundation', 'Intermediate', 'Advanced'][l.level]}</span></span>
                      {st?.passed && <span className="small muted">{Math.round(st.best * 100)}%</span>}
                      {st?.passed && <Stars n={stars} />}
                      {!open && <span className="small muted">Pass the previous lesson to unlock</span>}
                    </>
                  );
                  return open ? <li key={l.id}><a className="lesson-row" href={`#/lesson/${l.id}`}>{body}</a></li> : <li key={l.id} className="lesson-row locked" aria-disabled="true">{body}</li>;
                })}
              </ul>
            </section>
          </div>
        );
      })}
    </div>
  );
}
