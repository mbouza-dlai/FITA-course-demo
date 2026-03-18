# Instructor Guide — Vocab Builder (Language Learning App)

---

## 1. Episode Brief

- **App name:** Vocab Builder — Language Learning App
- **Module:** 3 (Capstone)
- **Videos covered:** 3.1, 3.2, 3.3, 3.4, 3.5

**What the learner will watch and then do themselves:**

In this demo you build a complete, deployed vocabulary learning app from scratch in three phases. Phase 1 creates the core app: a language dropdown, an "Get New Words" button that calls the OpenAI API, five vocabulary cards, and a learned/not-learned toggle that saves progress across page refreshes. Phase 2 adds a difficulty filter, a custom word lookup panel, and a quiz mode. Phase 3 polishes the app for mobile, walks through setting a spending limit on the API key, and deploys the app to a public URL. By the end, the learner has a real, shareable app in their browser that combines every major skill from all three modules.

**The ONE thing the learner must walk away understanding:**

You can wire an LLM API into a working web app as a live feature — not just as a build assistant — and you can do it safely by storing the API key on the server, never in the browser.

---

## 2. Pre-filming Checklist

**Tool and environment setup**

- [ ] Node.js is installed. Verify by opening a terminal and running `node --version`. You should see v18 or later.
- [ ] npm is installed. Run `npm --version`. You should see v9 or later.
- [ ] Git is installed and configured. Run `git --version`.
- [ ] You have a code editor open (VS Code recommended) with a readable font size. Set editor font size to at least 18pt before recording — smaller is unreadable on camera.
- [ ] Terminal font size is at least 18pt. Check in your terminal preferences.
- [ ] Screen resolution is set to 1920x1080 or lower. Higher resolutions make text too small on a recording.

**Browser setup**

- [ ] Open Google Chrome (or your preferred browser) and clear all browsing data for `localhost` before recording. Go to Chrome Settings > Privacy > Clear browsing data, and check "Cookies and other site data" and "Cached images and files" for the past hour. This ensures localStorage is clean and the app starts fresh.
- [ ] DevTools is closed before hitting record. You will open it deliberately on camera during the API key security demo — do not have it open before that.
- [ ] A browser tab is open to `http://localhost:3000` but shows a "site can't be reached" error (the server is not yet running). This is the correct starting state for Phase 1.
- [ ] A second browser tab is open to the finished v3 app running at `http://localhost:3000` (on a different port or a second session) so you can show the completed version at the start. **Alternatively, have the v3 folder running on port 3001.** See "Show the finished app first" below.

**Show the finished app first**

Before filming the Phase 1 build, have the v3 finished app running in a separate terminal so you can show learners where they are headed. To run it on a different port:

1. Open a terminal.
2. `cd` into the `v3/` folder.
3. Run `PORT=3001 node server.js` (on Mac/Linux) to start it on port 3001.
4. Open `http://localhost:3001` in a browser tab. Confirm words load, the difficulty filter works, and the quiz mode button appears.
5. Keep this tab open during the intro. Switch back to your empty editor for the actual build.

**API key setup**

- [ ] You have an active OpenAI API account with at least $5 in credits and a valid API key.
- [ ] **Do not put the key in any file before recording.** You will add it on camera as part of Prompt 1.2 — the learner needs to see that step happen.
- [ ] Keep the API key in a plain text file on your desktop (not in the project) so you can paste it quickly without fumbling. Close that text file before any screen share or recording that might accidentally expose the key.
- [ ] Confirm a spending limit is already set on your account from a previous session so you are not demonstrating against an unlimited key. For the Prompt 3.2 demo, you will walk through setting the limit in the OpenAI dashboard — have your browser open to `platform.openai.com` in a background tab.

**Version control**

- [ ] Git is initialized in your project folder before recording. Run `git init` and make an empty first commit so version control is ready when Prompt 1.6 asks for a checkpoint.
- [ ] Alternatively, have the coding agent initialize Git on camera during Prompt 1.6. Either approach works — decide in advance so you are not improvising.

**Deployment tab**

- [ ] A browser tab is open to `railway.app` (or your chosen hosting platform) and you are already logged in. Having to create an account on camera during Phase 3 is a significant time sink.
- [ ] If using Railway, have a project already created and connected to a GitHub repo. The demo will show adding the environment variable and triggering the deploy — not account creation.

**Screen layout before hitting record**

- [ ] Left half of screen: code editor (empty project folder open).
- [ ] Right half of screen: browser with the finished v3 app at `http://localhost:3001`.
- [ ] Terminal is minimized or docked. You will open it on camera when needed.
- [ ] No Slack, email, or notification badges visible on the dock or taskbar.

---

## 3. Prompt-by-Prompt Narration Guide

---

### Prompt 1.1 — Initial Build

**Say:** "Before I type anything to the coding agent, I want you to notice what I'm about to do. I'm not going to say 'make me a language learning app' and hope for the best. I'm going to write a mini product brief — the same kind of brief we talked about in Module 1. It tells the agent exactly what the user sees, what they click, and what the app gives back. Let me show you what that looks like."

**Type:**

