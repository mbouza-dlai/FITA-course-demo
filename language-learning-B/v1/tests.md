# Tests — Vocab Builder v1

## Setup

Run the app with these three commands (do them once, in order):
```
npm install
cp .env.example .env
node server.js
```
Then open `http://localhost:3000` in your browser.

> Note: Before running, open `.env` in any text editor and replace `your-openai-api-key-here` with your actual OpenAI API key. If you skip this step, the word fetch will show an error message — which is itself a valid thing to test in Level 3.

---

## Level 1: Cosmetic Checks

- [ ] The page title in the browser tab reads "Vocab Builder — Language Learning App."
- [ ] The header at the top of the page shows "Vocab Builder" as a large bold heading, with "AI-powered vocabulary cards for language learners" as smaller subtitle text beneath it.
- [ ] The language dropdown and the "Get New Words" button appear side-by-side inside a white card panel. They should not be stacked vertically or overflowing off the edge of the panel.
- [ ] Before any words are fetched, the page shows a book emoji (📚) and the message "Pick a language above and click Get New Words to start learning." The area below the controls should not appear blank or broken.
- [ ] The progress bar section (the "X / 5 learned" counter and the green bar) is not visible before words are fetched. It should only appear after clicking "Get New Words."
- [ ] After words are fetched, each card has a white background, rounded corners, and a subtle shadow. Cards should not appear as flat, unstyled boxes.
- [ ] The word on each card is displayed in large, bold, indigo-colored text. The English translation appears below it in regular-weight dark text with the label "Translation:" in front of it.
- [ ] The example sentence on each card appears in italics, in a lighter gray color, below a thin horizontal dividing line.
- [ ] The "Mark as Learned" button on each card is styled with a visible border and muted text — it should look like a secondary button, not a bold primary action.
- [ ] When a card is marked as learned, its background turns green-tinted, its word text turns green, and a small circular green checkmark badge appears in the top-right corner of the card.
- [ ] The progress bar fill animates smoothly when you mark or unmark a word (it should slide, not jump instantly).
- [ ] While words are being fetched, the "Get New Words" button is grayed out and its label changes to "Loading…", and a spinning circle appears below the controls.
- [ ] On a narrow screen (resize your browser window to phone width, or use a phone), the cards stack in a single column. On a wider screen, the cards appear in a 2-column grid.

---

## Level 2: Functional Tests

**Language Selection**
- [ ] Step: Open the app and look at the language dropdown → Expected: "Spanish" is selected by default as the first option in the list.
- [ ] Step: Click the language dropdown → Expected: A menu appears with exactly five options: Spanish, French, Japanese, German, Portuguese.
- [ ] Step: Select "French" from the dropdown, then click "Get New Words" → Expected: After a loading spinner, five cards appear. The words on the cards should be French vocabulary (not English or another language), and each card should show a French word, its English translation, and a French example sentence.
- [ ] Step: Select "Japanese" from the dropdown, then click "Get New Words" → Expected: Five cards appear. The words on the cards are in Japanese script (hiragana, katakana, or kanji), with English translations and Japanese example sentences.

**Fetching Words**
- [ ] Step: Click "Get New Words" with Spanish selected → Expected: The spinner appears briefly, then disappears and is replaced by exactly 5 word cards. Each card contains a word, a translation, and an example sentence. No error message is visible.
- [ ] Step: Click "Get New Words" a second time while cards are already showing → Expected: The old cards fade slightly, the spinner appears, and after loading, a completely new set of 5 cards replaces the previous ones. Learned checkmarks from the previous batch do not carry over to the new batch.

**Mark as Learned — Toggle**
- [ ] Step: Click "Mark as Learned" on the first card → Expected: The card immediately turns green-tinted, the word changes to green, a green checkmark badge appears in the top-right corner, and the button label changes to "Learned ✓". The progress indicator updates from "0 / 5 learned" to "1 / 5 learned."
- [ ] Step: Click "Learned ✓" on a card that is already marked as learned → Expected: The card reverts to its original white background, the word color returns to indigo, the green checkmark badge disappears, and the button label changes back to "Mark as Learned." The progress counter decreases by 1.
- [ ] Step: Mark all 5 cards as learned → Expected: The progress counter reads "5 / 5 learned" and the green progress bar is completely full.

**Progress Indicator**
- [ ] Step: Mark 2 out of 5 cards as learned → Expected: The progress label reads exactly "2 / 5 learned" and the green bar fills approximately 40% of its track width.
- [ ] Step: Mark 3 cards, then unmark 1 → Expected: The progress label immediately updates to "2 / 5 learned." No page refresh is needed for the update to appear.

**Save Progress Across Refreshes**
- [ ] Step: Fetch words, mark the first two cards as learned, then press the browser's Reload button (or press F5) → Expected: After reloading, the same 5 words reappear and the first two cards are still shown as learned (green background, checkmark, "Learned ✓" button). The progress indicator shows "2 / 5 learned" immediately without any interaction.
- [ ] Step: Select "German" from the language dropdown, then refresh the page without fetching new words → Expected: After reloading, the language dropdown still shows "German" selected.

**Error Handling**
- [ ] Step: (If you have not set up an API key) Open `.env`, delete the key value so the line reads `OPENAI_API_KEY=`, restart the server, then click "Get New Words" → Expected: A red error message appears on the page saying something about the API key not being configured. No blank screen or broken layout appears.

---

## Level 3: Edge Cases

- [ ] Step: Click "Get New Words" repeatedly and rapidly (click it 3 times as fast as you can) → Expected: The button is disabled (grayed out, says "Loading…") after the first click, so extra clicks do not trigger additional fetches. Only one set of 5 cards appears when loading finishes.
- [ ] Step: Fetch words, mark several as learned, then click "Get New Words" again → Expected: The newly fetched batch starts with 0 learned cards. The progress bar resets to "0 / 5 learned." Previous learned checkmarks do not bleed into the new batch.
- [ ] Step: With cards visible, open a second browser tab to the same app URL (`http://localhost:3000`) → Expected: The second tab shows the same saved words and learned state as the first tab (since both read from the same browser storage).
- [ ] Step: Fetch a set of words, mark some as learned, close the browser entirely, then re-open the browser and navigate to `http://localhost:3000` → Expected: The same cards and learned states are restored. Progress is not lost when the browser is fully closed and reopened.
- [ ] Step: Select each of the five languages one at a time and click "Get New Words" for each → Expected: Each language produces cards in the correct script and language. Japanese produces Japanese-script words, German produces German words with correct umlauts, and so on.
- [ ] Step: Resize the browser window to be very narrow (less than 400 pixels wide, simulating a phone screen) → Expected: The language dropdown and "Get New Words" button do not overflow outside the visible area of the screen. Cards stack in a single column.

---

## Autonomous Addition Review

- **Feature added:** Empty-state message with a book emoji (📚) and the text "Pick a language above and click Get New Words to start learning."
- **Intended behavior:** Displayed in the card area before any words have been fetched, so the page does not appear blank or broken on first load.
- **Decision needed:** Keep. This is purely a cosmetic placeholder that prevents a confusing blank-page experience. It adds no functionality beyond the PRD scope and improves first-impression usability for non-developer learners. No teaching moment is required — it is an expected best practice for empty states.
