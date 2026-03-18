// ── Persistence is handled by the backend JSON API ────────────

// ── DOM refs ──────────────────────────────────────────────────
const setupModal          = document.getElementById('setupModal');
const setupNameInput      = document.getElementById('setupName');
const setupThresholdInput = document.getElementById('setupThreshold');
const setupSaveBtn        = document.getElementById('setupSave');
const setupNameError      = document.getElementById('setupNameError');
const setupThresholdError = document.getElementById('setupThresholdError');

const alertBanner    = document.getElementById('alertBanner');
const alertMessageEl = document.getElementById('alertMessage');
const alertDismissBtn = document.getElementById('alertDismiss');

const greetingEl    = document.getElementById('greeting');
const openSettingsBtn = document.getElementById('openSettings');
const settingsPanel = document.getElementById('settingsPanel');
const settingsNameInput      = document.getElementById('settingsName');
const settingsThresholdInput = document.getElementById('settingsThreshold');
const settingsSaveBtn   = document.getElementById('settingsSave');
const settingsMessageEl = document.getElementById('settingsMessage');

const sleepForm      = document.getElementById('sleepForm');
const sleepDateInput = document.getElementById('sleepDate');
let datePicker = null; // flatpickr instance
const sleepStartInput = document.getElementById('sleepStart');
const sleepEndInput  = document.getElementById('sleepEnd');
const formMessageEl  = document.getElementById('formMessage');

const goalPill          = document.getElementById('goalPill');
const statsRow          = document.getElementById('statsRow');
const chartMonthLabel   = document.getElementById('chartMonthLabel');
const prevMonthBtn      = document.getElementById('prevMonth');
const nextMonthBtn      = document.getElementById('nextMonth');
const chartCanvas       = document.getElementById('sleepChart');
const chartEmptyEl      = document.getElementById('chartEmpty');
const pointPopover      = document.getElementById('pointPopover');
const popoverDateEl     = document.getElementById('popoverDate');
const popoverTimesEl    = document.getElementById('popoverTimes');
const popoverEditBtn    = document.getElementById('popoverEdit');

const sleepLogEl      = document.getElementById('sleepLog');
const sleepLogEmptyEl = document.getElementById('sleepLogEmpty');
const clearAllBtn     = document.getElementById('clearAll');
const openLogBtn      = document.getElementById('openLog');
const logModal        = document.getElementById('logModal');
const closeLogBtn     = document.getElementById('closeLog');
const editModal       = document.getElementById('editModal');
const editEntryIdInput = document.getElementById('editEntryId');
const editDateInput   = document.getElementById('editDate');
const editStartInput  = document.getElementById('editStart');
const editEndInput    = document.getElementById('editEnd');
const editMessageEl   = document.getElementById('editMessage');
const editSaveBtn     = document.getElementById('editSave');
const closeEditBtn    = document.getElementById('closeEdit');
const closeEditBtn2   = document.getElementById('closeEdit2');

// ── State ──────────────────────────────────────────────────────
let userData  = null;
let entries   = [];
let pendingAlert = null;
let chart     = null;
let viewYear  = new Date().getFullYear();
let viewMonth = new Date().getMonth(); // 0-based

// ── Storage helpers (JSON backend) ─────────────────────────────
async function loadData() {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error('Failed to load data');
    const data = await res.json();
    userData = data.user ?? null;
    entries = Array.isArray(data.entries) ? data.entries : [];
    pendingAlert = data.pendingAlert ?? null;
  } catch (err) {
    console.error('Could not load persisted data:', err);
    userData = null;
    entries = [];
    pendingAlert = null;
  }
}

async function saveData() {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: userData, entries, pendingAlert }),
    });
    if (!res.ok) throw new Error('Failed to save data');
  } catch (err) {
    console.error('Could not save data:', err);
  }
}

function saveUser(data) {
  userData = data;
  saveData();
}

