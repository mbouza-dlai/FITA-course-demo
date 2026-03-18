# Trivia Game App — Annotated Prompt Sequences

---

## Phase 1 — MVP

---

### Prompt 1.1 — Initial Build

I want to build a single-player trivia game that runs in the browser. Here is how it should work:

Before the game starts, the player sees a start screen where they can pick a category (like Science, History, or Sports) and a difficulty level (Easy, Medium, or Hard). There is a "Start Game" button.

When the game begins, questions are pulled live from the Open Trivia Database, which is a free public trivia service at opentdb.com. The app should use the category and difficulty the player chose to request the questions. Fetch 10 questions per game.

During the game, show one question at a time with four clickable answer options below it. Show the player's current score in the corner so they can see it update as they play.

When the player answers all 10 questions, show a results screen with their final score (for example, "You got 7 out of 10!") and a "Play Again" button that takes them back to the start screen.

Keep the layout clean and simple — the question in the middle of the screen, the four answer buttons stacked below it, and the score tucked in the top corner.

> **Why this prompt works:** This is a mini-PRD prompt — it communicates the app's goal, the core user journey from start to finish, the external data source and where it comes from, and a basic layout description all in one message. By naming the API (opentdb.com) and describing the desired behavior rather than the implementation, the learner hands the coding agent a complete product brief instead of a vague instruction.
>
> **Concept demonstrated:** PRD / scoping — Module 3, Video 3.1. Establishes the pattern of describing what the app does for the user before asking anything to be built.
>
> **Common learner mistake:** A learner might type only "Build me a trivia game." This gives the agent no context about the data source, the game flow, the number of questions, or the layout, resulting in a generic or incorrect starting point that requires many correction rounds.
>
> **If this fails:** If the agent does not fetch questions from opentdb.com or shows hardcoded questions instead, follow up with: "The questions should come live from opentdb.com each time the game starts — please make sure the app is actually fetching them from that URL when I click Start Game."

---

### Prompt 1.2 — Answer Feedback

Right now when I click an answer, the game moves on without any reaction. I want the player to know immediately whether they got it right or wrong before moving to the next question.

When the player clicks an answer:
- If it is correct, highlight that button in green
- If it is wrong, highlight that button in red and also show the correct answer highlighted in green
- After about 1.5 seconds, automatically move to the next question

The answer buttons should not be clickable again after the player has already picked one.

> **Why this prompt works:** This prompt follows the one-feature-at-a-time rule and describes the desired behavior entirely in visual and interactive terms — colors, timing, and what should be blocked — without any reference to event listeners, state, or UI framework concepts. It also prevents a common unintended behavior (double-clicking) by stating it explicitly.
>
> **Concept demonstrated:** Iteration — Module 3, Video 3.1. Models the build-then-refine loop: get the skeleton working first, then layer in polish one behavior at a time.
>
> **Common learner mistake:** A learner might try to pack answer feedback, timer logic, and score display into a single prompt. This overwhelms the agent and makes it hard to isolate which part broke when something goes wrong.
>
> **If this fails:** If the green/red colors do not appear, try: "After the player clicks an answer, the correct answer button should turn green and the wrong answer button should turn red — the color should be visible on the button itself, not just a text message."

---

### Prompt 1.3 — API Error Handling

If the Open Trivia Database is temporarily unavailable or returns an error when the game tries to load questions, the player just sees a broken screen with no explanation. Fix this.

When the app cannot load questions from the API for any reason, show a friendly message on screen that tells the player something like "We couldn't load questions right now — the trivia service may be temporarily unavailable. Please try again in a moment." Include a button that lets the player try again.

This message should appear instead of the broken state, not on top of a broken screen.

