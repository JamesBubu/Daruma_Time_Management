import express from 'express';
import { readdirSync, readFileSync, writeFileSync, unlinkSync, mkdirSync, existsSync, renameSync } from 'fs';
import { join } from 'path';
import { getDataPaths, getNotesDir } from '../lib/config.js';

const router = express.Router();

// ─── Frontmatter helpers ─────────────────────────────────────────────────────

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };
  const meta = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim();
    if (val.startsWith('[')) {
      try { meta[key] = JSON.parse(val); } catch { meta[key] = []; }
    } else {
      meta[key] = val;
    }
  }
  return { meta, content: match[2] };
}

function stringifyFrontmatter(meta, content) {
  const lines = Object.entries(meta).map(([k, v]) =>
    Array.isArray(v) ? `${k}: ${JSON.stringify(v)}` : `${k}: ${v}`
  );
  return `---\n${lines.join('\n')}\n---\n${content}`;
}

// ─── Directory + file helpers ─────────────────────────────────────────────────

function notesDir() {
  const dir = getNotesDir();
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

function noteFilePath(dir, id) {
  return join(dir, `${id}.md`);
}

function readNote(id) {
  const path = noteFilePath(notesDir(), id);
  if (!existsSync(path)) return null;
  const { meta, content } = parseFrontmatter(readFileSync(path, 'utf-8'));
  return {
    id: meta.id || id,
    title: meta.title || '',
    content,
    linkedTasks: meta.linkedTasks || [],
    createdAt: meta.createdAt || '',
    updatedAt: meta.updatedAt || ''
  };
}

function writeNote(note) {
  const dir = notesDir();
  const { id, title, linkedTasks, createdAt, updatedAt, content } = note;
  writeFileSync(
    noteFilePath(dir, id),
    stringifyFrontmatter({ id, title, linkedTasks, createdAt, updatedAt }, content || ''),
    'utf-8'
  );
}

function readAllNotes() {
  migrateFromJson(); // one-time migration if old notes.json exists
  const dir = notesDir();
  const files = readdirSync(dir).filter(f => f.endsWith('.md'));
  return files
    .map(f => readNote(f.replace(/\.md$/, '')))
    .filter(Boolean)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function generateNextId() {
  const dir = notesDir();
  const files = readdirSync(dir).filter(f => f.endsWith('.md'));
  let max = 0;
  for (const f of files) {
    const m = f.match(/^note-(\d+)\.md$/);
    if (m) { const n = parseInt(m[1], 10); if (n > max) max = n; }
  }
  return `note-${String(max + 1).padStart(5, '0')}`;
}

// ─── One-time migration from old notes.json ───────────────────────────────────

function migrateFromJson() {
  const oldPath = getDataPaths().notesLegacy;
  if (!oldPath || !existsSync(oldPath)) return;
  try {
    const data = JSON.parse(readFileSync(oldPath, 'utf-8'));
    const notes = data.notes || [];
    if (notes.length > 0) {
      const dir = notesDir();
      for (const note of notes) writeNote(note);
      renameSync(oldPath, oldPath + '.migrated');
      console.log(`[notes] Migrated ${notes.length} notes from JSON to Markdown files.`);
    } else {
      renameSync(oldPath, oldPath + '.migrated');
    }
  } catch (err) {
    console.warn('[notes] Migration from notes.json failed:', err.message);
  }
}

// ─── Task helpers (for bidirectional links) ───────────────────────────────────

function readTasks() {
  return JSON.parse(readFileSync(getDataPaths().tasks, 'utf-8'));
}
function writeTasks(data) {
  writeFileSync(getDataPaths().tasks, JSON.stringify(data, null, 2));
}

// ─── Routes ───────────────────────────────────────────────────────────────────

router.get('/notes', (req, res) => {
  try { res.json(readAllNotes()); }
  catch (err) { res.status(500).json({ error: 'Failed to fetch notes' }); }
});

router.get('/notes/:id', (req, res) => {
  try {
    const note = readNote(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch note' }); }
});

router.post('/notes', (req, res) => {
  try {
    const now = new Date().toISOString();
    const newNote = {
      id: generateNextId(),
      title: req.body.title || 'New Note',
      content: req.body.content || '',
      linkedTasks: req.body.linkedTasks || [],
      createdAt: now,
      updatedAt: now
    };
    writeNote(newNote);
    res.status(201).json(newNote);
  } catch (err) { res.status(500).json({ error: 'Failed to create note' }); }
});

router.put('/notes/:id', (req, res) => {
  try {
    const existing = readNote(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Note not found' });
    const updated = {
      ...existing,
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    writeNote(updated);
    res.json(updated);
  } catch (err) { res.status(500).json({ error: 'Failed to update note' }); }
});

router.delete('/notes/:id', (req, res) => {
  try {
    const note = readNote(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    // Remove backlinks from tasks
    if (note.linkedTasks?.length > 0) {
      const taskData = readTasks();
      for (const taskId of note.linkedTasks) {
        const task = taskData.tasks.find(t => t.id === taskId);
        if (task) {
          task.linkedNotes = (task.linkedNotes || []).filter(nid => nid !== req.params.id);
          task.updatedAt = new Date().toISOString();
        }
      }
      writeTasks(taskData);
    }

    unlinkSync(noteFilePath(notesDir(), req.params.id));
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: 'Failed to delete note' }); }
});

router.post('/notes/:id/link-task', (req, res) => {
  try {
    const { taskId } = req.body;
    if (!taskId) return res.status(400).json({ error: 'taskId is required' });

    const note = readNote(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    const taskData = readTasks();
    const task = taskData.tasks.find(t => t.id === taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (!note.linkedTasks.includes(taskId)) {
      note.linkedTasks.push(taskId);
      note.updatedAt = new Date().toISOString();
      writeNote(note);
    }
    if (!task.linkedNotes) task.linkedNotes = [];
    if (!task.linkedNotes.includes(req.params.id)) {
      task.linkedNotes.push(req.params.id);
      task.updatedAt = new Date().toISOString();
      writeTasks(taskData);
    }

    res.json(note);
  } catch (err) { res.status(500).json({ error: 'Failed to link task' }); }
});

router.delete('/notes/:id/link-task/:taskId', (req, res) => {
  try {
    const { id: noteId, taskId } = req.params;

    const note = readNote(noteId);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    note.linkedTasks = (note.linkedTasks || []).filter(tid => tid !== taskId);
    note.updatedAt = new Date().toISOString();
    writeNote(note);

    const taskData = readTasks();
    const task = taskData.tasks.find(t => t.id === taskId);
    if (task) {
      task.linkedNotes = (task.linkedNotes || []).filter(nid => nid !== noteId);
      task.updatedAt = new Date().toISOString();
      writeTasks(taskData);
    }

    res.json(note);
  } catch (err) { res.status(500).json({ error: 'Failed to unlink task' }); }
});

export default router;
