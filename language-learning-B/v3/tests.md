# Tests — Vocab Builder v3

## Setup

**Local testing:**
```
npm install
cp .env.example .env
node server.js
```
Then open `http://localhost:3000`. Add your OpenAI API key to `.env` before starting the server.

**Deployed testing:** Open the public URL provided by your hosting platform (e.g. `https://your-app.up.railway.app`). All tests below apply to the deployed URL unless labeled "local only."

> This version is identical in features to v2. The changes in v3 are about production hardening: mobile polish, better error messages, and deployment readiness. Tests in this version specifically verify those improvements alongside full feature coverage.

---

## Level 1: Cosmetic Checks

- [ ] On a phone or with your browser window narrowed to approximately 375 pixels wide, the "Get New Words" button spans the full width of the screen (not squeezed into a corner). It should be easy to tap with a thumb.
- [ ] On a phone, tapping on the language dropdown or difficulty dropdown does not cause the page to zoom in unexpectedly. The page should remain at its normal zoom level after tapping any input.
- [ ] On a phone, all buttons (Get New Words, Look Up, Mark as Learned, Reveal Translation, Quiz Mode) are tall enough to tap comfortably — they should not feel like tiny links.
- [ ] At phone width (below 500 pixels), the progress pill and "Quiz Mode" button stack vertically (one above the other). At wider screen sizes, they appear side by side on the same row.
- [ ] The page header "Vocab Builder" text scales gracefully between phone and desktop — it should be readable on a small screen and not overflow or truncate.
- [ ] The word text on each card scales fluidly between screen sizes — on mobile the word is a bit smaller, on desktop a bit larger, but always readable and not clipped.
- [ ] All Phase 1 and Phase 2 cosmetic checks still apply: cards display correctly, progress bar animates smoothly, lookup result has blue-tinted background, quiz mode uses amber accent color.

---

## Level 2: Functional Tests

All features from v1 and v2 must continue working. Run the complete v1 and v2 functional test suites first. The tests below cover v3-specific production hardening.

**Improved Error Messages**
- [ ] Step: (If testable — requires removing the API key) Stop the server, open `.env`, delete the key value so it reads `OPENAI_API_KEY=`, restart the server, then click "Get New Words" → Expected: A red error banner appears on the page with a user-friendly message such as "The app is not configured correctly. The API key is missing — please contact the site owner." The message does not contain technical details like stack traces or internal server paths.
- [ ] Step: With a valid API key set, click "Get New Words" → Expected: Cards load successfully. The error banner is not visible.

**Health Endpoint (local only)**
- [ ] Step: With the server running locally, open a new browser tab and go to `http://localhost:3000/health` → Expected: The page shows a short JSON response: `{"status":"ok","apiKeySet":true}`. This confirms the server is running and the API key is present. If the API key is missing, `apiKeySet` should read `false`.

**Deployed URL — Core Feature Verification**
- [ ] Step: Open the deployed app URL in your browser → Expected: The page loads with the "Vocab Builder" header, controls panel, and empty state message. No blank screen, no error message, no "cannot GET /" error.
- [ ] Step: On the deployed URL, select a language, click "Get New Words" → Expected: Five vocabulary cards load successfully. The AI is being called from the deployed server, not from your local machine.
- [ ] Step: On the deployed URL, type a word in the lookup field and click "Look Up" → Expected: A result appears with translation, pronunciation tip, and two example sentences. The lookup works the same as it does locally.
- [ ] Step: On the deployed URL, mark a word as learned, then refresh the page → Expected: The learned state is preserved. Progress persists across refreshes on the deployed site exactly as it does locally.
- [ ] Step: On the deployed URL, right-click the page and choose "View Page Source" (or press Ctrl+U / Cmd+U) → Expected: Search the page source for your OpenAI API key string. It must not appear anywhere in the source. The only API references visible are calls to `/api/words` and `/api/lookup` — not to `api.openai.com` directly.

