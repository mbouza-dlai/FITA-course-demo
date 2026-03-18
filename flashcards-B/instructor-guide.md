# Instructor Guide — Flashcards

## 1. Episode Brief

- **App name:** Flashcards
- **Module:** 1 (throughline app — also used in Modules 2 and 3)
- **Videos covered:** M1V1–M1V5, M2V1–M2V3, M3V1–M3V4
- **Tool:** Claude Code or Lovable (single HTML file, no framework)

**Summary for learners:** In this demo you will watch an instructor build a complete flashcard study app from scratch — starting with nothing but a product requirements document and ending with an app that creates cards manually, remembers them across browser sessions, exports and imports decks as files, and generates new cards automatically using an AI API. Each phase of the build is a self-contained module, and you will build your own version after watching.

**The ONE thing the learner must walk away understanding:** You never build an entire app in one giant prompt. You scope a lean MVP, verify it works, then extend it one phase at a time — and that disciplined, incremental approach is what keeps both you and the coding agent from getting lost.

---

## 2. Pre-filming Checklist

### Machine and browser state

- [ ] **Zoom to 125–150%** in the browser before hitting record. Small default fonts are unreadable on video.
- [ ] **Font size in Claude Code or Lovable:** Set editor font to at least 16px. Viewers on small screens need this.
- [ ] **Screen resolution:** 1920×1080 or 1280×800. Avoid 4K — it shrinks UI elements to unreadable sizes after compression.
- [ ] **Close all notifications.** Turn on Do Not Disturb. A Slack ping mid-take is a common recording killer.
- [ ] **Clear browser history and autofill** so no personal data surfaces in text fields during the demo.
- [ ] **One browser window, one tab.** Close everything else. The viewer's eye follows tab bars and bookmarks.
- [ ] **Open a plain text editor** (Notepad, TextEdit) on your second monitor or in a split view — you will paste prompt text from there. Do not type live from memory.

### Files and versions to have ready

- [ ] **Open `v3/index.html`** in Chrome or Firefox before filming starts — this is the finished app. Show it briefly at the top of each module to tell the learner where they are headed.
- [ ] **Open `v1/index.html`** in a second tab — have this ready to confirm the Phase 1 checkpoint live.
- [ ] **Have `v2/index.html`** in a third tab for Phase 2 confirmation.
- [ ] **Copy all prompts from `prompts-learner.md`** into your plain text editor, one prompt per section, before filming. You will paste them verbatim.

### API keys and external services (Phase 3 only)

- [ ] **Obtain an OpenAI API key** at `platform.openai.com/api-keys` before filming. It must begin with `sk-`.
- [ ] **Load the key into the app in advance** — open `v3/index.html`, paste the key into the API key setup box, click "Save Key," and verify the purple setup box disappears. This confirms the key works before the camera rolls.
- [ ] **Have a fallback API key ready.** If the primary key fails on camera, you need a second one you can paste immediately without breaking the take.
- [ ] **Budget awareness:** The demo uses `gpt-4o-mini`. Each "Generate Cards" click at 5 cards costs a fraction of a cent. But have a rough cap in mind — do not run 20 test generations before filming.
- [ ] **No Supabase setup needed.** This app uses localStorage and JSON files only. No database credentials required.
- [ ] **No deployment step required for filming.** The app runs directly from a local file. Opening `index.html` in a browser is sufficient.

### Pre-filming smoke tests (do these 30 minutes before recording)

- [ ] Open `v1/index.html`. Add a card. Flip it. Navigate. Delete. Confirm empty state appears.
- [ ] Open `v2/index.html`. Add a card, refresh the page, confirm the card survives. Export a deck. Import it back. Confirm the green success banner appears.
- [ ] Open `v3/index.html`. Enter the API key. Type topic "the solar system", quantity 3. Click "Generate Cards." Confirm 3 cards appear and the success banner says 'Added 3 cards about "the solar system"'.
- [ ] **If any smoke test fails, do not start filming.** Debug using the recovery steps in Section 5.

---

## 3. Prompt-by-Prompt Narration Guide

---

### Prompt 1.1 — Initial Build

**Say:**
"Before I type a single prompt, I want to show you something important. Here is the vague version a lot of beginners start with: 'Make me a flashcard app.' That is it. Watch what happens when we use that — the AI produces something, but it's missing navigation, or it adds a login screen we didn't ask for, or the counter is missing entirely. We then spend five prompts fixing things we never wanted. Instead, I spent ten minutes writing a mini product requirements document — a PRD — and I turned that into this prompt. Let me paste it in."

