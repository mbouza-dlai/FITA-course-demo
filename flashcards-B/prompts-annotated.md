# Flashcards App — Annotated Prompt Sequence (Instructor View)

---

## Phase 1 — MVP

### Prompt 1.1 — Initial Build

I want to build a flashcard study app. Here is what it needs to do:

- A user can type a question into a field called "Front" and an answer into a field called "Back", then click an "Add Card" button to save that card to the deck.
- The current card is displayed in the center of the screen. The user can click a "Flip" button (or click the card itself) to reveal the answer.
- Below the card, show a label like "Card 2 of 7" so the user always knows where they are in the deck.
- There are two navigation buttons — "Previous" and "Next" — to move through the deck one card at a time.
- There is a "Delete" button that removes the current card from the deck. After deleting, show the next available card, or a friendly message like "No cards yet — add one above!" if the deck is now empty.
- When the page first loads, show that same empty-state message since there are no cards yet.

The layout should be clean and centered on the page. The card itself should look like an actual card — a white rectangle with a subtle shadow. The add-card form should sit above the card display.

Do not connect to any outside services. Everything should work entirely in the browser with no internet connection needed.

> **Why this prompt works:** This is a mini-PRD prompt — it front-loads every required behavior, the empty-state, the layout intention, and an explicit "no external services" constraint, giving the coding agent everything it needs to produce a complete MVP in one pass without requiring immediate follow-up corrections.
> **Concept demonstrated:** PRD writing; scoping an MVP; phase-based building (Module 1, Videos 1–3)
> **Common learner mistake:** Typing "make me a flashcard app" with no further detail — the agent produces something that is either missing navigation, missing the counter, or includes features like accounts or scoring that are out of scope, requiring many correction rounds and wasting context.
> **If this fails:** Ask the agent: "The app didn't include [specific missing feature from the list]. Please add it without changing anything else that is already working."

---

### Prompt 1.2 — Card Flip Feel

Right now the flip works, but it feels abrupt — the text just switches instantly. Can you make the flip feel more like a real card turning over? Add a smooth visual transition so the front slides away and the back comes into view, similar to how a physical flashcard would turn. Keep it quick — under half a second — so studying still feels fast.

> **Why this prompt works:** This is a focused, single-behavior refinement prompt. It describes the current state ("text just switches instantly"), the desired state ("like a real card turning over"), and a constraint ("under half a second") — giving the agent precise success criteria without using any technical terms.
> **Concept demonstrated:** Iterative building; one feature per prompt (Module 1, Video 2)
> **Common learner mistake:** Bundling this with other visual changes in the same prompt — for example, "make the flip animated AND change the colors AND make it mobile-friendly." Multi-change prompts make it hard to isolate what broke if something goes wrong.
> **If this fails:** Ask: "The transition isn't visible. Can you make the animation more dramatic so I can clearly see the card flip before we fine-tune the speed?"

---

### Prompt 1.3 — Empty Deck Edge Cases

I want to make sure the app handles a few situations gracefully:

1. If I delete the last card in the deck, the card area should show the friendly empty-state message, and the "Card X of Y" counter should disappear or show something sensible like "0 cards."
2. If the deck has only one card and I click "Next" or "Previous," nothing should break — the single card should just stay in view.
3. After I add a new card, the deck should jump to showing that new card so I can see it was added successfully.

> **Why this prompt works:** Edge case prompts are most effective when they enumerate each scenario as a numbered list with a concrete expected outcome — this prevents the agent from handling only the first case and missing the others, and it gives the learner a clear testing checklist.
> **Concept demonstrated:** Iterative building; scoping and testing an MVP (Module 1, Videos 2–4)
> **Common learner mistake:** Writing "make it handle edge cases" with no further detail — the agent interprets this vaguely and may add error handling that is invisible to the user, or may tackle edge cases the learner did not actually care about.
> **If this fails:** Test each of the three cases individually. If one fails, file a targeted prompt: "When I delete the last card, the counter still shows 'Card 1 of 1' instead of disappearing. Can you fix just that?"

---

### Prompt 1.4 — Debugging: Counter Is Wrong

