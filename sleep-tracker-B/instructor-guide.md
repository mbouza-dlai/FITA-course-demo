# Instructor Guide — Sleep Tracker

## 1. Episode Brief

- **App name:** Sleep Tracker
- **Module:** 2
- **Videos covered:** 2.1, 2.2, 2.3

**What the learner will watch and then do themselves:** The instructor builds a personal sleep-logging app from scratch across three phases — first storing data in the browser's built-in memory (localStorage), then migrating it to a plain text file on the computer, then moving it to a cloud-hosted Supabase database. Each phase introduces a new persistence layer, and the learner watches the same simple app evolve to match more demanding storage requirements. After the demo, learners build their own version of the Sleep Tracker using the same prompts shown on screen.

**The ONE thing the learner must walk away understanding:** Every app needs a place to store data — and the right place depends on how durable, portable, and powerful that storage needs to be. localStorage is fast and free but disappears with the browser. A file outlives the browser but stays on one machine. A database persists everywhere and forever. Choosing the right storage tier is a design decision, not just a technical detail.

---

## 2. Pre-filming Checklist

### Browser and screen setup
- [ ] Set browser zoom to 100%. The app card is centered and readable at this zoom level; zooming in or out will change the layout.
- [ ] Set system font size to default — the app uses system fonts and will reflow unexpectedly if OS accessibility font scaling is on.
- [ ] Use a laptop-width browser window (approximately 1200px wide). Do not film on a maximized 4K monitor — the centered card will look too narrow relative to the empty margins.
- [ ] Set terminal font size to at least 18pt so the text is readable when you share your screen during Phase 2.
- [ ] Clear any existing sleep tracker data from localStorage before filming. In Chrome: DevTools (F12) > Application > Local Storage > right-click > Clear.
- [ ] Open a private/incognito browser window to ensure a clean slate for Phase 1.
- [ ] Have a second browser tab ready with `http://localhost:3000` pre-typed (but not yet loaded) for the Phase 2 transition.
- [ ] Have the Supabase dashboard open and logged in for Phase 3 — specifically the SQL Editor and the Table Editor, so you can show the table filling up as entries are added.

### Files to have open before filming
- [ ] Open `v3/index.html` in the browser first to show the finished app. This is your "show the destination" opening shot. Make sure valid Supabase credentials are already inserted in this file so data loads immediately.
- [ ] Have `v1/index.html`, `v2/` folder, and `v3/index.html` in your file manager or editor, closed but accessible — you will navigate to them during the demo.
- [ ] Open your AI coding tool (Claude Code or Lovable) in a clean session with no prior context.

### Phase 2 server requirements
- [ ] Confirm Node.js is installed: run `node --version` in your terminal. You need version 16 or higher. The v2 app uses `node server.js` with no npm install.
- [ ] Confirm port 3000 is free before filming. Nothing else should be running on port 3000.
- [ ] Navigate your terminal to the `v2/` folder in advance so you only need to type `node server.js` on camera — not a long `cd` command.

### Phase 3 Supabase requirements
- [ ] Create a free Supabase project at supabase.com before filming. It takes 2–3 minutes to provision — do not do this live on camera.
- [ ] Run the table-creation SQL in the Supabase SQL Editor before filming. The exact command is in the comment block at the top of `v3/index.html`. Copy it from there.
- [ ] Copy your Supabase project URL and anon key from Supabase Dashboard > Project Settings > API. Have them ready to paste — do not hunt for them on camera.
- [ ] Insert the real credentials into `v3/index.html` and confirm the app loads data before you start recording. Then re-insert placeholder values (`YOUR_SUPABASE_URL` / `YOUR_SUPABASE_ANON_KEY`) in a separate copy of `v3/index.html` that you will use for the on-camera prompt demo. This way you demonstrate the configuration step authentically without risking a live credential failure.
- [ ] Verify the yellow config-notice banner appears when credentials are placeholders and disappears when they are replaced. You will use this as a teaching moment.

