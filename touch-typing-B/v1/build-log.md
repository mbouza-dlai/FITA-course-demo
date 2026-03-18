# Build Log — Version 1

## Phase: Phase 1 — MVP

### Prompt 1.1 — Initial Build
- **What changed:** Created the full single-file HTML app with the specified passage, character-by-character span rendering, correct/wrong color highlighting on keypress, a results screen showing WPM and accuracy, and a restart button.
- **Decisions made:** Used a `keydown` listener on `document` (not an `<input>`) so the user can type without clicking first. Each character is wrapped in a `<span>` built dynamically from the passage string. Spaces are rendered as non-breaking spaces (`\u00A0`) so they are visible and styleable. WPM formula: `(chars / 5) / minutes`. Accuracy formula: `correctCount / PASSAGE.length * 100`.

### Prompt 1.2 — Fix the Character Highlighting
- **What changed:** Added a blinking cursor indicator (blue underline + background tint) on the current character position, enforced no-skip-ahead behavior (user can only type the next expected character; advancing past the current index is not possible), and ensured each character is styled the moment the key is pressed.
- **Decisions made:** Cursor is implemented as a CSS class `.cursor` with a `blink` keyframe animation. The `handleKey` function guards against `key.length !== 1` to ignore modifier keys, and checks `currentIndex >= PASSAGE.length` to prevent typing past the end. The cursor class is removed from the current span before moving to the next.

### Prompt 1.3 — Results Screen
- **What changed:** Confirmed the results screen shows WPM (chars/5/minutes from first to last keystroke) and accuracy percentage. "Try Again" button is wired to `resetApp()`.
- **Decisions made:** Results screen replaces the typing area by toggling `display: none` on `#typing-screen` and adding a `.visible` class to `#results-screen`. No decorations or extra text — only the two stat values and the button, as specified.

### Prompt 1.4 — Debugging: Reset Bug
- **What changed:** The `resetApp()` function calls `buildPassage()` which destroys and recreates all character `<span>` elements from scratch, guaranteeing no `.correct` or `.wrong` classes can persist. `startTime` is set to `null` and `currentIndex` to `0` before rebuilding, ensuring the timer starts fresh from the next first keystroke.
- **Decisions made:** Recreating all spans (rather than removing classes in a loop) is the safest reset strategy — it eliminates any state that could be overlooked. This directly addresses the described bug where old colors and timer state carried over.

### Prompt 1.5 — Save Checkpoint
- **What changed:** This file (`v1/`) is the stable checkpoint. The app passes all Phase 1 requirements: characters turn green/red on keypress, blinking cursor marks current position, results show correct WPM and accuracy, Try Again fully resets state and display.
- **Decisions made:** N/A — checkpoint only.
