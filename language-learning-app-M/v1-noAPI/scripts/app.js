// In-memory notes storage
// Each note: { id, language, category, content, tags: [..], createdAt }
let notes = [];
let nextId = 1;

// DOM elements
const noteForm = document.getElementById("noteForm");
const noteIdInput = document.getElementById("noteId");
const languageSelect = document.getElementById("languageSelect");
const categorySelect = document.getElementById("categorySelect");
const noteContent = document.getElementById("noteContent");
const tagsInput = document.getElementById("tagsInput");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const notesContainer = document.getElementById("notesContainer");

const searchInput = document.getElementById("searchInput");
const filterLanguage = document.getElementById("filterLanguage");
const filterCategory = document.getElementById("filterCategory");

const exportTxtBtn = document.getElementById("exportTxtBtn");
const exportCsvBtn = document.getElementById("exportCsvBtn");

// ---------- Utility Functions ----------

function parseTags(input) {
  if (!input) return [];
  return input
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

function formatDateForExport(date) {
  return date.toISOString();
}

// ---------- Rendering ----------

function renderNotes() {
  notesContainer.innerHTML = "";

  const filtered = getFilteredNotes();

  if (filtered.length === 0) {
    const div = document.createElement("div");
    div.className = "empty-state";
    div.textContent =
      "No notes to display. Add a note or adjust your filters/search.";
    notesContainer.appendChild(div);
    return;
  }

  // Group notes as { language: { category: [notes...] } }
  const grouped = {};
  filtered.forEach((note) => {
    if (!grouped[note.language]) grouped[note.language] = {};
    if (!grouped[note.language][note.category])
      grouped[note.language][note.category] = [];
    grouped[note.language][note.category].push(note);
  });

  // Render languages
  Object.keys(grouped)
    .sort((a, b) => a.localeCompare(b))
    .forEach((language) => {
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

      // Toggle collapse for language
      langHeader.addEventListener("click", () => {
        const chevron = langHeader.querySelector(".section-chevron");
        const isHidden = langBody.style.display === "none";
        langBody.style.display = isHidden ? "block" : "none";
        chevron.textContent = isHidden ? "▾" : "▸";
      });

      // Render categories within language
      Object.keys(grouped[language])
        .sort((a, b) => a.localeCompare(b))
        .forEach((category) => {
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

          // Toggle collapse for category
          catHeader.addEventListener("click", () => {
            const chevron = catHeader.querySelector(".section-chevron");
            const isHidden = catBody.style.display === "none";
            catBody.style.display = isHidden ? "block" : "none";
            chevron.textContent = isHidden ? "▾" : "▸";
          });

          // Render actual notes
          grouped[language][category].forEach((note) => {
            const noteDiv = document.createElement("div");
            noteDiv.className = "note-item";
            noteDiv.dataset.id = note.id;

            const contentDiv = document.createElement("div");
            contentDiv.className = "note-content";
            contentDiv.textContent = note.content;
            noteDiv.appendChild(contentDiv);

            const metaDiv = document.createElement("div");
            metaDiv.className = "note-meta";

            // Tags
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

            // Actions
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

          if (grouped[language][category].length === 0) {
            const empty = document.createElement("div");
            empty.className = "empty-state";
            empty.textContent = "No notes in this category.";
            catBody.appendChild(empty);
          }

          catSection.appendChild(catBody);
          langBody.appendChild(catSection);
        });

      langSection.appendChild(langBody);
      notesContainer.appendChild(langSection);
    });
}

function countNotes(categoryMap) {
  // categoryMap is { category: [notes] }
  return Object.values(categoryMap).reduce((sum, arr) => sum + arr.length, 0);
}

function getFilteredNotes() {
  const searchText = searchInput.value.trim().toLowerCase();
  const langFilter = filterLanguage.value;
  const catFilter = filterCategory.value;

  return notes.filter((note) => {
    if (langFilter && note.language !== langFilter) return false;
    if (catFilter && note.category !== catFilter) return false;

    if (!searchText) return true;

    const haystack = [
      note.language,
      note.category,
      note.content,
      ...(note.tags || []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(searchText);
  });
}

// ---------- CRUD Operations ----------

function resetForm() {
  noteIdInput.value = "";
  noteForm.reset();
  languageSelect.selectedIndex = 0;
  categorySelect.value = "Vocabulary";
  saveNoteBtn.textContent = "Add Note";
  cancelEditBtn.style.display = "none";
}

function addNote(data) {
  const note = {
    id: nextId++,
    language: data.language,
    category: data.category,
    content: data.content,
    tags: data.tags,
    createdAt: new Date(),
  };
  notes.push(note);
}

function updateNote(id, data) {
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return;
  notes[idx].language = data.language;
  notes[idx].category = data.category;
  notes[idx].content = data.content;
  notes[idx].tags = data.tags;
}

function deleteNote(id) {
  notes = notes.filter((n) => n.id !== id);
  // If we're editing this note, reset form
  if (noteIdInput.value && parseInt(noteIdInput.value, 10) === id) {
    resetForm();
  }
  renderNotes();
}

function beginEdit(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) return;
  noteIdInput.value = note.id;
  languageSelect.value = note.language;
  categorySelect.value = note.category;
  noteContent.value = note.content;
  tagsInput.value = note.tags.join(", ");
  saveNoteBtn.textContent = "Save Changes";
  cancelEditBtn.style.display = "inline-flex";
  // Scroll to form on small screens
  noteForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---------- Event Handlers ----------

noteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const language = languageSelect.value;
  const category = categorySelect.value;
  const content = noteContent.value.trim();
  const tags = parseTags(tagsInput.value);

  if (!language || !category || !content) return;

  const existingId = noteIdInput.value
    ? parseInt(noteIdInput.value, 10)
    : null;

  if (existingId) {
    updateNote(existingId, { language, category, content, tags });
  } else {
    addNote({ language, category, content, tags });
  }

  resetForm();
  renderNotes();
});

cancelEditBtn.addEventListener("click", () => {
  resetForm();
});

// Filters & search
[searchInput, filterLanguage, filterCategory].forEach((el) => {
  el.addEventListener("input", () => {
    renderNotes();
  });
});

// ---------- Export (now uses filtered notes) ----------

exportTxtBtn.addEventListener("click", () => {
  const filtered = getFilteredNotes();
  if (!filtered.length) {
    alert("No notes to export with the current filters.");
    return;
  }

  let lines = [];
  filtered.forEach((note) => {
    const tagsStr = note.tags.join(", ");
    lines.push(
      `Language: ${note.language}\nCategory: ${note.category}\nTags: ${tagsStr}\nNote:\n${note.content}\n---`
    );
  });

  const blob = new Blob([lines.join("\n")], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "language-notes-filtered.txt";
  a.click();
  URL.revokeObjectURL(url);
});

exportCsvBtn.addEventListener("click", () => {
  const filtered = getFilteredNotes();
  if (!filtered.length) {
    alert("No notes to export with the current filters.");
    return;
  }

  const header = ["id", "language", "category", "tags", "content", "createdAt"];
  const rows = [header];

  filtered.forEach((note) => {
    const row = [
      note.id,
      note.language,
      note.category,
      note.tags.join("; "),
      note.content.replace(/\r?\n/g, "\\n"),
      formatDateForExport(note.createdAt),
    ];

    const csvRow = row
      .map((field) => {
        const s = String(field);
        if (/[",\n]/.test(s)) {
          return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
      })
      .join(",");

    rows.push(csvRow);
  });

  const csvContent = rows.join("\n");
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "language-notes-filtered.csv";
  a.click();
  URL.revokeObjectURL(url);
});

// ---------- Initial Render ----------

renderNotes();
