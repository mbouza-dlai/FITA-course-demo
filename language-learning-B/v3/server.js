/**
 * server.js — Language Learning App Backend (Phase 3 — Production Ready)
 *
 * Changes from Phase 2:
 *   - Added CORS headers for deployed environments
 *   - Improved error messages that are user-friendly (no internal details leaked)
 *   - Added a /health endpoint that hosting platforms can ping to verify the app is up
 *   - Tightened input length limits to prevent abuse
 *
 * Two API endpoints:
 *   POST /api/words  — fetches 5 vocabulary words with difficulty level
 *   POST /api/lookup — looks up a custom word/phrase
 *   GET  /health     — returns { status: "ok" } for uptime checks
 *
 * The OpenAI API key lives only in process.env — never in the browser.
 *
 * Local setup:
 *   1. cp .env.example .env  (then add your API key)
 *   2. npm install
 *   3. node server.js
 *   4. Open http://localhost:3000
 *
 * Deployed setup (Vercel / Netlify / Railway):
 *   - Set OPENAI_API_KEY as an Environment Variable in the hosting dashboard
 *   - The PORT variable is set automatically by the platform
 */

const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));  // Reject oversized request bodies
app.use(express.static(path.join(__dirname, 'public')));

// Basic CORS headers — needed when the deployed front-end and server are
// on different origins (e.g. Vercel static + Railway server)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ─── Allowed Values ────────────────────────────────────────────────────────
const ALLOWED_LANGUAGES    = ['Spanish', 'French', 'Japanese', 'German', 'Portuguese'];
const ALLOWED_DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

// ─── Health Check ──────────────────────────────────────────────────────────
// Hosting platforms and uptime monitors can call GET /health to confirm
// the server is running and the API key is present.
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    apiKeySet: !!process.env.OPENAI_API_KEY
  });
});

// ─── Helper: verify API key is configured ─────────────────────────────────
function requireApiKey(res) {
  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({
      error: 'The app is not configured correctly. The API key is missing — please contact the site owner.'
    });
    return false;
  }
  return true;
}

// ─── Helper: call OpenAI ───────────────────────────────────────────────────
async function callOpenAI(systemPrompt, userPrompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt }
      ],
      temperature: 0.8
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // Log the real error server-side, but send a user-friendly message to the browser
    console.error('OpenAI API error:', errorData?.error?.message || response.status);
    throw new Error('The AI service returned an error. Please try again in a moment.');
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

/**
 * POST /api/words
 * Body: { language: "Spanish", difficulty: "Beginner" }
 * Returns: { words: [ { word, translation, sentence } x5 ] }
 */
app.post('/api/words', async (req, res) => {
  const { language, difficulty } = req.body;

  if (!language || !ALLOWED_LANGUAGES.includes(language)) {
    return res.status(400).json({ error: 'Invalid language selection.' });
  }

  const level = ALLOWED_DIFFICULTIES.includes(difficulty) ? difficulty : 'Beginner';

  if (!requireApiKey(res)) return;

  const levelDescriptions = {
    Beginner:     'very common everyday words that a complete beginner would learn first (e.g. greetings, numbers, colours, basic objects)',
    Intermediate: 'words useful for everyday conversation that go beyond the basics (e.g. emotions, activities, travel, food descriptions)',
    Advanced:     'sophisticated or nuanced vocabulary including less common words, idiomatic expressions, or technical terms'
  };

  const prompt = `Give me exactly 5 ${level} vocabulary words in ${language} for a language learner.

Level guidance: ${levelDescriptions[level]}

Return ONLY a valid JSON array. No extra text, no markdown, no code fences.

Each element must have exactly these three fields:
- "word": the word in ${language}
- "translation": its English translation
- "sentence": one example sentence in ${language} that uses the word in context

Example format:
[
  {
    "word": "...",
    "translation": "...",
    "sentence": "..."
  }
]`;

  try {
    const rawContent = await callOpenAI(
      'You are a language learning assistant. You return only valid JSON arrays as instructed. No extra explanation.',
      prompt
    );

    let words;
    try {
      words = JSON.parse(rawContent);
    } catch {
      console.error('Failed to parse AI response as JSON:', rawContent);
      return res.status(502).json({ error: 'The AI returned an unexpected format. Please try again.' });
    }

    if (!Array.isArray(words) || words.length === 0) {
      return res.status(502).json({ error: 'Unexpected AI response structure. Please try again.' });
    }

    return res.json({ words });

  } catch (err) {
    console.error('Error in /api/words:', err.message);
    return res.status(503).json({ error: err.message || 'Could not reach the AI service.' });
  }
});

/**
 * POST /api/lookup
 * Body: { query: "hacer", language: "Spanish" }
 * Returns: { translation, pronunciation, sentences: [string, string] }
 */
app.post('/api/lookup', async (req, res) => {
  const { query, language } = req.body;

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ error: 'Please enter a word or phrase to look up.' });
  }

  // Prevent abuse with very long inputs
  if (query.trim().length > 200) {
    return res.status(400).json({ error: 'Please keep your lookup to 200 characters or fewer.' });
  }

  if (!language || !ALLOWED_LANGUAGES.includes(language)) {
    return res.status(400).json({ error: 'Invalid language selection.' });
  }

  if (!requireApiKey(res)) return;

  const prompt = `I am learning ${language}. Look up the following word or phrase for me: "${query.trim()}"

Return ONLY a valid JSON object. No extra text, no markdown, no code fences.

The object must have exactly these fields:
- "translation": the English translation (or the ${language} translation if the input is in English)
- "pronunciation": a short, plain-English tip on how to pronounce the word or phrase
- "sentences": an array of exactly 2 example sentences in ${language} showing the word used in context

Example format:
{
  "translation": "...",
  "pronunciation": "...",
  "sentences": ["...", "..."]
}`;

  try {
    const rawContent = await callOpenAI(
      'You are a language learning assistant. You return only valid JSON objects as instructed. No extra explanation.',
      prompt
    );

    let result;
    try {
      result = JSON.parse(rawContent);
    } catch {
      console.error('Failed to parse lookup response as JSON:', rawContent);
      return res.status(502).json({ error: 'The AI returned an unexpected format. Please try again.' });
    }

    if (!result.translation || !result.pronunciation || !Array.isArray(result.sentences)) {
      return res.status(502).json({ error: 'Unexpected AI response structure. Please try again.' });
    }

    return res.json(result);

  } catch (err) {
    console.error('Error in /api/lookup:', err.message);
    return res.status(503).json({ error: err.message || 'Could not reach the AI service.' });
  }
});

app.listen(PORT, () => {
  console.log(`Language Learning App running at http://localhost:${PORT}`);
  console.log(`API key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No — add it to .env'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
