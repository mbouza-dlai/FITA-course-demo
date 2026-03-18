# Build Log — Version 3

## Phase: Phase 3 — Deployment

All Phase 1 and Phase 2 features are preserved exactly. This version adds production hardening, mobile polish, and deployment guidance.

---

### Prompt 3.1 — Prepare the App for Deployment

Three checks were performed and addressed:

**Check 1 — API key security**
The API key is stored in `process.env.OPENAI_API_KEY`, loaded from a `.env` file by `dotenv` on the server. The key is never sent to the browser — the front-end only calls `/api/words` and `/api/lookup` on the same origin. A visitor who views page source or opens DevTools will see only requests to those local endpoints; the key is never present in any network response or JavaScript file. The server now also returns a user-friendly error ("The app is not configured correctly. The API key is missing — please contact the site owner.") instead of a technical message if the key is absent, so that deployed-production errors do not leak internal details.

**Check 2 — Mobile layout**
Several mobile-specific fixes were applied:
- All interactive elements (`select`, `input`, buttons) now have `min-height: 44px` — the Apple Human Interface Guidelines minimum touch target size. Previously buttons were sized by padding only, which could produce targets as small as 36px on some phones.
- All `select` and `input` elements use `font-size: 1rem` (16px). iOS Safari triggers an automatic zoom-in when the focused input has `font-size < 16px`, which breaks the layout. This prevents that.
- The "Get New Words" button and "Look Up" button are `width: 100%` on screens narrower than 400px so they do not overflow or get clipped on small phones.
- The status row (progress pill + Quiz Mode button) stacks vertically on narrow screens and goes side-by-side at 500px+. Previously it tried to go side-by-side at all widths, which broke on 320px screens.
- `clamp()` is used for header and card word font sizes so text scales smoothly between mobile and desktop.

**Check 3 — Error states**
All error states surface visible messages to the user without requiring DevTools:
- Main fetch errors appear in the red error banner below the controls.
- Lookup errors appear inline below the lookup input.
- Missing API key produces a clear in-app message.
- A `/health` endpoint was added to `server.js` for uptime monitors.

- **What changed:** Mobile CSS hardening (touch targets, iOS zoom fix, responsive status row), server improvements (CORS headers, input length limit of 200 chars, user-friendly missing-key message, `/health` endpoint), `engines` field in package.json for deployment platform compatibility.
- **Decisions made:** CORS headers were added because some deployment configurations (e.g., separate static hosting + API server) require them. They are permissive (`*`) for a personal learning app where auth is not required.
- **Flags:** ⚠️ **AUTONOMOUS ADDITION** — The `/health` GET endpoint was added to `server.js`. Hosting platforms (Railway, Render, Fly.io) and uptime monitors ping this type of endpoint to verify a server is running. It was not explicitly requested but is a near-universal production requirement and adds no visible UI change.

---

### Prompt 3.2 — Set a Spending Limit Before Going Live

This prompt asks for a walkthrough of the OpenAI dashboard spending limit setup. No code changes are required. The complete instructions are:

**Step-by-step: Setting an OpenAI API spending limit**

