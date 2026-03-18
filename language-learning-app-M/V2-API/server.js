const express = require('express');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const PORT = 5000;

app.use(express.json());

app.use('/language-learning', express.static(path.join(__dirname, 'language-learning-app-noAPI')));

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

app.post('/language-learning/api/vocabulary-lookup', async (req, res) => {
  const { word, language } = req.body;
  if (!word || !language) {
    return res.status(400).json({ error: 'word and language are required.' });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a language tutor. Respond ONLY with a raw JSON object — no markdown, no code fences, no extra text. ' +
            'Shape: {"definition":"<English definition>","examples":["<sentence 1>","<sentence 2>","<sentence 3>"]}',
        },
        {
          role: 'user',
          content: `Word: "${word}"\nLanguage: ${language}\n\nGive the definition in English and 3 example sentences written in ${language}.`,
        },
      ],
      max_completion_tokens: 8192,
    });

    let raw = (completion.choices[0]?.message?.content || '').trim();

    // Strip markdown code fences if the model wrapped its output
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();

    // Extract the first JSON object from the response as a fallback
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', raw);
      return res.status(500).json({ error: 'Could not parse AI response. Please try again.' });
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr, '\nRaw:', raw);
      return res.status(500).json({ error: 'Could not parse AI response. Please try again.' });
    }

    const definition = (parsed.definition || '').trim();
    const examples = Array.isArray(parsed.examples)
      ? parsed.examples.map(e => String(e).trim()).filter(Boolean)
      : [];

    if (!definition || examples.length === 0) {
      console.error('Empty fields in response:', parsed);
      return res.status(500).json({ error: 'The AI returned an incomplete response. Please try again.' });
    }

    res.json({ word, language, definition, examples });
  } catch (err) {
    console.error('Vocabulary lookup error:', err);
    res.status(500).json({ error: 'Failed to look up word. Please try again.' });
  }
});

app.get('/', (_req, res) => {
  res.redirect('/language-learning');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`FITA App Demos running at http://0.0.0.0:${PORT}`);
});