### What to add to the screen before pressing record
- [ ] Finished app (`v3/index.html` with real credentials) open in browser — you will show this first, then switch to the clean AI tool session.
- [ ] AI coding tool open in a clean, blank session.
- [ ] Terminal open and navigated to the `v2/` folder (minimized, ready to bring up for Phase 2).
- [ ] Supabase dashboard open in a separate browser window (minimized, ready to show for Phase 3).

---

## 3. Prompt-by-Prompt Narration Guide

---

### Prompt 1.1 — Initial Build

**Say:** "Let's start from nothing. No code, no files — just us and the AI. The first thing I want to do is give it a clear picture of what we're building. Watch how I describe the app in plain English — like I'm explaining it to a colleague, not a developer."

**Type:**
```
Build me a Sleep Tracker app. Here is what it needs to do:

A person wants to log how long they slept each night and see their history over time. The app should show a simple form at the top of the page with three fields: a date (like "March 15, 2026"), a bedtime (like "11:00 PM"), and a wake time (like "7:30 AM"). When the person clicks a Submit button, the app should automatically figure out how many hours they slept and add the entry to a list below the form.

The list should show every past sleep entry in order from most recent at the top to oldest at the bottom. Each entry in the list should show: the date, the bedtime, the wake time, the number of hours slept (calculated automatically), and a Delete button that removes just that one entry.

The layout should be clean and centered on the page, easy to read on a laptop screen.

Do not add any features beyond what I described — no charts, no averages, no login screens.
```

**While waiting:** (This will take 20–40 seconds.) "Notice what I did in that prompt. I described the problem — someone wants to track their sleep — and then I listed the exact inputs, the exact outputs, and what I don't want. That last sentence — 'do not add any features' — is the scope boundary. Without it, the AI will often add things like charts or user accounts. We'll get there, but on our terms."

**Highlight:**
- Open the generated `index.html` in the browser and point to the three form fields: Date, Bedtime, Wake Time.
- Type `11:00 PM` in the Bedtime field and `7:30 AM` in the Wake Time field. Click "Log Sleep."
- Point to the new entry in the Sleep History list — draw attention to the hours value displayed in purple on the right side.
- **Do not refresh yet.** Save that for Prompt 1.2.

**If it breaks:** "Interesting — looks like the AI gave us something slightly different from what I described. Let's look at what it built and figure out which part doesn't match. Usually the fix is just a more specific follow-up prompt."

---

### Prompt 1.2 — Make Entries Survive a Page Refresh

**Say:** "Now I'm going to do something that will break the app on purpose. Watch this."

- Refresh the page (Cmd+R or F5) with entries visible.
- Let the empty list appear. Pause. Let the learner feel the problem.

"Everything's gone. This is the single most common frustration people have when they build their first web app. The browser just doesn't remember anything by default. Let me ask the AI to fix that — but watch how I phrase it. I describe the problem I observe, not the technical solution."

**Type:**
```
Right now, if I close the tab or refresh the page, all my sleep entries disappear. I need them to still be there when I come back.

Please save every sleep entry in the browser's built-in memory so that closing and reopening the tab does not wipe out my data. When the page loads, it should automatically pull up all the entries I've logged before.
```

**While waiting:** (10–20 seconds.) "I said 'browser's built-in memory' — that's localStorage. Every browser has it. It's a small storage area that lives in the browser and persists between sessions. It requires zero setup, which is why it's the right first tool for this job. The tradeoff? It only lives in this one browser on this one machine."

**Highlight:**
- Add one or two entries, then refresh the page.
- Point to the entries still appearing after the refresh. Say: "Still there."
- Open browser DevTools (F12) > Application tab > Local Storage > your domain. Show the `sleepTrackerEntries` key and its value — a row of JSON with your sleep data. Say: "This is what localStorage looks like under the hood — just text, stored in the browser."
- Close DevTools.

**If it breaks:** "If the entries still disappear after the refresh, the save step probably isn't wiring up correctly. Let me ask the AI to walk me through what it wrote for saving and loading, so I can see where the handoff is going wrong."

---

### Prompt 1.3 — Fix the Delete Button

**Say:** "Let's try the Delete button. I'll click it on one of my entries."

