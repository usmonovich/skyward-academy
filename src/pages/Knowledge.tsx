import { useMemo, useState } from 'react';
import type { Question } from '../types';
import { actions, useProgress } from '../store/progress';
import { ENCYCLOPEDIA, FORMULAS, GAME_AIRCRAFT, LIVERIES, findLesson, getTerms, questionById } from '../content';
import { GRADES, isDue } from '../engine/srs';
import { dueCards, revisionLessons, weakTopics } from '../engine/personalize';
import { canSpeak, speak } from '../engine/speech';
import { AircraftArt, Bar, Btn, Chip, Empty, Icon, PageHead, Tabs } from '../components/ui';
import { FormulaLab } from '../components/Labs';
import { QuizRunner } from '../components/Quiz';

const TABS = [['dictionary', 'Dictionary'], ['flashcards', 'Flashcards'], ['formulas', 'Formulas'], ['aircraft', 'Aircraft'], ['cockpit', 'Cockpit'], ['revision', 'Revision']] as const;
type Tab = (typeof TABS)[number][0];

/* -------------------------------------------------------------- Dictionary */
function Dictionary() {
  const p = useProgress();
  const terms = getTerms();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState<string | null>(null);
  const cats = ['All', 'Favourites', ...new Set(terms.map((t) => t.cat))];
  const list = terms.filter((t) => (cat === 'All' || (cat === 'Favourites' ? p.favTerms.includes(t.id) : t.cat === cat)) && (q === '' || `${t.term} ${t.def}`.toLowerCase().includes(q.toLowerCase())));
  return (
    <div className="stack">
      <div className="toolbar">
        <label className="search"><Icon name="search" size={18} /><span className="sr-only">Search the dictionary</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${terms.length} aviation terms`} /></label>
        <label><span className="sr-only">Category</span><select value={cat} onChange={(e) => setCat(e.target.value)}>{cats.map((c) => <option key={c}>{c}</option>)}</select></label>
      </div>
      {list.length === 0 && <Empty>No terms match your search. Try a shorter word, or choose “All”.</Empty>}
      <ul className="terms">
        {list.map((t) => {
          const fav = p.favTerms.includes(t.id); const card = !!p.cards[t.id]; const isOpen = open === t.id;
          return (
            <li key={t.id} className={`term${isOpen ? ' open' : ''}`}>
              <button type="button" className="term-head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : t.id)}>
                <span><strong>{t.term}</strong><span className="small muted"> · {t.cat}</span></span><span className="term-def">{t.def}</span>
              </button>
              {isOpen && (
                <div className="term-body">
                  <p><strong>Technical explanation:</strong> {t.tech}</p>
                  <p><strong>Example:</strong> “{t.example}”</p>
                  <p><strong>Aviation context:</strong> {t.context}</p>
                  {t.related.length > 0 && <p className="row gap wrap"><strong>Related:</strong>{t.related.map((r) => { const rt = terms.find((x) => x.id === r); return rt ? <button key={r} type="button" className="pill" onClick={() => { setQ(''); setCat('All'); setOpen(r); }}>{rt.term}</button> : null; })}</p>}
                  <div className="row gap wrap">
                    {canSpeak() && <Btn small kind="soft" icon="sound" onClick={() => speak(t.term.replace(/\(.*\)/, ''), { rate: 0.9 })}>Pronounce</Btn>}
                    <Btn small kind={fav ? 'accent' : 'soft'} icon="heart" onClick={() => actions.toggle('favTerms', t.id)}>{fav ? 'Saved to Favourites' : 'Save to Favourites'}</Btn>
                    <Btn small kind={card ? 'ghost' : 'soft'} icon="cards" onClick={() => (card ? actions.removeCard(t.id) : actions.addCard(t.id))}>{card ? 'Remove from Flashcards' : 'Add to Flashcards'}</Btn>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------- Flashcards */
function Flashcards() {
  const p = useProgress();
  const terms = getTerms();
  const cats = [...new Set(terms.map((t) => t.cat))];
  const [deck, setDeck] = useState('due');
  const [queue, setQueue] = useState<string[] | null>(null);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const due = dueCards(p);
  const mine = Object.keys(p.cards);
  const deckIds = (d: string) => d === 'due' ? due : d === 'mine' ? mine : d === 'fav' ? p.favTerms : terms.filter((t) => t.cat === d).map((t) => t.id);
  const start = () => { setQueue(deckIds(deck).slice(0, 20)); setI(0); setFlipped(false); };

  if (queue) {
    const term = terms.find((t) => t.id === queue[i]);
    if (!term) return (
      <div className="card center"><h3>Session complete</h3><p className="muted">You reviewed {queue.length} card{queue.length === 1 ? '' : 's'}. Each card is scheduled again according to how well you remembered it.</p><Btn kind="accent" onClick={() => setQueue(null)}>Back to decks</Btn></div>
    );
    return (
      <div className="stack">
        <div className="row between"><span className="small muted">Card {i + 1} of {queue.length}</span><Btn small kind="ghost" onClick={() => setQueue(null)}>End session</Btn></div>
        <Bar value={i / queue.length} label="Session progress" />
        <button type="button" className={`flashcard${flipped ? ' flipped' : ''}`} onClick={() => setFlipped(!flipped)} aria-label={flipped ? 'Show the term' : 'Show the explanation'}>
          <span className="flash-inner">
            <span className="flash-face flash-front"><span className="small">{term.cat}</span><strong>{term.term}</strong><span className="small">Select to reveal the explanation</span></span>
            <span className="flash-face flash-back"><strong>{term.term}</strong><span>{term.def}</span><span className="small">{term.tech}</span><span className="small">“{term.example}”</span></span>
          </span>
        </button>
        <div className="row gap wrap center">
          {canSpeak() && <Btn small kind="ghost" icon="sound" onClick={() => speak(flipped ? `${term.term}. ${term.def}` : term.term, { rate: 0.95 })}>Listen</Btn>}
          <Btn small kind="ghost" icon="heart" onClick={() => actions.toggle('favTerms', term.id)}>{p.favTerms.includes(term.id) ? 'Favourite ✓' : 'Favourite'}</Btn>
        </div>
        {flipped ? (
          <div className="grades" role="group" aria-label="How well did you remember it?">
            {GRADES.map((g) => <button key={g.label} type="button" className={`grade grade-${g.label.toLowerCase()}`} onClick={() => { actions.reviewCard(term.id, g.q); setI(i + 1); setFlipped(false); }}>{g.label}<span className="small">{g.q < 3 ? 'in 10 min' : g.q === 3 ? 'short interval' : g.q === 4 ? 'normal interval' : 'long interval'}</span></button>)}
          </div>
        ) : <p className="small muted center">Recall the meaning first, then reveal the card and rate your memory.</p>}
      </div>
    );
  }

  return (
    <div className="stack">
      <div className="stats">
        <div className="stat"><Icon name="cards" /><div><strong>{mine.length}</strong><span>Cards in your collection</span></div></div>
        <div className="stat"><Icon name="clock" /><div><strong>{due.length}</strong><span>Due for review now</span></div></div>
        <div className="stat"><Icon name="check" /><div><strong>{p.cardReviews}</strong><span>Total reviews</span></div></div>
        <div className="stat"><Icon name="star" /><div><strong>{mine.filter((id) => p.cards[id].reps >= 3).length}</strong><span>Well-learned cards</span></div></div>
      </div>
      <div className="card">
        <h3>Choose a deck</h3>
        <div className="pill-row" role="group" aria-label="Decks">
          {[['due', `Due now (${due.length})`], ['mine', `My cards (${mine.length})`], ['fav', `Favourites (${p.favTerms.length})`], ...cats.map((c) => [c, `${c} (${terms.filter((t) => t.cat === c).length})`])].map(([id, name]) => <button key={id} type="button" className={`pill${deck === id ? ' on' : ''}`} aria-pressed={deck === id} onClick={() => setDeck(id)}>{name}</button>)}
        </div>
        {deckIds(deck).length === 0 ? <Empty>{deck === 'due' ? 'No cards are due. Study a topic deck below, or add terms from the Dictionary.' : 'This deck is empty. Add terms from the Dictionary with “Add to Flashcards”.'}</Empty>
          : <Btn kind="accent" icon="play" onClick={start}>Study {Math.min(20, deckIds(deck).length)} card{deckIds(deck).length === 1 ? '' : 's'}</Btn>}
        <p className="small muted">Scheduling uses the SM-2 spaced-repetition algorithm: a card you remember returns after 1 day, then 6 days, then at growing intervals; a card you forget returns in 10 minutes. Topic decks add the cards you review to your collection. “My cards” is your custom deck — build it from the Dictionary.</p>
      </div>
      {mine.length > 0 && (
        <div className="card">
          <h3>Review schedule</h3>
          <ul className="schedule">{mine.slice(0, 12).map((id) => { const t = terms.find((x) => x.id === id); const c = p.cards[id]; return t ? <li key={id}><span>{t.term}</span><span className="small muted">{isDue(c) ? 'Due now' : `Due ${new Date(c.due).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`} · interval {c.interval} d · ease {c.ef.toFixed(2)}</span></li> : null; })}</ul>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Formulas */
function Formulas() {
  const p = useProgress();
  const [q, setQ] = useState('');
  const [subject, setSubject] = useState('All');
  const [level, setLevel] = useState(0);
  const [favOnly, setFavOnly] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const list = FORMULAS.filter((f) => (subject === 'All' || f.subject === subject) && (!level || f.level === level) && (!favOnly || p.favFormulas.includes(f.id)) && `${f.name} ${f.topic} ${f.expr} ${f.aviation}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="stack">
      <div className="toolbar">
        <label className="search"><Icon name="search" size={18} /><span className="sr-only">Search formulas</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, topic or aviation use" /></label>
        <label><span className="sr-only">Subject</span><select value={subject} onChange={(e) => setSubject(e.target.value)}>{['All', 'Mathematics', 'Physics', 'Aviation'].map((s) => <option key={s}>{s}</option>)}</select></label>
        <label><span className="sr-only">Difficulty</span><select value={level} onChange={(e) => setLevel(Number(e.target.value))}><option value={0}>Any difficulty</option><option value={1}>Foundation</option><option value={2}>Intermediate</option><option value={3}>Advanced</option></select></label>
        <label className="check"><input type="checkbox" checked={favOnly} onChange={(e) => setFavOnly(e.target.checked)} /> Favourites</label>
      </div>
      {list.length === 0 && <Empty>No formulas match these filters.</Empty>}
      {list.map((f) => {
        const isOpen = open === f.id; const fav = p.favFormulas.includes(f.id); const lesson = f.lessonId ? findLesson(f.lessonId)?.lesson : undefined;
        return (
          <div key={f.id} className="card formula-item">
            <button type="button" className="formula-head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : f.id)}>
              <span><strong>{f.name}</strong><span className="small muted"> · {f.subject} · {f.topic}</span></span><code className="fx big">{f.expr}</code>
            </button>
            {isOpen && (
              <div className="stack-sm">
                <p>{f.plain}</p>
                <ul className="vars"><li><code className="fx">{f.out.sym}</code> = {f.out.name}{f.out.unit && ` — ${f.out.unit}`}</li>{f.vars.map((v) => <li key={v.sym}><code className="fx">{v.sym}</code> = {v.name}{v.unit && ` — ${v.unit}`}</li>)}</ul>
                {f.altUnits && <p className="small"><strong>Other units:</strong> {f.altUnits}</p>}
                <p className="small"><strong>Valid when:</strong> {f.valid}</p>
                <div className="grid-3">
                  <div className="mini"><strong>Worked example</strong><p>{f.example}</p></div>
                  <div className="mini"><strong>Everyday example</strong><p>{f.real}</p></div>
                  <div className="mini"><strong>In aviation</strong><p>{f.aviation}</p></div>
                </div>
                <p className="small"><strong>Common mistakes:</strong> {f.mistakes.join(' ')}</p>
                <FormulaLab formula={f} />
                <div className="row gap wrap">
                  <Btn small kind={fav ? 'accent' : 'soft'} icon="heart" onClick={() => actions.toggle('favFormulas', f.id)}>{fav ? 'In Favourites' : 'Add to Favourites'}</Btn>
                  {lesson && <Btn small kind="soft" icon="book" href={`lesson/${lesson.id}`}>Lesson and practice: {lesson.title}</Btn>}
                  {f.related.map((r) => { const rf = FORMULAS.find((x) => x.id === r); return rf ? <button key={r} type="button" className="pill" onClick={() => { setQ(''); setSubject('All'); setLevel(0); setFavOnly(false); setOpen(r); }}>Related: {rf.name}</button> : null; })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- Aircraft */
function Aircraft() {
  const p = useProgress();
  const livery = LIVERIES.find((l) => l.id === p.livery)?.color ?? LIVERIES[0].color;
  return (
    <div className="stack">
      <p className="muted">Educational profiles of well-known aircraft types. Illustrations are original generic drawings, not scale images of the real aircraft.</p>
      {ENCYCLOPEDIA.map((e) => (
        <div key={e.id} className="card enc">
          <div className="enc-art"><AircraftArt ac={GAME_AIRCRAFT.find((a) => a.id === e.art) ?? GAME_AIRCRAFT[0]} color={livery} width={190} /><span className="small muted">Generic illustration</span></div>
          <div className="stack-sm grow">
            <div><h3>{e.name}</h3><Chip tone="navy">{e.category}</Chip></div>
            <p>{e.summary}</p>
            <div className="grid-3">
              <div className="mini"><strong>Basic specifications</strong><table className="spec"><tbody>{e.specs.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody></table></div>
              <div className="mini"><strong>Main components</strong><ul>{e.components.map((c) => <li key={c}>{c}</li>)}</ul></div>
              <div className="mini"><strong>Relevant systems</strong><ul>{e.systems.map((c) => <li key={c}>{c}</li>)}</ul></div>
            </div>
            <p className="row gap wrap"><strong className="small">Related lessons:</strong>{e.lessons.map((id) => { const l = findLesson(id)?.lesson; return l ? <a key={id} className="pill" href={`#/lesson/${id}`}>{l.title}</a> : null; })}</p>
            <p className="small muted">{e.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- Cockpit */
const INSTRUMENTS = [
  { id: 'asi', name: 'Airspeed Indicator', short: 'ASI', text: 'Shows indicated airspeed in knots. It measures dynamic pressure: pitot pressure minus static pressure. Coloured arcs mark flap, normal and caution speed ranges.', needs: 'Pitot tube and static port' },
  { id: 'ai', name: 'Attitude Indicator', short: 'AI', text: 'Shows the aircraft\'s pitch and bank relative to the horizon using a gyroscope. It is the central instrument for flight without outside visual reference.', needs: 'Gyroscope (vacuum or electric)' },
  { id: 'alt', name: 'Altimeter', short: 'ALT', text: 'Shows altitude by measuring static pressure. The pilot sets a reference pressure (QNH, QFE or standard) in the subscale window.', needs: 'Static port' },
  { id: 'tc', name: 'Turn Coordinator', short: 'TC', text: 'Shows the rate of turn and, with the balance ball, whether the turn is coordinated. "Step on the ball" to correct slip or skid.', needs: 'Gyroscope (usually electric)' },
  { id: 'hi', name: 'Heading Indicator', short: 'HI', text: 'Shows the aircraft\'s heading using a gyroscope. It drifts slowly and must be re-aligned with the magnetic compass at regular intervals.', needs: 'Gyroscope (vacuum or electric)' },
  { id: 'vsi', name: 'Vertical Speed Indicator', short: 'VSI', text: 'Shows the rate of climb or descent in feet per minute by measuring how quickly static pressure changes.', needs: 'Static port' },
];
function Cockpit() {
  const [sel, setSel] = useState('asi');
  const ins = INSTRUMENTS.find((x) => x.id === sel)!;
  return (
    <div className="card">
      <div className="card-head"><h3>Cockpit explorer: the six basic flight instruments</h3><Chip>Simplified panel</Chip></div>
      <div className="lab-grid">
        <svg viewBox="0 0 330 230" className="lab-svg" role="group" aria-label="Instrument panel">
          <rect width="330" height="230" rx="14" fill="#1b2b3f" />
          {INSTRUMENTS.map((x, i) => {
            const cx = 60 + (i % 3) * 105; const cy = 62 + Math.floor(i / 3) * 106;
            return (
              <g key={x.id} className="inst" tabIndex={0} role="button" aria-label={x.name} aria-pressed={sel === x.id} onClick={() => setSel(x.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(x.id); } }}>
                <circle cx={cx} cy={cy} r="44" fill="#0b1626" stroke={sel === x.id ? '#f58220' : '#56708f'} strokeWidth={sel === x.id ? 5 : 3} />
                {x.id === 'ai' ? <><path d={`M${cx - 38} ${cy} A38 38 0 0 1 ${cx + 38} ${cy} Z`} fill="#3a8dde" /><path d={`M${cx - 38} ${cy} A38 38 0 0 0 ${cx + 38} ${cy} Z`} fill="#8a5a2b" /><line x1={cx - 20} y1={cy} x2={cx + 20} y2={cy} stroke="#ffcf4d" strokeWidth="4" /></> : <line x1={cx} y1={cy} x2={cx + [26, 0, -18, 20, 0, 28][i]} y2={cy + [-20, 0, -26, 16, -30, -6][i]} stroke="#fff" strokeWidth="3" strokeLinecap="round" />}
                <circle cx={cx} cy={cy} r="3.500" fill="#fff" />
                <text x={cx} y={cy + 30} textAnchor="middle" fontSize="11" fontWeight="700" fill="#9fc3ea">{x.short}</text>
              </g>
            );
          })}
        </svg>
        <div className="lab-controls">
          <h4>{ins.name}</h4>
          <p>{ins.text}</p>
          <p className="small"><strong>Depends on:</strong> {ins.needs}</p>
          <p className="small muted">Select any instrument on the panel. Layouts and instrument types vary between aircraft; modern aircraft show the same information on electronic displays.</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Revision */
function Revision() {
  const p = useProgress();
  const [session, setSession] = useState<Question[] | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const mistakes = useMemo(() => p.mistakes.map((m) => questionById(m.qid)).filter((q): q is Question => !!q), [p.mistakes]);
  const savedQ = p.savedQuestions.map((id) => questionById(id)).filter((q): q is Question => !!q);
  const weak = weakTopics(p);
  const rev = revisionLessons(p);
  const due = dueCards(p).length;
  if (session) return <div className="card"><QuizRunner questions={session} finishLabel="Finish revision" onFinish={(_, c) => { setDone(`${c} of ${session.length} correct. Questions you answered correctly have left your mistake queue.`); setSession(null); }} /></div>;
  return (
    <div className="stack">
      {done && <div className="feedback ok" role="status">{done}</div>}
      <div className="grid-2">
        <div className="card"><div className="card-head"><h3>Mistake review</h3><Chip tone={mistakes.length ? 'warn' : 'ok'}>{mistakes.length} in queue</Chip></div>
          <p className="muted">Every question you answer incorrectly is collected here automatically until you get it right.</p>
          {mistakes.length ? <Btn kind="accent" icon="refresh" onClick={() => { setDone(null); setSession(mistakes.slice(0, 10)); }}>Retry {Math.min(10, mistakes.length)} question{mistakes.length === 1 ? '' : 's'}</Btn> : <Empty>No mistakes waiting. Well done.</Empty>}</div>
        <div className="card"><div className="card-head"><h3>Flashcards due</h3><Chip tone={due ? 'accent' : 'ok'}>{due}</Chip></div>
          <p className="muted">Spaced repetition works best when you review cards on the day they become due.</p>
          <Btn kind="soft" icon="cards" href="knowledge/flashcards">Open flashcards</Btn></div>
      </div>
      <div className="grid-2">
        <div className="card"><h3>Weak subjects</h3>
          {weak.length ? <ul className="weak">{weak.map((t) => <li key={t.topic}><span>{t.topic}</span><Bar value={t.pct} color="#f58220" label={`${t.topic} accuracy`} /><span className="small muted">{Math.round(t.pct * 100)}% of {t.total}</span></li>)}</ul> : <Empty>No weak topics detected yet. Topics appear here when your accuracy is below 70% over at least three questions.</Empty>}</div>
        <div className="card"><h3>Recommended revision</h3>
          {rev.length ? <ul className="plan">{rev.map((id) => { const l = findLesson(id)?.lesson; return l ? <li key={id}><a href={`#/lesson/${id}`}><span className="plan-min">{l.minutes} min</span><span>{l.title}{!p.lessons[id]?.passed && ' — prerequisite'}</span><Icon name="arrow" size={16} /></a></li> : null; })}</ul> : <Empty>Recommendations appear when you miss several questions from the same lesson. Prerequisite lessons are suggested first.</Empty>}</div>
      </div>
      <div className="grid-2">
        <div className="card"><div className="card-head"><h3>Saved questions</h3><span className="small muted">{savedQ.length}</span></div>
          {savedQ.length ? <><ul className="schedule">{savedQ.slice(0, 6).map((q) => <li key={q.id}><span>{q.prompt}</span></li>)}</ul><Btn small kind="soft" onClick={() => { setDone(null); setSession(savedQ); }}>Practise saved questions</Btn></> : <Empty>Use the bookmark on any practice question to save it here.</Empty>}</div>
        <div className="card"><h3>Recently studied and saved lessons</h3>
          {p.recent.length + p.savedLessons.length ? <ul className="plan">{[...new Set([...p.savedLessons, ...p.recent])].slice(0, 7).map((id) => { const l = findLesson(id)?.lesson; return l ? <li key={id}><a href={`#/lesson/${id}`}><span className="plan-min">{p.savedLessons.includes(id) ? 'Saved' : 'Recent'}</span><span>{l.title}</span><Icon name="arrow" size={16} /></a></li> : null; })}</ul> : <Empty>Lessons you open or save will be listed here.</Empty>}</div>
      </div>
      <div className="card"><div className="card-head"><h3>Practice examinations</h3><Btn small kind="accent" href="exams" icon="exam">Open Exam Center</Btn></div>
        <p className="muted">{p.exams.length ? `Last exam: ${p.exams[0].pool}, ${p.exams[0].correct}/${p.exams[0].total} on ${new Date(p.exams[0].date).toLocaleDateString('en-GB')}.` : 'You have not taken a practice exam yet. Try a short 10-question exam on a subject you have studied.'}</p></div>
    </div>
  );
}

export function Knowledge({ tab }: { tab?: string }) {
  const current = (TABS.find(([id]) => id === tab)?.[0] ?? 'dictionary') as Tab;
  return (
    <div className="stack">
      <PageHead title="Pilot Knowledge Hub" sub="Dictionary, flashcards, formulas, aircraft and your personal revision centre." right={<Btn kind="soft" href="exams" icon="exam">Exam Center</Btn>} />
      <Tabs tabs={TABS} value={current} onChange={(t) => { window.location.hash = `#/knowledge/${t}`; }} />
      {current === 'dictionary' && <Dictionary />}
      {current === 'flashcards' && <Flashcards />}
      {current === 'formulas' && <Formulas />}
      {current === 'aircraft' && <Aircraft />}
      {current === 'cockpit' && <Cockpit />}
      {current === 'revision' && <Revision />}
    </div>
  );
}
