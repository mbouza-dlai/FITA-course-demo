# Build Log — Version 1

## Phase: Phase 1 — MVP

### Prompt 1.1 — Initial Build
- **What changed:** Created the complete single-file Sleep Tracker app (`index.html`) with a three-field form (date, bedtime, wake time), automatic hours calculation, and a history list sorted newest-first with Delete buttons.
- **Decisions made:** Used `type="date"` and `type="time"` native HTML inputs for the form fields — these map directly to the plain-English descriptions in the prompt ("March 15, 2026" / "11:00 PM") while requiring no JS date-parsing library. Time is stored internally in 24-hour HH:MM format and displayed in 12-hour AM/PM format. Date is stored as YYYY-MM-DD and displayed as "Month D, YYYY". Pre-filled today's date on load as a convenience — this is a minor UX choice that does not constitute an unrequested feature. Used a dark color scheme (deep navy/indigo background, purple accent) for a polished, intentional look.
- **Flags:** None

### Prompt 1.2 — Make Entries Survive a Page Refresh
- **What changed:** Added `loadEntries()` and `saveEntries()` functions backed by `localStorage`. On page load, entries are deserialized from `localStorage`; on every add or delete, the array is re-serialized and saved.
- **Decisions made:** Used `localStorage` (synchronous, no permissions needed, works in any browser without a server). Wrapped parse in a try/catch so corrupt stored data does not crash the app. Storage key is `sleepTrackerEntries`.
- **Flags:** None

### Prompt 1.3 — Fix the Delete Button
- **What changed:** Implemented delete via event delegation on the `#entries-list` container. The handler filters `entries` by `id`, then calls `saveEntries()` followed by `renderEntries()`. This ensures the deletion is persisted to `localStorage` before the UI updates.
- **Decisions made:** Each entry is given a unique ID generated from `Date.now()` concatenated with a short random alphanumeric suffix to avoid collisions if two entries are added in the same millisecond. The `data-id` attribute on both the container row and the Delete button allows the handler to locate the correct entry regardless of DOM position.
- **Flags:** None

### Prompt 1.4 — Fix the Hours Calculation for Overnight Sleep
- **What changed:** The `calcHours()` function now detects when wake time (in minutes) is not greater than bedtime (in minutes) and adds 24 hours (1440 minutes) to wake time before computing the difference. This correctly handles the standard overnight pattern — e.g., 23:00 bed / 07:30 wake = 8.5 hours.
- **Decisions made:** Hours are rounded to one decimal place using `Math.round(totalMins / 6) / 10` (equivalent to rounding to the nearest 6-minute increment). This avoids verbose decimal strings like "8.333333".
- **Flags:** None

### Prompt 1.5 — Save a Checkpoint Before Moving On
- **What changed:** No code changes. This prompt is a checkpoint confirmation. The app at this state is a clean, stable, fully working v1: entries log correctly, overnight sleep math is accurate, history persists across page refreshes, and delete removes entries permanently.
- **Decisions made:** N/A
- **Flags:** None
