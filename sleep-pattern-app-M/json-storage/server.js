const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app       = express();
const PORT      = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Ensure data file exists on first run
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify({ user: null, entries: [], pendingAlert: null }, null, 2),
  );
}

app.use(express.json());
app.use(express.static(__dirname));   // serves index.html, styles.css, src/

// ── GET /api/data  — load all persisted state
app.get('/api/data', (_req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
  } catch {
    res.json({ user: null, entries: [], pendingAlert: null });
  }
});

// ── POST /api/data  — persist full state snapshot
app.post('/api/data', (req, res) => {
  try {
    const allowed = ['user', 'entries', 'pendingAlert'];
    const safe = {};
    allowed.forEach(k => { safe[k] = req.body[k] ?? null; });
    fs.writeFileSync(DATA_FILE, JSON.stringify(safe, null, 2));
    res.json({ ok: true });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Failed to save data.' });
  }
});

app.listen(PORT, () => {
  console.log(`Sleep Tracker → http://localhost:${PORT}`);
});