I've noticed a bug: after I delete a card, the "Card X of Y" counter sometimes shows the wrong number — for example it still says "Card 3 of 5" after I've deleted a card so there are only 4 left. The total doesn't update right away. Can you find what's causing the counter not to refresh after a delete, and fix it so the number is always accurate immediately after any add or delete action?

> **Why this prompt works:** This prompt models the correct debugging behavior taught in the course: describe what you observed (the counter said "3 of 5" when it should say "3 of 4"), describe when it happens (after a delete), and ask the agent to diagnose before fixing. Handing the agent a behavioral description — not a guess about the cause — keeps the learner out of the code while still giving the agent enough to work with.
> **Concept demonstrated:** Debugging at the functional level (Module 1, Video 5)
> **Common learner mistake:** Guessing at the cause: "I think the delete function isn't updating the array, can you fix the array?" — this leads the agent to fix a symptom the learner invented rather than diagnosing the actual root cause.
> **If this fails:** Ask: "Can you add a way for me to see in the browser console what the counter value is right after I click Delete? I want to confirm whether the number is wrong before the display updates or after."

---

### Prompt 1.5 — Save This Version

The core flashcard app is working well. I can add cards, flip them, navigate through the deck, and delete cards. Let's lock this in as a stable version before we start adding anything new. Please review the current state of the app, note what's working, and tell me this is a good checkpoint so I know we're on solid ground before moving forward.

> **Why this prompt works:** Versioning prompts create a deliberate pause in the building loop. By asking the agent to confirm what is working, the learner also gets a verbal regression test — if the agent describes something incorrectly, that surfaces a bug before new features obscure it. This models the "save before you extend" discipline from the course.
> **Concept demonstrated:** Saving work at stable checkpoints; versioning (Module 1, Video 4)
> **Common learner mistake:** Jumping straight from a working MVP into Phase 2 without acknowledging the checkpoint — if Phase 2 breaks something from Phase 1, the learner has no confirmed baseline to describe the regression to the agent.
> **If this fails:** This prompt cannot technically fail. If the agent describes behavior that does not match what the learner sees, use that discrepancy as a diagnostic: "You said X works, but when I try it, Y happens. Can you fix that before we move on?"

---

## Phase 2 — Persistence

### Prompt 2.1 — Remember Cards After a Refresh

Right now if I refresh the page or close the tab, all my cards disappear. I want the app to remember my deck automatically using the browser's built-in memory so that when I come back to the page, all my cards are still there exactly as I left them. I should not have to do anything extra — it should just work silently in the background every time I add or delete a card.

> **Why this prompt works:** The prompt opens by naming the painful behavior ("all my cards disappear") before stating the goal — this mirrors the instructor talking point about making the problem visceral before showing the fix. It also specifies that the saving should be invisible ("silently in the background"), which prevents the agent from adding an explicit Save button the learner did not ask for.
> **Concept demonstrated:** localStorage for single-device persistence (Module 2, Video 1)
> **Common learner mistake:** Asking to "save my data" without specifying that it should happen automatically — the agent often adds a manual Save button, which is a valid but different interpretation that confuses learners who expect the deck to persist without any extra steps.
> **If this fails:** Ask: "I refreshed the page and the cards are still gone. Can you check whether the save step is actually running every time I add a card? Add a visible message that says 'Saved' for one second after each save so I can confirm it's working."

---

### Prompt 2.2 — Export the Deck to a File

I want to be able to save a backup of my current deck as a file on my computer. Add a button labeled "Export Deck" that, when clicked, downloads a file containing all of my cards. The file should be readable as plain text if I open it in a text editor, and it should preserve both the front and back of every card.

> **Why this prompt works:** Describing the output format in terms the learner can verify themselves ("readable as plain text if I open it in a text editor") is a key technique — it gives the learner a concrete acceptance test they can run without any technical knowledge, and it steers the agent away from binary file formats.
> **Concept demonstrated:** JSON file persistence for portable data (Module 2, Video 2)
> **Common learner mistake:** Asking to "save the file somewhere" without specifying a download — the agent may attempt to save to a server or local filesystem path, neither of which works in a browser-only app.
> **If this fails:** Ask: "Clicking Export Deck isn't downloading anything. Can you add a test button that just downloads a file with the word 'test' in it, so we can confirm the download mechanism itself is working before we connect it to the real card data?"