```
I want to build a vocabulary learning app that uses AI to help me study words in a new language. Here is exactly what I want it to do:

- At the top of the page, there is a dropdown menu where I can pick a language: Spanish, French, Japanese, German, or Portuguese.
- Below that, there is a button labeled "Get New Words."
- When I click the button, the app asks an AI (using the OpenAI API) to give me 5 vocabulary words in the language I selected. For each word, the AI should return: the word in that language, its English translation, and one example sentence showing the word used in context.
- The 5 words are displayed as cards on the page. Each card shows the word, the translation, and the example sentence.
- The page should be clean and easy to read, with the cards arranged in a single column on mobile and a grid on a wider screen.

For now, just build this core shell — the dropdown, the button, and the word cards. The AI call can return placeholder text for the moment if the API connection is not set up yet. I want to see the layout first.
```

**While waiting:** This prompt is building the full project structure — an HTML file, a server file, and configuration files — so it may take 30 to 60 seconds. While the agent works, narrate: "Notice what I added at the end: 'The AI call can return placeholder text for now.' That one sentence is a scope limiter. I'm telling the agent to get the layout right before worrying about the real API connection. If I don't say that, the agent might try to solve the layout and the API in the same step, and when something breaks, I won't know which one caused it."

**Highlight:** When the result appears, point at two things. First, the file list — call out that the agent created `server.js`, `package.json`, and `public/index.html` rather than a single file. Say: "See that it built a server — that's actually the right move for what we're about to do with the API key, and we'll explain exactly why in a minute." Second, open `http://localhost:3000` in the browser after running `npm install` and `node server.js`. Point at the empty state message ("Pick a language above and click Get New Words to start learning") and say: "The page isn't blank — the agent added a helpful placeholder so we know the layout is working before we connect anything real."

**If it breaks:** "Interesting — the agent gave us something a bit different than expected. Let's look at what it built and see if the core pieces are here: a dropdown, a button, and a card area. As long as those three things exist, we're in good shape. Let me just note what's different and we'll adjust in the next prompt."

---

### Prompt 1.2 — Connect the AI

**Say:** "The layout is working. Now let's connect the real OpenAI API. And this is the moment in the course where I want you to pay very close attention — because how we add this API key matters as much as the fact that we're adding it at all. Watch what I say in this prompt."

**Type:**

```
Now let's wire up the real AI connection. When I click "Get New Words," I want the app to actually call the OpenAI API and return 5 real vocabulary words for the language I selected, each with a translation and an example sentence.

A few important things:
- The API key must NOT appear anywhere in the page that a visitor could see if they inspected the page source. It needs to be stored as a protected environment variable, not written directly into the visible code.
- Before we go any further, walk me through how to set that up safely in this project.
- Once it is set up, clicking the button should fetch real words and display them on the cards.
```

**While waiting:** This prompt is doing two things at once: setting up the server-side proxy and wiring the API call. It will take 30 to 60 seconds. Narrate: "Notice the phrase 'must NOT appear anywhere a visitor could see.' I used observable behavior to describe the security requirement — I didn't say 'use environment variables' or 'use a server-side proxy.' I described what I want the outcome to look like, and the agent figures out the technical path to get there. That phrasing also keeps it inseparable from the feature — security isn't an afterthought I'll add later, it's part of this step."

**Highlight:** When the agent responds, it will describe a `.env` file and a `server.js` proxy. Point at the server.js file and say: "See what happened here. The agent put the API key reading code on the server — `process.env.OPENAI_API_KEY`. When the browser clicks 'Get New Words,' it talks to our own server, which then talks to OpenAI. The API key never leaves the server." Then open DevTools in the browser (right-click > Inspect > Network tab), click "Get New Words," and point at the network request. Say: "The request goes to `/api/words` — our own server. Not to `api.openai.com`. The browser never sees the key." After that, add your real API key to the `.env` file and click the button to show real words loading.

**If it breaks:** "The button clicked but nothing came back — that's usually one of two things. Either the API key isn't in the `.env` file yet, or the server isn't running. Let me check both. I'll look at the terminal first to see if the server is running, then check the `.env` file to make sure the key is there." Narrate what you are looking at as you diagnose.

---

### Prompt 1.3 — Mark Words as Learned

**Say:** "We've got real words loading. Now I want to add the first piece of interactivity — the ability to mark a word as learned. Notice in this prompt that I'm describing exactly what I will see and click. I'm not using any technical terms like 'toggle state' or 'boolean flag.' I'm describing the user experience."

**Type:**

```
Add the ability for me to mark a word as learned. Here is how it should work:

- Each word card gets a button or a clickable area labeled "Mark as Learned."
- When I click it, the card changes visually — for example, it gets a checkmark, a green background, or a strikethrough on the word — so I can clearly see which words I have already learned.
- If I click it again, the card goes back to its original not-learned state (it toggles).
- The progress indicator at the top of the page (or somewhere clearly visible) should say something like "2 / 5 learned" and update automatically whenever I mark or unmark a card.
```

