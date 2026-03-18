# Build Log — Version 1

## Phase: Phase 1 — MVP

### Prompt 1.1 — Initial Build
- **What changed:** Created the complete single-file flashcard app. The add-card form (Front/Back textareas + "Add Card" button) sits at the top. The card display uses a CSS 3D perspective container with two `.card-face` elements (front and back) stacked via `backface-visibility: hidden`. Navigation (Previous/Next), a flip control (button + click-on-card), a counter label ("Card X of Y"), and a Delete button are all present. An empty-state panel with the friendly message is shown on load and whenever the deck becomes empty.
- **Decisions made:** Used `<textarea>` instead of `<input type="text">` for the Front/Back fields so longer questions and answers wrap naturally. All card UI elements (scene, counter, nav controls, action row) are hidden via `display:none` and revealed by `render()` when the deck has cards — this keeps the DOM clean and avoids showing stale state. A single `render()` function is the sole source of truth for the display, making future debugging straightforward.

### Prompt 1.2 — Card Flip Feel
- **What changed:** Implemented a CSS 3D flip animation using `perspective`, `transform-style: preserve-3d`, `backface-visibility: hidden`, and a `rotateY(180deg)` transition on the `.card-inner` element. The transition uses a cubic-bezier easing and completes in 0.42 s — quick enough for studying, smooth enough to feel physical.
- **Decisions made:** The back face is pre-rotated 180° in CSS so it is invisible at rest and becomes visible after the flip. The `.is-flipped` class is toggled by both the "Flip Card" button and a click on the card scene itself, satisfying both interaction paths requested in Prompt 1.1. The back face has a slightly different background color (`#f7f9ff`) to make the flip feel tangible.

### Prompt 1.3 — Empty Deck Edge Cases
- **What changed:** Three edge cases are handled inside `render()` and the event handlers: (1) Deleting the last card hides all card UI and shows the empty-state message. (2) Clicking Previous/Next when `deck.length <= 1` is a no-op — no navigation occurs, no errors. (3) After adding a new card, `currentIndex` is set to `deck.length - 1` so the view jumps to the newly added card.
- **Decisions made:** Index clamping (`if (currentIndex >= deck.length) currentIndex = deck.length - 1`) is applied inside `render()` so it automatically handles the delete-last-item case without special-casing in the delete handler.

### Prompt 1.4 — Debugging: Counter Is Wrong
- **What changed:** The counter bug is prevented by architecture: `render()` always reads `deck.length` and `currentIndex` freshly at the moment it runs. Because `render()` is called after every add and delete, the counter is guaranteed to be accurate. No separate counter variable exists that could fall out of sync.
- **Decisions made:** Rather than patching a broken counter variable, the app was designed from the start so that `cardCounter.textContent` is set inside `render()` using live state. This eliminates the class of bug described in the prompt entirely.

### Prompt 1.5 — Save This Version
- **What changed:** No code changes. This prompt is a checkpoint confirmation.
- **Decisions made:** The app at this point handles all MVP requirements: adding cards, 3D flip animation (under 0.42 s), Previous/Next navigation, accurate counter, delete with proper empty-state handling, and the jump-to-new-card behavior. Saving as v1.
