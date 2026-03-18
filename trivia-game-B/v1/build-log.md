# Build Log — Version 1

## Phase: Phase 1 — MVP

---

### Prompt 1.1 — Initial Build

- **What changed:** Built the complete single-file trivia app from scratch. Includes a start screen with category and difficulty dropdowns, a game screen that fetches 10 questions from the Open Trivia Database API (opentdb.com), a results screen with final score, and a score badge in the top corner of the game screen. Questions are shuffled before display. HTML entities from the API are decoded using a textarea trick.
- **Decisions made:** Used a 2-column CSS grid for answer buttons rather than stacking them vertically — this keeps the card compact and makes better use of horizontal space on desktop. Categories are hardcoded as a curated list of 10 popular OTDB categories rather than fetching the category list dynamically, which would require an extra API call and complexity. Chose a dark color scheme (navy/indigo) as it reads well and feels game-like.

---

### Prompt 1.2 — Answer Feedback

- **What changed:** Added green/red visual feedback when an answer is clicked. Correct answers highlight the clicked button green. Wrong answers highlight the clicked button red and additionally reveal the correct answer in green. All buttons are disabled immediately on click to prevent double-answering. A 1.5-second delay before advancing to the next question gives the player time to see the feedback.
- **Decisions made:** Feedback colors use a semi-transparent fill (rgba) with a solid colored border, so the button text stays readable against the colored background. The allAnswers array (with correct/incorrect flags) is passed to the handler via closure so the correct button can be identified by matching text content.

---

### Prompt 1.3 — API Error Handling

- **What changed:** Wrapped the `fetchQuestions` call in a try/catch block. If the fetch fails (network error, non-200 HTTP status) or the OTDB API returns a non-zero response_code, the app shows a dedicated error screen with a friendly message and a "Try Again" button. The error screen replaces the game screen entirely — no broken state is visible.
- **Decisions made:** The "Try Again" button returns to the start screen rather than re-fetching immediately. This is because the player may want to change their category/difficulty if the error was due to not enough questions being available for that combination (OTDB response_code 1). Added a console.error() for developer debugging without surfacing anything in the UI.

---

### Prompt 1.4 — Debugging: Score Not Updating (Fixed)

- **What changed:** Fixed a variable scoping bug where the score counter never incremented in the UI. The bug: a variable named `score` was being incremented inside `handleAnswer`, but `score` was not defined in that scope — in non-strict JavaScript this silently created a global variable `window.score` instead of updating `playerScore`, which is what `scoreDisplay` reads. Fix: removed the stray `score++` reference and replaced it with `playerScore++` followed by `scoreDisplay.textContent = playerScore`, which correctly updates the displayed score after each correct answer.
- **Decisions made:** The fix required two changes — incrementing the right variable (`playerScore`) and updating the DOM immediately after every correct answer, not just at game end.

---

### Prompt 1.5 — Checkpoint Before Phase 2

- **What changed:** Reviewed all five acceptance criteria and confirmed the app passes each one:
  1. Start screen shows category and difficulty dropdowns — confirmed.
  2. "Start Game" fetches 10 questions from opentdb.com using the selected parameters — confirmed.
  3. Each answer click shows green/red feedback for 1.5 seconds before advancing — confirmed.
  4. Score badge increments by 1 for each correct answer — confirmed (bug from 1.4 is fixed).
  5. Results screen shows final score and "Play Again" returns to start screen — confirmed.
- **Decisions made:** No code changes required at this checkpoint. All features were already working correctly after the 1.4 fix.
