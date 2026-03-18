const express = require('express');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');

const app = express();
const PORT = 5000;

app.use(express.json({ limit: '2mb' }));

// ── OpenAI client (Replit AI Integration — lazy init) ────────────────────────
let _openai = null;
function getOpenAI() {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || 'placeholder',
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
    });
  }
  return _openai;
}

async function callOpenAI(systemPrompt, userPrompt) {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });
  return response.choices[0].message.content.trim();
}

// ── Main Navigation UI ────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Module 1 Static Apps ──────────────────────────────────────────────────────
app.use('/apps/touch-typing-B/v1', express.static(path.join(__dirname, 'touch-typing-B/v1')));
app.use('/apps/touch-typing-B/v2', express.static(path.join(__dirname, 'touch-typing-B/v2')));

app.use('/apps/unit-converter-M', express.static(path.join(__dirname, 'unit-converter-M')));

app.use('/apps/to-do-app-M', express.static(path.join(__dirname, 'to-do-app-M')));

app.use('/apps/pomodoro-timer-B/v1', express.static(path.join(__dirname, 'pomodoro-timer-B/v1')));
app.use('/apps/pomodoro-timer-B/v2', express.static(path.join(__dirname, 'pomodoro-timer-B/v2')));
app.use('/apps/pomodoro-timer-B/v3', express.static(path.join(__dirname, 'pomodoro-timer-B/v3')));

app.use('/apps/reminder-app-M', express.static(path.join(__dirname, 'reminder-app-M')));

// ── Module 2 Static Apps ──────────────────────────────────────────────────────
app.use('/apps/sleep-tracker-B/v1', express.static(path.join(__dirname, 'sleep-tracker-B/v1')));
app.use('/apps/sleep-tracker-B/v3', express.static(path.join(__dirname, 'sleep-tracker-B/v3')));
app.use('/apps/sleep-pattern-app-M/localStorage', express.static(path.join(__dirname, 'sleep-pattern-app-M/localStorage')));