---

### Prompt 2.3 — Import a Deck from a File

I want to be able to load a deck I previously exported. Add a button labeled "Import Deck" that lets me choose a file from my computer. When I select a valid exported file, it should replace the current deck with the cards from that file and show the first card. If the file is not in the right format, show a clear error message rather than breaking silently.

> **Why this prompt works:** Including the failure case ("if the file is not in the right format, show a clear error message") is a hallmark of a well-scoped prompt — it prevents silent failures that leave the learner confused about whether the import ran at all, and it models defensive thinking about user experience.
> **Concept demonstrated:** JSON file persistence; error handling (Module 2, Videos 2–3)
> **Common learner mistake:** Not specifying what should happen to the current deck when import runs — the agent may append imported cards to the existing deck rather than replacing it, leading to duplicates that are hard to debug.
> **If this fails:** Ask: "When I select my exported file, nothing happens and the deck doesn't change. Can you add a message that tells me whether the file was read successfully and how many cards were found in it, before it tries to load them?"

---

### Prompt 2.4 — Debugging: Cards Not Surviving a Refresh

I added the browser memory feature but it doesn't seem to be working right. I added three cards, refreshed the page, and they were all gone. Can you check whether the save step is actually running every time I add or delete a card, and also check whether the load step is running when the page first opens? Walk me through what you find and fix whichever step is broken.

> **Why this prompt works:** This prompt demonstrates the two-sided debugging approach for persistence bugs: the save path and the load path can each fail independently, and asking the agent to check both before fixing forces it to diagnose rather than guess. "Walk me through what you find" models the habit of treating the agent as a collaborator explaining its reasoning, not just a code dispenser.
> **Concept demonstrated:** Debugging at the functional level; localStorage persistence (Module 1, Video 5; Module 2, Video 1)
> **Common learner mistake:** Asking the agent to "fix the localStorage" without any context — the agent may rewrite the persistence logic entirely, breaking the import/export that was already working, because it had no information about which half of the system was actually broken.
> **If this fails:** Ask: "Can you add a temporary indicator on the page that shows me the raw contents of the browser's memory right now, so I can see whether the cards are actually being saved there even if they're not loading correctly?"

---

### Prompt 2.5 — Save This Version

The app now remembers cards between visits, and I can export and import decks. Everything is working correctly. Let's call this a checkpoint before we move on to adding any new features. Confirm that the current state is stable and that both the browser memory and the file import/export are working as expected.

> **Why this prompt works:** The checkpoint prompt at the end of each phase serves the same purpose as a regression anchor — naming each feature explicitly ("browser memory and the file import/export") gives the agent a verbal checklist to confirm against, which surfaces any silent failures before the complexity of Phase 3 is layered on top.
> **Concept demonstrated:** Saving work at stable checkpoints; versioning (Module 1, Video 4)
> **Common learner mistake:** Skipping the checkpoint and jumping into Phase 3 — when the LLM integration is added in Phase 3, any bugs it introduces are difficult to attribute correctly if there is no confirmed Phase 2 baseline.
> **If this fails:** This prompt cannot fail mechanically. Use the agent's response as a final Phase 2 regression test. If it confirms something that is not actually working, file a targeted fix before moving to Phase 3.

---

## Phase 3 — AI Card Generation

### Prompt 3.1 — Generate Cards from a Topic

I want to add a way for the app to automatically create flashcards on any topic I choose. Add a new section to the page with a text field where I can type a topic — for example, "the water cycle" or "Spanish vocabulary for food" — and a button labeled "Generate Cards." When I click it, the app should use an AI service to create 5 flashcard pairs on that topic and add them to my deck automatically. Each generated card should have a clear question on the front and a concise answer on the back.

To connect to the AI service, I will need to provide an API key. Please prompt me for where to put it and show me exactly what I need to fill in.

