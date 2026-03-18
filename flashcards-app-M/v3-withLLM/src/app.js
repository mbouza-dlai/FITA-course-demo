const STORAGE_KEY = "flashcards-app-cards";
const HINT_DISMISSED_KEY = "flashcards-app-flip-hint-dismissed";
const AI_STACK_KEY = "flashcards-app-ai-prefetch-stack";

const AI_PREFETCH_THRESHOLD = 50;
const AI_PROMPT_THRESHOLD = 75;
const AI_STACK_TARGET = 10;
const AI_INJECT_COUNT = 5;

const flashcardForm = document.getElementById("flashcard-form");
const questionInput = document.getElementById("question-input");
const answerInput = document.getElementById("answer-input");
const flashcardList = document.getElementById("flashcard-list");
const totalCards = document.getElementById("total-cards");

const studyCard = document.getElementById("study-card");
const studyFrontText = document.getElementById("study-front-text");
const studyBackText = document.getElementById("study-back-text");
const studyEmptyState = studyCard.querySelector(".empty-state");
const cardPosition = document.getElementById("card-position");
const prevBtn = document.getElementById("prev-btn");
const flipBtn = document.getElementById("flip-btn");
const nextBtn = document.getElementById("next-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const studyEditBtn = document.getElementById("study-edit-btn");
const studyKnownCheckbox = document.getElementById("study-known-checkbox");
const studyKnownControl = studyKnownCheckbox.closest(".study-known-check");
const studyEditForm = document.getElementById("study-edit-form");
const studyEditQuestion = document.getElementById("study-edit-question");
const studyEditAnswer = document.getElementById("study-edit-answer");
const studyEditError = document.getElementById("study-edit-error");
const studyEditCancelBtn = document.getElementById("study-edit-cancel");
const aiModal = document.getElementById("ai-modal");
const aiModalTitle = document.getElementById("ai-modal-title");
const aiModalMessage = document.getElementById("ai-modal-message");
const aiModalConfirmBtn = document.getElementById("ai-modal-confirm");
const aiModalCancelBtn = document.getElementById("ai-modal-cancel");

const flashcardTemplate = document.getElementById("flashcard-item-template");
const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));

let cards = loadCards();
let showingFront = true;
let flipHintDismissed = localStorage.getItem(HINT_DISMISSED_KEY) === "true";
let editingCardId = null;
let isStudyEditing = false;
let shuffleEnabled = false;
let studyOrder = [];
let studyPosition = 0;
let deferKnownOmissionForCurrent = false;

let aiStack = loadAiStack();
let seenThisRound = new Set();
let prefetchInFlight = false;
let generationPromptInFlight = false;
let modalResolve = null;
let lastGenerationErrorMessage = "";
let studyRoundInteractionStarted = false;

flashcardForm.addEventListener("submit", handleAddFlashcard);
flashcardList.addEventListener("click", handleCardAction);
flashcardList.addEventListener("change", handleCardInputChange);
flashcardList.addEventListener("keydown", handleInlineEditKeydown);
flipBtn.addEventListener("click", flipCurrentCard);
prevBtn.addEventListener("click", showPreviousCard);
nextBtn.addEventListener("click", showNextCard);
shuffleBtn.addEventListener("click", toggleShuffle);
studyEditBtn.addEventListener("click", startStudyEdit);
studyKnownCheckbox.addEventListener("change", handleStudyKnownChange);
studyKnownCheckbox.addEventListener("click", (event) => event.stopPropagation());
studyKnownControl?.addEventListener("click", (event) => event.stopPropagation());
studyEditCancelBtn.addEventListener("click", cancelStudyEdit);
studyEditForm.addEventListener("submit", saveStudyEdit);
studyCard.addEventListener("click", flipCurrentCard);
aiModalConfirmBtn?.addEventListener("click", () => closeModal(true));
aiModalCancelBtn?.addEventListener("click", () => closeModal(false));
aiModal?.addEventListener("click", (event) => {
  if (event.target === aiModal) {
    closeModal(false);
  }
});
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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && aiModal && !aiModal.hidden) {
    closeModal(false);
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
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((card) => ({
      id: card.id,
      question: card.question,
      answer: card.answer,
      known: card.known === true,
    }));
  } catch {
    return [];
  }
}

function loadAiStack() {
  const raw = localStorage.getItem(AI_STACK_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((card) => typeof card?.question === "string" && typeof card?.answer === "string")
      .map((card) => ({ question: card.question, answer: card.answer }));
  } catch {
    return [];
  }
}