**While waiting:** This is a focused UI change — about 15 to 30 seconds. Say: "Something I want to highlight in this prompt: I asked for the progress indicator and the card toggle in the same step. These two things belong together. If I add the visual toggle first and the counter second, and the counter shows the wrong number, I won't know if the toggle logic is wrong or the counter logic is wrong. Keeping them together means I test them as a unit."

**Highlight:** When the result appears, click a card's "Mark as Learned" button. Point at the green background and checkmark badge in the top-right corner of the card. Then point at the "X / 5 learned" progress indicator and the green progress bar below it. Click the button again to show it toggles back. Say: "Clean toggle, immediate progress update, clear visual feedback. That's the whole feature working in one click."

**If it breaks:** "The button is there but clicking it isn't changing anything visually. That's usually a JavaScript event listener issue — the button click isn't reaching the toggle function. Let me describe exactly what I see to the agent and ask it to diagnose."

---

### Prompt 1.4 — Save Progress Across Refreshes

**Say:** "Here's a problem I want you to experience. Mark a couple of words as learned right now — go ahead and click them." (Pause, click two cards on screen.) "Now I'm going to refresh the page." (Refresh.) "And — they're gone. We lost our progress. That's what we're fixing in this prompt. And notice how I describe the problem."

**Type:**

```
Right now, if I mark some words as learned and then refresh the page, everything resets. I want my learned status to be saved so it survives a page refresh.

Specifically: when I mark a word as learned, that status should be saved in the browser's built-in storage. When I reload the page, the same words should still show as learned without me having to click anything again. The progress indicator should also reflect the saved state as soon as the page loads.

Note: this saved progress is tied to this browser on this device. That is fine for now — I just do not want it to disappear on every refresh.
```

**While waiting:** About 15 to 30 seconds. Say: "I used the phrase 'browser's built-in storage' instead of 'localStorage.' That's the non-technical description of the same thing. The agent knows what I mean, and more importantly, learners who read this prompt later can understand what it does without needing to know the technical name. I also added the note that this is device-specific — and that's intentional. It sets an accurate expectation. If someone asks 'why doesn't my progress show on my phone?' the answer is right there in the prompt."

**Highlight:** Mark two cards as learned. Refresh the page. Point at the cards that are still green and say: "Same cards, same checkmarks, correct progress count — all restored immediately on load without clicking anything. The browser remembered where we left off." Open the browser's Application tab in DevTools (Chrome: DevTools > Application > Local Storage > localhost:3000) and show the `vocabBuilder_words` and `vocabBuilder_learned` keys. Say: "This is where it lives. The browser's local storage. Nothing on a server, no accounts, no database — just the browser's own memory."

**If it breaks:** "The checkmarks disappeared on refresh — the save isn't working. Let me open DevTools and look at what's actually in local storage after I click 'Mark as Learned.' If the storage is empty, the save step isn't running. If it has data but the cards still reset, the load step isn't reading it correctly. Let me describe that to the agent."

---

### Prompt 1.5 — Debugging Check

**Say:** "Before we move on to Phase 2, I want to do a structured test. This is a habit I want you to build into your workflow: always verify before you version. The prompt I'm about to type describes three specific things that could be broken and how to describe them to the agent. Even if everything is working fine, going through this exercise teaches you what to look for."

**Type:**

```
I am going to test the app now. If anything is not working correctly, here is what I will look for and how I want you to help me fix it:

- If I click "Get New Words" and nothing happens, or I see an error message instead of cards, let me know what might be causing it and fix it.
- If I mark a word as learned, refresh the page, and the checkmark disappears, the save-progress feature is not working — please diagnose and fix it.
- If the progress counter ("X / 5 learned") shows the wrong number, or does not update when I click, fix that too.

Describe what the broken behavior is, what is likely causing it, and what you changed to fix it.
```

**While waiting:** This will be quick if nothing is broken — the agent may simply confirm everything is working and explain how each feature was built defensively. Say: "Notice the structure of this debugging prompt: I describe the symptom I observe, I hint at the likely cause, and I ask for both a fix and an explanation. That 'describe what you changed' part is important — it closes the learning loop. If the agent just fixes something silently, I don't know what was wrong."

**Highlight:** If no bugs are found, say: "The agent is telling us everything looks good — and it's explaining why. It built error handling into the API call, it made localStorage the single source of truth for learned state, and the counter and storage always update together. When things don't break, it's usually because the prompts were specific enough to prevent the mistakes in the first place." Test each behavior on screen: click the button (words load), mark a card (checkmark appears, counter increments), refresh (state restores).

**If it breaks:** "The agent found something. Let me read what it says — specifically, what it says the broken behavior is and what it changed to fix it." Read the explanation aloud and then demonstrate the fixed behavior.

---

### Prompt 1.6 — Save Phase 1 Checkpoint

**Say:** "The app is working. We can fetch words, mark them as learned, watch the progress counter, and refresh the page without losing anything. This is a complete, working version. Before I add anything new, I'm going to do something that will save me a lot of pain later — I'm going to save a checkpoint."

**Type:**

```
The core app is working: I can pick a language, fetch 5 vocabulary words from the AI, mark words as learned, see my progress, and have that progress saved when I refresh. This is a solid first version.

Before we add anything new, let's save this as a checkpoint. Commit everything to version control with a message like "Phase 1 complete — working vocabulary app with AI words and saved progress." That way, if something breaks when we add new features, we can always get back to this working state.
```

