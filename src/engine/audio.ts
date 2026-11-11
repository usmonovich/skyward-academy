// Synthesised audio (Web Audio API): no audio files, works offline, fully adjustable.
type Sfx = 'click' | 'ok' | 'bad' | 'gate' | 'hit' | 'win' | 'fail' | 'radio' | 'unlock';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let cfg = { sfx: true, engine: true, volume: 0.6 };
let eng: { osc: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null = null;

function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ctx) {
      const C = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!C) return null;
      ctx = new C();
      master = ctx.createGain();
      master.gain.value = cfg.volume;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch { return null; }
}

function tone(freq: number, dur: number, type: OscillatorType = 'sine', gain = 0.2, delay = 0, slideTo?: number) {
  const c = ac();
  if (!c || !master) return;
  const o = c.createOscillator();
  const g = c.createGain();
  const t0 = c.currentTime + delay;
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(master);
  o.start(t0);
  o.stop(t0 + dur + 0.03);
}

function noise(dur: number, gain = 0.08) {
  const c = ac();
  if (!c || !master) return;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = c.createBufferSource();
  const g = c.createGain();
  const f = c.createBiquadFilter();
  f.type = 'bandpass'; f.frequency.value = 1800;
  g.gain.value = gain;
  src.buffer = buf;
  src.connect(f).connect(g).connect(master);
  src.start();
}

export const audio = {
  configure(next: { sfx: boolean; engine: boolean; volume: number }) {
    cfg = { ...next };
    if (master) master.gain.value = cfg.volume;
    if (!cfg.engine) audio.engineStop();
  },
  sfx(name: Sfx) {
    if (!cfg.sfx || cfg.volume <= 0) return;
    switch (name) {
      case 'click': tone(660, 0.05, 'triangle', 0.08); break;
      case 'ok': tone(660, 0.1, 'sine', 0.16); tone(990, 0.16, 'sine', 0.16, 0.09); break;
      case 'bad': tone(220, 0.22, 'sawtooth', 0.09, 0, 150); break;
      case 'gate': tone(880, 0.08, 'sine', 0.15); tone(1320, 0.12, 'sine', 0.13, 0.06); break;
      case 'hit': noise(0.25, 0.25); tone(120, 0.25, 'square', 0.12, 0, 60); break;
      case 'win': [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.16, i * 0.11)); break;
      case 'fail': tone(330, 0.2, 'triangle', 0.14); tone(247, 0.35, 'triangle', 0.14, 0.18); break;
      case 'radio': noise(0.12, 0.07); break;
      case 'unlock': [660, 880, 1175].forEach((f, i) => tone(f, 0.18, 'sine', 0.15, i * 0.09)); break;
    }
  },
  engineStart() {
    const c = ac();
    if (!c || !master || !cfg.engine || eng) return;
    const osc = c.createOscillator(); const osc2 = c.createOscillator(); const gain = c.createGain();
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420;
    osc.type = 'sawtooth'; osc2.type = 'square';
    osc.frequency.value = 70; osc2.frequency.value = 35;
    gain.gain.value = 0.045;
    osc.connect(lp); osc2.connect(lp); lp.connect(gain).connect(master);
    osc.start(); osc2.start();
    eng = { osc, osc2, gain };
  },
  engineSet(throttle: number) {
    if (!eng || !ctx) return;
    const f = 60 + throttle * 70;
    eng.osc.frequency.setTargetAtTime(f, ctx.currentTime, 0.15);
    eng.osc2.frequency.setTargetAtTime(f / 2, ctx.currentTime, 0.15);
  },
  engineStop() {
    if (!eng) return;
    try { eng.osc.stop(); eng.osc2.stop(); } catch { /* already stopped */ }
    eng = null;
  },
};