**Type:**
```
I want to build a flashcard study app. Here is what it needs to do:

- A user can type a question into a field called "Front" and an answer into a field called "Back", then click an "Add Card" button to save that card to the deck.
- The current card is displayed in the center of the screen. The user can click a "Flip" button (or click the card itself) to reveal the answer.
- Below the card, show a label like "Card 2 of 7" so the user always knows where they are in the deck.
- There are two navigation buttons — "Previous" and "Next" — to move through the deck one card at a time.
- There is a "Delete" button that removes the current card from the deck. After deleting, show the next available card, or a friendly message like "No cards yet — add one above!" if the deck is now empty.
- When the page first loads, show that same empty-state message since there are no cards yet.

The layout should be clean and centered on the page. The card itself should look like an actual card — a white rectangle with a subtle shadow. The add-card form should sit above the card display.

Do not connect to any outside services. Everything should work entirely in the browser with no internet connection needed.
```

**While waiting (expect 15–30 seconds):**
"This is a moderately long initial prompt, so the agent is going to take a moment. While it works, notice what our prompt did: we named every piece of behavior, we described what the empty state looks like, and we explicitly said 'no outside services.' That last line matters — without it, the agent sometimes tries to add a Firebase database or a login page, which is way more than we need right now."

**Highlight:**
- Point at the "Add a Card" panel at the top of the generated app. Say: "There's the form — Front and Back fields, exactly as specified."
- Click the "Add Card" button without filling in the fields. An alert dialog should appear. Say: "It even handles the validation case — we didn't ask for that explicitly, but a well-scoped prompt often gets these bonuses."
- Type a question into "Front (Question)" and an answer into "Back (Answer)". Click "Add Card". Point at the card counter. Say: "Card 1 of 1 — the counter is live."
- Click anywhere on the card rectangle itself. Say: "We can flip by clicking the card directly, or by using the Flip Card button."
- Point at the Previous and Next buttons, then the Delete button. Say: "All the navigation is here. Let's add one more card to see the counter update." Add a second card, point at "Card 2 of 2".

**If it breaks:**
"Interesting — it looks like the agent interpreted part of our prompt differently than we expected. Let me look at what we got and identify exactly which piece is missing. The key technique here is: don't re-send the whole prompt. Send a small, targeted correction."

If a feature is missing, say: "Let's fix just this one thing. I'll type: 'The app didn't include [describe the missing feature]. Please add it without changing anything else that is already working.'"

---

### Prompt 1.2 — Card Flip Feel

**Say:**
"The core functionality is working. Now I want to improve one specific thing: the flip. Right now, if you click the card, the text just switches instantly — it looks like this." Click the card once to demo the instant swap. "That feels abrupt. A real flashcard turns over. Let me add that tactile quality with one focused prompt."

**Type:**
```
Right now the flip works, but it feels abrupt — the text just switches instantly. Can you make the flip feel more like a real card turning over? Add a smooth visual transition so the front slides away and the back comes into view, similar to how a physical flashcard would turn. Keep it quick — under half a second — so studying still feels fast.
```

**While waiting (expect 10–20 seconds):**
"Short prompt, fast response. This is a cosmetic change — the agent is just adding CSS animation. Notice how this prompt described the current broken behavior first, then described the goal, and added a constraint: under half a second. Those three elements — current state, desired state, constraint — make a refinement prompt precise."

**Highlight:**
- Click the card to trigger the flip. Say: "Watch the card. It rotates in 3D — front face rotates away, back face comes in. That's a real CSS perspective flip, not a fade or a text swap."
- Flip it back. Say: "Under half a second. Fast enough to keep a study session moving."
- Point at the slightly different background color on the back face. Say: "Notice the back face has a pale blue-white tint. The agent added this detail to make the flip feel tangible — we didn't ask for it, but it fits the spirit of 'like a real card.'"

**If it breaks:**
"The animation isn't visible yet. That sometimes happens when the CSS transition isn't quite wired up. Let me ask the agent to make it more dramatic first so I can confirm it's working at all, and then we'll dial in the speed."

Say to agent: "The transition isn't visible. Can you make the animation more dramatic so I can clearly see the card flip before we fine-tune the speed?"

---

### Prompt 1.3 — Empty Deck Edge Cases

**Say:**
"The app is looking good. Before I move on, I want to bullet-proof a few edge cases. These are the situations that feel fine during normal use but break in subtle ways once a real user gets hold of the app."

