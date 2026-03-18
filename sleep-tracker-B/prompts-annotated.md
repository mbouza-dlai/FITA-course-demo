## Phase 1 — MVP

### Prompt 1.1 — Initial Build

Build me a Sleep Tracker app. Here is what it needs to do:

A person wants to log how long they slept each night and see their history over time. The app should show a simple form at the top of the page with three fields: a date (like "March 15, 2026"), a bedtime (like "11:00 PM"), and a wake time (like "7:30 AM"). When the person clicks a Submit button, the app should automatically figure out how many hours they slept and add the entry to a list below the form.

The list should show every past sleep entry in order from most recent at the top to oldest at the bottom. Each entry in the list should show: the date, the bedtime, the wake time, the number of hours slept (calculated automatically), and a Delete button that removes just that one entry.

The layout should be clean and centered on the page, easy to read on a laptop screen.

Do not add any features beyond what I described — no charts, no averages, no login screens.

> **Why this prompt works:** This is a mini-PRD in prompt form. It specifies the app goal, the three inputs, the exact outputs per entry, the sort order, the layout intent, and an explicit scope boundary — all in plain language that models the "hand the AI a product brief" behavior taught in Module 1.
> **Concept demonstrated:** PRD / scoping — writing a focused first prompt that gives the AI enough context to produce a usable first draft without over-specifying or under-specifying.
> **Common learner mistake:** Typing something like "Make me a sleep tracker" with no further detail. This produces an unpredictable first draft that may include features the learner did not want (e.g., charts, login, reminders), forcing expensive corrections right from the start.
> **If this fails:** Ask the AI to show you a plain page with just the form and an empty list first, then ask it to add the entry display logic separately.

---

### Prompt 1.2 — Make Entries Survive a Page Refresh

Right now, if I close the tab or refresh the page, all my sleep entries disappear. I need them to still be there when I come back.

Please save every sleep entry in the browser's built-in memory so that closing and reopening the tab does not wipe out my data. When the page loads, it should automatically pull up all the entries I've logged before.

> **Why this prompt works:** This prompt introduces persistence by describing the problem the learner observes (entries disappear on refresh) before stating the desired behavior — mirroring the instructor's talking point of "show the pain before introducing the fix." The phrase "browser's built-in memory" is a plain-language stand-in for localStorage.
> **Concept demonstrated:** Persistence — localStorage as the first and simplest storage layer; data surviving a browser session.
> **Common learner mistake:** Writing "add a database" or "add local storage" without describing the observable problem. This skips the diagnostic step and may prompt the AI to introduce a more complex storage solution than necessary at this stage.
> **If this fails:** Ask the AI to show you what it wrote to handle saving and loading — then ask it to log to the console what it finds in the browser's memory when the page loads, so you can see whether saving is working.

---

### Prompt 1.3 — Fix the Delete Button

When I click the Delete button on one of my entries, nothing happens. The entry stays in the list. Even after I refresh the page, the deleted entry is still there.

Can you look at what's going wrong with the delete behavior and fix it? After it's fixed, clicking Delete should immediately remove that entry from the list and it should not come back after a page refresh.

> **Why this prompt works:** This is a behavior-first debugging prompt. It describes exactly what the learner sees (nothing happens, entry stays, entry survives refresh) and the expected outcome, without guessing at the cause. This models the debugging behavior from Module 1 Video 5: describe the symptom, not the diagnosis.
> **Concept demonstrated:** Debugging — reporting broken behavior by describing what the user observes rather than attempting to identify a code-level cause.
> **Common learner mistake:** Writing "fix the delete function" — this assumes the learner knows which part of the code is responsible and names it using a technical term. Behavior-based descriptions give the AI more useful diagnostic context than guessed root causes.
> **If this fails:** Ask the AI to add a visible signal (like changing the button text to "Deleting…") when you click Delete so you can confirm whether the click itself is being registered.

---

### Prompt 1.4 — Fix the Hours Calculation for Overnight Sleep

I entered a bedtime of 11:00 PM and a wake time of 7:30 AM, and the app showed a negative number for hours slept (or zero). It should show 8.5 hours.

The math needs to handle the case where bedtime is before midnight and wake time is after midnight — that's the normal way people sleep. Can you fix the hours calculation so it always gives the right answer for overnight sleep?

> **Why this prompt works:** This prompt uses a specific concrete test case (11:00 PM to 7:30 AM = 8.5 hours) drawn directly from the PRD's testing checklist. Specific examples give the AI a verifiable acceptance criterion, which produces a more precise fix than a vague complaint like "the math is wrong."
> **Concept demonstrated:** Iteration / debugging — using a concrete example as a test case to communicate the exact behavior that needs to change.
> **Common learner mistake:** Writing "the hours calculation is broken, please fix it" without a specific example. Without the test case, the AI may patch only one of several edge cases and the learner has no way to verify the fix is complete.
> **If this fails:** Ask the AI to walk through the calculation step by step for 11:00 PM to 7:30 AM and show you what number it gets at each step, so you can see where the logic goes wrong.

---

### Prompt 1.5 — Save a Checkpoint Before Moving On