function saveEntries() {
  saveData();
}

// ── Time / duration helpers ────────────────────────────────────
function calcDuration(bedtime, wakeTime) {
  const [bh, bm] = bedtime.split(':').map(Number);
  const [wh, wm] = wakeTime.split(':').map(Number);
  let bedMins  = bh * 60 + bm;
  let wakeMins = wh * 60 + wm;
  if (wakeMins <= bedMins) wakeMins += 24 * 60; // crosses midnight
  return (wakeMins - bedMins) / 60;
}

function formatDuration(hours) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function todayString() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function formatDateDisplay(dateStr) {
  const [y, mo, d] = dateStr.split('-').map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function timeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── Init ──────────────────────────────────────────────────────
async function init() {
  await loadData();

  if (!userData) {
    setupModal.hidden = false;
    setupNameInput.focus();
  } else {
    startApp();
  }
}

function startApp() {
  updateGreeting();
  checkAlert();
  const today = todayString();
  if (!datePicker) {
    datePicker = flatpickr(sleepDateInput, {
      dateFormat: 'Y-m-d',
      maxDate: 'today',
      defaultDate: today,
      disableMobile: true,
    });
  } else {
    datePicker.setDate(today, false);
  }
  renderLog();
  renderChart();
}

function updateGreeting() {
  greetingEl.textContent = `${timeOfDay()}, ${userData.name}!`;
  goalPill.textContent   = `Goal: ${userData.threshold}h`;
}

// ── Setup modal ───────────────────────────────────────────────
setupSaveBtn.addEventListener('click', () => {
  const name      = setupNameInput.value.trim();
  const threshold = parseFloat(setupThresholdInput.value);
  let valid = true;

  if (!name) {
    setupNameError.hidden = false;
    setupNameInput.focus();
    valid = false;
  } else {
    setupNameError.hidden = true;
  }

  if (!threshold || threshold < 1 || threshold > 24) {
    setupThresholdError.hidden = false;
    if (valid) setupThresholdInput.focus();
    valid = false;
  } else {
    setupThresholdError.hidden = true;
  }

  if (!valid) return;

  userData = { name, threshold };
  saveUser(userData);
  setupModal.hidden = true;
  startApp();
});

setupNameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') setupSaveBtn.click();
});

// ── Alert ─────────────────────────────────────────────────────
function checkAlert() {
  if (!pendingAlert) return;
  const { date, duration } = pendingAlert;
  alertMessageEl.textContent =
    `You only got ${formatDuration(duration)} of sleep on ${formatDateDisplay(date)} — `
    + `below your ${userData.threshold}h goal.`;
  alertBanner.hidden = false;
}

function showAlert(date, duration) {
  pendingAlert = { date, duration };
  saveData();
  alertMessageEl.textContent =
    `You only got ${formatDuration(duration)} of sleep on ${formatDateDisplay(date)} — `
    + `below your ${userData.threshold}h goal.`;
  alertBanner.hidden = false;
}

alertDismissBtn.addEventListener('click', () => {
  alertBanner.hidden = true;
  pendingAlert = null;
  saveData();
});

// ── Settings ──────────────────────────────────────────────────
openSettingsBtn.addEventListener('click', () => {
  const willOpen = settingsPanel.hidden;
  settingsPanel.hidden = !willOpen;
  openSettingsBtn.setAttribute('aria-expanded', String(willOpen));

  if (willOpen) {
    settingsNameInput.value      = userData.name;
    settingsThresholdInput.value = userData.threshold;
    settingsNameInput.focus();
  }
});

settingsSaveBtn.addEventListener('click', () => {
  const name      = settingsNameInput.value.trim();
  const threshold = parseFloat(settingsThresholdInput.value);

  if (!name) { settingsNameInput.focus(); return; }
  if (!threshold || threshold < 1 || threshold > 24) { settingsThresholdInput.focus(); return; }

  userData = { name, threshold };
  saveUser(userData);

  updateGreeting();
  renderChart(); // redraw threshold line

  settingsMessageEl.textContent = 'Settings saved!';
  settingsMessageEl.className   = 'form-message form-message--success';
  setTimeout(() => {
    settingsMessageEl.textContent = '';
    settingsMessageEl.className   = 'form-message';
  }, 2500);
});

