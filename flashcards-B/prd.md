# Flashcards App — Product Requirements Document

## 1. Goal

The app lets a user create, review, and manage a personal deck of flashcards so they can study any topic by flipping through question-and-answer pairs.

## 2. User

This is a single-user app used on one device at a time. The user is studying solo and wants a simple, distraction-free way to drill themselves on a set of facts or concepts. No account or login is needed.

## 3. Inputs

- A front-of-card text entry (the question or prompt)
- A back-of-card text entry (the answer or explanation)
- Navigation controls (a button to go to the next card, a button to go to the previous card)
- A flip control (a button or click action to reveal the back of the current card)
- A delete control (a button to remove the current card from the deck)

## 4. Outputs

- The front text of the current card displayed on screen
- The back text revealed when the card is flipped
- A progress indicator showing the user's current position in the deck (e.g., "Card 3 of 10")
- Visual confirmation when a card has been added or deleted

## 5. Core Features (MVP)

1. Add a new flashcard by entering a question (front) and an answer (back), then submitting the form.
2. Display the current card's front face and allow the user to flip it to reveal the back.
3. Navigate forward and backward through the deck one card at a time.
4. Delete the current card from the deck.
5. Show the total number of cards in the deck and the user's current position (e.g., "Card 2 of 7").

## 6. Phase 2 Features

1. Save the deck to the browser's local storage (the browser's built-in memory) so cards survive a page refresh.
2. Export the current deck to a JSON file (a plain text file that stores data in a structured format) so it can be backed up or moved to another device.
3. Import a previously exported JSON file to restore a saved deck.

## 7. Out of Scope

- **No data is saved between sessions in this version.** Refreshing the page clears the deck. Persistence is added in Phase 2.
- **No external services or APIs are used.** The app works entirely in the browser with no internet connection required. API integrations are added in Phase 3.
- **No user accounts or login.** Creating accounts requires authentication infrastructure that is beyond what this course covers.
- **No sharing decks with other users.** Sharing requires user identity and a multi-user database, neither of which is included here.
- **No automatic syncing across multiple devices.** Real-time sync requires a backend server that is not part of this course.
- **No payment processing or premium deck purchases.** This is explicitly beyond the ceiling of what the course builds.
- **No spaced repetition algorithm** (the system used by apps like Anki that schedules cards based on how well you know them). That logic is too complex and would distract from the core concepts being taught.
- **No images or audio on cards.** Storing media files requires infrastructure (like a file hosting service) that is not covered in this course.
- **No leaderboard or competitive mode.** Leaderboards require user identity and a persistent score database.

## 8. Tech Notes

- **Persistence:** There is no persistence in this version. Cards exist only in the page's memory while it is open. Refreshing or closing the tab clears the deck. Persistence is introduced in Phase 2 using the browser's local storage and then a JSON file.
- **APIs:** No external APIs are used. All logic runs directly in the browser. API integrations are introduced in Phase 3.
- **How it works:** The app is built with plain HTML, CSS, and JavaScript — no frameworks or libraries. The deck is stored as a list in the page's memory (a JavaScript array) and the display updates every time the user adds, deletes, or navigates cards.
- **Deployment:** The app is a single HTML file (or small set of files) that can be opened in any browser or deployed to a static hosting service.

## 9. Testing Checklist

1. **Add a card.** Fill in a question and answer, then submit the form. The new card should appear as the current card in the deck and the card count should update.
2. **Flip a card.** With a card displayed, click the flip button or the card itself. The back (answer) text should appear in place of the front (question) text.
3. **Navigate the deck.** With at least two cards added, click the Next and Previous buttons. The displayed card and the position indicator (e.g., "Card 1 of 2") should update correctly with each click.
4. **Delete a card.** With at least one card in the deck, click the delete button. The card should be removed, the total count should decrease by one, and the next available card (or a "no cards" message) should be shown.
5. **Check the progress indicator.** Add three or more cards and navigate through them. The indicator should always show the correct current position and total (e.g., "Card 2 of 3").
