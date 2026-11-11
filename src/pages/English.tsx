import { useEffect, useMemo, useRef, useState } from 'react';
import { actions, useProgress } from '../store/progress';
import { ATC_SCENARIOS, CALLSIGN, EN_EXERCISES, EN_STAGES, ICAO_DIMENSIONS, LISTENING, PHONETIC, type AtcScenario, type EnglishExercise } from '../content';
import { controllerTurn, dimensionFeedback, evaluate, languageNotes, type TurnLog } from '../engine/atc';
import { parseNum, shuffle } from '../engine/assessment';
import { XP } from '../engine/gamification';
import { audio } from '../engine/audio';
import { canListen, canSpeak, listen, speak, stopSpeaking } from '../engine/speech';
import { Bar, Btn, Chip, Icon, PageHead, Slider } from '../components/ui';
import { QuizRunner } from '../components/Quiz';

function Done({ id, score, detail, onAgain }: { id: string; score: number; detail: string; onAgain: () => void }) {
  return (
    <div className="card center">
      <h3>{score >= 0.6 ? 'Exercise complete' : 'Keep practising'}</h3>
      <p className="big-number">{Math.round(score * 100)}%</p>
      <p className="muted">{detail}</p>
      <div className="row gap wrap center"><Btn kind="soft" icon="refresh" onClick={onAgain}>Try again</Btn><Btn kind="accent" href="english">Back to Aviation English</Btn></div>
      <p className="small muted">Exercise id: {id}. Scores are training feedback only.</p>
    </div>
  );
}

/* ------------------------------------------------------ Phonetic alphabet */
function Alphabet({ ex }: { ex: EnglishExercise }) {
  const p = useProgress();
  const [run, setRun] = useState(0);
  const rounds = useMemo(() => shuffle(PHONETIC).slice(0, 12).map(([letter, word]) => ({ letter, word, options: shuffle([word, ...shuffle(PHONETIC.filter((x) => x[1] !== word)).slice(0, 3).map((x) => x[1])]) })), [run]); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  if (i >= rounds.length) return <Done id={ex.id} score={correct / rounds.length} detail={`${correct} of ${rounds.length} letters correct.`} onAgain={() => { setRun(run + 1); setI(0); setCorrect(0); setPicked(null); }} />;
  const r = rounds[i];
  const pick = (o: string) => {
    if (picked) return;
    setPicked(o);
    const ok = o === r.word;
    if (ok) setCorrect(correct + 1);
    audio.sfx(ok ? 'ok' : 'bad');
    if (p.settings.voice) speak(r.word, { rate: p.settings.speechRate });
    if (i + 1 === rounds.length) actions.english(ex.id, (correct + (ok ? 1 : 0)) / rounds.length, XP.englishExercise);
  };
  return (
    <div className="card center">
      <span className="small muted">Letter {i + 1} of {rounds.length}</span>
      <Bar value={i / rounds.length} label="Exercise progress" />
      <div className="big-letter" aria-label={`Letter ${r.letter}`}>{r.letter}</div>
      <p>Which word is used for this letter in radiotelephony?</p>
      <div className="options two">{r.options.map((o) => <button key={o} type="button" className={`option${picked ? (o === r.word ? ' right' : o === picked ? ' wrong' : '') : ''}`} disabled={!!picked} onClick={() => pick(o)}><span className="option-dot" />{o}</button>)}</div>
      {picked && <div className="row gap center"><span className={picked === r.word ? 'ok-text' : 'bad-text'}>{picked === r.word ? 'Correct.' : `The word is ${r.word}.`}</span><Btn onClick={() => { setI(i + 1); setPicked(null); }} icon="arrow">Next</Btn></div>}
    </div>
  );
}

