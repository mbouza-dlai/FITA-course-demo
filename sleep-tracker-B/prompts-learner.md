## Phase 1 — MVP

### Prompt 1.1 — Initial Build

Build me a Sleep Tracker app. Here is what it needs to do:

A person wants to log how long they slept each night and see their history over time. The app should show a simple form at the top of the page with three fields: a date (like "March 15, 2026"), a bedtime (like "11:00 PM"), and a wake time (like "7:30 AM"). When the person clicks a Submit button, the app should automatically figure out how many hours they slept and add the entry to a list below the form.

The list should show every past sleep entry in order from most recent at the top to oldest at the bottom. Each entry in the list should show: the date, the bedtime, the wake time, the number of hours slept (calculated automatically), and a Delete button that removes just that one entry.

The layout should be clean and centered on the page, easy to read on a laptop screen.

Do not add any features beyond what I described — no charts, no averages, no login screens.

---

### Prompt 1.2 — Make Entries Survive a Page Refresh

Right now, if I close the tab or refresh the page, all my sleep entries disappear. I need them to still be there when I come back.

Please save every sleep entry in the browser's built-in memory so that closing and reopening the tab does not wipe out my data. When the page loads, it should automatically pull up all the entries I've logged before.

---

### Prompt 1.3 — Fix the Delete Button

When I click the Delete button on one of my entries, nothing happens. The entry stays in the list. Even after I refresh the page, the deleted entry is still there.

Can you look at what's going wrong with the delete behavior and fix it? After it's fixed, clicking Delete should immediately remove that entry from the list and it should not come back after a page refresh.

---

### Prompt 1.4 — Fix the Hours Calculation for Overnight Sleep

I entered a bedtime of 11:00 PM and a wake time of 7:30 AM, and the app showed a negative number for hours slept (or zero). It should show 8.5 hours.

The math needs to handle the case where bedtime is before midnight and wake time is after midnight — that's the normal way people sleep. Can you fix the hours calculation so it always gives the right answer for overnight sleep?

---

### Prompt 1.5 — Save a Checkpoint Before Moving On

The basic Sleep Tracker is working. I can log entries, the hours calculate correctly, the list stays after a page refresh, and delete works.

Before we add any new features, I want to save this version as a clean stopping point. Please do not add or change anything — just make sure the current state is solid and tell me it's ready to use as a stable base.

---

## Phase 2 — File Storage and Weekly Average

### Prompt 2.1 — Move Data Out of the Browser

Right now my sleep data is only saved in this one browser. If I clear my browser's cache, or open the app in a different browser, all my entries are gone.

I want to move the data to a plain text file on the same computer where the app is running, so it's not tied to the browser at all. The app should read entries from that file when it loads and write to that file every time I add or delete an entry. All existing entries should still appear after this change — nothing should be lost.

---

### Prompt 2.2 — Show a Weekly Average

At the top of the entries list, I'd like to see a single line that says something like "Your average over the last 7 entries: 7.2 hours." If I have fewer than 7 entries, it should average however many I do have.

This number should update automatically whenever I add or delete an entry.

---

### Prompt 2.3 — Fix the File Not Saving

I added a new sleep entry and it appeared in the list, but when I closed the app and opened it again, the new entry was gone. The old entries from before were still there, but nothing I add now is sticking.

Can you figure out why new entries are not being written to the file and fix it? After the fix, everything I add should still be there the next time I open the app.

---

### Prompt 2.4 — Save a Checkpoint Before Moving On

The app now saves data to a file, the weekly average is showing correctly, and adding or deleting entries updates both the list and the file.

Before we move to the next phase, I want to lock in this version as a stable base. Do not change anything — just confirm the current state is working correctly and ready to build on.

---

## Phase 3 — Database and Sleep Chart

### Prompt 3.1 — Connect to a Supabase Database

I want to move the app's data from the local file to a real hosted database called Supabase, so the data is stored in the cloud and will not be lost if something happens to the computer.

I already have a free Supabase project set up. Here are my connection credentials: [Supabase URL] and [Supabase anon key]. Please update the app so that:

- When the page loads, it reads all sleep entries from the Supabase database
- When I add a new entry, it saves to Supabase
- When I delete an entry, it removes it from Supabase

The weekly average should still work the same way after this change.

---

### Prompt 3.2 — Fix the Loading Problem

When I first open the app, the entries list is blank for a moment and then the entries appear. That's fine. But sometimes a few of my entries are missing from the list, even though I know I added them. The weekly average also looks wrong when that happens.

Can you look into why some entries might not be loading from the database and fix it so the full list always loads correctly when the page opens?

---

### Prompt 3.3 — Add a Simple 7-Day Chart

Below the weekly average line, I'd like to see a simple bar chart showing my sleep duration for the last 7 entries. Each bar should represent one night, labeled with the date, and the height of the bar should show how many hours I slept. Longer sleep = taller bar.

Please build this chart directly without using any outside chart package or library — just draw it on the page using what's already available.

---

### Prompt 3.4 — Save a Final Checkpoint

The app is now saving to Supabase, the chart is showing, and the weekly average is correct. This is the finished version.

Before we close out, please confirm everything is in working order and that the app is in a clean, stable state. Do not add any new features.

---
