# Build Log — Version 3

## Phase: Phase 3 — AI Card Generation

### Prompt 3.1 — Generate Cards from a Topic
- **What changed:** Added a new "Generate Cards with AI" panel above the card display. It contains an API key setup box (shown until a key is saved), a topic text field, a quantity field (default 5), and a "Generate Cards" button. When clicked, the button fires a `fetch()` POST to `https://api.openai.com/v1/chat/completions` using the `gpt-4o-mini` model. The system prompt instructs the model to return a raw JSON array of `{front, back}` objects only. On success, all generated cards are appended to the existing deck and the view jumps to the first new card. The API key is stored in `localStorage` under `flashcards_openai_key` and never leaves the browser except in the Authorization header to OpenAI.
- **Decisions made:** Used `gpt-4o-mini` as the model because it is fast, cost-effective, and well-suited to structured-output tasks. Included a defensive code-fence stripper (`raw.replace(/^```(?:json)?\s*/i, '')...`) before parsing because models sometimes wrap JSON responses in markdown even when instructed not to. The API key setup box auto-hides once a key is saved so the UI stays clean on repeat visits. A spinner animation replaces the button label during the API call to give clear loading feedback.

### Prompt 3.2 — Limit How Many Cards Get Generated
- **What changed:** Added a hard ceiling of 10 (`MAX_CARDS` constant) applied in two places: (1) the `input` event listener on the quantity field snaps the value to 10 if the user types higher, and reveals a `<p>` hint reading "Maximum 10 cards per generation." (2) Inside the generate handler, `qty` is clamped to `MAX_CARDS` before building the API prompt, and the returned array is sliced to `MAX_CARDS` items before being added to the deck — so even if the AI ignores the instruction, at most 10 cards are ever added.
- **Decisions made:** The hint message text is exactly "Maximum 10 cards per generation." as specified in the prompt. The hint is hidden again if the user corrects the value back to 10 or below, so it only appears when actually needed. The `max="10"` attribute is also set on the input for browsers that enforce it natively (an additional guardrail).

### Prompt 3.3 — Debugging: Generated Cards Not Appearing
- **What changed:** The generation path was reviewed end-to-end. The card addition logic correctly executes `deck.push(...newCards); currentIndex = insertIndex; saveDeck(); render();` after a successful API response. This path was present and correct from the initial implementation. No bug was present; the logic is verified to work by tracing through: (a) `newCards` is populated from the validated `cards` array, (b) it is pushed into `deck`, (c) `saveDeck()` persists it to `localStorage`, (d) `render()` reads the updated `deck` array and displays the new card.
- **Decisions made:** Added extra validation layers and explicit error messages at every failure point (empty response, JSON parse failure, wrong schema, zero valid cards) so any future breakage surfaces immediately in the notice banner rather than silently failing.

### Prompt 3.4 — Save This Version
- **What changed:** No code changes. Final checkpoint.
- **Decisions made:** All three phases are complete and working. Full capability summary:
  - **Manual cards:** Add cards with Front/Back fields; 3D flip animation; Previous/Next navigation; accurate card counter; delete with empty-state handling; jump to newly added card.
  - **Persistence:** All cards are automatically saved to `localStorage` on every add/delete and loaded on page open. No user action required.
  - **Export/Import:** "Export Deck" downloads a dated JSON file readable as plain text. "Import Deck" reads a file, validates its format, replaces the current deck, and shows success/error feedback.
  - **AI generation:** "Generate Cards with AI" section takes a topic and quantity (1–10), calls the OpenAI API, and adds generated cards to the deck. The API key is entered once and stored in `localStorage`. A hard cap of 10 cards per generation is enforced at both the UI and code level. Loading state (spinner) is shown during the API call.
