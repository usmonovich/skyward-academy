// Skyward Academy AI tutor proxy.
//
// The browser never holds an API key. It POSTs { message, lesson, question } to this server, which calls
// Claude with a teaching system prompt and the verified lesson text as grounding.
//
// Run:   ANTHROPIC_API_KEY=...  npm run tutor-proxy          (or sign in once with `ant auth login`)
// Then:  VITE_TUTOR_ENDPOINT=http://localhost:8787/tutor  npm run dev
//
// Environment:
//   TUTOR_PORT            port to listen on (default 8787)
//   TUTOR_ALLOWED_ORIGIN  browser origin allowed to call the proxy (default http://localhost:5173)
//   TUTOR_MODEL           Claude model id (default claude-opus-5-5)
import http from 'node:http';
import Anthropic from '@anthropic-ai/sdk';

const PORT = Number(process.env.TUTOR_PORT || 8787);
const ORIGIN = process.env.TUTOR_ALLOWED_ORIGIN || 'http://localhost:5173';
const MODEL = process.env.TUTOR_MODEL || 'claude-opus-5-5';
const MAX_BODY = 64 * 1024;
const PER_MINUTE = 20;

// Resolves credentials from the environment (ANTHROPIC_API_KEY, ANTHROPIC_AUTH_TOKEN or an `ant auth login` profile).
const client = new Anthropic();

// Stable text first so it can be cached; the per-request lesson context goes in the user turn.
const SYSTEM = `You are the Skyward Academy aviation tutor. You help a student understand one lesson at a time.

How to teach:
- Guide the student to the answer. Give a hint, a simpler explanation, or the next step — do not simply state the final answer to a practice or assessment question. If the student has clearly tried and is still stuck, walk through the method with different numbers.
- Use clear, natural English. Start simple; add technical terms only with a short definition.
- Keep replies short: a few sentences or a short numbered list.

Accuracy rules:
- Ground your answer in the lesson context supplied with the question. If the context does not cover the question, say so plainly and answer only with well-established general principles.
- Never invent regulations, procedures, limits, speeds, frequencies or aircraft-specific numbers. If the student asks for one, tell them to check the official publication of their aviation authority or the aircraft's approved flight manual.
- Rules differ between authorities (for example EASA and FAA). Do not present one authority's rule as universal.
- Say clearly when a model is simplified.
- This is a study aid. It does not replace a flight instructor, and it does not issue licences or ICAO language endorsements.

Write plain text only. Do not use Markdown headings or tables.`;

const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > PER_MINUTE;
}

const text = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '');

function buildUserTurn(body) {
  const parts = [];
  const l = body.lesson;
  if (l && typeof l === 'object') {
    parts.push(`<lesson title="${text(l.title, 200)}">`);
    if (Array.isArray(l.objectives)) parts.push(`Objectives: ${l.objectives.map((o) => text(o, 300)).join(' | ')}`);
    if (l.summary) parts.push(`Summary: ${text(l.summary, 1500)}`);
    for (const s of Array.isArray(l.sections) ? l.sections.slice(0, 12) : []) {
      parts.push(`## ${text(s.heading, 200)}\n${text(s.text, 4000)}${s.limitation ? `\nModel limitation: ${text(s.limitation, 800)}` : ''}`);
    }
    parts.push('</lesson>');
  } else {
    parts.push('(No lesson is open. Answer from well-established general principles only.)');
  }
  if (body.question?.prompt) parts.push(`The student is working on this practice question (do not reveal its answer): ${text(body.question.prompt, 1000)}`);
  parts.push(`Student's question: ${text(body.message, 2000)}`);
  return parts.join('\n\n');
}

async function answer(body) {
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: 'medium' },
    // If a safety classifier declines the request, the API retries on a fallback model in the same call.
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: buildUserTurn(body) }],
  });
  if (response.stop_reason === 'refusal') return 'I cannot help with that request. Try asking about the lesson topic in a different way.';
  const reply = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
  if (response.stop_reason === 'max_tokens') return `${reply}\n\n(The answer was cut short. Ask a narrower question.)`;
  return reply || 'I could not produce an answer. Please try rephrasing your question.';
}

function send(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method !== 'POST' || req.url !== '/tutor') return send(res, 404, { error: 'Not found' });
  if (req.headers.origin && req.headers.origin !== ORIGIN) return send(res, 403, { error: 'Origin not allowed' });
  if (limited(req.socket.remoteAddress || 'unknown')) return send(res, 429, { error: 'Too many questions. Wait a minute and try again.' });

  let raw = '';
  let tooBig = false;
  req.on('data', (chunk) => { raw += chunk; if (raw.length > MAX_BODY) { tooBig = true; req.destroy(); } });
  req.on('end', async () => {
    if (tooBig) return;
    let body;
    try { body = JSON.parse(raw); } catch { return send(res, 400, { error: 'Request body must be JSON.' }); }
    if (!body || typeof body.message !== 'string' || !body.message.trim()) return send(res, 400, { error: 'A "message" is required.' });
    try {
      send(res, 200, { reply: await answer(body) });
    } catch (error) {
      // Most specific first. Details go to the server log, never to the browser.
      if (error instanceof Anthropic.AuthenticationError) { console.error('Tutor proxy: credentials missing or invalid.'); return send(res, 500, { error: 'The tutor service is not configured.' }); }
      if (error instanceof Anthropic.RateLimitError) return send(res, 429, { error: 'The tutor is busy. Try again in a moment.' });
      if (error instanceof Anthropic.BadRequestError) { console.error('Tutor proxy: bad request:', error.message); return send(res, 502, { error: 'The tutor could not process that question.' }); }
      if (error instanceof Anthropic.APIError) { console.error(`Tutor proxy: API error ${error.status}:`, error.message); return send(res, 502, { error: 'The tutor service is temporarily unavailable.' }); }
      console.error('Tutor proxy: unexpected error:', error);
      send(res, 500, { error: 'Unexpected tutor error.' });
    }
  });
});

server.listen(PORT, () => console.log(`Skyward Academy tutor proxy listening on http://localhost:${PORT}/tutor (model ${MODEL}, allowed origin ${ORIGIN})`));
