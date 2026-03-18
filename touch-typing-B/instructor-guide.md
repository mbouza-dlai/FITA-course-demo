# Instructor Guide — Touch Typing Practice App

---

## 1. Episode Brief

- **App name:** Touch Typing Practice
- **Module:** 1
- **Videos covered:** 1, 2, 3, 4, 5
- **Phase 1 prompts:** 1.1 through 1.5 (MVP — one passage, character highlighting, results screen, reset bug fix, checkpoint)
- **Phase 2 prompts:** 2.1 through 2.5 (passage selection screen, live WPM counter, difficulty filter, confetti animation, WPM reset bug fix, final checkpoint)

**What the learner will watch, then do themselves:**

The learner watches you build a browser-based touch typing practice app from scratch — no accounts, no server, no saved data. In Phase 1, you start with a plain-English description of the app, use it as a prompt to generate a working MVP, fix a highlighting bug, pin down the results screen, debug a broken reset, and then save a stable checkpoint before adding anything new. In Phase 2, you reopen the project in a fresh chat, add a passage selection screen with a difficulty filter, a live WPM counter, and a confetti animation — then debug a WPM carry-over bug and checkpoint again. The learner then builds their own version of the same app using the same prompt sequence.

**The ONE thing the learner must walk away understanding:**

Scope your app before you prompt. Decide what belongs in Phase 1 and what gets cut — and be specific about why. Prompting a vague idea produces a vague app. A structured description of goal, input, output, layout, and constraints produces a working first draft.

---

## 2. Pre-filming Checklist

### Machine state
- [ ] Close all applications unrelated to the demo. No notifications, no badges, no Slack pings visible.
- [ ] Set screen resolution to 1920x1080 (or match your course standard). Record at that resolution — do not zoom the display OS-level during filming.
- [ ] Set browser zoom to 100% before opening any files. Do not zoom in at the OS level; zoom within the browser instead if the audience needs to see a detail.
- [ ] Set terminal or editor font size to at least 16pt so code is readable on screen.
- [ ] Turn off spell-check underlines in any text editor you use for prompting if they appear on camera.

### Browser setup
- [ ] Use Google Chrome or Firefox. Have it open to a blank new tab before hitting record.
- [ ] Open `apps/touch-typing/v2/index.html` in a separate tab — this is the finished app you will show at the very start of the episode (the "finished product preview"). Keep this tab ready but off-screen until the Episode Brief segment.
- [ ] Open `apps/touch-typing/v1/index.html` in a third tab — you will switch to this after Phase 1 is complete to show the checkpoint.
- [ ] Clear browser history / autofill so nothing unexpected autocompletes during the demo.
- [ ] Disable browser extensions that inject UI overlays (LastPass, Grammarly, dark-mode extensions, etc.).

### Claude Code or Lovable setup
- [ ] Have your coding tool (Claude Code or Lovable) open and signed in. Confirm you are not rate-limited before filming.
- [ ] Start a brand-new, empty chat session. Do not reuse a previous session — stale context will produce different results than what the learner will see.
- [ ] Verify the coding tool can generate and serve a single-file HTML app. Run a quick "hello world" prompt off-camera to confirm the environment is working.
- [ ] For Phase 2, you will open a **second, separate chat session** — do not continue the Phase 1 session. Have the saved v1 checkpoint file ready to paste or reference.

### Files to have ready
- [ ] `apps/touch-typing/v1/index.html` — Phase 1 checkpoint (finished MVP).
- [ ] `apps/touch-typing/v2/index.html` — Phase 2 checkpoint (finished enhanced app).
- [ ] `apps/touch-typing/prompts-learner.md` — the prompt sequence you will type verbatim on camera.
- [ ] A plain text scratchpad (Notepad, TextEdit, or similar) to paste prompts from before typing into the tool — this prevents live typos in long prompts.

### No API keys required
- This app makes no external API calls. No keys, no `.env` file, no external services. If the coding tool asks you to configure any external service, stop — something has gone wrong with the prompt.

### Final check before record
- [ ] Type the letter "T" on your keyboard. Confirm keystrokes are not being captured by any screen recorder hotkey or system shortcut.
- [ ] Do a 30-second screen recording test. Confirm audio levels, video resolution, and that the browser and coding tool are both visible in the frame as you expect.

---

## 3. Prompt-by-Prompt Narration Guide

---

### Phase 1

---