**While waiting:** About 10 to 20 seconds for a git commit. Say: "This is the save-before-big-changes habit from Module 1. And I want to be really direct about why this matters: the most common frustration in this course — and in real development — is adding a new feature, something breaks, and you can't get back to where things were working. A version checkpoint is the only reliable safety net. It takes ten seconds. Do it every phase."

**Highlight:** Show the terminal output of the git commit. Point at the commit message. Say: "Notice the message describes what works, not just what changed. 'Working vocabulary app with AI words and saved progress.' When I look back at this in a week, I know exactly what state this version is in."

**If it breaks:** "Git isn't set up yet — no problem. Let me ask the agent to walk me through initializing a repository right now. This is a quick two-step setup and then the commit will work." Stay calm and narrate: "This is actually a common spot where learners realize they haven't set up version control yet. Better to find that out here than in Phase 3."

---

### Prompt 2.1 — Difficulty Filter

**Say:** "Phase 2. We have a working app — let's make it smarter. The first feature is a difficulty filter. I want learners to choose whether they want beginner, intermediate, or advanced vocabulary before they fetch words. Notice in this prompt how I give the agent examples of what each level should feel like."

**Type:**

```
Add a way for me to choose the difficulty of the words before I fetch them. Here is what I want:

- Next to (or below) the language dropdown, add a second selector with three options: "Beginner," "Intermediate," and "Advanced."
- When I click "Get New Words," the app should pass this difficulty level to the AI along with the language, so the words that come back match the level I chose.
- For example, if I choose Spanish + Beginner, I should get very common everyday words. If I choose Japanese + Advanced, I should get more challenging vocabulary.
- The difficulty selector should default to "Beginner" when the page first loads.
```

**While waiting:** This touches both the front-end (a new dropdown) and the server (passing difficulty to the AI prompt). Expect 20 to 40 seconds. Say: "This prompt is actually doing something more interesting than just adding a dropdown. It's changing what we send to the LLM when we call it. The difficulty level gets woven into the AI prompt on the server — the instruction the LLM reads before generating words. That's an example of what the course calls using an LLM as a live feature inside the app. We're not just building with AI, we're shipping AI as part of the product."

**Highlight:** Show the controls panel with both dropdowns now present. Select "Spanish" and "Beginner," click "Get New Words," and point at the words. Then change to "Spanish" and "Advanced" and click again. Point at the new words. Say: "The words are noticeably different — more complex vocabulary, less common phrasing. That change happened because the difficulty label was passed into the AI prompt on the server." If you want to show it, open `server.js` briefly and point at the section where difficulty is included in the prompt text.

**If it breaks:** "The words don't seem any different between Beginner and Advanced. That usually means the difficulty isn't reaching the AI prompt on the server. Let me ask the agent to show me exactly what text it's sending to the AI when I click the button — and then we'll add the difficulty level to that text."

---

### Prompt 2.2 — Look Up a Custom Word

**Say:** "Next feature: a custom word lookup. Instead of waiting for the AI to give me five words, I want to type any word or phrase and ask the AI to explain it. Now, here's a detail I want you to notice in this prompt — it says 'keep it to one AI call per lookup.' That's a cost decision. Watch why."

**Type:**

```
I want to be able to type in any word or phrase myself and ask the AI to explain it. Here is exactly what I need:

- Add a text input box with a button next to it labeled "Look Up."
- When I type a word or phrase and click "Look Up," the app asks the AI to return: the translation into English (or from English into whatever language I have selected), a tip on how to pronounce it, and two example sentences showing the word used in context.
- The result appears on the page, clearly separated from the 5 daily vocabulary cards.
- Keep it to one AI call per lookup — I do not want a separate call for each piece of information.
```

**While waiting:** This adds a new UI section and a new server endpoint (`/api/lookup`). Expect 30 to 45 seconds. Say: "I asked for translation, pronunciation, and examples — three pieces of information — but in a single AI call. If I had asked for those in three separate requests, I'd triple the API cost for every lookup. The 'one call per lookup' instruction is a cost guardrail built directly into the product requirement."

**Highlight:** Find the "Look Up a Word" section that appears between the controls panel and the vocabulary cards. It has a blue-tinted background that visually separates it from the white word cards below. Type "hola" in the input with Spanish selected and click "Look Up." When the result card appears, point at the three pieces of information: the translation label, the pronunciation tip, and the two numbered example sentences. Say: "Three pieces of information, one API call. Clean separation from the vocabulary cards below." Also demonstrate the Enter key shortcut — type a word and press Enter instead of clicking the button.

**If it breaks:** "I typed a word and clicked 'Look Up' but nothing appeared. Let me check two things: first, whether the lookup section is visible at all — if it's not, the HTML might not have updated. Second, I'll look at the network tab in DevTools to see if a request went out to `/api/lookup`. If no request fired, the button isn't connected. If a request fired but failed, the error will tell us why."

---

### Prompt 2.3 — Quiz Mode