> **Why this prompt works:** This prompt models the API failure mode behavior taught in Video 3.3 — distinguishing between an app bug and an external service problem. The phrasing "the trivia service may be temporarily unavailable" teaches the learner to communicate this distinction to users without blaming their own app. Describing the broken state first gives the agent context about what currently happens before asking for the fix.
>
> **Concept demonstrated:** API failure modes — Module 3, Video 3.3. Directly models the concept of recognizing and handling rate limits, downtime, and bad responses from an external API.
>
> **Common learner mistake:** Learners often skip error handling entirely, assuming the API will always work. This leaves users stranded with a silent failure that looks like an app bug. Instructors should call out that the Open Trivia Database does occasionally hit rate limits and has maintenance windows.
>
> **If this fails:** If the error message does not appear during testing, tell the agent: "To test this, temporarily point the API request at a bad URL and make sure the friendly error message appears on screen instead of a blank or broken layout."

---

### Prompt 1.4 — Debugging: Score Not Updating

The score in the corner is not updating when I answer questions correctly. I can answer several questions in a row and the number stays at zero the whole time. Can you figure out what is going wrong and fix it so the score goes up by 1 each time I get a correct answer?

> **Why this prompt works:** This is a canonical debugging prompt — it describes the observed broken behavior ("stays at zero") in plain terms without guessing at the cause. It does not say "fix the state variable" or "check the increment logic" because the learner does not know those terms. Handing the agent a symptom and asking it to diagnose is exactly the troubleshooting pattern taught in Video 1.5.
>
> **Concept demonstrated:** Debugging — Module 1, Video 1.5 (debugging behavior taught early in the course; applied here in the context of an API-driven app). Models: describe what you see, not what you think the cause is.
>
> **Common learner mistake:** A learner might say "fix the score counter" or "update the score variable" — guessing at a technical cause they do not understand. This can send the agent down the wrong path. Describing the observed behavior is always more reliable than guessing at the code-level cause.
>
> **If this fails:** If the agent's fix does not resolve the issue, follow up with: "The score still is not changing. Can you walk me through exactly when the score is supposed to go up and show me where in the app that is happening?"

---

### Prompt 1.5 — Checkpoint Before Phase 2

The game is working well at this point. The start screen works, questions load from the API, answers highlight correctly, the score updates, and the results screen shows at the end. Let's lock in this version as a stable checkpoint before we add any new features.

Please review the whole app and make sure all five of these things work correctly end-to-end:
1. The start screen shows category and difficulty options
2. Clicking "Start Game" loads 10 questions from opentdb.com
3. Each answer click shows green or red feedback before moving on
4. The score in the corner increments for correct answers
5. The results screen shows the final score and the "Play Again" button works

If anything is broken, fix it now. Once everything passes, we are done with the first version.

> **Why this prompt works:** This is the versioning and checkpoint prompt that models the "save your work before adding features" habit taught in the course. Rather than just saying "save this," it prompts a full regression check against a numbered list of acceptance criteria — teaching learners to verify their baseline before building on top of it. The numbered list also gives the agent (and the learner) a concrete definition of done.
>
> **Concept demonstrated:** Versioning / checkpointing — Module 1, Video 1.4 (iterative building and saving stable states). Also reinforces PRD scope by re-stating the full MVP feature list as acceptance criteria.
>
> **Common learner mistake:** Learners often skip the checkpoint and immediately pile on new features, then cannot tell whether a new bug was introduced by the new feature or was already present. This prompt instills the habit of establishing a known-good baseline.
>
> **If this fails:** If the agent reports a failing item, address it before moving to Phase 2. Do not proceed until all five items pass — the Phase 2 prompts build directly on top of this working foundation.

---

## Phase 2 — Persistence and Challenge

---

### Prompt 2.1 — High Score Persistence

Right now, when I close the browser and come back, there is no memory of what my best score ever was. I want the app to remember the player's all-time best score even after the tab is closed and reopened.

Using the browser's built-in storage (the kind that keeps data between sessions without needing a server), save the player's score at the end of each game. If the new score is higher than the saved best score, update the saved best score.

Show the all-time best score on both the start screen and the results screen so the player always knows what they are trying to beat.

