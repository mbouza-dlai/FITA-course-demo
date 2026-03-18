# Language Learning App

This Replit project contains only the language-learning notes app and the backend route used for AI-powered vocabulary lookup.

## Run

1. Install dependencies with `npm install`
2. Start the server with `npm start`
3. Open `/language-learning`

## Structure

- `language-learning-app-noAPI/`: frontend files for the app
- `server.js`: Express server and vocabulary lookup API
- `.replit`: Replit runtime configuration

## AI integration

The lookup route uses the OpenAI SDK through Replit's AI integration environment variables:

- `AI_INTEGRATIONS_OPENAI_API_KEY`
- `AI_INTEGRATIONS_OPENAI_BASE_URL`