**Say:** "Last feature in Phase 2: quiz mode. This lets you hide the translation on each card and test yourself before revealing the answer. One line in this prompt is the most important one — see if you can spot it as I type."

**Type:**

```
Add a quiz mode so I can test myself on the words. Here is how it should work:

- Add a toggle or button labeled "Quiz Mode" somewhere near the top of the word cards area.
- When quiz mode is on, each card hides the English translation. I see only the word in the target language and the example sentence.
- There is a "Reveal" button on each card. When I click it, the translation appears.
- When quiz mode is off, all cards go back to showing the translation normally.
- Quiz mode should not reset my learned/not-learned status — those checkmarks should stay as they are.
```

**While waiting:** About 15 to 30 seconds — this is primarily a CSS toggle. Say: "The line I wanted you to spot: 'Quiz mode should not reset my learned/not-learned status.' That's a protective constraint. It tells the agent that quiz mode is a display layer — it hides and shows information — but it should never touch the underlying progress data. Without that line, an agent might implement quiz mode by re-rendering the cards from scratch, which would wipe the learned state. One sentence prevents an entire category of bug."

**Highlight:** Fetch a set of words. Mark two of them as learned — point at their green checkmarks. Now click the "Quiz Mode" button in the status bar. Point at: the button turning amber and changing its label to "Exit Quiz Mode," each card now showing a "Reveal Translation" button where the English used to be, and — crucially — the two learned cards still showing their green background and checkmark badges. Say: "Quiz mode is on. The translations are hidden. But the learned checkmarks are still there, exactly as we left them. The two systems are completely independent." Click "Reveal Translation" on one card to show the translation reappearing on that card only.

**If it breaks:** "Turning quiz mode on cleared the checkmarks — that's the exact bug the protective constraint was supposed to prevent. The quiz mode and learned state got tangled together. Let me tell the agent specifically what broke: 'When I toggle quiz mode on, the learned checkmarks disappear and the progress counter resets to zero. These two features should be completely independent — fix the quiz mode so it only controls show/hide on translations and does not affect the learned state.'"

---

### Prompt 2.4 — Debugging Check

**Say:** "Same habit as Phase 1: test before we checkpoint. This debugging prompt covers all three new features."

**Type:**

```
Let me test the new features. Help me fix anything that is not behaving correctly:

- If I switch difficulty levels and click "Get New Words" but the words do not seem to change in difficulty, the difficulty is probably not being sent to the AI correctly — please diagnose and fix it.
- If I type a custom word and click "Look Up" but nothing appears, or I get an error, find the cause and fix it.
- If turning quiz mode on causes the learned checkmarks to disappear or resets my progress, fix that so the two features work independently.

Describe what is broken, what is likely causing it, and what you changed.
```

**While waiting:** Quick, about 10 to 15 seconds if no bugs are found. Say: "I want to highlight something about testing after every phase, not just once at the end. Every time you add a new feature, there's a chance it accidentally changed something that was working before. Shared code — like the function that fetches words — can affect multiple features at once. Testing every feature after every phase catches regressions before they pile up."

**Highlight:** Run through all three features quickly on screen: change difficulty and fetch (show words of different complexity), type a word in lookup (show result card), toggle quiz mode on and off while learned cards remain green. Say: "All three new features working, and everything from Phase 1 is still intact. That's a clean Phase 2."

**If it breaks:** Treat each broken feature separately. "The difficulty isn't changing the words. Let me focus on that one first and address the others separately. Focused failure descriptions get faster fixes than a list of everything that's broken." Open a follow-up prompt for that feature alone.

---

### Prompt 2.5 — Save Phase 2 Checkpoint

**Say:** "Phase 2 is done. We have five working features: AI vocabulary cards, learned tracking, progress persistence, difficulty filter, custom lookup, and quiz mode. Time to checkpoint."

**Type:**

```
The new features are working: difficulty filter, custom word lookup, and quiz mode are all functioning alongside the Phase 1 features. Let's save another checkpoint before moving on.

Commit everything to version control with a message like "Phase 2 complete — difficulty filter, custom lookup, and quiz mode added." This keeps a clean restore point in case Phase 3 changes break something.
```

**While waiting:** 10 seconds. Say: "Second checkpoint, same reason as the first. Phase 3 is going to touch the deployment infrastructure — that's a different kind of change than adding features. If something goes wrong in production setup, I want a clean working version of the code I can point to."

**Highlight:** Show the git log with two commits — Phase 1 and Phase 2. Say: "Two commits, two stable points. If Phase 3 breaks something, I can check out Phase 2 and know the code was good. The checkpoint isn't just a backup — it's evidence of progress."

**If it breaks:** "If you haven't committed Phase 1 yet, that's fine — do both commits now in sequence. Git lets you go back and commit things you've been working on. Just add all your files and make the Phase 2 commit. The habit matters more than the timing."

---

### Prompt 3.1 — Prepare the App for Deployment

**Say:** "Phase 3. We're going to ship this. Before we push anything to the internet, I want to run three pre-deployment checks — and I'm going to ask the agent to walk me through each one individually, not all at once. Watch how I structure this."

**Type:**

