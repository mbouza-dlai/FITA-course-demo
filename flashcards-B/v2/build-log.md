# Build Log — Version 2

## Phase: Phase 2 — Persistence

### Prompt 2.1 — Remember Cards After a Refresh
- **What changed:** Added two persistence helpers: `saveDeck()` writes the deck array to `localStorage` as JSON under the key `flashcards_deck`, and `loadDeck()` reads and parses it on page load. `saveDeck()` is called at the end of every mutation (add and delete). The app initialises by calling `loadDeck()` before the first `render()`, so all cards are restored automatically with no user action required.
- **Decisions made:** Wrapped `loadDeck()` in a try/catch and added basic structural validation (must be an array of objects with string `front` and `back` fields) so corrupted or unexpected localStorage data does not crash the app. Chose `localStorage` over `sessionStorage` because `localStorage` persists across browser restarts, which is what "come back to the page" implies.

### Prompt 2.2 — Export the Deck to a File
- **What changed:** Added an "Export Deck" button. When clicked it serialises the deck as pretty-printed JSON (with app name, version, exportedAt timestamp, and cards array), creates a `Blob`, generates an object URL, and triggers a download via a temporary `<a>` element. The filename includes today's date (e.g., `flashcards-2026-03-16.json`). The resulting file is valid JSON and readable as plain text in any text editor.
- **Decisions made:** Added a thin wrapper object (`{ app, version, exportedAt, cards }`) around the cards array so the import step can validate the file format without ambiguity. If the deck is empty, a brief error notice is shown instead of downloading an empty file.

### Prompt 2.3 — Import a Deck from a File
- **What changed:** Added an "Import Deck" button that triggers a hidden `<input type="file" accept=".json">`. When a file is selected, `FileReader` reads it as text, parses the JSON, validates that it contains a non-empty `cards` array with proper `front`/`back` fields, replaces the current deck, saves to localStorage, and re-renders. On success, a green notice displays "Imported N cards successfully." On failure, a red notice explains the problem clearly.
- **Decisions made:** The file input's `value` is reset before each click so the same file can be re-imported without triggering a second change event being swallowed. The notice auto-dismisses after 4 seconds so it does not clutter the screen permanently. Added `.notice.success` and `.notice.error` CSS classes to keep notice styling consistent and visually distinct.

### Prompt 2.4 — Debugging: Cards Not Surviving a Refresh
- **What changed:** No bug was present to fix — the architecture from Prompt 2.1 already correctly calls `saveDeck()` on every add and delete, and calls `loadDeck()` at page initialisation before `render()`. The implementation was reviewed and confirmed correct: the final two lines of the script are `deck = loadDeck(); render();` which guarantees the load-on-open path runs.
- **Decisions made:** This is a designed-in correctness guarantee rather than a patch. The prompt describes a class of bug (forgetting to call save, or calling load too late) that the existing code does not have. Noted in log for transparency.

### Prompt 2.5 — Save This Version
- **What changed:** No code changes. Checkpoint confirmation.
- **Decisions made:** All Phase 2 requirements are met: localStorage auto-save on every mutation, auto-load on page open, JSON export with human-readable format, import with format validation and clear error messages. Saving as v2.
