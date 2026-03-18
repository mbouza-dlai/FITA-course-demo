const reminderForm = document.getElementById("reminderForm");
const reminderTitleInput = document.getElementById("reminderTitle");
const reminderDateInput = document.getElementById("reminderDate");
const reminderTimeInput = document.getElementById("reminderTime");
const reminderLabelInput = document.getElementById("reminderLabel");
const reminderCustomLabelInput = document.getElementById("reminderCustomLabel");
const customLabelFieldElement = reminderCustomLabelInput;
const reminderRepeatInput = document.getElementById("reminderRepeat");
const formMessage = document.getElementById("formMessage");

const CUSTOM_LABEL_VALUE = "__custom__";
const PRESET_LABELS = ["Medication", "Water", "Meeting", "Workout", "General"];
const customLabels = [];

function resolveLabel(selectValue, customValue) {
  return selectValue === CUSTOM_LABEL_VALUE ? customValue : selectValue;
}

function dateStringFromDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function timeStringFromDate(d) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function getNextOccurrence(remindAt, repeat) {
  const next = new Date(remindAt.getTime());
  if (repeat === "daily") {
    next.setDate(next.getDate() + 1);
  } else if (repeat === "weekly") {
    next.setDate(next.getDate() + 7);
  } else if (repeat === "monthly") {
    next.setMonth(next.getMonth() + 1);
  }
  return next;
}

function injectCustomLabelOption(selectElement, label) {
  const customOption = selectElement.querySelector(`option[value="${CUSTOM_LABEL_VALUE}"]`);
  const option = document.createElement("option");
  option.value = label;
  option.textContent = label;
  selectElement.insertBefore(option, customOption);
}

function registerCustomLabel(label) {
  if (customLabels.includes(label)) {
    return;
  }
  customLabels.push(label);
  injectCustomLabelOption(reminderLabelInput, label);
}
const reminderListElement = document.getElementById("reminderList");
const reminderTemplate = document.getElementById("reminderTemplate");
const reminderCountElement = document.getElementById("reminderCount");
const notificationInfoElement = document.getElementById("notificationInfo");
const filterButtons = Array.from(document.querySelectorAll(".filter-button"));

const reminders = [];
let currentFilter = "all";
let nextReminderId = 1;
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();
let calSelectedDate = null;

function normalizeText(value) {
  return value.trim();
}

function toReminderDate(dateValue, timeValue) {
  return new Date(`${dateValue}T${timeValue}:00`);
}

function formatReminderDateTime(targetDate) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(targetDate);
}

let formMessageTimer = null;

function setFormMessage(text, isSuccess = false) {
  if (formMessageTimer) { clearTimeout(formMessageTimer); formMessageTimer = null; }
  formMessage.textContent = text;
  formMessage.classList.remove("message--success");
  if (isSuccess && text) {
    void formMessage.offsetWidth; // restart animation
    formMessage.classList.add("message--success");
    formMessageTimer = setTimeout(() => {
      formMessage.textContent = "";
      formMessage.classList.remove("message--success");
      formMessageTimer = null;
    }, 3000);
  }
}

function setNotificationInfo(text) {
  notificationInfoElement.textContent = text;
}

function updateCount() {
  const visibleCount = getFilteredReminders().length;
  reminderCountElement.textContent = `${visibleCount} reminder${visibleCount === 1 ? "" : "s"}`;
}

function getFilteredReminders() {
  if (currentFilter === "active") {
    return reminders.filter((reminder) => !reminder.completed);
  }

  if (currentFilter === "completed") {
    return reminders.filter((reminder) => reminder.completed);
  }

  return reminders;
}

function clearList() {
  reminderListElement.innerHTML = "";
}

function buildEmptyState() {
  const item = document.createElement("li");
  item.className = "empty-state";

  if (currentFilter === "completed") {
    item.textContent = "No completed reminders yet.";
    return item;
  }

  if (currentFilter === "active") {
    item.textContent = "No active reminders right now.";
    return item;
  }

  item.textContent = "No reminders yet. Add one using the form above.";
  return item;
}

