// Notes storage — persisted to localStorage
// Each note: { id, language, category, content, tags: [..], createdAt }
const STORAGE_KEY = "language-learning-notes";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { notes: [], nextId: 1 };
    const parsed = JSON.parse(raw);
    // Restore Date objects
    parsed.notes.forEach((n) => { n.createdAt = new Date(n.createdAt); });
    return parsed;
  } catch {
    return { notes: [], nextId: 1 };
  }
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ notes, nextId }));
  } catch { /* storage full or unavailable — fail silently */ }
}

const stored = loadFromStorage();
let notes  = stored.notes;
let nextId = stored.nextId;

// Predefined language values (used to detect custom entries on edit)
const KNOWN_LANGUAGES = new Set(["Portuguese","Spanish","French","German","Italian","English"]);

// Custom language persistence
const CUSTOM_LANGS_KEY = "language-learning-custom-langs";

function loadCustomLanguages() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_LANGS_KEY) || "[]"); }
  catch { return []; }
}

function addLanguageToDropdown(lang) {
  if (Array.from(languageSelect.options).some((o) => o.value === lang)) return;
  const option = new Option(lang, lang);
  const otherOpt = Array.from(languageSelect.options).find((o) => o.value === "Other");
  languageSelect.insertBefore(option, otherOpt);
}

function persistCustomLanguage(lang) {
  if (!lang || KNOWN_LANGUAGES.has(lang)) return;
  const saved = loadCustomLanguages();
  if (!saved.includes(lang)) {
    saved.push(lang);
    localStorage.setItem(CUSTOM_LANGS_KEY, JSON.stringify(saved));
  }
  addLanguageToDropdown(lang);
}