**Type:**
```
I want to make sure the app handles a few situations gracefully:

1. If I delete the last card in the deck, the card area should show the friendly empty-state message, and the "Card X of Y" counter should disappear or show something sensible like "0 cards."
2. If the deck has only one card and I click "Next" or "Previous," nothing should break — the single card should just stay in view.
3. After I add a new card, the deck should jump to showing that new card so I can see it was added successfully.
```

**While waiting (expect 10–20 seconds):**
"Short prompt, short wait. This prompt uses a numbered list — one scenario per item, each with an explicit expected outcome. This is the most reliable structure for edge case prompts. If you write 'make it handle edge cases,' the agent picks which edge cases to handle, and they may not match what you care about."

**Highlight:**
- Add one card. Then click "Delete". The dashed empty-state box with "No cards yet — add one above!" should reappear and the counter should vanish. Say: "There's case one — the empty state is back and the counter is gone."
- Add one card. Click "Next." Say: "With a single card, nothing happens. No error, no crash. That's case two."
- Click "Previous." Say: "Same — stable. Good."
- Add a second card. Point at the fact that the display jumps to the new card. Say: "And when I add a card, the view jumps right to it. Case three. I can immediately see the card I just created."

**If it breaks:**
"Let me test each of the three cases one by one to isolate which one isn't working. If I find the specific case that's broken, I'll send a targeted fix: 'When I delete the last card, the counter still shows Card 1 of 1 instead of disappearing. Can you fix just that?'"

---

### Prompt 1.4 — Debugging: Counter Is Wrong

**Say:**
"Now I'm going to show you something that will happen to you when you build your own apps: a bug. The counter has a subtle issue — after deleting a card, it doesn't always update the total right away. I'm going to show you the right way to report this to the coding agent."

**Type:**
```
I've noticed a bug: after I delete a card, the "Card X of Y" counter sometimes shows the wrong number — for example it still says "Card 3 of 5" after I've deleted a card so there are only 4 left. The total doesn't update right away. Can you find what's causing the counter not to refresh after a delete, and fix it so the number is always accurate immediately after any add or delete action?
```

**While waiting (expect 15–30 seconds):**
"Notice what I did not do: I did not guess at the cause. I did not say 'I think the delete function is broken, can you fix it?' I described what I observed — the counter says 3 of 5, it should say 3 of 4 — and I said when it happens: after a delete. That behavioral description is the agent's best debugging tool. It can trace from the symptom back to the root cause much better than it can chase a guess you've already made."

**Highlight:**
- After the fix is applied, add three cards. Navigate to card 2. Click "Delete." Point immediately at the counter. Say: "Card 2 of 2 — updated instantly. The counter reads from the live deck every time it renders, so there is no stale variable that can fall out of sync."
- Add a new card and point at the counter updating again. Say: "Same on add — always accurate."

**If it breaks:**
"The counter is still showing the wrong number. That tells me the bug is upstream of what the agent changed. Let me ask for a diagnostic tool rather than another fix attempt." Say to agent: "Can you add a way for me to see in the browser console what the counter value is right after I click Delete? I want to confirm whether the number is wrong before the display updates or after."

---

### Prompt 1.5 — Save This Version

**Say:**
"Everything is working. Add, flip, navigate, delete, edge cases handled, counter accurate. Before we move on to Phase 2, I want to do something that beginners skip — and pay for later. I'm going to create a checkpoint."

**Type:**
```
The core flashcard app is working well. I can add cards, flip them, navigate through the deck, and delete cards. Let's lock this in as a stable version before we start adding anything new. Please review the current state of the app, note what's working, and tell me this is a good checkpoint so I know we're on solid ground before moving forward.
```

**While waiting (expect 5–15 seconds):**
"This is a very short wait — no code changes are expected. The agent is doing a verbal review. What you get back is a plain-language feature checklist. If the agent describes something that does not match what you see on screen, that discrepancy is a bug surfacing before it gets buried under Phase 2 code."

**Highlight:**
- Read the agent's response aloud. Say: "It's confirmed all five MVP behaviors. That becomes our baseline. If anything breaks in Phase 2, we have a clean v1 to describe the regression against."
- Save or copy the code at this point. Say: "In a real project, this is where you'd commit to version control. In our course, we saved this as version 1 — and you can see it in the v1 folder in the course files."

