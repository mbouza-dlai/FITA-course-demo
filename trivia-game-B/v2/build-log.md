# Build Log — Version 2

## Phase: Phase 2 — Persistence and Challenge

---

### Prompt 2.1 — High Score Persistence

- **What changed:** Added localStorage persistence for the player's all-time best score. At the end of each game, if the current score exceeds the stored best, localStorage is updated. The best score is displayed on both the start screen (in a banner above the category picker) and the results screen. On first visit the banner shows "—" since no score has been recorded yet.
- **Decisions made:** Used the localStorage key `trivia_best_score` storing a plain integer string. The best score banner uses a two-column layout (label left, value right) to visually distinguish it from the form fields below. A "New all-time best score!" message appears on the results screen when the current game beats the previous record — this is directly implied by "show the all-time best score so the player always knows what they are trying to beat" and is treated as a display decision rather than an autonomous addition.

---

### Prompt 2.2 — Countdown Timer

- **What changed:** Added a 15-second per-question countdown timer displayed as a circular badge in the top-left of the game screen (mirroring the score badge on the top-right). The timer counts down visibly each second. Color transitions: indigo above 10s, amber at 10s or below, red at 5s or below. If time runs out, all answer buttons are disabled, the correct answer is highlighted green, and the game advances after 1.5 seconds exactly as a wrong answer would. The timer resets to 15 seconds when each new question loads.
- **Decisions made:** The timer color transitions (indigo → amber → red) are used to create escalating urgency without adding sound or animation that was not requested. The circular badge was chosen to visually echo a clock. The timer interval is stored in a module-level variable (`timerInterval`) so it can be cleared from any function.

  **Note on deliberate bug (addressed in 2.4):** At this prompt stage, a timer bug was present: `handleAnswer` did not call `clearTimer()`. This meant the setInterval kept running after the player clicked an answer. If the remaining time hit zero during the 1.5-second feedback pause, `handleTimeUp` would fire a second time and incorrectly advance the question index or mark a correct answer as wrong. This bug was introduced as a realistic oversight (forgetting to clear an interval after it is no longer needed) and is fixed in Prompt 2.4.

---

### Prompt 2.3 — Past Scores Leaderboard

- **What changed:** Added a "Your Recent Scores" section on the results screen that lists the last 5 games played on this device, newest first. Each entry shows the score (e.g., "7 / 10") and the date played, formatted as a short human-readable string (e.g., "Mar 16, 2026"). Scores are saved to localStorage under the key `trivia_recent_scores` as a JSON array of objects containing `score` and `date` (ISO 8601 string). The list updates every time a new game is completed.
- **Decisions made:** Scores are saved as an ISO date string and formatted at render time using `toLocaleDateString()`, so the display adapts to the user's locale. The list is capped at 5 entries on every save (not just on render) to keep localStorage tidy. No player names are stored, per the prompt.

---

### Prompt 2.4 — Debugging: Timer Keeps Running After Answer (Fixed)

- **What changed:** Fixed the bug where the countdown timer continued running after the player clicked an answer. The fix: added a `clearTimer()` call as the very first line of `handleAnswer()`. This stops the setInterval immediately when the player selects any answer, before any feedback or state update happens. As a result, the timer can no longer reach zero during the 1.5-second feedback window and cannot double-fire `handleTimeUp`.
- **Decisions made:** Placing `clearTimer()` at the top of `handleAnswer` (before the disabled-buttons logic) is the safest position — it guarantees the interval is stopped regardless of the code path taken (correct vs. wrong answer). `clearTimer()` is also called in `showResults()` as a safety measure for the last question of a game.

---

### Prompt 2.5 — Wrong Answer Explanation

- **What changed:** Added logic to display a one-sentence explanation after a wrong answer, shown in a styled box below the answer grid during the 1.5-second feedback window. The code reads `q.explanation` from the question object returned by the OTDB API.
- **Decisions made:** The Open Trivia Database API does not include an `explanation` field in its question objects — the field is simply absent. As a result, `q.explanation` is always `undefined` for every question, and the explanation box is silently skipped every time. This is exactly the specified behavior from Prompt 2.5: "If the API does not include an explanation for a question, just skip the explanation text for that question — do not show a blank or error." The explanation box element exists in the DOM and is styled, but will not be visible during normal gameplay with the current OTDB API. If a future API version adds explanation fields, the feature will work automatically.

  The explanation box style uses an indigo left-border treatment to visually indicate it is supplementary information rather than part of the answer UI.

---

### Prompt 2.6 — Final Review Checkpoint

- **What changed:** Reviewed all six acceptance criteria end-to-end:
  1. Start screen shows category, difficulty, and all-time best score — confirmed (best score banner at top of start card).
  2. Full game loads questions, timer counts down, answer feedback shows, score tracks — confirmed.
  3. Timer expiry marks question wrong, shows correct answer, advances after 1.5s — confirmed via `handleTimeUp`.
  4. Results screen shows final score, all-time high score, and last 5 recent scores — confirmed.
  5. Closing and reopening the tab preserves high score and recent scores — confirmed (localStorage persists across sessions).
  6. "Play Again" returns to start screen and a new game works correctly — confirmed (state is fully reset in `startGame`).
- **Decisions made:** No code changes required at this checkpoint. All six criteria were passing after the 2.4 timer fix.
