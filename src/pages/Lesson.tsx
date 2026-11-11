import { useEffect, useMemo, useState } from 'react';
import type { Answer, Lesson, Question } from '../types';
import { APP } from '../config';
import { actions, useProgress } from '../store/progress';
import { SOURCES, findLesson, formulaById, getMission, isUnlocked, lessonStatus, nextLesson } from '../content';
import { grade, isAnswered, mulberry32, shuffle, type GradeResult } from '../engine/assessment';
import { ACHIEVEMENTS } from '../engine/gamification';
import { audio } from '../engine/audio';
import { canSpeak, speak, stopSpeaking } from '../engine/speech';
import { Bar, Btn, Chip, Icon, PageHead, Rich, Stars } from '../components/ui';
import { Feedback, QuestionView, QuizRunner, answerText } from '../components/Quiz';
import { Lab } from '../components/Labs';
import { setTutorCtx } from '../components/Tutor';

const STEPS = ['Introduction', 'Concept', 'Demonstration', 'Practice', 'Assessment', 'Mission', 'Complete'] as const;
const LEVEL = ['', 'Foundation', 'Intermediate', 'Advanced'];

function FormulaCard({ id }: { id: string }) {
  const f = formulaById(id);
  if (!f) return null;
  return (
    <div className="formula-card">
      <div className="row between wrap"><strong>{f.name}</strong><a className="small" href="#/knowledge/formulas">Open in Formula Library</a></div>
      <div className="formula-expr">{f.expr}</div>
      <p>{f.plain}</p>
      <ul className="vars">
        <li><code className="fx">{f.out.sym}</code> = {f.out.name}{f.out.unit && ` (${f.out.unit})`}</li>
        {f.vars.map((v) => <li key={v.sym}><code className="fx">{v.sym}</code> = {v.name}{v.unit && ` (${v.unit})`}</li>)}
      </ul>
      <p className="small"><strong>Valid when:</strong> {f.valid}</p>
      <p className="small"><strong>Common mistakes:</strong> {f.mistakes.join(' ')}</p>
    </div>
  );
}

function Assessment({ lesson, onPassed }: { lesson: Lesson; onPassed: () => void }) {
  const p = useProgress();
  const [attempt, setAttempt] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [result, setResult] = useState<GradeResult | null>(null);
  const [gained, setGained] = useState(0);
  const seed = useMemo(() => Math.floor(Math.random() * 1e6), [attempt]); // eslint-disable-line react-hooks/exhaustive-deps
  const questions = useMemo(() => shuffle(lesson.assessment, mulberry32(seed)), [lesson, seed]);
  const answered = questions.filter((q) => isAnswered(q, answers[q.id])).length;
  const already = p.lessons[lesson.id];

  const submit = () => {
    const r = grade(questions, answers, APP.passMark);
    for (const q of questions) actions.answer(q, r.results[q.id]);
    setGained(actions.assessment(lesson.id, r.score, r.passed));
    setResult(r);
    audio.sfx(r.passed ? 'win' : 'fail');
    const firstWrong = questions.find((q) => !r.results[q.id]);
    if (firstWrong) setTutorCtx({ lastWrong: { q: firstWrong, given: answerText(firstWrong, answers[firstWrong.id]) } });
    window.scrollTo({ top: 0 });
  };
  const retake = () => { setAnswers({}); setResult(null); setAttempt((a) => a + 1); window.scrollTo({ top: 0 }); };

  return (
    <div className="stack">
      {!result && (
        <div className="note">
          <Icon name="exam" size={18} />
          <div><p><strong>Lesson assessment.</strong> {questions.length} questions. Pass mark {Math.round(APP.passMark * 100)}%. Feedback is shown after you submit. Question and option order change on every attempt.</p>
            {already?.passed && <p className="small">You have already passed this assessment (best {Math.round(already.best * 100)}%). Retaking it cannot lower your result.</p>}</div>
        </div>
      )}
      {result && (
        <div className={`result ${result.passed ? 'pass' : 'fail'}`} role="status">
          <div className="result-score">{Math.round(result.score * 100)}%</div>
          <div>
            <h3>{result.passed ? 'Assessment passed' : 'Not passed yet'}</h3>
            <p>{result.correct} of {result.total} correct. {result.passed ? (gained > 0 ? `You earned ${gained} XP and unlocked the flight mission.` : 'Your earlier pass stands. The flight mission is available.') : `You need ${Math.round(APP.passMark * 100)}%. Read the explanations below, review the lesson, and try again — there is no penalty for retaking.`}</p>
            <div className="row gap wrap">
              {result.passed ? <Btn kind="accent" icon="fly" onClick={onPassed}>Go to mission briefing</Btn> : <Btn kind="accent" icon="refresh" onClick={retake}>Retake assessment</Btn>}
              {result.passed && <Btn kind="ghost" icon="refresh" onClick={retake}>Retake for a higher score</Btn>}
            </div>
          </div>
        </div>
      )}
      {questions.map((q, i) => (
        <div key={q.id} className="card q-card">
          <div className="small muted">Question {i + 1}</div>
          <QuestionView q={q} value={answers[q.id]} onChange={(a) => setAnswers((s) => ({ ...s, [q.id]: a }))} disabled={!!result} reveal={!!result} seed={seed + i} />
          {result && <Feedback q={q} ok={result.results[q.id]} />}
        </div>
      ))}
      {!result && (
        <div className="submit-bar">
          <span className="small muted">{answered} of {questions.length} answered</span>
          <Btn kind="accent" onClick={submit} disabled={answered < questions.length}>Submit assessment</Btn>
        </div>
      )}
    </div>
  );
}