- Click the Delete button on an entry. If it works correctly because the AI already wired it up, skip ahead to Prompt 1.4. If it doesn't work — great, proceed.

"Nothing happened. The entry's still there. Even if I refresh, it'll still come back. This is exactly the kind of bug I want to show you, because it's a great example of how to write a debugging prompt. I'm going to describe what I see — not guess at the cause."

**Type:**
```
When I click the Delete button on one of my entries, nothing happens. The entry stays in the list. Even after I refresh the page, the deleted entry is still there.

Can you look at what's going wrong with the delete behavior and fix it? After it's fixed, clicking Delete should immediately remove that entry from the list and it should not come back after a page refresh.
```

**While waiting:** (15–30 seconds.) "Notice I didn't say 'fix the delete function' or 'there's a bug in the JavaScript.' I just told it what I observe as a user. That's the most useful thing you can give an AI when something's broken — the exact behavior you see, and the exact behavior you expect instead."

**Highlight:**
- Click the Delete button after the fix is applied.
- Show the entry disappearing immediately.
- Refresh the page and confirm the entry is still gone.
- Say: "Deleted from localStorage too — it's not coming back."

**If it breaks:** "If delete still isn't working, I want to know whether the button click is even being registered. Let me ask the AI to add a small visible signal — like changing the button text to 'Clicked!' — so I can confirm the click itself is getting through before we dig deeper."

---

### Prompt 1.4 — Fix the Hours Calculation for Overnight Sleep

**Say:** "Here's a subtle bug I want to make sure we catch before moving on. When someone goes to sleep at 11 PM and wakes up at 7:30 AM, the app needs to understand that the wake time is the next morning — not seven and a half hours earlier the same day. Let me show you what happens without this fix."

- Enter Bedtime: 11:00 PM, Wake Time: 7:30 AM. Submit.
- If the app shows a negative number or 0, show it on screen. If it already shows 8.5, note that and say: "If your app already shows 8.5, that's great — the AI got this right on the first try. But I want to show you what the fix looks like, because this is a common issue. Let me demonstrate the prompt anyway, since the technique matters even when the bug doesn't appear."

**Type:**
```
I entered a bedtime of 11:00 PM and a wake time of 7:30 AM, and the app showed a negative number for hours slept (or zero). It should show 8.5 hours.

The math needs to handle the case where bedtime is before midnight and wake time is after midnight — that's the normal way people sleep. Can you fix the hours calculation so it always gives the right answer for overnight sleep?
```

**While waiting:** (10–20 seconds.) "What makes this prompt work is the concrete test case. I didn't say 'the math is wrong' — I said '11 PM to 7:30 AM should be 8.5 hours.' That's a specific input and a specific expected output. The AI can use that like a unit test. It knows exactly what correct behavior looks like."

**Highlight:**
- After the fix: add an entry with Bedtime 11:00 PM, Wake Time 7:30 AM.
- Point to the hours value on the right side of that entry — it should read "8.5 hrs" in purple.
- Say: "8.5 hours. That's what we expected, and now that's what we get."

**If it breaks:** "If it's still showing the wrong number, I'll ask the AI to walk me through the calculation step by step for 11 PM to 7:30 AM and tell me what value it gets at each step. Once I can see where the math diverges, the fix becomes obvious."

---

### Prompt 1.5 — Save a Checkpoint Before Moving On

**Say:** "Before we add anything new, I want to pause and lock in what we have. This is a habit worth building. The app is working — entries save, delete works, the hours calculate correctly. If I jump straight to the next phase and something breaks, I won't know whether the break came from my new prompt or from something that was already fragile. So I'm going to mark this as a stable stopping point."

**Type:**
```
The basic Sleep Tracker is working. I can log entries, the hours calculate correctly, the list stays after a page refresh, and delete works.

Before we add any new features, I want to save this version as a clean stopping point. Please do not add or change anything — just make sure the current state is solid and tell me it's ready to use as a stable base.
```

**While waiting:** (5–10 seconds. The AI will confirm without making changes.) "This prompt is specifically telling the AI not to change anything. Without that instruction, the AI sometimes takes a 'checkpoint' request as an invitation to tidy up the code or add improvements. We don't want that right now. We want a known-good state we can return to."

