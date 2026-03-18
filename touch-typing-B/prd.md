# Touch Typing App — Product Requirements Document

## 1. Goal

The app gives users a focused, distraction-free place to practice touch typing and instantly see how fast and accurately they type, without needing to sign up or install anything.

## 2. User

This is a single-user app used alone in a browser tab. There are no accounts, no shared data, and no history carried between sessions. Each visit starts fresh.

## 3. Inputs

- The user's keystrokes as they type the displayed passage

That is the only input. The user does not fill out any forms or configure any settings in the MVP.

## 4. Outputs

- A passage of text displayed on screen, styled character-by-character as the user types (green for correct, red for incorrect)
- A completion screen showing:
  - Words per minute (WPM)
  - Accuracy as a percentage
- A restart button that resets the session

## 5. Core Features (MVP)

1. Display a short, hardcoded passage of text for the user to type.
2. Capture each keystroke and compare it to the correct character in real time.
3. Highlight each typed character green if correct, red if incorrect, as it is typed.
4. Show a completion screen with WPM and accuracy percentage when the user finishes the full passage.
5. Provide a restart button that resets the passage and clears all progress.

## 6. Phase 2 Features

1. Include multiple hardcoded passages the user can choose from before starting.
2. Add a difficulty selector that switches between short, medium, and long passages.
3. Show a live WPM counter on screen that updates while the user is actively typing.
4. Display a congratulations animation or visual flourish when the user completes a passage.
5. Show a keyboard heatmap after completion that highlights which keys were mistyped most often during that session.

## 7. Out of Scope

- **No saving scores or session history.** Storing anything between visits requires browser storage (called localStorage) or a database. Neither is introduced until a later module.
- **No user accounts or leaderboards.** Creating accounts and comparing scores across users requires a database and identity management — both well beyond what this module covers.
- **No fetching passages from the internet.** Pulling text from an external source requires an API call, which is not introduced until a later module. All passages are written directly into the app.
- **No AI-generated passages or feedback.** Using an AI to write custom passages or comment on performance requires an LLM API integration, which belongs in a later module.
- **No data of any kind is saved between sessions.** This is the defining rule of this module. When the user closes the tab, everything resets. Full stop.

## 8. Tech Notes

- **No data is saved anywhere.** This app has no persistence — not in the browser, not in a file, not in a database. Every session starts completely fresh. This is intentional and is the central constraint of this module.
- **No external services are called.** The app makes no API calls. All passages are hardcoded directly in the app's files.
- **All logic runs in the browser.** Character comparison, timing, WPM calculation, and accuracy tracking all happen in the browser on the user's machine. Nothing is sent to a server.
- **WPM is calculated as:** total words typed divided by elapsed time in minutes. A "word" is counted as every 5 characters (the standard typing test convention).
- **Accuracy is calculated as:** correct characters divided by total characters attempted, expressed as a percentage.

## 9. Testing Checklist

1. Open the app. A passage of text should appear on screen, ready to type.
2. Type the first character of the passage correctly. That character should turn green immediately.
3. Type a wrong character. That character should turn red immediately.
4. Type the entire passage from start to finish. A completion screen should appear showing a WPM number and an accuracy percentage.
5. Click the restart button. The passage should reset to its original unstyled state and the timer should start over.
