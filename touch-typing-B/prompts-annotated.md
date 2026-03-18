# Touch Typing App — Annotated Prompt Sequence

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

> **Why this prompt works:** This is a mini-PRD in natural language — it specifies the app's goal, the core user interaction (typing against highlighted text), the output (results screen), and the layout, all without using any technical terms. Giving the AI a concrete passage to use removes ambiguity that would otherwise produce a placeholder or lorem ipsum.
> **Concept demonstrated:** Scoping — translating a vague idea into a structured plan with goal, input, output, layout, and explicit constraints before any code is written.
> **Common learner mistake:** A learner might write "build me a typing speed test app" with no further detail. This produces an app with random design choices, arbitrary passages, and features the learner may not want — requiring multiple correction prompts before anything useful exists.
> **If this fails:** Ask the AI to describe back what it understood the app to do before it writes any code, then correct the description.

---

### Prompt 1.2 — Fix the Character Highlighting

Right now when I type, the highlighting is not working the way I expected. I want to make sure the behavior is exactly right:

- Each character in the passage should be styled the moment I press the matching key.
- If I press the right key, that character should immediately turn green.
- If I press the wrong key, that character should immediately turn red.
- The character I am about to type next should be visually distinct — give it a blinking cursor or an underline so I can always see where I am in the passage.
- I should not be able to skip ahead or type past where I currently am in the passage.

Please update the app so that the highlighting behaves exactly like this.

> **Why this prompt works:** This prompt refines a single behavior — character highlighting — with precise, observable rules rather than abstract instructions. Describing what the user sees and when they see it ("the moment I press the matching key") gives the AI specific acceptance criteria it can implement and the learner can verify.
> **Concept demonstrated:** Iteration — making one focused change at a time rather than rewriting the whole app, which is the core building loop introduced in Module 1 Video 3.
> **Common learner mistake:** A learner might write "make the highlighting better." This gives the AI no direction and produces a change that may or may not match what the learner wanted, leading to a back-and-forth loop that can corrupt the chat context.
> **If this fails:** Type two characters — one correct, one wrong — and describe exactly what color appears on screen versus what you expected. Paste that description into the chat.

---

### Prompt 1.3 — Results Screen

When I finish typing the last character of the passage, I want the results screen to appear. Please make sure it shows:

- My words per minute (WPM), calculated as the total number of characters I typed divided by 5, then divided by how many minutes it took me from my first keystroke to my last.
- My accuracy as a percentage: the number of characters I typed correctly divided by the total number of characters in the passage.
- A "Try Again" button that resets everything — clears the highlighting, resets the timer, and puts the cursor back at the beginning of the passage.

The results should replace the typing area on screen. Nothing else should appear — no decorations, no extra text, just the two numbers and the button.

> **Why this prompt works:** Spelling out the WPM and accuracy formulas in plain math prevents the AI from using a different calculation convention (some tools count words differently). Including the formula also models the PRD behavior of specifying outputs precisely — this is the "output" section of the mini-PRD concept from Module 1 Video 2.
> **Concept demonstrated:** Scoping — defining outputs precisely, including what formula produces the output value and what the screen looks like at that moment.
> **Common learner mistake:** A learner might omit the formula and write "show my WPM when I finish." The AI will pick a formula, but it may not match the standard convention (characters ÷ 5 ÷ minutes), producing numbers that seem wrong and are hard to debug without knowing how they were calculated.
> **If this fails:** After finishing the passage, type "The WPM on screen shows [X]. I typed [Y] characters in about [Z] seconds. That should be roughly [expected WPM]. Can you check whether the formula is correct?"

---

### Prompt 1.4 — Debugging: Something Is Broken

When I click the "Try Again" button, the passage does not fully reset. Some characters still appear green or red from my previous attempt, and the timer does not seem to restart from zero. The app looks like it is starting over, but the results at the end still reflect the old timing.

Can you figure out what is going wrong and fix it? The restart should completely clear all character colors, reset the timer to zero, and put the cursor back at the very first character — as if the page had just loaded for the first time.