// Sleep Tracker B v2 (JSON persistence)
const SLEEP_DATA_FILE = path.join(__dirname, 'sleep-tracker-B/v2/sleep-data.json');
app.get('/apps/sleep-tracker-B/v2/api/data', (req, res) => {
  try {
    const data = fs.existsSync(SLEEP_DATA_FILE)
      ? JSON.parse(fs.readFileSync(SLEEP_DATA_FILE, 'utf8'))
      : [];
    res.json(data);
  } catch (e) { res.json([]); }
});
app.post('/apps/sleep-tracker-B/v2/api/entries', (req, res) => {
  try {
    const data = fs.existsSync(SLEEP_DATA_FILE)
      ? JSON.parse(fs.readFileSync(SLEEP_DATA_FILE, 'utf8'))
      : [];
    const entry = { ...req.body, id: Date.now() };
    data.push(entry);
    fs.writeFileSync(SLEEP_DATA_FILE, JSON.stringify(data, null, 2));
    res.json(entry);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.use('/apps/sleep-tracker-B/v2', express.static(path.join(__dirname, 'sleep-tracker-B/v2')));

// Sleep Pattern App M (json-storage)
const SLEEP_PATTERN_DATA_FILE = path.join(__dirname, 'sleep-pattern-app-M/json-storage/data.json');
app.get('/apps/sleep-pattern-app-M/json-storage/api/data', (req, res) => {
  try {
    const data = fs.existsSync(SLEEP_PATTERN_DATA_FILE)
      ? JSON.parse(fs.readFileSync(SLEEP_PATTERN_DATA_FILE, 'utf8'))
      : { user: null, entries: [], pendingAlert: null };
    res.json(data);
  } catch (e) { res.json({ user: null, entries: [], pendingAlert: null }); }
});
app.post('/apps/sleep-pattern-app-M/json-storage/api/data', (req, res) => {
  try {
    fs.writeFileSync(SLEEP_PATTERN_DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.use('/apps/sleep-pattern-app-M/json-storage', express.static(path.join(__dirname, 'sleep-pattern-app-M/json-storage')));

// ── Module 3 ──────────────────────────────────────────────────────────────────
app.use('/apps/trivia-game-B/v1', express.static(path.join(__dirname, 'trivia-game-B/v1')));
app.use('/apps/trivia-game-B/v2', express.static(path.join(__dirname, 'trivia-game-B/v2')));

// Trivia Game Retro M (built React/Vite app)
app.use('/apps/trivia-game-retro-M', express.static(path.join(__dirname, 'trivia-game-retro-M/dist')));
app.get('/apps/trivia-game-retro-M/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'trivia-game-retro-M/dist/index.html'));
});

// ── Capstone: Language Learning ───────────────────────────────────────────────

// Language Learning B — static files (public/ dir)
app.use('/apps/language-learning-B/v1', express.static(path.join(__dirname, 'language-learning-B/v1/public')));
app.use('/apps/language-learning-B/v2', express.static(path.join(__dirname, 'language-learning-B/v2/public')));
app.use('/apps/language-learning-B/v3', express.static(path.join(__dirname, 'language-learning-B/v3/public')));

// Language Learning M v1 (no API)
app.use('/apps/language-learning-app-M/v1', express.static(path.join(__dirname, 'language-learning-app-M/v1-noAPI')));

// Language Learning M v2 (with API — frontend calls /language-learning/api/vocabulary-lookup)
app.use('/apps/language-learning-app-M/v2', express.static(path.join(__dirname, 'language-learning-app-M/V2-API/language-learning-app-noAPI')));

// ── OpenAI API: /api/words (Language Learning B all versions) ─────────────────
const ALLOWED_LANGUAGES = ['Spanish', 'French', 'Japanese', 'German', 'Portuguese'];
const ALLOWED_DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

app.post('/api/words', async (req, res) => {
  const { language, difficulty } = req.body;
  if (!language || !ALLOWED_LANGUAGES.includes(language)) {
    return res.status(400).json({ error: 'Invalid language selection.' });
  }
  const level = ALLOWED_DIFFICULTIES.includes(difficulty) ? difficulty : 'Beginner';
  const levelDescriptions = {
    Beginner: 'very common everyday words that a complete beginner would learn first',
    Intermediate: 'words useful for everyday conversation that go beyond the basics',
    Advanced: 'sophisticated vocabulary, idiomatic expressions, or nuanced terms',
  };
  const prompt = `Give me exactly 5 ${level} vocabulary words in ${language} for a language learner.
Level guidance: ${levelDescriptions[level]}
Return ONLY a valid JSON array. No extra text, no markdown, no code fences.
Each element must have exactly these three fields:
- "word": the word in ${language}
- "translation": its English translation
- "sentence": one example sentence in ${language}
Example: [{"word":"...","translation":"...","sentence":"..."}]`;

  try {
    const raw = await callOpenAI(
      'You are a language learning assistant. Return only valid JSON arrays as instructed.',
      prompt
    );
    const words = JSON.parse(raw);
    if (!Array.isArray(words) || words.length === 0) throw new Error('Bad shape');
    return res.json({ words });
  } catch (err) {
    console.error('/api/words error:', err.message);
    return res.status(502).json({ error: 'AI service error. Please try again.' });
  }
});

// ── OpenAI API: /api/lookup (Language Learning B v2/v3) ──────────────────────
app.post('/api/lookup', async (req, res) => {
  const { query, language } = req.body;
  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'Please enter a word or phrase to look up.' });
  }
  if (!language || !ALLOWED_LANGUAGES.includes(language)) {
    return res.status(400).json({ error: 'Invalid language selection.' });
  }
  const prompt = `I am learning ${language}. Look up: "${query.trim()}"
Return ONLY a valid JSON object. No extra text, no markdown, no code fences.
Fields:
- "translation": the English translation
- "pronunciation": a short plain-English pronunciation tip
- "sentences": an array of exactly 2 example sentences in ${language}
Example: {"translation":"...","pronunciation":"...","sentences":["...","..."]}`;

  try {
    const raw = await callOpenAI(
      'You are a language learning assistant. Return only valid JSON objects as instructed.',
      prompt
    );
    const result = JSON.parse(raw);
    return res.json(result);
  } catch (err) {
    console.error('/api/lookup error:', err.message);
    return res.status(502).json({ error: 'AI service error. Please try again.' });
  }
});

// ── OpenAI API: /api/health (Language Learning B v3) ─────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ── OpenAI API: /language-learning/api/vocabulary-lookup (Language Learning M v2) ──
app.post('/language-learning/api/vocabulary-lookup', async (req, res) => {
  const { word, language } = req.body;
  if (!word || !language) {
    return res.status(400).json({ error: 'word and language are required.' });
  }
  try {
    const raw = await callOpenAI(
      'You are a language tutor. Respond ONLY with a raw JSON object — no markdown, no code fences, no extra text. ' +
      'Shape: {"definition":"<English definition>","examples":["<sentence 1>","<sentence 2>","<sentence 3>"]}',
      `Define the ${language} word or phrase: "${word}"`
    );
    const parsed = JSON.parse(raw);
    return res.json(parsed);
  } catch (err) {
    console.error('/language-learning/api/vocabulary-lookup error:', err.message);
    return res.status(502).json({ error: 'AI service error. Please try again.' });
  }
});

// ── OpenAI API: /api/generate (Flashcards M v3 with LLM) ─────────────────────
function buildGenerationPrompt(cards, count) {
  const knownCards = cards.filter(c => c.known).slice(0, 30);
  const unknownCards = cards.filter(c => !c.known).slice(0, 30);
  const existingQuestions = cards.map(c => c.question).filter(q => typeof q === 'string' && q.trim()).slice(-120);
  return [
    { role: 'system', content: 'You generate concise study flashcards. Return valid JSON only.' },
    {
      role: 'user',
      content: `Generate ${count} new flashcards based on this deck.\n\nRules:\n- Output JSON array only.\n- Each item: {"question": string, "answer": string}.\n- Keep them short and practical.\n- Do not repeat existing questions.\n- Focus on unknown cards.\n\nUnknown cards:\n${unknownCards.map((c, i) => `${i + 1}. ${c.question}`).join('\n') || 'None'}\n\nKnown cards:\n${knownCards.map((c, i) => `${i + 1}. ${c.question}`).join('\n') || 'None'}\n\nExisting questions (do not duplicate):\n${existingQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n') || 'None'}`,
    },
  ];
}

function parseGeneratedCards(content) {
  if (!content) return [];
  try { return JSON.parse(content); } catch {}
  const s = content.indexOf('['), e = content.lastIndexOf(']');
  if (s >= 0 && e > s) {
    try { return JSON.parse(content.slice(s, e + 1)); } catch {}
  }
  return [];
}

app.post('/api/generate', async (req, res) => {
  const count = Number.isInteger(req.body?.count) ? Math.max(1, Math.min(req.body.count, 12)) : 3;
  const incomingCards = Array.isArray(req.body?.cards) ? req.body.cards : [];
  if (incomingCards.length === 0) {
    return res.status(400).json({ error: 'At least one existing flashcard is required.' });
  }
  const cards = incomingCards
    .filter(c => typeof c?.question === 'string' && typeof c?.answer === 'string')
    .map(c => ({ question: c.question.trim(), answer: c.answer.trim(), known: c.known === true }))
    .filter(c => c.question && c.answer);
  if (cards.length === 0) {
    return res.status(400).json({ error: 'No valid cards provided.' });
  }

  try {
    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: buildGenerationPrompt(cards, count),
    });
    const raw = response.choices?.[0]?.message?.content || '[]';
    const generated = parseGeneratedCards(raw)
      .filter(c => typeof c?.question === 'string' && typeof c?.answer === 'string')
      .map(c => ({ question: c.question.trim(), answer: c.answer.trim() }))
      .filter(c => c.question && c.answer)
      .slice(0, count);
    const existingLower = new Set(cards.map(c => c.question.toLowerCase()));
    const deduped = generated.filter(c => !existingLower.has(c.question.toLowerCase()));
    return res.json({ cards: deduped });
  } catch (err) {
    console.error('/api/generate error:', err.message);
    return res.status(500).json({ error: 'Failed to generate cards. Please try again.' });
  }
});

// ── Capstone: Recipe Vault (built React/Vite app) ────────────────────────────
app.use('/apps/recipe-vault-M', express.static(path.join(__dirname, 'recipe-vault-cocobean-M/dist')));
app.get('/apps/recipe-vault-M/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'recipe-vault-cocobean-M/dist/index.html'));
});