> **Why this prompt works:** This prompt introduces localStorage by describing its behavior in plain terms ("the browser's built-in storage, the kind that keeps data between sessions without needing a server") rather than naming the technology. The behavioral framing — close tab, come back, data is still there — is exactly how Video 3.1 motivates persistence before naming the mechanism. Placing the high score on both screens is specified so the agent does not arbitrarily choose one location.
>
> **Concept demonstrated:** Persistence with localStorage — Module 3, Video 3.1 (secondary concept: storing game state with localStorage between sessions).
>
> **Common learner mistake:** A learner might ask to "save the score to a database" because that sounds like the right tool for saving data. This would introduce backend complexity that is explicitly out of scope for Module 3. The phrase "browser's built-in storage" steers the agent toward localStorage without the learner needing to know the term.
>
> **If this fails:** If the high score disappears on refresh, follow up with: "The best score should still be there after I close the tab and open the app again — right now it resets when I refresh. Can you check how the score is being saved and make sure it survives a page reload?"

---

### Prompt 2.2 — Countdown Timer

I want to add pressure to the game. Each question should have a countdown timer that gives the player a limited amount of time to answer.

Add a visible countdown that starts at 15 seconds when each question appears. The timer should count down visibly on screen so the player can see it ticking. If the timer hits zero before the player clicks an answer, automatically mark the question as wrong, briefly show the correct answer highlighted in green, and then move to the next question after 1.5 seconds.

The timer should reset to 15 seconds each time a new question loads.

> **Why this prompt works:** This prompt describes the timer in terms of what the player sees and experiences — a visible number counting down, an automatic consequence when it hits zero, a reset on each new question. Every detail a non-technical learner would observe as a player is present. The integration with the existing answer feedback behavior (show correct answer in green, wait 1.5 seconds) is explicitly repeated so the agent connects the new feature to the existing pattern.
>
> **Concept demonstrated:** Iteration — adding a challenge feature on top of the working MVP. Also previews a common interaction bug (timer continuing after answer) which is addressed in Prompt 2.4.
>
> **Common learner mistake:** Learners often forget to specify what happens when the timer expires, leaving the agent to guess — which commonly results in the game freezing or showing a confusing state. Always describe the failure case behavior, not just the happy path.
>
> **If this fails:** If the timer does not reset between questions, follow up with: "The timer should go back to 15 every time a new question appears — right now it seems to carry over from the previous question. Can you make the timer reset completely each time a new question loads?"

---

### Prompt 2.3 — Past Scores Leaderboard

I want the player to be able to see how they have been improving over time on this device. After each completed game, save the score to a list of past scores stored in the browser's built-in storage.

On the results screen, show the last 5 scores the player has gotten on this device, listed from newest to oldest. Label this section something like "Your Recent Scores." This list should update each time a new game is completed.

Do not show player names — just the scores and the date each game was played.

> **Why this prompt works:** This prompt extends the localStorage concept introduced in Prompt 2.1 — saving a single value — to saving a list of values. By building on the pattern the learner already established, it models the iterative expansion of a feature. Specifying "no player names" explicitly closes the door on the learner accidentally asking for a feature that would require user accounts (a forbidden feature in both the PRD and the learning spec).
>
> **Concept demonstrated:** Persistence with localStorage (list storage) — Module 3, Video 3.1. Also reinforces scope discipline by preemptively ruling out user identity features that would require a database.
>
> **Common learner mistake:** Learners often want to add player names to the leaderboard because "that is how leaderboards work." This immediately drags in user identity and database concepts that are out of scope. The prompt prevents this by explicitly saying scores only, no names.
>
> **If this fails:** If scores are not saving between sessions, follow up with: "After I finish a game and click 'Play Again,' the results screen should still show my previous scores when I finish the next game — right now the list seems to clear. Can you check why the past scores are not being kept?"

---

### Prompt 2.4 — Debugging: Timer Keeps Running After Answer

