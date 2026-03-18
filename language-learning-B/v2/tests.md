# Tests — Vocab Builder v2

## Setup

Run the app with these three commands (do them once, in order):
```
npm install
cp .env.example .env
node server.js
```
Then open `http://localhost:3000` in your browser.

> Note: Before running, open `.env` in any text editor and replace `your-openai-api-key-here` with your actual OpenAI API key. All Phase 1 features carry over — this version adds a difficulty filter, a custom word lookup panel, and quiz mode.

---

## Level 1: Cosmetic Checks

- [ ] The controls panel now contains two rows: a top row with the "Language" label and dropdown, and a second row with the "Difficulty" label, difficulty dropdown, and the "Get New Words" button. The two rows should be clearly separated with consistent spacing.
- [ ] The difficulty dropdown defaults to "Beginner" when the page first loads (or after a hard refresh with cleared storage).
- [ ] A "Look Up a Word" section appears between the controls panel and the word cards area. It has a visible heading, a text input field, and a "Look Up" button side by side.
- [ ] The lookup section has a visually distinct background from the vocabulary cards area. The lookup result card (when visible) should appear on a blue-tinted background, clearly separated from the white vocabulary cards below.
- [ ] The "Quiz Mode" button appears in the progress bar row (to the right of the "X / 5 learned" progress pill), but only after words have been fetched. It should not appear on an empty page.
- [ ] In its default (inactive) state, the "Quiz Mode" button has a muted gray style. When quiz mode is active, the button turns amber/orange and its label changes to "Exit Quiz Mode."
- [ ] In quiz mode, each card shows a yellow-tinted "Reveal Translation" button where the English translation used to be. The translation text itself should not be visible until Reveal is clicked.
- [ ] After clicking "Reveal Translation" on a card, the translation reappears and the "Reveal Translation" button disappears on that specific card only. Other cards remain hidden.
- [ ] Learned cards in quiz mode still show their green background, checkmark badge, and "Learned ✓" button. The green styling is independent of the quiz mode amber styling.
- [ ] The loading spinner for the "Look Up" button is small (a tiny spinning circle next to the text "Looking up…") and appears inline below the lookup input, not in the center of the page.
- [ ] All Phase 1 cosmetic checks still apply: cards display correctly, progress bar animates smoothly, empty state shows before first fetch.

---

## Level 2: Functional Tests

**Difficulty Filter**
- [ ] Step: Open the difficulty dropdown → Expected: It contains exactly three options in this order: Beginner, Intermediate, Advanced. Beginner is selected by default.
- [ ] Step: Select "Spanish" as language, select "Beginner" as difficulty, click "Get New Words" → Expected: Five Spanish word cards appear. The words should be common, everyday vocabulary (e.g. greetings, colors, numbers, basic objects) — not obscure or literary vocabulary.
- [ ] Step: Select "Spanish" as language, select "Advanced" as difficulty, click "Get New Words" → Expected: Five Spanish word cards appear. The words should be noticeably more complex or uncommon than beginner words (e.g. idiomatic phrases, nuanced adjectives, less frequent verbs). They should feel harder than the beginner batch.
- [ ] Step: Select "Intermediate" difficulty and any language, click "Get New Words" → Expected: Five cards appear. The words should feel appropriately mid-level — more than basic greetings but less than obscure literary vocabulary.
- [ ] Step: Change the difficulty dropdown from Beginner to Intermediate, then refresh the page without fetching → Expected: After reload, the difficulty dropdown still shows "Intermediate" selected.

**Custom Word Lookup**
- [ ] Step: With "Spanish" selected as the language, type "hola" in the "Look Up a Word" text field and click "Look Up" → Expected: A result card appears below the input showing the word you typed in bold, its English translation, a pronunciation tip, and two numbered example sentences in Spanish. The result should appear within the lookup section, not mixed in with the vocabulary cards.
- [ ] Step: With "French" selected, type "bonjour" in the lookup field and click "Look Up" → Expected: The result appears with a French-context translation and pronunciation tip. The result reflects the currently selected language (French), not the default Spanish.
- [ ] Step: Type a multi-word phrase (e.g. "Buenos días") in the lookup field and click "Look Up" → Expected: The result appears with a translation, pronunciation tip, and two example sentences for the phrase. The app handles phrases, not just single words.
- [ ] Step: Type a word in the lookup field and press the Enter key (instead of clicking "Look Up") → Expected: The lookup triggers and a result card appears — same behavior as clicking the button.
- [ ] Step: Click "Look Up" without typing anything in the text field → Expected: An error message appears inline below the input field saying something like "Please type a word or phrase first." No result card appears.
- [ ] Step: Change the language dropdown to "German," then type any English word in the lookup field and click "Look Up" → Expected: The result provides a German translation (since German is the selected target language), not Spanish or French.