// DOM elements — form
const noteForm      = document.getElementById("noteForm");
const noteIdInput   = document.getElementById("noteId");
const languageSelect      = document.getElementById("languageSelect");
const languageCustomInput = document.getElementById("languageCustomInput");
const categorySelect  = document.getElementById("categorySelect");
const titleRow      = document.getElementById("titleRow");
const titleInput    = document.getElementById("titleInput");
const noteContent   = document.getElementById("noteContent");
const tagsInput     = document.getElementById("tagsInput");
const saveNoteBtn   = document.getElementById("saveNoteBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

// DOM elements — notes display
const notesContainer = document.getElementById("notesContainer");

// DOM elements — filters & export
const searchInput       = document.getElementById("searchInput");
const filterLanguage    = document.getElementById("filterLanguage");
const filterCategory    = document.getElementById("filterCategory");
const exportAllBtn      = document.getElementById("exportAllBtn");
const exportSelectionBtn = document.getElementById("exportSelectionBtn");

// DOM elements — vocabulary lookup
const wordLookupRow      = document.getElementById("wordLookupRow");
const lookupWordInput    = document.getElementById("lookupWordInput");
const lookupInlineBtn    = document.getElementById("lookupInlineBtn");
const lookupInlineStatus = document.getElementById("lookupInlineStatus");

// DOM elements — tabs
const tabBtns   = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

// ---------- Tab Switching ----------

function switchTab(targetId) {
  tabBtns.forEach((btn) => {
    const active = btn.dataset.tab === targetId;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", String(active));
  });
  tabPanels.forEach((panel) => {
    panel.classList.toggle("hidden", panel.id !== "tab-" + targetId);
  });
}

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

// ---------- Custom Language Input ----------

// Load any previously saved custom languages into the dropdown right away
loadCustomLanguages().forEach(addLanguageToDropdown);

function showCustomLanguageInput(value) {
  languageCustomInput.value = value || "";
  languageCustomInput.classList.remove("hidden");
  languageCustomInput.focus();
}

function hideCustomLanguageInput() {
  languageCustomInput.classList.add("hidden");
  languageCustomInput.value = "";
}

function revertToLanguageSelect() {
  hideCustomLanguageInput();
  languageSelect.value = "";
}

function getLanguageValue() {
  if (languageSelect.value === "Other") {
    return languageCustomInput.value.trim();
  }
  return languageSelect.value;
}

languageSelect.addEventListener("change", () => {
  if (languageSelect.value === "Other") {
    showCustomLanguageInput("");
  } else {
    hideCustomLanguageInput();
  }
});

// When the user moves away from the custom input, commit the typed value
// into the dropdown so the extra field disappears and the select shows the language.
languageCustomInput.addEventListener("blur", () => {
  const val = languageCustomInput.value.trim();
  if (val) {
    addLanguageToDropdown(val);
    languageSelect.value = val;
    hideCustomLanguageInput();
  } else {
    languageSelect.value = "";
  }
});

// ---------- Word Lookup Row Visibility ----------

function updateWordLookupVisibility() {
  const category = categorySelect.value;
  const isVocab  = category === "Vocabulary";
  const hasCategory = category !== "";

  wordLookupRow.classList.toggle("hidden", !isVocab);
  titleRow.classList.toggle("hidden", !hasCategory || isVocab);

  if (!isVocab) {
    lookupWordInput.value = "";
    hideLookupStatus();
  }
  if (isVocab) {
    titleInput.value = "";
  }
}

function showLookupStatus(type, message) {
  lookupInlineStatus.hidden = false;
  lookupInlineStatus.className = "lookup-inline-status is-" + type;
  lookupInlineStatus.innerHTML =
    type === "loading"
      ? '<span class="spinner"></span>' + message
      : message;
}

function hideLookupStatus() {
  lookupInlineStatus.hidden = true;
  lookupInlineStatus.className = "lookup-inline-status";
  lookupInlineStatus.innerHTML = "";
}

categorySelect.addEventListener("change", updateWordLookupVisibility);
updateWordLookupVisibility();

// ---------- Inline Vocabulary Lookup ----------

lookupInlineBtn.addEventListener("click", async () => {
  const word     = lookupWordInput.value.trim();
  const language = getLanguageValue();

  if (!word) { lookupWordInput.focus(); showLookupStatus("error", "Please enter a word first."); return; }
  if (!language) { languageSelect.focus(); showLookupStatus("error", "Please select a language first."); return; }

  showLookupStatus("loading", "Looking up…");
  lookupInlineBtn.disabled = true;

  try {
    const resp = await fetch("/language-learning/api/vocabulary-lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word, language }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      showLookupStatus("error", data.error || "Something went wrong. Try again.");
      return;
    }

    const examples = (data.examples || []).map((ex, i) => `${i + 1}. ${ex}`).join("\n");
    noteContent.value =
      `Word: ${data.word}\n` +
      `Definition: ${data.definition}\n\n` +
      `Examples:\n${examples}`;

    showLookupStatus("success", "Definition added — review and save.");
    noteContent.focus();
  } catch {
    showLookupStatus("error", "Network error. Please try again.");
  } finally {
    lookupInlineBtn.disabled = false;
  }
});

lookupWordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); lookupInlineBtn.click(); }
});

// ---------- Rendering ----------

