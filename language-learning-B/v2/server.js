/**
 * server.js — Language Learning App Backend (Phase 2)
 *
 * Two API endpoints:
 *   POST /api/words  — fetches 5 vocabulary words (now with difficulty level)
 *   POST /api/lookup — looks up a custom word/phrase typed by the user
 *
 * The OpenAI API key lives only in process.env — never in the browser.
 *
 * To run:
 *   1. Copy .env.example to .env and add your OpenAI API key
 *   2. npm install
 *   3. node server.js
 *   4. Open http://localhost:3000
 */

const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Allowed values for validation
const ALLOWED_LANGUAGES   = ['Spanish', 'French', 'Japanese', 'German', 'Portuguese'];
const ALLOWED_DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

// ─── Helper: check API key is set ──────────────────────────────────────────
function requireApiKey(res) {
  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({
      error: 'API key is not configured. Add OPENAI_API_KEY to your .env file.'
    });
    return false;
  }
  return true;
}

// ─── Helper: call OpenAI chat completions ──────────────────────────────────
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
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'OpenAI API error');
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

  // Default to Beginner if the difficulty value is missing or invalid
  const level = ALLOWED_DIFFICULTIES.includes(difficulty) ? difficulty : 'Beginner';

  if (!requireApiKey(res)) return;

  // Describe what "beginner/intermediate/advanced" means in concrete terms
  // so the model produces appropriately levelled words.
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
 *
 * One API call returns all three pieces of information.
 */
app.post('/api/lookup', async (req, res) => {
  const { query, language } = req.body;

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ error: 'Please enter a word or phrase to look up.' });
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
});
