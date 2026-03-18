const STORAGE_KEY = "flashcards-app-cards";
const HINT_DISMISSED_KEY = "flashcards-app-flip-hint-dismissed";

const flashcardForm = document.getElementById("flashcard-form");
const questionInput = document.getElementById("question-input");
const answerInput = document.getElementById("answer-input");
const flashcardList = document.getElementById("flashcard-list");
const totalCards = document.getElementById("total-cards");

const studyCard = document.getElementById("study-card");
const studyFrontText = document.getElementById("study-front-text");
const studyBackText = document.getElementById("study-back-text");
const cardPosition = document.getElementById("card-position");
const prevBtn = document.getElementById("prev-btn");
const flipBtn = document.getElementById("flip-btn");
const nextBtn = document.getElementById("next-btn");

const flashcardTemplate = document.getElementById("flashcard-item-template");
const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));

let cards = loadCards();
let currentIndex = 0;
let showingFront = true;
let flipHintDismissed = localStorage.getItem(HINT_DISMISSED_KEY) === "true";
let editingCardId = null;

flashcardForm.addEventListener("submit", handleAddFlashcard);
flashcardList.addEventListener("click", handleCardAction);
flashcardList.addEventListener("keydown", handleInlineEditKeydown);
flipBtn.addEventListener("click", flipCurrentCard);
prevBtn.addEventListener("click", showPreviousCard);
nextBtn.addEventListener("click", showNextCard);
studyCard.addEventListener("click", flipCurrentCard);
for (const tabButton of tabButtons) {
  tabButton.addEventListener("click", () => {
    activateTab(tabButton);
  });

  tabButton.addEventListener("keydown", handleTabKeydown);
}

studyCard.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    flipCurrentCard();
  }
});

render();

function loadCards() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCards() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

function handleAddFlashcard(event) {
  event.preventDefault();

  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();

  if (!question || !answer) {
    return;
  }

  cards.push({
    id: crypto.randomUUID(),
    question,
    answer,
  });

  saveCards();
  flashcardForm.reset();

  currentIndex = cards.length - 1;
  showingFront = true;
  render();
}

function handleCardAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const listItem = button.closest("li[data-id]");
  if (!listItem) {
    return;
  }

  const id = listItem.dataset.id;
  const action = button.dataset.action;

  if (action === "delete") {
    deleteCard(id);
    return;
  }

  if (action === "edit") {
    startInlineEdit(id);
    return;
  }

  if (action === "save") {
    saveInlineEdit(id, listItem);
    return;
  }

  if (action === "cancel") {
    cancelInlineEdit();
  }
}

function deleteCard(id) {
  const indexToDelete = cards.findIndex((card) => card.id === id);
  if (indexToDelete === -1) {
    return;
  }

  if (editingCardId === id) {
    editingCardId = null;
  }

  cards = cards.filter((card) => card.id !== id);

  if (cards.length === 0) {
    currentIndex = 0;
  } else if (currentIndex >= cards.length) {
    currentIndex = cards.length - 1;
  } else if (indexToDelete < currentIndex) {
    currentIndex -= 1;
  }

  showingFront = true;
  saveCards();
  render();
}

function startInlineEdit(id) {
  const card = cards.find((item) => item.id === id);
  if (!card) {
    return;
  }

  editingCardId = id;
  renderList();

  const editingItem = flashcardList.querySelector(`li[data-id="${id}"]`);
  const questionField = editingItem?.querySelector('[data-edit-field="question"]');
  questionField?.focus();
}

function cancelInlineEdit() {
  editingCardId = null;
  renderList();
}

function saveInlineEdit(id, listItem) {
  const card = cards.find((item) => item.id === id);
  if (!card) {
    return;
  }

  const questionField = listItem.querySelector('[data-edit-field="question"]');
  const answerField = listItem.querySelector('[data-edit-field="answer"]');
  const errorField = listItem.querySelector("[data-edit-error]");

  const trimmedQuestion = questionField.value.trim();
  const trimmedAnswer = answerField.value.trim();

  if (!trimmedQuestion || !trimmedAnswer) {
    errorField.hidden = false;
    return;
  }

  card.question = trimmedQuestion;
  card.answer = trimmedAnswer;
  editingCardId = null;
  saveCards();
  render();
}

function handleInlineEditKeydown(event) {
  const editField = event.target.closest("[data-edit-field]");
  if (!editField) {
    return;
  }

  const listItem = editField.closest("li[data-id]");
  if (!listItem) {
    return;
  }

  const id = listItem.dataset.id;
  if (event.key === "Escape") {
    event.preventDefault();
    cancelInlineEdit();
    return;
  }

  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    saveInlineEdit(id, listItem);
  }
}

