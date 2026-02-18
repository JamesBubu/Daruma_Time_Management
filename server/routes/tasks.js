import express from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = join(__dirname, '../data/tasks.json');

// Helper functions
function readData() {
  const data = readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
}

function writeData(data) {
  writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// Generate next task ID in format "daruma-00001"
function generateNextId(tasks) {
  let maxNum = 0;
  for (const task of tasks) {
    const match = task.id.match(/^daruma-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  const nextNum = maxNum + 1;
  return `daruma-${String(nextNum).padStart(5, '0')}`;
}

// GET all tasks
router.get('/tasks', (req, res) => {
  try {
    const data = readData();
    res.json(data.tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET single task
router.get('/tasks/:id', (req, res) => {
  try {
    const data = readData();
    const task = data.tasks.find(t => t.id === req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// POST new task
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT update task
router.put('/tasks/:id', (req, res) => {
  try {
    const data = readData();
    const index = data.tasks.findIndex(t => t.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const updatedTask = {
      ...data.tasks[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    data.tasks[index] = updatedTask;
    writeData(data);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE task
router.delete('/tasks/:id', (req, res) => {
  try {
    const data = readData();
    const index = data.tasks.findIndex(t => t.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    data.tasks.splice(index, 1);
    writeData(data);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// GET all tags
router.get('/tags', (req, res) => {
  try {
    const data = readData();
    res.json(data.tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// POST new tag
router.post('/tags', (req, res) => {
  try {
    const data = readData();
    const { tag } = req.body;
    if (!tag) {
      return res.status(400).json({ error: 'Tag is required' });
    }
    if (data.tags.includes(tag)) {
      return res.status(400).json({ error: 'Tag already exists' });
    }
    data.tags.push(tag);
    writeData(data);
    res.status(201).json(data.tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tag' });
  }
});

export default router;
