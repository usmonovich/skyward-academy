// Browser speech services: text-to-speech (speechSynthesis) and speech-to-text (Web Speech API).
// Speech recognition is provided by the browser vendor; in Chrome and Edge the audio is sent to the
// vendor's servers for transcription. This app never stores or uploads audio itself.

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

export function englishVoices(): SpeechSynthesisVoice[] {
  if (!canSpeak()) return [];
  return window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en'));
}

/** Speaks text. `voice` cycles through the installed English voices so learners hear different accents where available. */
export function speak(text: string, opts: { rate?: number; voice?: number; onEnd?: () => void } = {}) {
  if (!canSpeak()) { opts.onEnd?.(); return; }
  const u = new SpeechSynthesisUtterance(text);
  const voices = englishVoices();
  if (voices.length) u.voice = voices[(opts.voice ?? 0) % voices.length];
  u.lang = u.voice?.lang ?? 'en-US';
  u.rate = opts.rate ?? 1;
  u.onend = () => opts.onEnd?.();
  u.onerror = () => opts.onEnd?.();
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

export const stopSpeaking = () => { if (canSpeak()) window.speechSynthesis.cancel(); };

interface RecognitionLike {
  lang: string; interimResults: boolean; continuous: boolean; maxAlternatives: number;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string; confidence: number }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void; stop(): void; abort(): void;
}

function recognitionCtor(): (new () => RecognitionLike) | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as { SpeechRecognition?: new () => RecognitionLike; webkitSpeechRecognition?: new () => RecognitionLike };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export const canListen = () => !!recognitionCtor();

const ERRORS: Record<string, string> = {
  'not-allowed': 'Microphone permission was denied. Allow microphone access in your browser, or type your transmission instead.',
  'service-not-allowed': 'Speech recognition is blocked in this browser. Type your transmission instead.',
  'no-speech': 'No speech was detected. Check your microphone and try again, or type your transmission.',
  'audio-capture': 'No microphone was found. Connect one, or type your transmission.',
  network: 'Speech recognition needs an internet connection in this browser. Type your transmission instead.',
};

/** Starts one recognition pass. The browser asks for microphone permission the first time this is called. */
export function listen(cb: { onResult: (text: string, confidence: number) => void; onError: (message: string) => void; onEnd: () => void }): () => void {
  const C = recognitionCtor();
  if (!C) { cb.onError('Speech recognition is not available in this browser. Type your transmission instead.'); cb.onEnd(); return () => {}; }
  const r = new C();
  r.lang = 'en-US'; r.interimResults = false; r.continuous = false; r.maxAlternatives = 1;
  r.onresult = (e) => { const alt = e.results[0][0]; cb.onResult(alt.transcript, alt.confidence); };
  r.onerror = (e) => cb.onError(ERRORS[e.error] ?? `Speech recognition error: ${e.error}. You can type your transmission instead.`);
  r.onend = () => cb.onEnd();
  try { r.start(); } catch { cb.onError('Could not start speech recognition. Type your transmission instead.'); cb.onEnd(); }
  return () => { try { r.abort(); } catch { /* already stopped */ } };
}