// ── Sleep form ────────────────────────────────────────────────
sleepForm.addEventListener('submit', e => {
  e.preventDefault();

  const date     = sleepDateInput.value;
  const bedtime  = sleepStartInput.value;
  const wakeTime = sleepEndInput.value;

  if (!date || !bedtime || !wakeTime) {
    showFormMessage('Please fill in all three fields.', false);
    return;
  }

  if (entries.some(en => en.date === date)) {
    showFormMessage(`An entry for ${formatDateDisplay(date)} already exists.`, false);
    return;
  }

  const duration = calcDuration(bedtime, wakeTime);
  if (duration <= 0 || duration > 24) {
    showFormMessage('Duration looks invalid — please check your times.', false);
    return;
  }

  const entry = {
    id: Date.now(),
    date,
    bedtime,
    wakeTime,
    duration,
  };

  entries.push(entry);
  entries.sort((a, b) => a.date.localeCompare(b.date));
  saveEntries();

  if (duration < userData.threshold) {
    showAlert(date, duration);
  }

  renderLog();
  renderChart();

  sleepStartInput.value = '';
  sleepEndInput.value   = '';
  datePicker.setDate(todayString(), false);
  showFormMessage('Sleep entry saved!', true);
});

function showFormMessage(text, success) {
  formMessageEl.textContent = text;
  formMessageEl.className   = 'form-message' + (success ? ' form-message--success' : ' form-message--error');
  if (success) {
    setTimeout(() => {
      formMessageEl.textContent = '';
      formMessageEl.className   = 'form-message';
    }, 3000);
  }
}

// ── Point popover ──────────────────────────────────────────────
let popoverEntryId = null;

function showPointPopover(entry, xPx, yPx) {
  popoverEntryId = entry.id;
  popoverDateEl.textContent  = formatDateDisplay(entry.date);
  popoverTimesEl.textContent =
    `${entry.bedtime} → ${entry.wakeTime} · ${formatDuration(entry.duration)}`;

  // Temporarily show to measure width
  pointPopover.hidden = false;
  const pw = pointPopover.offsetWidth;
  const ph = pointPopover.offsetHeight;
  const wrap = chartCanvas.parentElement;  // .chart-wrap
  const wrapW = wrap.offsetWidth;

  // Position above the point, centred horizontally, clamped to wrap bounds
  let left = xPx - pw / 2;
  let top  = yPx - ph - 14;
  left = Math.max(0, Math.min(left, wrapW - pw));
  if (top < 0) top = yPx + 18; // flip below if too close to top

  pointPopover.style.left = `${left}px`;
  pointPopover.style.top  = `${top}px`;
}

function hidePointPopover() {
  pointPopover.hidden = true;
  popoverEntryId = null;
}

popoverEditBtn.addEventListener('click', () => {
  const entry = entries.find(e => e.id === popoverEntryId);
  hidePointPopover();
  if (entry) openEditModal(entry);
});

// Dismiss popover on outside click
document.addEventListener('click', e => {
  if (!pointPopover.hidden && !pointPopover.contains(e.target) && e.target !== chartCanvas) {
    hidePointPopover();
  }
});

// ── Log modal ──────────────────────────────────────────────────
openLogBtn.addEventListener('click', () => { logModal.hidden = false; });
closeLogBtn.addEventListener('click', () => { logModal.hidden = true; });
logModal.addEventListener('click', e => { if (e.target === logModal) logModal.hidden = true; });

