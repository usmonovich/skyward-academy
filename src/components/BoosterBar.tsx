import { BOOSTERS, MAX_HELD, type BoosterView } from '../game/engine';

/**
 * The booster bar: three slots for collected boosters (tap or press 1 to 3 to use one), the running boosters with their
 * time left, boosters that are cooling down, and the XP tokens collected. These are arcade power-ups, not real aircraft
 * systems, and the bar says so for screen readers.
 */
export function BoosterBar({ view, onUse, floating }: { view: BoosterView; onUse: (i: number) => void; floating?: boolean }) {
  const cooling = Object.entries(view.cooldown) as [keyof typeof BOOSTERS, number][];
  return (
    <div className={`boost-bar${floating ? ' floating' : ''}`} role="group" aria-label="Boosters. These are arcade game power-ups, not real aircraft systems.">
      {Array.from({ length: MAX_HELD }, (_, i) => {
        const k = view.held[i];
        if (!k) return <span key={i} className="boost-slot empty" aria-hidden="true" />;
        const b = BOOSTERS[k];
        return (
          <button key={i} type="button" className="boost-slot" style={{ ['--c' as string]: b.color }} onClick={() => onUse(i)} aria-label={`${b.name}. ${b.blurb} Tap to use, or press ${i + 1}.`}>
            <span className="boost-glyph">{b.short}</span><small>{i + 1}</small>
          </button>
        );
      })}
      {view.active.map((a) => {
        const b = BOOSTERS[a.kind];
        return (
          <span key={a.kind} className="boost-active" style={{ ['--c' as string]: b.color }} role="status" aria-label={`${b.name} active, ${Math.ceil(a.left)} seconds left`}>
            <span className="boost-glyph">{b.short}</span><b>{Math.ceil(a.left)}s</b><i style={{ width: `${Math.max(0, Math.min(1, a.left / a.total)) * 100}%` }} />
          </span>
        );
      })}
      {cooling.map(([k, left]) => <span key={k} className="boost-cool" aria-label={`${BOOSTERS[k].name} cooling down, ${Math.ceil(left)} seconds`}>{BOOSTERS[k].short} {Math.ceil(left)}s</span>)}
      {view.xpTokens > 0 && <span className="boost-xp" aria-label={`${view.xpTokens} bonus XP tokens collected`}>XP ×{view.xpTokens}</span>}
    </div>
  );
}
