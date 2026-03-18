# Build Log — Version 2

## Phase: Phase 2 — File Storage and Weekly Average

### Prompt 2.1 — Move Data Out of the Browser
- **What changed:** Replaced localStorage with a Node.js HTTP server (`server.js`) that reads and writes `sleep-data.json` on disk. The front-end now uses `fetch()` to call three API endpoints: `GET /entries`, `POST /entries`, and `DELETE /entries/:id`. The server serves `index.html` directly, so the user opens `http://localhost:3000` in their browser.
- **Decisions made:** Used Node's built-in `http` and `fs` modules with zero npm dependencies, so the app starts with `node server.js` — no `npm install` required. Data file is `sleep-data.json` in the same folder as the server, stored as pretty-printed JSON so it's human-readable. If the file does not exist yet, the server creates it on the first write. A clear error message is shown in the UI if the server is not running. The server stores entries newest-first to match the UI sort order — this avoids re-sorting on every read.
- **Flags:** ⚠️ **AUTONOMOUS ADDITION** — Added loading/saving spinner state on the submit button (shows "Saving…" while the POST is in flight) and disabled state on the delete button (shows "Deleting…"). These are standard async UX practices that prevent double-submission; they do not add visible features beyond what the prompt describes.

### Prompt 2.2 — Show a Weekly Average
- **What changed:** Added an `avg-banner` element above the entries list that shows "Your average over the last N entries: X.X hours." The `computeAverage()` function takes the first 7 entries from the array (which is sorted newest-first), sums their `hours` values, and divides by the count. The banner is hidden when there are no entries and recomputes on every add or delete.
- **Decisions made:** The prompt says "last 7 entries" — interpreted as the 7 most recently logged, which matches the top of the newest-first list. If fewer than 7 entries exist, the banner uses the actual count ("Your average over the last 3 entries"). Average is rounded to one decimal place.
- **Flags:** None

### Prompt 2.3 — Fix the File Not Saving
- **What changed:** The root cause of entries not persisting was a bug in the POST handler: it was not calling `writeData()` after prepending the new entry. The fix ensures `writeData(entries)` is called synchronously before sending the `{ ok: true }` response. This guarantees the file is flushed to disk before the client receives confirmation.
- **Decisions made:** Used `fs.writeFileSync` (synchronous write) rather than the async variant to guarantee the write completes before the HTTP response is sent. For a single-user local app this is the safest and simplest approach.
- **Flags:** None

### Prompt 2.4 — Save a Checkpoint Before Moving On
- **What changed:** No code changes. This prompt is a checkpoint confirmation. The app at this state: data is stored in `sleep-data.json` on disk (independent of any browser), the weekly average banner appears and updates correctly, and adding or deleting entries updates both the list and the file immediately.
- **Decisions made:** N/A
- **Flags:** None

---

## How to Run (v2)

1. Open a terminal in this folder (`v2/`)
2. Run: `node server.js`
3. Open your browser to: `http://localhost:3000`

No npm install needed — uses only Node.js built-in modules.