// ── Edit modal ────────────────────────────────────────────────
function openEditModal(entry) {
  editEntryIdInput.value = String(entry.id);
  editDateInput.value    = formatDateDisplay(entry.date);
  editStartInput.value   = entry.bedtime;
  editEndInput.value     = entry.wakeTime;
  editMessageEl.textContent = '';
  editMessageEl.className   = 'form-message';
  editModal.hidden = false;
  editStartInput.focus();
}

function closeEditModal() { editModal.hidden = true; }
closeEditBtn.addEventListener('click', closeEditModal);
closeEditBtn2.addEventListener('click', closeEditModal);
editModal.addEventListener('click', e => { if (e.target === editModal) closeEditModal(); });

editSaveBtn.addEventListener('click', () => {
  const id       = Number(editEntryIdInput.value);
  const bedtime  = editStartInput.value;
  const wakeTime = editEndInput.value;

  if (!bedtime || !wakeTime) {
    editMessageEl.textContent = 'Please fill in both times.';
    editMessageEl.className   = 'form-message form-message--error';
    return;
  }

  const duration = calcDuration(bedtime, wakeTime);
  if (duration <= 0 || duration > 24) {
    editMessageEl.textContent = 'Duration looks invalid — please check your times.';
    editMessageEl.className   = 'form-message form-message--error';
    return;
  }

  const entry = entries.find(e => e.id === id);
  if (!entry) return;
  entry.bedtime  = bedtime;
  entry.wakeTime = wakeTime;
  entry.duration = duration;
  saveEntries();

  if (duration < userData.threshold) {
    showAlert(entry.date, duration);
  }

  renderLog();
  renderChart();
  closeEditModal();
});

// ── Log rendering ─────────────────────────────────────────────
function renderLog() {
  sleepLogEl.innerHTML = '';

  if (entries.length === 0) {
    sleepLogEmptyEl.hidden = false;
    clearAllBtn.disabled   = true;
    openLogBtn.disabled    = true;
    return;
  }

  sleepLogEmptyEl.hidden = true;
  clearAllBtn.disabled   = false;
  openLogBtn.disabled    = false;

  // Newest first
  [...entries].reverse().forEach(entry => {
    const belowGoal = entry.duration < userData.threshold;

    const li = document.createElement('li');
    li.className = 'log-item' + (belowGoal ? ' log-item--below' : '');

    const dateEl = document.createElement('div');
    dateEl.className   = 'log-item-date';
    dateEl.textContent = formatDateDisplay(entry.date);

    const timesEl = document.createElement('div');
    timesEl.className   = 'log-item-times';
    timesEl.textContent = `${entry.bedtime} → ${entry.wakeTime}`;

    const durationEl = document.createElement('div');
    durationEl.className   = `log-item-duration ${belowGoal ? 'duration--below' : 'duration--ok'}`;
    durationEl.textContent = formatDuration(entry.duration);

    const editBtn = document.createElement('button');
    editBtn.className  = 'btn btn--icon';
    editBtn.dataset.editId = String(entry.id);
    editBtn.setAttribute('aria-label', `Edit entry for ${formatDateDisplay(entry.date)}`);
    editBtn.textContent = '✎';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn--icon';
    deleteBtn.dataset.deleteId = String(entry.id);
    deleteBtn.setAttribute('aria-label', `Delete entry for ${formatDateDisplay(entry.date)}`);
    deleteBtn.textContent = '✕';

    li.append(dateEl, timesEl, durationEl, editBtn, deleteBtn);
    sleepLogEl.appendChild(li);
  });
}

sleepLogEl.addEventListener('click', e => {
  const editBtn = e.target.closest('[data-edit-id]');
  if (editBtn) {
    const entry = entries.find(en => en.id === Number(editBtn.dataset.editId));
    if (entry) openEditModal(entry);
    return;
  }
  const deleteBtn = e.target.closest('[data-delete-id]');
  if (!deleteBtn) return;
  const id = Number(deleteBtn.dataset.deleteId);
  entries = entries.filter(en => en.id !== id);
  saveEntries();
  renderLog();
  renderChart();
});

