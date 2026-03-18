# Flashcards App v2 - Testing Sequence

## Scope
This checklist validates the new v2 features and confirms core behavior still works:

1. Study-mode inline edit (`Edit Current Card`)
2. Shuffle toggle switch UI and behavior
3. Existing create/manage/edit/delete/study flows (regression)
4. Known checkbox behavior and study-loop omission

## Preconditions
1. Open `index.html` from `flashcards-app/v2` in a browser.
2. Open DevTools console and ensure no startup errors.
3. If prior localStorage data causes confusion, clear site data and reload.

## Test Data Setup
1. In `Create`, add these cards:
	- Front: `Q1` / Back: `A1`
	- Front: `Q2` / Back: `A2`
	- Front: `Q3` / Back: `A3`
	- Front: `Q4` / Back: `A4`
2. Go to `Manage` and confirm total shows `4 cards`.

## A. Study Mode Layout and Toggle Placement
1. Open `Study` tab.
2. Confirm shuffle control appears below the `Study Mode` title as a toggle switch.
3. Confirm `Previous`, `Flip`, `Next`, and `Edit Current Card` buttons are centered to card width.

Expected:
- Toggle is visually ON/OFF and not shown as a normal text button.
- Action buttons align with card area.

## B. Shuffle Toggle - Functional Behavior
1. In `Study`, set toggle to OFF.
2. Click `Next` repeatedly and note order.

Expected:
- Sequential order follows creation sequence (`Q1 -> Q2 -> Q3 -> Q4 -> ...`).

3. Turn shuffle toggle ON.
4. Note current card and click `Next` through one full cycle.

Expected:
- Cards follow a randomized order, not fixed sequence.
- After completing a full cycle, next cycle reshuffles again.

5. Turn shuffle OFF while on any card.

Expected:
- Order returns to sequential.
- Current card remains valid (no blank state or errors).

## C. Shuffle Toggle - UI State and Accessibility
1. Toggle ON and OFF.

Expected:
- `aria-pressed` updates correctly (`true` when ON, `false` when OFF).
- Tooltip/title and accessible label reflect state (`Shuffle cards: On/Off`).

2. Enter Study edit mode (see section D), then check shuffle toggle.

Expected:
- Shuffle toggle becomes disabled while editing.

## D. Study Mode Inline Edit (`Edit Current Card`)
1. In `Study`, click `Edit Current Card`.

Expected:
- Inline edit form appears with current front/back text prefilled.
- `Flip`, `Previous`, `Next`, and `Edit Current Card` are disabled.

2. Change front/back values and click `Save Changes`.

Expected:
- Study card updates immediately.
- Data persists after refresh.
- Updated content also appears in `Manage`.

3. Re-enter edit mode, change text, then click `Cancel`.

Expected:
- No changes are saved.
- Previous saved content remains.

4. Re-enter edit mode, clear one field, click `Save Changes`.

Expected:
- Inline validation message appears.
- Save is blocked until both fields are non-empty.

## E. Manage Tab Inline Edit (Regression)
1. Open `Manage` and click `Edit` on one card.

Expected:
- Row expands inline with textareas.
- `Save` and `Cancel` shown; `Edit` and `Delete` hidden.

2. Keyboard checks in inline manage edit:
	- Press `Enter` (without Shift)
	- Press `Shift+Enter`
	- Press `Esc`

Expected:
- `Enter` saves.
- `Shift+Enter` inserts newline.
- `Esc` cancels edit.

## F. Study Card Interaction (Regression)
1. Click card surface or `Flip` button.

Expected:
- Card flips with animation.
- Front/back label in card position updates.

2. With only one card remaining (optional), verify nav buttons.

Expected:
- `Previous`/`Next` disabled for single card.

## G. Delete Behavior with Active Study Edit
1. Start Study edit mode.
2. Without saving, go to `Manage` and delete a card.
3. Return to `Study`.

Expected:
- Study edit mode closes safely.
- No broken UI state, no stale form data crash.

## H. Empty State Checks
1. Delete all cards.
2. Open `Study`.

Expected:
- Empty message shown.
- `Flip`, `Previous`, `Next`, and `Edit Current Card` disabled.
- Shuffle control remains visible and stable.

## I. Known Checkbox and Omitted Study Loop
1. In `Manage`, mark one card as `Known` using its checkbox.
2. Go to `Study` and navigate through cards.

Expected:
- The known card is omitted from the study loop.
- Card counter reflects only study-eligible (unknown) cards.

3. Return to `Manage` and uncheck `Known` for that card.
4. Go back to `Study`.

Expected:
- The card appears again in the study loop.

5. Mark all cards as `Known` and open `Study`.

Expected:
- Study shows all-known guidance message.
- `Flip`, `Previous`, `Next`, and `Edit Current Card` are disabled until at least one card is unmarked.

## Pass Criteria
1. All expected outcomes above are met.
2. No console errors during primary flows.
3. No user-visible dead ends (stuck edit mode, blank cards with non-empty data, disabled controls that should be active).