1. Go to [platform.openai.com](https://platform.openai.com) and sign in.
2. Click your profile icon (top right) → **"Manage account"**.
3. In the left sidebar, click **"Billing"**.
4. Click **"Usage limits"** (or look for a "Spend limit" section — the label varies slightly by account type).
5. You will see two fields:
   - **"Hard limit"** — when this dollar amount is reached, all API calls from your key are rejected until the next billing period. Set this to your maximum acceptable spend (e.g., $5.00).
   - **"Soft limit"** — OpenAI sends you an email warning when you reach this threshold, but calls continue. Set this lower than the hard limit (e.g., $3.00).
6. Click **"Save"**.

**What happens if the limit is hit:** The OpenAI API returns a `429` or `402` error. The server catches this and returns "The AI service returned an error. Please try again in a moment." — the user sees this in the red error banner. No charges occur beyond the hard limit.

**Cost estimate for this app:** Each "Get New Words" click uses approximately 200–400 tokens (≈ $0.00006–$0.00012 at gpt-4o-mini pricing). Each "Look Up" click is similar. At $5 hard limit, you can handle thousands of requests before hitting the ceiling.

- **Flags:** None. This prompt required guidance, not code.

---

### Prompt 3.3 — Deploy the App

**Recommended deployment: Railway.app** (simplest for Node.js apps with a server)

Railway auto-detects Node.js apps, runs `npm start` automatically, and supports environment variables natively.

**Step-by-step: Deploy to Railway**

1. **Push your code to GitHub** (if not already done):
   ```
   git init
   git add .
   git commit -m "Phase 3 complete — ready to deploy"
   git remote add origin https://github.com/YOUR_USERNAME/vocab-builder.git
   git push -u origin main
   ```
   Make sure `.env` is in `.gitignore` (it already is) — never push the API key.

2. **Create a Railway account** at [railway.app](https://railway.app). Sign in with GitHub.

3. **Create a new project:**
   - Click **"New Project"** → **"Deploy from GitHub repo"**
   - Select your `vocab-builder` repository
   - Railway will detect `package.json` and `npm start` automatically

4. **Add the API key as an environment variable:**
   - In your Railway project, click **"Variables"** (left sidebar)
   - Click **"+ New Variable"**
   - Name: `OPENAI_API_KEY`
   - Value: your actual OpenAI API key (paste it here — it is stored securely and never shown again)
   - Click **"Add"**
   - Railway will automatically redeploy with the new variable

5. **Get the public URL:**
   - Click **"Settings"** → **"Domains"** → **"Generate Domain"**
   - Railway gives you a URL like `https://vocab-builder-production.up.railway.app`
   - Open it in your browser — you should see the Vocab Builder app

6. **Verify the API key is NOT in the page source:**
   - Right-click the deployed page → **"View Page Source"**
   - Search (Ctrl+F) for your API key — it should not appear anywhere
   - Open DevTools → Network tab → click "Get New Words" — the request goes to `/api/words`, not to `api.openai.com`. The OpenAI call happens server-side.

**Alternative: Vercel**
Vercel works best for static sites or Next.js apps. For a Node.js Express server, Railway or Render are simpler choices. If you prefer Vercel, you would need to convert the server endpoints to Vercel Serverless Functions — a more advanced step covered in later courses.

- **Flags:** None. This prompt required guidance, not code.

---

### Prompt 3.4 — Debugging Check (Deployed Environment)

Common issues and their fixes for deployed apps:

**Issue: "Get New Words" works locally but fails on the deployed URL**
- Most likely cause: The `OPENAI_API_KEY` environment variable is not set on the hosting platform.
- Fix: Go to your hosting platform's Variables / Environment Variables section and confirm the key is present and spelled exactly as `OPENAI_API_KEY`. After adding it, trigger a redeploy.
- How to confirm: Visit `https://your-app.railway.app/health` — it returns `{ "status": "ok", "apiKeySet": true }` when the key is present.

**Issue: Cards appear in a broken layout on a phone**
- Most likely cause: Viewport meta tag missing, or fixed-width CSS overflowing small screens.
- Fix: The `<meta name="viewport">` tag is present. All widths use relative units (`flex: 1`, `min-width`, `%`). Buttons stack to full width on screens narrower than 400px. The grid is single-column on mobile.

**Issue: Button clicks produce no visible response**
- Most likely cause: JavaScript error, or the server URL being wrong in the deployed environment.
- Fix: Because the front-end uses relative paths (`/api/words`, `/api/lookup`) rather than `localhost:3000`, the calls correctly point to the deployed server regardless of the domain. If you see a network error, open DevTools → Console and check for any CORS errors — the server now includes CORS headers for exactly this case.

- **What changed:** No code changes needed — all issues were anticipated and addressed in Prompt 3.1.
- **Flags:** None.

---

### Prompt 3.5 — Final Checkpoint

- **What changed:** This version folder (`v3/`) is the final, production-ready checkpoint. The app is fully featured, mobile-polished, and deployment-ready.
- **Flags:** None.

---

## File Structure

```
v3/
  server.js          — Production-hardened Express server (CORS, /health, input limits)
  package.json       — Dependencies + Node.js engine requirement
  .env.example       — API key setup template
  .gitignore         — Excludes .env and node_modules
  public/
    index.html       — Full front-end with all features + mobile polish
  build-log.md       — This file (includes all deployment guidance)
```

## How to Run Locally

```bash
cd v3
npm install
cp .env.example .env
# Edit .env and add your OpenAI API key
node server.js
# Open http://localhost:3000
```

## Deployment Quick Reference

| Platform | Command / Method |
|---|---|
| Railway | Connect GitHub repo, set OPENAI_API_KEY env var, auto-deploys |
| Render | New Web Service → connect repo → set env var → Deploy |
| Fly.io  | `fly launch` → `fly secrets set OPENAI_API_KEY=...` |
| Heroku  | `heroku create` → `heroku config:set OPENAI_API_KEY=...` → `git push heroku main` |