clearAllBtn.addEventListener('click', () => {
  if (!confirm('Delete all sleep entries? This cannot be undone.')) return;
  entries = [];
  pendingAlert = null;
  saveData();
  alertBanner.hidden = true;
  renderLog();
  renderChart();
});

// ── Month navigation ─────────────────────────────────────────
prevMonthBtn.addEventListener('click', () => {
  viewMonth--;
  if (viewMonth < 0) { viewMonth = 11; viewYear--; }
  renderChart();
});

nextMonthBtn.addEventListener('click', () => {
  viewMonth++;
  if (viewMonth > 11) { viewMonth = 0; viewYear++; }
  renderChart();
});

function updateMonthNav() {
  const now = new Date();
  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();
  nextMonthBtn.disabled = isCurrentMonth;
  const label = new Date(viewYear, viewMonth, 1)
    .toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  chartMonthLabel.textContent = isCurrentMonth ? 'This Month' : label;
}

// ── Stats summary ────────────────────────────────────────────
function calcStreak() {
  if (entries.length === 0) return 0;
  let streak = 0;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].duration >= userData.threshold) streak++;
    else break;
  }
  return streak;
}

function renderStats() {
  // Filter entries to the viewed month
  const mm = String(viewMonth + 1).padStart(2, '0');
  const prefix = `${viewYear}-${mm}-`;
  const recent = entries.filter(e => e.date.startsWith(prefix));
  if (recent.length === 0) {
    statsRow.hidden = true;
    return;
  }
  statsRow.hidden = false;

  const durations = recent.map(e => e.duration);
  const avg       = durations.reduce((s, d) => s + d, 0) / durations.length;
  const onTarget  = durations.filter(d => d >= userData.threshold).length;
  const best      = Math.max(...durations);
  const streak    = calcStreak();

  document.getElementById('statAvg').textContent      = formatDuration(avg);
  document.getElementById('statOnTarget').textContent = `${onTarget} / ${recent.length}`;
  document.getElementById('statBest').textContent     = formatDuration(best);
  document.getElementById('statStreak').textContent   = streak === 1 ? '1 night' : `${streak} nights`;

  // Colour on-target count: coral if under half, teal otherwise
  const onTargetEl = document.getElementById('statOnTarget');
  onTargetEl.classList.toggle('stat-value--warn', onTarget < Math.ceil(recent.length / 2));
}

// ── Chart ─────────────────────────────────────────────────────

// Custom plugin: shade the goal zone (above threshold) in subtle teal
const goalZonePlugin = {
  id: 'goalZone',
  beforeDraw(chartInstance) {
    const { ctx, chartArea, scales } = chartInstance;
    if (!chartArea || !scales.y) return;
    const yGoal = scales.y.getPixelForValue(userData.threshold);
    ctx.save();
    // Goal zone — teal tint above the threshold line
    ctx.fillStyle = 'rgba(26, 140, 140, 0.07)';
    ctx.fillRect(chartArea.left, chartArea.top, chartArea.width, yGoal - chartArea.top);
    // Faint label in the zone
    ctx.font = '11px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = 'rgba(26, 140, 140, 0.45)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('goal zone', chartArea.right - 6, chartArea.top + 5);
    ctx.restore();
  },
};

