# Instructor Guide — Trivia Game App

## 1. Episode Brief

- **App name:** Trivia Game App
- **Module:** 3
- **Videos covered:** 3.1, 3.2, 3.3
- **Phase 1 prompts:** 1.1 – 1.5 (MVP build)
- **Phase 2 prompts:** 2.1 – 2.6 (Persistence and Challenge)

**What the learner watches, then does:**
In this demo the instructor builds a browser-based trivia game from scratch using an AI coding agent, pulling live questions from the Open Trivia Database — a free, public API at opentdb.com. The learner watches the full build across two phases: first getting a working game with question fetching, answer feedback, score tracking, and error handling; then adding localStorage persistence for a high score and a leaderboard, plus a countdown timer per question. After watching, the learner follows the same prompt sequence themselves to build the identical app.

**The ONE thing the learner must walk away understanding:**
A free external API is just a URL that returns structured data — and an AI coding agent can connect any app to one without the learner writing backend code.

---

## 2. Pre-filming Checklist

### Machine and Browser Setup

- [ ] Use **Google Chrome** or **Firefox** — these show the browser DevTools Network panel most clearly if you need to demonstrate an API call live.
- [ ] Set browser zoom to **100%** and font size to default. Increase OS display scaling if the card text looks small on camera.
- [ ] **Clear browser history and localStorage** for the trivia game before filming Phase 2. Open DevTools → Application → Local Storage → clear all entries for the file:// origin. This ensures the "All-Time Best" banner shows "—" on first launch, which is the clean starting state for the Phase 2 demo.
- [ ] Confirm you have an **active internet connection.** The app fetches questions live from opentdb.com — no internet means the error screen fires immediately and the game never starts.
- [ ] Have **one browser tab open** to the app (file:// path to the appropriate index.html). Close all unrelated tabs to reduce visual clutter.
- [ ] Have **one additional browser tab open** to `https://opentdb.com/api_config.php` — you will show this during the teaching moment after Prompt 1.1. Do not open it until that moment.
- [ ] Set your **screen resolution to 1920x1080** or your recording resolution equivalent. The trivia card is centered on a dark navy background — at lower resolutions it may be clipped.
- [ ] **Increase your editor/terminal font size** to at least 18pt if you show any code. Learners watching on a phone screen cannot read 12pt monospace.

### App Versions to Have Ready

- [ ] Open `v2/index.html` in a separate browser tab before filming. **This is the finished app.** Show it at the top of the video before typing a single prompt, so learners know exactly where they are headed.
- [ ] When filming, use a fresh Claude Code or Lovable session. Do not use a pre-seeded session with any prior context.
- [ ] Have `v1/index.html` ready to open as a reference if Phase 1 needs a fallback — but aim to build live rather than swap in the reference version unless something is unrecoverable on camera.

### API and External Services

- [ ] **No API key required.** The Open Trivia Database (opentdb.com) is completely free and requires no account or key. Do not set up any API key — if the agent tries to use one, stop and clarify.
- [ ] **No environment variables needed.** The API URL is hardcoded directly in the app.
- [ ] Test the API yourself before filming: visit `https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple` in your browser. You should see JSON with 10 questions. If the site is down, reschedule filming.
- [ ] **Check opentdb.com status before every recording session.** The site occasionally has maintenance windows. A quick browser check takes 10 seconds and saves a ruined take.

### Scripting and Display Setup

- [ ] Have `prompts-learner.md` open in a text editor on a second monitor (or printed). You will copy-paste prompts verbatim — do not type them from memory.
- [ ] Set your text editor to a **large font with high contrast** if it will be visible on screen. Dark background, light text is ideal for screen recording.
- [ ] Close Slack, email, and any app that could generate a notification banner during recording.
- [ ] Silence your phone.

---

## 3. Prompt-by-Prompt Narration Guide

---

### Prompt 1.1 — Initial Build

**Say:**
> "Before we type anything, let me show you where we're headed."

Show the finished app (`v2/index.html`) in the browser. Click through it: pick a category, start a game, answer a few questions. Let the timer count down. Point at the score badge. Let a question time out. Then close that tab.

> "That's the complete app we're going to build today — from scratch, with no code written by hand. Let's start at the very beginning."

Switch to the clean Claude Code or Lovable session.

> "Here's the first thing I want you to notice about how I'm going to write this prompt. I'm not just going to say 'build me a trivia game' and hope for the best. I'm going to describe what the player experiences, from the first screen to the last, and I'm going to name the actual data source the app needs to connect to. That specificity is what gives the AI enough context to build the right thing."

**Type:**
```
I want to build a single-player trivia game that runs in the browser. Here is how it should work:

Before the game starts, the player sees a start screen where they can pick a category (like Science, History, or Sports) and a difficulty level (Easy, Medium, or Hard). There is a "Start Game" button.

When the game begins, questions are pulled live from the Open Trivia Database, which is a free public trivia service at opentdb.com. The app should use the category and difficulty the player chose to request the questions. Fetch 10 questions per game.

During the game, show one question at a time with four clickable answer options below it. Show the player's current score in the corner so they can see it update as they play.

When the player answers all 10 questions, show a results screen with their final score (for example, "You got 7 out of 10!") and a "Play Again" button that takes them back to the start screen.

Keep the layout clean and simple — the question in the middle of the screen, the four answer buttons stacked below it, and the score tucked in the top corner.
```

**While waiting:**
This is the largest prompt in the build — expect 30 to 60 seconds of generation time. Narrate while the agent works:

> "This prompt is acting like a mini product brief — it tells the AI what the product is for, what the user does at each stage, where the data comes from, and what the layout should look like. When you give an AI this much context upfront, you get a much cleaner first result that needs less fixing."

> "Notice I named the API — opentdb.com — and I described it as 'a free public trivia service.' I didn't tell the AI how to call it. That's the AI's job."

**Highlight:**
When the app renders, click through it live. Point out:
- The start screen with the Category and Difficulty dropdowns
- The score badge in the top-right corner of the game card
- After clicking "Start Game": watch the "Loading questions…" message briefly flash, confirming a live API call just happened
- One question appearing with four answer buttons
- The results screen after answering all 10 questions

Say: "Look at this — the app is fetching real trivia questions from the internet. I didn't write a single line of code. I described what I wanted, and the AI figured out how to connect to the API."

**If it breaks:**
If questions are hardcoded (you see the same question every time or obviously generic placeholder text):
> "Interesting — looks like the AI didn't connect to the live API. Let me clarify that."

Follow up with: "The questions should come live from opentdb.com each time the game starts — please make sure the app is actually fetching them from that URL when I click Start Game."

If the app does not render at all:
> "The AI gave us something unexpected. Let me take a look at what it built and give it a bit more direction."

Ask the agent: "The app isn't rendering correctly. Can you check for any errors and fix them?"

---

### Prompt 1.2 — Answer Feedback

**Say:**
> "We've got a working game, but right now when I click an answer — watch what happens."

Click an answer in the live app. It advances immediately with no color change.

> "Nothing. No green, no red, no feedback. The player has no idea if they were right or wrong before the next question appears. Let's fix that. And notice how I'm going to write this fix: one feature at a time. I'm not going to ask for the timer, the leaderboard, and the colors all at once. I'm going to ask for exactly one behavior, describe it precisely, and let the AI focus."

**Type:**
```
Right now when I click an answer, the game moves on without any reaction. I want the player to know immediately whether they got it right or wrong before moving to the next question.

When the player clicks an answer:
- If it is correct, highlight that button in green
- If it is wrong, highlight that button in red and also show the correct answer highlighted in green
- After about 1.5 seconds, automatically move to the next question

The answer buttons should not be clickable again after the player has already picked one.
```

**While waiting:**
Expect 15 to 30 seconds. Say:

> "I described this entirely in terms of what the player sees — colors, timing, what happens when they click again. I didn't say 'add an event listener' or 'update the state variable.' I don't need to know those things. The AI does."

**Highlight:**
Play a question and click a correct answer. Point at the green highlight on the button. Then click a wrong answer on the next question. Point at the red button and simultaneously the green correct-answer button lighting up.

> "Both colors appear at the same time — the wrong answer in red, and the correct answer revealed in green. And after 1.5 seconds, it advances automatically. And if I try to click again during that window —"

Click another button while feedback is showing.

> "Nothing happens. The buttons are locked. That's the behavior we described, working exactly as specified."

**If it breaks:**
If colors do not appear:
> "The feedback isn't showing as color on the buttons themselves. Let me be more specific."

Follow up with: "After the player clicks an answer, the correct answer button should turn green and the wrong answer button should turn red — the color should be visible on the button itself, not just a text message."

---

### Prompt 1.3 — API Error Handling

**Say:**
> "The game works great when everything is going smoothly. But what happens when the API isn't available? Let me show you the broken state."

Briefly describe (or if safe to demo, temporarily disconnect WiFi): "If opentdb.com goes down — or if your connection drops — right now the player just sees... nothing. Or a blank screen. No explanation. They'd think the app is broken. That's not a good experience."

Reconnect if needed.

> "One of the most important things to understand about working with any external API is that it will occasionally fail. The service has maintenance windows. You might hit a rate limit. A connection might drop. Your app has to be ready for that — not by preventing it, but by handling it gracefully."

**Type:**
```
If the Open Trivia Database is temporarily unavailable or returns an error when the game tries to load questions, the player just sees a broken screen with no explanation. Fix this.

When the app cannot load questions from the API for any reason, show a friendly message on screen that tells the player something like "We couldn't load questions right now — the trivia service may be temporarily unavailable. Please try again in a moment." Include a button that lets the player try again.

This message should appear instead of the broken state, not on top of a broken screen.
```

**While waiting:**
Expect 15 to 25 seconds. Say:

> "Notice the language I used: 'the trivia service may be temporarily unavailable.' Not 'there's a bug in your app.' Not 'something went wrong.' We're teaching the player that the problem is external — which is both accurate and reassuring."

**Highlight:**
To demonstrate the error screen: disconnect from WiFi, click "Start Game," and point at the error screen when it appears. Point at the "Oops!" heading, the friendly message text, and the "Try Again" button.

> "This replaces the broken state entirely. No broken layout behind it — just a clean, honest message. Click 'Try Again' —"

Click "Try Again" and reconnect to WiFi.

> "And we're back at the start screen, ready to play."

Reconnect WiFi before continuing.

**If it breaks:**
If the error screen does not appear when disconnected:
> "The error handling isn't catching the failure yet. Let me give it a test case to work with."

Follow up with: "To test this, temporarily point the API request at a bad URL and make sure the friendly error message appears on screen instead of a blank or broken layout."

---

### Prompt 1.4 — Debugging: Score Not Updating

**Say:**
> "Here's something that came up when I was testing the app — and I want to use it as a teaching moment, because this is exactly the kind of bug you'll encounter when you're building your own apps."

Play a question, answer it correctly, and point at the score badge.

> "I answered that correctly — but look at the score. It's still zero. I can keep answering and it never moves. Now, here's the key thing I want you to notice about how I'm going to report this. I am not going to say 'fix the score variable' or 'update the counter.' I have no idea what the code looks like. I'm going to describe exactly what I see — the symptom — and let the AI diagnose the cause."

**Type:**
```
The score in the corner is not updating when I answer questions correctly. I can answer several questions in a row and the number stays at zero the whole time. Can you figure out what is going wrong and fix it so the score goes up by 1 each time I get a correct answer?
```

**While waiting:**
Expect 10 to 20 seconds. Say:

> "Describing what you observe — not what you think the cause is — is the single most useful debugging habit you can build. The AI has access to the code. It can diagnose the cause. Your job is just to describe the broken behavior clearly."

**Highlight:**
After the fix is applied, play a question and answer it correctly. Point at the score badge incrementing.

> "There it is — the score goes up by 1. Let me answer another one. And another. Each correct answer increments the score, and wrong answers don't. The fix worked."

**If it breaks:**
If the score still does not increment:
> "Still stuck at zero. The AI may need more to go on."

Follow up with: "The score still is not changing. Can you walk me through exactly when the score is supposed to go up and show me where in the app that is happening?"

---

### Prompt 1.5 — Checkpoint Before Phase 2

**Say:**
> "The game is working well. Before we add anything new, I want to stop and do something that a lot of learners skip — and they always regret it. We're going to lock in a stable checkpoint."

> "Here's why this matters: every time you add a new feature, you risk accidentally breaking something that was already working. If you don't check your baseline before you start adding, you can't tell whether a bug was caused by the new feature or was already there. So we check everything now, while we know it's all working."

**Type:**
```
The game is working well at this point. The start screen works, questions load from the API, answers highlight correctly, the score updates, and the results screen shows at the end. Let's lock in this version as a stable checkpoint before we add any new features.

Please review the whole app and make sure all five of these things work correctly end-to-end:
1. The start screen shows category and difficulty options
2. Clicking "Start Game" loads 10 questions from opentdb.com
3. Each answer click shows green or red feedback before moving on
4. The score in the corner increments for correct answers
5. The results screen shows the final score and the "Play Again" button works

If anything is broken, fix it now. Once everything passes, we are done with the first version.
```

**While waiting:**
Expect 20 to 45 seconds for a full review. Say:

> "I gave the AI a numbered checklist — five specific acceptance criteria. This is your definition of done for Phase 1. If anything on this list fails, we fix it before we move forward. We do not move forward with a broken foundation."

**Highlight:**
Walk through each of the five items manually in the live app while the agent confirms them:

1. Show the start screen with the Category and Difficulty dropdowns.
2. Click "Start Game" — point at the loading message confirming a live fetch.
3. Click an answer — show the green or red highlight.
4. Point at the score badge incrementing.
5. Let the game finish — show the results screen, click "Play Again."

> "All five — confirmed. This is Version 1. From here, everything we add builds on top of this working foundation."

**If it breaks:**
If the agent flags a failing item:
> "Good — the checkpoint caught something. Let's fix this before we go any further."

Address the failing item directly before moving to Phase 2. Do not skip it.

---

### Prompt 2.1 — High Score Persistence

**Say:**
> "Now we move into Phase 2. Phase 1 gave us a fully working trivia game. Phase 2 is about making it feel more complete — starting with a feature that a lot of games have but that can be surprisingly tricky: remembering your best score even after you close the browser."

Close the browser tab and reopen the app.

> "I just closed the tab and came back. My score is gone. The game has no memory. Let's fix that — but notice how I describe the solution in the prompt. I'm not going to say 'use localStorage.' I'm going to describe the behavior I want, and let the AI choose the right tool."

**Type:**
```
Right now, when I close the browser and come back, there is no memory of what my best score ever was. I want the app to remember the player's all-time best score even after the tab is closed and reopened.

Using the browser's built-in storage (the kind that keeps data between sessions without needing a server), save the player's score at the end of each game. If the new score is higher than the saved best score, update the saved best score.

Show the all-time best score on both the start screen and the results screen so the player always knows what they are trying to beat.
```

**While waiting:**
Expect 15 to 25 seconds. Say:

> "I described localStorage without naming it — 'the browser's built-in storage, the kind that keeps data between sessions without needing a server.' That phrase does two things: it describes what we want, and it rules out the wrong tools. No database. No server. Just the browser's own memory."

**Highlight:**
Complete a game, note the score on the results screen. Point at the "All-Time Best" banner. Then close the tab, reopen `v2/index.html` (or the live-built version).

> "The tab is closed. Now let me open the app again."

Point at the "All-Time Best" banner on the start screen showing the previous score.

> "It's still there. The browser remembered it. That's localStorage — data that survives a closed tab without any server at all."

**If it breaks:**
If the score disappears on refresh:
> "The score reset when I closed the tab. The data isn't surviving the session yet."

Follow up with: "The best score should still be there after I close the tab and open the app again — right now it resets when I refresh. Can you check how the score is being saved and make sure it survives a page reload?"

---

### Prompt 2.2 — Countdown Timer

**Say:**
> "The game is fun, but there's no pressure. You can sit and think about each question as long as you want. Let's add a timer — and I'll show you how to describe a timed feature precisely enough that the AI gets it right."

> "The key with a timer prompt is to describe what happens at both ends: what the timer looks like when it starts, and what happens when it hits zero. A lot of people describe only the happy path and end up with a timer that doesn't know what to do when it expires."

**Type:**
```
I want to add pressure to the game. Each question should have a countdown timer that gives the player a limited amount of time to answer.

Add a visible countdown that starts at 15 seconds when each question appears. The timer should count down visibly on screen so the player can see it ticking. If the timer hits zero before the player clicks an answer, automatically mark the question as wrong, briefly show the correct answer highlighted in green, and then move to the next question after 1.5 seconds.

The timer should reset to 15 seconds each time a new question loads.
```

**While waiting:**
Expect 20 to 40 seconds. Say:

> "Notice I described both the normal case and the timeout case. When zero is hit: mark as wrong, show the correct answer in green, wait 1.5 seconds, move on. That 1.5-second pause is consistent with what we built in Phase 1 for answer feedback — connecting the new behavior to the existing pattern."

**Highlight:**
Start a game. Point at the circular timer badge in the top-left of the game card.

> "The timer starts at 15. Watch it count down."

Let it tick a few seconds, then answer a question. Point at the timer stopping immediately when you click.

> "The moment I clicked, the timer stopped. Now watch what happens if I let it run out."

Start a new question and do not click anything. Let the timer reach zero. Point at the correct answer lighting up green automatically.

> "Zero — the question was automatically marked wrong, the correct answer is revealed, and after 1.5 seconds we'll move on. The same feedback behavior we built in Phase 1, but triggered by the clock instead of a click."

**If it breaks:**
If the timer does not reset between questions:
> "The timer is carrying over from the previous question instead of resetting. Let me be specific about that."

Follow up with: "The timer should go back to 15 every time a new question appears — right now it seems to carry over from the previous question. Can you make the timer reset completely each time a new question loads?"

---

### Prompt 2.3 — Past Scores Leaderboard

**Say:**
> "We can now see our all-time best score. But what if you want to track how you've been improving game by game? Let's add a recent scores list — and I'll show you how we extend the localStorage pattern we already established."

**Type:**
```
I want the player to be able to see how they have been improving over time on this device. After each completed game, save the score to a list of past scores stored in the browser's built-in storage.

On the results screen, show the last 5 scores the player has gotten on this device, listed from newest to oldest. Label this section something like "Your Recent Scores." This list should update each time a new game is completed.

Do not show player names — just the scores and the date each game was played.
```

**While waiting:**
Expect 15 to 25 seconds. Say:

> "A small but important detail in this prompt: 'do not show player names.' That one phrase closes the door on a feature that sounds small but would actually require a database and user accounts — things that are completely out of scope for what we're building. Ruling out what you don't want is just as important as describing what you do want."

**Highlight:**
Complete a game and go to the results screen. Point at the "Your Recent Scores" section. Show one entry with a score and a date.

Complete another quick game. Return to the results screen.

> "Two entries now — the newest game at the top, the older one below it. No player names. Just scores and dates. Let me play a few more times to fill this out."

After 5+ games, point at the list being capped at 5 entries.

> "No matter how many games you play, it always shows just the last five. The list doesn't grow forever — it stays clean."

**If it breaks:**
If scores disappear between sessions:
> "The recent scores aren't persisting after I close the tab. Let me clarify."

Follow up with: "After I finish a game and click 'Play Again,' the results screen should still show my previous scores when I finish the next game — right now the list seems to clear. Can you check why the past scores are not being kept?"

---

### Prompt 2.4 — Debugging: Timer Keeps Running After Answer

**Say:**
> "We have a bug — and this one is a great example of the kind of interaction bug that comes up whenever two timed behaviors share the same state. Watch what happens."

Click an answer quickly and watch if the timer continues ticking during the 1.5-second feedback window. (It should, based on the known bug from this build phase.)

> "Did you see that? I clicked an answer, but the timer kept going. If it hits zero during the feedback window, it counts the question as wrong even though I already answered. This is a real bug — and it's predictable. Anytime you combine a timer with an event, you have to think about what happens to the timer when the event fires."

> "Here's how I'm going to report it. Same rule as before: describe what you observe, not what you think the cause is."

**Type:**
```
The countdown timer keeps ticking after I click an answer. Sometimes it hits zero while the green/red feedback is still showing, and it counts the question as wrong even though I already answered correctly. Can you identify what is causing the timer to keep running after an answer is selected and fix it so the timer stops the moment a player clicks any answer?
```

**While waiting:**
Expect 10 to 20 seconds. Say:

> "This is a classic symptom description: 'keeps ticking after I click an answer,' 'hits zero while the feedback is showing,' 'counts the question as wrong even though I already answered.' Each detail gives the AI a clearer picture of exactly when the bug occurs. The more precise your symptom description, the faster the fix."

**Highlight:**
After the fix, click an answer with several seconds left on the timer. Point at the timer stopping immediately on click.

> "Timer stopped the moment I clicked. It does not continue during the 1.5-second feedback window. That's the fix — confirmed."

Let a question time out, then answer the next one correctly. Point at the score incrementing correctly.

> "And the timeout on one question does not affect the next one. Clean."

**If it breaks:**
If the issue persists:
> "Still running. The AI might need a visible indicator to help us confirm what's happening."

Follow up with: "Can you add a visible indicator that shows me when the timer is active vs. stopped, so I can confirm the timer is actually stopping when I click an answer?"

---

### Prompt 2.5 — Wrong Answer Explanation

**Say:**
> "The last feature I want to add is helpful for the player: when they get a question wrong, they should see not just the correct answer, but a brief explanation of why it's correct. This prompt is going to teach us something important about working with external APIs — data fields you expect to be there are not always there."

**Type:**
```
Right now when I get a question wrong, I can see which answer was correct, but I have no idea why that answer is right. I want to help the player learn from their mistakes.

After the player selects a wrong answer, show the correct answer highlighted in green as before, and below it show a short one-sentence explanation of why that answer is correct. The explanation should appear during the same 1.5-second feedback window before the next question loads.

Pull the explanation text from the Open Trivia Database if it provides one. If the API does not include an explanation for a question, just skip the explanation text for that question — do not show a blank or error.
```

**While waiting:**
Expect 15 to 25 seconds. Say:

> "Notice the last sentence: 'If the API does not include an explanation, just skip it — do not show a blank or error.' I'm asking for graceful degradation. The Open Trivia Database actually does not include explanation fields in its responses — so this feature will be built and ready, but silently inactive until the API adds that data. The important lesson: never assume a data field will always be present just because you want it to be."

**Highlight:**
Answer a question wrong. During the 1.5-second feedback window, point at the correct answer highlighted in green. Note that no explanation appears — and explain why that is correct behavior, not a bug.

> "No explanation text appeared — and that is exactly right. The Open Trivia Database doesn't send explanation data. The app handles that gracefully by showing nothing instead of an error or a blank box. If opentdb.com ever adds explanations in the future, this feature will start working automatically. That's graceful degradation."

**If it breaks:**
If a blank space, "undefined," or an error message appears below the correct answer:
> "We're getting placeholder text where there should be nothing. Let me be more specific about what 'skip it' means."

Follow up with: "When there is no explanation available for a question, nothing should appear in that spot — no empty box, no error text, just the correct answer highlighted in green as normal."

---

### Prompt 2.6 — Final Review Checkpoint

**Say:**
> "We've added four features in Phase 2 on top of a working Phase 1 foundation. Before we call this complete, we do the same thing we did at the end of Phase 1: a full regression check. We're not just testing the new features — we're testing everything, because new code can break old features in ways that aren't obvious."

> "This is the definition of done ritual for the whole app. I use a numbered list again — every feature, both phases — so the AI and I have a shared, unambiguous checklist."

**Type:**
```
All the Phase 2 features should be working now. Before we call this complete, do a full end-to-end check of the entire app — both the original features and the new ones.

Verify that each of these works correctly:
1. The start screen shows category, difficulty, and the all-time best score
2. A full game loads questions, shows timer countdowns, gives answer feedback, and tracks the score
3. If the timer runs out, the question is marked wrong and the game moves on
4. The results screen shows the final score, the all-time high score, and the last 5 recent scores
5. Closing the browser tab and coming back still shows the saved high score and recent scores
6. The "Play Again" button returns to the start screen and a new game works correctly

Fix anything that is broken before we finish.
```

**While waiting:**
Expect 30 to 60 seconds for a thorough review. Say:

> "Item 5 is the most important test for Module 3's core concept. Closing the tab and reopening — and seeing your data still there — is the proof that localStorage is working. Don't skip this test manually. Do it in front of the learner."

**Highlight:**
Walk through each item manually as a live demo:

1. Show the start screen: category dropdown, difficulty dropdown, "All-Time Best" banner.
2. Start a game — point at the timer counting down, click answers, watch the score badge.
3. Let a question time out — point at correct answer appearing green, game advancing automatically.
4. Finish the game — point at the results screen showing score, all-time best, and the recent scores list.
5. **Close the browser tab. Reopen the app. This is the moment.** Point at the start screen still showing the saved best score.
6. Click "Play Again" — confirm new game starts fresh with score at 0 and timer at 15.

> "Six for six. The app is complete. Both phases, fully working, all tested."

**If it breaks:**
If multiple items fail:
> "A few things need attention. Let's address them one at a time, starting from the top of the list."

Address the first failing item before moving to the next. Do not ask the agent to fix everything at once.

---

## 4. Key Teaching Moments

---

### Teaching Moment A — After Prompt 1.1

**After:** Prompt 1.1 (Initial Build)
**Concept:** What an API is and why external data sources are useful

**When to trigger:** After you've shown the app fetching live questions, but before moving to Prompt 1.2. Navigate to the opentdb.com API tab you prepared.

**Say:**
> "Let me show you something. This is the Open Trivia Database API documentation. See this URL? All it is is a web address with some parameters — category, difficulty, how many questions you want. When our app calls this URL, it gets back a list of questions in a format called JSON. JSON is just structured text — like a very organized list."

> "Here's the key insight: an API is just a URL that returns data. That's it. When you typed that prompt describing opentdb.com, the AI knew how to construct that URL, make the request, and use the response to populate our app. You didn't write any of that code — and you didn't need to understand how it works under the hood to use it."

> "This is why free APIs are so powerful for builders. Someone else built and maintains the trivia database. You just describe what you want, and the AI connects your app to their data."

---

### Teaching Moment B — After Prompt 1.3

**After:** Prompt 1.3 (API Error Handling)
**Concept:** Recognizing common API failure modes — rate limits, downtime, format changes

**When to trigger:** After demonstrating the error screen. Keep the network tab open if visible.

**Say:**
> "Every external API will fail at some point. The Open Trivia Database has maintenance windows. It has rate limits — if too many people request questions at the same time, it throttles responses. Sometimes it returns an unexpected format. These are not bugs in your app — they're the reality of relying on an external service."

> "The question is not whether your API will fail. The question is what your app does when it does. What we just built is called graceful degradation: instead of showing a broken screen, the app shows a clear, honest message that tells the player exactly what happened and gives them a way to try again."

> "When you build your own app and connect it to an external API, always ask: what does this look like if the API is unreachable? Build the answer before you need it."

---

### Teaching Moment C — After Prompt 2.1

**After:** Prompt 2.1 (High Score Persistence)
**Concept:** Storing game state with localStorage between sessions

**When to trigger:** After you've demonstrated the high score surviving a tab close and reopen.

**Say:**
> "What we just used is called localStorage — the browser's built-in key-value store. It keeps data between sessions without any server, any database, or any account. The data lives on this device, in this browser."

> "It has limits: it can only store text, it has a size cap of about 5 megabytes, and it's tied to one browser on one device. But for a single-player game like this? It's exactly the right tool. No backend, no signup, no cost — just the browser remembering things for you."

> "This is why I described it as 'the browser's built-in storage' in the prompt instead of saying 'localStorage.' You don't need to know the name of the tool to use it. You describe the behavior you want — data that survives closing the tab — and the AI picks the right implementation."

---

### Teaching Moment D — After Prompt 2.5

**After:** Prompt 2.5 (Wrong Answer Explanation)
**Concept:** API failure modes / graceful degradation — missing data fields

**When to trigger:** After demonstrating that no explanation appears (and explaining why that is correct).

**Say:**
> "This is one of the most important lessons when working with any external API: the data you expect to be there is not always there. API documentation describes what fields might be in a response. It doesn't always guarantee they'll be present for every item."

> "What we did here was build defensively. We coded the feature, but we told the AI: if the data isn't there, show nothing — don't show an error, don't show a blank box, just show nothing. The user experience degrades gracefully instead of breaking."

> "When you connect your own app to an external API, always ask: what if this field is missing? What if this value is null? Building the answer into your prompt from the start — before you even see the API response — is what separates a fragile app from a resilient one."

---

## 5. Common On-Camera Mistakes

---

**What happened:** The API was down when filming started, so the error screen fired immediately after every "Start Game" click.
**What it looks like:** Instructor clicks "Start Game," error screen appears, no questions ever load. Multiple takes fail the same way.
**How to handle it:** Stay calm. Say: "You know what — the Open Trivia Database seems to be having a moment right now. This is actually a perfect demonstration of exactly what Prompt 1.3 fixed. Our error screen is doing its job. Let me check the service status and we'll continue once it's back up." Check `https://opentdb.com` in a browser tab. If it's a temporary blip, wait 30 seconds and try again. If it's a longer outage, use `v1/index.html` or `v2/index.html` as your visual reference while narrating what the live build would show.

---

**What happened:** localStorage from a previous filming session polluted the "fresh start" demo, so the "All-Time Best" banner showed a number instead of "—" when demonstrating Prompt 2.1 for the first time.
**What it looks like:** Instructor opens the app to show "no saved data" but the banner already shows "7 / 10" from a prior take.
**How to handle it:** Before the take, always clear localStorage via DevTools (Application → Local Storage → right-click the origin → Clear). If it happens on camera: "Before I show you the clean first-time experience, let me clear the saved data — because I've been testing this app, there's already a score in there. In your case, starting fresh, you'll see a dash here." Open DevTools, clear the entry, reload. This also models the DevTools workflow as a bonus.

---

**What happened:** The instructor typed a prompt that was slightly different from the one in prompts-learner.md, and the AI built a different feature — for example, adding a leaderboard with player names when the prompt didn't explicitly exclude them.
**What it looks like:** The app has a "Enter your name" text field that should not exist.
**How to handle it:** Do not stop the take. Say: "Interesting — the AI added a player name field here, which is a natural instinct for a leaderboard. But remember our scope rule from the PRD: no user accounts, no names, just scores. Let me give it a more specific instruction." Follow up with the exact prompt from prompts-learner.md, including the "Do not show player names" line.

---

**What happened:** The timer bug from Prompt 2.2 (timer not stopping on answer click) was not reproducible during filming because the AI happened to write the code correctly the first time.
**What it looks like:** The instructor says "watch the timer keep running after I click" — and it stops correctly, making the bug narration confusing.
**How to handle it:** Stay calm. Say: "Actually — the AI wrote this correctly on the first try. The timer stops immediately on click. That's great news for us. We're still going to send Prompt 2.4, because this is a bug that commonly appears in this type of feature and it's worth knowing how to debug it. Think of it as a preventive check." Send Prompt 2.4 anyway and let the agent confirm everything is clean.

---

**What happened:** The instructor ran out of narration during a long generation wait (60+ seconds) and went silent on camera.
**What it looks like:** Instructor stares at the screen, progress spinner turning, no narration for 20–30 seconds. Dead air.
**How to handle it:** Prepare two or three "wait lines" before filming. Suggestions: "The AI is generating the entire app right now — HTML, CSS, the API connection, all of it. I'll give it a moment." / "This is the largest prompt in our build, so it takes a little longer to process." / "While it's working, think about how long it would take you to write this from scratch, versus describing it in plain English."

---

**What happened:** The answer feedback colors (green/red) appeared too subtly on camera and were not visible to learners watching a compressed screen recording.
**What it looks like:** Instructor says "see how it turns green" but the color is barely visible at stream quality.
**How to handle it:** After applying Prompt 1.2, if the colors look faint on your recording preview, zoom the browser to 125% or 150% to make the buttons larger and more visible. The card is responsive enough to handle this. Alternatively, narrate: "On your screen this will be very clear — a bright green highlight on the correct answer."

---

## 6. Learner Handoff Script

> "You just watched the complete build of the Trivia Game App — from a blank session all the way to a finished game that fetches live questions from the Open Trivia Database, tracks your score with a countdown timer, and remembers your best score across browser sessions using localStorage."

> "Now it's your turn."

> "In the next section, you'll find the exact same prompt sequence I just used — all eleven prompts, ready for you to copy and paste into your own Claude Code or Lovable session. Build the Trivia Game App yourself, exactly as I did. As you go, pay attention to two things specifically: the moment in Prompt 1.1 when the app makes its first live call to opentdb.com, and the moment in Prompt 2.1 when you close the browser tab and your score is still there when you reopen it. Those two moments are the core concepts of Module 3 — consuming a free external API and persisting state with localStorage — made visible and interactive."

> "When you've built the full app through Prompt 2.6 and all six acceptance criteria are passing, you're ready for the Module 3 assessment. In the assessment, you'll apply these same skills to build a Weather Dashboard that fetches current conditions from the Open-Meteo API and saves the user's last searched city using localStorage. You've already done everything the assessment requires — you just did it with trivia questions instead of weather data."

> "Start with Prompt 1.1. Take your time. And remember: describe what you want the player to experience, not how you think the code should work."
