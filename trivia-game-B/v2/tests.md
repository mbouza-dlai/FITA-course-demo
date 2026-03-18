# Tests — Trivia Game v2

## Setup

Open `index.html` in any web browser by double-clicking the file. The Trivia Game start screen should appear immediately. Note: the game requires an active internet connection to load questions from the Open Trivia Database. Some tests in this file require playing multiple games in a row — plan for approximately 10–15 minutes to run the full suite.

---

## Level 1: Cosmetic Checks

- [ ] The start screen shows an "All-Time Best" banner above the category picker. On first visit (no games played yet), the value in that banner displays a dash "—" rather than a number.
- [ ] The "All-Time Best" banner has a label on the left ("All-Time Best" in small uppercase letters) and a large value on the right, visually separated.
- [ ] The game screen top bar shows a circular timer badge on the left and a score badge on the right, both on the same horizontal row.
- [ ] The timer circle displays as a round badge with a colored border, showing a number inside.
- [ ] When the timer is above 10 seconds, the timer circle border and number are indigo/purple.
- [ ] When the timer reaches 10 seconds or below, the timer circle border and number turn amber/yellow.
- [ ] When the timer reaches 5 seconds or below, the timer circle border and number turn red.
- [ ] The color transition of the timer circle (indigo to amber to red) is smooth, not an instant jump.
- [ ] After a wrong answer, the explanation box (if it appears) has an indigo left-border accent and a slightly indigo-tinted background, visually distinct from the answer buttons.
- [ ] The results screen shows the final score as a large number, followed by "out of 10 correct."
- [ ] The results screen shows an "All-Time Best" banner (same style as the start screen banner) below the score.
- [ ] The results screen shows a "Your Recent Scores" section with a heading in small uppercase letters.
- [ ] Each row in the "Your Recent Scores" list shows a score on the left (e.g., "7 / 10") and a date on the right (e.g., "Mar 16, 2026"), visually separated.
- [ ] The "New all-time best score!" message, when it appears, is displayed in a gold/yellow color to distinguish it from regular text.
- [ ] A thin horizontal divider line separates sections on the results screen.
- [ ] The entire app has a dark navy background with no white or light background visible outside the card.
- [ ] The card is centered on the page both horizontally and vertically.

---

## Level 2: Functional Tests

### Start Screen — Best Score Display

- [ ] Step: Open the app for the first time (or in a browser profile with no saved data) → Expected: The "All-Time Best" banner on the start screen shows "—" (a dash), not "0" or a blank space.
- [ ] Step: Complete a game, then click "Play Again" → Expected: The "All-Time Best" banner on the start screen now shows your score from the game you just finished (in "X / 10" format), reflecting the updated record.

### Game Screen — Countdown Timer

- [ ] Step: Start a game and observe the timer as the first question loads → Expected: The timer circle shows "15" and begins counting down visibly: 15, 14, 13, 12... The number decreases once per second.
- [ ] Step: Answer a question and observe the timer → Expected: The moment you click an answer, the timer stops immediately. It does not continue counting down during the 1.5-second feedback window.
- [ ] Step: Observe the timer when the next question loads after you answered → Expected: The timer resets back to "15" and begins counting down again from 15, not from whatever number it was at when you clicked.
- [ ] Step: Start a question and do not click any answer — wait for the timer to reach zero → Expected: At zero, all four answer buttons become unclickable (cursor changes to "not allowed"), the correct answer button turns green, and after approximately 1.5 seconds the app automatically advances to the next question (or results screen if it was the last question). Your score does not increase.
- [ ] Step: Let the timer expire on one question, then answer the next question correctly → Expected: The score increases by 1 for the correct answer, confirming the timer expiry only counts as wrong for that one question and does not carry over.
- [ ] Step: Click an answer with 3 seconds left on the timer → Expected: The timer stops immediately at 3 (it does not count down to 0), the answer feedback shows in green or red, and after 1.5 seconds the next question loads with the timer reset to 15.

### Game Screen — Answer Feedback (carried forward from v1)

- [ ] Step: Click a correct answer → Expected: The clicked button turns green, the score increments by 1, all buttons are disabled, and after approximately 1.5 seconds the next question loads.
- [ ] Step: Click a wrong answer → Expected: The clicked button turns red, a different button (the correct answer) turns green simultaneously, all buttons are disabled, and after approximately 1.5 seconds the next question loads.
- [ ] Step: After clicking an answer, immediately try clicking a different answer button → Expected: Nothing happens — the second click is ignored.

### Results Screen — Score Persistence

