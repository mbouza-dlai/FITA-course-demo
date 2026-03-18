# Language Learning App — Prompt Sequences

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

---

### Prompt 1.2 — Connect the AI

Now let's wire up the real AI connection. When I click "Get New Words," I want the app to actually call the OpenAI API and return 5 real vocabulary words for the language I selected, each with a translation and an example sentence.

A few important things:
- The API key must NOT appear anywhere in the page that a visitor could see if they inspected the page source. It needs to be stored as a protected environment variable, not written directly into the visible code.
- Before we go any further, walk me through how to set that up safely in this project.
- Once it is set up, clicking the button should fetch real words and display them on the cards.

---

### Prompt 1.3 — Mark Words as Learned

Add the ability for me to mark a word as learned. Here is how it should work:

- Each word card gets a button or a clickable area labeled "Mark as Learned."
- When I click it, the card changes visually — for example, it gets a checkmark, a green background, or a strikethrough on the word — so I can clearly see which words I have already learned.
- If I click it again, the card goes back to its original not-learned state (it toggles).
- The progress indicator at the top of the page (or somewhere clearly visible) should say something like "2 / 5 learned" and update automatically whenever I mark or unmark a card.

---

### Prompt 1.4 — Save Progress Across Refreshes

Right now, if I mark some words as learned and then refresh the page, everything resets. I want my learned status to be saved so it survives a page refresh.

Specifically: when I mark a word as learned, that status should be saved in the browser's built-in storage. When I reload the page, the same words should still show as learned without me having to click anything again. The progress indicator should also reflect the saved state as soon as the page loads.

Note: this saved progress is tied to this browser on this device. That is fine for now — I just do not want it to disappear on every refresh.

---

### Prompt 1.5 — Debugging Check

I am going to test the app now. If anything is not working correctly, here is what I will look for and how I want you to help me fix it:

- If I click "Get New Words" and nothing happens, or I see an error message instead of cards, let me know what might be causing it and fix it.
- If I mark a word as learned, refresh the page, and the checkmark disappears, the save-progress feature is not working — please diagnose and fix it.
- If the progress counter ("X / 5 learned") shows the wrong number, or does not update when I click, fix that too.

Describe what the broken behavior is, what is likely causing it, and what you changed to fix it.

---

### Prompt 1.6 — Save Phase 1 Checkpoint

The core app is working: I can pick a language, fetch 5 vocabulary words from the AI, mark words as learned, see my progress, and have that progress saved when I refresh. This is a solid first version.

Before we add anything new, let's save this as a checkpoint. Commit everything to version control with a message like "Phase 1 complete — working vocabulary app with AI words and saved progress." That way, if something breaks when we add new features, we can always get back to this working state.

---

## Phase 2 — Richer Learning Tools

### Prompt 2.1 — Difficulty Filter

Add a way for me to choose the difficulty of the words before I fetch them. Here is what I want:

- Next to (or below) the language dropdown, add a second selector with three options: "Beginner," "Intermediate," and "Advanced."
- When I click "Get New Words," the app should pass this difficulty level to the AI along with the language, so the words that come back match the level I chose.
- For example, if I choose Spanish + Beginner, I should get very common everyday words. If I choose Japanese + Advanced, I should get more challenging vocabulary.
- The difficulty selector should default to "Beginner" when the page first loads.

---

### Prompt 2.2 — Look Up a Custom Word

I want to be able to type in any word or phrase myself and ask the AI to explain it. Here is exactly what I need:

- Add a text input box with a button next to it labeled "Look Up."
- When I type a word or phrase and click "Look Up," the app asks the AI to return: the translation into English (or from English into whatever language I have selected), a tip on how to pronounce it, and two example sentences showing the word used in context.
- The result appears on the page, clearly separated from the 5 daily vocabulary cards.
- Keep it to one AI call per lookup — I do not want a separate call for each piece of information.

---

### Prompt 2.3 — Quiz Mode

Add a quiz mode so I can test myself on the words. Here is how it should work:

- Add a toggle or button labeled "Quiz Mode" somewhere near the top of the word cards area.
- When quiz mode is on, each card hides the English translation. I see only the word in the target language and the example sentence.
- There is a "Reveal" button on each card. When I click it, the translation appears.
- When quiz mode is off, all cards go back to showing the translation normally.
- Quiz mode should not reset my learned/not-learned status — those checkmarks should stay as they are.

---

### Prompt 2.4 — Debugging Check

Let me test the new features. Help me fix anything that is not behaving correctly:

- If I switch difficulty levels and click "Get New Words" but the words do not seem to change in difficulty, the difficulty is probably not being sent to the AI correctly — please diagnose and fix it.
- If I type a custom word and click "Look Up" but nothing appears, or I get an error, find the cause and fix it.
- If turning quiz mode on causes the learned checkmarks to disappear or resets my progress, fix that so the two features work independently.

Describe what is broken, what is likely causing it, and what you changed.

---

### Prompt 2.5 — Save Phase 2 Checkpoint

The new features are working: difficulty filter, custom word lookup, and quiz mode are all functioning alongside the Phase 1 features. Let's save another checkpoint before moving on.

Commit everything to version control with a message like "Phase 2 complete — difficulty filter, custom lookup, and quiz mode added." This keeps a clean restore point in case Phase 3 changes break something.

---

## Phase 3 — Deployment

### Prompt 3.1 — Prepare the App for Deployment

I want to publish this app so anyone can open it at a real web address. Before deploying, help me make sure everything is ready:

- Confirm that the API key is stored as an environment variable and is not visible anywhere in the code a visitor could see in their browser.
- Make sure the app loads cleanly on both a desktop browser and a phone-sized screen.
- If there are any obvious rough edges — like broken spacing, buttons that are too small to tap on a phone, or error states that show no message to the user — fix those now.

Walk me through each of these checks one at a time.

---

### Prompt 3.2 — Set a Spending Limit Before Going Live

Before I deploy, I want to make sure I will not get a surprise bill if people use the app more than I expect.

Help me set up a spending limit on my API key so that if the total cost reaches a threshold I choose, no more calls go through until I reset it. Walk me through exactly how to do this in the OpenAI dashboard — I want to see the steps, not just a description. Once the limit is set, confirm that the app still works correctly within that limit.

---

### Prompt 3.3 — Deploy the App

Now let's publish the app. I want it accessible at a public web address that I can share with anyone.

Help me deploy it to a free hosting platform (such as Vercel or Netlify). The steps should include:

- How to connect my project to the hosting platform.
- How to set the API key as a protected environment variable on the hosting platform (not in the code).
- How to trigger the deployment and get the public URL.

Walk me through each step. Once it is live, I should be able to open the URL, pick a language, click "Get New Words," and see real vocabulary cards — all without the API key being visible anywhere on the page.

---

### Prompt 3.4 — Debugging Check

Let me do a final check on the live deployed version. Help me catch and fix anything that is broken in the deployed environment:

- If fetching words works locally but fails on the deployed site, the API key environment variable is probably not set correctly on the hosting platform — help me find and fix that.
- If the app loads but the cards appear in a broken layout on a phone, fix the layout so it works on small screens.
- If any button clicks produce no visible response at all, diagnose what is failing and fix it.

Describe what is broken, what is likely causing it, and what you changed to fix it.

---

### Prompt 3.5 — Final Checkpoint

The app is live, deployed, and working correctly at a public URL. Let's do a final save.

Commit the finished, deployed version to version control with a message like "Phase 3 complete — app deployed with environment variable API key and spending limit set." This is the shipped product — a complete, working language learning app built from scratch.
