/**
 * server.js — Language Learning App Backend
 *
 * This thin Express server does one job: act as a proxy between the browser
 * and the OpenAI API. The API key lives only here, in the server process,
 * and is never sent to the browser.
 *
 * To run:
 *   1. Copy .env.example to .env and add your OpenAI API key
 *   2. npm install
 *   3. node server.js
 *   4. Open http://localhost:3000 in your browser
 */

const express = require('express');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming JSON request bodies
app.use(express.json());

// Serve everything in the /public folder as static files
app.use(express.static(path.join(__dirname, 'public')));

/**
 * POST /api/words
 * Body: { language: "Spanish" }
 * Returns: { words: [ { word, translation, sentence } x5 ] }
 *
 * The API key is read from process.env — never from the request body.
 */
app.post('/api/words', async (req, res) => {
  const { language } = req.body;

  // Validate the incoming language value against our allowed list
  const allowedLanguages = ['Spanish', 'French', 'Japanese', 'German', 'Portuguese'];
  if (!language || !allowedLanguages.includes(language)) {
    return res.status(400).json({ error: 'Invalid language selection.' });
  }

  // Check that the API key is actually set
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: 'API key is not configured. Add OPENAI_API_KEY to your .env file.'
    });
  }

  const prompt = `Give me exactly 5 vocabulary words in ${language} for a language learner.

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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // The API key is injected here from the server's environment — never exposed to the browser
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a language learning assistant. You return only valid JSON arrays as instructed. No extra explanation.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return res.status(502).json({
        error: 'The AI service returned an error. Check your API key and try again.'
      });
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content.trim();

    // Parse the JSON array returned by the model
    let words;
    try {
      words = JSON.parse(rawContent);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', rawContent);
      return res.status(502).json({
        error: 'The AI returned an unexpected format. Please try again.'
      });
    }

    // Validate we got exactly 5 items with the right fields
    if (!Array.isArray(words) || words.length === 0) {
      return res.status(502).json({ error: 'Unexpected AI response structure. Please try again.' });
    }

    return res.json({ words });

  } catch (networkError) {
    console.error('Network error calling OpenAI:', networkError);
    return res.status(503).json({
      error: 'Could not reach the AI service. Check your internet connection.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Language Learning App running at http://localhost:${PORT}`);
  console.log(`API key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No — add it to .env'}`);
});
