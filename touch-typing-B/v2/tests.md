# Tests — Touch Typing Practice v2

## Setup

Open the file `apps/touch-typing/v2/index.html` in your web browser by double-clicking it in your file explorer. No internet connection or additional software is required.

---

## Level 1: Cosmetic Checks

- [ ] The app opens to a selection screen — not the typing screen. A heading "Touch Typing Practice" appears at the top in a serif font.
- [ ] Four filter buttons ("All", "Short", "Medium", "Long") are displayed in a horizontal row beneath the heading. The "All" button starts with a dark (filled) background, indicating it is the active/selected filter.
- [ ] Inactive filter buttons ("Short", "Medium", "Long") have a light gray background and darker gray text — visually distinct from the active button.
- [ ] Passage cards are displayed as individual rounded-corner cards on a light gray background, each with a visible border separating them from the white page background.
- [ ] Hovering over a passage card causes a subtle background color change — the card should lighten or shift slightly to indicate it is clickable.
- [ ] Each passage card shows two lines of information: the passage preview text on top (in a readable size) and a metadata row beneath it with a difficulty label and character count in smaller, muted gray text.
- [ ] The difficulty label in each card's metadata row is displayed in all-caps (e.g., "MEDIUM", "SHORT", "LONG").
- [ ] When on the typing screen, a "← Choose a different passage" link appears at the top-left of the content area, styled as underlined muted gray text (not a dark button).
- [ ] The live WPM counter area below the passage is blank before typing begins. The passage, hint text, and button do not shift or jump when the counter text appears after typing starts.
- [ ] The "Current speed: X WPM" counter text is small and subtle — the WPM number is bold, but the surrounding label text is muted and smaller than the passage text.
- [ ] The results screen stat numbers (WPM and Accuracy) are large and bold, with their labels in small uppercase text below each number — identical in style to v1.
- [ ] Confetti pieces fall from the top of the screen when the results appear. The pieces should be varied in color (multiple colors visible), not uniform.
- [ ] The confetti animation plays once and stops on its own — pieces fall, fade near the bottom of the screen, and disappear. The screen does not remain covered with static confetti pieces.
- [ ] The results screen content (WPM number, Accuracy number, and "Try Again" button) is fully visible and readable while the confetti animation is playing.

---

## Level 2: Functional Tests

### Selection Screen — Default State
- [ ] Step: Open the app. → Expected: The selection screen appears with a list of passage cards. The "All" filter button is visually active (dark background). All 6 passages are visible as cards.

### Passage Card Previews
- [ ] Step: Look at the first passage card on the selection screen. → Expected: The card displays the first several words of the passage text followed by an ellipsis (…), not the full passage text.

### Selecting a Passage
- [ ] Step: Click any passage card. → Expected: The selection screen disappears and the typing screen appears, showing the full text of the passage you selected, with the cursor on the first character.
- [ ] Step: Click the second passage card. → Expected: The typing screen shows the text "A good typist does not look at the keyboard…" — the passage from card 2, not the first passage.

### Difficulty Filter — Short
- [ ] Step: On the selection screen, click the "Short" filter button. → Expected: The "Short" button becomes active (dark background). Only passage cards with the "SHORT" difficulty label are shown. Cards labeled "MEDIUM" or "LONG" disappear from the list.
- [ ] Step: After clicking "Short", count the visible passage cards. → Expected: At least one card is visible. The single short passage ("Type with purpose. Every keystroke counts.") should appear.

### Difficulty Filter — Medium
- [ ] Step: On the selection screen, click the "Medium" filter button. → Expected: Only "MEDIUM" difficulty passages are shown. There should be four medium-difficulty cards visible (the original four passages from v1).

### Difficulty Filter — Long
- [ ] Step: On the selection screen, click the "Long" filter button. → Expected: Only "LONG" difficulty passages are shown. At least one card is visible (the long passage about touch typing).

### Difficulty Filter — All
- [ ] Step: Click "Short", then click "All". → Expected: All 6 passage cards return to the list. The "All" button becomes active.

### Back Link Navigation
- [ ] Step: Click any passage card to go to the typing screen. Then click "← Choose a different passage". → Expected: The typing screen disappears and the selection screen reappears with all passage cards visible.
- [ ] Step: Click a passage card to enter the typing screen. Type several characters. Click "← Choose a different passage". → Expected: You return to the selection screen. No typing progress is carried over. When you pick a passage again, the cursor starts at the first character.

### Typing Behavior (Inherited from v1)
- [ ] Step: Select any passage and type the correct first character. → Expected: The first character turns green immediately, and the cursor moves to the second character.
- [ ] Step: Select any passage and type an incorrect first character. → Expected: The first character turns red immediately, and the cursor moves to the second character.
- [ ] Step: Select any passage and press a modifier key (Shift, Ctrl, Alt, or an arrow key) before typing anything. → Expected: Nothing happens — the cursor does not move, no character is highlighted.

### Hint Text
- [ ] Step: Select any passage and observe the typing screen before pressing any key. → Expected: The hint text "Start typing to begin" is visible below the passage.
- [ ] Step: Select any passage and press the first correct key. → Expected: The hint text disappears immediately.

### Live WPM Counter — Starts at Zero
- [ ] Step: Select any passage and look at the area below the passage before pressing any key. → Expected: The live WPM counter area is blank — no number is displayed.
- [ ] Step: Select any passage and press the first key to begin typing. → Expected: A "Current speed: X WPM" line appears below the passage within about one second of your first keystroke.

### Live WPM Counter — Updates While Typing
- [ ] Step: Select a passage and type at a steady pace for about 10 seconds. Watch the WPM counter. → Expected: The WPM number visible in the counter changes over time as you type — it does not stay frozen at a single value throughout your session.