function saveCards() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

function saveAiStack() {
  localStorage.setItem(AI_STACK_KEY, JSON.stringify(aiStack));
}

function resetRoundTracking() {
  seenThisRound = new Set();
  studyRoundInteractionStarted = false;
}

function handleAddFlashcard(event) {
  event.preventDefault();

  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();

  if (!question || !answer) {
    return;
  }

  const newCard = {
    id: crypto.randomUUID(),
    question,
    answer,
    known: false,
  };

  cards.push(newCard);

  saveCards();
  flashcardForm.reset();

  resetRoundTracking();
  rebuildStudyOrder(newCard.id);
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

function handleCardInputChange(event) {
  const knownToggle = event.target.closest('[data-action="toggle-known"]');
  if (!knownToggle) {
    return;
  }

  const listItem = knownToggle.closest("li[data-id]");
  if (!listItem) {
    return;
  }

  const card = cards.find((item) => item.id === listItem.dataset.id);
  if (!card) {
    return;
  }

  card.known = knownToggle.checked;
  deferKnownOmissionForCurrent = false;

  if (isStudyEditing) {
    isStudyEditing = false;
    studyEditForm.hidden = true;
    studyEditError.hidden = true;
  }

  showingFront = true;
  rebuildStudyOrder();
  saveCards();
  render();
}

function deleteCard(id) {
  if (!cards.some((card) => card.id === id)) {
    return;
  }

  if (isStudyEditing) {
    isStudyEditing = false;
    studyEditForm.hidden = true;
    studyEditError.hidden = true;
  }

  if (editingCardId === id) {
    editingCardId = null;
  }

  cards = cards.filter((card) => card.id !== id);

  resetRoundTracking();
  rebuildStudyOrder();

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
  const knownField = listItem.querySelector('[data-edit-field="known"]');
  const errorField = listItem.querySelector("[data-edit-error]");

  const trimmedQuestion = questionField.value.trim();
  const trimmedAnswer = answerField.value.trim();

  if (!trimmedQuestion || !trimmedAnswer) {
    errorField.hidden = false;
    return;
  }

  card.question = trimmedQuestion;
  card.answer = trimmedAnswer;
  card.known = knownField.checked;
  editingCardId = null;
  deferKnownOmissionForCurrent = false;
  rebuildStudyOrder();
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
  if (studyOrder.length === 0 || isStudyEditing) {
    return;
  }

  if (isStudyTabActive()) {
    studyRoundInteractionStarted = true;
  }

  dismissFlipHint();
  showingFront = !showingFront;

  const currentCard = getCurrentStudyCard();
  if (isStudyTabActive() && currentCard && !showingFront) {
    // A card is considered "gone through" only after seeing its back once.
    seenThisRound.add(currentCard.id);
  }

  renderStudyCard();
  void maybeRunAiFlow();
}

function showPreviousCard() {
  if (isStudyEditing || getStudyEligibleCards().length === 0) {
    return;
  }

  if (isStudyTabActive()) {
    studyRoundInteractionStarted = true;
  }

  if (deferKnownOmissionForCurrent) {
    deferKnownOmissionForCurrent = false;
  }

  if (studyOrder.length !== getStudyEligibleCards().length) {
    rebuildStudyOrder();
  }

  studyPosition = (studyPosition - 1 + studyOrder.length) % studyOrder.length;
  showingFront = true;
  renderStudyCard();
  void maybeRunAiFlow();
}

function showNextCard() {
  if (isStudyEditing || getStudyEligibleCards().length === 0) {
    return;
  }

  if (isStudyTabActive()) {
    studyRoundInteractionStarted = true;
  }

  if (deferKnownOmissionForCurrent) {
    deferKnownOmissionForCurrent = false;
  }

  const isEndOfCurrentRound = studyPosition === studyOrder.length - 1;
  if (isEndOfCurrentRound) {
    // Check AI flow BEFORE resetting so the full round state is still visible.
    void maybeRunAiFlow();
    // Start a fresh round from current unknown cards only.
    rebuildStudyOrder();
    resetRoundTracking();
    if (studyOrder.length === 0) {
      showingFront = true;
      renderStudyCard();
      return;
    }
    studyPosition = 0;
  } else {
    studyPosition = (studyPosition + 1) % studyOrder.length;
  }

  // In shuffle mode, reaching the end starts a fresh randomized cycle.
  if (shuffleEnabled && studyPosition === 0 && studyOrder.length > 1) {
    const currentCardId = studyOrder[0];
    rebuildStudyOrder(currentCardId);
  }

  showingFront = true;
  renderStudyCard();
  if (!isEndOfCurrentRound) {
    void maybeRunAiFlow();
  }
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
    const knownView = item.querySelector('[data-action="toggle-known"]');
    const knownEdit = item.querySelector('[data-edit-field="known"]');
    const editButton = item.querySelector('[data-action="edit"]');
    const saveButton = item.querySelector('[data-action="save"]');
    const cancelButton = item.querySelector('[data-action="cancel"]');
    const deleteButton = item.querySelector('[data-action="delete"]');

    item.dataset.id = card.id;
    item.querySelector('[data-field="question"]').textContent = card.question;
    item.querySelector('[data-field="answer"]').textContent = card.answer;

    questionEdit.value = card.question;
    answerEdit.value = card.answer;
    knownView.checked = card.known === true;
    knownEdit.checked = card.known === true;

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
  updateShuffleButton();

  if (cards.length === 0) {
    deferKnownOmissionForCurrent = false;
    isStudyEditing = false;
    studyEditForm.hidden = true;
    studyCard.classList.add("empty");
    studyCard.classList.remove("hide-hint");
    studyCard.classList.remove("flipped");
    studyFrontText.textContent = "";
    studyBackText.textContent = "";
    studyEmptyState.textContent = "Add a flashcard to begin studying.";
    cardPosition.textContent = "No cards yet";
    flipBtn.disabled = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    shuffleBtn.disabled = false;
    studyEditBtn.disabled = true;
    studyKnownCheckbox.checked = false;
    studyKnownCheckbox.disabled = true;
    return;
  }

  if (studyOrder.length === 0 && getStudyEligibleCards().length > 0) {
    rebuildStudyOrder();
    showingFront = true;
  }

  if (studyOrder.length === 0) {
    isStudyEditing = false;
    studyEditForm.hidden = true;
    studyEditError.hidden = true;
    studyCard.classList.add("empty");
    studyCard.classList.remove("hide-hint");
    studyCard.classList.remove("flipped");
    studyFrontText.textContent = "";
    studyBackText.textContent = "";
    studyEmptyState.textContent = "All cards are marked as known. Uncheck one in Manage to continue studying.";
    cardPosition.textContent = "All cards known";
    flipBtn.disabled = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    shuffleBtn.disabled = false;
    studyEditBtn.disabled = true;
    studyKnownCheckbox.checked = true;
    studyKnownCheckbox.disabled = true;
    return;
  }

  const currentCard = getCurrentStudyCard();
  if (!currentCard) {
    return;
  }

  studyFrontText.textContent = currentCard.question;
  studyBackText.textContent = currentCard.answer;

  studyCard.classList.remove("empty");
  studyCard.classList.toggle("hide-hint", flipHintDismissed);
  studyCard.classList.toggle("flipped", !showingFront);
  cardPosition.textContent = `Card ${studyPosition + 1} of ${studyOrder.length} (${showingFront ? "Front" : "Back"})`;

  flipBtn.disabled = isStudyEditing;
  prevBtn.disabled = isStudyEditing || studyOrder.length < 2;
  nextBtn.disabled = isStudyEditing || studyOrder.length < 2;
  shuffleBtn.disabled = isStudyEditing;
  studyEditBtn.disabled = isStudyEditing;
  studyKnownCheckbox.checked = currentCard.known === true;
  studyKnownCheckbox.disabled = isStudyEditing;
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

  // The generation prompt is Study-only. If user leaves Study, close it immediately.
  if (selectedTab.dataset.tabTarget !== "panel-study" && aiModal && !aiModal.hidden) {
    closeModal(false);
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

function startStudyEdit() {
  if (studyOrder.length === 0 || isStudyEditing) {
    return;
  }

  const card = getCurrentStudyCard();
  if (!card) {
    return;
  }

  isStudyEditing = true;
  studyEditQuestion.value = card.question;
  studyEditAnswer.value = card.answer;
  studyEditError.hidden = true;
  studyEditForm.hidden = false;
  renderStudyCard();
  studyEditQuestion.focus();
}

function cancelStudyEdit() {
  if (!isStudyEditing) {
    return;
  }

  isStudyEditing = false;
  studyEditForm.hidden = true;
  studyEditError.hidden = true;
  renderStudyCard();
}

function saveStudyEdit(event) {
  event.preventDefault();
  if (!isStudyEditing) {
    return;
  }

  const card = getCurrentStudyCard();
  if (!card) {
    return;
  }

  const trimmedQuestion = studyEditQuestion.value.trim();
  const trimmedAnswer = studyEditAnswer.value.trim();
  if (!trimmedQuestion || !trimmedAnswer) {
    studyEditError.hidden = false;
    return;
  }

  card.question = trimmedQuestion;
  card.answer = trimmedAnswer;
  isStudyEditing = false;
  studyEditForm.hidden = true;
  studyEditError.hidden = true;
  saveCards();
  render();
}

function toggleShuffle() {
  deferKnownOmissionForCurrent = false;
  shuffleEnabled = !shuffleEnabled;

  if (shuffleEnabled) {
    // Start shuffle mode with a fresh randomized deck immediately.
    studyOrder = getStudyEligibleCards().map((card) => card.id);
    shuffleInPlace(studyOrder);
    studyPosition = 0;
  } else {
    // Return to sequential order while preserving current card.
    rebuildStudyOrder();
  }

  renderStudyCard();
}

function handleStudyKnownChange(event) {
  if (isStudyEditing) {
    return;
  }

  const card = getCurrentStudyCard();
  if (!card) {
    event.target.checked = false;
    return;
  }

  const isMarkingKnown = event.target.checked;

  card.known = isMarkingKnown;
  if (isStudyTabActive()) {
    studyRoundInteractionStarted = true;
  }
  showingFront = true;
  if (isMarkingKnown) {
    deferKnownOmissionForCurrent = true;
    cardPosition.textContent = "Marked as known. Press Next or Previous to continue.";
  } else {
    deferKnownOmissionForCurrent = false;
    rebuildStudyOrder(card.id);
  }

  saveCards();
  renderList();

  if (!isMarkingKnown) {
    renderStudyCard();
  }

  void maybeRunAiFlow();
}

function rebuildStudyOrder(preferredCardId = null) {
  const previousCardId = preferredCardId ?? studyOrder[studyPosition] ?? null;
  const orderedIds = getStudyEligibleCards().map((card) => card.id);

  if (shuffleEnabled) {
    shuffleInPlace(orderedIds);
  }

  studyOrder = orderedIds;

  if (studyOrder.length === 0) {
    studyPosition = 0;
    return;
  }

  if (previousCardId) {
    const matchedIndex = studyOrder.indexOf(previousCardId);
    if (matchedIndex !== -1) {
      studyPosition = matchedIndex;
      return;
    }
  }

  if (studyPosition >= studyOrder.length) {
    studyPosition = studyOrder.length - 1;
  }
}

function getCurrentStudyCard() {
  if (studyOrder.length === 0) {
    return null;
  }

  const currentCardId = studyOrder[studyPosition];
  return cards.find((card) => card.id === currentCardId) ?? null;
}

function getStudyEligibleCards() {
  return cards.filter((card) => card.known !== true);
}

function getKnownRate() {
  if (cards.length === 0) {
    return 0;
  }

  const knownCount = cards.filter((card) => card.known).length;
  return (knownCount / cards.length) * 100;
}

async function maybeRunAiFlow() {
  if (cards.length === 0 || generationPromptInFlight) {
    return;
  }

  if (getKnownRate() >= AI_PREFETCH_THRESHOLD) {
    void ensurePrefetchedCards(AI_STACK_TARGET);
  }

  if (!isStudyTabActive()) {
    return;
  }

  const finishedRound =
    studyOrder.length > 0 &&
    studyOrder.every((id) => seenThisRound.has(id) || (cards.find((c) => c.id === id)?.known ?? false));
  if (!studyRoundInteractionStarted || !finishedRound || getKnownRate() < AI_PROMPT_THRESHOLD) {
    return;
  }

  generationPromptInFlight = true;
  try {
    const wantsAutoGeneration = await openModal({
      title: "Generate new cards now?",
      message:
        "You completed this round with at least 75% known cards. I can add 5 AI-generated cards immediately.",
      confirmText: "Generate 5 cards",
      cancelText: "Not now",
      showCancel: true,
    });

    if (wantsAutoGeneration) {
      const added = await addGeneratedCardsToDeck(AI_INJECT_COUNT);
      if (added) {
        resetRoundTracking();
      }
    } else {
      resetRoundTracking();
    }
  } finally {
    generationPromptInFlight = false;
  }
}

async function addGeneratedCardsToDeck(count) {
  await ensurePrefetchedCards(count);

  if (aiStack.length === 0) {
    const fallback = "No generated cards are available yet. Try again in a moment.";
    await openModal({
      title: "Could not generate cards",
      message: lastGenerationErrorMessage || fallback,
      confirmText: "OK",
      showCancel: false,
    });
    return false;
  }

  const cardsToAdd = aiStack.splice(0, count).map((card) => ({
    id: crypto.randomUUID(),
    question: card.question,
    answer: card.answer,
    known: false,
  }));

  saveAiStack();

  if (cardsToAdd.length === 0) {
    return false;
  }

  cards.push(...cardsToAdd);
  saveCards();

  resetRoundTracking();
  rebuildStudyOrder(cardsToAdd[0].id);
  showingFront = true;
  render();

  // Keep the stack warm so new cards remain instant when needed again.
  void ensurePrefetchedCards(AI_STACK_TARGET);
  return true;
}

async function ensurePrefetchedCards(minReadyCount) {
  if (prefetchInFlight) {
    return;
  }

  const target = Math.max(minReadyCount, AI_STACK_TARGET);
  const needed = target - aiStack.length;
  if (needed <= 0) {
    return;
  }

  prefetchInFlight = true;
  try {
    const generated = await requestGeneratedCards(needed);
    if (generated.length > 0) {
      aiStack.push(...generated);
      saveAiStack();
      lastGenerationErrorMessage = "";
    }
  } catch (error) {
    lastGenerationErrorMessage =
      error instanceof Error ? error.message : "Failed to prefetch AI cards.";
    console.error("Failed to prefetch AI cards:", error);
  } finally {
    prefetchInFlight = false;
  }
}

async function requestGeneratedCards(count) {
  if (count <= 0 || cards.length === 0) {
    return [];
  }

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      count,
      cards: cards.map((card) => ({
        question: card.question,
        answer: card.answer,
        known: card.known,
      })),
    }),
  });

  if (!response.ok) {
    let message = `Generation failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData?.error) {
        message = errorData.error;
      }
    } catch {
      // Ignore parse failures.
    }
    throw new Error(message);
  }

  const payload = await response.json();
  if (!Array.isArray(payload?.cards)) {
    return [];
  }

  return payload.cards
    .filter((card) => typeof card?.question === "string" && typeof card?.answer === "string")
    .map((card) => ({
      question: card.question.trim(),
      answer: card.answer.trim(),
    }))
    .filter((card) => card.question && card.answer);
}

function updateShuffleButton() {
  const stateLabel = `Shuffle cards: ${shuffleEnabled ? "On" : "Off"}`;
  shuffleBtn.setAttribute("aria-pressed", String(shuffleEnabled));
  shuffleBtn.setAttribute("aria-label", stateLabel);
  shuffleBtn.title = stateLabel;
}

function shuffleInPlace(values) {
  for (let i = values.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
}

function openModal({ title, message, confirmText = "OK", cancelText = "Cancel", showCancel = true }) {
  if (!aiModal || !aiModalTitle || !aiModalMessage || !aiModalConfirmBtn || !aiModalCancelBtn) {
    return Promise.resolve(false);
  }

  // Confirmation prompts (with cancel button) are Study-only by design.
  if (showCancel && !isStudyTabActive()) {
    return Promise.resolve(false);
  }

  aiModalTitle.textContent = title;
  aiModalMessage.textContent = message;
  aiModalConfirmBtn.textContent = confirmText;
  aiModalCancelBtn.textContent = cancelText;
  aiModalCancelBtn.hidden = !showCancel;
  aiModal.hidden = false;

  if (showCancel) {
    aiModalCancelBtn.focus();
  } else {
    aiModalConfirmBtn.focus();
  }

  return new Promise((resolve) => {
    modalResolve = resolve;
  });
}

function closeModal(result) {
  if (!aiModal || aiModal.hidden) {
    return;
  }

  aiModal.hidden = true;
  if (modalResolve) {
    const resolver = modalResolve;
    modalResolve = null;
    resolver(result);
  }
}

function isStudyTabActive() {
  const studyTab = document.getElementById("tab-study");
  const studyPanel = document.getElementById("panel-study");
  return studyTab?.getAttribute("aria-selected") === "true" && studyPanel?.hidden === false;
}