**Quiz Mode**
- [ ] Step: Fetch words, then click the "Quiz Mode" button → Expected: The button turns amber and its label changes to "Exit Quiz Mode." On every card, the English translation disappears and a "Reveal Translation" button appears in its place. The word in the target language and the example sentence remain visible.
- [ ] Step: While in quiz mode, click "Reveal Translation" on one specific card → Expected: The translation reappears on that card only, and the "Reveal Translation" button disappears on that card. All other cards remain in the hidden state.
- [ ] Step: While in quiz mode with some cards revealed, click "Exit Quiz Mode" → Expected: The button label changes back to "Quiz Mode" and the amber styling is removed. All cards now show their translations again. If you re-enter quiz mode, all cards start hidden again (no cards carry their "revealed" status into the next quiz session).
- [ ] Step: Mark two cards as learned, then click "Quiz Mode" → Expected: The two learned cards still show their green background, green checkmark badge, and "Learned ✓" button. Quiz mode does not remove or reset the learned state.
- [ ] Step: Enter quiz mode, reveal a card's translation, then click "Mark as Learned" on that card → Expected: The card turns green and the progress counter increments. Quiz mode remains active. Marking a word as learned does not exit quiz mode.
- [ ] Step: Mark three cards as learned, enter quiz mode, then click "Exit Quiz Mode" → Expected: The progress counter still shows "3 / 5 learned." Toggling quiz mode off and on does not reset learned progress.
- [ ] Step: In quiz mode, click "Get New Words" → Expected: New cards load with quiz mode reset to off. The "Quiz Mode" button shows its default muted style and label.

**All Phase 1 Features Still Working**
- [ ] Step: Fetch words, mark two as learned, then refresh the page → Expected: The same words and learned states are restored. Progress shows "2 / 5 learned" immediately on reload.
- [ ] Step: Verify the progress counter updates immediately when marking and unmarking cards, without a page reload.

---

## Level 3: Edge Cases

- [ ] Step: Click "Look Up" repeatedly while a lookup is in progress (click 3 times fast) → Expected: The "Look Up" button is disabled during the lookup, preventing duplicate requests. Only one result appears when the lookup completes.
- [ ] Step: Perform a lookup, then change the language dropdown to a different language, then perform another lookup with the same word → Expected: The second result reflects the newly selected language (different translation/sentences), not the previous one.
- [ ] Step: Enter quiz mode, then click "Get New Words" to fetch a fresh batch → Expected: The new cards are shown in normal mode (quiz mode resets when a new batch is fetched). No "Reveal Translation" buttons appear by default.
- [ ] Step: Mark all 5 words as learned, then enter quiz mode → Expected: All 5 cards show their green learned styling AND the "Reveal Translation" button. Both systems operate independently — learned status is not cleared.
- [ ] Step: Type a very long input (paste a full paragraph of 150+ characters) into the lookup field and click "Look Up" → Expected: Either a result is returned (the AI handles it), or an error message appears inline — but the app does not crash or show a blank screen.
- [ ] Step: Type special characters into the lookup field (e.g. `<script>alert(1)</script>`) and click "Look Up" → Expected: Any result that appears displays the text literally — no popup alerts appear and the page layout is not disrupted.
- [ ] Step: Fetch a batch, switch to quiz mode, reveal some cards, then refresh the page → Expected: After reload, quiz mode is off (it is not persisted), and all words appear with translations fully visible. Learned state is still preserved from before the refresh.
- [ ] Step: Without fetching any words (on a fresh load with no saved state), look at the area between the controls and the empty state → Expected: The "Quiz Mode" button and progress bar are not visible. They should only appear after words have been fetched.

---

## Autonomous Addition Review

- **Feature added:** "Press Enter to look up" keyboard shortcut — pressing the Enter key in the lookup text field triggers the lookup, identical to clicking the "Look Up" button.
- **Intended behavior:** When the cursor is in the lookup input and the user presses Enter, the lookup fires without needing to move the mouse to click the button.
- **Decision needed:** Keep. This is a universal convention for text input + submit button combinations. Users instinctively press Enter in text fields. Omitting it would feel broken. No teaching moment is needed — it is a baseline UX expectation, not an added feature. Flag it for the course only if you want to use it as an example of "autonomously added quality-of-life improvements."