#### Prompt 1.1 — Initial Build

**Say:**
"Before I type a single prompt, I want to show you what the finished app looks like."

Switch to the v2 tab. Click the "Speed comes after accuracy" passage card. Type a few characters to show the green/red highlighting. Finish or abandon the passage, then come back.

"That's where we're headed. But notice — I'm not going to ask for all of that at once. The first version I build is going to be much simpler. One passage. No selection screen. Just the core typing experience."

"Here's the key move before any prompting: I'm going to describe the app in plain English, the same way you'd explain it to a friend. Goal, inputs, outputs, layout, and one explicit constraint — no saving anything. That description becomes my first prompt."

Switch to the coding tool with a blank new chat open.

"I'm going to paste this prompt now — I wrote it out in advance so there are no typos on camera."

**Type:**
```
I want to build a touch typing practice app that runs in the browser. Here is what it should do:

- Show a short paragraph of text on screen that the user is supposed to type out.
- As the user types, each character they get right should turn green, and each character they get wrong should turn red.
- When the user finishes typing the full passage, show a results screen with two numbers: how many words per minute they typed, and what percentage of characters they got right.
- Include a restart button on the results screen that clears everything and lets the user try again from the beginning.

For the layout, keep it simple: a clean white background, the passage displayed in large readable text in the center of the page, and nothing else on screen while the user is typing. The results screen should appear in place of the passage when they finish.

The app does not need to save anything. Every time the page loads, it starts fresh. There are no accounts, no scores saved, no settings. Just the passage, the typing, and the result.

Use this passage as the text to type: "The quick brown fox jumps over the lazy dog. Practice makes perfect, so keep your fingers on the home row and your eyes on the screen."

Build the full working version of this now.
```

**While waiting:** This is a large first prompt — expect 30–60 seconds of generation time. Keep talking.

"Notice a few things about how this prompt is structured. First, it describes what the user experiences — not what the code should do. Second, it gives the AI a real passage to use, so we don't end up with placeholder text. Third — and this is the most important line — 'The app does not need to save anything.' That single sentence cuts an enormous amount of complexity. No database, no browser storage, no session history. We're not building a leaderboard. We're building a typing experience. That constraint is not a limitation — it's a design decision."

**Highlight:** When the result appears, open the generated HTML in the browser. Point to:
- The large centered passage text in Georgia serif font.
- The first character with the blue blinking underline cursor.
- The hint text below that reads "Click anywhere and start typing."

Type the letter "T" and show the first character turning green. Type the wrong letter for the second character and show red.

"One prompt. One working draft. It's not perfect yet — we'll see that in a moment — but the core behavior is here."

**If it breaks:** "Interesting — looks like the AI interpreted that differently than we expected. Let me read through what it generated and see where it diverged from the description." Read the output aloud for 10 seconds. Then say: "I'm going to ask it to describe back what it understood the app should do, and we'll correct from there." Type: "Before we go further — can you describe in plain English what this app does, based on what you just built?"

---

#### Prompt 1.2 — Fix the Character Highlighting

**Say:**
"The app is running, but let me test the highlighting more carefully."

