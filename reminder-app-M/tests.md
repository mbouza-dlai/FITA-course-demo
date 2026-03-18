# Reminder App Manual Test Checklist

1. Load `remainder-app/index.html` in a browser.
2. Add a reminder with a future date/time and verify it appears in the list.
3. Try submitting with missing title/date/time/label and verify validation message appears.
4. Add two reminders and verify they are sorted by upcoming date/time.
5. Use filter buttons (`All`, `Active`, `Completed`) and verify list updates.
6. Mark a reminder completed and verify status and button text change.
7. Mark the same reminder active again and verify it returns to active state.
8. Edit a reminder title/date/time/label and verify changes are reflected.
9. Attempt to edit reminder with a past date/time and verify validation message appears.
10. Delete a reminder and verify it is removed from the list.
11. If notifications are allowed, verify a local notification is shown at reminder time.
12. If notifications are blocked/unsupported, verify the app falls back to `alert`.

Notes:
- Reminders are stored in memory only (runtime state).
- Reloading the page clears all reminders by design.