```
I want to publish this app so anyone can open it at a real web address. Before deploying, help me make sure everything is ready:

- Confirm that the API key is stored as an environment variable and is not visible anywhere in the code a visitor could see in their browser.
- Make sure the app loads cleanly on both a desktop browser and a phone-sized screen.
- If there are any obvious rough edges — like broken spacing, buttons that are too small to tap on a phone, or error states that show no message to the user — fix those now.

Walk me through each of these checks one at a time.
```

**While waiting:** The agent will make several mobile CSS improvements. This may take 30 to 60 seconds. Say: "The phrase 'walk me through each of these checks one at a time' is doing real work. If I just said 'make sure everything is ready,' the agent would silently fix a dozen things and I'd have no idea what changed or why. Asking for sequential checks makes the process auditable — I can verify each one before moving to the next."

**Highlight:** When the agent completes the mobile fixes, demonstrate the mobile check on camera. Use Chrome DevTools: open DevTools, click the device toggle icon (top-left of DevTools), select "iPhone 12 Pro" or similar. Show the app at phone width. Point at: buttons that span the full width of the screen, the language and difficulty dropdowns that don't zoom the page when tapped, and the status row (progress pill and Quiz Mode button) stacking vertically at narrow widths. Say: "All touch targets are large enough to tap, text is readable, nothing overflows. The app is ready for a phone."

**If it breaks:** "One of the mobile checks found an issue — let me focus on just that one. I'll ask the agent to fix only the specific problem it found, and then we'll verify that fix before moving on."

---

### Prompt 3.2 — Set a Spending Limit Before Going Live

**Say:** "Before we deploy, I want to talk about cost. Every time someone clicks 'Get New Words,' the app makes one API call. That call costs a tiny fraction of a cent. But if you share the URL and a lot of people use it, those fractions add up. Here's how I protect myself before the app goes public."

**Type:**

```
Before I deploy, I want to make sure I will not get a surprise bill if people use the app more than I expect.

Help me set a spending limit on my API key so that if the total cost reaches a threshold I choose, no more calls go through until I reset it. Walk me through exactly how to do this in the OpenAI dashboard — I want to see the steps, not just a description. Once the limit is set, confirm that the app still works correctly within that limit.
```

**While waiting:** This prompt requires no code changes — the agent will provide dashboard steps. This is nearly instant. Switch to the OpenAI dashboard tab in your browser and narrate: "I'm going to the OpenAI platform while the agent walks me through the steps."

**Highlight:** Navigate to `platform.openai.com` > Profile > Manage account > Billing > Usage limits. Show the "Hard limit" and "Soft limit" fields on screen. Say: "The hard limit is the ceiling — when the total spend hits this number, OpenAI stops accepting calls from this key until the next billing cycle resets. The soft limit sends me an email warning before I hit the ceiling. I'm going to set a hard limit of five dollars and a soft limit of three dollars." Enter those values on screen and save. Then say: "Here's the math on why five dollars is more than enough: each word fetch uses roughly 200 to 400 tokens, which at gpt-4o-mini pricing is about one hundredth of a cent per fetch. At five dollars, you'd need to click 'Get New Words' thousands of times before hitting the limit. You're protected."

**If it breaks:** "The OpenAI dashboard might look slightly different than what the agent described — the platform updates its UI occasionally. If you can't find 'Usage limits,' look for 'Spend limit' or 'Billing limits' in the Billing section. The concept is the same regardless of the exact label."

---

### Prompt 3.3 — Deploy the App

**Say:** "The limit is set. The code is clean. Let's ship it. I'm going to deploy to Railway — it's a hosting platform that auto-detects Node.js apps and supports environment variables natively. Watch carefully for the environment variable step. This is the step most people miss."

**Type:**

```
Now let's publish the app. I want it accessible at a public web address that I can share with anyone.

Help me deploy it to a free hosting platform (such as Vercel or Netlify). The steps should include:

- How to connect my project to the hosting platform.
- How to set the API key as a protected environment variable on the hosting platform (not in the code).
- How to trigger the deployment and get the public URL.

Walk me through each step. Once it is live, I should be able to open the URL, pick a language, click "Get New Words," and see real vocabulary cards — all without the API key being visible anywhere on the page.
```

**While waiting:** The agent will provide deployment steps. This is guidance, not code — it will be fast. Switch to your browser and narrate the steps as you follow them: navigate to `railway.app`, connect the GitHub repo, and then go to the Variables section.

**Highlight:** The critical moment is adding the environment variable on the hosting platform. Point at the Railway "Variables" panel and say: "This is the step people skip, and it's the step that breaks everything. The API key is in your `.env` file on your computer — but that file isn't pushed to GitHub. It's in `.gitignore` deliberately. So when Railway pulls your code and runs it, there's no `.env` file. You have to tell Railway the key separately, right here in this panel." Add `OPENAI_API_KEY` and your key value on screen. Wait for the automatic redeploy. When the public URL is live, open it and click "Get New Words" to show cards loading from the deployed server.

Then do the security verification on camera: right-click the deployed page > View Page Source > use Ctrl+F to search for part of the API key string. Say: "I'm searching the page source for my API key. Nothing found. The key is on the server. It never reaches the browser."