function renderNotes() {
  notesContainer.innerHTML = "";
  const filtered = getFilteredNotes();

  if (filtered.length === 0) {
    const div = document.createElement("div");
    div.className = "empty-state";
    div.textContent = "No notes to display. Add a note or adjust your filters/search.";
    notesContainer.appendChild(div);
    return;
  }

  // Group as { language: { category: [notes...] } }
  const grouped = {};
  filtered.forEach((note) => {
    if (!grouped[note.language]) grouped[note.language] = {};
    if (!grouped[note.language][note.category]) grouped[note.language][note.category] = [];
    grouped[note.language][note.category].push(note);
  });

  Object.keys(grouped).sort((a, b) => a.localeCompare(b)).forEach((language) => {
    const langSection = document.createElement("div");
    langSection.className = "language-section";

    const langHeader = document.createElement("div");
    langHeader.className = "section-header";
    langHeader.innerHTML = `
      <div class="section-header-title">
        <span class="section-chevron">▾</span>
        <span>${language}</span>
      </div>
      <span class="section-badge">${countNotes(grouped[language])} notes</span>
    `;
    langSection.appendChild(langHeader);

    const langBody = document.createElement("div");
    langBody.className = "section-body";

    langHeader.addEventListener("click", () => {
      const chevron = langHeader.querySelector(".section-chevron");
      const hidden = langBody.style.display === "none";
      langBody.style.display = hidden ? "block" : "none";
      chevron.textContent = hidden ? "▾" : "▸";
    });

    Object.keys(grouped[language]).sort((a, b) => a.localeCompare(b)).forEach((category) => {
      const catSection = document.createElement("div");
      catSection.className = "category-section";

      const catHeader = document.createElement("div");
      catHeader.className = "section-header";
      const catClass = "category-" + category.replace(" ", "\\ ");
      catHeader.innerHTML = `
        <div class="section-header-title">
          <span class="section-chevron">▾</span>
          <span class="category-pill ${catClass}">${category}</span>
        </div>
        <span class="section-badge">${grouped[language][category].length} notes</span>
      `;
      catSection.appendChild(catHeader);

      const catBody = document.createElement("div");
      catBody.className = "section-body";

      catHeader.addEventListener("click", () => {
        const chevron = catHeader.querySelector(".section-chevron");
        const hidden = catBody.style.display === "none";
        catBody.style.display = hidden ? "block" : "none";
        chevron.textContent = hidden ? "▾" : "▸";
      });

      grouped[language][category].forEach((note) => {
        const noteDiv = document.createElement("div");
        noteDiv.className = "note-item";
        noteDiv.dataset.id = note.id;

        if (note.title) {
          const titleDiv = document.createElement("div");
          titleDiv.className = "note-title";
          titleDiv.textContent = note.title;
          noteDiv.appendChild(titleDiv);
        }

        const contentDiv = document.createElement("div");
        contentDiv.className = "note-content";
        contentDiv.textContent = note.content;
        noteDiv.appendChild(contentDiv);

        const metaDiv = document.createElement("div");
        metaDiv.className = "note-meta";

        const tagsDiv = document.createElement("div");
        tagsDiv.className = "note-tags";
        if (note.tags && note.tags.length) {
          note.tags.forEach((tag) => {
            const span = document.createElement("span");
            span.className = "tag";
            span.textContent = tag;
            tagsDiv.appendChild(span);
          });
        }

        const actionsDiv = document.createElement("div");
        actionsDiv.className = "note-actions";

        const editBtn = document.createElement("button");
        editBtn.className = "btn ghost";
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => beginEdit(note.id));

        const delBtn = document.createElement("button");
        delBtn.className = "btn secondary";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => deleteNote(note.id));

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(delBtn);
        metaDiv.appendChild(tagsDiv);
        metaDiv.appendChild(actionsDiv);
        noteDiv.appendChild(metaDiv);
        catBody.appendChild(noteDiv);
      });

      catSection.appendChild(catBody);
      langBody.appendChild(catSection);
    });

    langSection.appendChild(langBody);
    notesContainer.appendChild(langSection);
  });
}

function countNotes(categoryMap) {
  return Object.values(categoryMap).reduce((sum, arr) => sum + arr.length, 0);
}

function getFilteredNotes() {
  const searchText = searchInput.value.trim().toLowerCase();
  const langFilter = filterLanguage.value;
  const catFilter  = filterCategory.value;

  return notes.filter((note) => {
    if (langFilter && note.language !== langFilter) return false;
    if (catFilter  && note.category !== catFilter)  return false;
    if (!searchText) return true;
    const haystack = [note.language, note.category, note.content, ...(note.tags || [])]
      .join(" ").toLowerCase();
    return haystack.includes(searchText);
  });
}

// ---------- CRUD ----------

function resetForm(keepLanguage = false) {
  const savedLanguage = keepLanguage ? languageSelect.value : "";
  noteIdInput.value = "";
  noteForm.reset();
  revertToLanguageSelect();
  if (savedLanguage) languageSelect.value = savedLanguage;
  categorySelect.value = "";
  titleInput.value = "";
  saveNoteBtn.textContent = "Add Note";
  cancelEditBtn.style.display = "none";
  lookupWordInput.value = "";
  hideLookupStatus();
  updateWordLookupVisibility();
}