function askNotificationPermissionIfNeeded() {
  if (!("Notification" in window)) {
    setNotificationInfo("Notifications are not supported in this browser. Alerts will be used instead.");
    return;
  }

  if (Notification.permission === "granted") {
    setNotificationInfo("Notifications are enabled.");
    return;
  }

  if (Notification.permission === "denied") {
    setNotificationInfo("Notifications are blocked. The app will use alerts instead.");
    return;
  }

  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      setNotificationInfo("Notifications enabled. You will be notified at reminder time.");
    } else {
      setNotificationInfo("Notifications not granted. The app will use alerts instead.");
    }
  });
}

function triggerReminderNotification(reminder) {
  const message = `${reminder.title} (${reminder.label})`;

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Reminder", { body: message });
    return;
  }

  alert(`Reminder: ${message}`);
}

function cancelTimer(reminder) {
  if (reminder.timerId !== null) {
    clearTimeout(reminder.timerId);
    reminder.timerId = null;
  }
}

function scheduleNotification(reminder) {
  cancelTimer(reminder);

  if (reminder.completed) {
    return;
  }

  const now = Date.now();
  const remindAt = reminder.remindAt.getTime();
  const delay = remindAt - now;

  if (delay <= 0) {
    return;
  }

  reminder.timerId = window.setTimeout(() => {
    const instanceKey = dateStringFromDate(reminder.remindAt);
    if (!reminder.completed && !reminder.skippedDates.has(instanceKey)) {
      triggerReminderNotification(reminder);
    }

    reminder.timerId = null;

    if (reminder.repeat !== "none" && !reminder.completed) {
      const next = getNextOccurrence(reminder.remindAt, reminder.repeat);
      reminder.remindAt = next;
      reminder.date = dateStringFromDate(next);
      reminder.time = timeStringFromDate(next);
      scheduleNotification(reminder);
    }

    renderReminders();
  }, delay);
}

