import express from 'express';
import { readFileSync, writeFileSync, accessSync, statSync, mkdirSync, constants, existsSync } from 'fs';
import { dirname, isAbsolute } from 'path';
import { readSettings, writeSettings, getDataPaths, getNotesDir, DATA_DIR, SETTINGS_PATH } from '../lib/config.js';

const router = express.Router();

function buildResolvedPaths() {
  const paths = getDataPaths();
  return {
    tasks:  paths.tasks,
    notes:  getNotesDir(),
    agents: paths.agents,
  };
}

// GET settings
router.get('/settings', (req, res) => {
  try {
    res.json({ settings: readSettings(), resolvedPaths: buildResolvedPaths() });
  } catch {
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
    res.json({ settings: updated, resolvedPaths: buildResolvedPaths() });
  } catch {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// POST /settings/test-path
// Body: { path, type? }  — type='notes' means test a directory, others test a JSON file
router.post('/settings/test-path', (req, res) => {
  const { path: targetPath, type } = req.body;
  if (!targetPath) return res.status(400).json({ error: 'path is required' });
  if (!isAbsolute(targetPath)) return res.status(400).json({ error: 'Path must be absolute (start with /)' });

  try {
    if (type === 'notes') {
      // Test directory writability
      if (existsSync(targetPath)) {
        let stat;
        try { stat = statSync(targetPath); } catch (e) {
          return res.status(400).json({ error: `Cannot access path: ${e.message}` });
        }
        if (!stat.isDirectory()) {
          return res.status(400).json({ error: 'Path exists but is not a directory' });
        }
        try { accessSync(targetPath, constants.W_OK); }
        catch { return res.status(400).json({ error: 'Directory is not writable' }); }
        return res.json({ ok: true, message: 'Directory exists and is writable' });
      } else {
        // Check parent is writable
        const parent = dirname(targetPath);
        try { accessSync(parent, constants.W_OK); }
        catch { return res.status(400).json({ error: `Parent directory does not exist or is not writable: ${parent}` }); }
        return res.json({ ok: true, message: 'Directory does not exist yet — will be created on first use' });
      }
    } else {
      // Test JSON file path
      const dir = dirname(targetPath);
      try { accessSync(dir, constants.W_OK); } catch {
        return res.status(400).json({ error: `Directory does not exist or is not writable: ${dir}` });
      }
      try {
        accessSync(targetPath, constants.R_OK);
        const content = readFileSync(targetPath, 'utf-8');
        JSON.parse(content);
        return res.json({ ok: true, message: 'File exists and is valid JSON' });
      } catch (readErr) {
        if (readErr.code === 'ENOENT') {
          return res.json({ ok: true, message: 'File does not exist yet — will be created on first use' });
        }
        return res.status(400).json({ error: `File exists but is not valid JSON: ${readErr.message}` });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /settings/reset-paths
router.post('/settings/reset-paths', (req, res) => {
  try {
    const current = readSettings();
    const updated = { ...current, paths: { tasks: '', notes: '', agents: '' } };
    writeSettings(updated);
    res.json({ settings: updated, resolvedPaths: buildResolvedPaths() });
  } catch {
    res.status(500).json({ error: 'Failed to reset paths' });
  }
});

export default router;
