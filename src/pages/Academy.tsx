import { useState } from 'react';
import type { Track } from '../types';
import { useProgress } from '../store/progress';
import { getTrack, isLive, isUnlocked, trackProgress } from '../content';
import { Bar, Btn, Icon, More, PageHead, PathHead, Stars } from '../components/ui';
import { LessonFinder } from '../components/LessonFinder';

const JURISDICTION: Record<string, string> = {
  ICAO: 'Reference framework: ICAO (international). ICAO Annex 1 sets minimum licensing standards; your national authority publishes the actual syllabus and examinations.',
  EASA: 'Reference framework: EASA Part-FCL. Module codes shown are EASA theoretical knowledge subject numbers.',
  FAA: 'Reference framework: FAA (14 CFR Part 61). The FAA groups knowledge areas differently from the EASA subject list shown here, and uses inches of mercury and "weight and balance" terminology.',
};
const LEVEL = ['', 'Foundation', 'Intermediate', 'Advanced'];
const LICENCE_NOTE = 'Completing a pathway here does not grant a licence. Real licensing requires approved training, official examinations, flight experience and a medical certificate.';

/** Curriculum management detail, kept one tap away instead of above the lessons. */
export function CurriculumSources({ track }: { track?: Track }) {
  const p = useProgress();
  const pr = track ? trackProgress(track, p) : null;
  return (
    <More label="Curriculum & Sources" className="curriculum">
      {track?.note && <p>{track.note}</p>}
      <p>{JURISDICTION[p.settings.jurisdiction]} <a href="#/profile">Change framework</a></p>
      {pr && pr.planned > 0 && <p className="small muted">{pr.planned} further syllabus titles are listed and marked “In development”.</p>}
      <p className="small muted">{LICENCE_NOTE}</p>
    </More>
  );
}

function TrackCard({ track, icon }: { track: Track; icon: string }) {
  const p = useProgress();
  const pr = trackProgress(track, p);
  return (
    <a className="dest" href={`#/track/${track.id}`} style={{ ['--dest' as string]: track.color }}>
      <span className="dest-icon"><Icon name={icon} size={22} /></span>
      <div className="grow">
        <div className="dest-top"><h3>{track.title}</h3><span className="dest-count">{pr.done}/{pr.total}</span></div>
        <p className="dest-blurb">{track.blurb}</p>
        <Bar value={pr.pct} color={track.color} label={`${track.title} progress`} />
      </div>
      <Icon name="arrow" size={18} />
    </a>
  );
}

export function Academy() {
  return (
    <div className="stack">
      <PageHead title="Academy" sub="From first principles to airline theory." />
      <LessonFinder />
      <section className="stack-sm">
        <p className="eyebrow">Pre-Flight Academy</p>
        <div className="grid-2">
          <TrackCard track={getTrack('math')!} icon="exam" />
          <TrackCard track={getTrack('physics')!} icon="bolt" />
        </div>
      </section>
      <section className="stack-sm">
        <p className="eyebrow">Pilot licence theory</p>
        <TrackCard track={getTrack('ppl')!} icon="fly" />
        <TrackCard track={getTrack('cpl')!} icon="fly" />
        <TrackCard track={getTrack('atpl')!} icon="fly" />
      </section>
      <CurriculumSources />
    </div>
  );
}

export function TrackPage({ id }: { id: string }) {
  const p = useProgress();
  const [why, setWhy] = useState<string | null>(null);
  const track = getTrack(id);
  if (!track) return <div className="card"><h2>Pathway not found</h2><Btn href="academy">Back to the Academy</Btn></div>;
  const pr = trackProgress(track, p);
  const anyLocked = track.modules.some((m) => m.lessons.some((l) => isLive(l) && !isUnlocked(l.id, p)));
  let lastPhase = '';
  return (
    <div className="stack">
      <PathHead eyebrow={track.short} title={track.title} done={pr.done} total={pr.total} color={track.color} back="academy" />
      <CurriculumSources track={track} />
      {anyLocked && <p className="path-hint"><Icon name="lock" size={14} /> Lessons open in order. Pass one to unlock the next.</p>}
      {track.modules.map((m) => {
        const phase = m.phase && m.phase !== lastPhase ? m.phase : null;
        if (m.phase) lastPhase = m.phase;
        const live = m.lessons.filter(isLive);
        const passed = live.filter((l) => p.lessons[l.id]?.passed).length;
        return (
          <div key={m.id} className="stack-sm">
            {phase && <h2 className="phase">{phase}</h2>}
            <section className="module-block" aria-label={m.title}>
              <div className="module-head">
                <h3>{m.code && <span className="code">{m.code}</span>}{m.title}</h3>
                {m.supplementary ? <span className="tag" title="Supplementary — not licensing syllabus">Extra</span> : <span className="module-count">{passed}/{live.length}</span>}
              </div>
              <ul className="lessons">
                {m.lessons.map((l) => {
                  if (l.planned || !isLive(l)) return <li key={l.id} className="lesson-row planned"><span className="lesson-state"><Icon name="clock" size={16} /></span><span className="lesson-main"><span className="lesson-title">{l.title}</span><span className="lesson-meta">In development</span></span></li>;
                  const st = p.lessons[l.id];
                  const open = isUnlocked(l.id, p);
                  const stars = p.missions[l.missionId]?.stars ?? 0;
                  const state = st?.passed ? 'done' : open ? 'open' : 'locked';
                  const body = (
                    <>
                      <span className={`lesson-state ${state}`}><Icon name={st?.passed ? 'check' : open ? 'play' : 'lock'} size={st?.passed ? 16 : 14} /></span>
                      <span className="lesson-main">
                        <span className="lesson-title">{l.title}</span>
                        <span className="lesson-meta">{l.minutes} min · {LEVEL[l.level]}{st?.passed ? ` · ${Math.round(st.best * 100)}%` : ''}</span>
                        {why === l.id && <span className="lesson-why" role="status">Complete the previous lesson first.</span>}
                      </span>
                      {st?.passed && stars > 0 && <Stars n={stars} size={14} />}
                    </>
                  );
                  if (open) return <li key={l.id}><a className={`lesson-row ${state}`} href={`#/lesson/${l.id}`}>{body}</a></li>;
                  return <li key={l.id}><button type="button" className="lesson-row locked" aria-label={`${l.title}. Locked: complete the previous lesson.`} onClick={() => setWhy(why === l.id ? null : l.id)}>{body}</button></li>;
                })}
              </ul>
            </section>
          </div>
        );
      })}
    </div>
  );
}
