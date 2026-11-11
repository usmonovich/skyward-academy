import { useEffect, useMemo, useState } from 'react';
import type { Answer, Question } from '../types';
import { correctAnswerText, isAnswered, isCorrect, mulberry32, shuffle } from '../engine/assessment';
import { actions, useProgress } from '../store/progress';
import { audio } from '../engine/audio';
import { Bar, Btn, Chip, Icon } from './ui';

export function answerText(q: Question, a: Answer): string {
  if (a === undefined || a === '') return '';
  if (q.type === 'tf') return a ? 'True' : 'False';
  if (q.type === 'order') return (a as string[]).join(' → ');
  if (q.type === 'match') return Object.entries(a as Record<string, string>).map(([l, r]) => `${l} — ${r}`).join('; ');
  return String(a);
}

interface QVProps { q: Question; value: Answer; onChange: (a: Answer) => void; disabled?: boolean; reveal?: boolean; seed: number }

/** Renders one question. Options are shuffled per attempt so positions cannot be memorised. */
export function QuestionView({ q, value, onChange, disabled, reveal, seed }: QVProps) {
  const rnd = useMemo(() => mulberry32(seed + q.id.length * 131 + q.prompt.length), [seed, q.id, q.prompt]);
  const options = useMemo(() => (q.type === 'mcq' ? shuffle(q.options, rnd) : []), [q, rnd]);
  const rights = useMemo(() => (q.type === 'match' ? shuffle(q.pairs.map((p) => p[1]), rnd) : []), [q, rnd]);
  const startOrder = useMemo(() => {
    if (q.type !== 'order') return [];
    let s = shuffle(q.items, rnd);
    if (s.every((x, i) => x === q.items[i])) s = [...s.slice(1), s[0]];
    return s;
  }, [q, rnd]);
  useEffect(() => { if (q.type === 'order' && value === undefined) onChange(startOrder); }, [q, value, startOrder, onChange]);

  const mark = (isRight: boolean, chosen: boolean) => (reveal ? (isRight ? ' right' : chosen ? ' wrong' : '') : chosen ? ' chosen' : '');

  return (
    <div className="question">
      <div className="q-meta"><Chip tone={q.label === 'Scenario-based training question' ? 'accent' : 'default'}>{q.label ?? 'Original practice question'}</Chip>{q.topic && <span className="small muted">{q.topic}</span>}</div>
      <p className="q-prompt">{q.prompt}</p>

      {q.type === 'mcq' && (
        <div className="options" role="radiogroup" aria-label="Answer options">
          {options.map((o) => (
            <button key={o} type="button" role="radio" aria-checked={value === o} disabled={disabled} className={`option${mark(o === q.options[0], value === o)}`} onClick={() => onChange(o)}>
              <span className="option-dot" />{o}
            </button>
          ))}
        </div>
      )}

      {q.type === 'tf' && (
        <div className="options two" role="radiogroup" aria-label="True or false">
          {[true, false].map((b) => (
            <button key={String(b)} type="button" role="radio" aria-checked={value === b} disabled={disabled} className={`option${mark(b === q.answer, value === b)}`} onClick={() => onChange(b)}>
              <span className="option-dot" />{b ? 'True' : 'False'}
            </button>
          ))}
        </div>
      )}

      {q.type === 'num' && (
        <label className="num-input">
          <span className="sr-only">Your answer</span>
          <input type="text" inputMode="decimal" autoComplete="off" disabled={disabled} value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''} placeholder="Type a number" onChange={(e) => onChange(e.target.value)}
            className={reveal ? (isCorrect(q, value) ? 'right' : 'wrong') : ''} />
          {q.unit && <span className="unit">{q.unit}</span>}
        </label>
      )}

      {q.type === 'order' && Array.isArray(value) && (
        <ol className="order-list">
          {value.map((item, i) => (
            <li key={item} className={reveal ? (item === q.items[i] ? 'right' : 'wrong') : ''}>
              <span className="order-n">{i + 1}</span><span className="order-text">{item}</span>
              <span className="order-btns">
                <button type="button" disabled={disabled || i === 0} aria-label={`Move "${item}" up`} onClick={() => { const a = [...value]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; onChange(a); }}><Icon name="up" size={16} /></button>
                <button type="button" disabled={disabled || i === value.length - 1} aria-label={`Move "${item}" down`} onClick={() => { const a = [...value]; [a[i + 1], a[i]] = [a[i], a[i + 1]]; onChange(a); }}><Icon name="down" size={16} /></button>
              </span>
            </li>
          ))}
        </ol>
      )}

      {q.type === 'match' && (
        <div className="match-list">
          {q.pairs.map(([left, right]) => {
            const v = ((value as Record<string, string>) ?? {})[left] ?? '';
            return (
              <label key={left} className={`match-row${reveal ? (v === right ? ' right' : ' wrong') : ''}`}>
                <span className="match-left">{left}</span>
                <select disabled={disabled} value={v} onChange={(e) => onChange({ ...((value as Record<string, string>) ?? {}), [left]: e.target.value })} aria-label={`Match for ${left}`}>
                  <option value="">Choose…</option>
                  {rights.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Feedback({ q, ok }: { q: Question; ok: boolean }) {
  return (
    <div className={`feedback ${ok ? 'ok' : 'bad'}`} role="status">
      <strong>{ok ? 'Correct.' : 'Not quite.'}</strong>
      {!ok && <div>Correct answer: <strong>{correctAnswerText(q)}</strong></div>}
      <div>{q.explain}</div>
    </div>
  );
}

interface RunnerProps {
  questions: Question[];
  onFinish: (score: number, correct: number) => void;
  finishLabel?: string;
  onQuestion?: (q: Question) => void;
  onWrong?: (q: Question, given: string) => void;
  hints?: boolean;
}

/** Practice mode: one question at a time with immediate explanation. */
export function QuizRunner({ questions, onFinish, finishLabel = 'Finish', onQuestion, onWrong, hints = true }: RunnerProps) {
  const p = useProgress();
  const [i, setI] = useState(0);
  const [value, setValue] = useState<Answer>(undefined);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [seed] = useState(() => Math.floor(Math.random() * 1e6));
  const q = questions[i];
  useEffect(() => { if (q) onQuestion?.(q); }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!q) return <p className="muted">No questions are available.</p>;
  const ok = checked && isCorrect(q, value);
  const check = () => {
    const right = isCorrect(q, value);
    setChecked(true);
    if (right) setCorrect((c) => c + 1); else onWrong?.(q, answerText(q, value));
    audio.sfx(right ? 'ok' : 'bad');
    actions.answer(q, right);
  };
  const next = () => {
    if (i + 1 >= questions.length) { onFinish(correct / questions.length, correct); return; }
    setI(i + 1); setValue(undefined); setChecked(false); setShowHint(false);
  };
  const saved = p.savedQuestions.includes(q.id);

  return (
    <div className="runner">
      <div className="runner-top">
        <span className="small muted">Question {i + 1} of {questions.length}</span>
        <button type="button" className={`icon-btn${saved ? ' on' : ''}`} aria-pressed={saved} aria-label={saved ? 'Remove from saved questions' : 'Save this question'} onClick={() => actions.toggle('savedQuestions', q.id)}><Icon name="bookmark" size={18} fill={saved} /></button>
      </div>
      <Bar value={(i + (checked ? 1 : 0)) / questions.length} label="Questions completed" />
      <QuestionView key={q.id + i} q={q} value={value} onChange={setValue} disabled={checked} reveal={checked} seed={seed + i} />
      {showHint && !checked && <div className="hint"><Icon name="tutor" size={16} /> {q.hint ?? 'Write down what is given and what is asked, then find the matching idea in the lesson.'}</div>}
      {checked && <Feedback q={q} ok={ok} />}
      <div className="row gap">
        {!checked && hints && <Btn kind="ghost" onClick={() => setShowHint(true)} icon="tutor">Give me a hint</Btn>}
        {!checked && <Btn onClick={check} disabled={!isAnswered(q, value)}>Check answer</Btn>}
        {checked && <Btn onClick={next} icon="arrow">{i + 1 >= questions.length ? finishLabel : 'Next question'}</Btn>}
      </div>
    </div>
  );
}
