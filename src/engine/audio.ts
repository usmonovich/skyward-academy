// Synthesised audio (Web Audio API): no audio files, works offline, fully adjustable.
type Sfx = 'click' | 'ok' | 'bad' | 'gate' | 'hit' | 'win' | 'fail' | 'radio' | 'unlock' | 'thunder';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let cfg = { sfx: true, engine: true, volume: 0.6 };
let eng: { osc: OscillatorNode; osc2: OscillatorNode; gain: GainNode; lp: BiquadFilterNode; kind: string; nodes: AudioScheduledSourceNode[] } | null = null;

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

/** Thunder: low-passed noise with a slow swell and a long tail. Synthesised, no recording. */
function rumble() {
  const c = ac();
  if (!c || !master) return;
  const dur = 2.6;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) { last = last * 0.96 + (Math.random() * 2 - 1) * 0.04; d[i] = last * 6; }
  const src = c.createBufferSource(); const f = c.createBiquadFilter(); const g = c.createGain();
  f.type = 'lowpass'; f.frequency.value = 180;
  const t0 = c.currentTime;
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.5, t0 + 0.25); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.buffer = buf; src.connect(f).connect(g).connect(master); src.start(t0);
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
      case 'thunder': rumble(); break;
    }
  },
  /**
   * Original synthesised engine sound, a different character for each kind of aircraft. A handful of oscillator and filter
   * nodes, all stopped together; there are no audio files. The "Aircraft engine sound" setting turns it off.
   */
  engineStart(kind: 'single' | 'twin' | 'turboprop' | 'jet' | 'airliner' = 'single') {
    const c = ac();
    if (!c || !master || !cfg.engine || eng) return;
    const nodes: AudioScheduledSourceNode[] = [];
    const gain = c.createGain(); const lp = c.createBiquadFilter(); lp.type = 'lowpass';
    const osc = c.createOscillator(); const osc2 = c.createOscillator();
    const mix = (n: AudioNode) => n.connect(lp);
    if (kind === 'single') { osc.type = 'sawtooth'; osc2.type = 'square'; lp.frequency.value = 420; gain.gain.value = 0.045; }
    else if (kind === 'twin') { osc.type = 'sawtooth'; osc2.type = 'sawtooth'; lp.frequency.value = 380; gain.gain.value = 0.045; }
    else if (kind === 'turboprop') {
      osc.type = 'triangle'; osc2.type = 'sawtooth'; lp.frequency.value = 520; gain.gain.value = 0.05;
      // The propeller throb: a slow tremolo on the level.
      const lfo = c.createOscillator(); const depth = c.createGain(); lfo.frequency.value = 14; depth.gain.value = 0.018; lfo.connect(depth).connect(gain.gain); lfo.start(); nodes.push(lfo);
    } else {
      // Jets and airliners: a low rumble plus filtered noise for the rush of air through the engines.
      osc.type = 'sine'; osc2.type = 'triangle'; lp.frequency.value = kind === 'airliner' ? 500 : 900; gain.gain.value = kind === 'airliner' ? 0.05 : 0.04;
      const len = Math.floor(c.sampleRate * 1.5); const buf = c.createBuffer(1, len, c.sampleRate); const d = buf.getChannelData(0);
      for (let k = 0; k < len; k++) d[k] = Math.random() * 2 - 1;
      const src = c.createBufferSource(); src.buffer = buf; src.loop = true; const ng = c.createGain(); ng.gain.value = 0.5; src.connect(ng); mix(ng); src.start(); nodes.push(src);
    }
    osc.frequency.value = 70; osc2.frequency.value = 35;
    mix(osc); mix(osc2); lp.connect(gain).connect(master);
    osc.start(); osc2.start(); nodes.push(osc, osc2);
    eng = { osc, osc2, gain, lp, kind, nodes };
  },
  engineSet(throttle: number) {
    if (!eng || !ctx) return;
    const jetty = eng.kind === 'jet' || eng.kind === 'airliner';
    const f = (jetty ? 45 : 60) + throttle * (jetty ? 40 : 70);
    eng.osc.frequency.setTargetAtTime(f, ctx.currentTime, 0.15);
    eng.osc2.frequency.setTargetAtTime(eng.kind === 'twin' ? f * 1.03 : f / 2, ctx.currentTime, 0.15);
    // A jet gets brighter as the throttle opens.
    if (jetty) eng.lp.frequency.setTargetAtTime((eng.kind === 'airliner' ? 400 : 700) + throttle * 900, ctx.currentTime, 0.2);
  },
  engineStop() {
    if (!eng) return;
    for (const n of eng.nodes) { try { n.stop(); } catch { /* already stopped */ } }
    eng = null;
  },
};
