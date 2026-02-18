import express from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { getDataPaths } from '../lib/config.js';

const router = express.Router();

function readData() {
  const { tasks } = getDataPaths();
  return JSON.parse(readFileSync(tasks, 'utf-8'));
}

function writeData(data) {
  const { tasks } = getDataPaths();
  writeFileSync(tasks, JSON.stringify(data, null, 2));
}

function generateNextId(tasks) {
  let maxNum = 0;
  for (const task of tasks) {
    const match = task.id.match(/^daruma-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  return `daruma-${String(maxNum + 1).padStart(5, '0')}`;
}

router.get('/tasks', (req, res) => {
  try { res.json(readData().tasks); }
  catch { res.status(500).json({ error: 'Failed to fetch tasks' }); }
});

router.get('/tasks/:id', (req, res) => {
  try {
    const task = readData().tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch { res.status(500).json({ error: 'Failed to fetch task' }); }
});

router.post('/tasks', (req, res) => {
  try {
    const data = readData();
    const newTask = {
      id: generateNextId(data.tasks),
      title: req.body.title,
      description: req.body.description || '',
      priority: req.body.priority || 'medium',
      status: req.body.status || 'todo',
      startDate: req.body.startDate || new Date().toISOString(),
      endDate: req.body.endDate || new Date().toISOString(),
      tags: req.body.tags || [],
      linkedNotes: req.body.linkedNotes || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.tasks.push(newTask);
    writeData(data);
    res.status(201).json(newTask);
  } catch { res.status(500).json({ error: 'Failed to create task' }); }
});

router.put('/tasks/:id', (req, res) => {
  try {
    const data = readData();
    const index = data.tasks.findIndex(t => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Task not found' });
    data.tasks[index] = { ...data.tasks[index], ...req.body, id: req.params.id, updatedAt: new Date().toISOString() };
    writeData(data);
    res.json(data.tasks[index]);
  } catch { res.status(500).json({ error: 'Failed to update task' }); }
});

router.delete('/tasks/:id', (req, res) => {
  try {
    const data = readData();
    const index = data.tasks.findIndex(t => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Task not found' });
    data.tasks.splice(index, 1);
    writeData(data);
    res.status(204).send();
  } catch { res.status(500).json({ error: 'Failed to delete task' }); }
});

router.get('/tags', (req, res) => {
  try { res.json(readData().tags); }
  catch { res.status(500).json({ error: 'Failed to fetch tags' }); }
});

router.post('/tags', (req, res) => {
  try {
    const data = readData();
    const { tag } = req.body;
    if (!tag) return res.status(400).json({ error: 'Tag is required' });
    if (data.tags.includes(tag)) return res.status(400).json({ error: 'Tag already exists' });
    data.tags.push(tag);
    writeData(data);
    res.status(201).json(data.tags);
  } catch { res.status(500).json({ error: 'Failed to create tag' }); }
});

export default router;
