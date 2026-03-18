const listMessage = document.getElementById("listMessage");
const taskForm = document.getElementById("taskForm");
const taskListSelect = document.getElementById("taskListSelect");
const titleInput = document.getElementById("taskTitle");
const dueDateInput = document.getElementById("taskDueDate");
const descriptionInput = document.getElementById("taskDescription");
const formMessage = document.getElementById("formMessage");
const taskListElement = document.getElementById("taskList");
const taskTemplate = document.getElementById("taskTemplate");
const taskCountElement = document.getElementById("taskCount");
const sortTasksSelect = document.getElementById("sortTasks");
const listFiltersElement = document.getElementById("listFilters");

const NEW_LIST_OPTION_VALUE = "__new_list__";
const LIST_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#0f766e",
  "#c2410c",
  "#db2777",
  "#0369a1",
  "#4f46e5",
  "#15803d",
  "#b45309",
  "#be123c",
];

const lists = [{ id: 1, name: "Inbox", color: LIST_COLORS[0] }];
const tasks = [];
let nextListId = 2;
let nextTaskId = 1;
let listMessageTimeoutId = null;
let previousTaskListSelection = String(lists[0].id);
const selectedFilterListIds = new Set([lists[0].id]);

function normalizeText(value) {
  return value.trim();
}

function formatDueDate(dueDate) {
  const parsed = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return dueDate;
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsed);
}

function updateTaskCount() {
  const visibleTasks = tasks.filter((task) => selectedFilterListIds.has(task.listId));
  const total = visibleTasks.length;
  const completed = visibleTasks.filter((task) => task.completed).length;

  if (total === 0) {
    taskCountElement.textContent = "0 tasks";
    return;
  }

  taskCountElement.textContent = `${completed}/${total} completed`;
}

function buildEmptyState() {
  const emptyItem = document.createElement("li");
  emptyItem.className = "empty-state";

  if (selectedFilterListIds.size === 0) {
    emptyItem.textContent = "No lists selected. Use Filter lists to pick one or more lists.";
  } else {
    emptyItem.textContent = "No tasks match the selected list filters.";
  }

  return emptyItem;
}

function createListOption(list, selectedId) {
  const option = document.createElement("option");
  option.value = String(list.id);
  option.textContent = list.name;
  option.selected = list.id === selectedId;
  return option;
}

function renderListSelectors(selectedTaskListId = lists[0].id) {
  taskListSelect.innerHTML = "";

  lists.forEach((list) => {
    taskListSelect.appendChild(createListOption(list, selectedTaskListId));
  });

  const newListOption = document.createElement("option");
  newListOption.value = NEW_LIST_OPTION_VALUE;
  newListOption.textContent = "+ New list...";
  taskListSelect.appendChild(newListOption);

  taskListSelect.value = String(selectedTaskListId);
  previousTaskListSelection = taskListSelect.value;
}

function renderListFilters() {
  listFiltersElement.innerHTML = "";

  lists.forEach((list) => {
    const label = document.createElement("label");
    label.className = "filter-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = selectedFilterListIds.has(list.id);
    checkbox.value = String(list.id);

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        selectedFilterListIds.add(list.id);
      } else {
        selectedFilterListIds.delete(list.id);
      }

      renderTasks();
    });

    const dot = document.createElement("span");
    dot.className = "filter-dot";
    dot.style.setProperty("--list-color", list.color);

    const text = document.createElement("span");
    text.textContent = list.name;

    label.appendChild(checkbox);
    label.appendChild(dot);
    label.appendChild(text);

    listFiltersElement.appendChild(label);
  });
}

function getSortedTasks(taskItems) {
  const mode = sortTasksSelect.value;
  const sorted = [...taskItems];

  sorted.sort((left, right) => {
    const completionOrder = Number(left.completed) - Number(right.completed);
    if (completionOrder !== 0) {
      return completionOrder;
    }

    if (mode === "due-asc") {
      return left.dueDate.localeCompare(right.dueDate);
    }

    if (mode === "due-desc") {
      return right.dueDate.localeCompare(left.dueDate);
    }

    if (mode === "created-asc") {
      return left.id - right.id;
    }

    return right.id - left.id;
  });

  return sorted;
}

