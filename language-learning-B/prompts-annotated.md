# Language Learning App — Annotated Prompt Sequences

---

## Phase 1 — MVP

### Prompt 1.1 — Initial Build

I want to build a vocabulary learning app that uses AI to help me study words in a new language. Here is exactly what I want it to do:

- At the top of the page, there is a dropdown menu where I can pick a language: Spanish, French, Japanese, German, or Portuguese.
- Below that, there is a button labeled "Get New Words."
- When I click the button, the app asks an AI (using the OpenAI API) to give me 5 vocabulary words in the language I selected. For each word, the AI should return: the word in that language, its English translation, and one example sentence showing the word used in context.
- The 5 words are displayed as cards on the page. Each card shows the word, the translation, and the example sentence.
- The page should be clean and easy to read, with the cards arranged in a single column on mobile and a grid on a wider screen.

For now, just build this core shell — the dropdown, the button, and the word cards. The AI call can return placeholder text for the moment if the API connection is not set up yet. I want to see the layout first.

> **Why this prompt works:** This is a mini-PRD handed directly to the coding agent — it names the app goal, the core user interaction (pick language, press button, see cards), the data shape (word + translation + sentence), and a layout requirement, all without any technical jargon. The closing instruction to accept placeholder data first is a deliberate scope-limiter that prevents the agent from trying to solve the API and layout in the same step.
>
> **Concept demonstrated:** Scoping / PRD — giving the AI a product brief rather than a vague wish, drawn from Module 1 Video 1 (writing a good initial prompt) and Video 2 (scoping the MVP).
>
> **Common learner mistake:** A learner might type "make a language learning app" and get back either a half-finished scaffold or a fully-formed app they do not understand. The mini-PRD forces the agent to match a specific intended behavior, which gives the learner something they can immediately validate against.
>
> **If this fails:** Ask the agent to just build the dropdown and one placeholder card first, then add the grid layout in a follow-up prompt.

---

### Prompt 1.2 — Connect the AI

Now let's wire up the real AI connection. When I click "Get New Words," I want the app to actually call the OpenAI API and return 5 real vocabulary words for the language I selected, each with a translation and an example sentence.

A few important things:
- The API key must NOT appear anywhere in the page that a visitor could see if they inspected the page source. It needs to be stored as a protected environment variable, not written directly into the visible code.
- Before we go any further, walk me through how to set that up safely in this project.
- Once it is set up, clicking the button should fetch real words and display them on the cards.

> **Why this prompt works:** This prompt bundles the API connection with an explicit API key security requirement in the same step — exactly as the course teaches in Module 3 Video 3.2. Keeping security inseparable from the initial API setup prevents the common shortcut of "I'll secure it later." The phrase "anywhere a visitor could see" uses observable behavior rather than the technical term "client-side."
>
> **Concept demonstrated:** API integration / API key security — connecting an LLM API and protecting credentials, from Module 3 Videos 3.1 and 3.2.
>
> **Common learner mistake:** A learner might write "add the OpenAI API key so words load." This leaves the door open for the agent to hard-code the key directly in the visible code, which violates the security lesson and can expose the key in a public repository.
>
> **If this fails:** Ask the agent to first explain where the key will be stored and how it will be accessed, then proceed with the connection once you have confirmed the approach is safe.

---

### Prompt 1.3 — Mark Words as Learned

Add the ability for me to mark a word as learned. Here is how it should work:

- Each word card gets a button or a clickable area labeled "Mark as Learned."
- When I click it, the card changes visually — for example, it gets a checkmark, a green background, or a strikethrough on the word — so I can clearly see which words I have already learned.
- If I click it again, the card goes back to its original not-learned state (it toggles).
- The progress indicator at the top of the page (or somewhere clearly visible) should say something like "2 / 5 learned" and update automatically whenever I mark or unmark a card.

> **Why this prompt works:** This prompt describes the learned/not-learned behavior entirely in terms of what the user will see and click — no mention of "state management" or "toggle boolean." The explicit toggle-back requirement prevents the agent from building a one-way interaction. Including the progress indicator in this prompt keeps the two features tightly coupled, which is the correct behavior.
>
> **Concept demonstrated:** Iterative building — adding one focused feature at a time after the initial scaffold is verified, from Module 1 Video 3 (iterating on a working base).
>
> **Common learner mistake:** A learner might try to add learned status and persistence in the same prompt. This makes debugging harder because if the checkmark disappears on refresh, you do not know whether the UI toggle or the save logic is broken. Separating them isolates the failure surface.
>
> **If this fails:** Ask the agent to first add just the visual toggle with no saving logic, confirm it works, then ask for persistence in the next prompt.