The basic Sleep Tracker is working. I can log entries, the hours calculate correctly, the list stays after a page refresh, and delete works.

Before we add any new features, I want to save this version as a clean stopping point. Please do not add or change anything — just make sure the current state is solid and tell me it's ready to use as a stable base.

> **Why this prompt works:** This prompt models the versioning checkpoint behavior taught in the course — explicitly pausing before adding features to lock in a known-good state. It also reinforces scope discipline by explicitly telling the AI not to change anything.
> **Concept demonstrated:** Versioning — treating a working MVP as a named checkpoint before layering additional features, which protects against regressions and provides a recovery point.
> **Common learner mistake:** Moving directly from a working MVP to Phase 2 features in a single prompt. If the Phase 2 prompt causes a regression, the learner has no clean state to roll back to and cannot tell whether the breakage came from the migration or from an existing bug.
> **If this fails:** If the AI tries to add features or refactor code, repeat the prompt with added emphasis: "Do not make any changes to the app. I just want you to confirm it is working as described."

---

## Phase 2 — File Storage and Weekly Average

### Prompt 2.1 — Move Data Out of the Browser

Right now my sleep data is only saved in this one browser. If I clear my browser's cache, or open the app in a different browser, all my entries are gone.

I want to move the data to a plain text file on the same computer where the app is running, so it's not tied to the browser at all. The app should read entries from that file when it loads and write to that file every time I add or delete an entry. All existing entries should still appear after this change — nothing should be lost.

