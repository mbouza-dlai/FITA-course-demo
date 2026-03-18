const path = require("path");
const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

function buildGenerationPrompt(cards, count) {
  const knownCards = cards.filter((card) => card.known).slice(0, 30);
  const unknownCards = cards.filter((card) => !card.known).slice(0, 30);
  const existingQuestions = cards
    .map((card) => card.question)
    .filter((question) => typeof question === "string" && question.trim())
    .slice(-120);

  const knownText = knownCards.length
    ? knownCards.map((card, index) => `${index + 1}. ${card.question}`).join("\n")
    : "None";

  const unknownText = unknownCards.length
    ? unknownCards.map((card, index) => `${index + 1}. ${card.question}`).join("\n")
    : "None";

  const existingText = existingQuestions.length
    ? existingQuestions.map((question, index) => `${index + 1}. ${question}`).join("\n")
    : "None";

  return [
    {
      role: "system",
      content: "You generate concise study flashcards. Return valid JSON only."
    },
    {
      role: "user",
      content: `Generate ${count} new flashcards based on this deck.\n\nRules:\n- Output JSON array only.\n- Each item must be: {\"question\": string, \"answer\": string}.\n- Keep question and answer short and practical.\n- Do not repeat or paraphrase existing questions.\n- Focus mostly on topics from unknown cards and fill conceptual gaps.\n\nUnknown cards:\n${unknownText}\n\nKnown cards:\n${knownText}\n\nExisting deck questions (do not duplicate):\n${existingText}`
    }
  ];
}

function parseGeneratedCards(content) {
  if (!content) {
    return [];
  }

  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    const start = content.indexOf("[");
    const end = content.lastIndexOf("]");
    if (start >= 0 && end > start) {
      const recovered = JSON.parse(content.slice(start, end + 1));
      return Array.isArray(recovered) ? recovered : [];
    }
    return [];
  }
}

app.post("/api/generate", async (req, res) => {
  const apiKey = (process.env.OPENAI_API_KEY || "").trim();
  if (!apiKey) {
    res.status(500).json({ error: "Missing OPENAI_API_KEY. Add it in .env, then restart the server." });
    return;
  }

  const count = Number.isInteger(req.body?.count)
    ? Math.max(1, Math.min(req.body.count, 12))
    : 3;

  const incomingCards = Array.isArray(req.body?.cards) ? req.body.cards : [];
  if (incomingCards.length === 0) {
    res.status(400).json({ error: "At least one existing flashcard is required for generation." });
    return;
  }

  const normalizedCards = incomingCards
    .filter((card) => typeof card?.question === "string" && typeof card?.answer === "string")
    .map((card) => ({
      question: card.question.trim(),
      answer: card.answer.trim(),
      known: card.known === true,
    }))
    .filter((card) => card.question && card.answer);

  if (normalizedCards.length === 0) {
    res.status(400).json({ error: "No valid cards were provided." });
    return;
  }

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: buildGenerationPrompt(normalizedCards, count),
    });

    const rawContent = completion.choices?.[0]?.message?.content || "[]";
    const generated = parseGeneratedCards(rawContent)
      .filter((card) => typeof card?.question === "string" && typeof card?.answer === "string")
      .map((card) => ({
        question: card.question.trim(),
        answer: card.answer.trim(),
      }))
      .filter((card) => card.question && card.answer)
      .slice(0, count);

    const existingLower = new Set(normalizedCards.map((card) => card.question.toLowerCase()));
    const deduped = [];

    for (const card of generated) {
      const key = card.question.toLowerCase();
      if (existingLower.has(key)) {
        continue;
      }
      if (deduped.some((item) => item.question.toLowerCase() === key)) {
        continue;
      }
      deduped.push(card);
    }

    res.json({ cards: deduped });
  } catch (error) {
    const status = Number(error?.status || 500);
    const rawMessage =
      error?.error?.message ||
      error?.message ||
      "OpenAI request failed.";

    console.error("OpenAI generation failed:", rawMessage);

    if (status === 401) {
      res.status(401).json({
        error: "OpenAI authentication failed. Check OPENAI_API_KEY in .env and restart the server.",
      });
      return;
    }

    if (status === 429) {
      res.status(429).json({
        error: "OpenAI rate limit or quota reached. Check usage limits and billing, then try again.",
      });
      return;
    }

    if (status === 400 || status === 403) {
      res.status(status).json({
        error: `OpenAI request rejected: ${rawMessage}`,
      });
      return;
    }

    res.status(500).json({
      error: `Failed to generate cards: ${rawMessage}`,
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Flashcards v5 running on http://localhost:${port}`);
});