---

### Prompt 1.4 — Save Progress Across Refreshes

Right now, if I mark some words as learned and then refresh the page, everything resets. I want my learned status to be saved so it survives a page refresh.

Specifically: when I mark a word as learned, that status should be saved in the browser's built-in storage. When I reload the page, the same words should still show as learned without me having to click anything again. The progress indicator should also reflect the saved state as soon as the page loads.

Note: this saved progress is tied to this browser on this device. That is fine for now — I just do not want it to disappear on every refresh.

> **Why this prompt works:** The phrase "browser's built-in storage" is the non-technical equivalent of "localStorage" — the learner does not need to know the technical name to request the correct behavior. The note acknowledging that progress is device-bound sets an accurate expectation and prevents the learner from expecting cross-device sync (which would require a database and is explicitly out of scope). Starting the prompt with the observed broken behavior ("everything resets") grounds the request in a concrete problem.
>
> **Concept demonstrated:** Persistence — saving user progress in the browser's built-in storage, from Module 3 Video 3.3 (localStorage and JSON file persistence).
>
> **Common learner mistake:** A learner might write "save my progress to a database." This would push the agent toward suggesting a backend server, user accounts, or an external database — all of which are explicitly out of scope for this course and will create scope creep that overwhelms a solo builder.
>
> **If this fails:** Ask the agent to first add saving when you click "Mark as Learned," verify it writes to storage (the agent can confirm this by checking the browser's storage tool), then separately add the load-on-refresh behavior.

---

### Prompt 1.5 — Debugging Check

I am going to test the app now. If anything is not working correctly, here is what I will look for and how I want you to help me fix it:

- If I click "Get New Words" and nothing happens, or I see an error message instead of cards, let me know what might be causing it and fix it.
- If I mark a word as learned, refresh the page, and the checkmark disappears, the save-progress feature is not working — please diagnose and fix it.
- If the progress counter ("X / 5 learned") shows the wrong number, or does not update when I click, fix that too.

Describe what the broken behavior is, what is likely causing it, and what you changed to fix it.

> **Why this prompt works:** This prompt models the troubleshooting loop from Module 1 Video 5 — describe the observed broken behavior first, then ask for diagnosis, then a fix. By listing three specific failure scenarios, it teaches the learner to describe symptoms rather than guessing at causes. Asking the agent to explain what it changed closes the learning loop, which is a deliberate course technique.
>
> **Concept demonstrated:** Debugging — describing broken behavior to prompt diagnosis and fix, from Module 1 Video 5 (what to do when it breaks).
>
> **Common learner mistake:** A learner might type "it's broken, fix it." With no behavioral description, the agent has no failure signal to work from and will often make speculative changes that introduce new bugs or change things that were already working.
>
> **If this fails:** Test each behavior individually — fetch words first, then persistence, then the counter — and open a separate debugging prompt for each one that fails.

---

### Prompt 1.6 — Save Phase 1 Checkpoint

The core app is working: I can pick a language, fetch 5 vocabulary words from the AI, mark words as learned, see my progress, and have that progress saved when I refresh. This is a solid first version.

Before we add anything new, let's save this as a checkpoint. Commit everything to version control with a message like "Phase 1 complete — working vocabulary app with AI words and saved progress." That way, if something breaks when we add new features, we can always get back to this working state.

> **Why this prompt works:** This is a deliberate pause-and-save moment modeled directly on the course habit from Module 1 Video 4. The prompt explicitly names what is working, reinforcing the learner's sense of a complete unit of work. The rationale ("if something breaks... we can always get back") gives the learner a concrete reason to version before every phase, building the habit rather than just issuing an instruction.
>
> **Concept demonstrated:** Versioning — saving a stable checkpoint before adding new features, from Module 1 Video 4 (save before big changes).
>
> **Common learner mistake:** Learners often skip this step and go straight to Phase 2 prompts. When a Phase 2 change breaks Phase 1 functionality, they have no clean restore point and must either debug a tangled state or start over. Emphasize in instruction that this one prompt prevents the most common course frustration.
>
> **If this fails:** If version control is not yet set up, ask the agent to walk you through initializing a repository and making a first commit before continuing.

---

## Phase 2 — Richer Learning Tools

### Prompt 2.1 — Difficulty Filter

Add a way for me to choose the difficulty of the words before I fetch them. Here is what I want:

- Next to (or below) the language dropdown, add a second selector with three options: "Beginner," "Intermediate," and "Advanced."
- When I click "Get New Words," the app should pass this difficulty level to the AI along with the language, so the words that come back match the level I chose.
- For example, if I choose Spanish + Beginner, I should get very common everyday words. If I choose Japanese + Advanced, I should get more challenging vocabulary.
- The difficulty selector should default to "Beginner" when the page first loads.

> **Why this prompt works:** This prompt extends the AI prompt sent to the LLM by adding a second parameter (difficulty), which is a clean, low-risk expansion of the existing API call. The example pairings ("Spanish + Beginner," "Japanese + Advanced") give the agent enough context to construct a reasonable AI prompt without the learner needing to write one themselves. The default value instruction prevents an undefined state on first load.
>
> **Concept demonstrated:** Iteration / LLM prompt design — refining the prompt sent to the LLM to shape output, from Module 3 Video 3.4 (using an LLM as a live feature inside the app, not just a build tool).
>
> **Common learner mistake:** A learner might ask for difficulty filtering and separately ask the AI to validate that the words are actually the right difficulty. This adds a second AI call for validation, which doubles the cost and creates a new failure surface. The single-call approach — pass difficulty as a parameter to one LLM prompt — is both cheaper and simpler.
>
> **If this fails:** Ask the agent to show you what text it is currently sending to the AI when you click "Get New Words," then ask it to add the difficulty level to that text and try again.

---

### Prompt 2.2 — Look Up a Custom Word

I want to be able to type in any word or phrase myself and ask the AI to explain it. Here is exactly what I need:

- Add a text input box with a button next to it labeled "Look Up."
- When I type a word or phrase and click "Look Up," the app asks the AI to return: the translation into English (or from English into whatever language I have selected), a tip on how to pronounce it, and two example sentences showing the word used in context.
- The result appears on the page, clearly separated from the 5 daily vocabulary cards.
- Keep it to one AI call per lookup — I do not want a separate call for each piece of information.

> **Why this prompt works:** The "one AI call per lookup" instruction is a cost-awareness guardrail modeled on Module 3 Video 3.2 (free vs. paid API tradeoffs). The phrase "clearly separated from the 5 daily vocabulary cards" prevents the agent from mixing custom lookup results with the vocabulary cards, which would confuse the UI. Specifying the three pieces of information (translation, pronunciation tip, two examples) gives the agent a precise output shape without using any technical terms like "JSON schema" or "structured response."
>
> **Concept demonstrated:** API cost awareness / scoping an LLM feature — requesting exactly the output you need in a single call to avoid unnecessary charges, from Module 3 Video 3.2 and 3.5.
>
> **Common learner mistake:** A learner might ask for translation, pronunciation, and examples in three separate prompts or three separate requests. This triples the API cost for one lookup and is exactly the behavior the "scoping an LLM-powered feature to avoid runaway costs" lesson warns against.
>
> **If this fails:** Ask the agent to first return only the translation on lookup, confirm it appears correctly, then add pronunciation tip and examples in a follow-up.

---

### Prompt 2.3 — Quiz Mode

Add a quiz mode so I can test myself on the words. Here is how it should work:

- Add a toggle or button labeled "Quiz Mode" somewhere near the top of the word cards area.
- When quiz mode is on, each card hides the English translation. I see only the word in the target language and the example sentence.
- There is a "Reveal" button on each card. When I click it, the translation appears.
- When quiz mode is off, all cards go back to showing the translation normally.
- Quiz mode should not reset my learned/not-learned status — those checkmarks should stay as they are.

> **Why this prompt works:** The explicit "should not reset my learned/not-learned status" instruction prevents a common agent failure mode where adding a new UI state causes the agent to inadvertently re-initialize saved progress. This teaches learners to be explicit about what should NOT change when adding a feature — a defensive prompting habit. All behavior is described in terms of what appears and disappears on screen, with no technical framing.
>
> **Concept demonstrated:** Iteration — adding a new feature mode to a working app while protecting existing behavior, from Module 1 Video 3 (iterating without breaking what works).
>
> **Common learner mistake:** A learner might not specify that quiz mode and learned status are independent, leading to an agent implementation that stores quiz state and learned state in the same place — so toggling quiz mode clears the checkmarks. Anticipating this in the prompt prevents the bug entirely.
>
> **If this fails:** Ask the agent to add quiz mode as a simple show/hide toggle with no changes to the saved progress logic, then separately verify that learned status still persists after toggling quiz mode on and off.

---

### Prompt 2.4 — Debugging Check

Let me test the new features. Help me fix anything that is not behaving correctly:

- If I switch difficulty levels and click "Get New Words" but the words do not seem to change in difficulty, the difficulty is probably not being sent to the AI correctly — please diagnose and fix it.
- If I type a custom word and click "Look Up" but nothing appears, or I get an error, find the cause and fix it.
- If turning quiz mode on causes the learned checkmarks to disappear or resets my progress, fix that so the two features work independently.

Describe what is broken, what is likely causing it, and what you changed.

> **Why this prompt works:** Each bullet pairs a specific observed symptom ("words do not seem to change in difficulty") with a probable cause ("difficulty is probably not being sent to the AI correctly"), then asks for a fix. This models the symptom-to-cause-to-fix diagnostic pattern from Module 1 Video 5 and teaches learners to form hypotheses before escalating to the agent. The final bullet revisits the specific cross-feature risk flagged in Prompt 2.3 annotation.
>
> **Concept demonstrated:** Debugging — structured symptom-first diagnosis, from Module 1 Video 5.
>
> **Common learner mistake:** A learner may test only one of the three features and miss a regression in another. Encourage learners to explicitly test every feature from all previous phases after each new build — regressions are common when agents modify shared logic.
>
> **If this fails:** Isolate each feature into its own test session. Open a fresh debugging prompt for each broken behavior rather than listing all of them in one prompt — the agent handles focused failure descriptions better than broad lists.

---

### Prompt 2.5 — Save Phase 2 Checkpoint

The new features are working: difficulty filter, custom word lookup, and quiz mode are all functioning alongside the Phase 1 features. Let's save another checkpoint before moving on.

Commit everything to version control with a message like "Phase 2 complete — difficulty filter, custom lookup, and quiz mode added." This keeps a clean restore point in case Phase 3 changes break something.

> **Why this prompt works:** Repeating the checkpoint pattern reinforces the save-before-big-changes habit as a ritual, not a one-time action. Naming the features in the commit message models good version control practice for learners who have never committed code before. The forward-looking reason ("in case Phase 3 changes break something") builds anticipation of the deployment phase without creating anxiety.
>
> **Concept demonstrated:** Versioning — checkpoint before every phase transition, from Module 1 Video 4.
>
> **Common learner mistake:** A learner who skipped the Phase 1 checkpoint is especially likely to skip this one too. If a learner has not yet set up version control, this is the moment to do it — a working multi-feature app is a more motivating first commit than an empty scaffold.
>
> **If this fails:** If the agent cannot commit, ask it to at least create a copy of the current project folder with a name like "phase-2-backup" before proceeding.

---

## Phase 3 — Deployment

### Prompt 3.1 — Prepare the App for Deployment

I want to publish this app so anyone can open it at a real web address. Before deploying, help me make sure everything is ready:

- Confirm that the API key is stored as an environment variable and is not visible anywhere in the code a visitor could see in their browser.
- Make sure the app loads cleanly on both a desktop browser and a phone-sized screen.
- If there are any obvious rough edges — like broken spacing, buttons that are too small to tap on a phone, or error states that show no message to the user — fix those now.

Walk me through each of these checks one at a time.

> **Why this prompt works:** "Walk me through each of these checks one at a time" forces a sequential, auditable review rather than having the agent silently batch-fix everything before the learner can see what changed. This models the pre-deployment checklist behavior the course teaches. The API key security check appearing again here is intentional — the course spec explicitly warns that a visible key before deployment is the most common costly mistake.
>
> **Concept demonstrated:** API key security / deployment readiness — pre-flight checks before going live, from Module 3 Video 3.2 (key security) and Video 3.5 (deployment).
>
> **Common learner mistake:** A learner may skip pre-deployment checks and deploy immediately. The most common result is either a broken mobile layout or, worse, a deployed app with a visible API key. This prompt makes those checks feel like a natural step rather than an afterthought.
>
> **If this fails:** Ask the agent to handle one check at a time — security first, then mobile layout, then error states — so that if one check fails you know exactly where the problem is.

---

### Prompt 3.2 — Set a Spending Limit Before Going Live

Before I deploy, I want to make sure I will not get a surprise bill if people use the app more than I expect.

Help me set a spending limit on my API key so that if the total cost reaches a threshold I choose, no more calls go through until I reset it. Walk me through exactly how to do this in the OpenAI dashboard — I want to see the steps, not just a description. Once the limit is set, confirm that the app still works correctly within that limit.

> **Why this prompt works:** The phrase "surprise bill" connects directly to the learner's actual concern and is more motivating than "cost management." Asking for dashboard steps rather than a description ensures the learner performs the action themselves rather than reading a summary — the course teaches cost awareness as a hands-on behavior, not just a concept. Confirming the app still works after the limit is set prevents a false sense of security where the limit silently blocks the app.
>
> **Concept demonstrated:** API cost awareness — setting spending limits before deployment, a core lesson from Module 3 Video 3.2.
>
> **Common learner mistake:** A learner may set a very low limit (like $0.01) that immediately blocks the app, or no limit at all. Ask learners to think about expected usage — for a personal app with 5 words per session, even $5/month is generous. Make the math visible in the course instruction.
>
> **If this fails:** If the OpenAI dashboard steps have changed, ask the agent to describe the current location of spending controls based on what it knows, then verify manually on the OpenAI website.

---

### Prompt 3.3 — Deploy the App

Now let's publish the app. I want it accessible at a public web address that I can share with anyone.

Help me deploy it to a free hosting platform (such as Vercel or Netlify). The steps should include:

- How to connect my project to the hosting platform.
- How to set the API key as a protected environment variable on the hosting platform (not in the code).
- How to trigger the deployment and get the public URL.

Walk me through each step. Once it is live, I should be able to open the URL, pick a language, click "Get New Words," and see real vocabulary cards — all without the API key being visible anywhere on the page.

> **Why this prompt works:** The deployment end-state is described as a behavioral test — "open the URL, pick a language, click Get New Words, see cards" — which gives both the agent and the learner a clear pass/fail criterion. Repeating "not in the code" for the environment variable at the hosting platform stage closes the last remaining key-exposure gap that learners frequently miss: the key is in an environment variable locally, but many learners forget to set it on the hosting platform and the app silently breaks or falls back to an insecure path.
>
> **Concept demonstrated:** Deployment / API key security — publishing the app with a protected key on a live hosting platform, from Module 3 Video 3.5.
>
> **Common learner mistake:** A learner may deploy successfully but forget to set the environment variable on the hosting platform, causing all API calls to fail on the live site while working fine locally. Emphasize: the environment variable must be set twice — once on your local machine for development, once on the hosting platform for production.
>
> **If this fails:** Ask the agent to help you verify the environment variable is set on the hosting platform by checking the platform's settings panel before retrying the deployment.

---

### Prompt 3.4 — Debugging Check

Let me do a final check on the live deployed version. Help me catch and fix anything that is broken in the deployed environment:

- If fetching words works locally but fails on the deployed site, the API key environment variable is probably not set correctly on the hosting platform — help me find and fix that.
- If the app loads but the cards appear in a broken layout on a phone, fix the layout so it works on small screens.
- If any button clicks produce no visible response at all, diagnose what is failing and fix it.

Describe what is broken, what is likely causing it, and what you changed to fix it.

> **Why this prompt works:** This debugging prompt specifically targets the "works locally, breaks in production" failure pattern — the most common and confusing deployment problem non-technical learners encounter. Naming the likely cause ("API key environment variable is probably not set correctly on the hosting platform") teaches learners to look at infrastructure differences between environments, not just code differences. This is a behavioral pattern the course should reinforce explicitly.
>
> **Concept demonstrated:** Debugging / deployment — diagnosing environment-specific failures, from Module 1 Video 5 (debugging) and Module 3 Video 3.5 (deployment).
>
> **Common learner mistake:** When an app breaks after deployment, learners often assume they need to change their code, when the real problem is missing configuration on the hosting platform. This prompt directly models the correct first hypothesis: check the environment variable before changing any code.
>
> **If this fails:** Open the hosting platform's logs for the deployed app — most platforms (Vercel, Netlify) show server-side error logs. Ask the agent to help you read those logs to find the specific error message, which will identify the cause faster than guessing.

---

### Prompt 3.5 — Final Checkpoint

The app is live, deployed, and working correctly at a public URL. Let's do a final save.

Commit the finished, deployed version to version control with a message like "Phase 3 complete — app deployed with environment variable API key and spending limit set." This is the shipped product — a complete, working language learning app built from scratch.

> **Why this prompt works:** The final commit message is intentionally specific — it names both the API key security measure and the spending limit as part of what makes this version "done." This teaches learners that deployment is not just "the code works" but includes the operational safeguards the course requires. Ending with "built from scratch" is a deliberate motivational signal — the learner has shipped a real product.
>
> **Concept demonstrated:** Versioning / course completion — a final checkpoint that records the shipped state of the app, reinforcing the save-before-done habit from Module 1 Video 4 and celebrating the Module 3 learner outcome.
>
> **Common learner mistake:** Learners may commit before verifying the deployed version works, meaning their final commit reflects code that has not been tested in production. The instruction to commit only after confirming the live URL works is intentional — the habit should be "verify then commit," not "commit then hope."
>
> **If this fails:** If the commit fails, the most common cause is an untracked file or a file the version control system is refusing (like an accidentally included environment variable file). Ask the agent to check what files are being included in the commit and exclude any files that contain secrets before retrying.
