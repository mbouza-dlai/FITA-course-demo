# Pomodoro Timer v3 — Advanced Features Spec

## Overview
v3 builds on the working v2. All v1+v2 features and test IDs must remain intact. v3 adds: a focus score algorithm, tag/category system for tasks, log filtering, an interactive timer adjustment feature, bulk session templates, and a "focus mode" that dims non-essential UI elements.

Still a single `index.html` file, no persistence, no external dependencies.

## New Features for v3

### F15: Focus Score
- Calculate a "focus score" from 0–100 based on session behavior
- Formula: `score = min(100, Math.round((completedSessions / dailyGoal) * 50 + (streak / dailyGoal) * 30 + (noResets ? 20 : 0)))`
  - `noResets` is true if the user has never reset a running work session during this page load
- Display as a prominent number with a label "Focus Score" in the stats section
- `data-testid="focus-score"` on the score display
- The score updates after each work session completion and after resets
- Color-coded: 0-39 = red (#e74c3c), 40-69 = orange (#f39c12), 70-100 = green (#27ae60)

### F16: Task Tags/Categories
- Below the task input, add a row of clickable tag buttons: "Work", "Study", "Personal", "Creative", "Health"
- Each tag button has `data-testid="tag-btn"` and a `data-tag="tagname"` attribute
- Clicking a tag toggles it (adds/removes from current selection)
- Selected tags are visually highlighted (e.g., filled background)
- Only ONE tag can be selected at a time (radio-style)
- The selected tag is stored with log entries alongside the task label
- Each log entry for a work session shows its tag as a small badge
- `data-testid="tag-selector"` on the tag row container
- Default: no tag selected (logged as "Untagged")

### F17: Log Filtering
- Above the session log, add a filter bar with buttons for: "All", "Work", "Short Break", "Long Break"
- `data-testid="log-filter"` on the filter bar container
- Each filter button has `data-testid="filter-btn"` and `data-filter="all|work|short_break|long_break"` attribute
- Clicking a filter shows only log entries of that type; "All" shows everything
- Active filter is visually highlighted
- Default filter: "All"
- Additionally, if tags exist, add a tag filter dropdown: `data-testid="tag-filter"`
  - Options: "All Tags" + each unique tag that appears in the log
  - Both filters work together (intersection): e.g., "Work" filter + "Study" tag = only work sessions tagged "Study"

### F18: Interactive Timer Adjustment
- While the timer is NOT running, clicking (or tapping) the timer display should allow +/- 5 minute adjustments
- Two small buttons appear on hover/focus near the timer: "+" and "-" (or arrow buttons)
- `data-testid="timer-increment"` and `data-testid="timer-decrement"` on these buttons
- Increment adds 5 minutes (capped at the current mode's max: work=60, short break=30, long break=60)
- Decrement removes 5 minutes (capped at minimum 1 minute)
- These buttons are disabled when the timer is running
- Adjustments update both the timer display and the total duration (for progress ring calculation)

### F19: Session Templates (Quick Start)
- A "Quick Start" section above the timer with 3 preset buttons:
  - "Sprint" = 15 min work / 3 min short / 10 min long
  - "Standard" = 25 min work / 5 min short / 15 min long
  - "Deep Work" = 50 min work / 10 min short / 30 min long
- `data-testid="templates-section"` on the container
- Each template button has `data-testid="template-btn"` and `data-template="sprint|standard|deep-work"`
- Clicking a template updates ALL duration settings and resets the current timer
- The active template is visually highlighted
- Changing settings manually in the settings panel deselects any active template

### F20: Focus Mode
- A toggle button (eye icon or "Focus Mode" text) in the header area
- `data-testid="focus-mode-toggle"` on the toggle
- When activated:
  - The settings section, stats section, session log, history chart, and templates section get `opacity: 0.15` and `pointer-events: none`
  - Only the timer, controls, task input, and mode label remain fully visible
  - The body background becomes slightly darker
  - The toggle shows it's active (e.g., different icon or filled state)
- `data-testid="focus-mode-overlay"` on a wrapper/class that applies the dimming
- When deactivated, everything returns to normal
- Focus mode does NOT affect functionality — timers keep running, sessions still complete, stats still update
- Add `[data-focus-mode="true"]` attribute to the body or app wrapper when active

## Updated Test Helpers

```javascript
window.pomodoroTestHelpers = {
  completeSession: function() { /* ... */ },
  resetAll: function() { /* ... */ },
  getState: function() {
    return {
      mode: '...',
      cycleIndex: 0,
      timeRemaining: 1500,
      isRunning: false,
      completedSessions: 0,
      streak: 0,
      dailyGoal: 8,
      autoStart: false,
      logLength: 0,
      focusScore: 0,
      selectedTag: null,
      focusMode: false,
      activeTemplate: null,
      noResets: true
    };
  }
};
```

## Additional data-testid Requirements (v3)

| Element | data-testid |
|---|---|
| Focus score display | `focus-score` |
| Tag selector container | `tag-selector` |
| Each tag button | `tag-btn` (+ data-tag attribute) |
| Log filter bar | `log-filter` |
| Each filter button | `filter-btn` (+ data-filter attribute) |
| Tag filter dropdown | `tag-filter` |
| Timer increment button | `timer-increment` |
| Timer decrement button | `timer-decrement` |
| Templates section | `templates-section` |
| Each template button | `template-btn` (+ data-template attribute) |
| Focus mode toggle | `focus-mode-toggle` |
| Focus mode overlay/wrapper | `focus-mode-overlay` |

---

## v3 Automated Test Suite

```javascript
// ============================================
// POMODORO TIMER v3 — ADDITIONAL TEST SUITE
// ============================================
// Run AFTER v1+v2 test suites. Paste into console, then call: runV3Tests()

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
    return document.querySelector('[data-testid="timer-display"]')?.textContent.trim();
  }

  function getModeLabel() {
    return document.querySelector('[data-testid="mode-label"]')?.textContent.trim();
  }

  function getLogEntries() {
    const c = document.querySelector('[data-testid="session-log"]');
    return c ? c.querySelectorAll('[data-testid="log-entry"]') : [];
  }

  // Utility: set input value
  function setInput(el, val) {
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeSetter.call(el, String(val));
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // ---- TEST GROUP 18: Focus Score ----

  function testFocusScoreExists() {
    const el = document.querySelector('[data-testid="focus-score"]');
    assert(el, 'T18.1 Focus score element exists');
  }

  function testFocusScoreInitialValue() {
    if (window.pomodoroTestHelpers?.resetAll) window.pomodoroTestHelpers.resetAll();

    const el = document.querySelector('[data-testid="focus-score"]');
    if (el) {
      // With noResets=true and 0 sessions, formula gives: min(100, round(0 + 0 + 20)) = 20
      const val = parseInt(el.textContent);
      assert(val === 20, 'T18.2 Focus score starts at 20 (noResets bonus only)', `Got: "${el.textContent}"`);
    }
  }

  function testFocusScoreIncreasesAfterSession() {
    if (!window.pomodoroTestHelpers?.resetAll || !window.pomodoroTestHelpers?.completeSession) {
      assert(false, 'T18.3 Focus score increases — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();
    window.pomodoroTestHelpers.completeSession(); // Work 1

    const el = document.querySelector('[data-testid="focus-score"]');
    if (el) {
      const val = parseInt(el.textContent);
      assert(val > 0, 'T18.3 Focus score increases after completing a work session', `Got: ${val}`);
    }
  }

  function testFocusScoreFormula() {
    if (!window.pomodoroTestHelpers?.resetAll || !window.pomodoroTestHelpers?.completeSession || !window.pomodoroTestHelpers?.getState) {
      assert(false, 'T18.4 Focus score formula — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    // Complete 2 work sessions (with breaks between)
    window.pomodoroTestHelpers.completeSession(); // Work
    window.pomodoroTestHelpers.completeSession(); // Break
    window.pomodoroTestHelpers.completeSession(); // Work

    const state = window.pomodoroTestHelpers.getState();
    const expected = Math.min(100, Math.round((state.completedSessions / state.dailyGoal) * 50 + (state.streak / state.dailyGoal) * 30 + (state.noResets ? 20 : 0)));

    const el = document.querySelector('[data-testid="focus-score"]');
    if (el) {
      const val = parseInt(el.textContent);
      assert(val === expected, 'T18.4 Focus score matches formula', `Expected: ${expected}, Got: ${val}`);
    }
  }

  function testFocusScoreColorCoding() {
    if (!window.pomodoroTestHelpers?.resetAll) {
      assert(false, 'T18.5 Focus score color — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    const el = document.querySelector('[data-testid="focus-score"]');
    if (el) {
      // Score is 0 initially — should be red
      const color = getComputedStyle(el).color;
      // RGB for red (#e74c3c) is approximately rgb(231, 76, 60)
      assert(color.includes('231') || color.includes('e74c3c') || /red/i.test(color),
        'T18.5 Focus score is red-colored at 0', `Got color: ${color}`);
    }
  }

  // ---- TEST GROUP 19: Task Tags ----

  function testTagSelectorExists() {
    const el = document.querySelector('[data-testid="tag-selector"]');
    assert(el, 'T19.1 Tag selector container exists');
  }

  function testTagButtonsExist() {
    const btns = document.querySelectorAll('[data-testid="tag-btn"]');
    assert(btns.length === 5, 'T19.2 There are 5 tag buttons', `Got: ${btns.length}`);

    const expectedTags = ['work', 'study', 'personal', 'creative', 'health'];
    const actualTags = [...btns].map(b => b.getAttribute('data-tag')?.toLowerCase());
    const allPresent = expectedTags.every(t => actualTags.includes(t));
    assert(allPresent, 'T19.3 All expected tags present (work, study, personal, creative, health)', `Got: ${actualTags.join(', ')}`);
  }

  function testTagSelection() {
    if (window.pomodoroTestHelpers?.resetAll) window.pomodoroTestHelpers.resetAll();

    const btns = document.querySelectorAll('[data-testid="tag-btn"]');
    if (btns.length === 0) { assert(false, 'T19.4 Tag selection — no tag buttons'); return; }

    // Click first tag
    btns[0].click();

    const state = window.pomodoroTestHelpers?.getState?.();
    if (state) {
      assert(state.selectedTag !== null, 'T19.4 Clicking a tag selects it', `selectedTag: ${state.selectedTag}`);
    }

    // Click same tag again to deselect
    btns[0].click();
    const state2 = window.pomodoroTestHelpers?.getState?.();
    if (state2) {
      assert(state2.selectedTag === null, 'T19.5 Clicking selected tag deselects it', `selectedTag: ${state2.selectedTag}`);
    }
  }

  function testTagRadioBehavior() {
    if (window.pomodoroTestHelpers?.resetAll) window.pomodoroTestHelpers.resetAll();

    const btns = document.querySelectorAll('[data-testid="tag-btn"]');
    if (btns.length < 2) { assert(false, 'T19.6 Tag radio — not enough buttons'); return; }

    btns[0].click(); // Select first
    btns[1].click(); // Select second — should deselect first

    const state = window.pomodoroTestHelpers?.getState?.();
    if (state) {
      const secondTag = btns[1].getAttribute('data-tag');
      assert(state.selectedTag === secondTag, 'T19.6 Only one tag selected at a time (radio behavior)', `selectedTag: ${state.selectedTag}, expected: ${secondTag}`);
    }

    // Clean up
    btns[1].click(); // deselect
  }

  function testTagAppearsInLog() {
    if (!window.pomodoroTestHelpers?.resetAll || !window.pomodoroTestHelpers?.completeSession) {
      assert(false, 'T19.7 Tag in log — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    const btns = document.querySelectorAll('[data-testid="tag-btn"]');
    if (btns.length > 0) btns[0].click(); // Select a tag

    const tagName = btns[0]?.getAttribute('data-tag');

    window.pomodoroTestHelpers.completeSession(); // Complete work session

    const entries = getLogEntries();
    if (entries.length > 0) {
      const entryText = entries[0].textContent.toLowerCase();
      assert(entryText.includes(tagName), 'T19.7 Log entry contains the selected tag', `Tag: "${tagName}", Entry: "${entries[0].textContent}"`);
    }
  }

  function testUntaggedDefault() {
    if (!window.pomodoroTestHelpers?.resetAll || !window.pomodoroTestHelpers?.completeSession) {
      assert(false, 'T19.8 Untagged default — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    // Don't select any tag
    window.pomodoroTestHelpers.completeSession();

    const entries = getLogEntries();
    if (entries.length > 0) {
      const text = entries[0].textContent.toLowerCase();
      assert(text.includes('untag'), 'T19.8 No tag selected logs as "Untagged"', `Got: "${entries[0].textContent}"`);
    }
  }

  // ---- TEST GROUP 20: Log Filtering ----

  function testLogFilterBarExists() {
    const el = document.querySelector('[data-testid="log-filter"]');
    assert(el, 'T20.1 Log filter bar exists');
  }

  function testFilterButtons() {
    const btns = document.querySelectorAll('[data-testid="filter-btn"]');
    assert(btns.length >= 4, 'T20.2 At least 4 filter buttons exist', `Got: ${btns.length}`);

    const filters = [...btns].map(b => b.getAttribute('data-filter'));
    assert(filters.includes('all'), 'T20.3 "All" filter exists');
    assert(filters.includes('work'), 'T20.4 "Work" filter exists');
  }

  function testFilterShowsOnlyMatchingEntries() {
    if (!window.pomodoroTestHelpers?.resetAll || !window.pomodoroTestHelpers?.completeSession) {
      assert(false, 'T20.5 Filter matching — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    // Create mixed log: work + break + work
    window.pomodoroTestHelpers.completeSession(); // Work
    window.pomodoroTestHelpers.completeSession(); // Break
    window.pomodoroTestHelpers.completeSession(); // Work

    // Click "Work" filter
    const workFilter = document.querySelector('[data-testid="filter-btn"][data-filter="work"]');
    if (workFilter) {
      workFilter.click();

      const visibleEntries = [...getLogEntries()].filter(e => {
        const style = getComputedStyle(e);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });

      assert(visibleEntries.length === 2, 'T20.5 Work filter shows only 2 work entries', `Got: ${visibleEntries.length} visible`);
    }

    // Reset to "All"
    const allFilter = document.querySelector('[data-testid="filter-btn"][data-filter="all"]');
    if (allFilter) allFilter.click();
  }

  function testTagFilterExists() {
    const el = document.querySelector('[data-testid="tag-filter"]');
    assert(el, 'T20.6 Tag filter dropdown exists');
  }

  // ---- TEST GROUP 21: Timer Adjustment ----

  function testTimerAdjustmentButtonsExist() {
    const inc = document.querySelector('[data-testid="timer-increment"]');
    const dec = document.querySelector('[data-testid="timer-decrement"]');
    assert(inc, 'T21.1 Timer increment button exists');
    assert(dec, 'T21.2 Timer decrement button exists');
  }

  function testTimerIncrementAdds5Min() {
    if (window.pomodoroTestHelpers?.resetAll) window.pomodoroTestHelpers.resetAll();

    const inc = document.querySelector('[data-testid="timer-increment"]');
    if (!inc) { assert(false, 'T21.3 Increment — button not found'); return; }

    inc.click();
    const text = getTimerText();
    assert(text === '30:00', 'T21.3 Increment adds 5 minutes (25:00 → 30:00)', `Got: "${text}"`);
  }

  function testTimerDecrementRemoves5Min() {
    if (window.pomodoroTestHelpers?.resetAll) window.pomodoroTestHelpers.resetAll();

    const dec = document.querySelector('[data-testid="timer-decrement"]');
    if (!dec) { assert(false, 'T21.4 Decrement — button not found'); return; }

    dec.click();
    const text = getTimerText();
    assert(text === '20:00', 'T21.4 Decrement removes 5 minutes (25:00 → 20:00)', `Got: "${text}"`);
  }

  function testTimerDecrementFloor() {
    if (window.pomodoroTestHelpers?.resetAll) window.pomodoroTestHelpers.resetAll();

    const dec = document.querySelector('[data-testid="timer-decrement"]');
    if (!dec) { assert(false, 'T21.5 Decrement floor — button not found'); return; }

    // Click decrement 6 times from 25 min → 20 → 15 → 10 → 5 → 1 (should stop at 1)
    for (let i = 0; i < 6; i++) dec.click();

    const text = getTimerText();
    const minutes = parseInt(text);
    assert(minutes >= 1, 'T21.5 Timer decrement does not go below 1 minute', `Got: "${text}"`);
  }

  function testTimerIncrementCap() {
    if (window.pomodoroTestHelpers?.resetAll) window.pomodoroTestHelpers.resetAll();

    const inc = document.querySelector('[data-testid="timer-increment"]');
    if (!inc) { assert(false, 'T21.6 Increment cap — button not found'); return; }

    // Click increment 10 times from 25 min → 30 → 35 → ... → 60 (cap)
    for (let i = 0; i < 10; i++) inc.click();

    const text = getTimerText();
    const minutes = parseInt(text);
    assert(minutes <= 60, 'T21.6 Timer increment capped at 60 minutes for Work', `Got: "${text}"`);
  }

  function testTimerAdjustDisabledWhenRunning() {
    if (window.pomodoroTestHelpers?.resetAll) window.pomodoroTestHelpers.resetAll();

    const startBtn = document.querySelector('[data-testid="start-pause-btn"]');
    startBtn.click(); // Start timer

    const inc = document.querySelector('[data-testid="timer-increment"]');
    const dec = document.querySelector('[data-testid="timer-decrement"]');

    const incDisabled = inc?.disabled || inc?.getAttribute('disabled') !== null;
    const decDisabled = dec?.disabled || dec?.getAttribute('disabled') !== null;

    assert(incDisabled, 'T21.7 Increment button disabled when timer running');
    assert(decDisabled, 'T21.8 Decrement button disabled when timer running');

    startBtn.click(); // Pause
    if (window.pomodoroTestHelpers?.resetAll) window.pomodoroTestHelpers.resetAll();
  }

  // ---- TEST GROUP 22: Session Templates ----

  function testTemplatesSectionExists() {
    const el = document.querySelector('[data-testid="templates-section"]');
    assert(el, 'T22.1 Templates section exists');
  }

  function testTemplateButtons() {
    const btns = document.querySelectorAll('[data-testid="template-btn"]');
    assert(btns.length === 3, 'T22.2 Three template buttons exist', `Got: ${btns.length}`);

    const templates = [...btns].map(b => b.getAttribute('data-template'));
    assert(templates.includes('sprint'), 'T22.3 Sprint template exists');
    assert(templates.includes('standard'), 'T22.4 Standard template exists');
    assert(templates.includes('deep-work'), 'T22.5 Deep Work template exists');
  }

  function testSprintTemplateApplies() {
    if (window.pomodoroTestHelpers?.resetAll) window.pomodoroTestHelpers.resetAll();

    const sprintBtn = document.querySelector('[data-testid="template-btn"][data-template="sprint"]');
    if (!sprintBtn) { assert(false, 'T22.6 Sprint template — button not found'); return; }

    sprintBtn.click();

    const text = getTimerText();
    assert(text === '15:00', 'T22.6 Sprint template sets timer to 15:00', `Got: "${text}"`);

    // Verify settings also updated
    const toggle = document.querySelector('[data-testid="settings-toggle"]');
    if (toggle) toggle.click();

    const workInput = document.querySelector('[data-testid="work-duration"]');
    const shortInput = document.querySelector('[data-testid="short-break-duration"]');
    const longInput = document.querySelector('[data-testid="long-break-duration"]');

    if (workInput) assert(Number(workInput.value) === 15, 'T22.7 Sprint sets work duration to 15', `Got: ${workInput.value}`);
    if (shortInput) assert(Number(shortInput.value) === 3, 'T22.8 Sprint sets short break to 3', `Got: ${shortInput.value}`);
    if (longInput) assert(Number(longInput.value) === 10, 'T22.9 Sprint sets long break to 10', `Got: ${longInput.value}`);

    if (toggle) toggle.click();
  }

  function testDeepWorkTemplateApplies() {
    if (window.pomodoroTestHelpers?.resetAll) window.pomodoroTestHelpers.resetAll();

    const deepBtn = document.querySelector('[data-testid="template-btn"][data-template="deep-work"]');
    if (!deepBtn) { assert(false, 'T22.10 Deep Work template — button not found'); return; }

    deepBtn.click();

    const text = getTimerText();
    assert(text === '50:00', 'T22.10 Deep Work template sets timer to 50:00', `Got: "${text}"`);
  }

  function testManualSettingsDeselectTemplate() {
    if (window.pomodoroTestHelpers?.resetAll) window.pomodoroTestHelpers.resetAll();

    // Select standard template first
    const stdBtn = document.querySelector('[data-testid="template-btn"][data-template="standard"]');
    if (stdBtn) stdBtn.click();

    // Manually change work duration
    const toggle = document.querySelector('[data-testid="settings-toggle"]');
    if (toggle) toggle.click();

    const workInput = document.querySelector('[data-testid="work-duration"]');
    if (workInput) setInput(workInput, '20');

    if (toggle) toggle.click();

    const state = window.pomodoroTestHelpers?.getState?.();
    if (state) {
      assert(state.activeTemplate === null, 'T22.11 Manual settings change deselects active template', `activeTemplate: ${state.activeTemplate}`);
    }
  }

  // ---- TEST GROUP 23: Focus Mode ----

  function testFocusModeToggleExists() {
    const el = document.querySelector('[data-testid="focus-mode-toggle"]');
    assert(el, 'T23.1 Focus mode toggle exists');
  }

  function testFocusModeActivation() {
    if (window.pomodoroTestHelpers?.resetAll) window.pomodoroTestHelpers.resetAll();

    const toggle = document.querySelector('[data-testid="focus-mode-toggle"]');
    if (!toggle) { assert(false, 'T23.2 Focus mode — toggle not found'); return; }

    toggle.click(); // Activate

    const app = document.querySelector('[data-focus-mode="true"]') || document.body.getAttribute('data-focus-mode') === 'true';
    assert(app, 'T23.2 Focus mode sets data-focus-mode="true"');

    const state = window.pomodoroTestHelpers?.getState?.();
    if (state) {
      assert(state.focusMode === true, 'T23.3 getState shows focusMode=true', `focusMode: ${state.focusMode}`);
    }
  }

  function testFocusModeDimsElements() {
    // Focus mode should be active from previous test
    const overlay = document.querySelector('[data-testid="focus-mode-overlay"]');
    assert(overlay, 'T23.4 Focus mode overlay/wrapper exists');

    // Check that stats section is dimmed
    const stats = document.querySelector('[data-testid="stats-section"]');
    if (stats) {
      const opacity = parseFloat(getComputedStyle(stats).opacity);
      assert(opacity < 0.5, 'T23.5 Stats section is dimmed in focus mode', `opacity: ${opacity}`);
    }

    // Timer should still be visible
    const timer = document.querySelector('[data-testid="timer-display"]');
    if (timer) {
      const opacity = parseFloat(getComputedStyle(timer).opacity);
      assert(opacity >= 0.9, 'T23.6 Timer remains visible in focus mode', `opacity: ${opacity}`);
    }
  }

  function testFocusModeDeactivation() {
    const toggle = document.querySelector('[data-testid="focus-mode-toggle"]');
    if (!toggle) { assert(false, 'T23.7 Focus mode deactivation — toggle not found'); return; }

    toggle.click(); // Deactivate

    const attr = document.querySelector('[data-focus-mode="true"]');
    const bodyAttr = document.body.getAttribute('data-focus-mode');
    assert(!attr && bodyAttr !== 'true', 'T23.7 Focus mode deactivated — data-focus-mode removed');

    const stats = document.querySelector('[data-testid="stats-section"]');
    if (stats) {
      const opacity = parseFloat(getComputedStyle(stats).opacity);
      assert(opacity >= 0.9, 'T23.8 Stats section opacity restored after focus mode off', `opacity: ${opacity}`);
    }
  }

  function testFocusModeTimerStillWorks() {
    if (!window.pomodoroTestHelpers?.resetAll || !window.pomodoroTestHelpers?.completeSession || !window.pomodoroTestHelpers?.getState) {
      assert(false, 'T23.9 Focus mode timer — requires test helpers');
      return;
    }

    window.pomodoroTestHelpers.resetAll();

    // Activate focus mode
    const toggle = document.querySelector('[data-testid="focus-mode-toggle"]');
    if (toggle) toggle.click();

    // Complete a session — should still work
    window.pomodoroTestHelpers.completeSession();

    const state = window.pomodoroTestHelpers.getState();
    assert(state.completedSessions === 1, 'T23.9 Sessions still complete in focus mode', `completedSessions: ${state.completedSessions}`);

    // Cleanup: deactivate focus mode
    if (toggle) toggle.click();
    window.pomodoroTestHelpers.resetAll();
  }

  // ---- TEST GROUP 24: Updated getState ----

  function testGetStateV3Fields() {
    if (!window.pomodoroTestHelpers?.getState) {
      assert(false, 'T24.1 getState v3 — not found');
      return;
    }

    const state = window.pomodoroTestHelpers.getState();
    assert('focusScore' in state, 'T24.1 getState has focusScore');
    assert('selectedTag' in state, 'T24.2 getState has selectedTag');
    assert('focusMode' in state, 'T24.3 getState has focusMode');
    assert('activeTemplate' in state, 'T24.4 getState has activeTemplate');
    assert('noResets' in state, 'T24.5 getState has noResets');
  }

  // ---- RUNNER ----

  window.runV3Tests = async function() {
    results.length = 0;

    // Focus Score
    testFocusScoreExists();
    testFocusScoreInitialValue();
    testFocusScoreIncreasesAfterSession();
    testFocusScoreFormula();
    testFocusScoreColorCoding();

    // Tags
    testTagSelectorExists();
    testTagButtonsExist();
    testTagSelection();
    testTagRadioBehavior();
    testTagAppearsInLog();
    testUntaggedDefault();

    // Log Filtering
    testLogFilterBarExists();
    testFilterButtons();
    testFilterShowsOnlyMatchingEntries();
    testTagFilterExists();

    // Timer Adjustment
    testTimerAdjustmentButtonsExist();
    testTimerIncrementAdds5Min();
    testTimerDecrementRemoves5Min();
    testTimerDecrementFloor();
    testTimerIncrementCap();
    testTimerAdjustDisabledWhenRunning();

    // Templates
    testTemplatesSectionExists();
    testTemplateButtons();
    testSprintTemplateApplies();
    testDeepWorkTemplateApplies();
    testManualSettingsDeselectTemplate();

    // Focus Mode
    testFocusModeToggleExists();
    testFocusModeActivation();
    testFocusModeDimsElements();
    testFocusModeDeactivation();
    testFocusModeTimerStillWorks();

    // getState v3
    testGetStateV3Fields();

    // Cleanup
    if (window.pomodoroTestHelpers?.resetAll) window.pomodoroTestHelpers.resetAll();

    const passed = results.filter(r => r.pass).length;
    const failed = results.filter(r => !r.pass).length;
    console.log(`\n${'='.repeat(50)}`);
    console.log(`POMODORO TIMER v3 TEST RESULTS: ${passed} passed, ${failed} failed, ${results.length} total`);
    console.log('='.repeat(50));
    results.forEach(r => {
      console.log(`${r.pass ? '✅' : '❌'} ${r.test} — ${r.message}`);
    });
    console.log(`${'='.repeat(50)}\n`);

    return { passed, failed, total: results.length, results };
  };

  console.log('Pomodoro v3 test suite loaded. Run: runV3Tests()');
})();
```
