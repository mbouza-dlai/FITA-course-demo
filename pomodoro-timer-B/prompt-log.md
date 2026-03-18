# Pomodoro Timer — Prompt Log

This file records every prompt sent to the building agent, along with the iteration number and outcome.

---

## Prompt 1 — Initial Build (v1)

**Goal:** Build the complete Pomodoro Timer app from the spec.

**Prompt:**
```
Build a single-file Pomodoro Timer app (index.html) based on the spec in
/Users/brendanmichaelbrown/Desktop/app-automator/apps/pomodoro-timer/spec.md.

Read the full spec carefully. The app must be a single index.html file with all HTML, CSS, and JS
inline. No external dependencies, no CDNs, no build tools. It should open directly in a browser.

Key requirements:
1. Timer display showing MM:SS, starting at 25:00 for Work mode
2. Start/Pause toggle button + separate Reset button
3. Session cycle: Work -> Short Break -> Work -> Short Break -> Work -> Short Break -> Work -> Long Break -> repeat
4. Session indicator showing "Session X of 4"
5. Task labeling input that attaches to work session log entries
6. Session log in reverse chronological order with type, task, duration, timestamp
7. Customizable durations via collapsible Settings panel (work 1-60, short break 1-30, long break 1-60)
8. Statistics dashboard: completed work sessions, total focus time, current streak
9. Visual feedback: background color changes per mode (warm for work, green for short break, blue for long break), progress bar/ring
10. Audio alert via Web Audio API when timer completes (no external audio files)
11. Page title updates with timer and mode
12. All data-testid attributes from the spec must be present
13. window.pomodoroTestHelpers must be exposed with completeSession() and resetAll() methods

After building, paste the test suite from the spec into the browser console and run runAllTests(). Fix any failures before finishing.

Write the file to: /Users/brendanmichaelbrown/Desktop/app-automator/apps/pomodoro-timer/v1/index.html
```

**Outcome:** 44/44 tests passed on first build. No iteration needed for v1.

---

## Prompt 2 — v2 Build (Enhanced Features)

**Goal:** Add keyboard shortcuts, daily goal, auto-start, skip button, history chart, and notifications to the v1 app.

**Prompt:**
```
You need to build v2 of a Pomodoro Timer app.

Start by reading these files:
1. /Users/brendanmichaelbrown/Desktop/app-automator/apps/pomodoro-timer/v1/index.html (the working v1 app -- copy this as your starting point)
2. /Users/brendanmichaelbrown/Desktop/app-automator/apps/pomodoro-timer/spec-v2.md (the v2 feature spec with automated test cases)

Then build v2 by copying v1 and adding all v2 features on top. Write the result to:
/Users/brendanmichaelbrown/Desktop/app-automator/apps/pomodoro-timer/v2/index.html

Key things to get right:

1. Keep ALL v1 features and data-testid attributes intact. v1 tests must still pass.
2. Keyboard Shortcuts (F9): Space=toggle start/pause, R=reset, S=toggle settings. ONLY when no text input is focused. Add a data-testid="keyboard-hints" element below controls showing the shortcuts.
3. Daily Session Goal (F10): Add data-testid="daily-goal-input" (number input, default 8, range 1-20) in settings. Add data-testid="goal-progress" showing "X / Y sessions" in stats. Add data-testid="goal-progress-bar" for visual progress. Add data-testid="goal-reached-msg" that says "Daily goal reached!" and ONLY shows when completedSessions >= dailyGoal.
4. Auto-Start (F11): Checkbox data-testid="auto-start-checkbox" in settings, default unchecked. When checked, the next session automatically begins counting down after completion.
5. Skip Button (F12): data-testid="skip-btn" next to Start/Pause and Reset. Skipping ends the session WITHOUT logging it, WITHOUT counting stats. Advances the cycle. If the session was started, skip DOES break streak. If idle, skip does NOT break streak.
6. History Chart (F13): data-testid="history-chart" with bars data-testid="history-bar". Shows last 10 sessions as horizontal bars colored by type. Empty state shows "No sessions yet".
7. Notification Toggle (F14): data-testid="notification-toggle" button in settings. Requests Notification permission.
8. Updated test helpers: window.pomodoroTestHelpers must also expose getState() returning an object with: mode, cycleIndex, timeRemaining, isRunning, completedSessions, streak, dailyGoal, autoStart, logLength.

This is a single-file HTML app. No external dependencies, no CDNs, no build tools.
```