> **Why this prompt works:** This debugging prompt describes the broken behavior in observable terms — what the user sees happening versus what they expected — without guessing at the cause. This is the exact debugging pattern taught in Module 1 Video 5: describe symptoms, not suspected causes, and let the AI diagnose.
> **Concept demonstrated:** Debugging — describing a functional issue (state not resetting) by its visible symptoms rather than by a technical hypothesis, and asking the AI to diagnose before fixing.
> **Common learner mistake:** A learner might write "fix the reset function" or "the timer variable isn't clearing." This assumes a cause and can lead the AI to patch the wrong thing, leaving the root issue intact. Learners without coding knowledge often guess at causes incorrectly because they are pattern-matching on words they heard, not on what the code actually does.
> **If this fails:** Start a fresh chat, paste Prompt 1.1 again to rebuild, and this time test the restart button immediately after building before adding anything else.

---

### Prompt 1.5 — Save This Version as a Checkpoint

The app is working the way I described. When I type, characters turn green or red. When I finish, I see my WPM and accuracy. The restart button fully resets everything.

Before I start adding new features, I want to save a clean copy of what we have right now. Please do whatever is needed to mark this as a stable version — I want to be able to come back to exactly this state if anything breaks in the next phase.

> **Why this prompt works:** This prompt anchors the versioning habit taught in Module 1 Video 4 at the right moment: immediately after the MVP works and before anything new is added. Phrasing it as "before I start adding new features" reinforces the causal reason for checkpointing — not as a ritual, but as protection before risk.
> **Concept demonstrated:** Versioning — saving a stable checkpoint before beginning a new phase of work, so there is a known-good state to fall back to.
> **Common learner mistake:** Learners often skip checkpointing and move straight to Phase 2. When Phase 2 changes break Phase 1 behavior, they have no stable version to restore and must rebuild from scratch.
> **If this fails:** Ask the AI "How do I save the current state of this project so I can return to it if something breaks?" and follow its instructions before continuing.

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

> **Why this prompt works:** This prompt adds exactly one new screen and one new behavior (selection before typing), and supplies the content directly so the AI does not have to invent it. Including the full passage text prevents the AI from using placeholder text that the learner would then need to replace. This models intentional iteration: adding the next smallest useful feature from the Phase 2 list.
> **Concept demonstrated:** Iteration — adding one scoped feature at a time from the Phase 2 feature set, and providing concrete content to prevent ambiguity.
> **Common learner mistake:** A learner might ask for "more passages and a way to pick difficulty and a live WPM counter" all in one prompt. Bundling features in a single prompt increases the chance of partial or broken results and makes it harder to identify which change caused a problem.
> **If this fails:** Ask the AI to add just the passage list first, without any selection UI, and verify that the correct passage loads before adding the selection screen.

---

### Prompt 2.2 — Live WPM Counter While Typing

While I am actively typing, I would like to see my current words-per-minute displayed on screen so I can watch it update in real time.

Please add a small counter somewhere on the typing screen — below the passage works fine — that shows my current WPM as I type. It should start updating after I press the first key and keep refreshing every second or so. It does not need to be a big prominent element. Something subtle and readable is fine.

This counter is separate from the final WPM shown on the results screen. Both should appear — the live one while typing, and the final one after I finish.

> **Why this prompt works:** The prompt distinguishes the live counter from the final results WPM, preventing the AI from replacing one with the other. Specifying "every second or so" sets a reasonable update interval without requiring the learner to know that a timing mechanism is involved. The placement suggestion ("below the passage") gives the AI a layout anchor without dictating exact positioning.
> **Concept demonstrated:** Iteration — adding a secondary output that enhances an existing feature (typing screen) without changing the core flow or results screen.
> **Common learner mistake:** A learner might not specify that the live counter and final results counter are separate, leading the AI to remove the results WPM or conflate the two, which then requires an extra correction prompt to untangle.
> **If this fails:** Clarify: "The number below the passage should update while I type. The number on the results screen should show my final WPM after I finish. These are two separate numbers — please keep both."

---

### Prompt 2.3 — Difficulty Selector

On the passage selection screen, I want to add a way for users to filter passages by difficulty before they pick one.

