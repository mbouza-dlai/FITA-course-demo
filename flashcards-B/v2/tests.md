# Tests — Flashcards v2

## Setup

Open `v2/index.html` in any web browser by double-clicking the file in your file explorer. No internet connection or installation is required.

---

## Level 1: Cosmetic Checks

- [ ] The page heading "Flashcards" appears at the top, centered, in bold dark text.
- [ ] The "Add a Card" form is a white rounded panel with a soft drop shadow. The layout is unchanged from v1.
- [ ] The card flip animation is smooth — the card rotates in 3D and completes in under half a second. There is no instant text-swap.
- [ ] After a successful import or a failed import attempt, a colored banner appears below the Import/Export toolbar: green background with green text for success, red/pink background with red text for errors.
- [ ] The "Export Deck" and "Import Deck" buttons sit side-by-side below the card area and are visually equal in width. Both are styled as gray secondary buttons.
- [ ] The success/error notice banner disappears on its own after a few seconds without any user action needed.
- [ ] The empty-state dashed box message ("No cards yet — add one above!") is displayed on first load with no card, counter, or navigation buttons visible.

---

## Level 2: Functional Tests

### All v1 Core Features (Regression)

- [ ] Step: Add a card with "Front" text "What is H2O?" and "Back" text "Water," then click "Add Card" → Expected: The card appears, the counter reads "Card 1 of 1," and both input fields are cleared.
- [ ] Step: With one card displayed, click "Flip Card" → Expected: The card smoothly rotates to show the back face with the answer "Water."
- [ ] Step: Add two more cards so there are three total, then click "Next" → Expected: The counter advances and the next card's question is shown.
- [ ] Step: With three cards in the deck, click "Delete" on the current card → Expected: The card is removed and the counter immediately shows the updated total.
- [ ] Step: Delete all cards one by one → Expected: After the last deletion, the empty-state message reappears and all card-related controls disappear.

### Persistence (localStorage)

- [ ] Step: Add three cards (e.g., Front: "Q1", Back: "A1"; Front: "Q2", Back: "A2"; Front: "Q3", Back: "A3"), then refresh the page → Expected: All three cards are still present after the refresh. The counter reads "Card 1 of 3" (or whichever card was last viewed) and the deck is intact.
- [ ] Step: Add two cards, delete one, then refresh the page → Expected: Only the remaining card appears after refresh. The deleted card is gone permanently.
- [ ] Step: Add a card, close the browser tab completely, then reopen the `index.html` file → Expected: The card is still present. The deck survived a full browser close.
- [ ] Step: Add several cards, navigate to Card 3, then refresh the page → Expected: The cards are restored (the app may start from Card 1, which is acceptable). The card count is correct.

### Export Deck

- [ ] Step: With an empty deck (no cards added), click "Export Deck" → Expected: No file is downloaded. A red error banner appears saying "There are no cards to export. Add some cards first!"
- [ ] Step: Add two cards (Front: "Alpha", Back: "One"; Front: "Beta", Back: "Two"), then click "Export Deck" → Expected: A file download begins. The downloaded file is named something like `flashcards-2026-03-16.json` (today's date). No error banner appears.
- [ ] Step: Open the downloaded JSON file in a plain text editor (e.g., Notepad, TextEdit) → Expected: The file is readable text. It contains the words "Alpha," "One," "Beta," and "Two." It is formatted as JSON with clear structure (not a binary file or garbled text).
- [ ] Step: Verify the exported file contains both the front and back text for every card in the deck → Expected: Each card's question and answer are present in the file.

### Import Deck

- [ ] Step: Click "Import Deck" and select a file that was previously exported from this app → Expected: The current deck is replaced with the cards from the file. A green success banner appears saying "Imported N cards successfully." (where N is the number of cards in the file). The first imported card is displayed.
- [ ] Step: After a successful import, check the card counter → Expected: The counter reads "Card 1 of N" matching the number of cards in the imported file.
- [ ] Step: Click "Import Deck" and select a plain text file (e.g., a `.txt` file or any non-JSON file) → Expected: A red error banner appears explaining the file could not be read. The current deck is unchanged.
- [ ] Step: Create a plain text file with the `.json` extension containing just the text `hello world`, then try to import it → Expected: A red error banner appears saying the file does not appear to be valid JSON (or similar). The current deck is unchanged.
- [ ] Step: Export a deck, then immediately click "Import Deck" and re-import the same file → Expected: The import succeeds and the same cards are shown. The app handles re-importing the same file without issue.
- [ ] Step: Import a valid deck file when the current deck already has cards → Expected: The imported cards replace (not merge with) the existing deck. The old cards are no longer visible.

### Round-Trip (Export then Import)

- [ ] Step: Add three cards, click "Export Deck," then click "Delete" three times to empty the deck, then click "Import Deck" and select the file you just exported → Expected: All three original cards reappear exactly as they were. The counter reads "Card 1 of 3."

---

## Level 3: Edge Cases

- [ ] Step: Add cards, refresh the page multiple times in quick succession → Expected: The deck remains intact after each refresh. Cards are never duplicated or lost.
- [ ] Step: Click "Export Deck" multiple times in rapid succession → Expected: Multiple download prompts may appear (one per click), but no error occurs and each downloaded file contains the correct deck.
- [ ] Step: Click "Import Deck," select a file, then immediately click "Import Deck" again before the first import finishes → Expected: The second import dialog opens normally. No crash or error occurs.
- [ ] Step: Try to import a JSON file that has valid JSON but the wrong structure (e.g., a JSON array of numbers like `[1, 2, 3]`) → Expected: A red error banner appears explaining this does not look like a valid flashcard deck. The deck is unchanged.
- [ ] Step: Add a card with a very long question and answer, export the deck, then import it back → Expected: The long text survives the export/import round trip with no truncation or corruption.
- [ ] Step: Add cards, flip the current card to show its back, then refresh the page → Expected: After refresh, the card is restored and shown from its front face (the flipped state is not persisted — this is expected behavior).
- [ ] Step: With a single card in the deck, click "Next" and "Previous" repeatedly → Expected: The counter always shows "Card 1 of 1" and nothing breaks.
- [ ] Step: Click "Import Deck" and then close the file picker without selecting a file → Expected: Nothing happens. No error banner appears, and the deck is unchanged.
- [ ] Step: Add cards, then add a card with special characters (e.g., Front: `"quotes" & <tags>`, Back: `apostrophe's / slashes`), export the deck, clear all cards by deleting them, and re-import → Expected: The special characters appear exactly as typed after the import. No characters are missing or escaped incorrectly.

---

## Autonomous Addition Review

No autonomous additions detected in this version.
