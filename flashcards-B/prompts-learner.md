# Flashcards App — Learner Prompt Sequence

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

---

### Prompt 1.2 — Card Flip Feel

Right now the flip works, but it feels abrupt — the text just switches instantly. Can you make the flip feel more like a real card turning over? Add a smooth visual transition so the front slides away and the back comes into view, similar to how a physical flashcard would turn. Keep it quick — under half a second — so studying still feels fast.

---

### Prompt 1.3 — Empty Deck Edge Cases

I want to make sure the app handles a few situations gracefully:

1. If I delete the last card in the deck, the card area should show the friendly empty-state message, and the "Card X of Y" counter should disappear or show something sensible like "0 cards."
2. If the deck has only one card and I click "Next" or "Previous," nothing should break — the single card should just stay in view.
3. After I add a new card, the deck should jump to showing that new card so I can see it was added successfully.

---

### Prompt 1.4 — Debugging: Counter Is Wrong

I've noticed a bug: after I delete a card, the "Card X of Y" counter sometimes shows the wrong number — for example it still says "Card 3 of 5" after I've deleted a card so there are only 4 left. The total doesn't update right away. Can you find what's causing the counter not to refresh after a delete, and fix it so the number is always accurate immediately after any add or delete action?

---

### Prompt 1.5 — Save This Version

The core flashcard app is working well. I can add cards, flip them, navigate through the deck, and delete cards. Let's lock this in as a stable version before we start adding anything new. Please review the current state of the app, note what's working, and tell me this is a good checkpoint so I know we're on solid ground before moving forward.

---

## Phase 2 — Persistence

### Prompt 2.1 — Remember Cards After a Refresh

Right now if I refresh the page or close the tab, all my cards disappear. I want the app to remember my deck automatically using the browser's built-in memory so that when I come back to the page, all my cards are still there exactly as I left them. I should not have to do anything extra — it should just work silently in the background every time I add or delete a card.

---

### Prompt 2.2 — Export the Deck to a File

I want to be able to save a backup of my current deck as a file on my computer. Add a button labeled "Export Deck" that, when clicked, downloads a file containing all of my cards. The file should be readable as plain text if I open it in a text editor, and it should preserve both the front and back of every card.

---

### Prompt 2.3 — Import a Deck from a File

I want to be able to load a deck I previously exported. Add a button labeled "Import Deck" that lets me choose a file from my computer. When I select a valid exported file, it should replace the current deck with the cards from that file and show the first card. If the file is not in the right format, show a clear error message rather than breaking silently.

---

### Prompt 2.4 — Debugging: Cards Not Surviving a Refresh

I added the browser memory feature but it doesn't seem to be working right. I added three cards, refreshed the page, and they were all gone. Can you check whether the save step is actually running every time I add or delete a card, and also check whether the load step is running when the page first opens? Walk me through what you find and fix whichever step is broken.

---

### Prompt 2.5 — Save This Version

The app now remembers cards between visits, and I can export and import decks. Everything is working correctly. Let's call this a checkpoint before we move on to adding any new features. Confirm that the current state is stable and that both the browser memory and the file import/export are working as expected.

---

## Phase 3 — AI Card Generation

### Prompt 3.1 — Generate Cards from a Topic

I want to add a way for the app to automatically create flashcards on any topic I choose. Add a new section to the page with a text field where I can type a topic — for example, "the water cycle" or "Spanish vocabulary for food" — and a button labeled "Generate Cards." When I click it, the app should use an AI service to create 5 flashcard pairs on that topic and add them to my deck automatically. Each generated card should have a clear question on the front and a concise answer on the back.

To connect to the AI service, I will need to provide an API key. Please prompt me for where to put it and show me exactly what I need to fill in.

---

### Prompt 3.2 — Limit How Many Cards Get Generated

I am worried about accidentally running up costs if the AI generates too many cards at once. Please add a guardrail so the app never asks the AI to generate more than 10 cards in a single request, no matter what. Also, if I type a number into a quantity field, cap it at 10 and show a small note that says "Maximum 10 cards per generation." This way I stay in control of how much the AI does at once.

---

### Prompt 3.3 — Debugging: Generated Cards Not Appearing

I clicked "Generate Cards" and the button seemed to do something — it spun or showed a loading state — but when it finished, no new cards appeared in my deck. The card count did not change. Can you check where the cards are supposed to be added after the AI responds and trace through whether that step is actually happening? Find where it is breaking down and fix it so the generated cards show up in the deck.

---

### Prompt 3.4 — Save This Version

The app now generates flashcards automatically from a topic, and the guardrails are in place to keep the number of AI calls reasonable. Everything across all three phases — creating cards manually, remembering them between sessions, exporting and importing, and generating cards with AI — is working. Let's mark this as the final complete version. Confirm the app is stable and give me a brief summary of everything it can do.
