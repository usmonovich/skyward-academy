import { useRef, useState } from 'react';
import { APP } from '../config';
import { actions, useProfiles, useProgress } from '../store/progress';
import { ACHIEVEMENTS, RANKS, dayKey, rankFor, stageFor, streak } from '../engine/gamification';
import { getTracks, liveLessons, trackProgress } from '../content';
import { audio } from '../engine/audio';
import { AccountPanel, InstallPanel } from '../cloud/Panels';
import { Bar, Btn, Chip, Icon, PageHead, Slider } from '../components/ui';

function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return <label className="toggle"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /><span><strong>{label}</strong>{hint && <span className="small muted">{hint}</span>}</span></label>;
}

export function Profile() {
  const p = useProgress();
  const root = useProfiles();
  const [name, setName] = useState(p.name);
  const [newName, setNewName] = useState('');
  const [msg, setMsg] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const rank = rankFor(p.xp);
  const s = p.settings;
  const live = liveLessons();
  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (13 - i)); return { key: dayKey(d), label: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) }; });
  const maxXp = Math.max(1, ...days.map((d) => p.activity[d.key] ?? 0));
  const certificates = getTracks().map((t) => ({ t, pr: trackProgress(t, p) })).filter((x) => x.pr.total >= 4 && x.pr.done === x.pr.total);

  const exportData = () => {
    const blob = new Blob([actions.exportData()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `skyward-academy-${p.name.replace(/\W+/g, '-').toLowerCase()}-${dayKey()}.json`;
    a.click(); URL.revokeObjectURL(a.href);
    setMsg('Progress exported. Import this file on another device to continue there.');
  };
  const importData = async (f: File | undefined) => { if (!f) return; const err = actions.importData(await f.text()); setMsg(err ?? 'Progress imported successfully.'); };

  return (
    <div className="stack">
      <PageHead title="Profile" sub={`${stageFor(p)} · ${rank.name}`} right={<Btn kind="soft" href="admin" icon="admin">Content Admin</Btn>} />

      <section className="card">
        <div className="profile-top">
          <span className="avatar big">{p.name.slice(0, 1).toUpperCase()}</span>
          <div className="grow">
            <form className="row gap wrap" onSubmit={(e) => { e.preventDefault(); actions.rename(name); setMsg('Name updated.'); }}>
              <label className="field inline"><span className="sr-only">Display name</span><input value={name} onChange={(e) => setName(e.target.value)} maxLength={30} /></label>
              <Btn small kind="soft" onClick={() => { actions.rename(name); setMsg('Name updated.'); }}>Save name</Btn>
              {p.guest && <Chip tone="warn">Guest — progress is saved on this device</Chip>}
            </form>
            <div className="row between small"><span>{rank.next ? `${rank.toNext} XP to ${rank.next}` : 'Highest rank reached'}</span><span>{p.xp} XP</span></div>
            <Bar value={rank.pct} color="#f58220" label="Progress to next rank" />
          </div>
        </div>
        {msg && <p className="feedback ok" role="status">{msg}</p>}
      </section>

      <section className="stats" aria-label="Learning statistics">
        <div className="stat"><Icon name="academy" /><div><strong>{live.filter((l) => p.lessons[l.id]?.passed).length} / {live.length}</strong><span>Lessons passed</span></div></div>
        <div className="stat"><Icon name="fly" /><div><strong>{Object.keys(p.missions).length}</strong><span>Missions completed</span></div></div>
        <div className="stat"><Icon name="star" /><div><strong>{Object.values(p.missions).reduce((n, m) => n + m.stars, 0)}</strong><span>Mission stars</span></div></div>
        <div className="stat"><Icon name="flame" /><div><strong>{streak(p)}</strong><span>Day streak · {Object.keys(p.activity).length} active days</span></div></div>
      </section>

      <div className="grid-2">
        <section className="card">
          <h2>Activity — last 14 days</h2>
          <div className="activity" role="img" aria-label="XP earned per day over the last 14 days">
            {days.map((d) => <div key={d.key} className="activity-col" title={`${d.label}: ${p.activity[d.key] ?? 0} XP`}><div className="activity-bar" style={{ height: `${((p.activity[d.key] ?? 0) / maxXp) * 100}%` }} /><span>{d.label.split(' ')[0]}</span></div>)}
          </div>
          <p className="small muted">Streaks are for motivation only. Missing a day never removes XP, ranks or unlocked content.</p>
        </section>
        <section className="card">
          <h2>Pilot knowledge ranks</h2>
          <ol className="ranks">{RANKS.map((r, i) => <li key={r.name} className={i === rank.index ? 'on' : i < rank.index ? 'done' : ''}><span>{r.name}</span><span className="small muted">{r.xp} XP</span></li>)}</ol>
          <p className="small muted">These are in-game educational ranks. They are not pilot licences or aviation qualifications.</p>
        </section>
      </div>

      <section className="card">
        <div className="card-head"><h2>Achievements</h2><span className="small muted">{Object.keys(p.achievements).length} of {ACHIEVEMENTS.length}</span></div>
        <div className="badges">
          {ACHIEVEMENTS.map((a) => { const at = p.achievements[a.id]; return <div key={a.id} className={`badge${at ? ' on' : ''}`}><span className="badge-icon"><Icon name={at ? 'trophy' : 'lock'} size={22} /></span><strong>{a.name}</strong><span className="small muted">{a.desc}</span>{at && <span className="small">{new Date(at).toLocaleDateString('en-GB')}</span>}</div>; })}
        </div>
      </section>

      <section className="card">
        <div className="card-head"><h2>Progress certificates</h2></div>
        {certificates.length === 0 ? <p className="muted">Pass every published lesson in a pathway to receive a Skyward Academy milestone certificate for it. Certificates are issued only for pathways that already have at least four published lessons.</p> : certificates.map(({ t, pr }) => (
          <div key={t.id} className="certificate">
            <p className="eyebrow">{APP.name} · Educational completion certificate</p>
            <h3>{p.name}</h3>
            <p>has passed all {pr.total} lessons published so far in the</p>
            <h3 style={{ color: t.color }}>{t.title} knowledge pathway</h3>
            <p className="small">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · {pr.planned} further lessons in this pathway are still in development.</p>
            <p className="small muted">This is an in-app educational milestone. It is not a pilot licence, rating, official examination result or ICAO endorsement.</p>
            <Btn small kind="soft" onClick={() => window.print()}>Print certificate</Btn>
          </div>
        ))}
      </section>

      <section className="card">
        <h2>Settings</h2>
        <div className="settings">
          <Toggle label="Sound effects" checked={s.sfx} onChange={(v) => { actions.settings({ sfx: v }); if (v) setTimeout(() => audio.sfx('ok'), 50); }} hint="Buttons, answers, achievements and mission effects" />
          <Toggle label="Aircraft engine sound" checked={s.engine} onChange={(v) => actions.settings({ engine: v })} hint="Engine tone during flight missions" />
          <Toggle label="Voice narration" checked={s.voice} onChange={(v) => actions.settings({ voice: v })} hint="Read-aloud buttons and ATC voice. Subtitles are always shown." />
          <Toggle label="Reduce motion" checked={s.reducedMotion} onChange={(v) => actions.settings({ reducedMotion: v })} hint="Turns off decorative animation. Your system preference is also respected." />
          <Toggle label="Assisted mission mode" checked={s.assisted} onChange={(v) => actions.settings({ assisted: v })} hint="Contacts never end a mission, and landings are helped" />
          <Slider label="Volume" value={s.volume} min={0} max={1} step={0.05} onChange={(v) => actions.settings({ volume: v })} format={(v) => `${Math.round(v * 100)}%`} />
          <Slider label="Speech rate" value={s.speechRate} min={0.7} max={1.3} step={0.05} onChange={(v) => actions.settings({ speechRate: v })} format={(v) => `${Math.round(v * 100)}%`} />
          <Slider label="Text size" value={s.textScale} min={0.9} max={1.3} step={0.05} onChange={(v) => actions.settings({ textScale: v })} format={(v) => `${Math.round(v * 100)}%`} />
          <Slider label="Daily study goal" value={s.dailyMinutes} min={10} max={90} step={5} unit="min" onChange={(v) => actions.settings({ dailyMinutes: v })} />
          <label className="field"><span>Licensing framework shown in the pathways</span>
            <select value={s.jurisdiction} onChange={(e) => actions.settings({ jurisdiction: e.target.value as typeof s.jurisdiction })}>
              <option value="ICAO">ICAO — international reference</option><option value="EASA">EASA — Europe</option><option value="FAA">FAA — United States</option>
            </select></label>
        </div>
      </section>

      <AccountPanel />
      <InstallPanel />

      <section className="card">
        <h2>Profiles on this device</h2>
        <ul className="profiles">
          {Object.values(root.profiles).map((pr) => (
            <li key={pr.id} className={pr.id === root.active ? 'on' : ''}>
              <span className="avatar">{pr.name.slice(0, 1).toUpperCase()}</span>
              <span className="grow"><strong>{pr.name}{pr.guest ? ' (guest)' : ''}</strong><span className="small muted"> · {pr.xp} XP · {Object.values(pr.lessons).filter((l) => l.passed).length} lessons</span></span>
              {pr.id === root.active ? <Chip tone="ok">Active</Chip> : <Btn small kind="soft" onClick={() => { actions.switchProfile(pr.id); setName(pr.name); setMsg(`Switched to ${pr.name}.`); }}>Switch</Btn>}
            </li>
          ))}
        </ul>
        <form className="row gap wrap" onSubmit={(e) => { e.preventDefault(); if (!newName.trim()) return; const migrated = actions.createProfile(newName); setName(newName.trim()); setNewName(''); setMsg(migrated ? 'Profile created. Your guest progress was moved into it.' : 'Profile created.'); }}>
          <label className="field inline"><span className="sr-only">New profile name</span><input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New profile name" maxLength={30} /></label>
          <Btn kind="accent" disabled={!newName.trim()} onClick={() => { const migrated = actions.createProfile(newName); setName(newName.trim()); setNewName(''); setMsg(migrated ? 'Profile created. Your guest progress was moved into it.' : 'Profile created.'); }}>{p.guest ? 'Create profile and keep my progress' : 'Create another profile'}</Btn>
        </form>
      </section>

      <section className="card">
        <h2>Your data and privacy</h2>
        <p>All progress is stored only in this browser on this device. Nothing is sent to a server. To continue on another device, export your progress and import it there.</p>
        <p className="small muted">Voice: the microphone is used only in speaking exercises, only while you press Speak. Speech is transcribed by your browser's own speech service; Skyward Academy does not record, store or upload audio, and transcripts are not saved.</p>
        <div className="row gap wrap">
          <Btn kind="soft" onClick={exportData}>Export my progress</Btn>
          <Btn kind="soft" onClick={() => file.current?.click()}>Import progress</Btn>
          <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => { void importData(e.target.files?.[0]); e.target.value = ''; }} />
          {!confirmDelete ? <Btn kind="danger" onClick={() => setConfirmDelete(true)}>Delete this profile's data</Btn> : (
            <span className="row gap wrap"><strong>Delete all data for “{p.name}”? This cannot be undone.</strong><Btn kind="danger" onClick={() => { actions.deleteProfile(p.id); setConfirmDelete(false); setName('Cadet'); setMsg('Profile data deleted.'); }}>Yes, delete</Btn><Btn kind="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Btn></span>
          )}
        </div>
      </section>
    </div>
  );
}
