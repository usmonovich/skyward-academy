import { useState } from 'react';
import type { ContentStatus, Lesson, MissionDef, Term, TrackId } from '../types';
import { SOURCES, allMissions, completeness, getCms, getTracks, lessonStatus, resetCms, updateCms, useCms } from '../content';
import { LESSON_TEMPLATE, validateLesson, validateMission } from '../content/validate';
import { Btn, Chip, Empty, PageHead, Tabs } from '../components/ui';

const TABS = [['overview', 'Overview'], ['lessons', 'Lessons'], ['glossary', 'Glossary'], ['missions', 'Missions'], ['sources', 'Sources'], ['history', 'Revision history']] as const;
type Tab = (typeof TABS)[number][0];
const FLOW: ContentStatus[] = ['draft', 'review', 'approved', 'published'];
const LABEL: Record<ContentStatus, string> = { draft: 'Draft', review: 'Technical Review', approved: 'Approved', published: 'Published' };
const TONE: Record<ContentStatus, 'default' | 'warn' | 'navy' | 'ok'> = { draft: 'default', review: 'warn', approved: 'navy', published: 'ok' };

function JsonEditor({ title, initial, validate, onSave, onCancel }: { title: string; initial: unknown; validate: (v: unknown) => string[]; onSave: (v: unknown) => void; onCancel: () => void }) {
  const [text, setText] = useState(() => JSON.stringify(initial, null, 2));
  const [errors, setErrors] = useState<string[]>([]);
  const save = () => {
    let parsed: unknown;
    try { parsed = JSON.parse(text); } catch (err) { setErrors([`The text is not valid JSON: ${(err as Error).message}`]); return; }
    const problems = validate(parsed);
    setErrors(problems);
    if (!problems.length) onSave(parsed);
  };
  return (
    <div className="card">
      <div className="card-head"><h3>{title}</h3><Btn small kind="ghost" onClick={onCancel}>Cancel</Btn></div>
      <label className="field"><span>Structured content (JSON). Questions, answers and explanations are edited here.</span>
        <textarea className="code-area" rows={22} spellCheck={false} value={text} onChange={(e) => setText(e.target.value)} /></label>
      {errors.length > 0 && <div className="feedback bad" role="alert"><strong>Fix these problems before saving:</strong><ul>{errors.slice(0, 12).map((e) => <li key={e}>{e}</li>)}</ul></div>}
      <div className="row gap"><Btn kind="accent" onClick={save}>Validate and save</Btn></div>
    </div>
  );
}

