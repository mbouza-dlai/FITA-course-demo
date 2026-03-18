# Flashcards App v5 (LLM Stack)

This version starts from the v3 UI and adds automatic LLM-assisted card generation with a prefetch stack.

## Behavior

- Once known rate reaches 50%, the app starts pre-generating cards in the background.
- Once the learner has gone through all current flashcards and known rate is at least 75%, the app prompts to auto-generate new cards.
- If accepted, generated cards are added instantly from the prebuilt stack and appended to the learner deck.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `OPENAI_API_KEY`.
3. Install dependencies:
   - `npm install`
4. Start app:
   - `npm start`
5. Open `http://localhost:3000`.

## Notes

- Generated cards are prefetched and cached in browser localStorage for instant insertion.
- Existing visual UI remains aligned with v3-withLLM.
