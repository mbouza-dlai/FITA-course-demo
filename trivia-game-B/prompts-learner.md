# Trivia Game App — Prompt Sequences

## Phase 1 — MVP

### Prompt 1.1 — Initial Build

I want to build a single-player trivia game that runs in the browser. Here is how it should work:

Before the game starts, the player sees a start screen where they can pick a category (like Science, History, or Sports) and a difficulty level (Easy, Medium, or Hard). There is a "Start Game" button.

When the game begins, questions are pulled live from the Open Trivia Database, which is a free public trivia service at opentdb.com. The app should use the category and difficulty the player chose to request the questions. Fetch 10 questions per game.

During the game, show one question at a time with four clickable answer options below it. Show the player's current score in the corner so they can see it update as they play.

When the player answers all 10 questions, show a results screen with their final score (for example, "You got 7 out of 10!") and a "Play Again" button that takes them back to the start screen.

Keep the layout clean and simple — the question in the middle of the screen, the four answer buttons stacked below it, and the score tucked in the top corner.

### Prompt 1.2 — Answer Feedback

Right now when I click an answer, the game moves on without any reaction. I want the player to know immediately whether they got it right or wrong before moving to the next question.

When the player clicks an answer:
- If it is correct, highlight that button in green
- If it is wrong, highlight that button in red and also show the correct answer highlighted in green
- After about 1.5 seconds, automatically move to the next question

The answer buttons should not be clickable again after the player has already picked one.

### Prompt 1.3 — API Error Handling

If the Open Trivia Database is temporarily unavailable or returns an error when the game tries to load questions, the player just sees a broken screen with no explanation. Fix this.

When the app cannot load questions from the API for any reason, show a friendly message on screen that tells the player something like "We couldn't load questions right now — the trivia service may be temporarily unavailable. Please try again in a moment." Include a button that lets the player try again.

This message should appear instead of the broken state, not on top of a broken screen.

### Prompt 1.4 — Debugging: Score Not Updating

The score in the corner is not updating when I answer questions correctly. I can answer several questions in a row and the number stays at zero the whole time. Can you figure out what is going wrong and fix it so the score goes up by 1 each time I get a correct answer?

### Prompt 1.5 — Checkpoint Before Phase 2

The game is working well at this point. The start screen works, questions load from the API, answers highlight correctly, the score updates, and the results screen shows at the end. Let's lock in this version as a stable checkpoint before we add any new features.

Please review the whole app and make sure all five of these things work correctly end-to-end:
1. The start screen shows category and difficulty options
2. Clicking "Start Game" loads 10 questions from opentdb.com
3. Each answer click shows green or red feedback before moving on
4. The score in the corner increments for correct answers
5. The results screen shows the final score and the "Play Again" button works

If anything is broken, fix it now. Once everything passes, we are done with the first version.

---

## Phase 2 — Persistence and Challenge

### Prompt 2.1 — High Score Persistence

Right now, when I close the browser and come back, there is no memory of what my best score ever was. I want the app to remember the player's all-time best score even after the tab is closed and reopened.

Using the browser's built-in storage (the kind that keeps data between sessions without needing a server), save the player's score at the end of each game. If the new score is higher than the saved best score, update the saved best score.

Show the all-time best score on both the start screen and the results screen so the player always knows what they are trying to beat.

### Prompt 2.2 — Countdown Timer

I want to add pressure to the game. Each question should have a countdown timer that gives the player a limited amount of time to answer.

Add a visible countdown that starts at 15 seconds when each question appears. The timer should count down visibly on screen so the player can see it ticking. If the timer hits zero before the player clicks an answer, automatically mark the question as wrong, briefly show the correct answer highlighted in green, and then move to the next question after 1.5 seconds.

The timer should reset to 15 seconds each time a new question loads.

### Prompt 2.3 — Past Scores Leaderboard

I want the player to be able to see how they have been improving over time on this device. After each completed game, save the score to a list of past scores stored in the browser's built-in storage.

On the results screen, show the last 5 scores the player has gotten on this device, listed from newest to oldest. Label this section something like "Your Recent Scores." This list should update each time a new game is completed.

Do not show player names — just the scores and the date each game was played.

### Prompt 2.4 — Debugging: Timer Keeps Running After Answer

The countdown timer keeps ticking after I click an answer. Sometimes it hits zero while the green/red feedback is still showing, and it counts the question as wrong even though I already answered correctly. Can you identify what is causing the timer to keep running after an answer is selected and fix it so the timer stops the moment a player clicks any answer?

### Prompt 2.5 — Wrong Answer Explanation

Right now when I get a question wrong, I can see which answer was correct, but I have no idea why that answer is right. I want to help the player learn from their mistakes.

After the player selects a wrong answer, show the correct answer highlighted in green as before, and below it show a short one-sentence explanation of why that answer is correct. The explanation should appear during the same 1.5-second feedback window before the next question loads.

Pull the explanation text from the Open Trivia Database if it provides one. If the API does not include an explanation for a question, just skip the explanation text for that question — do not show a blank or error.

### Prompt 2.6 — Final Review Checkpoint

All the Phase 2 features should be working now. Before we call this complete, do a full end-to-end check of the entire app — both the original features and the new ones.

Verify that each of these works correctly:
1. The start screen shows category, difficulty, and the all-time best score
2. A full game loads questions, shows timer countdowns, gives answer feedback, and tracks the score
3. If the timer runs out, the question is marked wrong and the game moves on
4. The results screen shows the final score, the all-time high score, and the last 5 recent scores
5. Closing the browser tab and coming back still shows the saved high score and recent scores
6. The "Play Again" button returns to the start screen and a new game works correctly

Fix anything that is broken before we finish.
