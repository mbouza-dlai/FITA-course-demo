# Flashcards App v1 - Testing Sequence

## Scope
This checklist validates core v1 behavior across Create, Study, and Manage.

## A. Open App
1. Open `index.html` in browser.

Expected:
- App loads with tabs visible (`Create`, `Study`, `Manage`) and no console errors.

## B. Verify Default Tab Behavior
1. Confirm `Create` tab is active on load.
2. Click `Study`, then `Manage`, then back to `Create`.

Expected:
- Only one panel is visible at a time.

## C. Verify Tab Keyboard Navigation
1. Focus a tab button.
2. Press `ArrowRight`/`ArrowLeft`, `Home`, `End`.

Expected:
- Tabs switch correctly and focus follows selected tab.

## D. Add First Flashcard
1. In `Create`, enter front and back text, then click `Add Flashcard`.

Expected:
- Card count updates to `1 card`.
- Study mode shows `Card 1 of 1 (Front)`.

## E. Add Second Flashcard
1. Add another card with different content.

Expected:
- `Manage` shows `2 cards`.
- Study navigation (`Previous`/`Next`) becomes enabled.

## F. Study Mode Flip Animation
1. Go to `Study`.
2. Click card and use `Flip` button.

Expected:
- 3D flip animation front/back works.
- Label updates `(Front)` / `(Back)`.

## G. Study Keyboard Flip
1. Focus study card and press `Enter`, then `Space`.

Expected:
- Card flips on both keys.

## H. Flip Hint Behavior
1. If this is first run in localStorage, confirm hint appears: `Tip: click the card or press Flip`.
2. Flip once.

Expected:
- Hint disappears and stays hidden on reload.

## I. Study Navigation
1. Use `Next` and `Previous` across cards.

Expected:
- Moves through cards correctly and resets to front when changing cards.

## J. Inline Edit Mode (No Popups)
1. In `Manage`, click `Edit` on a card.

Expected:
- Card expands to inline text areas.
- `Save` and `Cancel` appear.
- `Edit`/`Delete` hide.

## K. Inline Edit Validation
1. Clear one field and press `Save`.

Expected:
- Inline error message appears and card is not saved.

## L. Inline Keyboard Shortcuts
1. In edit textarea, press `Enter` (without `Shift`).
2. In edit textarea, press `Shift+Enter`.
3. In edit textarea, press `Esc`.

Expected:
- `Enter` saves.
- `Shift+Enter` inserts newline.
- `Esc` cancels edits.

## M. Delete Flow
1. Delete one card in `Manage`.

Expected:
- Card is removed.
- Count updates.
- `Study` reflects remaining cards.

## N. Empty-State Behavior
1. Delete all cards.

Expected:
- `Manage`: `0 cards`.
- `Study`: empty card message, `Flip`/`Previous`/`Next` disabled.