**Highlight:**
- Show the AI's confirmation response.
- Point to your working app and say: "This is Phase 1 complete. localStorage gives us persistence inside this browser. Now let's push beyond the browser."

**If it breaks:** "If the AI tries to modify the code anyway, just send it: 'Please do not make any changes. I only need confirmation that the current state is working correctly.' It should comply immediately."

---

### Prompt 2.1 — Move Data Out of the Browser

**Say:** "localStorage is great — zero setup, works everywhere. But it has one fundamental limit. Watch."

- Open the app in a different browser (or private window) or simulate clearing localStorage via DevTools > Application > Local Storage > right-click > Clear.
- Show that the entries list is empty.

"Your data is trapped in one browser. Clear the cache, switch browsers, or open the app on a different computer — it's all gone. For a personal sleep tracker this might be fine, but I want to show you the next step up: storing the data in a file on the computer where the app is running."

**Type:**
```
Right now my sleep data is only saved in this one browser. If I clear my browser's cache, or open the app in a different browser, all my entries are gone.

I want to move the data to a plain text file on the same computer where the app is running, so it's not tied to the browser at all. The app should read entries from that file when it loads and write to that file every time I add or delete an entry. All existing entries should still appear after this change — nothing should be lost.
```

**While waiting:** (30–60 seconds — this is a significant structural change. The AI needs to create a server.) "This prompt introduces a big structural shift. Moving to file storage means the app needs a small server running on your computer — the browser can't write files directly. The AI is going to build that server. I said 'plain text file' instead of 'JSON file' on purpose. Describing the behavior in plain language keeps the scope clear and lets the AI choose the right format."

**Highlight:**
- Show the terminal: `node server.js` starting up. Point to "Server running on port 3000."
- Open `http://localhost:3000` in the browser. Show the app loading.
- Add an entry. Show "Saving..." briefly on the "Log Sleep" button.
- **Bring up a file manager** and navigate to the `v2/` folder. Point to `sleep-data.json`. Open it in a text editor to show the raw JSON — entries stored as readable text.
- Say: "That file is sitting on this computer's disk. It's not in the browser. Clear the browser cache all you want — the data is in that file."
- Stop the server with Ctrl+C, restart with `node server.js`, and reload the page to confirm entries survive.

**If it breaks:** "If the app can't reach the server, we'll see a red error message in the UI that says 'Could not save entry — is the server running?' That's the app's way of telling us the connection failed. Let me check whether the server actually started correctly."

---

### Prompt 2.2 — Show a Weekly Average

**Say:** "Now that data is persisting reliably, let's add a new feature. I want to see how I've been sleeping on average over the last seven nights — right at the top of the list, before I scroll. I'm going to write this as a tight, scoped prompt. Notice how specific I am about the format and the edge case."

**Type:**
```
At the top of the entries list, I'd like to see a single line that says something like "Your average over the last 7 entries: 7.2 hours." If I have fewer than 7 entries, it should average however many I do have.

This number should update automatically whenever I add or delete an entry.
```

**While waiting:** (10–20 seconds.) "I gave the AI the exact display format I want. I handled the edge case — fewer than 7 entries — in the prompt itself. And I told it the update trigger — add or delete. Each of those three details prevents a follow-up debugging prompt. Tight prompts save rounds."

**Highlight:**
- After the fix, show the purple-tinted average banner appearing above the Sleep History list.
- Read the banner aloud: "Your average over the last N entries: X.X hours."
- Add a new entry and point to the average banner updating automatically.
- Delete an entry and show the banner recalculating.
- Say: "It's live — no page refresh needed."

**If it breaks:** "If the banner isn't showing or the number looks wrong, I can break this into two steps: first ask the AI to just display a hardcoded line in the right spot, then ask it to hook that line up to the real calculation. Separating layout from logic makes each piece easier to verify."

---

### Prompt 2.3 — Fix the File Not Saving

