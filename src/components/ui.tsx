import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { GameAircraft } from '../types';
import { drawAircraft } from '../game/art';
import { useToasts } from '../store/progress';
import { audio } from '../engine/audio';

const PATHS: Record<string, string> = {
  home: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  academy: 'M2 9l10-5 10 5-10 5-10-5zM6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5M22 9v6',
  fly: 'M2 13l8-1 5-8h2l-2 8 5-.5 2-2h1.5l-1 4 1 4H20l-2-2-5-.5 2 6h-2l-5-6-8-1z',
  english: 'M4 5h16v11H9l-5 4V5zM8 9h8M8 12h5',
  knowledge: 'M4 4h6a2 2 0 012 2v14a2 2 0 00-2-2H4V4zM20 4h-6a2 2 0 00-2 2v14a2 2 0 012-2h6V4z',
  profile: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-4 3.6-6 8-6s8 2 8 6',
  lock: 'M6 11h12v9H6v-9zM8 11V8a4 4 0 018 0v3',
  check: 'M4 12l5 5L20 6',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z',
  flame: 'M12 3c1 3 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z',
  play: 'M7 4l13 8-13 8V4z',
  pause: 'M7 4h3v16H7zM14 4h3v16h-3z',
  mic: 'M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3zM6 11a6 6 0 0012 0M12 17v4M9 21h6',
  sound: 'M4 9v6h4l5 4V5L8 9H4zM16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM16 16l5 5',
  heart: 'M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z',
  cards: 'M4 7h12v13H4V7zM8 7V4h12v13h-4',
  gear: 'M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2',
  admin: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4',
  exam: 'M8 4h8v3H8V4zM6 6H5v15h14V6h-1M8 12h8M8 16h5',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  back: 'M19 12H5M11 6l-6 6 6 6',
  close: 'M6 6l12 12M18 6L6 18',
  tutor: 'M12 3l1.8 4.7L18 9.5l-4.2 1.8L12 16l-1.8-4.7L6 9.5l4.2-1.8L12 3zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z',
  refresh: 'M20 11a8 8 0 10-2.3 6M20 5v6h-6',
  clock: 'M12 4a8 8 0 100 16 8 8 0 000-16zM12 8v4l3 2',
  book: 'M5 4h13v16H5V4zM9 8h5M9 12h5',
  bookmark: 'M7 4h10v16l-5-4-5 4V4z',
  up: 'M12 19V5M6 11l6-6 6 6',
  down: 'M12 5v14M6 13l6 6 6-6',
  plus: 'M12 5v14M5 12h14',
  trophy: 'M8 4h8v5a4 4 0 01-8 0V4zM8 6H4c0 3 1.5 4 4 4M16 6h4c0 3-1.5 4-4 4M12 13v4M8 20h8M10 17h4',
};

export function Icon({ name, size = 20, fill = false }: { name: string; size?: number; fill?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={fill ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={PATHS[name] ?? PATHS.book} />
    </svg>
  );
}

/** Minimal rich text: **bold** and `formula`. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return <>{parts.map((p, i) => p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p.startsWith('`') ? <code key={i} className="fx">{p.slice(1, -1)}</code> : <span key={i}>{p}</span>)}</>;
}

export function Bar({ value, color, label }: { value: number; color?: string; label?: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? 'Progress'}>
      <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function Stars({ n, size = 16 }: { n: number; size?: number }) {
  return (
    <span className="stars" role="img" aria-label={`${n} of 3 stars`}>
      {[0, 1, 2].map((i) => <span key={i} className={i < n ? 'star on' : 'star'}><Icon name="star" size={size} fill /></span>)}
    </span>
  );
}

export function Btn({ children, onClick, kind = 'primary', disabled, href, icon, small, label }: { children?: ReactNode; onClick?: () => void; kind?: 'primary' | 'ghost' | 'accent' | 'danger' | 'soft'; disabled?: boolean; href?: string; icon?: string; small?: boolean; label?: string }) {
  const cls = `btn btn-${kind}${small ? ' btn-sm' : ''}`;
  const inner = <>{icon && <Icon name={icon} size={small ? 16 : 18} />}{children}</>;
  if (href && !disabled) return <a className={cls} href={`#/${href}`} aria-label={label} onClick={() => audio.sfx('click')}>{inner}</a>;
  return <button type="button" className={cls} disabled={disabled} aria-label={label} onClick={() => { audio.sfx('click'); onClick?.(); }}>{inner}</button>;
}

export function Chip({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'ok' | 'warn' | 'accent' | 'navy' }) {
  return <span className={`chip chip-${tone}`}>{children}</span>;
}

export function PageHead({ title, sub, back, right }: { title: string; sub?: string; back?: string; right?: ReactNode }) {
  return (
    <header className="page-head">
      <div>
        {back !== undefined && <a className="back-link" href={`#/${back}`}><Icon name="back" size={16} /> Back</a>}
        <h1>{title}</h1>
        {sub && <p className="muted">{sub}</p>}
      </div>
      {right && <div className="page-head-right">{right}</div>}
    </header>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: readonly (readonly [T, string])[]; value: T; onChange: (t: T) => void }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map(([id, name]) => <button key={id} type="button" role="tab" aria-selected={value === id} className={value === id ? 'tab on' : 'tab'} onClick={() => onChange(id)}>{name}</button>)}
    </div>
  );
}

/** Small canvas preview of a game aircraft (hangar, mission cards). */
export function AircraftArt({ ac, color, width = 180, locked }: { ac: GameAircraft; color: string; width?: number; locked?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const height = Math.round(width * 0.5);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = width * dpr; c.height = height * dpr;
    const ctx = c.getContext('2d'); if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2 - 4, height / 2 + 2);
    const k = (width / 180) * (1.5 / Math.max(1, ac.size * (ac.kind === 'airliner' ? 1.35 : ac.kind === 'turboprop' ? 1.2 : 1)));
    ctx.scale(k, k);
    drawAircraft(ctx, ac, locked ? '#9aa8b8' : color, 0);
    ctx.restore();
  }, [ac, color, width, height, locked]);
  return <canvas ref={ref} style={{ width, height, opacity: locked ? 0.45 : 1 }} role="img" aria-label={`${ac.name}, ${ac.cls}${locked ? ', locked' : ''}`} />;
}

export function Toasts() {
  const toasts = useToasts();
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.kind}`}>
          <Icon name={t.kind === 'badge' ? 'trophy' : t.kind === 'unlock' ? 'fly' : 'bolt'} size={20} />
          <div><strong>{t.title}</strong>{t.text && <div className="small">{t.text}</div>}</div>
        </div>
      ))}
    </div>
  );
}

export function Slider({ label, value, min, max, step, unit, onChange, format }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void; format?: (v: number) => string }) {
  return (
    <label className="slider">
      <span className="slider-top"><span>{label}</span><strong>{format ? format(value) : value.toLocaleString('en-US', { maximumFractionDigits: 3 })}{unit ? ` ${unit}` : ''}</strong></span>
      <input type="range" min={min} max={max} step={step ?? 1} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

export function Empty({ children }: { children: ReactNode }) { return <div className="empty">{children}</div>; }

export function useNow(intervalMs: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), intervalMs); return () => clearInterval(id); }, [intervalMs]);
  return now;
}

export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 });