**If it breaks:** "The deploy succeeded but fetching words fails on the live URL. That's almost always the environment variable. Let me go to Railway, check the Variables panel, and make sure the key is spelled exactly as `OPENAI_API_KEY` — all caps, underscores, no spaces. After confirming, I'll trigger a manual redeploy." Navigate to the health endpoint: `https://your-app.railway.app/health`. Show the JSON response. Say: "This endpoint tells me if the key is set. If `apiKeySet` is false, the variable isn't there."

---

### Prompt 3.4 — Debugging Check (Deployed Environment)

**Say:** "Final debugging check — this time on the live deployed version. The three things I'm looking for are specific to what breaks in production but not locally. Follow along."

**Type:**

```
Let me do a final check on the live deployed version. Help me catch and fix anything that is broken in the deployed environment:

- If fetching words works locally but fails on the deployed site, the API key environment variable is probably not set correctly on the hosting platform — help me find and fix that.
- If the app loads but the cards appear in a broken layout on a phone, fix the layout so it works on small screens.
- If any button clicks produce no visible response at all, diagnose what is failing and fix it.

Describe what is broken, what is likely causing it, and what you changed to fix it.
```

**While waiting:** Quick if everything was set up correctly. Say: "The 'works locally but breaks in production' pattern is one of the most confusing things for non-technical builders. The code is identical. Why does it break? Almost always: something in the environment is different. A missing variable, a different file path, a server that isn't starting correctly. The first place to look is never the code — it's the configuration."

**Highlight:** If nothing is broken, demonstrate the full test on the live URL: select French, click "Get New Words" (cards load), mark a card as learned, refresh (state persists), type a word in lookup (result appears), enable quiz mode (translations hide), exit quiz mode (translations return). Say: "All features working on the deployed URL, learned state persisting in the browser, API key nowhere in the page source. This is a finished, shipped product."

**If it breaks:** "The agent identified the issue. Let me read what it says and follow the steps." Narrate as you fix — especially if it involves the environment variable. "I'm going back to the hosting platform's Variables section. The key wasn't set there. I'm adding it now and triggering a redeploy. This is the single most common deployment mistake and it has a simple fix."

---

### Prompt 3.5 — Final Checkpoint

**Say:** "One last thing. The app is live, it's tested on the deployed URL, the API key is secure, and the spending limit is set. Now I commit the final version."

**Type:**

```
The app is live, deployed, and working correctly at a public URL. Let's do a final save.

Commit the finished, deployed version to version control with a message like "Phase 3 complete — app deployed with environment variable API key and spending limit set." This is the shipped product — a complete, working language learning app built from scratch.
```

**While waiting:** 10 seconds. Say: "Notice the commit message includes two things beyond 'it works': the API key security measure and the spending limit. Those aren't just features — they're operational requirements. A shipped app that works but has an exposed API key is not done. A shipped app with no spending limit is not done. The commit message records that both safeguards are in place."

**Highlight:** Show the git log with three commits — one for each phase. Say: "Three commits, three stable phases. Phase 1: working app with real AI words and saved progress. Phase 2: difficulty filter, custom lookup, quiz mode. Phase 3: deployed with a protected key and spending limit. That's the complete history of this app, built from nothing." Then show the live URL in the browser one final time.

**If it breaks:** "If the commit fails, the most common cause is an accidentally included `.env` file. The `.gitignore` should have prevented that, but if it didn't, I'll ask the agent to check which files are staged and remove any that contain secrets before retrying."

---

## 4. Key Teaching Moments

---

### Teaching Moment 1 — After Prompt 1.2

**Concept:** API key security (Module 3, Video 3.2)

**Say:** "I want to pause here and make sure something is really clear. There are two ways to connect an API. The lazy way is to put the key directly in the front-end code — the JavaScript file that runs in your browser. That file is public. Anyone can open DevTools, look at your JavaScript, find the key, and use it on their own account. You pay for their requests. The second way — what we just built — is to put the key on a server. The browser never talks to OpenAI directly. It talks to our server, which talks to OpenAI, and the key stays on the server the whole time. This is not a nice-to-have. It is the only acceptable way to ship an app that calls a paid API."

---

### Teaching Moment 2 — After Prompt 1.6

**Concept:** Save-before-big-changes versioning habit (Module 1, Video 4)

**Say:** "I'm going to tell you the most common story I hear from learners: they build something that works, add a new feature, something breaks, they can't get back to where it was working, and they feel like they have to start over. That entire situation is preventable with exactly what we just did — a git commit after every working phase. Version control isn't advanced developer stuff. It's just saving your work in a way you can rewind. If Phase 2 breaks something, I have this commit to restore to. That's the only safety net that actually works."

---

### Teaching Moment 3 — After Prompt 2.1

**Concept:** LLM as a live feature inside the app vs. as a build tool (Module 3, Video 3.4)

**Say:** "I want to name something that's easy to miss because you've been doing it all along. This whole time, you've been using Claude Code — an AI — to help you build the app. That's one use of AI: as a tool for building. But what we just shipped is different. The app itself calls an AI at runtime, when you use it. The OpenAI call happens because a real user clicked a button. That's AI as a live feature inside the product. Those are two completely different things. In this course, you've experienced both. Most software tutorials show you only one."

