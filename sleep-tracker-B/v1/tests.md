# Tests — Sleep Tracker v1

## Setup

Open the file `apps/sleep-tracker/v1/index.html` directly in your browser by double-clicking it or dragging it into a browser window. No server or installation is needed.

---

## Level 1: Cosmetic Checks

- [ ] The page title "Sleep Tracker" appears centered at the top in large, bold text, with a subtitle below it in a lighter color.
- [ ] The form and the Sleep History list are contained inside a single dark card that is centered on the page and does not stretch to the full width of the browser window.
- [ ] The three form fields — Date, Bedtime, and Wake Time — appear side by side in a single row on a laptop-width screen, each with a label above it in small uppercase text.
- [ ] The "Log Sleep" button is full-width across the bottom of the form area and has a purple/violet background color.
- [ ] The "Log Sleep" button changes to a slightly darker purple when you hover your mouse over it.
- [ ] Each sleep entry in the list shows the date in bold on the first line and the bedtime/wake time on a second line in a smaller, muted color.
- [ ] The hours-slept figure for each entry appears right-aligned in the entry row, in the accent purple color, and reads as a number followed by "hrs" (e.g., "8.5 hrs").
- [ ] The Delete button for each entry has a subtle gray border and becomes a red background when you hover over it.
- [ ] A thin horizontal divider line separates the form from the Sleep History section.
- [ ] When there are no entries, the area below the divider shows centered placeholder text saying "No entries yet — log your first night above."
- [ ] The last entry in the list does not have a separator line below it.
- [ ] On a narrow screen (resize your browser window to phone width), the three form fields should stack vertically, one per row, instead of sitting side by side.

---

## Level 2: Functional Tests

### Form behavior

- [ ] Step: Open the app for the first time (or in a private/incognito window with no saved data) → Expected: The Date field is pre-filled with today's date. The Bedtime and Wake Time fields are empty.

- [ ] Step: Click the "Log Sleep" button without filling in any fields → Expected: A red error message appears below the button reading "Please fill in all three fields before submitting." No entry is added to the list.

- [ ] Step: Fill in the Date and Bedtime fields but leave Wake Time blank, then click "Log Sleep" → Expected: The same red error message appears. No entry is added.

- [ ] Step: Fill in all three fields (e.g., Date: any date, Bedtime: 11:00 PM, Wake Time: 7:30 AM) and click "Log Sleep" → Expected: The error message disappears (if it was showing), the new entry appears at the top of the Sleep History list, and the Bedtime and Wake Time fields clear while the Date field retains its value.

### Hours calculation

- [ ] Step: Enter a bedtime of 11:00 PM and a wake time of 7:30 AM for any date, then click "Log Sleep" → Expected: The entry appears in the list showing "8.5 hrs".

- [ ] Step: Enter a bedtime of 10:00 PM and a wake time of 6:00 AM for any date, then click "Log Sleep" → Expected: The entry shows "8 hrs".

- [ ] Step: Enter a bedtime of 1:00 AM and a wake time of 9:00 AM for any date (both times are after midnight on the same day), then click "Log Sleep" → Expected: The entry shows "8 hrs". (The app should still produce the correct result even when both times are in the early morning.)

### List display and ordering

- [ ] Step: Add two entries: one for an earlier date and one for a later date → Expected: The entry with the later date appears above the entry with the earlier date in the Sleep History list.

- [ ] Step: Add three entries and observe the list → Expected: All three entries are visible, each showing its date, bedtime arrow wake time, hours slept, and a Delete button.

- [ ] Step: Enter a bedtime of 11:00 PM and a wake time of 7:30 AM and submit, then look at the entry → Expected: The entry displays the times in 12-hour AM/PM format (e.g., "Bed 11:00 PM → Wake 7:30 AM"), not in 24-hour format.

### Delete

- [ ] Step: Add two entries, then click the "Delete" button on the top (most recent) entry → Expected: That entry immediately disappears from the list. The remaining entry is still visible.

- [ ] Step: Add one entry, click its "Delete" button → Expected: The entry disappears and the placeholder text "No entries yet — log your first night above." reappears.

### Persistence across page refresh

- [ ] Step: Add two or three entries, then refresh the page (press F5 or Cmd+R) → Expected: All previously added entries are still in the list after the page reloads, in the same order.

- [ ] Step: Add an entry, delete it, then refresh the page → Expected: The deleted entry does not reappear after the refresh. The list reflects the state it was in just before the refresh.

- [ ] Step: Add three entries, refresh the page, then add a fourth entry → Expected: All four entries appear in the list, with the newest at the top.

---

## Level 3: Edge Cases

- [ ] Step: Add an entry with a bedtime of 12:00 AM (midnight) and a wake time of 8:00 AM → Expected: The entry shows "8 hrs". (Midnight as bedtime should not produce a negative or incorrect result.)

- [ ] Step: Add an entry where bedtime and wake time are exactly the same time (e.g., both set to 9:00 AM) → Expected: The entry is added and shows "24 hrs" (the app assumes the person slept a full day — this is the logical result of the overnight calculation when times are equal).

- [ ] Step: Click the "Log Sleep" button two times very quickly after filling in valid fields → Expected: Only one entry is added to the list, not two duplicate entries.

- [ ] Step: Add five entries in a row for five different dates → Expected: All five entries appear in the list, ordered from most recent date at the top to oldest at the bottom.

- [ ] Step: Add an entry, refresh the page, then immediately click "Delete" on that entry without adding anything new → Expected: The entry is deleted and the empty-state message returns.

- [ ] Step: Resize the browser window to a very narrow width (like a mobile phone screen) while entries are visible → Expected: The entry rows do not overflow or get cut off — the date, times, hours, and Delete button should all still be readable (they may wrap or adjust layout).

---

## Autonomous Addition Review

No autonomous additions detected in this version.
