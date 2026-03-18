# Tests — Flashcards v3

## Setup

Open `v3/index.html` in any web browser by double-clicking the file in your file explorer. An internet connection and a valid OpenAI API key (beginning with `sk-`) are required only for the AI card generation tests. All other tests work without an internet connection.

---

## Level 1: Cosmetic Checks

- [ ] The page heading "Flashcards" appears at the top, centered, in bold dark text.
- [ ] The "Add a Card" panel and the "Generate Cards with AI" panel both appear as white rounded panels with drop shadows, stacked vertically above the card area.
- [ ] The "Generate Cards with AI" panel has a purple-tinted border (not the same gray border as "Add a Card"), making it visually distinct.
- [ ] The "Generate Cards with AI" heading text is purple, not gray.
- [ ] The API key setup box inside the AI panel has a light purple background (`faf5ff`) and a purple border, clearly separating it from the rest of the panel.
- [ ] The "Save Key" button is purple/accent-colored, not blue.
- [ ] The "Generate Cards" button is purple/accent-colored and spans the full width of the AI panel.
- [ ] The "Topic" input and "Cards (max 10)" number input sit side by side — Topic takes most of the width, the number field is narrower.
- [ ] When the quantity field is set above 10, a small hint line reading "Maximum 10 cards per generation." appears below the input and then disappears if the value is corrected back to 10 or below.
- [ ] While "Generate Cards" is processing, the button shows a spinning circle icon and the text "Generating…" and appears dimmed/disabled.
- [ ] After generation completes (success or failure), the "Generate Cards" button returns to its original purple state with the original label "Generate Cards."
- [ ] The card flip animation is smooth — a 3D rotation completing in under half a second.
- [ ] The success and error notice banners are visually distinct: success is green-tinted, error is red/pink-tinted.
- [ ] After an API key is saved successfully, the API key setup box (the purple background box with the password field) disappears, leaving only the topic and quantity fields.

---

## Level 2: Functional Tests

### All v1 and v2 Core Features (Regression)

- [ ] Step: Add a card with "Front" text "What is photosynthesis?" and "Back" text "The process plants use to convert sunlight to energy," then click "Add Card" → Expected: The card appears, the counter reads "Card 1 of 1," and both fields are cleared.
- [ ] Step: Click "Flip Card" → Expected: The card rotates with a smooth 3D animation to reveal the answer on the back.
- [ ] Step: Add a second card, navigate with "Next" and "Previous," then delete one card → Expected: Navigation and deletion work correctly and the counter updates immediately.
- [ ] Step: Refresh the page after adding cards → Expected: All cards survive the refresh (localStorage persistence working).
- [ ] Step: Add cards, click "Export Deck," and verify a file downloads → Expected: A `.json` file is saved to your computer.
- [ ] Step: Import the previously exported file using "Import Deck" → Expected: A green success banner appears and the deck is restored.

### API Key Setup

- [ ] Step: On first load (or with no saved API key), look at the "Generate Cards with AI" panel → Expected: The purple API key setup box is visible, showing instructions and a password field with placeholder "sk-…" and a "Save Key" button.
- [ ] Step: Type a key that does not start with "sk-" (e.g., "mykey123") into the API key field and click "Save Key" → Expected: A red error notice appears saying 'That does not look like a valid OpenAI API key (it should start with "sk-").' The setup box remains visible. No key is saved.
- [ ] Step: Type a valid-looking key starting with "sk-" (e.g., "sk-test123") into the API key field and click "Save Key" → Expected: A green success notice appears saying "API key saved. You can now generate cards!" The purple setup box disappears. The password field is cleared.
- [ ] Step: Refresh the page after saving an API key → Expected: The API key setup box remains hidden (the key was remembered). The topic and quantity fields are ready to use without re-entering the key.

### AI Card Generation (requires a real API key and internet connection)