- [ ] Step: Complete a full game → Expected: The results screen appears and shows your final score as a large number, the "All-Time Best" banner with the best score to date, and a "Your Recent Scores" section with at least one entry showing your score and today's date.
- [ ] Step: Complete a game with a score higher than any previous game → Expected: The text "New all-time best score!" appears on the results screen in gold/yellow text. The "All-Time Best" banner updates to show the new record.
- [ ] Step: Complete a game with a score equal to or lower than your all-time best → Expected: The "New all-time best score!" message does not appear. The "All-Time Best" banner shows the previously saved record unchanged.
- [ ] Step: Complete 6 or more games in a row → Expected: The "Your Recent Scores" list on the results screen shows exactly 5 entries — the 5 most recent games, not all 6 or more. The oldest game beyond the 5 most recent is not shown.
- [ ] Step: Observe the "Your Recent Scores" list after playing multiple games → Expected: Scores are listed newest first (the game you just finished is at the top, older games below it).
- [ ] Step: Observe each row in the "Your Recent Scores" list → Expected: Each row shows a score formatted as "X / 10" and a date formatted as a human-readable date (e.g., "Mar 16, 2026"), with no player name shown.

### Persistence Across Browser Sessions

- [ ] Step: Complete a game, note your score and today's date. Close the browser tab entirely. Reopen the app by opening `index.html` again → Expected: The "All-Time Best" banner on the start screen still shows the score from your previous session, not "—."
- [ ] Step: After reopening the app (as above), complete another game and go to the results screen → Expected: The "Your Recent Scores" section includes the score from your previous browser session as well as the new game — data was not lost when the tab was closed.

### Play Again Flow

- [ ] Step: On the results screen, click "Play Again" → Expected: The results screen disappears and the start screen appears with the category and difficulty dropdowns visible. The "All-Time Best" banner on the start screen shows the correct saved record.
- [ ] Step: After clicking "Play Again," start a new game → Expected: The score resets to 0, "Question 1 of 10" is shown, and the timer starts counting down from 15 on the first question.

### Error Screen

- [ ] Step: Disconnect your device from the internet, then click "Start Game" → Expected: The error screen appears with the heading "Oops!" and the message "We couldn't load questions right now — the trivia service may be temporarily unavailable. Please try again in a moment." A "Try Again" button is visible.
- [ ] Step: On the error screen, click "Try Again" → Expected: The error screen disappears and the start screen appears with the category and difficulty dropdowns intact.

---

## Level 3: Edge Cases

- [ ] Step: Open the app for the very first time (no saved data) and go to the results screen after completing a game → Expected: The "Your Recent Scores" section shows exactly 1 entry (your just-completed game). It does not show a blank section or an error.
- [ ] Step: On the very first game ever played, score higher than 0 → Expected: The "New all-time best score!" message appears (because any score beats the default of 0).
- [ ] Step: Start a question, let the timer reach exactly 5 seconds → Expected: The timer circle color changes to red at 5 seconds (not at 4 or 6). Observe that the color change happens at the moment "5" appears, not before or after.
- [ ] Step: Start a question, let the timer count down, then click an answer at the last possible moment (1 or 2 seconds remaining) → Expected: The timer stops, the answer is registered, and the correct/wrong feedback shows. The timer does not reach 0 and the question is not marked wrong by the timeout.
- [ ] Step: Complete a game entirely by letting the timer run out on every question (never clicking any answer) → Expected: All 10 questions advance automatically via timeout. The results screen shows a score of 0 and the game does not get stuck or show an error.
- [ ] Step: Refresh the browser tab mid-game (press F5 or Cmd+R) → Expected: The app returns to the start screen. The previously saved best score and recent scores are still preserved and shown correctly.
- [ ] Step: Click "Start Game" rapidly two or more times → Expected: Only one game starts. The app does not show duplicate game screens or run two timers simultaneously.
- [ ] Step: Resize the browser window to a narrow mobile-like width (approximately 375px wide) → Expected: The card is readable, the timer circle and score badge both remain visible in the top bar without overlapping, and answer buttons remain usable.
- [ ] Step: Observe questions containing special characters such as apostrophes, quotes, or ampersands (e.g., "What's...") → Expected: All text renders with the correct characters, not HTML codes like `&#039;` or `&amp;`.
- [ ] Step: Complete 10 or more games to build up a recent scores history. Open the results screen → Expected: The "Your Recent Scores" list never exceeds 5 rows regardless of how many games have been played.

---

## Autonomous Addition Review

No autonomous additions detected in this version. All features correspond directly to prompts in `prompts-learner.md`:

- High score persistence — Prompt 2.1
- Countdown timer with color transitions — Prompt 2.2
- Recent scores leaderboard (last 5) — Prompt 2.3
- Timer bug fix (timer stops on answer click) — Prompt 2.4
- Wrong answer explanation box (silently skipped because the API does not provide explanations) — Prompt 2.5

One item warrants a note rather than a formal review flag: the "New all-time best score!" celebration message on the results screen. The build log explicitly addresses this, classifying it as a display decision implied by Prompt 2.1 ("show the all-time best score so the player always knows what they are trying to beat") rather than an autonomous addition. This classification is reasonable — the message is a natural expression of the high score feature and adds no new functionality.
