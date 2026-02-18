import express from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { getDataPaths } from '../lib/config.js';

const router = express.Router();

function readNotes() {
  return JSON.parse(readFileSync(getDataPaths().notes, 'utf-8'));
}
function writeNotes(data) {
  writeFileSync(getDataPaths().notes, JSON.stringify(data, null, 2));
}
function readTasks() {
  return JSON.parse(readFileSync(getDataPaths().tasks, 'utf-8'));
}
function writeTasks(data) {
  writeFileSync(getDataPaths().tasks, JSON.stringify(data, null, 2));
}

function generateNextId(notes) {
  let maxNum = 0;
  for (const note of notes) {
    const match = note.id.match(/^note-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  return `note-${String(maxNum + 1).padStart(5, '0')}`;
}

router.get('/notes', (req, res) => {
  try { res.json(readNotes().notes); }
  catch { res.status(500).json({ error: 'Failed to fetch notes' }); }
});

router.get('/notes/:id', (req, res) => {
  try {
    const note = readNotes().notes.find(n => n.id === req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch { res.status(500).json({ error: 'Failed to fetch note' }); }
});

router.post('/notes', (req, res) => {
  try {
    const data = readNotes();
    const newNote = {
      id: generateNextId(data.notes),
      title: req.body.title || 'New Note',
      content: req.body.content || '',
      linkedTasks: req.body.linkedTasks || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.notes.push(newNote);
    writeNotes(data);
    res.status(201).json(newNote);
  } catch { res.status(500).json({ error: 'Failed to create note' }); }
});

router.put('/notes/:id', (req, res) => {
  try {
    const data = readNotes();
    const index = data.notes.findIndex(n => n.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Note not found' });
    data.notes[index] = { ...data.notes[index], ...req.body, id: req.params.id, updatedAt: new Date().toISOString() };
    writeNotes(data);
    res.json(data.notes[index]);
  } catch { res.status(500).json({ error: 'Failed to update note' }); }
});

router.delete('/notes/:id', (req, res) => {
  try {
    const noteData = readNotes();
    const noteIndex = noteData.notes.findIndex(n => n.id === req.params.id);
    if (noteIndex === -1) return res.status(404).json({ error: 'Note not found' });
    const note = noteData.notes[noteIndex];

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

    noteData.notes.splice(noteIndex, 1);
    writeNotes(noteData);
    res.status(204).send();
  } catch { res.status(500).json({ error: 'Failed to delete note' }); }
});

router.post('/notes/:id/link-task', (req, res) => {
  try {
    const { taskId } = req.body;
    if (!taskId) return res.status(400).json({ error: 'taskId is required' });

    const noteData = readNotes();
    const noteIndex = noteData.notes.findIndex(n => n.id === req.params.id);
    if (noteIndex === -1) return res.status(404).json({ error: 'Note not found' });

    const taskData = readTasks();
    const taskIndex = taskData.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });

    if (!noteData.notes[noteIndex].linkedTasks.includes(taskId)) {
      noteData.notes[noteIndex].linkedTasks.push(taskId);
      noteData.notes[noteIndex].updatedAt = new Date().toISOString();
      writeNotes(noteData);
    }
    if (!taskData.tasks[taskIndex].linkedNotes) taskData.tasks[taskIndex].linkedNotes = [];
    if (!taskData.tasks[taskIndex].linkedNotes.includes(req.params.id)) {
      taskData.tasks[taskIndex].linkedNotes.push(req.params.id);
      taskData.tasks[taskIndex].updatedAt = new Date().toISOString();
      writeTasks(taskData);
    }

    res.json(noteData.notes[noteIndex]);
  } catch { res.status(500).json({ error: 'Failed to link task' }); }
});

router.delete('/notes/:id/link-task/:taskId', (req, res) => {
  try {
    const { id: noteId, taskId } = req.params;

    const noteData = readNotes();
    const noteIndex = noteData.notes.findIndex(n => n.id === noteId);
    if (noteIndex === -1) return res.status(404).json({ error: 'Note not found' });

    noteData.notes[noteIndex].linkedTasks = (noteData.notes[noteIndex].linkedTasks || []).filter(tid => tid !== taskId);
    noteData.notes[noteIndex].updatedAt = new Date().toISOString();
    writeNotes(noteData);

    const taskData = readTasks();
    const task = taskData.tasks.find(t => t.id === taskId);
    if (task) {
      task.linkedNotes = (task.linkedNotes || []).filter(nid => nid !== noteId);
      task.updatedAt = new Date().toISOString();
      writeTasks(taskData);
    }

    res.json(noteData.notes[noteIndex]);
  } catch { res.status(500).json({ error: 'Failed to unlink task' }); }
});

export default router;