**If it breaks:**
"This prompt cannot fail in a technical sense. But if the agent describes a behavior that you can't reproduce in the app, take that seriously. Say: 'You said the flip animation works, but when I click the card, the text just switches instantly. Can you look at why the animation isn't running?'"

---

### Prompt 2.1 — Remember Cards After a Refresh

**Say:**
"Now we're moving into Phase 2: persistence. I want you to feel the problem before we fix it." Add two or three cards live. Then refresh the page. Say: "They're gone. All of them. Refreshing the page wipes out every card we just made, because right now the app only keeps cards in the page's memory — and when the page closes, that memory disappears. Let me fix this."

**Type:**
```
Right now if I refresh the page or close the tab, all my cards disappear. I want the app to remember my deck automatically using the browser's built-in memory so that when I come back to the page, all my cards are still there exactly as I left them. I should not have to do anything extra — it should just work silently in the background every time I add or delete a card.
```

**While waiting (expect 15–25 seconds):**
"Medium length prompt, medium wait. The phrase 'silently in the background' is doing important work here. Without that, the agent often adds a Save button — which is a totally valid design choice, but not what we specified. When you want automatic behavior, say 'automatically' and say 'silently.' Explicit is always safer than implicit with a coding agent."

**Highlight:**
- Add three cards. Point at the counter: "Card 3 of 3."
- Refresh the page deliberately. Say: "Watch."
- After reload, point at the counter. Say: "Card 1 of 3. All three cards survived a full page refresh. The app is writing to localStorage — the browser's built-in storage — every single time we add or delete a card, then reading it back the moment the page opens."
- Close the tab. Reopen the file. Show the cards are still there. Say: "It even survives closing the tab entirely."

**If it breaks:**
"The cards are still disappearing after refresh. Let me check both halves of the persistence system — the save step and the load step can each fail independently." Say to agent: "I refreshed the page and the cards are still gone. Can you check whether the save step is actually running every time I add a card? Add a visible message that says 'Saved' for one second after each save so I can confirm it's working."

---

### Prompt 2.2 — Export the Deck to a File

**Say:**
"localStorage is great for single-device use. But what if I want to back up my deck? Or take it to a different computer? I can't copy localStorage between machines. That's where a file export comes in. I want to download my deck as a file I can keep, share, or load anywhere."

**Type:**
```
I want to be able to save a backup of my current deck as a file on my computer. Add a button labeled "Export Deck" that, when clicked, downloads a file containing all of my cards. The file should be readable as plain text if I open it in a text editor, and it should preserve both the front and back of every card.
```

**While waiting (expect 15–25 seconds):**
"The phrase 'readable as plain text if I open it in a text editor' is the key constraint here. It rules out binary files and tells the agent we want JSON — without us having to say the word JSON. The acceptance test is built right into the prompt: open the file in a text editor and read it. Any learner can run that test without any technical knowledge."

**Highlight:**
- Click the "Export Deck" button (gray, below the card area). A file download should trigger.
- Open the downloaded file in a plain text editor. Show the JSON contents. Point at the card data. Say: "Here are our cards — front and back — in a structured, readable format. This file can go anywhere. Email it, put it on a USB drive, copy it to another computer."
- Point at the filename in the download bar: it should be something like `flashcards-2026-03-16.json`. Say: "The agent even dated the filename automatically."

**If it breaks:**
"Clicking Export Deck isn't downloading anything. Let me isolate whether the download mechanism itself is broken." Say to agent: "Can you add a test button that just downloads a file with the word 'test' in it, so we can confirm the download mechanism itself is working before we connect it to the real card data?"

---

### Prompt 2.3 — Import a Deck from a File

**Say:**
"Now the other direction — loading a deck from a file. This completes the portability story: export on one machine, import on another."

**Type:**
```
I want to be able to load a deck I previously exported. Add a button labeled "Import Deck" that lets me choose a file from my computer. When I select a valid exported file, it should replace the current deck with the cards from that file and show the first card. If the file is not in the right format, show a clear error message rather than breaking silently.
```

**While waiting (expect 15–25 seconds):**
"Two things to notice in this prompt. First: 'replace the current deck' — not 'add to it.' If I don't say replace, the agent might append the imported cards to the existing deck, creating duplicates that are very confusing to debug. Second: 'show a clear error message rather than breaking silently.' Silent failures are the hardest bugs to catch. We pre-empt them by making failure visible."

