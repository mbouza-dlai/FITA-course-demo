# Touch Typing App — Prompt Sequence

---

## Phase 1 — MVP

### Prompt 1.1 — Initial Build

I want to build a touch typing practice app that runs in the browser. Here is what it should do:

- Show a short paragraph of text on screen that the user is supposed to type out.
- As the user types, each character they get right should turn green, and each character they get wrong should turn red.
- When the user finishes typing the full passage, show a results screen with two numbers: how many words per minute they typed, and what percentage of characters they got right.
- Include a restart button on the results screen that clears everything and lets the user try again from the beginning.

For the layout, keep it simple: a clean white background, the passage displayed in large readable text in the center of the page, and nothing else on screen while the user is typing. The results screen should appear in place of the passage when they finish.

The app does not need to save anything. Every time the page loads, it starts fresh. There are no accounts, no scores saved, no settings. Just the passage, the typing, and the result.

Use this passage as the text to type: "The quick brown fox jumps over the lazy dog. Practice makes perfect, so keep your fingers on the home row and your eyes on the screen."

Build the full working version of this now.

---

### Prompt 1.2 — Fix the Character Highlighting

Right now when I type, the highlighting is not working the way I expected. I want to make sure the behavior is exactly right:

- Each character in the passage should be styled the moment I press the matching key.
- If I press the right key, that character should immediately turn green.
- If I press the wrong key, that character should immediately turn red.
- The character I am about to type next should be visually distinct — give it a blinking cursor or an underline so I can always see where I am in the passage.
- I should not be able to skip ahead or type past where I currently am in the passage.

Please update the app so that the highlighting behaves exactly like this.

---

### Prompt 1.3 — Results Screen

When I finish typing the last character of the passage, I want the results screen to appear. Please make sure it shows:

- My words per minute (WPM), calculated as the total number of characters I typed divided by 5, then divided by how many minutes it took me from my first keystroke to my last.
- My accuracy as a percentage: the number of characters I typed correctly divided by the total number of characters in the passage.
- A "Try Again" button that resets everything — clears the highlighting, resets the timer, and puts the cursor back at the beginning of the passage.

The results should replace the typing area on screen. Nothing else should appear — no decorations, no extra text, just the two numbers and the button.

---

### Prompt 1.4 — Debugging: Something Is Broken

When I click the "Try Again" button, the passage does not fully reset. Some characters still appear green or red from my previous attempt, and the timer does not seem to restart from zero. The app looks like it is starting over, but the results at the end still reflect the old timing.

Can you figure out what is going wrong and fix it? The restart should completely clear all character colors, reset the timer to zero, and put the cursor back at the very first character — as if the page had just loaded for the first time.

---

### Prompt 1.5 — Save This Version as a Checkpoint

The app is working the way I described. When I type, characters turn green or red. When I finish, I see my WPM and accuracy. The restart button fully resets everything.

Before I start adding new features, I want to save a clean copy of what we have right now. Please do whatever is needed to mark this as a stable version — I want to be able to come back to exactly this state if anything breaks in the next phase.

---

## Phase 2 — Enhancements

### Prompt 2.1 — Multiple Passages to Choose From

Right now the app always shows the same passage. I want to add a way for the user to pick which passage they want to practice before they start typing.

Please add a simple selection screen that appears when the app loads (before any typing begins). It should offer at least four different passages to choose from. Show them as a list of buttons or cards, each one displaying the first few words of the passage as a preview.

When the user clicks one, it should take them straight to the typing screen with that passage loaded and ready to go.

Here are four passages to use:

1. "The quick brown fox jumps over the lazy dog. Practice makes perfect, so keep your fingers on the home row and your eyes on the screen."
2. "A good typist does not look at the keyboard. With enough repetition, your fingers learn where every key lives, and your brain stops thinking about the mechanics."
3. "Speed comes after accuracy. Focus first on pressing the right key every time. The pace will follow naturally as your muscle memory develops."
4. "Every expert was once a beginner. The only difference between a slow typist and a fast one is the number of hours spent with fingers on keys."

---

### Prompt 2.2 — Live WPM Counter While Typing

While I am actively typing, I would like to see my current words-per-minute displayed on screen so I can watch it update in real time.

Please add a small counter somewhere on the typing screen — below the passage works fine — that shows my current WPM as I type. It should start updating after I press the first key and keep refreshing every second or so. It does not need to be a big prominent element. Something subtle and readable is fine.

This counter is separate from the final WPM shown on the results screen. Both should appear — the live one while typing, and the final one after I finish.

---

### Prompt 2.3 — Difficulty Selector

On the passage selection screen, I want to add a way for users to filter passages by difficulty before they pick one.

Please add three options at the top of the selection screen: Short, Medium, and Long. When the user clicks one, only the passages that match that length should be shown.

For the four passages already in the app, please assign each one a difficulty level that makes sense based on its length. Add at least one more passage so that each difficulty level has at least one option.

The difficulty selector should just filter what is shown — it should not hide the selector or change any other behavior.

---

### Prompt 2.4 — Congratulations Animation

When I finish typing a passage and the results screen appears, I want a small visual flourish to celebrate the completion.

Please add a simple animation that plays once when the results screen first appears. It could be confetti falling down the page, a burst of colored shapes, or any other brief celebratory effect that feels rewarding. It should only play once and then stop — it should not loop or interfere with reading the results or clicking the Try Again button.

Keep the results (WPM, accuracy, and button) visible and readable during and after the animation.

---

### Prompt 2.5 — Debugging and Final Checkpoint

I have noticed that when I switch between passages, the live WPM counter sometimes shows a number from my previous session instead of starting fresh. After picking a new passage, the counter should reset to zero and only start updating again once I press the first key.

Can you find what is causing the counter to carry over between passages and fix it?

Once that is working, please mark this as a stable version of the Phase 2 app — I want a clean checkpoint before I do anything else with this project.
