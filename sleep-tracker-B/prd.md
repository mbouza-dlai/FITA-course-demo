# Sleep Tracker — Product Requirements Document

## 1. Goal

The app gives a single user a simple way to log their nightly sleep, automatically calculate how long they slept, and review their sleep history over time — all without losing that data when they close the browser.

## 2. User

This app is for one person tracking their own sleep on a single device. No accounts, no sharing, no syncing with other people or other browsers. The user opens it, logs last night's sleep, and checks how they've been doing over the past week.

## 3. Inputs

- A **date** for the sleep entry (e.g., March 15, 2026)
- A **bedtime** — the time the user went to sleep (e.g., 11:00 PM)
- A **wake time** — the time the user woke up (e.g., 7:30 AM)

## 4. Outputs

- The **hours slept** for each entry, calculated automatically from the bedtime and wake time
- A **list of all past sleep entries**, each showing the date, bedtime, wake time, and hours slept
- A **weekly average** showing the user's average hours slept over the last 7 logged entries (Phase 2)
- A **7-day chart** showing sleep duration as a simple bar or line graph (Phase 3)

## 5. Core Features (MVP)

1. Display a form that lets the user enter a date, a bedtime, and a wake time for a sleep entry.
2. Calculate the hours slept automatically when the entry is submitted, and show that number alongside the entry.
3. Save every entry to local storage (the browser's built-in memory) so the data survives a page refresh.
4. Display all saved sleep entries in a list, sorted from most recent to oldest.
5. Allow the user to delete any individual sleep entry from the list.

## 6. Phase 2 Features

1. Migrate storage from local storage to a JSON file so that data is not tied to a single browser and persists even if the browser cache is cleared.
2. Calculate and display a weekly average — the average hours slept across the last 7 logged entries — at the top of the entries list.

## 7. Phase 3 Features

1. Migrate storage from the JSON file to a Supabase database (a hosted database service) to demonstrate full, durable data persistence.
2. Display a simple visual chart of sleep duration across the past 7 entries so the user can spot trends at a glance.

## 8. Out of Scope

The following features will not be included in any phase of this app:

- **Calling external APIs** (such as weather services or health platforms like Apple Health or Google Fit). The app works entirely on its own — no outside services.
- **AI or "smart" sleep tips** powered by a language model. Features like "Here's what you should do to sleep better" require AI integrations that are not part of this module.
- **User accounts or login**. Only one person uses this app. There are no passwords, no sign-up screens, and no multi-user support.
- **Push notifications or bedtime reminders**. The app does not send alerts or notifications of any kind.
- **Automatic syncing across devices**. In Phase 1 and Phase 2, the data lives in one place. Cross-device syncing is not supported — even in Phase 3, the database is not set up as a sync service between multiple logged-in users.
- **Sleep quality ratings or emoji reactions**. Rating how you felt is a natural extension, but it adds scope to Phase 1 beyond a single coding session. Leave it out for now.
- **Searchable history**. Browsing or filtering past entries is not included in this version.
- **Third-party chart libraries**. Phase 3 includes a simple chart, but it will be built without importing an external charting package.

## 9. Tech Notes

**Phase 1 — local storage:** All sleep entries are saved in the browser's local storage. This is a small amount of memory that every browser provides automatically. No setup is required. The downside is that this data only exists in that one browser — clear the cache and it's gone.

**Phase 2 — JSON file:** Data is migrated to a JSON file (a plain text file that stores structured data). This means the data is no longer tied to the browser. The app reads from and writes to this file directly. This is a step up in durability but still a local solution.

**Phase 3 — Supabase:** Data is migrated to a Supabase database (a hosted, cloud database service). This is the most durable option and sets the foundation for features that would need a real database. More power comes with more setup — connecting to Supabase requires creating a free project and adding connection credentials to the app.

**No external APIs are used at any phase.** All calculations (hours slept, weekly average) happen inside the app itself.

## 10. Testing Checklist

1. **Log a new entry and refresh the page.** The entry should still appear in the list with the correct hours slept calculated.
2. **Enter a bedtime of 11:00 PM and a wake time of 7:30 AM.** The app should display 8.5 hours slept for that entry.
3. **Add three entries and check their order.** The most recent date should appear at the top of the list.
4. **Delete one entry from the list.** That entry should disappear immediately and not reappear after a page refresh.
5. **Add more than 7 entries.** Only valid entries should appear; no duplicates; the list should grow correctly with each submission.