**Say:** "This bug comes up a lot when you move to file storage for the first time. New entries appear in the list, but they don't survive a restart. I'm going to show you the symptom, then write a prompt that isolates exactly which part of the system is failing."

- Add an entry. Show it in the list.
- Stop the server (Ctrl+C in terminal). Restart it (`node server.js`). Refresh the browser.
- Show the new entry is missing — older entries are there, but the most recent one is gone.

**Type:**
```
I added a new sleep entry and it appeared in the list, but when I closed the app and opened it again, the new entry was gone. The old entries from before were still there, but nothing I add now is sticking.

Can you figure out why new entries are not being written to the file and fix it? After the fix, everything I add should still be there the next time I open the app.
```

**While waiting:** (15–30 seconds.) "Notice what this prompt does. It doesn't say 'file storage is broken.' It says: old entries survive, new ones don't. That contrast is a diagnostic clue. The bug is in the write path — not the read path, not the whole system. The more precisely you describe where it breaks, the more targeted the fix."

**Highlight:**
- After the fix: add a new entry. Show "Saving..." on the button.
- Stop the server (Ctrl+C). Restart (`node server.js`). Reload the browser.
- Point to the entry still in the list. Say: "Written to disk before the response came back. That's the fix."
- Open `sleep-data.json` in the text editor one more time to show the new entry is actually in the file.

**If it breaks:** "If entries are still disappearing, I want to add a visible breadcrumb. Ask the AI to show a 'Saved to file at [timestamp]' message below the Log Sleep button each time it writes, so I can confirm whether the write is being triggered at all."

---

### Prompt 2.4 — Save a Checkpoint Before Moving On

**Say:** "Same habit as before. We're about to do the most complex migration in this module — moving from a file to a cloud database. If something breaks after that migration, I need to know whether the break came from the migration or was already there. So: checkpoint."

**Type:**
```
The app now saves data to a file, the weekly average is showing correctly, and adding or deleting entries updates both the list and the file.

Before we move to the next phase, I want to lock in this version as a stable base. Do not change anything — just confirm the current state is working correctly and ready to build on.
```

**While waiting:** (5 seconds.) "I specifically listed the three things that should be working. That gives the AI a mini acceptance checklist — and it gives me a way to verify nothing was quietly broken."

**Highlight:**
- Show the AI's confirmation response.
- Point to the working app: weekly average showing, a few entries visible, server running in the terminal.
- Say: "Phase 2 locked. Data survives browser restarts, browser cache clears, and even switching browsers — as long as the server is running. That's a meaningful step up from localStorage. Now let's go one level further."

**If it breaks:** "If the AI tries to make changes, tell it: 'Please do not modify the code. I only want confirmation that the features I listed are working.' Then verify each one manually before proceeding."

---

### Prompt 3.1 — Connect to a Supabase Database

**Say:** "This is the big one. We're moving data from a file on this computer to a database in the cloud. I've already set up a free Supabase project — I'll show you what that looks like in a moment — and I'm going to hand the AI the connection details so it can wire everything up."

- Bring up the Supabase dashboard. Show the project landing page briefly.
- Navigate to Project Settings > API. Point to the Project URL and anon key fields.
- Say: "These two values are all I need to connect my app to the database. I'll paste them into the prompt."

**Type:**
```
I want to move the app's data from the local file to a real hosted database called Supabase, so the data is stored in the cloud and will not be lost if something happens to the computer.

I already have a free Supabase project set up. Here are my connection credentials: [Supabase URL] and [Supabase anon key]. Please update the app so that:

- When the page loads, it reads all sleep entries from the Supabase database
- When I add a new entry, it saves to Supabase
- When I delete an entry, it removes it from Supabase

The weekly average should still work the same way after this change.
```

