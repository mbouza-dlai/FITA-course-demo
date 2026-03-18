# Language Learning App — Product Requirements Document

## 1. Goal

The app helps people pick up vocabulary in a new language by using an AI to generate fresh, relevant words and example sentences on demand, so learners always have something new to study without hunting for content themselves.

## 2. User

This is a single-user app used on one device at a time. The learner opens the app in their browser, picks a language they want to practice, and works through vocabulary words at their own pace. Progress is saved on that device, so they can pick up where they left off after closing the browser.

## 3. Inputs

- A target language selected from a fixed dropdown list (for example: Spanish, French, Japanese, German, Portuguese)
- A button click to request a new set of vocabulary words from the AI
- A click on each word card to mark that word as learned

## 4. Outputs

- A set of 5 vocabulary cards, each showing:
  - The word in the target language
  - Its English translation
  - One example sentence using the word in context
- A visual learned/not-learned status on each card, saved so it persists after the page is refreshed
- A progress indicator showing how many of the 5 words have been marked as learned (for example: "3 / 5 learned")

## 5. Core Features (MVP)

1. Display a dropdown that lets the user select a target language from a fixed list.
2. Call an LLM API when the user requests words, and retrieve 5 vocabulary words with translations and example sentences for the chosen language.
3. Display each word as a card showing the word, its translation, and one example sentence.
4. Let the user mark any card as learned with a single click, toggling its visual state.
5. Save each word's learned/not-learned status in the browser's local storage (the browser's built-in memory) so the status survives a page refresh.
6. Show a progress indicator that counts how many words out of 5 have been marked as learned.

## 6. Phase 2 Features

1. Add a difficulty filter so the user can request beginner, intermediate, or advanced vocabulary before fetching words.
2. Let the user type in a custom word or phrase and ask the AI for its translation, a pronunciation tip, and two example sentences.
3. Add a quiz mode that hides the translation on each card until the user clicks to reveal it.

## 7. Out of Scope

- **No user accounts or login screens.** Adding a login system requires a database and back-end session management that is beyond what this course covers.
- **No payment processing or premium tiers.** Gating features behind a paywall is explicitly a signal to bring in a professional developer — it is not a solo-builder task.
- **No shared leaderboards or multi-user features.** Showing one user's progress to another user requires a full database and identity system that is not covered here.
- **No custom-trained or fine-tuned AI model.** The app calls an existing LLM API — it does not build or train its own language model.
- **No API keys stored directly in the front-end code.** The API key must be protected using an environment variable or server-side proxy. Putting a key directly in visible code contradicts the security lesson and is not acceptable.
- **No automatic scheduled delivery of daily words.** Sending words on a schedule requires server infrastructure (like cron jobs) that is not covered in this course. Daily rotation, if added in a future phase, is triggered manually by the user opening the app.

## 8. Tech Notes

- **Persistence:** Learned/not-learned status for each word is saved in the browser's local storage (the browser's built-in memory). This means progress is tied to one browser on one device. Clearing the browser's storage will reset progress.
- **API:** The app calls an LLM API (such as the OpenAI API) to generate vocabulary words, translations, and example sentences. The API is called on demand when the user requests a new set of words — not automatically in the background.
- **API key security:** The API key must never appear in the front-end code that a user can view in their browser. It must be stored as an environment variable and accessed through a server-side layer or proxy before the app is deployed. This is a required step, not optional.
- **Cost awareness:** Each time the user requests a new set of words, one API call is made. To avoid unexpected charges, a spending limit should be set on the API key before the app goes live.
- **Deployment:** The app is intended to be deployed so it is accessible via a public URL. The deployment step must include setting up the environment variable for the API key on the hosting platform.

## 9. Testing Checklist

1. Select a language from the dropdown and click the button to fetch words. Five vocabulary cards should appear, each showing a word, a translation, and an example sentence.
2. Click the fetch button a second time. A new set of 5 cards should load, replacing the previous ones.
3. Mark two of the five cards as learned. Refresh the page. The same two cards should still show as learned — the status should not reset.
4. Mark a learned card again to unmark it. The card should return to its not-learned state and the progress count should decrease.
5. Mark words as learned and watch the progress indicator. It should accurately reflect the current count (for example, "2 / 5 learned" after marking two cards).
6. Open the app with the API key stored as an environment variable. The app should load words successfully without the key appearing anywhere in the page source code a user can inspect.