// Custom plugin: draw a ▼ marker + deficit label below each below-goal point
const belowGoalMarkerPlugin = {
  id: 'belowGoalMarker',
  afterDatasetsDraw(chartInstance) {
    const meta = chartInstance.getDatasetMeta(0); // sleep line
    const { ctx } = chartInstance;
    const threshold = userData.threshold;

    meta.data.forEach((point, i) => {
      const duration = chartInstance.data.datasets[0].data[i];
      if (duration === null || duration === undefined || duration >= threshold) return;

      const deficit = parseFloat((threshold - duration).toFixed(2));
      const x = point.x;
      const y = point.y;

      ctx.save();

      // Triangle marker pointing up into the dot
      ctx.beginPath();
      ctx.moveTo(x, y + 6);
      ctx.lineTo(x - 6, y + 17);
      ctx.lineTo(x + 6, y + 17);
      ctx.closePath();
      ctx.fillStyle = '#E8706A';
      ctx.fill();

      // Deficit label below triangle
      ctx.font = 'bold 11px "Segoe UI", system-ui, sans-serif';
      ctx.fillStyle = '#c9534f';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`-${formatDuration(deficit)}`, x, y + 19);

      ctx.restore();
    });
  },
};

function renderChart() {
  updateMonthNav();
  renderStats();

  // Build the full viewed-month day grid (day 1 → last day of month)
  const now        = new Date();
  const year       = viewYear;
  const month      = viewMonth;          // 0-based
  const totalDays  = new Date(year, month + 1, 0).getDate(); // all days in month

  const monthDates = [];  // 'YYYY-MM-DD' strings
  for (let d = 1; d <= totalDays; d++) {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    monthDates.push(`${year}-${mm}-${dd}`);
  }

  // Map entries by date for O(1) lookup
  const entryByDate = {};
  entries.forEach(e => { entryByDate[e.date] = e; });

  // Durations aligned to the grid (null = no entry yet)
  const durations = monthDates.map(date =>
    entryByDate[date] ? parseFloat(entryByDate[date].duration.toFixed(2)) : null
  );

  const hasSomeData = durations.some(d => d !== null);
  if (!hasSomeData) {
    chartEmptyEl.hidden = false;
    chartCanvas.hidden  = true;
    if (chart) { chart.destroy(); chart = null; }
    return;
  }

  chartEmptyEl.hidden = true;
  chartCanvas.hidden  = false;

  const labels = monthDates.map(date => {
    const [y, mo, d] = date.split('-').map(Number);
    return new Date(y, mo - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  });

  const threshold = userData.threshold;

  // Compute avg from filled entries only (ignore nulls)
  const filledDurations = durations.filter(d => d !== null);
  const avg = parseFloat(
    (filledDurations.reduce((s, d) => s + d, 0) / filledDurations.length).toFixed(2)
  );

  // Per-point colours: coral for below-goal, teal otherwise, transparent for null
  const pointColors  = durations.map(d => d === null ? 'transparent' : d < threshold ? '#E8706A' : '#1A8C8C');
  const pointBorders = durations.map(d => d === null ? 'transparent' : d < threshold ? '#c9534f' : '#157373');
  const pointRadii   = durations.map(d => d === null ? 0 : d < threshold ? 7 : 5);

  const newData = {
    labels,
    datasets: [
      // 0 — main sleep line (must stay index 0 for the plugin)
      {
        label: 'Sleep Duration',
        data: durations,
        borderColor: '#1A8C8C',
        borderWidth: 2.5,
        tension: 0,
        spanGaps: false,
        pointBackgroundColor: pointColors,
        pointBorderColor: pointBorders,
        pointRadius: pointRadii,
        pointHoverRadius: pointRadii.map(r => r === 0 ? 0 : r + 2),
        fill: false,
        order: 3,
      },
      // 1 — goal line
      {
        label: `Goal (${threshold}h)`,
        data: Array(monthDates.length).fill(threshold),
        borderColor: '#F5B42A',
        borderWidth: 2,
        borderDash: [7, 4],
        pointRadius: 0,
        fill: false,
        tension: 0,
        order: 2,
      },
      // 2 — average line
      {
        label: `Avg (${formatDuration(avg)})`,
        data: Array(monthDates.length).fill(avg),
        borderColor: '#8B3DAE',
        borderWidth: 1.8,
        borderDash: [4, 3],
        pointRadius: 0,
        fill: false,
        tension: 0,
        order: 1,
      },
    ],
  };

  if (chart) {
    chart.data = newData;
    chart.update();
    return;
  }

  chart = new Chart(chartCanvas, {
    type: 'line',
    data: newData,
    plugins: [goalZonePlugin, belowGoalMarkerPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { bottom: 32 } }, // room for deficit labels
      onClick(event, elements) {
        // Only react to clicks on dataset 0 (sleep line) with actual data
        const hit = elements.find(el => el.datasetIndex === 0);
        if (!hit) { hidePointPopover(); return; }
        const date = monthDates[hit.index];
        const entry = entryByDate[date];
        if (!entry) { hidePointPopover(); return; }
        // Get pixel position of the clicked point relative to the chart-wrap
        const meta  = chart.getDatasetMeta(0);
        const point = meta.data[hit.index];
        const rect  = chartCanvas.getBoundingClientRect();
        const wrapRect = chartCanvas.parentElement.getBoundingClientRect();
        const xPx = point.x;
        const yPx = point.y;
        showPointPopover(entry, xPx, yPx);
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#1a1a1a',
            font: { family: '"Segoe UI", system-ui, sans-serif', size: 13 },
            padding: 20,
            usePointStyle: true,
            pointStyleWidth: 44,
            generateLabels(chartInst) {
              return chartInst.data.datasets.map((ds, i) => {
                const W = 44, H = 14;
                const cv = document.createElement('canvas');
                cv.width = W; cv.height = H;
                const c = cv.getContext('2d');

                // Draw the line
                c.strokeStyle = ds.borderColor;
                c.lineWidth   = 2;
                if (ds.borderDash) c.setLineDash(ds.borderDash);
                c.beginPath();
                c.moveTo(0, H / 2);
                c.lineTo(W, H / 2);
                c.stroke();

                // Sleep Duration: add a filled circle in the centre
                if (i === 0) {
                  c.setLineDash([]);
                  c.fillStyle = ds.borderColor;
                  c.beginPath();
                  c.arc(W / 2, H / 2, 4, 0, Math.PI * 2);
                  c.fill();
                }

                return {
                  text: ds.label,
                  fillStyle:   ds.borderColor,
                  strokeStyle: ds.borderColor,
                  pointStyle:  cv,
                  hidden:      !chartInst.isDatasetVisible(i),
                  datasetIndex: i,
                };
              });
            },
          },
        },
        tooltip: {
          callbacks: {
            label(ctx) {
              if (ctx.datasetIndex === 0) {
                const d = ctx.raw;
                const deficit = d < threshold
                  ? `  ↓ ${formatDuration(parseFloat((threshold - d).toFixed(2)))} below goal`
                  : '  ✓ Goal met';
                return [`${formatDuration(d)}`, deficit];
              }
              if (ctx.datasetIndex === 1) return `Goal: ${formatDuration(threshold)}`;
              return `Avg: ${formatDuration(avg)}`;
            },
          },
        },
      },
      onHover(event, elements) {
        const hit = elements.find(el => el.datasetIndex === 0);
        const hasDatum = hit && entryByDate[monthDates[hit.index]];
        event.native.target.style.cursor = hasDatum ? 'pointer' : 'default';
      },
      scales: {
        y: {
          beginAtZero: false,
          suggestedMin: Math.max(0, Math.min(...filledDurations) - 1.5),
          suggestedMax: Math.max(threshold + 2, Math.max(...filledDurations) + 1),
          title: {
            display: true,
            text: 'Hours',
            color: '#6b7280',
            font: { size: 12 },
          },
          grid:  { color: 'rgba(0,0,0,0.06)' },
          ticks: {
            color: '#6b7280',
            callback: v => `${v}h`,
          },
        },
        x: {
          grid:  { display: false },
          ticks: { color: '#6b7280' },
        },
      },
    },
  });
}

// ── Bootstrap ──────────────────────────────────────────────────
init();