**Highlight:**
- Delete all current cards from the deck. Show the empty state message.
- Click "Import Deck." Select the JSON file you exported moments ago.
- Point at the green success banner that appears: it should say "Imported N cards successfully."
- Point at the counter. Say: "The imported cards are back — same fronts, same backs."
- Now try importing a non-JSON file (a `.txt` file or any random file). Point at the red error banner. Say: "And when we give it something it can't read, we get a clear error instead of the app crashing or silently doing nothing."

**If it breaks:**
"When I select my exported file, nothing happens. Let me add some visibility into the read step." Say to agent: "Can you add a message that tells me whether the file was read successfully and how many cards were found in it, before it tries to load them?"

---

### Prompt 2.4 — Debugging: Cards Not Surviving a Refresh

**Say:**
"Now I'm going to show you a persistence debugging scenario. Imagine you added localStorage support, but when you refresh the page, the cards are still gone. Here is exactly how to report that to the coding agent."

**Type:**
```
I added the browser memory feature but it doesn't seem to be working right. I added three cards, refreshed the page, and they were all gone. Can you check whether the save step is actually running every time I add or delete a card, and also check whether the load step is running when the page first opens? Walk me through what you find and fix whichever step is broken.
```

**While waiting (expect 20–40 seconds):**
"This prompt asks the agent to check both halves of the persistence system — the save path and the load path. They can each fail independently. Saying 'walk me through what you find' is important: it asks the agent to reason out loud before fixing, which means you get an explanation rather than a silent code change you can't understand. That's a habit worth building."

**Highlight:**
- Read the agent's diagnostic response. Say: "The agent traced through both the save call and the load call. In our case both are working correctly — but in a real debugging session, one of those two would have been missing. That's what this prompt surfaces."
- Refresh the page to confirm cards still persist. Say: "Cards survived. The persistence system is confirmed healthy."

**If it breaks:**
"The agent's explanation didn't help me locate the problem. Let me ask for a visual diagnostic." Say to agent: "Can you add a temporary indicator on the page that shows me the raw contents of the browser's memory right now, so I can see whether the cards are actually being saved there even if they're not loading correctly?"

---

### Prompt 2.5 — Save This Version

**Say:**
"Phase 2 is complete. Cards persist across refreshes, we can export a backup, and we can import it back. Let's checkpoint."

**Type:**
```
The app now remembers cards between visits, and I can export and import decks. Everything is working correctly. Let's call this a checkpoint before we move on to adding any new features. Confirm that the current state is stable and that both the browser memory and the file import/export are working as expected.
```

**While waiting (expect 5–15 seconds):**
"Quick wait again — no code changes. This is a regression confirmation. By naming both features explicitly — browser memory and file import/export — we're running a verbal checklist. If the agent says one of these isn't working and we thought it was, we catch the bug now, before Phase 3 buries it."

**Highlight:**
- Read the agent's confirmation. Say: "Phase 2 baseline confirmed. This is saved as version 2 in the course files. If anything breaks in Phase 3, v2 is the known-good state we describe the regression against."

**If it breaks:**
"Use any discrepancy in the agent's response as a diagnostic. If it says something isn't working, ask for a targeted fix before moving on."

---

### Prompt 3.1 — Generate Cards from a Topic

**Say:**
"Now the thing that makes this app genuinely powerful: letting an AI generate flashcard content for you automatically. I want to be very clear about what's happening here — and I'll come back to this after the prompt lands. For now, let me paste it in."

**Type:**
```
I want to add a way for the app to automatically create flashcards on any topic I choose. Add a new section to the page with a text field where I can type a topic — for example, "the water cycle" or "Spanish vocabulary for food" — and a button labeled "Generate Cards." When I click it, the app should use an AI service to create 5 flashcard pairs on that topic and add them to my deck automatically. Each generated card should have a clear question on the front and a concise answer on the back.

To connect to the AI service, I will need to provide an API key. Please prompt me for where to put it and show me exactly what I need to fill in.
```

**While waiting (expect 30–60 seconds):**
"This is the most complex prompt we've sent, and it will take longer. The agent is adding a new UI panel, wiring up an HTTP request to the OpenAI API, handling the API key setup, parsing the response, and adding the resulting cards to the deck. That's five distinct steps in one prompt — and this is about as complex as a single well-scoped prompt should get. If you find yourself tempted to add a sixth thing, split it into a second prompt."

"While we wait — here's the distinction I want you to keep in mind. So far in this course, we've been using an LLM as the tool that builds the app. What we're adding now is different: an LLM as a feature inside the app. These are two separate things. The coding agent helped us write the code. The OpenAI API inside the finished app generates study content. You're building an AI-powered tool, not just using AI to build a tool."