### Live WPM Counter — Resets When Switching Passages
- [ ] Step: Select a passage and type for several seconds until a WPM number is displayed (e.g., "Current speed: 45 WPM"). Then click "← Choose a different passage". Select a different passage. → Expected: The live WPM counter on the new typing screen shows nothing — the counter from the previous session does not carry over.

### Results Screen After Completion
- [ ] Step: Select any passage and type every character through to the end. → Expected: The typing screen disappears and the results screen appears showing a WPM number and an Accuracy percentage. The confetti animation begins playing immediately.

### Confetti Animation — Plays Once
- [ ] Step: Complete any passage to trigger the results screen. Watch the confetti animation. → Expected: Colored pieces fall from the top of the screen, then fade out and disappear. The animation stops on its own within approximately 5–8 seconds. The confetti does not restart or loop.

### Confetti Does Not Block the UI
- [ ] Step: Complete a passage and immediately try clicking the "Try Again" button while the confetti animation is still playing. → Expected: The "Try Again" button responds to the click — the results screen resets and the typing screen for the same passage reappears. The confetti animation does not prevent interaction.

### Try Again Button
- [ ] Step: Complete any passage, then click "Try Again". → Expected: The results screen disappears, the typing screen for the same passage reappears, all characters are back to their uncolored (dark) state, the cursor is on the first character, and the live WPM counter area is blank.

### Try Again — Timer Resets
- [ ] Step: Complete a passage quickly, note the WPM. Click "Try Again", then type the same passage very slowly. → Expected: The second result's WPM is lower than the first, confirming the timer restarted from the first keystroke of the second attempt.

### Final WPM and Live WPM Are Both Shown
- [ ] Step: Complete any passage. → Expected: The live WPM counter was visible during typing (on the typing screen) and the final WPM is shown on the results screen. Both a live and a final WPM value are presented at different stages of the workflow.

### Typing the Short Passage ("Type with purpose.")
- [ ] Step: Filter to "Short", click the single short passage card, and type its full text. → Expected: The results screen appears after typing the final period, confirming the app correctly detects the end of a shorter passage, not just the default one.

### Typing the Long Passage
- [ ] Step: Filter to "Long", click the long passage card, and type its full text. → Expected: The app handles the longer passage correctly — the cursor advances through all characters, and the results screen appears when the final character is typed.

---

## Level 3: Edge Cases

- [ ] Step: On the selection screen, click "Short". Then click "Medium". Then click "Long". Then click "All". → Expected: Each click immediately updates the card list to show only the matching passages. The active filter button changes with each click. The transitions are instant with no delay or visual glitch.
- [ ] Step: On the selection screen, click a filter so that cards are showing. Then click the same filter button again. → Expected: Nothing changes — the same filter remains active, the same cards remain visible, and no error occurs.
- [ ] Step: Select a passage and begin typing. Press the spacebar when you reach a space character. → Expected: The space character in the passage is marked as correct (green) and the cursor advances. The page does not scroll down.
- [ ] Step: Select a passage, type partway through, then click "← Choose a different passage". Select the same passage again and immediately begin typing. → Expected: The passage starts fresh — the cursor is at position 1, no characters are colored, and the WPM counter is blank. Previous typing does not appear.
- [ ] Step: Complete a passage and reach the results screen. Press any letter key on the keyboard. → Expected: Nothing happens — keystrokes on the results screen do not affect any typing state.
- [ ] Step: Complete a passage, view the results, then click "Try Again" rapidly two times in a row. → Expected: The app returns to the typing screen in a clean state — no duplicate resets, no blank or broken UI. The cursor is on the first character and typing works normally.
- [ ] Step: Select a passage and type the entire thing, making a wrong keystroke for every single character. → Expected: All characters turn red as you type. The results screen appears at the end showing 0% Accuracy. The confetti animation still plays (celebration is for completion, not for accuracy).
- [ ] Step: Select any passage, type the first character, then immediately click "← Choose a different passage". Select a different passage. → Expected: The new typing screen shows no green or red characters from the previous session. The WPM counter is blank.
- [ ] Step: Narrow your browser window to a very small width (phone-like) by dragging the window edge inward. Then open the app. → Expected: Both the selection screen (with filter buttons and cards) and the typing screen (with the passage text) reflow and remain readable. Buttons and cards do not overlap, and no content is cut off.
- [ ] Step: Complete a passage so the confetti animation plays, then immediately click "Try Again" and complete the passage again to trigger a second confetti animation. → Expected: The second confetti animation plays normally from the top, without stacking on top of a previous unfinished animation or behaving erratically.

---

## Autonomous Addition Review

No autonomous additions detected in this version. The build log contains no entries flagged with "AUTONOMOUS ADDITION".

The following implementation decisions were made by the AI builder but fall within the spirit of the PRD — they do not represent out-of-scope features:

- **Back link on typing screen:** The build log notes this was added as part of Prompt 2.1 to enable navigation back to the selection screen. The PRD does not explicitly request it, but it is a logical affordance given the multi-passage design. Teaching moment opportunity: discuss with learners whether back-navigation is a natural necessity when adding a selection screen, or a feature that should be explicitly specified.
- **Character count displayed on passage cards:** Each card shows the character count alongside the difficulty label. The PRD only asks for a preview and implies difficulty should be identifiable. This is a minor extension that could be noted as an example of helpful but unspecified detail.
- **"All" filter as a fourth option:** The PRD specifies "Short, Medium, and Long" as the three filter options. The "All" option was added so users can see every passage at once. This is a sensible default state rather than a true autonomous addition, but worth confirming with the instructor: Decision needed — is the "All" filter desirable as a fourth option, or should the app default to showing all passages with no filter buttons selected?