---

### Teaching Moment 4 — After Prompt 3.3

**Concept:** Deployment — setting the environment variable twice (Module 3, Video 3.5)

**Say:** "Here's the single thing that breaks the most deployments. The API key is in your `.env` file on your computer. That file is intentionally not pushed to GitHub — it's in `.gitignore`. So when the hosting platform pulls your code from GitHub, there's no `.env` file. The key doesn't exist on the server. Every API call fails. You have to set the key a second time, directly in the hosting platform's settings. Local machine: set it once. Hosting platform: set it again. Two places, same key. That's not a bug — that's how secure deployment is supposed to work."

---

## 5. Common On-Camera Mistakes

---

**What happened:** The agent hard-codes the API key directly in the JavaScript file.
**What it looks like:** The key appears as a string literal in `index.html` or a `.js` file, such as `const apiKey = "sk-..."`.
**How to handle it:** "Interesting — the agent took a shortcut here that we actually cannot use. The key is visible right in the front-end code. Anyone who opens DevTools would see it. Let me ask the agent to move this to a server-side setup instead — which is the approach we described in the prompt." Send a follow-up: "The API key should not appear in the front-end code at all. Move it to an environment variable on the server and add a proxy endpoint so the browser never sees the key."

---

**What happened:** Clicking "Get New Words" produces a spinning loader that never resolves — the app hangs.
**What it looks like:** The button is grayed out and says "Loading…" but no cards ever appear and no error message shows.
**How to handle it:** "The loader is spinning but nothing came back. That usually means one of two things: the server isn't running, or the API key isn't set. Let me check the terminal first." Check that `node server.js` is running. If it is, check the `.env` file for the key. Narrate both checks aloud. If the key is missing: "There it is — the `.env` file has the placeholder text instead of a real key. Let me add the real key and restart the server."

---

**What happened:** Refreshing the page after marking words as learned resets the progress — localStorage persistence isn't working.
**What it looks like:** Green checkmarks disappear after page refresh and the counter returns to "0 / 5 learned."
**How to handle it:** "The save isn't sticking across refreshes. Let me open DevTools — Application tab — and look at Local Storage for localhost:3000. If it's empty after I click 'Mark as Learned,' the write step isn't running. If it has data but the page still resets, the read step isn't restoring it. Let me describe exactly what I see to the agent and ask it to fix the specific failing step."

---

**What happened:** The app works locally but the deployed version shows an error when fetching words.
**What it looks like:** On the live URL, clicking "Get New Words" shows a red error banner: "The app is not configured correctly."
**How to handle it:** "This is the classic local-works-deployed-fails problem, and I know exactly where to look first. Not the code — the environment variable. Let me go to the hosting platform's Variables section and confirm the API key is there." Navigate on screen. "If it's missing, I add it and trigger a redeploy. If it's there, I'll check the health endpoint to confirm the server can see it." Navigate to `/health` on the deployed URL and show `{"status":"ok","apiKeySet":true}` or `false` as a diagnostic signal.

---

**What happened:** Quiz mode is toggled on and the learned checkmarks disappear from the cards.
**What it looks like:** Cards that had green backgrounds and checkmarks revert to their default white state when "Quiz Mode" is clicked.
**How to handle it:** "The quiz mode toggle cleared the learned state — those two things should be completely independent. Let me send a very specific fix to the agent: 'When I click Quiz Mode, the learned checkmarks disappear. The quiz mode should only hide and show the translation text — it should not affect the learned state or the learnedSet data in any way. Please fix the quiz mode toggle so it only controls display, not progress.'"

---

## 6. Learner Handoff Script

"Alright. You just watched the Vocab Builder go from an empty folder to a live, deployed app with a public URL — in three phases.

Now it's your turn.

Your assessment for this module is to build your own version of the Language Learning App. You'll follow the same three-phase structure: first get the vocabulary cards working with a real OpenAI API call, then add at least one Phase 2 feature — difficulty filter, custom word lookup, or quiz mode — and then deploy it to a public URL.

As you build, keep two things at the front of your mind.

First: the API key never goes in the front-end code. Not temporarily, not 'just to test it.' Set up the server-side proxy from the very beginning, exactly the way we did in Prompt 1.2.

Second: checkpoint after every phase that works. Not just when you think you're done. After Phase 1. After Phase 2. Before deployment. Those commits are your safety net, and without them, the first thing that breaks in Phase 3 becomes very hard to recover from.

You have the prompts in `prompts-learner.md`. You have the finished v3 code to refer to if you get stuck. And you have the debugging prompts for every phase if something doesn't behave the way you expect.

When you're done, you'll have a real language learning app — with your own language choices, your own difficulty settings, deployed at a URL you can share. That's not a course exercise. That's a shipped product. Go build it."

---

*Guide written for Module 3, Vocab Builder — Language Learning App. Covers Videos 3.1–3.5. Corresponds to prompts-learner.md v1.0 and versioned builds v1, v2, v3.*