**Highlight:**
- Point at the new "Generate Cards with AI" panel at the top — it should have a purple-tinted border, distinguishing it from the "Add a Card" panel. Say: "Notice the visual distinction — the agent gave the AI section its own color to make it clear it's a different kind of feature."
- Point at the API key setup box (purple background). Say: "This is where the API key goes. It has instructions telling you to get a key at platform.openai.com/api-keys."
- Paste your pre-tested API key into the password field. Click "Save Key." The purple setup box should disappear. Point at the green success notice. Say: "Key saved. The box disappears so it doesn't clutter the UI on repeat visits."
- Type "the water cycle" in the Topic field. Leave quantity at 5. Click "Generate Cards."
- While the spinner runs: "Watch the button — it shows a spinner and says 'Generating' while the API call is in flight. You cannot click it again during this time."
- After cards appear: point at the counter. Say: "Five cards added. The view jumped to the first new card automatically." Click through a few. Read the fronts and backs. Say: "These are real, accurate flashcards — generated in seconds."

**If it breaks:**
"The Generate Cards button doesn't seem to be doing anything. Before I assume the API connection is broken, let me add a simpler test." Say to agent: "Before connecting to the real AI service, can you make a test version of the Generate Cards button that just adds 2 fake cards with dummy text? I want to confirm the cards appear in the deck before we plug in the real AI."

---

### Prompt 3.2 — Limit How Many Cards Get Generated

**Say:**
"Anytime you connect your app to a paid API, you need to think about cost guardrails. The OpenAI API charges per token — meaning per piece of text generated. If this app had no limit, a user could theoretically request a thousand cards in one click and run up a large bill. Let's put a cap in place."

**Type:**
```
I am worried about accidentally running up costs if the AI generates too many cards at once. Please add a guardrail so the app never asks the AI to generate more than 10 cards in a single request, no matter what. Also, if I type a number into a quantity field, cap it at 10 and show a small note that says "Maximum 10 cards per generation." This way I stay in control of how much the AI does at once.
```

**While waiting (expect 10–20 seconds):**
"Short prompt, quick change. Notice the framing — 'worried about accidentally running up costs.' That's the honest reason this guardrail exists. Framing it this way means the learner understands the why, not just the what. Cost awareness is one of the most important habits to build early when working with paid APIs."

**Highlight:**
- Click into the "Cards (max 10)" number field. Type "15". Click elsewhere on the page.
- The field should snap back to "10." Point at the hint text below it: "Maximum 10 cards per generation." Say: "The UI catches the over-limit input and snaps it back."
- Change the value back to "7". Point at the hint text disappearing. Say: "The hint is contextual — it only shows when needed."
- Say: "And even if someone bypasses the UI and sends a request manually, the server-side code clamps the number to 10 before sending to OpenAI and also slices the response to 10 before adding to the deck. Two layers of enforcement."

**If it breaks:**
"I typed 15 and the field let me keep it. The cap isn't enforcing yet." Say to agent: "I typed 15 into the quantity field and it let me request 15 cards. The cap doesn't seem to be enforcing. Can you trace through what happens when I click Generate with a number above 10 and fix wherever the check is being skipped?"

---

### Prompt 3.3 — Debugging: Generated Cards Not Appearing

**Say:**
"Here's a debugging scenario specific to API integrations — and this one is tricky because the app appears to work. The Generate button spins, the loading state runs, it looks like something happened — and then nothing. The deck didn't change."

**Type:**
```
I clicked "Generate Cards" and the button seemed to do something — it spun or showed a loading state — but when it finished, no new cards appeared in my deck. The card count did not change. Can you check where the cards are supposed to be added after the AI responds and trace through whether that step is actually happening? Find where it is breaking down and fix it so the generated cards show up in the deck.
```

**While waiting (expect 20–40 seconds):**
"This is what the course calls a catastrophic-level bug — the app ran without crashing, but the core outcome silently failed. The spinner fired, which means the API call started. So the problem is almost certainly not in the API connection — it's in what the app does with the response. When you see a partial success followed by a silent failure, look downstream of where things appeared to work."

**Highlight:**
- Read the agent's trace. Say: "The agent traced from the API response, through the JSON parsing step, through the push to the deck array, through the render call. That's the correct diagnostic path."
- Generate cards again to confirm the fix. Show cards appearing. Say: "Now the full loop works: API responds, cards get parsed, cards get pushed into the deck, the deck saves to localStorage, and render updates the display."

