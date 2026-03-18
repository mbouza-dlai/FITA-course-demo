# FITA — Course DEMO

## Overview

A course demo showcase app presenting all educational web applications built throughout a software development course. Features a navigation UI organized by module, with each app opening in an iframe alongside its prompts/learner log.

## Architecture

- **Main entry**: `server.js` — Express server on port 5000
- **Navigation UI**: `public/index.html` — Single-page vanilla JS navigation
- **OpenAI**: Replit AI Integration (env vars `AI_INTEGRATIONS_OPENAI_API_KEY` + `AI_INTEGRATIONS_OPENAI_BASE_URL`)

## App Types

### Static HTML apps (served directly)
- `touch-typing-B/v1`, `v2`
- `unit-converter-M`
- `to-do-app-M`
- `pomodoro-timer-B/v1`, `v2`, `v3`
- `reminder-app-M`
- `sleep-tracker-B/v1`, `v3`
- `sleep-pattern-app-M/localStorage`
- `trivia-game-B/v1`, `v2`
- `language-learning-app-M/v1-noAPI`
- `flashcards-app-M/v1`, `v2`
- `flashcards-B/v1`, `v2`, `v3`
- `language-learning-B/v1`, `v2`, `v3` (public/ dirs)

### Built React/Vite apps
- `trivia-game-retro-M` → built to `dist/`, served at `/apps/trivia-game-retro-M/` (Lovable)
- `recipe-vault-cocobean-M` → built to `dist/`, served at `/apps/recipe-vault-M/` (Cocobean)

### Apps with server-side persistence (JSON files)
- `sleep-tracker-B/v2` — `/apps/sleep-tracker-B/v2/api/data|entries`
- `sleep-pattern-app-M/json-storage` — `/apps/sleep-pattern-app-M/json-storage/api/data`

### Apps with OpenAI API integration
- `flashcards-app-M/v3-withLLM` → calls `/api/generate`
- `language-learning-B/v2`, `v3` → calls `/api/words`, `/api/lookup`
- `language-learning-app-M/V2-API` → calls `/language-learning/api/vocabulary-lookup`
- All served via main server's OpenAI routes

## API Routes (main server)

| Route | Purpose |
|-------|---------|
| `POST /api/words` | Vocabulary words by language + difficulty |
| `POST /api/lookup` | Word/phrase lookup by language |
| `POST /api/generate` | Flashcard AI generation |
| `POST /language-learning/api/vocabulary-lookup` | Language M v2 vocab lookup |
| `GET /api/prompts?file=path` | Read prompts-learner.md content |

## Workflow

- **Start application**: `node server.js` on port 5000

## Build Commands (if rebuilding React apps)

```bash
cd trivia-game-retro-M && npm install && npx vite build
cd recipe-vault-cocobean-M && npm install && npm run build
```