function createReminderItem(reminder) {
  const item = reminderTemplate.content.firstElementChild.cloneNode(true);
  const titleElement = item.querySelector(".reminder-title");
  const labelElement = item.querySelector(".reminder-label");
  const whenElement = item.querySelector(".reminder-when");
  const statusElement = item.querySelector(".reminder-status");
  const editButton = item.querySelector(".edit-reminder");
  const toggleButton = item.querySelector(".toggle-reminder");
  const deleteButton = item.querySelector(".delete-reminder");
  const editForm = item.querySelector(".edit-form");
  const cancelEditButton = item.querySelector(".cancel-edit");
  const editTitleInput = item.querySelector(".edit-title");
  const editDateInput = item.querySelector(".edit-date");
  const editTimeInput = item.querySelector(".edit-time");
  const editLabelInput = item.querySelector(".edit-label");
  const editCustomLabelInput = item.querySelector(".edit-custom-label");
  const editCustomLabelField = editCustomLabelInput;
  const editMessage = item.querySelector(".edit-message");
  const repeatElement = item.querySelector(".reminder-repeat");
  const editRepeatInput = item.querySelector(".edit-repeat");

  customLabels.forEach((label) => injectCustomLabelOption(editLabelInput, label));

  editLabelInput.addEventListener("change", () => {
    editCustomLabelField.hidden = editLabelInput.value !== CUSTOM_LABEL_VALUE;
    if (!editCustomLabelField.hidden) {
      editCustomLabelInput.focus();
    }
  });

  const currentInstanceKey = dateStringFromDate(reminder.remindAt);
  const instanceSkipped = reminder.skippedDates.has(currentInstanceKey);

  const REPEAT_LABELS = { daily: "Daily", weekly: "Weekly", monthly: "Monthly" };

  titleElement.textContent = reminder.title;
  labelElement.textContent = reminder.label;
  whenElement.textContent = `Scheduled: ${formatReminderDateTime(reminder.remindAt)}`;
  repeatElement.textContent = reminder.repeat !== "none" ? `Repeats: ${REPEAT_LABELS[reminder.repeat] ?? reminder.repeat}` : "";
  repeatElement.hidden = reminder.repeat === "none";
  statusElement.textContent = reminder.completed
    ? "Status: Completed"
    : instanceSkipped
    ? "Status: Next occurrence marked done"
    : "Status: Active";
  toggleButton.textContent = reminder.completed ? "Mark Active" : "Mark Complete";

  if (reminder.completed) {
    item.classList.add("completed");
  }

  editButton.addEventListener("click", () => {
    editForm.hidden = !editForm.hidden;
    editMessage.textContent = "";

    if (!editForm.hidden) {
      editTitleInput.value = reminder.title;
      editDateInput.value = reminder.date;
      editTimeInput.value = reminder.time;

      if (PRESET_LABELS.includes(reminder.label) || customLabels.includes(reminder.label)) {
        editLabelInput.value = reminder.label;
        editCustomLabelField.hidden = true;
      } else {
        editLabelInput.value = CUSTOM_LABEL_VALUE;
        editCustomLabelInput.value = reminder.label;
        editCustomLabelField.hidden = false;
      }

      editRepeatInput.value = reminder.repeat;
      editTitleInput.focus();
    }
  });

  cancelEditButton.addEventListener("click", () => {
    editForm.hidden = true;
    editMessage.textContent = "";
  });

  editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    editMessage.textContent = "";

    const updatedTitle = normalizeText(editTitleInput.value);
    const updatedDate = normalizeText(editDateInput.value);
    const updatedTime = normalizeText(editTimeInput.value);
    const updatedSelectedLabel = normalizeText(editLabelInput.value);
    const updatedCustomLabel = normalizeText(editCustomLabelInput.value);
    const updatedLabel = resolveLabel(updatedSelectedLabel, updatedCustomLabel);
    const updatedRepeat = editRepeatInput.value;

    if (!updatedTitle || !updatedDate || !updatedTime || !updatedSelectedLabel) {
      editMessage.textContent = "All fields are required.";
      return;
    }

    if (updatedSelectedLabel === CUSTOM_LABEL_VALUE && !updatedCustomLabel) {
      editMessage.textContent = "Please enter a custom label.";
      editCustomLabelInput.focus();
      return;
    }

    const updatedDateTime = toReminderDate(updatedDate, updatedTime);
    if (Number.isNaN(updatedDateTime.getTime())) {
      editMessage.textContent = "Enter a valid date and time.";
      return;
    }

    if (updatedDateTime.getTime() <= Date.now()) {
      editMessage.textContent = "Reminder time must be in the future.";
      return;
    }

    reminder.title = updatedTitle;
    reminder.date = updatedDate;
    reminder.time = updatedTime;
    reminder.label = updatedLabel;
    reminder.repeat = updatedRepeat;
    reminder.remindAt = updatedDateTime;
    reminder.completed = false;
    if (updatedSelectedLabel === CUSTOM_LABEL_VALUE) {
      registerCustomLabel(updatedLabel);
      editLabelInput.value = updatedLabel;
      editCustomLabelField.hidden = true;
    }
    scheduleNotification(reminder);
    renderReminders();
  });

  toggleButton.addEventListener("click", () => {
    reminder.completed = !reminder.completed;

    if (reminder.completed) {
      cancelTimer(reminder);
    } else {
      scheduleNotification(reminder);
    }

    renderReminders();
  });

  deleteButton.addEventListener("click", () => {
    const reminderIndex = reminders.findIndex((itemReminder) => itemReminder.id === reminder.id);
    if (reminderIndex === -1) {
      return;
    }

    cancelTimer(reminder);
    reminders.splice(reminderIndex, 1);
    renderReminders();
    renderCalendar();
  });

  return item;
}

function renderReminders() {
  clearList();

  const sortedReminders = [...getFilteredReminders()].sort(
    (left, right) => left.remindAt.getTime() - right.remindAt.getTime()
  );

  if (sortedReminders.length === 0) {
    reminderListElement.appendChild(buildEmptyState());
    updateCount();
    return;
  }

  sortedReminders.forEach((reminder) => {
    reminderListElement.appendChild(createReminderItem(reminder));
  });

  updateCount();
  renderCalendar();
}