**While waiting:** (30–60 seconds — significant change. The AI is replacing the server-based architecture with a single HTML file using Supabase's JS client.) "I named the service specifically — Supabase — because the AI needs to know which client library to use. I also replaced the credential placeholders with my actual values before submitting. And I told it explicitly which three operations need to change: read on load, write on add, delete on delete. I didn't say 'add a database' — I described the behavior."

**Highlight:**
- Open the resulting `index.html` directly in the browser. No server needed.
- Show "Loading entries..." briefly appearing below the Log Sleep button, then disappearing.
- Add a new entry. Show "Saving..." on the button, then "Entry saved." in green.
- **Switch to the Supabase dashboard > Table Editor > sleep_entries table.** Refresh it. Show the new entry appearing as a row in the database.
- Say: "That row is in the cloud. It will be there whether I open this browser, a different browser, or even open the app on a different computer."

**If it breaks:** "If entries aren't loading, the most likely issue is the credentials or the table not existing yet. Let me ask the AI to first just confirm it can connect to Supabase and read an empty table — show 'Connected' or 'Connection failed' on screen — before we wire up all three operations."

---

### Prompt 3.2 — Fix the Loading Problem

**Say:** "There's a subtle bug I want to show you — one that's easy to miss until your data grows. Sometimes when you first open the app, a few entries are missing from the list even though you know you added them. The weekly average looks wrong too. Let me walk through the debugging prompt."

**Type:**
```
When I first open the app, the entries list is blank for a moment and then the entries appear. That's fine. But sometimes a few of my entries are missing from the list, even though I know I added them. The weekly average also looks wrong when that happens.

Can you look into why some entries might not be loading from the database and fix it so the full list always loads correctly when the page opens?
```

**While waiting:** (15–30 seconds.) "This prompt does something important — it tells the AI what's expected behavior and what's the real bug. The blank-then-loads behavior is fine — that's just the network round-trip. The missing entries are the bug. Separating those two things keeps the AI from patching the wrong thing."

**Highlight:**
- After the fix: close and reopen the app. Show all entries loading correctly.
- If you have more than a few entries, point out that the count is right and the average looks correct.
- Say: "The fix here was pagination — the database was silently cutting off entries at a certain count. The app now fetches everything in batches until it has the full list."

**If it breaks:** "If entries are still inconsistently loading, I'll ask the AI to display the total number of entries it received from the database at the top of the list — something like 'Loaded 5 entries' — so I can compare that against what I expect and confirm where the shortfall is."

---

### Prompt 3.3 — Add a Simple 7-Day Chart

**Say:** "Last feature. I want a visual — a simple bar chart showing my last 7 nights of sleep. Taller bar means more sleep. But I have a specific constraint here, and I'm going to put it right in the prompt."

**Type:**
```
Below the weekly average line, I'd like to see a simple bar chart showing my sleep duration for the last 7 entries. Each bar should represent one night, labeled with the date, and the height of the bar should show how many hours I slept. Longer sleep = taller bar.

Please build this chart directly without using any outside chart package or library — just draw it on the page using what's already available.
```

**While waiting:** (20–40 seconds.) "That last sentence — 'without any outside chart package' — is load-bearing. Without it, the AI will almost always reach for a charting library. Those libraries are powerful, but they introduce dependencies that are difficult to manage if you're not already comfortable with package management. By asking for a chart built from what's already on the page, I'm keeping this self-contained."

**Highlight:**
- Show the "Last 7 Nights" chart section appearing below the weekly average banner.
- Point to one of the taller bars and read its hours label above it: "9h", for example.
- Point to the date label below the bar: "Mar 15."
- Add a new entry with a very different hours value (e.g., 4 hours) and watch the chart update. Point to the proportionally shorter bar.
- Say: "This is just HTML divs — no library, no dependencies. It runs anywhere."

**If it breaks:** "If the chart doesn't appear or looks wrong, I'll ask the AI to start smaller: show just one bar as a colored rectangle on a white background, labeled with today's date and a hardcoded height. Once that single bar renders correctly, ask it to replicate that for all 7 entries using the real data."

---

### Prompt 3.4 — Save a Final Checkpoint

**Say:** "We're done. Let's close the loop the same way we closed Phases 1 and 2."

**Type:**
```
The app is now saving to Supabase, the chart is showing, and the weekly average is correct. This is the finished version.

Before we close out, please confirm everything is in working order and that the app is in a clean, stable state. Do not add any new features.
```

**While waiting:** (5 seconds.) "This is the third time I've used this checkpoint pattern. I want you to notice that it's become automatic. At the end of every phase, before any new complexity, you stop. You confirm. You name what's working. That discipline is what keeps a build from turning into a pile of accumulated fixes."

**Highlight:**
- Show the AI's final confirmation.
- Walk through the finished app one last time: add an entry, show "Saving...", show the entry appear in the list, show the average banner update, show the chart bar appear.
- Open the Supabase table one more time. Show the row. Say: "In the cloud. Done."

**If it breaks:** "If the AI tries to add or refactor anything, reply with: 'Please do not make any changes. I only want confirmation that the current state is working correctly.' That's it."

---

## 4. Key Teaching Moments

---

### Teaching Moment 1 — Show the pain before the fix

- **After prompt:** Prompt 1.2 (before typing it)
- **Concept:** Data persistence — why the problem exists before presenting the solution
- **Say:** "I want to make something clear about why I refreshed the page before writing that prompt. If I had just told you 'we're going to add localStorage now,' you might nod along without really feeling why it matters. But watching your data disappear — that's the thing that makes persistence click. The same pattern applies when you're building with learners or clients: show the broken state first. Let them feel the friction. Then the fix feels like a relief, not a chore."

---

### Teaching Moment 2 — Choosing the right persistence layer

- **After prompt:** Prompt 2.1 (after highlighting the working file)
- **Concept:** Trade-offs between simplicity (localStorage) and power (database)
- **Say:** "We just made a meaningful jump. localStorage lives in one browser. The file lives on one computer, but it's browser-independent — clear the cache, switch browsers, it doesn't matter. The file is still there. This is the spectrum of persistence: faster and simpler on one end, more durable and more complex on the other. Neither end is wrong. They're right for different situations. A personal note-taking app that never leaves your laptop? localStorage is probably fine. Something you want to access from anywhere, or that multiple people might use? You need to move up the spectrum. The Sleep Tracker is a great illustration because we're walking that entire spectrum in one module."

---

### Teaching Moment 3 — Debugging by describing behavior, not cause

- **After prompt:** Prompt 1.3 (after the delete fix is applied)
- **Concept:** Debugging — describe what you observe, not what you think the code is doing wrong
- **Say:** "I want to pull back on what I did in that delete prompt. I didn't write 'fix the event listener' or 'the delete function isn't calling save.' I wrote what I saw as a user: I clicked the button, nothing happened, I refreshed, it was still there. That's it. When you write a debugging prompt using technical terms, you're making a diagnosis before you have the evidence. And if your diagnosis is wrong, the AI will fix the wrong thing. When you describe observable behavior, you give the AI the full picture and let it find the root cause. That's the better habit."

---

### Teaching Moment 4 — More power means more failure modes

- **After prompt:** Prompt 3.1 (after showing the Supabase table filling up)
- **Concept:** Persistence — Supabase as the third storage tier; understanding that durability requires configuration and introduces new failure modes
- **Say:** "Look at what it took to get here. localStorage: zero setup. A file: you need Node.js running. Supabase: a free account, a project, a table schema, two credential values, and an internet connection. Every step up the durability ladder adds setup steps and adds potential failure points. The app can now fail because the credentials are wrong, because the table doesn't exist, because there's no internet connection, or because the Supabase project is paused. That's not a reason to avoid databases — it's a reason to understand the tradeoffs before you choose. For a solo sleep tracker on your laptop, localStorage might genuinely be the right answer. For anything that needs to survive across devices or multiple users, you need the database. Know what you're buying when you upgrade."

---

## 5. Common On-Camera Mistakes

---

**What happened:** The AI adds features that weren't asked for — a chart appears in Phase 1, or a login screen, or a "streaks" counter.

**What it looks like:** The app loads with elements not covered in the prompt, and the instructor is visibly surprised.

**How to handle it:** Stay calm and curious. Say: "Interesting — the AI added something I didn't ask for. That's actually a great teaching moment. When an AI adds features you didn't request, you have two choices: accept it if it genuinely helps, or correct it if it doesn't. In this case, I want to stay focused on what we're building in this phase. Let me ask it to remove this." Then send a focused correction prompt naming the specific element to remove.

---

**What happened:** The Node.js server doesn't start — port 3000 is already in use, or Node isn't installed.

**What it looks like:** The terminal shows an error like `EADDRINUSE: address already in use :::3000` or `node: command not found`.

**How to handle it:** Say: "This is a common thing you'll run into — something else is already using that port. This is a real-world problem, not a mistake we made. Let me show you how to handle it." Then find and stop the conflicting process, or ask the AI to add a fallback port. Do not restart the recording. This is a legitimate teaching moment about server configuration.

---

**What happened:** The Supabase configuration notice (yellow banner) doesn't disappear after pasting credentials.

**What it looks like:** The yellow amber banner reading "To connect your database, open this file and replace..." stays visible even after credentials are inserted.

**How to handle it:** Say: "The banner is checking whether the placeholder text is still there. If it's still showing, the credential values I pasted probably have an extra space or quote around them. Let me look at the file." Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` for accidental whitespace or wrapping quotes. Fix it and reload. Do not skip past this — show the fix on camera. It models careful configuration behavior.

---

**What happened:** The overnight hours calculation shows a negative number or zero on the first version of the app, and this surprises the instructor during the Prompt 1.1 demo.

**What it looks like:** The instructor types in 11:00 PM bedtime and 7:30 AM wake time, clicks Log Sleep, and the entry shows "-8.5 hrs" or "0 hrs."

**How to handle it:** Stay calm. Say: "There it is — the bug I mentioned. This is the exact test case we're about to fix. This is actually the ideal moment to show why having a concrete test case in your prompt matters so much." Then proceed directly to Prompt 1.4. Do not stop the take.

---

**What happened:** Entries disappear from the Supabase-backed app but the delete confirmation message still shows.

**What it looks like:** The "Deleting..." button state fires and the entry disappears from the list, but when the page is refreshed, the entry comes back.

**How to handle it:** Say: "That's interesting — the entry is disappearing from the UI but coming back on reload, which tells me the delete is happening locally but not reaching the database. Let me show you how I'd describe that in a debugging prompt." Then write a behavior-contrast prompt: "the entry disappears from the list when I click Delete, but it comes back when I reload the page. Can you figure out why the deletion isn't reaching the database?"

---

**What happened:** The AI's checkpoint confirmation (Prompts 1.5, 2.4, 3.4) actually modifies the code — refactors a function, renames a variable, or "cleans up" something.

**What it looks like:** The diff shows changes the instructor didn't ask for.

**How to handle it:** Say: "I specifically asked it not to change anything, and it made changes anyway. This happens. The recovery is simple — I'll just tell it again, more explicitly." Send: "Please undo any changes you just made. I do not want the code modified. I only need you to confirm that the features I described are working." This models the important skill of assertive scope control with an AI.

---

## 6. Learner Handoff Script

"You've just watched the Sleep Tracker go from a blank AI session to a three-phase app that saves data in the cloud. Now it's your turn.

Your assessment project for this module is to build the Sleep Tracker yourself, using the same prompts I used — they're in your course materials. Here's the thing I want you to pay attention to as you build it: every time you reach a checkpoint prompt, stop before you type it. Ask yourself: which storage layer am I on right now? localStorage, a file, or a database? And what would it cost me to go back if the next phase breaks something?

That question — 'what does this storage layer give me, and what does it take away?' — is the core concept of Module 2. When you've built all three phases of the Sleep Tracker and you can answer that question for each one, you've got it.

A couple of things to watch for when you run the prompts yourself. First, the overnight hours calculation: test it with 11 PM bedtime and 7:30 AM wake time before you move past Phase 1. If it shows 8.5 hours, you're good. If it shows anything else, Prompt 1.4 is your fix. Second, when you get to Phase 3 and set up Supabase for the first time, create the `sleep_entries` table in the SQL Editor before you paste your credentials into the app. The table has to exist before the app can write to it.

Good luck. I'll see you in the next module, where we'll add the first real API call to an app — and everything you learned about persistence in this module will carry forward."

---