/* --------------------------------------------------------- Numbers by ear */
const D = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'niner'];
const say = (s: string) => s.split('').map((c) => (c === '.' ? 'decimal' : D[Number(c)])).join(' ');
function makeNumber(kind: number) {
  const r = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
  switch (kind % 5) {
    case 0: { const h = String(r(1, 36) * 10).padStart(3, '0'); return { label: 'Type the heading you hear (three digits)', spoken: `Turn left heading ${say(h)}`, answer: Number(h), show: h }; }
    case 1: { const fl = r(5, 39) * 10; return { label: 'Type the flight level you hear', spoken: `Climb flight level ${say(String(fl))}`, answer: fl, show: String(fl) }; }
    case 2: { const f = `1${r(18, 35)}.${r(0, 9)}`; return { label: 'Type the frequency you hear', spoken: `Contact Tower ${say(f)}`, answer: Number(f), show: f }; }
    case 3: { const q = r(985, 1035); return { label: 'Type the QNH you hear', spoken: `QNH ${say(String(q))}`, answer: q, show: String(q) }; }
    default: { const th = r(1, 9); const h = r(0, 1) * 5; return { label: 'Type the altitude you hear, in feet', spoken: `Descend to altitude ${D[th]} thousand${h ? ' five hundred' : ''} feet`, answer: th * 1000 + h * 100, show: `${th * 1000 + h * 100}` }; }
  }
}

function Numbers({ ex }: { ex: EnglishExercise }) {
  const p = useProgress();
  const [run, setRun] = useState(0);
  const rounds = useMemo(() => shuffle([0, 1, 2, 3, 4, 0, 1, 2]).map(makeNumber), [run]); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [text, setText] = useState(false);
  const r = rounds[i];
  const play = () => { audio.sfx('radio'); speak(r.spoken.replace(/niner/g, 'niner'), { rate: p.settings.speechRate * 0.95, voice: i }); };
  useEffect(() => { if (r && canSpeak()) play(); return stopSpeaking; }, [i, run]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!r) return <Done id={ex.id} score={correct / rounds.length} detail={`${correct} of ${rounds.length} numbers understood correctly.`} onAgain={() => { setRun(run + 1); setI(0); setCorrect(0); setValue(''); setChecked(false); }} />;
  const ok = checked && Math.abs(parseNum(value) - r.answer) < 0.001;
  const check = () => {
    const right = Math.abs(parseNum(value) - r.answer) < 0.001;
    setChecked(true); audio.sfx(right ? 'ok' : 'bad');
    if (right) setCorrect(correct + 1);
    if (i + 1 === rounds.length) actions.english(ex.id, (correct + (right ? 1 : 0)) / rounds.length, XP.englishExercise);
  };
  return (
    <div className="card">
      <span className="small muted">Transmission {i + 1} of {rounds.length}</span>
      <Bar value={i / rounds.length} label="Exercise progress" />
      <p className="q-prompt">{r.label}</p>
      <div className="row gap wrap">
        <Btn kind="soft" icon="sound" onClick={play} disabled={!canSpeak()}>Play again</Btn>
        <Btn kind="ghost" onClick={() => setText(!text)}>{text ? 'Hide text' : 'Show as text'}</Btn>
      </div>
      {!canSpeak() && <p className="small muted">Speech output is not available in this browser, so the transmission is shown as text.</p>}
      {(text || !canSpeak() || checked) && <p className="transcript">“{r.spoken}”</p>}
      <form className="row gap" onSubmit={(e) => { e.preventDefault(); if (!checked && value) check(); }}>
        <label className="num-input"><span className="sr-only">Your answer</span><input type="text" inputMode="decimal" value={value} disabled={checked} onChange={(e) => setValue(e.target.value)} placeholder="Type the number" /></label>
        {!checked ? <Btn onClick={check} disabled={!value.trim()}>Check</Btn> : <Btn icon="arrow" onClick={() => { setI(i + 1); setValue(''); setChecked(false); setText(false); }}>Next</Btn>}
      </form>
      {checked && <div className={`feedback ${ok ? 'ok' : 'bad'}`}><strong>{ok ? 'Correct.' : 'Not quite.'}</strong> The number was {r.show}. In radiotelephony each digit is spoken separately, 9 is “niner”, and a decimal point is “decimal”.</div>}
    </div>
  );
}

