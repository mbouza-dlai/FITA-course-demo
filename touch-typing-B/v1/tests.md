# Tests — Touch Typing Practice v1

## Setup

Open the file `apps/touch-typing/v1/index.html` in your web browser by double-clicking it in your file explorer. No internet connection or additional software is required.

---

## Level 1: Cosmetic Checks

- [ ] The page background is solid white with no other colors, patterns, or distractions visible.
- [ ] The passage text is displayed in a serif font (Georgia), noticeably different from the button and hint text below it.
- [ ] The passage text is large and easy to read — each character should be comfortably distinguishable at normal reading distance.
- [ ] Before typing begins, a muted gray hint reads "Click anywhere and start typing" below the passage.
- [ ] The first character of the passage has a light blue background highlight and a blue underline, clearly marking where typing will start.
- [ ] The blue cursor highlight on the current character blinks smoothly — it should alternate between two shades of blue at a steady rhythm, not flicker erratically or stay solid.
- [ ] Correct characters turn green. The green is clearly distinguishable from the surrounding untyped characters (which remain dark/black).
- [ ] Wrong characters turn red. The red is clearly distinguishable from both the green correct characters and the dark untyped ones.
- [ ] The "Try Again" button has a dark background with white text and is visually centered on the results screen.
- [ ] Hovering the mouse over the "Try Again" button causes its background to visibly darken (the hover effect is noticeable).
- [ ] The results screen shows exactly two large numbers — WPM on the left and Accuracy on the right — each with a small uppercase label beneath it.
- [ ] The WPM and Accuracy values are displayed in a large, bold font (approximately 3–4x the size of the label text below them).
- [ ] The results screen has no extra decorations, images, or text beyond the two stats and the "Try Again" button.
- [ ] The entire layout is centered on the page both horizontally and vertically with comfortable padding on all sides.

---

## Level 2: Functional Tests

### Passage Display
- [ ] Step: Open the app in your browser. → Expected: The full passage "The quick brown fox jumps over the lazy dog. Practice makes perfect, so keep your fingers on the home row and your eyes on the screen." is visible on screen, fully intact with no missing or extra characters.

### Cursor Position
- [ ] Step: Open the app without typing anything. → Expected: The very first character ("T" in "The") has a blue background and underline, indicating the cursor is at position 1.

### Correct Keystroke Highlighting
- [ ] Step: Press the "T" key on your keyboard. → Expected: The "T" character immediately turns green, the cursor highlight moves to the next character ("h").
- [ ] Step: Continue pressing the correct keys for "he" (press "h" then "e"). → Expected: Each character turns green the instant the correct key is pressed, and the cursor advances one position with each keystroke.

### Wrong Keystroke Highlighting
- [ ] Step: Open the app fresh (or click "Try Again" to reset). Press any key that does NOT match the first character — for example, press "x". → Expected: The "T" character immediately turns red, and the cursor advances to the next character.

### No-Skip-Ahead Enforcement
- [ ] Step: Type a few characters normally, then rapidly tap the same key several times. → Expected: Each keypress only advances the cursor by one character at a time. The cursor cannot jump ahead to a later character.

### Hint Text Disappears on First Keystroke
- [ ] Step: Open the app and observe the hint text below the passage. Press any key to begin typing. → Expected: The "Click anywhere and start typing" hint disappears (becomes invisible) as soon as the first key is pressed.

### Results Screen Appears After Completion
- [ ] Step: Type every character of the passage correctly from start to finish. → Expected: The moment the last character is typed, the typing area disappears and the results screen appears in its place, showing a WPM number and an Accuracy percentage.

### WPM Calculation Is Plausible
- [ ] Step: Type the full passage at a comfortable pace (neither rushing nor deliberately slow). → Expected: The WPM value displayed is a positive whole number that seems reasonable for your typing speed (typically between 20 and 120 WPM for most people). It should not show 0, a negative number, or an impossibly large number like 9999.

### Accuracy Calculation
- [ ] Step: Type the entire passage making at least two intentional mistakes (press a wrong key at two points), then type all remaining characters correctly. → Expected: The Accuracy percentage shown on the results screen is less than 100%, reflecting that some characters were typed incorrectly.
- [ ] Step: Type the entire passage pressing only the correct keys throughout. → Expected: The Accuracy percentage shows 100%.

### Try Again Button — Full Reset
- [ ] Step: Complete the passage so the results screen appears. Click "Try Again". → Expected: The results screen disappears, the typing passage reappears with all characters back to their original dark color (no green or red remaining), the cursor highlight is back on the very first character ("T"), and the hint text is visible again.
- [ ] Step: After clicking "Try Again", immediately begin typing from the start. → Expected: Typing works normally from the first character — green and red highlights appear as expected, and the cursor advances correctly.

### Timer Resets After Try Again
- [ ] Step: Complete the full passage quickly. Note the WPM shown. Click "Try Again", then deliberately type very slowly this time, taking several seconds between keystrokes. → Expected: The second session's WPM result is noticeably lower than the first session's WPM, confirming the timer started fresh from the first keystroke of the second session.

### Space Key Does Not Scroll Page
- [ ] Step: Begin typing the passage and reach a space character. Press the spacebar to type the space. → Expected: The space character in the passage is marked green (or red) and the cursor advances. The page does not scroll down.

### Clicking the Passage Maintains Typing
- [ ] Step: Begin typing several characters. Click directly on the passage text with your mouse. Then continue typing. → Expected: Typing continues to work immediately after clicking the passage — keystrokes are still captured and characters are highlighted.

---

## Level 3: Edge Cases

- [ ] Step: Open the app and immediately press a modifier key such as Shift, Ctrl, Alt, or the arrow keys. → Expected: Nothing happens — no character is highlighted, the cursor does not move, and no error appears. Only keys that produce a single printable character should advance the cursor.
- [ ] Step: Open the app and press the correct first key many times very rapidly (tap "T" five times fast). → Expected: Only the first "T" is accepted and turns green. The cursor moves to position 2. The remaining rapid taps are ignored because the character at position 2 is "h", not "T".
- [ ] Step: Begin typing the passage partway through, then refresh the browser page. → Expected: The page reloads completely, the passage is shown from the beginning with no colors, and the hint text is visible. All progress from the previous session is gone (this is expected behavior — the app does not save progress).
- [ ] Step: Complete the passage so the results screen appears. Without clicking "Try Again", press a letter key on your keyboard. → Expected: Nothing happens — the typing screen is not visible, so keypresses on the results screen should have no effect.
- [ ] Step: Type the passage and intentionally press the wrong key for every single character. → Expected: All characters in the passage turn red as you type through them. The results screen appears when you reach the end, and the Accuracy shows 0%.
- [ ] Step: Complete the entire passage at a very slow pace, pausing for at least 5 full seconds between some keystrokes. → Expected: The app continues working normally throughout the pauses. The results screen appears when the final character is typed, and the WPM reflects the full elapsed time including the pauses.
- [ ] Step: Narrow your browser window to a very small width (like a phone-sized column) by dragging the edge of the window inward. → Expected: The passage text reflows into the narrower space, remaining readable. The layout does not break, overlap, or produce horizontal scrollbars.

---

## Autonomous Addition Review

No autonomous additions detected in this version. The build log contains no entries flagged with "AUTONOMOUS ADDITION". All features implemented correspond directly to PRD prompts 1.1 through 1.5.

Note for reviewers: The build log does mention one implementation decision worth awareness — the app listens for keystrokes on the entire document rather than requiring a click first. This is a sensible UX decision made in service of the PRD's goal (clean, immediate typing experience) and is not an autonomous feature addition.
