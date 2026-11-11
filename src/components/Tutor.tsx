import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { Answer, Question } from '../types';
import { APP } from '../config';
import { tutorAction, tutorAsk, type TutorAction, type TutorCtx } from '../engine/tutor';
import { isAnswered, isCorrect } from '../engine/assessment';
import { actions, useProgress } from '../store/progress';
import { Btn, Icon } from './ui';
import { Feedback, QuestionView, answerText } from './Quiz';

// Pages publish what the learner is looking at so the tutor can answer in context.
let ctx: TutorCtx = {};
const subs = new Set<() => void>();
export function setTutorCtx(next: Partial<TutorCtx>, replace = false) { ctx = replace ? next : { ...ctx, ...next }; subs.forEach((s) => s()); }
const useTutorCtx = () => useSyncExternalStore((l) => { subs.add(l); return () => subs.delete(l); }, () => ctx);

interface Msg { who: 'you' | 'tutor'; text: string; source?: string; question?: Question }

const BUTTONS: [TutorAction, string][] = [['simple', 'Explain Simply'], ['example', 'Show an Example'], ['steps', 'Explain Step by Step'], ['hint', 'Give Me a Hint'], ['another', 'Try Another Question'], ['why', 'Why Is This Wrong?'], ['prereq', 'What Should I Know First?'], ['plan', 'Make My Revision Plan']];

function MiniQuestion({ q }: { q: Question }) {
  const [value, setValue] = useState<Answer>(undefined);
  const [checked, setChecked] = useState(false);
  return (
    <div className="mini-q">
      <QuestionView q={q} value={value} onChange={setValue} disabled={checked} reveal={checked} seed={q.prompt.length} />
      {checked ? <Feedback q={q} ok={isCorrect(q, value)} /> : <Btn small disabled={!isAnswered(q, value)} onClick={() => { const ok = isCorrect(q, value); setChecked(true); actions.answer(q, ok); if (!ok) setTutorCtx({ lastWrong: { q, given: answerText(q, value) } }); }}>Check answer</Btn>}
    </div>
  );
}

export function Tutor() {
  const p = useProgress();
  const c = useTutorCtx();
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [n, setN] = useState(0);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [log, open]);

  const run = (a: TutorAction, label: string) => {
    const r = tutorAction(a, c, p, n);
    if (a === 'example' || a === 'steps') setN(n + (a === 'steps' ? 1 : 0));
    setLog((l) => [...l, { who: 'you', text: label }, { who: 'tutor', text: r.text, source: r.source, question: r.question }]);
  };
  const ask = async () => {
    const q = text.trim();
    if (!q || busy) return;
    setText(''); setBusy(true);
    setLog((l) => [...l, { who: 'you', text: q }]);
    const r = await tutorAsk(q, c);
    setLog((l) => [...l, { who: 'tutor', text: r.text, source: r.source }]);
    setBusy(false);
  };

  return (
    <>
      <button type="button" className="tutor-fab" onClick={() => setOpen(true)} aria-label="Open the aviation tutor"><Icon name="tutor" size={22} /><span>Tutor</span></button>
      {open && (
        <aside className="tutor" role="dialog" aria-label="Aviation tutor">
          <div className="tutor-head">
            <div><strong>Aviation Tutor</strong><div className="small">{APP.tutorEndpoint ? 'AI tutor connected · answers grounded in the curriculum' : 'Curriculum tutor · answers come only from verified lesson content'}</div></div>
            <button type="button" className="icon-btn light" onClick={() => setOpen(false)} aria-label="Close tutor"><Icon name="close" /></button>
          </div>
          <div className="tutor-body">
            <div className="msg tutor-msg">{c.lesson ? `You are studying "${c.lesson.title}". I will guide you rather than hand you the answer. Choose a button or ask a question.` : 'Hello, Cadet. Ask me about any aviation term or formula, or open a lesson for step-by-step help.'}</div>
            {log.map((m, i) => (
              <div key={i} className={`msg ${m.who === 'you' ? 'you-msg' : 'tutor-msg'}`}>
                {m.text.split('\n').map((line, j) => <p key={j}>{line}</p>)}
                {m.question && <MiniQuestion q={m.question} />}
                {m.source && <div className="msg-src">{m.source}</div>}
              </div>
            ))}
            {busy && <div className="msg tutor-msg">Thinking…</div>}
            <div ref={end} />
          </div>
          <div className="tutor-actions">{BUTTONS.map(([a, label]) => <button key={a} type="button" className="pill" onClick={() => run(a, label)}>{label}</button>)}</div>
          <form className="tutor-input" onSubmit={(e) => { e.preventDefault(); void ask(); }}>
            <label className="sr-only" htmlFor="tutor-q">Ask the tutor</label>
            <input id="tutor-q" value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask about a term, formula or topic…" autoComplete="off" />
            <Btn small disabled={!text.trim() || busy} onClick={() => void ask()} icon="arrow" label="Send question" />
          </form>
        </aside>
      )}
    </>
  );
}
