# Pomodoro Timer v2 — Enhanced Features Spec

## Overview
v2 builds on top of the working v1 Pomodoro Timer. All v1 features and test IDs must remain intact. v2 adds: keyboard shortcuts, a daily session goal system, an auto-start option, a mini session history visualization (bar chart), skip session button, and a notification system using the Notification API.

Still a single `index.html` file, no persistence, no external dependencies.

## New Features for v2

### F9: Keyboard Shortcuts
- `Space` — Toggle Start/Pause (only when no text input is focused)
- `R` — Reset timer (only when no text input is focused)
- `S` — Toggle Settings panel (only when no text input is focused)
- A small keyboard shortcut hint should appear below the controls (e.g., "Space: Start/Pause | R: Reset | S: Settings")
- The hint has `data-testid="keyboard-hints"`

### F10: Daily Session Goal
- In the Settings panel, add a number input for "Daily Goal" (1–20 sessions, default 8)
- `data-testid="daily-goal-input"` on the input
- A goal progress indicator in the stats section shows "X / Y sessions" where X is completed work sessions and Y is the goal
- `data-testid="goal-progress"` on the progress indicator element
- A visual progress bar specifically for the goal (separate from the timer ring)
- `data-testid="goal-progress-bar"` on this bar
- When the goal is reached, a congratulatory message appears: "Daily goal reached!" with `data-testid="goal-reached-msg"`
- The message should only show when completedSessions >= dailyGoal

### F11: Auto-Start Option
- A checkbox in the Settings panel: "Auto-start next session"
- `data-testid="auto-start-checkbox"` on the checkbox
- Default: unchecked (matches v1 behavior — user must press Start)
- When checked, the next session automatically begins counting down after the current one completes (no need to press Start)
- Auto-start should work across the full cycle (work → break → work, etc.)

### F12: Skip Session Button
- A "Skip" button next to Start/Pause and Reset
- `data-testid="skip-btn"` on the button
- Clicking Skip immediately ends the current session WITHOUT logging it and WITHOUT counting it in stats
- Skipping advances to the next session in the cycle
- Skipping a work session that was started DOES break the streak (same as Reset)
- If the session was never started (just sitting idle), skipping does NOT break the streak

### F13: Session History Visualization
- A simple horizontal bar chart below the stats section showing the last 10 completed sessions
- Each bar represents one session, colored by type (work=red, short break=green, long break=blue)
- Bar width is proportional to the session's duration relative to the longest session
- `data-testid="history-chart"` on the chart container
- Each bar has `data-testid="history-bar"`
- If no sessions completed yet, show "No sessions yet" placeholder text

### F14: Browser Notifications
- When a session completes, if the user has granted notification permission, show a browser notification
- Notification title: "Pomodoro Timer"
- Notification body: "Time for a [Short Break/Long Break/Work session]!" (describing the NEXT session)
- A "Enable Notifications" button in the settings panel with `data-testid="notification-toggle"`
- Clicking it requests Notification permission if not already granted
- Button text should reflect current state: "Enable Notifications" / "Notifications Enabled" / "Notifications Denied"

## Updated Test Helpers

`window.pomodoroTestHelpers` must also expose:
```javascript
window.pomodoroTestHelpers = {
  completeSession: function() { /* ... */ },
  resetAll: function() { /* ... */ },
  getState: function() {
    // Returns current internal state for testing
    return {
      mode: '...', // 'work', 'short_break', 'long_break'
      cycleIndex: 0,
      timeRemaining: 1500,
      isRunning: false,
      completedSessions: 0,
      streak: 0,
      dailyGoal: 8,
      autoStart: false,
      logLength: 0
    };
  }
};
```

## Additional data-testid Requirements (v2)

| Element | data-testid |
|---|---|
| Keyboard hints | `keyboard-hints` |
| Daily goal input | `daily-goal-input` |
| Goal progress text | `goal-progress` |
| Goal progress bar | `goal-progress-bar` |
| Goal reached message | `goal-reached-msg` |
| Auto-start checkbox | `auto-start-checkbox` |
| Skip button | `skip-btn` |
| History chart container | `history-chart` |
| Each history bar | `history-bar` |
| Notification toggle button | `notification-toggle` |

---

## v2 Automated Test Suite

