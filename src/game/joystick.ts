// Virtual analog joystick: pure maths and a DOM-free pointer controller.
// The React component (Joystick.tsx) feeds pointer events into the controller; tests drive the same controller directly,
// so multi-touch, cancellation and release rules are checked without a browser.

export interface StickConfig {
  /** Travel of the thumbstick from the centre, in CSS pixels. */
  radius: number;
  /** Fraction of the travel (0 to 0.5) that is ignored around the centre. */
  deadZone: number;
  /** Output multiplier (the steering sensitivity setting). Output is still limited to -1..1. */
  sensitivity: number;
  /** Response curve exponent: 1 is linear, above 1 gives finer control near the centre. */
  curve: number;
}

export const DEFAULT_STICK: StickConfig = { radius: 52, deadZone: 0.12, sensitivity: 1, curve: 1.35 };

export interface StickOutput { x: number; y: number; /** Knob offset to draw, in pixels, limited to the radius. */ kx: number; ky: number; active: boolean }

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** Maps a finger offset from the stick centre to an analog output in -1..1 per axis. Up on the screen is negative y. */
export function stickVector(dx: number, dy: number, cfg: StickConfig): StickOutput {
  const dist = Math.hypot(dx, dy);
  const r = Math.max(1, cfg.radius);
  const k = dist > r ? r / dist : 1;
  const kx = dx * k; const ky = dy * k;
  const m = Math.min(1, dist / r);
  const dz = clamp(cfg.deadZone, 0, 0.5);
  if (m <= dz || dist === 0) return { x: 0, y: 0, kx, ky, active: true };
  // Rescale so output starts at zero at the edge of the dead zone (no jump), then apply the response curve.
  const scaled = Math.pow((m - dz) / (1 - dz), Math.max(0.5, cfg.curve));
  const out = clamp(scaled * cfg.sensitivity, 0, 1);
  return { x: clamp((dx / dist) * out, -1, 1), y: clamp((dy / dist) * out, -1, 1), kx, ky, active: true };
}

export interface StickController {
  /** A finger or mouse button went down at (x, y). Returns true when the stick took this pointer. */
  down(id: number, x: number, y: number): boolean;
  move(id: number, x: number, y: number): void;
  /** The pointer lifted, was cancelled by the browser, or lost capture. */
  up(id: number): void;
  /** Releases whatever is held (app switch, pause, orientation change, unmount). */
  reset(): void;
  config(c: Partial<StickConfig>): void;
  /** Centre of the stick: fixed position, or where the last touch started in floating mode. */
  centre(): { x: number; y: number };
  readonly pointer: number | null;
}

/**
 * Tracks exactly one pointer. Other pointers (the throttle thumb, a booster tap) are ignored, so two thumbs work at once.
 * Fixed mode: the stick only takes touches that start within `grab` pixels of its centre.
 * Floating mode: the stick re-centres where the touch starts (the zone itself decides which touches reach it).
 */
export function createStick(opts: { mode: 'fixed' | 'floating'; centre: { x: number; y: number }; grab?: number; cfg?: Partial<StickConfig>; onChange: (o: StickOutput) => void }): StickController {
  let cfg: StickConfig = { ...DEFAULT_STICK, ...opts.cfg };
  let pointer: number | null = null;
  let c = { ...opts.centre };
  const home = { ...opts.centre };
  const grab = opts.grab ?? cfg.radius * 1.9;
  const neutral = (): StickOutput => ({ x: 0, y: 0, kx: 0, ky: 0, active: false });
  return {
    get pointer() { return pointer; },
    down(id, x, y) {
      if (pointer !== null) return false;
      if (opts.mode === 'fixed') {
        if (Math.hypot(x - c.x, y - c.y) > grab) return false;
      } else {
        c = { x, y };
      }
      pointer = id;
      opts.onChange(stickVector(x - c.x, y - c.y, cfg));
      return true;
    },
    move(id, x, y) { if (id === pointer) opts.onChange(stickVector(x - c.x, y - c.y, cfg)); },
    up(id) { if (id !== pointer) return; pointer = null; if (opts.mode === 'floating') c = { ...home }; opts.onChange(neutral()); },
    reset() { pointer = null; if (opts.mode === 'floating') c = { ...home }; opts.onChange(neutral()); },
    config(n) { cfg = { ...cfg, ...n }; },
    centre: () => ({ ...c }),
  };
}

/** Throttle lever: position 0 (idle) at the bottom to 1 (full) at the top of its track. It stays where it is left. */
export function leverValue(clientY: number, top: number, height: number): number {
  if (height <= 0) return 0;
  return clamp(1 - (clientY - top) / height, 0, 1);
}
