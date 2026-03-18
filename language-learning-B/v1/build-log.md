# Build Log — Version 1

## Phase: Phase 1 — MVP

---

### Prompt 1.1 — Initial Build (layout shell)

- **What changed:** Created the full app shell: language dropdown (Spanish, French, Japanese, German, Portuguese), "Get New Words" button, a responsive cards grid (single column on mobile, 2-column on wider screens), and placeholder card elements. Also established the Node.js/Express server architecture (server.js + package.json) required by Prompt 1.2's API key security requirement.
- **Decisions made:** The prompt says "the AI call can return placeholder text for now" — however, since Prompt 1.2 immediately wires the real API, and because the server architecture is already required, the full server structure was built alongside the layout to avoid rewriting the file structure in the next prompt. The UI itself shows an empty state until words are fetched, which satisfies "show the layout first." An empty state message was added so the page does not appear broken before any words load.
- **Flags:** ⚠️ **AUTONOMOUS ADDITION** — An empty-state message ("Pick a language above and click Get New Words to start learning") was added. Without it the page would appear blank and broken to a non-developer testing the layout. This is purely cosmetic and does not add any functionality.

---

### Prompt 1.2 — Connect the AI

- **What changed:** The server (`server.js`) was built with a `/api/words` POST endpoint that reads `OPENAI_API_KEY` from `process.env` (via `.env` via `dotenv`), calls `gpt-4o-mini`, and returns parsed word objects. The front-end `fetch()` calls `/api/words` — the API key never travels to or appears in the browser. A `.env.example` and `.gitignore` were created to guide safe key storage.
- **Decisions made:** Used `gpt-4o-mini` as the model — it is fast, cheap, and accurate enough for vocabulary generation. The prompt instructs the model to return only a raw JSON array (no markdown fences) to make server-side parsing reliable. The server validates the language against an allowlist before making any API call.
- **Setup instructions for learners:**
  1. `cd` into the project folder.
  2. Run `npm install` to install `express` and `dotenv`.
  3. Copy `.env.example` to `.env`: `cp .env.example .env`
  4. Open `.env` and replace `your-openai-api-key-here` with your actual key.
  5. Run `node server.js` and open `http://localhost:3000`.
- **Flags:** None.

---

### Prompt 1.3 — Mark Words as Learned

- **What changed:** Each word card now has a "Mark as Learned" button. Clicking it toggles a `learned` CSS class on the card, which applies a green background, green border, and green word color. A circular green checkmark badge appears in the top-right corner of learned cards. The button label changes to "Learned ✓". A progress indicator ("X / 5 learned") with a visual progress bar appears above the cards and updates immediately on every click.
- **Decisions made:** Toggle behavior is handled by a `Set` of learned indices for O(1) lookup. The progress bar fills proportionally (e.g., 3/5 = 60% width) with a smooth CSS transition.
- **Flags:** None.

---

### Prompt 1.4 — Save Progress Across Refreshes

- **What changed:** On every toggle, both the current word list and the learned indices set are serialized to `localStorage` under stable keys (`vocabBuilder_words`, `vocabBuilder_learned`, `vocabBuilder_language`). On page load, `init()` reads these keys and restores the cards and learned state exactly as they were. The progress indicator reflects the restored state immediately without any user interaction.
- **Decisions made:** Storing the full word objects (not just IDs) allows the cards to be fully reconstructed on reload without another API call. The learned indices are stored as a plain JSON array (from `[...learnedSet]`) and converted back to a `Set` on load.
- **Flags:** None.

---

### Prompt 1.5 — Debugging Check

- **What changed:** No bugs were found during review — the implementation was built defensively from the start. Specific checks performed:
  - API error path: The server returns structured `{ error: "..." }` JSON on all failure modes (missing key, bad API response, parse failure). The front-end reads `data.error` and displays it in a visible error banner — no console inspection required.
  - localStorage restore: `init()` calls `renderCards()` and `updateProgress()` after restoring state, so the page reflects saved progress immediately on load.
  - Progress counter: `learnedSet.size` is the single source of truth used by both `updateProgress()` and `persistState()`, so counter and storage are always in sync.
- **Decisions made:** N/A — no changes needed.
- **Flags:** None.

---

### Prompt 1.6 — Save Phase 1 Checkpoint

- **What changed:** This version folder (`v1/`) represents the Phase 1 checkpoint. All code is complete and working.
- **Decisions made:** In a real learner workflow, this prompt would trigger a `git commit`. In this automated build, the versioned folder itself is the checkpoint.
- **Flags:** None.

---

## File Structure

```
v1/
  server.js          — Express server + /api/words proxy endpoint
  package.json       — Dependencies: express, dotenv
  .env.example       — Template for the required .env file
  .gitignore         — Excludes .env and node_modules from version control
  public/
    index.html       — Complete single-file front-end (HTML + CSS + JS)
  build-log.md       — This file
```

## How to Run

```bash
cd v1
npm install
cp .env.example .env
# Edit .env and add your OpenAI API key
node server.js
# Open http://localhost:3000
```