function addReminder(event) {
  event.preventDefault();
  setFormMessage("");

  const title = normalizeText(reminderTitleInput.value);
  const date = normalizeText(reminderDateInput.value);
  const time = normalizeText(reminderTimeInput.value);
  const selectedLabel = normalizeText(reminderLabelInput.value);
  const customLabel = normalizeText(reminderCustomLabelInput.value);
  const label = resolveLabel(selectedLabel, customLabel);
  const repeat = reminderRepeatInput.value || "none";

  if (!title || !date || !time || !selectedLabel) {
    setFormMessage("Title, date, time, and label are required.");
    return;
  }

  if (selectedLabel === CUSTOM_LABEL_VALUE && !customLabel) {
    setFormMessage("Please enter a custom label.");
    reminderCustomLabelInput.focus();
    return;
  }

  const reminderDate = toReminderDate(date, time);

  if (Number.isNaN(reminderDate.getTime())) {
    setFormMessage("Enter a valid date and time.");
    return;
  }

  if (reminderDate.getTime() <= Date.now()) {
    setFormMessage("Reminder time must be in the future.");
    return;
  }

  const reminder = {
    id: nextReminderId,
    title,
    date,
    time,
    label,
    repeat,
    remindAt: reminderDate,
    completed: false,
    timerId: null,
    skippedDates: new Set(),
  };

  nextReminderId += 1;
  reminders.push(reminder);
  if (selectedLabel === CUSTOM_LABEL_VALUE) {
    registerCustomLabel(label);
  }
  scheduleNotification(reminder);
  renderReminders();

  reminderForm.reset();
  reminderCustomLabelInput.hidden = true;
  setFormMessage("Reminder added.", true);
}

function getRemindersForDate(dateStr) {
  return reminders.filter((reminder) => {
    if (reminder.repeat === "none") {
      return reminder.date === dateStr;
    }
    const start = new Date(`${reminder.date}T${reminder.time}:00`);
    const target = new Date(`${dateStr}T${reminder.time}:00`);
    if (target < start) return false;
    const diffMs = target.getTime() - start.getTime();
    const diffDays = Math.round(diffMs / 86400000);
    if (reminder.repeat === "daily") return true;
    if (reminder.repeat === "weekly") return diffDays % 7 === 0;
    if (reminder.repeat === "monthly") {
      return (
        target.getDate() === start.getDate() &&
        (target.getFullYear() * 12 + target.getMonth()) >=
        (start.getFullYear() * 12 + start.getMonth())
      );
    }
    return false;
  });
}

function renderCalendarDayDetail(dateStr) {
  const calDayDetail = document.getElementById("calDayDetail");
  const calDayDetailTitle = document.getElementById("calDayDetailTitle");
  const calDayDetailList = document.getElementById("calDayDetailList");
  const dayReminders = getRemindersForDate(dateStr);

  calDayDetailTitle.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }).format(new Date(`${dateStr}T12:00:00`));

  calDayDetailList.innerHTML = "";

  if (dayReminders.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No reminders on this day.";
    empty.className = "cal-detail-empty";
    calDayDetailList.appendChild(empty);
  } else {
    dayReminders.forEach((reminder) => {
      const li = document.createElement("li");
      li.className = "cal-detail-item";

      const dot = document.createElement("span");
      dot.className = "cal-detail-dot";

      const textWrap = document.createElement("span");
      textWrap.className = "cal-detail-text";

      const instanceDone = reminder.skippedDates.has(dateStr);
      const fullyDone = reminder.completed;

      if (instanceDone || fullyDone) textWrap.classList.add("is-skipped");

      const titleSpan = document.createElement("span");
      titleSpan.textContent = reminder.title;

      const labelBadge = document.createElement("span");
      labelBadge.className = "reminder-label";
      labelBadge.textContent = reminder.label;

      textWrap.appendChild(titleSpan);
      textWrap.appendChild(labelBadge);

      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      toggleBtn.className = "secondary cal-instance-btn";

      if (reminder.repeat !== "none") {
        // Repeating: toggle this specific instance via skippedDates
        toggleBtn.textContent = instanceDone ? "Unmark this instance" : "Mark this instance Complete";
        toggleBtn.addEventListener("click", () => {
          if (reminder.skippedDates.has(dateStr)) {
            reminder.skippedDates.delete(dateStr);
          } else {
            reminder.skippedDates.add(dateStr);
          }
          renderReminders();
          renderCalendar();
        });
      } else {
        // Non-repeating: toggle the whole reminder's completed state
        toggleBtn.textContent = fullyDone ? "Mark Active" : "Mark Complete";
        toggleBtn.addEventListener("click", () => {
          reminder.completed = !reminder.completed;
          if (reminder.completed) {
            cancelTimer(reminder);
          } else {
            scheduleNotification(reminder);
          }
          renderReminders();
          renderCalendar();
        });
      }

      textWrap.appendChild(toggleBtn);

      li.appendChild(dot);
      li.appendChild(textWrap);
      calDayDetailList.appendChild(li);
    });
  }

  calDayDetail.hidden = false;
}