The countdown timer keeps ticking after I click an answer. Sometimes it hits zero while the green/red feedback is still showing, and it counts the question as wrong even though I already answered correctly. Can you identify what is causing the timer to keep running after an answer is selected and fix it so the timer stops the moment a player clicks any answer?

> **Why this prompt works:** This is the Phase 2 debugging prompt. It describes the observed bug with enough behavioral detail ("hits zero while the green/red feedback is still showing," "counts the question as wrong even though I already answered") that the agent has a clear picture of the failure scenario. It does not guess at whether the issue is a clearInterval call or a race condition — it describes what the player sees and asks the agent to diagnose.
>
> **Concept demonstrated:** Debugging — Module 1, Video 1.5. This is a predictable bug that emerges from combining a timer with event-driven answer selection. Instructors should highlight that this kind of interaction bug is extremely common when two timed behaviors share the same state, and that the debugging approach (describe what you observe, not what you think the cause is) applies here exactly as it did in Phase 1.
>
> **Common learner mistake:** A learner might say "fix the timer so it stops." This gives the agent no context about when the timer is still running (after an answer is clicked) or what the consequence is (double-counting a wrong answer). Vague fix requests often result in the agent fixing the symptom in an unrelated place.
>
> **If this fails:** If the issue persists after the fix, follow up with: "Can you add a visible indicator that shows me when the timer is active vs. stopped, so I can confirm the timer is actually stopping when I click an answer?"

---

### Prompt 2.5 — Wrong Answer Explanation

Right now when I get a question wrong, I can see which answer was correct, but I have no idea why that answer is right. I want to help the player learn from their mistakes.

After the player selects a wrong answer, show the correct answer highlighted in green as before, and below it show a short one-sentence explanation of why that answer is correct. The explanation should appear during the same 1.5-second feedback window before the next question loads.

Pull the explanation text from the Open Trivia Database if it provides one. If the API does not include an explanation for a question, just skip the explanation text for that question — do not show a blank or error.

> **Why this prompt works:** This prompt models graceful degradation — asking the agent to handle the case where the API does not return the expected data field without breaking the UI. The phrase "if the API does not include an explanation, just skip it — do not show a blank or error" explicitly teaches the agent (and models for the learner) that external data is never guaranteed to be complete. This is a direct application of the API failure mode concepts from Video 3.3.
>
> **Concept demonstrated:** API failure modes / graceful degradation — Module 3, Video 3.3. The Open Trivia Database does not reliably include explanation fields for all questions; this prompt forces a real-world handling pattern.
>
> **Common learner mistake:** Learners often assume that if the API documentation mentions a field, it will always be present in every response. This prompt models the defensive mindset of "what if this data is missing?" — a critical habit when working with any external data source.
>
> **If this fails:** If a blank space or "undefined" appears instead of being hidden, follow up with: "When there is no explanation available for a question, nothing should appear in that spot — no empty box, no error text, just the correct answer highlighted in green as normal."

---

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

> **Why this prompt works:** This is the Phase 2 versioning and final checkpoint prompt. It follows the same pattern established in Prompt 1.5 — a numbered acceptance criteria list that covers every feature in scope — but now spans both phases. Including Phase 1 items alongside Phase 2 items models regression testing: the habit of verifying that new features did not break existing ones. The explicit localStorage check (item 5) is the most important test for the Module 3 persistence concept and should not be skipped.
>
> **Concept demonstrated:** Versioning / regression testing — Module 1, Video 1.4. Closing the loop on the full build by revisiting all acceptance criteria, not just the new ones.
>
> **Common learner mistake:** Learners often only test the feature they just added and assume everything else still works. Instructors should demonstrate this prompt as the "definition of done" ritual and explain that software regressions — new code breaking old features — are one of the most common reasons apps feel unreliable.
>
> **If this fails:** If multiple items fail at once, address them one at a time starting with the first broken item in the list. Do not ask the agent to fix everything simultaneously — use the same one-feature-at-a-time debugging approach modeled throughout this prompt sequence.