/* --------------------------------------------------------------- Listening */
function Listening({ ex }: { ex: EnglishExercise }) {
  const p = useProgress();
  const [idx, setIdx] = useState(0);
  const [rate, setRate] = useState(0.95);
  const [radio, setRadio] = useState(true);
  const [transcript, setTranscript] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [total, setTotal] = useState({ correct: 0, n: 0 });
  const [run, setRun] = useState(0);
  const stop = useRef(false);
  useEffect(() => () => { stop.current = true; stopSpeaking(); }, []);
  const passage = LISTENING[idx];
  if (!passage) {
    const score = total.n ? total.correct / total.n : 0;
    return <Done id={ex.id} score={score} detail={`${total.correct} of ${total.n} comprehension questions correct.`} onAgain={() => { setIdx(0); setTotal({ correct: 0, n: 0 }); setRun(run + 1); }} />;
  }
  const play = () => {
    stop.current = false; setPlaying(true);
    const speakers = [...new Set(passage.lines.map((l) => l.who))];
    const next = (i: number) => {
      if (stop.current || i >= passage.lines.length) { setPlaying(false); return; }
      if (radio) audio.sfx('radio');
      speak(passage.lines[i].text, { rate, voice: speakers.indexOf(passage.lines[i].who) + idx, onEnd: () => setTimeout(() => next(i + 1), 350) });
    };
    next(0);
  };
  return (
    <div className="stack">
      <div className="card">
        <div className="card-head"><h3>Passage {idx + 1} of {LISTENING.length}: {passage.title}</h3><Chip>{passage.lines.length > 1 ? 'Conversation' : 'Broadcast'}</Chip></div>
        <div className="row gap wrap">
          {playing ? <Btn kind="soft" icon="pause" onClick={() => { stop.current = true; stopSpeaking(); setPlaying(false); }}>Stop</Btn> : <Btn kind="accent" icon="sound" onClick={play} disabled={!canSpeak()}>Play recording</Btn>}
          <Btn kind="ghost" onClick={() => setTranscript(!transcript)}>{transcript ? 'Hide transcript' : 'Show transcript'}</Btn>
          <label className="check"><input type="checkbox" checked={radio} onChange={(e) => setRadio(e.target.checked)} /> Light radio effect</label>
        </div>
        <Slider label="Speech rate" value={rate} min={0.7} max={1.3} step={0.05} onChange={setRate} format={(v) => `${Math.round(v * 100)}%`} />
        {!canSpeak() && <p className="small muted">Speech output is not available in this browser. Use the transcript instead.</p>}
        <p className="small muted">Voices and accents depend on the English voices installed on your device. The transcript is always available as a text alternative.</p>
        {(transcript || !canSpeak()) && <div className="transcript">{passage.lines.map((l, i) => <p key={i}><strong>{l.who}:</strong> {l.text}</p>)}</div>}
      </div>
      <div className="card">
        <QuizRunner key={`${idx}-${run}`} questions={passage.questions} hints={false} finishLabel={idx + 1 < LISTENING.length ? 'Next passage' : 'Finish'}
          onFinish={(_, c) => {
            const t = { correct: total.correct + c, n: total.n + passage.questions.length };
            setTotal(t); stop.current = true; stopSpeaking(); setPlaying(false); setTranscript(false);
            if (idx + 1 >= LISTENING.length) actions.english(ex.id, t.correct / t.n, XP.englishExercise);
            setIdx(idx + 1);
          }} />
      </div>
      {p.settings.voice ? null : <p className="small muted">Voice narration is switched off in your settings; listening exercises still use speech when you press Play.</p>}
    </div>
  );
}

/* ---------------------------------------------------------- ATC simulator */
interface Line { who: 'ATC' | 'You' | 'Coach' | 'Situation'; text: string; found?: string[]; missing?: string[]; notes?: string[]; model?: string }