export function Admin() {
  const cms = useCms();
  const [tab, setTab] = useState<Tab>('overview');
  const [edit, setEdit] = useState<{ kind: 'lesson'; lesson: Lesson; add?: { trackId: TrackId; moduleId: string } } | { kind: 'mission'; mission: MissionDef } | null>(null);
  const [msg, setMsg] = useState('');
  const [target, setTarget] = useState('physics|phys-fluids');
  const [newId, setNewId] = useState('');
  const [term, setTerm] = useState({ term: '', cat: 'Custom', def: '', tech: '', example: '', context: '' });
  const tracks = getTracks();

  const setStatus = (id: string, status: ContentStatus) => { updateCms((c) => { c.status[id] = status; }, `Status → ${LABEL[status]}`, id); setMsg(`“${id}” is now ${LABEL[status]}.`); };

  if (edit?.kind === 'lesson') {
    return <JsonEditor title={`${edit.add ? 'New lesson' : 'Edit lesson'}: ${edit.lesson.id}`} initial={edit.lesson} validate={(v) => { const e = validateLesson(v); if (edit.add && tracks.some((t) => t.modules.some((m) => m.lessons.some((l) => !l.planned && l.id === (v as Lesson)?.id)))) e.push('A lesson with this id already exists. Use Edit on that lesson instead.'); if (!edit.add && (v as Lesson)?.id !== edit.lesson.id) e.push('The id of an existing lesson cannot be changed.'); return e; }}
      onCancel={() => setEdit(null)}
      onSave={(v) => {
        const l = v as Lesson;
        // A lesson that fills in an "In development" placeholder stays in the placeholder's own module.
        const fillsPlaceholder = tracks.some((t) => t.modules.some((m) => m.lessons.some((x) => x.id === l.id)));
        updateCms((c) => { c.lessons[l.id] = l; c.status[l.id] = 'draft'; if (edit.add && !fillsPlaceholder) c.added.push({ ...edit.add, lessonId: l.id }); }, edit.add ? 'Lesson created' : 'Lesson edited', l.id, 'Returned to Draft for technical review');
        setEdit(null); setTab('lessons'); setMsg(`Saved “${l.title}” as a Draft. Move it through Technical Review and Approved to publish it to learners.`);
      }} />;
  }
  if (edit?.kind === 'mission') {
    return <JsonEditor title={`Configure mission: ${edit.mission.id}`} initial={edit.mission} validate={(v) => { const e = validateMission(v); if ((v as MissionDef)?.id !== edit.mission.id) e.push('The mission id cannot be changed.'); return e; }}
      onCancel={() => setEdit(null)}
      onSave={(v) => { const m = v as MissionDef; updateCms((c) => { c.missions[m.id] = m; }, 'Mission configured', m.id); setEdit(null); setMsg(`Mission “${m.title}” updated.`); }} />;
  }

  const rows = tracks.flatMap((t) => t.modules.flatMap((m) => m.lessons.filter((l) => !l.planned).map((l) => ({ t, m, l: l as Lesson }))));
  const unique = [...new Map(rows.map((r) => [r.l.id, r])).values()];

  return (
    <div className="stack">
      <PageHead title="Content Administration" sub="Manage curriculum content, review status, glossary terms, missions and source references." back="profile" />
      <div className="note"><div><p>Content edits are stored in this browser (local content layer) and merged over the built-in curriculum. This local build has no sign-in, so the admin area is not access-controlled; a server-backed deployment must restrict it to authorised reviewers.</p><p className="small">Not yet available here: uploading illustrations, and creating new subjects or modules (lessons can be added to existing modules).</p></div></div>
      {msg && <p className="feedback ok" role="status">{msg}</p>}
      <Tabs tabs={TABS} value={tab} onChange={(t) => { setTab(t); setMsg(''); }} />

      {tab === 'overview' && (
        <div className="stack">
          <div className="card">
            <h3>Curriculum completeness</h3>
            <table className="table"><thead><tr><th scope="col">Pathway</th><th scope="col">Lessons with full content</th><th scope="col">Published</th><th scope="col">Planned (structure only)</th></tr></thead>
              <tbody>{completeness().map((c) => <tr key={c.track}><th scope="row">{c.track}</th><td>{c.complete}</td><td>{c.published}</td><td>{c.planned}</td></tr>)}</tbody></table>
            <p className="small muted">“Planned” lessons exist only as titles so learners can see the full syllabus. They contain no teaching content yet.</p>
          </div>
          <div className="card">
            <h3>Review policy</h3>
            <p>Workflow: <strong>Draft → Technical Review → Approved → Published</strong>. Only Published lessons are visible to learners. Any edit returns a lesson to Draft.</p>
            <p>The built-in lessons were drafted with AI assistance from the references in the Sources tab and are shown to learners with a “pending independent expert review” label. Aviation safety content should be checked by a qualified instructor before that label is removed.</p>
            <Btn kind="danger" onClick={() => { if (window.confirm('Remove all local content edits and restore the built-in curriculum?')) { resetCms(); setMsg('Local content edits removed. Built-in curriculum restored.'); } }}>Restore built-in content</Btn>
          </div>
        </div>
      )}

      {tab === 'lessons' && (
        <div className="stack">
          <div className="card">
            <h3>Add a lesson</h3>
            <div className="form-grid">
              <label className="field"><span>Module</span><select value={target} onChange={(e) => setTarget(e.target.value)}>{tracks.flatMap((t) => t.modules.map((m) => <option key={`${t.id}|${m.id}`} value={`${t.id}|${m.id}`}>{t.short} — {m.title}</option>))}</select></label>
              <label className="field"><span>New lesson id (for example phys-friction). Using the id of an “In development” lesson fills in that placeholder.</span><input value={newId} onChange={(e) => setNewId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} placeholder="track-topic" /></label>
            </div>
            <Btn kind="accent" icon="plus" disabled={newId.length < 3} onClick={() => { const [trackId, moduleId] = target.split('|'); setEdit({ kind: 'lesson', lesson: LESSON_TEMPLATE(newId), add: { trackId: trackId as TrackId, moduleId } }); }}>Create from template</Btn>
          </div>
          <div className="card">
            <h3>Lessons with content ({unique.length})</h3>
            <table className="table"><thead><tr><th scope="col">Lesson</th><th scope="col">Pathway</th><th scope="col">Questions</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead>
              <tbody>{unique.map(({ t, l }) => {
                const st = lessonStatus(l.id); const i = FLOW.indexOf(st);
                return (
                  <tr key={l.id}>
                    <th scope="row">{l.title}<div className="small muted">{l.id}{cms.lessons[l.id] ? ' · edited locally' : ''}</div></th>
                    <td>{t.short}</td><td>{l.practice.length + l.assessment.length}</td>
                    <td><Chip tone={TONE[st]}>{LABEL[st]}</Chip></td>
                    <td><div className="row gap wrap">
                      {i < FLOW.length - 1 && <Btn small kind="soft" onClick={() => setStatus(l.id, FLOW[i + 1])}>{i === 2 ? 'Publish' : `Move to ${LABEL[FLOW[i + 1]]}`}</Btn>}
                      {st === 'published' && <Btn small kind="ghost" onClick={() => setStatus(l.id, 'approved')}>Unpublish</Btn>}
                      {i > 0 && st !== 'published' && <Btn small kind="ghost" onClick={() => setStatus(l.id, FLOW[i - 1])}>Send back</Btn>}
                      <Btn small kind="ghost" onClick={() => setEdit({ kind: 'lesson', lesson: l })}>Edit</Btn>
                    </div></td>
                  </tr>
                );
              })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 'glossary' && (
        <div className="stack">
          <form className="card" onSubmit={(e) => {
            e.preventDefault();
            if (!term.term.trim() || !term.def.trim()) { setMsg('A term and a definition are required.'); return; }
            const t: Term = { id: `custom-${term.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`, ...term, tech: term.tech || term.def, example: term.example || '—', context: term.context || '—', related: [] };
            updateCms((c) => { c.terms.push(t); }, 'Glossary term added', t.term);
            setTerm({ term: '', cat: 'Custom', def: '', tech: '', example: '', context: '' }); setMsg(`“${t.term}” added to the Aviation Dictionary.`);
          }}>
            <h3>Add a glossary term</h3>
            <div className="form-grid">
              <label className="field"><span>Term</span><input value={term.term} onChange={(e) => setTerm({ ...term, term: e.target.value })} required /></label>
              <label className="field"><span>Category</span><input value={term.cat} onChange={(e) => setTerm({ ...term, cat: e.target.value })} /></label>
              <label className="field wide"><span>Clear English definition</span><input value={term.def} onChange={(e) => setTerm({ ...term, def: e.target.value })} required /></label>
              <label className="field wide"><span>Technical explanation</span><input value={term.tech} onChange={(e) => setTerm({ ...term, tech: e.target.value })} /></label>
              <label className="field"><span>Example sentence</span><input value={term.example} onChange={(e) => setTerm({ ...term, example: e.target.value })} /></label>
              <label className="field"><span>Aviation context</span><input value={term.context} onChange={(e) => setTerm({ ...term, context: e.target.value })} /></label>
            </div>
            <button type="submit" className="btn btn-accent">Add term</button>
          </form>
          <div className="card">
            <h3>Custom terms ({cms.terms.length})</h3>
            {cms.terms.length === 0 ? <Empty>No custom terms yet. The dictionary also contains the built-in terms.</Empty> : <ul className="schedule">{cms.terms.map((t) => <li key={t.id}><span><strong>{t.term}</strong> — {t.def}</span><Btn small kind="ghost" onClick={() => updateCms((c) => { c.terms = c.terms.filter((x) => x.id !== t.id); }, 'Glossary term removed', t.term)}>Remove</Btn></li>)}</ul>}
          </div>
        </div>
      )}

      {tab === 'missions' && (
        <div className="card">
          <h3>Flight missions ({allMissions().length})</h3>
          <p className="small muted">Missions are pure data: environment, aircraft, length, gates, obstacles, wind, fuel, take-off, landing, messages and decisions. Edit the data to reconfigure a mission; the engine needs no code change.</p>
          <table className="table"><thead><tr><th scope="col">Mission</th><th scope="col">Tier</th><th scope="col">Lesson</th><th scope="col">Environment</th><th scope="col" /></tr></thead>
            <tbody>{allMissions().map((m) => <tr key={m.id}><th scope="row">{m.title}<div className="small muted">{m.id}{getCms().missions[m.id] ? ' · edited locally' : ''}</div></th><td>{m.tier}</td><td>{m.lessonId ?? 'Free flight'}</td><td>{m.env}</td><td><Btn small kind="ghost" onClick={() => setEdit({ kind: 'mission', mission: m })}>Configure</Btn></td></tr>)}</tbody></table>
        </div>
      )}

      {tab === 'sources' && (
        <div className="card">
          <h3>Source register ({SOURCES.length})</h3>
          <p className="small muted">Each curriculum unit lists its sources. “Not yet verified” means a human reviewer has not re-checked the reference against the current official document; the listed editions come from the author's knowledge and may have been superseded.</p>
          <div className="table-scroll"><table className="table"><thead><tr><th scope="col">Source</th><th scope="col">Organisation and reference</th><th scope="col">Jurisdiction</th><th scope="col">Licence or permission</th><th scope="col">Verification</th></tr></thead>
            <tbody>{SOURCES.map((s) => <tr key={s.id}><th scope="row">{s.title}<div className="small muted">{s.date}</div></th><td>{s.org}<div className="small muted">{s.ref} · <a href={s.url} target="_blank" rel="noreferrer">official site</a></div></td><td>{s.jurisdiction}</td><td>{s.licence}</td><td>{s.verified ? <Chip tone="ok">Verified {s.verified}</Chip> : <Chip tone="warn">Not yet verified</Chip>}</td></tr>)}</tbody></table></div>
        </div>
      )}

      {tab === 'history' && (
        <div className="card">
          <h3>Revision history</h3>
          {cms.history.length === 0 ? <Empty>No content changes have been made on this device.</Empty> : <ul className="schedule">{cms.history.map((h, i) => <li key={i}><span><strong>{h.action}</strong> — {h.target}{h.note ? ` (${h.note})` : ''}</span><span className="small muted">{new Date(h.at).toLocaleString('en-GB')}</span></li>)}</ul>}
        </div>
      )}
    </div>
  );
}
