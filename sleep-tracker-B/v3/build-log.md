# Build Log — Version 3

## Phase: Phase 3 — Database and Sleep Chart

### Prompt 3.1 — Connect to a Supabase Database
- **What changed:** Replaced the Node.js file-based server with a single `index.html` that uses the Supabase JS client (loaded from CDN) to read, write, and delete entries in a hosted Supabase table. The app is back to being a single file that opens directly in a browser (no local server needed). Three Supabase operations are used: `.select()` on page load, `.insert()` on form submit, and `.delete().eq('id', ...)` on delete click.
- **Decisions made:** The Supabase JS client v2 is loaded from jsDelivr CDN (`https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js`) to avoid any npm/bundler requirement. Credentials are stored as two constants at the top of the script (`SUPABASE_URL` and `SUPABASE_ANON_KEY`) with clear comments directing the user to replace the placeholder values. A yellow config-notice banner appears in the UI when credentials are still placeholders, so the user immediately knows what to do. The expected table schema is documented in a code comment. Entries are ordered by `created_at DESC` rather than by the date field, so the sort is stable when two entries share the same date.
- **Flags:** ⚠️ **AUTONOMOUS ADDITION** — Added a visible config-notice banner when Supabase credentials are placeholder values. This is necessary for a non-developer audience to understand why the app is not loading data — without it the app would silently fail with no feedback.

### Prompt 3.2 — Fix the Loading Problem
- **What changed:** The root cause is Supabase's default row limit of 1000 rows per request. The fix uses `.select('*', { count: 'exact' })` combined with `.range()` to paginate through all rows until every entry is fetched. The `fetchAllEntries()` function loops until `allRows.length >= count`. For a personal sleep tracker this is unlikely to ever matter in practice, but the fix ensures correctness.
- **Decisions made:** Ordering by `created_at DESC` (a server-assigned timestamp) rather than by user-supplied `date` prevents ambiguous ordering when two entries have the same date. This was already in place from 3.1; the pagination fix is the additional change for this prompt.
- **Flags:** None

### Prompt 3.3 — Add a Simple 7-Day Chart
- **What changed:** Added a bar chart below the weekly average banner that shows up to 7 most-recent sleep entries. Each bar's height is proportional to hours slept relative to the tallest bar in the set. Bars are displayed oldest-to-newest left-to-right. Each bar column shows the hours label above the bar and a short date label ("Mar 15") below it.
- **Decisions made:** Built entirely with HTML `<div>` elements and inline `style="height: Xpx"` — no SVG, no canvas, no chart library. The chart area is fixed at 100px tall in CSS; bar heights are computed in JS as a percentage of that area relative to the max hours value. A minimum bar height of 3px ensures even very short sleep durations are visible. The chart is hidden when there are no entries and re-renders on every add/delete.
- **Flags:** None

### Prompt 3.4 — Save a Final Checkpoint
- **What changed:** No code changes. This is the final checkpoint confirmation. The app at this state: saves to Supabase in the cloud, loads the full entry list with pagination, shows a weekly average that updates on every change, displays a 7-night bar chart, and handles delete correctly. The UI is clean, self-contained in a single HTML file, and requires only a browser and valid Supabase credentials to run.
- **Decisions made:** N/A
- **Flags:** None

---

## How to Run (v3)

1. In Supabase SQL Editor, create the table (see schema comment inside `index.html`).
2. Open `index.html` in your browser directly (no server needed).
3. Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with your project's values from Supabase Dashboard → Project Settings → API.
4. Reload the page — entries will load from your database.