Please add three options at the top of the selection screen: Short, Medium, and Long. When the user clicks one, only the passages that match that length should be shown.

For the four passages already in the app, please assign each one a difficulty level that makes sense based on its length. Add at least one more passage so that each difficulty level has at least one option.

The difficulty selector should just filter what is shown — it should not hide the selector or change any other behavior.

> **Why this prompt works:** Delegating the difficulty assignment to the AI ("assign each one a difficulty level that makes sense") is appropriate here because the learner does not need to specify exact character counts — this is a cosmetic filter, not a business rule. The constraint "just filter what is shown" prevents the AI from wiring difficulty into the scoring logic or other unintended places.
> **Concept demonstrated:** Iteration — layering a filter onto an existing screen without changing the underlying passage data or the typing experience, demonstrating that features can be added in thin slices.
> **Common learner mistake:** A learner might ask for difficulty to also change the WPM target or evaluation criteria, which entangles two concerns in one prompt. Keeping difficulty as a pure filter keeps the prompt focused and the change reversible.
> **If this fails:** Ask the AI to add the three filter buttons first without hiding any passages, verify they appear, then ask it to make them filter the list in a second follow-up.

---

### Prompt 2.4 — Congratulations Animation

When I finish typing a passage and the results screen appears, I want a small visual flourish to celebrate the completion.

Please add a simple animation that plays once when the results screen first appears. It could be confetti falling down the page, a burst of colored shapes, or any other brief celebratory effect that feels rewarding. It should only play once and then stop — it should not loop or interfere with reading the results or clicking the Try Again button.

Keep the results (WPM, accuracy, and button) visible and readable during and after the animation.

> **Why this prompt works:** Giving the AI creative latitude on the animation type ("confetti or a burst of colored shapes, or any other brief effect") avoids the learner needing to know animation terminology, while the behavioral constraints ("only plays once," "does not loop," "results remain readable") prevent common failure modes. This models the principle that non-technical learners can specify behavior and guardrails without specifying implementation.
> **Concept demonstrated:** Iteration — adding a cosmetic enhancement to a specific screen without touching the core logic, and specifying the behavioral constraints that define "done."
> **Common learner mistake:** A learner might ask for "a really cool animation with sounds and particle effects." Over-specifying cosmetic details while under-specifying behavioral constraints (like "plays once") leads to an animation that loops indefinitely or obscures the results, requiring another prompt to fix.
> **If this fails:** Ask the AI to remove the animation entirely, verify the results screen works without it, then add just a simple confetti effect with "it must stop after 2 seconds and must not cover the WPM, accuracy, or Try Again button."

---

### Prompt 2.5 — Debugging and Final Checkpoint

I have noticed that when I switch between passages, the live WPM counter sometimes shows a number from my previous session instead of starting fresh. After picking a new passage, the counter should reset to zero and only start updating again once I press the first key.

Can you find what is causing the counter to carry over between passages and fix it?

Once that is working, please mark this as a stable version of the Phase 2 app — I want a clean checkpoint before I do anything else with this project.

> **Why this prompt works:** This prompt combines a debugging ask with a versioning request at the natural end of a phase — exactly when both behaviors should occur. The bug is described symptomatically ("shows a number from my previous session") rather than as a code diagnosis, which is the correct pattern for non-technical learners. Placing the versioning request immediately after the fix reinforces the habit of checkpointing at a stable moment, not as a separate afterthought.
> **Concept demonstrated:** Debugging plus versioning — describing a behavioral regression symptomatically, asking the AI to diagnose and fix it, then immediately checkpointing before the session ends.
> **Common learner mistake:** A learner might open a new chat to report the bug, losing the context of what was built in this session. For Phase 2, it is better to report bugs in the same chat where the feature was added, since the AI has full context on how the counter was implemented. Only start a new chat when beginning an entirely new phase.
> **If this fails:** Start fresh with the Phase 2 checkpoint saved at Prompt 1.5, rebuild Prompts 2.1 through 2.4 one at a time, and test the passage-switching behavior after each prompt to isolate which change introduced the bug.
