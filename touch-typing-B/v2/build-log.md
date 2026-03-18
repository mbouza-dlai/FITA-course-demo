# Build Log — Version 2

## Phase: Phase 2 — Enhancements

### Prompt 2.1 — Multiple Passages to Choose From
- **What changed:** Added a selection screen that appears on load (before any typing). The screen shows all four specified passages as clickable cards, each displaying the first seven words as a preview plus the character count. Clicking a card takes the user straight to the typing screen with that passage loaded.
- **Decisions made:** Cards are rendered dynamically from a `PASSAGES` data array. Preview uses the first 7 words (slightly more than "first few words" to give meaningful context without showing too much). Back link added to typing screen so users can return to selection without refreshing. The selection screen is shown first by default; typing and results screens are hidden.

### Prompt 2.2 — Live WPM Counter While Typing
- **What changed:** Added a `#live-wpm` element below the passage that shows "Current speed: X WPM" while the user is actively typing. The counter starts updating after the first keystroke and refreshes every second via `setInterval`.
- **Decisions made:** The interval is started in `startLiveWpmInterval()` on first keystroke and cleared in `clearLiveWpmInterval()` when typing completes. The element has a fixed `min-height` so the layout doesn't shift when it first appears. Both the live counter and the final results WPM are shown as specified.

### Prompt 2.3 — Difficulty Selector
- **What changed:** Added four filter buttons ("All", "Short", "Medium", "Long") at the top of the selection screen. Clicking a filter shows only passages matching that difficulty. Added two new passages (one "short", one "long") to ensure each difficulty level has at least one option. The four original passages are all assigned "medium" difficulty based on their character lengths (134–160 chars).
- **Decisions made:** Difficulty assignment rationale: short < 100 chars, medium 100–200 chars, long > 200 chars. Added passage 5 ("Type with purpose. Every keystroke counts." — 42 chars, short) and passage 6 (a longer paragraph about touch typing — 237 chars, long). Filter buttons use a pill style with an active/inactive state. The "All" filter is active by default. Filtering rerenders the card list without changing any other behavior.

### Prompt 2.4 — Congratulations Animation
- **What changed:** Added a canvas-based confetti animation that plays once when the results screen appears. 120 colored rectangular pieces fall from the top of the viewport, fade out near the bottom, and stop. The canvas sits above the page content but has `pointer-events: none` so the results and button remain fully clickable during the animation.
- **Decisions made:** Used `requestAnimationFrame` for smooth rendering. The animation loop stops itself when all particles have fully faded (opacity reaches 0), so it naturally plays once and does not loop. Any leftover animation from a previous run is cancelled before launching a new one. The canvas is sized to fill the full viewport and resizes with the window.

### Prompt 2.5 — Debugging: Live WPM Counter Carries Over Between Passages
- **What changed:** Fixed the bug where the live WPM counter shows a stale value from the previous session after selecting a new passage. The root cause was that `startTime` and the live `setInterval` were not cleared when navigating to a new passage.
- **Decisions made:** The fix is in `resetTypingState()`, which is called by `startPassage()` whenever a new passage is selected. It calls `clearLiveWpmInterval()` to stop any running interval, sets `startTime = null`, resets `currentIndex` to 0, and clears the `#live-wpm` element text. This means the counter is always blank and inactive when a new passage loads, and only begins updating after the user presses the first key.

### Prompt 2.5 (continued) — Final Checkpoint
- **What changed:** This file (`v2/`) is the stable Phase 2 checkpoint. All Phase 2 features are implemented: passage selection screen, difficulty filter, live WPM counter, confetti animation, and the WPM counter reset bug fix.
- **Decisions made:** N/A — checkpoint only.