**Outcome:** 83/83 tests passed (44 v1 + 39 v2) on first build. No iteration needed for v2.

---

## Prompt 3 — v3 Build (Advanced Features)

**Goal:** Add focus score, task tags, log filtering, interactive timer adjustment, session templates, and focus mode to the v2 app.

**Prompt:**
```
Build v3 of the Pomodoro Timer app.

Read these files first:
1. /Users/brendanmichaelbrown/Desktop/app-automator/apps/pomodoro-timer/v2/index.html (the working v2 app -- use as your starting point)
2. /Users/brendanmichaelbrown/Desktop/app-automator/apps/pomodoro-timer/spec-v3.md (the v3 feature spec with automated test cases)

Copy v2 and add all v3 features. Write to:
/Users/brendanmichaelbrown/Desktop/app-automator/apps/pomodoro-timer/v3/index.html

CRITICAL: All v1 and v2 features, data-testid attributes, and test helpers must remain intact. v1+v2 tests must still pass on v3.

New features to add (read spec-v3.md for full details):

1. Focus Score (F15): Score 0-100 in stats section with data-testid="focus-score". Formula: min(100, round((completedSessions/dailyGoal)*50 + (streak/dailyGoal)*30 + (noResets ? 20 : 0))). Color-coded: 0-39=red(#e74c3c), 40-69=orange(#f39c12), 70-100=green(#27ae60). noResets tracks if user has EVER reset a running work session this page load.
2. Task Tags (F16): data-testid="tag-selector" with 5 data-testid="tag-btn" buttons (data-tag="work|study|personal|creative|health"). Radio-style (one at a time). Selected tag appears in log entries. Default: no tag = "Untagged".
3. Log Filtering (F17): data-testid="log-filter" bar with filter buttons: data-testid="filter-btn" with data-filter="all|work|short_break|long_break". Plus data-testid="tag-filter" dropdown. Filters hide non-matching log entries (display:none).
4. Interactive Timer Adjust (F18): data-testid="timer-increment" and data-testid="timer-decrement" buttons near timer. +/-5 min per click. Capped at mode max (work=60) and min=1. DISABLED when timer is running. Must update both timeRemaining and totalDuration.
5. Session Templates (F19): data-testid="templates-section" with 3 data-testid="template-btn" buttons: sprint(15/3/10), standard(25/5/15), deep-work(50/10/30). Clicking updates settings + resets timer. Manual settings change deselects active template.
6. Focus Mode (F20): data-testid="focus-mode-toggle" toggle. When active: sets data-focus-mode="true" on body or app wrapper. Stats, settings, log, history chart, templates get opacity: 0.15 and pointer-events: none. Timer/controls/task input stay visible. data-testid="focus-mode-overlay" on wrapper.
7. Updated getState: Must now also return focusScore, selectedTag, focusMode, activeTemplate, noResets.

Make sure to handle the interaction between features:
- Tags must appear in log entries as badges
- Filtered log must respect both type filter and tag filter
- Focus mode must dim templates and history chart too
- Template selection must update the settings panel inputs
- Timer adjust buttons must be disabled when running
```

**Outcome:** 133/135 tests passed on first build. Two failures required fixes:

### Fix 1 — Test T18.2 (Focus Score initial value)

**Issue:** Test expected focus score to start at 0, but the formula correctly gives 20 when `noResets=true` and 0 sessions completed (the `noResets` bonus is 20 points).

**Resolution:** Updated test expectation from `assert(val === 0)` to `assert(val === 20)` — this was a test spec issue, not an app bug.

### Fix 2 — Test T23.5 (Focus mode dims stats section)

**Issue:** CSS rule `.app[data-focus-mode="true"] .focus-dimmable { opacity: 0.15; transition: opacity 0.3s ease; }` — the `transition` property prevented the headless browser from reading the new opacity immediately. `getComputedStyle` returned the pre-transition value of `1`.

**Resolution:** Removed `transition: opacity 0.3s ease` from the CSS rule. The opacity change now applies instantly, making both the app behavior and the test deterministic.

**Final result after fixes:** 135/135 tests passing.

---

## Summary

| Version | Tests | Pass Rate | Agent Iterations |
|---------|-------|-----------|-----------------|
| v1      | 44    | 100%      | 1 (clean build) |
| v2      | 39    | 100%      | 1 (clean build) |
| v3      | 52    | 100%      | 1 build + 2 manual fixes |
| **Total** | **135** | **100%** | **3 agent calls + 2 patches** |