**Mobile Layout on Deployed URL**
- [ ] Step: Open the deployed URL on a real phone (or use browser dev tools to simulate a phone screen) → Expected: The controls panel, lookup section, and word cards all fit within the screen width. Nothing is cut off or requires horizontal scrolling.
- [ ] Step: On the phone view, tap the "Get New Words" button → Expected: The button is easy to tap without hitting adjacent elements. After tapping, the spinner appears and cards load normally.
- [ ] Step: On the phone view, tap the lookup text input → Expected: The iOS/Android keyboard appears and the page does not zoom in (the input font is large enough to prevent auto-zoom).

**All Phase 2 Features Still Working**
- [ ] Step: Select "Advanced" difficulty and click "Get New Words" → Expected: Cards return more complex vocabulary than Beginner mode.
- [ ] Step: Type a word in the lookup field and press Enter → Expected: The lookup fires without clicking the button.
- [ ] Step: Enable quiz mode, reveal a card's translation, then exit quiz mode → Expected: All translations are visible again when quiz mode is off.
- [ ] Step: Mark words as learned while in quiz mode → Expected: Learned state is preserved and quiz mode remains active.

---

## Level 3: Edge Cases

- [ ] Step: On a phone, rotate from portrait to landscape orientation while cards are displayed → Expected: The card grid adjusts to the wider layout (2 columns may appear in landscape). No content is cut off.
- [ ] Step: Type exactly 200 characters into the lookup field (count carefully, or paste a 200-character string) and click "Look Up" → Expected: The lookup succeeds or returns a reasonable AI response — the 200-character limit does not reject this input.
- [ ] Step: On the deployed URL, open two browser tabs simultaneously. In Tab A, mark 3 words as learned. Switch to Tab B and refresh it → Expected: Tab B reflects the learned state saved by Tab A (both tabs share the same browser storage).
- [ ] Step: Click "Get New Words" on the deployed URL while already on a slow mobile connection (turn on airplane mode briefly after clicking) → Expected: The app shows an error message such as "Could not reach the AI service. Check your internet connection." rather than freezing permanently or showing a blank screen. After turning internet back on, the user can try again.
- [ ] Step: Rapidly switch languages in the dropdown and click "Get New Words" multiple times in quick succession → Expected: The button disables after the first click, so only one fetch runs at a time. The final set of cards that loads corresponds to a valid language.
- [ ] Step: With cards visible, attempt to resize the browser window to an extremely narrow width (below 320 pixels) → Expected: The page is usable — content may compress but should not overflow horizontally or become completely unreadable.
- [ ] Step: On the deployed URL, check that quiz mode, learned state, and lookup results all behave identically to the local version → Expected: No features are missing or broken on the deployed site compared to running it on your own computer.

---

## Autonomous Addition Review

**Addition 1 — Enter key shortcut for lookup (inherited from v2)**
- **Feature added:** Pressing Enter in the lookup text field triggers the lookup.
- **Intended behavior:** Same behavior as clicking the "Look Up" button, triggered by the keyboard.
- **Decision needed:** Keep. Standard usability convention for any text input paired with a submit button. No teaching moment needed unless the course wants to discuss keyboard accessibility explicitly.

**Addition 2 — `/health` GET endpoint**
- **Feature added:** A new URL at `/health` (e.g. `http://localhost:3000/health` or `https://your-app.railway.app/health`) that returns `{"status":"ok","apiKeySet":true}`.
- **Intended behavior:** Hosting platforms like Railway and Render can automatically ping this URL to check that the server is running. If the server goes down, they detect it via this endpoint. It is also useful for quickly verifying that your API key is set correctly after deployment.
- **Decision needed:** Keep, and flag as a teaching moment. This is an excellent, concrete example of "production readiness" additions that developers make before deploying. It adds no visible UI change and costs nothing. Consider using it in the Phase 3 lesson to show students what server health checks are and why they exist. The learner can visit `/health` in their browser to confirm deployment is working, which turns an invisible addition into an interactive verification step.
