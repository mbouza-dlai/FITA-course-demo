# Tests — Sleep Tracker v3

## Setup

This version requires a configured Supabase database. Before testing, you must:

1. Open `apps/sleep-tracker/v3/index.html` in a text editor and replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with your real Supabase project credentials.
2. Make sure the `sleep_entries` table has been created in your Supabase project (see the SQL comment inside `index.html` for the exact command).
3. Open the updated `index.html` file directly in your browser by double-clicking it. No server is needed.

Note: If you have not yet replaced the placeholder credentials, the yellow configuration notice at the top of the page will tell you what to do — you can test that state first (see the Autonomous Addition Review section below).

---

## Level 1: Cosmetic Checks

- [ ] The page title "Sleep Tracker" appears centered at the top in large bold text, with a muted subtitle below.
- [ ] The three form fields — Date, Bedtime, Wake Time — appear side by side in a single row on a laptop-width screen, each with a small uppercase label above.
- [ ] The "Log Sleep" button spans the full width of the form and has a purple/violet background.
- [ ] After at least one entry exists, a lightly tinted purple banner appears above the chart and reads "Your average over the last N entries: X.X hours." — the count and average value should be highlighted in the accent purple color.
- [ ] Below the average banner, a section titled "Last 7 Nights" appears with a bar chart. Each bar is purple/violet, taller bars represent more hours slept, and shorter bars represent fewer hours.
- [ ] Each bar in the chart shows a small hours label above it (e.g., "8.5h") and a short date label below it (e.g., "Mar 15").
- [ ] The tallest bar in the chart is visibly taller than all other bars — shorter sleep nights produce proportionally shorter bars.
- [ ] No bar completely disappears — even the shortest sleep duration has a visible (though small) bar.
- [ ] The average banner and bar chart are both hidden when there are zero entries.
- [ ] Entry rows in the Sleep History list show the date bold on the first line and the times in a smaller muted font on the second line, with hours right-aligned in the purple accent color.
- [ ] The Delete button on each entry turns red when hovered.
- [ ] On a narrow screen (resize to phone width), the form fields stack vertically and the chart bars still appear in a row without overflowing.

---

## Level 2: Functional Tests

### Configuration notice (unconfigured state)

- [ ] Step: Open `index.html` without replacing the placeholder credentials → Expected: A yellow/amber banner appears at the top of the page explaining that `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` need to be replaced. The form is still visible below it.

- [ ] Step: After replacing credentials with valid values, reload the page → Expected: The yellow configuration banner is gone. The app loads normally and shows "Loading entries…" briefly, then displays any existing entries.

### Form behavior

- [ ] Step: Open the app with valid credentials → Expected: The Date field is pre-filled with today's date. A status message briefly reads "Loading entries…" in a muted color, then disappears once entries have loaded.

- [ ] Step: Click "Log Sleep" without filling in any fields → Expected: A red error message reads "Please fill in all three fields." No entry is added.

- [ ] Step: Fill in all three fields with valid data and click "Log Sleep" → Expected: The button changes to "Saving…" and is briefly unclickable. After a moment, it returns to "Log Sleep", a green "Entry saved." message appears below it, the new entry appears at the top of the list, and the Bedtime and Wake Time fields clear while the Date field keeps its value.

### Hours calculation

- [ ] Step: Enter a bedtime of 11:00 PM and a wake time of 7:30 AM, then click "Log Sleep" → Expected: The entry in the list shows "8.5 hrs".

- [ ] Step: Enter a bedtime of 10:00 PM and a wake time of 6:00 AM, then click "Log Sleep" → Expected: The entry shows "8 hrs".

### Weekly average banner

- [ ] Step: Add one entry → Expected: The average banner appears and reads "Your average over the last 1 entries: X.X hours." where X.X matches that single entry's hours value.

- [ ] Step: Add enough entries to reach a total of 7 → Expected: The banner reads "Your average over the last 7 entries: X.X hours." correctly reflecting the average of all 7.

- [ ] Step: Add an 8th entry → Expected: The banner still reads "Your average over the last 7 entries: X.X hours." — the number "7" does not change, and the average reflects only the 7 most recent entries.

