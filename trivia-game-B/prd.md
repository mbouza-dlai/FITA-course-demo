# Product Requirements Document — Trivia Game App

## 1. Goal

The app solves the problem of needing a constantly fresh set of trivia questions by pulling them live from a free online trivia database, so the game never feels repetitive and requires no manual question-writing.

## 2. User

This is a single-player game played by one person at a time in their browser. No account or login is needed. The player picks a category and difficulty, plays through a set of questions, sees their score, and can start over immediately.

## 3. Inputs

- A category selection (e.g., Science, History, Sports) chosen before the game starts
- A difficulty level (Easy, Medium, or Hard) chosen before the game starts
- An answer selection — the player clicks one of four multiple-choice options for each question

## 4. Outputs

- A start screen with category and difficulty options
- One trivia question at a time, displayed with four clickable answer choices
- Immediate visual feedback after each answer (correct or incorrect)
- A running score shown during the game
- A results screen at the end showing the final score and a "Play Again" button

## 5. Core Features (MVP)

1. Fetch trivia questions from the Open Trivia Database (opentdb.com), a free public API, using the player's chosen category and difficulty before each game begins.
2. Display one question at a time with four multiple-choice answer options, advancing to the next question after the player selects an answer.
3. Track the player's score during the game, incrementing it for each correct answer, and display the final score on a results screen at the end.
4. Show a start screen that lets the player pick a category and difficulty level before the game begins.
5. Show a results screen at the end of each game with the final score and a button to play again.

## 6. Phase 2 Features

1. Save the player's all-time high score in the browser's local storage (the browser's built-in memory) so it persists between sessions and appears on the start or results screen.
2. Add a countdown timer for each question so the player must answer before time runs out, increasing the challenge.
3. Display a running leaderboard of the player's past scores for the current device, stored in local storage, so they can track improvement over time.
4. Show the correct answer with a brief explanation after the player selects a wrong answer.

## 7. Out of Scope

- **No user accounts or login.** Creating accounts requires a database, which this app does not use. Everyone plays as a guest.
- **No paid trivia APIs.** This app only uses the free Open Trivia Database. Using a paid API service would require billing setup and secret API keys, which are not part of this version.
- **No AI-generated questions or hints.** Using an AI (like a large language model) to write custom questions on the fly is a more advanced integration not covered in this version.
- **No saving question history to a file or database.** Storing detailed game logs would require backend infrastructure that this app does not have.
- **No multiplayer or shared scoreboards.** Playing with or against other people requires user identity and a shared server, both of which are out of scope.
- **No payment processing or premium content.** Gating any part of the game behind a paywall requires payment infrastructure that is explicitly beyond this module's scope.

## 8. Tech Notes

Questions are fetched live from the Open Trivia Database REST API (opentdb.com) each time a new game starts. The app sends a URL request with the player's chosen category and difficulty as parameters and receives a list of questions in JSON format (a structured text format that the app reads automatically).

The player's high score and past scores (Phase 2) are saved in local storage — the browser's built-in memory — so they survive a page refresh or browser close without needing a server or database. No data is sent anywhere; it stays on the player's device.

If the API is temporarily unreachable or returns an error, the app should show a friendly message so the player knows the issue is with the external service, not the app itself.

No backend server, database, or paid services are used.

## 9. Testing Checklist

1. Open the app. The start screen should appear with options to select a category and a difficulty level before any questions are shown.
2. Select a category and difficulty, then start the game. A trivia question with four answer choices should appear, and each choice should be clickable.
3. Answer all questions in a game. The score should increase by one for each correct answer, and a results screen showing the final score should appear after the last question.
4. Click "Play Again" on the results screen and choose a different category and difficulty. A new set of questions matching the new selections should load from the Open Trivia Database.
5. Complete a full game and view the results screen. The final score should be displayed clearly, and the "Play Again" button should return the player to the start screen.