function renderCalendar() {
  const calGrid = document.getElementById("calGrid");
  const calTitle = document.getElementById("calTitle");
  const calDayDetail = document.getElementById("calDayDetail");

  calTitle.textContent = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" })
    .format(new Date(calYear, calMonth, 1));

  const dayNameCells = calGrid.querySelectorAll(".cal-day-name");
  calGrid.innerHTML = "";
  dayNameCells.forEach((cell) => calGrid.appendChild(cell));

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = dateStringFromDate(new Date());

  for (let pad = 0; pad < firstDay; pad++) {
    const empty = document.createElement("div");
    empty.className = "cal-cell cal-cell--empty";
    calGrid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dayReminders = getRemindersForDate(dateStr);
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cal-cell";
    if (dateStr === today) cell.classList.add("cal-cell--today");
    if (dateStr === calSelectedDate) cell.classList.add("cal-cell--selected");

    const numEl = document.createElement("span");
    numEl.className = "cal-day-num";
    numEl.textContent = d;
    cell.appendChild(numEl);

    if (dayReminders.length > 0) {
      const dotsRow = document.createElement("span");
      dotsRow.className = "cal-dots";
      const maxDots = Math.min(dayReminders.length, 3);
      for (let i = 0; i < maxDots; i++) {
        const dot = document.createElement("span");
        dot.className = "cal-dot";
        dotsRow.appendChild(dot);
      }
      if (dayReminders.length > 3) {
        const more = document.createElement("span");
        more.className = "cal-dot-more";
        more.textContent = `+${dayReminders.length - 3}`;
        dotsRow.appendChild(more);
      }
      cell.appendChild(dotsRow);
    }

    cell.addEventListener("click", () => {
      calSelectedDate = dateStr;
      renderCalendar();
      renderCalendarDayDetail(dateStr);
    });

    calGrid.appendChild(cell);
  }

  if (calSelectedDate) {
    renderCalendarDayDetail(calSelectedDate);
  } else {
    calDayDetail.hidden = true;
  }
}

function setFilter(filterName) {
  currentFilter = filterName;

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filterName;
    button.classList.toggle("is-active", isActive);
  });

  renderReminders();
}

function setDefaultDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);

  const defaultDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
  const defaultTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(
    2,
    "0"
  )}`;

  reminderDateInput.value = defaultDate;
  reminderTimeInput.value = defaultTime;
}

function init() {
  reminderForm.addEventListener("submit", addReminder);

  reminderLabelInput.addEventListener("change", () => {
    reminderCustomLabelInput.hidden = reminderLabelInput.value !== CUSTOM_LABEL_VALUE;
    if (!reminderCustomLabelInput.hidden) {
      reminderCustomLabelInput.focus();
    }
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setFilter(button.dataset.filter);
    });
  });

  askNotificationPermissionIfNeeded();
  setDefaultDateTime();
  renderReminders();

  document.getElementById("calPrev").addEventListener("click", () => {
    calMonth -= 1;
    if (calMonth < 0) { calMonth = 11; calYear -= 1; }
    calSelectedDate = null;
    renderCalendar();
  });

  document.getElementById("calNext").addEventListener("click", () => {
    calMonth += 1;
    if (calMonth > 11) { calMonth = 0; calYear += 1; }
    calSelectedDate = null;
    renderCalendar();
  });

  renderCalendar();
}

init();