**If it breaks:**
"The agent's fix didn't resolve it. Let me add a raw response viewer." Say to agent: "Can you add a temporary text box on the page that shows me the raw response from the AI before the app tries to turn it into cards? I want to see exactly what the AI sent back so we know whether the problem is in what it returned or in how the app is reading it."

---

### Prompt 3.4 — Save This Version

**Say:**
"All three phases are complete. Let's do a final checkpoint — and this one is worth doing out loud because it covers the entire arc of what we built."

**Type:**
```
The app now generates flashcards automatically from a topic, and the guardrails are in place to keep the number of AI calls reasonable. Everything across all three phases — creating cards manually, remembering them between sessions, exporting and importing, and generating cards with AI — is working. Let's mark this as the final complete version. Confirm the app is stable and give me a brief summary of everything it can do.
```

**While waiting (expect 5–15 seconds):**
"By naming all three phases in this prompt, we're asking the agent to run a full end-to-end regression in words. If it describes something inaccurately — if it says cards survive a refresh but you know they don't — you have one last chance to fix it before calling this done."

**Highlight:**
- Read the agent's summary aloud. Say: "Listen to this list — manual card creation, localStorage persistence, JSON export and import, AI card generation with a 10-card guardrail. Six months ago this would have taken a developer weeks to build. We did it across three phases, with prompts, no frameworks, no backend."
- Open the finished `v3/index.html`. Walk through one quick end-to-end demo: add a card manually, flip it, navigate, generate cards on a topic, export the deck. Say: "This is the complete Flashcards app — saved as version 3."

**If it breaks:**
"If the agent's summary omits a feature, take it seriously." Say to agent: "You didn't mention [the missing feature]. Is it still working? Can you test it and confirm before we wrap up?"

---

## 4. Key Teaching Moments

---

### Teaching Moment A — PRD Prompts vs. Vague Prompts

**After:** Prompt 1.1

**Concept:** Writing a structured PRD before prompting (Module 1, Videos 1–3)

**Say:**
"Notice that the prompt I just sent is basically a mini product requirements document. Every feature has a name, a behavior, and an expected outcome. Compare that to 'make me a flashcard app.' The vague version gives the agent maximum creative latitude — which sounds good until you realize you wanted a counter and it built a progress bar, or you wanted navigation buttons and it built swipe gestures that don't work on desktop. When you write a PRD first, even a short one, and turn it into a prompt, you get a first draft that needs refinement, not a guessing game that needs demolition."

---

### Teaching Moment B — One Feature Per Prompt

**After:** Prompt 1.2

**Concept:** Iterative building; phase-based development (Module 1, Video 2)

**Say:**
"We could have asked for the flip animation in the very first prompt. We didn't, and that was intentional. When you bundle changes together — 'add the flip animation AND make it mobile-friendly AND change the color scheme' — you lose the ability to isolate what broke. If something goes wrong, is it the animation? The mobile styles? The colors? You don't know. One feature per prompt means one thing to verify, and one thing to fix if it goes wrong. That discipline scales — it's the same pattern whether you're adding a button or wiring up a database."

---

### Teaching Moment C — Making the Problem Visceral (Persistence)

**After:** Prompt 2.1 is sent — before the result comes back

**Concept:** localStorage for single-device persistence (Module 2, Video 1)

**Say:**
"Before the fix lands, I want you to sit with that moment when the cards disappeared after a refresh. That's the problem we're solving. It's not an abstract software concept — it's three minutes of work that just vanished. localStorage is the browser's answer to that problem. It's storage that survives a page reload. It's tied to the specific browser on the specific device you're using — so if you switch computers, the cards don't follow you. That's why we add export and import next: because localStorage has limits, and understanding those limits is part of choosing the right persistence tool for any given situation."

---

### Teaching Moment D — Using an LLM Inside the App vs. Using an LLM to Build the App

**After:** Prompt 3.1 is typed but before clicking send

**Concept:** Integrating an LLM API to generate flashcard content (Module 3, Videos 1–2)

**Say:**
"I want to draw a distinction that trips a lot of people up. Everything we have done so far — typing prompts to Claude Code or Lovable, watching the code appear — that's using an LLM to build the app. What we're about to add is different: an LLM API call that runs inside the finished app, in response to a user clicking a button. The user types a topic. The app calls OpenAI. OpenAI returns flashcard content. The app adds those cards to the deck. That AI call is a feature inside the product — not the tool that built the product. These are two completely separate relationships with AI, and they have different implications for cost, security, and what you're responsible for as the builder."

