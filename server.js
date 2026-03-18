const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(express.json());

// Serve the main navigation UI
app.use(express.static(path.join(__dirname, 'public')));

// ── Static app routes ─────────────────────────────────────────────────────────

// Module 1 - Touch Typing B
app.use('/apps/touch-typing-B/v1', express.static(path.join(__dirname, 'touch-typing-B/v1')));
app.use('/apps/touch-typing-B/v2', express.static(path.join(__dirname, 'touch-typing-B/v2')));

// Module 1 - Unit Converter M
app.use('/apps/unit-converter-M', express.static(path.join(__dirname, 'unit-converter-M')));

// Module 1 - To-Do App M
app.use('/apps/to-do-app-M', express.static(path.join(__dirname, 'to-do-app-M')));

// Module 1 - Pomodoro Timer B
app.use('/apps/pomodoro-timer-B/v1', express.static(path.join(__dirname, 'pomodoro-timer-B/v1')));
app.use('/apps/pomodoro-timer-B/v2', express.static(path.join(__dirname, 'pomodoro-timer-B/v2')));
app.use('/apps/pomodoro-timer-B/v3', express.static(path.join(__dirname, 'pomodoro-timer-B/v3')));

// Module 1 - Reminder App M
app.use('/apps/reminder-app-M', express.static(path.join(__dirname, 'reminder-app-M')));

// Module 2 - Sleep Tracker B
app.use('/apps/sleep-tracker-B/v1', express.static(path.join(__dirname, 'sleep-tracker-B/v1')));
app.use('/apps/sleep-tracker-B/v3', express.static(path.join(__dirname, 'sleep-tracker-B/v3')));

// Module 2 - Sleep Pattern App M (localStorage version)
app.use('/apps/sleep-pattern-app-M/localStorage', express.static(path.join(__dirname, 'sleep-pattern-app-M/localStorage')));

// Module 3 - Trivia Game B
app.use('/apps/trivia-game-B/v1', express.static(path.join(__dirname, 'trivia-game-B/v1')));
app.use('/apps/trivia-game-B/v2', express.static(path.join(__dirname, 'trivia-game-B/v2')));

// Module 3 - Trivia Game Retro M (note: this is a Vite build, serve dist if available)
// We'll serve the source files directly since there's no built dist
app.use('/apps/trivia-game-retro-M', express.static(path.join(__dirname, 'trivia-game-retro-M')));

// Capstone - Language Learning B
app.use('/apps/language-learning-B/v1', express.static(path.join(__dirname, 'language-learning-B/v1/public')));
app.use('/apps/language-learning-B/v2', express.static(path.join(__dirname, 'language-learning-B/v2/public')));
app.use('/apps/language-learning-B/v3', express.static(path.join(__dirname, 'language-learning-B/v3/public')));

// Capstone - Language Learning M v1 (no API)
app.use('/apps/language-learning-app-M/v1', express.static(path.join(__dirname, 'language-learning-app-M/v1-noAPI')));

// Flashcards M
app.use('/apps/flashcards-app-M/v1', express.static(path.join(__dirname, 'flashcards-app-M/v1')));
app.use('/apps/flashcards-app-M/v2', express.static(path.join(__dirname, 'flashcards-app-M/v2')));

// Flashcards B
app.use('/apps/flashcards-B/v1', express.static(path.join(__dirname, 'flashcards-B/v1')));
app.use('/apps/flashcards-B/v2', express.static(path.join(__dirname, 'flashcards-B/v2')));
app.use('/apps/flashcards-B/v3', express.static(path.join(__dirname, 'flashcards-B/v3')));

// ── API: serve prompts-learner.md content ─────────────────────────────────────
app.get('/api/prompts', (req, res) => {
  const { file } = req.query;
  if (!file) return res.status(400).json({ error: 'file param required' });

  // Sanitize - only allow paths within the workspace, no traversal
  const resolved = path.resolve(__dirname, file);
  if (!resolved.startsWith(__dirname)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (!fs.existsSync(resolved)) {
    return res.status(404).json({ error: 'File not found' });
  }

  const content = fs.readFileSync(resolved, 'utf8');
  res.json({ content });
});

// ── Sleep tracker B v2 - JSON persistence API ─────────────────────────────────
const SLEEP_DATA_FILE = path.join(__dirname, 'sleep-tracker-B/v2/sleep-data.json');

app.get('/apps/sleep-tracker-B/v2/api/data', (req, res) => {
  try {
    const data = fs.existsSync(SLEEP_DATA_FILE)
      ? JSON.parse(fs.readFileSync(SLEEP_DATA_FILE, 'utf8'))
      : [];
    res.json(data);
  } catch (e) {
    res.json([]);
  }
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
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.use('/apps/sleep-tracker-B/v2', express.static(path.join(__dirname, 'sleep-tracker-B/v2')));

// ── Sleep pattern app M (json-storage) API ────────────────────────────────────
const SLEEP_PATTERN_DATA_FILE = path.join(__dirname, 'sleep-pattern-app-M/json-storage/data.json');

app.get('/apps/sleep-pattern-app-M/json-storage/api/data', (req, res) => {
  try {
    const data = fs.existsSync(SLEEP_PATTERN_DATA_FILE)
      ? JSON.parse(fs.readFileSync(SLEEP_PATTERN_DATA_FILE, 'utf8'))
      : { user: null, entries: [], pendingAlert: null };
    res.json(data);
  } catch (e) {
    res.json({ user: null, entries: [], pendingAlert: null });
  }
});

app.post('/apps/sleep-pattern-app-M/json-storage/api/data', (req, res) => {
  try {
    fs.writeFileSync(SLEEP_PATTERN_DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.use('/apps/sleep-pattern-app-M/json-storage', express.static(path.join(__dirname, 'sleep-pattern-app-M/json-storage')));

// Flashcard app v3 with LLM - serve static files (LLM calls require API key)
app.use('/apps/flashcards-app-M/v3', express.static(path.join(__dirname, 'flashcards-app-M/v3-withLLM')));

// Language Learning App M v2 (API)
app.use('/apps/language-learning-app-M/v2', express.static(path.join(__dirname, 'language-learning-app-M/V2-API/language-learning-app-noAPI')));

// Catch-all: serve index.html for the SPA navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`FITA Course Demo running on http://0.0.0.0:${PORT}`);
});