Type a few characters in the app — some right, some wrong. Show that it works, but demonstrate the specific gap: no visible cursor on the next character to type, and no enforcement preventing you from skipping ahead (if that's what you see). If the highlighting is already perfect, narrate this instead:

"The highlighting is working for correct and wrong characters. But there are two behaviors I want to lock in explicitly: a visual cursor showing me exactly where I am in the passage, and a rule that prevents me from jumping ahead. Let me add those now with a focused prompt."

"This is iteration. I'm not rewriting the app — I'm making one targeted change to one specific behavior. The prompt describes what I see versus what I want, using language anyone can understand."

**Type:**
```
Right now when I type, the highlighting is not working the way I expected. I want to make sure the behavior is exactly right:

- Each character in the passage should be styled the moment I press the matching key.
- If I press the right key, that character should immediately turn green.
- If I press the wrong key, that character should immediately turn red.
- The character I am about to type next should be visually distinct — give it a blinking cursor or an underline so I can always see where I am in the passage.
- I should not be able to skip ahead or type past where I currently am in the passage.

Please update the app so that the highlighting behaves exactly like this.
```

**While waiting:** This is a targeted change — expect 15–30 seconds.

"I described the broken behavior in terms of what I see on screen, not what I think the code is doing wrong. That's the pattern. Non-technical builders have an advantage here: we describe symptoms honestly, because we don't have a theory about what caused them. That description is usually more useful to the AI than a guess about which function has a bug."

**Highlight:** When the update appears, reload the app and:
- Point to the first character with the blinking blue underline cursor.
- Type a correct character and show the cursor moving to the next position.
- Try pressing the same key multiple times rapidly — show that the cursor only advances once per character.

"The cursor is blinking, it moves with each keystroke, and I can't skip ahead. This is exactly what the prompt asked for."

**If it breaks:** "Something changed that I didn't expect. Let me type two characters — one correct, one wrong — and describe what I see." Do that in the app. Then say: "The character I typed correctly shows [X] and I expected green. I'm going to feed that observation back to the AI." Type: "When I press the correct key, the character shows [describe what you see]. I expected it to turn green. Can you look at the highlighting logic and fix it?"

---

#### Prompt 1.3 — Results Screen

**Say:**
"The typing experience is working. Now let's pin down the results screen. When I finish the passage, what should I see?"

"I want two numbers — WPM and accuracy — and a Try Again button. But here's the part most people skip: the formula. WPM can be calculated several different ways. If I don't specify the formula, the AI will pick one — and I might end up with a number that seems wrong but is just calculated differently than I expected. So I'm going to write the formula out in plain math."

**Type:**
```
When I finish typing the last character of the passage, I want the results screen to appear. Please make sure it shows:

- My words per minute (WPM), calculated as the total number of characters I typed divided by 5, then divided by how many minutes it took me from my first keystroke to my last.
- My accuracy as a percentage: the number of characters I typed correctly divided by the total number of characters in the passage.
- A "Try Again" button that resets everything — clears the highlighting, resets the timer, and puts the cursor back at the beginning of the passage.

The results should replace the typing area on screen. Nothing else should appear — no decorations, no extra text, just the two numbers and the button.
```

**While waiting:** About 15–25 seconds for this targeted update.

"I'm specifying the output — what the screen shows and how the numbers are calculated — the same way the PRD document from earlier in this module specifies outputs. The prompt is doing the same job the PRD does: giving the AI enough detail to build exactly what I want."

**Highlight:** Type the full passage at a moderate pace. When the results screen appears:
- Point to the large WPM number on the left.
- Point to the large Accuracy percentage on the right.
- Point to the "Try Again" button centered below.

"That's it. Two numbers and a button. No decorations, no extra text, exactly as specified."

Click "Try Again" to show it resets. Then pause — the reset bug hasn't been fixed yet, so this is intentional setup for the next prompt.

**If it breaks:** "The results screen isn't appearing after I finish the passage. Let me describe exactly what I see." Finish the passage in the app and narrate what happens. Then type: "I typed the last character of the passage. The results screen did not appear. The typing area is still visible. Can you check what should trigger the results screen to show and fix it?"

---

#### Prompt 1.4 — Debugging: Something Is Broken

**Say:**
"Now let me show you something that happens in almost every real build: a bug."

Click "Try Again" after finishing the passage. Point out visible leftover green or red characters, or explain that the timer didn't fully reset.

"When I clicked Try Again, the passage appears to reset — but watch what happens when I type the full thing again and look at the WPM. The timer carried over from my first attempt, so the numbers are wrong."

"Here's the key debugging skill: I'm going to describe what I see, not what I think is wrong in the code. I have no idea if the bug is in the timer variable, the reset function, or somewhere else entirely. And that's fine — I don't need to know. The AI does."

**Type:**
```
When I click the "Try Again" button, the passage does not fully reset. Some characters still appear green or red from my previous attempt, and the timer does not seem to restart from zero. The app looks like it is starting over, but the results at the end still reflect the old timing.

Can you figure out what is going wrong and fix it? The restart should completely clear all character colors, reset the timer to zero, and put the cursor back at the very first character — as if the page had just loaded for the first time.
```

**While waiting:** 20–40 seconds. This is a diagnosis-plus-fix prompt — the AI needs to read the existing code and find the issue.

"Notice what I did not write. I didn't write 'fix the reset function.' I didn't write 'clear the timer variable.' I described the symptom — green and red characters persisting, old timing carrying over — and let the AI trace back to the cause. This is the debugging pattern for anyone who can't read the code themselves: describe what you observe, ask for a diagnosis, not a specific fix."

**Highlight:** After the fix appears, reload the app. Complete the passage quickly, note the WPM. Click "Try Again." Now type the passage very slowly, waiting 3–4 seconds between some keystrokes.

"Look at that second WPM. It's much lower than the first — which is exactly right, because I typed slowly. That tells us the timer reset correctly. The old timing is gone."

Point specifically to the passage text with all characters back to dark/uncolored after clicking Try Again.

"Every character is back to its original color. No green, no red. The cursor is at position one. It really is starting from scratch."

**If it breaks:** "The fix didn't fully work — I still see [describe what you see]. I'm going to give the AI more specific observations." Narrate what persists after clicking Try Again, then type: "After clicking Try Again, I can still see [specific observation]. The reset is not fully clearing. Can you look at what the reset function does and trace why [specific behavior] is still happening?"

---

#### Prompt 1.5 — Save This Version as a Checkpoint

**Say:**
"The app is working. Characters highlight correctly, the results screen shows WPM and accuracy with the right formula, and the restart button fully resets everything."

"Before I add a single new feature — before I even think about Phase 2 — I'm going to checkpoint this. This is a habit, not a ritual. The reason to checkpoint now is that Phase 2 changes might break Phase 1 behavior. If they do, I want to be able to come back to this exact working state. If I skip this step and Phase 2 breaks something, I'll have to rebuild from scratch."

**Type:**
```
The app is working the way I described. When I type, characters turn green or red. When I finish, I see my WPM and accuracy. The restart button fully resets everything.

Before I start adding new features, I want to save a clean copy of what we have right now. Please do whatever is needed to mark this as a stable version — I want to be able to come back to exactly this state if anything breaks in the next phase.
```

**While waiting:** This prompt may produce file-saving instructions or a download, depending on the tool — 5–15 seconds. The AI is not generating new code here, just helping you save what exists.

"In software teams, this is called a commit or a snapshot. The name doesn't matter. What matters is: before the next phase of work begins, there is a saved copy of a state that works. In your own projects, you might do this by duplicating the file and naming it 'v1', or by following whatever saving method your coding tool recommends."

**Highlight:** Show the saved v1 file (or open `v1/index.html` directly in the browser). Type a few characters to show it still works.

"This is the Phase 1 checkpoint. It runs, it works, and I'm not going to touch it again. Everything from here happens in a new chat."

**If it breaks:** "The AI gave me instructions I'm not sure about. That's fine — the simplest version of a checkpoint is duplicating the file manually." Open the file manager. Duplicate the `index.html` file and rename the copy `index-v1.html`. "There. That's the checkpoint. The method doesn't have to be sophisticated. It just has to exist before Phase 2 starts."

---

### Phase 2

**Before Prompt 2.1 — Transition narration:**

Open a brand-new, empty chat session in the coding tool. Do not continue the Phase 1 session.

"I'm opening a completely fresh chat. Not a new message in the same conversation — a brand-new session. This is intentional. By the end of Phase 1, that chat session had all of our back-and-forth about the reset bug, the highlighting refinements, and the checkpoint. That history can start confusing the AI when I ask for Phase 2 changes — it might try to re-apply old fixes or misread my new instructions as corrections to old ones. Starting fresh clears that context. This is called avoiding context rot, and it's one of the habits that separates deliberate builders from people who spend hours untangling AI misunderstandings."

---

#### Prompt 2.1 — Multiple Passages to Choose From

**Say:**
"The first Phase 2 feature is a passage selection screen. Right now the app always shows the same passage. I want users to be able to pick from four different ones before they start typing."

"I'm going to do two things in this prompt: describe the new screen, and give the AI the actual passage text to use. If I don't give it the text, it will invent passages — and I'll end up needing another prompt just to replace them."

**Type:**
```
Right now the app always shows the same passage. I want to add a way for the user to pick which passage they want to practice before they start typing.

Please add a simple selection screen that appears when the app loads (before any typing begins). It should offer at least four different passages to choose from. Show them as a list of buttons or cards, each one displaying the first few words of the passage as a preview.

When the user clicks one, it should take them straight to the typing screen with that passage loaded and ready to go.

Here are four passages to use:

1. "The quick brown fox jumps over the lazy dog. Practice makes perfect, so keep your fingers on the home row and your eyes on the screen."
2. "A good typist does not look at the keyboard. With enough repetition, your fingers learn where every key lives, and your brain stops thinking about the mechanics."
3. "Speed comes after accuracy. Focus first on pressing the right key every time. The pace will follow naturally as your muscle memory develops."
4. "Every expert was once a beginner. The only difference between a slow typist and a fast one is the number of hours spent with fingers on keys."
```

**While waiting:** This is a significant structural change — a new screen, new data, new navigation. Expect 40–70 seconds.

"I gave the AI exactly one new feature: a selection screen that appears before the typing screen. I did not ask for a difficulty filter, a live WPM counter, or a congratulations animation at the same time. Those are coming — but each one gets its own focused prompt. When you bundle multiple features into one prompt, you increase the chance of getting partial or broken results, and you make it much harder to figure out which change broke something."

**Highlight:** When the result appears, reload the app. Show the selection screen:
- Point to the "Touch Typing Practice" heading in serif font.
- Point to the passage cards with preview text and character count metadata.
- Click the second card ("A good typist...") and show the typing screen loading with that passage.

Type a character to confirm highlighting still works. Click "← Choose a different passage" and show that the selection screen reappears.

"The MVP behavior is intact. The typing and results screens work exactly as they did in Phase 1. The selection screen is a new layer on top."

**If it breaks:** "The selection screen appeared but clicking a card didn't load the right passage. Let me test which passage loads." Click each card and type the first character to check which passage is active. Then say: "Cards 2 and 3 are loading the same passage. I'm going to report that to the AI." Type: "When I click the second passage card, the typing screen shows the first passage text instead of the second. Can you check how the card click maps to the passage data and fix the mismatch?"

---

#### Prompt 2.2 — Live WPM Counter While Typing

**Say:**
"Next feature: a live WPM counter that updates while I'm actively typing. This is different from the final WPM on the results screen — that's a summary after the fact. This one shows me my current speed in real time."

"I need to tell the AI two things clearly: where to put it, and that it's separate from the final results WPM. If I don't specify that they're separate, the AI might replace the results WPM with the live counter — or vice versa."

**Type:**
```
While I am actively typing, I would like to see my current words-per-minute displayed on screen so I can watch it update in real time.

Please add a small counter somewhere on the typing screen — below the passage works fine — that shows my current WPM as I type. It should start updating after I press the first key and keep refreshing every second or so. It does not need to be a big prominent element. Something subtle and readable is fine.

This counter is separate from the final WPM shown on the results screen. Both should appear — the live one while typing, and the final one after I finish.
```

**While waiting:** 20–35 seconds. This is an additive feature with a timing mechanism.

"I gave the AI placement guidance — 'below the passage works fine' — but I didn't dictate exact coordinates or pixel values. For layout details like this, giving the AI a direction is enough. Exact values would require me to know the app's CSS, which I don't."

**Highlight:** Select a passage and start typing at a moderate pace. After about 5 seconds:
- Point below the passage text to the "Current speed: X WPM" line that appears.
- Keep typing for another 10 seconds and show the number updating.

Then finish the passage to reach the results screen. Point to the final WPM number.

"Two separate WPM values — one live while typing, one final after I finish. Both present, neither replacing the other."

**If it breaks:** "The live counter isn't appearing. Let me check whether the results WPM is still working." Finish the passage and show whether the results screen is intact. Then say: "The results WPM shows correctly, but the live counter below the passage doesn't appear during typing. I'm going to clarify." Type: "The live WPM counter isn't appearing below the passage while I type. The results screen WPM still shows correctly after I finish. Can you check what should trigger the live counter to start and display it correctly?"

---

#### Prompt 2.3 — Difficulty Selector

**Say:**
"Now I'm going to add a filter to the selection screen. Short, Medium, and Long — three buttons that filter which passage cards are shown. This is a purely cosmetic change to the selection screen. It doesn't touch the typing experience at all."

"I'm also going to ask the AI to assign difficulties to the existing passages and add new ones so every difficulty level has at least one option. That's a task I could do manually — count characters, sort them — but it's faster to delegate it here because the rules are simple: short, medium, long based on length."

**Type:**
```
On the passage selection screen, I want to add a way for users to filter passages by difficulty before they pick one.

Please add three options at the top of the selection screen: Short, Medium, and Long. When the user clicks one, only the passages that match that length should be shown.

For the four passages already in the app, please assign each one a difficulty level that makes sense based on its length. Add at least one more passage so that each difficulty level has at least one option.

The difficulty selector should just filter what is shown — it should not hide the selector or change any other behavior.
```

**While waiting:** 25–45 seconds. The AI is updating the data structure and adding UI.

"I said 'just filter what is shown.' That sentence prevents the AI from wiring difficulty into the scoring logic, the WPM calculation, or anything else. When you add a filter, you want it to filter — nothing else. Being explicit about scope prevents unintended side effects."

**Highlight:** When the result appears, reload the app. Show the selection screen:
- Point to the filter buttons (All, Short, Medium, Long) in a horizontal row.
- Click "Short" and show only the short passage card remaining visible.
- Click "Long" and show only the long passage card.
- Click "All" and show all cards return.
- Point to the difficulty badge on each card (the MEDIUM/SHORT/LONG label in small uppercase text).

"The filter works. The cards show their difficulty level. And the typing screen is completely unchanged — this feature lives only on the selection screen."

**If it breaks:** "The filter buttons appear but clicking them isn't hiding the cards. Let me test each one." Click Short, Medium, Long, All in sequence and narrate what changes. Then type: "When I click the Short filter button, all passage cards remain visible — the list doesn't filter. Can you check the filtering logic and fix it so clicking Short shows only short passages?"

---

#### Prompt 2.4 — Congratulations Animation

**Say:**
"Last feature of Phase 2: a celebration when I finish a passage. Something visual that plays once when the results screen appears."

"I'm going to give the AI creative latitude on what the animation looks like — confetti, a burst of shapes, anything celebratory. But I'm going to be specific about the behavioral rules: plays once, stops on its own, doesn't cover the results or block the Try Again button."

"This is actually a useful pattern. For cosmetic features, you can let the AI decide the aesthetic. But you still need to specify the behavioral constraints — otherwise you might get an animation that loops forever, or one that covers the WPM number you need to read."

**Type:**
```
When I finish typing a passage and the results screen appears, I want a small visual flourish to celebrate the completion.

Please add a simple animation that plays once when the results screen first appears. It could be confetti falling down the page, a burst of colored shapes, or any other brief celebratory effect that feels rewarding. It should only play once and then stop — it should not loop or interfere with reading the results or clicking the Try Again button.

Keep the results (WPM, accuracy, and button) visible and readable during and after the animation.
```

**While waiting:** This is the most complex generation in Phase 2 — the AI will write an animation system from scratch. Expect 45–75 seconds.

"This prompt has no implementation instructions. I'm not asking for CSS transitions or a canvas element or requestAnimationFrame. I described the behavior and the constraints. The AI picks the implementation. This is what prompting for product behavior looks like — you describe what the user experiences, not how the code achieves it."

**Highlight:** Select any passage and type it through to completion. When the results screen appears:
- Let the confetti animation play. Point to the colored pieces falling from the top of the screen.
- While confetti is still falling, click the "Try Again" button to demonstrate it's still clickable.
- Read the WPM and accuracy numbers aloud to show they're visible through the animation.

Complete the passage a second time to show the animation triggers again cleanly.

"Plays once, stops on its own, results are readable throughout. Exactly what the prompt asked for."

**If it breaks:** "The animation is looping — it's not stopping after the first play." Let it loop for 3 seconds so it's clear on camera, then say: "I'm going to add a constraint that it must stop." Type: "The confetti animation is looping continuously instead of playing once. Can you update it so it plays exactly once when the results screen appears and stops automatically after all the pieces have fallen?"

---

#### Prompt 2.5 — Debugging and Final Checkpoint

**Say:**
"Before I wrap up Phase 2, I noticed a bug while testing the live WPM counter. Let me show you what it looks like."

Select a passage. Type enough to build up a WPM count — show "Current speed: 45 WPM" or similar. Click "← Choose a different passage." Select a different passage.

"Look at the live WPM counter. Instead of being blank, it shows the number from my last session. That's the bug — the counter is carrying over between passages instead of resetting."

"Here's something important about when to report this bug: I'm going to report it in this same chat, not start a new one. The live WPM feature was built in this session. The AI still has full context on how it works. If I started a new chat to report this bug, I'd have to re-explain the whole counter system before asking for a fix."

**Type:**
```
I have noticed that when I switch between passages, the live WPM counter sometimes shows a number from my previous session instead of starting fresh. After picking a new passage, the counter should reset to zero and only start updating again once I press the first key.

Can you find what is causing the counter to carry over between passages and fix it?

Once that is working, please mark this as a stable version of the Phase 2 app — I want a clean checkpoint before I do anything else with this project.
```

**While waiting:** 20–40 seconds for the diagnosis and fix. The bug is in the reset logic when a new passage is selected.

"I combined two things in one prompt — the bug fix and the checkpoint request. These belong together because the right time to checkpoint is immediately after the bug is fixed. Not later, not in a separate session. Right now, while I know the app is in a clean working state."

**Highlight:** After the fix appears, test the passage-switching behavior:
- Select passage 1. Type for 5 seconds. Note the WPM shown (e.g., "Current speed: 38 WPM").
- Click "← Choose a different passage."
- Select passage 2.
- Point to the live WPM area below the passage — it should be completely blank.
- Type the first character. Show the counter begin updating from scratch after about 1 second.

"Blank on load. Updates only after the first keystroke. No carry-over. The bug is fixed."

Then open or reference the saved v2 checkpoint file.

"That's the Phase 2 checkpoint. Six passages, a difficulty filter, a live WPM counter, a confetti celebration, and a clean reset. This is the finished app."

**If it breaks:** "The fix didn't fully clear the carry-over. Let me trace what I see." Switch passages twice and narrate what the counter shows. Then type: "After selecting a new passage, the WPM counter still shows [specific value] instead of being blank. Can you check specifically what happens to the counter state when a new passage is selected and trace why it's not clearing?"

---

## 4. Key Teaching Moments

---

### Teaching Moment A

**After prompt:** 1.1

**Concept:** Scoping — translating a vague idea into a structured plan

**Say:**
"I want to pause here, because what I just typed was not a casual request. It was a structured plan. Look at how it was organized: what the user sees (a passage), what the user does (types), what happens in response (characters turn green or red), what appears at the end (two numbers and a button), what the layout looks like (centered, white, nothing extra), and — critically — what the app does not do. That last part is the scoping decision. 'The app does not need to save anything' cuts persistence, accounts, leaderboards, and session history all at once. That one sentence probably eliminated three weeks of complexity from a future version of this app that tried to do too much. The more specific your description before you prompt, the closer the first result will be to what you actually wanted."

---

### Teaching Moment B

**After prompt:** 1.4

**Concept:** Debugging — describing symptoms, not suspected causes

**Say:**
"What I just demonstrated is the most important debugging habit for non-technical builders. I did not write 'fix the resetApp function.' I did not write 'clear the startTime variable.' I described what I observed: green and red characters persisting after clicking Try Again, and results that reflected old timing. Those are symptoms — what the user sees — not a theory about what's broken in the code. When you describe symptoms, the AI reads the code and diagnoses the root cause. When you describe a suspected fix, the AI applies that fix whether or not it's correct — and often it isn't, because the guess was based on pattern-matching words, not understanding the code. Describe what you see. Let the AI find why."

---

### Teaching Moment C

**After prompt:** 1.5

**Concept:** Versioning — saving a stable checkpoint before a new phase

**Say:**
"The checkpoint prompt doesn't add any new features. It doesn't improve anything. All it does is preserve this working state. That might feel like wasted time. It isn't. Every time a Phase 2 change breaks something that worked in Phase 1, the builder who checkpointed can restore in seconds. The builder who skipped it has to rebuild from scratch — and often doesn't remember the exact prompts that produced the working version. Save before you change. That's the whole rule."

---

### Teaching Moment D

**After prompt:** 2.1 (before typing it, during the transition narration)

**Concept:** Avoiding context rot — starting fresh chats between phases

**Say:**
"I'm opening a new chat session, not continuing the Phase 1 conversation. This is a deliberate choice. By the end of Phase 1, that session had a full history of corrections, bug reports, and back-and-forth adjustments. When I add Phase 2 features in that same session, the AI has to hold all of that history in mind while interpreting my new instructions. Sometimes it misreads a Phase 2 prompt as a correction to a Phase 1 fix. Sometimes it re-applies a change I already asked it to undo. The longer a session runs, the more likely this is to happen. Starting fresh gives Phase 2 a clean slate — the AI reads my new prompt with no baggage from the debugging conversation we just had."

---

## 5. Common On-Camera Mistakes

---

**What happened:** The AI generates code that includes localStorage or a database call, which is explicitly out of scope for Module 1.

**What it looks like:** The app loads but includes a "High Scores" section or persists data between page refreshes in a way that was not requested.

**How to handle it:** Stay calm and say: "Interesting — the AI added a high-score feature I didn't ask for. This is actually a perfect example of scope creep. A leaderboard requires the browser to save data between sessions — that's called localStorage, and it's a concept we'll cover in Module 2. For now, we don't want it. Let me remove it." Type: "Please remove any localStorage calls or data persistence from this app. It should start completely fresh every time the page loads, with no data saved between sessions."

---

**What happened:** The AI generates multiple files (a JavaScript file, a CSS file, an HTML file) instead of a single self-contained HTML file.

**What it looks like:** The coding tool shows three separate files. When you open just the HTML file in the browser, styles or functionality are missing.

**How to handle it:** Say: "The AI split the app into multiple files, which is a valid approach for larger projects. For this demo, I want everything in one file so it's easy to open and share." Type: "Can you consolidate this into a single self-contained HTML file? All the CSS and JavaScript should be inside the HTML file itself — no separate .css or .js files."

---

**What happened:** The blinking cursor animation runs but doesn't blink — it just stays solid.

**What it looks like:** The current character position has a blue background but no animation. Depending on the browser, CSS animations on certain element types can be suppressed.

**How to handle it:** Say: "The cursor highlight is there, which is the important thing. The blinking animation isn't playing in this browser — that's a cosmetic issue, not a functional one. Let me quickly flag the distinction: this app tells me where I am in the passage, which is what matters. The blink is a nice-to-have. I'll note it and keep moving." If the learner needs it fixed for the demo: Type: "The cursor highlight appears as a solid blue background without any blinking animation. Can you check the CSS animation on the cursor class and make it blink at approximately one-second intervals?"

---

**What happened:** After finishing the passage, the results screen doesn't appear — the typing area just freezes.

**What it looks like:** The last character turns green or red, the cursor disappears, and nothing else happens. The page is stuck.

**How to handle it:** Say: "The typing area froze instead of showing results. This is a functional bug — something isn't triggering the results screen. Let me describe the symptom." Type: "I typed the final character of the passage. The character highlighted correctly, but the results screen did not appear. The typing area is now frozen. Can you check what should trigger the results screen to show when the final character is typed?"

---

**What happened:** During the confetti animation in Phase 2, the "Try Again" button doesn't respond to clicks.

**What it looks like:** The confetti is falling, you click "Try Again," and nothing happens. The results screen stays visible.

**How to handle it:** Say: "The confetti animation is covering the button and blocking clicks — that's a layering issue. This is exactly what the prompt was supposed to prevent with the 'does not interfere with clicking the button' constraint. Let me fix it." Type: "The confetti animation is blocking clicks on the Try Again button while it plays. The canvas should allow clicks to pass through to the elements below it. Can you add pointer-events: none to the canvas element so the animation doesn't intercept any mouse interactions?"

---

**What happened:** You accidentally type into the passage before the camera is ready, advancing the cursor past position 1 before the demo moment.

**What it looks like:** Some characters are already highlighted green or red when you pan the camera to the app.

**How to handle it:** Click "Try Again" (or refresh the page) without drawing attention to it. Say: "Let me reset to show this from the beginning." This is a completely natural recovery — do not apologize or explain.

---

## 6. Learner Handoff Script

"Now it's your turn."

"You're going to build this exact app yourself — the Touch Typing Practice app — using the prompt sequence in your course materials. The prompts are written out for you word for word. Your job is not to memorize them. Your job is to understand what each one is doing and why it's structured the way it is."

"As you work through Phase 1, pay attention to Prompt 1.1. That's the most important prompt in the sequence — it's where all the scoping happens. Notice what it includes: goal, input, output, layout, and one explicit constraint about what the app does not do. That structure is not specific to this app. It's the structure you'll use to plan every app you build in this course."

"When you get to the checkpoint prompt — Prompt 1.5 — don't skip it. I know it feels like a pause. It is a pause, and that's the point. Save before you change."

"And when you open a new chat for Phase 2, notice how different it feels to start fresh. The Phase 2 prompts read clearly because they don't have to compete with Phase 1 history. That's what starting a new context gives you."

"Your finished app should look and behave like what you saw in the demo: passage selection, character highlighting, a live WPM counter, difficulty filtering, a confetti animation, and a results screen with WPM and accuracy. But it will be built by you, from your prompts, in your session."

"Good luck. Start with Prompt 1.1."