function addNote(data) {
  notes.push({
    id: nextId++,
    language: data.language,
    category: data.category,
    title: data.title,
    content: data.content,
    tags: data.tags,
    createdAt: new Date(),
  });
  saveToStorage();
}

function updateNote(id, data) {
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return;
  Object.assign(notes[idx], {
    language: data.language,
    category: data.category,
    title: data.title,
    content: data.content,
    tags: data.tags,
  });
  saveToStorage();
}

function deleteNote(id) {
  notes = notes.filter((n) => n.id !== id);
  saveToStorage();
  if (noteIdInput.value && parseInt(noteIdInput.value, 10) === id) resetForm();
  renderNotes();
}

function beginEdit(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) return;
  noteIdInput.value    = note.id;
  // Restore language — use custom input for non-standard languages
  if (KNOWN_LANGUAGES.has(note.language)) {
    hideCustomLanguageInput();
    languageSelect.value = note.language;
  } else {
    languageSelect.value = "Other";
    showCustomLanguageInput(note.language);
  }
  categorySelect.value  = note.category;
  noteContent.value     = note.content;
  tagsInput.value       = note.tags.join(", ");
  saveNoteBtn.textContent = "Save Changes";
  cancelEditBtn.style.display = "inline-flex";
  hideLookupStatus();
  updateWordLookupVisibility();
  // Restore title into the right field
  if (note.category === "Vocabulary") {
    lookupWordInput.value = note.title || "";
  } else {
    titleInput.value = note.title || "";
    lookupWordInput.value = "";
  }
  // Switch to Add/Edit tab and scroll to form
  switchTab("add-note");
  noteForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---------- Form Submit ----------

noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const language = getLanguageValue();
  const category = categorySelect.value;
  const content  = noteContent.value.trim();
  const tags     = parseTags(tagsInput.value);
  // For Vocabulary, title comes from the word input; otherwise from the title input
  const title    = category === "Vocabulary"
    ? lookupWordInput.value.trim()
    : titleInput.value.trim();

  if (!language || !category || !content) return;

  // Persist any custom language so it appears in the dropdown next time
  persistCustomLanguage(language);

  const existingId = noteIdInput.value ? parseInt(noteIdInput.value, 10) : null;
  if (existingId) { updateNote(existingId, { language, category, title, content, tags }); }
  else            { addNote({ language, category, title, content, tags }); }

  resetForm(true);
  renderNotes();
});

cancelEditBtn.addEventListener("click", () => resetForm(false));

// ---------- Filters ----------

[searchInput, filterLanguage, filterCategory].forEach((el) =>
  el.addEventListener("input", renderNotes)
);

// ---------- Utility ----------

function parseTags(input) {
  if (!input) return [];
  return input.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
}

function formatDateForExport(date) {
  return date.toISOString();
}

// ---------- Export ----------

function exportAsCsv(notesToExport, filename) {
  if (!notesToExport.length) { alert("There are no notes to export."); return; }
  const header = ["id", "language", "category", "title", "tags", "content", "createdAt"];
  const rows = [header, ...notesToExport.map((note) => {
    const row = [
      note.id, note.language, note.category,
      note.title || "",
      note.tags.join("; "),
      note.content.replace(/\r?\n/g, "\\n"),
      formatDateForExport(note.createdAt),
    ];
    return row.map((field) => {
      const s = String(field);
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(",");
  })];
  download(rows.join("\n"), filename, "text/csv;charset=utf-8");
}

exportAllBtn.addEventListener("click", () => {
  exportAsCsv(notes, "language-notes-all.csv");
});

exportSelectionBtn.addEventListener("click", () => {
  const filtered = getFilteredNotes();
  if (!filtered.length) { alert("No notes match the current filters."); return; }
  exportAsCsv(filtered, "language-notes-selection.csv");
});

function download(content, filename, type) {
  const blob = new Blob([content], { type });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ---------- Initial Render ----------

renderNotes();