function AtcSession({ scn, onExit }: { scn: AtcScenario; onExit: () => void }) {
  const p = useProgress();
  const [stepIdx, setStepIdx] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [lines, setLines] = useState<Line[]>([]);
  const [turns, setTurns] = useState<TurnLog[]>([]);
  const [text, setText] = useState('');
  const [meta, setMeta] = useState<{ spoken: boolean; confidence?: number; seconds?: number }>({ spoken: false });
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');
  const stopListen = useRef<() => void>(() => {});
  const started = useRef(0);
  const end = useRef<HTMLDivElement>(null);
  const step = scn.steps[stepIdx];
  const finished = stepIdx >= scn.steps.length;

  const atcSay = (t: string) => { if (p.settings.voice && canSpeak()) { audio.sfx('radio'); speak(t, { rate: p.settings.speechRate, voice: 1 }); } };
  useEffect(() => {
    const first = scn.steps[0];
    setLines(first.kind === 'readback' ? [{ who: 'ATC', text: first.atc! }] : [{ who: 'Situation', text: first.situation! }]);
    if (first.kind === 'readback') atcSay(first.atc!);
    return () => { stopSpeaking(); stopListen.current(); };
  }, [scn]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }); }, [lines]);

  const transmit = () => {
    if (!step) return;
    const ev = evaluate(step, text);
    const notes = languageNotes(text, step);
    const turn = controllerTurn(step, ev, attempt);
    actions.atcTransmission();
    setTurns((t) => [...t, { step: stepIdx, attempt, text, spoken: meta.spoken, confidence: meta.confidence, seconds: meta.seconds, ev, notes }]);
    const add: Line[] = [{ who: 'You', text: text.trim() || '(no transmission)', found: ev.found, missing: ev.missing, notes, model: turn.advance ? step.model : undefined }];
    let spoken = turn.atc;
    add.push({ who: 'ATC', text: turn.atc });
    if (turn.coach) add.push({ who: 'Coach', text: turn.coach });
    if (turn.advance) {
      const next = scn.steps[stepIdx + 1];
      if (next?.kind === 'readback' && next.atc !== turn.atc) { add.push({ who: 'ATC', text: next.atc! }); spoken += ' ' + next.atc; }
      if (next?.kind === 'request') add.push({ who: 'Situation', text: next.situation! });
      setStepIdx(stepIdx + 1); setAttempt(0);
      if (!next) {
        const all = [...turns, { step: stepIdx, attempt, text, spoken: meta.spoken, ev, notes } as TurnLog];
        const firsts = all.filter((t) => t.attempt === 0);
        actions.english(`atc:${scn.id}`, firsts.filter((t) => t.ev.complete || t.ev.onlyCallsignMissing).length / scn.steps.length, XP.atcScenario);
        actions.english('en-atc', 1, XP.englishExercise);
      }
    } else setAttempt(attempt + 1);
    setLines((l) => [...l, ...add]);
    atcSay(spoken);
    setText(''); setMeta({ spoken: false }); setError('');
  };

  const mic = () => {
    if (listening) { stopListen.current(); return; }
    setError(''); setListening(true); started.current = Date.now(); stopSpeaking();
    stopListen.current = listen({
      onResult: (t, confidence) => { setText((prev) => (prev ? prev + ' ' : '') + t); setMeta({ spoken: true, confidence, seconds: (Date.now() - started.current) / 1000 }); },
      onError: setError,
      onEnd: () => setListening(false),
    });
  };

  return (
    <div className="stack">
      <div className="card">
        <div className="card-head"><div><h3>{scn.title}</h3><p className="small muted">{scn.level} · Your call sign: {CALLSIGN}</p></div><Btn small kind="ghost" onClick={onExit} icon="back">Scenarios</Btn></div>
        <p>{scn.intro}</p>
        <div className="radio-log" aria-live="polite">
          {lines.map((l, i) => (
            <div key={i} className={`radio-line who-${l.who.toLowerCase()}`}>
              <span className="radio-who">{l.who}</span>
              <div>
                <p>{l.text}</p>
                {l.who === 'You' && (
                  <div className="radio-fb">
                    {l.found?.map((f) => <Chip key={f} tone="ok">✓ {f}</Chip>)}
                    {l.missing?.map((f) => <Chip key={f} tone="warn">Missing: {f}</Chip>)}
                    {l.notes?.map((n) => <p key={n} className="small">Language note: {n}</p>)}
                    {l.model && <p className="small"><strong>Suggested transmission:</strong> “{l.model}”</p>}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={end} />
        </div>

        {!finished && step && (
          <div className="radio-input">
            <div className="row between wrap"><Chip tone="navy">{step.style}</Chip><span className="small muted">{step.kind === 'readback' ? 'Read back the instruction' : 'Make your call'} · exchange {stepIdx + 1} of {scn.steps.length}</span></div>
            <label className="field"><span>Your transmission — review and correct the transcript before you transmit</span>
              <textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder={canListen() ? 'Press Speak, or type your transmission here' : 'Type your transmission here'} /></label>
            {meta.spoken && <p className="small muted">Transcribed by your browser{meta.confidence ? ` (recogniser confidence ${Math.round(meta.confidence * 100)}%)` : ''}. Automatic transcripts can be wrong — edit the text so it matches what you actually said.</p>}
            {error && <p className="bad-text" role="alert">{error}</p>}
            <div className="row gap wrap">
              {canListen() && <Btn kind={listening ? 'danger' : 'soft'} icon="mic" onClick={mic}>{listening ? 'Listening… press to stop' : 'Speak'}</Btn>}
              <Btn kind="accent" onClick={transmit} icon="arrow">Transmit</Btn>
              {step.kind === 'readback' && <Btn kind="ghost" icon="sound" onClick={() => atcSay(step.atc!)} disabled={!canSpeak()}>Replay ATC</Btn>}
            </div>
            <p className="small muted">{canListen() ? 'Microphone: permission is requested only when you press Speak. Audio is transcribed by your browser\'s speech service (in Chrome and Edge it is sent to the browser vendor). Skyward Academy does not record or store audio, and transcripts are discarded when you leave this page.' : 'Speech recognition is not available in this browser, so this exercise uses typed transmissions. It works fully in Chrome or Edge.'}</p>
          </div>
        )}
      </div>

      {finished && (
        <div className="card">
          <div className="card-head"><h3>Scenario complete — training feedback</h3><Chip tone="warn">Provisional · not an ICAO rating</Chip></div>
          <div className="dims">{dimensionFeedback(turns, scn.steps.length).map((d) => <div key={d.dim} className="dim"><strong>{d.dim}</strong><p>{d.note}</p></div>)}</div>
          <p className="small muted">This feedback is generated from the text of your transmissions by a rule-based checker. It cannot hear pronunciation or stress and it does not award an ICAO language proficiency level. Official assessment is carried out only by examiners approved by your aviation authority.</p>
          <div className="row gap wrap"><Btn kind="accent" onClick={onExit}>Choose another scenario</Btn><Btn kind="ghost" href="english">Back to Aviation English</Btn></div>
        </div>
      )}
    </div>
  );
}

function Atc() {
  const p = useProgress();
  const [scn, setScn] = useState<AtcScenario | null>(null);
  if (scn) return <AtcSession key={scn.id} scn={scn} onExit={() => setScn(null)} />;
  return (
    <div className="stack">
      <div className="note"><Icon name="mic" size={18} /><div><p>The virtual controller reads each transmission you make and decides what to say next: it accepts a correct readback, corrects a wrong one, repeats when you say “say again”, and moves on. Standard phraseology and plain language are labelled separately.</p><p className="small">The controller is a rule-based dialogue engine, not a generative AI model. Not yet covered: radio communication failure procedures.</p></div></div>
      <div className="mission-grid">
        {ATC_SCENARIOS.map((s) => {
          const st = p.english[`atc:${s.id}`];
          return (
            <div key={s.id} className="mission-card plain">
              <div className="mission-body">
                <div className="row between"><strong>{s.title}</strong>{st && <Chip tone="ok">Best {Math.round(st.best * 100)}%</Chip>}</div>
                <p className="small">{s.intro}</p>
                <p className="small muted">{s.level} · {s.steps.length} exchanges</p>
                <Btn small kind="accent" icon="play" onClick={() => setScn(s)}>Start scenario</Btn>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuizExercise({ ex }: { ex: EnglishExercise }) {
  const [res, setRes] = useState<{ score: number; correct: number } | null>(null);
  const [run, setRun] = useState(0);
  if (res) return <Done id={ex.id} score={res.score} detail={`${res.correct} of ${ex.questions!.length} correct.`} onAgain={() => { setRes(null); setRun(run + 1); }} />;
  return <div className="card"><QuizRunner key={run} questions={ex.questions!} onFinish={(score, correct) => { actions.english(ex.id, score, XP.englishExercise); setRes({ score, correct }); }} /></div>;
}

export function English({ exerciseId }: { exerciseId?: string }) {
  const p = useProgress();
  const ex = EN_EXERCISES.find((e) => e.id === exerciseId);
  if (exerciseId && !ex) return <div className="card"><h2>Exercise not found</h2><Btn href="english">Back to Aviation English</Btn></div>;
  if (ex) {
    return (
      <div className="stack">
        <PageHead title={ex.title} sub={`Stage ${ex.stage} · ${EN_STAGES[ex.stage - 1].title} · about ${ex.minutes} minutes`} back="english" />
        {ex.kind === 'quiz' && <QuizExercise key={ex.id} ex={ex} />}
        {ex.kind === 'alphabet' && <Alphabet key={ex.id} ex={ex} />}
        {ex.kind === 'numbers' && <Numbers key={ex.id} ex={ex} />}
        {ex.kind === 'listening' && <Listening key={ex.id} ex={ex} />}
        {ex.kind === 'atc' && <Atc />}
      </div>
    );
  }
  const done = EN_EXERCISES.filter((e) => p.english[e.id]?.done).length;
  return (
    <div className="stack">
      <PageHead title="ICAO Aviation English" sub="From first English sentences to confident radiotelephony. A separate pathway you can study alongside pilot theory."
        right={<div className="track-meter"><strong>{done}/{EN_EXERCISES.length}</strong><span className="small muted">exercises complete</span></div>} />
      <div className="note"><Icon name="book" size={18} /><div><p>ICAO rates language proficiency in six areas: {ICAO_DIMENSIONS.join(', ')}. Level 4 (Operational) is the minimum for international operations and Level 6 is Expert. Memorising phraseology alone is not enough at any level — pilots must also handle unexpected situations in plain English.</p><p className="small">Skyward Academy provides training and provisional feedback only. It cannot issue an ICAO language endorsement.</p></div></div>
      {EN_STAGES.map((s) => {
        const list = EN_EXERCISES.filter((e) => e.stage === s.n);
        return (
          <section key={s.n} className="card module">
            <div className="card-head"><h3><span className="code">Stage {s.n}</span>{s.title}</h3><Chip tone={s.focus === 'General English' ? 'default' : 'navy'}>{s.focus}</Chip></div>
            <p className="small muted">Topics: {s.topics.join(' · ')}</p>
            {list.length ? (
              <ul className="lessons">
                {list.map((e) => { const st = p.english[e.id]; return (
                  <li key={e.id}><a className="lesson-row" href={`#/english/${e.id}`}>
                    <span className={`lesson-state${st?.done ? ' done' : ' open'}`}><Icon name={st?.done ? 'check' : e.kind === 'atc' ? 'mic' : e.kind === 'listening' || e.kind === 'numbers' ? 'sound' : 'play'} size={18} /></span>
                    <span className="grow"><strong>{e.title}</strong><span className="small muted"> · {e.minutes} min</span><br /><span className="small muted">{e.blurb}</span></span>
                    {st && <span className="small muted">Best {Math.round(st.best * 100)}%</span>}
                  </a></li>
                ); })}
              </ul>
            ) : <p className="lesson-row planned"><span className="lesson-state"><Icon name="clock" size={18} /></span><span className="grow">Interactive exercises for this stage</span><Chip>In development</Chip></p>}
          </section>
        );
      })}
    </div>
  );
}
