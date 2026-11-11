import { Component, useEffect, useState, type ReactNode } from 'react';
import { APP } from './config';
import { actions, useProgress } from './store/progress';
import { audio } from './engine/audio';
import { rankFor } from './engine/gamification';
import { useCms } from './content';
import { Btn, Icon, Toasts } from './components/ui';
import { Tutor } from './components/Tutor';
import { Home } from './pages/Home';
import { Academy, TrackPage } from './pages/Academy';
import { LessonPage } from './pages/Lesson';
import { Fly } from './pages/Fly';
import { English } from './pages/English';
import { Knowledge } from './pages/Knowledge';
import { Exams } from './pages/Exams';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';

const parse = () => (window.location.hash || '#/').replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);

export function useRoute(): string[] {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => { setRoute(parse()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

const NAV = [['', 'Home', 'home'], ['academy', 'Academy', 'academy'], ['fly', 'Fly', 'fly'], ['english', 'English', 'english'], ['knowledge', 'Knowledge', 'knowledge'], ['profile', 'Profile', 'profile']] as const;
const SECTION: Record<string, string> = { track: 'academy', lesson: 'academy', exams: 'knowledge', admin: 'profile' };

class Boundary extends Component<{ children: ReactNode; resetKey: string }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidUpdate(prev: { resetKey: string }) { if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null }); }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="card error-card" role="alert">
        <h2>Something went wrong on this page</h2>
        <p>Your progress is safe. Go back to the dashboard and try again. If the problem continues, export your progress from Profile and reload the app.</p>
        <p className="small muted">{this.state.error.message}</p>
        <Btn href="">Back to dashboard</Btn>
      </div>
    );
  }
}

function Welcome({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('');
  return (
    <div className="modal-back">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
        <div className="brand big"><span className="brand-mark"><Icon name="fly" size={26} /></span><div><strong id="welcome-title">{APP.name}</strong><span>{APP.tagline}</span></div></div>
        <p>Your journey from complete beginner to airline-level knowledge starts here. Study short lessons, pass the assessment, and unlock a flight mission after each one.</p>
        <label className="field"><span>Your name (optional)</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Cadet" maxLength={30} autoFocus /></label>
        <div className="row gap wrap">
          <Btn kind="accent" onClick={() => { actions.createProfile(name || 'Cadet'); onDone(); }}>Create profile</Btn>
          <Btn kind="ghost" onClick={onDone}>Continue as guest</Btn>
        </div>
        <p className="small muted">Profiles and progress are stored on this device only. A guest can create a profile later and keep all progress. {APP.disclaimer}</p>
      </div>
    </div>
  );
}

export function App() {
  const route = useRoute();
  const p = useProgress();
  useCms();
  const [welcomed, setWelcomed] = useState(() => { try { return localStorage.getItem('skyward.welcomed') === '1'; } catch { return true; } });
  const s = p.settings;

  useEffect(() => { audio.configure({ sfx: s.sfx, engine: s.engine, volume: s.volume }); }, [s.sfx, s.engine, s.volume]);
  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * s.textScale}px`;
    document.documentElement.dataset.motion = s.reducedMotion ? 'reduced' : 'full';
    document.title = APP.name;
  }, [s.textScale, s.reducedMotion]);

  const [head, a, b] = route;
  const active = head === undefined ? '' : SECTION[head] ?? head;
  const immersive = head === 'fly' && !!a;
  const rank = rankFor(p.xp);

  let page: ReactNode;
  switch (head) {
    case undefined: page = <Home />; break;
    case 'academy': page = <Academy />; break;
    case 'track': page = <TrackPage id={a ?? ''} />; break;
    case 'lesson': page = <LessonPage key={a} id={a ?? ''} view={b} />; break;
    case 'fly': page = <Fly missionId={a} from={b} />; break;
    case 'english': page = <English exerciseId={a} />; break;
    case 'knowledge': page = <Knowledge tab={a} />; break;
    case 'exams': page = <Exams />; break;
    case 'profile': page = <Profile />; break;
    case 'admin': page = <Admin />; break;
    default: page = <div className="card"><h2>Page not found</h2><p>That address does not exist in {APP.name}.</p><Btn href="">Back to dashboard</Btn></div>;
  }

  return (
    <div className={`shell${immersive ? ' immersive' : ''}`}>
      <a className="skip" href="#main">Skip to content</a>
      <nav className="side" aria-label="Primary">
        <a className="brand" href="#/"><span className="brand-mark"><Icon name="fly" size={22} /></span><div><strong>{APP.name}</strong><span>{APP.tagline}</span></div></a>
        <div className="side-links">
          {NAV.map(([href, name, icon]) => <a key={name} href={`#/${href}`} className={active === href ? 'side-link on' : 'side-link'} aria-current={active === href ? 'page' : undefined}><Icon name={icon} />{name}</a>)}
          <div className="side-sep" />
          <a href="#/exams" className={head === 'exams' ? 'side-link on' : 'side-link'}><Icon name="exam" />Exam Center</a>
          <a href="#/admin" className={head === 'admin' ? 'side-link on' : 'side-link'}><Icon name="admin" />Content Admin</a>
        </div>
        <a className="side-user" href="#/profile">
          <span className="avatar">{p.name.slice(0, 1).toUpperCase()}</span>
          <div><strong>{p.name}{p.guest ? ' (guest)' : ''}</strong><span>{rank.name} · {p.xp} XP</span></div>
        </a>
      </nav>
      <main id="main" className="main" tabIndex={-1}>
        <Boundary resetKey={route.join('/')}>{page}</Boundary>
        {!immersive && <footer className="foot">{APP.disclaimer}</footer>}
      </main>
      <nav className="bottom" aria-label="Primary">
        {NAV.map(([href, name, icon]) => <a key={name} href={`#/${href}`} className={active === href ? 'bottom-link on' : 'bottom-link'} aria-current={active === href ? 'page' : undefined}><Icon name={icon} size={22} /><span>{name}</span></a>)}
      </nav>
      {!immersive && <Tutor />}
      <Toasts />
      {!welcomed && <Welcome onDone={() => { try { localStorage.setItem('skyward.welcomed', '1'); } catch { /* ignore */ } setWelcomed(true); }} />}
    </div>
  );
}