function Examples({ lesson }: { lesson: Lesson }) {
  const [shown, setShown] = useState<Record<number, number>>({});
  return (
    <div className="stack">
      <p className="muted">Work through each example one step at a time. Try to predict the next step before you reveal it.</p>
      {lesson.examples.map((ex, i) => {
        const n = shown[i] ?? 1;
        return (
          <div key={ex.title} className="card">
            <h3>Example {i + 1}: {ex.title}</h3>
            <ol className="steps">{ex.steps.slice(0, n).map((s) => <li key={s}><Rich text={s} /></li>)}</ol>
            {n < ex.steps.length ? <Btn small kind="soft" onClick={() => setShown({ ...shown, [i]: n + 1 })}>Show next step</Btn> : <Chip tone="ok">Example complete</Chip>}
          </div>
        );
      })}
      {lesson.sections.filter((s) => s.lab).map((s) => <Lab key={s.lab} id={s.lab!} />)}
    </div>
  );
}

export function LessonPage({ id, view }: { id: string; view?: string }) {
  const p = useProgress();
  const found = findLesson(id);
  const state = p.lessons[id];
  const [step, setStep] = useState(view === 'complete' && state?.passed ? 6 : 0);
  const [practice, setPractice] = useState<{ score: number; correct: number } | null>(null);
  const [practiceRun, setPracticeRun] = useState(0);
  const [reading, setReading] = useState<string | null>(null);

  useEffect(() => {
    if (found) { actions.visit(id); setTutorCtx({ lesson: found.lesson }, true); }
    return () => { setTutorCtx({}, true); stopSpeaking(); };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!found || lessonStatus(id) !== 'published') return <div className="card"><h2>Lesson not available</h2><p>This lesson does not exist or is not published yet.</p><Btn href="academy">Back to the Academy</Btn></div>;
  const { lesson, track, module } = found;
  if (!isUnlocked(id, p)) return <div className="card"><h2>{lesson.title}</h2><p><Icon name="lock" size={18} /> This lesson unlocks when you pass the previous lesson in “{module.title}”.</p><Btn href={`track/${track.id}`}>Open {track.title}</Btn></div>;

  const passed = !!state?.passed;
  const mission = getMission(lesson.missionId);
  const missionState = p.missions[lesson.missionId];
  const next = nextLesson(id, p);
  const canOpen = (i: number) => i <= 4 || passed;
  const go = (i: number) => { if (canOpen(i)) { setStep(i); stopSpeaking(); setReading(null); window.scrollTo({ top: 0 }); } };
  const saved = p.savedLessons.includes(id);
  const read = (key: string, text: string) => {
    if (reading === key) { stopSpeaking(); setReading(null); return; }
    setReading(key);
    speak(text.replace(/[*`]/g, ''), { rate: p.settings.speechRate, onEnd: () => setReading(null) });
  };
  const recentBadges = ACHIEVEMENTS.filter((a) => p.achievements[a.id] && Date.now() - p.achievements[a.id] < 30 * 60_000);
  const topic = lesson.assessment[0]?.topic;
  const mastery = topic && p.topics[topic] ? p.topics[topic].correct / p.topics[topic].total : null;

  return (
    <div className="stack lesson">
      <PageHead title={lesson.title} sub={`${track.title} · ${module.title}`} back={`track/${track.id}`}
        right={<button type="button" className={`icon-btn${saved ? ' on' : ''}`} aria-pressed={saved} aria-label={saved ? 'Remove lesson from saved' : 'Save lesson'} onClick={() => actions.toggle('savedLessons', id)}><Icon name="bookmark" fill={saved} /></button>} />

      <ol className="stepper" aria-label="Lesson phases">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button type="button" className={`step${i === step ? ' on' : ''}${(i < step || (passed && i <= 4)) ? ' done' : ''}`} disabled={!canOpen(i)} aria-current={i === step ? 'step' : undefined} onClick={() => go(i)}>
              <span className="step-n">{!canOpen(i) ? <Icon name="lock" size={13} /> : i + 1}</span><span className="step-name">{s}</span>
            </button>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="stack">
          <div className="lesson-hero" style={{ ['--dest' as string]: track.color }}>
            <svg viewBox="0 0 400 140" aria-hidden="true"><path d="M0 110 Q 100 60 200 95 T 400 70 V140 H0Z" fill="rgba(255,255,255,0.14)" /><path d="M40 92l92-12 56-58h20l-22 58 58-6 22-22h16l-10 36 10 36h-16l-22-22-58-6 22 58h-20l-56-58-92-12z" fill="rgba(255,255,255,0.9)" transform="translate(150 6) scale(0.55)" /><circle cx="60" cy="40" r="22" fill="rgba(255,255,255,0.18)" /></svg>
            <div><p className="eyebrow light">{track.short} · {LEVEL[lesson.level]}</p><h2>{lesson.title}</h2></div>
          </div>
          <div className="row gap wrap">
            <Chip tone="navy"><Icon name="clock" size={14} /> About {lesson.minutes} minutes</Chip>
            <Chip>Difficulty: {LEVEL[lesson.level]}</Chip>
            {passed && <Chip tone="ok">Passed · best {Math.round((state?.best ?? 0) * 100)}%</Chip>}
            <Chip tone="warn">Draft content — pending independent expert review</Chip>
          </div>
          <div className="card"><p className="lead">{lesson.intro}</p></div>
          <div className="grid-2">
            <div className="card"><h3>Learning objectives</h3><ul className="ticks">{lesson.objectives.map((o) => <li key={o}>{o}</li>)}</ul></div>
            <div className="card">
              <h3>Prerequisites</h3>
              {lesson.prereqs?.length ? <ul className="ticks plain">{lesson.prereqs.map((pid) => { const f = findLesson(pid); return f ? <li key={pid}><a href={`#/lesson/${pid}`}>{f.lesson.title}</a> {p.lessons[pid]?.passed ? <Chip tone="ok">Passed</Chip> : <Chip>Recommended first</Chip>}</li> : null; })}</ul> : <p className="muted">None. This lesson starts from zero.</p>}
              <h3>Sources</h3>
              <ul className="sources">{lesson.sources.map((sid) => { const s = SOURCES.find((x) => x.id === sid); return s ? <li key={sid}>{s.title} — {s.org} ({s.ref}). <span className="muted">{s.jurisdiction}.</span></li> : null; })}</ul>
            </div>
          </div>
          <div className="row gap"><Btn kind="accent" icon="arrow" onClick={() => go(1)}>Start lesson</Btn></div>
        </div>
      )}

      {step === 1 && (
        <div className="stack">
          {lesson.sections.map((s) => (
            <section key={s.h} className="card section">
              <div className="row between"><h3>{s.h}</h3>{canSpeak() && p.settings.voice && <button type="button" className="icon-btn" aria-label={reading === s.h ? 'Stop reading aloud' : `Read "${s.h}" aloud`} onClick={() => read(s.h, `${s.h}. ${s.body.join(' ')}`)}><Icon name={reading === s.h ? 'pause' : 'sound'} size={18} /></button>}</div>
              {s.body.map((b) => <p key={b}><Rich text={b} /></p>)}
              {s.formula && <FormulaCard id={s.formula} />}
              {s.lab && <Lab id={s.lab} />}
              {s.note && <div className="callout"><Icon name="tutor" size={18} /><p><Rich text={s.note} /></p></div>}
            </section>
          ))}
          <div className="row gap"><Btn kind="ghost" onClick={() => go(0)}>Back</Btn><Btn kind="accent" icon="arrow" onClick={() => go(2)}>Continue to worked examples</Btn></div>
        </div>
      )}

      {step === 2 && (<><Examples lesson={lesson} /><div className="row gap"><Btn kind="ghost" onClick={() => go(1)}>Back</Btn><Btn kind="accent" icon="arrow" onClick={() => go(3)}>Continue to practice</Btn></div></>)}

      {step === 3 && (
        <div className="stack">
          {!practice ? (
            <div className="card">
              <QuizRunner key={practiceRun} questions={lesson.practice} finishLabel="Finish practice"
                onQuestion={(q: Question) => setTutorCtx({ question: q })}
                onWrong={(q, given) => setTutorCtx({ lastWrong: { q, given } })}
                onFinish={(score, correct) => { setPractice({ score, correct }); setTutorCtx({ question: undefined }); }} />
            </div>
          ) : (
            <div className="card center">
              <h3>Practice complete</h3>
              <p className="big-number">{practice.correct} / {lesson.practice.length}</p>
              <p className="muted">{practice.score >= 0.8 ? 'You are ready for the assessment.' : 'Consider reviewing the concept or asking the tutor before the assessment. Practice is not scored against you.'}</p>
              <div className="row gap wrap center"><Btn kind="soft" icon="refresh" onClick={() => { setPractice(null); setPracticeRun((r) => r + 1); }}>Practise again</Btn><Btn kind="ghost" onClick={() => go(1)}>Review concept</Btn><Btn kind="accent" icon="arrow" onClick={() => go(4)}>Take the assessment</Btn></div>
            </div>
          )}
        </div>
      )}

      {step === 4 && <Assessment lesson={lesson} onPassed={() => go(5)} />}

      {step === 5 && mission && (
        <div className="stack">
          <div className="card mission-unlock">
            <Chip tone="accent">Flight mission unlocked</Chip>
            <h2>{mission.title}</h2>
            <p>{mission.briefing}</p>
            <p><strong>Objective:</strong> {mission.objective}</p>
            <p><strong>What you will practise:</strong> {mission.outcome}</p>
            <div className="row gap wrap">
              <Btn kind="accent" icon="fly" href={`fly/${mission.id}/${id}`}>{missionState ? 'Fly again' : 'Start mission'}</Btn>
              <Btn kind="ghost" onClick={() => go(6)}>{missionState ? 'Continue' : 'Skip the mission for now'}</Btn>
              {missionState && <Stars n={missionState.stars} size={22} />}
            </div>
            <p className="small muted">The mission is a bonus activity. Your lesson is already complete because you passed the assessment, so progress never depends on reflexes. Assisted mode is available in the mission briefing.</p>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="stack">
          <div className={`card complete${p.settings.reducedMotion ? '' : ' celebrate'}`}>
            <span className="complete-badge"><Icon name="check" size={34} /></span>
            <h2>Lesson completed</h2>
            <p className="muted">{lesson.title}</p>
            <div className="complete-grid">
              <div><span>Assessment score</span><strong>{Math.round((state?.best ?? 0) * 100)}%</strong></div>
              <div><span>Mission score</span><strong>{missionState ? `${missionState.best} / 1000` : 'Not flown yet'}</strong>{missionState && <Stars n={missionState.stars} />}</div>
              <div><span>XP earned</span><strong>{100 + ((state?.best ?? 0) >= 1 ? 25 : 0) + (missionState && mission ? mission.xp + missionState.stars * 25 : 0)}</strong></div>
              <div><span>Knowledge mastery{topic ? ` · ${topic}` : ''}</span><strong>{mastery !== null ? `${Math.round(mastery * 100)}%` : '—'}</strong>{mastery !== null && <Bar value={mastery} color="#12a594" label="Topic mastery" />}</div>
            </div>
            {recentBadges.length > 0 && <div className="row gap wrap center">{recentBadges.map((a) => <Chip key={a.id} tone="accent"><Icon name="trophy" size={14} /> {a.name}</Chip>)}</div>}
            <div className="row gap wrap center">
              {next ? <Btn kind="accent" icon="arrow" href={`lesson/${next.id}`}>Next lesson: {next.title}</Btn> : <Btn kind="accent" href="exams">Open the Exam Center</Btn>}
              {!missionState && mission && <Btn kind="soft" icon="fly" href={`fly/${mission.id}/${id}`}>Fly the mission</Btn>}
              <Btn kind="ghost" onClick={() => go(1)}>Review lesson</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