> **Why this prompt works:** This prompt describes the limitation of localStorage in observable behavioral terms (clearing the cache wipes data, other browsers can't see it) before asking for the migration — again modeling the "feel the pain before the fix" teaching pattern. The phrase "plain text file on the same computer" is a non-technical description of a JSON file.
> **Concept demonstrated:** Persistence trade-offs — moving from localStorage to a file-based storage layer; understanding why each option exists and what it costs.
> **Common learner mistake:** Asking to "switch to a database" when they mean a JSON file. This is a jargon jump that skips the middle tier and lands on a more complex solution than is appropriate for this phase. The behavioral framing ("not tied to the browser") keeps the scope correct.
> **If this fails:** Ask the AI to first show you where it intends to create the file and what the file will look like before making any changes to the rest of the app.

---

### Prompt 2.2 — Show a Weekly Average

At the top of the entries list, I'd like to see a single line that says something like "Your average over the last 7 entries: 7.2 hours." If I have fewer than 7 entries, it should average however many I do have.

This number should update automatically whenever I add or delete an entry.

> **Why this prompt works:** This is a tightly scoped, single-feature prompt. It specifies the display format, the calculation window (last 7 entries), the fallback behavior for fewer than 7 entries, and the update trigger — all in one short paragraph with no technical terms.
> **Concept demonstrated:** Iteration — adding one feature at a time to a stable base, with a precise description of both the happy path and the edge case.
> **Common learner mistake:** Asking for a "statistics panel" or a "summary section." These open-ended terms invite the AI to add multiple features at once (average, median, best night, worst night), blowing past the scope of this prompt and making it harder to debug if something goes wrong.
> **If this fails:** Ask the AI to first just display a hardcoded line ("Your average: 7.0 hours") in the right spot on the page, then separately hook it up to the real calculation.

---

### Prompt 2.3 — Fix the File Not Saving

I added a new sleep entry and it appeared in the list, but when I closed the app and opened it again, the new entry was gone. The old entries from before were still there, but nothing I add now is sticking.

Can you figure out why new entries are not being written to the file and fix it? After the fix, everything I add should still be there the next time I open the app.

> **Why this prompt works:** This debugging prompt isolates the symptom precisely — old data persists but new writes do not — which narrows the AI's search space to the write path rather than the entire storage system. The contrast between what works (old entries survive) and what does not (new entries vanish) is a strong diagnostic signal.
> **Concept demonstrated:** Debugging — using contrast between working and broken behavior to give the AI a precise diagnostic starting point, rather than reporting a generic "it's broken."
> **Common learner mistake:** Writing "the file isn't working, please fix it." This gives the AI no signal about which part of the file operation is failing and often leads to a complete rewrite rather than a targeted fix.
> **If this fails:** Ask the AI to add a visible message to the page each time it writes to the file (e.g., "Saved!" with a timestamp) so you can confirm whether the write is being triggered when you submit an entry.

---

### Prompt 2.4 — Save a Checkpoint Before Moving On

The app now saves data to a file, the weekly average is showing correctly, and adding or deleting entries updates both the list and the file.

Before we move to the next phase, I want to lock in this version as a stable base. Do not change anything — just confirm the current state is working correctly and ready to build on.

> **Why this prompt works:** This is the Phase 2 versioning checkpoint, following the same pattern established in Prompt 1.5. It explicitly lists the features that should be working, giving the AI a concise acceptance checklist, and again instructs it not to make changes.
> **Concept demonstrated:** Versioning — creating a named stable state before a major storage migration (localStorage → file → database), which is the riskiest type of change in this module.
> **Common learner mistake:** Skipping the checkpoint and immediately asking for the Supabase migration. If the migration breaks the weekly average or the list order, the learner cannot tell whether the bug came from the migration or was already present before it.
> **If this fails:** Ask the AI to run through the testing checklist from the PRD (log an entry, refresh, delete an entry, check the average) and report the result of each check before you proceed.

---

## Phase 3 — Database and Sleep Chart

### Prompt 3.1 — Connect to a Supabase Database

I want to move the app's data from the local file to a real hosted database called Supabase, so the data is stored in the cloud and will not be lost if something happens to the computer.

I already have a free Supabase project set up. Here are my connection credentials: [Supabase URL] and [Supabase anon key]. Please update the app so that:

- When the page loads, it reads all sleep entries from the Supabase database
- When I add a new entry, it saves to Supabase
- When I delete an entry, it removes it from Supabase

The weekly average should still work the same way after this change.

> **Why this prompt works:** This prompt names the service (Supabase) because the learner actually needs to know what they're connecting to, and it specifies exactly the three operations that need to change (read on load, write on add, delete on delete). The credential placeholders signal to learners that they need to supply real values, which models the "configure before you build" habit for database work.
> **Concept demonstrated:** Persistence — Supabase as the third storage tier; understanding that more durability requires more configuration and introduces new failure modes.
> **Common learner mistake:** Asking to "add a database" without specifying which service or providing credentials. The AI will either choose a local database solution or produce code that cannot connect to anything, leaving the learner stuck at the configuration step.
> **If this fails:** Ask the AI to first confirm it can connect to Supabase and read an empty table — just show "Connected" or "Connection failed" on the page — before wiring up all three operations.

---

### Prompt 3.2 — Fix the Loading Problem

When I first open the app, the entries list is blank for a moment and then the entries appear. That's fine. But sometimes a few of my entries are missing from the list, even though I know I added them. The weekly average also looks wrong when that happens.

Can you look into why some entries might not be loading from the database and fix it so the full list always loads correctly when the page opens?

> **Why this prompt works:** This debugging prompt distinguishes between expected behavior (brief blank state while loading) and the actual bug (some entries consistently missing), which prevents the AI from "fixing" the loading delay instead of the real problem. It also names a second symptom (wrong average) that confirms the root cause is in the data fetch, not the display logic.
> **Concept demonstrated:** Debugging — distinguishing expected behavior from actual bugs when working with asynchronous data loading, and using multiple symptoms to triangulate the root cause.
> **Common learner mistake:** Reporting "the list doesn't load" when the entries are actually there after a moment — this causes the AI to add unnecessary loading spinners or rewrite the fetch logic rather than investigate the actual missing-data bug.
> **If this fails:** Ask the AI to display the total number of entries it received from the database at the top of the list ("Loaded 5 entries") so you can compare it against the number you expect and confirm where the count is going wrong.

---

### Prompt 3.3 — Add a Simple 7-Day Chart

Below the weekly average line, I'd like to see a simple bar chart showing my sleep duration for the last 7 entries. Each bar should represent one night, labeled with the date, and the height of the bar should show how many hours I slept. Longer sleep = taller bar.

Please build this chart directly without using any outside chart package or library — just draw it on the page using what's already available.

> **Why this prompt works:** This prompt includes a critical scope constraint ("without using any outside chart package or library") that prevents the AI from importing a third-party charting dependency. This constraint is drawn directly from the PRD's out-of-scope list and from the learning-spec's scope warnings. The visual description (height = hours, label = date) is enough for the AI to produce a usable result.
> **Concept demonstrated:** Scoping — explicitly preventing scope creep by naming the constraint in the prompt, and using plain visual language to describe the desired output rather than technical charting terminology.
> **Common learner mistake:** Asking for "a chart" with no further description and no constraint. The AI frequently reaches for a popular charting library by default, which introduces a dependency the learner does not know how to manage and can break when the library version does not match the project setup.
> **If this fails:** Ask the AI to first show just one bar as a colored rectangle on a white background, labeled with today's date and a hardcoded height — then ask it to replicate that for the last 7 entries using the real data.

---

### Prompt 3.4 — Save a Final Checkpoint

The app is now saving to Supabase, the chart is showing, and the weekly average is correct. This is the finished version.

Before we close out, please confirm everything is in working order and that the app is in a clean, stable state. Do not add any new features.

> **Why this prompt works:** This final versioning prompt closes the build loop and reinforces the checkpoint habit at the end of the last phase. Listing the three features that should be working ("saving to Supabase, the chart is showing, the weekly average is correct") serves as a completion checklist and signals to the learner that the app is genuinely done rather than perpetually in progress.
> **Concept demonstrated:** Versioning — treating the end of each phase as a deliberate stopping point, not just a pause before the next prompt; this also reinforces the course's broader lesson that knowing when to stop is as important as knowing what to build.
> **Common learner mistake:** Asking the AI to "polish" or "improve" the app instead of stopping. Vague improvement requests almost always introduce regressions or scope creep. If there are specific improvements the learner wants, they should be named as separate, scoped prompts.
> **If this fails:** If the AI attempts to modify the app, respond with: "Please do not make any changes. I just want confirmation that the current state is working correctly."

---