---

## 5. Common On-Camera Mistakes

---

**What happened:** The learner's browser blocks the file download when Export Deck is clicked — nothing downloads.
**What it looks like:** The "Export Deck" button is clicked and nothing happens. No file appears in the downloads bar. No error banner.
**How to handle it:** Stay calm. Say: "Some browsers block downloads from files opened directly from the filesystem. Let me show you how to get around this." Open the file through a local server or simply note this on screen: "If you see this, try opening the file through VS Code's Live Server extension or a similar local server. The download works perfectly from a server context." Do not stop the take — this is a real learner scenario worth addressing.

---

**What happened:** The OpenAI API key entry fails — the "Save Key" button shows an error even though the key looks correct.
**What it looks like:** A red error banner says 'That does not look like a valid OpenAI API key (it should start with "sk-").' The purple setup box stays visible.
**How to handle it:** Say: "The app checks that the key starts with sk- as a basic sanity check. Let me make sure I'm pasting from the right place." Pause, go to platform.openai.com/api-keys in a second tab (pre-opened), copy a fresh key. Say: "Keys can also have leading or trailing spaces when you paste — I'll triple-check the paste is clean." Do not apologize or restart the take. This is normal operator behavior.

---

**What happened:** The API call to OpenAI times out or returns an error during the Generate Cards demo.
**What it looks like:** The "Generate Cards" button spins, then the spinner stops and a red error banner appears with an OpenAI error message or a network error.
**How to handle it:** Say: "Network calls can fail — this is actually a good thing to see, because notice what the app does: it shows a clear error message and re-enables the button. The deck is untouched. Let me try one more time." Retry once. If it fails again, say: "I'm going to skip the live API call and show you the result in the v3 file I prepared earlier." Switch to the pre-loaded v3 tab that already has generated cards. Never show frustration — treating errors as expected behavior is itself a lesson.

---

**What happened:** Rapid clicking through navigation or flip causes the card to get into a visual mid-animation state.
**What it looks like:** The card appears frozen halfway between front and back, or the counter shows a number that doesn't match the displayed card.
**How to handle it:** Say: "You'll notice if you click very fast, the animation doesn't always complete cleanly — this is a cosmetic quirk, not a functional bug. The card always lands on the correct face if you give it its half-second." Click the card once to complete the cycle. Counter should correct itself. Move on without dwelling.

---

**What happened:** The Import Deck file picker is dismissed without selecting a file, and the learner expects an error message.
**What it looks like:** The file picker opens, the learner clicks Cancel or presses Escape, and nothing happens. No error.
**How to handle it:** Say: "Closing the file picker without selecting anything is not an error — the app correctly treats it as a no-op. The deck is unchanged. This is the right behavior." This reinforces good error-handling design rather than treating it as a bug.

---

**What happened:** After Phase 2 is added, the learner notices cards from a previous demo session load on page open.
**What it looks like:** The page opens with cards already populated from a prior recording take. Counter shows "Card 3 of 3" before any cards have been added on camera.
**How to handle it:** Say: "There are already some cards in here from when I was testing earlier — that's localStorage working exactly as intended. Let me clear these out." Delete cards one by one or, if many: "I'll use the developer tools to clear localStorage quickly." Open DevTools, go to Application > Local Storage, delete the `flashcards_deck` key. Reload. Say: "Clean slate." This demonstrates localStorage is real and persistent, not mocked.

---

## 6. Learner Handoff Script

"You just watched the complete Flashcards app come together across three phases — from a zero-persistence MVP that forgets everything the moment you refresh, through localStorage persistence and file import/export, all the way to an app that can generate an entire study deck on any topic with a single button click.

Now it's your turn.

Your job is to build your own version of this app. You have the prompts — use them. Type them in verbatim the first time through, and pay attention to what each one does. Then, once you've completed all three phases and have a working app, I want you to do one thing differently from what I did: add a small customization of your own. Maybe it's a different color scheme. Maybe it's a card count that shows how many cards you've marked as 'known.' Maybe it's a different topic for the AI generation. The specific change doesn't matter — what matters is that you practice writing one additional prompt on top of a working codebase without breaking what already works.

The most important skill you're building is not 'how to make a flashcard app.' It's the discipline of incremental prompting — scoping an MVP, confirming a checkpoint, extending one phase at a time. Once you have that pattern in your hands, you can build almost anything.

Good luck. I'll see you in the next module."