function flipCurrentCard() {
  if (cards.length === 0) {
    return;
  }

  dismissFlipHint();
  showingFront = !showingFront;
  renderStudyCard();
}

function showPreviousCard() {
  if (cards.length === 0) {
    return;
  }

  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  showingFront = true;
  renderStudyCard();
}

function showNextCard() {
  if (cards.length === 0) {
    return;
  }

  currentIndex = (currentIndex + 1) % cards.length;
  showingFront = true;
  renderStudyCard();
}

function render() {
  renderList();
  renderStudyCard();
}

function renderList() {
  flashcardList.innerHTML = "";

  for (const card of cards) {
    const item = flashcardTemplate.content.firstElementChild.cloneNode(true);
    const isEditing = editingCardId === card.id;
    const cardView = item.querySelector(".card-view");
    const cardEdit = item.querySelector(".card-edit");
    const questionEdit = item.querySelector('[data-edit-field="question"]');
    const answerEdit = item.querySelector('[data-edit-field="answer"]');
    const editButton = item.querySelector('[data-action="edit"]');
    const saveButton = item.querySelector('[data-action="save"]');
    const cancelButton = item.querySelector('[data-action="cancel"]');
    const deleteButton = item.querySelector('[data-action="delete"]');

    item.dataset.id = card.id;
    item.querySelector('[data-field="question"]').textContent = card.question;
    item.querySelector('[data-field="answer"]').textContent = card.answer;

    questionEdit.value = card.question;
    answerEdit.value = card.answer;

    cardView.hidden = isEditing;
    cardEdit.hidden = !isEditing;
    item.classList.toggle("editing", isEditing);
    editButton.hidden = isEditing;
    deleteButton.hidden = isEditing;
    saveButton.hidden = !isEditing;
    cancelButton.hidden = !isEditing;

    flashcardList.appendChild(item);
  }

  const cardLabel = cards.length === 1 ? "1 card" : `${cards.length} cards`;
  totalCards.textContent = cardLabel;
}

function renderStudyCard() {
  if (cards.length === 0) {
    studyCard.classList.add("empty");
    studyCard.classList.remove("hide-hint");
    studyCard.classList.remove("flipped");
    studyFrontText.textContent = "";
    studyBackText.textContent = "";
    cardPosition.textContent = "No cards yet";
    flipBtn.disabled = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  if (currentIndex < 0 || currentIndex >= cards.length) {
    currentIndex = 0;
  }

  const currentCard = cards[currentIndex];
  studyFrontText.textContent = currentCard.question;
  studyBackText.textContent = currentCard.answer;

  studyCard.classList.remove("empty");
  studyCard.classList.toggle("hide-hint", flipHintDismissed);
  studyCard.classList.toggle("flipped", !showingFront);
  cardPosition.textContent = `Card ${currentIndex + 1} of ${cards.length} (${showingFront ? "Front" : "Back"})`;

  flipBtn.disabled = false;
  prevBtn.disabled = cards.length < 2;
  nextBtn.disabled = cards.length < 2;
}

function handleTabKeydown(event) {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") {
    return;
  }

  event.preventDefault();

  const currentTab = event.currentTarget;
  const currentIndex = tabButtons.indexOf(currentTab);

  if (event.key === "Home") {
    activateTab(tabButtons[0], true);
    return;
  }

  if (event.key === "End") {
    activateTab(tabButtons[tabButtons.length - 1], true);
    return;
  }

  const direction = event.key === "ArrowRight" ? 1 : -1;
  const nextIndex = (currentIndex + direction + tabButtons.length) % tabButtons.length;
  activateTab(tabButtons[nextIndex], true);
}

function activateTab(selectedTab, moveFocus = false) {
  for (const tabButton of tabButtons) {
    const isActive = tabButton === selectedTab;
    tabButton.setAttribute("aria-selected", String(isActive));
    tabButton.tabIndex = isActive ? 0 : -1;
  }

  for (const panel of tabPanels) {
    const isMatch = panel.id === selectedTab.dataset.tabTarget;
    panel.hidden = !isMatch;
    panel.classList.toggle("active", isMatch);
  }

  if (moveFocus) {
    selectedTab.focus();
  }
}

function dismissFlipHint() {
  if (flipHintDismissed) {
    return;
  }

  flipHintDismissed = true;
  localStorage.setItem(HINT_DISMISSED_KEY, "true");
}
