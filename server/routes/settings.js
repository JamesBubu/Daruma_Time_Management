import express from 'express';
import { readFileSync, writeFileSync, accessSync, mkdirSync, constants } from 'fs';
import { dirname, isAbsolute } from 'path';
import { readSettings, writeSettings, getDataPaths, DATA_DIR, SETTINGS_PATH } from '../lib/config.js';

const router = express.Router();

// GET settings
router.get('/settings', (req, res) => {
  try {
    const settings = readSettings();
    const paths = getDataPaths();
    res.json({ settings, resolvedPaths: paths });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read settings' });
  }
});

// PUT settings
router.put('/settings', (req, res) => {
  try {
    const current = readSettings();
    const updated = {
      ...current,
      paths: { ...current.paths, ...(req.body.paths || {}) },
      agent: { ...current.agent, ...(req.body.agent || {}) }
    };
    writeSettings(updated);
    const paths = getDataPaths();
    res.json({ settings: updated, resolvedPaths: paths });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// POST /settings/test-path — verify a file path is usable
router.post('/settings/test-path', (req, res) => {
  const { path: filePath } = req.body;
  if (!filePath) return res.status(400).json({ error: 'path is required' });
  if (!isAbsolute(filePath)) return res.status(400).json({ error: 'Path must be absolute (start with /)' });

  try {
    // Check if directory exists
    const dir = dirname(filePath);
    try { accessSync(dir, constants.W_OK); } catch {
      return res.status(400).json({ error: `Directory does not exist or is not writable: ${dir}` });
    }

    // Try reading the file if it exists
    try {
      accessSync(filePath, constants.R_OK);
      const content = readFileSync(filePath, 'utf-8');
      JSON.parse(content); // validate JSON
      res.json({ ok: true, message: 'File exists and is valid JSON' });
    } catch (readErr) {
      if (readErr.code === 'ENOENT') {
        // File doesn't exist — check if we can write to the dir
        res.json({ ok: true, message: 'File does not exist yet — will be created on first use' });
      } else {
        res.status(400).json({ error: `File exists but is not valid JSON: ${readErr.message}` });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /settings/reset-paths — reset all paths to defaults
router.post('/settings/reset-paths', (req, res) => {
  try {
    const current = readSettings();
    const updated = { ...current, paths: { tasks: '', notes: '', agents: '' } };
    writeSettings(updated);
    const paths = getDataPaths();
    res.json({ settings: updated, resolvedPaths: paths });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset paths' });
  }
});

export default router;
