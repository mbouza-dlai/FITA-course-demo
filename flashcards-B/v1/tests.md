# Tests — Flashcards v1

## Setup

Open `v1/index.html` in any web browser by double-clicking the file in your file explorer. No internet connection or installation is required.

---

## Level 1: Cosmetic Checks

- [ ] The page heading "Flashcards" appears at the top, centered horizontally, in a bold, dark font.
- [ ] The "Add a Card" form is a white rounded panel with a soft drop shadow, sitting centered on a light blue-gray background.
- [ ] The "Front (Question)" and "Back (Answer)" labels appear above their respective text boxes in small, gray, uppercase letters.
- [ ] The "Add Card" button is blue and spans the full width of the form panel.
- [ ] On first load, a dashed-border placeholder box appears in the card area displaying the italic text "No cards yet — add one above!" — the card, counter, navigation buttons, and Flip/Delete buttons are all absent.
- [ ] After adding a card, the white card has a noticeable drop shadow and rounded corners, making it look like a physical card on the page.
- [ ] The card flip animation is smooth — the card visibly rotates in 3D (like a real card turning over) and completes in under half a second. There is no instant text-swap.
- [ ] The back face of the card has a slightly different background color (a pale blue-white) compared to the bright white front face, making the flip feel tangible.
- [ ] The small "FRONT" and "BACK" labels on each face appear in light gray uppercase letters above the card text.
- [ ] The counter label (e.g., "Card 1 of 3") is small and gray, not bold or prominent.
- [ ] The "Previous" and "Next" buttons are gray/secondary in style. The "Flip Card" button is blue. The "Delete" button is red.
- [ ] The "Delete" button is narrower than the "Flip Card" button — Flip takes up the remaining width.
- [ ] All content is horizontally centered and does not exceed a comfortable reading width (approximately 540px) on a standard desktop screen.

---

## Level 2: Functional Tests

### Adding Cards

- [ ] Step: Leave both the "Front (Question)" and "Back (Answer)" fields empty, then click "Add Card" → Expected: A browser alert dialog appears saying "Please fill in both the Front and Back fields before adding a card." No card is added.
- [ ] Step: Fill in the "Front" field with "What is the capital of France?" and leave "Back" empty, then click "Add Card" → Expected: The same alert appears. No card is added.
- [ ] Step: Leave "Front" empty, fill in "Back" with "Paris", then click "Add Card" → Expected: The same alert appears. No card is added.
- [ ] Step: Type "What is the capital of France?" into "Front (Question)" and "Paris" into "Back (Answer)", then click "Add Card" → Expected: The empty-state message disappears, the card appears showing "What is the capital of France?" on its front face, the counter reads "Card 1 of 1", and the "Previous," "Next," "Flip Card," and "Delete" buttons all appear. Both text fields are cleared.
- [ ] Step: Add a second card (e.g., Front: "What color is the sky?", Back: "Blue"), then click "Add Card" → Expected: The app immediately jumps to show the new card ("What color is the sky?"), the counter reads "Card 2 of 2", and both text fields are cleared.

### Flipping Cards

- [ ] Step: With at least one card in the deck, click the "Flip Card" button → Expected: The card rotates with a smooth 3D animation and the back face ("BACK" label and answer text) comes into view.
- [ ] Step: Click "Flip Card" again → Expected: The card rotates back and the front face ("FRONT" label and question text) comes into view.
- [ ] Step: With a card showing its front, click anywhere on the card itself (not the button) → Expected: The card flips to show the back, using the same smooth animation.
- [ ] Step: Click the card again → Expected: The card flips back to the front.

### Navigation

- [ ] Step: Add three cards (Card A, Card B, Card C). The view is on Card C (the last added). Click "Next" → Expected: The counter reads "Card 1 of 3" and Card A's question is displayed. The navigation wraps around to the beginning.
- [ ] Step: With three cards in the deck and viewing Card 1, click "Previous" → Expected: The counter reads "Card 3 of 3" and Card C's question is displayed. The navigation wraps around to the end.
- [ ] Step: With exactly one card in the deck, click "Next" → Expected: Nothing changes. The same card stays displayed with "Card 1 of 1." No error occurs.
- [ ] Step: With exactly one card in the deck, click "Previous" → Expected: Nothing changes. The same card stays displayed. No error occurs.
- [ ] Step: Flip a card to show its back, then click "Next" → Expected: The new card is displayed showing its front face (not the back face). The flip state resets on navigation.

### Counter Accuracy

- [ ] Step: Add three cards, navigate to Card 2, then click "Delete" → Expected: The counter immediately updates to "Card 2 of 2" (or "Card 3 of 3" becomes "Card 2 of 2") — the total reflects the current deck size right away with no stale number.
- [ ] Step: Add one card so the counter reads "Card 1 of 1," then click "Delete" → Expected: The card disappears, the counter disappears, and the empty-state message "No cards yet — add one above!" reappears.

### Deleting Cards

- [ ] Step: Add two cards (Card A, Card B). Navigate to Card A (first card). Click "Delete" → Expected: Card A is removed, Card B is now displayed, and the counter reads "Card 1 of 1."
- [ ] Step: Add one card, click "Delete" → Expected: The card, counter, navigation buttons, and Flip/Delete buttons all disappear. The dashed empty-state message reappears.
- [ ] Step: After deleting the only card, add a new card → Expected: The empty-state message disappears and the new card appears correctly.

---

## Level 3: Edge Cases

- [ ] Step: Type a very long question (more than 200 characters) into the "Front" field and a very long answer into "Back," then add the card → Expected: The card is added and the text is displayed inside the card, wrapping to multiple lines. The card layout does not break or overflow outside the card boundaries.
- [ ] Step: Type text containing special characters (e.g., `<b>Hello</b>` or `"quotes" & 'apostrophes'`) into both fields and add the card → Expected: The text appears as typed — no HTML is rendered, no characters are stripped.
- [ ] Step: Add a card, flip it to show the back, then delete it → Expected: The deletion works normally. No error occurs due to the card being in a flipped state.
- [ ] Step: Add five cards. Rapidly click "Next" five times in quick succession → Expected: The navigation cycles through the deck correctly. The counter stays accurate. No card is skipped or duplicated.
- [ ] Step: Rapidly click "Flip Card" multiple times → Expected: The card toggles between front and back each time. The animation may not fully complete before the next flip, but no error occurs and the card always ends on a face (not mid-animation stuck state).
- [ ] Step: Add a card with only spaces in the "Front" field (e.g., press the spacebar several times) and a real answer in "Back," then click "Add Card" → Expected: The alert appears ("Please fill in both the Front and Back fields") because whitespace-only input is treated as empty. No blank card is added.
- [ ] Step: Refresh the page after adding several cards → Expected: All cards are gone and the empty-state message appears. (Data is intentionally not saved in v1 — this is expected behavior and will be fixed in v2.)

---

## Autonomous Addition Review

No autonomous additions detected in this version.
