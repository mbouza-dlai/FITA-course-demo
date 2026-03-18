# Tests — Sleep Tracker v2

## Setup

This version requires a local server. Open a terminal, navigate to the `apps/sleep-tracker/v2/` folder, and run:

```
node server.js
```

Then open your browser and go to `http://localhost:3000`. Keep the terminal window open while testing — the app will not work if the server is stopped.

---

## Level 1: Cosmetic Checks

- [ ] The page title "Sleep Tracker" appears centered at the top in large bold text, with a subtitle below in a muted color.
- [ ] The three form fields — Date, Bedtime, Wake Time — sit side by side in a single row on a laptop-width screen, each with a small uppercase label above it.
- [ ] The "Log Sleep" button spans the full width of the form and has a purple/violet background.
- [ ] After adding at least one entry, a gray/dark banner appears above the list that reads "Your average over the last N entries: X.X hours." — the average number should appear in the accent purple color.
- [ ] The average banner is not visible when there are zero entries in the list.
- [ ] Each entry row shows the date in bold on the first line and the bedtime/wake time in a smaller muted font on the second line.
- [ ] The hours figure for each entry is right-aligned and displayed in the purple accent color (e.g., "8.5 hrs").
- [ ] The Delete button for each entry changes to a red background when hovered.
- [ ] A thin horizontal divider separates the form area from the Sleep History section.
- [ ] When there are no entries, the area below the divider shows centered muted text: "No entries yet — log your first night above."
- [ ] On a narrow screen (resize browser to phone width), the three form fields stack vertically rather than side by side.

---

## Level 2: Functional Tests

### Server connectivity

- [ ] Step: Open the app at `http://localhost:3000` while the server is running → Expected: The page loads normally, the form appears, and any previously saved entries are listed under Sleep History.

- [ ] Step: Stop the server (press Ctrl+C in the terminal), then try to submit a new entry by filling in all three fields and clicking "Log Sleep" → Expected: A red error message appears below the button reading "Could not save entry — is the server running?" No entry is added to the list.

### Form behavior

- [ ] Step: Open the app → Expected: The Date field is pre-filled with today's date. Bedtime and Wake Time fields are empty.

- [ ] Step: Click "Log Sleep" without filling in any fields → Expected: A red error message appears reading "Please fill in all three fields before submitting." No entry is added.

- [ ] Step: Fill in all three fields and click "Log Sleep" → Expected: The button label changes to "Saving…" briefly while the entry is being sent to the server, then reverts to "Log Sleep". The new entry appears at the top of the list. A green status message reading "Entry saved." appears below the button. The Bedtime and Wake Time fields clear; the Date field keeps its value.

- [ ] Step: Immediately after the "Entry saved." message appears, observe the submit button → Expected: The button is re-enabled (returns to normal purple color and is clickable again).

### Hours calculation

- [ ] Step: Enter a bedtime of 11:00 PM and a wake time of 7:30 AM, then click "Log Sleep" → Expected: The entry in the list shows "8.5 hrs".

- [ ] Step: Enter a bedtime of 10:00 PM and a wake time of 6:00 AM, then click "Log Sleep" → Expected: The entry shows "8 hrs".

### Weekly average banner

- [ ] Step: Add one entry → Expected: The average banner appears and reads "Your average over the last 1 entries: X.X hours." where X.X matches the hours of that single entry.

- [ ] Step: Add three entries with different sleep durations (e.g., 7 hrs, 8 hrs, 9 hrs) → Expected: The average banner updates to show the average of all three entries (e.g., "Your average over the last 3 entries: 8 hours.").

- [ ] Step: Add 8 entries one by one → Expected: Once there are 7 or more entries, the banner reads "Your average over the last 7 entries: X.X hours." — it caps at 7 regardless of how many total entries exist.

- [ ] Step: Delete one entry from a list that has exactly 7 entries → Expected: The average banner immediately updates to reflect the new average based on the remaining entries.

### Delete

- [ ] Step: Add two entries, then click "Delete" on one → Expected: The Delete button briefly shows "Deleting…" while the request is sent to the server, then that entry disappears from the list. The remaining entry is still there.

- [ ] Step: Delete all entries one by one until the list is empty → Expected: The average banner disappears once the last entry is deleted. The empty-state placeholder text reappears.

### File persistence

- [ ] Step: Add two or three entries, then stop the server (Ctrl+C in the terminal), restart it (`node server.js`), and refresh the browser at `http://localhost:3000` → Expected: All entries are still in the list exactly as they were before the restart. Nothing is lost.

- [ ] Step: Add an entry, then delete it, then stop and restart the server, then refresh the browser → Expected: The deleted entry does not reappear.

### List ordering

- [ ] Step: Add two entries on different dates → Expected: The most recently added entry appears at the top of the list regardless of the date entered.

---

## Level 3: Edge Cases

- [ ] Step: Fill in all three fields and click "Log Sleep" rapidly two times before the "Saving…" label disappears → Expected: The button is disabled during the save, so the second click does nothing. Only one entry is added to the list.

- [ ] Step: Add an entry, then immediately refresh the browser page (F5 or Cmd+R) before the "Entry saved." message disappears → Expected: The entry is still in the list after the reload, confirming it was written to the file before the refresh.

- [ ] Step: Add an entry with a bedtime of 12:00 AM (midnight) and a wake time of 8:00 AM → Expected: The entry shows "8 hrs" (not a negative number or error).

- [ ] Step: Start the app with zero entries. Observe the weekly average area → Expected: No average banner is visible — only the empty-state message is shown.

- [ ] Step: Add 8 entries, then delete one, then add one more → Expected: The average banner always shows the correct average of the 7 most recent entries (not all 8, not a stale number).

- [ ] Step: Resize the browser to a narrow mobile width and scroll through the entry list → Expected: Entry rows, hours values, and Delete buttons remain visible and do not overflow off the edge of the screen.

- [ ] Step: Open the app in two different browser tabs (both pointing to `http://localhost:3000`), add an entry in Tab 1, then manually refresh Tab 2 → Expected: The entry added in Tab 1 now appears in Tab 2's list (confirming server-side file storage is shared between tabs).

---

## Autonomous Addition Review

- Feature added: Submit button loading state ("Saving…" label and disabled state while POST is in flight)
- Intended behavior: When the user clicks "Log Sleep", the button immediately changes to "Saving…" and becomes unclickable. It returns to "Log Sleep" once the server responds (success or error). This prevents the user from submitting the same entry multiple times while the network request is processing.
- Decision needed: Keep. This is a functional improvement that prevents duplicate entries and gives clear visual feedback in an async context. It is appropriate for the course and does not add a visible feature beyond what the PRD describes. Flag as a teaching moment — instructors can discuss why async operations need loading states.

- Feature added: Delete button loading state ("Deleting…" label and disabled state while DELETE is in flight)
- Intended behavior: When the user clicks "Delete", that specific button changes to "Deleting…" and is disabled until the server confirms the deletion. If the deletion fails, the button returns to its normal state and an error message is shown.
- Decision needed: Keep. Same reasoning as the submit button loading state — prevents double-deletes and gives clear feedback. Good teaching moment for async UX patterns.
