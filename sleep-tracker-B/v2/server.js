/**
 * Sleep Tracker — local file-backed server (Phase 2)
 *
 * Run with:  node server.js
 * Then open: http://localhost:3000
 *
 * Data is stored in sleep-data.json in the same folder.
 * No database required — just plain JSON on disk.
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT      = 3000;
const DATA_FILE = path.join(__dirname, 'sleep-data.json');

// ─── File I/O helpers ─────────────────────────────────────────────────────────

/** Read and parse the JSON data file. Returns an array of entry objects. */
function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    // If the file is corrupt, start fresh rather than crashing
    return [];
  }
}

/** Write the entries array to the JSON data file (pretty-printed for readability). */
function writeData(entries) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), 'utf8');
}

// ─── Static file serving ──────────────────────────────────────────────────────

/** Serve a local file (index.html) with the appropriate Content-Type. */
function serveStatic(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' };
    res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
    res.end(data);
  });
}

// ─── JSON response helpers ────────────────────────────────────────────────────

function jsonOK(res, body) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function jsonError(res, status, message) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: message }));
}

/** Read the full request body as a string, then parse as JSON. */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch (e) { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

// ─── Request router ───────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const url    = req.url.split('?')[0]; // ignore query strings
  const method = req.method.toUpperCase();

  // CORS headers so the front-end can call the API freely during development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  try {
    // ── Serve the front-end ──
    if (method === 'GET' && url === '/') {
      return serveStatic(res, path.join(__dirname, 'index.html'));
    }

    // ── GET /entries — return all entries ──
    if (method === 'GET' && url === '/entries') {
      const entries = readData();
      return jsonOK(res, entries);
    }

    // ── POST /entries — add a new entry ──
    if (method === 'POST' && url === '/entries') {
      const body = await parseBody(req);
      const { id, date, bedtime, waketime, hours } = body;

      if (!id || !date || !bedtime || !waketime || hours == null) {
        return jsonError(res, 400, 'Missing required fields.');
      }

      const entries = readData();
      // Prepend so the file is also newest-first (matches UI order)
      entries.unshift({ id, date, bedtime, waketime, hours });
      writeData(entries);
      return jsonOK(res, { ok: true });
    }

    // ── DELETE /entries/:id — remove one entry ──
    if (method === 'DELETE' && url.startsWith('/entries/')) {
      const id = decodeURIComponent(url.replace('/entries/', ''));
      let entries = readData();
      const before = entries.length;
      entries = entries.filter(e => e.id !== id);

      if (entries.length === before) {
        return jsonError(res, 404, 'Entry not found.');
      }

      writeData(entries);
      return jsonOK(res, { ok: true });
    }

    // ── 404 fallback ──
    res.writeHead(404);
    res.end('Not found');

  } catch (err) {
    console.error('Server error:', err);
    jsonError(res, 500, 'Internal server error.');
  }
});

server.listen(PORT, () => {
  console.log(`Sleep Tracker running at http://localhost:${PORT}`);
  console.log(`Data file: ${DATA_FILE}`);
});
