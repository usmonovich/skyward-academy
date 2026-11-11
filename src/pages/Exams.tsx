import { useEffect, useMemo, useState } from 'react';
import type { Answer, ExamRecord, Question } from '../types';
import { actions, useProgress } from '../store/progress';
import { EXAM_POOLS, examPool, type ExamPool } from '../content';
import { byTopic, grade, isAnswered, isCorrect, pickQuestions } from '../engine/assessment';
import { audio } from '../engine/audio';
import { Bar, Btn, Chip, Empty, Icon, PageHead } from '../components/ui';
import { Feedback, QuestionView } from '../components/Quiz';

interface Config { pool: ExamPool; count: number; mode: 'practice' | 'exam'; minutes: number; topic: string }
interface Session { cfg: Config; questions: Question[]; seed: number; started: number }

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.max(0, Math.floor(s % 60))).padStart(2, '0')}`;

function Runner({ session, onDone }: { session: Session; onDone: (rec: ExamRecord, answers: Record<string, Answer>) => void }) {
  const { cfg, questions, seed } = session;
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [now, setNow] = useState(Date.now());
  const [confirm, setConfirm] = useState(false);
  const limit = cfg.mode === 'exam' && cfg.minutes ? cfg.minutes * 60 : 0;
  const elapsed = (now - session.started) / 1000;
  const q = questions[i];

  const submit = () => {
    const r = grade(questions, answers, 0.75);
    if (cfg.mode === 'exam') for (const x of questions) actions.answer(x, r.results[x.id]);
    onDone({ id: `e${Date.now()}`, date: Date.now(), pool: cfg.pool, mode: cfg.mode, total: r.total, correct: r.correct, seconds: Math.round((Date.now() - session.started) / 1000), byTopic: byTopic(questions, r.results) }, answers);
  };
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 500); return () => clearInterval(id); }, []);
  useEffect(() => { if (limit && elapsed >= limit) submit(); }, [elapsed, limit]); // eslint-disable-line react-hooks/exhaustive-deps

  const answeredCount = questions.filter((x) => isAnswered(x, answers[x.id])).length;
  const locked = cfg.mode === 'practice' && checked[q.id];
  return (
    <div className="stack">
      <div className="exam-bar">
        <Chip tone="navy">{cfg.pool} · {cfg.mode === 'exam' ? 'Examination mode' : 'Practice mode'}</Chip>
        <span className={`exam-clock${limit && limit - elapsed < 60 ? ' low' : ''}`} role="timer"><Icon name="clock" size={16} /> {limit ? `${clock(limit - elapsed)} left` : clock(elapsed)}</span>
      </div>
      <div className="q-nav" role="group" aria-label="Question navigation">
        {questions.map((x, n) => <button key={x.id} type="button" className={`q-dot${n === i ? ' on' : ''}${isAnswered(x, answers[x.id]) ? ' answered' : ''}${flags[x.id] ? ' flagged' : ''}`} aria-label={`Question ${n + 1}${isAnswered(x, answers[x.id]) ? ', answered' : ', not answered'}${flags[x.id] ? ', bookmarked' : ''}`} aria-current={n === i} onClick={() => setI(n)}>{n + 1}</button>)}
      </div>
      <div className="card q-card">
        <div className="row between"><span className="small muted">Question {i + 1} of {questions.length}</span>
          <button type="button" className={`icon-btn${flags[q.id] ? ' on' : ''}`} aria-pressed={!!flags[q.id]} aria-label={flags[q.id] ? 'Remove bookmark' : 'Bookmark this question to review before submitting'} onClick={() => setFlags({ ...flags, [q.id]: !flags[q.id] })}><Icon name="bookmark" size={18} fill={!!flags[q.id]} /></button></div>
        <QuestionView key={q.id} q={q} value={answers[q.id]} onChange={(a) => setAnswers((s) => ({ ...s, [q.id]: a }))} disabled={locked} reveal={locked} seed={seed + i} />
        {locked && <Feedback q={q} ok={isCorrect(q, answers[q.id])} />}
        <div className="row gap wrap">
          <Btn kind="ghost" icon="back" disabled={i === 0} onClick={() => setI(i - 1)}>Previous</Btn>
          {cfg.mode === 'practice' && !locked && <Btn disabled={!isAnswered(q, answers[q.id])} onClick={() => { const ok = isCorrect(q, answers[q.id]); setChecked({ ...checked, [q.id]: true }); actions.answer(q, ok); audio.sfx(ok ? 'ok' : 'bad'); }}>Check answer</Btn>}
          {i + 1 < questions.length ? <Btn kind="soft" icon="arrow" onClick={() => setI(i + 1)}>Next</Btn> : <Btn kind="accent" onClick={() => (answeredCount < questions.length ? setConfirm(true) : submit())}>Finish and see results</Btn>}
        </div>
      </div>
      <div className="row between wrap"><span className="small muted">{answeredCount} of {questions.length} answered{Object.values(flags).filter(Boolean).length ? ` · ${Object.values(flags).filter(Boolean).length} bookmarked` : ''}</span><Btn small kind="ghost" onClick={() => (answeredCount < questions.length ? setConfirm(true) : submit())}>Submit now</Btn></div>
      {confirm && (
        <div className="modal-back"><div className="modal" role="alertdialog" aria-modal="true" aria-labelledby="exam-confirm">
          <h3 id="exam-confirm">Submit with unanswered questions?</h3>
          <p>{questions.length - answeredCount} question{questions.length - answeredCount === 1 ? ' is' : 's are'} not answered and will be marked incorrect.</p>
          <div className="row gap"><Btn kind="accent" onClick={submit}>Submit anyway</Btn><Btn kind="ghost" onClick={() => setConfirm(false)}>Keep working</Btn></div>
        </div></div>
      )}
    </div>
  );
}

export function Exams() {
  const p = useProgress();
  const [cfg, setCfg] = useState<Config>({ pool: 'Physics', count: 10, mode: 'practice', minutes: 10, topic: 'All topics' });
  const [session, setSession] = useState<Session | null>(null);
  const [result, setResult] = useState<{ rec: ExamRecord; session: Session; answers: Record<string, Answer> } | null>(null);
  const pool = useMemo(() => examPool(cfg.pool), [cfg.pool]);
  const topics = useMemo(() => ['All topics', ...new Set(pool.map((q) => q.topic ?? 'General'))], [pool]);
  const filtered = cfg.topic === 'All topics' ? pool : pool.filter((q) => (q.topic ?? 'General') === cfg.topic);
  const start = () => { setResult(null); setSession({ cfg, questions: pickQuestions(filtered, cfg.count), seed: Math.floor(Math.random() * 1e6), started: Date.now() }); window.scrollTo({ top: 0 }); };

  if (session) return <Runner key={session.started} session={session} onDone={(rec, answers) => { actions.exam(rec); setResult({ rec, session, answers }); setSession(null); audio.sfx(rec.correct / rec.total >= 0.75 ? 'win' : 'fail'); window.scrollTo({ top: 0 }); }} />;

  if (result) {
    const { rec, session: s, answers } = result;
    const pct = rec.correct / rec.total;
    return (
      <div className="stack">
        <PageHead title="Exam results" sub={`${rec.pool} · ${rec.mode === 'exam' ? 'Examination mode' : 'Practice mode'}`} />
        <div className={`result ${pct >= 0.75 ? 'pass' : 'fail'}`}>
          <div className="result-score">{Math.round(pct * 100)}%</div>
          <div><h3>{rec.correct} of {rec.total} correct in {clock(rec.seconds)}</h3>
            <p>{pct >= 0.75 ? 'At or above the 75% practice benchmark.' : 'Below the 75% practice benchmark. Review the explanations and your weak topics, then try again.'} Official pass marks are set by each authority (commonly 70–75%).</p>
            <div className="row gap wrap"><Btn kind="accent" icon="refresh" onClick={start}>Retake with new questions</Btn><Btn kind="ghost" onClick={() => setResult(null)}>Back to Exam Center</Btn></div></div>
        </div>
        <div className="card"><h3>Results by topic</h3><ul className="weak">{Object.entries(rec.byTopic).map(([t, v]) => <li key={t}><span>{t}</span><Bar value={v.correct / v.total} color={v.correct / v.total >= 0.75 ? '#12a594' : '#f58220'} label={`${t} score`} /><span className="small muted">{v.correct}/{v.total}</span></li>)}</ul></div>
        <h2>Answer review</h2>
        {s.questions.map((q, i) => <div key={q.id} className="card q-card"><div className="small muted">Question {i + 1}</div><QuestionView q={q} value={answers[q.id]} onChange={() => {}} disabled reveal seed={s.seed + i} /><Feedback q={q} ok={isCorrect(q, answers[q.id])} /></div>)}
      </div>
    );
  }

  const history = p.exams;
  return (
    <div className="stack">
      <PageHead title="Examination Center" sub="Timed and untimed practice with randomised question sets, bookmarking and detailed review." back="knowledge" />
      <div className="note"><Icon name="exam" size={18} /><div><p>These are <strong>practice examinations</strong>. Every question is an original practice question or a scenario-based training question written for Skyward Academy. None is an official examination question, and results have no official standing.</p></div></div>
      <div className="card">
        <h3>Set up your exam</h3>
        <div className="form-grid">
          <label className="field"><span>Subject</span><select value={cfg.pool} onChange={(e) => setCfg({ ...cfg, pool: e.target.value as ExamPool, topic: 'All topics' })}>{EXAM_POOLS.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label className="field"><span>Topic</span><select value={cfg.topic} onChange={(e) => setCfg({ ...cfg, topic: e.target.value })}>{topics.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label className="field"><span>Number of questions</span><select value={cfg.count} onChange={(e) => setCfg({ ...cfg, count: Number(e.target.value) })}>{[5, 10, 20, 30].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
          <label className="field"><span>Mode</span><select value={cfg.mode} onChange={(e) => setCfg({ ...cfg, mode: e.target.value as Config['mode'] })}><option value="practice">Practice — explanation after each answer</option><option value="exam">Examination — feedback only after submission</option></select></label>
          <label className="field"><span>Time limit (examination mode)</span><select value={cfg.minutes} disabled={cfg.mode !== 'exam'} onChange={(e) => setCfg({ ...cfg, minutes: Number(e.target.value) })}>{[0, 5, 10, 20, 40].map((n) => <option key={n} value={n}>{n ? `${n} minutes` : 'No limit'}</option>)}</select></label>
        </div>
        <div className="row between wrap"><span className="small muted">{filtered.length} questions available{filtered.length < cfg.count ? ` — this exam will use all ${filtered.length}` : ''}.</span><Btn kind="accent" icon="play" onClick={start} disabled={!filtered.length}>Start exam</Btn></div>
      </div>
      <div className="card">
        <div className="card-head"><h3>Exam history and performance</h3><span className="small muted">{history.length} attempt{history.length === 1 ? '' : 's'}</span></div>
        {history.length === 0 ? <Empty>Your results will appear here after your first exam.</Empty> : (
          <>
            <svg viewBox={`0 0 ${Math.max(300, Math.min(history.length, 20) * 34 + 40)} 130`} className="chart" role="img" aria-label="Bar chart of recent exam scores">
              <line x1="30" y1="25" x2="100%" y2="25" stroke="#12a594" strokeDasharray="4 4" /><text x="2" y="29" fontSize="9" fill="#0d7f72">75%</text>
              {[...history].slice(0, 20).reverse().map((e, i) => { const h = (e.correct / e.total) * 100; return <g key={e.id}><rect x={36 + i * 34} y={100 - h * 1} width="22" height={h} rx="4" fill={h >= 75 ? '#12a594' : '#f58220'} /><text x={47 + i * 34} y="116" textAnchor="middle" fontSize="9" fill="#5b6b7f">{Math.round(h)}</text></g>; })}
            </svg>
            <ul className="schedule">{history.slice(0, 8).map((e) => <li key={e.id}><span>{e.pool} · {e.mode === 'exam' ? 'Exam' : 'Practice'}</span><span className="small muted">{e.correct}/{e.total} · {clock(e.seconds)} · {new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span></li>)}</ul>
          </>
        )}
      </div>
    </div>
  );
}