function renderMoveSelect(moveSelectElement, currentListId) {
  moveSelectElement.innerHTML = "";

  const destinationLists = lists.filter((list) => list.id !== currentListId);

  if (destinationLists.length > 0) {
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Select list...";
    placeholderOption.selected = true;
    moveSelectElement.appendChild(placeholderOption);
  }

  destinationLists.forEach((list) => {
    const option = document.createElement("option");
    option.value = String(list.id);
    option.textContent = list.name;
    moveSelectElement.appendChild(option);
  });

  return destinationLists.length > 0;
}

function getListById(listId) {
  return lists.find((list) => list.id === listId) ?? null;
}

function renderTasks() {
  taskListElement.innerHTML = "";

  const visibleTasks = tasks.filter((task) => selectedFilterListIds.has(task.listId));
  if (visibleTasks.length === 0) {
    taskListElement.appendChild(buildEmptyState());
    updateTaskCount();
    return;
  }

  getSortedTasks(visibleTasks).forEach((task) => {
    const taskNode = taskTemplate.content.firstElementChild.cloneNode(true);
    const toggle = taskNode.querySelector(".task-toggle");
    const title = taskNode.querySelector(".task-title");
    const listBadge = taskNode.querySelector(".task-list-badge");
    const dueDate = taskNode.querySelector(".task-due-date");
    const description = taskNode.querySelector(".task-description");
    const editButton = taskNode.querySelector(".edit-task");
    const moveButton = taskNode.querySelector(".move-task");
    const moveSelect = taskNode.querySelector(".move-task-select");
    const deleteButton = taskNode.querySelector(".delete-task");
    const editForm = taskNode.querySelector(".edit-form");
    const editTitleInput = taskNode.querySelector(".edit-title");
    const editDueDateInput = taskNode.querySelector(".edit-due-date");
    const editDescriptionInput = taskNode.querySelector(".edit-description");
    const editMessage = taskNode.querySelector(".edit-message");
    const cancelEditButton = taskNode.querySelector(".cancel-edit");

    const taskList = getListById(task.listId);
    const listColor = taskList?.color ?? "#64748b";

    taskNode.dataset.taskId = String(task.id);
    taskNode.style.setProperty("--list-color", listColor);
    toggle.checked = task.completed;

    title.textContent = task.title;
    listBadge.textContent = taskList?.name ?? "Unknown list";
    dueDate.textContent = `Due: ${formatDueDate(task.dueDate)}`;
    const canMoveToAnotherList = renderMoveSelect(moveSelect, task.listId);
    moveSelect.disabled = !canMoveToAnotherList;
    moveButton.disabled = !canMoveToAnotherList;
    moveSelect.hidden = true;

    if (task.description) {
      description.textContent = task.description;
      description.hidden = false;
    } else {
      description.hidden = true;
    }

    if (task.completed) {
      taskNode.classList.add("completed");
    }

    toggle.addEventListener("change", () => {
      task.completed = toggle.checked;
      renderTasks();
    });

    editButton.addEventListener("click", () => {
      editForm.hidden = !editForm.hidden;

      if (!editForm.hidden) {
        editMessage.textContent = "";
        editTitleInput.value = task.title;
        editDueDateInput.value = task.dueDate;
        editDescriptionInput.value = task.description;
        editTitleInput.focus();
      }
    });

    cancelEditButton.addEventListener("click", () => {
      editMessage.textContent = "";
      editForm.hidden = true;
    });

    editForm.addEventListener("submit", (event) => {
      event.preventDefault();
      editMessage.textContent = "";

      const updatedTitle = normalizeText(editTitleInput.value);
      const updatedDueDate = normalizeText(editDueDateInput.value);
      const updatedDescription = normalizeText(editDescriptionInput.value);

      if (!updatedTitle) {
        editMessage.textContent = "Task title is required.";
        editTitleInput.focus();
        return;
      }

      if (!updatedDueDate) {
        editMessage.textContent = "Due date is required.";
        editDueDateInput.focus();
        return;
      }

      task.title = updatedTitle;
      task.dueDate = updatedDueDate;
      task.description = updatedDescription;
      renderTasks();
    });

    moveButton.addEventListener("click", () => {
      if (moveSelect.hidden) {
        moveSelect.value = "";
        moveSelect.hidden = false;
        moveSelect.focus();
        return;
      }

      moveSelect.hidden = true;
    });

    moveSelect.addEventListener("change", () => {
      if (!moveSelect.value) {
        return;
      }

      const destinationListId = Number(moveSelect.value);
      if (Number.isNaN(destinationListId) || destinationListId === task.listId) {
        return;
      }

      task.listId = destinationListId;
      renderTasks();
    });

    moveSelect.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") {
        return;
      }

      moveSelect.hidden = true;
      moveSelect.value = "";
      moveButton.focus();
    });

    moveSelect.addEventListener("blur", () => {
      window.setTimeout(() => {
        if (document.activeElement !== moveButton) {
          moveSelect.hidden = true;
          moveSelect.value = "";
        }
      }, 0);
    });

    deleteButton.addEventListener("click", () => {
      const taskIndex = tasks.findIndex((item) => item.id === task.id);
      if (taskIndex >= 0) {
        tasks.splice(taskIndex, 1);
        renderTasks();
      }
    });

    taskListElement.appendChild(taskNode);
  });

  updateTaskCount();
}

