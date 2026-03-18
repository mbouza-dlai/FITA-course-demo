# Tests — Trivia Game v1

## Setup

Open `index.html` in any web browser by double-clicking the file. The Trivia Game start screen should appear immediately. Note: the game requires an active internet connection to load questions from the Open Trivia Database.

---

## Level 1: Cosmetic Checks

- [ ] The start screen title "Trivia Game" appears centered at the top of the card in a light purple/indigo color.
- [ ] The subtitle "Test your knowledge across categories" appears below the title in a muted gray color.
- [ ] The Category dropdown has a visible downward-pointing arrow chevron on the right side.
- [ ] The Difficulty dropdown has a visible downward-pointing arrow chevron on the right side.
- [ ] The "Start Game" button is full-width, indigo/purple in color, and has white text.
- [ ] The "Start Game" button slightly darkens when hovered with the mouse.
- [ ] During gameplay, the score badge ("Score: 0") appears in the top-right corner of the game card.
- [ ] During gameplay, the progress label ("Question 1 of 10") appears above the thin progress bar.
- [ ] The progress bar is a thin horizontal strip that fills from left to right as questions advance.
- [ ] Answer buttons are displayed in a 2-column grid (two buttons side by side), not stacked in a single column.
- [ ] Answer buttons have a subtle indigo border when hovered.
- [ ] A correct answer button turns noticeably green (green border and green-tinted background) after clicking.
- [ ] A wrong answer button turns noticeably red (red border and red-tinted background) after clicking.
- [ ] The correct answer button turns green simultaneously when the player picks a wrong answer.
- [ ] The results screen shows the final score as a large number centered on the card.
- [ ] The "Play Again" button on the results screen is full-width, indigo/purple, and matches the style of the "Start Game" button.
- [ ] The error screen shows a warning icon (⚠) above the "Oops!" heading.
- [ ] The entire app has a dark navy background — no white or light background visible outside the card.
- [ ] The card is centered on the page both horizontally and vertically.

---

## Level 2: Functional Tests

### Start Screen

- [ ] Step: Open the app → Expected: The start screen is visible. The Category dropdown defaults to "General Knowledge" and the Difficulty dropdown defaults to "Medium."
- [ ] Step: Click the Category dropdown → Expected: A list of 10 categories appears, including General Knowledge, Science & Nature, History, Sports, Film, Music, Television, Video Games, Computers, and Geography.
- [ ] Step: Click the Difficulty dropdown → Expected: Three options appear: Easy, Medium, and Hard.
- [ ] Step: Select any category and difficulty, then click "Start Game" → Expected: The start screen disappears and the game screen appears. The text "Loading questions…" briefly shows in the question area while questions are fetched from the internet.

### Game Screen — Questions and Navigation

- [ ] Step: Wait for the first question to load after clicking "Start Game" → Expected: A question appears in the center of the card, and four answer buttons appear in a 2-column grid below it. The progress label reads "Question 1 of 10."
- [ ] Step: Observe the progress bar when the first question loads → Expected: The progress bar fill is approximately 10% wide (one-tenth of the total bar).
- [ ] Step: Answer all 10 questions and observe the progress label → Expected: The label increments with each question ("Question 2 of 10," "Question 3 of 10," etc.) and the progress bar fill grows wider with each question.

### Game Screen — Score

- [ ] Step: Click a correct answer → Expected: The score number in the top-right badge increases by 1 immediately (for example, from 0 to 1).
- [ ] Step: Click a wrong answer → Expected: The score number in the top-right badge does not change.
- [ ] Step: Answer several questions in a row, mixing correct and wrong answers → Expected: The score badge reflects the exact number of correct answers given so far. It never stays at zero after a correct answer.

### Game Screen — Answer Feedback

- [ ] Step: Click any answer button → Expected: Within less than a second, the clicked button changes color (green if correct, red if wrong). All four answer buttons become unclickable (cursor changes to "not allowed").
- [ ] Step: Click a correct answer → Expected: Only the clicked button turns green. After approximately 1.5 seconds, the next question loads automatically without any action from you.
- [ ] Step: Click a wrong answer → Expected: The clicked button turns red AND a different button (the correct answer) simultaneously turns green. After approximately 1.5 seconds, the next question loads automatically.
- [ ] Step: After clicking an answer, immediately click a different answer button → Expected: Nothing happens — the second click is ignored and the button colors do not change.

### Results Screen

- [ ] Step: Answer all 10 questions → Expected: After the last question's 1.5-second feedback window, the results screen appears automatically showing "Game Over!" as the heading.
- [ ] Step: Observe the results screen after completing a game → Expected: A large number is displayed (your score, 0–10) followed by the text "out of 10 correct."
- [ ] Step: Complete a game where you answered 7 questions correctly → Expected: The results screen shows "7" as the large score number.
- [ ] Step: Click "Play Again" on the results screen → Expected: The results screen disappears and the start screen reappears with the category and difficulty dropdowns visible.
- [ ] Step: Click "Play Again," then click "Start Game" again → Expected: A new game starts fresh with the score reset to 0 and "Question 1 of 10" shown.

### Error Screen

- [ ] Step: Disconnect your device from the internet, then click "Start Game" → Expected: Instead of a broken or blank screen, an error screen appears with the heading "Oops!" and the message "We couldn't load questions right now — the trivia service may be temporarily unavailable. Please try again in a moment." A "Try Again" button is visible.
- [ ] Step: On the error screen, click "Try Again" → Expected: The error screen disappears and the start screen appears with the category and difficulty dropdowns intact.

---

## Level 3: Edge Cases

- [ ] Step: Click "Start Game" rapidly two or more times in quick succession → Expected: Only one game starts. The app does not show multiple overlapping game screens or duplicate questions.
- [ ] Step: During the 1.5-second feedback window after clicking an answer, click "Start Game" or navigate away using the browser back button → Expected: The feedback completes and the next question loads as normal, or the navigation works cleanly without leaving the app in a stuck state.
- [ ] Step: Select "Hard" difficulty for a category that may have very few hard questions (such as Sports or Television) → Expected: Either the game loads successfully with 10 questions, or if the API cannot find enough questions, the error screen appears with the friendly error message (not a blank or broken screen).
- [ ] Step: Refresh the browser tab mid-game (press F5 or Cmd+R) → Expected: The app returns to the start screen. The game does not resume from where it left off (this is expected behavior — the game has no save state).
- [ ] Step: Complete a full game answering every question correctly (score: 10) → Expected: The results screen shows "10" as the large score and "out of 10 correct" below it.
- [ ] Step: Complete a full game answering every question wrong (score: 0) → Expected: The results screen shows "0" as the large score and "out of 10 correct" below it.
- [ ] Step: Resize the browser window to a narrow mobile-like width (approximately 375px wide) → Expected: The card remains readable, the question text does not overflow the card, and the answer buttons remain usable (they may stack or become narrower, but should not overlap or disappear).
- [ ] Step: Observe a question that contains special characters such as apostrophes, quotes, or ampersands (e.g., "What's the capital of...") → Expected: The question text displays correctly with the actual character (not garbled codes like `&#039;` or `&amp;`). Same for answer buttons.

---

## Autonomous Addition Review

No autonomous additions detected in this version. All features in the build log correspond directly to prompts in `prompts-learner.md`. The 2-column answer grid layout and the curated category list were deliberate design decisions documented in the build log, not features that go beyond the PRD spec.