// ── Throughline: Flashcards ───────────────────────────────────────────────────
app.use('/apps/flashcards-app-M/v1', express.static(path.join(__dirname, 'flashcards-app-M/v1')));
app.use('/apps/flashcards-app-M/v2', express.static(path.join(__dirname, 'flashcards-app-M/v2')));
// v3 with LLM — frontend calls /api/generate (handled above)
app.use('/apps/flashcards-app-M/v3', express.static(path.join(__dirname, 'flashcards-app-M/v3-withLLM')));

app.use('/apps/flashcards-B/v1', express.static(path.join(__dirname, 'flashcards-B/v1')));
app.use('/apps/flashcards-B/v2', express.static(path.join(__dirname, 'flashcards-B/v2')));
app.use('/apps/flashcards-B/v3', express.static(path.join(__dirname, 'flashcards-B/v3')));

// ── Prompts API ───────────────────────────────────────────────────────────────
app.get('/api/prompts', (req, res) => {
  const { file } = req.query;
  if (!file) return res.status(400).json({ error: 'file param required' });
  const resolved = path.resolve(__dirname, file);
  if (!resolved.startsWith(__dirname)) return res.status(403).json({ error: 'Forbidden' });
  if (!fs.existsSync(resolved)) return res.status(404).json({ error: 'File not found' });
  res.json({ content: fs.readFileSync(resolved, 'utf8') });
});

// ── SPA fallback ──────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`FITA Course Demo running on http://0.0.0.0:${PORT}`);
});
