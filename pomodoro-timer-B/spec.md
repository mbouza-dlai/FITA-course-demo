# Pomodoro Timer with Logger — Spec & Automated Test Plan

## Overview
A single-file HTML Pomodoro timer app for Module 1 of the FITA course. No persistence (localStorage, APIs, databases). All state lives in memory only. The app helps users manage focused work sessions using the Pomodoro Technique with session logging, customizable durations, task labeling, and basic statistics.

## Tech Constraints (Module 1)
- **Single file**: Everything in one `index.html` (HTML + CSS + JS)
- **No persistence**: Data resets on page refresh
- **No external dependencies**: No libraries, frameworks, CDNs, or APIs
- **No build tools**: Opens directly in a browser

## Core Features

### F1: Timer Display
- Large, centered countdown timer showing `MM:SS` format
- Timer starts at 25:00 for work sessions, 05:00 for short breaks, 15:00 for long breaks
- A label above the timer indicates the current mode: "Work", "Short Break", or "Long Break"
- The page title (`<title>`) updates to show the current timer value and mode (e.g., "25:00 - Work | Pomodoro Timer")

### F2: Timer Controls
- **Start** button begins the countdown
- **Pause** button pauses the countdown (preserves remaining time)
- **Reset** button stops the timer and resets to the current mode's full duration
- Start and Pause are the same button that toggles label/state
- When timer is running, button shows "Pause"; when paused/stopped, shows "Start"
- Reset is always a separate button

### F3: Session Cycle Logic
- Standard Pomodoro cycle: Work → Short Break → Work → Short Break → Work → Short Break → Work → **Long Break** → repeat
- After every 4th work session, a long break triggers instead of a short break
- When a timer reaches 00:00, an audio alert plays (using Web Audio API — no external files)
- When a timer completes, the app auto-advances to the next session type but does NOT auto-start — user must press Start
- A visual indicator shows which session in the cycle the user is on (e.g., "Session 2 of 4")
- The completed sessions counter resets back to 0 after a long break completes

### F4: Task Labeling
- A text input above the timer lets the user type a task label (e.g., "Write chapter 3")
- The task label is attached to each completed work session in the log
- If no label is provided, the log entry shows "Untitled task"
- The input is always editable (even while timer runs)

### F5: Session Log
- A scrollable log section below the timer shows completed sessions
- Each log entry displays:
  - Session type (Work / Short Break / Long Break)
  - Task label (for work sessions only)
  - Duration that was set for that session (e.g., "25 min")
  - Completion timestamp in `HH:MM` 24-hour format
- Most recent entries appear at the top (reverse chronological)
- A "Clear Log" button removes all entries

### F6: Customizable Durations
- A settings panel (collapsible/expandable via a gear icon or "Settings" button)
- Three number inputs to customize:
  - Work duration (1–60 minutes, default 25)
  - Short break duration (1–30 minutes, default 5)
  - Long break duration (1–60 minutes, default 15)
- Changes apply to the **next** session of that type, not the currently running one
- Validation: values must be integers within the allowed ranges; invalid input is rejected/clamped

### F7: Statistics Dashboard
- A stats section showing:
  - Total completed work sessions (count)
  - Total focus time (sum of completed work session durations, displayed as "X hr Y min")
  - Current streak (consecutive completed work sessions without a reset mid-session)
- Stats reset when the page is refreshed (no persistence)

### F8: Visual & Audio Feedback
- The background color or a prominent accent color changes based on current mode:
  - Work: a warm/red-ish tone
  - Short Break: a cool/green-ish tone
  - Long Break: a cool/blue-ish tone
- A progress ring or progress bar that visually fills/depletes as the timer counts down
- Completion alert uses Web Audio API to generate a short beep/chime (no external audio files)
- The timer text should pulse or animate briefly when reaching 00:00

## UI/Layout Requirements
- Responsive: works on both desktop and mobile viewport widths
- Clean, modern design with clear visual hierarchy
- The timer should be the dominant visual element
- Settings panel should not clutter the main view (collapsible)

---