- [ ] Step: Delete one entry from a list with 7 entries → Expected: The banner immediately updates to show the correct average of the remaining 6 entries.

### Bar chart

- [ ] Step: Add one entry and observe the chart area → Expected: The "Last 7 Nights" section appears with exactly one bar showing the hours label above it and a short date label below (e.g., "Mar 15").

- [ ] Step: Add two entries with very different sleep amounts (e.g., one at 4 hours, one at 9 hours) → Expected: The 9-hour bar is noticeably taller than the 4-hour bar. Both bars are visible with hours and date labels.

- [ ] Step: Add 8 entries → Expected: The chart shows exactly 7 bars (one per night for the 7 most recent entries). The 8th (oldest) entry is not shown in the chart.

- [ ] Step: Add entries on multiple dates, then look at the bar chart → Expected: The bars appear in chronological order left to right — the oldest entry among the 7 is on the left and the most recent is on the right.

- [ ] Step: Delete one entry from a list of 3 → Expected: The bar chart immediately updates and now shows only 2 bars.

### Delete

- [ ] Step: Add two entries, click "Delete" on one → Expected: The Delete button briefly shows "Deleting…" and becomes unclickable, then the entry disappears from the list, and the average and chart both update.

- [ ] Step: Delete all entries → Expected: Once the last entry is deleted, the average banner disappears, the chart disappears, and the empty-state placeholder text "No entries yet — log your first night above." reappears.

### Cloud persistence (Supabase)

- [ ] Step: Add two or three entries, close the browser completely, then reopen the file and reload → Expected: All entries are still in the list — they were saved to Supabase, not the browser.

- [ ] Step: Add an entry in one browser (e.g., Chrome), then open the same `index.html` file in a different browser (e.g., Firefox) on the same computer → Expected: The entry added in Chrome also appears in Firefox, confirming data lives in the cloud and not in any one browser.

- [ ] Step: Add an entry, then delete it, then close and reopen the app → Expected: The deleted entry does not reappear.

---

## Level 3: Edge Cases

- [ ] Step: Click "Log Sleep" twice very quickly after entering valid data → Expected: The button is disabled after the first click, so only one entry is added. No duplicate appears.

- [ ] Step: Add an entry with a bedtime of 12:00 AM (midnight) and a wake time of 8:00 AM → Expected: The entry shows "8 hrs" (not a negative number).

- [ ] Step: Open the app with valid credentials but no internet connection → Expected: A red error message appears reading "Could not load entries — check your Supabase credentials." The form is still visible and usable, but entries cannot be saved or loaded.

- [ ] Step: Add exactly 7 entries, observe the chart, then add one more → Expected: The chart always shows at most 7 bars. After adding the 8th entry, the leftmost (oldest) bar is replaced by the newest one — the chart always shows the 7 most recent nights.

- [ ] Step: Add an entry where bedtime is exactly the same time as wake time (e.g., both 9:00 AM) → Expected: The app adds the entry showing "24 hrs" — this is the mathematical result and the app should not crash or show an error.

- [ ] Step: Resize the browser to mobile phone width with 7 entries and a full chart visible → Expected: The 7 chart bars remain visible in a row and do not overflow or get cut off. Date labels may truncate with "…" on narrow bars, which is acceptable.

- [ ] Step: Add an entry with a bedtime very close to midnight (e.g., 11:55 PM) and a wake time just after midnight (12:05 AM) → Expected: The entry shows "0.2 hrs" (approximately 10 minutes of sleep). This is unusual but the app should handle it without error.

---

## Autonomous Addition Review

- Feature added: Yellow configuration notice banner when Supabase credentials are still placeholders (`YOUR_SUPABASE_URL` / `YOUR_SUPABASE_ANON_KEY`)
- Intended behavior: When the file is opened without replacing the credential constants, a yellow/amber banner appears at the top of the page explaining exactly what to change and where to find the values. The banner disappears once valid credentials are in place.
- Decision needed: Keep. Without this notice, a non-developer user opening the file for the first time would see a blank entries list with no explanation of why the data is not loading — a genuinely confusing and silent failure. This addition is a teaching tool, not a feature. Flag as a teaching moment: discuss how apps that require configuration should communicate their unconfigured state clearly to the user.