- [ ] Step: With a valid API key saved, leave the "Topic" field empty and click "Generate Cards" → Expected: A red error notice appears saying "Please enter a topic before generating cards." No API call is made. The button does not show a spinner.
- [ ] Step: With a valid API key saved, type "the water cycle" in the "Topic" field and leave the quantity at 5, then click "Generate Cards" → Expected: The button shows a spinner and says "Generating…" while loading. After the API call completes, 5 new cards are added to the deck. A green success notice appears saying something like 'Added 5 cards about "the water cycle" to your deck.' The view jumps to the first of the newly added cards. The topic field is cleared.
- [ ] Step: After generating cards, check the card counter → Expected: The counter reflects the new total (e.g., if you had 2 cards before and generated 5, the counter reads "Card 3 of 7" since the view jumped to the first new card).
- [ ] Step: Generate a set of cards, then refresh the page → Expected: The generated cards persist after the refresh. They are saved to browser memory automatically.
- [ ] Step: With a valid API key saved, click "Generate Cards" and then immediately try to click it again while the spinner is showing → Expected: The button is disabled and cannot be clicked a second time during generation. Only one API call is made.
- [ ] Step: With no API key saved (cleared or first visit), click "Generate Cards" → Expected: A red error notice appears saying "Please enter and save your OpenAI API key first." The API key setup box reappears. No API call is made.

### Quantity Cap (the 10-card guardrail)

- [ ] Step: Click into the "Cards (max 10)" number field, clear it, and type "15," then click somewhere else on the page → Expected: The field value snaps back to "10" and the hint text "Maximum 10 cards per generation." appears below the field.
- [ ] Step: Change the quantity field back to "7" → Expected: The hint text "Maximum 10 cards per generation." disappears.
- [ ] Step: Type "0" or a negative number into the quantity field → Expected: The value snaps to "1" (the minimum). No error occurs.
- [ ] Step: With the quantity field set to 10 and a valid API key saved, type a topic and click "Generate Cards" → Expected: At most 10 cards are added to the deck, even if the AI attempts to return more.
- [ ] Step: Manually edit the quantity field to "11" just before clicking "Generate Cards" (without triggering the input event) → Expected: The app internally clamps the request to 10. No more than 10 cards are added.

---

## Level 3: Edge Cases

- [ ] Step: Add cards manually, generate cards with AI, then export the deck → Expected: Both the manually added cards and the AI-generated cards are present in the exported file.
- [ ] Step: Generate cards on topic "A," then immediately generate cards on topic "B" without refreshing → Expected: Cards from both topics are in the deck (AI generation appends, not replaces). The counter reflects the cumulative total.
- [ ] Step: With a valid API key, type a very long topic description (more than 200 characters) into the "Topic" field and click "Generate Cards" → Expected: The app sends the request and either returns cards or shows an error notice. The UI does not freeze or break.
- [ ] Step: Enter an intentionally nonsense topic (e.g., "xqzwjkl") and click "Generate Cards" → Expected: The AI either generates cards on a best-guess interpretation or returns a result the app handles. If the API returns an unexpected format, a clear red error notice appears. The app does not crash.
- [ ] Step: Save an API key, then try to generate cards while offline (turn off Wi-Fi or disconnect from the internet) → Expected: After a short wait, a red error notice appears indicating a network or connection error. The button is re-enabled after the failure. The existing deck is not changed.
- [ ] Step: Enter an intentionally invalid API key that starts with "sk-" (e.g., "sk-fakekey999") and click "Generate Cards" → Expected: After a short wait, a red error notice appears with an OpenAI API error message (such as "OpenAI error: Incorrect API key provided"). The deck is unchanged and the button re-enables.
- [ ] Step: Refresh the page immediately after clicking "Generate Cards" while it is still loading → Expected: The page reloads in its normal state. Any previously saved cards remain. The in-flight API call is cancelled without error.
- [ ] Step: With an existing deck of cards, generate a new batch of AI cards, then click "Previous" to navigate before the first newly generated card → Expected: Navigation moves back into the previously existing cards. No cards are lost.
- [ ] Step: Click "Import Deck" and select a file, then click "Generate Cards" while the import is still processing (if possible) → Expected: One operation completes without interfering with the other. No cards are lost or duplicated.
- [ ] Step: Add a card manually, export the deck, generate AI cards, then import the previously exported file → Expected: The import replaces the deck with only the manually added card. The AI-generated cards that were added after the export are no longer present (import replaces, not merges — this is expected behavior).

---

## Autonomous Addition Review

No autonomous additions detected in this version.
