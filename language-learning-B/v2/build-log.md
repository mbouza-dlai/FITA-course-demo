# Build Log — Version 2

## Phase: Phase 2 — Richer Learning Tools

All Phase 1 features are preserved exactly. This version adds three new features on top.

---

### Prompt 2.1 — Difficulty Filter

- **What changed:** A second dropdown labeled "Difficulty" was added to the controls panel below the language selector. Options are Beginner, Intermediate, and Advanced; it defaults to Beginner on page load. The selected difficulty is now sent to the server alongside the language in the `/api/words` POST body. The server uses a `levelDescriptions` map to inject concrete guidance into the AI prompt (e.g., "very common everyday words" for Beginner vs. "sophisticated or nuanced vocabulary" for Advanced) so the model returns appropriately levelled words rather than guessing. The difficulty selection is also persisted to localStorage so it survives refreshes.
- **Decisions made:** The level description text was added to the AI prompt rather than relying on the bare label (e.g. "Beginner") alone, because LLMs are more consistent when given explicit criteria rather than vague qualifiers.
- **Flags:** None.

---

### Prompt 2.2 — Look Up a Custom Word

- **What changed:** A "Look Up a Word" section was added between the controls panel and the vocabulary cards area. It contains a text input, a "Look Up" button, and a result card that shows the translation, a pronunciation tip, and two example sentences. A new `/api/lookup` endpoint was added to the server; it makes a single OpenAI call that returns all three pieces of information as a JSON object. Pressing Enter in the input field also triggers the lookup. The result area is visually distinct from the vocabulary cards (indigo/blue-tinted background vs. white cards) to make the separation clear.
- **Decisions made:** The lookup section is always visible (above the cards), not hidden behind a button, because the prompt says it should be "clearly separated from the 5 daily vocabulary cards" and always accessible. The lookup result uses the currently selected language, so switching languages and looking up a word always uses the right target language.
- **Flags:** ⚠️ **AUTONOMOUS ADDITION** — "Press Enter to look up" keyboard shortcut added via a `keydown` listener on the input. This is a standard usability pattern expected for any text input + submit button combination. It was not explicitly requested but is required for the feature to feel finished to a non-developer.

---

### Prompt 2.3 — Quiz Mode

- **What changed:** A "Quiz Mode" toggle button was added to the status bar (alongside the progress indicator), visible only when cards are present. When active: the button turns amber, its label changes to "Exit Quiz Mode", and a `.quiz-active` class is added to the cards container. CSS selectors driven by that class hide the `.card-translation` div on every card and show a `.btn-reveal` button instead. Clicking Reveal on a specific card adds a `.revealed` class to just that card, making its translation reappear. Turning quiz mode off removes both `.quiz-active` and all `.revealed` classes, restoring full translations. The learned/not-learned state and the "Mark as Learned" button are entirely unaffected — they operate independently via a separate `learnedSet` and CSS class.
- **Decisions made:** Quiz mode state is implemented as a CSS class toggle rather than re-rendering cards. This is the safest approach for preserving learned state — there is no risk of accidentally resetting `learnedSet` because no DOM rebuild happens. The `.revealed` class is cleared when quiz mode is turned off so cards reset to "hidden" if quiz mode is re-entered.
- **Flags:** None.

---

### Prompt 2.4 — Debugging Check

- **What changed:** No bugs found during review. Specific checks performed:
  - Difficulty not reaching AI: The `difficulty` field is read from `difficultySelect.value` at fetch time and sent in the request body. The server reads `req.body.difficulty` and validates it against `ALLOWED_DIFFICULTIES`. The AI prompt includes both the level label and a concrete description.
  - Custom lookup showing nothing: The lookup function validates the query is non-empty before calling the server, shows a loading indicator, and displays errors inline if the server returns a non-OK response.
  - Quiz mode resetting learned state: Confirmed that `toggleLearned()` only modifies `learnedSet` and calls `updateCardLearnedState()` (which only touches `.learned` class), while quiz mode only touches `.quiz-active` and `.revealed` classes. The two systems are completely independent.
- **Decisions made:** N/A — no changes needed.
- **Flags:** None.

---

### Prompt 2.5 — Save Phase 2 Checkpoint

- **What changed:** This version folder (`v2/`) represents the Phase 2 checkpoint. All code is complete and working.
- **Flags:** None.

---

## File Structure

```
v2/
  server.js          — Express server with /api/words (+ difficulty) and /api/lookup
  package.json       — Dependencies: express, dotenv
  .env.example       — Template for the required .env file
  .gitignore         — Excludes .env and node_modules
  public/
    index.html       — Full front-end: Phase 1 features + difficulty filter + lookup + quiz mode
  build-log.md       — This file
```

## How to Run

```bash
cd v2
npm install
cp .env.example .env
# Edit .env and add your OpenAI API key
node server.js
# Open http://localhost:3000
```
