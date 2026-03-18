# FITA — Course DEMO

## Overview

A course demo showcase app that presents multiple educational web applications built throughout a software development course. It features a navigation UI that organizes all demo apps by module.

## Architecture

- **Main entry**: `server.js` — Express server on port 5000 serving the navigation UI and all sub-apps
- **Navigation UI**: `public/index.html` — Single-page vanilla JS navigation with breadcrumbs and tab-based app/prompts view
- **Sub-apps**: All served as static files at `/apps/<path>` routes

## Project Structure

```
/
├── server.js              # Main Express server (port 5000)
├── package.json           # Dependencies: express
├── public/
│   └── index.html         # Navigation SPA
├── touch-typing-B/        # Module 1 - Touch Typing (Builder, v1/v2)
├── unit-converter-M/      # Module 1 - Unit Converter (Model)
├── to-do-app-M/           # Module 1 - To-Do App (Model)
├── pomodoro-timer-B/      # Module 1 - Pomodoro Timer (Builder, v1/v2/v3)
├── reminder-app-M/        # Module 1 - Reminder App (Model)
├── sleep-tracker-B/       # Module 2 - Sleep Tracker (Builder, v1/v2/v3)
├── sleep-pattern-app-M/   # Module 2 - Sleep Pattern App (Model, localStorage/json-storage)
├── trivia-game-B/         # Module 3 - Trivia Game (Builder, v1/v2)
├── trivia-game-retro-M/   # Module 3 - Trivia Game Retro React (Model)
├── language-learning-app-M/  # Capstone - Language Learning (Model, v1/v2)
├── language-learning-B/   # Capstone - Language Learning (Builder, v1/v2/v3)
├── recipe-vault-cocobean-M/  # Capstone - Recipe Vault React (Model)
├── flashcards-app-M/      # Throughline - Flashcards (Model, v1/v2/v3)
└── flashcards-B/          # Throughline - Flashcards (Builder, v1/v2/v3)
```

## Navigation Structure

- **Main Menu** → Module 1, Module 2, Module 3, Capstone, Throughline
- **Module 1**: Touch Typing (B), Unit Converter (M), To-Do (M), Pomodoro (B), Reminder (M)
- **Module 2**: Sleep Tracker (B), Sleep Pattern App (M)
- **Module 3**: Trivia Game (B), Trivia Game Retro (M)
- **Capstone**: Language Learning (M+B), Recipe Vault (M)
- **Throughline**: Flashcards (M+B)

## App Viewer Features

- Each app opens in an iframe with an "App" tab and a "Prompts" tab
- Prompts tab loads and renders the `prompts-learner.md` content
- Markdown is rendered client-side with syntax highlighting

## Notes

- Apps with server-side Node.js backends (LLM, JSON persistence) are integrated into the main server
- `trivia-game-retro-M` and `recipe-vault-cocobean-M` are Vite/React apps served as source (not built)
- Some apps require an OpenAI API key (`OPENAI_API_KEY`) for LLM features

## Workflow

- **Start application**: `node server.js` on port 5000