```javascript
// ============================================
// POMODORO TIMER v2 — ADDITIONAL TEST SUITE
// ============================================
// Run AFTER the v1 test suite. Paste into console, then call: runV2Tests()

(function() {
  const results = [];

  function assert(condition, testName, details = '') {
    results.push({
      pass: !!condition,
      test: testName,
      message: condition ? 'PASS' : `FAIL${details ? ': ' + details : ''}`
    });
  }

  function getTimerText() {
    const el = document.querySelector('[data-testid="timer-display"]');
    return el ? el.textContent.trim() : null;
  }

  function getModeLabel() {
    const el = document.querySelector('[data-testid="mode-label"]');
    return el ? el.textContent.trim() : null;
  }

  function getLogEntries() {
    const container = document.querySelector('[data-testid="session-log"]');
    if (!container) return [];
    return container.querySelectorAll('[data-testid="log-entry"]');
  }

  // ---- TEST GROUP 11: Keyboard Shortcuts ----

  function testKeyboardHintsExist() {
    const el = document.querySelector('[data-testid="keyboard-hints"]');
    assert(el, 'T11.1 Keyboard hints element exists');
    if (el) {
      const text = el.textContent.toLowerCase();
      assert(/space/.test(text) && /reset|r\b/.test(text), 'T11.2 Keyboard hints mention Space and R', `Got: "${el.textContent}"`);
    }
  }

  function testSpaceKeyToggle() {
    if (window.pomodoroTestHelpers && window.pomodoroTestHelpers.resetAll) {
      window.pomodoroTestHelpers.resetAll();
    }

    // Make sure no input is focused
    document.activeElement?.blur();

    const btn = document.querySelector('[data-testid="start-pause-btn"]');

    // Press Space to start
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));

    assert(/pause/i.test(btn.textContent), 'T11.3 Space key starts timer (button shows Pause)', `Got: "${btn.textContent}"`);

    // Press Space to pause
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));

    assert(/start/i.test(btn.textContent), 'T11.4 Space key pauses timer (button shows Start)', `Got: "${btn.textContent}"`);
  }

  function testRKeyReset() {
    if (window.pomodoroTestHelpers && window.pomodoroTestHelpers.resetAll) {
      window.pomodoroTestHelpers.resetAll();
    }

    document.activeElement?.blur();

    // Start timer
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));

    // Press R to reset
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'r', code: 'KeyR', bubbles: true }));

    const text = getTimerText();
    const btn = document.querySelector('[data-testid="start-pause-btn"]');
    assert(text === '25:00', 'T11.5 R key resets timer to 25:00', `Got: "${text}"`);
    assert(/start/i.test(btn.textContent), 'T11.6 R key resets button to Start', `Got: "${btn.textContent}"`);
  }

  function testKeyboardIgnoredWhenInputFocused() {
    if (window.pomodoroTestHelpers && window.pomodoroTestHelpers.resetAll) {
      window.pomodoroTestHelpers.resetAll();
    }

    const taskInput = document.querySelector('[data-testid="task-input"]');
    taskInput.focus();

    // Press Space — should NOT start timer (input is focused)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));

    const btn = document.querySelector('[data-testid="start-pause-btn"]');
    assert(/start/i.test(btn.textContent), 'T11.7 Space key ignored when input is focused', `Got: "${btn.textContent}"`);

    taskInput.blur();
  }

  // ---- TEST GROUP 12: Daily Session Goal ----

  function testDailyGoalInputExists() {
    // Open settings
    const toggle = document.querySelector('[data-testid="settings-toggle"]');
    if (toggle) toggle.click();

    const goalInput = document.querySelector('[data-testid="daily-goal-input"]');
    assert(goalInput, 'T12.1 Daily goal input exists');
    if (goalInput) {
      assert(Number(goalInput.value) === 8, 'T12.2 Daily goal default is 8', `Got: ${goalInput.value}`);
    }

    if (toggle) toggle.click();
  }

  function testGoalProgressDisplay() {
    if (window.pomodoroTestHelpers && window.pomodoroTestHelpers.resetAll) {
      window.pomodoroTestHelpers.resetAll();
    }

    const goalProgress = document.querySelector('[data-testid="goal-progress"]');
    assert(goalProgress, 'T12.3 Goal progress element exists');
    if (goalProgress) {
      assert(/0\s*\/\s*8|0\s*of\s*8/i.test(goalProgress.textContent), 'T12.4 Goal progress shows 0/8 initially', `Got: "${goalProgress.textContent}"`);
    }

    const goalBar = document.querySelector('[data-testid="goal-progress-bar"]');
    assert(goalBar, 'T12.5 Goal progress bar exists');
  }

  function testGoalReachedMessage() {
    if (!window.pomodoroTestHelpers || !window.pomodoroTestHelpers.resetAll || !window.pomodoroTestHelpers.completeSession) {
      assert(false, 'T12.6 Goal reached — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    // Set daily goal to 2
    const toggle = document.querySelector('[data-testid="settings-toggle"]');
    if (toggle) toggle.click();

    const goalInput = document.querySelector('[data-testid="daily-goal-input"]');
    if (goalInput) {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(goalInput, '2');
      goalInput.dispatchEvent(new Event('input', { bubbles: true }));
      goalInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (toggle) toggle.click();

    // Complete 2 work sessions (work + break + work = 3 completions)
    window.pomodoroTestHelpers.completeSession(); // Work 1
    window.pomodoroTestHelpers.completeSession(); // Short break
    window.pomodoroTestHelpers.completeSession(); // Work 2

    const msg = document.querySelector('[data-testid="goal-reached-msg"]');
    assert(msg, 'T12.6 Goal reached message appears');
    if (msg) {
      assert(/goal\s*reached|congratulat/i.test(msg.textContent), 'T12.7 Goal reached message text is correct', `Got: "${msg.textContent}"`);
    }

    // Check goal progress shows 2/2
    const goalProgress = document.querySelector('[data-testid="goal-progress"]');
    if (goalProgress) {
      assert(/2\s*\/\s*2|2\s*of\s*2/i.test(goalProgress.textContent), 'T12.8 Goal progress shows 2/2', `Got: "${goalProgress.textContent}"`);
    }
  }

  function testGoalNotShownBeforeReached() {
    if (!window.pomodoroTestHelpers || !window.pomodoroTestHelpers.resetAll) {
      assert(false, 'T12.9 Goal not shown before reached — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    const msg = document.querySelector('[data-testid="goal-reached-msg"]');
    // Should not exist or be hidden
    const visible = msg && msg.offsetParent !== null && getComputedStyle(msg).display !== 'none';
    assert(!visible, 'T12.9 Goal reached message is NOT shown before goal is reached');
  }

  // ---- TEST GROUP 13: Auto-Start ----

  function testAutoStartCheckboxExists() {
    const toggle = document.querySelector('[data-testid="settings-toggle"]');
    if (toggle) toggle.click();

    const checkbox = document.querySelector('[data-testid="auto-start-checkbox"]');
    assert(checkbox, 'T13.1 Auto-start checkbox exists');
    if (checkbox) {
      assert(!checkbox.checked, 'T13.2 Auto-start is unchecked by default');
    }

    if (toggle) toggle.click();
  }

  function testAutoStartBehavior() {
    if (!window.pomodoroTestHelpers || !window.pomodoroTestHelpers.resetAll) {
      assert(false, 'T13.3 Auto-start behavior — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    // Enable auto-start
    const toggle = document.querySelector('[data-testid="settings-toggle"]');
    if (toggle) toggle.click();

    const checkbox = document.querySelector('[data-testid="auto-start-checkbox"]');
    if (checkbox && !checkbox.checked) {
      checkbox.click();
    }

    if (toggle) toggle.click();

    // Complete a session
    window.pomodoroTestHelpers.completeSession();

    // With auto-start, the timer should be running
    const state = window.pomodoroTestHelpers.getState ? window.pomodoroTestHelpers.getState() : null;
    const btn = document.querySelector('[data-testid="start-pause-btn"]');

    if (state) {
      assert(state.isRunning, 'T13.3 Auto-start: timer is running after session completion', `isRunning: ${state.isRunning}`);
    } else {
      assert(btn && /pause/i.test(btn.textContent), 'T13.3 Auto-start: button shows Pause after session completion', `Got: "${btn?.textContent}"`);
    }

    // Cleanup
    window.pomodoroTestHelpers.resetAll();

    // Disable auto-start
    if (toggle) toggle.click();
    if (checkbox && checkbox.checked) checkbox.click();
    if (toggle) toggle.click();
  }

  // ---- TEST GROUP 14: Skip Session ----

  function testSkipButtonExists() {
    const skipBtn = document.querySelector('[data-testid="skip-btn"]');
    assert(skipBtn, 'T14.1 Skip button exists');
  }

  function testSkipDoesNotLog() {
    if (!window.pomodoroTestHelpers || !window.pomodoroTestHelpers.resetAll) {
      assert(false, 'T14.2 Skip does not log — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    const skipBtn = document.querySelector('[data-testid="skip-btn"]');
    if (!skipBtn) { assert(false, 'T14.2 Skip button not found'); return; }

    skipBtn.click(); // Skip work session

    const entries = getLogEntries();
    assert(entries.length === 0, 'T14.2 Skipping does NOT create a log entry', `Got ${entries.length} entries`);
  }

  function testSkipAdvancesCycle() {
    if (!window.pomodoroTestHelpers || !window.pomodoroTestHelpers.resetAll) {
      assert(false, 'T14.3 Skip advances cycle — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    const skipBtn = document.querySelector('[data-testid="skip-btn"]');
    if (!skipBtn) { assert(false, 'T14.3 Skip button not found'); return; }

    skipBtn.click(); // Skip work -> should go to short break

    const mode = getModeLabel();
    assert(mode && /break/i.test(mode), 'T14.3 Skip advances from Work to Break', `Got: "${mode}"`);
  }

  function testSkipDoesNotCountStats() {
    if (!window.pomodoroTestHelpers || !window.pomodoroTestHelpers.resetAll) {
      assert(false, 'T14.4 Skip does not count stats — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    const skipBtn = document.querySelector('[data-testid="skip-btn"]');
    if (!skipBtn) { assert(false, 'T14.4 Skip button not found'); return; }

    skipBtn.click(); // Skip work session

    const state = window.pomodoroTestHelpers.getState ? window.pomodoroTestHelpers.getState() : null;
    if (state) {
      assert(state.completedSessions === 0, 'T14.4 Skipped session not counted in stats', `completedSessions: ${state.completedSessions}`);
    } else {
      const statsEl = document.querySelector('[data-testid="stats-section"]');
      const sessionsEl = document.getElementById('stat-sessions');
      assert(sessionsEl && sessionsEl.textContent.trim() === '0', 'T14.4 Skipped session not counted in stats', `Got: "${sessionsEl?.textContent}"`);
    }
  }

  function testSkipStartedSessionBreaksStreak() {
    if (!window.pomodoroTestHelpers || !window.pomodoroTestHelpers.resetAll || !window.pomodoroTestHelpers.completeSession) {
      assert(false, 'T14.5 Skip started session breaks streak — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    // Build up a streak of 1
    window.pomodoroTestHelpers.completeSession(); // Work 1 (streak=1)
    window.pomodoroTestHelpers.completeSession(); // Short break

    // Now start work session 2 and skip it
    const startBtn = document.querySelector('[data-testid="start-pause-btn"]');
    startBtn.click(); // Start work session 2

    const skipBtn = document.querySelector('[data-testid="skip-btn"]');
    skipBtn.click(); // Skip — should break streak since it was started

    const state = window.pomodoroTestHelpers.getState ? window.pomodoroTestHelpers.getState() : null;
    if (state) {
      assert(state.streak === 0, 'T14.5 Skipping a started work session breaks streak', `streak: ${state.streak}`);
    } else {
      const streakEl = document.getElementById('stat-streak');
      assert(streakEl && streakEl.textContent.trim() === '0', 'T14.5 Skipping a started work session breaks streak', `Got: "${streakEl?.textContent}"`);
    }
  }

  function testSkipIdleDoesNotBreakStreak() {
    if (!window.pomodoroTestHelpers || !window.pomodoroTestHelpers.resetAll || !window.pomodoroTestHelpers.completeSession) {
      assert(false, 'T14.6 Skip idle does not break streak — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    // Build up a streak of 1
    window.pomodoroTestHelpers.completeSession(); // Work 1 (streak=1)
    window.pomodoroTestHelpers.completeSession(); // Short break

    // Now skip work session 2 WITHOUT starting it — streak should stay at 1
    const skipBtn = document.querySelector('[data-testid="skip-btn"]');
    skipBtn.click();

    const state = window.pomodoroTestHelpers.getState ? window.pomodoroTestHelpers.getState() : null;
    if (state) {
      assert(state.streak === 1, 'T14.6 Skipping an idle session does NOT break streak', `streak: ${state.streak}`);
    } else {
      const streakEl = document.getElementById('stat-streak');
      assert(streakEl && streakEl.textContent.trim() === '1', 'T14.6 Skipping an idle session does NOT break streak', `Got: "${streakEl?.textContent}"`);
    }
  }

  // ---- TEST GROUP 15: Session History Chart ----

  function testHistoryChartExists() {
    const chart = document.querySelector('[data-testid="history-chart"]');
    assert(chart, 'T15.1 History chart container exists');
  }

  function testHistoryChartEmptyState() {
    if (!window.pomodoroTestHelpers || !window.pomodoroTestHelpers.resetAll) {
      assert(false, 'T15.2 History chart empty state — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    const chart = document.querySelector('[data-testid="history-chart"]');
    if (chart) {
      const bars = chart.querySelectorAll('[data-testid="history-bar"]');
      assert(bars.length === 0, 'T15.2 No history bars when no sessions completed', `Got ${bars.length} bars`);
      assert(/no sessions/i.test(chart.textContent), 'T15.3 Empty chart shows "No sessions" text', `Got: "${chart.textContent}"`);
    }
  }

  function testHistoryChartPopulates() {
    if (!window.pomodoroTestHelpers || !window.pomodoroTestHelpers.resetAll || !window.pomodoroTestHelpers.completeSession) {
      assert(false, 'T15.4 History chart populates — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    // Complete 3 sessions (work + break + work)
    window.pomodoroTestHelpers.completeSession(); // Work
    window.pomodoroTestHelpers.completeSession(); // Break
    window.pomodoroTestHelpers.completeSession(); // Work

    const chart = document.querySelector('[data-testid="history-chart"]');
    if (chart) {
      const bars = chart.querySelectorAll('[data-testid="history-bar"]');
      assert(bars.length === 3, 'T15.4 History chart has 3 bars after 3 sessions', `Got ${bars.length} bars`);
    }
  }

  function testHistoryChartMaxTen() {
    if (!window.pomodoroTestHelpers || !window.pomodoroTestHelpers.resetAll || !window.pomodoroTestHelpers.completeSession) {
      assert(false, 'T15.5 History chart max 10 — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    // Complete 12 sessions
    for (let i = 0; i < 12; i++) {
      window.pomodoroTestHelpers.completeSession();
    }

    const chart = document.querySelector('[data-testid="history-chart"]');
    if (chart) {
      const bars = chart.querySelectorAll('[data-testid="history-bar"]');
      assert(bars.length <= 10, 'T15.5 History chart shows at most 10 bars', `Got ${bars.length} bars`);
    }
  }

  // ---- TEST GROUP 16: getState helper ----

  function testGetStateHelper() {
    if (!window.pomodoroTestHelpers || !window.pomodoroTestHelpers.getState) {
      assert(false, 'T16.1 getState helper — not found');
      return;
    }

    if (window.pomodoroTestHelpers.resetAll) window.pomodoroTestHelpers.resetAll();

    const state = window.pomodoroTestHelpers.getState();
    assert(state !== null && typeof state === 'object', 'T16.1 getState returns an object');
    assert('mode' in state, 'T16.2 getState has mode property');
    assert('cycleIndex' in state, 'T16.3 getState has cycleIndex property');
    assert('isRunning' in state, 'T16.4 getState has isRunning property');
    assert('completedSessions' in state, 'T16.5 getState has completedSessions property');
    assert('streak' in state, 'T16.6 getState has streak property');
    assert('dailyGoal' in state, 'T16.7 getState has dailyGoal property');
    assert('autoStart' in state, 'T16.8 getState has autoStart property');
  }

  // ---- TEST GROUP 17: Notification toggle ----

  function testNotificationToggleExists() {
    const toggle = document.querySelector('[data-testid="settings-toggle"]');
    if (toggle) toggle.click();

    const notifBtn = document.querySelector('[data-testid="notification-toggle"]');
    assert(notifBtn, 'T17.1 Notification toggle button exists');

    if (toggle) toggle.click();
  }

  // ---- RUNNER ----

  window.runV2Tests = async function() {
    results.length = 0;

    testKeyboardHintsExist();
    testSpaceKeyToggle();
    testRKeyReset();
    testKeyboardIgnoredWhenInputFocused();
    testDailyGoalInputExists();
    testGoalProgressDisplay();
    testGoalNotShownBeforeReached();
    testGoalReachedMessage();
    testAutoStartCheckboxExists();
    testAutoStartBehavior();
    testSkipButtonExists();
    testSkipDoesNotLog();
    testSkipAdvancesCycle();
    testSkipDoesNotCountStats();
    testSkipStartedSessionBreaksStreak();
    testSkipIdleDoesNotBreakStreak();
    testHistoryChartExists();
    testHistoryChartEmptyState();
    testHistoryChartPopulates();
    testHistoryChartMaxTen();
    testGetStateHelper();
    testNotificationToggleExists();

    // Cleanup
    if (window.pomodoroTestHelpers && window.pomodoroTestHelpers.resetAll) {
      window.pomodoroTestHelpers.resetAll();
    }

    const passed = results.filter(r => r.pass).length;
    const failed = results.filter(r => !r.pass).length;
    console.log(`\n${'='.repeat(50)}`);
    console.log(`POMODORO TIMER v2 TEST RESULTS: ${passed} passed, ${failed} failed, ${results.length} total`);
    console.log('='.repeat(50));
    results.forEach(r => {
      console.log(`${r.pass ? '✅' : '❌'} ${r.test} — ${r.message}`);
    });
    console.log(`${'='.repeat(50)}\n`);

    return { passed, failed, total: results.length, results };
  };

  console.log('Pomodoro v2 test suite loaded. Run: runV2Tests()');
})();
```