> **Why this prompt works:** The concrete examples ("the water cycle," "Spanish vocabulary for food") prevent the agent from treating the topic field as a free-form search box — they anchor the expected behavior. Asking the agent to "prompt me for where to put it" for the API key is a deliberate instructional move: it models the learner-as-operator relationship with paid APIs without the learner having to know what an API key is in advance.
> **Concept demonstrated:** Integrating an LLM API to generate flashcard content; API key security (Module 3, Videos 1–2)
> **Common learner mistake:** Not asking for API key guidance — the agent wires in a placeholder that the learner does not know how to replace, or worse, the agent uses a hardcoded fake key that fails silently.
> **If this fails:** Ask: "Before connecting to the real AI service, can you make a test version of the Generate Cards button that just adds 2 fake cards with dummy text? I want to confirm the cards appear in the deck before we plug in the real AI."

---

### Prompt 3.2 — Limit How Many Cards Get Generated

I am worried about accidentally running up costs if the AI generates too many cards at once. Please add a guardrail so the app never asks the AI to generate more than 10 cards in a single request, no matter what. Also, if I type a number into a quantity field, cap it at 10 and show a small note that says "Maximum 10 cards per generation." This way I stay in control of how much the AI does at once.

> **Why this prompt works:** Framing the guardrail as a cost concern ("worried about accidentally running up costs") gives the learner the correct mental model for why API guardrails exist, not just what they do. This is the exact framing the course uses in Module 3 to motivate safe API usage, so the prompt reinforces the lesson by voicing it in the learner's own words.
> **Concept demonstrated:** API cost guardrails; responsible LLM integration (Module 3, Video 3)
> **Common learner mistake:** Skipping guardrails entirely, or setting a very high limit like 100 — learners often underestimate how quickly API costs accumulate in a study session and do not realize the risk until they see a billing surprise.
> **If this fails:** Ask: "I typed 15 into the quantity field and it let me request 15 cards. The cap doesn't seem to be enforcing. Can you trace through what happens when I click Generate with a number above 10 and fix wherever the check is being skipped?"

---

### Prompt 3.3 — Debugging: Generated Cards Not Appearing

I clicked "Generate Cards" and the button seemed to do something — it spun or showed a loading state — but when it finished, no new cards appeared in my deck. The card count did not change. Can you check where the cards are supposed to be added after the AI responds and trace through whether that step is actually happening? Find where it is breaking down and fix it so the generated cards show up in the deck.

> **Why this prompt works:** This prompt demonstrates the "catastrophic debugging" pattern from the course — the app appeared to work (loading spinner fired) but the core outcome failed silently (no cards added). Describing both the visible partial success and the missing outcome gives the agent maximum signal to localize the failure between the AI response and the deck update step.
> **Concept demonstrated:** Debugging at the functional and catastrophic levels; LLM API integration (Module 1, Video 5; Module 3, Videos 1–2)
> **Common learner mistake:** Assuming the AI call failed and asking to "fix the API connection" — when the spinner appeared, the AI call likely succeeded; the real bug is in parsing or adding the response to the deck, and chasing the API layer wastes diagnostic effort.
> **If this fails:** Ask: "Can you add a temporary text box on the page that shows me the raw response from the AI before the app tries to turn it into cards? I want to see exactly what the AI sent back so we know whether the problem is in what it returned or in how the app is reading it."

---

### Prompt 3.4 — Save This Version

The app now generates flashcards automatically from a topic, and the guardrails are in place to keep the number of AI calls reasonable. Everything across all three phases — creating cards manually, remembering them between sessions, exporting and importing, and generating cards with AI — is working. Let's mark this as the final complete version. Confirm the app is stable and give me a brief summary of everything it can do.

> **Why this prompt works:** The final versioning prompt doubles as a course-completion narrative — asking the agent to summarize "everything it can do" produces a plain-language feature list that the learner can use as a personal portfolio summary. Naming all three phases explicitly in the prompt also runs a final end-to-end regression check before the learner considers the project done.
> **Concept demonstrated:** Saving work at stable checkpoints; incremental app development lifecycle (Module 1, Video 4; Module 3 conclusion)
> **Common learner mistake:** Ending the session without a final confirmation prompt — the learner may have a Phase 3 feature that broke a Phase 1 or Phase 2 behavior (e.g., generating cards broke the card counter) without realizing it, because they never did a full walkthrough after the last change.
> **If this fails:** This prompt cannot fail mechanically. If the agent's summary omits or mischaracterizes a feature, use that as a cue: "You didn't mention [feature]. Is it still working? Can you test it and confirm before we wrap up?"