## Automated Test Cases

These tests are written as executable JavaScript that can be run in the browser console or injected into the page. Each test function returns `{ pass: boolean, message: string }`.

```javascript
// ============================================
// POMODORO TIMER — AUTOMATED TEST SUITE
// ============================================
// Paste this entire block into the browser console after loading index.html.
// Then call: runAllTests()

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
    const el = document.querySelector('[data-testid="timer-display"]')
      || document.getElementById('timer-display')
      || document.querySelector('.timer-display')
      || document.querySelector('[class*="timer"]');
    return el ? el.textContent.trim() : null;
  }

  function getModeLabel() {
    const el = document.querySelector('[data-testid="mode-label"]')
      || document.getElementById('mode-label')
      || document.querySelector('.mode-label');
    return el ? el.textContent.trim() : null;
  }

  function getStartPauseBtn() {
    return document.querySelector('[data-testid="start-pause-btn"]')
      || document.getElementById('start-pause-btn')
      || [...document.querySelectorAll('button')].find(b => /start|pause/i.test(b.textContent));
  }

  function getResetBtn() {
    return document.querySelector('[data-testid="reset-btn"]')
      || document.getElementById('reset-btn')
      || [...document.querySelectorAll('button')].find(b => /reset/i.test(b.textContent));
  }

  function getSessionIndicator() {
    return document.querySelector('[data-testid="session-indicator"]')
      || document.getElementById('session-indicator')
      || document.querySelector('.session-indicator');
  }

  function getLogEntries() {
    const container = document.querySelector('[data-testid="session-log"]')
      || document.getElementById('session-log')
      || document.querySelector('.session-log');
    if (!container) return [];
    return container.querySelectorAll('[data-testid="log-entry"], .log-entry, li, tr');
  }

  function getClearLogBtn() {
    return document.querySelector('[data-testid="clear-log-btn"]')
      || document.getElementById('clear-log-btn')
      || [...document.querySelectorAll('button')].find(b => /clear/i.test(b.textContent));
  }

  function getTaskInput() {
    return document.querySelector('[data-testid="task-input"]')
      || document.getElementById('task-input')
      || document.querySelector('input[type="text"][placeholder*="task" i]')
      || document.querySelector('input[type="text"]');
  }

  function getSettingsToggle() {
    return document.querySelector('[data-testid="settings-toggle"]')
      || document.getElementById('settings-toggle')
      || [...document.querySelectorAll('button')].find(b => /settings|gear|⚙/i.test(b.textContent));
  }

  function getWorkDurationInput() {
    return document.querySelector('[data-testid="work-duration"]')
      || document.getElementById('work-duration')
      || document.querySelector('input[name="work-duration"]');
  }

  function getShortBreakInput() {
    return document.querySelector('[data-testid="short-break-duration"]')
      || document.getElementById('short-break-duration')
      || document.querySelector('input[name="short-break-duration"]');
  }

  function getLongBreakInput() {
    return document.querySelector('[data-testid="long-break-duration"]')
      || document.getElementById('long-break-duration')
      || document.querySelector('input[name="long-break-duration"]');
  }

  function getStatsSection() {
    return document.querySelector('[data-testid="stats-section"]')
      || document.getElementById('stats-section')
      || document.querySelector('.stats-section, .stats');
  }

  function getProgressIndicator() {
    return document.querySelector('[data-testid="progress-bar"]')
      || document.querySelector('[data-testid="progress-ring"]')
      || document.querySelector('.progress-bar, .progress-ring, progress, .progress');
  }

  // ---- TEST GROUP 1: Initial State ----

  function testInitialTimerDisplay() {
    const text = getTimerText();
    assert(text === '25:00', 'T1.1 Initial timer shows 25:00', `Got: "${text}"`);
  }

  function testInitialModeLabel() {
    const mode = getModeLabel();
    assert(mode && /work/i.test(mode), 'T1.2 Initial mode label says Work', `Got: "${mode}"`);
  }

  function testInitialButtonState() {
    const btn = getStartPauseBtn();
    assert(btn && /start/i.test(btn.textContent), 'T1.3 Initial button says Start', `Got: "${btn?.textContent}"`);
  }

  function testResetButtonExists() {
    const btn = getResetBtn();
    assert(btn, 'T1.4 Reset button exists');
  }

  function testSessionIndicatorInitial() {
    const el = getSessionIndicator();
    assert(el && /1/i.test(el.textContent) && /4/i.test(el.textContent),
      'T1.5 Session indicator shows 1 of 4', `Got: "${el?.textContent}"`);
  }

  function testEmptyLogInitial() {
    const entries = getLogEntries();
    assert(entries.length === 0, 'T1.6 Session log is empty initially', `Got ${entries.length} entries`);
  }

  function testTaskInputExists() {
    const input = getTaskInput();
    assert(input, 'T1.7 Task input field exists');
  }

  function testPageTitleInitial() {
    assert(/25:00/.test(document.title) && /work/i.test(document.title),
      'T1.8 Page title contains timer and mode', `Got: "${document.title}"`);
  }

  function testProgressIndicatorExists() {
    const el = getProgressIndicator();
    assert(el, 'T1.9 Progress bar or ring exists');
  }

  function testStatsExist() {
    const el = getStatsSection();
    assert(el, 'T1.10 Statistics section exists');
    if (el) {
      const text = el.textContent;
      assert(/0/.test(text), 'T1.11 Stats show 0 completed sessions initially', `Got: "${text}"`);
    }
  }

  // ---- TEST GROUP 2: Timer Controls ----

  function testStartPauseToggle() {
    const btn = getStartPauseBtn();
    if (!btn) { assert(false, 'T2.1 Start/Pause toggle — button not found'); return; }

    btn.click(); // Start
    assert(/pause/i.test(btn.textContent), 'T2.1 Button says Pause after clicking Start', `Got: "${btn.textContent}"`);

    btn.click(); // Pause
    assert(/start/i.test(btn.textContent), 'T2.2 Button says Start after clicking Pause', `Got: "${btn.textContent}"`);
  }

  function testTimerCountsDown() {
    return new Promise(resolve => {
      const btn = getStartPauseBtn();
      // Make sure timer is reset first
      const resetBtn = getResetBtn();
      if (resetBtn) resetBtn.click();

      btn.click(); // Start
      setTimeout(() => {
        const text = getTimerText();
        btn.click(); // Pause
        const match = text && text !== '25:00';
        assert(match, 'T2.3 Timer counts down after start', `Got: "${text}"`);
        if (resetBtn) resetBtn.click();
        resolve();
      }, 1500);
    });
  }

  function testResetRestoresTime() {
    const btn = getStartPauseBtn();
    const resetBtn = getResetBtn();
    if (!btn || !resetBtn) { assert(false, 'T2.4 Reset — buttons not found'); return; }

    btn.click(); // Start
    return new Promise(resolve => {
      setTimeout(() => {
        btn.click(); // Pause
        resetBtn.click(); // Reset
        const text = getTimerText();
        assert(text === '25:00', 'T2.4 Reset restores timer to 25:00', `Got: "${text}"`);
        resolve();
      }, 1200);
    });
  }

  // ---- TEST GROUP 3: Settings ----

  function testSettingsPanel() {
    const toggle = getSettingsToggle();
    assert(toggle, 'T3.1 Settings toggle button exists');

    if (toggle) {
      toggle.click(); // Open

      const workInput = getWorkDurationInput();
      const shortInput = getShortBreakInput();
      const longInput = getLongBreakInput();

      assert(workInput, 'T3.2 Work duration input exists');
      assert(shortInput, 'T3.3 Short break duration input exists');
      assert(longInput, 'T3.4 Long break duration input exists');

      if (workInput) {
        assert(Number(workInput.value) === 25, 'T3.5 Work duration default is 25', `Got: ${workInput.value}`);
        assert(Number(workInput.min) >= 1, 'T3.6 Work duration min is at least 1', `Got min: ${workInput.min}`);
        assert(Number(workInput.max) <= 60, 'T3.7 Work duration max is at most 60', `Got max: ${workInput.max}`);
      }

      toggle.click(); // Close
    }
  }

  function testCustomDurationApplies() {
    const toggle = getSettingsToggle();
    if (toggle) toggle.click();

    const workInput = getWorkDurationInput();
    if (!workInput) { assert(false, 'T3.8 Custom duration — input not found'); return; }

    // Change to 10 minutes
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeSetter.call(workInput, '10');
    workInput.dispatchEvent(new Event('input', { bubbles: true }));
    workInput.dispatchEvent(new Event('change', { bubbles: true }));

    if (toggle) toggle.click();

    // Reset to apply new duration
    const resetBtn = getResetBtn();
    if (resetBtn) resetBtn.click();

    const text = getTimerText();
    assert(text === '10:00', 'T3.8 Custom work duration (10 min) applies after reset', `Got: "${text}"`);

    // Restore default
    if (toggle) toggle.click();
    if (workInput) {
      nativeSetter.call(workInput, '25');
      workInput.dispatchEvent(new Event('input', { bubbles: true }));
      workInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (toggle) toggle.click();
    if (resetBtn) resetBtn.click();
  }

  // ---- TEST GROUP 4: Task Labeling ----

  function testTaskInputAcceptsText() {
    const input = getTaskInput();
    if (!input) { assert(false, 'T4.1 Task input — not found'); return; }

    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeSetter.call(input, 'Write chapter 3');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    assert(input.value === 'Write chapter 3', 'T4.1 Task input accepts text');
  }

  // ---- TEST GROUP 5: Session Cycle Logic (simulated fast timer) ----

  function testSessionCycleAdvance() {
    // This test simulates completing a session by manipulating the timer
    // We need to check that the app exposes a way to force-complete or we test via fast mode

    // Check if there's a way to trigger session completion
    const completeBtn = document.querySelector('[data-testid="skip-btn"]');

    if (typeof window.pomodoroTestHelpers !== 'undefined' && window.pomodoroTestHelpers.completeSession) {
      window.pomodoroTestHelpers.completeSession();
      const mode = getModeLabel();
      assert(mode && /break/i.test(mode), 'T5.1 After completing work session, mode switches to break', `Got: "${mode}"`);

      const entries = getLogEntries();
      assert(entries.length >= 1, 'T5.2 Log has entry after session completion', `Got ${entries.length}`);
    } else {
      assert(false, 'T5.1 Session cycle test — expose window.pomodoroTestHelpers.completeSession() for testing');
      assert(false, 'T5.2 Session cycle test — requires test helpers');
    }
  }

  function testFullCycleToLongBreak() {
    if (typeof window.pomodoroTestHelpers === 'undefined' || !window.pomodoroTestHelpers.completeSession) {
      assert(false, 'T5.3 Full cycle test — requires window.pomodoroTestHelpers.completeSession()');
      return;
    }

    // Reset everything
    if (window.pomodoroTestHelpers.resetAll) window.pomodoroTestHelpers.resetAll();

    // Complete 4 work sessions + 3 short breaks = 7 completions
    for (let i = 0; i < 7; i++) {
      window.pomodoroTestHelpers.completeSession();
    }

    const mode = getModeLabel();
    assert(mode && /long\s*break/i.test(mode), 'T5.3 After 4 work sessions, mode is Long Break', `Got: "${mode}"`);
  }

  function testSessionCounterResetsAfterLongBreak() {
    if (typeof window.pomodoroTestHelpers === 'undefined' || !window.pomodoroTestHelpers.completeSession || !window.pomodoroTestHelpers.resetAll) {
      assert(false, 'T5.4 Session counter reset — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    // Complete full cycle: 4 work + 3 short breaks + 1 long break = 8
    for (let i = 0; i < 8; i++) {
      window.pomodoroTestHelpers.completeSession();
    }

    const indicator = getSessionIndicator();
    assert(indicator && /1/i.test(indicator.textContent) && /4/i.test(indicator.textContent),
      'T5.4 Session counter resets to 1 of 4 after long break', `Got: "${indicator?.textContent}"`);
  }

  // ---- TEST GROUP 6: Session Log ----

  function testLogEntryContent() {
    if (typeof window.pomodoroTestHelpers === 'undefined' || !window.pomodoroTestHelpers.resetAll || !window.pomodoroTestHelpers.completeSession) {
      assert(false, 'T6.1 Log entry content — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    const input = getTaskInput();
    if (input) {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(input, 'Test task alpha');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    window.pomodoroTestHelpers.completeSession();

    const entries = getLogEntries();
    assert(entries.length >= 1, 'T6.1 Log has at least one entry');

    if (entries.length > 0) {
      const firstEntry = entries[0].textContent;
      assert(/work/i.test(firstEntry), 'T6.2 Log entry contains session type "Work"', `Got: "${firstEntry}"`);
      assert(/test task alpha/i.test(firstEntry), 'T6.3 Log entry contains task label', `Got: "${firstEntry}"`);
      assert(/\d{1,2}:\d{2}/.test(firstEntry), 'T6.4 Log entry contains timestamp', `Got: "${firstEntry}"`);
      assert(/25\s*min|25:00/i.test(firstEntry), 'T6.5 Log entry contains duration', `Got: "${firstEntry}"`);
    }
  }

  function testUntitledTaskDefault() {
    if (typeof window.pomodoroTestHelpers === 'undefined' || !window.pomodoroTestHelpers.resetAll || !window.pomodoroTestHelpers.completeSession) {
      assert(false, 'T6.6 Untitled task — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    const input = getTaskInput();
    if (input) {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(input, '');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    window.pomodoroTestHelpers.completeSession();

    const entries = getLogEntries();
    if (entries.length > 0) {
      assert(/untitled/i.test(entries[0].textContent), 'T6.6 Empty task label defaults to "Untitled task"', `Got: "${entries[0].textContent}"`);
    }
  }

  function testClearLog() {
    if (typeof window.pomodoroTestHelpers === 'undefined' || !window.pomodoroTestHelpers.completeSession) {
      assert(false, 'T6.7 Clear log — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.completeSession();
    const clearBtn = getClearLogBtn();
    assert(clearBtn, 'T6.7 Clear Log button exists');

    if (clearBtn) {
      clearBtn.click();
      const entries = getLogEntries();
      assert(entries.length === 0, 'T6.8 Log is empty after Clear Log', `Got ${entries.length} entries`);
    }
  }

  function testLogReverseChronological() {
    if (typeof window.pomodoroTestHelpers === 'undefined' || !window.pomodoroTestHelpers.resetAll || !window.pomodoroTestHelpers.completeSession) {
      assert(false, 'T6.9 Reverse chronological — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    const input = getTaskInput();
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

    if (input) {
      nativeSetter.call(input, 'First task');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    window.pomodoroTestHelpers.completeSession(); // Work "First task"

    window.pomodoroTestHelpers.completeSession(); // Short break

    if (input) {
      nativeSetter.call(input, 'Second task');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    window.pomodoroTestHelpers.completeSession(); // Work "Second task"

    const entries = getLogEntries();
    if (entries.length >= 2) {
      const firstEntryText = entries[0].textContent;
      assert(/second task/i.test(firstEntryText), 'T6.9 Most recent entry appears first (reverse chronological)', `First entry: "${firstEntryText}"`);
    }
  }

  // ---- TEST GROUP 7: Statistics ----

  function testStatsUpdate() {
    if (typeof window.pomodoroTestHelpers === 'undefined' || !window.pomodoroTestHelpers.resetAll || !window.pomodoroTestHelpers.completeSession) {
      assert(false, 'T7.1 Stats update — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    // Complete one work session
    window.pomodoroTestHelpers.completeSession();

    const statsEl = getStatsSection();
    if (statsEl) {
      const text = statsEl.textContent;
      assert(/1/.test(text), 'T7.1 Stats show 1 completed work session', `Got: "${text}"`);
    }
  }

  function testStreakBreaksOnReset() {
    if (typeof window.pomodoroTestHelpers === 'undefined' || !window.pomodoroTestHelpers.resetAll || !window.pomodoroTestHelpers.completeSession) {
      assert(false, 'T7.2 Streak breaks on reset — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    // Complete 2 work sessions + breaks
    window.pomodoroTestHelpers.completeSession(); // Work 1
    window.pomodoroTestHelpers.completeSession(); // Break
    window.pomodoroTestHelpers.completeSession(); // Work 2

    // Now start a new work session and reset mid-session (streak should break)
    window.pomodoroTestHelpers.completeSession(); // Break
    const btn = getStartPauseBtn();
    if (btn) btn.click(); // Start work session 3

    const resetBtn = getResetBtn();
    if (resetBtn) resetBtn.click(); // Reset mid-session — streak should break

    const statsEl = getStatsSection();
    if (statsEl) {
      const text = statsEl.textContent;
      // Streak should be 0 after reset mid-session
      // Value may appear before or after the "Streak" label depending on layout
      const streakEl = document.getElementById('stat-streak') || document.querySelector('[data-testid="stats-section"] .stat-value:last-child');
      const streakVal = streakEl ? streakEl.textContent.trim() : text.match(/(\d+)\s*streak|streak\s*(\d+)/i);
      const streakIsZero = streakEl ? streakVal === '0' : /streak[:\s]*0|0\s*streak/i.test(text);
      assert(streakIsZero, 'T7.2 Streak resets to 0 after mid-session reset', `Stats text: "${text}"`);
    }
  }

  // ---- TEST GROUP 8: Visual Feedback ----

  function testModeColorChange() {
    if (typeof window.pomodoroTestHelpers === 'undefined' || !window.pomodoroTestHelpers.resetAll || !window.pomodoroTestHelpers.completeSession) {
      assert(false, 'T8.1 Mode color change — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    const bodyStyleBefore = getComputedStyle(document.body).backgroundColor;

    window.pomodoroTestHelpers.completeSession(); // Move to break

    const bodyStyleAfter = getComputedStyle(document.body).backgroundColor;
    // Check body or a wrapper element
    const wrapper = document.querySelector('.app, .container, #app, main') || document.body;
    const wrapperStyleAfter = getComputedStyle(wrapper).backgroundColor;

    assert(bodyStyleBefore !== bodyStyleAfter || bodyStyleBefore !== wrapperStyleAfter,
      'T8.1 Background/accent color changes between Work and Break modes',
      `Before: ${bodyStyleBefore}, After body: ${bodyStyleAfter}, After wrapper: ${wrapperStyleAfter}`);
  }

  function testProgressBarUpdates() {
    const progress = getProgressIndicator();
    assert(progress, 'T8.2 Progress indicator exists');
  }

  // ---- TEST GROUP 9: Audio ----

  function testAudioContextExists() {
    // Just verify Web Audio API setup exists in the code
    const scripts = document.querySelectorAll('script');
    let hasAudioCode = false;
    scripts.forEach(s => {
      if (/AudioContext|webkitAudioContext/i.test(s.textContent)) {
        hasAudioCode = true;
      }
    });
    // Also check inline scripts
    const allHTML = document.documentElement.innerHTML;
    if (/AudioContext|webkitAudioContext/.test(allHTML)) hasAudioCode = true;
    assert(hasAudioCode, 'T9.1 Web Audio API code present (AudioContext)');
  }

  // ---- TEST GROUP 10: Edge Cases ----

  function testSettingsValidation() {
    const toggle = getSettingsToggle();
    if (toggle) toggle.click();

    const workInput = getWorkDurationInput();
    if (!workInput) { assert(false, 'T10.1 Settings validation — input not found'); return; }

    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

    // Try setting to 0 (should be clamped/rejected)
    nativeSetter.call(workInput, '0');
    workInput.dispatchEvent(new Event('input', { bubbles: true }));
    workInput.dispatchEvent(new Event('change', { bubbles: true }));

    const resetBtn = getResetBtn();
    if (resetBtn) resetBtn.click();

    const text = getTimerText();
    assert(text !== '00:00', 'T10.1 Setting work duration to 0 is rejected/clamped', `Got: "${text}"`);

    // Try setting to 99 (should be clamped to 60)
    nativeSetter.call(workInput, '99');
    workInput.dispatchEvent(new Event('input', { bubbles: true }));
    workInput.dispatchEvent(new Event('change', { bubbles: true }));

    if (resetBtn) resetBtn.click();

    const text2 = getTimerText();
    const minutes = parseInt(text2);
    assert(minutes <= 60, 'T10.2 Setting work duration to 99 is clamped to max 60', `Got: "${text2}"`);

    // Restore
    nativeSetter.call(workInput, '25');
    workInput.dispatchEvent(new Event('input', { bubbles: true }));
    workInput.dispatchEvent(new Event('change', { bubbles: true }));
    if (toggle) toggle.click();
    if (resetBtn) resetBtn.click();
  }

  // ---- RUNNER ----

  window.runAllTests = async function() {
    results.length = 0;

    // Synchronous tests
    testInitialTimerDisplay();
    testInitialModeLabel();
    testInitialButtonState();
    testResetButtonExists();
    testSessionIndicatorInitial();
    testEmptyLogInitial();
    testTaskInputExists();
    testPageTitleInitial();
    testProgressIndicatorExists();
    testStatsExist();
    testStartPauseToggle();
    testSettingsPanel();
    testCustomDurationApplies();
    testTaskInputAcceptsText();
    testAudioContextExists();
    testProgressBarUpdates();

    // Async tests
    await testTimerCountsDown();
    await testResetRestoresTime();

    // Tests requiring test helpers
    testSessionCycleAdvance();
    testFullCycleToLongBreak();
    testSessionCounterResetsAfterLongBreak();
    testLogEntryContent();
    testUntitledTaskDefault();
    testClearLog();
    testLogReverseChronological();
    testStatsUpdate();
    testStreakBreaksOnReset();
    testModeColorChange();
    testSettingsValidation();

    // Final cleanup
    if (window.pomodoroTestHelpers && window.pomodoroTestHelpers.resetAll) {
      window.pomodoroTestHelpers.resetAll();
    }

    // Print results
    const passed = results.filter(r => r.pass).length;
    const failed = results.filter(r => !r.pass).length;
    console.log(`\n${'='.repeat(50)}`);
    console.log(`POMODORO TIMER TEST RESULTS: ${passed} passed, ${failed} failed, ${results.length} total`);
    console.log('='.repeat(50));
    results.forEach(r => {
      console.log(`${r.pass ? '✅' : '❌'} ${r.test} — ${r.message}`);
    });
    console.log(`${'='.repeat(50)}\n`);

    return { passed, failed, total: results.length, results };
  };

  console.log('Pomodoro test suite loaded. Run: runAllTests()');
})();
```

## Required Test Helpers

The app MUST expose the following on `window.pomodoroTestHelpers` for automated testing:

```javascript
window.pomodoroTestHelpers = {
  // Instantly completes the current session (as if timer reached 00:00)
  completeSession: function() { /* ... */ },

  // Resets all state: timer, cycle position, log, stats
  resetAll: function() { /* ... */ }
};
```

## Data-testid Requirements

The app MUST include these `data-testid` attributes for reliable test targeting:

| Element | data-testid |
|---|---|
| Timer display (MM:SS) | `timer-display` |
| Mode label (Work/Break) | `mode-label` |
| Start/Pause button | `start-pause-btn` |
| Reset button | `reset-btn` |
| Session indicator (X of 4) | `session-indicator` |
| Session log container | `session-log` |
| Each log entry | `log-entry` |
| Clear Log button | `clear-log-btn` |
| Task input | `task-input` |
| Settings toggle | `settings-toggle` |
| Work duration input | `work-duration` |
| Short break input | `short-break-duration` |
| Long break input | `long-break-duration` |
| Stats section | `stats-section` |
| Progress bar/ring | `progress-bar` or `progress-ring` |
