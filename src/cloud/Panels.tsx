import { useEffect, useState } from 'react';
import { Btn, Chip } from '../components/ui';
import { cloudConfigured, deleteCloudData, sendPasswordReset, setNewPassword, signIn, signOut, signUp, syncNow, useCloud } from './supabase';

/* ------------------------------------------------------------- Account */
export function AccountPanel() {
  const cloud = useCloud();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<string | null>, ok: string) => { setBusy(true); setMsg(''); const err = await fn(); setBusy(false); setMsg(err ?? ok); };

  if (!cloudConfigured) {
    return (
      <section className="card">
        <div className="card-head"><h2>Cloud account and sync</h2><Chip tone="warn">Not configured</Chip></div>
        <p>This copy of the app was built without a cloud project, so progress is stored on this device only. Use “Export my progress” below to move it to another device.</p>
        <p className="small muted">To enable accounts: create a free Supabase project, run supabase/schema.sql, and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY when building. See the README.</p>
      </section>
    );
  }
  if (cloud.recovery) {
    return (
      <section className="card">
        <h2>Choose a new password</h2>
        <form className="row gap wrap" onSubmit={(e) => { e.preventDefault(); void run(() => setNewPassword(password), 'Password changed.'); }}>
          <label className="field inline"><span>New password (at least 8 characters)</span><input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          <button type="submit" className="btn btn-accent" disabled={busy || password.length < 8}>Save password</button>
        </form>
        {msg && <p className="feedback ok" role="status">{msg}</p>}
      </section>
    );
  }
  if (cloud.email) {
    return (
      <section className="card">
        <div className="card-head"><h2>Cloud account and sync</h2><Chip tone={cloud.status === 'error' ? 'warn' : 'ok'}>{cloud.status === 'syncing' ? 'Syncing…' : cloud.status === 'error' ? 'Sync problem' : 'Synced'}</Chip></div>
        <p>Signed in as <strong>{cloud.email}</strong>. Lessons, XP, achievements, aircraft, flashcards, exam results and Aviation English progress are saved to your account and merged across devices.</p>
        {cloud.lastSync && <p className="small muted">Last synced {new Date(cloud.lastSync).toLocaleTimeString('en-GB')}.</p>}
        {cloud.message && <p className="bad-text" role="alert">{cloud.message}</p>}
        {msg && <p className="feedback ok" role="status">{msg}</p>}
        <div className="row gap wrap">
          <Btn kind="soft" disabled={busy} onClick={() => void syncNow()}>Sync now</Btn>
          <Btn kind="ghost" disabled={busy} onClick={() => void signOut()}>Sign out</Btn>
          <Btn kind="danger" disabled={busy} onClick={() => { if (window.confirm('Delete the copy of your progress stored in the cloud? The copy on this device is kept.')) void run(deleteCloudData, 'Cloud copy deleted.'); }}>Delete cloud data</Btn>
        </div>
      </section>
    );
  }
  return (
    <section className="card">
      <div className="card-head"><h2>Cloud account and sync</h2><Chip>Signed out</Chip></div>
      <p>Create a free account to keep your progress safe and continue on any device. Progress you have already made here as a guest is moved into the account when you sign in.</p>
      <form className="form-grid" onSubmit={(e) => { e.preventDefault(); void run(() => signIn(email, password), 'Signed in.'); }}>
        <label className="field"><span>Email</span><input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="field"><span>Password (at least 8 characters)</span><input type="password" autoComplete="current-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <div className="row gap wrap field wide">
          <button type="submit" className="btn btn-accent" disabled={busy}>Sign in</button>
          <Btn kind="soft" disabled={busy || !email || password.length < 8} onClick={() => void run(() => signUp(email, password), 'Account created and signed in.')}>Create account</Btn>
          <Btn kind="ghost" disabled={busy || !email} onClick={() => void run(() => sendPasswordReset(email), 'If that address has an account, a password-reset link has been sent to it.')}>Forgot password</Btn>
        </div>
      </form>
      {msg && <p className="feedback ok" role="status">{msg}</p>}
      <p className="small muted">Your password is sent only to the sign-in service and is never stored by this app. You can keep using the app as a guest without an account.</p>
    </section>
  );
}

/* ------------------------------------------------------------- Install */
interface InstallEvent extends Event { prompt: () => Promise<void> }
let deferred: InstallEvent | null = null;
const installListeners = new Set<() => void>();
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e as InstallEvent; installListeners.forEach((l) => l()); });
  window.addEventListener('appinstalled', () => { deferred = null; installListeners.forEach((l) => l()); });
}

export function InstallPanel() {
  const [, force] = useState(0);
  useEffect(() => { const l = () => force((n) => n + 1); installListeners.add(l); return () => { installListeners.delete(l); }; }, []);
  const standalone = typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true);
  return (
    <section className="card">
      <div className="card-head"><h2>Install on your device</h2>{standalone ? <Chip tone="ok">Installed</Chip> : <Chip>Web app</Chip>}</div>
      <p>Skyward Academy is a web app that can be added to your home screen. It then opens full-screen, like an app, and lessons you have already opened keep working without a connection.</p>
      {deferred && <div><Btn kind="accent" onClick={() => { void deferred?.prompt(); }}>Install Skyward Academy</Btn></div>}
      <div className="grid-3">
        <div className="mini"><strong>iPhone and iPad (Safari)</strong><ul><li>Open this page in Safari.</li><li>Tap the Share button.</li><li>Choose “Add to Home Screen”, then “Add”.</li></ul></div>
        <div className="mini"><strong>Android (Chrome)</strong><ul><li>Open this page in Chrome.</li><li>Tap the three-dot menu.</li><li>Choose “Install app” or “Add to Home screen”.</li></ul></div>
        <div className="mini"><strong>Computer (Chrome or Edge)</strong><ul><li>Click the install icon at the right of the address bar,</li><li>or open the browser menu and choose “Install Skyward Academy”.</li></ul></div>
      </div>
      <p className="small muted">An installed web app is not the same as an app from the App Store or Google Play: it has no store listing, and some features depend on the browser. Speech recognition for the ATC simulator works in Chrome and Edge; elsewhere you type your transmissions. Firefox on computers cannot install web apps but runs the site normally. Cloud sign-in and sync need a connection.</p>
    </section>
  );
}