function addTask(title, dueDate, description, listId) {
  tasks.unshift({
    id: nextTaskId,
    listId,
    title,
    dueDate,
    description,
    completed: false,
  });

  nextTaskId += 1;
  renderTasks();
}

function getNextListColor() {
  return LIST_COLORS[(nextListId - 1) % LIST_COLORS.length];
}

function addList(name) {
  const existingList = lists.find(
    (list) => list.name.toLowerCase() === name.toLowerCase()
  );

  if (existingList) {
    return { ok: false, message: "A list with this name already exists." };
  }

  const newList = {
    id: nextListId,
    name,
    color: getNextListColor(),
  };

  lists.push(newList);
  nextListId += 1;
  selectedFilterListIds.add(newList.id);
  renderListSelectors(newList.id);
  renderListFilters();
  renderTasks();

  return { ok: true, message: `List "${newList.name}" added.` };
}

function showListMessage(message, type) {
  if (listMessageTimeoutId) {
    window.clearTimeout(listMessageTimeoutId);
    listMessageTimeoutId = null;
  }

  listMessage.textContent = message;
  listMessage.classList.remove("success", "error");
  listMessage.classList.add(type);

  listMessageTimeoutId = window.setTimeout(() => {
    listMessage.textContent = "";
    listMessage.classList.remove("success", "error");
    listMessageTimeoutId = null;
  }, 2400);
}

taskListSelect.addEventListener("change", () => {
  if (taskListSelect.value !== NEW_LIST_OPTION_VALUE) {
    previousTaskListSelection = taskListSelect.value;
    return;
  }

  const newListName = normalizeText(window.prompt("Enter new list name:") ?? "");

  if (!newListName) {
    taskListSelect.value = previousTaskListSelection;
    return;
  }

  const result = addList(newListName);
  showListMessage(result.message, result.ok ? "success" : "error");

  if (result.ok) {
    const newListId = String(lists[lists.length - 1].id);
    taskListSelect.value = newListId;
    previousTaskListSelection = newListId;
  } else {
    taskListSelect.value = previousTaskListSelection;
  }
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent = "";

  const listId = Number(taskListSelect.value);
  const title = normalizeText(titleInput.value);
  const dueDate = normalizeText(dueDateInput.value);
  const description = normalizeText(descriptionInput.value);

  if (!listId) {
    formMessage.textContent = "Please select a list.";
    taskListSelect.focus();
    return;
  }

  if (!title) {
    formMessage.textContent = "Task title is required.";
    titleInput.focus();
    return;
  }

  if (!dueDate) {
    formMessage.textContent = "Due date is required.";
    dueDateInput.focus();
    return;
  }

  addTask(title, dueDate, description, listId);
  taskForm.reset();
  taskListSelect.value = String(listId);
  previousTaskListSelection = String(listId);
  titleInput.focus();
});

sortTasksSelect.addEventListener("change", () => {
  renderTasks();
});

renderListSelectors();
renderListFilters();
renderTasks();
